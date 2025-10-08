/**
 * V10 Login Modal Controller
 * Handles modal interactions for Retail vs Wholesale account selection
 */

const V10_LoginModal = {
  modal: null,
  closeButton: null,
  overlay: null,

  init() {
    this.modal = document.getElementById('v10-login-modal');
    this.closeButton = document.getElementById('v10-login-modal-close');
    this.overlay = this.modal;

    if (!this.modal) {
      console.warn('⚠️ V10 Login Modal not found');
      return;
    }

    this.setupEventListeners();
    this.interceptRegistrationLinks();
    console.log('✅ V10 Login Modal initialized');
  },

  setupEventListeners() {
    // Close button
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.close());
    }

    // Click outside modal to close
    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  },

  /**
   * Intercept all "Create Account" / "Register" / "Sign Up" links
   * and show modal instead of direct navigation
   */
  interceptRegistrationLinks() {
    // Common selectors for registration links
    const selectors = [
      'a[href*="/account/register"]',
      'a[href*="/account/signup"]',
      'a[href*="customer_register"]',
      '.header__account-link[href*="register"]',
      '.customer-register-link',
      '#customer_register_link',
    ];

    selectors.forEach(selector => {
      const links = document.querySelectorAll(selector);
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          // Don't intercept clicks from links INSIDE the modal
          // (Retail/Wholesale buttons should navigate directly)
          if (link.closest('#v10-login-modal')) {
            console.log('📍 Modal button clicked - allowing navigation');
            return; // Let it navigate normally
          }

          // Intercept external registration links - show modal instead
          e.preventDefault();
          console.log('🔗 External registration link intercepted - showing modal');
          this.open();
        });
      });
    });

    console.log(`🔗 Intercepted ${document.querySelectorAll(selectors.join(', ')).length} registration links`);
  },

  /**
   * Open modal
   */
  open() {
    if (!this.modal) return;

    this.modal.style.display = 'flex';

    // Trigger animation after display change
    requestAnimationFrame(() => {
      this.modal.classList.add('show');
    });

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    console.log('🔓 Login modal opened');
  },

  /**
   * Close modal
   */
  close() {
    if (!this.modal) return;

    this.modal.classList.remove('show');

    // Hide after animation completes
    setTimeout(() => {
      this.modal.style.display = 'none';
    }, 300);

    // Restore body scroll
    document.body.style.overflow = '';

    console.log('🔒 Login modal closed');
  },

  /**
   * Check if modal is open
   */
  isOpen() {
    return this.modal && this.modal.classList.contains('show');
  },
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => V10_LoginModal.init());
} else {
  V10_LoginModal.init();
}

// Expose globally for manual triggering if needed
window.V10_LoginModal = V10_LoginModal;
