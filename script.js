(function () {
  // Mobile menu
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    // Close on link click
    mobileMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => mobileMenu.classList.add("hidden"));
    });
  }

  // Helper: build selection message
  function buildSelectedValue(type, preset) {
    if (!preset) return "";
    if (type === "service") return `I want ${preset} Service`;
    if (type === "plan") return `I selected ${preset}`;
    // general
    if (preset.toLowerCase().includes("consultation")) return "I want Free Consultation";
    if (preset.toLowerCase().includes("get free consultation")) return "I want Free Consultation";
    return preset;
  }

  // When clicking buttons that go to contact.html, append query params
  document.querySelectorAll('a[href$="contact.html"], a[href$="./contact.html"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const preset = link.getAttribute("data-preset") || "";
      const type = link.getAttribute("data-type") || "general";

      // Only apply if we have a preset
      if (!preset) return;

      const selectedValue = buildSelectedValue(type, preset);
      const url = new URL(link.href, window.location.href);
      url.searchParams.set("selected", selectedValue);

      // Keep a short preset too (optional)
      url.searchParams.set("preset", preset);
      url.searchParams.set("type", type);

      e.preventDefault();
      window.location.href = url.toString();
    });
  });

  // On contact.html, read query params and prefill dropdown + preview
  const selectedItem = document.getElementById("selectedItem");
  const selectedPreview = document.getElementById("selectedPreview");

  if (selectedItem) {
    const params = new URLSearchParams(window.location.search);
    const selected = params.get("selected");

    if (selected) {
      // Try to match exact option
      const options = Array.from(selectedItem.options);
      const match = options.find((o) => o.value === selected);
      if (match) {
        selectedItem.value = selected;
      } else {
        // If not found, add it as a new option
        const opt = document.createElement("option");
        opt.value = selected;
        opt.textContent = selected;
        selectedItem.appendChild(opt);
        selectedItem.value = selected;
      }

      if (selectedPreview) {
        selectedPreview.textContent = selected;
      }
    }

    // Update preview on manual change
    selectedItem.addEventListener("change", () => {
      if (selectedPreview) {
        selectedPreview.textContent = selectedItem.value || "Not selected yet — you can choose from dropdown below.";
      }
    });
  }

  // Contact form submit (demo) — opens email draft (mailto) + confirmation
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name")?.value?.trim() || "";
      const email = document.getElementById("email")?.value?.trim() || "";
      const selected = document.getElementById("selectedItem")?.value?.trim() || "";
      const message = document.getElementById("message")?.value?.trim() || "";

      const subject = encodeURIComponent(`Manglotel Inquiry — ${selected || "General Inquiry"}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nSelected: ${selected}\n\nMessage:\n${message}\n\n— Sent via Manglotel website`
      );

      // Replace receiver email here
      const receiver = "your@email.com";
      const mailto = `mailto:${receiver}?subject=${subject}&body=${body}`;

      // Open mail client draft
      window.location.href = mailto;

      // Also show a confirmation
      alert("Your request is ready in your email app. If it didn't open, please copy your message and send manually.");

      contactForm.reset();
      const selectedPreview = document.getElementById("selectedPreview");
      if (selectedPreview) selectedPreview.textContent = "Not selected yet — you can choose from dropdown below.";
    });
  }
})();


document.addEventListener("DOMContentLoaded", function(){

    emailjs.init({
        publicKey: "dOeWicdDqp5Bdpzwa"
    });

    const form = document.getElementById("contactForm");

    form.addEventListener("submit", function(e){

        e.preventDefault();

        const button = form.querySelector("button[type='submit']");
        const originalText = button.innerHTML;

        button.disabled = true;
        button.innerHTML = "Sending...";

        emailjs.sendForm(
            "service_spdawa8",
            "template_5cjkkyd",
            form
        )
        .then(function(){

            alert("✅ Message Sent Successfully!");
            form.reset();

        })
        .catch(function(err){

            alert("❌ Failed to send message");
            console.log(err);

        })
        .finally(function(){

            button.disabled = false;
            button.innerHTML = originalText;

        });

    });

});






// form adding 
// Form submission for direct submission without opening email app
// Form submission for direct submission - NO EMAIL APP OPENING
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoading = document.getElementById('btnLoading');
const selectedItem = document.getElementById('selectedItem');
const selectedPreview = document.getElementById('selectedPreview');
const successPopup = document.getElementById('successPopup');
const errorPopup = document.getElementById('errorPopup');
const errorMessage = document.getElementById('errorMessage');

// Update preview when select changes
selectedItem.addEventListener('change', function() {
    selectedPreview.textContent = this.value || 'Not selected yet — you can choose from dropdown below.';
});

// Auto-fill from URL parameters
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    const service = urlParams.get('service');
    
    if (plan) {
        const optionText = `I selected ${plan}`;
        Array.from(selectedItem.options).forEach(option => {
            if (option.value === optionText) {
                selectedItem.value = optionText;
                selectedPreview.textContent = optionText;
            }
        });
    }
    
    if (service) {
        const optionText = `I want ${service}`;
        Array.from(selectedItem.options).forEach(option => {
            if (option.value === optionText) {
                selectedItem.value = optionText;
                selectedPreview.textContent = optionText;
            }
        });
    }
});

// Show success popup
window.showSuccessPopup = function() {
    successPopup.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Auto close after 3 seconds
    setTimeout(() => {
        closeSuccessPopup();
    }, 3000);
};

// Close success popup
window.closeSuccessPopup = function() {
    successPopup.classList.add('hidden');
    document.body.style.overflow = 'auto';
};

// Show error popup
window.showErrorPopup = function(message) {
    errorMessage.textContent = message || 'Something went wrong. Please try again.';
    errorPopup.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

// Close error popup
window.closeErrorPopup = function() {
    errorPopup.classList.add('hidden');
    document.body.style.overflow = 'auto';
};

// Form submission
form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Show loading state
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    submitBtn.disabled = true;

    // Create form data
    const formData = new FormData(form);
    
    // Ensure all required fields are present
    formData.set('access_key', 'ed573845-ba48-4272-8d1b-d05dd221bbc9');
    formData.set('subject', 'New Service Inquiry - Website');
    formData.set('from_name', 'Website Contact Form');
    formData.set('redirect', 'false');
    formData.set('botcheck', '');

    try {
        // Send to Web3Forms API
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        const data = await response.json();
        console.log('Web3Forms Response:', data);

        if (data.success) {
            // Show success popup
            showSuccessPopup();
            // Reset form
            form.reset();
            selectedPreview.textContent = 'Not selected yet — you can choose from dropdown below.';
        } else {
            showErrorPopup(data.message || 'Failed to send message. Please try again.');
        }
    } catch (error) {
        console.error('Submission Error:', error);
        showErrorPopup('Network error. Please check your connection and try again.');
    } finally {
        // Reset button state
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        submitBtn.disabled = false;
    }
});

// Close popups when clicking outside
successPopup.addEventListener('click', function(e) {
    if (e.target === successPopup) {
        closeSuccessPopup();
    }
});

errorPopup.addEventListener('click', function(e) {
    if (e.target === errorPopup) {
        closeErrorPopup();
    }
});

// Close popups with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSuccessPopup();
        closeErrorPopup();
    }
});