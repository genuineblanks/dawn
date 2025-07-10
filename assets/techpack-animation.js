// ===============================================
// TECH PACK ANIMATION MANAGER MODULE
// ===============================================

class AnimationManager {
  constructor() {
    this.activeAnimations = new Map();
    this.CONFIG = window.TechPackConfig?.CONFIG || { ANIMATION_DURATION: 400 };
  }

  fadeIn(element, duration = this.CONFIG.ANIMATION_DURATION) {
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

  fadeOut(element, duration = this.CONFIG.ANIMATION_DURATION) {
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

  slideIn(element, direction = 'right', duration = this.CONFIG.ANIMATION_DURATION) {
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

  slideOut(element, direction = 'left', duration = this.CONFIG.ANIMATION_DURATION) {
    const transforms = {
      right: 'translateX(100px)',
      left: 'translateX(-100px)',
      up: 'translateY(-100px)',
      down: 'translateY(100px)'
    };

    return new Promise(resolve => {
      element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
      element.style.opacity = '0';
      element.style.transform = transforms[direction];
      
      setTimeout(() => {
        element.style.transition = '';
        resolve();
      }, duration);
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

  bounce(element, height = 10, duration = 600) {
    const keyframes = [
      { transform: 'translateY(0)' },
      { transform: `translateY(-${height}px)` },
      { transform: 'translateY(0)' },
      { transform: `translateY(-${height/2}px)` },
      { transform: 'translateY(0)' }
    ];

    element.animate(keyframes, {
      duration,
      easing: 'ease-out'
    });
  }

  progressBarAnimation(element, from = 0, to = 100, duration = 1000) {
    return new Promise(resolve => {
      let start = null;
      const startValue = from;
      const endValue = to;

      function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const value = startValue + (endValue - startValue) * this.easeOutCubic(progress);
        
        element.style.width = value + '%';
        
        if (progress < 1) {
          requestAnimationFrame(animate.bind(this));
        } else {
          resolve();
        }
      }

      requestAnimationFrame(animate.bind(this));
    });
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Loading spinner animation
  showLoadingSpinner(element, size = 20) {
    const spinner = document.createElement('div');
    spinner.className = 'techpack-loading-spinner';
    spinner.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-left-color: currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    `;

    // Add animation keyframes if not already present
    if (!document.querySelector('#techpack-spinner-styles')) {
      const style = document.createElement('style');
      style.id = 'techpack-spinner-styles';
      style.textContent = `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    element.appendChild(spinner);
    return spinner;
  }

  hideLoadingSpinner(element) {
    const spinner = element.querySelector('.techpack-loading-spinner');
    if (spinner) {
      spinner.remove();
    }
  }

  // Smooth step transitions
  transitionToStep(currentStep, nextStep, direction = 'forward') {
    const currentElement = document.querySelector(`#techpack-step-${currentStep}`);
    const nextElement = document.querySelector(`#techpack-step-${nextStep}`);

    if (!currentElement || !nextElement) return Promise.resolve();

    const slideDirection = direction === 'forward' ? 'left' : 'right';
    const slideInDirection = direction === 'forward' ? 'right' : 'left';

    return Promise.all([
      this.slideOut(currentElement, slideDirection),
      this.slideIn(nextElement, slideInDirection)
    ]).then(() => {
      currentElement.style.display = 'none';
      nextElement.style.display = 'block';
    });
  }
}

// Export class
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AnimationManager };
} else {
  window.TechPackAnimation = { AnimationManager };
}