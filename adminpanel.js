// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
  import { getFirestore, collection, addDoc, doc, getDocs, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
  import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBGBimDkH4udFoX-xJ9knySaJdT400tYrc",
    authDomain: "acornturf-70ddd.firebaseapp.com",
    projectId: "acornturf-70ddd",
    storageBucket: "acornturf-70ddd.firebasestorage.app",
    messagingSenderId: "114396648312",
    appId: "1:114396648312:web:f5ecd875c54eae5f256e8d",
    measurementId: "G-RK524LV3RJ"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  window.addEventListener('DOMContentLoaded', () => {
    // Alert Banner Section
    const alertBannerForm = document.getElementById('alertbannerform');
    if (alertBannerForm) {
      // Load existing data
      getDocs(collection(db, 'alertBanner')).then((snap) => {
        if (!snap.empty) {
          const data = snap.docs[0].data();
          const countdownInput = document.getElementById('countdown-end');
          const slotsInput = document.getElementById('slots-remaining');
          
          if (data.countdownEndTime && countdownInput) {
            const date = new Date(data.countdownEndTime);
            const localDateTime = date.toISOString().slice(0, 16);
            countdownInput.value = localDateTime;
          }
          if (data.slotsRemaining && slotsInput) {
            slotsInput.value = data.slotsRemaining;
          }
        }
      });

      alertBannerForm.onsubmit = async function(e) {
        e.preventDefault();
        const countdownEnd = document.getElementById('countdown-end').value;
        const slotsRemaining = document.getElementById('slots-remaining').value;

        if (!countdownEnd || !slotsRemaining) {
          alert('Please fill in all fields.');
          return;
        }

        const loader = document.createElement('div');
        loader.className = 'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30 z-50';
        loader.innerHTML = '<div class="bg-white rounded-lg px-6 py-4 shadow text-lg font-semibold flex items-center"><svg class="animate-spin mr-2 h-6 w-6 text-[#21C97B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>Saving...</div>';
        document.body.appendChild(loader);

        try {
          const alertBannerSnap = await getDocs(collection(db, "alertBanner"));
          let docId = alertBannerSnap.empty ? "main" : alertBannerSnap.docs[0].id;

          await setDoc(doc(db, "alertBanner", docId), {
            countdownEndTime: new Date(countdownEnd).toISOString(),
            slotsRemaining: parseInt(slotsRemaining),
            updatedAt: new Date().toISOString()
          });

          document.body.removeChild(loader);
          alert('Alert banner updated successfully!');
        } catch (error) {
          document.body.removeChild(loader);
          console.error('Error updating alert banner:', error);
          alert('Error updating alert banner. Check console.');
        }
      };
    }

    // Hero Section
    
    const heroForm = document.getElementById('heroform');
    if (heroForm) {
      // Create loader element
      const loader = document.createElement('div');
      loader.id = 'heroform-loader';
      loader.className = 'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30 z-50';
      loader.innerHTML = '<div class="bg-white rounded-lg px-6 py-4 shadow text-lg font-semibold flex items-center"><svg class="animate-spin mr-2 h-6 w-6 text-[#21C97B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>Saving...</div>';
      heroForm.onsubmit = async function(e) {
        e.preventDefault();
        const headline = document.getElementById('headline').value.trim();
        const subtext = document.getElementById('subtext').value.trim();
        if (!headline || !subtext) {
          alert('Please fill in all fields.');
          return;
        }
        document.body.appendChild(loader);
        // Get the first doc in heroSection, or create one if none exists
        const heroSectionSnap = await getDocs(collection(db, "heroSection"));
        let docId;
        if (!heroSectionSnap.empty) {
          docId = heroSectionSnap.docs[0].id;
        } else {
          docId = "main";
        }
        await setDoc(doc(db, "heroSection", docId), {
          headline,
          subtext
        });
        document.body.removeChild(loader);
        alert('Hero Section saved!');
      };
    }

    // Social Proof Section
    const socialForm = document.getElementById('socialproofform');
    if (socialForm) {
       // Create loader element
      const loader = document.createElement('div');
      loader.id = 'socialproofform-loader';
      loader.className = 'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30 z-50';
      loader.innerHTML = '<div class="bg-white rounded-lg px-6 py-4 shadow text-lg font-semibold flex items-center"><svg class="animate-spin mr-2 h-6 w-6 text-[#21C97B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>Saving...</div>';
      socialForm.onsubmit = async function(e) {
        e.preventDefault();
        // Read values first to avoid temporal-dead-zone / undefined reference
        const video = document.getElementById('video').value.trim();
        const students = document.getElementById('students').value.trim();
        const earnings = document.getElementById('earnings').value.trim();
        const socsubtext = document.getElementById('social-subtext').value.trim();
        // validate inputs
        if (!video || !socsubtext || !students || !earnings) {
          alert('Please fill in all fields.');
          return;
        }
        document.body.appendChild(loader);
        // Get the first doc in heroSection, or create one if none exists
        const socialProofSnap = await getDocs(collection(db, "socialProof"));
        let docId;
        if (!socialProofSnap.empty) {
          docId = socialProofSnap.docs[0].id;
        } else {
          docId = "main";
        }
        await setDoc(doc(db, "socialProof", docId), {
          video,
          students,
          earnings,
          socsubtext
        });
        document.body.removeChild(loader);
        alert('Hero Section saved!');
      };
    }
//---------------------------------------------------------------------//
    // Packages Section
    const package1formEl = document.querySelector('#package1form form');
    const package2formEl = document.querySelector('#package2form form');

    if (package1formEl) {
      package1formEl.onsubmit = async function(e) {
        e.preventDefault();
        const headline = document.getElementById('package1-headline').value.trim();
        const subtext = document.getElementById('package1-subtext').value.trim();
        const price = document.getElementById('package1-price').value.trim();
        const features = Array.from(package1formEl.querySelectorAll('input[type="text"]')).slice(3).map(f => f.value.trim());
        if (!headline || !subtext || !price || features.some(f => !f)) {
          alert('Please fill in all fields.');
          return;
        }
        const loader = document.createElement('div');
        loader.className = 'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30 z-50';
        loader.innerHTML = '<div class="bg-white rounded-lg px-6 py-4 shadow text-lg font-semibold flex items-center"><svg class="animate-spin mr-2 h-6 w-6 text-[#21C97B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>Saving...</div>';
        document.body.appendChild(loader);
        await setDoc(doc(db, "packages", "package1"), {
          headline,
          subtext,
          price,
          features
        });
        document.body.removeChild(loader);
        alert('Package 1 saved!');
      };
    }

    if (package2formEl) {
      package2formEl.onsubmit = async function(e) {
        e.preventDefault();
        const headline = document.getElementById('package2-headline').value.trim();
        const subtext = document.getElementById('package2-subtext').value.trim();
        const price = document.getElementById('package2-price').value.trim();
        const features = Array.from(package2formEl.querySelectorAll('input[type="text"]')).slice(3).map(f => f.value.trim());
        if (!headline || !subtext || !price || features.some(f => !f)) {
          alert('Please fill in all fields.');
          return;
        }
        const loader = document.createElement('div');
        loader.className = 'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30 z-50';
        loader.innerHTML = '<div class="bg-white rounded-lg px-6 py-4 shadow text-lg font-semibold flex items-center"><svg class="animate-spin mr-2 h-6 w-6 text-[#21C97B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>Saving...</div>';
        document.body.appendChild(loader);
        await setDoc(doc(db, "packages", "package2"), {
          headline,
          subtext,
          price,
          features
        });
        document.body.removeChild(loader);
        alert('Package 2 saved!');
      };
    }

    // Packages Section Tab Switching
    const package1tab = document.getElementById('package1tab');
    const package2tab = document.getElementById('package2tab');
    const package1form = document.getElementById('package1form');
    const package2form = document.getElementById('package2form');

    if (package1tab && package2tab && package1form && package2form) {
      package1tab.addEventListener('click', function() {
        package1form.style.display = '';
        package2form.style.display = 'none';
        package1tab.className = 'font-bold text-base px-4 py-1';
        package2tab.className = 'text-base px-4 py-1';
      });
      package2tab.addEventListener('click', function() {
        package1form.style.display = 'none';
        package2form.style.display = '';
        package2tab.className = 'font-bold text-base px-4 py-1';
        package1tab.className = ' text-base px-4 py-1 ';
      });
    }
//--------------------------------------------------------------------//
     //Why Choose Acorn Section
    let section1ImageFile = null;
    let section2ImageFile = null;

    // Section 1 Image Upload
    const section1UploadBtn = document.getElementById('section1upload');
    if (section1UploadBtn) {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);

      section1UploadBtn.addEventListener('click', () => {
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          section1ImageFile = file;
          updateSectionUploadUI('section1uploaddrag', file.name, section1UploadBtn);
        }
      });
    }

    const section1UploadDrag = document.getElementById('section1uploaddrag');
    if (section1UploadDrag) {
      section1UploadDrag.addEventListener('dragover', (e) => {
        e.preventDefault();
        section1UploadDrag.style.border = '2px dashed #4CAF50';
        section1UploadDrag.style.background = '#f0fff0';
      });

      section1UploadDrag.addEventListener('dragleave', (e) => {
        e.preventDefault();
        section1UploadDrag.style.border = '';
        section1UploadDrag.style.background = '';
      });

      section1UploadDrag.addEventListener('drop', (e) => {
        e.preventDefault();
        section1UploadDrag.style.border = '';
        section1UploadDrag.style.background = '';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
          section1ImageFile = file;
          updateSectionUploadUI('section1uploaddrag', file.name, section1UploadBtn);
        } else {
          alert('Please drop a valid image file.');
        }
      });
    }

    // Section 2 Image Upload
    const section2UploadBtn = document.getElementById('section2upload');
    if (section2UploadBtn) {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);

      section2UploadBtn.addEventListener('click', () => {
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          section2ImageFile = file;
          updateSectionUploadUI('section2uploaddrag', file.name, section2UploadBtn);
        }
      });
    }

    const section2UploadDrag = document.getElementById('section2uploaddrag');
    if (section2UploadDrag) {
      section2UploadDrag.addEventListener('dragover', (e) => {
        e.preventDefault();
        section2UploadDrag.style.border = '2px dashed #4CAF50';
        section2UploadDrag.style.background = '#f0fff0';
      });

      section2UploadDrag.addEventListener('dragleave', (e) => {
        e.preventDefault();
        section2UploadDrag.style.border = '';
        section2UploadDrag.style.background = '';
      });

      section2UploadDrag.addEventListener('drop', (e) => {
        e.preventDefault();
        section2UploadDrag.style.border = '';
        section2UploadDrag.style.background = '';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
          section2ImageFile = file;
          updateSectionUploadUI('section2uploaddrag', file.name, section2UploadBtn);
        } else {
          alert('Please drop a valid image file.');
        }
      });
    }

    function updateSectionUploadUI(dragId, filename, uploadBtn) {
      const dragDiv = document.getElementById(dragId);
      if (dragDiv) {
        dragDiv.innerHTML = '';
        const nameDiv = document.createElement('div');
        nameDiv.className = 'text-gray-700 text-base mb-2';
        nameDiv.textContent = filename;
        dragDiv.appendChild(nameDiv);
        const selectBtn = document.createElement('button');
        selectBtn.type = 'button';
        selectBtn.className = 'mt-2 px-3 py-1 bg-white border border-gray-300 rounded text-[#21C97B] text-sm font-medium shadow';
        selectBtn.textContent = 'Select another file';
        selectBtn.onclick = function() {
          if (uploadBtn) uploadBtn.click();
        };
        dragDiv.appendChild(selectBtn);
      }
    }

    const whyForm = document.getElementById('whychooseacornform');
    if (whyForm) {
      whyForm.onsubmit = async function(e) {
        e.preventDefault();
        const section1Headline = document.getElementById('section1-headline').value.trim();
        const section1Subtext = document.getElementById('section1-subtext').value.trim();
        const section2Headline = document.getElementById('section2-headline').value.trim();
        const section2Subtext = document.getElementById('section2-subtext').value.trim();

        if (!section1Headline || !section1Subtext || !section2Headline || !section2Subtext || !section1ImageFile || !section2ImageFile) {
          alert('Please fill in all fields and select images.');
          return;
        }

        // Loader
        const loader = document.createElement('div');
        loader.className = 'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30 z-50';
        loader.innerHTML = '<div class="bg-white rounded-lg px-6 py-4 shadow text-lg font-semibold flex items-center"><svg class="animate-spin mr-2 h-6 w-6 text-[#21C97B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>Saving...</div>';
        document.body.appendChild(loader);

        // Upload images
        let section1ImageUrl = '';
        let section2ImageUrl = '';
        if (section1ImageFile) {
          const storageRef1 = ref(storage, 'whyChooseAcorn/section1_' + Date.now() + '_' + section1ImageFile.name);
          await uploadBytes(storageRef1, section1ImageFile);
          section1ImageUrl = await getDownloadURL(storageRef1);
        }
        if (section2ImageFile) {
          const storageRef2 = ref(storage, 'whyChooseAcorn/section2_' + Date.now() + '_' + section2ImageFile.name);
          await uploadBytes(storageRef2, section2ImageFile);
          section2ImageUrl = await getDownloadURL(storageRef2);
        }

        // Update or create the only doc in whyChooseAcorn
        const whySnap = await getDocs(collection(db, "whyChooseAcorn"));
        let docId;
        if (!whySnap.empty) {
          docId = whySnap.docs[0].id;
        } else {
          docId = "main";
        }
        await setDoc(doc(db, "whyChooseAcorn", docId), {
          section1Headline,
          section1Subtext,
          section1ImageUrl,
          section2Headline,
          section2Subtext,
          section2ImageUrl
        });

        document.body.removeChild(loader);
        alert('Why Choose Acorn saved!');
      };
    }

    // Testimonials Management Section - Video Upload
    let testimonialVideoFile = null;
    const testimonialVideoUploadBtn = document.getElementById('videouploadbtn');
    if (testimonialVideoUploadBtn) {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'video/*';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);

      testimonialVideoUploadBtn.addEventListener('click', () => {
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          testimonialVideoFile = file;
          updateTestimonialVideoUploadUI('videouploaddrag', file.name, testimonialVideoUploadBtn);
        }
      });
    }

    const testimonialVideoUploadDrag = document.getElementById('videouploaddrag');
    if (testimonialVideoUploadDrag) {
      testimonialVideoUploadDrag.addEventListener('dragover', (e) => {
        e.preventDefault();
        testimonialVideoUploadDrag.style.border = '2px dashed #4CAF50';
        testimonialVideoUploadDrag.style.background = '#f0fff0';
      });

      testimonialVideoUploadDrag.addEventListener('dragleave', (e) => {
        e.preventDefault();
        testimonialVideoUploadDrag.style.border = '';
        testimonialVideoUploadDrag.style.background = '';
      });

      testimonialVideoUploadDrag.addEventListener('drop', (e) => {
        e.preventDefault();
        testimonialVideoUploadDrag.style.border = '';
        testimonialVideoUploadDrag.style.background = '';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) {
          testimonialVideoFile = file;
          updateTestimonialVideoUploadUI('videouploaddrag', file.name, testimonialVideoUploadBtn);
        } else {
          alert('Please drop a valid video file.');
        }
      });
    }

    function updateTestimonialVideoUploadUI(dragId, filename, uploadBtn) {
      const dragDiv = document.getElementById(dragId);
      if (dragDiv) {
        dragDiv.innerHTML = '';
        const nameDiv = document.createElement('div');
        nameDiv.className = 'text-gray-700 text-base mb-2';
        nameDiv.textContent = filename;
        dragDiv.appendChild(nameDiv);
        const selectBtn = document.createElement('button');
        selectBtn.type = 'button';
        selectBtn.className = 'mt-2 px-3 py-1 bg-white border border-gray-300 rounded text-[#21C97B] text-sm font-medium shadow';
        selectBtn.textContent = 'Select another file';
        selectBtn.onclick = function() {
          if (uploadBtn) uploadBtn.click();
        };
        dragDiv.appendChild(selectBtn);
      }
    }

    // Testimonials Management Section - Interactive Stars
    let testimonialRating = 5;
    const starContainer = document.getElementById('starcontainer');
    if (starContainer) {
      starContainer.innerHTML = '';
      for (let i = 0; i < 5; i++) {
        const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        star.setAttribute('width', '28');
        star.setAttribute('height', '28');
        star.setAttribute('viewBox', '0 0 20 20');
        star.setAttribute('fill', 'currentColor');
        star.classList.add('cursor-pointer', i < testimonialRating ? 'text-[#FFC107]' : 'text-gray-300');
        star.style.transition = 'color 0.2s';
        star.innerHTML = '<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z"/>';
        star.addEventListener('click', function() {
          testimonialRating = i + 1;
          Array.from(starContainer.children).forEach((s, idx) => {
            s.classList.toggle('text-[#FFC107]', idx < testimonialRating);
            s.classList.toggle('text-gray-300', idx >= testimonialRating);
          });
        });
        starContainer.appendChild(star);
      }
    }

    // Testimonial slot pagination (1..6)
    let activeTestimonialSlot = 1; // 1-based
    const maxTestimonialSlots = 6;
    const paginationContainer = document.getElementById('testimonial-pagination');
    function renderTestimonialPagination() {
      if (!paginationContainer) return;
      paginationContainer.innerHTML = '';
      for (let i = 1; i <= maxTestimonialSlots; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = String(i);
        btn.className = (i === activeTestimonialSlot) ? 'px-3 py-1 rounded bg-[#21C97B] text-white font-semibold' : 'px-3 py-1 rounded border border-gray-200 bg-white';
        btn.onclick = () => {
          activeTestimonialSlot = i;
          renderTestimonialPagination();
          loadTestimonialSlot(activeTestimonialSlot);
        };
        paginationContainer.appendChild(btn);
      }
    }

    async function loadTestimonialSlot(slotNumber) {
      // load doc testimonials/slot-N if exists, and populate form
      try {
        const snap = await getDocs(collection(db, 'testimonials'));
        // try to find doc with id `slot-N`
        const targetId = `slot-${slotNumber}`;
        const found = snap.docs.find(d => d.id === targetId);
        // clear form first
        document.getElementById('testimonial-text').value = '';
        document.getElementById('author-name').value = '';
        document.getElementById('author-title').value = '';
        document.getElementById('monthly-revenue').value = '';
        testimonialRating = 5;
        Array.from(document.getElementById('starcontainer').children || []).forEach((s, idx) => {
          s.classList.toggle('text-[#FFC107]', idx < testimonialRating);
          s.classList.toggle('text-gray-300', idx >= testimonialRating);
        });
        testimonialVideoFile = null;
        updateTestimonialVideoUploadUI('videouploaddrag', 'No file selected', document.getElementById('videouploadbtn'));
        if (found) {
          const data = found.data();
          document.getElementById('testimonial-text').value = data.text || '';
          document.getElementById('author-name').value = data.authorName || '';
          document.getElementById('author-title').value = data.authorTitle || '';
          document.getElementById('monthly-revenue').value = data.monthlyRevenue || '';
          testimonialRating = data.rating || 5;
          Array.from(document.getElementById('starcontainer').children || []).forEach((s, idx) => {
            s.classList.toggle('text-[#FFC107]', idx < testimonialRating);
            s.classList.toggle('text-gray-300', idx >= testimonialRating);
          });
          // If there's a videoUrl we show filename placeholder (no download)
          if (data.videoUrl) {
            const parts = data.videoUrl.split('/');
            const last = parts[parts.length - 1] || 'video';
            updateTestimonialVideoUploadUI('videouploaddrag', decodeURIComponent(last), document.getElementById('videouploadbtn'));
          }
        }
      } catch (err) {
        console.error('Failed loading testimonial slot', err);
      }
    }

    function slotDocId(slotNumber) {
      return `slot-${slotNumber}`;
    }

    // Clear/delete slot
    const clearSlotBtn = document.getElementById('clear-slot-btn');
    if (clearSlotBtn) {
      clearSlotBtn.onclick = async () => {
        if (!confirm(`Clear testimonial slot ${activeTestimonialSlot}? This will delete the slot document.`)) return;
        try {
          await setDoc(doc(db, 'testimonials', slotDocId(activeTestimonialSlot)), {}, { merge: false });
          // delete using low-level doc delete if available
          try { await deleteDoc(doc(db, 'testimonials', slotDocId(activeTestimonialSlot))); } catch(e) { /* ignore if not allowed */ }
        } catch (e) { console.warn(e); }
        loadTestimonialSlot(activeTestimonialSlot);
        renderTestimonials();
      };
    }

    renderTestimonialPagination();

    const testimonialForm = document.getElementById('testimonialform');
    if (testimonialForm) {
      testimonialForm.onsubmit = async function(e) {
        e.preventDefault();
        const text = document.getElementById('testimonial-text').value.trim();
        const authorName = document.getElementById('author-name').value.trim();
        const authorTitle = document.getElementById('author-title').value.trim();
        const monthlyRevenue = document.getElementById('monthly-revenue').value.trim();
        if (!text || !authorName || !authorTitle || !monthlyRevenue || !testimonialRating || !testimonialVideoFile) {
          alert('Please fill in all fields, select a rating, and upload a video.');
          return;
        }
        const loader = document.createElement('div');
        loader.className = 'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30 z-50';
        loader.innerHTML = '<div class="bg-white rounded-lg px-6 py-4 shadow text-lg font-semibold flex items-center"><svg class="animate-spin mr-2 h-6 w-6 text-[#21C97B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>Saving...</div>';
        document.body.appendChild(loader);
        let videoUrl = '';
        if (testimonialVideoFile) {
          const storageRef = ref(storage, `testimonials/videos/${Date.now()}_${testimonialVideoFile.name}`);
          await uploadBytes(storageRef, testimonialVideoFile);
          videoUrl = await getDownloadURL(storageRef);
        }
        // Save to a specific slot doc
        await setDoc(doc(db, 'testimonials', slotDocId(activeTestimonialSlot)), {
          text,
          authorName,
          authorTitle,
          monthlyRevenue,
          rating: testimonialRating,
          videoUrl
        });
        document.body.removeChild(loader);
        alert('Testimonial saved!');
      };
    }

    // Modal helpers
    function showEditModal(testimonialId, data, onSave) {
      let modal = document.getElementById('edit-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'edit-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40';
        modal.innerHTML = `
          <div class="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
            <h2 class="font-bold text-lg mb-4">Edit Testimonial</h2>
            <label class="block text-gray-700 mb-2">Text</label>
            <textarea id="edit-text" class="w-full rounded border border-gray-300 px-3 py-2 mb-3">${data.text || ''}</textarea>
            <label class="block text-gray-700 mb-2">Author Name</label>
            <input id="edit-author" type="text" class="w-full rounded border border-gray-300 px-3 py-2 mb-3" value="${data.authorName || ''}" />
            <label class="block text-gray-700 mb-2">Author Title</label>
            <input id="edit-title" type="text" class="w-full rounded border border-gray-300 px-3 py-2 mb-3" value="${data.authorTitle || ''}" />
            <label class="block text-gray-700 mb-2">Monthly Revenue</label>
            <input id="edit-revenue" type="text" class="w-full rounded border border-gray-300 px-3 py-2 mb-3" value="${data.monthlyRevenue || ''}" />
            <label class="block text-gray-700 mb-2">Rating</label>
            <input id="edit-rating" type="number" min="1" max="5" class="w-16 rounded border border-gray-300 px-2 py-1 mb-3" value="${data.rating || 5}" />
            <div class="flex justify-end gap-2 mt-4">
              <button id="edit-cancel" class="px-4 py-2 rounded bg-gray-200 text-gray-700">Cancel</button>
              <button id="edit-save" class="px-4 py-2 rounded bg-[#21C97B] text-white font-semibold">Save</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
      } else {
        modal.style.display = '';
      }
      document.getElementById('edit-cancel').onclick = () => {
        modal.style.display = 'none';
      };
      document.getElementById('edit-save').onclick = async () => {
        const newData = {
          text: document.getElementById('edit-text').value,
          authorName: document.getElementById('edit-author').value,
          authorTitle: document.getElementById('edit-title').value,
          monthlyRevenue: document.getElementById('edit-revenue').value,
          rating: parseInt(document.getElementById('edit-rating').value)
        };
        await onSave(newData);
        modal.style.display = 'none';
      };
    }
    function showDeleteModal(testimonialId, onDelete) {
      let modal = document.getElementById('delete-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'delete-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40';
        modal.innerHTML = `
          <div class="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm text-center">
            <h2 class="font-bold text-lg mb-4">Delete Testimonial?</h2>
            <p class="mb-6 text-gray-700">Are you sure you want to delete this testimonial?</p>
            <div class="flex justify-center gap-2">
              <button id="delete-cancel" class="px-4 py-2 rounded bg-gray-200 text-gray-700">Cancel</button>
              <button id="delete-confirm" class="px-4 py-2 rounded bg-red-500 text-white font-semibold">Delete</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
      } else {
        modal.style.display = '';
      }
      document.getElementById('delete-cancel').onclick = () => {
        modal.style.display = 'none';
      };
      document.getElementById('delete-confirm').onclick = async () => {
        await onDelete();
        modal.style.display = 'none';
      };
    }
    // Fetch and display current testimonials
    async function renderTestimonials() {
      const testimonialsList = document.getElementById('testimonials-list');
      if (!testimonialsList) return;
      testimonialsList.innerHTML = '';
      const snap = await getDocs(collection(db, 'testimonials'));
      snap.forEach(docSnap => {
        const data = docSnap.data();
        const testimonialId = docSnap.id;
        const wrapper = document.createElement('div');
        wrapper.className = 'flex items-start gap-2';
        const card = document.createElement('div');
        card.className = 'rounded-xl border border-gray-300 p-4 flex flex-col gap-2 bg-white flex-1';
        card.innerHTML = `
          <div class="text-gray-800 text-base mb-2">"${data.text}"</div>
          <div class="flex items-center justify-between">
            <div>
              <span class="font-bold text-sm text-gray-900">${data.authorName},</span>
              <span class="text-xs text-gray-500 ml-1">${data.authorTitle}</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="flex items-center space-x-1">
                ${[...Array(5)].map((_, i) => `<svg class="w-5 h-5 ${i < (data.rating || 0) ? 'text-[#FFC107]' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20"><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z'/></svg>`).join('')}
              </div>
              <span class="bg-[#21C97B] text-white text-xs font-semibold px-3 py-1 rounded-full ml-2">${data.monthlyRevenue || ''}</span>
            </div>
          </div>
        `;
        const btns = document.createElement('div');
        btns.className = 'flex flex-col gap-2 items-center justify-center';
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-100';
        editBtn.title = 'Edit';
        editBtn.innerHTML = `<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 20h9" stroke="currentColor" stroke-linecap="round"/><path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        editBtn.onclick = () => {
          showEditModal(testimonialId, data, async (newData) => {
            await setDoc(doc(db, 'testimonials', testimonialId), newData, { merge: true });
            renderTestimonials();
          });
        };
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-red-100';
        deleteBtn.title = 'Delete';
        deleteBtn.innerHTML = `<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-linecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-linecap="round"/></svg>`;
        deleteBtn.onclick = () => {
          showDeleteModal(testimonialId, async () => {
            await setDoc(doc(db, 'testimonials', testimonialId), {}, { merge: false });
            await deleteDoc(doc(db, 'testimonials', testimonialId));
            renderTestimonials();
          });
        };
        btns.appendChild(editBtn);
        btns.appendChild(deleteBtn);
        wrapper.appendChild(card);
        wrapper.appendChild(btns);
        testimonialsList.appendChild(wrapper);
      });
    }
    renderTestimonials();
    
    // FAQ Management Section (Limited to 4 FAQs)
    async function renderFAQs() {
      const faqsList = document.getElementById('faqs-list');
      if (!faqsList) return;
      faqsList.innerHTML = '';
      const snap = await getDocs(collection(db, 'faqs'));
      const faqCount = snap.size;
      
      // Add count indicator
      if (faqCount > 0) {
        const countDiv = document.createElement('div');
        countDiv.className = 'mb-4 text-sm text-gray-600';
        countDiv.textContent = `${faqCount} / 4 FAQs (Only first 4 will display on homepage)`;
        faqsList.appendChild(countDiv);
      }
      
      snap.forEach(docSnap => {
        const data = docSnap.data();
        const faqId = docSnap.id;
        const wrapper = document.createElement('div');
        wrapper.className = 'flex items-start gap-2';
        const card = document.createElement('div');
        card.className = 'rounded-xl border border-gray-300 p-4 flex flex-col gap-2 bg-white flex-1';
        card.innerHTML = `
          <div class="font-semibold text-base mb-1">${data.question}</div>
          <div class="text-gray-700 text-sm">${data.answer}</div>
        `;
        const btns = document.createElement('div');
        btns.className = 'flex flex-col gap-2 items-center justify-center';
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-100';
        editBtn.title = 'Edit';
        editBtn.innerHTML = `<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 20h9" stroke="currentColor" stroke-linecap="round"/><path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        editBtn.onclick = () => {
          showFAQEditModal(faqId, data, async (newData) => {
            await setDoc(doc(db, 'faqs', faqId), newData, { merge: true });
            renderFAQs();
          });
        };
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-red-100';
        deleteBtn.title = 'Delete';
        deleteBtn.innerHTML = `<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-linecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-linecap="round"/></svg>`;
        deleteBtn.onclick = () => {
          showFAQDeleteModal(faqId, async () => {
            await setDoc(doc(db, 'faqs', faqId), {}, { merge: false });
            await deleteDoc(doc(db, 'faqs', faqId));
            renderFAQs();
          });
        };
        btns.appendChild(editBtn);
        btns.appendChild(deleteBtn);
        wrapper.appendChild(card);
        wrapper.appendChild(btns);
        faqsList.appendChild(wrapper);
      });
    }
    function showFAQEditModal(faqId, data, onSave) {
      let modal = document.getElementById('faq-edit-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'faq-edit-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40';
        modal.innerHTML = `
          <div class="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
            <h2 class="font-bold text-lg mb-4">Edit FAQ</h2>
            <label class="block text-gray-700 mb-2">Question</label>
            <input id="faq-edit-question" type="text" class="w-full rounded border border-gray-300 px-3 py-2 mb-3" value="${data.question || ''}" />
            <label class="block text-gray-700 mb-2">Answer</label>
            <textarea id="faq-edit-answer" class="w-full rounded border border-gray-300 px-3 py-2 mb-3">${data.answer || ''}</textarea>
            <div class="flex justify-end gap-2 mt-4">
              <button id="faq-edit-cancel" class="px-4 py-2 rounded bg-gray-200 text-gray-700">Cancel</button>
              <button id="faq-edit-save" class="px-4 py-2 rounded bg-[#21C97B] text-white font-semibold">Save</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
      } else {
        modal.style.display = '';
      }
      document.getElementById('faq-edit-cancel').onclick = () => {
        modal.style.display = 'none';
      };
      document.getElementById('faq-edit-save').onclick = async () => {
        const newData = {
          question: document.getElementById('faq-edit-question').value,
          answer: document.getElementById('faq-edit-answer').value
        };
        await onSave(newData);
        modal.style.display = 'none';
      };
    }
    function showFAQDeleteModal(faqId, onDelete) {
      let modal = document.getElementById('faq-delete-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'faq-delete-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40';
        modal.innerHTML = `
          <div class="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm text-center">
            <h2 class="font-bold text-lg mb-4">Delete FAQ?</h2>
            <p class="mb-6 text-gray-700">Are you sure you want to delete this FAQ?</p>
            <div class="flex justify-center gap-2">
              <button id="faq-delete-cancel" class="px-4 py-2 rounded bg-gray-200 text-gray-700">Cancel</button>
              <button id="faq-delete-confirm" class="px-4 py-2 rounded bg-red-500 text-white font-semibold">Delete</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
      } else {
        modal.style.display = '';
      }
      document.getElementById('faq-delete-cancel').onclick = () => {
        modal.style.display = 'none';
      };
      document.getElementById('faq-delete-confirm').onclick = async () => {
        await onDelete();
        modal.style.display = 'none';
      };
    }
    // Add FAQ (Limited to 4)
    const addFaqBtn = document.getElementById('faq-add-btn');
    if (addFaqBtn) {
      addFaqBtn.addEventListener('click', async () => {
        const question = document.getElementById('faq-question').value.trim();
        const answer = document.getElementById('faq-answer').value.trim();
        if (!question || !answer) {
          alert('Please enter both question and answer.');
          return;
        }
        
        // Check if already have 4 FAQs
        const currentSnap = await getDocs(collection(db, 'faqs'));
        if (currentSnap.size >= 4) {
          alert('Maximum of 4 FAQs allowed. Please delete an existing FAQ before adding a new one.');
          return;
        }
        
        await addDoc(collection(db, 'faqs'), { question, answer });
        document.getElementById('faq-question').value = '';
        document.getElementById('faq-answer').value = '';
        renderFAQs();
      });
    }
    renderFAQs();

    // Add X button to each feature input in package1form and package2form
function addFeatureClearButtons(formId, featureInputSelector) {
  const form = document.getElementById(formId);
  if (!form) return;
  const featureInputs = form.querySelectorAll(featureInputSelector);
  featureInputs.forEach((input, idx) => {
    // Remove previous wrapper if exists
    if (input.parentElement.classList.contains('flex')) return;
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-center gap-2 mb-4';
    input.classList.add('flex-1');
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    // Create X button
    const xBtn = document.createElement('button');
    xBtn.type = 'button';
    xBtn.className = 'w-12 h-12 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-red-50';
    xBtn.innerHTML = `<svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-linecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-linecap="round"/></svg>`;
    xBtn.onclick = () => {
      input.value = '';
    };
    wrapper.appendChild(xBtn);
  });
}

// Call after DOM is ready and forms are rendered
addFeatureClearButtons('package1form', 'input[type="text"].feature-input');
addFeatureClearButtons('package2form', 'input[type="text"].feature-input');

// Add logic to clear feature input when X button is clicked
function setupFeatureClearButtons(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.querySelectorAll('.feature-clear-btn').forEach(btn => {
    btn.onclick = function() {
      const input = btn.previousElementSibling;
      if (input && input.tagName === 'INPUT') {
        input.value = '';
      }
    };
  });
}
setupFeatureClearButtons('package1form');
setupFeatureClearButtons('package2form');
  });

