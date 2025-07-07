document.addEventListener('DOMContentLoaded', function() {
  // Get all text grid buttons
  const gridButtons = document.querySelectorAll('.textGrid a');
  
  // AGGRESSIVE STYLE OVERRIDE FUNCTION
  function forceOurStyles() {
    gridButtons.forEach((button, index) => {
      // Define our glass styles
      const glassStyles = [
        { bg: 'rgba(255, 255, 255, 0.25)', color: '#1a1a1a', border: 'rgba(255, 255, 255, 0.3)' },
        { bg: 'rgba(245, 245, 245, 0.3)', color: '#1a1a1a', border: 'rgba(245, 245, 245, 0.4)' },
        { bg: 'rgba(232, 232, 232, 0.35)', color: '#2a2a2a', border: 'rgba(232, 232, 232, 0.45)' },
        { bg: 'rgba(208, 208, 208, 0.4)', color: '#3a3a3a', border: 'rgba(208, 208, 208, 0.5)' },
        { bg: 'rgba(184, 184, 184, 0.45)', color: '#ffffff', border: 'rgba(184, 184, 184, 0.55)' },
        { bg: 'rgba(153, 153, 153, 0.5)', color: '#ffffff', border: 'rgba(153, 153, 153, 0.6)' },
        { bg: 'rgba(119, 119, 119, 0.55)', color: '#ffffff', border: 'rgba(119, 119, 119, 0.65)' },
        { bg: 'rgba(85, 85, 85, 0.6)', color: '#ffffff', border: 'rgba(85, 85, 85, 0.7)' },
        { bg: 'rgba(51, 51, 51, 0.65)', color: '#ffffff', border: 'rgba(51, 51, 51, 0.75)' },
        { bg: 'rgba(26, 26, 26, 0.7)', color: '#ffffff', border: 'rgba(26, 26, 26, 0.8)' }
      ];
      
      if (glassStyles[index]) {
        const style = glassStyles[index];
        
        // NUCLEAR OPTION: Set inline styles directly
        const inlineStyles = `
          background: ${style.bg} !important;
          background-color: ${style.bg} !important;
          background-image: none !important;
          color: ${style.color} !important;
          border: 1px solid ${style.border} !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1) !important;
          display: block !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 80px 60px !important;
          text-decoration: none !important;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
          position: relative !important;
          cursor: pointer !important;
          overflow: hidden !important;
          border-radius: 0 !important;
        `;
        
        button.setAttribute('style', inlineStyles);
        
        // Also use setProperty as backup
        button.style.setProperty('background', style.bg, 'important');
        button.style.setProperty('background-color', style.bg, 'important');
        button.style.setProperty('background-image', 'none', 'important');
        button.style.setProperty('color', style.color, 'important');
        button.style.setProperty('border', `1px solid ${style.border}`, 'important');
        
        // Remove any classes that might be adding colors
        const classesToRemove = ['color-scheme-1', 'color-scheme-2', 'gradient', 'color-background-1', 'color-background-2'];
        classesToRemove.forEach(cls => button.classList.remove(cls));
        
        // Remove from parent containers too
        const parent = button.closest('.textGrid');
        if (parent) {
          classesToRemove.forEach(cls => parent.classList.remove(cls));
        }
      }
    });
  }
  
  // Apply styles immediately and repeatedly
  forceOurStyles();
  setTimeout(forceOurStyles, 100);
  setTimeout(forceOurStyles, 500);
  setTimeout(forceOurStyles, 1000);
  setTimeout(forceOurStyles, 2000);
  
  // Watch for changes and reapply styles
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        setTimeout(forceOurStyles, 10);
      }
    });
  });
  
  gridButtons.forEach(button => {
    observer.observe(button, { attributes: true, attributeFilter: ['style'] });
  });
  
  // Enhanced click animation with glass breaking effect
  gridButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Reapply our styles before animation
      forceOurStyles();
      
      // Get click position for glass break effect
      const rect = this.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Set CSS custom properties for glass break position
      this.style.setProperty('--x', x + '%');
      this.style.setProperty('--y', y + '%');
      
      // Add glass break effect
      this.classList.add('glass-break');
      
      // Remove glass break class after animation completes
      setTimeout(() => {
        this.classList.remove('glass-break');
        forceOurStyles(); // Reapply styles after animation
      }, 800);
    });
    
    // Enhanced hover effects with glass morphing
    button.addEventListener('mouseenter', function() {
      forceOurStyles(); // Ensure styles are correct before hover
      this.style.setProperty('transform', 'translateY(-12px) scale(1.02)', 'important');
      this.style.setProperty('box-shadow', '0 25px 50px rgba(0, 0, 0, 0.25)', 'important');
      this.style.setProperty('backdrop-filter', 'blur(15px)', 'important');
      this.style.setProperty('-webkit-backdrop-filter', 'blur(15px)', 'important');
      this.style.setProperty('z-index', '10', 'important');
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.setProperty('transform', 'translateY(0) scale(1)', 'important');
      this.style.setProperty('box-shadow', '0 8px 32px 0 rgba(0, 0, 0, 0.1)', 'important');
      this.style.setProperty('backdrop-filter', 'blur(10px)', 'important');
      this.style.setProperty('-webkit-backdrop-filter', 'blur(10px)', 'important');
      this.style.setProperty('z-index', '1', 'important');
    });
  });
  
  // Remove any redirect text that might be showing
  function cleanButtonText() {
    gridButtons.forEach(button => {
      const textElements = button.querySelectorAll('p, div, span');
      textElements.forEach(element => {
        if (element.textContent.includes('REDIRECTS TO') || 
            element.textContent.includes('redirects to') ||
            element.textContent.includes('1ST -') ||
            element.textContent.includes('2ND -') ||
            element.textContent.includes('3RD -') ||
            element.textContent.includes('4TH -') ||
            element.textContent.includes('5TH -')) {
          element.style.display = 'none';
        }
      });
    });
  }
  
  cleanButtonText();
  
  // Enhanced touch support for mobile devices with glass effect
  gridButtons.forEach(button => {
    button.addEventListener('touchstart', function(e) {
      forceOurStyles();
      this.style.setProperty('transform', 'translateY(-6px) scale(1.01)', 'important');
    }, { passive: true });
    
    button.addEventListener('touchend', function(e) {
      setTimeout(() => {
        this.style.setProperty('transform', 'translateY(0) scale(1)', 'important');
      }, 150);
    }, { passive: true });
  });
  
  // Enhanced keyboard navigation with glass effects
  gridButtons.forEach((button, index) => {
    button.setAttribute('tabindex', '0');
    
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        forceOurStyles();
        
        // Simulate click at center for keyboard activation
        this.style.setProperty('--x', '50%');
        this.style.setProperty('--y', '50%');
        this.classList.add('glass-break');
        this.click();
        
        setTimeout(() => {
          this.classList.remove('glass-break');
          forceOurStyles();
        }, 800);
      }
    });
  });
  
  // Clean up any unwanted text elements
  setTimeout(cleanButtonText, 1000);
  setTimeout(cleanButtonText, 3000);
  
  // Force styles on window resize
  window.addEventListener('resize', forceOurStyles);
  
  // Force styles on scroll (in case of lazy loading)
  window.addEventListener('scroll', function() {
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(forceOurStyles, 100);
  });
});