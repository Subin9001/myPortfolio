// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: Replace the following with your app's Firebase project configuration
// See DEPLOYMENT.md for instructions
const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "PROJECT_ID.firebaseapp.com",
    projectId: "PROJECT_ID",
    storageBucket: "PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authError = document.getElementById('auth-error');
const logoutBtn = document.getElementById('logout-btn');
const messagesBody = document.getElementById('messages-body');
const loadingText = document.getElementById('loading-text');

// Auth State Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        authSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        loadMessages();
    } else {
        // User is signed out
        authSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
    }
});

// Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            authError.style.display = 'none';
        })
        .catch((error) => {
            console.error(error);
            authError.style.display = 'block';
            authError.textContent = "Error: " + error.message;
        });
});

// Logout
logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

// Load Messages
async function loadMessages() {
    try {
        const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        loadingText.style.display = 'none';
        messagesBody.innerHTML = ''; // Clear existing

        if (querySnapshot.empty) {
            messagesBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No messages found.</td></tr>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Convert Firestore timestamp to readable date
            const date = data.timestamp ? data.timestamp.toDate().toLocaleString() : 'N/A';

            const row = `
                <tr>
                    <td class="msg-date">${date}</td>
                    <td>${escapeHtml(data.name)}</td>
                    <td>${escapeHtml(data.email)}</td>
                    <td>${escapeHtml(data.message)}</td>
                </tr>
            `;
            messagesBody.insertAdjacentHTML('beforeend', row);
        });

    } catch (error) {
        console.error("Error fetching messages: ", error);
        loadingText.textContent = "Error loading messages. Check console.";
    }
}

// Basic XSS protection
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
