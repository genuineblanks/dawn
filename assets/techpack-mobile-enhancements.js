// AWESOME MOBILE TECHPACK ENHANCEMENTS
// Next-level JavaScript functionality for mobile UX

class TechpackMobileEnhancer {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    this.currentStep = 1;
    this.totalSteps = 4;
    this.formValidation = new Map();
    this.fileUploads = [];
    this.touchStartY = 0;
    this.lastScrollY = 0;
    
    this.init();
  }

  init() {
    if (!this.isMobile) return;
    
    this.setupMobileScrolling();
    this.setupSmartNavigation();
    this.setupEnhancedFileUpload();
    this.setupFloatingLabels();
    this.setupFormValidation();
    this.setupProgressTracking();
    this.setupTouchGestures();
    this.setupAccessibility();
    this.setupPerformanceOptimizations();
    
    console.log('🚀 Techpack Mobile Enhancements Active');
  }

  /* 
  ===========================================
  SMART MOBILE SCROLLING
  ===========================================
  */
  
  setupMobileScrolling() {
    // Prevent zoom on form focus
    const formInputs = document.querySelectorAll('.techpack-form input, .techpack-form textarea, .techpack-form select');
    formInputs.forEach(input => {
      input.addEventListener('focus', this.preventZoom.bind(this));
      input.addEventListener('blur', this.restoreZoom.bind(this));
    });

    // Smart scroll behavior for fixed navigation
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleSmartNavigation();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Smooth scroll to form errors
    this.setupErrorScrolling();
  }

  preventZoom(event) {
    // Temporarily increase font size to prevent iOS zoom
    const input = event.target;
    const originalFontSize = window.getComputedStyle(input).fontSize;
    input.style.fontSize = '16px';
    
    // Restore original font size after focus
    setTimeout(() => {
      if (originalFontSize !== '16px') {
        input.style.fontSize = originalFontSize;
      }
    }, 100);
  }

  restoreZoom(event) {
    // Ensure viewport meta tag is correct
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }
  }

  handleSmartNavigation() {
    const currentScrollY = window.scrollY;
    const scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
    const progressBar = document.querySelector('.techpack-progress');
    const navigation = document.querySelector('.techpack-form__actions');

    // Auto-hide navigation on scroll down, show on scroll up
    if (Math.abs(currentScrollY - this.lastScrollY) > 5) {
      if (scrollDirection === 'down' && currentScrollY > 100) {
        navigation?.classList.add('nav-hidden');
        progressBar?.classList.add('progress-compact');
      } else if (scrollDirection === 'up') {
        navigation?.classList.remove('nav-hidden');
        progressBar?.classList.remove('progress-compact');
      }
    }

    this.lastScrollY = currentScrollY;
  }

  setupErrorScrolling() {
    // Smooth scroll to first error on form validation
    document.addEventListener('formValidationError', (event) => {
      const firstError = document.querySelector('.form-group.error');
      if (firstError) {
        this.smoothScrollToElement(firstError, -100);
      }
    });
  }

  smoothScrollToElement(element, offset = 0) {
    const elementTop = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({
      top: elementTop,
      behavior: 'smooth'
    });
  }

  /* 
  ===========================================
  ENHANCED FILE UPLOAD
  ===========================================
  */

  setupEnhancedFileUpload() {
    const dropZones = document.querySelectorAll('.techpack-file-upload');
    
    dropZones.forEach(zone => {
      this.enhanceDropZone(zone);
    });
  }

  enhanceDropZone(dropZone) {
    // Drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, this.preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
    });

    dropZone.addEventListener('drop', (e) => this.handleFileDrop(e, dropZone), false);

    // Click to upload
    dropZone.addEventListener('click', () => {
      const fileInput = dropZone.querySelector('input[type="file"]');
      fileInput?.click();
    });

    // File input change
    const fileInput = dropZone.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.handleFileSelect(e, dropZone));
    }
  }

  preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  handleFileDrop(e, dropZone) {
    const dt = e.dataTransfer;
    const files = dt.files;
    this.processFiles(files, dropZone);
  }

  handleFileSelect(e, dropZone) {
    const files = e.target.files;
    this.processFiles(files, dropZone);
  }

  processFiles(files, dropZone) {
    [...files].forEach(file => {
      if (this.validateFile(file)) {
        this.createFilePreview(file, dropZone);
        this.uploadFile(file);
      }
    });
  }

  validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/zip'];
    
    if (file.size > maxSize) {
      this.showErrorMessage(`File "${file.name}" is too large. Maximum size is 10MB.`);
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      this.showErrorMessage(`File type "${file.type}" is not supported.`);
      return false;
    }

    return true;
  }

  createFilePreview(file, dropZone) {
    const fileId = Date.now() + Math.random();
    const uploadContainer = dropZone.parentNode.querySelector('.techpack-uploaded-files') || 
                           this.createUploadContainer(dropZone);

    const fileItem = document.createElement('div');
    fileItem.className = 'techpack-file-item';
    fileItem.setAttribute('data-file-id', fileId);
    
    fileItem.innerHTML = `
      <div class="techpack-file-icon">${this.getFileIcon(file.type)}</div>
      <div class="techpack-file-details">
        <div class="techpack-file-name">${file.name}</div>
        <div class="techpack-file-size">${this.formatFileSize(file.size)}</div>
        <div class="techpack-file-progress">
          <div class="techpack-file-progress-bar" style="width: 0%"></div>
        </div>
      </div>
      <button type="button" class="techpack-file-remove" aria-label="Remove file">×</button>
    `;

    // Remove file functionality
    const removeBtn = fileItem.querySelector('.techpack-file-remove');
    removeBtn.addEventListener('click', () => {
      fileItem.style.animation = 'slideOutRight 0.3s ease forwards';
      setTimeout(() => fileItem.remove(), 300);
    });

    uploadContainer.appendChild(fileItem);
    
    // Store file reference
    this.fileUploads.push({
      id: fileId,
      file: file,
      element: fileItem
    });

    return fileItem;
  }

  createUploadContainer(dropZone) {
    const container = document.createElement('div');
    container.className = 'techpack-uploaded-files';
    dropZone.parentNode.appendChild(container);
    return container;
  }

  uploadFile(file) {
    // Simulate upload progress (replace with actual upload logic)
    const fileItem = document.querySelector(`[data-file-id]`);
    const progressBar = fileItem?.querySelector('.techpack-file-progress-bar');
    
    if (progressBar) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          fileItem.classList.add('upload-complete');
        }
        progressBar.style.width = progress + '%';
      }, 200);
    }
  }

  getFileIcon(type) {
    if (type.startsWith('image/')) return '🖼️';
    if (type === 'application/pdf') return '📄';
    if (type.includes('zip')) return '📦';
    return '📎';
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /* 
  ===========================================
  FLOATING LABELS & FORM ENHANCEMENTS
  ===========================================
  */

  setupFloatingLabels() {
    const formGroups = document.querySelectorAll('.techpack-form .form-group');
    
    formGroups.forEach(group => {
      const input = group.querySelector('input, textarea, select');
      const label = group.querySelector('.form-label');
      
      if (input && label) {
        this.enhanceFormField(input, label, group);
      }
    });
  }

  enhanceFormField(input, label, group) {
    // Set initial state
    this.updateLabelState(input, label);
    
    // Add event listeners
    input.addEventListener('focus', () => this.handleFieldFocus(input, label, group));
    input.addEventListener('blur', () => this.handleFieldBlur(input, label, group));
    input.addEventListener('input', () => this.updateLabelState(input, label));
  }

  updateLabelState(input, label) {
    if (input.value || input === document.activeElement) {
      label.classList.add('label-float');
    } else {
      label.classList.remove('label-float');
    }
  }

  handleFieldFocus(input, label, group) {
    group.classList.add('focused');
    label.classList.add('label-float');
    
    // Ensure field is visible above keyboard
    setTimeout(() => {
      if (this.isMobile) {
        this.smoothScrollToElement(input, -100);
      }
    }, 300);
  }

  handleFieldBlur(input, label, group) {
    group.classList.remove('focused');
    this.updateLabelState(input, label);
    
    // Validate field on blur
    this.validateField(input, group);
  }

  /* 
  ===========================================
  SMART FORM VALIDATION
  ===========================================
  */

  setupFormValidation() {
    const forms = document.querySelectorAll('.techpack-form');
    
    forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e, form));
    });
  }

  validateField(input, group) {
    const value = input.value.trim();
    const isRequired = input.hasAttribute('required');
    const type = input.type;
    
    let isValid = true;
    let errorMessage = '';

    // Required validation
    if (isRequired && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Email validation
    if (type === 'email' && value && !this.isValidEmail(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }

    // Phone validation
    if (type === 'tel' && value && !this.isValidPhone(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid phone number';
    }

    // Update UI
    this.updateValidationUI(group, isValid, errorMessage);
    
    // Store validation state
    this.formValidation.set(input.name || input.id, isValid);
    
    return isValid;
  }

  updateValidationUI(group, isValid, errorMessage = '') {
    group.classList.remove('error', 'success');
    
    // Remove existing error message
    const existingError = group.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    if (isValid) {
      group.classList.add('success');
    } else {
      group.classList.add('error');
      
      if (errorMessage) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        group.appendChild(errorDiv);
      }
    }
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPhone(phone) {
    return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  handleFormSubmit(e, form) {
    e.preventDefault();
    
    // Validate all fields
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let allValid = true;
    
    inputs.forEach(input => {
      const group = input.closest('.form-group');
      if (!this.validateField(input, group)) {
        allValid = false;
      }
    });

    if (!allValid) {
      // Dispatch event for error scrolling
      document.dispatchEvent(new CustomEvent('formValidationError'));
      this.showErrorMessage('Please fix the errors above before submitting.');
      return;
    }

    // Submit form
    this.submitForm(form);
  }

  submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Show loading state
    if (submitBtn) {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
    }

    // Simulate form submission (replace with actual logic)
    setTimeout(() => {
      this.showSuccessMessage('Form submitted successfully!');
      
      if (submitBtn) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    }, 2000);
  }

  /* 
  ===========================================
  PROGRESS TRACKING
  ===========================================
  */

  setupProgressTracking() {
    this.updateProgress();
    
    // Listen for step changes
    document.addEventListener('stepChange', (e) => {
      this.currentStep = e.detail.step;
      this.updateProgress();
    });
  }

  updateProgress() {
    const progressFill = document.querySelector('.techpack-progress__fill');
    const progressSteps = document.querySelectorAll('.techpack-progress__step');
    
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

  /* 
  ===========================================
  TOUCH GESTURES
  ===========================================
  */

  setupTouchGestures() {
    const steps = document.querySelectorAll('.techpack-step');
    
    steps.forEach(step => {
      step.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
      step.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
      step.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    });
  }

  handleTouchStart(e) {
    this.touchStartY = e.touches[0].clientY;
  }

  handleTouchMove(e) {
    // Could add swipe detection here for step navigation
  }

  handleTouchEnd(e) {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = this.touchStartY - touchEndY;

    // Subtle haptic feedback for interactions (if supported)
    if ('vibrate' in navigator && Math.abs(diff) > 50) {
      navigator.vibrate(10);
    }
  }

  /* 
  ===========================================
  ACCESSIBILITY ENHANCEMENTS
  ===========================================
  */

  setupAccessibility() {
    // Announce step changes to screen readers
    document.addEventListener('stepChange', (e) => {
      this.announceToScreenReader(`Step ${e.detail.step} of ${this.totalSteps}: ${e.detail.title}`);
    });

    // Add ARIA labels
    this.enhanceARIA();
  }

  enhanceARIA() {
    const form = document.querySelector('.techpack-form');
    if (form) {
      form.setAttribute('aria-label', 'Tech Pack Submission Form');
    }

    const progressBar = document.querySelector('.techpack-progress');
    if (progressBar) {
      progressBar.setAttribute('role', 'progressbar');
      progressBar.setAttribute('aria-valuenow', this.currentStep);
      progressBar.setAttribute('aria-valuemin', '1');
      progressBar.setAttribute('aria-valuemax', this.totalSteps);
    }
  }

  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /* 
  ===========================================
  PERFORMANCE OPTIMIZATIONS
  ===========================================
  */

  setupPerformanceOptimizations() {
    // Lazy load non-critical elements
    this.lazyLoadElements();
    
    // Optimize scroll and resize handlers
    this.optimizeEventHandlers();
    
    // Preload next step resources
    this.preloadNextStep();
  }

  lazyLoadElements() {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      });

      lazyElements.forEach(el => observer.observe(el));
    } else {
      // Fallback for older browsers
      lazyElements.forEach(el => this.loadElement(el));
    }
  }

  loadElement(element) {
    const src = element.dataset.lazy;
    if (src) {
      element.src = src;
      element.removeAttribute('data-lazy');
    }
  }

  optimizeEventHandlers() {
    // Throttle resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
  }

  handleResize() {
    this.isMobile = window.innerWidth <= 768;
    
    if (this.isMobile) {
      document.body.classList.add('is-mobile');
    } else {
      document.body.classList.remove('is-mobile');
    }
  }

  preloadNextStep() {
    // Preload resources for the next step to improve perceived performance
    if (this.currentStep < this.totalSteps) {
      const nextStepResources = document.querySelectorAll(`[data-step="${this.currentStep + 1}"] img, [data-step="${this.currentStep + 1}"] [data-src]`);
      
      nextStepResources.forEach(resource => {
        if (resource.tagName === 'IMG' && resource.dataset.src) {
          const preloadImg = new Image();
          preloadImg.src = resource.dataset.src;
        }
      });
    }
  }

  /* 
  ===========================================
  UTILITY METHODS
  ===========================================
  */

  showErrorMessage(message) {
    this.showMessage(message, 'error');
  }

  showSuccessMessage(message) {
    this.showMessage(message, 'success');
  }

  showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `techpack-message techpack-message--${type}`;
    messageDiv.textContent = message;
    
    // Add to DOM
    document.body.appendChild(messageDiv);
    
    // Show with animation
    setTimeout(() => messageDiv.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
      messageDiv.classList.remove('show');
      setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.techpack-form, .tech-pack-app, .techpack-modern')) {
    new TechpackMobileEnhancer();
  }
});

// Export for potential use by other scripts
window.TechpackMobileEnhancer = TechpackMobileEnhancer;