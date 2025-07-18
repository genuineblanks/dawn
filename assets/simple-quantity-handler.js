/**
 * Simple Quantity Handler - Manages bulk quantity button functionality
 * Handles synchronization between bulk quantity buttons and form fields
 */

// Add a simple test to verify the script loads
console.log('🔥 SIMPLE QUANTITY HANDLER SCRIPT LOADED!');

// Test function that can be called from console
window.testBulkQuantity = function() {
  console.log('🧪 Testing bulk quantity elements...');
  
  const buttons = document.querySelectorAll('.bulk-quantity-btn');
  const quantityInput = document.querySelector('input[name="quantity"]');
  const forms = document.querySelectorAll('form');
  
  console.log('Bulk buttons found:', buttons.length);
  console.log('Quantity input found:', !!quantityInput);
  console.log('All forms found:', forms.length);
  
  forms.forEach((form, index) => {
    console.log(`Form ${index}:`, form.action);
  });
  
  if (buttons.length > 0) {
    console.log('First button data-quantity:', buttons[0].getAttribute('data-quantity'));
  }
};

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

// Alternative initialization using setTimeout to ensure everything is loaded
setTimeout(() => {
  console.log('⏰ Timeout initialization attempt...');
  initializeBulkQuantityHandlers();
}, 1000);

function initializeBulkQuantityHandlers() {
  const bulkQuantityButtons = document.querySelectorAll('.bulk-quantity-btn');
  
  // Try multiple selectors for quantity input
  let quantityInput = document.querySelector('input[name="quantity"]');
  if (!quantityInput) {
    quantityInput = document.querySelector('.quantity__input');
  }
  if (!quantityInput) {
    quantityInput = document.querySelector('input[type="number"]');
  }
  
  // Try multiple selectors for form
  let productForm = document.querySelector('form[action*="/cart/add"]');
  if (!productForm) {
    productForm = document.querySelector('form[data-type="add-to-cart-form"]');
  }
  if (!productForm) {
    productForm = document.querySelector('.product-form form');
  }
  
  console.log(`🔍 Found ${bulkQuantityButtons.length} bulk quantity buttons`);
  console.log('🔍 Quantity input:', quantityInput ? `Found: ${quantityInput.name || quantityInput.className}` : 'Not found');
  console.log('🔍 Product form:', productForm ? `Found: ${productForm.action}` : 'Not found');
  
  // Debug: List all inputs to see what's available
  const allInputs = document.querySelectorAll('input');
  console.log('🔍 All inputs on page:', allInputs.length);
  allInputs.forEach((input, index) => {
    if (input.name === 'quantity' || input.type === 'number' || input.className.includes('quantity')) {
      console.log(`   Input ${index}: name="${input.name}" type="${input.type}" class="${input.className}"`);
    }
  });
  
  if (!bulkQuantityButtons.length || !quantityInput || !productForm) {
    console.log('❌ Bulk quantity elements not found, skipping initialization');
    return;
  }

  console.log('🔧 Initializing bulk quantity handler...');
  
  // Initialize debug display with current values
  initializeDebugDisplay(quantityInput);
  
  // Add click handlers to bulk quantity buttons using event delegation
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('bulk-quantity-btn')) {
      event.preventDefault();
      event.stopPropagation();
      
      const selectedQuantity = event.target.getAttribute('data-quantity');
      
      if (selectedQuantity) {
        console.log(`📦 Bulk quantity clicked: ${selectedQuantity}`);
        
        // Update the main quantity input field
        quantityInput.value = selectedQuantity;
        
        // Update or create the bulk quantity property field
        updateBulkQuantityProperty(selectedQuantity, productForm);
        
        // Update button active states
        updateButtonStates(event.target, bulkQuantityButtons);
        
        // Update debug display
        updateDebugDisplay(selectedQuantity);
        
        // Trigger quantity change event for other components
        triggerQuantityChangeEvent(quantityInput);
        
        console.log(`✅ Updated quantity to ${selectedQuantity}`);
      }
    }
  });
  
  // Also try direct event listeners as backup
  bulkQuantityButtons.forEach((button, index) => {
    console.log(`🔗 Adding direct listener to button ${index + 1}`);
    
    // Remove any existing listeners
    button.removeEventListener('click', handleBulkQuantityClick);
    
    // Add new listener
    button.addEventListener('click', handleBulkQuantityClick, true);
  });
  
  function handleBulkQuantityClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const selectedQuantity = this.getAttribute('data-quantity');
    
    if (selectedQuantity) {
      console.log(`📦 Direct click handler - Bulk quantity selected: ${selectedQuantity}`);
      
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
      
      console.log(`✅ Direct handler - Updated quantity to ${selectedQuantity}`);
    }
  }
  
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

function initializeDebugDisplay(quantityInput) {
  // Initialize debug display with current values
  const quantityDisplay = document.getElementById('current-quantity-value');
  const bulkPropertyDisplay = document.getElementById('current-bulk-property');
  const existingBulkProperty = document.querySelector('input[name="properties[Bulk Quantity]"]');
  
  if (quantityDisplay && quantityInput) {
    quantityDisplay.textContent = quantityInput.value || '1';
  }
  
  if (bulkPropertyDisplay) {
    if (existingBulkProperty) {
      bulkPropertyDisplay.textContent = existingBulkProperty.value;
    } else {
      bulkPropertyDisplay.textContent = 'Not set';
    }
  }
  
  console.log('🐛 Debug display initialized');
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