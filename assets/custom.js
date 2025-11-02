// ===============================================
// ENHANCED SCROLL SYSTEM - MOBILE & DESKTOP
// ===============================================

(function() {
  'use strict';
  
  console.log('🚀 Enhanced Scroll System Loading... VERSION 2024-07-10-FIXED');

// ===============================================
// MOBILE DETECTION - DESKTOP-ONLY SCROLL SYSTEM
// ===============================================
function isMobileDevice() {
  // Check user agent for mobile devices
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

  // Check screen width (mobile typically < 768px)
  const isMobileWidth = window.innerWidth < 768;

  // Check if it's a touch-only device (no mouse)
  const isTouchOnly = ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
                      !window.matchMedia('(pointer: fine)').matches;

  const isMobile = mobileRegex.test(userAgent) || isMobileWidth || isTouchOnly;

  console.log('📱 Mobile detection:', {
    userAgent: mobileRegex.test(userAgent),
    width: isMobileWidth,
    touchOnly: isTouchOnly,
    result: isMobile
  });

  return isMobile;
}

// ===============================================
// DESKTOP-ONLY SCROLL SYSTEM
// ===============================================
const IS_HOMEPAGE = document.body.classList.contains('home-section') ||
                    document.body.classList.contains('template-index') ||
                    window.location.pathname === '/';

const IS_MOBILE = isMobileDevice();

console.log('🖥️ Desktop Scroll System - Homepage:', IS_HOMEPAGE, 'Mobile:', IS_MOBILE);

// ===============================================
// DESKTOP ONLY - HOMEPAGE DETECTION UTILITY
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
  isTransitioning: false,
  durationOneScroll: 600, // Optimized: Balanced speed for smooth navigation
  currentSection: 0,
  arrSections: [],
  isEnabled: false,
  initialized: false,
  resizeTimeout: null,
  dotNavigation: null,
  easingFunction: 'easeInOutCubic'
};

// Animation tracking variables
let animationStartTime = 0;
let animationTarget = null;
let globalAnimationTimeout = null;
let isSwipeInProgress = false; // BUGFIX: Section locking mechanism

// USER INTERACTION PRIORITY SYSTEM
let userInteractionActive = false;
let userInteractionTimeout = null;
let animationCompletionDelay = 500;

// ===============================================
// DESKTOP TOUCH SUPPORT (for touch-enabled laptops)
// ===============================================
let touchStartY = 0;
let touchEndY = 0;
let touchStartTime = 0;
let touchStartX = 0;
let touchEndX = 0;
let initialTouchY = 0;
let hasMoved = false;
let touchTarget = null;

function handleTouchStart(e) {
  if (!isHomepage() || !scrollSystem.isEnabled || scrollSystem.inScroll) return;

  const touch = e.touches[0];
  touchStartY = touch.clientY;
  touchStartX = touch.clientX;
  initialTouchY = touch.clientY;
  touchStartTime = Date.now();
  hasMoved = false;
  touchTarget = e.target;
}

function handleTouchMove(e) {
  if (!isHomepage() || !scrollSystem.isEnabled || scrollSystem.inScroll) return;

  // If touching dot navigation, let it handle everything
  if (touchTarget && (
    touchTarget.classList.contains('section-dot') ||
    touchTarget.closest('.section-dot-navigation')
  )) {
    return;
  }

  const touch = e.touches[0];
  const deltaY = Math.abs(touch.clientY - initialTouchY);
  const deltaX = Math.abs(touch.clientX - touchStartX);

  if (deltaY > 3 || deltaX > 3) {
    hasMoved = true;
  }
}

function handleTouchEnd(e) {
  if (!isHomepage() || !scrollSystem.isEnabled || scrollSystem.inScroll) return;

  // If touching dot navigation, let it handle everything
  if (touchTarget && (
    touchTarget.classList.contains('section-dot') ||
    touchTarget.closest('.section-dot-navigation')
  )) {
    touchTarget = null;
    return;
  }

  const touch = e.changedTouches[0];
  touchEndY = touch.clientY;
  touchEndX = touch.clientX;

  const touchDuration = Date.now() - touchStartTime;
  const verticalDistance = touchStartY - touchEndY; // Positive = swipe up
  const horizontalDistance = Math.abs(touchEndX - touchStartX);
  const totalVerticalDistance = Math.abs(verticalDistance);

  // Desktop touch validation (for touch laptops)
  const minDistance = 40;
  const maxDuration = 1200;
  const ratioThreshold = 1.2;

  const isValidSwipe = touchDuration < maxDuration &&
                      totalVerticalDistance > minDistance &&
                      totalVerticalDistance > horizontalDistance * ratioThreshold &&
                      hasMoved;

  if (isValidSwipe) {
    let targetSection = scrollSystem.currentSection;
    const swipeThreshold = 25;

    if (verticalDistance > swipeThreshold) {
      targetSection = Math.min(scrollSystem.currentSection + 1, scrollSystem.arrSections.length - 1);
      console.log('🖥️ Desktop swipe up - Going to section:', targetSection);
    } else if (verticalDistance < -swipeThreshold) {
      targetSection = Math.max(scrollSystem.currentSection - 1, 0);
      console.log('🖥️ Desktop swipe down - Going to section:', targetSection);
    }

    if (targetSection !== scrollSystem.currentSection) {
      goToSection(targetSection);
    }
  }

  // Reset touch tracking
  hasMoved = false;
  touchTarget = null;
}

// ===============================================
// SCROLL ANIMATION HELPERS
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
// CUSTOM JQUERY EASING FUNCTIONS
// ===============================================
function initializeCustomEasing() {
  if (typeof $ !== 'undefined' && $ && $.easing) {
    // Define custom easeInOutCubic function
    $.easing.easeInOutCubic = function(x) {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    };

    console.log('✅ Custom easing functions registered:', Object.keys($.easing));
  } else {
    console.log('⚠️ jQuery or jQuery.easing not available for custom easing');
  }
}

// ===============================================
// JQUERY WAIT UTILITY
// ===============================================
function waitForJQuery(callback) {
  if (typeof $ !== 'undefined' && $ && $.fn) {
    console.log('✅ jQuery is ready');
    // Initialize custom easing when jQuery is ready
    initializeCustomEasing();
    callback();
  } else {
    console.log('⏳ Waiting for jQuery...');
    setTimeout(() => waitForJQuery(callback), 100);
  }
}

// ===============================================
// DOT NAVIGATION SYSTEM
// ===============================================
function createDotNavigation() {

  // Force remove any existing containers first
  const existingContainers = document.querySelectorAll('#section-dots, .section-dot-navigation');
  existingContainers.forEach(container => container.remove());
  
  // Always create a fresh container
  const dotContainer = document.createElement('div');
  dotContainer.id = 'section-dots';
  dotContainer.className = 'section-dot-navigation';
  
  // CLEAN MODERN STYLING - NO BACKGROUND BOX
  dotContainer.style.cssText = `
    position: fixed !important;
    right: 25px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    z-index: 999999 !important;
    background: transparent !important;
    padding: 0 !important;
    border-radius: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 12px !important;
    border: none !important;
    min-height: auto !important;
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: auto !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    box-shadow: none !important;
    transition: all 0.3s ease !important;
  `;

  // Append to body
  document.body.appendChild(dotContainer);

  // Set the dotNavigation reference
  scrollSystem.dotNavigation = dotContainer;
  
  // BUGFIX: Improved deduplication - only remove if positions are within 5px (floating point tolerance)
  // This prevents legitimate sections at similar but different positions from being merged
  const cleanSections = [];
  const positionTolerance = 5; // pixels

  scrollSystem.arrSections.forEach((pos, index) => {
    // Check if this position is truly duplicate (within tolerance)
    const isDuplicate = cleanSections.some(existingPos =>
      Math.abs(existingPos - pos) < positionTolerance
    );

    if (!isDuplicate || cleanSections.length === 0) {
      cleanSections.push(pos);
    }
  });

  // BUGFIX: Only update if we actually found duplicates, otherwise preserve original
  if (cleanSections.length !== scrollSystem.arrSections.length) {
    scrollSystem.arrSections = cleanSections;
  }
  
  // Create dots for each unique section
  scrollSystem.arrSections.forEach((sectionPos, index) => {
    // Create dot element with functional styling
    const dot = document.createElement('div');
    dot.className = 'section-dot';
    dot.setAttribute('data-section', index);
    
    // MODERN CLEAN DOT STYLING
    dot.style.cssText = `
      width: 10px !important;
      height: 10px !important;
      background: rgba(255, 255, 255, 0.4) !important;
      border-radius: 50% !important;
      cursor: pointer !important;
      border: 2px solid rgba(255, 255, 255, 0.6) !important;
      opacity: 1 !important;
      visibility: visible !important;
      display: block !important;
      position: relative !important;
      flex-shrink: 0 !important;
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
      margin: 0 !important;
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0) !important;
    `;
    
    // Add larger touch area for mobile
    const touchArea = document.createElement('div');
    touchArea.style.cssText = `
      position: absolute !important;
      top: -15px !important;
      left: -15px !important;
      right: -15px !important;
      bottom: -15px !important;
      cursor: pointer !important;
      z-index: 1 !important;
    `;
    
    dot.appendChild(touchArea);
    
    // Add click handler to both dot and touch area
    const clickHandler = function(e) {
      e.preventDefault();
      e.stopPropagation();

      // USER INTERACTION PRIORITY: Set flag to prevent auto-updates
      userInteractionActive = true;
      clearTimeout(userInteractionTimeout);

      goToSection(index);
    };
    
    dot.addEventListener('click', clickHandler);
    touchArea.addEventListener('click', clickHandler);
    
    // Add touch handler for mobile - on both elements
    const touchHandler = function(e) {
      e.preventDefault();
      e.stopPropagation();

      // USER INTERACTION PRIORITY: Set flag to prevent auto-updates
      userInteractionActive = true;
      clearTimeout(userInteractionTimeout);

      goToSection(index);
    };
    
    dot.addEventListener('touchend', touchHandler);
    touchArea.addEventListener('touchend', touchHandler);
    
    // Modern hover effect with glow
    dot.addEventListener('mouseenter', function() {
      if (index !== scrollSystem.currentSection) {
        dot.style.background = 'rgba(255, 255, 255, 0.8)';
        dot.style.border = '2px solid rgba(255, 255, 255, 0.9)';
        dot.style.transform = 'scale(1.2)';
        dot.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.3)';
      }
    });
    
    dot.addEventListener('mouseleave', function() {
      if (index !== scrollSystem.currentSection) {
        dot.style.background = 'rgba(255, 255, 255, 0.4)';
        dot.style.border = '2px solid rgba(255, 255, 255, 0.6)';
        dot.style.transform = 'scale(1)';
        dot.style.boxShadow = '0 0 0 0 rgba(255, 255, 255, 0)';
      }
    });


    // Append to container
    dotContainer.appendChild(dot);
  });

  updateDotNavigation();
}

function updateDotNavigation() {
  // Try to find the container if not set
  if (!scrollSystem.dotNavigation) {
    scrollSystem.dotNavigation = document.getElementById('section-dots');
  }

  if (!scrollSystem.dotNavigation) {
    return;
  }

  const dots = scrollSystem.dotNavigation.children;

  for (let i = 0; i < dots.length; i++) {
    if (i === scrollSystem.currentSection) {
      // Active dot - SIGNIFICANTLY BIGGER and more prominent
      dots[i].style.background = 'rgba(255, 255, 255, 1)';
      dots[i].style.border = '3px solid rgba(255, 255, 255, 1)';
      dots[i].style.transform = 'scale(2.0)'; // MUCH BIGGER when active
      dots[i].style.boxShadow = '0 0 12px rgba(255, 255, 255, 0.6)';
      dots[i].style.width = '12px';
      dots[i].style.height = '12px';
      dots[i].classList.add('active');
    } else {
      // Inactive dots - smaller and more subtle
      dots[i].style.background = 'rgba(255, 255, 255, 0.4)';
      dots[i].style.border = '2px solid rgba(255, 255, 255, 0.6)';
      dots[i].style.transform = 'scale(1)';
      dots[i].style.boxShadow = '0 0 0 0 rgba(255, 255, 255, 0)';
      dots[i].style.width = '10px';
      dots[i].style.height = '10px';
      dots[i].classList.remove('active');
    }
  }
}

function goToSection(sectionIndex) {
  // BUGFIX: Add transition lock check to prevent navigation during section visibility changes
  if (scrollSystem.isTransitioning) {
    return;
  }

  // BUGFIX: Enhanced validation - clamp section index to valid range
  const validSectionIndex = Math.max(0, Math.min(sectionIndex, scrollSystem.arrSections.length - 1));
  if (validSectionIndex !== sectionIndex) {
    sectionIndex = validSectionIndex;
  }

  // Validate that target section position exists and is valid
  if (!scrollSystem.arrSections || scrollSystem.arrSections.length === 0) {
    return;
  }

  if (typeof scrollSystem.arrSections[sectionIndex] !== 'number' || isNaN(scrollSystem.arrSections[sectionIndex])) {
    return;
  }

  if (scrollSystem.inScroll || sectionIndex < 0 || sectionIndex >= scrollSystem.arrSections.length || !isHomepage()) {
    return;
  }

  scrollSystem.inScroll = true;
  
  const oldSection = scrollSystem.currentSection;
  scrollSystem.currentSection = sectionIndex;
  
  // Set animation tracking variables
  animationStartTime = Date.now();
  animationTarget = scrollSystem.arrSections[sectionIndex];

  // Global timeout fallback to prevent inScroll getting stuck
  clearTimeout(globalAnimationTimeout);
  globalAnimationTimeout = setTimeout(() => {
    scrollSystem.inScroll = false;
    isSwipeInProgress = false;
    animationStartTime = 0;
    animationTarget = null;
  }, scrollSystem.durationOneScroll + 2000);
  
  updateDotNavigation();
  
  // Stop any existing animations first
  $('html, body').stop(true, false);
  
  const startTime = Date.now();
  const startScroll = window.pageYOffset;
  const targetScroll = scrollSystem.arrSections[sectionIndex];

  // Safe easing with fallback
  let safeEasing = scrollSystem.easingFunction;
  if (!$.easing || !$.easing[scrollSystem.easingFunction]) {
    safeEasing = 'swing';
  }

  $('html, body').animate({
    scrollTop: targetScroll
  }, {
    duration: scrollSystem.durationOneScroll,
    easing: safeEasing,
    complete: function() {
      scrollSystem.inScroll = false;
      isSwipeInProgress = false;
      clearTimeout(globalAnimationTimeout);

      clearTimeout(userInteractionTimeout);
      userInteractionTimeout = setTimeout(() => {
        userInteractionActive = false;
      }, animationCompletionDelay);

      animationStartTime = 0;
      animationTarget = null;
    },
    fail: function() {
      scrollSystem.inScroll = false;
      isSwipeInProgress = false;
      clearTimeout(globalAnimationTimeout);
      animationStartTime = 0;
      animationTarget = null;
    }
  });
}

// ===============================================
// SECTION POSITION CALCULATIONS
// ===============================================
function calculateSectionPositions() {
  if (!scrollSystem.$sections || scrollSystem.$sections.length === 0 || !isHomepage()) return;

  const oldPositions = [...scrollSystem.arrSections];

  // BUGFIX: Use getBoundingClientRect() for more reliable position calculation during DOM changes
  scrollSystem.arrSections = scrollSystem.$sections.map(function(index) {
    const section = this;
    const currentScroll = window.pageYOffset;

    // BUGFIX: getBoundingClientRect() is more reliable during DOM mutations than offset().top
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + currentScroll;

    return Math.round(sectionTop); // Round to avoid floating point issues
  }).get();
  updateCurrentSectionFromScrollPosition();

  return oldPositions;
}

function updateCurrentSectionFromScrollPosition() {
  if (!isHomepage()) return;

  // BUGFIX: Don't update section during section transitions - prevents race conditions
  if (scrollSystem.isTransitioning) {
    return;
  }

  // CRITICAL FIX: Don't update section during animations on ANY device - prevents interference with dot clicks
  if (scrollSystem.inScroll) {
    return;
  }

  // USER INTERACTION PRIORITY: Don't auto-update during user interactions
  if (userInteractionActive) {
    return;
  }
  
  const currentScrollPos = window.pageYOffset;
  let closestSection = 0;
  let minDistance = Infinity;
  
  // SAFETY CHECK: Must have sections
  if (!scrollSystem.arrSections || scrollSystem.arrSections.length === 0) {
    return;
  }
  
  // DESKTOP: Use viewport-aware detection
  const viewportHeight = window.innerHeight;

  if (currentScrollPos < 50) {
    closestSection = 0;
  } else {
    // Use viewport center point for more accurate detection
    const viewportCenter = currentScrollPos + (viewportHeight / 2);
    let bestDistance = Infinity;

    for (let i = 0; i < scrollSystem.arrSections.length; i++) {
      const sectionStart = scrollSystem.arrSections[i];
      // Calculate distance from viewport center to section start
      const distance = Math.abs(viewportCenter - sectionStart);

      if (distance < bestDistance) {
        bestDistance = distance;
        closestSection = i;
      }
    }
  }

  const oldSection = scrollSystem.currentSection;
  scrollSystem.currentSection = closestSection;

  if (oldSection !== closestSection) {
    updateDotNavigation();
  }
}

// ===============================================
// SCROLL SYSTEM INITIALIZATION
// ===============================================
function initializeScrollSystem() {
  if (scrollSystem.initialized) return;

  if (!isHomepage()) {
    return;
  }
  // Desktop optimizations - Allow normal scrolling
  document.body.style.overscrollBehavior = 'auto';
  document.body.style.touchAction = 'auto';

  scrollSystem.$sections = $('section');
  calculateSectionPositions();

  // Desktop requires minimum 4 sections
  const minSectionsRequired = 4;
  scrollSystem.isEnabled = scrollSystem.arrSections.length > minSectionsRequired;
  scrollSystem.initialized = true;

  if (scrollSystem.isEnabled) {
    createDotNavigation();
    bindScrollEvents();
    updateDotNavigation();

    // Desktop touch support (for touch-enabled laptops)
    const touchOptions = { passive: false, capture: true };
    document.addEventListener('touchstart', handleTouchStart, touchOptions);
    document.addEventListener('touchmove', handleTouchMove, touchOptions);
    document.addEventListener('touchend', handleTouchEnd, touchOptions);
  }
}

// ===============================================
// EVENT BINDING
// ===============================================
function bindScrollEvents() {
  if (!isHomepage()) return;

  $(document).off('wheel.scrollSystem');

  $(document).on('wheel.scrollSystem', function(event) {
    if (isMobileDevice() || !scrollSystem.isEnabled || scrollSystem.inScroll || !isHomepage()) return;
    
    console.log('🔵 DESKTOP WHEEL setting inScroll = true');
    scrollSystem.inScroll = true;
    console.log('🎯 Wheel event - current section:', scrollSystem.currentSection);

    if (event.originalEvent.deltaY > 0) {
      scrollSystem.currentSection = scrollSystem.currentSection >= scrollSystem.arrSections.length - 1
        ? scrollSystem.arrSections.length - 1
        : scrollSystem.currentSection + 1;
    } else {
      scrollSystem.currentSection = scrollSystem.currentSection === 0 ? 0 : scrollSystem.currentSection - 1;
    }

    console.log('📍 Scrolling to section:', scrollSystem.currentSection, 'at position:', scrollSystem.arrSections[scrollSystem.currentSection]);

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
      const oldPositions = calculateSectionPositions();
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
    scrollSystem.dotNavigation.remove();
    scrollSystem.dotNavigation = null;
  }
  
  if (typeof $ !== 'undefined') {
    $(document).off('wheel.scrollSystem');
    $(window).off('resize.scrollSystem');
    $(window).off('scroll.dotNavigation');
  }
}

// ===============================================
// FEATURE INITIALIZATION
// ===============================================
function initializeAllFeatures() {
  console.log('🖥️ Initializing features...');

  if (!isHomepage()) {
    console.log('❌ Not on homepage - skipping scroll features');
    return;
  }

  setTimeout(initializeScrollSystem, 500);
  setTimeout(applyUltimateScrollFix, 600);
  
  $(".changeSection").click(function(){
    // BUGFIX: Prevent navigation during section transitions
    if (scrollSystem.isTransitioning) {
      console.log('🚫 Section change blocked - transition in progress');
      return;
    }

    console.log('🔄 Section change initiated - setting transition lock');
    scrollSystem.isTransitioning = true;

    var parentSectionClass = $(this).closest("section").attr("class");
    if (parentSectionClass && parentSectionClass.includes('luxury-collection')) {
       $('.high-end-collection').show();
       $('.luxury-collection').hide();
    } else if(parentSectionClass && parentSectionClass.includes('high-end-collection')){
      $('.high-end-collection').hide();
       $('.luxury-collection').show();
    }

    // BUGFIX: Increased delay from 150ms to 400ms for proper CSS transition completion
    setTimeout(function() {
      calculateSectionPositions();
      createDotNavigation();
      updateDotNavigation();

      // BUGFIX: Clear transition lock after recalculation completes
      scrollSystem.isTransitioning = false;
      console.log('✅ Section transition complete - lock released');
    }, 400);
  });

  $(".click-to-scroll a").on('click', function(event) {
     if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      var target = $(hash);
      
      // If the target doesn't exist, find the next section to scroll to
      if (target.length === 0) {
        console.log('Target element not found:', hash, 'Finding next section...');
        
        // Find the current banner section
        var currentBanner = $(this).closest('.banner, section');
        
        // Look for the next section on the page
        var nextSection = currentBanner.next('section, .shopify-section, [class*="section"]');
        
        // If still not found, look for any section that comes after the current one
        if (nextSection.length === 0) {
          var allSections = $('section, .shopify-section, [class*="section"]');
          var currentIndex = allSections.index(currentBanner);
          if (currentIndex >= 0 && currentIndex < allSections.length - 1) {
            nextSection = allSections.eq(currentIndex + 1);
          }
        }
        
        if (nextSection.length > 0) {
          target = nextSection;
          console.log('Found next section to scroll to:', nextSection[0]);
        } else {
          console.log('No next section found, scrolling down by viewport height');
          // Fallback: scroll down by one viewport height
          var scrollTarget = $(window).scrollTop() + $(window).height();
          $('html, body').animate({
            scrollTop: scrollTarget
          }, 800);
          return;
        }
      }
      
      // Check if target has offset (is visible element)
      if (target.offset()) {
        // Animate scroll to target
        $('html, body').animate({
           scrollTop: target.offset().top
         }, 800, function(){
           if ($(hash).length > 0) {
             window.location.hash = hash;
           }
         });
      } else {
        console.error('Target element found but has no offset:', target);
      }
     }
   });
   
   $(window).on('resize.scrollSystem', handleWindowResize);
   $(window).on('orientationchange.scrollSystem', function() {
     setTimeout(function() {
       handleWindowResize();
     }, 500);
   });
   
   $(window).on('scroll.dotNavigation', function() {
     if (!scrollSystem.initialized) return;

     // BUGFIX: Block scroll handler during section transitions to prevent race conditions
     if (scrollSystem.isTransitioning) {
       console.log('🚫 Scroll handler blocked - section transition in progress');
       return;
     }

     // Keep existing logic with animation checks
     if (!scrollSystem.inScroll) {
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
  
  // Show/hide button based on scroll position
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
  
  // Smooth scroll to top
  function scrollToTop(e) {
    e.preventDefault();
    
    // If on homepage with scroll system, go to first section
    if (isHomepage() && scrollSystem.initialized && scrollSystem.arrSections.length > 0) {
      console.log('🏠 Homepage detected - using scroll system');
      goToSection(0);
    } else {
      // Regular scroll to top for other pages
      console.log('📄 Regular page - scrolling to top');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
  
  // Add event listeners
  scrollButton.addEventListener('click', scrollToTop);
  window.addEventListener('scroll', toggleScrollButton, { passive: true });
  
  // Initial check
  toggleScrollButton();
  
  console.log('✅ Scroll to top button initialized');
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
// INITIALIZATION SEQUENCE - FASTER LOADING
// ===============================================
waitForJQuery(function() {
  // IMMEDIATE initialization - don't wait for DOM ready
  console.log('🖥️ jQuery ready - IMMEDIATE initialization');

  // Initialize scroll system immediately if homepage
  if (isHomepage()) {
    console.log('🏠 Homepage detected - initializing scroll system NOW');
    setTimeout(initializeScrollSystem, 50); // Very short delay
    setTimeout(initializeScrollToTopButton, 100);
  }
  
  $(document).ready(function() {
    console.log('📱 DOM Ready - secondary initialization');
    initializeAllFeatures();
    
    // Re-initialize if not already done
    if (isHomepage() && !scrollSystem.initialized) {
      console.log('🔄 Backup initialization');
      setTimeout(initializeScrollSystem, 100);
    }
  });

  $(window).on('beforeunload', function() {
    resetScrollSystem();
  });

  $(window).on('load', function() {
    console.log('🌐 Window loaded - checking scroll system');
    if (!scrollSystem.initialized && isHomepage()) {
      setTimeout(initializeScrollSystem, 100);
    } else if (isHomepage()) {
      setTimeout(function() {
        calculateSectionPositions();
        createDotNavigation();
        updateDotNavigation();
      }, 200);
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

// Fallback initialization
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

})(); // End of IIFE wrapper