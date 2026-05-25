(function () {
  "use strict";

  let toastTimer = null;

  window.showToast = function (message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.hidden = true;
      }, 350);
    }, 3200);
  };

  function updateHeaderCart() {
    const badge = document.getElementById("header-cart-count");
    if (!badge) return;
    const count = getCartCount(loadCart());
    badge.textContent = String(count);
    badge.hidden = count === 0;
  }

  function initMobileNav() {
    const menuToggle = document.querySelector(".menu-toggle");
    const header = document.querySelector(".site-header");
    if (!menuToggle || !header) return;

    menuToggle.addEventListener("click", () => {
      const open = header.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    document.querySelectorAll(".main-nav a").forEach((link) => {
      link.addEventListener("click", () => {
        header.classList.remove("nav-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initNewsletter() {
    const form = document.getElementById("newsletter-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email")?.value?.trim();
      if (!email) return;
      showToast("Thanks for subscribing!");
      form.reset();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateHeaderCart();
    initMobileNav();
    initNewsletter();
    window.updateHeaderCart = updateHeaderCart;
  });
})();
