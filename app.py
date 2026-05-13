from flask import Flask, render_template, request, redirect, url_for, session
from models import db, Product, Order, User
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import re

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'aruna_secret_123'

db.init_app(app)

with app.app_context():
    db.create_all()

# ============================================================
# HELPER VALIDASI KONTAK
# ============================================================

def validasi_kontak(kontak):
    """
    Mengembalikan True jika kontak adalah:
    - Nomor WhatsApp: 10-13 digit, boleh diawali 08, +62, atau 62
    - Atau alamat email yang valid
    """
    kontak = kontak.strip()
    # Cek email
    pola_email = r'^[\w\.-]+@[\w\.-]+\.\w{2,}$'
    if re.match(pola_email, kontak):
        return True
    # Cek nomor WA (hapus karakter non-digit dulu)
    nomor = re.sub(r'[\s\-\+]', '', kontak)
    pola_wa = r'^(0|62)\d{9,12}$'
    if re.match(pola_wa, nomor) and 10 <= len(nomor) <= 14:
        return True
    return False

# ============================================================
# ROUTES HALAMAN
# ============================================================

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/product')
def product():
    products = Product.query.all()
    return render_template('product.html', products=products)

@app.route('/order', methods=['GET', 'POST'])
def order():
    products = Product.query.all()
    return render_template('order.html', products=products)

@app.route('/submit-order', methods=['POST'])
def submit_order():
    kategori = request.form.get('kategori')
    produk   = request.form.get('produk')
    jumlah   = request.form.get('jumlah')
    kontak   = request.form.get('kontak', '').strip()

    # Nama diambil otomatis dari session login
    nama = session.get('username', 'Guest')

    if not all([kategori, produk, jumlah, kontak]):
        return redirect(url_for('order'))

    # Validasi kontak
    if not validasi_kontak(kontak):
        return redirect(url_for('order'))

    order_baru = Order(
        user_id      = session.get('user_id'),
        nama_pembeli = nama,
        kategori     = kategori,
        produk       = produk,
        jumlah       = int(jumlah),
        kontak       = kontak,
        tanggal      = datetime.now(),
        status       = 'pending'
    )

    db.session.add(order_baru)
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/cart')
def cart():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    orders = Order.query.filter_by(user_id=session['user_id']).order_by(Order.tanggal.desc()).all()
    return render_template('cart.html', orders=orders)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            session['username'] = user.username
            return redirect(url_for('index'))
        return render_template('login.html', error='Username atau password salah!')
    return render_template('login.html')

@app.route('/register', methods=['POST'])
def register():
    username = request.form.get('username')
    password = request.form.get('password')
    existing = User.query.filter_by(username=username).first()
    if existing:
        return render_template('login.html', error='Username sudah dipakai!', tab='register')
    user_baru = User(
        username = username,
        password = generate_password_hash(password)
    )
    db.session.add(user_baru)
    db.session.commit()
    session['user_id'] = user_baru.id
    session['username'] = user_baru.username
    return redirect(url_for('index'))

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/about')
def about():
    return render_template('about-us.html')

@app.route('/developer')
def developer():
    return render_template('developer.html')

# ============================================================

if __name__ == '__main__':
    app.run(debug=True)