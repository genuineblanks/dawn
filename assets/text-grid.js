document.addEventListener('DOMContentLoaded', function() {
  // Get all text grid buttons
  const gridButtons = document.querySelectorAll('.textGrid a');
  
  // Enhanced click animation with glass breaking effect
  gridButtons.forEach(button => {
    button.addEventListener('click', function(e) {
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
      }, 800);
    });
    
    // Enhanced hover effects with glass morphing
    button.addEventListener('mouseenter', function() {
      this.style.zIndex = '10';
      this.style.backdropFilter = 'blur(15px)';
      this.style.webkitBackdropFilter = 'blur(15px)';
      this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.zIndex = '1';
      this.style.backdropFilter = 'blur(10px)';
      this.style.webkitBackdropFilter = 'blur(10px)';
      this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
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
  
  // Force remove conflicting styles and apply our glass effect
  function forceGlassStyles() {
    gridButtons.forEach((button, index) => {
      // Remove any inline styles that might be conflicting
      button.removeAttribute('style');
      
      // Force remove background images and conflicting properties
      button.style.removeProperty('background-image');
      button.style.removeProperty('background');
      button.style.removeProperty('background-color');
      
      // Apply our glass styles directly via JavaScript as backup
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
        button.style.setProperty('background', style.bg, 'important');
        button.style.setProperty('background-color', style.bg, 'important');
        button.style.setProperty('background-image', 'none', 'important');
        button.style.setProperty('color', style.color, 'important');
        button.style.setProperty('border', `1px solid ${style.border}`, 'important');
        button.style.setProperty('backdrop-filter', 'blur(10px)', 'important');
        button.style.setProperty('-webkit-backdrop-filter', 'blur(10px)', 'important');
        button.style.setProperty('box-shadow', '0 8px 32px 0 rgba(0, 0, 0, 0.1)', 'important');
      }
    });
  }
  
  // Apply glass styles immediately and on intervals
  forceGlassStyles();
  setTimeout(forceGlassStyles, 100);
  setTimeout(forceGlassStyles, 500);
  setTimeout(forceGlassStyles, 1000);
  
  // Enhanced intersection observer for glass effect loading
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
        entry.target.style.backdropFilter = 'blur(10px)';
        entry.target.style.webkitBackdropFilter = 'blur(10px)';
      }
    });
  }, observerOptions);
  
  // Observe buttons for scroll animations
  gridButtons.forEach((button, index) => {
    // Initial state for scroll animation
    button.style.opacity = '0';
    button.style.transform = 'translateY(40px) scale(0.95)';
    button.style.backdropFilter = 'blur(0px)';
    button.style.webkitBackdropFilter = 'blur(0px)';
    button.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), backdrop-filter 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    
    observer.observe(button);
  });
  
  // Enhanced touch support for mobile devices with glass effect
  gridButtons.forEach(button => {
    button.addEventListener('touchstart', function(e) {
      this.classList.add('touched');
      this.style.transform = 'translateY(-6px) scale(1.01)';
      this.style.backdropFilter = 'blur(12px)';
      this.style.webkitBackdropFilter = 'blur(12px)';
    }, { passive: true });
    
    button.addEventListener('touchend', function(e) {
      setTimeout(() => {
        this.classList.remove('touched');
        this.style.transform = '';
        this.style.backdropFilter = 'blur(10px)';
        this.style.webkitBackdropFilter = 'blur(10px)';
      }, 150);
    }, { passive: true });
  });
  
  // Performance optimization: throttled scroll events
  let scrollTimeout;
  let isScrolling = false;
  
  window.addEventListener('scroll', function() {
    if (!isScrolling) {
      window.requestAnimationFrame(function() {
        // Additional scroll-based glass effects can be added here
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });
  
  // Enhanced keyboard navigation with glass effects
  gridButtons.forEach((button, index) => {
    button.setAttribute('tabindex', '0');
    
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        
        // Simulate click at center for keyboard activation
        this.style.setProperty('--x', '50%');
        this.style.setProperty('--y', '50%');
        this.classList.add('glass-break');
        this.click();
        
        setTimeout(() => {
          this.classList.remove('glass-break');
        }, 800);
      }
      
      // Arrow key navigation with glass focus effect
      if (e.key === 'ArrowDown' && gridButtons[index + 1]) {
        e.preventDefault();
        gridButtons[index + 1].focus();
      }
      
      if (e.key === 'ArrowUp' && gridButtons[index - 1]) {
        e.preventDefault();
        gridButtons[index - 1].focus();
      }
    });
    
    // Enhanced focus effects
    button.addEventListener('focus', function() {
      this.style.backdropFilter = 'blur(15px)';
      this.style.webkitBackdropFilter = 'blur(15px)';
    });
    
    button.addEventListener('blur', function() {
      this.style.backdropFilter = 'blur(10px)';
      this.style.webkitBackdropFilter = 'blur(10px)';
    });
  });
  
  // Clean up any unwanted text elements after delays
  setTimeout(cleanButtonText, 1000);
  setTimeout(cleanButtonText, 3000);
  
  // Add subtle parallax effect to glass elements
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = scrolled * 0.1;
    
    gridButtons.forEach((button, index) => {
      if (isElementInViewport(button)) {
        button.style.transform = `translateY(${parallax}px)`;
      }
    });
  }, { passive: true });
  
  // Utility function to check if element is in viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
});