/**
 * FUTURISTIC ACCORDION SYSTEM
 * Advanced accordion controller for product information panels
 * Replaces tabs with smooth, accessible accordions
 */

class AccordionSystem {
  constructor(container = document) {
    this.container = container;
    this.accordions = new Map();
    this.activeAccordion = null;
    this.settings = {
      animationDuration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      autoClose: true,
      allowMultiple: false,
      persistState: true,
      breakpoint: 750
    };
    
    // Bind methods
    this.handleClick = this.handleClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleResize = this.debounce(this.handleResize.bind(this), 100);
    
    this.init();
  }

  /**
   * Initialize accordion system
   */
  init() {
    try {
      this.setupAccordions();
      this.setupEventListeners();
      this.setupIntersectionObserver();
      this.restoreState();
      
      this.dispatchEvent('accordion:initialized');
    } catch (error) {
      console.warn('AccordionSystem: Initialization failed', error);
    }
  }

  /**
   * Setup all accordion instances
   */
  setupAccordions() {
    const accordionContainers = this.container.querySelectorAll('.futuristic-product-accordions');
    
    accordionContainers.forEach(container => {
      const accordionItems = container.querySelectorAll('.accordion-item');
      
      accordionItems.forEach((item, index) => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        const arrow = item.querySelector('.accordion-arrow');
        
        if (!header || !content) return;
        
        // Generate unique ID
        const accordionId = this.generateId(item, index);
        
        // Setup ARIA attributes
        this.setupAccessibility(item, header, content, accordionId);
        
        // Store accordion data
        this.accordions.set(accordionId, {
          id: accordionId,
          item,
          header,
          content,
          arrow,
          isOpen: false,
          contentHeight: 0,
          container
        });
        
        // Initialize content height
        this.calculateContentHeight(accordionId);
      });
    });
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Click events with delegation
    this.container.addEventListener('click', this.handleClick);
    
    // Keyboard navigation
    this.container.addEventListener('keydown', this.handleKeydown);
    
    // Resize events
    window.addEventListener('resize', this.handleResize, { passive: true });
    
    // Custom events
    document.addEventListener('product:variantChanged', this.handleVariantChange.bind(this));
    document.addEventListener('sticky:layoutChanged', this.handleLayoutChange.bind(this));
  }

  /**
   * Setup intersection observer for performance
   */
  setupIntersectionObserver() {
    if (!window.IntersectionObserver) return;

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    // Observe all accordion containers
    const containers = this.container.querySelectorAll('.futuristic-product-accordions');
    containers.forEach(container => this.observer.observe(container));
  }

  /**
   * Handle click events
   */
  handleClick(event) {
    const header = event.target.closest('.accordion-header');
    if (!header) return;

    event.preventDefault();
    
    const item = header.closest('.accordion-item');
    const accordionId = this.getAccordionId(item);
    
    if (accordionId && this.accordions.has(accordionId)) {
      this.toggle(accordionId);
    }
  }

  /**
   * Handle keyboard navigation
   */
  handleKeydown(event) {
    const header = event.target.closest('.accordion-header');
    if (!header) return;

    const item = header.closest('.accordion-item');
    const accordionId = this.getAccordionId(item);
    
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (accordionId) this.toggle(accordionId);
        break;
        
      case 'ArrowDown':
        event.preventDefault();
        this.focusNext(item);
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        this.focusPrevious(item);
        break;
        
      case 'Home':
        event.preventDefault();
        this.focusFirst(item);
        break;
        
      case 'End':
        event.preventDefault();
        this.focusLast(item);
        break;
    }
  }

  /**
   * Handle resize events
   */
  handleResize() {
    // Recalculate content heights
    this.accordions.forEach((accordion, id) => {
      this.calculateContentHeight(id);
      if (accordion.isOpen) {
        this.updateContentHeight(id);
      }
    });
  }

  /**
   * Handle variant changes
   */
  handleVariantChange(event) {
    // Recalculate heights after variant change
    setTimeout(() => {
      this.accordions.forEach((accordion, id) => {
        this.calculateContentHeight(id);
        if (accordion.isOpen) {
          this.updateContentHeight(id);
        }
      });
    }, 100);
  }

  /**
   * Handle layout changes
   */
  handleLayoutChange(event) {
    this.handleResize();
  }

  /**
   * Handle intersection observer
   */
  handleIntersection(entries) {
    entries.forEach(entry => {
      const container = entry.target;
      const isVisible = entry.isIntersecting;
      
      container.setAttribute('data-visible', isVisible);
      
      if (isVisible) {
        // Recalculate when container becomes visible
        this.recalculateContainer(container);
      }
    });
  }

  /**
   * Toggle accordion state
   */
  toggle(accordionId) {
    const accordion = this.accordions.get(accordionId);
    if (!accordion) return;

    if (accordion.isOpen) {
      this.close(accordionId);
    } else {
      this.open(accordionId);
    }
  }

  /**
   * Open accordion
   */
  open(accordionId) {
    const accordion = this.accordions.get(accordionId);
    if (!accordion || accordion.isOpen) return;

    // Close other accordions if autoClose is enabled
    if (this.settings.autoClose && !this.settings.allowMultiple) {
      this.closeOthers(accordionId, accordion.container);
    }

    // Update state
    accordion.isOpen = true;
    this.activeAccordion = accordionId;

    // Update DOM
    accordion.item.classList.add('active');
    accordion.header.setAttribute('aria-expanded', 'true');
    accordion.content.setAttribute('aria-hidden', 'false');

    // Animate arrow
    if (accordion.arrow) {
      accordion.arrow.style.transform = 'rotate(180deg)';
    }

    // Animate content
    this.animateOpen(accordion);

    // Save state
    if (this.settings.persistState) {
      this.saveState();
    }

    // Dispatch event
    this.dispatchEvent('accordion:opened', { accordionId, accordion });
    this.dispatchEvent('accordion:toggled', { accordionId, accordion, state: 'open' });

    // Notify sticky system
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('accordion:contentChanged'));
    }, this.settings.animationDuration);
  }

  /**
   * Close accordion
   */
  close(accordionId) {
    const accordion = this.accordions.get(accordionId);
    if (!accordion || !accordion.isOpen) return;

    // Update state
    accordion.isOpen = false;
    if (this.activeAccordion === accordionId) {
      this.activeAccordion = null;
    }

    // Update DOM
    accordion.item.classList.remove('active');
    accordion.header.setAttribute('aria-expanded', 'false');
    accordion.content.setAttribute('aria-hidden', 'true');

    // Animate arrow
    if (accordion.arrow) {
      accordion.arrow.style.transform = 'rotate(0deg)';
    }

    // Animate content
    this.animateClose(accordion);

    // Save state
    if (this.settings.persistState) {
      this.saveState();
    }

    // Dispatch event
    this.dispatchEvent('accordion:closed', { accordionId, accordion });
    this.dispatchEvent('accordion:toggled', { accordionId, accordion, state: 'closed' });

    // Notify sticky system
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('accordion:contentChanged'));
    }, this.settings.animationDuration);
  }

  /**
   * Close other accordions in the same container
   */
  closeOthers(exceptId, container) {
    this.accordions.forEach((accordion, id) => {
      if (id !== exceptId && accordion.container === container && accordion.isOpen) {
        this.close(id);
      }
    });
  }

  /**
   * Animate accordion opening
   */
  animateOpen(accordion) {
    const { content } = accordion;
    
    // Calculate target height
    this.calculateContentHeight(accordion.id);
    const targetHeight = accordion.contentHeight;

    // Set initial state
    content.style.maxHeight = '0px';
    content.style.opacity = '0';

    // Force reflow
    content.offsetHeight;

    // Animate to target
    content.style.transition = `max-height ${this.settings.animationDuration}ms ${this.settings.easing}, opacity ${this.settings.animationDuration}ms ease`;
    content.style.maxHeight = targetHeight + 'px';
    content.style.opacity = '1';

    // Cleanup after animation
    setTimeout(() => {
      content.style.maxHeight = 'none';
      content.style.transition = '';
    }, this.settings.animationDuration);
  }

  /**
   * Animate accordion closing
   */
  animateClose(accordion) {
    const { content } = accordion;
    
    // Set current height
    const currentHeight = content.scrollHeight;
    content.style.maxHeight = currentHeight + 'px';

    // Force reflow
    content.offsetHeight;

    // Animate to closed
    content.style.transition = `max-height ${this.settings.animationDuration}ms ${this.settings.easing}, opacity ${this.settings.animationDuration}ms ease`;
    content.style.maxHeight = '0px';
    content.style.opacity = '0';

    // Cleanup after animation
    setTimeout(() => {
      content.style.maxHeight = '';
      content.style.opacity = '';
      content.style.transition = '';
    }, this.settings.animationDuration);
  }

  /**
   * Calculate content height
   */
  calculateContentHeight(accordionId) {
    const accordion = this.accordions.get(accordionId);
    if (!accordion) return;

    const { content } = accordion;
    
    // Temporarily show content to measure
    const originalHeight = content.style.maxHeight;
    const originalVisibility = content.style.visibility;
    
    content.style.visibility = 'hidden';
    content.style.maxHeight = 'none';
    
    accordion.contentHeight = content.scrollHeight;
    
    content.style.maxHeight = originalHeight;
    content.style.visibility = originalVisibility;
  }

  /**
   * Update content height for open accordion
   */
  updateContentHeight(accordionId) {
    const accordion = this.accordions.get(accordionId);
    if (!accordion || !accordion.isOpen) return;

    this.calculateContentHeight(accordionId);
    accordion.content.style.maxHeight = accordion.contentHeight + 'px';
  }

  /**
   * Focus management methods
   */
  focusNext(currentItem) {
    const allItems = this.getAllAccordionItems(currentItem);
    const currentIndex = Array.from(allItems).indexOf(currentItem);
    const nextItem = allItems[currentIndex + 1] || allItems[0];
    const nextHeader = nextItem.querySelector('.accordion-header');
    if (nextHeader) nextHeader.focus();
  }

  focusPrevious(currentItem) {
    const allItems = this.getAllAccordionItems(currentItem);
    const currentIndex = Array.from(allItems).indexOf(currentItem);
    const prevItem = allItems[currentIndex - 1] || allItems[allItems.length - 1];
    const prevHeader = prevItem.querySelector('.accordion-header');
    if (prevHeader) prevHeader.focus();
  }

  focusFirst(currentItem) {
    const allItems = this.getAllAccordionItems(currentItem);
    const firstHeader = allItems[0].querySelector('.accordion-header');
    if (firstHeader) firstHeader.focus();
  }

  focusLast(currentItem) {
    const allItems = this.getAllAccordionItems(currentItem);
    const lastHeader = allItems[allItems.length - 1].querySelector('.accordion-header');
    if (lastHeader) lastHeader.focus();
  }

  /**
   * Get all accordion items in the same container
   */
  getAllAccordionItems(item) {
    const container = item.closest('.futuristic-product-accordions');
    return container.querySelectorAll('.accordion-item');
  }

  /**
   * Setup accessibility attributes
   */
  setupAccessibility(item, header, content, accordionId) {
    const headerId = `accordion-header-${accordionId}`;
    const contentId = `accordion-content-${accordionId}`;

    // Header attributes
    header.setAttribute('id', headerId);
    header.setAttribute('aria-expanded', 'false');
    header.setAttribute('aria-controls', contentId);
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');

    // Content attributes
    content.setAttribute('id', contentId);
    content.setAttribute('aria-labelledby', headerId);
    content.setAttribute('aria-hidden', 'true');
    content.setAttribute('role', 'region');

    // Item attributes
    item.setAttribute('data-accordion-id', accordionId);
  }

  /**
   * Generate unique accordion ID
   */
  generateId(item, index) {
    const existingId = item.getAttribute('data-accordion-id');
    if (existingId) return existingId;

    const accordionType = item.getAttribute('data-accordion') || 'accordion';
    return `${accordionType}-${index}-${Date.now()}`;
  }

  /**
   * Get accordion ID from item
   */
  getAccordionId(item) {
    return item.getAttribute('data-accordion-id');
  }

  /**
   * Recalculate container accordions
   */
  recalculateContainer(container) {
    const items = container.querySelectorAll('.accordion-item');
    items.forEach(item => {
      const accordionId = this.getAccordionId(item);
      if (accordionId && this.accordions.has(accordionId)) {
        this.calculateContentHeight(accordionId);
        if (this.accordions.get(accordionId).isOpen) {
          this.updateContentHeight(accordionId);
        }
      }
    });
  }

  /**
   * State persistence
   */
  saveState() {
    if (!this.settings.persistState) return;

    const state = {};
    this.accordions.forEach((accordion, id) => {
      state[id] = accordion.isOpen;
    });

    try {
      localStorage.setItem('accordion-state', JSON.stringify(state));
    } catch (error) {
      console.warn('AccordionSystem: Failed to save state', error);
    }
  }

  restoreState() {
    if (!this.settings.persistState) return;

    try {
      const savedState = localStorage.getItem('accordion-state');
      if (!savedState) return;

      const state = JSON.parse(savedState);
      
      // Apply saved state after a short delay
      setTimeout(() => {
        Object.entries(state).forEach(([id, isOpen]) => {
          if (this.accordions.has(id) && isOpen) {
            this.open(id);
          }
        });
      }, 100);
    } catch (error) {
      console.warn('AccordionSystem: Failed to restore state', error);
    }
  }

  /**
   * Public API methods
   */
  openAccordion(accordionId) {
    this.open(accordionId);
  }

  closeAccordion(accordionId) {
    this.close(accordionId);
  }

  toggleAccordion(accordionId) {
    this.toggle(accordionId);
  }

  closeAll() {
    this.accordions.forEach((accordion, id) => {
      if (accordion.isOpen) {
        this.close(id);
      }
    });
  }

  getState() {
    const state = {};
    this.accordions.forEach((accordion, id) => {
      state[id] = {
        isOpen: accordion.isOpen,
        contentHeight: accordion.contentHeight
      };
    });
    return state;
  }

  /**
   * Cleanup and destroy
   */
  destroy() {
    // Remove event listeners
    this.container.removeEventListener('click', this.handleClick);
    this.container.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('resize', this.handleResize);
    
    // Disconnect observer
    if (this.observer) {
      this.observer.disconnect();
    }

    // Close all accordions
    this.closeAll();

    // Clear data
    this.accordions.clear();
    this.activeAccordion = null;

    this.dispatchEvent('accordion:destroyed');
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
   * Static method to create instance
   */
  static init(container, options = {}) {
    return new AccordionSystem(container, options);
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accordionSystem = new AccordionSystem();
  });
} else {
  window.accordionSystem = new AccordionSystem();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccordionSystem;
}

// Make available globally
window.AccordionSystem = AccordionSystem;