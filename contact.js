import { db } from "./firebase.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

document.getElementById("sendBtn").addEventListener("click", () => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    if (!name || !email || !message) {
        alert("Fill all fields");
        return;
    }

    push(ref(db, "messages"), {
        name,
        email,
        message,
        time: Date.now()
    });

    alert("Message sent ✅");
});
