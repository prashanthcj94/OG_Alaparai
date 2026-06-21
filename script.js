// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => { navLinks.classList.remove('open'); hamburger.classList.remove('active'); });
  });
}

// ===== ACTIVE NAV ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop, h = sec.offsetHeight, id = sec.getAttribute('id');
    if (scrollY >= top && scrollY < top + h) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
});

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-num');
let counted = false;
function animateCounters() {
  counters.forEach(counter => {
    const target = +counter.dataset.target;
    const duration = 1500;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      counter.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(update);
      else counter.textContent = target;
    }
    requestAnimationFrame(update);
  });
}
window.addEventListener('scroll', () => {
  if (!counted && window.scrollY > 100) { counted = true; animateCounters(); }
});

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.about-card,.content-item,.role-card,.perks-card,.location-card,.form-card,.direct-email-card').forEach(el => {
  el.style.opacity = '0'; el.style.transform = 'translateY(30px)'; el.style.transition = 'all .6s ease';
  observer.observe(el);
});
// CSS class for revealed
const style = document.createElement('style');
style.textContent = '.revealed{opacity:1!important;transform:translateY(0)!important}';
document.head.appendChild(style);

// ===== PARTICLES =====
const particlesEl = document.getElementById('particles');
if (particlesEl) {
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 4 + 1;
    Object.assign(p.style, {
      position: 'absolute', width: size + 'px', height: size + 'px',
      background: Math.random() > 0.5 ? 'var(--gold)' : 'var(--red)',
      borderRadius: '50%', opacity: Math.random() * 0.3 + 0.1,
      left: Math.random() * 100 + '%', top: Math.random() * 100 + '%',
      animation: `floatParticle ${Math.random() * 4 + 4}s infinite ease-in-out ${Math.random() * 3}s`
    });
    particlesEl.appendChild(p);
  }
  const pStyle = document.createElement('style');
  pStyle.textContent = '@keyframes floatParticle{0%,100%{transform:translate(0,0)}25%{transform:translate(10px,-15px)}50%{transform:translate(-5px,-25px)}75%{transform:translate(15px,-10px)}}.hero-particles{position:absolute;inset:0;pointer-events:none;overflow:hidden}';
  document.head.appendChild(pStyle);
}

// ===== FORM HANDLER WITH VALIDATION =====
const form = document.getElementById('join-form');
const modal = document.getElementById('success-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');

if (form) {
  const requiredInputs = form.querySelectorAll('[required]');

  // Function to show error for a field
  function showFieldError(input, message) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    formGroup.classList.add('has-error');
    
    // Check if error message element already exists
    let errorEl = formGroup.querySelector('.error-message');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'error-message';
      formGroup.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  // Function to clear error for a field
  function clearFieldError(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    formGroup.classList.remove('has-error');
    const errorEl = formGroup.querySelector('.error-message');
    if (errorEl) {
      errorEl.remove();
    }
  }

  // Function to validate a single field
  function validateField(input) {
    // 1. Check if empty
    if (!input.value || input.value.trim() === '') {
      let labelText = '';
      const label = input.closest('.form-group')?.querySelector('label');
      if (label) {
        labelText = label.textContent.replace('*', '').trim();
      } else {
        labelText = input.placeholder || 'This field';
      }
      showFieldError(input, `${labelText} is required`);
      return false;
    }
    
    // 2. Email format validation
    if (input.type === 'email') {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(input.value.trim())) {
        showFieldError(input, 'Please enter a valid email address');
        return false;
      }
    }
    
    // 3. Phone format validation
    if (input.type === 'tel') {
      const phonePattern = /^[0-9\s\-()+]{10,15}$/;
      if (!phonePattern.test(input.value.trim())) {
        showFieldError(input, 'Please enter a valid phone number (min 10 digits)');
        return false;
      }
    }
    
    // 4. Age range validation
    if (input.id === 'age') {
      const ageVal = parseInt(input.value, 10);
      const minAge = parseInt(input.getAttribute('min'), 10) || 15;
      const maxAge = parseInt(input.getAttribute('max'), 10) || 50;
      if (isNaN(ageVal) || ageVal < minAge || ageVal > maxAge) {
        showFieldError(input, `Age must be between ${minAge} and ${maxAge}`);
        return false;
      }
    }

    clearFieldError(input);
    return true;
  }

  // Bind dynamic listeners for validation while typing
  requiredInputs.forEach(input => {
    if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
      input.addEventListener('input', () => {
        validateField(input);
      });
      input.addEventListener('blur', () => {
        validateField(input);
      });
    } else if (input.tagName === 'SELECT') {
      input.addEventListener('change', () => {
        validateField(input);
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields on submit
    let isFormValid = true;
    let firstInvalidInput = null;

    requiredInputs.forEach(input => {
      const isValid = validateField(input);
      if (!isValid) {
        isFormValid = false;
        if (!firstInvalidInput) {
          firstInvalidInput = input;
        }
      }
    });

    if (!isFormValid) {
      if (firstInvalidInput) {
        firstInvalidInput.focus();
        firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return; // Stop form submission
    }

    const btn = document.getElementById('submit-application-btn');
    btn.disabled = true;
    btn.textContent = '⏳ Submitting...';
    btn.style.background = '#888';

    const data = new FormData(form);
    const name = data.get('fullName') || '';
    const role = data.get('role') || '';
    const email = data.get('email') || '';
    const phone = data.get('phone') || '';
    const location = data.get('location') || '';
    const experience = data.get('experience') || '';
    const whyJoin = data.get('whyJoin') || '';
    const social = data.get('socialLinks') || '';
    const age = data.get('age') || '';

    // Send via FormSubmit AJAX
    fetch("https://formsubmit.co/ajax/contact@ogalaparai.com", {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "Name": name,
        "Age": age,
        "Phone": phone,
        "Email": email,
        "Location": location,
        "Role": role,
        "Experience/Skills": experience,
        "Social/Portfolio Links": social,
        "Why Join": whyJoin
      })
    })
    .then(response => response.json())
    .then(result => {
      btn.disabled = false;
      btn.textContent = '🔥 Submit My Application';
      btn.style.background = '';
      
      if (modal) {
        modal.classList.add('open');
      } else {
        alert("Thank You your response have been Submitted");
      }
      
      form.reset();
      // Clear any remaining success/error styling states
      requiredInputs.forEach(input => clearFieldError(input));
    })
    .catch(error => {
      console.error("Error submitting form:", error);
      btn.disabled = false;
      btn.textContent = '🔥 Submit My Application';
      btn.style.background = '';
      alert("Something went wrong. Please try sending details directly to contact@ogalaparai.com");
    });
  });
}

if (modalCloseBtn && modal) {
  modalCloseBtn.addEventListener('click', () => {
    modal.classList.remove('open');
  });
}

// ===== FLOATING WHATSAPP BUTTON WITH RECURRING TOOLTIP =====
function initWhatsAppFloat() {
  const wa = document.createElement('a');
  wa.href = 'https://wa.me/917010539367';
  wa.target = '_blank';
  wa.rel = 'noopener';
  wa.className = 'whatsapp-float';
  wa.setAttribute('aria-label', 'Chat on WhatsApp');
  wa.innerHTML = `
    <div class="whatsapp-tooltip">
      <span>💬 Connect now via WhatsApp</span>
      <button class="tooltip-close" aria-label="Close tooltip">&times;</button>
    </div>
    <img src="whatsapp.png" alt="WhatsApp" />
  `;
  document.body.appendChild(wa);

  // Close button event listener
  const closeBtn = wa.querySelector('.tooltip-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      wa.classList.remove('show-tooltip');
      sessionStorage.setItem('wa-tooltip-dismissed', 'true');
    });
  }

  // Function to show/hide tooltip
  function triggerTooltip() {
    if (sessionStorage.getItem('wa-tooltip-dismissed')) return;
    wa.classList.add('show-tooltip');
    
    // Auto-hide the tooltip after 4 seconds
    setTimeout(() => {
      wa.classList.remove('show-tooltip');
    }, 4000);
  }

  // Initial delay of 5 seconds on page load
  setTimeout(() => {
    triggerTooltip();
  }, 5000);

  // Repeat every 14 seconds (10 seconds gap + 4 seconds visible = 14 seconds cycle)
  let intervalId = setInterval(() => {
    if (sessionStorage.getItem('wa-tooltip-dismissed')) {
      clearInterval(intervalId);
      return;
    }
    triggerTooltip();
  }, 14000);
}
initWhatsAppFloat();

// ===== APPLICATION FORM MODAL =====
(function () {
  const overlay  = document.getElementById('app-modal-overlay');
  const appModal = document.getElementById('app-modal');
  if (!overlay || !appModal) return;

  const appForm       = document.getElementById('app-modal-form');
  const formSection   = document.getElementById('app-modal-form-section');
  const successSection= document.getElementById('app-modal-success');
  const submitBtn     = document.getElementById('app-modal-submit-btn');
  const closeBtns     = document.querySelectorAll('.app-modal-close');
  const successClose  = document.getElementById('app-modal-success-close');

  // --- Open ---
  function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    appModal.scrollTop = 0;
    // Reset to form view
    if (formSection) formSection.style.display = '';
    if (successSection) successSection.style.display = 'none';
  }

  // --- Close ---
  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Trigger open on all "Join Us" / "Join the Team" triggers
  document.querySelectorAll('[data-open-join-modal]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  // Close on X button(s)
  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

  // Close on overlay backdrop click
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // Success close
  if (successClose) successClose.addEventListener('click', closeModal);

  // --- Validation helpers ---
  function showErr(input, msg) {
    const grp = input.closest('.form-group');
    if (!grp) return;
    grp.classList.add('has-error');
    let el = grp.querySelector('.error-message');
    if (!el) { el = document.createElement('span'); el.className = 'error-message'; grp.appendChild(el); }
    el.textContent = msg;
  }

  function clearErr(input) {
    const grp = input.closest('.form-group');
    if (!grp) return;
    grp.classList.remove('has-error');
    const el = grp.querySelector('.error-message');
    if (el) el.remove();
  }

  function validateInput(input) {
    const val = input.value.trim();
    const labelEl = input.closest('.form-group')?.querySelector('label');
    const labelTxt = labelEl ? labelEl.textContent.replace('*','').trim() : 'This field';

    if (!val) { showErr(input, `${labelTxt} is required`); return false; }

    if (input.type === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { showErr(input, 'Enter a valid email address'); return false; }
    }
    if (input.type === 'tel') {
      if (!/^[0-9\s\-()+]{10,15}$/.test(val)) { showErr(input, 'Enter a valid phone number (min 10 digits)'); return false; }
    }
    if (input.id === 'am-age') {
      const age = parseInt(val, 10);
      if (isNaN(age) || age < 15 || age > 60) { showErr(input, 'Age must be between 15 and 60'); return false; }
    }
    clearErr(input);
    return true;
  }

  if (!appForm) return;

  // Live validation
  appForm.querySelectorAll('[required]').forEach(inp => {
    const evt = (inp.tagName === 'SELECT') ? 'change' : 'input';
    inp.addEventListener(evt, () => validateInput(inp));
    inp.addEventListener('blur',   () => validateInput(inp));
  });

  // --- Submit ---
  appForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const required = appForm.querySelectorAll('[required]');
    let valid = true, firstBad = null;

    required.forEach(inp => {
      if (!validateInput(inp)) { valid = false; if (!firstBad) firstBad = inp; }
    });

    if (!valid) {
      if (firstBad) { firstBad.focus(); firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Submitting...';

    const fd = new FormData(appForm);

    fetch('https://formsubmit.co/ajax/contact@ogalaparai.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        Name:                fd.get('am-fullName') || '',
        Age:                 fd.get('am-age')      || '',
        Phone:               fd.get('am-phone')    || '',
        Email:               fd.get('am-email')    || '',
        Location:            fd.get('am-location') || '',
        Role:                fd.get('am-role')     || '',
        'Experience/Skills': fd.get('am-experience') || '',
        'Social/Portfolio':  fd.get('am-socialLinks') || '',
        'Why Join':          fd.get('am-whyJoin')  || ''
      })
    })
    .then(r => r.json())
    .then(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = '🔥 Submit My Application';
      appForm.reset();
      appForm.querySelectorAll('[required]').forEach(clearErr);
      if (formSection) formSection.style.display = 'none';
      if (successSection) { successSection.style.display = 'block'; }
    })
    .catch(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = '🔥 Submit My Application';
      alert('Something went wrong. Please email us directly at contact@ogalaparai.com');
    });
  });
})();
