/**
 * TechPack V11 - Color Studio JavaScript
 *
 * Handles Pantone color selection and lab dip management:
 * - Pantone JSON loading and search
 * - Popular colors display
 * - Advanced HSL color picker with closest Pantone match
 * - Lab dip collection management
 * - Garment color assignment
 */

(function() {
  'use strict';

  window.TechPackV11 = window.TechPackV11 || {};

  // Pantone-Eligible Fabrics (V10 Rules - 100% Cotton & Natural Fibers Only)
  const COTTON_FABRICS = [
    '100% Organic Cotton Brushed Fleece',
    '100% Organic Cotton French Terry',
    '100% Organic Cotton Jersey',
    '100% Cotton Jersey',
    '100% Cotton Sherpa',
    '100% Cotton Poplin',
    '100% Cotton Oxford',
    '100% Cotton Twill',
    '100% Cotton Canvas',
    '100% Linen',
    '55% Hemp / 45% Cotton',
    '100% Cotton Piqué',
    '100% Cotton Slub Jersey',
    '100% Cotton Waffle Knit',
    '100% Cotton Lightweight French Terry',
    '100% Cotton 2x2 Rib Knit'
  ];

  window.TechPackV11.ColorStudio = {
    isOpen: false,
    isInitialized: false,
    pantoneColors: [], // Will load from JSON
    currentColor: null,
    openContext: null, // Track how Color Studio was opened: 'standalone' or 'garment-pantone'
    selectedWashTechnique: null, // Currently selected wash technique ('pigment-dye', 'fade-out', etc.)
    // Cart lives in Step3B.labDipCart (single source of truth)

    // Popular Pantone TCX colors for textiles
    popularColors: [
      { code: '19-4052 TCX', name: 'Classic Blue', hex: '#0F4C81' },
      { code: '17-2034 TCX', name: 'Pink Lavender', hex: '#F7CACA' },
      { code: '19-1664 TCX', name: 'Chili Pepper', hex: '#9B1B30' },
      { code: '15-5519 TCX', name: 'Turquoise', hex: '#45B5AA' },
      { code: '17-1456 TCX', name: 'Living Coral', hex: '#FF6F61' },
      { code: '18-3838 TCX', name: 'Ultra Violet', hex: '#5F4B8B' },
      { code: '15-0343 TCX', name: 'Greenery', hex: '#88B04B' },
      { code: '13-1520 TCX', name: 'Peach Echo', hex: '#F7786B' },
      { code: '17-1547 TCX', name: 'Fiesta', hex: '#DD4132' },
      { code: '13-4110 TCX', name: 'Serenity', hex: '#91A8D0' },
      { code: '17-5104 TCX', name: 'Emerald', hex: '#009B77' },
      { code: '18-3224 TCX', name: 'Radiant Orchid', hex: '#B565A7' },
      { code: '15-0532 TCX', name: 'Illuminating', hex: '#F5DF4D' },
      { code: '19-4007 TCX', name: 'Phantom', hex: '#0C0F11' },
      { code: '11-0602 TCX', name: 'Snow White', hex: '#F2F0EB' },
      { code: '19-4024 TCX', name: 'Navy Blazer', hex: '#282D3C' },
      { code: '16-1546 TCX', name: 'Tangerine Tango', hex: '#DD4124' },
      { code: '13-0550 TCX', name: 'Buttercup', hex: '#FAE03C' }
    ],

    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================

    /**
     * Initialize Color Studio (lazy - called on first open)
     */
    init: async function() {
      if (this.isInitialized) return;

      console.log('[ColorStudio] Initializing...');

      await this.loadPantoneData();
      this.setupEventListeners();

      this.isInitialized = true;
      console.log('[ColorStudio] Initialized successfully');
    },

    /**
     * Load Pantone color data from JSON
     */
    loadPantoneData: async function() {
      try {
        const pantoneUrl = window.TECHPACK_V11_PANTONE_URL || '/assets/pantone-colors.json';
        console.log('[ColorStudio] Loading Pantone colors from:', pantoneUrl);

        const response = await fetch(pantoneUrl);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        this.pantoneColors = await response.json();
        console.log('[ColorStudio] ✅ Loaded', this.pantoneColors.length, 'Pantone colors');

      } catch (error) {
        console.error('[ColorStudio] ❌ Failed to load Pantone colors:', error);
        // Fallback to popular colors only
        this.pantoneColors = [...this.popularColors];
        console.warn('[ColorStudio] Using popular colors as fallback');
      }
    },

    /**
     * Setup event listeners
     */
    setupEventListeners: function() {
      console.log('[ColorStudio] Setting up event listeners');

      // Native color picker change
      const colorPicker = document.getElementById('modalColorPickerInput');
      if (colorPicker) {
        colorPicker.addEventListener('input', (e) => {
          this.handleNativeColorChange(e.target.value);
        });
      }

      // HSL sliders
      const sliders = ['modalHueSlider', 'modalSaturationSlider', 'modalLightnessSlider'];
      sliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        if (slider) {
          slider.addEventListener('input', () => {
            this.handleHslChange();
          });
        }
      });
    },

    // ==========================================================================
    // MODAL CONTROL
    // ==========================================================================

    /**
     * Open Color Studio (simplified - no modes)
     */
    open: async function(context = 'standalone') {
      console.log('[ColorStudio] Opening modal with context:', context);
      this.openContext = context;

      // Lazy initialize on first open
      if (!this.isInitialized) {
        await this.init();
      }

      this.isOpen = true;

      // Show modal
      const overlay = document.getElementById('colorStudioModalOverlay');
      if (overlay) {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      } else {
        console.error('[ColorStudio] Modal overlay not found!');
        return;
      }

      // Initialize with first popular color
      if (!this.currentColor && this.popularColors.length > 0) {
        this.setCurrentColor(this.popularColors[0]);
      }

      // Render content
      this.renderPopularColors();
      this.renderCartPreview(); // Cart preview syncs with main page
      this.populateGarmentDropdown(); // Populate garment assignment dropdown
    },

    /**
     * Close Color Studio
     */
    close: function() {
      console.log('[ColorStudio] Closing modal');
      this.isOpen = false;

      const overlay = document.getElementById('colorStudioModalOverlay');
      if (overlay) {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
      }
    },

    /**
     * Done - close modal (cart already synced in real-time)
     */
    done: function() {
      console.log('[ColorStudio] Closing modal - cart already synced');
      this.close();
    },

    // ==========================================================================
    // COLOR SELECTION
    // ==========================================================================

    /**
     * Set current color display (updates selection display in modal)
     */
    setCurrentColor: function(colorData) {
      if (!colorData) return;

      this.currentColor = colorData;
      console.log('[ColorStudio] Current color set to:', colorData);

      // Update selection display in modal right side
      const swatchEl = document.getElementById('modalSelectionSwatch');
      const nameEl = document.getElementById('modalSelectionName');
      const codeEl = document.getElementById('modalSelectionCode');

      if (swatchEl) swatchEl.style.backgroundColor = colorData.hex;
      if (nameEl) nameEl.textContent = colorData.name;
      if (codeEl) codeEl.textContent = colorData.code;
    },

    /**
     * Handle native HTML5 color picker change
     */
    handleNativeColorChange: function(hex) {
      console.log('[ColorStudio] Color picker changed to:', hex);

      // Update HSL sliders to match
      const rgb = this.hexToRgb(hex);
      if (!rgb) return;

      const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);

      // Update slider positions and values
      this.updateSlider('modalHueSlider', 'modalHueValue', Math.round(hsl.h), '');
      this.updateSlider('modalSaturationSlider', 'modalSaturationValue', Math.round(hsl.s), '%');
      this.updateSlider('modalLightnessSlider', 'modalLightnessValue', Math.round(hsl.l), '%');

      // Update slider background gradients
      this.updateSliderGradients(Math.round(hsl.h), Math.round(hsl.s), Math.round(hsl.l));

      // Find closest Pantone and update Current Selection
      const closest = this.findClosestPantone(hex);
      if (closest) {
        this.setCurrentColor({
          hex: closest.hex,
          name: closest.name,
          code: closest.code
        });
      }
    },

    /**
     * Handle HSL slider change
     */
    handleHslChange: function() {
      const hueSlider = document.getElementById('modalHueSlider');
      const satSlider = document.getElementById('modalSaturationSlider');
      const lightSlider = document.getElementById('modalLightnessSlider');

      if (!hueSlider || !satSlider || !lightSlider) return;

      const h = parseInt(hueSlider.value);
      const s = parseInt(satSlider.value);
      const l = parseInt(lightSlider.value);

      // Update value displays
      document.getElementById('modalHueValue').textContent = h;
      document.getElementById('modalSaturationValue').textContent = s + '%';
      document.getElementById('modalLightnessValue').textContent = l + '%';

      // Convert HSL to HEX
      const rgb = this.hslToRgb(h, s, l);
      const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);

      // Update native color picker
      const colorPicker = document.getElementById('modalColorPickerInput');
      if (colorPicker) {
        colorPicker.value = hex;
      }

      // Update slider background gradients
      this.updateSliderGradients(h, s, l);

      // Find closest Pantone and set as current color
      const closest = this.findClosestPantone(hex);
      if (closest) {
        this.setCurrentColor({
          hex: closest.hex,
          name: closest.name,
          code: closest.code
        });
      }
    },

    /**
     * Update slider and its value display
     */
    updateSlider: function(sliderId, valueId, value, suffix) {
      const slider = document.getElementById(sliderId);
      const valueEl = document.getElementById(valueId);

      if (slider) slider.value = value;
      if (valueEl) valueEl.textContent = value + suffix;
    },

    /**
     * Find closest Pantone color to a hex value
     */
    findClosestPantone: function(hex) {
      if (!this.pantoneColors || this.pantoneColors.length === 0) {
        return null;
      }

      const target = this.hexToRgb(hex);
      if (!target) return null;

      let closestColor = this.pantoneColors[0];
      let smallestDistance = Infinity;

      this.pantoneColors.forEach(pantone => {
        const pantoneRgb = this.hexToRgb(pantone.hex);
        if (!pantoneRgb) return;

        const distance = this.colorDistance(target, pantoneRgb);

        if (distance < smallestDistance) {
          smallestDistance = distance;
          closestColor = pantone;
        }
      });

      return {
        code: closestColor.code,
        name: closestColor.name || closestColor.code,
        hex: closestColor.hex
      };
    },

    // ==========================================================================
    // LAB DIP CART (Single Source of Truth)
    // ==========================================================================

    /**
     * Add current color to lab dip cart (main page cart)
     */
    addToCart: function() {
      if (!this.currentColor) {
        alert('Please select a color first');
        return;
      }

      // Detect which flow we're in (Sample has Step3B, Bulk has BulkStep4)
      const isSampleFlow = window.TechPackV11.Step3B;
      const isBulkFlow = window.TechPackV11.BulkStep4;

      if (!isSampleFlow && !isBulkFlow) {
        console.error('[ColorStudio] No valid flow context found! Neither Step3B (Sample) nor BulkStep4 (Bulk) exists.');
        return;
      }

      // Handle Sample Flow (Lab Dips)
      if (isSampleFlow) {
        // Check if already in cart (UX Improvement #5: Prevent duplicates)
        const exists = window.TechPackV11.Step3B.labDipCart.some(dip =>
          dip.code === this.currentColor.code
        );

        if (exists) {
          alert('This color is already in your cart');
          return;
        }

        // Add to main page cart (single source of truth)
        const labDip = {
          id: 'labdip-' + Date.now(),
          code: this.currentColor.code,
          name: this.currentColor.name,
          hex: this.currentColor.hex,
          price: 25.00, // €25.00 per swatch
          washTechnique: this.selectedWashTechnique || 'none'
        };

        window.TechPackV11.Step3B.labDipCart.push(labDip);
        window.TechPackV11.Step3B.saveToStorage();
        window.TechPackV11.Step3B.renderLabDipCart(); // Update main page

        // Update modal preview
        this.renderCartPreview();

        console.log('[ColorStudio] Added to cart:', labDip);
      }

      // Handle Bulk Flow (Colorways)
      else if (isBulkFlow) {
        // Standalone context: Add to lab dip cart for drag & drop
        if (this.openContext === 'standalone') {
          // Check if already in cart
          const exists = window.TechPackV11.BulkStep4.labDipCart.some(dip =>
            dip.code === this.currentColor.code
          );

          if (exists) {
            alert('This color is already in your cart');
            return;
          }

          // Add to cart
          const labDip = {
            id: 'labdip-' + Date.now(),
            code: this.currentColor.code,
            name: this.currentColor.name,
            hex: this.currentColor.hex,
            price: 25.00,
            washTechnique: this.selectedWashTechnique || 'none'
          };

          window.TechPackV11.BulkStep4.labDipCart.push(labDip);

          // Save lab dip cart to localStorage
          localStorage.setItem('v11_bulk_labdip_cart', JSON.stringify(window.TechPackV11.BulkStep4.labDipCart));

          window.TechPackV11.BulkStep4.renderLabDipCart();
          window.TechPackV11.BulkStep4.saveAndRender();

          console.log('[ColorStudio] Added lab dip to Bulk cart:', labDip);

          // Update modal cart preview and done button
          this.renderCartPreview();

          // Show success feedback (don't close modal - let them browse more)
          const btn = document.getElementById('modalAddToCartBtn');
          if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '✓ Added to Cart';
            btn.classList.add('button-success');
            setTimeout(() => {
              btn.innerHTML = originalHTML;
              btn.classList.remove('button-success');
            }, 1500);
          }
          return; // Early return to skip default feedback
        }

        // Garment context: Assign to pending colorway (existing behavior)
        else if (this.openContext === 'garment-pantone') {
          // For Bulk flow, we add the Pantone color to the pending colorway
          if (!window.TechPackV11.BulkStep4.pendingColorway) {
            console.error('[ColorStudio] No pending colorway found in Bulk flow!');
            alert('Please start adding a colorway first');
            return;
          }

          // Set the Pantone color in the pending colorway
          window.TechPackV11.BulkStep4.pendingColorway.colorType = 'pantone';
          window.TechPackV11.BulkStep4.pendingColorway.color = this.currentColor.code + ' - ' + this.currentColor.name;
          window.TechPackV11.BulkStep4.pendingColorway.hex = this.currentColor.hex;
          window.TechPackV11.BulkStep4.pendingColorway.pantoneCode = this.currentColor.code;

          console.log('[ColorStudio] Pantone color selected for Bulk colorway:', this.currentColor);

          // Close Color Studio modal and show quantity modal
          this.close();
          window.TechPackV11.BulkStep4.showQuantityModal();
          return; // Early return to skip default feedback
        }
      }

      // Visual feedback (UX Improvement #3)
      const btn = document.getElementById('modalAddToCartBtn');
      if (btn) {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 10L8 13L15 6" stroke="currentColor" stroke-width="2"/>
          </svg>
          Added to Cart
        `;
        btn.classList.add('button-success');

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.classList.remove('button-success');
        }, 2000);
      }
    },

    /**
     * Remove from cart (works in both modal and main page) (UX Improvement #2)
     */
    removeFromCart: function(labDipId) {
      if (!window.TechPackV11.Step3B) return;

      // Remove from cart
      window.TechPackV11.Step3B.labDipCart = window.TechPackV11.Step3B.labDipCart.filter(
        dip => dip.id !== labDipId
      );

      // Save
      window.TechPackV11.Step3B.saveToStorage();

      // Update both places
      window.TechPackV11.Step3B.renderLabDipCart(); // Main page
      this.renderCartPreview(); // Modal preview

      console.log('[ColorStudio] Removed from cart:', labDipId);
    },

    // ==========================================================================
    // RENDERING
    // ==========================================================================

    /**
     * Render popular colors grid
     */
    renderPopularColors: function() {
      const grid = document.getElementById('modalPopularColorsGrid');
      if (!grid) {
        console.warn('[ColorStudio] Popular colors grid not found');
        return;
      }

      grid.innerHTML = this.popularColors.map(color => `
        <button
          type="button"
          class="modal-color-swatch"
          style="background-color: ${color.hex};"
          data-color-code="${color.code}"
          data-color-name="${color.name}"
          data-color-hex="${color.hex}"
          data-action="select-popular-color"
          title="${color.name} (${color.code})"
        ></button>
      `).join('');

      console.log('[ColorStudio] Rendered', this.popularColors.length, 'popular colors');
    },

    /**
     * Render cart preview in modal (syncs with main page cart)
     */
    renderCartPreview: function() {
      const itemsContainer = document.getElementById('modalCartItems');
      const emptyState = document.getElementById('modalCartEmpty');
      const totalEl = document.getElementById('modalCartTotal');

      if (!itemsContainer || !emptyState) {
        console.warn('[ColorStudio] Cart preview elements not found');
        return;
      }

      // Dynamically determine which cart to use based on which flow is active
      let cart = [];
      if (window.TechPackV11.BulkStep4 && window.TechPackV11.BulkStep4.labDipCart) {
        cart = window.TechPackV11.BulkStep4.labDipCart;
        console.log('[ColorStudio] Using Bulk flow cart:', cart.length, 'items');
      } else if (window.TechPackV11.Step3B && window.TechPackV11.Step3B.labDipCart) {
        cart = window.TechPackV11.Step3B.labDipCart;
        console.log('[ColorStudio] Using Sample flow cart:', cart.length, 'items');
      }

      // Empty state (UX Improvement #4)
      if (cart.length === 0) {
        emptyState.style.display = 'flex';
        itemsContainer.style.display = 'none';
        if (totalEl) totalEl.textContent = 'Total: 0 swatches (€0.00)';
        console.log('[ColorStudio] Showing empty cart state');
        return;
      }

      // Show cart items
      emptyState.style.display = 'none';
      itemsContainer.style.display = 'block';

      itemsContainer.innerHTML = cart.map(dip => {
        // Get wash technique badge if exists
        const washBadge = dip.washTechnique && dip.washTechnique !== 'none'
          ? `<span class="wash-badge wash-badge--${dip.washTechnique}">${this.formatWashTechniqueName(dip.washTechnique)}</span>`
          : '';

        return `
          <div class="modal-cart-item" data-lab-dip-id="${dip.id}">
            <div class="modal-cart-item__swatch" style="background-color: ${dip.hex};"></div>
            <div class="modal-cart-item__info">
              <p class="modal-cart-item__name">${dip.name}</p>
              <p class="modal-cart-item__code">${dip.code}</p>
              ${washBadge}
            </div>
            <button
              type="button"
              class="modal-cart-item__remove"
              data-action="modal-remove-from-cart"
              data-lab-dip-id="${dip.id}"
              title="Remove from cart"
            >×</button>
          </div>
        `;
      }).join('');

      // Update total with refund info
      if (totalEl) {
        totalEl.innerHTML = `
          <span style="color: var(--color-success, #10b981);">✓ Refunded in bulk orders</span>
          <span style="font-size: 0.875rem; color: var(--color-text-secondary, #6b7280); margin-left: var(--space-2);">
            ${cart.length} swatch${cart.length !== 1 ? 'es' : ''}
          </span>
        `;
      }

      console.log('[ColorStudio] Rendered cart preview:', cart.length, 'items');

      // Update Done button text
      this.updateDoneButton();
    },

    /**
     * Update Done button text with cart count
     */
    updateDoneButton: function() {
      const doneTextEl = document.getElementById('modalDoneText');
      if (!doneTextEl) return;

      // Dynamically determine which cart to use based on which flow is active
      let cart = [];
      if (window.TechPackV11.BulkStep4 && window.TechPackV11.BulkStep4.labDipCart) {
        cart = window.TechPackV11.BulkStep4.labDipCart;
      } else if (window.TechPackV11.Step3B && window.TechPackV11.Step3B.labDipCart) {
        cart = window.TechPackV11.Step3B.labDipCart;
      }

      const count = cart.length;
      doneTextEl.textContent = `Done - ${count} Color${count !== 1 ? 's' : ''} in Cart`;
    },

    /**
     * Update slider gradient backgrounds based on current HSL values
     * Makes sliders visually accurate (hue = rainbow, saturation = gray to color, lightness = black to white)
     */
    updateSliderGradients: function(h, s, l) {
      const satSlider = document.getElementById('modalSaturationSlider');
      const lightSlider = document.getElementById('modalLightnessSlider');

      if (satSlider) {
        // Saturation: Gray (0% sat) to current hue at full saturation
        const hueColor = `hsl(${h}, 100%, 50%)`;
        const grayColor = `hsl(${h}, 0%, 50%)`;
        satSlider.style.background =
          `linear-gradient(to right, ${grayColor}, ${hueColor})`;
      }

      if (lightSlider) {
        // Lightness: Black to current color to white
        const midColor = `hsl(${h}, ${s}%, 50%)`;
        lightSlider.style.background =
          `linear-gradient(to right, #000, ${midColor}, #fff)`;
      }
    },

    // ==========================================================================
    // COLOR CONVERSION UTILITIES
    // ==========================================================================

    hexToRgb: function(hex) {
      if (!hex) return null;

      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    },

    rgbToHex: function(r, g, b) {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    rgbToHsl: function(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return {
        h: h * 360,
        s: s * 100,
        l: l * 100
      };
    },

    hslToRgb: function(h, s, l) {
      h /= 360;
      s /= 100;
      l /= 100;

      let r, g, b;

      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }

      return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
      };
    },

    colorDistance: function(rgb1, rgb2) {
      return Math.sqrt(
        Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2)
      );
    },

    // ==========================================================================
    // WASHING TECHNIQUES
    // ==========================================================================

    /**
     * Wash technique descriptions for the 4-button guide
     */
    washTechniqueDescriptions: {
      'pigment-dye': '<strong>Pigment Dye:</strong> Creates a vintage soft feel with slightly faded appearance. <strong>Requirements:</strong> Cotton fabrics only, +2 weeks production time. <strong>Must assign to garment</strong> — cannot be done on fabric swatches.',
      'fade-out': '<strong>Fade-out Wash:</strong> Gradual color fade effect for a worn-in look. Works on all fabrics. <strong>Can be fabric swatch or garment.</strong> +3 weeks production. <strong>10-15% color variance</strong> — final color will differ from swatch.',
      'stone': '<strong>Stone Wash:</strong> Worn-in texture with soft hand feel. Works on all fabrics. <strong>Can be fabric swatch or garment.</strong> +2 weeks production time.',
      'tie-ice': '<strong>Tie Dye & Ice Dye:</strong> Unique artistic patterns, each piece is one-of-a-kind. <strong>Must assign to garment</strong> — cannot be done on fabric swatches. +4 weeks production. <strong>10-15% color variance</strong> — results vary by nature of the process.'
    },

    /**
     * Toggle washing techniques section
     */
    toggleWashTechniques: function() {
      const content = document.getElementById('washTechniquesContent');
      const toggle = document.querySelector('.wash-techniques-section__toggle');
      const icon = document.querySelector('.wash-techniques-section__icon');

      if (!content || !toggle) return;

      const isHidden = content.style.display === 'none';

      content.style.display = isHidden ? 'flex' : 'none';

      if (toggle) {
        toggle.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      }

      if (icon) {
        icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
      }

      console.log('[ColorStudio] Wash techniques section toggled:', isHidden ? 'open' : 'closed');
    },

    /**
     * Select/deselect wash technique (toggle behavior)
     */
    selectWashTechnique: function(technique) {
      console.log('[ColorStudio] Wash technique clicked:', technique);

      // Toggle: If already selected, deselect it
      if (this.selectedWashTechnique === technique) {
        this.selectedWashTechnique = null;
        this.updateWashTechniqueUI();
        this.hideColorWarning();
        console.log('[ColorStudio] Wash technique deselected');
        return;
      }

      // Select new technique
      this.selectedWashTechnique = technique;
      this.updateWashTechniqueUI();

      // Show warning for techniques with color discrepancy
      const warningTechniques = ['fade-out', 'tie-dye', 'ice-dye'];
      if (warningTechniques.includes(technique)) {
        this.showColorWarning();
      } else {
        this.hideColorWarning();
      }

      console.log('[ColorStudio] Wash technique selected:', technique);
    },

    /**
     * Update wash technique card UI (selected state)
     */
    updateWashTechniqueUI: function() {
      const cards = document.querySelectorAll('.wash-technique-card');

      cards.forEach(card => {
        const cardTechnique = card.getAttribute('data-technique');

        if (cardTechnique === this.selectedWashTechnique) {
          card.classList.add('wash-technique-card--selected');
        } else {
          card.classList.remove('wash-technique-card--selected');
        }
      });

      // Update button states based on wash technique selection
      this.updateAddToCartButtonState();
    },

    /**
     * Update "Add to Cart" button state based on wash technique
     * Wash techniques require direct garment assignment
     */
    updateAddToCartButtonState: function() {
      const addToCartBtn = document.getElementById('modalAddToCartBtn');
      const washWarningEl = document.getElementById('washTechniqueCartWarning');

      if (!addToCartBtn) return;

      // If wash technique selected, disable "Add to Cart"
      if (this.selectedWashTechnique) {
        addToCartBtn.disabled = true;
        addToCartBtn.classList.add('button-disabled');
        addToCartBtn.title = 'Washing techniques must be assigned directly to a garment';

        // Show helper message
        if (washWarningEl) {
          washWarningEl.style.display = 'block';
        }
      } else {
        addToCartBtn.disabled = false;
        addToCartBtn.classList.remove('button-disabled');
        addToCartBtn.title = '';

        // Hide helper message
        if (washWarningEl) {
          washWarningEl.style.display = 'none';
        }
      }
    },

    /**
     * Show color discrepancy warning
     */
    showColorWarning: function() {
      const warning = document.getElementById('washColorWarning');
      if (warning) {
        warning.style.display = 'flex';
      }
    },

    /**
     * Hide color discrepancy warning
     */
    hideColorWarning: function() {
      const warning = document.getElementById('washColorWarning');
      if (warning) {
        warning.style.display = 'none';
      }
    },

    /**
     * Select wash guide (4-button guide handler)
     */
    selectWashGuide: function(guide) {
      console.log('[ColorStudio] Wash guide selected:', guide);

      const descriptionEl = document.getElementById('washGuideDescription');
      const buttons = document.querySelectorAll('.wash-guide__btn');

      if (!descriptionEl) return;

      // Update button active state
      buttons.forEach(btn => {
        const btnGuide = btn.getAttribute('data-guide');
        if (btnGuide === guide) {
          btn.classList.add('wash-guide__btn--active');
        } else {
          btn.classList.remove('wash-guide__btn--active');
        }
      });

      // Update description
      const description = this.washTechniqueDescriptions[guide];
      if (description) {
        descriptionEl.innerHTML = `<p>${description}</p>`;
      } else {
        descriptionEl.innerHTML = '<p>Select a technique above to learn more about the process, timeline, and requirements.</p>';
      }
    },

    /**
     * Format wash technique slug to display name
     */
    formatWashTechniqueName: function(technique) {
      const names = {
        'pigment-dye': 'Pigment Dye',
        'fade-out': 'Fade-out Wash',
        'stone-wash': 'Stone Wash',
        'tie-dye': 'Tie Dye',
        'ice-dye': 'Ice Dye'
      };
      return names[technique] || technique;
    },

    // ==========================================================================
    // INSTANT GARMENT ASSIGNMENT
    // ==========================================================================

    /**
     * Populate garment dropdown with Pantone-eligible garments
     */
    populateGarmentDropdown: function() {
      const select = document.getElementById('modalGarmentSelect');
      if (!select) {
        console.warn('[ColorStudio] Garment dropdown not found');
        return;
      }

      // Get garments from Step3B (Sample flow) or BulkStep4 (Bulk flow)
      let garments = [];
      if (window.TechPackV11.Step3B && window.TechPackV11.Step3B.garments) {
        garments = window.TechPackV11.Step3B.garments;
      } else if (window.TechPackV11.BulkStep4 && window.TechPackV11.BulkStep4.garments) {
        garments = window.TechPackV11.BulkStep4.garments;
      }

      // Filter: Only garments that accept Pantone colors
      // (not assigned OR already has Pantone color assigned)
      const eligibleGarments = garments.filter(g =>
        !g.colorAssigned || g.colorType === 'pantone'
      );

      console.log('[ColorStudio] Found', eligibleGarments.length, 'Pantone-eligible garments');

      // Clear existing options except placeholder
      select.innerHTML = '<option value="">Select a garment...</option>';

      // Populate dropdown
      eligibleGarments.forEach(garment => {
        const option = document.createElement('option');
        option.value = garment.id;
        option.textContent = `Garment #${garment.number} - ${garment.type} (${garment.fabricType})`;
        select.appendChild(option);
      });

      // Reset button state
      this.updateAssignButtonState();
    },

    /**
     * Update assign button state based on dropdown selection
     */
    updateAssignButtonState: function() {
      const select = document.getElementById('modalGarmentSelect');
      const button = document.getElementById('modalAssignToGarmentBtn');

      if (!select || !button) return;

      const hasSelection = select.value !== '';

      button.disabled = !hasSelection;

      console.log('[ColorStudio] Assign button state:', hasSelection ? 'enabled' : 'disabled');
    },

    /**
     * Assign color + wash technique to selected garment (bypasses cart)
     */
    assignColorToGarment: function() {
      const select = document.getElementById('modalGarmentSelect');
      const garmentId = select ? select.value : null;

      if (!garmentId) {
        alert('Please select a garment first');
        return;
      }

      if (!this.currentColor) {
        alert('Please select a color first');
        return;
      }

      console.log('[ColorStudio] Assigning color to garment:', garmentId);

      // Detect flow
      const isSampleFlow = window.TechPackV11.Step3B;
      const isBulkFlow = window.TechPackV11.BulkStep4;

      if (!isSampleFlow && !isBulkFlow) {
        console.error('[ColorStudio] No valid flow context found!');
        return;
      }

      // Sample Flow
      if (isSampleFlow) {
        const garment = window.TechPackV11.Step3B.garments.find(g => g.id === garmentId);

        if (!garment) {
          console.error('[ColorStudio] Garment not found:', garmentId);
          return;
        }

        // Assign Pantone color + wash technique
        garment.colorAssigned = true;
        garment.colorType = 'pantone';
        garment.pantoneColor = {
          labDipId: 'labdip-' + Date.now(),
          code: this.currentColor.code,
          name: this.currentColor.name,
          hex: this.currentColor.hex,
          price: 25.00,
          washTechnique: this.selectedWashTechnique || 'none' // Include wash technique
        };

        console.log('[ColorStudio] Assigned Pantone to Sample garment:', garment);

        // Save and re-render
        window.TechPackV11.Step3B.saveToStorage();
        window.TechPackV11.Step3B.render();

        // Close modal
        this.close();

        // Show success message
        alert(`✓ Color assigned to Garment #${garment.number}`);
      }

      // Bulk Flow
      else if (isBulkFlow) {
        // Similar implementation for Bulk flow
        console.log('[ColorStudio] Bulk flow garment assignment not yet implemented');
        alert('Garment assignment for Bulk flow coming soon');
      }
    }
  };

  console.log('[ColorStudio] Module loaded');

})();
