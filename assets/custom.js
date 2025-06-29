// Section Scroll JS - Enhanced with Dot Navigation

let scrollSystem = {
  $sections: null,
  inScroll: false,
  durationOneScroll: 600,
  currentSection: 0,
  arrSections: [],
  isEnabled: true,
  initialized: false,
  resizeTimeout: null,
  dotNavigation: null
};

function waitForJQuery(callback) {
  if (typeof $ !== 'undefined' && $ && $.fn) {
    console.log('✅ jQuery is ready');
    callback();
  } else {
    console.log('⏳ Waiting for jQuery...');
    setTimeout(() => waitForJQuery(callback), 100);
  }
}

function createDotNavigation() {
  // Remove existing dot navigation if it exists
  if (scrollSystem.dotNavigation) {
    scrollSystem.dotNavigation.remove();
  }
  
  // Create navigation container
  scrollSystem.dotNavigation = document.createElement('div');
  scrollSystem.dotNavigation.className = 'section-dot-navigation';
  
  // Section labels (customize these based on your sections)
  const sectionLabels = [
    'Home',
    'Luxury Products', 
    'High-End Products',
    'Tech-Pack',
    'About Us'
  ];
  
  // Create dots for each section
  scrollSystem.arrSections.forEach((sectionPos, index) => {
    const dot = document.createElement('div');
    dot.className = 'section-dot';
    dot.setAttribute('data-section', index);
    dot.setAttribute('data-label', sectionLabels[index] || `Section ${index + 1}`);
    
    // Add click handler
    dot.addEventListener('click', function() {
      goToSection(index);
    });
    
    scrollSystem.dotNavigation.appendChild(dot);
  });
  
  // Add to page
  document.body.appendChild(scrollSystem.dotNavigation);
  
  console.log('🎯 Dot navigation created with', scrollSystem.arrSections.length, 'dots');
}

function updateDotNavigation() {
  if (!scrollSystem.dotNavigation) return;
  
  const dots = scrollSystem.dotNavigation.querySelectorAll('.section-dot');
  dots.forEach((dot, index) => {
    if (index === scrollSystem.currentSection) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

function goToSection(sectionIndex) {
  if (scrollSystem.inScroll || sectionIndex < 0 || sectionIndex >= scrollSystem.arrSections.length) return;
  
  console.log('🎯 Going to section:', sectionIndex);
  
  scrollSystem.inScroll = true;
  scrollSystem.currentSection = sectionIndex;
  
  $('html, body').animate({
    scrollTop: scrollSystem.arrSections[sectionIndex]
  }, {
    duration: scrollSystem.durationOneScroll,
    complete: function() {
      scrollSystem.inScroll = false;
      updateDotNavigation();
      console.log('✅ Navigation to section', sectionIndex, 'complete');
    }
  });
  
  updateDotNavigation();
}

function calculateSectionPositions() {
  if (!scrollSystem.$sections || scrollSystem.$sections.length === 0) return;
  
  const oldPositions = [...scrollSystem.arrSections];
  scrollSystem.arrSections = scrollSystem.$sections.map(function() {
    return $(this).offset().top;
  }).get();
  
  console.log('📍 Section positions updated:', scrollSystem.arrSections);
  
  // Update current section based on current scroll position
  updateCurrentSectionFromScrollPosition();
  
  // Recreate dot navigation with new positions
  if (scrollSystem.initialized) {
    createDotNavigation();
    updateDotNavigation();
  }
  
  return oldPositions;
}

function updateCurrentSectionFromScrollPosition() {
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

function initializeScrollSystem() {
  if (scrollSystem.initialized) return;
  
  console.log('🚀 Initializing scroll system...');
  
  scrollSystem.$sections = $('section');
  calculateSectionPositions();
  
  console.log('📍 Found sections at positions:', scrollSystem.arrSections);
  
  // Enable scroll system only if we have multiple sections
  scrollSystem.isEnabled = scrollSystem.arrSections.length > 1;
  scrollSystem.initialized = true;
  
  if (scrollSystem.isEnabled) {
    console.log('✅ Scroll system enabled');
    createDotNavigation();
    bindScrollEvents();
    updateDotNavigation();
  } else {
    console.log('❌ Scroll system disabled - not enough sections');
  }
}

function bindScrollEvents() {
  // Remove any existing wheel event listeners
  $(document).off('wheel.scrollSystem');
  
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
        updateDotNavigation();
        console.log('✅ Scroll complete');
      }
    });
    
    updateDotNavigation();
  });
}

function handleWindowResize() {
  console.log('📐 Window resized - recalculating sections...');
  
  // Clear existing timeout
  if (scrollSystem.resizeTimeout) {
    clearTimeout(scrollSystem.resizeTimeout);
  }
  
  // Wait for resize to complete before recalculating
  scrollSystem.resizeTimeout = setTimeout(function() {
    if (scrollSystem.initialized) {
      const oldPositions = calculateSectionPositions();
      
      // Check if positions changed significantly
      const hasSignificantChange = scrollSystem.arrSections.some((newPos, index) => {
        const oldPos = oldPositions[index];
        return oldPos && Math.abs(newPos - oldPos) > 50; // 50px threshold
      });
      
      if (hasSignificantChange) {
        console.log('📐 Significant position changes detected - scroll system updated');
      }
    }
    
    scrollSystem.resizeTimeout = null;
  }, 250); // Wait 250ms after resize stops
}

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
  }
}

function initializeAllFeatures() {
  console.log('📱 Initializing all features...');
  
  // Wait a bit for all content to load
  setTimeout(initializeScrollSystem, 500);
  
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
      calculateSectionPositions();
    }, 150);
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
   $(window).on('resize.scrollSystem', handleWindowResize);
   
   // Also recalculate on orientation change (for tablets)
   $(window).on('orientationchange.scrollSystem', function() {
     setTimeout(function() {
       handleWindowResize();
     }, 500); // Wait longer for orientation change
   });
   
   // Monitor scroll position for dot navigation updates
   $(window).on('scroll.dotNavigation', function() {
     if (scrollSystem.initialized && !scrollSystem.inScroll) {
       updateCurrentSectionFromScrollPosition();
     }
   });
}

// Make functions globally accessible for debugging
window.scrollSystem = scrollSystem;
window.resetScrollSystem = resetScrollSystem;
window.initializeScrollSystem = initializeScrollSystem;
window.calculateSectionPositions = calculateSectionPositions;
window.goToSection = goToSection;

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
    } else {
      // Recalculate once everything is fully loaded
      setTimeout(calculateSectionPositions, 300);
    }
  });
});

// Debug: Log when script loads
console.log('📜 Custom.js script loaded - waiting for jQuery...');