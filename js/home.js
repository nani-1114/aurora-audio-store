(function () {
  "use strict";

  const grid = document.getElementById("product-grid");
  if (!grid) return;

  function renderCard(product) {
    const defaultColor = product.colors[0] || "";
    const oldPriceHtml = product.oldPrice
      ? `<span class="price-old">${formatMoney(product.oldPrice)}</span>`
      : "";
    const badgeHtml = product.badge
      ? `<span class="card-badge">${product.badge}</span>`
      : "";

    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.id = product.id;
    card.innerHTML = `
      <a href="product.html?id=${product.id}" class="card-image-link">
        <img src="${product.image}" alt="${product.name}" loading="lazy" data-product-id="${product.id}" />
        ${badgeHtml}
      </a>
      <div class="card-body">
        <span class="card-category">${product.category}</span>
        <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
        <div class="card-rating">
          <span class="stars" aria-hidden="true">${renderStars(product.rating || 0)}</span>
          <span class="card-rating-text">${(product.rating || 0).toFixed(1)} (${(product.reviewCount || 0).toLocaleString("en-IN")})</span>
        </div>
        <p class="card-desc">${product.shortDesc}</p>
        <div class="card-price">
          <span class="price">${formatMoney(product.price)}</span>
          ${oldPriceHtml}
        </div>
        <div class="card-qty-row">
          <label class="visually-hidden" for="qty-${product.id}">Quantity</label>
          <div class="quantity-control quantity-control--sm">
            <button type="button" class="card-qty-minus" aria-label="Decrease">−</button>
            <input type="number" id="qty-${product.id}" class="card-qty-input" value="1" min="1" max="99" />
            <button type="button" class="card-qty-plus" aria-label="Increase">+</button>
          </div>
          <button type="button" class="btn btn-secondary btn-sm card-add-cart">Add to Cart</button>
        </div>
        <a href="product.html?id=${product.id}" class="card-view-link">View details →</a>
      </div>
    `;

    const cardImg = card.querySelector(".card-image-link img");
    if (cardImg) {
      cardImg.onerror = function () {
        this.onerror = null;
        this.src = productImg(product.id + "-card", 800);
      };
    }

    const qtyInput = card.querySelector(".card-qty-input");
    const minus = card.querySelector(".card-qty-minus");
    const plus = card.querySelector(".card-qty-plus");
    const addBtn = card.querySelector(".card-add-cart");

    function getQty() {
      const n = parseInt(qtyInput.value, 10);
      return Number.isFinite(n) && n >= 1 ? Math.min(99, n) : 1;
    }

    minus.addEventListener("click", () => {
      qtyInput.value = String(Math.max(1, getQty() - 1));
    });
    plus.addEventListener("click", () => {
      qtyInput.value = String(Math.min(99, getQty() + 1));
    });
    qtyInput.addEventListener("change", () => {
      qtyInput.value = String(Math.max(1, Math.min(99, getQty())));
    });

    addBtn.addEventListener("click", () => {
      const qty = getQty();
      addToCart(product.id, qty, defaultColor);
      if (window.updateHeaderCart) updateHeaderCart();
      showToast(`Added ${qty} × ${product.name} to cart`);
      addBtn.classList.add("pulse");
      setTimeout(() => addBtn.classList.remove("pulse"), 400);
    });

    return card;
  }

  PRODUCTS.forEach((p) => grid.appendChild(renderCard(p)));
})();
