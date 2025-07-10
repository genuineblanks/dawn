// ===============================================
// TECH PACK FORM VALIDATION MODULE
// ===============================================

// Enhanced Form Validator
class FormValidator {
  constructor() {
    this.rules = new Map();
    this.errors = new Map();
    this.Utils = window.TechPackConfig?.Utils || {};
  }

  addRule(fieldName, validator, errorMessage) {
    if (!this.rules.has(fieldName)) {
      this.rules.set(fieldName, []);
    }
    this.rules.get(fieldName).push({ validator, errorMessage });
  }

  validate(fieldName, value) {
    const fieldRules = this.rules.get(fieldName);
    if (!fieldRules) return { isValid: true, errors: [] };

    const errors = [];
    for (const rule of fieldRules) {
      if (!rule.validator(value)) {
        errors.push(rule.errorMessage);
      }
    }

    const isValid = errors.length === 0;
    if (isValid) {
      this.errors.delete(fieldName);
    } else {
      this.errors.set(fieldName, errors);
    }

    return { isValid, errors };
  }

  validateAll(formData) {
    let isValid = true;
    const allErrors = {};

    for (const [fieldName] of this.rules) {
      const value = formData[fieldName] || '';
      const result = this.validate(fieldName, value);
      if (!result.isValid) {
        isValid = false;
        allErrors[fieldName] = result.errors;
      }
    }

    return { isValid, errors: allErrors };
  }

  getErrors(fieldName = null) {
    if (fieldName) {
      return this.errors.get(fieldName) || [];
    }
    return Object.fromEntries(this.errors);
  }

  clearErrors(fieldName = null) {
    if (fieldName) {
      this.errors.delete(fieldName);
    } else {
      this.errors.clear();
    }
  }

  // Enhanced validation methods
  setupValidation() {
    // Required field validation
    this.addRule('clientName', (value) => value.trim().length > 0, 'Contact name is required');
    this.addRule('companyName', (value) => value.trim().length > 0, 'Business/Brand name is required');
    this.addRule('email', (value) => this.Utils.validateEmail ? this.Utils.validateEmail(value) : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), 'Please enter a valid email address');
    this.addRule('country', (value) => value.trim().length > 0, 'Business location is required');
    this.addRule('productionType', (value) => value.trim().length > 0, 'Production type is required');

    // Conditional VAT/EIN validation
    this.addRule('vatEin', (value, formData) => {
      const country = formData?.country || '';
      const COUNTRY_DATA = window.TechPackConfig?.COUNTRY_DATA;
      
      if (!COUNTRY_DATA) return true; // Skip validation if country data not available
      
      const countryData = COUNTRY_DATA.findByName(country);
      const requiresVAT = countryData && COUNTRY_DATA.requiresVAT(countryData.code);
      
      if (requiresVAT && (!value || value.trim().length === 0)) {
        return false;
      }
      
      if (value && value.trim().length > 0) {
        return this.Utils.validateVATNumber ? 
          this.Utils.validateVATNumber(value, countryData?.code) || this.Utils.validateEIN(value) :
          true;
      }
      
      return true;
    }, 'Valid VAT/EIN number is required for EU businesses');

    // Phone validation (optional)
    this.addRule('phone', (value) => {
      if (!value || value.trim().length === 0) return true; // Optional field
      return this.Utils.validatePhone ? this.Utils.validatePhone(value) : true;
    }, 'Please enter a valid phone number');
  }

  // Visual feedback methods
  showFieldError(fieldName, errorMessage) {
    const field = document.querySelector(`[name="${fieldName}"], #${fieldName}`);
    const errorElement = document.querySelector(`[data-error-for="${fieldName}"]`) || 
                        field?.parentElement?.querySelector('.techpack-form__error');

    if (field) {
      field.classList.add('techpack-form__input--error');
      field.classList.remove('techpack-form__input--success');
    }

    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.style.display = 'block';
    }
  }

  showFieldSuccess(fieldName) {
    const field = document.querySelector(`[name="${fieldName}"], #${fieldName}`);
    const errorElement = document.querySelector(`[data-error-for="${fieldName}"]`) || 
                        field?.parentElement?.querySelector('.techpack-form__error');

    if (field) {
      field.classList.add('techpack-form__input--success');
      field.classList.remove('techpack-form__input--error');
    }

    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }

  clearFieldValidation(fieldName) {
    const field = document.querySelector(`[name="${fieldName}"], #${fieldName}`);
    const errorElement = document.querySelector(`[data-error-for="${fieldName}"]`) || 
                        field?.parentElement?.querySelector('.techpack-form__error');

    if (field) {
      field.classList.remove('techpack-form__input--error', 'techpack-form__input--success');
    }

    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }

  // Real-time validation setup
  attachRealTimeValidation() {
    document.addEventListener('input', (e) => {
      const field = e.target;
      if (field.hasAttribute('data-validate')) {
        const fieldName = field.name || field.id;
        const value = field.value;
        
        // Debounced validation
        clearTimeout(field.validationTimeout);
        field.validationTimeout = setTimeout(() => {
          const result = this.validate(fieldName, value);
          if (result.isValid) {
            this.showFieldSuccess(fieldName);
          } else {
            this.showFieldError(fieldName, result.errors[0]);
          }
        }, 500);
      }
    });

    document.addEventListener('blur', (e) => {
      const field = e.target;
      if (field.hasAttribute('data-validate')) {
        const fieldName = field.name || field.id;
        const value = field.value;
        
        const result = this.validate(fieldName, value);
        if (result.isValid) {
          this.showFieldSuccess(fieldName);
        } else {
          this.showFieldError(fieldName, result.errors[0]);
        }
      }
    });
  }
}

// Enhanced File Validator
class FileValidator {
  constructor(config = {}) {
    this.CONFIG = window.TechPackConfig?.CONFIG || {};
    this.maxFileSize = config.maxFileSize || this.CONFIG.MAX_FILE_SIZE || 10485760; // 10MB
    this.maxFiles = config.maxFiles || this.CONFIG.MAX_FILES || 10;
    this.validTypes = config.validTypes || this.CONFIG.VALID_FILE_TYPES || ['.pdf', '.ai', '.png', '.jpg', '.jpeg', '.zip'];
  }

  validateFile(file) {
    const errors = [];

    // Check file size
    if (file.size > this.maxFileSize) {
      errors.push(`File size exceeds ${this.formatFileSize(this.maxFileSize)} limit`);
    }

    // Check file type
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    if (!this.validTypes.includes(extension)) {
      errors.push(`File type ${extension} is not allowed. Allowed types: ${this.validTypes.join(', ')}`);
    }

    // Check for empty files
    if (file.size === 0) {
      errors.push('Empty files are not allowed');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateFiles(files) {
    const errors = [];
    
    // Check total number of files
    if (files.length > this.maxFiles) {
      errors.push(`Maximum ${this.maxFiles} files allowed`);
    }

    // Validate each file
    const fileErrors = [];
    files.forEach((file, index) => {
      const result = this.validateFile(file);
      if (!result.isValid) {
        fileErrors.push({
          file: file.name,
          index,
          errors: result.errors
        });
      }
    });

    return {
      isValid: errors.length === 0 && fileErrors.length === 0,
      errors,
      fileErrors
    };
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export classes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FormValidator, FileValidator };
} else {
  window.TechPackValidation = { FormValidator, FileValidator };
}