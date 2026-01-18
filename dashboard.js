import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const messagesContainer = document.getElementById("messages");

// Protect dashboard: redirect to login if not logged in
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    }
});

// Load messages from Firebase
const messagesRef = ref(db, "messages");
onValue(messagesRef, (snapshot) => {
    messagesContainer.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
        const msg = childSnapshot.val();
        messagesContainer.innerHTML += `
      <div style="border-bottom:1px solid #ccc; padding:5px; margin-bottom:5px;">
        <b>${msg.name}</b> (${msg.email})<br>
        ${msg.message}<br>
        <small>${new Date(msg.timestamp).toLocaleString()}</small>
      </div>
    `;
    });
});
