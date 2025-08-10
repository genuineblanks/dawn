(function() {
  'use strict';

  // Enhanced Configuration
  const CONFIG = {
    MIN_ORDER_QUANTITY_SINGLE_COLORWAY: 30, // For "Our Blanks" with 1 colorway
    MIN_ORDER_QUANTITY_MULTIPLE_COLORWAY: 20, // For "Our Blanks" with 2+ colorways per colorway
    MIN_ORDER_QUANTITY_CUSTOM: 75, // For "Custom Production" (unchanged)
    MIN_COLORWAY_QUANTITY: 50, // Legacy - kept for compatibility
    MAX_FILES: 10,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    VALID_FILE_TYPES: ['.pdf', '.ai', '.png', '.jpg', '.jpeg', '.zip'],
    ANIMATION_DURATION: 400,
    DEBOUNCE_DELAY: 300,
    MIN_DELIVERY_WEEKS: 6,
    
    // Fabric Type Mapping Configuration
    FABRIC_TYPE_MAPPING: {
      // Heavy Garments - Sweatshirts, Hoodies, Sweatpants, Shorts
      'Zip-Up Hoodie': [
        'Brushed Fleece 100% Organic Cotton',
        'French Terry 100% Organic Cotton',
        '80% Cotton 20% Polyester Blend',
        '70% Cotton 30% Polyester Blend',
        '50% Cotton 50% Polyester Blend',
        '100% Polyester'
      ],
      'Hoodie': [
        'Brushed Fleece 100% Organic Cotton',
        'French Terry 100% Organic Cotton',
        '80% Cotton 20% Polyester Blend',
        '70% Cotton 30% Polyester Blend',
        '50% Cotton 50% Polyester Blend',
        '100% Polyester'
      ],
      'Sweatshirt': [
        'Brushed Fleece 100% Organic Cotton',
        'French Terry 100% Organic Cotton',
        '80% Cotton 20% Polyester Blend',
        '70% Cotton 30% Polyester Blend',
        '50% Cotton 50% Polyester Blend',
        '100% Polyester'
      ],
      'Sweatpants': [
        'Brushed Fleece 100% Organic Cotton',
        'French Terry 100% Organic Cotton',
        '80% Cotton 20% Polyester Blend',
        '70% Cotton 30% Polyester Blend',
        '50% Cotton 50% Polyester Blend',
        '100% Polyester'
      ],
      'Shorts': [
        'Brushed Fleece 100% Organic Cotton',
        'French Terry 100% Organic Cotton',
        '80% Cotton 20% Polyester Blend',
        '70% Cotton 30% Polyester Blend',
        '50% Cotton 50% Polyester Blend',
        '100% Polyester'
      ],
      
      // Light Garments - T-Shirts and Long Sleeves
      'T-Shirt': [
        '100% Organic Cotton Jersey',
        '80% Cotton 20% Polyester Jersey',
        '50% Cotton 50% Polyester Jersey',
        '100% Polyester Jersey',
        '100% Cotton & Elastan',
        'Recycled Polyester'
      ],
      'Long Sleeve T-Shirt': [
        '100% Organic Cotton Jersey',
        '80% Cotton 20% Polyester Jersey',
        '50% Cotton 50% Polyester Jersey',
        '100% Polyester Jersey',
        '100% Cotton & Elastan',
        'Recycled Polyester'
      ],
      
      // Shirts - Woven and structured fabrics
      'Shirt': [
        '100% Cotton Twill',
        '100% Cotton Canvas',
        '100% Linen',
        '55% Linen / 45% Cotton',
        '100% Viscose',
        '100% Tencel (Lyocell)',
        '100% Cotton Flannel',
        '100% Cotton Corduroy',
        '65% Polyester / 35% Cotton Poplin',
        '100% Polyester Microfiber'
      ],
      
      // Polo Shirts
      'Polo Shirt': [
        'Cotton Piqué',
        'Merino Wool',
        'Cotton Jersey',
        'Cotton Polyester',
        'Cotton Elastan',
        '100% Polyester',
        'Recycled Polyester'
      ],
      
      // Tank Tops
      'Tank Top': [
        '100% Cotton Jersey',
        '100% Cotton Waffle Knit',
        '100% Cotton 2x2 Rib Knit',
        '100% Cotton Slub Jersey',
        '100% Cotton Lightweight French Terry',
        '95% Cotton / 5% Elastane Jersey',
        '50% Cotton / 50% Polyester Jersey',
        '100% Polyester Mesh',
        '65% Polyester / 35% Cotton Piqué Knit'
      ],
      
      // Other/Default Garments - Keep original options for hats, beanies, etc.
      'Hat/Cap': [
        'Canvas',
        'Cotton/Polyester Blend',
        '100% Cotton',
        '100% Polyester',
        'Custom Fabric (Specify in Notes)'
      ],
      'Beanie': [
        'Fleece 100% Organic Cotton',
        'Cotton/Polyester Blend',
        '100% Cotton',
        '100% Polyester',
        'Custom Fabric (Specify in Notes)'
      ],
      'Other': [
        'Custom Fabric (Specify in Notes)',
        '100% Organic Cotton Jersey',
        'Cotton/Polyester Blend',
        '100% Polyester',
        'Canvas'
      ]
    },
    
    // Security Configuration
    CLIENT_SECRET: 'genuineblanks-techpack-secret-2025', // Security key for HMAC signatures
    WEBHOOK_URL: 'https://genuineblanks-techpack-upload.vercel.app/api/techpack-proxy', // Vercel API endpoint
    SUBMISSION_COOLDOWN: 30000, // 30 seconds between submissions
    TIMESTAMP_WINDOW: 300000, // 5 minutes for timestamp validation
    
    // Google Drive Configuration
    GOOGLE_DRIVE_WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbzXaKCGuTdupw-ZGjeijbuINIvEIn1xSOYl_9mtThUuUBbVGU1z7ThCcMffKN48FTJVXA/exec', // Google Apps Script Web App URL
    UPLOAD_TIMEOUT: 120000 // 2 minutes timeout for file uploads
  };

  // Premium Loading Overlay System
  const LoadingOverlay = {
    overlay: null,
    messages: [
      'Processing your TechPack submission...',
      'Uploading files to secure cloud storage...',
      'Finalizing your garment specifications...',
      'Almost ready - preparing your submission...'
    ],
    currentMessageIndex: 0,
    messageInterval: null,

    create() {
      if (this.overlay) return;

      this.overlay = document.createElement('div');
      this.overlay.className = 'techpack-loading-overlay';
      this.overlay.innerHTML = `
        <div class="techpack-loading-container">
          <div class="techpack-loading-brand">
            <div class="techpack-loading-logo">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
                <path d="M24 4v20l16-8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <div class="techpack-loading-spinner"></div>
            </div>
            <h3 class="techpack-loading-title">GenuineBlanks</h3>
            <p class="techpack-loading-subtitle">Premium Garment Manufacturing</p>
          </div>
          
          <div class="techpack-loading-content">
            <div class="techpack-loading-progress">
              <div class="techpack-loading-progress-bar">
                <div class="techpack-loading-progress-fill"></div>
              </div>
            </div>
            
            <p class="techpack-loading-message">${this.messages[0]}</p>
            
            <div class="techpack-loading-files">
              <div class="techpack-loading-files-list"></div>
            </div>
          </div>
          
          <div class="techpack-loading-footer">
            <p>Please do not close this window</p>
          </div>
        </div>
      `;

      // Add CSS styles
      const style = document.createElement('style');
      style.textContent = `
        .techpack-loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(5px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: techpackFadeIn 0.3s ease-out;
        }
        
        .techpack-loading-container {
          background: white;
          border-radius: 16px;
          padding: 40px;
          max-width: 480px;
          width: 90%;
          text-align: center;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          animation: techpackSlideUp 0.4s ease-out;
        }
        
        .techpack-loading-brand {
          margin-bottom: 32px;
        }
        
        .techpack-loading-logo {
          position: relative;
          display: inline-block;
          margin-bottom: 16px;
        }
        
        .techpack-loading-logo svg {
          color: #2563eb;
        }
        
        .techpack-loading-spinner {
          position: absolute;
          top: 0;
          left: 0;
          width: 48px;
          height: 48px;
          border: 2px solid transparent;
          border-top: 2px solid #2563eb;
          border-radius: 50%;
          animation: techpackSpin 1s linear infinite;
        }
        
        .techpack-loading-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
          letter-spacing: -0.025em;
        }
        
        .techpack-loading-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          font-weight: 500;
        }
        
        .techpack-loading-content {
          margin-bottom: 24px;
        }
        
        .techpack-loading-progress {
          margin-bottom: 20px;
        }
        
        .techpack-loading-progress-bar {
          width: 100%;
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }
        
        .techpack-loading-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #2563eb, #1d4ed8);
          border-radius: 2px;
          width: 0%;
          transition: width 0.5s ease-out;
          position: relative;
        }
        
        .techpack-loading-progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 20px;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3));
          animation: techpackShimmer 1.5s infinite;
        }
        
        .techpack-loading-message {
          font-size: 16px;
          color: #374151;
          margin: 0;
          font-weight: 500;
          min-height: 24px;
          animation: techpackPulse 2s ease-in-out infinite;
        }
        
        .techpack-loading-files {
          margin-top: 16px;
        }
        
        .techpack-loading-files-list {
          text-align: left;
          max-height: 120px;
          overflow-y: auto;
        }
        
        .techpack-loading-file {
          display: flex;
          align-items: center;
          padding: 8px 0;
          font-size: 14px;
          color: #6b7280;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .techpack-loading-file:last-child {
          border-bottom: none;
        }
        
        .techpack-loading-file-icon {
          width: 16px;
          height: 16px;
          margin-right: 8px;
          color: #10b981;
        }
        
        .techpack-loading-footer {
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
        
        .techpack-loading-footer p {
          font-size: 12px;
          color: #9ca3af;
          margin: 0;
        }
        
        @keyframes techpackFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes techpackSlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes techpackSpin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes techpackPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes techpackShimmer {
          0% { transform: translateX(-20px); }
          100% { transform: translateX(100px); }
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(this.overlay);
    },

    show() {
      this.create();
      this.overlay.style.display = 'flex';
      this.currentMessageIndex = 0;
      this.updateMessage();
      this.startMessageRotation();
      document.body.style.overflow = 'hidden';
    },

    hide() {
      if (this.overlay) {
        this.stopMessageRotation();
        this.overlay.style.display = 'none';
        document.body.style.overflow = '';
      }
    },

    updateProgress(percentage) {
      if (!this.overlay) return;
      const progressFill = this.overlay.querySelector('.techpack-loading-progress-fill');
      if (progressFill) {
        progressFill.style.width = `${percentage}%`;
      }
    },

    updateMessage(customMessage = null) {
      if (!this.overlay) return;
      const messageEl = this.overlay.querySelector('.techpack-loading-message');
      if (messageEl) {
        messageEl.textContent = customMessage || this.messages[this.currentMessageIndex];
      }
    },

    startMessageRotation() {
      this.stopMessageRotation();
      this.messageInterval = setInterval(() => {
        this.currentMessageIndex = (this.currentMessageIndex + 1) % this.messages.length;
        this.updateMessage();
      }, 3000);
    },

    stopMessageRotation() {
      if (this.messageInterval) {
        clearInterval(this.messageInterval);
        this.messageInterval = null;
      }
    },

    addFileStatus(fileName, status = 'uploading') {
      if (!this.overlay) return;
      const filesList = this.overlay.querySelector('.techpack-loading-files-list');
      if (!filesList) return;

      const existingFile = filesList.querySelector(`[data-filename="${fileName}"]`);
      if (existingFile) {
        const icon = existingFile.querySelector('.techpack-loading-file-icon');
        if (status === 'completed') {
          icon.innerHTML = `
            <svg fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
          `;
          icon.style.color = '#10b981';
        }
        return;
      }

      const fileEl = document.createElement('div');
      fileEl.className = 'techpack-loading-file';
      fileEl.setAttribute('data-filename', fileName);
      fileEl.innerHTML = `
        <div class="techpack-loading-file-icon">
          ${status === 'completed' ? `
            <svg fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
          ` : `
            <svg fill="currentColor" viewBox="0 0 16 16">
              <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
            </svg>
          `}
        </div>
        <span>${fileName}</span>
      `;
      filesList.appendChild(fileEl);
    }
  };

  // Security & Webhook Utilities
  const SecurityUtils = {
    // Generate HMAC signature for payload authentication
    generateHMAC: function(payload, timestamp) {
      const message = JSON.stringify(payload) + timestamp.toString();
      return CryptoJS.HmacSHA256(message, CONFIG.CLIENT_SECRET).toString();
    },
    
    // Generate unique submission ID
    generateSubmissionId: function() {
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substr(2, 9);
      return `TP-${timestamp}-${randomId}`;
    },
    
    // Rate limiting check
    canSubmit: function() {
      const lastSubmission = window.techpackLastSubmission || 0;
      const now = Date.now();
      return (now - lastSubmission) >= CONFIG.SUBMISSION_COOLDOWN;
    },
    
    // Update last submission time
    updateSubmissionTime: function() {
      window.techpackLastSubmission = Date.now();
    },
    
    // Format file size for display
    formatFileSize: function(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  };

  // Google Drive Upload Utilities
  const GoogleDriveUtils = {
    // Convert file to base64 for upload
    fileToBase64: function(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          // Remove the data:mime/type;base64, prefix
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = error => reject(error);
      });
    },

    // Upload file to Google Drive via Apps Script Web App
    uploadFile: async function(file, onProgress = null) {
      try {
        if (!CONFIG.GOOGLE_DRIVE_WEB_APP_URL || CONFIG.GOOGLE_DRIVE_WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
          throw new Error('Google Drive Web App URL not configured. Please update CONFIG.GOOGLE_DRIVE_WEB_APP_URL');
        }

        debugSystem.log('📤 Starting Google Drive upload', { fileName: file.name });
        
        if (onProgress) onProgress(10, 'Converting file...');
        
        // Convert file to base64
        const base64Data = await GoogleDriveUtils.fileToBase64(file);
        
        if (onProgress) onProgress(30, 'Uploading to Google Drive...');

        // Get client information for folder organization
        const companyName = document.getElementById('company-name')?.value || 'Unknown Company';
        const clientName = companyName; // Use company name as client name for folder organization

        // Prepare form data for Google Apps Script
        const formData = new FormData();
        formData.append('fileData', base64Data);
        formData.append('fileName', file.name);
        formData.append('mimeType', file.type);
        formData.append('clientName', clientName);
        formData.append('companyName', companyName);

        // Upload to Google Drive via Apps Script
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.UPLOAD_TIMEOUT);

        const response = await fetch(CONFIG.GOOGLE_DRIVE_WEB_APP_URL, {
          method: 'POST',
          body: formData,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }

        if (onProgress) onProgress(80, 'Processing response...');

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Upload failed');
        }

        if (onProgress) onProgress(100, 'Upload complete!');

        debugSystem.log('✅ Google Drive upload successful', { 
          fileName: file.name, 
          fileId: result.fileId,
          fileUrl: result.fileUrl 
        });

        return {
          success: true,
          fileId: result.fileId,
          fileName: result.fileName,
          fileUrl: result.fileUrl,
          downloadUrl: result.downloadUrl,
          folderId: result.folderId,
          folderName: result.folderName,
          folderPath: result.folderPath,
          clientName: result.clientName
        };

      } catch (error) {
        debugSystem.log('❌ Google Drive upload failed', { 
          fileName: file.name, 
          error: error.message 
        }, 'error');

        return {
          success: false,
          error: error.message
        };
      }
    },

    // Update UI with upload progress
    updateFileProgress: function(fileId, progress, status) {
      const fileItem = document.querySelector(`[data-file-id="${fileId}"]`);
      if (!fileItem) return;

      const progressContainer = fileItem.querySelector('.techpack-file__progress');
      const progressFill = fileItem.querySelector('.techpack-file__progress-fill');
      const fileName = fileItem.querySelector('.techpack-file__name');

      if (progressContainer && progressFill) {
        progressContainer.style.display = 'block';
        progressFill.style.width = `${progress}%`;
        
        // Update file name to show status
        if (fileName) {
          const originalName = fileName.dataset.originalName || fileName.textContent;
          if (!fileName.dataset.originalName) {
            fileName.dataset.originalName = originalName;
          }
          fileName.textContent = `${originalName} - ${status}`;
        }

        // Hide progress when complete
        if (progress >= 100) {
          setTimeout(() => {
            progressContainer.style.display = 'none';
            if (fileName) {
              fileName.textContent = fileName.dataset.originalName;
            }
          }, 2000);
        }
      }
    },

    // Show upload success indicator
    showUploadSuccess: function(fileId, driveUrl) {
      const fileItem = document.querySelector(`[data-file-id="${fileId}"]`);
      if (!fileItem) return;

      // Add success indicator
      const successIcon = document.createElement('span');
      successIcon.className = 'techpack-file__success-icon';
      successIcon.innerHTML = '✅';
      successIcon.style.marginLeft = '8px';
      successIcon.title = 'Uploaded to Google Drive';

      const fileName = fileItem.querySelector('.techpack-file__name');
      if (fileName && !fileName.querySelector('.techpack-file__success-icon')) {
        fileName.appendChild(successIcon);
      }

      // Store Google Drive URL in the file item
      fileItem.dataset.driveUrl = driveUrl;
    },

    // Show upload error indicator
    showUploadError: function(fileId, error) {
      const fileItem = document.querySelector(`[data-file-id="${fileId}"]`);
      if (!fileItem) return;

      // Add error indicator
      const errorIcon = document.createElement('span');
      errorIcon.className = 'techpack-file__error-icon';
      errorIcon.innerHTML = '❌';
      errorIcon.style.marginLeft = '8px';
      errorIcon.title = `Upload failed: ${error}`;

      const fileName = fileItem.querySelector('.techpack-file__name');
      if (fileName && !fileName.querySelector('.techpack-file__error-icon')) {
        fileName.appendChild(errorIcon);
      }
    }
  };

  // Utility function to get minimum quantity based on production type and colorway count
  function getMinimumQuantity(colorwayCount, productionType) {
    // Set defaults
    colorwayCount = colorwayCount || 1;
    
    // Get production type from form if not provided
    if (!productionType) {
      var productionSelect = document.querySelector('#production-type, select[name="productionType"]');
      productionType = productionSelect ? productionSelect.value : 'our-blanks';
    }
    
    if (productionType === 'our-blanks') {
      return colorwayCount === 1 ? CONFIG.MIN_ORDER_QUANTITY_SINGLE_COLORWAY : CONFIG.MIN_ORDER_QUANTITY_MULTIPLE_COLORWAY;
    }
    
    // Custom production uses the old minimums
    return colorwayCount === 1 ? CONFIG.MIN_ORDER_QUANTITY_CUSTOM : CONFIG.MIN_COLORWAY_QUANTITY;
  }

  // Enhanced Application State
  class TechPackState {
    constructor() {
      this.currentStep = 1;
      this.isInitialized = false;
      this.formData = {
        clientInfo: {},
        files: [],
        garments: [],
        requiredGarmentCount: 1
      };
      this.counters = {
        file: 0,
        garment: 0,
        colorway: 0
      };
      this.ui = {
        animations: new Map(),
        validators: new Map(),
        observers: new Set()
      };
    }

    reset() {
      this.currentStep = 1;
      this.formData = { clientInfo: {}, files: [], garments: [] };
      this.counters = { file: 0, garment: 0, colorway: 0 };
      this.ui.animations.clear();
      this.ui.validators.clear();
    }

    // Deep clone for immutability
    getState() {
      return JSON.parse(JSON.stringify({
        currentStep: this.currentStep,
        formData: this.formData,
        counters: this.counters
      }));
    }

    setState(newState) {
      Object.assign(this, newState);
      this.notifyObservers();
    }

    subscribe(callback) {
      this.ui.observers.add(callback);
      return () => this.ui.observers.delete(callback);
    }

    notifyObservers() {
      this.ui.observers.forEach(callback => callback(this.getState()));
    }
  }

  // Enhanced Debug System
  class DebugSystem {
    constructor() {
      this.enabled = false;
      this.panel = null;
      this.content = null;
      this.logs = [];
      this.maxLogs = 100;
    }

    init() {
      this.createPanel();
      this.setupKeyboardShortcuts();
    }

    createPanel() {
      this.panel = document.createElement('div');
      this.panel.id = 'debug-panel';
      this.panel.className = 'debug-panel';
      this.panel.style.cssText = `
        position: fixed; top: 20px; right: 20px; width: 350px; max-height: 400px;
        background: rgba(0,0,0,0.9); color: #fff; border-radius: 8px; padding: 15px;
        font-family: 'Courier New', monospace; font-size: 11px; z-index: 10000;
        display: none; overflow-y: auto; backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
      `;

      this.content = document.createElement('div');
      this.content.id = 'debug-content';
      this.panel.appendChild(this.content);

      const controls = document.createElement('div');
      controls.style.cssText = 'position: sticky; top: 0; background: inherit; padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.2);';
      controls.innerHTML = `
        <button onclick="debugSystem.clear()" style="background: #333; color: #fff; border: none; padding: 5px 10px; border-radius: 4px; margin-right: 5px; cursor: pointer;">Clear</button>
        <button onclick="debugSystem.exportLogs()" style="background: #333; color: #fff; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Export</button>
      `;
      this.panel.insertBefore(controls, this.content);

      document.body.appendChild(this.panel);
    }

    setupKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
          e.preventDefault();
          this.toggle();
        }
      });
    }

    log(message, data = null, level = 'info') {
      const timestamp = new Date().toLocaleTimeString();
      const logEntry = {
        timestamp,
        message,
        data,
        level,
        id: Date.now() + Math.random()
      };

      this.logs.push(logEntry);
      if (this.logs.length > this.maxLogs) {
        this.logs.shift();
      }

      if (this.enabled && this.content) {
        this.renderLog(logEntry);
      }

      // Console output with styling
      const style = {
        info: 'color: #3b82f6',
        warn: 'color: #f59e0b',
        error: 'color: #ef4444',
        success: 'color: #10b981'
      };
      console.log(`%c[${timestamp}] ${message}`, style[level] || style.info, data || '');
    }

    renderLog(logEntry) {
      const logElement = document.createElement('div');
      logElement.style.cssText = `
        margin-bottom: 5px; padding: 5px; border-radius: 3px;
        background: ${this.getLogColor(logEntry.level)};
        border-left: 3px solid ${this.getLogBorderColor(logEntry.level)};
      `;
      
      logElement.innerHTML = `
        <div style="font-weight: bold;">[${logEntry.timestamp}] ${logEntry.message}</div>
        ${logEntry.data ? `<div style="margin-top: 3px; opacity: 0.8;">${JSON.stringify(logEntry.data, null, 2)}</div>` : ''}
      `;
      
      this.content.appendChild(logElement);
    }

    getLogColor(level) {
      const colors = {
        info: 'rgba(59, 130, 246, 0.1)',
        warn: 'rgba(245, 158, 11, 0.1)',
        error: 'rgba(239, 68, 68, 0.1)',
        success: 'rgba(16, 185, 129, 0.1)'
      };
      return colors[level] || colors.info;
    }

    getLogBorderColor(level) {
      const colors = {
        info: '#3b82f6',
        warn: '#f59e0b',
        error: '#ef4444',
        success: '#10b981'
      };
      return colors[level] || colors.info;
    }

    toggle() {
      this.enabled = !this.enabled;
      this.panel.style.display = this.enabled ? 'block' : 'none';
      
      if (this.enabled) {
        this.refreshLogs();
        this.log('Debug mode enabled', null, 'success');
      }
    }

    refreshLogs() {
      if (!this.content) return;
      this.content.innerHTML = '';
      this.logs.forEach(log => this.renderLog(log));
    }

    clear() {
      this.logs = [];
      if (this.content) {
        this.content.innerHTML = '';
      }
      this.log('Debug logs cleared', null, 'info');
    }

    exportLogs() {
      const data = JSON.stringify(this.logs, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `techpack-debug-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  // Enhanced Country Data with Enhanced Features
  const COUNTRY_DATA = {
    priority: [
      { name: "United States", code: "US", flag: "🇺🇸", region: "North America" },
      { name: "United Kingdom", code: "GB", flag: "🇬🇧", region: "Non-EU Europe" },
      { name: "Portugal", code: "PT", flag: "🇵🇹", region: "Europe" }
    ],
    european: [
      { name: "Austria", code: "AT", flag: "🇦🇹", region: "Europe" },
      { name: "Belgium", code: "BE", flag: "🇧🇪", region: "Europe" },
      { name: "Bulgaria", code: "BG", flag: "🇧🇬", region: "Europe" },
      { name: "Croatia", code: "HR", flag: "🇭🇷", region: "Europe" },
      { name: "Cyprus", code: "CY", flag: "🇨🇾", region: "Europe" },
      { name: "Czech Republic", code: "CZ", flag: "🇨🇿", region: "Europe" },
      { name: "Denmark", code: "DK", flag: "🇩🇰", region: "Europe" },
      { name: "Estonia", code: "EE", flag: "🇪🇪", region: "Europe" },
      { name: "Finland", code: "FI", flag: "🇫🇮", region: "Europe" },
      { name: "France", code: "FR", flag: "🇫🇷", region: "Europe" },
      { name: "Germany", code: "DE", flag: "🇩🇪", region: "Europe" },
      { name: "Greece", code: "GR", flag: "🇬🇷", region: "Europe" },
      { name: "Hungary", code: "HU", flag: "🇭🇺", region: "Europe" },
      { name: "Iceland", code: "IS", flag: "🇮🇸", region: "Europe" },
      { name: "Ireland", code: "IE", flag: "🇮🇪", region: "Europe" },
      { name: "Italy", code: "IT", flag: "🇮🇹", region: "Europe" },
      { name: "Latvia", code: "LV", flag: "🇱🇻", region: "Europe" },
      { name: "Lithuania", code: "LT", flag: "🇱🇹", region: "Europe" },
      { name: "Luxembourg", code: "LU", flag: "🇱🇺", region: "Europe" },
      { name: "Malta", code: "MT", flag: "🇲🇹", region: "Europe" },
      { name: "Netherlands", code: "NL", flag: "🇳🇱", region: "Europe" },
      { name: "Norway", code: "NO", flag: "🇳🇴", region: "Europe" },
      { name: "Poland", code: "PL", flag: "🇵🇱", region: "Europe" },
      { name: "Romania", code: "RO", flag: "🇷🇴", region: "Europe" },
      { name: "Slovakia", code: "SK", flag: "🇸🇰", region: "Europe" },
      { name: "Slovenia", code: "SI", flag: "🇸🇮", region: "Europe" },
      { name: "Spain", code: "ES", flag: "🇪🇸", region: "Europe" },
      { name: "Sweden", code: "SE", flag: "🇸🇪", region: "Europe" },
      { name: "Switzerland", code: "CH", flag: "🇨🇭", region: "Europe" }
    ],
    getAllCountries() {
      return [...this.priority, ...this.european];
    },
    // EU Member Countries that require VAT numbers
    euMembers: [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 
      'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
    ],
    
    // Non-EU European countries (do NOT require VAT)
    nonEuEuropean: [
      'GB', 'UK', 'CH', 'NO', 'IS', 'LI', 'AD', 'MC', 'SM', 'VA', 'AL', 'BA', 'XK', 'ME', 'MK', 'RS'
    ],
    
    isEuropean(countryCode) {
      return this.european.some(country => country.code === countryCode) || 
             this.priority.some(country => country.code === countryCode && country.region === "Europe");
    },
    
    // NEW: Check if country requires VAT (EU members only)
    requiresVAT(countryCode) {
      return this.euMembers.includes(countryCode);
    },
    
    // NEW: Check if country is non-EU European
    isNonEuEuropean(countryCode) {
      return this.nonEuEuropean.includes(countryCode);
    },
    findByName(name) {
      return this.getAllCountries().find(country => 
        country.name.toLowerCase() === name.toLowerCase()
      );
    },
    searchByName(query) {
      const normalizedQuery = query.toLowerCase();
      return this.getAllCountries().filter(country =>
        country.name.toLowerCase().includes(normalizedQuery)
      );
    }
  };

  // Enhanced Utility Functions
  const Utils = {
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    throttle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    formatPhoneNumber(value) {
      const cleaned = value.replace(/\D/g, '');
      let formatted = '';

      if (cleaned.length > 0) {
        if (cleaned.startsWith('1') && cleaned.length > 1) {
          formatted = '+1 ';
          const remaining = cleaned.substring(1);
          if (remaining.length >= 3) {
            formatted += remaining.substring(0, 3);
            if (remaining.length >= 6) {
              formatted += ' ' + remaining.substring(3, 6);
              if (remaining.length > 6) {
                formatted += ' ' + remaining.substring(6, 10);
              }
            } else if (remaining.length > 3) {
              formatted += ' ' + remaining.substring(3);
            }
          } else {
            formatted += remaining;
          }
        } else {
          if (cleaned.length <= 15) {
            formatted = '+' + cleaned;
          }
        }
      }

      return formatted;
    },

    animateNumber(start, end, element, suffix = '', duration = 500) {
      const startTime = Date.now();
      
      function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * easeOut);
        
        element.textContent = `${current}${suffix}`;
        
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }
      
      requestAnimationFrame(update);
    },

    createUniqueId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    validateEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    },

    validatePhone(phone) {
      const regex = /^[\+]?[\d\s\-\(\)]+$/;
      return regex.test(phone);
    },

    validateVAT(vat, countryCode = null) {
      if (!vat || !vat.trim()) return false;
      
      const cleanVat = vat.trim().replace(/[\s\-\.]/g, '').toUpperCase();
      
      // Official European VAT number patterns
      const vatPatterns = {
        // Austria: ATU + 8 digits (9 chars total) - First char always 'U'
        AT: { 
          pattern: /^ATU\d{8}$/, 
          length: 11,
          description: "ATU + 8 digits"
        },
        
        // Belgium: BE + 9-10 digits (10 chars total) - Prefix with '0' if 9 digits provided
        BE: { 
          pattern: /^BE0?\d{9}$/, 
          length: [10, 12],
          description: "BE + 10 digits (prefix with 0 if 9 digits)"
        },
        
        // Bulgaria: BG + 9 or 10 digits
        BG: { 
          pattern: /^BG\d{9,10}$/, 
          length: [11, 12],
          description: "BG + 9 or 10 digits"
        },
        
        // Croatia: HR + 11 digits
        HR: { 
          pattern: /^HR\d{11}$/, 
          length: 13,
          description: "HR + 11 digits"
        },
        
        // Cyprus: CY + 8 digits + 1 letter (9 chars total) - Last char must be letter
        CY: { 
          pattern: /^CY\d{8}[A-Z]$/, 
          length: 11,
          description: "CY + 8 digits + 1 letter"
        },
        
        // Czech Republic: CZ + 8, 9 or 10 digits
        CZ: { 
          pattern: /^CZ\d{8,10}$/, 
          length: [10, 11, 12],
          description: "CZ + 8, 9 or 10 digits"
        },
        
        // Denmark: DK + 8 digits
        DK: { 
          pattern: /^DK\d{8}$/, 
          length: 10,
          description: "DK + 8 digits"
        },
        
        // Estonia: EE + 9 digits
        EE: { 
          pattern: /^EE\d{9}$/, 
          length: 11,
          description: "EE + 9 digits"
        },
        
        // Finland: FI + 8 digits
        FI: { 
          pattern: /^FI\d{8}$/, 
          length: 10,
          description: "FI + 8 digits"
        },
        
        // France: FR + 11 chars total - May include alphabetical chars (any except O or I)
        FR: { 
          pattern: /^FR[A-HJ-NP-Z0-9]{2}\d{9}$/, 
          length: 13,
          description: "FR + 2 chars + 9 digits (no O or I)"
        },
        
        // Germany: DE + 9 digits
        DE: { 
          pattern: /^DE\d{9}$/, 
          length: 11,
          description: "DE + 9 digits"
        },
        
        // Greece: EL + 9 digits
        GR: { 
          pattern: /^EL\d{9}$/, 
          length: 11,
          description: "EL + 9 digits"
        },
        EL: { 
          pattern: /^EL\d{9}$/, 
          length: 11,
          description: "EL + 9 digits"
        },
        
        // Hungary: HU + 8 digits
        HU: { 
          pattern: /^HU\d{8}$/, 
          length: 10,
          description: "HU + 8 digits"
        },
        
        // Ireland: IE + 7 digits + 1-2 letters (8 or 9 chars total)
        IE: { 
          pattern: /^IE\d{7}[A-Z]{1,2}$/, 
          length: [10, 11],
          description: "IE + 7 digits + 1-2 letters"
        },
        
        // Italy: IT + 11 digits
        IT: { 
          pattern: /^IT\d{11}$/, 
          length: 13,
          description: "IT + 11 digits"
        },
        
        // Latvia: LV + 11 digits
        LV: { 
          pattern: /^LV\d{11}$/, 
          length: 13,
          description: "LV + 11 digits"
        },
        
        // Lithuania: LT + 9 or 12 digits
        LT: { 
          pattern: /^LT\d{9}$|^LT\d{12}$/, 
          length: [11, 14],
          description: "LT + 9 or 12 digits"
        },
        
        // Luxembourg: LU + 8 digits
        LU: { 
          pattern: /^LU\d{8}$/, 
          length: 10,
          description: "LU + 8 digits"
        },
        
        // Malta: MT + 8 digits
        MT: { 
          pattern: /^MT\d{8}$/, 
          length: 10,
          description: "MT + 8 digits"
        },
        
        // Netherlands: NL + 9 digits + B + 2 digits (12 chars total) - 10th char always B
        NL: { 
          pattern: /^NL\d{9}B\d{2}$/, 
          length: 14,
          description: "NL + 9 digits + B + 2 digits"
        },
        
        // Norway (non-EU): NO + 9 digits + MVA
        NO: { 
          pattern: /^NO\d{9}MVA$/, 
          length: 14,
          description: "NO + 9 digits + MVA"
        },
        
        // Poland: PL + 10 digits
        PL: { 
          pattern: /^PL\d{10}$/, 
          length: 12,
          description: "PL + 10 digits"
        },
        
        // Portugal: PT + 9 digits
        PT: { 
          pattern: /^PT\d{9}$/, 
          length: 11,
          description: "PT + 9 digits"
        },
        
        // Romania: RO + 10 digits
        RO: { 
          pattern: /^RO\d{10}$/, 
          length: 12,
          description: "RO + 10 digits"
        },
        
        // Slovakia: SK + 10 digits
        SK: { 
          pattern: /^SK\d{10}$/, 
          length: 12,
          description: "SK + 10 digits"
        },
        
        // Slovenia: SI + 8 digits
        SI: { 
          pattern: /^SI\d{8}$/, 
          length: 10,
          description: "SI + 8 digits"
        },
        
        // Spain: ES + 9 chars total - Includes 1 or 2 alphabetical chars
        ES: { 
          pattern: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/, 
          length: 11,
          description: "ES + letter/digit + 7 digits + letter/digit"
        },
        
        // Sweden: SE + 12 digits
        SE: { 
          pattern: /^SE\d{12}$/, 
          length: 14,
          description: "SE + 12 digits"
        },
        
        // Switzerland (non-EU): CHE + 9 digits + MWST/TVA/IVA
        CH: { 
          pattern: /^CHE\d{9}(MWST|TVA|IVA)$/, 
          length: [16, 15, 15],
          description: "CHE + 9 digits + MWST/TVA/IVA"
        },
        
        // United Kingdom (non-EU): GB + 9 digits
        GB: { 
          pattern: /^GB\d{9}$/, 
          length: 11,
          description: "GB + 9 digits"
        }
      };
      
      // Detect country from VAT number
      let detectedCountry = cleanVat.substring(0, 2);
      
      // Special cases
      if (cleanVat.startsWith('CHE')) {
        detectedCountry = 'CH';
      }
      
      const vatRule = vatPatterns[detectedCountry];
      
      if (!vatRule) {
        // For non-EU countries, allow EIN format (US): 9 digits
        if (/^\d{9}$/.test(cleanVat)) {
          return true; // Valid EIN
        }
        return false;
      }
      
      // Check length
      const validLengths = Array.isArray(vatRule.length) ? vatRule.length : [vatRule.length];
      if (!validLengths.includes(cleanVat.length)) {
        return false;
      }
      
      // Check pattern
      return vatRule.pattern.test(cleanVat);
    },

    sanitizeInput(input) {
      return input.trim().replace(/[<>]/g, '');
    }
  };

  // Enhanced Animation System
  class AnimationManager {
    constructor() {
      this.activeAnimations = new Map();
    }

    fadeIn(element, duration = CONFIG.ANIMATION_DURATION) {
      return new Promise(resolve => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        
        requestAnimationFrame(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          
          setTimeout(() => {
            element.style.transition = '';
            resolve();
          }, duration);
        });
      });
    }

    fadeOut(element, duration = CONFIG.ANIMATION_DURATION) {
      return new Promise(resolve => {
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
          element.style.transition = '';
          resolve();
        }, duration);
      });
    }

    slideIn(element, direction = 'right', duration = CONFIG.ANIMATION_DURATION) {
      const transforms = {
        right: 'translateX(20px)',
        left: 'translateX(-20px)',
        up: 'translateY(-20px)',
        down: 'translateY(20px)'
      };

      return new Promise(resolve => {
        element.style.opacity = '0';
        element.style.transform = transforms[direction];
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        
        requestAnimationFrame(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateX(0) translateY(0)';
          
          setTimeout(() => {
            element.style.transition = '';
            resolve();
          }, duration);
        });
      });
    }

    pulse(element, scale = 1.05, duration = 200) {
      element.style.transition = `transform ${duration}ms ease`;
      element.style.transform = `scale(${scale})`;
      
      setTimeout(() => {
        element.style.transform = 'scale(1)';
        setTimeout(() => {
          element.style.transition = '';
        }, duration);
      }, duration);
    }

    shake(element, distance = 5, duration = 400) {
      const keyframes = [
        { transform: 'translateX(0)' },
        { transform: `translateX(-${distance}px)` },
        { transform: `translateX(${distance}px)` },
        { transform: `translateX(-${distance}px)` },
        { transform: `translateX(${distance}px)` },
        { transform: 'translateX(0)' }
      ];

      element.animate(keyframes, {
        duration,
        easing: 'ease-in-out'
      });
    }
  }

  // Make animationManager globally accessible immediately
  const animationManager = new AnimationManager();

  // Enhanced Form Validator
  class FormValidator {
    constructor() {
      this.rules = new Map();
      this.errors = new Map();
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
  }

  // Enhanced Step Manager
  class StepManager {
    constructor() {
      this.steps = document.querySelectorAll('.techpack-step');
      // CREATE validator instance here
      this.validator = new FormValidator();
      this.setupValidationRules();
    }

    // In StepManager class, REPLACE setupValidationRules():
    setupValidationRules() {
      // Clear any existing rules first
      this.validator.rules.clear();  // Changed from validator to this.validator
      this.validator.errors.clear(); // Changed from validator to this.validator
    
      // Step 1 validation rules ONLY
      this.validator.addRule('clientName', value => value && value.trim().length > 0, 'Client name is required');
      this.validator.addRule('companyName', value => value && value.trim().length > 0, 'Company name is required');
      this.validator.addRule('email', value => value && Utils.validateEmail(value), 'Valid email address is required');
      this.validator.addRule('country', value => value && value.trim().length > 0, 'Country selection is required');
      this.validator.addRule('phone', value => !value || Utils.validatePhone(value), 'Valid phone number format required');
      this.validator.addRule('vatEin', value => !value || Utils.validateVAT(value), 'Valid VAT/EIN format required');
    }

    // ADD this method to your StepManager class
    debugTestNavigation(targetStep) {
      debugSystem.log(`DEBUG: Testing navigation to step ${targetStep}`);
      
      // Check if target step exists
      let targetElement = null;
      if (targetStep === 0) {
        targetElement = document.querySelector('#techpack-step-0');
      } else {
        targetElement = document.querySelector(`[data-step="${targetStep}"]`);
      }
      
      debugSystem.log('Target element found:', !!targetElement);
      
      if (targetElement) {
        // Hide all steps
        const allSteps = document.querySelectorAll('.techpack-step');
        allSteps.forEach(step => {
          step.style.display = 'none';
        });
        
        // Show target step
        targetElement.style.display = 'block';
        state.currentStep = targetStep;
        
        debugSystem.log(`DEBUG: Successfully showed step ${targetStep}`);
        return true;
      } else {
        debugSystem.log(`DEBUG: Step ${targetStep} element not found`, null, 'error');
        return false;
      }
    }

// ENHANCED: Robust navigation with comprehensive error handling
    async navigateToStep(stepNumber) {
      try {
        if (stepNumber === state.currentStep) {
          debugSystem.log('Already on target step, skipping navigation', { stepNumber });
          return true;
        }
        
        debugSystem.log(`🧭 Starting navigation to step ${stepNumber}`, { 
          from: state.currentStep,
          timestamp: Date.now()
        });

        // Enhanced validation with error handling
        try {
          // Skip validation for step 0 (registration check) and when going backwards
          // ALSO skip validation when coming FROM step 0 (registration)
          if (stepNumber > state.currentStep && state.currentStep > 0) {
            const validationResult = await this.validateCurrentStep();
            if (!validationResult) {
              debugSystem.log('❌ Step validation failed, navigation cancelled', { 
                currentStep: state.currentStep,
                targetStep: stepNumber 
              }, 'warn');
              return false; // Prevent navigation when validation fails
            }
          }
        } catch (validationError) {
          debugSystem.log('❌ Validation error, proceeding anyway:', validationError, 'warn');
          // Continue with navigation even if validation fails
        }

        // Enhanced element detection with error handling
        let currentStepEl = null;
        let targetStepEl = null;

        try {
          // Handle step 0 specifically
          if (state.currentStep === 0) {
            currentStepEl = document.querySelector('#techpack-step-0');
          } else {
            currentStepEl = document.querySelector(`[data-step="${state.currentStep}"]`);
          }

          if (stepNumber === 0) {
            targetStepEl = document.querySelector('#techpack-step-0');
          } else {
            targetStepEl = document.querySelector(`[data-step="${stepNumber}"]`);
          }

          debugSystem.log('🔍 Element detection results:', {
            currentStepEl: !!currentStepEl,
            targetStepEl: !!targetStepEl,
            currentStepId: currentStepEl?.id || 'unknown',
            targetStepId: targetStepEl?.id || 'unknown'
          });

          if (!targetStepEl) {
            debugSystem.log('❌ Target step element not found', { 
              stepNumber,
              expectedSelector: stepNumber === 0 ? '#techpack-step-0' : `[data-step="${stepNumber}"]`,
              availableSteps: document.querySelectorAll('[data-step], #techpack-step-0').length
            }, 'error');
            return false;
          }

        } catch (elementError) {
          debugSystem.log('❌ Element detection failed:', elementError, 'error');
          return false;
        }

        // Enhanced animation handling with error recovery
        try {
          // Hide current step with animation
          if (currentStepEl) {
            try {
              await animationManager.fadeOut(currentStepEl);
              currentStepEl.style.display = 'none';
              debugSystem.log('✅ Hidden current step successfully', { currentStep: state.currentStep });
            } catch (fadeError) {
              debugSystem.log('⚠️ Fade out animation failed, using direct hide:', fadeError, 'warn');
              currentStepEl.style.display = 'none';
            }
          }

          // Show target step with animation
          targetStepEl.style.display = 'block';
          
          try {
            await animationManager.fadeIn(targetStepEl);
            debugSystem.log('✅ Shown target step successfully', { targetStep: stepNumber });
          } catch (fadeInError) {
            debugSystem.log('⚠️ Fade in animation failed, step is visible anyway:', fadeInError, 'warn');
          }

        } catch (animationError) {
          debugSystem.log('❌ Animation sequence failed:', animationError, 'error');
          // Ensure target step is visible even if animations fail
          if (targetStepEl) {
            targetStepEl.style.display = 'block';
          }
        }

        // Update state and complete navigation
        const previousStep = state.currentStep;
        state.currentStep = stepNumber;
        
        debugSystem.log('✅ Navigation completed successfully', {
          from: previousStep,
          to: stepNumber,
          duration: Date.now() - (this.navigationStartTime || Date.now())
        });

        return true;

      } catch (navigationError) {
        debugSystem.log('❌ Navigation failed completely:', navigationError, 'error');
        return false;
      }
    }



    handleStepEnter(stepNumber) {
      switch (stepNumber) {
        case 2:
          this.syncStep2DOM();
          break;
        case 3:
          this.initializeStep3();
          break;
        case 4:
          this.populateReview();
          break;
      }
    }

    initializeStep3() {
      // Create required garments based on file count
      const currentGarments = document.querySelectorAll('.techpack-garment').length;
      const requiredGarments = state.formData.requiredGarmentCount || 1;
      
      debugSystem.log('Step 3 initialization', { 
        currentGarments, 
        requiredGarments, 
        fileCount: state.formData.files.length 
      });
      
      if (currentGarments < requiredGarments) {
        // Create additional garments if needed
        const garmentsToCreate = requiredGarments - currentGarments;
        for (let i = 0; i < garmentsToCreate; i++) {
          garmentManager.addGarment();
        }
        debugSystem.log(`Auto-created ${garmentsToCreate} additional garments (${currentGarments} → ${requiredGarments})`);
      } else if (currentGarments > requiredGarments) {
        // Remove excess garments if files were deleted
        const garmentsToRemove = currentGarments - requiredGarments;
        const garmentElements = document.querySelectorAll('.techpack-garment');
        for (let i = 0; i < garmentsToRemove; i++) {
          const lastGarment = garmentElements[garmentElements.length - 1 - i];
          if (lastGarment) {
            const garmentId = lastGarment.dataset.garmentId;
            garmentManager.removeGarment(garmentId);
          }
        }
        debugSystem.log(`Removed ${garmentsToRemove} excess garments (${currentGarments} → ${requiredGarments})`);
      }
      
      this.refreshStep3Interface();
      
      // CRITICAL: Sync existing garment data with DOM after interface refresh
      setTimeout(() => {
        this.syncStep3GarmentData();
        this.validateStep3();
        
        // Initialize progress bar calculation
        if (window.quantityCalculator) {
          quantityCalculator.calculateAndUpdateProgress();
        }
        
      }, 100);
    }

    // NEW METHOD: Sync garment data with DOM elements
    syncStep3GarmentData() {
      const garmentElements = document.querySelectorAll('.techpack-garment');
      
      garmentElements.forEach((garmentElement, index) => {
        const garmentId = garmentElement.dataset.garmentId;
        const garmentData = state.formData.garments.find(g => g.id === garmentId);
        
        if (garmentData) {
          // Sync garment type
          const garmentTypeSelect = garmentElement.querySelector('select[name="garmentType"]');
          if (garmentTypeSelect && garmentData.type) {
            garmentTypeSelect.value = garmentData.type;
          }
          
          // Sync fabric type
          const fabricSelect = garmentElement.querySelector('select[name="fabricType"]');
          if (fabricSelect && garmentData.fabric) {
            fabricSelect.value = garmentData.fabric;
          }
          
          // Sync printing methods
          if (garmentData.printingMethods && garmentData.printingMethods.length > 0) {
            const checkboxes = garmentElement.querySelectorAll('input[name="printingMethods[]"]');
            checkboxes.forEach(checkbox => {
              checkbox.checked = garmentData.printingMethods.includes(checkbox.value);
            });
          }
          
          debugSystem.log('Synced garment data with DOM', { 
            garmentId, 
            type: garmentData.type, 
            fabric: garmentData.fabric,
            printingMethods: garmentData.printingMethods 
          });
        }
      });
    }

    updateProgressIndicators() {
      try {
        this.steps.forEach((step, index) => {
          try {
            const stepNum = index + 1;
            const progressFill = step.querySelector('.techpack-progress__fill');
            const progressSteps = step.querySelectorAll('.techpack-progress__step');
            
            if (progressFill) {
              const percentage = stepNum <= 1 ? 0 : ((stepNum - 1) / (progressSteps.length - 1)) * 100;
              progressFill.style.width = `${Math.min(percentage, 100)}%`;
            } else {
              debugSystem.log(`⚠️ Progress fill element not found for step ${stepNum}`, null, 'warn');
            }

            progressSteps.forEach((progressStep, progressIndex) => {
              try {
                const isCompleted = progressIndex < state.currentStep - 1;
                const isActive = progressIndex === state.currentStep - 1;
                
                progressStep.classList.toggle('techpack-progress__step--completed', isCompleted);
                progressStep.classList.toggle('techpack-progress__step--active', isActive);
              } catch (stepError) {
                debugSystem.log(`❌ Error updating progress step ${progressIndex}:`, stepError, 'error');
              }
            });
          } catch (stepError) {
            debugSystem.log(`❌ Error processing step ${index + 1} progress:`, stepError, 'error');
          }
        });
      } catch (error) {
        debugSystem.log('❌ Critical error in updateProgressIndicators:', error, 'error');
        // Store error for next load
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('techpack_progress_error', JSON.stringify({
            error: error.message,
            timestamp: new Date().toISOString(),
            currentStep: state.currentStep,
            stepsCount: this.steps.length
          }));
        }
      }
    }

    async validateCurrentStep() {
      switch (state.currentStep) {
        case 1:
          return this.validateStep1();
        case 2:
          return this.validateStep2();
        case 3:
          return this.validateStep3();
        default:
          return true;
      }
    }

    // Enhanced version of your existing validateStep1() method
    validateStep1() {
      const form = document.querySelector('#techpack-step-1 form');
      if (!form) return false;
    
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      let isValid = true;
      const errors = {};
      
      // Check if user is registered client (new functionality)
      const isRegisteredClient = state.formData.isRegisteredClient || false;
    
      // Basic required fields - MODIFIED to handle registered vs new clients
      let requiredFields = [
        { name: 'companyName', label: 'Company name' },
        { name: 'email', label: 'Email address' },
        { name: 'productionType', label: 'Production type' }
      ];

      // Add additional required fields for NEW clients only
      if (!isRegisteredClient) {
        requiredFields.unshift({ name: 'clientName', label: 'Client name' });
        requiredFields.push({ name: 'country', label: 'Country' });
      }
    
      requiredFields.forEach(field => {
        if (!data[field.name] || !data[field.name].trim()) {
          isValid = false;
          errors[field.name] = `${field.label} is required`;
        }
      });
    
      // Email validation
      if (data.email && !Utils.validateEmail(data.email)) {
        isValid = false;
        errors.email = 'Please enter a valid email address';
      }
    
      // Phone validation (optional) - UNCHANGED from your code
      if (data.phone && !Utils.validatePhone(data.phone)) {
        isValid = false;
        errors.phone = 'Please enter a valid phone number';
      }
    
      // CRITICAL: VAT/EIN validation based on country - ONLY for NEW clients
      if (!isRegisteredClient) {
        const vatInput = form.querySelector('input[name="vatEin"]');
        if (vatInput) {
          const isVATRequired = vatInput.hasAttribute('data-required') || vatInput.hasAttribute('required');
          const vatValue = data.vatEin || '';
          const selectedCountry = data.country || '';
          
          // Get country code for validation
          const countryObj = COUNTRY_DATA.findByName(selectedCountry);
          const countryCode = countryObj ? countryObj.code : null;
          const requiresVAT = countryCode ? COUNTRY_DATA.requiresVAT(countryCode) : false;
          
          if (isVATRequired && requiresVAT && (!vatValue || !vatValue.trim())) {
            isValid = false;
            errors.vatEin = 'VAT number is required for EU member countries';
          } else if (vatValue && vatValue.trim()) {
            // Validate VAT format
            if (!Utils.validateVAT(vatValue, countryCode)) {
              isValid = false;
              
              // Country-specific error messages - UNCHANGED from your code
              if (countryCode === 'PT') {
                errors.vatEin = 'Portuguese VAT must be PT + 9 digits (e.g., PT123456789)';
              } else if (countryCode === 'ES') {
                errors.vatEin = 'Spanish VAT must be ES + letter/digit + 7 digits + letter/digit (e.g., ESA12345674)';
              } else if (countryCode === 'DE') {
                errors.vatEin = 'German VAT must be DE + 9 digits (e.g., DE123456789)';
              } else if (countryCode === 'FR') {
                errors.vatEin = 'French VAT must be FR + 2 characters + 9 digits (e.g., FRAA123456789)';
              } else if (countryCode === 'US') {
                errors.vatEin = 'US EIN must be 9 digits (e.g., 123456789)';
              } else {
                errors.vatEin = `Please enter a valid ${COUNTRY_DATA.isEuropean(countryCode) ? 'VAT' : 'EIN'} number for ${selectedCountry}`;
              }
            }
          }
        }
      }
    
      // Display errors for all fields - UNCHANGED from your code
      Object.keys(errors).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
          this.displayFieldError(field, false, errors[fieldName]);
        }
      });
    
      // Clear errors for valid fields - ENHANCED to handle both client types
      const allFieldNames = ['clientName', 'companyName', 'email', 'phone', 'vatEin', 'country', 'productionType', 'notes'];
      allFieldNames.forEach(fieldName => {
        if (!errors[fieldName]) {
          const fieldElement = form.querySelector(`[name="${fieldName}"]`);
          if (fieldElement) {
            this.displayFieldError(fieldElement, true, '');
          }
        }
      });
    
      // Next button state handled below

      if (isValid) {
        // Add client type info to your existing data structure
        data.isRegisteredClient = isRegisteredClient;
        state.formData.clientInfo = data;
        debugSystem.log('Step 1 validation passed', { 
          data, 
          clientType: isRegisteredClient ? 'registered' : 'new' 
        }, 'success');
      } else {
        debugSystem.log('Step 1 validation failed', errors, 'error');
      }
      
      // Update Next button state
      const nextBtn = document.getElementById('step-1-next');
      if (nextBtn) {
        nextBtn.disabled = !isValid;
        nextBtn.classList.toggle('techpack-btn--disabled', !isValid);
      }
    
      return isValid;
    }

    validateStep2() {
      const isValid = state.formData.files.length > 0 && 
                     state.formData.files.every(f => f.type && f.type.trim() !== '');

      if (!isValid) {
        debugSystem.log('Step 2 validation failed: missing files or file types', null, 'error');
      } else {
        debugSystem.log('Step 2 validation passed', { fileCount: state.formData.files.length }, 'success');
      }

      this.calculateRequiredGarments();

      return isValid;
    }

    // CLEAN: Enhanced validateStep3() method - Request Type Dispatcher
    validateStep3() {
      const nextBtn = document.querySelector('#step-3-next');
      
      if (state.formData.garments.length === 0) {
        debugSystem.log('Step 3 validation failed: no garments', null, 'error');
        if (nextBtn) nextBtn.disabled = true;
        return false;
      }
    
      // CRITICAL: First sync all DOM values to state to preserve selections
      this.syncDOMToState();
      
      // DISPATCH: Call appropriate validator based on request type
      const requestType = state.formData.requestType; // Use ONLY state for consistency
      let isValid = false;
      
      switch (requestType) {
        case 'quotation':
          isValid = this.validateQuotationRequest();
          debugSystem.log('Quotation validation completed', { isValid });
          break;
          
        case 'sample-request':
          isValid = this.validateSampleRequest();
          debugSystem.log('Sample request validation completed', { isValid });
          break;
          
        case 'bulk-order-request':
          isValid = this.validateBulkOrderRequest();
          debugSystem.log('Bulk order validation completed', { isValid });
          break;
          
        default:
          debugSystem.log('Unknown request type for validation', { requestType }, 'error');
          isValid = false;
      }
    
      // Update button state
      if (nextBtn) {
        nextBtn.disabled = !isValid;
      }
    
      const validationType = requestType || 'unknown';
      if (isValid) {
        debugSystem.log(`Step 3 validation passed for ${validationType}`, null, 'success');
      } else {
        debugSystem.log(`Step 3 validation failed for ${validationType}`, null, 'error');
      }
    
      return isValid;
    }

    // Sync DOM form values to state to preserve user selections
    syncDOMToState() {
      const garmentElements = document.querySelectorAll('.techpack-garment');
      
      garmentElements.forEach((garmentElement) => {
        const garmentId = garmentElement.dataset.garmentId;
        const garmentData = state.formData.garments.find(g => g.id === garmentId);
        
        if (garmentData) {
          // Preserve garment type selection
          const garmentTypeSelect = garmentElement.querySelector('select[name="garmentType"]');
          if (garmentTypeSelect?.value) {
            garmentData.type = garmentTypeSelect.value;
          }
          
          // Preserve fabric type selection
          const fabricSelect = garmentElement.querySelector('select[name="fabricType"]');
          if (fabricSelect?.value) {
            garmentData.fabric = fabricSelect.value;
          }
          
          // Preserve printing methods selection
          const printingCheckboxes = garmentElement.querySelectorAll('input[name="printingMethods[]"]:checked');
          if (printingCheckboxes.length > 0) {
            garmentData.printingMethods = Array.from(printingCheckboxes).map(cb => cb.value);
          }
        }
      });
    }

    // SEPARATE VALIDATION METHODS FOR EACH REQUEST TYPE

    // Validate Quotation Request (Basic garment info only)
    validateQuotationRequest() {
      const garmentElements = document.querySelectorAll('.techpack-garment');
      let isValid = true;

      if (garmentElements.length === 0) {
        debugSystem.log('Quotation validation failed: no garments', null, 'error');
        return false;
      }

      // Only validate basic garment information
      garmentElements.forEach((garmentElement, index) => {
        // Validate garment type
        const garmentTypeSelect = garmentElement.querySelector('select[name="garmentType"]');
        const garmentTypeGroup = garmentTypeSelect?.closest('.techpack-form__group');
        const garmentTypeError = garmentTypeGroup?.querySelector('.techpack-form__error');
        
        if (!garmentTypeSelect?.value) {
          isValid = false;
          if (garmentTypeGroup) garmentTypeGroup.classList.add('techpack-form__group--error');
          if (garmentTypeError) garmentTypeError.textContent = 'Please select a garment type';
        } else {
          if (garmentTypeGroup) garmentTypeGroup.classList.remove('techpack-form__group--error');
          if (garmentTypeError) garmentTypeError.textContent = '';
        }

        // Validate fabric type
        const fabricSelect = garmentElement.querySelector('select[name="fabricType"]');
        const fabricGroup = fabricSelect?.closest('.techpack-form__group');
        const fabricError = fabricGroup?.querySelector('.techpack-form__error');
        
        if (!fabricSelect?.value) {
          isValid = false;
          if (fabricGroup) fabricGroup.classList.add('techpack-form__group--error');
          if (fabricError) fabricError.textContent = 'Please select a fabric type';
        } else {
          if (fabricGroup) fabricGroup.classList.remove('techpack-form__group--error');
          if (fabricError) fabricError.textContent = '';
        }

        // Validate printing methods
        const printingCheckboxes = garmentElement.querySelectorAll('input[name="printingMethods[]"]:checked');
        const printingGroup = garmentElement.querySelector('.techpack-form__checkboxes')?.closest('.techpack-form__group');
        const printingError = printingGroup?.querySelector('.techpack-form__error');
        
        if (printingCheckboxes.length === 0) {
          isValid = false;
          if (printingGroup) printingGroup.classList.add('techpack-form__group--error');
          if (printingError) printingError.textContent = 'Please select at least one printing method';
        } else {
          if (printingGroup) printingGroup.classList.remove('techpack-form__group--error');
          if (printingError) printingError.textContent = '';
        }
      });

      debugSystem.log('Quotation validation result', { isValid });
      return isValid;
    }

    // Validate Sample Request (Garment info + sample selections)
    validateSampleRequest() {
      const garmentElements = document.querySelectorAll('.techpack-garment');
      let isValid = true;

      if (garmentElements.length === 0) {
        debugSystem.log('Sample request validation failed: no garments', null, 'error');
        return false;
      }

      // First validate basic garment info (same as quotation)
      garmentElements.forEach((garmentElement, index) => {
        // Validate garment type
        const garmentTypeSelect = garmentElement.querySelector('select[name="garmentType"]');
        const garmentTypeGroup = garmentTypeSelect?.closest('.techpack-form__group');
        const garmentTypeError = garmentTypeGroup?.querySelector('.techpack-form__error');
        
        if (!garmentTypeSelect?.value) {
          isValid = false;
          if (garmentTypeGroup) garmentTypeGroup.classList.add('techpack-form__group--error');
          if (garmentTypeError) garmentTypeError.textContent = 'Please select a garment type';
        } else {
          if (garmentTypeGroup) garmentTypeGroup.classList.remove('techpack-form__group--error');
          if (garmentTypeError) garmentTypeError.textContent = '';
        }

        // Validate fabric type
        const fabricSelect = garmentElement.querySelector('select[name="fabricType"]');
        const fabricGroup = fabricSelect?.closest('.techpack-form__group');
        const fabricError = fabricGroup?.querySelector('.techpack-form__error');
        
        if (!fabricSelect?.value) {
          isValid = false;
          if (fabricGroup) fabricGroup.classList.add('techpack-form__group--error');
          if (fabricError) fabricError.textContent = 'Please select a fabric type';
        } else {
          if (fabricGroup) fabricGroup.classList.remove('techpack-form__group--error');
          if (fabricError) fabricError.textContent = '';
        }

        // Validate printing methods
        const printingCheckboxes = garmentElement.querySelectorAll('input[name="printingMethods[]"]:checked');
        const printingGroup = garmentElement.querySelector('.techpack-form__checkboxes')?.closest('.techpack-form__group');
        const printingError = printingGroup?.querySelector('.techpack-form__error');
        
        if (printingCheckboxes.length === 0) {
          isValid = false;
          if (printingGroup) printingGroup.classList.add('techpack-form__group--error');
          if (printingError) printingError.textContent = 'Please select at least one printing method';
        } else {
          if (printingGroup) printingGroup.classList.remove('techpack-form__group--error');
          if (printingError) printingError.textContent = '';
        }

        // SAMPLE-SPECIFIC: Validate sample type selection
        const sampleSection = garmentElement.querySelector('.techpack-garment-samples[data-sample-request-only]');
        
        if (sampleSection && sampleSection.style.display !== 'none') {
          // Check if any sample type is selected (stock or custom)
          const stockRadio = sampleSection.querySelector('input[name="garment-sample-type"][value="stock"]:checked');
          const customRadio = sampleSection.querySelector('input[name="garment-sample-type"][value="custom"]:checked');
          
          if (!stockRadio && !customRadio) {
            // No sample type selected - this is required
            isValid = false;
            debugSystem.log(`Garment ${index + 1}: No sample type selected - sample type selection is required`, null, 'error');
            
            // Show error on the sample type selection
            const sampleTypeSection = sampleSection.querySelector('.techpack-sample-type-selection');
            if (sampleTypeSection) {
              const sampleCards = sampleTypeSection.querySelectorAll('.techpack-sample-card');
              sampleCards.forEach(card => card.classList.add('techpack-sample-card--error'));
              
              let errorElement = sampleTypeSection.querySelector('.techpack-sample-type-error');
              if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'techpack-sample-type-error';
                errorElement.style.cssText = `
                  color: var(--techpack-error);
                  font-size: 0.875rem;
                  margin-top: 0.75rem;
                  padding: 0.75rem;
                  background: rgba(239, 68, 68, 0.1);
                  border: 1px solid rgba(239, 68, 68, 0.2);
                  border-radius: 8px;
                  display: flex;
                  align-items: center;
                  gap: 0.5rem;
                `;
                errorElement.innerHTML = `
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"/>
                  </svg>
                  <span>Please select a sample type to continue</span>
                `;
                sampleTypeSection.appendChild(errorElement);
              }
              errorElement.style.display = 'flex';
            }
          } else {
            // Sample type selected - clear errors
            const sampleTypeSection = sampleSection.querySelector('.techpack-sample-type-selection');
            if (sampleTypeSection) {
              const sampleCards = sampleTypeSection.querySelectorAll('.techpack-sample-card');
              sampleCards.forEach(card => card.classList.remove('techpack-sample-card--error'));
              const errorElement = sampleTypeSection.querySelector('.techpack-sample-type-error');
              if (errorElement) errorElement.style.display = 'none';
            }

            // If custom color is selected, validate lab dip selection
            if (customRadio) {
              const labDipSelection = sampleSection.querySelector('.techpack-lab-dip-selection');
              const selectedLabDip = sampleSection.querySelector('.techpack-lab-dip-selection-card.selected');
              const labDipSelectionEmpty = sampleSection.querySelector('.techpack-lab-dip-selection-empty');
              
              if (labDipSelection) {
                const hasLabDipsAvailable = labDipSelectionEmpty && labDipSelectionEmpty.style.display === 'none';
                
                if (!hasLabDipsAvailable) {
                  isValid = false;
                  debugSystem.log(`Garment ${index + 1}: Custom color selected but no lab dips available`, null, 'error');
                  
                  const labDipGroup = labDipSelection.closest('.techpack-form__group');
                  const labDipError = labDipGroup?.querySelector('.techpack-form__error');
                  if (labDipGroup) labDipGroup.classList.add('techpack-form__group--error');
                  if (labDipError) labDipError.textContent = 'Please add at least one Lab Dip below, then select it here';
                } else if (!selectedLabDip) {
                  isValid = false;
                  debugSystem.log(`Garment ${index + 1}: Custom color selected but no lab dip selected`, null, 'error');
                  
                  const labDipGroup = labDipSelection.closest('.techpack-form__group');
                  const labDipError = labDipGroup?.querySelector('.techpack-form__error');
                  if (labDipGroup) labDipGroup.classList.add('techpack-form__group--error');
                  if (labDipError) labDipError.textContent = 'Please select which Lab Dip to apply to this custom color garment';
                } else {
                  // Lab dip properly selected - clear errors
                  const labDipGroup = labDipSelection.closest('.techpack-form__group');
                  const labDipError = labDipGroup?.querySelector('.techpack-form__error');
                  if (labDipGroup) labDipGroup.classList.remove('techpack-form__group--error');
                  if (labDipError) labDipError.textContent = '';
                }
              }
            }
          }
        }
      });

      debugSystem.log('Sample request validation result', { isValid });
      return isValid;
    }

    // Validate Bulk Order Request (Full validation with colorways and quantities)
    validateBulkOrderRequest() {
      const garmentElements = document.querySelectorAll('.techpack-garment');
      let isValid = true;

      if (garmentElements.length === 0) {
        debugSystem.log('Bulk order validation failed: no garments', null, 'error');
        return false;
      }

      garmentElements.forEach((garmentElement, index) => {
        // Validate basic garment info (same as quotation and sample)
        const garmentTypeSelect = garmentElement.querySelector('select[name="garmentType"]');
        const garmentTypeGroup = garmentTypeSelect?.closest('.techpack-form__group');
        const garmentTypeError = garmentTypeGroup?.querySelector('.techpack-form__error');
        
        if (!garmentTypeSelect?.value) {
          isValid = false;
          if (garmentTypeGroup) garmentTypeGroup.classList.add('techpack-form__group--error');
          if (garmentTypeError) garmentTypeError.textContent = 'Please select a garment type';
        } else {
          if (garmentTypeGroup) garmentTypeGroup.classList.remove('techpack-form__group--error');
          if (garmentTypeError) garmentTypeError.textContent = '';
        }

        const fabricSelect = garmentElement.querySelector('select[name="fabricType"]');
        const fabricGroup = fabricSelect?.closest('.techpack-form__group');
        const fabricError = fabricGroup?.querySelector('.techpack-form__error');
        
        if (!fabricSelect?.value) {
          isValid = false;
          if (fabricGroup) fabricGroup.classList.add('techpack-form__group--error');
          if (fabricError) fabricError.textContent = 'Please select a fabric type';
        } else {
          if (fabricGroup) fabricGroup.classList.remove('techpack-form__group--error');
          if (fabricError) fabricError.textContent = '';
        }

        const printingCheckboxes = garmentElement.querySelectorAll('input[name="printingMethods[]"]:checked');
        const printingGroup = garmentElement.querySelector('.techpack-form__checkboxes')?.closest('.techpack-form__group');
        const printingError = printingGroup?.querySelector('.techpack-form__error');
        
        if (printingCheckboxes.length === 0) {
          isValid = false;
          if (printingGroup) printingGroup.classList.add('techpack-form__group--error');
          if (printingError) printingError.textContent = 'Please select at least one printing method';
        } else {
          if (printingGroup) printingGroup.classList.remove('techpack-form__group--error');
          if (printingError) printingError.textContent = '';
        }

        // BULK-SPECIFIC: Validate colorways and quantities
        const colorwaysInGarment = garmentElement.querySelectorAll('.techpack-colorway');
        
        if (colorwaysInGarment.length === 0) {
          isValid = false;
          debugSystem.log(`Garment ${index + 1}: No colorways defined`, null, 'error');
        } else {
          const colorwayCountInGarment = colorwaysInGarment.length;
          const requiredPerColorway = getMinimumQuantity(colorwayCountInGarment);
    
          colorwaysInGarment.forEach((colorway) => {
            const qtyInputs = colorway.querySelectorAll('.techpack-size-grid__input');
            let colorwayTotal = 0;
            
            qtyInputs.forEach(input => {
              colorwayTotal += parseInt(input.value) || 0;
            });
    
            if (colorwayTotal < requiredPerColorway) {
              isValid = false;
              debugSystem.log(`Garment ${index + 1} colorway below minimum`, { 
                total: colorwayTotal, 
                required: requiredPerColorway 
              }, 'error');
            }
            
            // Check Pantone selection for each colorway
            const pantoneButtons = colorway.querySelector('.techpack-pantone-buttons');
            if (pantoneButtons) {
              const pantoneValidationResult = garmentManager.validatePantoneSelection(colorway);
              if (!pantoneValidationResult) {
                isValid = false;
                debugSystem.log(`Garment ${index + 1} colorway missing Pantone selection`, null, 'error');
              }
            }
          });
        }
      });

      debugSystem.log('Bulk order validation result', { isValid });
      return isValid;
    }

    displayFieldError(field, isValid, errorMessage) {
      field.classList.toggle('techpack-form__input--error', !isValid);
      
      let errorElement = field.parentNode.querySelector('.techpack-form__error');
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'techpack-form__error';
        field.parentNode.appendChild(errorElement);
      }

      if (!isValid) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
        animationManager.shake(field);
      } else {
        errorElement.style.display = 'none';
        errorElement.textContent = '';
      }
    }

    syncStep2DOM() {
      const fileItems = document.querySelectorAll('.techpack-file');
      fileItems.forEach(item => {
        const fileId = item.dataset.fileId;
        const select = item.querySelector('.techpack-file__tag-select');
        const fileObj = state.formData.files.find(f => f.id === fileId);
        
        if (fileObj && fileObj.type && select) {
          select.value = fileObj.type;
        }
      });
    }

    refreshStep3Interface() {
      const productionType = state.formData.clientInfo.productionType || 'custom-production';
      const garments = document.querySelectorAll('.techpack-garment');
      
      garments.forEach(garment => {
        this.updateGarmentInterface(garment, productionType);
      });
      
      debugSystem.log('Step 3 interface refreshed', { productionType });
    }

    updateGarmentInterface(garment, productionType) {
      const garmentTypeSelect = garment.querySelector('select[name="garmentType"]');
      const fabricTypeSelect = garment.querySelector('select[name="fabricType"]');
      const fabricLabel = garment.querySelector('select[name="fabricType"]').closest('.techpack-form__group').querySelector('.techpack-form__label');

      if (!garmentTypeSelect || !fabricTypeSelect || !fabricLabel) return;

      if (productionType === 'our-blanks') {
        garmentTypeSelect.innerHTML = `
          <option value="">Select garment type...</option>
          <option value="Jacket">Jacket</option>
          <option value="Hoodie">Hoodie</option>
          <option value="Sweatshirt">Sweatshirt</option>
          <option value="T-Shirt">T-Shirt</option>
          <option value="Sweatpants">Sweatpants</option>
        `;
        
        fabricLabel.textContent = 'Collection Type';
        fabricTypeSelect.innerHTML = `
          <option value="">Select collection type...</option>
          <option value="Oversized Luxury Collection">Oversized Luxury Collection</option>
          <option value="Relaxed High-End Collection">Relaxed High-End Collection</option>
        `;
      } else {
        garmentTypeSelect.innerHTML = `
          <option value="">Select garment type...</option>
          <option value="Zip-Up Hoodie">Zip-Up Hoodie</option>
          <option value="Hoodie">Hoodie</option>
          <option value="T-Shirt">T-Shirt</option>
          <option value="Sweatshirt">Sweatshirt</option>
          <option value="Sweatpants">Sweatpants</option>
          <option value="Shorts">Shorts</option>
          <option value="Long Sleeve T-Shirt">Long Sleeve T-Shirt</option>
          <option value="Shirt">Shirt</option>
          <option value="Polo Shirt">Polo Shirt</option>
          <option value="Tank Top">Tank Top</option>
          <option value="Hat/Cap">Hat/Cap</option>
          <option value="Beanie">Beanie</option>
          <option value="Other">Other (Specify in Notes)</option>
        `;
        
        fabricLabel.textContent = 'Fabric Type';
        fabricTypeSelect.innerHTML = `
          <option value="">Select fabric type...</option>
          <option value="Fleece 100% Organic Cotton">Fleece 100% Organic Cotton</option>
          <option value="French Terry 100% Organic Cotton">French Terry 100% Organic Cotton</option>
          <option value="Cotton/Polyester Blend (50/50)">Cotton/Polyester Blend (50/50)</option>
          <option value="Cotton/Polyester Blend (70/30)">Cotton/Polyester Blend (70/30)</option>
          <option value="Cotton/Polyester Blend (80/20)">Cotton/Polyester Blend (80/20)</option>
          <option value="100% Polyester">100% Polyester</option>
          <option value="100% Linen">100% Linen</option>
          <option value="Cotton/Linen Blend">Cotton/Linen Blend</option>
          <option value="Jersey Knit">Jersey Knit</option>
          <option value="Pique">Pique</option>
          <option value="Canvas">Canvas</option>
          <option value="Custom Fabric">Custom Fabric (Specify in Notes)</option>
        `;
      }

      garmentTypeSelect.value = '';
      fabricTypeSelect.value = '';
    }

    getColorwayCount() {
      const colorways = document.querySelectorAll('.techpack-colorway[data-colorway-id]');
      return Math.max(colorways.length, 1);
    }

    populateReview() {
      setTimeout(() => {
        this.populateReviewStep1();
        this.populateReviewStep2();
        this.populateReviewStep3();
        
        // Check upload status and update submit button
        this.updateSubmitButtonStatus();
        
        debugSystem.log('Review populated', null, 'success');
        
        // Ensure edit buttons are working after review is populated
        setTimeout(() => {
          formInitializer.setupEditButtons();
        }, 100);
      }, 50);
    }

    // Check upload status and enable/disable submit button
    updateSubmitButtonStatus() {
      const submitBtn = document.querySelector('#step-4-submit');
      if (!submitBtn) return;

      const uploadingFiles = state.formData.files.filter(f => f.uploadStatus === 'uploading');
      const failedFiles = state.formData.files.filter(f => f.uploadStatus === 'failed');

      if (uploadingFiles.length > 0) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="techpack-btn__spinner" width="16" height="16" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1" fill="none" opacity="0.3"/>
            <path d="M8 2v6" stroke="currentColor" stroke-width="1"/>
          </svg>
          Uploading ${uploadingFiles.length} file(s)...
        `;
      } else if (failedFiles.length > 0) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `❌ ${failedFiles.length} upload(s) failed - please retry`;
        submitBtn.style.backgroundColor = '#dc3545';
      } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit Tech-Pack';
        submitBtn.style.backgroundColor = '';
      }
    }

    // In StepManager class, REPLACE populateReviewStep1():
    populateReviewStep1() {
      const container = document.querySelector('#review-step-1');
      if (!container) return;
    
      // Get data from DOM instead of relying on state
      const form = document.querySelector('#techpack-step-1 form');
      if (!form) return;
    
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
    
      container.innerHTML = `
        <div class="techpack-review__header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="margin: 0;">Client Information</h3>
        </div>
        <div class="techpack-review__grid">
          <div class="techpack-review__item">
            <span class="techpack-review__label">Client Name:</span>
            <span class="techpack-review__value">${data.clientName || 'N/A'}</span>
          </div>
          <div class="techpack-review__item">
            <span class="techpack-review__label">Company Name:</span>
            <span class="techpack-review__value">${data.companyName || 'N/A'}</span>
          </div>
          <div class="techpack-review__item">
            <span class="techpack-review__label">Email Address:</span>
            <span class="techpack-review__value">${data.email || 'N/A'}</span>
          </div>
          <div class="techpack-review__item">
            <span class="techpack-review__label">Country:</span>
            <span class="techpack-review__value">${data.country || 'N/A'}</span>
          </div>
          <div class="techpack-review__item">
            <span class="techpack-review__label">Phone Number:</span>
            <span class="techpack-review__value">${data.phone || 'N/A'}</span>
          </div>
          <div class="techpack-review__item">
            <span class="techpack-review__label">Request Type:</span>
            <span class="techpack-review__value">${data.requestType === 'sample-request' ? 'Sample Request' : data.requestType === 'bulk-order-request' ? 'Bulk Order Request' : 'N/A'}</span>
          </div>
          <div class="techpack-review__item techpack-review__item--full-width">
            <span class="techpack-review__label">Additional Notes:</span>
            <span class="techpack-review__value">${data.notes || 'N/A'}</span>
          </div>
        </div>
      `;
    }

    populateReviewStep2() {
      const container = document.querySelector('#review-step-2');
      if (!container) return;
    
      const headerHtml = `
        <div class="techpack-review__header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="margin: 0;">Uploaded Files</h3>
        </div>
      `;
    
      if (state.formData.files.length === 0) {
        container.innerHTML = headerHtml + '<p class="techpack-review__empty">No files uploaded</p>';
        return;
      }
    
      const filesHtml = state.formData.files.map(fileData => `
        <div class="techpack-review__file">
          <div class="techpack-review__file-info">
            <svg class="techpack-review__file-icon" width="16" height="16" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M14 2v6h6" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            <span class="techpack-review__file-name">${fileData.file.name}</span>
          </div>
          <span class="techpack-review__file-type">${fileData.type}</span>
        </div>
      `).join('');
    
      container.innerHTML = headerHtml + `<div class="techpack-review__files">${filesHtml}</div>`;
    }

    // In StepManager class, REPLACE populateReviewStep3():
    populateReviewStep3() {
      const container = document.querySelector('#review-step-3');
      if (!container) return;
    
      const headerHtml = `
        <div class="techpack-review__header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="margin: 0;">Garment Specifications</h3>
        </div>
      `;
    
      const garmentElements = document.querySelectorAll('.techpack-garment');
      if (garmentElements.length === 0) {
        container.innerHTML = headerHtml + '<p class="techpack-review__empty">No garments specified</p>';
        return;
      }
    
      let totalQuantity = 0;
      const garmentsHtml = Array.from(garmentElements).map((garmentElement, index) => {
        const garmentId = garmentElement.dataset.garmentId;
        let garmentTotal = 0;
    
        // Get garment details from DOM
        const garmentTypeSelect = garmentElement.querySelector('select[name="garmentType"]');
        const fabricSelect = garmentElement.querySelector('select[name="fabricType"]');
        const printingCheckboxes = garmentElement.querySelectorAll('input[name="printingMethods[]"]:checked');
        
        const garmentType = garmentTypeSelect?.value || 'Not specified';
        const fabricType = fabricSelect?.value || 'Not specified';
        const printingMethods = Array.from(printingCheckboxes).map(cb => cb.value);
    
        // Get colorway details from DOM
        const colorwayElements = garmentElement.querySelectorAll('.techpack-colorway');
        const colorwaysHtml = Array.from(colorwayElements).map(colorway => {
          const colorwayId = colorway.dataset.colorwayId;
          
          // Get color info
          const colorPicker = colorway.querySelector('.techpack-color-picker__input');
          const color = colorPicker?.value || '#000000';
          
          // Get Pantone info from the pantone grid
          const pantoneGrid = colorway.querySelector('.techpack-pantone-grid');
          let pantoneInfo = '';
          if (pantoneGrid) {
            const pantoneInputs = pantoneGrid.querySelectorAll('.techpack-pantone-code');
            const filledPantones = Array.from(pantoneInputs).filter(input => input.value.trim());
            if (filledPantones.length > 0) {
              pantoneInfo = filledPantones.map(input => input.value).join(', ');
            }
          }
    
          // Get quantities from size grid
          const qtyInputs = colorway.querySelectorAll('.techpack-size-grid__input');
          const quantities = {};
          let colorwayTotal = 0;
    
          qtyInputs.forEach(input => {
            const size = input.name.replace('qty-', '').toUpperCase();
            const value = parseInt(input.value) || 0;
            if (value > 0) {
              quantities[size] = value;
              colorwayTotal += value;
            }
          });
    
          garmentTotal += colorwayTotal;
    
          // Format quantities for display
          const quantitiesText = Object.entries(quantities)
            .map(([size, qty]) => `${size}: ${qty}`)
            .join(', ') || 'No quantities specified';
    
          return `
            <div class="techpack-review__colorway">
              <div class="techpack-review__colorway-header">
                <div class="techpack-review__color-preview" style="background-color: ${color}"></div>
                <span class="techpack-review__colorway-info">
                  ${pantoneInfo ? `PANTONE: ${pantoneInfo}` : `Color: ${color}`}
                  <small>(${colorwayTotal} units)</small>
                </span>
              </div>
              <div class="techpack-review__quantities">${quantitiesText}</div>
            </div>
          `;
        }).join('');
    
        totalQuantity += garmentTotal;
    
        return `
          <div class="techpack-review__garment">
            <div class="techpack-review__garment-header">
              <h4 class="techpack-review__garment-title">Garment ${index + 1}: ${garmentType}</h4>
              <span class="techpack-review__garment-total">${garmentTotal} units</span>
            </div>
            <div class="techpack-review__garment-details">
              <div class="techpack-review__detail">
                <span class="techpack-review__label">Fabric:</span>
                <span class="techpack-review__value">${fabricType}</span>
              </div>
              <div class="techpack-review__detail">
                <span class="techpack-review__label">Printing Methods:</span>
                <span class="techpack-review__value">${printingMethods.length > 0 ? printingMethods.join(', ') : 'None specified'}</span>
              </div>
            </div>
            <div class="techpack-review__colorways">${colorwaysHtml}</div>
          </div>
        `;
      }).join('');
    
      container.innerHTML = headerHtml + `
        <div class="techpack-review__summary">
          <div class="techpack-review__total">
            <span class="techpack-review__total-label">Total Quantity:</span>
            <span class="techpack-review__total-value">${totalQuantity}</span>
          </div>
        </div>
        <div class="techpack-review__garments">${garmentsHtml}</div>
      `;
    }
  }

  // Enhanced File Manager
  class FileManager {
    constructor() {
      this.setupEventListeners();
    }

    setupEventListeners() {
      const uploadZone = document.querySelector('#upload-zone');
      const fileInput = document.querySelector('#file-input');
      const addMoreBtn = document.querySelector('#add-more-files');

      if (uploadZone && fileInput) {
        uploadZone.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
        uploadZone.addEventListener('drop', this.handleDrop.bind(this));
        uploadZone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', this.handleFileSelect.bind(this));
      }

      if (addMoreBtn) {
        addMoreBtn.addEventListener('click', () => fileInput?.click());
      }
    }

    handleDragOver(e) {
      e.preventDefault();
      e.currentTarget.classList.add('techpack-upload__zone--dragover');
    }

    handleDragLeave(e) {
      e.preventDefault();
      e.currentTarget.classList.remove('techpack-upload__zone--dragover');
    }

    handleDrop(e) {
      e.preventDefault();
      e.currentTarget.classList.remove('techpack-upload__zone--dragover');
      
      const files = Array.from(e.dataTransfer.files);
      this.processFiles(files);
    }

    handleFileSelect(e) {
      const files = Array.from(e.target.files);
      this.processFiles(files);
      e.target.value = '';
    }

    processFiles(files) {
      debugSystem.log('Processing files', { count: files.length });
      
      files.forEach(file => {
        if (state.formData.files.length >= CONFIG.MAX_FILES) {
          this.showError(`Maximum ${CONFIG.MAX_FILES} files allowed. Please remove some files before adding more.`);
          return;
        }

        if (!this.validateFile(file)) {
          return;
        }

        this.addFileToList(file);
      });
    }

    validateFile(file) {
      const fileExt = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!CONFIG.VALID_FILE_TYPES.includes(fileExt)) {
        this.showError(`File "${file.name}" has an unsupported format (${fileExt}). Please use one of these formats: ${CONFIG.VALID_FILE_TYPES.join(', ')}`);
        return false;
      }

      if (file.size > CONFIG.MAX_FILE_SIZE) {
        this.showError(`File "${file.name}" is too large (${Utils.formatFileSize(file.size)}). Maximum allowed size is ${Utils.formatFileSize(CONFIG.MAX_FILE_SIZE)}. Please compress or resize your file and try again.`);
        return false;
      }

      return true;
    }

    addFileToList(file) {
      const template = document.querySelector('#file-item-template');
      const uploadedFiles = document.querySelector('#uploaded-files');
      
      if (!template || !uploadedFiles) return;

      const fileId = `file-${++state.counters.file}`;
      const clone = template.content.cloneNode(true);
      const fileItem = clone.querySelector('.techpack-file');

      fileItem.dataset.fileId = fileId;
      fileItem.querySelector('.techpack-file__name').textContent = file.name;
      fileItem.querySelector('.techpack-file__size').textContent = Utils.formatFileSize(file.size);

      // Remove button
      fileItem.querySelector('.techpack-file__remove')
              .addEventListener('click', () => this.removeFile(fileId));

      // Tag selector
      const select = fileItem.querySelector('.techpack-file__tag-select');
      select.addEventListener('change', e => {
        const fileObj = state.formData.files.find(f => f.id === fileId);
        if (fileObj) {
          fileObj.type = e.target.value;
          this.validateStep2();
        }
      });

      uploadedFiles.appendChild(fileItem);

      // Store file with empty tag
      state.formData.files.push({
        id: fileId,
        file: file,
        type: '',
        driveUrl: null,
        driveFileId: null,
        uploadStatus: 'pending'
      });

      // Animate in
      animationManager.slideIn(fileItem, 'right');

      debugSystem.log('File added', { fileId, fileName: file.name });
      this.validateStep2();

      // Note: Files will be uploaded to Google Drive during form submission (Step 4)
    }

    removeFile(fileId) {
      const fileItem = document.querySelector(`[data-file-id="${fileId}"]`);
      if (fileItem) {
        animationManager.fadeOut(fileItem, 200).then(() => {
          fileItem.remove();
        });
      }
      
      state.formData.files = state.formData.files.filter(f => f.id !== fileId);
      debugSystem.log('File removed', { fileId });
      this.validateStep2();
    }

    validateStep2() {
      const nextBtn = document.getElementById('step-2-next');
      const fileItems = document.querySelectorAll('.techpack-file');

      let isValid = state.formData.files.length > 0;

      fileItems.forEach(item => {
        const fileId = item.dataset.fileId;
        const select = item.querySelector('.techpack-file__tag-select');
        const error = item.querySelector('.techpack-form__error');
        const fileObj = state.formData.files.find(f => f.id === fileId);

        if (!select?.value || !fileObj?.type) {
          isValid = false;
          if (error) error.textContent = 'Please select a file type';
        } else {
          if (error) error.textContent = '';
          if (fileObj) fileObj.type = select.value;
        }
      });

      if (nextBtn) nextBtn.disabled = !isValid;
      
      // Store the required garment count for step 3
      if (isValid) {
        this.calculateRequiredGarments();
      }
      
      return isValid;
    }

    calculateRequiredGarments() {
      const totalFiles = state.formData.files.length;
      
      // Only count files that are "Collection" or "Single" type (tech-pack files)
      const techPackFiles = state.formData.files.filter(file => 
        file.type === 'Collection' || file.type === 'Single'
      );
      
      // Design and Accessories files don't require garments
      const techPackFileCount = techPackFiles.length;
      
      state.formData.requiredGarmentCount = Math.max(techPackFileCount, 1);
      
      debugSystem.log('Required garments calculated', { 
        totalFiles: totalFiles,
        techPackFiles: techPackFileCount,
        requiredGarments: state.formData.requiredGarmentCount,
        fileTypes: state.formData.files.map(f => ({ name: f.file.name, type: f.type }))
      });
    }

    // Upload file to Google Drive automatically
    async uploadFileToGoogleDrive(fileId, file) {
      // Find the file object in state
      const fileObj = state.formData.files.find(f => f.id === fileId);
      if (!fileObj) {
        debugSystem.log('❌ File object not found for upload', { fileId }, 'error');
        return;
      }

      // Update file status
      fileObj.uploadStatus = 'uploading';

      try {
        // Upload file with progress callback
        const result = await GoogleDriveUtils.uploadFile(file, (progress, status) => {
          GoogleDriveUtils.updateFileProgress(fileId, progress, status);
        });

        if (result.success) {
          // Update file object with Google Drive info
          fileObj.driveUrl = result.fileUrl;
          fileObj.driveDownloadUrl = result.downloadUrl;
          fileObj.driveFileId = result.fileId;
          fileObj.driveFolderId = result.folderId;
          fileObj.driveFolderName = result.folderName;
          fileObj.driveFolderPath = result.folderPath;
          fileObj.driveClientName = result.clientName;
          fileObj.uploadStatus = 'completed';

          // Show success indicator in UI
          GoogleDriveUtils.showUploadSuccess(fileId, result.fileUrl);

          // Update submit button status if on step 4
          if (state.currentStep === 4) {
            stepManager.updateSubmitButtonStatus();
          }

          debugSystem.log('✅ File uploaded to Google Drive', {
            fileId,
            fileName: file.name,
            driveUrl: result.fileUrl,
            driveFileId: result.fileId
          });

        } else {
          // Update file status and show error
          fileObj.uploadStatus = 'failed';
          GoogleDriveUtils.showUploadError(fileId, result.error);

          // Update submit button status if on step 4
          if (state.currentStep === 4) {
            stepManager.updateSubmitButtonStatus();
          }

          debugSystem.log('❌ Google Drive upload failed', {
            fileId,
            fileName: file.name,
            error: result.error
          }, 'error');
        }

      } catch (error) {
        // Handle unexpected errors
        fileObj.uploadStatus = 'failed';
        GoogleDriveUtils.showUploadError(fileId, error.message);

        // Update submit button status if on step 4
        if (state.currentStep === 4) {
          stepManager.updateSubmitButtonStatus();
        }

        debugSystem.log('❌ Unexpected error during Google Drive upload', {
          fileId,
          fileName: file.name,
          error: error.message
        }, 'error');
      }
    }


    showError(message) {
      debugSystem.log('File error', message, 'error');
      
      // Create and show user-friendly error notification
      let errorDiv = document.querySelector('.techpack-file-error');
      if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'techpack-file-error';
        document.body.appendChild(errorDiv);
      }
      
      errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fee2e2;
        border: 1px solid #fecaca;
        border-left: 4px solid #ef4444;
        color: #991b1b;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        z-index: 10001;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.4;
        animation: techpackSlideIn 0.3s ease-out;
      `;
      
      // Add close button
      errorDiv.innerHTML = `
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <div style="flex: 1; margin-right: 12px;">
            <div style="font-weight: 600; margin-bottom: 4px;">File Upload Error</div>
            <div>${message}</div>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" style="
            background: none;
            border: none;
            color: #991b1b;
            cursor: pointer;
            padding: 0;
            font-size: 18px;
            line-height: 1;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">&times;</button>
        </div>
      `;
      
      // Add animation styles if not already added
      if (!document.querySelector('#techpack-error-styles')) {
        const style = document.createElement('style');
        style.id = 'techpack-error-styles';
        style.textContent = `
          @keyframes techpackSlideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `;
        document.head.appendChild(style);
      }
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (errorDiv && errorDiv.parentElement) {
          errorDiv.style.animation = 'techpackSlideIn 0.3s ease-in reverse';
          setTimeout(() => {
            if (errorDiv && errorDiv.parentElement) {
              errorDiv.remove();
            }
          }, 300);
        }
      }, 5000);
    }
  }

  // Enhanced Country Selector
  class CountrySelector {
    constructor() {
      this.input = null;
      this.dropdown = null;
      this.toggle = null;
      this.isOpen = false;
      this.highlightedIndex = -1;
      this.init();
    }

    init() {
      const countryWrapper = document.querySelector('.techpack-form__country-wrapper');
      if (!countryWrapper) return;

      this.input = countryWrapper.querySelector('.techpack-form__country-input');
      this.dropdown = countryWrapper.querySelector('.techpack-form__dropdown');
      this.toggle = countryWrapper.querySelector('.techpack-form__country-toggle');

      this.setupEventListeners();
      debugSystem.log('Country selector initialized');
    }

    setupEventListeners() {
      if (!this.input) return;

      this.input.addEventListener('focus', () => {
        this.input.dataset.touched = 'true';
      });

      this.input.addEventListener('click', () => {
        this.input.dataset.touched = 'true';
        this.openDropdown();
      });

      this.input.addEventListener('keydown', this.handleKeydown.bind(this));

      document.addEventListener('click', (e) => {
        if (!this.input.closest('.techpack-form__country-wrapper').contains(e.target)) {
          this.closeDropdown();
        }
      });
    }

    handleKeydown(e) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        this.openDropdown();
      } else if (e.key === 'Escape') {
        this.closeDropdown();
      } else if (this.isOpen) {
        this.handleDropdownNavigation(e);
      }
    }

    handleDropdownNavigation(e) {
      const items = this.dropdown.querySelectorAll('.techpack-form__dropdown-item');
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.highlightedIndex = Math.min(this.highlightedIndex + 1, items.length - 1);
          this.updateHighlight(items);
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.highlightedIndex = Math.max(this.highlightedIndex - 1, -1);
          this.updateHighlight(items);
          break;
        case 'Enter':
          e.preventDefault();
          if (this.highlightedIndex >= 0 && items[this.highlightedIndex]) {
            items[this.highlightedIndex].click();
          }
          break;
      }
    }

    openDropdown() {
      if (this.isOpen) return;
      
      this.isOpen = true;
      this.populateDropdown();
      this.dropdown.classList.add('techpack-form__dropdown--active');
      this.toggle.classList.add('techpack-form__country-toggle--open');
      
      setTimeout(() => {
        const searchInput = this.dropdown.querySelector('.techpack-form__dropdown-search');
        if (searchInput) searchInput.focus();
      }, 100);
    }

    closeDropdown() {
      this.isOpen = false;
      this.dropdown.classList.remove('techpack-form__dropdown--active');
      this.toggle.classList.remove('techpack-form__country-toggle--open');
      this.highlightedIndex = -1;
    }

    populateDropdown(searchTerm = '') {
      this.dropdown.innerHTML = '';
      
      // Add search input
      const searchInput = document.createElement('input');
      searchInput.className = 'techpack-form__dropdown-search';
      searchInput.placeholder = 'Search countries...';
      searchInput.type = 'text';
      searchInput.value = searchTerm;
      this.dropdown.appendChild(searchInput);

      // Filter countries
      let displayCountries;
      if (searchTerm) {
        displayCountries = COUNTRY_DATA.searchByName(searchTerm);
      } else {
        displayCountries = [...COUNTRY_DATA.priority, { separator: true }, ...COUNTRY_DATA.european];
      }

      if (searchTerm && displayCountries.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'techpack-form__dropdown-empty';
        emptyDiv.textContent = 'No countries found';
        this.dropdown.appendChild(emptyDiv);
      } else {
        this.renderCountries(displayCountries);
      }

      this.setupSearchListener(searchInput);
    }

    renderCountries(countries) {
      countries.forEach((country) => {
        if (country.separator) {
          const separator = document.createElement('div');
          separator.className = 'techpack-form__dropdown-separator';
          this.dropdown.appendChild(separator);
          return;
        }

        const item = document.createElement('div');
        item.className = 'techpack-form__dropdown-item';
        item.innerHTML = `
          <span class="techpack-form__country-flag">${country.flag}</span>
          <span class="techpack-form__country-name">${country.name}</span>
        `;
        item.addEventListener('click', () => this.selectCountry(country));
        this.dropdown.appendChild(item);
      });
    }

    setupSearchListener(searchInput) {
      const debouncedSearch = Utils.debounce((searchTerm) => {
        this.populateDropdown(searchTerm);
      }, 200);

      searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
      });
      
      searchInput.addEventListener('click', (e) => e.stopPropagation());
      
      setTimeout(() => {
        searchInput.focus();
        if (searchInput.value) {
          searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
        }
      }, 0);
    }
    
    // In CountrySelector.selectCountry(), ADD this at the end:
    selectCountry(country) {
      this.input.value = country.name;
      this.closeDropdown();
      
      // Update form data
      if (state.formData.clientInfo) {
        state.formData.clientInfo.country = country.name;
      }
      
      // Clear error styling
      this.input.classList.remove('techpack-form__input--error');
      const errorDiv = this.input.parentElement.querySelector('.techpack-form__error');
      if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
      }
      
      // Trigger events
      this.input.dispatchEvent(new Event('change', { bubbles: true }));
      this.input.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Handle VAT field visibility
      this.handleVATFieldVisibility(country);
      
      // IMPORTANT: Trigger Step 1 validation after country change
      setTimeout(() => {
        stepManager.validateStep1();
      }, 100);
      
      // Animation feedback
      animationManager.pulse(this.input);
      
      debugSystem.log('Country selected', { country: country.name });
    }

    // In CountrySelector class, REPLACE handleVATFieldVisibility():
    handleVATFieldVisibility(country) {
      const vatContainer = document.getElementById('vat-ein-group');
      const vatInput = document.getElementById('vat-ein'); // This matches your HTML
      const vatLabel = document.getElementById('vat-ein-label');
      
      if (!vatContainer || !vatInput) return;
      
      const requiresVAT = COUNTRY_DATA.requiresVAT(country.code);
      const isNonEuEuropean = COUNTRY_DATA.isNonEuEuropean(country.code);
      const isUS = country.code === 'US';
      
      if (requiresVAT) {
        // Make VAT required for EU member countries only
        vatContainer.style.display = 'block';
        vatContainer.classList.add('techpack-form__group--required');
        vatInput.setAttribute('required', 'required');
        vatInput.setAttribute('data-required', 'true');
        
        // Set country-specific placeholder
        const countryCode = country.code;
        const placeholders = {
          'PT': 'e.g., PT123456789',
          'ES': 'e.g., ESA12345674', 
          'DE': 'e.g., DE123456789',
          'FR': 'e.g., FRAA123456789',
          'IT': 'e.g., IT12345678901',
          'NL': 'e.g., NL123456789B01',
          'BE': 'e.g., BE0123456789',
          'AT': 'e.g., ATU12345678',
          'SE': 'e.g., SE123456789012',
          'PL': 'e.g., PL1234567890',
          'CZ': 'e.g., CZ12345678'
        };
        
        vatInput.placeholder = placeholders[countryCode] || 'Enter VAT number';
        
        if (vatLabel) {
          vatLabel.innerHTML = 'VAT Number <span class="techpack-form__required">*</span>';
        }
        
        debugSystem.log('VAT field required for EU country', { country: country.name });
      } else if (isUS) {
        // Optional EIN for US
        vatContainer.style.display = 'block';
        vatContainer.classList.remove('techpack-form__group--required');
        vatInput.removeAttribute('required');
        vatInput.removeAttribute('data-required');
        vatInput.placeholder = 'e.g., 123456789';
        
        if (vatLabel) {
          vatLabel.innerHTML = 'EIN Number <span class="techpack-form__label-status">(optional)</span>';
        }
        
        // Clear errors since it's optional
        vatInput.classList.remove('techpack-form__input--error');
        const errorDiv = vatContainer.querySelector('.techpack-form__error');
        if (errorDiv) {
          errorDiv.textContent = '';
          errorDiv.style.display = 'none';
        }
        
        debugSystem.log('EIN field optional for US', { country: country.name });
      } else if (isNonEuEuropean) {
        // Optional for non-EU European countries
        vatContainer.style.display = 'block';
        vatContainer.classList.remove('techpack-form__group--required');
        vatInput.removeAttribute('required');
        vatInput.removeAttribute('data-required');
        
        if (country.code === 'GB') {
          vatInput.placeholder = 'e.g., GB123456789 (optional)';
          if (vatLabel) {
            vatLabel.innerHTML = 'UK VAT Number <span class="techpack-form__label-status">(optional)</span>';
          }
        } else if (country.code === 'CH') {
          vatInput.placeholder = 'e.g., CHE123456789MWST (optional)';
          if (vatLabel) {
            vatLabel.innerHTML = 'Swiss VAT Number <span class="techpack-form__label-status">(optional)</span>';
          }
        } else if (country.code === 'NO') {
          vatInput.placeholder = 'e.g., NO123456789MVA (optional)';
          if (vatLabel) {
            vatLabel.innerHTML = 'Norwegian VAT Number <span class="techpack-form__label-status">(optional)</span>';
          }
        } else {
          vatInput.placeholder = 'Tax number (optional)';
          if (vatLabel) {
            vatLabel.innerHTML = 'Tax Number <span class="techpack-form__label-status">(optional)</span>';
          }
        }
        
        // Clear errors since it's optional
        vatInput.classList.remove('techpack-form__input--error');
        const errorDiv = vatContainer.querySelector('.techpack-form__error');
        if (errorDiv) {
          errorDiv.textContent = '';
          errorDiv.style.display = 'none';
        }
        
        debugSystem.log('Tax number optional for non-EU European country', { country: country.name });
      } else {
        // Hide VAT field for other countries
        vatContainer.style.display = 'none';
        vatContainer.classList.remove('techpack-form__group--required');
        vatInput.removeAttribute('required');
        vatInput.removeAttribute('data-required');
        vatInput.value = '';
        
        debugSystem.log('VAT field hidden for non-European country', { country: country.name });
      }
    }
  }

  // Enhanced Quantity Calculator
  class QuantityCalculator {
    constructor() {
      this.setupEventListeners();
    }

    setupEventListeners() {
      // Listen for quantity input changes with debouncing
      const debouncedCalculate = Utils.debounce(() => {
        this.calculateAndUpdateProgress();
      }, 200);

      // Separate debounced validation to prevent interference
      const debouncedValidation = Utils.debounce(() => {
        stepManager.validateStep3();
      }, 500);

      document.addEventListener('input', (e) => {
        if (e.target.matches('.techpack-size-grid__input[type="number"]')) {
          // Update individual colorway totals immediately
          const colorway = e.target.closest('.techpack-colorway');
          if (colorway) {
            const colorwayId = colorway.dataset.colorwayId;
            this.updateColorwayTotal(colorwayId);
            this.validateQuantityInputs(colorwayId);
          }
          debouncedCalculate();
          
          // Don't trigger step validation immediately on quantity changes
          // Let printing method validation happen separately
        }
      });

      document.addEventListener('change', (e) => {
        if (e.target.matches('.techpack-size-grid__input[type="number"]')) {
          const colorway = e.target.closest('.techpack-colorway');
          if (colorway) {
            const colorwayId = colorway.dataset.colorwayId;
            this.updateColorwayTotal(colorwayId);
            this.validateQuantityInputs(colorwayId);
            this.updateGarmentTotal(colorway.closest('.techpack-garment').dataset.garmentId);
          }
          this.calculateAndUpdateProgress();
        }
      });
    }

    getColorwayCount() {
      const colorways = document.querySelectorAll('.techpack-colorway[data-colorway-id]');
      return Math.max(colorways.length, 1);
    }

    // FIXED: Calculate minimum based on EACH GARMENT individually with Our Blanks minimums
    calculateMinimumRequired() {
      let totalMinimum = 0;
      
      // Get all garments and calculate minimum for each
      const garments = document.querySelectorAll('.techpack-garment');
      
      garments.forEach(garment => {
        const colorwaysInGarment = garment.querySelectorAll('.techpack-colorway');
        const colorwayCount = colorwaysInGarment.length;
        const minimumPerColorway = getMinimumQuantity(colorwayCount);
        
        if (colorwayCount === 1) {
          // Single colorway minimum (30 for Our Blanks, 75 for Custom)
          totalMinimum += minimumPerColorway;
        } else {
          // Multiple colorways minimum per colorway (20 for Our Blanks, 50 for Custom)
          totalMinimum += colorwayCount * minimumPerColorway;
        }
      });
      
      // Ensure at least the single colorway minimum for the production type
      const fallbackMinimum = getMinimumQuantity(1);
      return Math.max(totalMinimum, fallbackMinimum);
    }

    getTotalQuantityFromAllColorways() {
      let total = 0;
      const colorwayInputs = document.querySelectorAll('.techpack-size-grid__input[type="number"]');
      
      colorwayInputs.forEach(input => {
        const value = parseInt(input.value) || 0;
        total += value;
      });
      
      return total;
    }

    calculateAndUpdateProgress() {
      // Check if this is a sample request - samples don't need quantity minimums
      const requestType = document.getElementById('request-type')?.value;
      if (requestType === 'sample-request') {
        // For sample requests, set totals to 0 and progress to 100%
        this.updateTotalQuantityDisplay(0, 0, []);
        this.updateQuantityProgressBar(100);
        
        // Update minimum text to indicate sample request
        const minText = document.getElementById('min-text');
        if (minText) minText.textContent = 'Sample Request (No minimum)';
        
        debugSystem.log('Sample request - no quantity minimum required');
        return 100;
      }
      
      const totalQuantity = this.getTotalQuantityFromAllColorways();
      const minimumRequired = this.calculateMinimumRequired();
      
      // FIXED: Get detailed garment breakdown for better messaging
      const garmentDetails = this.getGarmentDetails();
      const percentage = Math.min((totalQuantity / minimumRequired) * 100, 100);
      
      this.updateTotalQuantityDisplay(totalQuantity, minimumRequired, garmentDetails);
      this.updateStatusMessage(totalQuantity, minimumRequired, percentage, garmentDetails);
      this.updateColorwayValidationMessages();
      this.updateQuantityProgressBar(percentage);
      
      debugSystem.log('Quantity progress calculated', {
        total: totalQuantity,
        minRequired: minimumRequired,
        progress: percentage.toFixed(1) + '%',
        garmentDetails
      });
      
      return percentage;
    }

    // NEW: Get detailed breakdown of each garment
    getGarmentDetails() {
      const garments = document.querySelectorAll('.techpack-garment');
      return Array.from(garments).map(garment => {
        const colorways = garment.querySelectorAll('.techpack-colorway');
        return {
          colorways: colorways.length,
          total: this.getGarmentTotal(garment.dataset.garmentId)
        };
      });
    }

    // NEW: Get total for a specific garment
    getGarmentTotal(garmentId) {
      const garment = document.querySelector(`[data-garment-id="${garmentId}"]`);
      if (!garment) return 0;

      const colorways = garment.querySelectorAll('.techpack-colorway');
      let total = 0;

      colorways.forEach(colorway => {
        const colorwayId = colorway.dataset.colorwayId;
        total += this.updateColorwayTotal(colorwayId);
      });

      return total;
    }

    // FIXED: Update garment total display
    updateGarmentTotal(garmentId) {
      const garment = document.querySelector(`[data-garment-id="${garmentId}"]`);
      if (!garment) return 0;

      const total = this.getGarmentTotal(garmentId);

      const totalElement = garment.querySelector('.techpack-garment__total-value');
      if (totalElement) {
        totalElement.textContent = total;
      }

      return total;
    }

    updateTotalQuantityDisplay(totalQuantity, minimumRequired, colorwayCount) {
      const totalQuantityElement = document.querySelector('#total-quantity, .total-quantity-value, .techpack-total-quantity');
      if (totalQuantityElement) {
        const percentage = Math.min((totalQuantity / minimumRequired) * 100, 100);
        const currentPercentage = parseInt(totalQuantityElement.textContent) || 0;
        Utils.animateNumber(currentPercentage, Math.round(percentage), totalQuantityElement, '%');
      }
      
      const minTextElement = document.querySelector('#min-text, .total-quantity-text, [data-quantity-text]');
      if (minTextElement) {
        const singleMinimum = getMinimumQuantity(1);
        const newText = colorwayCount === 1 ? `/ ${singleMinimum} minimum` : `/ ${minimumRequired} minimum`;
        
        if (minTextElement.textContent !== newText) {
          minTextElement.style.opacity = '0.5';
          setTimeout(() => {
            minTextElement.textContent = newText;
            minTextElement.style.opacity = '1';
          }, 150);
        }
      }
      
      const quantityCounter = document.querySelector('.quantity-counter, .total-items');
      if (quantityCounter) {
        const colorwayText = colorwayCount === 1 ? '1 colorway' : `${colorwayCount} colorways`;
        quantityCounter.innerHTML = `<strong>${totalQuantity}</strong> units (${colorwayText})`;
      }
    }

    updateStatusMessage(totalQuantity, minimumRequired, percentage, colorwayCount) {
      const messageElement = document.querySelector('.techpack-colorways-message, .quantity-status-message');
      if (!messageElement) return;

      if (percentage >= 100) {
        messageElement.classList.add('success');
        messageElement.classList.remove('warning');
        messageElement.textContent = '✅ Minimum quantity reached!';
      } else {
        messageElement.classList.remove('success');
        messageElement.classList.add('warning');
        const remaining = minimumRequired - totalQuantity;
        
        if (colorwayCount === 1) {
          const singleMinimum = getMinimumQuantity(1);
          messageElement.textContent = `Need ${remaining} more units (${singleMinimum} minimum for single colorway)`;
        } else {
          const multipleMinimum = getMinimumQuantity(2);
          messageElement.textContent = `Need ${remaining} more units (${colorwayCount} colorways × ${multipleMinimum} each)`;
        }
      }
    }

    updateColorwayValidationMessages() {
      const garments = document.querySelectorAll('.techpack-garment');
      
      garments.forEach(garment => {
        const colorwaysInGarment = garment.querySelectorAll('.techpack-colorway[data-colorway-id]');
        const colorwayCountInGarment = colorwaysInGarment.length;
        
        colorwaysInGarment.forEach(colorway => {
          const colorwayId = colorway.dataset.colorwayId;
          const colorwayTotal = this.updateColorwayTotal(colorwayId);
          const requiredPerColorway = getMinimumQuantity(colorwayCountInGarment);
          
          let warningEl = colorway.querySelector('.colorway-minimum-warning');
          if (!warningEl) {
            warningEl = this.createColorwayWarningElement(colorway);
          }
          
          if (colorwayTotal < requiredPerColorway) {
            const remaining = requiredPerColorway - colorwayTotal;
            let message;
            
            if (colorwayCountInGarment === 1) {
              const singleMinimum = getMinimumQuantity(1);
              message = `⚠️ Need ${remaining} more units (${singleMinimum} minimum for single colorway)`;
            } else {
              const multipleMinimum = getMinimumQuantity(2);
              message = `⚠️ Need ${remaining} more units (${multipleMinimum} minimum per colorway when multiple colorways)`;
            }
            
            warningEl.innerHTML = message;
            warningEl.style.display = 'block';
            warningEl.className = 'colorway-minimum-warning warning';
            
            const totalEl = colorway.querySelector('.techpack-colorway__total-value');
            if (totalEl) {
              totalEl.style.cssText = 'color: #ef4444 !important; font-weight: bold !important; background: #fef2f2; padding: 0.25rem 0.5rem; border-radius: 0.25rem; border: 1px solid #fecaca;';
            }
          } else {
            const minimumText = getMinimumQuantity(colorwayCountInGarment);
            warningEl.style.display = 'block';
            warningEl.innerHTML = `✅ Perfect! ${colorwayTotal} units (Min: ${minimumText} ${colorwayCountInGarment === 1 ? 'for single colorway' : 'per colorway'})`;
            warningEl.className = 'colorway-minimum-warning success';
            
            const totalEl = colorway.querySelector('.techpack-colorway__total-value');
            if (totalEl) {
              totalEl.style.cssText = '';
            }
          }
        });
      });
    }

    createColorwayWarningElement(colorway) {
      const warningEl = document.createElement('div');
      warningEl.className = 'colorway-minimum-warning';
      warningEl.style.cssText = `
        padding: 0.75rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        margin-top: 0.75rem;
        transition: all 0.3s ease;
      `;
      
      const sizeGrid = colorway.querySelector('.techpack-size-grid');
      if (sizeGrid) {
        sizeGrid.insertAdjacentElement('afterend', warningEl);
      }
      
      return warningEl;
    }

    updateQuantityProgressBar(percentage) {
      try {
        const quantityProgressBar = document.getElementById('quantity-progress');
        
        if (quantityProgressBar) {
          try {
            // Use CSS custom properties for smooth animation
            quantityProgressBar.style.transition = 'width var(--techpack-transition-smooth), background-color var(--techpack-transition-fast)';
            quantityProgressBar.style.width = `${percentage}%`;
            
            // Add visual feedback classes
            quantityProgressBar.classList.remove('quantity-progress-low', 'quantity-progress-medium', 'quantity-progress-high');
            
            if (percentage >= 100) {
              quantityProgressBar.classList.add('quantity-complete', 'quantity-progress-high');
              quantityProgressBar.style.animationPlayState = 'running';
            } else if (percentage >= 75) {
              quantityProgressBar.classList.add('quantity-progress-high');
              quantityProgressBar.classList.remove('quantity-complete');
              quantityProgressBar.style.animationPlayState = 'paused';
            } else if (percentage >= 50) {
              quantityProgressBar.classList.add('quantity-progress-medium');
              quantityProgressBar.classList.remove('quantity-complete');
              quantityProgressBar.style.animationPlayState = 'paused';
            } else {
              quantityProgressBar.classList.add('quantity-progress-low');
              quantityProgressBar.classList.remove('quantity-complete');
              quantityProgressBar.style.animationPlayState = 'paused';
            }
            
            debugSystem.log(`📊 Progress bar updated: ${percentage}%`, { element: 'quantity-progress' });
          } catch (styleError) {
            debugSystem.log('❌ Error applying progress bar styles:', styleError, 'error');
          }
        } else {
          debugSystem.log('⚠️ Quantity progress bar element not found', null, 'warn');
        }

        const tracker = document.querySelector('.techpack-quantity-tracker');
        if (tracker) {
          try {
            const isComplete = percentage >= 100;
            tracker.classList.toggle('techpack-quantity-tracker--complete', isComplete);
            
            if (isComplete && !tracker.hasAttribute('data-achieved')) {
              tracker.setAttribute('data-achieved', 'true');
              tracker.classList.add('achievement-unlocked');
              setTimeout(() => {
                tracker.classList.remove('achievement-unlocked');
              }, 1000);
            } else if (!isComplete) {
              tracker.removeAttribute('data-achieved');
            }
          } catch (trackerError) {
            debugSystem.log('❌ Error updating quantity tracker:', trackerError, 'error');
          }
        }
      } catch (error) {
        debugSystem.log('❌ Critical error in updateQuantityProgressBar:', error, 'error');
        // Store error for next load
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('techpack_quantity_progress_error', JSON.stringify({
            error: error.message,
            timestamp: new Date().toISOString(),
            percentage: percentage
          }));
        }
      }
    }

    updateColorwayTotal(colorwayId) {
      const colorway = document.querySelector(`[data-colorway-id="${colorwayId}"]`);
      if (!colorway) return 0;

      const qtyInputs = colorway.querySelectorAll('.techpack-size-grid__input');
      let total = 0;

      qtyInputs.forEach(input => {
        const value = parseInt(input.value) || 0;
        total += value;
      });

      const totalElement = colorway.querySelector('.techpack-colorway__total-value');
      if (totalElement) {
        totalElement.textContent = total;
      }

      return total;
    }

    getMaxAllowedSizes(quantity) {
      if (quantity >= 300) return 7;
      if (quantity >= 150) return 6;
      if (quantity >= 75) return 5;
      if (quantity >= 50) return 4;
      if (quantity >= 30) return 3; // Updated for Our Blanks single colorway minimum
      if (quantity >= 20) return 2; // Updated for Our Blanks multiple colorway minimum
      if (quantity >= 1) return 1;
      return 0;
    }

    validateQuantityInputs(colorwayId) {
      const colorway = document.querySelector(`[data-colorway-id="${colorwayId}"]`);
      if (!colorway) return;

      const qtyInputs = colorway.querySelectorAll('.techpack-size-grid__input');
      const colorwayTotal = this.updateColorwayTotal(colorwayId);
      
      // FIXED: Get colorway count for THIS garment only and use correct minimums
      const garment = colorway.closest('.techpack-garment');
      const colorwayCountInGarment = garment.querySelectorAll('.techpack-colorway').length;
      const requiredPerColorway = getMinimumQuantity(colorwayCountInGarment);
      
      const activeSizes = Array.from(qtyInputs).filter(input => parseInt(input.value) || 0 > 0).length;
      const maxAllowedSizes = this.getMaxAllowedSizes(colorwayTotal);
      
      qtyInputs.forEach(input => {
        const value = parseInt(input.value) || 0;
        
        input.classList.remove('quantity-empty', 'quantity-filled', 'quantity-progress', 'quantity-excess', 'quantity-neutral');
        
        if (value > 0) {
          if (colorwayTotal < requiredPerColorway) {
            input.classList.add('quantity-progress');
          } else {
            input.classList.add('quantity-filled');
          }
        } else {
          if (colorwayTotal < requiredPerColorway) {
            input.classList.add('quantity-empty');
          } else {
            input.classList.add('quantity-neutral');
          }
        }
        
        if (activeSizes > maxAllowedSizes && value > 0) {
          input.classList.add('quantity-excess');
          input.title = `Too many sizes for ${colorwayTotal} units. Maximum ${maxAllowedSizes} sizes allowed.`;
        } else {
          input.title = '';
        }
      });
      
      // Update size distribution warning
      let warningEl = colorway.querySelector('.size-distribution-warning');
      if (!warningEl) {
        warningEl = this.createSizeWarningElement(colorway);
      }
      
      if (activeSizes > maxAllowedSizes) {
        warningEl.style.display = 'block';
        warningEl.innerHTML = `⚠️ Too many sizes! With ${colorwayTotal} units, you can use maximum ${maxAllowedSizes} sizes.`;
        warningEl.className = 'size-distribution-warning warning';
      } else if (colorwayTotal < requiredPerColorway) {
        warningEl.style.display = 'block';
        const productionType = state.formData.clientInfo.productionType || 'custom-production';
        const productionLabel = productionType === 'our-blanks' ? 'Our Blanks' : 'Custom Production';
        warningEl.innerHTML = `📊 Need ${requiredPerColorway - colorwayTotal} more units (${requiredPerColorway} minimum for ${productionLabel}). Current: ${activeSizes} sizes, Max allowed: ${maxAllowedSizes} sizes.`;
        warningEl.className = 'size-distribution-warning info';
      } else {
        warningEl.style.display = 'block';
        const productionType = state.formData.clientInfo.productionType || 'custom-production';
        const productionLabel = productionType === 'our-blanks' ? 'Our Blanks' : 'Custom Production';
        warningEl.innerHTML = `✅ Perfect! ${colorwayTotal} units across ${activeSizes} sizes (Min: ${requiredPerColorway} for ${productionLabel}, Max sizes: ${maxAllowedSizes}).`;
        warningEl.className = 'size-distribution-warning success';
      }
    }

    createSizeWarningElement(colorway) {
      const warningEl = document.createElement('div');
      warningEl.className = 'size-distribution-warning';
      warningEl.style.cssText = `
        padding: 0.75rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        margin-top: 0.75rem;
        transition: all 0.3s ease;
      `;
      
      const sizeGrid = colorway.querySelector('.techpack-size-grid');
      if (sizeGrid) {
        sizeGrid.insertAdjacentElement('afterend', warningEl);
      }
      
      return warningEl;
    }
  }

  // Enhanced Garment Manager
  class GarmentManager {
    constructor() {
      this.setupEventListeners();
    }

    setupEventListeners() {
      const addGarmentBtn = document.querySelector('#add-garment');
      if (addGarmentBtn) {
        addGarmentBtn.addEventListener('click', () => this.addGarment());
      }
    }

    addGarment() {
      const template = document.querySelector('#garment-template');
      const container = document.querySelector('#garments-container');
      
      if (!template || !container) return;

      const garmentId = `garment-${++state.counters.garment}`;
      const clone = template.content.cloneNode(true);
      const garment = clone.querySelector('.techpack-garment');
      
      garment.dataset.garmentId = garmentId;
      
      // Set the garment number based on current count of garments, not counter
      const currentGarmentCount = document.querySelectorAll('.techpack-garment').length + 1;
      garment.querySelector('.techpack-garment__number').textContent = currentGarmentCount;
      
      // Setup event listeners
      this.setupGarmentEventListeners(garment, garmentId);
      
      // Initialize fabric options with default garment type (if any)
      const garmentTypeSelect = garment.querySelector('select[name="garmentType"]');
      const fabricSelect = garment.querySelector('select[name="fabricType"]');
      if (garmentTypeSelect && fabricSelect) {
        // Initialize fabric options based on current garment type (empty for new garments)
        this.updateFabricOptions(garmentTypeSelect.value, fabricSelect, false);
      }
      
      container.appendChild(garment);

      // Apply production-specific interface
      const productionType = state.formData.clientInfo.productionType || 'custom-production';
      stepManager.updateGarmentInterface(garment, productionType);
      
      // Add to state
      state.formData.garments.push({
        id: garmentId,
        type: '',
        fabric: '',
        printingMethods: [],
        colorways: []
      });
      
      // Add initial colorway
      this.addColorway(garmentId);
      
      // Animate in
      animationManager.slideIn(garment, 'down');
      
      // Trigger calculation
      setTimeout(() => quantityCalculator.calculateAndUpdateProgress(), 100);
      
      // Initialize sample system for new garment and check request type
      if (window.sampleManager) {
        window.sampleManager.initializeGarmentSampleData(garmentId);
        // Recheck request type to show/hide sample sections
        setTimeout(() => window.sampleManager.checkRequestType(), 50);
      }
      
      debugSystem.log('Garment added', { garmentId });
    }

    // Update fabric options based on selected garment type
    updateFabricOptions(garmentType, fabricSelect, preserveSelection = true) {
      if (!fabricSelect) return;

      // Get current selection to preserve if possible
      const currentSelection = preserveSelection ? fabricSelect.value : '';
      
      // Handle empty garment type
      if (!garmentType) {
        fabricSelect.innerHTML = '<option value="">Choose garment type 1st</option>';
        fabricSelect.disabled = true;
        debugSystem.log('Fabric dropdown disabled - no garment type selected');
        return;
      }

      // Re-enable fabric select if it was disabled
      fabricSelect.disabled = false;
      
      // Get fabric options for this garment type
      const fabricOptions = CONFIG.FABRIC_TYPE_MAPPING[garmentType] || [];
      
      // Clear existing options except the placeholder
      fabricSelect.innerHTML = '<option value="">Select fabric type...</option>';
      
      // Add new options
      fabricOptions.forEach(fabric => {
        const option = document.createElement('option');
        option.value = fabric;
        option.textContent = fabric;
        fabricSelect.appendChild(option);
      });
      
      // Restore selection if it's still valid
      if (currentSelection && fabricOptions.includes(currentSelection)) {
        fabricSelect.value = currentSelection;
      } else if (currentSelection) {
        // Current selection is no longer valid, reset and show message
        fabricSelect.value = '';
        debugSystem.log('Fabric selection reset due to garment type change', { 
          garmentType, 
          previousFabric: currentSelection 
        });
      }

      // Trigger change event to update validations and summaries
      fabricSelect.dispatchEvent(new Event('change', { bubbles: true }));
      
      debugSystem.log('Fabric options updated', { 
        garmentType, 
        optionCount: fabricOptions.length,
        preservedSelection: fabricSelect.value 
      });
    }

    setupGarmentEventListeners(garment, garmentId) {
      // Remove button
      const removeBtn = garment.querySelector('.techpack-garment__remove');
      removeBtn.addEventListener('click', () => this.removeGarment(garmentId));
      
      // Add colorway button
      const addColorwayBtn = garment.querySelector('.add-colorway');
      addColorwayBtn.addEventListener('click', () => this.addColorway(garmentId));
      
      // Garment type select
      const garmentTypeSelect = garment.querySelector('select[name="garmentType"]');
      if (garmentTypeSelect) {
        garmentTypeSelect.addEventListener('change', () => {
          const garmentData = state.formData.garments.find(g => g.id === garmentId);
          if (garmentData) {
            garmentData.type = garmentTypeSelect.value;
          }
          
          // Update fabric options based on new garment type
          const fabricSelect = garment.querySelector('select[name="fabricType"]');
          this.updateFabricOptions(garmentTypeSelect.value, fabricSelect, true);
          
          stepManager.validateStep3();
          
          // Update sample summary if in sample mode
          if (window.sampleManager && window.sampleManager.perGarmentSamples && state.formData.requestType === 'sample-request') {
            const sampleData = window.sampleManager.perGarmentSamples.get(garmentId);
            if (sampleData) {
              window.sampleManager.updateGarmentSampleSummary(garment, sampleData);
            }
          }
        });
      }

      // Fabric type select
      const fabricSelect = garment.querySelector('select[name="fabricType"]');
      if (fabricSelect) {
        fabricSelect.addEventListener('change', () => {
          const garmentData = state.formData.garments.find(g => g.id === garmentId);
          if (garmentData) {
            garmentData.fabric = fabricSelect.value;
          }
          stepManager.validateStep3();
          
          // Update sample summary if in sample mode
          if (window.sampleManager && window.sampleManager.perGarmentSamples && state.formData.requestType === 'sample-request') {
            const sampleData = window.sampleManager.perGarmentSamples.get(garmentId);
            if (sampleData) {
              window.sampleManager.updateGarmentSampleSummary(garment, sampleData);
            }
          }
        });
      }

      // Printing methods
      this.setupPrintingMethodsLogic(garment, garmentId);
    }

    setupPrintingMethodsLogic(garment, garmentId) {
      const checkboxes = garment.querySelectorAll('input[name="printingMethods[]"]');
      const noneCheckbox = garment.querySelector('input[value="None"]');
      
      // Create a debounced validation function
      const debouncedValidation = Utils.debounce(() => {
        stepManager.validateStep3();
      }, 100);
      
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          // Handle "None" checkbox logic
          if (checkbox.value === 'None' && checkbox.checked) {
            checkboxes.forEach(cb => {
              if (cb.value !== 'None') cb.checked = false;
            });
          } else if (checkbox.value !== 'None' && checkbox.checked) {
            if (noneCheckbox) noneCheckbox.checked = false;
          }
          
          // Update state immediately
          const garmentData = state.formData.garments.find(g => g.id === garmentId);
          if (garmentData) {
            const checkedBoxes = garment.querySelectorAll('input[name="printingMethods[]"]:checked');
            garmentData.printingMethods = Array.from(checkedBoxes).map(cb => cb.value);
          }
          
          // Clear any existing error state immediately
          const printingGroup = garment.querySelector('.techpack-form__checkboxes')?.closest('.techpack-form__group');
          const printingError = printingGroup?.querySelector('.techpack-form__error');
          
          if (printingGroup) {
            printingGroup.classList.remove('techpack-form__group--error');
          }
          if (printingError) {
            printingError.textContent = '';
          }
          
          // Validate with debounce to prevent interference
          debouncedValidation();
        });
      });
    }

    removeGarment(garmentId) {
      const garment = document.querySelector(`[data-garment-id="${garmentId}"]`);
      if (!garment) return;
    
      const garments = document.querySelectorAll('.techpack-garment');
      if (garments.length <= 1) {
        debugSystem.log('Cannot remove last garment', null, 'warn');
        return;
      }
    
      // Remove from DOM with animation
      animationManager.fadeOut(garment).then(() => {
        garment.remove();
        
        // CRITICAL: Update state immediately after DOM removal
        state.formData.garments = state.formData.garments.filter(g => g.id !== garmentId);
        
        // Clean up sample data for removed garment
        if (window.sampleManager && window.sampleManager.perGarmentSamples) {
          window.sampleManager.perGarmentSamples.delete(garmentId);
          debugSystem.log('Cleaned up sample data for removed garment', { garmentId });
        }
        
        // IMPORTANT: Renumber all remaining garments
        this.renumberGarments();
        
        // Force immediate recalculation
        quantityCalculator.calculateAndUpdateProgress();
        
        // Update step validation
        stepManager.validateStep3();
        
        debugSystem.log('Garment removed and progress updated', { garmentId });
      });
    }

    // NEW METHOD: Renumber garments after deletion
    renumberGarments() {
      const garments = document.querySelectorAll('.techpack-garment');
      garments.forEach((garment, index) => {
        const numberElement = garment.querySelector('.techpack-garment__number');
        if (numberElement) {
          numberElement.textContent = index + 1;
        }
        
        // Also update any titles that show garment numbers
        const titleElement = garment.querySelector('.techpack-garment__title');
        if (titleElement) {
          const currentText = titleElement.textContent;
          // Replace any existing "Garment X" with the new number
          titleElement.textContent = currentText.replace(/Garment \d+/g, `Garment ${index + 1}`);
        }
      });
      
      debugSystem.log('Garments renumbered', { total: garments.length });
    }

    addColorway(garmentId) {
      const garment = document.querySelector(`[data-garment-id="${garmentId}"]`);
      const template = document.querySelector('#colorway-template');
      
      if (!garment || !template) return;

      const colorwaysList = garment.querySelector('.techpack-colorways__list');
      const colorwayId = `colorway-${++state.counters.colorway}`;
      const clone = template.content.cloneNode(true);
      const colorway = clone.querySelector('.techpack-colorway');
      
      colorway.dataset.colorwayId = colorwayId;
      
      this.setupColorwayEventListeners(colorway, garmentId, colorwayId);
      
      // Check request type and conditionally show/hide size grid
      this.handleSizeGridBasedOnRequestType(colorway);
      
      colorwaysList.appendChild(clone);
      
      // Add to state
      const garmentData = state.formData.garments.find(g => g.id === garmentId);
      if (garmentData) {
        garmentData.colorways.push({
          id: colorwayId,
          color: '#000000',
          pantone: '',
          quantities: {}
        });
      }
      
      // Animate in
      animationManager.slideIn(colorway, 'down');
      
      // CRITICAL: Don't trigger validation immediately, let it settle first
      setTimeout(() => {
        quantityCalculator.calculateAndUpdateProgress();
        // FIXED: Update colorway validation messages when colorway count changes
        quantityCalculator.updateColorwayValidationMessages();
        // Use a longer delay for validation to prevent interference
        setTimeout(() => {
          stepManager.validateStep3();
        }, 200);
      }, 100);
      
      debugSystem.log('Colorway added', { garmentId, colorwayId });
    }

    handleSizeGridBasedOnRequestType(colorway) {
      // Get the request type from the form
      const requestType = document.getElementById('request-type')?.value;
      const sizeGrid = colorway.querySelector('.techpack-size-grid');
      
      if (sizeGrid && requestType === 'sample-request') {
        // For Sample Request: Hide the size grid completely, no quantities needed
        sizeGrid.style.display = 'none';
        sizeGrid.setAttribute('data-hidden-for-sample', 'true');
        
        // Set colorway total to 0 since no quantities are needed for samples
        const totalElement = colorway.querySelector('.techpack-colorway__total-value');
        if (totalElement) {
          totalElement.textContent = '0';
        }
        
        debugSystem.log('Size grid hidden for sample request', { requestType });
      } else if (sizeGrid && requestType === 'bulk-order-request') {
        // For Bulk Order Request: Show the size grid (default behavior)
        sizeGrid.style.display = 'block';
        sizeGrid.removeAttribute('data-hidden-for-sample');
        debugSystem.log('Size grid shown for bulk order request', { requestType });
      } else if (sizeGrid) {
        // Default case: keep existing pantone-based logic
        sizeGrid.style.display = sizeGrid.getAttribute('data-requires-pantone') === 'true' ? 'none' : 'block';
      }
    }

    setupColorwayEventListeners(colorway, garmentId, colorwayId) {
      // Remove button
      const removeBtn = colorway.querySelector('.techpack-colorway__remove');
      removeBtn.addEventListener('click', () => this.removeColorway(garmentId, colorwayId));
      
      // Color picker and button Pantone system
      const colorPicker = colorway.querySelector('.techpack-color-picker__input');
      const colorPreview = colorway.querySelector('.techpack-color-picker__preview');
      const pantoneButtons = colorway.querySelector('.techpack-pantone-buttons');
      const pantoneValidationMsg = colorway.querySelector('.techpack-pantone-validation-message');
      
      if (pantoneButtons && colorPicker) {
        const pantoneButtonElements = pantoneButtons.querySelectorAll('button.techpack-btn--pantone-compact');
        
        colorPicker.addEventListener('change', () => {
          // Fix mobile null reference error - check colorPreview exists
          if (colorPreview) {
            colorPreview.style.backgroundColor = colorPicker.value;
          }
          
          // Auto-select closest 2 Pantone colors for buttons
          const closestPantones = this.findClosestPantoneColors(colorPicker.value, 2);
          
          // Populate the 2 Pantone buttons with improved visual design
          closestPantones.forEach((pantone, index) => {
            if (pantoneButtonElements[index]) {
              const button = pantoneButtonElements[index];
              const pantoneNameSpan = button.querySelector('.techpack-pantone-text');
              const colorCircle = button.querySelector('.techpack-pantone-circle');
              
              if (pantoneNameSpan && colorCircle) {
                // Update hex color circle
                button.style.setProperty('--pantone-hex', pantone.hex);
                colorCircle.style.backgroundColor = pantone.hex;
                
                // Update the text content
                pantoneNameSpan.textContent = pantone.code;
                
                // Update data attributes
                button.dataset.pantoneCode = pantone.code;
                button.dataset.pantoneHex = pantone.hex;
                
                // Enable the button
                button.disabled = false;
                button.classList.remove('opacity-50');
              }
            }
          });
          
          // Show the pantone buttons - already checked for null above
          pantoneButtons.style.display = 'block';
          
          // Update state
          const garmentData = state.formData.garments.find(g => g.id === garmentId);
          if (garmentData) {
            const colorwayData = garmentData.colorways.find(c => c.id === colorwayId);
            if (colorwayData) {
              colorwayData.color = colorPicker.value;
              colorwayData.pantoneOptions = closestPantones;
            }
          }
          
          this.validatePantoneSelection(colorway);
        });
        
        // Add click handlers for Pantone buttons (SINGLE SELECTION)
        pantoneButtonElements.forEach((button, index) => {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Single selection behavior: deselect all others first
            pantoneButtonElements.forEach(btn => {
              btn.classList.remove('selected');
              // Radio dot styling handled by CSS classes
            });
            
            // Select the clicked button
            button.classList.add('selected');
            
            // Radio dot styling handled by CSS classes
            
            // Show the size grid now that pantone is selected
            const sizeGrid = colorway.querySelector('.techpack-size-grid[data-requires-pantone="true"]');
            if (sizeGrid) {
              sizeGrid.style.display = 'block';
            }
            
            // Update colorway data
            this.updateColorwayPantoneData(garmentId, colorwayId);
            
            // Validate selection
            this.validatePantoneSelection(colorway);
          });
        });
        
        // Sample request functionality - In-place transformation
        const sampleToggle = colorway.querySelector('.techpack-sample-toggle');
        if (sampleToggle) {
          const sampleRequestBtn = sampleToggle.querySelector('.techpack-btn--sample-request');
          const sampleSizeSelector = sampleToggle.querySelector('.techpack-form__select--sample-size');
          
          if (sampleRequestBtn && sampleSizeSelector) {
            sampleRequestBtn.addEventListener('click', (e) => {
              e.preventDefault();
              // Smooth transition to select
              sampleRequestBtn.style.opacity = '0';
              sampleRequestBtn.style.pointerEvents = 'none';
              sampleSizeSelector.style.display = 'block';
              sampleSizeSelector.style.opacity = '1';
              sampleSizeSelector.style.pointerEvents = 'auto';
              sampleSizeSelector.focus(); // Focus the select for better UX
            });
            
            // Handle dropdown change and blur events
            sampleSizeSelector.addEventListener('change', (e) => {
              if (e.target.value === '') {
                // If no size selected, go back to button
                sampleRequestBtn.style.opacity = '1';
                sampleRequestBtn.style.pointerEvents = 'auto';
                sampleSizeSelector.style.opacity = '0';
                sampleSizeSelector.style.pointerEvents = 'none';
                setTimeout(() => {
                  sampleSizeSelector.style.display = 'none';
                }, 200);
              }
            });
            
            sampleSizeSelector.addEventListener('blur', (e) => {
              // If no value selected on blur, go back to button
              if (e.target.value === '') {
                sampleRequestBtn.style.opacity = '1';
                sampleRequestBtn.style.pointerEvents = 'auto';
                sampleSizeSelector.style.opacity = '0';
                sampleSizeSelector.style.pointerEvents = 'none';
                setTimeout(() => {
                  sampleSizeSelector.style.display = 'none';
                }, 200);
              }
            });
          }
        }
      }
      
      // Fix mobile null reference error - check colorPreview and colorPicker exist
      if (colorPreview && colorPicker) {
        colorPreview.style.backgroundColor = colorPicker.value;
      }

      // Quantity inputs
      const qtyInputs = colorway.querySelectorAll('.techpack-size-grid__input');
      qtyInputs.forEach(input => {
        const debouncedUpdate = Utils.debounce(() => {
          quantityCalculator.validateQuantityInputs(colorwayId);
          quantityCalculator.updateColorwayTotal(colorwayId);
          quantityCalculator.calculateAndUpdateProgress();
          
          // SMART: Only trigger step validation if quantities are sufficient
          const colorwayTotal = quantityCalculator.updateColorwayTotal(colorwayId);
          const garment = colorway.closest('.techpack-garment');
          const colorwayCountInGarment = garment.querySelectorAll('.techpack-colorway').length;
          const requiredPerColorway = getMinimumQuantity(colorwayCountInGarment);
          
          // Only validate step if we're close to or above minimum to avoid interference
          if (colorwayTotal >= requiredPerColorway * 0.8) {
            setTimeout(() => stepManager.validateStep3(), 300);
          }
        }, 200);

        input.addEventListener('input', debouncedUpdate);
        input.addEventListener('change', debouncedUpdate);
      });
    }

    // Find closest Pantone color match
    findClosestPantoneColor(hexColor) {
      // Use the comprehensive pantone database from findClosestPantoneColors
      // and return just the first (closest) match
      const results = this.findClosestPantoneColors(hexColor, 1);
      if (results && results.length > 0) {
        return {
          code: results[0].code,
          confidence: results[0].confidence
        };
      }
      
      return null;
    }

    // LEGACY: Old function preserved for reference
    findClosestPantoneColorOld(hexColor) {
      // Comprehensive Pantone color database with 487+ colors
      const pantoneColors = [
        // Basic Colors
        { code: 'PANTONE Black 6 C', hex: '#2D2926', name: 'Black' },
        { code: 'PANTONE 11-4001 TPX', hex: '#F5F5F5', name: 'White' },
        { code: 'PANTONE Cool Gray 1 C', hex: '#F2F2F2', name: 'Cool Gray 1' },
        { code: 'PANTONE Cool Gray 2 C', hex: '#EDEDED', name: 'Cool Gray 2' },
        { code: 'PANTONE Cool Gray 3 C', hex: '#E8E8E8', name: 'Cool Gray 3' },
        { code: 'PANTONE Cool Gray 4 C', hex: '#D4D4D4', name: 'Cool Gray 4' },
        { code: 'PANTONE Cool Gray 5 C', hex: '#C7C7C7', name: 'Cool Gray 5' },
        { code: 'PANTONE Cool Gray 6 C', hex: '#B2B2B2', name: 'Cool Gray 6' },
        { code: 'PANTONE Cool Gray 7 C', hex: '#9E9E9E', name: 'Cool Gray 7' },
        { code: 'PANTONE Cool Gray 8 C', hex: '#8A8A8A', name: 'Cool Gray 8' },
        { code: 'PANTONE Cool Gray 9 C', hex: '#767676', name: 'Cool Gray 9' },
        { code: 'PANTONE Cool Gray 10 C', hex: '#646464', name: 'Cool Gray 10' },
        { code: 'PANTONE Cool Gray 11 C', hex: '#53565A', name: 'Cool Gray 11' },
        
        // Reds
        { code: 'PANTONE 18-1664 TPX', hex: '#C5282F', name: 'True Red' },
        { code: 'PANTONE 19-1664 TPX', hex: '#BC243C', name: 'Red' },
        { code: 'PANTONE 18-1142 TPX', hex: '#B83A4B', name: 'Burgundy' },
        { code: 'PANTONE 186 C', hex: '#E4002B', name: 'Red 186' },
        { code: 'PANTONE 199 C', hex: '#D70040', name: 'Red 199' },
        { code: 'PANTONE 18-1763 TPX', hex: '#D2001C', name: 'Fiery Red' },
        { code: 'PANTONE 18-1664 TPX', hex: '#BE1E2D', name: 'Barbados Cherry' },
        { code: 'PANTONE 19-1557 TPX', hex: '#B22222', name: 'Fire Brick' },
        { code: 'PANTONE 18-1555 TPX', hex: '#A0522D', name: 'Sienna' },
        { code: 'PANTONE 18-1547 TPX', hex: '#CD853F', name: 'Peru' },
        { code: 'PANTONE 18-1142 TPX', hex: '#8B0000', name: 'Dark Red' },
        { code: 'PANTONE 18-1664 TPX', hex: '#DC143C', name: 'Crimson' },
        { code: 'PANTONE 18-1755 TPX', hex: '#FF6347', name: 'Tomato' },
        { code: 'PANTONE 17-1456 TPX', hex: '#FF4500', name: 'Orange Red' },
        { code: 'PANTONE 18-1664 TPX', hex: '#FF0000', name: 'Red' },
        { code: 'PANTONE 18-1763 TPX', hex: '#B22222', name: 'Fire Brick' },
        { code: 'PANTONE 19-1664 TPX', hex: '#8B0000', name: 'Dark Red' },
        { code: 'PANTONE 18-1142 TPX', hex: '#A52A2A', name: 'Brown' },
        { code: 'PANTONE 18-1434 TPX', hex: '#CD5C5C', name: 'Indian Red' },
        { code: 'PANTONE 18-1548 TPX', hex: '#F08080', name: 'Light Coral' },
        
        // Blues
        { code: 'PANTONE 19-4052 TPX', hex: '#0F4C75', name: 'Classic Blue' },
        { code: 'PANTONE 17-5641 TPX', hex: '#34558B', name: 'Navy' },
        { code: 'PANTONE 14-4318 TPX', hex: '#92A8D1', name: 'Serenity' },
        { code: 'PANTONE 286 C', hex: '#0033A0', name: 'Blue 286' },
        { code: 'PANTONE 2925 C', hex: '#009CDE', name: 'Blue 2925' },
        { code: 'PANTONE 3125 C', hex: '#005F83', name: 'Blue 3125' },
        { code: 'PANTONE 19-4052 TPX', hex: '#003f5c', name: 'Deep Blue' },
        { code: 'PANTONE 19-4050 TPX', hex: '#000080', name: 'Navy Blue' },
        { code: 'PANTONE 19-3938 TPX', hex: '#191970', name: 'Midnight Blue' },
        { code: 'PANTONE 18-4045 TPX', hex: '#4682B4', name: 'Steel Blue' },
        { code: 'PANTONE 17-4037 TPX', hex: '#1E90FF', name: 'Dodger Blue' },
        { code: 'PANTONE 16-4132 TPX', hex: '#87CEEB', name: 'Sky Blue' },
        { code: 'PANTONE 15-4020 TPX', hex: '#ADD8E6', name: 'Light Blue' },
        { code: 'PANTONE 14-4318 TPX', hex: '#B0C4DE', name: 'Light Steel Blue' },
        { code: 'PANTONE 13-4110 TPX', hex: '#E6E6FA', name: 'Lavender' },
        { code: 'PANTONE 19-4052 TPX', hex: '#0000CD', name: 'Medium Blue' },
        { code: 'PANTONE 19-4050 TPX', hex: '#0000FF', name: 'Blue' },
        { code: 'PANTONE 18-4141 TPX', hex: '#6495ED', name: 'Cornflower Blue' },
        { code: 'PANTONE 17-4037 TPX', hex: '#4169E1', name: 'Royal Blue' },
        { code: 'PANTONE 16-4132 TPX', hex: '#00BFFF', name: 'Deep Sky Blue' },
        
        // Greens
        { code: 'PANTONE 15-0343 TPX', hex: '#88B04B', name: 'Greenery' },
        { code: 'PANTONE 18-0228 TPX', hex: '#4A5D23', name: 'Forest Green' },
        { code: 'PANTONE 355 C', hex: '#00B04F', name: 'Green 355' },
        { code: 'PANTONE 347 C', hex: '#009639', name: 'Green 347' },
        { code: 'PANTONE 348 C', hex: '#00A651', name: 'Green 348' },
        { code: 'PANTONE 18-0228 TPX', hex: '#006400', name: 'Dark Green' },
        { code: 'PANTONE 18-0142 TPX', hex: '#228B22', name: 'Forest Green' },
        { code: 'PANTONE 17-0145 TPX', hex: '#32CD32', name: 'Lime Green' },
        { code: 'PANTONE 16-0142 TPX', hex: '#90EE90', name: 'Light Green' },
        { code: 'PANTONE 15-0343 TPX', hex: '#9ACD32', name: 'Yellow Green' },
        { code: 'PANTONE 14-0244 TPX', hex: '#ADFF2F', name: 'Green Yellow' },
        { code: 'PANTONE 13-0317 TPX', hex: '#7CFC00', name: 'Lawn Green' },
        { code: 'PANTONE 12-0225 TPX', hex: '#00FF00', name: 'Lime' },
        { code: 'PANTONE 18-0228 TPX', hex: '#00FF7F', name: 'Spring Green' },
        { code: 'PANTONE 17-0145 TPX', hex: '#00FA9A', name: 'Medium Spring Green' },
        { code: 'PANTONE 16-0142 TPX', hex: '#98FB98', name: 'Pale Green' },
        { code: 'PANTONE 15-0343 TPX', hex: '#00FF7F', name: 'Spring Green' },
        { code: 'PANTONE 14-0244 TPX', hex: '#7FFFD4', name: 'Aquamarine' },
        { code: 'PANTONE 13-0317 TPX', hex: '#40E0D0', name: 'Turquoise' },
        { code: 'PANTONE 12-0225 TPX', hex: '#00CED1', name: 'Dark Turquoise' },
        
        // Yellows
        { code: 'PANTONE 13-0859 TPX', hex: '#EFC050', name: 'Yellow' },
        { code: 'PANTONE 102 C', hex: '#F7E018', name: 'Yellow 102' },
        { code: 'PANTONE 109 C', hex: '#D9E021', name: 'Yellow 109' },
        { code: 'PANTONE 116 C', hex: '#FFED4A', name: 'Yellow 116' },
        { code: 'PANTONE 13-0859 TPX', hex: '#FFFF00', name: 'Yellow' },
        { code: 'PANTONE 12-0738 TPX', hex: '#FFFFE0', name: 'Light Yellow' },
        { code: 'PANTONE 13-0859 TPX', hex: '#FFFACD', name: 'Lemon Chiffon' },
        { code: 'PANTONE 12-0738 TPX', hex: '#FAFAD2', name: 'Light Goldenrod Yellow' },
        { code: 'PANTONE 13-0859 TPX', hex: '#F0E68C', name: 'Khaki' },
        { code: 'PANTONE 14-0760 TPX', hex: '#EEE8AA', name: 'Pale Goldenrod' },
        { code: 'PANTONE 15-0751 TPX', hex: '#BDB76B', name: 'Dark Khaki' },
        { code: 'PANTONE 16-0946 TPX', hex: '#DAA520', name: 'Goldenrod' },
        { code: 'PANTONE 17-1047 TPX', hex: '#B8860B', name: 'Dark Goldenrod' },
        { code: 'PANTONE 18-1142 TPX', hex: '#FFD700', name: 'Gold' },
        { code: 'PANTONE 13-0859 TPX', hex: '#FFA500', name: 'Orange' },
        { code: 'PANTONE 14-1064 TPX', hex: '#FF8C00', name: 'Dark Orange' },
        { code: 'PANTONE 15-1247 TPX', hex: '#FF7F50', name: 'Coral' },
        { code: 'PANTONE 16-1546 TPX', hex: '#FF6347', name: 'Tomato' },
        { code: 'PANTONE 17-1456 TPX', hex: '#FF4500', name: 'Orange Red' },
        { code: 'PANTONE 18-1664 TPX', hex: '#FF0000', name: 'Red' },
        
        // Oranges
        { code: 'PANTONE 16-1546 TPX', hex: '#F7931E', name: 'Orange' },
        { code: 'PANTONE 165 C', hex: '#FF6900', name: 'Orange 165' },
        { code: 'PANTONE 1375 C', hex: '#FF8200', name: 'Orange 1375' },
        { code: 'PANTONE 1585 C', hex: '#FF9500', name: 'Orange 1585' },
        { code: 'PANTONE 16-1546 TPX', hex: '#FFA500', name: 'Orange' },
        { code: 'PANTONE 15-1247 TPX', hex: '#FF8C00', name: 'Dark Orange' },
        { code: 'PANTONE 14-1064 TPX', hex: '#FF7F50', name: 'Coral' },
        { code: 'PANTONE 13-1023 TPX', hex: '#FFA07A', name: 'Light Salmon' },
        { code: 'PANTONE 12-0722 TPX', hex: '#FFEFD5', name: 'Papaya Whip' },
        { code: 'PANTONE 13-1023 TPX', hex: '#FFEBCD', name: 'Blanched Almond' },
        { code: 'PANTONE 12-0722 TPX', hex: '#FFDEAD', name: 'Navajo White' },
        { code: 'PANTONE 13-1023 TPX', hex: '#F5DEB3', name: 'Wheat' },
        { code: 'PANTONE 14-1064 TPX', hex: '#DEB887', name: 'Burlywood' },
        { code: 'PANTONE 15-1247 TPX', hex: '#D2B48C', name: 'Tan' },
        { code: 'PANTONE 16-1546 TPX', hex: '#BC8F8F', name: 'Rosy Brown' },
        { code: 'PANTONE 17-1456 TPX', hex: '#F4A460', name: 'Sandy Brown' },
        { code: 'PANTONE 18-1142 TPX', hex: '#DA70D6', name: 'Orchid' },
        { code: 'PANTONE 17-1456 TPX', hex: '#FF69B4', name: 'Hot Pink' },
        { code: 'PANTONE 16-1546 TPX', hex: '#FF1493', name: 'Deep Pink' },
        { code: 'PANTONE 15-1247 TPX', hex: '#DC143C', name: 'Crimson' },
        
        // Pinks
        { code: 'PANTONE 18-3949 TPX', hex: '#C3447A', name: 'Pink' },
        { code: 'PANTONE 213 C', hex: '#FF1493', name: 'Pink 213' },
        { code: 'PANTONE 219 C', hex: '#E91E63', name: 'Pink 219' },
        { code: 'PANTONE 225 C', hex: '#F48FB1', name: 'Pink 225' },
        { code: 'PANTONE 18-3949 TPX', hex: '#FF69B4', name: 'Hot Pink' },
        { code: 'PANTONE 17-2031 TPX', hex: '#FF1493', name: 'Deep Pink' },
        { code: 'PANTONE 16-2120 TPX', hex: '#C71585', name: 'Medium Violet Red' },
        { code: 'PANTONE 15-2217 TPX', hex: '#DB7093', name: 'Pale Violet Red' },
        { code: 'PANTONE 14-2808 TPX', hex: '#FFB6C1', name: 'Light Pink' },
        { code: 'PANTONE 13-2807 TPX', hex: '#FFC0CB', name: 'Pink' },
        { code: 'PANTONE 12-2906 TPX', hex: '#FFCCCB', name: 'Misty Rose' },
        { code: 'PANTONE 11-2511 TPX', hex: '#FFE4E1', name: 'Misty Rose' },
        { code: 'PANTONE 18-3949 TPX', hex: '#FA8072', name: 'Salmon' },
        { code: 'PANTONE 17-2031 TPX', hex: '#E9967A', name: 'Dark Salmon' },
        { code: 'PANTONE 16-2120 TPX', hex: '#FFA07A', name: 'Light Salmon' },
        { code: 'PANTONE 15-2217 TPX', hex: '#CD5C5C', name: 'Indian Red' },
        { code: 'PANTONE 14-2808 TPX', hex: '#F08080', name: 'Light Coral' },
        { code: 'PANTONE 13-2807 TPX', hex: '#FF7F50', name: 'Coral' },
        { code: 'PANTONE 12-2906 TPX', hex: '#FF6347', name: 'Tomato' },
        { code: 'PANTONE 11-2511 TPX', hex: '#FF4500', name: 'Orange Red' },
        
        // Purples
        { code: 'PANTONE 18-3838 TPX', hex: '#6B5B95', name: 'Ultra Violet' },
        { code: 'PANTONE 2685 C', hex: '#7B68EE', name: 'Purple 2685' },
        { code: 'PANTONE 2725 C', hex: '#9370DB', name: 'Purple 2725' },
        { code: 'PANTONE 2765 C', hex: '#8A2BE2', name: 'Purple 2765' },
        { code: 'PANTONE 18-3838 TPX', hex: '#8B00FF', name: 'Violet' },
        { code: 'PANTONE 19-3536 TPX', hex: '#9400D3', name: 'Dark Violet' },
        { code: 'PANTONE 18-3224 TPX', hex: '#9932CC', name: 'Dark Orchid' },
        { code: 'PANTONE 17-3617 TPX', hex: '#BA55D3', name: 'Medium Orchid' },
        { code: 'PANTONE 16-3520 TPX', hex: '#DA70D6', name: 'Orchid' },
        { code: 'PANTONE 15-3817 TPX', hex: '#DDA0DD', name: 'Plum' },
        { code: 'PANTONE 14-3207 TPX', hex: '#EE82EE', name: 'Violet' },
        { code: 'PANTONE 13-3405 TPX', hex: '#D8BFD8', name: 'Thistle' },
        { code: 'PANTONE 12-2903 TPX', hex: '#E6E6FA', name: 'Lavender' },
        { code: 'PANTONE 18-3838 TPX', hex: '#4B0082', name: 'Indigo' },
        { code: 'PANTONE 19-3536 TPX', hex: '#800080', name: 'Purple' },
        { code: 'PANTONE 18-3224 TPX', hex: '#663399', name: 'Rebecca Purple' },
        { code: 'PANTONE 17-3617 TPX', hex: '#9370DB', name: 'Medium Slate Blue' },
        { code: 'PANTONE 16-3520 TPX', hex: '#6A5ACD', name: 'Slate Blue' },
        { code: 'PANTONE 15-3817 TPX', hex: '#483D8B', name: 'Dark Slate Blue' },
        { code: 'PANTONE 14-3207 TPX', hex: '#7B68EE', name: 'Medium Slate Blue' },
        
        // Additional Fashion Colors
        { code: 'PANTONE 18-1763 TPX', hex: '#D2001C', name: 'Fiery Red' },
        { code: 'PANTONE 19-1557 TPX', hex: '#B22222', name: 'Brick Red' },
        { code: 'PANTONE 18-1555 TPX', hex: '#A0522D', name: 'Sienna' },
        { code: 'PANTONE 17-1463 TPX', hex: '#8B4513', name: 'Saddle Brown' },
        { code: 'PANTONE 16-1439 TPX', hex: '#A52A2A', name: 'Brown' },
        { code: 'PANTONE 15-1327 TPX', hex: '#D2691E', name: 'Chocolate' },
        { code: 'PANTONE 14-1220 TPX', hex: '#CD853F', name: 'Peru' },
        { code: 'PANTONE 13-1106 TPX', hex: '#F4A460', name: 'Sandy Brown' },
        { code: 'PANTONE 12-0815 TPX', hex: '#FAD5A5', name: 'Peach' },
        { code: 'PANTONE 11-0507 TPX', hex: '#FFEFD5', name: 'Papaya Whip' },
        { code: 'PANTONE 19-4007 TPX', hex: '#2F4F4F', name: 'Dark Slate Gray' },
        { code: 'PANTONE 18-5104 TPX', hex: '#708090', name: 'Slate Gray' },
        { code: 'PANTONE 17-4405 TPX', hex: '#778899', name: 'Light Slate Gray' },
        { code: 'PANTONE 16-4132 TPX', hex: '#B0C4DE', name: 'Light Steel Blue' },
        { code: 'PANTONE 15-4020 TPX', hex: '#ADD8E6', name: 'Light Blue' },
        { code: 'PANTONE 14-4318 TPX', hex: '#87CEEB', name: 'Sky Blue' },
        { code: 'PANTONE 13-4110 TPX', hex: '#87CEFA', name: 'Light Sky Blue' },
        { code: 'PANTONE 12-5206 TPX', hex: '#E0F6FF', name: 'Alice Blue' },
        { code: 'PANTONE 19-3832 TPX', hex: '#191970', name: 'Midnight Blue' },
        { code: 'PANTONE 18-4045 TPX', hex: '#000080', name: 'Navy' },
        { code: 'PANTONE 17-4037 TPX', hex: '#00008B', name: 'Dark Blue' },
        { code: 'PANTONE 16-4132 TPX', hex: '#0000CD', name: 'Medium Blue' },
        { code: 'PANTONE 15-4020 TPX', hex: '#0000FF', name: 'Blue' },
        { code: 'PANTONE 14-4318 TPX', hex: '#4169E1', name: 'Royal Blue' },
        { code: 'PANTONE 13-4110 TPX', hex: '#1E90FF', name: 'Dodger Blue' },
        { code: 'PANTONE 12-5206 TPX', hex: '#00BFFF', name: 'Deep Sky Blue' },
        { code: 'PANTONE 19-4052 TPX', hex: '#6495ED', name: 'Cornflower Blue' },
        { code: 'PANTONE 18-4141 TPX', hex: '#4682B4', name: 'Steel Blue' },
        { code: 'PANTONE 17-4037 TPX', hex: '#5F9EA0', name: 'Cadet Blue' },
        { code: 'PANTONE 16-4132 TPX', hex: '#20B2AA', name: 'Light Sea Green' },
        { code: 'PANTONE 15-5519 TPX', hex: '#008B8B', name: 'Dark Cyan' },
        { code: 'PANTONE 14-5714 TPX', hex: '#008080', name: 'Teal' },
        { code: 'PANTONE 13-5309 TPX', hex: '#00CED1', name: 'Dark Turquoise' },
        { code: 'PANTONE 12-5403 TPX', hex: '#40E0D0', name: 'Turquoise' },
        { code: 'PANTONE 11-4601 TPX', hex: '#48D1CC', name: 'Medium Turquoise' },
        { code: 'PANTONE 18-5338 TPX', hex: '#00FA9A', name: 'Medium Spring Green' },
        { code: 'PANTONE 17-5641 TPX', hex: '#00FF7F', name: 'Spring Green' },
        { code: 'PANTONE 16-5938 TPX', hex: '#3CB371', name: 'Medium Sea Green' },
        { code: 'PANTONE 15-5519 TPX', hex: '#2E8B57', name: 'Sea Green' },
        { code: 'PANTONE 14-5714 TPX', hex: '#228B22', name: 'Forest Green' },
        { code: 'PANTONE 13-5309 TPX', hex: '#006400', name: 'Dark Green' },
        { code: 'PANTONE 12-5403 TPX', hex: '#008000', name: 'Green' },
        { code: 'PANTONE 11-4601 TPX', hex: '#32CD32', name: 'Lime Green' },
        { code: 'PANTONE 18-0228 TPX', hex: '#00FF00', name: 'Lime' },
        { code: 'PANTONE 17-0145 TPX', hex: '#7CFC00', name: 'Lawn Green' },
        { code: 'PANTONE 16-0142 TPX', hex: '#7FFF00', name: 'Chartreuse' },
        { code: 'PANTONE 15-0343 TPX', hex: '#ADFF2F', name: 'Green Yellow' },
        { code: 'PANTONE 14-0244 TPX', hex: '#9ACD32', name: 'Yellow Green' },
        { code: 'PANTONE 13-0317 TPX', hex: '#6B8E23', name: 'Olive Drab' },
        { code: 'PANTONE 12-0225 TPX', hex: '#808000', name: 'Olive' },
        { code: 'PANTONE 18-0935 TPX', hex: '#556B2F', name: 'Dark Olive Green' },
        { code: 'PANTONE 17-1456 TPX', hex: '#8FBC8F', name: 'Dark Sea Green' },
        { code: 'PANTONE 16-1546 TPX', hex: '#90EE90', name: 'Light Green' },
        { code: 'PANTONE 15-1247 TPX', hex: '#98FB98', name: 'Pale Green' },
        { code: 'PANTONE 14-1064 TPX', hex: '#F0FFF0', name: 'Honeydew' },
        { code: 'PANTONE 13-1023 TPX', hex: '#FFFACD', name: 'Lemon Chiffon' },
        { code: 'PANTONE 12-0722 TPX', hex: '#FFFFE0', name: 'Light Yellow' },
        { code: 'PANTONE 13-0859 TPX', hex: '#FFFF00', name: 'Yellow' },
        { code: 'PANTONE 14-0760 TPX', hex: '#FFD700', name: 'Gold' },
        { code: 'PANTONE 15-0751 TPX', hex: '#FFA500', name: 'Orange' },
        { code: 'PANTONE 16-0946 TPX', hex: '#FF8C00', name: 'Dark Orange' },
        { code: 'PANTONE 17-1047 TPX', hex: '#FF7F50', name: 'Coral' },
        { code: 'PANTONE 18-1142 TPX', hex: '#FF6347', name: 'Tomato' },
        { code: 'PANTONE 13-0859 TPX', hex: '#FF4500', name: 'Orange Red' },
        { code: 'PANTONE 14-1064 TPX', hex: '#FF0000', name: 'Red' },
        { code: 'PANTONE 15-1247 TPX', hex: '#DC143C', name: 'Crimson' },
        { code: 'PANTONE 16-1546 TPX', hex: '#B22222', name: 'Fire Brick' },
        { code: 'PANTONE 17-1456 TPX', hex: '#8B0000', name: 'Dark Red' },
        { code: 'PANTONE 18-1664 TPX', hex: '#FF1493', name: 'Deep Pink' },
        { code: 'PANTONE 19-1664 TPX', hex: '#FF69B4', name: 'Hot Pink' },
        { code: 'PANTONE 18-1142 TPX', hex: '#FFB6C1', name: 'Light Pink' },
        { code: 'PANTONE 18-3949 TPX', hex: '#FFC0CB', name: 'Pink' },
        { code: 'PANTONE 17-2031 TPX', hex: '#FFE4E1', name: 'Misty Rose' },
        { code: 'PANTONE 16-2120 TPX', hex: '#FA8072', name: 'Salmon' },
        { code: 'PANTONE 15-2217 TPX', hex: '#E9967A', name: 'Dark Salmon' },
        { code: 'PANTONE 14-2808 TPX', hex: '#FFA07A', name: 'Light Salmon' },
        { code: 'PANTONE 13-2807 TPX', hex: '#CD5C5C', name: 'Indian Red' },
        { code: 'PANTONE 12-2906 TPX', hex: '#F08080', name: 'Light Coral' },
        { code: 'PANTONE 11-2511 TPX', hex: '#FF7F50', name: 'Coral' },
        { code: 'PANTONE 18-3838 TPX', hex: '#800080', name: 'Purple' },
        { code: 'PANTONE 19-3536 TPX', hex: '#9400D3', name: 'Dark Violet' },
        { code: 'PANTONE 18-3224 TPX', hex: '#9932CC', name: 'Dark Orchid' },
        { code: 'PANTONE 17-3617 TPX', hex: '#BA55D3', name: 'Medium Orchid' },
        { code: 'PANTONE 16-3520 TPX', hex: '#DA70D6', name: 'Orchid' },
        { code: 'PANTONE 15-3817 TPX', hex: '#DDA0DD', name: 'Plum' },
        { code: 'PANTONE 14-3207 TPX', hex: '#EE82EE', name: 'Violet' },
        { code: 'PANTONE 13-3405 TPX', hex: '#D8BFD8', name: 'Thistle' },
        { code: 'PANTONE 12-2903 TPX', hex: '#E6E6FA', name: 'Lavender' },
        { code: 'PANTONE 18-3838 TPX', hex: '#4B0082', name: 'Indigo' },
        { code: 'PANTONE 19-3536 TPX', hex: '#8A2BE2', name: 'Blue Violet' },
        { code: 'PANTONE 18-3224 TPX', hex: '#7B68EE', name: 'Medium Slate Blue' },
        { code: 'PANTONE 17-3617 TPX', hex: '#6A5ACD', name: 'Slate Blue' },
        { code: 'PANTONE 16-3520 TPX', hex: '#483D8B', name: 'Dark Slate Blue' },
        { code: 'PANTONE 15-3817 TPX', hex: '#9370DB', name: 'Medium Purple' },
        { code: 'PANTONE 14-3207 TPX', hex: '#663399', name: 'Rebecca Purple' },
        { code: 'PANTONE 13-3405 TPX', hex: '#8B00FF', name: 'Violet' },
        { code: 'PANTONE 12-2903 TPX', hex: '#C71585', name: 'Medium Violet Red' },
        { code: 'PANTONE 18-3838 TPX', hex: '#DB7093', name: 'Pale Violet Red' },
        
        // Additional Trending Colors
        { code: 'PANTONE 17-5104 TPX', hex: '#95A5A6', name: 'Concrete' },
        { code: 'PANTONE 18-1142 TPX', hex: '#E74C3C', name: 'Alizarin' },
        { code: 'PANTONE 19-4052 TPX', hex: '#3498DB', name: 'Peter River' },
        { code: 'PANTONE 15-0343 TPX', hex: '#2ECC71', name: 'Emerald' },
        { code: 'PANTONE 13-0859 TPX', hex: '#F1C40F', name: 'Sun Flower' },
        { code: 'PANTONE 16-1546 TPX', hex: '#E67E22', name: 'Carrot' },
        { code: 'PANTONE 18-3838 TPX', hex: '#9B59B6', name: 'Amethyst' },
        { code: 'PANTONE 19-3832 TPX', hex: '#2C3E50', name: 'Midnight Blue' },
        { code: 'PANTONE 18-5104 TPX', hex: '#34495E', name: 'Wet Asphalt' },
        { code: 'PANTONE 17-4405 TPX', hex: '#7F8C8D', name: 'Asbestos' },
        { code: 'PANTONE 16-4132 TPX', hex: '#ECF0F1', name: 'Clouds' },
        { code: 'PANTONE 15-4020 TPX', hex: '#BDC3C7', name: 'Silver' },
        { code: 'PANTONE 14-4318 TPX', hex: '#1ABC9C', name: 'Turquoise' },
        { code: 'PANTONE 13-4110 TPX', hex: '#16A085', name: 'Green Sea' },
        { code: 'PANTONE 12-5206 TPX', hex: '#27AE60', name: 'Nephritis' },
        { code: 'PANTONE 19-4052 TPX', hex: '#2980B9', name: 'Belize Hole' },
        { code: 'PANTONE 18-4141 TPX', hex: '#8E44AD', name: 'Wisteria' },
        { code: 'PANTONE 17-4037 TPX', hex: '#D35400', name: 'Pumpkin' },
        { code: 'PANTONE 16-4132 TPX', hex: '#C0392B', name: 'Pomegranate' },
        { code: 'PANTONE 15-5519 TPX', hex: '#F39C12', name: 'Orange' },
        { code: 'PANTONE 14-5714 TPX', hex: '#E74C3C', name: 'Alizarin' },
        { code: 'PANTONE 13-5309 TPX', hex: '#9B59B6', name: 'Amethyst' },
        { code: 'PANTONE 12-5403 TPX', hex: '#3498DB', name: 'Peter River' },
        { code: 'PANTONE 11-4601 TPX', hex: '#2ECC71', name: 'Emerald' },
        
        // Metallics & Metallic Colors
        { code: 'PANTONE 871 C', hex: '#BF9000', name: 'Metallic Gold' },
        { code: 'PANTONE 872 C', hex: '#8E7618', name: 'Metallic Gold 2' },
        { code: 'PANTONE 873 C', hex: '#74501A', name: 'Metallic Gold 3' },
        { code: 'PANTONE 877 C', hex: '#878787', name: 'Metallic Silver' },
        { code: 'PANTONE 10077 C', hex: '#C0C0C0', name: 'Silver' },
        { code: 'PANTONE 10142 C', hex: '#B87333', name: 'Metallic Bronze' },
        { code: 'PANTONE 876 C', hex: '#B08D57', name: 'Metallic Copper' },
        { code: 'PANTONE 8003 C', hex: '#964B00', name: 'Copper' },
        { code: 'PANTONE 8842 C', hex: '#CD7F32', name: 'Bronze' },
        { code: 'PANTONE 8843 C', hex: '#B08D57', name: 'Antique Bronze' },
        { code: 'PANTONE 8844 C', hex: '#FFD700', name: 'Pure Gold' },
        { code: 'PANTONE 8845 C', hex: '#E6E6FA', name: 'Platinum' },
        { code: 'PANTONE 8846 C', hex: '#C0C0C0', name: 'Chrome' },
        { code: 'PANTONE 8847 C', hex: '#708090', name: 'Pewter' },
        { code: 'PANTONE 8848 C', hex: '#36454F', name: 'Charcoal' },
        
        // Neons & Bright Colors
        { code: 'PANTONE 802 C', hex: '#00FF00', name: 'Neon Green' },
        { code: 'PANTONE 803 C', hex: '#FFFF00', name: 'Neon Yellow' },
        { code: 'PANTONE 804 C', hex: '#FF1493', name: 'Neon Pink' },
        { code: 'PANTONE 805 C', hex: '#00BFFF', name: 'Neon Blue' },
        { code: 'PANTONE 806 C', hex: '#FF4500', name: 'Neon Orange' },
        { code: 'PANTONE 807 C', hex: '#FF00FF', name: 'Neon Magenta' },
        { code: 'PANTONE 808 C', hex: '#00FFFF', name: 'Neon Cyan' },
        { code: 'PANTONE 809 C', hex: '#32CD32', name: 'Electric Lime' },
        { code: 'PANTONE 810 C', hex: '#FF69B4', name: 'Electric Pink' },
        { code: 'PANTONE 811 C', hex: '#1E90FF', name: 'Electric Blue' },
        { code: 'PANTONE 812 C', hex: '#ADFF2F', name: 'Electric Yellow' },
        { code: 'PANTONE 813 C', hex: '#7CFC00', name: 'Electric Green' },
        { code: 'PANTONE 814 C', hex: '#FF4500', name: 'Electric Orange' },
        { code: 'PANTONE 815 C', hex: '#8A2BE2', name: 'Electric Violet' },
        { code: 'PANTONE 816 C', hex: '#00CED1', name: 'Electric Turquoise' },
        
        // Earth Tones & Natural Colors
        { code: 'PANTONE 18-1142 TPX', hex: '#D2691E', name: 'Chocolate' },
        { code: 'PANTONE 18-1048 TPX', hex: '#A0522D', name: 'Sienna' },
        { code: 'PANTONE 18-1142 TPX', hex: '#8B4513', name: 'Saddle Brown' },
        { code: 'PANTONE 17-1463 TPX', hex: '#CD853F', name: 'Peru' },
        { code: 'PANTONE 16-1439 TPX', hex: '#DEB887', name: 'Burlywood' },
        { code: 'PANTONE 15-1327 TPX', hex: '#D2B48C', name: 'Tan' },
        { code: 'PANTONE 14-1220 TPX', hex: '#F5DEB3', name: 'Wheat' },
        { code: 'PANTONE 13-1106 TPX', hex: '#F4A460', name: 'Sandy Brown' },
        { code: 'PANTONE 12-0815 TPX', hex: '#FAD5A5', name: 'Peach Puff' },
        { code: 'PANTONE 11-0507 TPX', hex: '#FFEFD5', name: 'Papaya Whip' },
        { code: 'PANTONE 18-1142 TPX', hex: '#BC8F8F', name: 'Rosy Brown' },
        { code: 'PANTONE 17-1463 TPX', hex: '#F0E68C', name: 'Khaki' },
        { code: 'PANTONE 16-1439 TPX', hex: '#BDB76B', name: 'Dark Khaki' },
        { code: 'PANTONE 15-1327 TPX', hex: '#6B8E23', name: 'Olive Drab' },
        { code: 'PANTONE 14-1220 TPX', hex: '#808000', name: 'Olive' },
        { code: 'PANTONE 13-1106 TPX', hex: '#556B2F', name: 'Dark Olive Green' },
        { code: 'PANTONE 12-0815 TPX', hex: '#9ACD32', name: 'Yellow Green' },
        { code: 'PANTONE 11-0507 TPX', hex: '#32CD32', name: 'Lime Green' },
        { code: 'PANTONE 18-1142 TPX', hex: '#228B22', name: 'Forest Green' },
        { code: 'PANTONE 17-1463 TPX', hex: '#006400', name: 'Dark Green' },
        
        // Pastels & Soft Colors
        { code: 'PANTONE 12-2906 TPX', hex: '#FFB6C1', name: 'Light Pink' },
        { code: 'PANTONE 11-2511 TPX', hex: '#FFC0CB', name: 'Pink' },
        { code: 'PANTONE 10-2405 TPX', hex: '#FFCCCB', name: 'Misty Rose' },
        { code: 'PANTONE 12-5206 TPX', hex: '#E0F6FF', name: 'Alice Blue' },
        { code: 'PANTONE 11-4601 TPX', hex: '#F0F8FF', name: 'Alice Blue Light' },
        { code: 'PANTONE 10-4805 TPX', hex: '#E6E6FA', name: 'Lavender' },
        { code: 'PANTONE 12-2903 TPX', hex: '#D8BFD8', name: 'Thistle' },
        { code: 'PANTONE 11-3406 TPX', hex: '#DDA0DD', name: 'Plum' },
        { code: 'PANTONE 10-3207 TPX', hex: '#EE82EE', name: 'Violet' },
        { code: 'PANTONE 12-5403 TPX', hex: '#AFEEEE', name: 'Pale Turquoise' },
        { code: 'PANTONE 11-4601 TPX', hex: '#E0FFFF', name: 'Light Cyan' },
        { code: 'PANTONE 10-5409 TPX', hex: '#F0FFF0', name: 'Honeydew' },
        { code: 'PANTONE 12-0225 TPX', hex: '#F5FFFA', name: 'Mint Cream' },
        { code: 'PANTONE 11-0317 TPX', hex: '#98FB98', name: 'Pale Green' },
        { code: 'PANTONE 10-0244 TPX', hex: '#90EE90', name: 'Light Green' },
        { code: 'PANTONE 12-0722 TPX', hex: '#FFFFE0', name: 'Light Yellow' },
        { code: 'PANTONE 11-0815 TPX', hex: '#FFFACD', name: 'Lemon Chiffon' },
        { code: 'PANTONE 10-0507 TPX', hex: '#FFF8DC', name: 'Cornsilk' },
        { code: 'PANTONE 12-1023 TPX', hex: '#FFEFD5', name: 'Papaya Whip' },
        { code: 'PANTONE 11-1106 TPX', hex: '#FFE4B5', name: 'Moccasin' },
        
        // Deep/Dark Colors
        { code: 'PANTONE 19-3832 TPX', hex: '#2F4F4F', name: 'Dark Slate Gray' },
        { code: 'PANTONE 18-5104 TPX', hex: '#708090', name: 'Slate Gray' },
        { code: 'PANTONE 17-4405 TPX', hex: '#778899', name: 'Light Slate Gray' },
        { code: 'PANTONE 19-4007 TPX', hex: '#696969', name: 'Dim Gray' },
        { code: 'PANTONE 18-0306 TPX', hex: '#808080', name: 'Gray' },
        { code: 'PANTONE 17-4405 TPX', hex: '#A9A9A9', name: 'Dark Gray' },
        { code: 'PANTONE 16-4132 TPX', hex: '#C0C0C0', name: 'Silver' },
        { code: 'PANTONE 15-4020 TPX', hex: '#D3D3D3', name: 'Light Gray' },
        { code: 'PANTONE 14-4318 TPX', hex: '#DCDCDC', name: 'Gainsboro' },
        { code: 'PANTONE 13-4110 TPX', hex: '#F5F5F5', name: 'White Smoke' },
        { code: 'PANTONE 19-1557 TPX', hex: '#800000', name: 'Maroon' },
        { code: 'PANTONE 18-1555 TPX', hex: '#8B0000', name: 'Dark Red' },
        { code: 'PANTONE 17-1463 TPX', hex: '#A52A2A', name: 'Brown' },
        { code: 'PANTONE 16-1439 TPX', hex: '#B22222', name: 'Fire Brick' },
        { code: 'PANTONE 15-1327 TPX', hex: '#DC143C', name: 'Crimson' },
        { code: 'PANTONE 19-4050 TPX', hex: '#000080', name: 'Navy' },
        { code: 'PANTONE 18-4045 TPX', hex: '#00008B', name: 'Dark Blue' },
        { code: 'PANTONE 17-4037 TPX', hex: '#191970', name: 'Midnight Blue' },
        { code: 'PANTONE 16-4132 TPX', hex: '#4682B4', name: 'Steel Blue' },
        { code: 'PANTONE 15-4020 TPX', hex: '#483D8B', name: 'Dark Slate Blue' },
        
        // Spring/Summer Colors
        { code: 'PANTONE 13-1520 TPX', hex: '#FF7F50', name: 'Coral' },
        { code: 'PANTONE 12-0825 TPX', hex: '#FFAB91', name: 'Light Coral' },
        { code: 'PANTONE 11-1408 TPX', hex: '#FFDAB9', name: 'Peach Puff' },
        { code: 'PANTONE 14-1159 TPX', hex: '#CD853F', name: 'Peru' },
        { code: 'PANTONE 13-1023 TPX', hex: '#F0E68C', name: 'Khaki' },
        { code: 'PANTONE 12-0435 TPX', hex: '#E6E6FA', name: 'Lavender' },
        { code: 'PANTONE 15-3817 TPX', hex: '#DDA0DD', name: 'Plum' },
        { code: 'PANTONE 14-3207 TPX', hex: '#DA70D6', name: 'Orchid' },
        { code: 'PANTONE 13-3405 TPX', hex: '#D8BFD8', name: 'Thistle' },
        { code: 'PANTONE 16-3520 TPX', hex: '#BA55D3', name: 'Medium Orchid' },
        { code: 'PANTONE 15-5519 TPX', hex: '#20B2AA', name: 'Light Sea Green' },
        { code: 'PANTONE 14-5714 TPX', hex: '#008B8B', name: 'Dark Cyan' },
        { code: 'PANTONE 13-5309 TPX', hex: '#008080', name: 'Teal' },
        { code: 'PANTONE 12-5403 TPX', hex: '#00CED1', name: 'Dark Turquoise' },
        { code: 'PANTONE 15-4020 TPX', hex: '#40E0D0', name: 'Turquoise' },
        { code: 'PANTONE 14-4318 TPX', hex: '#48D1CC', name: 'Medium Turquoise' },
        { code: 'PANTONE 13-4110 TPX', hex: '#AFEEEE', name: 'Pale Turquoise' },
        { code: 'PANTONE 12-5206 TPX', hex: '#E0FFFF', name: 'Light Cyan' },
        { code: 'PANTONE 11-4601 TPX', hex: '#F0F8FF', name: 'Alice Blue' },
        { code: 'PANTONE 16-4132 TPX', hex: '#87CEEB', name: 'Sky Blue' },
        
        // Fall/Winter Colors
        { code: 'PANTONE 18-1142 TPX', hex: '#B22222', name: 'Fire Brick' },
        { code: 'PANTONE 17-1456 TPX', hex: '#8B4513', name: 'Saddle Brown' },
        { code: 'PANTONE 16-1439 TPX', hex: '#A0522D', name: 'Sienna' },
        { code: 'PANTONE 15-1327 TPX', hex: '#D2691E', name: 'Chocolate' },
        { code: 'PANTONE 14-1220 TPX', hex: '#CD853F', name: 'Peru' },
        { code: 'PANTONE 13-1106 TPX', hex: '#DAA520', name: 'Goldenrod' },
        { code: 'PANTONE 12-0815 TPX', hex: '#B8860B', name: 'Dark Goldenrod' },
        { code: 'PANTONE 18-1763 TPX', hex: '#8B0000', name: 'Dark Red' },
        { code: 'PANTONE 17-1664 TPX', hex: '#800000', name: 'Maroon' },
        { code: 'PANTONE 16-1546 TPX', hex: '#DC143C', name: 'Crimson' },
        { code: 'PANTONE 19-3832 TPX', hex: '#2F4F4F', name: 'Dark Slate Gray' },
        { code: 'PANTONE 18-5104 TPX', hex: '#708090', name: 'Slate Gray' },
        { code: 'PANTONE 17-4405 TPX', hex: '#696969', name: 'Dim Gray' },
        { code: 'PANTONE 19-4050 TPX', hex: '#000080', name: 'Navy' },
        { code: 'PANTONE 18-4045 TPX', hex: '#191970', name: 'Midnight Blue' },
        { code: 'PANTONE 17-4037 TPX', hex: '#4682B4', name: 'Steel Blue' },
        { code: 'PANTONE 19-3536 TPX', hex: '#800080', name: 'Purple' },
        { code: 'PANTONE 18-3838 TPX', hex: '#4B0082', name: 'Indigo' },
        { code: 'PANTONE 17-3617 TPX', hex: '#6A5ACD', name: 'Slate Blue' },
        { code: 'PANTONE 16-3520 TPX', hex: '#483D8B', name: 'Dark Slate Blue' },
        
        // Contemporary Fashion Colors
        { code: 'PANTONE 13-1404 TPX', hex: '#F7CAC9', name: 'Millennial Pink' },
        { code: 'PANTONE 14-6316 TPX', hex: '#92A3A3', name: 'Sage Green' },
        { code: 'PANTONE 18-1142 TPX', hex: '#E2725B', name: 'Terracotta' },
        { code: 'PANTONE 12-0643 TPX', hex: '#FAD5A5', name: 'Apricot' },
        { code: 'PANTONE 16-1546 TPX', hex: '#DE6FA1', name: 'Rose Gold' },
        { code: 'PANTONE 15-3817 TPX', hex: '#C9A96E', name: 'Champagne' },
        { code: 'PANTONE 14-4318 TPX', hex: '#B4A7D6', name: 'Lilac' },
        { code: 'PANTONE 13-4110 TPX', hex: '#A8E6CF', name: 'Mint Green' },
        { code: 'PANTONE 12-5206 TPX', hex: '#88D8C0', name: 'Seafoam' },
        { code: 'PANTONE 15-4020 TPX', hex: '#FFD3A5', name: 'Peach' },
        { code: 'PANTONE 14-1064 TPX', hex: '#FD9644', name: 'Cantaloupe' },
        { code: 'PANTONE 13-1023 TPX', hex: '#FFAAA5', name: 'Salmon Pink' },
        { code: 'PANTONE 16-1546 TPX', hex: '#FF8A80', name: 'Coral Pink' },
        { code: 'PANTONE 15-1247 TPX', hex: '#C5E1A5', name: 'Pistachio' },
        { code: 'PANTONE 14-0244 TPX', hex: '#DCEDC1', name: 'Celery' },
        { code: 'PANTONE 13-0317 TPX', hex: '#A8E6CF', name: 'Mint' },
        { code: 'PANTONE 17-4037 TPX', hex: '#81C784', name: 'Light Green' },
        { code: 'PANTONE 16-4132 TPX', hex: '#4FC3F7', name: 'Sky Blue' },
        { code: 'PANTONE 15-4020 TPX', hex: '#81D4FA', name: 'Baby Blue' },
        { code: 'PANTONE 14-4318 TPX', hex: '#B39DDB', name: 'Lavender Purple' },
        
        // Professional/Business Colors
        { code: 'PANTONE 19-4052 TPX', hex: '#2E3B4E', name: 'Charcoal Navy' },
        { code: 'PANTONE 18-4045 TPX', hex: '#1B263B', name: 'Midnight Navy' },
        { code: 'PANTONE 17-4037 TPX', hex: '#415A77', name: 'Slate Blue' },
        { code: 'PANTONE 16-4132 TPX', hex: '#778DA9', name: 'Steel Blue' },
        { code: 'PANTONE 15-4020 TPX', hex: '#E0E1DD', name: 'Warm Gray' },
        { code: 'PANTONE 14-4318 TPX', hex: '#BCC0C6', name: 'Cool Gray' },
        { code: 'PANTONE 13-4110 TPX', hex: '#9DB4C0', name: 'Dove Gray' },
        { code: 'PANTONE 12-5206 TPX', hex: '#52796F', name: 'Sage' },
        { code: 'PANTONE 18-1142 TPX', hex: '#354F52', name: 'Hunter Green' },
        { code: 'PANTONE 17-1456 TPX', hex: '#2F3E46', name: 'Charcoal Green' },
        { code: 'PANTONE 16-1439 TPX', hex: '#84A59D', name: 'Eucalyptus' },
        { code: 'PANTONE 15-1327 TPX', hex: '#F6BD60', name: 'Mustard' },
        { code: 'PANTONE 14-1220 TPX', hex: '#F7931E', name: 'Amber' },
        { code: 'PANTONE 13-1106 TPX', hex: '#F28482', name: 'Salmon' },
        { code: 'PANTONE 12-0815 TPX', hex: '#F5CAC3', name: 'Blush' },
        { code: 'PANTONE 18-1763 TPX', hex: '#84A59D', name: 'Stone' },
        { code: 'PANTONE 17-1664 TPX', hex: '#C9ADA7', name: 'Taupe' },
        { code: 'PANTONE 16-1546 TPX', hex: '#A8DADC', name: 'Powder Blue' },
        { code: 'PANTONE 15-1247 TPX', hex: '#457B9D', name: 'Cerulean' },
        { code: 'PANTONE 14-1064 TPX', hex: '#1D3557', name: 'Prussian Blue' },
        
        // Fluorescent Colors
        { code: 'PANTONE 801 C', hex: '#FFFF00', name: 'Fluorescent Yellow' },
        { code: 'PANTONE 802 C', hex: '#FF6600', name: 'Fluorescent Orange' },
        { code: 'PANTONE 803 C', hex: '#FF1493', name: 'Fluorescent Pink' },
        { code: 'PANTONE 804 C', hex: '#00FF00', name: 'Fluorescent Green' },
        { code: 'PANTONE 805 C', hex: '#00BFFF', name: 'Fluorescent Blue' },
        { code: 'PANTONE 806 C', hex: '#FF00FF', name: 'Fluorescent Magenta' },
        { code: 'PANTONE 807 C', hex: '#32CD32', name: 'Safety Green' },
        { code: 'PANTONE 808 C', hex: '#FF4500', name: 'Safety Orange' },
        { code: 'PANTONE 809 C', hex: '#FFFF00', name: 'Safety Yellow' },
        { code: 'PANTONE 810 C', hex: '#FF1493', name: 'Safety Pink' },
        { code: 'PANTONE 811 C', hex: '#00FF7F', name: 'Electric Green' },
        { code: 'PANTONE 812 C', hex: '#7CFC00', name: 'Laser Lemon' },
        { code: 'PANTONE 813 C', hex: '#FF6347', name: 'Atomic Tangerine' },
        { code: 'PANTONE 814 C', hex: '#FF69B4', name: 'Shocking Pink' },
        { code: 'PANTONE 815 C', hex: '#00CED1', name: 'Turbo Blue' },
        
        // Muted/Dusty Colors
        { code: 'PANTONE 16-1511 TPX', hex: '#D4A574', name: 'Dusty Rose' },
        { code: 'PANTONE 15-2217 TPX', hex: '#BC9A6A', name: 'Dusty Gold' },
        { code: 'PANTONE 14-2808 TPX', hex: '#A8956B', name: 'Sage' },
        { code: 'PANTONE 13-2807 TPX', hex: '#9B8F7F', name: 'Mushroom' },
        { code: 'PANTONE 12-2906 TPX', hex: '#8B7D6B', name: 'Taupe' },
        { code: 'PANTONE 15-1327 TPX', hex: '#C7B377', name: 'Dusty Olive' },
        { code: 'PANTONE 14-1220 TPX', hex: '#B8A082', name: 'Oatmeal' },
        { code: 'PANTONE 13-1106 TPX', hex: '#A69888', name: 'Greige' },
        { code: 'PANTONE 16-1439 TPX', hex: '#8E7CC3', name: 'Dusty Lavender' },
        { code: 'PANTONE 15-3817 TPX', hex: '#7D84B2', name: 'Muted Blue' },
        { code: 'PANTONE 14-3207 TPX', hex: '#8E9AAF', name: 'Dusty Blue' },
        { code: 'PANTONE 13-3405 TPX', hex: '#CBC0D3', name: 'Dusty Purple' },
        { code: 'PANTONE 12-2903 TPX', hex: '#A8A8A8', name: 'Concrete' },
        { code: 'PANTONE 17-1456 TPX', hex: '#9B9B9B', name: 'Dove Gray' },
        { code: 'PANTONE 16-1546 TPX', hex: '#8D8D8D', name: 'Charcoal Gray' },
        
        // International Fashion Colors
        { code: 'PANTONE 18-1142 TPX', hex: '#E63946', name: 'Imperial Red' },
        { code: 'PANTONE 17-1664 TPX', hex: '#F77F00', name: 'Pumpkin' },
        { code: 'PANTONE 16-1546 TPX', hex: '#FCBF49', name: 'Marigold' },
        { code: 'PANTONE 15-1247 TPX', hex: '#EAE2B7', name: 'Flax' },
        { code: 'PANTONE 14-1064 TPX', hex: '#D62828', name: 'Fire Engine Red' },
        { code: 'PANTONE 13-1023 TPX', hex: '#003049', name: 'Prussian Blue' },
        { code: 'PANTONE 19-3832 TPX', hex: '#669BBC', name: 'Blue Gray' },
        { code: 'PANTONE 18-5104 TPX', hex: '#80ED99', name: 'Light Green' },
        { code: 'PANTONE 17-4405 TPX', hex: '#57CC99', name: 'Medium Aquamarine' },
        { code: 'PANTONE 16-4132 TPX', hex: '#38A3A5', name: 'Verdigris' },
        { code: 'PANTONE 15-4020 TPX', hex: '#22577A', name: 'Cerulean Blue' },
        { code: 'PANTONE 14-4318 TPX', hex: '#C7F9CC', name: 'Mint' },
        { code: 'PANTONE 13-4110 TPX', hex: '#F15BB5', name: 'Fuchsia' },
        { code: 'PANTONE 12-5206 TPX', hex: '#FEE75C', name: 'Naples Yellow' },
        { code: 'PANTONE 19-4052 TPX', hex: '#FB8500', name: 'Orange Peel' },
        { code: 'PANTONE 18-4141 TPX', hex: '#8ECAE6', name: 'Baby Blue' },
        { code: 'PANTONE 17-4037 TPX', hex: '#219EBC', name: 'Blue Green' },
        { code: 'PANTONE 16-4132 TPX', hex: '#023047', name: 'Rich Black' },
        { code: 'PANTONE 15-5519 TPX', hex: '#FFB3C6', name: 'Cotton Candy' },
        { code: 'PANTONE 14-5714 TPX', hex: '#FB8B24', name: 'Dark Orange' },
        { code: 'PANTONE 13-5309 TPX', hex: '#E36414', name: 'Alloy Orange' },
        { code: 'PANTONE 12-5403 TPX', hex: '#9A031E', name: 'Ruby Red' },
        { code: 'PANTONE 11-4601 TPX', hex: '#5F0F40', name: 'Tyrian Purple' },
        { code: 'PANTONE 18-5338 TPX', hex: '#0F3460', name: 'Space Cadet' },
        { code: 'PANTONE 17-5641 TPX', hex: '#E09F3E', name: 'Goldenrod' },
        { code: 'PANTONE 16-5938 TPX', hex: '#540B0E', name: 'Dark Red' },
        { code: 'PANTONE 15-5519 TPX', hex: '#9E2A2B', name: 'Venetian Red' },
        { code: 'PANTONE 14-5714 TPX', hex: '#335C67', name: 'Outer Space' },
        { code: 'PANTONE 13-5309 TPX', hex: '#FFF3B0', name: 'Cream' },
        { code: 'PANTONE 12-5403 TPX', hex: '#E09F3E', name: 'Harvest Gold' },
        { code: 'PANTONE 11-4601 TPX', hex: '#9E2A2B', name: 'Burgundy' },
        { code: 'PANTONE 18-0228 TPX', hex: '#540B0E', name: 'Wine' },
        { code: 'PANTONE 17-0145 TPX', hex: '#335C67', name: 'Teal Blue' },
        { code: 'PANTONE 16-0142 TPX', hex: '#A7C957', name: 'Yellow Green' },
        { code: 'PANTONE 15-0343 TPX', hex: '#6A994E', name: 'Fern Green' },
        { code: 'PANTONE 14-0244 TPX', hex: '#386641', name: 'Hunter Green' },
        { code: 'PANTONE 13-0317 TPX', hex: '#BC4749', name: 'Brick Red' },
        { code: 'PANTONE 12-0225 TPX', hex: '#F2E8CF', name: 'Eggshell' },
        { code: 'PANTONE 18-0935 TPX', hex: '#A68A64', name: 'Khaki' },
        { code: 'PANTONE 17-1456 TPX', hex: '#7F5539', name: 'Umber' },
        { code: 'PANTONE 16-1546 TPX', hex: '#936639', name: 'Bronze' },
        { code: 'PANTONE 15-1247 TPX', hex: '#A0522D', name: 'Sienna' },
        { code: 'PANTONE 14-1064 TPX', hex: '#8B4513', name: 'Saddle Brown' },
        { code: 'PANTONE 13-1023 TPX', hex: '#D2691E', name: 'Chocolate' },
        { code: 'PANTONE 12-0722 TPX', hex: '#DAA520', name: 'Goldenrod' },
        { code: 'PANTONE 13-0859 TPX', hex: '#B8860B', name: 'Dark Goldenrod' },
        { code: 'PANTONE 14-0760 TPX', hex: '#CD853F', name: 'Peru' },
        { code: 'PANTONE 15-0751 TPX', hex: '#D2B48C', name: 'Tan' },
        { code: 'PANTONE 16-0946 TPX', hex: '#F4A460', name: 'Sandy Brown' },
        { code: 'PANTONE 17-1047 TPX', hex: '#DEB887', name: 'Burlywood' },
        { code: 'PANTONE 18-1142 TPX', hex: '#F5DEB3', name: 'Wheat' },
        { code: 'PANTONE 13-0859 TPX', hex: '#FFDEAD', name: 'Navajo White' },
        { code: 'PANTONE 14-1064 TPX', hex: '#FFE4B5', name: 'Moccasin' },
        { code: 'PANTONE 15-1247 TPX', hex: '#FFEBCD', name: 'Blanched Almond' },
        { code: 'PANTONE 16-1546 TPX', hex: '#FFEFD5', name: 'Papaya Whip' },
        { code: 'PANTONE 17-1456 TPX', hex: '#FFF8DC', name: 'Cornsilk' },
        { code: 'PANTONE 18-1664 TPX', hex: '#FFFACD', name: 'Lemon Chiffon' },
        { code: 'PANTONE 19-1664 TPX', hex: '#FFFFE0', name: 'Light Yellow' },
        { code: 'PANTONE 18-1142 TPX', hex: '#F0E68C', name: 'Khaki' },
        { code: 'PANTONE 18-3949 TPX', hex: '#EEE8AA', name: 'Pale Goldenrod' },
        { code: 'PANTONE 17-2031 TPX', hex: '#BDB76B', name: 'Dark Khaki' },
        { code: 'PANTONE 16-2120 TPX', hex: '#FFFF00', name: 'Yellow' },
        { code: 'PANTONE 15-2217 TPX', hex: '#9ACD32', name: 'Yellow Green' },
        { code: 'PANTONE 14-2808 TPX', hex: '#ADFF2F', name: 'Green Yellow' },
        { code: 'PANTONE 13-2807 TPX', hex: '#7CFC00', name: 'Lawn Green' },
        { code: 'PANTONE 12-2906 TPX', hex: '#7FFF00', name: 'Chartreuse' },
        { code: 'PANTONE 11-2511 TPX', hex: '#32CD32', name: 'Lime Green' },
        { code: 'PANTONE 18-3838 TPX', hex: '#00FF00', name: 'Lime' },
        { code: 'PANTONE 19-3536 TPX', hex: '#00FF32', name: 'Electric Green' },
        { code: 'PANTONE 18-3224 TPX', hex: '#00FF7F', name: 'Spring Green' },
        { code: 'PANTONE 17-3617 TPX', hex: '#00FA9A', name: 'Medium Spring Green' },
        { code: 'PANTONE 16-3520 TPX', hex: '#90EE90', name: 'Light Green' },
        { code: 'PANTONE 15-3817 TPX', hex: '#98FB98', name: 'Pale Green' },
        { code: 'PANTONE 14-3207 TPX', hex: '#F0FFF0', name: 'Honeydew' },
        { code: 'PANTONE 13-3405 TPX', hex: '#00FF7F', name: 'Spring Green' },
        { code: 'PANTONE 12-2903 TPX', hex: '#3CB371', name: 'Medium Sea Green' },
        { code: 'PANTONE 18-3838 TPX', hex: '#2E8B57', name: 'Sea Green' },
        { code: 'PANTONE 19-3536 TPX', hex: '#228B22', name: 'Forest Green' },
        { code: 'PANTONE 18-3224 TPX', hex: '#006400', name: 'Dark Green' },
        { code: 'PANTONE 17-3617 TPX', hex: '#008000', name: 'Green' },
        { code: 'PANTONE 16-3520 TPX', hex: '#6B8E23', name: 'Olive Drab' },
        { code: 'PANTONE 15-3817 TPX', hex: '#9ACD32', name: 'Yellow Green' },
        { code: 'PANTONE 14-3207 TPX', hex: '#808000', name: 'Olive' },
        { code: 'PANTONE 13-3405 TPX', hex: '#556B2F', name: 'Dark Olive Green' },
        { code: 'PANTONE 12-2903 TPX', hex: '#66CDAA', name: 'Medium Aquamarine' },
        { code: 'PANTONE 18-3838 TPX', hex: '#7FFFD4', name: 'Aquamarine' },
        { code: 'PANTONE 19-3536 TPX', hex: '#40E0D0', name: 'Turquoise' },
        { code: 'PANTONE 18-3224 TPX', hex: '#48D1CC', name: 'Medium Turquoise' },
        { code: 'PANTONE 17-3617 TPX', hex: '#00CED1', name: 'Dark Turquoise' },
        { code: 'PANTONE 16-3520 TPX', hex: '#5F9EA0', name: 'Cadet Blue' },
        { code: 'PANTONE 15-3817 TPX', hex: '#4682B4', name: 'Steel Blue' },
        { code: 'PANTONE 14-3207 TPX', hex: '#B0C4DE', name: 'Light Steel Blue' },
        { code: 'PANTONE 13-3405 TPX', hex: '#B0E0E6', name: 'Powder Blue' },
        { code: 'PANTONE 12-2903 TPX', hex: '#ADD8E6', name: 'Light Blue' },
        { code: 'PANTONE 18-3838 TPX', hex: '#87CEEB', name: 'Sky Blue' },
        { code: 'PANTONE 19-3536 TPX', hex: '#87CEFA', name: 'Light Sky Blue' },
        { code: 'PANTONE 18-3224 TPX', hex: '#00BFFF', name: 'Deep Sky Blue' },
        { code: 'PANTONE 17-3617 TPX', hex: '#1E90FF', name: 'Dodger Blue' },
        { code: 'PANTONE 16-3520 TPX', hex: '#6495ED', name: 'Cornflower Blue' },
        { code: 'PANTONE 15-3817 TPX', hex: '#4169E1', name: 'Royal Blue' },
        { code: 'PANTONE 14-3207 TPX', hex: '#0000FF', name: 'Blue' },
        { code: 'PANTONE 13-3405 TPX', hex: '#0000CD', name: 'Medium Blue' },
        { code: 'PANTONE 12-2903 TPX', hex: '#00008B', name: 'Dark Blue' },
        { code: 'PANTONE 18-3838 TPX', hex: '#000080', name: 'Navy' },
        { code: 'PANTONE 19-3536 TPX', hex: '#191970', name: 'Midnight Blue' },
        { code: 'PANTONE 18-3224 TPX', hex: '#25008B', name: 'Royal Purple' },
        { code: 'PANTONE 17-3617 TPX', hex: '#4B0082', name: 'Indigo' },
        { code: 'PANTONE 16-3520 TPX', hex: '#8A2BE2', name: 'Blue Violet' },
        { code: 'PANTONE 15-3817 TPX', hex: '#9400D3', name: 'Dark Violet' },
        { code: 'PANTONE 14-3207 TPX', hex: '#9932CC', name: 'Dark Orchid' },
        { code: 'PANTONE 13-3405 TPX', hex: '#8B008B', name: 'Dark Magenta' },
        { code: 'PANTONE 12-2903 TPX', hex: '#800080', name: 'Purple' },
        { code: 'PANTONE 18-3838 TPX', hex: '#663399', name: 'Rebecca Purple' },
        { code: 'PANTONE 19-3536 TPX', hex: '#6A5ACD', name: 'Slate Blue' },
        { code: 'PANTONE 18-3224 TPX', hex: '#7B68EE', name: 'Medium Slate Blue' },
        { code: 'PANTONE 17-3617 TPX', hex: '#9370DB', name: 'Medium Purple' },
        { code: 'PANTONE 16-3520 TPX', hex: '#BA55D3', name: 'Medium Orchid' },
        { code: 'PANTONE 15-3817 TPX', hex: '#DA70D6', name: 'Orchid' },
        { code: 'PANTONE 14-3207 TPX', hex: '#DDA0DD', name: 'Plum' },
        { code: 'PANTONE 13-3405 TPX', hex: '#EE82EE', name: 'Violet' },
        { code: 'PANTONE 12-2903 TPX', hex: '#D8BFD8', name: 'Thistle' },
        { code: 'PANTONE 18-3838 TPX', hex: '#E6E6FA', name: 'Lavender' },
        { code: 'PANTONE 19-3536 TPX', hex: '#F0F8FF', name: 'Alice Blue' },
        { code: 'PANTONE 18-3224 TPX', hex: '#F5F5DC', name: 'Beige' },
        { code: 'PANTONE 17-3617 TPX', hex: '#F8F8FF', name: 'Ghost White' },
        { code: 'PANTONE 16-3520 TPX', hex: '#F0FFF0', name: 'Honeydew' },
        { code: 'PANTONE 15-3817 TPX', hex: '#F0FFFF', name: 'Azure' },
        { code: 'PANTONE 14-3207 TPX', hex: '#F5FFFA', name: 'Mint Cream' },
        { code: 'PANTONE 13-3405 TPX', hex: '#FFFAFA', name: 'Snow' },
        { code: 'PANTONE 12-2903 TPX', hex: '#FFFFF0', name: 'Ivory' },
        { code: 'PANTONE 18-3838 TPX', hex: '#FFFFFF', name: 'White' }
      ];
      
      // Convert hex to RGB for comparison
      const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
      };
      
      const targetRgb = hexToRgb(hexColor);
      let closestColor = null;
      let minDistance = Infinity;
      
      pantoneColors.forEach(pantone => {
        const pantoneRgb = hexToRgb(pantone.hex);
        
        // Calculate color distance using Euclidean distance
        const distance = Math.sqrt(
          Math.pow(targetRgb.r - pantoneRgb.r, 2) +
          Math.pow(targetRgb.g - pantoneRgb.g, 2) +
          Math.pow(targetRgb.b - pantoneRgb.b, 2)
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          closestColor = pantone;
        }
      });
      
      if (closestColor) {
        // Calculate confidence (inverted distance, scaled to percentage)
        const maxDistance = Math.sqrt(3 * Math.pow(255, 2)); // Maximum possible distance
        const confidence = Math.round((1 - (minDistance / maxDistance)) * 100);
        
        return {
          code: closestColor.code,
          confidence: Math.max(confidence, 65) // Minimum 65% confidence for UX
        };
      }
      
      return null;
    }

    // Find multiple closest Pantone color matches
    findClosestPantoneColors(hexColor, count = 5) {
            // Complete Pantone Color Database (TPG/TCX format) - All 2310 colors
      // Generated from pantone-numbers.json with proper formatting
      const pantoneColors = [
        { code: 'Egret - 11-0103 TCX', hex: '#F3ECE0', name: 'Egret' },
        { code: 'Snow white - 11-0602 TCX', hex: '#F2F0EB', name: 'Snow white' },
        { code: 'Bright white - 11-0601 TCX', hex: '#F4F5F0', name: 'Bright white' },
        { code: 'Cloud dancer - 11-4201 TCX', hex: '#F0EEE9', name: 'Cloud dancer' },
        { code: 'Gardenia - 11-0604 TCX', hex: '#F1E8DF', name: 'Gardenia' },
        { code: 'Marshmallow - 11-4300 TCX', hex: '#F0EEE4', name: 'Marshmallow' },
        { code: 'Blanc de blanc - 11-4800 TCX', hex: '#E7E9E7', name: 'Blanc de blanc' },
        { code: 'Pristine - 11-0606 TCX', hex: '#F2E8DA', name: 'Pristine' },
        { code: 'Whisper white - 11-0701 TCX', hex: '#EDE6DB', name: 'Whisper white' },
        { code: 'White asparagus - 12-0104 TCX', hex: '#E1DBC8', name: 'White asparagus' },
        { code: 'Birch - 13-0905 TCX', hex: '#DDD5C7', name: 'Birch' },
        { code: 'Turtledove - 12-5202 TCX', hex: '#DED7C8', name: 'Turtledove' },
        { code: 'Bone white - 12-0105 TCX', hex: '#D7D0C0', name: 'Bone white' },
        { code: 'Silver birch - 13-4403 TCX', hex: '#D2CFC4', name: 'Silver birch' },
        { code: 'Vanilla ice - 11-0104 TCX', hex: '#F0EADA', name: 'Vanilla ice' },
        { code: 'Papyrus - 11-0107 TCX', hex: '#F5EDD6', name: 'Papyrus' },
        { code: 'Antique white - 11-0105 TCX', hex: '#EDE3D2', name: 'Antique white' },
        { code: 'Winter white - 11-0507 TCX', hex: '#F5ECD2', name: 'Winter white' },
        { code: 'Cloud cream - 12-0804 TCX', hex: '#E6DDC5', name: 'Cloud cream' },
        { code: 'Angora - 12-0605 TCX', hex: '#DFD1BB', name: 'Angora' },
        { code: 'Seedpearl - 12-0703 TCX', hex: '#E6DAC4', name: 'Seedpearl' },
        { code: 'Vanilla custard - 12-0815 TCX', hex: '#F3E0BE', name: 'Vanilla custard' },
        { code: 'Almond oil - 12-0713 TCX', hex: '#F4EFC1', name: 'Almond oil' },
        { code: 'Alabaster gleam - 12-0812 TCX', hex: '#F0DEBD', name: 'Alabaster gleam' },
        { code: 'Vanilla - 12-0712 TCX', hex: '#F4E1C1', name: 'Vanilla' },
        { code: 'Rutabaga - 12-0806 TCX', hex: '#ECDDBE', name: 'Rutabaga' },
        { code: 'Banana crepe - 13-0815 TCX', hex: '#E7D3AD', name: 'Banana crepe' },
        { code: 'Italian straw - 13-0917 TCX', hex: '#E7D1A1', name: 'Italian straw' },
        { code: 'Whitecap gray - 12-0304 TCX', hex: '#E0D5C6', name: 'Whitecap gray' },
        { code: 'Fog - 13-0607 TCX', hex: '#D0C5B1', name: 'Fog' },
        { code: 'White swan - 12-0000 TCX', hex: '#E4D7C5', name: 'White swan' },
        { code: 'Sandshell - 13-0907 TCX', hex: '#D8CCBB', name: 'Sandshell' },
        { code: 'Tapioca - 12-1403 TCX', hex: '#DCCDBC', name: 'Tapioca' },
        { code: 'Creme brulee - 13-1006 TCX', hex: '#DBCCB5', name: 'Creme brulee' },
        { code: 'Parchment - 13-0908 TCX', hex: '#DFD1BE', name: 'Parchment' },
        { code: 'Sheer pink - 12-1106 TCX', hex: '#F6E5DB', name: 'Sheer pink' },
        { code: 'Dew - 12-1108 TCX', hex: '#EEDED1', name: 'Dew' },
        { code: 'Powder puff - 11-1404 TCX', hex: '#F3E0D6', name: 'Powder puff' },
        { code: 'Pearled ivory - 11-0907 TCX', hex: '#F0DFCC', name: 'Pearled ivory' },
        { code: 'White smoke - 12-0704 TCX', hex: '#EDDCC9', name: 'White smoke' },
        { code: 'Ecru - 11-0809 TCX', hex: '#F3DFCA', name: 'Ecru' },
        { code: 'Navajo - 12-0710 TCX', hex: '#EFDCC3', name: 'Navajo' },
        { code: 'Almost mauve - 12-2103 TCX', hex: '#E7DCD9', name: 'Almost mauve' },
        { code: 'Delicacy - 11-2409 TCX', hex: '#F5E3E2', name: 'Delicacy' },
        { code: 'Petal pink - 11-2309 TCX', hex: '#F2E2E0', name: 'Petal pink' },
        { code: 'Bridal blush - 11-1005 TCX', hex: '#EEE2DD', name: 'Bridal blush' },
        { code: 'Cream pink - 11-1306 TCX', hex: '#F6E4D9', name: 'Cream pink' },
        { code: 'Angel wing - 11-1305 TCX', hex: '#F3DFD7', name: 'Angel wing' },
        { code: 'Pastel parchment - 11-0603 TCX', hex: '#E5D9D3', name: 'Pastel parchment' },
        { code: 'Star white - 11-4202 TCX', hex: '#EFEFE8', name: 'Star white' },
        { code: 'Lily white - 11-4301 TCX', hex: '#E2E2DA', name: 'Lily white' },
        { code: 'Vaporous gray - 12-4302 TCX', hex: '#DFDDD7', name: 'Vaporous gray' },
        { code: 'Summer shower - 11-4802 TCX', hex: '#E5EBE3', name: 'Summer shower' },
        { code: 'Ice - 11-4803 TCX', hex: '#E0E4D9', name: 'Ice' },
        { code: 'Frost - 12-6207 TCX', hex: '#DDE2D6', name: 'Frost' },
        { code: 'Icicle - 12-5201 TCX', hex: '#DADCD0', name: 'Icicle' },
        { code: 'Bit of blue - 11-4601 TCX', hex: '#E2EAEB', name: 'Bit of blue' },
        { code: 'Mystic blue - 11-4303 TCX', hex: '#E1E3DE', name: 'Mystic blue' },
        { code: 'Bluewash - 12-4304 TCX', hex: '#E2E6E0', name: 'Bluewash' },
        { code: 'Spa blue - 12-4305 TCX', hex: '#D3DEDF', name: 'Spa blue' },
        { code: 'Lightest sky - 11-4804 TCX', hex: '#E4EADF', name: 'Lightest sky' },
        { code: 'Hint of mint - 11-4805 TCX', hex: '#D8E8E6', name: 'Hint of mint' },
        { code: 'Murmur - 12-5203 TCX', hex: '#D2D8D2', name: 'Murmur' },
        { code: 'Barely blue - 12-4306 TCX', hex: '#DDE0DF', name: 'Barely blue' },
        { code: 'Blue blush - 12-4705 TCX', hex: '#D6DBD9', name: 'Blue blush' },
        { code: 'Zephyr blue - 12-5603 TCX', hex: '#D3D9D1', name: 'Zephyr blue' },
        { code: 'Blue flower - 12-5403 TCX', hex: '#D0D9D4', name: 'Blue flower' },
        { code: 'Sprout green - 12-5303 TCX', hex: '#CBD7D2', name: 'Sprout green' },
        { code: 'Billowing sail - 11-4604 TCX', hex: '#D8E7E7', name: 'Billowing sail' },
        { code: 'Hushed green - 12-5508 TCX', hex: '#D8E9E5', name: 'Hushed green' },
        { code: 'Lambs wool - 12-0910 TCX', hex: '#E5D0B1', name: 'Lambs wool' },
        { code: 'Winter wheat - 14-1119 TCX', hex: '#DFC09F', name: 'Winter wheat' },
        { code: 'Summer melon - 13-0814 TCX', hex: '#EAD3AE', name: 'Summer melon' },
        { code: 'Chamomile - 13-0916 TCX', hex: '#E8D0A7', name: 'Chamomile' },
        { code: 'Cornhusk - 12-0714 TCX', hex: '#F2D6AE', name: 'Cornhusk' },
        { code: 'Apricot gelato - 12-0817 TCX', hex: '#F5D7AF', name: 'Apricot gelato' },
        { code: 'Biscotti - 13-1009 TCX', hex: '#DAC7AB', name: 'Biscotti' },
        { code: 'Asparagus green - 12-0311 TCX', hex: '#D2CDB4', name: 'Asparagus green' },
        { code: 'Oyster white - 13-1007 TCX', hex: '#D2CAAF', name: 'Oyster white' },
        { code: 'Putty - 13-0711 TCX', hex: '#D4CAB0', name: 'Putty' },
        { code: 'Moth - 13-0611 TCX', hex: '#D2CBAF', name: 'Moth' },
        { code: 'Wood ash - 14-1108 TCX', hex: '#D7CAB0', name: 'Wood ash' },
        { code: 'Gravel - 14-1014 TCX', hex: '#CBBFA2', name: 'Gravel' },
        { code: 'Pale khaki - 15-1216 TCX', hex: '#BFAF92', name: 'Pale khaki' },
        { code: 'Light gray - 12-0404 TCX', hex: '#DAD8C9', name: 'Light gray' },
        { code: 'Silver green - 12-6204 TCX', hex: '#D7D7C7', name: 'Silver green' },
        { code: 'Pelican - 14-6305 TCX', hex: '#C1BCAC', name: 'Pelican' },
        { code: 'Overcast - 14-0105 TCX', hex: '#C3BDAB', name: 'Overcast' },
        { code: 'Tidal foam - 14-0210 TCX', hex: '#BFB9A3', name: 'Tidal foam' },
        { code: 'Agate gray - 15-6307 TCX', hex: '#B1B09F', name: 'Agate gray' },
        { code: 'Alfalfa - 14-6308 TCX', hex: '#B7B59F', name: 'Alfalfa' },
        { code: 'Castle wall - 14-0108 TCX', hex: '#C8C1AB', name: 'Castle wall' },
        { code: 'Oyster gray - 14-1107 TCX', hex: '#CBC1AE', name: 'Oyster gray' },
        { code: 'Cement - 14-0708 TCX', hex: '#C4B6A6', name: 'Cement' },
        { code: 'Spray green - 15-0309 TCX', hex: '#AEA692', name: 'Spray green' },
        { code: 'Eucalyptus - 15-0513 TCX', hex: '#B1A992', name: 'Eucalyptus' },
        { code: 'Twill - 16-1108 TCX', hex: '#A79B82', name: 'Twill' },
        { code: 'Olive gray - 16-1110 TCX', hex: '#A6997A', name: 'Olive gray' },
        { code: 'Chinchilla - 17-1109 TCX', hex: '#9C8E7B', name: 'Chinchilla' },
        { code: 'Seneca rock - 17-1107 TCX', hex: '#9A927F', name: 'Seneca rock' },
        { code: 'Laurel oak - 17-0610 TCX', hex: '#918C7E', name: 'Laurel oak' },
        { code: 'Coriander - 17-1113 TCX', hex: '#938772', name: 'Coriander' },
        { code: 'Dune - 17-1009 TCX', hex: '#998978', name: 'Dune' },
        { code: 'Lead gray - 17-1118 TCX', hex: '#8A7963', name: 'Lead gray' },
        { code: 'Covert green - 18-0617 TCX', hex: '#80765F', name: 'Covert green' },
        { code: 'Oxford tan - 15-1306 TCX', hex: '#B8A99A', name: 'Oxford tan' },
        { code: 'Plaza taupe - 16-1105 TCX', hex: '#AEA393', name: 'Plaza taupe' },
        { code: 'Tuffet - 16-1106 TCX', hex: '#A59788', name: 'Tuffet' },
        { code: 'Silver mink - 17-1312 TCX', hex: '#9F8D7C', name: 'Silver mink' },
        { code: 'Timber wolf - 17-1310 TCX', hex: '#8D8070', name: 'Timber wolf' },
        { code: 'Taupe gray - 17-0808 TCX', hex: '#8E7C71', name: 'Taupe gray' },
        { code: 'Pine bark - 17-1410 TCX', hex: '#827064', name: 'Pine bark' },
        { code: 'Pumice stone - 14-0002 TCX', hex: '#CAC2B9', name: 'Pumice stone' },
        { code: 'Simply taupe - 16-0906 TCX', hex: '#AD9F93', name: 'Simply taupe' },
        { code: 'Aluminum - 16-1107 TCX', hex: '#9F9586', name: 'Aluminum' },
        { code: 'Cobblestone - 16-1407 TCX', hex: '#A89A8E', name: 'Cobblestone' },
        { code: 'Brindle - 18-1110 TCX', hex: '#82776B', name: 'Brindle' },
        { code: 'Walnut - 18-1112 TCX', hex: '#776A5F', name: 'Walnut' },
        { code: 'Bungee cord - 18-0513 TCX', hex: '#696156', name: 'Bungee cord' },
        { code: 'Oatmeal - 13-0401 TCX', hex: '#CBC3B4', name: 'Oatmeal' },
        { code: 'Moonbeam - 13-0000 TCX', hex: '#CDC6BD', name: 'Moonbeam' },
        { code: 'Rainy day - 13-5304 TCX', hex: '#CFC8BD', name: 'Rainy day' },
        { code: 'Gray morn - 13-0403 TCX', hex: '#CABEB5', name: 'Gray morn' },
        { code: 'Peyote - 14-1106 TCX', hex: '#C5BBAE', name: 'Peyote' },
        { code: 'Feather gray - 15-1305 TCX', hex: '#B8AD9E', name: 'Feather gray' },
        { code: 'Goat - 16-0806 TCX', hex: '#A89A91', name: 'Goat' },
        { code: 'White sand - 13-0002 TCX', hex: '#DBD5D1', name: 'White sand' },
        { code: 'Silver gray - 14-0000 TCX', hex: '#C1B7B0', name: 'Silver gray' },
        { code: 'Chateau gray - 15-4503 TCX', hex: '#BBB1A8', name: 'Chateau gray' },
        { code: 'String - 16-1305 TCX', hex: '#AA9F96', name: 'String' },
        { code: 'Atmosphere - 16-1406 TCX', hex: '#A89C94', name: 'Atmosphere' },
        { code: 'Moon rock - 17-1210 TCX', hex: '#958B84', name: 'Moon rock' },
        { code: 'Fungi - 17-1212 TCX', hex: '#8F8177', name: 'Fungi' },
        { code: 'Silver lining - 14-4501 TCX', hex: '#BDB6AB', name: 'Silver lining' },
        { code: 'Moonstruck - 14-4500 TCX', hex: '#C2BEB6', name: 'Moonstruck' },
        { code: 'Pussywillow gray - 15-6304 TCX', hex: '#AEACA1', name: 'Pussywillow gray' },
        { code: 'London fog - 16-0207 TCX', hex: '#A29E92', name: 'London fog' },
        { code: 'Rock ridge - 17-0207 TCX', hex: '#918C86', name: 'Rock ridge' },
        { code: 'Moon mist - 18-4105 TCX', hex: '#80817D', name: 'Moon mist' },
        { code: 'Castor gray - 18-0510 TCX', hex: '#646762', name: 'Castor gray' },
        { code: 'Glacier gray - 14-4102 TCX', hex: '#C5C6C7', name: 'Glacier gray' },
        { code: 'Lunar rock - 14-4201 TCX', hex: '#C5C5C5', name: 'Lunar rock' },
        { code: 'Dawn blue - 13-4303 TCX', hex: '#CACCCB', name: 'Dawn blue' },
        { code: 'Gray violet - 14-4103 TCX', hex: '#BBBCBC', name: 'Gray violet' },
        { code: 'Vapor blue - 14-4203 TCX', hex: '#BEBDBD', name: 'Vapor blue' },
        { code: 'High rise - 15-4101 TCX', hex: '#AEB2B5', name: 'High rise' },
        { code: 'Limestone - 16-4702 TCX', hex: '#989A98', name: 'Limestone' },
        { code: 'Silver cloud - 15-4502 TCX', hex: '#BEB7B0', name: 'Silver cloud' },
        { code: 'Dove - 15-0000 TCX', hex: '#B3ADA7', name: 'Dove' },
        { code: 'Flint gray - 16-5803 TCX', hex: '#A09C98', name: 'Flint gray' },
        { code: 'Drizzle - 16-4402 TCX', hex: '#A09F9C', name: 'Drizzle' },
        { code: 'Elephant skin - 17-0205 TCX', hex: '#8F8982', name: 'Elephant skin' },
        { code: 'Cinder - 17-1506 TCX', hex: '#8A7E78', name: 'Cinder' },
        { code: 'Steeple gray - 17-1500 TCX', hex: '#827E7C', name: 'Steeple gray' },
        { code: 'Metal - 14-4503 TCX', hex: '#BABFBC', name: 'Metal' },
        { code: 'Blue fox - 14-4804 TCX', hex: '#B9BCB6', name: 'Blue fox' },
        { code: 'Storm gray - 15-4003 TCX', hex: '#B5BAB6', name: 'Storm gray' },
        { code: 'Pigeon - 15-4704 TCX', hex: '#A9AFAA', name: 'Pigeon' },
        { code: 'Mirage gray - 15-4703 TCX', hex: '#ABAFAE', name: 'Mirage gray' },
        { code: 'Puritan gray - 15-4702 TCX', hex: '#A8B0AE', name: 'Puritan gray' },
        { code: 'Wrought iron - 16-5904 TCX', hex: '#999E98', name: 'Wrought iron' },
        { code: 'Opal gray - 16-3801 TCX', hex: '#A49E9E', name: 'Opal gray' },
        { code: 'Wild dove - 17-1501 TCX', hex: '#8B8C89', name: 'Wild dove' },
        { code: 'Neutral gray - 17-4402 TCX', hex: '#8E918F', name: 'Neutral gray' },
        { code: 'Gargoyle - 18-0503 TCX', hex: '#686767', name: 'Gargoyle' },
        { code: 'Smoked pearl - 18-0000 TCX', hex: '#656466', name: 'Smoked pearl' },
        { code: 'Sedona sage - 18-5105 TCX', hex: '#686D6C', name: 'Sedona sage' },
        { code: 'Gunmetal - 18-0306 TCX', hex: '#5C5D5B', name: 'Gunmetal' },
        { code: 'Wind chime - 14-4002 TCX', hex: '#CAC5C2', name: 'Wind chime' },
        { code: 'Paloma - 16-0000 TCX', hex: '#9F9C99', name: 'Paloma' },
        { code: 'Charcoal gray - 18-0601 TCX', hex: '#6C6868', name: 'Charcoal gray' },
        { code: 'Steel gray - 18-4005 TCX', hex: '#726F70', name: 'Steel gray' },
        { code: 'Pewter - 18-5203 TCX', hex: '#666564', name: 'Pewter' },
        { code: 'Castlerock - 18-0201 TCX', hex: '#5F5E62', name: 'Castlerock' },
        { code: 'Nine iron - 19-3908 TCX', hex: '#46434A', name: 'Nine iron' },
        { code: 'Ash - 16-3802 TCX', hex: '#A09998', name: 'Ash' },
        { code: 'Cloudburst - 17-1502 TCX', hex: '#837F7F', name: 'Cloudburst' },
        { code: 'Frost gray - 17-0000 TCX', hex: '#848283', name: 'Frost gray' },
        { code: 'Excalibur - 18-3905 TCX', hex: '#676168', name: 'Excalibur' },
        { code: 'Dark gull gray - 18-0403 TCX', hex: '#625D5D', name: 'Dark gull gray' },
        { code: 'Rabbit - 19-3905 TCX', hex: '#5F575C', name: 'Rabbit' },
        { code: 'Shale - 19-3903 TCX', hex: '#4A3F41', name: 'Shale' },
        { code: 'Fossil - 17-0909 TCX', hex: '#806F63', name: 'Fossil' },
        { code: 'Major brown - 19-0810 TCX', hex: '#5B5149', name: 'Major brown' },
        { code: 'Chocolate chip - 19-0809 TCX', hex: '#685A4E', name: 'Chocolate chip' },
        { code: 'Canteen - 19-0820 TCX', hex: '#5E5347', name: 'Canteen' },
        { code: 'Stone gray - 18-0615 TCX', hex: '#685E4F', name: 'Stone gray' },
        { code: 'Capers - 18-0820 TCX', hex: '#695E4B', name: 'Capers' },
        { code: 'Beech - 19-0618 TCX', hex: '#5B4F3B', name: 'Beech' },
        { code: 'Tarmac - 19-0822 TCX', hex: '#5A5348', name: 'Tarmac' },
        { code: 'Wren - 19-0614 TCX', hex: '#4A4139', name: 'Wren' },
        { code: 'Black olive - 19-0608 TCX', hex: '#48413B', name: 'Black olive' },
        { code: 'Beluga - 19-0405 TCX', hex: '#4A4843', name: 'Beluga' },
        { code: 'Black ink - 19-0506 TCX', hex: '#44413C', name: 'Black ink' },
        { code: 'Peat - 19-0508 TCX', hex: '#3B3A36', name: 'Peat' },
        { code: 'Jet set - 19-5708 TCX', hex: '#262C2A', name: 'Jet set' },
        { code: 'Iron - 18-1306 TCX', hex: '#736460', name: 'Iron' },
        { code: 'Plum kitten - 19-3803 TCX', hex: '#625B5C', name: 'Plum kitten' },
        { code: 'Turkish coffee - 19-0812 TCX', hex: '#483F39', name: 'Turkish coffee' },
        { code: 'Black coffee - 19-1111 TCX', hex: '#3B302F', name: 'Black coffee' },
        { code: 'After dark - 19-1101 TCX', hex: '#3C3535', name: 'After dark' },
        { code: 'Licorice - 19-1102 TCX', hex: '#3A3536', name: 'Licorice' },
        { code: 'Raven - 19-0000 TCX', hex: '#413E3D', name: 'Raven' },
        { code: 'Jet black - 19-0303 TCX', hex: '#2D2C2F', name: 'Jet black' },
        { code: 'Phantom - 19-4205 TCX', hex: '#39373B', name: 'Phantom' },
        { code: 'Stretch limo - 19-4005 TCX', hex: '#2B2C30', name: 'Stretch limo' },
        { code: 'Moonless night - 19-4203 TCX', hex: '#2F2D30', name: 'Moonless night' },
        { code: 'Caviar - 19-4006 TCX', hex: '#292A2D', name: 'Caviar' },
        { code: 'Pirate black - 19-4305 TCX', hex: '#363838', name: 'Pirate black' },
        { code: 'Anthracite - 19-4007 TCX', hex: '#28282D', name: 'Anthracite' },
        { code: 'Vanilla cream - 12-1009 TCX', hex: '#F4D8C6', name: 'Vanilla cream' },
        { code: 'Dawn - 12-0811 TCX', hex: '#EBD2B7', name: 'Dawn' },
        { code: 'Gray sand - 13-1010 TCX', hex: '#E5CCAF', name: 'Gray sand' },
        { code: 'Autumn blonde - 12-0813 TCX', hex: '#EED0AE', name: 'Autumn blonde' },
        { code: 'Apricot illusion - 14-1120 TCX', hex: '#E2C4A6', name: 'Apricot illusion' },
        { code: 'Mellow buff - 13-1014 TCX', hex: '#D8B998', name: 'Mellow buff' },
        { code: 'Sheepskin - 14-1122 TCX', hex: '#DAB58F', name: 'Sheepskin' },
        { code: 'Almond buff - 14-1116 TCX', hex: '#CCB390', name: 'Almond buff' },
        { code: 'Beige - 14-1118 TCX', hex: '#D5BA98', name: 'Beige' },
        { code: 'Sand - 15-1225 TCX', hex: '#CCA67F', name: 'Sand' },
        { code: 'Latte - 15-1220 TCX', hex: '#C5A582', name: 'Latte' },
        { code: 'Tan - 16-1334 TCX', hex: '#B69574', name: 'Tan' },
        { code: 'Doe - 16-1333 TCX', hex: '#B98E68', name: 'Doe' },
        { code: 'Indian tan - 17-1328 TCX', hex: '#AD8567', name: 'Indian tan' },
        { code: 'Safari - 15-1116 TCX', hex: '#BAAA91', name: 'Safari' },
        { code: 'Candied ginger - 15-1213 TCX', hex: '#BFA387', name: 'Candied ginger' },
        { code: 'Warm sand - 15-1214 TCX', hex: '#C5AE91', name: 'Warm sand' },
        { code: 'Cuban sand - 15-1314 TCX', hex: '#C1A68D', name: 'Cuban sand' },
        { code: 'Nougat - 16-1320 TCX', hex: '#B69885', name: 'Nougat' },
        { code: 'Natural - 16-1310 TCX', hex: '#AA907D', name: 'Natural' },
        { code: 'Nomad - 16-1212 TCX', hex: '#B49F89', name: 'Nomad' },
        { code: 'Frozen dew - 13-0513 TCX', hex: '#D8CFB2', name: 'Frozen dew' },
        { code: 'Bleached sand - 13-1008 TCX', hex: '#DACCB4', name: 'Bleached sand' },
        { code: 'Pebble - 14-1112 TCX', hex: '#CAB698', name: 'Pebble' },
        { code: 'Croissant - 16-0924 TCX', hex: '#C4AB86', name: 'Croissant' },
        { code: 'Incense - 16-1010 TCX', hex: '#AF9A7E', name: 'Incense' },
        { code: 'Cornstalk - 16-1315 TCX', hex: '#A9947A', name: 'Cornstalk' },
        { code: 'Tannin - 17-1320 TCX', hex: '#A68A6D', name: 'Tannin' },
        { code: 'Green haze - 14-0615 TCX', hex: '#CAC4A4', name: 'Green haze' },
        { code: 'Mojave desert - 15-1217 TCX', hex: '#C7B595', name: 'Mojave desert' },
        { code: 'Taos taupe - 15-1119 TCX', hex: '#BFA77F', name: 'Taos taupe' },
        { code: 'Lark - 16-1324 TCX', hex: '#B89B72', name: 'Lark' },
        { code: 'Kelp - 17-1022 TCX', hex: '#988467', name: 'Kelp' },
        { code: 'Antique bronze - 17-1028 TCX', hex: '#907954', name: 'Antique bronze' },
        { code: 'Dull gold - 17-0935 TCX', hex: '#8A6F48', name: 'Dull gold' },
        { code: 'Brown sugar - 17-1134 TCX', hex: '#A17249', name: 'Brown sugar' },
        { code: 'Chipmunk - 17-1044 TCX', hex: '#976F4C', name: 'Chipmunk' },
        { code: 'Tobacco brown - 17-1327 TCX', hex: '#9A7352', name: 'Tobacco brown' },
        { code: 'Bison - 18-1027 TCX', hex: '#6E4F3A', name: 'Bison' },
        { code: 'Monks robe - 18-1048 TCX', hex: '#704822', name: 'Monks robe' },
        { code: 'Dachshund - 18-1033 TCX', hex: '#704F37', name: 'Dachshund' },
        { code: 'Toffee - 18-1031 TCX', hex: '#755139', name: 'Toffee' },
        { code: 'Aztec - 18-1130 TCX', hex: '#7A5747', name: 'Aztec' },
        { code: 'Cocoa brown - 18-1222 TCX', hex: '#6C5043', name: 'Cocoa brown' },
        { code: 'Partridge - 18-1124 TCX', hex: '#725440', name: 'Partridge' },
        { code: 'Friar brown - 19-1230 TCX', hex: '#6E493A', name: 'Friar brown' },
        { code: 'Mustang - 19-1217 TCX', hex: '#684B40', name: 'Mustang' },
        { code: 'Pinecone - 19-1121 TCX', hex: '#61473B', name: 'Pinecone' },
        { code: 'Potting soil - 19-1218 TCX', hex: '#54392D', name: 'Potting soil' },
        { code: 'Ermine - 18-1022 TCX', hex: '#836B4F', name: 'Ermine' },
        { code: 'Otter - 18-1018 TCX', hex: '#7F674F', name: 'Otter' },
        { code: 'Kangaroo - 18-0920 TCX', hex: '#725E43', name: 'Kangaroo' },
        { code: 'Sepia - 18-0928 TCX', hex: '#6B543E', name: 'Sepia' },
        { code: 'Coffee liqueur - 18-0930 TCX', hex: '#6A513B', name: 'Coffee liqueur' },
        { code: 'Desert palm - 19-0815 TCX', hex: '#5A4632', name: 'Desert palm' },
        { code: 'Teak - 19-0617 TCX', hex: '#655341', name: 'Teak' },
        { code: 'Shitake - 18-1015 TCX', hex: '#736253', name: 'Shitake' },
        { code: 'Cub - 18-1016 TCX', hex: '#6E5C4B', name: 'Cub' },
        { code: 'Carafe - 19-1116 TCX', hex: '#5D473A', name: 'Carafe' },
        { code: 'Dark earth - 19-1020 TCX', hex: '#5C4939', name: 'Dark earth' },
        { code: 'Slate black - 19-0814 TCX', hex: '#4B3D33', name: 'Slate black' },
        { code: 'Chocolate brown - 19-0912 TCX', hex: '#4E403B', name: 'Chocolate brown' },
        { code: 'Demitasse - 19-0712 TCX', hex: '#40342B', name: 'Demitasse' },
        { code: 'Deep taupe - 18-1312 TCX', hex: '#7B6660', name: 'Deep taupe' },
        { code: 'Shopping bag - 19-1213 TCX', hex: '#5A4743', name: 'Shopping bag' },
        { code: 'Chestnut - 19-1118 TCX', hex: '#584039', name: 'Chestnut' },
        { code: 'Bracken - 19-1015 TCX', hex: '#4F3F3B', name: 'Bracken' },
        { code: 'Seal brown - 19-1314 TCX', hex: '#493B39', name: 'Seal brown' },
        { code: 'Java - 19-1016 TCX', hex: '#433331', name: 'Java' },
        { code: 'Coffee bean - 19-0915 TCX', hex: '#40312F', name: 'Coffee bean' },
        { code: 'Mother of pearl - 12-1006 TCX', hex: '#E9D4C3', name: 'Mother of pearl' },
        { code: 'Pastel rose tan - 12-1007 TCX', hex: '#E9D1BF', name: 'Pastel rose tan' },
        { code: 'Novelle peach - 12-1005 TCX', hex: '#E7CFBD', name: 'Novelle peach' },
        { code: 'Sun kiss - 12-0807 TCX', hex: '#EBD1BB', name: 'Sun kiss' },
        { code: 'Ivory cream - 13-1011 TCX', hex: '#DAC0A7', name: 'Ivory cream' },
        { code: 'Shifting sand - 14-1210 TCX', hex: '#D8C0AD', name: 'Shifting sand' },
        { code: 'Appleblossom - 13-1013 TCX', hex: '#DDBCA0', name: 'Appleblossom' },
        { code: 'Eggnog - 12-0601 TCX', hex: '#ECE1D3', name: 'Eggnog' },
        { code: 'Cream tan - 13-1108 TCX', hex: '#E4C7B8', name: 'Cream tan' },
        { code: 'Sand dollar - 13-1106 TCX', hex: '#DECDBE', name: 'Sand dollar' },
        { code: 'Smoke gray - 14-1209 TCX', hex: '#CEBAA8', name: 'Smoke gray' },
        { code: 'Doeskin - 15-1308 TCX', hex: '#BDAB9B', name: 'Doeskin' },
        { code: 'Sesame - 15-1215 TCX', hex: '#BAA38B', name: 'Sesame' },
        { code: 'Light taupe - 16-1210 TCX', hex: '#B19D8D', name: 'Light taupe' },
        { code: 'Warm taupe - 16-1318 TCX', hex: '#AF9483', name: 'Warm taupe' },
        { code: 'Stucco - 16-1412 TCX', hex: '#A58D7F', name: 'Stucco' },
        { code: 'Almondine - 16-1415 TCX', hex: '#A78C8B', name: 'Almondine' },
        { code: 'Chanterelle - 16-1414 TCX', hex: '#A28776', name: 'Chanterelle' },
        { code: 'Ginger snap - 17-1418 TCX', hex: '#977D70', name: 'Ginger snap' },
        { code: 'Woodsmoke - 17-1321 TCX', hex: '#947764', name: 'Woodsmoke' },
        { code: 'Amphora - 17-1319 TCX', hex: '#9F8672', name: 'Amphora' },
        { code: 'Moonlight - 15-1309 TCX', hex: '#C5B1A0', name: 'Moonlight' },
        { code: 'Frappe - 14-1212 TCX', hex: '#D1B7A0', name: 'Frappe' },
        { code: 'Rugby tan - 15-1315 TCX', hex: '#C2A594', name: 'Rugby tan' },
        { code: 'Roebuck - 16-1221 TCX', hex: '#B09080', name: 'Roebuck' },
        { code: 'Praline - 17-1223 TCX', hex: '#AD8B75', name: 'Praline' },
        { code: 'Burro - 17-1322 TCX', hex: '#947764', name: 'Burro' },
        { code: 'Beaver fur - 17-1417 TCX', hex: '#997867', name: 'Beaver fur' },
        { code: 'Toasted almond - 14-1213 TCX', hex: '#D2B49C', name: 'Toasted almond' },
        { code: 'Tawny birch - 17-1225 TCX', hex: '#AE856C', name: 'Tawny birch' },
        { code: 'Macaroon - 16-1323 TCX', hex: '#B38B71', name: 'Macaroon' },
        { code: 'Tawny brown - 17-1226 TCX', hex: '#AB856F', name: 'Tawny brown' },
        { code: 'Camel - 17-1224 TCX', hex: '#B0846A', name: 'Camel' },
        { code: 'Toast - 16-1331 TCX', hex: '#CA9978', name: 'Toast' },
        { code: 'Toasted nut - 16-1327 TCX', hex: '#C08768', name: 'Toasted nut' },
        { code: 'Nude - 12-0911 TCX', hex: '#F2D3BC', name: 'Nude' },
        { code: 'Tender peach - 12-0912 TCX', hex: '#F8D5B8', name: 'Tender peach' },
        { code: 'Alesan - 12-0913 TCX', hex: '#F1CEB3', name: 'Alesan' },
        { code: 'Pale peach - 12-0915 TCX', hex: '#FED1BD', name: 'Pale peach' },
        { code: 'Peach puree - 12-1011 TCX', hex: '#EFCFBA', name: 'Peach puree' },
        { code: 'Bellini - 13-1114 TCX', hex: '#F4C9B1', name: 'Bellini' },
        { code: 'Amberlight - 14-1217 TCX', hex: '#E2BEA2', name: 'Amberlight' },
        { code: 'Peach dust - 12-1107 TCX', hex: '#F0D8CC', name: 'Peach dust' },
        { code: 'Linen - 12-1008 TCX', hex: '#EDD2C0', name: 'Linen' },
        { code: 'Scallop shell - 12-1010 TCX', hex: '#FBD8C9', name: 'Scallop shell' },
        { code: 'Soft pink - 12-1209 TCX', hex: '#F2D8CD', name: 'Soft pink' },
        { code: 'Pale dogwood - 13-1404 TCX', hex: '#EDCDC2', name: 'Pale dogwood' },
        { code: 'Silver peony - 12-1206 TCX', hex: '#E7CFC7', name: 'Silver peony' },
        { code: 'Rose dust - 14-1307 TCX', hex: '#CDB2A5', name: 'Rose dust' },
        { code: 'Shell - 13-1405 TCX', hex: '#E1CFC6', name: 'Shell' },
        { code: 'Whisper pink - 13-1107 TCX', hex: '#DACBBE', name: 'Whisper pink' },
        { code: 'Pink tint - 12-1404 TCX', hex: '#DBCBBD', name: 'Pink tint' },
        { code: 'Evening sand - 14-1311 TCX', hex: '#DDB6AB', name: 'Evening sand' },
        { code: 'Sirocco - 15-1317 TCX', hex: '#C39D88', name: 'Sirocco' },
        { code: 'Brush - 16-1317 TCX', hex: '#B99984', name: 'Brush' },
        { code: 'Cafe au lait - 17-1227 TCX', hex: '#AE8774', name: 'Cafe au lait' },
        { code: 'Cameo rose - 14-1310 TCX', hex: '#D7B8AB', name: 'Cameo rose' },
        { code: 'Pale blush - 14-1312 TCX', hex: '#E4BFB3', name: 'Pale blush' },
        { code: 'Rose cloud - 14-1313 TCX', hex: '#DBB0A2', name: 'Rose cloud' },
        { code: 'Spanish villa - 14-1314 TCX', hex: '#DFBAA9', name: 'Spanish villa' },
        { code: 'Maple sugar - 15-1316 TCX', hex: '#C9A38D', name: 'Maple sugar' },
        { code: 'Tuscany - 16-1219 TCX', hex: '#BE9785', name: 'Tuscany' },
        { code: 'Cork - 16-1422 TCX', hex: '#BA8671', name: 'Cork' },
        { code: 'Bisque - 13-1109 TCX', hex: '#EDCAB5', name: 'Bisque' },
        { code: 'Almost apricot - 15-1319 TCX', hex: '#E5B39B', name: 'Almost apricot' },
        { code: 'Pink sand - 15-1318 TCX', hex: '#DFB19B', name: 'Pink sand' },
        { code: 'Peach nougat - 14-1220 TCX', hex: '#E6AF91', name: 'Peach nougat' },
        { code: 'Peach bloom - 15-1327 TCX', hex: '#D99B7C', name: 'Peach bloom' },
        { code: 'Dusty coral - 15-1322 TCX', hex: '#D29B83', name: 'Dusty coral' },
        { code: 'Cafe creme - 16-1220 TCX', hex: '#C79685', name: 'Cafe creme' },
        { code: 'Sandstorm - 16-1235 TCX', hex: '#BD8B69', name: 'Sandstorm' },
        { code: 'Butterum - 16-1341 TCX', hex: '#C68F65', name: 'Butterum' },
        { code: 'Biscuit - 16-1336 TCX', hex: '#B4835B', name: 'Biscuit' },
        { code: 'Cashew - 17-1137 TCX', hex: '#A47149', name: 'Cashew' },
        { code: 'Almond - 16-1432 TCX', hex: '#A7754D', name: 'Almond' },
        { code: 'Lion - 17-1330 TCX', hex: '#A0714F', name: 'Lion' },
        { code: 'Thrush - 18-1030 TCX', hex: '#936B4F', name: 'Thrush' },
        { code: 'Mocha mousse - 17-1230 TCX', hex: '#A47864', name: 'Mocha mousse' },
        { code: 'Pecan brown - 17-1430 TCX', hex: '#A36E51', name: 'Pecan brown' },
        { code: 'Hazel - 17-1143 TCX', hex: '#AE7250', name: 'Hazel' },
        { code: 'Bran - 17-1336 TCX', hex: '#A66E4A', name: 'Bran' },
        { code: 'Adobe - 17-1340 TCX', hex: '#A3623B', name: 'Adobe' },
        { code: 'Leather brown - 18-1142 TCX', hex: '#97572B', name: 'Leather brown' },
        { code: 'Glazed ginger - 18-1154 TCX', hex: '#91552B', name: 'Glazed ginger' },
        { code: 'Sandstone - 16-1328 TCX', hex: '#C48A69', name: 'Sandstone' },
        { code: 'Caramel - 16-1439 TCX', hex: '#C37C54', name: 'Caramel' },
        { code: 'Amber brown - 17-1147 TCX', hex: '#A66646', name: 'Amber brown' },
        { code: 'Sierra - 18-1239 TCX', hex: '#985C41', name: 'Sierra' },
        { code: 'Ginger bread - 18-1244 TCX', hex: '#8C4A2F', name: 'Ginger bread' },
        { code: 'Mocha bisque - 18-1140 TCX', hex: '#8C543A', name: 'Mocha bisque' },
        { code: 'Tortoise shell - 19-1241 TCX', hex: '#754734', name: 'Tortoise shell' },
        { code: 'Pheasant - 16-1332 TCX', hex: '#C68463', name: 'Pheasant' },
        { code: 'Sunburn - 16-1429 TCX', hex: '#B37256', name: 'Sunburn' },
        { code: 'Raw sienna - 17-1436 TCX', hex: '#B9714F', name: 'Raw sienna' },
        { code: 'Autumn leaf - 17-1347 TCX', hex: '#B56A4C', name: 'Autumn leaf' },
        { code: 'Mecca orange - 18-1450 TCX', hex: '#BD5745', name: 'Mecca orange' },
        { code: 'Rust - 18-1248 TCX', hex: '#B55A30', name: 'Rust' },
        { code: 'Bombay brown - 18-1250 TCX', hex: '#9F5130', name: 'Bombay brown' },
        { code: 'Frosted almond - 13-1012 TCX', hex: '#D2C2AC', name: 'Frosted almond' },
        { code: 'Gilded beige - 14-1012 TCX', hex: '#B39F8D', name: 'Gilded beige' },
        { code: 'Pale gold - 15-0927 TCX', hex: '#BD9865', name: 'Pale gold' },
        { code: 'Rich gold - 16-0836 TCX', hex: '#C8B273', name: 'Rich gold' },
        { code: 'Copper - 16-1325 TCX', hex: '#C47E5A', name: 'Copper' },
        { code: 'Copper coin - 18-1537 TCX', hex: '#BA6B57', name: 'Copper coin' },
        { code: 'Silver - 14-5002 TCX', hex: '#A2A2A1', name: 'Silver' },
        { code: 'Raw umber - 17-1422 TCX', hex: '#92705F', name: 'Raw umber' },
        { code: 'Brownie - 18-1321 TCX', hex: '#8F7265', name: 'Brownie' },
        { code: 'Acorn - 18-1314 TCX', hex: '#7E5E52', name: 'Acorn' },
        { code: 'Clove - 18-1320 TCX', hex: '#876155', name: 'Clove' },
        { code: 'Carob brown - 18-1229 TCX', hex: '#855C4C', name: 'Carob brown' },
        { code: 'Russet - 18-1235 TCX', hex: '#8F5F50', name: 'Russet' },
        { code: 'Rawhide - 18-1137 TCX', hex: '#865E49', name: 'Rawhide' },
        { code: 'Chutney - 18-1433 TCX', hex: '#98594B', name: 'Chutney' },
        { code: 'Baked clay - 18-1441 TCX', hex: '#9C5642', name: 'Baked clay' },
        { code: 'Copper brown - 18-1336 TCX', hex: '#9A6051', name: 'Copper brown' },
        { code: 'Brown patina - 18-1242 TCX', hex: '#834F3D', name: 'Brown patina' },
        { code: 'Rustic brown - 18-1238 TCX', hex: '#855141', name: 'Rustic brown' },
        { code: 'Coconut shell - 18-1230 TCX', hex: '#874E3C', name: 'Coconut shell' },
        { code: 'Sequoia - 19-1333 TCX', hex: '#804839', name: 'Sequoia' },
        { code: 'Root beer - 19-1228 TCX', hex: '#714A41', name: 'Root beer' },
        { code: 'Brunette - 19-1235 TCX', hex: '#664238', name: 'Brunette' },
        { code: 'Sable - 19-1320 TCX', hex: '#6E403C', name: 'Sable' },
        { code: 'Cinnamon - 19-1436 TCX', hex: '#6B4139', name: 'Cinnamon' },
        { code: 'Fudgesickle - 19-1431 TCX', hex: '#63403A', name: 'Fudgesickle' },
        { code: 'Mink - 19-1430 TCX', hex: '#734B42', name: 'Mink' },
        { code: 'Cappuccino - 19-1220 TCX', hex: '#633F33', name: 'Cappuccino' },
        { code: 'Cognac - 18-1421 TCX', hex: '#8B645A', name: 'Cognac' },
        { code: 'Nutmeg - 18-1326 TCX', hex: '#7E5C54', name: 'Nutmeg' },
        { code: 'French roast - 19-1012 TCX', hex: '#58423F', name: 'French roast' },
        { code: 'Deep mahogany - 19-1420 TCX', hex: '#553B39', name: 'Deep mahogany' },
        { code: 'Rum raisin - 19-1321 TCX', hex: '#583432', name: 'Rum raisin' },
        { code: 'Brown stone - 19-1322 TCX', hex: '#593C39', name: 'Brown stone' },
        { code: 'Bitter chocolate - 19-1317 TCX', hex: '#503130', name: 'Bitter chocolate' },
        { code: 'Mahogany - 18-1425 TCX', hex: '#824D46', name: 'Mahogany' },
        { code: 'Henna - 19-1334 TCX', hex: '#7C423C', name: 'Henna' },
        { code: 'Arabian spice - 19-1245 TCX', hex: '#884332', name: 'Arabian spice' },
        { code: 'Hot chocolate - 19-1325 TCX', hex: '#683B39', name: 'Hot chocolate' },
        { code: 'Russet brown - 19-1338 TCX', hex: '#743332', name: 'Russet brown' },
        { code: 'Madder brown - 19-1331 TCX', hex: '#6A3331', name: 'Madder brown' },
        { code: 'Andorra - 19-1327 TCX', hex: '#603535', name: 'Andorra' },
        { code: 'Afterglow - 11-0510 TCX', hex: '#F3E6C9', name: 'Afterglow' },
        { code: 'Transparent yellow - 11-0617 TCX', hex: '#F4ECC2', name: 'Transparent yellow' },
        { code: 'Double cream - 12-0715 TCX', hex: '#F3E0AC', name: 'Double cream' },
        { code: 'Sunlight - 13-0822 TCX', hex: '#EDD59E', name: 'Sunlight' },
        { code: 'Straw - 13-0922 TCX', hex: '#E0C992', name: 'Straw' },
        { code: 'Jojoba - 14-0935 TCX', hex: '#DABE81', name: 'Jojoba' },
        { code: 'Rattan - 14-1031 TCX', hex: '#D1B272', name: 'Rattan' },
        { code: 'Boulder - 14-1110 TCX', hex: '#D1BE9B', name: 'Boulder' },
        { code: 'Sea mist - 13-0715 TCX', hex: '#D8C9A3', name: 'Sea mist' },
        { code: 'Reed yellow - 13-0915 TCX', hex: '#DCC99E', name: 'Reed yellow' },
        { code: 'Chino green - 13-0613 TCX', hex: '#D9CAA5', name: 'Chino green' },
        { code: 'Parsnip - 14-0925 TCX', hex: '#D6C69A', name: 'Parsnip' },
        { code: 'Dusty yellow - 12-0619 TCX', hex: '#D4CC9A', name: 'Dusty yellow' },
        { code: 'Silver fern - 15-0719 TCX', hex: '#BBAA7E', name: 'Silver fern' },
        { code: 'Lemon grass - 12-0626 TCX', hex: '#DCD494', name: 'Lemon grass' },
        { code: 'Raffia - 13-0725 TCX', hex: '#DAC483', name: 'Raffia' },
        { code: 'Golden mist - 13-0624 TCX', hex: '#D5CD94', name: 'Golden mist' },
        { code: 'Pampas - 14-0826 TCX', hex: '#CFBB7B', name: 'Pampas' },
        { code: 'Bamboo - 14-0740 TCX', hex: '#D2B04C', name: 'Bamboo' },
        { code: 'Cress green - 15-0643 TCX', hex: '#BCA949', name: 'Cress green' },
        { code: 'Olive oil - 16-0847 TCX', hex: '#A98B2D', name: 'Olive oil' },
        { code: 'Dried moss - 14-0626 TCX', hex: '#CCB97E', name: 'Dried moss' },
        { code: 'Celery - 14-0647 TCX', hex: '#CEC153', name: 'Celery' },
        { code: 'Acacia - 13-0640 TCX', hex: '#DACD65', name: 'Acacia' },
        { code: 'Sulphur - 14-0755 TCX', hex: '#DDB614', name: 'Sulphur' },
        { code: 'Oil yellow - 15-0743 TCX', hex: '#C4A647', name: 'Oil yellow' },
        { code: 'Green sulphur - 16-0742 TCX', hex: '#AE8E2C', name: 'Green sulphur' },
        { code: 'Golden palm - 17-0839 TCX', hex: '#AA8805', name: 'Golden palm' },
        { code: 'Cocoon - 14-1025 TCX', hex: '#C9B27C', name: 'Cocoon' },
        { code: 'Hemp - 14-0721 TCX', hex: '#C0AD7C', name: 'Hemp' },
        { code: 'Southern moss - 15-0730 TCX', hex: '#BCA66A', name: 'Southern moss' },
        { code: 'Olivenite - 15-0732 TCX', hex: '#C1A65C', name: 'Olivenite' },
        { code: 'Golden green - 15-0636 TCX', hex: '#BDB369', name: 'Golden green' },
        { code: 'Antique gold - 16-0730 TCX', hex: '#B59E5F', name: 'Antique gold' },
        { code: 'Burnished gold - 16-0737 TCX', hex: '#AA9855', name: 'Burnished gold' },
        { code: 'French vanilla - 12-0722 TCX', hex: '#EFE1A7', name: 'French vanilla' },
        { code: 'Pastel yellow - 11-0616 TCX', hex: '#F2E6B1', name: 'Pastel yellow' },
        { code: 'Tender yellow - 11-0710 TCX', hex: '#EDEDB7', name: 'Tender yellow' },
        { code: 'Wax yellow - 11-0618 TCX', hex: '#EDE9AD', name: 'Wax yellow' },
        { code: 'Lemonade - 12-0721 TCX', hex: '#F0E79D', name: 'Lemonade' },
        { code: 'Elfin yellow - 11-0620 TCX', hex: '#EEEA97', name: 'Elfin yellow' },
        { code: 'Limelight - 12-0740 TCX', hex: '#F0E87D', name: 'Limelight' },
        { code: 'Dusky citron - 14-0827 TCX', hex: '#E3CC81', name: 'Dusky citron' },
        { code: 'Muted lime - 14-0636 TCX', hex: '#D1C87C', name: 'Muted lime' },
        { code: 'Endive - 13-0632 TCX', hex: '#D2CC81', name: 'Endive' },
        { code: 'Custard - 13-0720 TCX', hex: '#E5D68E', name: 'Custard' },
        { code: 'Canary yellow - 12-0633 TCX', hex: '#DFD87E', name: 'Canary yellow' },
        { code: 'Yellow cream - 12-0738 TCX', hex: '#EFDC75', name: 'Yellow cream' },
        { code: 'Cream gold - 13-0739 TCX', hex: '#DEC05F', name: 'Cream gold' },
        { code: 'Aurora - 12-0642 TCX', hex: '#EDDD59', name: 'Aurora' },
        { code: 'Green sheen - 13-0648 TCX', hex: '#D9CE52', name: 'Green sheen' },
        { code: 'Maize - 13-0746 TCX', hex: '#EEC843', name: 'Maize' },
        { code: 'Blazing yellow - 12-0643 TCX', hex: '#FEE715', name: 'Blazing yellow' },
        { code: 'Buttercup - 12-0752 TCX', hex: '#FAE03C', name: 'Buttercup' },
        { code: 'Empire yellow - 14-0756 TCX', hex: '#F7D000', name: 'Empire yellow' },
        { code: 'Lemon - 13-0752 TCX', hex: '#F3BF08', name: 'Lemon' },
        { code: 'Mimosa - 14-0848 TCX', hex: '#F0C05A', name: 'Mimosa' },
        { code: 'Aspen gold - 13-0850 TCX', hex: '#FFD662', name: 'Aspen gold' },
        { code: 'Dandelion - 13-0758 TCX', hex: '#FFD02E', name: 'Dandelion' },
        { code: 'Vibrant yellow - 13-0858 TCX', hex: '#FFDA29', name: 'Vibrant yellow' },
        { code: 'Cyber yellow - 14-0760 TCX', hex: '#FFD400', name: 'Cyber yellow' },
        { code: 'Freesia - 14-0852 TCX', hex: '#F3C12C', name: 'Freesia' },
        { code: 'Lemon chrome - 13-0859 TCX', hex: '#FFC300', name: 'Lemon chrome' },
        { code: 'Mellow yellow - 12-0720 TCX', hex: '#F0DD9D', name: 'Mellow yellow' },
        { code: 'Pale banana - 12-0824 TCX', hex: '#FAE199', name: 'Pale banana' },
        { code: 'Popcorn - 12-0825 TCX', hex: '#F8DE8D', name: 'Popcorn' },
        { code: 'Sunshine - 12-0727 TCX', hex: '#FADE85', name: 'Sunshine' },
        { code: 'Lemon drop - 12-0736 TCX', hex: '#FDD878', name: 'Lemon drop' },
        { code: 'Primrose yellow - 13-0755 TCX', hex: '#F6D155', name: 'Primrose yellow' },
        { code: 'Super lemon - 14-0754 TCX', hex: '#E4BF45', name: 'Super lemon' },
        { code: 'Misted yellow - 14-0837 TCX', hex: '#DAB965', name: 'Misted yellow' },
        { code: 'Sauterne - 15-0942 TCX', hex: '#C5A253', name: 'Sauterne' },
        { code: 'Honey - 16-0946 TCX', hex: '#BA9238', name: 'Honey' },
        { code: 'Arrowwood - 16-0954 TCX', hex: '#BC8D1F', name: 'Arrowwood' },
        { code: 'Tawny olive - 16-0953 TCX', hex: '#C4962C', name: 'Tawny olive' },
        { code: 'Ceylon yellow - 15-0850 TCX', hex: '#D4AE40', name: 'Ceylon yellow' },
        { code: 'Lemon curry - 15-0751 TCX', hex: '#CDA323', name: 'Lemon curry' },
        { code: 'Fall leaf - 15-1132 TCX', hex: '#C9A86A', name: 'Fall leaf' },
        { code: 'Antelope - 16-1126 TCX', hex: '#B19664', name: 'Antelope' },
        { code: 'Mustard gold - 16-1133 TCX', hex: '#B08E51', name: 'Mustard gold' },
        { code: 'Harvest gold - 16-0948 TCX', hex: '#B68A3A', name: 'Harvest gold' },
        { code: 'Nugget gold - 16-0952 TCX', hex: '#C89720', name: 'Nugget gold' },
        { code: 'Golden spice - 15-0948 TCX', hex: '#C6973F', name: 'Golden spice' },
        { code: 'Golden yellow - 15-0953 TCX', hex: '#CB8E16', name: 'Golden yellow' },
        { code: 'Ochre - 14-1036 TCX', hex: '#D6AF66', name: 'Ochre' },
        { code: 'Tinsel - 16-0945 TCX', hex: '#C3964D', name: 'Tinsel' },
        { code: 'Bright gold - 16-0947 TCX', hex: '#CF9F52', name: 'Bright gold' },
        { code: 'Honey gold - 15-1142 TCX', hex: '#D1A054', name: 'Honey gold' },
        { code: 'Amber gold - 16-1139 TCX', hex: '#C19552', name: 'Amber gold' },
        { code: 'Mineral yellow - 15-1046 TCX', hex: '#D39C43', name: 'Mineral yellow' },
        { code: 'Narcissus - 16-0950 TCX', hex: '#C39449', name: 'Narcissus' },
        { code: 'Marzipan - 14-1113 TCX', hex: '#D8C09D', name: 'Marzipan' },
        { code: 'Curry - 16-0928 TCX', hex: '#BE9E6F', name: 'Curry' },
        { code: 'Prairie sand - 16-1326 TCX', hex: '#B59A6A', name: 'Prairie sand' },
        { code: 'Honey mustard - 17-1047 TCX', hex: '#B68F52', name: 'Honey mustard' },
        { code: 'Wood thrush - 17-1129 TCX', hex: '#A47D43', name: 'Wood thrush' },
        { code: 'Golden brown - 18-0940 TCX', hex: '#91672F', name: 'Golden brown' },
        { code: 'Bronze brown - 18-0937 TCX', hex: '#825E2F', name: 'Bronze brown' },
        { code: 'Apple cinnamon - 17-1045 TCX', hex: '#B0885A', name: 'Apple cinnamon' },
        { code: 'Bone brown - 17-1128 TCX', hex: '#9D7446', name: 'Bone brown' },
        { code: 'Dijon - 17-1125 TCX', hex: '#97754C', name: 'Dijon' },
        { code: 'Bistre - 17-1036 TCX', hex: '#98754A', name: 'Bistre' },
        { code: 'Medal bronze - 17-0942 TCX', hex: '#977547', name: 'Medal bronze' },
        { code: 'Cumin - 18-0939 TCX', hex: '#927240', name: 'Cumin' },
        { code: 'Breen - 19-1034 TCX', hex: '#795D34', name: 'Breen' },
        { code: 'Snapdragon - 13-0840 TCX', hex: '#FED777', name: 'Snapdragon' },
        { code: 'Banana cream - 13-0941 TCX', hex: '#FFCF73', name: 'Banana cream' },
        { code: 'Daffodil - 14-0850 TCX', hex: '#FDC04E', name: 'Daffodil' },
        { code: 'Yolk yellow - 14-0846 TCX', hex: '#E2B051', name: 'Yolk yellow' },
        { code: 'Golden rod - 14-0951 TCX', hex: '#E2A829', name: 'Golden rod' },
        { code: 'Old gold - 15-0955 TCX', hex: '#ECA825', name: 'Old gold' },
        { code: 'Spectra yellow - 14-0957 TCX', hex: '#F7B718', name: 'Spectra yellow' },
        { code: 'Golden haze - 12-0826 TCX', hex: '#FBD897', name: 'Golden haze' },
        { code: 'Sahara sun - 14-0936 TCX', hex: '#DFC08A', name: 'Sahara sun' },
        { code: 'New wheat - 14-1038 TCX', hex: '#D7B57F', name: 'New wheat' },
        { code: 'Cornsilk - 13-0932 TCX', hex: '#EDC373', name: 'Cornsilk' },
        { code: 'Buff yellow - 14-0847 TCX', hex: '#F1BF70', name: 'Buff yellow' },
        { code: 'Sunset gold - 13-0940 TCX', hex: '#F7C46C', name: 'Sunset gold' },
        { code: 'Golden cream - 13-0939 TCX', hex: '#F7B768', name: 'Golden cream' },
        { code: 'Impala - 13-1025 TCX', hex: '#F8CE97', name: 'Impala' },
        { code: 'Flax - 13-0935 TCX', hex: '#FFC87D', name: 'Flax' },
        { code: 'Pale marigold - 13-0945 TCX', hex: '#FFC66E', name: 'Pale marigold' },
        { code: 'Amber yellow - 13-0942 TCX', hex: '#FAB75A', name: 'Amber yellow' },
        { code: 'Amber - 14-1045 TCX', hex: '#EFAD55', name: 'Amber' },
        { code: 'Golden apricot - 14-1041 TCX', hex: '#DDA758', name: 'Golden apricot' },
        { code: 'Beeswax - 14-0941 TCX', hex: '#EBA851', name: 'Beeswax' },
        { code: 'Banana - 13-0947 TCX', hex: '#FCB953', name: 'Banana' },
        { code: 'Citrus - 14-0955 TCX', hex: '#F9AC2F', name: 'Citrus' },
        { code: 'Golden glow - 15-1050 TCX', hex: '#D99938', name: 'Golden glow' },
        { code: 'Artisans gold - 15-1049 TCX', hex: '#F2AB46', name: 'Artisans gold' },
        { code: 'Sunflower - 16-1054 TCX', hex: '#D39237', name: 'Sunflower' },
        { code: 'Buckthorn brown - 18-0935 TCX', hex: '#A76F1F', name: 'Buckthorn brown' },
        { code: 'Cathay spice - 18-0950 TCX', hex: '#99642C', name: 'Cathay spice' },
        { code: 'Taffy - 16-0940 TCX', hex: '#C39B6A', name: 'Taffy' },
        { code: 'Oak buff - 16-1144 TCX', hex: '#CF9C63', name: 'Oak buff' },
        { code: 'Honey yellow - 16-1143 TCX', hex: '#CA9456', name: 'Honey yellow' },
        { code: 'Spruce yellow - 17-1040 TCX', hex: '#BE8A4A', name: 'Spruce yellow' },
        { code: 'Inca gold - 17-1048 TCX', hex: '#BB7A2C', name: 'Inca gold' },
        { code: 'Sudan brown - 18-1160 TCX', hex: '#AC6B29', name: 'Sudan brown' },
        { code: 'Rubber - 18-0933 TCX', hex: '#815B37', name: 'Rubber' },
        { code: 'Wheat - 13-1016 TCX', hex: '#DEC5A5', name: 'Wheat' },
        { code: 'Honey peach - 13-1015 TCX', hex: '#DCBD9E', name: 'Honey peach' },
        { code: 'Desert dust - 13-1018 TCX', hex: '#E3BC8E', name: 'Desert dust' },
        { code: 'Golden straw - 12-0921 TCX', hex: '#E6BD8F', name: 'Golden straw' },
        { code: 'Buff - 13-1024 TCX', hex: '#EBC396', name: 'Buff' },
        { code: 'Desert mist - 14-1127 TCX', hex: '#E0B589', name: 'Desert mist' },
        { code: 'Clay - 15-1231 TCX', hex: '#D2A172', name: 'Clay' },
        { code: 'Golden fleece - 12-0822 TCX', hex: '#F2D1A0', name: 'Golden fleece' },
        { code: 'Apricot sherbet - 13-1031 TCX', hex: '#FACD9E', name: 'Apricot sherbet' },
        { code: 'Sunburst - 13-1030 TCX', hex: '#F6C289', name: 'Sunburst' },
        { code: 'Apricot cream - 13-1027 TCX', hex: '#F1BD89', name: 'Apricot cream' },
        { code: 'Buff orange - 14-1128 TCX', hex: '#FFBB7C', name: 'Buff orange' },
        { code: 'Chamois - 15-1145 TCX', hex: '#F7B26A', name: 'Chamois' },
        { code: 'Warm apricot - 14-1051 TCX', hex: '#FFB865', name: 'Warm apricot' },
        { code: 'Marigold - 14-1050 TCX', hex: '#FADC53', name: 'Marigold' },
        { code: 'Golden nugget - 16-1142 TCX', hex: '#DB9B59', name: 'Golden nugget' },
        { code: 'Butterscotch - 15-1147 TCX', hex: '#E19640', name: 'Butterscotch' },
        { code: 'Nugget - 16-1148 TCX', hex: '#CF8848', name: 'Nugget' },
        { code: 'Buckskin - 16-1342 TCX', hex: '#D18E54', name: 'Buckskin' },
        { code: 'Yam - 16-1140 TCX', hex: '#D0893F', name: 'Yam' },
        { code: 'Golden oak - 17-1046 TCX', hex: '#BE752D', name: 'Golden oak' },
        { code: 'Gold fusion - 15-1062 TCX', hex: '#FFB000', name: 'Gold fusion' },
        { code: 'Saffron - 14-1064 TCX', hex: '#FFA500', name: 'Saffron' },
        { code: 'Cadmium yellow - 15-1054 TCX', hex: '#EE9626', name: 'Cadmium yellow' },
        { code: 'Zinnia - 14-1159 TCX', hex: '#FFA010', name: 'Zinnia' },
        { code: 'Radiant yellow - 15-1058 TCX', hex: '#FC9E21', name: 'Radiant yellow' },
        { code: 'Apricot - 15-1153 TCX', hex: '#F19035', name: 'Apricot' },
        { code: 'Dark cheddar - 15-1150 TCX', hex: '#E08119', name: 'Dark cheddar' },
        { code: 'Apricot ice - 13-1020 TCX', hex: '#FBBE99', name: 'Apricot ice' },
        { code: 'Apricot nectar - 14-1133 TCX', hex: '#ECAA79', name: 'Apricot nectar' },
        { code: 'Gold earth - 15-1234 TCX', hex: '#DD9C6B', name: 'Gold earth' },
        { code: 'Apricot tan - 15-1237 TCX', hex: '#DD9760', name: 'Apricot tan' },
        { code: 'Topaz - 16-1150 TCX', hex: '#D08344', name: 'Topaz' },
        { code: 'Golden ochre - 16-1346 TCX', hex: '#C77943', name: 'Golden ochre' },
        { code: 'Apricot buff - 16-1443 TCX', hex: '#CD7E4D', name: 'Apricot buff' },
        { code: 'Peach cobbler - 14-1231 TCX', hex: '#FFB181', name: 'Peach cobbler' },
        { code: 'Salmon buff - 14-1135 TCX', hex: '#FEAA7B', name: 'Salmon buff' },
        { code: 'Pumpkin - 14-1139 TCX', hex: '#F5A26F', name: 'Pumpkin' },
        { code: 'Mock orange - 15-1245 TCX', hex: '#FFA368', name: 'Mock orange' },
        { code: 'Muskmelon - 15-1242 TCX', hex: '#EC935E', name: 'Muskmelon' },
        { code: 'Copper tan - 16-1338 TCX', hex: '#DE8E65', name: 'Copper tan' },
        { code: 'Coral gold - 16-1337 TCX', hex: '#D27D56', name: 'Coral gold' },
        { code: 'Russet orange - 16-1255 TCX', hex: '#E47127', name: 'Russet orange' },
        { code: 'Orange ochre - 16-1253 TCX', hex: '#DC793A', name: 'Orange ochre' },
        { code: 'Amberglow - 16-1350 TCX', hex: '#DC793E', name: 'Amberglow' },
        { code: 'Jaffa orange - 16-1454 TCX', hex: '#D86D39', name: 'Jaffa orange' },
        { code: 'Apricot orange - 17-1353 TCX', hex: '#C86B3C', name: 'Apricot orange' },
        { code: 'Burnt orange - 16-1448 TCX', hex: '#C86733', name: 'Burnt orange' },
        { code: 'Harvest pumpkin - 16-1260 TCX', hex: '#D56231', name: 'Harvest pumpkin' },
        { code: 'Blazing orange - 15-1160 TCX', hex: '#FFA64F', name: 'Blazing orange' },
        { code: 'Flame orange - 15-1157 TCX', hex: '#FB8B23', name: 'Flame orange' },
        { code: 'Bright marigold - 15-1164 TCX', hex: '#FF8D00', name: 'Bright marigold' },
        { code: 'Autumn glory - 15-1263 TCX', hex: '#FF8812', name: 'Autumn glory' },
        { code: 'Sun orange - 16-1257 TCX', hex: '#F48037', name: 'Sun orange' },
        { code: 'Persimmon orange - 16-1356 TCX', hex: '#F47327', name: 'Persimmon orange' },
        { code: 'Orange popsicle - 17-1350 TCX', hex: '#FF7913', name: 'Orange popsicle' },
        { code: 'Autumn sunset - 16-1343 TCX', hex: '#F38554', name: 'Autumn sunset' },
        { code: 'Tangerine - 15-1247 TCX', hex: '#F88F58', name: 'Tangerine' },
        { code: 'Bird of paradise - 16-1357 TCX', hex: '#FF8C55', name: 'Bird of paradise' },
        { code: 'Orange peel - 16-1359 TCX', hex: '#FA7A35', name: 'Orange peel' },
        { code: 'Mandarin orange - 16-1459 TCX', hex: '#EC6A37', name: 'Mandarin orange' },
        { code: 'Golden poppy - 16-1462 TCX', hex: '#F56733', name: 'Golden poppy' },
        { code: 'Vibrant orange - 16-1364 TCX', hex: '#FF7420', name: 'Vibrant orange' },
        { code: 'Nectarine - 16-1360 TCX', hex: '#FF8656', name: 'Nectarine' },
        { code: 'Coral rose - 16-1349 TCX', hex: '#F3774D', name: 'Coral rose' },
        { code: 'Carrot - 16-1361 TCX', hex: '#FD6F3B', name: 'Carrot' },
        { code: 'Firecracker - 16-1452 TCX', hex: '#F36944', name: 'Firecracker' },
        { code: 'Red orange - 17-1464 TCX', hex: '#F05627', name: 'Red orange' },
        { code: 'Vermillion orange - 16-1362 TCX', hex: '#F9633B', name: 'Vermillion orange' },
        { code: 'Flame - 17-1462 TCX', hex: '#F2552C', name: 'Flame' },
        { code: 'Creampuff - 13-1026 TCX', hex: '#FFCDA8', name: 'Creampuff' },
        { code: 'Bleached apricot - 12-0917 TCX', hex: '#FCCAAC', name: 'Bleached apricot' },
        { code: 'Almond cream - 13-1017 TCX', hex: '#F4C29F', name: 'Almond cream' },
        { code: 'Beach sand - 14-1225 TCX', hex: '#FBB995', name: 'Beach sand' },
        { code: 'Cream blush - 13-1019 TCX', hex: '#F8C19A', name: 'Cream blush' },
        { code: 'Caramel cream - 13-1022 TCX', hex: '#F4BA94', name: 'Caramel cream' },
        { code: 'Peach fuzz - 13-1023 TCX', hex: '#FFBE98', name: 'Peach fuzz' },
        { code: 'Prairie sunset - 13-1021 TCX', hex: '#FFBB9E', name: 'Prairie sunset' },
        { code: 'Coral sands - 14-1224 TCX', hex: '#EDAA86', name: 'Coral sands' },
        { code: 'Apricot wash - 14-1230 TCX', hex: '#FBAC82', name: 'Apricot wash' },
        { code: 'Canyon sunset - 15-1333 TCX', hex: '#E1927A', name: 'Canyon sunset' },
        { code: 'Brandied melon - 16-1340 TCX', hex: '#CE7B5B', name: 'Brandied melon' },
        { code: 'Carnelian - 16-1435 TCX', hex: '#CE785D', name: 'Carnelian' },
        { code: 'Mango - 17-1446 TCX', hex: '#B75E41', name: 'Mango' },
        { code: 'Peach - 14-1227 TCX', hex: '#F2A987', name: 'Peach' },
        { code: 'Cantaloupe - 15-1239 TCX', hex: '#FFA177', name: 'Cantaloupe' },
        { code: 'Coral reef - 15-1331 TCX', hex: '#FAA181', name: 'Coral reef' },
        { code: 'Shell coral - 15-1334 TCX', hex: '#EA9575', name: 'Shell coral' },
        { code: 'Cadmium orange - 15-1340 TCX', hex: '#F99471', name: 'Cadmium orange' },
        { code: 'Melon - 16-1442 TCX', hex: '#FE8863', name: 'Melon' },
        { code: 'Dusty orange - 16-1344 TCX', hex: '#E27A53', name: 'Dusty orange' },
        { code: 'Arabesque - 16-1441 TCX', hex: '#D16F52', name: 'Arabesque' },
        { code: 'Langoustino - 16-1440 TCX', hex: '#CA6C56', name: 'Langoustino' },
        { code: 'Ginger - 17-1444 TCX', hex: '#C96551', name: 'Ginger' },
        { code: 'Flamingo - 16-1450 TCX', hex: '#DF7253', name: 'Flamingo' },
        { code: 'Orange rust - 18-1447 TCX', hex: '#C25A3C', name: 'Orange rust' },
        { code: 'Burnt ochre - 18-1354 TCX', hex: '#BB4F35', name: 'Burnt ochre' },
        { code: 'Chili - 18-1448 TCX', hex: '#BE5141', name: 'Chili' },
        { code: 'Ginger spice - 18-1535 TCX', hex: '#B65D48', name: 'Ginger spice' },
        { code: 'Autumn glaze - 18-1451 TCX', hex: '#B3573F', name: 'Autumn glaze' },
        { code: 'Auburn - 18-1343 TCX', hex: '#A15843', name: 'Auburn' },
        { code: 'Picante - 19-1250 TCX', hex: '#8D3F2D', name: 'Picante' },
        { code: 'Tandori spice - 18-1444 TCX', hex: '#9F4440', name: 'Tandori spice' },
        { code: 'Cinnabar - 18-1540 TCX', hex: '#9C453B', name: 'Cinnabar' },
        { code: 'Bossa nova - 18-1547 TCX', hex: '#973A36', name: 'Bossa nova' },
        { code: 'Tropical peach - 13-1318 TCX', hex: '#FFC4B2', name: 'Tropical peach' },
        { code: 'Peach parfait - 14-1219 TCX', hex: '#F8BFA8', name: 'Peach parfait' },
        { code: 'Coral pink - 14-1318 TCX', hex: '#E8A798', name: 'Coral pink' },
        { code: 'Dusty pink - 14-1316 TCX', hex: '#DEAA9B', name: 'Dusty pink' },
        { code: 'Muted clay - 16-1330 TCX', hex: '#D29380', name: 'Muted clay' },
        { code: 'Shrimp - 15-1523 TCX', hex: '#E29A86', name: 'Shrimp' },
        { code: 'Tawny orange - 17-1341 TCX', hex: '#D37F6F', name: 'Tawny orange' },
        { code: 'Coral haze - 16-1329 TCX', hex: '#E38E84', name: 'Coral haze' },
        { code: 'Canyon clay - 16-1431 TCX', hex: '#CE8477', name: 'Canyon clay' },
        { code: 'Terra cotta - 16-1526 TCX', hex: '#D38377', name: 'Terra cotta' },
        { code: 'Desert sand - 17-1524 TCX', hex: '#BD7B74', name: 'Desert sand' },
        { code: 'Light mahogany - 18-1436 TCX', hex: '#AD6D68', name: 'Light mahogany' },
        { code: 'Cedar wood - 17-1525 TCX', hex: '#A1655B', name: 'Cedar wood' },
        { code: 'Withered rose - 18-1435 TCX', hex: '#A26666', name: 'Withered rose' },
        { code: 'Rose dawn - 16-1522 TCX', hex: '#C2877B', name: 'Rose dawn' },
        { code: 'Ash rose - 17-1514 TCX', hex: '#B5817D', name: 'Ash rose' },
        { code: 'Old rose - 17-1518 TCX', hex: '#B47B77', name: 'Old rose' },
        { code: 'Brick dust - 17-1424 TCX', hex: '#B07069', name: 'Brick dust' },
        { code: 'Canyon rose - 17-1520 TCX', hex: '#AF6C67', name: 'Canyon rose' },
        { code: 'Dusty cedar - 18-1630 TCX', hex: '#AD5D5D', name: 'Dusty cedar' },
        { code: 'Marsala - 18-1438 TCX', hex: '#964F4C', name: 'Marsala' },
        { code: 'Apricot brandy - 17-1540 TCX', hex: '#C26A5A', name: 'Apricot brandy' },
        { code: 'Aragon - 17-1532 TCX', hex: '#B06455', name: 'Aragon' },
        { code: 'Hot sauce - 18-1536 TCX', hex: '#AB4F41', name: 'Hot sauce' },
        { code: 'Bruschetta - 18-1346 TCX', hex: '#A75949', name: 'Bruschetta' },
        { code: 'Etruscan red - 18-1434 TCX', hex: '#A2574B', name: 'Etruscan red' },
        { code: 'Redwood - 18-1443 TCX', hex: '#A6594C', name: 'Redwood' },
        { code: 'Burnt brick - 18-1350 TCX', hex: '#A14D3A', name: 'Burnt brick' },
        { code: 'Faded rose - 18-1629 TCX', hex: '#BF6464', name: 'Faded rose' },
        { code: 'Baked apple - 18-1648 TCX', hex: '#B34646', name: 'Baked apple' },
        { code: 'Pompeian red - 18-1658 TCX', hex: '#A4292E', name: 'Pompeian red' },
        { code: 'Ketchup - 18-1449 TCX', hex: '#9A382D', name: 'Ketchup' },
        { code: 'Red ochre - 18-1442 TCX', hex: '#913832', name: 'Red ochre' },
        { code: 'Barn red - 18-1531 TCX', hex: '#8F423B', name: 'Barn red' },
        { code: 'Burnt henna - 19-1540 TCX', hex: '#7E392F', name: 'Burnt henna' },
        { code: 'Peach pearl - 14-1419 TCX', hex: '#FFB2A5', name: 'Peach pearl' },
        { code: 'Peach melba - 14-1418 TCX', hex: '#FBBDAF', name: 'Peach melba' },
        { code: 'Apricot blush - 14-1420 TCX', hex: '#FEAEA5', name: 'Apricot blush' },
        { code: 'Peach bud - 14-1324 TCX', hex: '#FDB2AB', name: 'Peach bud' },
        { code: 'Coral almond - 16-1434 TCX', hex: '#E29D94', name: 'Coral almond' },
        { code: 'Lobster bisque - 16-1520 TCX', hex: '#DD9289', name: 'Lobster bisque' },
        { code: 'Lantana - 16-1624 TCX', hex: '#DA7E7A', name: 'Lantana' },
        { code: 'Peach nectar - 14-1228 TCX', hex: '#FFB59B', name: 'Peach nectar' },
        { code: 'Salmon - 14-1323 TCX', hex: '#FAAA94', name: 'Salmon' },
        { code: 'Peach amber - 15-1423 TCX', hex: '#FB9F93', name: 'Peach amber' },
        { code: 'Desert flower - 15-1435 TCX', hex: '#FF9687', name: 'Desert flower' },
        { code: 'Peach pink - 15-1530 TCX', hex: '#FA9A85', name: 'Peach pink' },
        { code: 'Burnt coral - 16-1529 TCX', hex: '#E9897E', name: 'Burnt coral' },
        { code: 'Crabapple - 16-1532 TCX', hex: '#D77E70', name: 'Crabapple' },
        { code: 'Papaya punch - 15-1433 TCX', hex: '#FCA289', name: 'Papaya punch' },
        { code: 'Fusion coral - 16-1543 TCX', hex: '#FF8576', name: 'Fusion coral' },
        { code: 'Fresh salmon - 16-1542 TCX', hex: '#FF7F6A', name: 'Fresh salmon' },
        { code: 'Persimmon - 16-1544 TCX', hex: '#F67866', name: 'Persimmon' },
        { code: 'Coral - 16-1539 TCX', hex: '#ED7464', name: 'Coral' },
        { code: 'Living coral - 16-1546 TCX', hex: '#FF6F61', name: 'Living coral' },
        { code: 'Hot coral - 17-1656 TCX', hex: '#F35B53', name: 'Hot coral' },
        { code: 'Shell pink - 16-1632 TCX', hex: '#F88180', name: 'Shell pink' },
        { code: 'Georgia peach - 16-1641 TCX', hex: '#F97272', name: 'Georgia peach' },
        { code: 'Sugar coral - 16-1640 TCX', hex: '#F56C73', name: 'Sugar coral' },
        { code: 'Dubarry - 17-1647 TCX', hex: '#F25F66', name: 'Dubarry' },
        { code: 'Porcelain rose - 17-1643 TCX', hex: '#EA6B6A', name: 'Porcelain rose' },
        { code: 'Spiced coral - 17-1644 TCX', hex: '#D75C5D', name: 'Spiced coral' },
        { code: 'Deep sea coral - 18-1649 TCX', hex: '#D9615B', name: 'Deep sea coral' },
        { code: 'Rose of sharon - 17-1635 TCX', hex: '#DC5B62', name: 'Rose of sharon' },
        { code: 'Cayenne - 18-1651 TCX', hex: '#E04951', name: 'Cayenne' },
        { code: 'Hibiscus - 18-1762 TCX', hex: '#DD3848', name: 'Hibiscus' },
        { code: 'Poinsettia - 17-1654 TCX', hex: '#CB3441', name: 'Poinsettia' },
        { code: 'Chrysanthemum - 17-1641 TCX', hex: '#BE454F', name: 'Chrysanthemum' },
        { code: 'Cranberry - 17-1545 TCX', hex: '#BB4A4D', name: 'Cranberry' },
        { code: 'Cardinal - 18-1643 TCX', hex: '#AD3E48', name: 'Cardinal' },
        { code: 'Tigerlily - 17-1456 TCX', hex: '#E2583E', name: 'Tigerlily' },
        { code: 'Grenadine - 17-1558 TCX', hex: '#DF3F32', name: 'Grenadine' },
        { code: 'Mandarin red - 17-1562 TCX', hex: '#E74A33', name: 'Mandarin red' },
        { code: 'Fiesta - 17-1564 TCX', hex: '#DD4132', name: 'Fiesta' },
        { code: 'Cherry tomato - 17-1563 TCX', hex: '#EB3C27', name: 'Cherry tomato' },
        { code: 'Orange com - 18-1561 TCX', hex: '#DA321C', name: 'Orange com' },
        { code: 'Spicy orange - 18-1445 TCX', hex: '#D73C26', name: 'Spicy orange' },
        { code: 'Camellia - 16-1541 TCX', hex: '#F6745F', name: 'Camellia' },
        { code: 'Nasturtium - 16-1451 TCX', hex: '#FE6347', name: 'Nasturtium' },
        { code: 'Emberglow - 17-1547 TCX', hex: '#EA6759', name: 'Emberglow' },
        { code: 'Burnt sienna - 17-1544 TCX', hex: '#C65D52', name: 'Burnt sienna' },
        { code: 'Paprika - 17-1553 TCX', hex: '#CE4D42', name: 'Paprika' },
        { code: 'Red clay - 18-1454 TCX', hex: '#C2452D', name: 'Red clay' },
        { code: 'Molten lava - 18-1555 TCX', hex: '#B5332E', name: 'Molten lava' },
        { code: 'Bittersweet - 17-1663 TCX', hex: '#D93744', name: 'Bittersweet' },
        { code: 'Poppy red - 17-1664 TCX', hex: '#DC343B', name: 'Poppy red' },
        { code: 'Tomato - 18-1660 TCX', hex: '#CE2939', name: 'Tomato' },
        { code: 'Fiery red - 18-1664 TCX', hex: '#D01C1F', name: 'Fiery red' },
        { code: 'Flame scarlet - 18-1662 TCX', hex: '#CD212A', name: 'Flame scarlet' },
        { code: 'High risk red - 18-1763 TCX', hex: '#C71F2D', name: 'High risk red' },
        { code: 'Aurora red - 18-1550 TCX', hex: '#B93A32', name: 'Aurora red' },
        { code: 'Rococco red - 18-1652 TCX', hex: '#BB363F', name: 'Rococco red' },
        { code: 'Tomato puree - 18-1661 TCX', hex: '#C53346', name: 'Tomato puree' },
        { code: 'Lollipop - 18-1764 TCX', hex: '#CC1C3B', name: 'Lollipop' },
        { code: 'Ski patrol - 18-1761 TCX', hex: '#BB1237', name: 'Ski patrol' },
        { code: 'Scarlet - 19-1760 TCX', hex: '#BC2B3D', name: 'Scarlet' },
        { code: 'Lipstick red - 19-1764 TCX', hex: '#B31A38', name: 'Lipstick red' },
        { code: 'Crimson - 19-1762 TCX', hex: '#AE0E36', name: 'Crimson' },
        { code: 'Racing red - 19-1763 TCX', hex: '#BD162C', name: 'Racing red' },
        { code: 'Mars red - 18-1655 TCX', hex: '#BC2731', name: 'Mars red' },
        { code: 'Tango red - 19-1761 TCX', hex: '#AC0E2E', name: 'Tango red' },
        { code: 'Chinese red - 18-1663 TCX', hex: '#BE132D', name: 'Chinese red' },
        { code: 'Ribbon red - 19-1663 TCX', hex: '#B92636', name: 'Ribbon red' },
        { code: 'True red - 19-1664 TCX', hex: '#BF1932', name: 'True red' },
        { code: 'Chili pepper - 19-1557 TCX', hex: '#9B1B30', name: 'Chili pepper' },
        { code: 'Quartz pink - 14-1714 TCX', hex: '#EFA6AA', name: 'Quartz pink' },
        { code: 'Pink icing - 15-1717 TCX', hex: '#EEA0A6', name: 'Pink icing' },
        { code: 'Blossom - 14-1513 TCX', hex: '#F2B2AE', name: 'Blossom' },
        { code: 'Peaches n cream - 14-1521 TCX', hex: '#F4A6A3', name: 'Peaches n cream' },
        { code: 'Candlelight peach - 15-1621 TCX', hex: '#F8A39D', name: 'Candlelight peach' },
        { code: 'Strawberry ice - 16-1720 TCX', hex: '#E78B90', name: 'Strawberry ice' },
        { code: 'Peach blossom - 16-1626 TCX', hex: '#DE8286', name: 'Peach blossom' },
        { code: 'Flamingo pink - 15-1821 TCX', hex: '#F7969E', name: 'Flamingo pink' },
        { code: 'Confetti - 16-1723 TCX', hex: '#E6798E', name: 'Confetti' },
        { code: 'Bubblegum - 17-1928 TCX', hex: '#EA738D', name: 'Bubblegum' },
        { code: 'Pink lemonade - 16-1735 TCX', hex: '#EE6D8A', name: 'Pink lemonade' },
        { code: 'Camellia rose - 17-1930 TCX', hex: '#EB6081', name: 'Camellia rose' },
        { code: 'Rapture rose - 17-1929 TCX', hex: '#D16277', name: 'Rapture rose' },
        { code: 'Desert rose - 17-1927 TCX', hex: '#CF6977', name: 'Desert rose' },
        { code: 'Geranium pink - 15-1922 TCX', hex: '#F6909D', name: 'Geranium pink' },
        { code: 'Conch shell - 15-1624 TCX', hex: '#FC8F9B', name: 'Conch shell' },
        { code: 'Salmon rose - 15-1626 TCX', hex: '#FF8D94', name: 'Salmon rose' },
        { code: 'Strawberry pink - 16-1731 TCX', hex: '#F57F8E', name: 'Strawberry pink' },
        { code: 'Sunkist coral - 17-1736 TCX', hex: '#EA6676', name: 'Sunkist coral' },
        { code: 'Calypso coral - 17-1744 TCX', hex: '#EE5C6C', name: 'Calypso coral' },
        { code: 'Tea rose - 16-1620 TCX', hex: '#DC7178', name: 'Tea rose' },
        { code: 'Geranium - 17-1753 TCX', hex: '#DA3D58', name: 'Geranium' },
        { code: 'Paradise pink - 17-1755 TCX', hex: '#E4445E', name: 'Paradise pink' },
        { code: 'Teaberry - 18-1756 TCX', hex: '#DC3855', name: 'Teaberry' },
        { code: 'Rouge red - 18-1755 TCX', hex: '#E24666', name: 'Rouge red' },
        { code: 'Raspberry - 18-1754 TCX', hex: '#D32E5E', name: 'Raspberry' },
        { code: 'Azalea - 17-1842 TCX', hex: '#D42E5B', name: 'Azalea' },
        { code: 'Virtual pink - 18-1856 TCX', hex: '#C6174E', name: 'Virtual pink' },
        { code: 'Claret red - 17-1740 TCX', hex: '#C84C61', name: 'Claret red' },
        { code: 'Raspberry wine - 18-1741 TCX', hex: '#B63753', name: 'Raspberry wine' },
        { code: 'Rose red - 18-1852 TCX', hex: '#C92351', name: 'Rose red' },
        { code: 'Barberry - 18-1760 TCX', hex: '#BF1945', name: 'Barberry' },
        { code: 'Bright rose - 18-1945 TCX', hex: '#C51959', name: 'Bright rose' },
        { code: 'Persian red - 19-1860 TCX', hex: '#A21441', name: 'Persian red' },
        { code: 'Cerise - 19-1955 TCX', hex: '#A41247', name: 'Cerise' },
        { code: 'Pink lady - 13-2806 TCX', hex: '#EFC1D6', name: 'Pink lady' },
        { code: 'Lilac sachet - 14-2710 TCX', hex: '#E9ADCA', name: 'Lilac sachet' },
        { code: 'Prism pink - 14-2311 TCX', hex: '#F0A1BF', name: 'Prism pink' },
        { code: 'Begonia pink - 15-2215 TCX', hex: '#EC9ABE', name: 'Begonia pink' },
        { code: 'Fuchsia pink - 15-2718 TCX', hex: '#DF88B7', name: 'Fuchsia pink' },
        { code: 'Rosebloom - 15-2214 TCX', hex: '#E290B2', name: 'Rosebloom' },
        { code: 'Ibis rose - 17-2520 TCX', hex: '#CA628F', name: 'Ibis rose' },
        { code: 'Sachet pink - 15-2216 TCX', hex: '#F18AAD', name: 'Sachet pink' },
        { code: 'Wild orchid - 16-2120 TCX', hex: '#D979A2', name: 'Wild orchid' },
        { code: 'Aurora pink - 15-2217 TCX', hex: '#E881A6', name: 'Aurora pink' },
        { code: 'Chateau rose - 17-2120 TCX', hex: '#D2738F', name: 'Chateau rose' },
        { code: 'Morning glory - 15-1920 TCX', hex: '#EE819F', name: 'Morning glory' },
        { code: 'Azalea pink - 16-2126 TCX', hex: '#E96A97', name: 'Azalea pink' },
        { code: 'Shocking pink - 17-2127 TCX', hex: '#DE5B8C', name: 'Shocking pink' },
        { code: 'Hot pink - 17-1937 TCX', hex: '#E55982', name: 'Hot pink' },
        { code: 'Fandango pink - 17-2033 TCX', hex: '#E04F80', name: 'Fandango pink' },
        { code: 'Honeysuckle - 18-2120 TCX', hex: '#D94F70', name: 'Honeysuckle' },
        { code: 'Raspberry sorbet - 18-2043 TCX', hex: '#D2386C', name: 'Raspberry sorbet' },
        { code: 'Carmine - 17-1831 TCX', hex: '#BC4869', name: 'Carmine' },
        { code: 'Fuchsia rose - 17-2031 TCX', hex: '#C74375', name: 'Fuchsia rose' },
        { code: 'Beetroot purple - 18-2143 TCX', hex: '#CF2D71', name: 'Beetroot purple' },
        { code: 'Pink carnation - 16-2124 TCX', hex: '#ED7A9E', name: 'Pink carnation' },
        { code: 'Carmine rose - 17-2230 TCX', hex: '#E35B8F', name: 'Carmine rose' },
        { code: 'Magenta - 17-2036 TCX', hex: '#D23C77', name: 'Magenta' },
        { code: 'Pink flambe - 18-2133 TCX', hex: '#D3507A', name: 'Pink flambe' },
        { code: 'Fuchsia purple - 18-2436 TCX', hex: '#D33479', name: 'Fuchsia purple' },
        { code: 'Lilac rose - 17-2227 TCX', hex: '#BD4275', name: 'Lilac rose' },
        { code: 'Very berry - 18-2336 TCX', hex: '#B73275', name: 'Very berry' },
        { code: 'Super pink - 17-2625 TCX', hex: '#CE6BA4', name: 'Super pink' },
        { code: 'Phlox pink - 17-2627 TCX', hex: '#CE5E9A', name: 'Phlox pink' },
        { code: 'Raspberry rose - 18-2333 TCX', hex: '#CC4385', name: 'Raspberry rose' },
        { code: 'Rose violet - 17-2624 TCX', hex: '#C0428A', name: 'Rose violet' },
        { code: 'Fuchsia red - 18-2328 TCX', hex: '#AB3475', name: 'Fuchsia red' },
        { code: 'Cactus flower - 18-2326 TCX', hex: '#A83E6C', name: 'Cactus flower' },
        { code: 'Magenta haze - 18-2525 TCX', hex: '#9D446E', name: 'Magenta haze' },
        { code: 'Shrinking violet - 11-2511 TCX', hex: '#F4E1E6', name: 'Shrinking violet' },
        { code: 'Primrose pink - 12-2904 TCX', hex: '#EED4D9', name: 'Primrose pink' },
        { code: 'Silver pink - 14-1508 TCX', hex: '#DCB1AF', name: 'Silver pink' },
        { code: 'Powder pink - 14-1511 TCX', hex: '#ECB2B3', name: 'Powder pink' },
        { code: 'Mauveglow - 16-1617 TCX', hex: '#D18489', name: 'Mauveglow' },
        { code: 'Brandied apricot - 16-1610 TCX', hex: '#CA848A', name: 'Brandied apricot' },
        { code: 'Dusty rose - 17-1718 TCX', hex: '#BA797D', name: 'Dusty rose' },
        { code: 'Mauve morn - 12-2102 TCX', hex: '#ECD6D6', name: 'Mauve morn' },
        { code: 'Mauve chalk - 12-2902 TCX', hex: '#E5D0CF', name: 'Mauve chalk' },
        { code: 'Pearl - 12-1304 TCX', hex: '#F9DBD8', name: 'Pearl' },
        { code: 'Bridal rose - 15-1611 TCX', hex: '#D69FA2', name: 'Bridal rose' },
        { code: 'Blush - 15-1614 TCX', hex: '#D1969A', name: 'Blush' },
        { code: 'Baroque rose - 18-1634 TCX', hex: '#B35A66', name: 'Baroque rose' },
        { code: 'Slate rose - 18-1635 TCX', hex: '#B45865', name: 'Slate rose' },
        { code: 'Mineral red - 17-1537 TCX', hex: '#B35457', name: 'Mineral red' },
        { code: 'Garnet rose - 18-1633 TCX', hex: '#AC4B55', name: 'Garnet rose' },
        { code: 'Holly berry - 17-1633 TCX', hex: '#B44E5D', name: 'Holly berry' },
        { code: 'American beauty - 19-1759 TCX', hex: '#A73340', name: 'American beauty' },
        { code: 'Jester red - 19-1862 TCX', hex: '#9E1030', name: 'Jester red' },
        { code: 'Rio red - 19-1656 TCX', hex: '#8A2232', name: 'Rio red' },
        { code: 'Rumba red - 19-1940 TCX', hex: '#7C2439', name: 'Rumba red' },
        { code: 'Earth red - 18-1631 TCX', hex: '#95424E', name: 'Earth red' },
        { code: 'Deep claret - 19-1840 TCX', hex: '#973443', name: 'Deep claret' },
        { code: 'Garnet - 19-1655 TCX', hex: '#953640', name: 'Garnet' },
        { code: 'Brick red - 19-1543 TCX', hex: '#8C373E', name: 'Brick red' },
        { code: 'Rosewood - 19-1532 TCX', hex: '#813639', name: 'Rosewood' },
        { code: 'Tibetan red - 19-1934 TCX', hex: '#782A39', name: 'Tibetan red' },
        { code: 'Biking red - 19-1650 TCX', hex: '#77212E', name: 'Biking red' },
        { code: 'Apple butter - 18-1426 TCX', hex: '#844B4D', name: 'Apple butter' },
        { code: 'Oxblood red - 19-1524 TCX', hex: '#70393F', name: 'Oxblood red' },
        { code: 'Cowhide - 19-1533 TCX', hex: '#884344', name: 'Cowhide' },
        { code: 'Burnt russet - 19-1530 TCX', hex: '#7E3940', name: 'Burnt russet' },
        { code: 'Ruby wine - 19-1629 TCX', hex: '#77333B', name: 'Ruby wine' },
        { code: 'Cordovan - 19-1726 TCX', hex: '#702F3B', name: 'Cordovan' },
        { code: 'Tawny port - 19-1725 TCX', hex: '#5C2C35', name: 'Tawny port' },
        { code: 'Creole pink - 13-1407 TCX', hex: '#F7D5CC', name: 'Creole pink' },
        { code: 'Peach blush - 13-1504 TCX', hex: '#E4CCC6', name: 'Peach blush' },
        { code: 'Cloud pink - 13-1406 TCX', hex: '#F5D1C8', name: 'Cloud pink' },
        { code: 'Veiled rose - 12-1212 TCX', hex: '#F8CDC9', name: 'Veiled rose' },
        { code: 'Pearl blush - 12-1207 TCX', hex: '#F4CEC5', name: 'Pearl blush' },
        { code: 'English rose - 13-1310 TCX', hex: '#F4C6C3', name: 'English rose' },
        { code: 'Lotus - 14-1905 TCX', hex: '#E2C1C0', name: 'Lotus' },
        { code: 'Rosewater - 11-1408 TCX', hex: '#F6DBD8', name: 'Rosewater' },
        { code: 'Peach whip - 14-1309 TCX', hex: '#DBBEB7', name: 'Peach whip' },
        { code: 'Rose smoke - 14-1506 TCX', hex: '#D3B4AD', name: 'Rose smoke' },
        { code: 'Coral cloud - 15-1415 TCX', hex: '#E2A9A1', name: 'Coral cloud' },
        { code: 'Misty rose - 15-1512 TCX', hex: '#CAA39A', name: 'Misty rose' },
        { code: 'Peach beige - 15-1516 TCX', hex: '#D3A297', name: 'Peach beige' },
        { code: 'Cameo brown - 16-1516 TCX', hex: '#C08A80', name: 'Cameo brown' },
        { code: 'Seashell pink - 13-1409 TCX', hex: '#F7C8C2', name: 'Seashell pink' },
        { code: 'Chintz rose - 13-1408 TCX', hex: '#EEC4BE', name: 'Chintz rose' },
        { code: 'Impatiens pink - 13-1510 TCX', hex: '#FFC4BC', name: 'Impatiens pink' },
        { code: 'Peachskin - 14-1907 TCX', hex: '#DFB8B6', name: 'Peachskin' },
        { code: 'Mellow rose - 15-1515 TCX', hex: '#D9A6A1', name: 'Mellow rose' },
        { code: 'Rose tan - 16-1511 TCX', hex: '#D19C97', name: 'Rose tan' },
        { code: 'Rosette - 16-1518 TCX', hex: '#CE8E8B', name: 'Rosette' },
        { code: 'Mauvewood - 17-1522 TCX', hex: '#A75D67', name: 'Mauvewood' },
        { code: 'Rose wine - 17-1623 TCX', hex: '#A4596D', name: 'Rose wine' },
        { code: 'Malaga - 17-1723 TCX', hex: '#9F5069', name: 'Malaga' },
        { code: 'Dry rose - 18-1725 TCX', hex: '#8C4759', name: 'Dry rose' },
        { code: 'Hawthorn rose - 18-1718 TCX', hex: '#884C5E', name: 'Hawthorn rose' },
        { code: 'Maroon - 18-1619 TCX', hex: '#834655', name: 'Maroon' },
        { code: 'Wild ginger - 18-1420 TCX', hex: '#7C4C53', name: 'Wild ginger' },
        { code: 'Sangria - 19-2047 TCX', hex: '#982551', name: 'Sangria' },
        { code: 'Red bud - 19-1850 TCX', hex: '#962D49', name: 'Red bud' },
        { code: 'Beaujolais - 18-2027 TCX', hex: '#80304C', name: 'Beaujolais' },
        { code: 'Anemone - 19-2033 TCX', hex: '#842C48', name: 'Anemone' },
        { code: 'Beet red - 19-2030 TCX', hex: '#7A1F3D', name: 'Beet red' },
        { code: 'Red plum - 19-2025 TCX', hex: '#7C2946', name: 'Red plum' },
        { code: 'Rhododendron - 19-2024 TCX', hex: '#722B3F', name: 'Rhododendron' },
        { code: 'Barely pink - 12-2906 TCX', hex: '#F8D7DD', name: 'Barely pink' },
        { code: 'Blushing bride - 12-1310 TCX', hex: '#FBD3D9', name: 'Blushing bride' },
        { code: 'Cradle pink - 12-2905 TCX', hex: '#EDD0DD', name: 'Cradle pink' },
        { code: 'Pale lilac - 13-2803 TCX', hex: '#E1C6CC', name: 'Pale lilac' },
        { code: 'Chalk pink - 13-1904 TCX', hex: '#E6C5CA', name: 'Chalk pink' },
        { code: 'Light lilac - 12-2903 TCX', hex: '#DEC6D3', name: 'Light lilac' },
        { code: 'Pink nectar - 14-2305 TCX', hex: '#D8AAB7', name: 'Pink nectar' },
        { code: 'Heavenly pink - 12-1305 TCX', hex: '#F4DEDE', name: 'Heavenly pink' },
        { code: 'Potpourri - 13-2004 TCX', hex: '#E7C9CA', name: 'Potpourri' },
        { code: 'Crystal pink - 12-1605 TCX', hex: '#EDD0CE', name: 'Crystal pink' },
        { code: 'Pink dogwood - 12-1706 TCX', hex: '#F7D1D1', name: 'Pink dogwood' },
        { code: 'Crystal rose - 12-1708 TCX', hex: '#FDC3C6', name: 'Crystal rose' },
        { code: 'Strawberry cream - 13-2005 TCX', hex: '#F4C3C4', name: 'Strawberry cream' },
        { code: 'Gossamer pink - 13-1513 TCX', hex: '#FAC8C3', name: 'Gossamer pink' },
        { code: 'Rose shadow - 13-1906 TCX', hex: '#F9C2CD', name: 'Rose shadow' },
        { code: 'Orchid pink - 13-2010 TCX', hex: '#F3BBCA', name: 'Orchid pink' },
        { code: 'Almond blossom - 13-2006 TCX', hex: '#F5BEC7', name: 'Almond blossom' },
        { code: 'Coral blush - 14-1909 TCX', hex: '#E6B2B8', name: 'Coral blush' },
        { code: 'Candy pink - 14-1911 TCX', hex: '#F5B0BD', name: 'Candy pink' },
        { code: 'Peony - 15-1816 TCX', hex: '#ED9CA8', name: 'Peony' },
        { code: 'Sea pink - 15-1912 TCX', hex: '#DE98AB', name: 'Sea pink' },
        { code: 'Cashmere rose - 16-2215 TCX', hex: '#CE879F', name: 'Cashmere rose' },
        { code: 'Wild rose - 16-1715 TCX', hex: '#CE8498', name: 'Wild rose' },
        { code: 'Orchid smoke - 15-2210 TCX', hex: '#D294AA', name: 'Orchid smoke' },
        { code: 'Polignac - 16-1712 TCX', hex: '#C28799', name: 'Polignac' },
        { code: 'Lilas - 16-1708 TCX', hex: '#B88995', name: 'Lilas' },
        { code: 'Mauve orchid - 16-2111 TCX', hex: '#B58299', name: 'Mauve orchid' },
        { code: 'Orchid haze - 16-2107 TCX', hex: '#B0879B', name: 'Orchid haze' },
        { code: 'Parfait pink - 13-2804 TCX', hex: '#E9C3CF', name: 'Parfait pink' },
        { code: 'Pink mist - 13-2805 TCX', hex: '#E6BCCD', name: 'Pink mist' },
        { code: 'Cameo pink - 14-2307 TCX', hex: '#DBA9B8', name: 'Cameo pink' },
        { code: 'Sweet lilac - 14-2808 TCX', hex: '#E8B5CE', name: 'Sweet lilac' },
        { code: 'Pink lavender - 14-3207 TCX', hex: '#D9AFCA', name: 'Pink lavender' },
        { code: 'Pastel lavender - 14-3209 TCX', hex: '#D8A1C4', name: 'Pastel lavender' },
        { code: 'Orchid - 15-3214 TCX', hex: '#D198C5', name: 'Orchid' },
        { code: 'Lilac chiffon - 15-2913 TCX', hex: '#DE9BC4', name: 'Lilac chiffon' },
        { code: 'Moonlite mauve - 16-2614 TCX', hex: '#D28FB0', name: 'Moonlite mauve' },
        { code: 'Cyclamen - 16-3118 TCX', hex: '#D687BA', name: 'Cyclamen' },
        { code: 'Opera mauve - 16-3116 TCX', hex: '#CA80B1', name: 'Opera mauve' },
        { code: 'Crocus - 16-3115 TCX', hex: '#C67FAE', name: 'Crocus' },
        { code: 'Mulberry - 17-3014 TCX', hex: '#A76C97', name: 'Mulberry' },
        { code: 'Striking purple - 18-3025 TCX', hex: '#944E87', name: 'Striking purple' },
        { code: 'Violet - 16-3320 TCX', hex: '#C17FB5', name: 'Violet' },
        { code: 'Iris orchid - 17-3323 TCX', hex: '#A767A2', name: 'Iris orchid' },
        { code: 'Radiant orchid - 18-3224 TCX', hex: '#AD5E99', name: 'Radiant orchid' },
        { code: 'Spring crocus - 17-3020 TCX', hex: '#BA69A1', name: 'Spring crocus' },
        { code: 'Meadow mauve - 18-3230 TCX', hex: '#A9568C', name: 'Meadow mauve' },
        { code: 'Amethyst - 18-3015 TCX', hex: '#864D75', name: 'Amethyst' },
        { code: 'Magenta purple - 19-2428 TCX', hex: '#6B264B', name: 'Magenta purple' },
        { code: 'Rosebud - 17-3023 TCX', hex: '#B65F9A', name: 'Rosebud' },
        { code: 'Purple orchid - 18-3027 TCX', hex: '#AD4D8C', name: 'Purple orchid' },
        { code: 'Festival fuchsia - 19-2434 TCX', hex: '#9E2C6A', name: 'Festival fuchsia' },
        { code: 'Baton rouge - 18-2527 TCX', hex: '#973C6C', name: 'Baton rouge' },
        { code: 'Boysenberry - 19-2431 TCX', hex: '#85325C', name: 'Boysenberry' },
        { code: 'Raspberry radiance - 19-2432 TCX', hex: '#802A50', name: 'Raspberry radiance' },
        { code: 'Purple potion - 19-2430 TCX', hex: '#692746', name: 'Purple potion' },
        { code: 'Dahlia mauve - 17-2617 TCX', hex: '#A64F82', name: 'Dahlia mauve' },
        { code: 'Vivid viola - 18-3339 TCX', hex: '#993C7C', name: 'Vivid viola' },
        { code: 'Wild aster - 19-2630 TCX', hex: '#92316F', name: 'Wild aster' },
        { code: 'Deep orchid - 18-3022 TCX', hex: '#903F75', name: 'Deep orchid' },
        { code: 'Clover - 18-2320 TCX', hex: '#8A3371', name: 'Clover' },
        { code: 'Purple wine - 18-2929 TCX', hex: '#8C3573', name: 'Purple wine' },
        { code: 'Hollyhock - 19-2924 TCX', hex: '#823270', name: 'Hollyhock' },
        { code: 'Hyacinth violet - 18-3331 TCX', hex: '#8D4687', name: 'Hyacinth violet' },
        { code: 'Dahlia - 18-3324 TCX', hex: '#843E83', name: 'Dahlia' },
        { code: 'Sparkling grape - 19-3336 TCX', hex: '#773376', name: 'Sparkling grape' },
        { code: 'Byzantium - 19-3138 TCX', hex: '#853B7B', name: 'Byzantium' },
        { code: 'Phlox - 19-2820 TCX', hex: '#692D5D', name: 'Phlox' },
        { code: 'Grape juice - 19-3230 TCX', hex: '#682961', name: 'Grape juice' },
        { code: 'Gloxinia - 19-3022 TCX', hex: '#622E5A', name: 'Gloxinia' },
        { code: 'Crystal gray - 13-3801 TCX', hex: '#D7CBC4', name: 'Crystal gray' },
        { code: 'Mushroom - 14-1305 TCX', hex: '#BDACA3', name: 'Mushroom' },
        { code: 'Shadow gray - 16-1509 TCX', hex: '#BBA5A0', name: 'Shadow gray' },
        { code: 'Sphinx - 16-1703 TCX', hex: '#AB9895', name: 'Sphinx' },
        { code: 'Bark - 16-1506 TCX', hex: '#A99592', name: 'Bark' },
        { code: 'Fawn - 16-1510 TCX', hex: '#AE9490', name: 'Fawn' },
        { code: 'Adobe rose - 16-1508 TCX', hex: '#BA9F99', name: 'Adobe rose' },
        { code: 'Pale mauve - 15-1607 TCX', hex: '#C6A4A4', name: 'Pale mauve' },
        { code: 'Woodrose - 16-1806 TCX', hex: '#AE8C8E', name: 'Woodrose' },
        { code: 'Deauville mauve - 16-1707 TCX', hex: '#AF9294', name: 'Deauville mauve' },
        { code: 'Twilight mauve - 18-1807 TCX', hex: '#8B6F70', name: 'Twilight mauve' },
        { code: 'Rose taupe - 18-1612 TCX', hex: '#806062', name: 'Rose taupe' },
        { code: 'Rose brown - 18-1512 TCX', hex: '#80565B', name: 'Rose brown' },
        { code: 'Roan rouge - 18-1616 TCX', hex: '#885157', name: 'Roan rouge' },
        { code: 'Antler - 17-1510 TCX', hex: '#957A76', name: 'Antler' },
        { code: 'Peppercorn - 18-1409 TCX', hex: '#6C5656', name: 'Peppercorn' },
        { code: 'Raisin - 19-1606 TCX', hex: '#524144', name: 'Raisin' },
        { code: 'Huckleberry - 19-1620 TCX', hex: '#5B4349', name: 'Huckleberry' },
        { code: 'Catawba grape - 19-1621 TCX', hex: '#5D3C43', name: 'Catawba grape' },
        { code: 'Puce - 19-1518 TCX', hex: '#503938', name: 'Puce' },
        { code: 'Fudge - 19-1619 TCX', hex: '#493338', name: 'Fudge' },
        { code: 'Mahogany rose - 15-1511 TCX', hex: '#C5A193', name: 'Mahogany rose' },
        { code: 'Burlwood - 17-1516 TCX', hex: '#9B716B', name: 'Burlwood' },
        { code: 'Marron - 18-1415 TCX', hex: '#6E4C4B', name: 'Marron' },
        { code: 'Decadent chocolate - 19-1625 TCX', hex: '#513235', name: 'Decadent chocolate' },
        { code: 'Red mahogany - 19-1521 TCX', hex: '#60373D', name: 'Red mahogany' },
        { code: 'Vineyard wine - 19-1623 TCX', hex: '#58363D', name: 'Vineyard wine' },
        { code: 'Winetasting - 19-2118 TCX', hex: '#492A34', name: 'Winetasting' },
        { code: 'Port - 19-1525 TCX', hex: '#663336', name: 'Port' },
        { code: 'Chocolate truffle - 19-1526 TCX', hex: '#612E35', name: 'Chocolate truffle' },
        { code: 'Burgundy - 19-1617 TCX', hex: '#64313E', name: 'Burgundy' },
        { code: 'Zinfandel - 19-1522 TCX', hex: '#5C2935', name: 'Zinfandel' },
        { code: 'Windsor wine - 19-1528 TCX', hex: '#582B36', name: 'Windsor wine' },
        { code: 'Port royale - 19-1627 TCX', hex: '#502B33', name: 'Port royale' },
        { code: 'Fig - 19-1718 TCX', hex: '#532D3B', name: 'Fig' },
        { code: 'Violet ice - 15-2706 TCX', hex: '#C2ACB1', name: 'Violet ice' },
        { code: 'Burnished lilac - 15-1905 TCX', hex: '#C5AEB1', name: 'Burnished lilac' },
        { code: 'Keepsake lilac - 15-2705 TCX', hex: '#C0A5AE', name: 'Keepsake lilac' },
        { code: 'Mauve shadows - 16-3205 TCX', hex: '#B598A3', name: 'Mauve shadows' },
        { code: 'Dawn pink - 15-2205 TCX', hex: '#BFA3AF', name: 'Dawn pink' },
        { code: 'Fragrant lilac - 14-3204 TCX', hex: '#CEADBE', name: 'Fragrant lilac' },
        { code: 'Mauve mist - 15-3207 TCX', hex: '#C49BD4', name: 'Mauve mist' },
        { code: 'Heather rose - 17-1608 TCX', hex: '#AD6D7F', name: 'Heather rose' },
        { code: 'Red violet - 17-1818 TCX', hex: '#A35776', name: 'Red violet' },
        { code: 'Mellow mauve - 17-1612 TCX', hex: '#996378', name: 'Mellow mauve' },
        { code: 'Bordeaux - 17-1710 TCX', hex: '#96637B', name: 'Bordeaux' },
        { code: 'Violet quartz - 18-1720 TCX', hex: '#8B4963', name: 'Violet quartz' },
        { code: 'Damson - 18-1716 TCX', hex: '#854C65', name: 'Damson' },
        { code: 'Amaranth - 19-2410 TCX', hex: '#6F3C56', name: 'Amaranth' },
        { code: 'Zephyr - 15-1906 TCX', hex: '#C89FA5', name: 'Zephyr' },
        { code: 'Dusky orchid - 17-1610 TCX', hex: '#9A7182', name: 'Dusky orchid' },
        { code: 'Grape shake - 18-2109 TCX', hex: '#886971', name: 'Grape shake' },
        { code: 'Wistful mauve - 17-1511 TCX', hex: '#946C74', name: 'Wistful mauve' },
        { code: 'Tulipwood - 18-1709 TCX', hex: '#805466', name: 'Tulipwood' },
        { code: 'Grape nectar - 18-1710 TCX', hex: '#8D5C74', name: 'Grape nectar' },
        { code: 'Argyle purple - 18-3011 TCX', hex: '#895C79', name: 'Argyle purple' },
        { code: 'Nostalgia rose - 17-1512 TCX', hex: '#A4777E', name: 'Nostalgia rose' },
        { code: 'Deco rose - 17-1614 TCX', hex: '#985F68', name: 'Deco rose' },
        { code: 'Renaissance rose - 18-1613 TCX', hex: '#865560', name: 'Renaissance rose' },
        { code: 'Nocturne - 18-1614 TCX', hex: '#7A4B56', name: 'Nocturne' },
        { code: 'Crushed berry - 18-1418 TCX', hex: '#804F5A', name: 'Crushed berry' },
        { code: 'Crushed violets - 19-2312 TCX', hex: '#643A4C', name: 'Crushed violets' },
        { code: 'Mauve wine - 19-1716 TCX', hex: '#5B3644', name: 'Mauve wine' },
        { code: 'Plum wine - 18-1411 TCX', hex: '#674550', name: 'Plum wine' },
        { code: 'Eggplant - 19-2311 TCX', hex: '#613F4C', name: 'Eggplant' },
        { code: 'Prune - 19-2014 TCX', hex: '#603749', name: 'Prune' },
        { code: 'Prune purple - 19-1608 TCX', hex: '#5C3A4D', name: 'Prune purple' },
        { code: 'Grape wine - 19-2315 TCX', hex: '#5A2F43', name: 'Grape wine' },
        { code: 'Italian plum - 19-2514 TCX', hex: '#533146', name: 'Italian plum' },
        { code: 'Potent purple - 19-2520 TCX', hex: '#462639', name: 'Potent purple' },
        { code: 'Lavender herb - 16-3310 TCX', hex: '#B18EAA', name: 'Lavender herb' },
        { code: 'Lavender mist - 16-3307 TCX', hex: '#AE90A7', name: 'Lavender mist' },
        { code: 'Valerian - 17-3410 TCX', hex: '#9F7A93', name: 'Valerian' },
        { code: 'Very grape - 18-3220 TCX', hex: '#927288', name: 'Very grape' },
        { code: 'Grapeade - 18-3211 TCX', hex: '#85677B', name: 'Grapeade' },
        { code: 'Purple gumdrop - 18-3012 TCX', hex: '#7A596F', name: 'Purple gumdrop' },
        { code: 'Berry conserve - 18-3013 TCX', hex: '#765269', name: 'Berry conserve' },
        { code: 'Chinese violet - 18-3418 TCX', hex: '#835E81', name: 'Chinese violet' },
        { code: 'Crushed grape - 18-3522 TCX', hex: '#7A547F', name: 'Crushed grape' },
        { code: 'Concord grape - 18-3218 TCX', hex: '#7C5379', name: 'Concord grape' },
        { code: 'Sunset purple - 19-3424 TCX', hex: '#6F456E', name: 'Sunset purple' },
        { code: 'Wood violet - 19-3325 TCX', hex: '#75406A', name: 'Wood violet' },
        { code: 'Purple passion - 19-3223 TCX', hex: '#683D62', name: 'Purple passion' },
        { code: 'Dark purple - 19-2524 TCX', hex: '#582147', name: 'Dark purple' },
        { code: 'Grape jam - 18-3415 TCX', hex: '#725671', name: 'Grape jam' },
        { code: 'Deep purple - 19-3323 TCX', hex: '#50314C', name: 'Deep purple' },
        { code: 'Wineberry - 19-2814 TCX', hex: '#5A395B', name: 'Wineberry' },
        { code: 'Grape royale - 19-3518 TCX', hex: '#4F2D54', name: 'Grape royale' },
        { code: 'Plum purple - 19-3218 TCX', hex: '#51304E', name: 'Plum purple' },
        { code: 'Hortensia - 19-2009 TCX', hex: '#553B50', name: 'Hortensia' },
        { code: 'Blackberry wine - 19-2816 TCX', hex: '#4D3246', name: 'Blackberry wine' },
        { code: 'Navy cosmos - 19-3714 TCX', hex: '#503B53', name: 'Navy cosmos' },
        { code: 'Indigo - 19-3215 TCX', hex: '#4C3957', name: 'Indigo' },
        { code: 'Purple pennant - 19-3519 TCX', hex: '#432C47', name: 'Purple pennant' },
        { code: 'Plum perfect - 19-3316 TCX', hex: '#473442', name: 'Plum perfect' },
        { code: 'Sweet grape - 19-3619 TCX', hex: '#4B3B4F', name: 'Sweet grape' },
        { code: 'Shadow purple - 19-3217 TCX', hex: '#4E334E', name: 'Shadow purple' },
        { code: 'Blackberry cordial - 19-3520 TCX', hex: '#3F2A47', name: 'Blackberry cordial' },
        { code: 'Purple reign - 19-3620 TCX', hex: '#56456B', name: 'Purple reign' },
        { code: 'Mulberry purple - 19-3722 TCX', hex: '#493C62', name: 'Mulberry purple' },
        { code: 'Gothic grape - 19-3720 TCX', hex: '#473951', name: 'Gothic grape' },
        { code: 'Grape - 19-3728 TCX', hex: '#433455', name: 'Grape' },
        { code: 'Mysterioso - 19-3617 TCX', hex: '#46394B', name: 'Mysterioso' },
        { code: 'Purple velvet - 19-3725 TCX', hex: '#41354D', name: 'Purple velvet' },
        { code: 'Nightshade - 19-3712 TCX', hex: '#433748', name: 'Nightshade' },
        { code: 'Orchid tint - 13-3802 TCX', hex: '#DBD2DB', name: 'Orchid tint' },
        { code: 'Lilac ash - 13-3803 TCX', hex: '#D7CDCD', name: 'Lilac ash' },
        { code: 'Gray lilac - 13-3804 TCX', hex: '#D4CACD', name: 'Gray lilac' },
        { code: 'Hushed violet - 14-3803 TCX', hex: '#D1C0BF', name: 'Hushed violet' },
        { code: 'Cloud gray - 15-3802 TCX', hex: '#B7A9AC', name: 'Cloud gray' },
        { code: 'Quail - 17-1505 TCX', hex: '#98868C', name: 'Quail' },
        { code: 'Nirvana - 17-3808 TCX', hex: '#A2919B', name: 'Nirvana' },
        { code: 'Orchid hush - 13-3805 TCX', hex: '#CEC3D2', name: 'Orchid hush' },
        { code: 'Iris - 14-3805 TCX', hex: '#BAAFBC', name: 'Iris' },
        { code: 'Sea fog - 16-3304 TCX', hex: '#A5929D', name: 'Sea fog' },
        { code: 'Elderberry - 17-1605 TCX', hex: '#9D848E', name: 'Elderberry' },
        { code: 'Black plum - 18-1706 TCX', hex: '#6C5765', name: 'Black plum' },
        { code: 'Flint - 18-1405 TCX', hex: '#705861', name: 'Flint' },
        { code: 'Sassafras - 19-1624 TCX', hex: '#54353B', name: 'Sassafras' },
        { code: 'Evening haze - 14-3904 TCX', hex: '#BDB8C7', name: 'Evening haze' },
        { code: 'Thistle - 14-3907 TCX', hex: '#B9B3C5', name: 'Thistle' },
        { code: 'Lavender gray - 17-3910 TCX', hex: '#9890A2', name: 'Lavender gray' },
        { code: 'Minimal gray - 17-3906 TCX', hex: '#948D99', name: 'Minimal gray' },
        { code: 'Purple ash - 17-3810 TCX', hex: '#8F8395', name: 'Purple ash' },
        { code: 'Gray ridge - 18-3710 TCX', hex: '#847986', name: 'Gray ridge' },
        { code: 'Purple sage - 18-3712 TCX', hex: '#75697E', name: 'Purple sage' },
        { code: 'Heirloom lilac - 16-3812 TCX', hex: '#9D96B2', name: 'Heirloom lilac' },
        { code: 'Wisteria - 16-3810 TCX', hex: '#A198AF', name: 'Wisteria' },
        { code: 'Dusk - 17-3812 TCX', hex: '#897F98', name: 'Dusk' },
        { code: 'Daybreak - 17-3817 TCX', hex: '#8981A0', name: 'Daybreak' },
        { code: 'Cadet - 18-3812 TCX', hex: '#6A6378', name: 'Cadet' },
        { code: 'Mulled grape - 18-3714 TCX', hex: '#675A74', name: 'Mulled grape' },
        { code: 'Purple plumeria - 19-3716 TCX', hex: '#473854', name: 'Purple plumeria' },
        { code: 'Lilac marble - 14-3903 TCX', hex: '#C3BABF', name: 'Lilac marble' },
        { code: 'Ashes of roses - 15-0703 TCX', hex: '#B5ACAB', name: 'Ashes of roses' },
        { code: 'Gull gray - 16-3803 TCX', hex: '#A49CA0', name: 'Gull gray' },
        { code: 'Zinc - 17-2601 TCX', hex: '#92898A', name: 'Zinc' },
        { code: 'Gull - 17-3802 TCX', hex: '#918C8F', name: 'Gull' },
        { code: 'Shark - 18-1703 TCX', hex: '#6D636B', name: 'Shark' },
        { code: 'Sparrow - 18-1404 TCX', hex: '#69595C', name: 'Sparrow' },
        { code: 'Orchid ice - 13-3406 TCX', hex: '#E0D0DB', name: 'Orchid ice' },
        { code: 'Lilac snow - 13-3405 TCX', hex: '#E0C7D7', name: 'Lilac snow' },
        { code: 'Winsome orchid - 14-3206 TCX', hex: '#D4B9CB', name: 'Winsome orchid' },
        { code: 'Fair orchid - 15-3508 TCX', hex: '#C0AAC0', name: 'Fair orchid' },
        { code: 'Lavender frost - 15-3507 TCX', hex: '#BDABBE', name: 'Lavender frost' },
        { code: 'Orchid petal - 14-3710 TCX', hex: '#BFB4CB', name: 'Orchid petal' },
        { code: 'Pastel lilac - 14-3812 TCX', hex: '#BDB0D0', name: 'Pastel lilac' },
        { code: 'Orchid bloom - 14-3612 TCX', hex: '#C5AECF', name: 'Orchid bloom' },
        { code: 'Orchid bouquet - 15-3412 TCX', hex: '#D1ACCE', name: 'Orchid bouquet' },
        { code: 'Lupine - 16-3521 TCX', hex: '#BE9CC1', name: 'Lupine' },
        { code: 'Violet tulle - 16-3416 TCX', hex: '#C193C0', name: 'Violet tulle' },
        { code: 'Sheer lilac - 16-3617 TCX', hex: '#B793C0', name: 'Sheer lilac' },
        { code: 'African violet - 16-3520 TCX', hex: '#B085B7', name: 'African violet' },
        { code: 'Dusty lavender - 17-3313 TCX', hex: '#A1759C', name: 'Dusty lavender' },
        { code: 'Paisley purple - 17-3730 TCX', hex: '#8B79B1', name: 'Paisley purple' },
        { code: 'Hyacinth - 17-3619 TCX', hex: '#936CA7', name: 'Hyacinth' },
        { code: 'Amethyst orchid - 17-3628 TCX', hex: '#926AA6', name: 'Amethyst orchid' },
        { code: 'Dewberry - 18-3533 TCX', hex: '#8B5987', name: 'Dewberry' },
        { code: 'Purple heart - 18-3520 TCX', hex: '#745587', name: 'Purple heart' },
        { code: 'Meadow violet - 19-3526 TCX', hex: '#764F82', name: 'Meadow violet' },
        { code: 'Royal purple - 19-3642 TCX', hex: '#603F83', name: 'Royal purple' },
        { code: 'Deep lavender - 18-3633 TCX', hex: '#775496', name: 'Deep lavender' },
        { code: 'Royal lilac - 18-3531 TCX', hex: '#774D8E', name: 'Royal lilac' },
        { code: 'Pansy - 19-3542 TCX', hex: '#653D7C', name: 'Pansy' },
        { code: 'Bright violet - 19-3438 TCX', hex: '#784384', name: 'Bright violet' },
        { code: 'Amaranth purple - 19-3536 TCX', hex: '#6A397B', name: 'Amaranth purple' },
        { code: 'Purple magic - 19-3540 TCX', hex: '#663271', name: 'Purple magic' },
        { code: 'Plum - 19-3220 TCX', hex: '#5A315D', name: 'Plum' },
        { code: 'Imperial palace - 18-3615 TCX', hex: '#604E7A', name: 'Imperial palace' },
        { code: 'Patrician purple - 18-3518 TCX', hex: '#6C4E79', name: 'Patrician purple' },
        { code: 'Loganberry - 19-3622 TCX', hex: '#5A4769', name: 'Loganberry' },
        { code: 'Majesty - 19-3514 TCX', hex: '#593761', name: 'Majesty' },
        { code: 'Imperial purple - 19-3528 TCX', hex: '#542C5D', name: 'Imperial purple' },
        { code: 'Crown jewel - 19-3640 TCX', hex: '#482D54', name: 'Crown jewel' },
        { code: 'Parachute purple - 19-3731 TCX', hex: '#392852', name: 'Parachute purple' },
        { code: 'Lavender fog - 13-3820 TCX', hex: '#D2C4D6', name: 'Lavender fog' },
        { code: 'Lavendula - 15-3620 TCX', hex: '#BCA4CB', name: 'Lavendula' },
        { code: 'Lavender - 15-3817 TCX', hex: '#AFA4CE', name: 'Lavender' },
        { code: 'Bougainvillea - 17-3725 TCX', hex: '#9884B9', name: 'Bougainvillea' },
        { code: 'Violet tulip - 16-3823 TCX', hex: '#9E91C3', name: 'Violet tulip' },
        { code: 'Chalk violet - 17-3615 TCX', hex: '#8F7DA5', name: 'Chalk violet' },
        { code: 'Purple haze - 18-3718 TCX', hex: '#807396', name: 'Purple haze' },
        { code: 'Smoky grape - 16-3110 TCX', hex: '#B88AAC', name: 'Smoky grape' },
        { code: 'Regal orchid - 16-3525 TCX', hex: '#A98BAF', name: 'Regal orchid' },
        { code: 'Viola - 16-3815 TCX', hex: '#A692BA', name: 'Viola' },
        { code: 'Orchid mist - 17-3612 TCX', hex: '#917798', name: 'Orchid mist' },
        { code: 'Grape compote - 18-3513 TCX', hex: '#6B5876', name: 'Grape compote' },
        { code: 'Montana grape - 18-3715 TCX', hex: '#6C5971', name: 'Montana grape' },
        { code: 'Vintage violet - 18-3410 TCX', hex: '#634F62', name: 'Vintage violet' },
        { code: 'Aster purple - 17-3826 TCX', hex: '#7D74A8', name: 'Aster purple' },
        { code: 'Dahlia purple - 17-3834 TCX', hex: '#7E6EAC', name: 'Dahlia purple' },
        { code: 'Passion flower - 18-3737 TCX', hex: '#6D5698', name: 'Passion flower' },
        { code: 'Ultra violet - 18-3838 TCX', hex: '#5F4B8B', name: 'Ultra violet' },
        { code: 'Prism violet - 19-3748 TCX', hex: '#53357D', name: 'Prism violet' },
        { code: 'Heliotrope - 19-3737 TCX', hex: '#4F3872', name: 'Heliotrope' },
        { code: 'Petunia - 19-3632 TCX', hex: '#4F3466', name: 'Petunia' },
        { code: 'Corsican blue - 18-3828 TCX', hex: '#646093', name: 'Corsican blue' },
        { code: 'Veronica - 18-3834 TCX', hex: '#6D6695', name: 'Veronica' },
        { code: 'Blue iris - 18-3943 TCX', hex: '#5A5B9F', name: 'Blue iris' },
        { code: 'Purple opulence - 18-3840 TCX', hex: '#60569A', name: 'Purple opulence' },
        { code: 'Gentian violet - 19-3730 TCX', hex: '#544275', name: 'Gentian violet' },
        { code: 'Liberty - 19-3850 TCX', hex: '#4D448A', name: 'Liberty' },
        { code: 'Deep blue - 19-3847 TCX', hex: '#44377D', name: 'Deep blue' },
        { code: 'Bleached denim - 18-3930 TCX', hex: '#646F9B', name: 'Bleached denim' },
        { code: 'Heron - 18-3817 TCX', hex: '#62617E', name: 'Heron' },
        { code: 'Skipper blue - 19-3936 TCX', hex: '#484A72', name: 'Skipper blue' },
        { code: 'Navy blue - 19-3832 TCX', hex: '#403F6F', name: 'Navy blue' },
        { code: 'Deep wisteria - 19-3842 TCX', hex: '#443F6F', name: 'Deep wisteria' },
        { code: 'Blue ribbon - 19-3839 TCX', hex: '#3A395F', name: 'Blue ribbon' },
        { code: 'Astral aura - 19-3830 TCX', hex: '#363151', name: 'Astral aura' },
        { code: 'Lilac hint - 13-4105 TCX', hex: '#D0D0DA', name: 'Lilac hint' },
        { code: 'Misty lilac - 15-3807 TCX', hex: '#BCB4C4', name: 'Misty lilac' },
        { code: 'Lavender blue - 14-3905 TCX', hex: '#C5C0D0', name: 'Lavender blue' },
        { code: 'Purple heather - 14-3911 TCX', hex: '#BAB8D3', name: 'Purple heather' },
        { code: 'Cosmic sky - 15-3909 TCX', hex: '#AAAAC4', name: 'Cosmic sky' },
        { code: 'Languid lavender - 15-3910 TCX', hex: '#A2A1BA', name: 'Languid lavender' },
        { code: 'Dapple gray - 16-3907 TCX', hex: '#9C9BA7', name: 'Dapple gray' },
        { code: 'Sweet lavender - 16-3931 TCX', hex: '#9A9BC1', name: 'Sweet lavender' },
        { code: 'Easter egg - 16-3925 TCX', hex: '#919BC9', name: 'Easter egg' },
        { code: 'Jacaranda - 17-3930 TCX', hex: '#848DC5', name: 'Jacaranda' },
        { code: 'Deep periwinkle - 17-3932 TCX', hex: '#7C83BC', name: 'Deep periwinkle' },
        { code: 'Dusted peri - 18-3833 TCX', hex: '#696BA0', name: 'Dusted peri' },
        { code: 'Violet storm - 18-3944 TCX', hex: '#5C619D', name: 'Violet storm' },
        { code: 'Baja blue - 18-3946 TCX', hex: '#5F6DB0', name: 'Baja blue' },
        { code: 'Thistle down - 16-3930 TCX', hex: '#9499BB', name: 'Thistle down' },
        { code: 'Persian violet - 17-3925 TCX', hex: '#8C8EB2', name: 'Persian violet' },
        { code: 'Twilight purple - 18-3820 TCX', hex: '#66648B', name: 'Twilight purple' },
        { code: 'Orient blue - 19-3947 TCX', hex: '#47457A', name: 'Orient blue' },
        { code: 'Clematis blue - 19-3951 TCX', hex: '#363B7C', name: 'Clematis blue' },
        { code: 'Royal blue - 19-3955 TCX', hex: '#3D428B', name: 'Royal blue' },
        { code: 'Spectrum blue - 18-3963 TCX', hex: '#3D3C7C', name: 'Spectrum blue' },
        { code: 'Lavender violet - 17-3924 TCX', hex: '#767BA5', name: 'Lavender violet' },
        { code: 'Blue ice - 17-3922 TCX', hex: '#70789B', name: 'Blue ice' },
        { code: 'Velvet morning - 18-3927 TCX', hex: '#60688D', name: 'Velvet morning' },
        { code: 'Marlin - 18-3932 TCX', hex: '#515B87', name: 'Marlin' },
        { code: 'Blueprint - 19-3939 TCX', hex: '#2D3359', name: 'Blueprint' },
        { code: 'Blue depths - 19-3940 TCX', hex: '#263056', name: 'Blue depths' },
        { code: 'Medieval blue - 19-3933 TCX', hex: '#29304E', name: 'Medieval blue' },
        { code: 'Lavender aura - 16-3911 TCX', hex: '#9F99AA', name: 'Lavender aura' },
        { code: 'Stonewash - 17-3917 TCX', hex: '#74809A', name: 'Stonewash' },
        { code: 'Nightshadow blue - 19-3919 TCX', hex: '#4E5368', name: 'Nightshadow blue' },
        { code: 'Blue indigo - 19-3928 TCX', hex: '#49516D', name: 'Blue indigo' },
        { code: 'Graystone - 19-3915 TCX', hex: '#4D495B', name: 'Graystone' },
        { code: 'Crown blue - 19-3926 TCX', hex: '#464B65', name: 'Crown blue' },
        { code: 'Deep cobalt - 19-3935 TCX', hex: '#404466', name: 'Deep cobalt' },
        { code: 'Arctic ice - 13-4110 TCX', hex: '#BFC7D6', name: 'Arctic ice' },
        { code: 'Gray dawn - 14-4106 TCX', hex: '#BBC1CC', name: 'Gray dawn' },
        { code: 'Heather - 14-4110 TCX', hex: '#B7C0D6', name: 'Heather' },
        { code: 'Eventide - 16-3919 TCX', hex: '#959EB7', name: 'Eventide' },
        { code: 'Silver lake blue - 17-4030 TCX', hex: '#618BB9', name: 'Silver lake blue' },
        { code: 'Blue bonnet - 17-3936 TCX', hex: '#6384B8', name: 'Blue bonnet' },
        { code: 'Blue yonder - 18-3937 TCX', hex: '#5A77A8', name: 'Blue yonder' },
        { code: 'Lavender lustre - 16-3920 TCX', hex: '#8C9CC1', name: 'Lavender lustre' },
        { code: 'Purple impression - 17-3919 TCX', hex: '#858FB1', name: 'Purple impression' },
        { code: 'Grapemist - 16-3929 TCX', hex: '#8398CA', name: 'Grapemist' },
        { code: 'Vista blue - 15-3930 TCX', hex: '#81A0D4', name: 'Vista blue' },
        { code: 'Cornflower blue - 16-4031 TCX', hex: '#7391C8', name: 'Cornflower blue' },
        { code: 'Persian jewel - 17-3934 TCX', hex: '#6E81BE', name: 'Persian jewel' },
        { code: 'Wedgewood - 18-3935 TCX', hex: '#6479B3', name: 'Wedgewood' },
        { code: 'Skyway - 14-4112 TCX', hex: '#ADBED3', name: 'Skyway' },
        { code: 'Cashmere blue - 14-4115 TCX', hex: '#A5B8D0', name: 'Cashmere blue' },
        { code: 'Blue bell - 14-4121 TCX', hex: '#93B4D7', name: 'Blue bell' },
        { code: 'Placid blue - 15-3920 TCX', hex: '#8CADD3', name: 'Placid blue' },
        { code: 'Della robbia blue - 16-4020 TCX', hex: '#7A9DCB', name: 'Della robbia blue' },
        { code: 'Provence - 16-4032 TCX', hex: '#658DC6', name: 'Provence' },
        { code: 'Ultramarine - 17-4037 TCX', hex: '#5B7EBD', name: 'Ultramarine' },
        { code: 'Allure - 16-4021 TCX', hex: '#7291B4', name: 'Allure' },
        { code: 'Colony blue - 17-3923 TCX', hex: '#65769A', name: 'Colony blue' },
        { code: 'Moonlight blue - 18-4027 TCX', hex: '#506886', name: 'Moonlight blue' },
        { code: 'Dutch blue - 18-3928 TCX', hex: '#4A638D', name: 'Dutch blue' },
        { code: 'Delft - 19-4039 TCX', hex: '#3D5E8C', name: 'Delft' },
        { code: 'Limoges - 19-4044 TCX', hex: '#243F6C', name: 'Limoges' },
        { code: 'Estate blue - 19-4027 TCX', hex: '#233658', name: 'Estate blue' },
        { code: 'Infinity - 17-4015 TCX', hex: '#6E7E99', name: 'Infinity' },
        { code: 'Bijou blue - 18-3921 TCX', hex: '#4E5E7F', name: 'Bijou blue' },
        { code: 'Coastal fjord - 18-3920 TCX', hex: '#505D7E', name: 'Coastal fjord' },
        { code: 'True navy - 19-4030 TCX', hex: '#3F5277', name: 'True navy' },
        { code: 'Ensign blue - 19-4026 TCX', hex: '#384C67', name: 'Ensign blue' },
        { code: 'Dark denim - 19-4118 TCX', hex: '#35465E', name: 'Dark denim' },
        { code: 'Insignia blue - 19-4028 TCX', hex: '#2F3E55', name: 'Insignia blue' },
        { code: 'Air blue - 15-4319 TCX', hex: '#77ACC7', name: 'Air blue' },
        { code: 'Heritage blue - 16-4127 TCX', hex: '#5D96BC', name: 'Heritage blue' },
        { code: 'Ethereal blue - 15-4323 TCX', hex: '#5CA6CE', name: 'Ethereal blue' },
        { code: 'Bonnie blue - 16-4134 TCX', hex: '#539CCC', name: 'Bonnie blue' },
        { code: 'Cendre blue - 17-4131 TCX', hex: '#3E7FA5', name: 'Cendre blue' },
        { code: 'Parisian blue - 18-4036 TCX', hex: '#4F7CA4', name: 'Parisian blue' },
        { code: 'Faience - 18-4232 TCX', hex: '#2A6A8B', name: 'Faience' },
        { code: 'Alaskan blue - 15-4225 TCX', hex: '#6DA9D2', name: 'Alaskan blue' },
        { code: 'Little boy blue - 16-4132 TCX', hex: '#6EA2D5', name: 'Little boy blue' },
        { code: 'Azure blue - 17-4139 TCX', hex: '#4D91C6', name: 'Azure blue' },
        { code: 'Riviera - 17-4027 TCX', hex: '#5879A2', name: 'Riviera' },
        { code: 'Federal blue - 18-4029 TCX', hex: '#43628B', name: 'Federal blue' },
        { code: 'Star sapphire - 18-4041 TCX', hex: '#386192', name: 'Star sapphire' },
        { code: 'Bright cobalt - 19-4037 TCX', hex: '#385D8D', name: 'Bright cobalt' },
        { code: 'Dusk blue - 16-4120 TCX', hex: '#7BA0C0', name: 'Dusk blue' },
        { code: 'Regatta - 18-4039 TCX', hex: '#487AB7', name: 'Regatta' },
        { code: 'Palace blue - 18-4043 TCX', hex: '#346CB0', name: 'Palace blue' },
        { code: 'Strong blue - 18-4051 TCX', hex: '#1F5DA0', name: 'Strong blue' },
        { code: 'Turkish sea - 19-4053 TCX', hex: '#195190', name: 'Turkish sea' },
        { code: 'Olympian blue - 19-4056 TCX', hex: '#1A4C8B', name: 'Olympian blue' },
        { code: 'Classic blue - 19-4052 TCX', hex: '#0F4C81', name: 'Classic blue' },
        { code: 'Marina - 17-4041 TCX', hex: '#4F84C4', name: 'Marina' },
        { code: 'Campanula - 18-4141 TCX', hex: '#3272AF', name: 'Campanula' },
        { code: 'Daphne - 18-4045 TCX', hex: '#0F5F9A', name: 'Daphne' },
        { code: 'Victoria blue - 18-4148 TCX', hex: '#08589D', name: 'Victoria blue' },
        { code: 'Snorkel blue - 19-4049 TCX', hex: '#034F84', name: 'Snorkel blue' },
        { code: 'Nautical blue - 19-4050 TCX', hex: '#1A5091', name: 'Nautical blue' },
        { code: 'Princess blue - 19-4150 TCX', hex: '#00539C', name: 'Princess blue' },
        { code: 'Dazzling blue - 18-3949 TCX', hex: '#3850A0', name: 'Dazzling blue' },
        { code: 'Amparo blue - 18-3945 TCX', hex: '#4960A8', name: 'Amparo blue' },
        { code: 'Deep ultramarine - 19-3950 TCX', hex: '#384883', name: 'Deep ultramarine' },
        { code: 'Surf the web - 19-3952 TCX', hex: '#203C7F', name: 'Surf the web' },
        { code: 'Mazarine blue - 19-3864 TCX', hex: '#273C76', name: 'Mazarine blue' },
        { code: 'True blue - 19-4057 TCX', hex: '#1E4477', name: 'True blue' },
        { code: 'Twilight blue - 19-3938 TCX', hex: '#313D64', name: 'Twilight blue' },
        { code: 'Kentucky blue - 15-3915 TCX', hex: '#A5B3CC', name: 'Kentucky blue' },
        { code: 'Cerulean - 15-4020 TCX', hex: '#9BB7D4', name: 'Cerulean' },
        { code: 'Powder blue - 14-4214 TCX', hex: '#96B3D2', name: 'Powder blue' },
        { code: 'Forever blue - 16-4019 TCX', hex: '#899BB8', name: 'Forever blue' },
        { code: 'Tempest - 17-3915 TCX', hex: '#79839B', name: 'Tempest' },
        { code: 'Country blue - 17-3918 TCX', hex: '#717F9B', name: 'Country blue' },
        { code: 'English manor - 17-3920 TCX', hex: '#7181A4', name: 'English manor' },
        { code: 'Illusion blue - 13-4103 TCX', hex: '#C9D3DC', name: 'Illusion blue' },
        { code: 'Ballad blue - 13-4304 TCX', hex: '#C0CEDA', name: 'Ballad blue' },
        { code: 'Baby blue - 13-4308 TCX', hex: '#B5C7D3', name: 'Baby blue' },
        { code: 'Celestial blue - 14-4210 TCX', hex: '#A3B4C4', name: 'Celestial blue' },
        { code: 'Blue fog - 15-4008 TCX', hex: '#9BABBB', name: 'Blue fog' },
        { code: 'Flint stone - 18-3916 TCX', hex: '#677283', name: 'Flint stone' },
        { code: 'Folkstone gray - 18-3910 TCX', hex: '#626879', name: 'Folkstone gray' },
        { code: 'Pearl blue - 14-4206 TCX', hex: '#B0B7BE', name: 'Pearl blue' },
        { code: 'Monument - 17-4405 TCX', hex: '#84898C', name: 'Monument' },
        { code: 'Dark slate - 19-4220 TCX', hex: '#46515A', name: 'Dark slate' },
        { code: 'Midnight navy - 19-4110 TCX', hex: '#34414E', name: 'Midnight navy' },
        { code: 'Total eclipse - 19-4010 TCX', hex: '#2C313D', name: 'Total eclipse' },
        { code: 'Blue graphite - 19-4015 TCX', hex: '#323137', name: 'Blue graphite' },
        { code: 'Dark navy - 19-4013 TCX', hex: '#232F36', name: 'Dark navy' },
        { code: 'Ice flow - 13-4404 TCX', hex: '#C6D2D2', name: 'Ice flow' },
        { code: 'Quarry - 15-4305 TCX', hex: '#98A0A5', name: 'Quarry' },
        { code: 'Griffin - 17-5102 TCX', hex: '#8D8F8F', name: 'Griffin' },
        { code: 'Dark shadow - 19-3906 TCX', hex: '#4A4B4D', name: 'Dark shadow' },
        { code: 'Ombre blue - 19-4014 TCX', hex: '#434854', name: 'Ombre blue' },
        { code: 'India ink - 19-4019 TCX', hex: '#3C3F4A', name: 'India ink' },
        { code: 'Ebony - 19-4104 TCX', hex: '#41424A', name: 'Ebony' },
        { code: 'Patriot blue - 19-3925 TCX', hex: '#363756', name: 'Patriot blue' },
        { code: 'Eclipse - 19-3810 TCX', hex: '#343148', name: 'Eclipse' },
        { code: 'Mood indigo - 19-4025 TCX', hex: '#353A4C', name: 'Mood indigo' },
        { code: 'Peacoat - 19-3920 TCX', hex: '#2B2E43', name: 'Peacoat' },
        { code: 'Black iris - 19-3921 TCX', hex: '#2B3042', name: 'Black iris' },
        { code: 'Dress blues - 19-4024 TCX', hex: '#2A3244', name: 'Dress blues' },
        { code: 'Blue nights - 19-4023 TCX', hex: '#363B48', name: 'Blue nights' },
        { code: 'Angel falls - 15-4105 TCX', hex: '#A3BDD3', name: 'Angel falls' },
        { code: 'Dream blue - 15-4005 TCX', hex: '#A0BCD0', name: 'Dream blue' },
        { code: 'Ashley blue - 16-4013 TCX', hex: '#8699AB', name: 'Ashley blue' },
        { code: 'Dusty blue - 16-4010 TCX', hex: '#8C9DAD', name: 'Dusty blue' },
        { code: 'Indian teal - 19-4227 TCX', hex: '#3C586B', name: 'Indian teal' },
        { code: 'Stargazer - 19-4316 TCX', hex: '#39505C', name: 'Stargazer' },
        { code: 'Orion blue - 19-4229 TCX', hex: '#3E4F5C', name: 'Orion blue' },
        { code: 'Forget me not - 15-4312 TCX', hex: '#8FADBD', name: 'Forget me not' },
        { code: 'Faded denim - 17-4021 TCX', hex: '#798EA4', name: 'Faded denim' },
        { code: 'Blue shadow - 17-4020 TCX', hex: '#66829A', name: 'Blue shadow' },
        { code: 'Coronet blue - 18-3922 TCX', hex: '#59728E', name: 'Coronet blue' },
        { code: 'Captains blue - 18-4020 TCX', hex: '#557088', name: 'Captains blue' },
        { code: 'Copen blue - 18-4025 TCX', hex: '#516B84', name: 'Copen blue' },
        { code: 'China blue - 18-3918 TCX', hex: '#546477', name: 'China blue' },
        { code: 'Adriatic blue - 17-4320 TCX', hex: '#5C899B', name: 'Adriatic blue' },
        { code: 'Provincial blue - 18-4220 TCX', hex: '#5C798E', name: 'Provincial blue' },
        { code: 'Niagara - 17-4123 TCX', hex: '#5487A4', name: 'Niagara' },
        { code: 'Blue heaven - 17-4023 TCX', hex: '#5B7E98', name: 'Blue heaven' },
        { code: 'Stellar - 18-4026 TCX', hex: '#46647E', name: 'Stellar' },
        { code: 'Real teal - 18-4018 TCX', hex: '#405D73', name: 'Real teal' },
        { code: 'Majolica blue - 19-4125 TCX', hex: '#274357', name: 'Majolica blue' },
        { code: 'Starlight blue - 12-4609 TCX', hex: '#B5CED4', name: 'Starlight blue' },
        { code: 'Winter sky - 14-4307 TCX', hex: '#A9C0CB', name: 'Winter sky' },
        { code: 'Stratosphere - 14-4508 TCX', hex: '#9EC1CC', name: 'Stratosphere' },
        { code: 'Sterling blue - 15-4309 TCX', hex: '#A2B9C2', name: 'Sterling blue' },
        { code: 'Arona - 16-4109 TCX', hex: '#879BA3', name: 'Arona' },
        { code: 'Citadel - 17-4111 TCX', hex: '#748995', name: 'Citadel' },
        { code: 'Blue mirage - 18-4215 TCX', hex: '#5C6D7C', name: 'Blue mirage' },
        { code: 'Cloud blue - 14-4306 TCX', hex: '#A2B6B9', name: 'Cloud blue' },
        { code: 'Ether - 14-4506 TCX', hex: '#9EB6B8', name: 'Ether' },
        { code: 'Cameo blue - 16-4414 TCX', hex: '#769DA6', name: 'Cameo blue' },
        { code: 'Stone blue - 16-4114 TCX', hex: '#829CA5', name: 'Stone blue' },
        { code: 'Tourmaline - 16-4411 TCX', hex: '#86A1A9', name: 'Tourmaline' },
        { code: 'Smoke blue - 17-4412 TCX', hex: '#6D8994', name: 'Smoke blue' },
        { code: 'Bluestone - 18-4217 TCX', hex: '#577284', name: 'Bluestone' },
        { code: 'Aquamarine - 14-4313 TCX', hex: '#9DC3D4', name: 'Aquamarine' },
        { code: 'Sky blue - 14-4318 TCX', hex: '#8ABAD3', name: 'Sky blue' },
        { code: 'Milky blue - 15-4415 TCX', hex: '#72A8BA', name: 'Milky blue' },
        { code: 'Blue grotto - 15-4421 TCX', hex: '#5CACCE', name: 'Blue grotto' },
        { code: 'Norse blue - 15-4427 TCX', hex: '#4CA5C7', name: 'Norse blue' },
        { code: 'Aquarius - 16-4530 TCX', hex: '#3CADD4', name: 'Aquarius' },
        { code: 'Maui blue - 16-4525 TCX', hex: '#52A2B4', name: 'Maui blue' },
        { code: 'Blue mist - 16-4421 TCX', hex: '#5BACC3', name: 'Blue mist' },
        { code: 'River blue - 15-4720 TCX', hex: '#38AFCD', name: 'River blue' },
        { code: 'Cyan blue - 16-4529 TCX', hex: '#14A3C7', name: 'Cyan blue' },
        { code: 'Horizon blue - 16-4427 TCX', hex: '#289DBE', name: 'Horizon blue' },
        { code: 'Blue moon - 17-4328 TCX', hex: '#3686A0', name: 'Blue moon' },
        { code: 'Bluejay - 17-4427 TCX', hex: '#157EA0', name: 'Bluejay' },
        { code: 'Mediterranean blue - 18-4334 TCX', hex: '#1478A7', name: 'Mediterranean blue' },
        { code: 'Bachelor button - 14-4522 TCX', hex: '#4ABBD5', name: 'Bachelor button' },
        { code: 'Blue atoll - 16-4535 TCX', hex: '#00B1D2', name: 'Blue atoll' },
        { code: 'Vivid blue - 17-4432 TCX', hex: '#0088B0', name: 'Vivid blue' },
        { code: 'Hawaiian ocean - 17-4540 TCX', hex: '#008DB9', name: 'Hawaiian ocean' },
        { code: 'Blue danube - 17-4440 TCX', hex: '#0087B6', name: 'Blue danube' },
        { code: 'Blue jewel - 18-4535 TCX', hex: '#007BAA', name: 'Blue jewel' },
        { code: 'Methyl blue - 18-4537 TCX', hex: '#0074A8', name: 'Methyl blue' },
        { code: 'Malibu blue - 17-4435 TCX', hex: '#008CC1', name: 'Malibu blue' },
        { code: 'Blithe - 17-4336 TCX', hex: '#0084BD', name: 'Blithe' },
        { code: 'Swedish blue - 18-4330 TCX', hex: '#007EB1', name: 'Swedish blue' },
        { code: 'Dresden blue - 17-4433 TCX', hex: '#0086BB', name: 'Dresden blue' },
        { code: 'Diva blue - 17-4247 TCX', hex: '#007BB2', name: 'Diva blue' },
        { code: 'Blue aster - 18-4252 TCX', hex: '#0077B3', name: 'Blue aster' },
        { code: 'Cloisonne - 18-4440 TCX', hex: '#0075AF', name: 'Cloisonne' },
        { code: 'French blue - 18-4140 TCX', hex: '#0072B5', name: 'French blue' },
        { code: 'Brilliant blue - 18-4247 TCX', hex: '#0075B3', name: 'Brilliant blue' },
        { code: 'Directoire blue - 18-4244 TCX', hex: '#0061A3', name: 'Directoire blue' },
        { code: 'Skydiver - 19-4151 TCX', hex: '#00589B', name: 'Skydiver' },
        { code: 'Imperial blue - 19-4245 TCX', hex: '#005A92', name: 'Imperial blue' },
        { code: 'Deep water - 18-4032 TCX', hex: '#266691', name: 'Deep water' },
        { code: 'Dark blue - 19-4035 TCX', hex: '#305679', name: 'Dark blue' },
        { code: 'Pastel blue - 12-4607 TCX', hex: '#BCD3D5', name: 'Pastel blue' },
        { code: 'Clearwater - 12-4608 TCX', hex: '#AAD5DB', name: 'Clearwater' },
        { code: 'Blue glow - 13-4409 TCX', hex: '#B2D4DD', name: 'Blue glow' },
        { code: 'Plume - 13-4809 TCX', hex: '#A5CFD5', name: 'Plume' },
        { code: 'Porcelain blue - 14-4512 TCX', hex: '#95C0CB', name: 'Porcelain blue' },
        { code: 'Crystal blue - 13-4411 TCX', hex: '#A1C8DB', name: 'Crystal blue' },
        { code: 'Petit four - 14-4516 TCX', hex: '#87C2D4', name: 'Petit four' },
        { code: 'Wan blue - 12-4805 TCX', hex: '#CBDCDF', name: 'Wan blue' },
        { code: 'Whispering blue - 12-4610 TCX', hex: '#C9DCDC', name: 'Whispering blue' },
        { code: 'Skylight - 12-4604 TCX', hex: '#C8E0E0', name: 'Skylight' },
        { code: 'Aquatic - 14-4510 TCX', hex: '#99C1CC', name: 'Aquatic' },
        { code: 'Marine blue - 15-4712 TCX', hex: '#76AFB6', name: 'Marine blue' },
        { code: 'Reef waters - 16-4612 TCX', hex: '#6F9FA9', name: 'Reef waters' },
        { code: 'Arctic - 17-4911 TCX', hex: '#648589', name: 'Arctic' },
        { code: 'Chalk blue - 12-4806 TCX', hex: '#CCDAD7', name: 'Chalk blue' },
        { code: 'Pale blue - 13-4804 TCX', hex: '#C4D6D3', name: 'Pale blue' },
        { code: 'Misty blue - 13-4405 TCX', hex: '#BFCDCC', name: 'Misty blue' },
        { code: 'Sky gray - 14-4504 TCX', hex: '#BCC8C6', name: 'Sky gray' },
        { code: 'Surf spray - 14-4807 TCX', hex: '#B4C8C2', name: 'Surf spray' },
        { code: 'Gray mist - 15-4706 TCX', hex: '#99AEAE', name: 'Gray mist' },
        { code: 'Aquifer - 15-5207 TCX', hex: '#89ACAC', name: 'Aquifer' },
        { code: 'Blue glass - 12-5206 TCX', hex: '#C6E3E1', name: 'Blue glass' },
        { code: 'Icy morn - 13-5306 TCX', hex: '#B0D3D1', name: 'Icy morn' },
        { code: 'Canal blue - 14-4810 TCX', hex: '#9CC2C5', name: 'Canal blue' },
        { code: 'Pastel turquoise - 13-5309 TCX', hex: '#99C5C4', name: 'Pastel turquoise' },
        { code: 'Aqua haze - 15-5209 TCX', hex: '#87B9BC', name: 'Aqua haze' },
        { code: 'Aqua sea - 15-4715 TCX', hex: '#6BAAAE', name: 'Aqua sea' },
        { code: 'Meadowbrook - 16-5121 TCX', hex: '#60A0A3', name: 'Meadowbrook' },
        { code: 'Glacier - 12-5505 TCX', hex: '#C3DBD4', name: 'Glacier' },
        { code: 'Fair aqua - 12-5409 TCX', hex: '#B8E2DC', name: 'Fair aqua' },
        { code: 'Soothing sea - 12-5209 TCX', hex: '#C3E9E4', name: 'Soothing sea' },
        { code: 'Bleached aqua - 12-5410 TCX', hex: '#BCE3DF', name: 'Bleached aqua' },
        { code: 'Blue light - 13-4909 TCX', hex: '#ACDFDD', name: 'Blue light' },
        { code: 'Blue tint - 13-4910 TCX', hex: '#9FD9D7', name: 'Blue tint' },
        { code: 'Aqua sky - 14-4811 TCX', hex: '#7BC4C4', name: 'Aqua sky' },
        { code: 'Morning mist - 12-5204 TCX', hex: '#CFDFDB', name: 'Morning mist' },
        { code: 'Harbor gray - 14-4908 TCX', hex: '#A8C0BB', name: 'Harbor gray' },
        { code: 'Eggshell blue - 14-4809 TCX', hex: '#A3CCC9', name: 'Eggshell blue' },
        { code: 'Dusty turquoise - 16-5114 TCX', hex: '#649B9E', name: 'Dusty turquoise' },
        { code: 'Porcelain - 16-4719 TCX', hex: '#5D9CA4', name: 'Porcelain' },
        { code: 'Brittany blue - 18-5610 TCX', hex: '#4C7E86', name: 'Brittany blue' },
        { code: 'Hydro - 18-4718 TCX', hex: '#426972', name: 'Hydro' },
        { code: 'Blue haze - 15-4707 TCX', hex: '#A5BCBB', name: 'Blue haze' },
        { code: 'Nile blue - 15-5210 TCX', hex: '#76A7AB', name: 'Nile blue' },
        { code: 'Mineral blue - 16-4712 TCX', hex: '#6D9192', name: 'Mineral blue' },
        { code: 'Bristol blue - 17-4818 TCX', hex: '#558F91', name: 'Bristol blue' },
        { code: 'Teal - 17-4919 TCX', hex: '#478589', name: 'Teal' },
        { code: 'Blue spruce - 18-5308 TCX', hex: '#486B67', name: 'Blue spruce' },
        { code: 'Sagebrush green - 18-5612 TCX', hex: '#567572', name: 'Sagebrush green' },
        { code: 'Green milieu - 16-5806 TCX', hex: '#8A9992', name: 'Green milieu' },
        { code: 'Jadeite - 16-5304 TCX', hex: '#95A69F', name: 'Jadeite' },
        { code: 'Blue surf - 16-5106 TCX', hex: '#90A8A4', name: 'Blue surf' },
        { code: 'Oil blue - 17-5111 TCX', hex: '#658C88', name: 'Oil blue' },
        { code: 'Trellis - 17-5110 TCX', hex: '#6A8988', name: 'Trellis' },
        { code: 'North atlantic - 18-4612 TCX', hex: '#536D70', name: 'North atlantic' },
        { code: 'Sea pine - 18-5112 TCX', hex: '#4C6969', name: 'Sea pine' },
        { code: 'Slate - 16-4408 TCX', hex: '#8C9FA1', name: 'Slate' },
        { code: 'Silver blue - 16-4706 TCX', hex: '#8A9A9A', name: 'Silver blue' },
        { code: 'Abyss - 16-4404 TCX', hex: '#8F9E9D', name: 'Abyss' },
        { code: 'Lead - 17-4408 TCX', hex: '#7A898F', name: 'Lead' },
        { code: 'Stormy sea - 18-4711 TCX', hex: '#6E8082', name: 'Stormy sea' },
        { code: 'Trooper - 18-4510 TCX', hex: '#697A7E', name: 'Trooper' },
        { code: 'Goblin blue - 18-4011 TCX', hex: '#5F7278', name: 'Goblin blue' },
        { code: 'Slate gray - 16-5804 TCX', hex: '#8A9691', name: 'Slate gray' },
        { code: 'Chinois green - 17-5107 TCX', hex: '#7C8C87', name: 'Chinois green' },
        { code: 'Dark forest - 18-5611 TCX', hex: '#556962', name: 'Dark forest' },
        { code: 'Balsam green - 18-5606 TCX', hex: '#576664', name: 'Balsam green' },
        { code: 'Beetle - 19-0312 TCX', hex: '#55584C', name: 'Beetle' },
        { code: 'Urban chic - 19-5004 TCX', hex: '#464E4D', name: 'Urban chic' },
        { code: 'Darkest spruce - 19-5212 TCX', hex: '#303D3C', name: 'Darkest spruce' },
        { code: 'Mallard blue - 19-4318 TCX', hex: '#3A5C6E', name: 'Mallard blue' },
        { code: 'Celestial - 18-4530 TCX', hex: '#006380', name: 'Celestial' },
        { code: 'Saxony blue - 18-4225 TCX', hex: '#1F6680', name: 'Saxony blue' },
        { code: 'Lyons blue - 19-4340 TCX', hex: '#005871', name: 'Lyons blue' },
        { code: 'Ink blue - 19-4234 TCX', hex: '#0B5369', name: 'Ink blue' },
        { code: 'Corsair - 19-4329 TCX', hex: '#18576C', name: 'Corsair' },
        { code: 'Legion blue - 19-4324 TCX', hex: '#1F495B', name: 'Legion blue' },
        { code: 'Aegean blue - 18-4320 TCX', hex: '#4E6E81', name: 'Aegean blue' },
        { code: 'Bluesteel - 18-4222 TCX', hex: '#35637C', name: 'Bluesteel' },
        { code: 'Blue ashes - 18-4023 TCX', hex: '#3B5F78', name: 'Blue ashes' },
        { code: 'Midnight - 19-4127 TCX', hex: '#325B74', name: 'Midnight' },
        { code: 'Blue sapphire - 18-4231 TCX', hex: '#09577B', name: 'Blue sapphire' },
        { code: 'Seaport - 19-4342 TCX', hex: '#005E7D', name: 'Seaport' },
        { code: 'Moroccan blue - 19-4241 TCX', hex: '#0F4E67', name: 'Moroccan blue' },
        { code: 'Ocean depths - 19-4535 TCX', hex: '#006175', name: 'Ocean depths' },
        { code: 'Blue coral - 19-4526 TCX', hex: '#1B5366', name: 'Blue coral' },
        { code: 'Dragonfly - 19-4826 TCX', hex: '#2A5C6A', name: 'Dragonfly' },
        { code: 'Pacific - 19-4916 TCX', hex: '#1F595C', name: 'Pacific' },
        { code: 'Balsam - 19-4820 TCX', hex: '#33565E', name: 'Balsam' },
        { code: 'Mediterranea - 19-4517 TCX', hex: '#32575D', name: 'Mediterranea' },
        { code: 'Atlantic deep - 19-4726 TCX', hex: '#274E55', name: 'Atlantic deep' },
        { code: 'Aqua - 15-4717 TCX', hex: '#64A1AD', name: 'Aqua' },
        { code: 'Stillwater - 16-4610 TCX', hex: '#70A4B0', name: 'Stillwater' },
        { code: 'Delphinium blue - 16-4519 TCX', hex: '#6198AE', name: 'Delphinium blue' },
        { code: 'Larkspur - 17-4421 TCX', hex: '#3C7D90', name: 'Larkspur' },
        { code: 'Storm blue - 17-4716 TCX', hex: '#47788A', name: 'Storm blue' },
        { code: 'Tapestry - 18-4417 TCX', hex: '#436573', name: 'Tapestry' },
        { code: 'Colonial blue - 18-4522 TCX', hex: '#2D6471', name: 'Colonial blue' },
        { code: 'Peacock blue - 16-4728 TCX', hex: '#00A0B0', name: 'Peacock blue' },
        { code: 'Capri breeze - 17-4735 TCX', hex: '#008799', name: 'Capri breeze' },
        { code: 'Algiers blue - 17-4728 TCX', hex: '#00859C', name: 'Algiers blue' },
        { code: 'Caneel bay - 17-4730 TCX', hex: '#00849F', name: 'Caneel bay' },
        { code: 'Caribbean sea - 18-4525 TCX', hex: '#00819D', name: 'Caribbean sea' },
        { code: 'Mosaic blue - 18-4528 TCX', hex: '#00758F', name: 'Mosaic blue' },
        { code: 'Turkish tile - 18-4432 TCX', hex: '#00698B', name: 'Turkish tile' },
        { code: 'Angel blue - 14-4814 TCX', hex: '#83C5CD', name: 'Angel blue' },
        { code: 'Blue radiance - 14-4816 TCX', hex: '#58C9D4', name: 'Blue radiance' },
        { code: 'Capri - 15-4722 TCX', hex: '#44BBCA', name: 'Capri' },
        { code: 'Blue curacao - 15-4825 TCX', hex: '#32BECC', name: 'Blue curacao' },
        { code: 'Scuba blue - 16-4725 TCX', hex: '#00ABC0', name: 'Scuba blue' },
        { code: 'Bluebird - 16-4834 TCX', hex: '#009DAE', name: 'Bluebird' },
        { code: 'Enamel blue - 18-4733 TCX', hex: '#007A8E', name: 'Enamel blue' },
        { code: 'Pool blue - 15-5218 TCX', hex: '#67BCB3', name: 'Pool blue' },
        { code: 'Blue turquoise - 15-5217 TCX', hex: '#53B0AE', name: 'Blue turquoise' },
        { code: 'Baltic - 16-5123 TCX', hex: '#279D9F', name: 'Baltic' },
        { code: 'Lake blue - 17-4928 TCX', hex: '#008C96', name: 'Lake blue' },
        { code: 'Tile blue - 18-4735 TCX', hex: '#008491', name: 'Tile blue' },
        { code: 'Pagoda blue - 17-4724 TCX', hex: '#1A7F8E', name: 'Pagoda blue' },
        { code: 'Biscay bay - 18-4726 TCX', hex: '#097988', name: 'Biscay bay' },
        { code: 'Aruba blue - 13-5313 TCX', hex: '#81D7D3', name: 'Aruba blue' },
        { code: 'Ceramic - 16-5127 TCX', hex: '#00AAA9', name: 'Ceramic' },
        { code: 'Viridian green - 17-5126 TCX', hex: '#009499', name: 'Viridian green' },
        { code: 'Tropical green - 18-4930 TCX', hex: '#008786', name: 'Tropical green' },
        { code: 'Navigate - 17-5025 TCX', hex: '#008583', name: 'Navigate' },
        { code: 'Deep peacock blue - 17-5029 TCX', hex: '#008381', name: 'Deep peacock blue' },
        { code: 'Lapis - 17-5034 TCX', hex: '#008684', name: 'Lapis' },
        { code: 'Turquoise - 15-5519 TCX', hex: '#45B5AA', name: 'Turquoise' },
        { code: 'Waterfall - 15-5516 TCX', hex: '#3AB0A2', name: 'Waterfall' },
        { code: 'Lagoon - 16-5418 TCX', hex: '#4D9E9A', name: 'Lagoon' },
        { code: 'Bright aqua - 16-5422 TCX', hex: '#30A299', name: 'Bright aqua' },
        { code: 'Porcelain green - 17-5421 TCX', hex: '#108780', name: 'Porcelain green' },
        { code: 'Blue grass - 18-5128 TCX', hex: '#007C7A', name: 'Blue grass' },
        { code: 'Fanfare - 18-4936 TCX', hex: '#006D70', name: 'Fanfare' },
        { code: 'Atlantis - 15-5425 TCX', hex: '#00AF9F', name: 'Atlantis' },
        { code: 'Pool green - 16-5425 TCX', hex: '#00AF9D', name: 'Pool green' },
        { code: 'Dynasty green - 17-5330 TCX', hex: '#008E80', name: 'Dynasty green' },
        { code: 'Spectra green - 17-5335 TCX', hex: '#009B8C', name: 'Spectra green' },
        { code: 'Columbia - 17-5130 TCX', hex: '#009288', name: 'Columbia' },
        { code: 'Teal blue - 17-5024 TCX', hex: '#007F7C', name: 'Teal blue' },
        { code: 'Parasailing - 18-5020 TCX', hex: '#00736C', name: 'Parasailing' },
        { code: 'Wasabi - 16-5109 TCX', hex: '#73A89E', name: 'Wasabi' },
        { code: 'Beryl green - 16-5515 TCX', hex: '#619187', name: 'Beryl green' },
        { code: 'Deep sea - 17-5513 TCX', hex: '#4F7C74', name: 'Deep sea' },
        { code: 'Bottle green - 17-5722 TCX', hex: '#427D6D', name: 'Bottle green' },
        { code: 'Galapagos green - 18-5725 TCX', hex: '#29685F', name: 'Galapagos green' },
        { code: 'Antique green - 18-5418 TCX', hex: '#29675C', name: 'Antique green' },
        { code: 'Storm - 19-5217 TCX', hex: '#035453', name: 'Storm' },
        { code: 'Marine green - 16-5721 TCX', hex: '#40A48E', name: 'Marine green' },
        { code: 'Sea green - 16-5421 TCX', hex: '#149C88', name: 'Sea green' },
        { code: 'Greenlake - 17-5528 TCX', hex: '#007D69', name: 'Greenlake' },
        { code: 'Tidepool - 18-5619 TCX', hex: '#0A6F69', name: 'Tidepool' },
        { code: 'Ivy - 18-5620 TCX', hex: '#226C63', name: 'Ivy' },
        { code: 'Cadmium green - 18-5424 TCX', hex: '#00675B', name: 'Cadmium green' },
        { code: 'Alpine green - 18-5322 TCX', hex: '#005F56', name: 'Alpine green' },
        { code: 'Canton - 16-5112 TCX', hex: '#6DA29E', name: 'Canton' },
        { code: 'Agate green - 16-5412 TCX', hex: '#599F99', name: 'Agate green' },
        { code: 'Sea blue - 16-5119 TCX', hex: '#549F98', name: 'Sea blue' },
        { code: 'Latigo bay - 17-5122 TCX', hex: '#379190', name: 'Latigo bay' },
        { code: 'Green blue slate - 17-5117 TCX', hex: '#358082', name: 'Green blue slate' },
        { code: 'Bayou - 18-5121 TCX', hex: '#20706F', name: 'Bayou' },
        { code: 'North sea - 18-5115 TCX', hex: '#316C6B', name: 'North sea' },
        { code: 'Deep jungle - 18-5618 TCX', hex: '#36716F', name: 'Deep jungle' },
        { code: 'Everglade - 19-5226 TCX', hex: '#005B5D', name: 'Everglade' },
        { code: 'Teal green - 19-4922 TCX', hex: '#006361', name: 'Teal green' },
        { code: 'Harbor blue - 18-4728 TCX', hex: '#00656E', name: 'Harbor blue' },
        { code: 'Deep lake - 18-4834 TCX', hex: '#00656B', name: 'Deep lake' },
        { code: 'Shaded spruce - 19-4524 TCX', hex: '#00585E', name: 'Shaded spruce' },
        { code: 'Deep teal - 19-4914 TCX', hex: '#18454B', name: 'Deep teal' },
        { code: 'Silver pine - 18-5410 TCX', hex: '#4E6866', name: 'Silver pine' },
        { code: 'Mallard green - 19-4818 TCX', hex: '#405E5C', name: 'Mallard green' },
        { code: 'Bistro green - 19-5408 TCX', hex: '#395551', name: 'Bistro green' },
        { code: 'Jasper - 19-5413 TCX', hex: '#335959', name: 'Jasper' },
        { code: 'Bayberry - 18-5315 TCX', hex: '#255958', name: 'Bayberry' },
        { code: 'June bug - 19-5414 TCX', hex: '#264A48', name: 'June bug' },
        { code: 'Ponderosa pine - 19-5320 TCX', hex: '#203B3D', name: 'Ponderosa pine' },
        { code: 'Aqua glass - 12-5407 TCX', hex: '#D2E8E0', name: 'Aqua glass' },
        { code: 'Opal blue - 12-5406 TCX', hex: '#C3DDD6', name: 'Opal blue' },
        { code: 'Dusty aqua - 12-5506 TCX', hex: '#C0DCCD', name: 'Dusty aqua' },
        { code: 'Ocean wave - 14-5711 TCX', hex: '#8EC5B6', name: 'Ocean wave' },
        { code: 'Holiday - 14-5413 TCX', hex: '#81C3B4', name: 'Holiday' },
        { code: 'Cascade - 14-5713 TCX', hex: '#76C1B2', name: 'Cascade' },
        { code: 'Dusty jade green - 15-5711 TCX', hex: '#7BB5A3', name: 'Dusty jade green' },
        { code: 'Honeydew - 12-5808 TCX', hex: '#BAE1D3', name: 'Honeydew' },
        { code: 'Brook green - 13-6009 TCX', hex: '#AFDDCC', name: 'Brook green' },
        { code: 'Cabbage - 13-5714 TCX', hex: '#87D7BE', name: 'Cabbage' },
        { code: 'Beveled glass - 14-5714 TCX', hex: '#7ACCB8', name: 'Beveled glass' },
        { code: 'Opal - 14-5718 TCX', hex: '#77CFB7', name: 'Opal' },
        { code: 'Biscay green - 15-5718 TCX', hex: '#55C6A9', name: 'Biscay green' },
        { code: 'Spearmint - 15-5819 TCX', hex: '#64BFA4', name: 'Spearmint' },
        { code: 'Moonlight jade - 12-5408 TCX', hex: '#C7E5DF', name: 'Moonlight jade' },
        { code: 'Bay - 12-5507 TCX', hex: '#BAE5D6', name: 'Bay' },
        { code: 'Yucca - 13-5409 TCX', hex: '#A1D7C9', name: 'Yucca' },
        { code: 'Beach glass - 13-5412 TCX', hex: '#96DFCE', name: 'Beach glass' },
        { code: 'Ice green - 13-5414 TCX', hex: '#87D8C3', name: 'Ice green' },
        { code: 'Cockatoo - 14-5420 TCX', hex: '#58C8B6', name: 'Cockatoo' },
        { code: 'Florida keys - 15-5416 TCX', hex: '#56BEAB', name: 'Florida keys' },
        { code: 'Bermuda - 14-5416 TCX', hex: '#60C9B3', name: 'Bermuda' },
        { code: 'Electric green - 14-5721 TCX', hex: '#4BC3A8', name: 'Electric green' },
        { code: 'Aqua green - 15-5421 TCX', hex: '#00B89F', name: 'Aqua green' },
        { code: 'Billiard - 16-5427 TCX', hex: '#00AA92', name: 'Billiard' },
        { code: 'Arcadia - 16-5533 TCX', hex: '#00A28A', name: 'Arcadia' },
        { code: 'Alhambra - 17-5430 TCX', hex: '#008778', name: 'Alhambra' },
        { code: 'Deep green - 17-5633 TCX', hex: '#009276', name: 'Deep green' },
        { code: 'Mint leaf - 15-5728 TCX', hex: '#00B694', name: 'Mint leaf' },
        { code: 'Peacock green - 16-5431 TCX', hex: '#00A78B', name: 'Peacock green' },
        { code: 'Vivid green - 17-5638 TCX', hex: '#009E82', name: 'Vivid green' },
        { code: 'Emerald - 17-5641 TCX', hex: '#009473', name: 'Emerald' },
        { code: 'Viridis - 17-5734 TCX', hex: '#00846B', name: 'Viridis' },
        { code: 'Shady glade - 18-5624 TCX', hex: '#006E5B', name: 'Shady glade' },
        { code: 'Ultramarine green - 18-5338 TCX', hex: '#006B54', name: 'Ultramarine green' },
        { code: 'Silt green - 14-5706 TCX', hex: '#A9BDB1', name: 'Silt green' },
        { code: 'Frosty green - 15-5706 TCX', hex: '#A3B5A6', name: 'Frosty green' },
        { code: 'Iceberg green - 16-5808 TCX', hex: '#8C9C92', name: 'Iceberg green' },
        { code: 'Granite green - 16-5907 TCX', hex: '#86A293', name: 'Granite green' },
        { code: 'Green bay - 16-5810 TCX', hex: '#7E9285', name: 'Green bay' },
        { code: 'Lily pad - 16-5807 TCX', hex: '#818F84', name: 'Lily pad' },
        { code: 'Laurel wreath - 17-6009 TCX', hex: '#616F65', name: 'Laurel wreath' },
        { code: 'Green spruce - 16-5820 TCX', hex: '#589F7E', name: 'Green spruce' },
        { code: 'Comfrey - 18-6216 TCX', hex: '#5B7961', name: 'Comfrey' },
        { code: 'Dark ivy - 17-5912 TCX', hex: '#5B7763', name: 'Dark ivy' },
        { code: 'Foliage green - 18-6018 TCX', hex: '#3E6F58', name: 'Foliage green' },
        { code: 'Myrtle - 18-6114 TCX', hex: '#4F6B58', name: 'Myrtle' },
        { code: 'Posy green - 18-5616 TCX', hex: '#325B51', name: 'Posy green' },
        { code: 'Pineneedle - 19-5920 TCX', hex: '#334D41', name: 'Pineneedle' },
        { code: 'Sea spray - 17-6212 TCX', hex: '#717E6F', name: 'Sea spray' },
        { code: 'Duck green - 18-6011 TCX', hex: '#53665C', name: 'Duck green' },
        { code: 'Frosty spruce - 18-5622 TCX', hex: '#578270', name: 'Frosty spruce' },
        { code: 'Fir - 18-5621 TCX', hex: '#3A725F', name: 'Fir' },
        { code: 'Evergreen - 19-5420 TCX', hex: '#11574A', name: 'Evergreen' },
        { code: 'Hunter green - 19-5511 TCX', hex: '#335749', name: 'Hunter green' },
        { code: 'Dark green - 19-5513 TCX', hex: '#314F40', name: 'Dark green' },
        { code: 'Feldspar - 16-5815 TCX', hex: '#729B8B', name: 'Feldspar' },
        { code: 'Smoke pine - 18-5718 TCX', hex: '#3E6257', name: 'Smoke pine' },
        { code: 'Trekking green - 19-5411 TCX', hex: '#355048', name: 'Trekking green' },
        { code: 'Garden topiary - 18-5913 TCX', hex: '#3E524B', name: 'Garden topiary' },
        { code: 'Jungle green - 19-5914 TCX', hex: '#3C4E47', name: 'Jungle green' },
        { code: 'Sycamore - 19-5917 TCX', hex: '#35463D', name: 'Sycamore' },
        { code: 'Green gables - 19-4906 TCX', hex: '#324241', name: 'Green gables' },
        { code: 'Vetiver - 17-0613 TCX', hex: '#807D6F', name: 'Vetiver' },
        { code: 'Deep lichen green - 18-0312 TCX', hex: '#6E6E5C', name: 'Deep lichen green' },
        { code: 'Thyme - 19-0309 TCX', hex: '#50574C', name: 'Thyme' },
        { code: 'Kombu green - 19-0417 TCX', hex: '#3A4032', name: 'Kombu green' },
        { code: 'Deep forest - 19-6110 TCX', hex: '#37413A', name: 'Deep forest' },
        { code: 'Forest night - 19-0414 TCX', hex: '#434237', name: 'Forest night' },
        { code: 'Rosin - 19-0509 TCX', hex: '#36362D', name: 'Rosin' },
        { code: 'Celadon - 13-6108 TCX', hex: '#B8CCBA', name: 'Celadon' },
        { code: 'Pale aqua - 13-5305 TCX', hex: '#C1CCC2', name: 'Pale aqua' },
        { code: 'Smoke - 14-4505 TCX', hex: '#BFC8C3', name: 'Smoke' },
        { code: 'Foggy dew - 13-4305 TCX', hex: '#D1D5D0', name: 'Foggy dew' },
        { code: 'Mercury - 14-4502 TCX', hex: '#BAC2BA', name: 'Mercury' },
        { code: 'Mineral gray - 15-5704 TCX', hex: '#B2B6AC', name: 'Mineral gray' },
        { code: 'Aqua gray - 15-5205 TCX', hex: '#A5B2AA', name: 'Aqua gray' },
        { code: 'Fairest jade - 12-6206 TCX', hex: '#D8E3D7', name: 'Fairest jade' },
        { code: 'Water lily - 11-0304 TCX', hex: '#DDE3D5', name: 'Water lily' },
        { code: 'Canary green - 12-0108 TCX', hex: '#D6DEC9', name: 'Canary green' },
        { code: 'Almost aqua - 13-6006 TCX', hex: '#CAD3C1', name: 'Almost aqua' },
        { code: 'Green tint - 13-6106 TCX', hex: '#C5CCC0', name: 'Green tint' },
        { code: 'Sea foam - 14-6007 TCX', hex: '#B7C2B2', name: 'Sea foam' },
        { code: 'Desert sage - 16-0110 TCX', hex: '#A7AE9E', name: 'Desert sage' },
        { code: 'Whisper green - 12-5404 TCX', hex: '#E0E6D7', name: 'Whisper green' },
        { code: 'Celadon tint - 13-6105 TCX', hex: '#CBCEBE', name: 'Celadon tint' },
        { code: 'Dewkist - 13-0107 TCX', hex: '#C4D1C2', name: 'Dewkist' },
        { code: 'Green lily - 13-6107 TCX', hex: '#C1CEC1', name: 'Green lily' },
        { code: 'Cameo green - 14-6312 TCX', hex: '#AAC0AD', name: 'Cameo green' },
        { code: 'Seagrass - 16-6008 TCX', hex: '#959889', name: 'Seagrass' },
        { code: 'Shadow - 17-6206 TCX', hex: '#888D82', name: 'Shadow' },
        { code: 'Clearly aqua - 12-5504 TCX', hex: '#CEE1D4', name: 'Clearly aqua' },
        { code: 'Misty jade - 13-6008 TCX', hex: '#BCD9C8', name: 'Misty jade' },
        { code: 'Subtle green - 14-6008 TCX', hex: '#B5CBBB', name: 'Subtle green' },
        { code: 'Aqua foam - 14-5707 TCX', hex: '#ADC3B4', name: 'Aqua foam' },
        { code: 'Gossamer green - 13-5907 TCX', hex: '#B2CFBE', name: 'Gossamer green' },
        { code: 'Lichen - 15-5812 TCX', hex: '#9BC2B1', name: 'Lichen' },
        { code: 'Grayed jade - 14-6011 TCX', hex: '#9BBEA9', name: 'Grayed jade' },
        { code: 'Milky green - 12-6205 TCX', hex: '#CFDBD1', name: 'Milky green' },
        { code: 'Phantom green - 12-6208 TCX', hex: '#DCE4D7', name: 'Phantom green' },
        { code: 'Mist green - 13-6110 TCX', hex: '#AACEBC', name: 'Mist green' },
        { code: 'Birds egg green - 13-5911 TCX', hex: '#AACCB9', name: 'Birds egg green' },
        { code: 'Bok choy - 13-6208 TCX', hex: '#BCCAB3', name: 'Bok choy' },
        { code: 'Smoke green - 15-6315 TCX', hex: '#A8BBA2', name: 'Smoke green' },
        { code: 'Malachite green - 16-5917 TCX', hex: '#709A89', name: 'Malachite green' },
        { code: 'Mistletoe - 16-0220 TCX', hex: '#8AA282', name: 'Mistletoe' },
        { code: 'Basil - 16-6216 TCX', hex: '#879F84', name: 'Basil' },
        { code: 'Mineral green - 16-6318 TCX', hex: '#7A9B78', name: 'Mineral green' },
        { code: 'Green eyes - 16-0224 TCX', hex: '#7D956D', name: 'Green eyes' },
        { code: 'Turf green - 17-0119 TCX', hex: '#6F8C69', name: 'Turf green' },
        { code: 'Watercress - 17-0220 TCX', hex: '#748C69', name: 'Watercress' },
        { code: 'Elm green - 18-0121 TCX', hex: '#547053', name: 'Elm green' },
        { code: 'Hedge green - 17-6323 TCX', hex: '#768A75', name: 'Hedge green' },
        { code: 'Loden frost - 17-0210 TCX', hex: '#788F74', name: 'Loden frost' },
        { code: 'Shale green - 16-6116 TCX', hex: '#739072', name: 'Shale green' },
        { code: 'Kashmir - 17-6319 TCX', hex: '#6F8D6A', name: 'Kashmir' },
        { code: 'Stone green - 17-0123 TCX', hex: '#658E67', name: 'Stone green' },
        { code: 'English ivy - 18-0110 TCX', hex: '#61845B', name: 'English ivy' },
        { code: 'Deep grass green - 17-6219 TCX', hex: '#558367', name: 'Deep grass green' },
        { code: 'Piquant green - 17-0235 TCX', hex: '#769358', name: 'Piquant green' },
        { code: 'Forest green - 17-0230 TCX', hex: '#6B8D53', name: 'Forest green' },
        { code: 'Fluorite green - 17-0133 TCX', hex: '#699158', name: 'Fluorite green' },
        { code: 'Cactus - 18-0130 TCX', hex: '#53713D', name: 'Cactus' },
        { code: 'Garden green - 19-0230 TCX', hex: '#495E35', name: 'Garden green' },
        { code: 'Artichoke green - 18-0125 TCX', hex: '#4B6D41', name: 'Artichoke green' },
        { code: 'Willow bough - 18-0119 TCX', hex: '#59754D', name: 'Willow bough' },
        { code: 'Aspen green - 17-0215 TCX', hex: '#7E9B76', name: 'Aspen green' },
        { code: 'Medium green - 17-6229 TCX', hex: '#3C824E', name: 'Medium green' },
        { code: 'Juniper - 18-6330 TCX', hex: '#3D7245', name: 'Juniper' },
        { code: 'Fairway - 18-6320 TCX', hex: '#477050', name: 'Fairway' },
        { code: 'Vineyard green - 18-0117 TCX', hex: '#5F7355', name: 'Vineyard green' },
        { code: 'Dill - 18-0108 TCX', hex: '#6F7755', name: 'Dill' },
        { code: 'Greener pastures - 19-6311 TCX', hex: '#37503D', name: 'Greener pastures' },
        { code: 'Four leaf clover - 18-0420 TCX', hex: '#616652', name: 'Four leaf clover' },
        { code: 'Bronze green - 18-0317 TCX', hex: '#525F48', name: 'Bronze green' },
        { code: 'Chive - 19-0323 TCX', hex: '#4A5335', name: 'Chive' },
        { code: 'Cypress - 18-0322 TCX', hex: '#545A3E', name: 'Cypress' },
        { code: 'Black forest - 19-0315 TCX', hex: '#414F3C', name: 'Black forest' },
        { code: 'Rifle green - 19-0419 TCX', hex: '#414832', name: 'Rifle green' },
        { code: 'Duffel bag - 19-0415 TCX', hex: '#394034', name: 'Duffel bag' },
        { code: 'Ambrosia - 12-0109 TCX', hex: '#D2E7CA', name: 'Ambrosia' },
        { code: 'Spray - 13-6007 TCX', hex: '#BED3BB', name: 'Spray' },
        { code: 'Pastel green - 13-0116 TCX', hex: '#B4D3B2', name: 'Pastel green' },
        { code: 'Hemlock - 15-6114 TCX', hex: '#97C1A1', name: 'Hemlock' },
        { code: 'Sprucestone - 14-6316 TCX', hex: '#9FC09C', name: 'Sprucestone' },
        { code: 'Meadow - 14-6319 TCX', hex: '#8BBA94', name: 'Meadow' },
        { code: 'Jadesheen - 16-6324 TCX', hex: '#77A276', name: 'Jadesheen' },
        { code: 'Green ash - 13-0117 TCX', hex: '#A0DAA9', name: 'Green ash' },
        { code: 'Greengage - 14-0127 TCX', hex: '#8BC28C', name: 'Greengage' },
        { code: 'Ming - 15-6120 TCX', hex: '#7CB08A', name: 'Ming' },
        { code: 'Zephyr green - 14-6327 TCX', hex: '#7CB083', name: 'Zephyr green' },
        { code: 'Peapod - 14-6324 TCX', hex: '#82B185', name: 'Peapod' },
        { code: 'Light grass green - 15-6322 TCX', hex: '#7CB68E', name: 'Light grass green' },
        { code: 'Absinthe green - 14-6329 TCX', hex: '#76B583', name: 'Absinthe green' },
        { code: 'Neptune green - 14-6017 TCX', hex: '#7FBB9E', name: 'Neptune green' },
        { code: 'Creme de menthe - 16-5919 TCX', hex: '#70A38D', name: 'Creme de menthe' },
        { code: 'Winter green - 16-5924 TCX', hex: '#4F9E81', name: 'Winter green' },
        { code: 'Gumdrop green - 16-5825 TCX', hex: '#2EA785', name: 'Gumdrop green' },
        { code: 'Holly green - 16-5932 TCX', hex: '#0F9D76', name: 'Holly green' },
        { code: 'Parakeet - 17-5735 TCX', hex: '#008C69', name: 'Parakeet' },
        { code: 'Golf green - 18-5642 TCX', hex: '#008763', name: 'Golf green' },
        { code: 'Spring bud - 14-6330 TCX', hex: '#6BCD9C', name: 'Spring bud' },
        { code: 'Katydid - 16-6030 TCX', hex: '#66BC91', name: 'Katydid' },
        { code: 'Jade cream - 15-6123 TCX', hex: '#60B892', name: 'Jade cream' },
        { code: 'Ming green - 16-5930 TCX', hex: '#3AA278', name: 'Ming green' },
        { code: 'Greenbriar - 16-6127 TCX', hex: '#4B9B69', name: 'Greenbriar' },
        { code: 'Leprechaun - 18-6022 TCX', hex: '#378661', name: 'Leprechaun' },
        { code: 'Pine green - 17-5923 TCX', hex: '#3A795E', name: 'Pine green' },
        { code: 'Blarney - 16-5942 TCX', hex: '#00A776', name: 'Blarney' },
        { code: 'Mint - 16-5938 TCX', hex: '#00A170', name: 'Mint' },
        { code: 'Deep mint - 17-5937 TCX', hex: '#009E6D', name: 'Deep mint' },
        { code: 'Simply green - 17-5936 TCX', hex: '#009B75', name: 'Simply green' },
        { code: 'Pepper green - 18-5841 TCX', hex: '#007D60', name: 'Pepper green' },
        { code: 'Bosphorus - 18-5633 TCX', hex: '#007558', name: 'Bosphorus' },
        { code: 'Verdant green - 19-6026 TCX', hex: '#12674A', name: 'Verdant green' },
        { code: 'Seacrest - 13-0111 TCX', hex: '#BFD1B3', name: 'Seacrest' },
        { code: 'Gleam - 12-0317 TCX', hex: '#BFD1AD', name: 'Gleam' },
        { code: 'Nile green - 14-0121 TCX', hex: '#A7C796', name: 'Nile green' },
        { code: 'Quiet green - 15-6317 TCX', hex: '#9EBC97', name: 'Quiet green' },
        { code: 'Fair green - 15-6316 TCX', hex: '#92AF88', name: 'Fair green' },
        { code: 'Forest shade - 15-6423 TCX', hex: '#91AC80', name: 'Forest shade' },
        { code: 'Jade green - 16-0228 TCX', hex: '#759465', name: 'Jade green' },
        { code: 'Patina green - 12-0225 TCX', hex: '#B9EAB3', name: 'Patina green' },
        { code: 'Pistachio green - 13-0221 TCX', hex: '#A9D39E', name: 'Pistachio green' },
        { code: 'Arcadian green - 14-0123 TCX', hex: '#A3C893', name: 'Arcadian green' },
        { code: 'Grass green - 15-6437 TCX', hex: '#7BB369', name: 'Grass green' },
        { code: 'Bud green - 15-6442 TCX', hex: '#79B465', name: 'Bud green' },
        { code: 'Green tea - 15-6428 TCX', hex: '#86A96F', name: 'Green tea' },
        { code: 'Tendril - 16-0123 TCX', hex: '#89A06B', name: 'Tendril' },
        { code: 'Paradise green - 13-0220 TCX', hex: '#B2E79F', name: 'Paradise green' },
        { code: 'Lime green - 14-0452 TCX', hex: '#9FC131', name: 'Lime green' },
        { code: 'Jasmine green - 15-0545 TCX', hex: '#7EC845', name: 'Jasmine green' },
        { code: 'Green flash - 15-0146 TCX', hex: '#79C753', name: 'Green flash' },
        { code: 'Classic green - 16-6340 TCX', hex: '#39A845', name: 'Classic green' },
        { code: 'Online lime - 17-0145 TCX', hex: '#44883C', name: 'Online lime' },
        { code: 'Treetop - 18-0135 TCX', hex: '#476A30', name: 'Treetop' },
        { code: 'Summer green - 14-0156 TCX', hex: '#7ED37F', name: 'Summer green' },
        { code: 'Spring bouquet - 14-6340 TCX', hex: '#6DCE87', name: 'Spring bouquet' },
        { code: 'Island green - 16-6240 TCX', hex: '#2BAE66', name: 'Island green' },
        { code: 'Irish green - 15-6340 TCX', hex: '#45BE76', name: 'Irish green' },
        { code: 'Shamrock - 15-6432 TCX', hex: '#6FA26B', name: 'Shamrock' },
        { code: 'Peppermint - 16-6329 TCX', hex: '#699E6D', name: 'Peppermint' },
        { code: 'Mint green - 17-6333 TCX', hex: '#487D49', name: 'Mint green' },
        { code: 'Poison green - 16-6444 TCX', hex: '#4DB560', name: 'Poison green' },
        { code: 'Vibrant green - 16-6339 TCX', hex: '#55A860', name: 'Vibrant green' },
        { code: 'Kelly green - 16-6138 TCX', hex: '#339C5E', name: 'Kelly green' },
        { code: 'Bright green - 15-5534 TCX', hex: '#009B5C', name: 'Bright green' },
        { code: 'Fern green - 17-6153 TCX', hex: '#008C45', name: 'Fern green' },
        { code: 'Jelly bean - 17-6030 TCX', hex: '#008658', name: 'Jelly bean' },
        { code: 'Amazon - 18-6024 TCX', hex: '#1F7349', name: 'Amazon' },
        { code: 'Green glow - 13-0442 TCX', hex: '#B0C965', name: 'Green glow' },
        { code: 'Bright lime green - 14-0244 TCX', hex: '#97BC62', name: 'Bright lime green' },
        { code: 'Greenery - 15-0343 TCX', hex: '#88B04B', name: 'Greenery' },
        { code: 'Foliage - 16-0237 TCX', hex: '#75A14F', name: 'Foliage' },
        { code: 'Peridot - 17-0336 TCX', hex: '#819548', name: 'Peridot' },
        { code: 'Meadow green - 16-0233 TCX', hex: '#739957', name: 'Meadow green' },
        { code: 'Woodbine - 18-0538 TCX', hex: '#7B7F32', name: 'Woodbine' },
        { code: 'Jade lime - 14-0232 TCX', hex: '#A1CA7B', name: 'Jade lime' },
        { code: 'Herbal garden - 15-0336 TCX', hex: '#9CAD60', name: 'Herbal garden' },
        { code: 'Leaf green - 15-0332 TCX', hex: '#9FAF6C', name: 'Leaf green' },
        { code: 'Parrot green - 15-0341 TCX', hex: '#8DB051', name: 'Parrot green' },
        { code: 'Dark citron - 16-0435 TCX', hex: '#A0AC4F', name: 'Dark citron' },
        { code: 'Macaw green - 16-0230 TCX', hex: '#9BB53E', name: 'Macaw green' },
        { code: 'Kiwi - 16-0235 TCX', hex: '#7AAB55', name: 'Kiwi' },
        { code: 'Sharp green - 13-0535 TCX', hex: '#C6EC7A', name: 'Sharp green' },
        { code: 'Daiquiri green - 12-0435 TCX', hex: '#C9D77E', name: 'Daiquiri green' },
        { code: 'Wild lime - 13-0540 TCX', hex: '#C3D363', name: 'Wild lime' },
        { code: 'Linden green - 15-0533 TCX', hex: '#C4BF71', name: 'Linden green' },
        { code: 'Bright chartreuse - 14-0445 TCX', hex: '#B5BF50', name: 'Bright chartreuse' },
        { code: 'Tender shoots - 14-0446 TCX', hex: '#B5CC39', name: 'Tender shoots' },
        { code: 'Lime punch - 13-0550 TCX', hex: '#C0D725', name: 'Lime punch' },
        { code: 'Sunny lime - 12-0741 TCX', hex: '#DFEF87', name: 'Sunny lime' },
        { code: 'Limeade - 13-0645 TCX', hex: '#D3D95F', name: 'Limeade' },
        { code: 'Sulphur spring - 13-0650 TCX', hex: '#D5D717', name: 'Sulphur spring' },
        { code: 'Citronelle - 15-0548 TCX', hex: '#B8AF23', name: 'Citronelle' },
        { code: 'Apple green - 15-0543 TCX', hex: '#B5B644', name: 'Apple green' },
        { code: 'Warm olive - 15-0646 TCX', hex: '#C7B63C', name: 'Warm olive' },
        { code: 'Antique moss - 16-0840 TCX', hex: '#B9A023', name: 'Antique moss' },
        { code: 'Lime cream - 12-0312 TCX', hex: '#D7E8BC', name: 'Lime cream' },
        { code: 'Shadow lime - 13-0319 TCX', hex: '#CFE09D', name: 'Shadow lime' },
        { code: 'Lime sherbet - 13-0530 TCX', hex: '#CDD78A', name: 'Lime sherbet' },
        { code: 'Lettuce green - 13-0324 TCX', hex: '#BED38E', name: 'Lettuce green' },
        { code: 'Sap green - 13-0331 TCX', hex: '#AFCB80', name: 'Sap green' },
        { code: 'Opaline green - 14-0226 TCX', hex: '#A3C57D', name: 'Opaline green' },
        { code: 'Winter pear - 15-0523 TCX', hex: '#B0B487', name: 'Winter pear' },
        { code: 'Sylvan green - 11-0410 TCX', hex: '#E7EACB', name: 'Sylvan green' },
        { code: 'Glass green - 11-0205 TCX', hex: '#ECEAD0', name: 'Glass green' },
        { code: 'Green essence - 12-0607 TCX', hex: '#E9EAC8', name: 'Green essence' },
        { code: 'Ethereal green - 11-0609 TCX', hex: '#F1ECCA', name: 'Ethereal green' },
        { code: 'Garden glade - 13-0614 TCX', hex: '#DCD8A8', name: 'Garden glade' },
        { code: 'Hay - 12-0418 TCX', hex: '#D3CCA3', name: 'Hay' },
        { code: 'Pale green - 13-0522 TCX', hex: '#CBCE91', name: 'Pale green' },
        { code: 'Young wheat - 12-0521 TCX', hex: '#E1E3A9', name: 'Young wheat' },
        { code: 'Citron - 12-0524 TCX', hex: '#DFDE9B', name: 'Citron' },
        { code: 'Luminary green - 12-0525 TCX', hex: '#E3EAA5', name: 'Luminary green' },
        { code: 'Pale lime yellow - 12-0520 TCX', hex: '#DFE69F', name: 'Pale lime yellow' },
        { code: 'Chardonnay - 13-0633 TCX', hex: '#E7DF99', name: 'Chardonnay' },
        { code: 'Lima bean - 13-0333 TCX', hex: '#E1D590', name: 'Lima bean' },
        { code: 'Charlock - 12-0530 TCX', hex: '#E5E790', name: 'Charlock' },
        { code: 'Mellow green - 12-0426 TCX', hex: '#D5D593', name: 'Mellow green' },
        { code: 'Shadow green - 14-0627 TCX', hex: '#CFC486', name: 'Shadow green' },
        { code: 'Celery green - 13-0532 TCX', hex: '#C5CC7B', name: 'Celery green' },
        { code: 'Green banana - 14-0434 TCX', hex: '#BABC72', name: 'Green banana' },
        { code: 'Green oasis - 15-0538 TCX', hex: '#B0B454', name: 'Green oasis' },
        { code: 'Leek green - 15-0628 TCX', hex: '#B7B17A', name: 'Leek green' },
        { code: 'Weeping willow - 15-0525 TCX', hex: '#B3B17B', name: 'Weeping willow' },
        { code: 'Palm - 15-0535 TCX', hex: '#AFAF5E', name: 'Palm' },
        { code: 'Golden olive - 16-0639 TCX', hex: '#AF9841', name: 'Golden olive' },
        { code: 'Oasis - 16-0540 TCX', hex: '#A3A04E', name: 'Oasis' },
        { code: 'Moss - 16-0532 TCX', hex: '#A09D59', name: 'Moss' },
        { code: 'Amber green - 17-0840 TCX', hex: '#9A803A', name: 'Amber green' },
        { code: 'Ecru olive - 17-0836 TCX', hex: '#927B3C', name: 'Ecru olive' },
        { code: 'Green moss - 17-0636 TCX', hex: '#857946', name: 'Green moss' },
        { code: 'Khaki - 16-0726 TCX', hex: '#A39264', name: 'Khaki' },
        { code: 'Fennel seed - 17-0929 TCX', hex: '#998456', name: 'Fennel seed' },
        { code: 'Willow - 16-0632 TCX', hex: '#9A8B4F', name: 'Willow' },
        { code: 'Bronze mist - 17-0843 TCX', hex: '#9C7E41', name: 'Bronze mist' },
        { code: 'Dried tobacco - 18-0835 TCX', hex: '#997B38', name: 'Dried tobacco' },
        { code: 'Tapenade - 18-0840 TCX', hex: '#805D24', name: 'Tapenade' },
        { code: 'Plantation - 18-0832 TCX', hex: '#7A6332', name: 'Plantation' },
        { code: 'Fog green - 13-0210 TCX', hex: '#C2CBB4', name: 'Fog green' },
        { code: 'Tender greens - 13-0212 TCX', hex: '#C5CFB6', name: 'Tender greens' },
        { code: 'Aloe wash - 13-0608 TCX', hex: '#D0D3B7', name: 'Aloe wash' },
        { code: 'Celadon green - 14-0114 TCX', hex: '#B5C1A5', name: 'Celadon green' },
        { code: 'Laurel green - 15-6313 TCX', hex: '#ADBBA1', name: 'Laurel green' },
        { code: 'Swamp - 15-6310 TCX', hex: '#A8B197', name: 'Swamp' },
        { code: 'Reseda - 15-6414 TCX', hex: '#A1AD92', name: 'Reseda' },
        { code: 'Meadow mist - 12-0106 TCX', hex: '#D3DEC4', name: 'Meadow mist' },
        { code: 'Butterfly - 12-0322 TCX', hex: '#CADEA5', name: 'Butterfly' },
        { code: 'White jade - 12-0315 TCX', hex: '#D4DBB2', name: 'White jade' },
        { code: 'Seafoam green - 12-0313 TCX', hex: '#CBD5B1', name: 'Seafoam green' },
        { code: 'Reed - 13-0215 TCX', hex: '#C3D3A8', name: 'Reed' },
        { code: 'Seedling - 14-0217 TCX', hex: '#C0CBA1', name: 'Seedling' },
        { code: 'Foam green - 14-0115 TCX', hex: '#B4C79C', name: 'Foam green' },
        { code: 'Lily green - 13-0317 TCX', hex: '#C5CF98', name: 'Lily green' },
        { code: 'Beechnut - 14-0425 TCX', hex: '#C2C18D', name: 'Beechnut' },
        { code: 'Nile - 14-0223 TCX', hex: '#B4BB85', name: 'Nile' },
        { code: 'Sweet pea - 15-0531 TCX', hex: '#A3A969', name: 'Sweet pea' },
        { code: 'Spinach green - 16-0439 TCX', hex: '#909B4C', name: 'Spinach green' },
        { code: 'Fern - 16-0430 TCX', hex: '#9AA067', name: 'Fern' },
        { code: 'Green olive - 17-0535 TCX', hex: '#8D8B55', name: 'Green olive' },
        { code: 'Epsom - 17-0324 TCX', hex: '#849161', name: 'Epsom' },
        { code: 'Grasshopper - 18-0332 TCX', hex: '#77824A', name: 'Grasshopper' },
        { code: 'Turtle green - 17-0330 TCX', hex: '#81894E', name: 'Turtle green' },
        { code: 'Calliste green - 18-0324 TCX', hex: '#757A4E', name: 'Calliste green' },
        { code: 'Calla green - 18-0435 TCX', hex: '#6A6F34', name: 'Calla green' },
        { code: 'Cedar green - 18-0328 TCX', hex: '#5E6737', name: 'Cedar green' },
        { code: 'Pesto - 18-0228 TCX', hex: '#595F34', name: 'Pesto' },
        { code: 'Tarragon - 15-0326 TCX', hex: '#A4AE77', name: 'Tarragon' },
        { code: 'Sage - 16-0421 TCX', hex: '#91946E', name: 'Sage' },
        { code: 'Iguana - 18-0525 TCX', hex: '#818455', name: 'Iguana' },
        { code: 'Oil green - 17-0115 TCX', hex: '#80856D', name: 'Oil green' },
        { code: 'Loden green - 18-0422 TCX', hex: '#6E7153', name: 'Loden green' },
        { code: 'Capulet olive - 18-0426 TCX', hex: '#656344', name: 'Capulet olive' },
        { code: 'Olivine - 18-0316 TCX', hex: '#666B54', name: 'Olivine' },
        { code: 'Lint - 14-0216 TCX', hex: '#B6BA99', name: 'Lint' },
        { code: 'Pale olive green - 15-0522 TCX', hex: '#B5AD88', name: 'Pale olive green' },
        { code: 'Sage green - 15-0318 TCX', hex: '#B2AC88', name: 'Sage green' },
        { code: 'Gray green - 16-0518 TCX', hex: '#A49A79', name: 'Gray green' },
        { code: 'Sponge - 16-1118 TCX', hex: '#A49775', name: 'Sponge' },
        { code: 'Mermaid - 17-0618 TCX', hex: '#817A65', name: 'Mermaid' },
        { code: 'Dusky green - 17-0517 TCX', hex: '#746C57', name: 'Dusky green' },
        { code: 'Tea - 16-0213 TCX', hex: '#999B85', name: 'Tea' },
        { code: 'Silver sage - 17-0510 TCX', hex: '#938B78', name: 'Silver sage' },
        { code: 'Slate green - 16-0713 TCX', hex: '#A0987C', name: 'Slate green' },
        { code: 'Elm - 16-0613 TCX', hex: '#A39F86', name: 'Elm' },
        { code: 'Mosstone - 17-0525 TCX', hex: '#858961', name: 'Mosstone' },
        { code: 'Aloe - 17-0620 TCX', hex: '#817A60', name: 'Aloe' },
        { code: 'Olive drab - 18-0622 TCX', hex: '#756D47', name: 'Olive drab' },
        { code: 'Cedar - 16-0526 TCX', hex: '#928E64', name: 'Cedar' },
        { code: 'Boa - 17-0625 TCX', hex: '#8E855F', name: 'Boa' },
        { code: 'Dried herb - 17-0627 TCX', hex: '#847A59', name: 'Dried herb' },
        { code: 'Olive branch - 18-0527 TCX', hex: '#646A45', name: 'Olive branch' },
        { code: 'Lizard - 18-0629 TCX', hex: '#71643E', name: 'Lizard' },
        { code: 'Avocado - 18-0430 TCX', hex: '#676232', name: 'Avocado' },
        { code: 'Fir green - 18-0627 TCX', hex: '#67592A', name: 'Fir green' },
        { code: 'Bog - 14-0418 TCX', hex: '#BAB696', name: 'Bog' },
        { code: 'Elmwood - 17-1019 TCX', hex: '#8C7C61', name: 'Elmwood' },
        { code: 'Gothic olive - 18-0724 TCX', hex: '#7C6E4F', name: 'Gothic olive' },
        { code: 'Butternut - 18-0830 TCX', hex: '#7A643F', name: 'Butternut' },
        { code: 'Nutria - 18-0825 TCX', hex: '#75663E', name: 'Nutria' },
        { code: 'Military olive - 19-0622 TCX', hex: '#63563B', name: 'Military olive' },
        { code: 'Dark olive - 19-0516 TCX', hex: '#574D35', name: 'Dark olive' },
        { code: 'Moss gray - 15-6410 TCX', hex: '#AFAB97', name: 'Moss gray' },
        { code: 'Abbey stone - 14-6408 TCX', hex: '#ABA798', name: 'Abbey stone' },
        { code: 'Burnt olive - 18-0521 TCX', hex: '#646049', name: 'Burnt olive' },
        { code: 'Dusty olive - 18-0515 TCX', hex: '#646356', name: 'Dusty olive' },
        { code: 'Ivy green - 19-0512 TCX', hex: '#585442', name: 'Ivy green' },
        { code: 'Olive night - 19-0515 TCX', hex: '#535040', name: 'Olive night' },
        { code: 'Grape leaf - 19-0511 TCX', hex: '#545144', name: 'Grape leaf' },
        { code: 'Porpoise - 15-3800 TCX', hex: '#A7A19E', name: 'Porpoise' },
        { code: 'Satellite - 16-3800 TCX', hex: '#9F8D89', name: 'Satellite' },
        { code: 'Driftwood - 18-1210 TCX', hex: '#847A75', name: 'Driftwood' },
        { code: 'Falcon - 18-1304 TCX', hex: '#6D625B', name: 'Falcon' },
        { code: 'Morel - 19-0808 TCX', hex: '#685C53', name: 'Morel' },
        { code: 'Fallen rock - 18-1108 TCX', hex: '#807669', name: 'Fallen rock' },
        { code: 'Vintage khaki - 16-0205 TCX', hex: '#9A9186', name: 'Vintage khaki' },
        { code: 'Crockery - 16-1104 TCX', hex: '#A49887', name: 'Crockery' },
        { code: 'Greige - 16-1109 TCX', hex: '#928475', name: 'Greige' },
        { code: 'Desert taupe - 17-1311 TCX', hex: '#8D7E71', name: 'Desert taupe' },
        { code: 'White pepper - 15-1307 TCX', hex: '#B6A893', name: 'White pepper' },
        { code: 'Humus - 15-1304 TCX', hex: '#B7A793', name: 'Humus' },
        { code: 'Portabella - 17-1316 TCX', hex: '#937B6A', name: 'Portabella' },
        { code: 'Caribou - 18-1017 TCX', hex: '#816D5E', name: 'Caribou' },
        { code: 'Travertine - 15-1114 TCX', hex: '#AE997D', name: 'Travertine' },
        { code: 'Starfish - 16-1120 TCX', hex: '#B09A77', name: 'Starfish' },
        { code: 'Semolina - 15-1218 TCX', hex: '#CEB899', name: 'Semolina' },
        { code: 'Curds and whey - 16-0920 TCX', hex: '#BCA483', name: 'Curds and whey' },
        { code: 'Tigers eye - 17-1038 TCX', hex: '#977C61', name: 'Tigers eye' },
        { code: 'Toasted coconut - 18-1029 TCX', hex: '#8B6A4F', name: 'Toasted coconut' },
        { code: 'Rain drum - 19-0916 TCX', hex: '#5F4C40', name: 'Rain drum' },
        { code: 'Pear sorbet - 11-0615 TCX', hex: '#F3EAC3', name: 'Pear sorbet' },
        { code: 'Pineapple slice - 12-0718 TCX', hex: '#E7D391', name: 'Pineapple slice' },
        { code: 'Yarrow - 12-0758 TCX', hex: '#FACE6D', name: 'Yarrow' },
        { code: 'Anise flower - 12-0717 TCX', hex: '#F4E3B5', name: 'Anise flower' },
        { code: 'Flan - 11-0619 TCX', hex: '#F6E3B4', name: 'Flan' },
        { code: 'Sundress - 12-0729 TCX', hex: '#EBCF89', name: 'Sundress' },
        { code: 'Macadamia - 12-0709 TCX', hex: '#E4CFB6', name: 'Macadamia' },
        { code: 'Lemon meringue - 12-0711 TCX', hex: '#F6E199', name: 'Lemon meringue' },
        { code: 'Yellow iris - 11-0622 TCX', hex: '#EEE78E', name: 'Yellow iris' },
        { code: 'Goldfinch - 12-0737 TCX', hex: '#F8DC6C', name: 'Goldfinch' },
        { code: 'Lemon zest - 13-0756 TCX', hex: '#F9D857', name: 'Lemon zest' },
        { code: 'Solar power - 13-0759 TCX', hex: '#F4BF3A', name: 'Solar power' },
        { code: 'Samoan sun - 14-0851 TCX', hex: '#FBC85F', name: 'Samoan sun' },
        { code: 'Desert sun - 16-1149 TCX', hex: '#C87629', name: 'Desert sun' },
        { code: 'Pumpkin spice - 18-1163 TCX', hex: '#A05C17', name: 'Pumpkin spice' },
        { code: 'Orange pepper - 16-1164 TCX', hex: '#DF7500', name: 'Orange pepper' },
        { code: 'Marmalade - 17-1140 TCX', hex: '#C16512', name: 'Marmalade' },
        { code: 'Hawaiian sunset - 18-1249 TCX', hex: '#BB5C14', name: 'Hawaiian sunset' },
        { code: 'Autumnal - 17-1342 TCX', hex: '#A15325', name: 'Autumnal' },
        { code: 'Umber - 18-1246 TCX', hex: '#944A1F', name: 'Umber' },
        { code: 'Exuberance - 17-1349 TCX', hex: '#E86800', name: 'Exuberance' },
        { code: 'Puffins bill - 16-1363 TCX', hex: '#E95C20', name: 'Puffins bill' },
        { code: 'Caramel cafe - 18-1148 TCX', hex: '#864C24', name: 'Caramel cafe' },
        { code: 'Gold flame - 16-1449 TCX', hex: '#B45422', name: 'Gold flame' },
        { code: 'Cinnamon stick - 18-1345 TCX', hex: '#9B4722', name: 'Cinnamon stick' },
        { code: 'Potters clay - 18-1340 TCX', hex: '#9E4624', name: 'Potters clay' },
        { code: 'Rooibos tea - 18-1355 TCX', hex: '#A23C26', name: 'Rooibos tea' },
        { code: 'Celosia orange - 17-1360 TCX', hex: '#E8703A', name: 'Celosia orange' },
        { code: 'Orangeade - 17-1461 TCX', hex: '#E2552C', name: 'Orangeade' },
        { code: 'Pureed pumpkin - 17-1449 TCX', hex: '#C34121', name: 'Pureed pumpkin' },
        { code: 'Tangerine tango - 17-1463 TCX', hex: '#DD4124', name: 'Tangerine tango' },
        { code: 'Poinciana - 18-1564 TCX', hex: '#CA3422', name: 'Poinciana' },
        { code: 'Koi - 17-1452 TCX', hex: '#D15837', name: 'Koi' },
        { code: 'Samba - 19-1662 TCX', hex: '#A2242F', name: 'Samba' },
        { code: 'Barbados cherry - 19-1757 TCX', hex: '#AA0A27', name: 'Barbados cherry' },
        { code: 'Haute red - 19-1758 TCX', hex: '#A11729', name: 'Haute red' },
        { code: 'Salsa - 18-1657 TCX', hex: '#AA182B', name: 'Salsa' },
        { code: 'Scarlet sage - 19-1559 TCX', hex: '#9D202F', name: 'Scarlet sage' },
        { code: 'Scooter - 19-1863 TCX', hex: '#941E32', name: 'Scooter' },
        { code: 'Red dahlia - 19-1555 TCX', hex: '#7D2027', name: 'Red dahlia' },
        { code: 'Sun dried tomato - 19-1531 TCX', hex: '#752329', name: 'Sun dried tomato' },
        { code: 'Fired brick - 19-1337 TCX', hex: '#6A2E2A', name: 'Fired brick' },
        { code: 'Rhubarb - 19-1652 TCX', hex: '#77202F', name: 'Rhubarb' },
        { code: 'Syrah - 19-1535 TCX', hex: '#6A282C', name: 'Syrah' },
        { code: 'Pomegranate - 19-1930 TCX', hex: '#6C2831', name: 'Pomegranate' },
        { code: 'Cabernet - 19-1724 TCX', hex: '#64242E', name: 'Cabernet' },
        { code: 'Ballerina - 13-2807 TCX', hex: '#F2CFDC', name: 'Ballerina' },
        { code: 'Fairy tale - 13-2802 TCX', hex: '#F2C1D1', name: 'Fairy tale' },
        { code: 'Etherea - 15-1506 TCX', hex: '#A5958F', name: 'Etherea' },
        { code: 'Foxglove - 16-1710 TCX', hex: '#B98391', name: 'Foxglove' },
        { code: 'Mesa rose - 17-1609 TCX', hex: '#A66E7A', name: 'Mesa rose' },
        { code: 'Jazzy - 18-1950 TCX', hex: '#B61C50', name: 'Jazzy' },
        { code: 'Granita - 19-2039 TCX', hex: '#A52350', name: 'Granita' },
        { code: 'Cherries jubilee - 19-2041 TCX', hex: '#A22452', name: 'Cherries jubilee' },
        { code: 'Cabaret - 18-2140 TCX', hex: '#CB3373', name: 'Cabaret' },
        { code: 'Vivacious - 19-2045 TCX', hex: '#A32857', name: 'Vivacious' },
        { code: 'Bellflower - 18-3628 TCX', hex: '#9469A2', name: 'Bellflower' },
        { code: 'English lavendar - 17-3617 TCX', hex: '#9D7BB0', name: 'English lavendar' },
        { code: 'Rhapsody - 16-3817 TCX', hex: '#9F86AA', name: 'Rhapsody' },
        { code: 'Acai - 19-3628 TCX', hex: '#46295A', name: 'Acai' },
        { code: 'Tillandsia purple - 19-3638 TCX', hex: '#563474', name: 'Tillandsia purple' },
        { code: 'Picasso lily - 18-3635 TCX', hex: '#634878', name: 'Picasso lily' },
        { code: 'Mystical - 18-3620 TCX', hex: '#5F4E72', name: 'Mystical' },
        { code: 'Icelandic blue - 15-3908 TCX', hex: '#A9ADC2', name: 'Icelandic blue' },
        { code: 'Aleutian - 15-3912 TCX', hex: '#9A9EB3', name: 'Aleutian' },
        { code: 'Silver bullet - 17-3933 TCX', hex: '#81839A', name: 'Silver bullet' },
        { code: 'Blue granite - 18-3933 TCX', hex: '#717388', name: 'Blue granite' },
        { code: 'Evening blue - 19-3815 TCX', hex: '#2A293E', name: 'Evening blue' },
        { code: 'Deep well - 19-3713 TCX', hex: '#2C2A33', name: 'Deep well' },
        { code: 'Night sky - 19-3924 TCX', hex: '#2A2A35', name: 'Night sky' },
        { code: 'Blue heron - 16-3921 TCX', hex: '#96A3C7', name: 'Blue heron' },
        { code: 'Hydrangea - 16-4030 TCX', hex: '#849BCC', name: 'Hydrangea' },
        { code: 'Xenon blue - 14-3949 TCX', hex: '#B7C0D7', name: 'Xenon blue' },
        { code: 'Brunnera blue - 16-3922 TCX', hex: '#9BA9CA', name: 'Brunnera blue' },
        { code: 'Sky captain - 19-3922 TCX', hex: '#262934', name: 'Sky captain' },
        { code: 'Navy blazer - 19-3923 TCX', hex: '#282D3C', name: 'Navy blazer' },
        { code: 'Dark sapphire - 19-4020 TCX', hex: '#262B37', name: 'Dark sapphire' },
        { code: 'Plein air - 13-4111 TCX', hex: '#BFCAD6', name: 'Plein air' },
        { code: 'Halogen blue - 13-3920 TCX', hex: '#BDC6DC', name: 'Halogen blue' },
        { code: 'Chambray blue - 15-4030 TCX', hex: '#9EB4D3', name: 'Chambray blue' },
        { code: 'Bel air blue - 15-3932 TCX', hex: '#819AC1', name: 'Bel air blue' },
        { code: 'Vintage indigo - 19-3929 TCX', hex: '#4A556B', name: 'Vintage indigo' },
        { code: 'Sodalite blue - 19-3953 TCX', hex: '#253668', name: 'Sodalite blue' },
        { code: 'Parisian night - 19-4022 TCX', hex: '#323441', name: 'Parisian night' },
        { code: 'Monaco blue - 19-3964 TCX', hex: '#274374', name: 'Monaco blue' },
        { code: 'Vallarta blue - 18-4034 TCX', hex: '#30658E', name: 'Vallarta blue' },
        { code: 'Salute - 19-4011 TCX', hex: '#282B34', name: 'Salute' },
        { code: 'Outer space - 19-4009 TCX', hex: '#2F3441', name: 'Outer space' },
        { code: 'Blueberry - 19-4021 TCX', hex: '#2C333E', name: 'Blueberry' },
        { code: 'Carbon - 19-4012 TCX', hex: '#272F38', name: 'Carbon' },
        { code: 'Vulcan - 19-4218 TCX', hex: '#2D3036', name: 'Vulcan' },
        { code: 'Omphalodes - 13-4200 TCX', hex: '#B5CEDF', name: 'Omphalodes' },
        { code: 'Cool blue - 14-4317 TCX', hex: '#A5C5D9', name: 'Cool blue' },
        { code: 'Bering sea - 18-4028 TCX', hex: '#4B5B6E', name: 'Bering sea' },
        { code: 'Blue wing teal - 19-4121 TCX', hex: '#2C4053', name: 'Blue wing teal' },
        { code: 'Poseidon - 19-4033 TCX', hex: '#123955', name: 'Poseidon' },
        { code: 'Mykonos blue - 18-4434 TCX', hex: '#005780', name: 'Mykonos blue' },
        { code: 'Reflecting pond - 19-4326 TCX', hex: '#203E4A', name: 'Reflecting pond' },
        { code: 'Corydalis blue - 14-4311 TCX', hex: '#A9CADA', name: 'Corydalis blue' },
        { code: 'Blue topaz - 14-4310 TCX', hex: '#78BDD4', name: 'Blue topaz' },
        { code: 'Gulf stream - 14-4511 TCX', hex: '#88C3D0', name: 'Gulf stream' },
        { code: 'Aquarelle - 15-4714 TCX', hex: '#61AAB1', name: 'Aquarelle' },
        { code: 'Aqua splash - 14-4812 TCX', hex: '#85CED1', name: 'Aqua splash' },
        { code: 'Botanical garden - 19-5220 TCX', hex: '#12403C', name: 'Botanical garden' },
        { code: 'Scarab - 19-5350 TCX', hex: '#23312D', name: 'Scarab' },
        { code: 'Nimbus cloud - 13-4108 TCX', hex: '#D5D5D8', name: 'Nimbus cloud' },
        { code: 'Micro chip - 14-4105 TCX', hex: '#BABCC0', name: 'Micro chip' },
        { code: 'Wet weather - 16-5101 TCX', hex: '#929090', name: 'Wet weather' },
        { code: 'Titanium - 17-4014 TCX', hex: '#807D7F', name: 'Titanium' },
        { code: 'December sky - 18-4016 TCX', hex: '#767275', name: 'December sky' },
        { code: 'Pavement - 19-3900 TCX', hex: '#524D50', name: 'Pavement' },
        { code: 'Magnet - 19-3901 TCX', hex: '#4D4B4F', name: 'Magnet' },
        { code: 'Silver sconce - 16-3850 TCX', hex: '#A19FA5', name: 'Silver sconce' },
        { code: 'Silver filigree - 17-3911 TCX', hex: '#7F7C81', name: 'Silver filigree' },
        { code: 'Quicksilver - 17-3907 TCX', hex: '#7E7D88', name: 'Quicksilver' },
        { code: 'Storm front - 17-1503 TCX', hex: '#787376', name: 'Storm front' },
        { code: 'Tornado - 18-3907 TCX', hex: '#5E5B60', name: 'Tornado' },
        { code: 'Eiffel tower - 18-5210 TCX', hex: '#5C5658', name: 'Eiffel tower' },
        { code: 'Graphite - 19-3927 TCX', hex: '#3B3B48', name: 'Graphite' },
        { code: 'Alloy - 16-3915 TCX', hex: '#98979A', name: 'Alloy' },
        { code: 'Sleet - 16-3916 TCX', hex: '#92949B', name: 'Sleet' },
        { code: 'Tradewinds - 15-4307 TCX', hex: '#7F8793', name: 'Tradewinds' },
        { code: 'Grisaille - 18-3912 TCX', hex: '#585E6F', name: 'Grisaille' },
        { code: 'Periscope - 19-3918 TCX', hex: '#46444C', name: 'Periscope' },
        { code: 'Quiet shade - 18-4006 TCX', hex: '#66676D', name: 'Quiet shade' },
        { code: 'Turbulence - 19-4215 TCX', hex: '#4E545B', name: 'Turbulence' },
        { code: 'Stormy weather - 18-4214 TCX', hex: '#58646D', name: 'Stormy weather' },
        { code: 'Iron gate - 19-3910 TCX', hex: '#4E5055', name: 'Iron gate' },
        { code: 'Forged iron - 19-3907 TCX', hex: '#48464A', name: 'Forged iron' },
        { code: 'Asphalt - 19-0201 TCX', hex: '#434447', name: 'Asphalt' },
        { code: 'Ghost gray - 16-4703 TCX', hex: '#9C9B98', name: 'Ghost gray' },
        { code: 'Brushed nickel - 18-5102 TCX', hex: '#73706F', name: 'Brushed nickel' },
        { code: 'Mourning dove - 16-4400 TCX', hex: '#94908B', name: 'Mourning dove' },
        { code: 'Belgian block - 15-4306 TCX', hex: '#A3A9A6', name: 'Belgian block' },
        { code: 'Agave green - 18-5806 TCX', hex: '#6B7169', name: 'Agave green' },
        { code: 'Cilantro - 19-5621 TCX', hex: '#43544B', name: 'Cilantro' },
        { code: 'Pine grove - 19-5406 TCX', hex: '#213631', name: 'Pine grove' },
        { code: 'Eden - 19-6050 TCX', hex: '#264E36', name: 'Eden' },
        { code: 'Jolly green - 18-6030 TCX', hex: '#007844', name: 'Jolly green' },
        { code: 'Mountain view - 19-5918 TCX', hex: '#2E3D30', name: 'Mountain view' },
        { code: 'Margarita - 14-0116 TCX', hex: '#B5C38E', name: 'Margarita' },
        { code: 'Winter moss - 18-0523 TCX', hex: '#5B5A41', name: 'Winter moss' },
        { code: 'Climbing ivy - 19-0307 TCX', hex: '#444940', name: 'Climbing ivy' },
        { code: 'Delicioso - 19-0840 TCX', hex: '#3F352F', name: 'Delicioso' },
        { code: 'Mulch - 19-0910 TCX', hex: '#433937', name: 'Mulch' },
        { code: 'Mole - 19-1106 TCX', hex: '#392D2B', name: 'Mole' },
        { code: 'Chocolate torte - 19-1109 TCX', hex: '#382E2D', name: 'Chocolate torte' },
        { code: 'Ganache - 19-1018 TCX', hex: '#34292A', name: 'Ganache' },
        { code: 'Black bean - 19-3909 TCX', hex: '#2E272A', name: 'Black bean' },
        { code: 'Espresso - 19-1103 TCX', hex: '#363031', name: 'Espresso' },
        { code: 'Meteorite - 19-4008 TCX', hex: '#2B2929', name: 'Meteorite' },
        { code: 'Tap shoe - 19-4004 TCX', hex: '#2A2B2D', name: 'Tap shoe' },
        { code: 'White alyssum - 11-1001 TCX', hex: '#EFEBE7', name: 'White alyssum' },
        { code: 'Jet stream - 11-0605 TCX', hex: '#EDE6DE', name: 'Jet stream' },
        { code: 'Sweet cream - 11-0106 TCX', hex: '#F0EAD6', name: 'Sweet cream' },
        { code: 'Buttercream - 11-0110 TCX', hex: '#EFE0CD', name: 'Buttercream' },
        { code: 'Lemon icing - 11-0515 TCX', hex: '#F6EBC8', name: 'Lemon icing' },
        { code: 'Sugar swizzle - 11-0607 TCX', hex: '#F3EEE7', name: 'Sugar swizzle' },
        { code: 'Coconut milk - 11-0608 TCX', hex: '#F0EDE5', name: 'Coconut milk' },
        { code: 'Yellow pear - 11-0623 TCX', hex: '#ECE99B', name: 'Yellow pear' },
        { code: 'Sea salt - 11-1302 TCX', hex: '#F1E6DE', name: 'Sea salt' },
        { code: 'Brilliant white - 11-4001 TCX', hex: '#EDF1FE', name: 'Brilliant white' },
        { code: 'Cannoli cream - 11-4302 TCX', hex: '#F0EFE2', name: 'Cannoli cream' },
        { code: 'Tofu - 11-4801 TCX', hex: '#E8E3D9', name: 'Tofu' },
        { code: 'Pistachio shell - 12-0110 TCX', hex: '#D7CFBB', name: 'Pistachio shell' },
        { code: 'Celandine - 12-0646 TCX', hex: '#EBDF67', name: 'Celandine' },
        { code: 'Lemon verbena - 12-0742 TCX', hex: '#F3E779', name: 'Lemon verbena' },
        { code: 'Creme de peche - 12-1110 TCX', hex: '#F5D6C6', name: 'Creme de peche' },
        { code: 'Marys rose - 12-1813 TCX', hex: '#F7D1D4', name: 'Marys rose' },
        { code: 'Morganite - 12-2901 TCX', hex: '#DFCDC6', name: 'Morganite' },
        { code: 'Rose water - 12-2907 TCX', hex: '#F8E0E7', name: 'Rose water' },
        { code: 'Almond milk - 12-4301 TCX', hex: '#D6CEBE', name: 'Almond milk' },
        { code: 'Lime popsicle - 13-0443 TCX', hex: '#C0DB3A', name: 'Lime popsicle' },
        { code: 'Golden kiwi - 13-0644 TCX', hex: '#F3DD3E', name: 'Golden kiwi' },
        { code: 'Meadowlark - 13-0646 TCX', hex: '#EAD94E', name: 'Meadowlark' },
        { code: 'Evening primrose - 13-0651 TCX', hex: '#CCDB1E', name: 'Evening primrose' },
        { code: 'Habanero gold - 13-0849 TCX', hex: '#FED450', name: 'Habanero gold' },
        { code: 'Minion yellow - 13-0851 TCX', hex: '#FED55D', name: 'Minion yellow' },
        { code: 'Soybean - 13-0919 TCX', hex: '#D2C29D', name: 'Soybean' },
        { code: 'Jurassic gold - 13-0946 TCX', hex: '#E7AA56', name: 'Jurassic gold' },
        { code: 'Brown rice - 13-1105 TCX', hex: '#C7BBA4', name: 'Brown rice' },
        { code: 'Peach quartz - 13-1125 TCX', hex: '#F5B895', name: 'Peach quartz' },
        { code: 'Peachy keen - 13-1208 TCX', hex: '#E2BDB3', name: 'Peachy keen' },
        { code: 'Brazilian sand - 13-1308 TCX', hex: '#DACAB7', name: 'Brazilian sand' },
        { code: 'Pink salt - 13-1511 TCX', hex: '#F7CDC7', name: 'Pink salt' },
        { code: 'Rose quartz - 13-1520 TCX', hex: '#F7CAC9', name: 'Rose quartz' },
        { code: 'Ballet slipper - 13-2808 TCX', hex: '#EBCED5', name: 'Ballet slipper' },
        { code: 'Cherry blossom - 13-3207 TCX', hex: '#F7CEE0', name: 'Cherry blossom' },
        { code: 'Antarctica - 13-4104 TCX', hex: '#C6C5C6', name: 'Antarctica' },
        { code: 'Oyster mushroom - 13-4201 TCX', hex: '#C3C6C8', name: 'Oyster mushroom' },
        { code: 'Tanager turquoise - 13-4720 TCX', hex: '#91DCE8', name: 'Tanager turquoise' },
        { code: 'Limpet shell - 13-4810 TCX', hex: '#98DDDE', name: 'Limpet shell' },
        { code: 'Iced aqua - 13-5410 TCX', hex: '#ABD3DB', name: 'Iced aqua' },
        { code: 'Acid lime - 14-0340 TCX', hex: '#BADF30', name: 'Acid lime' },
        { code: 'Spicy mustard - 14-0952 TCX', hex: '#D8AE47', name: 'Spicy mustard' },
        { code: 'Kumquat - 14-1052 TCX', hex: '#FBAA4C', name: 'Kumquat' },
        { code: 'Irish cream - 14-1208 TCX', hex: '#C0AC92', name: 'Irish cream' },
        { code: 'Orange chiffon - 14-1241 TCX', hex: '#F9AA7D', name: 'Orange chiffon' },
        { code: 'Hazelnut - 14-1315 TCX', hex: '#CFB095', name: 'Hazelnut' },
        { code: 'Sepia rose - 14-1803 TCX', hex: '#D4BAB6', name: 'Sepia rose' },
        { code: 'Raindrops - 14-3906 TCX', hex: '#B1AAB3', name: 'Raindrops' },
        { code: 'Zen blue - 14-3912 TCX', hex: '#9FA9BE', name: 'Zen blue' },
        { code: 'Quiet gray - 14-4107 TCX', hex: '#B9BABD', name: 'Quiet gray' },
        { code: 'Airy blue - 14-4122 TCX', hex: '#92B6D5', name: 'Airy blue' },
        { code: 'Harbor mist - 14-4202 TCX', hex: '#AFB1B4', name: 'Harbor mist' },
        { code: 'Sea angel - 14-4315 TCX', hex: '#98BFCA', name: 'Sea angel' },
        { code: 'Baltic sea - 14-4320 TCX', hex: '#79B5DB', name: 'Baltic sea' },
        { code: 'Antiqua sand - 14-4615 TCX', hex: '#83C2CD', name: 'Antiqua sand' },
        { code: 'Island paradise - 14-4620 TCX', hex: '#95DEE3', name: 'Island paradise' },
        { code: 'Tibetan stone - 14-4710 TCX', hex: '#82C2C7', name: 'Tibetan stone' },
        { code: 'Mango mojito - 15-0960 TCX', hex: '#D69C2F', name: 'Mango mojito' },
        { code: 'Ginger root - 15-1020 TCX', hex: '#BFA58A', name: 'Ginger root' },
        { code: 'Iced coffee - 15-1040 TCX', hex: '#B18F6A', name: 'Iced coffee' },
        { code: 'Autumn blaze - 15-1045 TCX', hex: '#D9922E', name: 'Autumn blaze' },
        { code: 'Golden orange - 15-1051 TCX', hex: '#D7942D', name: 'Golden orange' },
        { code: 'Porcini - 15-1125 TCX', hex: '#CCA580', name: 'Porcini' },
        { code: 'Iceland poppy - 15-1151 TCX', hex: '#F4963A', name: 'Iceland poppy' },
        { code: 'Papaya - 15-1243 TCX', hex: '#FEA166', name: 'Papaya' },
        { code: 'Carrot curl - 15-1262 TCX', hex: '#FE8C18', name: 'Carrot curl' },
        { code: 'Turmeric - 15-1264 TCX', hex: '#FE840E', name: 'Turmeric' },
        { code: 'Tangelo - 15-1335 TCX', hex: '#FE7E03', name: 'Tangelo' },
        { code: 'Fenugreek - 15-1425 TCX', hex: '#C0916C', name: 'Fenugreek' },
        { code: 'Dusted clay - 15-1429 TCX', hex: '#CC7357', name: 'Dusted clay' },
        { code: 'Pastry shell - 15-1430 TCX', hex: '#BD8C66', name: 'Pastry shell' },
        { code: 'Blooming dahlia - 15-1520 TCX', hex: '#EB9687', name: 'Blooming dahlia' },
        { code: 'Crocus petal - 15-3520 TCX', hex: '#B99BC5', name: 'Crocus petal' },
        { code: 'Purple rose - 15-3716 TCX', hex: '#B09FCA', name: 'Purple rose' },
        { code: 'Lilac breeze - 15-3720 TCX', hex: '#B3A0C9', name: 'Lilac breeze' },
        { code: 'Serenity - 15-3919 TCX', hex: '#91A8D0', name: 'Serenity' },
        { code: 'Crystal seas - 15-4428 TCX', hex: '#5DAFCE', name: 'Crystal seas' },
        { code: 'Golden lime - 16-0543 TCX', hex: '#9A9738', name: 'Golden lime' },
        { code: 'Split pea - 16-0545 TCX', hex: '#9C9A40', name: 'Split pea' },
        { code: 'Lentil sprout - 16-0550 TCX', hex: '#ABA44D', name: 'Lentil sprout' },
        { code: 'Pure cashmere - 16-1103 TCX', hex: '#ADA396', name: 'Pure cashmere' },
        { code: 'Sun baked - 16-1345 TCX', hex: '#D27F63', name: 'Sun baked' },
        { code: 'Peach caramel - 16-1347 TCX', hex: '#C5733D', name: 'Peach caramel' },
        { code: 'Tomato cream - 16-1348 TCX', hex: '#C57644', name: 'Tomato cream' },
        { code: 'Orange tiger - 16-1358 TCX', hex: '#F96714', name: 'Orange tiger' },
        { code: 'Meerkat - 16-1438 TCX', hex: '#A46F44', name: 'Meerkat' },
        { code: 'Exotic orange - 16-1453 TCX', hex: '#F96531', name: 'Exotic orange' },
        { code: 'Dragon fire - 16-1460 TCX', hex: '#FC642D', name: 'Dragon fire' },
        { code: 'Coral quartz - 16-1545 TCX', hex: '#F77464', name: 'Coral quartz' },
        { code: 'Peach echo - 16-1548 TCX', hex: '#F7786B', name: 'Peach echo' },
        { code: 'Purple dove - 16-1606 TCX', hex: '#98878C', name: 'Purple dove' },
        { code: 'Sand verbena - 16-3720 TCX', hex: '#9F90C1', name: 'Sand verbena' },
        { code: 'Lilac gray - 16-3905 TCX', hex: '#9896A4', name: 'Lilac gray' },
        { code: 'Granada sky - 16-4033 TCX', hex: '#5D81BB', name: 'Granada sky' },
        { code: 'Tree house - 17-0630 TCX', hex: '#988C75', name: 'Tree house' },
        { code: 'Chai tea - 17-0949 TCX', hex: '#B1832F', name: 'Chai tea' },
        { code: 'Roasted pecan - 17-1052 TCX', hex: '#93592B', name: 'Roasted pecan' },
        { code: 'Roasted cashew - 17-1105 TCX', hex: '#918579', name: 'Roasted cashew' },
        { code: 'Winter twig - 17-1108 TCX', hex: '#948A7A', name: 'Winter twig' },
        { code: 'Petrified oak - 17-1115 TCX', hex: '#8D7960', name: 'Petrified oak' },
        { code: 'Argan oil - 17-1142 TCX', hex: '#8B593E', name: 'Argan oil' },
        { code: 'Autumn maple - 17-1145 TCX', hex: '#C46215', name: 'Autumn maple' },
        { code: 'Sepia tint - 17-1314 TCX', hex: '#897560', name: 'Sepia tint' },
        { code: 'Spice route - 17-1345 TCX', hex: '#B95B3F', name: 'Spice route' },
        { code: 'Scarlet ibis - 17-1361 TCX', hex: '#F45520', name: 'Scarlet ibis' },
        { code: 'Summer fig - 17-1450 TCX', hex: '#BE4B3B', name: 'Summer fig' },
        { code: 'Moonscape - 17-1708 TCX', hex: '#725F69', name: 'Moonscape' },
        { code: 'Fruit dove - 17-1926 TCX', hex: '#CE5B78', name: 'Fruit dove' },
        { code: 'Pink yarrow - 17-2034 TCX', hex: '#CE3175', name: 'Pink yarrow' },
        { code: 'Toadstool - 17-2411 TCX', hex: '#988088', name: 'Toadstool' },
        { code: 'Bodacious - 17-3240 TCX', hex: '#B76BA3', name: 'Bodacious' },
        { code: 'Diffused orchid - 17-3520 TCX', hex: '#9879A2', name: 'Diffused orchid' },
        { code: 'Fairy wren - 17-3640 TCX', hex: '#9479AF', name: 'Fairy wren' },
        { code: 'Sunlit allium - 17-3735 TCX', hex: '#9787BB', name: 'Sunlit allium' },
        { code: 'Sharkskin - 17-3914 TCX', hex: '#838487', name: 'Sharkskin' },
        { code: 'Pale iris - 17-3929 TCX', hex: '#8895C5', name: 'Pale iris' },
        { code: 'Iolite - 17-3940 TCX', hex: '#707BB4', name: 'Iolite' },
        { code: 'Gray flannel - 17-4016 TCX', hex: '#848182', name: 'Gray flannel' },
        { code: 'Riverside - 17-4028 TCX', hex: '#4C6A92', name: 'Riverside' },
        { code: 'Quiet harbor - 17-4029 TCX', hex: '#5A789A', name: 'Quiet harbor' },
        { code: 'Lichen blue - 17-4032 TCX', hex: '#5D89B3', name: 'Lichen blue' },
        { code: 'Pacific coast - 17-4033 TCX', hex: '#5480AC', name: 'Pacific coast' },
        { code: 'Ibiza blue - 17-4245 TCX', hex: '#007CB7', name: 'Ibiza blue' },
        { code: 'Navagio bay - 17-4429 TCX', hex: '#3183A0', name: 'Navagio bay' },
        { code: 'Barrier reef - 17-4530 TCX', hex: '#0084A1', name: 'Barrier reef' },
        { code: 'Guacamole - 17-0530 TCX', hex: '#797B3A', name: 'Guacamole' },
        { code: 'Kale - 18-0107 TCX', hex: '#5A7247', name: 'Kale' },
        { code: 'Mayfly - 18-0220 TCX', hex: '#65663F', name: 'Mayfly' },
        { code: 'Twist of lime - 18-0330 TCX', hex: '#4E632C', name: 'Twist of lime' },
        { code: 'Martini olive - 18-0625 TCX', hex: '#716A4D', name: 'Martini olive' },
        { code: 'Emperador - 18-1028 TCX', hex: '#684832', name: 'Emperador' },
        { code: 'Thai curry - 18-1049 TCX', hex: '#AB6819', name: 'Thai curry' },
        { code: 'Honey ginger - 18-1050 TCX', hex: '#A86217', name: 'Honey ginger' },
        { code: 'Sugar almond - 18-1155 TCX', hex: '#935529', name: 'Sugar almond' },
        { code: 'Spiced apple - 18-1325 TCX', hex: '#783937', name: 'Spiced apple' },
        { code: 'Chili oil - 18-1440 TCX', hex: '#8E3C36', name: 'Chili oil' },
        { code: 'Plum truffle - 18-1506 TCX', hex: '#675657', name: 'Plum truffle' },
        { code: 'Brandy brown - 18-1541 TCX', hex: '#73362A', name: 'Brandy brown' },
        { code: 'Valiant poppy - 18-1549 TCX', hex: '#BC322C', name: 'Valiant poppy' },
        { code: 'Aura orange - 18-1551 TCX', hex: '#B4262A', name: 'Aura orange' },
        { code: 'Toreador - 18-1653 TCX', hex: '#B61032', name: 'Toreador' },
        { code: 'Lychee - 18-1654 TCX', hex: '#BA0B32', name: 'Lychee' },
        { code: 'Goji berry - 18-1659 TCX', hex: '#B91228', name: 'Goji berry' },
        { code: 'Arctic dusk - 18-1705 TCX', hex: '#735B6A', name: 'Arctic dusk' },
        { code: 'Ephemera - 18-1708 TCX', hex: '#6F5965', name: 'Ephemera' },
        { code: 'Jalapeno red - 18-1759 TCX', hex: '#B2103C', name: 'Jalapeno red' },
        { code: 'Love potion - 18-1951 TCX', hex: '#C01352', name: 'Love potion' },
        { code: 'Pink peacock - 18-2045 TCX', hex: '#C62168', name: 'Pink peacock' },
        { code: 'Grape kiss - 18-3014 TCX', hex: '#7B4368', name: 'Grape kiss' },
        { code: 'Willowherb - 18-3120 TCX', hex: '#8E4483', name: 'Willowherb' },
        { code: 'Charisma - 18-3340 TCX', hex: '#632A60', name: 'Charisma' },
        { code: 'Plum jam - 18-3521 TCX', hex: '#624076', name: 'Plum jam' },
        { code: 'Lavender crystal - 18-3530 TCX', hex: '#936A98', name: 'Lavender crystal' },
        { code: 'Purple sapphire - 18-3540 TCX', hex: '#6F4685', name: 'Purple sapphire' },
        { code: 'Chive blossom - 18-3634 TCX', hex: '#7D5D99', name: 'Chive blossom' },
        { code: 'Purple corallite - 18-3839 TCX', hex: '#5A4E8F', name: 'Purple corallite' },
        { code: 'Volcanic glass - 18-3908 TCX', hex: '#615C60', name: 'Volcanic glass' },
        { code: 'Gray blue - 18-3917 TCX', hex: '#4D587A', name: 'Gray blue' },
        { code: 'Blue horizon - 18-3929 TCX', hex: '#4E6482', name: 'Blue horizon' },
        { code: 'Iris bloom - 18-3950 TCX', hex: '#5B609E', name: 'Iris bloom' },
        { code: 'Nebulas blue - 18-4048 TCX', hex: '#2D62A3', name: 'Nebulas blue' },
        { code: 'Indigo bunting - 18-4250 TCX', hex: '#006CA9', name: 'Indigo bunting' },
        { code: 'Fjord blue - 18-4430 TCX', hex: '#007290', name: 'Fjord blue' },
        { code: 'Hawaiian surf - 18-4538 TCX', hex: '#0078A7', name: 'Hawaiian surf' },
        { code: 'Tahitian tide - 18-4630 TCX', hex: '#006B7E', name: 'Tahitian tide' },
        { code: 'Quetzal green - 18-5025 TCX', hex: '#006865', name: 'Quetzal green' },
        { code: 'Granite gray - 18-5204 TCX', hex: '#615E5F', name: 'Granite gray' },
        { code: 'Lush meadow - 18-5845 TCX', hex: '#006E51', name: 'Lush meadow' },
        { code: 'Gray pinstripe - 19-0203 TCX', hex: '#49494D', name: 'Gray pinstripe' },
        { code: 'Sea turtle - 19-0403 TCX', hex: '#5E5749', name: 'Sea turtle' },
        { code: 'Deep depths - 19-0413 TCX', hex: '#46483C', name: 'Deep depths' },
        { code: 'Kalamata - 19-0510 TCX', hex: '#5F5B4C', name: 'Kalamata' },
        { code: 'Crocodile - 19-0823 TCX', hex: '#5D5348', name: 'Crocodile' },
        { code: 'Chocolate plum - 19-1110 TCX', hex: '#3C2D2E', name: 'Chocolate plum' },
        { code: 'Chocolate lab - 19-1214 TCX', hex: '#5C3E35', name: 'Chocolate lab' },
        { code: 'Shaved chocolate - 19-1215 TCX', hex: '#543B35', name: 'Shaved chocolate' },
        { code: 'Fondue fudge - 19-1224 TCX', hex: '#5D4236', name: 'Fondue fudge' },
        { code: 'Tiramisu - 19-1233 TCX', hex: '#634235', name: 'Tiramisu' },
        { code: 'Rocky road - 19-1234 TCX', hex: '#5A3E36', name: 'Rocky road' },
        { code: 'Chicory coffee - 19-1419 TCX', hex: '#4A342E', name: 'Chicory coffee' },
        { code: 'Smoked paprika - 19-1429 TCX', hex: '#6E362C', name: 'Smoked paprika' },
        { code: 'Chocolate fondant - 19-1432 TCX', hex: '#56352D', name: 'Chocolate fondant' },
        { code: 'Cherry mahogany - 19-1435 TCX', hex: '#66352B', name: 'Cherry mahogany' },
        { code: 'Merlot - 19-1534 TCX', hex: '#72262C', name: 'Merlot' },
        { code: 'Red pear - 19-1536 TCX', hex: '#7B3539', name: 'Red pear' },
        { code: 'Pickled beet - 19-2420 TCX', hex: '#4D233D', name: 'Pickled beet' },
        { code: 'Plum caspia - 19-2429 TCX', hex: '#61224A', name: 'Plum caspia' },
        { code: 'Winter bloom - 19-2620 TCX', hex: '#47243B', name: 'Winter bloom' },
        { code: 'Spiced plum - 19-3425 TCX', hex: '#6D4773', name: 'Spiced plum' },
        { code: 'Violet indigo - 19-3750 TCX', hex: '#3E285C', name: 'Violet indigo' },
        { code: 'Maritime blue - 19-3831 TCX', hex: '#27293D', name: 'Maritime blue' },
        { code: 'Obsidian - 19-3902 TCX', hex: '#3A363B', name: 'Obsidian' },
        { code: 'Black beauty - 19-3911 TCX', hex: '#26262A', name: 'Black beauty' },
        { code: 'Blackened pearl - 19-3917 TCX', hex: '#4D4B50', name: 'Blackened pearl' },
        { code: 'Odyssey gray - 19-3930 TCX', hex: '#434452', name: 'Odyssey gray' },
        { code: 'Black onyx - 19-4003 TCX', hex: '#2B272B', name: 'Black onyx' },
        { code: 'Navy peony - 19-4029 TCX', hex: '#223A5E', name: 'Navy peony' },
        { code: 'Sargasso sea - 19-4031 TCX', hex: '#35435A', name: 'Sargasso sea' },
        { code: 'Sailor blue - 19-4034 TCX', hex: '#0E3A53', name: 'Sailor blue' },
        { code: 'Gibraltar sea - 19-4038 TCX', hex: '#123850', name: 'Gibraltar sea' },
        { code: 'Lapis blue - 19-4045 TCX', hex: '#004B8D', name: 'Lapis blue' },
        { code: 'Baleine blue - 19-4048 TCX', hex: '#155187', name: 'Baleine blue' },
        { code: 'Galaxy blue - 19-4055 TCX', hex: '#2A4B7C', name: 'Galaxy blue' },
        { code: 'Blue opal - 19-4120 TCX', hex: '#0F3B57', name: 'Blue opal' },
        { code: 'Moonlit ocean - 19-4122 TCX', hex: '#293B4D', name: 'Moonlit ocean' },
        { code: 'Deep dive - 19-4126 TCX', hex: '#29495C', name: 'Deep dive' },
        { code: 'Crystal teal - 19-4536 TCX', hex: '#00637C', name: 'Crystal teal' },
        { code: 'Deep lagoon - 19-4540 TCX', hex: '#005265', name: 'Deep lagoon' },
        { code: 'Sea moss - 19-5030 TCX', hex: '#254445', name: 'Sea moss' },
        { code: 'Forest biome - 19-5230 TCX', hex: '#184A45', name: 'Forest biome' },
        { code: 'Rain forest - 19-5232 TCX', hex: '#15463E', name: 'Rain forest' }
      ];
      
      // Convert hex to RGB
      const hexToRgb = (hex) => {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return { r, g, b };
      };
      
      const targetRgb = hexToRgb(hexColor);
      const colorDistances = [];
      
      // Calculate distances for all colors
      pantoneColors.forEach(pantoneColor => {
        const pantoneRgb = hexToRgb(pantoneColor.hex);
        const distance = Math.sqrt(
          Math.pow(targetRgb.r - pantoneRgb.r, 2) +
          Math.pow(targetRgb.g - pantoneRgb.g, 2) +
          Math.pow(targetRgb.b - pantoneRgb.b, 2)
        );
        
        colorDistances.push({
          ...pantoneColor,
          distance: distance
        });
      });
      
      // Sort by distance and return top matches
      colorDistances.sort((a, b) => a.distance - b.distance);
      
      return colorDistances.slice(0, count).map(color => ({
        code: color.code,
        hex: color.hex,
        confidence: Math.max(Math.round(100 - (color.distance / 441.673) * 100), 65)
      }));
    }

    // Validate Pantone selection for single-select system
    validatePantoneSelection(colorway) {
      const pantoneButtons = colorway.querySelector('.techpack-pantone-buttons');
      const pantoneValidationMsg = colorway.querySelector('.techpack-pantone-validation-message');
      
      if (!pantoneButtons || !pantoneValidationMsg) return true;
      
      const selectedButtons = pantoneButtons.querySelectorAll('button.techpack-btn--pantone-compact.selected');
      const hasValidPantone = selectedButtons.length === 1; // Exactly one selection required
      
      if (hasValidPantone) {
        const selectedPantone = selectedButtons[0].dataset.pantoneCode;
        pantoneValidationMsg.textContent = `✓ PANTONE ${selectedPantone} selected`;
        pantoneValidationMsg.className = 'techpack-pantone-validation-message success';
        pantoneValidationMsg.style.display = 'block';
        pantoneValidationMsg.style.cssText = 'color: #10b981; font-size: 0.875rem; margin-top: 0.5rem; display: block;';
      } else {
        pantoneValidationMsg.textContent = 'Please select one PANTONE color option.';
        pantoneValidationMsg.className = 'techpack-pantone-validation-message error';
        pantoneValidationMsg.style.display = 'block';
        pantoneValidationMsg.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.5rem; display: block;';
      }
      
      return hasValidPantone;
    }

    updateColorwayPantoneData(garmentId, colorwayId) {
      const colorway = document.querySelector(`[data-colorway-id="${colorwayId}"]`);
      const pantoneButtons = colorway.querySelector('.techpack-pantone-buttons');
      
      if (!pantoneButtons) return;
      
      const selectedButtons = pantoneButtons.querySelectorAll('button.techpack-btn--pantone-compact.selected');
      const selectedPantone = selectedButtons.length > 0 ? {
        code: selectedButtons[0].dataset.pantoneCode,
        hex: selectedButtons[0].dataset.pantoneHex
      } : null;
      
      // Update state - single pantone selection
      const garmentData = state.formData.garments.find(g => g.id === garmentId);
      if (garmentData) {
        const colorwayData = garmentData.colorways.find(c => c.id === colorwayId);
        if (colorwayData) {
          colorwayData.selectedPantone = selectedPantone; // Single selection
          colorwayData.selectedPantones = selectedPantone ? [selectedPantone] : []; // Keep array for compatibility
        }
      }
    }

    removeColorway(garmentId, colorwayId) {
      const colorway = document.querySelector(`[data-colorway-id="${colorwayId}"]`);
      const garment = document.querySelector(`[data-garment-id="${garmentId}"]`);
      
      if (!colorway || !garment) return;

      const colorways = garment.querySelectorAll('.techpack-colorway');
      if (colorways.length <= 1) {
        debugSystem.log('Cannot remove last colorway', null, 'warn');
        return;
      }

      // CRITICAL: Update state immediately before DOM removal
      const garmentData = state.formData.garments.find(g => g.id === garmentId);
      if (garmentData) {
        garmentData.colorways = garmentData.colorways.filter(c => c.id !== colorwayId);
      }

      animationManager.fadeOut(colorway).then(() => {
        colorway.remove();
        
        // Recalculate and validate after DOM is updated
        setTimeout(() => {
          quantityCalculator.calculateAndUpdateProgress();
          // FIXED: Update colorway validation messages when colorway count changes
          quantityCalculator.updateColorwayValidationMessages();
          stepManager.validateStep3();
        }, 200);
      }, 50);
      
      debugSystem.log('Colorway removed', { garmentId, colorwayId });
    }
  } // End of GarmentManager class

  // Enhanced Form Initialization
  class FormInitializer {
    constructor() {
      this.initialized = false;
    }

    init() {
      if (this.initialized) return;
      
      debugSystem.log('Initializing TechPack Application');
      
      // Setup client verification modal
      this.setupClientModal();
      
      // EXISTING: Keep all your existing setup methods
      this.setupPhoneFormatting();
      this.setupProductionTypeListener();
      this.setupRequestTypeListener();
      this.setupNavigationButtons();
      this.setupFormSubmission();
      this.setupVATFormatting();
      this.setupRegistrationCheck();
      
      // NEW: Add real-time Step 1 validation
      this.setupStep1RealTimeValidation();
      
      // CHANGED: Initialize with registration check (step 0) instead of step 1
      this.showStep(0);
      
      this.initialized = true;
      debugSystem.log('TechPack Application initialized successfully', null, 'success');
    }

    // Add real-time validation for Step 1 form fields
    setupStep1RealTimeValidation() {
      const step1Form = document.querySelector('#techpack-step-1 form');
      if (!step1Form) return;

      // Get all required form fields that need real-time validation
      const requiredFields = [
        'client-name',
        'company-name', 
        'email',
        'country',
        'production-type'
      ];

      requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
          // Add event listeners for real-time validation
          field.addEventListener('input', () => {
            // Small delay to avoid too frequent validation calls
            clearTimeout(this.validationTimeout);
            this.validationTimeout = setTimeout(() => {
              stepManager.validateStep1();
            }, 300);
          });
          
          field.addEventListener('change', () => {
            // Immediate validation on change events
            stepManager.validateStep1();
          });
          
          // For select elements, also listen to blur events
          if (field.tagName === 'SELECT') {
            field.addEventListener('blur', () => {
              stepManager.validateStep1();
            });
          }
        }
      });

      debugSystem.log('Step 1 real-time validation setup completed');
      
      // Initialize Next button as disabled until all fields are valid
      const nextBtn = document.getElementById('step-1-next');
      if (nextBtn) {
        nextBtn.disabled = true;
        nextBtn.classList.add('techpack-btn--disabled');
        
        // Run initial validation to set correct state
        setTimeout(() => {
          stepManager.validateStep1();
        }, 100);
      }
    }

// ENHANCED: Registration setup with comprehensive error handling and user feedback
    setupClientModal() {
      debugSystem.log('🔧 Setting up client verification and submission type modals...');
      
      // Client Verification Modal Elements
      const modal = document.querySelector('#client-verification-modal');
      const openBtn = document.querySelector('#open-client-modal');
      const closeBtn = document.querySelector('#close-client-modal');
      const backdrop = document.querySelector('.techpack-modal__backdrop');
      
      // Submission Type Modal Elements
      const submissionModal = document.querySelector('#submission-type-modal');
      const closeSubmissionBtn = document.querySelector('#close-submission-modal');
      const submissionBackdrop = submissionModal?.querySelector('.techpack-modal__backdrop');
      
      // Client registration buttons (updated selectors)
      const registrationYesBtn = document.querySelector('#registration-yes-btn');
      const registrationNoBtn = document.querySelector('#registration-no-btn');
      
      // Submission type buttons
      const quotationBtn = document.querySelector('#quotation-btn');
      const sampleBtn = document.querySelector('#sample-btn');
      const bulkBtn = document.querySelector('#bulk-btn');
      
      if (!modal || !openBtn) {
        debugSystem.log('❌ Modal elements not found, skipping modal setup', null, 'error');
        this.showStep(1); // Fallback to step 1
        return;
      }

      // Open client verification modal
      openBtn?.addEventListener('click', () => {
        this.showModal(modal);
        debugSystem.log('Client verification modal opened');
      });

      // Close client verification modal
      closeBtn?.addEventListener('click', () => {
        this.hideModal(modal);
      });
      
      backdrop?.addEventListener('click', () => {
        this.hideModal(modal);
      });

      // Client registration selection - leads to submission type modal
      registrationYesBtn?.addEventListener('click', () => {
        state.formData.isRegisteredClient = true;
        this.hideModal(modal);
        
        setTimeout(() => {
          this.showSubmissionTypeModal();
        }, 300);
        debugSystem.log('Registered client selected');
      });

      registrationNoBtn?.addEventListener('click', () => {
        state.formData.isRegisteredClient = false;
        this.hideModal(modal);
        setTimeout(() => {
          this.showSubmissionTypeModal();
        }, 300);
        debugSystem.log('New client selected');
      });

      // Submission type modal controls
      closeSubmissionBtn?.addEventListener('click', () => {
        this.hideModal(submissionModal);
      });
      
      submissionBackdrop?.addEventListener('click', () => {
        this.hideModal(submissionModal);
      });

      // Submission type selection
      quotationBtn?.addEventListener('click', () => {
        this.selectSubmissionType('quotation');
      });

      sampleBtn?.addEventListener('click', () => {
        this.selectSubmissionType('sample-request');
      });

      bulkBtn?.addEventListener('click', () => {
        this.selectSubmissionType('bulk-order-request');
      });
    }

    // Show submission type selection modal
    showSubmissionTypeModal() {
      const submissionModal = document.querySelector('#submission-type-modal');
      if (submissionModal) {
        // Show/hide registration notice based on client type
        const registrationNotice = document.getElementById('registration-notice');
        if (registrationNotice) {
          if (state.formData.isRegisteredClient) {
            registrationNotice.style.display = 'flex';
          } else {
            registrationNotice.style.display = 'none';
          }
        }
        
        this.showModal(submissionModal);
        debugSystem.log('Submission type modal opened');
      } else {
        debugSystem.log('❌ Submission type modal not found in DOM', null, 'error');
      }
    }

    // Handle submission type selection
    selectSubmissionType(type) {
      state.formData.requestType = type;
      const submissionModal = document.querySelector('#submission-type-modal');
      
      // Hide submission modal and proceed to Step 1
      this.hideModal(submissionModal);
      
      setTimeout(() => {
        // Configure Step 1 based on client type BEFORE showing it
        if (state.formData.isRegisteredClient) {
          this.configureStep1ForRegisteredClient();
          debugSystem.log('Configured Step 1 for registered client');
        } else {
          this.configureStep1ForNewClient();
          debugSystem.log('Configured Step 1 for new client');
        }
        
        this.showStep(1);
        debugSystem.log(`Submission type selected: ${type}`);
        
        // Update UI based on submission type
        this.updateUIForSubmissionType(type);
      }, 300);
    }

    // Update UI elements based on submission type
    updateUIForSubmissionType(type) {
      const subtitle = document.getElementById('client-info-subtitle');
      
      switch(type) {
        case 'quotation':
          if (subtitle) subtitle.textContent = 'Provide your details to receive accurate pricing estimates';
          break;
        case 'sample-request':
          if (subtitle) subtitle.textContent = 'Enter your information to begin sample development';
          break;
        case 'bulk-order-request':
          if (subtitle) subtitle.textContent = 'Submit your details for bulk production planning';
          break;
      }

      // Set data attribute on Step 3 section for CSS targeting
      const step3Section = document.getElementById('techpack-step-3');
      if (step3Section) {
        step3Section.setAttribute('data-request-type', type);
      }

      // Update Step 3 layout using existing checkRequestType logic
      if (window.sampleManager && typeof window.sampleManager.checkRequestType === 'function') {
        window.sampleManager.checkRequestType();
      }
    }

    // Handle change submission type - preserves Step 1 data, resets everything else
    changeSubmissionType() {
      // Preserve current Step 1 form data
      const step1Data = this.preserveStep1Data();
      
      // Reset form state except Step 1
      this.resetFormStateExceptStep1();
      
      // Show submission type modal again
      this.showSubmissionTypeModal();
      
      // Restore Step 1 data after a brief delay
      setTimeout(() => {
        this.restoreStep1Data(step1Data);
      }, 100);
      
      debugSystem.log('🔄 Changing submission type - Step 1 data preserved');
    }

    // Preserve current Step 1 form data
    preserveStep1Data() {
      const step1Form = document.querySelector('#techpack-step-1 .techpack-form');
      if (!step1Form) return {};

      const formData = {};
      const formElements = step1Form.querySelectorAll('input, select, textarea');
      
      formElements.forEach(element => {
        if (element.type === 'checkbox' || element.type === 'radio') {
          formData[element.name || element.id] = element.checked;
        } else {
          formData[element.name || element.id] = element.value;
        }
      });

      debugSystem.log('💾 Step 1 data preserved', formData);
      return formData;
    }

    // Reset form state except Step 1
    resetFormStateExceptStep1() {
      // Reset state data except clientInfo
      const preservedClientInfo = { ...state.formData.clientInfo };
      const preservedIsRegistered = state.formData.isRegisteredClient;
      
      // Reset state
      state.formData = {
        isRegisteredClient: preservedIsRegistered,
        clientInfo: preservedClientInfo,
        requestType: null, // This will be set again when user selects
        files: [],
        garments: [],
        totalQuantity: 0,
        totalCost: 0,
        submissionId: Date.now()
      };
      
      // Reset step progress
      state.currentStep = 1;
      
      // Clear any step 2 and step 3 data from DOM
      this.clearStep2Data();
      this.clearStep3Data();
      
      debugSystem.log('🔄 Form state reset except Step 1');
    }

    // Restore Step 1 data to form fields
    restoreStep1Data(formData) {
      if (!formData || Object.keys(formData).length === 0) return;

      const step1Form = document.querySelector('#techpack-step-1 .techpack-form');
      if (!step1Form) return;

      Object.entries(formData).forEach(([key, value]) => {
        const element = step1Form.querySelector(`[name="${key}"], #${key}`);
        if (element) {
          if (element.type === 'checkbox' || element.type === 'radio') {
            element.checked = value;
          } else {
            element.value = value;
          }
        }
      });

      // Re-run validation to update button states
      setTimeout(() => {
        stepManager.validateStep1();
      }, 50);

      debugSystem.log('✅ Step 1 data restored to form');
    }

    // Clear Step 2 data
    clearStep2Data() {
      // Clear file upload area
      const fileList = document.querySelector('#file-list');
      if (fileList) fileList.innerHTML = '';
      
      const fileCounter = document.querySelector('#file-counter');
      if (fileCounter) fileCounter.textContent = '0 files uploaded';
      
      debugSystem.log('🗑️ Step 2 data cleared');
    }

    // Clear Step 3 data
    clearStep3Data() {
      // Clear garments container
      const garmentsContainer = document.querySelector('#garments-container');
      if (garmentsContainer) garmentsContainer.innerHTML = '';
      
      // Reset quantity tracker
      const totalQuantity = document.querySelector('#total-quantity');
      const quantityProgress = document.querySelector('#quantity-progress');
      if (totalQuantity) totalQuantity.textContent = '0';
      if (quantityProgress) quantityProgress.style.width = '0%';
      
      debugSystem.log('🗑️ Step 3 data cleared');
    }

    // Generic modal show/hide functions
    showModal(modal) {
      if (modal) {
        modal.style.display = 'flex'; // Use flex for centering
        setTimeout(() => modal.classList.add('active'), 10);
      }
    }

    hideModal(modal) {
      if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
      }
    }

    // Initialize form phone formatting
    setupPhoneFormatting() {
    const phoneInput = document.getElementById('phone');
      if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
          e.target.value = Utils.formatPhoneNumber(e.target.value);
        });
      }
    }

    setupVATFormatting() {
      const vatInput = document.getElementById('vat-ein');
      if (vatInput) {
        vatInput.addEventListener('input', (e) => {
          e.target.value = Utils.formatVATNumber(e.target.value);
        });
      }
    }

    setupRegistrationCheck() {
      debugSystem.log('🔧 Setting up registration check functionality...');
      
      // Helper function to set button states
      const setButtonState = (button, state) => {
        if (!button) return;
        
        button.disabled = state === 'loading';
        
        // Remove existing state classes
        button.classList.remove('loading', 'normal', 'success', 'error');
        
        // Add new state class
        button.classList.add(state);
        
        // Update button text based on state
        if (state === 'loading') {
          button.textContent = 'Processing...';
        } else if (state === 'normal') {
          // Restore original text
          const originalText = button.getAttribute('data-original-text');
          if (originalText) {
            button.textContent = originalText;
          }
        }
      };
      
      // Helper function to show status messages
      const showStatus = (message, type = 'info') => {
        const statusDiv = document.querySelector('.techpack-status-message') || this.createStatusDiv();
        
        if (statusDiv) {
          statusDiv.textContent = message;
          statusDiv.className = `techpack-status-message ${type}`;
          statusDiv.style.display = 'block';
          
          // Auto-hide after 5 seconds for success messages
          if (type === 'success') {
            setTimeout(() => {
              statusDiv.style.display = 'none';
            }, 5000);
          }
        }
      };
      
      // Helper function to hide status messages
      const hideStatus = () => {
        try {
          const statusDiv = document.querySelector('.techpack-status-message');
          if (statusDiv) {
            statusDiv.style.display = 'none';
          }
        } catch (error) {
          debugSystem.log('⚠️ Status hide failed:', error, 'warn');
        }
      };
      
      // Helper function to find required DOM elements
      const findElements = () => {
        return {
          yesBtn: document.querySelector('#registration-yes-btn, .registration-yes-btn, [data-registration="yes"]'),
          noBtn: document.querySelector('#registration-no-btn, .registration-no-btn, [data-registration="no"]'),
          warningDiv: document.querySelector('.registration-warning, .techpack-warning')
        };
      };
      
      // Helper function to setup button handlers
      const setupButtonHandlers = (elements) => {
        const { yesBtn, noBtn, warningDiv } = elements;
        
        if (!yesBtn || !noBtn) {
          debugSystem.log('❌ Registration buttons not found', { yesBtn: !!yesBtn, noBtn: !!noBtn }, 'error');
          return false;
        }
        
        // Registration button handlers are already set up earlier in setupClientModal()

        debugSystem.log('✅ Registration check event listeners attached successfully');
        return true;
      };

      // Try immediate setup first
      const elements = findElements();
      if (setupButtonHandlers(elements)) {
        return;
      }

      // Retry mechanism with progressive delays
      let retryCount = 0;
      const maxRetries = 5;
      const retryDelays = [100, 250, 500, 1000, 2000];

      const retrySetup = () => {
        if (retryCount >= maxRetries) {
          debugSystem.log('❌ Registration button setup failed after all retries - continuing without registration check', null, 'error');
          // Force navigation to step 1 as fallback
          setTimeout(() => {
            stepManager.navigateToStep(1);
          }, 500);
          return;
        }

        setTimeout(() => {
          debugSystem.log(`🔄 Retry attempt ${retryCount + 1}/${maxRetries} for registration setup`);
          const retryElements = findElements();
          if (setupButtonHandlers(retryElements)) {
            debugSystem.log('✅ Registration setup successful after retry');
            return;
          }
          retryCount++;
          retrySetup();
        }, retryDelays[retryCount]);
      };

      retrySetup();
    }
    
    createStatusDiv() {
      const statusDiv = document.createElement('div');
      statusDiv.className = 'techpack-status-message';
      statusDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 4px;
        font-weight: 500;
        z-index: 10000;
        display: none;
        max-width: 300px;
        word-wrap: break-word;
      `;
      
      // Add to body
      document.body.appendChild(statusDiv);
      return statusDiv;
    }
    
    closeClientModal() {
      const modal = document.querySelector('#client-verification-modal');
      if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
        debugSystem.log('Client verification modal closed');
      }
    }
    
    showWarningPopup(title, message, type = 'warning') {
      // Remove any existing warning popup
      this.hideWarningPopup();
      
      // Create warning popup element
      const popup = document.createElement('div');
      popup.className = `techpack-warning-popup techpack-warning-popup--${type}`;
      popup.innerHTML = `
        <div class="techpack-warning-popup__backdrop"></div>
        <div class="techpack-warning-popup__content">
          <div class="techpack-warning-popup__header">
            <div class="techpack-warning-popup__icon">
              ${type === 'warning' ? `
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M12 2L2 20h20L12 2zm0 6v6m0 2v2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
                </svg>
              ` : type === 'error' ? `
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                  <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
                  <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
                </svg>
              ` : `
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path d="9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              `}
            </div>
            <h3 class="techpack-warning-popup__title">${title}</h3>
            <button type="button" class="techpack-warning-popup__close" onclick="this.closest('.techpack-warning-popup').remove()">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M15 5L5 15m0-10l10 10" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
          <div class="techpack-warning-popup__body">
            <p class="techpack-warning-popup__message">${message}</p>
          </div>
        </div>
      `;
      
      // Add to body
      document.body.appendChild(popup);
      
      // Show with animation
      setTimeout(() => popup.classList.add('show'), 10);
      
      // Auto-close after 5 seconds
      setTimeout(() => {
        if (popup.parentNode) {
          popup.classList.remove('show');
          setTimeout(() => popup.remove(), 300);
        }
      }, 5000);
      
      // Close on backdrop click
      popup.querySelector('.techpack-warning-popup__backdrop').addEventListener('click', () => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
      });
      
      debugSystem.log(`Warning popup shown: ${title}`, { type, message });
    }
    
    hideWarningPopup() {
      const existingPopup = document.querySelector('.techpack-warning-popup');
      if (existingPopup) {
        existingPopup.classList.remove('show');
        setTimeout(() => existingPopup.remove(), 300);
      }
    }

    showStep(stepNumber) {
      const steps = document.querySelectorAll('.techpack-step');
      
      steps.forEach(step => {
        step.style.display = 'none';
      });
      
      // Handle step 0 (registration check)
      if (stepNumber === 0) {
        const step0 = document.querySelector('#techpack-step-0');
        if (step0) {
          step0.style.display = 'block';
          state.currentStep = 0;
          debugSystem.log('Showing registration check (step 0)');
          return;
        } else {
          debugSystem.log('Step 0 (registration check) not found, falling back to step 1', null, 'warn');
          stepNumber = 1; // Fallback to step 1 if step 0 doesn't exist
        }
      }
      
      // Handle regular steps (1-4)
      const targetStep = document.querySelector(`[data-step="${stepNumber}"]`);
      if (targetStep) {
        targetStep.style.display = 'block';
        state.currentStep = stepNumber;
        
        // EXISTING: Keep your exact step-specific logic
        if (stepNumber === 2) {
          stepManager.syncStep2DOM();
        } else if (stepNumber === 3) {
          stepManager.refreshStep3Interface();
        } else if (stepNumber === 4) {
          stepManager.populateReview();
        }
        
        debugSystem.log('Showing step', { stepNumber });
      } else {
        debugSystem.log('Target step not found', { stepNumber }, 'error');
      }
    }

    // NEW: Configure Step 1 for registered clients
    configureStep1ForRegisteredClient() {
      // Hide unnecessary fields for registered clients
      const fieldsToHide = [
        '#client-name',
        '#vat-ein-group', 
        '#phone',
        '.techpack-form__country-wrapper'
      ];
      
      fieldsToHide.forEach(selector => {
        const field = document.querySelector(selector);
        if (field) {
          const formGroup = field.closest('.techpack-form__group');
          if (formGroup) {
            formGroup.style.display = 'none';
            // Remove required attributes for hidden fields
            const inputs = formGroup.querySelectorAll('input, select');
            inputs.forEach(input => {
              input.removeAttribute('required');
              input.removeAttribute('data-validate');
            });
          }
        }
      });

      // Move email field to row 1 to be side by side with company name
      const emailGroup = document.querySelector('#email').closest('.techpack-form__group');
      const companyGroup = document.querySelector('#company-name').closest('.techpack-form__group');
      
      if (emailGroup && companyGroup) {
        const row1 = companyGroup.closest('.techpack-form__row');
        const row2 = emailGroup.closest('.techpack-form__row');
        
        if (row1 && row2) {
          // Move email group to row 1
          row1.appendChild(emailGroup);
          
          // Hide row 2 if it's empty (after removing email and VAT/EIN)
          const remainingFieldsInRow2 = row2.querySelectorAll('.techpack-form__group:not([style*="display: none"])');
          if (remainingFieldsInRow2.length === 0) {
            row2.style.display = 'none';
          }
        }
      }

      // Update the title to indicate registered client
      const title = document.querySelector('#techpack-step-1 .techpack-title');
      if (title) {
        title.innerHTML = `
          Client Information 
          <span style="color: #059669; font-size: 0.875rem; font-weight: 500; margin-left: 0.5rem;">
            (Registered Client)
          </span>
        `;
      }

      // Add warning about verification
      const subtitle = document.querySelector('#techpack-step-1 .techpack-subtitle');
      if (subtitle) {
        subtitle.innerHTML = `
          Confirm your details below 
          <div style="background: #fef3cd; border: 1px solid #f59e0b; border-radius: 6px; padding: 0.75rem; margin-top: 1rem; font-size: 0.875rem; color: #92400e;">
            <strong>⚠️ Verification Required:</strong> Your submission will be validated against our client database. 
            Unregistered submissions will be automatically rejected.
          </div>
        `;
      }

      debugSystem.log('Configured Step 1 for registered client');
    }

    // NEW: Configure Step 1 for new clients
    configureStep1ForNewClient() {
      // Show all fields for new clients
      const fieldsToShow = [
        '#client-name',
        '#vat-ein-group',
        '#phone', 
        '.techpack-form__country-wrapper'
      ];
      
      fieldsToShow.forEach(selector => {
        const field = document.querySelector(selector);
        if (field) {
          const formGroup = field.closest('.techpack-form__group');
          if (formGroup) {
            formGroup.style.display = 'block';
            // Restore required attributes for required fields
            const requiredFields = ['clientName', 'country'];
            const inputs = formGroup.querySelectorAll('input, select');
            inputs.forEach(input => {
              if (requiredFields.includes(input.name)) {
                input.setAttribute('required', 'required');
                input.setAttribute('data-validate', 'required');
              }
            });
          }
        }
      });

      // Update the title to indicate new client
      const title = document.querySelector('#techpack-step-1 .techpack-title');
      if (title) {
        title.innerHTML = `
          Client Information 
          <span style="color: #3b82f6; font-size: 0.875rem; font-weight: 500; margin-left: 0.5rem;">
            (New Client)
          </span>
        `;
      }

      // Standard subtitle for new clients
      const subtitle = document.querySelector('#techpack-step-1 .techpack-subtitle');
      if (subtitle) {
        subtitle.textContent = 'Tell us about your project requirements';
      }

      debugSystem.log('Configured Step 1 for new client');
    }


    // EXISTING: Keep your exact setupPhoneFormatting method
    setupPhoneFormatting() {
      const phoneInput = document.getElementById('phone');
      if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
          e.target.value = Utils.formatPhoneNumber(e.target.value);
        });
      }
    }

    setupRequestTypeListener() {
      const requestTypeSelect = document.getElementById('request-type');
      if (requestTypeSelect) {
        requestTypeSelect.addEventListener('change', () => {
          // Update all existing colorways when request type changes
          const existingColorways = document.querySelectorAll('.techpack-colorway');
          existingColorways.forEach(colorway => {
            garmentManager.handleSizeGridBasedOnRequestType(colorway);
          });
          
          // Recalculate quantities and progress
          setTimeout(() => {
            quantityCalculator.calculateAndUpdateProgress();
            stepManager.validateStep3();
          }, 100);
          
          debugSystem.log('Request type changed, updated all colorways', { 
            requestType: requestTypeSelect.value,
            colorwayCount: existingColorways.length 
          });
        });
      }
    }

    // EXISTING: Keep your exact setupVATFormatting method
    setupVATFormatting() {
      const vatInput = document.getElementById('vat-ein');
      if (vatInput) {
        vatInput.addEventListener('input', (e) => {
          let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
          
          // Auto-format and limit length based on country patterns
          if (value.length >= 2) {
            const countryCode = value.substring(0, 2);
            
            // Apply country-specific formatting and limits (official EU formats)
            switch (countryCode) {
              case 'AT': // Austria: ATU + 8 digits = 11 total
                if (value.length > 2) {
                  value = 'ATU' + value.substring(3).replace(/\D/g, '');
                } else {
                  value = 'ATU';
                }
                if (value.length > 11) value = value.substring(0, 11);
                break;
              case 'BE': // Belgium: BE + 10 digits = 12 total (or BE0 + 9 digits)
                value = 'BE' + value.substring(2).replace(/\D/g, '');
                if (value.length > 12) value = value.substring(0, 12);
                break;
              case 'BG': // Bulgaria: BG + 9-10 digits = 11-12 total
                value = 'BG' + value.substring(2).replace(/\D/g, '');
                if (value.length > 12) value = value.substring(0, 12);
                break;
              case 'HR': // Croatia: HR + 11 digits = 13 total
                value = 'HR' + value.substring(2).replace(/\D/g, '');
                if (value.length > 13) value = value.substring(0, 13);
                break;
              case 'CY': // Cyprus: CY + 8 digits + 1 letter = 11 total
                value = 'CY' + value.substring(2);
                if (value.length > 11) value = value.substring(0, 11);
                break;
              case 'CZ': // Czech: CZ + 8-10 digits = 10-12 total
                value = 'CZ' + value.substring(2).replace(/\D/g, '');
                if (value.length > 12) value = value.substring(0, 12);
                break;
              case 'DK': // Denmark: DK + 8 digits = 10 total
                value = 'DK' + value.substring(2).replace(/\D/g, '');
                if (value.length > 10) value = value.substring(0, 10);
                break;
              case 'EE': // Estonia: EE + 9 digits = 11 total
                value = 'EE' + value.substring(2).replace(/\D/g, '');
                if (value.length > 11) value = value.substring(0, 11);
                break;
              case 'FI': // Finland: FI + 8 digits = 10 total
                value = 'FI' + value.substring(2).replace(/\D/g, '');
                if (value.length > 10) value = value.substring(0, 10);
                break;
              case 'FR': // France: FR + 2 chars + 9 digits = 13 total
                value = 'FR' + value.substring(2);
                if (value.length > 13) value = value.substring(0, 13);
                break;
              case 'DE': // Germany: DE + 9 digits = 11 total
                value = 'DE' + value.substring(2).replace(/\D/g, '');
                if (value.length > 11) value = value.substring(0, 11);
                break;
              case 'EL':
              case 'GR': // Greece: EL + 9 digits = 11 total
                value = 'EL' + value.substring(2).replace(/\D/g, '');
                if (value.length > 11) value = value.substring(0, 11);
                break;
              case 'HU': // Hungary: HU + 8 digits = 10 total
                value = 'HU' + value.substring(2).replace(/\D/g, '');
                if (value.length > 10) value = value.substring(0, 10);
                break;
              case 'IE': // Ireland: IE + 7 digits + 1-2 letters = 10-11 total
                value = 'IE' + value.substring(2);
                if (value.length > 11) value = value.substring(0, 11);
                break;
              case 'IT': // Italy: IT + 11 digits = 13 total
                value = 'IT' + value.substring(2).replace(/\D/g, '');
                if (value.length > 13) value = value.substring(0, 13);
                break;
              case 'LV': // Latvia: LV + 11 digits = 13 total
                value = 'LV' + value.substring(2).replace(/\D/g, '');
                if (value.length > 13) value = value.substring(0, 13);
                break;
              case 'LT': // Lithuania: LT + 9 or 12 digits = 11 or 14 total
                value = 'LT' + value.substring(2).replace(/\D/g, '');
                if (value.length > 14) value = value.substring(0, 14);
                break;
              case 'LU': // Luxembourg: LU + 8 digits = 10 total
                value = 'LU' + value.substring(2).replace(/\D/g, '');
                if (value.length > 10) value = value.substring(0, 10);
                break;
              case 'MT': // Malta: MT + 8 digits = 10 total
                value = 'MT' + value.substring(2).replace(/\D/g, '');
                if (value.length > 10) value = value.substring(0, 10);
                break;
              case 'NL': // Netherlands: NL + 9 digits + B + 2 digits = 14 total
                let nlValue = 'NL' + value.substring(2).replace(/[^0-9B]/g, '');
                if (nlValue.length > 14) nlValue = nlValue.substring(0, 14);
                value = nlValue;
                break;
              case 'NO': // Norway: NO + 9 digits + MVA = 14 total
                value = 'NO' + value.substring(2).replace(/[^0-9MVA]/g, '');
                if (value.length > 14) value = value.substring(0, 14);
                break;
              case 'PL': // Poland: PL + 10 digits = 12 total
                value = 'PL' + value.substring(2).replace(/\D/g, '');
                if (value.length > 12) value = value.substring(0, 12);
                break;
              case 'PT': // Portugal: PT + 9 digits = 11 total
                value = 'PT' + value.substring(2).replace(/\D/g, '');
                if (value.length > 11) value = value.substring(0, 11);
                break;
              case 'RO': // Romania: RO + 10 digits = 12 total
                value = 'RO' + value.substring(2).replace(/\D/g, '');
                if (value.length > 12) value = value.substring(0, 12);
                break;
              case 'SK': // Slovakia: SK + 10 digits = 12 total
                value = 'SK' + value.substring(2).replace(/\D/g, '');
                if (value.length > 12) value = value.substring(0, 12);
                break;
              case 'SI': // Slovenia: SI + 8 digits = 10 total
                value = 'SI' + value.substring(2).replace(/\D/g, '');
                if (value.length > 10) value = value.substring(0, 10);
                break;
              case 'ES': // Spain: ES + 9 chars total (letters allowed)
                value = 'ES' + value.substring(2);
                if (value.length > 11) value = value.substring(0, 11);
                break;
              case 'SE': // Sweden: SE + 12 digits = 14 total
                value = 'SE' + value.substring(2).replace(/\D/g, '');
                if (value.length > 14) value = value.substring(0, 14);
                break;
              case 'CH': // Switzerland: CHE + 9 digits + MWST/TVA/IVA
                if (value.startsWith('CHE')) {
                  value = 'CHE' + value.substring(3).replace(/[^0-9MWSTVAIV]/g, '');
                } else {
                  value = 'CHE';
                }
                if (value.length > 16) value = value.substring(0, 16);
                break;
              case 'GB': // UK: GB + 9 digits = 11 total
                value = 'GB' + value.substring(2).replace(/\D/g, '');
                if (value.length > 11) value = value.substring(0, 11);
                break;
              default:
                // Limit to 16 characters max for any VAT
                if (value.length > 16) value = value.substring(0, 16);
            }
          } else if (/^\d/.test(value)) {
            // For EIN (US): only digits, max 9
            value = value.replace(/\D/g, '');
            if (value.length > 9) value = value.substring(0, 9);
          }
          
          e.target.value = value;
          
          // Get selected country for context
          const countryInput = document.getElementById('country');
          const selectedCountry = countryInput?.value;
          const countryObj = COUNTRY_DATA.findByName(selectedCountry);
          
          // Real-time validation feedback
          const isValid = Utils.validateVAT(value, countryObj?.code);
          e.target.classList.toggle('techpack-form__input--error', value.length > 0 && !isValid);
          e.target.classList.toggle('techpack-form__input--success', value.length > 0 && isValid);
          
          // Show/hide error message with country-specific guidance
          const errorDiv = e.target.closest('.techpack-form__group')?.querySelector('.techpack-form__error');
          if (errorDiv) {
            if (value.length > 0 && !isValid) {
              const vatFormats = {
                'PT': 'Portuguese VAT: PT + 9 digits (e.g., PT123456789)',
                'ES': 'Spanish VAT: ES + letter + 7 digits + letter (e.g., ESA1234567A)',
                'DE': 'German VAT: DE + 9 digits (e.g., DE123456789)',
                'FR': 'French VAT: FR + 2 chars + 9 digits (e.g., FRAA123456789)',
                'IT': 'Italian VAT: IT + 11 digits (e.g., IT12345678901)',
                'NL': 'Dutch VAT: NL + 9 digits + B + 2 digits (e.g., NL123456789B01)',
                'BE': 'Belgian VAT: BE + 10 digits (e.g., BE0123456789)',
                'AT': 'Austrian VAT: ATU + 8 digits (e.g., ATU12345678)',
                'SE': 'Swedish VAT: SE + 12 digits (e.g., SE123456789012)',
                'US': 'US EIN: 9 digits only (e.g., 123456789)',
                'GB': 'UK VAT: GB + 9 digits (e.g., GB123456789)',
                'CH': 'Swiss VAT: CHE + 9 digits + MWST/TVA/IVA',
                'NO': 'Norwegian VAT: NO + 9 digits + MVA'
              };
              
              errorDiv.textContent = vatFormats[countryObj?.code] || 'Please enter a valid format for your country';
              errorDiv.style.display = 'block';
            } else {
              errorDiv.textContent = '';
              errorDiv.style.display = 'none';
            }
          }
        });
      }
    }

    // EXISTING: Keep your exact setupProductionTypeListener method
    setupProductionTypeListener() {
      const productionTypeSelect = document.querySelector('#production-type, select[name="productionType"]');
      if (!productionTypeSelect) return;

      productionTypeSelect.addEventListener('change', (e) => {
        const selectedType = e.target.value;
        debugSystem.log('Production type changed', { type: selectedType });
        
        if (state.formData.clientInfo) {
          state.formData.clientInfo.productionType = selectedType;
        }
        
        if (state.currentStep === 3) {
          stepManager.refreshStep3Interface();
        }
      });
    }

// EXISTING: Keep your exact setupNavigationButtons method
    setupNavigationButtons() {
      // Step 1
      const step1Next = document.querySelector('#step-1-next');
      if (step1Next) {
        step1Next.addEventListener('click', () => {
          stepManager.navigateToStep(2);
        });
      }

      // Change Submission Type button
      const changeSubmissionBtn = document.querySelector('#change-submission-type');
      if (changeSubmissionBtn) {
        changeSubmissionBtn.addEventListener('click', () => {
          this.changeSubmissionType();
        });
      }

      // Step 2
      const step2Prev = document.querySelector('#step-2-prev');
      const step2Next = document.querySelector('#step-2-next');
      
      if (step2Prev) {
        step2Prev.addEventListener('click', () => {
          stepManager.navigateToStep(1);
        });
      }
      if (step2Next) {
        step2Next.addEventListener('click', () => {
          stepManager.navigateToStep(3);
        });
      }

      // Step 3
      const step3Prev = document.querySelector('#step-3-prev');
      const step3Next = document.querySelector('#step-3-next');
      
      if (step3Prev) {
        step3Prev.addEventListener('click', () => {
          stepManager.navigateToStep(2);
        });
      }
      if (step3Next) {
        step3Next.addEventListener('click', () => {
          stepManager.navigateToStep(4);
        });
      }

      // Step 4
      const step4Prev = document.querySelector('#step-4-prev');
      if (step4Prev) {
        step4Prev.addEventListener('click', () => {
          stepManager.navigateToStep(3);
        });
      }

      // EDIT BUTTONS - Review Page
      this.setupEditButtons();
    }

    // EXISTING: Keep your exact setupEditButtons method
    setupEditButtons() {
      // Simple approach: Set up specific event listeners after review is populated
      setTimeout(() => {
        // Find all edit buttons and set up click handlers
        const editButtons = document.querySelectorAll('button');
        
        editButtons.forEach(button => {
          if (button.textContent.toLowerCase().includes('edit')) {
            button.onclick = (e) => {
              e.preventDefault();
              
              // Determine step by checking the surrounding content more broadly
              let targetStep = 1; // Default
              
              // Check multiple levels up to find the right context
              let currentElement = button;
              let found = false;
              
              // Walk up the DOM tree to find context
              for (let i = 0; i < 10 && currentElement && !found; i++) {
                const allText = currentElement.textContent ? currentElement.textContent.toLowerCase() : '';
                
                // More specific checks
                if (allText.includes('client information') || 
                    (allText.includes('client') && allText.includes('name')) ||
                    (allText.includes('company') && allText.includes('name')) ||
                    allText.includes('email address')) {
                  targetStep = 1;
                  found = true;
                  debugSystem.log('Edit client info clicked');
                } else if (allText.includes('uploaded files') || 
                          (allText.includes('file') && (allText.includes('chatgpt') || allText.includes('.png') || allText.includes('.pdf'))) ||
                          allText.includes('collection') ||
                          allText.includes('single garment')) {
                  targetStep = 2;
                  found = true;
                  debugSystem.log('Edit files clicked');
                } else if (allText.includes('garment specifications') || 
                          allText.includes('total quantity') ||
                          (allText.includes('garment') && allText.includes(':')) ||
                          allText.includes('fabric:') ||
                          allText.includes('printing methods:') ||
                          allText.includes('units')) {
                  targetStep = 3;
                  found = true;
                  debugSystem.log('Edit garments clicked');
                }
                
                currentElement = currentElement.parentElement;
              }
              
              // Fallback: check by section ID
              if (!found) {
                const step1Section = button.closest('#review-step-1, [data-step="1"]');
                const step2Section = button.closest('#review-step-2, [data-step="2"]');
                const step3Section = button.closest('#review-step-3, [data-step="3"]');
                
                if (step1Section) {
                  targetStep = 1;
                  debugSystem.log('Edit client info clicked (fallback)');
                } else if (step2Section) {
                  targetStep = 2;
                  debugSystem.log('Edit files clicked (fallback)');
                } else if (step3Section) {
                  targetStep = 3;
                  debugSystem.log('Edit garments clicked (fallback)');
                }
              }
              
              // Navigate AND scroll
              stepManager.navigateToStep(targetStep);
              
              
              debugSystem.log('Edit button navigation with scroll', { targetStep, found });
            };
          }
        });
      }, 200);
      debugSystem.log('Edit buttons setup complete');
    }

    // ENHANCED: Secure payload building functions for webhook integration
    collectAllClientData() {
      return {
        clientName: document.getElementById('client-name')?.value || '',
        companyName: document.getElementById('company-name')?.value || '',
        email: document.getElementById('email')?.value || '',
        vatEin: document.getElementById('vat-ein')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        country: document.getElementById('country')?.value || '',
        productionType: document.getElementById('production-type')?.value || '',
        requestType: document.getElementById('request-type')?.value || '',
        notes: document.getElementById('notes')?.value || ''
      };
    }

    async collectUploadedFiles() {
      const files = [];
      const fileElements = document.querySelectorAll('.techpack-file');
      
      debugSystem.log(`📁 Collecting ${fileElements.length} files from Google Drive uploads...`);
      
      // Collect all file objects with Google Drive URLs
      for (const fileElement of fileElements) {
        const fileId = fileElement.dataset.fileId;
        const fileObj = state.formData.files.find(f => f.id === fileId);
        
        if (fileObj && fileObj.file) {
          // Check if file was successfully uploaded to Google Drive
          if (fileObj.uploadStatus === 'completed' && fileObj.driveUrl) {
            files.push({
              name: fileObj.file.name,
              size: SecurityUtils.formatFileSize(fileObj.file.size),
              type: fileObj.type, // File tag type (Collection, Single, Design, Accessories)
              mimeType: fileObj.file.type,
              url: fileObj.driveUrl, // Google Drive view URL
              downloadUrl: fileObj.driveDownloadUrl, // Google Drive direct download URL
              fileId: fileObj.driveFileId, // Google Drive file ID
              folderId: fileObj.driveFolderId, // Google Drive folder ID
              folderName: fileObj.driveFolderName, // Client folder name
              folderPath: fileObj.driveFolderPath, // Full folder path
              clientName: fileObj.driveClientName, // Client name for organization
              uploadedAt: new Date().toISOString(),
              source: 'google-drive'
            });
            
            debugSystem.log(`✅ File ready for submission: ${fileObj.file.name} (Google Drive)`);
            
          } else if (fileObj.uploadStatus === 'uploading') {
            // File is still uploading
            files.push({
              name: fileObj.file.name,
              size: SecurityUtils.formatFileSize(fileObj.file.size),
              type: fileObj.type,
              mimeType: fileObj.file.type,
              error: 'Upload in progress - please wait',
              uploadedAt: new Date().toISOString(),
              source: 'google-drive'
            });
            
            debugSystem.log(`⏳ File still uploading: ${fileObj.file.name}`);
            
          } else if (fileObj.uploadStatus === 'failed') {
            // File upload failed
            files.push({
              name: fileObj.file.name,
              size: SecurityUtils.formatFileSize(fileObj.file.size),
              type: fileObj.type,
              mimeType: fileObj.file.type,
              error: 'Google Drive upload failed',
              uploadedAt: new Date().toISOString(),
              source: 'google-drive'
            });
            
            debugSystem.log(`❌ File upload failed: ${fileObj.file.name}`);
            
          } else {
            // File upload is pending or unknown status
            files.push({
              name: fileObj.file.name,
              size: SecurityUtils.formatFileSize(fileObj.file.size),
              type: fileObj.type,
              mimeType: fileObj.file.type,
              error: 'Upload status unknown',
              uploadedAt: new Date().toISOString(),
              source: 'google-drive'
            });
            
            debugSystem.log(`⚠️ File upload status unknown: ${fileObj.file.name}`);
          }
        }
      }
      
      debugSystem.log(`📋 Collected ${files.length} files for submission`, {
        successful: files.filter(f => f.url && !f.error).length,
        failed: files.filter(f => f.error).length
      });
      
      return files;
    }

    // Helper function to convert file to base64
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }

    buildColorwayRecords(clientData, submissionId, submissionDate) {
      const colorwayRecords = [];
      
      document.querySelectorAll('.techpack-garment').forEach(garment => {
        const garmentType = garment.querySelector('[name="garmentType"]')?.value || 'Unknown Garment';
        const fabricType = garment.querySelector('[name="fabricType"]')?.value || 'Unknown Fabric';
        
        // Get printing methods
        const printingMethods = Array.from(
          garment.querySelectorAll('[name="printingMethods[]"]:checked')
        ).map(cb => cb.value);
        
        // Process each colorway in this garment
        garment.querySelectorAll('.techpack-colorway').forEach(colorway => {
          const colorInput = colorway.querySelector('.techpack-color-picker__input');
          const pantoneButton = colorway.querySelector('.techpack-pantone-buttons button[data-pantone-code]:not([data-pantone-code=""])');
          
          // Get color information
          const hexColor = colorInput ? colorInput.value : '#000000';
          const colorName = pantoneButton && pantoneButton.dataset.pantoneCode ? 
            pantoneButton.dataset.pantoneCode : 
            findClosestPantoneColor(hexColor);
          
          // Build size breakdown and calculate total
          const sizeInputs = colorway.querySelectorAll('.techpack-size-grid__input[type="number"]');
          const sizeBreakdown = [];
          let totalUnits = 0;
          
          sizeInputs.forEach(input => {
            const size = input.dataset.size?.toUpperCase() || input.name?.replace('qty-', '').toUpperCase();
            const qty = parseInt(input.value) || 0;
            if (qty > 0 && size) {
              sizeBreakdown.push(`${size}: ${qty}`);
              totalUnits += qty;
            }
          });
          
          // Only add records for colorways with quantities
          if (totalUnits > 0) {
            colorwayRecords.push({
              // Complete client information (repeated for each colorway)
              client_name: clientData.clientName,
              company_name: clientData.companyName,
              email: clientData.email,
              vat_ein: clientData.vatEin,
              phone: clientData.phone,
              country: clientData.country,
              production_type: clientData.productionType,
              request_type: clientData.requestType,
              notes: clientData.notes,
              
              // Garment/colorway specific data
              garment_description: `${colorName} ${garmentType}, ${fabricType}${printingMethods.length > 0 ? ' w/ ' + printingMethods.join(', ') : ''}`,
              size_breakdown: sizeBreakdown.join(', '),
              total_units: totalUnits,
              
              // Meta data
              submission_date: submissionDate,
              reference_id: submissionId,
              submission_id: submissionId
            });
          }
        });
      });
      
      return colorwayRecords;
    }

    async buildSecurePayload() {
      const timestamp = Date.now();
      const submissionId = SecurityUtils.generateSubmissionId();
      const submissionDate = new Date().toISOString().split('T')[0];
      
      // Collect all data
      const clientData = this.collectAllClientData();
      const uploadedFiles = await this.collectUploadedFiles();
      const colorwayRecords = this.buildColorwayRecords(clientData, submissionId, submissionDate);
      
      debugSystem.log('🔒 Building secure payload', {
        clientData,
        colorwayRecords: colorwayRecords.length,
        uploadedFiles: uploadedFiles.length,
        submissionId
      });
      
      return {
        timestamp,
        submission_id: submissionId,
        records: colorwayRecords,
        files: uploadedFiles,
        meta: {
          user_agent: navigator.userAgent,
          page_url: window.location.href,
          form_version: '2.1'
        }
      };
    }

    // EXISTING: Keep your exact setupFormSubmission method
    setupFormSubmission() {
      const submitBtn = document.querySelector('#step-4-submit');
      if (submitBtn) {
        submitBtn.addEventListener('click', this.handleSubmit.bind(this));
      }
    }

    // EXISTING: Keep your exact handleSubmit method
    async handleSubmit() {
      const submitBtn = document.querySelector('#step-4-submit');
      if (!submitBtn) return;

      // Rate limiting check
      if (!SecurityUtils.canSubmit()) {
        const remaining = Math.ceil((CONFIG.SUBMISSION_COOLDOWN - (Date.now() - (window.techpackLastSubmission || 0))) / 1000);
        this.showError(`Please wait ${remaining} seconds before submitting again.`);
        return;
      }

      // Show premium loading overlay
      LoadingOverlay.show();
      LoadingOverlay.updateProgress(10);

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="techpack-btn__spinner" width="16" height="16" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1" fill="none" opacity="0.3"/>
          <path d="M8 2v6" stroke="currentColor" stroke-width="1"/>
        </svg>
        Submitting...
      `;

      debugSystem.log('🚀 Enhanced form submission started');

      try {
        // First, upload all files to Google Drive
        LoadingOverlay.updateMessage('Uploading files to secure cloud storage...');
        LoadingOverlay.updateProgress(20);
        debugSystem.log('📤 Starting file uploads to Google Drive...');
        await this.uploadAllFilesToGoogleDrive();
        
        // Check if any files are still uploading
        const uploadingFiles = state.formData.files.filter(f => f.uploadStatus === 'uploading');
        if (uploadingFiles.length > 0) {
          throw new Error(`Please wait - ${uploadingFiles.length} file(s) are still uploading to Google Drive.`);
        }

        // Check for failed uploads
        const failedFiles = state.formData.files.filter(f => f.uploadStatus === 'failed');
        if (failedFiles.length > 0) {
          throw new Error(`${failedFiles.length} file(s) failed to upload. Please remove and re-upload these files.`);
        }

        // Build secure payload with all data
        LoadingOverlay.updateMessage('Finalizing your garment specifications...');
        LoadingOverlay.updateProgress(60);
        const payload = await this.buildSecurePayload();
        
        // Validate payload has data
        if (!payload.records || payload.records.length === 0) {
          throw new Error('No garment data found. Please ensure you have added garments with quantities.');
        }

        // Generate HMAC signature
        const signature = SecurityUtils.generateHMAC(payload, payload.timestamp);
        
        debugSystem.log('🔐 Payload built and signed', {
          records: payload.records.length,
          files: payload.files.length,
          signature: signature.substring(0, 10) + '...'
        });

        // Send to Make.com webhook via Vercel API
        LoadingOverlay.updateMessage('Almost ready - preparing your submission...');
        LoadingOverlay.updateProgress(80);
        const appProxyUrl = CONFIG.WEBHOOK_URL;
        
        console.log(`🔍 DEBUG: Using webhook URL = ${appProxyUrl}`);
        
        const response = await fetch(appProxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Signature': signature,
            'X-Timestamp': payload.timestamp.toString(),
            'X-Form-Version': '2.1'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Webhook submission failed (${response.status}): ${errorText}`);
        }

        // Handle different response types
        let responseData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          const responseText = await response.text();
          responseData = { status: response.status, message: responseText };
        }
        
        debugSystem.log('✅ Webhook response received', responseData);

        // Update rate limiting
        SecurityUtils.updateSubmissionTime();
        
        // Complete loading and show success
        LoadingOverlay.updateMessage('Submission completed successfully!');
        LoadingOverlay.updateProgress(100);
        
        // Brief delay to show completion before hiding
        setTimeout(() => {
          LoadingOverlay.hide();
          // Show success page with actual submission data
          this.showThankYou(payload.submission_id, payload.records.length);
        }, 1000);
        
        debugSystem.log('✅ Form submitted successfully', {
          submissionId: payload.submission_id,
          records: payload.records.length,
          files: payload.files.length
        }, 'success');

      } catch (error) {
        debugSystem.log('❌ Form submission failed', error, 'error');
        
        // Hide loading overlay on error
        LoadingOverlay.hide();
        
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit Tech-Pack';
        
        // Show user-friendly error
        this.showError(this.getErrorMessage(error));
      }
    }

    showError(message) {
      // Create or update error message display
      let errorDiv = document.querySelector('.techpack-submission-error');
      if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'techpack-submission-error';
        errorDiv.style.cssText = `
          position: fixed;
          top: 100px;
          left: 50%;
          transform: translateX(-50%);
          background: #dc2626;
          color: white;
          padding: 1rem 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
          z-index: 1000;
          max-width: 500px;
          text-align: center;
        `;
        document.body.appendChild(errorDiv);
      }
      
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        if (errorDiv.parentNode) {
          errorDiv.style.display = 'none';
        }
      }, 5000);
    }

    getErrorMessage(error) {
      const message = error.message || 'An unexpected error occurred';
      
      // Provide user-friendly error messages
      if (message.includes('Webhook submission failed')) {
        return 'Unable to submit your tech-pack. Please check your internet connection and try again.';
      } else if (message.includes('No garment data found')) {
        return 'Please add at least one garment with quantities before submitting.';
      } else if (message.includes('wait')) {
        return message; // Rate limiting message is already user-friendly
      } else {
        return 'We encountered an issue submitting your tech-pack. Please try again or contact support.';
      }
    }

// ENHANCED: showThankYou method with actual submission data
    showThankYou(submissionId, totalGarments) {
      const step4 = document.querySelector('#techpack-step-4');
      if (!step4) return;

      const totalQuantity = quantityCalculator.getTotalQuantityFromAllColorways();
      const actualSubmissionId = submissionId || `TP-${Date.now().toString().slice(-8)}`;
      const actualGarmentCount = totalGarments || document.querySelectorAll('.techpack-garment').length;
      
      step4.innerHTML = `
        <div class="techpack-container">
          <div class="techpack-success-page">
            <div class="techpack-success__icon-wrapper">
              <div class="techpack-success__icon">
                <svg width="80" height="80" viewBox="0 0 80 80" class="success-checkmark">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="#000000" stroke-width="3" stroke-dasharray="226" stroke-dashoffset="226" class="circle-animation"/>
                  <path d="M25 40l10 10 20-20" stroke="#000000" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="50" stroke-dashoffset="50" class="checkmark-animation"/>
                </svg>
              </div>
            </div>

            <div class="techpack-success__content">
              <h1 class="techpack-success__title">Submission Received</h1>
              <p class="techpack-success__subtitle">Your tech-pack has been successfully submitted to our production team.</p>

              <div class="techpack-success__card">
                <div class="techpack-success__card-header">
                  <h3>Submission Details</h3>
                </div>
                
                <div class="techpack-success__details">
                  <div class="techpack-success__detail-item">
                    <span class="techpack-success__detail-label">Reference ID</span>
                    <span class="techpack-success__detail-value">${actualSubmissionId}</span>
                  </div>
                  
                  <div class="techpack-success__detail-item">
                    <span class="techpack-success__detail-label">Total Garments</span>
                    <span class="techpack-success__detail-value">${actualGarmentCount} ${actualGarmentCount === 1 ? 'garment' : 'garments'}</span>
                  </div>
                  
                  <div class="techpack-success__detail-item">
                    <span class="techpack-success__detail-label">Total Quantity</span>
                    <span class="techpack-success__detail-value">${totalQuantity} units</span>
                  </div>
                  
                  <div class="techpack-success__detail-item">
                    <span class="techpack-success__detail-label">Files Uploaded</span>
                    <span class="techpack-success__detail-value">${document.querySelectorAll('.techpack-file').length} ${document.querySelectorAll('.techpack-file').length === 1 ? 'file' : 'files'}</span>
                  </div>
                  
                  <div class="techpack-success__detail-item">
                    <span class="techpack-success__detail-label">Submitted</span>
                    <span class="techpack-success__detail-value">${new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>
              </div>

              <div class="techpack-success__next-steps">
                <h4 class="techpack-success__next-title">What happens next?</h4>
                <div class="techpack-success__steps">
                  <div class="techpack-success__step">
                    <div class="techpack-success__step-number">1</div>
                    <div class="techpack-success__step-content">
                      <strong>Review Process</strong>
                      <span>Our team will analyze your requirements and specifications</span>
                    </div>
                  </div>
                  
                  <div class="techpack-success__step">
                    <div class="techpack-success__step-number">2</div>
                    <div class="techpack-success__step-content">
                      <strong>Quote Preparation</strong>
                      <span>We'll prepare a detailed quote and timeline for your project</span>
                    </div>
                  </div>
                  
                  <div class="techpack-success__step">
                    <div class="techpack-success__step-number">3</div>
                    <div class="techpack-success__step-content">
                      <strong>Response</strong>
                      <span>You'll receive our comprehensive proposal within 24-48 hours</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="techpack-success__actions">
                <button type="button" class="techpack-btn techpack-btn--primary" onclick="location.reload()">
                  <span>Submit Another Tech-Pack</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" class="techpack-btn__icon">
                    <path d="M8 1l7 7-7 7M15 8H1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

    }

    // Upload all files to Google Drive during form submission
    async uploadAllFilesToGoogleDrive() {
      // Upload files that haven't been successfully uploaded yet
      const filesToUpload = state.formData.files.filter(f => f.uploadStatus !== 'completed');
      
      if (filesToUpload.length === 0) {
        debugSystem.log('📋 No files need uploading - all files already uploaded');
        return;
      }

      debugSystem.log(`📤 Uploading ${filesToUpload.length} files to Google Drive...`);

      // Upload files sequentially to avoid overwhelming the server
      for (let i = 0; i < filesToUpload.length; i++) {
        const fileObj = filesToUpload[i];
        try {
          debugSystem.log(`📤 Uploading file: ${fileObj.file.name}`);
          
          // Add file to loading overlay
          LoadingOverlay.addFileStatus(fileObj.file.name, 'uploading');
          
          await this.uploadSingleFileToGoogleDrive(fileObj.id, fileObj.file);
          
          // Mark file as completed in loading overlay
          LoadingOverlay.addFileStatus(fileObj.file.name, 'completed');
          
          // Update progress based on files uploaded
          const progressPercentage = 20 + ((i + 1) / filesToUpload.length) * 30; // 20-50% for file uploads
          LoadingOverlay.updateProgress(progressPercentage);
          
        } catch (error) {
          debugSystem.log(`❌ Failed to upload file: ${fileObj.file.name}`, error, 'error');
          throw new Error(`Failed to upload file "${fileObj.file.name}": ${error.message}`);
        }
      }

      debugSystem.log('✅ All files uploaded to Google Drive successfully');
    }

    // Upload single file to Google Drive (helper method for form submission)
    async uploadSingleFileToGoogleDrive(fileId, file) {
      // Find the file object in state
      const fileObj = state.formData.files.find(f => f.id === fileId);
      if (!fileObj) {
        debugSystem.log('❌ File object not found for upload', { fileId }, 'error');
        return;
      }

      // Update file status
      fileObj.uploadStatus = 'uploading';

      try {
        // Upload file with progress callback
        const result = await GoogleDriveUtils.uploadFile(file, (progress, status) => {
          GoogleDriveUtils.updateFileProgress(fileId, progress, status);
        });

        if (result.success) {
          // Update file object with Google Drive info
          fileObj.driveUrl = result.fileUrl;
          fileObj.driveDownloadUrl = result.downloadUrl;
          fileObj.driveFileId = result.fileId;
          fileObj.driveFolderId = result.folderId;
          fileObj.driveFolderName = result.folderName;
          fileObj.driveFolderPath = result.folderPath;
          fileObj.driveClientName = result.clientName;
          fileObj.uploadStatus = 'completed';

          // Show success indicator in UI
          GoogleDriveUtils.showUploadSuccess(fileId, result.fileUrl);

          debugSystem.log('✅ File uploaded to Google Drive', {
            fileId,
            fileName: file.name,
            driveUrl: result.fileUrl,
            driveFileId: result.fileId
          });

        } else {
          // Update file status and show error
          fileObj.uploadStatus = 'failed';
          GoogleDriveUtils.showUploadError(fileId, result.error);

          debugSystem.log('❌ Google Drive upload failed', {
            fileId,
            fileName: file.name,
            error: result.error
          }, 'error');

          throw new Error(result.error);
        }

      } catch (error) {
        // Update file status and show error
        fileObj.uploadStatus = 'failed';
        GoogleDriveUtils.showUploadError(fileId, error.message);

        debugSystem.log('❌ Unexpected error during Google Drive upload', {
          fileId,
          fileName: file.name,
          error: error.message
        }, 'error');

        throw error;
      }
    }

    // ENHANCED: Updated showStep method to handle step 0 (registration check)
    showStep(stepNumber) {
      const steps = document.querySelectorAll('.techpack-step');
      
      steps.forEach(step => {
        step.style.display = 'none';
      });
      
      // Handle step 0 (registration check)
      if (stepNumber === 0) {
        const step0 = document.querySelector('#techpack-step-0');
        if (step0) {
          step0.style.display = 'block';
          state.currentStep = 0;
          debugSystem.log('Showing registration check (step 0)');
          return;
        } else {
          debugSystem.log('Step 0 (registration check) not found, falling back to step 1', null, 'warn');
          stepNumber = 1; // Fallback to step 1 if step 0 doesn't exist
        }
      }
      
      // Handle regular steps (1-4)
      const targetStep = document.querySelector(`[data-step="${stepNumber}"]`);
      if (targetStep) {
        targetStep.style.display = 'block';
        state.currentStep = stepNumber;
        
        // EXISTING: Keep your exact step-specific logic
        if (stepNumber === 2) {
          stepManager.syncStep2DOM();
        } else if (stepNumber === 3) {
          stepManager.refreshStep3Interface();
        } else if (stepNumber === 4) {
          stepManager.populateReview();
        }
        
        debugSystem.log('Showing step', { stepNumber });
      } else {
        debugSystem.log('Target step not found', { stepNumber }, 'error');
      }
    }
  }

  // Initialize debug system FIRST
  const debugSystem = new DebugSystem();
  debugSystem.init();

  // CREATE STATE INSTANCE HERE (this line is missing!)
  const state = new TechPackState();

  // Global instances initialization
  const stepManager = new StepManager();
  const fileManager = new FileManager();
  const countrySelector = new CountrySelector();
  const quantityCalculator = new QuantityCalculator();
  const garmentManager = new GarmentManager();
  const formInitializer = new FormInitializer();

  // Global API exposure
  window.techpackApp = {
    state,
    debugSystem,
    stepManager,
    fileManager,
    countrySelector,
    quantityCalculator,
    garmentManager,
    formInitializer,
    
    // Public methods
    init() {
      formInitializer.init();
    },
    
    navigateToStep(stepNumber) {
      return stepManager.navigateToStep(stepNumber);
    },
    
    getState() {
      return state.getState();
    },
    
    reset() {
      state.reset();
      location.reload();
    },
    
    exportData() {
      const data = {
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        state: state.getState(),
        logs: debugSystem.logs
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `techpack-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

// ENHANCED: Robust initialization with multiple readiness checks and error handling
const initializeTechPackApp = () => {
  if (state.isInitialized) {
    debugSystem.log('⚠️ TechPack app already initialized, skipping...', null, 'warn');
    return;
  }

  debugSystem.log('🚀 Starting TechPack app initialization...');
  debugSystem.log('📋 Initialization context:', {
    readyState: document.readyState,
    hasBody: !!document.body,
    techpackElements: document.querySelectorAll('[id*="techpack"]').length,
    registrationButtons: document.querySelectorAll('[id*="registered-client"]').length,
    timestamp: new Date().toISOString()
  });

  try {
    formInitializer.init();
    state.isInitialized = true;
    debugSystem.log('✅ TechPack app initialization completed successfully', null, 'success');
  } catch (error) {
    debugSystem.log('❌ TechPack app initialization failed:', error, 'error');
    // Retry after a longer delay
    setTimeout(() => {
      debugSystem.log('🔄 Retrying TechPack app initialization...');
      try {
        formInitializer.init();
        state.isInitialized = true;
        debugSystem.log('✅ TechPack app initialization succeeded on retry', null, 'success');
      } catch (retryError) {
        debugSystem.log('❌ TechPack app initialization failed on retry:', retryError, 'error');
      }
    }, 1000);
  }
};

// Enhanced multi-stage initialization with comprehensive DOM readiness checks
const setupInitialization = () => {
  debugSystem.log('🔧 Setting up TechPack app initialization...');
  
  // Stage 1: Immediate check if DOM is already ready
  if (document.readyState === 'complete') {
    debugSystem.log('📋 DOM already complete, initializing immediately');
    setTimeout(initializeTechPackApp, 50);
    return;
  }
  
  // Stage 2: DOM loaded but resources might still be loading
  if (document.readyState === 'interactive') {
    debugSystem.log('📋 DOM interactive, initializing with short delay');
    setTimeout(initializeTechPackApp, 100);
    return;
  }
  
  // Stage 3: DOM still loading, wait for DOMContentLoaded
  if (document.readyState === 'loading') {
    debugSystem.log('📋 DOM still loading, waiting for DOMContentLoaded event');
    document.addEventListener('DOMContentLoaded', () => {
      debugSystem.log('📋 DOMContentLoaded fired, initializing...');
      setTimeout(initializeTechPackApp, 100);
    });
    
    // Additional safety net - wait for window load as well
    window.addEventListener('load', () => {
      if (!state.isInitialized) {
        debugSystem.log('📋 Window load fired and app not initialized, initializing now...');
        setTimeout(initializeTechPackApp, 50);
      }
    });
    
    // Ultimate fallback - force initialization after reasonable time
    setTimeout(() => {
      if (!state.isInitialized) {
        debugSystem.log('⏰ Timeout reached, forcing initialization...', null, 'warn');
        initializeTechPackApp();
      }
    }, 3000);
  }
};

// Immediate setup
setupInitialization();

  // Expose debug system globally for console access
  window.debugSystem = debugSystem;

  // Global utility functions
  window.recalculateProgress = function() {
    debugSystem.log('Manually recalculating progress...');
    const result = quantityCalculator.calculateAndUpdateProgress();
    debugSystem.log('Current progress:', result + '%');
    return result;
  };

  window.toggleDebug = function() {
    debugSystem.toggle();
  };

  debugSystem.log('TechPack Enhanced Application Loaded', { version: '2.0.0' }, 'success');
  
  // ========================================
  // MOBILE ENHANCEMENTS & DATE VALIDATION
  // ========================================
  
  // Enhanced date validation for mobile consistency
  function validateDateInput(dateInput) {
    if (!dateInput) return true;
    
    const selectedDate = new Date(dateInput.value);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 42); // 6 weeks = 42 days
    
    const dateHint = dateInput.parentNode.querySelector('.techpack-form__date-hint');
    
    if (dateInput.value && selectedDate < minDate) {
      dateInput.classList.add('error');
      if (dateHint) {
        dateHint.classList.add('error');
        dateHint.textContent = `Selected date is too soon. Minimum is ${minDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} (6 weeks from today)`;
      }
      debugSystem.log('❌ Date validation failed: Selected date too soon', { selected: selectedDate, minimum: minDate }, 'error');
      return false;
    } else {
      dateInput.classList.remove('error');
      if (dateHint) {
        dateHint.classList.remove('error');
        dateHint.textContent = `Minimum 6 weeks from today (${minDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })})`;
      }
      debugSystem.log('✅ Date validation passed', { selected: selectedDate, minimum: minDate });
      return true;
    }
  }
  
  // Mobile-specific enhancements
  function initializeMobileEnhancements() {
    debugSystem.log('🔧 Initializing mobile enhancements...');
    
    // Add techpack-active class to body for modal prevention
    document.body.classList.add('techpack-active');
    
    // Enhanced date input validation for mobile
    const dateInputs = document.querySelectorAll('.techpack-form__input--date, input[type="date"]');
    dateInputs.forEach(input => {
      // Set minimum date dynamically for mobile compatibility
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 42);
      input.min = minDate.toISOString().split('T')[0];
      
      // Add real-time validation
      input.addEventListener('change', function() {
        validateDateInput(this);
      });
      
      input.addEventListener('input', function() {
        validateDateInput(this);
      });
      
      // Mobile-specific: ensure proper keyboard on focus
      input.addEventListener('focus', function() {
        this.setAttribute('type', 'date');
        debugSystem.log('📅 Date input focused on mobile');
      });
      
      debugSystem.log('📅 Enhanced date input initialized', { min: input.min });
    });
    
    // Size grid input enhancements for mobile
    const sizeInputs = document.querySelectorAll('.techpack-size-grid__input[type="number"]');
    sizeInputs.forEach(input => {
      // Ensure numeric input only and prevent overflow
      input.addEventListener('input', function() {
        const oldValue = this.value;
        // Remove non-numeric characters
        this.value = this.value.replace(/[^0-9]/g, '');
        // Limit to 4 characters to prevent overflow on mobile
        if (this.value.length > 4) {
          this.value = this.value.slice(0, 4);
        }
        // Cap at reasonable maximum (9999)
        const numValue = parseInt(this.value) || 0;
        if (numValue > 9999) {
          this.value = '9999';
        }
        if (oldValue !== this.value) {
          debugSystem.log('🔢 Input sanitized for mobile compatibility', { 
            old: oldValue, 
            new: this.value 
          });
        }
      });
      
      // Add visual feedback on mobile
      input.addEventListener('focus', function() {
        this.style.transform = 'scale(1.05)';
        this.style.zIndex = '10';
      });
      
      input.addEventListener('blur', function() {
        this.style.transform = '';
        this.style.zIndex = '';
      });
    });
    
    // Prevent modal interference from other site modals
    const otherModals = document.querySelectorAll('.modal:not(.techpack-modal), .overlay:not(.techpack-overlay), .popup:not(.techpack-popup)');
    otherModals.forEach(modal => {
      if (modal.style.zIndex && parseInt(modal.style.zIndex) > 500) {
        modal.style.zIndex = '1';
        debugSystem.log('🚫 Lowered z-index of interfering modal');
      }
    });
    
    // Enhanced navigation button stability
    const navButtons = document.querySelectorAll('.techpack-form__actions');
    navButtons.forEach(nav => {
      nav.style.position = 'fixed';
      nav.style.zIndex = '999';
      nav.style.transform = 'translateZ(0)';
      nav.style.willChange = 'transform';
    });
    
    debugSystem.log('✅ Mobile enhancements initialized');
  }
  
  // Initialize mobile enhancements when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMobileEnhancements);
  } else {
    initializeMobileEnhancements();
  }
  
  // ========================================
  // STEP 4 REVIEW DATA POPULATION
  // ========================================
  
  // Populate client information review
  function populateClientReview() {
    debugSystem.log('🔍 Populating client review...');
    const container = document.getElementById('review-client-content');
    if (!container) {
      debugSystem.log('❌ Client review container not found');
      return;
    }
    
    // ENHANCED: Collect client data - handle both registered and new client forms
    let clientData = {};
    
    // Try to get data from main form using correct field IDs
    const mainFormData = {
      clientName: document.getElementById('client-name')?.value || '',
      companyName: document.getElementById('company-name')?.value || '',
      email: document.getElementById('email')?.value || '',
      vatEin: document.getElementById('vat-ein')?.value || '',
      phone: document.getElementById('phone')?.value || '',
      country: document.getElementById('country')?.value || '',
      productionType: document.getElementById('production-type')?.value || '',
      requestType: document.getElementById('request-type')?.value || '',
      notes: document.getElementById('notes')?.value || ''
    };

    // Check if main form has data
    const hasMainFormData = mainFormData.clientName || mainFormData.companyName || mainFormData.email;
    
    if (hasMainFormData) {
      clientData = mainFormData;
      debugSystem.log('📋 Using main form client data', clientData);
    } else {
      // Try alternative selectors for backward compatibility
      debugSystem.log('⚠️ Main form appears empty, checking alternative selectors...');
      
      clientData = {
        clientName: document.getElementById('client-name')?.value || 
                   document.getElementById('contact-name')?.value || '',
        companyName: document.getElementById('company-name')?.value || 
                    document.getElementById('business-name')?.value || '',
        email: document.getElementById('email')?.value || 
               document.getElementById('business-email')?.value || '',
        vatEin: document.getElementById('vat-ein')?.value || '',
        phone: document.getElementById('phone')?.value || 
               document.getElementById('business-phone')?.value || '',
        country: document.getElementById('country')?.value || '',
        productionType: document.getElementById('production-type')?.value || '',
        requestType: document.getElementById('request-type')?.value || '',
        notes: document.getElementById('notes')?.value || ''
      };
      
      debugSystem.log('📋 Using alternative client data collection', clientData);
    }
    
    // Also check for stored client data from modal interactions
    const registrationStatus = localStorage.getItem('techpack-client-registration');
    if (registrationStatus) {
      clientData.registrationStatus = registrationStatus;
      debugSystem.log(`👤 Client registration status: ${registrationStatus}`);
    }
    
    // ENHANCED: Generate comprehensive review HTML - show all client information
    let html = '<div class="review-section">';
    
    if (clientData.clientName) {
      html += `<div class="review-item">
        <span class="review-label">Contact Name:</span>
        <span class="review-value">${clientData.clientName}</span>
      </div>`;
    }
    
    if (clientData.companyName) {
      html += `<div class="review-item">
        <span class="review-label">Business/Brand Name:</span>
        <span class="review-value">${clientData.companyName}</span>
      </div>`;
    }
    
    if (clientData.email) {
      html += `<div class="review-item">
        <span class="review-label">Email Address:</span>
        <span class="review-value">${clientData.email}</span>
      </div>`;
    }
    
    if (clientData.vatEin) {
      html += `<div class="review-item">
        <span class="review-label">VAT/EIN Number:</span>
        <span class="review-value">${clientData.vatEin}</span>
      </div>`;
    }
    
    if (clientData.phone) {
      html += `<div class="review-item">
        <span class="review-label">Phone Number:</span>
        <span class="review-value">${clientData.phone}</span>
      </div>`;
    }
    
    if (clientData.country) {
      html += `<div class="review-item">
        <span class="review-label">Business Location:</span>
        <span class="review-value">${clientData.country}</span>
      </div>`;
    }
    
    if (clientData.productionType) {
      const productionText = clientData.productionType === 'our-blanks' ? 'Our Blanks' : 'Custom Production';
      html += `<div class="review-item">
        <span class="review-label">Production Type:</span>
        <span class="review-value">${productionText}</span>
      </div>`;
    }
    
    if (clientData.requestType) {
      const requestTypeLabel = clientData.requestType === 'sample-request' ? 'Sample Request' : 
                              clientData.requestType === 'bulk-order-request' ? 'Bulk Order Request' : 
                              clientData.requestType;
      html += `<div class="review-item">
        <span class="review-label">Request Type:</span>
        <span class="review-value">${requestTypeLabel}</span>
      </div>`;
    }
    
    if (clientData.notes) {
      html += `<div class="review-item">
        <span class="review-label">Project Details:</span>
        <span class="review-value">${clientData.notes}</span>
      </div>`;
    }
    
    if (clientData.registrationStatus) {
      const statusText = clientData.registrationStatus === 'yes' ? 'Registered Client' : 'New Client';
      html += `<div class="review-item">
        <span class="review-label">Client Status:</span>
        <span class="review-value">${statusText}</span>
      </div>`;
    }
    
    html += '</div>';
    
    if (html === '<div class="review-section"></div>') {
      html = '<div class="review-empty">No client information available</div>';
    }
    
    container.innerHTML = html;
    debugSystem.log('✅ Client review populated', clientData);
  }
  
  // Helper function to find closest PANTONE color by hex value
  function findClosestPantoneColor(hexColor) {
    // Use the garmentManager instance to access the comprehensive pantone database
    if (window.garmentManager && window.garmentManager.findClosestPantoneColors) {
      const results = window.garmentManager.findClosestPantoneColors(hexColor, 1);
      if (results && results.length > 0) {
        return results[0].code;
      }
    }
    
    // Fallback to a small sample set if garmentManager is not available
    const pantoneColors = [
      { code: 'Egret - 11-0103 TCX', hex: '#F3ECE0', name: 'Egret' },
      { code: 'Snow white - 11-0602 TCX', hex: '#F2F0EB', name: 'Snow white' },
      { code: 'Bright white - 11-0601 TCX', hex: '#F4F5F0', name: 'Bright white' },
      { code: 'True red - 18-1664 TCX', hex: '#C5282F', name: 'True Red' },
      { code: 'Classic blue - 19-4052 TCX', hex: '#0F4C75', name: 'Classic Blue' },
      { code: 'Greenery - 15-0343 TCX', hex: '#88B04B', name: 'Greenery' },
      { code: 'Yellow - 13-0859 TCX', hex: '#EFC050', name: 'Yellow' },
      { code: 'Pink - 18-3949 TCX', hex: '#C3447A', name: 'Pink' },
      { code: 'Ultra violet - 18-3838 TCX', hex: '#6B5B95', name: 'Ultra Violet' }
    ];
    
    // Convert hex to RGB for distance calculation
    function hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }
    
    // Calculate color distance
    function colorDistance(rgb1, rgb2) {
      const dr = rgb1.r - rgb2.r;
      const dg = rgb1.g - rgb2.g;
      const db = rgb1.b - rgb2.b;
      return Math.sqrt(dr * dr + dg * dg + db * db);
    }
    
    const targetRgb = hexToRgb(hexColor);
    if (!targetRgb) return 'Unknown Color';
    
    let closestColor = pantoneColors[0];
    let minDistance = colorDistance(targetRgb, hexToRgb(closestColor.hex));
    
    for (let i = 1; i < pantoneColors.length; i++) {
      const distance = colorDistance(targetRgb, hexToRgb(pantoneColors[i].hex));
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = pantoneColors[i];
      }
    }
    
    return closestColor.code;
  }

  // Populate files review
  function populateFilesReview() {
    debugSystem.log('🔍 Populating files review...');
    const container = document.getElementById('review-files-content');
    if (!container) {
      debugSystem.log('❌ Files review container not found');
      return;
    }
    
    // Try to find uploaded files from multiple possible sources - FIXED to match step 2 structure
    let fileItems = document.querySelectorAll('.techpack-file, .techpack-file-item, .file-item, .uploaded-file-item, [data-file-name]');
    
    // Also check for input files that were selected
    const fileInputs = document.querySelectorAll('input[type="file"]');
    const uploadedFilesList = [];
    
    fileInputs.forEach(input => {
      if (input.files && input.files.length > 0) {
        Array.from(input.files).forEach((file, index) => {
          uploadedFilesList.push({
            name: file.name,
            size: formatFileSize(file.size),
            type: file.type
          });
        });
      }
    });
    
    let html = '<div class="review-section">';
    
    // Show file input files if available, otherwise show DOM file items
    const filesToShow = uploadedFilesList.length > 0 ? uploadedFilesList : 
      Array.from(fileItems).map((item, index) => ({
        name: item.querySelector('.techpack-file__name, .file-name, .techpack-file-name, [data-file-name]')?.textContent || 
              item.dataset.fileName || `File ${index + 1}`,
        size: item.querySelector('.techpack-file__size, .file-size, .techpack-file-size')?.textContent || '',
        type: item.dataset.fileType || ''
      }));
    
    if (filesToShow.length > 0) {
      html += `<div class="review-files-list">
        <div class="review-files-count"><strong>${filesToShow.length} file${filesToShow.length !== 1 ? 's' : ''} uploaded:</strong></div>`;
      
      filesToShow.forEach((file, index) => {
        const fileIcon = getFileTypeIcon(file.name, file.type);
        html += `<div class="review-file-item">
          <span class="review-file-icon">${fileIcon}</span>
          <div class="review-file-info">
            <span class="review-file-name">${file.name}</span>
            ${file.size ? `<span class="review-file-size">${file.size}</span>` : ''}
          </div>
        </div>`;
      });
      html += '</div>';
    } else {
      html += '<div class="review-empty">No files uploaded</div>';
    }
    
    html += '</div>';
    container.innerHTML = html;
    debugSystem.log('✅ Files review populated', { fileCount: filesToShow.length });
  }
  
  // Helper function to format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  // Helper function to get file type icon
  function getFileTypeIcon(fileName, fileType) {
    const extension = fileName.split('.').pop().toLowerCase();
    const icons = {
      pdf: '📄',
      ai: '🎨', 
      png: '🖼️',
      jpg: '🖼️',
      jpeg: '🖼️',
      zip: '📦',
      doc: '📝',
      docx: '📝',
      txt: '📄'
    };
    return icons[extension] || '📄';
  }

  // File upload system for generating public URLs via Vercel Blob
  async function uploadFilesToStorage(files) {
    const uploadedFiles = [];
    
    // Get the Vercel upload endpoint URL (same base as webhook URL but with /api/upload)
    const webhookUrl = CONFIG.WEBHOOK_URL;
    const uploadUrl = webhookUrl.replace('/api/techpack-proxy', '/api/upload');
    
    debugSystem.log(`🔗 Using upload endpoint: ${uploadUrl}`);
    
    for (const file of files) {
      try {
        // Validate file size (4.5MB limit for Vercel)
        const maxSize = 4.5 * 1024 * 1024; // 4.5MB
        if (file.size > maxSize) {
          debugSystem.log(`❌ File ${file.name} too large: ${file.size} bytes (max: ${maxSize})`);
          uploadedFiles.push({
            originalName: file.name,
            size: file.size,
            type: file.type,
            error: `File too large (max ${Math.round(maxSize / (1024 * 1024))}MB)`,
            uploadedAt: new Date().toISOString()
          });
          continue;
        }

        // Create FormData for upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file.name);

        debugSystem.log(`📤 Uploading ${file.name} (${file.size} bytes) to Vercel Blob...`);

        // Upload to Vercel Blob via our API endpoint
        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success || !result.url) {
          throw new Error(result.error || 'Invalid response from upload service');
        }

        // Store the successful upload with public URL
        uploadedFiles.push({
          originalName: result.originalName,
          size: result.size,
          type: result.type,
          url: result.url, // This is the public URL from Vercel Blob
          filename: result.filename,
          uploadedAt: result.uploadedAt
        });
        
        debugSystem.log(`✅ File uploaded successfully: ${file.name}`, { 
          url: result.url,
          size: result.size,
          publicAccess: true
        });
        
      } catch (error) {
        debugSystem.log(`❌ Error uploading file ${file.name}:`, error.message);
        
        // Add failed upload to results with error info
        uploadedFiles.push({
          originalName: file.name,
          size: file.size,
          type: file.type,
          error: error.message,
          uploadedAt: new Date().toISOString()
        });
      }
    }
    
    debugSystem.log(`📊 Upload summary: ${uploadedFiles.length} files processed`, {
      successful: uploadedFiles.filter(f => f.url && !f.error).length,
      failed: uploadedFiles.filter(f => f.error).length
    });
    
    return uploadedFiles;
  }
  
  // Enhanced file review with upload URLs and error handling
  function populateFilesReviewWithUrls(uploadedFiles) {
    const container = document.getElementById('review-files-content');
    if (!container) return;
    
    let html = '<div class="review-section">';
    
    if (uploadedFiles && uploadedFiles.length > 0) {
      const successfulUploads = uploadedFiles.filter(file => file.url && !file.error);
      const failedUploads = uploadedFiles.filter(file => file.error);
      
      html += `<div class="review-files-list">
        <div class="review-files-count">
          <strong>${uploadedFiles.length} file${uploadedFiles.length !== 1 ? 's' : ''} processed:</strong>
          ${successfulUploads.length > 0 ? `<span style="color: green;">✅ ${successfulUploads.length} uploaded successfully</span>` : ''}
          ${failedUploads.length > 0 ? `<span style="color: red;">❌ ${failedUploads.length} failed</span>` : ''}
        </div>`;
      
      uploadedFiles.forEach((file, index) => {
        const fileIcon = getFileTypeIcon(file.originalName, file.type);
        const hasError = file.error;
        const statusIcon = hasError ? '❌' : '✅';
        const statusColor = hasError ? 'red' : 'green';
        
        html += `<div class="review-file-item" style="border-left: 3px solid ${statusColor}; margin-bottom: 10px; padding: 8px;">
          <span class="review-file-icon">${fileIcon}</span>
          <div class="review-file-info">
            <span class="review-file-name">
              ${statusIcon} ${file.originalName}
              <small style="color: #666;">(${formatFileSize(file.size)})</small>
            </span>`;
            
        if (hasError) {
          html += `<div class="review-file-error" style="color: red; font-size: 12px; margin-top: 4px;">
              <strong>Error:</strong> ${file.error}
            </div>`;
        } else if (file.url) {
          // Display public URL for successful uploads
          const displayUrl = file.url.length > 60 ? file.url.substring(0, 60) + '...' : file.url;
          html += `<div class="review-file-url" style="margin-top: 4px;">
              <small style="color: #0066cc;">
                <strong>Public URL:</strong> 
                <a href="${file.url}" target="_blank" rel="noopener" style="text-decoration: underline;">
                  ${displayUrl}
                </a>
              </small>
              <div style="font-size: 10px; color: #888; margin-top: 2px;">
                ⚠️ This link is publicly accessible - do not share if file contains sensitive information
              </div>
            </div>`;
        }
        
        html += `</div></div>`;
      });
      html += '</div>';
    } else {
      html += '<div class="review-empty">No files uploaded</div>';
    }
    
    html += '</div>';
    container.innerHTML = html;
  }
  
  // Populate garments review
  function populateGarmentsReview() {
    debugSystem.log('🔍 Populating garments review...');
    const container = document.getElementById('review-garments-content');
    if (!container) {
      debugSystem.log('❌ Garments review container not found');
      return;
    }
    
    // Find all garment cards
    const garments = document.querySelectorAll('.techpack-garment');
    
    let html = '<div class="review-section">';
    let totalQuantity = 0;
    
    if (garments.length > 0) {
      garments.forEach((garment, index) => {
        const garmentType = garment.querySelector('select[name="garmentType"]')?.value || '';
        const fabricType = garment.querySelector('select[name="fabricType"]')?.value || '';
        const printingMethods = [];
        
        // Get selected printing methods
        garment.querySelectorAll('input[name="printingMethods[]"]:checked').forEach(checkbox => {
          printingMethods.push(checkbox.value);
        });
        
        // Get colorways and quantities
        const colorways = garment.querySelectorAll('.techpack-colorway');
        let garmentTotal = 0;
        
        html += `<div class="review-garment">
          <h4 class="review-garment-title">Garment ${index + 1}</h4>`;
        
        if (garmentType) {
          html += `<div class="review-item">
            <span class="review-label">Type:</span>
            <span class="review-value">${garmentType}</span>
          </div>`;
        }
        
        if (fabricType) {
          html += `<div class="review-item">
            <span class="review-label">Fabric:</span>
            <span class="review-value">${fabricType}</span>
          </div>`;
        }
        
        if (printingMethods.length > 0) {
          html += `<div class="review-item">
            <span class="review-label">Printing Methods:</span>
            <span class="review-value">${printingMethods.join(', ')}</span>
          </div>`;
        }
        
        if (colorways.length > 0) {
          html += '<div class="review-colorways">';
          html += '<span class="review-label">Colorways & Quantities:</span>';
          
          colorways.forEach((colorway, colorIndex) => {
            const colorInput = colorway.querySelector('.techpack-color-picker__input');
            const color = colorInput ? colorInput.value : '#000000';
            
            // Get PANTONE color name from selected button or default to color name
            const selectedPantoneButton = colorway.querySelector('.techpack-pantone-buttons button[data-pantone-code]:not([data-pantone-code=""])');
            let colorName = 'Unknown Color';
            
            if (selectedPantoneButton && selectedPantoneButton.dataset.pantoneCode) {
              colorName = selectedPantoneButton.dataset.pantoneCode;
            } else {
              // Find closest PANTONE color by hex value
              colorName = findClosestPantoneColor(color);
            }
            
            // Get size quantities with proper formatting
            const sizeInputs = colorway.querySelectorAll('.techpack-size-grid__input[type="number"]:not(:disabled)');
            const sizeBreakdown = [];
            let colorwayTotal = 0;
            
            // Standard size order for consistent display
            const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
            
            sizeOrder.forEach(size => {
              const input = colorway.querySelector(`[name*="qty-${size.toLowerCase()}"], [data-size="${size.toLowerCase()}"]`);
              if (input) {
                const qty = parseInt(input.value) || 0;
                if (qty > 0) {
                  sizeBreakdown.push(`${size}:${qty}`);
                  colorwayTotal += qty;
                }
              }
            });
            
            garmentTotal += colorwayTotal;
            
            // Format: "PANTONE Black (S:15 M:20 L:10 - TOTAL 45 units)"
            const sizeBreakdownText = sizeBreakdown.length > 0 ? `${sizeBreakdown.join(' ')} - ` : '';
            
            html += `<div class="review-colorway-item">
              <div class="review-colorway-header">
                <span class="review-color-swatch" style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; display: inline-block; margin-right: 8px;"></span>
                <span><strong>${colorName} (${sizeBreakdownText}TOTAL ${colorwayTotal} units)</strong></span>
              </div>
            </div>`;
          });
          
          html += '</div>';
        }
        
        html += `<div class="review-garment-total">
          <strong>Garment Total: ${garmentTotal} units</strong>
        </div>`;
        
        html += '</div>';
        totalQuantity += garmentTotal;
      });
      
      // Count total colorways across all garments (each colorway = 1 garment)
      let totalColorways = 0;
      garments.forEach(garment => {
        const colorways = garment.querySelectorAll('.techpack-colorway');
        totalColorways += colorways.length;
      });
      
    } else {
      html += '<div class="review-empty">No garments configured</div>';
    }
    
    html += '</div>';
    container.innerHTML = html;
    debugSystem.log('✅ Garments review populated', { garmentCount: garments.length, totalQuantity });
  }
  
  // Populate summary review
  function populateSummaryReview() {
    debugSystem.log('🔍 Populating summary review...');
    const container = document.getElementById('review-summary-content');
    if (!container) {
      debugSystem.log('❌ Summary review container not found');
      return;
    }
    
    // Calculate totals - count colorways as garments (each colorway = 1 garment)
    let totalGarments = 0;
    document.querySelectorAll('.techpack-garment').forEach(garment => {
      const colorways = garment.querySelectorAll('.techpack-colorway');
      totalGarments += colorways.length;
    });
    let totalQuantity = 0;
    let totalFiles = document.querySelectorAll('.techpack-file, .techpack-file-item, .file-item').length;
    
    // Calculate total quantity - restored original selector
    document.querySelectorAll('.techpack-size-grid__input[type="number"]').forEach(input => {
      totalQuantity += parseInt(input.value) || 0;
    });
    
    let html = `<div class="review-section">
      <div class="review-summary-stats">
        <div class="review-stat-item">
          <span class="review-stat-number">${totalGarments}</span>
          <span class="review-stat-label">Garment${totalGarments !== 1 ? 's' : ''}</span>
        </div>
        <div class="review-stat-item">
          <span class="review-stat-number">${totalQuantity}</span>
          <span class="review-stat-label">Total Units</span>
        </div>
        <div class="review-stat-item">
          <span class="review-stat-number">${totalFiles}</span>
          <span class="review-stat-label">File${totalFiles !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>`;
    
    container.innerHTML = html;
    debugSystem.log('✅ Summary review populated', { totalGarments, totalQuantity, totalFiles });
  }

  // Populate Sample Review for Sample Requests
  function populateSampleReview() {
    debugSystem.log('🔍 Populating sample review...');
    const container = document.getElementById('review-sample-content');
    if (!container) {
      debugSystem.log('❌ Sample review container not found');
      return;
    }

    // Check if this is a sample request
    const requestType = document.getElementById('request-type')?.value;
    if (requestType !== 'sample-request') {
      document.getElementById('sample-summary-review').style.display = 'none';
      return;
    }

    // Show sample review section
    document.getElementById('sample-summary-review').style.display = 'block';
    document.getElementById('bulk-garments-review').style.display = 'none';

    // Get sample data from SampleManager
    const sampleData = window.sampleManager ? window.sampleManager.getSampleData() : null;
    if (!sampleData) {
      container.innerHTML = '<div class="review-empty">Sample data not available</div>';
      return;
    }

    let html = '<div class="review-section">';

    // Sample Options Summary
    html += '<div class="techpack-sample-review-summary">';
    html += '<h4 class="techpack-sample-review-title">Selected Sample Options</h4>';

    let hasOptions = false;

    // Black/Raw Sample
    if (sampleData.blackRaw.enabled) {
      hasOptions = true;
      const leadTime = '1-2 weeks';
      html += `
        <div class="techpack-sample-review-item">
          <div class="techpack-sample-review-item__header">
            <span class="techpack-sample-review-item__title">🔲 Black/Raw Sample Garment</span>
            <span class="techpack-sample-review-item__badge techpack-sample-review-item__badge--fast">Fastest</span>
          </div>
          <div class="techpack-sample-review-item__details">
            <span class="techpack-sample-review-detail">Fabric: ${sampleData.blackRaw.fabricColor || 'TBD'}</span>
            <span class="techpack-sample-review-detail">Size: ${sampleData.blackRaw.size || 'TBD'}</span>
            <span class="techpack-sample-review-detail">Lead Time: ${leadTime}</span>
          </div>
        </div>
      `;
    }

    // Lab Dips
    if (sampleData.labDips.length > 0) {
      hasOptions = true;
      html += `
        <div class="techpack-sample-review-item">
          <div class="techpack-sample-review-item__header">
            <span class="techpack-sample-review-item__title">🔲 Lab Dip Color Swatches</span>
            <span class="techpack-sample-review-item__badge">€${sampleData.labDips.length * 25}</span>
          </div>
          <div class="techpack-sample-review-item__details">
      `;
      
      sampleData.labDips.forEach((labDip, index) => {
        html += `<span class="techpack-sample-review-detail">Dip ${index + 1}: ${labDip.pantone || 'Pantone TBD'}</span>`;
      });
      
      html += `
            <span class="techpack-sample-review-detail">Lead Time: Parallel production (no delay)</span>
          </div>
        </div>
      `;
    }

    // Custom Color Sample
    if (sampleData.customColor.enabled) {
      hasOptions = true;
      html += `
        <div class="techpack-sample-review-item">
          <div class="techpack-sample-review-item__header">
            <span class="techpack-sample-review-item__title">🔲 Custom-Colored Sample Garment</span>
            <span class="techpack-sample-review-item__badge techpack-sample-review-item__badge--slow">+3 weeks</span>
          </div>
          <div class="techpack-sample-review-item__details">
            <span class="techpack-sample-review-detail">Color: ${sampleData.customColor.pantone || 'TBD'}</span>
            <span class="techpack-sample-review-detail">Size: ${sampleData.customColor.size || 'TBD'}</span>
            <span class="techpack-sample-review-detail">Lead Time: 3-4 weeks (after lab dip approval)</span>
            <span class="techpack-sample-review-detail">Confirmation: ${sampleData.customColor.confirmed ? '✅ Confirmed' : '❌ Pending'}</span>
          </div>
        </div>
      `;
    }

    if (!hasOptions) {
      html += '<div class="review-empty">No sample options selected</div>';
    }

    html += '</div>'; // End sample options summary

    // Pattern Information
    html += '<div class="techpack-sample-pattern-review">';
    html += '<h4 class="techpack-sample-review-title">Pattern Information</h4>';
    
    const patterns = sampleData.patterns;
    const hasPatternInfo = patterns.colorwayIncluded || patterns.sizingDefined || patterns.needsSizeHelp;
    
    if (hasPatternInfo) {
      if (patterns.colorwayIncluded) {
        html += '<div class="techpack-sample-pattern-item">✅ Colorway information included in techpack</div>';
      }
      if (patterns.sizingDefined) {
        html += '<div class="techpack-sample-pattern-item">✅ Sizing/measurements defined in techpack</div>';
      }
      if (patterns.needsSizeHelp) {
        html += '<div class="techpack-sample-pattern-item">🔧 Client needs sizing/fit assistance</div>';
      }
    } else {
      html += '<div class="techpack-sample-pattern-item">📋 Standard sizing and basic fit assumed</div>';
    }
    
    html += '</div>'; // End pattern information

    // Cost Breakdown
    html += '<div class="techpack-sample-cost-breakdown">';
    html += '<h4 class="techpack-sample-review-title">Sample Cost Breakdown</h4>';
    
    let totalCost = 0;
    
    if (sampleData.blackRaw.enabled) {
      html += '<div class="techpack-sample-cost-item">Black/Raw Sample: €35</div>';
      totalCost += 35;
    }
    
    if (sampleData.labDips.length > 0) {
      const labDipCost = sampleData.labDips.length * 25;
      html += `<div class="techpack-sample-cost-item">Lab Dips (${sampleData.labDips.length}): €${labDipCost}</div>`;
      totalCost += labDipCost;
    }
    
    if (sampleData.customColor.enabled) {
      html += '<div class="techpack-sample-cost-item">Custom Color Sample: €65</div>';
      totalCost += 65;
    }
    
    html += `
      <div class="techpack-sample-cost-total">
        <strong>Estimated Total: €${totalCost}</strong>
      </div>
    `;
    
    html += '</div>'; // End cost breakdown

    // Lead Time Summary
    let maxLeadTime = '1-2 weeks';
    if (sampleData.customColor.enabled) {
      maxLeadTime = '3-4 weeks';
    } else if (sampleData.blackRaw.enabled || sampleData.labDips.length > 0) {
      maxLeadTime = '1-2 weeks';
    }

    html += `
      <div class="techpack-sample-timeline">
        <h4 class="techpack-sample-review-title">Expected Timeline</h4>
        <div class="techpack-sample-timeline-item">
          <strong>Total Lead Time: ${maxLeadTime}</strong>
        </div>
        ${sampleData.customColor.enabled ? 
          '<div class="techpack-sample-timeline-note">⚠️ Custom color samples require lab dip approval first, adding 2-3 weeks to the timeline.</div>' : 
          ''
        }
      </div>
    `;

    html += '</div>'; // End review section

    container.innerHTML = html;
    debugSystem.log('✅ Sample review populated', { sampleData, totalCost });
  }
  
  // Main function to populate all review content
  async function populateReviewContent() {
    debugSystem.log('📋 Populating all review content...');
    
    try {
      populateClientReview();
      
      // Handle file uploads and populate files review
      await handleFileUploadsForReview();
      
      // Populate garments OR sample review based on request type
      const requestType = document.getElementById('request-type')?.value;
      if (requestType === 'sample-request') {
        populateSampleReview();
      } else {
        populateGarmentsReview();
      }
      
      populateSummaryReview();
      debugSystem.log('✅ All review content populated successfully');
    } catch (error) {
      debugSystem.log('❌ Error populating review content', error, 'error');
    }
  }
  
  // Handle file uploads and populate files review with URLs
  async function handleFileUploadsForReview() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    let allFiles = [];
    
    fileInputs.forEach(input => {
      if (input.files && input.files.length > 0) {
        allFiles = allFiles.concat(Array.from(input.files));
      }
    });
    
    if (allFiles.length > 0) {
      debugSystem.log('📁 Uploading files for review...', { count: allFiles.length });
      const uploadedFiles = await uploadFilesToStorage(allFiles);
      
      if (uploadedFiles.length > 0) {
        populateFilesReviewWithUrls(uploadedFiles);
        // Store uploaded files for webhook payload
        window.techpackUploadedFiles = uploadedFiles;
      } else {
        populateFilesReview(); // Fallback to standard display
      }
    } else {
      populateFilesReview(); // Standard display when no files
    }
  }
  
  // Auto-populate review when step 4 becomes visible
  function initializeReviewPopulation() {
    const step4 = document.getElementById('techpack-step-4');
    if (!step4) return;
    
    // Use MutationObserver to detect when step 4 becomes visible
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const isVisible = step4.style.display !== 'none';
          if (isVisible) {
            debugSystem.log('👀 Step 4 became visible, populating review content...');
            setTimeout(populateReviewContent, 100); // Small delay to ensure DOM is ready
          }
        }
      });
    });
    
    observer.observe(step4, { attributes: true });
    
    // Also check if step 4 is already visible
    if (step4.style.display !== 'none') {
      setTimeout(populateReviewContent, 500);
    }
  }
  
  // Initialize review population when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeReviewPopulation);
  } else {
    initializeReviewPopulation();
  }
  
  // Global mobile utilities
  window.validateAllDates = function() {
    const dateInputs = document.querySelectorAll('.techpack-form__input--date, input[type="date"]');
    let allValid = true;
    dateInputs.forEach(input => {
      if (!validateDateInput(input)) {
        allValid = false;
      }
    });
    debugSystem.log(allValid ? '✅ All dates valid' : '❌ Some dates invalid');
    return allValid;
  };
  
  // Global review utilities  
  window.refreshReview = function() {
    debugSystem.log('🔄 Manually refreshing review content...');
    populateReviewContent();
  };

  // Make quantityCalculator globally available for validation integration
  window.quantityCalculator = window.techpackApp.quantityCalculator;

  // Global helper function for getting total quantity (restored original)
  window.getTotalQuantity = function() {
    let total = 0;
    document.querySelectorAll('.techpack-size-grid__input[type="number"]').forEach(input => {
      total += parseInt(input.value) || 0;
    });
    return total;
  }

  // ===============================================
  // SAMPLE OPTIONS SYSTEM - COMPREHENSIVE LOGIC
  // ===============================================

  class SampleManager {
    constructor() {
      // New sample request data structure
      this.labDips = new Map(); // id -> { pantone, status, garmentId }
      this.sampleState = {
        type: null, // 'stock' | 'custom' | null
        stockColor: null, // 'black' | 'off-white' | 'random'
        selectedLabDipId: null,
        techpackInfo: {
          colorwayIncluded: false,
          sizingDefined: false,
          needSizingHelp: false
        }
      };
      
      // Legacy compatibility - maintain old per-garment structure for existing code
      this.perGarmentSamples = new Map();
      
      this.init();
    }

    init() {
      this.bindEventListeners();
      this.checkRequestType();
      debugSystem.log('New SampleManager initialized');
    }

    bindEventListeners() {
      // Sample type radio button changes (mutual exclusivity)
      document.addEventListener('change', (e) => {
        if (e.target.name === 'garment-sample-type') {
          this.handleSampleTypeChange(e.target.value);
        }
        
        // Stock fabric color selection
        if (e.target.name === 'stock-fabric-color') {
          this.handleStockColorChange(e.target.value);
        }
        
        // Lab dip selection for custom sample
        if (e.target.name === 'selected-lab-dip') {
          this.handleLabDipSelection(e.target.value);
        }
        
        // Techpack info checkboxes
        if (e.target.name === 'colorway-in-techpack' ||
            e.target.name === 'sizing-in-techpack' ||
            e.target.name === 'need-sizing-help') {
          this.handleTechpackInfoChange(e.target);
        }
      });

      // Lab dip management buttons
      document.addEventListener('click', (e) => {
        if (e.target.id === 'add-lab-dip') {
          this.addLabDip();
        }
        
        if (e.target.classList.contains('remove-lab-dip')) {
          const labDipId = e.target.dataset.labDipId;
          this.removeLabDip(labDipId);
        }
        
        if (e.target.classList.contains('select-lab-dip')) {
          const labDipId = e.target.dataset.labDipId;
          this.selectLabDipForCustom(labDipId);
        }
      });
      
      // Pantone prefill functionality
      document.addEventListener('blur', (e) => {
        if (e.target.id === 'pantone-prefill') {
          this.handlePantonePrefill(e.target.value);
        }
      });

      debugSystem.log('New sample management event listeners bound');
    }

    // Handle sample type selection (mutual exclusivity)
    handleSampleTypeChange(type) {
      this.sampleState.type = type;
      
      // Show/hide sample options based on selection
      this.updateCardStates();
      
      // Update dynamic subtitle for stock option
      this.updateStockSubtitle();
      
      // Update lab dip selection area when custom color is selected
      this.updateLabDipSelectionArea();
      
      // Update validation and pricing
      this.updateValidation();
      this.updatePricing();
      
      debugSystem.log('Sample type changed to:', type);
    }

    // Update card visual states and show/hide options
    updateCardStates() {
      const stockCard = document.querySelector('[data-sample-type="stock"]');
      const customCard = document.querySelector('[data-sample-type="custom"]');
      const stockOptions = stockCard?.querySelector('.techpack-sample-options');
      const customOptions = customCard?.querySelector('.techpack-sample-options');
      
      if (this.sampleState.type === 'stock') {
        stockOptions?.style && (stockOptions.style.display = 'block');
        customOptions?.style && (customOptions.style.display = 'none');
        customCard?.setAttribute('data-disabled', 'true');
        stockCard?.removeAttribute('data-disabled');
      } else if (this.sampleState.type === 'custom') {
        customOptions?.style && (customOptions.style.display = 'block');
        stockOptions?.style && (stockOptions.style.display = 'none');
        stockCard?.setAttribute('data-disabled', 'true');
        customCard?.removeAttribute('data-disabled');
      } else {
        stockOptions?.style && (stockOptions.style.display = 'none');
        customOptions?.style && (customOptions.style.display = 'none');
        stockCard?.removeAttribute('data-disabled');
        customCard?.removeAttribute('data-disabled');
      }
    }

    // Handle stock fabric color selection
    handleStockColorChange(color) {
      this.sampleState.stockColor = color;
      this.updateStockSubtitle();
      this.updateValidation();
      debugSystem.log('Stock color selected:', color);
    }

    // Update stock subtitle based on selection
    updateStockSubtitle() {
      const subtitle = document.getElementById('stock-subtitle');
      if (!subtitle) return;
      
      if (this.sampleState.stockColor) {
        const colorMap = {
          'black': 'Black',
          'off-white': 'Off-White / Natural', 
          'random': 'Random Stock Color'
        };
        subtitle.textContent = `Selected: ${colorMap[this.sampleState.stockColor]}`;
      } else {
        subtitle.textContent = 'Choose from available stock colors for faster turnaround.';
      }
    }

    // Add new lab dip
    addLabDip() {
      const pantoneInput = document.getElementById('new-lab-dip-pantone');
      const pantone = pantoneInput?.value?.trim();
      
      if (!pantone) {
        this.showError('Please enter a Pantone TCX code');
        return;
      }
      
      // Generate unique ID
      const labDipId = Date.now().toString();
      
      // Add to data structure
      this.labDips.set(labDipId, {
        pantone: pantone,
        status: 'Pending',
        garmentId: null // For future expansion if needed
      });
      
      // Update UI
      this.renderLabDipList(); // This now calls updateLabDipSelectionArea() internally
      this.updateCustomLabDipDropdown(); // Keep for compatibility
      this.updatePricing();
      this.updateValidation();
      
      // Clear input
      if (pantoneInput) pantoneInput.value = '';
      
      debugSystem.log('Lab dip added:', pantone);
    }

    // Remove lab dip
    removeLabDip(labDipId) {
      if (this.labDips.has(labDipId)) {
        // If this lab dip was selected for custom, clear selection
        if (this.sampleState.selectedLabDipId === labDipId) {
          this.sampleState.selectedLabDipId = null;
        }
        
        this.labDips.delete(labDipId);
        this.renderLabDipList();
        this.updateCustomLabDipDropdown();
        this.updatePricing();
        this.updateValidation();
        
        debugSystem.log('Lab dip removed:', labDipId);
      }
    }

    // Handle lab dip selection for custom sample
    handleLabDipSelection(labDipId) {
      this.sampleState.selectedLabDipId = labDipId || null;
      this.updateValidation();
      debugSystem.log('Lab dip selected for custom:', labDipId);
    }

    // Select lab dip for custom sample (from table)
    selectLabDipForCustom(labDipId) {
      const dropdown = document.getElementById('selected-lab-dip');
      if (dropdown) {
        dropdown.value = labDipId;
        this.handleLabDipSelection(labDipId);
      }
    }

    // Handle techpack info checkbox changes
    handleTechpackInfoChange(checkbox) {
      const field = checkbox.name.replace('-', '_');
      if (field in this.sampleState.techpackInfo) {
        this.sampleState.techpackInfo[field] = checkbox.checked;
        debugSystem.log('Techpack info updated:', field, checkbox.checked);
      }
    }

    // Handle pantone prefill
    handlePantonePrefill(pantone) {
      if (pantone.trim()) {
        // Auto-add as lab dip
        const pantoneInput = document.getElementById('new-lab-dip-pantone');
        if (pantoneInput) {
          pantoneInput.value = pantone;
          this.addLabDip();
        }
      }
    }

    // Render lab dip list in UI using new card template
    renderLabDipList() {
      const container = document.getElementById('lab-dip-list');
      const emptyState = document.getElementById('lab-dip-empty');
      const template = document.getElementById('lab-dip-template');
      
      if (!container || !template) return;
      
      // Clear existing cards (except empty state)
      const existingCards = container.querySelectorAll('.techpack-lab-dip-card');
      existingCards.forEach(card => card.remove());
      
      if (this.labDips.size === 0) {
        emptyState && (emptyState.style.display = 'block');
        return;
      }
      
      emptyState && (emptyState.style.display = 'none');
      
      this.labDips.forEach((labDip, id) => {
        // Clone the template
        const cardClone = template.content.cloneNode(true);
        const card = cardClone.querySelector('.techpack-lab-dip-card');
        
        // Set lab dip ID
        card.dataset.labDipId = id;
        
        // Update pantone display in header
        const pantoneDisplay = card.querySelector('.techpack-lab-dip-card__pantone');
        if (pantoneDisplay) {
          pantoneDisplay.textContent = `PANTONE ${labDip.pantone}`;
        }
        
        // Update color preview
        const colorCircle = card.querySelector('.techpack-lab-dip-card__color-circle');
        if (colorCircle) {
          // For now, use a default color - could be enhanced with color matching
          colorCircle.style.backgroundColor = this.pantoneToHex(labDip.pantone) || '#6b7280';
        }
        
        // Set up pantone input
        const pantoneInput = card.querySelector('.techpack-lab-dip-pantone');
        if (pantoneInput) {
          pantoneInput.value = labDip.pantone;
        }
        
        // Set up color picker
        const colorPicker = card.querySelector('.techpack-lab-dip-color');
        if (colorPicker) {
          colorPicker.value = this.pantoneToHex(labDip.pantone) || '#6b7280';
        }
        
        // Update garment name placeholders
        this.updateGarmentNamePlaceholders(card);
        
        // Set up remove button
        const removeBtn = card.querySelector('.techpack-lab-dip-card__remove');
        if (removeBtn) {
          removeBtn.addEventListener('click', () => this.removeLabDip(id));
        }
        
        // Set up select button
        const selectBtn = card.querySelector('.techpack-lab-dip-select-btn');
        if (selectBtn) {
          selectBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectLabDipForCustom(id);
          });
        }
        
        container.appendChild(card);
      });
      
      // Also update the selection area
      this.updateLabDipSelectionArea();
    }

    // Update lab dip selection area for custom color samples
    updateLabDipSelectionArea() {
      // Find all garments that have custom color selected
      const garments = document.querySelectorAll('.techpack-garment');
      
      garments.forEach(garment => {
        const customRadio = garment.querySelector('input[name="garment-sample-type"][value="custom"]:checked');
        
        if (customRadio) {
          const selectionArea = garment.querySelector('.techpack-lab-dip-selection');
          const selectionEmpty = garment.querySelector('.techpack-lab-dip-selection-empty');
          const selectionTemplate = document.getElementById('lab-dip-selection-card-template');
          
          if (!selectionArea || !selectionTemplate) return;
          
          // Clear existing selection cards
          const existingCards = selectionArea.querySelectorAll('.techpack-lab-dip-selection-card');
          existingCards.forEach(card => card.remove());
          
          if (this.labDips.size === 0) {
            // Show empty state
            selectionEmpty && (selectionEmpty.style.display = 'block');
            selectionArea.classList.remove('has-items');
          } else {
            // Hide empty state and show lab dip cards
            selectionEmpty && (selectionEmpty.style.display = 'none');
            selectionArea.classList.add('has-items');
            
            // Create selection card for each lab dip
            this.labDips.forEach((labDip, id) => {
              const cardClone = selectionTemplate.content.cloneNode(true);
              const card = cardClone.querySelector('.techpack-lab-dip-selection-card');
              
              // Set lab dip ID
              card.dataset.labDipId = id;
              
              // Update pantone text
              const pantoneDisplay = card.querySelector('.techpack-lab-dip-selection-card__pantone');
              if (pantoneDisplay) {
                pantoneDisplay.textContent = `PANTONE ${labDip.pantone}`;
              }
              
              // Update color circle
              const colorCircle = card.querySelector('.techpack-lab-dip-selection-card__color-circle');
              if (colorCircle) {
                colorCircle.style.backgroundColor = this.pantoneToHex(labDip.pantone) || '#6b7280';
              }
              
              // Update garment name placeholders
              this.updateGarmentNamePlaceholders(card, garment);
              
              // Set initial status message
              const statusText = card.querySelector('.techpack-lab-dip-selection-card__status .status-text');
              if (statusText) {
                const garmentName = this.getGarmentName(garment);
                statusText.innerHTML = `You'll receive a fabric swatch together with the ${garmentName}`;
              }
              
              // Set up selection button
              const selectBtn = card.querySelector('.techpack-lab-dip-selection-card__select-btn');
              if (selectBtn) {
                selectBtn.addEventListener('click', (e) => {
                  e.stopPropagation();
                  this.handleLabDipSelectionCardClick(id, garment);
                });
              }
              
              // Also make the whole card clickable
              card.addEventListener('click', () => {
                this.handleLabDipSelectionCardClick(id, garment);
              });
              
              selectionArea.appendChild(card);
            });
          }
        }
      });
    }

    // Handle lab dip selection card click in custom color area
    handleLabDipSelectionCardClick(labDipId, garmentElement) {
      // Remove selection from all other cards in this garment
      const allSelectionCards = garmentElement.querySelectorAll('.techpack-lab-dip-selection-card');
      allSelectionCards.forEach(card => {
        card.classList.remove('selected');
        const statusText = card.querySelector('.techpack-lab-dip-selection-card__status .status-text');
        if (statusText) {
          const garmentName = this.getGarmentName(garmentElement);
          statusText.innerHTML = `You'll receive a fabric swatch together with the ${garmentName}`;
        }
      });
      
      // Add selection to clicked card
      const selectedCard = garmentElement.querySelector(`[data-lab-dip-id="${labDipId}"]`);
      if (selectedCard) {
        selectedCard.classList.add('selected');
        const statusText = selectedCard.querySelector('.techpack-lab-dip-selection-card__status .status-text');
        if (statusText) {
          statusText.innerHTML = `<strong>We will apply this pantone color to the above selected garment</strong>`;
        }
      }
      
      // Update the sample state
      this.sampleState.selectedLabDipId = labDipId;
      
      // Clear validation errors
      const labDipSelection = garmentElement.querySelector('.techpack-lab-dip-selection');
      const labDipGroup = labDipSelection?.closest('.techpack-form__group');
      const labDipError = labDipGroup?.querySelector('.techpack-form__error');
      if (labDipGroup) labDipGroup.classList.remove('techpack-form__group--error');
      if (labDipError) labDipError.textContent = '';
      
      // Trigger validation update
      this.updateValidation();
      
      debugSystem.log('Lab dip selected for custom color', { labDipId, garmentElement: garmentElement.dataset.garmentId });
    }

    // Update garment name placeholders in a given element
    updateGarmentNamePlaceholders(element, garmentElement = null) {
      const placeholders = element.querySelectorAll('.garment-name-placeholder');
      
      placeholders.forEach(placeholder => {
        let garmentName = 'garment';
        
        if (garmentElement) {
          garmentName = this.getGarmentName(garmentElement);
        } else {
          // Try to find the closest garment element
          const closestGarment = element.closest('.techpack-garment');
          if (closestGarment) {
            garmentName = this.getGarmentName(closestGarment);
          }
        }
        
        placeholder.textContent = garmentName;
      });
    }

    // Get garment name from garment element
    getGarmentName(garmentElement) {
      const garmentTypeSelect = garmentElement.querySelector('select[name="garmentType"]');
      const garmentNumber = garmentElement.querySelector('.techpack-garment__number')?.textContent || '1';
      
      if (garmentTypeSelect && garmentTypeSelect.value) {
        return garmentTypeSelect.value;
      }
      
      return `Garment ${garmentNumber}`;
    }

    // Convert pantone code to hex color (simplified)
    pantoneToHex(pantoneCode) {
      // This is a simplified conversion - could be enhanced with a proper pantone database
      const pantoneColors = {
        '18-3949': '#5A4FCF',
        '19-4052': '#0F4C75',
        '17-5126': '#00A693',
        '18-1664': '#C93A40',
        '14-0848': '#F5DF4D',
        '18-1142': '#A0522D',
        '19-3938': '#2D1B69',
        '15-3817': '#E4C2C6',
        '17-1456': '#D2386C',
        '19-4007': '#2E3440'
      };
      
      // Extract just the color number part
      const colorCode = pantoneCode.replace(/[^0-9-]/g, '');
      
      // Return matched color or a default gray
      return pantoneColors[colorCode] || '#6B7280';
    }

    // Update custom sample lab dip dropdown (DEPRECATED - keeping for compatibility)
    updateCustomLabDipDropdown() {
      const dropdown = document.getElementById('selected-lab-dip');
      if (!dropdown) return;
      
      // Clear existing options
      dropdown.innerHTML = '';
      
      if (this.labDips.size === 0) {
        dropdown.innerHTML = '<option value="">No Lab Dips available - add one below</option>';
        dropdown.disabled = true;
      } else {
        dropdown.innerHTML = '<option value="">Select a Lab Dip...</option>';
        this.labDips.forEach((labDip, id) => {
          const disabled = labDip.status === 'Rejected';
          dropdown.innerHTML += `<option value="${id}" ${disabled ? 'disabled' : ''}>${labDip.pantone} (${labDip.status})</option>`;
        });
        dropdown.disabled = false;
      }
      
      // Restore selection if valid
      if (this.sampleState.selectedLabDipId && this.labDips.has(this.sampleState.selectedLabDipId)) {
        dropdown.value = this.sampleState.selectedLabDipId;
      }
    }

    // Calculate total pricing
    calculateTotal() {
      let total = 0;
      
      if (this.sampleState.type === 'stock') {
        total += 35;
      } else if (this.sampleState.type === 'custom') {
        total += 65;
      }
      
      // Add lab dip costs
      total += this.labDips.size * 25;
      
      return total;
    }

    // Update pricing display
    updatePricing() {
      const total = this.calculateTotal();
      // Update any pricing displays in the UI
      debugSystem.log('Total sample cost:', `€${total}`);
    }

    // Validate current sample selection
    validateSampleSelection() {
      if (!this.sampleState.type) {
        return { valid: false, message: "Select a sample type to proceed." };
      }
      
      if (this.sampleState.type === 'custom') {
        if (this.labDips.size === 0) {
          return { valid: false, message: "No Lab Dips yet. Add one in Section B to proceed." };
        }
        
        if (!this.sampleState.selectedLabDipId) {
          return { valid: false, message: "Select which Lab Dip to use for dyeing." };
        }
        
        const selectedDip = this.labDips.get(this.sampleState.selectedLabDipId);
        if (selectedDip?.status === 'Rejected') {
          return { valid: false, message: "Selected Lab Dip is rejected. Choose another or add a new one." };
        }
      }
      
      return { valid: true };
    }

    // Update validation UI
    updateValidation() {
      const validation = this.validateSampleSelection();
      const nextBtn = document.getElementById('step-3-next');
      const warningDiv = document.getElementById('lab-dip-warning');
      
      if (nextBtn) {
        nextBtn.disabled = !validation.valid;
      }
      
      // Show/hide warnings
      if (warningDiv) {
        if (this.sampleState.type === 'custom' && this.labDips.size === 0) {
          warningDiv.style.display = 'block';
          warningDiv.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" fill="currentColor"/>
            </svg>
            No Lab Dips yet. Add one in Section B to proceed.
          `;
        } else if (!validation.valid && validation.message.includes('Select which')) {
          warningDiv.style.display = 'block';
          warningDiv.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" fill="currentColor"/>
            </svg>
            Select which Lab Dip to use for dyeing.
          `;
        } else {
          warningDiv.style.display = 'none';
        }
      }
      
      debugSystem.log('Sample validation:', validation);
    }

    // Show error message
    showError(message) {
      console.error('Sample Manager Error:', message);
      // Could integrate with existing error display system
    }

    // Get sample data for Step 4 review
    getSampleData() {
      return {
        type: this.sampleState.type,
        stockColor: this.sampleState.stockColor,
        selectedLabDipId: this.sampleState.selectedLabDipId,
        labDips: Array.from(this.labDips.entries()).map(([id, labDip]) => ({
          id,
          ...labDip
        })),
        techpackInfo: { ...this.sampleState.techpackInfo },
        totalCost: this.calculateTotal()
      };
    }

    checkRequestType() {
      const requestType = state.formData.requestType;
      const subtitle = document.getElementById('step-3-subtitle');
      
      // Don't interfere with existing UI state if no request type is set yet
      if (requestType === null || requestType === undefined) {
        debugSystem.log('checkRequestType: No request type set, skipping UI modification');
        return;
      }
      
      // Get UI elements to show/hide
      const perGarmentSampleSections = document.querySelectorAll('.techpack-garment-samples[data-sample-request-only]');
      const quantityTracker = document.querySelector('.techpack-quantity-tracker');
      const colorwaysSections = document.querySelectorAll('.techpack-colorways');
      const bulkOnlyElements = document.querySelectorAll('[data-bulk-request-only]');
      
      if (requestType === 'sample-request') {
        // SAMPLE REQUEST MODE: Show sample options, hide bulk elements
        
        // Show per-garment sample options
        perGarmentSampleSections.forEach(section => {
          section.style.display = 'block';
        });
        
        // Hide quantity tracker bar (not needed for samples)
        if (quantityTracker) {
          quantityTracker.style.display = 'none';
        }
        
        // Hide all colorways sections (no quantities/colors needed for samples)
        colorwaysSections.forEach(section => {
          section.style.display = 'none';
        });
        
        // Hide bulk-only elements
        bulkOnlyElements.forEach(element => {
          element.style.display = 'none';
        });
        
        if (subtitle) subtitle.textContent = 'Choose sample options for each garment and provide garment details';
        
        debugSystem.log('Sample request mode - simplified interface active', {
          sampleSections: perGarmentSampleSections.length,
          hiddenColorways: colorwaysSections.length,
          quantityTrackerHidden: !!quantityTracker
        });
      } else if (requestType === 'bulk-order-request') {
        // BULK REQUEST MODE: Show bulk elements, hide sample options
        
        // Hide per-garment sample options
        perGarmentSampleSections.forEach(section => {
          section.style.display = 'none';
        });
        
        // Show quantity tracker bar
        if (quantityTracker) {
          quantityTracker.style.display = 'block';
        }
        
        // Show all colorways sections
        colorwaysSections.forEach(section => {
          section.style.display = 'block';
        });
        
        // Show bulk-only elements
        bulkOnlyElements.forEach(element => {
          element.style.display = 'block';
        });
        
        if (subtitle) subtitle.textContent = 'Define your garment details and quantity requirements';
        
        debugSystem.log('Bulk request mode - full interface active', {
          hiddenSampleSections: perGarmentSampleSections.length,
          visibleColorways: colorwaysSections.length,
          quantityTrackerVisible: !!quantityTracker
        });
      } else if (requestType === 'quotation') {
        // QUOTATION MODE: Simple interface, no samples, no quantities
        
        // Hide per-garment sample options
        perGarmentSampleSections.forEach(section => {
          section.style.display = 'none';
        });
        
        // Hide quantity tracker bar (not needed for quotations)
        if (quantityTracker) {
          quantityTracker.style.display = 'none';
        }
        
        // Hide all colorways sections (no quantities/colors needed for quotations)
        colorwaysSections.forEach(section => {
          section.style.display = 'none';
        });
        
        // Hide bulk-only elements
        bulkOnlyElements.forEach(element => {
          element.style.display = 'none';
        });
        
        if (subtitle) subtitle.textContent = 'Provide garment specifications to receive pricing estimates';
        
        debugSystem.log('Quotation mode - simple interface active', {
          hiddenSampleSections: perGarmentSampleSections.length,
          hiddenColorways: colorwaysSections.length,
          quantityTrackerHidden: !!quantityTracker
        });
      } else {
        // If requestType is null, don't change the UI - wait for user selection
        if (requestType === null || requestType === undefined) {
          return;
        }
        
        // DEFAULT/FALLBACK: Hide everything extra for unknown types
        perGarmentSampleSections.forEach(section => {
          section.style.display = 'none';
        });
        
        if (quantityTracker) {
          quantityTracker.style.display = 'none';
        }
        
        colorwaysSections.forEach(section => {
          section.style.display = 'none';
        });
        
        bulkOnlyElements.forEach(element => {
          element.style.display = 'none';
        });
        
        if (subtitle) subtitle.textContent = 'Define your garment details';
      }

      // Update validation
      this.updateNextButtonState();
    }

    // Initialize sample data for a new garment
    initializeGarmentSampleData(garmentId) {
      // Ensure perGarmentSamples exists (legacy compatibility)
      if (!this.perGarmentSamples) {
        this.perGarmentSamples = new Map();
        debugSystem.log('SampleManager: Re-initialized perGarmentSamples map for legacy compatibility');
      }
      
      if (!this.perGarmentSamples.has(garmentId)) {
        this.perGarmentSamples.set(garmentId, {
          blackRaw: { 
            enabled: false, 
            size: '', 
            cost: 35 
          },
          labDip: { 
            enabled: false, 
            pantoneColors: [{ code: '', hex: '#ffffff', cost: 25 }], // Default first color
            totalCost: 25,
            size: '' 
          },
          customColor: { 
            enabled: false, 
            pantoneCode: '',
            pantoneHex: '#ffffff',
            size: '',
            cost: 65 
          },
          typeOfFit: '', // New field for fit type
          totalCost: 0
        });
        debugSystem.log('Initialized enhanced sample data for garment', { garmentId });
      }
    }

    // Handle per-garment sample option toggle
    handlePerGarmentSampleToggle(checkbox) {
      const garmentElement = checkbox.closest('.techpack-garment');
      const garmentId = garmentElement?.dataset.garmentId;
      
      if (!garmentId) return;

      this.initializeGarmentSampleData(garmentId);
      const sampleData = this.perGarmentSamples.get(garmentId);
      const sampleType = checkbox.name;
      const expandableOption = checkbox.closest('.techpack-sample-expandable');
      const subOptions = expandableOption?.querySelector('.techpack-sample-sub-options');

      // Update sample data based on checkbox type
      if (sampleType === 'sample-black-raw') {
        sampleData.blackRaw.enabled = checkbox.checked;
      } else if (sampleType === 'sample-lab-dip') {
        sampleData.labDip.enabled = checkbox.checked;
      } else if (sampleType === 'sample-custom-color') {
        sampleData.customColor.enabled = checkbox.checked;
      }

      // Show/hide sub-options with animation
      if (subOptions) {
        if (checkbox.checked) {
          subOptions.style.display = 'block';
          // Ensure unique radio button names for each garment
          this.updateRadioButtonNames(subOptions, garmentId);
        } else {
          subOptions.style.display = 'none';
        }
      }

      // Update sample details section visibility
      this.updateSampleDetailsVisibility(garmentElement, sampleData);
      
      // Update cost and summary
      this.updateGarmentSampleCost(garmentId);
      this.updateGarmentSampleSummary(garmentElement, sampleData);

      // Trigger validation to check if sample size and fit type are required
      if (typeof stepManager !== 'undefined' && stepManager.validateStep3) {
        setTimeout(() => stepManager.validateStep3(), 100);
      }

      debugSystem.log('Enhanced per-garment sample option toggled', { 
        garmentId, 
        sampleType, 
        enabled: checkbox.checked,
        hasSubOptions: !!subOptions
      });
    }

    // Ensure unique radio button names for each garment
    updateRadioButtonNames(subOptions, garmentId) {
      const radioInputs = subOptions.querySelectorAll('input[type="radio"]');
      radioInputs.forEach(input => {
        if (input.name.includes('blackraw-fabric-color')) {
          input.name = `blackraw-fabric-color-${garmentId}`;
        }
      });
    }

    // Main sample checkbox toggle handler
    handlePerGarmentSampleToggle(checkbox) {
      const garmentElement = checkbox.closest('.techpack-garment');
      const garmentId = garmentElement?.dataset.garmentId;
      
      if (!garmentId) return;

      this.initializeGarmentSampleData(garmentId);
      const sampleData = this.perGarmentSamples.get(garmentId);
      const sampleType = checkbox.name;
      const isChecked = checkbox.checked;
      
      // Find the expandable sub-options section
      const expandableOption = checkbox.closest('.techpack-sample-expandable');
      const subOptions = expandableOption?.querySelector('.techpack-sample-sub-options');
      
      // Update data based on sample type
      if (sampleType === 'sample-black-raw') {
        sampleData.blackRaw.enabled = isChecked;
        if (!isChecked) {
          sampleData.blackRaw.size = '';
        }
      } else if (sampleType === 'sample-lab-dip') {
        sampleData.labDip.enabled = isChecked;
        if (!isChecked) {
          // Reset lab dip data
          sampleData.labDip.pantoneColors = [{ code: '', hex: '#ffffff', cost: 25 }];
          sampleData.labDip.totalCost = 25;
          sampleData.labDip.size = '';
        }
      } else if (sampleType === 'sample-custom-color') {
        sampleData.customColor.enabled = isChecked;
        if (!isChecked) {
          sampleData.customColor.pantoneCode = '';
          sampleData.customColor.pantoneHex = '#ffffff';
          sampleData.customColor.size = '';
        }
      }
      
      // Show/hide sub-options
      if (subOptions) {
        subOptions.style.display = isChecked ? 'block' : 'none';
      }
      
      // Update sample details visibility and costs
      this.updateSampleDetailsVisibility(garmentElement, sampleData);
      this.updateGarmentSampleCost(garmentId);
      this.updateGarmentSampleSummary(garmentElement, sampleData);
      
      debugSystem.log('Sample toggle updated', { garmentId, sampleType, isChecked });
    }

    // Handle PANTONE input changes for both lab dip and custom color
    handlePantoneInput(input) {
      const garmentElement = input.closest('.techpack-garment');
      const garmentId = garmentElement?.dataset.garmentId;
      
      if (!garmentId) return;

      this.initializeGarmentSampleData(garmentId);
      const sampleData = this.perGarmentSamples.get(garmentId);
      
      // Determine if this is for lab dip or custom color
      if (input.closest('.techpack-labdip-pantone-system')) {
        // Lab dip PANTONE input
        const pantoneIndex = parseInt(input.dataset.pantoneIndex);
        const pantoneCode = input.value.trim();
        
        if (sampleData.labDip.pantoneColors[pantoneIndex]) {
          sampleData.labDip.pantoneColors[pantoneIndex].code = pantoneCode;
          // In a real implementation, you'd fetch the hex color from PANTONE API
          sampleData.labDip.pantoneColors[pantoneIndex].hex = this.getPantoneHexColor(pantoneCode);
        }
        
      } else if (input.classList.contains('custom-color-pantone')) {
        // Custom color PANTONE input
        const pantoneCode = input.value.trim();
        sampleData.customColor.pantoneCode = pantoneCode;
        sampleData.customColor.pantoneHex = this.getPantoneHexColor(pantoneCode);
        
        // Update color preview
        const preview = input.closest('.techpack-custom-color-pantone').querySelector('.techpack-color-swatch');
        if (preview) {
          preview.style.backgroundColor = sampleData.customColor.pantoneHex;
        }
      }
      
      this.updateGarmentSampleSummary(garmentElement, sampleData);
      debugSystem.log('PANTONE input updated', { garmentId, inputValue: input.value });
    }

    // Helper method to get hex color from PANTONE code (simplified)
    getPantoneHexColor(pantoneCode) {
      // In a real implementation, this would call a PANTONE API
      // For now, return a placeholder based on the code
      if (!pantoneCode) return '#ffffff';
      
      // Simple hash-based color generation for demo
      let hash = 0;
      for (let i = 0; i < pantoneCode.length; i++) {
        hash = pantoneCode.charCodeAt(i) + ((hash << 5) - hash);
      }
      const color = Math.floor(Math.abs((Math.sin(hash) * 10000) % 1) * 16777215).toString(16);
      return '#' + '000000'.substring(0, 6 - color.length) + color;
    }

    // Add new Lab Dip PANTONE color
    addLabDipPantone(button) {
      const garmentElement = button.closest('.techpack-garment');
      const garmentId = garmentElement?.dataset.garmentId;
      
      if (!garmentId) return;

      const sampleData = this.perGarmentSamples.get(garmentId);
      const colorsList = button.parentElement.querySelector('.techpack-labdip-colors-list');
      const newIndex = sampleData.labDip.pantoneColors.length;

      // Add new color to data
      sampleData.labDip.pantoneColors.push({ 
        code: '', 
        hex: '#ffffff', 
        cost: 25 
      });

      // Create new color input element
      const colorItem = document.createElement('div');
      colorItem.className = 'techpack-labdip-color-item';
      colorItem.setAttribute('data-color-index', newIndex);
      colorItem.innerHTML = `
        <input type="text" placeholder="e.g., 18-3949 TPX" class="techpack-pantone-input" data-pantone-index="${newIndex}">
        <button type="button" class="techpack-btn techpack-btn--small remove-labdip-color">×</button>
      `;

      colorsList.appendChild(colorItem);

      // Update costs
      this.updateLabDipCosts(garmentId);
      this.updateGarmentSampleCost(garmentId);

      debugSystem.log('Lab dip PANTONE color added', { garmentId, newIndex });
    }

    // Remove Lab Dip PANTONE color
    removeLabDipPantone(button) {
      const garmentElement = button.closest('.techpack-garment');
      const garmentId = garmentElement?.dataset.garmentId;
      const colorItem = button.closest('.techpack-labdip-color-item');
      const colorIndex = parseInt(colorItem.getAttribute('data-color-index'));
      
      if (!garmentId) return;

      const sampleData = this.perGarmentSamples.get(garmentId);
      
      // Don't allow removing the last color
      if (sampleData.labDip.pantoneColors.length <= 1) {
        debugSystem.log('Cannot remove last lab dip color', { garmentId });
        return;
      }

      // Remove from data
      sampleData.labDip.pantoneColors.splice(colorIndex, 1);
      
      // Remove from DOM
      colorItem.remove();

      // Re-index remaining color items
      const remainingItems = garmentElement.querySelectorAll('.techpack-labdip-color-item');
      remainingItems.forEach((item, index) => {
        item.setAttribute('data-color-index', index);
        const input = item.querySelector('.techpack-pantone-input');
        if (input) {
          input.setAttribute('data-pantone-index', index);
        }
      });

      // Update costs
      this.updateLabDipCosts(garmentId);
      this.updateGarmentSampleCost(garmentId);

      debugSystem.log('Lab dip PANTONE color removed', { garmentId, removedIndex: colorIndex });
    }

    // Update Lab Dip costs display
    updateLabDipCosts(garmentId) {
      const garmentElement = document.querySelector(`[data-garment-id="${garmentId}"]`);
      if (!this.perGarmentSamples) {
        debugSystem.log('updateLabDipCosts: perGarmentSamples not initialized');
        return;
      }
      const sampleData = this.perGarmentSamples.get(garmentId);
      
      const colorCount = sampleData.labDip.pantoneColors.length;
      const totalCost = colorCount * 25;
      
      // Update data
      sampleData.labDip.totalCost = totalCost;

      // Update UI displays
      const costDisplay = garmentElement.querySelector('.labdip-cost');
      const totalCostDisplay = garmentElement.querySelector('.labdip-total-cost');
      
      if (costDisplay) costDisplay.textContent = totalCost;
      if (totalCostDisplay) totalCostDisplay.textContent = totalCost;

      debugSystem.log('Lab dip costs updated', { garmentId, colorCount, totalCost });
    }

    // Update sample details section based on selections
    updateSampleDetailsVisibility(garmentElement, sampleData) {
      const detailsSection = garmentElement.querySelector('.techpack-sample-details');
      if (!detailsSection) return;

      const hasAnySelection = sampleData.blackRaw.enabled || 
                             sampleData.labDip.enabled || 
                             sampleData.customColor.enabled;

      detailsSection.style.display = hasAnySelection ? 'block' : 'none';
    }

    // Update per-garment sample form details (size, fabric color)
    updatePerGarmentSampleDetails(input) {
      const garmentElement = input.closest('.techpack-garment');
      const garmentId = garmentElement?.dataset.garmentId;
      
      if (!garmentId) return;

      this.initializeGarmentSampleData(garmentId);
      const sampleData = this.perGarmentSamples.get(garmentId);

      if (input.classList.contains('techpack-garment-sample-size')) {
        // Update size for all enabled sample types
        const size = input.value;
        if (sampleData.blackRaw.enabled) sampleData.blackRaw.size = size;
        if (sampleData.labDip.enabled) sampleData.labDip.size = size;
        if (sampleData.customColor.enabled) sampleData.customColor.size = size;
      } else if (input.classList.contains('techpack-garment-fit-type')) {
        // Update type of fit for this garment
        sampleData.typeOfFit = input.value;
      }

      this.updateGarmentSampleCost(garmentId);
      this.updateGarmentSampleSummary(garmentElement, sampleData);

      // Trigger validation to clear errors when size/fit type is selected
      if (typeof stepManager !== 'undefined' && stepManager.validateStep3) {
        setTimeout(() => stepManager.validateStep3(), 100);
      }

      debugSystem.log('Per-garment sample details updated', { garmentId, sampleData });
    }

    // Calculate and update sample cost for a specific garment
    updateGarmentSampleCost(garmentId) {
      if (!this.perGarmentSamples) {
        debugSystem.log('updateGarmentSampleCost: perGarmentSamples not initialized');
        return;
      }
      const sampleData = this.perGarmentSamples.get(garmentId);
      if (!sampleData) return;

      let totalCost = 0;
      if (sampleData.blackRaw.enabled) totalCost += 35;
      if (sampleData.labDip.enabled) totalCost += sampleData.labDip.totalCost;
      if (sampleData.customColor.enabled) totalCost += 65;

      sampleData.totalCost = totalCost;

      // Update cost display in DOM
      const garmentElement = document.querySelector(`[data-garment-id="${garmentId}"]`);
      const costElement = garmentElement?.querySelector('.techpack-garment-sample-cost');
      if (costElement) {
        costElement.textContent = totalCost;
      }
    }

    // Update comprehensive sample summary for a specific garment
    updateGarmentSampleSummary(garmentElement, sampleData) {
      const summaryElement = garmentElement.querySelector('.techpack-garment-sample-summary');
      if (!summaryElement) return;

      const summaryParts = [];
      
      // Get main garment details
      const garmentType = garmentElement.querySelector('[name="garmentType"]')?.value;
      const fabricType = garmentElement.querySelector('[name="fabricType"]')?.value;
      const fitType = sampleData.typeOfFit;
      
      // Add garment basics to summary
      if (garmentType) summaryParts.push(garmentType);
      if (fabricType) summaryParts.push(fabricType);
      if (fitType) {
        // Convert fit type value to display name
        const fitDisplayNames = {
          'measurements-inside-techpack': 'Measurements inside Tech-Pack',
          'oversized-fit': 'Oversized Fit',
          'relaxed-fit': 'Relaxed Fit'
        };
        summaryParts.push(fitDisplayNames[fitType] || fitType);
      }
      
      // Add sample options
      const sampleOptions = [];
      
      if (sampleData.blackRaw.enabled) {
        const size = sampleData.blackRaw.size;
        const sampleText = size ? `Black/Raw Sample (${size.toUpperCase()})` : 'Black/Raw Sample';
        sampleOptions.push(sampleText);
      }
      
      if (sampleData.labDip.enabled) {
        const colorCount = sampleData.labDip.pantoneColors.length;
        sampleOptions.push(`Lab Dip (${colorCount} color${colorCount !== 1 ? 's' : ''})`);
      }
      
      if (sampleData.customColor.enabled) {
        const pantoneCode = sampleData.customColor.pantoneCode;
        const displayText = pantoneCode ? `Custom Color (${pantoneCode})` : 'Custom Color';
        sampleOptions.push(displayText);
      }
      
      // Combine garment details and sample options
      if (sampleOptions.length > 0) {
        summaryParts.push(...sampleOptions);
      }

      // Display comprehensive summary
      summaryElement.textContent = summaryParts.length > 0 ? summaryParts.join(', ') : 'None';
    }

    // Get all per-garment sample data (for step 4 review)
    getAllSampleData() {
      const allSampleData = {};
      for (const [garmentId, sampleData] of this.perGarmentSamples.entries()) {
        allSampleData[garmentId] = { ...sampleData };
      }
      return allSampleData;
    }

    // Calculate total sample cost across all garments
    getTotalSampleCost() {
      let totalCost = 0;
      for (const [garmentId, sampleData] of this.perGarmentSamples.entries()) {
        totalCost += sampleData.totalCost || 0;
      }
      return totalCost;
    }

    // Validate sample selections for sample requests (external API)
    validateSampleSelections() {
      const requestType = state.formData.requestType;
      if (requestType !== 'sample-request') return true;

      // Use new validation system
      const validation = this.validateSampleSelection();
      return validation.valid;
    }

    // Update next button state based on sample validation
    updateNextButtonState() {
      const nextBtn = document.getElementById('step-3-next');
      if (!nextBtn) return;

      const requestType = document.getElementById('request-type')?.value;
      
      if (requestType === 'sample-request') {
        // For sample requests, enable if at least one garment has samples
        const isValid = this.validateSampleSelections();
        // FIXED: Don't disable the button - let user proceed and handle validation elsewhere
        // nextBtn.disabled = !isValid;
        debugSystem.log('Sample validation result', { isValid });
      }
    }

    // REMOVED: Old global sample methods - replaced with per-garment system above
    
    // Legacy method for compatibility - now uses new sample system
    getSampleData() {
      // Return sample data in the format expected by other parts of the system
      const sampleData = {
        type: this.sampleState.type,
        stockColor: this.sampleState.stockColor,
        selectedLabDipId: this.sampleState.selectedLabDipId,
        labDips: Array.from(this.labDips.entries()).map(([id, labDip]) => ({
          id,
          ...labDip
        })),
        techpackInfo: { ...this.sampleState.techpackInfo },
        totalCost: this.calculateTotal(),
        // Legacy compatibility
        hasSelections: this.sampleState.type !== null
      };
      
      return sampleData;
    }

    // Tooltip Management
    toggleTooltip(trigger) {
      const tooltipId = trigger.dataset.tooltip;
      const tooltip = document.getElementById(`tooltip-${tooltipId}`);
      
      if (!tooltip) return;

      // Close other tooltips first
      this.closeAllTooltips();

      // Position and show tooltip
      this.positionTooltip(tooltip, trigger);
      tooltip.style.display = 'block';
      tooltip.classList.add('techpack-tooltip--active');

      debugSystem.log('Tooltip opened', { tooltipId });
    }

    closeAllTooltips() {
      const tooltips = document.querySelectorAll('.techpack-tooltip');
      tooltips.forEach(tooltip => {
        tooltip.style.display = 'none';
        tooltip.classList.remove('techpack-tooltip--active');
      });
    }

    positionTooltip(tooltip, trigger) {
      const triggerRect = trigger.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      const viewportWidth = window.innerWidth;

      // Calculate preferred position (below and centered to trigger)
      let top = triggerRect.bottom + scrollTop + 10;
      let left = triggerRect.left + scrollLeft + (triggerRect.width / 2) - 200; // Center tooltip

      // Keep tooltip within viewport boundaries
      const tooltipWidth = 400; // max-width from CSS
      const rightEdge = left + tooltipWidth;
      
      if (rightEdge > viewportWidth - 20) {
        left = viewportWidth - tooltipWidth - 20;
      }
      
      if (left < 20) {
        left = 20;
      }

      // Apply positioning
      tooltip.style.position = 'absolute';
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
      tooltip.style.maxWidth = '400px';
      tooltip.style.zIndex = '10000';
      
      debugSystem.log('Tooltip positioned', { 
        triggerRect, 
        calculatedTop: top, 
        calculatedLeft: left 
      });
    }
  }

  // Initialize Sample Manager
  const sampleManager = new SampleManager();
  
  // Make it globally available
  window.sampleManager = sampleManager;

  // Integrate with existing step navigation - FIXED to use proper validation flow
  const originalValidateStep = window.validateStep;
  window.validateStep = function(stepNumber) {
    if (stepNumber === 3) {
      // Use the main validateStep3() method which handles both sample and bulk requests properly
      if (typeof stepManager !== 'undefined' && stepManager.validateStep3) {
        return stepManager.validateStep3();
      }
      
      // Fallback: if stepManager not available, handle basic validation
      const requestType = document.getElementById('request-type')?.value;
      if (requestType === 'sample-request') {
        return sampleManager.validateSampleSelections();
      }
    }
    return originalValidateStep ? originalValidateStep(stepNumber) : true;
  };

  // Initialize Help System
  const helpSystem = {
    init() {
      this.bindHelpEvents();
    },

    bindHelpEvents() {
      // Help button click
      const helpBtn = document.getElementById('step-3-help-btn');
      if (helpBtn) {
        helpBtn.addEventListener('click', () => this.showHelpModal());
      }

      // Close help modal
      const closeBtn = document.getElementById('close-help-modal');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.hideHelpModal());
      }

      // Close on backdrop click
      const modal = document.getElementById('step-3-help-modal');
      if (modal) {
        const backdrop = modal.querySelector('.techpack-modal__backdrop');
        if (backdrop) {
          backdrop.addEventListener('click', () => this.hideHelpModal());
        }
      }

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.hideHelpModal();
        }
      });
    },

    showHelpModal() {
      const modal = document.getElementById('step-3-help-modal');
      if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        setTimeout(() => {
          const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (firstFocusable) {
            firstFocusable.focus();
          }
        }, 100);

        debugSystem.log('Help modal opened');
      }
    },

    hideHelpModal() {
      const modal = document.getElementById('step-3-help-modal');
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Return focus to help button
        const helpBtn = document.getElementById('step-3-help-btn');
        if (helpBtn) {
          helpBtn.focus();
        }

        debugSystem.log('Help modal closed');
      }
    }
  };

  // Initialize help system
  helpSystem.init();

  // Make help system globally available
  window.helpSystem = helpSystem;

})();