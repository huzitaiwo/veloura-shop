// Must be loaded as a module: <script type="module" src="js/firebase-config.js">
// Any script that needs db/auth must also be type="module" and import from here.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmWLvG3w7Bfjm3TZsBMMpUteB5qalz-ho",
  authDomain: "veloura-shop-bdfc6.firebaseapp.com",
  projectId: "veloura-shop-bdfc6",
  storageBucket: "veloura-shop-bdfc6.firebasestorage.app",
  messagingSenderId: "520419008911",
  appId: "1:520419008911:web:78ab9d5d261c66f5b46bfa",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
