document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initDestinationsCarousel();
  initFaqAccordion();
  initScrollSpy();
});

// Mobile Navigation Toggle
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu when a link is clicked
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// Destinations Infinite Carousel
function initDestinationsCarousel() {
  const carouselOuter = document.getElementById('destinationsCarousel');
  const viewport = document.getElementById('destViewport');
  const track = document.getElementById('destTrack');
  const prevBtn = document.getElementById('destPrevBtn');
  const nextBtn = document.getElementById('destNextBtn');

  if (!carouselOuter || !viewport || !track || !prevBtn || !nextBtn) return;

  const originalCards = Array.from(track.children);
  const totalOriginal = originalCards.length;
  if (totalOriginal === 0) return;

  let visibleCount = getVisibleCount();
  let cloneCount = visibleCount;
  let currentIndex = cloneCount;
  let isTransitioning = false;
  let autoPlayTimer = null;
  const AUTO_PLAY_DELAY = 2000;

  function getVisibleCount() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 4;
  }

  // Clone head and tail cards for seamless infinite looping
  function setupInfiniteTrack() {
    track.innerHTML = '';
    visibleCount = getVisibleCount();
    cloneCount = visibleCount;

    const headClones = originalCards.slice(-cloneCount).map((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      return clone;
    });

    const tailClones = originalCards.slice(0, cloneCount).map((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      return clone;
    });

    headClones.forEach((c) => track.appendChild(c));
    originalCards.forEach((c) => track.appendChild(c));
    tailClones.forEach((c) => track.appendChild(c));

    currentIndex = cloneCount;
    updatePosition(false);
  }

  function updatePosition(animate = true) {
    const firstCard = track.children[0];
    if (!firstCard) return;

    const gap = parseFloat(getComputedStyle(track).gap) || 22;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const offset = currentIndex * (cardWidth + gap);

    track.style.transition = animate
      ? 'transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)'
      : 'none';
    track.style.transform = `translateX(-${offset}px)`;

    prevBtn.disabled = false;
    nextBtn.disabled = false;
  }

  function moveToIndex(newIndex) {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex = newIndex;
    updatePosition(true);
  }

  function nextSlide() {
    moveToIndex(currentIndex + 1);
  }

  function prevSlide() {
    moveToIndex(currentIndex - 1);
  }

  // Snap silently back to real card index when reaching cloned boundaries
  track.addEventListener('transitionend', (e) => {
    if (e.propertyName !== 'transform') return;
    isTransitioning = false;

    if (currentIndex >= cloneCount + totalOriginal) {
      currentIndex = cloneCount + (currentIndex - (cloneCount + totalOriginal));
      updatePosition(false);
    } else if (currentIndex < cloneCount) {
      currentIndex = cloneCount + totalOriginal - (cloneCount - currentIndex);
      updatePosition(false);
    }
  });

  // Auto-play controls
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      if (!document.hidden) {
        nextSlide();
      }
    }, AUTO_PLAY_DELAY);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });

  carouselOuter.addEventListener('mouseenter', stopAutoPlay);
  carouselOuter.addEventListener('mouseleave', startAutoPlay);

  // Touch swipe support
  let startX = 0;
  let isDragging = false;

  viewport.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoPlay();
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diffX = startX - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 45) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    startAutoPlay();
  });

  window.addEventListener('resize', () => {
    const newVisible = getVisibleCount();
    if (newVisible !== visibleCount) {
      isTransitioning = false;
      setupInfiniteTrack();
    } else {
      updatePosition(false);
    }
  });

  setupInfiniteTrack();
  startAutoPlay();
}

// FAQ Accordion (Single Open Item)
function initFaqAccordion() {
  const accordion = document.getElementById('faqAccordion');
  if (!accordion) return;

  const items = Array.from(accordion.querySelectorAll('.faq-item'));

  items.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');

    trigger.addEventListener('click', () => {
      const isAlreadyOpen = item.classList.contains('open');

      items.forEach((otherItem) => {
        otherItem.classList.remove('open');
        otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        otherItem.querySelector('.faq-panel').style.maxHeight = null;
      });

      if (!isAlreadyOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

// Navbar Scroll Spy
function initScrollSpy() {
  const sections = document.querySelectorAll('header[id], section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const navHeight = 90;

  function highlightActiveLink() {
    const scrollPos = window.scrollY + navHeight + 60;
    let currentSectionId = 'home';

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentSectionId);
    });
  }

  window.addEventListener('scroll', highlightActiveLink, { passive: true });
  highlightActiveLink();
}