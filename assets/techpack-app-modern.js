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

      // File Upload
      this.initFileUpload();
      
      // Garment Management
      this.initGarmentManagement();
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
      const requiredFields = ['client-name', 'client-email', 'client-company'];
      let isValid = true;

      requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
          this.showFieldError(field, 'This field is required');
          isValid = false;
        } else if (field) {
          this.clearFieldError(field);
        }
      });

      // Email validation
      const emailField = document.getElementById('client-email');
      if (emailField && emailField.value && !this.isValidEmail(emailField.value)) {
        this.showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
      }

      return isValid;
    }

    validateStep2() {
      return this.formData.files.length > 0;
    }

    validateStep3() {
      return this.formData.garments.length > 0;
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
      const uploadArea = document.querySelector('.file-upload-area');
      const fileInput = document.querySelector('#file-input');

      if (!uploadArea || !fileInput) return;

      // Drag & Drop
      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
      });

      uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
      });

      uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        this.handleFiles(e.dataTransfer.files);
      });

      // Click to upload
      uploadArea.addEventListener('click', () => {
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        this.handleFiles(e.target.files);
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
        file: file
      };

      this.formData.files.push(fileData);
      this.renderFileList();
    }

    removeFile(fileId) {
      this.formData.files = this.formData.files.filter(f => f.id !== fileId);
      this.renderFileList();
    }

    renderFileList() {
      const fileList = document.querySelector('.file-list');
      if (!fileList) return;

      fileList.innerHTML = this.formData.files.map(file => `
        <div class="file-item">
          <span>${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)</span>
          <button type="button" class="btn btn-remove" onclick="techPackApp.removeFile(${file.id})">Remove</button>
        </div>
      `).join('');
    }

    initGarmentManagement() {
      document.addEventListener('click', (e) => {
        if (e.target.matches('#add-garment-btn')) {
          e.preventDefault();
          this.addGarment();
        }
        if (e.target.matches('.remove-garment-btn')) {
          e.preventDefault();
          const garmentId = parseInt(e.target.dataset.garmentId);
          this.removeGarment(garmentId);
        }
      });
    }

    addGarment() {
      const garmentData = {
        id: ++this.counters.garment,
        type: '',
        colorways: [],
        quantities: {}
      };

      this.formData.garments.push(garmentData);
      this.renderGarmentList();
    }

    removeGarment(garmentId) {
      this.formData.garments = this.formData.garments.filter(g => g.id !== garmentId);
      this.renderGarmentList();
    }

    renderGarmentList() {
      const garmentList = document.querySelector('.garment-list');
      if (!garmentList) return;

      garmentList.innerHTML = this.formData.garments.map(garment => `
        <div class="garment-item" data-garment-id="${garment.id}">
          <div class="garment-header">
            <h4>Garment ${garment.id}</h4>
            <button type="button" class="btn btn-remove remove-garment-btn" data-garment-id="${garment.id}">Remove</button>
          </div>
          <div class="form-group">
            <label class="form-label">Garment Type</label>
            <select class="form-input" name="garment-type-${garment.id}">
              <option value="">Select garment type</option>
              <option value="t-shirt">T-Shirt</option>
              <option value="hoodie">Hoodie</option>
              <option value="sweatshirt">Sweatshirt</option>
              <option value="tank-top">Tank Top</option>
            </select>
          </div>
        </div>
      `).join('');
    }

    submitForm() {
      this.saveCurrentStepData();
      
      const submitData = {
        clientInfo: this.formData.clientInfo,
        files: this.formData.files.map(f => ({ name: f.name, size: f.size, type: f.type })),
        garments: this.formData.garments,
        timestamp: new Date().toISOString()
      };

      console.log('Submitting tech pack:', submitData);
      
      // Show loading
      const submitBtn = document.getElementById('next-step-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';
      }

      // Simulate submission
      setTimeout(() => {
        alert('Tech Pack submitted successfully! We will contact you within 24 hours.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Tech Pack';
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