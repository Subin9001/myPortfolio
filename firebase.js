// firebase.js
import { initializeApp } from
    "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";

import { getDatabase } from
    "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

import { getAuth } from
    "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

export const firebaseConfig = {
    apiKey: "AIzaSyAJefZzudjRY2UQ7SLn4JtJfhVEhRddNmg",
    authDomain: "subin-portfolio-f255c.firebaseapp.com",
    databaseURL: "https://subin-portfolio-f255c-default-rtdb.firebaseio.com",
    projectId: "subin-portfolio-f255c",
    storageBucket: "subin-portfolio-f255c.appspot.com",
    messagingSenderId: "1091329654491",
    appId: "1:1091329654491:web:18295c389198437745719e"
};

// Initialize Firebase ONCE
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getDatabase(app);
export const auth = getAuth(app);
