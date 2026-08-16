document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('[data-nav]');

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const setActiveLink = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Scroll reveal + skill bars ---------- */
  const revealTargets = document.querySelectorAll('.reveal, .skill__bar');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => io.observe(el));

  /* ---------- Crosshair coordinate readout (desktop hero only) ---------- */
  const hero = document.querySelector('.hero');
  const crosshairV = document.querySelector('.crosshair__v');
  const crosshairH = document.querySelector('.crosshair__h');
  const coords = document.getElementById('coords');

  if (hero && crosshairV && crosshairH && coords) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      crosshairV.style.left = `${x}px`;
      crosshairH.style.top = `${y}px`;
      coords.style.left = `${x}px`;
      coords.style.top = `${y}px`;
      coords.textContent = `X ${String(Math.round(x)).padStart(3, '0')} · Y ${String(Math.round(y)).padStart(3, '0')}`;
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  const fields = {
    name: { el: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
    message: { el: document.getElementById('message'), error: document.getElementById('messageError') },
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(key) {
    const { el, error } = fields[key];
    let message = '';

    if (!el.value.trim()) {
      message = 'This field is required.';
    } else if (key === 'email' && !emailPattern.test(el.value.trim())) {
      message = 'Enter a valid email address.';
    } else if (key === 'message' && el.value.trim().length < 10) {
      message = 'Message should be at least 10 characters.';
    }

    el.classList.toggle('is-invalid', Boolean(message));
    error.textContent = message;
    return !message;
  }

  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = Object.keys(fields).map(validateField);
    const isValid = results.every(Boolean);

    if (!isValid) {
      status.textContent = 'Please fix the highlighted fields.';
      return;
    }

    // No backend is wired up — this simulates a send.
    // Replace with a real fetch() call to your form endpoint or email service.
    status.textContent = 'Sending…';
    form.querySelector('button[type="submit"]').disabled = true;

    setTimeout(() => {
      status.textContent = `Thanks — I'll get back to you soon.`;
      form.reset();
      form.querySelector('button[type="submit"]').disabled = false;
    }, 900);
  });

});
