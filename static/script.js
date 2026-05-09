document.addEventListener("DOMContentLoaded", () => {

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
  // PRODUCT PAGE - Filter kategori (show/hide dari Jinja2)
  // ============================================================

  const productContainer = document.getElementById("product-container");

  const filterProducts = (cat) => {
    document.querySelectorAll(".product-card").forEach(card => {
      card.style.display = card.dataset.category === cat ? "block" : "none";
    });
  };

  if (productContainer) {
    filterProducts("atk");

    document.querySelectorAll(".prod-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".prod-btn").forEach(x => x.classList.remove("active"));
        btn.classList.add("active");
        filterProducts(btn.dataset.category);
      });
    });

    productContainer.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      if (!card) return;

      const product = {
        name: card.querySelector("h3").textContent,
        price: card.querySelector("p").textContent,
        img: card.querySelector("img").src.split("/static/images/")[1],
        category: card.dataset.category
      };

      if (e.target.classList.contains("cart-btn")) {
        const cart = getCart();
        const exist = cart.find(i => i.name === product.name);
        exist ? exist.quantity++ : cart.push({ ...product, quantity: 1 });
        saveCart(cart);
        alert(`${product.name} ditambahkan ke keranjang!`);
      }

      if (e.target.classList.contains("buy-btn")) {
        localStorage.setItem("buyNow", JSON.stringify({ isSingle: true, product }));
        window.location.href = "/order";
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
    if (e.target.tagName === "IMG" && e.target.closest(".product-card")) {
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
          <img src="/static/images/${item.img}" alt="">
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
        window.location.href = "/order";
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
const produk   = document.getElementById("produk");

const filterProductsDropdown = (cat) => {
  if (!produk || typeof allProducts === "undefined") return;

  produk.innerHTML = '<option value="">-- Pilih Produk --</option>';

  if (cat) {
    produk.disabled = false;
    allProducts
      .filter(p => p.kategori === cat)
      .forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.nama;
        opt.textContent = p.nama;
        produk.appendChild(opt);
      });
  } else {
    produk.disabled = true;
  }
};

kategori?.addEventListener("change", () => filterProductsDropdown(kategori.value));

// Auto-fill dari tombol Order / Beli Sekarang di product.html
const buyNow = JSON.parse(localStorage.getItem("buyNow"));
if (buyNow?.isSingle) {
  const cat = buyNow.product.category;
  if (kategori) kategori.value = cat;
  filterProductsDropdown(cat);
  if (produk) produk.value = buyNow.product.name;
  const jumlahInput = document.querySelector("input[name='jumlah']");
  if (jumlahInput) jumlahInput.value = buyNow.product.quantity || 1;
  localStorage.removeItem("buyNow");
}

document.getElementById("orderForm")?.addEventListener("submit", () => {
  localStorage.removeItem("buyNow");
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