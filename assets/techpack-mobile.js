/**
 * TechPack Mobile Optimizations
 * Mobile-first enhancements for touch interactions and responsive behavior
 * Handles viewport fixes, smooth scrolling, and mobile-specific UX
 */

(function() {
  'use strict';

  /**
   * TechPack Mobile Manager
   * Provides mobile-specific optimizations and touch interactions
   */
  class TechPackMobile {
    constructor() {
      this.isMobile = window.innerWidth <= 768;
      this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      this.isAndroid = /Android/.test(navigator.userAgent);
      this.touchStartY = 0;
      this.touchMoved = false;
      
      // Viewport height fix for mobile browsers
      this.viewportHeight = window.innerHeight;
      
      console.log('✅ TechPack Mobile Manager initialized');
    }

    /**
     * Initialize mobile optimizations
     */
    async init() {
      this.setupViewportFix();
      this.setupSmoothScrolling();
      this.setupTouchInteractions();
      this.setupFormOptimizations();
      this.setupKeyboardHandling();
      this.setupOrientationHandling();
      
      console.log('✅ Mobile optimizations complete');
    }

    /**
     * Setup viewport height fix for mobile browsers
     */
    setupViewportFix() {
      // Fix viewport height issues on mobile browsers
      const setViewportHeight = () => {
        this.viewportHeight = window.innerHeight;
        document.documentElement.style.setProperty('--vh', `${this.viewportHeight * 0.01}px`);
      };

      // Set initial height
      setViewportHeight();

      // Update on resize (debounced)
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          this.isMobile = window.innerWidth <= 768;
          setViewportHeight();
        }, 100);
      });

      // iOS specific viewport fixes
      if (this.isIOS) {
        // Prevent zoom on input focus
        const meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
          meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
        }

        // Fix for iOS safari address bar
        window.addEventListener('orientationchange', () => {
          setTimeout(setViewportHeight, 500);
        });
      }
    }

    /**
     * Setup smooth scrolling behavior
     */
    setupSmoothScrolling() {
      // Enable smooth scrolling for webkit browsers
      if (this.isMobile) {
        document.documentElement.style.scrollBehavior = 'smooth';
        document.body.style.scrollBehavior = 'smooth';
      }

      // Fix iOS momentum scrolling
      if (this.isIOS) {
        const scrollableElements = document.querySelectorAll('.techpack-container, .techpack-content');
        scrollableElements.forEach(element => {
          element.style.webkitOverflowScrolling = 'touch';
        });
      }
    }

    /**
     * Setup touch interactions
     */
    setupTouchInteractions() {
      if (!this.isMobile) return;

      // Improve touch targets
      const touchTargets = document.querySelectorAll('button, .techpack-btn, input, select, textarea');
      touchTargets.forEach(element => {
        element.style.minHeight = '44px'; // iOS recommended minimum
        element.style.minWidth = '44px';
      });

      // Handle touch events for better responsiveness
      document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
      document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
      document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });

      // Prevent double-tap zoom on buttons
      const buttons = document.querySelectorAll('button, .techpack-btn');
      buttons.forEach(button => {
        button.addEventListener('touchend', (e) => {
          e.preventDefault();
          button.click();
        });
      });
    }

    /**
     * Handle touch start events
     */
    handleTouchStart(e) {
      this.touchStartY = e.touches[0].clientY;
      this.touchMoved = false;
    }

    /**
     * Handle touch move events
     */
    handleTouchMove(e) {
      this.touchMoved = true;
    }

    /**
     * Handle touch end events
     */
    handleTouchEnd(e) {
      // Add any touch end logic here if needed
    }

    /**
     * Setup form optimizations for mobile
     */
    setupFormOptimizations() {
      if (!this.isMobile) return;

      // Improve form inputs for mobile
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        // Set appropriate input types for mobile keyboards
        if (input.type === 'text') {
          if (input.name === 'email' || input.id === 'email') {
            input.type = 'email';
          } else if (input.name === 'phone' || input.id === 'phone') {
            input.type = 'tel';
          }
        }

        // Prevent zoom on focus for iOS
        if (this.isIOS) {
          input.style.fontSize = '16px'; // Prevents zoom
        }

        // Add touch-friendly styling
        input.addEventListener('focus', () => {
          input.style.borderColor = 'var(--techpack-primary, #000)';
          input.style.boxShadow = '0 0 0 2px rgba(0, 0, 0, 0.1)';
        });

        input.addEventListener('blur', () => {
          input.style.borderColor = '';
          input.style.boxShadow = '';
        });
      });

      // Improve select dropdowns for mobile
      const selects = document.querySelectorAll('select');
      selects.forEach(select => {
        select.style.webkitAppearance = 'none';
        select.style.appearance = 'none';
        
        // Add custom dropdown arrow
        if (!select.parentElement.querySelector('.select-arrow')) {
          const arrow = document.createElement('div');
          arrow.className = 'select-arrow';
          arrow.innerHTML = '▼';
          arrow.style.cssText = `
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            font-size: 12px;
            color: #666;
          `;
          
          select.parentElement.style.position = 'relative';
          select.parentElement.appendChild(arrow);
        }
      });
    }

    /**
     * Setup keyboard handling for mobile
     */
    setupKeyboardHandling() {
      if (!this.isMobile) return;

      let initialViewportHeight = this.viewportHeight;

      // Handle virtual keyboard appearance
      const handleKeyboard = () => {
        const currentHeight = window.innerHeight;
        const heightDifference = initialViewportHeight - currentHeight;
        
        if (heightDifference > 150) {
          // Keyboard is likely open
          document.body.classList.add('keyboard-open');
          
          // Scroll focused element into view
          const focusedElement = document.activeElement;
          if (focusedElement && focusedElement.tagName !== 'BODY') {
            setTimeout(() => {
              focusedElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
              });
            }, 300);
          }
        } else {
          // Keyboard is likely closed
          document.body.classList.remove('keyboard-open');
        }
      };

      // iOS keyboard handling
      if (this.isIOS) {
        window.addEventListener('focusin', handleKeyboard);
        window.addEventListener('focusout', () => {
          setTimeout(handleKeyboard, 500);
        });
      }

      // Android keyboard handling
      if (this.isAndroid) {
        window.addEventListener('resize', handleKeyboard);
      }
    }

    /**
     * Setup orientation change handling
     */
    setupOrientationHandling() {
      if (!this.isMobile) return;

      window.addEventListener('orientationchange', () => {
        // Force repaint to fix layout issues
        setTimeout(() => {
          window.scrollTo(window.scrollX, window.scrollY);
          
          // Update viewport height
          this.viewportHeight = window.innerHeight;
          document.documentElement.style.setProperty('--vh', `${this.viewportHeight * 0.01}px`);
          
          // Trigger resize event for other components
          window.dispatchEvent(new Event('resize'));
        }, 500);
      });
    }

    /**
     * Scroll to top of page smoothly
     */
    scrollToTop() {
      if (this.isMobile) {
        // Use native smooth scrolling
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        // Fallback for older browsers
        const scrollTop = () => {
          const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
          if (currentScroll > 0) {
            window.requestAnimationFrame(scrollTop);
            window.scrollTo(0, currentScroll - (currentScroll / 8));
          }
        };
        scrollTop();
      }
    }

    /**
     * Scroll to element smoothly
     */
    scrollToElement(element, offset = 0) {
      if (!element) return;

      const elementTop = element.getBoundingClientRect().top + window.pageYOffset + offset;

      if (this.isMobile) {
        window.scrollTo({
          top: elementTop,
          behavior: 'smooth'
        });
      } else {
        // Animated scroll for better UX
        const start = window.pageYOffset;
        const change = elementTop - start;
        const duration = 500;
        let startTime = null;

        const animateScroll = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = timestamp - startTime;
          const progressPercentage = Math.min(progress / duration, 1);
          
          // Easing function
          const ease = progressPercentage < 0.5 
            ? 2 * progressPercentage * progressPercentage 
            : 1 - Math.pow(-2 * progressPercentage + 2, 3) / 2;
          
          window.scrollTo(0, start + change * ease);
          
          if (progress < duration) {
            window.requestAnimationFrame(animateScroll);
          }
        };

        window.requestAnimationFrame(animateScroll);
      }
    }

    /**
     * Show mobile-friendly loading state
     */
    showMobileLoader(text = 'Loading...') {
      const loader = document.createElement('div');
      loader.className = 'techpack-mobile-loader';
      loader.innerHTML = `
        <div class="loader-backdrop"></div>
        <div class="loader-content">
          <div class="loader-spinner"></div>
          <p class="loader-text">${text}</p>
        </div>
      `;
      
      loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      // Add styles for loader components
      const style = document.createElement('style');
      style.textContent = `
        .loader-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(4px);
        }
        .loader-content {
          position: relative;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .loader-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        .loader-text {
          margin: 0;
          color: #333;
          font-size: 14px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(loader);

      return {
        remove: () => {
          loader.remove();
          style.remove();
        }
      };
    }

    /**
     * Vibrate device (if supported)
     */
    vibrate(pattern = [100]) {
      if ('vibrate' in navigator && this.isMobile) {
        navigator.vibrate(pattern);
      }
    }

    /**
     * Check if device has touch capability
     */
    hasTouch() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    /**
     * Get device information
     */
    getDeviceInfo() {
      return {
        isMobile: this.isMobile,
        isIOS: this.isIOS,
        isAndroid: this.isAndroid,
        hasTouch: this.hasTouch(),
        viewportHeight: this.viewportHeight,
        pixelRatio: window.devicePixelRatio || 1,
        userAgent: navigator.userAgent
      };
    }
  }

  // Export for use in other modules
  window.TechPackMobile = TechPackMobile;

})();