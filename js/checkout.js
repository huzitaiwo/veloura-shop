import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const PAYSTACK_PUBLIC_KEY = "pk_test_df57d67f96afeb66a6085ba068a04d176a2addba";

const summaryEl = document.getElementById("checkoutSummary");
const formSection = document.getElementById("checkoutFormSection");
const emptyEl = document.getElementById("checkoutEmpty");
const totalsSubtotal = document.getElementById("coSubtotal");
const totalsTotal = document.getElementById("coTotal");
const payBtn = document.getElementById("payBtn");

let currentUser = null;
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  const emailField = document.getElementById("shipEmail");
  if (user && emailField && !emailField.value) emailField.value = user.email;
});

function renderSummary() {
  const cart = window.veloura.cart.getCart();
  if (cart.length === 0) {
    summaryEl.hidden = true;
    formSection.hidden = true;
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;
  summaryEl.hidden = false;
  formSection.hidden = false;

  document.getElementById("coItems").innerHTML = cart
    .map(
      (item) => `
    <div class="co-item">
      <img src="assets/images/${item.id}.png" alt="${item.name}" />
      <div>
        <p class="co-item__name">${item.name}</p>
        <p class="co-item__qty">Qty ${item.qty}</p>
      </div>
      <span class="co-item__price">${window.veloura.formatPrice(item.qty * item.price)}</span>
    </div>`,
    )
    .join("");

  const subtotal = window.veloura.cart.subtotal(cart);
  totalsSubtotal.textContent = window.veloura.formatPrice(subtotal);
  totalsTotal.textContent = window.veloura.formatPrice(subtotal); // delivery is complimentary per the site's own copy
}

document.getElementById("checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const cart = window.veloura.cart.getCart();
  if (cart.length === 0) return;

  const email = document.getElementById("shipEmail").value.trim();
  const name = document.getElementById("shipName").value.trim();
  const address = document.getElementById("shipAddress").value.trim();
  const city = document.getElementById("shipCity").value.trim();
  const phone = document.getElementById("shipPhone").value.trim();
  if (!email || !name || !address) return;

  const subtotal = window.veloura.cart.subtotal(cart);

  // Paystack charges in kobo (1 Naira = 100 kobo).
  const amountInKobo = Math.round(subtotal * 100);

  payBtn.disabled = true;
  payBtn.textContent = "Opening payment…";

  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email,
    amount: amountInKobo,
    currency: "NGN",
    ref: "VEL-" + Date.now(),
    metadata: { name, phone, address, city },
    callback: (response) => {
      finalizeOrder({
        cart,
        subtotal,
        name,
        email,
        phone,
        address,
        city,
        reference: response.reference,
      });
    },
    onClose: () => {
      payBtn.disabled = false;
      payBtn.textContent = "Pay now";
    },
  });
  handler.openIframe();
});

async function finalizeOrder({
  cart,
  subtotal,
  name,
  email,
  phone,
  address,
  city,
  reference,
}) {
  try {
    await addDoc(collection(db, "orders"), {
      uid: currentUser ? currentUser.uid : null,
      items: cart,
      total: subtotal,
      status: "paid",
      paystackRef: reference,
      shipping: { name, email, phone, address, city },
      createdAt: serverTimestamp(),
    });
    window.veloura.cart.clearCart();
    window.location.href =
      "order-confirmation.html?ref=" + encodeURIComponent(reference);
  } catch (err) {
    console.error("Failed to save order:", err);
    alert(
      "Payment succeeded, but saving your order failed. Please contact us with reference: " +
        reference,
    );
  }
}

renderSummary();
