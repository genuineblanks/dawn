// ULTIMATE SCROLL FIX OVERRIDE - HOMEPAGE ONLY
// This script runs AFTER custom.js to override any existing scroll functionality
(function() {
  'use strict';
  
  console.log('🔧 SCROLL FIX OVERRIDE LOADING...');
  
  // Wait for custom.js to load first
  setTimeout(function() {
    
    // Multiple ways to check if we're on homepage
    function isActualHomepage() {
      // Get current URL path
      const path = window.location.pathname;
      
      // Check if we're on root path
      const isRootPath = path === '/' || path === '/index.html' || path === '/home' || path === '' || path === '/index';
      
      // Check for home template
      const hasHomeTemplate = document.body.classList.contains('home-section');
      
      // Check URL doesn't contain other page indicators
      const isNotOtherPage = !path.includes('/pages/') && 
                            !path.includes('/collections/') && 
                            !path.includes('/products/') && 
                            !path.includes('/blogs/') && 
                            !path.includes('/search') && 
                            !path.includes('techpack') &&
                            !path.includes('wholesale');
      
      // Check document title doesn't indicate other pages
      const titleCheck = !document.title.toLowerCase().includes('techpack') && 
                        !document.title.toLowerCase().includes('wholesale') &&
                        !document.title.toLowerCase().includes('collection') &&
                        !document.title.toLowerCase().includes('product');
      
      // Check for specific non-homepage elements
      const hasNoTechpackElements = !document.querySelector('.techpack-container, .techpack-app, [data-techpack]');
      const hasNoWholesaleElements = !document.querySelector('.wholesale-form, .wholesale-modal, [data-wholesale]');
      
      // Check if we have exactly 7 sections (your original condition)
      const sectionCount = document.querySelectorAll('section, .shopify-section').length;
      const hasSectionCount = sectionCount === 7;
      
      console.log('🔍 Homepage validation:', {
        path: path,
        isRootPath: isRootPath,
        hasHomeTemplate: hasHomeTemplate,
        isNotOtherPage: isNotOtherPage,
        titleCheck: titleCheck,
        hasNoTechpackElements: hasNoTechpackElements,
        hasNoWholesaleElements: hasNoWholesaleElements,
        sectionCount: sectionCount,
        hasSectionCount: hasSectionCount
      });
      
      // Must pass ALL checks to be considered homepage
      return isRootPath && 
             hasHomeTemplate && 
             isNotOtherPage && 
             titleCheck && 
             hasNoTechpackElements && 
             hasNoWholesaleElements && 
             hasSectionCount;
    }
    
    // DESTROY any existing scroll handlers
    function destroyAllScrollHandlers() {
      console.log('🧹 Destroying all existing scroll handlers...');
      
      // Remove all scroll event listeners by cloning window object
      const oldWindow = window;
      const newWindow = oldWindow.cloneNode ? oldWindow.cloneNode() : oldWindow;
      
      // Clear any intervals that might be running scroll fixes
      for (let i = 1; i < 99999; i++) {
        clearInterval(i);
      }
      
      // Reset scroll-related variables that might exist
      if (window.scrollFixed) window.scrollFixed = false;
      if (window.scrollHandler) window.scrollHandler = null;
      
      console.log('✅ All scroll handlers destroyed');
    }
    
    // Check if we should run scroll fix
    if (!isActualHomepage()) {
      console.log('❌ NOT ON HOMEPAGE - Destroying scroll fix and exiting');
      destroyAllScrollHandlers();
      return;
    }
    
    console.log('✅ CONFIRMED HOMEPAGE - Proceeding with scroll fix');
    
    // Destroy existing handlers first
    destroyAllScrollHandlers();
    
    var scrollFixed = false;
    var scrollHandler = null;
    
    function destroyExistingFix() {
      if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
        scrollHandler = null;
      }
      scrollFixed = false;
    }
    
    function applyUltimateScrollFix() {
      // Double-check we're still on homepage
      if (!isActualHomepage()) {
        console.log('❌ No longer on homepage during scroll fix application');
        destroyExistingFix();
        return;
      }
      
      destroyExistingFix();
      
      if (scrollFixed) return;
      scrollFixed = true;
      
      console.log('🔧 APPLYING ULTIMATE SCROLL FIX FOR HOMEPAGE...');
      
      // Reset all elements
      var allTriggers = document.querySelectorAll('.scroll-trigger');
      console.log('🎯 Found', allTriggers.length, 'scroll trigger elements');
      
      allTriggers.forEach(function(el) {
        var rect = el.getBoundingClientRect();
        
        // Only show elements in top 25% of viewport
        if (rect.top < window.innerHeight * 0.25) {
          el.classList.remove('scroll-trigger--offscreen');
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        } else {
          el.classList.add('scroll-trigger--offscreen');
          el.style.opacity = '0';
          el.style.transform = 'translateY(30px)';
        }
        
        // Add transition
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      });
      
      // Create scroll handler with homepage check
      scrollHandler = function() {
        // Continuously verify we're on homepage
        if (!isActualHomepage()) {
          console.log('❌ Left homepage during scroll, destroying handler');
          destroyExistingFix();
          return;
        }
        
        var offscreenElements = document.querySelectorAll('.scroll-trigger--offscreen');
        offscreenElements.forEach(function(el) {
          var rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight - 50) {
            el.classList.remove('scroll-trigger--offscreen');
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            console.log('🚀 REVEALED:', el.className.split(' ')[0]);
          }
        });
      };
      
      window.addEventListener('scroll', scrollHandler, { passive: true });
      
      // Store reference globally so it can be destroyed
      window.homepageScrollHandler = scrollHandler;
      window.scrollFixed = scrollFixed;
      
      console.log('✅ HOMEPAGE SCROLL FIX APPLIED SUCCESSFULLY');
    }
    
    // Apply on every possible event
    function initScrollFix() {
      if (!isActualHomepage()) {
        console.log('❌ Homepage check failed during init');
        return;
      }
      
      setTimeout(applyUltimateScrollFix, 100);
      setTimeout(applyUltimateScrollFix, 500);
      setTimeout(applyUltimateScrollFix, 1000);
    }
    
    // Multiple initialization points
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initScrollFix);
    } else {
      initScrollFix();
    }
    
    window.addEventListener('load', initScrollFix);
    window.addEventListener('pageshow', initScrollFix);
    
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden && isActualHomepage()) {
        initScrollFix();
      } else if (!isActualHomepage() && scrollFixed) {
        destroyExistingFix();
      }
    });
    
    // Override interval with stricter homepage check
    const intervalId = setInterval(function() {
      if (isActualHomepage() && !scrollFixed) {
        console.log('🔄 Interval check - reapplying scroll fix on homepage');
        initScrollFix();
      } else if (!isActualHomepage() && scrollFixed) {
        console.log('🔄 Interval check - destroying scroll fix (not on homepage)');
        destroyExistingFix();
        clearInterval(intervalId); // Stop checking once we leave homepage
      }
    }, 2000);
    
    // Listen for navigation events
    window.addEventListener('popstate', function() {
      setTimeout(function() {
        if (!isActualHomepage() && scrollFixed) {
          console.log('🔄 Navigation detected - destroying scroll fix');
          destroyExistingFix();
        }
      }, 100);
    });
    
    // Override any existing scroll system variables
    if (window.scrollSystem) {
      console.log('🔄 Overriding existing scroll system');
      window.scrollSystem = null;
    }
    
    console.log('🚀 HOMEPAGE SCROLL FIX OVERRIDE COMPLETE');
    
  }, 1000); // Wait 1 second for custom.js to fully load
  
})();