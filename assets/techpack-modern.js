/**
 * Techpack App - Modern Minimal JavaScript
 * Preserves all functionality while removing complexity
 */

(function() {
  'use strict';

  // Configuration - Preserved exactly
  const CONFIG = {
    MIN_ORDER_QUANTITY_SINGLE_COLORWAY: 30,
    MIN_ORDER_QUANTITY_MULTIPLE_COLORWAY: 20,
    MIN_ORDER_QUANTITY_CUSTOM: 75,
    MAX_FILES: 10,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    VALID_FILE_TYPES: ['.pdf', '.ai', '.png', '.jpg', '.jpeg', '.zip'],
    MIN_DELIVERY_WEEKS: 6
  };

  // Utility Functions
  function getMinimumQuantity(colorwayCount, productionType) {
    colorwayCount = colorwayCount || 1;
    
    if (!productionType) {
      const productionSelect = document.querySelector('#production-type, select[name="productionType"]');
      productionType = productionSelect ? productionSelect.value : 'our-blanks';
    }
    
    if (productionType === 'our-blanks') {
      return colorwayCount === 1 ? CONFIG.MIN_ORDER_QUANTITY_SINGLE_COLORWAY : CONFIG.MIN_ORDER_QUANTITY_MULTIPLE_COLORWAY;
    }
    
    return colorwayCount === 1 ? CONFIG.MIN_ORDER_QUANTITY_CUSTOM : 50; // Legacy fallback
  }

  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Simplified State Management
  class TechPackApp {
    constructor() {
      this.currentStep = 1;
      this.totalSteps = 4;
      this.formData = {
        clientInfo: {},
        files: [],
        garments: []
      };
      this.counters = {
        file: 0,
        garment: 0
      };
    }

    init() {
      this.bindEvents();
      this.updateProgress();
      this.showStep(1);
      console.log('TechPack App Modern - Initialized');
    }

    bindEvents() {
      // Step Navigation
      document.addEventListener('click', (e) => {
        if (e.target.matches('#next-step-btn')) {
          e.preventDefault();
          this.nextStep();
        }
        if (e.target.matches('#prev-step-btn')) {
          e.preventDefault();
          this.prevStep();
        }
      });

      // Form Validation
      document.addEventListener('input', debounce((e) => {
        if (e.target.matches('.form-input')) {
          this.validateField(e.target);
        }
      }, 300));

      // Country selection changes
      document.addEventListener('change', (e) => {
        if (e.target.id === 'country') {
          this.updateVATLabel(e.target.value);
        }
        if (e.target.id === 'production-type') {
          this.updateProductionTypeHints(e.target.value);
        }
      });

      // File Upload
      this.initFileUpload();
      
      // Garment Management
      this.initGarmentManagement();

      // Review & Submit
      this.initReviewSubmit();
    }

    nextStep() {
      if (this.validateCurrentStep()) {
        this.saveCurrentStepData();
        if (this.currentStep < this.totalSteps) {
          this.currentStep++;
          this.showStep(this.currentStep);
          this.updateProgress();
        } else {
          this.submitForm();
        }
      }
    }

    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
        this.showStep(this.currentStep);
        this.updateProgress();
      }
    }

    showStep(stepNumber) {
      // Hide all steps
      document.querySelectorAll('.tech-pack-app .step').forEach(step => {
        step.classList.remove('active');
      });

      // Show current step
      const currentStep = document.querySelector(`.tech-pack-app .step[data-step="${stepNumber}"]`);
      if (currentStep) {
        currentStep.classList.add('active');
        this.scrollToTop();
      }

      // Update production info when entering step 3
      if (stepNumber === 3) {
        this.updateProductionInfo();
        this.updateGarmentSummary();
        this.validateQuantities();
      }

      // Populate review content when entering step 4
      if (stepNumber === 4) {
        this.populateReviewContent();
      }

      this.updateNavigation();
    }

    updateProgress() {
      const progressFill = document.querySelector('.tech-pack-app .progress-fill');
      const progressSteps = document.querySelectorAll('.tech-pack-app .progress-step');
      
      if (progressFill) {
        const percentage = (this.currentStep / this.totalSteps) * 100;
        progressFill.style.width = `${percentage}%`;
      }

      progressSteps.forEach((step, index) => {
        if (index + 1 <= this.currentStep) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
    }

    updateNavigation() {
      const nextBtn = document.getElementById('next-step-btn');
      const prevBtn = document.getElementById('prev-step-btn');

      if (prevBtn) {
        prevBtn.disabled = this.currentStep === 1;
      }

      if (nextBtn) {
        if (this.currentStep === this.totalSteps) {
          nextBtn.textContent = 'Submit Tech Pack';
        } else {
          nextBtn.textContent = 'Next Step';
        }
      }
    }

    validateCurrentStep() {
      switch (this.currentStep) {
        case 1: return this.validateStep1();
        case 2: return this.validateStep2();
        case 3: return this.validateStep3();
        case 4: return this.validateStep4();
        default: return true;
      }
    }

    validateStep1() {
      const requiredFields = [
        { id: 'client-name', name: 'Contact name' },
        { id: 'company-name', name: 'Business name' },
        { id: 'email', name: 'Email address' },
        { id: 'country', name: 'Business location' },
        { id: 'production-type', name: 'Production type' }
      ];
      
      let isValid = true;

      requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element && !element.value.trim()) {
          this.showFieldError(element, `${field.name} is required`);
          isValid = false;
        } else if (element) {
          this.clearFieldError(element);
        }
      });

      // Email validation
      const emailField = document.getElementById('email');
      if (emailField && emailField.value && !this.isValidEmail(emailField.value)) {
        this.showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
      }

      // VAT/EIN validation for specific countries
      const countryField = document.getElementById('country');
      const vatField = document.getElementById('vat-ein');
      if (countryField && vatField && this.requiresVAT(countryField.value)) {
        if (!vatField.value.trim()) {
          this.showFieldError(vatField, 'VAT/EIN number is required for your country');
          isValid = false;
        } else if (!this.isValidVATEIN(vatField.value, countryField.value)) {
          this.showFieldError(vatField, 'Please enter a valid VAT/EIN number');
          isValid = false;
        }
      }

      return isValid;
    }

    validateStep2() {
      if (this.formData.files.length === 0) {
        this.showError('Please upload at least one file to continue');
        return false;
      }

      // Check if we have essential files
      const hasDesignFiles = this.formData.files.some(f => 
        f.category === 'designs' || f.category === 'techpack'
      );

      if (!hasDesignFiles) {
        // Warning but allow to continue
        console.warn('No design or tech pack files detected. Consider uploading design files.');
      }

      return true;
    }

    validateStep3() {
      if (this.formData.garments.length === 0) {
        this.showError('Please add at least one garment type to continue');
        return false;
      }

      // Check if all garments have types selected
      const incompleteGarments = this.formData.garments.filter(g => !g.type);
      if (incompleteGarments.length > 0) {
        this.showError('Please select a type for all garments');
        return false;
      }

      // Check if all garments have colorways
      const garmentsWithoutColorways = this.formData.garments.filter(g => g.colorways.length === 0);
      if (garmentsWithoutColorways.length > 0) {
        this.showError('Please add at least one colorway for each garment');
        return false;
      }

      // Check quantity requirements
      const productionType = this.formData.clientInfo.productionType || 'our-blanks';
      let hasValidQuantities = true;

      this.formData.garments.forEach(garment => {
        const colorwayCount = garment.colorways.length;
        const garmentTotal = garment.totalQuantity;
        
        if (garmentTotal > 0) {
          const minQuantity = getMinimumQuantity(colorwayCount, productionType);
          if (garmentTotal < minQuantity) {
            hasValidQuantities = false;
          }
        }
      });

      if (!hasValidQuantities) {
        this.showError('Some garments do not meet minimum quantity requirements');
        return false;
      }

      // Check if at least one garment has quantities
      const totalQuantity = this.formData.garments.reduce((sum, g) => sum + g.totalQuantity, 0);
      if (totalQuantity === 0) {
        this.showError('Please specify quantities for your garments');
        return false;
      }

      return true;
    }

    validateStep4() {
      return true; // Final review step
    }

    validateField(field) {
      const value = field.value.trim();
      
      if (field.hasAttribute('required') && !value) {
        this.showFieldError(field, 'This field is required');
        return false;
      }

      if (field.type === 'email' && value && !this.isValidEmail(value)) {
        this.showFieldError(field, 'Please enter a valid email address');
        return false;
      }

      this.clearFieldError(field);
      return true;
    }

    showFieldError(field, message) {
      field.classList.add('error');
      
      let errorElement = field.parentNode.querySelector('.error-message');
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
      }
      errorElement.textContent = message;
    }

    clearFieldError(field) {
      field.classList.remove('error');
      const errorElement = field.parentNode.querySelector('.error-message');
      if (errorElement) {
        errorElement.remove();
      }
    }

    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    requiresVAT(countryCode) {
      // Countries that require VAT/EIN
      const vatCountries = ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'PT', 'AT', 'IE', 'DK', 'SE', 'FI'];
      const einCountries = ['US', 'CA'];
      return vatCountries.includes(countryCode) || einCountries.includes(countryCode);
    }

    isValidVATEIN(value, countryCode) {
      if (!value || !countryCode) return false;
      
      const cleanValue = value.replace(/\s+/g, '').toUpperCase();
      
      // Basic validation patterns
      const patterns = {
        'GB': /^GB\d{9}$|^\d{9}$/, // UK VAT
        'DE': /^DE\d{9}$|^\d{9}$/, // German VAT
        'FR': /^FR[A-Z0-9]{11}$|^[A-Z0-9]{11}$/, // French VAT
        'US': /^\d{2}-\d{7}$/, // US EIN
        'CA': /^\d{9}$/ // Canadian BN
      };
      
      if (patterns[countryCode]) {
        return patterns[countryCode].test(cleanValue);
      }
      
      // Generic validation for other countries
      return /^[A-Z0-9]{8,15}$/.test(cleanValue);
    }

    updateVATLabel(countryCode) {
      const vatLabel = document.querySelector('label[for="vat-ein"]');
      const vatField = document.getElementById('vat-ein');
      const vatGroup = document.getElementById('vat-ein').parentNode;
      
      if (!vatLabel || !vatField) return;
      
      if (this.requiresVAT(countryCode)) {
        vatGroup.classList.add('required');
        vatField.setAttribute('required', '');
        
        switch (countryCode) {
          case 'US':
            vatLabel.textContent = 'EIN Number *';
            vatField.placeholder = 'e.g., 12-3456789';
            break;
          case 'CA':
            vatLabel.textContent = 'Business Number *';
            vatField.placeholder = 'e.g., 123456789';
            break;
          case 'GB':
            vatLabel.textContent = 'VAT Number *';
            vatField.placeholder = 'e.g., GB123456789';
            break;
          default:
            vatLabel.textContent = 'VAT Number *';
            vatField.placeholder = 'e.g., DE123456789';
        }
      } else {
        vatGroup.classList.remove('required');
        vatField.removeAttribute('required');
        vatLabel.textContent = 'VAT/Tax Number';
        vatField.placeholder = 'Optional';
      }
    }

    updateProductionTypeHints(productionType) {
      const hints = {
        'our-blanks': {
          title: 'Our Blanks Production',
          description: 'Using our premium blank garments with your custom designs',
          minimums: 'Min: 30 pieces (single colorway) or 20 pieces (multiple colorways)'
        },
        'custom-production': {
          title: 'Custom Production',
          description: 'Fully custom garments manufactured to your specifications',
          minimums: 'Min: 75 pieces per design'
        }
      };

      // Add or update hint element
      const productionSelect = document.getElementById('production-type');
      if (!productionSelect) return;

      let hintElement = productionSelect.parentNode.querySelector('.production-hint');
      
      if (productionType && hints[productionType]) {
        if (!hintElement) {
          hintElement = document.createElement('div');
          hintElement.className = 'production-hint';
          productionSelect.parentNode.appendChild(hintElement);
        }
        
        hintElement.innerHTML = `
          <div class="production-hint__content">
            <strong>${hints[productionType].title}</strong>
            <p>${hints[productionType].description}</p>
            <small>${hints[productionType].minimums}</small>
          </div>
        `;
      } else if (hintElement) {
        hintElement.remove();
      }
    }

    saveCurrentStepData() {
      const currentStepElement = document.querySelector('.tech-pack-app .step.active');
      if (!currentStepElement) return;

      const formInputs = currentStepElement.querySelectorAll('input, textarea, select');
      const stepData = {};

      formInputs.forEach(input => {
        if (input.name) {
          stepData[input.name] = input.value;
        }
      });

      switch (this.currentStep) {
        case 1:
          this.formData.clientInfo = stepData;
          break;
        case 2:
          // Files are managed separately
          break;
        case 3:
          // Garments are managed separately
          break;
      }
    }

    initFileUpload() {
      const uploadZone = document.querySelector('#file-upload-zone');
      const fileInput = document.querySelector('#file-input');
      const dragoverElement = document.querySelector('.file-upload-dragover');
      const uploadContent = document.querySelector('.file-upload-content');

      if (!uploadZone || !fileInput) return;

      // Drag & Drop Events
      uploadZone.addEventListener('dragenter', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });

      uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadZone.classList.add('dragover');
        if (dragoverElement && uploadContent) {
          dragoverElement.style.display = 'flex';
          uploadContent.style.display = 'none';
        }
      });

      uploadZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Only remove dragover if leaving the upload zone completely
        if (!uploadZone.contains(e.relatedTarget)) {
          uploadZone.classList.remove('dragover');
          if (dragoverElement && uploadContent) {
            dragoverElement.style.display = 'none';
            uploadContent.style.display = 'flex';
          }
        }
      });

      uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadZone.classList.remove('dragover');
        if (dragoverElement && uploadContent) {
          dragoverElement.style.display = 'none';
          uploadContent.style.display = 'flex';
        }
        this.handleFiles(e.dataTransfer.files);
      });

      // Click to upload
      uploadZone.addEventListener('click', (e) => {
        // Don't trigger if clicking on action buttons
        if (!e.target.closest('.file-item__action')) {
          fileInput.click();
        }
      });

      fileInput.addEventListener('change', (e) => {
        this.handleFiles(e.target.files);
        // Reset file input so the same file can be selected again
        e.target.value = '';
      });

      // File category buttons
      document.addEventListener('click', (e) => {
        if (e.target.matches('.file-category') || e.target.closest('.file-category')) {
          const category = e.target.closest('.file-category');
          this.toggleFileCategory(category.dataset.category);
        }
        
        if (e.target.matches('#clear-all-files')) {
          this.clearAllFiles();
        }
      });
    }

    handleFiles(files) {
      Array.from(files).forEach(file => {
        if (this.validateFile(file)) {
          this.addFile(file);
        }
      });
    }

    validateFile(file) {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!CONFIG.VALID_FILE_TYPES.includes(extension)) {
        alert(`Invalid file type: ${extension}. Allowed: ${CONFIG.VALID_FILE_TYPES.join(', ')}`);
        return false;
      }

      if (file.size > CONFIG.MAX_FILE_SIZE) {
        alert(`File too large: ${file.name}. Maximum size: 10MB`);
        return false;
      }

      if (this.formData.files.length >= CONFIG.MAX_FILES) {
        alert(`Maximum ${CONFIG.MAX_FILES} files allowed`);
        return false;
      }

      return true;
    }

    addFile(file) {
      const fileData = {
        id: ++this.counters.file,
        name: file.name,
        size: file.size,
        type: file.type,
        extension: this.getFileExtension(file.name),
        category: this.detectFileCategory(file.name),
        file: file,
        uploadedAt: new Date()
      };

      this.formData.files.push(fileData);
      this.renderFileList();
      this.updateFileCounts();
      this.updateFileCounter();
    }

    removeFile(fileId) {
      this.formData.files = this.formData.files.filter(f => f.id !== fileId);
      this.renderFileList();
      this.updateFileCounts();
      this.updateFileCounter();
    }

    clearAllFiles() {
      this.formData.files = [];
      this.renderFileList();
      this.updateFileCounts();
      this.updateFileCounter();
    }

    getFileExtension(filename) {
      return '.' + filename.split('.').pop().toLowerCase();
    }

    detectFileCategory(filename) {
      const name = filename.toLowerCase();
      
      if (name.includes('design') || name.includes('artwork') || name.endsWith('.ai')) {
        return 'designs';
      } else if (name.includes('reference') || name.includes('ref') || name.includes('inspiration')) {
        return 'references';
      } else if (name.includes('techpack') || name.includes('spec') || name.includes('tech')) {
        return 'techpack';
      } else {
        return 'other';
      }
    }

    getFileIcon(extension, category) {
      const icons = {
        '.pdf': '📄',
        '.ai': '🎨',
        '.png': '🖼️',
        '.jpg': '🖼️',
        '.jpeg': '🖼️',
        '.zip': '📦'
      };
      
      return icons[extension] || '📄';
    }

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    renderFileList() {
      const fileList = document.querySelector('#file-list');
      if (!fileList) return;

      if (this.formData.files.length === 0) {
        fileList.innerHTML = '<div class="file-list-empty">No files uploaded yet</div>';
        return;
      }

      fileList.innerHTML = this.formData.files.map(file => `
        <div class="file-item" data-file-id="${file.id}">
          <div class="file-item__icon">
            ${this.getFileIcon(file.extension, file.category)}
          </div>
          <div class="file-item__info">
            <div class="file-item__name" title="${file.name}">
              ${file.name}
            </div>
            <div class="file-item__details">
              <span>${this.formatFileSize(file.size)}</span>
              <span class="file-item__category">${file.category}</span>
            </div>
          </div>
          <div class="file-item__actions">
            <button type="button" class="file-item__action" onclick="techPackApp.changeFileCategory(${file.id})" title="Change category">
              🏷️
            </button>
            <button type="button" class="file-item__action remove" onclick="techPackApp.removeFile(${file.id})" title="Remove file">
              🗑️
            </button>
          </div>
        </div>
      `).join('');
    }

    updateFileCounts() {
      const categories = ['designs', 'references', 'techpack', 'other'];
      
      categories.forEach(category => {
        const count = this.formData.files.filter(f => f.category === category).length;
        const countElement = document.querySelector(`[data-category="${category}"] .file-category__count`);
        if (countElement) {
          countElement.textContent = count;
        }
      });
    }

    updateFileCounter() {
      const fileCountElement = document.getElementById('file-count');
      const clearButton = document.getElementById('clear-all-files');
      
      if (fileCountElement) {
        fileCountElement.textContent = this.formData.files.length;
      }
      
      if (clearButton) {
        clearButton.style.display = this.formData.files.length > 0 ? 'block' : 'none';
      }
    }

    toggleFileCategory(category) {
      // Toggle active state for visual feedback
      document.querySelectorAll('.file-category').forEach(cat => {
        cat.classList.remove('active');
      });
      
      const categoryElement = document.querySelector(`[data-category="${category}"]`);
      if (categoryElement) {
        categoryElement.classList.add('active');
        
        // Remove active state after a short delay
        setTimeout(() => {
          categoryElement.classList.remove('active');
        }, 1000);
      }
    }

    changeFileCategory(fileId) {
      const file = this.formData.files.find(f => f.id === fileId);
      if (!file) return;

      const categories = ['designs', 'references', 'techpack', 'other'];
      const currentIndex = categories.indexOf(file.category);
      const nextIndex = (currentIndex + 1) % categories.length;
      
      file.category = categories[nextIndex];
      this.renderFileList();
      this.updateFileCounts();
    }

    initGarmentManagement() {
      // Initialize production info on step 3
      document.addEventListener('click', (e) => {
        if (e.target.matches('#add-garment-btn')) {
          e.preventDefault();
          this.addGarment();
        }
        if (e.target.matches('.garment-item__remove')) {
          e.preventDefault();
          const garmentId = parseInt(e.target.dataset.garmentId);
          this.removeGarment(garmentId);
        }
        if (e.target.matches('.colorway-section__add')) {
          e.preventDefault();
          const garmentId = parseInt(e.target.dataset.garmentId);
          this.addColorway(garmentId);
        }
        if (e.target.matches('.colorway-item__remove')) {
          e.preventDefault();
          const garmentId = parseInt(e.target.dataset.garmentId);
          const colorwayId = parseInt(e.target.dataset.colorwayId);
          this.removeColorway(garmentId, colorwayId);
        }
      });

      // Handle form changes
      document.addEventListener('change', (e) => {
        if (e.target.matches('[name^="garment-type-"]')) {
          const garmentId = parseInt(e.target.name.split('-')[2]);
          this.updateGarmentType(garmentId, e.target.value);
        }
        if (e.target.matches('[name^="colorway-name-"]')) {
          const [, , garmentId, colorwayId] = e.target.name.split('-');
          this.updateColorwayName(parseInt(garmentId), parseInt(colorwayId), e.target.value);
        }
      });

      // Handle quantity inputs
      document.addEventListener('input', debounce((e) => {
        if (e.target.matches('.quantity-input__field')) {
          this.updateQuantities();
        }
      }, 300));
    }

    addGarment() {
      const garmentData = {
        id: ++this.counters.garment,
        type: '',
        colorways: [],
        totalQuantity: 0
      };

      this.formData.garments.push(garmentData);
      this.renderGarmentList();
      this.updateGarmentSummary();
    }

    removeGarment(garmentId) {
      this.formData.garments = this.formData.garments.filter(g => g.id !== garmentId);
      this.renderGarmentList();
      this.updateGarmentSummary();
      this.validateQuantities();
    }

    updateGarmentType(garmentId, type) {
      const garment = this.formData.garments.find(g => g.id === garmentId);
      if (garment) {
        garment.type = type;
        // Add first colorway automatically when type is selected
        if (type && garment.colorways.length === 0) {
          this.addColorway(garmentId);
        }
      }
    }

    addColorway(garmentId) {
      const garment = this.formData.garments.find(g => g.id === garmentId);
      if (!garment) return;

      const colorway = {
        id: Date.now(), // Use timestamp for unique IDs
        name: `Color ${garment.colorways.length + 1}`,
        quantities: {
          XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0
        },
        total: 0
      };

      garment.colorways.push(colorway);
      this.renderGarmentList();
      this.updateGarmentSummary();
    }

    removeColorway(garmentId, colorwayId) {
      const garment = this.formData.garments.find(g => g.id === garmentId);
      if (garment) {
        garment.colorways = garment.colorways.filter(c => c.id !== colorwayId);
        this.renderGarmentList();
        this.updateGarmentSummary();
        this.validateQuantities();
      }
    }

    updateColorwayName(garmentId, colorwayId, name) {
      const garment = this.formData.garments.find(g => g.id === garmentId);
      if (garment) {
        const colorway = garment.colorways.find(c => c.id === colorwayId);
        if (colorway) {
          colorway.name = name;
        }
      }
    }

    updateQuantities() {
      this.formData.garments.forEach(garment => {
        garment.colorways.forEach(colorway => {
          let total = 0;
          Object.keys(colorway.quantities).forEach(size => {
            const input = document.querySelector(`[name="quantity-${garment.id}-${colorway.id}-${size}"]`);
            if (input) {
              const value = parseInt(input.value) || 0;
              colorway.quantities[size] = value;
              total += value;
            }
          });
          colorway.total = total;
        });
        
        garment.totalQuantity = garment.colorways.reduce((sum, c) => sum + c.total, 0);
      });

      this.updateGarmentSummary();
      this.validateQuantities();
    }

    updateGarmentSummary() {
      const garmentCount = this.formData.garments.length;
      const totalQuantity = this.formData.garments.reduce((sum, g) => sum + g.totalQuantity, 0);

      const garmentCountEl = document.querySelector('.garment-count');
      const totalQuantityEl = document.querySelector('.total-quantity');

      if (garmentCountEl) {
        garmentCountEl.textContent = `${garmentCount} garment${garmentCount !== 1 ? 's' : ''}`;
      }
      if (totalQuantityEl) {
        totalQuantityEl.textContent = `${totalQuantity} total pieces`;
      }
    }

    validateQuantities() {
      const productionType = this.formData.clientInfo.productionType || 'our-blanks';
      const validation = document.getElementById('quantity-validation');
      
      if (!validation) return;

      let isValid = true;
      let messages = [];
      let totalQuantity = 0;

      this.formData.garments.forEach(garment => {
        const colorwayCount = garment.colorways.length;
        const garmentTotal = garment.totalQuantity;
        totalQuantity += garmentTotal;

        if (garmentTotal > 0) {
          const minQuantity = getMinimumQuantity(colorwayCount, productionType);
          
          if (garmentTotal < minQuantity) {
            isValid = false;
            messages.push(`${garment.type || 'Garment'}: ${garmentTotal} pieces (minimum: ${minQuantity})`);
          }
        }
      });

      // Update validation display
      const statusEl = validation.querySelector('.quantity-validation__status');
      const detailsEl = validation.querySelector('.quantity-validation__details');

      validation.classList.remove('valid', 'invalid', 'warning');

      if (totalQuantity === 0) {
        validation.style.display = 'none';
        return;
      }

      validation.style.display = 'block';

      if (isValid) {
        validation.classList.add('valid');
        statusEl.textContent = '✓ Quantity requirements met';
        detailsEl.textContent = `Total: ${totalQuantity} pieces across ${this.formData.garments.length} garment types`;
      } else {
        validation.classList.add('invalid');
        statusEl.textContent = '⚠ Minimum quantity requirements not met';
        detailsEl.innerHTML = messages.join('<br>');
      }
    }

    updateProductionInfo() {
      const productionType = this.formData.clientInfo.productionType;
      const productionTypeDisplay = document.querySelector('.production-type-display');
      const minimumQuantityDisplay = document.querySelector('.minimum-quantity-display');

      if (productionTypeDisplay && productionType) {
        const typeNames = {
          'our-blanks': 'Our Blanks Production',
          'custom-production': 'Custom Production'
        };
        productionTypeDisplay.textContent = typeNames[productionType] || productionType;
      }

      if (minimumQuantityDisplay) {
        if (productionType === 'our-blanks') {
          minimumQuantityDisplay.textContent = 'Minimum: 30 pieces (single colorway) or 20 pieces (multiple colorways)';
        } else {
          minimumQuantityDisplay.textContent = 'Minimum: 75 pieces per garment type';
        }
      }
    }

    renderGarmentList() {
      const garmentList = document.querySelector('#garment-list');
      if (!garmentList) return;

      if (this.formData.garments.length === 0) {
        garmentList.innerHTML = `
          <div class="garment-list-empty">
            <div class="garment-list-empty__icon">👕</div>
            <p>No garments added yet</p>
            <p class="garment-list-empty__hint">Click "Add Garment Type" to start defining your products</p>
          </div>
        `;
        return;
      }

      garmentList.innerHTML = this.formData.garments.map(garment => `
        <div class="garment-item" data-garment-id="${garment.id}">
          <div class="garment-item__header">
            <h4 class="garment-item__title">Garment ${garment.id}</h4>
            <button type="button" class="garment-item__remove" data-garment-id="${garment.id}">
              🗑️ Remove
            </button>
          </div>
          
          <div class="garment-item__form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Garment Type *</label>
                <select class="form-input" name="garment-type-${garment.id}" required>
                  <option value="">Select garment type</option>
                  <option value="T-Shirt" ${garment.type === 'T-Shirt' ? 'selected' : ''}>T-Shirt</option>
                  <option value="Hoodie" ${garment.type === 'Hoodie' ? 'selected' : ''}>Hoodie</option>
                  <option value="Sweatshirt" ${garment.type === 'Sweatshirt' ? 'selected' : ''}>Sweatshirt</option>
                  <option value="Tank Top" ${garment.type === 'Tank Top' ? 'selected' : ''}>Tank Top</option>
                  <option value="Long Sleeve" ${garment.type === 'Long Sleeve' ? 'selected' : ''}>Long Sleeve</option>
                  <option value="Polo" ${garment.type === 'Polo' ? 'selected' : ''}>Polo</option>
                  <option value="Jacket" ${garment.type === 'Jacket' ? 'selected' : ''}>Jacket</option>
                  <option value="Shorts" ${garment.type === 'Shorts' ? 'selected' : ''}>Shorts</option>
                  <option value="Other" ${garment.type === 'Other' ? 'selected' : ''}>Other</option>
                </select>
              </div>
            </div>
            
            ${garment.type ? this.renderColorwaySection(garment) : ''}
          </div>
        </div>
      `).join('');
    }

    renderColorwaySection(garment) {
      return `
        <div class="colorway-section">
          <div class="colorway-section__header">
            <h5 class="colorway-section__title">Colorways & Quantities</h5>
            <button type="button" class="colorway-section__add" data-garment-id="${garment.id}">
              + Add Colorway
            </button>
          </div>
          
          <div class="colorway-list">
            ${garment.colorways.map(colorway => this.renderColorwayItem(garment.id, colorway)).join('')}
          </div>
        </div>
      `;
    }

    renderColorwayItem(garmentId, colorway) {
      const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      
      return `
        <div class="colorway-item">
          <div class="colorway-item__header">
            <input type="text" 
                   name="colorway-name-${garmentId}-${colorway.id}" 
                   value="${colorway.name}" 
                   class="colorway-item__name" 
                   placeholder="Colorway name">
            <button type="button" class="colorway-item__remove" 
                    data-garment-id="${garmentId}" 
                    data-colorway-id="${colorway.id}">
              Remove
            </button>
          </div>
          
          <div class="colorway-item__quantities">
            ${sizes.map(size => `
              <div class="quantity-input">
                <label class="quantity-input__label">${size}</label>
                <input type="number" 
                       name="quantity-${garmentId}-${colorway.id}-${size}"
                       value="${colorway.quantities[size] || 0}"
                       min="0" 
                       class="quantity-input__field"
                       placeholder="0">
              </div>
            `).join('')}
            <div class="quantity-input">
              <label class="quantity-input__label">Total</label>
              <div class="quantity-input__total">${colorway.total || 0}</div>
            </div>
          </div>
        </div>
      `;
    }

    initReviewSubmit() {
      // Edit buttons
      document.addEventListener('click', (e) => {
        if (e.target.matches('.review-section__edit')) {
          const stepNumber = parseInt(e.target.dataset.editStep);
          this.goToStep(stepNumber);
        }
        
        if (e.target.matches('#submit-techpack-btn')) {
          e.preventDefault();
          this.submitForm();
        }
      });

      // Terms agreement checkbox
      document.addEventListener('change', (e) => {
        if (e.target.matches('#terms-agreement')) {
          this.updateSubmitButton();
        }
      });
    }

    populateReviewContent() {
      this.populateClientReview();
      this.populateFilesReview();
      this.populateGarmentsReview();
      this.populateSummaryReview();
    }

    populateClientReview() {
      const content = document.getElementById('review-client-content');
      if (!content) return;

      const client = this.formData.clientInfo;
      
      content.innerHTML = `
        <div class="review-item">
          <div class="review-item__label">Contact Name</div>
          <div class="review-item__value">${client.clientName || 'Not provided'}</div>
        </div>
        <div class="review-item">
          <div class="review-item__label">Business Name</div>
          <div class="review-item__value">${client.companyName || 'Not provided'}</div>
        </div>
        <div class="review-item">
          <div class="review-item__label">Email</div>
          <div class="review-item__value">${client.email || 'Not provided'}</div>
        </div>
        <div class="review-item">
          <div class="review-item__label">Country</div>
          <div class="review-item__value">${this.getCountryName(client.country) || 'Not provided'}</div>
        </div>
        <div class="review-item">
          <div class="review-item__label">Production Type</div>
          <div class="review-item__value">${this.getProductionTypeName(client.productionType) || 'Not provided'}</div>
        </div>
        ${client.vatEin ? `
          <div class="review-item">
            <div class="review-item__label">VAT/EIN</div>
            <div class="review-item__value">${client.vatEin}</div>
          </div>
        ` : ''}
        ${client.phone ? `
          <div class="review-item">
            <div class="review-item__label">Phone</div>
            <div class="review-item__value">${client.phone}</div>
          </div>
        ` : ''}
        ${client.deadline ? `
          <div class="review-item">
            <div class="review-item__label">Target Deadline</div>
            <div class="review-item__value">${client.deadline}</div>
          </div>
        ` : ''}
        ${client.notes ? `
          <div class="review-item">
            <div class="review-item__label">Project Notes</div>
            <div class="review-item__value">${client.notes}</div>
          </div>
        ` : ''}
      `;
    }

    populateFilesReview() {
      const content = document.getElementById('review-files-content');
      if (!content) return;

      if (this.formData.files.length === 0) {
        content.innerHTML = '<p>No files uploaded</p>';
        return;
      }

      content.innerHTML = `
        <div class="review-files">
          ${this.formData.files.map(file => `
            <div class="review-file">
              <div class="review-file__icon">${this.getFileIcon(file.extension, file.category)}</div>
              <div class="review-file__info">
                <div class="review-file__name">${file.name}</div>
                <div class="review-file__details">
                  <span>${this.formatFileSize(file.size)}</span>
                  <span class="review-file__category">${file.category}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    populateGarmentsReview() {
      const content = document.getElementById('review-garments-content');
      if (!content) return;

      if (this.formData.garments.length === 0) {
        content.innerHTML = '<p>No garments specified</p>';
        return;
      }

      content.innerHTML = `
        <div class="review-garments">
          ${this.formData.garments.map(garment => `
            <div class="review-garment">
              <div class="review-garment__header">
                <div class="review-garment__title">${garment.type || 'Unknown Type'}</div>
                <div class="review-garment__total">${garment.totalQuantity} pieces</div>
              </div>
              <div class="review-colorways">
                ${garment.colorways.map(colorway => `
                  <div class="review-colorway">
                    <div class="review-colorway__name">${colorway.name} - ${colorway.total} pieces</div>
                    <div class="review-colorway__sizes">
                      ${Object.entries(colorway.quantities).filter(([size, qty]) => qty > 0).map(([size, qty]) => `
                        <div class="review-size">
                          <span class="review-size__label">${size}</span>
                          <span class="review-size__quantity">${qty}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    populateSummaryReview() {
      const content = document.getElementById('review-summary-content');
      if (!content) return;

      const totalFiles = this.formData.files.length;
      const totalGarments = this.formData.garments.length;
      const totalQuantity = this.formData.garments.reduce((sum, g) => sum + g.totalQuantity, 0);
      const totalColorways = this.formData.garments.reduce((sum, g) => sum + g.colorways.length, 0);

      content.innerHTML = `
        <div class="summary-stats">
          <div class="summary-stat">
            <span class="summary-stat__value">${totalFiles}</span>
            <span class="summary-stat__label">Files Uploaded</span>
          </div>
          <div class="summary-stat">
            <span class="summary-stat__value">${totalGarments}</span>
            <span class="summary-stat__label">Garment Types</span>
          </div>
          <div class="summary-stat">
            <span class="summary-stat__value">${totalColorways}</span>
            <span class="summary-stat__label">Colorways</span>
          </div>
          <div class="summary-stat">
            <span class="summary-stat__value">${totalQuantity}</span>
            <span class="summary-stat__label">Total Pieces</span>
          </div>
        </div>
        
        <div class="review-item">
          <div class="review-item__label">Production Type</div>
          <div class="review-item__value">${this.getProductionTypeName(this.formData.clientInfo.productionType)}</div>
        </div>
        <div class="review-item">
          <div class="review-item__label">Estimated Delivery</div>
          <div class="review-item__value">6+ weeks from order confirmation</div>
        </div>
        <div class="review-item">
          <div class="review-item__label">Contact Email</div>
          <div class="review-item__value">office@genuineblanks.com</div>
        </div>
      `;
    }

    getCountryName(countryCode) {
      const countries = {
        'US': 'United States',
        'GB': 'United Kingdom',
        'CA': 'Canada',
        'AU': 'Australia',
        'DE': 'Germany',
        'FR': 'France',
        'IT': 'Italy',
        'ES': 'Spain',
        'NL': 'Netherlands',
        'BE': 'Belgium',
        'PT': 'Portugal',
        'other': 'Other Country'
      };
      return countries[countryCode] || countryCode;
    }

    getProductionTypeName(type) {
      const types = {
        'our-blanks': 'Our Blanks Production',
        'custom-production': 'Custom Production'
      };
      return types[type] || type;
    }

    updateSubmitButton() {
      const termsChecked = document.getElementById('terms-agreement')?.checked;
      const submitBtn = document.getElementById('submit-techpack-btn');
      
      if (submitBtn) {
        submitBtn.disabled = !termsChecked;
      }
    }

    submitForm() {
      this.saveCurrentStepData();
      
      const submitData = {
        clientInfo: this.formData.clientInfo,
        files: this.formData.files.map(f => ({ 
          name: f.name, 
          size: f.size, 
          type: f.type, 
          category: f.category 
        })),
        garments: this.formData.garments,
        summary: {
          totalFiles: this.formData.files.length,
          totalGarments: this.formData.garments.length,
          totalQuantity: this.formData.garments.reduce((sum, g) => sum + g.totalQuantity, 0),
          totalColorways: this.formData.garments.reduce((sum, g) => sum + g.colorways.length, 0)
        },
        timestamp: new Date().toISOString(),
        submissionId: Date.now()
      };

      console.log('Submitting tech pack:', submitData);
      
      // Show loading
      const submitBtn = document.getElementById('submit-techpack-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';
      }

      // Simulate submission
      setTimeout(() => {
        this.showSuccess('Tech Pack submitted successfully! We will contact you within 24-48 hours.');
        
        // Reset form
        setTimeout(() => {
          this.reset();
        }, 3000);
        
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span class="btn-icon">📤</span> Submit Tech Pack';
        }
      }, 2000);
    }

    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    window.techPackApp = new TechPackApp();
    window.techPackApp.init();
  });

})();