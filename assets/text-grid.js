document.addEventListener('DOMContentLoaded', function() {
  // Get all text grid buttons
  const gridButtons = document.querySelectorAll('.textGrid a');
  
  // Add click animation functionality
  gridButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Add clicked class for ripple effect
      this.classList.add('clicked');
      
      // Remove clicked class after animation completes
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 600);
    });
    
    // Enhanced hover effects
    button.addEventListener('mouseenter', function() {
      this.style.zIndex = '10';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.zIndex = '1';
    });
  });
  
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe buttons for scroll animations
  gridButtons.forEach(button => {
    button.style.opacity = '0';
    button.style.transform = 'translateY(30px)';
    button.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(button);
  });
  
  // Add touch support for mobile devices
  gridButtons.forEach(button => {
    button.addEventListener('touchstart', function() {
      this.classList.add('touched');
    });
    
    button.addEventListener('touchend', function() {
      setTimeout(() => {
        this.classList.remove('touched');
      }, 150);
    });
  });
  
  // Performance optimization: debounce scroll events
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(function() {
      // Additional scroll-based animations can be added here
    });
  });
  
  // Add keyboard navigation support
  gridButtons.forEach((button, index) => {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
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
});