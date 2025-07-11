 {
      countries.forEach((country) => {
        if (country.separator) {
          const separator = document.createElement('div');
          separator.className = 'techpack-form__dropdown-separator';
          this.dropdown.appendChild(separator);
          return;
        }

        const item = document.createElement('div');
        item.className = 'techpack-form__dropdown-item';
        item.innerHTML = `
          <span class="techpack-form__country-flag">${country.flag}</span>
          <span class="techpack-form__country-name">${country.name}</span>
        `;
        item.addEventListener('click', () => this.selectCountry(country));
        this.dropdown.appendChild(item);
      });
    }

    setupSearchListener(searchInput) {
      const debouncedSearch = Utils.debounce((searchTerm) => {
        this.populateDropdown(searchTerm);
      }, 200);

      searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
      });
      
      searchInput.addEventListener('click', (e) => e.stopPropagation());
      
      setTimeout(() => {
        searchInput.focus();
        if (searchInput.value) {
          searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
        }
      }, 0);
    }
    
    // In CountrySelector.selectCountry(), ADD this at the end:
    selectCountry(country) {
      this.input.value = country.name;
      this.closeDropdown();
      
      // Update form data
      if (state.formData.clientInfo) {
        state.formData.clientInfo.country = country.name;
      }
      
      // Clear error styling
      this.input.classList.remove('techpack-form__input--error');
      const errorDiv = this.input.parentElement.querySelector('.techpack-form__error');
      if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
      }
      
      // Trigger events
      this.input.dispatchEvent(new Event('change', { bubbles: true }));
      this.input.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Handle VAT field visibility
      this.handleVATFieldVisibility(country);
      
      // IMPORTANT: Trigger Step 1 validation after country change
      setTimeout(() => {
        stepManager.validateStep1();
      }, 100);
      
      // Animation feedback
      animationManager.pulse(this.input);
      
      debugSystem.log('Country selected', { country: country.name });
    }

    // In CountrySelector class, REPLACE handleVATFieldVisibility():
    handleVATFieldVisibility(country) {
      const vatContainer = document.getElementById('vat-ein-group');
      const vatInput = document.getElementById('vat-ein'); // This matches your HTML
      const vatLabel = document.getElementById('vat-ein-label');
      
      if (!vatContainer || !vatInput) return;
      
      const requiresVAT = COUNTRY_DATA.requiresVAT(country.code);
      const isNonEuEuropean = COUNTRY_DATA.isNonEuEuropean(country.code);
      const isUS = country.code === 'US';
      
      if (requiresVAT) {
        // Make VAT required for EU member countries only
        vatContainer.style.display = 'block';
        vatContainer.classList.add('techpack-form__group--required');
        vatInput.setAttribute('required', 'required');
        vatInput.setAttribute('data-required', 'true');
        
        // Set country-specific placeholder
        const countryCode = country.code;
        const placeholders = {
          'PT': 'e.g., PT123456789',
          'ES': 'e.g., ESA12345674', 
          'DE': 'e.g., DE123456789',
          'FR': 'e.g., FRAA123456789',
          'IT': 'e.g., IT12345678901',
          'NL': 'e.g., NL123456789B01',
          'BE': 'e.g., BE0123456789',
          'AT': 'e.g., ATU12345678',
          'SE': 'e.g., SE123456789012',
          'PL': 'e.g., PL1234567890',
          'CZ': 'e.g., CZ12345678'
        };
        
        vatInput.placeholder = placeholders[countryCode] || 'Enter VAT number';
        
        if (vatLabel) {
          vatLabel.innerHTML = 'VAT Number <span class="techpack-form__required">*</span>';
        }
        
        debugSystem.log('VAT field required for EU country', { country: country.name });
      } else if (isUS) {
        // Optional EIN for US
        vatContainer.style.display = 'block';
        vatContainer.classList.remove('techpack-form__group--required');
        vatInput.removeAttribute('required');
        vatInput.removeAttribute('data-required');
        vatInput.placeholder = 'e.g., 123456789';
        
        if (vatLabel) {
          vatLabel.innerHTML = 'EIN Number <span class="techpack-form__label-status">(optional)</span>';
        }
        
        // Clear errors since it's optional
        vatInput.classList.remove('techpack-form__input--error');
        const errorDiv = vatContainer.querySelector('.techpack-form__error');
        if (errorDiv) {
          errorDiv.textContent = '';
          errorDiv.style.display = 'none';
        }
        
        debugSystem.log('EIN field optional for US', { country: country.name });
      } else if (isNonEuEuropean) {
        // Optional for non-EU European countries
        vatContainer.style.display = 'block';
        vatContainer.classList.remove('techpack-form__group--required');
        vatInput.removeAttribute('required');
        vatInput.removeAttribute('data-required');
        
        if (country.code === 'GB') {
          vatInput.placeholder = 'e.g., GB123456789 (optional)';
          if (vatLabel) {
            vatLabel.innerHTML = 'UK VAT Number <span class="techpack-form__label-status">(optional)</span>';
          }
        } else if (country.code === 'CH') {
          vatInput.placeholder = 'e.g., CHE123456789MWST (optional)';
          if (vatLabel) {
            vatLabel.innerHTML = 'Swiss VAT Number <span class="techpack-form__label-status">(optional)</span>';
          }
        } else if (country.code === 'NO') {
          vatInput.placeholder = 'e.g., NO123456789MVA (optional)';
          if (vatLabel) {
            vatLabel.innerHTML = 'Norwegian VAT Number <span class="techpack-form__label-status">(optional)</span>';
          }
        } else {
          vatInput.placeholder = 'Tax number (optional)';
          if (vatLabel) {
            vatLabel.innerHTML = 'Tax Number <span class="techpack-form__label-status">(optional)</span>';
          }
        }
        
        // Clear errors since it's optional
        vatInput.classList.remove('techpack-form__input--error');
        const errorDiv = vatContainer.querySelector('.techpack-form__error');
        if (errorDiv) {
          errorDiv.textContent = '';
          errorDiv.style.display = 'none';
        }
        
        debugSystem.log('Tax number optional for non-EU European country', { country: country.name });
      } else {
        // Hide VAT field for other countries
        vatContainer.style.display = 'none';
        vatContainer.classList.remove('techpack-form__group--required');
        vatInput.removeAttribute('required');
        vatInput.removeAttribute('data-required');
        vatInput.value = '';
        
        debugSystem.log('VAT field hidden for non-European country', { country: country.name });
      }
    }
  }

  // Enhanced Quantity Calculator
  class QuantityCalculator {
    constructor() {
      this.setupEventListeners();
    }

    setupEventListeners() {
      // Listen for quantity input changes with debouncing
      const debouncedCalculate = Utils.debounce(() => {
        this.calculateAndUpdateProgress();
      }, 200);

      // Separate debounced validation to prevent interference
      const debouncedValidation = Utils.debounce(() => {
        stepManager.validateStep3();
      }, 500);

      document.addEventListener('input', (e) => {
        if (e.target.matches('.techpack-size-grid__input[type="number"]')) {
          // Update individual colorway totals immediately
          const colorway = e.target.closest('.techpack-colorway');
          if (colorway) {
            const colorwayId = colorway.dataset.colorwayId;
            this.updateColorwayTotal(colorwayId);
            this.validateQuantityInputs(colorwayId);
          }
          debouncedCalculate();
          
          // Don't trigger step validation immediately on quantity changes
          // Let printing method validation happen separately
        }
      });

      document.addEventListener('change', (e) => {
        if (e.target.matches('.techpack-size-grid__input[type="number"]')) {
          const colorway = e.target.closest('.techpack-colorway');
          if (colorway) {
            const colorwayId = colorway.dataset.colorwayId;
            this.updateColorwayTotal(colorwayId);
            this.validateQuantityInputs(colorwayId);
            this.updateGarmentTotal(colorway.closest('.techpack-garment').dataset.garmentId);
          }
          this.calculateAndUpdateProgress();
        }
      });
    }

    getColorwayCount() {
      const colorways = document.querySelectorAll('.techpack-colorway[data-colorway-id]');
      return Math.max(colorways.length, 1);
    }

    // FIXED: Calculate minimum based on EACH GARMENT individually with Our Blanks minimums
    calculateMinimumRequired() {
      let totalMinimum = 0;
      
      // Get all garments and calculate minimum for each
      const garments = document.querySelectorAll('.techpack-garment');
      
      garments.forEach(garment => {
        const colorwaysInGarment = garment.querySelectorAll('.techpack-colorway');
        const colorwayCount = colorwaysInGarment.length;
        const minimumPerColorway = getMinimumQuantity(colorwayCount);
        
        if (colorwayCount === 1) {
          // Single colorway minimum (30 for Our Blanks, 75 for Custom)
          totalMinimum += minimumPerColorway;
        } else {
          // Multiple colorways minimum per colorway (20 for Our Blanks, 50 for Custom)
          totalMinimum += colorwayCount * minimumPerColorway;
        }
      });
      
      // Ensure at least the single colorway minimum for the production type
      const fallbackMinimum = getMinimumQuantity(1);
      return Math.max(totalMinimum, fallbackMinimum);
    }

    getTotalQuantityFromAllColorways() {
      let total = 0;
      const colorwayInputs = document.querySelectorAll('.techpack-size-grid__input[type="number"]');
      
      colorwayInputs.forEach(input => {
        const value = parseInt(input.value) || 0;
        total += value;
      });
      
      return total;
    }

    calculateAndUpdateProgress() {
      const totalQuantity = this.getTotalQuantityFromAllColorways();
      const minimumRequired = this.calculateMinimumRequired();
      
      // FIXED: Get detailed garment breakdown for better messaging
      const garmentDetails = this.getGarmentDetails();
      const percentage = Math.min((totalQuantity / minimumRequired) * 100, 100);
      
      this.updateTotalQuantityDisplay(totalQuantity, minimumRequired, garmentDetails);
      this.updateStatusMessage(totalQuantity, minimumRequired, percentage, garmentDetails);
      this.updateColorwayValidationMessages();
      this.updateQuantityProgressBar(percentage);
      
      debugSystem.log('Quantity progress calculated', {
        total: totalQuantity,
        minRequired: minimumRequired,
        progress: percentage.toFixed(1) + '%',
        garmentDetails
      });
      
      return percentage;
    }

    // NEW: Get detailed breakdown of each garment
    getGarmentDetails() {
      const garments = document.querySelectorAll('.techpack-garment');
      return Array.from(garments).map(garment => {
        const colorways = garment.querySelectorAll('.techpack-colorway');
        return {
          colorways: colorways.length,
          total: this.getGarmentTotal(garment.dataset.garmentId)
        };
      });
    }

    // NEW: Get total for a specific garment
    getGarmentTotal(garmentId) {
      const garment = document.querySelector(`[data-garment-id="${garmentId}"]`);
      if (!garment) return 0;

      const colorways = garment.querySelectorAll('.techpack-colorway');
      let total = 0;

      colorways.forEach(colorway => {
        const colorwayId = colorway.dataset.colorwayId;
        total += this.updateColorwayTotal(colorwayId);
      });

      return total;
    }

    // FIXED: Update garment total display
    updateGarmentTotal(garmentId) {
      const garment = document.querySelector(`[data-garment-id="${garmentId}"]`);
      if (!garment) return 0;

      const total = this.getGarmentTotal(garmentId);

      const totalElement = garment.querySelector('.techpack-garment__total-value');
      if (totalElement) {
        totalElement.textContent = total;
      }

      return total;
    }

    updateTotalQuantityDisplay(totalQuantity, minimumRequired, colorwayCount) {
      const totalQuantityElement = document.querySelector('#total-quantity, .total-quantity-value, .techpack-total-quantity');
      if (totalQuantityElement) {
        const percentage = Math.min((totalQuantity / minimumRequired) * 100, 100);
        const currentPercentage = parseInt(totalQuantityElement.textContent) || 0;
        Utils.animateNumber(currentPercentage, Math.round(percentage), totalQuantityElement, '%');
      }
      
      const minTextElement = document.querySelector('#min-text, .total-quantity-text, [data-quantity-text]');
      if (minTextElement) {
        const singleMinimum = getMinimumQuantity(1);
        const newText = colorwayCount === 1 ? `/ ${singleMinimum} minimum` : `/ ${minimumRequired} minimum`;
        
        if (minTextElement.textContent !== newText) {
          minTextElement.style.opacity = '0.5';
          setTimeout(() => {
            minTextElement.textContent = newText;
            minTextElement.style.opacity = '1';
          }, 150);
        }
      }
      
      const quantityCounter = document.querySelector('.quantity-counter, .total-items');
      if (quantityCounter) {
        const colorwayText = colorwayCount === 1 ? '1 colorway' : `${colorwayCount} colorways`;
        quantityCounter.innerHTML = `<strong>${totalQuantity}</strong> units (${colorwayText})`;
      }
    }

    updateStatusMessage(totalQuantity, minimumRequired, percentage, colorwayCount) {
      const messageElement = document.querySelector('.techpack-colorways-message, .quantity-status-message');
      if (!messageElement) return;

      if (percentage >= 100) {
        messageElement.classList.add('success');
        messageElement.classList.remove('warning');
        messageElement.textContent = '✅ Minimum quantity reached!';
      } else {
        messageElement.classList.remove('success');
        messageElement.classList.add('warning');
        const remaining = minimumRequired - totalQuantity;
        
        if (colorwayCount === 1) {
          const singleMinimum = getMinimumQuantity(1);
          messageElement.textContent = `Need ${remaining} more units (${singleMinimum} minimum for single colorway)`;
        } else {
          const multipleMinimum = getMinimumQuantity(2);
          messageElement.textContent = `Need ${remaining} more units (${colorwayCount} colorways × ${multipleMinimum} each)`;
        }
      }
    }

    updateColorwayValidationMessages() {
      const garments = document.querySelectorAll('.techpack-garment');
      
      garments.forEach(garment => {
        const colorwaysInGarment = garment.querySelectorAll('.techpack-colorway[data-colorway-id]');
        const colorwayCountInGarment = colorwaysInGarment.length;
        
        colorwaysInGarment.forEach(colorway => {
          const colorwayId = colorway.dataset.colorwayId;
          const colorwayTotal = this.updateColorwayTotal(colorwayId);
          const requiredPerColorway = getMinimumQuantity(colorwayCountInGarment);
          
          let warningEl = colorway.querySelector('.colorway-minimum-warning');
          if (!warningEl) {
            warningEl = this.createColorwayWarningElement(colorway);
          }
          
          if (colorwayTotal < requiredPerColorway) {
            const remaining = requiredPerColorway - colorwayTotal;
            let message;
            
            if (colorwayCountInGarment === 1) {
              const singleMinimum = getMinimumQuantity(1);
              message = `⚠️ Need ${remaining} more units (${singleMinimum} minimum for single colorway)`;
            } else {
              const multipleMinimum = getMinimumQuantity(2);
              message = `⚠️ Need ${remaining} more units (${multipleMinimum} minimum per colorway when multiple colorways)`;
            }
            
            warningEl.innerHTML = message;
            warningEl.style.display = 'block';
            warningEl.className = 'colorway-minimum-warning warning';
            
            const totalEl = colorway.querySelector('.techpack-colorway__total-value');
            if (totalEl) {
              totalEl.style.cssText = 'color: #ef4444 !important; font-weight: bold !important; background: #fef2f2; padding: 0.25rem 0.5rem; border-radius: 0.25rem; border: 1px solid #fecaca;';
            }
          } else {
            const minimumText = getMinimumQuantity(colorwayCountInGarment);
            warningEl.style.display = 'block';
            warningEl.innerHTML = `✅ Perfect! ${colorwayTotal} units (Min: ${minimumText} ${colorwayCountInGarment === 1 ? 'for single colorway' : 'per colorway'})`;
            warningEl.className = 'colorway-minimum-warning success';
            
            const totalEl = colorway.querySelector('.techpack-colorway__total-value');
            if (totalEl) {
              totalEl.style.cssText = '';
            }
          }
        });
      });
    }

    createColorwayWarningElement(colorway) {
      const warningEl = document.createElement('div');
      warningEl.className = 'colorway-minimum-warning';
      warningEl.style.cssText = `
        padding: 0.75rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        margin-top: 0.75rem;
        transition: all 0.3s ease;
      `;
      
      const sizeGrid = colorway.querySelector('.techpack-size-grid');
      if (sizeGrid) {
        sizeGrid.insertAdjacentElement('afterend', warningEl);
      }
      
      return warningEl;
    }

    updateQuantityProgressBar(percentage) {
      try {
        const quantityProgressBar = document.getElementById('quantity-progress');
        
        if (quantityProgressBar) {
          try {
            quantityProgressBar.style.transition = 'width 0.5s ease-out, background-color 0.3s ease';
            quantityProgressBar.style.width = `${percentage}%`;
            
            if (percentage >= 100) {
              quantityProgressBar.classList.add('quantity-complete');
              quantityProgressBar.style.animationPlayState = 'running';
            } else {
              quantityProgressBar.classList.remove('quantity-complete');
              quantityProgressBar.style.animationPlayState = 'paused';
            }
          } catch (styleError) {
            debugSystem.log('❌ Error applying progress bar styles:', styleError, 'error');
          }
        } else {
          debugSystem.log('⚠️ Quantity progress bar element not found', null, 'warn');
        }

        const tracker = document.querySelector('.techpack-quantity-tracker');
        if (tracker) {
          try {
            const isComplete = percentage >= 100;
            tracker.classList.toggle('techpack-quantity-tracker--complete', isComplete);
            
            if (isComplete && !tracker.hasAttribute('data-achieved')) {
              tracker.setAttribute('data-achieved', 'true');
              tracker.classList.add('achievement-unlocked');
              setTimeout(() => {
                tracker.classList.remove('achievement-unlocked');
              }, 1000);
            } else if (!isComplete) {
              tracker.removeAttribute('data-achieved');
            }
          } catch (trackerError) {
            debugSystem.log('❌ Error updating quantity tracker:', trackerError, 'error');
          }
        }
      } catch (error) {
        debugSystem.log('❌ Critical error in updateQuantityProgressBar:', error, 'error');
        // Store error for next load
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('techpack_quantity_progress_error', JSON.stringify({
            error: error.message,
            timestamp: new Date().toISOString(),
            percentage: percentage
          }));
        }
      }
    }

    updateColorwayTotal(colorwayId) {
      const colorway = document.querySelector(`[data-colorway-id="${colorwayId}"]`);
      if (!colorway) return 0;

      const qtyInputs = colorway.querySelectorAll('.techpack-size-grid__input');
      let total = 0;

      qtyInputs.forEach(input => {
        const value = parseInt(input.value) || 0;
        total += value;
      });

      const totalElement = colorway.querySelector('.techpack-colorway__total-value');
      if (totalElement) {
        totalElement.textContent = total;
      }

      return total;
    }

    getMaxAllowedSizes(quantity) {
      if (quantity >= 300) return 7;
      if (quantity >= 150) return 6;
      if (quantity >= 75) return 5;
      if (quantity >= 50) return 4;
      if (quantity >= 30) return 3; // Updated for Our Blanks single colorway minimum
      if (quantity >= 20) return 2; // Updated for Our Blanks multiple colorway minimum
      if (quantity >= 1) return 1;
      return 0;
    }

    validateQuantityInputs(colorwayId) {
      const colorway = document.querySelector(`[data-colorway-id="${colorwayId}"]`);
      if (!colorway) return;

      const qtyInputs = colorway.querySelectorAll('.techpack-size-grid__input');
      const colorwayTotal = this.updateColorwayTotal(colorwayId);
      
      // FIXED: Get colorway count for THIS garment only
      const garment = colorway.closest('.techpack-garment');
      const colorwayCountInGarment = garment.querySelectorAll('.techpack-colorway').length;
      const requiredPerColorway = colorwayCountInGarment === 1 ? CONFIG.MIN_ORDER_QUANTITY : CONFIG.MIN_COLORWAY_QUANTITY;
      
      const activeSizes = Array.from(qtyInputs).filter(input => parseInt(input.value) || 0 > 0).length;
      const maxAllowedSizes = this.getMaxAllowedSizes(colorwayTotal);
      
      qtyInputs.forEach(input => {
        const value = parseInt(input.value) || 0;
        
        input.classList.remove('quantity-empty', 'quantity-filled', 'quantity-progress', 'quantity-excess', 'quantity-neutral');
        
        if (value > 0) {
          if (colorwayTotal < requiredPerColorway) {
            input.classList.add('quantity-progress');
          } else {
            input.classList.add('quantity-filled');
          }
        } else {
          if (colorwayTotal < requiredPerColorway) {
            input.classList.add('quantity-empty');
          } else {
            input.classList.add('quantity-neutral');
          }
        }
        
        if (activeSizes > maxAllowedSizes && value > 0) {
          input.classList.add('quantity-excess');
          input.title = `Too many sizes for ${colorwayTotal} units. Maximum ${maxAllowedSizes} sizes allowed.`;
        } else {
          input.title = '';
        }
      });
      
      // Update size distribution warning
      let warningEl = colorway.querySelector('.size-distribution-warning');
      if (!warningEl) {
        warningEl = this.createSizeWarningElement(colorway);
      }
      
      if (activeSizes > maxAllowedSizes) {
        warningEl.style.display = 'block';
        warningEl.innerHTML = `⚠️ Too many sizes! With ${colorwayTotal} units, you can use maximum ${maxAllowedSizes} sizes.`;
        warningEl.className = 'size-distribution-warning warning';
      } else if (colorwayTotal < requiredPerColorway) {
        warningEl.style.display = 'block';
        warningEl.innerHTML = `📊 Need ${requiredPerColorway - colorwayTotal} more units. Current: ${activeSizes} sizes, Max allowed: ${maxAllowedSizes} sizes.`;
        warningEl.className = 'size-distribution-warning info';
      } else {
        warningEl.style.display = 'block';
        warningEl.innerHTML = `✅ Perfect! ${colorwayTotal} units across ${activeSizes} sizes (Max: ${maxAllowedSizes}).`;
        warningEl.className = 'size-distribution-warning success';
      }
    }

    createSizeWarningElement(colorway) {
      const warningEl = document.createElement('div');
      warningEl.className = 'size-distribution-warning';
      warningEl.style.cssText = `
        padding: 0.75rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        margin-top: 0.75rem;
        transition: all 0.3s ease;
      `;
      
      const sizeGrid = colorway.querySelector('.techpack-size-grid');
      if (sizeGrid) {
        sizeGrid.insertAdjacentElement('afterend', warningEl);
      }
      
      return warningEl;
    }
  }

  // Enhanced Garment Manager
  class GarmentManager {
    constructor() {
      this.setupEventListeners();
    }

    setupEventListeners() {
      const addGarmentBtn = document.querySelector('#add-garment');
      if (addGarmentBtn) {
        addGarmentBtn.addEventListener('click', () => this.addGarment());
      }
    }

    addGarment() {
      const template = document.querySelector('#garment-template');
      const container = document.querySelector('#garments-container');
      
      if (!template || !container) return;

      const garmentId = `garment-${++state.counters.garment}`;
      const clone = template.content.cloneNode(true);
      const garment = clone.querySelector('.techpack-garment');
      
      garment.dataset.garmentId = garmentId;
      
      // Set the garment number based on current count of garments, not counter
      const currentGarmentCount = document.querySelectorAll('.techpack-garment').length + 1;
      garment.querySelector('.techpack-garment__number').textContent = currentGarmentCount;
      
      // Setup event listeners
      this.setupGarmentEventListeners(garment, garmentId);
      
      container.appendChild(garment);

      // Apply production-specific interface
      const productionType = state.formData.clientInfo.productionType || 'custom-production';
      stepManager.updateGarmentInterface(garment, productionType);
      
      // Add to state
      state.formData.garments.push({
        id: garmentId,
        type: '',
        fabric: '',
        printingMethods: [],
        colorways: []
      });
      
      // Add initial colorway
      this.addColorway(garmentId);
      
      // Animate in
      animationManager.slideIn(garment, 'down');
      
      // Trigger calculation
      setTimeout(() => quantityCalculator.calculateAndUpdateProgress(), 100);
      
      debugSystem.log('Garment added', { garmentId });
    }

    setupGarmentEventListeners(garment, garmentId) {
      // Remove button
      const removeBtn = garment.querySelector('.techpack-garment__remove');
      removeBtn.addEventListener('click', () => this.removeGarment(garmentId));
      
      // Add colorway button
      const addColorwayBtn = garment.querySelector('.add-colorway');
      addColorwayBtn.addEventListener('click', () => this.addColorway(garmentId));
      
      // Garment type select
      const garmentTypeSelect = garment.querySelector('select[name="garmentType"]');
      if (garmentTypeSelect) {
        garmentTypeSelect.addEventListener('change', () => {
          const garmentData = state.formData.garments.find(g => g.id === garmentId);
          if (garmentData) {
            garmentData.type = garmentTypeSelect.value;
          }
          stepManager.validateStep3();
        });
      }

      // Fabric type select
      const fabricSelect = garment.querySelector('select[name="fabricType"]');
      if (fabricSelect) {
        fabricSelect.addEventListener('change', () => {
          const garmentData = state.formData.garments.find(g => g.id === garmentId);
          if (garmentData) {
            garmentData.fabric = fabricSelect.value;
          }
          stepManager.validateStep3();
        });
      }

      // Printing methods
      this.setupPrintingMethodsLogic(garment, garmentId);
    }

    setupPrintingMethodsLogic(garment, garmentId) {
      const checkboxes = garment.querySelectorAll('input[name="printingMethods[]"]');
      const noneCheckbox = garment.querySelector('input[value="None"]');
      
      // Create a debounced validation function
      const debouncedValidation = Utils.debounce(() => {
        stepManager.validateStep3();
      }, 100);
      
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          // Handle "None" checkbox logic
          if (checkbox.value === 'None' && checkbox.checked) {
            checkboxes.forEach(cb => {
              if (cb.value !== 'None') cb.checked = false;
            });
          } else if (checkbox.value !== 'None' && checkbox.checked) {
            if (noneCheckbox) noneCheckbox.checked = false;
          }
          
          // Update state immediately
          const garmentData = state.formData.garments.find(g => g.id === garmentId);
          if (garmentData) {
            const checkedBoxes = garment.querySelectorAll('input[name="printingMethods[]"]:checked');
            garmentData.printingMethods = Array.from(checkedBoxes).map(cb => cb.value);
          }
          
          // Clear any existing error state immediately
          const printingGroup = garment.querySelector('.techpack-form__checkboxes')?.closest('.techpack-form__group');
          const printingError = printingGroup?.querySelector('.techpack-form__error');
          
          if (printingGroup) {
            printingGroup.classList.remove('techpack-form__group--error');
          }
          if (printingError) {
            printingError.textContent = '';
          }
          
          // Validate with debounce to prevent interference
          debouncedValidation();
        });
      });
    }

    removeGarment(garmentId) {
      const garment = document.querySelector(`[data-garment-id="${garmentId}"]`);
      if (!garment) return;
    
      const garments = document.querySelectorAll('.techpack-garment');
      if (garments.length <= 1) {
        debugSystem.log('Cannot remove last garment', null, 'warn');
        return;
      }
    
      // Remove from DOM with animation
      animationManager.fadeOut(garment).then(() => {
        garment.remove();
        
        // CRITICAL: Update state immediately after DOM removal
        state.formData.garments = state.formData.garments.filter(g => g.id !== garmentId);
        
        // IMPORTANT: Renumber all remaining garments
        this.renumberGarments();
        
        // Force immediate recalculation
        quantityCalculator.calculateAndUpdateProgress();
        
        // Update step validation
        stepManager.validateStep3();
        
        debugSystem.log('Garment removed and progress updated', { garmentId });
      });
    }

    // NEW METHOD: Renumber garments after deletion
    renumberGarments() {
      const garments = document.querySelectorAll('.techpack-garment');
      garments.forEach((garment, index) => {
        const numberElement = garment.querySelector('.techpack-garment__number');
        if (numberElement) {
          numberElement.textContent = index + 1;
        }
        
        // Also update any titles that show garment numbers
        const titleElement = garment.querySelector('.techpack-garment__title');
        if (titleElement) {
          const currentText = titleElement.textContent;
          // Replace any existing "Garment X" with the new number
          titleElement.textContent = currentText.replace(/Garment \d+/g, `Garment ${index + 1}`);
        }
      });
      
      debugSystem.log('Garments renumbered', { total: garments.length });
    }

    addColorway(garmentId) {
      const garment = document.querySelector(`[data-garment-id="${garmentId}"]`);
      const template = document.querySelector('#colorway-template');
      
      if (!garment || !template) return;

      const colorwaysList = garment.querySelector('.techpack-colorways__list');
      const colorwayId = `colorway-${++state.counters.colorway}`;
      const clone = template.content.cloneNode(true);
      const colorway = clone.querySelector('.techpack-colorway');
      
      colorway.dataset.colorwayId = colorwayId;
      
      this.setupColorwayEventListeners(colorway, garmentId, colorwayId);
      
      colorwaysList.appendChild(clone);
      
      // Add to state
      const garmentData = state.formData.garments.find(g => g.id === garmentId);
      if (garmentData) {
        garmentData.colorways.push({
          id: colorwayId,
          color: '#000000',
          pantone: '',
          quantities: {}
        });
      }
      
      // Animate in
      animationManager.slideIn(colorway, 'down');
      
      // CRITICAL: Don't trigger validation immediately, let it settle first
      setTimeout(() => {
        quantityCalculator.calculateAndUpdateProgress();
        // Use a longer delay for validation to prevent interference
        setTimeout(() => {
          stepManager.validateStep3();
        }, 200);
      }, 100);
      
      debugSystem.log('Colorway added', { garmentId, colorwayId });
    }

    setupColorwayEventListeners(colorway, garmentId, colorwayId) {
      // Remove button
      const removeBtn = colorway.querySelector('.techpack-colorway__remove');
      removeBtn.addEventListener('click', () => this.removeColorway(garmentId, colorwayId));
      
      // Color picker
      const colorPicker = colorway.querySelector('.techpack-color-picker__input');
      const colorPreview = colorway.querySelector('.techpack-color-picker__preview');
      
      colorPicker.addEventListener('change', function() {
        colorPreview.style.backgroundColor = this.value;
        const garmentData = state.formData.garments.find(g => g.id === garmentId);
        if (garmentData) {
          const colorwayData = garmentData.colorways.find(c => c.id === colorwayId);
          if (colorwayData) {
            colorwayData.color = this.value;
          }
        }
      });
      colorPreview.style.backgroundColor = colorPicker.value;
      
      // Pantone input
      const pantoneInput = colorway.querySelector('input[placeholder*="PANTONE"]');
      if (pantoneInput) {
        pantoneInput.addEventListener('input', () => {
          const garmentData = state.formData.garments.find(g => g.id === garmentId);
          if (garmentData) {
            const colorwayData = garmentData.colorways.find(c => c.id === colorwayId);
            if (colorwayData) {
              colorwayData.pantone = pantoneInput.value;
            }
          }
        });
      }

      // Quantity inputs
      const qtyInputs = colorway.querySelectorAll('.techpack-size-grid__input');
      qtyInputs.forEach(input => {
        const debouncedUpdate = Utils.debounce(() => {
          quantityCalculator.validateQuantityInputs(colorwayId);
          quantityCalculator.updateColorwayTotal(colorwayId);
          quantityCalculator.calculateAndUpdateProgress();
          
          // SMART: Only trigger step validation if quantities are sufficient
          const colorwayTotal = quantityCalculator.updateColorwayTotal(colorwayId);
          const garment = colorway.closest('.techpack-garment');
          const colorwayCountInGarment = garment.querySelectorAll('.techpack-colorway').length;
          const requiredPerColorway = getMinimumQuantity(colorwayCountInGarment);
          
          // Only validate step if we're close to or above minimum to avoid interference
          if (colorwayTotal >= requiredPerColorway * 0.8) {
            setTimeout(() => stepManager.validateStep3(), 300);
          }
        }, 200);

        input.addEventListener('input', debouncedUpdate);
        input.addEventListener('change', debouncedUpdate);
      });
    }

    removeColorway(garmentId, colorwayId) {
      const colorway = document.querySelector(`[data-colorway-id="${colorwayId}"]`);
      const garment = document.querySelector(`[data-garment-id="${garmentId}"]`);
      
      if (!colorway || !garment) return;

      const colorways = garment.querySelectorAll('.techpack-colorway');
      if (colorways.length <= 1) {
        debugSystem.log('Cannot remove last colorway', null, 'warn');
        return;
      }

      // CRITICAL: Update state immediately before DOM removal
      const garmentData = state.formData.garments.find(g => g.id === garmentId);
      if (garmentData) {
        garmentData.colorways = garmentData.colorways.filter(c => c.id !== colorwayId);
      }

      animationManager.fadeOut(colorway).then(() => {
        colorway.remove();
        
        // Recalculate and validate after DOM is updated
        setTimeout(() => {
          stepManager.validateStep3();
        }, 200);
      }, 50);
      
      debugSystem.log('Colorway removed', { garmentId, colorwayId });
    }
  } // End of GarmentManager class

  // Enhanced Form Initialization
  class FormInitializer {
    constructor() {
      this.initialized = false;
    }

    init() {
      if (this.initialized) return;
      
      debugSystem.log('Initializing TechPack Application');
      
      // Setup client verification modal
      this.setupClientModal();
      
      // EXISTING: Keep all your existing setup methods
      this.setupDateConstraints();
      this.setupPhoneFormatting();
      this.setupProductionTypeListener();
      this.setupNavigationButtons();
      this.setupFormSubmission();
      this.setupVATFormatting();
      this.setupRegistrationCheck();
      
      // CHANGED: Initialize with registration check (step 0) instead of step 1
      this.showStep(0);
      
      this.initialized = true;
      debugSystem.log('TechPack Application initialized successfully', null, 'success');
    }

// ENHANCED: Registration setup with comprehensive error handling and user feedback
    setupClientModal() {
      debugSystem.log('🔧 Setting up client verification modal...');
      
      const modal = document.querySelector('#client-verification-modal');
      const openBtn = document.querySelector('#open-client-modal');
      const closeBtn = document.querySelector('#close-client-modal');
      const backdrop = document.querySelector('.techpack-modal__backdrop');
      const existingClientBtn = document.querySelector('[data-client-type="existing"]');
      const newClientBtn = document.querySelector('[data-client-type="new"]');
      
      if (!modal || !openBtn) {
        debugSystem.log('❌ Modal elements not found, skipping modal setup', null, 'error');
        this.showStep(1); // Fallback to step 1
        return;
      }
      
      // Open modal
      openBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        debugSystem.log('✅ Client verification modal opened');
      });
      
      // Close modal functions
      const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
        debugSystem.log('Modal closed');
      };
      
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      if (backdrop) backdrop.addEventListener('click', closeModal);
      
      // Client type selection
      if (existingClientBtn) {
        existingClientBtn.addEventListener('click', () => {
          debugSystem.log('✅ Existing client selected');
          closeModal();
          setTimeout(() => this.showStep(1), 300);
        });
      }
      
      if (newClientBtn) {
        newClientBtn.addEventListener('click', () => {
          debugSystem.log('🆕 New client selected');
          closeModal();
          setTimeout(() => this.showStep(1), 300);
        });
      }
      
      debugSystem.log('✅ Client modal setup complete');
    }

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

      debugSystem.log('Date constraints applied', {
        min: dateInput.min,
        max: dateInput.max
      });
    }

    setupPhoneFormatting() {
      const phoneInput = document.getElementById('phone');
      if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
          e.target.value = Utils.formatPhoneNumber(e.target.value);
        });
      }
    }

    setupVATFormatting() {
      const vatInput = document.getElementById('vat-ein');
      if (vatInput) {
        vatInput.addEventListener('input', (e) => {
          e.target.value = Utils.formatVATNumber(e.target.value);
        });
      }
    }

    setupRegistrationCheck() {
      debugSystem.log('🔧 Setting up registration check functionality...');
      
      // Helper function to set button states
      const setButtonState = (button, state) => {
        if (!button) return;
        
        button.disabled = state === 'loading';
        
        // Remove existing state classes
        button.classList.remove('loading', 'normal', 'success', 'error');
        
        // Add new state class
        button.classList.add(state);
        
        // Update button text based on state
        if (state === 'loading') {
          button.textContent = 'Processing...';
        } else if (state === 'normal') {
          // Restore original text
          const originalText = button.getAttribute('data-original-text');
          if (originalText) {
            button.textContent = originalText;
          }
        }
      };
      
      // Helper function to show status messages
      const showStatus = (message, type = 'info') => {
        const statusDiv = document.querySelector('.techpack-status-message') || this.createStatusDiv();
        
        if (statusDiv) {
          statusDiv.textContent = message;
          statusDiv.className = `techpack-status-message ${type}`;
          statusDiv.style.display = 'block';
          
          // Auto-hide after 5 seconds for success messages
          if (type === 'success') {
            setTimeout(() => {
              statusDiv.style.display = 'none';
            }, 5000);
          }
        }
      };
      
      // Helper function to hide status messages
      const hideStatus = () => {
        try {
          const statusDiv = document.querySelector('.techpack-status-message');
          if (statusDiv) {
            statusDiv.style.display = 'none';
          }
        } catch (error) {
          debugSystem.log('⚠️ Status hide failed:', error, 'warn');
        }
      };
      
      // Helper function to find required DOM elements
      const findElements = () => {
        return {
          yesBtn: document.querySelector('#registration-yes-btn, .registration-yes-btn, [data-registration="yes"]'),
          noBtn: document.querySelector('#registration-no-btn, .registration-no-btn, [data-registration="no"]'),
          warningDiv: document.querySelector('.registration-warning, .techpack-warning')
        };
      };
      
      // Helper function to setup button handlers
      const setupButtonHandlers = (elements) => {
        const { yesBtn, noBtn, warningDiv } = elements;
        
        if (!yesBtn || !noBtn) {
          debugSystem.log('❌ Registration buttons not found', { yesBtn: !!yesBtn, noBtn: !!noBtn }, 'error');
          return false;
        }
        
        // Store original button text
        yesBtn.setAttribute('data-original-text', yesBtn.textContent);
        noBtn.setAttribute('data-original-text', noBtn.textContent);
        
        // Clear any existing event listeners
        yesBtn.replaceWith(yesBtn.cloneNode(true));
        noBtn.replaceWith(noBtn.cloneNode(true));
        
        // Get fresh references after cloning
        const freshYesBtn = document.querySelector('#registration-yes-btn, .registration-yes-btn, [data-registration="yes"]');
        const freshNoBtn = document.querySelector('#registration-no-btn, .registration-no-btn, [data-registration="no"]');
        
        // Enhanced YES button handler
        freshYesBtn.addEventListener('click', async (event) => {
          try {
            debugSystem.log('✅ YES button clicked - Registered client selected');
            event.preventDefault();
            event.stopPropagation();
            
            // Close modal immediately
            this.closeClientModal();
            
            // Show warning popup
            this.showWarningPopup(
              'Registration Verification Required',
              'We will verify your registration status during processing. If you\'re not registered in our system, your submission will be automatically rejected. Please ensure you have worked with us before selecting this option.',
              'warning'
            );
            
            // Configure for registered client
            state.formData.isRegisteredClient = true;
            this.configureStep1ForRegisteredClient();
            
            // Navigate to step 1
            setTimeout(async () => {
              try {
                debugSystem.log('🔄 Processing registered client navigation...');
                
                // Enhanced navigation with better error handling
                let navigationSuccess = false;
                try {
                  navigationSuccess = await stepManager.navigateToStep(1);
                } catch (navError) {
                  debugSystem.log('❌ Navigation error:', navError, 'error');
                  navigationSuccess = false;
                }
                
                if (!navigationSuccess) {
                  debugSystem.log('🔄 Primary navigation failed, trying fallback method', null, 'warn');
                  try {
                    stepManager.debugTestNavigation(1);
                    navigationSuccess = true;
                  } catch (fallbackError) {
                    debugSystem.log('❌ Fallback navigation failed:', fallbackError, 'error');
                    throw new Error('All navigation methods failed');
                  }
                }
                
                if (navigationSuccess) {
                  debugSystem.log('✅ Registration navigation successful');
                  // Add scroll after navigation
                  setTimeout(() => {
                    stepManager.scrollToTechPackTopEnhanced();
                  }, 600);
                } else {
                  throw new Error('Navigation failed completely');
                }
                
              } catch (processingError) {
                debugSystem.log('❌ Registration processing failed:', processingError, 'error');
                this.showWarningPopup('Error', 'Technical issue occurred. Please try again.', 'error');
              }
            }, 1000); // 1 second delay
            
          } catch (error) {
            debugSystem.log('❌ YES button handler failed:', error, 'error');
            this.showWarningPopup('Error', 'Unexpected error occurred. Please refresh the page.', 'error');
          }
        });

        // Enhanced NO button handler
        freshNoBtn.addEventListener('click', async (event) => {
          try {
            debugSystem.log('✅ NO button clicked - New client selected');
            event.preventDefault();
            event.stopPropagation();
            
            // Close modal immediately
            this.closeClientModal();
            
            // Configure for new client
            state.formData.isRegisteredClient = false;
            this.configureStep1ForNewClient();
            
            // Navigate to step 1
            setTimeout(async () => {
              try {
                debugSystem.log('🔄 Processing new client navigation...');
                
                // Enhanced navigation with better error handling
                let navigationSuccess = false;
                try {
                  navigationSuccess = await stepManager.navigateToStep(1);
                } catch (navError) {
                  debugSystem.log('❌ Navigation error:', navError, 'error');
                  navigationSuccess = false;
                }
                
                if (!navigationSuccess) {
                  debugSystem.log('🔄 Primary navigation failed, trying fallback method', null, 'warn');
                  try {
                    stepManager.debugTestNavigation(1);
                    navigationSuccess = true;
                  } catch (fallbackError) {
                    debugSystem.log('❌ Fallback navigation failed:', fallbackError, 'error');
                    throw new Error('All navigation methods failed');
                  }
                }
                
                if (navigationSuccess) {
                  debugSystem.log('✅ New client navigation successful');
                  // Add scroll after navigation
                  setTimeout(() => {
                    stepManager.scrollToTechPackTopEnhanced();
                  }, 600);
                } else {
                  throw new Error('Navigation failed completely');
                }
                
              } catch (processingError) {
                debugSystem.log('❌ New client processing failed:', processingError, 'error');
                this.showWarningPopup('Error', 'Technical issue occurred. Please try again.', 'error');
              }
            }, 500); // Shorter delay for new clients
            
          } catch (error) {
            debugSystem.log('❌ NO button handler failed:', error, 'error');
            this.showWarningPopup('Error', 'Unexpected error occurred. Please refresh the page.', 'error');
          }
        });

        debugSystem.log('✅ Registration check event listeners attached successfully');
        return true;
      };

      // Try immediate setup first
      const elements = findElements();
      if (setupButtonHandlers(elements)) {
        return;
      }

      // Retry mechanism with progressive delays
      let retryCount = 0;
      const maxRetries = 5;
      const retryDelays = [100, 250, 500, 1000, 2000];

      const retrySetup = () => {
        if (retryCount >= maxRetries) {
          debugSystem.log('❌ Registration button setup failed after all retries - continuing without registration check', null, 'error');
          // Force navigation to step 1 as fallback
          setTimeout(() => {
            stepManager.navigateToStep(1);
          }, 500);
          return;
        }

        setTimeout(() => {
          debugSystem.log(`🔄 Retry attempt ${retryCount + 1}/${maxRetries} for registration setup`);
          const retryElements = findElements();
          if (setupButtonHandlers(retryElements)) {
            debugSystem.log('✅ Registration setup successful after retry');
            return;
          }
          retryCount++;
          retrySetup();
        }, retryDelays[retryCount]);
      };

      retrySetup();
    }
    
    createStatusDiv() {
      const statusDiv = document.createElement('div');
      statusDiv.className = 'techpack-status-message';
      statusDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 4px;
        font-weight: 500;
        z-index: 10000;
        display: none;
        max-width: 300px;
        word-wrap: break-word;
      `;
      
      // Add to body
      document.body.appendChild(statusDiv);
      return statusDiv;
    }
    
    closeClientModal() {
      const modal = document.querySelector('#client-verification-modal');
      if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
        debugSystem.log('Client verification modal closed');
      }
    }
    
    showWarningPopup(title, message, type = 'warning') {
      // Remove any existing warning popup
      this.hideWarningPopup();
      
      // Create warning popup element
      const popup = document.createElement('div');
      popup.className = `techpack-warning-popup techpack-warning-popup--${type}`;
      popup.innerHTML = `
        <div class="techpack-warning-popup__backdrop"></div>
        <div class="techpack-warning-popup__content">
          <div class="techpack-warning-popup__header">
            <div class="techpack-warning-popup__icon">
              ${type === 'warning' ? `
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M12 2L2 20h20L12 2zm0 6v6m0 2v2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
                </svg>
              ` : type === 'error' ? `
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                  <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
                  <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
                </svg>
              ` : `
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path d="9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              `}
            </div>
            <h3 class="techpack-warning-popup__title">${title}</h3>
            <button type="button" class="techpack-warning-popup__close" onclick="this.closest('.techpack-warning-popup').remove()">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M15 5L5 15m0-10l10 10" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
          <div class="techpack-warning-popup__body">
            <p class="techpack-warning-popup__message">${message}</p>
          </div>
        </div>
      `;
      
      // Add to body
      document.body.appendChild(popup);
      
      // Show with animation
      setTimeout(() => popup.classList.add('show'), 10);
      
      // Auto-close after 5 seconds
      setTimeout(() => {
        if (popup.parentNode) {
          popup.classList.remove('show');
          setTimeout(() => popup.remove(), 300);
        }
      }, 5000);
      
      // Close on backdrop click
      popup.querySelector('.techpack-warning-popup__backdrop').addEventListener('click', () => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
      });
      
      debugSystem.log(`Warning popup shown: ${title}`, { type, message });
    }
    
    hideWarningPopup() {
      const existingPopup = document.querySelector('.techpack-warning-popup');
      if (existingPopup) {
        existingPopup.classList.remove('show');
        setTimeout(() => existingPopup.remove(), 300);
      }
    }

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

      // Move email field to row 1 to be side by side with company name
      const emailGroup = document.querySelector('#email').closest('.techpack-form__group');
      const companyGroup = document.querySelector('#company-name').closest('.techpack-form__group');
      
      if (emailGroup && companyGroup) {
        const row1 = companyGroup.closest('.techpack-form__row');
        const row2 = emailGroup.closest('.techpack-form__row');
        
        if (row1 && row2) {
          // Move email group to row 1
          row1.appendChild(emailGroup);
          
          // Hide row 2 if it's empty (after removing email and VAT/EIN)
          const remainingFieldsInRow2 = row2.querySelectorAll('.techpack-form__group:not([style*="display: none"])');
          if (remainingFieldsInRow2.length === 0) {
            row2.style.display = 'none';
          }
        }
      }

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

  // Initialize debug system FIRST
  const debugSystem = new DebugSystem();
  debugSystem.init();

  // CREATE STATE INSTANCE HERE (this line is missing!)
  const state = new TechPackState();

  // Global instances initialization
  const stepManager = new StepManager();
  const fileManager = new FileManager();
  const countrySelector = new CountrySelector();
  const quantityCalculator = new QuantityCalculator();
  const garmentManager = new GarmentManager();
  const formInitializer = new FormInitializer();

  // Global API exposure
  window.techpackApp = {
    state,
    debugSystem,
    stepManager,
    fileManager,
    countrySelector,
    quantityCalculator,
    garmentManager,
    formInitializer,
    
    // Public methods
    init() {
      formInitializer.init();
    },
    
    navigateToStep(stepNumber) {
      return stepManager.navigateToStep(stepNumber);
    },
    
    getState() {
      return state.getState();
    },
    
    reset() {
      state.reset();
      location.reload();
    },
    
    exportData() {
      const data = {
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        state: state.getState(),
        logs: debugSystem.logs
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `techpack-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

// ENHANCED: Robust initialization with multiple readiness checks and error handling
const initializeTechPackApp = () => {
  if (state.isInitialized) {
    debugSystem.log('⚠️ TechPack app already initialized, skipping...', null, 'warn');
    return;
  }

  debugSystem.log('🚀 Starting TechPack app initialization...');
  debugSystem.log('📋 Initialization context:', {
    readyState: document.readyState,
    hasBody: !!document.body,
    techpackElements: document.querySelectorAll('[id*="techpack"]').length,
    registrationButtons: document.querySelectorAll('[id*="registered-client"]').length,
    timestamp: new Date().toISOString()
  });

  try {
    formInitializer.init();
    state.isInitialized = true;
    debugSystem.log('✅ TechPack app initialization completed successfully', null, 'success');
  } catch (error) {
    debugSystem.log('❌ TechPack app initialization failed:', error, 'error');
    // Retry after a longer delay
    setTimeout(() => {
      debugSystem.log('🔄 Retrying TechPack app initialization...');
      try {
        formInitializer.init();
        state.isInitialized = true;
        debugSystem.log('✅ TechPack app initialization succeeded on retry', null, 'success');
      } catch (retryError) {
        debugSystem.log('❌ TechPack app initialization failed on retry:', retryError, 'error');
      }
    }, 1000);
  }
};

// Enhanced multi-stage initialization with comprehensive DOM readiness checks
const setupInitialization = () => {
  debugSystem.log('🔧 Setting up TechPack app initialization...');
  
  // Stage 1: Immediate check if DOM is already ready
  if (document.readyState === 'complete') {
    debugSystem.log('📋 DOM already complete, initializing immediately');
    setTimeout(initializeTechPackApp, 50);
    return;
  }
  
  // Stage 2: DOM loaded but resources might still be loading
  if (document.readyState === 'interactive') {
    debugSystem.log('📋 DOM interactive, initializing with short delay');
    setTimeout(initializeTechPackApp, 100);
    return;
  }
  
  // Stage 3: DOM still loading, wait for DOMContentLoaded
  if (document.readyState === 'loading') {
    debugSystem.log('📋 DOM still loading, waiting for DOMContentLoaded event');
    document.addEventListener('DOMContentLoaded', () => {
      debugSystem.log('📋 DOMContentLoaded fired, initializing...');
      setTimeout(initializeTechPackApp, 100);
    });
    
    // Additional safety net - wait for window load as well
    window.addEventListener('load', () => {
      if (!state.isInitialized) {
        debugSystem.log('📋 Window load fired and app not initialized, initializing now...');
        setTimeout(initializeTechPackApp, 50);
      }
    });
    
    // Ultimate fallback - force initialization after reasonable time
    setTimeout(() => {
      if (!state.isInitialized) {
        debugSystem.log('⏰ Timeout reached, forcing initialization...', null, 'warn');
        initializeTechPackApp();
      }
    }, 3000);
  }
};

// Immediate setup
setupInitialization();

  // Expose debug system globally for console access
  window.debugSystem = debugSystem;

  // Global utility functions
  window.recalculateProgress = function() {
    debugSystem.log('Manually recalculating progress...');
    const result = quantityCalculator.calculateAndUpdateProgress();
    debugSystem.log('Current progress:', result + '%');
    return result;
  };

  window.toggleDebug = function() {
    debugSystem.toggle();
  };

  debugSystem.log('TechPack Enhanced Application Loaded', { version: '2.0.0' }, 'success');

})();