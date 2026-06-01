from flask import Flask, render_template, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import re

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'aruna_secret_123'

db = SQLAlchemy(app)

# ============================================================
# MODELS
# ============================================================

class User(db.Model):
    __tablename__ = 'users'
    id       = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    orders   = db.relationship('Order', backref='user', lazy=True)

class Product(db.Model):
    __tablename__ = 'products'
    id        = db.Column(db.Integer, primary_key=True)
    nama      = db.Column(db.String(100), nullable=False)
    harga     = db.Column(db.Integer, nullable=False)
    stok      = db.Column(db.Integer, default=0)
    kategori  = db.Column(db.String(50), nullable=False)
    gambar    = db.Column(db.String(200))
    deskripsi = db.Column(db.Text)

class Order(db.Model):
    __tablename__ = 'orders'

    id           = db.Column(db.Integer, primary_key=True)
    user_id      = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    nama_pembeli = db.Column(db.String(100), nullable=False)

    kategori     = db.Column(db.String(50), nullable=False)
    produk       = db.Column(db.String(100), nullable=False)

    harga        = db.Column(db.Integer, default=0)

    jumlah       = db.Column(db.Integer, nullable=False)

    kontak       = db.Column(db.String(100), nullable=True)

    tanggal      = db.Column(db.DateTime, default=datetime.now)

    status       = db.Column(db.String(20), default='pending')

# ============================================================
# SEED DATA
# ============================================================

def seed_products():
    if Product.query.first():
        return  # Kalau sudah ada data, skip

    products = [
        # ATK
        Product(nama="Notebook",        harga=4500,  stok=10, kategori="atk",          gambar="notebook.jpg"),
        Product(nama="Pulpen Karakter", harga=2500,  stok=10, kategori="atk",          gambar="pulpen karakter.jpg"),
        Product(nama="Tempat ATK",      harga=6500,  stok=10, kategori="atk",          gambar="tempatatk.jpg"),
        Product(nama="Penghapus Lucu",  harga=6000,  stok=10, kategori="atk",          gambar="penghapus-lucu.png"),
        Product(nama="Kalkulator Mini", harga=10000, stok=10, kategori="atk",          gambar="kalkulator-mini.jpg"),
        # Aksesoris
        Product(nama="Jepit Rambut",        harga=14000,  stok=10, kategori="aksesoris", gambar="jepit rambut.jpg"),
        Product(nama="Bando Beruang",        harga=9000,   stok=10, kategori="aksesoris", gambar="bando beruang.jpg"),
        Product(nama="Cermin Motif Kucing",  harga=22000,  stok=10, kategori="aksesoris", gambar="cermin motif kucing.jpg"),
        Product(nama="Tas Shopie Martin",    harga=125000, stok=10, kategori="aksesoris", gambar="tas shopie martin.jpg"),
        Product(nama="Kotak Tisu Box",       harga=19000,  stok=10, kategori="aksesoris", gambar="kotak tisu box.jpg"),
        # Perlengkapan Makan
        Product(nama="Tempat Bekal",  harga=68000, stok=10, kategori="perlengkapan", gambar="tempat bekal.jpg"),
        Product(nama="Lunch Box",     harga=50000, stok=10, kategori="perlengkapan", gambar="lunch box set.jpg"),
        Product(nama="Botol Minum",   harga=22000, stok=10, kategori="perlengkapan", gambar="botol minum.jpg"),
        Product(nama="Tempat Makan",  harga=25000, stok=10, kategori="perlengkapan", gambar="tempat makan.jpg"),
        Product(nama="Botol Minum 2", harga=28000, stok=10, kategori="perlengkapan", gambar="botol minum2.jpg"),
        # Make Up
        Product(nama="Cushion Skintific",  harga=90000, stok=10, kategori="makeup", gambar="cushion skintific.jpg"),
        Product(nama="Eyeliner Implora",   harga=14000, stok=10, kategori="makeup", gambar="eyeliner implora.jpg"),
        Product(nama="Bedak Wardah Refil", harga=33000, stok=10, kategori="makeup", gambar="Bedak Wardah Refil.jpg"),
        Product(nama="Liptint Omg",        harga=20000, stok=10, kategori="makeup", gambar="Liptint Omg.jpg"),
        Product(nama="Blush on Pixy",      harga=27000, stok=10, kategori="makeup", gambar="Blush on Pixy .jpg"),
        # Skincare
        Product(nama="Animate 1 Paket",   harga=99000, stok=10, kategori="skincare", gambar="Animate 1 Paket.jpg"),
        Product(nama="Face Wash Kahf",    harga=49000, stok=10, kategori="skincare", gambar="Face Wash Kahf.jpg"),
        Product(nama="Face Wash Scora",   harga=38000, stok=10, kategori="skincare", gambar="Face  Wash Scora.jpg"),
        Product(nama="Sunscreen Azarine", harga=29000, stok=10, kategori="skincare", gambar="Sunscreen azarine.jpg"),
        Product(nama="Moisturizer Scora", harga=38000, stok=10, kategori="skincare", gambar="Moisturizer Scora.jpg"),
    ]

    db.session.add_all(products)
    db.session.commit()
    print("✅ Data produk berhasil dimasukkan!")

# Buat tabel & isi data otomatis saat pertama run
with app.app_context():
    db.create_all()
    seed_products()

# ============================================================
# HELPER VALIDASI KONTAK
# ============================================================

def validasi_kontak(kontak):
    kontak = kontak.strip()
    pola_email = r'^[\w\.-]+@[\w\.-]+\.\w{2,}$'
    if re.match(pola_email, kontak):
        return True
    nomor = re.sub(r'[\s\-\+]', '', kontak)
    pola_wa = r'^(0|62)\d{9,12}$'
    if re.match(pola_wa, nomor) and 10 <= len(nomor) <= 14:
        return True
    return False

# ============================================================
# ROUTES
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

    nama = session.get('username', 'Guest')

    if not all([kategori, produk, jumlah, kontak]):
        return redirect(url_for('order'))

    if not validasi_kontak(kontak):
        return redirect(url_for('order'))

    produk_db = Product.query.filter_by(nama=produk).first()

    if not produk_db:
        return redirect(url_for('order'))

    order_baru = Order(
        user_id=session.get('user_id'),
        nama_pembeli=nama,
        kategori=kategori,
        produk=produk,
        harga=produk_db.harga,
        jumlah=int(jumlah),
        kontak=kontak,
        tanggal=datetime.now(),
        status='pending'
    )

    db.session.add(order_baru)
    db.session.commit()

    return redirect(url_for('cart'))

@app.route('/cart')
def cart():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    orders = Order.query.filter_by(
        user_id=session['user_id']
    ).order_by(Order.tanggal.desc()).all()

    total_belanja = sum(
        order.harga * order.jumlah
        for order in orders
    )

    total_barang = sum(
        order.jumlah
        for order in orders
    )

    return render_template(
        'cart.html',
        orders=orders,
        total_belanja=total_belanja,
        total_barang=total_barang
    )

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