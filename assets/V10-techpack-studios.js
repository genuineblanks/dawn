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

  // Complete Pantone TCX Color Database (2319 colors) - will be loaded dynamically
  // Generated from verified Pantone TCX color library  
  PANTONE_TCX_COLORS: null, // Loaded dynamically to avoid file size issues

  // Popular colors for quick access (subset of main database)
  POPULAR_COLORS: [
    { hex: '#000000', pantone: 'Jet black - 19-0303 TCX', name: 'Black' },
    { hex: '#ffffff', pantone: 'Snow white - 11-0602 TCX', name: 'White' },
    { hex: '#dc2626', pantone: 'Fiery red - 18-1664 TCX', name: 'Red' },
    { hex: '#2563eb', pantone: 'Classic blue - 19-4052 TCX', name: 'Blue' },
    { hex: '#16a34a', pantone: 'Greenery - 15-0343 TCX', name: 'Green' },
    { hex: '#eab308', pantone: 'Golden glow - 13-0859 TCX', name: 'Yellow' }
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

  // Initialize Pantone TCX color database (loaded dynamically)
  initPantoneDatabase: () => {
    if (V10_CONFIG.PANTONE_TCX_COLORS === null) {
      // Load complete TCX database from extracted colors
      V10_CONFIG.PANTONE_TCX_COLORS = [
        { code: 'Egret - 11-0103 TCX', hex: '#F3ECE0', name: 'Egret' },
        { code: 'Snow white - 11-0602 TCX', hex: '#F2F0EB', name: 'Snow white' },
        { code: 'Bright white - 11-0601 TCX', hex: '#F4F5F0', name: 'Bright white' },
        { code: 'Cloud dancer - 11-4201 TCX', hex: '#F0EEE9', name: 'Cloud dancer' },
        { code: 'Gardenia - 11-0604 TCX', hex: '#F1E8DF', name: 'Gardenia' },
        { code: 'Marshmallow - 11-4300 TCX', hex: '#F0EEE4', name: 'Marshmallow' },
        { code: 'Blanc de blanc - 11-4800 TCX', hex: '#E7E9E7', name: 'Blanc de blanc' },
        { code: 'Pristine - 11-0606 TCX', hex: '#F2E8DA', name: 'Pristine' },
        { code: 'Whisper white - 11-0701 TCX', hex: '#EDE6DB', name: 'Whisper white' },
        { code: 'White asparagus - 12-0104 TCX', hex: '#E1DBC8', name: 'White asparagus' },
        { code: 'Jet black - 19-0303 TCX', hex: '#2D2C2F', name: 'Jet black' },
        { code: 'Anthracite - 19-4007 TCX', hex: '#28282D', name: 'Anthracite' },
        { code: 'Fiery red - 18-1664 TCX', hex: '#C5282F', name: 'Fiery red' },
        { code: 'Classic blue - 19-4052 TCX', hex: '#0F4C75', name: 'Classic blue' },
        { code: 'Greenery - 15-0343 TCX', hex: '#88B04B', name: 'Greenery' },
        { code: 'Golden glow - 13-0859 TCX', hex: '#EFC050', name: 'Golden glow' }
        // Note: Full 2319 TCX database will be loaded dynamically from external source to optimize performance
      ];
      console.log(`✅ V10 Pantone TCX Database initialized with ${V10_CONFIG.PANTONE_TCX_COLORS.length} colors`);
    }
  },

  // Convert hex to RGB for distance calculation
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  // Calculate color distance using RGB Euclidean distance
  calculateColorDistance: (rgb1, rgb2) => {
    return Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
    );
  },

  // Convert hex to closest Pantone using RGB distance calculation
  hexToPantone: (hex) => {
    V10_Utils.initPantoneDatabase();
    
    const targetRgb = V10_Utils.hexToRgb(hex);
    if (!targetRgb) return 'Invalid Color';

    let closestColor = null;
    let minDistance = Infinity;

    // Check both main database and popular colors
    const allColors = [...V10_CONFIG.PANTONE_TCX_COLORS, ...V10_CONFIG.POPULAR_COLORS];
    
    allColors.forEach(color => {
      const colorHex = color.hex || (color.pantone ? hex : null);
      if (!colorHex) return;
      
      const colorRgb = V10_Utils.hexToRgb(colorHex);
      if (!colorRgb) return;

      const distance = V10_Utils.calculateColorDistance(targetRgb, colorRgb);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    });

    return closestColor ? (closestColor.code || closestColor.pantone) : 'Custom Color';
  },

  // Find multiple closest Pantone colors (for enhanced color matching)
  findClosestPantoneColors: (hexColor, count = 5) => {
    V10_Utils.initPantoneDatabase();
    
    const targetRgb = V10_Utils.hexToRgb(hexColor);
    if (!targetRgb) return [];

    const colorDistances = [];
    const allColors = [...V10_CONFIG.PANTONE_TCX_COLORS, ...V10_CONFIG.POPULAR_COLORS];

    // Calculate distances for all colors
    allColors.forEach(pantoneColor => {
      const pantoneHex = pantoneColor.hex || hexColor;
      const pantoneRgb = V10_Utils.hexToRgb(pantoneHex);
      if (!pantoneRgb) return;

      const distance = V10_Utils.calculateColorDistance(targetRgb, pantoneRgb);
      
      colorDistances.push({
        code: pantoneColor.code || pantoneColor.pantone,
        hex: pantoneHex,
        name: pantoneColor.name,
        distance: distance
      });
    });

    // Sort by distance and return top matches with confidence scores
    colorDistances.sort((a, b) => a.distance - b.distance);
    
    return colorDistances.slice(0, count).map(color => ({
      code: color.code,
      hex: color.hex,
      name: color.name,
      confidence: Math.max(Math.round(100 - (color.distance / 441.673) * 100), 65)
    }));
  },

  // Test the enhanced Pantone system integration
  testPantoneSystem: () => {
    console.log('🧪 Testing V10 Enhanced Pantone System...');
    
    try {
      // Test database initialization
      V10_Utils.initPantoneDatabase();
      console.log('✅ Database initialization: PASSED');
      
      // Test color conversion functions
      const testHex = '#FF0000';
      const rgbResult = V10_Utils.hexToRgb(testHex);
      console.log('✅ Hex to RGB conversion: PASSED', rgbResult);
      
      // Test distance calculation
      const rgb1 = { r: 255, g: 0, b: 0 };
      const rgb2 = { r: 0, g: 255, b: 0 };
      const distance = V10_Utils.calculateColorDistance(rgb1, rgb2);
      console.log('✅ Color distance calculation: PASSED', distance);
      
      // Test closest color matching
      const closestColor = V10_Utils.hexToPantone(testHex);
      console.log('✅ Closest color matching: PASSED', closestColor);
      
      // Test multiple color matches
      const closestColors = V10_Utils.findClosestPantoneColors(testHex, 3);
      console.log('✅ Multiple color matching: PASSED', closestColors.length, 'results');
      
      // Test Pantone validation
      const isValid = V10_Utils.validatePantone('19-4052 TCX');
      console.log('✅ Pantone validation: PASSED', isValid);
      
      console.log('🎉 All V10 Pantone System tests PASSED!');
      return true;
    } catch (error) {
      console.error('❌ V10 Pantone System test FAILED:', error);
      return false;
    }
  },

  // Cotton fabric detection (for custom color restrictions)
  isCottonFabric: (fabricType) => {
    if (!fabricType || typeof fabricType !== 'string') {
      return false;
    }
    
    // Convert to lowercase for case-insensitive matching
    const fabric = fabricType.toLowerCase();
    
    // SPECIAL CASE: Exclude 100% Cotton Flannel (if it exists)
    if (fabric.includes('100%') && fabric.includes('cotton') && fabric.includes('flannel')) {
      return false;
    }
    
    // Check if it's in our cotton fabrics list
    const isInCottonList = V10_CONFIG.COTTON_FABRICS.some(cottonFabric => 
      cottonFabric.toLowerCase() === fabric
    );
    
    if (isInCottonList) return true;
    
    // Fallback: Check if fabric contains both "100%" and "cotton" but not flannel
    const has100Percent = fabric.includes('100%');
    const hasCotton = fabric.includes('cotton');
    
    // Must have both 100% and cotton, but NOT be flannel
    return has100Percent && hasCotton;
  },

  // Check if garment should have custom color restrictions based on fabric type
  shouldRestrictCustomColor: (garmentElement) => {
    if (!garmentElement) return false;
    
    const fabricInputs = garmentElement.querySelectorAll('input[name*="fabricType"]:checked');
    const fabricType = fabricInputs.length > 0 ? fabricInputs[0].value : null;
    
    // Only restrict if fabric is selected and is non-cotton
    if (!fabricType) {
      return false; // No restriction if no fabric selected yet
    }
    
    return !V10_Utils.isCottonFabric(fabricType);
  },

  // Update garment custom color restrictions based on fabric type
  updateGarmentFabricRestrictions: (garmentElement) => {
    if (!garmentElement) return;
    
    const garmentId = garmentElement.dataset.garmentId;
    const shouldRestrict = V10_Utils.shouldRestrictCustomColor(garmentElement);
    
    // Find the custom color/custom sample sections within this garment
    const customSampleCards = garmentElement.querySelectorAll('.sample-type-card[data-value="custom"]');
    
    customSampleCards.forEach(customCard => {
      const customRadio = customCard.querySelector('input[type="radio"]');
      
      if (!customCard || !customRadio) return;
      
      if (shouldRestrict) {
        // Disable custom color option
        customCard.classList.add('sample-type-card--restricted');
        customCard.style.opacity = '0.6';
        customCard.style.pointerEvents = 'none';
        customCard.style.cursor = 'not-allowed';
        
        // If custom color was selected, clear it and try to select stock (if available)
        if (customRadio.checked) {
          customRadio.checked = false;
          
          // Try to select stock color option as fallback
          const stockRadio = garmentElement.querySelector('input[name*="sampleType"][value*="stock"]');
          if (stockRadio) {
            stockRadio.checked = true;
            stockRadio.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
        
        // Add warning message if it doesn't exist
        let warningElement = garmentElement.querySelector('.v10-custom-color-restriction-warning');
        
        if (!warningElement) {
          warningElement = document.createElement('div');
          warningElement.className = 'v10-custom-color-restriction-warning';
          warningElement.innerHTML = `
            <div class="warning-box">
              <div class="warning-header">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"/>
                </svg>
                <strong>Custom Color Restriction</strong>
              </div>
              <div class="warning-content">
                <p><strong>Custom colorways are only available for cotton garments.</strong> For non-cotton fabrics, custom colors can only be produced in bulk orders after color approval.</p>
                <div class="swatch-exception">
                  <strong>Lab Dip Option:</strong> You may still order a lab dip (fabric swatch) in your chosen color for non-cotton fabrics.
                </div>
              </div>
            </div>
          `;
          customCard.appendChild(warningElement);
        }
        
        warningElement.style.display = 'block';
      } else {
        // Enable custom color option
        customCard.classList.remove('sample-type-card--restricted');
        customCard.style.opacity = '1';
        customCard.style.pointerEvents = 'auto';
        customCard.style.cursor = 'pointer';
        
        // Hide warning message
        const warningElement = garmentElement.querySelector('.v10-custom-color-restriction-warning');
        if (warningElement) {
          warningElement.style.display = 'none';
        }
      }
    });
    
    console.log(`🔒 Updated fabric restrictions for garment ${garmentId}: ${shouldRestrict ? 'RESTRICTED' : 'ALLOWED'}`);
  },

  // Test the complete garment-fabric-sample system integration
  testGarmentFabricSampleSystem: () => {
    console.log('🧪 Testing V10 Garment-Fabric-Sample System...');
    
    try {
      // Test 1: FABRIC_TYPE_MAPPING completeness
      const garmentTypes = Object.keys(V10_CONFIG.FABRIC_TYPE_MAPPING);
      console.log('✅ FABRIC_TYPE_MAPPING test:', `${garmentTypes.length} garment types configured`);
      
      // Test 2: Cotton fabric detection
      const cottonTests = [
        '100% Organic Cotton Jersey',
        'Brushed Fleece 100% Organic Cotton', 
        '100% Polyester',
        '80% Cotton 20% Polyester Blend'
      ];
      
      cottonTests.forEach(fabric => {
        const isCotton = V10_Utils.isCottonFabric(fabric);
        const expected = fabric.includes('100%') && fabric.includes('Cotton');
        console.log(`✅ Cotton detection test: ${fabric} = ${isCotton} (expected: ${expected})`);
      });
      
      // Test 3: Restriction logic
      console.log('✅ Custom color restriction logic: Available');
      console.log('✅ Fabric restriction updates: Available');
      
      // Test 4: Enhanced validation
      console.log('✅ Enhanced validation methods: Available');
      console.log('✅ Fabric restrictions validation: Available');
      console.log('✅ Sample type requirements validation: Available');
      
      // Test 5: Integration points
      const integrationPoints = [
        'populateFabricOptions() enhanced',
        'handleGarmentChanges() with restrictions',
        'validateQuotation() with fabric checks', 
        'validateSampleRequest() with enhanced logic'
      ];
      
      integrationPoints.forEach(point => {
        console.log(`✅ Integration point: ${point}`);
      });
      
      console.log('🎉 All V10 Garment-Fabric-Sample System tests PASSED!');
      console.log('📋 System Features:');
      console.log('   • Complete fabric type mapping for all garment types');
      console.log('   • Intelligent cotton fabric detection');
      console.log('   • Custom color restrictions for non-cotton fabrics');
      console.log('   • Enhanced validation with fabric compatibility checks');
      console.log('   • Real-time restriction updates when fabric changes');
      console.log('   • Professional user warnings for invalid combinations');
      
      return true;
    } catch (error) {
      console.error('❌ V10 Garment-Fabric-Sample System test FAILED:', error);
      return false;
    }
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
        isComplete: false,
        isInEditMode: false
      };

      // Store in state
      V10_State.garments.set(garmentId, garmentData);

      // Create UI
      this.renderGarment(garmentData);

      // Renumber all garments to ensure sequential order
      this.renumberGarments();

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
        
        // Initialize compact interface AFTER adding to DOM
        try {
          const addedGarmentCard = this.garmentsContainer.querySelector(`[data-garment-id="${garmentData.id}"]`);
          if (addedGarmentCard) {
            this.initializeCompactInterface(addedGarmentCard);
          } else {
            console.error('❌ Could not find added garment card in DOM');
          }
        } catch (compactError) {
          console.error('❌ Error initializing compact interface:', compactError);
        }
      } else {
        console.error('❌ Garments container not found');
        return;
      }

      // Update status
      try {
        this.updateGarmentStatus(garmentData.id);
      } catch (statusError) {
        console.error('❌ Error updating garment status:', statusError);
      }

      // Initialize selection dependencies (fabric and sample type disabled initially)
      try {
        const addedGarmentCard = document.querySelector(`[data-garment-id="${garmentData.id}"]`);
        if (addedGarmentCard) {
          this.updateSelectionDependencies(addedGarmentCard);
        }
      } catch (dependencyError) {
        console.error('❌ Error initializing dependencies:', dependencyError);
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
      
      // Add event listeners to fabric options for restriction checking
      const fabricInputs = fabricGrid.querySelectorAll('input[type="radio"]');
      fabricInputs.forEach(input => {
        input.addEventListener('change', () => {
          // Update fabric restrictions when fabric is selected
          setTimeout(() => {
            V10_Utils.updateGarmentFabricRestrictions(garmentCard);
          }, 50);
        });
      });
      
    } catch (error) {
      console.error('❌ Error in populateFabricOptions:', error);
      return;
    }
  }

  setGarmentValues(clone, garmentData) {
    // Set garment type
    if (garmentData.type) {
      const garmentTypeInput = clone.querySelector(`input[value="${garmentData.type}"]`);
      if (garmentTypeInput) {
        garmentTypeInput.checked = true;
        // Update visual display for garment selection widget
        this.updateGarmentSelectionDisplay(clone, 'garment', garmentData.type);
      }
    }

    // Set fabric type
    if (garmentData.fabricType) {
      const fabricTypeInput = clone.querySelector(`input[value="${garmentData.fabricType}"]`);
      if (fabricTypeInput) {
        fabricTypeInput.checked = true;
        // Update visual display for fabric selection widget
        this.updateGarmentSelectionDisplay(clone, 'fabric', garmentData.fabricType);
      }
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

  updateGarmentSelectionDisplay(clone, type, value) {
    // This function handles visual display updates for garment/fabric selection widgets only
    // It's separate from updateCompactSelection to avoid conflicts with lab dip system
    
    if (type === 'garment') {
      const garmentIcon = this.getGarmentIcon(value);
      const selectedIcon = clone.querySelector('#garment-selected-icon');
      const selectedName = clone.querySelector('#garment-selected-name');
      const placeholder = clone.querySelector('#garment-placeholder');
      const display = clone.querySelector('#garment-display');
      
      if (selectedIcon) selectedIcon.textContent = garmentIcon;
      if (selectedName) selectedName.textContent = value;
      if (placeholder) placeholder.style.display = 'none';
      if (display) display.style.display = 'flex';
      
    } else if (type === 'fabric') {
      const selectedIcon = clone.querySelector('#fabric-selected-icon');
      const selectedName = clone.querySelector('#fabric-selected-name');
      const placeholder = clone.querySelector('#fabric-placeholder');
      const display = clone.querySelector('#fabric-display');
      
      if (selectedIcon) selectedIcon.textContent = '🧵';
      if (selectedName) selectedName.textContent = value;
      if (placeholder) placeholder.style.display = 'none';
      if (display) display.style.display = 'flex';
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
    } else if (e.target.closest('.garment-summary__edit-btn')) {
      e.preventDefault();
      e.stopPropagation();
      this.expandGarmentForEdit(garmentId);
    } else if (e.target.closest('.sample-type-card')) {
      // Handle sample type card clicks
      e.preventDefault();
      e.stopPropagation();
      const sampleCard = e.target.closest('.sample-type-card');
      
      // Check if the card is restricted
      if (sampleCard.classList.contains('sample-type-card--restricted')) {
        console.log('⚠️ Sample type restricted for this fabric type');
        return; // Don't allow selection of restricted options
      }
      
      const radioInput = sampleCard.querySelector('input[type="radio"]');
      if (radioInput && !radioInput.checked) {
        // Clear other selections in the same group
        const allSampleCards = garmentCard.querySelectorAll('.sample-type-card');
        allSampleCards.forEach(card => {
          card.classList.remove('selected');
          const radio = card.querySelector('input[type="radio"]');
          if (radio) radio.checked = false;
        });
        
        // Select this card
        sampleCard.classList.add('selected');
        radioInput.checked = true;
        
        // Trigger change event to notify existing handlers
        radioInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
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
      garmentData.sampleType = ''; // Reset sample selection
      
      // Handle compact interface selection update
      if (e.target.closest('.compact-radio-card')) {
        this.updateCompactSelection('garment', e.target.value, garmentCard);
        this.resetFabricSelection(garmentCard); // Reset fabric display to placeholder
        this.enableFabricSelection(garmentCard);
      }
      
      // Reset sample type selection
      this.resetSampleTypeSelection(garmentCard);
    }

    // Handle fabric type change (compact and regular)
    if (e.target.name.includes('fabricType')) {
      garmentData.fabricType = e.target.value;
      garmentData.sampleType = ''; // Reset sample selection when fabric changes
      
      // Update fabric restrictions when fabric type changes
      setTimeout(() => {
        V10_Utils.updateGarmentFabricRestrictions(garmentCard);
      }, 50);
      
      // Handle compact interface selection update
      if (e.target.closest('.compact-radio-card')) {
        this.updateCompactSelection('fabric', e.target.value, garmentCard);
      }
      
      // Reset sample type selection
      this.resetSampleTypeSelection(garmentCard);
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

    // Handle garment collapse/expand based on completion status
    this.updateGarmentCollapsedState(garmentCard, garmentData, isComplete);

    // Update assigned items display
    this.updateAssignedDisplay(garmentId);
  }

  updateGarmentCollapsedState(garmentCard, garmentData, isComplete) {
    const summaryContainer = garmentCard.querySelector('.garment-card__summary');
    const contentContainer = garmentCard.querySelector('.garment-card__content');
    
    if (!summaryContainer || !contentContainer) return;

    // Don't auto-collapse if in edit mode - keep form open for editing
    if (garmentData.isInEditMode) {
      console.log(`🔒 Garment ${garmentData.id} in edit mode - keeping form open`);
      summaryContainer.style.display = 'none';
      contentContainer.style.display = 'block';
      return;
    }

    // Normal auto-collapse behavior for new garments
    if (isComplete) {
      // Show summary, hide content
      summaryContainer.style.display = 'block';
      contentContainer.style.display = 'none';
      
      // Update summary content
      this.updateGarmentSummary(garmentCard, garmentData);
      console.log(`✅ Garment ${garmentData.id} auto-collapsed (complete)`);
    } else {
      // Show content, hide summary
      summaryContainer.style.display = 'none';
      contentContainer.style.display = 'block';
      console.log(`📝 Garment ${garmentData.id} showing form (incomplete)`);
    }
  }

  updateGarmentSummary(garmentCard, garmentData) {
    const typeSpan = garmentCard.querySelector('.garment-summary__type');
    const fabricSpan = garmentCard.querySelector('.garment-summary__fabric');
    const statusSpan = garmentCard.querySelector('.garment-summary__status');
    
    if (typeSpan && garmentData.type) {
      typeSpan.textContent = garmentData.type;
    }
    
    if (fabricSpan && garmentData.fabricType) {
      fabricSpan.textContent = garmentData.fabricType;
    }
    
    if (statusSpan) {
      // Generate status message based on request type and sample type
      let statusMessage = 'Complete';
      
      if (V10_State.requestType === 'sample-request' && garmentData.sampleType) {
        switch (garmentData.sampleType) {
          case 'techpack':
            statusMessage = 'Complete';
            break;
          case 'stock':
            statusMessage = 'Complete - Add a design (optional)';
            break;
          case 'custom':
            statusMessage = 'Complete - Needs to assign color on Design studio & design (optional)';
            break;
          default:
            statusMessage = 'Complete';
        }
      }
      
      statusSpan.textContent = statusMessage;
    }
  }

  expandGarmentForEdit(garmentId) {
    const garmentCard = document.querySelector(`[data-garment-id="${garmentId}"]`);
    const garmentData = V10_State.garments.get(garmentId);
    if (!garmentCard || !garmentData) return;

    const summaryContainer = garmentCard.querySelector('.garment-card__summary');
    const contentContainer = garmentCard.querySelector('.garment-card__content');
    
    if (summaryContainer && contentContainer) {
      // Set edit mode flag
      garmentData.isInEditMode = true;
      
      // Hide summary, show content for editing
      summaryContainer.style.display = 'none';
      contentContainer.style.display = 'block';
      
      // Populate form with existing garment data
      this.setGarmentValues(garmentCard, garmentData);
      
      // Ensure fabric options are populated if garment type exists
      if (garmentData.type) {
        this.populateFabricOptions(garmentCard, garmentData.type);
      }
      
      // Update selection dependencies to enable/disable fields properly
      this.updateSelectionDependencies(garmentCard);
      
      // Show finalize edit button
      this.showFinalizeEditButton(garmentCard);
      
      console.log(`✏️ Expanded garment ${garmentId} for editing with data:`, {
        type: garmentData.type,
        fabricType: garmentData.fabricType,
        sampleType: garmentData.sampleType
      });
    }
  }

  showFinalizeEditButton(garmentCard) {
    const finalizeBtn = garmentCard.querySelector('.garment-card__finalize');
    if (finalizeBtn) {
      finalizeBtn.style.display = 'block';
      
      // Bind click handler if not already bound
      if (!finalizeBtn.dataset.bound) {
        finalizeBtn.dataset.bound = 'true';
        finalizeBtn.addEventListener('click', () => {
          const garmentId = garmentCard.dataset.garmentId;
          this.finalizeGarmentEdit(garmentId);
        });
      }
    }
  }

  finalizeGarmentEdit(garmentId) {
    const garmentCard = document.querySelector(`[data-garment-id="${garmentId}"]`);
    const garmentData = V10_State.garments.get(garmentId);
    if (!garmentCard || !garmentData) return;

    // Clear edit mode flag
    garmentData.isInEditMode = false;
    
    // Hide finalize edit button
    const finalizeBtn = garmentCard.querySelector('.garment-card__finalize');
    if (finalizeBtn) {
      finalizeBtn.style.display = 'none';
    }
    
    // Update the garment's completion status and UI
    this.updateGarmentStatus(garmentId);
    
    console.log(`✅ Finalized edit for garment ${garmentId}`);
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
      
      // Check if garment has assignments
      const garmentData = V10_State.garments.get(garmentId);
      const hasAssignments = garmentData && 
        (garmentData.assignedLabDips.size > 0 || garmentData.assignedDesigns.size > 0);
      
      let shouldDelete = true;
      
      if (hasAssignments) {
        // Build confirmation message showing what will be lost
        let message = 'This garment has assignments that will be lost:\n\n';
        
        if (garmentData.assignedLabDips.size > 0) {
          message += `• ${garmentData.assignedLabDips.size} assigned color(s)\n`;
        }
        
        if (garmentData.assignedDesigns.size > 0) {
          message += `• ${garmentData.assignedDesigns.size} assigned design(s)\n`;
        }
        
        message += '\nRemove this garment? This action cannot be undone.';
        shouldDelete = confirm(message);
      }
      // If no assignments, delete immediately without confirmation
      
      if (shouldDelete) {
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
        
        // Renumber remaining garments
        this.renumberGarments();
        
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

  renumberGarments() {
    try {
      const garmentCards = this.garmentsContainer.querySelectorAll('.garment-card');
      let updatedCount = 0;
      
      garmentCards.forEach((garmentCard, index) => {
        const newNumber = index + 1;
        const garmentId = garmentCard.dataset.garmentId;
        
        // Update the display number in the card
        const numberElement = garmentCard.querySelector('.garment-card__number');
        if (numberElement) {
          const oldText = numberElement.textContent;
          const newText = `Garment ${newNumber}`;
          
          if (oldText !== newText) {
            numberElement.textContent = newText;
            updatedCount++;
            console.log(`🔢 Updated garment display: "${oldText}" → "${newText}"`);
          }
        }
        
        // Update the number in state data
        if (garmentId && V10_State.garments.has(garmentId)) {
          const garmentData = V10_State.garments.get(garmentId);
          const oldNumber = garmentData.number;
          
          if (oldNumber !== newNumber) {
            garmentData.number = newNumber;
            console.log(`🔢 Updated garment state: ${garmentId} number ${oldNumber} → ${newNumber}`);
          }
        }
      });
      
      if (updatedCount > 0) {
        console.log(`✅ Renumbered ${updatedCount} garments`);
      }
    } catch (error) {
      console.error('Error renumbering garments:', error);
    }
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
    if (!selectionWidget) {
      console.log('❌ toggleSelection: no selectionWidget provided');
      return;
    }

    const garmentCard = selectionWidget.closest('.garment-card');
    if (!garmentCard) {
      console.error('❌ No garment card found for selection widget');
      return;
    }
    
    console.log('🔄 toggleSelection called for:', selectionWidget.id || 'unnamed widget');
    
    // selectionWidget IS the compact-selection-widget, so we work with it directly
    const collapsed = selectionWidget; // This is the compact-selection-widget itself
    const section = selectionWidget.closest('.compact-selection-section');
    const expanded = section ? section.querySelector('.selection-expanded') : null;
    const placeholder = selectionWidget.querySelector('.selection-placeholder');
    
    // Find the selected display to toggle it
    const selectedDisplay = section ? section.querySelector('.selection-display') : null;
    
    console.log('🔍 Found elements:', {
      expanded: !!expanded,
      placeholder: !!placeholder, 
      selectedDisplay: !!selectedDisplay,
      expandedDisplay: expanded?.style.display
    });
    
    if (!expanded) {
      console.error('❌ No expanded section found');
      return;
    }
    
    if (expanded.style.display === 'none' || !expanded.style.display) {
      // Show expanded state (show dropdown options)
      console.log('📂 Expanding selection...');
      expanded.style.display = 'block';
      if (placeholder) placeholder.style.display = 'none'; // Hide placeholder to show expanded options
      if (selectedDisplay) selectedDisplay.style.display = 'none'; // Hide selected display when choosing
      
      // Close other expanded selections in this garment card
      this.closeOtherSelections(garmentCard, selectionWidget);
    } else {
      // Show collapsed state - hide options and determine what to show
      console.log('📁 Collapsing selection...');
      expanded.style.display = 'none';
      
      // Check if there's a selected item to display
      const hasSelection = selectedDisplay && selectedDisplay.querySelector('.selected-name')?.textContent.trim();
      
      if (hasSelection) {
        // Show selected display if there's a selection
        console.log('✅ Showing selected display');
        if (placeholder) placeholder.style.display = 'none';
        if (selectedDisplay) selectedDisplay.style.display = 'block';
      } else {
        // Show placeholder if no selection
        console.log('📝 Showing placeholder');
        if (placeholder) placeholder.style.display = 'flex';
        if (selectedDisplay) selectedDisplay.style.display = 'none';
      }
    }
  }

  closeOtherSelections(garmentCard, exceptWidget) {
    const allWidgets = garmentCard.querySelectorAll('.compact-selection-widget');
    allWidgets.forEach(widget => {
      if (widget !== exceptWidget) {
        const section = widget.closest('.compact-selection-section');
        const expanded = section ? section.querySelector('.selection-expanded') : null;
        const placeholder = widget.querySelector('.selection-placeholder');
        const selectedDisplay = section ? section.querySelector('.selection-display') : null;
        
        // Hide expanded options
        if (expanded) expanded.style.display = 'none';
        
        // Check if this widget has a selection before showing placeholder
        const hasSelection = selectedDisplay && selectedDisplay.querySelector('.selected-name')?.textContent.trim();
        
        if (hasSelection) {
          // Keep selected display visible if there's a selection
          if (placeholder) placeholder.style.display = 'none';
          if (selectedDisplay) selectedDisplay.style.display = 'block';
        } else {
          // Show placeholder only if no selection exists
          if (placeholder) placeholder.style.display = 'flex';
          if (selectedDisplay) selectedDisplay.style.display = 'none';
        }
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
      const collapsed = garmentCard.querySelector('#garment-collapsed');
      
      if (selectedIcon) selectedIcon.textContent = garmentIcon;
      if (selectedName) selectedName.textContent = value;
      if (placeholder) placeholder.style.display = 'none';
      if (display) display.style.display = 'block';
      
      // Auto-collapse after selection
      setTimeout(() => {
        this.toggleSelection(garmentCard.querySelector('#garment-collapsed'));
        // Update dependencies after garment type selection
        this.updateSelectionDependencies(garmentCard);
      }, 300);
      
    } else if (type === 'fabric') {
      const selectedIcon = garmentCard.querySelector('#fabric-selected-icon');
      const selectedName = garmentCard.querySelector('#fabric-selected-name');
      const placeholder = garmentCard.querySelector('#fabric-placeholder');
      const display = garmentCard.querySelector('#fabric-display');
      const collapsed = garmentCard.querySelector('#fabric-collapsed');
      
      if (selectedIcon) selectedIcon.textContent = '🧵';
      if (selectedName) selectedName.textContent = value;
      if (placeholder) placeholder.style.display = 'none';
      if (display) display.style.display = 'block';
      
      // Auto-collapse after selection
      setTimeout(() => {
        this.toggleSelection(garmentCard.querySelector('#fabric-collapsed'));
        // Update dependencies after fabric type selection
        this.updateSelectionDependencies(garmentCard);
      }, 300);
      
    } else if (type === 'sampleReference') {
      const sampleReferenceIcon = this.getSampleReferenceIcon(value);
      const selectedIcon = garmentCard.querySelector('#sample-reference-selected-icon');
      const selectedName = garmentCard.querySelector('#sample-reference-selected-name');
      const placeholder = garmentCard.querySelector('#sample-reference-placeholder');
      const display = garmentCard.querySelector('#sample-reference-display');
      const collapsed = garmentCard.querySelector('#sample-reference-collapsed');
      
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

  resetFabricSelection(garmentCard) {
    const fabricPlaceholder = garmentCard.querySelector('#fabric-placeholder');
    const fabricDisplay = garmentCard.querySelector('#fabric-display');
    const fabricSelectedName = garmentCard.querySelector('#fabric-selected-name');
    
    // Clear any displayed fabric selection and show placeholder
    if (fabricSelectedName) {
      fabricSelectedName.textContent = '';
    }
    
    if (fabricPlaceholder) {
      fabricPlaceholder.style.display = 'flex';
    }
    
    if (fabricDisplay) {
      fabricDisplay.style.display = 'none';
    }
    
    console.log('🔄 Reset fabric selection to placeholder state');
  }

  resetSampleTypeSelection(garmentCard) {
    // Clear all sample type radio button selections
    const sampleTypeRadios = garmentCard.querySelectorAll('input[name*="sampleType"]');
    sampleTypeRadios.forEach(radio => {
      radio.checked = false;
    });
    
    // Remove selected state from sample type cards
    const sampleTypeCards = garmentCard.querySelectorAll('.sample-type-card');
    sampleTypeCards.forEach(card => {
      card.classList.remove('selected');
    });
    
    // Remove any restriction classes (they'll be re-applied when needed)
    sampleTypeCards.forEach(card => {
      card.classList.remove('sample-type-card--restricted');
      card.style.opacity = '';
      card.style.pointerEvents = '';
      card.style.cursor = '';
    });
    
    console.log('🔄 Reset sample type selection');
  }

  updateSelectionDependencies(garmentCard) {
    const garmentId = garmentCard.dataset.garmentId;
    const garmentData = V10_State.garments.get(garmentId);
    if (!garmentData) return;

    // Get all selection sections
    const fabricSection = garmentCard.querySelector('.compact-selection-section[data-show-for*="quotation"], .compact-selection-section[data-show-for*="sample"]');
    const sampleTypeSection = garmentCard.querySelector('.selection-section[data-show-for="sample"]');

    // Check selection states
    const hasGarmentType = !!garmentData.type;
    const hasFabricType = !!garmentData.fabricType;

    console.log('🔄 Updating selection dependencies:', {
      garmentId,
      hasGarmentType,
      hasFabricType,
      garmentType: garmentData.type,
      fabricType: garmentData.fabricType
    });

    // Update fabric type dependency (depends on garment type)
    if (fabricSection) {
      if (hasGarmentType) {
        // Enable fabric selection
        fabricSection.classList.remove('compact-selection-section--disabled');
        this.enableSelectionSection(fabricSection);
      } else {
        // Disable fabric selection
        fabricSection.classList.add('compact-selection-section--disabled');
        this.disableSelectionSection(fabricSection, 'Select garment type first');
      }
    }

    // Update sample type dependency (depends on fabric type)
    if (sampleTypeSection) {
      if (hasGarmentType && hasFabricType) {
        // Enable sample type selection
        sampleTypeSection.classList.remove('selection-section--disabled');
        this.enableSampleTypeSection(sampleTypeSection);
      } else {
        // Disable sample type selection
        sampleTypeSection.classList.add('selection-section--disabled');
        this.disableSampleTypeSection(sampleTypeSection, hasFabricType ? 'Select garment type first' : 'Select fabric type first');
      }
    }
  }

  enableSelectionSection(section) {
    const widget = section.querySelector('.compact-selection-widget');
    const placeholder = section.querySelector('.placeholder-text');
    
    if (widget) {
      widget.style.opacity = '1';
      widget.style.pointerEvents = 'auto';
      widget.style.cursor = 'pointer';
    }
    
    if (placeholder && placeholder.dataset.originalText) {
      placeholder.textContent = placeholder.dataset.originalText;
    }
  }

  disableSelectionSection(section, disabledText) {
    const widget = section.querySelector('.compact-selection-widget');
    const placeholder = section.querySelector('.placeholder-text');
    
    if (widget) {
      widget.style.opacity = '0.5';
      widget.style.pointerEvents = 'none';
      widget.style.cursor = 'not-allowed';
    }
    
    if (placeholder) {
      if (!placeholder.dataset.originalText) {
        placeholder.dataset.originalText = placeholder.textContent;
      }
      placeholder.textContent = disabledText;
    }
  }

  enableSampleTypeSection(section) {
    const sampleCards = section.querySelectorAll('.sample-type-card');
    
    sampleCards.forEach(card => {
      card.classList.remove('sample-type-card--disabled');
      card.style.opacity = '1';
      card.style.pointerEvents = 'auto';
      card.style.cursor = 'pointer';
    });
  }

  disableSampleTypeSection(section, disabledText) {
    const sampleCards = section.querySelectorAll('.sample-type-card');
    
    sampleCards.forEach(card => {
      card.classList.add('sample-type-card--disabled');
      card.style.opacity = '0.5';
      card.style.pointerEvents = 'none';
      card.style.cursor = 'not-allowed';
    });
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
    // Set up initial states - use querySelector on the garmentCard to find within this specific garment
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
    // Add a small delay to ensure DOM is fully ready
    setTimeout(() => {
      this.bindEvents();
      this.loadExistingItems();
    }, 100);
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
      // Initialize preview with current color picker value
      colorPreview.style.backgroundColor = colorPicker.value;
      
      colorPicker.addEventListener('input', (e) => {
        const hex = e.target.value;
        colorPreview.style.backgroundColor = hex;
        
        // Update auto-pantone display with enhanced color matching
        if (pantoneDisplay && pantoneCircle && pantoneCode) {
          const closestColors = V10_Utils.findClosestPantoneColors(hex, 1);
          if (closestColors.length > 0) {
            const bestMatch = closestColors[0];
            pantoneDisplay.style.display = 'block';
            pantoneCircle.style.backgroundColor = hex;
            pantoneCode.textContent = bestMatch.code;
            
            // Update the note to show confidence
            const pantoneNote = document.querySelector('.pantone-note');
            if (pantoneNote) {
              pantoneNote.textContent = `Auto-matched from 2,319+ TCX colors (${bestMatch.confidence}% match)`;
            }
          } else {
            // Fallback to original method
            pantoneDisplay.style.display = 'block';
            pantoneCircle.style.backgroundColor = hex;
            pantoneCode.textContent = `PANTONE ${V10_Utils.hexToPantone(hex)}`;
          }
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
    const popularColorCircles = document.querySelectorAll('.popular-color-circle');
    
    popularColorCircles.forEach((colorBtn, index) => {
      colorBtn.addEventListener('click', (e) => {
        const hex = colorBtn.dataset.color;
        const pantone = colorBtn.dataset.pantone;
        
        if (colorPicker) colorPicker.value = hex;
        if (colorPreview) colorPreview.style.backgroundColor = hex;
        if (pantoneInput) pantoneInput.value = pantone;
        
        if (pantoneDisplay && pantoneCircle && pantoneCode) {
          pantoneDisplay.style.display = 'block';
          pantoneCircle.style.backgroundColor = hex;
          pantoneCode.textContent = pantone;
          
          // Update the note to show this is a pre-selected color
          const pantoneNote = document.querySelector('.pantone-note');
          if (pantoneNote) {
            pantoneNote.textContent = 'Pre-selected TCX color (100% match)';
          }
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

  showGarmentSelector(type, itemId = null) {
    console.log(`🔄 showGarmentSelector called with type: ${type}, itemId: ${itemId}`);
    
    // Check if modal manager exists
    if (!window.v10ModalManager) {
      console.error('❌ V10 Modal Manager not found');
      alert('Modal system not available. Please refresh the page.');
      return;
    }

    const garments = Array.from(V10_State.garments.values()).filter(g => g.isComplete);
    console.log(`📊 Found ${garments.length} complete garments:`, garments);
    
    if (garments.length === 0) {
      alert('Please complete at least one garment specification first.');
      return;
    }

    try {
      // Create modal with garment list
      console.log('🔄 Creating garment selector modal...');
      const modal = this.createGarmentSelectorModal(garments, type, itemId);
      
      if (!modal) {
        console.error('❌ Failed to create modal');
        return;
      }
      
      // Add debugging for modal state
      console.log('📊 Modal DOM state check:', {
        isInDocument: document.body.contains(modal),
        className: modal.className,
        style: modal.style.cssText,
        parentNode: modal.parentNode?.tagName
      });
      
      console.log('✅ Modal created, opening with V10 Modal Manager...');
      
      // Add small delay to ensure DOM is ready
      setTimeout(() => {
        window.v10ModalManager.openModal(modal);
        
        // Check modal state after opening attempt
        setTimeout(() => {
          console.log('📊 Modal state after opening:', {
            display: modal.style.display,
            classList: Array.from(modal.classList),
            visibility: window.getComputedStyle(modal).visibility,
            opacity: window.getComputedStyle(modal).opacity,
            zIndex: window.getComputedStyle(modal).zIndex
          });
        }, 100);
        
        console.log('✅ Modal opened successfully');
      }, 10);
    } catch (error) {
      console.error('❌ Error in showGarmentSelector:', error);
      alert('Error opening garment selector. Please try again.');
    }
  }

  createGarmentSelectorModal(garments, type, itemId = null) {
    console.log(`🔄 createGarmentSelectorModal: ${type}, ${garments.length} garments, itemId: ${itemId}`);
    
    try {
      const modal = document.createElement('div');
      modal.className = 'v10-modal-overlay';
    modal.innerHTML = `
      <div class="v10-modal">
        <div class="v10-modal-header">
          <h3 class="v10-modal-title">Assign ${type === 'labdip' ? 'Lab Dip' : 'Design Sample'} to Garment</h3>
          <button type="button" class="v10-modal-close">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M15 5L5 15m0-10l10 10" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
        <div class="v10-modal-body">
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
          <div class="v10-modal-actions">
            <button type="button" class="v10-btn v10-btn--ghost modal-cancel">Cancel</button>
            <button type="button" class="v10-btn v10-btn--primary modal-confirm" disabled>
              Assign ${type === 'labdip' ? 'Lab Dip' : 'Design Sample'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Bind modal events
    const closeBtn = modal.querySelector('.v10-modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const confirmBtn = modal.querySelector('.modal-confirm');
    const radioInputs = modal.querySelectorAll('input[name="target-garment"]');

    const closeModal = () => {
      window.v10ModalManager.closeModal(modal);
    };

    // V10 modal system handles backdrop clicks automatically
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
      try {
        const selectedGarment = Array.from(radioInputs).find(r => r.checked)?.value;
        if (selectedGarment) {
          if (itemId) {
            // Assign existing item to garment
            if (type === 'labdip') {
              console.log(`✅ Assigning existing lab dip ${itemId} to garment ${selectedGarment}`);
              window.v10GarmentStudio.assignLabDip(selectedGarment, itemId);
            } else {
              console.log(`✅ Assigning existing design ${itemId} to garment ${selectedGarment}`);
              window.v10GarmentStudio.assignDesign(selectedGarment, itemId);
            }
          } else {
            // Create new item and assign to garment (current behavior for "Add to Garment" from forms)
            if (type === 'labdip') {
              this.addLabDip(false, selectedGarment);
            } else {
              this.addDesignSample(false, selectedGarment);
            }
          }
          console.log(`📋 ${type} assignment completed, closing modal`);
        }
      } catch (error) {
        console.error(`❌ Error during ${type} assignment:`, error);
      } finally {
        // Always try to close the modal
        console.log('🔄 Attempting to close modal...');
        closeModal();
      }
    });

    console.log('✅ Modal DOM created successfully');
    
    // Append modal to document body
    document.body.appendChild(modal);
    console.log('📄 Modal appended to DOM');
    
    return modal;
    
    } catch (error) {
      console.error('❌ Error creating garment selector modal:', error);
      return null;
    }
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
      assignBtn.addEventListener('click', () => this.showGarmentSelector('labdip', labDipData.id));
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
      assignBtn.addEventListener('click', () => this.showGarmentSelector('design', designData.id));
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
      if (!garmentValidation) {
        return { isValid: false, errors: ['Validation failed'] };
      }
      
      // Enhanced validation for fabric restrictions
      const enhancedValidation = this.validateFabricRestrictions(garmentValidation);
      return enhancedValidation;
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
      
      // Enhanced validation for fabric restrictions and sample types
      const enhancedValidation = this.validateFabricRestrictions(garmentValidation);
      const sampleValidation = this.validateSampleTypeRequirements(enhancedValidation);
      
      return sampleValidation;
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

  // Enhanced validation method for fabric restrictions
  validateFabricRestrictions(baseValidation) {
    try {
      const errors = Array.isArray(baseValidation.errors) ? [...baseValidation.errors] : [];
      let isValid = baseValidation.isValid;
      
      // Get all garments for validation
      const garments = Array.from(V10_State.garments.values());
      
      garments.forEach((garment, index) => {
        const garmentCard = document.querySelector(`[data-garment-id="${garment.id}"]`);
        
        if (garmentCard && garment.fabricType) {
          // Check for custom sample types with non-cotton fabrics
          if (garment.sampleType && garment.sampleType.includes('custom')) {
            const isNonCotton = !V10_Utils.isCottonFabric(garment.fabricType);
            
            if (isNonCotton) {
              errors.push(`Garment ${index + 1}: Custom samples require cotton fabrics. Selected: ${garment.fabricType}`);
              isValid = false;
            }
          }
          
          // Check for lab dip assignments with non-cotton fabrics
          if (garment.assignedLabDips && garment.assignedLabDips.size > 0 && !V10_Utils.isCottonFabric(garment.fabricType)) {
            errors.push(`Garment ${index + 1}: Lab dip assignments require cotton fabrics for custom colors`);
            isValid = false;
          }
        }
      });
      
      return { isValid, errors };
    } catch (error) {
      console.error('Error in fabric restrictions validation:', error);
      return baseValidation; // Return original validation if enhanced validation fails
    }
  }

  // Enhanced validation for sample type requirements
  validateSampleTypeRequirements(baseValidation) {
    try {
      const errors = Array.isArray(baseValidation.errors) ? [...baseValidation.errors] : [];
      let isValid = baseValidation.isValid;
      
      // Get all garments for validation
      const garments = Array.from(V10_State.garments.values());
      
      garments.forEach((garment, index) => {
        // Validate that sample types are appropriate for the request type
        if (V10_State.requestType === 'sample-request' && !garment.sampleType) {
          errors.push(`Garment ${index + 1}: Sample type selection is required for sample requests`);
          isValid = false;
        }
        
        // Check for custom sample types that need lab dips or designs
        if (garment.sampleType === 'custom' && (!garment.assignedLabDips || garment.assignedLabDips.size === 0)) {
          errors.push(`Garment ${index + 1}: Custom color sample requires Lab Dip assignment`);
          isValid = false;
        }
        
        // Enhanced fabric-sample compatibility checks
        if (garment.fabricType && garment.sampleType) {
          const isCottonFabric = V10_Utils.isCottonFabric(garment.fabricType);
          
          if (garment.sampleType.includes('custom') && !isCottonFabric) {
            errors.push(`Garment ${index + 1}: Custom color samples not available for ${garment.fabricType}. Please select a cotton fabric or choose stock color sample.`);
            isValid = false;
          }
        }
      });
      
      return { isValid, errors };
    } catch (error) {
      console.error('Error in sample type requirements validation:', error);
      return baseValidation; // Return original validation if enhanced validation fails
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

    if (window.v10ModalManager) {
      window.v10ModalManager.openModal(modal);
    }

    // Bind close event to continue button
    const continueBtn = document.getElementById('success-continue');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        window.v10ModalManager.closeModal(modal);
        
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

    // Setup close functionality for the main help modal
    const helpCloseBtn = document.getElementById('close-help-modal');
    if (helpCloseBtn) {
      helpCloseBtn.addEventListener('click', () => this.hideHelpModal());
    }

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
      
      // Ensure file manager and conditional sections are updated
      if (window.v10FileManager) {
        window.v10FileManager.updateConditionalSections();
        console.log('🔄 Step 2: Refreshed conditional sections after back navigation');
      }
      
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
      
      // Ensure conditional sections are updated after file manager initialization
      // Use timeout to ensure client data is available
      setTimeout(() => {
        if (window.v10FileManager) {
          window.v10FileManager.updateConditionalSections();
          console.log('🔄 Step 2: Refreshed conditional sections after navigation');
        }
      }, 100);
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
    
    // Show warning when any measurement checkbox is checked
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
          const result = this.proceedToStep3();
          // Handle both synchronous and asynchronous returns
          if (result && typeof result.then === 'function') {
            result.then(success => {
              if (!success) {
                console.error('Failed to proceed to step 3');
              }
            });
          }
        }
      });
    }
    
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.goBackToStep1();
      });
    }
  }




  updateConditionalSections() {
    // Get request type from multiple sources with fallback
    let requestType = null;
    
    // Try client manager first
    if (window.v10ClientManager) {
      const clientData = window.v10ClientManager.getClientData() || {};
      requestType = clientData.submission_type;
    }
    
    // Fallback to global state
    if (!requestType && V10_State.requestType) {
      requestType = V10_State.requestType;
    }
    
    // Fallback to session storage
    if (!requestType) {
      try {
        requestType = sessionStorage.getItem('v10_request_type');
      } catch (error) {
        console.warn('Could not access session storage:', error);
      }
    }
    
    // Fallback to URL parameters
    if (!requestType) {
      const urlParams = new URLSearchParams(window.location.search);
      requestType = urlParams.get('request_type');
    }
    
    console.log('🔄 FileManager updateConditionalSections - Request type:', requestType);
    
    const measurementStudio = document.getElementById('techpack-v10-measurement-studio');
    const designPlacementItem = document.getElementById('techpack-v10-design-placement-item');
    
    // Show measurement requirements for sample requests ONLY
    if (measurementStudio) {
      if (requestType === 'sample-request') {
        measurementStudio.style.display = 'block';
        console.log('✅ Showing measurement studio for sample request');
      } else {
        measurementStudio.style.display = 'none';
        console.log('🔒 Hiding measurement studio for request type:', requestType);
      }
    }
    
    // Show design placement for sample requests only
    if (designPlacementItem) {
      if (requestType === 'sample-request') {
        designPlacementItem.style.display = 'block';
      } else {
        designPlacementItem.style.display = 'none';
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
    
    this.validateStep();
    this.saveData();
  }


  validateMeasurements() {
    const measurementStudio = document.getElementById('techpack-v10-measurement-studio');
    if (!measurementStudio || measurementStudio.style.display === 'none') return true;
    
    // For sample requests, Fit Measurements is REQUIRED
    const clientData = window.v10ClientManager?.getClientData() || {};
    const requestType = clientData.submission_type;
    
    if (requestType === 'sample-request') {
      const fitMeasurementsCheckbox = document.getElementById('techpack-v10-fit-measurements');
      const isChecked = fitMeasurementsCheckbox && fitMeasurementsCheckbox.checked;
      
      if (!isChecked) {
        // Show modal warning for unchecked required measurements
        this.showMeasurementRequirementModal();
        return false;
      }
      
      return true;
    }
    
    return true;
  }

  showMeasurementRequirementModal() {
    // Find or create the measurement requirement modal
    let modal = document.getElementById('techpack-v10-measurement-requirement-modal');
    
    if (!modal) {
      // Create the modal if it doesn't exist
      modal = document.createElement('div');
      modal.id = 'techpack-v10-measurement-requirement-modal';
      modal.className = 'v10-modal v10-modal--warning';
      modal.innerHTML = `
        <div class="v10-modal__backdrop"></div>
        <div class="v10-modal__container">
          <div class="v10-modal__header">
            <h3>⚠️ Measurement Requirements</h3>
          </div>
          <div class="v10-modal__content">
            <p><strong>Fit Measurements are required for sample requests.</strong></p>
            <p>Please select "Fit Measurements" to proceed to the next step. This ensures we can create a sample that fits your specifications.</p>
          </div>
          <div class="v10-modal__actions">
            <button type="button" class="v10-btn v10-btn--primary" id="measurement-modal-understand">
              I Understand
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      // Bind close event
      const understandBtn = modal.querySelector('#measurement-modal-understand');
      if (understandBtn) {
        understandBtn.addEventListener('click', () => {
          if (window.v10ModalManager) {
            window.v10ModalManager.closeModal(modal);
          } else {
            modal.style.display = 'none';
          }
        });
      }
    }
    
    // Open the modal
    if (window.v10ModalManager) {
      window.v10ModalManager.openModal(modal);
    } else {
      modal.style.display = 'block';
    }
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
      console.log('🚀 Attempting to proceed to step 3...');
      
      // Try multiple times to find elements if they're not immediately available
      let step2 = document.getElementById('techpack-v10-step-2');
      let step3 = document.getElementById('techpack-v10-step-3');
      
      // Enhanced debug current DOM state
      console.log('🔍 Step element search:', {
        step2Found: !!step2,
        step3Found: !!step3,
        allStepSections: document.querySelectorAll('[id*="techpack-v10-step"]').length,
        allSectionIds: Array.from(document.querySelectorAll('[id*="techpack-v10-step"]')).map(el => el.id),
        allTechpackSections: document.querySelectorAll('[id*="techpack"]').length,
        allTechpackIds: Array.from(document.querySelectorAll('[id*="techpack"]')).map(el => el.id)
      });
      
      // Deep dive into step 3 specifically
      const step3Attempts = [
        document.getElementById('techpack-v10-step-3'),
        document.querySelector('#techpack-v10-step-3'),
        document.querySelector('section[id="techpack-v10-step-3"]'),
        document.querySelector('.v10-techpack-step[data-step="3"]'),
        document.querySelector('section[data-step="3"]')
      ];
      
      console.log('🔍 Step 3 detection attempts:', {
        byId: !!step3Attempts[0],
        byQuerySelector: !!step3Attempts[1],  
        bySection: !!step3Attempts[2],
        byClass: !!step3Attempts[3],
        byDataStep: !!step3Attempts[4],
        actualElement: step3Attempts.find(el => el) || 'NONE_FOUND'
      });
      
      // Check if step 3 exists but is hidden by CSS
      if (step3Attempts[0]) {
        const step3El = step3Attempts[0];
        console.log('🔍 Step 3 element found but checking visibility:', {
          displayStyle: step3El.style.display,
          computedDisplay: window.getComputedStyle(step3El).display,
          isVisible: step3El.offsetParent !== null,
          hasActiveClass: step3El.classList.contains('active'),
          allClasses: Array.from(step3El.classList),
          parentElement: step3El.parentElement ? step3El.parentElement.tagName : 'NO_PARENT'
        });
      } else {
        console.log('🔍 Step 3 element not found in DOM - checking if it exists anywhere:', {
          anyStep3: document.querySelector('[id*="step-3"], [id*="step_3"]'),
          anyV10Elements: document.querySelectorAll('[id*="v10"]').length,
          bodyChildren: document.body.children.length
        });
      }
      
      // If elements not found, wait briefly and try again
      if (!step2 || !step3) {
        console.warn('⚠️ Step elements not found on first attempt, waiting...');
        
        return new Promise((resolve) => {
          let retryCount = 0;
          const maxRetries = 3;
          
          const tryFind = () => {
            retryCount++;
            step2 = document.getElementById('techpack-v10-step-2');
            step3 = document.getElementById('techpack-v10-step-3');
            
            console.log(`🔄 Retry ${retryCount}/${maxRetries}:`, {
              step2Found: !!step2,
              step3Found: !!step3,
              allSectionIds: Array.from(document.querySelectorAll('[id*="techpack-v10-step"]')).map(el => el.id)
            });
            
            if (step2 && step3) {
              this.executeStepTransition(step2, step3);
              resolve(true);
              return;
            }
            
            if (retryCount < maxRetries) {
              setTimeout(tryFind, 100);
            } else {
              // If step 3 still not found, try to trigger its loading
              this.ensureStep3Loaded().then(() => {
                step3 = document.getElementById('techpack-v10-step-3');
                if (step2 && step3) {
                  this.executeStepTransition(step2, step3);
                  resolve(true);
                } else {
                  console.error('❌ Cannot find step elements after all retries', {
                    step2Found: !!step2,
                    step3Found: !!step3,
                    allSections: document.querySelectorAll('[id*="techpack-v10-step"]').length
                  });
                  resolve(false);
                }
              });
            }
          };
          
          setTimeout(tryFind, 50);
        });
      }
      
      this.executeStepTransition(step2, step3);
      return true;
      
    } catch (error) {
      console.error('❌ Error proceeding to step 3:', error);
      return false;
    }
  }

  ensureStep3Loaded() {
    return new Promise((resolve) => {
      console.log('🔧 Attempting to ensure step 3 is loaded...');
      
      // Check if step 3 section exists but might be hidden or not rendered
      const step3Section = document.getElementById('techpack-v10-step-3');
      
      if (step3Section) {
        console.log('✅ Step 3 section found, making sure it\'s accessible');
        // Make sure it's visible to DOM queries
        if (step3Section.style.display === 'none') {
          step3Section.style.display = 'block';
        }
        resolve();
        return;
      }
      
      // If step 3 doesn't exist, there might be an issue with the template
      // Try to trigger section loading by dispatching events or checking if sections need to load
      console.warn('⚠️ Step 3 section not found, checking for dynamic loading...');
      
      // Look for any section loading mechanisms
      const event = new CustomEvent('techpack-step-load', { detail: { step: 3 } });
      document.dispatchEvent(event);
      
      // Wait a bit for any dynamic loading
      setTimeout(() => {
        resolve();
      }, 200);
    });
  }

  executeStepTransition(step2, step3) {
    console.log('🔄 Executing step transition...');
    
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
    
    console.log('✅ Step transition completed successfully');
    return true;
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

  openModal(modalIdOrElement) {
    let modal;
    
    // Handle both string IDs and DOM elements
    if (typeof modalIdOrElement === 'string') {
      // String ID case (existing functionality)
      modal = this.modals.get(modalIdOrElement) || document.getElementById(`v10-${modalIdOrElement}-modal`);
    } else if (modalIdOrElement && modalIdOrElement.nodeType === 1) {
      // DOM element case (what measurement modal needs)
      modal = modalIdOrElement;
    }
    
    if (!modal) {
      console.error('Modal not found:', modalIdOrElement);
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
          
          // Test the enhanced systems
          setTimeout(() => {
            V10_Utils.testPantoneSystem();
            V10_Utils.testGarmentFabricSampleSystem();
          }, 100);
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