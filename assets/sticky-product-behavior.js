/**
 * FUTURISTIC STICKY PANEL BEHAVIOR
 * Advanced sticky panel controller for split-screen product layout
 * Optimized performance with debounced scroll handlers and intersection observers
 */

class StickyProductBehavior {
  constructor() {
    this.isInitialized = false;
    this.isDesktop = window.innerWidth >= 750;
    this.stickyPanel = null;
    this.scrollContainer = null;
    this.lastScrollTop = 0;
    this.scrollDirection = 'down';
    this.isSticky = false;
    this.observers = new Map();
    
    // Performance optimization
    this.debounceDelay = 16; // ~60fps
    this.throttleDelay = 100;
    
    // Bind methods
    this.handleScroll = this.debounce(this.handleScroll.bind(this), this.debounceDelay);
    this.handleResize = this.debounce(this.handleResize.bind(this), this.throttleDelay);
    this.updateStickyState = this.updateStickyState.bind(this);
    
    this.init();
  }

  /**
   * Initialize the sticky behavior system
   */
  init() {
    if (this.isInitialized) return;
    
    try {
      this.setupElements();
      this.setupEventListeners();
      this.setupIntersectionObservers();
      this.updateLayout();
      
      this.isInitialized = true;
      this.dispatchEvent('sticky:initialized');
    } catch (error) {
      console.warn('StickyProductBehavior: Initialization failed', error);
    }
  }

  /**
   * Setup DOM elements
   */
  setupElements() {
    this.stickyPanel = document.querySelector('.sticky-product-info');
    this.scrollContainer = document.querySelector('.product-info-panel');
    this.productContainer = document.querySelector('.futuristic-product-container');
    
    if (!this.stickyPanel || !this.scrollContainer) {
      throw new Error('Required sticky elements not found');
    }
  }

  /**
   * Setup event listeners with proper cleanup
   */
  setupEventListeners() {
    // Window events
    window.addEventListener('resize', this.handleResize, { passive: true });
    window.addEventListener('orientationchange', this.handleResize, { passive: true });
    
    // Scroll events (only on desktop)
    if (this.isDesktop && this.scrollContainer) {
      this.scrollContainer.addEventListener('scroll', this.handleScroll, { passive: true });
    }
    
    // Page visibility for performance
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Custom events for integration
    document.addEventListener('product:variantChanged', this.handleVariantChange.bind(this));
    document.addEventListener('accordion:toggled', this.recalculateSticky.bind(this));
  }

  /**
   * Setup intersection observers for performance optimization
   */
  setupIntersectionObservers() {
    if (!window.IntersectionObserver) return;

    // Observe sticky panel visibility
    const stickyObserver = new IntersectionObserver(
      this.handleStickyIntersection.bind(this),
      {
        root: null,
        rootMargin: '0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );
    
    if (this.stickyPanel) {
      stickyObserver.observe(this.stickyPanel);
      this.observers.set('sticky', stickyObserver);
    }

    // Observe product container for layout changes
    const containerObserver = new IntersectionObserver(
      this.handleContainerIntersection.bind(this),
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      }
    );
    
    if (this.productContainer) {
      containerObserver.observe(this.productContainer);
      this.observers.set('container', containerObserver);
    }
  }

  /**
   * Handle scroll events with direction detection
   */
  handleScroll(event) {
    if (!this.isDesktop || document.hidden) return;
    
    const scrollTop = this.scrollContainer.scrollTop;
    const scrollDirection = scrollTop > this.lastScrollTop ? 'down' : 'up';
    
    // Only update if direction changed or significant scroll
    if (scrollDirection !== this.scrollDirection || Math.abs(scrollTop - this.lastScrollTop) > 10) {
      this.scrollDirection = scrollDirection;
      this.lastScrollTop = scrollTop;
      this.updateStickyState();
    }
  }

  /**
   * Handle window resize with layout recalculation
   */
  handleResize() {
    const wasDesktop = this.isDesktop;
    this.isDesktop = window.innerWidth >= 750;
    
    // Layout changed between mobile/desktop
    if (wasDesktop !== this.isDesktop) {
      this.updateLayout();
      this.dispatchEvent('sticky:layoutChanged', { isDesktop: this.isDesktop });
    } else {
      this.recalculateSticky();
    }
  }

  /**
   * Handle page visibility changes for performance
   */
  handleVisibilityChange() {
    if (!document.hidden && this.isDesktop) {
      // Recalculate when page becomes visible
      requestAnimationFrame(() => this.recalculateSticky());
    }
  }

  /**
   * Handle product variant changes
   */
  handleVariantChange(event) {
    // Slight delay to allow DOM updates
    setTimeout(() => this.recalculateSticky(), 100);
  }

  /**
   * Handle sticky panel intersection changes
   */
  handleStickyIntersection(entries) {
    entries.forEach(entry => {
      const isVisible = entry.intersectionRatio > 0;
      const wasSticky = this.isSticky;
      
      if (isVisible && !wasSticky) {
        this.enableSticky();
      } else if (!isVisible && wasSticky) {
        this.disableSticky();
      }
    });
  }

  /**
   * Handle product container intersection
   */
  handleContainerIntersection(entries) {
    entries.forEach(entry => {
      const container = entry.target;
      const isVisible = entry.isIntersecting;
      
      container.setAttribute('data-in-viewport', isVisible);
      
      if (isVisible) {
        this.enableOptimizations();
      } else {
        this.disableOptimizations();
      }
    });
  }

  /**
   * Update sticky state based on current conditions
   */
  updateStickyState() {
    if (!this.isDesktop || !this.stickyPanel) return;
    
    const containerHeight = this.scrollContainer.clientHeight;
    const panelHeight = this.stickyPanel.clientHeight;
    const scrollTop = this.scrollContainer.scrollTop;
    
    // Calculate sticky position
    let stickyPosition = 'relative';
    let translateY = 0;
    
    if (panelHeight > containerHeight) {
      // Panel is taller than container - enable smart scrolling
      if (this.scrollDirection === 'down') {
        stickyPosition = 'sticky';
        translateY = Math.max(0, containerHeight - panelHeight);
      } else {
        stickyPosition = 'sticky';
        translateY = 0;
      }
    } else {
      // Panel fits in container - center it
      stickyPosition = 'sticky';
      translateY = Math.max(0, (containerHeight - panelHeight) / 2);
    }
    
    this.applyStickyStyles(stickyPosition, translateY);
  }

  /**
   * Apply sticky styles with performance optimization
   */
  applyStickyStyles(position, translateY) {
    if (!this.stickyPanel) return;
    
    // Use transform for better performance
    const transform = translateY !== 0 ? `translateY(${translateY}px)` : '';
    
    // Batch DOM writes
    requestAnimationFrame(() => {
      this.stickyPanel.style.position = position;
      this.stickyPanel.style.transform = transform;
      this.stickyPanel.style.top = position === 'sticky' ? '0' : 'auto';
      
      // Update data attributes for CSS hooks
      this.stickyPanel.setAttribute('data-sticky-position', position);
      this.stickyPanel.setAttribute('data-scroll-direction', this.scrollDirection);
    });
  }

  /**
   * Enable sticky behavior
   */
  enableSticky() {
    if (this.isSticky) return;
    
    this.isSticky = true;
    this.stickyPanel?.classList.add('is-sticky');
    this.updateStickyState();
    this.dispatchEvent('sticky:enabled');
  }

  /**
   * Disable sticky behavior
   */
  disableSticky() {
    if (!this.isSticky) return;
    
    this.isSticky = false;
    this.stickyPanel?.classList.remove('is-sticky');
    
    // Reset styles
    if (this.stickyPanel) {
      this.stickyPanel.style.position = '';
      this.stickyPanel.style.transform = '';
      this.stickyPanel.style.top = '';
    }
    
    this.dispatchEvent('sticky:disabled');
  }

  /**
   * Update layout for mobile/desktop
   */
  updateLayout() {
    if (this.isDesktop) {
      this.enableDesktopLayout();
    } else {
      this.enableMobileLayout();
    }
  }

  /**
   * Enable desktop layout with sticky behavior
   */
  enableDesktopLayout() {
    if (!this.scrollContainer || !this.stickyPanel) return;
    
    // Add desktop classes
    this.productContainer?.classList.add('desktop-layout');
    this.scrollContainer.classList.add('desktop-scroll');
    
    // Setup scroll listener
    if (!this.scrollContainer.hasAttribute('data-scroll-listener')) {
      this.scrollContainer.addEventListener('scroll', this.handleScroll, { passive: true });
      this.scrollContainer.setAttribute('data-scroll-listener', 'true');
    }
    
    this.updateStickyState();
  }

  /**
   * Enable mobile layout without sticky behavior
   */
  enableMobileLayout() {
    if (!this.scrollContainer || !this.stickyPanel) return;
    
    // Remove desktop classes
    this.productContainer?.classList.remove('desktop-layout');
    this.scrollContainer.classList.remove('desktop-scroll');
    
    // Remove scroll listener
    if (this.scrollContainer.hasAttribute('data-scroll-listener')) {
      this.scrollContainer.removeEventListener('scroll', this.handleScroll);
      this.scrollContainer.removeAttribute('data-scroll-listener');
    }
    
    this.disableSticky();
  }

  /**
   * Enable performance optimizations
   */
  enableOptimizations() {
    document.body.classList.add('sticky-optimized');
  }

  /**
   * Disable performance optimizations
   */
  disableOptimizations() {
    document.body.classList.remove('sticky-optimized');
  }

  /**
   * Recalculate sticky behavior (useful after DOM changes)
   */
  recalculateSticky() {
    if (!this.isDesktop) return;
    
    // Small delay to ensure DOM is updated
    requestAnimationFrame(() => {
      this.updateStickyState();
    });
  }

  /**
   * Cleanup and destroy
   */
  destroy() {
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    
    if (this.scrollContainer) {
      this.scrollContainer.removeEventListener('scroll', this.handleScroll);
    }
    
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    document.removeEventListener('product:variantChanged', this.handleVariantChange);
    document.removeEventListener('accordion:toggled', this.recalculateSticky);
    
    // Cleanup observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    
    // Reset styles
    this.disableSticky();
    
    this.isInitialized = false;
    this.dispatchEvent('sticky:destroyed');
  }

  /**
   * Utility: Debounce function
   */
  debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  /**
   * Utility: Dispatch custom events
   */
  dispatchEvent(type, detail = {}) {
    const event = new CustomEvent(type, {
      detail: { instance: this, ...detail },
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
  }

  /**
   * Static method to get or create instance
   */
  static getInstance() {
    if (!window.stickyProductBehavior) {
      window.stickyProductBehavior = new StickyProductBehavior();
    }
    return window.stickyProductBehavior;
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    StickyProductBehavior.getInstance();
  });
} else {
  StickyProductBehavior.getInstance();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StickyProductBehavior;
}

// Make available globally
window.StickyProductBehavior = StickyProductBehavior;