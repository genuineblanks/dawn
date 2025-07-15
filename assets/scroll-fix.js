// SCROLL ANIMATION FIX - WORKS WITH CUSTOM.JS
(function() {
  'use strict';
  
  console.log('💪 SCROLL ANIMATION FIX LOADING...');
  
  var isHomepage = document.body.classList.contains('home-section');
  if (!isHomepage) {
    console.log('❌ Not homepage, skipping scroll fix');
    return;
  }
  
  // IMPORTANT: Check if custom.js scroll system is already running
  if (window.scrollSystem && window.scrollSystem.initialized) {
    console.log('ℹ️ Custom scroll system detected - limiting to animation fixes only');
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
  
  function applyScrollAnimationFix() {
    destroyExistingFix();
    
    if (scrollFixed) return;
    scrollFixed = true;
    
    console.log('🔧 APPLYING SCROLL ANIMATION FIX...');
    
    // IMPORTANT: Don't interfere if custom scroll system is active
    if (window.scrollSystem && window.scrollSystem.isEnabled) {
      console.log('⚠️ Custom scroll system active - only fixing animations');
    }
    
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
    
    // FIXED: Create scroll handler only for animations
    scrollHandler = function() {
      // Don't interfere with custom scroll system navigation
      if (window.scrollSystem && window.scrollSystem.inScroll) {
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
  
  // Apply animation fix with proper timing
  function initScrollFix() {
    setTimeout(applyScrollAnimationFix, 200);
    setTimeout(applyScrollAnimationFix, 600);
    setTimeout(applyScrollAnimationFix, 1200);
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
  
  // FIXED: Reduced interval frequency and better checks
  setInterval(function() {
    if (document.body.classList.contains('home-section') && !scrollFixed) {
      // Only apply if custom scroll system is not handling things
      if (!window.scrollSystem || !window.scrollSystem.initialized) {
        console.log('🔄 Interval check - reapplying animation fix');
        initScrollFix();
      }
    }
  }, 5000);
  
})();