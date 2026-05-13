document.addEventListener("DOMContentLoaded", () => {

  // ============================================================
  // PRODUCT PAGE - Filter kategori
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

    // Ambil data dari data-attribute tombol, bukan dari querySelector h3/p
    productContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".buy-btn");
      if (!btn) return;

      const product = {
        name    : btn.dataset.name,
        price   : btn.dataset.price,
        category: btn.dataset.category,
        quantity: 1
      };
      localStorage.setItem("buyNow", JSON.stringify({ isSingle: true, product }));
      window.location.href = "/order";
    });
  }

  // ============================================================
  // MODAL IMAGE
  // ============================================================

  const modal    = document.getElementById("imgModal");
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
  // ORDER PAGE
  // ============================================================

  const kategori = document.getElementById("kategori");
  const produk   = document.getElementById("produk");

  const filterProductsDropdown = (cat) => {
    if (!produk || typeof allProducts === "undefined") return;
    produk.innerHTML = '<option value="">-- Pilih Produk --</option>';
    if (cat) {
      produk.disabled = false;
      allProducts.filter(p => p.kategori === cat).forEach(p => {
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

  // Isi form order otomatis dari localStorage
  const buyNow = JSON.parse(localStorage.getItem("buyNow"));
  if (buyNow?.isSingle) {
    const cat = buyNow.product.category;
    if (kategori) {
      kategori.value = cat;
      // Trigger event change agar dropdown produk terisi
      kategori.dispatchEvent(new Event("change"));
    }
    // Tunggu sebentar agar dropdown produk selesai diisi baru pilih produknya
    setTimeout(() => {
      if (produk) produk.value = buyNow.product.name;
    }, 50);
    const jumlahInput = document.querySelector("input[name='jumlah']");
    if (jumlahInput) jumlahInput.value = buyNow.product.quantity || 1;
    localStorage.removeItem("buyNow");
  }

  // ============================================================
  // VALIDASI KONTAK (No. WA atau Email)
  // ============================================================

  const kontakInput = document.getElementById("kontak");
  const kontakError = document.getElementById("kontak-error");
  const kontakInfo  = document.getElementById("kontak-info");

  function validasiKontak(nilai) {
    const val = nilai.trim();

    // Cek email
    const polEmail = /^[\w\.-]+@[\w\.-]+\.\w{2,}$/;
    if (polEmail.test(val)) return { valid: true, tipe: "email" };

    // Cek nomor WA (hapus spasi, strip, plus)
    const nomor = val.replace(/[\s\-\+]/g, '');
    const polWA = /^(0|62)\d{9,12}$/;
    if (polWA.test(nomor) && nomor.length >= 10 && nomor.length <= 14) {
      return { valid: true, tipe: "whatsapp" };
    }

    return { valid: false, tipe: null };
  }

  if (kontakInput) {
    kontakInput.addEventListener("input", () => {
      const hasil = validasiKontak(kontakInput.value);

      if (kontakInput.value.trim() === "") {
        kontakError.style.display = "none";
        kontakInfo.style.display  = "block";
        kontakInfo.style.color    = "gray";
        kontakInfo.textContent    = "Masukkan nomor WhatsApp (10-13 digit) atau alamat email.";
        return;
      }

      if (hasil.valid) {
        kontakError.style.display = "none";
        kontakInfo.style.display  = "block";
        kontakInfo.style.color    = "green";
        kontakInfo.textContent    = hasil.tipe === "email"
          ? "✓ Format email valid."
          : "✓ Format nomor WhatsApp valid.";
      } else {
        kontakInfo.style.display  = "none";
        kontakError.style.display = "block";
        kontakError.textContent   = "✗ Format tidak valid. Masukkan nomor WA (cth: 08123456789) atau email (cth: nama@gmail.com).";
      }
    });
  }

  // Cegah submit jika kontak tidak valid
  document.getElementById("orderForm")?.addEventListener("submit", (e) => {
    if (kontakInput) {
      const hasil = validasiKontak(kontakInput.value);
      if (!hasil.valid) {
        e.preventDefault();
        kontakInfo.style.display  = "none";
        kontakError.style.display = "block";
        kontakError.textContent   = "✗ Format tidak valid. Masukkan nomor WA (cth: 08123456789) atau email (cth: nama@gmail.com).";
        kontakInput.focus();
        return;
      }
    }
    localStorage.removeItem("buyNow");
  });

  // ============================================================
  // HAMBURGER MENU
  // ============================================================

  const hamburger = document.querySelector(".hamburger");
  const navMenu   = document.querySelector("nav");

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