/**
 * Simple Quantity Handler - Manages bulk quantity button functionality
 * Handles synchronization between bulk quantity buttons and form fields
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Simple quantity handler DOM loaded');
  // Initialize bulk quantity handlers
  initializeBulkQuantityHandlers();
});

// Also try immediate initialization in case DOM is already loaded
if (document.readyState === 'loading') {
  console.log('📄 DOM still loading, waiting...');
} else {
  console.log('📄 DOM already loaded, initializing immediately');
  initializeBulkQuantityHandlers();
}

function initializeBulkQuantityHandlers() {
  const bulkQuantityButtons = document.querySelectorAll('.bulk-quantity-btn');
  const quantityInput = document.querySelector('input[name="quantity"]');
  const productForm = document.querySelector('form[action*="/cart/add"]');
  
  if (!bulkQuantityButtons.length || !quantityInput || !productForm) {
    console.log('Bulk quantity elements not found, skipping initialization');
    return;
  }

  console.log('🔧 Initializing bulk quantity handler...');
  
  // Add click handlers to bulk quantity buttons
  bulkQuantityButtons.forEach(button => {
    button.addEventListener('click', function() {
      const selectedQuantity = this.getAttribute('data-quantity');
      
      if (selectedQuantity) {
        console.log(`📦 Bulk quantity selected: ${selectedQuantity}`);
        
        // Update the main quantity input field
        quantityInput.value = selectedQuantity;
        
        // Update or create the bulk quantity property field
        updateBulkQuantityProperty(selectedQuantity, productForm);
        
        // Update button active states
        updateButtonStates(this, bulkQuantityButtons);
        
        // Update debug display
        updateDebugDisplay(selectedQuantity);
        
        // Trigger quantity change event for other components
        triggerQuantityChangeEvent(quantityInput);
        
        console.log(`✅ Updated quantity to ${selectedQuantity}`);
      }
    });
  });
  
  console.log(`✅ Bulk quantity handler initialized for ${bulkQuantityButtons.length} buttons`);
}

function updateBulkQuantityProperty(quantity, form) {
  // Look for existing bulk quantity property input
  let bulkQuantityInput = form.querySelector('input[name="properties[Bulk Quantity]"]');
  
  if (bulkQuantityInput) {
    // Update existing input
    bulkQuantityInput.value = quantity;
    console.log(`📝 Updated existing bulk quantity property: ${quantity}`);
  } else {
    // Create new hidden input for bulk quantity property
    bulkQuantityInput = document.createElement('input');
    bulkQuantityInput.type = 'hidden';
    bulkQuantityInput.name = 'properties[Bulk Quantity]';
    bulkQuantityInput.value = quantity;
    bulkQuantityInput.id = 'bulk-quantity-property';
    
    // Append to form
    form.appendChild(bulkQuantityInput);
    console.log(`➕ Created new bulk quantity property: ${quantity}`);
  }
}

function updateButtonStates(activeButton, allButtons) {
  // Remove active class from all buttons
  allButtons.forEach(btn => btn.classList.remove('active'));
  
  // Add active class to clicked button
  activeButton.classList.add('active');
}

function updateDebugDisplay(quantity) {
  // Update debug display if it exists
  const quantityDisplay = document.getElementById('current-quantity-value');
  const bulkPropertyDisplay = document.getElementById('current-bulk-property');
  
  if (quantityDisplay) {
    quantityDisplay.textContent = quantity;
  }
  
  if (bulkPropertyDisplay) {
    bulkPropertyDisplay.textContent = quantity;
  }
}

function triggerQuantityChangeEvent(quantityInput) {
  // Trigger change event to notify other components
  const changeEvent = new Event('change', { bubbles: true });
  quantityInput.dispatchEvent(changeEvent);
  
  // Also trigger input event for real-time updates
  const inputEvent = new Event('input', { bubbles: true });
  quantityInput.dispatchEvent(inputEvent);
}

// Export for potential use by other scripts
window.BulkQuantityHandler = {
  initialize: initializeBulkQuantityHandlers,
  updateProperty: updateBulkQuantityProperty
};