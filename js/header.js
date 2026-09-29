(function () {
  const body = document.body;

  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileNav = document.getElementById("mobileNav");
  const mobileNavClose = document.getElementById("mobileNavClose");

  const searchBtn = document.getElementById("searchBtn");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchClose = document.getElementById("searchClose");
  const searchInput = document.getElementById("searchInput");

  const cartBtn = document.getElementById("cartBtn");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartClose = document.getElementById("cartClose");

  const navOverlay = document.getElementById("navOverlay");

  function lockScroll() {
    body.classList.add("no-scroll");
  }

  function unlockScrollIfAllClosed() {
    const anyOpen =
      mobileNav?.classList.contains("is-open") ||
      searchOverlay?.classList.contains("is-open") ||
      cartDrawer?.classList.contains("is-open");
    if (!anyOpen) body.classList.remove("no-scroll");
  }

  function showOverlay() {
    navOverlay?.classList.add("is-visible");
  }

  function hideOverlayIfAllClosed() {
    const anyOpen =
      mobileNav?.classList.contains("is-open") ||
      cartDrawer?.classList.contains("is-open");
    if (!anyOpen) navOverlay?.classList.remove("is-visible");
  }

  function openMobileNav() {
    mobileNav?.classList.add("is-open");
    mobileNav?.setAttribute("aria-hidden", "false");
    showOverlay();
    lockScroll();
  }

  function closeMobileNav() {
    mobileNav?.classList.remove("is-open");
    mobileNav?.setAttribute("aria-hidden", "true");
    hideOverlayIfAllClosed();
    unlockScrollIfAllClosed();
  }

  hamburgerBtn?.addEventListener("click", openMobileNav);
  mobileNavClose?.addEventListener("click", closeMobileNav);

  function openSearch() {
    searchOverlay?.classList.add("is-open");
    searchOverlay?.setAttribute("aria-hidden", "false");
    lockScroll();
    setTimeout(() => searchInput?.focus(), 150);
  }

  function closeSearch() {
    searchOverlay?.classList.remove("is-open");
    searchOverlay?.setAttribute("aria-hidden", "true");
    unlockScrollIfAllClosed();
  }

  searchBtn?.addEventListener("click", openSearch);
  searchClose?.addEventListener("click", closeSearch);

  function openCart() {
    cartDrawer?.classList.add("is-open");
    cartDrawer?.setAttribute("aria-hidden", "false");
    showOverlay();
    lockScroll();
  }

  function closeCart() {
    cartDrawer?.classList.remove("is-open");
    cartDrawer?.setAttribute("aria-hidden", "true");
    hideOverlayIfAllClosed();
    unlockScrollIfAllClosed();
  }

  cartBtn?.addEventListener("click", openCart);
  cartClose?.addEventListener("click", closeCart);

  window.veloura = window.veloura || {};
  window.veloura.openCart = openCart;
  window.veloura.closeCart = closeCart;

  navOverlay?.addEventListener("click", () => {
    closeMobileNav();
    closeCart();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobileNav();
      closeSearch();
      closeCart();
    }
  });

  const searchForm = document.getElementById("searchForm");
  searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput?.value.trim();
    if (query) {
      window.location.href = `shop.html?q=${encodeURIComponent(query)}`;
    }
  });

  const newsletterForm = document.getElementById("newsletterForm");
  newsletterForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector("input[type='email']");
    if (emailInput?.value) {
      alert("Thanks for subscribing! (Newsletter storage not wired up yet.)");
      newsletterForm.reset();
    }
  });

  function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("velouraCart") || "[]");
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll("#cartCount, #cartDrawerCount").forEach((el) => {
      el.textContent = count;
    });
  }

  updateCartBadge();
  window.veloura.updateCartBadge = updateCartBadge;
})();
