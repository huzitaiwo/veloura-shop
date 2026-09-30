(function () {
  const CART_KEY = "velouraCart";

  function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
  }

  function addItem(id, name, price, qty = 1) {
    const cart = getCart();
    const existing = cart.find((i) => i.id === id);
    if (existing) existing.qty += qty;
    else cart.push({ id, name, price: Number(price), qty });
    saveCart(cart);
  }
  function removeItem(id) {
    saveCart(getCart().filter((i) => i.id !== id));
  }
  function setQty(id, qty) {
    const cart = getCart();
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, qty);
    saveCart(cart);
  }
  function clearCart() {
    saveCart([]);
  }
  function subtotal(cart = getCart()) {
    return cart.reduce((sum, i) => sum + i.qty * i.price, 0);
  }

  function renderCart() {
    const cart = getCart();
    const itemsEl = document.getElementById("cartItems");
    if (!itemsEl) return; // header markup not on this page (shouldn't happen, but stay safe)

    const emptyEl = document.getElementById("cartEmpty");
    const summaryEl = document.getElementById("cartSummary");
    const subtotalEl = document.getElementById("cartSubtotal");

    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    document.querySelectorAll("#cartCount, #cartDrawerCount").forEach((el) => {
      el.textContent = count;
    });

    if (cart.length === 0) {
      itemsEl.innerHTML = "";
      if (emptyEl) emptyEl.hidden = false;
      if (summaryEl) summaryEl.hidden = true;
      return;
    }

    if (emptyEl) emptyEl.hidden = true;
    if (summaryEl) summaryEl.hidden = false;

    itemsEl.innerHTML = cart
      .map(
        (item) => `
      <div class="cart__item" data-id="${item.id}">
        <img src="assets/images/${item.id}.png" alt="${item.name}" />
        <div style="flex:1">
          <p class="cart__item-name">${item.name}</p>
          <p class="cart__item-price">${window.veloura.formatPrice(item.price)}</p>
          <div class="cart__qty">
            <button type="button" data-qty-minus aria-label="Decrease quantity">−</button>
            <span>${item.qty}</span>
            <button type="button" data-qty-plus aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button type="button" class="cart__remove" data-remove>Remove</button>
      </div>`,
      )
      .join("");

    if (subtotalEl)
      subtotalEl.textContent = window.veloura.formatPrice(subtotal(cart));
  }

  /* ---- Event delegation: works for buttons that exist now OR render later (shop/home grids) ---- */
  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    if (addBtn) {
      const id = addBtn.dataset.add;
      const name = addBtn.dataset.name || id;
      const price = addBtn.dataset.price || 0;
      addItem(id, name, price, 1);
      window.veloura?.openCart?.();
      return;
    }
    const minusBtn = e.target.closest("[data-qty-minus]");
    if (minusBtn) {
      const id = minusBtn.closest("[data-id]").dataset.id;
      const item = getCart().find((i) => i.id === id);
      if (item) setQty(id, item.qty - 1);
      return;
    }
    const plusBtn = e.target.closest("[data-qty-plus]");
    if (plusBtn) {
      const id = plusBtn.closest("[data-id]").dataset.id;
      const item = getCart().find((i) => i.id === id);
      if (item) setQty(id, item.qty + 1);
      return;
    }
    const removeBtn = e.target.closest("[data-remove]");
    if (removeBtn) {
      removeItem(removeBtn.closest("[data-id]").dataset.id);
      return;
    }
  });

  window.veloura = window.veloura || {};
  window.veloura.formatPrice = (n) => "₦" + Number(n).toLocaleString("en-NG");
  window.veloura.cart = {
    getCart,
    addItem,
    removeItem,
    setQty,
    clearCart,
    subtotal,
  };

  renderCart();
})();
