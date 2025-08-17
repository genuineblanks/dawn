/* V10 TechPack Studios - Advanced Studio Management System */
/* Complete rewrite with studio-based architecture */

// ==============================================
// GLOBAL CONFIGURATION
// ==============================================

// Prevent multiple script loading
if (typeof window.V10_CONFIG !== 'undefined') {
  console.log('V10 TechPack Studios already loaded, skipping initialization');
} else {

const V10_CONFIG = {
  // Fabric Type Mapping (from original system)
  FABRIC_TYPE_MAPPING: {
    'Zip-Up Hoodie': [
      'Brushed Fleece 100% Organic Cotton',
      'French Terry 100% Organic Cotton',
      '80% Cotton 20% Polyester Blend',
      '70% Cotton 30% Polyester Blend',
      '50% Cotton 50% Polyester Blend',
      '100% Polyester'
    ],
    'Hoodie': [
      'Brushed Fleece 100% Organic Cotton',
      'French Terry 100% Organic Cotton',
      '80% Cotton 20% Polyester Blend',
      '70% Cotton 30% Polyester Blend',
      '50% Cotton 50% Polyester Blend',
      '100% Polyester'
    ],
    'Sweatshirt': [
      'Brushed Fleece 100% Organic Cotton',
      'French Terry 100% Organic Cotton',
      '80% Cotton 20% Polyester Blend',
      '70% Cotton 30% Polyester Blend',
      '50% Cotton 50% Polyester Blend',
      '100% Polyester'
    ],
    'Sweatpants': [
      'Brushed Fleece 100% Organic Cotton',
      'French Terry 100% Organic Cotton',
      '80% Cotton 20% Polyester Blend',
      '70% Cotton 30% Polyester Blend',
      '50% Cotton 50% Polyester Blend',
      '100% Polyester'
    ],
    'Shorts': [
      'Brushed Fleece 100% Organic Cotton',
      'French Terry 100% Organic Cotton',
      '80% Cotton 20% Polyester Blend',
      '70% Cotton 30% Polyester Blend',
      '50% Cotton 50% Polyester Blend',
      '100% Polyester'
    ],
    'T-Shirt': [
      '100% Organic Cotton Jersey',
      '80% Cotton 20% Polyester Jersey',
      '50% Cotton 50% Polyester Jersey',
      '100% Polyester Jersey',
      '100% Cotton & Elastan',
      'Recycled Polyester'
    ],
    'Long Sleeve T-Shirt': [
      '100% Organic Cotton Jersey',
      '80% Cotton 20% Polyester Jersey',
      '50% Cotton 50% Polyester Jersey',
      '100% Polyester Jersey',
      '100% Cotton & Elastan',
      'Recycled Polyester'
    ],
    'Shirt': [
      '100% Cotton Poplin',
      '100% Cotton Oxford',
      '100% Cotton Twill',
      '100% Cotton Canvas',
      '80% Cotton 20% Polyester Blend',
      '100% Linen',
      '55% Hemp / 45% Cotton'
    ],
    'Polo Shirt': [
      '100% Cotton Piqué',
      '95% Cotton / 5% Elastane Piqué',
      '80% Cotton 20% Polyester Piqué',
      '50% Cotton / 50% Polyester Piqué',
      '100% Polyester Piqué'
    ],
    'Tank Top': [
      '100% Cotton Jersey',
      '100% Cotton Waffle Knit',
      '100% Cotton 2x2 Rib Knit',
      '100% Cotton Slub Jersey',
      '100% Cotton Lightweight French Terry',
      '95% Cotton / 5% Elastane Jersey',
      '50% Cotton / 50% Polyester Jersey',
      '100% Polyester Mesh',
      '65% Polyester / 35% Cotton Piqué Knit'
    ],
    'Hat/Cap': [
      '100% Cotton Twill',
      '100% Cotton Canvas',
      '100% Polyester',
      '65% Polyester / 35% Cotton',
      '100% Wool',
      '100% Acrylic'
    ],
    'Beanie': [
      '100% Acrylic',
      '100% Wool',
      '50% Wool / 50% Acrylic',
      '95% Cotton / 5% Elastane',
      '100% Cotton',
      '100% Polyester Fleece'
    ]
  },

  // Cotton fabrics that allow custom colors
  COTTON_FABRICS: [
    'Brushed Fleece 100% Organic Cotton',
    'French Terry 100% Organic Cotton',
    '100% Organic Cotton Jersey',
    '100% Cotton Jersey',
    '100% Cotton Poplin',
    '100% Cotton Oxford',
    '100% Cotton Twill',
    '100% Cotton Canvas',
    '100% Cotton Piqué',
    '100% Cotton Waffle Knit',
    '100% Cotton 2x2 Rib Knit',
    '100% Cotton Slub Jersey',
    '100% Cotton Lightweight French Terry'
  ],

  // Popular Pantone colors with hex mapping
  POPULAR_COLORS: [
    { hex: '#000000', pantone: '19-4007 TPX', name: 'Black' },
    { hex: '#ffffff', pantone: '11-4001 TPX', name: 'White' },
    { hex: '#dc2626', pantone: '18-1664 TPX', name: 'Red' },
    { hex: '#2563eb', pantone: '19-4052 TPX', name: 'Blue' },
    { hex: '#16a34a', pantone: '17-6153 TPX', name: 'Green' },
    { hex: '#eab308', pantone: '13-0859 TPX', name: 'Yellow' }
  ],

  // Design sample types
  DESIGN_TYPES: ['Embroidery', 'Screen Print', 'Digital Print', 'Other'],

  // Pricing
  PRICING: {
    LAB_DIP: 25,
    DESIGN_SAMPLE: 15,
    STOCK_SAMPLE: 35,
    CUSTOM_SAMPLE: 65
  }
};

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

// V10_Utils will be defined later with complete functionality

// ==============================================
// GLOBAL STATE MANAGEMENT
// ==============================================

const V10_State = {
  requestType: null, // 'quotation', 'sample-request', 'bulk-order-request'
  currentStudio: 'garment',
  garments: new Map(),
  labDips: new Map(),
  designSamples: new Map(),
  totalQuantity: 0, // Total production quantity across all garments
  assignments: {
    labDips: new Map(), // labDipId -> Set of garmentIds
    designs: new Map()  // designId -> Set of garmentIds
  },
  
  // Clear all data (in-memory only, no persistence)
  clear() {
    this.requestType = null;
    this.currentStudio = 'garment';
    this.garments.clear();
    this.labDips.clear();
    this.designSamples.clear();
    this.assignments.labDips.clear();
    this.assignments.designs.clear();
    console.log('🗑️ V10 State cleared');
  }
};

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

const V10_Utils = {
  // Generate unique IDs
  generateId: (prefix = 'item') => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,

  // Pantone validation
  validatePantone: (code) => {
    const pantoneRegex = /^\d{2}-\d{4}\s?(TPX|TCX)$/i;
    return pantoneRegex.test(code.trim());
  },

  // Convert hex to closest Pantone (simplified mapping)
  hexToPantone: (hex) => {
    const color = V10_CONFIG.POPULAR_COLORS.find(c => c.hex.toLowerCase() === hex.toLowerCase());
    return color ? color.pantone : `${Math.floor(Math.random() * 99)}-${Math.floor(Math.random() * 9999)} TPX`;
  },

  // Format currency
  formatCurrency: (amount) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `$${amount}`;
    }
  },

  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Sanitize filename for safe processing
  sanitizeFilename: (filename) => {
    try {
      return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
    } catch (error) {
      console.error('Error sanitizing filename:', error);
      return 'file';
    }
  },

  // Check if fabric allows custom colors
  allowsCustomColor: (fabricType) => {
    try {
      return V10_CONFIG.COTTON_FABRICS.some(cotton => fabricType.includes(cotton.split(' ')[0]));
    } catch (error) {
      console.error('Error checking fabric custom color capability:', error);
      return false;
    }
  }
};

// ==============================================
// STUDIO NAVIGATOR
// ==============================================

class V10_StudioNavigator {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateVisibility();
  }

  bindEvents() {
    // Studio tab clicks
    document.querySelectorAll('.studio-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const studio = tab.dataset.studio;
        this.switchStudio(studio);
      });
    });
  }

  switchStudio(studioName) {
    // Update state
    V10_State.currentStudio = studioName;

    // Update tab UI
    document.querySelectorAll('.studio-tab').forEach(tab => {
      tab.classList.toggle('studio-tab--active', tab.dataset.studio === studioName);
    });

    // Update studio containers
    document.querySelectorAll('.studio-container').forEach(container => {
      const isActive = container.id === `${studioName}-studio`;
      container.classList.toggle('studio-container--active', isActive);
      // Override inline display style when switching studios
      container.style.display = isActive ? 'block' : 'none';
      console.log(`📦 Studio container ${container.id}: ${isActive ? 'SHOWN' : 'HIDDEN'}`);
    });

    // Special handling for quantity studio
    if (studioName === 'quantities') {
      if (window.v10GarmentStudio && typeof window.v10GarmentStudio.populateQuantityStudio === 'function') {
        window.v10GarmentStudio.populateQuantityStudio();
      } else {
        console.warn('⚠️ Garment studio not available for quantity population');
      }
    }

    // Auto-save

    console.log(`🎛️ Switched to ${studioName} studio`);
  }

  updateVisibility() {
    const requestType = V10_State.requestType;
    
    // Show/hide studio tabs based on request type
    const designTab = document.getElementById('design-studio-tab');
    const quantitiesTab = document.getElementById('quantities-studio-tab');

    if (designTab) {
      designTab.style.display = requestType === 'sample-request' ? 'flex' : 'none';
    }

    if (quantitiesTab) {
      quantitiesTab.style.display = requestType === 'bulk-order-request' ? 'flex' : 'none';
    }

    // Update subtitle based on request type
    const subtitle = document.getElementById('step-3-subtitle');
    if (subtitle) {
      const subtitles = {
        'quotation': 'Configure garment specifications for accurate pricing',
        'sample-request': 'Design your samples using our professional studios',
        'bulk-order-request': 'Configure production specifications and quantities'
      };
      subtitle.textContent = subtitles[requestType] || 'Configure your garment specifications using our professional studios';
    }
  }

  // Set request type and update UI
  setRequestType(type) {
    V10_State.requestType = type;
    this.updateVisibility();
    
    // Reset to garment studio
    this.switchStudio('garment');
    
    console.log(`📋 Request type set to: ${type}`);
  }
}

// ==============================================
// GARMENT STUDIO MANAGER
// ==============================================

class V10_GarmentStudio {
  constructor() {
    // Singleton pattern - prevent multiple instances
    if (V10_GarmentStudio.instance) {
      return V10_GarmentStudio.instance;
    }
    
    this.garmentsContainer = document.getElementById('garments-container');
    this.addGarmentBtn = document.getElementById('add-garment');
    this.garmentCounter = 0;
    this.eventListenersAttached = false;
    
    V10_GarmentStudio.instance = this;
    this.init();
  }

  init() {
    // Prevent multiple initialization
    if (this.initialized) {
      return;
    }
    
    this.bindEvents();
    // Start with a fresh garment instead of loading from storage
    this.addGarment();
    
    this.initialized = true;
    console.log('✅ V10_GarmentStudio initialized');
  }

  bindEvents() {
    // Prevent duplicate event listeners
    if (this.eventListenersAttached) {
      return;
    }

    // Add garment button
    if (this.addGarmentBtn) {
      this.addGarmentBtn.addEventListener('click', () => this.addGarment());
    }

    // Delegate events for garment cards
    if (this.garmentsContainer) {
      this.garmentsContainer.addEventListener('click', (e) => this.handleGarmentActions(e));
      this.garmentsContainer.addEventListener('change', (e) => this.handleGarmentChanges(e));
      this.garmentsContainer.addEventListener('click', (e) => this.handleCompactClicks(e));
    }

    this.eventListenersAttached = true;
    console.log('✅ V10_GarmentStudio events bound');
  }

  // Static method to get instance
  static getInstance() {
    return V10_GarmentStudio.instance;
  }

  // Cleanup method
  destroy() {
    this.eventListenersAttached = false;
    this.initialized = false;
    V10_GarmentStudio.instance = null;
    console.log('🗑️ V10_GarmentStudio destroyed');
  }

  addGarment(data = null) {
    try {
      const garmentId = data?.id || V10_Utils.generateId('garment');
      const garmentNumber = this.getNextGarmentNumber();

      const garmentData = {
        id: garmentId,
        number: garmentNumber,
        type: data?.type || '',
        fabricType: data?.fabricType || '',
        sampleType: data?.sampleType || '', // For sample requests
        sampleReference: data?.sampleReference || '', // For bulk orders
        assignedLabDips: new Set(data?.assignedLabDips || []),
        assignedDesigns: new Set(data?.assignedDesigns || []),
        isComplete: false
      };

      // Store in state
      V10_State.garments.set(garmentId, garmentData);

      // Create UI
      this.renderGarment(garmentData);

      console.log(`➕ Added garment ${garmentNumber}: ${garmentId}`);
      return garmentId;
    } catch (error) {
      console.error('Error adding garment:', error);
      return null;
    }
  }

  // Get the next available garment number (fills gaps)
  getNextGarmentNumber() {
    const existingNumbers = Array.from(V10_State.garments.values()).map(g => g.number).sort((a, b) => a - b);
    
    // Find the first gap in the sequence
    for (let i = 1; i <= existingNumbers.length + 1; i++) {
      if (!existingNumbers.includes(i)) {
        return i;
      }
    }
    
    // Fallback: return next number after the highest
    return existingNumbers.length + 1;
  }

  renderGarment(garmentData) {
    try {
      console.log('🔄 Rendering garment:', garmentData);
      
      const template = document.getElementById('V10-garment-template');
      if (!template) {
        console.error('❌ V10-garment-template not found');
        return;
      }

      if (!garmentData || !garmentData.id) {
        console.error('❌ Invalid garment data provided:', garmentData);
        return;
      }

      const clone = template.content.cloneNode(true);
      if (!clone) {
        console.error('❌ Failed to clone template content');
        return;
      }

      const garmentCard = clone.querySelector('.garment-card');
      if (!garmentCard) {
        console.error('❌ Garment card element not found in template');
        return;
      }

      // Set garment ID
      garmentCard.dataset.garmentId = garmentData.id;
      console.log('✅ Set garment ID:', garmentData.id);

      // Set garment number
      const numberSpan = clone.querySelector('.garment-card__number');
      if (numberSpan) {
        numberSpan.textContent = `Garment ${garmentData.number}`;
      }

      // Set unique names for radio buttons
      try {
        this.setupRadioNames(clone, garmentData.id);
      } catch (radioError) {
        console.error('❌ Error setting up radio names:', radioError);
      }

      // Populate fabric options based on request type - only if garment type exists
      if (garmentData.type) {
        console.log('🔄 Populating fabric options for type:', garmentData.type);
        try {
          this.populateFabricOptions(clone, garmentData.type);
        } catch (fabricError) {
          console.error('❌ Error populating fabric options:', fabricError);
        }
      } else {
        console.warn('⚠️ No garment type specified, skipping fabric options');
      }

      // Set current values
      try {
        this.setGarmentValues(clone, garmentData);
      } catch (valuesError) {
        console.error('❌ Error setting garment values:', valuesError);
      }

      // Show/hide sections based on request type
      try {
        this.updateSectionVisibility(clone);
      } catch (visibilityError) {
        console.error('❌ Error updating section visibility:', visibilityError);
      }

      // Add to container
      if (this.garmentsContainer) {
        this.garmentsContainer.appendChild(clone);
        console.log('✅ Garment added to container');
      } else {
        console.error('❌ Garments container not found');
        return;
      }

      // Initialize compact interface
      try {
        this.initializeCompactInterface(clone);
      } catch (compactError) {
        console.error('❌ Error initializing compact interface:', compactError);
      }

      // Update status
      try {
        this.updateGarmentStatus(garmentData.id);
      } catch (statusError) {
        console.error('❌ Error updating garment status:', statusError);
      }
    } catch (error) {
      console.error('❌ Error rendering garment:', error);
    }
  }

  setupRadioNames(clone, garmentId) {
    // Update radio button names to be unique per garment
    clone.querySelectorAll('input[name="garmentType"]').forEach(input => {
      input.name = `garmentType-${garmentId}`;
    });
    
    clone.querySelectorAll('input[name="sampleType"]').forEach(input => {
      input.name = `sampleType-${garmentId}`;
    });
    
    clone.querySelectorAll('input[name="sampleReference"]').forEach(input => {
      input.name = `sampleReference-${garmentId}`;
    });
  }

  populateFabricOptions(element, garmentType) {
    try {
      if (!element) {
        console.error('populateFabricOptions: element is null or undefined');
        return;
      }

      if (!element.querySelector) {
        console.error('populateFabricOptions: element does not have querySelector method');
        return;
      }

      const fabricGrid = element.querySelector('#fabric-type-grid');
      if (!fabricGrid) {
        console.warn('populateFabricOptions: missing fabricGrid in element');
        return;
      }

      if (!garmentType) {
        console.warn('populateFabricOptions: missing garmentType');
        return;
      }

      // Find garment card - could be the element itself or nested inside
      let garmentCard = element;
      if (!element.classList || !element.classList.contains('garment-card')) {
        garmentCard = element.closest('.garment-card');
      }

      if (!garmentCard || !garmentCard.dataset || !garmentCard.dataset.garmentId) {
        console.error('Cannot find garment card with valid dataset');
        return;
      }

      const garmentId = garmentCard.dataset.garmentId;
      const fabrics = V10_CONFIG.FABRIC_TYPE_MAPPING[garmentType] || [];
      
      if (fabrics.length === 0) {
        console.warn(`No fabric options found for garment type: ${garmentType}`);
        fabricGrid.innerHTML = '<p class="no-fabrics">No fabric options available for this garment type.</p>';
        return;
      }
      
      // Check if this is in the compact interface
      const isCompactInterface = fabricGrid.classList.contains('compact-radio-grid');
      
      if (isCompactInterface) {
        fabricGrid.innerHTML = fabrics.map(fabric => `
          <label class="compact-radio-card">
            <input type="radio" name="fabricType-${garmentId}" value="${fabric}">
            <span class="compact-radio-card__content">
              <span class="compact-radio-card__icon">🧵</span>
              <span class="compact-radio-card__name">${fabric}</span>
            </span>
          </label>
        `).join('');
      } else {
        fabricGrid.innerHTML = fabrics.map(fabric => `
          <label class="radio-card">
            <input type="radio" name="fabricType-${garmentId}" value="${fabric}">
            <span class="radio-card__content">
              <span class="radio-card__icon">🧵</span>
              <span class="radio-card__name">${fabric}</span>
            </span>
          </label>
        `).join('');
      }
      
      console.log(`✅ Populated ${fabrics.length} fabric options for ${garmentType} (compact: ${isCompactInterface})`);
    } catch (error) {
      console.error('❌ Error in populateFabricOptions:', error);
      return;
    }
  }

  setGarmentValues(clone, garmentData) {
    // Set garment type
    if (garmentData.type) {
      const garmentTypeInput = clone.querySelector(`input[value="${garmentData.type}"]`);
      if (garmentTypeInput) garmentTypeInput.checked = true;
    }

    // Set fabric type
    if (garmentData.fabricType) {
      const fabricTypeInput = clone.querySelector(`input[value="${garmentData.fabricType}"]`);
      if (fabricTypeInput) fabricTypeInput.checked = true;
    }

    // Set sample type (for sample requests)
    if (garmentData.sampleType) {
      const sampleTypeInput = clone.querySelector(`input[value="${garmentData.sampleType}"]`);
      if (sampleTypeInput) sampleTypeInput.checked = true;
    }

    // Set sample reference (for bulk orders)
    if (garmentData.sampleReference) {
      const sampleRefInput = clone.querySelector(`input[value="${garmentData.sampleReference}"]`);
      if (sampleRefInput) sampleRefInput.checked = true;
    }
  }

  updateSectionVisibility(clone) {
    const requestType = V10_State.requestType;
    
    clone.querySelectorAll('[data-show-for]').forEach(section => {
      const showFor = section.dataset.showFor.split(',');
      const shouldShow = showFor.some(type => {
        if (type === 'quotation') return requestType === 'quotation';
        if (type === 'sample') return requestType === 'sample-request';
        if (type === 'bulk') return requestType === 'bulk-order-request';
        return false;
      });
      
      section.style.display = shouldShow ? 'block' : 'none';
    });
  }

  handleGarmentActions(e) {
    const garmentCard = e.target.closest('.garment-card');
    if (!garmentCard) return;

    const garmentId = garmentCard.dataset.garmentId;

    if (e.target.closest('.garment-card__remove')) {
      e.preventDefault();
      e.stopPropagation();
      this.removeGarment(garmentId);
    } else if (e.target.closest('.garment-card__duplicate')) {
      e.preventDefault();
      e.stopPropagation();
      this.duplicateGarment(garmentId);
    }
  }

  handleCompactClicks(e) {
    // Handle compact interface clicks
    if (e.target.closest('.selection-placeholder')) {
      e.preventDefault();
      e.stopPropagation();
      const widget = e.target.closest('.compact-selection-widget');
      this.toggleSelection(widget);
    } else if (e.target.closest('.change-selection-btn')) {
      e.preventDefault();
      e.stopPropagation();
      const widget = e.target.closest('.compact-selection-section').querySelector('.compact-selection-widget');
      this.toggleSelection(widget);
    }
  }

  handleGarmentChanges(e) {
    const garmentCard = e.target.closest('.garment-card');
    if (!garmentCard) return;

    const garmentId = garmentCard.dataset.garmentId;
    const garmentData = V10_State.garments.get(garmentId);
    if (!garmentData) return;

    // Handle garment type change (compact and regular)
    if (e.target.name.includes('garmentType')) {
      garmentData.type = e.target.value;
      this.populateFabricOptions(garmentCard, e.target.value);
      garmentData.fabricType = ''; // Reset fabric selection
      
      // Handle compact interface selection update
      if (e.target.closest('.compact-radio-card')) {
        this.updateCompactSelection('garment', e.target.value, garmentCard);
        this.enableFabricSelection(garmentCard);
      }
    }

    // Handle fabric type change (compact and regular)
    if (e.target.name.includes('fabricType')) {
      garmentData.fabricType = e.target.value;
      
      // Handle compact interface selection update
      if (e.target.closest('.compact-radio-card')) {
        this.updateCompactSelection('fabric', e.target.value, garmentCard);
      }
    }

    // Handle sample type change
    if (e.target.name.includes('sampleType')) {
      garmentData.sampleType = e.target.value;
    }

    // Handle sample reference change (bulk orders)
    if (e.target.name.includes('sampleReference')) {
      garmentData.sampleReference = e.target.value;
      
      // Handle compact interface selection update
      if (e.target.closest('.compact-radio-card')) {
        this.updateCompactSelection('sampleReference', e.target.value, garmentCard);
      }
    }

    // Update garment status
    this.updateGarmentStatus(garmentId);

    // Auto-save
  }

  updateGarmentStatus(garmentId) {
    const garmentData = V10_State.garments.get(garmentId);
    const garmentCard = document.querySelector(`[data-garment-id="${garmentId}"]`);
    if (!garmentData || !garmentCard) return;

    const statusIndicator = garmentCard.querySelector('.status-indicator');
    const requestType = V10_State.requestType;

    let isComplete = false;

    if (requestType === 'quotation') {
      isComplete = garmentData.type && garmentData.fabricType;
    } else if (requestType === 'sample-request') {
      isComplete = garmentData.type && garmentData.fabricType && garmentData.sampleType;
    } else if (requestType === 'bulk-order-request') {
      isComplete = garmentData.type && garmentData.sampleReference;
    }

    garmentData.isComplete = isComplete;

    if (statusIndicator) {
      statusIndicator.textContent = isComplete ? 'Complete' : 'Incomplete';
      statusIndicator.className = `status-indicator ${isComplete ? 'status-indicator--complete' : 'status-indicator--incomplete'}`;
    }

    // Update assigned items display
    this.updateAssignedDisplay(garmentId);
  }

  updateAssignedDisplay(garmentId) {
    const garmentCard = document.querySelector(`[data-garment-id="${garmentId}"]`);
    if (!garmentCard) return;

    const garmentData = V10_State.garments.get(garmentId);
    const assignedLabDips = garmentCard.querySelector('#assigned-labdips');
    const assignedDesigns = garmentCard.querySelector('#assigned-designs');

    // Update lab dips badges
    if (assignedLabDips) {
      assignedLabDips.innerHTML = Array.from(garmentData.assignedLabDips).map(labDipId => {
        const labDip = V10_State.labDips.get(labDipId);
        if (!labDip) return '';
        
        return `
          <div class="assigned-badge assigned-badge--labdip">
            <div class="assigned-badge__color" style="background-color: ${labDip.hex};"></div>
            <span>${labDip.pantone}</span>
            <button type="button" class="assigned-badge__remove" data-remove-labdip="${labDipId}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        `;
      }).join('');
    }

    // Update design badges
    if (assignedDesigns) {
      assignedDesigns.innerHTML = Array.from(garmentData.assignedDesigns).map(designId => {
        const design = V10_State.designSamples.get(designId);
        if (!design) return '';
        
        return `
          <div class="assigned-badge assigned-badge--design">
            <span>${design.name} (${design.type})</span>
            <button type="button" class="assigned-badge__remove" data-remove-design="${designId}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        `;
      }).join('');
    }

    // Bind remove events
    garmentCard.querySelectorAll('[data-remove-labdip]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const labDipId = e.target.closest('[data-remove-labdip]').dataset.removeLabdip;
        this.unassignLabDip(garmentId, labDipId);
      });
    });

    garmentCard.querySelectorAll('[data-remove-design]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const designId = e.target.closest('[data-remove-design]').dataset.removeDesign;
        this.unassignDesign(garmentId, designId);
      });
    });
  }

  removeGarment(garmentId) {
    try {
      // Prevent multiple calls during processing
      if (this.removing) {
        return;
      }
      this.removing = true;
      
      if (confirm('Remove this garment? This action cannot be undone.')) {
        // Remove from state
        V10_State.garments.delete(garmentId);

        // Clean up assignments
        this.cleanupAssignments(garmentId);

        // Remove from UI
        const garmentCard = document.querySelector(`[data-garment-id="${garmentId}"]`);
        if (garmentCard) {
          garmentCard.remove();
        }

        console.log(`🗑️ Removed garment: ${garmentId}`);
        
        // If no garments left, add a new one
        if (V10_State.garments.size === 0) {
          console.log('No garments left, adding fresh garment');
          this.addGarment();
        }
      }
    } catch (error) {
      console.error('Error removing garment:', error);
    } finally {
      this.removing = false;
    }
  }

  duplicateGarment(garmentId) {
    const originalData = V10_State.garments.get(garmentId);
    if (!originalData) return;

    const duplicateData = {
      ...originalData,
      id: undefined, // Will be generated
      assignedLabDips: new Set(), // Don't copy assignments
      assignedDesigns: new Set()
    };

    this.addGarment(duplicateData);
    console.log(`📋 Duplicated garment: ${garmentId}`);
  }

  cleanupAssignments(garmentId) {
    // Remove garment from all lab dip assignments
    V10_State.assignments.labDips.forEach((garmentSet, labDipId) => {
      garmentSet.delete(garmentId);
    });

    // Remove garment from all design assignments
    V10_State.assignments.designs.forEach((garmentSet, designId) => {
      garmentSet.delete(garmentId);
    });
  }

  assignLabDip(garmentId, labDipId) {
    const garmentData = V10_State.garments.get(garmentId);
    if (!garmentData) return;

    garmentData.assignedLabDips.add(labDipId);

    if (!V10_State.assignments.labDips.has(labDipId)) {
      V10_State.assignments.labDips.set(labDipId, new Set());
    }
    V10_State.assignments.labDips.get(labDipId).add(garmentId);

    this.updateAssignedDisplay(garmentId);
  }

  unassignLabDip(garmentId, labDipId) {
    const garmentData = V10_State.garments.get(garmentId);
    if (!garmentData) return;

    garmentData.assignedLabDips.delete(labDipId);
    
    if (V10_State.assignments.labDips.has(labDipId)) {
      V10_State.assignments.labDips.get(labDipId).delete(garmentId);
    }

    this.updateAssignedDisplay(garmentId);
  }

  assignDesign(garmentId, designId) {
    const garmentData = V10_State.garments.get(garmentId);
    if (!garmentData) return;

    garmentData.assignedDesigns.add(designId);

    if (!V10_State.assignments.designs.has(designId)) {
      V10_State.assignments.designs.set(designId, new Set());
    }
    V10_State.assignments.designs.get(designId).add(garmentId);

    this.updateAssignedDisplay(garmentId);
  }

  unassignDesign(garmentId, designId) {
    const garmentData = V10_State.garments.get(garmentId);
    if (!garmentData) return;

    garmentData.assignedDesigns.delete(designId);
    
    if (V10_State.assignments.designs.has(designId)) {
      V10_State.assignments.designs.get(designId).delete(garmentId);
    }

    this.updateAssignedDisplay(garmentId);
  }


  getAllGarments() {
    return Array.from(V10_State.garments.values());
  }

  validateGarments() {
    const garments = this.getAllGarments();
    const errors = [];

    if (garments.length === 0) {
      errors.push('At least one garment is required');
    }

    garments.forEach((garment, index) => {
      if (!garment.isComplete) {
        errors.push(`Garment ${index + 1} is incomplete`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // ==============================================
  // COMPACT INTERFACE METHODS
  // ==============================================

  toggleSelection(selectionWidget) {
    if (!selectionWidget) return;

    const garmentCard = selectionWidget.closest('.garment-card');
    if (!garmentCard) {
      console.error('❌ No garment card found for selection widget');
      return;
    }
    
    // selectionWidget IS the compact-selection-widget, so we work with it directly
    const collapsed = selectionWidget; // This is the compact-selection-widget itself
    const section = selectionWidget.closest('.compact-selection-section');
    const expanded = section ? section.querySelector('.selection-expanded') : null;
    const placeholder = selectionWidget.querySelector('.selection-placeholder');
    
    if (!expanded) {
      console.error('❌ No expanded section found');
      return;
    }
    
    if (expanded.style.display === 'none' || !expanded.style.display) {
      // Show expanded state
      collapsed.style.display = 'none';
      expanded.style.display = 'block';
      if (placeholder) placeholder.classList.add('expanded');
      
      // Close other expanded selections in this garment card
      this.closeOtherSelections(garmentCard, selectionWidget);
    } else {
      // Show collapsed state
      collapsed.style.display = 'block';
      expanded.style.display = 'none';
      if (placeholder) placeholder.classList.remove('expanded');
    }
  }

  closeOtherSelections(garmentCard, exceptWidget) {
    const allWidgets = garmentCard.querySelectorAll('.compact-selection-widget');
    allWidgets.forEach(widget => {
      if (widget !== exceptWidget) {
        const section = widget.closest('.compact-selection-section');
        const collapsed = widget;
        const expanded = section ? section.querySelector('.selection-expanded') : null;
        const placeholder = widget.querySelector('.selection-placeholder');
        
        collapsed.style.display = 'block';
        if (expanded) expanded.style.display = 'none';
        if (placeholder) placeholder.classList.remove('expanded');
      }
    });
  }

  updateCompactSelection(type, value, garmentCard) {
    if (type === 'garment') {
      const garmentIcon = this.getGarmentIcon(value);
      const selectedIcon = garmentCard.querySelector('#garment-selected-icon');
      const selectedName = garmentCard.querySelector('#garment-selected-name');
      const placeholder = garmentCard.querySelector('#garment-placeholder');
      const display = garmentCard.querySelector('#garment-display');
      
      if (selectedIcon) selectedIcon.textContent = garmentIcon;
      if (selectedName) selectedName.textContent = value;
      if (placeholder) placeholder.style.display = 'none';
      if (display) display.style.display = 'block';
      
      // Auto-collapse after selection
      setTimeout(() => {
        this.toggleSelection(garmentCard.querySelector('#garment-collapsed'));
      }, 300);
      
    } else if (type === 'fabric') {
      const selectedIcon = garmentCard.querySelector('#fabric-selected-icon');
      const selectedName = garmentCard.querySelector('#fabric-selected-name');
      const placeholder = garmentCard.querySelector('#fabric-placeholder');
      const display = garmentCard.querySelector('#fabric-display');
      
      if (selectedIcon) selectedIcon.textContent = '🧵';
      if (selectedName) selectedName.textContent = value;
      if (placeholder) placeholder.style.display = 'none';
      if (display) display.style.display = 'block';
      
      // Auto-collapse after selection
      setTimeout(() => {
        this.toggleSelection(garmentCard.querySelector('#fabric-collapsed'));
      }, 300);
      
    } else if (type === 'sampleReference') {
      const sampleReferenceIcon = this.getSampleReferenceIcon(value);
      const selectedIcon = garmentCard.querySelector('#sample-reference-selected-icon');
      const selectedName = garmentCard.querySelector('#sample-reference-selected-name');
      const placeholder = garmentCard.querySelector('#sample-reference-placeholder');
      const display = garmentCard.querySelector('#sample-reference-display');
      
      if (selectedIcon) selectedIcon.textContent = sampleReferenceIcon;
      if (selectedName) selectedName.textContent = this.getSampleReferenceDisplayName(value);
      if (placeholder) placeholder.style.display = 'none';
      if (display) display.style.display = 'block';
      
      // Auto-collapse after selection
      setTimeout(() => {
        this.toggleSelection(garmentCard.querySelector('#sample-reference-collapsed'));
      }, 300);
    }
  }

  enableFabricSelection(garmentCard) {
    const fabricCollapsed = garmentCard.querySelector('#fabric-collapsed');
    const fabricPlaceholder = garmentCard.querySelector('#fabric-placeholder');
    
    // Make fabric selection available
    if (fabricCollapsed) {
      fabricCollapsed.style.opacity = '1';
      fabricCollapsed.style.pointerEvents = 'auto';
    }
    if (fabricPlaceholder) {
      fabricPlaceholder.style.cursor = 'pointer';
      const placeholderText = fabricPlaceholder.querySelector('.placeholder-text');
      if (placeholderText) {
        placeholderText.textContent = 'Select fabric type';
      }
    }
  }

  getGarmentIcon(garmentType) {
    const iconMap = {
      'Zip-Up Hoodie': '🧥',
      'Hoodie': '👕',
      'T-Shirt': '👔',
      'Sweatshirt': '🧥',
      'Sweatpants': '👖',
      'Shorts': '🩳',
      'Long Sleeve T-Shirt': '👕',
      'Shirt': '👔',
      'Polo Shirt': '👕',
      'Tank Top': '🎽',
      'Hat/Cap': '🧢',
      'Beanie': '🧿',
      'Other': '✨'
    };
    return iconMap[garmentType] || '👕';
  }

  getSampleReferenceIcon(referenceType) {
    const iconMap = {
      'approved-sample': '✅',
      'approved-with-changes': '🔄',
      'new-sample-version': '📋'
    };
    return iconMap[referenceType] || '📋';
  }

  getSampleReferenceDisplayName(referenceType) {
    const nameMap = {
      'approved-sample': 'Approved Sample – As Is',
      'approved-with-changes': 'Approved Sample – With Changes', 
      'new-sample-version': 'New Sample Version'
    };
    return nameMap[referenceType] || referenceType;
  }


  initializeCompactInterface(garmentCard) {
    // Set up initial states
    const garmentExpanded = garmentCard.querySelector('#garment-expanded');
    const fabricExpanded = garmentCard.querySelector('#fabric-expanded');
    const fabricCollapsed = garmentCard.querySelector('#fabric-collapsed');
    const sampleReferenceExpanded = garmentCard.querySelector('#sample-reference-expanded');
    const sampleReferenceCollapsed = garmentCard.querySelector('#sample-reference-collapsed');
    
    if (garmentExpanded) garmentExpanded.style.display = 'none';
    if (fabricExpanded) fabricExpanded.style.display = 'none';
    if (sampleReferenceExpanded) sampleReferenceExpanded.style.display = 'none';
    
    // Initially disable fabric selection until garment is chosen
    if (fabricCollapsed) {
      fabricCollapsed.style.opacity = '0.6';
      fabricCollapsed.style.pointerEvents = 'none';
    }
    
    const fabricPlaceholder = garmentCard.querySelector('#fabric-placeholder');
    if (fabricPlaceholder) {
      fabricPlaceholder.style.cursor = 'not-allowed';
      const placeholderText = fabricPlaceholder.querySelector('.placeholder-text');
      if (placeholderText) {
        placeholderText.textContent = 'Select garment first';
      }
    }
    
    // Sample reference is always enabled for bulk orders
    if (sampleReferenceCollapsed) {
      sampleReferenceCollapsed.style.opacity = '1';
      sampleReferenceCollapsed.style.pointerEvents = 'auto';
    }
  }

  populateQuantityStudio() {
    const container = document.getElementById('garment-quantities-container');
    if (!container) {
      console.error('❌ Quantity container not found');
      return;
    }

    // Clear existing content
    container.innerHTML = '';

    // Get all garments that have both type and sample reference selected
    const completedGarments = Array.from(V10_State.garments.values()).filter(garment => 
      garment.type && garment.sampleReference
    );

    if (completedGarments.length === 0) {
      container.innerHTML = `
        <div class="quantity-empty-state">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <h4>No Garments Ready for Quantities</h4>
          <p>Configure garment types and sample references in the Garment Studio first.</p>
        </div>
      `;
      return;
    }

    // Generate quantity forms for each completed garment
    completedGarments.forEach(garment => {
      const quantityForm = this.createQuantityForm(garment);
      container.appendChild(quantityForm);
    });

    // Update total quantity display
    this.updateTotalQuantity();

    console.log(`📊 Populated quantity studio with ${completedGarments.length} garment(s)`);
  }

  createQuantityForm(garment) {
    const formElement = document.createElement('div');
    formElement.className = 'garment-quantity-form';
    formElement.dataset.garmentId = garment.id;

    formElement.innerHTML = `
      <div class="quantity-form-header">
        <div class="quantity-form-title">
          <span class="quantity-form-number">Garment ${garment.number}</span>
          <span class="quantity-form-type">${garment.type}</span>
        </div>
        <div class="quantity-form-reference">
          <span class="reference-badge">${this.getSampleReferenceDisplayName(garment.sampleReference)}</span>
        </div>
      </div>
      
      <div class="quantity-form-content">
        <div class="size-quantity-grid">
          <div class="size-quantity-header">
            <span>Size</span>
            <span>Quantity</span>
          </div>
          
          <div class="size-quantity-row">
            <label class="size-label">XS</label>
            <input type="number" name="qty-xs" min="0" value="0" class="quantity-input" data-size="XS">
          </div>
          
          <div class="size-quantity-row">
            <label class="size-label">S</label>
            <input type="number" name="qty-s" min="0" value="0" class="quantity-input" data-size="S">
          </div>
          
          <div class="size-quantity-row">
            <label class="size-label">M</label>
            <input type="number" name="qty-m" min="0" value="0" class="quantity-input" data-size="M">
          </div>
          
          <div class="size-quantity-row">
            <label class="size-label">L</label>
            <input type="number" name="qty-l" min="0" value="0" class="quantity-input" data-size="L">
          </div>
          
          <div class="size-quantity-row">
            <label class="size-label">XL</label>
            <input type="number" name="qty-xl" min="0" value="0" class="quantity-input" data-size="XL">
          </div>
          
          <div class="size-quantity-row">
            <label class="size-label">XXL</label>
            <input type="number" name="qty-xxl" min="0" value="0" class="quantity-input" data-size="XXL">
          </div>
          
          <div class="size-quantity-total">
            <span class="total-label">Garment Total:</span>
            <span class="total-value" id="garment-total-${garment.id}">0</span>
          </div>
        </div>
      </div>
    `;

    // Add event listeners for quantity inputs
    const quantityInputs = formElement.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        this.updateGarmentTotal(garment.id);
        this.updateTotalQuantity();
        this.saveQuantityData(garment.id);
      });
    });

    // Load existing quantity data if available
    this.loadQuantityData(garment.id, formElement);

    return formElement;
  }

  updateGarmentTotal(garmentId) {
    const form = document.querySelector(`[data-garment-id="${garmentId}"]`);
    if (!form) return;

    const inputs = form.querySelectorAll('.quantity-input');
    let total = 0;
    inputs.forEach(input => {
      total += parseInt(input.value) || 0;
    });

    const totalElement = form.querySelector(`#garment-total-${garmentId}`);
    if (totalElement) {
      totalElement.textContent = total;
    }

    return total;
  }

  updateTotalQuantity() {
    const allGarmentTotals = document.querySelectorAll('[id^="garment-total-"]');
    let grandTotal = 0;
    
    allGarmentTotals.forEach(totalElement => {
      grandTotal += parseInt(totalElement.textContent) || 0;
    });

    // Update the total quantity display
    const totalQuantityElement = document.getElementById('total-production-quantity');
    if (totalQuantityElement) {
      totalQuantityElement.textContent = grandTotal;
    }

    // Update progress bar
    const progressBar = document.getElementById('production-quantity-progress');
    if (progressBar) {
      const percentage = Math.min((grandTotal / 75) * 100, 100);
      progressBar.style.width = `${percentage}%`;
    }

    // Store in state
    V10_State.totalQuantity = grandTotal;

    console.log(`📊 Updated total quantity: ${grandTotal}`);
  }

  saveQuantityData(garmentId) {
    const form = document.querySelector(`[data-garment-id="${garmentId}"]`);
    if (!form) return;

    const garment = V10_State.garments.get(garmentId);
    if (!garment) return;

    const quantities = {};
    const inputs = form.querySelectorAll('.quantity-input');
    inputs.forEach(input => {
      const size = input.dataset.size;
      const qty = parseInt(input.value) || 0;
      quantities[size] = qty;
    });

    garment.quantities = quantities;
    console.log(`💾 Saved quantities for garment ${garment.number}:`, quantities);
  }

  loadQuantityData(garmentId, formElement) {
    const garment = V10_State.garments.get(garmentId);
    if (!garment || !garment.quantities) return;

    const inputs = formElement.querySelectorAll('.quantity-input');
    inputs.forEach(input => {
      const size = input.dataset.size;
      if (garment.quantities[size]) {
        input.value = garment.quantities[size];
      }
    });

    // Update totals
    this.updateGarmentTotal(garmentId);
  }
}

// ==============================================
// DESIGN STUDIO MANAGER
// ==============================================

class V10_DesignStudio {
  constructor() {
    this.currentMode = 'labdips';
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadExistingItems();
  }

  bindEvents() {
    // Mode toggle
    document.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.target.closest('[data-mode]').dataset.mode;
        this.switchMode(mode);
      });
    });

    // Lab dip controls
    this.bindLabDipEvents();
    
    // Design sample controls
    this.bindDesignEvents();
  }

  switchMode(mode) {
    this.currentMode = mode;

    // Update toggle buttons
    document.querySelectorAll('.studio-toggle__btn').forEach(btn => {
      btn.classList.toggle('studio-toggle__btn--active', btn.dataset.mode === mode);
    });

    // Update mode containers
    document.querySelectorAll('.design-mode').forEach(container => {
      container.classList.toggle('design-mode--active', container.id === `${mode}-mode-content`);
    });

    console.log(`🎨 Switched to ${mode} mode`);
  }

  bindLabDipEvents() {
    // Color picker
    const colorPicker = document.getElementById('lab-dip-color-picker');
    const colorPreview = document.getElementById('lab-dip-color-preview');
    const pantoneInput = document.getElementById('manual-pantone-code');
    const pantoneDisplay = document.getElementById('auto-pantone-display');
    const pantoneCircle = document.getElementById('auto-pantone-circle');
    const pantoneCode = document.getElementById('auto-pantone-code');

    if (colorPicker && colorPreview) {
      colorPicker.addEventListener('input', (e) => {
        const hex = e.target.value;
        colorPreview.style.backgroundColor = hex;
        
        // Update auto-pantone display
        if (pantoneDisplay && pantoneCircle && pantoneCode) {
          pantoneDisplay.style.display = 'block';
          pantoneCircle.style.backgroundColor = hex;
          pantoneCode.textContent = `PANTONE ${V10_Utils.hexToPantone(hex)}`;
        }
        
        this.updateLabDipButtons();
      });
    }

    // Manual pantone input
    if (pantoneInput) {
      pantoneInput.addEventListener('input', V10_Utils.debounce(() => {
        this.updateLabDipButtons();
      }, 300));
    }

    // Popular colors
    document.querySelectorAll('.popular-color').forEach(colorBtn => {
      colorBtn.addEventListener('click', (e) => {
        const hex = colorBtn.dataset.color;
        const pantone = colorBtn.dataset.pantone;
        
        if (colorPicker) colorPicker.value = hex;
        if (colorPreview) colorPreview.style.backgroundColor = hex;
        if (pantoneInput) pantoneInput.value = pantone;
        
        if (pantoneDisplay && pantoneCircle && pantoneCode) {
          pantoneDisplay.style.display = 'block';
          pantoneCircle.style.backgroundColor = hex;
          pantoneCode.textContent = `PANTONE ${pantone}`;
        }
        
        this.updateLabDipButtons();
      });
    });

    // Add buttons
    const addToGarmentBtn = document.getElementById('add-labdip-to-garment');
    const addFabricSwatchBtn = document.getElementById('add-fabric-swatch');

    if (addToGarmentBtn) {
      addToGarmentBtn.addEventListener('click', () => this.showGarmentSelector('labdip'));
    }

    if (addFabricSwatchBtn) {
      addFabricSwatchBtn.addEventListener('click', () => this.addLabDip(true));
    }
  }

  bindDesignEvents() {
    // Design form inputs
    const designNameInput = document.getElementById('design-sample-name');
    const designTypeInputs = document.querySelectorAll('input[name="design-type"]');
    const addToGarmentBtn = document.getElementById('add-design-to-garment');
    const addFabricDesignBtn = document.getElementById('add-fabric-design');

    // Update buttons when form changes
    const updateDesignButtons = () => {
      const name = designNameInput?.value.trim();
      const typeSelected = Array.from(designTypeInputs).some(input => input.checked);
      const isValid = name && typeSelected;

      if (addToGarmentBtn) addToGarmentBtn.disabled = !isValid;
      if (addFabricDesignBtn) addFabricDesignBtn.disabled = !isValid;
    };

    if (designNameInput) {
      designNameInput.addEventListener('input', updateDesignButtons);
    }

    designTypeInputs.forEach(input => {
      input.addEventListener('change', updateDesignButtons);
    });

    // File upload
    const fileUploadArea = document.getElementById('design-file-upload');
    const fileInput = document.getElementById('design-file-input');

    if (fileUploadArea && fileInput) {
      fileUploadArea.addEventListener('click', () => fileInput.click());
      
      fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = 'var(--v10-bg-dark)';
      });

      fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.style.borderColor = '';
      });

      fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          fileInput.files = files;
          this.handleFileUpload(files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          this.handleFileUpload(e.target.files[0]);
        }
      });
    }

    // Add buttons
    if (addToGarmentBtn) {
      addToGarmentBtn.addEventListener('click', () => this.showGarmentSelector('design'));
    }

    if (addFabricDesignBtn) {
      addFabricDesignBtn.addEventListener('click', () => this.addDesignSample(true));
    }
  }

  updateLabDipButtons() {
    const colorPicker = document.getElementById('lab-dip-color-picker');
    const pantoneInput = document.getElementById('manual-pantone-code');
    const addToGarmentBtn = document.getElementById('add-labdip-to-garment');

    const hasColor = colorPicker?.value;
    const hasValidPantone = pantoneInput?.value && V10_Utils.validatePantone(pantoneInput.value);
    
    const isValid = hasColor || hasValidPantone;

    if (addToGarmentBtn) {
      addToGarmentBtn.disabled = !isValid;
    }
  }

  showGarmentSelector(type) {
    const garments = Array.from(V10_State.garments.values()).filter(g => g.isComplete);
    
    if (garments.length === 0) {
      alert('Please complete at least one garment specification first.');
      return;
    }

    // Create modal with garment list
    const modal = this.createGarmentSelectorModal(garments, type);
    document.body.appendChild(modal);
  }

  createGarmentSelectorModal(garments, type) {
    const modal = document.createElement('div');
    modal.className = 'techpack-modal techpack-modal--selector';
    modal.innerHTML = `
      <div class="techpack-modal__backdrop"></div>
      <div class="techpack-modal__content">
        <div class="techpack-modal__header">
          <h3>Assign ${type === 'labdip' ? 'Lab Dip' : 'Design Sample'} to Garment</h3>
          <button type="button" class="techpack-modal__close">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M15 5L5 15m0-10l10 10" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
        <div class="techpack-modal__body">
          <div class="garment-selector">
            ${garments.map(garment => `
              <label class="garment-selector__option">
                <input type="radio" name="target-garment" value="${garment.id}">
                <span class="garment-selector__card">
                  <span class="garment-selector__title">Garment ${garment.number}</span>
                  <span class="garment-selector__details">${garment.type} - ${garment.fabricType}</span>
                </span>
              </label>
            `).join('')}
          </div>
          <div class="modal-actions">
            <button type="button" class="techpack-btn techpack-btn--ghost modal-cancel">Cancel</button>
            <button type="button" class="techpack-btn techpack-btn--primary modal-confirm" disabled>
              Assign ${type === 'labdip' ? 'Lab Dip' : 'Design Sample'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Bind modal events
    const backdrop = modal.querySelector('.techpack-modal__backdrop');
    const closeBtn = modal.querySelector('.techpack-modal__close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const confirmBtn = modal.querySelector('.modal-confirm');
    const radioInputs = modal.querySelectorAll('input[name="target-garment"]');

    const closeModal = () => {
      modal.remove();
    };

    backdrop.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Enable confirm button when garment selected
    radioInputs.forEach(input => {
      input.addEventListener('change', () => {
        confirmBtn.disabled = !Array.from(radioInputs).some(r => r.checked);
      });
    });

    // Handle confirm
    confirmBtn.addEventListener('click', () => {
      const selectedGarment = Array.from(radioInputs).find(r => r.checked)?.value;
      if (selectedGarment) {
        if (type === 'labdip') {
          this.addLabDip(false, selectedGarment);
        } else {
          this.addDesignSample(false, selectedGarment);
        }
      }
      closeModal();
    });

    return modal;
  }

  addLabDip(isFabricSwatch = false, targetGarmentId = null) {
    const colorPicker = document.getElementById('lab-dip-color-picker');
    const pantoneInput = document.getElementById('manual-pantone-code');

    let hex, pantone;

    if (pantoneInput.value && V10_Utils.validatePantone(pantoneInput.value)) {
      pantone = pantoneInput.value.trim();
      hex = colorPicker.value; // Use color picker as fallback
    } else if (colorPicker.value) {
      hex = colorPicker.value;
      pantone = V10_Utils.hexToPantone(hex);
    } else {
      alert('Please select a color or enter a valid Pantone code.');
      return;
    }

    const labDipId = V10_Utils.generateId('labdip');
    const labDipData = {
      id: labDipId,
      hex,
      pantone,
      isFabricSwatch,
      createdAt: new Date().toISOString()
    };

    // Store in state
    V10_State.labDips.set(labDipId, labDipData);

    // Assign to garment if specified
    if (targetGarmentId && !isFabricSwatch) {
      window.v10GarmentStudio.assignLabDip(targetGarmentId, labDipId);
    }

    // Update UI
    this.renderLabDipItem(labDipData);
    this.updateCollectionCounts();

    // Clear inputs
    if (pantoneInput) pantoneInput.value = '';
    const pantoneDisplay = document.getElementById('auto-pantone-display');
    if (pantoneDisplay) pantoneDisplay.style.display = 'none';

    // Auto-save

    console.log(`🎨 Added lab dip: ${labDipId}`);
  }

  addDesignSample(isFabricSample = false, targetGarmentId = null) {
    const nameInput = document.getElementById('design-sample-name');
    const typeInputs = document.querySelectorAll('input[name="design-type"]');
    const fileInput = document.getElementById('design-file-input');

    const name = nameInput?.value.trim();
    const selectedType = Array.from(typeInputs).find(input => input.checked);
    
    if (!name || !selectedType) {
      alert('Please enter a design name and select a type.');
      return;
    }

    const designId = V10_Utils.generateId('design');
    const designData = {
      id: designId,
      name,
      type: selectedType.value,
      fileName: fileInput?.files[0]?.name || null,
      isFabricSample,
      createdAt: new Date().toISOString()
    };

    // Store in state
    V10_State.designSamples.set(designId, designData);

    // Assign to garment if specified
    if (targetGarmentId && !isFabricSample) {
      window.v10GarmentStudio.assignDesign(targetGarmentId, designId);
    }

    // Update UI
    this.renderDesignItem(designData);
    this.updateCollectionCounts();

    // Clear inputs
    if (nameInput) nameInput.value = '';
    typeInputs.forEach(input => input.checked = false);
    if (fileInput) fileInput.value = '';

    // Auto-save

    console.log(`✨ Added design sample: ${designId}`);
  }

  renderLabDipItem(labDipData) {
    const container = document.getElementById('labdips-grid');
    const emptyState = document.getElementById('labdips-empty');
    
    if (!container) return;

    const template = document.getElementById('V10-labdip-template');
    if (!template) return;

    const clone = template.content.cloneNode(true);
    const item = clone.querySelector('.collection-item');
    
    item.dataset.labdipId = labDipData.id;
    
    const colorElement = clone.querySelector('.collection-item__color');
    const nameElement = clone.querySelector('.collection-item__name');
    
    if (colorElement) colorElement.style.backgroundColor = labDipData.hex;
    if (nameElement) nameElement.textContent = labDipData.pantone;

    // Bind events
    const assignBtn = clone.querySelector('.collection-item__assign');
    const removeBtn = clone.querySelector('.collection-item__remove');

    if (assignBtn) {
      assignBtn.addEventListener('click', () => this.showGarmentSelector('labdip'));
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', () => this.removeLabDip(labDipData.id));
    }

    container.appendChild(clone);
    
    if (emptyState) emptyState.style.display = 'none';
  }

  renderDesignItem(designData) {
    const container = document.getElementById('designs-grid');
    const emptyState = document.getElementById('designs-empty');
    
    if (!container) return;

    const template = document.getElementById('V10-design-template');
    if (!template) return;

    const clone = template.content.cloneNode(true);
    const item = clone.querySelector('.collection-item');
    
    item.dataset.designId = designData.id;
    
    const nameElement = clone.querySelector('.collection-item__name');
    const typeElement = clone.querySelector('.collection-item__type');
    
    if (nameElement) nameElement.textContent = designData.name;
    if (typeElement) typeElement.textContent = designData.type;

    // Bind events
    const assignBtn = clone.querySelector('.collection-item__assign');
    const removeBtn = clone.querySelector('.collection-item__remove');

    if (assignBtn) {
      assignBtn.addEventListener('click', () => this.showGarmentSelector('design'));
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', () => this.removeDesignSample(designData.id));
    }

    container.appendChild(clone);
    
    if (emptyState) emptyState.style.display = 'none';
  }

  removeLabDip(labDipId) {
    if (confirm('Remove this lab dip? This will also remove it from all garments.')) {
      // Remove from state
      V10_State.labDips.delete(labDipId);
      
      // Clean up assignments
      const assignedGarments = V10_State.assignments.labDips.get(labDipId);
      if (assignedGarments) {
        assignedGarments.forEach(garmentId => {
          window.v10GarmentStudio.unassignLabDip(garmentId, labDipId);
        });
        V10_State.assignments.labDips.delete(labDipId);
      }

      // Remove from UI
      const item = document.querySelector(`[data-labdip-id="${labDipId}"]`);
      if (item) item.remove();

      this.updateCollectionCounts();
  
      console.log(`🗑️ Removed lab dip: ${labDipId}`);
    }
  }

  removeDesignSample(designId) {
    if (confirm('Remove this design sample? This will also remove it from all garments.')) {
      // Remove from state
      V10_State.designSamples.delete(designId);
      
      // Clean up assignments
      const assignedGarments = V10_State.assignments.designs.get(designId);
      if (assignedGarments) {
        assignedGarments.forEach(garmentId => {
          window.v10GarmentStudio.unassignDesign(garmentId, designId);
        });
        V10_State.assignments.designs.delete(designId);
      }

      // Remove from UI
      const item = document.querySelector(`[data-design-id="${designId}"]`);
      if (item) item.remove();

      this.updateCollectionCounts();
  
      console.log(`🗑️ Removed design sample: ${designId}`);
    }
  }

  updateCollectionCounts() {
    const labDipsCount = document.getElementById('labdips-count');
    const designsCount = document.getElementById('designs-count');
    const labDipsEmpty = document.getElementById('labdips-empty');
    const designsEmpty = document.getElementById('designs-empty');

    const labDipCount = V10_State.labDips.size;
    const designCount = V10_State.designSamples.size;

    if (labDipsCount) {
      labDipsCount.textContent = `${labDipCount} color${labDipCount !== 1 ? 's' : ''}`;
    }

    if (designsCount) {
      designsCount.textContent = `${designCount} design${designCount !== 1 ? 's' : ''}`;
    }

    if (labDipsEmpty) {
      labDipsEmpty.style.display = labDipCount === 0 ? 'block' : 'none';
    }

    if (designsEmpty) {
      designsEmpty.style.display = designCount === 0 ? 'block' : 'none';
    }
  }

  handleFileUpload(file) {
    // Validate file
    const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PNG, JPG, or PDF file.');
      return;
    }

    if (file.size > maxSize) {
      alert('File size must be less than 10MB.');
      return;
    }

    // Update UI to show file selected
    const uploadArea = document.getElementById('design-file-upload');
    if (uploadArea) {
      const content = uploadArea.querySelector('.file-upload-content');
      if (content) {
        content.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <line x1="10" y1="9" x2="8" y2="9"/>
          </svg>
          <span>File selected: ${file.name}</span>
          <small>Click to change file</small>
        `;
      }
    }

    console.log(`📎 File uploaded: ${file.name}`);
  }

  loadExistingItems() {
    // Load lab dips from state
    V10_State.labDips.forEach(labDipData => {
      this.renderLabDipItem(labDipData);
    });

    // Load design samples from state
    V10_State.designSamples.forEach(designData => {
      this.renderDesignItem(designData);
    });

    this.updateCollectionCounts();
  }
}

// ==============================================
// VALIDATION MANAGER
// ==============================================

class V10_ValidationManager {
  constructor() {
    this.nextBtn = document.getElementById('step-3-next');
    this.init();
  }

  init() {
    this.validateStep();
  }

  validateStep() {
    try {
      const requestType = V10_State?.requestType;
      if (!requestType) {
        console.warn('No request type selected for validation');
        return { isValid: false, errors: ['No request type selected'] };
      }
      
      const validation = this.getValidationForRequestType(requestType);
      if (!validation) {
        console.error('Validation function returned null/undefined');
        return { isValid: false, errors: ['Validation error'] };
      }
      
      // Update next button - try both IDs for compatibility
      try {
        const nextBtn = this.nextBtn || document.getElementById('techpack-v10-step-3-next');
        if (nextBtn) {
          nextBtn.disabled = !validation.isValid;
          
          if (!validation.isValid && Array.isArray(validation.errors) && validation.errors.length > 0) {
            nextBtn.title = validation.errors.join(', ');
          } else {
            nextBtn.title = '';
          }
        }
      } catch (buttonError) {
        console.error('Error updating next button:', buttonError);
      }

      return validation;
    } catch (error) {
      console.error('Error in validateStep:', error);
      return { isValid: false, errors: ['Validation error occurred'] };
    }
  }

  getValidationForRequestType(requestType) {
    switch (requestType) {
      case 'quotation':
        return this.validateQuotation();
      case 'sample-request':
        return this.validateSampleRequest();
      case 'bulk-order-request':
        return this.validateBulkOrder();
      default:
        return { isValid: false, errors: ['Invalid request type'] };
    }
  }

  validateQuotation() {
    try {
      // Check if garment studio is available
      if (!window.v10GarmentStudio || !window.v10GarmentStudio.validateGarments) {
        console.warn('Garment studio not ready for validation');
        return { isValid: true, errors: [] }; // Return valid if not ready yet
      }
      
      const garmentValidation = window.v10GarmentStudio.validateGarments();
      return garmentValidation || { isValid: false, errors: ['Validation failed'] };
    } catch (error) {
      console.error('Error validating quotation:', error);
      return { isValid: false, errors: ['Validation error occurred'] };
    }
  }

  validateSampleRequest() {
    try {
      // Check if garment studio is available
      if (!window.v10GarmentStudio || !window.v10GarmentStudio.validateGarments) {
        console.warn('Garment studio not ready for validation');
        return { isValid: true, errors: [] }; // Return valid if not ready yet
      }
      
      const garmentValidation = window.v10GarmentStudio.validateGarments();
      if (!garmentValidation) {
        return { isValid: false, errors: ['Validation failed'] };
      }
      
      const errors = Array.isArray(garmentValidation.errors) ? [...garmentValidation.errors] : [];

      // Additional validation for sample requests
      try {
        if (typeof window.v10GarmentStudio.getAllGarments === 'function') {
          const garments = window.v10GarmentStudio.getAllGarments();
          if (Array.isArray(garments)) {
            garments.forEach((garment, index) => {
              if (garment && garment.sampleType === 'custom' && garment.assignedLabDips && garment.assignedLabDips.size === 0) {
                errors.push(`Garment ${index + 1}: Custom color sample requires Lab Dip assignment`);
              }
            });
          }
        }
      } catch (garmentError) {
        console.error('Error validating garment assignments:', garmentError);
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      console.error('Error validating sample request:', error);
      return { isValid: false, errors: ['Validation error occurred'] };
    }
  }

  validateBulkOrder() {
    try {
      // Check if garment studio is available
      if (!window.v10GarmentStudio || !window.v10GarmentStudio.validateGarments) {
        console.warn('Garment studio not ready for validation');
        return { isValid: true, errors: [] }; // Return valid if not ready yet
      }
      
      const garmentValidation = window.v10GarmentStudio.validateGarments();
      if (!garmentValidation) {
        return { isValid: false, errors: ['Validation failed'] };
      }
      
      const errors = Array.isArray(garmentValidation.errors) ? [...garmentValidation.errors] : [];

      // Additional validation for bulk orders
      // Check quantity requirements for bulk orders
      const totalQuantity = V10_State.totalQuantity || 0;
      if (totalQuantity < 75) {
        errors.push(`Minimum quantity is 75 units (currently: ${totalQuantity})`);
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      console.error('Error validating bulk order:', error);
      return { isValid: false, errors: ['Validation error occurred'] };
    }
  }

  // Call this method whenever form data changes
  revalidate() {
    try {
      setTimeout(() => {
        try {
          this.validateStep();
        } catch (validateError) {
          console.error('Error during revalidation:', validateError);
        }
      }, 100);
    } catch (error) {
      console.error('Error setting up revalidation:', error);
    }
  }
}

// ==============================================
// STANDALONE ITEMS MANAGER
// ==============================================

class V10_StandaloneItemsManager {
  constructor() {
    this.container = document.getElementById('standalone-items');
    this.init();
  }

  init() {
    this.updateDisplay();
  }

  updateDisplay() {
    if (!this.container || V10_State.requestType !== 'sample-request') {
      if (this.container) this.container.style.display = 'none';
      return;
    }

    const standaloneLabDips = this.getStandaloneLabDips();
    const standaloneDesigns = this.getStandaloneDesigns();
    
    if (standaloneLabDips.length === 0 && standaloneDesigns.length === 0) {
      this.container.style.display = 'none';
      return;
    }

    this.container.style.display = 'block';
    this.renderStandaloneItems(standaloneLabDips, standaloneDesigns);
  }

  getStandaloneLabDips() {
    return Array.from(V10_State.labDips.values()).filter(labDip => {
      const assignments = V10_State.assignments.labDips.get(labDip.id);
      return !assignments || assignments.size === 0;
    });
  }

  getStandaloneDesigns() {
    return Array.from(V10_State.designSamples.values()).filter(design => {
      const assignments = V10_State.assignments.designs.get(design.id);
      return !assignments || assignments.size === 0;
    });
  }

  renderStandaloneItems(labDips, designs) {
    const labDipsList = document.getElementById('standalone-labdips');
    const designsList = document.getElementById('standalone-designs');
    const costDisplay = document.getElementById('standalone-cost');

    // Render lab dips
    if (labDipsList) {
      labDipsList.innerHTML = labDips.map(labDip => `
        <div class="collection-item">
          <div class="collection-item__visual">
            <div class="collection-item__color" style="background-color: ${labDip.hex};"></div>
          </div>
          <div class="collection-item__content">
            <span class="collection-item__name">${labDip.pantone}</span>
            <span class="collection-item__type">Fabric Swatch - ${V10_Utils.formatCurrency(V10_CONFIG.PRICING.LAB_DIP)}</span>
          </div>
        </div>
      `).join('');
    }

    // Render designs
    if (designsList) {
      designsList.innerHTML = designs.map(design => `
        <div class="collection-item">
          <div class="collection-item__visual">
            <div class="collection-item__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>
          <div class="collection-item__content">
            <span class="collection-item__name">${design.name}</span>
            <span class="collection-item__type">Fabric Design Sample (${design.type}) - ${V10_Utils.formatCurrency(V10_CONFIG.PRICING.DESIGN_SAMPLE)}</span>
          </div>
        </div>
      `).join('');
    }

    // Update cost
    const totalCost = (labDips.length * V10_CONFIG.PRICING.LAB_DIP) + (designs.length * V10_CONFIG.PRICING.DESIGN_SAMPLE);
    if (costDisplay) {
      costDisplay.textContent = V10_Utils.formatCurrency(totalCost);
    }
  }
}

// ==============================================
// STEP 4 REVIEW MANAGER
// ==============================================

class V10_ReviewManager {
  constructor() {
    this.init();
  }

  init() {
    if (document.getElementById('techpack-step-4')) {
      this.bindEvents();
      this.populateReview();
    }
  }

  bindEvents() {
    // Navigation buttons
    const prevBtn = document.getElementById('step-4-prev');
    const submitBtn = document.getElementById('submit-request-btn');
    const saveDraftBtn = document.getElementById('save-draft-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (window.stepManager) {
          window.stepManager.navigateToStep(3);
        }
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.submitRequest());
    }

    if (saveDraftBtn) {
      saveDraftBtn.addEventListener('click', () => this.saveDraft());
    }

    // Edit buttons
    document.querySelectorAll('[data-edit-step]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const step = parseInt(e.target.closest('[data-edit-step]').dataset.editStep);
        if (window.stepManager) {
          window.stepManager.navigateToStep(step);
        }
      });
    });

    // Terms checkbox
    const termsCheckbox = document.getElementById('terms-agreement');
    if (termsCheckbox) {
      termsCheckbox.addEventListener('change', () => this.updateSubmitButton());
    }
  }

  populateReview() {
    this.populateClientInfo();
    this.populateUploadedFiles();
    this.populateRequestType();
    this.populateGarments();
    this.populateLabDips();
    this.populateDesigns();
    this.populateCostSummary();
    this.updateSectionVisibility();
    this.updateSubmitMessage();
  }

  populateClientInfo() {
    const container = document.getElementById('review-client-info');
    if (!container) return;

    // Get client info from global state or form
    const clientData = this.getClientData();
    
    container.innerHTML = `
      <div class="review-detail">
        <span class="detail-label">Company:</span>
        <span class="detail-value">${clientData.company || 'Not provided'}</span>
      </div>
      <div class="review-detail">
        <span class="detail-label">Contact:</span>
        <span class="detail-value">${clientData.name || 'Not provided'}</span>
      </div>
      <div class="review-detail">
        <span class="detail-label">Email:</span>
        <span class="detail-value">${clientData.email || 'Not provided'}</span>
      </div>
    `;
  }

  populateUploadedFiles() {
    const container = document.getElementById('review-uploaded-files');
    if (!container) return;

    // Get uploaded files from global state
    const files = this.getUploadedFiles();
    
    if (files.length === 0) {
      container.innerHTML = '<p class="empty-message">No files uploaded</p>';
      return;
    }

    container.innerHTML = files.map(file => `
      <div class="file-item">
        <div class="file-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
          </svg>
        </div>
        <span class="file-name">${file.name}</span>
        <span class="file-size">${this.formatFileSize(file.size || 0)}</span>
      </div>
    `).join('');
  }

  populateRequestType() {
    const container = document.getElementById('review-request-type');
    if (!container) return;

    const requestType = V10_State.requestType;
    const typeLabels = {
      'quotation': 'Quotation Request',
      'sample-request': 'Sample Request',
      'bulk-order-request': 'Bulk Order Request'
    };

    const typeDescriptions = {
      'quotation': 'Get pricing for your specifications',
      'sample-request': 'Order physical samples for approval',
      'bulk-order-request': 'Place production order'
    };

    container.innerHTML = `
      <div class="request-type-display">
        <h4>${typeLabels[requestType] || 'Unknown'}</h4>
        <p>${typeDescriptions[requestType] || ''}</p>
      </div>
    `;
  }

  populateGarments() {
    const container = document.getElementById('review-garments');
    if (!container) return;

    const garments = Array.from(V10_State.garments.values());
    
    if (garments.length === 0) {
      container.innerHTML = '<p class="empty-message">No garments configured</p>';
      return;
    }

    const template = document.getElementById('review-garment-template');
    if (!template) return;

    container.innerHTML = '';

    garments.forEach(garment => {
      const clone = template.content.cloneNode(true);
      
      const numberSpan = clone.querySelector('.garment-number');
      const typeSpan = clone.querySelector('.garment-type');
      const statusBadge = clone.querySelector('.status-badge');
      const contentDiv = clone.querySelector('.review-garment-card__content');

      if (numberSpan) numberSpan.textContent = `Garment ${garment.number}`;
      if (typeSpan) typeSpan.textContent = garment.type;
      
      if (statusBadge) {
        statusBadge.textContent = garment.isComplete ? 'Complete' : 'Incomplete';
        statusBadge.className = `status-badge ${garment.isComplete ? 'status-badge--complete' : 'status-badge--incomplete'}`;
      }

      // Add garment details
      const details = this.buildGarmentDetails(garment);
      if (contentDiv) {
        contentDiv.innerHTML = details;
      }

      container.appendChild(clone);
    });
  }

  buildGarmentDetails(garment) {
    const requestType = V10_State.requestType;
    let details = '';

    // Fabric type (for quotation/sample)
    if (garment.fabricType && ['quotation', 'sample-request'].includes(requestType)) {
      details += `
        <div class="review-garment-detail">
          <span class="detail-label">Fabric:</span>
          <span class="detail-value">${garment.fabricType}</span>
        </div>
      `;
    }

    // Sample type (for sample requests)
    if (garment.sampleType && requestType === 'sample-request') {
      const sampleTypeLabels = {
        'stock': 'Stock Color Sample (€35)',
        'custom': 'Custom Color Sample (€65)',
        'techpack': 'As Per TechPack (Premium)'
      };
      
      details += `
        <div class="review-garment-detail">
          <span class="detail-label">Sample Type:</span>
          <span class="detail-value">${sampleTypeLabels[garment.sampleType] || garment.sampleType}</span>
        </div>
      `;
    }

    // Sample reference (for bulk orders)
    if (garment.sampleReference && requestType === 'bulk-order-request') {
      details += `
        <div class="review-garment-detail">
          <span class="detail-label">Sample Reference:</span>
          <span class="detail-value">${garment.sampleReference}</span>
        </div>
      `;
    }

    // Assigned items
    if (requestType === 'sample-request') {
      details += '<div class="review-garment-assigned">';
      
      // Assigned lab dips
      if (garment.assignedLabDips.size > 0) {
        details += '<div class="assigned-group">';
        details += '<span class="assigned-label">Colors:</span>';
        Array.from(garment.assignedLabDips).forEach(labDipId => {
          const labDip = V10_State.labDips.get(labDipId);
          if (labDip) {
            details += `<span class="assigned-item" style="border-left-color: ${labDip.hex};">${labDip.pantone}</span>`;
          }
        });
        details += '</div>';
      }

      // Assigned designs
      if (garment.assignedDesigns.size > 0) {
        details += '<div class="assigned-group">';
        details += '<span class="assigned-label">Designs:</span>';
        Array.from(garment.assignedDesigns).forEach(designId => {
          const design = V10_State.designSamples.get(designId);
          if (design) {
            details += `<span class="assigned-item">${design.name} (${design.type})</span>`;
          }
        });
        details += '</div>';
      }
      
      details += '</div>';
    }

    return details;
  }

  populateLabDips() {
    const assignedContainer = document.getElementById('review-labdips-assigned');
    const standaloneContainer = document.getElementById('review-labdips-standalone');
    
    if (!assignedContainer || !standaloneContainer) return;

    const labDips = Array.from(V10_State.labDips.values());
    const assignedLabDips = [];
    const standaloneLabDips = [];

    labDips.forEach(labDip => {
      const assignments = V10_State.assignments.labDips.get(labDip.id);
      if (assignments && assignments.size > 0) {
        assignedLabDips.push({ labDip, garmentIds: Array.from(assignments) });
      } else {
        standaloneLabDips.push(labDip);
      }
    });

    // Render assigned lab dips
    assignedContainer.innerHTML = assignedLabDips.map(({ labDip, garmentIds }) => {
      const garmentNames = garmentIds.map(id => {
        const garment = V10_State.garments.get(id);
        return garment ? `Garment ${garment.number}` : 'Unknown';
      }).join(', ');

      return `
        <div class="review-item">
          <div class="review-item__visual">
            <div class="review-item__color" style="background-color: ${labDip.hex};"></div>
          </div>
          <div class="review-item__content">
            <span class="review-item__name">${labDip.pantone}</span>
            <span class="review-item__cost">€25</span>
          </div>
          <div class="review-item__assignment">
            <span class="assignment-type">Assigned to ${garmentNames}</span>
          </div>
        </div>
      `;
    }).join('');

    // Render standalone lab dips
    standaloneContainer.innerHTML = standaloneLabDips.map(labDip => `
      <div class="review-item">
        <div class="review-item__visual">
          <div class="review-item__color" style="background-color: ${labDip.hex};"></div>
        </div>
        <div class="review-item__content">
          <span class="review-item__name">${labDip.pantone}</span>
          <span class="review-item__cost">€25</span>
        </div>
        <div class="review-item__assignment">
          <span class="assignment-type">Fabric Swatch Only</span>
        </div>
      </div>
    `).join('');

    if (assignedLabDips.length === 0) {
      assignedContainer.innerHTML = '<p class="empty-message">No lab dips assigned to garments</p>';
    }

    if (standaloneLabDips.length === 0) {
      standaloneContainer.innerHTML = '<p class="empty-message">No standalone fabric swatches</p>';
    }
  }

  populateDesigns() {
    const assignedContainer = document.getElementById('review-designs-assigned');
    const standaloneContainer = document.getElementById('review-designs-standalone');
    
    if (!assignedContainer || !standaloneContainer) return;

    const designs = Array.from(V10_State.designSamples.values());
    const assignedDesigns = [];
    const standaloneDesigns = [];

    designs.forEach(design => {
      const assignments = V10_State.assignments.designs.get(design.id);
      if (assignments && assignments.size > 0) {
        assignedDesigns.push({ design, garmentIds: Array.from(assignments) });
      } else {
        standaloneDesigns.push(design);
      }
    });

    // Render assigned designs
    assignedContainer.innerHTML = assignedDesigns.map(({ design, garmentIds }) => {
      const garmentNames = garmentIds.map(id => {
        const garment = V10_State.garments.get(id);
        return garment ? `Garment ${garment.number}` : 'Unknown';
      }).join(', ');

      return `
        <div class="review-item">
          <div class="review-item__visual">
            <div class="review-item__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>
          <div class="review-item__content">
            <span class="review-item__name">${design.name}</span>
            <span class="review-item__type">${design.type}</span>
            <span class="review-item__cost">€15</span>
          </div>
          <div class="review-item__assignment">
            <span class="assignment-type">Assigned to ${garmentNames}</span>
          </div>
        </div>
      `;
    }).join('');

    // Render standalone designs
    standaloneContainer.innerHTML = standaloneDesigns.map(design => `
      <div class="review-item">
        <div class="review-item__visual">
          <div class="review-item__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
        <div class="review-item__content">
          <span class="review-item__name">${design.name}</span>
          <span class="review-item__type">${design.type}</span>
          <span class="review-item__cost">€15</span>
        </div>
        <div class="review-item__assignment">
          <span class="assignment-type">Fabric Design Sample</span>
        </div>
      </div>
    `).join('');

    if (assignedDesigns.length === 0) {
      assignedContainer.innerHTML = '<p class="empty-message">No design samples assigned to garments</p>';
    }

    if (standaloneDesigns.length === 0) {
      standaloneContainer.innerHTML = '<p class="empty-message">No standalone fabric design samples</p>';
    }
  }

  populateCostSummary() {
    const breakdownContainer = document.getElementById('cost-breakdown');
    const totalCostElement = document.getElementById('total-cost');
    
    if (!breakdownContainer || !totalCostElement) return;

    const costs = this.calculateCosts();
    let html = '';

    costs.items.forEach(item => {
      html += `
        <div class="cost-item">
          <div>
            <div class="cost-item__label">${item.label}</div>
            <div class="cost-item__description">${item.description}</div>
          </div>
          <div class="cost-item__amount">${V10_Utils.formatCurrency(item.amount)}</div>
        </div>
      `;
    });

    breakdownContainer.innerHTML = html;
    totalCostElement.textContent = V10_Utils.formatCurrency(costs.total);
  }

  calculateCosts() {
    const requestType = V10_State.requestType;
    const items = [];
    let total = 0;

    if (requestType === 'sample-request') {
      const garments = Array.from(V10_State.garments.values());
      
      // Sample costs
      garments.forEach(garment => {
        if (garment.sampleType === 'stock') {
          items.push({
            label: `${garment.type} - Stock Sample`,
            description: `Garment ${garment.number}`,
            amount: V10_CONFIG.PRICING.STOCK_SAMPLE
          });
          total += V10_CONFIG.PRICING.STOCK_SAMPLE;
        } else if (garment.sampleType === 'custom') {
          items.push({
            label: `${garment.type} - Custom Sample`,
            description: `Garment ${garment.number}`,
            amount: V10_CONFIG.PRICING.CUSTOM_SAMPLE
          });
          total += V10_CONFIG.PRICING.CUSTOM_SAMPLE;
        }
      });

      // Lab dip costs
      const labDipCount = V10_State.labDips.size;
      if (labDipCount > 0) {
        items.push({
          label: 'Lab Dip Swatches',
          description: `${labDipCount} color${labDipCount > 1 ? 's' : ''}`,
          amount: labDipCount * V10_CONFIG.PRICING.LAB_DIP
        });
        total += labDipCount * V10_CONFIG.PRICING.LAB_DIP;
      }

      // Design sample costs
      const designCount = V10_State.designSamples.size;
      if (designCount > 0) {
        items.push({
          label: 'Design Samples',
          description: `${designCount} design${designCount > 1 ? 's' : ''}`,
          amount: designCount * V10_CONFIG.PRICING.DESIGN_SAMPLE
        });
        total += designCount * V10_CONFIG.PRICING.DESIGN_SAMPLE;
      }
    }

    return { items, total };
  }

  updateSectionVisibility() {
    const requestType = V10_State.requestType;
    
    const labDipsSection = document.getElementById('review-labdips-section');
    const designsSection = document.getElementById('review-designs-section');
    const quantitiesSection = document.getElementById('review-quantities-section');

    if (labDipsSection) {
      labDipsSection.style.display = requestType === 'sample-request' ? 'block' : 'none';
    }

    if (designsSection) {
      designsSection.style.display = requestType === 'sample-request' ? 'block' : 'none';
    }

    if (quantitiesSection) {
      quantitiesSection.style.display = requestType === 'bulk-order-request' ? 'block' : 'none';
    }
  }

  updateSubmitMessage() {
    const messageContainer = document.getElementById('submit-message');
    if (!messageContainer) return;

    const requestType = V10_State.requestType;
    const messages = {
      'quotation': `
        <h4>Ready to Request Quotation</h4>
        <p>Your specifications will be reviewed and you'll receive a detailed price quote within 24-48 hours. No payment is required at this stage.</p>
      `,
      'sample-request': `
        <h4>Ready to Order Samples</h4>
        <p>Your samples will be produced and shipped within the specified timeframes. Payment will be processed after submission.</p>
      `,
      'bulk-order-request': `
        <h4>Ready to Place Bulk Order</h4>
        <p>Your production order will be reviewed and confirmed. A 50% deposit will be required to begin production.</p>
      `
    };

    messageContainer.innerHTML = messages[requestType] || messages['quotation'];
  }

  updateSubmitButton() {
    const submitBtn = document.getElementById('submit-request-btn');
    const termsCheckbox = document.getElementById('terms-agreement');
    
    if (submitBtn && termsCheckbox) {
      submitBtn.disabled = !termsCheckbox.checked;
    }
  }

  async submitRequest() {
    const termsCheckbox = document.getElementById('terms-agreement');
    if (!termsCheckbox || !termsCheckbox.checked) {
      alert('Please agree to the Terms & Conditions to continue.');
      return;
    }

    // Show loading state
    const submitBtn = document.getElementById('submit-request-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="techpack-btn__icon animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        Submitting...
      `;
    }

    try {
      // Prepare submission data
      const submissionData = this.prepareSubmissionData();
      
      // Simulate API call (replace with actual submission)
      await this.simulateSubmission(submissionData);
      
      // Show success modal
      this.showSuccessModal();
      
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit request. Please try again.');
      
      // Reset button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg class="techpack-btn__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22,2 15,22 11,13 2,9 22,2"/>
          </svg>
          Submit Request
        `;
      }
    }
  }

  prepareSubmissionData() {
    return {
      requestType: V10_State.requestType,
      clientInfo: this.getClientData(),
      uploadedFiles: this.getUploadedFiles(),
      garments: Array.from(V10_State.garments.values()),
      labDips: Array.from(V10_State.labDips.values()),
      designSamples: Array.from(V10_State.designSamples.values()),
      assignments: {
        labDips: Object.fromEntries(V10_State.assignments.labDips),
        designs: Object.fromEntries(V10_State.assignments.designs)
      },
      costs: this.calculateCosts(),
      submittedAt: new Date().toISOString()
    };
  }

  async simulateSubmission(data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Log submission data (for development)
    console.log('📤 Submission Data:', data);
    
    // In real implementation, this would be:
    // const response = await fetch('/api/techpack/submit', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // return response.json();
    
    return {
      success: true,
      requestId: `TP-${Date.now()}`,
      estimatedResponse: '24-48 hours'
    };
  }

  showSuccessModal() {
    const modal = document.getElementById('success-modal');
    const successMessage = document.getElementById('success-message');
    const successDetails = document.getElementById('success-details');
    
    if (!modal) return;

    const requestType = V10_State.requestType;
    const messages = {
      'quotation': 'Your quotation request has been submitted successfully. Our team will review your specifications and send you a detailed quote within 24-48 hours.',
      'sample-request': 'Your sample request has been submitted successfully. Production will begin immediately and samples will be shipped according to the specified timeframes.',
      'bulk-order-request': 'Your bulk order has been submitted successfully. Our team will review your order and contact you within 24 hours to confirm details and arrange the deposit.'
    };

    if (successMessage) {
      successMessage.textContent = messages[requestType] || messages['quotation'];
    }

    if (successDetails) {
      const costs = this.calculateCosts();
      successDetails.innerHTML = `
        <div class="success-detail">
          <strong>Request ID:</strong> TP-${Date.now()}
        </div>
        <div class="success-detail">
          <strong>Request Type:</strong> ${V10_State.requestType}
        </div>
        <div class="success-detail">
          <strong>Total Cost:</strong> ${V10_Utils.formatCurrency(costs.total)}
        </div>
        <div class="success-detail">
          <strong>Next Steps:</strong> Check your email for confirmation and updates
        </div>
      `;
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Bind close event
    const closeBtn = document.getElementById('success-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Clear state and redirect or refresh
        V10_State.clear();
        window.location.reload();
      });
    }
  }

  saveDraft() {
    
    // Show temporary success message
    const saveDraftBtn = document.getElementById('save-draft-btn');
    if (saveDraftBtn) {
      const originalText = saveDraftBtn.innerHTML;
      saveDraftBtn.innerHTML = `
        <svg class="techpack-btn__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>
        Saved!
      `;
      
      setTimeout(() => {
        saveDraftBtn.innerHTML = originalText;
      }, 2000);
    }
  }

  // Helper methods
  getClientData() {
    // In real implementation, get from Step 1 form data
    return {
      company: 'Sample Company',
      name: 'John Doe',
      email: 'john@example.com'
    };
  }

  getUploadedFiles() {
    // In real implementation, get from Step 2 upload data
    return [];
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// ==============================================
// MAIN V10 SYSTEM MANAGER
// ==============================================

class V10_TechPackSystem {
  constructor() {
    // Singleton pattern - prevent multiple instances
    if (V10_TechPackSystem.instance) {
      return V10_TechPackSystem.instance;
    }

    this.navigator = null;
    this.garmentStudio = null;
    this.designStudio = null;
    this.validationManager = null;
    this.standaloneManager = null;
    this.reviewManager = null;
    this.initialized = false;
    
    V10_TechPackSystem.instance = this;
    this.init();
  }

  init() {
    // Prevent multiple initialization
    if (this.initialized) {
      return;
    }

    // Initialize subsystems (no need to load state since we removed persistence)
    this.navigator = new V10_StudioNavigator();
    this.garmentStudio = new V10_GarmentStudio();
    this.designStudio = new V10_DesignStudio();
    this.validationManager = new V10_ValidationManager();
    this.standaloneManager = new V10_StandaloneItemsManager();
    this.reviewManager = new V10_ReviewManager();

    // Make garment studio globally accessible for assignments
    window.v10GarmentStudio = this.garmentStudio;

    // Bind global events
    this.bindGlobalEvents();

    // Set up auto-validation
    this.setupAutoValidation();

    this.initialized = true;
    console.log('🚀 V10 TechPack System initialized');
  }

  // Static method to get instance
  static getInstance() {
    return V10_TechPackSystem.instance;
  }

  // Cleanup method
  destroy() {
    this.initialized = false;
    V10_TechPackSystem.instance = null;
    console.log('🗑️ V10_TechPackSystem destroyed');
  }

  bindGlobalEvents() {
    // Step 3 Navigation buttons
    const backBtn = document.getElementById('techpack-v10-step-3-back');
    const nextBtn = document.getElementById('techpack-v10-step-3-next');

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.goBackToStep2();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.validateStep().isValid) {
          this.proceedToStep4();
        }
      });
    }

    // Legacy navigation (keep for compatibility)
    const legacyPrevBtn = document.getElementById('step-3-prev');
    const legacyNextBtn = document.getElementById('step-3-next');

    if (legacyPrevBtn) {
      legacyPrevBtn.addEventListener('click', () => {
        // Try window.stepManager first, fallback to direct navigation
        if (window.stepManager) {
          window.stepManager.navigateToStep(2);
        } else {
          this.goBackToStep2();
        }
      });
    }

    if (legacyNextBtn) {
      legacyNextBtn.addEventListener('click', () => {
        if (this.validationManager.validateStep().isValid) {
          // Try window.stepManager first, fallback to direct navigation
          if (window.stepManager) {
            window.stepManager.navigateToStep(4);
          } else {
            this.proceedToStep4();
          }
        }
      });
    }

    // Help button
    const helpBtn = document.getElementById('step-3-help-btn');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => this.showHelpModal());
    }

    // Setup help system for all help buttons
    this.setupHelpSystem();

    // Auto-save on window unload
    window.addEventListener('beforeunload', () => {
      });
  }

  setupAutoValidation() {
    // Auto-validation is handled by individual form change events
    // No persistent state saving - validation occurs on demand
    console.log('🔄 Auto-validation setup completed (in-memory mode)');
  }

  showHelpModal() {
    const modal = document.getElementById('step-3-help-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Load help content based on request type
      this.loadHelpContent();
      
      // Bind close events
      this.bindHelpModalEvents(modal);
    }
  }

  bindHelpModalEvents(modal) {
    // Close button
    const closeBtn = modal.querySelector('.techpack-modal__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hideHelpModal());
    }

    // Backdrop click
    const backdrop = modal.querySelector('.techpack-modal__backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.hideHelpModal());
    }

    // Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        this.hideHelpModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  hideHelpModal() {
    const modal = document.getElementById('step-3-help-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      
      // Mark help as read
      this.markHelpAsRead();
    }
  }

  markHelpAsRead() {
    const helpBtn = document.getElementById('step-3-help-btn');
    if (helpBtn) {
      helpBtn.classList.remove('techpack-help-btn--warning');
      helpBtn.classList.add('techpack-help-btn--success');
      helpBtn.querySelector('span').textContent = 'GUIDE READ';
    }
  }

  setupHelpSystem() {
    // Add event listeners to all help buttons with data-help attribute
    document.querySelectorAll('[data-help]').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const helpTopic = e.target.closest('[data-help]').dataset.help;
        this.showTopicHelp(helpTopic);
      });
    });

    // Add event listeners to studio help buttons
    document.querySelectorAll('.studio-help-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const helpTopic = button.dataset.help;
        if (helpTopic) {
          this.showTopicHelp(helpTopic);
        }
      });
    });

    console.log('🔧 Help system initialized for all help buttons');
  }

  showTopicHelp(topic) {
    // Create or get help modal
    let modal = document.getElementById('topic-help-modal');
    if (!modal) {
      modal = this.createTopicHelpModal();
      document.body.appendChild(modal);
    }

    // Load content for the specific topic
    this.loadTopicHelpContent(modal, topic);

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Bind close events
    this.bindTopicHelpModalEvents(modal);
  }

  createTopicHelpModal() {
    const modal = document.createElement('div');
    modal.id = 'topic-help-modal';
    modal.className = 'techpack-modal techpack-modal--help';
    modal.innerHTML = `
      <div class="techpack-modal__backdrop"></div>
      <div class="techpack-modal__content techpack-modal__content--help">
        <div class="techpack-modal__header">
          <h3 class="techpack-modal__title" id="topic-help-title">Help Guide</h3>
          <button type="button" class="techpack-modal__close" id="close-topic-help-modal">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M15 5L5 15m0-10l10 10" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
        <div class="techpack-modal__body">
          <div class="help-content" id="topic-help-content">
            <!-- Topic-specific content will be loaded here -->
          </div>
        </div>
      </div>
    `;
    return modal;
  }

  bindTopicHelpModalEvents(modal) {
    // Close button
    const closeBtn = modal.querySelector('.techpack-modal__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close on backdrop click
    const backdrop = modal.querySelector('.techpack-modal__backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  loadTopicHelpContent(modal, topic) {
    const titleElement = modal.querySelector('#topic-help-title');
    const contentElement = modal.querySelector('#topic-help-content');
    const requestType = V10_State.requestType;

    const helpTopics = {
      'garment-studio': {
        title: 'Garment Studio Guide',
        content: `
          <h4>Purpose</h4>
          <p>Configure garment specifications for your collection. This is where you define what types of clothing items you want to create and their basic specifications.</p>
          
          <h4>How to Use</h4>
          <ol>
            <li><strong>Add Garments:</strong> Click "Add Another Garment" to create new garment entries</li>
            <li><strong>Select Garment Type:</strong> Choose from our available garment types (T-Shirt, Hoodie, Sweatshirt, etc.)</li>
            <li><strong>Configure Specifications:</strong> Based on your request type:
              <ul>
                ${requestType === 'quotation' ? '<li>Select fabric type for pricing calculations</li>' : ''}
                ${requestType === 'sample-request' ? '<li>Select fabric type and sample type (blank, custom design, etc.)</li>' : ''}
                ${requestType === 'bulk-order-request' ? '<li>Select sample reference (approved sample, with changes, or new version)</li>' : ''}
              </ul>
            </li>
            <li><strong>Review Completeness:</strong> Ensure all garments show "Complete" status before proceeding</li>
          </ol>
          
          <h4>Tips</h4>
          <ul>
            <li>Each garment can be configured independently with different specifications</li>
            <li>Use descriptive names if you have multiple similar garments</li>
            <li>The system will validate that all required fields are completed</li>
          </ul>
        `
      },
      'design-studio': {
        title: 'Design Studio Guide',
        content: `
          <h4>Purpose</h4>
          <p>Create design samples and lab dips for color/design validation. This studio helps you communicate your visual requirements clearly to our production team.</p>
          
          <h4>How to Use</h4>
          <ol>
            <li><strong>Upload Design Samples:</strong> Add images of your designs, logos, graphics, or reference materials</li>
            <li><strong>Create Lab Dips:</strong> Define specific colors that need to be matched precisely</li>
            <li><strong>Assign to Garments:</strong> Link your design samples and lab dips to specific garments from the Garment Studio</li>
            <li><strong>Add Details:</strong> Include specific instructions about placement, sizing, or techniques</li>
          </ol>
          
          <h4>Best Practices</h4>
          <ul>
            <li>Upload high-resolution images (300 DPI minimum) for best results</li>
            <li>Include Pantone color codes when available for lab dips</li>
            <li>Provide multiple angle views for complex designs</li>
            <li>Be specific about design placement and sizing requirements</li>
          </ul>
          
          <h4>File Types Accepted</h4>
          <p>JPG, PNG, PDF, AI, EPS, PSD - Maximum 10MB per file</p>
        `
      },
      'quantities-studio': {
        title: 'Quantities Studio Guide',
        content: `
          <h4>Purpose</h4>
          <p>Specify production quantities by size for each garment. This ensures we produce the exact quantities you need in each size.</p>
          
          <h4>How to Use</h4>
          <ol>
            <li><strong>Review Garments:</strong> All garments with complete specifications will appear here</li>
            <li><strong>Enter Quantities:</strong> Input the number of units needed for each size (XS, S, M, L, XL, XXL)</li>
            <li><strong>Monitor Totals:</strong> Watch the individual garment totals and overall production quantity</li>
            <li><strong>Meet Minimums:</strong> Ensure total quantity meets the minimum requirement (75 units)</li>
          </ol>
          
          <h4>Requirements</h4>
          <ul>
            <li>Minimum total order: 75 units across all garments and sizes</li>
            <li>Quantities can be distributed across different sizes as needed</li>
            <li>Each garment must have at least 1 unit in any size</li>
          </ul>
          
          <h4>Tips</h4>
          <ul>
            <li>Consider your target market when distributing sizes</li>
            <li>Medium and Large typically represent 60-70% of most orders</li>
            <li>Factor in potential shrinkage when determining quantities</li>
          </ul>
        `
      },
      'garment-types': {
        title: 'Garment Types Guide',
        content: `
          <h4>Available Garment Types</h4>
          <ul>
            <li><strong>T-Shirt:</strong> Classic short-sleeve tee, versatile for all designs</li>
            <li><strong>Long Sleeve T-Shirt:</strong> Extended sleeve version with same fit as t-shirt</li>
            <li><strong>Hoodie:</strong> Pullover with hood, front pocket, and relaxed fit</li>
            <li><strong>Zip-Up Hoodie:</strong> Full-zip version with hood and pockets</li>
            <li><strong>Sweatshirt:</strong> Pullover without hood, crew neck style</li>
            <li><strong>Sweatpants:</strong> Matching bottoms for complete sets</li>
            <li><strong>Shorts:</strong> Summer-weight bottoms, various lengths available</li>
            <li><strong>Tank Top:</strong> Sleeveless option for warm weather</li>
            <li><strong>Polo Shirt:</strong> Collared shirt with button placket</li>
            <li><strong>Hat/Cap:</strong> Headwear options including snapback and fitted styles</li>
            <li><strong>Beanie:</strong> Knit winter headwear</li>
          </ul>
          
          <h4>Choosing the Right Type</h4>
          <p>Consider your brand's style, target market, and intended use when selecting garment types. Each type has different fabric options and customization possibilities.</p>
        `
      },
      'fabric-types': {
        title: 'Fabric Types Guide',
        content: `
          <h4>Available Fabric Options</h4>
          <p>Fabric options vary by garment type. Here are our most common compositions:</p>
          
          <ul>
            <li><strong>100% Cotton:</strong> Natural, breathable, classic feel - best for traditional looks</li>
            <li><strong>Cotton/Polyester Blends:</strong> Balanced performance, reduced shrinkage, easier care</li>
            <li><strong>100% Polyester:</strong> Moisture-wicking, durable, vibrant colors</li>
            <li><strong>Tri-Blend:</strong> Cotton/Poly/Rayon mix for ultra-soft feel</li>
            <li><strong>French Terry:</strong> Lightweight with textured inside, perfect for hoodies</li>
            <li><strong>Fleece:</strong> Warm, insulating fabric for winter garments</li>
          </ul>
          
          <h4>Fabric Considerations</h4>
          <ul>
            <li><strong>Print Compatibility:</strong> Different fabrics work better with specific printing methods</li>
            <li><strong>Shrinkage:</strong> 100% cotton may shrink more than blends</li>
            <li><strong>Feel:</strong> Cotton feels more natural, polyester more technical</li>
            <li><strong>Durability:</strong> Blends often last longer with frequent washing</li>
          </ul>
        `
      },
      'sample-reference': {
        title: 'Sample Reference Guide',
        content: `
          <h4>Sample Reference Options</h4>
          
          <div style="margin-bottom: 1.5rem;">
            <h5>✅ Approved Sample – As Is</h5>
            <p>Use this when you want to produce exactly the same as a previously approved sample with no changes whatsoever.</p>
            <strong>Best for:</strong> Repeat orders, proven designs, consistent production
          </div>
          
          <div style="margin-bottom: 1.5rem;">
            <h5>🔄 Approved Sample – With Changes</h5>
            <p>Use this when you have an approved sample but want to make modifications like different colors, sizing adjustments, or minor design changes.</p>
            <strong>Best for:</strong> Seasonal updates, color variations, minor improvements
          </div>
          
          <div style="margin-bottom: 1.5rem;">
            <h5>📋 New Sample Version</h5>
            <p>Use this for completely new designs or major revisions that require fresh sample development.</p>
            <strong>Best for:</strong> New designs, significant changes, first-time orders
          </div>
          
          <h4>Important Notes</h4>
          <ul>
            <li>Reference samples must be available for our team to review</li>
            <li>Changes from approved samples may affect timeline and cost</li>
            <li>Include detailed notes about any modifications needed</li>
          </ul>
        `
      },
      'sample-types': {
        title: 'Sample Types Guide',
        content: `
          <h4>Sample Type Options</h4>
          
          <div style="margin-bottom: 1.5rem;">
            <h5>🧩 Blank Sample</h5>
            <p>Plain garment without any customization - perfect for testing fit, fabric, and construction quality.</p>
            <strong>Timeline:</strong> 3-5 business days
          </div>
          
          <div style="margin-bottom: 1.5rem;">
            <h5>🎨 Custom Design Sample</h5>
            <p>Fully customized sample with your designs, colors, and specifications applied.</p>
            <strong>Timeline:</strong> 7-10 business days
          </div>
          
          <div style="margin-bottom: 1.5rem;">
            <h5>🌈 Color Matching Sample</h5>
            <p>Sample focused on achieving precise color matching to your specifications or Pantone codes.</p>
            <strong>Timeline:</strong> 5-7 business days
          </div>
          
          <h4>Choosing the Right Sample Type</h4>
          <ul>
            <li><strong>Start with blank samples</strong> if you're unsure about fit or fabric</li>
            <li><strong>Use custom design samples</strong> to see your complete vision realized</li>
            <li><strong>Order color matching samples</strong> when exact color is critical</li>
            <li>You can order multiple sample types for the same garment</li>
          </ul>
        `
      }
    };

    const topicData = helpTopics[topic];
    if (topicData) {
      titleElement.textContent = topicData.title;
      contentElement.innerHTML = topicData.content;
    } else {
      titleElement.textContent = 'Help Guide';
      contentElement.innerHTML = '<p>Help content for this topic is being developed. Please contact support if you need assistance.</p>';
    }
  }

  loadHelpContent() {
    const helpContent = document.getElementById('help-content');
    const requestType = V10_State.requestType;
    
    if (!helpContent) return;

    const content = {
      'quotation': `
        <h4>Quotation Request Guide</h4>
        <p>Configure garment specifications to receive accurate pricing without any payment required.</p>
        
        <h4>What You'll Do:</h4>
        <ul>
          <li><strong>Garment Studio:</strong> Select garment types and fabric options</li>
          <li><strong>Add Multiple Garments:</strong> Configure different products in one request</li>
          <li><strong>Complete Specifications:</strong> The more details you provide, the more accurate your quote</li>
        </ul>

        <h4>What You'll Receive:</h4>
        <ul>
          <li>Detailed pricing breakdown within 24-48 hours</li>
          <li>Minimum quantity requirements</li>
          <li>Production timeline estimates</li>
          <li>Shipping cost calculations</li>
        </ul>

        <h4>Pro Tips:</h4>
        <ul>
          <li>Select premium fabrics for best quality results</li>
          <li>Consider multiple fabric options to compare pricing</li>
          <li>Note any special requirements in your uploaded files</li>
        </ul>
      `,
      'sample-request': `
        <h4>Sample Request Guide</h4>
        <p>Use our professional Design Studios to create the perfect samples for approval before production.</p>
        
        <h4>Studio System:</h4>
        <ul>
          <li><strong>Garment Studio:</strong> Configure garment specifications and sample types</li>
          <li><strong>Design Studio:</strong> Toggle between Lab Dips (colors) and Design Samples</li>
          <li><strong>Assignment System:</strong> Assign colors and designs to specific garments</li>
        </ul>

        <h4>Sample Types:</h4>
        <ul>
          <li><strong>Stock Color Sample (€35):</strong> Quick 1-2 week turnaround in black, off-white, or random stock color</li>
          <li><strong>Custom Color Sample (€65):</strong> Exact Pantone match in 3 weeks - requires Lab Dip assignment</li>
          <li><strong>As Per TechPack (Premium):</strong> Complete specifications as uploaded - comprehensive but higher cost</li>
        </ul>

        <h4>Lab Dips & Design Samples:</h4>
        <ul>
          <li><strong>Lab Dips (€25 each):</strong> Physical color swatches - assign to garments or order as fabric swatches</li>
          <li><strong>Design Samples (€15 each):</strong> Design applications on fabric - specify embroidery, screen print, etc.</li>
          <li><strong>Smart Assignment:</strong> Items not assigned to garments become standalone fabric samples</li>
        </ul>

        <h4>Pro Tips:</h4>
        <ul>
          <li>Start with stock samples for fit validation before investing in custom colors</li>
          <li>Use our Pantone matching system for exact color reproduction</li>
          <li>Assign designs to both stock and custom samples to see different applications</li>
          <li>Fabric-only swatches are perfect for color approval before bulk production</li>
        </ul>
      `,
      'bulk-order-request': `
        <h4>Bulk Order Request Guide</h4>
        <p>Place your production order based on approved samples with exact quantities and specifications.</p>
        
        <h4>Requirements:</h4>
        <ul>
          <li><strong>Minimum Order:</strong> 75 units total across all garments</li>
          <li><strong>Approved Samples:</strong> Reference previously approved samples for consistency</li>
          <li><strong>Size Breakdown:</strong> Specify exact quantities per size (XXS-XXL)</li>
          <li><strong>Color Specifications:</strong> Use approved Pantone codes or lab dip references</li>
        </ul>

        <h4>Sample Reference Options:</h4>
        <ul>
          <li><strong>Approved Sample – As Is:</strong> Exact repeat of last approved sample</li>
          <li><strong>Approved Sample – With Changes:</strong> Based on approved sample with modifications</li>
          <li><strong>New Sample Version:</strong> Follow TechPack exactly for reworks or updated production runs</li>
        </ul>

        <h4>Production Process:</h4>
        <ul>
          <li><strong>Order Review:</strong> 24-hour confirmation and deposit arrangement</li>
          <li><strong>50% Deposit:</strong> Required to begin production</li>
          <li><strong>Production Timeline:</strong> 2-4 weeks depending on quantity and complexity</li>
          <li><strong>Quality Control:</strong> Pre-production sample approval</li>
        </ul>

        <h4>Pro Tips:</h4>
        <ul>
          <li>Reference your most recent approved sample to avoid confusion</li>
          <li>Consider standard size runs (more S/M/L, fewer XXS/XXL) for cost efficiency</li>
          <li>Plan production timeline around your launch dates</li>
          <li>Communicate any deadline requirements in your uploaded files</li>
        </ul>
      `
    };

    helpContent.innerHTML = content[requestType] || content['sample-request'];
  }

  // Public API
  setRequestType(type) {
    this.navigator.setRequestType(type);
    this.updateGlobalSectionVisibility(type);
    this.validationManager.revalidate();
    this.standaloneManager.updateDisplay();
  }

  updateGlobalSectionVisibility(requestType) {
    // Update all sections with data-show-for attributes globally
    document.querySelectorAll('[data-show-for]').forEach(section => {
      const showFor = section.dataset.showFor.split(',').map(type => type.trim());
      const shouldShow = showFor.some(type => {
        if (type === 'quotation') return requestType === 'quotation';
        if (type === 'sample') return requestType === 'sample-request';
        if (type === 'bulk') return requestType === 'bulk-order-request';
        return false;
      });
      
      section.style.display = shouldShow ? 'block' : 'none';
    });
    
    console.log(`🔄 Global section visibility updated for request type: ${requestType}`);
  }

  getOrderSummary() {
    const garments = this.garmentStudio.getAllGarments();
    const labDips = Array.from(V10_State.labDips.values());
    const designs = Array.from(V10_State.designSamples.values());
    
    return {
      requestType: V10_State.requestType,
      garments,
      labDips,
      designs,
      assignments: {
        labDips: Object.fromEntries(V10_State.assignments.labDips),
        designs: Object.fromEntries(V10_State.assignments.designs)
      },
      validation: this.validationManager.validateStep()
    };
  }

  reset() {
    if (confirm('Reset all data? This action cannot be undone.')) {
      V10_State.clear();
      location.reload();
    }
  }

  // Navigation Methods
  goBackToStep2() {
    const step2 = document.getElementById('techpack-v10-step-2');
    const step3 = document.getElementById('techpack-v10-step-3');
    
    if (step2 && step3) {
      step3.style.display = 'none';
      step2.style.display = 'block';
      
      // Update current step
      sessionStorage.setItem('v10_current_step', '2');
      
      // Scroll to step 2
      step2.scrollIntoView({ behavior: 'smooth' });
    }
  }

  proceedToStep4() {
    try {
      const step3 = document.getElementById('techpack-v10-step-3');
      const step4 = document.getElementById('techpack-v10-step-4');
      
      if (!step3 || !step4) {
        console.error('Cannot find step 3 or step 4 elements');
        return false;
      }

      step3.style.display = 'none';
      step4.style.display = 'block';
      
      // Update current step
      try {
        sessionStorage.setItem('v10_current_step', '4');
      } catch (storageError) {
        console.error('Error updating session storage:', storageError);
      }
      
      // Initialize review manager if not already done
      if (!window.v10ReviewManager) {
        try {
          window.v10ReviewManager = new V10_ReviewManager();
        } catch (managerError) {
          console.error('Error initializing review manager:', managerError);
        }
      }
      
      // Scroll to step 4
      try {
        step4.scrollIntoView({ behavior: 'smooth' });
      } catch (scrollError) {
        console.error('Error scrolling to step 4:', scrollError);
        // Fallback: simple scroll
        step4.scrollIntoView();
      }
      
      return true;
    } catch (error) {
      console.error('Error proceeding to step 4:', error);
      return false;
    }
  }

  validateStep() {
    return this.validationManager.validateStep();
  }
}

// ==============================================
// V10 CLIENT MANAGER (STEP 1)
// ==============================================

class V10_ClientManager {
  constructor() {
    this.currentRequestType = null;
    this.formData = new Map();
    
    // Initialize step 1 if present
    if (document.getElementById('techpack-v10-step-1')) {
      this.init();
    }
  }

  init() {
    this.setupRequestTypeHandling();
    this.setupFormValidation();
    this.setupNavigation();
    this.setupConditionalSections();
    this.loadSavedData();
  }

  setupRequestTypeHandling() {
    const requestTypeInputs = document.querySelectorAll('input[name="submission_type"]');
    
    requestTypeInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.currentRequestType = e.target.value;
          this.updateConditionalSections();
          this.saveData();
          this.validateForm();
          
          // Update global state
          if (window.V10_State) {
            V10_State.requestType = e.target.value;
                  }
        }
      });
    });
  }

  setupFormValidation() {
    const form = document.getElementById('techpack-v10-client-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.validateField(input);
        this.saveData();
        this.validateForm();
      });
      
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
    });
  }

  setupNavigation() {
    const nextBtn = document.getElementById('techpack-v10-step-1-next');
    const backBtn = document.getElementById('techpack-v10-step-1-back');
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.validateForm()) {
          this.proceedToStep2();
        }
      });
    }
    
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        // Handle going back (if implementing multi-step in single page)
        console.log('Go back requested');
      });
    }
  }

  setupConditionalSections() {
    // Set up conditional visibility for different request types
    this.updateConditionalSections();
  }

  updateConditionalSections() {
    const deliveryStudio = document.getElementById('delivery-address-studio');
    const timelineStudio = document.getElementById('timeline-studio');
    
    if (!this.currentRequestType) return;
    
    // Show delivery address for sample and bulk requests
    if (deliveryStudio) {
      if (this.currentRequestType === 'sample-request' || this.currentRequestType === 'bulk-order-request') {
        deliveryStudio.style.display = 'block';
        this.setFieldsRequired(deliveryStudio, true);
      } else {
        deliveryStudio.style.display = 'none';
        this.setFieldsRequired(deliveryStudio, false);
      }
    }
    
    // Show timeline for all except quotations
    if (timelineStudio) {
      if (this.currentRequestType !== 'quotation') {
        timelineStudio.style.display = 'block';
      } else {
        timelineStudio.style.display = 'none';
      }
    }
  }

  setFieldsRequired(container, required) {
    const fields = container.querySelectorAll('input[required], select[required]');
    fields.forEach(field => {
      if (required) {
        field.setAttribute('required', '');
      } else {
        field.removeAttribute('required');
      }
    });
  }

  validateField(field) {
    const fieldContainer = field.closest('.v10-form-field');
    const validationMessage = fieldContainer?.querySelector('.v10-validation-message');
    
    if (field.hasAttribute('required') && !field.value.trim()) {
      this.showFieldError(field, 'Required');
      return false;
    }
    
    if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(field.value)) {
        this.showFieldError(field, 'Valid email required');
        return false;
      }
    }
    
    this.clearFieldError(field);
    return true;
  }

  showFieldError(field, message) {
    let errorElement = field.parentNode.querySelector('.v10-form-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'v10-form-error';
      field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    field.style.borderColor = 'var(--v10-accent-orange)';
  }

  clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.v10-form-error');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
    field.style.borderColor = '';
  }

  validateForm() {
    const form = document.getElementById('techpack-v10-client-form');
    if (!form) {
      // If form doesn't exist yet, just check if request type is selected
      const nextBtn = document.getElementById('techpack-v10-step-1-next');
      if (nextBtn) {
        nextBtn.disabled = !this.currentRequestType;
      }
      return !!this.currentRequestType;
    }
    
    let isValid = true;
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    
    // Check if request type is selected
    if (!this.currentRequestType) {
      isValid = false;
    }
    
    // Validate all required fields
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    // Update next button state
    const nextBtn = document.getElementById('techpack-v10-step-1-next');
    if (nextBtn) {
      nextBtn.disabled = !isValid;
    }
    
    return isValid;
  }

  saveData() {
    const form = document.getElementById('techpack-v10-client-form');
    if (!form) {
      // Fallback: if form doesn't exist yet, just save the submission type
      const data = { submission_type: this.currentRequestType };
      localStorage.setItem('v10_step1_data', JSON.stringify(data));
      if (window.V10_State) {
        V10_State.clientInfo = data;
          }
      return;
    }
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    data.submission_type = this.currentRequestType;
    
    // Save to localStorage
    localStorage.setItem('v10_step1_data', JSON.stringify(data));
    
    // Update global state if available
    if (window.V10_State) {
      V10_State.clientInfo = data;
      }
  }

  loadSavedData() {
    const savedData = localStorage.getItem('v10_step1_data');
    if (!savedData) return;
    
    try {
      const data = JSON.parse(savedData);
      
      // Restore form values
      Object.entries(data).forEach(([key, value]) => {
        const field = document.querySelector(`[name="${key}"]`);
        if (field) {
          if (field.type === 'radio') {
            const radioButton = document.querySelector(`[name="${key}"][value="${value}"]`);
            if (radioButton) {
              radioButton.checked = true;
              if (key === 'submission_type') {
                this.currentRequestType = value;
              }
            }
          } else {
            field.value = value;
          }
        }
      });
      
      this.updateConditionalSections();
      this.validateForm();
      
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }

  proceedToStep2() {
    // Hide step 1 and show step 2
    const step1 = document.getElementById('techpack-v10-step-1');
    const step2 = document.getElementById('techpack-v10-step-2');
    
    if (step1 && step2) {
      step1.style.display = 'none';
      step2.style.display = 'block';
      
      // Update current step
      sessionStorage.setItem('v10_current_step', '2');
      
      // Initialize file manager if not already done
      if (!window.v10FileManager) {
        window.v10FileManager = new V10_FileManager();
      }
    }
  }

  getClientData() {
    return JSON.parse(localStorage.getItem('v10_step1_data') || '{}');
  }
}

// ==============================================
// V10 FILE MANAGER (STEP 2)
// ==============================================

class V10_FileManager {
  constructor() {
    this.uploadedFiles = new Map();
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.maxFiles = 10;
    this.allowedTypes = ['.pdf', '.ai', '.png', '.jpg', '.jpeg', '.zip'];
    
    // Initialize step 2 if present
    if (document.getElementById('techpack-v10-step-2')) {
      this.init();
    }
  }

  init() {
    this.setupUploadZone();
    this.setupMeasurementRequirements();
    this.setupNavigation();
    this.loadSavedFiles();
    this.updateConditionalSections();
  }

  setupUploadZone() {
    const uploadZone = document.getElementById('techpack-v10-upload-zone');
    const fileInput = document.getElementById('techpack-v10-file-input');
    const addMoreBtn = document.getElementById('techpack-v10-add-more-files');
    
    if (!uploadZone || !fileInput) return;
    
    // File input change
    fileInput.addEventListener('change', (e) => {
      this.handleFiles(e.target.files);
      e.target.value = ''; // Reset input
    });
    
    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('v10-upload-zone--dragover');
    });
    
    uploadZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('v10-upload-zone--dragover');
    });
    
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('v10-upload-zone--dragover');
      this.handleFiles(e.dataTransfer.files);
    });
    
    // Add more files button
    if (addMoreBtn) {
      addMoreBtn.addEventListener('click', () => {
        fileInput.click();
      });
    }
  }

  setupMeasurementRequirements() {
    const measurementStudio = document.getElementById('techpack-v10-measurement-studio');
    if (!measurementStudio) return;
    
    const checkboxes = measurementStudio.querySelectorAll('.v10-measurement-checkbox-input');
    const warningBox = document.getElementById('techpack-v10-measurement-warning');
    
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateMeasurementWarning();
        this.validateMeasurements();
        this.saveData();
      });
    });
  }

  updateMeasurementWarning() {
    const measurementStudio = document.getElementById('techpack-v10-measurement-studio');
    const warningBox = document.getElementById('techpack-v10-measurement-warning');
    
    if (!measurementStudio || !warningBox) return;
    
    const checkboxes = measurementStudio.querySelectorAll('.v10-measurement-checkbox-input');
    const hasCheckedBoxes = Array.from(checkboxes).some(cb => cb.checked);
    
    if (hasCheckedBoxes) {
      warningBox.style.display = 'flex';
      warningBox.style.animation = 'slideDown 0.3s ease-out';
    } else {
      warningBox.style.display = 'none';
    }
  }

  setupNavigation() {
    const nextBtn = document.getElementById('techpack-v10-step-2-next');
    const backBtn = document.getElementById('techpack-v10-step-2-back');
    
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (this.validateStep()) {
          // Check if measurement confirmation is needed
          if (this.needsMeasurementConfirmation()) {
            this.showMeasurementConfirmationModal();
          } else {
            this.proceedToStep3();
          }
        }
      });
    }
    
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.goBackToStep1();
      });
    }
    
    // Setup measurement confirmation modal handlers
    this.setupMeasurementModal();
  }

  needsMeasurementConfirmation() {
    const clientData = window.v10ClientManager?.getClientData() || {};
    const requestType = clientData.submission_type;
    
    // Only show confirmation for quotation and sample requests
    if (requestType !== 'quotation' && requestType !== 'sample-request') {
      return false;
    }
    
    const measurementStudio = document.getElementById('techpack-v10-measurement-studio');
    if (!measurementStudio || measurementStudio.style.display === 'none') {
      return false;
    }
    
    const checkboxes = measurementStudio.querySelectorAll('.v10-measurement-checkbox-input');
    const checkedBoxes = Array.from(checkboxes).filter(cb => cb.checked);
    
    // Show confirmation if no measurements are selected or only some are selected
    return checkedBoxes.length < checkboxes.length;
  }

  showMeasurementConfirmationModal() {
    const modal = document.getElementById('techpack-v10-measurement-modal');
    const title = document.getElementById('v10-measurement-modal-title');
    const message = document.getElementById('v10-measurement-modal-message');
    const details = document.getElementById('v10-measurement-modal-details');
    const proceedBtn = document.getElementById('v10-measurement-modal-proceed');
    
    if (!modal) return;
    
    const clientData = window.v10ClientManager?.getClientData() || {};
    const requestType = clientData.submission_type;
    
    const measurementStudio = document.getElementById('techpack-v10-measurement-studio');
    const checkboxes = measurementStudio.querySelectorAll('.v10-measurement-checkbox-input');
    const checkedBoxes = Array.from(checkboxes).filter(cb => cb.checked);
    const uncheckedBoxes = Array.from(checkboxes).filter(cb => !cb.checked);
    
    // Configure modal content based on situation
    if (checkedBoxes.length === 0) {
      // No measurements selected
      title.textContent = 'No Measurements Selected';
      message.textContent = `Your ${requestType === 'quotation' ? 'quotation' : 'sample request'} indicates no measurement data is included. This may affect pricing accuracy and development timeline.`;
      
      details.innerHTML = `
        <div class="v10-modal-warning-list">
          <h4>Missing Requirements:</h4>
          <ul>
            ${uncheckedBoxes.map(cb => {
              const label = cb.closest('.v10-measurement-item').querySelector('strong').textContent;
              return `<li>${label}</li>`;
            }).join('')}
          </ul>
        </div>
      `;
      
      proceedBtn.style.display = 'inline-flex';
      proceedBtn.textContent = 'Continue Without Measurements';
    } else {
      // Some measurements missing
      title.textContent = 'Incomplete Measurements';
      message.textContent = `You've indicated some measurement data is included, but other measurements are missing. Please confirm this is correct.`;
      
      details.innerHTML = `
        <div class="v10-modal-status-grid">
          <div class="v10-modal-status-section">
            <h4 class="v10-modal-status-title v10-modal-status-title--included">Included:</h4>
            <ul class="v10-modal-status-list">
              ${checkedBoxes.map(cb => {
                const label = cb.closest('.v10-measurement-item').querySelector('strong').textContent;
                return `<li>${label}</li>`;
              }).join('')}
            </ul>
          </div>
          <div class="v10-modal-status-section">
            <h4 class="v10-modal-status-title v10-modal-status-title--missing">Missing:</h4>
            <ul class="v10-modal-status-list">
              ${uncheckedBoxes.map(cb => {
                const label = cb.closest('.v10-measurement-item').querySelector('strong').textContent;
                return `<li>${label}</li>`;
              }).join('')}
            </ul>
          </div>
        </div>
      `;
      
      proceedBtn.style.display = 'inline-flex';
      proceedBtn.textContent = 'Confirm & Continue';
    }
    
    modal.style.display = 'flex';
  }

  setupMeasurementModal() {
    const modal = document.getElementById('techpack-v10-measurement-modal');
    const backBtn = document.getElementById('v10-measurement-modal-back');
    const proceedBtn = document.getElementById('v10-measurement-modal-proceed');
    
    if (!modal) return;
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
    
    // Go back to add measurements
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }
    
    // Proceed anyway
    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        this.proceedToStep3();
      });
    }
  }

  updateConditionalSections() {
    const clientData = window.v10ClientManager?.getClientData() || {};
    const requestType = clientData.submission_type;
    
    const measurementStudio = document.getElementById('techpack-v10-measurement-studio');
    const designPlacementCard = document.getElementById('techpack-v10-design-placement-card');
    
    // Show measurement requirements for quotation and sample requests
    if (measurementStudio) {
      if (requestType === 'quotation' || requestType === 'sample-request') {
        measurementStudio.style.display = 'block';
      } else {
        measurementStudio.style.display = 'none';
      }
    }
    
    // Show design placement for sample requests only
    if (designPlacementCard) {
      if (requestType === 'sample-request') {
        designPlacementCard.style.display = 'block';
      } else {
        designPlacementCard.style.display = 'none';
      }
    }
  }

  handleFiles(files) {
    const fileArray = Array.from(files);
    
    // Check total file count
    if (this.uploadedFiles.size + fileArray.length > this.maxFiles) {
      this.showError(`Maximum ${this.maxFiles} files allowed`);
      return;
    }
    
    fileArray.forEach(file => {
      if (this.validateFile(file)) {
        this.addFile(file);
      }
    });
    
    this.updateAddMoreButton();
    this.validateStep();
  }

  validateFile(file) {
    // Check file size
    if (file.size > this.maxFileSize) {
      this.showError(`File "${file.name}" is too large. Maximum size is 10MB.`);
      return false;
    }
    
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!this.allowedTypes.includes(fileExtension)) {
      this.showError(`File type "${fileExtension}" is not allowed.`);
      return false;
    }
    
    return true;
  }

  addFile(file) {
    const fileId = Date.now() + Math.random();
    const fileData = {
      id: fileId,
      file: file,
      name: file.name,
      size: this.formatFileSize(file.size),
      type: '',
      uploaded: false
    };
    
    this.uploadedFiles.set(fileId, fileData);
    this.renderFileCard(fileData);
    this.saveData();
  }

  renderFileCard(fileData) {
    const filesContainer = document.getElementById('techpack-v10-uploaded-files');
    const template = document.getElementById('techpack-v10-file-item-template');
    
    if (!filesContainer || !template) return;
    
    const clone = template.content.cloneNode(true);
    const fileCard = clone.querySelector('.v10-file-card');
    
    fileCard.setAttribute('data-file-id', fileData.id);
    clone.querySelector('.v10-file-name').textContent = fileData.name;
    clone.querySelector('.v10-file-size').textContent = fileData.size;
    
    // Setup file type selection
    const typeSelect = clone.querySelector('.v10-file-type-select');
    typeSelect.addEventListener('change', (e) => {
      fileData.type = e.target.value;
      this.validateStep();
      this.saveData();
    });
    
    // Setup remove button
    const removeBtn = clone.querySelector('.v10-file-remove');
    removeBtn.addEventListener('click', () => {
      this.removeFile(fileData.id);
    });
    
    filesContainer.appendChild(clone);
  }

  removeFile(fileId) {
    this.uploadedFiles.delete(fileId);
    
    const fileCard = document.querySelector(`[data-file-id="${fileId}"]`);
    if (fileCard) {
      fileCard.remove();
    }
    
    this.updateAddMoreButton();
    this.validateStep();
    this.saveData();
  }

  updateAddMoreButton() {
    const addMoreBtn = document.getElementById('techpack-v10-add-more-files');
    if (!addMoreBtn) return;
    
    if (this.uploadedFiles.size > 0 && this.uploadedFiles.size < this.maxFiles) {
      addMoreBtn.style.display = 'block';
    } else {
      addMoreBtn.style.display = 'none';
    }
  }

  validateMeasurements() {
    const measurementStudio = document.getElementById('techpack-v10-measurement-studio');
    if (!measurementStudio || measurementStudio.style.display === 'none') return true;
    
    const checkboxes = measurementStudio.querySelectorAll('input[type="checkbox"]');
    const checked = Array.from(checkboxes).some(cb => cb.checked);
    
    const warning = document.getElementById('techpack-v10-measurement-warning');
    if (warning) {
      if (!checked && this.uploadedFiles.size > 0) {
        warning.style.display = 'flex';
      } else {
        warning.style.display = 'none';
      }
    }
    
    return checked || this.uploadedFiles.size === 0;
  }

  validateStep() {
    let isValid = true;
    
    // Check if files are uploaded
    if (this.uploadedFiles.size === 0) {
      isValid = false;
    }
    
    // Check if all files have types assigned
    for (let fileData of this.uploadedFiles.values()) {
      if (!fileData.type) {
        isValid = false;
        break;
      }
    }
    
    // Validate measurements if required
    if (!this.validateMeasurements()) {
      isValid = false;
    }
    
    // Update next button
    const nextBtn = document.getElementById('techpack-v10-step-2-next');
    if (nextBtn) {
      nextBtn.disabled = !isValid;
    }
    
    return isValid;
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  showError(message) {
    // You could implement a toast notification system here
    console.error(message);
    alert(message); // Simple fallback
  }

  saveData() {
    const data = {
      files: Array.from(this.uploadedFiles.values()).map(fileData => ({
        id: fileData.id,
        name: fileData.name,
        size: fileData.size,
        type: fileData.type
      })),
      measurements: this.getMeasurementData()
    };
    
    localStorage.setItem('v10_step2_data', JSON.stringify(data));
    
    // Update global state if available
    if (window.V10_State) {
      V10_State.fileData = data;
      }
  }

  getMeasurementData() {
    const measurementStudio = document.getElementById('techpack-v10-measurement-studio');
    if (!measurementStudio) return {};
    
    const checkboxes = measurementStudio.querySelectorAll('input[type="checkbox"]');
    const data = {};
    
    checkboxes.forEach(checkbox => {
      data[checkbox.name] = checkbox.checked;
    });
    
    return data;
  }

  loadSavedFiles() {
    const savedData = localStorage.getItem('v10_step2_data');
    if (!savedData) return;
    
    try {
      const data = JSON.parse(savedData);
      
      // Restore measurement checkboxes
      if (data.measurements) {
        Object.entries(data.measurements).forEach(([name, checked]) => {
          const checkbox = document.querySelector(`input[name="${name}"]`);
          if (checkbox) {
            checkbox.checked = checked;
          }
        });
      }
      
      this.validateMeasurements();
      this.validateStep();
      
    } catch (error) {
      console.error('Error loading saved files:', error);
    }
  }

  goBackToStep1() {
    const step1 = document.getElementById('techpack-v10-step-1');
    const step2 = document.getElementById('techpack-v10-step-2');
    
    if (step1 && step2) {
      step1.style.display = 'block';
      step2.style.display = 'none';
    }
  }

  proceedToStep3() {
    try {
      const step2 = document.getElementById('techpack-v10-step-2');
      const step3 = document.getElementById('techpack-v10-step-3');
      
      if (!step2 || !step3) {
        console.error('Cannot find step 2 or step 3 elements');
        return false;
      }

      step2.style.display = 'none';
      step3.style.display = 'block';
      
      // Update current step
      try {
        sessionStorage.setItem('v10_current_step', '3');
      } catch (storageError) {
        console.error('Error updating session storage:', storageError);
      }
      
      // Initialize step 3 if not already done
      if (!window.v10TechPackSystem) {
        try {
          window.v10TechPackSystem = new V10_TechPackSystem();
          console.log('✅ TechPack System initialized successfully');
        } catch (systemError) {
          console.error('❌ Error initializing TechPack System:', systemError);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error proceeding to step 3:', error);
      return false;
    }
  }

  getFileData() {
    return JSON.parse(localStorage.getItem('v10_step2_data') || '{}');
  }
}

// ==============================================
// V10 MODAL SYSTEM
// ==============================================

class V10_ModalManager {
  constructor() {
    this.currentClientType = null;
    this.currentSubmissionType = null;
    this.modals = new Map();
    
    this.init();
  }

  init() {
    this.initializeModals();
    this.setupEventListeners();
    this.setupModalInteractions();
  }

  initializeModals() {
    // Register all modals
    const clientModal = document.getElementById('v10-client-verification-modal');
    const submissionModal = document.getElementById('v10-submission-type-modal');
    
    if (clientModal) this.modals.set('client-verification', clientModal);
    if (submissionModal) this.modals.set('submission-type', submissionModal);
  }

  setupEventListeners() {
    // Hero button to open client verification modal
    const heroBtn = document.getElementById('v10-open-client-modal');
    if (heroBtn) {
      heroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openModal('client-verification');
      });
    }

    // Modal close buttons
    document.querySelectorAll('.v10-modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const modal = e.target.closest('.v10-modal-overlay');
        if (modal) {
          this.closeModal(modal);
        }
      });
    });

    // Modal overlay clicks (close modal) - using event delegation
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('v10-modal-overlay')) {
        this.closeModal(e.target);
      }
    });

    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  setupModalInteractions() {
    // Client type selection
    const registeredBtn = document.getElementById('v10-registered-client');
    const newClientBtn = document.getElementById('v10-new-client');

    if (registeredBtn) {
      registeredBtn.addEventListener('click', () => {
        this.selectClientType('registered');
      });
    }

    if (newClientBtn) {
      newClientBtn.addEventListener('click', () => {
        this.selectClientType('new');
      });
    }

    // Submission type selection
    const submissionBtns = document.querySelectorAll('.v10-submission-option');
    submissionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const submissionType = btn.getAttribute('data-submission-type');
        if (submissionType && !btn.disabled) {
          this.selectSubmissionType(submissionType);
        }
      });
    });

    // Change submission type button
    const changeSubmissionBtn = document.getElementById('techpack-v10-change-submission');
    if (changeSubmissionBtn) {
      changeSubmissionBtn.addEventListener('click', () => {
        this.openModal('submission-type');
      });
    }
  }

  selectClientType(clientType) {
    this.currentClientType = clientType;
    this.closeModal('client-verification');
    
    // Update submission modal for client type
    this.updateSubmissionModalForClientType(clientType);
    this.openModal('submission-type');
  }

  updateSubmissionModalForClientType(clientType) {
    const registrationNotice = document.getElementById('v10-registration-notice');
    const registrationWarning = document.getElementById('v10-registration-warning');
    const submissionDescription = document.getElementById('v10-submission-description');
    
    // Submission buttons
    const quotationBtn = document.getElementById('v10-quotation-btn');
    const sampleBtn = document.getElementById('v10-sample-btn');
    const bulkBtn = document.getElementById('v10-bulk-btn');
    const labDipsBtn = document.getElementById('v10-lab-dips-btn');

    if (clientType === 'new') {
      // Show notice for new clients
      if (registrationNotice) registrationNotice.style.display = 'flex';
      if (registrationWarning) registrationWarning.style.display = 'none';
      
      // Update description
      if (submissionDescription) {
        submissionDescription.innerHTML = 'As a new client, you can start with a Garment Quotation to understand our process and pricing. Once we establish our partnership, you\'ll have access to all submission types.';
      }
      
      // Enable only quotation, disable others
      if (quotationBtn) quotationBtn.disabled = false;
      if (sampleBtn) sampleBtn.disabled = true;
      if (bulkBtn) bulkBtn.disabled = true;
      if (labDipsBtn) labDipsBtn.disabled = true;
      
    } else if (clientType === 'registered') {
      // Show warning for registered clients
      if (registrationNotice) registrationNotice.style.display = 'none';
      if (registrationWarning) registrationWarning.style.display = 'flex';
      
      // Update description
      if (submissionDescription) {
        submissionDescription.innerHTML = 'Select the type of submission that best matches your current needs. Each option is tailored to different stages of your garment development process.';
      }
      
      // Enable all options
      if (quotationBtn) quotationBtn.disabled = false;
      if (sampleBtn) sampleBtn.disabled = false;
      if (bulkBtn) bulkBtn.disabled = false;
      if (labDipsBtn) labDipsBtn.disabled = false;
    }
  }

  selectSubmissionType(submissionType) {
    this.currentSubmissionType = submissionType;
    this.closeModal('submission-type');
    
    // Update global state
    if (window.V10_State) {
      V10_State.requestType = submissionType;
      V10_State.clientType = this.currentClientType;
      }
    
    // Save to client manager if available
    if (window.v10ClientManager) {
      window.v10ClientManager.currentRequestType = submissionType;
      window.v10ClientManager.saveData();
    }
    
    // Update TechPack System with request type (for studio navigation)
    if (window.v10TechPackSystem) {
      window.v10TechPackSystem.setRequestType(submissionType);
      console.log(`🔄 TechPack System updated with request type: ${submissionType}`);
    }
    
    // Show the actual form and hide landing page
    this.showClientForm();
    this.updateFormForSubmissionType(submissionType);
  }

  showClientForm() {
    const landingSection = document.getElementById('techpack-v10-landing');
    const formSection = document.getElementById('techpack-v10-step-1');
    
    if (landingSection) {
      landingSection.style.display = 'none';
    }
    
    if (formSection) {
      formSection.style.display = 'block';
      formSection.scrollIntoView({ behavior: 'smooth' });
      
      // Update current step
      sessionStorage.setItem('v10_current_step', '1');
      
      // Initialize client manager if not already done
      if (!window.v10ClientManager) {
        window.v10ClientManager = new V10_ClientManager();
      } else {
        // Re-setup form validation now that form is visible
        window.v10ClientManager.setupFormValidation();
        window.v10ClientManager.validateForm();
      }
    }
  }

  updateFormForSubmissionType(submissionType) {
    console.log(`🔄 Updating form for submission type: ${submissionType}`);
    
    // Update client status badge
    const statusBadge = document.getElementById('v10-client-status-badge');
    if (statusBadge) {
      statusBadge.textContent = this.currentClientType === 'new' ? 'New Client' : 'Registered Client';
      statusBadge.style.background = this.currentClientType === 'new' 
        ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
        : 'linear-gradient(135deg, #10b981, #059669)';
    }
    
    // Update subtitle based on submission type
    const subtitle = document.getElementById('v10-client-info-subtitle');
    if (subtitle) {
      const subtitles = {
        'quotation': 'Enter your information to begin pricing development',
        'sample-request': 'Enter your information to begin sample development',
        'bulk-order-request': 'Enter your information to begin bulk order processing',
        'lab-dips-accessories': 'Enter your information to begin lab dip and accessory orders'
      };
      subtitle.textContent = subtitles[submissionType] || subtitles['quotation'];
    }
    
    // Show/hide conditional sections
    const deliveryAddressField = document.getElementById('v10-delivery-address-field');
    const deliverySection = document.getElementById('v10-delivery-section');
    const shippingSection = document.getElementById('v10-shipping-section');
    
    // Hide all conditional sections first
    if (deliveryAddressField) deliveryAddressField.style.display = 'none';
    if (deliverySection) deliverySection.style.display = 'none';
    if (shippingSection) shippingSection.style.display = 'none';
    
    // Show sections based on submission type
    switch (submissionType) {
      case 'quotation':
        // Only show base form for quotations
        break;
        
      case 'sample-request':
        // Show delivery address field for samples
        if (deliveryAddressField) {
          deliveryAddressField.style.display = 'block';
        }
        break;
        
      case 'bulk-order-request':
        // Show delivery address field and shipping sections for bulk orders
        if (deliveryAddressField) {
          deliveryAddressField.style.display = 'block';
        }
        if (shippingSection) {
          shippingSection.style.display = 'block';
        }
        break;
        
      case 'lab-dips-accessories':
        // Show delivery address field for lab dips/accessories
        if (deliveryAddressField) {
          deliveryAddressField.style.display = 'block';
        }
        break;
    }
    
    // Setup delivery address toggle functionality
    this.setupDeliveryAddressToggle();
    
    // Setup character counter for delivery notes
    this.setupCharacterCounter();
    
    // Setup enhanced country dropdowns
    this.setupEnhancedCountryDropdowns();

    // Update conditional sections if client manager exists
    if (window.v10ClientManager) {
      window.v10ClientManager.currentRequestType = submissionType;
      window.v10ClientManager.updateConditionalSections();
      window.v10ClientManager.validateForm();
    }

    // Update change submission button text
    const changeBtn = document.getElementById('techpack-v10-change-submission');
    if (changeBtn) {
      const submissionNames = {
        'quotation': 'Garment Quotation',
        'sample-request': 'Sample Request',
        'bulk-order-request': 'Bulk Order Request',
        'lab-dips-accessories': 'Lab Dips & Accessories'
      };
      changeBtn.innerHTML = `
        <svg class="v10-btn-icon v10-btn-icon--left" width="16" height="16" viewBox="0 0 16 16">
          <path d="M8 1L3 6h2v6h6V6h2L8 1z" fill="currentColor"/>
        </svg>
        Change from ${submissionNames[submissionType] || 'Current Selection'}
      `;
    }
  }

  setupDeliveryAddressToggle() {
    const deliveryRadios = document.querySelectorAll('input[name="deliveryAddress"]');
    const differentAddressForm = document.getElementById('v10-different-address-form');
    
    if (!deliveryRadios.length) return;
    
    // Remove existing listeners
    deliveryRadios.forEach(radio => {
      radio.removeEventListener('change', this.handleDeliveryAddressChange);
    });
    
    // Add new listeners
    deliveryRadios.forEach(radio => {
      radio.addEventListener('change', this.handleDeliveryAddressChange.bind(this));
    });
    
    // Setup professional validation for all enhanced form fields
    this.setupProfessionalValidation();
    
    // Initial state
    this.handleDeliveryAddressChange();
  }
  
  handleDeliveryAddressChange() {
    const selectedValue = document.querySelector('input[name="deliveryAddress"]:checked')?.value;
    const differentAddressForm = document.getElementById('v10-different-address-form');
    
    if (differentAddressForm) {
      if (selectedValue === 'different') {
        differentAddressForm.style.display = 'block';
        // Add animation class for smooth transition
        setTimeout(() => {
          differentAddressForm.classList.add('v10-form-animate-in');
        }, 50);
      } else {
        differentAddressForm.classList.remove('v10-form-animate-in');
        setTimeout(() => {
          differentAddressForm.style.display = 'none';
        }, 300);
        
        // Clear different address fields when hidden
        const inputs = differentAddressForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
          input.value = '';
          this.clearFieldValidation(input);
        });
      }
    }
  }
  
  setupProfessionalValidation() {
    const enhancedInputs = document.querySelectorAll('.v10-form-input-enhanced');
    
    enhancedInputs.forEach(input => {
      // Remove existing listeners
      input.removeEventListener('blur', this.handleFieldValidation);
      input.removeEventListener('input', this.handleFieldInput);
      
      // Add professional validation listeners
      input.addEventListener('blur', this.handleFieldValidation.bind(this));
      input.addEventListener('input', this.handleFieldInput.bind(this));
    });
  }
  
  handleFieldValidation(event) {
    const field = event.target;
    const fieldContainer = field.closest('.v10-form-field');
    const validationType = field.getAttribute('data-validate');
    
    if (!fieldContainer || !validationType) return;
    
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    let messageType = 'error';
    
    // Error-only validation logic
    switch (validationType) {
      case 'required':
        if (!value) {
          isValid = false;
          message = 'Required';
          messageType = 'error';
        }
        break;
        
      case 'email':
        // Smart email validation - check for proper domain
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        const commonDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'icloud.com'];
        
        if (!value) {
          isValid = false;
          message = 'Required';
          messageType = 'error';
        } else if (!emailRegex.test(value)) {
          isValid = false;
          message = 'Valid email required';
          messageType = 'error';
        } else {
          const domain = value.split('@')[1];
          if (domain && (commonDomains.includes(domain) || domain.includes('.'))) {
            // Valid email, clear any errors
            message = '';
          } else {
            isValid = false;
            message = 'Valid email required';
            messageType = 'error';
          }
        }
        break;
        
      case 'required-if-different':
        const isDifferentAddress = document.querySelector('input[name="deliveryAddress"]:checked')?.value === 'different';
        if (isDifferentAddress && !value) {
          isValid = false;
          message = 'Required';
          messageType = 'error';
        }
        break;
    }
    
    this.showValidationMessage(fieldContainer, messageType, message, isValid);
  }
  
  handleFieldInput(event) {
    const field = event.target;
    const fieldContainer = field.closest('.v10-form-field');
    
    // Clear error state on input
    if (fieldContainer && fieldContainer.classList.contains('v10-form-field--error')) {
      this.clearFieldValidation(field);
    }
  }
  
  showValidationMessage(fieldContainer, type, message, isValid) {
    const validationMessage = fieldContainer.querySelector('.v10-validation-message');
    
    if (!validationMessage) return;
    
    // Clear all validation states
    fieldContainer.classList.remove('v10-form-field--error', 'v10-form-field--warning');
    validationMessage.classList.remove('v10-validation-message--error', 'v10-validation-message--warning');
    
    // Only show error messages
    if (message && !isValid) {
      fieldContainer.classList.add(`v10-form-field--${type}`);
      validationMessage.classList.add(`v10-validation-message--${type}`);
      validationMessage.textContent = message;
      validationMessage.style.display = 'block';
    } else {
      // Hide validation message when field is valid
      validationMessage.style.display = 'none';
    }
  }
  
  clearFieldValidation(field) {
    const fieldContainer = field.closest('.v10-form-field');
    const validationMessage = fieldContainer?.querySelector('.v10-validation-message');
    
    if (fieldContainer) {
      fieldContainer.classList.remove('v10-form-field--error', 'v10-form-field--warning');
    }
    
    if (validationMessage) {
      validationMessage.style.display = 'none';
    }
  }
  
  getFieldLabel(field) {
    const label = field.closest('.v10-form-field')?.querySelector('.v10-form-label-enhanced');
    return label ? label.textContent.replace(' *', '').toLowerCase() : 'field';
  }
  
  getValidationIcon(type) {
    const icons = {
      success: '<svg class="v10-validation-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm3.5 6L7 10.5 4.5 8l1-1L7 8.5l3.5-3.5 1 1z"/></svg>',
      error: '<svg class="v10-validation-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"/></svg>',
      warning: '<svg class="v10-validation-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>'
    };
    return icons[type] || '';
  }
  
  setupCharacterCounter() {
    const deliveryNotesTextarea = document.querySelector('textarea[name="deliveryNotes"]');
    const counterElement = document.getElementById('v10-delivery-notes-count');
    
    if (!deliveryNotesTextarea || !counterElement) return;
    
    // Remove existing listener
    deliveryNotesTextarea.removeEventListener('input', this.updateCharacterCount);
    
    // Add new listener
    deliveryNotesTextarea.addEventListener('input', this.updateCharacterCount.bind(this));
    
    // Initial count
    this.updateCharacterCount();
  }
  
  updateCharacterCount() {
    const deliveryNotesTextarea = document.querySelector('textarea[name="deliveryNotes"]');
    const counterElement = document.getElementById('v10-delivery-notes-count');
    
    if (deliveryNotesTextarea && counterElement) {
      const currentLength = deliveryNotesTextarea.value.length;
      counterElement.textContent = currentLength;
      
      // Add visual feedback when approaching limit
      const parent = counterElement.closest('.v10-char-count');
      if (currentLength > 120) {
        parent?.classList.add('v10-char-count--warning');
      } else {
        parent?.classList.remove('v10-char-count--warning');
      }
    }
  }
  
  setupEnhancedCountryDropdowns() {
    // Setup main country dropdown
    this.setupCountryDropdown('v10-country', 'v10-country-dropdown', 'v10-country-list', 'v10-country-search');
    
    // Setup delivery country dropdown
    this.setupCountryDropdown('v10-delivery-country', 'v10-delivery-country-dropdown', 'v10-delivery-country-list', 'v10-delivery-country-search');
    
    // Setup alternate delivery country dropdown
    this.setupCountryDropdown('v10-delivery-country-alt', 'v10-delivery-country-dropdown-alt', 'v10-delivery-country-list-alt', 'v10-delivery-country-search-alt');
  }
  
  setupCountryDropdown(inputId, dropdownId, listId, searchId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    const list = document.getElementById(listId);
    const search = document.getElementById(searchId);
    const toggle = document.getElementById(inputId.replace('country', 'country-toggle'));
    
    if (!input || !dropdown || !list || !search) return;
    
    // Country data (simplified version)
    const countries = [
      { name: "United States", code: "US", flag: "🇺🇸" },
      { name: "Canada", code: "CA", flag: "🇨🇦" },
      { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
      { name: "Germany", code: "DE", flag: "🇩🇪" },
      { name: "France", code: "FR", flag: "🇫🇷" },
      { name: "Spain", code: "ES", flag: "🇪🇸" },
      { name: "Italy", code: "IT", flag: "🇮🇹" },
      { name: "Netherlands", code: "NL", flag: "🇳🇱" },
      { name: "Australia", code: "AU", flag: "🇦🇺" },
      { name: "Portugal", code: "PT", flag: "🇵🇹" }
    ];
    
    // Populate country list
    this.populateCountryList(countries, list, input, dropdown);
    
    // Setup toggle functionality
    if (toggle) {
      toggle.addEventListener('click', () => {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
      });
    }
    
    // Setup search functionality
    search.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredCountries = countries.filter(country => 
        country.name.toLowerCase().includes(searchTerm)
      );
      this.populateCountryList(filteredCountries, list, input, dropdown);
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !input.contains(e.target) && !toggle?.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  }
  
  populateCountryList(countries, list, input, dropdown) {
    list.innerHTML = '';
    
    countries.forEach(country => {
      const item = document.createElement('div');
      item.className = 'v10-country-item';
      item.innerHTML = `
        <span class="v10-country-flag">${country.flag}</span>
        <span class="v10-country-name">${country.name}</span>
      `;
      
      item.addEventListener('click', () => {
        input.value = country.name;
        input.setAttribute('data-country-code', country.code);
        
        // Update flag display if exists
        const flagElement = document.getElementById(input.id.replace('country', 'country-flag'));
        if (flagElement) {
          flagElement.textContent = country.flag;
        }
        
        dropdown.style.display = 'none';
        
        // Trigger change event
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
      
      list.appendChild(item);
    });
  }

  openModal(modalId) {
    const modal = this.modals.get(modalId) || document.getElementById(`v10-${modalId}-modal`);
    
    if (!modal) {
      console.error('Modal not found:', modalId);
      return;
    }

    // Close other modals first (but not the one we're opening)
    this.closeOtherModals(modal);
    
    // Show modal with animation
    modal.style.display = 'flex';
    
    // Trigger reflow for animation
    modal.offsetHeight;
    
    // Add active class for transition
    modal.classList.add('active');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Focus management
    this.trapFocus(modal);
  }

  closeModal(modalOrId) {
    let modal;
    
    if (typeof modalOrId === 'string') {
      modal = this.modals.get(modalOrId) || document.getElementById(`v10-${modalOrId}-modal`);
    } else {
      modal = modalOrId;
    }
    
    if (!modal) return;
    
    // Remove active class for transition
    modal.classList.remove('active');
    
    // Hide after transition
    setTimeout(() => {
      modal.style.display = 'none';
      
      // Restore body scrolling if no modals are open
      const openModals = document.querySelectorAll('.v10-modal-overlay.active');
      if (openModals.length === 0) {
        document.body.style.overflow = '';
      }
    }, 300);
  }

  closeOtherModals(exceptModal) {
    document.querySelectorAll('.v10-modal-overlay').forEach(modal => {
      if (modal !== exceptModal) {
        this.closeModal(modal);
      }
    });
  }

  closeAllModals() {
    document.querySelectorAll('.v10-modal-overlay').forEach(modal => {
      this.closeModal(modal);
    });
  }

  trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Focus first element
    firstElement.focus();
    
    // Tab trap
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }

  // Public API
  getCurrentClientType() {
    return this.currentClientType;
  }

  getCurrentSubmissionType() {
    return this.currentSubmissionType;
  }

  resetWorkflow() {
    this.currentClientType = null;
    this.currentSubmissionType = null;
    this.closeAllModals();
    
    // Show landing page, hide form
    const landingSection = document.getElementById('techpack-v10-landing');
    const formSection = document.getElementById('techpack-v10-step-1');
    
    if (landingSection) landingSection.style.display = 'block';
    if (formSection) formSection.style.display = 'none';
  }
}

// ==============================================
// INITIALIZATION
// ==============================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('🚀 V10 TechPack Studios - Initializing System...');

    // Phase 1: Initialize core managers in dependency order
    const initializeCore = async () => {
      // Initialize Modal System first (required for landing page workflow)
      try {
        if (document.getElementById('techpack-v10-landing') || 
            document.getElementById('v10-client-verification-modal') ||
            document.getElementById('v10-submission-type-modal')) {
          window.v10ModalManager = new V10_ModalManager();
          console.log('✅ Modal Manager initialized');
        }
      } catch (modalError) {
        console.error('❌ Error initializing Modal Manager:', modalError);
      }
      
      // Initialize Step 1 if present
      try {
        if (document.getElementById('techpack-v10-step-1')) {
          window.v10ClientManager = new V10_ClientManager();
          console.log('✅ Client Manager initialized');
        }
      } catch (clientError) {
        console.error('❌ Error initializing Client Manager:', clientError);
      }
      
      // Initialize Step 2 if present
      try {
        if (document.getElementById('techpack-v10-step-2')) {
          window.v10FileManager = new V10_FileManager();
          console.log('✅ File Manager initialized');
        }
      } catch (fileError) {
        console.error('❌ Error initializing File Manager:', fileError);
      }
    };

    // Phase 2: Initialize TechPack System with proper dependencies
    const initializeTechPack = () => {
      try {
        if (document.getElementById('techpack-v10-step-3')) {
          window.v10TechPackSystem = new V10_TechPackSystem();
          console.log('✅ TechPack System initialized');
          
          // Get request type from multiple sources with fallback
          let requestType = V10_State.requestType;
          
          if (!requestType && window.v10ClientManager) {
            requestType = window.v10ClientManager.currentRequestType;
          }
          
          if (!requestType) {
            try {
              requestType = sessionStorage.getItem('v10_request_type') || 'quotation';
            } catch (storageError) {
              requestType = 'quotation';
            }
          }
          
          // Ensure request type is set and system is properly configured
          V10_State.requestType = requestType;
          window.v10TechPackSystem.setRequestType(requestType);
          console.log(`🎯 Request type configured: ${requestType}`);
          
          return true;
        }
        return false;
      } catch (techpackError) {
        console.error('❌ Error initializing TechPack System:', techpackError);
        return false;
      }
    };

    // Execute initialization phases
    initializeCore().then(() => {
      // Small delay to ensure DOM is fully ready
      setTimeout(() => {
        const techPackInitialized = initializeTechPack();
        
        if (techPackInitialized) {
          console.log('🎯 V10 TechPack Studios - Full System Initialized');
        } else {
          console.log('🎯 V10 TechPack Studios - Core System Initialized');
        }
      }, 50);
    });

  } catch (error) {
    console.error('💥 Fatal error during V10 initialization:', error);
  }
});

// Export for global access
window.V10_TechPackSystem = V10_TechPackSystem;
window.V10_ClientManager = V10_ClientManager;
window.V10_FileManager = V10_FileManager;
window.V10_ModalManager = V10_ModalManager;
window.V10_State = V10_State;
window.V10_CONFIG = V10_CONFIG;

} // End of guard clause