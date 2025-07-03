// Premium Registration JavaScript
// File: assets/premium-registration.js

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Premium Registration initialized');
  
  // Initialize all premium features
  initializeFormValidation();
  initializeProgressTracker();
  initializePasswordStrength();
  initializeAnimations();
  initializeFloatingLabels();
  initializeSubmitHandler();
  
  // Form validation system
  function initializeFormValidation() {
    const form = document.querySelector('.premium-form');
    const fields = form.querySelectorAll('.premium-input');
    
    fields.forEach(field => {
      // Real-time validation on input
      field.addEventListener('input', function() {
        validateField(this);
        updateProgress();
      });
      
      // Validation on blur
      field.addEventListener('blur', function() {
        validateField(this);
      });
      
      // Enhanced focus effects
      field.addEventListener('focus', function() {
        this.closest('.premium-field-group').classList.add('focused');
      });
      
      field.addEventListener('blur', function() {
        this.closest('.premium-field-group').classList.remove('focused');
      });
    });
  }
  
  // Validate individual field
  function validateField(field) {
    const fieldGroup = field.closest('.premium-field-group');
    const errorContainer = fieldGroup.querySelector('.premium-field-error');
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing validation classes
    fieldGroup.classList.remove('valid', 'invalid');
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    // Email validation
    else if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    // Password validation
    else if (field.type === 'password' && value) {
      if (value.length < 5) {
        isValid = false;
        errorMessage = 'Password must be at least 5 characters long';
      }
    }
    // Phone validation (if present)
    else if (field.type === 'tel' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }
    
    // Apply validation styling
    if (value && isValid) {
      fieldGroup.classList.add('valid');
      showFieldSuccess(field);
    } else if (!isValid) {
      fieldGroup.classList.add('invalid');
      showFieldError(field, errorMessage);
    } else {
      hideFieldError(field);
    }
    
    return isValid;
  }
  
  // Show field error
  function showFieldError(field, message) {
    const fieldGroup = field.closest('.premium-field-group');
    const errorContainer = fieldGroup.querySelector('.premium-field-error');
    
    if (errorContainer && message) {
      errorContainer.innerHTML = `
        <svg aria-hidden="true" focusable="false">
          <use href="#icon-error" />
        </svg>
        ${message}
      `;
      errorContainer.classList.add('show');
    }
  }
  
  // Show field success
  function showFieldSuccess(field) {
    const fieldGroup = field.closest('.premium-field-group');
    const errorContainer = fieldGroup.querySelector('.premium-field-error');
    
    if (errorContainer) {
      errorContainer.classList.remove('show');
    }
  }
  
  // Hide field error
  function hideFieldError(field) {
    const fieldGroup = field.closest('.premium-field-group');
    const errorContainer = fieldGroup.querySelector('.premium-field-error');
    
    if (errorContainer) {
      errorContainer.classList.remove('show');
    }
  }
  
  // Progress tracker
  function initializeProgressTracker() {
    updateProgress();
  }
  
  function updateProgress() {
    const form = document.querySelector('.premium-form');
    const fields = form.querySelectorAll('.premium-input[required]');
    const progressFill = document.getElementById('form-progress');
    const progressPercentage = document.getElementById('progress-percentage');
    
    let completedFields = 0;
    
    fields.forEach(field => {
      if (field.value.trim() && validateField(field)) {
        completedFields++;
      }
    });
    
    const percentage = Math.round((completedFields / fields.length) * 100);
    
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
    
    if (progressPercentage) {
      progressPercentage.textContent = `${percentage}`;
    }
  }
  
  // Password strength meter
  function initializePasswordStrength() {
    const passwordField = document.getElementById('RegisterForm-password');
    
    if (passwordField) {
      passwordField.addEventListener('input', function() {
        updatePasswordStrength(this.value);
      });
    }
  }
  
  function updatePasswordStrength(password) {
    const strengthFill = document.querySelector('.strength-fill');
    const strengthLabel = document.getElementById('strength-label');
    
    if (!strengthFill || !strengthLabel) return;
    
    let strength = 0;
    let label = 'Weak';
    let className = 'weak';
    
    // Calculate strength
    if (password.length >= 5) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Set strength level
    if (strength >= 4) {
      label = 'Strong';
      className = 'strong';
    } else if (strength >= 3) {
      label = 'Good';
      className = 'good';
    } else if (strength >= 2) {
      label = 'Fair';
      className = 'fair';
    }
    
    // Update UI
    strengthFill.className = `strength-fill ${className}`;
    strengthLabel.textContent = label;
    strengthLabel.className = className;
  }
  
  // Initialize floating labels
  function initializeFloatingLabels() {
    const inputs = document.querySelectorAll('.premium-input');
    
    inputs.forEach(input => {
      // Check initial state
      checkLabelState(input);
      
      // Monitor changes
      input.addEventListener('input', () => checkLabelState(input));
      input.addEventListener('change', () => checkLabelState(input));
    });
  }
  
  function checkLabelState(input) {
    const label = input.nextElementSibling;
    if (label && label.classList.contains('premium-label')) {
      if (input.value.trim() !== '') {
        label.classList.add('active');
      } else {
        label.classList.remove('active');
      }
    }
  }
  
  // Enhanced animations
  function initializeAnimations() {
    // Stagger field animations
    const fieldGroups = document.querySelectorAll('.premium-field-group');
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, { threshold: 0.1 });
    
    fieldGroups.forEach(group => {
      observer.observe(group);
    });
  }
  
  // Enhanced submit handler
  function initializeSubmitHandler() {
    const form = document.querySelector('.premium-form');
    const submitBtn = document.getElementById('submit-btn');
    
    if (form && submitBtn) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const fields = form.querySelectorAll('.premium-input[required]');
        let isFormValid = true;
        let firstInvalidField = null;
        
        fields.forEach(field => {
          if (!validateField(field)) {
            isFormValid = false;
            if (!firstInvalidField) {
              firstInvalidField = field;
            }
          }
        });
        
        if (!isFormValid) {
          // Scroll to first invalid field
          if (firstInvalidField) {
            firstInvalidField.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
            firstInvalidField.focus();
          }
          
          // Shake form
          form.style.animation = 'fieldShake 0.5s ease-in-out';
          setTimeout(() => {
            form.style.animation = '';
          }, 500);
          
          return;
        }
        
        // Show loading state
        showLoadingState();
        
        // Simulate form submission (replace with actual submission)
        setTimeout(() => {
          // For demo purposes - in real implementation, submit the form
          showSuccessState();
          
          // Actually submit the form after success animation
          setTimeout(() => {
            form.submit();
          }, 2000);
        }, 2000);
      });
    }
  }
  
  // Loading state
  function showLoadingState() {
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    
    // Add loading overlay
    showLoadingOverlay();
  }
  
  // Success state
  function showSuccessState() {
    const submitBtn = document.getElementById('submit-btn');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const btnSuccess = submitBtn.querySelector('.btn-success');
    const form = document.querySelector('.premium-form');
    
    btnLoading.style.display = 'none';
    btnSuccess.style.display = 'flex';
    
    form.classList.add('success');
    
    // Hide loading overlay
    hideLoadingOverlay();
    
    // Show success message
    showSuccessMessage();
  }
  
  // Loading overlay
  function showLoadingOverlay() {
    let overlay = document.querySelector('.premium-loading-overlay');
    
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'premium-loading-overlay';
      overlay.innerHTML = `
        <div class="premium-loading-content">
          <div class="premium-spinner"></div>
          <h3>Creating your account...</h3>
          <p>Please wait while we set up your profile</p>
        </div>
      `;
      document.body.appendChild(overlay);
    }
    
    overlay.style.display = 'flex';
  }
  
  function hideLoadingOverlay() {
    const overlay = document.querySelector('.premium-loading-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }
  
  // Success message
  function showSuccessMessage() {
    const container = document.querySelector('.premium-form-container');
    
    const successMessage = document.createElement('div');
    successMessage.className = 'premium-success-message';
    successMessage.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
          <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h2 style="color: #10b981; margin-bottom: 1rem;">Account Created Successfully!</h2>
        <p style="color: #6b7280;">Welcome! You'll be redirected shortly...</p>
      </div>
    `;
    
    // Insert after form with fade in
    successMessage.style.opacity = '0';
    successMessage.style.transform = 'translateY(20px)';
    container.appendChild(successMessage);
    
    setTimeout(() => {
      successMessage.style.transition = 'all 0.5s ease-out';
      successMessage.style.opacity = '1';
      successMessage.style.transform = 'translateY(0)';
    }, 100);
  }
  
  // Keyboard navigation enhancements
  document.addEventListener('keydown', function(e) {
    // Enter key on input fields moves to next field
    if (e.key === 'Enter' && e.target.classList.contains('premium-input')) {
      e.preventDefault();
      const fields = Array.from(document.querySelectorAll('.premium-input'));
      const currentIndex = fields.indexOf(e.target);
      const nextField = fields[currentIndex + 1];
      
      if (nextField) {
        nextField.focus();
      } else {
        // If last field, focus submit button
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
          submitBtn.focus();
        }
      }
    }
  });
  
  // Auto-save functionality (optional)
  function initializeAutoSave() {
    const form = document.querySelector('.premium-form');
    const fields = form.querySelectorAll('.premium-input');
    
    fields.forEach(field => {
      field.addEventListener('input', function() {
        // Save to localStorage (if enabled)
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
          localStorage.setItem('premium-registration-draft', JSON.stringify(data));
        } catch (e) {
          // localStorage not available
          console.log('Auto-save not available');
        }
      });
    });
    
    // Load saved data on page load
    try {
      const savedData = localStorage.getItem('premium-registration-draft');
      if (savedData) {
        const data = JSON.parse(savedData);
        Object.entries(data).forEach(([key, value]) => {
          const field = form.querySelector(`[name="${key}"]`);
          if (field && value) {
            field.value = value;
            checkLabelState(field);
            validateField(field);
          }
        });
        updateProgress();
      }
    } catch (e) {
      console.log('Could not load saved data');
    }
  }
  
  // Initialize auto-save if localStorage is available
  if (typeof(Storage) !== "undefined") {
    initializeAutoSave();
  }
  
  // Performance optimization - debounce validation
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
  
  // Apply debouncing to expensive operations
  const debouncedValidation = debounce(validateField, 300);
  const debouncedProgress = debounce(updateProgress, 300);
  
  console.log('✅ Premium Registration fully loaded');
});