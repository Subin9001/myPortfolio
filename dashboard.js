import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

import {
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const authSection = document.getElementById("auth-section");
const dashboardSection = document.getElementById("dashboard-section");
const messagesBody = document.getElementById("messages-body");
const loadingText = document.getElementById("loading-text");
const logoutBtn = document.getElementById("logout-btn");

/* ---------------- AUTH CHECK ---------------- */
onAuthStateChanged(auth, (user) => {
  if (user) {
    authSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    loadMessages();
  } else {
    authSection.classList.remove("hidden");
    dashboardSection.classList.add("hidden");
  }
});

/* ---------------- LOAD MESSAGES ---------------- */
async function loadMessages() {
  messagesBody.innerHTML = "";
  loadingText.style.display = "block";

  const messagesRef = ref(db, 'messages');

  onValue(messagesRef, (snapshot) => {
    messagesBody.innerHTML = ""; // Clear existing before re-rendering
    const data = snapshot.val();

    if (!data) {
      loadingText.style.display = "block";
      loadingText.textContent = "No messages found.";
      return;
    }

    loadingText.style.display = "none";

    // Convert object to array and reverse to show newest first
    const messagesArray = Object.values(data).reverse();

    messagesArray.forEach((msg) => {
      const tr = document.createElement("tr");

      // Handle timestamp: if it's a number (Date.now()), convert directly
      const date = msg.time
        ? new Date(msg.time).toLocaleString()
        : "N/A";

      tr.innerHTML = `
        <td class="msg-date">${date}</td>
        <td>${msg.name || "-"}</td>
        <td>${msg.email || "-"}</td>
        <td>${msg.message || "-"}</td>
      `;

      messagesBody.appendChild(tr);
    });
  }, (error) => {
    console.error("Error loading messages:", error);
    loadingText.textContent = "Failed to load messages.";
  });
}

/* ---------------- LOGOUT ---------------- */
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  location.reload();
});
