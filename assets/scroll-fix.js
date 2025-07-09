// ULTIMATE SCROLL FIX - HOMEPAGE ONLY
(function() {
  'use strict';
  
  console.log('💪 ULTIMATE SCROLL FIX LOADING...');
  
  // Multiple ways to check if we're on homepage
  function isHomepage() {
    // Check URL path
    var path = window.location.pathname;
    var isRootPath = path === '/' || path === '/index.html' || path === '/home' || path === '';
    
    // Check for home-section class
    var hasHomeClass = document.body.classList.contains('home-section');
    
    // Check if we have exactly 7 sections (your original logic)
    var sectionCount = document.querySelectorAll('section').length;
    var hasSectionCount = sectionCount === 7;
    
    // Check for specific homepage elements that shouldn't exist on other pages
    var hasHomeElements = document.querySelector('.home-hero') || 
                         document.querySelector('.homepage-banner') || 
                         document.querySelector('#home-content');
    
    // Check if we're NOT on techpack page specifically
    var isNotTechpack = !path.includes('techpack') && 
                       !document.body.classList.contains('techpack-page') &&
                       !document.querySelector('.techpack-container');
    
    console.log('🔍 Homepage check:', {
      path: path,
      isRootPath: isRootPath,
      hasHomeClass: hasHomeClass,
      sectionCount: sectionCount,
      hasSectionCount: hasSectionCount,
      hasHomeElements: !!hasHomeElements,
      isNotTechpack: isNotTechpack
    });
    
    // Must be root path AND have home class AND have 7 sections AND not be techpack
    return isRootPath && hasHomeClass && hasSectionCount && isNotTechpack;
  }
  
  if (!isHomepage()) {
    console.log('❌ Not homepage, skipping scroll fix');
    return;
  }
  
  console.log('✅ Confirmed homepage - proceeding with scroll fix');
  
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
    // Double-check we're still on homepage before applying
    if (!isHomepage()) {
      console.log('❌ No longer on homepage, aborting scroll fix');
      destroyExistingFix();
      return;
    }
    
    destroyExistingFix();
    
    if (scrollFixed) return;
    scrollFixed = true;
    
    console.log('🔧 APPLYING ULTIMATE SCROLL FIX...');
    
    // Reset all elements
    var allTriggers = document.querySelectorAll('.scroll-trigger');
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
    
    // Create scroll handler
    scrollHandler = function() {
      // Check if we're still on homepage during scroll
      if (!isHomepage()) {
        console.log('❌ Left homepage during scroll, removing handler');
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
    console.log('✅ ULTIMATE SCROLL FIX APPLIED');
  }
  
  // Apply on every possible event
  function initScrollFix() {
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
    if (!document.hidden) {
      initScrollFix();
    }
  });
  
  // Override on interval to catch any navigation - but with stricter homepage check
  setInterval(function() {
    if (isHomepage() && !scrollFixed) {
      console.log('🔄 Interval check - reapplying scroll fix');
      initScrollFix();
    } else if (!isHomepage() && scrollFixed) {
      console.log('🔄 Interval check - not on homepage, destroying scroll fix');
      destroyExistingFix();
    }
  }, 2000);
  
  // Listen for navigation events that might indicate page changes
  window.addEventListener('popstate', function() {
    setTimeout(function() {
      if (!isHomepage() && scrollFixed) {
        console.log('🔄 Navigation detected - destroying scroll fix');
        destroyExistingFix();
      }
    }, 100);
  });
  
})();