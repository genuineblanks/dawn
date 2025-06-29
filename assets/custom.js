// Section Scroll JS - Enhanced with Robust Browser UI Handling

let scrollSystem = {
  $sections: null,
  inScroll: false,
  durationOneScroll: 600,
  currentSection: 0,
  arrSections: [],
  isEnabled: true,
  initialized: false,
  isMobile: false,
  touchStartY: 0,
  touchEndY: 0,
  minSwipeDistance: 80,
  initialViewportHeight: 0,
  lastRecalculation: 0,
  isWaitingForStabilization: false
};

function updateViewportHeight() {
  const currentHeight = window.innerHeight;
  
  // Store initial height on first load
  if (scrollSystem.initialViewportHeight === 0) {
    scrollSystem.initialViewportHeight = currentHeight;
  }
  
  document.documentElement.style.setProperty('--real-viewport-height', `${currentHeight}px`);
  console.log('📐 Viewport height updated to:', currentHeight);
}

function detectMobile() {
  scrollSystem.isMobile = window.innerWidth <= 768;
  console.log('📱 Mobile detected:', scrollSystem.isMobile);
}

function waitForJQuery(callback) {
  if (typeof $ !== 'undefined' && $ && $.fn) {
    console.log('✅ jQuery is ready');
    callback();
  } else {
    console.log('⏳ Waiting for jQuery...');
    setTimeout(() => waitForJQuery(callback), 100);
  }
}

function recalculateSections() {
  if (!scrollSystem.initialized || !scrollSystem.$sections) return;
  
  // Prevent too frequent recalculations
  const now = Date.now();
  if (now - scrollSystem.lastRecalculation < 100) return;
  scrollSystem.lastRecalculation = now;
  
  const oldSections = [...scrollSystem.arrSections];
  scrollSystem.arrSections = scrollSystem.$sections.map(function() {
    return $(this).offset().top;
  }).get();
  
  // Update current section based on scroll position
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
  
  scrollSystem.currentSection = closestSection;
  
  console.log('📐 Sections recalculated:', scrollSystem.arrSections);
  console.log('📍 Current section updated to:', scrollSystem.currentSection);
}

function initializeScrollSystem() {
  if (scrollSystem.initialized) return;
  
  detectMobile();
  updateViewportHeight();
  
  console.log('🚀 Initializing scroll system...');
  
  scrollSystem.$sections = $('section');
  recalculateSections();
  
  console.log('📍 Found sections at positions:', scrollSystem.arrSections);
  
  // Enable scroll system only if we have multiple sections
  scrollSystem.isEnabled = scrollSystem.arrSections.length > 1;
  scrollSystem.initialized = true;
  
  if (scrollSystem.isEnabled) {
    console.log('✅ Scroll system enabled');
    bindScrollEvents();
    setupViewportMonitoring();
  } else {
    console.log('❌ Scroll system disabled - not enough sections');
  }
}

function setupViewportMonitoring() {
  if (!scrollSystem.isMobile) return;
  
  let stabilizationTimer;
  let lastHeight = window.innerHeight;
  
  // Monitor viewport changes for mobile browser UI
  const viewportObserver = new ResizeObserver(entries => {
    const currentHeight = window.innerHeight;
    
    // Only react to significant height changes (browser UI)
    if (Math.abs(currentHeight - lastHeight) > 50) {
      console.log('📱 Browser UI changed:', lastHeight, '→', currentHeight);
      
      updateViewportHeight();
      
      // Mark as waiting for stabilization
      scrollSystem.isWaitingForStabilization = true;
      
      // Clear existing timer
      clearTimeout(stabilizationTimer);
      
      // Wait for UI to stabilize before recalculating
      stabilizationTimer = setTimeout(() => {
        recalculateSections();
        scrollSystem.isWaitingForStabilization = false;
        console.log('✅ Viewport stabilized, sections updated');
      }, 300);
      
      lastHeight = currentHeight;
    }
  });
  
  viewportObserver.observe(document.documentElement);
}

function bindScrollEvents() {
  // Remove any existing event listeners
  $(document).off('wheel.scrollSystem');
  $(document).off('touchstart.scrollSystem');
  $(document).off('touchend.scrollSystem');
  
  if (scrollSystem.isMobile) {
    console.log('📱 Binding mobile touch events');
    bindMobileEvents();
  } else {
    console.log('🖥️ Binding desktop wheel events');
    bindDesktopEvents();
  }
}

function bindDesktopEvents() {
  $(document).on('wheel.scrollSystem', function(event) {
    if (!scrollSystem.isEnabled || scrollSystem.inScroll) return;
    
    scrollSystem.inScroll = true;
    console.log('🎯 Wheel event - current section:', scrollSystem.currentSection);

    // move down
    if (event.originalEvent.deltaY > 0) {
      scrollSystem.currentSection = scrollSystem.currentSection >= scrollSystem.arrSections.length - 1
        ? scrollSystem.arrSections.length - 1
        : scrollSystem.currentSection + 1;
    } else {
      // move up
      scrollSystem.currentSection = scrollSystem.currentSection === 0 ? 0 : scrollSystem.currentSection - 1;
    }

    console.log('📍 Scrolling to section:', scrollSystem.currentSection, 'at position:', scrollSystem.arrSections[scrollSystem.currentSection]);

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

function bindMobileEvents() {
  let touchDirection = '';
  let touchDistance = 0;
  let isValidSwipe = false;
  let touchStartTime = 0;
  
  $(document).on('touchstart.scrollSystem', function(event) {
    if (!scrollSystem.isEnabled || scrollSystem.isWaitingForStabilization) return;
    
    // Don't interfere if user is doing a quick scroll gesture
    const currentScrollPos = window.pageYOffset;
    const tolerance = window.innerHeight * 0.2; // 20% tolerance
    
    // Find closest section
    let closestSectionIndex = 0;
    let minDistance = Infinity;
    
    scrollSystem.arrSections.forEach((sectionTop, index) => {
      const distance = Math.abs(sectionTop - currentScrollPos);
      if (distance < minDistance) {
        minDistance = distance;
        closestSectionIndex = index;
      }
    });
    
    // Only enable section scrolling if we're close to a section boundary
    if (minDistance > tolerance) {
      console.log('👆 User not near section boundary, allowing natural scroll');
      return;
    }
    
    scrollSystem.touchStartY = event.originalEvent.touches[0].clientY;
    touchStartTime = Date.now();
    isValidSwipe = true;
    scrollSystem.currentSection = closestSectionIndex;
    console.log('👆 Touch start at:', scrollSystem.touchStartY, 'Section:', scrollSystem.currentSection);
  });
  
  $(document).on('touchmove.scrollSystem', function(event) {
    if (!isValidSwipe || !scrollSystem.isEnabled) return;
    
    // If this is a long touch, cancel section scrolling
    if (Date.now() - touchStartTime > 500) {
      isValidSwipe = false;
      console.log('👆 Long touch detected, disabling section scroll');
    }
  });
  
  $(document).on('touchend.scrollSystem', function(event) {
    if (!scrollSystem.isEnabled || scrollSystem.inScroll || !isValidSwipe || scrollSystem.isWaitingForStabilization) return;
    
    scrollSystem.touchEndY = event.originalEvent.changedTouches[0].clientY;
    touchDistance = Math.abs(scrollSystem.touchEndY - scrollSystem.touchStartY);
    const touchDuration = Date.now() - touchStartTime;
    
    console.log('👆 Touch end - Distance:', touchDistance, 'Duration:', touchDuration);
    
    // Only trigger if swipe is long enough and quick enough
    if (touchDistance < scrollSystem.minSwipeDistance || touchDuration > 400) {
      console.log('❌ Swipe invalid (too short or too slow), ignoring');
      isValidSwipe = false;
      return;
    }
    
    // Determine direction
    if (scrollSystem.touchStartY > scrollSystem.touchEndY) {
      // Swipe up = scroll down
      touchDirection = 'down';
    } else {
      // Swipe down = scroll up
      touchDirection = 'up';
    }
    
    console.log('📱 Valid swipe detected:', touchDirection);
    
    // Prevent default scrolling for section navigation
    event.preventDefault();
    
    scrollSystem.inScroll = true;
    
    if (touchDirection === 'down') {
      scrollSystem.currentSection = scrollSystem.currentSection >= scrollSystem.arrSections.length - 1
        ? scrollSystem.arrSections.length - 1
        : scrollSystem.currentSection + 1;
    } else {
      scrollSystem.currentSection = scrollSystem.currentSection === 0 ? 0 : scrollSystem.currentSection - 1;
    }
    
    console.log('📍 Mobile scrolling to section:', scrollSystem.currentSection, 'at position:', scrollSystem.arrSections[scrollSystem.currentSection]);
    
    $('html, body').animate({
      scrollTop: scrollSystem.arrSections[scrollSystem.currentSection]
    }, {
      duration: scrollSystem.durationOneScroll * 0.8,
      complete: function() {
        scrollSystem.inScroll = false;
        isValidSwipe = false;
        console.log('✅ Mobile scroll complete');
      }
    });
  });
}

function resetScrollSystem() {
  console.log('🔄 Resetting scroll system...');
  scrollSystem.initialized = false;
  scrollSystem.currentSection = 0;
  scrollSystem.inScroll = false;
  scrollSystem.isWaitingForStabilization = false;
  if (typeof $ !== 'undefined') {
    $(document).off('wheel.scrollSystem');
    $(document).off('touchstart.scrollSystem');
    $(document).off('touchmove.scrollSystem');
    $(document).off('touchend.scrollSystem');
  }
}

function initializeAllFeatures() {
  console.log('📱 Initializing all features...');
  
  // Wait a bit for all content to load
  setTimeout(initializeScrollSystem, 500);
  
  // Button functionality
  var btn = $('#button');
  btn.on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop: 0}, 300);
    scrollSystem.currentSection = 0;
  });

  // Handle section switching
  $(".changeSection").click(function(){
    var parentSectionClass = $(this).closest("section").attr("class");
    if (parentSectionClass && parentSectionClass.includes('luxury-collection')) {
       $('.high-end-collection').show();
       $('.luxury-collection').hide();
    } else if(parentSectionClass && parentSectionClass.includes('high-end-collection')){
      $('.high-end-collection').hide();
       $('.luxury-collection').show();
    }
    
    // Re-calculate sections after showing/hiding
    setTimeout(function() {
      resetScrollSystem();
      initializeScrollSystem();
    }, 100);
  });

  // Handle smooth scroll links
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
   
   // Handle window resize (but not viewport changes - those are handled separately)
   $(window).on('resize.scrollSystem', function() {
     const wasMobile = scrollSystem.isMobile;
     detectMobile();
     
     // Only reinitialize if device type actually changed
     if (wasMobile !== scrollSystem.isMobile) {
       console.log('📱 Device type changed, reinitializing...');
       resetScrollSystem();
       setTimeout(initializeScrollSystem, 300);
     }
   });
}

// Make functions globally accessible for debugging
window.scrollSystem = scrollSystem;
window.resetScrollSystem = resetScrollSystem;
window.initializeScrollSystem = initializeScrollSystem;

// Wait for jQuery and then initialize
waitForJQuery(function() {
  // Initialize when DOM is ready
  $(document).ready(function() {
    console.log('📱 DOM Ready with jQuery - initializing features');
    initializeAllFeatures();
  });

  // Re-initialize on page navigation
  $(window).on('beforeunload', function() {
    resetScrollSystem();
  });

  $(window).on('load', function() {
    console.log('🌐 Window loaded - checking scroll system');
    updateViewportHeight();
    if (!scrollSystem.initialized) {
      setTimeout(initializeScrollSystem, 200);
    }
  });
});

// Debug: Log when script loads
console.log('📜 Custom.js script loaded - waiting for jQuery...');