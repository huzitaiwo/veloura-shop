(function () {
  /* ---------- Products (temporary local data; replaced by Firestore later) ---------- */
  const PRODUCTS = [
    {
      id: "verdant-cleansing-balm",
      name: "Verdant Cleansing Balm",
      category: "Cleanse",
      price: 38,
      code: "V8",
    },
    {
      id: "amber-renewal-essence",
      name: "Amber Renewal Essence",
      category: "Treat",
      price: 52,
      code: "A6",
    },
    {
      id: "biome-balance-wash",
      name: "Biome Balance Wash",
      category: "Cleanse",
      price: 34,
      code: "BW",
    },
    {
      id: "cloud-veil-cream",
      name: "Cloud Veil Cream",
      category: "Moisturise",
      price: 48,
      code: "CC",
    },
    {
      id: "dawn-barrier-serum",
      name: "Dawn Barrier Serum",
      category: "Treat",
      price: 56,
      code: "D3",
    },
    {
      id: "mineral-cloud-spf-30",
      name: "Mineral Cloud SPF 30",
      category: "Protect",
      price: 42,
      code: "MS",
    },
    {
      id: "night-garden-oil",
      name: "Night Garden Oil",
      category: "Nourish",
      price: 62,
      code: "NO",
    },
    {
      id: "lumen-hydrating-toner",
      name: "Lumen Hydrating Toner",
      category: "Prepare",
      price: 32,
      code: "LT",
    },
  ];
  const img = (p) => `assets/images/${p.id}.png`;

  const grid = document.getElementById("homeProductGrid");
  const pills = document.querySelectorAll("[data-filter]");

  function renderProducts(category) {
    const list = (
      category === "all"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category.toLowerCase() === category)
    ).slice(0, 4);
    grid.innerHTML = list
      .map(
        (p) => `
      <article class="pcard">
        <a class="pcard__media" href="product.html?id=${p.id}">
          <img src="${img(p)}" alt="${p.name}" loading="lazy" />
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
  }

  pills.forEach((pill) =>
    pill.addEventListener("click", () => {
      pills.forEach((p) => p.classList.remove("is-active"));
      pill.classList.add("is-active");
      renderProducts(pill.dataset.filter);
    }),
  );
  renderProducts("all");

  /* ---------- Approach steps ---------- */
  // TODO: replace steps 02–05 with the real copy from the live site.
  const STEPS = [
    {
      title: "Thoughtful, not overwhelming.",
      text: "Each step has a purpose. Each formula leaves room for the next one.",
    },
    { title: "TODO — step 02 title", text: "TODO — step 02 text" },
    { title: "TODO — step 03 title", text: "TODO — step 03 text" },
    { title: "TODO — step 04 title", text: "TODO — step 04 text" },
    { title: "TODO — step 05 title", text: "TODO — step 05 text" },
  ];
  const stepBtns = document.querySelectorAll(".approach__step");
  const stepTitle = document.getElementById("approachTitle");
  const stepText = document.getElementById("approachText");
  let current = 0;

  function showStep(i) {
    current = (i + STEPS.length) % STEPS.length;
    stepBtns.forEach((b, n) => {
      b.classList.toggle("is-active", n === current);
      b.setAttribute("aria-selected", n === current);
    });
    stepTitle.textContent = STEPS[current].title;
    stepText.textContent = STEPS[current].text;
  }
  stepBtns.forEach((b, n) => b.addEventListener("click", () => showStep(n)));
  document
    .getElementById("approachPrev")
    .addEventListener("click", () => showStep(current - 1));
  document
    .getElementById("approachNext")
    .addEventListener("click", () => showStep(current + 1));

  /* ---------- FAQ accordion ---------- */
  const items = document.querySelectorAll(".faq__item");
  function toggleItem(item, open) {
    item.classList.toggle("is-open", open);
    const a = item.querySelector(".faq__a");
    a.style.maxHeight = open ? a.scrollHeight + "px" : null;
    item.querySelector(".faq__q").setAttribute("aria-expanded", open);
  }
  items.forEach((item) => {
    item.querySelector(".faq__q").addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");
      items.forEach((i) => toggleItem(i, false));
      toggleItem(item, willOpen);
    });
  });
  toggleItem(items[0], true); // first question open by default, as in the original
})();
