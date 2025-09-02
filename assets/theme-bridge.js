/*
=============================================================================
GENUINEBLANKS THEME BRIDGE
Seamless theme switching system for all TechPack components
=============================================================================
*/

(function() {
  'use strict';

  // Theme management system
  const GenuineBlanksTheme = {
    
    // Get current theme from localStorage or system preference
    getTheme() {
      const stored = localStorage.getItem('gb-theme');
      if (stored && (stored === 'light' || stored === 'dark')) {
        return stored;
      }
      
      // Default to system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },
    
    // Set theme and persist to localStorage
    setTheme(theme) {
      if (theme !== 'light' && theme !== 'dark') return;
      
      localStorage.setItem('gb-theme', theme);
      this.applyTheme(theme);
      this.updateToggleButtons(theme);
      this.dispatchThemeChange(theme);
    },
    
    // Apply theme to all relevant elements
    applyTheme(theme) {
      // Apply to document root
      document.documentElement.setAttribute('data-theme', theme);
      
      // Apply to body
      document.body.setAttribute('data-theme', theme);
      
      // Apply to all theme containers
      const containers = document.querySelectorAll('#tps-root, .v10-app-container, .v10-techpack-step, .v10-techpack-landing');
      containers.forEach(container => {
        container.setAttribute('data-theme', theme);
      });
      
      console.log(`🎨 GenuineBlanks Theme: Applied ${theme} theme`);
    },
    
    // Toggle between light and dark themes
    toggleTheme() {
      const current = this.getTheme();
      const newTheme = current === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
      return newTheme;
    },
    
    // Update all theme toggle buttons
    updateToggleButtons(theme) {
      // Handle TPS theme buttons
      const tpsButtons = document.querySelectorAll('.tps-theme-btn');
      tpsButtons.forEach(btn => {
        const btnTheme = btn.getAttribute('data-theme');
        if (btnTheme === theme) {
          btn.classList.add('tps-theme-btn--active');
        } else {
          btn.classList.remove('tps-theme-btn--active');
        }
      });
      
      // Handle V10 theme buttons
      const v10Buttons = document.querySelectorAll('.v10-theme-btn');
      v10Buttons.forEach(btn => {
        const btnTheme = btn.getAttribute('data-theme');
        if (btnTheme === theme) {
          btn.classList.add('v10-theme-btn--active');
        } else {
          btn.classList.remove('v10-theme-btn--active');
        }
      });
    },
    
    // Dispatch theme change event
    dispatchThemeChange(theme) {
      const event = new CustomEvent('gb-theme-change', {
        detail: { theme }
      });
      window.dispatchEvent(event);
    },
    
    // Listen for theme changes
    onThemeChange(callback) {
      window.addEventListener('gb-theme-change', callback);
    },
    
    // Initialize theme system
    init() {
      // Apply initial theme
      const currentTheme = this.getTheme();
      this.applyTheme(currentTheme);
      this.updateToggleButtons(currentTheme);
      
      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('gb-theme')) {
          const systemTheme = e.matches ? 'dark' : 'light';
          this.applyTheme(systemTheme);
          this.updateToggleButtons(systemTheme);
        }
      });
      
      // Set up theme button listeners
      this.setupButtonListeners();
      
      console.log(`✅ GenuineBlanks Theme Bridge: Initialized with ${currentTheme} theme`);
    },
    
    // Set up theme toggle button listeners
    setupButtonListeners() {
      // Handle all theme buttons (both TPS and V10)
      const setupButtons = (selector) => {
        document.addEventListener('click', (e) => {
          const button = e.target.closest(selector);
          if (!button) return;
          
          const theme = button.getAttribute('data-theme');
          if (theme) {
            this.setTheme(theme);
          }
        });
      };
      
      setupButtons('.tps-theme-btn');
      setupButtons('.v10-theme-btn');
    }
  };
  
  // Make available globally
  window.GenuineBlanksTheme = GenuineBlanksTheme;
  
  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GenuineBlanksTheme.init());
  } else {
    GenuineBlanksTheme.init();
  }
  
})();