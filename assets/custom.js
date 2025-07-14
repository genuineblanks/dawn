// ===============================================
// ENHANCED SCROLL SYSTEM - MOBILE & DESKTOP
// ===============================================

(function() {
  'use strict';

// ===============================================
// MOBILE DETECTION UTILITIES
// ===============================================
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
         window.innerWidth <= 768;
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// MOBILE DETECTION - PRESERVE DESKTOP FUNCTIONALITY
const IS_MOBILE_DEVICE = isMobileDevice();
const IS_HOMEPAGE = document.body.classList.contains('home-section') || 
                    document.body.classList.contains('template-index') || 
                    window.location.pathname === '/';

// Export functions for other scripts
window.isMobileDevice = isMobileDevice;
window.isIOS = isIOS;

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
  durationOneScroll: 800, // ENHANCED: Increased for smoother animation
  currentSection: 0,
  arrSections: [],
  isEnabled: false,
  initialized: false,
  resizeTimeout: null,
  dotNavigation: null,
  easingFunction: 'easeInOutCubic' // ENHANCED: Smoother easing
};

// Animation tracking variables
let animationStartTime = 0;
let animationTarget = null;
let disabledListeners = [];
let originalListeners = {};
let globalAnimationTimeout = null;

// ===============================================
// MOBILE TOUCH SUPPORT - COMPLETELY REWRITTEN FOR RELIABILITY
// ===============================================
let touchStartY = 0;
let touchEndY = 0;
let touchStartTime = 0;
let touchStartX = 0;
let touchEndX = 0;
let initialTouchY = 0;
let hasMoved = false;
let touchTarget = null;
let lastTouchTime = 0;

// SECTION LOCKING MECHANISM - Prevents multi-section jumping
let lastSwipeTime = 0;
let swipeCooldownPeriod = 300; // 300ms cooldown between swipes
let isSwipeInProgress = false;

// ENHANCED OVERSCROLL PROTECTION
let overscrollDetected = false;
let lastValidScrollPosition = 0;
let scrollBoundaryTimeout = null;
let overscrollRecoveryActive = false;

// DESKTOP ONLY - Mobile device detection (redundant but kept for compatibility)
function isMobileDeviceCheck() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
         window.innerWidth <= 768;
}

// DESKTOP ONLY - iOS specific detection (redundant but kept for compatibility) 
function isIOSCheck() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function handleTouchStart(e) {
  if (!isHomepage() || !scrollSystem.isEnabled || scrollSystem.inScroll) return;
  
  const touch = e.touches[0];
  touchStartY = touch.clientY;
  touchStartX = touch.clientX;
  initialTouchY = touch.clientY;
  touchStartTime = Date.now();
  hasMoved = false;
  touchTarget = e.target;
  
  // FIXED: No preventDefault in passive events - allow all native iOS behavior
  lastTouchTime = Date.now();
}

function handleTouchMove(e) {
  if (!isHomepage() || !scrollSystem.isEnabled || scrollSystem.inScroll) return;
  
  // SIMPLIFIED: If touching dot navigation, let it handle everything
  if (touchTarget && (
    touchTarget.classList.contains('section-dot') || 
    touchTarget.closest('.section-dot-navigation')
  )) {
    return; // Let dots work normally
  }
  
  const touch = e.touches[0];
  const deltaY = Math.abs(touch.clientY - initialTouchY);
  const deltaX = Math.abs(touch.clientX - touchStartX);
  
  // Mark as moved with lower threshold for mobile
  if (deltaY > 3 || deltaX > 3) {
    hasMoved = true;
  }
  
  // FIXED: No preventDefault needed - passive events allow native scrolling
  // Just track movement for section navigation detection
}

function handleTouchEnd(e) {
  if (!isHomepage() || !scrollSystem.isEnabled || scrollSystem.inScroll) return;
  
  // SECTION LOCKING: Check cooldown period
  const currentTime = Date.now();
  if (currentTime - lastSwipeTime < swipeCooldownPeriod) {
    hasMoved = false;
    touchTarget = null;
    return;
  }
  
  // SIMPLIFIED: If touching dot navigation, let it handle everything
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
  
  // IMPROVED SWIPE DETECTION - Much more sensitive for natural mobile gestures
  const isMobile = isMobileDevice();
  const minDistance = isMobile ? 25 : 40;      // REDUCED: Much more sensitive for mobile
  const maxDuration = isMobile ? 1000 : 1200;  // More generous timing for mobile
  const ratioThreshold = isMobile ? 1.5 : 1.2; // More forgiving ratio for mobile
  
  // SIMPLIFIED validation - remove the redundant 80px check
  const isValidSwipe = touchDuration < maxDuration && 
                      totalVerticalDistance > minDistance && 
                      totalVerticalDistance > horizontalDistance * ratioThreshold &&
                      hasMoved;
  
  if (isValidSwipe) {
    // SECTION LOCKING: Set swipe in progress
    isSwipeInProgress = true;
    lastSwipeTime = currentTime;
    
    let targetSection = scrollSystem.currentSection;
    const swipeThreshold = isMobile ? 15 : 25; // REDUCED: More sensitive threshold
    
    if (verticalDistance > swipeThreshold) {
      // Swipe up = next section (EXACTLY ONE SECTION)
      targetSection = Math.min(scrollSystem.currentSection + 1, scrollSystem.arrSections.length - 1);
    } else if (verticalDistance < -swipeThreshold) {
      // Swipe down = previous section (EXACTLY ONE SECTION)
      targetSection = Math.max(scrollSystem.currentSection - 1, 0);
    }
    
    if (targetSection !== scrollSystem.currentSection) {
      goToSection(targetSection);
    } else {
      isSwipeInProgress = false;
      scrollSystem.inScroll = false;
    }
  }
  
  // Reset all touch tracking
  hasMoved = false;
  touchTarget = null;
}

// ===============================================
// MOBILE TOUCH FAILSAFE SYSTEM - ENHANCED
// ===============================================
function addMobileTouchFailsafe() {
  if (!isMobileDevice() || !isHomepage()) return;
  
  let swipeAttempts = 0;
  let lastSwipeTime = 0;
  
  // Alternative touch detection using pointer events
  if (window.PointerEvent) {
    
    let pointerStartY = 0;
    let pointerStartTime = 0;
    let pointerMoved = false;
    
    document.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch' && isHomepage() && scrollSystem.isEnabled) {
        pointerStartY = e.clientY;
        pointerStartTime = Date.now();
        pointerMoved = false;
      }
    });
    
    document.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch' && pointerStartY > 0) {
        const deltaY = Math.abs(e.clientY - pointerStartY);
        if (deltaY > 5) {
          pointerMoved = true;
        }
      }
    });
    
    document.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'touch' && isHomepage() && scrollSystem.isEnabled && !scrollSystem.inScroll && pointerMoved) {
        const pointerDistance = pointerStartY - e.clientY;
        const pointerDuration = Date.now() - pointerStartTime;
        
        if (Math.abs(pointerDistance) > 35 && pointerDuration < 1200) {
          swipeAttempts++;
          
          if (Date.now() - lastSwipeTime > 500) { // Reasonable debounce
            let targetSection = scrollSystem.currentSection;
            
            if (pointerDistance > 35) {
              targetSection = Math.min(scrollSystem.currentSection + 1, scrollSystem.arrSections.length - 1);
            } else if (pointerDistance < -35) {
              targetSection = Math.max(scrollSystem.currentSection - 1, 0);
            }
            
            if (targetSection !== scrollSystem.currentSection) {
              goToSection(targetSection);
              lastSwipeTime = Date.now();
            }
          }
        }
      }
      // Reset pointer tracking
      pointerStartY = 0;
      pointerMoved = false;
    });
  }
  
  // Wheel event failsafe for devices that support it
  let wheelTimeout;
  document.addEventListener('wheel', (e) => {
    if (!isHomepage() || !scrollSystem.isEnabled || scrollSystem.inScroll) return;
    
    // Clear previous timeout
    clearTimeout(wheelTimeout);
    
    // Set timeout to process wheel event
    wheelTimeout = setTimeout(() => {
      const deltaY = e.deltaY;
      
      if (Math.abs(deltaY) > 50) {
        
        let targetSection = scrollSystem.currentSection;
        
        if (deltaY > 50) {
          targetSection = Math.min(scrollSystem.currentSection + 1, scrollSystem.arrSections.length - 1);
        } else if (deltaY < -50) {
          targetSection = Math.max(scrollSystem.currentSection - 1, 0);
        }
        
        if (targetSection !== scrollSystem.currentSection) {
          goToSection(targetSection);
        }
      }
    }, 50);
  }, { passive: true });
  
  // Enhanced scroll event monitoring for animation
  let scrollMonitorTimeout;
  let lastScrollTime = 0;
  
  window.addEventListener('scroll', () => {
    if (!isHomepage() || !scrollSystem.isEnabled) return;
    
    const currentTime = Date.now();
    lastScrollTime = currentTime;
    clearTimeout(scrollMonitorTimeout);
    
    scrollMonitorTimeout = setTimeout(() => {
      if (scrollSystem.inScroll) {
        scrollSystem.inScroll = false;
        animationStartTime = 0;
        animationTarget = null;
      }
    }, 1000);
  }, { passive: true });
  
  // Add visual indicator for mobile users
  setTimeout(() => {
    if (scrollSystem.dotNavigation && isMobileDevice()) {
      // Brief flash to show swipe is available
      const originalOpacity = scrollSystem.dotNavigation.style.opacity;
      scrollSystem.dotNavigation.style.opacity = '1';
      scrollSystem.dotNavigation.style.transform = 'translateY(-50%) scale(1.1)';
      
      setTimeout(() => {
        if (scrollSystem.dotNavigation) {
          scrollSystem.dotNavigation.style.opacity = originalOpacity;
          scrollSystem.dotNavigation.style.transform = 'translateY(-50%) scale(1)';
        }
      }, 1500);
    }
  }, 2000);
}

// ===============================================
// ENHANCED OVERSCROLL PROTECTION AND RECOVERY
// ===============================================
function initializeOverscrollProtection() {
  if (!isMobileDevice() || !isHomepage()) return;
  
  // Monitor scroll boundaries and detect overscroll
  let boundaryCheckInterval = setInterval(() => {
    if (!scrollSystem.isEnabled) return;
    
    const currentScroll = window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const minScroll = 0;
    
    // Check if we're outside valid boundaries
    if (currentScroll < minScroll - 50 || currentScroll > maxScroll + 50) {
      if (!overscrollDetected) {
        
        overscrollDetected = true;
        handleOverscrollRecovery(currentScroll, minScroll, maxScroll);
      }
    } else {
      if (overscrollDetected) {
        overscrollDetected = false;
        overscrollRecoveryActive = false;
      }
      lastValidScrollPosition = currentScroll;
    }
  }, 100);
  
  // Enhanced overscroll prevention
  document.addEventListener('touchmove', function(e) {
    if (!scrollSystem.isEnabled || scrollSystem.inScroll) return;
    
    const currentScroll = window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    // Prevent further scrolling at boundaries
    if ((currentScroll <= 0 && e.touches[0].clientY > initialTouchY) ||
        (currentScroll >= maxScroll && e.touches[0].clientY < initialTouchY)) {
      e.preventDefault();
    }
  }, { passive: false });
}

function handleOverscrollRecovery(currentScroll, minScroll, maxScroll) {
  if (overscrollRecoveryActive) return;
  
  overscrollRecoveryActive = true;
  
  // Determine recovery target
  let recoveryTarget;
  if (currentScroll < minScroll) {
    recoveryTarget = 0; // Snap to top
  } else if (currentScroll > maxScroll) {
    recoveryTarget = maxScroll; // Snap to bottom
  } else {
    recoveryTarget = lastValidScrollPosition; // Return to last valid position
  }
  
  // Find closest section to recovery target
  let closestSection = 0;
  let minDistance = Infinity;
  scrollSystem.arrSections.forEach((sectionPos, index) => {
    const distance = Math.abs(recoveryTarget - sectionPos);
    if (distance < minDistance) {
      minDistance = distance;
      closestSection = index;
    }
  });
  
  // Perform recovery scroll
  setTimeout(() => {
    if (!scrollSystem.inScroll) {
      scrollSystem.currentSection = closestSection;
      goToSection(closestSection);
    }
  }, 200); // Small delay to avoid conflicts
}

// ===============================================
// MOBILE CONFLICT DETECTION SYSTEM
// ===============================================
function addMobileConflictDetection() {
  if (!isMobileDevice() || !isHomepage()) return;
  
  // Monitor touch events during animation
  const touchEventTypes = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
  
  touchEventTypes.forEach(eventType => {
    document.addEventListener(eventType, (e) => {
      if (scrollSystem.inScroll) {
        // Touch events during animation are monitored but not logged for performance
      }
    }, { passive: true });
  });
  
  // Monitor CSS conflicts during animation
  const checkCSSConflicts = () => {
    if (scrollSystem.inScroll) {
      const body = document.body;
      const html = document.documentElement;
      
      // Check for CSS conflicts that might interrupt animation
      const conflicts = [];
      
      // Check scroll-behavior
      const scrollBehavior = window.getComputedStyle(html).scrollBehavior;
      if (scrollBehavior === 'smooth') {
        conflicts.push({
          type: 'css-scroll-behavior',
          value: scrollBehavior,
          element: 'html'
        });
      }
      
      // Check for CSS touch-action - 'auto' allows all touch gestures to interfere
      const touchAction = window.getComputedStyle(body).touchAction;
      if (touchAction === 'auto') {
        conflicts.push({
          type: 'css-touch-action',
          value: touchAction,
          element: 'body',
          issue: 'allows all touch gestures to interfere'
        });
      }
    }
  };
  
  // Check for CSS conflicts every 100ms during animation
  setInterval(checkCSSConflicts, 100);
  
  // Monitor viewport changes that might affect animation
  window.addEventListener('resize', () => {
    if (scrollSystem.inScroll) {
      // Viewport resize during animation
    }
  });
  
  // Monitor orientation changes
  window.addEventListener('orientationchange', () => {
    if (scrollSystem.inScroll) {
      // Orientation change during animation
    }
  });
}

// ===============================================
// FORCED RESET MECHANISM FOR STUCK INSCROLL STATE
// ===============================================
function startInScrollWatchdog() {
  if (!isMobileDevice()) return;
  
  let lastInScrollCheck = false;
  let stuckCount = 0;
  
  setInterval(() => {
    if (scrollSystem.inScroll) {
      stuckCount++;
      
      // If inScroll has been true for more than 5 seconds, force reset
      if (stuckCount >= 10) { // 10 checks * 500ms = 5 seconds
        scrollSystem.inScroll = false;
        animationStartTime = 0;
        animationTarget = null;
        restoreConflictingListeners();
        clearTimeout(globalAnimationTimeout);
        stuckCount = 0;
      }
    } else {
      stuckCount = 0;
    }
    
    lastInScrollCheck = scrollSystem.inScroll;
  }, 500); // Check every 500ms
}

// ===============================================
// MOBILE SCROLL CAPABILITY TEST
// ===============================================
function testMobileScrollCapabilities() {
  if (!isMobileDevice()) return;
  
  const testResults = {
    smoothScrollSupport: 'scrollBehavior' in document.documentElement.style,
    currentScroll: window.pageYOffset,
    documentHeight: document.documentElement.scrollHeight,
    windowHeight: window.innerHeight,
    canScroll: document.documentElement.scrollHeight > window.innerHeight
  };
  
  // Test if we can scroll at all
  if (testResults.canScroll && testResults.currentScroll < 100) {
    const originalPosition = window.pageYOffset;
    
    // Try to scroll down a little
    window.scrollTo(0, originalPosition + 50);
    
    setTimeout(() => {
      const newPosition = window.pageYOffset;
      const scrollWorked = Math.abs(newPosition - (originalPosition + 50)) < 10;
      
      // Restore original position
      window.scrollTo(0, originalPosition);
    }, 200);
  }
}

// ===============================================
// ANIMATION ISOLATION SYSTEM
// ===============================================
function disableConflictingListeners() {
  if (!isMobileDevice()) return;
  
  // List of events that might interfere with scroll animation
  const conflictingEvents = [
    'wheel',
    'mousewheel', 
    'DOMMouseScroll',
    'keydown',
    'keyup'
  ];
  
  // Disable these events on document level
  conflictingEvents.forEach(eventType => {
    const originalHandler = document[`on${eventType}`];
    if (originalHandler) {
      originalListeners[eventType] = originalHandler;
      document[`on${eventType}`] = null;
    }
  });
  
  // Temporarily disable CSS conflicts that interfere with animation
  const html = document.documentElement;
  const body = document.body;
  
  // Store original CSS values
  originalListeners.htmlScrollBehavior = html.style.scrollBehavior;
  originalListeners.bodyScrollBehavior = body.style.scrollBehavior;
  originalListeners.bodyOverscrollBehavior = body.style.overscrollBehavior;
  originalListeners.bodyTouchAction = body.style.touchAction;
  
  // Set optimal CSS values for animation
  html.style.setProperty('scroll-behavior', 'auto', 'important');
  body.style.setProperty('scroll-behavior', 'auto', 'important');
  
  // CRITICAL: Fix the CSS conflicts detected  
  body.style.setProperty('touch-action', 'pan-y', 'important'); // Restrict to vertical scrolling only
}

function restoreConflictingListeners() {
  if (!isMobileDevice()) return;
  
  // Restore original event handlers and CSS properties
  Object.keys(originalListeners).forEach(eventType => {
    if (eventType.includes('ScrollBehavior')) {
      // Handle scroll-behavior CSS properties
      const element = eventType.includes('html') ? document.documentElement : document.body;
      if (originalListeners[eventType]) {
        element.style.scrollBehavior = originalListeners[eventType];
      } else {
        element.style.removeProperty('scroll-behavior');
      }
    } else if (eventType === 'bodyOverscrollBehavior') {
      // Handle overscroll-behavior CSS property
      if (originalListeners[eventType]) {
        document.body.style.overscrollBehavior = originalListeners[eventType];
      } else {
        document.body.style.removeProperty('overscroll-behavior');
      }
    } else if (eventType === 'bodyTouchAction') {
      // Handle touch-action CSS property
      if (originalListeners[eventType]) {
        document.body.style.touchAction = originalListeners[eventType];
      } else {
        document.body.style.removeProperty('touch-action');
      }
    } else {
      // Handle event listeners
      if (originalListeners[eventType]) {
        document[`on${eventType}`] = originalListeners[eventType];
      }
    }
  });
  
  // Clear the stored listeners
  originalListeners = {};
}

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
  }
}

// ===============================================
// JQUERY WAIT UTILITY
// ===============================================
function waitForJQuery(callback) {
  if (typeof $ !== 'undefined' && $ && $.fn) {
    // Initialize custom easing when jQuery is ready
    initializeCustomEasing();
    callback();
  } else {
    setTimeout(() => waitForJQuery(callback), 100);
  }
}

// ===============================================
// DOT NAVIGATION SYSTEM - FUNCTIONAL ELEGANT RIGHT-SIDE
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
      goToSection(index);
    };
    
    dot.addEventListener('click', clickHandler);
    touchArea.addEventListener('click', clickHandler);
    
    // Add touch handler for mobile - on both elements
    const touchHandler = function(e) {
      e.preventDefault();
      e.stopPropagation();
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
  
  if (scrollSystem.inScroll || sectionIndex < 0 || sectionIndex >= scrollSystem.arrSections.length || !isHomepage()) {
    return;
  }
  
  scrollSystem.inScroll = true;
  
  const oldSection = scrollSystem.currentSection;
  scrollSystem.currentSection = sectionIndex;
  
  // Set animation tracking variables for scroll monitoring
  animationStartTime = Date.now();
  animationTarget = scrollSystem.arrSections[sectionIndex];
  
  // Disable conflicting listeners during animation (mobile only)
  disableConflictingListeners();
  
  // CRITICAL: Global timeout fallback to prevent inScroll getting stuck
  clearTimeout(globalAnimationTimeout);
  globalAnimationTimeout = setTimeout(() => {
    scrollSystem.inScroll = false;
    
    // SECTION LOCKING: Reset swipe progress on timeout too
    isSwipeInProgress = false;
    
    animationStartTime = 0;
    animationTarget = null;
    restoreConflictingListeners();
  }, scrollSystem.durationOneScroll + 2000); // 2 second buffer
  
  updateDotNavigation();
  
  // Stop any existing animations first
  $('html, body').stop(true, false);
  
  const startTime = Date.now();
  const startScroll = window.pageYOffset;
  const targetScroll = scrollSystem.arrSections[sectionIndex];
  
  // ENHANCED: Safe easing with fallback
  let safeEasing = scrollSystem.easingFunction;
  if (!$.easing || !$.easing[scrollSystem.easingFunction]) {
    safeEasing = 'swing'; // jQuery default smooth easing
  }
  
  $('html, body').animate({
    scrollTop: targetScroll
  }, {
    duration: scrollSystem.durationOneScroll,
    easing: safeEasing, // ENHANCED: Safe easing with fallback
    complete: function() {
      scrollSystem.inScroll = false;
      
      // SECTION LOCKING: Reset swipe progress when animation completes
      isSwipeInProgress = false;
      
      // Clear global timeout
      clearTimeout(globalAnimationTimeout);
      
      // Reset animation tracking
      animationStartTime = 0;
      animationTarget = null;
      
      // Restore conflicting listeners
      restoreConflictingListeners();
    },
    fail: function() {
      scrollSystem.inScroll = false;
      
      // SECTION LOCKING: Reset swipe progress on failure too
      isSwipeInProgress = false;
      
      // Clear global timeout
      clearTimeout(globalAnimationTimeout);
      
      // Reset animation tracking
      animationStartTime = 0;
      animationTarget = null;
      
      // Restore conflicting listeners
      restoreConflictingListeners();
    }
  });
}

// ===============================================
// SECTION POSITION CALCULATIONS
// ===============================================
function calculateSectionPositions() {
  if (!scrollSystem.$sections || scrollSystem.$sections.length === 0 || !isHomepage()) return;
  
  const oldPositions = [...scrollSystem.arrSections];
  
  // ENHANCED: Better mobile section position calculation
  scrollSystem.arrSections = scrollSystem.$sections.map(function(index) {
    const section = $(this);
    let sectionTop = section.offset().top;
    
    // MOBILE FIX: Ensure sections align to proper boundaries
    if (isMobileDevice()) {
      const viewportHeight = window.innerHeight;
      const headerHeight = $('.header').outerHeight() || 0;
      
      // Account for header height in positioning
      const adjustedSectionTop = sectionTop - headerHeight;
      
      // For first section, should be 0 (or just after header)
      if (index === 0) {
        sectionTop = 0;
      } else {
        // For subsequent sections, calculate based on viewport height
        const expectedPosition = index * viewportHeight;
        
        // If section is close to expected viewport position, snap it
        if (Math.abs(adjustedSectionTop - expectedPosition) < 150) {
          sectionTop = expectedPosition;
        }
      }
    }
    
    return sectionTop;
  }).get();
  
  updateCurrentSectionFromScrollPosition();
  
  return oldPositions;
}

function updateCurrentSectionFromScrollPosition() {
  if (!isHomepage()) return;
  
  const currentScrollPos = window.pageYOffset;
  let closestSection = 0;
  let minDistance = Infinity;
  
  // ENHANCED: Better section detection with tolerance for mobile
  const detectionTolerance = isMobileDevice() ? 75 : 50; // More forgiving for mobile
  
  scrollSystem.arrSections.forEach((sectionTop, index) => {
    const distance = Math.abs(currentScrollPos - sectionTop);
    
    // ANDROID FIX: If we're within tolerance, prefer viewport-aligned positions
    if (isMobileDevice() && distance <= detectionTolerance) {
      const viewportHeight = window.innerHeight;
      const expectedPosition = index * viewportHeight;
      const viewportAlignedDistance = Math.abs(currentScrollPos - expectedPosition);
      
      // If viewport-aligned position is closer, use that for comparison
      if (viewportAlignedDistance < distance) {
        if (viewportAlignedDistance < minDistance) {
          minDistance = viewportAlignedDistance;
          closestSection = index;
        }
        return;
      }
    }
    
    if (distance < minDistance) {
      minDistance = distance;
      closestSection = index;
    }
  });
  
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
  
  // MOBILE: Enable section scrolling for mobile devices too
  if (IS_MOBILE_DEVICE) {
    // Apply mobile-specific optimizations
    document.body.style.touchAction = 'pan-y';
    document.body.style.webkitOverflowScrolling = 'touch';
    // Mobile gets overscroll behavior none only when needed
    document.body.style.overscrollBehavior = 'none';
  } else {
    // Desktop optimizations - Allow normal scrolling
    document.body.style.overscrollBehavior = 'auto';
    document.body.style.touchAction = 'auto';
  }
  
  scrollSystem.$sections = $('section');
  
  calculateSectionPositions();
  
  // FIXED: Enable for mobile even with fewer sections, but stricter for desktop
  const minSectionsRequired = IS_MOBILE_DEVICE ? 2 : 4;
  scrollSystem.isEnabled = scrollSystem.arrSections.length > minSectionsRequired;
  scrollSystem.initialized = true;
  
  if (scrollSystem.isEnabled) {
    createDotNavigation();
    bindScrollEvents();
    updateDotNavigation();
    
    // ENHANCED MOBILE TOUCH SUPPORT
    const isMobile = IS_MOBILE_DEVICE;
    
    if (isMobile) {
      // Mobile-specific optimizations
      
      // iOS specific fixes
      if (isIOS()) {
        document.body.style.webkitOverflowScrolling = 'touch';
        document.documentElement.style.webkitOverflowScrolling = 'touch';
      }
      
      // FIXED: Completely passive touch events - no interference with native scrolling
      const touchOptions = { 
        passive: true, 
        capture: false,
        once: false
      };
      
      // CRITICAL: Make touchmove passive too to avoid blocking scrolling
      const touchMoveOptions = { 
        passive: true, 
        capture: false,
        once: false
      };
      
      // Remove any existing touch listeners first
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      // FIXED: Add touch listeners with proper options
      document.addEventListener('touchstart', handleTouchStart, touchOptions);
      document.addEventListener('touchmove', handleTouchMove, touchMoveOptions);
      document.addEventListener('touchend', handleTouchEnd, touchOptions);
      
      // Add visual feedback for mobile users
      setTimeout(() => {
        if (scrollSystem.dotNavigation) {
          scrollSystem.dotNavigation.style.opacity = '0.8';
          setTimeout(() => {
            if (scrollSystem.dotNavigation) {
              scrollSystem.dotNavigation.style.opacity = '0.6';
            }
          }, 2000);
        }
      }, 1000);
      
    } else {
      // Desktop touch support (for touch laptops)
      const touchOptions = { passive: false, capture: true };
      document.addEventListener('touchstart', handleTouchStart, touchOptions);
      document.addEventListener('touchmove', handleTouchMove, touchOptions);
      document.addEventListener('touchend', handleTouchEnd, touchOptions);
    }
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
    
    scrollSystem.inScroll = true;

    if (event.originalEvent.deltaY > 0) {
      scrollSystem.currentSection = scrollSystem.currentSection >= scrollSystem.arrSections.length - 1
        ? scrollSystem.arrSections.length - 1
        : scrollSystem.currentSection + 1;
    } else {
      scrollSystem.currentSection = scrollSystem.currentSection === 0 ? 0 : scrollSystem.currentSection - 1;
    }

    updateDotNavigation();

    $('html, body').animate({
      scrollTop: scrollSystem.arrSections[scrollSystem.currentSection]
    }, {
      duration: scrollSystem.durationOneScroll,
      complete: function() {
        scrollSystem.inScroll = false;
      }
    });
  });
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
  
  if (!isHomepage()) {
    return;
  }
  
  setTimeout(initializeScrollSystem, 500);
  setTimeout(applyUltimateScrollFix, 600);
  setTimeout(addMobileConflictDetection, 700);
  setTimeout(testMobileScrollCapabilities, 800);
  setTimeout(startInScrollWatchdog, 900);
  
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
     setTimeout(function() {
       handleWindowResize();
     }, 500);
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
  
  // Initialize scroll system immediately if homepage
  if (isHomepage()) {
    setTimeout(initializeScrollSystem, 50); // Very short delay
    setTimeout(initializeScrollToTopButton, 100);
    setTimeout(initializeOverscrollProtection, 120); // ENHANCED: Add overscroll protection
    setTimeout(addMobileConflictDetection, 150);
    setTimeout(testMobileScrollCapabilities, 200);
    setTimeout(startInScrollWatchdog, 250);
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