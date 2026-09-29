/* Shared layout: header, mobile nav, search, cart drawer, newsletter band, footer.
   Every page needs:  <body data-page="home">  <div id="site-header"></div> ... <div id="site-footer"></div>
   Load BEFORE header.js. data-page values: home | shop | philosophy | journal | contact | account */
(function () {
  const page = document.body.dataset.page || "";

  const icon = (name, cls = "icon") =>
    `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  const SPRITE = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <symbol id="i-arrow-right" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
  <symbol id="i-arrow-up-right" viewBox="0 0 24 24"><path d="M7 17L17 7M8 7h9v9"/></symbol>
  <symbol id="i-chev-left" viewBox="0 0 24 24"><path d="M14.5 6l-6 6 6 6"/></symbol>
  <symbol id="i-chev-right" viewBox="0 0 24 24"><path d="M9.5 6l6 6-6 6"/></symbol>
  <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
  <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></symbol>
  <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></symbol>
  <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c.8-4 4-6 7.5-6s6.7 2 7.5 6"/></symbol>
  <symbol id="i-bag" viewBox="0 0 24 24"><path d="M5.5 8h13l-1 12.5h-11L5.5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></symbol>
  <symbol id="i-truck" viewBox="0 0 24 24"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/></symbol>
  <symbol id="i-leaf" viewBox="0 0 24 24"><path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14"/><path d="M5 19c3-4 6-6.5 10-8.5"/></symbol>
  <symbol id="i-sparkle" viewBox="0 0 24 24"><path d="M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8z"/></symbol>
  <symbol id="i-sprout" viewBox="0 0 24 24"><path d="M12 20v-8"/><path d="M12 12c0-4-3-6-7-6 0 4 3 6 7 6zM12 14c0-3 2.5-5 6-5 0 3-2.5 5-6 5z"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3.5" y="5.5" width="17" height="13" rx="1.5"/><path d="M4 7l8 6 8-6"/></symbol>
  <symbol id="i-phone" viewBox="0 0 24 24"><path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5L16 13l4 1.5v3a2 2 0 0 1-2 2A14 14 0 0 1 4.5 6a2 2 0 0 1 2-2z"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s6-5.6 6-10.5a6 6 0 0 0-12 0C6 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2"/></symbol>
</defs></svg>`;

  const logo = () => `
<a href="index.html" class="logo" aria-label="Veloura — home">
  <svg class="logo__mark" viewBox="0 0 24 24" aria-hidden="true">
    <g fill="#2f7a4b"><circle cx="11" cy="5" r="2.4"/><circle cx="17" cy="11" r="2.4"/><circle cx="11" cy="17" r="2.4"/><circle cx="5" cy="11" r="2.4"/></g>
    <circle cx="20.5" cy="20.5" r="1.5" fill="#e1b94c"/>
  </svg>
  <span class="logo__word"><span class="logo__v">V</span>ELOURA</span>
</a>`;

  const NAV = [
    { label: "Shop", href: "shop.html", page: "shop" },
    { label: "Our Philosophy", href: "philosophy.html", page: "philosophy" },
    { label: "Journal", href: "journal.html", page: "journal" },
  ];
  const MOBILE_NAV = [
    ...NAV,
    { label: "Contact", href: "contact.html", page: "contact" },
  ];

  const header = `
<a href="#main" class="skip-link">Skip to content</a>
<div class="announcement">
  <p>Care, distilled into a daily ritual.</p>
  <p>Complimentary domestic delivery on orders over $75</p>
</div>

<header class="site-header">
  <div class="site-header__inner">
    <div>
      <button class="hamburger" id="hamburgerBtn" aria-label="Open menu" aria-controls="mobileNav"><span></span><span></span></button>
      <nav class="site-nav" aria-label="Primary">
        <ul>${NAV.map((n) => `<li><a href="${n.href}"${n.page === page ? ' class="is-active" aria-current="page"' : ""}>${n.label}</a></li>`).join("")}</ul>
      </nav>
    </div>
    ${logo()}
    <div class="header-tools">
      <button class="tool-btn" id="searchBtn" aria-label="Search">${icon("search")}</button>
      <a class="tool-btn header-tools__account" href="account.html" aria-label="Account">${icon("user")}</a>
      <button class="tool-btn" id="cartBtn" aria-label="Open bag">${icon("bag")}<span class="cart-count" id="cartCount">0</span></button>
    </div>
  </div>
</header>

<div class="mnav" id="mobileNav" aria-hidden="true">
  <div class="mnav__head">
    ${logo()}
    <button id="mobileNavClose" aria-label="Close menu">${icon("close")}</button>
  </div>
  <nav aria-label="Mobile">
    <ul class="mnav__list">
      ${MOBILE_NAV.map((n, i) => `<li><a class="mnav__link" href="${n.href}"><span class="mnav__num">0${i + 1}</span><span class="mnav__label">${n.label}</span>${icon("arrow-right", "icon icon--sm")}</a></li>`).join("")}
    </ul>
  </nav>
  <div class="mnav__foot">
    <p>Veloura rituals are designed to make room for your own pace.</p>
    <a class="link-arrow" href="shop.html">Shop all care ${icon("arrow-right", "icon icon--sm")}</a>
  </div>
</div>

<div class="search" id="searchOverlay" role="dialog" aria-modal="true" aria-label="Search" aria-hidden="true">
  <button class="search__close" id="searchClose" aria-label="Close search">${icon("close")}</button>
  <div class="search__inner">
    <p class="eyebrow eyebrow--light">Search Veloura</p>
    <form class="search__form" id="searchForm" role="search">
      ${icon("search")}
      <input type="search" id="searchInput" placeholder="What are you looking for?" autocomplete="off" />
      <button class="search__submit" type="submit" aria-label="Search">${icon("arrow-right", "icon icon--sm")}</button>
    </form>
    <p class="search__hint">Try “cleansing balm” or “evening ritual”</p>
  </div>
</div>

<aside class="cart" id="cartDrawer" role="dialog" aria-modal="true" aria-label="Bag" aria-hidden="true">
  <div class="cart__head">
    <div>
      <p class="eyebrow">Your collection</p>
      <h2 class="cart__title">Bag (<span id="cartDrawerCount">0</span>)</h2>
    </div>
    <button class="cart__close" id="cartClose" aria-label="Close bag">${icon("close")}</button>
  </div>
  <div class="cart__items" id="cartItems"></div>
  <div class="cart__empty" id="cartEmpty">
    <p>Your bag is ready when you are.</p>
    <a class="btn btn--dark btn--block" href="shop.html">Discover care ${icon("arrow-right", "icon icon--sm")}</a>
  </div>
  <div class="cart__summary" id="cartSummary" hidden>
    <div class="cart__subtotal"><span>Subtotal</span><span id="cartSubtotal">$0</span></div>
    <a class="btn btn--dark btn--block" href="checkout.html">Checkout</a>
  </div>
</aside>

<div class="overlay" id="navOverlay"></div>`;

  const footer = `
<section class="newsletter">
  <div class="newsletter__inner">
    <div>
      <p class="eyebrow eyebrow--light">A note from the studio</p>
      <h2>Your ritual, <em>made personal.</em></h2>
    </div>
    <form class="newsletter__form" id="newsletterForm">
      <label class="visually-hidden" for="newsletterEmail">Email address</label>
      <input type="email" id="newsletterEmail" placeholder="Email address" required />
      <button type="submit" aria-label="Subscribe">${icon("arrow-right", "icon icon--sm")}</button>
    </form>
  </div>
</section>

<footer class="site-footer">
  <div class="site-footer__grid">
    <div class="site-footer__brand">
      ${logo()}
      <p>Thoughtfully composed skincare for every thoughtful day.</p>
      <address>Veloura Studio<br />New York, NY</address>
    </div>
    <div>
      <h3>Rituals</h3>
      <ul>
        <li><a href="shop.html?category=cleanse">Cleansing</a></li>
        <li><a href="shop.html?category=treat">Treatments</a></li>
        <li><a href="shop.html?category=moisturise">Moisturisers</a></li>
        <li><a href="shop.html?category=protect">Protection</a></li>
      </ul>
    </div>
    <div>
      <h3>House</h3>
      <ul>
        <li><a href="philosophy.html">Our philosophy</a></li>
        <li><a href="journal.html">Journal</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li><a href="faq.html">FAQ</a></li>
      </ul>
    </div>
    <div>
      <h3>Assistance</h3>
      <ul>
        <li><a href="delivery-returns.html">Delivery &amp; returns</a></li>
        <li><a href="privacy.html">Privacy</a></li>
        <li><a href="terms.html">Terms</a></li>
        <li><a href="account.html">My account</a></li>
      </ul>
    </div>
  </div>
  <div class="site-footer__bottom">
    <p>© 2026 Veloura. All rights reserved.</p>
    <p>Designed for a slower kind of care.</p>
  </div>
</footer>`;

  document.body.insertAdjacentHTML("afterbegin", SPRITE);
  const h = document.getElementById("site-header");
  const f = document.getElementById("site-footer");
  if (h) h.innerHTML = header;
  if (f) f.innerHTML = footer;
})();
