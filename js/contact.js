import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const form = document.getElementById("contactForm");
const submitBtn = form.querySelector(".contact__submit");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("ctName").value.trim();
  const email = document.getElementById("ctEmail").value.trim();
  const message = document.getElementById("ctMessage").value.trim();
  if (!name || !email || !message) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";

  try {
    await addDoc(collection(db, "contact_submissions"), {
      name,
      email,
      message,
      createdAt: serverTimestamp(),
      status: "new", // you can change this to "read" / "replied" later from the Firebase console
    });
    form.reset();
    submitBtn.textContent = "Sent — thank you";
  } catch (err) {
    console.error("Contact form submission failed:", err);
    submitBtn.textContent = "Something went wrong — try again";
    submitBtn.disabled = false;
    return;
  }

  setTimeout(() => {
    submitBtn.innerHTML =
      'Send the note <svg class="icon icon--sm" aria-hidden="true"><use href="#i-arrow-right"/></svg>';
    submitBtn.disabled = false;
  }, 4000);
});
