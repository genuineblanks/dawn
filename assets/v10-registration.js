/* ====================================================
   V10 REGISTRATION - FORM VALIDATION & THEME MANAGEMENT
   Premium registration system with enhanced UX
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
    this.submitButton = this.form?.querySelector('.v10-btn--submit');
    this.termsCheckbox = document.getElementById('RegisterForm-Terms');
    this.termsModal = document.getElementById('v10-terms-modal');
    
    if (!this.form) {
      console.log('V10 Registration: Form not found, skipping initialization');
      return;
    }
    
    // Initialize theme system
    this.initializeTheme();
    
    // Initialize form validation
    this.initializeFormValidation();
    
    // Initialize terms modal
    this.initializeTermsModal();
    
    // Initialize form enhancement
    this.initializeFormEnhancements();
    
    console.log('🔐 V10 Registration system initialized');
  },
  
  // Initialize theme management
  initializeTheme() {
    // Set initial theme from localStorage or default to light
    const savedTheme = localStorage.getItem('v10-theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    // Update theme toggle buttons
    this.updateThemeButtons(savedTheme);
    
    // Add event listeners to theme buttons
    const themeButtons = document.querySelectorAll('.v10-theme-btn');
    themeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const theme = e.currentTarget.getAttribute('data-theme');
        this.setTheme(theme);
      });
    });
  },
  
  // Set theme and update UI
  setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('v10-theme', theme);
    this.updateThemeButtons(theme);
  },
  
  // Update theme button active states
  updateThemeButtons(activeTheme) {
    const themeButtons = document.querySelectorAll('.v10-theme-btn');
    themeButtons.forEach(button => {
      const buttonTheme = button.getAttribute('data-theme');
      button.classList.toggle('active', buttonTheme === activeTheme);
    });
  },
  
  // Initialize form validation
  initializeFormValidation() {
    // Real-time validation on input
    const inputs = this.form.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
    
    // Form submission validation
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Terms checkbox validation
    if (this.termsCheckbox) {
      this.termsCheckbox.addEventListener('change', () => {
        this.validateTermsCheckbox();
        this.updateSubmitButton();
      });
    }
  },
  
  // Initialize terms modal
  initializeTermsModal() {
    const termsLink = document.querySelector('.v10-terms-link');
    if (termsLink && this.termsModal) {
      termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.showTermsModal();
      });
      
      // Close modal functionality
      const closeButtons = this.termsModal.querySelectorAll('.v10-modal-close, .v10-terms-close');
      closeButtons.forEach(button => {
        button.addEventListener('click', () => this.hideTermsModal());
      });
      
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
    field.style.borderColor = 'var(--v10-reg-border-error)';
    
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
      color: var(--v10-reg-border-error);
      font-size: 0.75rem;
      margin-top: 0.25rem;
      display: block;
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
        background: var(--v10-reg-accent-orange-light);
        border: 1px solid var(--v10-reg-accent-orange);
        color: var(--v10-reg-accent-orange-dark);
        padding: 1rem;
        border-radius: 6px;
        margin-bottom: 1rem;
        text-align: center;
        font-weight: 500;
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
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #dc2626;
        padding: 1rem;
        border-radius: 6px;
        margin-bottom: 1rem;
        text-align: center;
        font-weight: 500;
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
      
      // Focus trap
      const focusableElements = this.termsModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length) {
        focusableElements[0].focus();
      }
    }
  },
  
  // Hide terms modal
  hideTermsModal() {
    if (this.termsModal) {
      this.termsModal.classList.remove('show');
      this.termsModal.style.display = 'none';
      document.body.style.overflow = '';
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
    let value = e.target.value.toUpperCase();
    
    // US ZIP code format
    if (/^\d+$/.test(value.replace('-', ''))) {
      if (value.length > 5) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
      }
    }
    
    e.target.value = value;
  },
  
  // Update VAT validation based on country
  updateVatValidation() {
    const countrySelect = document.getElementById('RegisterForm-Country');
    const vatInput = document.getElementById('RegisterForm-VatNumber');
    const vatLabel = vatInput?.previousElementSibling;
    
    if (!countrySelect || !vatInput || !vatLabel) return;
    
    const selectedCountry = countrySelect.value;
    const isEuropean = ['PT', 'ES', 'FR', 'DE', 'IT', 'NL', 'BE', 'AT', 'SE', 'DK', 'FI'].includes(selectedCountry);
    
    if (isEuropean) {
      vatInput.placeholder = 'European businesses must provide a VAT number';
    } else if (selectedCountry === 'US') {
      vatInput.placeholder = 'EIN or SSN number';
    } else {
      vatInput.placeholder = 'Business registration number or tax ID';
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
        strengthColor = '#ef4444';
        break;
      case 2:
      case 3:
        strengthText = 'Medium';
        strengthColor = '#f97316';
        break;
      case 4:
      case 5:
        strengthText = 'Strong';
        strengthColor = '#10b981';
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
    const hasRequiredFields = Array.from(this.form.querySelectorAll('input[required]'))
      .every(input => input.value.trim() !== '');
    
    if (this.submitButton) {
      this.submitButton.disabled = !isTermsChecked || !hasRequiredFields;
    }
  }
};

// Initialize when DOM is ready
V10_Registration.init();

// Make available globally
window.V10_Registration = V10_Registration;

} // End of guard clause