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
  
  // Clean text on load
  cleanButtonText();
  
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