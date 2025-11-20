// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGBimDkH4udFoX-xJ9knySaJdT400tYrc",
  authDomain: "acornturf-70ddd.firebaseapp.com",
  projectId: "acornturf-70ddd",
  storageBucket: "acornturf-70ddd.firebasestorage.app",
  messagingSenderId: "114396648312",
  appId: "1:114396648312:web:f5ecd875c54eae5f256e8d",
  measurementId: "G-RK524LV3RJ"
};

// Initialize Firebase with unique app name
const app = initializeApp(firebaseConfig, 'testimonialsApp');
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Load and render testimonials from Firebase
async function loadTestimonials() {
  try {
    console.log('Loading testimonials...');
    const testimonialsList = document.getElementById('testimonials-list');
    if (!testimonialsList) {
      console.error('Testimonials list element not found');
      return;
    }

    const snap = await getDocs(collection(db, 'testimonials'));
    console.log('Testimonials loaded:', snap.size);
    
    // Sort testimonials by slot number
    const testimonials = [];
    snap.forEach(docSnap => {
      const data = docSnap.data();
      testimonials.push({
        id: docSnap.id,
        data,
        slotNumber: data.slotNumber || parseInt(docSnap.id.replace('slot-', '')) || 0
      });
    });
    testimonials.sort((a, b) => a.slotNumber - b.slotNumber);

    // Clear existing testimonials
    testimonialsList.innerHTML = '';

    // Check if there are any testimonials
    if (testimonials.length === 0) {
      console.log('No testimonials found in Firebase');
      // Keep the default HTML testimonials if no Firebase testimonials exist
      return;
    }

    console.log('Rendering', Math.min(testimonials.length, 6), 'testimonials');

    // Render testimonials (limit to 6)
    testimonials.slice(0, 6).forEach(({ data }, index) => {
      const article = document.createElement('article');
      article.className = 'bg-white rounded-2xl p-6 shadow-md border border-gray-100';
      article.setAttribute('data-aos', 'fade-up');
      article.setAttribute('data-aos-delay', (index % 3) * 100 + 100);

      // Generate stars HTML
      const starsHTML = [...Array(5)].map((_, i) => 
        `<svg class="w-7 h-7 ${i < (data.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.18 3.63a1 1 0 00.95.69h3.813c.969 0 1.371 1.24.588 1.81l-3.086 2.24a1 1 0 00-.364 1.118l1.18 3.63c.3.921-.755 1.688-1.54 1.118L10 13.348l-3.762 2.815c-.784.57-1.839-.197-1.54-1.118l1.18-3.63a1 1 0 00-.364-1.118L2.368 9.057c-.783-.57-.38-1.81.588-1.81h3.813a1 1 0 00.95-.69l1.18-3.63z"/></svg>`
      ).join('');

      article.innerHTML = `
        <div class="relative rounded-lg overflow-hidden bg-gray-100 h-[425px]">
          <img src="${data.imageUrl || './src/office-unman.jpg'}" alt="Testimonial video cover" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-black/10" aria-hidden="true"></div>
          <button aria-label="Play testimonial" class="absolute inset-0 m-auto w-14 h-14 bg-black/70 text-white rounded-full flex items-center justify-center shadow-lg">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7-11-7z" />
            </svg>
          </button>
          <div class="absolute right-4 bottom-4 bg-[#2ECC71] text-white text-xs font-medium px-3 py-1 rounded-full shadow">
            ${data.monthlyRevenue || '$15,200/month'}
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center justify-start space-x-1">
            ${starsHTML}
          </div>
          <p class="mt-3 text-sm text-gray-700 italic">
            "${data.text || ''}"
          </p>
          <div class="mt-4">
            <div class="font-semibold text-gray-900">${data.authorName || ''}</div>
            <div class="text-sm text-gray-500">${data.authorTitle || ''}</div>
          </div>
        </div>
      `;

      testimonialsList.appendChild(article);
    });
  } catch (error) {
    console.error('Error loading testimonials:', error);
  }
}

// Load testimonials when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadTestimonials);
} else {
  loadTestimonials();
}
