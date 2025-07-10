// ===============================================
// NUCLEAR MOBILE FIX - BYPASS CUSTOM SCROLL ON MOBILE
// ===============================================

console.log('🚀 Enhanced Scroll System Loading...');

// ===============================================
// MOBILE DETECTION - NUCLEAR BYPASS
// ===============================================
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
         window.innerWidth <= 768;
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// NUCLEAR FIX: Complete mobile bypass
const IS_MOBILE_DEVICE = isMobileDevice();
const IS_HOMEPAGE = document.body.classList.contains('home-section') || 
                    document.body.classList.contains('template-index') || 
                    window.location.pathname === '/';

console.log('📱 NUCLEAR MOBILE FIX - Device:', IS_MOBILE_DEVICE ? 'MOBILE' : 'DESKTOP', 'Homepage:', IS_HOMEPAGE);

if (IS_MOBILE_DEVICE) {
  console.log('📱 🚫 MOBILE DETECTED - BYPASSING ALL CUSTOM SCROLL FUNCTIONALITY');
  console.log('📱 ✅ USING 100% NATIVE MOBILE SCROLLING');
  
  // Force native scrolling CSS
  document.documentElement.style.cssText += `
    scroll-behavior: auto !important;
    overflow: auto !important;
    -webkit-overflow-scrolling: touch !important;
    overscroll-behavior: auto !important;
  `;
  
  document.body.style.cssText += `
    overflow: auto !important;
    -webkit-overflow-scrolling: touch !important;
    overscroll-behavior: auto !important;
    touch-action: pan-y !important;
  `;
  
  // Export mobile detection for other scripts
  window.isMobileDevice = function() { return true; };
  window.isIOS = isIOS;
  window.scrollSystem = { isEnabled: false, initialized: false, inScroll: false };
  
  // Stop all execution of custom scroll system
  return;
}

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
  durationOneScroll: 600,
  currentSection: 0,
  arrSections: [],
  isEnabled: false,
  initialized: false,
  resizeTimeout: null,
  dotNavigation: null
};

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
  
  // FIXED: Only prevent double-tap zoom on iOS for very quick taps
  if (isIOS() && Date.now() - lastTouchTime < 200) {
    // Only prevent if touching the same spot
    const sameTouchArea = Math.abs(touch.clientY - initialTouchY) < 10 && Math.abs(touch.clientX - touchStartX) < 10;
    if (sameTouchArea) {
      e.preventDefault();
    }
  }
  lastTouchTime = Date.now();
  
  console.log('📱 Touch start at:', touchStartY, 'Device:', isMobileDevice() ? 'Mobile' : 'Desktop');
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
  
  // FIXED: Only prevent default for very large vertical movements to avoid blocking normal scrolling
  if (deltaY > 50 && deltaY > deltaX * 2) {
    e.preventDefault();
    console.log('📱 Preventing default - large vertical swipe detected, deltaY:', deltaY, 'deltaX:', deltaX);
  }
}

function handleTouchEnd(e) {
  if (!isHomepage() || !scrollSystem.isEnabled || scrollSystem.inScroll) return;
  
  // SIMPLIFIED: If touching dot navigation, let it handle everything
  if (touchTarget && (
    touchTarget.classList.contains('section-dot') || 
    touchTarget.closest('.section-dot-navigation')
  )) {
    console.log('📱 Touch on dot navigation - allowing normal behavior');
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
  
  console.log('📱 Touch end analysis:', {
    duration: touchDuration,
    verticalDistance: verticalDistance,
    horizontalDistance: horizontalDistance,
    totalVertical: totalVerticalDistance,
    moved: hasMoved,
    mobile: isMobileDevice(),
    startY: touchStartY,
    endY: touchEndY
  });
  
  // ENHANCED SWIPE DETECTION - Balanced thresholds for mobile
  const isMobile = isMobileDevice();
  const minDistance = isMobile ? 30 : 40;      // Reasonable threshold for mobile
  const maxDuration = isMobile ? 1500 : 1200;  // Reasonable time for mobile
  const ratioThreshold = isMobile ? 1.5 : 1.2; // Balanced ratio for mobile
  
  const isValidSwipe = touchDuration < maxDuration && 
                      totalVerticalDistance > minDistance && 
                      (totalVerticalDistance > horizontalDistance * ratioThreshold || totalVerticalDistance > 40) &&
                      hasMoved;
  
  console.log('📱 Swipe validation:', {
    isValid: isValidSwipe,
    durationOK: touchDuration < maxDuration,
    distanceOK: totalVerticalDistance > minDistance,
    ratioOK: totalVerticalDistance > horizontalDistance * ratioThreshold,
    movedOK: hasMoved,
    thresholds: { minDistance, maxDuration, ratioThreshold }
  });
  
  if (isValidSwipe) {
    e.preventDefault();
    
    console.log('📱 ✅ VALID SWIPE DETECTED - Processing section change...');
    scrollSystem.inScroll = true;
    
    let targetSection = scrollSystem.currentSection;
    const swipeThreshold = isMobile ? 20 : 25; // Reasonable threshold for direction
    
    if (verticalDistance > swipeThreshold) {
      // Swipe up = next section
      targetSection = Math.min(scrollSystem.currentSection + 1, scrollSystem.arrSections.length - 1);
      console.log('📱 🔥 SWIPE UP detected - Going to section:', targetSection, 'from:', scrollSystem.currentSection);
    } else if (verticalDistance < -swipeThreshold) {
      // Swipe down = previous section
      targetSection = Math.max(scrollSystem.currentSection - 1, 0);
      console.log('📱 🔥 SWIPE DOWN detected - Going to section:', targetSection, 'from:', scrollSystem.currentSection);
    }
    
    if (targetSection !== scrollSystem.currentSection) {
      console.log('📱 🚀 EXECUTING SECTION NAVIGATION:', scrollSystem.currentSection, '->', targetSection);
      console.log('📱 🎯 Target position:', scrollSystem.arrSections[targetSection]);
      goToSection(targetSection);
    } else {
      console.log('📱 ❌ No section change - same section');
      scrollSystem.inScroll = false;
    }
  } else {
    console.log('📱 ❌ Invalid swipe - conditions not met');
    console.log('📱 💡 Try: Swipe more vertically, faster, or with more distance');
  }
  
  // Reset all touch tracking
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
          scrollSystem.inScroll = true;
          goToSection(targetSection);
        }
      }
    }, 50);
  }, { passive: true });
  
  // Scroll event monitoring for stuck states
  let scrollMonitorTimeout;
  window.addEventListener('scroll', () => {
    if (!isHomepage() || !scrollSystem.isEnabled) return;
    
    clearTimeout(scrollMonitorTimeout);
    
    scrollMonitorTimeout = setTimeout(() => {
      if (scrollSystem.inScroll) {
        console.log('📱 ⚠️ Scroll stuck detected - resetting inScroll flag');
        scrollSystem.inScroll = false;
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
// DOT NAVIGATION SYSTEM - FUNCTIONAL ELEGANT RIGHT-SIDE
// ===============================================
function createDotNavigation() {
  console.log('🎯 Creating functional elegant dot navigation...');
  
  // Force remove any existing containers first
  const existingContainers = document.querySelectorAll('#section-dots, .section-dot-navigation');
  existingContainers.forEach(container => container.remove());
  console.log('🗑️ Removed existing containers:', existingContainers.length);
  
  // Always create a fresh container
  const dotContainer = document.createElement('div');
  dotContainer.id = 'section-dots';
  dotContainer.className = 'section-dot-navigation';
  
  // FUNCTIONAL ELEGANT RIGHT-SIDE STYLING
  dotContainer.style.cssText = `
    position: fixed !important;
    right: 20px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    z-index: 999999 !important;
    background: rgba(0, 0, 0, 0.4) !important;
    padding: 12px 8px !important;
    border-radius: 18px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-evenly !important;
    align-items: center !important;
    gap: 8px !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    min-height: 160px !important;
    opacity: 0.6 !important;
    visibility: visible !important;
    pointer-events: auto !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
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
    
    // FUNCTIONAL ELEGANT DOT STYLING
    dot.style.cssText = `
      width: 8px !important;
      height: 8px !important;
      background: rgba(255, 255, 255, 0.6) !important;
      border-radius: 50% !important;
      cursor: pointer !important;
      border: 1px solid transparent !important;
      opacity: 1 !important;
      visibility: visible !important;
      display: block !important;
      position: relative !important;
      flex-shrink: 0 !important;
      transition: all 0.3s ease !important;
      margin: 2px 0 !important;
    `;
    
    // Add larger touch area for mobile
    const touchArea = document.createElement('div');
    touchArea.style.cssText = `
      position: absolute !important;
      top: -12px !important;
      left: -12px !important;
      right: -12px !important;
      bottom: -12px !important;
      cursor: pointer !important;
      z-index: 1 !important;
    `;
    
    dot.appendChild(touchArea);
    
    // Add click handler to both dot and touch area
    const clickHandler = function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('🎯 Dot clicked:', index, 'going to section at position:', scrollSystem.arrSections[index]);
      goToSection(index);
    };
    
    dot.addEventListener('click', clickHandler);
    touchArea.addEventListener('click', clickHandler);
    
    // Add touch handler for mobile - on both elements
    const touchHandler = function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('📱 Dot touched:', index);
      goToSection(index);
    };
    
    dot.addEventListener('touchend', touchHandler);
    touchArea.addEventListener('touchend', touchHandler);
    
    // Elegant hover effect
    dot.addEventListener('mouseenter', function() {
      if (index !== scrollSystem.currentSection) {
        dot.style.background = 'rgba(255, 255, 255, 0.8)';
        dot.style.transform = 'scale(1.3)';
      }
    });
    
    dot.addEventListener('mouseleave', function() {
      if (index !== scrollSystem.currentSection) {
        dot.style.background = 'rgba(255, 255, 255, 0.6)';
        dot.style.transform = 'scale(1)';
      }
    });
    
    // Append to container
    dotContainer.appendChild(dot);
    console.log('🎯 Dot', index, 'added to container. Dot size:', dot.getBoundingClientRect());
  });
  
  // Elegant hover effects for container
  dotContainer.addEventListener('mouseenter', function() {
    dotContainer.style.opacity = '0.9';
    dotContainer.style.background = 'rgba(0, 0, 0, 0.6)';
    dotContainer.style.border = '1px solid rgba(255, 255, 255, 0.3)';
  });
  
  dotContainer.addEventListener('mouseleave', function() {
    dotContainer.style.opacity = '0.6';
    dotContainer.style.background = 'rgba(0, 0, 0, 0.4)';
    dotContainer.style.border = '1px solid rgba(255, 255, 255, 0.2)';
  });
  
  // FUNCTIONAL FEATURE: Increase opacity during scroll
  let scrollTimeout;
  const handleScroll = () => {
    dotContainer.style.opacity = '0.8';
    dotContainer.style.background = 'rgba(0, 0, 0, 0.5)';
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (!dotContainer.matches(':hover')) {
        dotContainer.style.opacity = '0.6';
        dotContainer.style.background = 'rgba(0, 0, 0, 0.4)';
      }
    }, 1500);
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
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
      // Active dot - clearly visible but elegant
      dots[i].style.background = 'rgba(255, 255, 255, 1)';
      dots[i].style.border = '1px solid rgba(255, 255, 255, 0.8)';
      dots[i].style.transform = 'scale(1.6)';
      dots[i].style.boxShadow = '0 0 6px rgba(255, 255, 255, 0.4)';
      dots[i].classList.add('active');
      console.log('🎯 Activated dot', i);
    } else {
      // Inactive dots - visible but subdued
      dots[i].style.background = 'rgba(255, 255, 255, 0.6)';
      dots[i].style.border = '1px solid transparent';
      dots[i].style.transform = 'scale(1)';
      dots[i].style.boxShadow = 'none';
      dots[i].classList.remove('active');
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
    
    // ENHANCED MOBILE TOUCH SUPPORT
    const isMobile = isMobileDevice();
    console.log('📱 Device type:', isMobile ? 'Mobile' : 'Desktop', 'iOS:', isIOS());
    
    if (isMobile) {
      // Mobile-specific optimizations
      console.log('📱 Applying mobile optimizations...');
      
      // Disable overscroll behavior
      document.body.style.overscrollBehavior = 'none';
      document.documentElement.style.overscrollBehavior = 'none';
      
      // iOS specific fixes
      if (isIOS()) {
        document.body.style.webkitOverflowScrolling = 'touch';
        document.documentElement.style.webkitOverflowScrolling = 'touch';
      }
      
      // FIXED: Enhanced touch event options for mobile - allow passive where possible
      const touchOptions = { 
        passive: true, 
        capture: false,
        once: false
      };
      
      // Non-passive options only for touchmove to allow preventDefault when needed
      const touchMoveOptions = { 
        passive: false, 
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
      
      console.log('📱 Mobile touch events bound successfully');
      
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