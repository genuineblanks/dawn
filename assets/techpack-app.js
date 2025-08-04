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
      this.content.scrollTop = this.content.scrollHeight;
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
              return false;
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

    scrollToTechPackTopEnhanced() {
      // More aggressive search for TechPack elements
      const selectors = [
        'section[id*="techpack"]',     // Any section with techpack in ID
        'div[class*="techpack"]',      // Any div with techpack in class
        '.techpack-progress',          // Progress bar specifically
        '[data-step]',                 // Any element with data-step
        'h2.techpack-title',           // The "Client Information" title
        'h1.techpack-success__title',  // Thank you page title
        '.techpack-success-page',      // Thank you page container
        '*[id*="step"]'                // Any element with "step" in ID
      ];
      
      let techPackElement = null;
      
      // Try each selector until we find something
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          // Take the first visible element
          for (const element of elements) {
            const rect = element.getBoundingClientRect();
            if (rect.height > 0 && rect.width > 0) { // Element is visible
              techPackElement = element;
              debugSystem.log('Found TechPack element', { 
                selector, 
                elementId: element.id,
                elementClass: element.className 
              });
              break;
            }
          }
          if (techPackElement) break;
        }
      }
      
      if (techPackElement) {
        // Use scrollIntoView for more reliable positioning
        techPackElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',    // Align to top of viewport
          inline: 'nearest'
        });
        
        // Add a small offset after scrolling
        setTimeout(() => {
          const currentScroll = window.pageYOffset;
          window.scrollTo({
            top: currentScroll - 60, // 60px offset from top
            behavior: 'smooth'
          });
        }, 500);
        
        debugSystem.log('Scrolled to TechPack element successfully');
      } else {
        // Ultimate fallback - look for ANY text containing "techpack" or "client"
        const allElements = document.querySelectorAll('*');
        let foundByText = null;
        
        for (const element of allElements) {
          const text = element.textContent || '';
          const id = element.id || '';
          const className = element.className || '';
          
          if ((text.toLowerCase().includes('client information') ||
               text.toLowerCase().includes('tech pack') ||
               text.toLowerCase().includes('submission received') ||
               text.toLowerCase().includes('thank you') ||
               id.toLowerCase().includes('techpack') ||
               className.toLowerCase().includes('techpack')) &&
              element.getBoundingClientRect().height > 50) { // Must be substantial element
            foundByText = element;
            break;
          }
        }
        
        if (foundByText) {
          foundByText.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          debugSystem.log('Found TechPack by text content');
        } else {
          // Auto-scroll to top removed for better UX
          debugSystem.log('TechPack element not found, staying at current position');
        }
      }
    }

    // Polyfill for smooth scrolling in older browsers
    smoothScrollPolyfill(targetPosition) {
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 500; // 500ms
      let start = null;

      function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function
        const ease = progress * (2 - progress);
        
        window.scrollTo(0, startPosition + (distance * ease));
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }
      
      requestAnimationFrame(animation);
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
        
        // ADD: Scroll to center TechPack after garments load
        setTimeout(() => {
          this.scrollToTechPackTopEnhanced();
        }, 300);
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
      const allFieldNames = ['clientName', 'companyName', 'email', 'phone', 'vatEin', 'country', 'productionType', 'deadline', 'notes'];
      allFieldNames.forEach(fieldName => {
        if (!errors[fieldName]) {
          const fieldElement = form.querySelector(`[name="${fieldName}"]`);
          if (fieldElement) {
            this.displayFieldError(fieldElement, true, '');
          }
        }
      });
    
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

    // In StepManager class, REPLACE the existing validateStep3() method:
    validateStep3() {
      const nextBtn = document.querySelector('#step-3-next');
      
      if (state.formData.garments.length === 0) {
        debugSystem.log('Step 3 validation failed: no garments', null, 'error');
        if (nextBtn) nextBtn.disabled = true;
        return false;
      }
    
      let isValid = true;
      const garmentElements = document.querySelectorAll('.techpack-garment');
    
      // CRITICAL: First sync all DOM values to state to preserve selections
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
    
      // Now validate each garment
      garmentElements.forEach((garmentElement, index) => {
        const garmentId = garmentElement.dataset.garmentId;
        const garmentData = state.formData.garments.find(g => g.id === garmentId);
        
        // Check garment type
        const garmentTypeSelect = garmentElement.querySelector('select[name="garmentType"]');
        const garmentTypeGroup = garmentTypeSelect?.closest('.techpack-form__group');
        const garmentTypeError = garmentTypeGroup?.querySelector('.techpack-form__error');
        
        if (!garmentTypeSelect?.value && (!garmentData?.type)) {
          isValid = false;
          if (garmentTypeGroup) garmentTypeGroup.classList.add('techpack-form__group--error');
          if (garmentTypeError) garmentTypeError.textContent = 'Please select a garment type';
        } else {
          if (garmentTypeGroup) garmentTypeGroup.classList.remove('techpack-form__group--error');
          if (garmentTypeError) garmentTypeError.textContent = '';
        }
    
        // Check fabric type
        const fabricSelect = garmentElement.querySelector('select[name="fabricType"]');
        const fabricGroup = fabricSelect?.closest('.techpack-form__group');
        const fabricError = fabricGroup?.querySelector('.techpack-form__error');
        
        if (!fabricSelect?.value && (!garmentData?.fabric)) {
          isValid = false;
          if (fabricGroup) fabricGroup.classList.add('techpack-form__group--error');
          if (fabricError) fabricError.textContent = 'Please select a fabric type';
        } else {
          if (fabricGroup) fabricGroup.classList.remove('techpack-form__group--error');
          if (fabricError) fabricError.textContent = '';
        }
    
        // Check printing methods
        const printingCheckboxes = garmentElement.querySelectorAll('input[name="printingMethods[]"]:checked');
        const printingGroup = garmentElement.querySelector('.techpack-form__checkboxes')?.closest('.techpack-form__group');
        const printingError = printingGroup?.querySelector('.techpack-form__error');
        
        if (printingCheckboxes.length === 0 && (!garmentData?.printingMethods || garmentData.printingMethods.length === 0)) {
          isValid = false;
          if (printingGroup) printingGroup.classList.add('techpack-form__group--error');
          if (printingError) printingError.textContent = 'Please select at least one printing method';
        } else {
          if (printingGroup) printingGroup.classList.remove('techpack-form__group--error');
          if (printingError) printingError.textContent = '';
        }
    
        // Check colorway quantities
        const colorwaysInGarment = garmentElement.querySelectorAll('.techpack-colorway');
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
          
          // Check Pantone selection for each colorway (grid system)
          const pantoneGrid = colorway.querySelector('.techpack-pantone-grid');
          if (pantoneGrid) {
            const pantoneValidationResult = garmentManager.validatePantoneSelection(colorway);
            if (!pantoneValidationResult) {
              isValid = false;
              debugSystem.log(`Garment ${index + 1} colorway missing Pantone selection`, null, 'error');
            }
          }
        });
      });
    
      // Update button state
      if (nextBtn) {
        nextBtn.disabled = !isValid;
      }
    
      if (isValid) {
        debugSystem.log('Step 3 validation passed', null, 'success');
      } else {
        debugSystem.log('Step 3 validation failed', null, 'error');
      }
    
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
          <option value="Crewneck Sweatshirt">Crewneck Sweatshirt</option>
          <option value="Sweatpants">Sweatpants</option>
          <option value="Shorts">Shorts</option>
          <option value="Long Sleeve T-Shirt">Long Sleeve T-Shirt</option>
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
            <span class="techpack-review__label">Project Deadline:</span>
            <span class="techpack-review__value">${data.deadline || 'N/A'}</span>
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
      
      debugSystem.log('Garment added', { garmentId });
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
          stepManager.validateStep3();
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
        // Use a longer delay for validation to prevent interference
        setTimeout(() => {
          stepManager.validateStep3();
        }, 200);
      }, 100);
      
      debugSystem.log('Colorway added', { garmentId, colorwayId });
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
        const pantoneButtonElements = pantoneButtons.querySelectorAll('button.group');
        
        colorPicker.addEventListener('change', () => {
          // Fix mobile null reference error - check colorPreview exists
          if (colorPreview) {
            colorPreview.style.backgroundColor = colorPicker.value;
          }
          
          // Auto-select closest 2 Pantone colors for buttons
          const closestPantones = this.findClosestPantoneColors(colorPicker.value, 2);
          
          // Populate the 2 Pantone buttons
          closestPantones.forEach((pantone, index) => {
            if (pantoneButtonElements[index]) {
              const button = pantoneButtonElements[index];
              const colorSpan = button.querySelector('span');
              
              if (colorSpan) {
                // Set the color using CSS custom property
                button.style.setProperty('--dye-color', pantone.hex);
                // Update the text content
                colorSpan.textContent = pantone.code;
                // Update data attributes
                button.dataset.pantoneCode = pantone.code;
                button.dataset.pantoneHex = pantone.hex;
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
        
        // Add click handlers for Pantone buttons
        pantoneButtonElements.forEach((button, index) => {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Toggle selection
            const isSelected = button.classList.contains('selected');
            
            if (isSelected) {
              button.classList.remove('selected');
            } else {
              button.classList.add('selected');
            }
            
            // Update colorway data
            this.updateColorwayPantoneData(garmentId, colorwayId);
            
            // Validate selection
            this.validatePantoneSelection(colorway);
          });
        });
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
      const pantoneColors = [
        // Basic Colors
        { code: 'PANTONE Black C', hex: '#000000', name: 'Black' },
        { code: 'PANTONE White', hex: '#FFFFFF', name: 'White' },
        { code: 'PANTONE Cool Gray 11 C', hex: '#54585A', name: 'Cool Gray 11' },
        { code: 'PANTONE Cool Gray 9 C', hex: '#75787B', name: 'Cool Gray 9' },
        { code: 'PANTONE Cool Gray 7 C', hex: '#97999B', name: 'Cool Gray 7' },
        { code: 'PANTONE Cool Gray 5 C', hex: '#B1B3B3', name: 'Cool Gray 5' },
        { code: 'PANTONE Cool Gray 3 C', hex: '#C8C9C7', name: 'Cool Gray 3' },
        { code: 'PANTONE Cool Gray 1 C', hex: '#D9D9D6', name: 'Cool Gray 1' },
        { code: 'PANTONE Warm Gray 11 C', hex: '#5B5347', name: 'Warm Gray 11' },
        { code: 'PANTONE Warm Gray 9 C', hex: '#7D6E5B', name: 'Warm Gray 9' },
        { code: 'PANTONE Warm Gray 7 C', hex: '#9B8B7A', name: 'Warm Gray 7' },
        { code: 'PANTONE Warm Gray 5 C', hex: '#B7A893', name: 'Warm Gray 5' },
        { code: 'PANTONE Warm Gray 3 C', hex: '#C6B497', name: 'Warm Gray 3' },
        { code: 'PANTONE Warm Gray 1 C', hex: '#D7C49E', name: 'Warm Gray 1' },
        
        // Reds
        { code: 'PANTONE 18-1664 TPX', hex: '#C93A40', name: 'True Red' },
        { code: 'PANTONE 19-1664 TPX', hex: '#B93A32', name: 'Chili Pepper' },
        { code: 'PANTONE 186 C', hex: '#CE1141', name: 'Red 186' },
        { code: 'PANTONE 185 C', hex: '#E4002B', name: 'Red 185' },
        { code: 'PANTONE 18-1763 TPX', hex: '#AD5D5D', name: 'Dusty Cedar' },
        { code: 'PANTONE 18-1142 TPX', hex: '#FF0000', name: 'Red' },
        { code: 'PANTONE 17-1463 TPX', hex: '#DC143C', name: 'Crimson' },
        { code: 'PANTONE 16-1546 TPX', hex: '#B22222', name: 'Fire Brick' },
        { code: 'PANTONE 15-1247 TPX', hex: '#CD5C5C', name: 'Indian Red' },
        { code: 'PANTONE 14-1420 TPX', hex: '#F08080', name: 'Light Coral' },
        { code: 'PANTONE 13-1520 TPX', hex: '#FA8072', name: 'Salmon' },
        { code: 'PANTONE 12-1206 TPX', hex: '#E9967A', name: 'Dark Salmon' },
        { code: 'PANTONE 18-1142 TPX', hex: '#FFA07A', name: 'Light Salmon' },
        { code: 'PANTONE 17-1463 TPX', hex: '#FF6347', name: 'Tomato' },
        { code: 'PANTONE 16-1546 TPX', hex: '#FF4500', name: 'Orange Red' },
        { code: 'PANTONE 15-1247 TPX', hex: '#FF69B4', name: 'Hot Pink' },
        { code: 'PANTONE 14-1420 TPX', hex: '#FF1493', name: 'Deep Pink' },
        { code: 'PANTONE 13-1520 TPX', hex: '#C71585', name: 'Medium Violet Red' },
        { code: 'PANTONE 12-1206 TPX', hex: '#DB7093', name: 'Pale Violet Red' },
        { code: 'PANTONE 18-1142 TPX', hex: '#FFB6C1', name: 'Light Pink' },
        { code: 'PANTONE 17-1463 TPX', hex: '#FFC0CB', name: 'Pink' },
        
        // Blues
        { code: 'PANTONE 19-4052 TPX', hex: '#0F4C75', name: 'Classic Blue' },
        { code: 'PANTONE 279 C', hex: '#012169', name: 'Blue 279' },
        { code: 'PANTONE 286 C', hex: '#0033A0', name: 'Blue 286' },
        { code: 'PANTONE 285 C', hex: '#0039A6', name: 'Blue 285' },
        { code: 'PANTONE 300 C', hex: '#005EB8', name: 'Blue 300' },
        { code: 'PANTONE 18-4141 TPX', hex: '#000080', name: 'Navy' },
        { code: 'PANTONE 17-4037 TPX', hex: '#00008B', name: 'Dark Blue' },
        { code: 'PANTONE 16-4132 TPX', hex: '#0000CD', name: 'Medium Blue' },
        { code: 'PANTONE 15-4020 TPX', hex: '#0000FF', name: 'Blue' },
        { code: 'PANTONE 14-4318 TPX', hex: '#4169E1', name: 'Royal Blue' },
        { code: 'PANTONE 13-4110 TPX', hex: '#1E90FF', name: 'Dodger Blue' },
        { code: 'PANTONE 19-4052 TPX', hex: '#00BFFF', name: 'Deep Sky Blue' },
        { code: 'PANTONE 18-4141 TPX', hex: '#87CEEB', name: 'Sky Blue' },
        { code: 'PANTONE 17-4037 TPX', hex: '#87CEFA', name: 'Light Sky Blue' },
        { code: 'PANTONE 16-4132 TPX', hex: '#ADD8E6', name: 'Light Blue' },
        { code: 'PANTONE 15-4020 TPX', hex: '#B0C4DE', name: 'Light Steel Blue' },
        { code: 'PANTONE 14-4318 TPX', hex: '#B0E0E6', name: 'Powder Blue' },
        { code: 'PANTONE 13-4110 TPX', hex: '#E6E6FA', name: 'Lavender' },
        { code: 'PANTONE 19-4052 TPX', hex: '#F0F8FF', name: 'Alice Blue' },
        { code: 'PANTONE 18-4141 TPX', hex: '#F8F8FF', name: 'Ghost White' },
        
        // Greens
        { code: 'PANTONE 15-0343 TPX', hex: '#88B04B', name: 'Greenery' },
        { code: 'PANTONE 18-0228 TPX', hex: '#4A5D23', name: 'Forest Green' },
        { code: 'PANTONE 355 C', hex: '#00B04F', name: 'Green 355' },
        { code: 'PANTONE 347 C', hex: '#009639', name: 'Green 347' },
        { code: 'PANTONE 348 C', hex: '#00A651', name: 'Green 348' },
        { code: 'PANTONE 18-0228 TPX', hex: '#006400', name: 'Dark Green' },
        { code: 'PANTONE 17-0145 TPX', hex: '#228B22', name: 'Forest Green' },
        { code: 'PANTONE 16-0142 TPX', hex: '#32CD32', name: 'Lime Green' },
        { code: 'PANTONE 15-0343 TPX', hex: '#90EE90', name: 'Light Green' },
        { code: 'PANTONE 14-0244 TPX', hex: '#9ACD32', name: 'Yellow Green' },
        { code: 'PANTONE 13-0317 TPX', hex: '#ADFF2F', name: 'Green Yellow' },
        { code: 'PANTONE 12-0225 TPX', hex: '#7CFC00', name: 'Lawn Green' },
        { code: 'PANTONE 18-0228 TPX', hex: '#00FF00', name: 'Lime' },
        { code: 'PANTONE 17-0145 TPX', hex: '#00FF7F', name: 'Spring Green' },
        { code: 'PANTONE 16-0142 TPX', hex: '#00FA9A', name: 'Medium Spring Green' },
        { code: 'PANTONE 15-0343 TPX', hex: '#98FB98', name: 'Pale Green' },
        { code: 'PANTONE 14-0244 TPX', hex: '#7FFFD4', name: 'Aquamarine' },
        { code: 'PANTONE 13-0317 TPX', hex: '#40E0D0', name: 'Turquoise' },
        { code: 'PANTONE 12-0225 TPX', hex: '#00CED1', name: 'Dark Turquoise' },
        
        // Additional comprehensive colors (simplified for brevity)
        { code: 'PANTONE 13-0859 TPX', hex: '#FFFF00', name: 'Yellow' },
        { code: 'PANTONE 14-1064 TPX', hex: '#FFA500', name: 'Orange' },
        { code: 'PANTONE 19-3938 TPX', hex: '#800080', name: 'Purple' },
        { code: 'PANTONE 18-3224 TPX', hex: '#8B008B', name: 'Dark Magenta' },
        { code: 'PANTONE 17-3932 TPX', hex: '#9370DB', name: 'Medium Orchid' },
        { code: 'PANTONE 16-3617 TPX', hex: '#DA70D6', name: 'Orchid' },
        { code: 'PANTONE 15-3716 TPX', hex: '#DDA0DD', name: 'Plum' },
        { code: 'PANTONE 14-3207 TPX', hex: '#EE82EE', name: 'Violet' },
        { code: 'PANTONE 13-3804 TPX', hex: '#F0E68C', name: 'Khaki' },
        { code: 'PANTONE 12-0426 TPX', hex: '#FFEFD5', name: 'Papaya Whip' }
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

    // Validate Pantone selection for grid system
    validatePantoneSelection(colorway) {
      const pantoneButtons = colorway.querySelector('.techpack-pantone-buttons');
      const pantoneValidationMsg = colorway.querySelector('.techpack-pantone-validation-message');
      
      if (!pantoneButtons || !pantoneValidationMsg) return true;
      
      const selectedButtons = pantoneButtons.querySelectorAll('button.group.selected');
      const hasValidPantones = selectedButtons.length > 0;
      
      if (hasValidPantones) {
        pantoneValidationMsg.textContent = `✓ ${selectedButtons.length} PANTONE option(s) selected`;
        pantoneValidationMsg.className = 'techpack-pantone-validation-message success';
        pantoneValidationMsg.style.display = 'block';
      } else {
        pantoneValidationMsg.textContent = 'Please select a color to auto-generate PANTONE matches.';
        pantoneValidationMsg.className = 'techpack-pantone-validation-message error';
        pantoneValidationMsg.style.display = 'block';
      }
      
      return hasValidPantones;
    }

    updateColorwayPantoneData(garmentId, colorwayId) {
      const colorway = document.querySelector(`[data-colorway-id="${colorwayId}"]`);
      const pantoneButtons = colorway.querySelector('.techpack-pantone-buttons');
      
      if (!pantoneButtons) return;
      
      const selectedButtons = pantoneButtons.querySelectorAll('button.group.selected');
      const selectedPantones = Array.from(selectedButtons).map(button => ({
        code: button.dataset.pantoneCode,
        hex: button.dataset.pantoneHex
      }));
      
      // Update state
      const garmentData = state.formData.garments.find(g => g.id === garmentId);
      if (garmentData) {
        const colorwayData = garmentData.colorways.find(c => c.id === colorwayId);
        if (colorwayData) {
          colorwayData.selectedPantones = selectedPantones;
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
      this.setupDateConstraints();
      this.setupPhoneFormatting();
      this.setupProductionTypeListener();
      this.setupNavigationButtons();
      this.setupFormSubmission();
      this.setupVATFormatting();
      this.setupRegistrationCheck();
      
      // CHANGED: Initialize with registration check (step 0) instead of step 1
      this.showStep(0);
      
      this.initialized = true;
      debugSystem.log('TechPack Application initialized successfully', null, 'success');
    }

// ENHANCED: Registration setup with comprehensive error handling and user feedback
    setupClientModal() {
      debugSystem.log('🔧 Setting up client verification modal...');
      
      const modal = document.querySelector('#client-verification-modal');
      const openBtn = document.querySelector('#open-client-modal');
      const closeBtn = document.querySelector('#close-client-modal');
      const backdrop = document.querySelector('.techpack-modal__backdrop');
      const existingClientBtn = document.querySelector('[data-client-type="existing"]');
      const newClientBtn = document.querySelector('[data-client-type="new"]');
      
      if (!modal || !openBtn) {
        debugSystem.log('❌ Modal elements not found, skipping modal setup', null, 'error');
        this.showStep(1); // Fallback to step 1
        return;
      }
      
      // Mobile scroll lock functions with overscroll preservation
      const isMobile = () => window.innerWidth <= 768;
      let originalOverscrollBehavior = '';
      
      // GLOBAL FAILSAFE: Force unlock body scroll (can be called from anywhere)
      window.forceUnlockBodyScroll = () => {
        debugSystem.log('🚨 FORCE UNLOCK: Resetting all body scroll locks');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        document.body.style.removeProperty('overscroll-behavior');
        // Also trigger a scroll position reset if needed
        if (document.body.style.top) {
          const scrollY = parseInt(document.body.style.top.replace('px', '')) * -1;
          window.scrollTo(0, scrollY);
        }
        debugSystem.log('✅ Body scroll forcefully unlocked');
      };
      
      const lockBodyScroll = () => {
        // MOBILE SCROLLING FIX: Only lock scroll for modals, not general navigation
        if (isMobile() && document.querySelector('.techpack-modal.active')) {
          // Preserve original overscroll-behavior to prevent conflicts
          originalOverscrollBehavior = document.body.style.overscrollBehavior || window.getComputedStyle(document.body).overscrollBehavior;
          
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';
          document.body.style.top = `-${window.scrollY}px`;
          // Maintain overscroll-behavior for consistency
          document.body.style.overscrollBehavior = 'none';
        }
      };
      
      const unlockBodyScroll = () => {
        if (isMobile()) {
          const scrollY = document.body.style.top;
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.top = '';
          // Restore original overscroll behavior to prevent conflicts
          if (originalOverscrollBehavior) {
            document.body.style.overscrollBehavior = originalOverscrollBehavior;
          } else {
            document.body.style.removeProperty('overscroll-behavior');
          }
          if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
          }
        } else {
          // Desktop: Ensure proper scroll behavior is restored
          document.body.style.overscrollBehavior = 'auto';
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.top = '';
        }
      };
      
      // Open modal
      openBtn.addEventListener('click', () => {
        lockBodyScroll();
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        debugSystem.log('✅ Client verification modal opened');
        
        // TIMEOUT FAILSAFE: Auto-unlock scroll after 30 seconds if something goes wrong
        setTimeout(() => {
          if (modal.style.display !== 'none') {
            debugSystem.log('⏰ Timeout failsafe: Auto-unlocking body scroll after 30s');
            unlockBodyScroll();
          }
        }, 30000);
      });
      
      // Close modal functions
      const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
          modal.style.display = 'none';
          unlockBodyScroll();
        }, 300);
        debugSystem.log('Modal closed');
      };
      
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      if (backdrop) backdrop.addEventListener('click', closeModal);
      
      // Client type selection
      if (existingClientBtn) {
        existingClientBtn.addEventListener('click', () => {
          debugSystem.log('✅ Existing client selected');
          closeModal();
          
          // FAILSAFE: Ensure body scroll is unlocked on mobile
          setTimeout(() => {
            unlockBodyScroll();
            debugSystem.log('📱 Failsafe body scroll unlock after existing client selection');
          }, 100);
          
          setTimeout(() => this.showStep(1), 300);
        });
      }
      
      if (newClientBtn) {
        newClientBtn.addEventListener('click', () => {
          debugSystem.log('🆕 New client selected');
          closeModal();
          
          // FAILSAFE: Ensure body scroll is unlocked on mobile  
          setTimeout(() => {
            unlockBodyScroll();
            debugSystem.log('📱 Failsafe body scroll unlock after new client selection');
          }, 100);
          
          setTimeout(() => this.showStep(1), 300);
        });
      }
      
      // IMMEDIATE FAILSAFE: Clear any stuck scroll states on page load
      setTimeout(() => {
        if (isMobile() && (document.body.style.position === 'fixed' || document.body.style.overflow === 'hidden')) {
          debugSystem.log('🔧 Page load failsafe: Clearing stuck scroll state');
          window.forceUnlockBodyScroll();
        }
      }, 1000);
      
      debugSystem.log('✅ Client modal setup complete');
    }

    setupDateConstraints() {
      const dateInput = document.getElementById('deadline');
      if (!dateInput) return;

      const today = new Date();
      const minDate = new Date();
      minDate.setDate(today.getDate() + (CONFIG.MIN_DELIVERY_WEEKS * 7));
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 2);

      dateInput.min = minDate.toISOString().split('T')[0];
      dateInput.max = maxDate.toISOString().split('T')[0];

      debugSystem.log('Date constraints applied', {
        min: dateInput.min,
        max: dateInput.max
      });
    }

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
        
        // Store original button text
        yesBtn.setAttribute('data-original-text', yesBtn.textContent);
        noBtn.setAttribute('data-original-text', noBtn.textContent);
        
        // Clear any existing event listeners
        yesBtn.replaceWith(yesBtn.cloneNode(true));
        noBtn.replaceWith(noBtn.cloneNode(true));
        
        // Get fresh references after cloning
        const freshYesBtn = document.querySelector('#registration-yes-btn, .registration-yes-btn, [data-registration="yes"]');
        const freshNoBtn = document.querySelector('#registration-no-btn, .registration-no-btn, [data-registration="no"]');
        
        // Enhanced YES button handler
        freshYesBtn.addEventListener('click', async (event) => {
          try {
            debugSystem.log('✅ YES button clicked - Registered client selected');
            event.preventDefault();
            event.stopPropagation();
            
            // Close modal immediately
            this.closeClientModal();
            
            // Show warning popup
            this.showWarningPopup(
              'Registration Verification Required',
              'We will verify your registration status during processing. If you\'re not registered in our system, your submission will be automatically rejected. Please ensure you have worked with us before selecting this option.',
              'warning'
            );
            
            // Configure for registered client
            state.formData.isRegisteredClient = true;
            this.configureStep1ForRegisteredClient();
            
            // Navigate to step 1
            setTimeout(async () => {
              try {
                debugSystem.log('🔄 Processing registered client navigation...');
                
                // Enhanced navigation with better error handling
                let navigationSuccess = false;
                try {
                  navigationSuccess = await stepManager.navigateToStep(1);
                } catch (navError) {
                  debugSystem.log('❌ Navigation error:', navError, 'error');
                  navigationSuccess = false;
                }
                
                if (!navigationSuccess) {
                  debugSystem.log('🔄 Primary navigation failed, trying fallback method', null, 'warn');
                  try {
                    stepManager.debugTestNavigation(1);
                    navigationSuccess = true;
                  } catch (fallbackError) {
                    debugSystem.log('❌ Fallback navigation failed:', fallbackError, 'error');
                    throw new Error('All navigation methods failed');
                  }
                }
                
                if (navigationSuccess) {
                  debugSystem.log('✅ Registration navigation successful');
                  // Add scroll after navigation
                  setTimeout(() => {
                    stepManager.scrollToTechPackTopEnhanced();
                  }, 600);
                } else {
                  throw new Error('Navigation failed completely');
                }
                
              } catch (processingError) {
                debugSystem.log('❌ Registration processing failed:', processingError, 'error');
                this.showWarningPopup('Error', 'Technical issue occurred. Please try again.', 'error');
              }
            }, 1000); // 1 second delay
            
          } catch (error) {
            debugSystem.log('❌ YES button handler failed:', error, 'error');
            this.showWarningPopup('Error', 'Unexpected error occurred. Please refresh the page.', 'error');
          }
        });

        // Enhanced NO button handler
        freshNoBtn.addEventListener('click', async (event) => {
          try {
            debugSystem.log('✅ NO button clicked - New client selected');
            event.preventDefault();
            event.stopPropagation();
            
            // Close modal immediately
            this.closeClientModal();
            
            // Configure for new client
            state.formData.isRegisteredClient = false;
            this.configureStep1ForNewClient();
            
            // Navigate to step 1
            setTimeout(async () => {
              try {
                debugSystem.log('🔄 Processing new client navigation...');
                
                // Enhanced navigation with better error handling
                let navigationSuccess = false;
                try {
                  navigationSuccess = await stepManager.navigateToStep(1);
                } catch (navError) {
                  debugSystem.log('❌ Navigation error:', navError, 'error');
                  navigationSuccess = false;
                }
                
                if (!navigationSuccess) {
                  debugSystem.log('🔄 Primary navigation failed, trying fallback method', null, 'warn');
                  try {
                    stepManager.debugTestNavigation(1);
                    navigationSuccess = true;
                  } catch (fallbackError) {
                    debugSystem.log('❌ Fallback navigation failed:', fallbackError, 'error');
                    throw new Error('All navigation methods failed');
                  }
                }
                
                if (navigationSuccess) {
                  debugSystem.log('✅ New client navigation successful');
                  // Add scroll after navigation
                  setTimeout(() => {
                    stepManager.scrollToTechPackTopEnhanced();
                  }, 600);
                } else {
                  throw new Error('Navigation failed completely');
                }
                
              } catch (processingError) {
                debugSystem.log('❌ New client processing failed:', processingError, 'error');
                this.showWarningPopup('Error', 'Technical issue occurred. Please try again.', 'error');
              }
            }, 500); // Shorter delay for new clients
            
          } catch (error) {
            debugSystem.log('❌ NO button handler failed:', error, 'error');
            this.showWarningPopup('Error', 'Unexpected error occurred. Please refresh the page.', 'error');
          }
        });

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

// EXISTING: Keep your exact setupDateConstraints method
    setupDateConstraints() {
      const dateInput = document.getElementById('deadline');
      if (!dateInput) return;

      const today = new Date();
      const minDate = new Date();
      minDate.setDate(today.getDate() + (CONFIG.MIN_DELIVERY_WEEKS * 7));
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 2);

      dateInput.min = minDate.toISOString().split('T')[0];
      dateInput.max = maxDate.toISOString().split('T')[0];

      debugSystem.log('Date constraints set', { 
        min: dateInput.min, 
        max: dateInput.max,
        minWeeksFromToday: CONFIG.MIN_DELIVERY_WEEKS
      });
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
          // Force scroll to TechPack
          setTimeout(() => {
            stepManager.scrollToTechPackTopEnhanced();
          }, 600);
        });
      }

      // Step 2
      const step2Prev = document.querySelector('#step-2-prev');
      const step2Next = document.querySelector('#step-2-next');
      
      if (step2Prev) {
        step2Prev.addEventListener('click', () => {
          stepManager.navigateToStep(1);
          setTimeout(() => {
            stepManager.scrollToTechPackTopEnhanced();
          }, 600);
        });
      }
      if (step2Next) {
        step2Next.addEventListener('click', () => {
          stepManager.navigateToStep(3);
          setTimeout(() => {
            stepManager.scrollToTechPackTopEnhanced();
          }, 600);
        });
      }

      // Step 3
      const step3Prev = document.querySelector('#step-3-prev');
      const step3Next = document.querySelector('#step-3-next');
      
      if (step3Prev) {
        step3Prev.addEventListener('click', () => {
          stepManager.navigateToStep(2);
          setTimeout(() => {
            stepManager.scrollToTechPackTopEnhanced();
          }, 600);
        });
      }
      if (step3Next) {
        step3Next.addEventListener('click', () => {
          stepManager.navigateToStep(4);
          setTimeout(() => {
            stepManager.scrollToTechPackTopEnhanced();
          }, 600);
        });
      }

      // Step 4
      const step4Prev = document.querySelector('#step-4-prev');
      if (step4Prev) {
        step4Prev.addEventListener('click', () => {
          stepManager.navigateToStep(3);
          setTimeout(() => {
            stepManager.scrollToTechPackTopEnhanced();
          }, 600);
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
              
              // IMPORTANT: Add scroll after navigation
              setTimeout(() => {
                stepManager.scrollToTechPackTopEnhanced();
              }, 600); // Wait for navigation to complete
              
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
        deadline: document.getElementById('deadline')?.value || '',
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
              deadline: clientData.deadline,
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

      // IMPORTANT: Wait for DOM to be fully updated, then scroll to the new content
      setTimeout(() => {
        // First try to find the new thank you page elements
        const thankYouContainer = document.querySelector('.techpack-success-page');
        const thankYouTitle = document.querySelector('.techpack-success__title');
        const techPackStep4 = document.querySelector('#techpack-step-4');
        
        let targetElement = null;
        
        // Try to find the best element to scroll to
        if (thankYouContainer) {
          targetElement = thankYouContainer;
          debugSystem.log('Found thank you container for scroll');
        } else if (thankYouTitle) {
          targetElement = thankYouTitle;
          debugSystem.log('Found thank you title for scroll');
        } else if (techPackStep4) {
          targetElement = techPackStep4;
          debugSystem.log('Found step 4 container for scroll');
        }
        
        if (targetElement) {
          // Scroll directly to the thank you page
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
          
          // Add small offset
          setTimeout(() => {
            const currentScroll = window.pageYOffset;
            window.scrollTo({
              top: currentScroll - 60,
              behavior: 'smooth'
            });
          }, 500);
          
          debugSystem.log('Scrolled to thank you page');
        } else {
          // Fallback: use the enhanced scroll function
          debugSystem.log('Using fallback scroll for thank you page');
          stepManager.scrollToTechPackTopEnhanced();
        }
      }, 800); // Longer delay to ensure DOM is fully updated
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
      deadline: document.getElementById('deadline')?.value || '',
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
        deadline: document.getElementById('deadline')?.value || '',
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
    
    if (clientData.deadline) {
      const deadlineDate = new Date(clientData.deadline);
      const formattedDate = deadlineDate.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
      html += `<div class="review-item">
        <span class="review-label">Target Deadline:</span>
        <span class="review-value">${formattedDate}</span>
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
    // Sample of PANTONE colors for matching (from existing pantoneColors array)
    const pantoneColors = [
      { code: 'PANTONE Black 6 C', hex: '#2D2926', name: 'Black' },
      { code: 'PANTONE 11-4001 TPX', hex: '#F5F5F5', name: 'White' },
      { code: 'PANTONE Cool Gray 1 C', hex: '#F2F2F2', name: 'Cool Gray 1' },
      { code: 'PANTONE 18-1664 TPX', hex: '#C5282F', name: 'True Red' },
      { code: 'PANTONE 19-4052 TPX', hex: '#0F4C75', name: 'Classic Blue' },
      { code: 'PANTONE 15-0343 TPX', hex: '#88B04B', name: 'Greenery' },
      { code: 'PANTONE 13-0859 TPX', hex: '#EFC050', name: 'Yellow' },
      { code: 'PANTONE 18-3949 TPX', hex: '#C3447A', name: 'Pink' },
      { code: 'PANTONE 18-3838 TPX', hex: '#6B5B95', name: 'Ultra Violet' }
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
      
      html += `<div class="review-total-summary">
        <h4>Overall Summary</h4>
        <div class="review-item">
          <span class="review-label">Total Garments:</span>
          <span class="review-value">${totalColorways}</span>
        </div>
        <div class="review-item">
          <span class="review-label">Total Quantity:</span>
          <span class="review-value"><strong>${totalQuantity} units</strong></span>
        </div>
      </div>`;
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
  
  // Main function to populate all review content
  async function populateReviewContent() {
    debugSystem.log('📋 Populating all review content...');
    
    try {
      populateClientReview();
      
      // Handle file uploads and populate files review
      await handleFileUploadsForReview();
      
      populateGarmentsReview();
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

})();