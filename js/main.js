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
  const isOpen = container.classList.contains('open');
  
  if (isOpen) {
    container.classList.remove('open');
    document.body.style.overflow = '';
  } else {
    container.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
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

// Form Submit
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const toast = document.getElementById('toast');
  toast.style.transform = 'translateY(0)';
  setTimeout(() => { toast.style.transform = 'translateY(200px)'; }, 3000);
  this.reset();
});

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