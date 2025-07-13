// Enhanced Color Picker Functionality
class EnhancedColorPicker {
  constructor() {
    this.selectedColor = null;
    this.colorHistory = this.loadColorHistory();
    this.customColorPanel = document.getElementById('custom-color-panel');
    this.colorInput = document.getElementById('favcolor');
    this.hexInput = document.getElementById('color-hex-input');
    this.colorPreview = document.getElementById('color-preview');
    this.selectedColorName = document.getElementById('selected-color-name');
    this.existingInput = document.querySelector('#customColorName');
    
    this.init();
  }
  
  init() {
    this.setupColorOptions();
    this.setupCustomColorPicker();
    this.updateColorHistory();
    this.setupKeyboardNavigation();
  }
  
  setupColorOptions() {
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectColor(option);
      });
      
      // Add keyboard support
      option.setAttribute('tabindex', '0');
      option.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectColor(option);
        }
      });
    });
  }
  
  selectColor(option) {
    // Remove previous selection
    document.querySelectorAll('.color-option').forEach(opt => {
      opt.classList.remove('selected');
    });
    
    // Add selection to clicked option
    option.classList.add('selected', 'changing');
    setTimeout(() => option.classList.remove('changing'), 300);
    
    const colorValue = option.dataset.color;
    const colorName = option.dataset.colorName;
    const productUrl = option.dataset.productUrl;
    
    // Update selected color display
    this.selectedColorName.textContent = colorName;
    this.selectedColor = colorValue;
    
    if (colorValue === 'custom') {
      this.showCustomColorPicker();
    } else {
      this.hideCustomColorPicker();
      this.addToColorHistory(colorValue, colorName);
      
      // If it's a different product, navigate to it
      if (productUrl && productUrl !== window.location.pathname) {
        this.navigateToColorProduct(productUrl);
      } else {
        // Update form with selected color
        this.updateProductForm(colorValue, colorName);
      }
    }
  }
  
  showCustomColorPicker() {
    this.customColorPanel.classList.add('active');
    this.colorInput.focus();
  }
  
  hideCustomColorPicker() {
    this.customColorPanel.classList.remove('active');
  }
  
  setupCustomColorPicker() {
    // Color input change
    this.colorInput.addEventListener('input', (e) => {
      const color = e.target.value;
      this.updateColorPreview(color);
      this.hexInput.value = color.toUpperCase();
    });
    
    // Hex input change
    this.hexInput.addEventListener('input', (e) => {
      let hex = e.target.value;
      if (!hex.startsWith('#')) {
        hex = '#' + hex;
      }
      
      if (this.isValidHex(hex)) {
        this.colorInput.value = hex;
        this.updateColorPreview(hex);
      }
    });
    
    // Apply custom color
    document.getElementById('apply-custom-color').addEventListener('click', () => {
      const customColor = this.colorInput.value;
      const colorName = `Custom ${customColor.toUpperCase()}`;
      
      this.addToColorHistory(customColor, colorName);
      this.updateProductForm(customColor, colorName);
      this.selectedColorName.textContent = colorName;
      this.hideCustomColorPicker();
    });
    
    // Cancel custom color
    document.getElementById('cancel-custom-color').addEventListener('click', () => {
      this.hideCustomColorPicker();
      // Reselect the previously selected color
      const currentSelected = document.querySelector('.color-option.selected');
      if (currentSelected && currentSelected.dataset.color !== 'custom') {
        // Keep current selection
      } else {
        // Select first available color
        const firstColor = document.querySelector('.color-option:not(.color-option-custom)');
        if (firstColor) {
          this.selectColor(firstColor);
        }
      }
    });
    
    // Initialize preview
    this.updateColorPreview(this.colorInput.value);
  }
  
  updateColorPreview(color) {
    this.colorPreview.style.backgroundColor = color;
  }
  
  isValidHex(hex) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  }
  
  updateProductForm(color, colorName) {
    // Remove existing custom color input
    if (this.existingInput) {
      this.existingInput.remove();
    }
    
    // Create new hidden input for custom color
    this.existingInput = document.createElement('input');
    this.existingInput.id = 'customColorName';
    this.existingInput.name = 'properties[Custom Color]';
    this.existingInput.value = color;
    this.existingInput.type = 'hidden';
    
    const form = document.querySelector('.product-form form[action="/cart/add"]');
    if (form) {
      form.appendChild(this.existingInput);
    }
    
    // Trigger color change event for other components
    this.dispatchColorChangeEvent(color, colorName);
  }
  
  navigateToColorProduct(url) {
    // Add loading state
    document.body.classList.add('color-changing');
    
    // Navigate to the new product
    window.location.href = url;
  }
  
  addToColorHistory(color, colorName) {
    // Remove if already exists
    this.colorHistory = this.colorHistory.filter(item => item.color !== color);
    
    // Add to beginning
    this.colorHistory.unshift({ color, colorName, timestamp: Date.now() });
    
    // Limit to 8 items
    this.colorHistory = this.colorHistory.slice(0, 8);
    
    // Save to localStorage
    this.saveColorHistory();
    this.updateColorHistory();
  }
  
  updateColorHistory() {
    const historyGrid = document.getElementById('color-history-grid');
    const historySection = document.getElementById('color-history-section');
    
    if (this.colorHistory.length > 0) {
      historySection.style.display = 'block';
      historyGrid.innerHTML = '';
      
      this.colorHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'color-history-item';
        historyItem.style.backgroundColor = item.color;
        historyItem.title = item.colorName;
        historyItem.addEventListener('click', () => {
          this.colorInput.value = item.color;
          this.hexInput.value = item.color.toUpperCase();
          this.updateColorPreview(item.color);
        });
        
        historyGrid.appendChild(historyItem);
      });
    } else {
      historySection.style.display = 'none';
    }
  }
  
  loadColorHistory() {
    try {
      const history = localStorage.getItem('colorPickerHistory');
      return history ? JSON.parse(history) : [];
    } catch (e) {
      return [];
    }
  }
  
  saveColorHistory() {
    try {
      localStorage.setItem('colorPickerHistory', JSON.stringify(this.colorHistory));
    } catch (e) {
      console.warn('Could not save color history to localStorage');
    }
  }
  
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.customColorPanel.classList.contains('active')) {
        document.getElementById('cancel-custom-color').click();
      }
    });
  }
  
  dispatchColorChangeEvent(color, colorName) {
    const event = new CustomEvent('colorChanged', {
      detail: { color, colorName }
    });
    document.dispatchEvent(event);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.enhanced-color-picker')) {
    new EnhancedColorPicker();
  }
});

// Legacy support for existing functionality
const customColorInput = document.querySelector('#favcolor');
if (customColorInput && !document.querySelector('.enhanced-color-picker')) {
  // Keep old functionality if enhanced picker is not present
  let existingInput = document.querySelector('#customColorName');
  
  customColorInput.addEventListener('input', () => {
    appendOrUpdateInput(customColorInput.value);
  });
  
  function appendOrUpdateInput(val) {
    if (!existingInput || existingInput == null) {
      existingInput = document.createElement('input');
      existingInput.id = 'customColorName';
      existingInput.name = 'properties[Custom Color]';
      existingInput.value = val;
      existingInput.type = 'hidden';
      document.querySelector('.product-form form[action="/cart/add"]').appendChild(existingInput);
    } else {
      existingInput.remove();
      existingInput = document.createElement('input');
      existingInput.id = 'customColorName';
      existingInput.name = 'properties[Custom Color]';
      existingInput.value = val;
      existingInput.type = 'hidden';
      document.querySelector('.product-form form[action="/cart/add"]').appendChild(existingInput);
    }
  }
}