import { auth, db, googleProvider } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const authSection = document.getElementById("authSection");
const dash = document.getElementById("accountDash");

const tabSignIn = document.getElementById("tabSignIn");
const tabSignUp = document.getElementById("tabSignUp");
const panelSignIn = document.getElementById("panelSignIn");
const panelSignUp = document.getElementById("panelSignUp");
const errorBox = document.getElementById("authError");

function showTab(tab) {
  const signIn = tab === "signin";
  tabSignIn.classList.toggle("is-active", signIn);
  tabSignUp.classList.toggle("is-active", !signIn);
  panelSignIn.hidden = !signIn;
  panelSignUp.hidden = signIn;
  errorBox.textContent = "";
}
tabSignIn.addEventListener("click", () => showTab("signin"));
tabSignUp.addEventListener("click", () => showTab("signup"));

function friendlyError(err) {
  const map = {
    "auth/invalid-email": "That email address doesn't look right.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/email-already-in-use": "An account already exists with that email.",
    "auth/weak-password": "Password should be at least 6 characters.",
  };
  return map[err.code] || "Something went wrong. Please try again.";
}

/* ---- Sign in ---- */
document.getElementById("signInForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox.textContent = "";
  const email = document.getElementById("siEmail").value.trim();
  const password = document.getElementById("siPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    errorBox.textContent = friendlyError(err);
  }
});

/* ---- Sign up ---- */
document.getElementById("signUpForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox.textContent = "";
  const name = document.getElementById("suName").value.trim();
  const email = document.getElementById("suEmail").value.trim();
  const password = document.getElementById("suPassword").value;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(cred.user, { displayName: name });
  } catch (err) {
    errorBox.textContent = friendlyError(err);
  }
});

/* ---- Google sign-in (both panels share one handler) ---- */
document.querySelectorAll("[data-google-signin]").forEach((btn) =>
  btn.addEventListener("click", async () => {
    errorBox.textContent = "";
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      errorBox.textContent = friendlyError(err);
    }
  }),
);

/* ---- Sign out ---- */
document
  .getElementById("signOutBtn")
  .addEventListener("click", () => signOut(auth));

/* ---- Auth state -> show dashboard or auth forms ---- */
onAuthStateChanged(auth, async (user) => {
  if (user) {
    authSection.hidden = true;
    dash.hidden = false;
    document.getElementById("dashName").textContent =
      user.displayName || "Welcome";
    document.getElementById("dashEmail").textContent = user.email;
    await loadOrders(user.uid);
  } else {
    authSection.hidden = false;
    dash.hidden = true;
  }
});

async function loadOrders(uid) {
  const listEl = document.getElementById("ordersList");
  const emptyEl = document.getElementById("ordersEmpty");
  try {
    const q = query(
      collection(db, "orders"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc"),
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      emptyEl.hidden = false;
      listEl.innerHTML = "";
      return;
    }
    emptyEl.hidden = true;
    listEl.innerHTML = snap.docs
      .map((doc) => {
        const o = doc.data();
        const date = o.createdAt?.toDate?.().toLocaleDateString() ?? "";
        return `<div class="order-row">
          <span class="order-row__id">#${doc.id.slice(0, 8)}</span>
          <span class="order-row__meta">${date} · ${o.status ?? "processing"}</span>
          <span>$${o.total ?? "—"}</span>
        </div>`;
      })
      .join("");
  } catch (err) {
    console.error("Failed to load orders:", err);
    emptyEl.hidden = false;
  }
}
