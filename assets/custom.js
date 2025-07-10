// ===============================================
// ENHANCED SCROLL SYSTEM - HOMEPAGE ONLY
// Consolidates custom.js + scroll-fix.js functionality
// USING ORIGINAL WORKING DOT CREATION METHOD
// ===============================================

console.log('🚀 Enhanced Scroll System Loading...');

// ===============================================
// HOMEPAGE DETECTION UTILITY
// ===============================================
function isHomepage() {
  const bodyHasHomeClass = document.body.classList.contains('home-section');
  const templateIsIndex = document.body.classList.contains('template-index') || 
                          window.location.pathname === '/' || 
                          window.location.pathname === '/index' ||
                          (typeof template !== 'undefined' && template.includes('index'));
  
  const isRootPath = window.location.pathname === '/' || 
                     window.location.pathname === '/index.html' ||
                     window.location.pathname.endsWith('/index');
  
  const result = bodyHasHomeClass || templateIsIndex || isRootPath;
  console.log('🏠 Homepage check:', result);
  return result;
}

// ===============================================
// SCROLL SYSTEM CORE
// ===============================================
let scrollSystem = {
  $sections: null,
  inScroll: false,
  durationOneScroll: 600,
  currentSection: 0,
  arrSections: [],
  isEnabled: false,
  initialized: false,
  resizeTimeout: null,
  dotNavigation: null
};

// ===============================================
// MOBILE TOUCH SUPPORT - COMPLETELY REWRITTEN
// ===============================================
let touchStartY = 0;
let touchEndY = 0;
let touchStartTime = 0;
let touchStartX = 0;
let touchEndX = 0;
let initialTouchY = 0;
let hasMoved = false;
let touchDistance = 0;
let isVerticalSwipe = false;

function handleTouchStart(e) {
  if (!isHomepage() || !scrollSystem.isEnabled || scrollSystem.inScroll) return;
  
  const touch = e.touches[0];
  touchStartY = touch.clientY;
  touchStartX = touch.clientX;
  initialTouchY = touch.clientY;
  touchStartTime = Date.now();
  hasMoved = false;
  touchDistance = 0;
  isVerticalSwipe = false;
  
  console.log('📱 Touch start at:', touchStartY);
}

function handleTouchMove(e) {
  if (!isHomepage() || !scrollSystem.isEnabled || scrollSystem.inScroll) return;
  
  const touch = e.touches[0];
  const deltaY = Math.abs(touch.clientY - initialTouchY);
  const deltaX = Math.abs(touch.clientX - touchStartX);
  
  touchDistance = deltaY;
  
  // Determine if this is a vertical swipe
  if (deltaY > 15 && deltaY > deltaX * 1.5) {
    isVerticalSwipe = true;
    hasMoved = true;
    
    // Prevent default scrolling on vertical swipes
    e.preventDefault();
    e.stopPropagation();
  }
  
  // If significant movement, mark as moved
  if (deltaY > 10 || deltaX > 10) {
    hasMoved = true;
  }
}

function handleTouchEnd(e) {
  if (!isHomepage() || !scrollSystem.isEnabled || scrollSystem.inScroll) return;
  
  const touch = e.changedTouches[0];
  touchEndY = touch.clientY;
  touchEndX = touch.clientX;
  
  const touchDuration = Date.now() - touchStartTime;
  const verticalDistance = touchStartY - touchEndY; // Positive = swipe up
  const horizontalDistance = Math.abs(touchEndX - touchStartX);
  const totalDistance = Math.abs(verticalDistance);
  
  console.log('📱 Touch end - Duration:', touchDuration, 'Vertical:', verticalDistance, 'Total:', totalDistance, 'IsVertical:', isVerticalSwipe);
  
  // More lenient swipe detection for mobile
  const isValidSwipe = touchDuration < 1000 && 
                      totalDistance > 30 && 
                      isVerticalSwipe &&
                      hasMoved;
  
  if (isValidSwipe) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('📱 Valid swipe detected');
    scrollSystem.inScroll = true;
    
    let targetSection = scrollSystem.currentSection;
    
    if (verticalDistance > 20) {
      // Swipe up = next section
      targetSection = Math.min(scrollSystem.currentSection + 1, scrollSystem.arrSections.length - 1);
      console.log('📱 Swipe UP to section:', targetSection);
    } else if (verticalDistance < -20) {
      // Swipe down = previous section
      targetSection = Math.max(scrollSystem.currentSection - 1, 0);
      console.log('📱 Swipe DOWN to section:', targetSection);
    }
    
    if (targetSection !== scrollSystem.currentSection) {
      goToSection(targetSection);
    } else {
      scrollSystem.inScroll = false;
    }
  } else {
    // Reset scroll lock for failed swipes
    scrollSystem.inScroll = false;
  }
  
  // Reset touch tracking
  hasMoved = false;
  isVerticalSwipe = false;
  touchDistance = 0;
}

// ===============================================
// SCROLL ANIMATION FIX (from scroll-fix.js)
// ===============================================
function reinitializeScrollAnimations() {
  if (!isHomepage()) return;
  
  console.log('🔧 Reinitializing scroll animations...');
  
  if (typeof initializeScrollAnimationTrigger === 'function') {
    initializeScrollAnimationTrigger();
  }
  
  if (typeof initializeScrollZoomAnimationTrigger === 'function') {
    initializeScrollZoomAnimationTrigger();
  }
  
  const offscreenElements = document.querySelectorAll('.scroll-trigger--offscreen');
  offscreenElements.forEach(element => {
    if (element.getBoundingClientRect().top < window.innerHeight) {
      element.classList.remove('scroll-trigger--offscreen');
    }
  });
}

function applyUltimateScrollFix() {
  if (!isHomepage()) return;
  
  console.log('🔧 Applying ultimate scroll fix...');
  
  const allTriggers = document.querySelectorAll('.scroll-trigger');
  allTriggers.forEach(function(el) {
    const rect = el.getBoundingClientRect();
    
    if (rect.top < window.innerHeight * 0.25) {
      el.classList.remove('scroll-trigger--offscreen');
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    } else {
      el.classList.add('scroll-trigger--offscreen');
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
    }
    
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  const scrollHandler = function() {
    const offscreenElements = document.querySelectorAll('.scroll-trigger--offscreen');
    offscreenElements.forEach(function(el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        el.classList.remove('scroll-trigger--offscreen');
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  };
  
  window.addEventListener('scroll', scrollHandler, { passive: true });
}

// ===============================================
// JQUERY WAIT UTILITY
// ===============================================
function waitForJQuery(callback) {
  if (typeof $ !== 'undefined' && $ && $.fn) {
    console.log('✅ jQuery is ready');
    callback();
  } else {
    console.log('⏳ Waiting for jQuery...');
    setTimeout(() => waitForJQuery(callback), 100);
  }
}

// ===============================================
// DOT NAVIGATION SYSTEM - ORIGINAL WORKING METHOD
// ===============================================
function createDotNavigation() {
  console.log('🎯 Creating dot navigation...');
  
  // ORIGINAL WORKING METHOD: Try multiple ways to find the container
  let dotContainer = $('#section-dots');
  if (!dotContainer.length) {
    dotContainer = document.getElementById('section-dots');
    if (dotContainer) {
      dotContainer = $(dotContainer);
    }
  }
  
  if (!dotContainer || !dotContainer.length) {
    console.log('❌ Dot container not found');
    return;
  }
  
  console.log('✅ Dot container found:', dotContainer);
  
  // Clear existing dots
  dotContainer.empty();
  
  // Set dotNavigation reference FIRST
  scrollSystem.dotNavigation = dotContainer[0]; // Convert jQuery to DOM element for reference
  
  // Filter out duplicate positions and create clean section array
  const cleanSections = [];
  const usedPositions = new Set();
  
  scrollSystem.arrSections.forEach((pos, index) => {
    if (!usedPositions.has(pos) || cleanSections.length === 0) {
      cleanSections.push(pos);
      usedPositions.add(pos);
    }
  });
  
  // Update the clean sections array
  scrollSystem.arrSections = cleanSections;
  console.log('🎯 Clean sections after removing duplicates:', scrollSystem.arrSections);
  
  // CRITICAL: Apply container styling using jQuery css() method
  dotContainer.css({
    'position': 'fixed',
    'right': '25px',
    'top': '50%',
    'transform': 'translateY(-50%)',
    'z-index': '1000',
    'background': 'rgba(255, 255, 255, 0.1)',
    'backdrop-filter': 'blur(12px)',
    '-webkit-backdrop-filter': 'blur(12px)',
    'padding': '16px 6px',
    'border-radius': '20px',
    'display': 'flex',
    'flex-direction': 'column',
    'justify-content': 'space-evenly',
    'align-items': 'center',
    'gap': '6px',
    'min-height': '180px',
    'border': '1px solid rgba(255, 255, 255, 0.15)',
    'box-shadow': '0 4px 24px rgba(0, 0, 0, 0.08)',
    'opacity': '0.7',
    'transition': 'opacity 0.3s ease'
  });
  
  // Create dots for each unique section using ORIGINAL WORKING METHOD
  scrollSystem.arrSections.forEach((sectionPos, index) => {
    console.log('🎯 Creating dot', index, 'for section at position', sectionPos);
    
    // ORIGINAL WORKING METHOD: Create dot element using jQuery
    const dot = $('<div></div>');
    dot.addClass('section-dot');
    dot.attr('data-section', index);
    
    // CRITICAL: Apply dot styling using jQuery css() method
    dot.css({
      'width': '6px',
      'height': '6px',
      'background': 'rgba(0, 0, 0, 0.25)',
      'border-radius': '50%',
      'cursor': 'pointer',
      'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      'border': '1px solid transparent',
      'opacity': '0.6',
      'flex-shrink': '0',
      'position': 'relative'
    });
    
    // Add click handler using ORIGINAL WORKING METHOD
    dot.on('click', function() {
      console.log('🎯 Dot clicked:', index);
      goToSection(index);
    });
    
    // Add touch handler for mobile
    dot.on('touchend', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('📱 Dot touched:', index);
      goToSection(index);
    });
    
    // ORIGINAL WORKING METHOD: Append to container using jQuery
    dotContainer.append(dot);
    console.log('🎯 Dot', index, 'added to container');
  });
  
  // Add hover effects to container using jQuery
  dotContainer.hover(
    function() {
      $(this).css('opacity', '0.9');
    },
    function() {
      $(this).css('opacity', '0.7');
    }
  );
  
  console.log('✅ Dot navigation created with', scrollSystem.arrSections.length, 'dots');
  updateDotNavigation();
}

function updateDotNavigation() {
  if (!scrollSystem.dotNavigation) {
    // Try to find it again
    const container = document.getElementById('section-dots');
    if (container) {
      scrollSystem.dotNavigation = container;
    } else {
      return;
    }
  }
  
  const dots = scrollSystem.dotNavigation.children;
  console.log('🎯 Updating dots - current section:', scrollSystem.currentSection, 'total dots:', dots.length);
  
  for (let i = 0; i < dots.length; i++) {
    const $dot = $(dots[i]); // Convert to jQuery for easier styling
    
    if (i === scrollSystem.currentSection) {
      // Active dot - use jQuery css() method
      $dot.css({
        'background': 'rgba(0, 0, 0, 0.7)',
        'transform': 'scale(1.6)',
        'opacity': '1',
        'border': '1px solid rgba(255, 255, 255, 0.3)'
      });
      $dot.addClass('active');
      console.log('🎯 Activated dot', i);
    } else {
      // Inactive dots - use jQuery css() method
      $dot.css({
        'background': 'rgba(0, 0, 0, 0.25)',
        'transform': 'scale(1)',
        'opacity': '0.6',
        'border': '1px solid transparent'
      });
      $dot.removeClass('active');
    }
  }
}

function goToSection(sectionIndex) {
  if (scrollSystem.inScroll || sectionIndex < 0 || sectionIndex >= scrollSystem.arrSections.length || !isHomepage()) return;
  
  console.log('🎯 Going to section:', sectionIndex);
  
  scrollSystem.inScroll = true;
  scrollSystem.currentSection = sectionIndex;
  
  updateDotNavigation();
  
  $('html, body').animate({
    scrollTop: scrollSystem.arrSections[sectionIndex]
  }, {
    duration: scrollSystem.durationOneScroll,
    complete: function() {
      scrollSystem.inScroll = false;
      console.log('✅ Navigation to section', sectionIndex, 'complete');
    }
  });
}

// ===============================================
// SECTION POSITION CALCULATIONS
// ===============================================
function calculateSectionPositions() {
  if (!scrollSystem.$sections || scrollSystem.$sections.length === 0 || !isHomepage()) return;
  
  const oldPositions = [...scrollSystem.arrSections];
  scrollSystem.arrSections = scrollSystem.$sections.map(function() {
    return $(this).offset().top;
  }).get();
  
  console.log('📍 Raw section positions:', scrollSystem.arrSections);
  updateCurrentSectionFromScrollPosition();
  
  return oldPositions;
}

function updateCurrentSectionFromScrollPosition() {
  if (!isHomepage()) return;
  
  const currentScrollPos = window.pageYOffset;
  let closestSection = 0;
  let minDistance = Infinity;
  
  scrollSystem.arrSections.forEach((sectionTop, index) => {
    const distance = Math.abs(currentScrollPos - sectionTop);
    if (distance < minDistance) {
      minDistance = distance;
      closestSection = index;
    }
  });
  
  const oldSection = scrollSystem.currentSection;
  scrollSystem.currentSection = closestSection;
  
  if (oldSection !== closestSection) {
    console.log('📍 Current section updated from', oldSection, 'to', closestSection);
    updateDotNavigation();
  }
}

// ===============================================
// SCROLL SYSTEM INITIALIZATION
// ===============================================
function initializeScrollSystem() {
  if (scrollSystem.initialized) return;
  
  if (!isHomepage()) {
    console.log('❌ Not on homepage - scroll system disabled');
    return;
  }
  
  console.log('🚀 Initializing scroll system...');
  
  scrollSystem.$sections = $('section');
  console.log('🔍 Found sections:', scrollSystem.$sections.length);
  
  calculateSectionPositions();
  console.log('📍 Found sections at positions:', scrollSystem.arrSections);
  
  scrollSystem.isEnabled = scrollSystem.arrSections.length > 6;
  scrollSystem.initialized = true;
  
  if (scrollSystem.isEnabled) {
    console.log('✅ Scroll system enabled');
    createDotNavigation();
    bindScrollEvents();
    updateDotNavigation();
    
    // Enhanced mobile touch support
    const touchOptions = { passive: false, capture: true };
    document.addEventListener('touchstart', handleTouchStart, touchOptions);
    document.addEventListener('touchmove', handleTouchMove, touchOptions);
    document.addEventListener('touchend', handleTouchEnd, touchOptions);
    
    console.log('📱 Enhanced mobile touch support enabled');
    
    // Prevent overscroll behavior on mobile
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.touchAction = 'pan-x pan-y';
    
  } else {
    console.log('❌ Scroll system disabled - not enough sections');
  }
}

// ===============================================
// EVENT BINDING
// ===============================================
function bindScrollEvents() {
  if (!isHomepage()) return;
  
  $(document).off('wheel.scrollSystem');
  
  $(document).on('wheel.scrollSystem', function(event) {
    if (!scrollSystem.isEnabled || scrollSystem.inScroll || !isHomepage()) return;
    
    event.preventDefault();
    scrollSystem.inScroll = true;
    console.log('🎯 Wheel event - current section:', scrollSystem.currentSection);

    if (event.originalEvent.deltaY > 0) {
      scrollSystem.currentSection = scrollSystem.currentSection >= scrollSystem.arrSections.length - 1
        ? scrollSystem.arrSections.length - 1
        : scrollSystem.currentSection + 1;
    } else {
      scrollSystem.currentSection = scrollSystem.currentSection === 0 ? 0 : scrollSystem.currentSection - 1;
    }

    console.log('📍 Scrolling to section:', scrollSystem.currentSection);

    updateDotNavigation();

    $('html, body').animate({
      scrollTop: scrollSystem.arrSections[scrollSystem.currentSection]
    }, {
      duration: scrollSystem.durationOneScroll,
      complete: function() {
        scrollSystem.inScroll = false;
        console.log('✅ Scroll complete');
      }
    });
  });
}

// ===============================================
// RESIZE HANDLING
// ===============================================
function handleWindowResize() {
  if (!isHomepage()) return;
  
  console.log('📐 Window resized - recalculating sections...');
  
  if (scrollSystem.resizeTimeout) {
    clearTimeout(scrollSystem.resizeTimeout);
  }
  
  scrollSystem.resizeTimeout = setTimeout(function() {
    if (scrollSystem.initialized) {
      calculateSectionPositions();
      createDotNavigation();
      updateDotNavigation();
    }
    scrollSystem.resizeTimeout = null;
  }, 250);
}

// ===============================================
// SYSTEM RESET
// ===============================================
function resetScrollSystem() {
  console.log('🔄 Resetting scroll system...');
  scrollSystem.initialized = false;
  scrollSystem.currentSection = 0;
  scrollSystem.inScroll = false;
  
  if (scrollSystem.resizeTimeout) {
    clearTimeout(scrollSystem.resizeTimeout);
    scrollSystem.resizeTimeout = null;
  }
  
  if (scrollSystem.dotNavigation) {
    $(scrollSystem.dotNavigation).remove(); // Use jQuery to remove
    scrollSystem.dotNavigation = null;
  }
  
  if (typeof $ !== 'undefined') {
    $(document).off('wheel.scrollSystem');
    $(window).off('resize.scrollSystem');
    $(window).off('scroll.dotNavigation');
  }
  
  // Remove touch event listeners
  document.removeEventListener('touchstart', handleTouchStart);
  document.removeEventListener('touchmove', handleTouchMove);
  document.removeEventListener('touchend', handleTouchEnd);
}

// ===============================================
// FEATURE INITIALIZATION
// ===============================================
function initializeAllFeatures() {
  console.log('📱 Initializing all features...');
  
  if (!isHomepage()) {
    console.log('❌ Not on homepage - skipping scroll features');
    return;
  }
  
  setTimeout(initializeScrollSystem, 500);
  setTimeout(applyUltimateScrollFix, 600);
  
  $(".changeSection").click(function(){
    var parentSectionClass = $(this).closest("section").attr("class");
    if (parentSectionClass && parentSectionClass.includes('luxury-collection')) {
       $('.high-end-collection').show();
       $('.luxury-collection').hide();
    } else if(parentSectionClass && parentSectionClass.includes('high-end-collection')){
      $('.high-end-collection').hide();
       $('.luxury-collection').show();
    }
    
    setTimeout(function() {
      calculateSectionPositions();
      createDotNavigation();
      updateDotNavigation();
    }, 150);
  });

  $(".click-to-scroll a").on('click', function(event) {
     if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
       $('html, body').animate({
         scrollTop: $(hash).offset().top
       }, 800, function(){
         window.location.hash = hash;
       });
     }
   });
   
   $(window).on('resize.scrollSystem', handleWindowResize);
   $(window).on('orientationchange.scrollSystem', function() {
     setTimeout(handleWindowResize, 500);
   });
   
   $(window).on('scroll.dotNavigation', function() {
     if (scrollSystem.initialized && !scrollSystem.inScroll) {
       updateCurrentSectionFromScrollPosition();
     }
   });
}

// ===============================================
// SCROLL TO TOP BUTTON FUNCTIONALITY
// ===============================================
function initializeScrollToTopButton() {
  console.log('🔝 Initializing scroll to top button...');
  
  const scrollButton = document.querySelector('.scroll-to-top');
  if (!scrollButton) {
    console.log('❌ Scroll button not found');
    return;
  }
  
  function toggleScrollButton() {
    const scrollPosition = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    if (scrollPosition > windowHeight * 0.3) {
      scrollButton.classList.add('visible');
    } else {
      scrollButton.classList.remove('visible');
    }
    
    // Optional: Update progress indicator
    if (scrollButton.classList.contains('with-progress')) {
      const scrollPercent = (scrollPosition / (document.documentElement.scrollHeight - windowHeight)) * 100;
      const progressDeg = (scrollPercent / 100) * 360;
      scrollButton.style.setProperty('--scroll-progress', `${progressDeg}deg`);
    }
  }
  
  function scrollToTop(e) {
    e.preventDefault();
    
    if (isHomepage() && scrollSystem.initialized && scrollSystem.arrSections.length > 0) {
      console.log('🏠 Homepage detected - using scroll system');
      goToSection(0);
    } else {
      console.log('📄 Regular page - scrolling to top');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
  
  scrollButton.addEventListener('click', scrollToTop);
  window.addEventListener('scroll', toggleScrollButton, { passive: true });
  
  toggleScrollButton();
  console.log('✅ Scroll to top button initialized');
}

// ===============================================
// PREMIUM SCROLL EFFECTS (from theme.liquid)
// ===============================================
function createScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  
  function updateProgress() {
    const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrolled + '%';
  }
  
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

function createScrollIndicators() {
  const sections = document.querySelectorAll('.section, .shopify-section');
  if (sections.length <= 1) return;
  
  const indicators = document.createElement('div');
  indicators.className = 'scroll-indicators';
  
  sections.forEach((section, index) => {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.setAttribute('data-section', index);
    
    indicator.addEventListener('click', () => {
      section.scrollIntoView({ behavior: 'smooth' });
    });
    
    indicators.appendChild(indicator);
  });
  
  document.body.appendChild(indicators);
  
  function updateActiveIndicator() {
    const scrollPosition = window.pageYOffset + window.innerHeight / 2;
    
    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const indicator = indicators.children[index];
      
      if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveIndicator, { passive: true });
  updateActiveIndicator();
}

function createFloatingElements() {
  const container = document.createElement('div');
  container.className = 'floating-elements';
  
  for (let i = 0; i < 4; i++) {
    const shape = document.createElement('div');
    shape.className = 'floating-shape';
    container.appendChild(shape);
  }
  
  document.body.appendChild(container);
}

function animateProductGrids() {
  const productGrids = document.querySelectorAll('.product-grid, .collection-grid');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        
        const items = entry.target.querySelectorAll('.grid__item');
        items.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, index * 100);
        });
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  });
  
  productGrids.forEach(grid => observer.observe(grid));
}

function animateSections() {
  const sections = document.querySelectorAll('.section, .shopify-section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  });
  
  sections.forEach(section => observer.observe(section));
}

function initParallax() {
  const heroSections = document.querySelectorAll('.hero-section, .banner-section, [data-section-type="hero"]');
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    
    heroSections.forEach(section => {
      const rate = scrolled * -0.5;
      const bg = section.querySelector('::before') || section;
      if (bg.style) {
        bg.style.transform = `translateY(${rate}px)`;
      }
    });
  }
  
  window.addEventListener('scroll', updateParallax, { passive: true });
}

function enhancePageTransitions() {
  let isScrolling = false;
  
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      isScrolling = true;
      document.body.classList.add('scrolling');
      
      setTimeout(() => {
        isScrolling = false;
        document.body.classList.remove('scrolling');
      }, 150);
    }
  }, { passive: true });
}

function createLoadingSkeletons() {
  const productCards = document.querySelectorAll('.product-card-wrapper, .card-wrapper');
  
  productCards.forEach(card => {
    const img = card.querySelector('img');
    if (img && !img.complete) {
      const skeleton = document.createElement('div');
      skeleton.className = 'skeleton skeleton-product';
      img.parentNode.insertBefore(skeleton, img);
      
      img.addEventListener('load', () => {
        skeleton.remove();
      });
    }
  });
}

function initAllPremiumEffects() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    createScrollProgress();
    createScrollIndicators();
    createFloatingElements();
    animateProductGrids();
    animateSections();
    initParallax();
    enhancePageTransitions();
    createLoadingSkeletons();
  }
}

// ===============================================
// GLOBAL EXPORTS
// ===============================================
window.scrollSystem = scrollSystem;
window.resetScrollSystem = resetScrollSystem;
window.initializeScrollSystem = initializeScrollSystem;
window.calculateSectionPositions = calculateSectionPositions;
window.goToSection = goToSection;
window.isHomepage = isHomepage;
window.initializeScrollToTopButton = initializeScrollToTopButton;
window.updateCurrentSectionFromScrollPosition = updateCurrentSectionFromScrollPosition;
window.updateDotNavigation = updateDotNavigation;
window.reinitializeScrollAnimations = reinitializeScrollAnimations;
window.applyUltimateScrollFix = applyUltimateScrollFix;

// ===============================================
// INITIALIZATION SEQUENCE - ORIGINAL WORKING METHOD
// ===============================================
waitForJQuery(function() {
  // Initialize when DOM is ready - ORIGINAL WORKING METHOD
  $(document).ready(function() {
    console.log('📱 DOM Ready with jQuery - initializing features');
    initializeAllFeatures();
    initAllPremiumEffects();
  });

  // Re-initialize on page navigation
  $(window).on('beforeunload', function() {
    resetScrollSystem();
  });

  $(window).on('load', function() {
    console.log('🌐 Window loaded - checking scroll system');
    if (!scrollSystem.initialized && isHomepage()) {
      setTimeout(initializeScrollSystem, 200);
    } else if (isHomepage()) {
      // Recalculate once everything is fully loaded
      setTimeout(function() {
        calculateSectionPositions();
        createDotNavigation();
        updateDotNavigation();
      }, 300);
    }
  });
  
  // Shopify theme editor support
  document.addEventListener('shopify:section:load', function() {
    if (isHomepage()) {
      setTimeout(function() {
        resetScrollSystem();
        initializeScrollSystem();
      }, 100);
    }
  });
  
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden && isHomepage()) {
      setTimeout(function() {
        if (!scrollSystem.initialized) {
          initializeScrollSystem();
        }
      }, 100);
    }
  });
});

console.log('📜 Enhanced Custom.js script loaded - waiting for jQuery...');

// Fallback initialization if the main one fails - ORIGINAL WORKING METHOD
setTimeout(function() {
  if (isHomepage()) {
    const container = document.getElementById('section-dots');
    if (container && container.children.length === 0) {
      console.log('🔄 Fallback: Creating dots manually...');
      if (typeof scrollSystem !== 'undefined' && scrollSystem.arrSections && scrollSystem.arrSections.length > 0) {
        createDotNavigation();
      }
    }
  }
}, 2000);