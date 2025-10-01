/**
 * GenuineBlanks Registration Page JavaScript
 * Clean standalone implementation
 */

const RegistrationPage = {
  // Country phone codes mapping
  countryCodes: {
    'US': '+1',
    'CA': '+1',
    'GB': '+44',
    'PT': '+351',
    'ES': '+34',
    'FR': '+33',
    'DE': '+49',
    'IT': '+39',
    'NL': '+31',
    'BE': '+32',
    'CH': '+41',
    'AT': '+43',
    'SE': '+46',
    'NO': '+47',
    'DK': '+45',
    'FI': '+358',
    'AU': '+61',
    'NZ': '+64',
    'JP': '+81',
    'CN': '+86',
    'OTHER': '+'
  },

  // Initialize
  init() {
    this.form = document.getElementById('registration-form');
    this.submitButton = document.getElementById('submit-button');
    this.countrySelect = document.getElementById('country');
    this.vatField = document.getElementById('vat-field');
    this.vatInput = document.getElementById('vat-number');
    this.vatLabel = document.getElementById('vat-label');
    this.phonePrefix = document.getElementById('phone-prefix');
    this.successModal = document.getElementById('success-modal');

    if (!this.form) return;

    this.setupEventListeners();
    console.log('✅ Registration Page initialized');
  },

  // Setup Event Listeners
  setupEventListeners() {
    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Country change for VAT and phone prefix
    if (this.countrySelect) {
      this.countrySelect.addEventListener('change', () => {
        this.updateVatRequirement();
        this.updatePhonePrefix();
      });
      this.updateVatRequirement(); // Initial check
      this.updatePhonePrefix(); // Initial check
    }

    // Real-time validation
    const inputs = this.form.querySelectorAll('.registration-page-input, .registration-page-select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
    });

    // Success modal handlers
    this.setupModalHandlers();
  },

  // Update VAT requirement based on country
  updateVatRequirement() {
    const country = this.countrySelect.value;
    const euCountries = ['PT', 'ES', 'FR', 'DE', 'IT', 'NL', 'BE', 'AT', 'SE', 'DK', 'FI', 'GB'];
    const isEU = euCountries.includes(country);

    if (isEU) {
      // EU country - make VAT required
      this.vatInput.setAttribute('required', 'required');
      this.vatLabel.innerHTML = 'VAT Number <span class="registration-page-label-hint" style="color: #ef4444; font-weight: 700;">(Required for EU)</span>';
    } else {
      // Non-EU country - make VAT optional
      this.vatInput.removeAttribute('required');
      this.vatLabel.innerHTML = 'VAT Number <span class="registration-page-label-hint">(Optional)</span>';
      this.clearFieldError(this.vatInput);
    }
  },

  // Update phone prefix based on country
  updatePhonePrefix() {
    const country = this.countrySelect.value;
    const prefix = this.countryCodes[country] || '+1';

    if (this.phonePrefix) {
      this.phonePrefix.textContent = prefix;
    }
  },

  // Validate individual field
  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');

    // Clear previous errors
    this.clearFieldError(field);

    // Required field check
    if (required && !value) {
      this.showFieldError(field, 'This field is required');
      return false;
    }

    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showFieldError(field, 'Please enter a valid email address');
        return false;
      }
    }

    // Phone validation - More flexible for international formats
    if (field.id === 'phone' && value) {
      // Accept numbers with optional spaces, dashes, parentheses
      // Must have at least 6 digits (flexible for various international formats)
      const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
      const digitCount = value.replace(/\D/g, '').length;

      if (digitCount < 6 || !phoneRegex.test(value)) {
        this.showFieldError(field, 'Please enter a valid phone number (at least 6 digits)');
        return false;
      }
    }

    // Success state
    field.classList.remove('error');
    return true;
  },

  // Show field error
  showFieldError(field, message) {
    field.classList.add('error');

    // Check if error message already exists
    let errorEl = field.parentElement.querySelector('.registration-page-error-message');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'registration-page-error-message';
      field.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
  },

  // Clear field error
  clearFieldError(field) {
    field.classList.remove('error');
    const errorEl = field.parentElement.querySelector('.registration-page-error-message');
    if (errorEl) {
      errorEl.remove();
    }
  },


  // Handle form submission
  async handleSubmit(e) {
    e.preventDefault();

    // Validate all required fields
    const requiredFields = this.form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      // Scroll to first error
      const firstError = this.form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Disable button and show loading
    this.submitButton.disabled = true;
    const originalText = this.submitButton.querySelector('span').textContent;
    this.submitButton.querySelector('span').textContent = 'Submitting...';

    try {
      // Collect form data
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());

      // Add phone country code prefix
      const phonePrefix = this.phonePrefix ? this.phonePrefix.textContent : '+1';
      data.phone_full = `${phonePrefix} ${data.phone}`;
      data.phone_country_code = phonePrefix;

      // Add timestamp
      data.submitted_at = new Date().toISOString();

      console.log('📋 Registration Form Data:', data);

      // Google Apps Script Web App URL (NEW-REQUEST-ID-SYSTEM.js)
      // Same URL as your TechPack V10 system
      const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyw72CpJ1Au7M8gH4U4ZYZv-BbBoGwCCWOTWdt1xS6SNZY6icNZK85V6GjcHuMDFK1SjQ/exec';

      // Prepare data for Apps Script with action
      const registrationPayload = {
        action: 'storeRegistration',
        ...data
      };

      console.log('📤 Sending registration to Apps Script:', registrationPayload);

      // Submit to Google Sheets via Apps Script
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Important for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationPayload)
      });

      // Note: no-cors mode doesn't allow reading response, so we assume success
      console.log('✅ Registration submitted to Google Sheets');

      // Show success modal
      this.showSuccessModal();

    } catch (error) {
      console.error('❌ Registration error:', error);
      alert('Registration failed. Please try again.');
      this.submitButton.disabled = false;
      this.submitButton.querySelector('span').textContent = originalText;
    }
  },

  // Setup modal handlers
  setupModalHandlers() {
    const closeButton = document.getElementById('modal-close');
    const continueButton = document.getElementById('modal-continue');

    if (closeButton) {
      closeButton.addEventListener('click', () => this.hideSuccessModal());
    }

    if (continueButton) {
      continueButton.addEventListener('click', () => this.hideSuccessModal());
    }

    // Close on backdrop click
    if (this.successModal) {
      this.successModal.addEventListener('click', (e) => {
        if (e.target === this.successModal) {
          this.hideSuccessModal();
        }
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.successModal.classList.contains('show')) {
        this.hideSuccessModal();
      }
    });
  },

  // Show success modal
  showSuccessModal() {
    if (this.successModal) {
      this.successModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  },

  // Hide success modal
  hideSuccessModal() {
    if (this.successModal) {
      this.successModal.classList.remove('show');
      document.body.style.overflow = '';

      // Reset form
      this.form.reset();
      this.updateSubmitButton();

      // Clear all errors
      const errors = this.form.querySelectorAll('.error');
      errors.forEach(el => el.classList.remove('error'));

      const errorMessages = this.form.querySelectorAll('.registration-page-error-message');
      errorMessages.forEach(el => el.remove());
    }
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => RegistrationPage.init());
} else {
  RegistrationPage.init();
}
