// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const db = getFirestore(app);

/* Contact Form Submission */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;

        try {
            await addDoc(collection(db, "messages"), {
                name: name,
                email: email,
                message: message,
                timestamp: serverTimestamp()
            });

            alert('Message sent successfully!');
            contactForm.reset();
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Error sending message. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

/* Mobile Menu Toggle */
const navToggle = document.getElementById('nav-toggle');
const navList = document.querySelector('.nav-list');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navList.classList.toggle('show-menu');

        // Toggle icon
        const icon = navToggle.querySelector('i');
        if (navList.classList.contains('show-menu')) {
            icon.classList.remove('ri-menu-4-line');
            icon.classList.add('ri-close-line');
            // Ensure header is visible when menu is open
            document.querySelector('.header').classList.remove('scroll-down');
            document.querySelector('.header').classList.add('scroll-up');
        } else {
            icon.classList.remove('ri-close-line');
            icon.classList.add('ri-menu-4-line');
        }
    });
}

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('show-menu');

        // Reset icon
        const icon = navToggle.querySelector('i');
        icon.classList.remove('ri-close-line');
        icon.classList.add('ri-menu-4-line');
    });
});

/* Smart Header (Show on Scroll Up) */
let lastScrollY = window.scrollY;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling Down & pasted top offset
        header.classList.add('scroll-down');
        header.classList.remove('scroll-up');
        // Close mobile menu if open while scrolling down
        navList.classList.remove('show-menu');
        const icon = navToggle.querySelector('i');
        icon.classList.remove('ri-close-line');
        icon.classList.add('ri-menu-4-line');

    } else {
        // Scrolling Up or at top
        header.classList.add('scroll-up');
        header.classList.remove('scroll-down');
    }

    lastScrollY = currentScrollY;
    scrollActive(); // reuse scrollActive check
});

/* Active Link on Scroll */
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100; // Adjust offset
        const sectionId = current.getAttribute('id');
        const sectionLink = document.querySelector('.nav-list a[href*=' + sectionId + ']');

        if (sectionLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                sectionLink.classList.add('active');
            } else {
                sectionLink.classList.remove('active');
            }
        }
    });
}

/* Scroll Reveal Animation (Simple Fade In) */
const revealElements = document.querySelectorAll('.section-title, .about-content, .skills-container, .hobbies, .contact-container');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

// Initial styles for js reveal
revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease-out';
    observer.observe(el);
});
