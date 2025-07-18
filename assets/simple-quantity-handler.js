/**
 * Bulk Quantity Variant Handler - Manages bulk quantity variant selection
 * Maps bulk quantity buttons to Shopify variant radio buttons
 */

// Add a simple test to verify the script loads
console.log('🔥 BULK QUANTITY VARIANT HANDLER LOADED!');

// Test function that can be called from console
window.testBulkQuantity = function() {
  console.log('🧪 Testing bulk quantity variant elements...');
  
  // Look for variant radio buttons with bulk quantity values
  const variantRadios = document.querySelectorAll('input[type="radio"]');
  const variantSelect = document.querySelector('variant-selects');
  const hiddenVariantInput = document.querySelector('input[name="id"]');
  
  console.log('Variant radios found:', variantRadios.length);
  console.log('Variant selects component:', !!variantSelect);
  console.log('Hidden variant ID input:', !!hiddenVariantInput);
  
  // List all radio button values
  variantRadios.forEach((radio, index) => {
    if (radio.value.match(/\d{4,}/)) { // Look for 4+ digit numbers (bulk quantities)
      console.log(`Radio ${index}: name="${radio.name}" value="${radio.value}" id="${radio.id}"`);
    }
  });
  
  if (hiddenVariantInput) {
    console.log('Current variant ID:', hiddenVariantInput.value);
  }
};

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Bulk quantity variant handler DOM loaded');
  // Initialize bulk quantity variant handlers
  initializeBulkQuantityVariantHandlers();
});

// Also try immediate initialization in case DOM is already loaded
if (document.readyState === 'loading') {
  console.log('📄 DOM still loading, waiting...');
} else {
  console.log('📄 DOM already loaded, initializing immediately');
  initializeBulkQuantityVariantHandlers();
}

// Alternative initialization using setTimeout to ensure everything is loaded
setTimeout(() => {
  console.log('⏰ Timeout initialization attempt...');
  initializeBulkQuantityVariantHandlers();
}, 1000);

function initializeBulkQuantityVariantHandlers() {
  // Find variant radio buttons that correspond to bulk quantities
  const variantRadios = document.querySelectorAll('input[type="radio"]');
  const hiddenVariantInput = document.querySelector('input[name="id"]');
  const variantSelects = document.querySelector('variant-selects');
  
  console.log(`🔍 Found ${variantRadios.length} variant radio buttons`);
  console.log('🔍 Hidden variant ID input:', hiddenVariantInput ? `Found: ${hiddenVariantInput.value}` : 'Not found');
  console.log('🔍 Variant selects component:', variantSelects ? 'Found' : 'Not found');
  
  // Map bulk quantity values to their corresponding radio buttons
  const bulkQuantityMap = new Map();
  
  variantRadios.forEach((radio, index) => {
    // Look for radio buttons with bulk quantity values (1000, 2000, 5000, 10000)
    if (radio.value.match(/^(1000|2000|5000|10000)$/)) {
      console.log(`📦 Found bulk quantity radio: ${radio.value} (ID: ${radio.id})`);
      bulkQuantityMap.set(radio.value, radio);
    }
  });
  
  if (bulkQuantityMap.size === 0) {
    console.log('❌ No bulk quantity variant radios found, skipping initialization');
    return;
  }

  console.log(`🔧 Initializing bulk quantity variant handler for ${bulkQuantityMap.size} variants...`);
  
  // Initialize debug display
  initializeDebugDisplay(hiddenVariantInput, bulkQuantityMap);
  
  // Add click handlers to bulk quantity variant labels 
  document.addEventListener('click', function(event) {
    // Check if clicked element is a label for a bulk quantity radio button
    if (event.target.tagName === 'LABEL') {
      const labelFor = event.target.getAttribute('for');
      const targetRadio = document.getElementById(labelFor);
      
      if (targetRadio && bulkQuantityMap.has(targetRadio.value)) {
        const selectedVariant = targetRadio.value;
        console.log(`📦 Bulk quantity variant clicked: ${selectedVariant}`);
        
        // Select the corresponding radio button
        selectBulkQuantityVariant(selectedVariant, bulkQuantityMap, hiddenVariantInput);
      }
    }
    
    // Also handle direct radio button clicks
    if (event.target.type === 'radio' && bulkQuantityMap.has(event.target.value)) {
      const selectedVariant = event.target.value;
      console.log(`📦 Bulk quantity radio clicked: ${selectedVariant}`);
      
      // Update the hidden variant ID
      updateVariantId(event.target, hiddenVariantInput);
    }
  });
  
  console.log(`✅ Bulk quantity variant handler initialized for ${bulkQuantityMap.size} variants`);
}

function selectBulkQuantityVariant(variantValue, bulkQuantityMap, hiddenVariantInput) {
  const targetRadio = bulkQuantityMap.get(variantValue);
  
  if (targetRadio) {
    // Select the radio button
    targetRadio.checked = true;
    
    // Trigger change event to notify Shopify's variant system
    const changeEvent = new Event('change', { bubbles: true });
    targetRadio.dispatchEvent(changeEvent);
    
    // Update debug display
    updateDebugDisplay(variantValue, hiddenVariantInput);
    
    console.log(`✅ Selected bulk quantity variant: ${variantValue}`);
  }
}

function updateVariantId(selectedRadio, hiddenVariantInput) {
  // Get the variant ID from Shopify's variant system
  const variantSelects = document.querySelector('variant-selects');
  
  if (variantSelects) {
    // Let Shopify handle the variant ID update
    console.log(`🔄 Letting Shopify update variant ID for: ${selectedRadio.value}`);
  } else if (hiddenVariantInput) {
    // Fallback: need to map variant value to variant ID
    console.log(`⚠️ No variant-selects found, need manual variant ID mapping`);
  }
  
  // Update debug display
  updateDebugDisplay(selectedRadio.value, hiddenVariantInput);
}

function initializeDebugDisplay(hiddenVariantInput, bulkQuantityMap) {
  // Find current selected bulk quantity
  let currentBulkQuantity = 'Not set';
  
  bulkQuantityMap.forEach((radio, value) => {
    if (radio.checked) {
      currentBulkQuantity = value;
    }
  });
  
  // Update debug if elements exist
  updateDebugDisplay(currentBulkQuantity, hiddenVariantInput);
  
  console.log('🐛 Debug display initialized');
}

function updateDebugDisplay(bulkQuantity, hiddenVariantInput) {
  // Update debug display if it exists
  const quantityDisplay = document.getElementById('current-quantity-value');
  const bulkPropertyDisplay = document.getElementById('current-bulk-property');
  
  if (quantityDisplay) {
    quantityDisplay.textContent = '1'; // Always 1 for variants
  }
  
  if (bulkPropertyDisplay) {
    bulkPropertyDisplay.textContent = bulkQuantity;
  }
  
  // Also show current variant ID
  if (hiddenVariantInput) {
    console.log(`🔍 Current variant ID: ${hiddenVariantInput.value} | Bulk quantity: ${bulkQuantity}`);
  }
}

// Export for potential use by other scripts
window.BulkQuantityVariantHandler = {
  initialize: initializeBulkQuantityVariantHandlers,
  selectVariant: selectBulkQuantityVariant,
  test: window.testBulkQuantity
};