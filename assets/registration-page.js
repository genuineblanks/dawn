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
        this.updateSubmitButton(); // Update button state on country change
      });
      this.updateVatRequirement(); // Initial check
      this.updatePhonePrefix(); // Initial check
    }

    // Real-time validation
    const inputs = this.form.querySelectorAll('.registration-page-input, .registration-page-select');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.updateSubmitButton()); // Real-time button state
      input.addEventListener('blur', () => this.validateField(input));
    });

    // Success modal handlers
    this.setupModalHandlers();

    // Initial button state on page load
    this.updateSubmitButton();
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

      // Shopify Customer API via Vercel Edge Function
      const SHOPIFY_REGISTRATION_URL = '/api/shopify-registration';

      console.log('📤 Sending registration to Shopify...');

      // Submit to Shopify via Vercel Edge Function
      const response = await fetch(SHOPIFY_REGISTRATION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      // Parse response
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Registration failed');
      }

      console.log('✅ Customer created in Shopify:', result.customer_id);

      // Show success modal
      this.showSuccessModal();

    } catch (error) {
      console.error('❌ Registration error:', error);

      // Show user-friendly error message
      let errorMessage = 'Registration failed. Please try again.';
      if (error.message.includes('Email already registered')) {
        errorMessage = 'This email is already registered. Please use a different email or contact support.';
      }

      alert(errorMessage);
      this.submitButton.disabled = false;
      this.submitButton.querySelector('span').textContent = originalText;
    }
  },

  // Setup modal handlers
  setupModalHandlers() {
    const closeButton = document.getElementById('modal-close');
    const homepageButton = document.getElementById('modal-homepage');
    const garmentStudioButton = document.getElementById('modal-garment-studio');

    if (closeButton) {
      closeButton.addEventListener('click', () => this.hideSuccessModal());
    }

    if (homepageButton) {
      homepageButton.addEventListener('click', () => {
        console.log('📍 Redirecting to homepage...');
        window.location.href = '/';
      });
    }

    if (garmentStudioButton) {
      garmentStudioButton.addEventListener('click', () => {
        console.log('📍 Redirecting to Garment Studio...');
        window.location.href = 'https://www.genuineblanks.com/pages/tech-pack-submission';
      });
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
  },

  // Real-time submit button validation
  updateSubmitButton() {
    const requiredFields = this.form.querySelectorAll('[required]');
    let allValid = true;

    requiredFields.forEach(field => {
      const value = field.value.trim();

      // Empty check
      if (!value) {
        allValid = false;
        return;
      }

      // Email validation
      if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          allValid = false;
          return;
        }
      }

      // Phone validation
      if (field.id === 'phone') {
        const digitCount = value.replace(/\D/g, '').length;
        if (digitCount < 6) {
          allValid = false;
          return;
        }
      }
    });

    this.submitButton.disabled = !allValid;
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => RegistrationPage.init());
} else {
  RegistrationPage.init();
}
