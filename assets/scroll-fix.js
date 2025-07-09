// ULTIMATE SCROLL FIX - OVERWRITES EVERYTHING
(function() {
  'use strict';
  
  console.log('💪 ULTIMATE SCROLL FIX LOADING...');
  
  var isHomepage = document.body.classList.contains('home-section');
  if (!isHomepage) {
    console.log('❌ Not homepage, skipping scroll fix');
    return;
  }
  
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
  
  // Override on interval to catch any navigation
  setInterval(function() {
    if (document.body.classList.contains('home-section') && !scrollFixed) {
      console.log('🔄 Interval check - reapplying scroll fix');
      initScrollFix();
    }
  }, 2000);
  
})();