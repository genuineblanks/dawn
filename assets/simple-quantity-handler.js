/**
 * Simple Quantity Handler - Direct DOM Manipulation
 * Direct approach that actually works with Shopify's form system
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('🔄 Simple Quantity Handler: Starting...');
  
  // Find all bulk quantity buttons
  const bulkButtons = document.querySelectorAll('.bulk-quantity-btn');
  console.log('🔍 Found bulk quantity buttons:', bulkButtons.length);
  
  if (bulkButtons.length === 0) {
    console.log('❌ No bulk quantity buttons found');
    return;
  }
  
  // Add click handlers to each button
  bulkButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const quantity = parseInt(this.dataset.quantity);
      console.log(`🔵 Bulk quantity button clicked: ${quantity}`);
      
      if (!quantity) {
        console.log('❌ No quantity data found');
        return;
      }
      
      // Update active button state
      updateActiveButton(this);
      
      // Update quantity input directly
      updateQuantityInput(quantity);
      
      // Trigger Shopify's quantity change events
      triggerQuantityEvents(quantity);
      
      console.log(`✅ Bulk quantity updated to: ${quantity}`);
    });
  });
  
  /**
   * Update active button state
   */
  function updateActiveButton(activeButton) {
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
  }
  
  /**
   * Update quantity input field
   */
  function updateQuantityInput(quantity) {
    // Find the quantity input
    const quantityInput = document.querySelector('input[name="quantity"]');
    const quantityDisplay = document.querySelector('.quantity__input');
    
    console.log('🔄 Updating quantity input...');
    console.log('🔍 Found quantity input:', !!quantityInput);
    console.log('🔍 Found quantity display:', !!quantityDisplay);
    
    if (quantityInput) {
      quantityInput.value = quantity;
      console.log(`✅ Updated hidden quantity input: ${quantity}`);
    }
    
    if (quantityDisplay) {
      quantityDisplay.value = quantity;
      console.log(`✅ Updated visible quantity display: ${quantity}`);
    }
  }
  
  /**
   * Trigger Shopify's quantity change events
   */
  function triggerQuantityEvents(quantity) {
    const quantityInput = document.querySelector('input[name="quantity"]');
    const quantityDisplay = document.querySelector('.quantity__input');
    const productForm = document.querySelector('product-form');
    
    console.log('🔄 Triggering quantity change events...');
    
    // Trigger events on both inputs
    [quantityInput, quantityDisplay].forEach(input => {
      if (input) {
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(`✅ Events triggered on ${input.tagName}`);
      }
    });
    
    // Trigger events on product form
    if (productForm) {
      productForm.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('✅ Events triggered on product form');
    }
    
    // Try to trigger quantity-input custom element events
    const quantityInputElement = document.querySelector('quantity-input');
    if (quantityInputElement) {
      quantityInputElement.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('✅ Events triggered on quantity-input element');
    }
    
    // Force a page refresh event to update prices
    setTimeout(() => {
      console.log('🔄 Triggering price update...');
      const priceElements = document.querySelectorAll('[data-price]');
      priceElements.forEach(el => {
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
      
      // Try to trigger variant change to update pricing
      const variantSelects = document.querySelector('variant-selects');
      if (variantSelects) {
        variantSelects.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('✅ Triggered variant-selects change');
      }
    }, 100);
  }
  
  // Debug variant selection
  const variantInputs = document.querySelectorAll('variant-selects input[type="radio"]');
  console.log('🔍 Found variant inputs:', variantInputs.length);
  
  variantInputs.forEach(input => {
    input.addEventListener('change', function() {
      console.log(`🔵 Variant selected: ${this.value}`);
      setTimeout(() => {
        const variantIdInput = document.querySelector('input[name="id"]');
        console.log(`🔍 Variant ID input value: ${variantIdInput?.value}`);
      }, 100);
    });
  });
  
  // Debug current form state
  setTimeout(() => {
    console.log('🔍 Current form state:');
    const quantityInput = document.querySelector('input[name="quantity"]');
    const variantIdInput = document.querySelector('input[name="id"]');
    console.log(`   Quantity: ${quantityInput?.value}`);
    console.log(`   Variant ID: ${variantIdInput?.value}`);
  }, 1000);
  
  console.log('✅ Simple Quantity Handler: Initialized');
});