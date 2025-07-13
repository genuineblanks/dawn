// TECHPACK SYSTEM INTEGRATION
// Ensures all components work together seamlessly

(function() {
  'use strict';
  
  // Wait for all components to be ready
  let retryCount = 0;
  const maxRetries = 10;
  
  function initializeSystem() {
    retryCount++;
    
    // Check if navigation manager is loaded
    if (window.techpackNavigation || window.TechpackNavigationManager) {
      console.log('✅ Techpack System Integration - All components loaded');
      setupIntegrations();
      return;
    }
    
    if (retryCount < maxRetries) {
      setTimeout(initializeSystem, 500);
    } else {
      console.warn('⚠️ Techpack Navigation Manager not found, using fallback');
      setupFallbackNavigation();
    }
  }
  
  function setupIntegrations() {
    // Cross-component event coordination
    setupEventCoordination();
    
    // Performance monitoring
    setupPerformanceMonitoring();
    
    // Error handling
    setupGlobalErrorHandling();
    
    // Accessibility enhancements
    setupAccessibilityEnhancements();
    
    // Analytics integration
    setupAnalyticsIntegration();
  }
  
  function setupEventCoordination() {
    // Listen for navigation events and coordinate with other components
    document.addEventListener('stepChange', (e) => {
      // Update any other components that need to know about step changes
      updateProgressIndicators(e.detail.step);
      
      // Save progress to localStorage
      localStorage.setItem('techpackCurrentStep', e.detail.step);
    });
    
    // Listen for form validation events
    document.addEventListener('formValidationError', (e) => {
      // Coordinate with navigation to prevent step advancement
      if (window.techpackNavigation) {
        window.techpackNavigation.isNavigating = false;
      }
    });
    
    // Listen for keyboard events
    document.addEventListener('keyboardOpen', () => {
      document.body.classList.add('keyboard-open');
    });
    
    document.addEventListener('keyboardClose', () => {
      document.body.classList.remove('keyboard-open');
    });
  }
  
  function updateProgressIndicators(step) {
    // Update any additional progress indicators
    const indicators = document.querySelectorAll('[data-progress-indicator]');
    indicators.forEach(indicator => {
      indicator.style.width = `${(step / 4) * 100}%`;
    });
  }
  
  function setupPerformanceMonitoring() {
    // Monitor for slow operations
    let navigationStartTime;
    
    document.addEventListener('stepChange', () => {
      navigationStartTime = performance.now();
    });
    
    // Monitor for long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn(`⚠️ Long task detected: ${entry.duration}ms`);
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Longtask API not supported
      }
    }
  }
  
  function setupGlobalErrorHandling() {
    // Catch and handle errors gracefully
    window.addEventListener('error', (e) => {
      console.error('Techpack System Error:', e.error);
      
      // Show user-friendly error message
      showSystemError('Something went wrong. Please refresh the page and try again.');
    });
    
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled Promise Rejection:', e.reason);
      
      // Don't show error for minor issues
      if (e.reason && e.reason.message && !e.reason.message.includes('Navigation')) {
        showSystemError('An error occurred. Please try again.');
      }
    });
  }
  
  function showSystemError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'techpack-system-error';
    errorDiv.innerHTML = `
      <div class="error-content">
        <strong>⚠️ System Error</strong>
        <p>${message}</p>
        <button onclick="this.parentElement.parentElement.remove()">Dismiss</button>
      </div>
    `;
    
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #fef2f2;
      color: #dc2626;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      border: 1px solid #fecaca;
      z-index: 1000;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      max-width: 400px;
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (errorDiv.parentElement) {
        errorDiv.remove();
      }
    }, 10000);
  }
  
  function setupAccessibilityEnhancements() {
    // Add skip links
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px 16px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if not present
    const mainContent = document.querySelector('.techpack-step, .tech-pack-app, .techpack-modern');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
    }
    
    // Announce step changes to screen readers
    let announcer = document.getElementById('techpack-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'techpack-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(announcer);
    }
    
    document.addEventListener('stepChange', (e) => {
      announcer.textContent = `Step ${e.detail.step} of 4: ${e.detail.title}`;
    });
  }
  
  function setupAnalyticsIntegration() {
    // Track key user interactions
    document.addEventListener('stepChange', (e) => {
      // Google Analytics 4
      if (typeof gtag !== 'undefined') {
        gtag('event', 'techpack_step_change', {
          step_number: e.detail.step,
          step_title: e.detail.title
        });
      }
      
      // Facebook Pixel
      if (typeof fbq !== 'undefined') {
        fbq('track', 'TechpackStepChange', {
          step: e.detail.step
        });
      }
    });
    
    // Track form interactions
    document.addEventListener('focusin', (e) => {
      if (e.target.matches('.techpack-form input, .techpack-form textarea, .techpack-form select')) {
        // Track field focus for UX optimization
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_field_focus', {
            field_type: e.target.type,
            field_name: e.target.name
          });
        }
      }
    });
  }
  
  function setupFallbackNavigation() {
    // Fallback navigation if main system fails
    const nextButtons = document.querySelectorAll('#next-step-btn, [data-action="next"], .btn-primary');
    const prevButtons = document.querySelectorAll('#prev-step-btn, [data-action="prev"], .btn-secondary');
    
    nextButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Fallback: Next button clicked');
        
        // Simple step advancement
        const currentStep = document.querySelector('.step.active, [data-step].active');
        if (currentStep) {
          const nextStep = currentStep.nextElementSibling;
          if (nextStep) {
            currentStep.classList.remove('active');
            currentStep.style.display = 'none';
            nextStep.classList.add('active');
            nextStep.style.display = 'block';
          }
        }
      });
    });
    
    prevButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Fallback: Previous button clicked');
        
        // Simple step back
        const currentStep = document.querySelector('.step.active, [data-step].active');
        if (currentStep) {
          const prevStep = currentStep.previousElementSibling;
          if (prevStep) {
            currentStep.classList.remove('active');
            currentStep.style.display = 'none';
            prevStep.classList.add('active');
            prevStep.style.display = 'block';
          }
        }
      });
    });
  }
  
  // Mobile-specific integrations
  function setupMobileIntegrations() {
    if (window.innerWidth <= 768) {
      // Detect keyboard appearance/disappearance
      let initialViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      
      function handleViewportChange() {
        const currentHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        const heightDifference = initialViewportHeight - currentHeight;
        
        if (heightDifference > 150) {
          document.dispatchEvent(new CustomEvent('keyboardOpen', { detail: { height: heightDifference } }));
        } else {
          document.dispatchEvent(new CustomEvent('keyboardClose'));
        }
      }
      
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleViewportChange);
      } else {
        window.addEventListener('resize', handleViewportChange);
      }
      
      // Handle iOS safe areas
      if (CSS.supports('padding: max(0px)')) {
        document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
        document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
        document.documentElement.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left)');
        document.documentElement.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right)');
      }
    }
  }
  
  // Initialize everything
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.techpack-form, .tech-pack-app, .techpack-modern')) {
      initializeSystem();
      setupMobileIntegrations();
      
      console.log('🚀 Techpack System Integration - Initialized');
    }
  });
  
  // Expose global utilities
  window.TechpackSystem = {
    showError: showSystemError,
    announceToScreenReader: (message) => {
      const announcer = document.getElementById('techpack-announcer');
      if (announcer) {
        announcer.textContent = message;
      }
    }
  };
  
})();