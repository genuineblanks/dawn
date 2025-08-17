/**
 * Futuristic TechPack Progress System
 * Advanced progress bar with lava flow animations, particle effects, and state management
 */

// Prevent duplicate class declaration
if (typeof window.TechPackProgressSystem === 'undefined') {

class TechPackProgressSystem {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.startTime = new Date();
    this.stepTimes = {};
    this.isAnimating = false;
    
    this.init();
  }

  init() {
    this.detectCurrentStep();
    this.bindEvents();
    this.loadProgress();
    this.updateDisplay();
    this.startParticleSystem();
    this.startTimerUpdates();
  }

  detectCurrentStep() {
    // Detect current step from the visible progress bar
    const progressBar = document.querySelector('.techpack-progress[data-step]');
    if (progressBar) {
      this.currentStep = parseInt(progressBar.dataset.step) || 1;
    }
  }

  bindEvents() {
    // Step circle click handlers
    document.querySelectorAll('.techpack-progress__step-circle').forEach((circle, index) => {
      circle.addEventListener('click', (e) => {
        e.preventDefault();
        const stepNumber = index + 1;
        if (stepNumber <= this.currentStep) {
          this.navigateToStep(stepNumber);
        }
      });

      // Hover preview
      circle.addEventListener('mouseenter', (e) => {
        this.showStepPreview(index + 1, e.target);
      });

      circle.addEventListener('mouseleave', () => {
        this.hideStepPreview();
      });
    });

    // Auto-save progress
    window.addEventListener('beforeunload', () => {
      this.saveProgress();
    });

    // Listen for step changes
    document.addEventListener('techpack:stepChange', (e) => {
      this.updateStep(e.detail.step);
    });
  }

  updateStep(newStep) {
    if (this.isAnimating) return;

    const oldStep = this.currentStep;
    this.currentStep = newStep;
    
    // Record step completion time
    if (newStep > oldStep) {
      this.stepTimes[oldStep] = new Date() - this.startTime;
      this.triggerStepCompletion(oldStep);
    }

    this.updateDisplay();
    this.animateProgress();
    this.saveProgress();
  }

  triggerStepCompletion(step) {
    const stepElement = document.querySelector(`[data-step="${step}"] .techpack-progress__step-circle`);
    if (stepElement) {
      stepElement.classList.add('techpack-progress__step-circle--completing');
      
      setTimeout(() => {
        stepElement.classList.remove('techpack-progress__step-circle--completing');
        stepElement.classList.add('techpack-progress__step-circle--completed');
        stepElement.innerHTML = '✓';
      }, 500);
    }

    // Trigger celebration if all steps complete
    if (step === this.totalSteps) {
      this.triggerCompletion();
    }
  }

  triggerCompletion() {
    const progressContainer = document.querySelector('.techpack-progress');
    progressContainer.classList.add('techpack-progress--celebrating');
    
    setTimeout(() => {
      progressContainer.classList.remove('techpack-progress--celebrating');
    }, 2000);

    // Analytics tracking
    this.trackCompletion();
  }

  updateDisplay() {
    const progress = (this.currentStep / this.totalSteps) * 100;
    const remainingSteps = this.totalSteps - this.currentStep;
    const avgTimePerStep = this.calculateAverageStepTime();
    const estimatedTimeRemaining = remainingSteps * avgTimePerStep;

    // Update progress percentage
    document.querySelectorAll('.techpack-progress__percentage').forEach(el => {
      this.animateNumber(el, progress);
    });

    // Update progress bar fill
    document.querySelectorAll('.techpack-progress__fill').forEach(el => {
      el.style.width = `${progress}%`;
    });

    // Update ETA
    document.querySelectorAll('.techpack-progress__eta').forEach(el => {
      el.textContent = this.formatETA(estimatedTimeRemaining);
    });

    // Update timeline
    document.querySelectorAll('.techpack-progress__timeline span').forEach(el => {
      el.textContent = this.formatElapsedTime();
    });

    // Update step states
    this.updateStepStates();
  }

  updateStepStates() {
    document.querySelectorAll('.techpack-progress__step').forEach((step, index) => {
      const stepNumber = index + 1;
      const circle = step.querySelector('.techpack-progress__step-circle');
      const label = step.querySelector('.techpack-progress__step-label');
      
      // Reset classes but preserve original content
      step.className = 'techpack-progress__step';
      circle.className = 'techpack-progress__step-circle';
      
      if (stepNumber < this.currentStep) {
        // Completed step
        step.classList.add('techpack-progress__step--completed');
        circle.classList.add('techpack-progress__step-circle--completed');
        if (circle.innerHTML !== '✓') {
          circle.innerHTML = '✓';
        }
      } else if (stepNumber === this.currentStep) {
        // Active step
        step.classList.add('techpack-progress__step--active');
        circle.classList.add('techpack-progress__step-circle--active');
        circle.innerHTML = stepNumber.toString();
      } else {
        // Pending step - keep original number
        circle.innerHTML = stepNumber.toString();
      }
    });
  }

  animateProgress() {
    this.isAnimating = true;
    
    setTimeout(() => {
      this.isAnimating = false;
    }, 1200);
  }

  animateNumber(element, targetValue) {
    const startValue = parseFloat(element.textContent) || 0;
    const increment = (targetValue - startValue) / 30;
    let currentValue = startValue;
    
    const timer = setInterval(() => {
      currentValue += increment;
      if ((increment > 0 && currentValue >= targetValue) || 
          (increment < 0 && currentValue <= targetValue)) {
        currentValue = targetValue;
        clearInterval(timer);
      }
      element.textContent = `${Math.round(currentValue)}%`;
    }, 30);
  }

  calculateAverageStepTime() {
    const completedSteps = Object.keys(this.stepTimes);
    if (completedSteps.length === 0) return 60000; // Default 1 minute

    const totalTime = completedSteps.reduce((sum, step) => sum + this.stepTimes[step], 0);
    return totalTime / completedSteps.length;
  }

  formatETA(milliseconds) {
    if (milliseconds <= 0) return 'Almost done!';
    
    const minutes = Math.ceil(milliseconds / 60000);
    if (minutes === 1) return '~1 min remaining';
    return `~${minutes} min remaining`;
  }

  formatElapsedTime() {
    const elapsed = new Date() - this.startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    if (minutes === 0) return `Started ${seconds}s ago`;
    if (minutes === 1) return `Started 1 min ago`;
    return `Started ${minutes} min ago`;
  }

  showStepPreview(step, target) {
    const stepInfo = this.getStepInfo(step);
    const tooltip = document.createElement('div');
    tooltip.className = 'techpack-progress__tooltip';
    tooltip.innerHTML = `
      <div class="tooltip-header">${stepInfo.title}</div>
      <div class="tooltip-content">${stepInfo.description}</div>
      ${step <= this.currentStep ? '<div class="tooltip-status">✓ Completed</div>' : ''}
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = target.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 10}px`;
    tooltip.style.transform = 'translate(-50%, -100%)';
  }

  hideStepPreview() {
    const tooltip = document.querySelector('.techpack-progress__tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }

  getStepInfo(step) {
    const stepData = {
      1: { title: 'Client Information', description: 'Basic details and requirements' },
      2: { title: 'File Upload', description: 'Tech pack files and design assets' },
      3: { title: 'Garment Specifications', description: 'Detailed garment configuration' },
      4: { title: 'Review & Submit', description: 'Final review and submission' }
    };
    return stepData[step] || { title: '', description: '' };
  }

  navigateToStep(step) {
    if (step <= this.currentStep && !this.isAnimating) {
      // Emit custom event for step navigation
      document.dispatchEvent(new CustomEvent('techpack:navigateToStep', {
        detail: { step, fromProgress: true }
      }));
    }
  }

  startParticleSystem() {
    // Add dynamic particle effects (optional enhancement)
    setInterval(() => {
      this.updateParticles();
    }, 5000);
  }

  updateParticles() {
    // Rotate particle background pattern
    const progressContainers = document.querySelectorAll('.techpack-progress');
    progressContainers.forEach(container => {
      const currentRotation = parseInt(container.style.getPropertyValue('--particle-rotation') || 0);
      container.style.setProperty('--particle-rotation', `${(currentRotation + 5) % 360}deg`);
    });
  }

  startTimerUpdates() {
    // Update timer every 10 seconds
    setInterval(() => {
      this.updateTimeline();
    }, 10000);
  }

  updateTimeline() {
    // Update timeline display
    document.querySelectorAll('.techpack-progress__timeline span').forEach(el => {
      el.textContent = this.formatElapsedTime();
    });
  }

  saveProgress() {
    const progressData = {
      currentStep: this.currentStep,
      startTime: this.startTime.getTime(),
      stepTimes: this.stepTimes,
      lastUpdate: new Date().getTime()
    };
    
    localStorage.setItem('techpack_progress', JSON.stringify(progressData));
  }

  loadProgress() {
    const saved = localStorage.getItem('techpack_progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        
        // Only restore if less than 24 hours old
        if (new Date().getTime() - data.lastUpdate < 86400000) {
          this.currentStep = data.currentStep || 1;
          this.startTime = new Date(data.startTime);
          this.stepTimes = data.stepTimes || {};
        }
      } catch (e) {
        console.warn('Could not restore progress:', e);
      }
    }
  }

  trackCompletion() {
    const completionData = {
      totalTime: new Date() - this.startTime,
      stepTimes: this.stepTimes,
      completedAt: new Date().toISOString()
    };
    
    // Send to analytics (placeholder)
    console.log('TechPack Completion Analytics:', completionData);
  }

  // Public API methods
  setStep(step) {
    this.updateStep(step);
  }

  getProgress() {
    return {
      currentStep: this.currentStep,
      progress: (this.currentStep / this.totalSteps) * 100,
      elapsedTime: new Date() - this.startTime
    };
  }
}

// CSS for tooltip
const tooltipStyles = `
  .techpack-progress__tooltip {
    position: fixed;
    z-index: 10000;
    background: linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.98));
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 13px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    pointer-events: none;
    animation: tooltipFadeIn 0.2s ease-out;
  }
  
  .tooltip-header {
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .tooltip-content {
    opacity: 0.8;
    font-size: 12px;
  }
  
  .tooltip-status {
    margin-top: 6px;
    font-size: 11px;
    color: #10b981;
    font-weight: 500;
  }
  
  @keyframes tooltipFadeIn {
    from { opacity: 0; transform: translate(-50%, -90%); }
    to { opacity: 1; transform: translate(-50%, -100%); }
  }
`;

// Inject tooltip styles
const styleSheet = document.createElement('style');
styleSheet.textContent = tooltipStyles;
document.head.appendChild(styleSheet);

// Initialize the progress system when DOM is ready - but only once
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.techpackProgress) {
      window.techpackProgress = new TechPackProgressSystem();
    }
  });
} else {
  if (!window.techpackProgress) {
    window.techpackProgress = new TechPackProgressSystem();
  }
}

// Export for use in other scripts
window.TechPackProgressSystem = TechPackProgressSystem;

} // End of duplicate prevention check