/* ====================================================
   V10 REGISTRATION - INTEGRATED WITH EXISTING V10 SYSTEM
   Extends V10 TechPack system for registration functionality
   ==================================================== */

// Guard clause to prevent multiple initializations
if (typeof V10_Registration === 'undefined') {

const V10_Registration = {
  form: null,
  submitButton: null,
  termsCheckbox: null,
  termsModal: null,
  
  // Initialize the registration system
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initialize());
    } else {
      this.initialize();
    }
  },
  
  // Main initialization function
  initialize() {
    this.form = document.getElementById('v10-registration-form');
    this.submitButton = this.form?.querySelector('.v10-btn-hero');
    this.termsCheckbox = document.getElementById('RegisterForm-Terms');
    this.termsModal = document.getElementById('v10-terms-modal');
    
    if (!this.form) {
      console.log('V10 Registration: Form not found, skipping initialization');
      return;
    }
    
    // Clean form state on initialization
    this.initializeCleanState();
    
    // Initialize form validation
    this.initializeFormValidation();
    
    // Initialize terms modal
    this.initializeTermsModal();
    
    // Initialize form enhancement
    this.initializeFormEnhancements();
    
    // Set initial button state
    this.updateSubmitButton();
    
    console.log('🔐 V10 Registration system initialized');
  },
  
  // Initialize clean form state
  initializeCleanState() {
    // Remove any existing validation classes and styles
    const allInputs = this.form.querySelectorAll('input, select');
    allInputs.forEach(input => {
      input.classList.remove('error', 'success');
      input.style.borderColor = '';
      input.style.boxShadow = '';
      
      // Remove any existing error messages
      const errorElement = input.parentElement.querySelector('.v10-field-error');
      if (errorElement) {
        errorElement.remove();
      }
    });
    
    // Remove any existing submission messages
    const existingMessages = this.form.querySelectorAll('.v10-success-message, .v10-submission-error');
    existingMessages.forEach(message => message.remove());
    
    // Clear terms checkbox error if it exists
    if (this.termsCheckbox) {
      this.clearFieldError(this.termsCheckbox);
    }
  },
  
  // Initialize form validation
  initializeFormValidation() {
    // Only clear errors on input, don't validate until submission attempt
    const inputs = this.form.querySelectorAll('input, select');
    inputs.forEach(input => {
      // Only clear errors, don't validate on blur
      input.addEventListener('input', () => this.clearFieldError(input));
      input.addEventListener('focus', () => this.clearFieldError(input));
    });
    
    // Form submission validation
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Terms checkbox - only update button state, don't show validation errors
    if (this.termsCheckbox) {
      this.termsCheckbox.addEventListener('change', () => {
        this.clearFieldError(this.termsCheckbox);
        this.updateSubmitButton();
      });
    }
  },
  
  // Initialize terms modal
  initializeTermsModal() {
    const termsLink = document.querySelector('.v10-link-button[data-modal="v10-terms-modal"]');
    if (termsLink && this.termsModal) {
      termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.showTermsModal();
      });
      
      // Close modal functionality
      const closeButtons = this.termsModal.querySelectorAll('.v10-terms-close-btn, .v10-terms-close');
      closeButtons.forEach(button => {
        button.addEventListener('click', () => this.hideTermsModal());
      });
      
      // Accept button functionality
      const acceptButton = this.termsModal.querySelector('.v10-terms-accept');
      if (acceptButton && this.termsCheckbox) {
        acceptButton.addEventListener('click', () => {
          this.termsCheckbox.checked = true;
          // Trigger change event for validation
          const changeEvent = new Event('change', { bubbles: true });
          this.termsCheckbox.dispatchEvent(changeEvent);
          this.hideTermsModal();
        });
      }
      
      // Close modal on backdrop click
      this.termsModal.addEventListener('click', (e) => {
        if (e.target === this.termsModal) {
          this.hideTermsModal();
        }
      });
      
      // Close modal on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.termsModal.classList.contains('show')) {
          this.hideTermsModal();
        }
      });
    }
  },
  
  // Initialize form enhancements
  initializeFormEnhancements() {
    // Auto-format phone numbers
    const phoneInput = document.getElementById('RegisterForm-Phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => this.formatPhoneNumber(e));
    }
    
    // Auto-format postal codes
    const postalInput = document.getElementById('RegisterForm-PostalCode');
    if (postalInput) {
      postalInput.addEventListener('input', (e) => this.formatPostalCode(e));
    }
    
    // Country-specific validation
    const countrySelect = document.getElementById('RegisterForm-Country');
    const vatInput = document.getElementById('RegisterForm-VatNumber');
    if (countrySelect && vatInput) {
      countrySelect.addEventListener('change', () => this.updateVatValidation());
    }
    
    // Password strength indicator
    const passwordInput = document.getElementById('RegisterForm-Password');
    if (passwordInput) {
      passwordInput.addEventListener('input', () => this.updatePasswordStrength());
    }
  },
  
  // Validate individual field
  validateField(field) {
    const fieldType = field.type;
    const fieldValue = field.value.trim();
    const fieldId = field.id;
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous errors
    this.clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !fieldValue) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    
    // Email validation
    else if (fieldType === 'email' && fieldValue) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(fieldValue)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    
    // Password validation
    else if (fieldId === 'RegisterForm-Password' && fieldValue) {
      if (fieldValue.length < 5) {
        isValid = false;
        errorMessage = 'Password must be at least 5 characters long';
      }
    }
    
    // Phone validation
    else if (fieldId === 'RegisterForm-Phone' && fieldValue) {
      const phoneRegex = /^[\+]?[0-9\-\s\(\)]{10,}$/;
      if (!phoneRegex.test(fieldValue)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }
    
    // VAT number validation (basic)
    else if (fieldId === 'RegisterForm-VatNumber' && fieldValue) {
      if (fieldValue.length < 5) {
        isValid = false;
        errorMessage = 'Please enter a valid VAT/EIN/SSN number';
      }
    }
    
    // Address field validation
    else if (fieldId === 'RegisterForm-City' && fieldValue) {
      if (fieldValue.length < 2) {
        isValid = false;
        errorMessage = 'Please enter a valid city name';
      }
    }
    
    else if (fieldId === 'RegisterForm-State' && fieldValue) {
      if (fieldValue.length < 2) {
        isValid = false;
        errorMessage = 'Please enter a valid state/province';
      }
    }
    
    else if (fieldId === 'RegisterForm-PostalCode' && fieldValue) {
      // Basic postal code validation - should have at least 3 characters
      if (fieldValue.length < 3) {
        isValid = false;
        errorMessage = 'Please enter a valid postal code';
      }
    }
    
    // URL validation
    else if (fieldType === 'url' && fieldValue) {
      try {
        new URL(fieldValue.startsWith('http') ? fieldValue : `https://${fieldValue}`);
      } catch {
        isValid = false;
        errorMessage = 'Please enter a valid website URL';
      }
    }
    
    // Show error if validation failed
    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }
    
    return isValid;
  },
  
  // Validate terms checkbox
  validateTermsCheckbox() {
    const isChecked = this.termsCheckbox?.checked;
    
    if (!isChecked) {
      this.showFieldError(this.termsCheckbox, 'You must agree to the Terms & Conditions');
      return false;
    } else {
      this.clearFieldError(this.termsCheckbox);
      return true;
    }
  },
  
  // Show field error
  showFieldError(field, message) {
    field.classList.add('error');
    field.style.borderColor = '#f97316';
    field.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1)';
    
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.v10-field-error');
    if (existingError) {
      existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'v10-field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
      color: #f97316;
      font-size: 0.75rem;
      margin-top: 0.25rem;
      display: block;
      font-weight: 500;
    `;
    
    field.parentElement.appendChild(errorElement);
  },
  
  // Clear field error
  clearFieldError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';
    
    const errorElement = field.parentElement.querySelector('.v10-field-error');
    if (errorElement) {
      errorElement.remove();
    }
  },
  
  // Handle form submission
  handleSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const inputs = this.form.querySelectorAll('input[required], select[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });
    
    // Validate terms checkbox
    if (!this.validateTermsCheckbox()) {
      isFormValid = false;
    }
    
    if (!isFormValid) {
      // Scroll to first error
      const firstError = this.form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Show loading state
    this.setLoadingState(true);
    
    // Submit form data
    this.submitForm();
  },
  
  // Submit form data
  async submitForm() {
    try {
      // Create FormData object
      const formData = new FormData(this.form);
      
      // Submit to Shopify
      const response = await fetch(this.form.action || '/account', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      if (response.ok) {
        // Success - redirect or show success message
        this.showSuccessMessage();
        setTimeout(() => {
          window.location.href = '/account/login';
        }, 2000);
      } else {
        // Handle server errors
        const errorText = await response.text();
        this.showSubmissionError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      this.showSubmissionError('Registration failed. Please check your connection and try again.');
    } finally {
      this.setLoadingState(false);
    }
  },
  
  // Set loading state
  setLoadingState(loading) {
    this.form.classList.toggle('loading', loading);
    this.submitButton.classList.toggle('loading', loading);
    this.submitButton.disabled = loading;
    
    if (loading) {
      this.submitButton.querySelector('span').textContent = 'Processing...';
    } else {
      this.submitButton.querySelector('span').textContent = 'Welcome to Genuineblanks';
    }
  },
  
  // Show success message
  showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'v10-success-message';
    successMessage.innerHTML = `
      <div style="
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.3);
        color: #059669;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        text-align: center;
        font-weight: 500;
        box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.1);
      ">
        ✅ Registration successful! Redirecting to login...
      </div>
    `;
    
    this.form.insertBefore(successMessage, this.form.firstChild);
  },
  
  // Show submission error
  showSubmissionError(message) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'v10-submission-error';
    errorMessage.innerHTML = `
      <div style="
        background: rgba(249, 115, 22, 0.1);
        border: 1px solid rgba(249, 115, 22, 0.3);
        color: #f97316;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        text-align: center;
        font-weight: 500;
        box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.1);
      ">
        ❌ ${message}
      </div>
    `;
    
    this.form.insertBefore(errorMessage, this.form.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorMessage.parentElement) {
        errorMessage.remove();
      }
    }, 5000);
  },
  
  // Show terms modal
  showTermsModal() {
    if (this.termsModal) {
      this.termsModal.classList.add('show');
      this.termsModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Force grid layout check and fallback
      setTimeout(() => {
        this.ensureGridLayout();
      }, 100);
      
      // Focus trap
      const focusableElements = this.termsModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length) {
        focusableElements[0].focus();
      }
      
      console.log('📄 Terms modal opened');
    }
  },
  
  // Hide terms modal
  hideTermsModal() {
    if (this.termsModal) {
      this.termsModal.classList.remove('show');
      this.termsModal.style.display = 'none';
      document.body.style.overflow = '';
      
      console.log('📄 Terms modal closed');
    }
  },
  
  // Format phone number
  formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 10) {
      value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 6) {
      value = value.replace(/(\d{3})(\d{3})/, '($1) $2-');
    } else if (value.length >= 3) {
      value = value.replace(/(\d{3})/, '($1) ');
    }
    e.target.value = value;
  },
  
  // Format postal code
  formatPostalCode(e) {
    const countrySelect = document.getElementById('RegisterForm-Country');
    const selectedCountry = countrySelect?.value || 'US';
    let value = e.target.value.toUpperCase();
    
    switch (selectedCountry) {
      case 'US':
        // US ZIP code format: 12345 or 12345-6789
        value = value.replace(/\D/g, ''); // Remove non-digits
        if (value.length > 5) {
          value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }
        break;
        
      case 'CA':
        // Canadian postal code format: K1A 0A9
        value = value.replace(/[^A-Z0-9]/g, ''); // Remove non-alphanumeric
        if (value.length > 3) {
          value = value.replace(/([A-Z]\d[A-Z])(\d[A-Z]\d)/, '$1 $2');
        }
        break;
        
      case 'GB':
        // UK postcode format: SW1A 1AA
        value = value.replace(/[^A-Z0-9]/g, '');
        if (value.length > 4) {
          // Simple format - add space before last 3 characters
          const len = value.length;
          value = value.substring(0, len - 3) + ' ' + value.substring(len - 3);
        }
        break;
        
      default:
        // For other countries, just uppercase and remove excessive spaces
        value = value.replace(/\s+/g, ' ').trim();
    }
    
    e.target.value = value;
  },
  
  // Update VAT validation based on country
  updateVatValidation() {
    const countrySelect = document.getElementById('RegisterForm-Country');
    const vatInput = document.getElementById('RegisterForm-VatNumber');
    const postalInput = document.getElementById('RegisterForm-PostalCode');
    const stateInput = document.getElementById('RegisterForm-State');
    
    if (!countrySelect || !vatInput) return;
    
    const selectedCountry = countrySelect.value;
    const isEuropean = ['PT', 'ES', 'FR', 'DE', 'IT', 'NL', 'BE', 'AT', 'SE', 'DK', 'FI'].includes(selectedCountry);
    
    // Update VAT input placeholder
    if (isEuropean) {
      vatInput.placeholder = 'European businesses must provide a VAT number';
    } else if (selectedCountry === 'US') {
      vatInput.placeholder = 'EIN or SSN number';
    } else {
      vatInput.placeholder = 'Business registration number or tax ID';
    }
    
    // Update postal code placeholder based on country
    if (postalInput) {
      switch (selectedCountry) {
        case 'US':
          postalInput.placeholder = 'ZIP Code (e.g. 12345)';
          break;
        case 'CA':
          postalInput.placeholder = 'Postal Code (e.g. K1A 0A9)';
          break;
        case 'GB':
          postalInput.placeholder = 'Postcode (e.g. SW1A 1AA)';
          break;
        default:
          postalInput.placeholder = 'Postal Code';
      }
    }
    
    // Update state field label and placeholder based on country
    if (stateInput) {
      const stateLabel = stateInput.previousElementSibling;
      switch (selectedCountry) {
        case 'US':
        case 'CA':
          if (stateLabel) stateLabel.textContent = 'State/Province';
          stateInput.placeholder = 'State/Province';
          break;
        case 'GB':
          if (stateLabel) stateLabel.textContent = 'County';
          stateInput.placeholder = 'County';
          break;
        default:
          if (stateLabel) stateLabel.textContent = 'State/Province/Region';
          stateInput.placeholder = 'State/Province/Region';
      }
    }
  },
  
  // Update password strength
  updatePasswordStrength() {
    const passwordInput = document.getElementById('RegisterForm-Password');
    const password = passwordInput.value;
    
    // Remove existing strength indicator
    const existingIndicator = passwordInput.parentElement.querySelector('.v10-password-strength');
    if (existingIndicator) {
      existingIndicator.remove();
    }
    
    if (password.length === 0) return;
    
    let strength = 0;
    let strengthText = '';
    let strengthColor = '';
    
    if (password.length >= 5) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    switch (strength) {
      case 0:
      case 1:
        strengthText = 'Weak';
        strengthColor = '#f97316';
        break;
      case 2:
      case 3:
        strengthText = 'Medium';
        strengthColor = '#f59e0b';
        break;
      case 4:
      case 5:
        strengthText = 'Strong';
        strengthColor = '#059669';
        break;
    }
    
    const strengthIndicator = document.createElement('div');
    strengthIndicator.className = 'v10-password-strength';
    strengthIndicator.style.cssText = `
      font-size: 0.75rem;
      color: ${strengthColor};
      margin-top: 0.25rem;
      font-weight: 500;
    `;
    strengthIndicator.textContent = `Password strength: ${strengthText}`;
    
    passwordInput.parentElement.appendChild(strengthIndicator);
  },
  
  // Update submit button state
  updateSubmitButton() {
    const isTermsChecked = this.termsCheckbox?.checked;
    
    if (this.submitButton) {
      // Button is only enabled when terms are checked
      this.submitButton.disabled = !isTermsChecked;
      
      // Visual feedback
      if (isTermsChecked) {
        this.submitButton.classList.remove('disabled');
        this.submitButton.style.opacity = '1';
        this.submitButton.style.cursor = 'pointer';
      } else {
        this.submitButton.classList.add('disabled');
        this.submitButton.style.opacity = '0.5';
        this.submitButton.style.cursor = 'not-allowed';
      }
    }
  },
  
  // Ensure grid layout is working properly
  ensureGridLayout() {
    const termsModal = document.getElementById('v10-terms-modal');
    const sectionsContainer = termsModal?.querySelector('.v10-terms-sections');
    
    if (!sectionsContainer) return;
    
    // Check if grid is working by measuring container width vs section widths
    const containerWidth = sectionsContainer.offsetWidth;
    const sections = sectionsContainer.querySelectorAll('.v10-terms-section:not(.v10-terms-section--full-width)');
    
    if (sections.length >= 2) {
      const firstSection = sections[0];
      const secondSection = sections[1];
      
      // If sections are not side by side (same top position), grid isn't working
      const firstTop = firstSection.offsetTop;
      const secondTop = secondSection.offsetTop;
      const sideBySide = Math.abs(firstTop - secondTop) < 10; // Allow 10px tolerance
      
      if (!sideBySide) {
        console.log('Grid layout not working, applying flexbox fallback');
        sectionsContainer.classList.add('flexbox-fallback');
        
        // Force layout recalculation
        sectionsContainer.style.display = 'none';
        sectionsContainer.offsetHeight; // Trigger reflow
        sectionsContainer.style.display = '';
      } else {
        console.log('Grid layout working correctly');
      }
    }
    
    // Debug info
    console.log('Modal width:', termsModal?.offsetWidth);
    console.log('Container width:', containerWidth);
    console.log('Number of sections:', sections.length);
  }
};

// Initialize when DOM is ready
V10_Registration.init();

// Make available globally
window.V10_Registration = V10_Registration;

} // End of guard clause