/**
 * Native-Integrated Bulk Quantity Handler
 * Properly integrates with Shopify's native components and event system
 * Works with variant-selects, price-per-item, and product-form components
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('🔄 Native-Integrated Bulk Quantity Handler: Starting...');
  
  // Find all bulk quantity buttons
  const bulkButtons = document.querySelectorAll('.bulk-quantity-btn');
  console.log('🔍 Found bulk quantity buttons:', bulkButtons.length);
  
  if (bulkButtons.length === 0) {
    console.log('❌ No bulk quantity buttons found');
    return;
  }

  // Get references to native Shopify components
  const variantSelects = document.querySelector('variant-selects');
  const pricePerItem = document.querySelector('price-per-item');
  const productForm = document.querySelector('product-form');
  const quantityInput = document.querySelector('input[name="quantity"]');
  const quantityDisplay = document.querySelector('.quantity__input');
  
  console.log('🔍 Native components found:');
  console.log('   variant-selects:', !!variantSelects);
  console.log('   price-per-item:', !!pricePerItem);
  console.log('   product-form:', !!productForm);
  console.log('   quantity input:', !!quantityInput);
  console.log('   quantity display:', !!quantityDisplay);
  
  // Initialize bulk quantity handler
  const bulkQuantityHandler = {
    
    init() {
      this.bindEvents();
      this.setupInitialState();
    },
    
    bindEvents() {
      // Add click handlers to bulk quantity buttons
      bulkButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleBulkQuantityClick(button);
        });
      });
      
      // Listen for variant changes to update available quantity tiers
      if (variantSelects) {
        variantSelects.addEventListener('change', () => {
          console.log('🔄 Variant changed, updating bulk quantity options');
          this.updateBulkQuantityOptions();
        });
      }
    },
    
    setupInitialState() {
      // Set default active button if none selected
      const activeButton = document.querySelector('.bulk-quantity-btn.active');
      if (!activeButton && bulkButtons.length > 0) {
        // Set first button as active by default
        this.updateActiveButton(bulkButtons[0]);
      }
    },
    
    handleBulkQuantityClick(button) {
      const quantity = parseInt(button.dataset.quantity);
      console.log(`🔵 Bulk quantity button clicked: ${quantity}`);
      
      if (!quantity || quantity <= 0) {
        console.log('❌ Invalid quantity value');
        return;
      }
      
      try {
        // Update UI state
        this.updateActiveButton(button);
        
        // Update quantity inputs
        this.updateQuantityInputs(quantity);
        
        // Trigger native Shopify events for price updates
        this.triggerNativeEvents(quantity);
        
        console.log(`✅ Bulk quantity successfully updated to: ${quantity}`);
      } catch (error) {
        console.error('❌ Error handling bulk quantity click:', error);
        // Revert UI state if there was an error
        this.revertToPreviousState();
      }
    },
    
    updateActiveButton(activeButton) {
      // Remove active class from all buttons
      bulkButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.backgroundColor = '';
        btn.style.color = '';
      });
      
      // Add active class to clicked button
      activeButton.classList.add('active');
      activeButton.style.backgroundColor = '#000';
      activeButton.style.color = '#fff';
      
      console.log(`✅ Active button updated: ${activeButton.dataset.quantity}`);
    },
    
    updateQuantityInputs(quantity) {
      console.log(`🔄 Updating quantity inputs to: ${quantity}`);
      
      // Update hidden quantity input for form submission
      if (quantityInput) {
        quantityInput.value = quantity;
        console.log(`✅ Hidden quantity input updated: ${quantity}`);
      }
      
      // Update visible quantity display
      if (quantityDisplay) {
        quantityDisplay.value = quantity;
        console.log(`✅ Visible quantity display updated: ${quantity}`);
      }
    },
    
    triggerNativeEvents(quantity) {
      console.log('🔄 Triggering native Shopify events...');
      
      // 1. Trigger quantity input change events
      this.triggerQuantityInputEvents(quantity);
      
      // 2. Wait a moment then trigger variant change events for price updates
      setTimeout(() => {
        this.triggerVariantChangeEvents();
      }, 50);
      
      // 3. Publish quantity update event after a slight delay
      setTimeout(() => {
        this.publishQuantityUpdateEvent(quantity);
      }, 100);
      
      // 4. Force price recalculation after all events
      setTimeout(() => {
        this.forcePriceRecalculation(quantity);
      }, 200);
    },
    
    triggerQuantityInputEvents(quantity) {
      const inputs = [quantityInput, quantityDisplay].filter(input => input);
      
      inputs.forEach(input => {
        if (input) {
          // Trigger input event
          input.dispatchEvent(new Event('input', { bubbles: true }));
          
          // Trigger change event
          input.dispatchEvent(new Event('change', { bubbles: true }));
          
          console.log(`✅ Events triggered on ${input.name || input.className}`);
        }
      });
      
      // Trigger change event on quantity-input custom element
      const quantityInputElement = document.querySelector('quantity-input');
      if (quantityInputElement) {
        quantityInputElement.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('✅ Events triggered on quantity-input element');
      }
      
      // Trigger price-per-item component update
      this.triggerPricePerItemUpdate(quantity);
    },
    
    triggerVariantChangeEvents() {
      if (variantSelects) {
        // Trigger change event on variant-selects to update pricing
        variantSelects.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('✅ Variant change event triggered');
      }
    },
    
    publishQuantityUpdateEvent(quantity) {
      // Publish quantity update event using Shopify's pubsub system
      if (typeof publish === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
        publish(PUB_SUB_EVENTS.quantityUpdate, {
          quantity: quantity,
          source: 'bulk-quantity-handler'
        });
        console.log(`✅ Quantity update event published: ${quantity}`);
      }
    },
    
    triggerPricePerItemUpdate(quantity) {
      // Manually trigger price-per-item component update
      if (pricePerItem && pricePerItem.onInputChange) {
        pricePerItem.onInputChange();
        console.log('✅ Price-per-item component updated manually');
      }
      
      // Also trigger events on the specific quantity input that price-per-item listens to
      const sectionId = variantSelects?.dataset?.section;
      if (sectionId) {
        const pricePerItemInput = document.getElementById(`Quantity-${sectionId}`);
        if (pricePerItemInput) {
          pricePerItemInput.value = quantity;
          pricePerItemInput.dispatchEvent(new Event('change', { bubbles: true }));
          console.log(`✅ Price-per-item quantity input updated: ${quantity}`);
        }
      }
    },
    
    forcePriceRecalculation(quantity) {
      console.log('🔄 Forcing price recalculation...');
      
      // Force variant-selects to recalculate pricing
      if (variantSelects && variantSelects.renderProductInfo) {
        variantSelects.renderProductInfo();
        console.log('✅ Forced variant-selects price recalculation');
      }
      
      // Force price-per-item recalculation
      if (pricePerItem && pricePerItem.updatePricePerItem) {
        pricePerItem.updatePricePerItem();
        console.log('✅ Forced price-per-item recalculation');
      }
      
      // Update any volume pricing displays
      const volumePricingElements = document.querySelectorAll('[id^="Volume-"]');
      volumePricingElements.forEach(element => {
        element.dispatchEvent(new Event('update', { bubbles: true }));
      });
    },
    
    updateBulkQuantityOptions() {
      // Update bulk quantity buttons based on current variant's price breaks
      // This could be expanded to dynamically update buttons based on available tiers
      console.log('🔄 Updating bulk quantity options for new variant');
      
      // Ensure variant ID is preserved when updating quantity
      const variantIdInput = document.querySelector('input[name="id"]');
      const currentVariantId = variantIdInput?.value;
      
      // Maintain current selection
      const activeButton = document.querySelector('.bulk-quantity-btn.active');
      if (activeButton) {
        const currentQuantity = parseInt(activeButton.dataset.quantity);
        this.updateQuantityInputs(currentQuantity);
        
        // Re-trigger events after variant change
        setTimeout(() => {
          this.triggerNativeEvents(currentQuantity);
        }, 100);
      }
      
      // Ensure variant ID hasn't changed
      if (currentVariantId && variantIdInput) {
        variantIdInput.value = currentVariantId;
        console.log(`✅ Variant ID preserved: ${currentVariantId}`);
      }
    },
    
    revertToPreviousState() {
      console.log('🔄 Reverting to previous state...');
      
      // Find the previously active button or default to first button
      const buttons = document.querySelectorAll('.bulk-quantity-btn');
      if (buttons.length > 0) {
        const previousActive = buttons[0]; // Default to first button
        this.updateActiveButton(previousActive);
        
        const previousQuantity = parseInt(previousActive.dataset.quantity);
        this.updateQuantityInputs(previousQuantity);
        
        console.log(`✅ Reverted to quantity: ${previousQuantity}`);
      }
    },
    
    // Debug function to verify current state
    debugCurrentState() {
      console.log('🔍 Current State Debug:');
      console.log(`   Quantity input value: ${quantityInput?.value}`);
      console.log(`   Quantity display value: ${quantityDisplay?.value}`);
      console.log(`   Active button: ${document.querySelector('.bulk-quantity-btn.active')?.dataset.quantity}`);
      
      const variantIdInput = document.querySelector('input[name="id"]');
      console.log(`   Variant ID: ${variantIdInput?.value}`);
      
      // Check if native components are working
      console.log('🔍 Native Component Status:');
      console.log(`   variant-selects exists: ${!!variantSelects}`);
      console.log(`   price-per-item exists: ${!!pricePerItem}`);
      console.log(`   product-form exists: ${!!productForm}`);
    }
  };
  
  // Initialize the bulk quantity handler
  bulkQuantityHandler.init();
  
  // Export for debugging
  window.bulkQuantityHandler = bulkQuantityHandler;
  
  // Debug state after 1 second
  setTimeout(() => {
    bulkQuantityHandler.debugCurrentState();
  }, 1000);
  
  console.log('✅ Native-Integrated Bulk Quantity Handler: Initialized');
});