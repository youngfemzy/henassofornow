/* ==========================================
   HEN & ASSOCIATES — INTERACTIVE JS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ============ PRELOADER ============
  if (typeof lucide !== 'undefined') lucide.createIcons();
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('hidden'), 300);
    });
    // Fallback: hide after 3s even if load event is slow
    setTimeout(() => preloader.classList.add('hidden'), 3000);
  }

  // Initialize Lucide icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // ============ AOS INIT ============
  if (window.AOS) {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80
    });
  }

  // ============ STICKY NAV & SCROLL INDICATOR ============
  const navbar = document.querySelector('.navbar');
  const backToTop = document.querySelector('.back-to-top');

  // Create a spacer to prevent layout jump when navbar becomes fixed - place AFTER header
  const header = document.querySelector('header');
  const navbarSpacer = document.createElement('div');
  navbarSpacer.className = 'navbar-spacer';
  navbarSpacer.style.display = 'none';
  header.parentNode.insertBefore(navbarSpacer, header.nextSibling);

  function updateNavbar() {
    const scrollY = window.scrollY;
    const topbar = document.querySelector('.topbar');
    const topbarHeight = topbar ? topbar.offsetHeight : 0;

    if (scrollY > topbarHeight) {
      navbar.classList.add('scrolled');
      if (!navbar.classList.contains('is-fixed')) {
        navbar.classList.add('is-fixed');
        navbarSpacer.style.height = navbar.offsetHeight + 'px';
        navbarSpacer.style.display = 'block';
      }
    } else {
      navbar.classList.remove('scrolled', 'is-fixed');
      navbarSpacer.style.display = 'none';
    }

    // Toggle Back to Top button
    if (scrollY > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // Back to Top functionality
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ============ MOBILE NAVIGATION ============
  const burgerMenu = document.querySelector('.burger-menu');
  const navLinks = document.querySelector('.nav-links');

  function toggleMenu() {
    burgerMenu.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  }

  function closeMenu() {
    burgerMenu.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }

  burgerMenu.addEventListener('click', toggleMenu);

  // Mobile dropdown toggle — on mobile, prevent navigation and toggle submenu
  const dropdownParents = document.querySelectorAll('.has-dropdown');
  dropdownParents.forEach(parent => {
    const trigger = parent.querySelector('.dropdown-trigger');
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        e.stopPropagation();
        dropdownParents.forEach(other => {
          if (other !== parent) other.classList.remove('dropdown-open');
        });
        parent.classList.toggle('dropdown-open');
      }
    });
  });

  // Close mobile menu when clicking any non-dropdown link
  const navLinksAll = document.querySelectorAll('.nav-links > li:not(.has-dropdown) > a');
  navLinksAll.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close mobile menu when clicking a dropdown sub-link
  const subLinks = document.querySelectorAll('.nav-dropdown a');
  subLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Handle ESC key to close mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
    }
  });

  // ============ MULTI-VIEW CAROUSEL ============
  (function () {
    var carousel = document.getElementById('servicesCarousel');
    if (!carousel) return;

    var inner = carousel.querySelector('.carousel-inner');
    var items = carousel.querySelectorAll('.carousel-item');
    var dotsWrap = document.querySelector('.slider-dots');
    if (!dotsWrap) return;
    var dots = dotsWrap.querySelectorAll('button');
    var visibleCount = 3;
    var gap = 28;

    function slideTo(index) {
      if (index < 0) index = 0;
      if (index > items.length - visibleCount) index = items.length - visibleCount;
      var itemW = items[0].offsetWidth + gap;
      inner.style.transform = 'translateX(' + (-index * itemW) + 'px)';
      items.forEach(function (item, i) {
        item.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    var currentIndex = 0;

    carousel.querySelector('.slider-prev').addEventListener('click', function () {
      currentIndex--;
      if (currentIndex < 0) currentIndex = items.length - visibleCount;
      slideTo(currentIndex);
    });

    carousel.querySelector('.slider-next').addEventListener('click', function () {
      currentIndex++;
      if (currentIndex > items.length - visibleCount) currentIndex = 0;
      slideTo(currentIndex);
    });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        currentIndex = i;
        slideTo(currentIndex);
      });
    });

    var autoTimer = null;
    function startAuto() {
      stopAuto();
      autoTimer = setInterval(function () {
        currentIndex++;
        if (currentIndex > items.length - visibleCount) currentIndex = 0;
        slideTo(currentIndex);
      }, 4000);
    }
    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    window.addEventListener('resize', function () { slideTo(currentIndex); });

    slideTo(0);
    startAuto();
  })();

  // ============ ACTIVE NAVIGATION STATE ON SCROLL ============
  const sections = document.querySelectorAll('section[id], footer[id]');
  const scrollLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 150; // offset for nav

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    scrollLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // ============ DYNAMIC HERO COUNTER ANIMATION ============
  function countUp(elementId, targetValue, duration = 1500) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easedProgress * targetValue);
      element.textContent = currentValue;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = targetValue;
      }
    };
    window.requestAnimationFrame(step);
  }

  // Count up stats observer
  const statsSection = document.querySelector('.hero');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        countUp('statYears', 10);
        countUp('statOffices', 3);
        countUp('statWorkers', 10);
      }
    });
  }, { threshold: 0.2 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ============ COUNTER ANIMATION FOR ALL + NUMBERS ============
  const counters = document.querySelectorAll('.counter');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const duration = 2000;
        let startTime = null;

        const animate = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.floor(eased * target);

          if (progress < 1) {
            window.requestAnimationFrame(animate);
          } else {
            counter.textContent = target;
          }
        };

        window.requestAnimationFrame(animate);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // ============ DYNAMIC PRESENCE SVG GAUGES ============
  const gauges = document.querySelectorAll('.gauge-item');
  let gaugesAnimated = false;

  const gaugesObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !gaugesAnimated) {
        gaugesAnimated = true;

        gauges.forEach(gauge => {
          const targetValue = parseInt(gauge.getAttribute('data-value'), 10);
          const fill = gauge.querySelector('.gauge-fill');
          const countSpan = gauge.querySelector('.gauge-count');

          // Animate SVG stroke offset
          // Total circumference of circle radius 45 is 2 * Math.PI * 45 = ~282.7
          const circumference = 282.7;

          // Determine percentage value for gauge dial fill (from 0 to 100)
          let fillPercentage = targetValue;
          if (targetValue === 10) fillPercentage = 85; // Boost visualization on layout
          if (targetValue === 3) fillPercentage = 60;  // Boost visualization on layout
          if (targetValue === 100) fillPercentage = 95;

          const strokeOffset = circumference - (fillPercentage / 100) * circumference;

          // Trigger stroke-dashoffset transition
          setTimeout(() => {
            fill.style.strokeDashoffset = strokeOffset;
          }, 100);

          // Animate number count-up inside gauge
          let countStart = 0;
          const countDuration = 1500;
          let countStartTimestamp = null;

          const countStep = (timestamp) => {
            if (!countStartTimestamp) countStartTimestamp = timestamp;
            const progress = Math.min((timestamp - countStartTimestamp) / countDuration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            countSpan.textContent = Math.floor(eased * targetValue);

            if (progress < 1) {
              window.requestAnimationFrame(countStep);
            } else {
              countSpan.textContent = targetValue;
            }
          };
          window.requestAnimationFrame(countStep);
        });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const presenceSection = document.querySelector('.presence');
  if (presenceSection) {
    gaugesObserver.observe(presenceSection);
  }

  // ============ CAPABILITIES CARD ACCORDION ============
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Avoid interference if clicking a sub-link (if any existed)
      const isActive = card.classList.contains('active');

      // Close all cards
      serviceCards.forEach(c => {
        c.classList.remove('active');
      });

      // Toggle current card active state
      if (!isActive) {
        card.classList.add('active');
      }
    });
  });

  // ============ PROJECT READ MORE TOGGLES ============
  const projectToggles = document.querySelectorAll('.project-toggle');

  projectToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent card click bubble
      const card = toggle.closest('.project-card');
      const textSpan = toggle.querySelector('.toggle-text');

      card.classList.toggle('open');

      if (card.classList.contains('open')) {
        textSpan.textContent = 'Collapse';
      } else {
        textSpan.textContent = 'Read More';
      }
    });
  });

  // ============ NEWSLETTER FORM SIGNUP ============
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterMsg = document.getElementById('newsletterMsg');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailValue = newsletterEmail.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Reset message styles
      newsletterMsg.className = 'newsletter-msg';
      newsletterMsg.textContent = '';

      if (!emailValue) {
        newsletterMsg.textContent = 'Please enter an email address.';
        newsletterMsg.classList.add('err');
        newsletterEmail.focus();
        return;
      }

      if (!emailRegex.test(emailValue)) {
        newsletterMsg.textContent = 'Please enter a valid email address.';
        newsletterMsg.classList.add('err');
        newsletterEmail.focus();
        return;
      }

      // Simulate successful signup
      newsletterMsg.textContent = 'Subscribed successfully! Welcome to Hen & Associates.';
      newsletterMsg.classList.add('ok');
      newsletterEmail.value = '';
    });
  }

  // ============ SERVICES LOAD MORE / SEE LESS ============
  const loadMoreBtn = document.getElementById('servicesLoadMore');
  const seeLessBtn = document.getElementById('servicesSeeLess');
  if (loadMoreBtn && seeLessBtn) {
    const hiddenCards = document.querySelectorAll('.services-grid-home .service-hidden');
    let loaded = 0;
    const batchSize = 4;

    function updateCount() {
      const remaining = hiddenCards.length - loaded;
      if (remaining > 0) {
        loadMoreBtn.textContent = 'Load More (' + remaining + ')';
        loadMoreBtn.style.display = '';
      } else {
        loadMoreBtn.style.display = 'none';
      }
      if (loaded > 0) {
        seeLessBtn.classList.add('active');
      } else {
        seeLessBtn.classList.remove('active');
      }
    }

    loadMoreBtn.addEventListener('click', () => {
      const end = Math.min(loaded + batchSize, hiddenCards.length);
      for (let i = loaded; i < end; i++) {
        hiddenCards[i].classList.remove('service-hidden');
        hiddenCards[i].classList.add('service-visible');
      }
      loaded = end;
      updateCount();
      if (window.lucide) window.lucide.createIcons();
    });

    seeLessBtn.addEventListener('click', () => {
      hiddenCards.forEach(card => {
        card.classList.remove('service-visible');
        card.classList.add('service-hidden');
      });
      loaded = 0;
      updateCount();
      document.querySelector('.services-grid-home').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
});
