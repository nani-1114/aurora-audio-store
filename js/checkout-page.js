(function () {
  "use strict";

  const SHIPPING_FREE_MIN = 5000;
  const SHIPPING_FLAT = 199;

  const cartItemsEl = document.getElementById("cart-items");
  const cartEmptyEl = document.getElementById("cart-empty");
  const subtotalEl = document.getElementById("summary-subtotal");
  const shippingEl = document.getElementById("summary-shipping");
  const totalEl = document.getElementById("summary-total");
  const placeOrderBtn = document.getElementById("place-order");
  const checkoutForm = document.getElementById("checkout-form");
  const orderSuccess = document.getElementById("order-success");
  const successMessage = document.getElementById("success-message");
  const checkoutLayout = document.querySelector(".checkout-layout");

  function getShipping(subtotal) {
    if (subtotal <= 0) return 0;
    return subtotal >= SHIPPING_FREE_MIN ? 0 : SHIPPING_FLAT;
  }

  function render() {
    const lines = getCartLineItems();
    cartItemsEl.innerHTML = "";

    if (lines.length === 0) {
      cartEmptyEl.hidden = false;
      placeOrderBtn.disabled = true;
      subtotalEl.textContent = formatMoney(0);
      shippingEl.textContent = formatMoney(0);
      totalEl.textContent = formatMoney(0);
      if (window.updateHeaderCart) updateHeaderCart();
      return;
    }

    cartEmptyEl.hidden = true;
    placeOrderBtn.disabled = false;

    lines.forEach((line) => {
      const li = document.createElement("li");
      li.className = "cart-line";
      li.dataset.productId = line.productId;
      li.dataset.color = line.color || "";

      const colorLabel = line.color ? ` · ${line.color}` : "";

      li.innerHTML = `
        <img src="${line.product.image}" alt="" class="cart-line-img" />
        <div class="cart-line-info">
          <a href="product.html?id=${line.productId}" class="cart-line-name">${line.product.name}</a>
          <span class="cart-line-meta">${formatMoney(line.product.price)} each${colorLabel}</span>
          <div class="cart-line-actions">
            <div class="quantity-control quantity-control--sm">
              <button type="button" class="line-qty-minus" aria-label="Decrease">−</button>
              <input type="number" class="line-qty-input" value="${line.qty}" min="1" max="99" aria-label="Quantity" />
              <button type="button" class="line-qty-plus" aria-label="Increase">+</button>
            </div>
            <button type="button" class="line-remove btn-text">Remove</button>
          </div>
        </div>
        <span class="cart-line-total">${formatMoney(line.lineTotal)}</span>
      `;

      const qtyInput = li.querySelector(".line-qty-input");
      const minus = li.querySelector(".line-qty-minus");
      const plus = li.querySelector(".line-qty-plus");
      const removeBtn = li.querySelector(".line-remove");

      function lineQty() {
        const n = parseInt(qtyInput.value, 10);
        return Number.isFinite(n) && n >= 1 ? Math.min(99, n) : 1;
      }

      function updateLine(qty) {
        setCartItemQty(line.productId, line.color, qty);
        render();
        showToast("Cart updated");
      }

      minus.addEventListener("click", () => {
        const q = lineQty();
        if (q <= 1) {
          removeFromCart(line.productId, line.color);
          render();
        } else {
          updateLine(q - 1);
        }
      });
      plus.addEventListener("click", () => updateLine(lineQty() + 1));
      qtyInput.addEventListener("change", () => updateLine(lineQty()));
      removeBtn.addEventListener("click", () => {
        removeFromCart(line.productId, line.color);
        render();
        showToast("Item removed");
      });

      cartItemsEl.appendChild(li);
    });

    const subtotal = getCartSubtotal();
    const shipping = getShipping(subtotal);
    const total = subtotal + shipping;

    subtotalEl.textContent = formatMoney(subtotal);
    shippingEl.textContent =
      shipping === 0 && subtotal > 0 ? "Free" : formatMoney(shipping);
    totalEl.textContent = formatMoney(total);

    if (window.updateHeaderCart) updateHeaderCart();
  }

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const lines = getCartLineItems();
    if (lines.length === 0) {
      showToast("Your cart is empty");
      return;
    }

    const name = document.getElementById("full-name").value.trim();
    const total = getCartSubtotal() + getShipping(getCartSubtotal());
    const count = getCartCount(loadCart());

    clearCart();
    if (window.updateHeaderCart) updateHeaderCart();

    checkoutLayout.hidden = true;
    orderSuccess.hidden = false;
    successMessage.textContent = `Thanks, ${name}! Your order of ${count} item(s) totaling ${formatMoney(total)} has been placed.`;
  });

  render();
})();
