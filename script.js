document.addEventListener("DOMContentLoaded", () => {

  // ============================================================
  // 🔥 DATA PRODUK (Dipakai semua halaman)
  // ============================================================

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

  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
  }

  function updateCartBadge() {
    const badge = document.getElementById("cart-count");
    if (!badge) return;

    const cart = getCart();
    const count = cart.reduce((a, b) => a + (b.quantity || 1), 0);

    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  }


  // ============================================================
  // PRODUCT PAGE
  // ============================================================

  const container = document.getElementById("product-container");

  if (container) {
    const categoryButtons = document.querySelectorAll(".prod-btn");

    function renderProducts(cat) {
      container.innerHTML = "";
      productData[cat].forEach((p, i) => {
        container.innerHTML += `
          <div class="product-item" data-category="${cat}" data-index="${i}">
            <img src="./images/${p.img}">
            <h4>${p.name}</h4>
            <p>${p.price}</p>
            <div class="product-buttons">
              <button class="cart-btn">🛒 Keranjang</button>
              <button class="buy-btn">💳 Beli Sekarang</button>
            </div>
          </div>
        `;
      });
    }

    renderProducts("atk");

    categoryButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        categoryButtons.forEach(x => x.classList.remove("active"));
        btn.classList.add("active");
        renderProducts(btn.dataset.category);
      });
    });

    // Keranjang & Buy Now
    container.addEventListener("click", (e) => {
      const card = e.target.closest(".product-item");
      if (!card) return;

      const cat = card.dataset.category;
      const index = card.dataset.index;
      const product = { ...productData[cat][index], category: cat };

      if (e.target.classList.contains("cart-btn")) {
        let cart = getCart();
        const exist = cart.find(i => i.name === product.name);

        if (exist) exist.quantity++;
        else {
          product.quantity = 1;
          cart.push(product);
        }

        saveCart(cart);
        alert(product.name + " ditambahkan ke keranjang!");
      }

      if (e.target.classList.contains("buy-btn")) {
        localStorage.setItem("buyNow", JSON.stringify({
          isSingle: true,
          product: product
        }));
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

  if (closeBtn) {
    closeBtn.addEventListener("click", () => modal.style.display = "none");
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });


  // ============================================================
  // CART PAGE
  // ============================================================

  const cartContainer = document.getElementById("cart-container");
  const totalEl = document.getElementById("cart-total");

  function renderCart() {
    if (!cartContainer) return;

    const cart = getCart();
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Keranjang kosong 😢</p>";
      if (totalEl) totalEl.textContent = "Rp 0";
      return;
    }

    let total = 0;

    cart.forEach((item, index) => {
      let priceNum = parseInt(item.price.replace(/[^0-9]/g, ""));
      let qty = item.quantity || 1;
      total += priceNum * qty;

      cartContainer.innerHTML += `
        <div class="cart-item">
          <img src="./images/${item.img}" alt="">
          <div class="item-info">
            <h4>${item.name}</h4>
            <p>Harga: ${item.price}</p>
            <p>Jumlah: ${qty}</p>
            <div class="cart-actions">
              <button class="buy-now-cart" data-index="${index}">Beli Sekarang</button>
              <button class="remove-btn" data-index="${index}">Hapus</button>
            </div>
          </div>
        </div>
      `;
    });

    totalEl.textContent = "Rp " + total.toLocaleString("id-ID");
  }

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
        localStorage.setItem("buyNow", JSON.stringify({
          isSingle: true,
          product: item
        }));
        cart.splice(e.target.dataset.index, 1);
        saveCart(cart);
        window.location.href = "order.html";
      }
    });
  }

  const clearBtn = document.getElementById("clear-cart");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem("cart");
      renderCart();
      updateCartBadge();
    });
  }

  renderCart();
  updateCartBadge();


  // ============================================================
  // ORDER PAGE AUTO-FILL
  // ============================================================

  const kategori = document.getElementById("kategori");
  const produk = document.getElementById("produk");

  if (kategori && produk) {
    const buyNow = JSON.parse(localStorage.getItem("buyNow"));

    function renderProductsDropdown(cat) {
      produk.innerHTML = `<option value="">-- Pilih Produk --</option>`;
      if (!cat) return;

      productData[cat].forEach(p => {
        produk.innerHTML += `<option value="${p.name}">${p.name}</option>`;
      });
    }

    if (buyNow && buyNow.isSingle) {
      const name = buyNow.product.name;

      for (let cat in productData) {
        if (productData[cat].some(p => p.name === name)) {
          kategori.value = cat;
          renderProductsDropdown(cat);
          produk.value = name;
          break;
        }
      }

      document.querySelector("input[name='jumlah']").value =
        buyNow.product?.quantity || 1;
    }

    kategori.addEventListener("change", () => {
      renderProductsDropdown(kategori.value);
    });

    const form = document.getElementById("orderForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        localStorage.removeItem("buyNow");

        form.reset();
        produk.innerHTML = `<option value="">-- Pilih Produk --</option>`;
        produk.disabled = true;

        document.getElementById("statusMessage").style.display = "block";
      });
    }
  }

// ============================================================
// 📌 HAMBURGER MENU (Kini AMAN & Non-bentrok)
// ============================================================

const hamburger = document.querySelector(".hamburger"); // ⬅️ Pakai .hamburger (class)
const navMenu = document.querySelector("nav");         // ⬅️ Pakai nav (tag)

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  const navLinks = navMenu.querySelectorAll("a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });
}
})
