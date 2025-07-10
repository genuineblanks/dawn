// ===============================================
// MODULAR TECH PACK APPLICATION - MAIN ENTRY POINT
// ===============================================

(function() {
  'use strict';

  // Module Loading Manager
  class ModuleLoader {
    constructor() {
      this.modules = new Map();
      this.loadPromises = new Map();
      this.basePath = '/assets/techpack-modules/';
    }

    async loadModule(name, filename) {
      if (this.modules.has(name)) {
        return this.modules.get(name);
      }

      if (this.loadPromises.has(name)) {
        return this.loadPromises.get(name);
      }

      const promise = this.loadScript(filename || `${name}.js`)
        .then(() => {
          const module = window[this.getModuleKey(name)];
          this.modules.set(name, module);
          return module;
        });

      this.loadPromises.set(name, promise);
      return promise;
    }

    loadScript(filename) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = this.basePath + filename;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    getModuleKey(name) {
      const keyMap = {
        'techpack-config': 'TechPackConfig',
        'techpack-state': 'TechPackState',
        'techpack-animation': 'TechPackAnimation',
        'techpack-validation': 'TechPackValidation',
        'techpack-core': 'TechPackCore'
      };
      return keyMap[name] || name;
    }

    async loadAllModules() {
      const moduleNames = [
        'techpack-config',
        'techpack-state', 
        'techpack-animation',
        'techpack-validation',
        'techpack-core'
      ];

      try {
        const modules = await Promise.all(
          moduleNames.map(name => this.loadModule(name))
        );
        
        console.log('✅ All tech pack modules loaded successfully');
        return modules;
      } catch (error) {
        console.error('❌ Failed to load tech pack modules:', error);
        throw error;
      }
    }
  }

  // Main Application Class
  class TechPackApp {
    constructor() {
      this.moduleLoader = new ModuleLoader();
      this.state = null;
      this.debug = null;
      this.animationManager = null;
      this.validator = null;
      this.fileValidator = null;
      this.stepManager = null;
      this.fileManager = null;
      this.initialized = false;
    }

    async init() {
      try {
        console.log('🚀 Initializing Modular Tech Pack Application...');
        
        // Load all modules first
        await this.moduleLoader.loadAllModules();
        
        // Initialize core components
        await this.initializeComponents();
        
        // Setup application
        await this.setupApplication();
        
        console.log('✅ Tech Pack Application initialized successfully');
        this.initialized = true;
        
        // Trigger initialization complete event
        this.triggerInitCompleteEvent();
        
      } catch (error) {
        console.error('❌ Failed to initialize Tech Pack Application:', error);
        this.handleInitializationError(error);
      }
    }

    async initializeComponents() {
      // Get modules
      const stateModule = this.moduleLoader.modules.get('techpack-state');
      const animationModule = this.moduleLoader.modules.get('techpack-animation');
      const validationModule = this.moduleLoader.modules.get('techpack-validation');
      const coreModule = this.moduleLoader.modules.get('techpack-core');

      // Initialize state and debug
      this.state = new stateModule.TechPackState();
      this.debug = new stateModule.DebugSystem();
      
      // Initialize animation manager
      this.animationManager = new animationModule.AnimationManager();
      
      // Initialize validators
      this.validator = new validationModule.FormValidator();
      this.fileValidator = new validationModule.FileValidator();
      
      // Initialize managers
      this.stepManager = new coreModule.StepManager(this.state, this.animationManager);
      this.fileManager = new coreModule.FileManager(this.state, this.fileValidator);

      // Setup validation rules
      this.validator.setupValidation();
    }

    async setupApplication() {
      // Initialize debug system
      this.debug.init();
      
      // Initialize managers
      this.stepManager.init();
      this.fileManager.init();
      
      // Setup form validation
      this.validator.attachRealTimeValidation();
      
      // Setup registration button handlers
      this.setupRegistrationHandlers();
      
      // Setup country selector
      this.setupCountrySelector();
      
      // Setup step navigation
      this.setupStepNavigation();
      
      // Load initial state from URL
      this.loadStateFromURL();
    }

    setupRegistrationHandlers() {
      this.debug.log('Setting up registration button handlers');
      
      // Enhanced button setup with retry mechanism
      const setupButtons = () => {
        const elements = {
          yesBtn: document.querySelector('#registered-client-yes'),
          noBtn: document.querySelector('#registered-client-no'),
          warningDiv: document.querySelector('#registration-warning')
        };

        this.debug.log('Registration elements found:', {
          yesBtn: !!elements.yesBtn,
          noBtn: !!elements.noBtn,
          warningDiv: !!elements.warningDiv
        });

        if (elements.yesBtn && elements.noBtn) {
          // Remove existing listeners
          elements.yesBtn.replaceWith(elements.yesBtn.cloneNode(true));
          elements.noBtn.replaceWith(elements.noBtn.cloneNode(true));
          
          // Get fresh references
          const yesBtn = document.querySelector('#registered-client-yes');
          const noBtn = document.querySelector('#registered-client-no');
          
          // Add event listeners
          yesBtn.addEventListener('click', (e) => this.handleRegistrationSelection(e, 'yes'));
          noBtn.addEventListener('click', (e) => this.handleRegistrationSelection(e, 'no'));
          
          this.debug.log('Registration button handlers attached successfully');
          return true;
        }
        
        return false;
      };

      // Progressive retry mechanism
      const retryDelays = [100, 250, 500, 1000, 2000];
      let retryCount = 0;

      const attemptSetup = () => {
        if (setupButtons()) {
          this.debug.log('Registration buttons setup completed');
          return;
        }

        if (retryCount < retryDelays.length) {
          const delay = retryDelays[retryCount];
          this.debug.log(`Registration buttons not found, retrying in ${delay}ms (attempt ${retryCount + 1}/${retryDelays.length})`);
          
          setTimeout(() => {
            retryCount++;
            attemptSetup();
          }, delay);
        } else {
          this.debug.log('Failed to setup registration buttons after all retries', null, 'error');
        }
      };

      attemptSetup();
    }

    async handleRegistrationSelection(event, choice) {
      event.preventDefault();
      
      this.debug.log(`Registration choice: ${choice}`);
      
      const button = event.target.closest('button');
      
      // Show loading state
      this.setButtonLoading(button, true);
      
      try {
        // Update state
        this.state.formData.clientInfo.registrationType = choice;
        
        // Show warning for registered clients
        if (choice === 'yes') {
          this.showRegistrationWarning();
        }
        
        // Short delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Navigate to next step
        await this.stepManager.goToStep(1, 'forward');
        
        this.debug.log('Successfully processed registration selection');
        
      } catch (error) {
        this.debug.log('Error processing registration selection:', error, 'error');
        this.showRegistrationError('Something went wrong. Please try again.');
      } finally {
        this.setButtonLoading(button, false);
      }
    }

    setButtonLoading(button, isLoading) {
      if (!button) return;
      
      button.dataset.loading = isLoading.toString();
      button.disabled = isLoading;
      
      if (isLoading) {
        button.classList.add('techpack-btn--loading');
      } else {
        button.classList.remove('techpack-btn--loading');
      }
    }

    showRegistrationWarning() {
      const warningDiv = document.querySelector('#registration-warning');
      if (warningDiv) {
        warningDiv.style.display = 'block';
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
          warningDiv.style.display = 'none';
        }, 10000);
      }
    }

    showRegistrationError(message) {
      // Create or update error message
      let errorDiv = document.querySelector('.techpack-registration-error');
      
      if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'techpack-registration-error';
        errorDiv.style.cssText = `
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid #dc2626;
          border-radius: 8px;
          padding: 1rem;
          margin: 1rem 0;
          color: #dc2626;
          font-size: 0.875rem;
        `;
        
        const actions = document.querySelector('.techpack-premium-check__actions');
        if (actions) {
          actions.parentNode.insertBefore(errorDiv, actions.nextSibling);
        }
      }
      
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        errorDiv.style.display = 'none';
      }, 5000);
    }

    setupCountrySelector() {
      const countryInput = document.querySelector('#country');
      const countryToggle = document.querySelector('#country-toggle');
      const countryDropdown = document.querySelector('#country-dropdown');
      
      if (!countryInput || !countryDropdown) return;

      const COUNTRY_DATA = window.TechPackConfig?.COUNTRY_DATA;
      if (!COUNTRY_DATA) return;

      // Populate dropdown
      const countries = COUNTRY_DATA.getAllCountries();
      countryDropdown.innerHTML = countries.map(country => 
        `<div class="techpack-dropdown__item" data-code="${country.code}" data-name="${country.name}">
          <span class="country-flag">${country.flag}</span>
          <span class="country-name">${country.name}</span>
         </div>`
      ).join('');

      // Toggle dropdown
      if (countryToggle) {
        countryToggle.addEventListener('click', () => {
          const isOpen = countryDropdown.style.display === 'block';
          countryDropdown.style.display = isOpen ? 'none' : 'block';
        });
      }

      // Select country
      countryDropdown.addEventListener('click', (e) => {
        const item = e.target.closest('.techpack-dropdown__item');
        if (item) {
          const countryName = item.dataset.name;
          countryInput.value = countryName;
          countryDropdown.style.display = 'none';
          
          // Update VAT field requirements
          this.updateVATRequirements(item.dataset.code);
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.techpack-form__country-wrapper')) {
          countryDropdown.style.display = 'none';
        }
      });
    }

    updateVATRequirements(countryCode) {
      const COUNTRY_DATA = window.TechPackConfig?.COUNTRY_DATA;
      if (!COUNTRY_DATA) return;

      const vatField = document.querySelector('#vat-ein');
      const vatLabel = document.querySelector('#vat-ein-label');
      const vatStatus = document.querySelector('#vat-ein-status');
      const vatGroup = document.querySelector('#vat-ein-group');

      if (vatField && vatLabel && vatStatus && vatGroup) {
        const requiresVAT = COUNTRY_DATA.requiresVAT(countryCode);
        
        if (requiresVAT) {
          vatField.required = true;
          vatStatus.textContent = '(required)';
          vatGroup.classList.add('techpack-form__group--required');
        } else {
          vatField.required = false;
          vatStatus.textContent = '(optional)';
          vatGroup.classList.remove('techpack-form__group--required');
        }
      }
    }

    setupStepNavigation() {
      // Additional step navigation setup if needed
      // The StepManager handles most of this automatically
    }

    loadStateFromURL() {
      const urlParams = new URLSearchParams(window.location.search);
      const step = urlParams.get('step');
      
      if (step && !isNaN(parseInt(step))) {
        this.stepManager.goToStep(parseInt(step));
      }
    }

    triggerInitCompleteEvent() {
      const event = new CustomEvent('techpack:initialized', {
        detail: { app: this, state: this.state.getState() }
      });
      document.dispatchEvent(event);
    }

    handleInitializationError(error) {
      // Show user-friendly error message
      const errorDiv = document.createElement('div');
      errorDiv.innerHTML = `
        <div style="background: #fee; border: 1px solid #fcc; padding: 1rem; border-radius: 8px; margin: 1rem;">
          <h3 style="color: #c33; margin: 0 0 0.5rem;">Application Error</h3>
          <p style="margin: 0; color: #666;">The tech pack application failed to load. Please refresh the page or contact support.</p>
        </div>
      `;
      
      const container = document.querySelector('.techpack-container') || document.body;
      container.insertBefore(errorDiv, container.firstChild);
    }

    // Public API methods
    getState() {
      return this.state ? this.state.getState() : null;
    }

    goToStep(step) {
      return this.stepManager ? this.stepManager.goToStep(step) : Promise.resolve();
    }

    validateCurrentStep() {
      return this.stepManager ? this.stepManager.validateCurrentStep() : Promise.resolve(true);
    }
  }

  // Enhanced initialization with improved timing
  function initializeTechPackApp() {
    // Check if we're on a tech pack page
    if (!document.querySelector('#techpack-step-0, #techpack-step-1')) {
      return; // Not a tech pack page
    }

    console.log('🎯 Tech Pack page detected, initializing modular application...');

    const app = new TechPackApp();
    
    // Make app globally accessible for debugging
    window.techPackApp = app;
    
    // Initialize the application
    app.init().catch(error => {
      console.error('Failed to initialize tech pack application:', error);
    });
  }

  // Enhanced DOM ready detection
  function onDOMReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  // Initialize when DOM is ready
  onDOMReady(() => {
    // Small delay to ensure all DOM elements are rendered
    setTimeout(initializeTechPackApp, 100);
  });

  // Fallback initialization for slower connections
  window.addEventListener('load', () => {
    if (!window.techPackApp || !window.techPackApp.initialized) {
      console.log('🔄 Fallback initialization triggered');
      setTimeout(initializeTechPackApp, 500);
    }
  });

})();