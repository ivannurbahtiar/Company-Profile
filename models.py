from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# ============================================================
# TABEL PRODUK
# ============================================================
class Product(db.Model):
    __tablename__ = 'products'

    id        = db.Column(db.Integer, primary_key=True)
    nama      = db.Column(db.String(100), nullable=False)
    harga     = db.Column(db.Integer, nullable=False)
    stok      = db.Column(db.Integer, default=0)
    kategori  = db.Column(db.String(50), nullable=False)  # atk, aksesoris, perlengkapan, makeup, skincare
    gambar    = db.Column(db.String(200))                  # nama file gambar, contoh: "notebook.jpg"
    deskripsi = db.Column(db.Text)

    def __repr__(self):
        return f'<Product {self.nama}>'


# ============================================================
# TABEL ORDER
# ============================================================
class Order(db.Model):
    __tablename__ = 'orders'

    id           = db.Column(db.Integer, primary_key=True)
    nama_pembeli = db.Column(db.String(100), nullable=False)
    kategori     = db.Column(db.String(50), nullable=False)
    produk       = db.Column(db.String(100), nullable=False)
    jumlah       = db.Column(db.Integer, nullable=False)
    kontak       = db.Column(db.String(100), nullable=False)
    tanggal      = db.Column(db.DateTime, default=datetime.now)
    status       = db.Column(db.String(20), default='pending')  # pending, proses, selesai

    def __repr__(self):
        return f'<Order {self.nama_pembeli} - {self.produk}>'