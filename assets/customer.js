// Enhanced Customer.js for TechPack styling
// File: assets/customer.js

const selectors = {
  customerAddresses: '[data-customer-addresses]',
  addressCountrySelect: '[data-address-country-select]',
  addressContainer: '[data-address]',
  toggleAddressButton: 'button[aria-expanded]',
  cancelAddressButton: 'button[type="reset"]',
  deleteAddressButton: 'button[data-confirm-message]',
};

const attributes = {
  expanded: 'aria-expanded',
  confirmMessage: 'data-confirm-message',
};

class CustomerAddresses {
  constructor() {
    this.elements = this._getElements();
    if (Object.keys(this.elements).length === 0) return;
    this._setupCountries();
    this._setupEventListeners();
    this._enhanceFormStyling();
  }

  _getElements() {
    const container = document.querySelector(selectors.customerAddresses);
    return container
      ? {
          container,
          addressContainer: container.querySelector(selectors.addressContainer),
          toggleButtons: document.querySelectorAll(selectors.toggleAddressButton),
          cancelButtons: container.querySelectorAll(selectors.cancelAddressButton),
          deleteButtons: container.querySelectorAll(selectors.deleteAddressButton),
          countrySelects: container.querySelectorAll(selectors.addressCountrySelect),
        }
      : {};
  }

  _setupCountries() {
    if (Shopify && Shopify.CountryProvinceSelector) {
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
        hideElement: 'AddressProvinceContainerNew',
      });
      this.elements.countrySelects.forEach((select) => {
        const formId = select.dataset.formId;
        // eslint-disable-next-line no-new
        new Shopify.CountryProvinceSelector(`AddressCountry_${formId}`, `AddressProvince_${formId}`, {
          hideElement: `AddressProvinceContainer_${formId}`,
        });
      });
    }
  }

  _setupEventListeners() {
    this.elements.toggleButtons.forEach((element) => {
      element.addEventListener('click', this._handleAddEditButtonClick);
    });
    this.elements.cancelButtons.forEach((element) => {
      element.addEventListener('click', this._handleCancelButtonClick);
    });
    this.elements.deleteButtons.forEach((element) => {
      element.addEventListener('click', this._handleDeleteButtonClick);
    });
  }

  // TechPack Enhancement: Add smooth form styling and interactions
  _enhanceFormStyling() {
    // Add enhanced focus states for inputs
    const inputs = this.elements.container.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('focus', this._handleInputFocus);
      input.addEventListener('blur', this._handleInputBlur);
    });

    // Add loading states to submit buttons
    const submitButtons = this.elements.container.querySelectorAll('button[type="submit"], button:not([type])');
    submitButtons.forEach(button => {
      if (!button.getAttribute('type') || button.getAttribute('type') === 'submit') {
        button.addEventListener('click', this._handleSubmitButtonClick);
      }
    });

    // Add smooth transitions to forms
    this._addFormTransitions();
  }

  _addFormTransitions() {
    // Add CSS for smooth transitions if not already present
    if (!document.getElementById('techpack-customer-transitions')) {
      const style = document.createElement('style');
      style.id = 'techpack-customer-transitions';
      style.textContent = `
        /* TechPack smooth transitions */
        .addresses [aria-expanded="false"] ~ div[id] {
          display: none !important;
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.3s ease;
        }
        
        .addresses [aria-expanded="true"] ~ div[id] {
          display: block !important;
          opacity: 1;
          transform: translateY(0);
          transition: all 0.3s ease;
          animation: techpackSlideIn 0.3s ease;
        }
        
        @keyframes techpackSlideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Enhanced button states */
        .addresses button {
          transition: all 0.2s ease !important;
        }
        
        .addresses button:hover {
          transform: translateY(-1px) !important;
        }
        
        .addresses button:active {
          transform: translateY(0) !important;
        }
        
        .addresses button.loading {
          opacity: 0.7 !important;
          pointer-events: none !important;
          position: relative !important;
        }
        
        .addresses button.loading::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 16px;
          height: 16px;
          margin: -8px 0 0 -8px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Enhanced input focus states */
        .addresses input:focus,
        .addresses select:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          transform: translateY(-1px) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  _handleInputFocus = (event) => {
    // Add enhanced visual feedback on focus
    const field = event.target.closest('.field') || event.target.closest('div');
    if (field) {
      field.classList.add('focused');
    }
  };

  _handleInputBlur = (event) => {
    // Remove focus styling
    const field = event.target.closest('.field') || event.target.closest('div');
    if (field) {
      field.classList.remove('focused');
    }
  };

  _handleSubmitButtonClick = (event) => {
    const button = event.currentTarget;
    const form = button.closest('form');
    
    // Add loading state
    button.classList.add('loading');
    button.textContent = 'Saving...';
    
    // Remove loading state after form submission (or on error)
    if (form) {
      form.addEventListener('submit', () => {
        // Keep loading state during submission
      });
      
      // Reset if there are validation errors
      setTimeout(() => {
        if (form.querySelector('.field input:invalid')) {
          button.classList.remove('loading');
          button.textContent = button.dataset.originalText || 'Save';
        }
      }, 100);
    }
  };

  _toggleExpanded(target) {
    const isExpanded = target.getAttribute(attributes.expanded) === 'true';
    const newState = (!isExpanded).toString();
    
    target.setAttribute(attributes.expanded, newState);
    
    // TechPack Enhancement: Smooth scroll to form when opening
    if (newState === 'true') {
      const targetForm = document.getElementById(target.getAttribute('aria-controls'));
      if (targetForm) {
        setTimeout(() => {
          targetForm.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          
          // Focus first input in the form
          const firstInput = targetForm.querySelector('input');
          if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
          }
        }, 100);
      }
    }
  }

  _handleAddEditButtonClick = ({ currentTarget }) => {
    // Close other open forms before opening new one
    this.elements.toggleButtons.forEach(button => {
      if (button !== currentTarget && button.getAttribute(attributes.expanded) === 'true') {
        this._toggleExpanded(button);
      }
    });
    
    this._toggleExpanded(currentTarget);
  };

  _handleCancelButtonClick = ({ currentTarget }) => {
    const toggleButton = currentTarget.closest(selectors.addressContainer)
      .querySelector(`[${attributes.expanded}]`);
    
    this._toggleExpanded(toggleButton);
    
    // TechPack Enhancement: Clear form on cancel
    const form = currentTarget.closest('form');
    if (form && currentTarget.getAttribute('type') === 'reset') {
      setTimeout(() => {
        // Reset any visual validation states
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
          input.classList.remove('field-error');
          const field = input.closest('.field') || input.closest('div');
          if (field) {
            field.classList.remove('error');
          }
        });
      }, 100);
    }
  };

  _handleDeleteButtonClick = ({ currentTarget }) => {
    // TechPack Enhancement: Better delete confirmation
    const confirmMessage = currentTarget.getAttribute(attributes.confirmMessage);
    
    // Create custom confirmation if browser supports it
    if (this._showCustomConfirm) {
      this._showCustomConfirm(confirmMessage, () => {
        this._performDelete(currentTarget);
      });
    } else {
      // Fallback to standard confirm
      // eslint-disable-next-line no-alert
      if (confirm(confirmMessage)) {
        this._performDelete(currentTarget);
      }
    }
  };

  _performDelete(button) {
    // Add loading state to delete button
    button.classList.add('loading');
    button.textContent = 'Deleting...';
    button.disabled = true;
    
    Shopify.postLink(button.dataset.target, {
      parameters: { _method: 'delete' },
    });
  }

  // TechPack Enhancement: Custom confirm dialog (optional)
  _showCustomConfirm(message, onConfirm) {
    // This could be enhanced with a custom modal in the future
    // For now, use standard confirm
    // eslint-disable-next-line no-alert
    if (confirm(message)) {
      onConfirm();
    }
  }
}

// TechPack Enhancement: Enhanced form validation
class TechPackFormValidation {
  constructor() {
    this._setupValidation();
  }

  _setupValidation() {
    const forms = document.querySelectorAll('.addresses form');
    
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input[required], select[required]');
      
      inputs.forEach(input => {
        input.addEventListener('blur', this._validateField);
        input.addEventListener('input', this._clearFieldError);
      });
      
      form.addEventListener('submit', this._validateForm);
    });
  }

  _validateField = (event) => {
    const field = event.target;
    const isValid = field.checkValidity();
    const fieldContainer = field.closest('.field') || field.closest('div');
    
    if (!isValid && field.value.trim() !== '') {
      this._showFieldError(field, fieldContainer);
    } else {
      this._clearFieldError(field, fieldContainer);
    }
  };

  _clearFieldError = (event) => {
    const field = event.target;
    const fieldContainer = field.closest('.field') || field.closest('div');
    this._clearFieldError(field, fieldContainer);
  };

  _showFieldError(field, container) {
    if (container) {
      container.classList.add('error');
      field.classList.add('field-error');
    }
  }

  _clearFieldError(field, container) {
    if (container) {
      container.classList.remove('error');
      field.classList.remove('field-error');
    }
  }

  _validateForm = (event) => {
    const form = event.target;
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.checkValidity()) {
        isValid = false;
        const fieldContainer = field.closest('.field') || field.closest('div');
        this._showFieldError(field, fieldContainer);
      }
    });
    
    if (!isValid) {
      event.preventDefault();
      
      // Scroll to first error
      const firstError = form.querySelector('.field-error, .error input');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }
  };
}

// Initialize both classes
window.addEventListener('load', () => {
  if (typeof CustomerAddresses !== 'undefined') {
    new CustomerAddresses();
  }
  
  // Initialize TechPack enhancements
  if (document.querySelector('.addresses')) {
    new TechPackFormValidation();
  }
});