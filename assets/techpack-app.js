// Enhanced Form Initialization
  class FormInitializer {
    constructor() {
      this.initialized = false;
    }

    init() {
      if (this.initialized) return;
      
      debugSystem.log('Initializing TechPack Application');
      
      // ADDED: Setup registration check FIRST
      this.setupRegistrationCheck();
      
      // EXISTING: Keep all your existing setup methods
      this.setupDateConstraints();
      this.setupPhoneFormatting();
      this.setupProductionTypeListener();
      this.setupNavigationButtons();
      this.setupFormSubmission();
      this.setupVATFormatting();
      
      // CHANGED: Initialize with registration check (step 0) instead of step 1
      this.showStep(0);
      
      this.initialized = true;
      debugSystem.log('TechPack Application initialized successfully', null, 'success');
    }

    // NEW: Registration check setup
    setupRegistrationCheck() {
      const yesBtn = document.querySelector('#registered-client-yes');
      const noBtn = document.querySelector('#registered-client-no');
      const warningDiv = document.querySelector('#registration-warning');

      debugSystem.log('Setting up registration check', { 
        yesBtn: !!yesBtn, 
        noBtn: !!noBtn, 
        warningDiv: !!warningDiv 
      });

      if (yesBtn && noBtn) {
        yesBtn.addEventListener('click', () => {
          debugSystem.log('YES button clicked - Registered client selected');
          
          // Show warning first
          if (warningDiv) {
            warningDiv.style.display = 'flex';
            warningDiv.classList.add('show');
          }

          // Wait a moment, then proceed
          setTimeout(() => {
            state.formData.isRegisteredClient = true;
            this.configureStep1ForRegisteredClient();
            stepManager.navigateToStep(1);
            
            // Add scroll after navigation
            setTimeout(() => {
              stepManager.scrollToTechPackTopEnhanced();
            }, 600);
          }, 2000); // 2 second delay to show warning
        });

        noBtn.addEventListener('click', () => {
          debugSystem.log('NO button clicked - New client selected');
          
          state.formData.isRegisteredClient = false;
          this.configureStep1ForNewClient();
          stepManager.navigateToStep(1);
          
          // Add scroll after navigation
          setTimeout(() => {
            stepManager.scrollToTechPackTopEnhanced();
          }, 600);
        });

        debugSystem.log('Registration check event listeners attached successfully');
      } else {
        debugSystem.log('Registration check buttons not found - will fallback to step 1', null, 'warn');
      }
    }

    // NEW: Configure Step 1 for registered clients
    configureStep1ForRegisteredClient() {
      // Hide unnecessary fields for registered clients
      const fieldsToHide = [
        '#client-name',
        '#vat-ein-group', 
        '#phone',
        '.techpack-form__country-wrapper'
      ];
      
      fieldsToHide.forEach(selector => {
        const field = document.querySelector(selector);
        if (field) {
          const formGroup = field.closest('.techpack-form__group');
          if (formGroup) {
            formGroup.style.display = 'none';
            // Remove required attributes for hidden fields
            const inputs = formGroup.querySelectorAll('input, select');
            inputs.forEach(input => {
              input.removeAttribute('required');
              input.removeAttribute('data-validate');
            });
          }
        }
      });

      // Update the title to indicate registered client
      const title = document.querySelector('#techpack-step-1 .techpack-title');
      if (title) {
        title.innerHTML = `
          Client Information 
          <span style="color: #059669; font-size: 0.875rem; font-weight: 500; margin-left: 0.5rem;">
            (Registered Client)
          </span>
        `;
      }

      // Add warning about verification
      const subtitle = document.querySelector('#techpack-step-1 .techpack-subtitle');
      if (subtitle) {
        subtitle.innerHTML = `
          Confirm your details below 
          <div style="background: #fef3cd; border: 1px solid #f59e0b; border-radius: 6px; padding: 0.75rem; margin-top: 1rem; font-size: 0.875rem; color: #92400e;">
            <strong>⚠️ Verification Required:</strong> Your submission will be validated against our client database. 
            Unregistered submissions will be automatically rejected.
          </div>
        `;
      }

      debugSystem.log('Configured Step 1 for registered client');
    }

    // NEW: Configure Step 1 for new clients
    configureStep1ForNewClient() {
      // Show all fields for new clients
      const fieldsToShow = [
        '#client-name',
        '#vat-ein-group',
        '#phone', 
        '.techpack-form__country-wrapper'
      ];
      
      fieldsToShow.forEach(selector => {
        const field = document.querySelector(selector);
        if (field) {
          const formGroup = field.closest('.techpack-form__group');
          if (formGroup) {
            formGroup.style.display = 'block';
            // Restore required attributes for required fields
            const requiredFields = ['clientName', 'country'];
            const inputs = formGroup.querySelectorAll('input, select');
            inputs.forEach(input => {
              if (requiredFields.includes(input.name)) {
                input.setAttribute('required', 'required');
                input.setAttribute('data-validate', 'required');
              }
            });
          }
        }
      });

      // Update the title to indicate new client
      const title = document.querySelector('#techpack-step-1 .techpack-title');
      if (title) {
        title.innerHTML = `
          Client Information 
          <span style="color: #3b82f6; font-size: 0.875rem; font-weight: 500; margin-left: 0.5rem;">
            (New Client)
          </span>
        `;
      }

      // Standard subtitle for new clients
      const subtitle = document.querySelector('#techpack-step-1 .techpack-subtitle');
      if (subtitle) {
        subtitle.textContent = 'Tell us about your project requirements';
      }

      debugSystem.log('Configured Step 1 for new client');
    }

// EXISTING: Keep your exact setupDateConstraints method
    setupDateConstraints() {
      const dateInput = document.getElementById('deadline');
      if (!dateInput) return;

      const today = new Date();
      const minDate = new Date();
      minDate.setDate(today.getDate() + (CONFIG.MIN_DELIVERY_WEEKS * 7));
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 2);

      dateInput.min = minDate.toISOString().split('T')[0];
      dateInput.max = maxDate.toISOString().split('T')[0];

      debugSystem.log('Date constraints set', { 
        min: dateInput.min, 
        max: dateInput.max,
        minWeeksFromToday: CONFIG.MIN_DELIVERY_WEEKS
      });
    }

    // EXISTING: Keep your exact setupPhoneFormatting method
    setupPhoneFormatting() {
      const phoneInput = document.getElementById('phone');
      if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
          e.target.value = Utils.formatPhoneNumber(e.target.value);
        });
      }
    }

    // EXISTING: Keep your exact setupVATFormatting method
    setupVATFormatting() {
      const vatInput = document.getElementById('vat-ein');
      if (vatInput) {
        vatInput.addEventListener('input', (e) => {
          let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
          
          // Auto-format and limit length based on country patterns
          if (value.length >= 2) {
            const countryCode = value.substring(0, 2);
            
            // Apply country-specific formatting and limits (official EU formats)
            switch (countryCode) {
              case 'AT': // Austria: ATU + 8 digits = 11 total
                if (value.length > 2) {
                  value = 'ATU' + value.substring(3).replace(/\D/g, '');
                } else {
                  value = 'ATU';
                }
                if (value.length > 11) value = value.substring(0, 11);
                break;
              case 'BE': // Belgium: BE + 10 digits = 12 total (or BE0 + 9 digits)
                value = 'BE' + value.substring(2).replace(/\D/g, '');
                if (value.length > 12) value = value.substring(0, 12);
                break;
              case 'BG': // Bulgaria: BG + 9-10 digits = 11-12 total
                value = 'BG' + value.substring(2).replace(/\D/g, '');
                if (value.length > 12) value = value.substring(0, 12);
                break;
              case 'HR': // Croatia: HR + 11 digits = 13 total
                value = 'HR' + value.substring(2).replace(/\D/g, '');
                if (value.length > 13) value = value.substring(0, 13);
                break;
              case 'CY': // Cyprus: CY + 8 digits + 1 letter = 11 total
                value = 'CY' + value.substring(2);
                if (value.length > 11) value = value.substring(0, 11);
                break;
              case 'CZ': // Czech: CZ + 8-10 digits = 10-12 total
                value = 'CZ' + value.substring(2).replace(/\D/g, '');
                if (value.length > 12) value = value.substring(0, 12);
                break;
              case 'DK': // Denmark: DK + 8 digits = 10 total
                value = 'DK' + value.substring(2).replace(/\D/g, '');
                if (value.length > 10) value = value.substring(0, 10);
                break;
              case 'EE': // Estonia: EE + 9 digits = 11 total
                value = 'EE' + value.substring(2).replace(/\D/g, '');
                if (value.length > 11) value = value.substring(0, 11);
                break;
              case 'FI': // Finland: FI + 8 digits = 10 total
                value = 'FI' + value.substring(2).replace(/\D/g, '');
                if (value.length > 10) value = value.substring(0, 10);
                break;
              case 'FR': // France: FR + 2 chars + 9 digits = 13 total
                value = 'FR' + value.substring(2);
                if (value.length > 13) value = value.substring(0, 13);
                break;
              case 'DE': // Germany: DE + 9 digits = 11 total
                value = 'DE' + value.substring(2).replace(/\D/g, '');
                if (value.length > 11) value = value.substring(0, 11);
                break;
              case 'EL':
              case 'GR': // Greece: EL + 9 digits = 11 total
                value = 'EL' + value.substring(2).replace(/\D/g, '');
                if (value.length > 11) value = value.substring(0, 11);
                break;
              case 'HU': // Hungary: HU + 8 digits = 10 total
                value = 'HU' + value.substring(2).replace(/\D/g, '');
                if (value.length > 10) value = value.substring(0, 10);
                break;
              case 'IE': // Ireland: IE + 7 digits + 1-2 letters = 10-11 total
                value = 'IE' + value.substring(2);
                if (value.length > 11) value = value.substring(0, 11);
                break;
              case 'IT': // Italy: IT + 11 digits = 13 total
                value = 'IT' + value.substring(2).replace(/\D/g, '');
                if (value.length > 13) value = value.substring(0, 13);
                break;
              case 'LV': // Latvia: LV + 11 digits = 13 total
                value = 'LV' + value.substring(2).replace(/\D/g, '');
                if (value.length > 13) value = value.substring(0, 13);
                break;
              case 'LT': // Lithuania: LT + 9 or 12 digits = 11 or 14 total
                value = 'LT' + value.substring(2).replace(/\D/g, '');
                if (value.length > 14) value = value.substring(0, 14);
                break;
              case 'LU': // Luxembourg: LU + 8 digits = 10 total
                value = 'LU' + value.substring(2).replace(/\D/g, '');
                if (value.length > 10) value = value.substring(0, 10);
                break;
              case 'MT': // Malta: MT + 8 digits = 10 total
                value = 'MT' + value.substring(2).replace(/\D/g, '');
                if (value.length > 10) value = value.substring(0, 10);
                break;
              case 'NL': // Netherlands: NL + 9 digits + B + 2 digits = 14 total
                let nlValue = 'NL' + value.substring(2).replace(/[^0-9B]/g, '');
                if (nlValue.length > 14) nlValue = nlValue.substring(0, 14);
                value = nlValue;
                break;
              case 'NO': // Norway: NO + 9 digits + MVA = 14 total
                value = 'NO' + value.substring(2).replace(/[^0-9MVA]/g, '');
                if (value.length > 14) value = value.substring(0, 14);
                break;
              case 'PL': // Poland: PL + 10 digits = 12 total
                value = 'PL' + value.substring(2).replace(/\D/g, '');
                if (value.length > 12) value = value.substring(0, 12);
                break;
              case 'PT': // Portugal: PT + 9 digits = 11 total
                value = 'PT' + value.substring(2).replace(/\D/g, '');
                if (value.length > 11) value = value.substring(0, 11);
                break;
              case 'RO': // Romania: RO + 10 digits = 12 total
                value = 'RO' + value.substring(2).replace(/\D/g, '');
                if (value.length > 12) value = value.substring(0, 12);
                break;
              case 'SK': // Slovakia: SK + 10 digits = 12 total
                value = 'SK' + value.substring(2).replace(/\D/g, '');
                if (value.length > 12) value = value.substring(0, 12);
                break;
              case 'SI': // Slovenia: SI + 8 digits = 10 total
                value = 'SI' + value.substring(2).replace(/\D/g, '');
                if (value.length > 10) value = value.substring(0, 10);
                break;
              case 'ES': // Spain: ES + 9 chars total (letters allowed)
                value = 'ES' + value.substring(2);
                if (value.length > 11) value = value.substring(0, 11);
                break;
              case 'SE': // Sweden: SE + 12 digits = 14 total
                value = 'SE' + value.substring(2).replace(/\D/g, '');
                if (value.length > 14) value = value.substring(0, 14);
                break;
              case 'CH': // Switzerland: CHE + 9 digits + MWST/TVA/IVA
                if (value.startsWith('CHE')) {
                  value = 'CHE' + value.substring(3).replace(/[^0-9MWSTVAIV]/g, '');
                } else {
                  value = 'CHE';
                }
                if (value.length > 16) value = value.substring(0, 16);
                break;
              case 'GB': // UK: GB + 9 digits = 11 total
                value = 'GB' + value.substring(2).replace(/\D/g, '');
                if (value.length > 11) value = value.substring(0, 11);
                break;
              default:
                // Limit to 16 characters max for any VAT
                if (value.length > 16) value = value.substring(0, 16);
            }
          } else if (/^\d/.test(value)) {
            // For EIN (US): only digits, max 9
            value = value.replace(/\D/g, '');
            if (value.length > 9) value = value.substring(0, 9);
          }
          
          e.target.value = value;
          
          // Get selected country for context
          const countryInput = document.getElementById('country');
          const selectedCountry = countryInput?.value;
          const countryObj = COUNTRY_DATA.findByName(selectedCountry);
          
          // Real-time validation feedback
          const isValid = Utils.validateVAT(value, countryObj?.code);
          e.target.classList.toggle('techpack-form__input--error', value.length > 0 && !isValid);
          e.target.classList.toggle('techpack-form__input--success', value.length > 0 && isValid);
          
          // Show/hide error message with country-specific guidance
          const errorDiv = e.target.closest('.techpack-form__group')?.querySelector('.techpack-form__error');
          if (errorDiv) {
            if (value.length > 0 && !isValid) {
              const vatFormats = {
                'PT': 'Portuguese VAT: PT + 9 digits (e.g., PT123456789)',
                'ES': 'Spanish VAT: ES + letter + 7 digits + letter (e.g., ESA1234567A)',
                'DE': 'German VAT: DE + 9 digits (e.g., DE123456789)',
                'FR': 'French VAT: FR + 2 chars + 9 digits (e.g., FRAA123456789)',
                'IT': 'Italian VAT: IT + 11 digits (e.g., IT12345678901)',
                'NL': 'Dutch VAT: NL + 9 digits + B + 2 digits (e.g., NL123456789B01)',
                'BE': 'Belgian VAT: BE + 10 digits (e.g., BE0123456789)',
                'AT': 'Austrian VAT: ATU + 8 digits (e.g., ATU12345678)',
                'SE': 'Swedish VAT: SE + 12 digits (e.g., SE123456789012)',
                'US': 'US EIN: 9 digits only (e.g., 123456789)',
                'GB': 'UK VAT: GB + 9 digits (e.g., GB123456789)',
                'CH': 'Swiss VAT: CHE + 9 digits + MWST/TVA/IVA',
                'NO': 'Norwegian VAT: NO + 9 digits + MVA'
              };
              
              errorDiv.textContent = vatFormats[countryObj?.code] || 'Please enter a valid format for your country';
              errorDiv.style.display = 'block';
            } else {
              errorDiv.textContent = '';
              errorDiv.style.display = 'none';
            }
          }
        });
      }
    }

    // EXISTING: Keep your exact setupProductionTypeListener method
    setupProductionTypeListener() {
      const productionTypeSelect = document.querySelector('#production-type, select[name="productionType"]');
      if (!productionTypeSelect) return;

      productionTypeSelect.addEventListener('change', (e) => {
        const selectedType = e.target.value;
        debugSystem.log('Production type changed', { type: selectedType });
        
        if (state.formData.clientInfo) {
          state.formData.clientInfo.productionType = selectedType;
        }
        
        if (state.currentStep === 3) {
          stepManager.refreshStep3Interface();
        }
      });
    }

// EXISTING: Keep your exact setupNavigationButtons method
    setupNavigationButtons() {
      // Step 1
      const step1Next = document.querySelector('#step-1-next');
      if (step1Next) {
        step1Next.addEventListener('click', () => {
          stepManager.navigateToStep(2);
          // Force scroll to TechPack
          setTimeout(() => {
            stepManager.scrollToTechPackTopEnhanced();
          }, 600);
        });
      }

      // Step 2
      const step2Prev = document.querySelector('#step-2-prev');
      const step2Next = document.querySelector('#step-2-next');
      
      if (step2Prev) {
        step2Prev.addEventListener('click', () => {
          stepManager.navigateToStep(1);
          setTimeout(() => {
            stepManager.scrollToTechPackTopEnhanced();
          }, 600);
        });
      }
      if (step2Next) {
        step2Next.addEventListener('click', () => {
          stepManager.navigateToStep(3);
          setTimeout(() => {
            stepManager.scrollToTechPackTopEnhanced();
          }, 600);
        });
      }

      // Step 3
      const step3Prev = document.querySelector('#step-3-prev');
      const step3Next = document.querySelector('#step-3-next');
      
      if (step3Prev) {
        step3Prev.addEventListener('click', () => {
          stepManager.navigateToStep(2);
          setTimeout(() => {
            stepManager.scrollToTechPackTopEnhanced();
          }, 600);
        });
      }
      if (step3Next) {
        step3Next.addEventListener('click', () => {
          stepManager.navigateToStep(4);
          setTimeout(() => {
            stepManager.scrollToTechPackTopEnhanced();
          }, 600);
        });
      }

      // Step 4
      const step4Prev = document.querySelector('#step-4-prev');
      if (step4Prev) {
        step4Prev.addEventListener('click', () => {
          stepManager.navigateToStep(3);
          setTimeout(() => {
            stepManager.scrollToTechPackTopEnhanced();
          }, 600);
        });
      }

      // EDIT BUTTONS - Review Page
      this.setupEditButtons();
    }

    // EXISTING: Keep your exact setupEditButtons method
    setupEditButtons() {
      // Simple approach: Set up specific event listeners after review is populated
      setTimeout(() => {
        // Find all edit buttons and set up click handlers
        const editButtons = document.querySelectorAll('button');
        
        editButtons.forEach(button => {
          if (button.textContent.toLowerCase().includes('edit')) {
            button.onclick = (e) => {
              e.preventDefault();
              
              // Determine step by checking the surrounding content more broadly
              let targetStep = 1; // Default
              
              // Check multiple levels up to find the right context
              let currentElement = button;
              let found = false;
              
              // Walk up the DOM tree to find context
              for (let i = 0; i < 10 && currentElement && !found; i++) {
                const allText = currentElement.textContent ? currentElement.textContent.toLowerCase() : '';
                
                // More specific checks
                if (allText.includes('client information') || 
                    (allText.includes('client') && allText.includes('name')) ||
                    (allText.includes('company') && allText.includes('name')) ||
                    allText.includes('email address')) {
                  targetStep = 1;
                  found = true;
                  debugSystem.log('Edit client info clicked');
                } else if (allText.includes('uploaded files') || 
                          (allText.includes('file') && (allText.includes('chatgpt') || allText.includes('.png') || allText.includes('.pdf'))) ||
                          allText.includes('collection') ||
                          allText.includes('single garment')) {
                  targetStep = 2;
                  found = true;
                  debugSystem.log('Edit files clicked');
                } else if (allText.includes('garment specifications') || 
                          allText.includes('total quantity') ||
                          (allText.includes('garment') && allText.includes(':')) ||
                          allText.includes('fabric:') ||
                          allText.includes('printing methods:') ||
                          allText.includes('units')) {
                  targetStep = 3;
                  found = true;
                  debugSystem.log('Edit garments clicked');
                }
                
                currentElement = currentElement.parentElement;
              }
              
              // Fallback: check by section ID
              if (!found) {
                const step1Section = button.closest('#review-step-1, [data-step="1"]');
                const step2Section = button.closest('#review-step-2, [data-step="2"]');
                const step3Section = button.closest('#review-step-3, [data-step="3"]');
                
                if (step1Section) {
                  targetStep = 1;
                  debugSystem.log('Edit client info clicked (fallback)');
                } else if (step2Section) {
                  targetStep = 2;
                  debugSystem.log('Edit files clicked (fallback)');
                } else if (step3Section) {
                  targetStep = 3;
                  debugSystem.log('Edit garments clicked (fallback)');
                }
              }
              
              // Navigate AND scroll
              stepManager.navigateToStep(targetStep);
              
              // IMPORTANT: Add scroll after navigation
              setTimeout(() => {
                stepManager.scrollToTechPackTopEnhanced();
              }, 600); // Wait for navigation to complete
              
              debugSystem.log('Edit button navigation with scroll', { targetStep, found });
            };
          }
        });
      }, 200);
      debugSystem.log('Edit buttons setup complete');
    }

    // EXISTING: Keep your exact setupFormSubmission method
    setupFormSubmission() {
      const submitBtn = document.querySelector('#step-4-submit');
      if (submitBtn) {
        submitBtn.addEventListener('click', this.handleSubmit.bind(this));
      }
    }

    // EXISTING: Keep your exact handleSubmit method
    async handleSubmit() {
      const submitBtn = document.querySelector('#step-4-submit');
      if (!submitBtn) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="techpack-btn__spinner" width="16" height="16" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1" fill="none" opacity="0.3"/>
          <path d="M8 2v6" stroke="currentColor" stroke-width="1"/>
        </svg>
        Submitting...
      `;

      debugSystem.log('Form submission started');

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        this.showThankYou();
        debugSystem.log('Form submitted successfully', null, 'success');
      } catch (error) {
        debugSystem.log('Form submission failed', error, 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit Tech-Pack';
      }
    }

// EXISTING: Keep your exact showThankYou method
    showThankYou() {
      const step4 = document.querySelector('#techpack-step-4');
      if (!step4) return;

      const totalQuantity = quantityCalculator.getTotalQuantityFromAllColorways();
      
      step4.innerHTML = `
        <div class="techpack-container">
          <div class="techpack-success-page">
            <div class="techpack-success__icon-wrapper">
              <div class="techpack-success__icon">
                <svg width="80" height="80" viewBox="0 0 80 80" class="success-checkmark">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="#000000" stroke-width="3" stroke-dasharray="226" stroke-dashoffset="226" class="circle-animation"/>
                  <path d="M25 40l10 10 20-20" stroke="#000000" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="50" stroke-dashoffset="50" class="checkmark-animation"/>
                </svg>
              </div>
            </div>

            <div class="techpack-success__content">
              <h1 class="techpack-success__title">Submission Received</h1>
              <p class="techpack-success__subtitle">Your tech-pack has been successfully submitted to our production team.</p>

              <div class="techpack-success__card">
                <div class="techpack-success__card-header">
                  <h3>Submission Details</h3>
                </div>
                
                <div class="techpack-success__details">
                  <div class="techpack-success__detail-item">
                    <span class="techpack-success__detail-label">Reference ID</span>
                    <span class="techpack-success__detail-value">TP-${Date.now().toString().slice(-8)}</span>
                  </div>
                  
                  <div class="techpack-success__detail-item">
                    <span class="techpack-success__detail-label">Total Quantity</span>
                    <span class="techpack-success__detail-value">${totalQuantity} units</span>
                  </div>
                  
                  <div class="techpack-success__detail-item">
                    <span class="techpack-success__detail-label">Files Uploaded</span>
                    <span class="techpack-success__detail-value">${state.formData.files.length} ${state.formData.files.length === 1 ? 'file' : 'files'}</span>
                  </div>
                  
                  <div class="techpack-success__detail-item">
                    <span class="techpack-success__detail-label">Submitted</span>
                    <span class="techpack-success__detail-value">${new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>
              </div>

              <div class="techpack-success__next-steps">
                <h4 class="techpack-success__next-title">What happens next?</h4>
                <div class="techpack-success__steps">
                  <div class="techpack-success__step">
                    <div class="techpack-success__step-number">1</div>
                    <div class="techpack-success__step-content">
                      <strong>Review Process</strong>
                      <span>Our team will analyze your requirements and specifications</span>
                    </div>
                  </div>
                  
                  <div class="techpack-success__step">
                    <div class="techpack-success__step-number">2</div>
                    <div class="techpack-success__step-content">
                      <strong>Quote Preparation</strong>
                      <span>We'll prepare a detailed quote and timeline for your project</span>
                    </div>
                  </div>
                  
                  <div class="techpack-success__step">
                    <div class="techpack-success__step-number">3</div>
                    <div class="techpack-success__step-content">
                      <strong>Response</strong>
                      <span>You'll receive our comprehensive proposal within 24-48 hours</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="techpack-success__actions">
                <button type="button" class="techpack-btn techpack-btn--primary" onclick="location.reload()">
                  <span>Submit Another Tech-Pack</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" class="techpack-btn__icon">
                    <path d="M8 1l7 7-7 7M15 8H1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      // IMPORTANT: Wait for DOM to be fully updated, then scroll to the new content
      setTimeout(() => {
        // First try to find the new thank you page elements
        const thankYouContainer = document.querySelector('.techpack-success-page');
        const thankYouTitle = document.querySelector('.techpack-success__title');
        const techPackStep4 = document.querySelector('#techpack-step-4');
        
        let targetElement = null;
        
        // Try to find the best element to scroll to
        if (thankYouContainer) {
          targetElement = thankYouContainer;
          debugSystem.log('Found thank you container for scroll');
        } else if (thankYouTitle) {
          targetElement = thankYouTitle;
          debugSystem.log('Found thank you title for scroll');
        } else if (techPackStep4) {
          targetElement = techPackStep4;
          debugSystem.log('Found step 4 container for scroll');
        }
        
        if (targetElement) {
          // Scroll directly to the thank you page
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
          
          // Add small offset
          setTimeout(() => {
            const currentScroll = window.pageYOffset;
            window.scrollTo({
              top: currentScroll - 60,
              behavior: 'smooth'
            });
          }, 500);
          
          debugSystem.log('Scrolled to thank you page');
        } else {
          // Fallback: use the enhanced scroll function
          debugSystem.log('Using fallback scroll for thank you page');
          stepManager.scrollToTechPackTopEnhanced();
        }
      }, 800); // Longer delay to ensure DOM is fully updated
    }

    // ENHANCED: Updated showStep method to handle step 0 (registration check)
    showStep(stepNumber) {
      const steps = document.querySelectorAll('.techpack-step');
      
      steps.forEach(step => {
        step.style.display = 'none';
      });
      
      // Handle step 0 (registration check)
      if (stepNumber === 0) {
        const step0 = document.querySelector('#techpack-step-0');
        if (step0) {
          step0.style.display = 'block';
          state.currentStep = 0;
          debugSystem.log('Showing registration check (step 0)');
          return;
        } else {
          debugSystem.log('Step 0 (registration check) not found, falling back to step 1', null, 'warn');
          stepNumber = 1; // Fallback to step 1 if step 0 doesn't exist
        }
      }
      
      // Handle regular steps (1-4)
      const targetStep = document.querySelector(`[data-step="${stepNumber}"]`);
      if (targetStep) {
        targetStep.style.display = 'block';
        state.currentStep = stepNumber;
        
        // EXISTING: Keep your exact step-specific logic
        if (stepNumber === 2) {
          stepManager.syncStep2DOM();
        } else if (stepNumber === 3) {
          stepManager.refreshStep3Interface();
        } else if (stepNumber === 4) {
          stepManager.populateReview();
        }
        
        debugSystem.log('Showing step', { stepNumber });
      } else {
        debugSystem.log('Target step not found', { stepNumber }, 'error');
      }
    }
  }