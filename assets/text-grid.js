document.addEventListener('DOMContentLoaded', function() {
  // Get all text grid buttons
  const gridButtons = document.querySelectorAll('.textGrid a');
  
  // Enhanced click animation functionality
  gridButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Add clicked class for ripple effect
      this.classList.add('clicked');
      
      // Remove clicked class after animation completes
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 800);
    });
    
    // Enhanced hover effects with smoother transitions
    button.addEventListener('mouseenter', function() {
      this.style.zIndex = '10';
      this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.zIndex = '1';
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
  
  // Improved intersection observer for scroll animations
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
      }
    });
  }, observerOptions);
  
  // Observe buttons for scroll animations
  gridButtons.forEach((button, index) => {
    // Initial state for scroll animation
    button.style.opacity = '0';
    button.style.transform = 'translateY(40px) scale(0.95)';
    button.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    
    observer.observe(button);
  });
  
  // Enhanced touch support for mobile devices
  gridButtons.forEach(button => {
    button.addEventListener('touchstart', function(e) {
      this.classList.add('touched');
      this.style.transform = 'translateY(-4px) scale(1.002)';
    }, { passive: true });
    
    button.addEventListener('touchend', function(e) {
      setTimeout(() => {
        this.classList.remove('touched');
        this.style.transform = '';
      }, 150);
    }, { passive: true });
  });
  
  // Performance optimization: throttled scroll events
  let scrollTimeout;
  let isScrolling = false;
  
  window.addEventListener('scroll', function() {
    if (!isScrolling) {
      window.requestAnimationFrame(function() {
        // Additional scroll-based animations can be added here
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });
  
  // Enhanced keyboard navigation support
  gridButtons.forEach((button, index) => {
    button.setAttribute('tabindex', '0');
    
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.classList.add('clicked');
        this.click();
        
        setTimeout(() => {
          this.classList.remove('clicked');
        }, 800);
      }
      
      // Arrow key navigation
      if (e.key === 'ArrowDown' && gridButtons[index + 1]) {
        e.preventDefault();
        gridButtons[index + 1].focus();
      }
      
      if (e.key === 'ArrowUp' && gridButtons[index - 1]) {
        e.preventDefault();
        gridButtons[index - 1].focus();
      }
    });
  });
  
  // Clean up any unwanted text elements after a delay (in case they load later)
  setTimeout(cleanButtonText, 1000);
  setTimeout(cleanButtonText, 3000);
});