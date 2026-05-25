const CART_KEY = "aurora-cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return { items: [] };
    const data = JSON.parse(raw);
    return Array.isArray(data.items) ? data : { items: [] };
  } catch {
    return { items: [] };
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCartCount(cart) {
  return cart.items.reduce((sum, item) => sum + item.qty, 0);
}

function findCartIndex(cart, productId, color) {
  return cart.items.findIndex(
    (i) => i.productId === productId && (i.color || "") === (color || "")
  );
}

function addToCart(productId, qty, color) {
  const cart = loadCart();
  const q = Math.max(1, Math.min(99, qty || 1));
  const idx = findCartIndex(cart, productId, color);
  if (idx >= 0) {
    cart.items[idx].qty = Math.min(99, cart.items[idx].qty + q);
  } else {
    cart.items.push({ productId, qty: q, color: color || "" });
  }
  saveCart(cart);
  return cart;
}

function setCartItemQty(productId, color, qty) {
  const cart = loadCart();
  const idx = findCartIndex(cart, productId, color);
  if (idx < 0) return cart;
  if (qty <= 0) {
    cart.items.splice(idx, 1);
  } else {
    cart.items[idx].qty = Math.min(99, qty);
  }
  saveCart(cart);
  return cart;
}

function removeFromCart(productId, color) {
  const cart = loadCart();
  cart.items = cart.items.filter(
    (i) => !(i.productId === productId && (i.color || "") === (color || ""))
  );
  saveCart(cart);
  return cart;
}

function clearCart() {
  saveCart({ items: [] });
}

function getCartLineItems() {
  const cart = loadCart();
  return cart.items
    .map((item) => {
      const product = typeof getProduct === "function" ? getProduct(item.productId) : null;
      if (!product) return null;
      return {
        ...item,
        product,
        lineTotal: product.price * item.qty,
      };
    })
    .filter(Boolean);
}

function getCartSubtotal() {
  return getCartLineItems().reduce((sum, line) => sum + line.lineTotal, 0);
}
