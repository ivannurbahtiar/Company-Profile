from flask import Flask, render_template, request, redirect, url_for
from models import db, Product, Order
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

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
    nama     = request.form.get('nama')
    kategori = request.form.get('kategori')
    produk   = request.form.get('produk')
    jumlah   = request.form.get('jumlah')
    kontak   = request.form.get('kontak')

    # Kalau ada field kosong, kembalikan ke halaman order
    if not all([nama, kategori, produk, jumlah, kontak]):
        return redirect(url_for('order'))

    order_baru = Order(
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

@app.route('/about')
def about():
    return render_template('about-us.html')

@app.route('/cart')
def cart():
    return render_template('cart.html')

@app.route('/developer')
def developer():
    return render_template('developer.html')

# ============================================================

if __name__ == '__main__':
    app.run(debug=True)