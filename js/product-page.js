(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const product = getProduct(productId);

  const loading = document.getElementById("loading");
  const errorEl = document.getElementById("product-error");
  const section = document.getElementById("product");
  const detailsSection = document.getElementById("product-details");
  const reviewsSection = document.getElementById("product-reviews-section");
  const mainImage = document.getElementById("main-image");
  const thumbsWrap = document.getElementById("thumbnails");
  const badgeEl = document.getElementById("product-badge");
  const categoryEl = document.getElementById("product-category");
  const nameEl = document.getElementById("product-name");
  const ratingBlock = document.getElementById("product-rating-block");
  const descEl = document.getElementById("product-description");
  const longDescEl = document.getElementById("product-long-desc");
  const featuresEl = document.getElementById("product-features");
  const reviewsSummaryEl = document.getElementById("product-reviews-summary");
  const reviewCardsEl = document.getElementById("product-review-cards");
  const priceEl = document.getElementById("price");
  const priceOldEl = document.getElementById("price-old");
  const colorWrap = document.getElementById("color-picker-wrap");
  const swatchesWrap = document.getElementById("color-swatches");
  const colorNameEl = document.getElementById("color-name");
  const qtyInput = document.getElementById("quantity");
  const qtyMinus = document.getElementById("qty-minus");
  const qtyPlus = document.getElementById("qty-plus");
  const buyNowBtn = document.getElementById("buy-now");
  const addToCartBtn = document.getElementById("add-to-cart");

  let selectedColor = "";

  function thumbUrl(fullUrl) {
    return fullUrl.replace("/800/800", "/120/120");
  }

  if (!product) {
    loading.hidden = true;
    errorEl.hidden = false;
    return;
  }

  document.title = `${product.name} | Aurora Audio`;

  loading.hidden = true;
  section.hidden = false;
  detailsSection.hidden = false;
  reviewsSection.hidden = false;
  selectedColor = product.colors[0] || "";

  if (product.badge) {
    badgeEl.textContent = product.badge;
    badgeEl.hidden = false;
  }
  categoryEl.textContent = product.category;
  nameEl.textContent = product.name;
  descEl.textContent = product.shortDesc || product.description;

  const rating = product.rating ?? 0;
  const reviewCount = product.reviewCount ?? 0;
  ratingBlock.innerHTML = `
    <span class="stars stars--lg" aria-label="${rating} out of 5 stars">${renderStars(rating)}</span>
    <span class="rating-value"><strong>${rating.toFixed(1)}</strong></span>
    <span class="rating-count">(${reviewCount.toLocaleString("en-IN")} reviews)</span>
  `;

  priceEl.textContent = formatMoney(product.price);
  if (product.oldPrice) {
    priceOldEl.textContent = formatMoney(product.oldPrice);
    priceOldEl.hidden = false;
  }

  longDescEl.textContent = product.description;
  featuresEl.innerHTML = (product.features || [])
    .map((f) => `<li>${f}</li>`)
    .join("");

  reviewsSummaryEl.innerHTML = `
    <span class="stars stars--lg">${renderStars(rating)}</span>
    <span><strong>${rating.toFixed(1)}</strong> average · ${reviewCount.toLocaleString("en-IN")} ratings</span>
  `;

  reviewCardsEl.innerHTML = (product.reviews || [])
    .map(
      (r) => `
    <article class="review-card">
      <div class="review-header">
        <span class="reviewer">${r.name}</span>
        <span class="review-stars" aria-label="${r.stars} out of 5">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</span>
      </div>
      <p>${r.text}</p>
    </article>
  `
    )
    .join("");

  mainImage.src = product.images[0];
  mainImage.alt = product.name;
  mainImage.onerror = function () {
    this.onerror = null;
    this.src = productImg(product.id + "-fallback", 800);
  };

  product.images.forEach((src, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "thumb" + (i === 0 ? " active" : "");
    btn.dataset.src = src;
    const thumbSrc = thumbUrl(src);
    btn.innerHTML = `<img src="${thumbSrc}" alt="" loading="lazy" />`;
    const img = btn.querySelector("img");
    img.onerror = function () {
      this.onerror = null;
      this.src = src;
    };
    btn.addEventListener("click", () => {
      thumbsWrap.querySelectorAll(".thumb").forEach((t) => t.classList.remove("active"));
      btn.classList.add("active");
      mainImage.classList.add("fade");
      setTimeout(() => {
        mainImage.src = src;
        mainImage.classList.remove("fade");
      }, 150);
    });
    thumbsWrap.appendChild(btn);
  });

  if (product.colors.length > 0) {
    colorWrap.hidden = false;
    colorNameEl.textContent = selectedColor;
    const swatchColors = {
      "Midnight Black": "#1a1a2e",
      "Pearl White": "#f5f5f0",
      "Ocean Blue": "#2d5a7b",
      Graphite: "#3d3d3d",
      Silver: "#c0c0c0",
      "Rose Gold": "#b76e79",
      Black: "#111",
      Teal: "#008080",
      Coral: "#ff6f61",
      Charcoal: "#36454f",
      Sand: "#c2b280",
      Forest: "#228b22",
      White: "#fafafa",
      "Space Gray": "#4a4a4a",
    };
    product.colors.forEach((color, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "color-swatch" + (i === 0 ? " active" : "");
      btn.dataset.color = color;
      btn.style.setProperty("--swatch", swatchColors[color] || "#6c5ce7");
      btn.title = color;
      btn.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      btn.addEventListener("click", () => {
        swatchesWrap.querySelectorAll(".color-swatch").forEach((s) => {
          s.classList.remove("active");
          s.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
        selectedColor = color;
        colorNameEl.textContent = color;
      });
      swatchesWrap.appendChild(btn);
    });
  }

  function getQty() {
    const n = parseInt(qtyInput.value, 10);
    return Number.isFinite(n) && n >= 1 ? Math.min(99, n) : 1;
  }

  qtyMinus.addEventListener("click", () => {
    qtyInput.value = String(Math.max(1, getQty() - 1));
  });
  qtyPlus.addEventListener("click", () => {
    qtyInput.value = String(Math.min(99, getQty() + 1));
  });
  qtyInput.addEventListener("change", () => {
    qtyInput.value = String(Math.max(1, Math.min(99, getQty())));
  });

  function addCurrentToCart() {
    const qty = getQty();
    addToCart(product.id, qty, selectedColor);
    if (window.updateHeaderCart) updateHeaderCart();
    return qty;
  }

  addToCartBtn.addEventListener("click", () => {
    const qty = addCurrentToCart();
    showToast(`Added ${qty} × ${product.name} (${selectedColor}) to cart`);
    addToCartBtn.classList.add("pulse");
    setTimeout(() => addToCartBtn.classList.remove("pulse"), 400);
  });

  buyNowBtn.addEventListener("click", () => {
    addCurrentToCart();
    window.location.href = "checkout.html";
  });
})();
