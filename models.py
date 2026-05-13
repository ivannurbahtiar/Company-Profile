from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

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
    jumlah       = db.Column(db.Integer, nullable=False)
    kontak       = db.Column(db.String(100), nullable=True)
    tanggal      = db.Column(db.DateTime, default=datetime.now)
    status       = db.Column(db.String(20), default='pending')