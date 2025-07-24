/**
 * TechPack Core Application Controller
 * Main orchestrator for the multi-step TechPack submission form
 * Handles step navigation, initialization, and module coordination
 */

(function() {
  'use strict';

  // Configuration constants
  const CONFIG = {
    MIN_ORDER_QUANTITY_SINGLE_COLORWAY: 30,
    MIN_ORDER_QUANTITY_MULTIPLE_COLORWAY: 20,
    MIN_ORDER_QUANTITY_CUSTOM: 75,
    MIN_COLORWAY_QUANTITY: 50,
    MAX_FILES: 10,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    VALID_FILE_TYPES: ['.pdf', '.ai', '.png', '.jpg', '.jpeg', '.zip'],
    ANIMATION_DURATION: 400,
    DEBOUNCE_DELAY: 300,
    MIN_DELIVERY_WEEKS: 6
  };

  // Utility function for minimum quantity calculation
  function getMinimumQuantity(colorwayCount, productionType) {
    colorwayCount = colorwayCount || 1;
    
    if (!productionType) {
      const productionSelect = document.querySelector('#production-type, select[name="productionType"]');
      productionType = productionSelect ? productionSelect.value : 'our-blanks';
    }
    
    if (productionType === 'our-blanks') {
      return colorwayCount === 1 ? CONFIG.MIN_ORDER_QUANTITY_SINGLE_COLORWAY : CONFIG.MIN_ORDER_QUANTITY_MULTIPLE_COLORWAY;
    }
    
    return colorwayCount === 1 ? CONFIG.MIN_ORDER_QUANTITY_CUSTOM : CONFIG.MIN_COLORWAY_QUANTITY;
  }

  /**
   * Main TechPack Application Class
   * Coordinates all modules and manages the overall application flow
   */
  class TechPackApp {
    constructor() {
      this.state = null;
      this.stepManager = null;
      this.fileManager = null;
      this.garmentManager = null;
      this.ui = null;
      this.mobile = null;
      this.validator = null;
      this.initialized = false;
      
      // DOM references
      this.elements = {
        steps: new Map(),
        progressBar: null,
        progressSteps: null
      };
    }

    /**
     * Initialize the application
     * Sets up all modules and starts the form flow
     */
    async init() {
      try {
        console.log('🚀 Initializing TechPack Application...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
          await new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', resolve);
          });
        }

        // Initialize modules in correct order
        await this.initializeState();
        await this.initializeStepManager();
        await this.initializeModules();
        await this.setupEventListeners();
        await this.startApplication();
        
        this.initialized = true;
        console.log('✅ TechPack Application initialized successfully');
        
      } catch (error) {
        console.error('❌ Failed to initialize TechPack Application:', error);
        this.showError('Failed to initialize the form. Please refresh the page.');
      }
    }

    /**
     * Initialize the state management system
     */
    async initializeState() {
      if (window.TechPackState) {
        this.state = new window.TechPackState();
        console.log('✅ State manager initialized');
      } else {
        throw new Error('TechPackState not available');
      }
    }

    /**
     * Initialize the step manager
     */
    async initializeStepManager() {
      // Cache step elements
      const stepSelectors = [
        '#techpack-step-0',
        '#techpack-step-1', 
        '#techpack-step-2',
        '#techpack-step-3',
        '#techpack-step-4'
      ];

      stepSelectors.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
          this.elements.steps.set(index, element);
        }
      });

      // Cache progress elements
      this.elements.progressBar = document.querySelector('.techpack-progress__fill');
      this.elements.progressSteps = document.querySelectorAll('.techpack-progress__step');

      console.log(`✅ Step manager initialized with ${this.elements.steps.size} steps`);
    }

    /**
     * Initialize all sub-modules
     */
    async initializeModules() {
      // Initialize validator first (other modules depend on it)
      if (window.TechPackValidator) {
        this.validator = new window.TechPackValidator();
        console.log('✅ Validator initialized');
      }

      // Initialize file manager
      if (window.TechPackFileManager) {
        this.fileManager = new window.TechPackFileManager(this.state, this.validator);
        await this.fileManager.init();
        console.log('✅ File manager initialized');
      }

      // Initialize garment manager
      if (window.TechPackGarmentManager) {
        this.garmentManager = new window.TechPackGarmentManager(this.state, this.validator);
        await this.garmentManager.init();
        console.log('✅ Garment manager initialized');
      }

      // Initialize UI manager
      if (window.TechPackUI) {
        this.ui = new window.TechPackUI(this.state);
        await this.ui.init();
        console.log('✅ UI manager initialized');
      }

      // Initialize mobile optimizations
      if (window.TechPackMobile) {
        this.mobile = new window.TechPackMobile();
        await this.mobile.init();
        console.log('✅ Mobile optimizations initialized');
      }
    }

    /**
     * Setup global event listeners
     */
    async setupEventListeners() {
      // Navigation event delegation
      document.addEventListener('click', this.handleNavigation.bind(this));
      
      // Form submission
      document.addEventListener('submit', this.handleFormSubmission.bind(this));
      
      // State change listener
      if (this.state) {
        this.state.subscribe(this.handleStateChange.bind(this));
      }

      // Window events
      window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
      
      console.log('✅ Event listeners setup complete');
    }

    /**
     * Start the application flow
     * Determines initial step and sets up the form
     */
    async startApplication() {
      // Check URL parameters for step
      const urlParams = new URLSearchParams(window.location.search);
      const stepParam = urlParams.get('step');
      
      // Determine starting step
      let initialStep = 0; // Always start with verification
      if (stepParam) {
        const parsedStep = parseInt(stepParam);
        if (!isNaN(parsedStep) && parsedStep >= 0 && parsedStep <= 4) {
          initialStep = parsedStep;
        }
      }

      // Show initial step
      await this.showStep(initialStep);
      
      // Setup the working Step 0 verification system
      this.setupClientModal();
      
      console.log(`✅ Application started at step ${initialStep}`);
    }

    /**
     * Setup client verification modal (preserve existing working functionality)
     */
    setupClientModal() {
      console.log('🔧 Setting up client verification modal...');
      
      const modal = document.querySelector('#client-verification-modal');
      const openBtn = document.querySelector('#open-client-modal');
      const closeBtn = document.querySelector('#close-client-modal');
      const backdrop = document.querySelector('.techpack-modal__backdrop');
      
      if (!modal || !openBtn) {
        console.log('❌ Modal elements not found, skipping modal setup');
        this.showStep(1); // Fallback to step 1
        return;
      }

      // Mobile scroll management
      const isMobile = () => window.innerWidth <= 768;
      let scrollPosition = 0;

      const lockScroll = () => {
        if (isMobile()) {
          scrollPosition = window.pageYOffset;
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.top = `-${scrollPosition}px`;
          document.body.style.width = '100%';
        }
      };

      const unlockScroll = () => {
        if (isMobile()) {
          document.body.style.removeProperty('overflow');
          document.body.style.removeProperty('position');
          document.body.style.removeProperty('top');
          document.body.style.removeProperty('width');
          window.scrollTo(0, scrollPosition);
        }
      };

      // Global scroll unlock failsafe
      window.forceUnlockBodyScroll = unlockScroll;

      // Open modal
      openBtn.addEventListener('click', () => {
        lockScroll();
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        console.log('✅ Client verification modal opened');
      });

      // Close modal function
      const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
          modal.style.display = 'none';
          unlockScroll();
        }, 300);
        console.log('✅ Client verification modal closed');
      };

      // Close modal events
      if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
      }
      
      if (backdrop) {
        backdrop.addEventListener('click', closeModal);
      }

      // Escape key close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
          closeModal();
        }
      });

      // Registration choice handlers
      const handleRegistrationChoice = (isReturning) => {
        // Store registration status in state
        this.state.setClientInfo({ isReturning });
        
        // Show appropriate warning for returning clients
        const warning = document.querySelector('#registration-warning');
        if (warning) {
          warning.style.display = isReturning ? 'block' : 'none';
        }
        
        // Close modal and proceed to Step 1
        setTimeout(() => {
          closeModal();
          setTimeout(() => this.showStep(1), 300);
        }, 1000);
        
        console.log(`✅ Registration choice: ${isReturning ? 'Returning' : 'New'} client`);
      };

      // Registration button handlers
      const yesBtn = document.querySelector('#registration-yes-btn');
      const noBtn = document.querySelector('#registration-no-btn');
      
      if (yesBtn) {
        yesBtn.addEventListener('click', () => handleRegistrationChoice(true));
      }
      
      if (noBtn) {
        noBtn.addEventListener('click', () => handleRegistrationChoice(false));
      }

      console.log('✅ Client verification modal setup complete');
    }

    /**
     * Show specific step
     */
    async showStep(stepNumber) {
      try {
        // Hide all steps
        this.elements.steps.forEach((element, index) => {
          element.style.display = 'none';
        });

        // Show target step
        const targetStep = this.elements.steps.get(stepNumber);
        if (targetStep) {
          targetStep.style.display = 'block';
          
          // Update state
          this.state.setCurrentStep(stepNumber);
          
          // Update progress
          this.updateProgress(stepNumber);
          
          // Update URL
          this.updateURL(stepNumber);
          
          console.log(`✅ Showing step ${stepNumber}`);
          
          return true;
        } else {
          throw new Error(`Step ${stepNumber} not found`);
        }
        
      } catch (error) {
        console.error(`❌ Failed to show step ${stepNumber}:`, error);
        return false;
      }
    }

    /**
     * Update progress bar and indicators
     */
    updateProgress(currentStep) {
      const totalSteps = 4; // Steps 1-4 (excluding step 0)
      const progressStep = Math.max(0, currentStep - 1); // Adjust for step 0
      const percentage = (progressStep / totalSteps) * 100;

      // Update progress bar
      if (this.elements.progressBar) {
        this.elements.progressBar.style.width = `${percentage}%`;
      }

      // Update step indicators
      this.elements.progressSteps.forEach((stepElement, index) => {
        const stepNum = index + 1; // Steps are 1-based in UI
        const circle = stepElement.querySelector('.techpack-progress__step-circle');
        
        if (circle) {
          // Remove all state classes
          circle.classList.remove(
            'techpack-progress__step-circle--active',
            'techpack-progress__step-circle--completed'
          );
          
          if (stepNum < currentStep) {
            // Completed step
            circle.classList.add('techpack-progress__step-circle--completed');
            circle.textContent = '✓';
          } else if (stepNum === currentStep) {
            // Active step
            circle.classList.add('techpack-progress__step-circle--active');
            circle.textContent = stepNum;
          } else {
            // Future step
            circle.textContent = stepNum;
          }
        }
      });
    }

    /**
     * Update URL without page reload
     */
    updateURL(stepNumber) {
      if (stepNumber > 0) { // Don't show step 0 in URL
        const url = new URL(window.location);
        url.searchParams.set('step', stepNumber);
        window.history.replaceState({}, '', url);
      }
    }

    /**
     * Handle navigation clicks
     */
    handleNavigation(event) {
      const target = event.target;
      
      // Next buttons
      if (target.matches('[id$="-next"]') || target.closest('[id$="-next"]')) {
        event.preventDefault();
        const button = target.matches('[id$="-next"]') ? target : target.closest('[id$="-next"]');
        this.handleNext(button);
        return;
      }
      
      // Previous/Back buttons  
      if (target.matches('[id$="-back"], [id$="-prev"]') || target.closest('[id$="-back"], [id$="-prev"]')) {
        event.preventDefault();
        this.handlePrevious();
        return;
      }
    }

    /**
     * Handle next step navigation
     */
    async handleNext(button) {
      const currentStep = this.state.getCurrentStep();
      
      try {
        // Validate current step
        const isValid = await this.validateCurrentStep();
        
        if (!isValid) {
          console.log('❌ Validation failed for current step');
          return;
        }
        
        // Move to next step
        const nextStep = currentStep + 1;
        if (nextStep <= 4) {
          await this.showStep(nextStep);
          
          // Scroll to top smoothly
          if (this.mobile) {
            this.mobile.scrollToTop();
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
        
      } catch (error) {
        console.error('❌ Navigation error:', error);
        this.showError('Navigation failed. Please try again.');
      }
    }

    /**
     * Handle previous step navigation
     */
    async handlePrevious() {
      const currentStep = this.state.getCurrentStep();
      
      if (currentStep > 1) {
        await this.showStep(currentStep - 1);
        
        // Scroll to top smoothly
        if (this.mobile) {
          this.mobile.scrollToTop();
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }

    /**
     * Validate current step
     */
    async validateCurrentStep() {
      const currentStep = this.state.getCurrentStep();
      
      switch (currentStep) {
        case 1:
          return this.validator ? this.validator.validateClientInfo() : true;
        case 2:
          return this.fileManager ? this.fileManager.validateFiles() : true;
        case 3:
          return this.garmentManager ? this.garmentManager.validateGarments() : true;
        case 4:
          return true; // Review step doesn't need validation
        default:
          return true;
      }
    }

    /**
     * Handle form submission
     */
    async handleFormSubmission(event) {
      if (event.target.closest('#techpack-step-4')) {
        event.preventDefault();
        
        try {
          // Final validation
          const isValid = await this.validateAllSteps();
          
          if (!isValid) {
            this.showError('Please complete all required fields before submitting.');
            return;
          }
          
          // Collect form data
          const formData = this.collectFormData();
          
          // Submit form
          await this.submitForm(formData);
          
        } catch (error) {
          console.error('❌ Form submission error:', error);
          this.showError('Submission failed. Please try again.');
        }
      }
    }

    /**
     * Validate all steps
     */
    async validateAllSteps() {
      const validations = await Promise.all([
        this.validator?.validateClientInfo() || true,
        this.fileManager?.validateFiles() || true,
        this.garmentManager?.validateGarments() || true
      ]);
      
      return validations.every(v => v === true);
    }

    /**
     * Collect all form data
     */
    collectFormData() {
      return {
        clientInfo: this.state.getClientInfo(),
        files: this.state.getFiles(),
        garments: this.state.getGarments(),
        timestamp: new Date().toISOString()
      };
    }

    /**
     * Submit form data
     */
    async submitForm(formData) {
      // This would integrate with your backend/email system
      console.log('📤 Submitting form data:', formData);
      
      // Show success message
      this.showSuccess('Your tech pack submission has been sent successfully!');
    }

    /**
     * Handle state changes
     */
    handleStateChange(newState) {
      // React to state changes if needed
      console.log('📊 State changed:', newState);
    }

    /**
     * Handle before unload
     */
    handleBeforeUnload(event) {
      const hasUnsavedData = this.state.hasUnsavedData();
      
      if (hasUnsavedData) {
        event.preventDefault();
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    }

    /**
     * Show error message
     */
    showError(message) {
      if (this.ui) {
        this.ui.showMessage(message, 'error');
      } else {
        alert(message);
      }
    }

    /**
     * Show success message
     */
    showSuccess(message) {
      if (this.ui) {
        this.ui.showMessage(message, 'success');
      } else {
        alert(message);
      }
    }

    /**
     * Get minimum quantity utility
     */
    getMinimumQuantity(colorwayCount, productionType) {
      return getMinimumQuantity(colorwayCount, productionType);
    }
  }

  // Initialize application when DOM is ready
  let app;
  
  function initTechPackApp() {
    if (!app) {
      app = new TechPackApp();
      app.init();
    }
    return app;
  }

  // Auto-initialize or expose for manual initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTechPackApp);
  } else {
    // DOM is already ready
    setTimeout(initTechPackApp, 0);
  }

  // Expose globally for other modules
  window.TechPackApp = TechPackApp;
  window.techPackApp = app;
  window.TechPackConfig = CONFIG;

})();