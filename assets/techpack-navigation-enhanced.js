// TECHPACK NAVIGATION ENHANCED SYSTEM
// Fixes mobile button issues and provides robust event handling

class TechpackNavigationManager {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.isNavigating = false;
    this.validationInProgress = false;
    this.keyboardHeight = 0;
    this.isMobile = window.innerWidth <= 768;
    this.lastScrollY = 0;
    this.navigationHideTimeout = null;
    
    // DOM element cache
    this.elements = {
      progress: null,
      navigation: null,
      nextBtn: null,
      prevBtn: null,
      steps: [],
      form: null
    };
    
    this.init();
  }

  /* 
  ===========================================
  INITIALIZATION & DOM SETUP
  ===========================================
  */

  init() {
    // Wait for DOM to be fully ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.cacheElements();
    this.setupEventListeners();
    this.setupKeyboardHandling();
    this.setupNavigationButtons();
    this.setupScrollBehavior();
    this.detectInitialState();
    
    console.log('🚀 Techpack Navigation Enhanced - Ready');
  }

  cacheElements() {
    // Cache all DOM elements with fallbacks
    this.elements.progress = document.querySelector('.techpack-progress');
    this.elements.navigation = document.querySelector('.techpack-form__actions');
    this.elements.form = document.querySelector('.techpack-form, .tech-pack-form');
    this.elements.steps = Array.from(document.querySelectorAll('.techpack-step, .step'));
    
    // Try multiple selectors for navigation buttons
    this.elements.nextBtn = this.findNavigationButton(['#next-step-btn', '[data-action="next"]', '.btn-primary', 'button[type="submit"]']);
    this.elements.prevBtn = this.findNavigationButton(['#prev-step-btn', '[data-action="prev"]', '.btn-secondary']);
    
    // Create button group if buttons exist but no container
    if ((this.elements.nextBtn || this.elements.prevBtn) && this.elements.navigation) {
      this.ensureButtonGroup();
    }
  }

  findNavigationButton(selectors) {
    for (const selector of selectors) {
      const btn = document.querySelector(selector);
      if (btn) return btn;
    }
    return null;
  }

  ensureButtonGroup() {
    if (!this.elements.navigation.querySelector('.btn-group')) {
      const btnGroup = document.createElement('div');
      btnGroup.className = 'btn-group';
      
      // Move all buttons into the group
      const buttons = this.elements.navigation.querySelectorAll('button');
      buttons.forEach(btn => btnGroup.appendChild(btn));
      
      this.elements.navigation.appendChild(btnGroup);
    }
  }

  /* 
  ===========================================
  EVENT LISTENERS SETUP
  ===========================================
  */

  setupEventListeners() {
    // Navigation button events with retry mechanism
    this.attachButtonEvents();
    
    // Form events
    if (this.elements.form) {
      this.elements.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
      this.elements.form.addEventListener('input', () => this.validateCurrentStep());
    }

    // Window events
    window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleOrientationChange(), 500);
    });

    // Retry mechanism for missing elements
    setTimeout(() => this.retryElementBinding(), 1000);
    setTimeout(() => this.retryElementBinding(), 3000);
  }

  attachButtonEvents() {
    // Next button events
    if (this.elements.nextBtn) {
      this.elements.nextBtn.addEventListener('click', (e) => this.handleNextClick(e));
      this.elements.nextBtn.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    }

    // Previous button events  
    if (this.elements.prevBtn) {
      this.elements.prevBtn.addEventListener('click', (e) => this.handlePrevClick(e));
      this.elements.prevBtn.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  retryElementBinding() {
    // Re-cache elements that might have been dynamically created
    const originalNextBtn = this.elements.nextBtn;
    const originalPrevBtn = this.elements.prevBtn;
    
    this.cacheElements();
    
    // Attach events if new buttons found
    if (!originalNextBtn && this.elements.nextBtn) {
      this.elements.nextBtn.addEventListener('click', (e) => this.handleNextClick(e));
      this.elements.nextBtn.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    }
    
    if (!originalPrevBtn && this.elements.prevBtn) {
      this.elements.prevBtn.addEventListener('click', (e) => this.handlePrevClick(e));
      this.elements.prevBtn.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    }
  }

  /* 
  ===========================================
  NAVIGATION BUTTON HANDLERS
  ===========================================
  */

  handleNextClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (this.isNavigating) {
      console.log('Navigation in progress, ignoring click');
      return;
    }
    
    this.nextStep();
  }

  handlePrevClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (this.isNavigating) {
      console.log('Navigation in progress, ignoring click');
      return;
    }
    
    this.prevStep();
  }

  handleTouchStart(e) {
    // Add visual feedback for touch
    const button = e.target.closest('button');
    if (button) {
      button.style.transform = 'scale(0.98)';
      setTimeout(() => {
        button.style.transform = '';
      }, 150);
    }
  }

  handleKeyDown(e) {
    // Keyboard navigation support
    if (e.altKey) {
      if (e.key === 'ArrowRight' || e.key === 'n') {
        e.preventDefault();
        this.nextStep();
      } else if (e.key === 'ArrowLeft' || e.key === 'p') {
        e.preventDefault();
        this.prevStep();
      }
    }
  }

  /* 
  ===========================================
  STEP NAVIGATION LOGIC
  ===========================================
  */

  async nextStep() {
    if (this.isNavigating || this.currentStep >= this.totalSteps) return;
    
    try {
      this.isNavigating = true;
      this.setButtonLoading(this.elements.nextBtn, true);
      
      // Validate current step
      const isValid = await this.validateCurrentStep();
      if (!isValid) {
        this.showValidationErrors();
        return;
      }
      
      // Navigate to next step
      const nextStep = this.currentStep + 1;
      await this.navigateToStep(nextStep);
      
    } catch (error) {
      console.error('Error navigating to next step:', error);
      this.showErrorMessage('Navigation failed. Please try again.');
    } finally {
      this.isNavigating = false;
      this.setButtonLoading(this.elements.nextBtn, false);
    }
  }

  async prevStep() {
    if (this.isNavigating || this.currentStep <= 1) return;
    
    try {
      this.isNavigating = true;
      this.setButtonLoading(this.elements.prevBtn, true);
      
      const prevStep = this.currentStep - 1;
      await this.navigateToStep(prevStep);
      
    } catch (error) {
      console.error('Error navigating to previous step:', error);
      this.showErrorMessage('Navigation failed. Please try again.');
    } finally {
      this.isNavigating = false;
      this.setButtonLoading(this.elements.prevBtn, false);
    }
  }

  async navigateToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > this.totalSteps) return;
    
    const currentStepEl = document.querySelector(`[data-step="${this.currentStep}"], .step:nth-child(${this.currentStep})`);
    const nextStepEl = document.querySelector(`[data-step="${stepNumber}"], .step:nth-child(${stepNumber})`);
    
    // Update step visibility
    if (currentStepEl) {
      currentStepEl.classList.add('step-exit');
      setTimeout(() => {
        currentStepEl.style.display = 'none';
        currentStepEl.classList.remove('active', 'step-exit');
      }, 300);
    }
    
    if (nextStepEl) {
      nextStepEl.style.display = 'block';
      nextStepEl.classList.add('step-enter');
      setTimeout(() => {
        nextStepEl.classList.remove('step-enter');
        nextStepEl.classList.add('active');
      }, 50);
    }
    
    // Update state
    this.currentStep = stepNumber;
    this.updateProgress();
    this.updateButtonStates();
    
    // Scroll to top of new step
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Dispatch event for other components
    this.dispatchStepChangeEvent(stepNumber);
    
    // Analytics/tracking
    this.trackStepChange(stepNumber);
  }

  /* 
  ===========================================
  FORM VALIDATION
  ===========================================
  */

  async validateCurrentStep() {
    if (this.validationInProgress) return false;
    
    try {
      this.validationInProgress = true;
      
      const currentStepEl = document.querySelector(`[data-step="${this.currentStep}"], .step:nth-child(${this.currentStep})`);
      if (!currentStepEl) return true;
      
      const requiredFields = currentStepEl.querySelectorAll('input[required], textarea[required], select[required]');
      let isValid = true;
      const errors = [];
      
      for (const field of requiredFields) {
        const fieldValid = this.validateField(field);
        if (!fieldValid) {
          isValid = false;
          errors.push({
            field: field,
            message: this.getFieldErrorMessage(field)
          });
        }
      }
      
      // Custom validation for specific steps
      const customValidation = await this.runCustomValidation(this.currentStep);
      if (!customValidation.valid) {
        isValid = false;
        errors.push(...customValidation.errors);
      }
      
      // Update UI based on validation
      this.updateValidationUI(errors);
      
      return isValid;
      
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    } finally {
      this.validationInProgress = false;
    }
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const isRequired = field.hasAttribute('required');
    
    // Required check
    if (isRequired && !value) return false;
    
    // Type-specific validation
    if (value) {
      switch (type) {
        case 'email':
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        case 'tel':
          return /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''));
        case 'url':
          try {
            new URL(value);
            return true;
          } catch {
            return false;
          }
        default:
          return true;
      }
    }
    
    return true;
  }

  async runCustomValidation(stepNumber) {
    // Step-specific validation logic
    switch (stepNumber) {
      case 1: // Client info
        return this.validateClientInfo();
      case 2: // File upload
        return this.validateFileUpload();
      case 3: // Garment specs
        return this.validateGarmentSpecs();
      case 4: // Review
        return this.validateReview();
      default:
        return { valid: true, errors: [] };
    }
  }

  validateClientInfo() {
    const errors = [];
    
    // Add specific client info validation
    const emailField = document.querySelector('input[type="email"]');
    if (emailField && emailField.value && !this.validateField(emailField)) {
      errors.push({
        field: emailField,
        message: 'Please enter a valid email address'
      });
    }
    
    return { valid: errors.length === 0, errors };
  }

  validateFileUpload() {
    const errors = [];
    
    // Check if files are uploaded
    const fileInputs = document.querySelectorAll('input[type="file"]');
    const hasFiles = Array.from(fileInputs).some(input => input.files.length > 0);
    
    if (!hasFiles) {
      errors.push({
        field: fileInputs[0],
        message: 'Please upload at least one file'
      });
    }
    
    return { valid: errors.length === 0, errors };
  }

  validateGarmentSpecs() {
    // Add garment specification validation
    return { valid: true, errors: [] };
  }

  validateReview() {
    // Final review validation
    return { valid: true, errors: [] };
  }

  /* 
  ===========================================
  UI STATE MANAGEMENT
  ===========================================
  */

  updateProgress() {
    const progressFill = document.querySelector('.techpack-progress__fill, .progress-fill');
    const progressSteps = document.querySelectorAll('.techpack-progress__step, .progress-step');
    
    if (progressFill) {
      const progressPercent = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
      progressFill.style.width = progressPercent + '%';
    }

    progressSteps.forEach((step, index) => {
      step.classList.remove('active', 'completed');
      
      if (index + 1 < this.currentStep) {
        step.classList.add('completed');
      } else if (index + 1 === this.currentStep) {
        step.classList.add('active');
      }
    });
  }

  updateButtonStates() {
    // Update button visibility and text
    if (this.elements.prevBtn) {
      this.elements.prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
    }
    
    if (this.elements.nextBtn) {
      if (this.currentStep === this.totalSteps) {
        this.elements.nextBtn.textContent = 'Submit';
        this.elements.nextBtn.className = 'btn-primary submit-btn';
      } else {
        this.elements.nextBtn.textContent = 'Next Step';
        this.elements.nextBtn.className = 'btn-primary next-btn';
      }
    }
  }

  setButtonLoading(button, loading) {
    if (!button) return;
    
    if (loading) {
      button.classList.add('loading');
      button.disabled = true;
    } else {
      button.classList.remove('loading');
      button.disabled = false;
    }
  }

  /* 
  ===========================================
  KEYBOARD & MOBILE HANDLING
  ===========================================
  */

  setupKeyboardHandling() {
    if (!this.isMobile) return;
    
    // Detect keyboard appearance
    const initialViewportHeight = window.innerHeight;
    
    window.addEventListener('resize', () => {
      const currentViewportHeight = window.innerHeight;
      const heightDifference = initialViewportHeight - currentViewportHeight;
      
      if (heightDifference > 150) {
        // Keyboard is likely open
        this.keyboardHeight = heightDifference;
        document.body.classList.add('keyboard-open');
        this.adjustForKeyboard(true);
      } else {
        // Keyboard is likely closed
        this.keyboardHeight = 0;
        document.body.classList.remove('keyboard-open');
        this.adjustForKeyboard(false);
      }
    });
    
    // Focus handling for form fields
    document.addEventListener('focusin', (e) => {
      if (this.isFormField(e.target)) {
        this.handleFieldFocus(e.target);
      }
    });
    
    document.addEventListener('focusout', (e) => {
      if (this.isFormField(e.target)) {
        this.handleFieldBlur(e.target);
      }
    });
  }

  adjustForKeyboard(keyboardOpen) {
    if (this.elements.navigation) {
      if (keyboardOpen) {
        this.elements.navigation.style.transform = `translateY(-${this.keyboardHeight}px)`;
      } else {
        this.elements.navigation.style.transform = 'translateY(0)';
      }
    }
  }

  handleFieldFocus(field) {
    const fieldGroup = field.closest('.form-group');
    if (fieldGroup) {
      fieldGroup.classList.add('focused');
    }
    
    // Ensure field is visible above keyboard
    setTimeout(() => {
      this.scrollFieldIntoView(field);
    }, 300);
  }

  handleFieldBlur(field) {
    const fieldGroup = field.closest('.form-group');
    if (fieldGroup) {
      fieldGroup.classList.remove('focused');
    }
  }

  scrollFieldIntoView(field) {
    const rect = field.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const keyboardSpace = this.keyboardHeight + 120; // Extra space for navigation
    
    if (rect.bottom > viewportHeight - keyboardSpace) {
      const scrollAmount = rect.bottom - (viewportHeight - keyboardSpace) + 20;
      window.scrollBy({
        top: scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  isFormField(element) {
    return ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName);
  }

  /* 
  ===========================================
  SCROLL BEHAVIOR
  ===========================================
  */

  setupScrollBehavior() {
    if (!this.isMobile) return;
    
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    const scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
    
    // Auto-hide navigation on scroll down, show on scroll up
    if (Math.abs(currentScrollY - this.lastScrollY) > 10) {
      clearTimeout(this.navigationHideTimeout);
      
      if (scrollDirection === 'down' && currentScrollY > 100) {
        this.elements.navigation?.classList.add('nav-hidden');
        this.elements.progress?.classList.add('progress-compact');
      } else if (scrollDirection === 'up') {
        this.elements.navigation?.classList.remove('nav-hidden');
        this.elements.progress?.classList.remove('progress-compact');
      }
      
      // Show navigation after scroll stops
      this.navigationHideTimeout = setTimeout(() => {
        this.elements.navigation?.classList.remove('nav-hidden');
        this.elements.progress?.classList.remove('progress-compact');
      }, 1000);
    }
    
    this.lastScrollY = currentScrollY;
  }

  /* 
  ===========================================
  UTILITY METHODS
  ===========================================
  */

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  handleResize() {
    this.isMobile = window.innerWidth <= 768;
    
    if (this.isMobile) {
      document.body.classList.add('is-mobile');
    } else {
      document.body.classList.remove('is-mobile');
    }
  }

  handleOrientationChange() {
    // Recalculate dimensions after orientation change
    this.handleResize();
    
    // Re-adjust for keyboard if open
    if (document.body.classList.contains('keyboard-open')) {
      setTimeout(() => {
        this.adjustForKeyboard(true);
      }, 500);
    }
  }

  detectInitialState() {
    // Detect current step from URL or DOM
    const urlParams = new URLSearchParams(window.location.search);
    const stepParam = urlParams.get('step');
    
    if (stepParam) {
      this.currentStep = parseInt(stepParam, 10) || 1;
    } else {
      // Detect from active step in DOM
      const activeStep = document.querySelector('.step.active, [data-step].active');
      if (activeStep) {
        this.currentStep = parseInt(activeStep.dataset.step || activeStep.dataset.stepNumber, 10) || 1;
      }
    }
    
    this.updateProgress();
    this.updateButtonStates();
  }

  handleFormSubmit(e) {
    e.preventDefault();
    
    if (this.currentStep === this.totalSteps) {
      // Final submission
      this.submitForm();
    } else {
      // Continue to next step
      this.nextStep();
    }
  }

  async submitForm() {
    try {
      this.setButtonLoading(this.elements.nextBtn, true);
      
      // Final validation
      const isValid = await this.validateCurrentStep();
      if (!isValid) {
        this.showValidationErrors();
        return;
      }
      
      // Simulate form submission (replace with actual logic)
      await this.performFormSubmission();
      
      this.showSuccessMessage('Form submitted successfully!');
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.showErrorMessage('Submission failed. Please try again.');
    } finally {
      this.setButtonLoading(this.elements.nextBtn, false);
    }
  }

  async performFormSubmission() {
    // Replace with actual form submission logic
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

  updateValidationUI(errors) {
    // Clear previous errors
    document.querySelectorAll('.field-error').forEach(el => el.remove());
    document.querySelectorAll('.form-group.error').forEach(el => el.classList.remove('error'));
    
    // Show new errors
    errors.forEach(error => {
      const fieldGroup = error.field.closest('.form-group');
      if (fieldGroup) {
        fieldGroup.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = error.message;
        fieldGroup.appendChild(errorDiv);
      }
    });
  }

  showValidationErrors() {
    const firstError = document.querySelector('.form-group.error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  getFieldErrorMessage(field) {
    const fieldName = field.getAttribute('aria-label') || field.getAttribute('placeholder') || field.name || 'This field';
    return `${fieldName} is required`;
  }

  dispatchStepChangeEvent(stepNumber) {
    const event = new CustomEvent('stepChange', {
      detail: { 
        step: stepNumber, 
        title: this.getStepTitle(stepNumber)
      }
    });
    document.dispatchEvent(event);
  }

  getStepTitle(stepNumber) {
    const titles = {
      1: 'Client Information',
      2: 'File Upload', 
      3: 'Garment Specifications',
      4: 'Review & Submit'
    };
    return titles[stepNumber] || `Step ${stepNumber}`;
  }

  trackStepChange(stepNumber) {
    // Analytics tracking (replace with your analytics service)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'techpack_step_change', {
        step_number: stepNumber,
        step_title: this.getStepTitle(stepNumber)
      });
    }
  }

  showErrorMessage(message) {
    this.showMessage(message, 'error');
  }

  showSuccessMessage(message) {
    this.showMessage(message, 'success');
  }

  showMessage(message, type = 'info') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `techpack-message techpack-message--${type}`;
    messageEl.textContent = message;
    
    // Add to DOM
    document.body.appendChild(messageEl);
    
    // Show with animation
    setTimeout(() => messageEl.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
      messageEl.classList.remove('show');
      setTimeout(() => messageEl.remove(), 300);
    }, 5000);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.techpack-form, .tech-pack-app, .techpack-modern')) {
    window.techpackNavigation = new TechpackNavigationManager();
  }
});

// Export for global access
window.TechpackNavigationManager = TechpackNavigationManager;