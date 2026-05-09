from app import app
from models import db, Product

with app.app_context():
    # Hapus data lama kalau ada
    Product.query.delete()

    products = [
        # ATK
        Product(nama="Notebook",        harga=4500,  stok=10, kategori="atk",         gambar="notebook.jpg"),
        Product(nama="Pulpen Karakter", harga=2500,  stok=10, kategori="atk",         gambar="pulpen karakter.jpg"),
        Product(nama="Tempat ATK",      harga=6500,  stok=10, kategori="atk",         gambar="tempatatk.jpg"),
        Product(nama="Penghapus Lucu",  harga=6000,  stok=10, kategori="atk",         gambar="penghapus-lucu.png"),
        Product(nama="Kalkulator Mini", harga=10000, stok=10, kategori="atk",         gambar="kalkulator-mini.jpg"),

        # Aksesoris
        Product(nama="Jepit Rambut",        harga=14000,  stok=10, kategori="aksesoris", gambar="jepit rambut.jpg"),
        Product(nama="Bando Beruang",        harga=9000,   stok=10, kategori="aksesoris", gambar="bando beruang.jpg"),
        Product(nama="Cermin Motif Kucing",  harga=22000,  stok=10, kategori="aksesoris", gambar="cermin motif kucing.jpg"),
        Product(nama="Tas Shopie Martin",    harga=125000, stok=10, kategori="aksesoris", gambar="tas shopie martin.jpg"),
        Product(nama="Kotak Tisu Box",       harga=19000,  stok=10, kategori="aksesoris", gambar="kotak tisu box.jpg"),

        # Perlengkapan Makan
        Product(nama="Tempat Bekal", harga=68000, stok=10, kategori="perlengkapan", gambar="tempat bekal.jpg"),
        Product(nama="Lunch Box",    harga=50000, stok=10, kategori="perlengkapan", gambar="lunch box set.jpg"),
        Product(nama="Botol Minum",  harga=22000, stok=10, kategori="perlengkapan", gambar="botol minum.jpg"),
        Product(nama="Tempat Makan", harga=25000, stok=10, kategori="perlengkapan", gambar="tempat makan.jpg"),
        Product(nama="Botol Minum 2",harga=28000, stok=10, kategori="perlengkapan", gambar="botol minum2.jpg"),

        # Make Up
        Product(nama="Cushion Skintific",  harga=90000, stok=10, kategori="makeup", gambar="cushion skintific.jpg"),
        Product(nama="Eyeliner Implora",   harga=14000, stok=10, kategori="makeup", gambar="eyeliner implora.jpg"),
        Product(nama="Bedak Wardah Refil", harga=33000, stok=10, kategori="makeup", gambar="Bedak Wardah Refil.jpg"),
        Product(nama="Liptint Omg",        harga=20000, stok=10, kategori="makeup", gambar="Liptint Omg.jpg"),
        Product(nama="Blush on Pixy",      harga=27000, stok=10, kategori="makeup", gambar="Blush on Pixy .jpg"),

        # Skincare
        Product(nama="Animate 1 Paket",    harga=99000, stok=10, kategori="skincare", gambar="Animate 1 Paket.jpg"),
        Product(nama="Face Wash Kahf",     harga=49000, stok=10, kategori="skincare", gambar="Face Wash Kahf.jpg"),
        Product(nama="Face Wash Scora",    harga=38000, stok=10, kategori="skincare", gambar="Face  Wash Scora.jpg"),
        Product(nama="Sunscreen Azarine",  harga=29000, stok=10, kategori="skincare", gambar="Sunscreen azarine.jpg"),
        Product(nama="Moisturizer Scora",  harga=38000, stok=10, kategori="skincare", gambar="Moisturizer Scora.jpg"),
    ]

    db.session.add_all(products)
    db.session.commit()
    print("✅ Data produk berhasil dimasukkan!")