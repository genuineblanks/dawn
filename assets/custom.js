// ===============================================
// ENHANCED SCROLL SYSTEM - MOBILE & DESKTOP
// ===============================================

(function() {
  'use strict';
  

// ===============================================
// MOBILE DETECTION - DESKTOP-ONLY SCROLL SYSTEM
// ===============================================
function isMobileDevice() {
  // Check user agent for mobile devices
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

  // Check screen width (mobile typically < 768px)
  const isMobileWidth = window.innerWidth < 768;

  // REMOVED: isTouchOnly check - was falsely detecting desktops as mobile
  // The pointer:fine check is unreliable on some desktop browsers/systems
  // Relying on user agent + screen width is more accurate

  const isMobile = mobileRegex.test(userAgent) || isMobileWidth;

  return isMobile;
}

// ===============================================
// DESKTOP-ONLY SCROLL SYSTEM
// ===============================================
const IS_HOMEPAGE = document.body.classList.contains('home-section') ||
                    document.body.classList.contains('template-index') ||
                    window.location.pathname === '/';

const IS_MOBILE = isMobileDevice();


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

// SCROLL SNAP SYSTEM - Auto-align to sections when scrolling stops
let scrollSnapTimeout = null;
let lastScrollPosition = 0;
let isAutoSnapping = false;

// WHEEL HANDLER REFERENCE - Store for proper cleanup
let wheelHandlerReference = null;

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
  // BUGFIX: Only for desktop touchscreens (laptops), not mobile devices
  if (isMobileDevice() || !isHomepage() || !scrollSystem.isEnabled || scrollSystem.inScroll) return;

  const touch = e.touches[0];
  touchStartY = touch.clientY;
  touchStartX = touch.clientX;
  initialTouchY = touch.clientY;
  touchStartTime = Date.now();
  hasMoved = false;
  touchTarget = e.target;
}

function handleTouchMove(e) {
  // BUGFIX: Only for desktop touchscreens (laptops), not mobile devices
  if (isMobileDevice() || !isHomepage() || !scrollSystem.isEnabled || scrollSystem.inScroll) return;

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
  // BUGFIX: Only for desktop touchscreens (laptops), not mobile devices
  if (isMobileDevice() || !isHomepage() || !scrollSystem.isEnabled || scrollSystem.inScroll) return;

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
    } else if (verticalDistance < -swipeThreshold) {
      targetSection = Math.max(scrollSystem.currentSection - 1, 0);
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

      // Clear any pending snap operation
      clearTimeout(scrollSnapTimeout);
      isAutoSnapping = false;

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

      // Clear any pending snap operation
      clearTimeout(scrollSnapTimeout);
      isAutoSnapping = false;

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

  // Clear any pending snap operation
  clearTimeout(scrollSnapTimeout);
  isAutoSnapping = false;

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

  // Don't update dots during wheel animations - wheel handler controls section updates
  // This is called from scroll handler which already checks inScroll, but double-check here
  if (scrollSystem.inScroll) {
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
// SCROLL SNAP - Auto-align to nearest section when scrolling stops
// ===============================================
function snapToNearestSection() {
  // Don't snap if not on homepage or system not initialized
  if (!isHomepage() || !scrollSystem.initialized || !scrollSystem.isEnabled) {
    return;
  }

  // Don't snap if already animating
  // REMOVED: userInteractionActive check - was blocking snap (500ms delay vs 150ms snap timeout)
  if (scrollSystem.inScroll || isAutoSnapping) {
    return;
  }

  // Don't snap if no sections
  if (!scrollSystem.arrSections || scrollSystem.arrSections.length === 0) {
    return;
  }

  const currentScrollPos = window.pageYOffset;
  const viewportHeight = window.innerHeight;

  // Find the closest section
  let closestSection = 0;
  let minDistance = Infinity;

  for (let i = 0; i < scrollSystem.arrSections.length; i++) {
    const sectionPos = scrollSystem.arrSections[i];
    const distance = Math.abs(currentScrollPos - sectionPos);

    if (distance < minDistance) {
      minDistance = distance;
      closestSection = i;
    }
  }

  const targetPosition = scrollSystem.arrSections[closestSection];
  const distanceFromTarget = Math.abs(currentScrollPos - targetPosition);

  // SNAP THRESHOLD: Only snap if we're more than 15% of viewport height away from target
  // Snap acts as a "safety net" for wheel handler, fixing manual scroll misalignments
  // 15% provides good balance - corrects misalignment without being too aggressive
  const snapThreshold = viewportHeight * 0.15; // 15% of viewport height

  if (distanceFromTarget > snapThreshold) {
    // We're misaligned - snap to the nearest section
    isAutoSnapping = true;

    // Update current section
    scrollSystem.currentSection = closestSection;
    updateDotNavigation();

    // Smoothly animate to the correct position
    $('html, body').animate({
      scrollTop: targetPosition
    }, {
      duration: 400, // Faster snap animation
      easing: 'easeInOutCubic',
      complete: function() {
        isAutoSnapping = false;
      },
      fail: function() {
        isAutoSnapping = false;
      }
    });
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

  // Allow normal scrolling
  document.body.style.overscrollBehavior = 'auto';
  document.body.style.touchAction = 'auto';

  scrollSystem.$sections = $('section');
  calculateSectionPositions();

  // Requires minimum 4 sections
  const minSectionsRequired = 4;
  const hasSufficientSections = scrollSystem.arrSections.length > minSectionsRequired;

  if (!hasSufficientSections) {
    scrollSystem.isEnabled = false;
    scrollSystem.initialized = true;
    return;
  }

  const isMobile = isMobileDevice();

  if (isMobile) {
    // MOBILE: Normal scroll with dot navigation (no section snapping)
    scrollSystem.isEnabled = false; // Disable section-by-section scrolling
    scrollSystem.initialized = true;

    // Create dots (user wants them visible and clickable on mobile)
    createDotNavigation();

    // Bind scroll event for dot updates (no wheel/touch handlers)
    bindMobileScrollEvents();

    updateDotNavigation();
  } else {
    // DESKTOP: Full section-by-section scroll system
    scrollSystem.isEnabled = true;
    scrollSystem.initialized = true;

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

  // RESTORED: Wheel event handler for section-by-section scrolling
  // FIXED: Now determines actual current section from scroll position before incrementing
  // BUGFIX: Use native addEventListener with {passive: false} to allow preventDefault()
  // jQuery's .on() creates passive listeners by default, causing console errors
  const wheelHandler = function(event) {
    if (isMobileDevice() || !scrollSystem.isEnabled || scrollSystem.inScroll || !isHomepage()) return;

    event.preventDefault(); // Prevent default scroll behavior

    // BUGFIX: Set inScroll flag IMMEDIATELY to prevent race conditions during spam-scroll
    // Multiple wheel events can arrive within 50-100ms - this blocks them before calculations
    scrollSystem.inScroll = true;

    // BUGFIX: Stop any existing animations to prevent stuttering/conflicting animations
    $('html, body').stop(true, false);

    // BUGFIX: Get ACTUAL current section from scroll position (not cached value)
    // This prevents section skipping when starting from misaligned position
    const currentScrollPos = window.pageYOffset;
    let actualCurrentSection = 0;
    let minDistance = Infinity;

    // Find which section we're actually closest to right now
    for (let i = 0; i < scrollSystem.arrSections.length; i++) {
      const distance = Math.abs(currentScrollPos - scrollSystem.arrSections[i]);
      if (distance < minDistance) {
        minDistance = distance;
        actualCurrentSection = i;
      }
    }

    // Determine target section based on scroll direction
    let targetSection;
    if (event.originalEvent.deltaY > 0) {
      // Scrolling DOWN
      targetSection = actualCurrentSection >= scrollSystem.arrSections.length - 1
        ? scrollSystem.arrSections.length - 1
        : actualCurrentSection + 1;
    } else {
      // Scrolling UP
      targetSection = actualCurrentSection === 0 ? 0 : actualCurrentSection - 1;
    }

    // Update current section
    scrollSystem.currentSection = targetSection;
    updateDotNavigation();

    // Animate to target section
    $('html, body').animate({
      scrollTop: scrollSystem.arrSections[targetSection]
    }, {
      duration: scrollSystem.durationOneScroll,
      easing: scrollSystem.easingFunction,
      complete: function() {
        scrollSystem.inScroll = false;
        isSwipeInProgress = false;
      },
      fail: function() {
        scrollSystem.inScroll = false;
        isSwipeInProgress = false;
      }
    });
  };

  // Store handler reference for cleanup
  wheelHandlerReference = wheelHandler;

  // Remove any existing wheel listeners
  if (wheelHandlerReference) {
    document.removeEventListener('wheel', wheelHandlerReference);
  }

  // Add wheel event listener with {passive: false} to allow preventDefault()
  // This fixes console error: "Unable to preventDefault inside passive event listener"
  document.addEventListener('wheel', wheelHandler, { passive: false });
}

// ===============================================
// MOBILE SCROLL EVENT BINDING
// ===============================================
function bindMobileScrollEvents() {
  if (!isHomepage()) return;

  // MOBILE: Only bind scroll event for dot navigation updates
  // No wheel handler, no touch handlers, no snap system

  $(window).on('scroll.dotNavigation', function() {
    if (!scrollSystem.initialized) return;

    // Don't update during section transitions
    if (scrollSystem.isTransitioning) {
      return;
    }

    // Update dots based on current scroll position
    updateCurrentSectionFromScrollPosition();

    // NO SNAP SYSTEM on mobile - user wants normal scroll
  });

  // Bind resize handler for recalculating positions
  $(window).on('resize.scrollSystem', handleWindowResize);
}

// ===============================================
// RESIZE HANDLING
// ===============================================
function handleWindowResize() {
  if (!isHomepage()) return;

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
  scrollSystem.initialized = false;
  scrollSystem.currentSection = 0;
  scrollSystem.inScroll = false;

  // Clear snap system
  if (scrollSnapTimeout) {
    clearTimeout(scrollSnapTimeout);
    scrollSnapTimeout = null;
  }
  isAutoSnapping = false;
  lastScrollPosition = 0;

  if (scrollSystem.resizeTimeout) {
    clearTimeout(scrollSystem.resizeTimeout);
    scrollSystem.resizeTimeout = null;
  }

  if (scrollSystem.dotNavigation) {
    scrollSystem.dotNavigation.remove();
    scrollSystem.dotNavigation = null;
  }

  // Remove native wheel event listener
  if (wheelHandlerReference) {
    document.removeEventListener('wheel', wheelHandlerReference);
    wheelHandlerReference = null;
  }

  if (typeof $ !== 'undefined') {
    $(document).off('wheel.scrollSystem'); // Backup cleanup for old jQuery listeners
    $(window).off('resize.scrollSystem');
    $(window).off('scroll.dotNavigation');
  }
}

// ===============================================
// FEATURE INITIALIZATION
// ===============================================
function initializeAllFeatures() {
  if (!isHomepage()) {
    return;
  }

  setTimeout(initializeScrollSystem, 500);
  setTimeout(applyUltimateScrollFix, 600);
  
  $(".changeSection").click(function(){
    // BUGFIX: Prevent navigation during section transitions
    if (scrollSystem.isTransitioning) {
      return;
    }

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
    }, 400);
  });

  $(".click-to-scroll a").on('click', function(event) {
     if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      var target = $(hash);

      // If the target doesn't exist, find the next section to scroll to
      if (target.length === 0) {
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
        } else {
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
       return;
     }

     // Keep existing logic with animation checks
     if (!scrollSystem.inScroll) {
       updateCurrentSectionFromScrollPosition();
     }

     // SCROLL SNAP: Detect when user stops scrolling and auto-align to nearest section
     // Clear any existing snap timeout
     clearTimeout(scrollSnapTimeout);

     // Set new timeout - if user stops scrolling for 200ms, snap to nearest section
     // 200ms gives wheel animations (600ms) time to complete before snap checks alignment
     scrollSnapTimeout = setTimeout(function() {
       // Only snap if user has actually stopped scrolling (position hasn't changed)
       const currentPos = window.pageYOffset;
       if (Math.abs(currentPos - lastScrollPosition) < 5) {
         snapToNearestSection();
       }
       lastScrollPosition = currentPos;
     }, 200); // Wait 200ms after scroll stops

     // Update last scroll position
     lastScrollPosition = window.pageYOffset;
   });
}

// ===============================================
// SCROLL TO TOP BUTTON FUNCTIONALITY
// ===============================================
function initializeScrollToTopButton() {
  const scrollButton = document.querySelector('.scroll-to-top');
  if (!scrollButton) {
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
      goToSection(0);
    } else {
      // Regular scroll to top for other pages
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
  // BUGFIX: Disable browser scroll restoration on homepage to prevent conflicts
  // Always start from the top for consistent navigation experience
  if (isHomepage() && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // BUGFIX: Force scroll to top on homepage load/back navigation
  if (isHomepage()) {
    window.scrollTo(0, 0);
    setTimeout(initializeScrollSystem, 50); // Very short delay
    setTimeout(initializeScrollToTopButton, 100);
  }
  
  $(document).ready(function() {
    initializeAllFeatures();

    // Re-initialize if not already done
    if (isHomepage() && !scrollSystem.initialized) {
      setTimeout(initializeScrollSystem, 100);
    }
  });

  $(window).on('beforeunload', function() {
    resetScrollSystem();
  });

  $(window).on('load', function() {
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

  // BUGFIX: Handle back button navigation - always reset to top
  window.addEventListener('pageshow', function(event) {
    if (isHomepage()) {
      // If page is loaded from cache (bfcache), reset scroll position
      if (event.persisted) {
        window.scrollTo(0, 0);
        scrollSystem.currentSection = 0;
        updateDotNavigation();
      }
    }
  });

  // BUGFIX: Handle browser back/forward navigation
  window.addEventListener('popstate', function() {
    if (isHomepage()) {
      window.scrollTo(0, 0);
      scrollSystem.currentSection = 0;
      if (scrollSystem.initialized) {
        updateDotNavigation();
      }
    }
  });
});

// Fallback initialization
setTimeout(function() {
  if (isHomepage()) {
    const container = document.getElementById('section-dots');
    if (container && container.children.length === 0) {
      if (typeof scrollSystem !== 'undefined' && scrollSystem.arrSections && scrollSystem.arrSections.length > 0) {
        createDotNavigation();
      }
    }
  }
}, 2000);

})(); // End of IIFE wrapper