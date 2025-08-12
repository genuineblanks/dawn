/**
 * TechPack v2 - Premium Visual Interface Application
 * Complete image-based garment builder with live preview and real-time pricing
 * Mobile-first, accessible, and performance optimized
 * Version: 2.0.0
 */

(function() {
  'use strict';

  // ===== CONFIGURATION & PRICING SYSTEM =====
  
  // PRICING_EDIT_HERE: Modular pricing constants - easily customizable
  const PRICING = {
    // Base pricing constants
    fabricPerKg: 10,
    fabricMargin: 0.40,
    marginA: 0.30,
    marginB: 0.10,
    bulkMultiplier: 4,
    
    // Base garment prices (EUR)
    garments: {
      'hoodie-pullover': { base: 25, gsm_factor: 0.08 },
      'hoodie-zip': { base: 30, gsm_factor: 0.08 },
      'crewneck': { base: 22, gsm_factor: 0.06 },
      'tee': { base: 12, gsm_factor: 0.04 },
      'polo': { base: 18, gsm_factor: 0.05 },
      'sweatpants': { base: 28, gsm_factor: 0.07 },
      'shorts': { base: 16, gsm_factor: 0.05 },
      'tank': { base: 10, gsm_factor: 0.03 },
      'football-jersey': { base: 24, gsm_factor: 0.06 }
    },
    
    // Fabric pricing multipliers
    fabrics: {
      'organic-cotton-jersey': 1.0,
      'fleece-brushed': 1.3,
      'fleece-unbrushed': 1.2,
      'waffle': 1.1,
      'pique': 1.0,
      'twill': 1.15,
      'canvas': 1.25,
      'linen': 1.4,
      'viscose': 1.2,
      'tencel': 1.35
    },
    
    // Decoration pricing (EUR per cm²)
    decoration: {
      'screen-print': { base: 0.15, color_multiplier: 0.1 },
      'embroidery': { base: 0.25, stitch_factor: 0.05 },
      'dtf': { base: 0.20, color_multiplier: 0.05 },
      'applique': { base: 0.30, color_multiplier: 0.08 }
    },
    
    // Add-on pricing (EUR)
    addons: {
      'neck-label': 2.00,
      'hang-tag': 1.50,
      'polybag': 0.30,
      'size-sticker': 0.20
    },
    
    // Quantity discounts
    quantity_breaks: [
      { min: 50, discount: 0.95 },
      { min: 100, discount: 0.90 },
      { min: 250, discount: 0.85 },
      { min: 500, discount: 0.80 }
    ]
  };

  // Application configuration
  const CONFIG = {
    MIN_ORDER_QUANTITY: 75,
    MAX_FILES: 10,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    VALID_FILE_TYPES: ['.pdf', '.ai', '.png', '.jpg', '.jpeg', '.zip'],
    DEBOUNCE_DELAY: 300,
    ANIMATION_DURATION: 300,
    
    // Google Apps Script endpoint for file uploads
    GOOGLE_DRIVE_WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbxYour-Script-ID-Here/exec',
    
    // Fallback contact form
    SHOPIFY_CONTACT_URL: '/contact'
  };

  // ===== STATE MANAGEMENT =====
  class TechPackV2State {
    constructor() {
      this.currentStep = 0;
      this.data = {
        clientInfo: {},
        files: [],
        garment: {
          baseGarment: null,
          fit: null,
          gsm: null,
          fabric: null,
          colorways: [],
          decoration: null,
          addons: []
        },
        pricing: {
          base: 0,
          decoration: 0,
          addons: 0,
          total: 0
        }
      };
      
      this.loadFromStorage();
    }
    
    saveToStorage() {
      try {
        localStorage.setItem('techpack-v2-data', JSON.stringify(this.data));
        localStorage.setItem('techpack-v2-step', this.currentStep.toString());
      } catch (error) {
        console.warn('Failed to save to localStorage:', error);
      }
    }
    
    loadFromStorage() {
      try {
        const savedData = localStorage.getItem('techpack-v2-data');
        const savedStep = localStorage.getItem('techpack-v2-step');
        
        if (savedData) {
          this.data = { ...this.data, ...JSON.parse(savedData) };
        }
        
        if (savedStep) {
          this.currentStep = parseInt(savedStep, 10);
        }
      } catch (error) {
        console.warn('Failed to load from localStorage:', error);
      }
    }
    
    clearStorage() {
      try {
        localStorage.removeItem('techpack-v2-data');
        localStorage.removeItem('techpack-v2-step');
      } catch (error) {
        console.warn('Failed to clear localStorage:', error);
      }
    }
    
    updateData(path, value) {
      const keys = path.split('.');
      let current = this.data;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      this.saveToStorage();
      this.emit('dataChanged', { path, value });
    }
    
    getData(path) {
      const keys = path.split('.');
      let current = this.data;
      
      for (const key of keys) {
        if (current === null || current === undefined) return undefined;
        current = current[key];
      }
      
      return current;
    }
    
    // Simple event emitter
    emit(event, data) {
      const customEvent = new CustomEvent(`techpack-v2-${event}`, { 
        detail: data,
        bubbles: true 
      });
      document.dispatchEvent(customEvent);
    }
  }

  // ===== PRICING ENGINE =====
  class PricingEngine {
    
    // PRICING_EDIT_HERE: Base garment calculation
    static calcBase(garmentType, gsm, fabric) {
      const garmentConfig = PRICING.garments[garmentType];
      const fabricMultiplier = PRICING.fabrics[fabric] || 1.0;
      
      if (!garmentConfig) return 0;
      
      const basePrice = garmentConfig.base;
      const gsmAdjustment = gsm ? (gsm - 220) * garmentConfig.gsm_factor : 0;
      const fabricAdjustment = basePrice * (fabricMultiplier - 1);
      
      return Math.max(basePrice + gsmAdjustment + fabricAdjustment, basePrice * 0.5);
    }
    
    // PRICING_EDIT_HERE: Decoration cost calculation
    static calcDecoration(method, { areaCm2, colors = 1, stitches = 1000 }) {
      const decorationConfig = PRICING.decoration[method];
      if (!decorationConfig) return 0;
      
      let cost = decorationConfig.base * areaCm2;
      
      // Method-specific calculations
      switch (method) {
        case 'screen-print':
        case 'dtf':
          cost += areaCm2 * decorationConfig.color_multiplier * (colors - 1);
          break;
        case 'embroidery':
          cost += stitches * decorationConfig.stitch_factor;
          break;
        case 'applique':
          cost += areaCm2 * decorationConfig.color_multiplier * colors;
          break;
      }
      
      return Math.max(cost, 5); // Minimum decoration cost
    }
    
    // PRICING_EDIT_HERE: Add-ons calculation
    static calcAddons(selectedAddons) {
      return selectedAddons.reduce((total, addon) => {
        return total + (PRICING.addons[addon] || 0);
      }, 0);
    }
    
    // PRICING_EDIT_HERE: Quantity discounts
    static applyQuantityDiscount(price, quantity) {
      const discount = PRICING.quantity_breaks
        .reverse()
        .find(break_ => quantity >= break_.min);
      
      return discount ? price * discount.discount : price;
    }
    
    // PRICING_EDIT_HERE: Total calculation with breakdown
    static calcTotals(parts) {
      const { basePrice, decorationPrice, addonsPrice, quantity = 1 } = parts;
      
      const subtotal = basePrice + decorationPrice + addonsPrice;
      const unitPrice = this.applyQuantityDiscount(subtotal, quantity);
      const total = unitPrice * quantity;
      
      return {
        itemized: {
          basePrice: basePrice.toFixed(2),
          decorationPrice: decorationPrice.toFixed(2),
          addonsPrice: addonsPrice.toFixed(2),
          subtotal: subtotal.toFixed(2),
          discount: quantity >= 50 ? ((subtotal - unitPrice) * quantity).toFixed(2) : '0.00',
          total: total.toFixed(2)
        },
        totals: {
          unitPrice: unitPrice.toFixed(2),
          totalPrice: total.toFixed(2),
          quantity: quantity
        }
      };
    }
  }

  // ===== LIVE PREVIEW SYSTEM =====
  class LivePreview {
    constructor() {
      this.container = null;
      this.garmentImage = null;
      this.decorationOverlays = null;
      this.currentView = 'front';
      this.isVisible = false;
      
      this.init();
    }
    
    init() {
      this.container = document.getElementById('preview-panel-v2');
      this.garmentImage = document.getElementById('garment-base-image-v2');
      this.decorationOverlays = document.getElementById('decoration-overlays-v2');
      
      this.bindEvents();
    }
    
    bindEvents() {
      // Preview toggle
      const toggleBtn = document.getElementById('toggle-preview-v2');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => this.toggle());
      }
      
      // View controls
      document.querySelectorAll('[data-view]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.switchView(e.target.dataset.view);
        });
      });
      
      // Listen for garment changes
      document.addEventListener('techpack-v2-garmentChanged', (e) => {
        this.updateGarment(e.detail);
      });
      
      // Listen for decoration changes
      document.addEventListener('techpack-v2-decorationChanged', (e) => {
        this.updateDecoration(e.detail);
      });
    }
    
    toggle() {
      this.isVisible = !this.isVisible;
      
      if (this.container) {
        this.container.style.display = this.isVisible ? 'block' : 'none';
      }
      
      const toggleBtn = document.getElementById('toggle-preview-v2');
      const toggleText = document.getElementById('preview-toggle-text-v2');
      
      if (toggleText) {
        toggleText.textContent = this.isVisible ? 'Hide Preview' : 'Show Preview';
      }
    }
    
    switchView(view) {
      this.currentView = view;
      
      // Update active control
      document.querySelectorAll('[data-view]').forEach(btn => {
        btn.classList.toggle('techpack-v2-preview-control--active', 
          btn.dataset.view === view);
      });
      
      this.updateGarmentImage();
    }
    
    updateGarment(garmentData) {
      this.updateGarmentImage();
      this.updateDecorationOverlays();
    }
    
    updateGarmentImage() {
      if (!this.garmentImage) return;
      
      // IMAGE_PLACEHOLDER: Update with actual garment images
      // This would load the appropriate garment image based on type and view
      const placeholder = document.getElementById('preview-placeholder-v2');
      if (placeholder) {
        placeholder.style.display = 'none';
      }
      
      // Show garment image (placeholder for now)
      this.garmentImage.style.display = 'block';
      this.garmentImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDIwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZjNmNGY2Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZTVlN2ViIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyNTAiIGZpbGw9InVybCgjYSkiLz48cGF0aCBkPSJNNTAgNTBMMTUwIDUwTDE3MCA3MFYyMDBIMzBWNzBMNTAgNTBaIiBzdHJva2U9IiM5Y2EzYWYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC44Ii8+PHRleHQgeD0iMTAwIiB5PSIxMjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2YjcyODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0Ij5HYXJtZW50IFByZXZpZXc8L3RleHQ+PC9zdmc+';
    }
    
    updateDecoration(decorationData) {
      if (!this.decorationOverlays) return;
      
      // Clear existing overlays
      this.decorationOverlays.innerHTML = '';
      
      if (decorationData && decorationData.placement) {
        this.createDecorationOverlay(decorationData);
      }
    }
    
    createDecorationOverlay(decoration) {
      const overlay = document.createElement('div');
      overlay.className = 'techpack-v2-decoration-overlay';
      overlay.style.cssText = `
        position: absolute;
        border: 2px dashed #059669;
        background: rgba(5, 150, 105, 0.1);
        pointer-events: none;
        z-index: 10;
      `;
      
      // Position based on placement and size
      this.positionDecorationOverlay(overlay, decoration);
      
      this.decorationOverlays.appendChild(overlay);
    }
    
    positionDecorationOverlay(overlay, decoration) {
      const { placement, width = 10, height = 8 } = decoration;
      
      // Convert cm to preview pixels (rough approximation)
      const pixelWidth = width * 3;
      const pixelHeight = height * 3;
      
      overlay.style.width = `${pixelWidth}px`;
      overlay.style.height = `${pixelHeight}px`;
      
      // Position based on placement
      switch (placement) {
        case 'front':
          overlay.style.top = '30%';
          overlay.style.left = '50%';
          overlay.style.transform = 'translateX(-50%)';
          break;
        case 'back':
          overlay.style.top = '25%';
          overlay.style.left = '50%';
          overlay.style.transform = 'translateX(-50%)';
          break;
        case 'left-sleeve':
          overlay.style.top = '20%';
          overlay.style.left = '20%';
          break;
        case 'right-sleeve':
          overlay.style.top = '20%';
          overlay.style.right = '20%';
          break;
        default:
          overlay.style.top = '30%';
          overlay.style.left = '50%';
          overlay.style.transform = 'translateX(-50%)';
      }
    }
  }

  // ===== FILE UPLOAD HANDLER =====
  class FileUploadHandler {
    constructor() {
      this.files = [];
      this.maxFiles = CONFIG.MAX_FILES;
      this.maxFileSize = CONFIG.MAX_FILE_SIZE;
      this.validTypes = CONFIG.VALID_FILE_TYPES;
      
      this.init();
    }
    
    init() {
      this.bindEvents();
      this.setupDropZone();
    }
    
    bindEvents() {
      const fileInput = document.getElementById('file-input-v2');
      const browseBtn = document.getElementById('browse-files-v2');
      const addMoreBtn = document.getElementById('add-more-files-v2');
      const clearAllBtn = document.getElementById('clear-all-files-v2');
      
      if (fileInput) {
        fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));
      }
      
      if (browseBtn) {
        browseBtn.addEventListener('click', () => fileInput?.click());
      }
      
      if (addMoreBtn) {
        addMoreBtn.addEventListener('click', () => fileInput?.click());
      }
      
      if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => this.clearAllFiles());
      }
    }
    
    setupDropZone() {
      const dropZone = document.getElementById('upload-zone-v2');
      if (!dropZone) return;
      
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, this.preventDefaults, false);
      });
      
      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
          dropZone.classList.add('techpack-v2-upload-zone--dragover');
        }, false);
      });
      
      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
          dropZone.classList.remove('techpack-v2-upload-zone--dragover');
        }, false);
      });
      
      dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        this.handleFiles(files);
      }, false);
    }
    
    preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    handleFiles(files) {
      const fileArray = Array.from(files);
      
      for (const file of fileArray) {
        if (this.files.length >= this.maxFiles) {
          this.showError(`Maximum ${this.maxFiles} files allowed`);
          break;
        }
        
        if (!this.validateFile(file)) continue;
        
        this.addFile(file);
      }
      
      this.updateUI();
    }
    
    validateFile(file) {
      // Check file size
      if (file.size > this.maxFileSize) {
        this.showError(`File "${file.name}" is too large. Maximum size is ${this.maxFileSize / 1024 / 1024}MB`);
        return false;
      }
      
      // Check file type
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      if (!this.validTypes.includes(extension)) {
        this.showError(`File "${file.name}" type is not supported`);
        return false;
      }
      
      return true;
    }
    
    addFile(file) {
      const fileObj = {
        id: this.generateFileId(),
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        category: null,
        preview: null
      };
      
      this.files.push(fileObj);
      this.generatePreview(fileObj);
      this.createFileCard(fileObj);
    }
    
    generateFileId() {
      return 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generatePreview(fileObj) {
      if (fileObj.file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          fileObj.preview = e.target.result;
          this.updateFileCard(fileObj);
        };
        reader.readAsDataURL(fileObj.file);
      }
    }
    
    createFileCard(fileObj) {
      const template = document.getElementById('file-card-template-v2');
      const grid = document.getElementById('files-grid-v2');
      
      if (!template || !grid) return;
      
      const card = template.content.cloneNode(true);
      const cardElement = card.querySelector('.techpack-v2-file-card');
      
      cardElement.dataset.fileId = fileObj.id;
      
      // Set file info
      card.querySelector('.techpack-v2-file-name').textContent = fileObj.name;
      card.querySelector('.techpack-v2-file-size').textContent = this.formatFileSize(fileObj.size);
      card.querySelector('.techpack-v2-file-type').textContent = this.getFileType(fileObj.name);
      
      // Set thumbnail
      this.setFileThumbnail(card.querySelector('.techpack-v2-file-thumbnail'), fileObj);
      
      // Bind remove button
      card.querySelector('.techpack-v2-file-remove').addEventListener('click', () => {
        this.removeFile(fileObj.id);
      });
      
      // Bind category select
      const categorySelect = card.querySelector('.techpack-v2-category-select');
      categorySelect.addEventListener('change', (e) => {
        this.updateFileCategory(fileObj.id, e.target.value);
      });
      
      grid.appendChild(card);
      
      // Show files section
      const filesSection = document.getElementById('files-section-v2');
      if (filesSection) {
        filesSection.style.display = 'block';
      }
    }
    
    setFileThumbnail(container, fileObj) {
      if (fileObj.preview) {
        container.innerHTML = `<img src="${fileObj.preview}" alt="${fileObj.name}" class="techpack-v2-file-thumbnail">`;
      } else {
        // Use file type icon
        const extension = fileObj.name.split('.').pop().toLowerCase();
        const iconTemplate = this.getFileIconTemplate(extension);
        container.innerHTML = iconTemplate;
      }
    }
    
    getFileIconTemplate(extension) {
      const iconMap = {
        'pdf': 'file-icon-pdf-v2',
        'ai': 'file-icon-ai-v2',
        'png': 'file-icon-image-v2',
        'jpg': 'file-icon-image-v2',
        'jpeg': 'file-icon-image-v2',
        'zip': 'file-icon-zip-v2'
      };
      
      const templateId = iconMap[extension] || 'file-icon-pdf-v2';
      const template = document.getElementById(templateId);
      
      return template ? template.innerHTML : '';
    }
    
    updateFileCard(fileObj) {
      const card = document.querySelector(`[data-file-id="${fileObj.id}"]`);
      if (!card) return;
      
      const thumbnail = card.querySelector('.techpack-v2-file-thumbnail');
      if (thumbnail && fileObj.preview) {
        this.setFileThumbnail(thumbnail.parentElement, fileObj);
      }
    }
    
    removeFile(fileId) {
      this.files = this.files.filter(file => file.id !== fileId);
      
      const card = document.querySelector(`[data-file-id="${fileId}"]`);
      if (card) {
        card.remove();
      }
      
      this.updateUI();
      
      // Hide files section if no files
      if (this.files.length === 0) {
        const filesSection = document.getElementById('files-section-v2');
        if (filesSection) {
          filesSection.style.display = 'none';
        }
      }
    }
    
    clearAllFiles() {
      this.files = [];
      
      const grid = document.getElementById('files-grid-v2');
      if (grid) {
        grid.innerHTML = '';
      }
      
      const filesSection = document.getElementById('files-section-v2');
      if (filesSection) {
        filesSection.style.display = 'none';
      }
      
      this.updateUI();
    }
    
    updateFileCategory(fileId, category) {
      const file = this.files.find(f => f.id === fileId);
      if (file) {
        file.category = category;
        this.updateCategorization();
        this.updateUI();
      }
    }
    
    updateCategorization() {
      const categories = ['collection-techpack', 'single-garment-techpack', 'design-reference', 'accessories-reference'];
      
      categories.forEach(category => {
        const count = this.files.filter(f => f.category === category).length;
        const badge = document.getElementById(`badge-${category}`);
        if (badge) {
          badge.textContent = count;
        }
      });
      
      // Update progress
      const categorized = this.files.filter(f => f.category).length;
      const total = this.files.length;
      const progress = total > 0 ? (categorized / total) * 100 : 0;
      
      const progressBar = document.getElementById('categorization-progress-bar-v2');
      const progressText = document.getElementById('categorized-count-v2');
      
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
      
      if (progressText) {
        progressText.textContent = `${categorized} of ${total} files categorized`;
      }
      
      // Show/hide categorization section
      const categorizationSection = document.getElementById('categorization-section-v2');
      if (categorizationSection) {
        categorizationSection.style.display = total > 0 ? 'block' : 'none';
      }
    }
    
    updateUI() {
      // Update stats
      const fileCount = document.getElementById('file-count-v2');
      const fileSize = document.getElementById('file-size-v2');
      
      if (fileCount) {
        fileCount.textContent = this.files.length;
      }
      
      if (fileSize) {
        const totalSize = this.files.reduce((sum, file) => sum + file.size, 0);
        fileSize.textContent = this.formatFileSize(totalSize);
      }
      
      this.updateCategorization();
      this.updateNavigation();
    }
    
    updateNavigation() {
      const nextBtn = document.getElementById('step-2-next-v2');
      const canContinue = this.files.length > 0 && this.files.every(f => f.category);
      
      if (nextBtn) {
        nextBtn.disabled = !canContinue;
      }
      
      const infoText = document.getElementById('form-actions-info-v2');
      if (infoText) {
        if (this.files.length === 0) {
          infoText.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" opacity="0.5"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 5v3" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="11" r="1" fill="currentColor"/></svg>Upload files to continue';
        } else if (!canContinue) {
          infoText.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" opacity="0.5"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 5v3" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="11" r="1" fill="currentColor"/></svg>Categorize all files to continue';
        } else {
          infoText.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" opacity="0.5"><path d="M8 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" fill="none"/></svg>Ready to continue';
        }
      }
    }
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
    
    getFileType(filename) {
      return filename.split('.').pop().toUpperCase();
    }
    
    showError(message) {
      console.error('File Upload Error:', message);
      // You could implement a toast notification system here
    }
  }

  // ===== GARMENT BUILDER =====
  class GarmentBuilder {
    constructor(state, pricing) {
      this.state = state;
      this.pricing = pricing;
      this.currentBuilderStep = 'base-garment';
      this.builderSteps = [
        'base-garment',
        'fit-gsm', 
        'fabric',
        'colorways',
        'sizes-quantities',
        'decoration',
        'addons'
      ];
      
      this.init();
    }
    
    init() {
      this.bindEvents();
      this.showCurrentBuilderStep();
    }
    
    bindEvents() {
      // Garment selection
      document.addEventListener('click', (e) => {
        if (e.target.closest('.techpack-v2-garment-tile')) {
          this.selectGarment(e.target.closest('.techpack-v2-garment-tile'));
        }
        
        if (e.target.closest('.techpack-v2-fit-tile')) {
          this.selectFit(e.target.closest('.techpack-v2-fit-tile'));
        }
        
        if (e.target.closest('.techpack-v2-gsm-tile')) {
          this.selectGsm(e.target.closest('.techpack-v2-gsm-tile'));
        }
        
        if (e.target.closest('.techpack-v2-fabric-tile')) {
          this.selectFabric(e.target.closest('.techpack-v2-fabric-tile'));
        }
        
        if (e.target.closest('.techpack-v2-decoration-tile')) {
          this.selectDecoration(e.target.closest('.techpack-v2-decoration-tile'));
        }
        
        if (e.target.closest('.techpack-v2-placement-tile')) {
          this.selectPlacement(e.target.closest('.techpack-v2-placement-tile'));
        }
      });
      
      // Add colorway button
      const addColorwayBtn = document.getElementById('add-colorway-v2');
      if (addColorwayBtn) {
        addColorwayBtn.addEventListener('click', () => this.addColorway());
      }
      
      // Size/decoration inputs
      document.addEventListener('input', (e) => {
        if (e.target.matches('#decoration-width-v2, #decoration-height-v2')) {
          this.updateDecorationArea();
        }
        
        if (e.target.matches('#custom-gsm-slider-v2')) {
          this.updateCustomGsm(e.target.value);
        }
      });
      
      // Add-on toggles
      document.addEventListener('change', (e) => {
        if (e.target.matches('.techpack-v2-toggle-input')) {
          this.handleAddonToggle(e.target);
        }
      });
      
      // Builder step headers (accordion style)
      document.addEventListener('click', (e) => {
        if (e.target.closest('.techpack-v2-builder-step-header')) {
          const step = e.target.closest('.techpack-v2-builder-step');
          const stepName = step.dataset.step;
          if (stepName) {
            this.showBuilderStep(stepName);
          }
        }
      });
    }
    
    selectGarment(tile) {
      const garmentType = tile.dataset.garment;
      
      // Update visual selection
      document.querySelectorAll('.techpack-v2-garment-tile').forEach(t => {
        t.classList.remove('techpack-v2-garment-tile--selected');
      });
      tile.classList.add('techpack-v2-garment-tile--selected');
      
      // Update state
      this.state.updateData('garment.baseGarment', garmentType);
      
      // Update status
      this.updateStepStatus('base-garment', 'completed', tile.querySelector('.techpack-v2-garment-tile-name').textContent);
      
      // Filter fabrics based on garment compatibility
      this.filterFabrics(garmentType);
      
      // Show next step
      this.showBuilderStep('fit-gsm');
      
      // Emit event for live preview
      document.dispatchEvent(new CustomEvent('techpack-v2-garmentChanged', {
        detail: { type: garmentType }
      }));
      
      // Update pricing
      this.updatePricing();
    }
    
    selectFit(tile) {
      const fit = tile.dataset.fit;
      
      document.querySelectorAll('.techpack-v2-fit-tile').forEach(t => {
        t.classList.remove('techpack-v2-fit-tile--selected');
      });
      tile.classList.add('techpack-v2-fit-tile--selected');
      
      this.state.updateData('garment.fit', fit);
      this.checkFitGsmComplete();
    }
    
    selectGsm(tile) {
      const gsm = tile.dataset.gsm;
      
      document.querySelectorAll('.techpack-v2-gsm-tile').forEach(t => {
        t.classList.remove('techpack-v2-gsm-tile--selected');
      });
      tile.classList.add('techpack-v2-gsm-tile--selected');
      
      if (gsm === 'custom') {
        const slider = document.getElementById('custom-gsm-slider-v2');
        this.state.updateData('garment.gsm', parseInt(slider.value));
      } else {
        this.state.updateData('garment.gsm', parseInt(gsm));
      }
      
      this.checkFitGsmComplete();
      this.updatePricing();
    }
    
    updateCustomGsm(value) {
      const valueDisplay = document.getElementById('custom-gsm-value-v2');
      if (valueDisplay) {
        valueDisplay.textContent = value;
      }
      
      const customTile = document.querySelector('[data-gsm="custom"]');
      if (customTile && customTile.classList.contains('techpack-v2-gsm-tile--selected')) {
        this.state.updateData('garment.gsm', parseInt(value));
        this.updatePricing();
      }
    }
    
    checkFitGsmComplete() {
      const fit = this.state.getData('garment.fit');
      const gsm = this.state.getData('garment.gsm');
      
      if (fit && gsm) {
        this.updateStepStatus('fit-gsm', 'completed', `${fit} fit, ${gsm} GSM`);
        this.showBuilderStep('fabric');
      }
    }
    
    selectFabric(tile) {
      const fabric = tile.dataset.fabric;
      
      document.querySelectorAll('.techpack-v2-fabric-tile').forEach(t => {
        t.classList.remove('techpack-v2-fabric-tile--selected');
      });
      tile.classList.add('techpack-v2-fabric-tile--selected');
      
      this.state.updateData('garment.fabric', fabric);
      
      const fabricName = tile.querySelector('.techpack-v2-fabric-tile-name').textContent;
      this.updateStepStatus('fabric', 'completed', fabricName);
      
      this.showBuilderStep('colorways');
      this.updatePricing();
    }
    
    filterFabrics(garmentType) {
      document.querySelectorAll('.techpack-v2-fabric-tile').forEach(tile => {
        const compatible = tile.dataset.compatible;
        const isCompatible = compatible.includes(garmentType);
        
        tile.classList.toggle('techpack-v2-fabric-tile--hidden', !isCompatible);
      });
    }
    
    addColorway() {
      const container = document.getElementById('colorways-container-v2');
      const template = document.getElementById('colorway-row-template-v2');
      
      if (!container || !template) return;
      
      const colorwayId = 'colorway_' + Date.now();
      const colorways = this.state.getData('garment.colorways') || [];
      const colorwayNum = colorways.length + 1;
      
      const colorwayRow = template.content.cloneNode(true);
      const rowElement = colorwayRow.querySelector('.techpack-v2-colorway-row');
      
      rowElement.dataset.colorwayId = colorwayId;
      rowElement.querySelector('.colorway-num').textContent = colorwayNum;
      
      // Bind events
      this.bindColorwayEvents(colorwayRow, colorwayId);
      
      container.appendChild(colorwayRow);
      
      // Add to state
      colorways.push({
        id: colorwayId,
        color: null,
        pantone: null,
        sample: false,
        quantities: {}
      });
      
      this.state.updateData('garment.colorways', colorways);
      this.updateColorwayStatus();
    }
    
    bindColorwayEvents(colorwayRow, colorwayId) {
      // Color selection
      colorwayRow.querySelectorAll('.techpack-v2-color-tile').forEach(tile => {
        tile.addEventListener('click', () => {
          this.selectColorwayColor(colorwayId, tile);
        });
      });
      
      // Remove colorway
      const removeBtn = colorwayRow.querySelector('.techpack-v2-colorway-remove');
      removeBtn.addEventListener('click', () => {
        this.removeColorway(colorwayId);
      });
      
      // Sample toggle
      const sampleToggle = colorwayRow.querySelector('.sample-toggle');
      sampleToggle.addEventListener('change', (e) => {
        this.updateColorwaySample(colorwayId, e.target.checked);
      });
    }
    
    selectColorwayColor(colorwayId, tile) {
      const color = tile.dataset.color;
      const row = document.querySelector(`[data-colorway-id="${colorwayId}"]`);
      
      if (!row) return;
      
      // Update visual selection
      row.querySelectorAll('.techpack-v2-color-tile').forEach(t => {
        t.classList.remove('techpack-v2-color-tile--selected');
      });
      tile.classList.add('techpack-v2-color-tile--selected');
      
      // Update state
      const colorways = this.state.getData('garment.colorways') || [];
      const colorway = colorways.find(c => c.id === colorwayId);
      if (colorway) {
        colorway.color = color;
        this.state.updateData('garment.colorways', colorways);
      }
      
      // Handle custom color
      if (color === 'custom') {
        this.showCustomPantonePanel(row);
      }
      
      this.updateColorwayStatus();
    }
    
    showCustomPantonePanel(row) {
      const panel = row.querySelector('.techpack-v2-custom-pantone-panel');
      if (panel) {
        panel.style.display = 'block';
        
        // Bind add button
        const addBtn = panel.querySelector('.techpack-v2-btn');
        const input = panel.querySelector('.techpack-v2-pantone-input');
        
        addBtn.addEventListener('click', () => {
          const pantoneCode = input.value.trim();
          if (pantoneCode) {
            // Update colorway with pantone code
            const colorwayId = row.dataset.colorwayId;
            const colorways = this.state.getData('garment.colorways') || [];
            const colorway = colorways.find(c => c.id === colorwayId);
            if (colorway) {
              colorway.pantone = pantoneCode;
              this.state.updateData('garment.colorways', colorways);
            }
            
            panel.style.display = 'none';
            this.updateColorwayStatus();
          }
        });
      }
    }
    
    removeColorway(colorwayId) {
      const row = document.querySelector(`[data-colorway-id="${colorwayId}"]`);
      if (row) {
        row.remove();
      }
      
      let colorways = this.state.getData('garment.colorways') || [];
      colorways = colorways.filter(c => c.id !== colorwayId);
      this.state.updateData('garment.colorways', colorways);
      
      this.updateColorwayStatus();
      this.updatePricing();
    }
    
    updateColorwaySample(colorwayId, sampleEnabled) {
      const colorways = this.state.getData('garment.colorways') || [];
      const colorway = colorways.find(c => c.id === colorwayId);
      if (colorway) {
        colorway.sample = sampleEnabled;
        this.state.updateData('garment.colorways', colorways);
      }
    }
    
    updateColorwayStatus() {
      const colorways = this.state.getData('garment.colorways') || [];
      const hasColorways = colorways.length > 0;
      const allComplete = colorways.every(c => c.color);
      
      if (hasColorways && allComplete) {
        this.updateStepStatus('colorways', 'completed', `${colorways.length} colorway${colorways.length > 1 ? 's' : ''}`);
        this.showBuilderStep('sizes-quantities');
      } else if (hasColorways) {
        this.updateStepStatus('colorways', 'pending', 'Complete colorway selection');
      }
    }
    
    selectDecoration(tile) {
      const method = tile.dataset.method;
      
      document.querySelectorAll('.techpack-v2-decoration-tile').forEach(t => {
        t.classList.remove('techpack-v2-decoration-tile--selected');
      });
      tile.classList.add('techpack-v2-decoration-tile--selected');
      
      this.state.updateData('garment.decoration.method', method);
      
      // Show placement options
      const placementSection = document.getElementById('placement-selection-v2');
      if (placementSection) {
        placementSection.style.display = 'block';
      }
      
      this.updatePricing();
    }
    
    selectPlacement(tile) {
      const placement = tile.dataset.placement;
      
      document.querySelectorAll('.techpack-v2-placement-tile').forEach(t => {
        t.classList.remove('techpack-v2-placement-tile--selected');
      });
      tile.classList.add('techpack-v2-placement-tile--selected');
      
      this.state.updateData('garment.decoration.placement', placement);
      
      // Show size inputs
      const sizeSection = document.getElementById('decoration-size-v2');
      if (sizeSection) {
        sizeSection.style.display = 'block';
      }
      
      // Show decoration details (colors/stitches)
      const detailsSection = document.getElementById('decoration-details-v2');
      if (detailsSection) {
        detailsSection.style.display = 'block';
        
        const method = this.state.getData('garment.decoration.method');
        const title = detailsSection.querySelector('#decoration-details-title-v2');
        
        if (title) {
          title.textContent = method === 'embroidery' ? 'Stitches' : 'Colors';
        }
      }
      
      this.updateDecorationArea();
      this.updatePricing();
      
      // Emit event for live preview
      document.dispatchEvent(new CustomEvent('techpack-v2-decorationChanged', {
        detail: { 
          placement,
          width: 10,
          height: 8
        }
      }));
    }
    
    updateDecorationArea() {
      const widthInput = document.getElementById('decoration-width-v2');
      const heightInput = document.getElementById('decoration-height-v2');
      const areaDisplay = document.getElementById('decoration-area-v2');
      
      if (widthInput && heightInput && areaDisplay) {
        const width = parseFloat(widthInput.value) || 0;
        const height = parseFloat(heightInput.value) || 0;
        const area = width * height;
        
        areaDisplay.textContent = area.toFixed(1);
        
        this.state.updateData('garment.decoration.width', width);
        this.state.updateData('garment.decoration.height', height);
        this.state.updateData('garment.decoration.area', area);
        
        this.updatePricing();
        
        // Update live preview
        document.dispatchEvent(new CustomEvent('techpack-v2-decorationChanged', {
          detail: { 
            placement: this.state.getData('garment.decoration.placement'),
            width,
            height
          }
        }));
      }
    }
    
    handleAddonToggle(toggle) {
      const addonTile = toggle.closest('.techpack-v2-addon-tile');
      const addon = addonTile.dataset.addon;
      const isEnabled = toggle.checked;
      
      let addons = this.state.getData('garment.addons') || [];
      
      if (isEnabled) {
        if (!addons.includes(addon)) {
          addons.push(addon);
        }
        
        // Show addon options if they exist
        const options = addonTile.querySelector('.techpack-v2-addon-tile-options');
        if (options) {
          options.style.display = 'block';
        }
      } else {
        addons = addons.filter(a => a !== addon);
        
        const options = addonTile.querySelector('.techpack-v2-addon-tile-options');
        if (options) {
          options.style.display = 'none';
        }
      }
      
      this.state.updateData('garment.addons', addons);
      this.updateAddonsStatus();
      this.updatePricing();
    }
    
    updateAddonsStatus() {
      const addons = this.state.getData('garment.addons') || [];
      if (addons.length > 0) {
        this.updateStepStatus('addons', 'completed', `${addons.length} add-on${addons.length > 1 ? 's' : ''}`);
      }
    }
    
    showBuilderStep(stepName) {
      this.currentBuilderStep = stepName;
      
      // Show/hide steps
      document.querySelectorAll('.techpack-v2-builder-step').forEach(step => {
        const isActive = step.dataset.step === stepName;
        const isCompleted = this.isStepCompleted(step.dataset.step);
        const shouldShow = isActive || isCompleted;
        
        step.style.display = shouldShow ? 'block' : 'none';
        step.classList.toggle('techpack-v2-builder-step--active', isActive);
      });
      
      this.updateNavigationState();
    }
    
    showCurrentBuilderStep() {
      this.showBuilderStep(this.currentBuilderStep);
    }
    
    isStepCompleted(stepName) {
      switch (stepName) {
        case 'base-garment':
          return !!this.state.getData('garment.baseGarment');
        case 'fit-gsm':
          return !!(this.state.getData('garment.fit') && this.state.getData('garment.gsm'));
        case 'fabric':
          return !!this.state.getData('garment.fabric');
        case 'colorways':
          const colorways = this.state.getData('garment.colorways') || [];
          return colorways.length > 0 && colorways.every(c => c.color);
        case 'sizes-quantities':
          // Check if quantities are set for each colorway
          return true; // Simplified for now
        case 'decoration':
        case 'addons':
          return true; // Optional steps
        default:
          return false;
      }
    }
    
    updateStepStatus(stepName, status, text) {
      const statusElement = document.getElementById(`${stepName}-status-v2`);
      if (!statusElement) return;
      
      statusElement.className = `techpack-v2-status-${status}`;
      statusElement.textContent = text;
    }
    
    updateNavigationState() {
      const nextBtn = document.getElementById('step-3-next-v2');
      const canContinue = this.canContinueToReview();
      
      if (nextBtn) {
        nextBtn.disabled = !canContinue;
      }
      
      const infoText = document.getElementById('form-actions-info-step-3-v2');
      if (infoText) {
        if (canContinue) {
          infoText.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" opacity="0.5"><path d="M8 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" fill="none"/></svg>Ready to review';
        } else {
          infoText.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" opacity="0.5"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 5v3" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="11" r="1" fill="currentColor"/></svg>Complete garment configuration to continue';
        }
      }
    }
    
    canContinueToReview() {
      return this.isStepCompleted('base-garment') && 
             this.isStepCompleted('fit-gsm') && 
             this.isStepCompleted('fabric') && 
             this.isStepCompleted('colorways');
    }
    
    updatePricing() {
      const garment = this.state.getData('garment');
      if (!garment.baseGarment) return;
      
      // Calculate base price
      const basePrice = PricingEngine.calcBase(
        garment.baseGarment,
        garment.gsm,
        garment.fabric
      );
      
      // Calculate decoration price
      let decorationPrice = 0;
      if (garment.decoration && garment.decoration.method && garment.decoration.area) {
        decorationPrice = PricingEngine.calcDecoration(garment.decoration.method, {
          areaCm2: garment.decoration.area,
          colors: garment.decoration.colors || 1,
          stitches: garment.decoration.stitches || 1000
        });
      }
      
      // Calculate add-ons price
      const addonsPrice = PricingEngine.calcAddons(garment.addons || []);
      
      // Calculate totals
      const totals = PricingEngine.calcTotals({
        basePrice,
        decorationPrice,
        addonsPrice,
        quantity: 1 // Will be updated when quantities are set
      });
      
      // Update pricing display
      this.updatePricingDisplay(totals);
      
      // Update state
      this.state.updateData('pricing', {
        base: basePrice,
        decoration: decorationPrice,
        addons: addonsPrice,
        total: totals.totals.totalPrice
      });
    }
    
    updatePricingDisplay(totals) {
      const totalPriceEl = document.getElementById('total-price-v2');
      const basePriceEl = document.getElementById('base-price-v2');
      const decorationPriceEl = document.getElementById('decoration-price-v2');
      const addonsPriceEl = document.getElementById('addons-price-v2');
      
      if (totalPriceEl) totalPriceEl.textContent = `€${totals.totals.totalPrice}`;
      if (basePriceEl) basePriceEl.textContent = `€${totals.itemized.basePrice}`;
      if (decorationPriceEl) decorationPriceEl.textContent = `€${totals.itemized.decorationPrice}`;
      if (addonsPriceEl) addonsPriceEl.textContent = `€${totals.itemized.addonsPrice}`;
    }
  }

  // ===== MAIN APPLICATION =====
  class TechPackV2App {
    constructor() {
      this.state = new TechPackV2State();
      this.livePreview = new LivePreview();
      this.fileUpload = new FileUploadHandler();
      this.garmentBuilder = new GarmentBuilder(this.state, PricingEngine);
      
      this.currentStep = 0;
      this.totalSteps = 4;
      
      this.init();
    }
    
    init() {
      this.bindGlobalEvents();
      this.initializeUI();
      this.showStep(this.state.currentStep);
      
      console.log('TechPack v2 Application Initialized');
    }
    
    bindGlobalEvents() {
      // Step navigation
      document.addEventListener('click', (e) => {
        // Back buttons
        if (e.target.matches('#step-1-back-v2, #step-2-back-v2, #step-3-back-v2, #step-4-back-v2')) {
          this.prevStep();
        }
        
        // Next buttons
        if (e.target.matches('#step-1-next-v2, #step-2-next-v2, #step-3-next-v2')) {
          this.nextStep();
        }
        
        // Submit button
        if (e.target.matches('#step-4-submit-v2')) {
          this.submitTechPack();
        }
        
        // Export JSON button
        if (e.target.matches('#export-json-v2')) {
          this.exportJSON();
        }
        
        // Modal controls
        if (e.target.matches('#open-client-modal-v2')) {
          this.showClientModal();
        }
        
        if (e.target.matches('#close-client-modal-v2, #close-submission-modal-v2, #close-success-modal-v2')) {
          this.closeModal(e.target.closest('.techpack-v2-modal'));
        }
        
        // Client registration options
        if (e.target.matches('#registration-yes-btn-v2, #registration-no-btn-v2')) {
          this.selectClientRegistration(e.target.dataset.registration);
        }
        
        // Submission type selection
        if (e.target.matches('#quotation-btn-v2, #sample-btn-v2, #bulk-btn-v2')) {
          this.selectSubmissionType(e.target.dataset.submissionType);
        }
      });
      
      // Form validation
      document.addEventListener('input', this.debounce((e) => {
        if (e.target.matches('.techpack-v2-form-input, .techpack-v2-form-textarea')) {
          this.validateField(e.target);
        }
      }, CONFIG.DEBOUNCE_DELAY));
      
      // Auto-save
      document.addEventListener('techpack-v2-dataChanged', () => {
        this.autoSave();
      });
    }
    
    initializeUI() {
      // Initialize country dropdown
      this.initCountryDropdown();
      
      // Initialize production type handlers
      this.initProductionTypes();
      
      // Set up form validation
      this.initFormValidation();
    }
    
    // ===== STEP NAVIGATION =====
    showStep(stepNum) {
      this.currentStep = stepNum;
      this.state.currentStep = stepNum;
      this.state.saveToStorage();
      
      // Hide all steps
      document.querySelectorAll('.techpack-v2-step').forEach(step => {
        step.style.display = 'none';
      });
      
      // Show current step
      const currentStepEl = document.getElementById(`techpack-v2-step-${stepNum}`);
      if (currentStepEl) {
        currentStepEl.style.display = 'block';
      }
      
      // Update progress
      this.updateProgress();
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    nextStep() {
      if (!this.validateCurrentStep()) return;
      
      if (this.currentStep < this.totalSteps) {
        this.showStep(this.currentStep + 1);
      }
    }
    
    prevStep() {
      if (this.currentStep > 0) {
        this.showStep(this.currentStep - 1);
      }
    }
    
    updateProgress() {
      const progressFill = document.querySelector('.techpack-v2-progress-fill');
      const progressSteps = document.querySelectorAll('.techpack-v2-progress-step');
      
      const progress = (this.currentStep / this.totalSteps) * 100;
      
      if (progressFill) {
        progressFill.style.width = `${progress}%`;
      }
      
      progressSteps.forEach((step, index) => {
        const circle = step.querySelector('.techpack-v2-progress-step-circle');
        
        if (index < this.currentStep) {
          circle.classList.add('techpack-v2-progress-step-circle--completed');
          circle.classList.remove('techpack-v2-progress-step-circle--active');
          circle.textContent = '✓';
        } else if (index === this.currentStep) {
          circle.classList.add('techpack-v2-progress-step-circle--active');
          circle.classList.remove('techpack-v2-progress-step-circle--completed');
          circle.textContent = index + 1;
        } else {
          circle.classList.remove('techpack-v2-progress-step-circle--active', 'techpack-v2-progress-step-circle--completed');
          circle.textContent = index + 1;
        }
      });
    }
    
    validateCurrentStep() {
      switch (this.currentStep) {
        case 1:
          return this.validateClientInfo();
        case 2:
          return this.validateFileUpload();
        case 3:
          return this.validateGarmentSpecs();
        case 4:
          return true;
        default:
          return true;
      }
    }
    
    validateClientInfo() {
      const requiredFields = ['client-name-v2', 'company-name-v2', 'email-v2', 'country-v2'];
      let isValid = true;
      
      requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
          this.showFieldError(field, 'This field is required');
          isValid = false;
        }
      });
      
      // Check production type
      const productionType = document.querySelector('input[name="productionType"]:checked');
      if (!productionType) {
        isValid = false;
        // Show error for production type
      }
      
      return isValid;
    }
    
    validateFileUpload() {
      return this.fileUpload.files.length > 0 && 
             this.fileUpload.files.every(f => f.category);
    }
    
    validateGarmentSpecs() {
      return this.garmentBuilder.canContinueToReview();
    }
    
    validateField(field) {
      const value = field.value.trim();
      const fieldType = field.dataset.validate;
      
      this.clearFieldError(field);
      
      if (field.required && !value) {
        this.showFieldError(field, 'This field is required');
        return false;
      }
      
      if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          this.showFieldError(field, 'Please enter a valid email address');
          return false;
        }
      }
      
      return true;
    }
    
    showFieldError(field, message) {
      const errorEl = field.parentElement.querySelector('.techpack-v2-form-error');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
      }
      
      field.classList.add('techpack-v2-form-input--error');
    }
    
    clearFieldError(field) {
      const errorEl = field.parentElement.querySelector('.techpack-v2-form-error');
      if (errorEl) {
        errorEl.style.display = 'none';
      }
      
      field.classList.remove('techpack-v2-form-input--error');
    }
    
    // ===== MODALS =====
    showClientModal() {
      const modal = document.getElementById('client-verification-modal-v2');
      if (modal) {
        modal.style.display = 'flex';
        
        // Focus trap
        const focusableElements = modal.querySelectorAll('button, input, select, textarea');
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    }
    
    closeModal(modal) {
      if (modal) {
        modal.style.display = 'none';
      }
    }
    
    selectClientRegistration(registrationType) {
      this.state.updateData('clientInfo.registrationType', registrationType);
      
      // Show/hide warning
      const warning = document.getElementById('registration-warning-v2');
      if (warning) {
        warning.style.display = registrationType === 'yes' ? 'block' : 'none';
      }
      
      // Continue to submission type selection
      setTimeout(() => {
        this.closeModal(document.getElementById('client-verification-modal-v2'));
        this.showSubmissionTypeModal();
      }, 300);
    }
    
    showSubmissionTypeModal() {
      const modal = document.getElementById('submission-type-modal-v2');
      if (modal) {
        modal.style.display = 'flex';
        
        // Show registration notice if registered client
        const registrationType = this.state.getData('clientInfo.registrationType');
        const notice = document.getElementById('registration-notice-v2');
        if (notice) {
          notice.style.display = registrationType === 'yes' ? 'block' : 'none';
        }
      }
    }
    
    selectSubmissionType(submissionType) {
      this.state.updateData('clientInfo.submissionType', submissionType);
      
      this.closeModal(document.getElementById('submission-type-modal-v2'));
      this.showStep(1);
    }
    
    // ===== FORM HELPERS =====
    initCountryDropdown() {
      // Simplified country list - you would use a complete list in production
      const countries = [
        'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 
        'Italy', 'Spain', 'Netherlands', 'Australia', 'Other'
      ];
      
      const dropdown = document.getElementById('country-dropdown-v2');
      const input = document.getElementById('country-v2');
      const toggle = document.getElementById('country-toggle-v2');
      
      if (!dropdown || !input || !toggle) return;
      
      // Populate dropdown
      countries.forEach(country => {
        const option = document.createElement('div');
        option.className = 'techpack-v2-country-option';
        option.textContent = country;
        option.addEventListener('click', () => {
          input.value = country;
          dropdown.style.display = 'none';
          this.validateField(input);
        });
        dropdown.appendChild(option);
      });
      
      // Toggle dropdown
      toggle.addEventListener('click', () => {
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
      });
      
      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.techpack-v2-country-selector')) {
          dropdown.style.display = 'none';
        }
      });
    }
    
    initProductionTypes() {
      const productionRadios = document.querySelectorAll('input[name="productionType"]');
      
      productionRadios.forEach(radio => {
        radio.addEventListener('change', () => {
          this.state.updateData('clientInfo.productionType', radio.value);
        });
      });
    }
    
    initFormValidation() {
      // Set up real-time validation for all form fields
      document.querySelectorAll('.techpack-v2-form-input, .techpack-v2-form-textarea').forEach(field => {
        field.addEventListener('blur', () => {
          this.validateField(field);
        });
        
        field.addEventListener('input', () => {
          this.clearFieldError(field);
        });
      });
    }
    
    // ===== DATA COLLECTION =====
    getFormData() {
      const data = {
        timestamp: new Date().toISOString(),
        clientInfo: this.collectClientInfo(),
        files: this.fileUpload.files.map(f => ({
          name: f.name,
          size: f.size,
          type: f.type,
          category: f.category
        })),
        garment: this.state.getData('garment'),
        pricing: this.state.getData('pricing'),
        metadata: {
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          submissionId: this.generateSubmissionId()
        }
      };
      
      return data;
    }
    
    collectClientInfo() {
      return {
        clientName: this.getFieldValue('client-name-v2'),
        companyName: this.getFieldValue('company-name-v2'),
        email: this.getFieldValue('email-v2'),
        phone: this.getFieldValue('phone-v2'),
        country: this.getFieldValue('country-v2'),
        vatEin: this.getFieldValue('vat-ein-v2'),
        productionType: this.getFieldValue('input[name="productionType"]:checked'),
        notes: this.getFieldValue('notes-v2'),
        registrationType: this.state.getData('clientInfo.registrationType'),
        submissionType: this.state.getData('clientInfo.submissionType')
      };
    }
    
    getFieldValue(selector) {
      const field = document.querySelector(selector) || document.getElementById(selector);
      return field ? field.value.trim() : '';
    }
    
    generateSubmissionId() {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substr(2, 9);
      return `TP2-${timestamp}-${random}`.toUpperCase();
    }
    
    // ===== SUBMISSION =====
    async submitTechPack() {
      const loadingOverlay = document.getElementById('loading-overlay-v2');
      const submitBtn = document.getElementById('step-4-submit-v2');
      
      try {
        // Show loading
        if (loadingOverlay) loadingOverlay.style.display = 'flex';
        if (submitBtn) submitBtn.disabled = true;
        
        const formData = this.getFormData();
        
        // Update loading status
        this.updateLoadingStatus('Preparing submission data...');
        
        // Upload files first
        await this.uploadFiles();
        
        this.updateLoadingStatus('Sending submission...');
        
        // Submit data
        await this.sendSubmission(formData);
        
        // Show success
        this.showSuccessModal(formData);
        
      } catch (error) {
        console.error('Submission error:', error);
        this.showError('Failed to submit TechPack. Please try again.');
      } finally {
        // Hide loading
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
      }
    }
    
    async uploadFiles() {
      if (this.fileUpload.files.length === 0) return;
      
      // Upload files to Google Drive via Apps Script
      // This is a placeholder - implement actual upload logic
      this.updateLoadingStatus('Uploading files...');
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    async sendSubmission(data) {
      // Send to Shopify contact form as fallback
      const form = document.getElementById('fallback-contact-form-v2');
      
      if (form) {
        document.getElementById('fallback-name-v2').value = data.clientInfo.clientName;
        document.getElementById('fallback-email-v2').value = data.clientInfo.email;
        document.getElementById('fallback-body-v2').value = JSON.stringify(data, null, 2);
        
        form.submit();
      }
    }
    
    updateLoadingStatus(status) {
      const statusEl = document.getElementById('loading-status-text-v2');
      if (statusEl) {
        statusEl.textContent = status;
      }
    }
    
    showSuccessModal(data) {
      const modal = document.getElementById('success-modal-v2');
      if (!modal) return;
      
      // Populate success details
      const emailEl = document.getElementById('success-email-v2');
      const referenceEl = document.getElementById('submission-reference-v2');
      const submissionTypeEl = document.getElementById('submission-type-v2');
      const totalItemsEl = document.getElementById('total-items-v2');
      
      if (emailEl) emailEl.textContent = data.clientInfo.email;
      if (referenceEl) referenceEl.textContent = data.metadata.submissionId;
      if (submissionTypeEl) submissionTypeEl.textContent = data.clientInfo.submissionType || 'TechPack Submission';
      if (totalItemsEl) totalItemsEl.textContent = `${this.fileUpload.files.length} files, 1 garment`;
      
      modal.style.display = 'flex';
      
      // Bind reset button
      const resetBtn = document.getElementById('close-and-reset-v2');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.resetApplication();
        });
      }
    }
    
    resetApplication() {
      // Clear state
      this.state.clearStorage();
      
      // Reset UI
      this.currentStep = 0;
      this.showStep(0);
      
      // Clear file upload
      this.fileUpload.clearAllFiles();
      
      // Reset forms
      document.querySelectorAll('.techpack-v2-form-input, .techpack-v2-form-textarea').forEach(field => {
        field.value = '';
        this.clearFieldError(field);
      });
      
      // Close modal
      this.closeModal(document.getElementById('success-modal-v2'));
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    showError(message) {
      // Simple error display - you could enhance this with a toast system
      alert(message);
    }
    
    // ===== JSON EXPORT =====
    exportJSON() {
      try {
        // Create comprehensive export data
        const exportData = {
          exportInfo: {
            version: '2.0.0',
            exportDate: new Date().toISOString(),
            exportType: 'TechPack v2 Specification',
            submissionId: `TECHPACK-V2-${Date.now()}`
          },
          clientInfo: this.state.data.clientInfo,
          files: this.fileUpload.files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            category: file.category || 'uncategorized',
            lastModified: file.lastModified
          })),
          garmentSpecification: this.state.data.garment,
          pricing: this.state.data.pricing,
          metadata: {
            totalFiles: this.fileUpload.files.length,
            hasDecoration: !!this.state.data.garment.decoration,
            totalAddons: this.state.data.garment.addons?.length || 0,
            browserInfo: navigator.userAgent,
            sessionId: localStorage.getItem('techpack-v2-session') || 'unknown'
          }
        };
        
        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
        const filename = `techpack-v2-export-${timestamp}.json`;
        
        // Create and download blob
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
          type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Show success notification
        this.showNotification('TechPack v2 data exported successfully!', 'success');
        
      } catch (error) {
        console.error('Export failed:', error);
        this.showNotification('Failed to export TechPack data. Please try again.', 'error');
      }
    }
    
    // ===== NOTIFICATION SYSTEM =====
    showNotification(message, type = 'info') {
      // Create notification element
      const notification = document.createElement('div');
      notification.className = `techpack-v2-notification techpack-v2-notification--${type}`;
      notification.innerHTML = `
        <div class="techpack-v2-notification-content">
          <svg class="techpack-v2-notification-icon" width="20" height="20" viewBox="0 0 20 20">
            ${type === 'success' ? 
              '<path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" fill="currentColor"/>' : 
              '<path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-5a1 1 0 100 2 1 1 0 000-2z" fill="currentColor"/>'
            }
          </svg>
          <span class="techpack-v2-notification-message">${message}</span>
        </div>
        <button class="techpack-v2-notification-close" type="button">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M12 4L4 12m0-8l8 8" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </button>
      `;
      
      // Add to DOM
      document.body.appendChild(notification);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 5000);
      
      // Manual close handler
      const closeBtn = notification.querySelector('.techpack-v2-notification-close');
      closeBtn.addEventListener('click', () => notification.remove());
    }
    
    // ===== UTILITY FUNCTIONS =====
    debounce(func, delay) {
      let timeoutId;
      return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    }
    
    autoSave() {
      // Auto-save is handled by the state management
      console.log('Auto-saved TechPack v2 data');
    }
  }

  // ===== INITIALIZATION =====
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    window.TechPackV2 = new TechPackV2App();
  });

  // ===== EXPORT FOR TESTING =====
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      TechPackV2App,
      PricingEngine,
      PRICING,
      CONFIG
    };
  }

})();