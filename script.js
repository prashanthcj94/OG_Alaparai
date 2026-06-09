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

// ===== FORM HANDLER =====
const form = document.getElementById('join-form');
const modal = document.getElementById('success-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

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
