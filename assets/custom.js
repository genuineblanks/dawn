// ===============================================
// ENHANCED SCROLL SYSTEM - CLEAN REWRITE
// Desktop: Exact same functionality preserved
// Mobile: Natural scrolling + clean dot navigation
// ===============================================

(function() {
  'use strict';
  
  console.log('🚀 Clean Scroll System Loading...');

  // ===============================================
  // DEVICE DETECTION
  // ===============================================
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
           window.innerWidth <= 768;
  }

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  function isHomepage() {
    const bodyHasHomeClass = document.body.classList.contains('home-section');
    const templateIsIndex = document.body.classList.contains('template-index') || 
                            window.location.pathname === '/' || 
                            window.location.pathname === '/index';
    const isRootPath = window.location.pathname === '/' || 
                       window.location.pathname === '/index.html' ||
                       window.location.pathname.endsWith('/index');
    
    return bodyHasHomeClass || templateIsIndex || isRootPath;
  }

  // Device detection constants
  const IS_MOBILE = isMobileDevice();
  const IS_HOMEPAGE = isHomepage();

  console.log('📱 Device:', IS_MOBILE ? 'MOBILE' : 'DESKTOP', 'Homepage:', IS_HOMEPAGE);

  // Export for global access
  window.isMobileDevice = isMobileDevice;
  window.isIOS = isIOS;
  window.isHomepage = isHomepage;

  // ===============================================
  // SCROLL SYSTEM CORE
  // ===============================================
  let scrollSystem = {
    $sections: null,
    inScroll: false,
    durationOneScroll: 800,
    currentSection: 0,
    arrSections: [],
    isEnabled: false,
    initialized: false,
    resizeTimeout: null,
    dotNavigation: null,
    easingFunction: 'easeInOutCubic'
  };

  // ===============================================
  // DESKTOP TOUCH SUPPORT (PRESERVED EXACTLY)
  // ===============================================
  let touchStartY = 0;
  let touchEndY = 0;
  let touchStartTime = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let initialTouchY = 0;
  let hasMoved = false;
  let touchTarget = null;

  function handleTouchStart(event) {
    if (IS_MOBILE || !isHomepage() || !scrollSystem.isEnabled) return;

    const touch = event.touches[0];
    touchStartY = touch.clientY;
    touchStartX = touch.clientX;
    touchStartTime = Date.now();
    initialTouchY = touch.clientY;
    hasMoved = false;
    touchTarget = event.target;

    console.log('🖥️ Desktop touch start:', touchStartY);
  }

  function handleTouchMove(event) {
    if (IS_MOBILE || !isHomepage() || !scrollSystem.isEnabled) return;

    const touch = event.touches[0];
    touchEndY = touch.clientY;
    touchEndX = touch.clientX;

    const verticalMovement = Math.abs(touchEndY - initialTouchY);
    const horizontalMovement = Math.abs(touchEndX - touchStartX);

    if (verticalMovement > 10 || horizontalMovement > 10) {
      hasMoved = true;
    }
  }

  function handleTouchEnd(event) {
    if (IS_MOBILE || !isHomepage() || !scrollSystem.isEnabled || scrollSystem.inScroll) return;

    if (!hasMoved || !touchTarget) {
      touchTarget = null;
      return;
    }

    const timeDiff = Date.now() - touchStartTime;
    const verticalDistance = touchStartY - touchEndY;
    const horizontalDistance = Math.abs(touchStartX - touchEndX);

    if (timeDiff > 500 || horizontalDistance > 50) {
      touchTarget = null;
      return;
    }

    const swipeThreshold = 50;
    let targetSection = scrollSystem.currentSection;

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

    hasMoved = false;
    touchTarget = null;
  }

  // ===============================================
  // SECTION POSITION CALCULATION
  // ===============================================
  function calculateSectionPositions() {
    if (!isHomepage()) return [];

    scrollSystem.$sections = $('section');
    console.log('📊 Found sections:', scrollSystem.$sections.length);

    if (scrollSystem.$sections.length === 0) {
      console.log('❌ No sections found');
      return [];
    }

    const oldPositions = [...scrollSystem.arrSections];
    
    scrollSystem.arrSections = scrollSystem.$sections.map(function(index) {
      const section = $(this);
      let sectionTop = section.offset().top;
      
      console.log(`✅ Section ${index} position:`, sectionTop);
      return sectionTop;
    }).get();
    
    console.log('📍 Section positions:', scrollSystem.arrSections);
    updateCurrentSectionFromScrollPosition();
    
    return oldPositions;
  }

  // ===============================================
  // SECTION DETECTION
  // ===============================================
  function updateCurrentSectionFromScrollPosition() {
    if (!isHomepage() || scrollSystem.inScroll) return;
    
    const currentScrollPos = window.pageYOffset;
    let closestSection = 0;
    
    if (!scrollSystem.arrSections || scrollSystem.arrSections.length === 0) {
      return;
    }

    // Handle page top
    if (currentScrollPos < 100) {
      closestSection = 0;
    } else {
      const viewportHeight = window.innerHeight;
      
      if (IS_MOBILE) {
        // Mobile: Use scroll position + offset to determine which section we're closest to
        const scrollReference = currentScrollPos + (viewportHeight * 0.3); // 30% from top feels more natural
        
        let bestDistance = Infinity;
        let bestSection = 0;
        
        for (let i = 0; i < scrollSystem.arrSections.length; i++) {
          const sectionStart = scrollSystem.arrSections[i];
          const distance = Math.abs(scrollReference - sectionStart);
          
          if (distance < bestDistance) {
            bestDistance = distance;
            bestSection = i;
          }
        }
        
        closestSection = bestSection;
        console.log('📱 Mobile section detection:', {
          currentScrollPos,
          scrollReference,
          detectedSection: closestSection,
          distance: bestDistance,
          sectionTop: scrollSystem.arrSections[closestSection],
          allSections: scrollSystem.arrSections
        });
      } else {
        // Desktop: Center point detection
        const viewportCenter = currentScrollPos + (viewportHeight / 2);
        let bestDistance = Infinity;
        
        for (let i = 0; i < scrollSystem.arrSections.length; i++) {
          const sectionStart = scrollSystem.arrSections[i];
          const distance = Math.abs(viewportCenter - sectionStart);
          
          if (distance < bestDistance) {
            bestDistance = distance;
            closestSection = i;
          }
        }
        
        console.log('🖥️ Desktop section detection:', {
          currentScrollPos,
          viewportCenter,
          detectedSection: closestSection
        });
      }
    }
    
    const oldSection = scrollSystem.currentSection;
    scrollSystem.currentSection = closestSection;
    
    if (oldSection !== closestSection) {
      console.log('📍 Section updated:', oldSection, '->', closestSection);
      updateDotNavigation();
    }
  }

  // ===============================================
  // DOT NAVIGATION
  // ===============================================
  function createDotNavigation() {
    if (!isHomepage() || scrollSystem.arrSections.length < 2) return;
    
    let dotContainer = document.getElementById('section-dots');
    
    if (dotContainer) {
      dotContainer.innerHTML = '';
    } else {
      dotContainer = document.createElement('div');
      dotContainer.id = 'section-dots';
      dotContainer.className = 'section-dots';
      document.body.appendChild(dotContainer);
    }

    // Enhanced styles for better mobile touch
    dotContainer.style.cssText = `
      position: fixed;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 15px;
      pointer-events: auto;
    `;

    for (let i = 0; i < scrollSystem.arrSections.length; i++) {
      const dot = document.createElement('div');
      dot.className = 'section-dot';
      dot.setAttribute('data-section', i);
      
      // Enhanced styling with better mobile touch targets
      dot.style.cssText = `
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        border: 2px solid rgba(255, 255, 255, 0.8);
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
      `;

      // Mobile touch area enhancement
      if (IS_MOBILE) {
        const touchArea = document.createElement('div');
        touchArea.style.cssText = `
          position: absolute;
          top: -15px;
          left: -15px;
          right: -15px;
          bottom: -15px;
          z-index: 1;
        `;
        dot.appendChild(touchArea);
      }

      // Click handler
      const clickHandler = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🎯 Dot clicked:', i);
        goToSection(i);
      };
      
      dot.addEventListener('click', clickHandler);
      if (IS_MOBILE) {
        dot.addEventListener('touchend', clickHandler);
      }

      // Hover effects (desktop only)
      if (!IS_MOBILE) {
        dot.addEventListener('mouseenter', function() {
          if (i !== scrollSystem.currentSection) {
            dot.style.background = 'rgba(255, 255, 255, 0.8)';
            dot.style.transform = 'scale(1.2)';
          }
        });
        
        dot.addEventListener('mouseleave', function() {
          if (i !== scrollSystem.currentSection) {
            dot.style.background = 'rgba(255, 255, 255, 0.6)';
            dot.style.transform = 'scale(1)';
          }
        });
      }

      dotContainer.appendChild(dot);
    }

    scrollSystem.dotNavigation = dotContainer;
    console.log('🎯 Created', scrollSystem.arrSections.length, 'navigation dots');
    updateDotNavigation();
  }

  function updateDotNavigation() {
    if (!scrollSystem.dotNavigation) return;
    
    const dots = scrollSystem.dotNavigation.children;
    console.log('🎯 Updating dots - current section:', scrollSystem.currentSection);
    
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      
      if (i === scrollSystem.currentSection) {
        // Active dot
        dot.style.background = 'rgba(255, 255, 255, 1)';
        dot.style.border = '2px solid rgba(255, 255, 255, 1)';
        dot.style.transform = 'scale(1.3)';
        dot.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.6)';
        dot.style.width = '14px';
        dot.style.height = '14px';
        dot.classList.add('active');
      } else {
        // Inactive dot
        dot.style.background = 'rgba(255, 255, 255, 0.6)';
        dot.style.border = '2px solid rgba(255, 255, 255, 0.6)';
        dot.style.transform = 'scale(1)';
        dot.style.boxShadow = '0 0 0 0 rgba(255, 255, 255, 0)';
        dot.style.width = '12px';
        dot.style.height = '12px';
        dot.classList.remove('active');
      }
    }
  }

  // ===============================================
  // NAVIGATION FUNCTION
  // ===============================================
  function goToSection(sectionIndex) {
    console.log('🚀 goToSection called:', sectionIndex);
    
    if (scrollSystem.inScroll || sectionIndex < 0 || sectionIndex >= scrollSystem.arrSections.length || !isHomepage()) {
      console.log('🚫 goToSection blocked');
      return;
    }
    
    console.log('✅ goToSection proceeding');
    console.log('🔴 Setting inScroll = true');
    scrollSystem.inScroll = true;
    
    const oldSection = scrollSystem.currentSection;
    scrollSystem.currentSection = sectionIndex;
    
    console.log('🎯 Navigating:', oldSection, '->', sectionIndex);
    updateDotNavigation();
    
    // Use jQuery animation for smooth scrolling
    $('html, body').stop(true, false).animate({
      scrollTop: scrollSystem.arrSections[sectionIndex]
    }, {
      duration: scrollSystem.durationOneScroll,
      easing: 'swing',
      complete: function() {
        console.log('🟢 Animation complete, setting inScroll = false');
        scrollSystem.inScroll = false;
        
        // Update section detection after a brief delay
        setTimeout(() => {
          updateCurrentSectionFromScrollPosition();
        }, 100);
      }
    });
  }

  // ===============================================
  // DESKTOP WHEEL EVENTS (PRESERVED EXACTLY)
  // ===============================================
  function bindDesktopEvents() {
    if (!isHomepage() || IS_MOBILE) return;
    
    $(document).off('wheel.scrollSystem');
    
    $(document).on('wheel.scrollSystem', function(event) {
      if (!scrollSystem.isEnabled || scrollSystem.inScroll) return;
      
      event.preventDefault();
      
      console.log('🔵 Desktop wheel event');
      scrollSystem.inScroll = true;
      
      if (event.originalEvent.deltaY > 0) {
        scrollSystem.currentSection = Math.min(scrollSystem.currentSection + 1, scrollSystem.arrSections.length - 1);
      } else {
        scrollSystem.currentSection = Math.max(scrollSystem.currentSection - 1, 0);
      }
      
      console.log('📍 Wheel scrolling to section:', scrollSystem.currentSection);
      updateDotNavigation();
      
      $('html, body').animate({
        scrollTop: scrollSystem.arrSections[scrollSystem.currentSection]
      }, {
        duration: scrollSystem.durationOneScroll,
        complete: function() {
          scrollSystem.inScroll = false;
          console.log('✅ Wheel scroll complete');
        }
      });
    });
    
    console.log('🖥️ Desktop wheel events bound');
  }

  // ===============================================
  // MOBILE SCROLL EVENTS
  // ===============================================
  function bindMobileEvents() {
    if (!isHomepage() || !IS_MOBILE) return;
    
    // Simple scroll event for dot updates on mobile
    let scrollTimeout;
    
    $(window).on('scroll.mobileDotsNavigation', function() {
      if (scrollSystem.inScroll) return;
      
      // Debounce scroll events
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        updateCurrentSectionFromScrollPosition();
      }, 50);
    });
    
    console.log('📱 Mobile scroll events bound');
  }

  // ===============================================
  // SCROLL TO TOP BUTTON
  // ===============================================
  function initializeScrollToTopButton() {
    console.log('🔝 Initializing scroll to top button...');
    
    const scrollButton = document.querySelector('.scroll-to-top');
    if (!scrollButton) return;
    
    function toggleScrollButton() {
      const scrolled = window.pageYOffset > 300;
      scrollButton.style.display = scrolled ? 'block' : 'none';
    }
    
    function scrollToTop(e) {
      e.preventDefault();
      
      if (isHomepage() && scrollSystem.initialized && scrollSystem.arrSections.length > 0) {
        console.log('🏠 Homepage - using scroll system');
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
  // RESIZE HANDLING
  // ===============================================
  function handleWindowResize() {
    if (!isHomepage()) return;
    
    console.log('📐 Window resized');
    
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
  // INITIALIZATION
  // ===============================================
  function initializeScrollSystem() {
    if (scrollSystem.initialized || !isHomepage()) return;
    
    console.log('🚀 Initializing scroll system...');
    
    calculateSectionPositions();
    
    const minSections = IS_MOBILE ? 2 : 4;
    scrollSystem.isEnabled = scrollSystem.arrSections.length >= minSections;
    scrollSystem.initialized = true;
    
    console.log('📊 Analysis:', {
      sections: scrollSystem.arrSections.length,
      minRequired: minSections,
      enabled: scrollSystem.isEnabled,
      device: IS_MOBILE ? 'Mobile' : 'Desktop'
    });
    
    if (scrollSystem.isEnabled) {
      console.log('✅ Scroll system enabled');
      createDotNavigation();
      updateDotNavigation();
      
      if (IS_MOBILE) {
        bindMobileEvents();
        console.log('📱 Mobile: Natural scrolling + dot navigation');
      } else {
        bindDesktopEvents();
        console.log('🖥️ Desktop: Full scroll system enabled');
      }
    } else {
      console.log('❌ Scroll system disabled - not enough sections');
    }
  }

  function resetScrollSystem() {
    console.log('🔄 Resetting scroll system...');
    scrollSystem.initialized = false;
    scrollSystem.currentSection = 0;
    scrollSystem.inScroll = false;
    
    if (scrollSystem.dotNavigation) {
      scrollSystem.dotNavigation.remove();
      scrollSystem.dotNavigation = null;
    }
    
    $(document).off('.scrollSystem');
    $(window).off('.mobileDotsNavigation');
  }

  // ===============================================
  // JQUERY WAIT FUNCTION
  // ===============================================
  function waitForJQuery(callback) {
    if (typeof $ !== 'undefined' && $) {
      callback();
    } else {
      console.log('⏳ Waiting for jQuery...');
      setTimeout(() => waitForJQuery(callback), 50);
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
  window.updateCurrentSectionFromScrollPosition = updateCurrentSectionFromScrollPosition;
  window.updateDotNavigation = updateDotNavigation;

  // ===============================================
  // MOBILE LAYOUT FIXES
  // ===============================================
  function applyMobileLayoutFixes() {
    if (!IS_MOBILE) return;
    
    console.log('📱 Applying mobile layout fixes...');
    
    // Add critical mobile CSS that might have been lost
    const mobileStyle = document.createElement('style');
    mobileStyle.id = 'mobile-layout-fixes';
    mobileStyle.textContent = `
      /* Mobile Layout Restoration */
      @media screen and (max-width: 768px) {
        html, body {
          scroll-behavior: auto !important;
          -webkit-overflow-scrolling: touch;
          overflow-x: hidden;
        }
        
        body {
          touch-action: pan-y !important;
          overscroll-behavior: none !important;
          position: relative !important;
        }
        
        section {
          min-height: 100vh;
          position: relative !important;
          overflow: visible !important;
        }
        
        /* Ensure mobile sections fill viewport properly */
        .banner, 
        .image-banner,
        .hero-section,
        .autoplay-video,
        .image-luxury-products,
        .image-high-end-products {
          min-height: var(--real-viewport-height, 100vh);
          height: var(--real-viewport-height, 100vh);
        }
        
        /* Fix mobile media scaling */
        .banner__media,
        .image-banner .banner__media {
          height: var(--real-viewport-height, 100vh);
          object-fit: cover;
        }
        
        /* Ensure content is properly contained */
        .banner__content,
        .image-banner .banner__content {
          position: absolute;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
      }
    `;
    
    document.head.appendChild(mobileStyle);
    console.log('✅ Mobile layout fixes applied');
  }

  // ===============================================
  // INITIALIZATION SEQUENCE
  // ===============================================
  waitForJQuery(function() {
    console.log('📱 jQuery ready - initializing system');
    
    // Apply mobile layout fixes first
    applyMobileLayoutFixes();
    
    if (isHomepage()) {
      setTimeout(initializeScrollSystem, 50);
      setTimeout(initializeScrollToTopButton, 100);
    }
    
    // Desktop touch events
    if (!IS_MOBILE && isHomepage()) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    // Window events
    $(window).on('resize', handleWindowResize);
    
    $(window).on('beforeunload', resetScrollSystem);
    
    $(window).on('load', function() {
      console.log('🌐 Window loaded');
      if (!scrollSystem.initialized && isHomepage()) {
        setTimeout(initializeScrollSystem, 100);
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
    
    // Section switcher support
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

    // Click to scroll support
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
  });

})();

console.log('✅ Clean Scroll System Loaded Successfully');