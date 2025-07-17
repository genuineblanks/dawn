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
    // Listen for bulk quantity tier button clicks
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('bulk-quantity-btn')) {
        e.preventDefault();
        this.handleQuantityTierClick(e.target);
      }
    });

    // Listen for variant changes from variant-selects component (passive monitoring)
    document.addEventListener('change', (e) => {
      if (e.target.closest('variant-selects')) {
        setTimeout(() => {
          this.updateCurrentVariant();
          console.log('🔄 Variant changed, current variant:', this.currentVariant?.id);
        }, 100);
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
    
    // Update active button state
    this.updateActiveButton(button);
    
    // Set the selected quantity tier
    this.selectedQuantityTier = tierQuantity;
    
    // Update quantity input to reflect the tier
    this.updateQuantityInput(tierQuantity);
    
    // CRITICAL: Ensure form state is synchronized
    this.synchronizeFormState();
    
    // Update pricing based on the tier
    this.updatePricing();
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
   * Synchronize form state with current selections
   */
  synchronizeFormState() {
    console.log('🔄 Synchronizing form state...');
    
    // Get current variant from variant-selects
    const variantSelects = document.querySelector('variant-selects');
    if (variantSelects) {
      // Force variant-selects to update its state
      const changeEvent = new Event('change', { bubbles: true });
      variantSelects.dispatchEvent(changeEvent);
      
      // Wait a moment for variant selection to process
      setTimeout(() => {
        this.updateCurrentVariant();
        this.ensureFormInputsAreSynced();
      }, 50);
    } else {
      this.ensureFormInputsAreSynced();
    }
  }

  /**
   * Ensure form inputs are properly synchronized
   */
  ensureFormInputsAreSynced() {
    // Ensure quantity input is correct
    const quantityInput = document.querySelector('input[name="quantity"]');
    if (quantityInput) {
      quantityInput.value = this.currentQuantity;
      console.log(`✅ Form quantity synchronized: ${this.currentQuantity}`);
    }
    
    // Ensure variant ID is correct
    const variantInput = document.querySelector('input[name="id"]');
    if (variantInput && this.currentVariant) {
      variantInput.value = this.currentVariant.id;
      console.log(`✅ Form variant synchronized: ${this.currentVariant.id}`);
    }
    
    // Trigger form validation and events
    const productForm = document.querySelector('product-form');
    if (productForm) {
      productForm.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    // Verify form state
    this.verifyFormState();
  }

  /**
   * Verify form state is correct
   */
  verifyFormState() {
    const quantityInput = document.querySelector('input[name="quantity"]');
    const variantInput = document.querySelector('input[name="id"]');
    
    console.log('🔍 Form State Verification:');
    console.log(`   Quantity input value: ${quantityInput?.value}`);
    console.log(`   Variant input value: ${variantInput?.value}`);
    console.log(`   Expected quantity: ${this.currentQuantity}`);
    console.log(`   Expected variant: ${this.currentVariant?.id}`);
    
    // Check for mismatches
    if (quantityInput && parseInt(quantityInput.value) !== this.currentQuantity) {
      console.warn('⚠️ Quantity mismatch detected!');
    }
    
    if (variantInput && this.currentVariant && variantInput.value != this.currentVariant.id) {
      console.warn('⚠️ Variant mismatch detected!');
    }
  }

  /**
   * Update pricing based on selected tier and quantity
   */
  updatePricing() {
    // For now, just update the quantity display
    // Let Shopify handle the actual pricing calculations
    console.log(`🔄 Updating pricing for quantity: ${this.currentQuantity}`);
    
    // Update any price displays that need to show the current quantity
    const quantityDisplays = document.querySelectorAll('.quantity-display');
    quantityDisplays.forEach(display => {
      display.textContent = this.currentQuantity;
    });
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