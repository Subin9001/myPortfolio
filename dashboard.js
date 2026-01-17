import { db, auth } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Protect dashboard
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    }
});

const list = document.getElementById("messages");

onValue(ref(db, "messages"), (snapshot) => {
    list.innerHTML = "";
    snapshot.forEach(child => {
        const d = child.val();
        list.innerHTML += `
      <div class="msg">
        <h4>${d.name} (${d.email})</h4>
        <p>${d.message}</p>
      </div>
    `;
    });
});
