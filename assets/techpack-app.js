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
    MIN_DELIVERY_WEEKS: 6
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

      fileUploader.calculateRequiredGarments();

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
          
          // Check Pantone selection for each colorway (elegant system)
          const pantoneElegant = colorway.querySelector('.techpack-pantone-elegant');
          if (pantoneElegant) {
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
        
        debugSystem.log('Review populated', null, 'success');
        
        // Ensure edit buttons are working after review is populated
        setTimeout(() => {
          formInitializer.setupEditButtons();
        }, 100);
      }, 50);
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
          this.showError(`Maximum ${CONFIG.MAX_FILES} files allowed`);
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
        this.showError(`Invalid file type: ${file.name}`);
        return false;
      }

      if (file.size > CONFIG.MAX_FILE_SIZE) {
        this.showError(`File too large: ${file.name} (max ${Utils.formatFileSize(CONFIG.MAX_FILE_SIZE)})`);
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
        type: ''
      });

      // Animate in
      animationManager.slideIn(fileItem, 'right');

      debugSystem.log('File added', { fileId, fileName: file.name });
      this.validateStep2();
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
      
      state.formData.requiredGarmentCount = Math.max(totalFiles, 1);
      
      debugSystem.log('Required garments calculated', { 
        totalFiles: totalFiles,
        requiredGarments: state.formData.requiredGarmentCount 
      });
    }

    showError(message) {
      debugSystem.log('File error', message, 'error');
      // You could implement a toast notification system here
      console.error(message);
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
      
      // Color picker and elegant Pantone system
      const colorPicker = colorway.querySelector('.techpack-color-picker__input');
      const colorPreview = colorway.querySelector('.techpack-color-picker__preview');
      const pantoneElegant = colorway.querySelector('.techpack-pantone-elegant');
      const pantoneValidationMsg = colorway.querySelector('.techpack-pantone-validation-message');
      
      if (pantoneElegant) {
        const pantoneColorSwatch = pantoneElegant.querySelector('.techpack-pantone-color-swatch');
        const pantoneCodeInput = pantoneElegant.querySelector('[data-pantone-code]');
        const confidenceSpan = pantoneElegant.querySelector('[data-confidence]');
        const customizeBtn = pantoneElegant.querySelector('[data-customize-pantone]');
        const customSection = pantoneElegant.querySelector('.techpack-pantone-custom');
        const customInput = pantoneElegant.querySelector('[data-custom-pantone]');
        const applyBtn = pantoneElegant.querySelector('[data-apply-custom]');
        const cancelBtn = pantoneElegant.querySelector('[data-cancel-custom]');
        
        colorPicker.addEventListener('change', () => {
          colorPreview.style.backgroundColor = colorPicker.value;
          
          // Update Pantone swatch color
          if (pantoneColorSwatch) {
            pantoneColorSwatch.style.backgroundColor = colorPicker.value;
          }
          
          // Auto-select closest Pantone color
          const closestPantone = this.findClosestPantoneColor(colorPicker.value);
          if (pantoneCodeInput && closestPantone) {
            pantoneCodeInput.value = closestPantone.code;
            pantoneCodeInput.placeholder = '';
          }
          
          // Update confidence
          if (confidenceSpan && closestPantone) {
            confidenceSpan.textContent = `${closestPantone.confidence}%`;
          }
          
          // Update state
          const garmentData = state.formData.garments.find(g => g.id === garmentId);
          if (garmentData) {
            const colorwayData = garmentData.colorways.find(c => c.id === colorwayId);
            if (colorwayData) {
              colorwayData.color = colorPicker.value;
              colorwayData.pantoneCode = closestPantone ? closestPantone.code : '';
            }
          }
          
          this.validatePantoneSelection(colorway);
        });
        
        // Customize button
        if (customizeBtn) {
          customizeBtn.addEventListener('click', () => {
            customSection.style.display = 'flex';
            customizeBtn.style.display = 'none';
          });
        }
        
        // Apply custom Pantone
        if (applyBtn) {
          applyBtn.addEventListener('click', () => {
            const customCode = customInput.value.trim();
            if (customCode) {
              pantoneCodeInput.value = customCode;
              pantoneCodeInput.placeholder = '';
              confidenceSpan.textContent = 'Custom';
              
              // Update state
              const garmentData = state.formData.garments.find(g => g.id === garmentId);
              if (garmentData) {
                const colorwayData = garmentData.colorways.find(c => c.id === colorwayId);
                if (colorwayData) {
                  colorwayData.pantoneCode = customCode;
                }
              }
            }
            
            customSection.style.display = 'none';
            customizeBtn.style.display = 'flex';
            customInput.value = '';
            this.validatePantoneSelection(colorway);
          });
        }
        
        // Cancel custom
        if (cancelBtn) {
          cancelBtn.addEventListener('click', () => {
            customSection.style.display = 'none';
            customizeBtn.style.display = 'flex';
            customInput.value = '';
          });
        }
      }
      
      colorPreview.style.backgroundColor = colorPicker.value;

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

    // Validate Pantone selection for elegant system
    validatePantoneSelection(colorway) {
      const pantoneElegant = colorway.querySelector('.techpack-pantone-elegant');
      const pantoneValidationMsg = colorway.querySelector('.techpack-pantone-validation-message');
      
      if (!pantoneElegant || !pantoneValidationMsg) return true;
      
      const pantoneCodeInput = pantoneElegant.querySelector('[data-pantone-code]');
      const hasValidPantone = pantoneCodeInput && pantoneCodeInput.value.trim();
      
      if (hasValidPantone) {
        pantoneValidationMsg.textContent = `✓ PANTONE color selected: ${pantoneCodeInput.value}`;
        pantoneValidationMsg.className = 'techpack-pantone-validation-message success';
        pantoneValidationMsg.style.display = 'block';
      } else {
        pantoneValidationMsg.textContent = 'Please select a color to auto-generate PANTONE match.';
        pantoneValidationMsg.className = 'techpack-pantone-validation-message error';
        pantoneValidationMsg.style.display = 'block';
      }
      
      return hasValidPantone;
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
      
      // Mobile scroll lock functions
      const isMobile = () => window.innerWidth <= 768;
      const lockBodyScroll = () => {
        if (isMobile()) {
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';
          document.body.style.top = `-${window.scrollY}px`;
        }
      };
      
      const unlockBodyScroll = () => {
        if (isMobile()) {
          const scrollY = document.body.style.top;
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.top = '';
          if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
          }
        }
      };
      
      // Open modal
      openBtn.addEventListener('click', () => {
        lockBodyScroll();
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        debugSystem.log('✅ Client verification modal opened');
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
          setTimeout(() => this.showStep(1), 300);
        });
      }
      
      if (newClientBtn) {
        newClientBtn.addEventListener('click', () => {
          debugSystem.log('🆕 New client selected');
          closeModal();
          setTimeout(() => this.showStep(1), 300);
        });
      }
      
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

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="techpack-btn__spinner" width="16" height="16" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1" fill="none" opacity="0.3"/>
          <path d="M8 2v6" stroke="currentColor" stroke-width="1"/>
        </svg>
        Submitting...
      `;

      debugSystem.log('Form submission started');

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        this.showThankYou();
        debugSystem.log('Form submitted successfully', null, 'success');
      } catch (error) {
        debugSystem.log('Form submission failed', error, 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit Tech-Pack';
      }
    }

// EXISTING: Keep your exact showThankYou method
    showThankYou() {
      const step4 = document.querySelector('#techpack-step-4');
      if (!step4) return;

      const totalQuantity = quantityCalculator.getTotalQuantityFromAllColorways();
      
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
                    <span class="techpack-success__detail-value">TP-${Date.now().toString().slice(-8)}</span>
                  </div>
                  
                  <div class="techpack-success__detail-item">
                    <span class="techpack-success__detail-label">Total Quantity</span>
                    <span class="techpack-success__detail-value">${totalQuantity} units</span>
                  </div>
                  
                  <div class="techpack-success__detail-item">
                    <span class="techpack-success__detail-label">Files Uploaded</span>
                    <span class="techpack-success__detail-value">${state.formData.files.length} ${state.formData.files.length === 1 ? 'file' : 'files'}</span>
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

})();