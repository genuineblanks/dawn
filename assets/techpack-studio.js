/* TechPack-Studio v10 - Clean Modular JavaScript */
/* Complete isolation with guard clause */

// Guard clause - prevent execution if root container not present
if (!document.querySelector('#tps-root')) {
  console.log('TechPack Studio root container not found, skipping initialization');
} else {

  // Theme Management
  class ThemeManager {
    constructor() {
      this.root = document.querySelector('#tps-root');
      this.buttons = document.querySelectorAll('.tps-theme-btn');
      this.storageKey = 'tps-theme';
      
      this.init();
    }
    
    init() {
      // Always default to light on first load as per requirements
      const savedTheme = localStorage.getItem(this.storageKey) || 'light';
      this.applyTheme(savedTheme);
      this.bindEvents();
    }
    
    applyTheme(theme) {
      this.root.setAttribute('data-theme', theme);
      localStorage.setItem(this.storageKey, theme);
      
      // Update button states
      this.buttons.forEach(btn => {
        const isActive = btn.getAttribute('data-theme') === theme;
        btn.classList.toggle('tps-theme-btn--active', isActive);
      });
      
      // Dispatch theme change event
      window.dispatchEvent(new CustomEvent('tps:theme-changed', {
        detail: { theme }
      }));
    }
    
    bindEvents() {
      this.buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const theme = btn.getAttribute('data-theme');
          this.applyTheme(theme);
        });
      });
    }
    
    getTheme() {
      return this.root.getAttribute('data-theme');
    }
  }

  // Modal Management
  class ModalManager {
    constructor() {
      this.activeModal = null;
      this.lastFocusedElement = null;
      this.clientType = null;
      
      this.init();
    }
    
    init() {
      this.bindEvents();
      this.setupKeyboardHandling();
    }
    
    bindEvents() {
      // Primary CTA button
      const accessBtn = document.getElementById('tps-access-studio');
      if (accessBtn) {
        accessBtn.addEventListener('click', () => {
          this.openModal('tps-client-modal');
        });
      }
      
      // Listen for custom event
      window.addEventListener('tps:open-auth-modal', () => {
        this.openModal('tps-client-modal');
      });
      
      // Modal close buttons
      document.querySelectorAll('.tps-modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
          this.closeModal();
        });
      });
      
      // Client type buttons
      const registeredBtn = document.getElementById('tps-registered-client');
      const newBtn = document.getElementById('tps-new-client');
      
      if (registeredBtn) {
        registeredBtn.addEventListener('click', () => {
          this.clientType = 'registered';
          this.transitionToSubmissionModal();
        });
      }
      
      if (newBtn) {
        newBtn.addEventListener('click', () => {
          this.clientType = 'new';
          this.transitionToSubmissionModal();
        });
      }
      
      // Submission type buttons
      document.querySelectorAll('.tps-submission-option').forEach(btn => {
        btn.addEventListener('click', () => {
          if (!btn.disabled) {
            const type = btn.getAttribute('data-type');
            this.handleSubmissionChoice(type);
          }
        });
      });
      
      // Overlay click to close
      document.querySelectorAll('.tps-modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            this.closeModal();
          }
        });
      });
    }
    
    setupKeyboardHandling() {
      document.addEventListener('keydown', (e) => {
        if (!this.activeModal) return;
        
        if (e.key === 'Escape') {
          e.preventDefault();
          this.closeModal();
        }
        
        if (e.key === 'Tab') {
          this.handleTabNavigation(e);
        }
      });
    }
    
    openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal) return;
      
      // Store the element that triggered the modal
      this.lastFocusedElement = document.activeElement;
      
      // Show modal
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      this.activeModal = modal;
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus first focusable element after a brief delay to ensure visibility
      setTimeout(() => {
        this.focusFirstElement(modal);
      }, 50);
      
      // Update submission modal state if needed
      if (modalId === 'tps-submission-modal') {
        this.updateSubmissionModalState();
      }
    }
    
    closeModal() {
      if (!this.activeModal) return;
      
      // Hide modal
      this.activeModal.style.display = 'none';
      this.activeModal.setAttribute('aria-hidden', 'true');
      
      // Unlock body scroll
      document.body.style.overflow = '';
      
      // Return focus to trigger element
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
      }
      
      this.activeModal = null;
      this.lastFocusedElement = null;
    }
    
    transitionToSubmissionModal() {
      // Close current modal and open submission modal
      this.activeModal.setAttribute('aria-hidden', 'true');
      
      // Small delay for smooth transition
      setTimeout(() => {
        this.openModal('tps-submission-modal');
      }, 100);
    }
    
    updateSubmissionModalState() {
      const notice = document.getElementById('tps-registration-notice');
      const options = document.querySelectorAll('.tps-submission-option');
      
      if (this.clientType === 'new') {
        // Show registration notice
        if (notice) {
          notice.style.display = 'flex';
        }
        
        // Disable all except quotation
        options.forEach(option => {
          const type = option.getAttribute('data-type');
          const isQuotation = type === 'quotation';
          
          option.disabled = !isQuotation;
          option.setAttribute('aria-disabled', !isQuotation);
          
          if (!isQuotation) {
            option.title = 'Available for registered clients only';
          }
        });
      } else {
        // Hide registration notice
        if (notice) {
          notice.style.display = 'none';
        }
        
        // Enable all options
        options.forEach(option => {
          option.disabled = false;
          option.setAttribute('aria-disabled', 'false');
          option.removeAttribute('title');
        });
      }
    }
    
    focusFirstElement(modal) {
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
    
    handleTabNavigation(e) {
      const focusableElements = this.activeModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
    
    handleSubmissionChoice(type) {
      console.log(`Selected submission type: ${type} for client type: ${this.clientType}`);
      
      // Here you would typically redirect to the appropriate step
      // For now, just close the modal and log the choice
      this.closeModal();
      
      // Dispatch event for future step handling
      window.dispatchEvent(new CustomEvent('tps:submission-selected', {
        detail: {
          submissionType: type,
          clientType: this.clientType
        }
      }));
    }
  }

  // Event Management
  class EventManager {
    constructor() {
      this.init();
    }
    
    init() {
      this.bindGlobalEvents();
    }
    
    bindGlobalEvents() {
      // Handle theme change events
      window.addEventListener('tps:theme-changed', (e) => {
        console.log('Theme changed to:', e.detail.theme);
      });
      
      // Handle submission selection
      window.addEventListener('tps:submission-selected', (e) => {
        console.log('Submission selected:', e.detail);
        // Future: Navigate to appropriate step based on selection
      });
      
      // Handle custom events for opening modals
      window.addEventListener('tps:open-auth-modal', () => {
        console.log('Auth modal requested');
      });
    }
  }

  // Accessibility Enhancements
  class AccessibilityManager {
    constructor() {
      this.init();
    }
    
    init() {
      this.enhanceFocusVisibility();
      this.addLiveRegions();
    }
    
    enhanceFocusVisibility() {
      // Ensure focus is visible for keyboard users
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.add('keyboard-navigation');
        }
      });
      
      document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
      });
    }
    
    addLiveRegions() {
      // Add live region for dynamic announcements
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'tps-sr-only';
      liveRegion.id = 'tps-live-region';
      
      const root = document.querySelector('#tps-root');
      if (root) {
        root.appendChild(liveRegion);
      }
    }
    
    announce(message) {
      const liveRegion = document.getElementById('tps-live-region');
      if (liveRegion) {
        liveRegion.textContent = message;
      }
    }
  }

  // Main App Initialization
  class TechPackStudio {
    constructor() {
      this.theme = null;
      this.modal = null;
      this.events = null;
      this.a11y = null;
      
      this.init();
    }
    
    init() {
      // Initialize all managers
      this.theme = new ThemeManager();
      this.modal = new ModalManager();
      this.events = new EventManager();
      this.a11y = new AccessibilityManager();
      
      console.log('TechPack Studio v10 initialized successfully');
      
      // Expose public API
      this.exposeAPI();
    }
    
    exposeAPI() {
      // Expose global TPS object for theme management
      window.TPS = {
        setTheme: (theme) => {
          if (['light', 'dark'].includes(theme)) {
            this.theme.applyTheme(theme);
          }
        },
        getTheme: () => this.theme.getTheme(),
        openModal: (modalId) => this.modal.openModal(modalId),
        closeModal: () => this.modal.closeModal(),
        announce: (message) => this.a11y.announce(message)
      };
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new TechPackStudio();
    });
  } else {
    new TechPackStudio();
  }

}