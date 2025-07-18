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
  
  // CRITICAL: Intercept form submission to debug and fix variant ID
  interceptFormSubmission(hiddenVariantInput, bulkQuantityMap);
  
  console.log(`✅ Bulk quantity variant handler initialized for ${bulkQuantityMap.size} variants`);
}

function interceptFormSubmission(hiddenVariantInput, bulkQuantityMap) {
  // Find ALL possible forms that could submit
  const allForms = document.querySelectorAll('form');
  const productForms = document.querySelectorAll('form[action*="/cart/add"], form[data-type="add-to-cart-form"]');
  
  console.log(`🔍 Found ${allForms.length} total forms, ${productForms.length} cart forms`);
  
  productForms.forEach((form, index) => {
    console.log(`🔒 Intercepting form ${index + 1} submission for debugging...`);
    
    form.addEventListener('submit', function(event) {
      console.log(`🚀 FORM ${index + 1} SUBMISSION INTERCEPTED!`);
      console.log(`📍 Form action: ${form.action}`);
      console.log(`📍 Form method: ${form.method}`);
      
      // Log ALL form inputs
      const allInputs = form.querySelectorAll('input');
      console.log(`📋 Form has ${allInputs.length} inputs:`);
      allInputs.forEach(input => {
        if (input.name === 'id' || input.name === 'quantity' || input.type === 'radio') {
          console.log(`   ${input.name}: "${input.value}" ${input.type === 'radio' ? (input.checked ? '(CHECKED)' : '(unchecked)') : ''}`);
        }
      });
      
      // Check which bulk quantity radio is actually selected
      let selectedBulkQuantity = 'None';
      let selectedRadioDetails = null;
      bulkQuantityMap.forEach((radio, value) => {
        if (radio.checked) {
          selectedBulkQuantity = value;
          selectedRadioDetails = {
            value: radio.value,
            name: radio.name,
            id: radio.id,
            form: radio.form ? radio.form.action : 'No form'
          };
        }
      });
      
      console.log(`📦 Selected bulk quantity: ${selectedBulkQuantity}`);
      if (selectedRadioDetails) {
        console.log(`📦 Selected radio details:`, selectedRadioDetails);
      }
      
      // Create FormData to see what will actually be sent
      const formData = new FormData(form);
      console.log(`📤 FormData contents:`);
      for (let [key, value] of formData.entries()) {
        console.log(`   ${key}: ${value}`);
      }
      
      // Check if there are multiple variant ID inputs
      const variantInputs = form.querySelectorAll('input[name="id"]');
      console.log(`🎯 Found ${variantInputs.length} variant ID inputs:`);
      variantInputs.forEach((input, idx) => {
        console.log(`   Input ${idx + 1}: value="${input.value}" class="${input.className}" id="${input.id}"`);
      });
      
      // Check if the radio button belongs to this form
      if (selectedRadioDetails && selectedRadioDetails.form !== form.action) {
        console.log(`⚠️ WARNING: Selected radio belongs to different form!`);
        console.log(`   Radio form: ${selectedRadioDetails.form}`);
        console.log(`   Submitting form: ${form.action}`);
      }
      
      console.log('✅ Allowing form submission to proceed...');
    });
  });
}

function selectBulkQuantityVariant(variantValue, bulkQuantityMap, hiddenVariantInput) {
  const targetRadio = bulkQuantityMap.get(variantValue);
  
  if (targetRadio) {
    console.log(`🎯 Selecting variant radio for: ${variantValue}`);
    
    // Uncheck all other radios in the same group first
    const radioGroup = document.querySelectorAll(`input[name="${targetRadio.name}"]`);
    radioGroup.forEach(radio => {
      radio.checked = false;
    });
    
    // Select the target radio button
    targetRadio.checked = true;
    
    // Trigger multiple events to ensure Shopify's variant system responds
    const events = ['change', 'input', 'click'];
    events.forEach(eventType => {
      const event = new Event(eventType, { bubbles: true, cancelable: true });
      targetRadio.dispatchEvent(event);
      console.log(`📡 Triggered ${eventType} event`);
    });
    
    // Force update the variant ID after a short delay
    setTimeout(() => {
      forceUpdateVariantId(targetRadio, hiddenVariantInput);
    }, 100);
    
    // Update debug display
    updateDebugDisplay(variantValue, hiddenVariantInput);
    
    console.log(`✅ Selected bulk quantity variant: ${variantValue}`);
  }
}

function forceUpdateVariantId(selectedRadio, hiddenVariantInput) {
  // Try to find the variant ID that corresponds to this radio button value
  const variantSelects = document.querySelector('variant-selects');
  
  if (variantSelects) {
    // Look for the JSON script that contains variant data
    const variantScript = variantSelects.querySelector('script[type="application/json"]');
    
    if (variantScript) {
      try {
        const variants = JSON.parse(variantScript.textContent);
        console.log(`🔍 Found ${variants.length} variants in product data`);
        
        // Find the variant that matches our selected radio button value
        const matchingVariant = variants.find(variant => {
          // Check if any option value matches our selected value
          return variant.option1 === selectedRadio.value || 
                 variant.option2 === selectedRadio.value || 
                 variant.option3 === selectedRadio.value ||
                 variant.title.includes(selectedRadio.value);
        });
        
        if (matchingVariant) {
          console.log(`🎯 Found matching variant ID: ${matchingVariant.id} for value: ${selectedRadio.value}`);
          
          // Update the hidden variant ID input
          if (hiddenVariantInput) {
            hiddenVariantInput.value = matchingVariant.id;
            console.log(`✅ Updated hidden variant ID to: ${matchingVariant.id}`);
            
            // Trigger change event on the hidden input
            const changeEvent = new Event('change', { bubbles: true });
            hiddenVariantInput.dispatchEvent(changeEvent);
          }
        } else {
          console.log(`❌ No matching variant found for value: ${selectedRadio.value}`);
          // Log all variants for debugging
          variants.forEach(variant => {
            console.log(`   Variant: ${variant.title} | ID: ${variant.id} | Options: ${variant.option1}, ${variant.option2}, ${variant.option3}`);
          });
        }
      } catch (error) {
        console.error('❌ Error parsing variant data:', error);
      }
    }
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
    const variantId = hiddenVariantInput ? hiddenVariantInput.value : 'Unknown';
    bulkPropertyDisplay.textContent = `${bulkQuantity} (ID: ${variantId})`;
  }
  
  // Also show current variant ID in console
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