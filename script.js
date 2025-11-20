document.addEventListener("DOMContentLoaded", () => {

  const productData = {
    atk: [
      { name: "Notebook", price: "Rp 4500", img: "notebook.jpg" },
      { name: "Pulpen Karakter", price: "Rp 2500", img: "pulpen karakter.jpg" },
      { name: "Tempat ATK", price: "Rp 6500", img: "tempatatk.jpg" },
      { name: "Penghapus Lucu", price: "Rp 6000", img: "penghapus-lucu.png" },
      { name: "Kalkulator Mini", price: "Rp 10000", img: "kalkulator-mini.jpg" },
    ],
    aksesoris: [
      { name: "Jepit Rambut", price: "Rp 14000", img: "jepit rambut.jpg" },
      { name: "Bando Beruang", price: "Rp 9000", img: "bando beruang.jpg" },
      { name: "Cermin Motif Kucing", price: "Rp 22000", img: "cermin motif kucing.jpg" },
      { name: "Tas Shopie Martin", price: "Rp 125000", img: "tas shopie martin.jpg" },
      { name: "Kotak Tisu Box", price: "Rp 19000", img: "kotak tisu box.jpg" },
    ],
    perlengkapan: [
      { name: "Tempat Bekal", price: "Rp 68000", img: "tempat bekal.jpg" },
      { name: "Lunch Box", price: "Rp 50000", img: "lunch box set.jpg" },
      { name: "Botol Minum", price: "Rp 22000", img: "botol minum.jpg" },
      { name: "Tempat Makan", price: "Rp 25000", img: "tempat makan.jpg" },
      { name: "Botol Minum 2", price: "Rp 28000", img: "botol minum2.jpg" },
    ],
    makeup: [
      { name: "Cushion Skintific", price: "Rp 90000", img: "cushion skintific.jpg" },
      { name: "Eyeliner Implora", price: "Rp 14000", img: "eyeliner implora.jpg" },
      { name: "Bedak Wardah Refil", price: "Rp 33000", img: "Bedak Wardah Refil.jpg" },
      { name: "Liptint Omg", price: "Rp 20000", img: "Liptint Omg.jpg" },
      { name: "Blush on Pixy", price: "Rp 27000", img: "Blush on Pixy .jpg" },
    ],
    skincare: [
      { name: "Animate 1 Paket", price: "Rp 99000", img: "Animate 1 Paket.jpg" },
      { name: "Face Wash Kahf", price: "Rp 49000", img: "Face Wash Kahf.jpg" },
      { name: "Face Wash Scora", price: "Rp 38000", img: "Face  Wash Scora.jpg" },
      { name: "Sunscreen Azarine", price: "Rp 29000", img: "Sunscreen azarine.jpg" },
      { name: "Moisturizer Scora", price: "Rp 38000", img: "Moisturizer Scora.jpg" },
    ]
  };

  // ============================================================
  // CART SYSTEM
  // ============================================================

  const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];

  const saveCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
  };

  const updateCartBadge = () => {
    const badge = document.getElementById("cart-count");
    if (!badge) return;

    const count = getCart().reduce((a, b) => a + (b.quantity || 1), 0);
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  };

  // ============================================================
  // PRODUCT PAGE
  // ============================================================

  const productContainer = document.getElementById("product-container");

  const renderProducts = (cat) => {
    productContainer.innerHTML = productData[cat]
      .map((p, i) => `
        <div class="product-item" data-category="${cat}" data-index="${i}">
          <img src="./images/${p.img}">
          <h4>${p.name}</h4>
          <p>${p.price}</p>
          <div class="product-buttons">
            <button class="cart-btn">🛒 Keranjang</button>
            <button class="buy-btn">💳 Beli Sekarang</button>
          </div>
        </div>`)
      .join("");
  };

  if (productContainer) {
    renderProducts("atk");

    document.querySelectorAll(".prod-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".prod-btn").forEach(x => x.classList.remove("active"));
        btn.classList.add("active");
        renderProducts(btn.dataset.category);
      });
    });

    productContainer.addEventListener("click", (e) => {
      const card = e.target.closest(".product-item");
      if (!card) return;

      const { category, index } = card.dataset;
      const product = { ...productData[category][index], category };

      if (e.target.classList.contains("cart-btn")) {
        const cart = getCart();
        const exist = cart.find(i => i.name === product.name);

        exist ? exist.quantity++ : cart.push({ ...product, quantity: 1 });

        saveCart(cart);
        alert(`${product.name} ditambahkan ke keranjang!`);
      }

      if (e.target.classList.contains("buy-btn")) {
        localStorage.setItem("buyNow", JSON.stringify({ isSingle: true, product }));
        window.location.href = "order.html";
      }
    });
  }

  // ============================================================
  // MODAL IMAGE
  // ============================================================

  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImage");
  const closeBtn = document.querySelector(".close");

  document.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG" && e.target.closest(".product-item")) {
      modal.style.display = "flex";
      modalImg.src = e.target.src;
    }
  });

  closeBtn?.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", (e) => e.target === modal && (modal.style.display = "none"));

  // ============================================================
  // CART PAGE
  // ============================================================

  const cartContainer = document.getElementById("cart-container");
  const totalEl = document.getElementById("cart-total");

  const renderCart = () => {
    if (!cartContainer) return;

    const cart = getCart();
    cartContainer.innerHTML = "";

    if (!cart.length) {
      cartContainer.innerHTML = "<p>Keranjang kosong 😢</p>";
      totalEl.textContent = "Rp 0";
      return;
    }

    let total = 0;

    cart.forEach((item, idx) => {
      const price = parseInt(item.price.replace(/[^0-9]/g, ""));
      const qty = item.quantity;
      total += price * qty;

      cartContainer.innerHTML += `
        <div class="cart-item">
          <img src="./images/${item.img}" alt="">
          <div class="item-info">
            <h4>${item.name}</h4>
            <p>Harga: ${item.price}</p>
            <p>Jumlah: ${qty}</p>
            <div class="cart-actions">
              <button class="buy-now-cart" data-index="${idx}">Beli Sekarang</button>
              <button class="remove-btn" data-index="${idx}">Hapus</button>
            </div>
          </div>
        </div>`;
    });

    totalEl.textContent = `Rp ${total.toLocaleString("id-ID")}`;
  };

  if (cartContainer) {
    cartContainer.addEventListener("click", (e) => {
      const cart = getCart();

      if (e.target.classList.contains("remove-btn")) {
        cart.splice(e.target.dataset.index, 1);
        saveCart(cart);
        renderCart();
      }

      if (e.target.classList.contains("buy-now-cart")) {
        const item = cart[e.target.dataset.index];
        localStorage.setItem("buyNow", JSON.stringify({ isSingle: true, product: item }));
        cart.splice(e.target.dataset.index, 1);
        saveCart(cart);
        window.location.href = "order.html";
      }
    });
  }

  document.getElementById("clear-cart")?.addEventListener("click", () => {
    localStorage.removeItem("cart");
    renderCart();
    updateCartBadge();
  });

  renderCart();
  updateCartBadge();

  // ============================================================
  // ORDER PAGE
  // ============================================================

  const kategori = document.getElementById("kategori");
  const produk = document.getElementById("produk");

  const renderProductsDropdown = (cat) => {
    produk.innerHTML = `<option value="">-- Pilih Produk --</option>`;
    if (cat) {
      produk.disabled = false;
      productData[cat].forEach(p => {
        produk.innerHTML += `<option value="${p.name}">${p.name}</option>`;
      });
    } else {
      produk.disabled = true;
    }
  };

  const buyNow = JSON.parse(localStorage.getItem("buyNow"));

  if (kategori && produk && buyNow?.isSingle) {
    const name = buyNow.product.name;

    for (let cat in productData) {
      if (productData[cat].some(p => p.name === name)) {
        kategori.value = cat;
        renderProductsDropdown(cat);
        produk.value = name;
        break;
      }
    }

    document.querySelector("input[name='jumlah']").value = buyNow.product.quantity || 1;
  }

  kategori?.addEventListener("change", () => renderProductsDropdown(kategori.value));

  document.getElementById("orderForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.removeItem("buyNow");

    e.target.reset();
    produk.innerHTML = `<option value="">-- Pilih Produk --</option>`;
    produk.disabled = true;

   alert("Pesanan telah terkirim!");
  });

  // ============================================================
  // HAMBURGER MENU
  // ============================================================

  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("nav");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }
});
