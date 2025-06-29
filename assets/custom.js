// Section Scroll JS - Enhanced with Mobile Support

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
  minSwipeDistance: 50
};

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

function initializeScrollSystem() {
  if (scrollSystem.initialized) return;
  
  detectMobile();
  console.log('🚀 Initializing scroll system...');
  
  scrollSystem.$sections = $('section');
  scrollSystem.arrSections = scrollSystem.$sections.map(function() {
    return $(this).offset().top;
  }).get();
  
  console.log('📍 Found sections at positions:', scrollSystem.arrSections);
  
  // Enable scroll system only if we have multiple sections
  scrollSystem.isEnabled = scrollSystem.arrSections.length > 1;
  scrollSystem.initialized = true;
  
  if (scrollSystem.isEnabled) {
    console.log('✅ Scroll system enabled');
    bindScrollEvents();
  } else {
    console.log('❌ Scroll system disabled - not enough sections');
  }
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
  
  $(document).on('touchstart.scrollSystem', function(event) {
    if (!scrollSystem.isEnabled) return;
    
    scrollSystem.touchStartY = event.originalEvent.touches[0].clientY;
    console.log('👆 Touch start at:', scrollSystem.touchStartY);
  });
  
  $(document).on('touchend.scrollSystem', function(event) {
    if (!scrollSystem.isEnabled || scrollSystem.inScroll) return;
    
    scrollSystem.touchEndY = event.originalEvent.changedTouches[0].clientY;
    touchDistance = Math.abs(scrollSystem.touchEndY - scrollSystem.touchStartY);
    
    console.log('👆 Touch end at:', scrollSystem.touchEndY, 'Distance:', touchDistance);
    
    // Only trigger if swipe is long enough
    if (touchDistance < scrollSystem.minSwipeDistance) {
      console.log('❌ Swipe too short, ignoring');
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
    
    console.log('📱 Mobile swipe detected:', touchDirection);
    
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
      duration: scrollSystem.durationOneScroll * 0.8, // Slightly faster for mobile
      complete: function() {
        scrollSystem.inScroll = false;
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
  if (typeof $ !== 'undefined') {
    $(document).off('wheel.scrollSystem');
    $(document).off('touchstart.scrollSystem');
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
   
   // Handle window resize
   $(window).on('resize.scrollSystem', function() {
     const wasMobile = scrollSystem.isMobile;
     detectMobile();
     
     // If device type changed, reinitialize
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
    if (!scrollSystem.initialized) {
      setTimeout(initializeScrollSystem, 200);
    }
  });
});

// Debug: Log when script loads
console.log('📜 Custom.js script loaded - waiting for jQuery...');