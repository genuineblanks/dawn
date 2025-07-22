// ===============================================
// ENHANCED SCROLL SYSTEM - MOBILE & DESKTOP
// ===============================================

(function() {
  'use strict';
  
  console.log('🚀 Enhanced Scroll System Loading... VERSION 2024-07-10-FIXED');

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

console.log('📱 Device Detection - Device:', IS_MOBILE_DEVICE ? 'MOBILE' : 'DESKTOP', 'Homepage:', IS_HOMEPAGE);

// Export functions for other scripts
window.isMobileDevice = isMobileDevice;
window.isIOS = isIOS;

// Initialize collection button states when page loads
$(document).ready(function() {
  // Set initial selected state - luxury collection is default  
  if ($('.luxury-collection').is(':visible')) {
    $('.luxury-collection .changeSection').addClass('selected');
  } else if ($('.high-end-collection').is(':visible')) {
    $('.high-end-collection .changeSection').addClass('selected');
  }
});

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
  durationOneScroll: 800, // ENHANCED: Increased for smoother animation
  currentSection: 0,
  arrSections: [],
  isEnabled: false,
  initialized: false,
  resizeTimeout: null,
  dotNavigation: null,
  easingFunction: 'easeInOutCubic' // ENHANCED: Smoother easing
};

// Animation tracking variables for debugging
let animationStartTime = 0;
let animationTarget = null;
let touchEventsDuringAnimation = [];
let conflictingEvents = [];
let disabledListeners = [];
let originalListeners = {};
let globalAnimationTimeout = null;

// USER INTERACTION PRIORITY SYSTEM
let userInteractionActive = false;
let userInteractionTimeout = null;
let animationCompletionDelay = 500; // ms to wait after animation before allowing auto-updates

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
  // DESKTOP ONLY: Mobile devices use natural scrolling + dot navigation
  if (isMobileDevice()) return;
  
  if (!isHomepage() || !scrollSystem.isEnabled || scrollSystem.inScroll) return;
  
  const touch = e.touches[0];
  touchStartY = touch.clientY;
  touchStartX = touch.clientX;
  initialTouchY = touch.clientY;
  touchStartTime = Date.now();
  hasMoved = false;
  touchTarget = e.target;
  
  lastTouchTime = Date.now();
  
  console.log('🖥️ Desktop touch start at:', touchStartY);
}

function handleTouchMove(e) {
  // DESKTOP ONLY: Mobile devices use natural scrolling + dot navigation  
  if (isMobileDevice()) return;
  
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
  
  if (deltaY > 50 && deltaY > deltaX * 2) {
    console.log('🖥️ Desktop touch movement detected, deltaY:', deltaY, 'deltaX:', deltaX);
  }
}

function handleTouchEnd(e) {
  // DESKTOP ONLY: Mobile devices use natural scrolling + dot navigation
  if (isMobileDevice()) return;
  
  if (!isHomepage() || !scrollSystem.isEnabled || scrollSystem.inScroll) return;
  
  // If touching dot navigation, let it handle everything
  if (touchTarget && (
    touchTarget.classList.contains('section-dot') || 
    touchTarget.closest('.section-dot-navigation')
  )) {
    console.log('🖥️ Desktop touch on dot navigation - allowing normal behavior');
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
// MOBILE DEBUG AND FAILSAFE SYSTEM
// ===============================================
function createMobileDebugPanel() {
  if (!isMobileDevice() || !isHomepage()) return;
  
  // Only show debug on mobile with ?debug=mobile in URL
  if (!window.location.search.includes('debug=mobile')) return;
  
  const debugPanel = document.createElement('div');
  debugPanel.id = 'mobile-debug-panel';
  debugPanel.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 10px;
    font-family: monospace;
    font-size: 11px;
    z-index: 99999;
    border-radius: 5px;
    max-width: 200px;
    max-height: 150px;
    overflow-y: auto;
  `;
  
  debugPanel.innerHTML = '<div id="mobile-debug-content">Mobile Debug Active...</div>';
  document.body.appendChild(debugPanel);
  
  // Override console.log for mobile debugging
  const originalLog = console.log;
  console.log = function(...args) {
    originalLog.apply(console, args);
    const debugContent = document.getElementById('mobile-debug-content');
    if (debugContent && args[0] && args[0].includes('📱')) {
      debugContent.innerHTML += '<br>' + args.join(' ');
      debugContent.scrollTop = debugContent.scrollHeight;
    }
  };
  
  console.log('📱 Mobile debug panel created');
}

// ===============================================
// MOBILE TOUCH FAILSAFE SYSTEM - ENHANCED
// ===============================================
function addMobileTouchFailsafe() {
  // DISABLED: Mobile uses natural scrolling (this was interfering)
  return;
  
  if (!isMobileDevice() || !isHomepage()) return;
  
  let swipeAttempts = 0;
  let lastSwipeTime = 0;
  
  // Alternative touch detection using pointer events
  if (window.PointerEvent) {
    console.log('📱 Adding aggressive pointer event failsafe');
    
    let pointerStartY = 0;
    let pointerStartTime = 0;
    let pointerMoved = false;
    
    document.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch' && isHomepage() && scrollSystem.isEnabled) {
        pointerStartY = e.clientY;
        pointerStartTime = Date.now();
        pointerMoved = false;
        console.log('📱 Pointer down at:', pointerStartY);
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
        
        console.log('📱 Pointer up analysis:', {
          distance: pointerDistance,
          duration: pointerDuration,
          moved: pointerMoved
        });
        
        if (Math.abs(pointerDistance) > 35 && pointerDuration < 1200) {
          console.log('📱 🔥 Pointer failsafe TRIGGERED:', pointerDistance);
          swipeAttempts++;
          
          if (Date.now() - lastSwipeTime > 500) { // Reasonable debounce
            let targetSection = scrollSystem.currentSection;
            
            if (pointerDistance > 35) {
              targetSection = Math.min(scrollSystem.currentSection + 1, scrollSystem.arrSections.length - 1);
              console.log('📱 🚀 POINTER UP - Next section:', targetSection);
            } else if (pointerDistance < -35) {
              targetSection = Math.max(scrollSystem.currentSection - 1, 0);
              console.log('📱 🚀 POINTER DOWN - Previous section:', targetSection);
            }
            
            if (targetSection !== scrollSystem.currentSection) {
              console.log('📱 ✅ POINTER FAILSAFE EXECUTING:', scrollSystem.currentSection, '->', targetSection);
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
        console.log('📱 🔥 Wheel failsafe triggered:', deltaY);
        
        let targetSection = scrollSystem.currentSection;
        
        if (deltaY > 50) {
          targetSection = Math.min(scrollSystem.currentSection + 1, scrollSystem.arrSections.length - 1);
          console.log('📱 🚀 WHEEL DOWN - Next section:', targetSection);
        } else if (deltaY < -50) {
          targetSection = Math.max(scrollSystem.currentSection - 1, 0);
          console.log('📱 🚀 WHEEL UP - Previous section:', targetSection);
        }
        
        if (targetSection !== scrollSystem.currentSection) {
          console.log('📱 ✅ WHEEL FAILSAFE EXECUTING:', scrollSystem.currentSection, '->', targetSection);
          console.log('📱 🎯 Wheel failsafe will call goToSection (no premature inScroll setting)');
          goToSection(targetSection);
        }
      }
    }, 50);
  }, { passive: true });
  
  // Enhanced scroll event monitoring for animation debugging
  let scrollMonitorTimeout;
  let lastScrollTime = 0;
  
  window.addEventListener('scroll', () => {
    if (!isHomepage() || !scrollSystem.isEnabled) return;
    
    const currentTime = Date.now();
    const scrollPos = window.pageYOffset;
    
    // CRITICAL: Log scroll events during animation
    if (scrollSystem.inScroll) {
      console.log('🔄 ⚠️ SCROLL EVENT DURING ANIMATION:', {
        time: currentTime - (animationStartTime || 0) + 'ms since start',
        scrollPos: scrollPos,
        target: animationTarget,
        diff: animationTarget ? Math.abs(scrollPos - animationTarget) : 'unknown',
        timeSinceLastScroll: currentTime - lastScrollTime + 'ms'
      });
    }
    
    lastScrollTime = currentTime;
    clearTimeout(scrollMonitorTimeout);
    
    scrollMonitorTimeout = setTimeout(() => {
      if (scrollSystem.inScroll) {
        console.log('📱 ⚠️ Scroll stuck detected - resetting inScroll flag');
        scrollSystem.inScroll = false;
        animationStartTime = 0;
        animationTarget = null;
      }
    }, 1000);
  }, { passive: true });
  
  console.log('📱 ✅ Enhanced mobile touch failsafe systems activated');
  
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
  // DISABLED: Mobile uses natural scrolling (this was blocking scroll)
  return;
  
  if (!isMobileDevice() || !isHomepage()) return;
  
  console.log('🛡️ Initializing enhanced overscroll protection...');
  
  // Monitor scroll boundaries and detect overscroll
  let boundaryCheckInterval = setInterval(() => {
    if (!scrollSystem.isEnabled) return;
    
    const currentScroll = window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const minScroll = 0;
    
    // Check if we're outside valid boundaries
    if (currentScroll < minScroll - 50 || currentScroll > maxScroll + 50) {
      if (!overscrollDetected) {
        console.log('🚨 OVERSCROLL DETECTED:', {
          currentScroll: currentScroll,
          minScroll: minScroll,
          maxScroll: maxScroll,
          deviation: currentScroll < minScroll ? currentScroll - minScroll : currentScroll - maxScroll
        });
        
        overscrollDetected = true;
        handleOverscrollRecovery(currentScroll, minScroll, maxScroll);
      }
    } else {
      if (overscrollDetected) {
        console.log('✅ Scroll returned to valid boundaries');
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
      console.log('🛡️ Preventing overscroll at boundary');
      e.preventDefault();
    }
  }, { passive: false });
  
  console.log('🛡️ Enhanced overscroll protection active');
}

function handleOverscrollRecovery(currentScroll, minScroll, maxScroll) {
  if (overscrollRecoveryActive) return;
  
  overscrollRecoveryActive = true;
  console.log('🔧 Initiating overscroll recovery...');
  
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
  
  console.log('🎯 Overscroll recovery - snapping to section:', closestSection, 'at position:', scrollSystem.arrSections[closestSection]);
  
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
  // DISABLED: Mobile uses natural scrolling (this was interfering)
  return;
  
  if (!isMobileDevice() || !isHomepage()) return;
  
  console.log('🔍 Setting up mobile conflict detection...');
  
  // Monitor touch events during animation
  const touchEventTypes = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
  
  touchEventTypes.forEach(eventType => {
    document.addEventListener(eventType, (e) => {
      if (scrollSystem.inScroll) {
        const touchInfo = {
          type: eventType,
          time: Date.now() - animationStartTime,
          touches: e.touches ? e.touches.length : 0,
          target: e.target.tagName || 'unknown'
        };
        
        touchEventsDuringAnimation.push(touchInfo);
        
        console.log('🚨 TOUCH EVENT DURING ANIMATION:', touchInfo);
        
        // Check for problematic touch events
        if (eventType === 'touchstart' && e.touches && e.touches.length > 1) {
          console.log('⚠️ MULTI-TOUCH DETECTED during animation - potential conflict!');
          conflictingEvents.push({
            type: 'multi-touch',
            time: touchInfo.time,
            details: 'Multiple fingers detected during scroll animation'
          });
        }
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
      
      // Removed overscroll-behavior conflict detection to prevent animation issues
      
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
      
      if (conflicts.length > 0) {
        console.log('🔴 CSS CONFLICTS DETECTED during animation:', conflicts);
        conflictingEvents.push(...conflicts.map(c => ({
          ...c,
          time: Date.now() - animationStartTime
        })));
      }
    }
  };
  
  // Check for CSS conflicts every 100ms during animation
  setInterval(checkCSSConflicts, 100);
  
  // Monitor viewport changes that might affect animation
  window.addEventListener('resize', () => {
    if (scrollSystem.inScroll) {
      console.log('📱 ⚠️ VIEWPORT RESIZE during animation - potential conflict!');
      conflictingEvents.push({
        type: 'viewport-resize',
        time: Date.now() - animationStartTime,
        details: 'Viewport size changed during scroll animation'
      });
    }
  });
  
  // Monitor orientation changes
  window.addEventListener('orientationchange', () => {
    if (scrollSystem.inScroll) {
      console.log('📱 ⚠️ ORIENTATION CHANGE during animation - potential conflict!');
      conflictingEvents.push({
        type: 'orientation-change',
        time: Date.now() - animationStartTime,
        details: 'Device orientation changed during scroll animation'
      });
    }
  });
  
  console.log('✅ Mobile conflict detection system activated');
}

// ===============================================
// FORCED RESET MECHANISM FOR STUCK INSCROLL STATE
// ===============================================
function startInScrollWatchdog() {
  // DISABLED: Mobile uses natural scrolling (not needed)
  return;
  
  if (!isMobileDevice()) return;
  
  console.log('🛡️ Starting inScroll watchdog for mobile...');
  
  let lastInScrollCheck = false;
  let stuckCount = 0;
  
  setInterval(() => {
    if (scrollSystem.inScroll) {
      stuckCount++;
      console.log('🛡️ inScroll watchdog check:', {
        inScroll: scrollSystem.inScroll,
        stuckCount: stuckCount,
        animationStartTime: animationStartTime,
        timeSinceStart: animationStartTime ? Date.now() - animationStartTime : 0
      });
      
      // If inScroll has been true for more than 5 seconds, force reset
      if (stuckCount >= 10) { // 10 checks * 500ms = 5 seconds
        console.log('🚨 WATCHDOG: Forcing inScroll reset - system appears stuck!');
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
  // DISABLED: Mobile uses natural scrolling (not needed)
  return;
  
  if (!isMobileDevice()) return;
  
  console.log('🧪 Testing mobile scroll capabilities...');
  
  const testResults = {
    smoothScrollSupport: 'scrollBehavior' in document.documentElement.style,
    currentScroll: window.pageYOffset,
    documentHeight: document.documentElement.scrollHeight,
    windowHeight: window.innerHeight,
    canScroll: document.documentElement.scrollHeight > window.innerHeight
  };
  
  console.log('🧪 Mobile scroll test results:', testResults);
  
  // Test if we can scroll at all
  if (testResults.canScroll && testResults.currentScroll < 100) {
    console.log('🧪 Testing basic scroll functionality...');
    const originalPosition = window.pageYOffset;
    
    // Try to scroll down a little
    window.scrollTo(0, originalPosition + 50);
    
    setTimeout(() => {
      const newPosition = window.pageYOffset;
      const scrollWorked = Math.abs(newPosition - (originalPosition + 50)) < 10;
      console.log('🧪 Basic scroll test:', {
        originalPosition: originalPosition,
        targetPosition: originalPosition + 50,
        actualPosition: newPosition,
        scrollWorked: scrollWorked
      });
      
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
  
  console.log('🔒 Disabling conflicting listeners during animation...');
  
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
  
  console.log('🔒 CSS conflicts fixed:', {
    'touch-action': 'pan-y (restricts to vertical scrolling)',
    'scroll-behavior': 'auto (prevents CSS smooth scrolling conflicts)'
  });
  
  console.log('🔒 Conflicting listeners disabled');
}

function restoreConflictingListeners() {
  if (!isMobileDevice()) return;
  
  console.log('🔓 Restoring conflicting listeners after animation...');
  
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
  
  console.log('🔓 CSS properties restored:', {
    'touch-action': 'restored to original value',
    'scroll-behavior': 'restored to original value'
  });
  
  // Clear the stored listeners
  originalListeners = {};
  
  console.log('🔓 Conflicting listeners restored');
}

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
// DOT NAVIGATION SYSTEM - FUNCTIONAL ELEGANT RIGHT-SIDE
// ===============================================
function createDotNavigation() {
  // MOBILE REMOVAL: Skip dot navigation on mobile devices
  if (isMobileDevice()) {
    console.log('📱 Mobile device detected - skipping dot navigation creation');
    return;
  }
  console.log('🎯 Creating functional elegant dot navigation...');
  
  // Force remove any existing containers first
  const existingContainers = document.querySelectorAll('#section-dots, .section-dot-navigation');
  existingContainers.forEach(container => container.remove());
  console.log('🗑️ Removed existing containers:', existingContainers.length);
  
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
  console.log('✅ Created and appended new dot container');
  
  // Set the dotNavigation reference
  scrollSystem.dotNavigation = dotContainer;
  
  // Log container details
  console.log('📍 Container position:', dotContainer.getBoundingClientRect());
  console.log('🎨 Container parent:', dotContainer.parentElement);
  console.log('👁️ Container visible:', dotContainer.offsetWidth > 0 && dotContainer.offsetHeight > 0);
  
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
  
  // Create dots for each unique section
  scrollSystem.arrSections.forEach((sectionPos, index) => {
    console.log('🎯 Creating dot', index, 'for section at position', sectionPos);
    
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
      console.log('🎯 Dot clicked:', index, 'going to section at position:', scrollSystem.arrSections[index]);
      
      // USER INTERACTION PRIORITY: Set flag to prevent auto-updates
      userInteractionActive = true;
      clearTimeout(userInteractionTimeout);
      console.log('🎯 User interaction started - blocking auto-updates');
      
      goToSection(index);
    };
    
    dot.addEventListener('click', clickHandler);
    touchArea.addEventListener('click', clickHandler);
    
    // Add touch handler for mobile - on both elements
    const touchHandler = function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('📱 Dot touched:', index);
      
      // USER INTERACTION PRIORITY: Set flag to prevent auto-updates
      userInteractionActive = true;
      clearTimeout(userInteractionTimeout);
      console.log('📱 User touch interaction started - blocking auto-updates');
      
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
    console.log('🎯 Dot', index, 'added to container. Dot size:', dot.getBoundingClientRect());
  });
  
  // REMOVED: Container hover effects since we have no background
  // Clean design with transparent background
  
  console.log('✅ Functional elegant dot navigation created on right side');
  console.log('📏 Final container size:', dotContainer.getBoundingClientRect());
  console.log('👶 Container children count:', dotContainer.children.length);
  
  // Test if container is actually visible
  setTimeout(() => {
    const rect = dotContainer.getBoundingClientRect();
    console.log('🔍 Container visibility test:', {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      right: window.innerWidth - rect.right,
      visible: rect.width > 0 && rect.height > 0,
      rightSide: rect.right > window.innerWidth - 50
    });
  }, 100);
  
  updateDotNavigation();
}

function updateDotNavigation() {
  // Try to find the container if not set
  if (!scrollSystem.dotNavigation) {
    scrollSystem.dotNavigation = document.getElementById('section-dots');
  }
  
  if (!scrollSystem.dotNavigation) {
    console.log('❌ Dot navigation container still not found');
    return;
  }
  
  const dots = scrollSystem.dotNavigation.children;
  console.log('🎯 Updating dots - current section:', scrollSystem.currentSection, 'total dots:', dots.length);
  
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
      console.log('🎯 Activated dot', i, 'with enhanced size and glow');
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
  // MOBILE REMOVAL: Block section navigation on mobile devices
  if (isMobileDevice()) {
    console.log('📱 Mobile device detected - section navigation disabled');
    return;
  }
  console.log('🔥 NEW GOTOSECTION VERSION 2024-07-10-FIXED CALLED for section:', sectionIndex);
  console.log('🔍 Pre-check: inScroll =', scrollSystem.inScroll, 'should be false to proceed');
  
  if (scrollSystem.inScroll || sectionIndex < 0 || sectionIndex >= scrollSystem.arrSections.length || !isHomepage()) {
    console.log('🚫 goToSection blocked:', {
      inScroll: scrollSystem.inScroll,
      sectionIndex: sectionIndex,
      arrLength: scrollSystem.arrSections.length,
      isHomepage: isHomepage()
    });
    return;
  }
  
  console.log('✅ goToSection proceeding - all checks passed');
  
  console.log('🎯 🚀 STARTING goToSection:', {
    from: scrollSystem.currentSection,
    to: sectionIndex,
    targetPosition: scrollSystem.arrSections[sectionIndex],
    currentScroll: window.pageYOffset,
    duration: scrollSystem.durationOneScroll
  });
  
  console.log('🔴 SETTING inScroll = true at start of goToSection');
  scrollSystem.inScroll = true;
  console.log('🔴 inScroll flag status:', scrollSystem.inScroll);
  
  const oldSection = scrollSystem.currentSection;
  scrollSystem.currentSection = sectionIndex;
  
  // Set animation tracking variables for scroll monitoring
  animationStartTime = Date.now();
  animationTarget = scrollSystem.arrSections[sectionIndex];
  
  // Reset conflict tracking arrays
  touchEventsDuringAnimation = [];
  conflictingEvents = [];
  
  // Disable conflicting listeners during animation (mobile only)
  disableConflictingListeners();
  
  // CRITICAL: Global timeout fallback to prevent inScroll getting stuck
  clearTimeout(globalAnimationTimeout);
  globalAnimationTimeout = setTimeout(() => {
    console.log('🚨 GLOBAL TIMEOUT: Animation took too long, forcing reset!');
    console.log('🟠 SETTING inScroll = false via global timeout');
    scrollSystem.inScroll = false;
    console.log('🟠 inScroll flag after timeout reset:', scrollSystem.inScroll);
    
    // SECTION LOCKING: Reset swipe progress on timeout too
    isSwipeInProgress = false;
    console.log('🔓 Section unlocked after global timeout');
    
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
  
  // Use the same reliable jQuery animation system for both desktop and mobile
  console.log('🎯 Using UNIFIED JQUERY animation for', IS_MOBILE_DEVICE ? 'MOBILE' : 'DESKTOP');
  
  // ENHANCED: Safe easing with fallback
  let safeEasing = scrollSystem.easingFunction;
  if (!$.easing || !$.easing[scrollSystem.easingFunction]) {
    console.log('⚠️ Custom easing not available, falling back to swing');
    safeEasing = 'swing'; // jQuery default smooth easing
  }
  console.log('🎯 Using easing function:', safeEasing);
  
  $('html, body').animate({
    scrollTop: targetScroll
  }, {
    duration: scrollSystem.durationOneScroll,
    easing: safeEasing, // ENHANCED: Safe easing with fallback
    progress: function(animation, progress, remainingMs) {
      const deviceType = IS_MOBILE_DEVICE ? 'MOBILE' : 'DESKTOP';
      console.log(`📈 ${deviceType} Animation progress:`, {
        progress: Math.round(progress * 100) + '%',
        currentScroll: window.pageYOffset,
        targetScroll: targetScroll,
        remainingMs: remainingMs,
        inScroll: scrollSystem.inScroll,
        smoothness: 'Enhanced with ' + scrollSystem.easingFunction
      });
    },
    complete: function() {
      const endTime = Date.now();
      const finalScroll = window.pageYOffset;
      const deviceType = IS_MOBILE_DEVICE ? 'MOBILE' : 'DESKTOP';
      
      console.log('🟢 SETTING inScroll = false in jQuery complete');
      scrollSystem.inScroll = false;
      console.log('🟢 inScroll flag after jQuery completion:', scrollSystem.inScroll);
      
      // SECTION LOCKING: Reset swipe progress when animation completes
      isSwipeInProgress = false;
      console.log('🔓 Section unlocked - swipe can proceed after cooldown');
      
      // Clear global timeout
      clearTimeout(globalAnimationTimeout);
      
      // USER INTERACTION PRIORITY: Clear user interaction flag after delay
      clearTimeout(userInteractionTimeout);
      userInteractionTimeout = setTimeout(() => {
        userInteractionActive = false;
        console.log('✅ User interaction timeout cleared - auto-updates re-enabled');
      }, animationCompletionDelay);
      
      console.log(`✅ ✅ ${deviceType} Animation COMPLETE:`, {
        section: sectionIndex,
        duration: endTime - startTime + 'ms',
        startScroll: startScroll,
        targetScroll: targetScroll,
        finalScroll: finalScroll,
        reached: Math.abs(finalScroll - targetScroll) < 50,
        inScroll: scrollSystem.inScroll,
        touchEventsDetected: touchEventsDuringAnimation.length,
        conflictsDetected: conflictingEvents.length
      });
      
      // Report conflicts if any were detected (mainly for mobile debugging)
      if (conflictingEvents.length > 0) {
        console.log('🔴 CONFLICTS DETECTED during animation:', conflictingEvents);
      }
      
      if (touchEventsDuringAnimation.length > 0) {
        console.log('👆 TOUCH EVENTS during animation:', touchEventsDuringAnimation);
      }
      
      // Reset animation tracking
      animationStartTime = 0;
      animationTarget = null;
      
      // Restore conflicting listeners
      restoreConflictingListeners();
    },
    fail: function() {
      const deviceType = IS_MOBILE_DEVICE ? 'MOBILE' : 'DESKTOP';
      console.log(`❌ ❌ ${deviceType} Animation FAILED:`, {
        section: sectionIndex,
        currentScroll: window.pageYOffset,
        targetScroll: targetScroll,
        timeSinceStart: Date.now() - startTime + 'ms',
        touchEventsDetected: touchEventsDuringAnimation.length,
        conflictsDetected: conflictingEvents.length
      });
      scrollSystem.inScroll = false;
      
      // SECTION LOCKING: Reset swipe progress on failure too
      isSwipeInProgress = false;
      console.log('🔓 Section unlocked after animation failure');
      
      // Report failure reasons for debugging
      if (conflictingEvents.length > 0) {
        console.log('🔴 FAILURE REASON - CONFLICTS DETECTED:', conflictingEvents);
      }
      
      if (touchEventsDuringAnimation.length > 0) {
        console.log('👆 FAILURE REASON - TOUCH EVENTS:', touchEventsDuringAnimation);
      }
      
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
    
    // MOBILE: Use natural section positions (no artificial snapping)
    console.log(`✅ Section ${index} uses natural position:`, sectionTop);
    
    return sectionTop;
  }).get();
  
  console.log('📍 Enhanced section positions (Android optimized):', scrollSystem.arrSections);
  updateCurrentSectionFromScrollPosition();
  
  return oldPositions;
}

// MOBILE-SPECIFIC SECTION DETECTION (no blocking flags)
function updateMobileSectionDetection() {
  if (!isHomepage() || !scrollSystem.arrSections || scrollSystem.arrSections.length === 0) return;
  
  const currentScrollPos = window.pageYOffset;
  const viewportHeight = window.innerHeight;
  let closestSection = 0;
  
  // If at top of page, always use section 0
  if (currentScrollPos < 50) {
    closestSection = 0;
  } else {
    // Find section with most viewport overlap
    const scrollTop = currentScrollPos;
    const scrollBottom = currentScrollPos + viewportHeight;
    let bestOverlap = 0;
    
    for (let i = 0; i < scrollSystem.arrSections.length; i++) {
      const sectionStart = scrollSystem.arrSections[i];
      const sectionEnd = i < scrollSystem.arrSections.length - 1 
        ? scrollSystem.arrSections[i + 1] 
        : sectionStart + viewportHeight * 2;
      
      const overlapStart = Math.max(scrollTop, sectionStart);
      const overlapEnd = Math.min(scrollBottom, sectionEnd);
      const overlap = Math.max(0, overlapEnd - overlapStart);
      
      if (overlap > bestOverlap) {
        bestOverlap = overlap;
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

function updateCurrentSectionFromScrollPosition() {
  if (!isHomepage()) return;
  
  // CRITICAL FIX: Don't update section during animations on ANY device - prevents interference with dot clicks
  if (scrollSystem.inScroll) {
    console.log('🚫 Section detection skipped during animation - preserving user navigation target');
    return;
  }
  
  // USER INTERACTION PRIORITY: Don't auto-update during user interactions
  if (userInteractionActive) {
    console.log('🚫 Section detection skipped during user interaction - preserving user choice');
    return;
  }
  
  const currentScrollPos = window.pageYOffset;
  let closestSection = 0;
  let minDistance = Infinity;
  
  // SAFETY CHECK: Must have sections
  if (!scrollSystem.arrSections || scrollSystem.arrSections.length === 0) {
    return;
  }
  
  // IMPROVED: Use viewport-aware detection for both mobile and desktop
  const viewportHeight = window.innerHeight;
  
  if (isMobileDevice()) {
    // INITIAL LOAD FIX: If we're at the very top (within 50px), always use section 0
    if (currentScrollPos < 50) {
      closestSection = 0;
      console.log('📱 Mobile: At page top, using section 0');
    } else {
      const viewportHeight = window.innerHeight;
      const scrollTop = currentScrollPos;
      const scrollBottom = currentScrollPos + viewportHeight;
      
      // Find section that has the most overlap with the current viewport
      let bestOverlap = 0;
      let bestSection = 0;
      
      for (let i = 0; i < scrollSystem.arrSections.length; i++) {
        const sectionStart = scrollSystem.arrSections[i];
        const sectionEnd = i < scrollSystem.arrSections.length - 1 
          ? scrollSystem.arrSections[i + 1] 
          : sectionStart + viewportHeight * 2; // Give last section more space
        
        // Calculate overlap between viewport and section
        const overlapStart = Math.max(scrollTop, sectionStart);
        const overlapEnd = Math.min(scrollBottom, sectionEnd);
        const overlap = Math.max(0, overlapEnd - overlapStart);
        
        if (overlap > bestOverlap) {
          bestOverlap = overlap;
          bestSection = i;
        }
      }
      
      closestSection = bestSection;
      console.log('📱 Mobile section detection:', {
        currentScrollPos,
        viewportHeight,
        detectedSection: closestSection,
        overlap: bestOverlap,
        sectionTop: scrollSystem.arrSections[closestSection]
      });
    }
  } else {
    // DESKTOP: Use improved viewport-aware detection (less bias toward early sections)
    if (currentScrollPos < 50) {
      closestSection = 0;
      console.log('🖥️ Desktop: At page top, using section 0');
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
      
      console.log('🖥️ Desktop section detection:', {
        currentScrollPos,
        viewportCenter,
        detectedSection: closestSection,
        distance: bestDistance,
        sectionTop: scrollSystem.arrSections[closestSection]
      });
    }
  }
  
  const oldSection = scrollSystem.currentSection;
  
  // CRITICAL DEBUG: Log when this runs during animation
  if (scrollSystem.inScroll) {
    console.log('⚠️ ⚠️ updateCurrentSectionFromScrollPosition called DURING ANIMATION:', {
      inScroll: scrollSystem.inScroll,
      currentScrollPos: currentScrollPos,
      oldSection: oldSection,
      detectedSection: closestSection,
      willUpdate: oldSection !== closestSection
    });
  }
  
  scrollSystem.currentSection = closestSection;
  
  if (oldSection !== closestSection) {
    console.log('📍 Current section updated from', oldSection, 'to', closestSection, 
               scrollSystem.inScroll ? '(DURING ANIMATION!)' : '(normal)');
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
  
  // MOBILE REMOVAL: Completely disable scroll system on mobile
  if (isMobileDevice()) {
    console.log('📱 Mobile device detected - scroll system disabled');
    return;
  }
  
  console.log('🖥️ Desktop device detected - enabling desktop section scrolling');
  // Desktop optimizations - Allow normal scrolling  
  document.body.style.overscrollBehavior = 'auto';
  document.body.style.touchAction = 'auto';
  
  console.log('🚀 Initializing scroll system for desktop...');
  
  scrollSystem.$sections = $('section');
  console.log('🔍 Found sections:', scrollSystem.$sections.length);
  
  calculateSectionPositions();
  console.log('📍 Found sections at positions:', scrollSystem.arrSections);
  
  // FIXED: Enable for mobile even with fewer sections, but stricter for desktop
  const minSectionsRequired = IS_MOBILE_DEVICE ? 2 : 4;
  scrollSystem.isEnabled = scrollSystem.arrSections.length > minSectionsRequired;
  scrollSystem.initialized = true;
  
  console.log('📊 Section analysis:', {
    sectionsFound: scrollSystem.arrSections.length,
    minRequired: minSectionsRequired,
    isEnabled: scrollSystem.isEnabled,
    isMobile: IS_MOBILE_DEVICE
  });
  
  if (scrollSystem.isEnabled) {
    console.log('✅ Scroll system enabled');
    createDotNavigation();
    bindScrollEvents();
    updateDotNavigation();
    
    // ENHANCED MOBILE TOUCH SUPPORT
    const isMobile = IS_MOBILE_DEVICE;
    console.log('📱 Device type:', isMobile ? 'Mobile' : 'Desktop', 'iOS:', isIOS());
    
    if (isMobile) {
      // Mobile: Natural scrolling only, no section forcing
      console.log('📱 Mobile: Using natural scrolling + dot navigation (no touch event binding)');
      
      // Mobile visual feedback for dot navigation
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
      
      console.log('📱 Desktop touch support enabled');
    }
    
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
  console.log('📱 Initializing all features...');
  
  if (!isHomepage()) {
    console.log('❌ Not on homepage - skipping scroll features');
    return;
  }
  
  setTimeout(initializeScrollSystem, 500);
  setTimeout(applyUltimateScrollFix, 600);
  setTimeout(addMobileConflictDetection, 700);
  setTimeout(testMobileScrollCapabilities, 800);
  setTimeout(startInScrollWatchdog, 900);
  
  $(".changeSection").click(function(e){
    e.preventDefault();
    
    // Don't proceed if this button is already selected
    if ($(this).hasClass('selected')) {
      return false;
    }
    
    var parentSectionClass = $(this).closest("section").attr("class");
    
    // Remove selected class from all collection buttons
    $('.changeSection').removeClass('selected');
    
    // Add selected class to clicked button
    $(this).addClass('selected');
    
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
     if (!scrollSystem.initialized) return;
     
     // MOBILE REMOVAL: Skip all scroll handling on mobile
     if (isMobileDevice()) {
       return;
     }
     
     // DESKTOP ONLY: Keep existing logic with animation checks
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
  console.log('📱 jQuery ready - IMMEDIATE initialization');
  
  // Initialize scroll system immediately if homepage
  if (isHomepage()) {
    console.log('🏠 Homepage detected - initializing scroll system NOW');
    setTimeout(initializeScrollSystem, 50); // Very short delay
    setTimeout(initializeScrollToTopButton, 100);
    setTimeout(initializeOverscrollProtection, 120); // ENHANCED: Add overscroll protection
    setTimeout(addMobileConflictDetection, 150);
    setTimeout(testMobileScrollCapabilities, 200);
    setTimeout(startInScrollWatchdog, 250);
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