(function () {
  /* Temporary local catalog — replaced by a Firestore query once the DB is seeded. */
  const PRODUCTS = [
    {
      id: "verdant-cleansing-balm",
      name: "Verdant Cleansing Balm",
      category: "cleanse",
      price: 57000,
      code: "V8",
    },
    {
      id: "amber-renewal-essence",
      name: "Amber Renewal Essence",
      category: "treat",
      price: 78000,
      code: "AE",
    },
    {
      id: "biome-balance-wash",
      name: "Biome Balance Wash",
      category: "cleanse",
      price: 51000,
      code: "BW",
    },
    {
      id: "cloud-veil-cream",
      name: "Cloud Veil Cream",
      category: "moisturise",
      price: 72000,
      code: "CC",
    },
    {
      id: "dawn-barrier-serum",
      name: "Dawn Barrier Serum",
      category: "treat",
      price: 84000,
      code: "DS",
    },
    {
      id: "mineral-cloud-spf-30",
      name: "Mineral Cloud SPF 30",
      category: "protect",
      price: 63000,
      code: "MS",
    },
    {
      id: "night-garden-oil",
      name: "Night Garden Oil",
      category: "nourish",
      price: 93000,
      code: "NO",
    },
    {
      id: "lumen-hydrating-toner",
      name: "Lumen Hydrating Toner",
      category: "prepare",
      price: 48000,
      code: "LT",
    },
  ];
  const CAT_LABEL = {
    cleanse: "Cleanse",
    treat: "Treat",
    moisturise: "Moisturise",
    protect: "Protect",
    nourish: "Nourish",
    prepare: "Prepare",
  };
  const img = (p) => `assets/images/${p.id}.png`;

  const grid = document.getElementById("shopGrid");
  const emptyState = document.getElementById("shopEmpty");
  const countLabel = document.getElementById("shopCount");
  const pills = document.querySelectorAll("[data-filter]");
  const sortSelect = document.getElementById("sortSelect");

  const params = new URLSearchParams(window.location.search);
  let activeCategory = params.get("category") || "all";
  let activeSort = "featured";

  function cardHTML(p) {
    return `
      <article class="pcard">
        <a class="pcard__media" href="product.html?id=${p.id}">
          <img src="${img(p)}" alt="${p.name}" loading="lazy" />
          <span class="study-tag">Study · ${p.code}</span>
        </a>
        <p class="pcard__cat">${CAT_LABEL[p.category]}</p>
        <h3 class="pcard__name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div class="pcard__row">
          <span class="pcard__price">${window.veloura.formatPrice(p.price)}</span>
          <button class="pcard__add" data-add="${p.id}" data-name="${p.name}" data-price="${p.price}" aria-label="Add ${p.name} to bag">
            <svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg>
          </button>
        </div>
      </article>`;
  }

  function sortList(list) {
    if (activeSort === "price-low")
      return [...list].sort((a, b) => a.price - b.price);
    if (activeSort === "price-high")
      return [...list].sort((a, b) => b.price - a.price);
    if (activeSort === "name")
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list; // "featured" = catalog order
  }

  function render() {
    const filtered =
      activeCategory === "all"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === activeCategory);
    const list = sortList(filtered);
    grid.innerHTML = list.map(cardHTML).join("");
    countLabel.textContent = `${list.length} considered texture${list.length === 1 ? "" : "s"}`;
    emptyState.classList.toggle("is-visible", list.length === 0);

    pills.forEach((pill) =>
      pill.classList.toggle(
        "is-active",
        pill.dataset.filter === activeCategory,
      ),
    );
  }

  pills.forEach((pill) =>
    pill.addEventListener("click", () => {
      activeCategory = pill.dataset.filter;
      const url = new URL(window.location);
      if (activeCategory === "all") url.searchParams.delete("category");
      else url.searchParams.set("category", activeCategory);
      window.history.replaceState({}, "", url);
      render();
    }),
  );

  sortSelect?.addEventListener("change", () => {
    activeSort = sortSelect.value;
    render();
  });

  render();
})();
