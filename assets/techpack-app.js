(function() {
  'use strict';

  // Application state
  let currentStep = 1;
  let formData = {
    clientInfo: {},
    files: [],
    garments: []
  };
  let fileCounter = 0;
  let garmentCounter = 0;
  let colorwayCounter = 0;

  // Debug system
  const debug = {
    enabled: false,
    panel: null,
    content: null,
    log: function(message, data = null) {
      if (this.enabled) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}`;
        console.log(logEntry, data || '');
        
        if (this.content) {
          const logElement = document.createElement('div');
          logElement.textContent = logEntry;
          if (data) {
            logElement.textContent += ' ' + JSON.stringify(data);
          }
          this.content.appendChild(logElement);
          this.panel.scrollTop = this.panel.scrollHeight;
        }
      }
    }
  };

  // Country data with European countries for VAT requirement - Enhanced with flags and priority order
  const countries = [
    // Priority countries first
    { name: "United States", code: "US", flag: "🇺🇸" },
    { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
    { name: "Portugal", code: "PT", flag: "🇵🇹" },
    
    // Separator
    { name: "separator", code: "", flag: "" },
    
    // European countries alphabetically
    { name: "Austria", code: "AT", flag: "🇦🇹" },
    { name: "Belgium", code: "BE", flag: "🇧🇪" },
    { name: "Bulgaria", code: "BG", flag: "🇧🇬" },
    { name: "Croatia", code: "HR", flag: "🇭🇷" },
    { name: "Cyprus", code: "CY", flag: "🇨🇾" },
    { name: "Czech Republic", code: "CZ", flag: "🇨🇿" },
    { name: "Denmark", code: "DK", flag: "🇩🇰" },
    { name: "Estonia", code: "EE", flag: "🇪🇪" },
    { name: "Finland", code: "FI", flag: "🇫🇮" },
    { name: "France", code: "FR", flag: "🇫🇷" },
    { name: "Germany", code: "DE", flag: "🇩🇪" },
    { name: "Greece", code: "GR", flag: "🇬🇷" },
    { name: "Hungary", code: "HU", flag: "🇭🇺" },
    { name: "Iceland", code: "IS", flag: "🇮🇸" },
    { name: "Ireland", code: "IE", flag: "🇮🇪" },
    { name: "Italy", code: "IT", flag: "🇮🇹" },
    { name: "Latvia", code: "LV", flag: "🇱🇻" },
    { name: "Lithuania", code: "LT", flag: "🇱🇹" },
    { name: "Luxembourg", code: "LU", flag: "🇱🇺" },
    { name: "Malta", code: "MT", flag: "🇲🇹" },
    { name: "Netherlands", code: "NL", flag: "🇳🇱" },
    { name: "Norway", code: "NO", flag: "🇳🇴" },
    { name: "Poland", code: "PL", flag: "🇵🇱" },
    { name: "Romania", code: "RO", flag: "🇷🇴" },
    { name: "Slovakia", code: "SK", flag: "🇸🇰" },
    { name: "Slovenia", code: "SI", flag: "🇸🇮" },
    { name: "Spain", code: "ES", flag: "🇪🇸" },
    { name: "Sweden", code: "SE", flag: "🇸🇪" },
    { name: "Switzerland", code: "CH", flag: "🇨🇭" }
  ];

  // European countries for VAT requirement
  const europeanCountries = [
    'Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria',
    'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany',
    'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Latvia', 'Liechtenstein', 'Lithuania',
    'Luxembourg', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'North Macedonia',
    'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia',
    'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom', 'Vatican City'
  ];

  // DOM elements
  const steps = document.querySelectorAll('.techpack-step');

  // Initialize application
  function init() {
    if (window.techpackApp && window.techpackApp.initialized) {
      return; // Already initialized, don't run again
    }
    
    if (!steps.length) return;
    
    debug.log('Initializing TechPack Application');
    
    initializeDebugSystem();
    initializeStep1();
    initializeStep2();
    initializeStep3();
    initializeStep4();
    showStepWithAnimation(1);
    
    debug.log('TechPack Application initialized successfully');
  }

  // Debug System
  function initializeDebugSystem() {
    debug.panel = document.getElementById('debug-panel');
    debug.content = document.getElementById('debug-content');
    
    // Create debug panel if it doesn't exist
    if (!debug.panel) {
      debug.panel = document.createElement('div');
      debug.panel.id = 'debug-panel';
      debug.panel.className = 'debug-panel';
      debug.panel.innerHTML = '<div id="debug-content">Debug info will appear here...</div>';
      document.body.appendChild(debug.panel);
      debug.content = document.getElementById('debug-content');
    }
  
    // COMMENT OUT OR REMOVE THIS SECTION:
    /*
    // Create debug toggle if it doesn't exist
    if (!document.querySelector('.debug-toggle')) {
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'debug-toggle';
      toggleBtn.textContent = 'Debug';
      toggleBtn.onclick = toggleDebug;
      document.body.appendChild(toggleBtn);
    }
    */
  
    // Add debug controls
    if (debug.panel && debug.content) {
      const clearButton = document.createElement('button');
      clearButton.textContent = 'Clear';
      clearButton.style.cssText = 'position: absolute; top: 5px; right: 5px; background: #374151; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 3px; font-size: 0.6rem; cursor: pointer;';
      clearButton.onclick = function() {
        debug.content.innerHTML = 'Debug log cleared...';
      };
      debug.panel.appendChild(clearButton);
    }
  
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggleDebug();
      }
    });
  }

  // Step navigation
  function showStep(stepNumber) {
    debug.log('Navigating to step', stepNumber);
    
    steps.forEach(step => {
      step.style.display = 'none';
    });
    
    const targetStep = document.querySelector(`[data-step="${stepNumber}"]`);
    if (targetStep) {
      targetStep.style.display = 'block';
      currentStep = stepNumber;
      updateStepProgress(); // FIXED: Use separate function for step progress
      
      // Sync DOM with formData when returning to step 2
      if (stepNumber === 2) {
        syncStep2DOM();
      }
    }

    // Populate review when reaching step 4
    if (stepNumber === 4) {
      populateReview();
    }
  }

  // Enhanced step transition function
  function showStepWithAnimation(stepNumber) {
    const currentStepEl = document.querySelector(`.techpack-step[data-step="${currentStep}"]`);
    const targetStepEl = document.querySelector(`.techpack-step[data-step="${stepNumber}"]`);
    
    if (!targetStepEl) return;
  
    // Add exit animation to current step
    if (currentStepEl) {
      currentStepEl.style.opacity = '0';
      currentStepEl.style.transform = 'translateX(-20px)';
    }
  
    setTimeout(() => {
      // Hide all steps
      steps.forEach(step => {
        step.style.display = 'none';
      });
  
      // Show target step with entrance animation
      targetStepEl.style.display = 'block';
      targetStepEl.style.opacity = '0';
      targetStepEl.style.transform = 'translateX(20px)';
      
      // Force reflow
      targetStepEl.offsetHeight;
      
      // Animate in
      targetStepEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      targetStepEl.style.opacity = '1';
      targetStepEl.style.transform = 'translateX(0)';
      
      currentStep = stepNumber;
      updateStepProgress(); // FIXED: Use separate function for step progress
      
      // Sync DOM with formData when returning to step 2
      if (stepNumber === 2) {
        syncStep2DOM();
      }

      // NEW: Refresh Step 3 interface when entering
      if (stepNumber === 3) {
        refreshStep3Interface();
      }
  
      // Populate review when reaching step 4
      if (stepNumber === 4) {
        populateReview();
      }
    }, 200);
  }
  
  // FIXED: Separate step progress update function that ONLY handles step navigation
  function updateStepProgress() {
    // Find the step container that's currently visible
    const container = document.querySelector(`.techpack-step[data-step="${currentStep}"]`);
    if (!container) return;
  
    // Within that container, grab its STEP PROGRESS fill bar & its circles
    const stepFillBar = container.querySelector('.techpack-progress__fill');
    const stepProgressSteps = Array.from(container.querySelectorAll('.techpack-progress__step'));
  
    // Compute 0-based index & percent
    const zeroIndex = currentStep - 1;
    const totalSteps = stepProgressSteps.length;
    const pct = totalSteps > 1
      ? (zeroIndex / (totalSteps - 1)) * 100
      : 0;
  
    // Apply width with smooth animation - ONLY to step progress bar
    if (stepFillBar) {
      stepFillBar.style.transition = 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      stepFillBar.style.width = pct + '%';
      
      // Add glow effect during transition
      stepFillBar.classList.add('progress-animating');
      setTimeout(() => {
        stepFillBar.classList.remove('progress-animating');
      }, 600);
    }
  
    // Toggle classes on step circles only with staggered animation
    stepProgressSteps.forEach((el, i) => {
      setTimeout(() => {
        el.classList.toggle('techpack-progress__step--completed', i < zeroIndex);
        el.classList.toggle('techpack-progress__step--active', i === zeroIndex);
      }, i * 100); // Stagger the animations
    });

    console.log('Step Progress Updated:', { currentStep, percentage: pct });
  }

  // FIXED: Count active colorways across all garments
  function getColorwayCount() {
    const colorways = document.querySelectorAll('.techpack-colorway[data-colorway-id]');
    return colorways.length || 1; // Default to 1 if no colorways found yet
  }

  // NEW: Calculate maximum allowed sizes based on quantity
  function getMaxAllowedSizes(quantity) {
    if (quantity >= 300) return 7; // All sizes allowed
    if (quantity >= 150) return 6;
    if (quantity >= 75) return 5;
    if (quantity >= 50) return 4;
    if (quantity >= 25) return 3;
    if (quantity >= 15) return 2;
    if (quantity >= 1) return 1;
    return 0; // No sizes allowed if no quantity
  }
  
  // FIXED: Dynamic minimum calculation based on colorway count
  function calculateMinimumRequired() {
    const colorwayCount = getColorwayCount();
    
    if (colorwayCount === 1) {
      return 75; // Single colorway needs 75 units minimum
    } else if (colorwayCount >= 2) {
      return colorwayCount * 50; // Multiple colorways need 50 units each
    }
    
    return 75; // Default fallback
  }
  
  // Get total quantity from all colorway inputs
  function getTotalQuantityFromAllColorways() {
    let total = 0;
    const colorwayInputs = document.querySelectorAll('.techpack-size-grid__input[type="number"]');
    
    colorwayInputs.forEach(input => {
      const value = parseInt(input.value) || 0;
      total += value;
    });
    
    return total;
  }

  // FIXED: Better percentage display and compact spacing
  function updateTotalQuantityDisplay(totalQuantity, minimumRequired, colorwayCount) {
    // Update the main percentage display (the big number)
    const totalQuantityElement = document.querySelector('#total-quantity, .total-quantity-value, .techpack-total-quantity');
    if (totalQuantityElement) {
      const percentage = Math.min((totalQuantity / minimumRequired) * 100, 100);
      
      // Show percentage with % symbol
      const currentPercentage = parseInt(totalQuantityElement.textContent) || 0;
      animateNumber(currentPercentage, Math.round(percentage), totalQuantityElement, '%');
    }
    
    // FIXED: Update the descriptive text (compact version)
    const minTextElement = document.querySelector('#min-text, .total-quantity-text, [data-quantity-text]');
    if (minTextElement) {
      let newText;
      if (colorwayCount === 1) {
        newText = '/ 75 minimum';
      } else {
        newText = `/ ${minimumRequired} minimum`;
      }
      
      // Only update if text has changed to prevent flicker
      if (minTextElement.textContent !== newText) {
        minTextElement.style.opacity = '0.5';
        setTimeout(() => {
          minTextElement.textContent = newText;
          minTextElement.style.opacity = '1';
        }, 150);
      }
    }
    
    // Update any quantity counter elements
    const quantityCounter = document.querySelector('.quantity-counter, .total-items');
    if (quantityCounter) {
      if (colorwayCount === 1) {
        quantityCounter.innerHTML = `<strong>${totalQuantity}</strong> units (1 colorway)`;
      } else {
        quantityCounter.innerHTML = `<strong>${totalQuantity}</strong> units (${colorwayCount} colorways)`;
      }
    }
  }
  
  // FIXED: Main calculation function with proper updates - COMPLETELY SEPARATE from step progress
  function calculateAndUpdateProgress() {
    const totalQuantity = getTotalQuantityFromAllColorways();
    const minimumRequired = calculateMinimumRequired();
    const colorwayCount = getColorwayCount();
    
    // Calculate percentage correctly based on dynamic minimum
    const percentage = Math.min((totalQuantity / minimumRequired) * 100, 100);
    
    // Update all displays
    updateTotalQuantityDisplay(totalQuantity, minimumRequired, colorwayCount);
    updateStatusMessage(totalQuantity, minimumRequired, percentage, colorwayCount);
    updateColorwayValidationMessages(); // Update individual colorway warnings
    
    // FIXED: Update ONLY the quantity progress bar (NOT the step progress bar)
    updateQuantityProgressBar(percentage);
    
    console.log(`Quantity Progress: Colorways: ${colorwayCount}, Total: ${totalQuantity}, Min Required: ${minimumRequired}, Progress: ${percentage.toFixed(1)}%`);
    
    return percentage;
  }

  // FIXED: NEW separate function to update ONLY the quantity progress bar
  function updateQuantityProgressBar(percentage) {
    // Target ONLY the quantity progress bar by its specific ID
    const quantityProgressBar = document.getElementById('quantity-progress');
    
    if (quantityProgressBar) {
      // Smooth progress bar animation
      quantityProgressBar.style.transition = 'width 0.5s ease-out, background-color 0.3s ease';
      quantityProgressBar.style.width = `${percentage}%`;
      
      // Add completion effects
      if (percentage >= 100) {
        quantityProgressBar.classList.add('quantity-complete');
        quantityProgressBar.style.animationPlayState = 'running';
      } else {
        quantityProgressBar.classList.remove('quantity-complete');
        quantityProgressBar.style.animationPlayState = 'paused';
      }
      
      console.log('Quantity Progress Bar Updated:', percentage + '%');
    } else {
      console.warn('Quantity progress bar #quantity-progress not found in DOM');
    }

    // Enhanced tracker styling
    const tracker = document.querySelector('.techpack-quantity-tracker');
    if (tracker) {
      const isComplete = percentage >= 100;
      tracker.classList.toggle('techpack-quantity-tracker--complete', isComplete);
      
      // Add achievement effect when reaching minimum
      if (isComplete && !tracker.hasAttribute('data-achieved')) {
        tracker.setAttribute('data-achieved', 'true');
        tracker.classList.add('achievement-unlocked');
        setTimeout(() => {
          tracker.classList.remove('achievement-unlocked');
        }, 1000);
      } else if (!isComplete) {
        tracker.removeAttribute('data-achieved');
      }
    }
  }

  // NEW: Update colorway validation messages with red highlights
  function updateColorwayValidationMessages() {
    const colorways = document.querySelectorAll('.techpack-colorway[data-colorway-id]');
    const totalColorways = colorways.length;
    
    colorways.forEach(colorway => {
      const colorwayId = colorway.dataset.colorwayId;
      const colorwayTotal = updateColorwayTotal(colorwayId);
      
      // Determine minimum for this specific colorway
      const requiredPerColorway = totalColorways === 1 ? 75 : 50;
      
      // Find or create warning element
      let warningEl = colorway.querySelector('.colorway-minimum-warning');
      if (!warningEl) {
        warningEl = document.createElement('div');
        warningEl.className = 'colorway-minimum-warning';
        warningEl.style.cssText = `
          color: #ef4444;
          background: #fef2f2;
          border: 1px solid #fecaca;
          padding: 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          margin-top: 0.5rem;
          display: none;
        `;
        
        // Insert after the colorway total
        const totalElement = colorway.querySelector('.techpack-colorway__total-value');
        if (totalElement && totalElement.parentNode) {
          totalElement.parentNode.insertAdjacentElement('afterend', warningEl);
        }
      }
      
      // Show/hide warning based on quantity
      if (colorwayTotal < requiredPerColorway) {
        const remaining = requiredPerColorway - colorwayTotal;
        if (totalColorways === 1) {
          warningEl.innerHTML = `⚠️ Need ${remaining} more units (75 minimum for single colorway)`;
        } else {
          warningEl.innerHTML = `⚠️ Need ${remaining} more units (50 minimum per colorway)`;
        }
        warningEl.style.display = 'block';
        
        // Add red highlight to colorway total
        const totalEl = colorway.querySelector('.techpack-colorway__total-value');
        if (totalEl) {
          totalEl.style.color = '#ef4444';
          totalEl.style.fontWeight = 'bold';
        }
      } else {
        warningEl.style.display = 'none';
        
        // Remove red highlight from colorway total
        const totalEl = colorway.querySelector('.techpack-colorway__total-value');
        if (totalEl) {
          totalEl.style.color = '';
          totalEl.style.fontWeight = '';
        }
      }
    });
  }
  
  // UPDATED: Status message with dynamic requirements
  function updateStatusMessage(totalQuantity, minimumRequired, percentage, colorwayCount) {
    const messageElement = document.querySelector('.techpack-colorways-message, .quantity-status-message');
    if (messageElement) {
      if (percentage >= 100) {
        messageElement.classList.add('success');
        messageElement.classList.remove('warning');
        messageElement.textContent = `✅ Minimum quantity reached!`;
      } else {
        messageElement.classList.remove('success');
        messageElement.classList.add('warning');
        const remaining = minimumRequired - totalQuantity;
        
        if (colorwayCount === 1) {
          messageElement.textContent = `Need ${remaining} more units (75 minimum for single colorway)`;
        } else {
          messageElement.textContent = `Need ${remaining} more units (${colorwayCount} colorways × 50 each)`;
        }
      }
    }
  }
  
  // FIXED: Animate number changes with optional suffix
  function animateNumber(start, end, element, suffix = '') {
    const duration = 500; // ms
    const startTime = Date.now();
    
    function update() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * easeOut);
      
      element.textContent = `${current}${suffix}`;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }
  
  // Event listeners to trigger calculations
  document.addEventListener('input', function(e) {
    // Listen for quantity input changes
    if (e.target.matches('.techpack-size-grid__input[type="number"]')) {
      setTimeout(() => {
        calculateAndUpdateProgress();
      }, 50);
    }
  });
  
  document.addEventListener('change', function(e) {
    // Listen for quantity changes
    if (e.target.matches('.techpack-size-grid__input[type="number"]')) {
      setTimeout(() => {
        calculateAndUpdateProgress();
      }, 50);
    }
  });
  
  // Initialize on page load
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
      calculateAndUpdateProgress();
    }, 100);
  });
  
  // Manual trigger for debugging
  window.recalculateProgress = function() {
    console.log('Manually recalculating progress...');
    const colorways = getColorwayCount();
    const total = getTotalQuantityFromAllColorways();
    const minimum = calculateMinimumRequired();
    console.log(`Colorways: ${colorways}, Total: ${total}, Required: ${minimum}`);
    const result = calculateAndUpdateProgress();
    console.log('Current progress:', result + '%');
    return result;
  };

// Step 1: Client Information
  function initializeStep1() {
    debug.log('Initializing Step 1: Client Information');
    
    const form = document.querySelector('#techpack-step-1 form');
    const nextBtn = document.querySelector('#step-1-next');
    
    if (!form || !nextBtn) {
      debug.log('Step 1 elements not found');
      return;
    }

    // Setup enhanced country dropdown
    setupCountryDropdown();
    
    // Setup date constraints (6 weeks minimum)
    setupDateConstraints();
    
    // Setup phone formatting
    setupPhoneFormatting();

    // NEW: Setup production type listener
    setupProductionTypeListener();

    // Form validation
    form.addEventListener('input', validateStep1);
    form.addEventListener('change', validateStep1);

    // Next button
    nextBtn.addEventListener('click', function() {
      debug.log('Step 1 next button clicked');
      if (validateStep1()) {
        saveStep1Data();
        showStepWithAnimation(2);
      }
    });

    validateStep1();
    debug.log('Step 1 initialized successfully');
  }

// Enhanced Country Dropdown Setup - This should be a SEPARATE function
function setupCountryDropdown() {
  const countryWrapper = document.querySelector('.techpack-form__country-wrapper');
  if (!countryWrapper) return;

  const countryInput = countryWrapper.querySelector('.techpack-form__country-input');
  const dropdown = countryWrapper.querySelector('.techpack-form__dropdown');
  const toggle = countryWrapper.querySelector('.techpack-form__country-toggle');
  
  let isOpen = false;
  let highlightedIndex = -1;

  // Add the touched event listeners
  if (countryInput) {
    countryInput.addEventListener('focus', function() {
      this.dataset.touched = 'true';
    });

    countryInput.addEventListener('click', function() {
      this.dataset.touched = 'true';
    });
  }
  
  function populateDropdown(searchTerm = '') {
    dropdown.innerHTML = '';
    
    // Add search input
    const searchInput = document.createElement('input');
    searchInput.className = 'techpack-form__dropdown-search';
    searchInput.placeholder = 'Search countries...';
    searchInput.type = 'text';
    searchInput.value = searchTerm;
    dropdown.appendChild(searchInput);
  
    // Filter countries based on search
    let displayCountries;
    if (searchTerm) {
      displayCountries = countries.filter(country => 
        country.name !== 'separator' && 
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      displayCountries = countries;
    }
  
    if (searchTerm && displayCountries.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'techpack-form__dropdown-empty';
      emptyDiv.textContent = 'No countries found';
      dropdown.appendChild(emptyDiv);
      setupSearchListener(searchInput);
      return;
    }
  
    // Show priority countries first (only if no search)
    if (!searchTerm) {
      const priorityCountries = displayCountries.slice(0, 3);
      priorityCountries.forEach((country) => {
        if (country.name === 'separator') return;
        
        const item = document.createElement('div');
        item.className = 'techpack-form__dropdown-item techpack-form__dropdown-item--priority';
        item.innerHTML = `
          <span class="techpack-form__country-flag">${country.flag}</span>
          <span class="techpack-form__country-name">${country.name}</span>
        `;
        item.addEventListener('click', () => selectCountry(country));
        dropdown.appendChild(item);
      });
  
      // Add separator
      const separator = document.createElement('div');
      separator.className = 'techpack-form__dropdown-separator';
      dropdown.appendChild(separator);
  
      // Other countries
      const otherCountries = displayCountries.slice(4);
      otherCountries.forEach((country) => {
        const item = document.createElement('div');
        item.className = 'techpack-form__dropdown-item';
        item.innerHTML = `
          <span class="techpack-form__country-flag">${country.flag}</span>
          <span class="techpack-form__country-name">${country.name}</span>
        `;
        item.addEventListener('click', () => selectCountry(country));
        dropdown.appendChild(item);
      });
    } else {
      // When searching, show all results without priority grouping
      displayCountries.forEach((country) => {
        const item = document.createElement('div');
        item.className = 'techpack-form__dropdown-item';
        item.innerHTML = `
          <span class="techpack-form__country-flag">${country.flag}</span>
          <span class="techpack-form__country-name">${country.name}</span>
        `;
        item.addEventListener('click', () => selectCountry(country));
        dropdown.appendChild(item);
      });
    }
  
    setupSearchListener(searchInput);
  }
  
  function setupSearchListener(searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value;
      populateDropdown(searchTerm);
    });
    
    searchInput.addEventListener('click', (e) => e.stopPropagation());
    
    // Focus the search input
    setTimeout(() => {
      searchInput.focus();
      if (searchInput.value) {
        searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
      }
    }, 0);
  }
  
    function selectCountry(country) {
      countryInput.value = country.name;
      closeDropdown();
      
      // Update form data
      if (formData) {
        formData.country = country.name;
      }
      
      // IMPORTANT: Mark the field as valid and remove error styling
      countryInput.classList.remove('techpack-form__input--error');
      const errorDiv = countryInput.parentElement.querySelector('.techpack-form__error');
      if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
      }
      
      // Trigger change and input events for validation
      countryInput.dispatchEvent(new Event('change', { bubbles: true }));
      countryInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Handle VAT field visibility
      handleVATFieldVisibility(country);
      
      // Run step validation
      if (typeof validateStep1 === 'function') {
        validateStep1();
      }
      
      // Add selection animation
      countryInput.style.transform = 'scale(1.02)';
      setTimeout(() => {
        countryInput.style.transform = '';
      }, 150);
    }
  
    function openDropdown() {
      if (isOpen) return;
      
      isOpen = true;
      populateDropdown();
      dropdown.classList.add('techpack-form__dropdown--active');
      toggle.classList.add('techpack-form__country-toggle--open');
      
      setTimeout(() => {
        const searchInput = dropdown.querySelector('.techpack-form__dropdown-search');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  
    function closeDropdown() {
      isOpen = false;
      dropdown.classList.remove('techpack-form__dropdown--active');
      toggle.classList.remove('techpack-form__country-toggle--open');
      highlightedIndex = -1;
    }
  
    // Event listeners
    countryInput.addEventListener('click', openDropdown);
    
    document.addEventListener('click', (e) => {
      if (!countryWrapper.contains(e.target)) {
        closeDropdown();
      }
    });
  
    countryInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        openDropdown();
      }
    });
  }

  function updateHighlight(items, index) {
    items.forEach((item, i) => {
      item.classList.toggle('techpack-form__dropdown-item--highlighted', i === index);
    });

    if (index >= 0 && items[index]) {
      items[index].scrollIntoView({ block: 'nearest' });
    }
  }

  function handleVATFieldVisibility(country) {
    // Try both your existing IDs and the standard selectors
    const vatContainer = document.getElementById('vat-ein-group') || document.querySelector('.techpack-form__group--vat');
    const vatInput = document.getElementById('vat-ein') || document.querySelector('input[name="vatNumber"]');
    const vatLabel = document.getElementById('vat-ein-label') || document.querySelector('.techpack-form__group--vat .techpack-form__label');
    const vatStatus = document.getElementById('vat-ein-status');
    
    if (!vatContainer || !vatInput) {
      console.log('VAT elements not found');
      return;
    }
    
    // Define European countries that require VAT
    const europeanCountries = [
      'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
      'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary',
      'Iceland', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta',
      'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Slovakia',
      'Slovenia', 'Spain', 'Sweden', 'Switzerland'
    ];
    
    const isEuropeanCountry = europeanCountries.includes(country.name);
    
    if (isEuropeanCountry) {
      // Show VAT field and make it required for European countries
      vatContainer.style.display = 'block';
      vatContainer.classList.add('techpack-form__group--required');
      vatInput.setAttribute('required', 'required');
      vatInput.setAttribute('data-validate', 'required');
      
      if (vatLabel) {
        vatLabel.innerHTML = 'VAT Number <span class="techpack-form__required">*</span>';
      }
      if (vatStatus) {
        vatStatus.textContent = '';
      }
      
      console.log(`VAT field shown for European country: ${country.name}`);
    } else {
      // Show field but make it optional for non-European countries (like USA - EIN)
      vatContainer.style.display = 'block';
      vatContainer.classList.remove('techpack-form__group--required');
      vatInput.removeAttribute('required');
      vatInput.setAttribute('data-validate', 'vat-ein');
      
      if (vatLabel) {
        vatLabel.innerHTML = 'EIN Number <span class="techpack-form__label-status">(optional)</span>';
      }
      if (vatStatus) {
        vatStatus.textContent = '(optional)';
      }
      
      // Clear any existing errors since it's now optional
      if (typeof clearFieldError === 'function') {
        clearFieldError(vatInput);
      } else {
        vatInput.classList.remove('techpack-form__input--error');
        const errorDiv = vatContainer.querySelector('.techpack-form__error');
        if (errorDiv) {
          errorDiv.textContent = '';
          errorDiv.style.display = 'none';
        }
      }
      
      console.log(`EIN field shown as optional for non-European country: ${country.name}`);
    }
  }

  function setupDateConstraints() {
    const dateInput = document.getElementById('deadline');
    if (!dateInput) return;

    const today = new Date();
    const minDate = new Date();
    minDate.setDate(today.getDate() + (6 * 7)); // 6 weeks from today
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2);

    dateInput.min = minDate.toISOString().split('T')[0];
    dateInput.max = maxDate.toISOString().split('T')[0];

    debug.log('Date constraints set', { 
      min: dateInput.min, 
      max: dateInput.max,
      minWeeksFromToday: 6 
    });

    // Enhanced date input interaction
    const dateWrapper = dateInput.closest('.techpack-form__date-wrapper');
    if (dateWrapper) {
      dateWrapper.addEventListener('click', (e) => {
        if (e.target === dateInput) return;
        dateInput.focus();
        dateInput.click();
        
        if (dateInput.showPicker) {
          try {
            dateInput.showPicker();
          } catch (error) {
            debug.log('showPicker not supported');
          }
        }
      });
    }

    dateInput.addEventListener('change', () => {
      if (dateInput.value) {
        const date = new Date(dateInput.value);
        const formattedDate = date.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        dateInput.title = `Selected date: ${formattedDate}`;
        debug.log('Date selected', { value: dateInput.value });
      }
    });
  }

  function setupPhoneFormatting() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        formatPhoneNumber(e.target);
      });
    }
  }

  function formatPhoneNumber(input) {
    const value = input.value.replace(/\D/g, '');
    let formattedValue = '';

    if (value.length > 0) {
      if (value.startsWith('1') && value.length > 1) {
        formattedValue = '+1 ';
        const remaining = value.substring(1);
        if (remaining.length >= 3) {
          formattedValue += remaining.substring(0, 3);
          if (remaining.length >= 6) {
            formattedValue += ' ' + remaining.substring(3, 6);
            if (remaining.length > 6) {
              formattedValue += ' ' + remaining.substring(6, 10);
            }
          } else if (remaining.length > 3) {
            formattedValue += ' ' + remaining.substring(3);
          }
        } else {
          formattedValue += remaining;
        }
      } else {
        // International format
        if (value.length <= 15) {
          formattedValue = '+' + value;
        }
      }
    }

    input.value = formattedValue;
  }

  function validateStep1() {
    debug.log('Validating Step 1');
    
    const form = document.querySelector('#techpack-step-1 form');
    const nextBtn = document.querySelector('#step-1-next');
    
    if (!form || !nextBtn) return false;

    const requiredFields = form.querySelectorAll('[required]');
    const emailFields = form.querySelectorAll('input[type="email"]');
    const phoneFields = form.querySelectorAll('input[type="tel"]');
    let isValid = true;
    let errorCount = 0;

    // Validate required fields (except country which has custom validation)
    requiredFields.forEach(field => {
      // Skip country field - it has custom validation
      if (field.name === 'country' || field.classList.contains('techpack-form__country-input')) {
        return;
      }
      
      if (!validateField(field)) {
        isValid = false;
        errorCount++;
      }
    });
    
    // Separately validate country field (only show error if user has interacted or tried to submit)
    const countryInput = form.querySelector('.techpack-form__country-input, input[name="country"]');
    if (countryInput && countryInput.hasAttribute('required')) {
      if (!countryInput.value.trim()) {
        // Only show error if field has been touched or form is being submitted
        const hasBeenTouched = countryInput.dataset.touched === 'true' || document.activeElement === countryInput;
        if (hasBeenTouched) {
          displayFieldError(countryInput, false, 'Please select a country');
          isValid = false;
          errorCount++;
        } else {
          // Field is empty but hasn't been touched yet - mark as invalid but don't show error
          isValid = false;
        }
      } else {
        displayFieldError(countryInput, true, '');
      }
    }

    // Validate email fields
    emailFields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
        errorCount++;
      }
    });

    // Validate phone fields
    phoneFields.forEach(field => {
      if (field.value.trim() && !validateField(field)) {
        isValid = false;
        errorCount++;
      }
    });

    nextBtn.disabled = !isValid;
    debug.log('Step 1 validation complete', { isValid, errorCount });
    return isValid;
  }

  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    debug.log('Validating field', { 
      name: field.name, 
      value: value.substring(0, 20) + (value.length > 20 ? '...' : ''),
      required: field.hasAttribute('required')
    });

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    // Email validation
    else if (field.type === 'email' && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    // Phone validation
    else if (field.type === 'tel' && value) {
      if (!/^[\+]?[\d\s\-\(\)]+$/.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }
    // VAT/EIN validation
    else if (field.name === 'vatEin' && value) {
      if (!/^[A-Z0-9\-]+$/i.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid VAT/EIN number';
      }
    }

    displayFieldError(field, isValid, errorMessage);
    debug.log('Field validation result', { name: field.name, isValid, errorMessage });
    return isValid;
  }

  function displayFieldError(field, isValid, errorMessage) {
    // Remove existing error styling
    field.classList.remove('error', 'field-error');
    field.style.borderColor = '';
    field.style.boxShadow = '';

    // Find or create error element
    let errorElement = field.parentNode.querySelector('.techpack-form__error, .field-error-message');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'field-error-message';
      field.parentNode.appendChild(errorElement);
    }

    if (!isValid) {
      // Add error styling
      field.classList.add('field-error');
      field.style.borderColor = '#f87171';
      field.style.boxShadow = '0 0 0 3px rgba(248, 113, 113, 0.1)';
      
      // Show error message
      errorElement.textContent = errorMessage;
      errorElement.classList.add('show');
    } else {
      // Remove error styling
      errorElement.classList.remove('show');
      errorElement.textContent = '';
    }
  }

  function clearFieldError(field) {
    field.classList.remove('error', 'field-error');
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const errorElement = field.parentNode.querySelector('.techpack-form__error, .field-error-message');
    if (errorElement) {
      errorElement.classList.remove('show');
      errorElement.textContent = '';
    }
  }

  function saveStep1Data() {
    debug.log('Saving Step 1 data');
    
    const form = document.querySelector('#techpack-step-1 form');
    if (!form) return;

    const formDataObj = new FormData(form);
    const data = {};
    
    for (let [key, value] of formDataObj.entries()) {
      data[key] = value;
    }
    
    formData.clientInfo = data;
    debug.log('Step 1 data saved', data);
  }

  function setupProductionTypeListener() {
    const productionTypeSelect = document.querySelector('#production-type, select[name="productionType"]');
    if (!productionTypeSelect) return;
  
    productionTypeSelect.addEventListener('change', function() {
      const selectedType = this.value;
      debug.log('Production type changed', selectedType);
      
      // Store the production type in formData
      if (formData.clientInfo) {
        formData.clientInfo.productionType = selectedType;
      }
      
      // Update Step 3 interface based on selection
      updateStep3Interface(selectedType);
    });
  }
  
  function updateStep3Interface(productionType) {
    debug.log('Updating Step 3 interface for production type:', productionType);
    
    // Store the production type globally so Step 3 can access it
    window.currentProductionType = productionType;
    
    // If we're currently on Step 3, update it immediately
    if (currentStep === 3) {
      refreshStep3Interface();
    }
  }
  
  function refreshStep3Interface() {
    const productionType = window.currentProductionType || 'custom-production';
    
    // Update all existing garments
    const garments = document.querySelectorAll('.techpack-garment');
    garments.forEach(garment => {
      updateGarmentInterface(garment, productionType);
    });
  }
  
  function updateGarmentInterface(garment, productionType) {
    const garmentTypeSelect = garment.querySelector('select[name="garmentType"]');
    const fabricTypeSelect = garment.querySelector('select[name="fabricType"]');
    const fabricLabel = garment.querySelector('select[name="fabricType"]').closest('.techpack-form__group').querySelector('.techpack-form__label');
    
    if (!garmentTypeSelect || !fabricTypeSelect || !fabricLabel) return;
    
    if (productionType === 'our-blanks') {
      // Update Garment Type options for "Our Blanks"
      garmentTypeSelect.innerHTML = `
        <option value="">Select garment type...</option>
        <option value="Jacket">Jacket</option>
        <option value="Hoodie">Hoodie</option>
        <option value="Sweatshirt">Sweatshirt</option>
        <option value="T-Shirt">T-Shirt</option>
        <option value="Sweatpants">Sweatpants</option>
      `;
      
      // Update Fabric Type to Collection Type
      fabricLabel.textContent = 'Collection Type';
      fabricTypeSelect.innerHTML = `
        <option value="">Select collection type...</option>
        <option value="Oversized Luxury Collection">Oversized Luxury Collection</option>
        <option value="Relaxed High-End Collection">Relaxed High-End Collection</option>
      `;
    } else {
      // Restore original options for "Custom Production"
      garmentTypeSelect.innerHTML = `
        <option value="">Select garment type...</option>
        <option value="Zip-Up Hoodie">Zip-Up Hoodie</option>
        <option value="Hoodie">Hoodie</option>
        <option value="T-Shirt">T-Shirt</option>
        <option value="Crewneck Sweatshirt">Crewneck Sweatshirt</option>
        <option value="Sweatpants">Sweatpants</option>
        <option value="Shorts">Shorts</option>
        <option value="Long Sleeve T-Shirt">Long Sleeve T-Shirt</option>
        <option value="Polo Shirt">Polo Shirt</option>
        <option value="Tank Top">Tank Top</option>
        <option value="Hat/Cap">Hat/Cap</option>
        <option value="Beanie">Beanie</option>
        <option value="Other">Other (Specify in Notes)</option>
      `;
      
      // Restore original Fabric Type
      fabricLabel.textContent = 'Fabric Type';
      fabricTypeSelect.innerHTML = `
        <option value="" selected>Select fabric type...</option>
        <option value="Fleece 100% Organic Cotton">Fleece 100% Organic Cotton</option>
        <option value="French Terry 100% Organic Cotton Fleece">French Terry 100% Organic Cotton</option>
        <option value="Cotton/Polyester Blend (50/50)">Cotton/Polyester Blend (50/50)</option>
        <option value="Cotton/Polyester Blend (70/30)">Cotton/Polyester Blend (70/30)</option>
        <option value="Cotton/Polyester Blend (80/20)">Cotton/Polyester Blend (80/20)</option>
        <option value="100% Polyester">100% Polyester</option>
        <option value="100% Linen">100% Linen</option>
        <option value="Cotton/Linen Blend">Cotton/Linen Blend</option>
        <option value="Jersey Knit">Jersey Knit</option>
        <option value="Pique">Pique</option>
        <option value="Canvas">Canvas</option>
        <option value="Custom Fabric">Custom Fabric (Specify in Notes)</option>
      `;
    }
    
    // Clear current selections since options changed
    garmentTypeSelect.value = '';
    fabricTypeSelect.value = '';
    
    // Re-trigger validation
    validateStep3();
  }

// Step 2: File Upload
  function initializeStep2() {
    debug.log('Initializing Step 2: File Upload');
    
    const uploadZone = document.querySelector('#upload-zone');
    const fileInput = document.querySelector('#file-input');
    const uploadedFiles = document.querySelector('#uploaded-files');
    const addMoreBtn = document.querySelector('#add-more-files');
    const prevBtn = document.querySelector('#step-2-prev');
    const nextBtn = document.querySelector('#step-2-next');

    if (!uploadZone || !fileInput || !uploadedFiles) return;

    // Drag and drop
    uploadZone.addEventListener('dragover', handleDragOver);
    uploadZone.addEventListener('dragleave', handleDragLeave);
    uploadZone.addEventListener('drop', handleDrop);
    uploadZone.addEventListener('click', () => fileInput.click());

    // File input
    fileInput.addEventListener('change', handleFileSelect);

    // Add more files
    if (addMoreBtn) {
      addMoreBtn.addEventListener('click', () => fileInput.click());
    }

    // Navigation
    if (prevBtn) {
      prevBtn.addEventListener('click', () => showStepWithAnimation(1));
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        if (validateStep2()) {
          showStepWithAnimation(3);
        }
      });
    }

    validateStep2();
    debug.log('Step 2 initialized successfully');
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('techpack-upload__zone--dragover');
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('techpack-upload__zone--dragover');
  }

  function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('techpack-upload__zone--dragover');
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }

  function handleFileSelect(e) {
    e.stopPropagation();
    const files = Array.from(e.target.files);
    processFiles(files);
    e.target.value = '';
  }

  function processFiles(files) {
    debug.log('Processing files', { count: files.length });
    
    const validTypes = ['.pdf', '.ai', '.png', '.jpg', '.jpeg', '.zip'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 10;

    files.forEach(file => {
      if (formData.files.length >= maxFiles) {
        showError('Maximum 10 files allowed');
        return;
      }

      const fileExt = '.' + file.name.split('.').pop().toLowerCase();
      if (!validTypes.includes(fileExt)) {
        showError(`Invalid file type: ${file.name}`);
        return;
      }

      if (file.size > maxSize) {
        showError(`File too large: ${file.name}`);
        return;
      }

      addFileToList(file);
    });
  }

  function addFileToList(file) {
    const template = document.querySelector('#file-item-template');
    const uploadedFiles = document.querySelector('#uploaded-files');
    if (!template || !uploadedFiles) return;
  
    const fileId = `file-${++fileCounter}`;
    const clone = template.content.cloneNode(true);
    const fileItem = clone.querySelector('.techpack-file');
  
    fileItem.dataset.fileId = fileId;
    fileItem.querySelector('.techpack-file__name').textContent = file.name;
    fileItem.querySelector('.techpack-file__size').textContent = formatFileSize(file.size);
  
    // Remove button
    fileItem.querySelector('.techpack-file__remove')
            .addEventListener('click', () => removeFile(fileId));
  
    // Tag selector
    const select = fileItem.querySelector('.techpack-file__tag-select');
    select.addEventListener('change', e => {
      const fileObj = formData.files.find(f => f.id === fileId);
      if (fileObj) {
        fileObj.type = e.target.value;
        validateStep2();
      }
    });
  
    uploadedFiles.appendChild(fileItem);
  
    // Store file with empty tag for now
    formData.files.push({
      id: fileId,
      file: file,
      type: ''
    });
  
    debug.log('File added to list', { fileId, fileName: file.name });
    validateStep2();
  }

  function removeFile(fileId) {
    const fileItem = document.querySelector(`[data-file-id="${fileId}"]`);
    if (fileItem) {
      fileItem.remove();
    }
    
    formData.files = formData.files.filter(f => f.id !== fileId);
    debug.log('File removed', { fileId });
    validateStep2();
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function validateStep2() {
    debug.log('Validating Step 2');
    
    const nextBtn = document.getElementById('step-2-next');
    const fileItems = document.querySelectorAll('.techpack-file');
  
    // Base rule: must have ≥1 file and every file object must already carry a tag
    let isValid = formData.files.length > 0;
  
    // Walk the DOM rows to show/clear error messages
    fileItems.forEach(item => {
      const fileId = item.dataset.fileId;
      const select = item.querySelector('.techpack-file__tag-select');
      const error = item.querySelector('.techpack-form__error');
  
      if (!select) return;
  
      // Find the corresponding file object
      const fileObj = formData.files.find(f => f.id === fileId);
      
      if (!select.value || !fileObj || !fileObj.type) {
        isValid = false;
        if (error) error.textContent = 'Please select a file type';
      } else {
        if (error) error.textContent = '';
        // Ensure the file object has the correct type
        if (fileObj) fileObj.type = select.value;
      }
    });
  
    // Double check that all files have types
    const allFilesHaveTypes = formData.files.every(f => f.type && f.type.trim() !== '');
    if (!allFilesHaveTypes) {
      isValid = false;
    }
  
    if (nextBtn) nextBtn.disabled = !isValid;
    debug.log('Step 2 validation complete', { isValid, fileCount: formData.files.length });
    return isValid;
  }

  function syncStep2DOM() {
    const fileItems = document.querySelectorAll('.techpack-file');
    
    fileItems.forEach(item => {
      const fileId = item.dataset.fileId;
      const select = item.querySelector('.techpack-file__tag-select');
      const error = item.querySelector('.techpack-form__error');
      const fileObj = formData.files.find(f => f.id === fileId);
      
      // If fileObj has a type, update the select to match it
      if (fileObj && fileObj.type && select) {
        select.value = fileObj.type;
        // Clear any error messages since we have a valid selection
        if (error) error.textContent = '';
      }
    });
    
    validateStep2();
  }
  
  function showError(message) {
    debug.log('Error shown', message);
    console.error(message);
  }

// Step 3: Garment Specifications
  function initializeStep3() {
    debug.log('Initializing Step 3: Garment Specifications');
    
    const addGarmentBtn = document.querySelector('#add-garment');
    const prevBtn = document.querySelector('#step-3-prev');
    const nextBtn = document.querySelector('#step-3-next');

    if (!addGarmentBtn) return;

    addGarmentBtn.addEventListener('click', addGarment);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => showStepWithAnimation(2));
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        if (validateStep3()) {
          showStepWithAnimation(4);
        }
      });
    }

    // NEW: Refresh interface based on production type when entering step 3
    refreshStep3Interface();

    // Add initial garment
    addGarment();
    debug.log('Step 3 initialized successfully');
  }

  // FIXED: Add garment with progress calculation trigger
  function addGarment() {
    const template = document.querySelector('#garment-template');
    const container = document.querySelector('#garments-container');
    
    if (!template || !container) return;
  
    const garmentId = `garment-${++garmentCounter}`;
    const clone = template.content.cloneNode(true);
    const garment = clone.querySelector('.techpack-garment');
    
    garment.dataset.garmentId = garmentId;
    garment.querySelector('.techpack-garment__number').textContent = garmentCounter;
    
    const removeBtn = garment.querySelector('.techpack-garment__remove');
    removeBtn.addEventListener('click', () => removeGarment(garmentId));
    
    const addColorwayBtn = garment.querySelector('.add-colorway');
    addColorwayBtn.addEventListener('click', () => addColorway(garmentId));
    
    setupGarmentEventListeners(garment, garmentId);
    
    container.appendChild(garment);

    // NEW: Apply production-specific interface immediately
    const productionType = window.currentProductionType || 'custom-production';
    updateGarmentInterface(garment, productionType);    
    
    formData.garments.push({
      id: garmentId,
      type: '',
      fabric: '',
      printingMethods: [],
      colorways: []
    });
    
    addColorway(garmentId);
    
    // FIXED: Trigger recalculation after adding garment
    setTimeout(() => {
      calculateAndUpdateProgress();
    }, 100);
    
    debug.log('Garment added', { garmentId });
    validateStep3();
  }

  // None or Design Switch Button
  function setupPrintingMethodsLogic(garment) {
    const checkboxes = garment.querySelectorAll('input[name="printingMethods[]"]');
    const noneCheckbox = garment.querySelector('input[value="None"]');
    
    if (!noneCheckbox) return;
    
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        if (this.value === 'None' && this.checked) {
          // If "None" is checked, uncheck all others
          checkboxes.forEach(cb => {
            if (cb.value !== 'None') {
              cb.checked = false;
            }
          });
        } else if (this.value !== 'None' && this.checked) {
          // If any other option is checked, uncheck "None"
          noneCheckbox.checked = false;
        }
        
        // Trigger validation update
        validateStep3();
      });
    });
  }

  // Setup event listeners for all garment form elements
  function setupGarmentEventListeners(garment, garmentId) {
    // Garment type select
    const garmentTypeSelect = garment.querySelector('select[name="garmentType"]');
    if (garmentTypeSelect) {
      garmentTypeSelect.addEventListener('change', () => {
        const garmentData = formData.garments.find(g => g.id === garmentId);
        if (garmentData) {
          garmentData.type = garmentTypeSelect.value;
        }
        validateStep3();
      });
    }
  
    // Fabric type select
    const fabricSelect = garment.querySelector('select[name="fabricType"]');
    if (fabricSelect) {
      fabricSelect.addEventListener('change', () => {
        const garmentData = formData.garments.find(g => g.id === garmentId);
        if (garmentData) {
          garmentData.fabric = fabricSelect.value;
        }
        validateStep3();
      });
    }

    // NEW: Add printing methods logic for "None" exclusivity
    setupPrintingMethodsLogic(garment);    
  
    // Printing method checkboxes
    const printingCheckboxes = garment.querySelectorAll('input[name="printingMethods[]"]');
    printingCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const garmentData = formData.garments.find(g => g.id === garmentId);
        if (garmentData) {
          const checkedBoxes = garment.querySelectorAll('input[name="printingMethods"]:checked, input[type="checkbox"]:checked');
          garmentData.printingMethods = Array.from(checkedBoxes).map(cb => cb.value);
        }
        validateStep3();
      });
    });
  
    // General input/change listener for any other inputs
    const allInputs = garment.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
      if (!input.closest('.techpack-colorway')) { // Don't duplicate colorway listeners
        input.addEventListener('input', () => {
          updateGarmentTotal(garmentId);
          validateStep3();
        });
        input.addEventListener('change', () => {
          updateGarmentTotal(garmentId);
          validateStep3();
        });
      }
    });
  }

  function removeGarment(garmentId) {
    const garment = document.querySelector(`[data-garment-id="${garmentId}"]`);
    if (garment) {
      garment.remove();
    }
    
    formData.garments = formData.garments.filter(g => g.id !== garmentId);
    
    // FIXED: Trigger recalculation after removing garment
    setTimeout(() => {
      calculateAndUpdateProgress();
      updateTotalQuantity();
    }, 100);
    
    debug.log('Garment removed', { garmentId });
    validateStep3();
  }

  // FIXED: Add colorway with proper progress calculation
  function addColorway(garmentId) {
    const garment = document.querySelector(`[data-garment-id="${garmentId}"]`);
    const template = document.querySelector('#colorway-template');
    
    if (!garment || !template) return;
  
    const colorwaysList = garment.querySelector('.techpack-colorways__list');
    const colorwayId = `colorway-${++colorwayCounter}`;
    const clone = template.content.cloneNode(true);
    const colorway = clone.querySelector('.techpack-colorway');
    
    colorway.dataset.colorwayId = colorwayId;
    
    const removeBtn = colorway.querySelector('.techpack-colorway__remove');
    removeBtn.addEventListener('click', () => removeColorway(garmentId, colorwayId));
    
    const colorPicker = colorway.querySelector('.techpack-color-picker__input');
    const colorPreview = colorway.querySelector('.techpack-color-picker__preview');
    
    colorPicker.addEventListener('change', function() {
      colorPreview.style.backgroundColor = this.value;
      // Update formData and validate
      const garmentData = formData.garments.find(g => g.id === garmentId);
      if (garmentData) {
        const colorwayData = garmentData.colorways.find(c => c.id === colorwayId);
        if (colorwayData) {
          colorwayData.color = this.value;
        }
      }
      validateStep3();
    });
    colorPreview.style.backgroundColor = colorPicker.value;
    
  // FIXED: Add event listeners to quantity inputs for real-time validation and calculation
    const qtyInputs = colorway.querySelectorAll('.techpack-size-grid__input');
    qtyInputs.forEach(input => {
      input.addEventListener('input', () => {
        // NEW: Add quantity-based size validation
        validateQuantityInputs(colorwayId);
        updateColorwayTotal(colorwayId);
        updateGarmentTotal(garmentId);
        updateTotalQuantity();
        // Trigger the main progress calculation
        setTimeout(() => {
          calculateAndUpdateProgress();
        }, 50);
        validateStep3();
      });
      
      input.addEventListener('change', () => {
        // NEW: Add quantity-based size validation
        validateQuantityInputs(colorwayId);
        updateColorwayTotal(colorwayId);
        updateGarmentTotal(garmentId);
        updateTotalQuantity();
        // Trigger the main progress calculation
        setTimeout(() => {
          calculateAndUpdateProgress();
        }, 50);
        validateStep3();
      });
    });
  
    // Add event listener to pantone input
    const pantoneInput = colorway.querySelector('input[placeholder*="PANTONE"]');
    if (pantoneInput) {
      pantoneInput.addEventListener('input', () => {
        const garmentData = formData.garments.find(g => g.id === garmentId);
        if (garmentData) {
          const colorwayData = garmentData.colorways.find(c => c.id === colorwayId);
          if (colorwayData) {
            colorwayData.pantone = pantoneInput.value;
          }
        }
        validateStep3();
      });
    }
    
    colorwaysList.appendChild(clone);
    
    const garmentData = formData.garments.find(g => g.id === garmentId);
    if (garmentData) {
      garmentData.colorways.push({
        id: colorwayId,
        color: '#000000',
        pantone: '',
        quantities: {}
      });
    }
    
    // FIXED: Trigger recalculation after DOM updates (minimum requirement changes!)
    setTimeout(() => {
      calculateAndUpdateProgress();
    }, 100);
    
    debug.log('Colorway added', { garmentId, colorwayId });
    validateStep3();
  }

  // FIXED: Remove colorway with proper progress calculation
  function removeColorway(garmentId, colorwayId) {
    // Locate the colorway in the DOM and remove it
    const colorway = document.querySelector(`[data-colorway-id="${colorwayId}"]`);
    if (colorway) {
      colorway.remove();
    }
 
    // Keep in-memory data in sync
    const garmentData = formData.garments.find(g => g.id === garmentId);
    if (garmentData) {
      garmentData.colorways = garmentData.colorways.filter(c => c.id !== colorwayId);
    }

    // FIXED: Trigger recalculation after DOM updates (minimum requirement changes!)
    setTimeout(() => {
      calculateAndUpdateProgress();
      updateGarmentTotal(garmentId);
      updateTotalQuantity();
    }, 100);
    
    debug.log('Colorway removed', { garmentId, colorwayId });
    validateStep3();
  }

  function updateColorwayTotal(colorwayId) {
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

  // NEW: Validate quantity inputs based on size distribution logic
  function validateQuantityInputs(colorwayId) {
    const colorway = document.querySelector(`[data-colorway-id="${colorwayId}"]`);
    if (!colorway) return;

    const qtyInputs = colorway.querySelectorAll('.techpack-size-grid__input');
    const colorwayTotal = updateColorwayTotal(colorwayId);
    const colorwayCount = getColorwayCount();
    const requiredPerColorway = colorwayCount === 1 ? 75 : 50;
    
    // Calculate how many sizes have quantities > 0
    const activeSizes = Array.from(qtyInputs).filter(input => parseInt(input.value) || 0 > 0).length;
    const maxAllowedSizes = getMaxAllowedSizes(colorwayTotal);
    
    qtyInputs.forEach(input => {
      const value = parseInt(input.value) || 0;
      
      // Remove existing classes
      input.classList.remove('quantity-empty', 'quantity-filled', 'quantity-excess');
      
      if (value > 0) {
        if (colorwayTotal < requiredPerColorway) {
          // Still need more quantity - show orange/yellow
          input.classList.add('quantity-progress');
        } else {
          // Minimum reached - show green
          input.classList.add('quantity-filled');
        }
      } else {
        // Empty field - show red only if we're under minimum
        if (colorwayTotal < requiredPerColorway) {
          input.classList.add('quantity-empty');
        }
      }
      
      // Check if too many sizes are being used
      if (activeSizes > maxAllowedSizes && value > 0) {
        input.classList.add('quantity-excess');
        input.title = `Too many sizes for ${colorwayTotal} units. Maximum ${maxAllowedSizes} sizes allowed.`;
      } else {
        input.title = '';
      }
    });
    
    // Show size distribution warning
    const warningEl = colorway.querySelector('.size-distribution-warning') || createSizeWarningElement(colorway);
    
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
  
  // Helper function to create size warning element
  function createSizeWarningElement(colorway) {
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
    
    // Insert after the size grid
    const sizeGrid = colorway.querySelector('.techpack-size-grid');
    if (sizeGrid) {
      sizeGrid.insertAdjacentElement('afterend', warningEl);
    }
    
    return warningEl;
  }
  
  function updateGarmentTotal(garmentId) {
    const garment = document.querySelector(`[data-garment-id="${garmentId}"]`);
    if (!garment) return 0;

    const colorways = garment.querySelectorAll('.techpack-colorway');
    let total = 0;

    colorways.forEach(colorway => {
      const colorwayId = colorway.dataset.colorwayId;
      total += updateColorwayTotal(colorwayId);
    });

    const totalElement = garment.querySelector('.techpack-garment__total-value');
    if (totalElement) {
      totalElement.textContent = total;
    }

    return total;
  }

  // FIXED: Cleaner total quantity update
  function updateTotalQuantity() {
    console.log('Progress bar element found:', document.getElementById('quantity-progress'));
    
    const garments = document.querySelectorAll('.techpack-garment');
    let total = 0;
    let minTotal = 0;
  
    // Sum actual units and compute per-garment minimum
    garments.forEach(garment => {
      const valEl = garment.querySelector('.techpack-garment__total-value');
      const garmentQty = valEl ? parseInt(valEl.textContent) || 0 : 0;
      total += garmentQty;
  
      // Dynamic minimum: 1 CW→75, 2+ CW→50 each
      const cwCount = garment.querySelectorAll('.techpack-colorway').length;
      const thisMin = cwCount === 1 ? 75 : cwCount * 50;
      minTotal += thisMin;
    });
  
    // Write totals back to DOM with compact display
    const totalEl = document.getElementById('total-quantity');
    const progressBar = document.getElementById('quantity-progress');
  
    if (totalEl) {
      // Show just the number, percentage will be handled by calculateAndUpdateProgress
      const currentTotal = parseInt(totalEl.textContent) || 0;
      if (currentTotal !== total) {
        animateNumber(currentTotal, total, totalEl);
      }
    }
  
    // Enhanced progress calculation and animation
    if (progressBar) {
      const pct = minTotal > 0 ? Math.min((total / minTotal) * 100, 100) : 0;
      
      // Smooth progress bar animation
      progressBar.style.transition = 'width 0.5s ease-out, background-color 0.3s ease';
      progressBar.style.width = `${pct}%`;
      
      // Add completion effects
      if (pct >= 100) {
        progressBar.classList.add('quantity-complete');
        progressBar.style.animationPlayState = 'running';
      } else {
        progressBar.classList.remove('quantity-complete');
        progressBar.style.animationPlayState = 'paused';
      }
    }
  
    // Enhanced tracker styling
    const tracker = document.querySelector('.techpack-quantity-tracker');
    if (tracker) {
      const isComplete = total >= minTotal;
      tracker.classList.toggle('techpack-quantity-tracker--complete', isComplete);
      
      // Add achievement effect when reaching minimum
      if (isComplete && !tracker.hasAttribute('data-achieved')) {
        tracker.setAttribute('data-achieved', 'true');
        tracker.classList.add('achievement-unlocked');
        setTimeout(() => {
          tracker.classList.remove('achievement-unlocked');
        }, 1000);
      } else if (!isComplete) {
        tracker.removeAttribute('data-achieved');
      }
    }
  
    return total;
  }

  // FIXED: Stricter per-colorway validation with red highlights
  function validateStep3() {
    debug.log('Validating Step 3');
    
    const nextBtn = document.querySelector('#step-3-next');
    const garments = document.querySelectorAll('.techpack-garment');
  
    let isValid = garments.length > 0;
    console.log('Initial isValid (has garments):', isValid, 'garment count:', garments.length);
  
    garments.forEach((garment, index) => {
      console.log(`Validating garment ${index + 1}:`);
      
      const garmentId = garment.dataset.garmentId;
      const garmentData = formData.garments.find(g => g.id === garmentId);
      if (!garmentData) {
        console.log(`  ❌ No garment data found for ID: ${garmentId}`);
        return;
      }
  
      // Validate garment type
      const garmentTypeSelect = garment.querySelector('select[name="garmentType"]');
      const garmentTypeGroup = garmentTypeSelect ? garmentTypeSelect.closest('.techpack-form__group') : null;
      const garmentTypeError = garmentTypeGroup ? garmentTypeGroup.querySelector('.techpack-form__error') : null;
      
      if (!garmentTypeSelect || !garmentTypeSelect.value) {
        isValid = false;
        console.log('Garment type:', garmentTypeSelect ? garmentTypeSelect.value : 'NO SELECT FOUND');
        if (garmentTypeGroup) garmentTypeGroup.classList.add('techpack-form__group--error');
        if (garmentTypeError) garmentTypeError.textContent = 'Please select a garment type';
      } else {
        console.log(`  ✅ Garment type: "${garmentTypeSelect.value}"`);
        if (garmentTypeGroup) {
          garmentTypeGroup.classList.remove('techpack-form__group--error');
          garmentTypeGroup.classList.add('techpack-form__group--success');
        }
        if (garmentTypeError) garmentTypeError.textContent = '';
        garmentData.type = garmentTypeSelect.value;
      }
      
      // Validate fabric type
      const fabricSelect = garment.querySelector('select[name="fabricType"]');
      const fabricGroup = fabricSelect ? fabricSelect.closest('.techpack-form__group') : null;
      const fabricError = fabricGroup ? fabricGroup.querySelector('.techpack-form__error') : null;
      
      if (!fabricSelect || !fabricSelect.value) {
        isValid = false;
        console.log('Fabric type:', fabricSelect ? fabricSelect.value : 'NO SELECT FOUND');
        if (fabricGroup) fabricGroup.classList.add('techpack-form__group--error');
        if (fabricError) fabricError.textContent = 'Please select a fabric type';
      } else {
        console.log(`  ✅ Fabric type: "${fabricSelect.value}"`);
        if (fabricGroup) {
          fabricGroup.classList.remove('techpack-form__group--error');
          fabricGroup.classList.add('techpack-form__group--success');
        }
        if (fabricError) fabricError.textContent = '';
        garmentData.fabric = fabricSelect.value;
      }
  
      // Validate printing methods
      const printingCheckboxes = garment.querySelectorAll('input[name="printingMethods[]"]:checked');
      const printingGroup = garment.querySelector('.techpack-form__checkboxes').closest('.techpack-form__group');
      const printingError = printingGroup ? printingGroup.querySelector('.techpack-form__error') : null;
     
      if (printingCheckboxes.length === 0) {
        isValid = false;
        console.log('Printing methods:', printingCheckboxes.length, 'checkboxes selected');
        if (printingGroup) printingGroup.classList.add('techpack-form__group--error');
        if (printingError) printingError.textContent = 'Please select at least one printing method';
      } else {
        console.log(`  ✅ Printing methods: ${printingCheckboxes.length} selected (${Array.from(printingCheckboxes).map(cb => cb.value).join(', ')})`);
        if (printingGroup) {
          printingGroup.classList.remove('techpack-form__group--error');
          printingGroup.classList.add('techpack-form__group--success');
        }
        if (printingError) printingError.textContent = '';
        garmentData.printingMethods = Array.from(printingCheckboxes).map(cb => cb.value);
      }
  
      // FIXED: Stricter colorway validation with individual minimums
      const colorways = garment.querySelectorAll('.techpack-colorway');
      const colorwayCount = colorways.length;
      console.log(`  Colorways found: ${colorwayCount}`);
  
      colorways.forEach((colorway, colorwayIndex) => {
        const colorwayId = colorway.dataset.colorwayId;
        const colorwayData = garmentData.colorways.find(c => c.id === colorwayId);
        if (!colorwayData) {
          console.log(`    ❌ No colorway data found for ID: ${colorwayId}`);
          return;
        }
  
        // Update model
        const colorInput = colorway.querySelector('.techpack-color-picker__input');
        const pantoneInput = colorway.querySelector('input[placeholder*="PANTONE"]');
        if (colorInput) colorwayData.color = colorInput.value;
        if (pantoneInput) colorwayData.pantone = pantoneInput.value;
  
        // Sum this colorway's quantities
        let colorwayTotal = 0;
        colorway.querySelectorAll('.techpack-size-grid__input').forEach(input => {
          const size = input.name.replace('qty-', '');
          const value = parseInt(input.value) || 0;
          colorwayData.quantities[size] = value;
          colorwayTotal += value;
        });
    
        // FIXED: Strict per-colorway minimum enforcement (EACH colorway must meet its individual minimum)
        const requiredPerColorway = colorwayCount === 1 ? 75 : 50;
        console.log(`    Colorway ${colorwayIndex + 1}: ${colorwayTotal} units (required: ${requiredPerColorway})`);
        
        // Find existing error element or create one
        let err = colorway.querySelector('.techpack-form__error');
        
        if (colorwayTotal < requiredPerColorway) {
          isValid = false;
          console.log(`    ❌ Colorway ${colorwayIndex + 1} below minimum: ${colorwayTotal}/${requiredPerColorway}`);
          
          if (!err) {
            err = document.createElement('div');
            err.className = 'techpack-form__error';
            err.style.cssText = `
              color: #ef4444;
              background: #fef2f2;
              border: 1px solid #fecaca;
              padding: 0.5rem;
              border-radius: 0.375rem;
              font-size: 0.875rem;
              font-weight: 600;
              margin-top: 0.5rem;
              display: block;
            `;
            
            // Insert after colorway total
            const totalElement = colorway.querySelector('.techpack-colorway__total-value');
            if (totalElement && totalElement.parentNode) {
              totalElement.parentNode.insertAdjacentElement('afterend', err);
            }
          }
          
          // Show specific error message
          if (colorwayCount === 1) {
            err.innerHTML = `🚨 MINIMUM 75 units required (single colorway) - Currently: ${colorwayTotal}`;
          } else {
            err.innerHTML = `🚨 MINIMUM 50 units required per colorway - Currently: ${colorwayTotal}`;
          }
          
          // Add red styling to colorway total
          const totalEl = colorway.querySelector('.techpack-colorway__total-value');
          if (totalEl) {
            totalEl.style.cssText = `
              color: #ef4444 !important;
              font-weight: bold !important;
              background: #fef2f2;
              padding: 0.25rem 0.5rem;
              border-radius: 0.25rem;
              border: 1px solid #fecaca;
            `;
          }
        } else {
          console.log(`    ✅ Colorway ${colorwayIndex + 1} meets minimum: ${colorwayTotal}/${requiredPerColorway}`);
          // Remove error if requirement is met
          if (err) err.remove();
          
          // Remove red styling from colorway total
          const totalEl = colorway.querySelector('.techpack-colorway__total-value');
          if (totalEl) {
            totalEl.style.cssText = '';
          }
        }
      });
    });
  
    if (nextBtn) {
      nextBtn.disabled = !isValid;
    }
  
    console.log('Final validation result:', isValid);
    debug.log('Step 3 validation complete', { isValid, garmentCount: garments.length });
    return isValid;
  }

// Step 4: Review & Submit
  function initializeStep4() {
    debug.log('Initializing Step 4: Review & Submit');
    
    const prevBtn = document.querySelector('#step-4-prev');
    const submitBtn = document.querySelector('#step-4-submit');
    const editButtons = document.querySelectorAll('.techpack-review__edit');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => showStepWithAnimation(3));
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', handleSubmit);
    }

    editButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const stepNumber = parseInt(this.dataset.editStep);
        showStepWithAnimation(stepNumber);
      });
    });

    populateReview();
    debug.log('Step 4 initialized successfully');
  }

  function populateReview() {
    debug.log('Populating review section');
    populateReviewStep1();
    populateReviewStep2();
    populateReviewStep3();
  }

  function populateReviewStep1() {
    const container = document.querySelector('#review-step-1');
    if (!container || !formData.clientInfo) return;
  
    const ci = formData.clientInfo;
  
    // Pick up whatever your form actually saved (fallback to 'N/A')
    const clientName = ci.contactName || ci.clientName || ci.name || 'N/A';
    const companyName = ci.company || ci.companyName || 'N/A';
    const emailAddress = ci.email || ci.emailAddress || ci['contact[email]'] || 'N/A';
    const country = ci.country || ci.Country || 'N/A';
    const phoneNumber = ci.phone || ci.phoneNumber || 'N/A';
    const projectDeadline = ci.projectDeadline || ci.deadline || 'N/A';
    const notes = ci.notes || ci.additionalNotes || '';
  
    container.innerHTML = `
      <div class="techpack-review__grid">
        <div class="techpack-review__item">
          <span class="techpack-review__label">Client Name:</span>
          <span class="techpack-review__value">${clientName}</span>
        </div>
        <div class="techpack-review__item">
          <span class="techpack-review__label">Company Name:</span>
          <span class="techpack-review__value">${companyName}</span>
        </div>
        <div class="techpack-review__item">
          <span class="techpack-review__label">Email Address:</span>
          <span class="techpack-review__value">${emailAddress}</span>
        </div>
        <div class="techpack-review__item">
          <span class="techpack-review__label">Country:</span>
          <span class="techpack-review__value">${country}</span>
        </div>
        <div class="techpack-review__item">
          <span class="techpack-review__label">Phone Number:</span>
          <span class="techpack-review__value">${phoneNumber}</span>
        </div>
        <div class="techpack-review__item">
          <span class="techpack-review__label">Project Deadline:</span>
          <span class="techpack-review__value">${projectDeadline}</span>
        </div>
        <div class="techpack-review__item techpack-review__item--full-width">
          <span class="techpack-review__label">Additional Notes:</span>
          <span class="techpack-review__value">${notes || 'N/A'}</span>
        </div>
      </div>
    `;
  }

  function populateReviewStep2() {
    const container = document.querySelector('#review-step-2');
    if (!container) return;

    if (formData.files.length === 0) {
      container.innerHTML = '<p class="techpack-review__empty">No files uploaded</p>';
      return;
    }

    const filesHtml = formData.files.map(fileData => `
      <div class="techpack-review__file">
        <div class="techpack-review__file-info">
          <svg class="techpack-review__file-icon" width="16" height="16" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M14 2v6h6" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
          <span class="techpack-review__file-name">${fileData.file.name}</span>
        </div>
        <span class="techpack-review__file-type">${fileData.type}</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="techpack-review__files">
        ${filesHtml}
      </div>
    `;
  }

  function populateReviewStep3() {
    const container = document.querySelector('#review-step-3');
    if (!container) return;

    if (formData.garments.length === 0) {
      container.innerHTML = '<p class="techpack-review__empty">No garments specified</p>';
      return;
    }

    let totalQuantity = 0;
    const garmentsHtml = formData.garments.map((garment, index) => {
      let garmentTotal = 0;
     
      const colorwaysHtml = garment.colorways.map(colorway => {
        const quantities = Object.entries(colorway.quantities)
          .filter(([size, qty]) => qty > 0)
          .map(([size, qty]) => `${size.toUpperCase()}: ${qty}`)
          .join(', ');
       
        const colorwayQty = Object.values(colorway.quantities).reduce((sum, qty) => sum + qty, 0);
        garmentTotal += colorwayQty;
       
        return `
          <div class="techpack-review__colorway">
            <div class="techpack-review__colorway-header">
              <div class="techpack-review__color-preview" style="background-color: ${colorway.color}"></div>
              <span class="techpack-review__colorway-info">
                ${colorway.pantone ? `PANTONE ${colorway.pantone}` : 'Color: ' + colorway.color}
                <small>(${colorwayQty} units)</small>
              </span>
            </div>
            <div class="techpack-review__quantities">${quantities || 'No quantities specified'}</div>
          </div>
        `;
      }).join('');

      totalQuantity += garmentTotal;

      return `
        <div class="techpack-review__garment">
          <div class="techpack-review__garment-header">
            <h4 class="techpack-review__garment-title">Garment ${index + 1}: ${garment.type}</h4>
            <span class="techpack-review__garment-total">${garmentTotal} units</span>
          </div>
          <div class="techpack-review__garment-details">
            <div class="techpack-review__detail">
              <span class="techpack-review__label">Fabric:</span>
              <span class="techpack-review__value">${garment.fabric}</span>
            </div>
            <div class="techpack-review__detail">
              <span class="techpack-review__label">Printing Methods:</span>
              <span class="techpack-review__value">${garment.printingMethods.join(', ')}</span>
            </div>
          </div>
          <div class="techpack-review__colorways">
            ${colorwaysHtml}
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="techpack-review__summary">
        <div class="techpack-review__total">
          <span class="techpack-review__total-label">Total Quantity:</span>
          <span class="techpack-review__total-value">${totalQuantity}</span>
        </div>
      </div>
      <div class="techpack-review__garments">
        ${garmentsHtml}
      </div>
    `;
  }

  function handleSubmit() {
    debug.log('Handling form submission');
    
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

    // Simulate form submission
    setTimeout(() => {
      showThankYou();
    }, 2000);
  }

  function showThankYou() {
    debug.log('Showing thank you message');
    
    const step4 = document.querySelector('#techpack-step-4');
    if (!step4) return;

    step4.innerHTML = `
      <div class="techpack-container">
        <div class="techpack-thank-you">
          <div class="techpack-thank-you__icon">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="30" fill="#6b7280" stroke="#4b5563" stroke-width="2"/>
              <path d="M20 32l8 8 16-16" stroke="white" stroke-width="3" fill="none"/>
            </svg>
          </div>
          <h2 class="techpack-thank-you__title">Thank You!</h2>
          <p class="techpack-thank-you__message">
            Your tech-pack submission has been received successfully. 
            Our team will review your requirements and get back to you within 24-48 hours.
          </p>
          <div class="techpack-thank-you__details">
            <p><strong>Submission ID:</strong> TP-${Date.now()}</p>
            <p><strong>Total Quantity:</strong> ${updateTotalQuantity()} units</p>
            <p><strong>Files Uploaded:</strong> ${formData.files.length}</p>
          </div>
          <button type="button" class="techpack-btn techpack-btn--primary" onclick="location.reload()">
            Submit Another Tech-Pack
          </button>
        </div>
      </div>
    `;
  }

  // Debug toggle function
  function toggleDebug() {
    if (!debug.panel) return;
    
    const isVisible = debug.panel.classList.contains('show');
    
    if (isVisible) {
      debug.panel.classList.remove('show');
      debug.enabled = false;
    } else {
      debug.panel.classList.add('show');
      debug.enabled = true;
      debug.log('Debug mode enabled');
    }
  }

  // Utility functions
  function debounce(func, wait) {
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

  // Make toggleDebug globally accessible
  window.toggleDebug = toggleDebug;

  // Expose public API
  window.techpackApp = {
    init,
    showStep,
    formData,
    validateStep1,
    validateStep2,
    validateStep3,
    debug,
    initialized: false
  };

  // Auto-initialize when DOM is ready (prevent multiple initializations)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (!window.techpackApp.initialized) {
        init();
        window.techpackApp.initialized = true;
      }
    });
  } else {
    if (!window.techpackApp.initialized) {
      init();
      window.techpackApp.initialized = true;
    }
  }

})();