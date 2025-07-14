// Interactive Product Information Tabs
class InteractiveProductTabs {
  constructor() {
    this.selectedServiceType = null;
    this.activeTab = 'size-guide';
    this.uploadedFiles = [];
    
    this.init();
  }
  
  init() {
    this.setupServiceCards();
    this.setupTabs();
    this.setupSizeGuide();
    this.setupFileUpload();
    this.setupHelpButtons();
  }
  
  setupServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
      card.addEventListener('click', () => {
        this.selectServiceType(card);
      });
      
      // Keyboard support
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectServiceType(card);
        }
      });
    });
  }
  
  selectServiceType(card) {
    // Remove previous selection
    document.querySelectorAll('.service-card').forEach(c => {
      c.classList.remove('selected');
    });
    
    // Add selection to clicked card
    card.classList.add('selected');
    
    const serviceType = card.dataset.serviceType;
    this.selectedServiceType = serviceType;
    
    // Update any price displays or form fields based on service type
    this.updateServiceSelection(serviceType);
    
    // Add visual feedback
    this.animateCardSelection(card);
  }
  
  animateCardSelection(card) {
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
      card.style.transform = '';
    }, 150);
  }
  
  updateServiceSelection(serviceType) {
    // Create or update hidden form field for service type
    let serviceInput = document.getElementById('selected-service-type');
    if (!serviceInput) {
      serviceInput = document.createElement('input');
      serviceInput.type = 'hidden';
      serviceInput.id = 'selected-service-type';
      serviceInput.name = 'properties[Service Type]';
      
      const form = document.querySelector('.product-form form[action="/cart/add"]');
      if (form) {
        form.appendChild(serviceInput);
      }
    }
    
    serviceInput.value = serviceType.charAt(0).toUpperCase() + serviceType.slice(1);
    
    // Dispatch event for other components
    this.dispatchServiceChangeEvent(serviceType);
  }
  
  setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        this.switchTab(targetTab);
      });
    });
  }
  
  switchTab(targetTab) {
    // Update button states
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${targetTab}"]`).classList.add('active');
    
    // Update content visibility
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(targetTab).classList.add('active');
    
    this.activeTab = targetTab;
    
    // Trigger any tab-specific initialization
    this.onTabActivated(targetTab);
  }
  
  onTabActivated(tabId) {
    switch (tabId) {
      case 'size-guide':
        this.initializeSizeGuide();
        break;
      case 'custom-design':
        this.initializeUploadArea();
        break;
    }
  }
  
  setupSizeGuide() {
    const recommendButton = document.querySelector('.size-recommend-btn');
    const heightInput = document.getElementById('height-input');
    const weightInput = document.getElementById('weight-input');
    
    if (recommendButton) {
      recommendButton.addEventListener('click', () => {
        this.calculateSizeRecommendation();
      });
    }
    
    // Auto-calculate on input change
    [heightInput, weightInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          if (heightInput.value && weightInput.value) {
            this.calculateSizeRecommendation();
          }
        });
      }
    });
  }
  
  calculateSizeRecommendation() {
    const height = parseInt(document.getElementById('height-input').value);
    const weight = parseInt(document.getElementById('weight-input').value);
    
    if (!height || !weight) {
      alert('Please enter both height and weight for size recommendation.');
      return;
    }
    
    // Simple size calculation logic (this would be more sophisticated in production)
    const bmi = weight / ((height / 100) ** 2);
    let recommendedSize;
    let confidence;
    
    if (height < 160) {
      recommendedSize = bmi < 20 ? 'XS' : bmi < 25 ? 'S' : 'M';
    } else if (height < 170) {
      recommendedSize = bmi < 20 ? 'S' : bmi < 25 ? 'M' : 'L';
    } else if (height < 180) {
      recommendedSize = bmi < 20 ? 'M' : bmi < 25 ? 'L' : 'XL';
    } else {
      recommendedSize = bmi < 22 ? 'L' : 'XL';
    }
    
    // Calculate confidence based on how close values are to typical ranges
    confidence = Math.min(95, Math.max(75, 90 - Math.abs(bmi - 22) * 5));
    
    this.showSizeRecommendation(recommendedSize, confidence);
  }
  
  showSizeRecommendation(size, confidence) {
    const recommendationDiv = document.getElementById('size-recommendation');
    const sizeSpan = recommendationDiv.querySelector('.recommended-size');
    const confidenceSpan = recommendationDiv.querySelector('.confidence-level');
    
    sizeSpan.textContent = size;
    confidenceSpan.textContent = `${Math.round(confidence)}% match`;
    
    recommendationDiv.style.display = 'block';
    
    // Highlight the recommended row in the size chart
    document.querySelectorAll('.size-chart-table tr').forEach(row => {
      row.classList.remove('recommended');
    });
    
    const recommendedRow = document.querySelector(`[data-size="${size}"]`);
    if (recommendedRow) {
      recommendedRow.classList.add('recommended');
      recommendedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Auto-select the recommended size in the product form
    this.selectRecommendedSize(size);
  }

  selectRecommendedSize(size) {
    // Find the size input that matches the recommended size
    const sizeInputs = document.querySelectorAll('.size-input');
    let matchingInput = null;

    sizeInputs.forEach(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label && label.textContent.trim().toUpperCase() === size.toUpperCase()) {
        matchingInput = input;
      }
    });

    // If we found a matching size input, select it
    if (matchingInput && matchingInput.disabled === false) {
      // Remove previous selections
      sizeInputs.forEach(input => {
        input.checked = false;
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) label.classList.remove('recommended-selection');
      });

      // Select the recommended size
      matchingInput.checked = true;
      
      // Add visual indicator
      const label = document.querySelector(`label[for="${matchingInput.id}"]`);
      if (label) {
        label.classList.add('recommended-selection');
      }

      // Trigger the change event to update variant selection
      matchingInput.dispatchEvent(new Event('change', { bubbles: true }));

      // Show confirmation message
      this.showSizeSelectionConfirmation(size);
    } else if (matchingInput && matchingInput.disabled === true) {
      // Show message if recommended size is out of stock
      this.showSizeUnavailableMessage(size);
    }
  }

  showSizeSelectionConfirmation(size) {
    const confirmationDiv = document.createElement('div');
    confirmationDiv.className = 'size-selection-confirmation';
    confirmationDiv.innerHTML = `
      <div class="confirmation-content">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 6L9 17l-5-5"></path>
        </svg>
        <span>Size ${size} selected based on your measurements</span>
      </div>
    `;

    // Insert after the recommendation div
    const recommendationDiv = document.getElementById('size-recommendation');
    recommendationDiv.parentNode.insertBefore(confirmationDiv, recommendationDiv.nextSibling);

    // Remove after 3 seconds
    setTimeout(() => {
      if (confirmationDiv.parentNode) {
        confirmationDiv.parentNode.removeChild(confirmationDiv);
      }
    }, 3000);
  }

  showSizeUnavailableMessage(size) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'size-unavailable-message';
    messageDiv.innerHTML = `
      <div class="message-content">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <span>Recommended size ${size} is currently unavailable</span>
      </div>
    `;

    // Insert after the recommendation div
    const recommendationDiv = document.getElementById('size-recommendation');
    recommendationDiv.parentNode.insertBefore(messageDiv, recommendationDiv.nextSibling);

    // Remove after 4 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 4000);
  }
    
    // Animate the recommendation
    recommendationDiv.style.transform = 'scale(0.95)';
    setTimeout(() => {
      recommendationDiv.style.transform = 'scale(1)';
    }, 200);
  }
  
  initializeSizeGuide() {
    // Any additional initialization when size guide tab is opened
  }
  
  setupFileUpload() {
    const dropzone = document.getElementById('design-dropzone');
    const fileInput = document.getElementById('design-file-input');
    const uploadLink = dropzone?.querySelector('.upload-link');
    
    if (!dropzone || !fileInput) return;
    
    // Click to browse
    dropzone.addEventListener('click', () => {
      fileInput.click();
    });
    
    if (uploadLink) {
      uploadLink.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }
    
    // File input change
    fileInput.addEventListener('change', (e) => {
      this.handleFiles(Array.from(e.target.files));
    });
    
    // Drag and drop
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
    
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });
    
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      
      const files = Array.from(e.dataTransfer.files);
      this.handleFiles(files);
    });
  }
  
  handleFiles(files) {
    const validFiles = files.filter(file => this.validateFile(file));
    
    validFiles.forEach(file => {
      this.uploadedFiles.push(file);
      this.displayUploadedFile(file);
    });
    
    if (validFiles.length > 0) {
      this.showUploadedFilesSection();
      this.updateFormWithFiles();
    }
  }
  
  validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    
    if (file.size > maxSize) {
      alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
      return false;
    }
    
    if (!allowedTypes.some(type => file.type.includes(type.split('/')[1]) || file.name.toLowerCase().includes(type.split('/')[1]))) {
      alert(`File "${file.name}" is not a supported format. Supported: PNG, JPG, AI, EPS, PDF`);
      return false;
    }
    
    return true;
  }
  
  displayUploadedFile(file) {
    const fileList = document.querySelector('.file-list');
    if (!fileList) return;
    
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
      <div class="file-info">
        <div class="file-icon">${this.getFileIcon(file.type)}</div>
        <div class="file-details">
          <h6>${file.name}</h6>
          <p>${this.formatFileSize(file.size)}</p>
        </div>
      </div>
      <button type="button" class="file-remove" data-file-name="${file.name}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    `;
    
    // Add remove functionality
    const removeBtn = fileItem.querySelector('.file-remove');
    removeBtn.addEventListener('click', () => {
      this.removeFile(file.name, fileItem);
    });
    
    fileList.appendChild(fileItem);
  }
  
  removeFile(fileName, fileElement) {
    this.uploadedFiles = this.uploadedFiles.filter(file => file.name !== fileName);
    fileElement.remove();
    
    if (this.uploadedFiles.length === 0) {
      this.hideUploadedFilesSection();
    }
    
    this.updateFormWithFiles();
  }
  
  showUploadedFilesSection() {
    const uploadedFilesSection = document.getElementById('uploaded-files');
    if (uploadedFilesSection) {
      uploadedFilesSection.style.display = 'block';
    }
  }
  
  hideUploadedFilesSection() {
    const uploadedFilesSection = document.getElementById('uploaded-files');
    if (uploadedFilesSection) {
      uploadedFilesSection.style.display = 'none';
    }
  }
  
  updateFormWithFiles() {
    // Update form with file information
    let filesInput = document.getElementById('uploaded-design-files');
    if (!filesInput) {
      filesInput = document.createElement('input');
      filesInput.type = 'hidden';
      filesInput.id = 'uploaded-design-files';
      filesInput.name = 'properties[Design Files]';
      
      const form = document.querySelector('.product-form form[action="/cart/add"]');
      if (form) {
        form.appendChild(filesInput);
      }
    }
    
    const fileNames = this.uploadedFiles.map(file => file.name).join(', ');
    filesInput.value = fileNames;
  }
  
  getFileIcon(fileType) {
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    return '📁';
  }
  
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  initializeUploadArea() {
    // Any additional initialization when upload tab is opened
  }
  
  setupHelpButtons() {
    const consultationBtn = document.querySelector('.consultation-btn');
    const templatesBtn = document.querySelector('.templates-btn');
    
    if (consultationBtn) {
      consultationBtn.addEventListener('click', () => {
        // In a real implementation, this might open a scheduling widget
        alert('Consultation booking feature would be integrated here!');
      });
    }
    
    if (templatesBtn) {
      templatesBtn.addEventListener('click', () => {
        // In a real implementation, this might open a template gallery
        alert('Template gallery would be opened here!');
      });
    }
  }
  
  dispatchServiceChangeEvent(serviceType) {
    const event = new CustomEvent('serviceTypeChanged', {
      detail: { serviceType }
    });
    document.dispatchEvent(event);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.interactive-product-info')) {
    new InteractiveProductTabs();
  }
});

// Export for potential use by other scripts
window.InteractiveProductTabs = InteractiveProductTabs;