/**
 * Wholesale Modal System
 * Handles modal functionality, form validation, file uploads, and API submissions
 */

class WholesaleModal {
  constructor() {
    this.modal = null;
    this.form = null;
    this.isSubmitting = false;
    this.uploadedFiles = [];
    this.maxFileSize = 50 * 1024 * 1024; // 50MB in bytes
    this.allowedFileTypes = ['application/pdf', 'application/postscript', 'image/png', 'image/jpeg', 'image/jpg'];
    
    this.init();
  }

  /**
   * Initialize the wholesale modal system
   */
  init() {
    this.bindEvents();
    this.setupAccessibility();
  }

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Wholesale button clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.wholesale-btn')) {
        e.preventDefault();
        this.openModal(e.target.closest('.wholesale-btn'));
      }
    });

    // Modal close events
    document.addEventListener('click', (e) => {
      if (e.target.closest('.wholesale-modal-close') || 
          e.target.closest('#wholesale-cancel') ||
          (e.target.classList.contains('wholesale-modal-overlay'))) {
        this.closeModal();
      }
    });

    // Form submission
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'wholesale-form') {
        e.preventDefault();
        this.handleSubmit();
      }
    });

    // File input changes
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('wholesale-file-input')) {
        this.handleFileUpload(e.target);
      }
    });

    // Quantity input changes
    document.addEventListener('input', (e) => {
      if (e.target.name && e.target.name.startsWith('qty_')) {
        this.updateTotalQuantity();
      }
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && !this.modal.getAttribute('aria-hidden')) {
        this.closeModal();
      }
    });
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    // Focus management will be handled in openModal/closeModal
  }

  /**
   * Open the wholesale modal with product data
   * @param {HTMLElement} button - The clicked wholesale button
   */
  openModal(button) {
    this.modal = document.getElementById('wholesale-modal');
    this.form = document.getElementById('wholesale-form');
    
    if (!this.modal || !this.form) {
      console.error('Wholesale modal or form not found');
      return;
    }
    
    // Show modal
    document.body.classList.add('wholesale-modal-open');
    this.modal.setAttribute('aria-hidden', 'false');
    this.modal.style.display = 'flex';
    
    // Focus management
    const firstInput = this.modal.querySelector('input:not([type="hidden"]), select, textarea');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }

    // Reset form
    this.resetForm();
  }

  /**
   * Close the wholesale modal
   */
  closeModal() {
    if (!this.modal) return;

    document.body.classList.remove('wholesale-modal-open');
    this.modal.setAttribute('aria-hidden', 'true');
    this.modal.style.display = 'none';
    
    // Reset form state
    this.resetForm();
    this.isSubmitting = false;
  }

  /**
   * Populate product data from button attributes
   * @param {HTMLElement} button - The clicked wholesale button
   */
  populateProductData(button) {
    const productId = button.dataset.productId;
    const productTitle = button.dataset.productTitle;
    const productHandle = button.dataset.productHandle;
    const productPrice = button.dataset.productPrice;
    const productColors = button.dataset.productColors;

    // Set hidden fields
    document.getElementById('product-id').value = productId || '';
    document.getElementById('product-title').value = productTitle || '';
    document.getElementById('product-handle').value = productHandle || '';
    document.getElementById('product-price').value = productPrice || '';

    // Update modal title
    const modalTitle = document.getElementById('wholesale-modal-title');
    if (modalTitle && productTitle) {
      modalTitle.textContent = `Wholesale Inquiry - ${productTitle}`;
    }

    // Populate color options
    this.populateColorOptions(productColors);
  }

  /**
   * Handle file upload and validation
   * @param {HTMLInputElement} input - File input element
   */
  handleFileUpload(input) {
    const file = input.files[0];
    const fileInfo = document.querySelector(`[data-target="${input.id}"]`);
    
    if (!file) {
      if (fileInfo) fileInfo.innerHTML = '';
      return;
    }

    // Validate file size
    if (file.size > this.maxFileSize) {
      this.showFileError(fileInfo, 'File size must be less than 50MB');
      input.value = '';
      return;
    }

    // Validate file type
    if (!this.isValidFileType(file)) {
      this.showFileError(fileInfo, 'Invalid file type. Please upload PDF, AI, EPS, PNG, or JPG files.');
      input.value = '';
      return;
    }

    // Show file info
    if (fileInfo) {
      const fileSize = this.formatFileSize(file.size);
      fileInfo.innerHTML = `
        <div class="wholesale-file-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
          <span>${file.name} (${fileSize})</span>
          <button type="button" class="wholesale-file-remove" data-input="${input.id}">Remove</button>
        </div>
      `;

      // Add remove functionality
      const removeBtn = fileInfo.querySelector('.wholesale-file-remove');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          input.value = '';
          fileInfo.innerHTML = '';
        });
      }
    }
  }

  /**
   * Show file upload error
   * @param {HTMLElement} container - Error container element
   * @param {string} message - Error message
   */
  showFileError(container, message) {
    if (container) {
      container.innerHTML = `
        <div class="wholesale-file-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <span>${message}</span>
        </div>
      `;
    }
  }

  /**
   * Validate file type
   * @param {File} file - File to validate
   * @returns {boolean} - True if valid file type
   */
  isValidFileType(file) {
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const validExtensions = ['pdf', 'ai', 'eps', 'png', 'jpg', 'jpeg'];
    
    return validExtensions.includes(fileExtension) || this.allowedFileTypes.includes(file.type);
  }

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} - Formatted file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Update total quantity display
   */
  updateTotalQuantity() {
    const quantityInputs = document.querySelectorAll('input[name^="qty_"]');
    let total = 0;
    
    quantityInputs.forEach(input => {
      const value = parseInt(input.value) || 0;
      total += value;
    });
    
    const totalDisplay = document.getElementById('total-quantity');
    if (totalDisplay) {
      totalDisplay.textContent = total;
    }
  }

  /**
   * Reset form to initial state
   */
  resetForm() {
    if (!this.form) return;

    // Reset form fields
    this.form.reset();
    
    // Clear file info displays
    document.querySelectorAll('.wholesale-file-info').forEach(info => {
      info.innerHTML = '';
    });
    
    // Reset total quantity
    this.updateTotalQuantity();
    
    // Clear messages
    this.hideMessages();
    
    // Reset submit button
    this.resetSubmitButton();
  }

  /**
   * Handle form submission
   */
  async handleSubmit() {
    if (this.isSubmitting) return;

    // Validate form
    const validation = this.validateForm();
    if (!validation.isValid) {
      this.showErrors(validation.errors);
      return;
    }

    this.isSubmitting = true;
    this.showSubmitLoading();
    this.hideMessages();

    try {
      // Prepare form data
      const formData = await this.prepareFormData();
      
      // Submit to email endpoint
      await this.submitToEmail(formData);
      
      // Create draft order (optional)
      try {
        await this.createDraftOrder(formData);
      } catch (error) {
        console.warn('Draft order creation failed:', error);
        // Don't fail the entire submission if draft order fails
      }
      
      this.showSuccess('Your wholesale inquiry has been submitted successfully! We will contact you within 24 hours.');
      
      // Close modal after delay
      setTimeout(() => {
        this.closeModal();
      }, 3000);
      
    } catch (error) {
      console.error('Submission error:', error);
      this.showErrors(['An error occurred while submitting your inquiry. Please try again.']);
    } finally {
      this.isSubmitting = false;
      this.resetSubmitButton();
    }
  }

  /**
   * Validate form data
   * @returns {Object} - Validation result with isValid and errors
   */
  validateForm() {
    const errors = [];

    // Check required fields
    const requiredFields = [
      { id: 'company-name', name: 'Company Name' },
      { id: 'vat-tax-id', name: 'VAT / Tax ID' },
      { id: 'contact-name', name: 'Contact Name' },
      { id: 'contact-email', name: 'Email' },
      { id: 'contact-country', name: 'Country' }
    ];

    requiredFields.forEach(field => {
      const input = document.getElementById(field.id);
      if (!input || !input.value.trim()) {
        errors.push(`${field.name} is required.`);
      }
    });

    // Validate email format
    const emailInput = document.getElementById('contact-email');
    if (emailInput && emailInput.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        errors.push('Please enter a valid email address.');
      }
    }

    // Check quantities
    const quantityInputs = document.querySelectorAll('input[name^="qty_"]');
    let hasQuantity = false;
    quantityInputs.forEach(input => {
      const value = parseInt(input.value) || 0;
      if (value > 0) hasQuantity = true;
    });

    if (!hasQuantity) {
      errors.push('Please enter at least one quantity.');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Prepare form data for submission
   * @returns {FormData} - Prepared form data
   */
  async prepareFormData() {
    const formData = new FormData();

    // Add all form fields
    const formElements = this.form.elements;
    for (let element of formElements) {
      if (element.name && element.value) {
        if (element.type === 'checkbox') {
          if (element.checked) {
            formData.append(element.name, element.value);
          }
        } else if (element.type === 'file') {
          if (element.files[0]) {
            formData.append(element.name, element.files[0]);
          }
        } else {
          formData.append(element.name, element.value);
        }
      }
    }

    // Add quantities object
    const quantities = {};
    document.querySelectorAll('input[name^="qty_"]').forEach(input => {
      const size = input.name.replace('qty_', '').toUpperCase();
      const qty = parseInt(input.value) || 0;
      if (qty > 0) {
        quantities[size] = qty;
      }
    });
    formData.append('quantities', JSON.stringify(quantities));

    return formData;
  }

  /**
   * Submit form data to email endpoint
   * @param {FormData} formData - Form data to submit
   */
  async submitToEmail(formData) {
    // Create email payload
    const emailData = {
      to: 'orders@myshop.com',
      subject: `Wholesale Inquiry - ${formData.get('product_title')}`,
      html: this.generateEmailHTML(formData),
      attachments: await this.prepareEmailAttachments(formData)
    };

    // Submit via Shopify's contact form or custom endpoint
    const response = await fetch('/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        form_type: 'wholesale_inquiry',
        utf8: '✓',
        contact: {
          name: formData.get('contact_name'),
          email: formData.get('contact_email'),
          body: this.generateEmailText(formData)
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Email submission failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generate HTML email content
   * @param {FormData} formData - Form data
   * @returns {string} - HTML email content
   */
  generateEmailHTML(formData) {
    const quantities = JSON.parse(formData.get('quantities') || '{}');
    
    let quantitiesTable = '<table border="1" cellpadding="5" cellspacing="0">';
    quantitiesTable += '<tr><th>Size</th><th>Quantity</th></tr>';
    Object.entries(quantities).forEach(([size, qty]) => {
      quantitiesTable += `<tr><td>${size}</td><td>${qty}</td></tr>`;
    });
    quantitiesTable += '</table>';

    return `
      <h2>New Wholesale Inquiry</h2>
      
      <h3>Product Information</h3>
      <p><strong>Product:</strong> ${formData.get('product_title')}</p>
      <p><strong>Product ID:</strong> ${formData.get('product_id')}</p>
      
      <h3>Company Information</h3>
      <p><strong>Company Name:</strong> ${formData.get('company_name')}</p>
      <p><strong>VAT/Tax ID:</strong> ${formData.get('vat_tax_id')}</p>
      
      <h3>Contact Information</h3>
      <p><strong>Name:</strong> ${formData.get('contact_name')}</p>
      <p><strong>Email:</strong> ${formData.get('contact_email')}</p>
      <p><strong>Country:</strong> ${formData.get('contact_country')}</p>
      
      <h3>Order Details</h3>
      <p><strong>Quantities by Size:</strong></p>
      ${quantitiesTable}
      
      ${formData.get('additional_notes') ? `
        <h3>Additional Notes</h3>
        <p>${formData.get('additional_notes').replace(/\n/g, '<br>')}</p>
      ` : ''}
      
      <h3>Submitted Files</h3>
      <p>Artwork files are attached to this email.</p>
      
      <hr>
      <p><em>This inquiry was submitted via the wholesale form on your website.</em></p>
    `;
  }

  /**
   * Generate plain text email content
   * @param {FormData} formData - Form data
   * @returns {string} - Plain text email content
   */
  generateEmailText(formData) {
    const quantities = JSON.parse(formData.get('quantities') || '{}');
    
    let quantitiesText = '\n';
    Object.entries(quantities).forEach(([size, qty]) => {
      quantitiesText += `${size}: ${qty}\n`;
    });

    return `
NEW WHOLESALE INQUIRY

Product Information:
- Product: ${formData.get('product_title')}
- Product ID: ${formData.get('product_id')}

Company Information:
- Company Name: ${formData.get('company_name')}
- VAT/Tax ID: ${formData.get('vat_tax_id')}

Contact Information:
- Name: ${formData.get('contact_name')}
- Email: ${formData.get('contact_email')}
- Country: ${formData.get('contact_country')}

Order Details:
- Quantities by Size:${quantitiesText}

${formData.get('additional_notes') ? `Additional Notes:\n${formData.get('additional_notes')}\n\n` : ''}

Artwork files are attached to this email.

---
This inquiry was submitted via the wholesale form on your website.
    `.trim();
  }

  /**
   * Prepare email attachments
   * @param {FormData} formData - Form data
   * @returns {Array} - Array of attachment objects
   */
  async prepareEmailAttachments(formData) {
    const attachments = [];
    
    for (let i = 1; i <= 3; i++) {
      const file = formData.get(`artwork_${i}`);
      if (file && file.size > 0) {
        // Convert file to base64 for email attachment
        const base64 = await this.fileToBase64(file);
        attachments.push({
          filename: file.name,
          content: base64,
          contentType: file.type
        });
      }
    }
    
    return attachments;
  }

  /**
   * Convert file to base64
   * @param {File} file - File to convert
   * @returns {Promise<string>} - Base64 string
   */
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Create draft order in Shopify
   * @param {FormData} formData - Form data
   */
  async createDraftOrder(formData) {
    const quantities = JSON.parse(formData.get('quantities') || '{}');
    
    // Calculate total quantity
    const totalQty = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
    
    const draftOrderData = {
      draft_order: {
        line_items: [{
          variant_id: formData.get('product_id'),
          quantity: totalQty,
          properties: [
            {
              name: 'Wholesale Order',
              value: 'Yes'
            },
            {
              name: 'Size Breakdown',
              value: Object.entries(quantities).map(([size, qty]) => `${size}: ${qty}`).join(', ')
            },
            {
              name: 'Company',
              value: formData.get('company_name')
            },
            {
              name: 'VAT/Tax ID',
              value: formData.get('vat_tax_id')
            }
          ]
        }],
        customer: {
          first_name: formData.get('contact_name').split(' ')[0] || formData.get('contact_name'),
          last_name: formData.get('contact_name').split(' ').slice(1).join(' ') || '',
          email: formData.get('contact_email')
        },
        shipping_address: {
          country: formData.get('contact_country')
        },
        tags: 'WHOLESALE',
        note: `
Wholesale Inquiry Details:
Company: ${formData.get('company_name')}
VAT/Tax ID: ${formData.get('vat_tax_id')}
Contact: ${formData.get('contact_name')} (${formData.get('contact_email')})
Country: ${formData.get('contact_country')}
Size Breakdown: ${Object.entries(quantities).map(([size, qty]) => `${size}: ${qty}`).join(', ')}
${formData.get('additional_notes') ? `\nAdditional Notes: ${formData.get('additional_notes')}` : ''}
        `.trim()
      }
    };

    // Submit to Shopify Admin API (would need proper authentication in production)
    const response = await fetch('/admin/api/2023-10/draft_orders.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Shopify-Access-Token': window.Shopify?.shop?.accessToken || ''
      },
      body: JSON.stringify(draftOrderData)
    });

    if (!response.ok) {
      throw new Error(`Draft order creation failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Show loading state on submit button
   */
  showSubmitLoading() {
    const submitBtn = document.getElementById('wholesale-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.querySelector('.wholesale-btn-text').style.display = 'none';
      submitBtn.querySelector('.wholesale-btn-loading').style.display = 'inline-flex';
    }
  }

  /**
   * Reset submit button state
   */
  resetSubmitButton() {
    const submitBtn = document.getElementById('wholesale-submit');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.querySelector('.wholesale-btn-text').style.display = 'inline';
      submitBtn.querySelector('.wholesale-btn-loading').style.display = 'none';
    }
  }

  /**
   * Show error messages
   * @param {Array<string>} errors - Array of error messages
   */
  showErrors(errors) {
    const errorContainer = document.getElementById('wholesale-errors');
    if (!errorContainer || !errors.length) return;

    errorContainer.innerHTML = `
      <div class="wholesale-error-content">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <div class="wholesale-error-list">
          <p><strong>Please correct the following errors:</strong></p>
          <ul>
            ${errors.map(error => `<li>${error}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
    errorContainer.style.display = 'block';
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Show success message
   * @param {string} message - Success message
   */
  showSuccess(message) {
    const successContainer = document.getElementById('wholesale-success');
    if (!successContainer) return;

    successContainer.innerHTML = `
      <div class="wholesale-success-content">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
        <p>${message}</p>
      </div>
    `;
    successContainer.style.display = 'block';
    successContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Hide all messages
   */
  hideMessages() {
    const errorContainer = document.getElementById('wholesale-errors');
    const successContainer = document.getElementById('wholesale-success');
    
    if (errorContainer) errorContainer.style.display = 'none';
    if (successContainer) successContainer.style.display = 'none';
  }
}

/**
 * Initialize wholesale modal when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  new WholesaleModal();
});

/**
 * Fallback initialization for async loading
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new WholesaleModal();
  });
} else {
  new WholesaleModal();
}
