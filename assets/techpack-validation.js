/**
 * TechPack Validation System
 * Comprehensive form validation with error handling and user feedback
 * Handles client info, file uploads, and garment specifications
 */

(function() {
  'use strict';

  /**
   * TechPack Form Validator
   * Provides validation for all form steps with consistent error handling
   */
  class TechPackValidator {
    constructor() {
      this.config = window.TechPackConfig || {
        MAX_FILES: 10,
        MAX_FILE_SIZE: 10 * 1024 * 1024,
        VALID_FILE_TYPES: ['.pdf', '.ai', '.png', '.jpg', '.jpeg', '.zip']
      };

      // Country list for validation
      this.validCountries = [
        'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
        'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Sweden',
        'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria', 'Ireland',
        'Portugal', 'Greece', 'Poland', 'Czech Republic', 'Hungary',
        'Romania', 'Bulgaria', 'Croatia', 'Slovakia', 'Slovenia', 'Estonia',
        'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Cyprus', 'Japan',
        'South Korea', 'Singapore', 'Hong Kong', 'New Zealand', 'Mexico',
        'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Uruguay',
        'South Africa', 'Israel', 'Turkey', 'United Arab Emirates', 'India',
        'China', 'Taiwan', 'Thailand', 'Malaysia', 'Philippines', 'Indonesia',
        'Vietnam', 'Russia', 'Ukraine', 'Belarus', 'Serbia', 'Montenegro',
        'Bosnia and Herzegovina', 'North Macedonia', 'Albania', 'Moldova',
        'Georgia', 'Armenia', 'Azerbaijan', 'Kazakhstan', 'Uzbekistan',
        'Kyrgyzstan', 'Tajikistan', 'Turkmenistan', 'Mongolia', 'Pakistan',
        'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan', 'Maldives', 'Myanmar',
        'Cambodia', 'Laos', 'Brunei', 'Timor-Leste', 'Papua New Guinea',
        'Fiji', 'Samoa', 'Tonga', 'Vanuatu', 'Solomon Islands', 'Palau',
        'Micronesia', 'Marshall Islands', 'Kiribati', 'Nauru', 'Tuvalu',
        'Egypt', 'Libya', 'Tunisia', 'Algeria', 'Morocco', 'Sudan',
        'Ethiopia', 'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi',
        'Democratic Republic of Congo', 'Republic of Congo', 'Central African Republic',
        'Chad', 'Niger', 'Mali', 'Burkina Faso', 'Senegal', 'Gambia',
        'Guinea-Bissau', 'Guinea', 'Sierra Leone', 'Liberia', 'Ivory Coast',
        'Ghana', 'Togo', 'Benin', 'Nigeria', 'Cameroon', 'Equatorial Guinea',
        'Gabon', 'São Tomé and Príncipe', 'Angola', 'Zambia', 'Malawi',
        'Mozambique', 'Zimbabwe', 'Botswana', 'Namibia', 'Lesotho',
        'Eswatini', 'Madagascar', 'Mauritius', 'Seychelles', 'Comoros'
      ];

      // Garment types for validation
      this.validGarmentTypes = [
        'T-Shirt', 'Polo Shirt', 'Hoodie', 'Sweatshirt', 'Tank Top',
        'Long Sleeve Shirt', 'Button-Up Shirt', 'Dress Shirt', 'Henley',
        'V-Neck', 'Crewneck', 'Cardigan', 'Sweater', 'Jacket', 'Blazer',
        'Coat', 'Vest', 'Shorts', 'Pants', 'Jeans', 'Chinos', 'Leggings',
        'Skirt', 'Dress', 'Jumpsuit', 'Romper', 'Overalls', 'Swimwear',
        'Activewear', 'Underwear', 'Socks', 'Hat', 'Cap', 'Beanie',
        'Scarf', 'Gloves', 'Belt', 'Bag', 'Backpack', 'Tote Bag',
        'Custom Garment', 'Other'
      ];

      // Fabric types for validation
      this.validFabricTypes = [
        '100% Cotton', '100% Polyester', '100% Linen', '100% Wool',
        '100% Silk', '100% Bamboo', '100% Hemp', 'Cotton Blend',
        'Polyester Blend', 'Cotton/Polyester', 'Cotton/Spandex',
        'Polyester/Spandex', 'Tri-Blend', 'French Terry', 'Fleece',
        'Jersey Knit', 'Pique', 'Twill', 'Canvas', 'Denim', 'Corduroy',
        'Flannel', 'Chambray', 'Poplin', 'Oxford', 'Broadcloth',
        'Voile', 'Gauze', 'Muslin', 'Satin', 'Taffeta', 'Chiffon',
        'Crepe', 'Georgette', 'Organza', 'Tulle', 'Lace', 'Mesh',
        'Performance Fabric', 'Moisture-Wicking', 'UV Protection',
        'Antimicrobial', 'Water-Resistant', 'Windproof', 'Breathable',
        'Stretch Fabric', 'Non-Stretch', 'Organic Cotton', 'Recycled Polyester',
        'Sustainable Fabric', 'Custom Fabric', 'Other'
      ];

      // Size options for validation
      this.validSizes = [
        'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL', '5XL',
        '0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22',
        '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44',
        '46', '48', '50', 'One Size', 'Custom Size'
      ];

      console.log('✅ TechPack Validator initialized');
    }

    /**
     * Validate client information step
     */
    validateClientInfo() {
      const state = window.techPackApp?.state;
      if (!state) {
        console.error('State not available for validation');
        return false;
      }

      const validation = state.validateClientInfo();
      
      // Clear previous errors
      state.clearAllErrors();

      // Set new errors if any
      if (!validation.isValid) {
        Object.entries(validation.errors).forEach(([field, message]) => {
          state.setError(field, message);
          this.showFieldError(field, message);
        });
      }

      return validation.isValid;
    }

    /**
     * Validate individual client info field
     */
    validateClientField(field, value) {
      const errors = {};

      switch (field) {
        case 'clientName':
          if (!value?.trim()) {
            errors[field] = 'Contact name is required';
          } else if (value.length < 2) {
            errors[field] = 'Contact name must be at least 2 characters';
          } else if (value.length > 100) {
            errors[field] = 'Contact name must be less than 100 characters';
          }
          break;

        case 'companyName':
          if (!value?.trim()) {
            errors[field] = 'Business/Brand name is required';
          } else if (value.length < 2) {
            errors[field] = 'Business name must be at least 2 characters';  
          } else if (value.length > 100) {
            errors[field] = 'Business name must be less than 100 characters';
          }
          break;

        case 'email':
          if (!value?.trim()) {
            errors[field] = 'Email address is required';
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors[field] = 'Please enter a valid email address';
          }
          break;

        case 'phone':
          if (value && !/^[\+]?[\s\-\(\)0-9]{10,20}$/.test(value.replace(/\s/g, ''))) {
            errors[field] = 'Please enter a valid phone number';
          }
          break;

        case 'country':
          if (!value?.trim()) {
            errors[field] = 'Business location is required';
          } else if (!this.validCountries.includes(value)) {
            errors[field] = 'Please select a valid country';
          }
          break;

        case 'productionType':
          if (!value?.trim()) {
            errors[field] = 'Production type is required';
          } else if (!['our-blanks', 'custom-production'].includes(value)) {
            errors[field] = 'Please select a valid production type';
          }
          break;

        case 'vatEin':
          // VAT/EIN validation for new clients
          const state = window.techPackApp?.state;
          const clientInfo = state?.getClientInfo();
          
          if (clientInfo?.isReturning === false && !value?.trim()) {
            errors[field] = 'VAT/EIN number is required for new businesses';
          } else if (value && !this.validateVatEin(value)) {
            errors[field] = 'Please enter a valid VAT or EIN number';
          }
          break;

        case 'deadline':
          if (value) {
            const selectedDate = new Date(value);
            const minDate = new Date();
            minDate.setDate(minDate.getDate() + 42); // 6 weeks minimum
            
            if (selectedDate < minDate) {
              errors[field] = 'Deadline must be at least 6 weeks from today';
            }
          }
          break;
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    }

    /**
     * Validate VAT or EIN number format
     */
    validateVatEin(value) {
      const cleanValue = value.replace(/[\s\-]/g, '');
      
      // EIN format: 12-3456789 (US)
      if (/^\d{2}\d{7}$/.test(cleanValue)) {
        return true;
      }
      
      // VAT formats for different countries
      const vatPatterns = {
        // UK VAT: GB123456789
        GB: /^GB\d{9}$/,
        // German VAT: DE123456789
        DE: /^DE\d{9}$/,
        // French VAT: FR12345678901
        FR: /^FR\d{11}$/,
        // Italian VAT: IT12345678901
        IT: /^IT\d{11}$/,
        // Spanish VAT: ES12345678A
        ES: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/,
        // Dutch VAT: NL123456789B01
        NL: /^NL\d{9}B\d{2}$/,
        // EU generic pattern
        EU: /^[A-Z]{2}[A-Z0-9]{2,12}$/
      };

      // Check against known VAT patterns
      for (const pattern of Object.values(vatPatterns)) {
        if (pattern.test(cleanValue.toUpperCase())) {
          return true;
        }
      }

      return false;
    }

    /**
     * Validate file uploads
     */
    validateFiles() {
      const state = window.techPackApp?.state;
      if (!state) {
        console.error('State not available for validation');
        return false;
      }

      const validation = state.validateFiles();
      
      // Clear previous file errors
      this.clearFileErrors();

      // Set new errors if any
      if (!validation.isValid) {
        Object.entries(validation.errors).forEach(([key, message]) => {
          this.showFileError(key, message);
        });
      }

      return validation.isValid;
    }

    /**
     * Validate individual file
     */
    validateFile(file) {
      const errors = [];

      // File size validation
      if (file.size > this.config.MAX_FILE_SIZE) {
        errors.push(`File size (${this.formatFileSize(file.size)}) exceeds maximum allowed size (${this.formatFileSize(this.config.MAX_FILE_SIZE)})`);
      }

      // File type validation
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      if (!this.config.VALID_FILE_TYPES.includes(extension)) {
        errors.push(`File type "${extension}" is not supported. Allowed types: ${this.config.VALID_FILE_TYPES.join(', ')}`);
      }

      // File name validation
      if (file.name.length === 0) {
        errors.push('File name cannot be empty');
      } else if (file.name.length > 255) {
        errors.push('File name is too long (maximum 255 characters)');
      }

      // Check for dangerous file names
      const dangerousPatterns = [
        /\.exe$/i, /\.bat$/i, /\.cmd$/i, /\.scr$/i, /\.com$/i,
        /\.pif$/i, /\.jar$/i, /\.js$/i, /\.vbs$/i, /\.php$/i
      ];

      if (dangerousPatterns.some(pattern => pattern.test(file.name))) {
        errors.push('File type not allowed for security reasons');
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    }

    /**
     * Validate garment specifications
     */
    validateGarments() {
      const state = window.techPackApp?.state;
      if (!state) {
        console.error('State not available for validation');
        return false;
      }

      const validation = state.validateGarments();
      
      // Clear previous garment errors
      this.clearGarmentErrors();

      // Set new errors if any
      if (!validation.isValid) {
        Object.entries(validation.errors).forEach(([key, message]) => {
          this.showGarmentError(key, message);
        });
      }

      return validation.isValid;
    }

    /**
     * Validate individual garment field
     */
    validateGarmentField(field, value, context = {}) {
      const errors = {};

      switch (field) {
        case 'garmentType':
          if (!value?.trim()) {
            errors[field] = 'Garment type is required';
          } else if (!this.validGarmentTypes.includes(value) && value !== 'Custom Garment') {
            errors[field] = 'Please select a valid garment type';
          }
          break;

        case 'description':
          if (!value?.trim()) {
            errors[field] = 'Garment description is required';
          } else if (value.length < 10) {
            errors[field] = 'Description must be at least 10 characters';
          } else if (value.length > 500) {
            errors[field] = 'Description must be less than 500 characters';
          }
          break;

        case 'colorwayName':
          if (!value?.trim()) {
            errors[field] = 'Colorway name is required';
          } else if (value.length < 2) {
            errors[field] = 'Colorway name must be at least 2 characters';
          } else if (value.length > 50) {
            errors[field] = 'Colorway name must be less than 50 characters';
          }
          break;

        case 'quantity':
          const qty = parseInt(value);
          if (!value || isNaN(qty) || qty <= 0) {
            errors[field] = 'Quantity must be a positive number';
          } else if (qty > 10000) {
            errors[field] = 'Quantity cannot exceed 10,000 per colorway';
          }
          break;

        case 'pantoneColor':
          if (value && !this.validatePantoneColor(value)) {
            errors[field] = 'Please enter a valid Pantone color code (e.g., PANTONE 18-1664 TPX)';
          }
          break;

        case 'fabricType':
          if (value && !this.validFabricTypes.includes(value) && value !== 'Custom Fabric') {
            errors[field] = 'Please select a valid fabric type';
          }
          break;

        case 'sizes':
          if (Array.isArray(value) && value.length > 0) {
            const invalidSizes = value.filter(size => !this.validSizes.includes(size));
            if (invalidSizes.length > 0) {
              errors[field] = `Invalid sizes: ${invalidSizes.join(', ')}`;
            }
          }
          break;
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    }

    /**
     * Validate Pantone color code format
     */
    validatePantoneColor(colorCode) {
      // Common Pantone color code patterns
      const pantonePatterns = [
        /^PANTONE\s+\d{1,4}\s*[A-Z]*$/i,           // PANTONE 123 C
        /^PANTONE\s+\d{1,2}-\d{4}\s*[A-Z]*$/i,    // PANTONE 18-1664 TPX
        /^PMS\s+\d{1,4}\s*[A-Z]*$/i,              // PMS 123 C
        /^P\s+\d{1,4}-\d{1,4}\s*[A-Z]*$/i,        // P 123-4 C
        /^[A-Z]+\s+\d{1,4}$/i                     // Custom formats
      ];

      return pantonePatterns.some(pattern => pattern.test(colorCode.trim()));
    }

    /**
     * Show field error in UI
     */
    showFieldError(field, message) {
      // Find the error container for this field
      const fieldElement = document.querySelector(`[name="${field}"], #${field}`);
      if (!fieldElement) return;

      const errorContainer = fieldElement.closest('.techpack-form__group')?.querySelector('.techpack-form__error');
      if (!errorContainer) return;

      // Show error message
      errorContainer.textContent = message;
      errorContainer.style.display = 'block';

      // Add error styling to field
      fieldElement.classList.add('techpack-form__input--error');
      
      // Add error styling to group
      const group = fieldElement.closest('.techpack-form__group');
      if (group) {
        group.classList.add('techpack-form__group--error');
      }
    }

    /**
     * Clear field error in UI
     */
    clearFieldError(field) {
      const fieldElement = document.querySelector(`[name="${field}"], #${field}`);
      if (!fieldElement) return;

      const errorContainer = fieldElement.closest('.techpack-form__group')?.querySelector('.techpack-form__error');
      if (errorContainer) {
        errorContainer.textContent = '';
        errorContainer.style.display = 'none';
      }

      // Remove error styling
      fieldElement.classList.remove('techpack-form__input--error');
      
      const group = fieldElement.closest('.techpack-form__group');
      if (group) {
        group.classList.remove('techpack-form__group--error');
      }
    }

    /**
     * Show file validation error
     */
    showFileError(key, message) {
      // Show error in file upload area
      let errorContainer = document.querySelector('.techpack-file-upload-error');
      
      if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.className = 'techpack-file-upload-error';
        errorContainer.style.cssText = `
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid #dc2626;
          border-radius: 8px;
          padding: 0.75rem;
          margin-top: 1rem;
          color: #dc2626;
          font-size: 0.875rem;
          display: none;
        `;
        
        const uploadSection = document.querySelector('.techpack-upload');
        if (uploadSection) {
          uploadSection.appendChild(errorContainer);
        }
      }

      errorContainer.textContent = message;
      errorContainer.style.display = 'block';

      // Auto-hide after 5 seconds
      setTimeout(() => {
        if (errorContainer) {
          errorContainer.style.display = 'none';
        }
      }, 5000);
    }

    /**
     * Clear file validation errors
     */
    clearFileErrors() {
      const errorElements = document.querySelectorAll('.techpack-file-upload-error');
      errorElements.forEach(element => {
        element.style.display = 'none';
      });
    }

    /**
     * Show garment validation error
     */
    showGarmentError(key, message) {
      // Show error in garment section
      let errorContainer = document.querySelector('.techpack-garment-error');
      
      if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.className = 'techpack-garment-error';
        errorContainer.style.cssText = `
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid #dc2626;
          border-radius: 8px;
          padding: 0.75rem;
          margin-top: 1rem;
          color: #dc2626;
          font-size: 0.875rem;
          display: none;
        `;
        
        const garmentSection = document.querySelector('.techpack-garments');
        if (garmentSection) {
          garmentSection.appendChild(errorContainer);
        }
      }

      errorContainer.textContent = message;
      errorContainer.style.display = 'block';

      // Auto-hide after 10 seconds for garment errors (they're more complex)
      setTimeout(() => {
        if (errorContainer) {
          errorContainer.style.display = 'none';
        }
      }, 10000);
    }

    /**
     * Clear garment validation errors
     */
    clearGarmentErrors() {
      const errorElements = document.querySelectorAll('.techpack-garment-error');
      errorElements.forEach(element => {
        element.style.display = 'none';
      });
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Setup real-time field validation
     */
    setupRealtimeValidation() {
      // Client info fields
      const clientFields = ['clientName', 'companyName', 'email', 'phone', 'country', 'productionType', 'vatEin', 'deadline'];
      
      clientFields.forEach(field => {
        const element = document.querySelector(`[name="${field}"], #${field}`);
        if (element) {
          // Debounced validation on input
          let timeout;
          element.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              const validation = this.validateClientField(field, e.target.value);
              
              if (validation.isValid) {
                this.clearFieldError(field);
              } else {
                const errorMessage = Object.values(validation.errors)[0];
                this.showFieldError(field, errorMessage);
              }
            }, 300);
          });

          // Clear error on focus
          element.addEventListener('focus', () => {
            this.clearFieldError(field);
          });
        }
      });

      console.log('✅ Real-time validation setup complete');
    }

    /**
     * Get validation summary
     */
    getValidationSummary() {
      const state = window.techPackApp?.state;
      if (!state) {
        return { isValid: false, errors: ['State not available'] };
      }

      const clientValidation = state.validateClientInfo();
      const fileValidation = state.validateFiles();
      const garmentValidation = state.validateGarments();

      const allErrors = [
        ...Object.values(clientValidation.errors || {}),
        ...Object.values(fileValidation.errors || {}),
        ...Object.values(garmentValidation.errors || {})
      ];

      return {
        isValid: clientValidation.isValid && fileValidation.isValid && garmentValidation.isValid,
        errors: allErrors,
        steps: {
          clientInfo: clientValidation,
          files: fileValidation,
          garments: garmentValidation
        }
      };
    }
  }

  // Export for use in other modules
  window.TechPackValidator = TechPackValidator;

})();