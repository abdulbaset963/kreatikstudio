// ===== KREATIK - Main JavaScript =====
let currentLang = 'ar';

// Language Toggle
function toggleLanguage() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  const html = document.documentElement;
  html.lang = currentLang;
  html.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  
  const langText = document.getElementById('lang-text');
  if (langText) langText.textContent = currentLang === 'ar' ? 'English' : 'العربية';
  document.querySelectorAll('[data-lang-option]').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-lang-option') === currentLang);
  });
  
  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute('data-' + currentLang);
    if (text) el.textContent = text;
  });
  
  document.querySelectorAll('[data-ar-placeholder]').forEach(el => {
    const placeholder = el.getAttribute('data-' + currentLang + '-placeholder');
    if (placeholder) el.placeholder = placeholder;
  });
  
  document.querySelectorAll('select option[data-en]').forEach(opt => {
    opt.textContent = opt.getAttribute('data-' + currentLang);
  });
  
  localStorage.setItem('kreatik-lang', currentLang);
}

// Mobile Menu
function toggleMobileMenu() {
  const container = document.getElementById('mobile-menu-container');
  const trigger = document.querySelector('.mobile-trigger');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  if (!container) return;

  const isOpen = container.classList.contains('open');
  container.classList.toggle('open', !isOpen);
  document.body.style.overflow = !isOpen ? 'hidden' : '';

  if (trigger) trigger.setAttribute('aria-expanded', String(!isOpen));
  if (menuIcon) menuIcon.classList.toggle('hidden', !isOpen);
  if (closeIcon) closeIcon.classList.toggle('hidden', isOpen);
}

// Close on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const container = document.getElementById('mobile-menu-container');
    if (container.classList.contains('open')) toggleMobileMenu();
  }
});

// Work Filter
function filterWork(category, btn) {
  const cards = document.querySelectorAll('.work-card');
  const buttons = document.querySelectorAll('.filter-btn');
  
  buttons.forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  
  cards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    if (category === 'all' || cardCategory === category) {
      card.style.display = 'block';
      setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.9)';
      setTimeout(() => { card.style.display = 'none'; }, 300);
    }
  });
}

// Counter Animation
function animateCounters() {
  document.querySelectorAll('.counter-value').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const update = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current) + '+';
        requestAnimationFrame(update);
      } else {
        counter.textContent = target + '+';
      }
    };
    update();
  });
}

// Reveal on Scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      if (entry.target.querySelector('.counter-value')) animateCounters();
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Navbar Scroll
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.pageYOffset > 100) {
    navbar.classList.add('bg-primary/90', 'backdrop-blur-md', 'border-b', 'border-white/10');
  } else {
    navbar.classList.remove('bg-primary/90', 'backdrop-blur-md', 'border-b', 'border-white/10');
  }
  
  const sections = ['home', 'services', 'work', 'about', 'process', 'contact'];
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 200 && rect.bottom >= 200) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active', 'text-accent');
          link.classList.add('text-gray-300');
        });
        const activeLink = document.querySelector('.nav-link[href="#' + id + '"]');
        if (activeLink) {
          activeLink.classList.add('active', 'text-accent');
          activeLink.classList.remove('text-gray-300');
        }
      }
    }
  });
});

// Contact form — submit to Formspree without leaving the page
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const contactSubmit = document.getElementById('contact-submit');
  const contactStatus = document.getElementById('contact-status');

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!this.reportValidity()) return;
    if (this.querySelector('[name="_gotcha"]')?.value) return;

    const label = contactSubmit?.querySelector('span');
    const originalLabel = label ? label.textContent : '';
    const isArabic = document.documentElement.lang === 'ar';

    if (contactSubmit) {
      contactSubmit.disabled = true;
      contactSubmit.classList.add('is-loading');
      if (label) label.textContent = isArabic ? 'جارٍ الإرسال...' : 'Sending...';
    }
    if (contactStatus) {
      contactStatus.textContent = '';
      contactStatus.className = 'contact-status';
    }

    try {
      const response = await fetch(this.action, {
        method: 'POST',
        body: new FormData(this),
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Form submission failed');

      this.reset();
      if (contactStatus) {
        contactStatus.textContent = isArabic
          ? 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.'
          : 'Your message was sent successfully. We will get back to you soon.';
        contactStatus.className = 'contact-status is-success';
      }

      const toast = document.getElementById('toast');
      if (toast) {
        toast.style.transform = 'translateY(0)';
        setTimeout(() => { toast.style.transform = 'translateY(200px)'; }, 3000);
      }
    } catch (error) {
      if (contactStatus) {
        contactStatus.textContent = isArabic
          ? 'تعذر إرسال الرسالة حالياً. حاول مرة أخرى أو راسلنا عبر البريد.'
          : 'Unable to send your message right now. Please try again or email us directly.';
        contactStatus.className = 'contact-status is-error';
      }
    } finally {
      if (contactSubmit) {
        contactSubmit.disabled = false;
        contactSubmit.classList.remove('is-loading');
        if (label) label.textContent = originalLabel;
      }
    }
  });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = document.getElementById('navbar').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// Load saved language
const savedLang = localStorage.getItem('kreatik-lang');
if (savedLang && savedLang !== 'ar') toggleLanguage();

console.log('🎨 KREATIK Website Loaded Successfully!');
