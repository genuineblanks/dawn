/**
 * TechPack V11 - Sample Step 3B JavaScript
 *
 * Handles color assignment to garments with fabric-based logic:
 * - Stock Colors: Available for all fabrics (inline expansion)
 * - Pantone Custom: 100% Cotton only (90vw × 85vh modal)
 * - TechPack Reference: All fabrics, different messaging based on fabric type
 *
 * Features:
 * - Lab Dip Cart management
 * - Fabric type detection and button availability
 * - Inline expansions for Stock and TechPack
 * - Large modal for Pantone Studio
 */

(function() {
  'use strict';

  // Step 3B Module
  window.TechPackV11 = window.TechPackV11 || {};

  window.TechPackV11.Step3B = {
    garments: [],
    labDipCart: [],
    currentExpandedGarment: null,
    pantoneColors: [],

    /**
     * Initialize Step 3B
     */
    init: function() {
      console.log('[Step3B] Initializing color assignment step');

      // Load garments from Step 3A
      this.loadGarmentsFromState();

      // Load lab dip cart from localStorage
      this.loadLabDipCart();

      // Load Pantone colors
      this.loadPantoneData();

      // Render garment list
      this.renderGarmentList();

      // Render lab dip cart
      this.renderLabDipCart();

      // Setup drag & drop from cart to garments
      this.setupCartDragDrop();

      // Update navigation button state
      this.updateNavigationState();
    },

    /**
     * Load garments from State (with retry for timing issues)
     */
    loadGarmentsFromState: function() {
      console.log('[Step3B] Loading garments from State...');

      if (!window.TechPackV11 || !window.TechPackV11.State) {
        console.error('[Step3B] TechPackV11.State not found!');
        return;
      }

      const state = window.TechPackV11.State;
      console.log('[Step3B] State object:', state);
      console.log('[Step3B] State.formData:', state.formData);
      console.log('[Step3B] State.formData.garments:', state.formData.garments);

      if (state.formData && Array.isArray(state.formData.garments)) {
        // Create a NEW array reference to avoid mutation issues
        this.garments = [...state.formData.garments];
        console.log('[Step3B] ✅ Loaded garments from State:', this.garments.length, 'garments');
        console.log('[Step3B] Garment details:', this.garments);
      } else {
        console.warn('[Step3B] ❌ No garments array found in State!');
        this.garments = [];
      }
    },

    /**
     * Render garment list with color assignment buttons
     */
    renderGarmentList: function() {
      const container = document.getElementById('garmentColorList');
      if (!container) return;

      if (this.garments.length === 0) {
        container.innerHTML = '<p class="no-garments">No garments to assign colors. Go back to Step 3A.</p>';
        return;
      }

      container.innerHTML = this.garments.map(garment => this.renderGarmentCard(garment)).join('');
    },

    /**
     * Render individual garment card with 3 color buttons
     */
    renderGarmentCard: function(garment) {
      const isCotton = this.isCottonFabric(garment.fabricType);
      const isPantoneDisabled = !isCotton;

      // Check if color is already assigned
      if (garment.colorAssigned) {
        return this.renderAssignedGarmentCard(garment);
      }

      // Garment images mapping
      const garmentImages = {
        'Zip Hoodie': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/ZIP-UP_HOODIE.jpg?v=1762324253',
        'Hoodie': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/HOODIE.jpg?v=1762324252',
        'Sweatshirt': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/SWEATSHIRT.jpg?v=1762324252',
        'T-Shirt': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/TSHIRT.jpg?v=1762324252',
        'Long Sleeve': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/LONGSLEEVE.jpg?v=1762324252',
        'Sweatpants': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/SWEATPANTS.jpg?v=1762324252',
        'Tank Top': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/TANKTOP.jpg?v=1762324252',
        'Shirt': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/SHIRT.jpg?v=1762324253',
        'Polo Shirt': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/POLO_SHIRT.jpg?v=1762324559',
        'Shorts': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/SHORTS.jpg?v=1762324252',
        'Other': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/OTHERS.jpg?v=1762324710'
      };
      const imageUrl = garmentImages[garment.type] || garmentImages['Other'];

      return `
        <div class="garment-color-card" data-garment-id="${garment.id}" data-fabric="${garment.fabricType}">
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
                ${this.renderStockButton(garment.id)}
                ${this.renderPantoneButton(garment.id, isPantoneDisabled)}
                ${this.renderTechPackButton(garment.id, isCotton)}
              </div>

              <div class="garment-color-card__expansion" id="expansion-${garment.id}" style="display: none;">
                {%- comment -%} Populated by JavaScript when button clicked {%- endcomment -%}
              </div>

              <div class="garment-color-card__status">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="#F59E0B" stroke-width="1.5" fill="none"/>
                  <path d="M8 5V8L10 10" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span>Needs Color</span>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    /**
     * Render Stock Colors button
     */
    renderStockButton: function(garmentId) {
      return `
        <button type="button" class="color-option-btn color-option-btn--stock" data-action="expand-stock-colors" data-garment-id="${garmentId}">
          <svg class="color-option-btn__icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 10L8 13L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="color-option-btn__text">Stock Colors</span>
          <span class="color-option-btn__badge">2-4 weeks</span>
        </button>
      `;
    },

    /**
     * Render Pantone Custom button (disabled for non-cotton)
     */
    renderPantoneButton: function(garmentId, isDisabled) {
      if (isDisabled) {
        return `
          <button type="button" class="color-option-btn color-option-btn--pantone color-option-btn--disabled" disabled data-garment-id="${garmentId}">
            <svg class="color-option-btn__icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L12 6L14 2" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <span class="color-option-btn__text">Pantone Custom</span>
            <span class="color-option-btn__badge">4-6 weeks</span>
            <div class="color-option-btn__tooltip">
              🔒 Pantone Custom Colors Only Available for 100% Cotton<br><br>
              For this fabric type, use:<br>
              • Stock Colors for standard options<br>
              • "I Have a TechPack" for custom colors<br>
              &nbsp;&nbsp;(we'll match as close as possible)
            </div>
          </button>
        `;
      }

      return `
        <button type="button" class="color-option-btn color-option-btn--pantone" data-action="open-pantone-modal" data-garment-id="${garmentId}">
          <svg class="color-option-btn__icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="7" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="13" cy="13" r="4" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <span class="color-option-btn__text">Pantone Custom</span>
          <span class="color-option-btn__badge">4-6 weeks</span>
          <div class="color-option-btn__info-tooltip">
            💡 Browse Pantone colors and add to Lab Dip Cart. Lab dips cost €25.00 per swatch.
          </div>
        </button>
      `;
    },

    /**
     * Render TechPack Reference button
     */
    renderTechPackButton: function(garmentId, isCotton) {
      return `
        <button type="button" class="color-option-btn color-option-btn--techpack" data-action="expand-techpack-reference" data-garment-id="${garmentId}" data-is-cotton="${isCotton}">
          <svg class="color-option-btn__icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 3H14L16 5V17H6V3Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M9 8H13M9 11H13M9 14H11" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <span class="color-option-btn__text">I Have a TechPack</span>
          <span class="color-option-btn__badge">4-6 weeks</span>
        </button>
      `;
    },

    /**
     * Render assigned garment card (with color)
     */
    renderAssignedGarmentCard: function(garment) {
      // Garment images mapping
      const garmentImages = {
        'Zip Hoodie': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/ZIP-UP_HOODIE.jpg?v=1762324253',
        'Hoodie': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/HOODIE.jpg?v=1762324252',
        'Sweatshirt': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/SWEATSHIRT.jpg?v=1762324252',
        'T-Shirt': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/TSHIRT.jpg?v=1762324252',
        'Long Sleeve': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/LONGSLEEVE.jpg?v=1762324252',
        'Sweatpants': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/SWEATPANTS.jpg?v=1762324252',
        'Tank Top': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/TANKTOP.jpg?v=1762324252',
        'Shirt': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/SHIRT.jpg?v=1762324253',
        'Polo Shirt': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/POLO_SHIRT.jpg?v=1762324559',
        'Shorts': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/SHORTS.jpg?v=1762324252',
        'Other': 'https://cdn.shopify.com/s/files/1/0936/4376/8132/files/OTHERS.jpg?v=1762324710'
      };
      const imageUrl = garmentImages[garment.type] || garmentImages['Other'];

      // Build color display based on type
      let colorName = '';
      let colorCode = '';
      let colorHex = '';
      let colorTypeLabel = '';

      if (garment.colorType === 'stock') {
        colorName = garment.color;
        colorHex = garment.hex;
        colorTypeLabel = 'Stock · 2-4 weeks';
      } else if (garment.colorType === 'pantone') {
        colorName = garment.pantoneColor ? garment.pantoneColor.name : garment.color;
        colorCode = garment.pantoneColor ? garment.pantoneColor.code : garment.pantone;
        colorHex = garment.pantoneColor ? garment.pantoneColor.hex : garment.hex;
        colorTypeLabel = 'Custom · 4-6 weeks';
      } else if (garment.colorType === 'techpack') {
        colorName = garment.color;
        colorHex = garment.hex;
        colorTypeLabel = 'TechPack Reference';
      }

      return `
        <div class="garment-color-card garment-color-card--assigned" data-garment-id="${garment.id}">
          <div class="garment-color-card__main">
            <div class="garment-color-card__image-wrapper">
              <div class="garment-color-card__number">#${garment.number}</div>
              <img src="${imageUrl}" alt="${garment.type}" class="garment-color-card__image" loading="lazy">
              <div class="garment-color-card__checkmark">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" fill="#10B981"/>
                  <path d="M6 10L9 13L14 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
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

              <div class="garment-color-card__color-display">
                <div class="assigned-color-inline">
                  <div class="assigned-color-inline__swatch" style="background-color: ${colorHex};"></div>
                  <div class="assigned-color-inline__info">
                    <span class="assigned-color-inline__name">${colorName}</span>
                    ${colorCode ? `<span class="assigned-color-inline__code">${colorCode}</span>` : ''}
                    <span class="assigned-color-inline__type">(${colorTypeLabel})</span>
                  </div>
                </div>
                ${garment.colorType === 'pantone' ? `
                  <button type="button" class="garment-color-btn" data-action="return-to-labdip-cart" data-garment-id="${garment.id}">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" transform="rotate(180 7 7)"/>
                    </svg>
                    Return to Cart
                  </button>
                ` : `
                  <button type="button" class="garment-color-btn" data-action="edit-garment-color" data-garment-id="${garment.id}">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M9.917 1.75a1.65 1.65 0 0 1 2.333 2.333l-7.875 7.875-3.208.875.875-3.208 7.875-7.875Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Edit Color
                  </button>
                `}
              </div>
            </div>
          </div>
        </div>
      `;
    },

    /**
     * Expand Stock Colors (inline)
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
    expandTechPackReference: function(garmentId, isCotton) {
      this.collapseAllExpansions();

      const expansion = document.getElementById(`expansion-${garmentId}`);
      if (!expansion) return;

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

      expansion.innerHTML = `
        <div class="techpack-expansion">
          <h4 class="expansion-title">${title}</h4>
          <p class="expansion-description">${description}</p>

          <label for="techpackColorPicker-${garmentId}" class="expansion-label">
            Select ${isCotton ? 'an approximate' : 'your desired'} color ${isCotton ? 'for visual' : ''} reference:
          </label>
          <input type="color" id="techpackColorPicker-${garmentId}" class="techpack-color-picker" value="#FF0000" />

          <label for="techpackColorName-${garmentId}" class="expansion-label">Color Name:</label>
          <input type="text" id="techpackColorName-${garmentId}" class="techpack-color-name" placeholder="e.g., Red, Navy Blue" />

          <div class="expansion-note">
            ℹ️ ${noteText}
          </div>

          <div class="expansion-actions">
            <button type="button" class="expansion-cancel-btn" data-action="cancel-expansion" data-garment-id="${garmentId}">
              Cancel
            </button>
            <button type="button" class="expansion-submit-btn" data-action="assign-techpack-reference" data-garment-id="${garmentId}">
              ${isCotton ? 'Use My TechPack' : 'Use Color Reference'} →
            </button>
          </div>
        </div>
      `;

      expansion.style.display = 'block';
      this.currentExpandedGarment = garmentId;
    },

    /**
     * Assign Stock Color
     */
    assignStockColor: function(garmentId, colorName, colorHex) {
      const garment = this.garments.find(g => g.id === garmentId);
      if (!garment) return;

      garment.colorAssigned = true;
      garment.colorType = 'stock';
      garment.color = colorName;
      garment.hex = colorHex;
      garment.sampleType = 'stock';

      this.collapseAllExpansions();
      this.saveAndRender();
      console.log('[Step3B] Assigned stock color:', colorName, 'to garment', garmentId);
    },

    /**
     * Assign TechPack Reference Color
     */
    assignTechPackReference: function(garmentId) {
      const garment = this.garments.find(g => g.id === garmentId);
      if (!garment) return;

      const colorPicker = document.getElementById(`techpackColorPicker-${garmentId}`);
      const colorName = document.getElementById(`techpackColorName-${garmentId}`);

      if (!colorPicker || !colorName) return;

      const hex = colorPicker.value;
      const name = colorName.value.trim();

      if (!name) {
        alert('Please enter a color name');
        return;
      }

      garment.colorAssigned = true;
      garment.colorType = 'techpack';
      garment.color = name;
      garment.hex = hex;
      garment.sampleType = 'techpack';

      this.collapseAllExpansions();
      this.saveAndRender();
      console.log('[Step3B] Assigned TechPack reference:', name, hex, 'to garment', garmentId);
    },

    /**
     * Collapse all expansions
     */
    collapseAllExpansions: function() {
      document.querySelectorAll('.garment-color-card__expansion').forEach(el => {
        el.style.display = 'none';
        el.innerHTML = '';
      });
      this.currentExpandedGarment = null;
    },

    /**
     * Cancel expansion
     */
    cancelExpansion: function(garmentId) {
      const expansion = document.getElementById(`expansion-${garmentId}`);
      if (expansion) {
        expansion.style.display = 'none';
        expansion.innerHTML = '';
      }
      this.currentExpandedGarment = null;
    },

    /**
     * Check if fabric is 100% Cotton
     */
    isCottonFabric: function(fabricType) {
      return fabricType.toLowerCase().includes('100%') &&
             fabricType.toLowerCase().includes('cotton');
    },

    /**
     * Load Pantone data
     */
    loadPantoneData: async function() {
      try {
        const pantoneUrl = window.TECHPACK_V11_PANTONE_URL || '/assets/pantone-colors.json';
        const response = await fetch(pantoneUrl);
        this.pantoneColors = await response.json();
        console.log('[Step3B] Pantone colors loaded:', this.pantoneColors.length);
      } catch (error) {
        console.error('[Step3B] Failed to load Pantone colors:', error);
      }
    },

    /**
     * Load Lab Dip Cart from localStorage
     */
    loadLabDipCart: function() {
      try {
        const saved = localStorage.getItem('techpack_v11_labdip_cart');
        if (saved) {
          this.labDipCart = JSON.parse(saved);
        }
      } catch (error) {
        console.error('[Step3B] Failed to load lab dip cart:', error);
      }
    },

    /**
     * Save Lab Dip Cart to localStorage
     */
    saveLabDipCart: function() {
      try {
        localStorage.setItem('techpack_v11_labdip_cart', JSON.stringify(this.labDipCart));
      } catch (error) {
        console.error('[Step3B] Failed to save lab dip cart:', error);
      }
    },

    /**
     * Render Lab Dip Cart sidebar
     */
    renderLabDipCart: function() {
      const emptyState = document.getElementById('labDipCartEmpty');
      const instructionsEl = document.getElementById('labDipCartInstructions');
      const itemsContainer = document.getElementById('labDipCartItems');
      const totalEl = document.getElementById('labDipCartTotal');
      const badge = document.getElementById('labDipCartBadge'); // UX Improvement #1

      if (!itemsContainer) return;

      const hasItems = this.labDipCart.length > 0;

      // Update badge count (UX Improvement #1: Cart Count on Browse Button)
      if (badge) {
        if (hasItems) {
          badge.textContent = this.labDipCart.length;
          badge.style.display = 'inline-block';
        } else {
          badge.style.display = 'none';
        }
      }

      // Show/hide empty state and instructions
      if (emptyState) emptyState.style.display = hasItems ? 'none' : 'flex';
      if (instructionsEl) instructionsEl.style.display = hasItems ? 'block' : 'none';
      itemsContainer.style.display = hasItems ? 'block' : 'none';

      if (hasItems) {
        // Render cart items
        itemsContainer.innerHTML = this.labDipCart.map(item => this.renderLabDipCartItem(item)).join('');

        // Update total
        const total = (this.labDipCart.length * 25.00).toFixed(2);
        if (totalEl) {
          totalEl.textContent = `Total: €${total}`;
        }
      } else {
        if (totalEl) totalEl.textContent = 'Total: €0.00';
      }

      console.log('[Step3B] Rendered cart:', this.labDipCart.length, 'items');
    },

    /**
     * Render individual lab dip cart item (simplified - unassigned swatches only)
     */
    renderLabDipCartItem: function(item) {
      return `
        <div
          class="lab-dip-cart-item"
          draggable="true"
          data-lab-dip-id="${item.id}"
        >
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
          </div>
          <p class="lab-dip-cart-item__price">€${item.price.toFixed(2)}</p>
          <button
            type="button"
            class="lab-dip-cart-item__remove"
            data-action="remove-cart-labdip"
            data-id="${item.id}"
            title="Remove from cart"
          >×</button>
        </div>
      `;
    },

    /**
     * Get garment number by ID
     */
    getGarmentNumber: function(garmentId) {
      const garment = this.garments.find(g => g.id === garmentId);
      return garment ? garment.number : '?';
    },

    /**
     * Update navigation button state
     */
    updateNavigationState: function() {
      const continueBtn = document.getElementById('continueToReview');
      if (!continueBtn) return;

      const allAssigned = this.garments.every(g => g.colorAssigned);

      continueBtn.disabled = !allAssigned;

      if (!allAssigned) {
        continueBtn.classList.add('button-disabled');
        continueBtn.title = 'Please assign colors to all garments before continuing';
      } else {
        continueBtn.classList.remove('button-disabled');
        continueBtn.title = '';
      }
    },

    /**
     * Save to localStorage (garments + cart)
     */
    saveToStorage: function() {
      // Save garments to State
      if (window.TechPackV11.State) {
        window.TechPackV11.State.formData.garments = this.garments;
        window.TechPackV11.State.saveToStorage();
      }

      // Save cart separately
      this.saveLabDipCart();
    },

    /**
     * Remove from cart (UX Improvement #2)
     */
    removeFromCart: function(labDipId) {
      this.labDipCart = this.labDipCart.filter(dip => dip.id !== labDipId);
      this.saveLabDipCart();
      this.renderLabDipCart();

      // If modal is open, update its preview too
      if (window.TechPackV11.ColorStudio && window.TechPackV11.ColorStudio.isOpen) {
        window.TechPackV11.ColorStudio.renderCartPreview();
      }

      console.log('[Step3B] Removed from cart:', labDipId);
    },

    /**
     * Setup drag & drop from cart to garments
     */
    setupCartDragDrop: function() {
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

      console.log('[Step3B] Drag & drop setup complete');
    },

    /**
     * Assign lab dip to garment (removes from cart)
     */
    assignLabDipToGarment: function(labDipId, garmentId) {
      // Find lab dip
      const labDip = this.labDipCart.find(dip => dip.id === labDipId);
      if (!labDip) {
        console.warn('[Step3B] Lab dip not found:', labDipId);
        return;
      }

      // Find garment
      const garment = this.garments.find(g => g.id === garmentId);
      if (!garment) {
        console.warn('[Step3B] Garment not found:', garmentId);
        return;
      }

      // Check if garment is 100% cotton
      if (!this.isCottonFabric(garment.fabricType)) {
        alert('Pantone colors can only be assigned to 100% Cotton garments');
        return;
      }

      // If garment already has a Pantone color, return it to the lab dip cart
      if (garment.colorType === 'pantone' && garment.pantoneColor) {
        const oldLabDip = {
          id: garment.pantoneColor.labDipId || ('labdip-' + Date.now()),
          code: garment.pantoneColor.code,
          name: garment.pantoneColor.name,
          hex: garment.pantoneColor.hex,
          price: garment.pantoneColor.price || 25.00
        };
        this.labDipCart.push(oldLabDip);
        console.log('[Step3B] Returned old Pantone to cart:', oldLabDip);
      }

      // Assign to garment
      garment.colorType = 'pantone';
      garment.sampleType = 'pantone';  // Required for renderGarmentCard display
      garment.pantoneColor = {
        labDipId: labDip.id,  // Store original lab dip ID for tracking
        code: labDip.code,
        name: labDip.name,
        hex: labDip.hex,
        price: labDip.price
      };
      garment.colorAssigned = true;

      // Remove from cart
      this.labDipCart = this.labDipCart.filter(dip => dip.id !== labDipId);

      // Save and re-render
      this.saveToStorage();
      this.renderLabDipCart();
      this.renderGarmentList();
      this.updateNavigationState();

      console.log('[Step3B] Assigned lab dip to garment:', labDip, '→', garment);
    },

    /**
     * Save and render
     */
    saveAndRender: function() {
      this.saveToStorage();
      this.renderGarmentList();
      this.updateNavigationState();
    }
  };

  // Initialize when DOM AND State are ready
  function initWhenReady() {
    const element = document.getElementById('sampleStep3B');
    if (!element) return; // Not on Step 3B page

    // Check if State is initialized with data
    const isStateReady = window.TechPackV11 &&
                         window.TechPackV11.State &&
                         window.TechPackV11.State.currentFlow !== null;

    if (isStateReady) {
      console.log('[Step3B] State is ready, initializing now...');
      window.TechPackV11.Step3B.init();
    } else {
      console.log('[Step3B] Waiting for State to initialize...');
      // State not ready yet, retry in 50ms
      setTimeout(initWhenReady, 50);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhenReady);
  } else {
    initWhenReady();
  }

})();
