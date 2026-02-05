/* ============================================
   CYBERSECURITY AWARENESS - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initLoader();
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initParallax();
  initBackToTop();
  initAccordion();
  initContactForm();
  initCounters();
  initSmoothReveal();
  initTiltEffect();
});

/* ============================================
   PAGE LOADER
   ============================================ */
function initLoader() {
  const loader = document.querySelector('.loader');
  if (loader) {
    // Ensure loader hides after page is fully loaded
    const hideLoader = () => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.classList.add('hidden');
        loader.style.display = 'none';
        // Trigger initial animations after loader hides
        document.body.classList.add('loaded');
      }, 300);
    };
    
    // Hide loader when page is fully loaded
    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 200);
    } else {
      window.addEventListener('load', () => {
        setTimeout(hideLoader, 200);
      });
    }
  }
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove background opacity based on scroll
    if (currentScroll > 50) {
      navbar.style.background = 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)';
    } else {
      navbar.style.background = 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)';
    }
    
    lastScroll = currentScroll;
  });
  
  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar__link, .navbar__mobile-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
  const toggle = document.querySelector('.navbar__toggle');
  const mobileMenu = document.querySelector('.navbar__mobile');
  const mobileLinks = document.querySelectorAll('.navbar__mobile-link');
  
  if (!toggle || !mobileMenu) return;
  
  // Toggle menu with animation
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = toggle.classList.contains('active');
    
    if (!isActive) {
      toggle.classList.add('active');
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Animate links sequentially
      mobileLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateX(-20px)';
        setTimeout(() => {
          link.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          link.style.opacity = '1';
          link.style.transform = 'translateX(0)';
        }, 100 + (index * 50));
      });
    } else {
      closeMenu();
    }
  });
  
  // Close menu function
  function closeMenu() {
    toggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset link styles
    mobileLinks.forEach(link => {
      link.style.opacity = '';
      link.style.transform = '';
      link.style.transition = '';
    });
  }
  
  // Close menu when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('active') && 
        !toggle.contains(e.target) && 
        !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });
  
  // Close menu on window resize (if larger than mobile breakpoint)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth > 992 && mobileMenu.classList.contains('active')) {
        closeMenu();
      }
    }, 100);
  });
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-up, .stagger-item');
  
  if (!animatedElements.length) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '-50px 0px',
    threshold: 0.15
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add stagger delay for stagger items
        if (entry.target.classList.contains('stagger-item')) {
          const parent = entry.target.closest('.features, .gallery, .content-grid, .team-grid, .stats-grid, .tips-list, .threat-cards, .icon-boxes, .resource-grid');
          if (parent) {
            const items = parent.querySelectorAll('.stagger-item');
            const itemIndex = Array.from(items).indexOf(entry.target);
            entry.target.style.transitionDelay = `${itemIndex * 80}ms`;
          }
        }
        
        // Use requestAnimationFrame for smoother animations
        requestAnimationFrame(() => {
          entry.target.classList.add('visible');
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(el => observer.observe(el));
}

/* ============================================
   SMOOTH REVEAL (Additional animation system)
   ============================================ */
function initSmoothReveal() {
  const sections = document.querySelectorAll('.section, .page-hero');
  
  if (!sections.length) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '-100px 0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
      }
    });
  }, observerOptions);
  
  sections.forEach(section => observer.observe(section));
}

/* ============================================
   PARALLAX EFFECT
   ============================================ */
function initParallax() {
  const parallaxElements = document.querySelectorAll('.hero__parallax-element');
  
  if (!parallaxElements.length) return;
  
  // Disable parallax on mobile for better performance
  if (window.innerWidth < 768) return;
  
  let ticking = false;
  let lastScrollY = 0;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    
    // Only update if scroll position actually changed
    if (scrolled === lastScrollY) {
      ticking = false;
      return;
    }
    
    lastScrollY = scrolled;
    
    parallaxElements.forEach((el, index) => {
      const speed = 0.05 + (index * 0.02);
      const yPos = -(scrolled * speed);
      const scale = 1 + (scrolled * 0.0001);
      el.style.transform = `translate3d(0, ${yPos}px, 0) scale(${scale})`;
    });
    
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================
   TILT EFFECT FOR CARDS
   ============================================ */
function initTiltEffect() {
  // Only enable on desktop
  if (window.innerWidth < 992) return;
  
  const cards = document.querySelectorAll('.feature-card, .content-card, .team-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
function initBackToTop() {
  const backToTop = document.querySelector('.back-to-top');
  
  if (!backToTop) return;
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ============================================
   ACCORDION
   ============================================ */
function initAccordion() {
  const accordionItems = document.querySelectorAll('.accordion__item');
  
  if (!accordionItems.length) return;
  
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion__header');
    
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      accordionItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ============================================
   CONTACT FORM VALIDATION
   ============================================ */
function initContactForm() {
  const form = document.querySelector('.contact-form form');
  const formSuccess = document.querySelector('.form-success');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    const fields = form.querySelectorAll('input, textarea');
    
    fields.forEach(field => {
      const errorMessage = field.nextElementSibling;
      
      // Reset error state
      field.classList.remove('error');
      if (errorMessage && errorMessage.classList.contains('error-message')) {
        errorMessage.style.display = 'none';
      }
      
      // Check if required and empty
      if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        field.classList.add('error');
        if (errorMessage && errorMessage.classList.contains('error-message')) {
          errorMessage.style.display = 'block';
        }
      }
      
      // Validate email format
      if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          isValid = false;
          field.classList.add('error');
          if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.textContent = 'Please enter a valid email address';
            errorMessage.style.display = 'block';
          }
        }
      }
    });
    
    if (isValid) {
      // Show success message
      form.style.display = 'none';
      if (formSuccess) {
        formSuccess.classList.add('active');
      }
      
      // Reset form
      form.reset();
    }
  });
  
  // Real-time validation
  const fields = form.querySelectorAll('input, textarea');
  fields.forEach(field => {
    field.addEventListener('blur', () => {
      validateField(field);
    });
    
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        validateField(field);
      }
    });
  });
}

function validateField(field) {
  const errorMessage = field.nextElementSibling;
  
  // Reset error state
  field.classList.remove('error');
  if (errorMessage && errorMessage.classList.contains('error-message')) {
    errorMessage.style.display = 'none';
  }
  
  // Check if required and empty
  if (field.hasAttribute('required') && !field.value.trim()) {
    field.classList.add('error');
    if (errorMessage && errorMessage.classList.contains('error-message')) {
      errorMessage.textContent = 'This field is required';
      errorMessage.style.display = 'block';
    }
    return false;
  }
  
  // Validate email format
  if (field.type === 'email' && field.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value)) {
      field.classList.add('error');
      if (errorMessage && errorMessage.classList.contains('error-message')) {
        errorMessage.textContent = 'Please enter a valid email address';
        errorMessage.style.display = 'block';
      }
      return false;
    }
  }
  
  return true;
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  if (!counters.length) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000;
  const startTime = performance.now();
  const startValue = 0;
  
  // Easing function for smooth animation
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);
    
    element.textContent = currentValue.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toLocaleString();
    }
  }
  
  requestAnimationFrame(updateCounter);
}

/* ============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/* ============================================
   INTERACTIVE HOVER EFFECTS
   ============================================ */
// Remove duplicate hover handling since we now have CSS and tilt effects
// Cards now use CSS transitions and the tiltEffect function for hover states

/* ============================================
   TYPEWRITER EFFECT (Optional for hero)
   ============================================ */
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

/* ============================================
   RIPPLE EFFECT FOR BUTTONS
   ============================================ */
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      left: ${x}px;
      top: ${y}px;
      width: 100px;
      height: 100px;
      margin-left: -50px;
      margin-top: -50px;
      pointer-events: none;
    `;
    
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple animation to stylesheet
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

/* ============================================
   LAZY LOADING IMAGES
   ============================================ */
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
}

/* ============================================
   KEYBOARD NAVIGATION
   ============================================ */
document.addEventListener('keydown', (e) => {
  // ESC key closes mobile menu
  if (e.key === 'Escape') {
    const toggle = document.querySelector('.navbar__toggle');
    const mobileMenu = document.querySelector('.navbar__mobile');
    
    if (toggle && mobileMenu && mobileMenu.classList.contains('active')) {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

/* ============================================
   PREFERS REDUCED MOTION
   ============================================ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
  document.documentElement.style.scrollBehavior = 'auto';
  
  // Disable animations
  document.querySelectorAll('.fade-up, .stagger-item').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}
