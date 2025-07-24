// ===============================================
// TECH PACK CORE MANAGERS MODULE
// ===============================================

// Enhanced Step Manager
class StepManager {
  constructor(state, animationManager) {
    this.state = state;
    this.animationManager = animationManager;
    this.steps = ['0', '1', '2', '3', '4']; // Include step 0 for registration check
    this.stepElements = new Map();
    this.initialized = false;
  }

  init() {
    this.cacheStepElements();
    this.attachNavigationListeners();
    this.updateProgress();
    this.initialized = true;
  }

  cacheStepElements() {
    this.steps.forEach(step => {
      const element = document.querySelector(`#techpack-step-${step}`);
      if (element) {
        this.stepElements.set(step, element);
      }
    });
  }

  attachNavigationListeners() {
    // Next buttons
    document.addEventListener('click', (e) => {
      if (e.target.matches('[id$="-next"]')) {
        e.preventDefault();
        this.handleNextStep(e.target);
      }
    });

    // Back buttons
    document.addEventListener('click', (e) => {
      if (e.target.matches('[id$="-back"]')) {
        e.preventDefault();
        this.handlePreviousStep();
      }
    });
  }

  async handleNextStep(button) {
    const currentStep = this.getCurrentStep();
    const nextStep = this.getNextStep(currentStep);

    if (!nextStep) return;

    // Validate current step before proceeding
    if (await this.validateCurrentStep()) {
      await this.goToStep(nextStep, 'forward');
    }
  }

  async handlePreviousStep() {
    const currentStep = this.getCurrentStep();
    const previousStep = this.getPreviousStep(currentStep);

    if (previousStep !== null) {
      await this.goToStep(previousStep, 'backward');
    }
  }

  async goToStep(stepNumber, direction = 'forward') {
    const currentStep = this.getCurrentStep();
    
    if (currentStep === stepNumber) return;

    // Hide current step
    const currentElement = this.stepElements.get(currentStep.toString());
    const nextElement = this.stepElements.get(stepNumber.toString());

    if (currentElement && nextElement) {
      currentElement.style.display = 'none';
      nextElement.style.display = 'block';

      // Animate transition if animation manager is available
      if (this.animationManager) {
        await this.animationManager.transitionToStep(currentStep, stepNumber, direction);
      }
    }

    // Update state
    this.state.currentStep = stepNumber;
    this.updateProgress();
    this.updateURL();

    // Trigger step change event
    this.triggerStepChangeEvent(currentStep, stepNumber);
  }

  getCurrentStep() {
    return this.state.currentStep;
  }

  getNextStep(currentStep) {
    const currentIndex = this.steps.indexOf(currentStep.toString());
    return currentIndex < this.steps.length - 1 ? parseInt(this.steps[currentIndex + 1]) : null;
  }

  getPreviousStep(currentStep) {
    const currentIndex = this.steps.indexOf(currentStep.toString());
    return currentIndex > 0 ? parseInt(this.steps[currentIndex - 1]) : null;
  }

  updateProgress() {
    const currentStep = this.getCurrentStep();
    const progressPercentage = (currentStep / (this.steps.length - 1)) * 100;

    // Update progress bar
    const progressFill = document.querySelector('.techpack-progress__fill');
    if (progressFill) {
      progressFill.style.width = `${progressPercentage}%`;
    }

    // Update step indicators
    this.steps.forEach((step, index) => {
      const stepElement = document.querySelector(`[data-step="${step}"] .techpack-progress__step`);
      const circle = document.querySelector(`[data-step="${step}"] .techpack-progress__step-circle`);
      
      if (stepElement && circle) {
        const stepNum = parseInt(step);
        if (stepNum < currentStep) {
          // Completed step
          circle.classList.add('techpack-progress__step-circle--completed');
          circle.classList.remove('techpack-progress__step-circle--active');
          circle.textContent = '✓';
        } else if (stepNum === currentStep) {
          // Active step
          circle.classList.add('techpack-progress__step-circle--active');
          circle.classList.remove('techpack-progress__step-circle--completed');
          circle.textContent = stepNum + 1;
        } else {
          // Future step
          circle.classList.remove('techpack-progress__step-circle--active', 'techpack-progress__step-circle--completed');
          circle.textContent = stepNum + 1;
        }
      }
    });
  }

  async validateCurrentStep() {
    const currentStep = this.getCurrentStep();
    
    // Step-specific validation logic
    switch (currentStep) {
      case 0:
        return this.validateRegistrationStep();
      case 1:
        return this.validateClientInfoStep();
      case 2:
        return this.validateFileUploadStep();
      case 3:
        return this.validateGarmentSpecsStep();
      default:
        return true;
    }
  }

  validateRegistrationStep() {
    // Registration step should be handled by the button click handlers
    return true;
  }

  validateClientInfoStep() {
    const formValidator = window.techPackApp?.validator;
    if (!formValidator) return true;

    const formData = this.getFormData();
    const result = formValidator.validateAll(formData);
    
    if (!result.isValid) {
      // Show validation errors
      Object.entries(result.errors).forEach(([field, errors]) => {
        formValidator.showFieldError(field, errors[0]);
      });
      return false;
    }

    return true;
  }

  validateFileUploadStep() {
    const files = this.state.formData.files || [];
    if (files.length === 0) {
      this.showStepError('Please upload at least one file before continuing.');
      return false;
    }
    return true;
  }

  validateGarmentSpecsStep() {
    const garments = this.state.formData.garments || [];
    if (garments.length === 0) {
      this.showStepError('Please add at least one garment specification.');
      return false;
    }
    return true;
  }

  getFormData() {
    const formData = {};
    const form = document.querySelector('.techpack-form');
    
    if (form) {
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        if (input.name) {
          formData[input.name] = input.value;
        }
      });
    }

    return formData;
  }

  showStepError(message) {
    // Create or show error message for the step
    let errorElement = document.querySelector('.techpack-step-error');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'techpack-step-error';
      errorElement.style.cssText = `
        background: rgba(220, 38, 38, 0.1);
        border: 1px solid #dc2626;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
        color: #dc2626;
        font-size: 0.875rem;
      `;
      
      const currentStepElement = this.stepElements.get(this.getCurrentStep().toString());
      if (currentStepElement) {
        const content = currentStepElement.querySelector('.techpack-content');
        if (content) {
          content.insertBefore(errorElement, content.firstChild);
        }
      }
    }

    errorElement.textContent = message;
    errorElement.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (errorElement) {
        errorElement.style.display = 'none';
      }
    }, 5000);
  }

  updateURL() {
    // Update URL to reflect current step without page reload
    const url = new URL(window.location);
    url.searchParams.set('step', this.getCurrentStep());
    window.history.replaceState({}, '', url);
  }

  triggerStepChangeEvent(fromStep, toStep) {
    const event = new CustomEvent('techpack:stepChange', {
      detail: { fromStep, toStep, state: this.state.getState() }
    });
    document.dispatchEvent(event);
  }
}

// Enhanced File Manager
class FileManager {
  constructor(state, validator) {
    this.state = state;
    this.validator = validator;
    this.uploadArea = null;
    this.fileInput = null;
    this.fileList = null;
    this.maxFiles = window.TechPackConfig?.CONFIG?.MAX_FILES || 10;
    this.maxFileSize = window.TechPackConfig?.CONFIG?.MAX_FILE_SIZE || 10485760;
  }

  init() {
    this.setupDropZone();
    this.setupFileInput();
    this.setupFileList();
    this.attachEventListeners();
  }

  setupDropZone() {
    this.uploadArea = document.querySelector('.techpack-file-upload');
    
    if (this.uploadArea) {
      this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
      this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
      this.uploadArea.addEventListener('drop', this.handleDrop.bind(this));
      this.uploadArea.addEventListener('click', this.handleClick.bind(this));
    }
  }

  setupFileInput() {
    this.fileInput = document.querySelector('#tech-pack-files');
    
    if (this.fileInput) {
      this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
    }
  }

  setupFileList() {
    this.fileList = document.querySelector('.techpack-file-list');
    
    if (!this.fileList) {
      this.fileList = document.createElement('div');
      this.fileList.className = 'techpack-file-list';
      
      const uploadSection = document.querySelector('.techpack-file-upload')?.parentElement;
      if (uploadSection) {
        uploadSection.appendChild(this.fileList);
      }
    }
  }

  attachEventListeners() {
    // Remove file event delegation
    document.addEventListener('click', (e) => {
      if (e.target.matches('.techpack-file-item__remove')) {
        const fileIndex = parseInt(e.target.dataset.fileIndex);
        this.removeFile(fileIndex);
      }
    });
  }

  handleDragOver(e) {
    e.preventDefault();
    this.uploadArea.classList.add('techpack-file-upload--dragover');
  }

  handleDragLeave(e) {
    e.preventDefault();
    this.uploadArea.classList.remove('techpack-file-upload--dragover');
  }

  handleDrop(e) {
    e.preventDefault();
    this.uploadArea.classList.remove('techpack-file-upload--dragover');
    
    const files = Array.from(e.dataTransfer.files);
    this.processFiles(files);
  }

  handleClick(e) {
    if (this.fileInput) {
      this.fileInput.click();
    }
  }

  handleFileSelect(e) {
    const files = Array.from(e.target.files);
    this.processFiles(files);
  }

  processFiles(files) {
    const currentFiles = this.state.formData.files || [];
    
    // Check if adding these files would exceed the limit
    if (currentFiles.length + files.length > this.maxFiles) {
      this.showError(`Maximum ${this.maxFiles} files allowed. You can add ${this.maxFiles - currentFiles.length} more files.`);
      return;
    }

    // Validate each file
    const validFiles = [];
    const errors = [];

    files.forEach(file => {
      if (this.validator) {
        const result = this.validator.validateFile(file);
        if (result.isValid) {
          validFiles.push(file);
        } else {
          errors.push(`${file.name}: ${result.errors.join(', ')}`);
        }
      } else {
        validFiles.push(file);
      }
    });

    // Show validation errors
    if (errors.length > 0) {
      this.showError(errors.join('\n'));
    }

    // Add valid files
    if (validFiles.length > 0) {
      this.addFiles(validFiles);
    }
  }

  addFiles(files) {
    const currentFiles = this.state.formData.files || [];
    
    files.forEach(file => {
      const fileData = {
        id: this.generateFileId(),
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      };
      
      currentFiles.push(fileData);
    });

    this.state.formData.files = currentFiles;
    this.renderFileList();
    this.updateFileCounter();
  }

  removeFile(index) {
    const currentFiles = this.state.formData.files || [];
    
    if (index >= 0 && index < currentFiles.length) {
      currentFiles.splice(index, 1);
      this.state.formData.files = currentFiles;
      this.renderFileList();
      this.updateFileCounter();
    }
  }

  renderFileList() {
    if (!this.fileList) return;

    const files = this.state.formData.files || [];
    
    if (files.length === 0) {
      this.fileList.innerHTML = '';
      return;
    }

    this.fileList.innerHTML = files.map((fileData, index) => `
      <div class="techpack-file-item">
        <div class="techpack-file-item__icon">
          ${this.getFileIcon(fileData.name)}
        </div>
        <div class="techpack-file-item__info">
          <p class="techpack-file-item__name">${fileData.name}</p>
          <p class="techpack-file-item__size">${this.formatFileSize(fileData.size)}</p>
        </div>
        <button type="button" class="techpack-file-item__remove" data-file-index="${index}" title="Remove file">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 4l8 8m0-8l-8 8"/>
          </svg>
        </button>
      </div>
    `).join('');
  }

  updateFileCounter() {
    const files = this.state.formData.files || [];
    const counter = document.querySelector('.techpack-file-counter');
    
    if (counter) {
      counter.textContent = `${files.length} / ${this.maxFiles} files`;
    }
  }

  generateFileId() {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getFileIcon(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    
    const icons = {
      pdf: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>',
      ai: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>',
      zip: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>',
      default: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>'
    };

    return icons[extension] || icons.default;
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  showError(message) {
    const errorElement = document.querySelector('.techpack-file-upload-error') || this.createErrorElement();
    errorElement.textContent = message;
    errorElement.style.display = 'block';

    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 5000);
  }

  createErrorElement() {
    const errorElement = document.createElement('div');
    errorElement.className = 'techpack-file-upload-error';
    errorElement.style.cssText = `
      background: rgba(220, 38, 38, 0.1);
      border: 1px solid #dc2626;
      border-radius: 8px;
      padding: 0.75rem;
      margin-top: 1rem;
      color: #dc2626;
      font-size: 0.875rem;
      display: none;
    `;
    
    const uploadSection = this.uploadArea?.parentElement;
    if (uploadSection) {
      uploadSection.appendChild(errorElement);
    }
    
    return errorElement;
  }
}

// Export classes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StepManager, FileManager };
} else {
  window.TechPackCore = { StepManager, FileManager };
}