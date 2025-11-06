/**
 * TechPack V11 - Bulk Step 4: Colorway & Quantity Management
 *
 * Handles:
 * - Colorway addition (color + quantity + size distribution)
 * - MOQ validation (75 global + per-garment minimums)
 * - Size distribution with Quick Fill templates
 * - Copy colorway to other garments
 * - Bulk Color Cart for managing reusable Pantone colorways
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

    // Current colorway being created (inline flow - no modals)
    pendingColorway: {
      garmentId: null,
      colorType: null, // 'stock', 'pantone', 'techpack'
      color: null,
      hex: null,
      pantoneColor: null,
      sizes: {  // New: direct size quantities (no total quantity field)
        XS: 0,
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        XXL: 0
      }
    },

    /**
     * Initialize Step 4
     */
    init: function() {
      console.log('[BulkStep4] Initializing...');

      // Show Bulk-specific text in cart snippets
      document.querySelectorAll('.labdip-guide-title--sample, .speed-guide-unassigned--sample, .cart-title--sample, .cart-empty-hint--sample, .cart-empty-note--sample, .cart-total--sample').forEach(el => {
        el.style.display = 'none';
      });
      document.querySelectorAll('.labdip-guide-title--bulk, .speed-guide-unassigned--bulk, .cart-title--bulk, .cart-empty-hint--bulk, .cart-empty-note--bulk, .cart-total--bulk').forEach(el => {
        el.style.display = '';
      });

      // Load garments from state
      this.loadGarmentsFromState();

      // Load lab dip cart from storage
      const savedCart = localStorage.getItem('techpack_v11_bulk_labdip_cart');
      if (savedCart) {
        try {
          this.labDipCart = JSON.parse(savedCart);
          console.log('[BulkStep4] Loaded lab dip cart from storage:', this.labDipCart.length, 'items');
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

    // ==========================================================================
    // HELPER FUNCTIONS
    // ==========================================================================

    /**
     * Calculate total pieces from colorway sizes
     */
    calculateColorwayTotal: function(colorway) {
      if (!colorway || !colorway.sizes) return 0;
      return Object.values(colorway.sizes).reduce((sum, qty) => sum + (parseInt(qty) || 0), 0);
    },

    /**
     * Save garments to global state
     */
    saveToStorage: function() {
      if (window.TechPackV11.State) {
        window.TechPackV11.State.formData.garments = this.garments;
        window.TechPackV11.State.saveToStorage();
      }
      // Also save lab dip cart to localStorage
      localStorage.setItem('techpack_v11_bulk_labdip_cart', JSON.stringify(this.labDipCart));
      console.log('[BulkStep4] Saved lab dip cart to storage:', this.labDipCart.length, 'items');
    },

    /**
     * Check if garment has at least one complete colorway
     */
    validateGarmentComplete: function(garment) {
      if (!garment.colorways || garment.colorways.length === 0) return false;
      return garment.colorways.some(colorway => this.calculateColorwayTotal(colorway) > 0);
    },

    /**
     * Handle Quick Fill button click - show modal if multiple colorways, apply directly if only 1
     */
    handleQuickFill: function(garmentId, preset) {
      const garment = this.garments.find(g => g.id === garmentId);
      if (!garment || !garment.colorways || garment.colorways.length === 0) {
        alert('Please add at least one colorway first');
        return;
      }

      // If only 1 colorway, apply directly
      if (garment.colorways.length === 1) {
        const totalInput = prompt(`Enter total pieces to distribute (${this.getPresetName(preset)})`, '75');
        if (totalInput && parseInt(totalInput) > 0) {
          this.applyQuickFill(garmentId, garment.colorways[0].id, preset, parseInt(totalInput));
        }
      } else {
        // Show modal to select which colorways to apply to
        this.showQuickFillModal(garmentId, preset);
      }
    },

    /**
     * Get friendly name for preset
     */
    getPresetName: function(preset) {
      const names = {
        'even': 'Even Split',
        'bell': 'Bell Curve',
        'popular': 'Popular'
      };
      return names[preset] || preset;
    },

    /**
     * Show modal to select colorways for Quick Fill
     */
    showQuickFillModal: function(garmentId, preset) {
      const garment = this.garments.find(g => g.id === garmentId);
      if (!garment) return;

      // Create modal HTML with checkboxes for each colorway
      const colorwayOptions = garment.colorways.map(colorway => `
        <label class="quick-fill-modal__colorway">
          <input type="checkbox" value="${colorway.id}" checked>
          <span class="colorway-swatch" style="background-color: ${colorway.hex};"></span>
          <span>${colorway.color}</span>
        </label>
      `).join('');

      const modalHTML = `
        <div class="quick-fill-modal-overlay" id="quickFillModal">
          <div class="quick-fill-modal">
            <div class="quick-fill-modal__header">
              <h3>Apply ${this.getPresetName(preset)} Distribution</h3>
              <button type="button" class="modal-close" data-action="close-quick-fill-modal">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <div class="quick-fill-modal__body">
              <p class="quick-fill-modal__hint">Select which colorways to apply this size distribution to:</p>
              <div class="quick-fill-modal__colorways" id="quickFillColorways">
                ${colorwayOptions}
              </div>
              <div class="quick-fill-modal__input">
                <label>Total Pieces Per Colorway:</label>
                <input type="number" id="quickFillTotal" min="0" step="1" value="75" placeholder="Enter total pieces">
              </div>
            </div>
            <div class="quick-fill-modal__footer">
              <button type="button" class="button-secondary" data-action="close-quick-fill-modal">Cancel</button>
              <button type="button" class="button-primary" data-action="apply-quick-fill-modal" data-garment-id="${garmentId}" data-preset="${preset}">Apply to Selected</button>
            </div>
          </div>
        </div>
      `;

      // Add modal to page
      document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    /**
     * Apply Quick Fill to selected colorways from modal
     */
    applyQuickFillFromModal: function(garmentId, preset) {
      const modal = document.getElementById('quickFillModal');
      if (!modal) return;

      // Get total quantity
      const totalInput = document.getElementById('quickFillTotal');
      const total = parseInt(totalInput.value);
      if (!total || total <= 0) {
        alert('Please enter a valid total quantity');
        return;
      }

      // Get selected colorways
      const checkboxes = modal.querySelectorAll('input[type="checkbox"]:checked');
      if (checkboxes.length === 0) {
        alert('Please select at least one colorway');
        return;
      }

      // Apply to each selected colorway
      checkboxes.forEach(checkbox => {
        const colorwayId = checkbox.value;
        this.applyQuickFill(garmentId, colorwayId, preset, total);
      });

      // Close modal
      this.closeQuickFillModal();
    },

    /**
     * Close Quick Fill modal
     */
    closeQuickFillModal: function() {
      const modal = document.getElementById('quickFillModal');
      if (modal) {
        modal.remove();
      }
    },

    /**
     * Apply quick fill preset to specific colorway
     * @param {string} garmentId - ID of garment
     * @param {string} colorwayId - ID of colorway
     * @param {string} preset - 'even', 'bell', or 'popular'
     * @param {number} total - Total pieces to distribute
     */
    applyQuickFill: function(garmentId, colorwayId, preset, total) {
      const garment = this.garments.find(g => g.id === garmentId);
      if (!garment || !garment.colorways) return;

      const colorway = garment.colorways.find(c => c.id === colorwayId);
      if (!colorway) return;

      total = parseInt(total) || 0;
      if (total === 0) {
        alert('Please enter a total quantity first');
        return;
      }

      let distribution = {};

      if (preset === 'even') {
        // Even Split: Equal distribution
        const perSize = Math.floor(total / 6);
        const remainder = total % 6;
        distribution = {
          XS: perSize + (remainder > 0 ? 1 : 0),
          S: perSize + (remainder > 1 ? 1 : 0),
          M: perSize + (remainder > 2 ? 1 : 0),
          L: perSize + (remainder > 3 ? 1 : 0),
          XL: perSize + (remainder > 4 ? 1 : 0),
          XXL: perSize + (remainder > 5 ? 1 : 0)
        };
      } else if (preset === 'bell') {
        // Bell Curve: XS:10%, S:20%, M:30%, L:25%, XL:10%, XXL:5%
        distribution = {
          XS: Math.round(total * 0.10),
          S: Math.round(total * 0.20),
          M: Math.round(total * 0.30),
          L: Math.round(total * 0.25),
          XL: Math.round(total * 0.10),
          XXL: Math.round(total * 0.05)
        };
        // Adjust for rounding errors
        const sum = Object.values(distribution).reduce((a, b) => a + b, 0);
        if (sum !== total) {
          distribution.M += (total - sum);
        }
      } else if (preset === 'popular') {
        // Popular Sizes: XS:5%, S:30%, M:35%, L:25%, XL:5%, XXL:0%
        distribution = {
          XS: Math.round(total * 0.05),
          S: Math.round(total * 0.30),
          M: Math.round(total * 0.35),
          L: Math.round(total * 0.25),
          XL: Math.round(total * 0.05),
          XXL: 0
        };
        // Adjust for rounding errors
        const sum = Object.values(distribution).reduce((a, b) => a + b, 0);
        if (sum !== total) {
          distribution.M += (total - sum);
        }
      }

      // Update colorway sizes
      colorway.sizes = distribution;

      // Re-render and auto-save
      this.render();
      this.updateMOQProgress();
      this.saveToStorage();

      console.log('[BulkStep4] Applied quick fill:', preset, distribution);
    },

    /**
     * Save current colorway sizes as preset
     */
    savePreset: function(garmentId, colorwayId) {
      const garment = this.garments.find(g => g.id === garmentId);
      if (!garment || !garment.colorways) {
        alert('No colorway to save as preset');
        return;
      }

      const colorway = garment.colorways.find(c => c.id === colorwayId);
      if (!colorway) {
        alert('No colorway to save as preset');
        return;
      }

      const total = this.calculateColorwayTotal(colorway);

      if (total === 0) {
        alert('Please fill sizes before saving preset');
        return;
      }

      // Save to localStorage
      localStorage.setItem('v11_bulk_size_preset', JSON.stringify(colorway.sizes));

      // Show feedback
      alert(`✓ Preset saved!\n\nTotal: ${total} pcs\n${Object.entries(colorway.sizes).map(([size, qty]) => `${size}: ${qty}`).join(', ')}`);

      console.log('[BulkStep4] Saved preset:', colorway.sizes);
    },

    /**
     * Load preset into specific colorway
     */
    loadPreset: function(garmentId, colorwayId) {
      const preset = localStorage.getItem('v11_bulk_size_preset');
      if (!preset) {
        alert('No preset saved yet. Add sizes to a colorway and click "Save Preset" first.');
        return;
      }

      const garment = this.garments.find(g => g.id === garmentId);
      if (!garment || !garment.colorways) return;

      const colorway = garment.colorways.find(c => c.id === colorwayId);
      if (!colorway) return;

      // Load sizes from preset
      colorway.sizes = JSON.parse(preset);

      // Re-render and auto-save
      this.render();
      this.updateMOQProgress();
      this.saveToStorage();

      const total = this.calculateColorwayTotal(colorway);
      console.log('[BulkStep4] Loaded preset:', total, 'pcs');
    },

    /**
     * Show modal to select which colorway to load preset into
     */
    showLoadPresetModal: function(garmentId) {
      const preset = localStorage.getItem('v11_bulk_size_preset');
      if (!preset) {
        alert('No preset saved yet. Add sizes to a colorway and click "Save Preset" first.');
        return;
      }

      const garment = this.garments.find(g => g.id === garmentId);
      if (!garment || !garment.colorways || garment.colorways.length === 0) {
        alert('No colorways available. Add a color to this garment first.');
        return;
      }

      // If only one colorway, load directly without modal
      if (garment.colorways.length === 1) {
        this.loadPreset(garmentId, garment.colorways[0].id);
        return;
      }

      const self = this;
      const presetSizes = JSON.parse(preset);
      const presetTotal = Object.values(presetSizes).reduce((sum, qty) => sum + (parseInt(qty) || 0), 0);

      // Build colorway list HTML
      const colorwayListHTML = garment.colorways.map(colorway => {
        const currentTotal = this.calculateColorwayTotal(colorway);
        const colorDisplay = colorway.colorType === 'pantone'
          ? `${colorway.pantoneColor.name} (${colorway.pantoneColor.code})`
          : colorway.color;

        return `
          <div class="preset-colorway-item" data-colorway-id="${colorway.id}">
            <div class="preset-colorway-swatch" style="background-color: ${colorway.hex};"></div>
            <div class="preset-colorway-info">
              <div class="preset-colorway-name">${colorDisplay}</div>
              <div class="preset-colorway-current">Current: ${currentTotal} pcs</div>
            </div>
          </div>
        `;
      }).join('');

      // Create modal HTML
      const modalHTML = `
        <div class="preset-modal-overlay" id="loadPresetModal">
          <div class="preset-modal">
            <div class="preset-modal-header">
              <h3>Load Preset</h3>
              <button type="button" class="preset-modal-close" aria-label="Close">&times;</button>
            </div>
            <div class="preset-modal-body">
              <div class="preset-info">
                <strong>Preset contains ${presetTotal} pcs:</strong>
                <div class="preset-sizes">
                  ${Object.entries(presetSizes).map(([size, qty]) =>
                    qty > 0 ? `${size}: ${qty}` : ''
                  ).filter(s => s).join(', ')}
                </div>
              </div>
              <p class="preset-modal-instruction">Select which colorway to apply this preset to:</p>
              <div class="preset-colorway-list">
                ${colorwayListHTML}
              </div>
            </div>
          </div>
        </div>
      `;

      // Insert modal into DOM
      document.body.insertAdjacentHTML('beforeend', modalHTML);

      // Add event listeners
      const modal = document.getElementById('loadPresetModal');

      // Close modal on overlay click or close button
      modal.querySelector('.preset-modal-close').addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
      });

      // Handle colorway selection
      modal.querySelectorAll('.preset-colorway-item').forEach(item => {
        item.addEventListener('click', function() {
          const colorwayId = this.getAttribute('data-colorway-id');
          modal.remove();
          self.loadPreset(garmentId, colorwayId);
        });
      });
    },

    /**
     * Show modal to select which colorway to save as preset
     */
    showSavePresetModal: function(garmentId) {
      const garment = this.garments.find(g => g.id === garmentId);
      if (!garment || !garment.colorways || garment.colorways.length === 0) {
        alert('No colorways available. Add a color to this garment first.');
        return;
      }

      // Filter colorways that have sizes filled
      const filledColorways = garment.colorways.filter(c => this.calculateColorwayTotal(c) > 0);

      if (filledColorways.length === 0) {
        alert('No colorways with sizes filled. Add quantities to at least one colorway first.');
        return;
      }

      // If only one colorway has sizes, save it directly
      if (filledColorways.length === 1) {
        this.savePreset(garmentId, filledColorways[0].id);
        return;
      }

      // Check if all filled colorways have the same size distribution
      const firstSizes = JSON.stringify(filledColorways[0].sizes);
      const allSame = filledColorways.every(c => JSON.stringify(c.sizes) === firstSizes);

      // If all same, save first one without asking
      if (allSame) {
        this.savePreset(garmentId, filledColorways[0].id);
        return;
      }

      // Multiple different distributions - show modal to choose
      const self = this;

      const colorwayListHTML = filledColorways.map(colorway => {
        const total = this.calculateColorwayTotal(colorway);
        const colorDisplay = colorway.colorType === 'pantone'
          ? `${colorway.pantoneColor.name} (${colorway.pantoneColor.code})`
          : colorway.color;

        const sizeBreakdown = Object.entries(colorway.sizes)
          .filter(([size, qty]) => qty > 0)
          .map(([size, qty]) => `${size}: ${qty}`)
          .join(', ');

        return `
          <div class="preset-colorway-item" data-colorway-id="${colorway.id}">
            <div class="preset-colorway-swatch" style="background-color: ${colorway.hex};"></div>
            <div class="preset-colorway-info">
              <div class="preset-colorway-name">${colorDisplay}</div>
              <div class="preset-colorway-sizes">${sizeBreakdown}</div>
              <div class="preset-colorway-total">Total: ${total} pcs</div>
            </div>
          </div>
        `;
      }).join('');

      const modalHTML = `
        <div class="preset-modal-overlay" id="savePresetModal">
          <div class="preset-modal">
            <div class="preset-modal-header">
              <h3>Save Preset</h3>
              <button type="button" class="preset-modal-close" aria-label="Close">&times;</button>
            </div>
            <div class="preset-modal-body">
              <p class="preset-modal-instruction">Select which colorway's size distribution to save as preset:</p>
              <div class="preset-colorway-list">
                ${colorwayListHTML}
              </div>
            </div>
          </div>
        </div>
      `;

      // Insert modal into DOM
      document.body.insertAdjacentHTML('beforeend', modalHTML);

      // Add event listeners
      const modal = document.getElementById('savePresetModal');

      modal.querySelector('.preset-modal-close').addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
      });

      modal.querySelectorAll('.preset-colorway-item').forEach(item => {
        item.addEventListener('click', function() {
          const colorwayId = this.getAttribute('data-colorway-id');
          modal.remove();
          self.savePreset(garmentId, colorwayId);
        });
      });
    },

    /**
     * Add colorway to garment (multiple colorways per garment in Bulk)
     */
    addColorwayToGarment: function(garmentId, colorData) {
      const garment = this.garments.find(g => g.id === garmentId);
      if (!garment) {
        console.error('[BulkStep4] Garment not found:', garmentId);
        return;
      }

      // Initialize colorways array if needed
      if (!garment.colorways) {
        garment.colorways = [];
      }

      // Check for duplicates
      const isDuplicate = garment.colorways.some(existing => {
        // For Pantone colors: check code + wash technique
        if (colorData.colorType === 'pantone' && existing.colorType === 'pantone') {
          const existingWash = existing.pantoneColor?.washTechnique || 'none';
          const newWash = colorData.pantoneColor?.washTechnique || 'none';
          return existing.pantoneColor.code === colorData.pantoneColor.code && existingWash === newWash;
        }
        // For stock/techpack colors: check color name
        return existing.colorType === colorData.colorType && existing.color === colorData.color;
      });

      if (isDuplicate) {
        alert(`This ${colorData.colorType} color is already assigned to this garment`);
        return null;
      }

      // Create new colorway
      const newColorway = {
        id: 'colorway-' + Date.now(),
        colorType: colorData.colorType,
        color: colorData.color,
        hex: colorData.hex,
        pantoneColor: colorData.pantoneColor || null,
        techpackRef: colorData.techpackRef || null,
        sizes: {
          XS: 0,
          S: 0,
          M: 0,
          L: 0,
          XL: 0,
          XXL: 0
        }
      };

      // Add to colorways array
      garment.colorways.push(newColorway);

      // Re-render, update MOQ, and auto-save
      this.render();
      this.updateMOQProgress();
      this.updateOrderSummary();
      this.saveToStorage();

      console.log('[BulkStep4] Added colorway to garment:', garment.type, colorData.color);
      return newColorway.id;
    },

    /**
     * Delete specific colorway from garment (Bulk flow: colors stay in cart for reuse)
     */
    deleteColorway: function(garmentId, colorwayId) {
      const garment = this.garments.find(g => g.id === garmentId);
      if (!garment || !garment.colorways || garment.colorways.length === 0) return;

      const colorway = garment.colorways.find(c => c.id === colorwayId);
      if (!colorway) return;

      if (confirm(`Delete ${colorway.color} colorway?`)) {
        // Remove colorway from array
        // Note: In Bulk flow, colors stay in cart for reuse (not returned)
        garment.colorways = garment.colorways.filter(c => c.id !== colorwayId);

        this.render();
        this.updateMOQProgress();
        this.saveToStorage();

        console.log('[BulkStep4] Deleted colorway from garment');
      }
    },

    /**
     * Collapse all inline expansions
     */
    collapseAllExpansions: function() {
      document.querySelectorAll('.garment-color-card__expansion').forEach(el => {
        el.style.display = 'none';
        el.innerHTML = '';
      });
      this.currentExpandedGarment = null;
    },

    /**
     * Expand stock colors inline (no modal)
     */
    expandStockColors: function(garmentId) {
      this.collapseAllExpansions();

      const expansion = document.getElementById(`expansion-${garmentId}`);
      if (!expansion) return;

      const stockColors = [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Navy', hex: '#1E3A8A' },
        { name: 'Gray', hex: '#6B7280' },
        { name: 'Charcoal', hex: '#374151' },
        { name: 'Beige', hex: '#D4C5B9' }
      ];

      expansion.innerHTML = `
        <div class="stock-colors-expansion">
          <h4 class="expansion-title">🎯 Stock Colors</h4>
          <div class="stock-colors-grid">
            ${stockColors.map(color => `
              <button type="button" class="stock-color-swatch" data-action="select-stock-color" data-garment-id="${garmentId}" data-color-name="${color.name}" data-color-hex="${color.hex}">
                <div class="stock-color-swatch__circle" style="background-color: ${color.hex}; ${color.name === 'White' ? 'border: 2px solid #e0e0e0;' : ''}"></div>
                <span class="stock-color-swatch__name">${color.name}</span>
              </button>
            `).join('')}
          </div>
          <button type="button" class="expansion-cancel-btn" data-action="cancel-expansion" data-garment-id="${garmentId}">
            Cancel
          </button>
        </div>
      `;

      expansion.style.display = 'block';
      this.currentExpandedGarment = garmentId;
    },

    /**
     * Expand TechPack Reference (inline, different messaging based on fabric)
     */
    expandTechPackReference: function(garmentId) {
      this.collapseAllExpansions();

      const garment = this.garments.find(g => g.id === garmentId);
      if (!garment) return;

      const expansion = document.getElementById(`expansion-${garmentId}`);
      if (!expansion) return;

      const isCotton = COTTON_FABRICS.includes(garment.fabricType);
      let title, description, noteText;

      if (isCotton) {
        title = '📄 Already Have a Complete TechPack?';
        description = 'This option is for brands who have a professional techpack with all specs, measurements, and exact Pantone codes already documented.<br><br>Timeline: 4-6 weeks (custom manufacturing)';
        noteText = 'Our team will match the exact Pantone codes from your uploaded techpack files.';
      } else {
        title = '📄 Color Reference for Non-Cotton Fabric';
        description = 'Pantone custom colors are only available for 100% Cotton. For this fabric type, we\'ll match as closely as possible to your reference color.<br><br>Timeline: 4-6 weeks (custom manufacturing)';
        noteText = 'Important: We\'ll match the closest available color for this fabric type. This option also works for:<br>• Garments with patterns (camo, stripes, prints)<br>• Multi-color designs<br>• Custom fabric treatments<br><br>Upload your complete techpack for best results.';
      }

      // Predefined techpack reference colors (24 colors = 3 rows × 8 columns, gradient dark to light)
      const techpackColors = [
        { name: 'Black', hex: '#000000' },
        { name: 'Charcoal', hex: '#36454F' },
        { name: 'Navy', hex: '#1E3A8A' },
        { name: 'Burgundy', hex: '#800020' },
        { name: 'Purple', hex: '#800080' },
        { name: 'Brown', hex: '#8B4513' },
        { name: 'Olive', hex: '#808000' },
        { name: 'Teal', hex: '#008080' },
        { name: 'Grey', hex: '#808080' },
        { name: 'Green', hex: '#228B22' },
        { name: 'Red', hex: '#E03030' },
        { name: 'Orange', hex: '#FF8C00' },
        { name: 'Coral', hex: '#FF7F50' },
        { name: 'Blue', hex: '#1E90FF' },
        { name: 'Tan', hex: '#D2B48C' },
        { name: 'Mustard', hex: '#FFDB58' },
        { name: 'Yellow', hex: '#FFD700' },
        { name: 'Pink', hex: '#FFB6C1' },
        { name: 'Sky Blue', hex: '#87CEEB' },
        { name: 'Mint', hex: '#98FF98' },
        { name: 'Lavender', hex: '#E6E6FA' },
        { name: 'Beige', hex: '#F5F5DC' },
        { name: 'Cream', hex: '#FFFDD0' },
        { name: 'White', hex: '#FFFFFF' }
      ];

      expansion.innerHTML = `
        <div class="techpack-expansion">
          <h4 class="expansion-title">${title}</h4>
          <p class="expansion-description">${description}</p>

          <label class="expansion-label">
            Select ${isCotton ? 'an approximate' : 'your desired'} color ${isCotton ? 'for visual' : ''} reference:
          </label>
          <div class="techpack-colors-grid">
            ${techpackColors.map(color => `
              <button type="button" class="techpack-color-swatch" data-action="assign-techpack-reference" data-garment-id="${garmentId}" data-color-name="${color.name}" data-color-hex="${color.hex}">
                <div class="techpack-color-swatch__circle" style="background-color: ${color.hex}; ${color.hex === '#FFFFFF' ? 'border: 1px solid #e5e7eb;' : ''}"></div>
                <span class="techpack-color-swatch__name">${color.name}</span>
              </button>
            `).join('')}
          </div>

          <div class="expansion-note">
            ℹ️ ${noteText}
          </div>

          <button type="button" class="expansion-cancel-btn" data-action="cancel-expansion" data-garment-id="${garmentId}">
            Cancel
          </button>
        </div>
      `;

      expansion.style.display = 'block';
      this.currentExpandedGarment = garmentId;
    },

    /**
     * Assign stock color to garment (creates colorway with sizes)
     */
    assignStockColor: function(garmentId, colorName, colorHex) {
      const garment = this.garments.find(g => g.id === garmentId);
      if (!garment) return;

      // Create colorway with stock color
      this.addColorwayToGarment(garmentId, {
        colorType: 'stock',
        color: colorName,
        hex: colorHex
      });

      this.collapseAllExpansions();
      console.log('[BulkStep4] Assigned stock color:', colorName, 'to garment', garmentId);
    },

    /**
     * Assign TechPack Reference Color
     */
    assignTechPackReference: function(garmentId, colorName, colorHex) {
      const garment = this.garments.find(g => g.id === garmentId);
      if (!garment) return;

      // Create colorway with techpack color
      this.addColorwayToGarment(garmentId, {
        colorType: 'techpack',
        color: colorName,
        hex: colorHex,
        techpackRef: 'Uploaded TechPack'
      });

      this.collapseAllExpansions();
      console.log('[BulkStep4] Assigned TechPack reference:', colorName, colorHex, 'to garment', garmentId);
    },

    /**
     * Cancel expansion
     */
    cancelExpansion: function() {
      this.collapseAllExpansions();
    },

    /**
     * Update size quantity for specific colorway
     */
    updateColorwaySize: function(garmentId, colorwayId, size, quantity) {
      const garment = this.garments.find(g => g.id === garmentId);
      if (!garment || !garment.colorways) return;

      const colorway = garment.colorways.find(c => c.id === colorwayId);
      if (!colorway) return;

      // Update size
      colorway.sizes[size] = parseInt(quantity) || 0;

      // Update total display (no full re-render for performance)
      const totalEl = document.querySelector(`[data-garment-id="${garmentId}"][data-colorway-id="${colorwayId}"] .colorway-inline-total`);
      if (totalEl) {
        const total = this.calculateColorwayTotal(colorway);
        totalEl.textContent = total > 0 ? `${total} pcs` : 'No sizes yet';
        // Toggle empty state class
        if (total === 0) {
          totalEl.classList.add('colorway-inline-total--empty');
        } else {
          totalEl.classList.remove('colorway-inline-total--empty');
        }
      }

      // Update State and auto-save
      if (window.TechPackV11.State) {
        window.TechPackV11.State.formData.garments = this.garments;
      }
      this.updateMOQProgress();
      this.updateOrderSummary();
      this.saveToStorage();
    },

    // ==========================================================================
    // RENDERING
    // ==========================================================================

    /**
     * Render single colorway within a garment
     */
    renderSingleColorway: function(garmentId, colorway) {
      const total = this.calculateColorwayTotal(colorway);
      const sizes = colorway.sizes || {XS:0, S:0, M:0, L:0, XL:0, XXL:0};

      // Build color type display
      let colorTypeDisplay = '';
      let colorDetails = '';

      if (colorway.colorType === 'pantone') {
        colorTypeDisplay = '<span class="colorway-type-badge colorway-type-badge--pantone">Pantone</span>';
        if (colorway.pantoneColor) {
          const washText = colorway.pantoneColor.washTechnique && colorway.pantoneColor.washTechnique !== 'none'
            ? ` · ${colorway.pantoneColor.washTechnique}`
            : '';
          colorDetails = `<span class="colorway-details">${colorway.pantoneColor.code}${washText}</span>`;
        }
      } else if (colorway.colorType === 'stock') {
        colorTypeDisplay = '<span class="colorway-type-badge colorway-type-badge--stock">Stock Color</span>';
      } else if (colorway.colorType === 'techpack') {
        colorTypeDisplay = '<span class="colorway-type-badge colorway-type-badge--techpack">Match Techpack</span>';
        if (colorway.techpackRef) {
          colorDetails = `<span class="colorway-details">From ${colorway.techpackRef}</span>`;
        }
      }

      return `
        <div class="colorway-inline-item" data-garment-id="${garmentId}" data-colorway-id="${colorway.id}">
          <div class="colorway-inline-header">
            <div class="colorway-inline-info">
              <div class="colorway-inline-swatch" style="background-color: ${colorway.hex};"></div>
              <div class="colorway-inline-text">
                <div class="colorway-name-row">
                  <span class="colorway-inline-name">${colorway.color}</span>
                  ${colorTypeDisplay}
                </div>
                ${colorDetails}
              </div>
              <span class="colorway-inline-total ${total === 0 ? 'colorway-inline-total--empty' : ''}">${total > 0 ? `${total} pcs` : 'No sizes yet'}</span>
            </div>
            <button type="button" class="colorway-inline-delete" data-action="delete-colorway" data-garment-id="${garmentId}" data-colorway-id="${colorway.id}" title="Delete Colorway">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </button>
          </div>

          <div class="colorway-size-inputs">
            <div class="size-input-field">
              <label>XS</label>
              <input
                type="number"
                min="0"
                step="1"
                value="${sizes.XS > 0 ? sizes.XS : ''}"
                data-action="update-colorway-size"
                data-garment-id="${garmentId}"
                data-colorway-id="${colorway.id}"
                data-size="XS"
                placeholder="—"
              />
            </div>
            <div class="size-input-field">
              <label>S</label>
              <input
                type="number"
                min="0"
                step="1"
                value="${sizes.S > 0 ? sizes.S : ''}"
                data-action="update-colorway-size"
                data-garment-id="${garmentId}"
                data-colorway-id="${colorway.id}"
                data-size="S"
                placeholder="—"
              />
            </div>
            <div class="size-input-field">
              <label>M</label>
              <input
                type="number"
                min="0"
                step="1"
                value="${sizes.M > 0 ? sizes.M : ''}"
                data-action="update-colorway-size"
                data-garment-id="${garmentId}"
                data-colorway-id="${colorway.id}"
                data-size="M"
                placeholder="—"
              />
            </div>
            <div class="size-input-field">
              <label>L</label>
              <input
                type="number"
                min="0"
                step="1"
                value="${sizes.L > 0 ? sizes.L : ''}"
                data-action="update-colorway-size"
                data-garment-id="${garmentId}"
                data-colorway-id="${colorway.id}"
                data-size="L"
                placeholder="—"
              />
            </div>
            <div class="size-input-field">
              <label>XL</label>
              <input
                type="number"
                min="0"
                step="1"
                value="${sizes.XL > 0 ? sizes.XL : ''}"
                data-action="update-colorway-size"
                data-garment-id="${garmentId}"
                data-colorway-id="${colorway.id}"
                data-size="XL"
                placeholder="—"
              />
            </div>
            <div class="size-input-field">
              <label>XXL</label>
              <input
                type="number"
                min="0"
                step="1"
                value="${sizes.XXL > 0 ? sizes.XXL : ''}"
                data-action="update-colorway-size"
                data-garment-id="${garmentId}"
                data-colorway-id="${colorway.id}"
                data-size="XXL"
                placeholder="—"
              />
            </div>
          </div>
        </div>
      `;
    },

    /**
     * Render individual garment with multiple colorways
     */
    renderGarmentColorwayCard: function(garment) {
      const colorways = garment.colorways || []; // Array of colorways

      // Check if garment is complete (has at least one colorway with sizes)
      const isComplete = colorways.some(cw => this.calculateColorwayTotal(cw) > 0);
      const garmentStateClass = isComplete ? 'garment-color-card--complete' : '';

      // Garment images
      const garmentImages = {
        'T-Shirt': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/TSHIRT.jpg?v=1762324252',
        'Long Sleeve': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/LONGSLEEVE.jpg?v=1762324252',
        'Zip Hoodie': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/ZIPHOODIE.jpg?v=1762324252',
        'Hoodie': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/HOODIE.jpg?v=1762324252',
        'Sweatshirt': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/SWEATSHIRT.jpg?v=1762324252',
        'Sweatpants': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/SWEATPANTS.jpg?v=1762324252',
        'Tank Top': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/TANKTOP.jpg?v=1762324252',
        'Shirt': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/SHIRT.jpg?v=1762324253',
        'Polo Shirt': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/POLO_SHIRT.jpg?v=1762324559',
        'Shorts': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/SHORTS.jpg?v=1762324252',
        'Other': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/OTHERS.jpg?v=1762324710'
      };
      const imageUrl = garmentImages[garment.type] || garmentImages['Other'];

      // Colorway section (render all colorways)
      let colorwayHTML = '';
      if (colorways.length > 0) {
        colorwayHTML = colorways.map(colorway => this.renderSingleColorway(garment.id, colorway)).join('');
      }

      // Floating Toolbar with Quick Fill + Preset buttons (show if at least one colorway exists)
      const hasColorways = colorways.length > 0;
      const lastColorway = hasColorways ? colorways[colorways.length - 1] : null;
      const toolbarHTML = hasColorways ? `
        <div class="garment-floating-toolbar">
          <div class="floating-toolbar__label">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1v14M1 8h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Size Distribution Tools</span>
            <span class="floating-toolbar__hint">(applies to last colorway)</span>
          </div>
          <div class="floating-toolbar__buttons">
            <button type="button" class="toolbar-btn toolbar-btn--even" data-action="quick-fill" data-garment-id="${garment.id}" data-colorway-id="${lastColorway.id}" data-preset="even" title="Even Split - Equal distribution across all sizes">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="5" width="2.5" height="8" stroke="currentColor" stroke-width="1.2"/>
                <rect x="5.75" y="5" width="2.5" height="8" stroke="currentColor" stroke-width="1.2"/>
                <rect x="10.5" y="5" width="2.5" height="8" stroke="currentColor" stroke-width="1.2"/>
              </svg>
              Even Split
            </button>
            <button type="button" class="toolbar-btn toolbar-btn--bell" data-action="quick-fill" data-garment-id="${garment.id}" data-colorway-id="${lastColorway.id}" data-preset="bell" title="Bell Curve - XS:10%, S:20%, M:30%, L:25%, XL:10%, XXL:5%">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="7" width="2" height="6" stroke="currentColor" stroke-width="1.2"/>
                <rect x="4" y="3" width="2" height="10" stroke="currentColor" stroke-width="1.2"/>
                <rect x="7" y="1" width="2" height="12" stroke="currentColor" stroke-width="1.2"/>
                <rect x="10" y="3" width="2" height="10" stroke="currentColor" stroke-width="1.2"/>
              </svg>
              Bell Curve
            </button>
            <button type="button" class="toolbar-btn toolbar-btn--popular" data-action="quick-fill" data-garment-id="${garment.id}" data-colorway-id="${lastColorway.id}" data-preset="popular" title="Popular - XS:5%, S:30%, M:35%, L:25%, XL:5%, XXL:0%">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="11" width="2" height="2" stroke="currentColor" stroke-width="1.2"/>
                <rect x="4" y="3" width="2" height="10" stroke="currentColor" stroke-width="1.2"/>
                <rect x="7" y="1" width="2" height="12" stroke="currentColor" stroke-width="1.2"/>
                <rect x="10" y="5" width="2" height="8" stroke="currentColor" stroke-width="1.2"/>
              </svg>
              Popular
            </button>
            <div class="floating-toolbar__divider"></div>
            <button type="button" class="toolbar-btn toolbar-btn--load" data-action="load-preset" data-garment-id="${garment.id}" data-colorway-id="${lastColorway.id}" title="Load Preset - Apply saved size distribution">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M13 7L7 1M7 1L1 7M7 1v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Load Preset
            </button>
            <button type="button" class="toolbar-btn toolbar-btn--save" data-action="save-preset" data-garment-id="${garment.id}" data-colorway-id="${lastColorway.id}" title="Save Preset - Save current size distribution for reuse">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M11 13H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6l3 3v8a1 1 0 0 1-1 1z" stroke="currentColor" stroke-width="1.2"/>
                <path d="M9 13v-5H5v5" stroke="currentColor" stroke-width="1.2"/>
              </svg>
              Save Preset
            </button>
          </div>
        </div>
      ` : '';

      // Empty state or colorways
      const colorwaySection = !hasColorways
        ? `<div class="garment-color-card__empty-state">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
               <circle cx="12" cy="12" r="10" stroke="#D1D5DB" stroke-width="2"/>
               <path d="M12 8v4M12 16h.01" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round"/>
             </svg>
             <p>Click a button above to add a color</p>
           </div>`
        : `<div class="colorway-inline-container">${colorwayHTML}</div>`;

      return `
        <div class="garment-color-card ${garmentStateClass}" data-garment-id="${garment.id}">
          <div class="garment-color-card__main">
            <div class="garment-color-card__image-wrapper">
              <div class="garment-color-card__number">#${garment.number}</div>
              <img src="${imageUrl}" alt="${garment.type}" class="garment-color-card__image" loading="lazy">
            </div>

            <div class="garment-color-card__content">
              <div class="garment-color-card__header">
                <div class="garment-color-card__info">
                  <h4 class="garment-color-card__type">${garment.type}</h4>
                  <p class="garment-color-card__fabric">${garment.fabricType}</p>
                </div>
                <div class="garment-color-card__header-actions">
                  <button type="button" class="garment-icon-btn" data-action="edit-garment" data-garment-id="${garment.id}" title="Edit Garment">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M11.333 2A1.886 1.886 0 0 1 14 4.667l-9 9-3.667 1 1-3.667 9-9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button type="button" class="garment-icon-btn garment-icon-btn--danger" data-action="delete-garment" data-garment-id="${garment.id}" title="Delete Garment">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="garment-color-card__buttons">
                <button type="button" class="color-option-btn color-option-btn--stock" data-action="expand-stock-colors" data-garment-id="${garment.id}">
                  <svg class="color-option-btn__icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 10L8 13L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="color-option-btn__text">Stock Colors</span>
                  <span class="color-option-btn__badge">2-4 weeks</span>
                </button>
                <button type="button" class="color-option-btn color-option-btn--pantone ${COTTON_FABRICS.includes(garment.fabricType) ? '' : 'color-option-btn--disabled'}" data-action="add-pantone-color" data-garment-id="${garment.id}" ${COTTON_FABRICS.includes(garment.fabricType) ? '' : 'disabled'}>
                  <svg class="color-option-btn__icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="7" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                    <circle cx="13" cy="13" r="4" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <span class="color-option-btn__text">Pantone Custom</span>
                  <span class="color-option-btn__badge">4-6 weeks</span>
                  ${!COTTON_FABRICS.includes(garment.fabricType) ? '<div class="color-option-btn__tooltip">🔒 Pantone Custom Colors Only Available for 100% Cotton</div>' : ''}
                </button>
                <button type="button" class="color-option-btn color-option-btn--techpack" data-action="expand-techpack-reference" data-garment-id="${garment.id}">
                  <svg class="color-option-btn__icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 3h8l2 2v12H5V3z" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 8h5M8 11h5M8 14h3" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <span class="color-option-btn__text">Match TechPack Colors</span>
                  <span class="color-option-btn__badge">2-6 weeks</span>
                </button>
              </div>

              <div class="garment-color-card__expansion" id="expansion-${garment.id}" style="display: none;"></div>

              ${colorwaySection}

              ${toolbarHTML}
            </div>
          </div>
        </div>
      `;
    },


    /**
     * Render Bulk Color Cart
     */
    renderLabDipCart: function() {
      const container = document.getElementById('labDipCartItems');
      const emptyState = document.getElementById('labDipCartEmpty');
      const totalEl = document.getElementById('labDipTotal');
      const badge = document.getElementById('labDipCartBadge');
      const headerBrowseBtn = document.getElementById('labDipHeaderBrowseBtn');

      if (!container) return;

      const hasItems = this.labDipCart.length > 0;

      // Update badge count (show when cart has items)
      if (badge) {
        if (hasItems) {
          badge.textContent = this.labDipCart.length;
          badge.style.display = 'inline-block';
        } else {
          badge.style.display = 'none';
        }
      }

      // Show header browse button ONLY when cart has items
      if (headerBrowseBtn) {
        headerBrowseBtn.style.display = hasItems ? 'flex' : 'none';
      }

      // Show/hide empty state
      if (emptyState) emptyState.style.display = hasItems ? 'none' : 'flex';
      if (container) container.style.display = hasItems ? 'block' : 'none';

      // Update cart count (no pricing for Bulk Color Cart)
      const bulkCountEl = document.getElementById('bulkCartCount');
      if (bulkCountEl) {
        bulkCountEl.textContent = hasItems ? `${this.labDipCart.length} color${this.labDipCart.length !== 1 ? 's' : ''}` : '0 colors';
      }

      if (hasItems) {
        container.innerHTML = this.labDipCart.map(item => this.renderLabDipItem(item)).join('');
      }

      // Save to localStorage
      localStorage.setItem('techpack_v11_bulk_labdip_cart', JSON.stringify(this.labDipCart));
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
        <div class="lab-dip-cart-item" draggable="true" data-lab-dip-id="${item.id}" ${item.washTechnique && item.washTechnique !== 'none' ? `data-wash-technique="${item.washTechnique}"` : ''}>
          <div class="lab-dip-cart-item__drag-handle">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <circle cx="3" cy="3" r="1" fill="currentColor"/>
              <circle cx="9" cy="3" r="1" fill="currentColor"/>
              <circle cx="3" cy="6" r="1" fill="currentColor"/>
              <circle cx="9" cy="6" r="1" fill="currentColor"/>
              <circle cx="3" cy="9" r="1" fill="currentColor"/>
              <circle cx="9" cy="9" r="1" fill="currentColor"/>
            </svg>
          </div>
          <div class="lab-dip-cart-item__swatch" style="background-color: ${item.hex};"></div>
          <div class="lab-dip-cart-item__info">
            <p class="lab-dip-cart-item__name">${item.name}</p>
            <p class="lab-dip-cart-item__code">${item.code}</p>
            ${washBadge}
          </div>
          <button type="button" class="lab-dip-cart-item__remove" data-action="remove-lab-dip" data-lab-dip-id="${item.id}">
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
     * Calculate Total MOQ Based on Garment Types and Colorway Counts
     * Business Rules:
     * - High-end (Hoodie, Zip Hoodie, Sweatshirt, Sweatpants, Shorts): 75 single / 50 multiple
     * - Standard (T-Shirt, Polo, etc.): 100 single / 75 multiple
     * - Each garment's MOQ depends on its type and number of colorways
     */
    calculateTotalMOQ: function() {
      if (this.garments.length === 0) {
        return MOQ_CONFIG.global; // Default to 75 if no garments
      }

      let totalMOQ = 0;

      this.garments.forEach(garment => {
        const garmentType = garment.type;
        const colorwayCount = garment.colorways ? garment.colorways.length : 0;

        // Get MOQ config for this garment type (fallback to default)
        const moqConfig = MOQ_CONFIG.perGarment[garmentType] || MOQ_CONFIG.perGarment['default'];

        // Determine MOQ: single colorway uses 'single', 2+ colorways uses 'multiple'
        const garmentMOQ = colorwayCount <= 1 ? moqConfig.single : moqConfig.multiple;

        // Add to total (only count garments with colorways)
        if (colorwayCount > 0) {
          totalMOQ += garmentMOQ;
        }
      });

      // Return calculated MOQ or global minimum (whichever is higher)
      return Math.max(totalMOQ, MOQ_CONFIG.global);
    },

    /**
     * Update MOQ Progress Bar
     */
    updateMOQProgress: function() {
      // Calculate current order total
      const totalQuantity = this.garments.reduce((sum, g) => {
        if (!g.colorways || g.colorways.length === 0) return sum;
        // Sum all colorways for this garment
        const garmentTotal = g.colorways.reduce((colorwaySum, colorway) => {
          return colorwaySum + this.calculateColorwayTotal(colorway);
        }, 0);
        return sum + garmentTotal;
      }, 0);

      // Calculate dynamic MOQ based on garment types and colorway counts
      const targetMOQ = this.calculateTotalMOQ();

      // Calculate progress percentage
      const progress = Math.min((totalQuantity / targetMOQ) * 100, 100);
      const percentText = progress >= 100 ? `${Math.round((totalQuantity / targetMOQ) * 100)}%` : `${Math.round(progress)}%`;

      // Get DOM elements
      const fillEl = document.getElementById('moqProgressFill');
      const currentEl = document.getElementById('moqCurrent');
      const targetEl = document.getElementById('moqTarget');
      const messageEl = document.getElementById('moqMessage');

      // Update progress bar fill with !important override
      if (fillEl) {
        fillEl.style.width = `${progress}%`;
        fillEl.style.backgroundColor = progress >= 100 ? '#10b981' : '#3b82f6';
      }

      // Update current quantity
      if (currentEl) currentEl.textContent = `${totalQuantity} pcs`;

      // Update target MOQ (dynamic)
      if (targetEl) targetEl.textContent = `${targetMOQ} pcs minimum`;

      // Update message
      if (messageEl) {
        if (totalQuantity === 0) {
          messageEl.textContent = `Add colorways to reach the ${targetMOQ}-piece minimum order quantity`;
          messageEl.style.color = '#6b7280';
        } else if (totalQuantity < targetMOQ) {
          const remaining = targetMOQ - totalQuantity;
          messageEl.textContent = `${remaining} more pieces needed to reach minimum (${percentText})`;
          messageEl.style.color = '#f59e0b';
        } else {
          messageEl.textContent = `✓ Minimum reached! (${percentText})`;
          messageEl.style.color = '#10b981';
        }
      }

      // Console log for debugging (user requested)
      console.log('[MOQ Progress] Debug Info:', {
        totalQuantity: totalQuantity,
        targetMOQ: targetMOQ,
        progress: `${Math.round(progress)}%`,
        garments: this.garments.map(g => ({
          type: g.type,
          colorwayCount: g.colorways ? g.colorways.length : 0,
          moqConfig: MOQ_CONFIG.perGarment[g.type] || MOQ_CONFIG.perGarment['default'],
          totalPieces: g.colorways ? g.colorways.reduce((sum, c) => sum + this.calculateColorwayTotal(c), 0) : 0
        }))
      });
    },

    /**
     * Update Order Summary - Clean grid layout matching Step 3 design
     */
    updateOrderSummary: function() {
      const container = document.getElementById('orderSummaryContent');
      if (!container) return;

      // Calculate garment summaries
      const garmentSummaries = [];
      let totalPieces = 0;

      this.garments.forEach(garment => {
        if (!garment.colorways || garment.colorways.length === 0) return;

        // Calculate total from all colorways for this garment
        const garmentTotal = garment.colorways.reduce((sum, colorway) => {
          return sum + this.calculateColorwayTotal(colorway);
        }, 0);
        totalPieces += garmentTotal;

        // Collect all color swatches
        const colors = garment.colorways.map(colorway => ({
          hex: colorway.hex,
          name: colorway.color
        }));

        garmentSummaries.push({
          type: garment.type,
          fabric: garment.fabricType,
          colors: colors,
          total: garmentTotal
        });
      });

      if (garmentSummaries.length === 0) {
        container.innerHTML = `
          <div class="order-summary-empty">
            <p>Add colorways to see your order summary</p>
          </div>
        `;
        return;
      }

      // Render clean grid layout (no action buttons)
      container.innerHTML = `
        <div class="order-summary-container">
          ${garmentSummaries.map(garment => `
            <div class="order-summary-item">
              <div class="order-summary-item__content">
                <div class="order-summary-item__info">
                  <h4 class="order-summary-item__garment">${garment.type}</h4>
                  <span class="order-summary-item__fabric">${garment.fabric}</span>
                </div>
                <div class="order-summary-item__colors">
                  ${garment.colors.map(color => `
                    <div class="order-summary-item__color-circle"
                         style="background-color: ${color.hex};"
                         title="${color.name}"></div>
                  `).join('')}
                </div>
              </div>
              <div class="order-summary-item__quantity">${garment.total} pcs</div>
            </div>
          `).join('')}
        </div>
        <div class="order-summary-total">
          <span class="order-summary-total__label">Total Pieces</span>
          <span class="order-summary-total__value">${totalPieces} pcs</span>
        </div>
      `;
    },

    /**
     * STEP 1: Start adding colorway - Show Stock Colors Modal
     */

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



    /* DELETED: All modal-related functions removed (lines 1093-1591)
       - showQuantityModal, continueToSizes, closeQuantityModal
       - showSizeDistributionModal, getAvailableSizes, updateSizeTotal
       - quickFillEven, quickFillTypical
       - skipSizeDistribution, confirmSizeDistribution, closeSizeDistributionModal
       - showCopyColorwayModal, skipCopyColorway, confirmCopyColorway, closeCopyColorwayModal
       - finishAddingColorway, finishEditingColorway
       Modals replaced by inline colorway system. */


    /**
     * Setup drag & drop from lab dip cart to garments
     */
    setupLabDipDragDrop: function() {
      const self = this;

      // Drag start on cart items
      document.addEventListener('dragstart', function(e) {
        const cartItem = e.target.closest('.lab-dip-cart-item');
        if (cartItem) {
          const labDipId = cartItem.getAttribute('data-lab-dip-id');
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
     * Assign color from Bulk Color Cart to garment (color stays in cart for reuse)
     */
    assignLabDipToGarment: function(labDipId, garmentId) {
      // Find color in Bulk Color Cart
      const labDip = this.labDipCart.find(dip => dip.id === labDipId);
      if (!labDip) {
        console.warn('[BulkStep4] Color not found in Bulk Color Cart:', labDipId);
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

      // Keep color in cart (reusable for Bulk flow)
      // No removal - colors stay in Bulk Color Cart for assignment to multiple garments

      // Directly add colorway to garment (inline system, no modals)
      this.addColorwayToGarment(garmentId, {
        colorType: 'pantone',
        color: labDip.name,
        hex: labDip.hex,
        pantoneColor: {
          code: labDip.code,
          name: labDip.name,
          hex: labDip.hex,
          washTechnique: labDip.washTechnique || 'none'
        }
      });

      console.log('[BulkStep4] Color assigned from Bulk Color Cart to garment (color stays in cart):', labDip.name);
    },

    /**
     * Update state and render (NO auto-save)
     */
    saveAndRender: function() {
      if (window.TechPackV11.State) {
        window.TechPackV11.State.formData.garments = this.garments;
      }

      this.render();
      this.updateMOQProgress();
      this.updateOrderSummary();
      this.updateContinueButton();
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
        if (garment.colorway) {
          totalColorways += 1;
        }
      });

      if (totalColorways === 0) {
        console.log('[BulkStep4] No colorways added yet');
        return false;
      }

      // Calculate total quantity across all colorways
      let totalQuantity = 0;
      garments.forEach(garment => {
        if (garment.colorway && garment.colorway.sizes) {
          Object.values(garment.colorway.sizes).forEach(qty => {
            totalQuantity += parseInt(qty) || 0;
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
