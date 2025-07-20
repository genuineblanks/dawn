/**
 * Why We're Different Landing Page Interactions
 * GenuineBlanks - Mobile-First Design
 * Handles scroll animations, progress tracking, and mobile swipe gestures
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    // Animation thresholds
    SCROLL_THRESHOLD: 0.3,
    CTA_SHOW_CARD: 2, // Show CTA after card 2
    
    // Performance settings
    THROTTLE_DELAY: 16, // ~60fps
    MOBILE_BREAKPOINT: 768,
    
    // Touch settings
    MIN_SWIPE_DISTANCE: 50,
    SWIPE_VELOCITY_THRESHOLD: 0.3
  };

  // State management
  let state = {
    initialized: false,
    currentCard: 0,
    totalCards: 0,
    isScrolling: false,
    isMobile: false,
    touchStartY: 0,
    touchStartTime: 0,
    lastScrollTime: 0
  };

  // DOM elements
  let elements = {};

  /**
   * Initialize the landing page interactions
   */
  function init() {
    if (state.initialized) return;
    
    console.log('🎯 Why Different: Starting initialization...');
    
    // Cache DOM elements
    cacheElements();
    
    // Verify we found the elements
    if (!elements.page || !elements.cards || elements.cards.length === 0) {
      console.error('❌ Why Different: Required elements not found');
      return;
    }
    
    console.log('🎯 Found elements:', {
      page: !!elements.page,
      cards: elements.cards.length,
      ctaBar: !!elements.ctaBar
    });
    
    // Check if we're on mobile
    state.isMobile = window.innerWidth < CONFIG.MOBILE_BREAKPOINT;
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize animations
    setupScrollAnimations();
    
    // Initial progress update
    updateProgress();
    
    // Force initial state
    setTimeout(() => {
      updateProgress();
      updateCTABar();
    }, 100);
    
    state.initialized = true;
    console.log('✅ Why Different: Interactions initialized successfully');
  }

  /**
   * Cache DOM elements for performance
   */
  function cacheElements() {
    elements = {
      page: document.querySelector('.why-different-page'),
      cards: document.querySelectorAll('.why-different-card'),
      intro: document.querySelector('.why-different-intro'),
      ctaBar: document.querySelector('.why-different-cta-bar'),
      progressBar: document.querySelector('.why-different-progress__bar'),
      ctaButton: document.querySelector('.why-different-cta-bar__button')
    };

    // Set total cards count
    state.totalCards = elements.cards.length;
  }

  /**
   * Set up all event listeners
   */
  function setupEventListeners() {
    // Scroll events with throttling
    window.addEventListener('scroll', throttle(handleScroll, CONFIG.THROTTLE_DELAY));
    
    // Resize events
    window.addEventListener('resize', throttle(handleResize, 250));
    
    // Touch events for mobile swipe
    if (state.isMobile) {
      setupTouchEvents();
    }
    
    // Card click events for expansion
    setupCardClickEvents();
    
    // Intersection Observer for card animations
    setupIntersectionObserver();
    
    // CTA button analytics (if needed)
    if (elements.ctaButton) {
      elements.ctaButton.addEventListener('click', handleCtaClick);
    }
  }

  /**
   * Set up click events for card expansion
   */
  function setupCardClickEvents() {
    console.log('🎯 Setting up card click events for', elements.cards.length, 'cards');
    
    elements.cards.forEach((card, index) => {
      // Remove any existing listeners
      card.removeEventListener('click', handleCardClick);
      
      // Add new click listener
      const clickHandler = (e) => {
        console.log('🎯 Card clicked:', index + 1, e.target);
        
        // Prevent expansion when clicking on images or other interactive elements
        if (e.target.closest('.split-comparison') || e.target.closest('.why-different-badge')) {
          console.log('🎯 Ignoring click on interactive element');
          return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        handleCardClick(card, index);
      };
      
      card.addEventListener('click', clickHandler);
      
      // Force cursor pointer styling
      card.style.cursor = 'pointer';
      card.style.pointerEvents = 'auto';
      
      console.log('✅ Click handler added to card', index + 1);
    });
  }

  /**
   * Handle card click for expansion
   */
  function handleCardClick(card, index) {
    console.log('🎯 Handling card click for card', index + 1);
    
    const isExpanded = card.classList.contains('expanded');
    console.log('🎯 Card current state - expanded:', isExpanded);
    
    // Close all other expanded cards first
    elements.cards.forEach((otherCard, otherIndex) => {
      if (otherCard !== card) {
        otherCard.classList.remove('expanded');
        updateClickIndicator(otherCard, false);
        console.log('🎯 Closed card', otherIndex + 1);
      }
    });
    
    // Toggle current card
    if (isExpanded) {
      card.classList.remove('expanded');
      updateClickIndicator(card, false);
      console.log('🎯 Card', index + 1, 'collapsed');
    } else {
      card.classList.add('expanded');
      updateClickIndicator(card, true);
      console.log('🎯 Card', index + 1, 'expanded');
      
      // Smooth scroll to keep the card centered if needed
      setTimeout(() => {
        const cardRect = card.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (cardRect.bottom > viewportHeight * 0.9) {
          card.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 300);
    }
  }

  /**
   * Update click indicator visual state
   */
  function updateClickIndicator(card, isExpanded) {
    const indicator = card.querySelector('.click-indicator');
    if (indicator) {
      indicator.textContent = isExpanded ? '−' : '+';
      indicator.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
    }
  }

  /**
   * Set up touch events for mobile swipe navigation
   */
  function setupTouchEvents() {
    if (!elements.page) return;

    elements.page.addEventListener('touchstart', handleTouchStart, { passive: true });
    elements.page.addEventListener('touchmove', handleTouchMove, { passive: false });
    elements.page.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

  /**
   * Handle touch start
   */
  function handleTouchStart(e) {
    state.touchStartY = e.touches[0].clientY;
    state.touchStartTime = Date.now();
  }

  /**
   * Handle touch move
   */
  function handleTouchMove(e) {
    // Prevent pull-to-refresh on iOS when swiping up
    if (window.pageYOffset === 0 && e.touches[0].clientY > state.touchStartY) {
      e.preventDefault();
    }
  }

  /**
   * Handle touch end - detect swipe gestures
   */
  function handleTouchEnd(e) {
    const touchEndY = e.changedTouches[0].clientY;
    const touchDuration = Date.now() - state.touchStartTime;
    const touchDistance = state.touchStartY - touchEndY;
    const velocity = Math.abs(touchDistance) / touchDuration;

    // Check if it's a valid swipe
    if (Math.abs(touchDistance) > CONFIG.MIN_SWIPE_DISTANCE && 
        velocity > CONFIG.SWIPE_VELOCITY_THRESHOLD) {
      
      if (touchDistance > 0) {
        // Swipe up - go to next section
        navigateToNextCard();
      } else {
        // Swipe down - go to previous section
        navigateToPreviousCard();
      }
    }
  }

  /**
   * Navigate to next card
   */
  function navigateToNextCard() {
    const nextCard = getCurrentCard() + 1;
    if (nextCard < state.totalCards) {
      scrollToCard(nextCard);
    }
  }

  /**
   * Navigate to previous card
   */
  function navigateToPreviousCard() {
    const prevCard = getCurrentCard() - 1;
    if (prevCard >= 0) {
      scrollToCard(prevCard);
    } else if (elements.intro) {
      // Go back to intro
      elements.intro.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Scroll to specific card
   */
  function scrollToCard(cardIndex) {
    if (elements.cards[cardIndex]) {
      elements.cards[cardIndex].scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  /**
   * Get current card index based on scroll position
   */
  function getCurrentCard() {
    const scrollY = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const scrollCenter = scrollY + windowHeight / 2;

    for (let i = 0; i < elements.cards.length; i++) {
      const card = elements.cards[i];
      const cardTop = card.offsetTop;
      const cardBottom = cardTop + card.offsetHeight;

      if (scrollCenter >= cardTop && scrollCenter <= cardBottom) {
        return i;
      }
    }
    return 0;
  }

  /**
   * Set up Intersection Observer for animations
   */
  function setupIntersectionObserver() {
    const observerOptions = {
      threshold: CONFIG.SCROLL_THRESHOLD,
      rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all cards
    elements.cards.forEach(card => {
      observer.observe(card);
    });
  }

  /**
   * Handle scroll events
   */
  function handleScroll() {
    // Prevent excessive scroll handling
    const now = Date.now();
    if (now - state.lastScrollTime < CONFIG.THROTTLE_DELAY) return;
    state.lastScrollTime = now;

    updateProgress();
    updateCTABar();
    state.currentCard = getCurrentCard();
    
    // Debug scroll position
    if (window.location.search.includes('debug=true')) {
      console.log('📍 Scroll position:', window.pageYOffset, 'Current card:', state.currentCard);
    }
  }

  /**
   * Update progress bar
   */
  function updateProgress() {
    if (!elements.progressBar) return;

    const scrollTop = window.pageYOffset;
    
    // Calculate based on the last card position instead of full document
    // This prevents footer from affecting the progress calculation
    let documentHeight;
    if (elements.cards.length > 0) {
      const lastCard = elements.cards[elements.cards.length - 1];
      const lastCardBottom = lastCard.offsetTop + lastCard.offsetHeight;
      documentHeight = lastCardBottom - window.innerHeight;
    } else {
      documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    }
    
    const scrollPercent = Math.min((scrollTop / documentHeight) * 100, 100);

    elements.progressBar.style.width = scrollPercent + '%';
    
    // Debug progress
    if (window.location.search.includes('debug=true')) {
      console.log('📊 Progress:', scrollPercent.toFixed(1) + '%');
    }
  }

  /**
   * Update CTA bar visibility
   */
  function updateCTABar() {
    if (!elements.ctaBar) return;

    const currentCard = getCurrentCard();
    
    if (currentCard >= CONFIG.CTA_SHOW_CARD) {
      elements.ctaBar.classList.add('show');
    } else {
      elements.ctaBar.classList.remove('show');
    }
  }

  /**
   * Handle window resize
   */
  function handleResize() {
    const wasMobile = state.isMobile;
    state.isMobile = window.innerWidth < CONFIG.MOBILE_BREAKPOINT;

    // Re-setup touch events if mobile state changed
    if (wasMobile !== state.isMobile && state.isMobile) {
      setupTouchEvents();
    }

    // Recalculate progress
    updateProgress();
  }

  /**
   * Handle CTA button click for analytics
   */
  function handleCtaClick(e) {
    // Add analytics tracking here if needed
    console.log('🎯 CTA clicked on card:', state.currentCard + 1);
    
    // Optional: Add smooth scroll to top of target page
    // (useful if CTA leads to form with validation)
  }

  /**
   * Set up initial scroll animations
   */
  function setupScrollAnimations() {
    // Add initial classes for animation
    elements.cards.forEach((card, index) => {
      card.style.setProperty('--animation-delay', `${index * 0.1}s`);
    });
  }

  /**
   * Throttle function for performance
   */
  function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    
    return function(...args) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  /**
   * Enhanced mobile performance optimizations
   */
  function optimizeForMobile() {
    if (!state.isMobile) return;

    // Reduce animation complexity on mobile
    document.documentElement.style.setProperty('--animation-duration', '0.4s');
    
    // Optimize scroll behavior
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Disable some heavy animations if performance is poor
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      document.body.classList.add('reduced-animations');
    }
  }

  /**
   * Cleanup function
   */
  function cleanup() {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);
    
    if (elements.page) {
      elements.page.removeEventListener('touchstart', handleTouchStart);
      elements.page.removeEventListener('touchmove', handleTouchMove);
      elements.page.removeEventListener('touchend', handleTouchEnd);
    }
    
    state.initialized = false;
  }

  /**
   * Public API
   */
  window.WhyDifferentLanding = {
    init,
    cleanup,
    navigateToCard: scrollToCard,
    getCurrentCard,
    state: () => ({ ...state }) // Return copy of state
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM is already ready
    init();
  }

  // Initialize mobile optimizations
  optimizeForMobile();

  // Expose to global scope for debugging
  if (window.location.search.includes('debug=true')) {
    window._whyDifferentState = state;
    window._whyDifferentElements = elements;
    console.log('🔧 Debug mode enabled for Why Different landing');
  }

})();