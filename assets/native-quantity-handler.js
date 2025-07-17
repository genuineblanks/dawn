/**
 * Native Shopify Quantity Handler
 * Handles bulk quantity tier selection and ensures proper integration with Shopify's native components
 */

class NativeQuantityHandler {
  constructor() {
    this.currentQuantity = 1;
    this.currentVariant = null;
    this.selectedQuantityTier = null;
    this.quantityPriceBreaks = [];
    
    this.init();
  }

  init() {
    console.log('🔄 Initializing Native Quantity Handler');
    this.loadVariantData();
    this.bindEvents();
    this.setupQuantityTierButtons();
  }

  /**
   * Load variant data from the variant-selects component
   */
  loadVariantData() {
    const variantSelects = document.querySelector('variant-selects');
    if (variantSelects) {
      const variantScript = variantSelects.querySelector('script[type="application/json"]');
      if (variantScript) {
        try {
          const variants = JSON.parse(variantScript.textContent);
          this.variants = variants;
          this.updateCurrentVariant();
        } catch (error) {
          console.warn('Could not parse variant data:', error);
        }
      }
    }
  }

  /**
   * Update current variant based on selected options
   */
  updateCurrentVariant() {
    const variantIdInput = document.querySelector('input[name="id"]');
    if (variantIdInput && this.variants) {
      const variantId = variantIdInput.value;
      this.currentVariant = this.variants.find(v => v.id == variantId);
      
      if (this.currentVariant && this.currentVariant.quantity_price_breaks) {
        this.quantityPriceBreaks = this.currentVariant.quantity_price_breaks;
        this.updateQuantityTierButtons();
      }
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Listen for variant changes from variant-selects component
    document.addEventListener('change', (e) => {
      if (e.target.closest('variant-selects')) {
        setTimeout(() => {
          this.updateCurrentVariant();
          this.updatePricing();
        }, 100);
      }
    });

    // Listen for quantity input changes
    document.addEventListener('input', (e) => {
      if (e.target.classList.contains('quantity__input')) {
        this.currentQuantity = parseInt(e.target.value) || 1;
        this.updatePricing();
      }
    });

    // Listen for bulk quantity tier button clicks
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('bulk-quantity-btn')) {
        e.preventDefault();
        this.handleQuantityTierClick(e.target);
      }
    });
  }

  /**
   * Setup quantity tier buttons
   */
  setupQuantityTierButtons() {
    const buttons = document.querySelectorAll('.bulk-quantity-btn');
    buttons.forEach(button => {
      const quantity = parseInt(button.dataset.quantity);
      if (quantity) {
        button.addEventListener('click', () => this.handleQuantityTierClick(button));
      }
    });
  }

  /**
   * Handle quantity tier button click
   */
  handleQuantityTierClick(button) {
    const tierQuantity = parseInt(button.dataset.quantity);
    console.log(`🔵 Button clicked, tier quantity: ${tierQuantity}`);
    
    if (!tierQuantity) {
      console.log('❌ No tier quantity found');
      return;
    }

    console.log(`🔵 Quantity tier selected: ${tierQuantity}`);
    console.log(`🔵 Current variant:`, this.currentVariant);
    console.log(`🔵 Available price breaks:`, this.quantityPriceBreaks);
    
    // Update active button state
    this.updateActiveButton(button);
    
    // Set the selected quantity tier
    this.selectedQuantityTier = tierQuantity;
    
    // Update quantity input to reflect the tier
    this.updateQuantityInput(tierQuantity);
    
    // Update pricing based on the tier
    this.updatePricing();
    
    // Trigger events for other components
    this.triggerQuantityTierChange(tierQuantity);
  }

  /**
   * Update active button state
   */
  updateActiveButton(activeButton) {
    // Remove active state from all buttons
    document.querySelectorAll('.bulk-quantity-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Add active state to clicked button
    activeButton.classList.add('active');
  }

  /**
   * Update quantity input field
   */
  updateQuantityInput(quantity) {
    const quantityInput = document.querySelector('.quantity__input');
    console.log('🔄 Updating quantity input to:', quantity);
    console.log('🔄 Found quantity input:', !!quantityInput);
    
    if (quantityInput) {
      quantityInput.value = quantity;
      this.currentQuantity = quantity;
      
      // Trigger native events
      quantityInput.dispatchEvent(new Event('input', { bubbles: true }));
      quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Also trigger on the parent quantity-input element
      const quantityInputElement = quantityInput.closest('quantity-input');
      if (quantityInputElement) {
        quantityInputElement.dispatchEvent(new Event('change', { bubbles: true }));
      }
      
      console.log('✅ Quantity input updated');
    } else {
      console.log('❌ Quantity input not found');
    }
  }

  /**
   * Update pricing based on selected tier and quantity
   */
  updatePricing() {
    if (!this.currentVariant) return;

    const tierQuantity = this.selectedQuantityTier || this.currentQuantity;
    const multiplier = this.currentQuantity;
    
    // Find the appropriate price break for the tier
    const priceBreak = this.findPriceBreak(tierQuantity);
    const finalPrice = priceBreak ? priceBreak.price : this.currentVariant.price;
    
    // Update price display
    this.updatePriceDisplay(finalPrice, multiplier);
    
    // Update price-per-item component
    this.updatePricePerItem(finalPrice, tierQuantity);
  }

  /**
   * Find price break for given quantity
   */
  findPriceBreak(quantity) {
    if (!this.quantityPriceBreaks || this.quantityPriceBreaks.length === 0) {
      return null;
    }

    let bestBreak = null;
    for (const priceBreak of this.quantityPriceBreaks) {
      if (quantity >= priceBreak.minimum_quantity) {
        if (!bestBreak || priceBreak.minimum_quantity > bestBreak.minimum_quantity) {
          bestBreak = priceBreak;
        }
      }
    }
    
    return bestBreak;
  }

  /**
   * Update price display
   */
  updatePriceDisplay(price, multiplier) {
    const totalPrice = price * multiplier;
    
    // Update main price display
    const priceElements = document.querySelectorAll('.price-item--regular');
    priceElements.forEach(element => {
      const formattedPrice = this.formatMoney(totalPrice);
      element.textContent = formattedPrice;
    });
  }

  /**
   * Update price-per-item component
   */
  updatePricePerItem(price, tierQuantity) {
    const pricePerItem = document.querySelector('price-per-item');
    if (pricePerItem) {
      const formattedPrice = this.formatMoney(price);
      const priceText = `${formattedPrice} each (${tierQuantity} tier)`;
      
      const priceSpan = pricePerItem.querySelector('.price-per-item--current');
      if (priceSpan) {
        priceSpan.textContent = priceText;
      }
    }
  }

  /**
   * Update quantity tier buttons based on current variant
   */
  updateQuantityTierButtons() {
    const buttonContainer = document.querySelector('.bulk-quantity-buttons');
    if (!buttonContainer || !this.quantityPriceBreaks) return;

    // Clear existing buttons
    buttonContainer.innerHTML = '';

    // Create buttons for each price break
    this.quantityPriceBreaks.forEach(priceBreak => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'bulk-quantity-btn';
      button.dataset.quantity = priceBreak.minimum_quantity;
      button.textContent = priceBreak.minimum_quantity;
      
      button.addEventListener('click', () => this.handleQuantityTierClick(button));
      buttonContainer.appendChild(button);
    });
  }

  /**
   * Trigger quantity tier change event
   */
  triggerQuantityTierChange(tierQuantity) {
    document.dispatchEvent(new CustomEvent('quantity-tier:change', {
      detail: {
        tier: tierQuantity,
        variant: this.currentVariant,
        quantity: this.currentQuantity
      },
      bubbles: true
    }));
  }

  /**
   * Format money using Shopify's format
   */
  formatMoney(cents) {
    const currency = window.Shopify?.currency?.active || 'EUR';
    const format = window.Shopify?.money_format || '€{{amount}}';
    
    const value = (cents / 100).toFixed(2);
    return format.replace('{{amount}}', value);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔍 Native Quantity Handler: DOM loaded');
  
  const bulkButtons = document.querySelectorAll('.bulk-quantity-btn');
  console.log('🔍 Found bulk quantity buttons:', bulkButtons.length);
  
  const quantityInput = document.querySelector('.quantity__input');
  console.log('🔍 Found quantity input:', !!quantityInput);
  
  const variantSelects = document.querySelector('variant-selects');
  console.log('🔍 Found variant-selects:', !!variantSelects);
  
  const priceElements = document.querySelectorAll('.price-item--regular');
  console.log('🔍 Found price elements:', priceElements.length);
  
  if (bulkButtons.length > 0) {
    console.log('✅ Initializing Native Quantity Handler');
    window.nativeQuantityHandler = new NativeQuantityHandler();
  } else {
    console.log('❌ No bulk quantity buttons found');
  }
});

// Export for use in other scripts
window.NativeQuantityHandler = NativeQuantityHandler;