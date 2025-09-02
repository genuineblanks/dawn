/* ====================================================
   GENUINEBLANKS THEME BRIDGE v1.0
   Seamless Light/Dark Mode Theme Switching
   ====================================================
   
   Features:
   - Binds to existing light/dark toggle controls
   - Sets data-theme attributes on .gb-app
   - Persists theme choice in localStorage
   - System preference detection
   - Smooth transitions
   - Compatible with existing V10 JavaScript
   
   Usage:
   - Include this script after DOM is loaded
   - Automatically finds and binds to toggle controls
   - Works with both V10 and TPS theme toggles
   
   ==================================================== */

(function() {
  'use strict';
  
  /* ==========================================
     CONFIGURATION & CONSTANTS
     ========================================== */
  
  const THEME_BRIDGE_CONFIG = {
    // Storage key for persisting theme
    storageKey: 'gb-theme-preference',
    
    // CSS classes and selectors
    selectors: {
      app: '.gb-app',
      v10Toggle: '.v10-theme-toggle-unified',
      tpsToggle: '.tps-theme-toggle',
      gbToggle: '.gb-theme-toggle',
      lightOption: '[data-theme="light"]',
      darkOption: '[data-theme="dark"]',
      activeClass: 'gb-theme-toggle__option--active',
      v10ActiveClass: 'active',
      tpsActiveClass: 'tps-theme-btn--active'
    },
    
    // Default theme
    defaultTheme: 'light',
    
    // Animation duration (matches CSS transition)
    transitionDuration: 200,
    
    // Debug mode
    debug: false
  };
  
  /* ==========================================
     UTILITY FUNCTIONS
     ========================================== */
  
  function log(...args) {
    if (THEME_BRIDGE_CONFIG.debug) {
      console.log('[ThemeBridge]', ...args);
    }
  }
  
  function getSystemPreference() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return THEME_BRIDGE_CONFIG.defaultTheme;
  }
  
  function getStoredTheme() {
    if (typeof localStorage !== 'undefined') {
      try {
        return localStorage.getItem(THEME_BRIDGE_CONFIG.storageKey);
      } catch (e) {
        log('localStorage not available:', e);
      }
    }
    return null;
  }
  
  function setStoredTheme(theme) {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(THEME_BRIDGE_CONFIG.storageKey, theme);
        log('Theme stored:', theme);
      } catch (e) {
        log('Failed to store theme:', e);
      }
    }
  }
  
  function getCurrentTheme() {
    // Priority: stored preference > system preference > default
    return getStoredTheme() || getSystemPreference();
  }
  
  /* ==========================================
     THEME APPLICATION
     ========================================== */
  
  function applyTheme(theme, skipTransition = false) {
    log('Applying theme:', theme);
    
    // Find all .gb-app containers
    const appContainers = document.querySelectorAll(THEME_BRIDGE_CONFIG.selectors.app);
    
    if (appContainers.length === 0) {
      log('No .gb-app containers found, applying to body');
      document.body.setAttribute('data-theme', theme);
    } else {
      appContainers.forEach(container => {
        container.setAttribute('data-theme', theme);
      });
    }
    
    // Also set on document.documentElement for global styles
    document.documentElement.setAttribute('data-theme', theme);
    
    // Store the theme preference
    setStoredTheme(theme);
    
    // Update toggle states
    updateToggleStates(theme);
    
    // Dispatch custom event for other scripts
    dispatchThemeChangeEvent(theme);
    
    log('Theme applied successfully:', theme);
  }
  
  function dispatchThemeChangeEvent(theme) {
    try {
      const event = new CustomEvent('themeChange', {
        detail: { theme, timestamp: Date.now() }
      });
      document.dispatchEvent(event);
      log('Theme change event dispatched:', theme);
    } catch (e) {
      log('Failed to dispatch theme change event:', e);
    }
  }
  
  /* ==========================================
     TOGGLE CONTROL MANAGEMENT
     ========================================== */
  
  function updateToggleStates(theme) {
    // Update GB theme toggles
    updateGBToggles(theme);
    
    // Update V10 theme toggles
    updateV10Toggles(theme);
    
    // Update TPS theme toggles
    updateTPSToggles(theme);
  }
  
  function updateGBToggles(theme) {
    const toggles = document.querySelectorAll(THEME_BRIDGE_CONFIG.selectors.gbToggle);
    
    toggles.forEach(toggle => {
      const lightOption = toggle.querySelector(`${THEME_BRIDGE_CONFIG.selectors.lightOption}`);
      const darkOption = toggle.querySelector(`${THEME_BRIDGE_CONFIG.selectors.darkOption}`);
      
      if (lightOption && darkOption) {
        // Remove active class from both
        lightOption.classList.remove(THEME_BRIDGE_CONFIG.selectors.activeClass);
        darkOption.classList.remove(THEME_BRIDGE_CONFIG.selectors.activeClass);
        
        // Add active class to current theme
        if (theme === 'light') {
          lightOption.classList.add(THEME_BRIDGE_CONFIG.selectors.activeClass);
        } else {
          darkOption.classList.add(THEME_BRIDGE_CONFIG.selectors.activeClass);
        }
      }
    });
  }
  
  function updateV10Toggles(theme) {
    // Handle existing V10 theme toggle structure
    const v10Toggles = document.querySelectorAll(THEME_BRIDGE_CONFIG.selectors.v10Toggle);
    
    v10Toggles.forEach(toggle => {
      const buttons = toggle.querySelectorAll('button[data-theme]');
      buttons.forEach(button => {
        const buttonTheme = button.getAttribute('data-theme');
        button.classList.toggle(THEME_BRIDGE_CONFIG.selectors.v10ActiveClass, buttonTheme === theme);
      });
    });
  }
  
  function updateTPSToggles(theme) {
    // Handle existing TPS theme toggle structure
    const tpsToggles = document.querySelectorAll(THEME_BRIDGE_CONFIG.selectors.tpsToggle);
    
    tpsToggles.forEach(toggle => {
      const buttons = toggle.querySelectorAll('button[data-theme]');
      buttons.forEach(button => {
        const buttonTheme = button.getAttribute('data-theme');
        button.classList.toggle(THEME_BRIDGE_CONFIG.selectors.tpsActiveClass, buttonTheme === theme);
      });
    });
  }
  
  /* ==========================================
     EVENT BINDING
     ========================================== */
  
  function bindToggleEvents() {
    log('Binding toggle events...');
    
    // Bind to all theme toggle buttons
    const allToggleButtons = document.querySelectorAll(`
      ${THEME_BRIDGE_CONFIG.selectors.gbToggle} button[data-theme],
      ${THEME_BRIDGE_CONFIG.selectors.v10Toggle} button[data-theme],
      ${THEME_BRIDGE_CONFIG.selectors.tpsToggle} button[data-theme]
    `);
    
    allToggleButtons.forEach(button => {
      button.addEventListener('click', handleToggleClick);
      log('Bound click event to toggle button:', button.getAttribute('data-theme'));
    });
    
    // Also listen for system preference changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleSystemPreferenceChange);
      } 
      // Legacy browsers
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleSystemPreferenceChange);
      }
      
      log('Bound system preference change listener');
    }
  }
  
  function handleToggleClick(event) {
    const button = event.currentTarget;
    const theme = button.getAttribute('data-theme');
    
    if (theme && (theme === 'light' || theme === 'dark')) {
      log('Toggle clicked:', theme);
      applyTheme(theme);
    }
  }
  
  function handleSystemPreferenceChange(mediaQuery) {
    // Only auto-switch if no manual preference has been set
    const storedTheme = getStoredTheme();
    if (!storedTheme) {
      const systemTheme = mediaQuery.matches ? 'dark' : 'light';
      log('System preference changed:', systemTheme);
      applyTheme(systemTheme);
    }
  }
  
  /* ==========================================
     INITIALIZATION
     ========================================== */
  
  function initialize() {
    log('Initializing Theme Bridge...');
    
    // Get initial theme
    const initialTheme = getCurrentTheme();
    log('Initial theme determined:', initialTheme);
    
    // Apply initial theme immediately (skip transition on load)
    applyTheme(initialTheme, true);
    
    // Bind events after DOM is fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindToggleEvents);
    } else {
      // DOM already loaded
      bindToggleEvents();
    }
    
    log('Theme Bridge initialized successfully');
  }
  
  /* ==========================================
     COMPATIBILITY LAYER
     ========================================== */
  
  // Expose API for compatibility with existing V10 scripts
  window.GenuineBlanksTheme = {
    // Get current theme
    getTheme: function() {
      const app = document.querySelector(THEME_BRIDGE_CONFIG.selectors.app);
      return app ? app.getAttribute('data-theme') : getCurrentTheme();
    },
    
    // Set theme programmatically
    setTheme: function(theme) {
      if (theme === 'light' || theme === 'dark') {
        applyTheme(theme);
        return true;
      }
      return false;
    },
    
    // Toggle between themes
    toggleTheme: function() {
      const currentTheme = this.getTheme();
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      return this.setTheme(newTheme);
    },
    
    // Check if theme is available
    isThemeSupported: function(theme) {
      return theme === 'light' || theme === 'dark';
    },
    
    // Get system preference
    getSystemPreference: getSystemPreference,
    
    // Event listener for theme changes
    onThemeChange: function(callback) {
      document.addEventListener('themeChange', callback);
    },
    
    // Remove theme change listener
    offThemeChange: function(callback) {
      document.removeEventListener('themeChange', callback);
    }
  };
  
  /* ==========================================
     LEGACY V10 COMPATIBILITY
     ========================================== */
  
  // Check if existing V10 theme system is present
  function checkV10Compatibility() {
    // Look for existing V10 theme functions
    if (typeof window.V10_THEME_SYSTEM !== 'undefined') {
      log('V10 theme system detected, ensuring compatibility...');
      
      // Override V10 theme functions if they exist
      if (window.V10_THEME_SYSTEM.setTheme) {
        const originalSetTheme = window.V10_THEME_SYSTEM.setTheme;
        window.V10_THEME_SYSTEM.setTheme = function(theme) {
          // Call our system first
          window.GenuineBlanksTheme.setTheme(theme);
          // Then call original if it doesn't conflict
          if (typeof originalSetTheme === 'function') {
            try {
              originalSetTheme.call(this, theme);
            } catch (e) {
              log('V10 original setTheme failed:', e);
            }
          }
        };
      }
    }
  }
  
  /* ==========================================
     ERROR HANDLING & FALLBACKS
     ========================================== */
  
  function setupErrorHandling() {
    // Global error handler for theme-related errors
    window.addEventListener('error', function(event) {
      if (event.error && event.error.message && 
          event.error.message.toLowerCase().includes('theme')) {
        log('Theme-related error caught:', event.error);
        
        // Fallback to default theme
        try {
          applyTheme(THEME_BRIDGE_CONFIG.defaultTheme, true);
        } catch (fallbackError) {
          log('Fallback theme application failed:', fallbackError);
        }
      }
    });
  }
  
  /* ==========================================
     AUTO-INITIALIZATION
     ========================================== */
  
  // Initialize when script loads
  if (typeof document !== 'undefined') {
    // Setup error handling first
    setupErrorHandling();
    
    // Check for V10 compatibility
    checkV10Compatibility();
    
    // Initialize the theme system
    initialize();
    
    log('Theme Bridge loaded and ready');
  } else {
    console.warn('Theme Bridge: document not available, skipping initialization');
  }
  
})();

/* ====================================================
   USAGE EXAMPLES
   ====================================================
   
   // Get current theme
   const currentTheme = window.GenuineBlanksTheme.getTheme();
   
   // Set theme programmatically
   window.GenuineBlanksTheme.setTheme('dark');
   
   // Toggle theme
   window.GenuineBlanksTheme.toggleTheme();
   
   // Listen for theme changes
   window.GenuineBlanksTheme.onThemeChange(function(event) {
     console.log('Theme changed to:', event.detail.theme);
   });
   
   // HTML Structure Example:
   <div class="gb-theme-toggle">
     <button data-theme="light" class="gb-theme-toggle__option">
       ☀️ Light
     </button>
     <button data-theme="dark" class="gb-theme-toggle__option">
       🌙 Dark
     </button>
   </div>
   
   ==================================================== */