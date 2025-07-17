/**
 * Bulk Quantity Handler
 * Handles bulk quantity button selection and integrates with Shopify's volume pricing
 */

class BulkQuantityHandler {
  constructor() {
    this.currentQuantity = 1;
    this.currentVariant = null;
    this.bulkQuantities = [1000, 2000, 5000, 10000];
    this.volumePricing = {};
    this.productId = null;
    this.isLoading = false;
    
    this.init();
  }

  /**
   * Initialize the bulk quantity handler
   */
  init() {
    this.bindEvents();
    this.loadProductData();
    this.initializeVolumeData();
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Bulk quantity button clicks - listen for multiple possible selectors
    document.addEventListener('click', (e) => {
      const bulkBtn = e.target.closest('.bulk-quantity-btn, [data-quantity], .bulk-btn, button[data-bulk-quantity]');
      if (bulkBtn) {
        e.preventDefault();
        this.handleBulkQuantityClick(bulkBtn);
      }
    });

    // Variant changes - listen for multiple event types
    document.addEventListener('variant:change', (e) => {
      if (e.detail && e.detail.variant) {
        this.currentVariant = e.detail.variant;
        this.updatePricing();
      }
    });

    // Listen for Shopify's native variant change events
    document.addEventListener('change', (e) => {
      if (e.target.closest('variant-selects')) {
        setTimeout(() => {
          this.updateCurrentVariant();
          this.updatePricing();
        }, 100);
      }
    });

    // Cart updates
    document.addEventListener('cart:updated', () => {
      this.updatePricing();
    });

    // Manual quantity input changes
    document.addEventListener('input', (e) => {
      if (e.target.classList.contains('quantity-input')) {
        this.handleQuantityInputChange(e.target);
      }
    });

    // Listen for URL changes (variant selection changes URL)
    window.addEventListener('popstate', () => {
      this.updateCurrentVariant();
      this.updatePricing();
    });
  }

  /**
   * Load product data from DOM
   */
  loadProductData() {
    const productForm = document.querySelector('product-form');
    if (productForm) {
      this.productId = productForm.dataset.productId;
      const variantIdInput = productForm.querySelector('.product-variant-id');
      if (variantIdInput) {
        this.currentVariant = { id: variantIdInput.value };
      }
    }

    // Try to get product data from window.product or variant script
    if (window.product) {
      this.productId = window.product.id;
    }

    // Update current variant
    this.updateCurrentVariant();
  }

  /**
   * Update current variant from DOM
   */
  updateCurrentVariant() {
    const variantIdInput = document.querySelector('.product-variant-id');
    if (variantIdInput && variantIdInput.value) {
      // Get variant data from the variant script
      const variantScript = document.querySelector('variant-selects script[type="application/json"]');
      if (variantScript) {
        try {
          const variants = JSON.parse(variantScript.textContent);
          const currentVariant = variants.find(v => v.id == variantIdInput.value);
          if (currentVariant) {
            this.currentVariant = currentVariant;
            return;
          }
        } catch (error) {
          console.warn('Could not parse variant data', error);
        }
      }
      
      // Fallback: create basic variant object
      this.currentVariant = { id: variantIdInput.value };
    }
  }

  /**
   * Initialize volume pricing data
   */
  initializeVolumeData() {
    // Check if product has volume pricing configured
    const productElement = document.querySelector('[data-product-id]');
    if (productElement) {
      this.productId = productElement.dataset.productId;
    }

    // Load volume pricing from Shopify's quantity_price_breaks
    this.loadVolumePricing();
  }

  /**
   * Load volume pricing data from Shopify
   */
  async loadVolumePricing() {
    // First try to get volume pricing from existing variant data in DOM
    const variantScript = document.querySelector('variant-selects script[type="application/json"]');
    if (variantScript) {
      try {
        const variants = JSON.parse(variantScript.textContent);
        variants.forEach(variant => {
          if (variant.quantity_price_breaks && variant.quantity_price_breaks.length > 0) {
            this.volumePricing[variant.id] = variant.quantity_price_breaks;
          }
        });
        return;
      } catch (error) {
        console.warn('Could not parse variant data from DOM', error);
      }
    }

    // Fallback: try to get product handle and fetch product data
    const productHandle = this.getProductHandle();
    if (!productHandle) return;

    try {
      const response = await fetch(`/products/${productHandle}.js`);
      const product = await response.json();
      
      if (product.variants) {
        product.variants.forEach(variant => {
          if (variant.quantity_price_breaks && variant.quantity_price_breaks.length > 0) {
            this.volumePricing[variant.id] = variant.quantity_price_breaks;
          }
        });
      }
    } catch (error) {
      console.error('Error loading volume pricing:', error);
    }
  }

  /**
   * Get product handle from URL or DOM
   */
  getProductHandle() {
    // Try to get from URL
    const pathParts = window.location.pathname.split('/');
    const productIndex = pathParts.indexOf('products');
    if (productIndex !== -1 && pathParts[productIndex + 1]) {
      return pathParts[productIndex + 1];
    }

    // Try to get from DOM
    const productElement = document.querySelector('[data-product-handle]');
    if (productElement) {
      return productElement.dataset.productHandle;
    }

    return null;
  }

  /**
   * Handle bulk quantity button click
   */
  handleBulkQuantityClick(button) {
    if (this.isLoading) return;

    // Try multiple ways to get the quantity value
    let quantity = parseInt(button.dataset.quantity) || 
                   parseInt(button.dataset.bulkQuantity) ||
                   parseInt(button.textContent) ||
                   parseInt(button.innerText);
    
    if (!quantity || quantity <= 0) return;

    this.isLoading = true;
    
    // Update active button state
    this.updateActiveButton(button);
    
    // Update quantity input
    this.updateQuantityInput(quantity);
    
    // Update current variant from DOM to ensure we have latest
    this.updateCurrentVariant();
    
    // Update pricing
    this.updatePricing();
    
    // Update product form
    this.updateProductForm(quantity);
    
    // Trigger variant change event to update other components
    this.triggerVariantChange();
    
    this.isLoading = false;
  }

  /**
   * Update active button state
   */
  updateActiveButton(activeButton) {
    // Remove active class from all possible bulk quantity buttons
    document.querySelectorAll('.bulk-quantity-btn, [data-quantity], .bulk-btn, button[data-bulk-quantity]').forEach(btn => {
      btn.classList.remove('active', 'selected');
      btn.style.backgroundColor = '';
      btn.style.color = '';
    });
    
    // Add active class to clicked button
    activeButton.classList.add('active');
    // Also try other common active states
    activeButton.style.backgroundColor = '#000';
    activeButton.style.color = '#fff';
  }

  /**
   * Update quantity input field
   */
  updateQuantityInput(quantity) {
    const quantityInput = document.querySelector('.quantity-input');
    if (quantityInput) {
      quantityInput.value = quantity;
      this.currentQuantity = quantity;
      
      // Trigger change event
      quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  /**
   * Update pricing based on quantity
   */
  updatePricing() {
    if (!this.currentVariant) {
      this.updateCurrentVariant();
      if (!this.currentVariant) return;
    }

    const variantId = this.currentVariant.id;
    const quantity = this.currentQuantity;
    
    // Get volume pricing for current variant
    const volumePrices = this.volumePricing[variantId];
    let finalPrice = this.currentVariant.price;
    
    if (volumePrices && volumePrices.length > 0) {
      // Find the appropriate price break
      const priceBreak = this.findPriceBreak(volumePrices, quantity);
      if (priceBreak) {
        finalPrice = priceBreak.price;
      }
    }

    // Update price display
    this.updatePriceDisplay(finalPrice, quantity);
    
    // Update variant in current variant object for other scripts
    if (this.currentVariant.price !== finalPrice) {
      this.currentVariant.price = finalPrice;
    }
  }

  /**
   * Find the appropriate price break for the given quantity
   */
  findPriceBreak(volumePrices, quantity) {
    let bestBreak = null;
    
    for (const priceBreak of volumePrices) {
      if (quantity >= priceBreak.minimum_quantity) {
        if (!bestBreak || priceBreak.minimum_quantity > bestBreak.minimum_quantity) {
          bestBreak = priceBreak;
        }
      }
    }
    
    return bestBreak;
  }

  /**
   * Update price display in the UI
   */
  updatePriceDisplay(price, quantity) {
    const formattedPrice = this.formatMoney(price);
    
    // Update all possible price elements
    const priceSelectors = [
      '.price',
      '.price-item--regular',
      '.product-price',
      '.current-price',
      '[data-price]'
    ];
    
    priceSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element.tagName === 'INPUT') {
          element.value = formattedPrice;
        } else {
          element.innerHTML = `<span class="price-item price-item--regular">${formattedPrice}</span>`;
        }
      });
    });

    // Update total price if element exists
    const totalPriceElement = document.querySelector('.bulk-total-price, .total-price, [data-total-price]');
    if (totalPriceElement) {
      const totalPrice = price * quantity;
      const formattedTotal = this.formatMoney(totalPrice);
      totalPriceElement.textContent = `Total: ${formattedTotal}`;
    }

    // Update unit price display
    this.updateUnitPriceDisplay(price, quantity);
    
    // Trigger a custom event for other scripts to listen to
    document.dispatchEvent(new CustomEvent('price:updated', {
      detail: { price, quantity, formattedPrice },
      bubbles: true
    }));
  }

  /**
   * Update unit price display
   */
  updateUnitPriceDisplay(price, quantity) {
    const unitPriceElement = document.querySelector('.bulk-unit-price');
    if (unitPriceElement) {
      const formattedPrice = this.formatMoney(price);
      unitPriceElement.innerHTML = `
        <span class="unit-price-label">Price per unit:</span>
        <span class="unit-price-value">${formattedPrice}</span>
      `;
    }
  }

  /**
   * Update product form with new quantity
   */
  updateProductForm(quantity) {
    // Update all possible quantity inputs
    const quantityInputs = document.querySelectorAll(
      'input[name="quantity"], .quantity-input, [data-quantity-input]'
    );
    
    quantityInputs.forEach(input => {
      input.value = quantity;
      // Trigger change event to notify other scripts
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    
    // Update variant ID in form if current variant exists
    if (this.currentVariant) {
      const variantInputs = document.querySelectorAll(
        'input[name="id"], .product-variant-id, [data-variant-id]'
      );
      
      variantInputs.forEach(input => {
        input.value = this.currentVariant.id;
      });
    }
    
    // Update form data attributes
    const productForm = document.querySelector('product-form');
    if (productForm) {
      productForm.setAttribute('data-quantity', quantity);
      if (this.currentVariant) {
        productForm.setAttribute('data-variant-id', this.currentVariant.id);
      }
    }
  }

  /**
   * Handle manual quantity input changes
   */
  handleQuantityInputChange(input) {
    const quantity = parseInt(input.value) || 1;
    this.currentQuantity = quantity;
    
    // Update active button state based on quantity
    this.updateActiveButtonByQuantity(quantity);
    
    // Update pricing
    this.updatePricing();
  }

  /**
   * Update active button based on quantity value
   */
  updateActiveButtonByQuantity(quantity) {
    // Remove active class from all buttons
    document.querySelectorAll('.bulk-quantity-btn, [data-quantity], .bulk-btn, button[data-bulk-quantity]').forEach(btn => {
      btn.classList.remove('active', 'selected');
      btn.style.backgroundColor = '';
      btn.style.color = '';
    });
    
    // Find matching button by different methods
    let matchingButton = document.querySelector(`[data-quantity="${quantity}"]`) ||
                        document.querySelector(`[data-bulk-quantity="${quantity}"]`) ||
                        Array.from(document.querySelectorAll('button')).find(btn => 
                          parseInt(btn.textContent) === quantity || parseInt(btn.innerText) === quantity
                        );
    
    if (matchingButton) {
      matchingButton.classList.add('active');
      matchingButton.style.backgroundColor = '#000';
      matchingButton.style.color = '#fff';
    }
  }

  /**
   * Trigger variant change event for other components
   */
  triggerVariantChange() {
    if (this.currentVariant) {
      // Trigger variant change event
      document.dispatchEvent(new CustomEvent('variant:change', {
        detail: { variant: this.currentVariant },
        bubbles: true
      }));
      
      // Also trigger on product form for Shopify compatibility
      const productForm = document.querySelector('product-form');
      if (productForm) {
        productForm.dispatchEvent(new CustomEvent('variant:change', {
          detail: { variant: this.currentVariant },
          bubbles: true
        }));
      }
    }
  }

  /**
   * Format money using Shopify's money format
   */
  formatMoney(cents) {
    // Default format - should be configured based on shop settings
    const currency = window.Shopify?.currency?.active || 'EUR';
    const format = window.Shopify?.money_format || '€{{amount}}';
    
    const value = (cents / 100).toFixed(2);
    return format.replace('{{amount}}', value);
  }

  /**
   * Get current pricing info
   */
  getCurrentPricing() {
    return {
      quantity: this.currentQuantity,
      variantId: this.currentVariant?.id,
      price: this.currentVariant?.price,
      totalPrice: (this.currentVariant?.price || 0) * this.currentQuantity
    };
  }

  /**
   * Refresh pricing data
   */
  async refreshPricing() {
    await this.loadVolumePricing();
    this.updatePricing();
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.bulkQuantityHandler = new BulkQuantityHandler();
});

// Export for use in other scripts
window.BulkQuantityHandler = BulkQuantityHandler;