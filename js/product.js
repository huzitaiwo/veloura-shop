(function () {
  /* Catalog order matters: related products = first 3 of this list, excluding the current product. */
  const PRODUCTS = [
    {
      id: "verdant-cleansing-balm",
      name: "Verdant Cleansing Balm",
      category: "Cleanse",
      price: 38,
      code: "V8",
      ritualNo: "01",
      volume: "70 ML",
      subtitle: "A balm-to-milk first step for an unhurried evening ritual.",
    },
    {
      id: "amber-renewal-essence",
      name: "Amber Renewal Essence",
      category: "Treat",
      price: 52,
      code: "AE",
      ritualNo: "02",
      volume: "50 ML",
      subtitle:
        "A concentrated water-light layer for skin that prefers a little ceremony.",
    },
    {
      id: "biome-balance-wash",
      name: "Biome Balance Wash",
      category: "Cleanse",
      price: 34,
      code: "BW",
      ritualNo: "03",
      volume: "150 ML",
      subtitle: "A softly foaming daily wash with a clean, low-scent finish.",
    },
    {
      id: "cloud-veil-cream",
      name: "Cloud Veil Cream",
      category: "Moisturise",
      price: 48,
      code: "CC",
      ritualNo: "04",
      volume: "50 ML",
      subtitle:
        "A soft, cushiony cream that makes the final step feel considered.",
    },
    {
      id: "dawn-barrier-serum",
      name: "Dawn Barrier Serum",
      category: "Treat",
      price: 56,
      code: "DS",
      ritualNo: "05",
      volume: "30 ML",
      subtitle: "A silky layer designed for a calm, cushioned-feeling routine.",
    },
    {
      id: "mineral-cloud-spf-30",
      name: "Mineral Cloud SPF 30",
      category: "Protect",
      price: 42,
      code: "MS",
      ritualNo: "06",
      volume: "50 ML",
      subtitle: "A mineral daily finishing step with a velvety, sheer feel.",
    },
    {
      id: "night-garden-oil",
      name: "Night Garden Oil",
      category: "Nourish",
      price: 62,
      code: "NO",
      ritualNo: "07",
      volume: "30 ML",
      subtitle:
        "A rich botanical oil for the slowest part of your evening ritual.",
    },
    {
      id: "lumen-hydrating-toner",
      name: "Lumen Hydrating Toner",
      category: "Prepare",
      price: 32,
      code: "LT",
      ritualNo: "08",
      volume: "120 ML",
      subtitle: "A fine preparatory mist that makes room for what comes next.",
    },
  ];
  const img = (id) => `assets/images/${id}.png`;

  const params = new URLSearchParams(window.location.search);
  const product =
    PRODUCTS.find((p) => p.id === params.get("id")) || PRODUCTS[0];

  document.title = `${product.name} — Veloura`;
  document.getElementById("crumbName").textContent = product.name;

  document.getElementById("galleryImg").src = img(product.id);
  document.getElementById("galleryImg").alt = product.name;
  document.getElementById("galleryTagStudy").textContent =
    `Study · ${product.code}`;
  document.getElementById("galleryTagNo").textContent =
    `Veloura No. ${product.ritualNo}`;

  document.getElementById("productEyebrow").textContent =
    `${product.category} · ${product.volume}`;
  document.getElementById("productTitle").textContent = product.name;
  document.getElementById("productSubtitle").textContent = product.subtitle;
  document.getElementById("productPrice").textContent = `$${product.price}`;
  document.getElementById("detailsText").textContent = product.subtitle; // confirmed identical to subtitle on every product page checked

  /* ---- Quantity stepper ---- */
  let qty = 1;
  const qtyLabel = document.getElementById("qtyValue");
  document.getElementById("qtyMinus").addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    qtyLabel.textContent = qty;
  });
  document.getElementById("qtyPlus").addEventListener("click", () => {
    qty = Math.min(10, qty + 1);
    qtyLabel.textContent = qty;
  });

  /* ---- Add to bag ---- */
  document.getElementById("addToBag").addEventListener("click", () => {
    window.veloura.cart.addItem(product.id, product.name, product.price, qty);
    window.veloura?.openCart?.();
  });

  /* ---- Accordions ("The details" open by default, matching every reference screenshot) ---- */
  document.querySelectorAll(".acc").forEach((acc) => {
    const q = acc.querySelector(".acc__q");
    const a = acc.querySelector(".acc__a");
    q.addEventListener("click", () => {
      const open = !acc.classList.contains("is-open");
      acc.classList.toggle("is-open", open);
      a.style.maxHeight = open ? a.scrollHeight + "px" : null;
      q.setAttribute("aria-expanded", open);
    });
  });
  const detailsAcc = document.querySelector('.acc[data-acc="details"]');
  detailsAcc.classList.add("is-open");
  detailsAcc.querySelector(".acc__a").style.maxHeight = "999px";
  detailsAcc.querySelector(".acc__q").setAttribute("aria-expanded", "true");

  /* ---- Related: first 3 products in catalog order, excluding the current one ---- */
  const relatedGrid = document.getElementById("relatedGrid");
  relatedGrid.innerHTML = PRODUCTS.filter((p) => p.id !== product.id)
    .slice(0, 3)
    .map(
      (p) => `
      <article class="pcard">
        <a class="pcard__media" href="product.html?id=${p.id}">
          <img src="${img(p.id)}" alt="${p.name}" loading="lazy" />
          <span class="study-tag">Study · ${p.code}</span>
        </a>
        <p class="pcard__cat">${p.category}</p>
        <h3 class="pcard__name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div class="pcard__row">
          <span class="pcard__price">$${p.price}</span>
          <button class="pcard__add" data-add="${p.id}" data-name="${p.name}" data-price="${p.price}" aria-label="Add ${p.name} to bag"><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg></button>
        </div>
      </article>`,
    )
    .join("");
})();
