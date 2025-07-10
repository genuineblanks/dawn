// ===============================================
// TECH PACK CONFIGURATION MODULE
// ===============================================

// Enhanced Configuration
const CONFIG = {
  MIN_ORDER_QUANTITY: 75,
  MIN_COLORWAY_QUANTITY: 50,
  MAX_FILES: 10,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  VALID_FILE_TYPES: ['.pdf', '.ai', '.png', '.jpg', '.jpeg', '.zip'],
  ANIMATION_DURATION: 400,
  DEBOUNCE_DELAY: 300,
  MIN_DELIVERY_WEEKS: 6
};

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
  
  // Check if country requires VAT (EU members only)
  requiresVAT(countryCode) {
    return this.euMembers.includes(countryCode);
  },
  
  // Check if country is non-EU European
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

// Utility Functions
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
    let lastFunc;
    let lastRan;
    return function() {
      const args = arguments;
      const context = this;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
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
    if (cleaned.length === 0) return '';
    
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      const remaining = cleaned.substring(1);
      return `${cleaned.charAt(0)} ${remaining.substring(0, 3)} ${remaining.substring(3)}`.trim();
    } else if (cleaned.length <= 10) {
      return `${cleaned.substring(0, 1)} ${cleaned.substring(1, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`.trim();
    } else {
      return `+${cleaned.substring(0, cleaned.length - 10)} ${cleaned.substring(cleaned.length - 10, cleaned.length - 7)} ${cleaned.substring(cleaned.length - 7, cleaned.length - 4)} ${cleaned.substring(cleaned.length - 4)}`.trim();
    }
  },

  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  validatePhone(phone) {
    const regex = /^[\+]?[\d\s\-\(\)]+$/;
    return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  },

  validateVATNumber(vat, countryCode) {
    if (!vat || !countryCode) return false;
    
    const cleanVAT = vat.replace(/\s+/g, '').toUpperCase();
    
    // EU VAT patterns
    const patterns = {
      'AT': /^ATU\d{8}$/,
      'BE': /^BE0?\d{9}$/,
      'BG': /^BG\d{9,10}$/,
      'CY': /^CY\d{8}[A-Z]$/,
      'CZ': /^CZ\d{8,10}$/,
      'DE': /^DE\d{9}$/,
      'DK': /^DK\d{8}$/,
      'EE': /^EE\d{9}$/,
      'ES': /^ES[A-Z0-9]\d{7}[A-Z0-9]$/,
      'FI': /^FI\d{8}$/,
      'FR': /^FR[A-Z0-9]{2}\d{9}$/,
      'GB': /^GB\d{9}$|^GB\d{12}$|^GBGD\d{3}$|^GBHA\d{3}$/,
      'GR': /^GR\d{9}$/,
      'HR': /^HR\d{11}$/,
      'HU': /^HU\d{8}$/,
      'IE': /^IE\d[A-Z0-9]\d{5}[A-Z]$/,
      'IT': /^IT\d{11}$/,
      'LT': /^LT\d{9}$|^LT\d{12}$/,
      'LU': /^LU\d{8}$/,
      'LV': /^LV\d{11}$/,
      'MT': /^MT\d{8}$/,
      'NL': /^NL\d{9}B\d{2}$/,
      'PL': /^PL\d{10}$/,
      'PT': /^PT\d{9}$/,
      'RO': /^RO\d{2,10}$/,
      'SE': /^SE\d{12}$/,
      'SI': /^SI\d{8}$/,
      'SK': /^SK\d{10}$/
    };
    
    return patterns[countryCode] ? patterns[countryCode].test(cleanVAT) : false;
  },

  validateEIN(ein) {
    const cleanEIN = ein.replace(/\D/g, '');
    return cleanEIN.length === 9;
  },

  animateNumber(element, start, end, duration = 1000) {
    const startTime = Date.now();
    
    function updateNumber() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * easeOut);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    }
    
    requestAnimationFrame(updateNumber);
  },

  generateId() {
    return `tp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};

// Export configuration and utilities
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, COUNTRY_DATA, Utils };
} else {
  window.TechPackConfig = { CONFIG, COUNTRY_DATA, Utils };
}