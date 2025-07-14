/**
 * ADVANCED IMAGE PROTECTION SYSTEM
 * Comprehensive protection against image downloading, right-clicking, and unauthorized access
 * Optimized for performance and accessibility compliance
 */

class ImageProtection {
  constructor(options = {}) {
    this.settings = {
      disableRightClick: true,
      disableDragDrop: true,
      disableSelection: true,
      disableKeyboardShortcuts: true,
      disableLongPress: true,
      disableDevTools: true,
      showWarningMessage: true,
      warningDuration: 3000,
      protectedSelectors: [
        '.protected-image',
        '.protected-thumbnail',
        '.main-product-image',
        '.thumbnail-image',
        '.futuristic-media-gallery img',
        '[data-image-protection="enabled"] img'
      ],
      exemptSelectors: [
        '.icon',
        '.logo',
        '[data-protection-exempt="true"]'
      ],
      ...options
    };

    this.protectedElements = new Set();
    this.warningElement = null;
    this.warningTimeout = null;
    this.isDevToolsOpen = false;
    this.devToolsCheckInterval = null;

    // Bind methods
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleSelectStart = this.handleSelectStart.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.handlePrint = this.handlePrint.bind(this);

    this.init();
  }

  /**
   * Initialize image protection system
   */
  init() {
    try {
      this.setupProtectedElements();
      this.setupEventListeners();
      this.setupDevToolsDetection();
      this.setupMutationObserver();
      this.injectProtectionCSS();
      
      this.dispatchEvent('imageProtection:initialized');
    } catch (error) {
      console.warn('ImageProtection: Initialization failed', error);
    }
  }

  /**
   * Setup protected elements
   */
  setupProtectedElements() {
    this.settings.protectedSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => this.protectElement(element));
    });
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Document-level events
    if (this.settings.disableRightClick) {
      document.addEventListener('contextmenu', this.handleContextMenu, { passive: false });
    }

    if (this.settings.disableDragDrop) {
      document.addEventListener('dragstart', this.handleDragStart, { passive: false });
    }

    if (this.settings.disableSelection) {
      document.addEventListener('selectstart', this.handleSelectStart, { passive: false });
    }

    if (this.settings.disableKeyboardShortcuts) {
      document.addEventListener('keydown', this.handleKeyDown, { passive: false });
    }

    if (this.settings.disableLongPress) {
      document.addEventListener('touchstart', this.handleTouchStart, { passive: false });
      document.addEventListener('touchend', this.handleTouchEnd, { passive: true });
    }

    // Additional protection events
    document.addEventListener('copy', this.handleCopy, { passive: false });
    document.addEventListener('beforeprint', this.handlePrint, { passive: false });

    // Window events
    window.addEventListener('beforeunload', this.cleanup.bind(this));
  }

  /**
   * Setup DevTools detection
   */
  setupDevToolsDetection() {
    if (!this.settings.disableDevTools) return;

    // Check for DevTools periodically
    this.devToolsCheckInterval = setInterval(() => {
      this.checkDevTools();
    }, 1000);

    // Additional detection methods
    this.setupConsoleDetection();
    this.setupDebuggerDetection();
  }

  /**
   * Setup mutation observer for dynamic content
   */
  setupMutationObserver() {
    if (!window.MutationObserver) return;

    this.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.protectNewElements(node);
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Protect a single element
   */
  protectElement(element) {
    if (!element || this.protectedElements.has(element)) return;

    // Check if element is exempt
    const isExempt = this.settings.exemptSelectors.some(selector => {
      return element.matches && element.matches(selector);
    });

    if (isExempt) return;

    // Add protection attributes
    element.setAttribute('draggable', 'false');
    element.setAttribute('oncontextmenu', 'return false;');
    element.setAttribute('onselectstart', 'return false;');
    element.setAttribute('ondragstart', 'return false;');

    // Add protection classes
    element.classList.add('image-protected');

    // Store reference
    this.protectedElements.add(element);

    // Setup element-specific listeners
    this.setupElementListeners(element);
  }

  /**
   * Setup element-specific event listeners
   */
  setupElementListeners(element) {
    // Long press protection for mobile
    let longPressTimer;
    
    element.addEventListener('touchstart', (e) => {
      longPressTimer = setTimeout(() => {
        e.preventDefault();
        this.showWarning('Long press disabled on protected images');
      }, 500);
    }, { passive: false });

    element.addEventListener('touchend', () => {
      clearTimeout(longPressTimer);
    }, { passive: true });

    element.addEventListener('touchmove', () => {
      clearTimeout(longPressTimer);
    }, { passive: true });

    // Additional image-specific protection
    if (element.tagName === 'IMG') {
      element.addEventListener('load', () => {
        this.applyImageProtection(element);
      });
    }
  }

  /**
   * Apply specific image protection
   */
  applyImageProtection(img) {
    // Disable image loading events
    img.addEventListener('error', (e) => e.stopPropagation());
    
    // Remove src attributes from DOM inspection
    if (img.dataset.src && !img.dataset.protectionApplied) {
      img.dataset.protectionApplied = 'true';
    }

    // Add invisible overlay
    const overlay = document.createElement('div');
    overlay.className = 'image-protection-overlay';
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      background: transparent;
      pointer-events: none;
    `;
    
    const parent = img.parentElement;
    if (parent && getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }
    if (parent) {
      parent.appendChild(overlay);
    }
  }

  /**
   * Protect newly added elements
   */
  protectNewElements(container) {
    this.settings.protectedSelectors.forEach(selector => {
      const elements = container.querySelectorAll ? 
        container.querySelectorAll(selector) : 
        (container.matches && container.matches(selector) ? [container] : []);
      
      elements.forEach(element => this.protectElement(element));
    });
  }

  /**
   * Event handlers
   */
  handleContextMenu(e) {
    const target = e.target;
    
    if (this.isProtectedElement(target)) {
      e.preventDefault();
      e.stopPropagation();
      this.showWarning('Right-click is disabled on protected images');
      return false;
    }
  }

  handleDragStart(e) {
    const target = e.target;
    
    if (this.isProtectedElement(target)) {
      e.preventDefault();
      e.stopPropagation();
      this.showWarning('Dragging is disabled on protected images');
      return false;
    }
  }

  handleSelectStart(e) {
    const target = e.target;
    
    if (this.isProtectedElement(target)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  handleKeyDown(e) {
    // Disable common shortcuts
    const forbiddenKeys = [
      { key: 's', ctrl: true }, // Save
      { key: 's', meta: true }, // Save (Mac)
      { key: 'a', ctrl: true }, // Select All
      { key: 'a', meta: true }, // Select All (Mac)
      { key: 'c', ctrl: true }, // Copy (in image context)
      { key: 'c', meta: true }, // Copy (Mac)
      { key: 'p', ctrl: true }, // Print
      { key: 'p', meta: true }, // Print (Mac)
      { key: 'F12' }, // DevTools
      { key: 'I', ctrl: true, shift: true }, // DevTools
      { key: 'I', meta: true, shift: true }, // DevTools (Mac)
      { key: 'J', ctrl: true, shift: true }, // Console
      { key: 'J', meta: true, shift: true }, // Console (Mac)
      { key: 'U', ctrl: true }, // View Source
      { key: 'U', meta: true }, // View Source (Mac)
    ];

    const isForbidden = forbiddenKeys.some(forbidden => {
      return e.key === forbidden.key &&
             (!forbidden.ctrl || e.ctrlKey) &&
             (!forbidden.meta || e.metaKey) &&
             (!forbidden.shift || e.shiftKey);
    });

    if (isForbidden) {
      const focusedElement = document.activeElement;
      if (this.isProtectedElement(focusedElement) || this.isInProtectedContext()) {
        e.preventDefault();
        e.stopPropagation();
        this.showWarning('This keyboard shortcut is disabled');
        return false;
      }
    }
  }

  handleTouchStart(e) {
    // Additional touch protection can be added here
  }

  handleTouchEnd(e) {
    // Touch end handling
  }

  handleCopy(e) {
    if (this.isInProtectedContext()) {
      e.preventDefault();
      e.clipboardData?.setData('text/plain', '');
      this.showWarning('Copying is disabled for protected content');
    }
  }

  handlePrint(e) {
    // Allow printing but hide protected images
    const protectedImages = document.querySelectorAll('.image-protected');
    protectedImages.forEach(img => {
      img.style.visibility = 'hidden';
    });

    // Restore after print
    setTimeout(() => {
      protectedImages.forEach(img => {
        img.style.visibility = '';
      });
    }, 1000);
  }

  /**
   * DevTools detection methods
   */
  checkDevTools() {
    const threshold = 160;
    
    if (window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold) {
      if (!this.isDevToolsOpen) {
        this.isDevToolsOpen = true;
        this.handleDevToolsOpen();
      }
    } else {
      this.isDevToolsOpen = false;
    }
  }

  setupConsoleDetection() {
    // Override console methods
    const originalLog = console.log;
    console.log = (...args) => {
      this.handleConsoleAccess();
      return originalLog.apply(console, args);
    };
  }

  setupDebuggerDetection() {
    // Anti-debugging
    setInterval(() => {
      const start = performance.now();
      debugger; // This will pause if DevTools is open
      const end = performance.now();
      
      if (end - start > 100) {
        this.handleDevToolsOpen();
      }
    }, 3000);
  }

  handleDevToolsOpen() {
    this.showWarning('Developer tools detected. Image protection is active.');
    
    // Additional protection measures
    this.obfuscateImages();
  }

  handleConsoleAccess() {
    // Log console access attempts
    if (this.settings.showWarningMessage) {
      console.warn('🛡️ Image protection is active');
    }
  }

  /**
   * Utility methods
   */
  isProtectedElement(element) {
    if (!element) return false;
    
    return this.protectedElements.has(element) ||
           element.classList.contains('image-protected') ||
           this.settings.protectedSelectors.some(selector => {
             return element.matches && element.matches(selector);
           });
  }

  isInProtectedContext() {
    const activeElement = document.activeElement;
    const selection = window.getSelection();
    
    return this.isProtectedElement(activeElement) ||
           (selection.rangeCount > 0 && 
            this.isProtectedElement(selection.getRangeAt(0).commonAncestorContainer));
  }

  obfuscateImages() {
    this.protectedElements.forEach(element => {
      if (element.tagName === 'IMG') {
        element.style.filter = 'blur(5px)';
        setTimeout(() => {
          element.style.filter = '';
        }, 2000);
      }
    });
  }

  showWarning(message) {
    if (!this.settings.showWarningMessage) return;

    // Clear existing warning
    this.hideWarning();

    // Create warning element
    this.warningElement = document.createElement('div');
    this.warningElement.className = 'image-protection-warning';
    this.warningElement.textContent = message;
    this.warningElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      pointer-events: none;
      animation: slideInWarning 0.3s ease;
    `;

    document.body.appendChild(this.warningElement);

    // Auto hide after duration
    this.warningTimeout = setTimeout(() => {
      this.hideWarning();
    }, this.settings.warningDuration);
  }

  hideWarning() {
    if (this.warningElement) {
      this.warningElement.remove();
      this.warningElement = null;
    }
    if (this.warningTimeout) {
      clearTimeout(this.warningTimeout);
      this.warningTimeout = null;
    }
  }

  /**
   * Inject protection CSS
   */
  injectProtectionCSS() {
    const css = `
      .image-protected {
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        pointer-events: auto !important;
        -webkit-touch-callout: none !important;
        -webkit-user-drag: none !important;
      }
      
      .image-protection-overlay {
        user-select: none !important;
        pointer-events: none !important;
      }
      
      @keyframes slideInWarning {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @media print {
        .image-protected {
          visibility: hidden !important;
        }
      }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  /**
   * Public API methods
   */
  addProtection(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => this.protectElement(element));
  }

  removeProtection(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.classList.remove('image-protected');
      element.removeAttribute('draggable');
      element.removeAttribute('oncontextmenu');
      element.removeAttribute('onselectstart');
      element.removeAttribute('ondragstart');
      this.protectedElements.delete(element);
    });
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
  }

  getProtectedElements() {
    return Array.from(this.protectedElements);
  }

  /**
   * Cleanup and destroy
   */
  cleanup() {
    // Remove event listeners
    document.removeEventListener('contextmenu', this.handleContextMenu);
    document.removeEventListener('dragstart', this.handleDragStart);
    document.removeEventListener('selectstart', this.handleSelectStart);
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchend', this.handleTouchEnd);
    document.removeEventListener('copy', this.handleCopy);
    document.removeEventListener('beforeprint', this.handlePrint);

    // Clear intervals
    if (this.devToolsCheckInterval) {
      clearInterval(this.devToolsCheckInterval);
    }

    // Disconnect observer
    if (this.observer) {
      this.observer.disconnect();
    }

    // Hide warning
    this.hideWarning();

    // Clear protected elements
    this.protectedElements.clear();

    this.dispatchEvent('imageProtection:destroyed');
  }

  destroy() {
    this.cleanup();
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
  static init(options = {}) {
    return new ImageProtection(options);
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.imageProtection = new ImageProtection();
  });
} else {
  window.imageProtection = new ImageProtection();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageProtection;
}

// Make available globally
window.ImageProtection = ImageProtection;