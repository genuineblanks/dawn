// Section Scroll JS - Enhanced with Fixed Dot Navigation

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
  
  // Section labels for 7 sections
  const sectionLabels = [
    'Home',
    'Products', 
    'Luxury',
    'High-End',
    'Tech-Pack',
    'About',
    'Footer'
  ];
  
  console.log('🎯 Creating dots for', scrollSystem.arrSections.length, 'sections');
  
  // Filter out duplicate positions and create clean section array
  const cleanSections = [];
  const cleanLabels = [];
  const usedPositions = new Set();
  
  scrollSystem.arrSections.forEach((pos, index) => {
    if (!usedPositions.has(pos) || cleanSections.length === 0) {
      cleanSections.push(pos);
      cleanLabels.push(sectionLabels[index] || `Section ${cleanSections.length}`);
      usedPositions.add(pos);
    }
  });
  
  // Update the clean sections array
  scrollSystem.arrSections = cleanSections;
  
  console.log('🎯 Clean sections after removing duplicates:', scrollSystem.arrSections);
  
  // Create dots for each unique section
  scrollSystem.arrSections.forEach((sectionPos, index) => {
    const dot = document.createElement('div');
    dot.className = 'section-dot';
    dot.setAttribute('data-section', index);
    dot.setAttribute('data-label', cleanLabels[index]);
    
    console.log('🎯 Creating dot', index, 'for section at position', sectionPos);
    
    // Add click handler
    dot.addEventListener('click', function() {
      console.log('🎯 Dot clicked:', index);
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
  console.log('🎯 Updating dots - current section:', scrollSystem.currentSection, 'total dots:', dots.length);
  
  dots.forEach((dot, index) => {
    if (index === scrollSystem.currentSection) {
      dot.classList.add('active');
      console.log('🎯 Activated dot', index);
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
  
  // Update dots immediately
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

function calculateSectionPositions() {
  if (!scrollSystem.$sections || scrollSystem.$sections.length === 0) return;
  
  const oldPositions = [...scrollSystem.arrSections];
  scrollSystem.arrSections = scrollSystem.$sections.map(function() {
    return $(this).offset().top;
  }).get();
  
  console.log('📍 Raw section positions:', scrollSystem.arrSections);
  
  // Update current section based on current scroll position
  updateCurrentSectionFromScrollPosition();
  
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
  console.log('🔍 Found sections:', scrollSystem.$sections.length);
  
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

    // Update dots immediately
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
      createDotNavigation(); // Recreate dots with clean positions
      updateDotNavigation();
    }
    
    scrollSystem.resizeTimeout = null;
  }, 250);
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
    $(window).off('scroll.dotNavigation');
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
      createDotNavigation();
      updateDotNavigation();
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
     }, 500);
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
      setTimeout(function() {
        calculateSectionPositions();
        createDotNavigation();
        updateDotNavigation();
      }, 300);
    }
  });
});

// Debug: Log when script loads
console.log('📜 Custom.js script loaded - waiting for jQuery...');