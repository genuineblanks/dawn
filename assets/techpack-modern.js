/**
 * Techpack Modern JavaScript
 * Modern Shopify implementation with premium UX
 */

class TechpackModern {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.formData = {};
    this.container = document.querySelector('.techpack-modern');
    
    if (this.container) {
      this.init();
    }
  }

  /**
   * Initialize the application
   */
  init() {
    this.bindEvents();
    this.updateUI();
    console.log('Techpack Modern initialized');
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    const nextBtn = document.getElementById('techpack-next-btn');
    const prevBtn = document.getElementById('techpack-prev-btn');

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.nextStep();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.prevStep();
      });
    }

    // Progress step clicks
    const progressSteps = document.querySelectorAll('.techpack-modern__progress-step');
    progressSteps.forEach((step, index) => {
      step.addEventListener('click', () => {
        const stepNumber = index + 1;
        if (stepNumber <= this.currentStep) {
          this.goToStep(stepNumber);
        }
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.container && this.container.contains(e.target)) {
        if (e.key === 'ArrowRight' && this.currentStep < this.totalSteps) {
          e.preventDefault();
          this.nextStep();
        }
        if (e.key === 'ArrowLeft' && this.currentStep > 1) {
          e.preventDefault();
          this.prevStep();
        }
      }
    });
  }

  /**
   * Navigate to next step
   */
  nextStep() {
    if (this.validateCurrentStep()) {
      if (this.currentStep < this.totalSteps) {
        this.saveCurrentStepData();
        this.currentStep++;
        this.updateUI();
        this.scrollToTop();
      } else {
        // Final step - submit form
        this.submitForm();
      }
    }
  }

  /**
   * Navigate to previous step
   */
  prevStep() {
    if (this.currentStep > 1) {
      this.saveCurrentStepData();
      this.currentStep--;
      this.updateUI();
      this.scrollToTop();
    }
  }

  /**
   * Go to specific step
   */
  goToStep(stepNumber) {
    if (stepNumber >= 1 && stepNumber <= this.totalSteps && stepNumber <= this.currentStep) {
      this.saveCurrentStepData();
      this.currentStep = stepNumber;
      this.updateUI();
      this.scrollToTop();
    }
  }

  /**
   * Update UI to reflect current step
   */
  updateUI() {
    this.updateSteps();
    this.updateProgress();
    this.updateNavigation();
    this.updateAccessibility();
  }

  /**
   * Update step visibility
   */
  updateSteps() {
    const steps = document.querySelectorAll('.techpack-modern__step');
    
    steps.forEach((step, index) => {
      const stepNumber = index + 1;
      if (stepNumber === this.currentStep) {
        step.classList.add('techpack-modern__step--active');
        step.setAttribute('aria-hidden', 'false');
      } else {
        step.classList.remove('techpack-modern__step--active');
        step.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /**
   * Update progress indicator
   */
  updateProgress() {
    const progressSteps = document.querySelectorAll('.techpack-modern__progress-step');
    
    progressSteps.forEach((step, index) => {
      const stepNumber = index + 1;
      
      if (stepNumber === this.currentStep) {
        step.classList.add('techpack-modern__progress-step--active');
        step.setAttribute('aria-current', 'step');
      } else {
        step.classList.remove('techpack-modern__progress-step--active');
        step.removeAttribute('aria-current');
      }
      
      // Add completed state for previous steps
      if (stepNumber < this.currentStep) {
        step.classList.add('techpack-modern__progress-step--completed');
      } else {
        step.classList.remove('techpack-modern__progress-step--completed');
      }
    });
  }

  /**
   * Update navigation buttons
   */
  updateNavigation() {
    const nextBtn = document.getElementById('techpack-next-btn');
    const prevBtn = document.getElementById('techpack-prev-btn');

    // Previous button
    if (prevBtn) {
      prevBtn.disabled = this.currentStep === 1;
      prevBtn.setAttribute('aria-label', `Go to step ${this.currentStep - 1}`);
    }

    // Next button
    if (nextBtn) {
      if (this.currentStep === this.totalSteps) {
        nextBtn.textContent = 'Submit Tech Pack';
        nextBtn.classList.remove('techpack-modern__btn--primary');
        nextBtn.classList.add('techpack-modern__btn--primary');
        nextBtn.setAttribute('aria-label', 'Submit your tech pack');
      } else {
        nextBtn.textContent = 'Next';
        nextBtn.classList.add('techpack-modern__btn--primary');
        nextBtn.setAttribute('aria-label', `Go to step ${this.currentStep + 1}`);
      }
      
      nextBtn.disabled = !this.validateCurrentStep();
    }
  }

  /**
   * Update accessibility attributes
   */
  updateAccessibility() {
    // Update ARIA labels and live regions
    const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
    if (currentStepElement) {
      // Announce step change to screen readers
      this.announceToScreenReader(`Step ${this.currentStep} of ${this.totalSteps}`);
    }
  }

  /**
   * Announce message to screen readers
   */
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Scroll to top of page with smooth animation
   */
  scrollToTop() {
    const headerElement = document.querySelector('.techpack-modern__header');
    if (headerElement) {
      headerElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Validate current step
   */
  validateCurrentStep() {
    switch (this.currentStep) {
      case 1:
        return this.validateStep1();
      case 2:
        return this.validateStep2();
      case 3:
        return this.validateStep3();
      case 4:
        return this.validateStep4();
      default:
        return true;
    }
  }

  /**
   * Step validation methods (to be implemented in future phases)
   */
  validateStep1() {
    // Phase 2: Client info validation
    return true;
  }

  validateStep2() {
    // Phase 3: File upload validation
    return true;
  }

  validateStep3() {
    // Phase 4: Garment specs validation
    return true;
  }

  validateStep4() {
    // Phase 5: Final validation
    return true;
  }

  /**
   * Save current step data
   */
  saveCurrentStepData() {
    const currentStepElement = document.querySelector('.techpack-modern__step--active');
    if (currentStepElement) {
      // Future: Extract form data from current step
      const stepData = this.extractStepData(currentStepElement);
      this.formData[this.currentStep] = stepData;
      console.log(`Step ${this.currentStep} data saved:`, stepData);
    }
  }

  /**
   * Extract form data from step element
   */
  extractStepData(stepElement) {
    const data = {};
    
    // Extract form inputs
    const inputs = stepElement.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      if (input.name) {
        if (input.type === 'checkbox' || input.type === 'radio') {
          if (input.checked) {
            data[input.name] = input.value;
          }
        } else {
          data[input.name] = input.value;
        }
      }
    });
    
    return data;
  }

  /**
   * Submit form
   */
  submitForm() {
    this.saveCurrentStepData();
    
    // Show loading state
    this.showLoading();
    
    // Prepare submission data
    const submissionData = {
      ...this.getAllData(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    console.log('Submitting tech pack:', submissionData);
    
    // Future: Implement actual submission logic
    setTimeout(() => {
      this.hideLoading();
      this.showSuccess('Tech pack submitted successfully!');
    }, 2000);
  }

  /**
   * Get all form data
   */
  getAllData() {
    return this.formData;
  }

  /**
   * Show loading state
   */
  showLoading() {
    const nextBtn = document.getElementById('techpack-next-btn');
    if (nextBtn) {
      nextBtn.disabled = true;
      nextBtn.innerHTML = '<span>Submitting...</span>';
    }
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    const nextBtn = document.getElementById('techpack-next-btn');
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.innerHTML = 'Submit Tech Pack';
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    // Future: Implement toast notification system
    console.error('Error:', message);
    alert(`Error: ${message}`);
  }

  /**
   * Show success message
   */
  showSuccess(message) {
    // Future: Implement toast notification system
    console.log('Success:', message);
    alert(`Success: ${message}`);
  }

  /**
   * Reset application
   */
  reset() {
    this.currentStep = 1;
    this.formData = {};
    this.updateUI();
    this.scrollToTop();
    console.log('Techpack Modern reset');
  }
}

/**
 * Initialize when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize only if we're on a techpack modern page
  const techpackContainer = document.querySelector('.techpack-modern');
  if (techpackContainer) {
    window.techpackModern = new TechpackModern();
  }
});

/**
 * Shopify theme compatibility
 */
if (typeof Shopify !== 'undefined') {
  // Hook into Shopify's section reloading
  document.addEventListener('shopify:section:load', (event) => {
    if (event.detail.sectionId && document.querySelector('.techpack-modern')) {
      window.techpackModern = new TechpackModern();
    }
  });
}