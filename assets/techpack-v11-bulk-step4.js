/**
 * TechPack V11 - Bulk Step 4: Colorway & Quantity Management
 *
 * Handles:
 * - Colorway addition (color + quantity + size distribution)
 * - MOQ validation (75 global + per-garment minimums)
 * - Size distribution with Quick Fill templates
 * - Copy colorway to other garments
 * - Lab Dip Cart for Pantone colors
 * - Real-time order summary
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

  // MOQ Configuration (from V10)
  const MOQ_CONFIG = {
    global: 75, // Global minimum across all garments
    perGarment: {
      'T-Shirt': { single: 100, multiple: 75 },
      'Long Sleeve': { single: 100, multiple: 75 },
      'Tank Top': { single: 100, multiple: 75 },
      'Polo Shirt': { single: 100, multiple: 75 },
      'Shirt': { single: 100, multiple: 75 },
      'Hoodie': { single: 75, multiple: 50 },
      'Zip Hoodie': { single: 75, multiple: 50 },
      'Sweatshirt': { single: 75, multiple: 50 },
      'Sweatpants': { single: 75, multiple: 50 },
      'Shorts': { single: 75, multiple: 50 },
      'Hat/Cap': { single: 50, multiple: 40 },
      'Beanie': { single: 50, multiple: 40 },
      'Other': { single: 75, multiple: 50 },
      'default': { single: 75, multiple: 50 }
    },
    // Size limits based on quantity
    sizeLimits: [
      { min: 300, maxSizes: 7, sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { min: 150, maxSizes: 6, sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { min: 75, maxSizes: 5, sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
      { min: 50, maxSizes: 4, sizes: ['S', 'M', 'L', 'XL'] },
      { min: 30, maxSizes: 3, sizes: ['S', 'M', 'L'] },
      { min: 20, maxSizes: 2, sizes: ['M', 'L'] }
    ]
  };

  // Fabric Type Mapping by Garment (V10 Detailed Specifications)
  const FABRIC_TYPE_MAPPING = {
    'Zip Hoodie': [
      '100% Organic Cotton Brushed Fleece',
      '100% Organic Cotton French Terry',
      '70/30 Cotton-Poly',
      '50/50 Cotton-Poly',
      '100% Polyester',
      'Other'
    ],
    'Hoodie': [
      '100% Organic Cotton Brushed Fleece',
      '100% Organic Cotton French Terry',
      '70/30 Cotton-Poly',
      '50/50 Cotton-Poly',
      '100% Polyester',
      'Other'
    ],
    'Sweatshirt': [
      '100% Organic Cotton Brushed Fleece',
      '100% Organic Cotton French Terry',
      '70/30 Cotton-Poly',
      '50/50 Cotton-Poly',
      '100% Polyester',
      'Other'
    ],
    'Sweatpants': [
      '100% Organic Cotton Brushed Fleece',
      '100% Organic Cotton French Terry',
      '70/30 Cotton-Poly',
      '50/50 Cotton-Poly',
      '100% Polyester',
      'Other'
    ],
    'Shorts': [
      '100% Organic Cotton Brushed Fleece',
      '100% Organic Cotton French Terry',
      '70/30 Cotton-Poly',
      '50/50 Cotton-Poly',
      '100% Polyester',
      'Other'
    ],
    'T-Shirt': [
      '100% Organic Cotton Jersey',
      '95% Cotton 5% Elastan',
      '80/20 Cotton-Poly',
      '50/50 Cotton-Poly',
      '100% Polyester',
      'Recycled Polyester',
      'Other'
    ],
    'Long Sleeve': [
      '100% Organic Cotton Jersey',
      '95% Cotton 5% Elastan',
      '80/20 Cotton-Poly',
      '50/50 Cotton-Poly',
      '100% Polyester',
      'Recycled Polyester',
      'Other'
    ],
    'Shirt': [
      '100% Cotton Poplin',
      '100% Cotton Oxford',
      '100% Cotton Twill',
      '100% Cotton Canvas',
      '100% Linen',
      '55% Hemp / 45% Cotton',
      '80/20 Cotton-Poly',
      'Other'
    ],
    'Polo Shirt': [
      '100% Cotton Piqué',
      '95/5 Cotton-Elastane Piqué',
      '80/20 Cotton-Poly Piqué',
      '50/50 Cotton-Poly Piqué',
      '100% Polyester Piqué',
      'Other'
    ],
    'Tank Top': [
      '100% Cotton Jersey',
      '100% Cotton Slub Jersey',
      '100% Cotton Waffle Knit',
      '100% Cotton Lightweight French Terry',
      '100% Cotton 2x2 Rib Knit',
      '95/5 Cotton-Elastane Jersey',
      '50/50 Cotton-Poly Jersey',
      '100% Polyester Mesh',
      '65/35 Polyester-Cotton Piqué Knit',
      'Other'
    ],
    'Hat/Cap': [
      'Standard Material',
      'Other'
    ],
    'Beanie': [
      'Standard Material',
      'Other'
    ],
    'Other': [
      'Custom Fabric'
    ]
  };

  window.TechPackV11.BulkStep4 = {
    garments: [],
    labDipCart: [],

    // Current colorway being created (4-step flow)
    pendingColorway: {
      garmentId: null,
      colorType: null, // 'stock', 'pantone', 'techpack'
      color: null,
      hex: null,
      pantoneColor: null,
      quantity: null,
      sizeDistribution: {}
    },

    /**
     * Initialize Step 4
     */
    init: function() {
      console.log('[BulkStep4] Initializing...');

      // Load garments from state
      this.loadGarmentsFromState();

      // Load lab dip cart from storage
      const savedCart = localStorage.getItem('v11_bulk_labdip_cart');
      if (savedCart) {
        try {
          this.labDipCart = JSON.parse(savedCart);
        } catch (e) {
          console.error('[BulkStep4] Error parsing lab dip cart:', e);
        }
      }

      this.render();
      this.renderLabDipCart();
      this.updateMOQProgress();
      this.updateOrderSummary();

      // Setup drag & drop from lab dip cart to garments
      this.setupLabDipDragDrop();
    },

    /**
     * Load garments from global state
     */
    loadGarmentsFromState: function() {
      if (window.TechPackV11.State && window.TechPackV11.State.formData.garments) {
        this.garments = window.TechPackV11.State.formData.garments;
        console.log('[BulkStep4] Loaded garments from state:', this.garments.length);
      }
    },

    /**
     * Render garment list with colorways
     */
    render: function() {
      const container = document.getElementById('garmentColorwayList');
      if (!container) return;

      if (this.garments.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <p>No garments found. Please go back and add garments first.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = this.garments.map(garment => this.renderGarmentColorwayCard(garment)).join('');
    },

    /**
     * Render individual garment with colorways
     */
    renderGarmentColorwayCard: function(garment) {
      const colorways = garment.colorways || [];
      const totalQuantity = colorways.reduce((sum, cw) => sum + (cw.quantity || 0), 0);

      // Check garment-level completion for aggregated validation
      const allComplete = this.areAllColorwaysComplete(garment);
      const garmentStateClass = colorways.length > 0
        ? (allComplete ? 'garment-color-card--all-complete' : 'garment-color-card--has-incomplete')
        : '';

      // Create validation badge
      let validationBadge = '';
      if (colorways.length > 0) {
        if (allComplete) {
          validationBadge = `
            <span class="garment-color-card__validation-badge garment-color-card__validation-badge--complete">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              All Complete
            </span>
          `;
        } else {
          const incompleteCount = colorways.filter(cw => !this.isColorwayComplete(cw)).length;
          validationBadge = `
            <span class="garment-color-card__validation-badge garment-color-card__validation-badge--incomplete">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.5"/>
                <path d="M6 3v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="6" cy="8.5" r="0.5" fill="currentColor"/>
              </svg>
              ${incompleteCount} Incomplete
            </span>
          `;
        }
      }

      // Render colorways
      let colorwaysHTML = '';
      if (colorways.length > 0) {
        colorwaysHTML = colorways.map(colorway => this.renderColorwayItem(garment.id, colorway)).join('');
      }

      return `
        <div class="garment-color-card ${garmentStateClass}" data-garment-id="${garment.id}">
          <div class="garment-color-card__header">
            <div class="garment-color-card__info">
              <h4 class="garment-color-card__title">${garment.type}</h4>
              <p class="garment-color-card__fabric">${garment.fabricType}</p>
            </div>
            <div class="garment-color-card__stats">
              <span class="garment-stat">${colorways.length} colorway${colorways.length !== 1 ? 's' : ''}</span>
              <span class="garment-stat">${totalQuantity} pcs</span>
              ${validationBadge}
            </div>
          </div>

          <div class="garment-color-card__colorways">
            ${colorwaysHTML}
          </div>

          <div class="garment-color-card__buttons">
            <button type="button" class="color-option-btn" data-action="add-stock-color" data-garment-id="${garment.id}">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Stock Colors
            </button>
            <button type="button" class="color-option-btn" data-action="add-pantone-color" data-garment-id="${garment.id}" ${COTTON_FABRICS.includes(garment.fabricType) ? '' : 'disabled title="Pantone only available for 100% cotton fabrics"'}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="5" cy="5" r="3" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="11" cy="11" r="3" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              Pantone Colors
            </button>
            <button type="button" class="color-option-btn" data-action="add-techpack-color" data-garment-id="${garment.id}">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 2h6l2 2v10H4V2z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M6 6h4M6 9h4M6 12h2" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              Match TechPack Colors
            </button>
          </div>
        </div>
      `;
    },

    /**
     * Render single colorway item
     */
    renderColorwayItem: function(garmentId, colorway) {
      const colorDisplay = colorway.colorType === 'pantone' && colorway.pantoneColor
        ? `${colorway.pantoneColor.name} (${colorway.pantoneColor.code})`
        : colorway.color || 'Unnamed Color';

      const sizeText = colorway.sizeDistribution && Object.keys(colorway.sizeDistribution).length > 0
        ? Object.entries(colorway.sizeDistribution).map(([size, qty]) => `${size}:${qty}`).join(', ')
        : 'Sizes not distributed';

      // Check completion state for validation styling
      const isComplete = this.isColorwayComplete(colorway);
      const stateClass = isComplete ? 'colorway-item--complete' : 'colorway-item--incomplete';

      return `
        <div class="colorway-item ${stateClass}" data-colorway-id="${colorway.id}">
          <div class="colorway-item__color">
            <div class="colorway-item__swatch assigned-color__swatch" style="background-color: ${colorway.hex};"></div>
            <div class="colorway-item__info">
              <span class="colorway-item__name">${colorDisplay}</span>
              <span class="colorway-item__quantity">${colorway.quantity} pieces</span>
              <span class="colorway-item__sizes ${isComplete ? '' : 'colorway-item__sizes--incomplete'}">${sizeText}</span>
            </div>
          </div>
          <div class="colorway-item__actions">
            <button type="button" class="colorway-item__btn" data-action="edit-colorway" data-garment-id="${garmentId}" data-colorway-id="${colorway.id}" title="Edit quantity/sizes">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M10 1l3 3L5 12H2v-3L10 1z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </button>
            <button type="button" class="colorway-item__btn colorway-item__btn--danger" data-action="delete-colorway" data-garment-id="${garmentId}" data-colorway-id="${colorway.id}" title="Remove colorway">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 3h10M5 3V2h4v1M4 3v9h6V3" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </button>
          </div>
        </div>
      `;
    },

    /**
     * Render Lab Dip Cart
     */
    renderLabDipCart: function() {
      const container = document.getElementById('labDipCartItems');
      const emptyState = document.getElementById('labDipCartEmpty');
      const countEl = document.getElementById('labDipCount');
      const totalEl = document.getElementById('labDipTotal');

      if (!container) return;

      const hasItems = this.labDipCart.length > 0;

      if (emptyState) emptyState.style.display = hasItems ? 'none' : 'block';
      if (container) container.style.display = hasItems ? 'block' : 'none';

      if (countEl) countEl.textContent = this.labDipCart.length;
      if (totalEl) {
        const total = this.labDipCart.reduce((sum, item) => sum + (item.price || 25), 0);
        totalEl.textContent = `€${total.toFixed(2)}`;
      }

      if (hasItems) {
        container.innerHTML = this.labDipCart.map(item => this.renderLabDipItem(item)).join('');
      }

      // Save to localStorage
      localStorage.setItem('v11_bulk_labdip_cart', JSON.stringify(this.labDipCart));
    },

    /**
     * Render single lab dip item
     */
    renderLabDipItem: function(item) {
      // Get wash technique badge if exists
      const washBadge = item.washTechnique && item.washTechnique !== 'none'
        ? `<span class="wash-badge wash-badge--${item.washTechnique}">${this.formatWashTechniqueName(item.washTechnique)}</span>`
        : '';

      return `
        <div class="lab-dip-cart-item" data-labdip-id="${item.id}" draggable="true" ${item.washTechnique && item.washTechnique !== 'none' ? `data-wash-technique="${item.washTechnique}"` : ''}>
          <div class="lab-dip-cart-item__swatch" style="background-color: ${item.hex};"></div>
          <div class="lab-dip-cart-item__info">
            <span class="lab-dip-cart-item__name">${item.name}</span>
            <span class="lab-dip-cart-item__code">${item.code}</span>
            ${washBadge}
            <span class="lab-dip-cart-item__price">€${(item.price || 25).toFixed(2)}</span>
          </div>
          <button type="button" class="lab-dip-cart-item__remove" data-action="remove-lab-dip" data-labdip-id="${item.id}">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </button>
        </div>
      `;
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

    /**
     * Update MOQ Progress Bar
     */
    updateMOQProgress: function() {
      const totalQuantity = this.garments.reduce((sum, g) => {
        const garmentTotal = (g.colorways || []).reduce((gSum, cw) => gSum + (cw.quantity || 0), 0);
        return sum + garmentTotal;
      }, 0);

      const progress = Math.min((totalQuantity / MOQ_CONFIG.global) * 100, 100);
      const percentText = progress >= 100 ? `${Math.round((totalQuantity / MOQ_CONFIG.global) * 100)}%` : `${Math.round(progress)}%`;

      const fillEl = document.getElementById('moqProgressFill');
      const currentEl = document.getElementById('moqCurrent');
      const messageEl = document.getElementById('moqMessage');

      if (fillEl) {
        fillEl.style.width = `${progress}%`;
        fillEl.style.backgroundColor = progress >= 100 ? '#10b981' : '#3b82f6';
      }

      if (currentEl) currentEl.textContent = `${totalQuantity} pcs`;

      if (messageEl) {
        if (totalQuantity === 0) {
          messageEl.textContent = 'Add colorways to reach the 75-piece minimum order quantity';
          messageEl.style.color = '#6b7280';
        } else if (totalQuantity < MOQ_CONFIG.global) {
          const remaining = MOQ_CONFIG.global - totalQuantity;
          messageEl.textContent = `${remaining} more pieces needed to reach minimum (${percentText})`;
          messageEl.style.color = '#f59e0b';
        } else {
          messageEl.textContent = `✓ Minimum reached! (${percentText})`;
          messageEl.style.color = '#10b981';
        }
      }
    },

    /**
     * Update Order Summary
     */
    updateOrderSummary: function() {
      const container = document.getElementById('orderSummaryContent');
      if (!container) return;

      // Group by garment for visual card design
      const garmentGroups = [];
      let totalPieces = 0;

      this.garments.forEach(garment => {
        if (!garment.colorways || garment.colorways.length === 0) return;

        const colorways = garment.colorways.map(cw => {
          totalPieces += cw.quantity || 0;
          return {
            color: cw.color,
            hex: cw.hex,
            quantity: cw.quantity
          };
        });

        garmentGroups.push({
          type: garment.type,
          fabric: garment.fabricType,
          colorways: colorways
        });
      });

      if (garmentGroups.length === 0) {
        container.innerHTML = `
          <div class="order-summary-empty">
            <p>Add colorways to see your order summary</p>
          </div>
        `;
        return;
      }

      // Render grouped by garment with visual cards
      container.innerHTML = `
        ${garmentGroups.map(garment => `
          <div class="order-summary-card">
            <div class="order-summary-card__content">
              <div class="order-summary-card__info">
                <h4 class="order-summary-card__garment">${garment.type}</h4>
                <span class="order-summary-card__fabric">${garment.fabric}</span>
              </div>
              <div class="order-summary-card__colors">
                ${garment.colorways.map(cw => `
                  <div class="order-summary-color-circle" style="background-color: ${cw.hex};" title="${cw.color}"></div>
                `).join('')}
              </div>
            </div>
            <div class="order-summary-card__quantity">
              ${garment.colorways.reduce((sum, cw) => sum + parseInt(cw.quantity), 0)} pcs
            </div>
          </div>
        `).join('')}
        <div class="order-summary-total">
          <span class="order-summary-total__label">Total Pieces</span>
          <span class="order-summary-total__value">${totalPieces}</span>
        </div>
      `;
    },

    /**
     * STEP 1: Start adding colorway - Show Stock Colors Modal
     */
    startAddingStockColor: function(garmentId) {
      this.pendingColorway = {
        garmentId: garmentId,
        colorType: 'stock',
        color: null,
        hex: null,
        pantoneColor: null,
        quantity: null,
        sizeDistribution: {}
      };

      this.showStockColorsModal();
    },

    /**
     * Start adding Pantone color - Open Color Studio
     */
    startAddingPantoneColor: function(garmentId) {
      console.log('[BulkStep4] Starting Pantone color selection for garment:', garmentId);

      this.pendingColorway = {
        garmentId: garmentId,
        colorType: 'pantone',
        color: null,
        hex: null,
        pantoneCode: null,
        quantity: null,
        sizeDistribution: {}
      };

      // Open Color Studio with garment context
      if (window.TechPackV11.ColorStudio) {
        window.TechPackV11.ColorStudio.open('garment-pantone');
      } else {
        console.error('[BulkStep4] ColorStudio not found!');
        alert('Color Studio is not available. Please refresh the page.');
      }
    },

    /**
     * Start adding TechPack color - Open TechPack Picker Modal
     */
    startAddingTechPackColor: function(garmentId) {
      console.log('[BulkStep4] Starting TechPack color selection for garment:', garmentId);

      this.pendingColorway = {
        garmentId: garmentId,
        colorType: 'techpack',
        color: null,
        hex: null,
        techpackRef: null,
        quantity: null,
        sizeDistribution: {}
      };

      // Open TechPack Color Modal
      const modal = document.getElementById('techpackColorModal');
      if (modal) {
        modal.style.display = 'flex';
        this.initTechPackColorPicker();
      } else {
        console.error('[BulkStep4] TechPack Color Modal not found!');
      }
    },

    /**
     * Show Stock Colors Modal
     */
    showStockColorsModal: function() {
      const modal = document.getElementById('stockColorsModal');
      if (modal) modal.style.display = 'flex';
    },

    /**
     * Select stock color - Move to quantity modal
     */
    selectStockColor: function(colorName, colorHex) {
      console.log('[BulkStep4] Stock color selected:', colorName, colorHex);

      this.pendingColorway.color = colorName;
      this.pendingColorway.hex = colorHex;

      this.closeStockColorsModal();
      this.showQuantityModal();
    },

    closeStockColorsModal: function() {
      const modal = document.getElementById('stockColorsModal');
      if (modal) modal.style.display = 'none';
    },

    /**
     * STEP 2: Show Quantity Modal
     */
    showQuantityModal: function() {
      const modal = document.getElementById('quantityModal');
      const titleEl = document.getElementById('quantityModalTitle');
      const previewEl = document.getElementById('quantityPreview');
      const helpEl = document.getElementById('quantityModalHelp');
      const inputEl = document.getElementById('colorwayQuantity');

      if (!modal) return;

      const garment = this.garments.find(g => g.id === this.pendingColorway.garmentId);
      if (!garment) return;

      // Calculate minimum based on existing colorways
      const existingColorways = garment.colorways ? garment.colorways.length : 0;
      const moqConfig = MOQ_CONFIG.perGarment[garment.type] || MOQ_CONFIG.perGarment.default;
      const minimum = existingColorways === 0 ? moqConfig.single : moqConfig.multiple;

      // Update preview
      if (titleEl) titleEl.textContent = `${garment.type} - ${this.pendingColorway.color}`;
      if (previewEl) {
        previewEl.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px; padding: 16px; background: #f9fafb; border-radius: 8px;">
            <div style="width: 48px; height: 48px; border-radius: 8px; background-color: ${this.pendingColorway.hex}; border: 1px solid rgba(0,0,0,0.1);"></div>
            <div>
              <div style="font-weight: 600;">${garment.type}</div>
              <div style="font-size: 0.875rem; color: #6b7280;">${this.pendingColorway.color}</div>
            </div>
          </div>
        `;
      }

      if (helpEl) helpEl.textContent = `Minimum: ${minimum} pieces for this garment type`;
      if (inputEl) {
        // Pre-populate if editing existing colorway
        if (this.pendingColorway.colorwayId && this.pendingColorway.quantity) {
          inputEl.value = this.pendingColorway.quantity;
        } else {
          inputEl.value = '';
        }
        inputEl.min = minimum;
        inputEl.placeholder = minimum.toString();
        inputEl.focus();
      }

      modal.style.display = 'flex';
    },

    /**
     * Continue to sizes after quantity entered
     */
    continueToSizes: function() {
      const inputEl = document.getElementById('colorwayQuantity');
      if (!inputEl) return;

      const quantity = parseInt(inputEl.value);
      const garment = this.garments.find(g => g.id === this.pendingColorway.garmentId);
      if (!garment) return;

      // Validate MOQ
      const existingColorways = garment.colorways ? garment.colorways.length : 0;
      const moqConfig = MOQ_CONFIG.perGarment[garment.type] || MOQ_CONFIG.perGarment.default;
      const minimum = existingColorways === 0 ? moqConfig.single : moqConfig.multiple;

      if (!quantity || quantity < minimum) {
        alert(`Quantity must be at least ${minimum} pieces for ${garment.type}`);
        return;
      }

      this.pendingColorway.quantity = quantity;
      this.closeQuantityModal();
      this.showSizeDistributionModal();
    },

    closeQuantityModal: function() {
      const modal = document.getElementById('quantityModal');
      if (modal) modal.style.display = 'none';
    },

    /**
     * STEP 3: Show Size Distribution Modal
     */
    showSizeDistributionModal: function() {
      const modal = document.getElementById('sizeDistributionModal');
      const titleEl = document.getElementById('sizeModalTitle');
      const previewEl = document.getElementById('sizePreview');
      const gridEl = document.getElementById('sizeInputGrid');

      if (!modal || !gridEl) return;

      const garment = this.garments.find(g => g.id === this.pendingColorway.garmentId);
      if (!garment) return;

      // Determine available sizes based on quantity
      const availableSizes = this.getAvailableSizes(this.pendingColorway.quantity);

      // Update title and preview
      if (titleEl) titleEl.textContent = `${garment.type} - ${this.pendingColorway.color} (${this.pendingColorway.quantity} pcs)`;
      if (previewEl) {
        previewEl.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px; padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 16px;">
            <div style="width: 48px; height: 48px; border-radius: 8px; background-color: ${this.pendingColorway.hex}; border: 1px solid rgba(0,0,0,0.1);"></div>
            <div>
              <div style="font-weight: 600;">${garment.type} - ${this.pendingColorway.color}</div>
              <div style="font-size: 0.875rem; color: #6b7280;">${this.pendingColorway.quantity} pieces - Distribute across ${availableSizes.length} sizes</div>
            </div>
          </div>
        `;
      }

      // Render size input grid
      gridEl.innerHTML = availableSizes.map(size => `
        <div class="size-input-field">
          <label class="size-input-label">${size}</label>
          <input
            type="number"
            class="size-input"
            data-size="${size}"
            min="0"
            max="${this.pendingColorway.quantity}"
            value="0"
            placeholder="0"
          />
        </div>
      `).join('');

      // Add change listeners
      gridEl.querySelectorAll('.size-input').forEach(input => {
        input.addEventListener('input', () => this.updateSizeTotal());
      });

      this.updateSizeTotal();
      modal.style.display = 'flex';
    },

    /**
     * Get available sizes based on quantity (V10 rules)
     */
    getAvailableSizes: function(quantity) {
      for (const limit of MOQ_CONFIG.sizeLimits) {
        if (quantity >= limit.min) {
          return limit.sizes;
        }
      }
      return ['S', 'M']; // Fallback
    },

    /**
     * Update size total display
     */
    updateSizeTotal: function() {
      const gridEl = document.getElementById('sizeInputGrid');
      const totalEl = document.getElementById('sizeTotalValue');
      if (!gridEl || !totalEl) return;

      let total = 0;
      gridEl.querySelectorAll('.size-input').forEach(input => {
        total += parseInt(input.value) || 0;
      });

      const target = this.pendingColorway.quantity;
      totalEl.textContent = `${total} / ${target}`;
      totalEl.style.color = total === target ? '#10b981' : (total > target ? '#ef4444' : '#f59e0b');
    },

    /**
     * Quick Fill - Even Split
     */
    quickFillEven: function() {
      const gridEl = document.getElementById('sizeInputGrid');
      if (!gridEl) return;

      const inputs = gridEl.querySelectorAll('.size-input');
      const perSize = Math.floor(this.pendingColorway.quantity / inputs.length);
      const remainder = this.pendingColorway.quantity % inputs.length;

      inputs.forEach((input, index) => {
        input.value = perSize + (index < remainder ? 1 : 0);
      });

      this.updateSizeTotal();
    },

    /**
     * Quick Fill - Typical (Bell Curve)
     */
    quickFillTypical: function() {
      const gridEl = document.getElementById('sizeInputGrid');
      if (!gridEl) return;

      const inputs = Array.from(gridEl.querySelectorAll('.size-input'));
      const total = this.pendingColorway.quantity;

      // Bell curve distribution percentages
      const distributions = {
        2: [0.4, 0.6],
        3: [0.2, 0.5, 0.3],
        4: [0.15, 0.35, 0.35, 0.15],
        5: [0.1, 0.2, 0.4, 0.2, 0.1],
        6: [0.05, 0.15, 0.25, 0.25, 0.15, 0.05],
        7: [0.05, 0.1, 0.2, 0.3, 0.2, 0.1, 0.05]
      };

      const dist = distributions[inputs.length] || distributions[5];
      let assigned = 0;

      inputs.forEach((input, index) => {
        const value = index === inputs.length - 1
          ? total - assigned // Last size gets remainder
          : Math.round(total * dist[index]);
        input.value = value;
        assigned += value;
      });

      this.updateSizeTotal();
    },

    /**
     * Skip size distribution
     */
    skipSizeDistribution: function() {
      this.pendingColorway.sizeDistribution = {};
      this.closeSizeDistributionModal();
      this.finishAddingColorway();
    },

    /**
     * Confirm size distribution
     */
    confirmSizeDistribution: function() {
      const gridEl = document.getElementById('sizeInputGrid');
      if (!gridEl) return;

      const sizeDistribution = {};
      let total = 0;

      gridEl.querySelectorAll('.size-input').forEach(input => {
        const size = input.dataset.size;
        const qty = parseInt(input.value) || 0;
        if (qty > 0) {
          sizeDistribution[size] = qty;
          total += qty;
        }
      });

      if (total !== this.pendingColorway.quantity) {
        alert(`Size distribution (${total} pcs) must equal colorway quantity (${this.pendingColorway.quantity} pcs)`);
        return;
      }

      this.pendingColorway.sizeDistribution = sizeDistribution;
      this.closeSizeDistributionModal();

      // If editing existing colorway, skip copy modal and finish edit
      if (this.pendingColorway.colorwayId) {
        console.log('[BulkStep4] Editing mode detected, skipping copy modal');
        this.finishEditingColorway();
      } else {
        // Adding new colorway, show copy modal
        this.showCopyColorwayModal();
      }
    },

    closeSizeDistributionModal: function() {
      const modal = document.getElementById('sizeDistributionModal');
      if (modal) modal.style.display = 'none';
    },

    /**
     * STEP 4: Show Copy Colorway Modal
     */
    showCopyColorwayModal: function() {
      const modal = document.getElementById('copyColorwayModal');
      const previewEl = document.getElementById('copyPreview');
      const listEl = document.getElementById('copyGarmentList');

      if (!modal) return;

      const currentGarment = this.garments.find(g => g.id === this.pendingColorway.garmentId);
      if (!currentGarment) return;

      // Show preview
      if (previewEl) {
        previewEl.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px; padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 16px;">
            <div style="width: 48px; height: 48px; border-radius: 8px; background-color: ${this.pendingColorway.hex}; border: 1px solid rgba(0,0,0,0.1);"></div>
            <div>
              <div style="font-weight: 600;">${this.pendingColorway.color}</div>
              <div style="font-size: 0.875rem; color: #6b7280;">${this.pendingColorway.quantity} pieces</div>
            </div>
          </div>
        `;
      }

      // Show other garments (excluding current)
      const otherGarments = this.garments.filter(g => g.id !== this.pendingColorway.garmentId);

      if (listEl) {
        if (otherGarments.length === 0) {
          listEl.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 16px;">No other garments to copy to</p>';
        } else {
          listEl.innerHTML = otherGarments.map(g => {
            const moqConfig = MOQ_CONFIG.perGarment[g.type] || MOQ_CONFIG.perGarment.default;
            const existingColorways = g.colorways ? g.colorways.length : 0;
            const minimum = existingColorways === 0 ? moqConfig.single : moqConfig.multiple;

            return `
              <label class="copy-garment-checkbox">
                <input type="checkbox" data-garment-id="${g.id}" data-minimum="${minimum}">
                <span>${g.type} (${g.fabricType})</span>
                <span style="font-size: 0.813rem; color: #6b7280;">Min: ${minimum} pcs</span>
              </label>
            `;
          }).join('');
        }
      }

      modal.style.display = 'flex';
    },

    /**
     * Skip copying colorway
     */
    skipCopyColorway: function() {
      this.closeCopyColorwayModal();
      this.finishAddingColorway();
    },

    /**
     * Confirm copy colorway
     */
    confirmCopyColorway: function() {
      const listEl = document.getElementById('copyGarmentList');
      const quantityEl = document.getElementById('copyQuantity');

      if (!listEl) return;

      const selectedCheckboxes = listEl.querySelectorAll('input[type="checkbox"]:checked');

      if (selectedCheckboxes.length === 0) {
        this.closeCopyColorwayModal();
        this.finishAddingColorway();
        return;
      }

      const quantity = parseInt(quantityEl.value) || null;

      selectedCheckboxes.forEach(checkbox => {
        const garmentId = checkbox.dataset.garmentId;
        const minimum = parseInt(checkbox.dataset.minimum);
        const finalQuantity = quantity || minimum;

        if (finalQuantity < minimum) {
          console.warn(`[BulkStep4] Quantity ${finalQuantity} is below minimum ${minimum}, using minimum`);
        }

        this.addColorwayToGarment(garmentId, {
          ...this.pendingColorway,
          quantity: Math.max(finalQuantity, minimum),
          sizeDistribution: {} // Don't copy size distribution
        });
      });

      this.closeCopyColorwayModal();
      this.finishAddingColorway();
    },

    closeCopyColorwayModal: function() {
      const modal = document.getElementById('copyColorwayModal');
      if (modal) modal.style.display = 'none';
    },

    /**
     * Finish adding colorway - Add to garment and render
     */
    finishAddingColorway: function() {
      this.addColorwayToGarment(this.pendingColorway.garmentId, this.pendingColorway);

      // Reset pending
      this.pendingColorway = {
        garmentId: null,
        colorType: null,
        color: null,
        hex: null,
        pantoneColor: null,
        quantity: null,
        sizeDistribution: {}
      };

      this.saveAndRender();
    },

    /**
     * Add colorway to specific garment
     */
    addColorwayToGarment: function(garmentId, colorwayData) {
      const garment = this.garments.find(g => g.id === garmentId);
      if (!garment) return;

      if (!garment.colorways) garment.colorways = [];

      const newColorway = {
        id: 'colorway-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        colorType: colorwayData.colorType,
        color: colorwayData.color,
        hex: colorwayData.hex,
        pantoneColor: colorwayData.pantoneColor || null,
        quantity: colorwayData.quantity,
        sizeDistribution: colorwayData.sizeDistribution || {}
      };

      garment.colorways.push(newColorway);

      // Update total quantity
      garment.totalQuantity = garment.colorways.reduce((sum, cw) => sum + (cw.quantity || 0), 0);

      console.log('[BulkStep4] Added colorway to garment:', garment.type, newColorway);
    },

    /**
     * Edit existing colorway
     */
    editColorway: function(garmentId, colorwayId) {
      console.log('[BulkStep4] Editing colorway:', garmentId, colorwayId);

      const garment = this.garments.find(g => g.id === garmentId);
      if (!garment || !garment.colorways) {
        console.error('[BulkStep4] Garment or colorways not found');
        return;
      }

      const colorway = garment.colorways.find(cw => cw.id === colorwayId);
      if (!colorway) {
        console.error('[BulkStep4] Colorway not found');
        return;
      }

      // Load existing colorway data into pendingColorway for editing
      this.pendingColorway = {
        garmentId: garmentId,
        colorwayId: colorwayId, // Track which colorway we're editing
        colorType: colorway.colorType,
        color: colorway.color,
        hex: colorway.hex,
        pantoneColor: colorway.pantoneColor || null,
        quantity: colorway.quantity,
        sizeDistribution: { ...colorway.sizeDistribution }
      };

      console.log('[BulkStep4] Loaded colorway for editing:', this.pendingColorway);

      // Open quantity modal (will pre-populate with existing quantity)
      this.showQuantityModal();
    },

    /**
     * Finish editing colorway (UPDATE instead of ADD)
     */
    finishEditingColorway: function() {
      console.log('[BulkStep4] Finishing edit for colorway:', this.pendingColorway.colorwayId);

      const garment = this.garments.find(g => g.id === this.pendingColorway.garmentId);
      if (!garment || !garment.colorways) return;

      const colorway = garment.colorways.find(cw => cw.id === this.pendingColorway.colorwayId);
      if (!colorway) {
        console.error('[BulkStep4] Colorway not found for update');
        return;
      }

      // Update existing colorway with new data
      colorway.colorType = this.pendingColorway.colorType;
      colorway.color = this.pendingColorway.color;
      colorway.hex = this.pendingColorway.hex;
      colorway.pantoneColor = this.pendingColorway.pantoneColor || null;
      colorway.quantity = this.pendingColorway.quantity;
      colorway.sizeDistribution = { ...this.pendingColorway.sizeDistribution };

      // Update garment total quantity
      garment.totalQuantity = garment.colorways.reduce((sum, cw) => sum + (cw.quantity || 0), 0);

      console.log('[BulkStep4] Updated colorway:', colorway);

      // Reset pending
      this.pendingColorway = {
        garmentId: null,
        colorwayId: null,
        colorType: null,
        color: null,
        hex: null,
        pantoneColor: null,
        quantity: null,
        sizeDistribution: {}
      };

      this.saveAndRender();
    },

    /**
     * Check if colorway is complete (has full size distribution)
     * @param {Object} colorway - The colorway to check
     * @returns {boolean} - True if colorway has complete size distribution
     */
    isColorwayComplete: function(colorway) {
      if (!colorway) return false;

      if (!colorway.sizeDistribution || Object.keys(colorway.sizeDistribution).length === 0) {
        return false;
      }

      // Check if total of size distribution equals quantity
      const distributedTotal = Object.values(colorway.sizeDistribution)
        .reduce((sum, qty) => sum + (parseInt(qty) || 0), 0);

      return distributedTotal === colorway.quantity && distributedTotal > 0;
    },

    /**
     * Check if garment has all colorways complete
     * @param {Object} garment - The garment to check
     * @returns {boolean} - True if all colorways are complete
     */
    areAllColorwaysComplete: function(garment) {
      if (!garment) return false;

      if (!garment.colorways || garment.colorways.length === 0) {
        return false;
      }

      return garment.colorways.every(cw => this.isColorwayComplete(cw));
    },

    /**
     * Remove colorway (and return Pantone colors to Lab Dip Cart)
     */
    deleteColorway: function(garmentId, colorwayId) {
      if (!confirm('Remove this colorway?')) return;

      const garment = this.garments.find(g => g.id === garmentId);
      if (!garment || !garment.colorways) return;

      // Check if colorway is Pantone type - return to lab dip cart
      const colorway = garment.colorways.find(cw => cw.id === colorwayId);
      if (colorway && colorway.colorType === 'pantone' && colorway.pantoneColor) {
        console.log('[BulkStep4] Returning Pantone color to Lab Dip Cart:', colorway.pantoneColor);

        // Return Pantone color to lab dip cart
        const labDip = {
          id: 'labdip-' + Date.now(),
          code: colorway.pantoneColor.code,
          name: colorway.pantoneColor.name,
          hex: colorway.hex,
          price: 25.00
        };

        this.labDipCart.push(labDip);
        this.renderLabDipCart();
        localStorage.setItem('v11_bulk_labdip_cart', JSON.stringify(this.labDipCart));
      }

      // Remove colorway from garment
      garment.colorways = garment.colorways.filter(cw => cw.id !== colorwayId);
      garment.totalQuantity = garment.colorways.reduce((sum, cw) => sum + (cw.quantity || 0), 0);

      this.saveAndRender();
    },

    /**
     * Setup drag & drop from lab dip cart to garments
     */
    setupLabDipDragDrop: function() {
      const self = this;

      // Drag start on cart items
      document.addEventListener('dragstart', function(e) {
        const cartItem = e.target.closest('.lab-dip-cart-item');
        if (cartItem) {
          const labDipId = cartItem.getAttribute('data-labdip-id');
          e.dataTransfer.setData('labDipId', labDipId);
          e.dataTransfer.effectAllowed = 'move';
          cartItem.classList.add('dragging');
        }
      });

      document.addEventListener('dragend', function(e) {
        const cartItem = e.target.closest('.lab-dip-cart-item');
        if (cartItem) {
          cartItem.classList.remove('dragging');
        }
      });

      // Drop on garment cards
      document.addEventListener('dragover', function(e) {
        const garmentCard = e.target.closest('.garment-color-card');
        if (garmentCard) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          garmentCard.classList.add('drop-target');
        }
      });

      document.addEventListener('dragleave', function(e) {
        const garmentCard = e.target.closest('.garment-color-card');
        if (garmentCard && !garmentCard.contains(e.relatedTarget)) {
          garmentCard.classList.remove('drop-target');
        }
      });

      document.addEventListener('drop', function(e) {
        const garmentCard = e.target.closest('.garment-color-card');
        if (garmentCard) {
          e.preventDefault();
          garmentCard.classList.remove('drop-target');

          const labDipId = e.dataTransfer.getData('labDipId');
          const garmentId = garmentCard.getAttribute('data-garment-id');

          if (labDipId && garmentId) {
            self.assignLabDipToGarment(labDipId, garmentId);
          }
        }
      });

      console.log('[BulkStep4] Drag & drop setup complete');
    },

    /**
     * Assign lab dip from cart to garment as new colorway
     */
    assignLabDipToGarment: function(labDipId, garmentId) {
      // Find lab dip
      const labDip = this.labDipCart.find(dip => dip.id === labDipId);
      if (!labDip) {
        console.warn('[BulkStep4] Lab dip not found:', labDipId);
        return;
      }

      // Find garment
      const garment = this.garments.find(g => g.id === garmentId);
      if (!garment) {
        console.warn('[BulkStep4] Garment not found:', garmentId);
        return;
      }

      // Check if garment fabric is Pantone-eligible (V10 Rules)
      if (!COTTON_FABRICS.includes(garment.fabricType)) {
        alert('Pantone colors can only be assigned to 100% cotton fabrics.\nThis garment uses ' + garment.fabricType + '.\n\nEligible fabrics: 100% Organic Cotton, 100% Cotton, Linen, or Hemp/Cotton blends.');
        return;
      }

      // Create new colorway from lab dip
      this.pendingColorway = {
        garmentId: garmentId,
        colorType: 'pantone',
        color: labDip.name,
        hex: labDip.hex,
        pantoneColor: {
          code: labDip.code,
          name: labDip.name,
          hex: labDip.hex,
          labDipId: labDip.id
        },
        quantity: null,
        sizeDistribution: {}
      };

      // Remove from cart
      this.labDipCart = this.labDipCart.filter(dip => dip.id !== labDipId);
      this.renderLabDipCart();

      // Save cart to storage
      localStorage.setItem('v11_bulk_labdip_cart', JSON.stringify(this.labDipCart));

      // Open quantity modal
      this.showQuantityModal();

      console.log('[BulkStep4] Lab dip assigned to garment, opening quantity modal');
    },

    /**
     * Save and render
     */
    saveAndRender: function() {
      if (window.TechPackV11.State) {
        window.TechPackV11.State.formData.garments = this.garments;
        window.TechPackV11.State.saveToStorage();
      }

      this.render();
      this.updateMOQProgress();
      this.updateOrderSummary();
      this.updateContinueButton();
    },

    /**
     * Initialize TechPack Color Picker
     */
    initTechPackColorPicker: function() {
      const pickerEl = document.getElementById('techpackColorPicker');
      const swatchEl = document.getElementById('techpackColorSwatch');
      const hexEl = document.getElementById('techpackColorHex');

      if (!pickerEl || !swatchEl || !hexEl) return;

      // Update preview when color changes
      pickerEl.addEventListener('input', function(e) {
        const hex = e.target.value;
        swatchEl.style.backgroundColor = hex;
        hexEl.textContent = hex.toUpperCase();
      });

      // Reset to default
      pickerEl.value = '#000000';
      swatchEl.style.backgroundColor = '#000000';
      hexEl.textContent = '#000000';
    },

    /**
     * Confirm TechPack color selection
     */
    confirmTechPackColor: function() {
      const pickerEl = document.getElementById('techpackColorPicker');
      if (!pickerEl) return;

      const hex = pickerEl.value;
      console.log('[BulkStep4] TechPack color confirmed:', hex);

      this.pendingColorway.color = 'TechPack Reference';
      this.pendingColorway.hex = hex;
      this.pendingColorway.techpackRef = 'Uploaded TechPack';

      this.closeTechPackColorModal();
      this.showQuantityModal();
    },

    closeTechPackColorModal: function() {
      const modal = document.getElementById('techpackColorModal');
      if (modal) modal.style.display = 'none';
    },

    /**
     * Validate if user can proceed to review step
     * @returns {boolean} - True if validation passes
     */
    canProceedToReview: function() {
      // Get all garments from state
      const garments = window.TechPackV11.State?.garmentSelections || [];

      if (garments.length === 0) {
        console.log('[BulkStep4] No garments selected');
        return false;
      }

      // Check if at least one colorway exists across all garments
      let totalColorways = 0;
      garments.forEach(garment => {
        if (garment.colorways && Array.isArray(garment.colorways)) {
          totalColorways += garment.colorways.length;
        }
      });

      if (totalColorways === 0) {
        console.log('[BulkStep4] No colorways added yet');
        return false;
      }

      // Calculate total quantity across all colorways
      let totalQuantity = 0;
      garments.forEach(garment => {
        if (garment.colorways && Array.isArray(garment.colorways)) {
          garment.colorways.forEach(colorway => {
            if (colorway.sizeDistribution) {
              Object.values(colorway.sizeDistribution).forEach(qty => {
                totalQuantity += parseInt(qty) || 0;
              });
            }
          });
        }
      });

      // MOQ check (minimum 75 pieces)
      const globalMOQ = 75;
      if (totalQuantity < globalMOQ) {
        console.log(`[BulkStep4] MOQ not met: ${totalQuantity}/${globalMOQ}`);
        return false;
      }

      console.log('[BulkStep4] Validation passed:', {
        garments: garments.length,
        colorways: totalColorways,
        quantity: totalQuantity
      });
      return true;
    },

    /**
     * Update Continue button state based on validation
     */
    updateContinueButton: function() {
      const button = document.getElementById('bulkContinueToReview');
      if (!button) return;

      const canProceed = this.canProceedToReview();

      if (canProceed) {
        button.disabled = false;
        button.classList.remove('button-disabled');
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
      } else {
        button.disabled = true;
        button.classList.add('button-disabled');
        button.style.opacity = '0.5';
        button.style.cursor = 'not-allowed';
      }
    }
  };

  // Initialize when ready
  function initWhenReady() {
    const element = document.getElementById('bulkStep4');
    if (!element) return;

    const isStateReady = window.TechPackV11 &&
                         window.TechPackV11.State &&
                         window.TechPackV11.State.currentFlow !== null;

    if (isStateReady) {
      console.log('[BulkStep4] State ready, initializing...');
      window.TechPackV11.BulkStep4.init();
    } else {
      console.log('[BulkStep4] Waiting for State...');
      setTimeout(initWhenReady, 50);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhenReady);
  } else {
    initWhenReady();
  }

})();
