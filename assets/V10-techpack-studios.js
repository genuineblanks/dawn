/* V10 TechPack Studios - Advanced Studio Management System */
/* Complete rewrite with studio-based architecture */
/* Cache refresh: 2025-01-16 - Fixed dark mode Step 1 seamless background */

// ==============================================
// GLOBAL CONFIGURATION
// ==============================================

// Prevent multiple script loading
if (typeof window.V10_CONFIG !== 'undefined') {
  console.log('V10 TechPack Studios already loaded, skipping initialization');
} else {

const V10_CONFIG = {
  // Fabric Type Mapping (updated to match pricing table)
  FABRIC_TYPE_MAPPING: {
    'Zip-Up Hoodie': [
      '100% Organic Cotton Brushed Fleece',
      '100% Organic Cotton French Terry',
      '70/30 Cotton-Poly',
      '50/50 Cotton-Poly',
      '100% Polyester'
    ],
    'Hoodie': [
      '100% Organic Cotton Brushed Fleece',
      '100% Organic Cotton French Terry',
      '70/30 Cotton-Poly',
      '50/50 Cotton-Poly',
      '100% Polyester'
    ],
    'Sweatshirt': [
      '100% Organic Cotton Brushed Fleece',
      '100% Organic Cotton French Terry',
      '70/30 Cotton-Poly',
      '50/50 Cotton-Poly',
      '100% Polyester'
    ],
    'Sweatpants': [
      '100% Organic Cotton Brushed Fleece',
      '100% Organic Cotton French Terry',
      '70/30 Cotton-Poly',
      '50/50 Cotton-Poly',
      '100% Polyester'
    ],
    'Shorts': [
      '100% Organic Cotton Brushed Fleece',
      '100% Organic Cotton French Terry',
      '70/30 Cotton-Poly',
      '50/50 Cotton-Poly',
      '100% Polyester'
    ],
    'T-Shirt': [
      '100% Organic Cotton Jersey',
      '95% Cotton 5% Elastan',
      '80/20 Cotton-Poly',
      '50/50 Cotton-Poly',
      '100% Polyester',
      'Recycled Polyester'
    ],
    'Long Sleeve T-Shirt': [
      '100% Organic Cotton Jersey',
      '95% Cotton 5% Elastan',
      '80/20 Cotton-Poly',
      '50/50 Cotton-Poly',
      '100% Polyester',
      'Recycled Polyester'
    ],
    'Shirt': [
      '100% Cotton Poplin',
      '100% Cotton Oxford',
      '100% Cotton Twill',
      '100% Cotton Canvas',
      '100% Linen',
      '55% Hemp / 45% Cotton',
      '80/20 Cotton-Poly'
    ],
    'Polo Shirt': [
      '100% Cotton Piqué',
      '95/5 Cotton-Elastane Piqué',
      '80/20 Cotton-Poly Piqué',
      '50/50 Cotton-Poly Piqué',
      '100% Polyester Piqué'
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
      '65/35 Polyester-Cotton Piqué Knit'
    ],
    'Hat/Cap': [
      'Standard Material'
    ],
    'Beanie': [
      'Standard Material'
    ]
  },

  // Cotton fabrics that allow custom colors
  COTTON_FABRICS: [
    '100% Organic Cotton Brushed Fleece',
    '100% Organic Cotton French Terry',
    '100% Organic Cotton Jersey',
    '100% Cotton Poplin',
    '100% Cotton Oxford',
    '100% Cotton Twill',
    '100% Cotton Canvas',
    '100% Linen',
    '55% Hemp / 45% Cotton',
    '100% Cotton Piqué',
    '100% Cotton Jersey',
    '100% Cotton Slub Jersey',
    '100% Cotton Waffle Knit',
    '100% Cotton Lightweight French Terry',
    '100% Cotton 2x2 Rib Knit'
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
  DESIGN_TYPES: ['Embroidery', 'Screen Print', 'Digital Print'],

  // Legacy fixed pricing (kept for lab dips and design samples)
  PRICING: {
    LAB_DIP: 25,
    DESIGN_SAMPLE: 15,
    STOCK_SAMPLE: 35, // Default fallback
    CUSTOM_SAMPLE: 65 // Default fallback
  },

  // Dynamic pricing based on garment, fabric, and sample type
  GARMENT_PRICING: {
    'Zip-Up Hoodie': {
      '100% Organic Cotton Brushed Fleece': { stock: 150, custom: 180 },
      '100% Organic Cotton French Terry': { stock: 150, custom: 180 },
      '70/30 Cotton-Poly': { stock: 130, custom: null },
      '50/50 Cotton-Poly': { stock: 120, custom: null },
      '100% Polyester': { stock: 110, custom: null }
    },
    'Hoodie': {
      '100% Organic Cotton Brushed Fleece': { stock: 120, custom: 150 },
      '100% Organic Cotton French Terry': { stock: 120, custom: 150 },
      '70/30 Cotton-Poly': { stock: 100, custom: null },
      '50/50 Cotton-Poly': { stock: 90, custom: null },
      '100% Polyester': { stock: 80, custom: null }
    },
    'Sweatshirt': {
      '100% Organic Cotton Brushed Fleece': { stock: 80, custom: 100 },
      '100% Organic Cotton French Terry': { stock: 80, custom: 100 },
      '70/30 Cotton-Poly': { stock: 60, custom: null },
      '50/50 Cotton-Poly': { stock: 50, custom: null },
      '100% Polyester': { stock: 40, custom: null }
    },
    'Sweatpants': {
      '100% Organic Cotton Brushed Fleece': { stock: 110, custom: 140 },
      '100% Organic Cotton French Terry': { stock: 110, custom: 140 },
      '70/30 Cotton-Poly': { stock: 90, custom: null },
      '50/50 Cotton-Poly': { stock: 80, custom: null },
      '100% Polyester': { stock: 70, custom: null }
    },
    'Shorts': {
      '100% Organic Cotton Brushed Fleece': { stock: 80, custom: 100 },
      '100% Organic Cotton French Terry': { stock: 80, custom: 100 },
      '70/30 Cotton-Poly': { stock: 60, custom: null },
      '50/50 Cotton-Poly': { stock: 50, custom: null },
      '100% Polyester': { stock: 40, custom: null }
    },
    'T-Shirt': {
      '100% Organic Cotton Jersey': { stock: 60, custom: 80 },
      '95% Cotton 5% Elastan': { stock: 60, custom: null }, // blend, no custom
      '80/20 Cotton-Poly': { stock: 40, custom: null },
      '50/50 Cotton-Poly': { stock: 30, custom: null },
      '100% Polyester': { stock: 20, custom: null },
      'Recycled Polyester': { stock: 20, custom: null }
    },
    'Long Sleeve T-Shirt': {
      '100% Organic Cotton Jersey': { stock: 80, custom: 100 },
      '95% Cotton 5% Elastan': { stock: 80, custom: null }, // blend, no custom
      '80/20 Cotton-Poly': { stock: 60, custom: null },
      '50/50 Cotton-Poly': { stock: 50, custom: null },
      '100% Polyester': { stock: 40, custom: null },
      'Recycled Polyester': { stock: 40, custom: null }
    },
    'Shirt': {
      '100% Cotton Poplin': { stock: 100, custom: 120 },
      '100% Cotton Oxford': { stock: 100, custom: 120 },
      '100% Cotton Twill': { stock: 100, custom: 120 },
      '100% Cotton Canvas': { stock: 100, custom: 120 },
      '100% Linen': { stock: 100, custom: 120 },
      '55% Hemp / 45% Cotton': { stock: 100, custom: 120 },
      '80/20 Cotton-Poly': { stock: 80, custom: null }
    },
    'Polo Shirt': {
      '100% Cotton Piqué': { stock: 90, custom: 110 },
      '95/5 Cotton-Elastane Piqué': { stock: 90, custom: null }, // blend, no custom
      '80/20 Cotton-Poly Piqué': { stock: 70, custom: null },
      '50/50 Cotton-Poly Piqué': { stock: 60, custom: null },
      '100% Polyester Piqué': { stock: 50, custom: null }
    },
    'Tank Top': {
      '100% Cotton Jersey': { stock: 50, custom: 65 },
      '100% Cotton Slub Jersey': { stock: 50, custom: 65 },
      '100% Cotton Waffle Knit': { stock: 50, custom: 65 },
      '100% Cotton Lightweight French Terry': { stock: 50, custom: 65 },
      '100% Cotton 2x2 Rib Knit': { stock: 50, custom: 65 },
      '95/5 Cotton-Elastane Jersey': { stock: 50, custom: null }, // blend, no custom
      '50/50 Cotton-Poly Jersey': { stock: 40, custom: null },
      '100% Polyester Mesh': { stock: 30, custom: null },
      '65/35 Polyester-Cotton Piqué Knit': { stock: 30, custom: null }
    },
    'Hat/Cap': {
      'Standard Material': { stock: 250, custom: null } // stock only
    },
    'Beanie': {
      'Standard Material': { stock: 150, custom: null } // stock only
    }
  }
};

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

// V10_Utils will be defined later with complete functionality

// ==============================================
// TECHPACK QUANTITY CONFIGURATION & BUSINESS RULES
// ==============================================

const V10_QUANTITY_CONFIG = {
  // Production minimums - ONLY Custom Production for bulk orders
  minimums: {
    // Note: "Our Blanks" logic removed - bulk orders ONLY use Custom Production
    customHeavy: { single: 75, multiple: 50 },       // Custom production - heavy garments
    customLight: { single: 100, multiple: 75 }       // Custom production - light garments
  },
  
  // Light garment classification (higher minimums due to fabric costs)
  lightGarments: [
    'T-Shirt', 'Shorts', 'Tank Top', 'Polo Shirt', 
    'Shirt', 'Long Sleeve T-Shirt'
  ],
  
  // Size distribution limits (quantity -> max allowed sizes)
  sizeDistribution: [
    { min: 300, maxSizes: 7 },    // XXS-XXL (7 sizes)
    { min: 150, maxSizes: 6 },    // XS-XXL (6 sizes)
    { min: 75, maxSizes: 5 },     // S-XXL (5 sizes)
    { min: 50, maxSizes: 4 },     // S-XL (4 sizes)
    { min: 30, maxSizes: 3 },     // S-L (3 sizes)
    { min: 20, maxSizes: 2 },     // M-L (2 sizes)
    { min: 1, maxSizes: 1 }       // M only (1 size)
  ],
  
  // Intelligent distribution presets
  presets: {
    'bell-curve': {
      pattern: [2, 6, 8, 10, 8, 6, 2, 1],
      name: 'Bell Curve (S,M,L focus)',
      description: 'Standard retail distribution'
    },
    'medium-heavy': {
      pattern: [3, 5, 8, 12, 8, 5, 3, 1],
      name: 'Medium Heavy',
      description: 'Medium size focus'
    },
    'large-heavy': {
      pattern: [2, 4, 6, 8, 12, 10, 8, 5],
      name: 'Large Heavy',
      description: 'Large size focus'
    },
    'equal-split': {
      pattern: [7, 7, 7, 7, 7, 7, 7, 7],
      name: 'Equal Split',
      description: 'Equal across all sizes'
    }
  },
  
  // Size configuration
  sizeLabels: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  sizeKeys: ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', '3xl']
};

// ==============================================
// GLOBAL STATE MANAGEMENT
// ==============================================

const V10_State = {
  requestType: null, // 'quotation', 'sample-request', 'bulk-order-request'
  currentStudio: 'garment',
  currentMode: 'labdips', // 'labdips' or 'designs' within design studio
  garments: new Map(),
  labDips: new Map(),
  designSamples: new Map(),
  totalQuantity: 0, // Total production quantity across all garments
  assignments: {
    labDips: new Map(), // labDipId -> Set of garmentIds
    designs: new Map()  // designId -> Set of garmentIds
  },
  
  // Enhanced quantity management
  quantities: {
    garments: new Map(),        // garmentId -> { sizes: {}, total: 0, validation: {}, colorwayCount: 1 }
    validation: new Map(),      // garmentId -> validation results
    globalMinimum: 0,          // Total minimum required across all garments
    globalTotal: 0,            // Total quantities entered
    progressPercentage: 0,     // Overall progress towards minimums
    validationCards: new Map(), // garmentId -> validation card elements
    colorwayMinimums: new Map() // garmentId-colorwayId -> minimum required per colorway
  },
  
  // Edit Mode Lock System - prevents navigation during garment editing
  editMode: {
    isLocked: false,        // Global edit mode lock
    currentGarmentId: null, // ID of garment currently being edited
    blockedAttempts: 0      // Counter for blocked navigation attempts
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
    this.quantities.garments.clear();
    this.quantities.validation.clear();
    this.quantities.validationCards.clear();
    this.quantities.colorwayMinimums.clear();
    this.quantities.globalMinimum = 0;
    this.quantities.globalTotal = 0;
    this.quantities.progressPercentage = 0;
    // Clear edit mode lock
    this.editMode.isLocked = false;
    this.editMode.currentGarmentId = null;
    this.editMode.blockedAttempts = 0;
    console.log('🗑️ V10 State cleared (including quantities and edit mode)');
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
        { code: 'Birch - 13-0905 TCX', hex: '#DDD5C7', name: 'Birch' },
        { code: 'Turtledove - 12-5202 TCX', hex: '#DED7C8', name: 'Turtledove' },
        { code: 'Bone white - 12-0105 TCX', hex: '#D7D0C0', name: 'Bone white' },
        { code: 'Silver birch - 13-4403 TCX', hex: '#D2CFC4', name: 'Silver birch' },
        { code: 'Vanilla ice - 11-0104 TCX', hex: '#F0EADA', name: 'Vanilla ice' },
        { code: 'Papyrus - 11-0107 TCX', hex: '#F5EDD6', name: 'Papyrus' },
        { code: 'Antique white - 11-0105 TCX', hex: '#EDE3D2', name: 'Antique white' },
        { code: 'Winter white - 11-0507 TCX', hex: '#F5ECD2', name: 'Winter white' },
        { code: 'Cloud cream - 12-0804 TCX', hex: '#E6DDC5', name: 'Cloud cream' },
        { code: 'Angora - 12-0605 TCX', hex: '#DFD1BB', name: 'Angora' },
        { code: 'Seedpearl - 12-0703 TCX', hex: '#E6DAC4', name: 'Seedpearl' },
        { code: 'Vanilla custard - 12-0815 TCX', hex: '#F3E0BE', name: 'Vanilla custard' },
        { code: 'Almond oil - 12-0713 TCX', hex: '#F4EFC1', name: 'Almond oil' },
        { code: 'Alabaster gleam - 12-0812 TCX', hex: '#F0DEBD', name: 'Alabaster gleam' },
        { code: 'Vanilla - 12-0712 TCX', hex: '#F4E1C1', name: 'Vanilla' },
        { code: 'Rutabaga - 12-0806 TCX', hex: '#ECDDBE', name: 'Rutabaga' },
        { code: 'Banana crepe - 13-0815 TCX', hex: '#E7D3AD', name: 'Banana crepe' },
        { code: 'Italian straw - 13-0917 TCX', hex: '#E7D1A1', name: 'Italian straw' },
        { code: 'Whitecap gray - 12-0304 TCX', hex: '#E0D5C6', name: 'Whitecap gray' },
        { code: 'Fog - 13-0607 TCX', hex: '#D0C5B1', name: 'Fog' },
        { code: 'White swan - 12-0000 TCX', hex: '#E4D7C5', name: 'White swan' },
        { code: 'Sandshell - 13-0907 TCX', hex: '#D8CCBB', name: 'Sandshell' },
        { code: 'Tapioca - 12-1403 TCX', hex: '#DCCDBC', name: 'Tapioca' },
        { code: 'Creme brulee - 13-1006 TCX', hex: '#DBCCB5', name: 'Creme brulee' },
        { code: 'Parchment - 13-0908 TCX', hex: '#DFD1BE', name: 'Parchment' },
        { code: 'Sheer pink - 12-1106 TCX', hex: '#F6E5DB', name: 'Sheer pink' },
        { code: 'Dew - 12-1108 TCX', hex: '#EEDED1', name: 'Dew' },
        { code: 'Powder puff - 11-1404 TCX', hex: '#F3E0D6', name: 'Powder puff' },
        { code: 'Pearled ivory - 11-0907 TCX', hex: '#F0DFCC', name: 'Pearled ivory' },
        { code: 'White smoke - 12-0704 TCX', hex: '#EDDCC9', name: 'White smoke' },
        { code: 'Ecru - 11-0809 TCX', hex: '#F3DFCA', name: 'Ecru' },
        { code: 'Navajo - 12-0710 TCX', hex: '#EFDCC3', name: 'Navajo' },
        { code: 'Almost mauve - 12-2103 TCX', hex: '#E7DCD9', name: 'Almost mauve' },
        { code: 'Delicacy - 11-2409 TCX', hex: '#F5E3E2', name: 'Delicacy' },
        { code: 'Petal pink - 11-2309 TCX', hex: '#F2E2E0', name: 'Petal pink' },
        { code: 'Bridal blush - 11-1005 TCX', hex: '#EEE2DD', name: 'Bridal blush' },
        { code: 'Cream pink - 11-1306 TCX', hex: '#F6E4D9', name: 'Cream pink' },
        { code: 'Angel wing - 11-1305 TCX', hex: '#F3DFD7', name: 'Angel wing' },
        { code: 'Pastel parchment - 11-0603 TCX', hex: '#E5D9D3', name: 'Pastel parchment' },
        { code: 'Star white - 11-4202 TCX', hex: '#EFEFE8', name: 'Star white' },
        { code: 'Lily white - 11-4301 TCX', hex: '#E2E2DA', name: 'Lily white' },
        { code: 'Vaporous gray - 12-4302 TCX', hex: '#DFDDD7', name: 'Vaporous gray' },
        { code: 'Summer shower - 11-4802 TCX', hex: '#E5EBE3', name: 'Summer shower' },
        { code: 'Ice - 11-4803 TCX', hex: '#E0E4D9', name: 'Ice' },
        { code: 'Frost - 12-6207 TCX', hex: '#DDE2D6', name: 'Frost' },
        { code: 'Icicle - 12-5201 TCX', hex: '#DADCD0', name: 'Icicle' },
        { code: 'Bit of blue - 11-4601 TCX', hex: '#E2EAEB', name: 'Bit of blue' },
        { code: 'Mystic blue - 11-4303 TCX', hex: '#E1E3DE', name: 'Mystic blue' },
        { code: 'Bluewash - 12-4304 TCX', hex: '#E2E6E0', name: 'Bluewash' },
        { code: 'Spa blue - 12-4305 TCX', hex: '#D3DEDF', name: 'Spa blue' },
        { code: 'Lightest sky - 11-4804 TCX', hex: '#E4EADF', name: 'Lightest sky' },
        { code: 'Hint of mint - 11-4805 TCX', hex: '#D8E8E6', name: 'Hint of mint' },
        { code: 'Murmur - 12-5203 TCX', hex: '#D2D8D2', name: 'Murmur' },
        { code: 'Barely blue - 12-4306 TCX', hex: '#DDE0DF', name: 'Barely blue' },
        { code: 'Blue blush - 12-4705 TCX', hex: '#D6DBD9', name: 'Blue blush' },
        { code: 'Zephyr blue - 12-5603 TCX', hex: '#D3D9D1', name: 'Zephyr blue' },
        { code: 'Blue flower - 12-5403 TCX', hex: '#D0D9D4', name: 'Blue flower' },
        { code: 'Sprout green - 12-5303 TCX', hex: '#CBD7D2', name: 'Sprout green' },
        { code: 'Billowing sail - 11-4604 TCX', hex: '#D8E7E7', name: 'Billowing sail' },
        { code: 'Hushed green - 12-5508 TCX', hex: '#D8E9E5', name: 'Hushed green' },
        { code: 'Lambs wool - 12-0910 TCX', hex: '#E5D0B1', name: 'Lambs wool' },
        { code: 'Winter wheat - 14-1119 TCX', hex: '#DFC09F', name: 'Winter wheat' },
        { code: 'Summer melon - 13-0814 TCX', hex: '#EAD3AE', name: 'Summer melon' },
        { code: 'Chamomile - 13-0916 TCX', hex: '#E8D0A7', name: 'Chamomile' },
        { code: 'Cornhusk - 12-0714 TCX', hex: '#F2D6AE', name: 'Cornhusk' },
        { code: 'Apricot gelato - 12-0817 TCX', hex: '#F5D7AF', name: 'Apricot gelato' },
        { code: 'Biscotti - 13-1009 TCX', hex: '#DAC7AB', name: 'Biscotti' },
        { code: 'Asparagus green - 12-0311 TCX', hex: '#D2CDB4', name: 'Asparagus green' },
        { code: 'Oyster white - 13-1007 TCX', hex: '#D2CAAF', name: 'Oyster white' },
        { code: 'Putty - 13-0711 TCX', hex: '#D4CAB0', name: 'Putty' },
        { code: 'Moth - 13-0611 TCX', hex: '#D2CBAF', name: 'Moth' },
        { code: 'Wood ash - 14-1108 TCX', hex: '#D7CAB0', name: 'Wood ash' },
        { code: 'Gravel - 14-1014 TCX', hex: '#CBBFA2', name: 'Gravel' },
        { code: 'Pale khaki - 15-1216 TCX', hex: '#BFAF92', name: 'Pale khaki' },
        { code: 'Light gray - 12-0404 TCX', hex: '#DAD8C9', name: 'Light gray' },
        { code: 'Silver green - 12-6204 TCX', hex: '#D7D7C7', name: 'Silver green' },
        { code: 'Pelican - 14-6305 TCX', hex: '#C1BCAC', name: 'Pelican' },
        { code: 'Overcast - 14-0105 TCX', hex: '#C3BDAB', name: 'Overcast' },
        { code: 'Tidal foam - 14-0210 TCX', hex: '#BFB9A3', name: 'Tidal foam' },
        { code: 'Agate gray - 15-6307 TCX', hex: '#B1B09F', name: 'Agate gray' },
        { code: 'Alfalfa - 14-6308 TCX', hex: '#B7B59F', name: 'Alfalfa' },
        { code: 'Castle wall - 14-0108 TCX', hex: '#C8C1AB', name: 'Castle wall' },
        { code: 'Oyster gray - 14-1107 TCX', hex: '#CBC1AE', name: 'Oyster gray' },
        { code: 'Cement - 14-0708 TCX', hex: '#C4B6A6', name: 'Cement' },
        { code: 'Spray green - 15-0309 TCX', hex: '#AEA692', name: 'Spray green' },
        { code: 'Eucalyptus - 15-0513 TCX', hex: '#B1A992', name: 'Eucalyptus' },
        { code: 'Twill - 16-1108 TCX', hex: '#A79B82', name: 'Twill' },
        { code: 'Olive gray - 16-1110 TCX', hex: '#A6997A', name: 'Olive gray' },
        { code: 'Chinchilla - 17-1109 TCX', hex: '#9C8E7B', name: 'Chinchilla' },
        { code: 'Seneca rock - 17-1107 TCX', hex: '#9A927F', name: 'Seneca rock' },
        { code: 'Laurel oak - 17-0610 TCX', hex: '#918C7E', name: 'Laurel oak' },
        { code: 'Coriander - 17-1113 TCX', hex: '#938772', name: 'Coriander' },
        { code: 'Dune - 17-1009 TCX', hex: '#998978', name: 'Dune' },
        { code: 'Lead gray - 17-1118 TCX', hex: '#8A7963', name: 'Lead gray' },
        { code: 'Covert green - 18-0617 TCX', hex: '#80765F', name: 'Covert green' },
        { code: 'Oxford tan - 15-1306 TCX', hex: '#B8A99A', name: 'Oxford tan' },
        { code: 'Plaza taupe - 16-1105 TCX', hex: '#AEA393', name: 'Plaza taupe' },
        { code: 'Tuffet - 16-1106 TCX', hex: '#A59788', name: 'Tuffet' },
        { code: 'Silver mink - 17-1312 TCX', hex: '#9F8D7C', name: 'Silver mink' },
        { code: 'Timber wolf - 17-1310 TCX', hex: '#8D8070', name: 'Timber wolf' },
        { code: 'Taupe gray - 17-0808 TCX', hex: '#8E7C71', name: 'Taupe gray' },
        { code: 'Pine bark - 17-1410 TCX', hex: '#827064', name: 'Pine bark' },
        { code: 'Pumice stone - 14-0002 TCX', hex: '#CAC2B9', name: 'Pumice stone' },
        { code: 'Simply taupe - 16-0906 TCX', hex: '#AD9F93', name: 'Simply taupe' },
        { code: 'Aluminum - 16-1107 TCX', hex: '#9F9586', name: 'Aluminum' },
        { code: 'Cobblestone - 16-1407 TCX', hex: '#A89A8E', name: 'Cobblestone' },
        { code: 'Brindle - 18-1110 TCX', hex: '#82776B', name: 'Brindle' },
        { code: 'Walnut - 18-1112 TCX', hex: '#776A5F', name: 'Walnut' },
        { code: 'Bungee cord - 18-0513 TCX', hex: '#696156', name: 'Bungee cord' },
        { code: 'Oatmeal - 13-0401 TCX', hex: '#CBC3B4', name: 'Oatmeal' },
        { code: 'Moonbeam - 13-0000 TCX', hex: '#CDC6BD', name: 'Moonbeam' },
        { code: 'Rainy day - 13-5304 TCX', hex: '#CFC8BD', name: 'Rainy day' },
        { code: 'Gray morn - 13-0403 TCX', hex: '#CABEB5', name: 'Gray morn' },
        { code: 'Peyote - 14-1106 TCX', hex: '#C5BBAE', name: 'Peyote' },
        { code: 'Feather gray - 15-1305 TCX', hex: '#B8AD9E', name: 'Feather gray' },
        { code: 'Goat - 16-0806 TCX', hex: '#A89A91', name: 'Goat' },
        { code: 'White sand - 13-0002 TCX', hex: '#DBD5D1', name: 'White sand' },
        { code: 'Silver gray - 14-0000 TCX', hex: '#C1B7B0', name: 'Silver gray' },
        { code: 'Chateau gray - 15-4503 TCX', hex: '#BBB1A8', name: 'Chateau gray' },
        { code: 'String - 16-1305 TCX', hex: '#AA9F96', name: 'String' },
        { code: 'Atmosphere - 16-1406 TCX', hex: '#A89C94', name: 'Atmosphere' },
        { code: 'Moon rock - 17-1210 TCX', hex: '#958B84', name: 'Moon rock' },
        { code: 'Fungi - 17-1212 TCX', hex: '#8F8177', name: 'Fungi' },
        { code: 'Silver lining - 14-4501 TCX', hex: '#BDB6AB', name: 'Silver lining' },
        { code: 'Moonstruck - 14-4500 TCX', hex: '#C2BEB6', name: 'Moonstruck' },
        { code: 'Pussywillow gray - 15-6304 TCX', hex: '#AEACA1', name: 'Pussywillow gray' },
        { code: 'London fog - 16-0207 TCX', hex: '#A29E92', name: 'London fog' },
        { code: 'Rock ridge - 17-0207 TCX', hex: '#918C86', name: 'Rock ridge' },
        { code: 'Moon mist - 18-4105 TCX', hex: '#80817D', name: 'Moon mist' },
        { code: 'Castor gray - 18-0510 TCX', hex: '#646762', name: 'Castor gray' },
        { code: 'Glacier gray - 14-4102 TCX', hex: '#C5C6C7', name: 'Glacier gray' },
        { code: 'Lunar rock - 14-4201 TCX', hex: '#C5C5C5', name: 'Lunar rock' },
        { code: 'Dawn blue - 13-4303 TCX', hex: '#CACCCB', name: 'Dawn blue' },
        { code: 'Gray violet - 14-4103 TCX', hex: '#BBBCBC', name: 'Gray violet' },
        { code: 'Vapor blue - 14-4203 TCX', hex: '#BEBDBD', name: 'Vapor blue' },
        { code: 'High rise - 15-4101 TCX', hex: '#AEB2B5', name: 'High rise' },
        { code: 'Limestone - 16-4702 TCX', hex: '#989A98', name: 'Limestone' },
        { code: 'Silver cloud - 15-4502 TCX', hex: '#BEB7B0', name: 'Silver cloud' },
        { code: 'Dove - 15-0000 TCX', hex: '#B3ADA7', name: 'Dove' },
        { code: 'Flint gray - 16-5803 TCX', hex: '#A09C98', name: 'Flint gray' },
        { code: 'Drizzle - 16-4402 TCX', hex: '#A09F9C', name: 'Drizzle' },
        { code: 'Elephant skin - 17-0205 TCX', hex: '#8F8982', name: 'Elephant skin' },
        { code: 'Cinder - 17-1506 TCX', hex: '#8A7E78', name: 'Cinder' },
        { code: 'Steeple gray - 17-1500 TCX', hex: '#827E7C', name: 'Steeple gray' },
        { code: 'Metal - 14-4503 TCX', hex: '#BABFBC', name: 'Metal' },
        { code: 'Blue fox - 14-4804 TCX', hex: '#B9BCB6', name: 'Blue fox' },
        { code: 'Storm gray - 15-4003 TCX', hex: '#B5BAB6', name: 'Storm gray' },
        { code: 'Pigeon - 15-4704 TCX', hex: '#A9AFAA', name: 'Pigeon' },
        { code: 'Mirage gray - 15-4703 TCX', hex: '#ABAFAE', name: 'Mirage gray' },
        { code: 'Puritan gray - 15-4702 TCX', hex: '#A8B0AE', name: 'Puritan gray' },
        { code: 'Wrought iron - 16-5904 TCX', hex: '#999E98', name: 'Wrought iron' },
        { code: 'Opal gray - 16-3801 TCX', hex: '#A49E9E', name: 'Opal gray' },
        { code: 'Wild dove - 17-1501 TCX', hex: '#8B8C89', name: 'Wild dove' },
        { code: 'Neutral gray - 17-4402 TCX', hex: '#8E918F', name: 'Neutral gray' },
        { code: 'Gargoyle - 18-0503 TCX', hex: '#686767', name: 'Gargoyle' },
        { code: 'Smoked pearl - 18-0000 TCX', hex: '#656466', name: 'Smoked pearl' },
        { code: 'Sedona sage - 18-5105 TCX', hex: '#686D6C', name: 'Sedona sage' },
        { code: 'Gunmetal - 18-0306 TCX', hex: '#5C5D5B', name: 'Gunmetal' },
        { code: 'Wind chime - 14-4002 TCX', hex: '#CAC5C2', name: 'Wind chime' },
        { code: 'Paloma - 16-0000 TCX', hex: '#9F9C99', name: 'Paloma' },
        { code: 'Charcoal gray - 18-0601 TCX', hex: '#6C6868', name: 'Charcoal gray' },
        { code: 'Steel gray - 18-4005 TCX', hex: '#726F70', name: 'Steel gray' },
        { code: 'Pewter - 18-5203 TCX', hex: '#666564', name: 'Pewter' },
        { code: 'Castlerock - 18-0201 TCX', hex: '#5F5E62', name: 'Castlerock' },
        { code: 'Nine iron - 19-3908 TCX', hex: '#46434A', name: 'Nine iron' },
        { code: 'Ash - 16-3802 TCX', hex: '#A09998', name: 'Ash' },
        { code: 'Cloudburst - 17-1502 TCX', hex: '#837F7F', name: 'Cloudburst' },
        { code: 'Frost gray - 17-0000 TCX', hex: '#848283', name: 'Frost gray' },
        { code: 'Excalibur - 18-3905 TCX', hex: '#676168', name: 'Excalibur' },
        { code: 'Dark gull gray - 18-0403 TCX', hex: '#625D5D', name: 'Dark gull gray' },
        { code: 'Rabbit - 19-3905 TCX', hex: '#5F575C', name: 'Rabbit' },
        { code: 'Shale - 19-3903 TCX', hex: '#4A3F41', name: 'Shale' },
        { code: 'Fossil - 17-0909 TCX', hex: '#806F63', name: 'Fossil' },
        { code: 'Major brown - 19-0810 TCX', hex: '#5B5149', name: 'Major brown' },
        { code: 'Chocolate chip - 19-0809 TCX', hex: '#685A4E', name: 'Chocolate chip' },
        { code: 'Canteen - 19-0820 TCX', hex: '#5E5347', name: 'Canteen' },
        { code: 'Stone gray - 18-0615 TCX', hex: '#685E4F', name: 'Stone gray' },
        { code: 'Capers - 18-0820 TCX', hex: '#695E4B', name: 'Capers' },
        { code: 'Beech - 19-0618 TCX', hex: '#5B4F3B', name: 'Beech' },
        { code: 'Tarmac - 19-0822 TCX', hex: '#5A5348', name: 'Tarmac' },
        { code: 'Wren - 19-0614 TCX', hex: '#4A4139', name: 'Wren' },
        { code: 'Black olive - 19-0608 TCX', hex: '#48413B', name: 'Black olive' },
        { code: 'Beluga - 19-0405 TCX', hex: '#4A4843', name: 'Beluga' },
        { code: 'Black ink - 19-0506 TCX', hex: '#44413C', name: 'Black ink' },
        { code: 'Peat - 19-0508 TCX', hex: '#3B3A36', name: 'Peat' },
        { code: 'Jet set - 19-5708 TCX', hex: '#262C2A', name: 'Jet set' },
        { code: 'Iron - 18-1306 TCX', hex: '#736460', name: 'Iron' },
        { code: 'Plum kitten - 19-3803 TCX', hex: '#625B5C', name: 'Plum kitten' },
        { code: 'Turkish coffee - 19-0812 TCX', hex: '#483F39', name: 'Turkish coffee' },
        { code: 'Black coffee - 19-1111 TCX', hex: '#3B302F', name: 'Black coffee' },
        { code: 'After dark - 19-1101 TCX', hex: '#3C3535', name: 'After dark' },
        { code: 'Licorice - 19-1102 TCX', hex: '#3A3536', name: 'Licorice' },
        { code: 'Raven - 19-0000 TCX', hex: '#413E3D', name: 'Raven' },
        { code: 'Jet black - 19-0303 TCX', hex: '#2D2C2F', name: 'Jet black' },
        { code: 'Phantom - 19-4205 TCX', hex: '#39373B', name: 'Phantom' },
        { code: 'Stretch limo - 19-4005 TCX', hex: '#2B2C30', name: 'Stretch limo' },
        { code: 'Moonless night - 19-4203 TCX', hex: '#2F2D30', name: 'Moonless night' },
        { code: 'Caviar - 19-4006 TCX', hex: '#292A2D', name: 'Caviar' },
        { code: 'Pirate black - 19-4305 TCX', hex: '#363838', name: 'Pirate black' },
        { code: 'Anthracite - 19-4007 TCX', hex: '#28282D', name: 'Anthracite' },
        { code: 'Vanilla cream - 12-1009 TCX', hex: '#F4D8C6', name: 'Vanilla cream' },
        { code: 'Dawn - 12-0811 TCX', hex: '#EBD2B7', name: 'Dawn' },
        { code: 'Gray sand - 13-1010 TCX', hex: '#E5CCAF', name: 'Gray sand' },
        { code: 'Autumn blonde - 12-0813 TCX', hex: '#EED0AE', name: 'Autumn blonde' },
        { code: 'Apricot illusion - 14-1120 TCX', hex: '#E2C4A6', name: 'Apricot illusion' },
        { code: 'Mellow buff - 13-1014 TCX', hex: '#D8B998', name: 'Mellow buff' },
        { code: 'Sheepskin - 14-1122 TCX', hex: '#DAB58F', name: 'Sheepskin' },
        { code: 'Almond buff - 14-1116 TCX', hex: '#CCB390', name: 'Almond buff' },
        { code: 'Beige - 14-1118 TCX', hex: '#D5BA98', name: 'Beige' },
        { code: 'Sand - 15-1225 TCX', hex: '#CCA67F', name: 'Sand' },
        { code: 'Latte - 15-1220 TCX', hex: '#C5A582', name: 'Latte' },
        { code: 'Tan - 16-1334 TCX', hex: '#B69574', name: 'Tan' },
        { code: 'Doe - 16-1333 TCX', hex: '#B98E68', name: 'Doe' },
        { code: 'Indian tan - 17-1328 TCX', hex: '#AD8567', name: 'Indian tan' },
        { code: 'Safari - 15-1116 TCX', hex: '#BAAA91', name: 'Safari' },
        { code: 'Candied ginger - 15-1213 TCX', hex: '#BFA387', name: 'Candied ginger' },
        { code: 'Warm sand - 15-1214 TCX', hex: '#C5AE91', name: 'Warm sand' },
        { code: 'Cuban sand - 15-1314 TCX', hex: '#C1A68D', name: 'Cuban sand' },
        { code: 'Nougat - 16-1320 TCX', hex: '#B69885', name: 'Nougat' },
        { code: 'Natural - 16-1310 TCX', hex: '#AA907D', name: 'Natural' },
        { code: 'Nomad - 16-1212 TCX', hex: '#B49F89', name: 'Nomad' },
        { code: 'Frozen dew - 13-0513 TCX', hex: '#D8CFB2', name: 'Frozen dew' },
        { code: 'Bleached sand - 13-1008 TCX', hex: '#DACCB4', name: 'Bleached sand' },
        { code: 'Pebble - 14-1112 TCX', hex: '#CAB698', name: 'Pebble' },
        { code: 'Croissant - 16-0924 TCX', hex: '#C4AB86', name: 'Croissant' },
        { code: 'Incense - 16-1010 TCX', hex: '#AF9A7E', name: 'Incense' },
        { code: 'Cornstalk - 16-1315 TCX', hex: '#A9947A', name: 'Cornstalk' },
        { code: 'Tannin - 17-1320 TCX', hex: '#A68A6D', name: 'Tannin' },
        { code: 'Green haze - 14-0615 TCX', hex: '#CAC4A4', name: 'Green haze' },
        { code: 'Mojave desert - 15-1217 TCX', hex: '#C7B595', name: 'Mojave desert' },
        { code: 'Taos taupe - 15-1119 TCX', hex: '#BFA77F', name: 'Taos taupe' },
        { code: 'Lark - 16-1324 TCX', hex: '#B89B72', name: 'Lark' },
        { code: 'Kelp - 17-1022 TCX', hex: '#988467', name: 'Kelp' },
        { code: 'Antique bronze - 17-1028 TCX', hex: '#907954', name: 'Antique bronze' },
        { code: 'Dull gold - 17-0935 TCX', hex: '#8A6F48', name: 'Dull gold' },
        { code: 'Brown sugar - 17-1134 TCX', hex: '#A17249', name: 'Brown sugar' },
        { code: 'Chipmunk - 17-1044 TCX', hex: '#976F4C', name: 'Chipmunk' },
        { code: 'Tobacco brown - 17-1327 TCX', hex: '#9A7352', name: 'Tobacco brown' },
        { code: 'Bison - 18-1027 TCX', hex: '#6E4F3A', name: 'Bison' },
        { code: 'Monks robe - 18-1048 TCX', hex: '#704822', name: 'Monks robe' },
        { code: 'Dachshund - 18-1033 TCX', hex: '#704F37', name: 'Dachshund' },
        { code: 'Toffee - 18-1031 TCX', hex: '#755139', name: 'Toffee' },
        { code: 'Aztec - 18-1130 TCX', hex: '#7A5747', name: 'Aztec' },
        { code: 'Cocoa brown - 18-1222 TCX', hex: '#6C5043', name: 'Cocoa brown' },
        { code: 'Partridge - 18-1124 TCX', hex: '#725440', name: 'Partridge' },
        { code: 'Friar brown - 19-1230 TCX', hex: '#6E493A', name: 'Friar brown' },
        { code: 'Mustang - 19-1217 TCX', hex: '#684B40', name: 'Mustang' },
        { code: 'Pinecone - 19-1121 TCX', hex: '#61473B', name: 'Pinecone' },
        { code: 'Potting soil - 19-1218 TCX', hex: '#54392D', name: 'Potting soil' },
        { code: 'Ermine - 18-1022 TCX', hex: '#836B4F', name: 'Ermine' },
        { code: 'Otter - 18-1018 TCX', hex: '#7F674F', name: 'Otter' },
        { code: 'Kangaroo - 18-0920 TCX', hex: '#725E43', name: 'Kangaroo' },
        { code: 'Sepia - 18-0928 TCX', hex: '#6B543E', name: 'Sepia' },
        { code: 'Coffee liqueur - 18-0930 TCX', hex: '#6A513B', name: 'Coffee liqueur' },
        { code: 'Desert palm - 19-0815 TCX', hex: '#5A4632', name: 'Desert palm' },
        { code: 'Teak - 19-0617 TCX', hex: '#655341', name: 'Teak' },
        { code: 'Shitake - 18-1015 TCX', hex: '#736253', name: 'Shitake' },
        { code: 'Cub - 18-1016 TCX', hex: '#6E5C4B', name: 'Cub' },
        { code: 'Carafe - 19-1116 TCX', hex: '#5D473A', name: 'Carafe' },
        { code: 'Dark earth - 19-1020 TCX', hex: '#5C4939', name: 'Dark earth' },
        { code: 'Slate black - 19-0814 TCX', hex: '#4B3D33', name: 'Slate black' },
        { code: 'Chocolate brown - 19-0912 TCX', hex: '#4E403B', name: 'Chocolate brown' },
        { code: 'Demitasse - 19-0712 TCX', hex: '#40342B', name: 'Demitasse' },
        { code: 'Deep taupe - 18-1312 TCX', hex: '#7B6660', name: 'Deep taupe' },
        { code: 'Shopping bag - 19-1213 TCX', hex: '#5A4743', name: 'Shopping bag' },
        { code: 'Chestnut - 19-1118 TCX', hex: '#584039', name: 'Chestnut' },
        { code: 'Bracken - 19-1015 TCX', hex: '#4F3F3B', name: 'Bracken' },
        { code: 'Seal brown - 19-1314 TCX', hex: '#493B39', name: 'Seal brown' },
        { code: 'Java - 19-1016 TCX', hex: '#433331', name: 'Java' },
        { code: 'Coffee bean - 19-0915 TCX', hex: '#40312F', name: 'Coffee bean' },
        { code: 'Mother of pearl - 12-1006 TCX', hex: '#E9D4C3', name: 'Mother of pearl' },
        { code: 'Pastel rose tan - 12-1007 TCX', hex: '#E9D1BF', name: 'Pastel rose tan' },
        { code: 'Novelle peach - 12-1005 TCX', hex: '#E7CFBD', name: 'Novelle peach' },
        { code: 'Sun kiss - 12-0807 TCX', hex: '#EBD1BB', name: 'Sun kiss' },
        { code: 'Ivory cream - 13-1011 TCX', hex: '#DAC0A7', name: 'Ivory cream' },
        { code: 'Shifting sand - 14-1210 TCX', hex: '#D8C0AD', name: 'Shifting sand' },
        { code: 'Appleblossom - 13-1013 TCX', hex: '#DDBCA0', name: 'Appleblossom' },
        { code: 'Eggnog - 12-0601 TCX', hex: '#ECE1D3', name: 'Eggnog' },
        { code: 'Cream tan - 13-1108 TCX', hex: '#E4C7B8', name: 'Cream tan' },
        { code: 'Sand dollar - 13-1106 TCX', hex: '#DECDBE', name: 'Sand dollar' },
        { code: 'Smoke gray - 14-1209 TCX', hex: '#CEBAA8', name: 'Smoke gray' },
        { code: 'Doeskin - 15-1308 TCX', hex: '#BDAB9B', name: 'Doeskin' },
        { code: 'Sesame - 15-1215 TCX', hex: '#BAA38B', name: 'Sesame' },
        { code: 'Light taupe - 16-1210 TCX', hex: '#B19D8D', name: 'Light taupe' },
        { code: 'Warm taupe - 16-1318 TCX', hex: '#AF9483', name: 'Warm taupe' },
        { code: 'Stucco - 16-1412 TCX', hex: '#A58D7F', name: 'Stucco' },
        { code: 'Almondine - 16-1415 TCX', hex: '#A78C8B', name: 'Almondine' },
        { code: 'Chanterelle - 16-1414 TCX', hex: '#A28776', name: 'Chanterelle' },
        { code: 'Ginger snap - 17-1418 TCX', hex: '#977D70', name: 'Ginger snap' },
        { code: 'Woodsmoke - 17-1321 TCX', hex: '#947764', name: 'Woodsmoke' },
        { code: 'Amphora - 17-1319 TCX', hex: '#9F8672', name: 'Amphora' },
        { code: 'Moonlight - 15-1309 TCX', hex: '#C5B1A0', name: 'Moonlight' },
        { code: 'Frappe - 14-1212 TCX', hex: '#D1B7A0', name: 'Frappe' },
        { code: 'Rugby tan - 15-1315 TCX', hex: '#C2A594', name: 'Rugby tan' },
        { code: 'Roebuck - 16-1221 TCX', hex: '#B09080', name: 'Roebuck' },
        { code: 'Praline - 17-1223 TCX', hex: '#AD8B75', name: 'Praline' },
        { code: 'Burro - 17-1322 TCX', hex: '#947764', name: 'Burro' },
        { code: 'Beaver fur - 17-1417 TCX', hex: '#997867', name: 'Beaver fur' },
        { code: 'Toasted almond - 14-1213 TCX', hex: '#D2B49C', name: 'Toasted almond' },
        { code: 'Tawny birch - 17-1225 TCX', hex: '#AE856C', name: 'Tawny birch' },
        { code: 'Macaroon - 16-1323 TCX', hex: '#B38B71', name: 'Macaroon' },
        { code: 'Tawny brown - 17-1226 TCX', hex: '#AB856F', name: 'Tawny brown' },
        { code: 'Camel - 17-1224 TCX', hex: '#B0846A', name: 'Camel' },
        { code: 'Toast - 16-1331 TCX', hex: '#CA9978', name: 'Toast' },
        { code: 'Toasted nut - 16-1327 TCX', hex: '#C08768', name: 'Toasted nut' },
        { code: 'Nude - 12-0911 TCX', hex: '#F2D3BC', name: 'Nude' },
        { code: 'Tender peach - 12-0912 TCX', hex: '#F8D5B8', name: 'Tender peach' },
        { code: 'Alesan - 12-0913 TCX', hex: '#F1CEB3', name: 'Alesan' },
        { code: 'Pale peach - 12-0915 TCX', hex: '#FED1BD', name: 'Pale peach' },
        { code: 'Peach puree - 12-1011 TCX', hex: '#EFCFBA', name: 'Peach puree' },
        { code: 'Bellini - 13-1114 TCX', hex: '#F4C9B1', name: 'Bellini' },
        { code: 'Amberlight - 14-1217 TCX', hex: '#E2BEA2', name: 'Amberlight' },
        { code: 'Peach dust - 12-1107 TCX', hex: '#F0D8CC', name: 'Peach dust' },
        { code: 'Linen - 12-1008 TCX', hex: '#EDD2C0', name: 'Linen' },
        { code: 'Scallop shell - 12-1010 TCX', hex: '#FBD8C9', name: 'Scallop shell' },
        { code: 'Soft pink - 12-1209 TCX', hex: '#F2D8CD', name: 'Soft pink' },
        { code: 'Pale dogwood - 13-1404 TCX', hex: '#EDCDC2', name: 'Pale dogwood' },
        { code: 'Silver peony - 12-1206 TCX', hex: '#E7CFC7', name: 'Silver peony' },
        { code: 'Rose dust - 14-1307 TCX', hex: '#CDB2A5', name: 'Rose dust' },
        { code: 'Shell - 13-1405 TCX', hex: '#E1CFC6', name: 'Shell' },
        { code: 'Whisper pink - 13-1107 TCX', hex: '#DACBBE', name: 'Whisper pink' },
        { code: 'Pink tint - 12-1404 TCX', hex: '#DBCBBD', name: 'Pink tint' },
        { code: 'Evening sand - 14-1311 TCX', hex: '#DDB6AB', name: 'Evening sand' },
        { code: 'Sirocco - 15-1317 TCX', hex: '#C39D88', name: 'Sirocco' },
        { code: 'Brush - 16-1317 TCX', hex: '#B99984', name: 'Brush' },
        { code: 'Cafe au lait - 17-1227 TCX', hex: '#AE8774', name: 'Cafe au lait' },
        { code: 'Cameo rose - 14-1310 TCX', hex: '#D7B8AB', name: 'Cameo rose' },
        { code: 'Pale blush - 14-1312 TCX', hex: '#E4BFB3', name: 'Pale blush' },
        { code: 'Rose cloud - 14-1313 TCX', hex: '#DBB0A2', name: 'Rose cloud' },
        { code: 'Spanish villa - 14-1314 TCX', hex: '#DFBAA9', name: 'Spanish villa' },
        { code: 'Maple sugar - 15-1316 TCX', hex: '#C9A38D', name: 'Maple sugar' },
        { code: 'Tuscany - 16-1219 TCX', hex: '#BE9785', name: 'Tuscany' },
        { code: 'Cork - 16-1422 TCX', hex: '#BA8671', name: 'Cork' },
        { code: 'Bisque - 13-1109 TCX', hex: '#EDCAB5', name: 'Bisque' },
        { code: 'Almost apricot - 15-1319 TCX', hex: '#E5B39B', name: 'Almost apricot' },
        { code: 'Pink sand - 15-1318 TCX', hex: '#DFB19B', name: 'Pink sand' },
        { code: 'Peach nougat - 14-1220 TCX', hex: '#E6AF91', name: 'Peach nougat' },
        { code: 'Peach bloom - 15-1327 TCX', hex: '#D99B7C', name: 'Peach bloom' },
        { code: 'Dusty coral - 15-1322 TCX', hex: '#D29B83', name: 'Dusty coral' },
        { code: 'Cafe creme - 16-1220 TCX', hex: '#C79685', name: 'Cafe creme' },
        { code: 'Sandstorm - 16-1235 TCX', hex: '#BD8B69', name: 'Sandstorm' },
        { code: 'Butterum - 16-1341 TCX', hex: '#C68F65', name: 'Butterum' },
        { code: 'Biscuit - 16-1336 TCX', hex: '#B4835B', name: 'Biscuit' },
        { code: 'Cashew - 17-1137 TCX', hex: '#A47149', name: 'Cashew' },
        { code: 'Almond - 16-1432 TCX', hex: '#A7754D', name: 'Almond' },
        { code: 'Lion - 17-1330 TCX', hex: '#A0714F', name: 'Lion' },
        { code: 'Thrush - 18-1030 TCX', hex: '#936B4F', name: 'Thrush' },
        { code: 'Mocha mousse - 17-1230 TCX', hex: '#A47864', name: 'Mocha mousse' },
        { code: 'Pecan brown - 17-1430 TCX', hex: '#A36E51', name: 'Pecan brown' },
        { code: 'Hazel - 17-1143 TCX', hex: '#AE7250', name: 'Hazel' },
        { code: 'Bran - 17-1336 TCX', hex: '#A66E4A', name: 'Bran' },
        { code: 'Adobe - 17-1340 TCX', hex: '#A3623B', name: 'Adobe' },
        { code: 'Leather brown - 18-1142 TCX', hex: '#97572B', name: 'Leather brown' },
        { code: 'Glazed ginger - 18-1154 TCX', hex: '#91552B', name: 'Glazed ginger' },
        { code: 'Sandstone - 16-1328 TCX', hex: '#C48A69', name: 'Sandstone' },
        { code: 'Caramel - 16-1439 TCX', hex: '#C37C54', name: 'Caramel' },
        { code: 'Amber brown - 17-1147 TCX', hex: '#A66646', name: 'Amber brown' },
        { code: 'Sierra - 18-1239 TCX', hex: '#985C41', name: 'Sierra' },
        { code: 'Ginger bread - 18-1244 TCX', hex: '#8C4A2F', name: 'Ginger bread' },
        { code: 'Mocha bisque - 18-1140 TCX', hex: '#8C543A', name: 'Mocha bisque' },
        { code: 'Tortoise shell - 19-1241 TCX', hex: '#754734', name: 'Tortoise shell' },
        { code: 'Pheasant - 16-1332 TCX', hex: '#C68463', name: 'Pheasant' },
        { code: 'Sunburn - 16-1429 TCX', hex: '#B37256', name: 'Sunburn' },
        { code: 'Raw sienna - 17-1436 TCX', hex: '#B9714F', name: 'Raw sienna' },
        { code: 'Autumn leaf - 17-1347 TCX', hex: '#B56A4C', name: 'Autumn leaf' },
        { code: 'Mecca orange - 18-1450 TCX', hex: '#BD5745', name: 'Mecca orange' },
        { code: 'Rust - 18-1248 TCX', hex: '#B55A30', name: 'Rust' },
        { code: 'Bombay brown - 18-1250 TCX', hex: '#9F5130', name: 'Bombay brown' },
        { code: 'Frosted almond - 13-1012 TCX', hex: '#D2C2AC', name: 'Frosted almond' },
        { code: 'Gilded beige - 14-1012 TCX', hex: '#B39F8D', name: 'Gilded beige' },
        { code: 'Pale gold - 15-0927 TCX', hex: '#BD9865', name: 'Pale gold' },
        { code: 'Rich gold - 16-0836 TCX', hex: '#C8B273', name: 'Rich gold' },
        { code: 'Copper - 16-1325 TCX', hex: '#C47E5A', name: 'Copper' },
        { code: 'Copper coin - 18-1537 TCX', hex: '#BA6B57', name: 'Copper coin' },
        { code: 'Silver - 14-5002 TCX', hex: '#A2A2A1', name: 'Silver' },
        { code: 'Raw umber - 17-1422 TCX', hex: '#92705F', name: 'Raw umber' },
        { code: 'Brownie - 18-1321 TCX', hex: '#8F7265', name: 'Brownie' },
        { code: 'Acorn - 18-1314 TCX', hex: '#7E5E52', name: 'Acorn' },
        { code: 'Clove - 18-1320 TCX', hex: '#876155', name: 'Clove' },
        { code: 'Carob brown - 18-1229 TCX', hex: '#855C4C', name: 'Carob brown' },
        { code: 'Russet - 18-1235 TCX', hex: '#8F5F50', name: 'Russet' },
        { code: 'Rawhide - 18-1137 TCX', hex: '#865E49', name: 'Rawhide' },
        { code: 'Chutney - 18-1433 TCX', hex: '#98594B', name: 'Chutney' },
        { code: 'Baked clay - 18-1441 TCX', hex: '#9C5642', name: 'Baked clay' },
        { code: 'Copper brown - 18-1336 TCX', hex: '#9A6051', name: 'Copper brown' },
        { code: 'Brown patina - 18-1242 TCX', hex: '#834F3D', name: 'Brown patina' },
        { code: 'Rustic brown - 18-1238 TCX', hex: '#855141', name: 'Rustic brown' },
        { code: 'Coconut shell - 18-1230 TCX', hex: '#874E3C', name: 'Coconut shell' },
        { code: 'Sequoia - 19-1333 TCX', hex: '#804839', name: 'Sequoia' },
        { code: 'Root beer - 19-1228 TCX', hex: '#714A41', name: 'Root beer' },
        { code: 'Brunette - 19-1235 TCX', hex: '#664238', name: 'Brunette' },
        { code: 'Sable - 19-1320 TCX', hex: '#6E403C', name: 'Sable' },
        { code: 'Cinnamon - 19-1436 TCX', hex: '#6B4139', name: 'Cinnamon' },
        { code: 'Fudgesickle - 19-1431 TCX', hex: '#63403A', name: 'Fudgesickle' },
        { code: 'Mink - 19-1430 TCX', hex: '#734B42', name: 'Mink' },
        { code: 'Cappuccino - 19-1220 TCX', hex: '#633F33', name: 'Cappuccino' },
        { code: 'Cognac - 18-1421 TCX', hex: '#8B645A', name: 'Cognac' },
        { code: 'Nutmeg - 18-1326 TCX', hex: '#7E5C54', name: 'Nutmeg' },
        { code: 'French roast - 19-1012 TCX', hex: '#58423F', name: 'French roast' },
        { code: 'Deep mahogany - 19-1420 TCX', hex: '#553B39', name: 'Deep mahogany' },
        { code: 'Rum raisin - 19-1321 TCX', hex: '#583432', name: 'Rum raisin' },
        { code: 'Brown stone - 19-1322 TCX', hex: '#593C39', name: 'Brown stone' },
        { code: 'Bitter chocolate - 19-1317 TCX', hex: '#503130', name: 'Bitter chocolate' },
        { code: 'Mahogany - 18-1425 TCX', hex: '#824D46', name: 'Mahogany' },
        { code: 'Henna - 19-1334 TCX', hex: '#7C423C', name: 'Henna' },
        { code: 'Arabian spice - 19-1245 TCX', hex: '#884332', name: 'Arabian spice' },
        { code: 'Hot chocolate - 19-1325 TCX', hex: '#683B39', name: 'Hot chocolate' },
        { code: 'Russet brown - 19-1338 TCX', hex: '#743332', name: 'Russet brown' },
        { code: 'Madder brown - 19-1331 TCX', hex: '#6A3331', name: 'Madder brown' },
        { code: 'Andorra - 19-1327 TCX', hex: '#603535', name: 'Andorra' },
        { code: 'Afterglow - 11-0510 TCX', hex: '#F3E6C9', name: 'Afterglow' },
        { code: 'Transparent yellow - 11-0617 TCX', hex: '#F4ECC2', name: 'Transparent yellow' },
        { code: 'Double cream - 12-0715 TCX', hex: '#F3E0AC', name: 'Double cream' },
        { code: 'Sunlight - 13-0822 TCX', hex: '#EDD59E', name: 'Sunlight' },
        { code: 'Straw - 13-0922 TCX', hex: '#E0C992', name: 'Straw' },
        { code: 'Jojoba - 14-0935 TCX', hex: '#DABE81', name: 'Jojoba' },
        { code: 'Rattan - 14-1031 TCX', hex: '#D1B272', name: 'Rattan' },
        { code: 'Boulder - 14-1110 TCX', hex: '#D1BE9B', name: 'Boulder' },
        { code: 'Sea mist - 13-0715 TCX', hex: '#D8C9A3', name: 'Sea mist' },
        { code: 'Reed yellow - 13-0915 TCX', hex: '#DCC99E', name: 'Reed yellow' },
        { code: 'Chino green - 13-0613 TCX', hex: '#D9CAA5', name: 'Chino green' },
        { code: 'Parsnip - 14-0925 TCX', hex: '#D6C69A', name: 'Parsnip' },
        { code: 'Dusty yellow - 12-0619 TCX', hex: '#D4CC9A', name: 'Dusty yellow' },
        { code: 'Silver fern - 15-0719 TCX', hex: '#BBAA7E', name: 'Silver fern' },
        { code: 'Lemon grass - 12-0626 TCX', hex: '#DCD494', name: 'Lemon grass' },
        { code: 'Raffia - 13-0725 TCX', hex: '#DAC483', name: 'Raffia' },
        { code: 'Golden mist - 13-0624 TCX', hex: '#D5CD94', name: 'Golden mist' },
        { code: 'Pampas - 14-0826 TCX', hex: '#CFBB7B', name: 'Pampas' },
        { code: 'Bamboo - 14-0740 TCX', hex: '#D2B04C', name: 'Bamboo' },
        { code: 'Cress green - 15-0643 TCX', hex: '#BCA949', name: 'Cress green' },
        { code: 'Olive oil - 16-0847 TCX', hex: '#A98B2D', name: 'Olive oil' },
        { code: 'Dried moss - 14-0626 TCX', hex: '#CCB97E', name: 'Dried moss' },
        { code: 'Celery - 14-0647 TCX', hex: '#CEC153', name: 'Celery' },
        { code: 'Acacia - 13-0640 TCX', hex: '#DACD65', name: 'Acacia' },
        { code: 'Sulphur - 14-0755 TCX', hex: '#DDB614', name: 'Sulphur' },
        { code: 'Oil yellow - 15-0743 TCX', hex: '#C4A647', name: 'Oil yellow' },
        { code: 'Green sulphur - 16-0742 TCX', hex: '#AE8E2C', name: 'Green sulphur' },
        { code: 'Golden palm - 17-0839 TCX', hex: '#AA8805', name: 'Golden palm' },
        { code: 'Cocoon - 14-1025 TCX', hex: '#C9B27C', name: 'Cocoon' },
        { code: 'Hemp - 14-0721 TCX', hex: '#C0AD7C', name: 'Hemp' },
        { code: 'Southern moss - 15-0730 TCX', hex: '#BCA66A', name: 'Southern moss' },
        { code: 'Olivenite - 15-0732 TCX', hex: '#C1A65C', name: 'Olivenite' },
        { code: 'Golden green - 15-0636 TCX', hex: '#BDB369', name: 'Golden green' },
        { code: 'Antique gold - 16-0730 TCX', hex: '#B59E5F', name: 'Antique gold' },
        { code: 'Burnished gold - 16-0737 TCX', hex: '#AA9855', name: 'Burnished gold' },
        { code: 'French vanilla - 12-0722 TCX', hex: '#EFE1A7', name: 'French vanilla' },
        { code: 'Pastel yellow - 11-0616 TCX', hex: '#F2E6B1', name: 'Pastel yellow' },
        { code: 'Tender yellow - 11-0710 TCX', hex: '#EDEDB7', name: 'Tender yellow' },
        { code: 'Wax yellow - 11-0618 TCX', hex: '#EDE9AD', name: 'Wax yellow' },
        { code: 'Lemonade - 12-0721 TCX', hex: '#F0E79D', name: 'Lemonade' },
        { code: 'Elfin yellow - 11-0620 TCX', hex: '#EEEA97', name: 'Elfin yellow' },
        { code: 'Limelight - 12-0740 TCX', hex: '#F0E87D', name: 'Limelight' },
        { code: 'Dusky citron - 14-0827 TCX', hex: '#E3CC81', name: 'Dusky citron' },
        { code: 'Muted lime - 14-0636 TCX', hex: '#D1C87C', name: 'Muted lime' },
        { code: 'Endive - 13-0632 TCX', hex: '#D2CC81', name: 'Endive' },
        { code: 'Custard - 13-0720 TCX', hex: '#E5D68E', name: 'Custard' },
        { code: 'Canary yellow - 12-0633 TCX', hex: '#DFD87E', name: 'Canary yellow' },
        { code: 'Yellow cream - 12-0738 TCX', hex: '#EFDC75', name: 'Yellow cream' },
        { code: 'Cream gold - 13-0739 TCX', hex: '#DEC05F', name: 'Cream gold' },
        { code: 'Aurora - 12-0642 TCX', hex: '#EDDD59', name: 'Aurora' },
        { code: 'Green sheen - 13-0648 TCX', hex: '#D9CE52', name: 'Green sheen' },
        { code: 'Maize - 13-0746 TCX', hex: '#EEC843', name: 'Maize' },
        { code: 'Blazing yellow - 12-0643 TCX', hex: '#FEE715', name: 'Blazing yellow' },
        { code: 'Buttercup - 12-0752 TCX', hex: '#FAE03C', name: 'Buttercup' },
        { code: 'Empire yellow - 14-0756 TCX', hex: '#F7D000', name: 'Empire yellow' },
        { code: 'Lemon - 13-0752 TCX', hex: '#F3BF08', name: 'Lemon' },
        { code: 'Mimosa - 14-0848 TCX', hex: '#F0C05A', name: 'Mimosa' },
        { code: 'Aspen gold - 13-0850 TCX', hex: '#FFD662', name: 'Aspen gold' },
        { code: 'Dandelion - 13-0758 TCX', hex: '#FFD02E', name: 'Dandelion' },
        { code: 'Vibrant yellow - 13-0858 TCX', hex: '#FFDA29', name: 'Vibrant yellow' },
        { code: 'Cyber yellow - 14-0760 TCX', hex: '#FFD400', name: 'Cyber yellow' },
        { code: 'Freesia - 14-0852 TCX', hex: '#F3C12C', name: 'Freesia' },
        { code: 'Lemon chrome - 13-0859 TCX', hex: '#FFC300', name: 'Lemon chrome' },
        { code: 'Mellow yellow - 12-0720 TCX', hex: '#F0DD9D', name: 'Mellow yellow' },
        { code: 'Pale banana - 12-0824 TCX', hex: '#FAE199', name: 'Pale banana' },
        { code: 'Popcorn - 12-0825 TCX', hex: '#F8DE8D', name: 'Popcorn' },
        { code: 'Sunshine - 12-0727 TCX', hex: '#FADE85', name: 'Sunshine' },
        { code: 'Lemon drop - 12-0736 TCX', hex: '#FDD878', name: 'Lemon drop' },
        { code: 'Primrose yellow - 13-0755 TCX', hex: '#F6D155', name: 'Primrose yellow' },
        { code: 'Super lemon - 14-0754 TCX', hex: '#E4BF45', name: 'Super lemon' },
        { code: 'Misted yellow - 14-0837 TCX', hex: '#DAB965', name: 'Misted yellow' },
        { code: 'Sauterne - 15-0942 TCX', hex: '#C5A253', name: 'Sauterne' },
        { code: 'Honey - 16-0946 TCX', hex: '#BA9238', name: 'Honey' },
        { code: 'Arrowwood - 16-0954 TCX', hex: '#BC8D1F', name: 'Arrowwood' },
        { code: 'Tawny olive - 16-0953 TCX', hex: '#C4962C', name: 'Tawny olive' },
        { code: 'Ceylon yellow - 15-0850 TCX', hex: '#D4AE40', name: 'Ceylon yellow' },
        { code: 'Lemon curry - 15-0751 TCX', hex: '#CDA323', name: 'Lemon curry' },
        { code: 'Fall leaf - 15-1132 TCX', hex: '#C9A86A', name: 'Fall leaf' },
        { code: 'Antelope - 16-1126 TCX', hex: '#B19664', name: 'Antelope' },
        { code: 'Mustard gold - 16-1133 TCX', hex: '#B08E51', name: 'Mustard gold' },
        { code: 'Harvest gold - 16-0948 TCX', hex: '#B68A3A', name: 'Harvest gold' },
        { code: 'Nugget gold - 16-0952 TCX', hex: '#C89720', name: 'Nugget gold' },
        { code: 'Golden spice - 15-0948 TCX', hex: '#C6973F', name: 'Golden spice' },
        { code: 'Golden yellow - 15-0953 TCX', hex: '#CB8E16', name: 'Golden yellow' },
        { code: 'Ochre - 14-1036 TCX', hex: '#D6AF66', name: 'Ochre' },
        { code: 'Tinsel - 16-0945 TCX', hex: '#C3964D', name: 'Tinsel' },
        { code: 'Bright gold - 16-0947 TCX', hex: '#CF9F52', name: 'Bright gold' },
        { code: 'Honey gold - 15-1142 TCX', hex: '#D1A054', name: 'Honey gold' },
        { code: 'Amber gold - 16-1139 TCX', hex: '#C19552', name: 'Amber gold' },
        { code: 'Mineral yellow - 15-1046 TCX', hex: '#D39C43', name: 'Mineral yellow' },
        { code: 'Narcissus - 16-0950 TCX', hex: '#C39449', name: 'Narcissus' },
        { code: 'Marzipan - 14-1113 TCX', hex: '#D8C09D', name: 'Marzipan' },
        { code: 'Curry - 16-0928 TCX', hex: '#BE9E6F', name: 'Curry' },
        { code: 'Prairie sand - 16-1326 TCX', hex: '#B59A6A', name: 'Prairie sand' },
        { code: 'Honey mustard - 17-1047 TCX', hex: '#B68F52', name: 'Honey mustard' },
        { code: 'Wood thrush - 17-1129 TCX', hex: '#A47D43', name: 'Wood thrush' },
        { code: 'Golden brown - 18-0940 TCX', hex: '#91672F', name: 'Golden brown' },
        { code: 'Bronze brown - 18-0937 TCX', hex: '#825E2F', name: 'Bronze brown' },
        { code: 'Apple cinnamon - 17-1045 TCX', hex: '#B0885A', name: 'Apple cinnamon' },
        { code: 'Bone brown - 17-1128 TCX', hex: '#9D7446', name: 'Bone brown' },
        { code: 'Dijon - 17-1125 TCX', hex: '#97754C', name: 'Dijon' },
        { code: 'Bistre - 17-1036 TCX', hex: '#98754A', name: 'Bistre' },
        { code: 'Medal bronze - 17-0942 TCX', hex: '#977547', name: 'Medal bronze' },
        { code: 'Cumin - 18-0939 TCX', hex: '#927240', name: 'Cumin' },
        { code: 'Breen - 19-1034 TCX', hex: '#795D34', name: 'Breen' },
        { code: 'Snapdragon - 13-0840 TCX', hex: '#FED777', name: 'Snapdragon' },
        { code: 'Banana cream - 13-0941 TCX', hex: '#FFCF73', name: 'Banana cream' },
        { code: 'Daffodil - 14-0850 TCX', hex: '#FDC04E', name: 'Daffodil' },
        { code: 'Yolk yellow - 14-0846 TCX', hex: '#E2B051', name: 'Yolk yellow' },
        { code: 'Golden rod - 14-0951 TCX', hex: '#E2A829', name: 'Golden rod' },
        { code: 'Old gold - 15-0955 TCX', hex: '#ECA825', name: 'Old gold' },
        { code: 'Spectra yellow - 14-0957 TCX', hex: '#F7B718', name: 'Spectra yellow' },
        { code: 'Golden haze - 12-0826 TCX', hex: '#FBD897', name: 'Golden haze' },
        { code: 'Sahara sun - 14-0936 TCX', hex: '#DFC08A', name: 'Sahara sun' },
        { code: 'New wheat - 14-1038 TCX', hex: '#D7B57F', name: 'New wheat' },
        { code: 'Cornsilk - 13-0932 TCX', hex: '#EDC373', name: 'Cornsilk' },
        { code: 'Buff yellow - 14-0847 TCX', hex: '#F1BF70', name: 'Buff yellow' },
        { code: 'Sunset gold - 13-0940 TCX', hex: '#F7C46C', name: 'Sunset gold' },
        { code: 'Golden cream - 13-0939 TCX', hex: '#F7B768', name: 'Golden cream' },
        { code: 'Impala - 13-1025 TCX', hex: '#F8CE97', name: 'Impala' },
        { code: 'Flax - 13-0935 TCX', hex: '#FFC87D', name: 'Flax' },
        { code: 'Pale marigold - 13-0945 TCX', hex: '#FFC66E', name: 'Pale marigold' },
        { code: 'Amber yellow - 13-0942 TCX', hex: '#FAB75A', name: 'Amber yellow' },
        { code: 'Amber - 14-1045 TCX', hex: '#EFAD55', name: 'Amber' },
        { code: 'Golden apricot - 14-1041 TCX', hex: '#DDA758', name: 'Golden apricot' },
        { code: 'Beeswax - 14-0941 TCX', hex: '#EBA851', name: 'Beeswax' },
        { code: 'Banana - 13-0947 TCX', hex: '#FCB953', name: 'Banana' },
        { code: 'Citrus - 14-0955 TCX', hex: '#F9AC2F', name: 'Citrus' },
        { code: 'Golden glow - 15-1050 TCX', hex: '#D99938', name: 'Golden glow' },
        { code: 'Artisans gold - 15-1049 TCX', hex: '#F2AB46', name: 'Artisans gold' },
        { code: 'Sunflower - 16-1054 TCX', hex: '#D39237', name: 'Sunflower' },
        { code: 'Buckthorn brown - 18-0935 TCX', hex: '#A76F1F', name: 'Buckthorn brown' },
        { code: 'Cathay spice - 18-0950 TCX', hex: '#99642C', name: 'Cathay spice' },
        { code: 'Taffy - 16-0940 TCX', hex: '#C39B6A', name: 'Taffy' },
        { code: 'Oak buff - 16-1144 TCX', hex: '#CF9C63', name: 'Oak buff' },
        { code: 'Honey yellow - 16-1143 TCX', hex: '#CA9456', name: 'Honey yellow' },
        { code: 'Spruce yellow - 17-1040 TCX', hex: '#BE8A4A', name: 'Spruce yellow' },
        { code: 'Inca gold - 17-1048 TCX', hex: '#BB7A2C', name: 'Inca gold' },
        { code: 'Sudan brown - 18-1160 TCX', hex: '#AC6B29', name: 'Sudan brown' },
        { code: 'Rubber - 18-0933 TCX', hex: '#815B37', name: 'Rubber' },
        { code: 'Wheat - 13-1016 TCX', hex: '#DEC5A5', name: 'Wheat' },
        { code: 'Honey peach - 13-1015 TCX', hex: '#DCBD9E', name: 'Honey peach' },
        { code: 'Desert dust - 13-1018 TCX', hex: '#E3BC8E', name: 'Desert dust' },
        { code: 'Golden straw - 12-0921 TCX', hex: '#E6BD8F', name: 'Golden straw' },
        { code: 'Buff - 13-1024 TCX', hex: '#EBC396', name: 'Buff' },
        { code: 'Desert mist - 14-1127 TCX', hex: '#E0B589', name: 'Desert mist' },
        { code: 'Clay - 15-1231 TCX', hex: '#D2A172', name: 'Clay' },
        { code: 'Golden fleece - 12-0822 TCX', hex: '#F2D1A0', name: 'Golden fleece' },
        { code: 'Apricot sherbet - 13-1031 TCX', hex: '#FACD9E', name: 'Apricot sherbet' },
        { code: 'Sunburst - 13-1030 TCX', hex: '#F6C289', name: 'Sunburst' },
        { code: 'Apricot cream - 13-1027 TCX', hex: '#F1BD89', name: 'Apricot cream' },
        { code: 'Buff orange - 14-1128 TCX', hex: '#FFBB7C', name: 'Buff orange' },
        { code: 'Chamois - 15-1145 TCX', hex: '#F7B26A', name: 'Chamois' },
        { code: 'Warm apricot - 14-1051 TCX', hex: '#FFB865', name: 'Warm apricot' },
        { code: 'Marigold - 14-1050 TCX', hex: '#FADC53', name: 'Marigold' },
        { code: 'Golden nugget - 16-1142 TCX', hex: '#DB9B59', name: 'Golden nugget' },
        { code: 'Butterscotch - 15-1147 TCX', hex: '#E19640', name: 'Butterscotch' },
        { code: 'Nugget - 16-1148 TCX', hex: '#CF8848', name: 'Nugget' },
        { code: 'Buckskin - 16-1342 TCX', hex: '#D18E54', name: 'Buckskin' },
        { code: 'Yam - 16-1140 TCX', hex: '#D0893F', name: 'Yam' },
        { code: 'Golden oak - 17-1046 TCX', hex: '#BE752D', name: 'Golden oak' },
        { code: 'Gold fusion - 15-1062 TCX', hex: '#FFB000', name: 'Gold fusion' },
        { code: 'Saffron - 14-1064 TCX', hex: '#FFA500', name: 'Saffron' },
        { code: 'Cadmium yellow - 15-1054 TCX', hex: '#EE9626', name: 'Cadmium yellow' },
        { code: 'Zinnia - 14-1159 TCX', hex: '#FFA010', name: 'Zinnia' },
        { code: 'Radiant yellow - 15-1058 TCX', hex: '#FC9E21', name: 'Radiant yellow' },
        { code: 'Apricot - 15-1153 TCX', hex: '#F19035', name: 'Apricot' },
        { code: 'Dark cheddar - 15-1150 TCX', hex: '#E08119', name: 'Dark cheddar' },
        { code: 'Apricot ice - 13-1020 TCX', hex: '#FBBE99', name: 'Apricot ice' },
        { code: 'Apricot nectar - 14-1133 TCX', hex: '#ECAA79', name: 'Apricot nectar' },
        { code: 'Gold earth - 15-1234 TCX', hex: '#DD9C6B', name: 'Gold earth' },
        { code: 'Apricot tan - 15-1237 TCX', hex: '#DD9760', name: 'Apricot tan' },
        { code: 'Topaz - 16-1150 TCX', hex: '#D08344', name: 'Topaz' },
        { code: 'Golden ochre - 16-1346 TCX', hex: '#C77943', name: 'Golden ochre' },
        { code: 'Apricot buff - 16-1443 TCX', hex: '#CD7E4D', name: 'Apricot buff' },
        { code: 'Peach cobbler - 14-1231 TCX', hex: '#FFB181', name: 'Peach cobbler' },
        { code: 'Salmon buff - 14-1135 TCX', hex: '#FEAA7B', name: 'Salmon buff' },
        { code: 'Pumpkin - 14-1139 TCX', hex: '#F5A26F', name: 'Pumpkin' },
        { code: 'Mock orange - 15-1245 TCX', hex: '#FFA368', name: 'Mock orange' },
        { code: 'Muskmelon - 15-1242 TCX', hex: '#EC935E', name: 'Muskmelon' },
        { code: 'Copper tan - 16-1338 TCX', hex: '#DE8E65', name: 'Copper tan' },
        { code: 'Coral gold - 16-1337 TCX', hex: '#D27D56', name: 'Coral gold' },
        { code: 'Russet orange - 16-1255 TCX', hex: '#E47127', name: 'Russet orange' },
        { code: 'Orange ochre - 16-1253 TCX', hex: '#DC793A', name: 'Orange ochre' },
        { code: 'Amberglow - 16-1350 TCX', hex: '#DC793E', name: 'Amberglow' },
        { code: 'Jaffa orange - 16-1454 TCX', hex: '#D86D39', name: 'Jaffa orange' },
        { code: 'Apricot orange - 17-1353 TCX', hex: '#C86B3C', name: 'Apricot orange' },
        { code: 'Burnt orange - 16-1448 TCX', hex: '#C86733', name: 'Burnt orange' },
        { code: 'Harvest pumpkin - 16-1260 TCX', hex: '#D56231', name: 'Harvest pumpkin' },
        { code: 'Blazing orange - 15-1160 TCX', hex: '#FFA64F', name: 'Blazing orange' },
        { code: 'Flame orange - 15-1157 TCX', hex: '#FB8B23', name: 'Flame orange' },
        { code: 'Bright marigold - 15-1164 TCX', hex: '#FF8D00', name: 'Bright marigold' },
        { code: 'Autumn glory - 15-1263 TCX', hex: '#FF8812', name: 'Autumn glory' },
        { code: 'Sun orange - 16-1257 TCX', hex: '#F48037', name: 'Sun orange' },
        { code: 'Persimmon orange - 16-1356 TCX', hex: '#F47327', name: 'Persimmon orange' },
        { code: 'Orange popsicle - 17-1350 TCX', hex: '#FF7913', name: 'Orange popsicle' },
        { code: 'Autumn sunset - 16-1343 TCX', hex: '#F38554', name: 'Autumn sunset' },
        { code: 'Tangerine - 15-1247 TCX', hex: '#F88F58', name: 'Tangerine' },
        { code: 'Bird of paradise - 16-1357 TCX', hex: '#FF8C55', name: 'Bird of paradise' },
        { code: 'Orange peel - 16-1359 TCX', hex: '#FA7A35', name: 'Orange peel' },
        { code: 'Mandarin orange - 16-1459 TCX', hex: '#EC6A37', name: 'Mandarin orange' },
        { code: 'Golden poppy - 16-1462 TCX', hex: '#F56733', name: 'Golden poppy' },
        { code: 'Vibrant orange - 16-1364 TCX', hex: '#FF7420', name: 'Vibrant orange' },
        { code: 'Nectarine - 16-1360 TCX', hex: '#FF8656', name: 'Nectarine' },
        { code: 'Coral rose - 16-1349 TCX', hex: '#F3774D', name: 'Coral rose' },
        { code: 'Carrot - 16-1361 TCX', hex: '#FD6F3B', name: 'Carrot' },
        { code: 'Firecracker - 16-1452 TCX', hex: '#F36944', name: 'Firecracker' },
        { code: 'Red orange - 17-1464 TCX', hex: '#F05627', name: 'Red orange' },
        { code: 'Vermillion orange - 16-1362 TCX', hex: '#F9633B', name: 'Vermillion orange' },
        { code: 'Flame - 17-1462 TCX', hex: '#F2552C', name: 'Flame' },
        { code: 'Creampuff - 13-1026 TCX', hex: '#FFCDA8', name: 'Creampuff' },
        { code: 'Bleached apricot - 12-0917 TCX', hex: '#FCCAAC', name: 'Bleached apricot' },
        { code: 'Almond cream - 13-1017 TCX', hex: '#F4C29F', name: 'Almond cream' },
        { code: 'Beach sand - 14-1225 TCX', hex: '#FBB995', name: 'Beach sand' },
        { code: 'Cream blush - 13-1019 TCX', hex: '#F8C19A', name: 'Cream blush' },
        { code: 'Caramel cream - 13-1022 TCX', hex: '#F4BA94', name: 'Caramel cream' },
        { code: 'Peach fuzz - 13-1023 TCX', hex: '#FFBE98', name: 'Peach fuzz' },
        { code: 'Prairie sunset - 13-1021 TCX', hex: '#FFBB9E', name: 'Prairie sunset' },
        { code: 'Coral sands - 14-1224 TCX', hex: '#EDAA86', name: 'Coral sands' },
        { code: 'Apricot wash - 14-1230 TCX', hex: '#FBAC82', name: 'Apricot wash' },
        { code: 'Canyon sunset - 15-1333 TCX', hex: '#E1927A', name: 'Canyon sunset' },
        { code: 'Brandied melon - 16-1340 TCX', hex: '#CE7B5B', name: 'Brandied melon' },
        { code: 'Carnelian - 16-1435 TCX', hex: '#CE785D', name: 'Carnelian' },
        { code: 'Mango - 17-1446 TCX', hex: '#B75E41', name: 'Mango' },
        { code: 'Peach - 14-1227 TCX', hex: '#F2A987', name: 'Peach' },
        { code: 'Cantaloupe - 15-1239 TCX', hex: '#FFA177', name: 'Cantaloupe' },
        { code: 'Coral reef - 15-1331 TCX', hex: '#FAA181', name: 'Coral reef' },
        { code: 'Shell coral - 15-1334 TCX', hex: '#EA9575', name: 'Shell coral' },
        { code: 'Cadmium orange - 15-1340 TCX', hex: '#F99471', name: 'Cadmium orange' },
        { code: 'Melon - 16-1442 TCX', hex: '#FE8863', name: 'Melon' },
        { code: 'Dusty orange - 16-1344 TCX', hex: '#E27A53', name: 'Dusty orange' },
        { code: 'Arabesque - 16-1441 TCX', hex: '#D16F52', name: 'Arabesque' },
        { code: 'Langoustino - 16-1440 TCX', hex: '#CA6C56', name: 'Langoustino' },
        { code: 'Ginger - 17-1444 TCX', hex: '#C96551', name: 'Ginger' },
        { code: 'Flamingo - 16-1450 TCX', hex: '#DF7253', name: 'Flamingo' },
        { code: 'Orange rust - 18-1447 TCX', hex: '#C25A3C', name: 'Orange rust' },
        { code: 'Burnt ochre - 18-1354 TCX', hex: '#BB4F35', name: 'Burnt ochre' },
        { code: 'Chili - 18-1448 TCX', hex: '#BE5141', name: 'Chili' },
        { code: 'Ginger spice - 18-1535 TCX', hex: '#B65D48', name: 'Ginger spice' },
        { code: 'Autumn glaze - 18-1451 TCX', hex: '#B3573F', name: 'Autumn glaze' },
        { code: 'Auburn - 18-1343 TCX', hex: '#A15843', name: 'Auburn' },
        { code: 'Picante - 19-1250 TCX', hex: '#8D3F2D', name: 'Picante' },
        { code: 'Tandori spice - 18-1444 TCX', hex: '#9F4440', name: 'Tandori spice' },
        { code: 'Cinnabar - 18-1540 TCX', hex: '#9C453B', name: 'Cinnabar' },
        { code: 'Bossa nova - 18-1547 TCX', hex: '#973A36', name: 'Bossa nova' },
        { code: 'Tropical peach - 13-1318 TCX', hex: '#FFC4B2', name: 'Tropical peach' },
        { code: 'Peach parfait - 14-1219 TCX', hex: '#F8BFA8', name: 'Peach parfait' },
        { code: 'Coral pink - 14-1318 TCX', hex: '#E8A798', name: 'Coral pink' },
        { code: 'Dusty pink - 14-1316 TCX', hex: '#DEAA9B', name: 'Dusty pink' },
        { code: 'Muted clay - 16-1330 TCX', hex: '#D29380', name: 'Muted clay' },
        { code: 'Shrimp - 15-1523 TCX', hex: '#E29A86', name: 'Shrimp' },
        { code: 'Tawny orange - 17-1341 TCX', hex: '#D37F6F', name: 'Tawny orange' },
        { code: 'Coral haze - 16-1329 TCX', hex: '#E38E84', name: 'Coral haze' },
        { code: 'Canyon clay - 16-1431 TCX', hex: '#CE8477', name: 'Canyon clay' },
        { code: 'Terra cotta - 16-1526 TCX', hex: '#D38377', name: 'Terra cotta' },
        { code: 'Desert sand - 17-1524 TCX', hex: '#BD7B74', name: 'Desert sand' },
        { code: 'Light mahogany - 18-1436 TCX', hex: '#AD6D68', name: 'Light mahogany' },
        { code: 'Cedar wood - 17-1525 TCX', hex: '#A1655B', name: 'Cedar wood' },
        { code: 'Withered rose - 18-1435 TCX', hex: '#A26666', name: 'Withered rose' },
        { code: 'Rose dawn - 16-1522 TCX', hex: '#C2877B', name: 'Rose dawn' },
        { code: 'Ash rose - 17-1514 TCX', hex: '#B5817D', name: 'Ash rose' },
        { code: 'Old rose - 17-1518 TCX', hex: '#B47B77', name: 'Old rose' },
        { code: 'Brick dust - 17-1424 TCX', hex: '#B07069', name: 'Brick dust' },
        { code: 'Canyon rose - 17-1520 TCX', hex: '#AF6C67', name: 'Canyon rose' },
        { code: 'Dusty cedar - 18-1630 TCX', hex: '#AD5D5D', name: 'Dusty cedar' },
        { code: 'Marsala - 18-1438 TCX', hex: '#964F4C', name: 'Marsala' },
        { code: 'Apricot brandy - 17-1540 TCX', hex: '#C26A5A', name: 'Apricot brandy' },
        { code: 'Aragon - 17-1532 TCX', hex: '#B06455', name: 'Aragon' },
        { code: 'Hot sauce - 18-1536 TCX', hex: '#AB4F41', name: 'Hot sauce' },
        { code: 'Bruschetta - 18-1346 TCX', hex: '#A75949', name: 'Bruschetta' },
        { code: 'Etruscan red - 18-1434 TCX', hex: '#A2574B', name: 'Etruscan red' },
        { code: 'Redwood - 18-1443 TCX', hex: '#A6594C', name: 'Redwood' },
        { code: 'Burnt brick - 18-1350 TCX', hex: '#A14D3A', name: 'Burnt brick' },
        { code: 'Faded rose - 18-1629 TCX', hex: '#BF6464', name: 'Faded rose' },
        { code: 'Baked apple - 18-1648 TCX', hex: '#B34646', name: 'Baked apple' },
        { code: 'Pompeian red - 18-1658 TCX', hex: '#A4292E', name: 'Pompeian red' },
        { code: 'Ketchup - 18-1449 TCX', hex: '#9A382D', name: 'Ketchup' },
        { code: 'Red ochre - 18-1442 TCX', hex: '#913832', name: 'Red ochre' },
        { code: 'Barn red - 18-1531 TCX', hex: '#8F423B', name: 'Barn red' },
        { code: 'Burnt henna - 19-1540 TCX', hex: '#7E392F', name: 'Burnt henna' },
        { code: 'Peach pearl - 14-1419 TCX', hex: '#FFB2A5', name: 'Peach pearl' },
        { code: 'Peach melba - 14-1418 TCX', hex: '#FBBDAF', name: 'Peach melba' },
        { code: 'Apricot blush - 14-1420 TCX', hex: '#FEAEA5', name: 'Apricot blush' },
        { code: 'Peach bud - 14-1324 TCX', hex: '#FDB2AB', name: 'Peach bud' },
        { code: 'Coral almond - 16-1434 TCX', hex: '#E29D94', name: 'Coral almond' },
        { code: 'Lobster bisque - 16-1520 TCX', hex: '#DD9289', name: 'Lobster bisque' },
        { code: 'Lantana - 16-1624 TCX', hex: '#DA7E7A', name: 'Lantana' },
        { code: 'Peach nectar - 14-1228 TCX', hex: '#FFB59B', name: 'Peach nectar' },
        { code: 'Salmon - 14-1323 TCX', hex: '#FAAA94', name: 'Salmon' },
        { code: 'Peach amber - 15-1423 TCX', hex: '#FB9F93', name: 'Peach amber' },
        { code: 'Desert flower - 15-1435 TCX', hex: '#FF9687', name: 'Desert flower' },
        { code: 'Peach pink - 15-1530 TCX', hex: '#FA9A85', name: 'Peach pink' },
        { code: 'Burnt coral - 16-1529 TCX', hex: '#E9897E', name: 'Burnt coral' },
        { code: 'Crabapple - 16-1532 TCX', hex: '#D77E70', name: 'Crabapple' },
        { code: 'Papaya punch - 15-1433 TCX', hex: '#FCA289', name: 'Papaya punch' },
        { code: 'Fusion coral - 16-1543 TCX', hex: '#FF8576', name: 'Fusion coral' },
        { code: 'Fresh salmon - 16-1542 TCX', hex: '#FF7F6A', name: 'Fresh salmon' },
        { code: 'Persimmon - 16-1544 TCX', hex: '#F67866', name: 'Persimmon' },
        { code: 'Coral - 16-1539 TCX', hex: '#ED7464', name: 'Coral' },
        { code: 'Living coral - 16-1546 TCX', hex: '#FF6F61', name: 'Living coral' },
        { code: 'Hot coral - 17-1656 TCX', hex: '#F35B53', name: 'Hot coral' },
        { code: 'Shell pink - 16-1632 TCX', hex: '#F88180', name: 'Shell pink' },
        { code: 'Georgia peach - 16-1641 TCX', hex: '#F97272', name: 'Georgia peach' },
        { code: 'Sugar coral - 16-1640 TCX', hex: '#F56C73', name: 'Sugar coral' },
        { code: 'Dubarry - 17-1647 TCX', hex: '#F25F66', name: 'Dubarry' },
        { code: 'Porcelain rose - 17-1643 TCX', hex: '#EA6B6A', name: 'Porcelain rose' },
        { code: 'Spiced coral - 17-1644 TCX', hex: '#D75C5D', name: 'Spiced coral' },
        { code: 'Deep sea coral - 18-1649 TCX', hex: '#D9615B', name: 'Deep sea coral' },
        { code: 'Rose of sharon - 17-1635 TCX', hex: '#DC5B62', name: 'Rose of sharon' },
        { code: 'Cayenne - 18-1651 TCX', hex: '#E04951', name: 'Cayenne' },
        { code: 'Hibiscus - 18-1762 TCX', hex: '#DD3848', name: 'Hibiscus' },
        { code: 'Poinsettia - 17-1654 TCX', hex: '#CB3441', name: 'Poinsettia' },
        { code: 'Chrysanthemum - 17-1641 TCX', hex: '#BE454F', name: 'Chrysanthemum' },
        { code: 'Cranberry - 17-1545 TCX', hex: '#BB4A4D', name: 'Cranberry' },
        { code: 'Cardinal - 18-1643 TCX', hex: '#AD3E48', name: 'Cardinal' },
        { code: 'Tigerlily - 17-1456 TCX', hex: '#E2583E', name: 'Tigerlily' },
        { code: 'Grenadine - 17-1558 TCX', hex: '#DF3F32', name: 'Grenadine' },
        { code: 'Mandarin red - 17-1562 TCX', hex: '#E74A33', name: 'Mandarin red' },
        { code: 'Fiesta - 17-1564 TCX', hex: '#DD4132', name: 'Fiesta' },
        { code: 'Cherry tomato - 17-1563 TCX', hex: '#EB3C27', name: 'Cherry tomato' },
        { code: 'Orange com - 18-1561 TCX', hex: '#DA321C', name: 'Orange com' },
        { code: 'Spicy orange - 18-1445 TCX', hex: '#D73C26', name: 'Spicy orange' },
        { code: 'Camellia - 16-1541 TCX', hex: '#F6745F', name: 'Camellia' },
        { code: 'Nasturtium - 16-1451 TCX', hex: '#FE6347', name: 'Nasturtium' },
        { code: 'Emberglow - 17-1547 TCX', hex: '#EA6759', name: 'Emberglow' },
        { code: 'Burnt sienna - 17-1544 TCX', hex: '#C65D52', name: 'Burnt sienna' },
        { code: 'Paprika - 17-1553 TCX', hex: '#CE4D42', name: 'Paprika' },
        { code: 'Red clay - 18-1454 TCX', hex: '#C2452D', name: 'Red clay' },
        { code: 'Molten lava - 18-1555 TCX', hex: '#B5332E', name: 'Molten lava' },
        { code: 'Bittersweet - 17-1663 TCX', hex: '#D93744', name: 'Bittersweet' },
        { code: 'Poppy red - 17-1664 TCX', hex: '#DC343B', name: 'Poppy red' },
        { code: 'Tomato - 18-1660 TCX', hex: '#CE2939', name: 'Tomato' },
        { code: 'Fiery red - 18-1664 TCX', hex: '#D01C1F', name: 'Fiery red' },
        { code: 'Flame scarlet - 18-1662 TCX', hex: '#CD212A', name: 'Flame scarlet' },
        { code: 'High risk red - 18-1763 TCX', hex: '#C71F2D', name: 'High risk red' },
        { code: 'Aurora red - 18-1550 TCX', hex: '#B93A32', name: 'Aurora red' },
        { code: 'Rococco red - 18-1652 TCX', hex: '#BB363F', name: 'Rococco red' },
        { code: 'Tomato puree - 18-1661 TCX', hex: '#C53346', name: 'Tomato puree' },
        { code: 'Lollipop - 18-1764 TCX', hex: '#CC1C3B', name: 'Lollipop' },
        { code: 'Ski patrol - 18-1761 TCX', hex: '#BB1237', name: 'Ski patrol' },
        { code: 'Scarlet - 19-1760 TCX', hex: '#BC2B3D', name: 'Scarlet' },
        { code: 'Lipstick red - 19-1764 TCX', hex: '#B31A38', name: 'Lipstick red' },
        { code: 'Crimson - 19-1762 TCX', hex: '#AE0E36', name: 'Crimson' },
        { code: 'Racing red - 19-1763 TCX', hex: '#BD162C', name: 'Racing red' },
        { code: 'Mars red - 18-1655 TCX', hex: '#BC2731', name: 'Mars red' },
        { code: 'Tango red - 19-1761 TCX', hex: '#AC0E2E', name: 'Tango red' },
        { code: 'Chinese red - 18-1663 TCX', hex: '#BE132D', name: 'Chinese red' },
        { code: 'Ribbon red - 19-1663 TCX', hex: '#B92636', name: 'Ribbon red' },
        { code: 'True red - 19-1664 TCX', hex: '#BF1932', name: 'True red' },
        { code: 'Chili pepper - 19-1557 TCX', hex: '#9B1B30', name: 'Chili pepper' },
        { code: 'Quartz pink - 14-1714 TCX', hex: '#EFA6AA', name: 'Quartz pink' },
        { code: 'Pink icing - 15-1717 TCX', hex: '#EEA0A6', name: 'Pink icing' },
        { code: 'Blossom - 14-1513 TCX', hex: '#F2B2AE', name: 'Blossom' },
        { code: 'Peaches n cream - 14-1521 TCX', hex: '#F4A6A3', name: 'Peaches n cream' },
        { code: 'Candlelight peach - 15-1621 TCX', hex: '#F8A39D', name: 'Candlelight peach' },
        { code: 'Strawberry ice - 16-1720 TCX', hex: '#E78B90', name: 'Strawberry ice' },
        { code: 'Peach blossom - 16-1626 TCX', hex: '#DE8286', name: 'Peach blossom' },
        { code: 'Flamingo pink - 15-1821 TCX', hex: '#F7969E', name: 'Flamingo pink' },
        { code: 'Confetti - 16-1723 TCX', hex: '#E6798E', name: 'Confetti' },
        { code: 'Bubblegum - 17-1928 TCX', hex: '#EA738D', name: 'Bubblegum' },
        { code: 'Pink lemonade - 16-1735 TCX', hex: '#EE6D8A', name: 'Pink lemonade' },
        { code: 'Camellia rose - 17-1930 TCX', hex: '#EB6081', name: 'Camellia rose' },
        { code: 'Rapture rose - 17-1929 TCX', hex: '#D16277', name: 'Rapture rose' },
        { code: 'Desert rose - 17-1927 TCX', hex: '#CF6977', name: 'Desert rose' },
        { code: 'Geranium pink - 15-1922 TCX', hex: '#F6909D', name: 'Geranium pink' },
        { code: 'Conch shell - 15-1624 TCX', hex: '#FC8F9B', name: 'Conch shell' },
        { code: 'Salmon rose - 15-1626 TCX', hex: '#FF8D94', name: 'Salmon rose' },
        { code: 'Strawberry pink - 16-1731 TCX', hex: '#F57F8E', name: 'Strawberry pink' },
        { code: 'Sunkist coral - 17-1736 TCX', hex: '#EA6676', name: 'Sunkist coral' },
        { code: 'Calypso coral - 17-1744 TCX', hex: '#EE5C6C', name: 'Calypso coral' },
        { code: 'Tea rose - 16-1620 TCX', hex: '#DC7178', name: 'Tea rose' },
        { code: 'Geranium - 17-1753 TCX', hex: '#DA3D58', name: 'Geranium' },
        { code: 'Paradise pink - 17-1755 TCX', hex: '#E4445E', name: 'Paradise pink' },
        { code: 'Teaberry - 18-1756 TCX', hex: '#DC3855', name: 'Teaberry' },
        { code: 'Rouge red - 18-1755 TCX', hex: '#E24666', name: 'Rouge red' },
        { code: 'Raspberry - 18-1754 TCX', hex: '#D32E5E', name: 'Raspberry' },
        { code: 'Azalea - 17-1842 TCX', hex: '#D42E5B', name: 'Azalea' },
        { code: 'Virtual pink - 18-1856 TCX', hex: '#C6174E', name: 'Virtual pink' },
        { code: 'Claret red - 17-1740 TCX', hex: '#C84C61', name: 'Claret red' },
        { code: 'Raspberry wine - 18-1741 TCX', hex: '#B63753', name: 'Raspberry wine' },
        { code: 'Rose red - 18-1852 TCX', hex: '#C92351', name: 'Rose red' },
        { code: 'Barberry - 18-1760 TCX', hex: '#BF1945', name: 'Barberry' },
        { code: 'Bright rose - 18-1945 TCX', hex: '#C51959', name: 'Bright rose' },
        { code: 'Persian red - 19-1860 TCX', hex: '#A21441', name: 'Persian red' },
        { code: 'Cerise - 19-1955 TCX', hex: '#A41247', name: 'Cerise' },
        { code: 'Pink lady - 13-2806 TCX', hex: '#EFC1D6', name: 'Pink lady' },
        { code: 'Lilac sachet - 14-2710 TCX', hex: '#E9ADCA', name: 'Lilac sachet' },
        { code: 'Prism pink - 14-2311 TCX', hex: '#F0A1BF', name: 'Prism pink' },
        { code: 'Begonia pink - 15-2215 TCX', hex: '#EC9ABE', name: 'Begonia pink' },
        { code: 'Fuchsia pink - 15-2718 TCX', hex: '#DF88B7', name: 'Fuchsia pink' },
        { code: 'Rosebloom - 15-2214 TCX', hex: '#E290B2', name: 'Rosebloom' },
        { code: 'Ibis rose - 17-2520 TCX', hex: '#CA628F', name: 'Ibis rose' },
        { code: 'Sachet pink - 15-2216 TCX', hex: '#F18AAD', name: 'Sachet pink' },
        { code: 'Wild orchid - 16-2120 TCX', hex: '#D979A2', name: 'Wild orchid' },
        { code: 'Aurora pink - 15-2217 TCX', hex: '#E881A6', name: 'Aurora pink' },
        { code: 'Chateau rose - 17-2120 TCX', hex: '#D2738F', name: 'Chateau rose' },
        { code: 'Morning glory - 15-1920 TCX', hex: '#EE819F', name: 'Morning glory' },
        { code: 'Azalea pink - 16-2126 TCX', hex: '#E96A97', name: 'Azalea pink' },
        { code: 'Shocking pink - 17-2127 TCX', hex: '#DE5B8C', name: 'Shocking pink' },
        { code: 'Hot pink - 17-1937 TCX', hex: '#E55982', name: 'Hot pink' },
        { code: 'Fandango pink - 17-2033 TCX', hex: '#E04F80', name: 'Fandango pink' },
        { code: 'Honeysuckle - 18-2120 TCX', hex: '#D94F70', name: 'Honeysuckle' },
        { code: 'Raspberry sorbet - 18-2043 TCX', hex: '#D2386C', name: 'Raspberry sorbet' },
        { code: 'Carmine - 17-1831 TCX', hex: '#BC4869', name: 'Carmine' },
        { code: 'Fuchsia rose - 17-2031 TCX', hex: '#C74375', name: 'Fuchsia rose' },
        { code: 'Beetroot purple - 18-2143 TCX', hex: '#CF2D71', name: 'Beetroot purple' },
        { code: 'Pink carnation - 16-2124 TCX', hex: '#ED7A9E', name: 'Pink carnation' },
        { code: 'Carmine rose - 17-2230 TCX', hex: '#E35B8F', name: 'Carmine rose' },
        { code: 'Magenta - 17-2036 TCX', hex: '#D23C77', name: 'Magenta' },
        { code: 'Pink flambe - 18-2133 TCX', hex: '#D3507A', name: 'Pink flambe' },
        { code: 'Fuchsia purple - 18-2436 TCX', hex: '#D33479', name: 'Fuchsia purple' },
        { code: 'Lilac rose - 17-2227 TCX', hex: '#BD4275', name: 'Lilac rose' },
        { code: 'Very berry - 18-2336 TCX', hex: '#B73275', name: 'Very berry' },
        { code: 'Super pink - 17-2625 TCX', hex: '#CE6BA4', name: 'Super pink' },
        { code: 'Phlox pink - 17-2627 TCX', hex: '#CE5E9A', name: 'Phlox pink' },
        { code: 'Raspberry rose - 18-2333 TCX', hex: '#CC4385', name: 'Raspberry rose' },
        { code: 'Rose violet - 17-2624 TCX', hex: '#C0428A', name: 'Rose violet' },
        { code: 'Fuchsia red - 18-2328 TCX', hex: '#AB3475', name: 'Fuchsia red' },
        { code: 'Cactus flower - 18-2326 TCX', hex: '#A83E6C', name: 'Cactus flower' },
        { code: 'Magenta haze - 18-2525 TCX', hex: '#9D446E', name: 'Magenta haze' },
        { code: 'Shrinking violet - 11-2511 TCX', hex: '#F4E1E6', name: 'Shrinking violet' },
        { code: 'Primrose pink - 12-2904 TCX', hex: '#EED4D9', name: 'Primrose pink' },
        { code: 'Silver pink - 14-1508 TCX', hex: '#DCB1AF', name: 'Silver pink' },
        { code: 'Powder pink - 14-1511 TCX', hex: '#ECB2B3', name: 'Powder pink' },
        { code: 'Mauveglow - 16-1617 TCX', hex: '#D18489', name: 'Mauveglow' },
        { code: 'Brandied apricot - 16-1610 TCX', hex: '#CA848A', name: 'Brandied apricot' },
        { code: 'Dusty rose - 17-1718 TCX', hex: '#BA797D', name: 'Dusty rose' },
        { code: 'Mauve morn - 12-2102 TCX', hex: '#ECD6D6', name: 'Mauve morn' },
        { code: 'Mauve chalk - 12-2902 TCX', hex: '#E5D0CF', name: 'Mauve chalk' },
        { code: 'Pearl - 12-1304 TCX', hex: '#F9DBD8', name: 'Pearl' },
        { code: 'Bridal rose - 15-1611 TCX', hex: '#D69FA2', name: 'Bridal rose' },
        { code: 'Blush - 15-1614 TCX', hex: '#D1969A', name: 'Blush' },
        { code: 'Baroque rose - 18-1634 TCX', hex: '#B35A66', name: 'Baroque rose' },
        { code: 'Slate rose - 18-1635 TCX', hex: '#B45865', name: 'Slate rose' },
        { code: 'Mineral red - 17-1537 TCX', hex: '#B35457', name: 'Mineral red' },
        { code: 'Garnet rose - 18-1633 TCX', hex: '#AC4B55', name: 'Garnet rose' },
        { code: 'Holly berry - 17-1633 TCX', hex: '#B44E5D', name: 'Holly berry' },
        { code: 'American beauty - 19-1759 TCX', hex: '#A73340', name: 'American beauty' },
        { code: 'Jester red - 19-1862 TCX', hex: '#9E1030', name: 'Jester red' },
        { code: 'Rio red - 19-1656 TCX', hex: '#8A2232', name: 'Rio red' },
        { code: 'Rumba red - 19-1940 TCX', hex: '#7C2439', name: 'Rumba red' },
        { code: 'Earth red - 18-1631 TCX', hex: '#95424E', name: 'Earth red' },
        { code: 'Deep claret - 19-1840 TCX', hex: '#973443', name: 'Deep claret' },
        { code: 'Garnet - 19-1655 TCX', hex: '#953640', name: 'Garnet' },
        { code: 'Brick red - 19-1543 TCX', hex: '#8C373E', name: 'Brick red' },
        { code: 'Rosewood - 19-1532 TCX', hex: '#813639', name: 'Rosewood' },
        { code: 'Tibetan red - 19-1934 TCX', hex: '#782A39', name: 'Tibetan red' },
        { code: 'Biking red - 19-1650 TCX', hex: '#77212E', name: 'Biking red' },
        { code: 'Apple butter - 18-1426 TCX', hex: '#844B4D', name: 'Apple butter' },
        { code: 'Oxblood red - 19-1524 TCX', hex: '#70393F', name: 'Oxblood red' },
        { code: 'Cowhide - 19-1533 TCX', hex: '#884344', name: 'Cowhide' },
        { code: 'Burnt russet - 19-1530 TCX', hex: '#7E3940', name: 'Burnt russet' },
        { code: 'Ruby wine - 19-1629 TCX', hex: '#77333B', name: 'Ruby wine' },
        { code: 'Cordovan - 19-1726 TCX', hex: '#702F3B', name: 'Cordovan' },
        { code: 'Tawny port - 19-1725 TCX', hex: '#5C2C35', name: 'Tawny port' },
        { code: 'Creole pink - 13-1407 TCX', hex: '#F7D5CC', name: 'Creole pink' },
        { code: 'Peach blush - 13-1504 TCX', hex: '#E4CCC6', name: 'Peach blush' },
        { code: 'Cloud pink - 13-1406 TCX', hex: '#F5D1C8', name: 'Cloud pink' },
        { code: 'Veiled rose - 12-1212 TCX', hex: '#F8CDC9', name: 'Veiled rose' },
        { code: 'Pearl blush - 12-1207 TCX', hex: '#F4CEC5', name: 'Pearl blush' },
        { code: 'English rose - 13-1310 TCX', hex: '#F4C6C3', name: 'English rose' },
        { code: 'Lotus - 14-1905 TCX', hex: '#E2C1C0', name: 'Lotus' },
        { code: 'Rosewater - 11-1408 TCX', hex: '#F6DBD8', name: 'Rosewater' },
        { code: 'Peach whip - 14-1309 TCX', hex: '#DBBEB7', name: 'Peach whip' },
        { code: 'Rose smoke - 14-1506 TCX', hex: '#D3B4AD', name: 'Rose smoke' },
        { code: 'Coral cloud - 15-1415 TCX', hex: '#E2A9A1', name: 'Coral cloud' },
        { code: 'Misty rose - 15-1512 TCX', hex: '#CAA39A', name: 'Misty rose' },
        { code: 'Peach beige - 15-1516 TCX', hex: '#D3A297', name: 'Peach beige' },
        { code: 'Cameo brown - 16-1516 TCX', hex: '#C08A80', name: 'Cameo brown' },
        { code: 'Seashell pink - 13-1409 TCX', hex: '#F7C8C2', name: 'Seashell pink' },
        { code: 'Chintz rose - 13-1408 TCX', hex: '#EEC4BE', name: 'Chintz rose' },
        { code: 'Impatiens pink - 13-1510 TCX', hex: '#FFC4BC', name: 'Impatiens pink' },
        { code: 'Peachskin - 14-1907 TCX', hex: '#DFB8B6', name: 'Peachskin' },
        { code: 'Mellow rose - 15-1515 TCX', hex: '#D9A6A1', name: 'Mellow rose' },
        { code: 'Rose tan - 16-1511 TCX', hex: '#D19C97', name: 'Rose tan' },
        { code: 'Rosette - 16-1518 TCX', hex: '#CE8E8B', name: 'Rosette' },
        { code: 'Mauvewood - 17-1522 TCX', hex: '#A75D67', name: 'Mauvewood' },
        { code: 'Rose wine - 17-1623 TCX', hex: '#A4596D', name: 'Rose wine' },
        { code: 'Malaga - 17-1723 TCX', hex: '#9F5069', name: 'Malaga' },
        { code: 'Dry rose - 18-1725 TCX', hex: '#8C4759', name: 'Dry rose' },
        { code: 'Hawthorn rose - 18-1718 TCX', hex: '#884C5E', name: 'Hawthorn rose' },
        { code: 'Maroon - 18-1619 TCX', hex: '#834655', name: 'Maroon' },
        { code: 'Wild ginger - 18-1420 TCX', hex: '#7C4C53', name: 'Wild ginger' },
        { code: 'Sangria - 19-2047 TCX', hex: '#982551', name: 'Sangria' },
        { code: 'Red bud - 19-1850 TCX', hex: '#962D49', name: 'Red bud' },
        { code: 'Beaujolais - 18-2027 TCX', hex: '#80304C', name: 'Beaujolais' },
        { code: 'Anemone - 19-2033 TCX', hex: '#842C48', name: 'Anemone' },
        { code: 'Beet red - 19-2030 TCX', hex: '#7A1F3D', name: 'Beet red' },
        { code: 'Red plum - 19-2025 TCX', hex: '#7C2946', name: 'Red plum' },
        { code: 'Rhododendron - 19-2024 TCX', hex: '#722B3F', name: 'Rhododendron' },
        { code: 'Barely pink - 12-2906 TCX', hex: '#F8D7DD', name: 'Barely pink' },
        { code: 'Blushing bride - 12-1310 TCX', hex: '#FBD3D9', name: 'Blushing bride' },
        { code: 'Cradle pink - 12-2905 TCX', hex: '#EDD0DD', name: 'Cradle pink' },
        { code: 'Pale lilac - 13-2803 TCX', hex: '#E1C6CC', name: 'Pale lilac' },
        { code: 'Chalk pink - 13-1904 TCX', hex: '#E6C5CA', name: 'Chalk pink' },
        { code: 'Light lilac - 12-2903 TCX', hex: '#DEC6D3', name: 'Light lilac' },
        { code: 'Pink nectar - 14-2305 TCX', hex: '#D8AAB7', name: 'Pink nectar' },
        { code: 'Heavenly pink - 12-1305 TCX', hex: '#F4DEDE', name: 'Heavenly pink' },
        { code: 'Potpourri - 13-2004 TCX', hex: '#E7C9CA', name: 'Potpourri' },
        { code: 'Crystal pink - 12-1605 TCX', hex: '#EDD0CE', name: 'Crystal pink' },
        { code: 'Pink dogwood - 12-1706 TCX', hex: '#F7D1D1', name: 'Pink dogwood' },
        { code: 'Crystal rose - 12-1708 TCX', hex: '#FDC3C6', name: 'Crystal rose' },
        { code: 'Strawberry cream - 13-2005 TCX', hex: '#F4C3C4', name: 'Strawberry cream' },
        { code: 'Gossamer pink - 13-1513 TCX', hex: '#FAC8C3', name: 'Gossamer pink' },
        { code: 'Rose shadow - 13-1906 TCX', hex: '#F9C2CD', name: 'Rose shadow' },
        { code: 'Orchid pink - 13-2010 TCX', hex: '#F3BBCA', name: 'Orchid pink' },
        { code: 'Almond blossom - 13-2006 TCX', hex: '#F5BEC7', name: 'Almond blossom' },
        { code: 'Coral blush - 14-1909 TCX', hex: '#E6B2B8', name: 'Coral blush' },
        { code: 'Candy pink - 14-1911 TCX', hex: '#F5B0BD', name: 'Candy pink' },
        { code: 'Peony - 15-1816 TCX', hex: '#ED9CA8', name: 'Peony' },
        { code: 'Sea pink - 15-1912 TCX', hex: '#DE98AB', name: 'Sea pink' },
        { code: 'Cashmere rose - 16-2215 TCX', hex: '#CE879F', name: 'Cashmere rose' },
        { code: 'Wild rose - 16-1715 TCX', hex: '#CE8498', name: 'Wild rose' },
        { code: 'Orchid smoke - 15-2210 TCX', hex: '#D294AA', name: 'Orchid smoke' },
        { code: 'Polignac - 16-1712 TCX', hex: '#C28799', name: 'Polignac' },
        { code: 'Lilas - 16-1708 TCX', hex: '#B88995', name: 'Lilas' },
        { code: 'Mauve orchid - 16-2111 TCX', hex: '#B58299', name: 'Mauve orchid' },
        { code: 'Orchid haze - 16-2107 TCX', hex: '#B0879B', name: 'Orchid haze' },
        { code: 'Parfait pink - 13-2804 TCX', hex: '#E9C3CF', name: 'Parfait pink' },
        { code: 'Pink mist - 13-2805 TCX', hex: '#E6BCCD', name: 'Pink mist' },
        { code: 'Cameo pink - 14-2307 TCX', hex: '#DBA9B8', name: 'Cameo pink' },
        { code: 'Sweet lilac - 14-2808 TCX', hex: '#E8B5CE', name: 'Sweet lilac' },
        { code: 'Pink lavender - 14-3207 TCX', hex: '#D9AFCA', name: 'Pink lavender' },
        { code: 'Pastel lavender - 14-3209 TCX', hex: '#D8A1C4', name: 'Pastel lavender' },
        { code: 'Orchid - 15-3214 TCX', hex: '#D198C5', name: 'Orchid' },
        { code: 'Lilac chiffon - 15-2913 TCX', hex: '#DE9BC4', name: 'Lilac chiffon' },
        { code: 'Moonlite mauve - 16-2614 TCX', hex: '#D28FB0', name: 'Moonlite mauve' },
        { code: 'Cyclamen - 16-3118 TCX', hex: '#D687BA', name: 'Cyclamen' },
        { code: 'Opera mauve - 16-3116 TCX', hex: '#CA80B1', name: 'Opera mauve' },
        { code: 'Crocus - 16-3115 TCX', hex: '#C67FAE', name: 'Crocus' },
        { code: 'Mulberry - 17-3014 TCX', hex: '#A76C97', name: 'Mulberry' },
        { code: 'Striking purple - 18-3025 TCX', hex: '#944E87', name: 'Striking purple' },
        { code: 'Violet - 16-3320 TCX', hex: '#C17FB5', name: 'Violet' },
        { code: 'Iris orchid - 17-3323 TCX', hex: '#A767A2', name: 'Iris orchid' },
        { code: 'Radiant orchid - 18-3224 TCX', hex: '#AD5E99', name: 'Radiant orchid' },
        { code: 'Spring crocus - 17-3020 TCX', hex: '#BA69A1', name: 'Spring crocus' },
        { code: 'Meadow mauve - 18-3230 TCX', hex: '#A9568C', name: 'Meadow mauve' },
        { code: 'Amethyst - 18-3015 TCX', hex: '#864D75', name: 'Amethyst' },
        { code: 'Magenta purple - 19-2428 TCX', hex: '#6B264B', name: 'Magenta purple' },
        { code: 'Rosebud - 17-3023 TCX', hex: '#B65F9A', name: 'Rosebud' },
        { code: 'Purple orchid - 18-3027 TCX', hex: '#AD4D8C', name: 'Purple orchid' },
        { code: 'Festival fuchsia - 19-2434 TCX', hex: '#9E2C6A', name: 'Festival fuchsia' },
        { code: 'Baton rouge - 18-2527 TCX', hex: '#973C6C', name: 'Baton rouge' },
        { code: 'Boysenberry - 19-2431 TCX', hex: '#85325C', name: 'Boysenberry' },
        { code: 'Raspberry radiance - 19-2432 TCX', hex: '#802A50', name: 'Raspberry radiance' },
        { code: 'Purple potion - 19-2430 TCX', hex: '#692746', name: 'Purple potion' },
        { code: 'Dahlia mauve - 17-2617 TCX', hex: '#A64F82', name: 'Dahlia mauve' },
        { code: 'Vivid viola - 18-3339 TCX', hex: '#993C7C', name: 'Vivid viola' },
        { code: 'Wild aster - 19-2630 TCX', hex: '#92316F', name: 'Wild aster' },
        { code: 'Deep orchid - 18-3022 TCX', hex: '#903F75', name: 'Deep orchid' },
        { code: 'Clover - 18-2320 TCX', hex: '#8A3371', name: 'Clover' },
        { code: 'Purple wine - 18-2929 TCX', hex: '#8C3573', name: 'Purple wine' },
        { code: 'Hollyhock - 19-2924 TCX', hex: '#823270', name: 'Hollyhock' },
        { code: 'Hyacinth violet - 18-3331 TCX', hex: '#8D4687', name: 'Hyacinth violet' },
        { code: 'Dahlia - 18-3324 TCX', hex: '#843E83', name: 'Dahlia' },
        { code: 'Sparkling grape - 19-3336 TCX', hex: '#773376', name: 'Sparkling grape' },
        { code: 'Byzantium - 19-3138 TCX', hex: '#853B7B', name: 'Byzantium' },
        { code: 'Phlox - 19-2820 TCX', hex: '#692D5D', name: 'Phlox' },
        { code: 'Grape juice - 19-3230 TCX', hex: '#682961', name: 'Grape juice' },
        { code: 'Gloxinia - 19-3022 TCX', hex: '#622E5A', name: 'Gloxinia' },
        { code: 'Crystal gray - 13-3801 TCX', hex: '#D7CBC4', name: 'Crystal gray' },
        { code: 'Mushroom - 14-1305 TCX', hex: '#BDACA3', name: 'Mushroom' },
        { code: 'Shadow gray - 16-1509 TCX', hex: '#BBA5A0', name: 'Shadow gray' },
        { code: 'Sphinx - 16-1703 TCX', hex: '#AB9895', name: 'Sphinx' },
        { code: 'Bark - 16-1506 TCX', hex: '#A99592', name: 'Bark' },
        { code: 'Fawn - 16-1510 TCX', hex: '#AE9490', name: 'Fawn' },
        { code: 'Adobe rose - 16-1508 TCX', hex: '#BA9F99', name: 'Adobe rose' },
        { code: 'Pale mauve - 15-1607 TCX', hex: '#C6A4A4', name: 'Pale mauve' },
        { code: 'Woodrose - 16-1806 TCX', hex: '#AE8C8E', name: 'Woodrose' },
        { code: 'Deauville mauve - 16-1707 TCX', hex: '#AF9294', name: 'Deauville mauve' },
        { code: 'Twilight mauve - 18-1807 TCX', hex: '#8B6F70', name: 'Twilight mauve' },
        { code: 'Rose taupe - 18-1612 TCX', hex: '#806062', name: 'Rose taupe' },
        { code: 'Rose brown - 18-1512 TCX', hex: '#80565B', name: 'Rose brown' },
        { code: 'Roan rouge - 18-1616 TCX', hex: '#885157', name: 'Roan rouge' },
        { code: 'Antler - 17-1510 TCX', hex: '#957A76', name: 'Antler' },
        { code: 'Peppercorn - 18-1409 TCX', hex: '#6C5656', name: 'Peppercorn' },
        { code: 'Raisin - 19-1606 TCX', hex: '#524144', name: 'Raisin' },
        { code: 'Huckleberry - 19-1620 TCX', hex: '#5B4349', name: 'Huckleberry' },
        { code: 'Catawba grape - 19-1621 TCX', hex: '#5D3C43', name: 'Catawba grape' },
        { code: 'Puce - 19-1518 TCX', hex: '#503938', name: 'Puce' },
        { code: 'Fudge - 19-1619 TCX', hex: '#493338', name: 'Fudge' },
        { code: 'Mahogany rose - 15-1511 TCX', hex: '#C5A193', name: 'Mahogany rose' },
        { code: 'Burlwood - 17-1516 TCX', hex: '#9B716B', name: 'Burlwood' },
        { code: 'Marron - 18-1415 TCX', hex: '#6E4C4B', name: 'Marron' },
        { code: 'Decadent chocolate - 19-1625 TCX', hex: '#513235', name: 'Decadent chocolate' },
        { code: 'Red mahogany - 19-1521 TCX', hex: '#60373D', name: 'Red mahogany' },
        { code: 'Vineyard wine - 19-1623 TCX', hex: '#58363D', name: 'Vineyard wine' },
        { code: 'Winetasting - 19-2118 TCX', hex: '#492A34', name: 'Winetasting' },
        { code: 'Port - 19-1525 TCX', hex: '#663336', name: 'Port' },
        { code: 'Chocolate truffle - 19-1526 TCX', hex: '#612E35', name: 'Chocolate truffle' },
        { code: 'Burgundy - 19-1617 TCX', hex: '#64313E', name: 'Burgundy' },
        { code: 'Zinfandel - 19-1522 TCX', hex: '#5C2935', name: 'Zinfandel' },
        { code: 'Windsor wine - 19-1528 TCX', hex: '#582B36', name: 'Windsor wine' },
        { code: 'Port royale - 19-1627 TCX', hex: '#502B33', name: 'Port royale' },
        { code: 'Fig - 19-1718 TCX', hex: '#532D3B', name: 'Fig' },
        { code: 'Violet ice - 15-2706 TCX', hex: '#C2ACB1', name: 'Violet ice' },
        { code: 'Burnished lilac - 15-1905 TCX', hex: '#C5AEB1', name: 'Burnished lilac' },
        { code: 'Keepsake lilac - 15-2705 TCX', hex: '#C0A5AE', name: 'Keepsake lilac' },
        { code: 'Mauve shadows - 16-3205 TCX', hex: '#B598A3', name: 'Mauve shadows' },
        { code: 'Dawn pink - 15-2205 TCX', hex: '#BFA3AF', name: 'Dawn pink' },
        { code: 'Fragrant lilac - 14-3204 TCX', hex: '#CEADBE', name: 'Fragrant lilac' },
        { code: 'Mauve mist - 15-3207 TCX', hex: '#C49BD4', name: 'Mauve mist' },
        { code: 'Heather rose - 17-1608 TCX', hex: '#AD6D7F', name: 'Heather rose' },
        { code: 'Red violet - 17-1818 TCX', hex: '#A35776', name: 'Red violet' },
        { code: 'Mellow mauve - 17-1612 TCX', hex: '#996378', name: 'Mellow mauve' },
        { code: 'Bordeaux - 17-1710 TCX', hex: '#96637B', name: 'Bordeaux' },
        { code: 'Violet quartz - 18-1720 TCX', hex: '#8B4963', name: 'Violet quartz' },
        { code: 'Damson - 18-1716 TCX', hex: '#854C65', name: 'Damson' },
        { code: 'Amaranth - 19-2410 TCX', hex: '#6F3C56', name: 'Amaranth' },
        { code: 'Zephyr - 15-1906 TCX', hex: '#C89FA5', name: 'Zephyr' },
        { code: 'Dusky orchid - 17-1610 TCX', hex: '#9A7182', name: 'Dusky orchid' },
        { code: 'Grape shake - 18-2109 TCX', hex: '#886971', name: 'Grape shake' },
        { code: 'Wistful mauve - 17-1511 TCX', hex: '#946C74', name: 'Wistful mauve' },
        { code: 'Tulipwood - 18-1709 TCX', hex: '#805466', name: 'Tulipwood' },
        { code: 'Grape nectar - 18-1710 TCX', hex: '#8D5C74', name: 'Grape nectar' },
        { code: 'Argyle purple - 18-3011 TCX', hex: '#895C79', name: 'Argyle purple' },
        { code: 'Nostalgia rose - 17-1512 TCX', hex: '#A4777E', name: 'Nostalgia rose' },
        { code: 'Deco rose - 17-1614 TCX', hex: '#985F68', name: 'Deco rose' },
        { code: 'Renaissance rose - 18-1613 TCX', hex: '#865560', name: 'Renaissance rose' },
        { code: 'Nocturne - 18-1614 TCX', hex: '#7A4B56', name: 'Nocturne' },
        { code: 'Crushed berry - 18-1418 TCX', hex: '#804F5A', name: 'Crushed berry' },
        { code: 'Crushed violets - 19-2312 TCX', hex: '#643A4C', name: 'Crushed violets' },
        { code: 'Mauve wine - 19-1716 TCX', hex: '#5B3644', name: 'Mauve wine' },
        { code: 'Plum wine - 18-1411 TCX', hex: '#674550', name: 'Plum wine' },
        { code: 'Eggplant - 19-2311 TCX', hex: '#613F4C', name: 'Eggplant' },
        { code: 'Prune - 19-2014 TCX', hex: '#603749', name: 'Prune' },
        { code: 'Prune purple - 19-1608 TCX', hex: '#5C3A4D', name: 'Prune purple' },
        { code: 'Grape wine - 19-2315 TCX', hex: '#5A2F43', name: 'Grape wine' },
        { code: 'Italian plum - 19-2514 TCX', hex: '#533146', name: 'Italian plum' },
        { code: 'Potent purple - 19-2520 TCX', hex: '#462639', name: 'Potent purple' },
        { code: 'Lavender herb - 16-3310 TCX', hex: '#B18EAA', name: 'Lavender herb' },
        { code: 'Lavender mist - 16-3307 TCX', hex: '#AE90A7', name: 'Lavender mist' },
        { code: 'Valerian - 17-3410 TCX', hex: '#9F7A93', name: 'Valerian' },
        { code: 'Very grape - 18-3220 TCX', hex: '#927288', name: 'Very grape' },
        { code: 'Grapeade - 18-3211 TCX', hex: '#85677B', name: 'Grapeade' },
        { code: 'Purple gumdrop - 18-3012 TCX', hex: '#7A596F', name: 'Purple gumdrop' },
        { code: 'Berry conserve - 18-3013 TCX', hex: '#765269', name: 'Berry conserve' },
        { code: 'Chinese violet - 18-3418 TCX', hex: '#835E81', name: 'Chinese violet' },
        { code: 'Crushed grape - 18-3522 TCX', hex: '#7A547F', name: 'Crushed grape' },
        { code: 'Concord grape - 18-3218 TCX', hex: '#7C5379', name: 'Concord grape' },
        { code: 'Sunset purple - 19-3424 TCX', hex: '#6F456E', name: 'Sunset purple' },
        { code: 'Wood violet - 19-3325 TCX', hex: '#75406A', name: 'Wood violet' },
        { code: 'Purple passion - 19-3223 TCX', hex: '#683D62', name: 'Purple passion' },
        { code: 'Dark purple - 19-2524 TCX', hex: '#582147', name: 'Dark purple' },
        { code: 'Grape jam - 18-3415 TCX', hex: '#725671', name: 'Grape jam' },
        { code: 'Deep purple - 19-3323 TCX', hex: '#50314C', name: 'Deep purple' },
        { code: 'Wineberry - 19-2814 TCX', hex: '#5A395B', name: 'Wineberry' },
        { code: 'Grape royale - 19-3518 TCX', hex: '#4F2D54', name: 'Grape royale' },
        { code: 'Plum purple - 19-3218 TCX', hex: '#51304E', name: 'Plum purple' },
        { code: 'Hortensia - 19-2009 TCX', hex: '#553B50', name: 'Hortensia' },
        { code: 'Blackberry wine - 19-2816 TCX', hex: '#4D3246', name: 'Blackberry wine' },
        { code: 'Navy cosmos - 19-3714 TCX', hex: '#503B53', name: 'Navy cosmos' },
        { code: 'Indigo - 19-3215 TCX', hex: '#4C3957', name: 'Indigo' },
        { code: 'Purple pennant - 19-3519 TCX', hex: '#432C47', name: 'Purple pennant' },
        { code: 'Plum perfect - 19-3316 TCX', hex: '#473442', name: 'Plum perfect' },
        { code: 'Sweet grape - 19-3619 TCX', hex: '#4B3B4F', name: 'Sweet grape' },
        { code: 'Shadow purple - 19-3217 TCX', hex: '#4E334E', name: 'Shadow purple' },
        { code: 'Blackberry cordial - 19-3520 TCX', hex: '#3F2A47', name: 'Blackberry cordial' },
        { code: 'Purple reign - 19-3620 TCX', hex: '#56456B', name: 'Purple reign' },
        { code: 'Mulberry purple - 19-3722 TCX', hex: '#493C62', name: 'Mulberry purple' },
        { code: 'Gothic grape - 19-3720 TCX', hex: '#473951', name: 'Gothic grape' },
        { code: 'Grape - 19-3728 TCX', hex: '#433455', name: 'Grape' },
        { code: 'Mysterioso - 19-3617 TCX', hex: '#46394B', name: 'Mysterioso' },
        { code: 'Purple velvet - 19-3725 TCX', hex: '#41354D', name: 'Purple velvet' },
        { code: 'Nightshade - 19-3712 TCX', hex: '#433748', name: 'Nightshade' },
        { code: 'Orchid tint - 13-3802 TCX', hex: '#DBD2DB', name: 'Orchid tint' },
        { code: 'Lilac ash - 13-3803 TCX', hex: '#D7CDCD', name: 'Lilac ash' },
        { code: 'Gray lilac - 13-3804 TCX', hex: '#D4CACD', name: 'Gray lilac' },
        { code: 'Hushed violet - 14-3803 TCX', hex: '#D1C0BF', name: 'Hushed violet' },
        { code: 'Cloud gray - 15-3802 TCX', hex: '#B7A9AC', name: 'Cloud gray' },
        { code: 'Quail - 17-1505 TCX', hex: '#98868C', name: 'Quail' },
        { code: 'Nirvana - 17-3808 TCX', hex: '#A2919B', name: 'Nirvana' },
        { code: 'Orchid hush - 13-3805 TCX', hex: '#CEC3D2', name: 'Orchid hush' },
        { code: 'Iris - 14-3805 TCX', hex: '#BAAFBC', name: 'Iris' },
        { code: 'Sea fog - 16-3304 TCX', hex: '#A5929D', name: 'Sea fog' },
        { code: 'Elderberry - 17-1605 TCX', hex: '#9D848E', name: 'Elderberry' },
        { code: 'Black plum - 18-1706 TCX', hex: '#6C5765', name: 'Black plum' },
        { code: 'Flint - 18-1405 TCX', hex: '#705861', name: 'Flint' },
        { code: 'Sassafras - 19-1624 TCX', hex: '#54353B', name: 'Sassafras' },
        { code: 'Evening haze - 14-3904 TCX', hex: '#BDB8C7', name: 'Evening haze' },
        { code: 'Thistle - 14-3907 TCX', hex: '#B9B3C5', name: 'Thistle' },
        { code: 'Lavender gray - 17-3910 TCX', hex: '#9890A2', name: 'Lavender gray' },
        { code: 'Minimal gray - 17-3906 TCX', hex: '#948D99', name: 'Minimal gray' },
        { code: 'Purple ash - 17-3810 TCX', hex: '#8F8395', name: 'Purple ash' },
        { code: 'Gray ridge - 18-3710 TCX', hex: '#847986', name: 'Gray ridge' },
        { code: 'Purple sage - 18-3712 TCX', hex: '#75697E', name: 'Purple sage' },
        { code: 'Heirloom lilac - 16-3812 TCX', hex: '#9D96B2', name: 'Heirloom lilac' },
        { code: 'Wisteria - 16-3810 TCX', hex: '#A198AF', name: 'Wisteria' },
        { code: 'Dusk - 17-3812 TCX', hex: '#897F98', name: 'Dusk' },
        { code: 'Daybreak - 17-3817 TCX', hex: '#8981A0', name: 'Daybreak' },
        { code: 'Cadet - 18-3812 TCX', hex: '#6A6378', name: 'Cadet' },
        { code: 'Mulled grape - 18-3714 TCX', hex: '#675A74', name: 'Mulled grape' },
        { code: 'Purple plumeria - 19-3716 TCX', hex: '#473854', name: 'Purple plumeria' },
        { code: 'Lilac marble - 14-3903 TCX', hex: '#C3BABF', name: 'Lilac marble' },
        { code: 'Ashes of roses - 15-0703 TCX', hex: '#B5ACAB', name: 'Ashes of roses' },
        { code: 'Gull gray - 16-3803 TCX', hex: '#A49CA0', name: 'Gull gray' },
        { code: 'Zinc - 17-2601 TCX', hex: '#92898A', name: 'Zinc' },
        { code: 'Gull - 17-3802 TCX', hex: '#918C8F', name: 'Gull' },
        { code: 'Shark - 18-1703 TCX', hex: '#6D636B', name: 'Shark' },
        { code: 'Sparrow - 18-1404 TCX', hex: '#69595C', name: 'Sparrow' },
        { code: 'Orchid ice - 13-3406 TCX', hex: '#E0D0DB', name: 'Orchid ice' },
        { code: 'Lilac snow - 13-3405 TCX', hex: '#E0C7D7', name: 'Lilac snow' },
        { code: 'Winsome orchid - 14-3206 TCX', hex: '#D4B9CB', name: 'Winsome orchid' },
        { code: 'Fair orchid - 15-3508 TCX', hex: '#C0AAC0', name: 'Fair orchid' },
        { code: 'Lavender frost - 15-3507 TCX', hex: '#BDABBE', name: 'Lavender frost' },
        { code: 'Orchid petal - 14-3710 TCX', hex: '#BFB4CB', name: 'Orchid petal' },
        { code: 'Pastel lilac - 14-3812 TCX', hex: '#BDB0D0', name: 'Pastel lilac' },
        { code: 'Orchid bloom - 14-3612 TCX', hex: '#C5AECF', name: 'Orchid bloom' },
        { code: 'Orchid bouquet - 15-3412 TCX', hex: '#D1ACCE', name: 'Orchid bouquet' },
        { code: 'Lupine - 16-3521 TCX', hex: '#BE9CC1', name: 'Lupine' },
        { code: 'Violet tulle - 16-3416 TCX', hex: '#C193C0', name: 'Violet tulle' },
        { code: 'Sheer lilac - 16-3617 TCX', hex: '#B793C0', name: 'Sheer lilac' },
        { code: 'African violet - 16-3520 TCX', hex: '#B085B7', name: 'African violet' },
        { code: 'Dusty lavender - 17-3313 TCX', hex: '#A1759C', name: 'Dusty lavender' },
        { code: 'Paisley purple - 17-3730 TCX', hex: '#8B79B1', name: 'Paisley purple' },
        { code: 'Hyacinth - 17-3619 TCX', hex: '#936CA7', name: 'Hyacinth' },
        { code: 'Amethyst orchid - 17-3628 TCX', hex: '#926AA6', name: 'Amethyst orchid' },
        { code: 'Dewberry - 18-3533 TCX', hex: '#8B5987', name: 'Dewberry' },
        { code: 'Purple heart - 18-3520 TCX', hex: '#745587', name: 'Purple heart' },
        { code: 'Meadow violet - 19-3526 TCX', hex: '#764F82', name: 'Meadow violet' },
        { code: 'Royal purple - 19-3642 TCX', hex: '#603F83', name: 'Royal purple' },
        { code: 'Deep lavender - 18-3633 TCX', hex: '#775496', name: 'Deep lavender' },
        { code: 'Royal lilac - 18-3531 TCX', hex: '#774D8E', name: 'Royal lilac' },
        { code: 'Pansy - 19-3542 TCX', hex: '#653D7C', name: 'Pansy' },
        { code: 'Bright violet - 19-3438 TCX', hex: '#784384', name: 'Bright violet' },
        { code: 'Amaranth purple - 19-3536 TCX', hex: '#6A397B', name: 'Amaranth purple' },
        { code: 'Purple magic - 19-3540 TCX', hex: '#663271', name: 'Purple magic' },
        { code: 'Plum - 19-3220 TCX', hex: '#5A315D', name: 'Plum' },
        { code: 'Imperial palace - 18-3615 TCX', hex: '#604E7A', name: 'Imperial palace' },
        { code: 'Patrician purple - 18-3518 TCX', hex: '#6C4E79', name: 'Patrician purple' },
        { code: 'Loganberry - 19-3622 TCX', hex: '#5A4769', name: 'Loganberry' },
        { code: 'Majesty - 19-3514 TCX', hex: '#593761', name: 'Majesty' },
        { code: 'Imperial purple - 19-3528 TCX', hex: '#542C5D', name: 'Imperial purple' },
        { code: 'Crown jewel - 19-3640 TCX', hex: '#482D54', name: 'Crown jewel' },
        { code: 'Parachute purple - 19-3731 TCX', hex: '#392852', name: 'Parachute purple' },
        { code: 'Lavender fog - 13-3820 TCX', hex: '#D2C4D6', name: 'Lavender fog' },
        { code: 'Lavendula - 15-3620 TCX', hex: '#BCA4CB', name: 'Lavendula' },
        { code: 'Lavender - 15-3817 TCX', hex: '#AFA4CE', name: 'Lavender' },
        { code: 'Bougainvillea - 17-3725 TCX', hex: '#9884B9', name: 'Bougainvillea' },
        { code: 'Violet tulip - 16-3823 TCX', hex: '#9E91C3', name: 'Violet tulip' },
        { code: 'Chalk violet - 17-3615 TCX', hex: '#8F7DA5', name: 'Chalk violet' },
        { code: 'Purple haze - 18-3718 TCX', hex: '#807396', name: 'Purple haze' },
        { code: 'Smoky grape - 16-3110 TCX', hex: '#B88AAC', name: 'Smoky grape' },
        { code: 'Regal orchid - 16-3525 TCX', hex: '#A98BAF', name: 'Regal orchid' },
        { code: 'Viola - 16-3815 TCX', hex: '#A692BA', name: 'Viola' },
        { code: 'Orchid mist - 17-3612 TCX', hex: '#917798', name: 'Orchid mist' },
        { code: 'Grape compote - 18-3513 TCX', hex: '#6B5876', name: 'Grape compote' },
        { code: 'Montana grape - 18-3715 TCX', hex: '#6C5971', name: 'Montana grape' },
        { code: 'Vintage violet - 18-3410 TCX', hex: '#634F62', name: 'Vintage violet' },
        { code: 'Aster purple - 17-3826 TCX', hex: '#7D74A8', name: 'Aster purple' },
        { code: 'Dahlia purple - 17-3834 TCX', hex: '#7E6EAC', name: 'Dahlia purple' },
        { code: 'Passion flower - 18-3737 TCX', hex: '#6D5698', name: 'Passion flower' },
        { code: 'Ultra violet - 18-3838 TCX', hex: '#5F4B8B', name: 'Ultra violet' },
        { code: 'Prism violet - 19-3748 TCX', hex: '#53357D', name: 'Prism violet' },
        { code: 'Heliotrope - 19-3737 TCX', hex: '#4F3872', name: 'Heliotrope' },
        { code: 'Petunia - 19-3632 TCX', hex: '#4F3466', name: 'Petunia' },
        { code: 'Corsican blue - 18-3828 TCX', hex: '#646093', name: 'Corsican blue' },
        { code: 'Veronica - 18-3834 TCX', hex: '#6D6695', name: 'Veronica' },
        { code: 'Blue iris - 18-3943 TCX', hex: '#5A5B9F', name: 'Blue iris' },
        { code: 'Purple opulence - 18-3840 TCX', hex: '#60569A', name: 'Purple opulence' },
        { code: 'Gentian violet - 19-3730 TCX', hex: '#544275', name: 'Gentian violet' },
        { code: 'Liberty - 19-3850 TCX', hex: '#4D448A', name: 'Liberty' },
        { code: 'Deep blue - 19-3847 TCX', hex: '#44377D', name: 'Deep blue' },
        { code: 'Bleached denim - 18-3930 TCX', hex: '#646F9B', name: 'Bleached denim' },
        { code: 'Heron - 18-3817 TCX', hex: '#62617E', name: 'Heron' },
        { code: 'Skipper blue - 19-3936 TCX', hex: '#484A72', name: 'Skipper blue' },
        { code: 'Navy blue - 19-3832 TCX', hex: '#403F6F', name: 'Navy blue' },
        { code: 'Deep wisteria - 19-3842 TCX', hex: '#443F6F', name: 'Deep wisteria' },
        { code: 'Blue ribbon - 19-3839 TCX', hex: '#3A395F', name: 'Blue ribbon' },
        { code: 'Astral aura - 19-3830 TCX', hex: '#363151', name: 'Astral aura' },
        { code: 'Lilac hint - 13-4105 TCX', hex: '#D0D0DA', name: 'Lilac hint' },
        { code: 'Misty lilac - 15-3807 TCX', hex: '#BCB4C4', name: 'Misty lilac' },
        { code: 'Lavender blue - 14-3905 TCX', hex: '#C5C0D0', name: 'Lavender blue' },
        { code: 'Purple heather - 14-3911 TCX', hex: '#BAB8D3', name: 'Purple heather' },
        { code: 'Cosmic sky - 15-3909 TCX', hex: '#AAAAC4', name: 'Cosmic sky' },
        { code: 'Languid lavender - 15-3910 TCX', hex: '#A2A1BA', name: 'Languid lavender' },
        { code: 'Dapple gray - 16-3907 TCX', hex: '#9C9BA7', name: 'Dapple gray' },
        { code: 'Sweet lavender - 16-3931 TCX', hex: '#9A9BC1', name: 'Sweet lavender' },
        { code: 'Easter egg - 16-3925 TCX', hex: '#919BC9', name: 'Easter egg' },
        { code: 'Jacaranda - 17-3930 TCX', hex: '#848DC5', name: 'Jacaranda' },
        { code: 'Deep periwinkle - 17-3932 TCX', hex: '#7C83BC', name: 'Deep periwinkle' },
        { code: 'Dusted peri - 18-3833 TCX', hex: '#696BA0', name: 'Dusted peri' },
        { code: 'Violet storm - 18-3944 TCX', hex: '#5C619D', name: 'Violet storm' },
        { code: 'Baja blue - 18-3946 TCX', hex: '#5F6DB0', name: 'Baja blue' },
        { code: 'Thistle down - 16-3930 TCX', hex: '#9499BB', name: 'Thistle down' },
        { code: 'Persian violet - 17-3925 TCX', hex: '#8C8EB2', name: 'Persian violet' },
        { code: 'Twilight purple - 18-3820 TCX', hex: '#66648B', name: 'Twilight purple' },
        { code: 'Orient blue - 19-3947 TCX', hex: '#47457A', name: 'Orient blue' },
        { code: 'Clematis blue - 19-3951 TCX', hex: '#363B7C', name: 'Clematis blue' },
        { code: 'Royal blue - 19-3955 TCX', hex: '#3D428B', name: 'Royal blue' },
        { code: 'Spectrum blue - 18-3963 TCX', hex: '#3D3C7C', name: 'Spectrum blue' },
        { code: 'Lavender violet - 17-3924 TCX', hex: '#767BA5', name: 'Lavender violet' },
        { code: 'Blue ice - 17-3922 TCX', hex: '#70789B', name: 'Blue ice' },
        { code: 'Velvet morning - 18-3927 TCX', hex: '#60688D', name: 'Velvet morning' },
        { code: 'Marlin - 18-3932 TCX', hex: '#515B87', name: 'Marlin' },
        { code: 'Blueprint - 19-3939 TCX', hex: '#2D3359', name: 'Blueprint' },
        { code: 'Blue depths - 19-3940 TCX', hex: '#263056', name: 'Blue depths' },
        { code: 'Medieval blue - 19-3933 TCX', hex: '#29304E', name: 'Medieval blue' },
        { code: 'Lavender aura - 16-3911 TCX', hex: '#9F99AA', name: 'Lavender aura' },
        { code: 'Stonewash - 17-3917 TCX', hex: '#74809A', name: 'Stonewash' },
        { code: 'Nightshadow blue - 19-3919 TCX', hex: '#4E5368', name: 'Nightshadow blue' },
        { code: 'Blue indigo - 19-3928 TCX', hex: '#49516D', name: 'Blue indigo' },
        { code: 'Graystone - 19-3915 TCX', hex: '#4D495B', name: 'Graystone' },
        { code: 'Crown blue - 19-3926 TCX', hex: '#464B65', name: 'Crown blue' },
        { code: 'Deep cobalt - 19-3935 TCX', hex: '#404466', name: 'Deep cobalt' },
        { code: 'Arctic ice - 13-4110 TCX', hex: '#BFC7D6', name: 'Arctic ice' },
        { code: 'Gray dawn - 14-4106 TCX', hex: '#BBC1CC', name: 'Gray dawn' },
        { code: 'Heather - 14-4110 TCX', hex: '#B7C0D6', name: 'Heather' },
        { code: 'Eventide - 16-3919 TCX', hex: '#959EB7', name: 'Eventide' },
        { code: 'Silver lake blue - 17-4030 TCX', hex: '#618BB9', name: 'Silver lake blue' },
        { code: 'Blue bonnet - 17-3936 TCX', hex: '#6384B8', name: 'Blue bonnet' },
        { code: 'Blue yonder - 18-3937 TCX', hex: '#5A77A8', name: 'Blue yonder' },
        { code: 'Lavender lustre - 16-3920 TCX', hex: '#8C9CC1', name: 'Lavender lustre' },
        { code: 'Purple impression - 17-3919 TCX', hex: '#858FB1', name: 'Purple impression' },
        { code: 'Grapemist - 16-3929 TCX', hex: '#8398CA', name: 'Grapemist' },
        { code: 'Vista blue - 15-3930 TCX', hex: '#81A0D4', name: 'Vista blue' },
        { code: 'Cornflower blue - 16-4031 TCX', hex: '#7391C8', name: 'Cornflower blue' },
        { code: 'Persian jewel - 17-3934 TCX', hex: '#6E81BE', name: 'Persian jewel' },
        { code: 'Wedgewood - 18-3935 TCX', hex: '#6479B3', name: 'Wedgewood' },
        { code: 'Skyway - 14-4112 TCX', hex: '#ADBED3', name: 'Skyway' },
        { code: 'Cashmere blue - 14-4115 TCX', hex: '#A5B8D0', name: 'Cashmere blue' },
        { code: 'Blue bell - 14-4121 TCX', hex: '#93B4D7', name: 'Blue bell' },
        { code: 'Placid blue - 15-3920 TCX', hex: '#8CADD3', name: 'Placid blue' },
        { code: 'Della robbia blue - 16-4020 TCX', hex: '#7A9DCB', name: 'Della robbia blue' },
        { code: 'Provence - 16-4032 TCX', hex: '#658DC6', name: 'Provence' },
        { code: 'Ultramarine - 17-4037 TCX', hex: '#5B7EBD', name: 'Ultramarine' },
        { code: 'Allure - 16-4021 TCX', hex: '#7291B4', name: 'Allure' },
        { code: 'Colony blue - 17-3923 TCX', hex: '#65769A', name: 'Colony blue' },
        { code: 'Moonlight blue - 18-4027 TCX', hex: '#506886', name: 'Moonlight blue' },
        { code: 'Dutch blue - 18-3928 TCX', hex: '#4A638D', name: 'Dutch blue' },
        { code: 'Delft - 19-4039 TCX', hex: '#3D5E8C', name: 'Delft' },
        { code: 'Limoges - 19-4044 TCX', hex: '#243F6C', name: 'Limoges' },
        { code: 'Estate blue - 19-4027 TCX', hex: '#233658', name: 'Estate blue' },
        { code: 'Infinity - 17-4015 TCX', hex: '#6E7E99', name: 'Infinity' },
        { code: 'Bijou blue - 18-3921 TCX', hex: '#4E5E7F', name: 'Bijou blue' },
        { code: 'Coastal fjord - 18-3920 TCX', hex: '#505D7E', name: 'Coastal fjord' },
        { code: 'True navy - 19-4030 TCX', hex: '#3F5277', name: 'True navy' },
        { code: 'Ensign blue - 19-4026 TCX', hex: '#384C67', name: 'Ensign blue' },
        { code: 'Dark denim - 19-4118 TCX', hex: '#35465E', name: 'Dark denim' },
        { code: 'Insignia blue - 19-4028 TCX', hex: '#2F3E55', name: 'Insignia blue' },
        { code: 'Air blue - 15-4319 TCX', hex: '#77ACC7', name: 'Air blue' },
        { code: 'Heritage blue - 16-4127 TCX', hex: '#5D96BC', name: 'Heritage blue' },
        { code: 'Ethereal blue - 15-4323 TCX', hex: '#5CA6CE', name: 'Ethereal blue' },
        { code: 'Bonnie blue - 16-4134 TCX', hex: '#539CCC', name: 'Bonnie blue' },
        { code: 'Cendre blue - 17-4131 TCX', hex: '#3E7FA5', name: 'Cendre blue' },
        { code: 'Parisian blue - 18-4036 TCX', hex: '#4F7CA4', name: 'Parisian blue' },
        { code: 'Faience - 18-4232 TCX', hex: '#2A6A8B', name: 'Faience' },
        { code: 'Alaskan blue - 15-4225 TCX', hex: '#6DA9D2', name: 'Alaskan blue' },
        { code: 'Little boy blue - 16-4132 TCX', hex: '#6EA2D5', name: 'Little boy blue' },
        { code: 'Azure blue - 17-4139 TCX', hex: '#4D91C6', name: 'Azure blue' },
        { code: 'Riviera - 17-4027 TCX', hex: '#5879A2', name: 'Riviera' },
        { code: 'Federal blue - 18-4029 TCX', hex: '#43628B', name: 'Federal blue' },
        { code: 'Star sapphire - 18-4041 TCX', hex: '#386192', name: 'Star sapphire' },
        { code: 'Bright cobalt - 19-4037 TCX', hex: '#385D8D', name: 'Bright cobalt' },
        { code: 'Dusk blue - 16-4120 TCX', hex: '#7BA0C0', name: 'Dusk blue' },
        { code: 'Regatta - 18-4039 TCX', hex: '#487AB7', name: 'Regatta' },
        { code: 'Palace blue - 18-4043 TCX', hex: '#346CB0', name: 'Palace blue' },
        { code: 'Strong blue - 18-4051 TCX', hex: '#1F5DA0', name: 'Strong blue' },
        { code: 'Turkish sea - 19-4053 TCX', hex: '#195190', name: 'Turkish sea' },
        { code: 'Olympian blue - 19-4056 TCX', hex: '#1A4C8B', name: 'Olympian blue' },
        { code: 'Classic blue - 19-4052 TCX', hex: '#0F4C81', name: 'Classic blue' },
        { code: 'Marina - 17-4041 TCX', hex: '#4F84C4', name: 'Marina' },
        { code: 'Campanula - 18-4141 TCX', hex: '#3272AF', name: 'Campanula' },
        { code: 'Daphne - 18-4045 TCX', hex: '#0F5F9A', name: 'Daphne' },
        { code: 'Victoria blue - 18-4148 TCX', hex: '#08589D', name: 'Victoria blue' },
        { code: 'Snorkel blue - 19-4049 TCX', hex: '#034F84', name: 'Snorkel blue' },
        { code: 'Nautical blue - 19-4050 TCX', hex: '#1A5091', name: 'Nautical blue' },
        { code: 'Princess blue - 19-4150 TCX', hex: '#00539C', name: 'Princess blue' },
        { code: 'Dazzling blue - 18-3949 TCX', hex: '#3850A0', name: 'Dazzling blue' },
        { code: 'Amparo blue - 18-3945 TCX', hex: '#4960A8', name: 'Amparo blue' },
        { code: 'Deep ultramarine - 19-3950 TCX', hex: '#384883', name: 'Deep ultramarine' },
        { code: 'Surf the web - 19-3952 TCX', hex: '#203C7F', name: 'Surf the web' },
        { code: 'Mazarine blue - 19-3864 TCX', hex: '#273C76', name: 'Mazarine blue' },
        { code: 'True blue - 19-4057 TCX', hex: '#1E4477', name: 'True blue' },
        { code: 'Twilight blue - 19-3938 TCX', hex: '#313D64', name: 'Twilight blue' },
        { code: 'Kentucky blue - 15-3915 TCX', hex: '#A5B3CC', name: 'Kentucky blue' },
        { code: 'Cerulean - 15-4020 TCX', hex: '#9BB7D4', name: 'Cerulean' },
        { code: 'Powder blue - 14-4214 TCX', hex: '#96B3D2', name: 'Powder blue' },
        { code: 'Forever blue - 16-4019 TCX', hex: '#899BB8', name: 'Forever blue' },
        { code: 'Tempest - 17-3915 TCX', hex: '#79839B', name: 'Tempest' },
        { code: 'Country blue - 17-3918 TCX', hex: '#717F9B', name: 'Country blue' },
        { code: 'English manor - 17-3920 TCX', hex: '#7181A4', name: 'English manor' },
        { code: 'Illusion blue - 13-4103 TCX', hex: '#C9D3DC', name: 'Illusion blue' },
        { code: 'Ballad blue - 13-4304 TCX', hex: '#C0CEDA', name: 'Ballad blue' },
        { code: 'Baby blue - 13-4308 TCX', hex: '#B5C7D3', name: 'Baby blue' },
        { code: 'Celestial blue - 14-4210 TCX', hex: '#A3B4C4', name: 'Celestial blue' },
        { code: 'Blue fog - 15-4008 TCX', hex: '#9BABBB', name: 'Blue fog' },
        { code: 'Flint stone - 18-3916 TCX', hex: '#677283', name: 'Flint stone' },
        { code: 'Folkstone gray - 18-3910 TCX', hex: '#626879', name: 'Folkstone gray' },
        { code: 'Pearl blue - 14-4206 TCX', hex: '#B0B7BE', name: 'Pearl blue' },
        { code: 'Monument - 17-4405 TCX', hex: '#84898C', name: 'Monument' },
        { code: 'Dark slate - 19-4220 TCX', hex: '#46515A', name: 'Dark slate' },
        { code: 'Midnight navy - 19-4110 TCX', hex: '#34414E', name: 'Midnight navy' },
        { code: 'Total eclipse - 19-4010 TCX', hex: '#2C313D', name: 'Total eclipse' },
        { code: 'Blue graphite - 19-4015 TCX', hex: '#323137', name: 'Blue graphite' },
        { code: 'Dark navy - 19-4013 TCX', hex: '#232F36', name: 'Dark navy' },
        { code: 'Ice flow - 13-4404 TCX', hex: '#C6D2D2', name: 'Ice flow' },
        { code: 'Quarry - 15-4305 TCX', hex: '#98A0A5', name: 'Quarry' },
        { code: 'Griffin - 17-5102 TCX', hex: '#8D8F8F', name: 'Griffin' },
        { code: 'Dark shadow - 19-3906 TCX', hex: '#4A4B4D', name: 'Dark shadow' },
        { code: 'Ombre blue - 19-4014 TCX', hex: '#434854', name: 'Ombre blue' },
        { code: 'India ink - 19-4019 TCX', hex: '#3C3F4A', name: 'India ink' },
        { code: 'Ebony - 19-4104 TCX', hex: '#41424A', name: 'Ebony' },
        { code: 'Patriot blue - 19-3925 TCX', hex: '#363756', name: 'Patriot blue' },
        { code: 'Eclipse - 19-3810 TCX', hex: '#343148', name: 'Eclipse' },
        { code: 'Mood indigo - 19-4025 TCX', hex: '#353A4C', name: 'Mood indigo' },
        { code: 'Peacoat - 19-3920 TCX', hex: '#2B2E43', name: 'Peacoat' },
        { code: 'Black iris - 19-3921 TCX', hex: '#2B3042', name: 'Black iris' },
        { code: 'Dress blues - 19-4024 TCX', hex: '#2A3244', name: 'Dress blues' },
        { code: 'Blue nights - 19-4023 TCX', hex: '#363B48', name: 'Blue nights' },
        { code: 'Angel falls - 15-4105 TCX', hex: '#A3BDD3', name: 'Angel falls' },
        { code: 'Dream blue - 15-4005 TCX', hex: '#A0BCD0', name: 'Dream blue' },
        { code: 'Ashley blue - 16-4013 TCX', hex: '#8699AB', name: 'Ashley blue' },
        { code: 'Dusty blue - 16-4010 TCX', hex: '#8C9DAD', name: 'Dusty blue' },
        { code: 'Indian teal - 19-4227 TCX', hex: '#3C586B', name: 'Indian teal' },
        { code: 'Stargazer - 19-4316 TCX', hex: '#39505C', name: 'Stargazer' },
        { code: 'Orion blue - 19-4229 TCX', hex: '#3E4F5C', name: 'Orion blue' },
        { code: 'Forget me not - 15-4312 TCX', hex: '#8FADBD', name: 'Forget me not' },
        { code: 'Faded denim - 17-4021 TCX', hex: '#798EA4', name: 'Faded denim' },
        { code: 'Blue shadow - 17-4020 TCX', hex: '#66829A', name: 'Blue shadow' },
        { code: 'Coronet blue - 18-3922 TCX', hex: '#59728E', name: 'Coronet blue' },
        { code: 'Captains blue - 18-4020 TCX', hex: '#557088', name: 'Captains blue' },
        { code: 'Copen blue - 18-4025 TCX', hex: '#516B84', name: 'Copen blue' },
        { code: 'China blue - 18-3918 TCX', hex: '#546477', name: 'China blue' },
        { code: 'Adriatic blue - 17-4320 TCX', hex: '#5C899B', name: 'Adriatic blue' },
        { code: 'Provincial blue - 18-4220 TCX', hex: '#5C798E', name: 'Provincial blue' },
        { code: 'Niagara - 17-4123 TCX', hex: '#5487A4', name: 'Niagara' },
        { code: 'Blue heaven - 17-4023 TCX', hex: '#5B7E98', name: 'Blue heaven' },
        { code: 'Stellar - 18-4026 TCX', hex: '#46647E', name: 'Stellar' },
        { code: 'Real teal - 18-4018 TCX', hex: '#405D73', name: 'Real teal' },
        { code: 'Majolica blue - 19-4125 TCX', hex: '#274357', name: 'Majolica blue' },
        { code: 'Starlight blue - 12-4609 TCX', hex: '#B5CED4', name: 'Starlight blue' },
        { code: 'Winter sky - 14-4307 TCX', hex: '#A9C0CB', name: 'Winter sky' },
        { code: 'Stratosphere - 14-4508 TCX', hex: '#9EC1CC', name: 'Stratosphere' },
        { code: 'Sterling blue - 15-4309 TCX', hex: '#A2B9C2', name: 'Sterling blue' },
        { code: 'Arona - 16-4109 TCX', hex: '#879BA3', name: 'Arona' },
        { code: 'Citadel - 17-4111 TCX', hex: '#748995', name: 'Citadel' },
        { code: 'Blue mirage - 18-4215 TCX', hex: '#5C6D7C', name: 'Blue mirage' },
        { code: 'Cloud blue - 14-4306 TCX', hex: '#A2B6B9', name: 'Cloud blue' },
        { code: 'Ether - 14-4506 TCX', hex: '#9EB6B8', name: 'Ether' },
        { code: 'Cameo blue - 16-4414 TCX', hex: '#769DA6', name: 'Cameo blue' },
        { code: 'Stone blue - 16-4114 TCX', hex: '#829CA5', name: 'Stone blue' },
        { code: 'Tourmaline - 16-4411 TCX', hex: '#86A1A9', name: 'Tourmaline' },
        { code: 'Smoke blue - 17-4412 TCX', hex: '#6D8994', name: 'Smoke blue' },
        { code: 'Bluestone - 18-4217 TCX', hex: '#577284', name: 'Bluestone' },
        { code: 'Aquamarine - 14-4313 TCX', hex: '#9DC3D4', name: 'Aquamarine' },
        { code: 'Sky blue - 14-4318 TCX', hex: '#8ABAD3', name: 'Sky blue' },
        { code: 'Milky blue - 15-4415 TCX', hex: '#72A8BA', name: 'Milky blue' },
        { code: 'Blue grotto - 15-4421 TCX', hex: '#5CACCE', name: 'Blue grotto' },
        { code: 'Norse blue - 15-4427 TCX', hex: '#4CA5C7', name: 'Norse blue' },
        { code: 'Aquarius - 16-4530 TCX', hex: '#3CADD4', name: 'Aquarius' },
        { code: 'Maui blue - 16-4525 TCX', hex: '#52A2B4', name: 'Maui blue' },
        { code: 'Blue mist - 16-4421 TCX', hex: '#5BACC3', name: 'Blue mist' },
        { code: 'River blue - 15-4720 TCX', hex: '#38AFCD', name: 'River blue' },
        { code: 'Cyan blue - 16-4529 TCX', hex: '#14A3C7', name: 'Cyan blue' },
        { code: 'Horizon blue - 16-4427 TCX', hex: '#289DBE', name: 'Horizon blue' },
        { code: 'Blue moon - 17-4328 TCX', hex: '#3686A0', name: 'Blue moon' },
        { code: 'Bluejay - 17-4427 TCX', hex: '#157EA0', name: 'Bluejay' },
        { code: 'Mediterranean blue - 18-4334 TCX', hex: '#1478A7', name: 'Mediterranean blue' },
        { code: 'Bachelor button - 14-4522 TCX', hex: '#4ABBD5', name: 'Bachelor button' },
        { code: 'Blue atoll - 16-4535 TCX', hex: '#00B1D2', name: 'Blue atoll' },
        { code: 'Vivid blue - 17-4432 TCX', hex: '#0088B0', name: 'Vivid blue' },
        { code: 'Hawaiian ocean - 17-4540 TCX', hex: '#008DB9', name: 'Hawaiian ocean' },
        { code: 'Blue danube - 17-4440 TCX', hex: '#0087B6', name: 'Blue danube' },
        { code: 'Blue jewel - 18-4535 TCX', hex: '#007BAA', name: 'Blue jewel' },
        { code: 'Methyl blue - 18-4537 TCX', hex: '#0074A8', name: 'Methyl blue' },
        { code: 'Malibu blue - 17-4435 TCX', hex: '#008CC1', name: 'Malibu blue' },
        { code: 'Blithe - 17-4336 TCX', hex: '#0084BD', name: 'Blithe' },
        { code: 'Swedish blue - 18-4330 TCX', hex: '#007EB1', name: 'Swedish blue' },
        { code: 'Dresden blue - 17-4433 TCX', hex: '#0086BB', name: 'Dresden blue' },
        { code: 'Diva blue - 17-4247 TCX', hex: '#007BB2', name: 'Diva blue' },
        { code: 'Blue aster - 18-4252 TCX', hex: '#0077B3', name: 'Blue aster' },
        { code: 'Cloisonne - 18-4440 TCX', hex: '#0075AF', name: 'Cloisonne' },
        { code: 'French blue - 18-4140 TCX', hex: '#0072B5', name: 'French blue' },
        { code: 'Brilliant blue - 18-4247 TCX', hex: '#0075B3', name: 'Brilliant blue' },
        { code: 'Directoire blue - 18-4244 TCX', hex: '#0061A3', name: 'Directoire blue' },
        { code: 'Skydiver - 19-4151 TCX', hex: '#00589B', name: 'Skydiver' },
        { code: 'Imperial blue - 19-4245 TCX', hex: '#005A92', name: 'Imperial blue' },
        { code: 'Deep water - 18-4032 TCX', hex: '#266691', name: 'Deep water' },
        { code: 'Dark blue - 19-4035 TCX', hex: '#305679', name: 'Dark blue' },
        { code: 'Pastel blue - 12-4607 TCX', hex: '#BCD3D5', name: 'Pastel blue' },
        { code: 'Clearwater - 12-4608 TCX', hex: '#AAD5DB', name: 'Clearwater' },
        { code: 'Blue glow - 13-4409 TCX', hex: '#B2D4DD', name: 'Blue glow' },
        { code: 'Plume - 13-4809 TCX', hex: '#A5CFD5', name: 'Plume' },
        { code: 'Porcelain blue - 14-4512 TCX', hex: '#95C0CB', name: 'Porcelain blue' },
        { code: 'Crystal blue - 13-4411 TCX', hex: '#A1C8DB', name: 'Crystal blue' },
        { code: 'Petit four - 14-4516 TCX', hex: '#87C2D4', name: 'Petit four' },
        { code: 'Wan blue - 12-4805 TCX', hex: '#CBDCDF', name: 'Wan blue' },
        { code: 'Whispering blue - 12-4610 TCX', hex: '#C9DCDC', name: 'Whispering blue' },
        { code: 'Skylight - 12-4604 TCX', hex: '#C8E0E0', name: 'Skylight' },
        { code: 'Aquatic - 14-4510 TCX', hex: '#99C1CC', name: 'Aquatic' },
        { code: 'Marine blue - 15-4712 TCX', hex: '#76AFB6', name: 'Marine blue' },
        { code: 'Reef waters - 16-4612 TCX', hex: '#6F9FA9', name: 'Reef waters' },
        { code: 'Arctic - 17-4911 TCX', hex: '#648589', name: 'Arctic' },
        { code: 'Chalk blue - 12-4806 TCX', hex: '#CCDAD7', name: 'Chalk blue' },
        { code: 'Pale blue - 13-4804 TCX', hex: '#C4D6D3', name: 'Pale blue' },
        { code: 'Misty blue - 13-4405 TCX', hex: '#BFCDCC', name: 'Misty blue' },
        { code: 'Sky gray - 14-4504 TCX', hex: '#BCC8C6', name: 'Sky gray' },
        { code: 'Surf spray - 14-4807 TCX', hex: '#B4C8C2', name: 'Surf spray' },
        { code: 'Gray mist - 15-4706 TCX', hex: '#99AEAE', name: 'Gray mist' },
        { code: 'Aquifer - 15-5207 TCX', hex: '#89ACAC', name: 'Aquifer' },
        { code: 'Blue glass - 12-5206 TCX', hex: '#C6E3E1', name: 'Blue glass' },
        { code: 'Icy morn - 13-5306 TCX', hex: '#B0D3D1', name: 'Icy morn' },
        { code: 'Canal blue - 14-4810 TCX', hex: '#9CC2C5', name: 'Canal blue' },
        { code: 'Pastel turquoise - 13-5309 TCX', hex: '#99C5C4', name: 'Pastel turquoise' },
        { code: 'Aqua haze - 15-5209 TCX', hex: '#87B9BC', name: 'Aqua haze' },
        { code: 'Aqua sea - 15-4715 TCX', hex: '#6BAAAE', name: 'Aqua sea' },
        { code: 'Meadowbrook - 16-5121 TCX', hex: '#60A0A3', name: 'Meadowbrook' },
        { code: 'Glacier - 12-5505 TCX', hex: '#C3DBD4', name: 'Glacier' },
        { code: 'Fair aqua - 12-5409 TCX', hex: '#B8E2DC', name: 'Fair aqua' },
        { code: 'Soothing sea - 12-5209 TCX', hex: '#C3E9E4', name: 'Soothing sea' },
        { code: 'Bleached aqua - 12-5410 TCX', hex: '#BCE3DF', name: 'Bleached aqua' },
        { code: 'Blue light - 13-4909 TCX', hex: '#ACDFDD', name: 'Blue light' },
        { code: 'Blue tint - 13-4910 TCX', hex: '#9FD9D7', name: 'Blue tint' },
        { code: 'Aqua sky - 14-4811 TCX', hex: '#7BC4C4', name: 'Aqua sky' },
        { code: 'Morning mist - 12-5204 TCX', hex: '#CFDFDB', name: 'Morning mist' },
        { code: 'Harbor gray - 14-4908 TCX', hex: '#A8C0BB', name: 'Harbor gray' },
        { code: 'Eggshell blue - 14-4809 TCX', hex: '#A3CCC9', name: 'Eggshell blue' },
        { code: 'Dusty turquoise - 16-5114 TCX', hex: '#649B9E', name: 'Dusty turquoise' },
        { code: 'Porcelain - 16-4719 TCX', hex: '#5D9CA4', name: 'Porcelain' },
        { code: 'Brittany blue - 18-5610 TCX', hex: '#4C7E86', name: 'Brittany blue' },
        { code: 'Hydro - 18-4718 TCX', hex: '#426972', name: 'Hydro' },
        { code: 'Blue haze - 15-4707 TCX', hex: '#A5BCBB', name: 'Blue haze' },
        { code: 'Nile blue - 15-5210 TCX', hex: '#76A7AB', name: 'Nile blue' },
        { code: 'Mineral blue - 16-4712 TCX', hex: '#6D9192', name: 'Mineral blue' },
        { code: 'Bristol blue - 17-4818 TCX', hex: '#558F91', name: 'Bristol blue' },
        { code: 'Teal - 17-4919 TCX', hex: '#478589', name: 'Teal' },
        { code: 'Blue spruce - 18-5308 TCX', hex: '#486B67', name: 'Blue spruce' },
        { code: 'Sagebrush green - 18-5612 TCX', hex: '#567572', name: 'Sagebrush green' },
        { code: 'Green milieu - 16-5806 TCX', hex: '#8A9992', name: 'Green milieu' },
        { code: 'Jadeite - 16-5304 TCX', hex: '#95A69F', name: 'Jadeite' },
        { code: 'Blue surf - 16-5106 TCX', hex: '#90A8A4', name: 'Blue surf' },
        { code: 'Oil blue - 17-5111 TCX', hex: '#658C88', name: 'Oil blue' },
        { code: 'Trellis - 17-5110 TCX', hex: '#6A8988', name: 'Trellis' },
        { code: 'North atlantic - 18-4612 TCX', hex: '#536D70', name: 'North atlantic' },
        { code: 'Sea pine - 18-5112 TCX', hex: '#4C6969', name: 'Sea pine' },
        { code: 'Slate - 16-4408 TCX', hex: '#8C9FA1', name: 'Slate' },
        { code: 'Silver blue - 16-4706 TCX', hex: '#8A9A9A', name: 'Silver blue' },
        { code: 'Abyss - 16-4404 TCX', hex: '#8F9E9D', name: 'Abyss' },
        { code: 'Lead - 17-4408 TCX', hex: '#7A898F', name: 'Lead' },
        { code: 'Stormy sea - 18-4711 TCX', hex: '#6E8082', name: 'Stormy sea' },
        { code: 'Trooper - 18-4510 TCX', hex: '#697A7E', name: 'Trooper' },
        { code: 'Goblin blue - 18-4011 TCX', hex: '#5F7278', name: 'Goblin blue' },
        { code: 'Slate gray - 16-5804 TCX', hex: '#8A9691', name: 'Slate gray' },
        { code: 'Chinois green - 17-5107 TCX', hex: '#7C8C87', name: 'Chinois green' },
        { code: 'Dark forest - 18-5611 TCX', hex: '#556962', name: 'Dark forest' },
        { code: 'Balsam green - 18-5606 TCX', hex: '#576664', name: 'Balsam green' },
        { code: 'Beetle - 19-0312 TCX', hex: '#55584C', name: 'Beetle' },
        { code: 'Urban chic - 19-5004 TCX', hex: '#464E4D', name: 'Urban chic' },
        { code: 'Darkest spruce - 19-5212 TCX', hex: '#303D3C', name: 'Darkest spruce' },
        { code: 'Mallard blue - 19-4318 TCX', hex: '#3A5C6E', name: 'Mallard blue' },
        { code: 'Celestial - 18-4530 TCX', hex: '#006380', name: 'Celestial' },
        { code: 'Saxony blue - 18-4225 TCX', hex: '#1F6680', name: 'Saxony blue' },
        { code: 'Lyons blue - 19-4340 TCX', hex: '#005871', name: 'Lyons blue' },
        { code: 'Ink blue - 19-4234 TCX', hex: '#0B5369', name: 'Ink blue' },
        { code: 'Corsair - 19-4329 TCX', hex: '#18576C', name: 'Corsair' },
        { code: 'Legion blue - 19-4324 TCX', hex: '#1F495B', name: 'Legion blue' },
        { code: 'Aegean blue - 18-4320 TCX', hex: '#4E6E81', name: 'Aegean blue' },
        { code: 'Bluesteel - 18-4222 TCX', hex: '#35637C', name: 'Bluesteel' },
        { code: 'Blue ashes - 18-4023 TCX', hex: '#3B5F78', name: 'Blue ashes' },
        { code: 'Midnight - 19-4127 TCX', hex: '#325B74', name: 'Midnight' },
        { code: 'Blue sapphire - 18-4231 TCX', hex: '#09577B', name: 'Blue sapphire' },
        { code: 'Seaport - 19-4342 TCX', hex: '#005E7D', name: 'Seaport' },
        { code: 'Moroccan blue - 19-4241 TCX', hex: '#0F4E67', name: 'Moroccan blue' },
        { code: 'Ocean depths - 19-4535 TCX', hex: '#006175', name: 'Ocean depths' },
        { code: 'Blue coral - 19-4526 TCX', hex: '#1B5366', name: 'Blue coral' },
        { code: 'Dragonfly - 19-4826 TCX', hex: '#2A5C6A', name: 'Dragonfly' },
        { code: 'Pacific - 19-4916 TCX', hex: '#1F595C', name: 'Pacific' },
        { code: 'Balsam - 19-4820 TCX', hex: '#33565E', name: 'Balsam' },
        { code: 'Mediterranea - 19-4517 TCX', hex: '#32575D', name: 'Mediterranea' },
        { code: 'Atlantic deep - 19-4726 TCX', hex: '#274E55', name: 'Atlantic deep' },
        { code: 'Aqua - 15-4717 TCX', hex: '#64A1AD', name: 'Aqua' },
        { code: 'Stillwater - 16-4610 TCX', hex: '#70A4B0', name: 'Stillwater' },
        { code: 'Delphinium blue - 16-4519 TCX', hex: '#6198AE', name: 'Delphinium blue' },
        { code: 'Larkspur - 17-4421 TCX', hex: '#3C7D90', name: 'Larkspur' },
        { code: 'Storm blue - 17-4716 TCX', hex: '#47788A', name: 'Storm blue' },
        { code: 'Tapestry - 18-4417 TCX', hex: '#436573', name: 'Tapestry' },
        { code: 'Colonial blue - 18-4522 TCX', hex: '#2D6471', name: 'Colonial blue' },
        { code: 'Peacock blue - 16-4728 TCX', hex: '#00A0B0', name: 'Peacock blue' },
        { code: 'Capri breeze - 17-4735 TCX', hex: '#008799', name: 'Capri breeze' },
        { code: 'Algiers blue - 17-4728 TCX', hex: '#00859C', name: 'Algiers blue' },
        { code: 'Caneel bay - 17-4730 TCX', hex: '#00849F', name: 'Caneel bay' },
        { code: 'Caribbean sea - 18-4525 TCX', hex: '#00819D', name: 'Caribbean sea' },
        { code: 'Mosaic blue - 18-4528 TCX', hex: '#00758F', name: 'Mosaic blue' },
        { code: 'Turkish tile - 18-4432 TCX', hex: '#00698B', name: 'Turkish tile' },
        { code: 'Angel blue - 14-4814 TCX', hex: '#83C5CD', name: 'Angel blue' },
        { code: 'Blue radiance - 14-4816 TCX', hex: '#58C9D4', name: 'Blue radiance' },
        { code: 'Capri - 15-4722 TCX', hex: '#44BBCA', name: 'Capri' },
        { code: 'Blue curacao - 15-4825 TCX', hex: '#32BECC', name: 'Blue curacao' },
        { code: 'Scuba blue - 16-4725 TCX', hex: '#00ABC0', name: 'Scuba blue' },
        { code: 'Bluebird - 16-4834 TCX', hex: '#009DAE', name: 'Bluebird' },
        { code: 'Enamel blue - 18-4733 TCX', hex: '#007A8E', name: 'Enamel blue' },
        { code: 'Pool blue - 15-5218 TCX', hex: '#67BCB3', name: 'Pool blue' },
        { code: 'Blue turquoise - 15-5217 TCX', hex: '#53B0AE', name: 'Blue turquoise' },
        { code: 'Baltic - 16-5123 TCX', hex: '#279D9F', name: 'Baltic' },
        { code: 'Lake blue - 17-4928 TCX', hex: '#008C96', name: 'Lake blue' },
        { code: 'Tile blue - 18-4735 TCX', hex: '#008491', name: 'Tile blue' },
        { code: 'Pagoda blue - 17-4724 TCX', hex: '#1A7F8E', name: 'Pagoda blue' },
        { code: 'Biscay bay - 18-4726 TCX', hex: '#097988', name: 'Biscay bay' },
        { code: 'Aruba blue - 13-5313 TCX', hex: '#81D7D3', name: 'Aruba blue' },
        { code: 'Ceramic - 16-5127 TCX', hex: '#00AAA9', name: 'Ceramic' },
        { code: 'Viridian green - 17-5126 TCX', hex: '#009499', name: 'Viridian green' },
        { code: 'Tropical green - 18-4930 TCX', hex: '#008786', name: 'Tropical green' },
        { code: 'Navigate - 17-5025 TCX', hex: '#008583', name: 'Navigate' },
        { code: 'Deep peacock blue - 17-5029 TCX', hex: '#008381', name: 'Deep peacock blue' },
        { code: 'Lapis - 17-5034 TCX', hex: '#008684', name: 'Lapis' },
        { code: 'Turquoise - 15-5519 TCX', hex: '#45B5AA', name: 'Turquoise' },
        { code: 'Waterfall - 15-5516 TCX', hex: '#3AB0A2', name: 'Waterfall' },
        { code: 'Lagoon - 16-5418 TCX', hex: '#4D9E9A', name: 'Lagoon' },
        { code: 'Bright aqua - 16-5422 TCX', hex: '#30A299', name: 'Bright aqua' },
        { code: 'Porcelain green - 17-5421 TCX', hex: '#108780', name: 'Porcelain green' },
        { code: 'Blue grass - 18-5128 TCX', hex: '#007C7A', name: 'Blue grass' },
        { code: 'Fanfare - 18-4936 TCX', hex: '#006D70', name: 'Fanfare' },
        { code: 'Atlantis - 15-5425 TCX', hex: '#00AF9F', name: 'Atlantis' },
        { code: 'Pool green - 16-5425 TCX', hex: '#00AF9D', name: 'Pool green' },
        { code: 'Dynasty green - 17-5330 TCX', hex: '#008E80', name: 'Dynasty green' },
        { code: 'Spectra green - 17-5335 TCX', hex: '#009B8C', name: 'Spectra green' },
        { code: 'Columbia - 17-5130 TCX', hex: '#009288', name: 'Columbia' },
        { code: 'Teal blue - 17-5024 TCX', hex: '#007F7C', name: 'Teal blue' },
        { code: 'Parasailing - 18-5020 TCX', hex: '#00736C', name: 'Parasailing' },
        { code: 'Wasabi - 16-5109 TCX', hex: '#73A89E', name: 'Wasabi' },
        { code: 'Beryl green - 16-5515 TCX', hex: '#619187', name: 'Beryl green' },
        { code: 'Deep sea - 17-5513 TCX', hex: '#4F7C74', name: 'Deep sea' },
        { code: 'Bottle green - 17-5722 TCX', hex: '#427D6D', name: 'Bottle green' },
        { code: 'Galapagos green - 18-5725 TCX', hex: '#29685F', name: 'Galapagos green' },
        { code: 'Antique green - 18-5418 TCX', hex: '#29675C', name: 'Antique green' },
        { code: 'Storm - 19-5217 TCX', hex: '#035453', name: 'Storm' },
        { code: 'Marine green - 16-5721 TCX', hex: '#40A48E', name: 'Marine green' },
        { code: 'Sea green - 16-5421 TCX', hex: '#149C88', name: 'Sea green' },
        { code: 'Greenlake - 17-5528 TCX', hex: '#007D69', name: 'Greenlake' },
        { code: 'Tidepool - 18-5619 TCX', hex: '#0A6F69', name: 'Tidepool' },
        { code: 'Ivy - 18-5620 TCX', hex: '#226C63', name: 'Ivy' },
        { code: 'Cadmium green - 18-5424 TCX', hex: '#00675B', name: 'Cadmium green' },
        { code: 'Alpine green - 18-5322 TCX', hex: '#005F56', name: 'Alpine green' },
        { code: 'Canton - 16-5112 TCX', hex: '#6DA29E', name: 'Canton' },
        { code: 'Agate green - 16-5412 TCX', hex: '#599F99', name: 'Agate green' },
        { code: 'Sea blue - 16-5119 TCX', hex: '#549F98', name: 'Sea blue' },
        { code: 'Latigo bay - 17-5122 TCX', hex: '#379190', name: 'Latigo bay' },
        { code: 'Green blue slate - 17-5117 TCX', hex: '#358082', name: 'Green blue slate' },
        { code: 'Bayou - 18-5121 TCX', hex: '#20706F', name: 'Bayou' },
        { code: 'North sea - 18-5115 TCX', hex: '#316C6B', name: 'North sea' },
        { code: 'Deep jungle - 18-5618 TCX', hex: '#36716F', name: 'Deep jungle' },
        { code: 'Everglade - 19-5226 TCX', hex: '#005B5D', name: 'Everglade' },
        { code: 'Teal green - 19-4922 TCX', hex: '#006361', name: 'Teal green' },
        { code: 'Harbor blue - 18-4728 TCX', hex: '#00656E', name: 'Harbor blue' },
        { code: 'Deep lake - 18-4834 TCX', hex: '#00656B', name: 'Deep lake' },
        { code: 'Shaded spruce - 19-4524 TCX', hex: '#00585E', name: 'Shaded spruce' },
        { code: 'Deep teal - 19-4914 TCX', hex: '#18454B', name: 'Deep teal' },
        { code: 'Silver pine - 18-5410 TCX', hex: '#4E6866', name: 'Silver pine' },
        { code: 'Mallard green - 19-4818 TCX', hex: '#405E5C', name: 'Mallard green' },
        { code: 'Bistro green - 19-5408 TCX', hex: '#395551', name: 'Bistro green' },
        { code: 'Jasper - 19-5413 TCX', hex: '#335959', name: 'Jasper' },
        { code: 'Bayberry - 18-5315 TCX', hex: '#255958', name: 'Bayberry' },
        { code: 'June bug - 19-5414 TCX', hex: '#264A48', name: 'June bug' },
        { code: 'Ponderosa pine - 19-5320 TCX', hex: '#203B3D', name: 'Ponderosa pine' },
        { code: 'Aqua glass - 12-5407 TCX', hex: '#D2E8E0', name: 'Aqua glass' },
        { code: 'Opal blue - 12-5406 TCX', hex: '#C3DDD6', name: 'Opal blue' },
        { code: 'Dusty aqua - 12-5506 TCX', hex: '#C0DCCD', name: 'Dusty aqua' },
        { code: 'Ocean wave - 14-5711 TCX', hex: '#8EC5B6', name: 'Ocean wave' },
        { code: 'Holiday - 14-5413 TCX', hex: '#81C3B4', name: 'Holiday' },
        { code: 'Cascade - 14-5713 TCX', hex: '#76C1B2', name: 'Cascade' },
        { code: 'Dusty jade green - 15-5711 TCX', hex: '#7BB5A3', name: 'Dusty jade green' },
        { code: 'Honeydew - 12-5808 TCX', hex: '#BAE1D3', name: 'Honeydew' },
        { code: 'Brook green - 13-6009 TCX', hex: '#AFDDCC', name: 'Brook green' },
        { code: 'Cabbage - 13-5714 TCX', hex: '#87D7BE', name: 'Cabbage' },
        { code: 'Beveled glass - 14-5714 TCX', hex: '#7ACCB8', name: 'Beveled glass' },
        { code: 'Opal - 14-5718 TCX', hex: '#77CFB7', name: 'Opal' },
        { code: 'Biscay green - 15-5718 TCX', hex: '#55C6A9', name: 'Biscay green' },
        { code: 'Spearmint - 15-5819 TCX', hex: '#64BFA4', name: 'Spearmint' },
        { code: 'Moonlight jade - 12-5408 TCX', hex: '#C7E5DF', name: 'Moonlight jade' },
        { code: 'Bay - 12-5507 TCX', hex: '#BAE5D6', name: 'Bay' },
        { code: 'Yucca - 13-5409 TCX', hex: '#A1D7C9', name: 'Yucca' },
        { code: 'Beach glass - 13-5412 TCX', hex: '#96DFCE', name: 'Beach glass' },
        { code: 'Ice green - 13-5414 TCX', hex: '#87D8C3', name: 'Ice green' },
        { code: 'Cockatoo - 14-5420 TCX', hex: '#58C8B6', name: 'Cockatoo' },
        { code: 'Florida keys - 15-5416 TCX', hex: '#56BEAB', name: 'Florida keys' },
        { code: 'Bermuda - 14-5416 TCX', hex: '#60C9B3', name: 'Bermuda' },
        { code: 'Electric green - 14-5721 TCX', hex: '#4BC3A8', name: 'Electric green' },
        { code: 'Aqua green - 15-5421 TCX', hex: '#00B89F', name: 'Aqua green' },
        { code: 'Billiard - 16-5427 TCX', hex: '#00AA92', name: 'Billiard' },
        { code: 'Arcadia - 16-5533 TCX', hex: '#00A28A', name: 'Arcadia' },
        { code: 'Alhambra - 17-5430 TCX', hex: '#008778', name: 'Alhambra' },
        { code: 'Deep green - 17-5633 TCX', hex: '#009276', name: 'Deep green' },
        { code: 'Mint leaf - 15-5728 TCX', hex: '#00B694', name: 'Mint leaf' },
        { code: 'Peacock green - 16-5431 TCX', hex: '#00A78B', name: 'Peacock green' },
        { code: 'Vivid green - 17-5638 TCX', hex: '#009E82', name: 'Vivid green' },
        { code: 'Emerald - 17-5641 TCX', hex: '#009473', name: 'Emerald' },
        { code: 'Viridis - 17-5734 TCX', hex: '#00846B', name: 'Viridis' },
        { code: 'Shady glade - 18-5624 TCX', hex: '#006E5B', name: 'Shady glade' },
        { code: 'Ultramarine green - 18-5338 TCX', hex: '#006B54', name: 'Ultramarine green' },
        { code: 'Silt green - 14-5706 TCX', hex: '#A9BDB1', name: 'Silt green' },
        { code: 'Frosty green - 15-5706 TCX', hex: '#A3B5A6', name: 'Frosty green' },
        { code: 'Iceberg green - 16-5808 TCX', hex: '#8C9C92', name: 'Iceberg green' },
        { code: 'Granite green - 16-5907 TCX', hex: '#86A293', name: 'Granite green' },
        { code: 'Green bay - 16-5810 TCX', hex: '#7E9285', name: 'Green bay' },
        { code: 'Lily pad - 16-5807 TCX', hex: '#818F84', name: 'Lily pad' },
        { code: 'Laurel wreath - 17-6009 TCX', hex: '#616F65', name: 'Laurel wreath' },
        { code: 'Green spruce - 16-5820 TCX', hex: '#589F7E', name: 'Green spruce' },
        { code: 'Comfrey - 18-6216 TCX', hex: '#5B7961', name: 'Comfrey' },
        { code: 'Dark ivy - 17-5912 TCX', hex: '#5B7763', name: 'Dark ivy' },
        { code: 'Foliage green - 18-6018 TCX', hex: '#3E6F58', name: 'Foliage green' },
        { code: 'Myrtle - 18-6114 TCX', hex: '#4F6B58', name: 'Myrtle' },
        { code: 'Posy green - 18-5616 TCX', hex: '#325B51', name: 'Posy green' },
        { code: 'Pineneedle - 19-5920 TCX', hex: '#334D41', name: 'Pineneedle' },
        { code: 'Sea spray - 17-6212 TCX', hex: '#717E6F', name: 'Sea spray' },
        { code: 'Duck green - 18-6011 TCX', hex: '#53665C', name: 'Duck green' },
        { code: 'Frosty spruce - 18-5622 TCX', hex: '#578270', name: 'Frosty spruce' },
        { code: 'Fir - 18-5621 TCX', hex: '#3A725F', name: 'Fir' },
        { code: 'Evergreen - 19-5420 TCX', hex: '#11574A', name: 'Evergreen' },
        { code: 'Hunter green - 19-5511 TCX', hex: '#335749', name: 'Hunter green' },
        { code: 'Dark green - 19-5513 TCX', hex: '#314F40', name: 'Dark green' },
        { code: 'Feldspar - 16-5815 TCX', hex: '#729B8B', name: 'Feldspar' },
        { code: 'Smoke pine - 18-5718 TCX', hex: '#3E6257', name: 'Smoke pine' },
        { code: 'Trekking green - 19-5411 TCX', hex: '#355048', name: 'Trekking green' },
        { code: 'Garden topiary - 18-5913 TCX', hex: '#3E524B', name: 'Garden topiary' },
        { code: 'Jungle green - 19-5914 TCX', hex: '#3C4E47', name: 'Jungle green' },
        { code: 'Sycamore - 19-5917 TCX', hex: '#35463D', name: 'Sycamore' },
        { code: 'Green gables - 19-4906 TCX', hex: '#324241', name: 'Green gables' },
        { code: 'Vetiver - 17-0613 TCX', hex: '#807D6F', name: 'Vetiver' },
        { code: 'Deep lichen green - 18-0312 TCX', hex: '#6E6E5C', name: 'Deep lichen green' },
        { code: 'Thyme - 19-0309 TCX', hex: '#50574C', name: 'Thyme' },
        { code: 'Kombu green - 19-0417 TCX', hex: '#3A4032', name: 'Kombu green' },
        { code: 'Deep forest - 19-6110 TCX', hex: '#37413A', name: 'Deep forest' },
        { code: 'Forest night - 19-0414 TCX', hex: '#434237', name: 'Forest night' },
        { code: 'Rosin - 19-0509 TCX', hex: '#36362D', name: 'Rosin' },
        { code: 'Celadon - 13-6108 TCX', hex: '#B8CCBA', name: 'Celadon' },
        { code: 'Pale aqua - 13-5305 TCX', hex: '#C1CCC2', name: 'Pale aqua' },
        { code: 'Smoke - 14-4505 TCX', hex: '#BFC8C3', name: 'Smoke' },
        { code: 'Foggy dew - 13-4305 TCX', hex: '#D1D5D0', name: 'Foggy dew' },
        { code: 'Mercury - 14-4502 TCX', hex: '#BAC2BA', name: 'Mercury' },
        { code: 'Mineral gray - 15-5704 TCX', hex: '#B2B6AC', name: 'Mineral gray' },
        { code: 'Aqua gray - 15-5205 TCX', hex: '#A5B2AA', name: 'Aqua gray' },
        { code: 'Fairest jade - 12-6206 TCX', hex: '#D8E3D7', name: 'Fairest jade' },
        { code: 'Water lily - 11-0304 TCX', hex: '#DDE3D5', name: 'Water lily' },
        { code: 'Canary green - 12-0108 TCX', hex: '#D6DEC9', name: 'Canary green' },
        { code: 'Almost aqua - 13-6006 TCX', hex: '#CAD3C1', name: 'Almost aqua' },
        { code: 'Green tint - 13-6106 TCX', hex: '#C5CCC0', name: 'Green tint' },
        { code: 'Sea foam - 14-6007 TCX', hex: '#B7C2B2', name: 'Sea foam' },
        { code: 'Desert sage - 16-0110 TCX', hex: '#A7AE9E', name: 'Desert sage' },
        { code: 'Whisper green - 12-5404 TCX', hex: '#E0E6D7', name: 'Whisper green' },
        { code: 'Celadon tint - 13-6105 TCX', hex: '#CBCEBE', name: 'Celadon tint' },
        { code: 'Dewkist - 13-0107 TCX', hex: '#C4D1C2', name: 'Dewkist' },
        { code: 'Green lily - 13-6107 TCX', hex: '#C1CEC1', name: 'Green lily' },
        { code: 'Cameo green - 14-6312 TCX', hex: '#AAC0AD', name: 'Cameo green' },
        { code: 'Seagrass - 16-6008 TCX', hex: '#959889', name: 'Seagrass' },
        { code: 'Shadow - 17-6206 TCX', hex: '#888D82', name: 'Shadow' },
        { code: 'Clearly aqua - 12-5504 TCX', hex: '#CEE1D4', name: 'Clearly aqua' },
        { code: 'Misty jade - 13-6008 TCX', hex: '#BCD9C8', name: 'Misty jade' },
        { code: 'Subtle green - 14-6008 TCX', hex: '#B5CBBB', name: 'Subtle green' },
        { code: 'Aqua foam - 14-5707 TCX', hex: '#ADC3B4', name: 'Aqua foam' },
        { code: 'Gossamer green - 13-5907 TCX', hex: '#B2CFBE', name: 'Gossamer green' },
        { code: 'Lichen - 15-5812 TCX', hex: '#9BC2B1', name: 'Lichen' },
        { code: 'Grayed jade - 14-6011 TCX', hex: '#9BBEA9', name: 'Grayed jade' },
        { code: 'Milky green - 12-6205 TCX', hex: '#CFDBD1', name: 'Milky green' },
        { code: 'Phantom green - 12-6208 TCX', hex: '#DCE4D7', name: 'Phantom green' },
        { code: 'Mist green - 13-6110 TCX', hex: '#AACEBC', name: 'Mist green' },
        { code: 'Birds egg green - 13-5911 TCX', hex: '#AACCB9', name: 'Birds egg green' },
        { code: 'Bok choy - 13-6208 TCX', hex: '#BCCAB3', name: 'Bok choy' },
        { code: 'Smoke green - 15-6315 TCX', hex: '#A8BBA2', name: 'Smoke green' },
        { code: 'Malachite green - 16-5917 TCX', hex: '#709A89', name: 'Malachite green' },
        { code: 'Mistletoe - 16-0220 TCX', hex: '#8AA282', name: 'Mistletoe' },
        { code: 'Basil - 16-6216 TCX', hex: '#879F84', name: 'Basil' },
        { code: 'Mineral green - 16-6318 TCX', hex: '#7A9B78', name: 'Mineral green' },
        { code: 'Green eyes - 16-0224 TCX', hex: '#7D956D', name: 'Green eyes' },
        { code: 'Turf green - 17-0119 TCX', hex: '#6F8C69', name: 'Turf green' },
        { code: 'Watercress - 17-0220 TCX', hex: '#748C69', name: 'Watercress' },
        { code: 'Elm green - 18-0121 TCX', hex: '#547053', name: 'Elm green' },
        { code: 'Hedge green - 17-6323 TCX', hex: '#768A75', name: 'Hedge green' },
        { code: 'Loden frost - 17-0210 TCX', hex: '#788F74', name: 'Loden frost' },
        { code: 'Shale green - 16-6116 TCX', hex: '#739072', name: 'Shale green' },
        { code: 'Kashmir - 17-6319 TCX', hex: '#6F8D6A', name: 'Kashmir' },
        { code: 'Stone green - 17-0123 TCX', hex: '#658E67', name: 'Stone green' },
        { code: 'English ivy - 18-0110 TCX', hex: '#61845B', name: 'English ivy' },
        { code: 'Deep grass green - 17-6219 TCX', hex: '#558367', name: 'Deep grass green' },
        { code: 'Piquant green - 17-0235 TCX', hex: '#769358', name: 'Piquant green' },
        { code: 'Forest green - 17-0230 TCX', hex: '#6B8D53', name: 'Forest green' },
        { code: 'Fluorite green - 17-0133 TCX', hex: '#699158', name: 'Fluorite green' },
        { code: 'Cactus - 18-0130 TCX', hex: '#53713D', name: 'Cactus' },
        { code: 'Garden green - 19-0230 TCX', hex: '#495E35', name: 'Garden green' },
        { code: 'Artichoke green - 18-0125 TCX', hex: '#4B6D41', name: 'Artichoke green' },
        { code: 'Willow bough - 18-0119 TCX', hex: '#59754D', name: 'Willow bough' },
        { code: 'Aspen green - 17-0215 TCX', hex: '#7E9B76', name: 'Aspen green' },
        { code: 'Medium green - 17-6229 TCX', hex: '#3C824E', name: 'Medium green' },
        { code: 'Juniper - 18-6330 TCX', hex: '#3D7245', name: 'Juniper' },
        { code: 'Fairway - 18-6320 TCX', hex: '#477050', name: 'Fairway' },
        { code: 'Vineyard green - 18-0117 TCX', hex: '#5F7355', name: 'Vineyard green' },
        { code: 'Dill - 18-0108 TCX', hex: '#6F7755', name: 'Dill' },
        { code: 'Greener pastures - 19-6311 TCX', hex: '#37503D', name: 'Greener pastures' },
        { code: 'Four leaf clover - 18-0420 TCX', hex: '#616652', name: 'Four leaf clover' },
        { code: 'Bronze green - 18-0317 TCX', hex: '#525F48', name: 'Bronze green' },
        { code: 'Chive - 19-0323 TCX', hex: '#4A5335', name: 'Chive' },
        { code: 'Cypress - 18-0322 TCX', hex: '#545A3E', name: 'Cypress' },
        { code: 'Black forest - 19-0315 TCX', hex: '#414F3C', name: 'Black forest' },
        { code: 'Rifle green - 19-0419 TCX', hex: '#414832', name: 'Rifle green' },
        { code: 'Duffel bag - 19-0415 TCX', hex: '#394034', name: 'Duffel bag' },
        { code: 'Ambrosia - 12-0109 TCX', hex: '#D2E7CA', name: 'Ambrosia' },
        { code: 'Spray - 13-6007 TCX', hex: '#BED3BB', name: 'Spray' },
        { code: 'Pastel green - 13-0116 TCX', hex: '#B4D3B2', name: 'Pastel green' },
        { code: 'Hemlock - 15-6114 TCX', hex: '#97C1A1', name: 'Hemlock' },
        { code: 'Sprucestone - 14-6316 TCX', hex: '#9FC09C', name: 'Sprucestone' },
        { code: 'Meadow - 14-6319 TCX', hex: '#8BBA94', name: 'Meadow' },
        { code: 'Jadesheen - 16-6324 TCX', hex: '#77A276', name: 'Jadesheen' },
        { code: 'Green ash - 13-0117 TCX', hex: '#A0DAA9', name: 'Green ash' },
        { code: 'Greengage - 14-0127 TCX', hex: '#8BC28C', name: 'Greengage' },
        { code: 'Ming - 15-6120 TCX', hex: '#7CB08A', name: 'Ming' },
        { code: 'Zephyr green - 14-6327 TCX', hex: '#7CB083', name: 'Zephyr green' },
        { code: 'Peapod - 14-6324 TCX', hex: '#82B185', name: 'Peapod' },
        { code: 'Light grass green - 15-6322 TCX', hex: '#7CB68E', name: 'Light grass green' },
        { code: 'Absinthe green - 14-6329 TCX', hex: '#76B583', name: 'Absinthe green' },
        { code: 'Neptune green - 14-6017 TCX', hex: '#7FBB9E', name: 'Neptune green' },
        { code: 'Creme de menthe - 16-5919 TCX', hex: '#70A38D', name: 'Creme de menthe' },
        { code: 'Winter green - 16-5924 TCX', hex: '#4F9E81', name: 'Winter green' },
        { code: 'Gumdrop green - 16-5825 TCX', hex: '#2EA785', name: 'Gumdrop green' },
        { code: 'Holly green - 16-5932 TCX', hex: '#0F9D76', name: 'Holly green' },
        { code: 'Parakeet - 17-5735 TCX', hex: '#008C69', name: 'Parakeet' },
        { code: 'Golf green - 18-5642 TCX', hex: '#008763', name: 'Golf green' },
        { code: 'Spring bud - 14-6330 TCX', hex: '#6BCD9C', name: 'Spring bud' },
        { code: 'Katydid - 16-6030 TCX', hex: '#66BC91', name: 'Katydid' },
        { code: 'Jade cream - 15-6123 TCX', hex: '#60B892', name: 'Jade cream' },
        { code: 'Ming green - 16-5930 TCX', hex: '#3AA278', name: 'Ming green' },
        { code: 'Greenbriar - 16-6127 TCX', hex: '#4B9B69', name: 'Greenbriar' },
        { code: 'Leprechaun - 18-6022 TCX', hex: '#378661', name: 'Leprechaun' },
        { code: 'Pine green - 17-5923 TCX', hex: '#3A795E', name: 'Pine green' },
        { code: 'Blarney - 16-5942 TCX', hex: '#00A776', name: 'Blarney' },
        { code: 'Mint - 16-5938 TCX', hex: '#00A170', name: 'Mint' },
        { code: 'Deep mint - 17-5937 TCX', hex: '#009E6D', name: 'Deep mint' },
        { code: 'Simply green - 17-5936 TCX', hex: '#009B75', name: 'Simply green' },
        { code: 'Pepper green - 18-5841 TCX', hex: '#007D60', name: 'Pepper green' },
        { code: 'Bosphorus - 18-5633 TCX', hex: '#007558', name: 'Bosphorus' },
        { code: 'Verdant green - 19-6026 TCX', hex: '#12674A', name: 'Verdant green' },
        { code: 'Seacrest - 13-0111 TCX', hex: '#BFD1B3', name: 'Seacrest' },
        { code: 'Gleam - 12-0317 TCX', hex: '#BFD1AD', name: 'Gleam' },
        { code: 'Nile green - 14-0121 TCX', hex: '#A7C796', name: 'Nile green' },
        { code: 'Quiet green - 15-6317 TCX', hex: '#9EBC97', name: 'Quiet green' },
        { code: 'Fair green - 15-6316 TCX', hex: '#92AF88', name: 'Fair green' },
        { code: 'Forest shade - 15-6423 TCX', hex: '#91AC80', name: 'Forest shade' },
        { code: 'Jade green - 16-0228 TCX', hex: '#759465', name: 'Jade green' },
        { code: 'Patina green - 12-0225 TCX', hex: '#B9EAB3', name: 'Patina green' },
        { code: 'Pistachio green - 13-0221 TCX', hex: '#A9D39E', name: 'Pistachio green' },
        { code: 'Arcadian green - 14-0123 TCX', hex: '#A3C893', name: 'Arcadian green' },
        { code: 'Grass green - 15-6437 TCX', hex: '#7BB369', name: 'Grass green' },
        { code: 'Bud green - 15-6442 TCX', hex: '#79B465', name: 'Bud green' },
        { code: 'Green tea - 15-6428 TCX', hex: '#86A96F', name: 'Green tea' },
        { code: 'Tendril - 16-0123 TCX', hex: '#89A06B', name: 'Tendril' },
        { code: 'Paradise green - 13-0220 TCX', hex: '#B2E79F', name: 'Paradise green' },
        { code: 'Lime green - 14-0452 TCX', hex: '#9FC131', name: 'Lime green' },
        { code: 'Jasmine green - 15-0545 TCX', hex: '#7EC845', name: 'Jasmine green' },
        { code: 'Green flash - 15-0146 TCX', hex: '#79C753', name: 'Green flash' },
        { code: 'Classic green - 16-6340 TCX', hex: '#39A845', name: 'Classic green' },
        { code: 'Online lime - 17-0145 TCX', hex: '#44883C', name: 'Online lime' },
        { code: 'Treetop - 18-0135 TCX', hex: '#476A30', name: 'Treetop' },
        { code: 'Summer green - 14-0156 TCX', hex: '#7ED37F', name: 'Summer green' },
        { code: 'Spring bouquet - 14-6340 TCX', hex: '#6DCE87', name: 'Spring bouquet' },
        { code: 'Island green - 16-6240 TCX', hex: '#2BAE66', name: 'Island green' },
        { code: 'Irish green - 15-6340 TCX', hex: '#45BE76', name: 'Irish green' },
        { code: 'Shamrock - 15-6432 TCX', hex: '#6FA26B', name: 'Shamrock' },
        { code: 'Peppermint - 16-6329 TCX', hex: '#699E6D', name: 'Peppermint' },
        { code: 'Mint green - 17-6333 TCX', hex: '#487D49', name: 'Mint green' },
        { code: 'Poison green - 16-6444 TCX', hex: '#4DB560', name: 'Poison green' },
        { code: 'Vibrant green - 16-6339 TCX', hex: '#55A860', name: 'Vibrant green' },
        { code: 'Kelly green - 16-6138 TCX', hex: '#339C5E', name: 'Kelly green' },
        { code: 'Bright green - 15-5534 TCX', hex: '#009B5C', name: 'Bright green' },
        { code: 'Fern green - 17-6153 TCX', hex: '#008C45', name: 'Fern green' },
        { code: 'Jelly bean - 17-6030 TCX', hex: '#008658', name: 'Jelly bean' },
        { code: 'Amazon - 18-6024 TCX', hex: '#1F7349', name: 'Amazon' },
        { code: 'Green glow - 13-0442 TCX', hex: '#B0C965', name: 'Green glow' },
        { code: 'Bright lime green - 14-0244 TCX', hex: '#97BC62', name: 'Bright lime green' },
        { code: 'Greenery - 15-0343 TCX', hex: '#88B04B', name: 'Greenery' },
        { code: 'Foliage - 16-0237 TCX', hex: '#75A14F', name: 'Foliage' },
        { code: 'Peridot - 17-0336 TCX', hex: '#819548', name: 'Peridot' },
        { code: 'Meadow green - 16-0233 TCX', hex: '#739957', name: 'Meadow green' },
        { code: 'Woodbine - 18-0538 TCX', hex: '#7B7F32', name: 'Woodbine' },
        { code: 'Jade lime - 14-0232 TCX', hex: '#A1CA7B', name: 'Jade lime' },
        { code: 'Herbal garden - 15-0336 TCX', hex: '#9CAD60', name: 'Herbal garden' },
        { code: 'Leaf green - 15-0332 TCX', hex: '#9FAF6C', name: 'Leaf green' },
        { code: 'Parrot green - 15-0341 TCX', hex: '#8DB051', name: 'Parrot green' },
        { code: 'Dark citron - 16-0435 TCX', hex: '#A0AC4F', name: 'Dark citron' },
        { code: 'Macaw green - 16-0230 TCX', hex: '#9BB53E', name: 'Macaw green' },
        { code: 'Kiwi - 16-0235 TCX', hex: '#7AAB55', name: 'Kiwi' },
        { code: 'Sharp green - 13-0535 TCX', hex: '#C6EC7A', name: 'Sharp green' },
        { code: 'Daiquiri green - 12-0435 TCX', hex: '#C9D77E', name: 'Daiquiri green' },
        { code: 'Wild lime - 13-0540 TCX', hex: '#C3D363', name: 'Wild lime' },
        { code: 'Linden green - 15-0533 TCX', hex: '#C4BF71', name: 'Linden green' },
        { code: 'Bright chartreuse - 14-0445 TCX', hex: '#B5BF50', name: 'Bright chartreuse' },
        { code: 'Tender shoots - 14-0446 TCX', hex: '#B5CC39', name: 'Tender shoots' },
        { code: 'Lime punch - 13-0550 TCX', hex: '#C0D725', name: 'Lime punch' },
        { code: 'Sunny lime - 12-0741 TCX', hex: '#DFEF87', name: 'Sunny lime' },
        { code: 'Limeade - 13-0645 TCX', hex: '#D3D95F', name: 'Limeade' },
        { code: 'Sulphur spring - 13-0650 TCX', hex: '#D5D717', name: 'Sulphur spring' },
        { code: 'Citronelle - 15-0548 TCX', hex: '#B8AF23', name: 'Citronelle' },
        { code: 'Apple green - 15-0543 TCX', hex: '#B5B644', name: 'Apple green' },
        { code: 'Warm olive - 15-0646 TCX', hex: '#C7B63C', name: 'Warm olive' },
        { code: 'Antique moss - 16-0840 TCX', hex: '#B9A023', name: 'Antique moss' },
        { code: 'Lime cream - 12-0312 TCX', hex: '#D7E8BC', name: 'Lime cream' },
        { code: 'Shadow lime - 13-0319 TCX', hex: '#CFE09D', name: 'Shadow lime' },
        { code: 'Lime sherbet - 13-0530 TCX', hex: '#CDD78A', name: 'Lime sherbet' },
        { code: 'Lettuce green - 13-0324 TCX', hex: '#BED38E', name: 'Lettuce green' },
        { code: 'Sap green - 13-0331 TCX', hex: '#AFCB80', name: 'Sap green' },
        { code: 'Opaline green - 14-0226 TCX', hex: '#A3C57D', name: 'Opaline green' },
        { code: 'Winter pear - 15-0523 TCX', hex: '#B0B487', name: 'Winter pear' },
        { code: 'Sylvan green - 11-0410 TCX', hex: '#E7EACB', name: 'Sylvan green' },
        { code: 'Glass green - 11-0205 TCX', hex: '#ECEAD0', name: 'Glass green' },
        { code: 'Green essence - 12-0607 TCX', hex: '#E9EAC8', name: 'Green essence' },
        { code: 'Ethereal green - 11-0609 TCX', hex: '#F1ECCA', name: 'Ethereal green' },
        { code: 'Garden glade - 13-0614 TCX', hex: '#DCD8A8', name: 'Garden glade' },
        { code: 'Hay - 12-0418 TCX', hex: '#D3CCA3', name: 'Hay' },
        { code: 'Pale green - 13-0522 TCX', hex: '#CBCE91', name: 'Pale green' },
        { code: 'Young wheat - 12-0521 TCX', hex: '#E1E3A9', name: 'Young wheat' },
        { code: 'Citron - 12-0524 TCX', hex: '#DFDE9B', name: 'Citron' },
        { code: 'Luminary green - 12-0525 TCX', hex: '#E3EAA5', name: 'Luminary green' },
        { code: 'Pale lime yellow - 12-0520 TCX', hex: '#DFE69F', name: 'Pale lime yellow' },
        { code: 'Chardonnay - 13-0633 TCX', hex: '#E7DF99', name: 'Chardonnay' },
        { code: 'Lima bean - 13-0333 TCX', hex: '#E1D590', name: 'Lima bean' },
        { code: 'Charlock - 12-0530 TCX', hex: '#E5E790', name: 'Charlock' },
        { code: 'Mellow green - 12-0426 TCX', hex: '#D5D593', name: 'Mellow green' },
        { code: 'Shadow green - 14-0627 TCX', hex: '#CFC486', name: 'Shadow green' },
        { code: 'Celery green - 13-0532 TCX', hex: '#C5CC7B', name: 'Celery green' },
        { code: 'Green banana - 14-0434 TCX', hex: '#BABC72', name: 'Green banana' },
        { code: 'Green oasis - 15-0538 TCX', hex: '#B0B454', name: 'Green oasis' },
        { code: 'Leek green - 15-0628 TCX', hex: '#B7B17A', name: 'Leek green' },
        { code: 'Weeping willow - 15-0525 TCX', hex: '#B3B17B', name: 'Weeping willow' },
        { code: 'Palm - 15-0535 TCX', hex: '#AFAF5E', name: 'Palm' },
        { code: 'Golden olive - 16-0639 TCX', hex: '#AF9841', name: 'Golden olive' },
        { code: 'Oasis - 16-0540 TCX', hex: '#A3A04E', name: 'Oasis' },
        { code: 'Moss - 16-0532 TCX', hex: '#A09D59', name: 'Moss' },
        { code: 'Amber green - 17-0840 TCX', hex: '#9A803A', name: 'Amber green' },
        { code: 'Ecru olive - 17-0836 TCX', hex: '#927B3C', name: 'Ecru olive' },
        { code: 'Green moss - 17-0636 TCX', hex: '#857946', name: 'Green moss' },
        { code: 'Khaki - 16-0726 TCX', hex: '#A39264', name: 'Khaki' },
        { code: 'Fennel seed - 17-0929 TCX', hex: '#998456', name: 'Fennel seed' },
        { code: 'Willow - 16-0632 TCX', hex: '#9A8B4F', name: 'Willow' },
        { code: 'Bronze mist - 17-0843 TCX', hex: '#9C7E41', name: 'Bronze mist' },
        { code: 'Dried tobacco - 18-0835 TCX', hex: '#997B38', name: 'Dried tobacco' },
        { code: 'Tapenade - 18-0840 TCX', hex: '#805D24', name: 'Tapenade' },
        { code: 'Plantation - 18-0832 TCX', hex: '#7A6332', name: 'Plantation' },
        { code: 'Fog green - 13-0210 TCX', hex: '#C2CBB4', name: 'Fog green' },
        { code: 'Tender greens - 13-0212 TCX', hex: '#C5CFB6', name: 'Tender greens' },
        { code: 'Aloe wash - 13-0608 TCX', hex: '#D0D3B7', name: 'Aloe wash' },
        { code: 'Celadon green - 14-0114 TCX', hex: '#B5C1A5', name: 'Celadon green' },
        { code: 'Laurel green - 15-6313 TCX', hex: '#ADBBA1', name: 'Laurel green' },
        { code: 'Swamp - 15-6310 TCX', hex: '#A8B197', name: 'Swamp' },
        { code: 'Reseda - 15-6414 TCX', hex: '#A1AD92', name: 'Reseda' },
        { code: 'Meadow mist - 12-0106 TCX', hex: '#D3DEC4', name: 'Meadow mist' },
        { code: 'Butterfly - 12-0322 TCX', hex: '#CADEA5', name: 'Butterfly' },
        { code: 'White jade - 12-0315 TCX', hex: '#D4DBB2', name: 'White jade' },
        { code: 'Seafoam green - 12-0313 TCX', hex: '#CBD5B1', name: 'Seafoam green' },
        { code: 'Reed - 13-0215 TCX', hex: '#C3D3A8', name: 'Reed' },
        { code: 'Seedling - 14-0217 TCX', hex: '#C0CBA1', name: 'Seedling' },
        { code: 'Foam green - 14-0115 TCX', hex: '#B4C79C', name: 'Foam green' },
        { code: 'Lily green - 13-0317 TCX', hex: '#C5CF98', name: 'Lily green' },
        { code: 'Beechnut - 14-0425 TCX', hex: '#C2C18D', name: 'Beechnut' },
        { code: 'Nile - 14-0223 TCX', hex: '#B4BB85', name: 'Nile' },
        { code: 'Sweet pea - 15-0531 TCX', hex: '#A3A969', name: 'Sweet pea' },
        { code: 'Spinach green - 16-0439 TCX', hex: '#909B4C', name: 'Spinach green' },
        { code: 'Fern - 16-0430 TCX', hex: '#9AA067', name: 'Fern' },
        { code: 'Green olive - 17-0535 TCX', hex: '#8D8B55', name: 'Green olive' },
        { code: 'Epsom - 17-0324 TCX', hex: '#849161', name: 'Epsom' },
        { code: 'Grasshopper - 18-0332 TCX', hex: '#77824A', name: 'Grasshopper' },
        { code: 'Turtle green - 17-0330 TCX', hex: '#81894E', name: 'Turtle green' },
        { code: 'Calliste green - 18-0324 TCX', hex: '#757A4E', name: 'Calliste green' },
        { code: 'Calla green - 18-0435 TCX', hex: '#6A6F34', name: 'Calla green' },
        { code: 'Cedar green - 18-0328 TCX', hex: '#5E6737', name: 'Cedar green' },
        { code: 'Pesto - 18-0228 TCX', hex: '#595F34', name: 'Pesto' },
        { code: 'Tarragon - 15-0326 TCX', hex: '#A4AE77', name: 'Tarragon' },
        { code: 'Sage - 16-0421 TCX', hex: '#91946E', name: 'Sage' },
        { code: 'Iguana - 18-0525 TCX', hex: '#818455', name: 'Iguana' },
        { code: 'Oil green - 17-0115 TCX', hex: '#80856D', name: 'Oil green' },
        { code: 'Loden green - 18-0422 TCX', hex: '#6E7153', name: 'Loden green' },
        { code: 'Capulet olive - 18-0426 TCX', hex: '#656344', name: 'Capulet olive' },
        { code: 'Olivine - 18-0316 TCX', hex: '#666B54', name: 'Olivine' },
        { code: 'Lint - 14-0216 TCX', hex: '#B6BA99', name: 'Lint' },
        { code: 'Pale olive green - 15-0522 TCX', hex: '#B5AD88', name: 'Pale olive green' },
        { code: 'Sage green - 15-0318 TCX', hex: '#B2AC88', name: 'Sage green' },
        { code: 'Gray green - 16-0518 TCX', hex: '#A49A79', name: 'Gray green' },
        { code: 'Sponge - 16-1118 TCX', hex: '#A49775', name: 'Sponge' },
        { code: 'Mermaid - 17-0618 TCX', hex: '#817A65', name: 'Mermaid' },
        { code: 'Dusky green - 17-0517 TCX', hex: '#746C57', name: 'Dusky green' },
        { code: 'Tea - 16-0213 TCX', hex: '#999B85', name: 'Tea' },
        { code: 'Silver sage - 17-0510 TCX', hex: '#938B78', name: 'Silver sage' },
        { code: 'Slate green - 16-0713 TCX', hex: '#A0987C', name: 'Slate green' },
        { code: 'Elm - 16-0613 TCX', hex: '#A39F86', name: 'Elm' },
        { code: 'Mosstone - 17-0525 TCX', hex: '#858961', name: 'Mosstone' },
        { code: 'Aloe - 17-0620 TCX', hex: '#817A60', name: 'Aloe' },
        { code: 'Olive drab - 18-0622 TCX', hex: '#756D47', name: 'Olive drab' },
        { code: 'Cedar - 16-0526 TCX', hex: '#928E64', name: 'Cedar' },
        { code: 'Boa - 17-0625 TCX', hex: '#8E855F', name: 'Boa' },
        { code: 'Dried herb - 17-0627 TCX', hex: '#847A59', name: 'Dried herb' },
        { code: 'Olive branch - 18-0527 TCX', hex: '#646A45', name: 'Olive branch' },
        { code: 'Lizard - 18-0629 TCX', hex: '#71643E', name: 'Lizard' },
        { code: 'Avocado - 18-0430 TCX', hex: '#676232', name: 'Avocado' },
        { code: 'Fir green - 18-0627 TCX', hex: '#67592A', name: 'Fir green' },
        { code: 'Bog - 14-0418 TCX', hex: '#BAB696', name: 'Bog' },
        { code: 'Elmwood - 17-1019 TCX', hex: '#8C7C61', name: 'Elmwood' },
        { code: 'Gothic olive - 18-0724 TCX', hex: '#7C6E4F', name: 'Gothic olive' },
        { code: 'Butternut - 18-0830 TCX', hex: '#7A643F', name: 'Butternut' },
        { code: 'Nutria - 18-0825 TCX', hex: '#75663E', name: 'Nutria' },
        { code: 'Military olive - 19-0622 TCX', hex: '#63563B', name: 'Military olive' },
        { code: 'Dark olive - 19-0516 TCX', hex: '#574D35', name: 'Dark olive' },
        { code: 'Moss gray - 15-6410 TCX', hex: '#AFAB97', name: 'Moss gray' },
        { code: 'Abbey stone - 14-6408 TCX', hex: '#ABA798', name: 'Abbey stone' },
        { code: 'Burnt olive - 18-0521 TCX', hex: '#646049', name: 'Burnt olive' },
        { code: 'Dusty olive - 18-0515 TCX', hex: '#646356', name: 'Dusty olive' },
        { code: 'Ivy green - 19-0512 TCX', hex: '#585442', name: 'Ivy green' },
        { code: 'Olive night - 19-0515 TCX', hex: '#535040', name: 'Olive night' },
        { code: 'Grape leaf - 19-0511 TCX', hex: '#545144', name: 'Grape leaf' },
        { code: 'Porpoise - 15-3800 TCX', hex: '#A7A19E', name: 'Porpoise' },
        { code: 'Satellite - 16-3800 TCX', hex: '#9F8D89', name: 'Satellite' },
        { code: 'Driftwood - 18-1210 TCX', hex: '#847A75', name: 'Driftwood' },
        { code: 'Falcon - 18-1304 TCX', hex: '#6D625B', name: 'Falcon' },
        { code: 'Morel - 19-0808 TCX', hex: '#685C53', name: 'Morel' },
        { code: 'Fallen rock - 18-1108 TCX', hex: '#807669', name: 'Fallen rock' },
        { code: 'Vintage khaki - 16-0205 TCX', hex: '#9A9186', name: 'Vintage khaki' },
        { code: 'Crockery - 16-1104 TCX', hex: '#A49887', name: 'Crockery' },
        { code: 'Greige - 16-1109 TCX', hex: '#928475', name: 'Greige' },
        { code: 'Desert taupe - 17-1311 TCX', hex: '#8D7E71', name: 'Desert taupe' },
        { code: 'White pepper - 15-1307 TCX', hex: '#B6A893', name: 'White pepper' },
        { code: 'Humus - 15-1304 TCX', hex: '#B7A793', name: 'Humus' },
        { code: 'Portabella - 17-1316 TCX', hex: '#937B6A', name: 'Portabella' },
        { code: 'Caribou - 18-1017 TCX', hex: '#816D5E', name: 'Caribou' },
        { code: 'Travertine - 15-1114 TCX', hex: '#AE997D', name: 'Travertine' },
        { code: 'Starfish - 16-1120 TCX', hex: '#B09A77', name: 'Starfish' },
        { code: 'Semolina - 15-1218 TCX', hex: '#CEB899', name: 'Semolina' },
        { code: 'Curds and whey - 16-0920 TCX', hex: '#BCA483', name: 'Curds and whey' },
        { code: 'Tigers eye - 17-1038 TCX', hex: '#977C61', name: 'Tigers eye' },
        { code: 'Toasted coconut - 18-1029 TCX', hex: '#8B6A4F', name: 'Toasted coconut' },
        { code: 'Rain drum - 19-0916 TCX', hex: '#5F4C40', name: 'Rain drum' },
        { code: 'Pear sorbet - 11-0615 TCX', hex: '#F3EAC3', name: 'Pear sorbet' },
        { code: 'Pineapple slice - 12-0718 TCX', hex: '#E7D391', name: 'Pineapple slice' },
        { code: 'Yarrow - 12-0758 TCX', hex: '#FACE6D', name: 'Yarrow' },
        { code: 'Anise flower - 12-0717 TCX', hex: '#F4E3B5', name: 'Anise flower' },
        { code: 'Flan - 11-0619 TCX', hex: '#F6E3B4', name: 'Flan' },
        { code: 'Sundress - 12-0729 TCX', hex: '#EBCF89', name: 'Sundress' },
        { code: 'Macadamia - 12-0709 TCX', hex: '#E4CFB6', name: 'Macadamia' },
        { code: 'Lemon meringue - 12-0711 TCX', hex: '#F6E199', name: 'Lemon meringue' },
        { code: 'Yellow iris - 11-0622 TCX', hex: '#EEE78E', name: 'Yellow iris' },
        { code: 'Goldfinch - 12-0737 TCX', hex: '#F8DC6C', name: 'Goldfinch' },
        { code: 'Lemon zest - 13-0756 TCX', hex: '#F9D857', name: 'Lemon zest' },
        { code: 'Solar power - 13-0759 TCX', hex: '#F4BF3A', name: 'Solar power' },
        { code: 'Samoan sun - 14-0851 TCX', hex: '#FBC85F', name: 'Samoan sun' },
        { code: 'Desert sun - 16-1149 TCX', hex: '#C87629', name: 'Desert sun' },
        { code: 'Pumpkin spice - 18-1163 TCX', hex: '#A05C17', name: 'Pumpkin spice' },
        { code: 'Orange pepper - 16-1164 TCX', hex: '#DF7500', name: 'Orange pepper' },
        { code: 'Marmalade - 17-1140 TCX', hex: '#C16512', name: 'Marmalade' },
        { code: 'Hawaiian sunset - 18-1249 TCX', hex: '#BB5C14', name: 'Hawaiian sunset' },
        { code: 'Autumnal - 17-1342 TCX', hex: '#A15325', name: 'Autumnal' },
        { code: 'Umber - 18-1246 TCX', hex: '#944A1F', name: 'Umber' },
        { code: 'Exuberance - 17-1349 TCX', hex: '#E86800', name: 'Exuberance' },
        { code: 'Puffins bill - 16-1363 TCX', hex: '#E95C20', name: 'Puffins bill' },
        { code: 'Caramel cafe - 18-1148 TCX', hex: '#864C24', name: 'Caramel cafe' },
        { code: 'Gold flame - 16-1449 TCX', hex: '#B45422', name: 'Gold flame' },
        { code: 'Cinnamon stick - 18-1345 TCX', hex: '#9B4722', name: 'Cinnamon stick' },
        { code: 'Potters clay - 18-1340 TCX', hex: '#9E4624', name: 'Potters clay' },
        { code: 'Rooibos tea - 18-1355 TCX', hex: '#A23C26', name: 'Rooibos tea' },
        { code: 'Celosia orange - 17-1360 TCX', hex: '#E8703A', name: 'Celosia orange' },
        { code: 'Orangeade - 17-1461 TCX', hex: '#E2552C', name: 'Orangeade' },
        { code: 'Pureed pumpkin - 17-1449 TCX', hex: '#C34121', name: 'Pureed pumpkin' },
        { code: 'Tangerine tango - 17-1463 TCX', hex: '#DD4124', name: 'Tangerine tango' },
        { code: 'Poinciana - 18-1564 TCX', hex: '#CA3422', name: 'Poinciana' },
        { code: 'Koi - 17-1452 TCX', hex: '#D15837', name: 'Koi' },
        { code: 'Samba - 19-1662 TCX', hex: '#A2242F', name: 'Samba' },
        { code: 'Barbados cherry - 19-1757 TCX', hex: '#AA0A27', name: 'Barbados cherry' },
        { code: 'Haute red - 19-1758 TCX', hex: '#A11729', name: 'Haute red' },
        { code: 'Salsa - 18-1657 TCX', hex: '#AA182B', name: 'Salsa' },
        { code: 'Scarlet sage - 19-1559 TCX', hex: '#9D202F', name: 'Scarlet sage' },
        { code: 'Scooter - 19-1863 TCX', hex: '#941E32', name: 'Scooter' },
        { code: 'Red dahlia - 19-1555 TCX', hex: '#7D2027', name: 'Red dahlia' },
        { code: 'Sun dried tomato - 19-1531 TCX', hex: '#752329', name: 'Sun dried tomato' },
        { code: 'Fired brick - 19-1337 TCX', hex: '#6A2E2A', name: 'Fired brick' },
        { code: 'Rhubarb - 19-1652 TCX', hex: '#77202F', name: 'Rhubarb' },
        { code: 'Syrah - 19-1535 TCX', hex: '#6A282C', name: 'Syrah' },
        { code: 'Pomegranate - 19-1930 TCX', hex: '#6C2831', name: 'Pomegranate' },
        { code: 'Cabernet - 19-1724 TCX', hex: '#64242E', name: 'Cabernet' },
        { code: 'Ballerina - 13-2807 TCX', hex: '#F2CFDC', name: 'Ballerina' },
        { code: 'Fairy tale - 13-2802 TCX', hex: '#F2C1D1', name: 'Fairy tale' },
        { code: 'Etherea - 15-1506 TCX', hex: '#A5958F', name: 'Etherea' },
        { code: 'Foxglove - 16-1710 TCX', hex: '#B98391', name: 'Foxglove' },
        { code: 'Mesa rose - 17-1609 TCX', hex: '#A66E7A', name: 'Mesa rose' },
        { code: 'Jazzy - 18-1950 TCX', hex: '#B61C50', name: 'Jazzy' },
        { code: 'Granita - 19-2039 TCX', hex: '#A52350', name: 'Granita' },
        { code: 'Cherries jubilee - 19-2041 TCX', hex: '#A22452', name: 'Cherries jubilee' },
        { code: 'Cabaret - 18-2140 TCX', hex: '#CB3373', name: 'Cabaret' },
        { code: 'Vivacious - 19-2045 TCX', hex: '#A32857', name: 'Vivacious' },
        { code: 'Bellflower - 18-3628 TCX', hex: '#9469A2', name: 'Bellflower' },
        { code: 'English lavendar - 17-3617 TCX', hex: '#9D7BB0', name: 'English lavendar' },
        { code: 'Rhapsody - 16-3817 TCX', hex: '#9F86AA', name: 'Rhapsody' },
        { code: 'Acai - 19-3628 TCX', hex: '#46295A', name: 'Acai' },
        { code: 'Tillandsia purple - 19-3638 TCX', hex: '#563474', name: 'Tillandsia purple' },
        { code: 'Picasso lily - 18-3635 TCX', hex: '#634878', name: 'Picasso lily' },
        { code: 'Mystical - 18-3620 TCX', hex: '#5F4E72', name: 'Mystical' },
        { code: 'Icelandic blue - 15-3908 TCX', hex: '#A9ADC2', name: 'Icelandic blue' },
        { code: 'Aleutian - 15-3912 TCX', hex: '#9A9EB3', name: 'Aleutian' },
        { code: 'Silver bullet - 17-3933 TCX', hex: '#81839A', name: 'Silver bullet' },
        { code: 'Blue granite - 18-3933 TCX', hex: '#717388', name: 'Blue granite' },
        { code: 'Evening blue - 19-3815 TCX', hex: '#2A293E', name: 'Evening blue' },
        { code: 'Deep well - 19-3713 TCX', hex: '#2C2A33', name: 'Deep well' },
        { code: 'Night sky - 19-3924 TCX', hex: '#2A2A35', name: 'Night sky' },
        { code: 'Blue heron - 16-3921 TCX', hex: '#96A3C7', name: 'Blue heron' },
        { code: 'Hydrangea - 16-4030 TCX', hex: '#849BCC', name: 'Hydrangea' },
        { code: 'Xenon blue - 14-3949 TCX', hex: '#B7C0D7', name: 'Xenon blue' },
        { code: 'Brunnera blue - 16-3922 TCX', hex: '#9BA9CA', name: 'Brunnera blue' },
        { code: 'Sky captain - 19-3922 TCX', hex: '#262934', name: 'Sky captain' },
        { code: 'Navy blazer - 19-3923 TCX', hex: '#282D3C', name: 'Navy blazer' },
        { code: 'Dark sapphire - 19-4020 TCX', hex: '#262B37', name: 'Dark sapphire' },
        { code: 'Plein air - 13-4111 TCX', hex: '#BFCAD6', name: 'Plein air' },
        { code: 'Halogen blue - 13-3920 TCX', hex: '#BDC6DC', name: 'Halogen blue' },
        { code: 'Chambray blue - 15-4030 TCX', hex: '#9EB4D3', name: 'Chambray blue' },
        { code: 'Bel air blue - 15-3932 TCX', hex: '#819AC1', name: 'Bel air blue' },
        { code: 'Vintage indigo - 19-3929 TCX', hex: '#4A556B', name: 'Vintage indigo' },
        { code: 'Sodalite blue - 19-3953 TCX', hex: '#253668', name: 'Sodalite blue' },
        { code: 'Parisian night - 19-4022 TCX', hex: '#323441', name: 'Parisian night' },
        { code: 'Monaco blue - 19-3964 TCX', hex: '#274374', name: 'Monaco blue' },
        { code: 'Vallarta blue - 18-4034 TCX', hex: '#30658E', name: 'Vallarta blue' },
        { code: 'Salute - 19-4011 TCX', hex: '#282B34', name: 'Salute' },
        { code: 'Outer space - 19-4009 TCX', hex: '#2F3441', name: 'Outer space' },
        { code: 'Blueberry - 19-4021 TCX', hex: '#2C333E', name: 'Blueberry' },
        { code: 'Carbon - 19-4012 TCX', hex: '#272F38', name: 'Carbon' },
        { code: 'Vulcan - 19-4218 TCX', hex: '#2D3036', name: 'Vulcan' },
        { code: 'Omphalodes - 13-4200 TCX', hex: '#B5CEDF', name: 'Omphalodes' },
        { code: 'Cool blue - 14-4317 TCX', hex: '#A5C5D9', name: 'Cool blue' },
        { code: 'Bering sea - 18-4028 TCX', hex: '#4B5B6E', name: 'Bering sea' },
        { code: 'Blue wing teal - 19-4121 TCX', hex: '#2C4053', name: 'Blue wing teal' },
        { code: 'Poseidon - 19-4033 TCX', hex: '#123955', name: 'Poseidon' },
        { code: 'Mykonos blue - 18-4434 TCX', hex: '#005780', name: 'Mykonos blue' },
        { code: 'Reflecting pond - 19-4326 TCX', hex: '#203E4A', name: 'Reflecting pond' },
        { code: 'Corydalis blue - 14-4311 TCX', hex: '#A9CADA', name: 'Corydalis blue' },
        { code: 'Blue topaz - 14-4310 TCX', hex: '#78BDD4', name: 'Blue topaz' },
        { code: 'Gulf stream - 14-4511 TCX', hex: '#88C3D0', name: 'Gulf stream' },
        { code: 'Aquarelle - 15-4714 TCX', hex: '#61AAB1', name: 'Aquarelle' },
        { code: 'Aqua splash - 14-4812 TCX', hex: '#85CED1', name: 'Aqua splash' },
        { code: 'Botanical garden - 19-5220 TCX', hex: '#12403C', name: 'Botanical garden' },
        { code: 'Scarab - 19-5350 TCX', hex: '#23312D', name: 'Scarab' },
        { code: 'Nimbus cloud - 13-4108 TCX', hex: '#D5D5D8', name: 'Nimbus cloud' },
        { code: 'Micro chip - 14-4105 TCX', hex: '#BABCC0', name: 'Micro chip' },
        { code: 'Wet weather - 16-5101 TCX', hex: '#929090', name: 'Wet weather' },
        { code: 'Titanium - 17-4014 TCX', hex: '#807D7F', name: 'Titanium' },
        { code: 'December sky - 18-4016 TCX', hex: '#767275', name: 'December sky' },
        { code: 'Pavement - 19-3900 TCX', hex: '#524D50', name: 'Pavement' },
        { code: 'Magnet - 19-3901 TCX', hex: '#4D4B4F', name: 'Magnet' },
        { code: 'Silver sconce - 16-3850 TCX', hex: '#A19FA5', name: 'Silver sconce' },
        { code: 'Silver filigree - 17-3911 TCX', hex: '#7F7C81', name: 'Silver filigree' },
        { code: 'Quicksilver - 17-3907 TCX', hex: '#7E7D88', name: 'Quicksilver' },
        { code: 'Storm front - 17-1503 TCX', hex: '#787376', name: 'Storm front' },
        { code: 'Tornado - 18-3907 TCX', hex: '#5E5B60', name: 'Tornado' },
        { code: 'Eiffel tower - 18-5210 TCX', hex: '#5C5658', name: 'Eiffel tower' },
        { code: 'Graphite - 19-3927 TCX', hex: '#3B3B48', name: 'Graphite' },
        { code: 'Alloy - 16-3915 TCX', hex: '#98979A', name: 'Alloy' },
        { code: 'Sleet - 16-3916 TCX', hex: '#92949B', name: 'Sleet' },
        { code: 'Tradewinds - 15-4307 TCX', hex: '#7F8793', name: 'Tradewinds' },
        { code: 'Grisaille - 18-3912 TCX', hex: '#585E6F', name: 'Grisaille' },
        { code: 'Periscope - 19-3918 TCX', hex: '#46444C', name: 'Periscope' },
        { code: 'Quiet shade - 18-4006 TCX', hex: '#66676D', name: 'Quiet shade' },
        { code: 'Turbulence - 19-4215 TCX', hex: '#4E545B', name: 'Turbulence' },
        { code: 'Stormy weather - 18-4214 TCX', hex: '#58646D', name: 'Stormy weather' },
        { code: 'Iron gate - 19-3910 TCX', hex: '#4E5055', name: 'Iron gate' },
        { code: 'Forged iron - 19-3907 TCX', hex: '#48464A', name: 'Forged iron' },
        { code: 'Asphalt - 19-0201 TCX', hex: '#434447', name: 'Asphalt' },
        { code: 'Ghost gray - 16-4703 TCX', hex: '#9C9B98', name: 'Ghost gray' },
        { code: 'Brushed nickel - 18-5102 TCX', hex: '#73706F', name: 'Brushed nickel' },
        { code: 'Mourning dove - 16-4400 TCX', hex: '#94908B', name: 'Mourning dove' },
        { code: 'Belgian block - 15-4306 TCX', hex: '#A3A9A6', name: 'Belgian block' },
        { code: 'Agave green - 18-5806 TCX', hex: '#6B7169', name: 'Agave green' },
        { code: 'Cilantro - 19-5621 TCX', hex: '#43544B', name: 'Cilantro' },
        { code: 'Pine grove - 19-5406 TCX', hex: '#213631', name: 'Pine grove' },
        { code: 'Eden - 19-6050 TCX', hex: '#264E36', name: 'Eden' },
        { code: 'Jolly green - 18-6030 TCX', hex: '#007844', name: 'Jolly green' },
        { code: 'Mountain view - 19-5918 TCX', hex: '#2E3D30', name: 'Mountain view' },
        { code: 'Margarita - 14-0116 TCX', hex: '#B5C38E', name: 'Margarita' },
        { code: 'Winter moss - 18-0523 TCX', hex: '#5B5A41', name: 'Winter moss' },
        { code: 'Climbing ivy - 19-0307 TCX', hex: '#444940', name: 'Climbing ivy' },
        { code: 'Delicioso - 19-0840 TCX', hex: '#3F352F', name: 'Delicioso' },
        { code: 'Mulch - 19-0910 TCX', hex: '#433937', name: 'Mulch' },
        { code: 'Mole - 19-1106 TCX', hex: '#392D2B', name: 'Mole' },
        { code: 'Chocolate torte - 19-1109 TCX', hex: '#382E2D', name: 'Chocolate torte' },
        { code: 'Ganache - 19-1018 TCX', hex: '#34292A', name: 'Ganache' },
        { code: 'Black bean - 19-3909 TCX', hex: '#2E272A', name: 'Black bean' },
        { code: 'Espresso - 19-1103 TCX', hex: '#363031', name: 'Espresso' },
        { code: 'Meteorite - 19-4008 TCX', hex: '#2B2929', name: 'Meteorite' },
        { code: 'Tap shoe - 19-4004 TCX', hex: '#2A2B2D', name: 'Tap shoe' },
        { code: 'White alyssum - 11-1001 TCX', hex: '#EFEBE7', name: 'White alyssum' },
        { code: 'Jet stream - 11-0605 TCX', hex: '#EDE6DE', name: 'Jet stream' },
        { code: 'Sweet cream - 11-0106 TCX', hex: '#F0EAD6', name: 'Sweet cream' },
        { code: 'Buttercream - 11-0110 TCX', hex: '#EFE0CD', name: 'Buttercream' },
        { code: 'Lemon icing - 11-0515 TCX', hex: '#F6EBC8', name: 'Lemon icing' },
        { code: 'Sugar swizzle - 11-0607 TCX', hex: '#F3EEE7', name: 'Sugar swizzle' },
        { code: 'Coconut milk - 11-0608 TCX', hex: '#F0EDE5', name: 'Coconut milk' },
        { code: 'Yellow pear - 11-0623 TCX', hex: '#ECE99B', name: 'Yellow pear' },
        { code: 'Sea salt - 11-1302 TCX', hex: '#F1E6DE', name: 'Sea salt' },
        { code: 'Brilliant white - 11-4001 TCX', hex: '#EDF1FE', name: 'Brilliant white' },
        { code: 'Cannoli cream - 11-4302 TCX', hex: '#F0EFE2', name: 'Cannoli cream' },
        { code: 'Tofu - 11-4801 TCX', hex: '#E8E3D9', name: 'Tofu' },
        { code: 'Pistachio shell - 12-0110 TCX', hex: '#D7CFBB', name: 'Pistachio shell' },
        { code: 'Celandine - 12-0646 TCX', hex: '#EBDF67', name: 'Celandine' },
        { code: 'Lemon verbena - 12-0742 TCX', hex: '#F3E779', name: 'Lemon verbena' },
        { code: 'Creme de peche - 12-1110 TCX', hex: '#F5D6C6', name: 'Creme de peche' },
        { code: 'Marys rose - 12-1813 TCX', hex: '#F7D1D4', name: 'Marys rose' },
        { code: 'Morganite - 12-2901 TCX', hex: '#DFCDC6', name: 'Morganite' },
        { code: 'Rose water - 12-2907 TCX', hex: '#F8E0E7', name: 'Rose water' },
        { code: 'Almond milk - 12-4301 TCX', hex: '#D6CEBE', name: 'Almond milk' },
        { code: 'Lime popsicle - 13-0443 TCX', hex: '#C0DB3A', name: 'Lime popsicle' },
        { code: 'Golden kiwi - 13-0644 TCX', hex: '#F3DD3E', name: 'Golden kiwi' },
        { code: 'Meadowlark - 13-0646 TCX', hex: '#EAD94E', name: 'Meadowlark' },
        { code: 'Evening primrose - 13-0651 TCX', hex: '#CCDB1E', name: 'Evening primrose' },
        { code: 'Habanero gold - 13-0849 TCX', hex: '#FED450', name: 'Habanero gold' },
        { code: 'Minion yellow - 13-0851 TCX', hex: '#FED55D', name: 'Minion yellow' },
        { code: 'Soybean - 13-0919 TCX', hex: '#D2C29D', name: 'Soybean' },
        { code: 'Jurassic gold - 13-0946 TCX', hex: '#E7AA56', name: 'Jurassic gold' },
        { code: 'Brown rice - 13-1105 TCX', hex: '#C7BBA4', name: 'Brown rice' },
        { code: 'Peach quartz - 13-1125 TCX', hex: '#F5B895', name: 'Peach quartz' },
        { code: 'Peachy keen - 13-1208 TCX', hex: '#E2BDB3', name: 'Peachy keen' },
        { code: 'Brazilian sand - 13-1308 TCX', hex: '#DACAB7', name: 'Brazilian sand' },
        { code: 'Pink salt - 13-1511 TCX', hex: '#F7CDC7', name: 'Pink salt' },
        { code: 'Rose quartz - 13-1520 TCX', hex: '#F7CAC9', name: 'Rose quartz' },
        { code: 'Ballet slipper - 13-2808 TCX', hex: '#EBCED5', name: 'Ballet slipper' },
        { code: 'Cherry blossom - 13-3207 TCX', hex: '#F7CEE0', name: 'Cherry blossom' },
        { code: 'Antarctica - 13-4104 TCX', hex: '#C6C5C6', name: 'Antarctica' },
        { code: 'Oyster mushroom - 13-4201 TCX', hex: '#C3C6C8', name: 'Oyster mushroom' },
        { code: 'Tanager turquoise - 13-4720 TCX', hex: '#91DCE8', name: 'Tanager turquoise' },
        { code: 'Limpet shell - 13-4810 TCX', hex: '#98DDDE', name: 'Limpet shell' },
        { code: 'Iced aqua - 13-5410 TCX', hex: '#ABD3DB', name: 'Iced aqua' },
        { code: 'Acid lime - 14-0340 TCX', hex: '#BADF30', name: 'Acid lime' },
        { code: 'Spicy mustard - 14-0952 TCX', hex: '#D8AE47', name: 'Spicy mustard' },
        { code: 'Kumquat - 14-1052 TCX', hex: '#FBAA4C', name: 'Kumquat' },
        { code: 'Irish cream - 14-1208 TCX', hex: '#C0AC92', name: 'Irish cream' },
        { code: 'Orange chiffon - 14-1241 TCX', hex: '#F9AA7D', name: 'Orange chiffon' },
        { code: 'Hazelnut - 14-1315 TCX', hex: '#CFB095', name: 'Hazelnut' },
        { code: 'Sepia rose - 14-1803 TCX', hex: '#D4BAB6', name: 'Sepia rose' },
        { code: 'Raindrops - 14-3906 TCX', hex: '#B1AAB3', name: 'Raindrops' },
        { code: 'Zen blue - 14-3912 TCX', hex: '#9FA9BE', name: 'Zen blue' },
        { code: 'Quiet gray - 14-4107 TCX', hex: '#B9BABD', name: 'Quiet gray' },
        { code: 'Airy blue - 14-4122 TCX', hex: '#92B6D5', name: 'Airy blue' },
        { code: 'Harbor mist - 14-4202 TCX', hex: '#AFB1B4', name: 'Harbor mist' },
        { code: 'Sea angel - 14-4315 TCX', hex: '#98BFCA', name: 'Sea angel' },
        { code: 'Baltic sea - 14-4320 TCX', hex: '#79B5DB', name: 'Baltic sea' },
        { code: 'Antiqua sand - 14-4615 TCX', hex: '#83C2CD', name: 'Antiqua sand' },
        { code: 'Island paradise - 14-4620 TCX', hex: '#95DEE3', name: 'Island paradise' },
        { code: 'Tibetan stone - 14-4710 TCX', hex: '#82C2C7', name: 'Tibetan stone' },
        { code: 'Mango mojito - 15-0960 TCX', hex: '#D69C2F', name: 'Mango mojito' },
        { code: 'Ginger root - 15-1020 TCX', hex: '#BFA58A', name: 'Ginger root' },
        { code: 'Iced coffee - 15-1040 TCX', hex: '#B18F6A', name: 'Iced coffee' },
        { code: 'Autumn blaze - 15-1045 TCX', hex: '#D9922E', name: 'Autumn blaze' },
        { code: 'Golden orange - 15-1051 TCX', hex: '#D7942D', name: 'Golden orange' },
        { code: 'Porcini - 15-1125 TCX', hex: '#CCA580', name: 'Porcini' },
        { code: 'Iceland poppy - 15-1151 TCX', hex: '#F4963A', name: 'Iceland poppy' },
        { code: 'Papaya - 15-1243 TCX', hex: '#FEA166', name: 'Papaya' },
        { code: 'Carrot curl - 15-1262 TCX', hex: '#FE8C18', name: 'Carrot curl' },
        { code: 'Turmeric - 15-1264 TCX', hex: '#FE840E', name: 'Turmeric' },
        { code: 'Tangelo - 15-1335 TCX', hex: '#FE7E03', name: 'Tangelo' },
        { code: 'Fenugreek - 15-1425 TCX', hex: '#C0916C', name: 'Fenugreek' },
        { code: 'Dusted clay - 15-1429 TCX', hex: '#CC7357', name: 'Dusted clay' },
        { code: 'Pastry shell - 15-1430 TCX', hex: '#BD8C66', name: 'Pastry shell' },
        { code: 'Blooming dahlia - 15-1520 TCX', hex: '#EB9687', name: 'Blooming dahlia' },
        { code: 'Crocus petal - 15-3520 TCX', hex: '#B99BC5', name: 'Crocus petal' },
        { code: 'Purple rose - 15-3716 TCX', hex: '#B09FCA', name: 'Purple rose' },
        { code: 'Lilac breeze - 15-3720 TCX', hex: '#B3A0C9', name: 'Lilac breeze' },
        { code: 'Serenity - 15-3919 TCX', hex: '#91A8D0', name: 'Serenity' },
        { code: 'Crystal seas - 15-4428 TCX', hex: '#5DAFCE', name: 'Crystal seas' },
        { code: 'Golden lime - 16-0543 TCX', hex: '#9A9738', name: 'Golden lime' },
        { code: 'Split pea - 16-0545 TCX', hex: '#9C9A40', name: 'Split pea' },
        { code: 'Lentil sprout - 16-0550 TCX', hex: '#ABA44D', name: 'Lentil sprout' },
        { code: 'Pure cashmere - 16-1103 TCX', hex: '#ADA396', name: 'Pure cashmere' },
        { code: 'Sun baked - 16-1345 TCX', hex: '#D27F63', name: 'Sun baked' },
        { code: 'Peach caramel - 16-1347 TCX', hex: '#C5733D', name: 'Peach caramel' },
        { code: 'Tomato cream - 16-1348 TCX', hex: '#C57644', name: 'Tomato cream' },
        { code: 'Orange tiger - 16-1358 TCX', hex: '#F96714', name: 'Orange tiger' },
        { code: 'Meerkat - 16-1438 TCX', hex: '#A46F44', name: 'Meerkat' },
        { code: 'Exotic orange - 16-1453 TCX', hex: '#F96531', name: 'Exotic orange' },
        { code: 'Dragon fire - 16-1460 TCX', hex: '#FC642D', name: 'Dragon fire' },
        { code: 'Coral quartz - 16-1545 TCX', hex: '#F77464', name: 'Coral quartz' },
        { code: 'Peach echo - 16-1548 TCX', hex: '#F7786B', name: 'Peach echo' },
        { code: 'Purple dove - 16-1606 TCX', hex: '#98878C', name: 'Purple dove' },
        { code: 'Sand verbena - 16-3720 TCX', hex: '#9F90C1', name: 'Sand verbena' },
        { code: 'Lilac gray - 16-3905 TCX', hex: '#9896A4', name: 'Lilac gray' },
        { code: 'Granada sky - 16-4033 TCX', hex: '#5D81BB', name: 'Granada sky' },
        { code: 'Tree house - 17-0630 TCX', hex: '#988C75', name: 'Tree house' },
        { code: 'Chai tea - 17-0949 TCX', hex: '#B1832F', name: 'Chai tea' },
        { code: 'Roasted pecan - 17-1052 TCX', hex: '#93592B', name: 'Roasted pecan' },
        { code: 'Roasted cashew - 17-1105 TCX', hex: '#918579', name: 'Roasted cashew' },
        { code: 'Winter twig - 17-1108 TCX', hex: '#948A7A', name: 'Winter twig' },
        { code: 'Petrified oak - 17-1115 TCX', hex: '#8D7960', name: 'Petrified oak' },
        { code: 'Argan oil - 17-1142 TCX', hex: '#8B593E', name: 'Argan oil' },
        { code: 'Autumn maple - 17-1145 TCX', hex: '#C46215', name: 'Autumn maple' },
        { code: 'Sepia tint - 17-1314 TCX', hex: '#897560', name: 'Sepia tint' },
        { code: 'Spice route - 17-1345 TCX', hex: '#B95B3F', name: 'Spice route' },
        { code: 'Scarlet ibis - 17-1361 TCX', hex: '#F45520', name: 'Scarlet ibis' },
        { code: 'Summer fig - 17-1450 TCX', hex: '#BE4B3B', name: 'Summer fig' },
        { code: 'Moonscape - 17-1708 TCX', hex: '#725F69', name: 'Moonscape' },
        { code: 'Fruit dove - 17-1926 TCX', hex: '#CE5B78', name: 'Fruit dove' },
        { code: 'Pink yarrow - 17-2034 TCX', hex: '#CE3175', name: 'Pink yarrow' },
        { code: 'Toadstool - 17-2411 TCX', hex: '#988088', name: 'Toadstool' },
        { code: 'Bodacious - 17-3240 TCX', hex: '#B76BA3', name: 'Bodacious' },
        { code: 'Diffused orchid - 17-3520 TCX', hex: '#9879A2', name: 'Diffused orchid' },
        { code: 'Fairy wren - 17-3640 TCX', hex: '#9479AF', name: 'Fairy wren' },
        { code: 'Sunlit allium - 17-3735 TCX', hex: '#9787BB', name: 'Sunlit allium' },
        { code: 'Sharkskin - 17-3914 TCX', hex: '#838487', name: 'Sharkskin' },
        { code: 'Pale iris - 17-3929 TCX', hex: '#8895C5', name: 'Pale iris' },
        { code: 'Iolite - 17-3940 TCX', hex: '#707BB4', name: 'Iolite' },
        { code: 'Gray flannel - 17-4016 TCX', hex: '#848182', name: 'Gray flannel' },
        { code: 'Riverside - 17-4028 TCX', hex: '#4C6A92', name: 'Riverside' },
        { code: 'Quiet harbor - 17-4029 TCX', hex: '#5A789A', name: 'Quiet harbor' },
        { code: 'Lichen blue - 17-4032 TCX', hex: '#5D89B3', name: 'Lichen blue' },
        { code: 'Pacific coast - 17-4033 TCX', hex: '#5480AC', name: 'Pacific coast' },
        { code: 'Ibiza blue - 17-4245 TCX', hex: '#007CB7', name: 'Ibiza blue' },
        { code: 'Navagio bay - 17-4429 TCX', hex: '#3183A0', name: 'Navagio bay' },
        { code: 'Barrier reef - 17-4530 TCX', hex: '#0084A1', name: 'Barrier reef' },
        { code: 'Guacamole - 17-0530 TCX', hex: '#797B3A', name: 'Guacamole' },
        { code: 'Kale - 18-0107 TCX', hex: '#5A7247', name: 'Kale' },
        { code: 'Mayfly - 18-0220 TCX', hex: '#65663F', name: 'Mayfly' },
        { code: 'Twist of lime - 18-0330 TCX', hex: '#4E632C', name: 'Twist of lime' },
        { code: 'Martini olive - 18-0625 TCX', hex: '#716A4D', name: 'Martini olive' },
        { code: 'Emperador - 18-1028 TCX', hex: '#684832', name: 'Emperador' },
        { code: 'Thai curry - 18-1049 TCX', hex: '#AB6819', name: 'Thai curry' },
        { code: 'Honey ginger - 18-1050 TCX', hex: '#A86217', name: 'Honey ginger' },
        { code: 'Sugar almond - 18-1155 TCX', hex: '#935529', name: 'Sugar almond' },
        { code: 'Spiced apple - 18-1325 TCX', hex: '#783937', name: 'Spiced apple' },
        { code: 'Chili oil - 18-1440 TCX', hex: '#8E3C36', name: 'Chili oil' },
        { code: 'Plum truffle - 18-1506 TCX', hex: '#675657', name: 'Plum truffle' },
        { code: 'Brandy brown - 18-1541 TCX', hex: '#73362A', name: 'Brandy brown' },
        { code: 'Valiant poppy - 18-1549 TCX', hex: '#BC322C', name: 'Valiant poppy' },
        { code: 'Aura orange - 18-1551 TCX', hex: '#B4262A', name: 'Aura orange' },
        { code: 'Toreador - 18-1653 TCX', hex: '#B61032', name: 'Toreador' },
        { code: 'Lychee - 18-1654 TCX', hex: '#BA0B32', name: 'Lychee' },
        { code: 'Goji berry - 18-1659 TCX', hex: '#B91228', name: 'Goji berry' },
        { code: 'Arctic dusk - 18-1705 TCX', hex: '#735B6A', name: 'Arctic dusk' },
        { code: 'Ephemera - 18-1708 TCX', hex: '#6F5965', name: 'Ephemera' },
        { code: 'Jalapeno red - 18-1759 TCX', hex: '#B2103C', name: 'Jalapeno red' },
        { code: 'Love potion - 18-1951 TCX', hex: '#C01352', name: 'Love potion' },
        { code: 'Pink peacock - 18-2045 TCX', hex: '#C62168', name: 'Pink peacock' },
        { code: 'Grape kiss - 18-3014 TCX', hex: '#7B4368', name: 'Grape kiss' },
        { code: 'Willowherb - 18-3120 TCX', hex: '#8E4483', name: 'Willowherb' },
        { code: 'Charisma - 18-3340 TCX', hex: '#632A60', name: 'Charisma' },
        { code: 'Plum jam - 18-3521 TCX', hex: '#624076', name: 'Plum jam' },
        { code: 'Lavender crystal - 18-3530 TCX', hex: '#936A98', name: 'Lavender crystal' },
        { code: 'Purple sapphire - 18-3540 TCX', hex: '#6F4685', name: 'Purple sapphire' },
        { code: 'Chive blossom - 18-3634 TCX', hex: '#7D5D99', name: 'Chive blossom' },
        { code: 'Purple corallite - 18-3839 TCX', hex: '#5A4E8F', name: 'Purple corallite' },
        { code: 'Volcanic glass - 18-3908 TCX', hex: '#615C60', name: 'Volcanic glass' },
        { code: 'Gray blue - 18-3917 TCX', hex: '#4D587A', name: 'Gray blue' },
        { code: 'Blue horizon - 18-3929 TCX', hex: '#4E6482', name: 'Blue horizon' },
        { code: 'Iris bloom - 18-3950 TCX', hex: '#5B609E', name: 'Iris bloom' },
        { code: 'Nebulas blue - 18-4048 TCX', hex: '#2D62A3', name: 'Nebulas blue' },
        { code: 'Indigo bunting - 18-4250 TCX', hex: '#006CA9', name: 'Indigo bunting' },
        { code: 'Fjord blue - 18-4430 TCX', hex: '#007290', name: 'Fjord blue' },
        { code: 'Hawaiian surf - 18-4538 TCX', hex: '#0078A7', name: 'Hawaiian surf' },
        { code: 'Tahitian tide - 18-4630 TCX', hex: '#006B7E', name: 'Tahitian tide' },
        { code: 'Quetzal green - 18-5025 TCX', hex: '#006865', name: 'Quetzal green' },
        { code: 'Granite gray - 18-5204 TCX', hex: '#615E5F', name: 'Granite gray' },
        { code: 'Lush meadow - 18-5845 TCX', hex: '#006E51', name: 'Lush meadow' },
        { code: 'Gray pinstripe - 19-0203 TCX', hex: '#49494D', name: 'Gray pinstripe' },
        { code: 'Sea turtle - 19-0403 TCX', hex: '#5E5749', name: 'Sea turtle' },
        { code: 'Deep depths - 19-0413 TCX', hex: '#46483C', name: 'Deep depths' },
        { code: 'Kalamata - 19-0510 TCX', hex: '#5F5B4C', name: 'Kalamata' },
        { code: 'Crocodile - 19-0823 TCX', hex: '#5D5348', name: 'Crocodile' },
        { code: 'Chocolate plum - 19-1110 TCX', hex: '#3C2D2E', name: 'Chocolate plum' },
        { code: 'Chocolate lab - 19-1214 TCX', hex: '#5C3E35', name: 'Chocolate lab' },
        { code: 'Shaved chocolate - 19-1215 TCX', hex: '#543B35', name: 'Shaved chocolate' },
        { code: 'Fondue fudge - 19-1224 TCX', hex: '#5D4236', name: 'Fondue fudge' },
        { code: 'Tiramisu - 19-1233 TCX', hex: '#634235', name: 'Tiramisu' },
        { code: 'Rocky road - 19-1234 TCX', hex: '#5A3E36', name: 'Rocky road' },
        { code: 'Chicory coffee - 19-1419 TCX', hex: '#4A342E', name: 'Chicory coffee' },
        { code: 'Smoked paprika - 19-1429 TCX', hex: '#6E362C', name: 'Smoked paprika' },
        { code: 'Chocolate fondant - 19-1432 TCX', hex: '#56352D', name: 'Chocolate fondant' },
        { code: 'Cherry mahogany - 19-1435 TCX', hex: '#66352B', name: 'Cherry mahogany' },
        { code: 'Merlot - 19-1534 TCX', hex: '#72262C', name: 'Merlot' },
        { code: 'Red pear - 19-1536 TCX', hex: '#7B3539', name: 'Red pear' },
        { code: 'Pickled beet - 19-2420 TCX', hex: '#4D233D', name: 'Pickled beet' },
        { code: 'Plum caspia - 19-2429 TCX', hex: '#61224A', name: 'Plum caspia' },
        { code: 'Winter bloom - 19-2620 TCX', hex: '#47243B', name: 'Winter bloom' },
        { code: 'Spiced plum - 19-3425 TCX', hex: '#6D4773', name: 'Spiced plum' },
        { code: 'Violet indigo - 19-3750 TCX', hex: '#3E285C', name: 'Violet indigo' },
        { code: 'Maritime blue - 19-3831 TCX', hex: '#27293D', name: 'Maritime blue' },
        { code: 'Obsidian - 19-3902 TCX', hex: '#3A363B', name: 'Obsidian' },
        { code: 'Black beauty - 19-3911 TCX', hex: '#26262A', name: 'Black beauty' },
        { code: 'Blackened pearl - 19-3917 TCX', hex: '#4D4B50', name: 'Blackened pearl' },
        { code: 'Odyssey gray - 19-3930 TCX', hex: '#434452', name: 'Odyssey gray' },
        { code: 'Black onyx - 19-4003 TCX', hex: '#2B272B', name: 'Black onyx' },
        { code: 'Navy peony - 19-4029 TCX', hex: '#223A5E', name: 'Navy peony' },
        { code: 'Sargasso sea - 19-4031 TCX', hex: '#35435A', name: 'Sargasso sea' },
        { code: 'Sailor blue - 19-4034 TCX', hex: '#0E3A53', name: 'Sailor blue' },
        { code: 'Gibraltar sea - 19-4038 TCX', hex: '#123850', name: 'Gibraltar sea' },
        { code: 'Lapis blue - 19-4045 TCX', hex: '#004B8D', name: 'Lapis blue' },
        { code: 'Baleine blue - 19-4048 TCX', hex: '#155187', name: 'Baleine blue' },
        { code: 'Galaxy blue - 19-4055 TCX', hex: '#2A4B7C', name: 'Galaxy blue' },
        { code: 'Blue opal - 19-4120 TCX', hex: '#0F3B57', name: 'Blue opal' },
        { code: 'Moonlit ocean - 19-4122 TCX', hex: '#293B4D', name: 'Moonlit ocean' },
        { code: 'Deep dive - 19-4126 TCX', hex: '#29495C', name: 'Deep dive' },
        { code: 'Crystal teal - 19-4536 TCX', hex: '#00637C', name: 'Crystal teal' },
        { code: 'Deep lagoon - 19-4540 TCX', hex: '#005265', name: 'Deep lagoon' },
        { code: 'Sea moss - 19-5030 TCX', hex: '#254445', name: 'Sea moss' },
        { code: 'Forest biome - 19-5230 TCX', hex: '#184A45', name: 'Forest biome' },
        { code: 'Rain forest - 19-5232 TCX', hex: '#15463E', name: 'Rain forest' }
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

  // Fabric detection for custom color eligibility (Cotton + 100% Polyester)
  isCottonFabric: (fabricType) => {
    if (!fabricType || typeof fabricType !== 'string') {
      return false;
    }
    
    // Convert to lowercase for case-insensitive matching
    const fabric = fabricType.toLowerCase();
    
    // Check for 100% Polyester (now allowed for custom colors)
    if (fabric.includes('100%') && fabric.includes('polyester')) {
      return true;
    }
    
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

  // Calculate dynamic price based on garment, fabric, and sample type
  calculateDynamicPrice: (garmentType, fabricType, sampleType) => {
    // Return null if missing required parameters
    if (!garmentType || !fabricType || !sampleType) {
      return null;
    }


    // Get pricing for specific garment type
    const garmentPricing = V10_CONFIG.GARMENT_PRICING[garmentType];
    if (!garmentPricing) {
      // Fallback to legacy pricing if garment not found
      return sampleType === 'stock' ? V10_CONFIG.PRICING.STOCK_SAMPLE : V10_CONFIG.PRICING.CUSTOM_SAMPLE;
    }

    // Get pricing for specific fabric type
    const fabricPricing = garmentPricing[fabricType];
    if (!fabricPricing) {
      // Fallback to legacy pricing if fabric not found
      return sampleType === 'stock' ? V10_CONFIG.PRICING.STOCK_SAMPLE : V10_CONFIG.PRICING.CUSTOM_SAMPLE;
    }

    // Return the price based on sample type
    if (sampleType === 'stock') {
      return fabricPricing.stock;
    } else if (sampleType === 'custom') {
      // Return null if custom not available for this fabric
      return fabricPricing.custom;
    }

    return null;
  },

  // Check if garment should have custom color restrictions based on fabric type
  shouldRestrictCustomColor: (garmentElement) => {
    if (!garmentElement) return false;
    
    const fabricInputs = garmentElement.querySelectorAll('input[name*="fabricType"]:checked');
    let fabricType = fabricInputs.length > 0 ? fabricInputs[0].value : null;
    
    // Fallback to saved garment data if no checked input (edit mode)
    if (!fabricType) {
      const garmentId = garmentElement?.dataset?.garmentId;
      const garmentData = V10_State.garments.get(garmentId);
      fabricType = garmentData?.fabricType;
    }
    
    // Only restrict if fabric is selected and is non-cotton
    if (!fabricType) {
      return false; // No restriction if no fabric selected yet
    }
    
    return !V10_Utils.isCottonFabric(fabricType);
  },

  // Update sample type card prices based on garment and fabric selection
  updateSampleTypePrices: (garmentElement) => {
    if (!garmentElement) return;

    // Get current selections
    const garmentTypeInput = garmentElement.querySelector('input[name*="garmentType"]:checked');
    const fabricTypeInput = garmentElement.querySelector('input[name*="fabricType"]:checked');
    
    const garmentType = garmentTypeInput ? garmentTypeInput.value : null;
    const fabricType = fabricTypeInput ? fabricTypeInput.value : null;

    // Find sample type cards
    const stockCard = garmentElement.querySelector('.sample-type-card[data-value="stock"]');
    const customCard = garmentElement.querySelector('.sample-type-card[data-value="custom"]');

    // Update stock price
    if (stockCard) {
      const priceElement = stockCard.querySelector('.sample-type-card__price');
      if (priceElement) {
        const stockPrice = V10_Utils.calculateDynamicPrice(garmentType, fabricType, 'stock');
        // Price display removed - keeping selection functionality
        priceElement.textContent = '';
      }
    }

    // Update custom price
    if (customCard) {
      const priceElement = customCard.querySelector('.sample-type-card__price');
      if (priceElement) {
        const customPrice = V10_Utils.calculateDynamicPrice(garmentType, fabricType, 'custom');
        
        if (customPrice && customPrice !== 'Premium') {
          // Price display removed - keeping selection functionality
          priceElement.textContent = '';
          // Enable the card if custom is available
          customCard.classList.remove('sample-type-card--disabled', 'sample-type-card--warning');
          customCard.style.opacity = '1';
          customCard.style.pointerEvents = 'auto';
          
          // Show normal description and details
          const descElement = customCard.querySelector('.sample-type-card__description');
          const detailsElement = customCard.querySelector('.sample-type-card__details');
          if (descElement) descElement.style.display = 'block';
          if (detailsElement) detailsElement.style.display = 'block';
          
          // Hide warning if it exists
          const warningContainer = customCard.querySelector('.sample-type-warning');
          if (warningContainer) warningContainer.style.display = 'none';
        } else if (!garmentType || !fabricType) {
          // Price display removed - keeping selection functionality
          priceElement.textContent = '';
          // Keep card enabled but show pending state
          customCard.style.opacity = '0.7';
        } else if (customPrice === null) {
          // Custom not available for this fabric - disabled state
          priceElement.textContent = 'Not available';
          customCard.classList.remove('sample-type-card--disabled');
          customCard.classList.add('sample-type-card--warning');
          customCard.style.opacity = '0.85';
          customCard.style.pointerEvents = 'none';
        } else {
          // Price display removed - keeping selection functionality
          priceElement.textContent = '';
        }
      }
    }

  },

  // Update garment custom color restrictions based on fabric type
  updateGarmentFabricRestrictions: (garmentElement) => {
    if (!garmentElement) return;
    
    const garmentId = garmentElement?.dataset?.garmentId;
    const shouldRestrict = V10_Utils.shouldRestrictCustomColor(garmentElement);
    
    console.log(`🎨 Custom color restriction for garment ${garmentId}: ${shouldRestrict ? 'RESTRICTED' : 'ALLOWED'}`);
    
    // Handle compact selection widget structure
    const customSection = garmentElement.querySelector('#sample-custom-collapsed')?.closest('.compact-selection-section');
    
    if (customSection) {
      if (shouldRestrict) {
        // Disable custom color option using the same method as other validations
        customSection.classList.add('compact-selection-section--disabled');
        V10_GarmentStudio.getInstance().disableSelectionSection(customSection, 'Not available for this fabric');
        
        // Show the orange warning box for compact interface
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
                <p><strong>Custom colors not available for sampling on this fabric.</strong></p>
                <div class="swatch-exception">
                  <strong>Workflow:</strong> Assign lab dips to check colors in person, then we'll create a pre-production sample before committing to your bulk order.
                </div>
              </div>
            </div>
          `;
          // Insert the warning after the sample type selection container
          const sampleContainer = garmentElement.querySelector('.sample-type-selection');
          if (sampleContainer) {
            sampleContainer.appendChild(warningElement);
          }
        }
        warningElement.style.display = 'block';
        
        // Check if custom was selected and auto-switch to stock
        const customRadio = garmentElement.querySelector('input[name*="sampleType"][value="custom"]:checked');
        if (customRadio) {
          customRadio.checked = false;
          
          // Clear any sub-value data
          delete customRadio.dataset.subValue;
          
          // Try to select stock color option as fallback
          const stockRadio = garmentElement.querySelector('input[name*="sampleType"][value="stock"]');
          if (stockRadio) {
            stockRadio.checked = true;
            stockRadio.dispatchEvent(new Event('change', { bubbles: true }));
          }
          
          // Update garment state
          const garmentData = V10_State.garments.get(garmentId);
          if (garmentData) {
            garmentData.sampleType = 'stock';
            console.log(`🔄 Auto-switched to stock sample for garment ${garmentId} due to fabric restriction`);
          }
          
          // Reset display states using UI Manager
          V10_GarmentStudio.getInstance().uiManager.resetSampleTypeSelection(garmentElement);
        }
        
      } else {
        // Enable custom color option using the same method as other validations
        customSection.classList.remove('compact-selection-section--disabled');
        V10_GarmentStudio.getInstance().enableSelectionSection(customSection);
      }
    }
    
    // Find the custom color/custom sample sections within this garment (legacy support)
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
                <p><strong>Custom colors not available for sampling on this fabric.</strong></p>
                <div class="swatch-exception">
                  <strong>Workflow:</strong> Assign lab dips to check colors in person, then we'll create a pre-production sample before committing to your bulk order.
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
  },

  // Get Pantone color name from code using pantone-numbers.json
  getPantoneColorName: async (pantoneCode) => {
    try {
      // Cache the pantone database to avoid repeated fetches
      if (!window.V10_PANTONE_DATABASE) {
        try {
          const response = await fetch('/assets/pantone-numbers.json');
          if (!response.ok) {
            console.warn('Could not load Pantone database file, using fallback:', response.statusText);
            // Use basic fallback database for common colors
            window.V10_PANTONE_DATABASE = {
              "186": "#CE2029",
              "287": "#005CA7", 
              "355": "#009639",
              "Black 7": "#2B2926"
            };
          } else {
            window.V10_PANTONE_DATABASE = await response.json();
            console.log('✅ Pantone database loaded with', Object.keys(window.V10_PANTONE_DATABASE).length, 'colors');
          }
        } catch (error) {
          console.warn('Pantone database fetch failed, using minimal fallback:', error);
          window.V10_PANTONE_DATABASE = {};
        }
      }

      // Remove common prefixes/suffixes and normalize the code
      const normalizedCode = pantoneCode
        .replace(/^(PANTONE\s*)?/i, '')
        .replace(/\s*(TPX|TCX|C|U)$/i, '')
        .trim();

      // Look up the color in the database
      const colorData = window.V10_PANTONE_DATABASE[normalizedCode];
      if (colorData && colorData.name) {
        // Capitalize the name properly
        return colorData.name
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }

      // If not found, return the original code
      return pantoneCode;
    } catch (error) {
      console.warn('Error looking up Pantone color name:', error);
      return pantoneCode; // Return original code on error
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
        
        // CHECK EDIT MODE LOCK - BLOCK NAVIGATION IF LOCKED
        if (V10_State.editMode.isLocked) {
          console.log(`🚫 Navigation blocked: Edit mode is locked for garment ${V10_State.editMode.currentGarmentId}`);
          e.preventDefault();
          e.stopPropagation();
          this.handleBlockedNavigation('studio-tab', studio);
          return false;
        }
        
        this.switchStudio(studio);
      });
    });
  }

  switchStudio(studioName) {
    console.log(`🏗️ STUDIO SWITCH: Switching to "${studioName}" studio`);
    
    // Update state
    V10_State.currentStudio = studioName;
    console.log(`✅ V10_State.currentStudio set to: "${V10_State.currentStudio}"`);

    // Initialize mode for design studio
    if (studioName === 'design') {
      console.log('🎨 Design studio selected - initializing...');
      V10_State.currentMode = 'labdips'; // Default to labdips mode
      
      if (window.v10ColorStudio) {
        console.log('✅ v10ColorStudio found, switching mode to labdips');
        window.v10ColorStudio.switchMode('labdips');
      } else {
        console.warn('⚠️ v10ColorStudio not found');
      }
      
      // Color Studio initialized - TOUR button will be visible for manual guidance
    }

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
    
    // CONTROL TOUR BUTTON VISIBILITY - Color Studio + Garment Studio
    const colorTourButton = document.getElementById('color-studio-tour');
    const garmentTourButton = document.getElementById('garment-studio-tour');

    // Color Studio Tour Button - ONLY in Color Studio + Sample Request
    if (colorTourButton) {
      // ALWAYS HIDE FIRST
      colorTourButton.style.display = 'none !important';
      colorTourButton.style.visibility = 'hidden';

      // ONLY show if EXACTLY: Color Studio (design) AND Sample Request
      if (studioName === 'design' && V10_State.requestType === 'sample-request') {
        colorTourButton.style.display = 'block';
        colorTourButton.style.visibility = 'visible';
        console.log(`✅ COLOR TOUR button SHOWN: Color Studio + Sample Request`);
      } else {
        console.log(`🚫 COLOR TOUR button HIDDEN: studio="${studioName}", requestType="${V10_State.requestType}"`);
      }

      // Trigger first-time pulse if this is the first visit to Color Studio
      if (studioName === 'design' && V10_State.requestType === 'sample-request' && !localStorage.getItem('color-studio-tour-seen')) {
        this.triggerFirstTimeTourPulse();
      }
    }

    // Garment Studio Tour Button - ONLY in Garment Studio
    if (garmentTourButton) {
      // ALWAYS HIDE FIRST
      garmentTourButton.style.display = 'none !important';
      garmentTourButton.style.visibility = 'hidden';

      // ONLY show if EXACTLY: Garment Studio
      if (studioName === 'garment') {
        garmentTourButton.style.display = 'block';
        garmentTourButton.style.visibility = 'visible';
        console.log(`✅ GARMENT TOUR button SHOWN: Garment Studio`);
      } else {
        console.log(`🚫 GARMENT TOUR button HIDDEN: studio="${studioName}"`);
      }
    }

    // 🎯 DYNAMIC LAYOUT: Update step actions class based on visible tour buttons
    this.updateStepActionsLayout();

    // Special handling for quantity studio with debouncing
    if (studioName === 'quantities') {
      // Clear any existing timeout to debounce rapid switches
      if (this._quantityStudioTimeout) {
        clearTimeout(this._quantityStudioTimeout);
      }
      
      // Debounce quantity studio population to prevent rapid execution
      this._quantityStudioTimeout = setTimeout(() => {
        if (window.v10GarmentStudio && typeof window.v10GarmentStudio.populateQuantityStudio === 'function') {
          window.v10GarmentStudio.populateQuantityStudio();
        } else {
          console.warn('⚠️ Garment studio not available for quantity population');
        }
      }, 100); // 100ms debounce
    }

    // Update assignment section visibility based on current studio
    if (window.v10ReviewManager) {
      window.v10ReviewManager.populateGarmentAssignments();
    }

    // Auto-save

    console.log(`🎛️ Switched to ${studioName} studio`);
  }

  // Update step actions layout based on visible tour buttons
  updateStepActionsLayout() {
    const stepActions = document.querySelector('.v10-step-actions');
    if (!stepActions) return;

    // Get current step - try multiple methods
    let currentStep = 1;

    // Method 1: Check techPackProgress system
    if (window.techPackProgress && window.techPackProgress.currentStep) {
      currentStep = window.techPackProgress.currentStep;
    } else {
      // Method 2: Check visible step section
      const visibleStep = document.querySelector('.v10-techpack-step:not([style*="display: none"]) .techpack-progress[data-step]');
      if (visibleStep) {
        currentStep = parseInt(visibleStep.dataset.step) || 1;
      } else {
        // Method 3: Check specific step sections
        if (document.querySelector('#techpack-v10-step-1:not([style*="display: none"])')) currentStep = 1;
        else if (document.querySelector('#techpack-v10-step-2:not([style*="display: none"])')) currentStep = 2;
        else if (document.querySelector('#techpack-v10-step-3:not([style*="display: none"])')) currentStep = 3;
        else if (document.querySelector('#techpack-v10-step-4:not([style*="display: none"])')) currentStep = 4;
      }
    }

    // Count visible buttons in step actions
    const visibleButtons = Array.from(stepActions.querySelectorAll('.v10-btn')).filter(btn => {
      const style = window.getComputedStyle(btn);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });

    const visibleButtonCount = visibleButtons.length;

    // Apply layout based on visible button count and step context
    if (visibleButtonCount >= 3) {
      // 3+ buttons: Use three-button grid layout
      stepActions.classList.add('v10-step-actions--three-button');
      console.log(`✅ Applied three-button layout: ${visibleButtonCount} buttons visible on step ${currentStep}`);
    } else if (visibleButtonCount === 1 && currentStep === 1) {
      // Special case: Step 1 with only "Continue to Files" button should be right-aligned
      stepActions.classList.remove('v10-step-actions--three-button');
      // Ensure single button is right-aligned using flex
      stepActions.style.justifyContent = 'flex-end';
      console.log(`✅ Applied single-button right-align layout: step ${currentStep} with 1 button`);
    } else {
      // 2 buttons or other cases: Use default flex layout
      stepActions.classList.remove('v10-step-actions--three-button');
      stepActions.style.justifyContent = 'space-between';
      console.log(`✅ Applied two-button layout: ${visibleButtonCount} buttons visible on step ${currentStep}`);
    }
  }

  // Trigger first-time tour button pulse animation
  triggerFirstTimeTourPulse() {
    const tourButton = document.getElementById('color-studio-tour');
    if (tourButton) {
      console.log('🟠 Triggering first-time tour button pulse animation');
      
      // Add the pulse class immediately
      tourButton.classList.add('first-time-pulse');
      
      // Remove the pulse class after 3 seconds (animation runs 2 cycles of 1.5s each)
      setTimeout(() => {
        tourButton.classList.remove('first-time-pulse');
        console.log('⚫ First-time tour button pulse animation completed');
      }, 3000);
    } else {
      console.warn('⚠️ Could not find tour button for first-time pulse');
    }
  }

  // Handle blocked navigation attempts during edit mode
  handleBlockedNavigation(elementType, targetLocation) {
    // Increment blocked attempts counter
    V10_State.editMode.blockedAttempts++;
    
    console.log(`🚫 Blocked navigation attempt #${V10_State.editMode.blockedAttempts}: ${elementType} -> ${targetLocation}`);
    
    // Trigger finalize button attention animation
    this.triggerFinalizeButtonAttention();
    
    // Show user feedback (optional toast/notification)
    this.showEditModeBlockedFeedback(elementType, targetLocation);
  }

  // Trigger the premium red pulse animation on the finalize button
  triggerFinalizeButtonAttention() {
    if (!V10_State.editMode.currentGarmentId) return;
    
    const garmentCard = document.querySelector(`[data-garment-id="${V10_State.editMode.currentGarmentId}"]`);
    const finalizeBtn = garmentCard?.querySelector('.garment-card__finalize');
    
    if (finalizeBtn && finalizeBtn.style.display !== 'none') {
      // Add attention class for red pulse animation
      finalizeBtn.classList.add('garment-card__finalize--attention');
      
      // Remove class after animation completes (2 seconds)
      setTimeout(() => {
        finalizeBtn.classList.remove('garment-card__finalize--attention');
      }, 2000);
      
      console.log(`✨ Triggered finalize button attention animation for garment ${V10_State.editMode.currentGarmentId}`);
    }
  }

  // Show subtle user feedback when navigation is blocked
  showEditModeBlockedFeedback(elementType, targetLocation) {
    // Create or update a subtle notification
    let notification = document.getElementById('edit-mode-notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'edit-mode-notification';
      notification.className = 'edit-mode-notification';
      document.body.appendChild(notification);
    }
    
    // Set notification content
    notification.innerHTML = `
      <div class="notification-content">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        <span>Please finalize your current garment to continue</span>
      </div>
    `;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
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
        'bulk-order-request': ''
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

// ==============================================
// NEW SIMPLIFIED QUANTITY STUDIO MANAGER
// ==============================================

class V10_QuantityStudioManager {
  constructor() {
    this.initialized = false;
    this.garments = new Map();
    this.minimums = {
      't-shirt': { single: 100, multi: 75 },
      'shirt': { single: 75, multi: 50 },
      'hoodie': { single: 75, multi: 50 },
      'sweatshirt': { single: 75, multi: 50 },
      'polo': { single: 100, multi: 75 },
      'tank-top': { single: 100, multi: 75 },
      'joggers': { single: 75, multi: 50 },
      'shorts': { single: 75, multi: 50 },
      'pants': { single: 75, multi: 50 },
      'jacket': { single: 50, multi: 40 },
      'default': { single: 75, multi: 50 }
    };
    
    // Color presets removed - no longer needed
    
    // Note: Don't load state in constructor - wait for initialize()
  }
  
  loadSavedState() {
    try {
      const saved = sessionStorage.getItem('v10_quantity_studio_state');
      if (saved) {
        const state = JSON.parse(saved);
        console.log('📦 Loading saved quantity studio state');
        
        // Clear existing and restore from saved state
        this.garments.clear();
        
        // Restore garments with colorways
        if (state.garments) {
          state.garments.forEach(garmentData => {
            const garmentState = {
              ...garmentData,
              colorways: new Map()
            };
            
            // Restore colorways with their quantities
            if (garmentData.colorways && Array.isArray(garmentData.colorways)) {
              garmentData.colorways.forEach(colorway => {
                // Ensure quantities object exists
                if (!colorway.quantities) {
                  colorway.quantities = {};
                }
                garmentState.colorways.set(colorway.id, colorway);
              });
            }
            
            this.garments.set(garmentData.id, garmentState);
            console.log(`  Restored garment ${garmentData.id}: ${garmentState.colorways.size} colorways, ${garmentData.total} units`);
          });
        }
        
        console.log(`📦 Restored ${this.garments.size} garments from saved state`);
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
  }
  
  saveState() {
    try {
      const state = {
        garments: []
      };
      
      this.garments.forEach((garment, id) => {
        const garmentData = {
          ...garment,
          activeColorwayId: garment.activeColorwayId,
          colorways: Array.from(garment.colorways.entries()).map(([cwId, cw]) => ({
            id: cwId,
            ...cw
          }))
        };
        state.garments.push(garmentData);
      });
      
      sessionStorage.setItem('v10_quantity_studio_state', JSON.stringify(state));
      console.log('💾 Saved quantity studio state');
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }
  
  initialize() {
    // Make this idempotent - safe to call multiple times
    if (this.initialized) {
      console.log('♻️ V10 Quantity Studio Manager already initialized, refreshing view...');
      // IMPORTANT: Reload garments from V10_State but preserve colorways/quantities
      this.loadGarments();
      this.renderAllGarments();
      this.updateStats();
      return;
    }
    
    console.log('🚀 Initializing V10 Quantity Studio Manager');
    
    // Set up modal first
    this.setupColorPickerModal();
    
    // Load garments first to get the structure
    this.loadGarments();
    
    // Then merge with any saved state (this will add colorways/quantities to existing garments)
    this.mergeSavedState();
    
    // Update statistics
    this.updateStats();
    
    // Render all garments with their colorways
    this.renderAllGarments();
    
    this.initialized = true;
    console.log('✅ V10 Quantity Studio Manager initialized successfully');
  }
  
  mergeSavedState() {
    try {
      const saved = sessionStorage.getItem('v10_quantity_studio_state');
      if (saved) {
        const state = JSON.parse(saved);
        console.log('📦 Merging saved quantity studio state');
        
        // Merge saved state with current garments
        if (state.garments) {
          state.garments.forEach(savedGarment => {
            const currentGarment = this.garments.get(savedGarment.id);
            if (currentGarment) {
              // Merge colorways
              if (savedGarment.colorways && Array.isArray(savedGarment.colorways)) {
                savedGarment.colorways.forEach(colorway => {
                  if (!colorway.quantities) {
                    colorway.quantities = {};
                  }
                  currentGarment.colorways.set(colorway.id, colorway);
                });
              }
              
              // Update total
              currentGarment.total = savedGarment.total || 0;
              
              // Restore active colorway ID
              currentGarment.activeColorwayId = savedGarment.activeColorwayId || null;
              
              console.log(`  Merged state for garment ${savedGarment.id}: ${currentGarment.colorways.size} colorways`);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error merging saved state:', error);
    }
  }
  
  
  loadGarments() {
    // IMPORTANT: Save existing colorways and quantities BEFORE clearing
    const existingData = new Map();
    this.garments.forEach((garment, id) => {
      // Save data for all garments, not just those with colorways
      existingData.set(id, {
        colorways: garment.colorways || new Map(),
        total: garment.total || 0,
        activeColorwayId: garment.activeColorwayId
      });
    });
    
    // Now safe to clear
    this.garments.clear();
    
    console.log('📦 Loading garments from V10_State:', V10_State.garments.size);
    console.log('📦 Preserving data for:', existingData.size, 'garments');
    
    V10_State.garments.forEach((garment, id) => {
      console.log(`  Checking garment ${id}:`, {
        type: garment.type,
        fabricType: garment.fabricType,
        sampleReference: garment.sampleReference
      });
      
      // Only require type to be set - fabric/sample can be added later
      if (garment.type) {
        // Get preserved data for this garment
        const preserved = existingData.get(id);
        
        const garmentData = {
          ...garment,
          colorways: preserved?.colorways || new Map(),
          quantities: {},
          total: preserved?.total || 0,
          activeColorwayId: preserved?.activeColorwayId || null
        };
        
        // Recalculate total from colorways if we have them
        if (garmentData.colorways.size > 0) {
          let recalculatedTotal = 0;
          garmentData.colorways.forEach(colorway => {
            if (colorway.quantities) {
              colorway.subtotal = Object.values(colorway.quantities).reduce((sum, q) => sum + q, 0);
              recalculatedTotal += colorway.subtotal;
            }
          });
          garmentData.total = recalculatedTotal;
        }
        
        // Check if design reference should be enabled
        if (garment.sampleReference && garment.sampleReference.toLowerCase().includes('design')) {
          garmentData.requiresDesignReference = true;
        }
        
        this.garments.set(id, garmentData);
        console.log(`  ✅ Added garment ${id} to quantity studio (${garmentData.colorways.size} colorways, ${garmentData.total} units)`);
      } else {
        console.log(`  ❌ Skipped garment ${id} - no type set`);
      }
    });
    
    console.log(`📊 Loaded ${this.garments.size} garments into quantity studio`);
  }
  
  restoreQuantityData() {
    // Recalculate totals from existing colorways
    this.garments.forEach((garment, garmentId) => {
      let garmentTotal = 0;
      garment.colorways.forEach(colorway => {
        if (colorway.quantities) {
          colorway.subtotal = Object.values(colorway.quantities).reduce((sum, q) => sum + q, 0);
          garmentTotal += colorway.subtotal;
        }
      });
      garment.total = garmentTotal;
    });
  }
  
  calculateGarmentMinimum(garmentType, colorwayCount) {
    const type = garmentType?.toLowerCase() || 'default';
    const minimums = this.minimums[type] || this.minimums.default;
    
    // If no colorways, show single minimum
    if (colorwayCount === 0) {
      return minimums.single;
    } else if (colorwayCount === 1) {
      return minimums.single;
    } else {
      // Multiple colorways: total is multi * count
      return minimums.multi * colorwayCount;
    }
  }
  
  // Get the minimum required PER colorway (not total)
  getPerColorwayMinimum(garmentType, colorwayCount) {
    const type = garmentType?.toLowerCase() || 'default';
    const minimums = this.minimums[type] || this.minimums.default;
    
    if (colorwayCount <= 1) {
      return minimums.single;
    } else {
      return minimums.multi;
    }
  }
  
  // Check if ALL colorways meet their individual minimums
  checkColorwaysSufficient(garmentId) {
    const garment = this.garments.get(garmentId);
    if (!garment || !garment.colorways || garment.colorways.size === 0) {
      return false;
    }
    
    const perColorwayMin = this.getPerColorwayMinimum(garment.type, garment.colorways.size);
    
    // Check if EVERY colorway meets the minimum
    let allSufficient = true;
    garment.colorways.forEach(colorway => {
      if (!colorway.subtotal || colorway.subtotal < perColorwayMin) {
        allSufficient = false;
      }
    });
    
    return allSufficient;
  }
  
  calculateTotalMinimum() {
    let total = 0;
    this.garments.forEach(garment => {
      const colorwayCount = garment.colorways?.size || 0;
      if (colorwayCount > 0) {
        total += this.calculateGarmentMinimum(garment.type, colorwayCount);
      }
    });
    return total;
  }
  
  calculateTotalUnits() {
    let total = 0;
    this.garments.forEach(garment => {
      total += garment.total || 0;
    });
    return total;
  }
  
  checkAllStudiosComplete() {
    // Check garment studio
    const garmentStudioTab = document.getElementById('garment-studio-tab');
    const garmentStudioComplete = garmentStudioTab?.classList.contains('studio-tab--complete') || false;
    
    // Check quantity studio
    const quantityStudioTab = document.getElementById('quantities-studio-tab');
    const quantityStudioComplete = quantityStudioTab?.classList.contains('studio-tab--complete') || false;
    
    // Find the proceed button (FIXED SELECTOR to match actual HTML)
    const nextBtn = document.getElementById('step-3-next');
    
    if (nextBtn && garmentStudioComplete && quantityStudioComplete) {
      // Both studios complete - enable proceed to Step 4
      nextBtn.classList.remove('v10-btn--disabled');
      nextBtn.disabled = false;
      nextBtn.innerHTML = `
        Proceed to Review & Submit
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      `;
    } else if (nextBtn) {
      // Not all complete - show what needs completion
      nextBtn.classList.add('v10-btn--disabled');
      nextBtn.disabled = true;
      nextBtn.innerHTML = `
        Complete all garments
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      `;
    }
  }
  
  updateQuantityStudioTabStatus() {
    const quantityTab = document.getElementById('quantities-studio-tab');
    if (!quantityTab) return;
    
    const subtitleElement = quantityTab.querySelector('.studio-tab__subtitle');
    if (!subtitleElement) return;
    
    // Check all garments in quantity studio
    let totalGarments = 0;
    let completeGarments = 0;
    
    this.garments.forEach((garment, garmentId) => {
      totalGarments++;
      if (this.checkColorwaysSufficient(garmentId)) {
        completeGarments++;
      }
    });
    
    if (totalGarments === 0) {
      subtitleElement.textContent = 'Set quantities';
      quantityTab.classList.remove('studio-tab--complete', 'studio-tab--incomplete');
    } else if (completeGarments === totalGarments) {
      subtitleElement.textContent = `Complete (${totalGarments} garments)`;
      quantityTab.classList.add('studio-tab--complete');
      quantityTab.classList.remove('studio-tab--incomplete');
    } else {
      subtitleElement.textContent = `Incomplete (${completeGarments}/${totalGarments})`;
      quantityTab.classList.add('studio-tab--incomplete');
      quantityTab.classList.remove('studio-tab--complete');
    }
    
    // Also check if we should enable Step 4
    this.checkAllStudiosComplete();
  }
  
  updateStats() {
    const totalUnits = this.calculateTotalUnits();
    const totalMinimum = this.calculateTotalMinimum();
    const garmentCount = this.garments.size;
    let colorwayCount = 0;
    
    this.garments.forEach(garment => {
      colorwayCount += garment.colorways?.size || 0;
    });
    
    // Check if quantities are sufficient
    const isSufficient = totalUnits >= totalMinimum && totalMinimum > 0 && colorwayCount > 0;
    
    console.log(`📈 Updating stats: ${totalUnits}/${totalMinimum} units (${isSufficient ? 'SUFFICIENT' : 'INSUFFICIENT'})`);
    
    // Update DOM - try multiple element IDs for compatibility
    const unitsEl = document.getElementById('v10-total-units') || 
                   document.querySelector('.total-units-value');
    const garmentsEl = document.getElementById('v10-total-garments') || 
                      document.querySelector('.total-garments-value');
    const colorwaysEl = document.getElementById('v10-total-colorways') || 
                       document.querySelector('.total-colorways-value');
    const minEl = document.getElementById('v10-min-required') || 
                 document.querySelector('.min-required-value');
    
    if (unitsEl) {
      unitsEl.textContent = totalUnits;
      if (isSufficient) {
        unitsEl.classList.add('sufficient');
        unitsEl.classList.remove('insufficient');
      } else {
        unitsEl.classList.remove('sufficient');
        unitsEl.classList.add('insufficient');
      }
    }
    
    if (garmentsEl) {
      garmentsEl.textContent = garmentCount;
    }
    
    if (colorwaysEl) {
      colorwaysEl.textContent = colorwayCount;
    }
    
    if (minEl) {
      minEl.textContent = totalMinimum;
      if (isSufficient) {
        minEl.classList.add('sufficient');
        minEl.classList.remove('insufficient');
      } else {
        minEl.classList.remove('sufficient');
        minEl.classList.add('insufficient');
      }
    }
    
    console.log(`📊 Stats Updated: ${totalUnits}/${totalMinimum} units, ${garmentCount} garments, ${colorwayCount} colorways`);
  }
  
  renderAllGarments() {
    const container = document.getElementById('responsive-garment-grid');
    if (!container) return;
    
    // Save active colorway tabs before clearing
    const activeColorwayTabs = new Map();
    this.garments.forEach((garment, id) => {
      const activeTab = document.querySelector(`#tabs-${id} .v10-colorway-tab.active`);
      if (activeTab) {
        activeColorwayTabs.set(id, activeTab.dataset.colorwayId);
        console.log(`💾 Saving active tab for garment ${id}: ${activeTab.dataset.colorwayId}`);
      }
    });
    
    container.innerHTML = '';
    
    if (this.garments.size === 0) {
      container.innerHTML = '<div class="quantities-instructions">Complete garment specifications to set quantities</div>';
      return;
    }
    
    let garmentIndex = 1;
    this.garments.forEach((garment, id) => {
      const card = this.createGarmentCard(garment, id, garmentIndex++);
      container.appendChild(card);
      
      // After adding the card, render its colorways if any exist
      if (garment.colorways && garment.colorways.size > 0) {
        setTimeout(() => {
          this.renderColorways(id);
          // Restore previously active tab or use saved activeColorwayId or use first
          const activeId = activeColorwayTabs.get(id) || garment.activeColorwayId || garment.colorways.keys().next().value;
          if (activeId && garment.colorways.has(activeId)) {
            // Update the garment's activeColorwayId to persist it
            garment.activeColorwayId = activeId;
            this.switchColorwayTab(id, activeId);
          }
        }, 0);
      }
    });
    
    console.log(`📊 Rendered ${this.garments.size} garment(s) in Quantity Studio`);
  }
  
  createGarmentCard(garment, garmentId, index) {
    const div = document.createElement('div');
    div.className = 'v10-quantity-garment-full';
    div.dataset.garmentId = garmentId;
    
    const colorwayCount = garment.colorways?.size || 0;
    const minimum = this.calculateGarmentMinimum(garment.type, colorwayCount);
    const isSufficient = this.checkColorwaysSufficient(garmentId);
    
    if (isSufficient) {
      div.classList.add('garment-quantity-card--complete');
    }
    
    // Determine what to show: fabric or sample reference
    const subtitle = garment.sampleReference || garment.fabricType || 'with-design-applied';
    
    // Unified professional dark layout with cohesive structure
    div.innerHTML = `
      <!-- Header Section with background -->
      <div style="
        background: rgba(255,255,255,0.03);
        padding: 20px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      ">
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div>
            <div style="font-size: 16px; font-weight: 600; color: #ffffff; margin-bottom: 4px;">
              Garment ${index} - <span style="color: #10b981;">${garment.type}</span>
            </div>
            <div style="font-size: 13px; color: rgba(255,255,255,0.6);">${subtitle}</div>
          </div>
          ${isSufficient ? '<div class="header-complete-badge" style="padding: 4px 12px; background: rgba(16,185,129,0.1); border: 1px solid #10b981; color: #10b981; font-size: 11px; font-weight: 600; text-transform: uppercase;">✓ Complete</div>' : ''}
        </div>
      </div>
      
      <!-- Main Content Area -->
      <div style="padding: 20px;">
        <div class="v10-colorway-section">
          ${colorwayCount === 0 ? `
            <!-- Full-width button when no colorways -->
            <button type="button" 
                    class="v10-add-colorway-btn-full" 
                    onclick="window.v10QuantityStudio.showColorPicker('${garmentId}')" 
                    style="
                      width: 100%;
                      padding: 16px;
                      background: transparent;
                      border: 2px dashed rgba(255,255,255,0.3);
                      color: rgba(255,255,255,0.9);
                      font-size: 14px;
                      font-weight: 600;
                      cursor: pointer;
                      transition: all 0.2s;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      gap: 12px;
                    "
                    onmouseover="this.style.borderColor='#10b981'; this.style.color='#10b981'; this.style.background='rgba(16,185,129,0.05)';"
                    onmouseout="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.color='rgba(255,255,255,0.9)'; this.style.background='transparent';">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Colorway to Set Quantities
            </button>
          ` : `
            <!-- Tabs when colorways exist -->
            <div class="v10-colorway-tabs-container">
              <div class="v10-colorway-tabs" id="tabs-${garmentId}">
                <!-- Colorway tabs will be added here -->
              </div>
              <button type="button" class="v10-add-colorway-tab" onclick="window.v10QuantityStudio.showColorPicker('${garmentId}')" title="Add colorway" style="margin-left: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink: 0;">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span style="display: inline-block;">Add Colorway</span>
              </button>
            </div>
          `}
          
          <div class="v10-colorways-content" id="colorways-${garmentId}" style="${colorwayCount === 0 ? 'display: none;' : ''}">
            <!-- Colorway content will be added here -->
          </div>
        </div>
      </div>
      
      <!-- Footer Section -->
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-top: 1px solid rgba(255,255,255,0.08);
        background: rgba(0,0,0,0.3);
      ">
        <div style="
          font-size: 14px;
          color: rgba(255,255,255,0.7);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 12px;
        ">
          <span>TOTAL:</span>
          <span style="font-size: 20px; font-weight: 700; color: ${isSufficient ? '#10b981' : '#ffffff'};" id="footer-total-${garmentId}">${garment.total || 0}</span>
          <span style="color: rgba(255,255,255,0.5);">/</span>
          <span style="color: #f59e0b; font-weight: 600;" id="footer-min-${garmentId}">${minimum} MIN</span>
        </div>
        <span id="footer-status-${garmentId}" style="padding: 4px 12px; background: ${isSufficient ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}; border: 1px solid ${isSufficient ? '#10b981' : '#ef4444'}; color: ${isSufficient ? '#10b981' : '#ef4444'}; font-size: 12px; font-weight: 600;">${isSufficient ? '✓ SUFFICIENT' : '✗ INSUFFICIENT'}</span>
      </div>
    `;
    
    // After creating, render existing colorways
    if (colorwayCount > 0) {
      setTimeout(() => {
        this.renderColorways(garmentId);
      }, 0);
    }
    
    return div;
  }
  
  setupColorPickerModal() {
    // Check if modal already exists
    let modal = document.getElementById('v10-color-picker-modal');
    if (!modal) {
      // Create modal HTML
      modal = document.createElement('div');
      modal.id = 'v10-color-picker-modal';
      modal.className = 'v10-modal-overlay';
      modal.style.display = 'none';
      modal.innerHTML = `
        <div class="v10-modal-content v10-color-picker-content" style="background: #1a1a1a !important; max-width: 500px;">
          <div class="v10-modal-header" style="background: #252525; padding: 20px; border-bottom: 1px solid #404040;">
            <h2 style="color: #ffffff;">Add Colorway</h2>
            <button type="button" class="v10-modal-close" onclick="window.v10QuantityStudio.closeColorPicker()" style="background: #333333; padding: 8px; border-radius: 0;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="v10-modal-body" style="padding: 24px; background: #1a1a1a;">
            <!-- Required: Pantone/Lab-Dip Code -->
            <div style="margin-bottom: 24px;">
              <h3 style="color: #10b981; font-size: 14px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px;">
                Step 1: Enter Pantone/Lab-Dip Code (Required)
              </h3>
              <div style="background: #0f0f0f; border: 1px solid #2a2a2a; border-radius: 0; padding: 16px;">
                <input type="text" 
                       id="v10-color-code" 
                       placeholder="e.g., 19-4005 TPX, TCX-2134, or LAB-001"
                       style="width: 100%; padding: 12px; background: #1a1a1a; border: 2px solid #404040; border-radius: 0; color: #fff; font-size: 14px;"
                       oninput="window.v10QuantityStudio.checkBothFieldsFilled()">
                <p style="color: #888; font-size: 12px; margin-top: 8px;">
                  Enter the official Pantone TPX/TCX code or your Lab-Dip reference code
                </p>
              </div>
            </div>
            
            <!-- Required: Color Selection -->
            <div>
              <h3 style="color: #10b981; font-size: 14px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px;">
                Step 2: Select Color (Required)
              </h3>
              
              <div style="background: #0f0f0f; border: 1px solid #2a2a2a; border-radius: 8px; padding: 20px;">
                <div style="display: flex; align-items: center; gap: 20px;">
                  <input type="color" 
                         id="v10-visual-color-picker" 
                         value="#808080"
                         style="width: 100px; height: 100px; border: 2px solid #404040; border-radius: 0; cursor: pointer; background: transparent;"
                         oninput="window.v10QuantityStudio.updateVisualColorDisplay(this.value); window.v10QuantityStudio.checkBothFieldsFilled()">
                  <div style="flex: 1;">
                    <div id="v10-visual-color-display" 
                         style="padding: 12px 20px; background: #808080; color: #fff; border-radius: 0; font-weight: 600; margin-bottom: 12px; text-align: center; font-size: 14px;">
                      Click to select color
                    </div>
                    <p style="color: #888; font-size: 13px;">
                      Visual reference for digital display only
                    </p>
                  </div>
                </div>
              </div>
              
              <p style="color: #666; font-size: 11px; margin-top: 16px; padding: 12px; background: #0f0f0f; border-radius: 0; border-left: 3px solid #f59e0b;">
                <strong>Note:</strong> Both Pantone code and color selection are required. The visual color helps with digital representation while the Pantone code ensures accurate production matching.
              </p>
            </div>
            
            <!-- Action Buttons -->
            <div style="display: flex; gap: 12px; margin-top: 24px;">
              <button type="button" 
                      class="v10-btn v10-btn--secondary" 
                      onclick="window.v10QuantityStudio.closeColorPicker()"
                      style="flex: 1; padding: 14px; background: #2a2a2a; color: #9ca3af; border: 1px solid #404040; border-radius: 0; font-weight: 700;">
                Cancel
              </button>
              <button type="button" 
                      id="apply-colorway-btn"
                      class="v10-btn v10-btn--primary" 
                      onclick="window.v10QuantityStudio.applyColorway()"
                      disabled
                      style="flex: 1; padding: 14px; background: #6b7280; color: #ffffff; border: none; border-radius: 0; font-weight: 700; cursor: not-allowed;">
                Add Colorway
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
  }
  
  checkBothFieldsFilled() {
    const codeInput = document.getElementById('v10-color-code');
    const colorPicker = document.getElementById('v10-visual-color-picker');
    const applyBtn = document.getElementById('apply-colorway-btn');
    
    // Check if both fields are filled
    const hasCode = codeInput && codeInput.value.trim().length > 0;
    const hasColor = colorPicker && colorPicker.value !== '#808080';
    
    if (applyBtn) {
      if (hasCode && hasColor) {
        // Enable button when both fields are filled
        applyBtn.disabled = false;
        applyBtn.style.background = '#10b981';
        applyBtn.style.cursor = 'pointer';
      } else {
        // Disable button if either field is missing
        applyBtn.disabled = true;
        applyBtn.style.background = '#6b7280';
        applyBtn.style.cursor = 'not-allowed';
      }
    }
  }
  
  updateVisualColorDisplay(hex) {
    const display = document.getElementById('v10-visual-color-display');
    if (display) {
      display.textContent = 'Color Selected ✓';
      display.style.background = hex;
      // Ensure text is readable on any background
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 255;
      const g = (rgb >> 8) & 255;
      const b = rgb & 255;
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      display.style.color = brightness > 128 ? '#000' : '#fff';
    }
    this.selectedVisualColor = hex;
  }
  
  
  applyColorway() {
    const codeInput = document.getElementById('v10-color-code');
    const colorPicker = document.getElementById('v10-visual-color-picker');
    
    // Validate both fields are filled
    if (!this.currentGarmentId || !codeInput?.value.trim() || !colorPicker?.value) {
      console.error('Cannot apply colorway: missing required fields');
      return;
    }
    
    const code = codeInput.value.trim().toUpperCase();
    const color = colorPicker.value;
    
    // Make sure we're not using default grey
    if (color === '#808080') {
      alert('Please select a color before adding the colorway');
      return;
    }
    
    this.addColorway(this.currentGarmentId, {
      name: code,
      color: color,
      pantone: code
    });
    
    // Reset modal inputs
    codeInput.value = '';
    colorPicker.value = '#808080';
    const display = document.getElementById('v10-visual-color-display');
    if (display) {
      display.textContent = 'Click to select color';
      display.style.background = '#808080';
      display.style.color = '#fff';
    }
    
    this.closeColorPicker();
  }
  
  
  showColorPicker(garmentId) {
    this.currentGarmentId = garmentId;
    const modal = document.getElementById('v10-color-picker-modal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }
  
  closeColorPicker() {
    const modal = document.getElementById('v10-color-picker-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
    
    // Clear custom inputs
    const nameInput = document.getElementById('v10-custom-color-name');
    const hexInput = document.getElementById('v10-custom-color-hex');
    if (nameInput) nameInput.value = '';
    if (hexInput) hexInput.value = '';
  }
  
  
  addColorway(garmentId, colorwayData) {
    const garment = this.garments.get(garmentId);
    if (!garment) {
      console.error(`Garment ${garmentId} not found`);
      return;
    }
    
    const colorwayId = `colorway-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    garment.colorways.set(colorwayId, {
      ...colorwayData,
      quantities: {},
      subtotal: 0,
      designReference: ''
    });
    
    console.log(`✅ Added colorway ${colorwayData.name} to garment ${garmentId}`);
    
    // Update the UI immediately
    this.updateColorwayUI(garmentId);
    
    // Save state
    this.saveState();
  }
  
  updateColorwayUI(garmentId) {
    const garment = this.garments.get(garmentId);
    if (!garment) return;
    
    // Check if we're in the quantity studio view
    const quantityStudioContainer = document.getElementById('quantities-studio');
    const isQuantityView = quantityStudioContainer && quantityStudioContainer.style.display !== 'none';
    
    // Always try to update the garment card if it exists
    const garmentCard = document.querySelector(`.v10-quantity-garment-full[data-garment-id="${garmentId}"]`);
    
    if (garmentCard) {
      const hasColorways = garment.colorways && garment.colorways.size > 0;
      
      // If this is the first colorway, we need to replace the full-width button with tabs
      if (hasColorways && garmentCard.querySelector('.v10-add-colorway-btn-full')) {
        const colorwaySection = garmentCard.querySelector('.v10-colorway-section');
        if (colorwaySection) {
          // Replace the full-width button with tabs structure
          colorwaySection.innerHTML = `
            <div class="v10-colorway-tabs-container">
              <div class="v10-colorway-tabs" id="tabs-${garmentId}">
                <!-- Colorway tabs will be added here -->
              </div>
              <button type="button" class="v10-add-colorway-tab" onclick="window.v10QuantityStudio.showColorPicker('${garmentId}')" title="Add colorway" style="margin-left: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink: 0;">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span style="display: inline-block;">Add Colorway</span>
              </button>
            </div>
            <div class="v10-colorways-content" id="colorways-${garmentId}">
              <!-- Colorway content will be added here -->
            </div>
          `;
        }
      }
      
      // Show the colorways content container when colorways exist
      const colorwaysContent = document.getElementById(`colorways-${garmentId}`);
      if (colorwaysContent && hasColorways) {
        colorwaysContent.style.display = '';
      }
      
      // Re-render the colorways
      this.renderColorways(garmentId);
      
      // Make sure the first or newest colorway is active
      if (hasColorways) {
        // Get the newest colorway (last one added)
        const colorwayIds = Array.from(garment.colorways.keys());
        const activeColorwayId = colorwayIds[colorwayIds.length - 1];
        this.switchColorwayTab(garmentId, activeColorwayId);
      }
      
      // Update the garment footer totals
      this.updateGarmentTotals(garmentId);
    } else if (isQuantityView) {
      // Card doesn't exist but we're in quantity view - might need to re-render all
      console.log(`⚠️ Garment card not found for ${garmentId} in quantity view, triggering full refresh`);
      this.renderAllGarments();
    }
    
    // Update statistics
    this.updateStats();
    
    console.log(`🔄 Updated UI for garment ${garmentId} (View: ${isQuantityView ? 'Quantity' : 'Other'}, Card: ${!!garmentCard})`);
  }
  
  renderColorways(garmentId) {
    const garment = this.garments.get(garmentId);
    if (!garment) return;
    
    // Use stored active colorway ID or fall back to current DOM or first
    const currentActiveTab = document.querySelector(`#tabs-${garmentId} .v10-colorway-tab.active`);
    const activeColorwayId = garment.activeColorwayId || currentActiveTab?.dataset?.colorwayId;
    
    // Update tabs
    const tabsContainer = document.getElementById(`tabs-${garmentId}`);
    if (tabsContainer) {
      tabsContainer.innerHTML = '';
      let tabIndex = 0;
      let hasSetActive = false;
      
      garment.colorways.forEach((colorway, colorwayId) => {
        const tab = document.createElement('button');
        tab.className = 'v10-colorway-tab';
        tab.dataset.colorwayId = colorwayId;
        
        // Preserve active tab if it exists, otherwise set first as active
        if (activeColorwayId === colorwayId) {
          tab.classList.add('active');
          hasSetActive = true;
          // Store it if it wasn't already stored
          if (!garment.activeColorwayId) {
            garment.activeColorwayId = colorwayId;
          }
        } else if (tabIndex === 0 && !hasSetActive) {
          tab.classList.add('active');
          hasSetActive = true;
          garment.activeColorwayId = colorwayId;
        }
        
        // Check if this colorway meets minimum
        const perColorwayMin = this.getPerColorwayMinimum(garment.type, garment.colorways.size);
        const isSufficient = colorway.subtotal >= perColorwayMin;
        
        // Enhanced tab with color background and better styling
        tab.style.background = `linear-gradient(135deg, ${colorway.color}22, ${colorway.color}11)`;
        tab.style.borderLeft = `3px solid ${colorway.color}`;
        tab.style.minWidth = '180px';
        tab.style.position = 'relative';
        
        tab.innerHTML = `
          <div class="v10-colorway-tab-content" style="display: flex; align-items: center; gap: 10px; width: 100%;">
            <div class="v10-colorway-tab-color-indicator" style="
              width: 24px; 
              height: 24px; 
              border-radius: 0; 
              background-color: ${colorway.color};
              border: 2px solid rgba(255,255,255,0.2);
              flex-shrink: 0;
            "></div>
            <div class="v10-colorway-tab-info" style="flex: 1; text-align: left;">
              <div class="v10-colorway-tab-name" style="font-weight: 600; font-size: 12px;">${colorway.name}</div>
              <div class="v10-colorway-tab-count" style="
                font-size: 11px; 
                opacity: 0.8;
                color: ${isSufficient ? '#00ff88' : '#ff6b6b'};
              ">${colorway.subtotal} / ${perColorwayMin} units</div>
            </div>
            <button type="button" class="v10-colorway-tab-remove" style="
              position: absolute;
              top: -6px;
              right: -6px;
              width: 20px;
              height: 20px;
              background: #ef4444;
              border: 2px solid #1a1a1a;
              border-radius: 0;
              padding: 0;
              cursor: pointer;
              display: none;
              align-items: center;
              justify-content: center;
              color: white;
            " onclick="event.stopPropagation(); window.v10QuantityStudio.removeColorway('${garmentId}', '${colorwayId}')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        `;
        
        // Show/hide remove button on hover
        tab.onmouseenter = () => {
          const removeBtn = tab.querySelector('.v10-colorway-tab-remove');
          if (removeBtn) removeBtn.style.display = 'flex';
        };
        tab.onmouseleave = () => {
          const removeBtn = tab.querySelector('.v10-colorway-tab-remove');
          if (removeBtn) removeBtn.style.display = 'none';
        };
        
        tab.onclick = (e) => {
          if (!e.target.closest('.v10-colorway-tab-remove')) {
            this.switchColorwayTab(garmentId, colorwayId);
          }
        };
        
        tabsContainer.appendChild(tab);
        tabIndex++;
      });
    }
    
    // Render active colorway content (preserve selection)
    const activeId = garment.activeColorwayId || Array.from(garment.colorways.keys())[0];
    if (activeId) {
      this.renderColorwayContent(garmentId, activeId);
    }
  }
  
  switchColorwayTab(garmentId, colorwayId) {
    // Update active tab with enhanced visual feedback
    const tabs = document.querySelectorAll(`#tabs-${garmentId} .v10-colorway-tab`);
    const garment = this.garments.get(garmentId);
    
    // Store the active colorway ID for persistence
    if (garment) {
      garment.activeColorwayId = colorwayId;
      this.saveState(); // Save to session storage immediately
    }
    
    tabs.forEach(tab => {
      const isActive = tab.dataset.colorwayId === colorwayId;
      tab.classList.toggle('active', isActive);
      
      // Enhanced active state styling
      if (isActive) {
        const colorway = garment?.colorways.get(colorwayId);
        if (colorway) {
          tab.style.background = `linear-gradient(135deg, ${colorway.color}33, ${colorway.color}22)`;
          tab.style.borderLeft = `4px solid ${colorway.color}`;
          tab.style.boxShadow = `0 2px 8px ${colorway.color}33`;
          tab.style.transform = 'scale(1.02)';
        }
      } else {
        const tabColorwayId = tab.dataset.colorwayId;
        const colorway = garment?.colorways.get(tabColorwayId);
        if (colorway) {
          tab.style.background = `linear-gradient(135deg, ${colorway.color}22, ${colorway.color}11)`;
          tab.style.borderLeft = `3px solid ${colorway.color}`;
          tab.style.boxShadow = 'none';
          tab.style.transform = 'scale(1)';
        }
      }
    });
    
    // Render content for selected colorway
    this.renderColorwayContent(garmentId, colorwayId);
  }
  
  renderColorwayContent(garmentId, colorwayId) {
    const garment = this.garments.get(garmentId);
    if (!garment) return;
    
    const colorway = garment.colorways.get(colorwayId);
    if (!colorway) return;
    
    const container = document.getElementById(`colorways-${garmentId}`);
    if (!container) return;
    
    const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
    
    container.innerHTML = `
      <div class="v10-colorway-content-wrapper">
        ${garment.requiresDesignReference ? `
          <div class="v10-design-reference-section">
            <label class="v10-design-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              Design Reference Name
            </label>
            <input type="text" 
                   class="v10-design-reference-input" 
                   placeholder="Enter design name or code for this colorway"
                   value="${colorway.designReference || ''}"
                   onchange="window.v10QuantityStudio.updateDesignReference('${garmentId}', '${colorwayId}', this.value)">
          </div>
        ` : ''}
        
        <div class="v10-size-inputs-row">
          ${sizes.map(size => `
            <div class="v10-size-input-wrapper">
              <div class="v10-size-color-indicator" style="background-color: ${colorway.color}"></div>
              <label class="v10-size-label">${size}</label>
              <input type="number" 
                     class="v10-size-input" 
                     value="${colorway.quantities[size] || 0}"
                     min="0"
                     placeholder="0"
                     data-garment="${garmentId}"
                     data-colorway="${colorwayId}"
                     data-size="${size}"
                     oninput="window.v10QuantityStudio.updateQuantity('${garmentId}', '${colorwayId}', '${size}', this.value)">
            </div>
          `).join('')}
        </div>
        
        <div class="v10-colorway-actions" style="display: flex; flex-wrap: nowrap; gap: 8px; margin-bottom: 16px; align-items: stretch;">
          <button type="button" class="v10-btn v10-btn--ghost" style="font-size: 12px; padding: 8px 12px; height: 36px; display: flex; align-items: center;"
                  onclick="window.v10QuantityStudio.applyPreset('${garmentId}', '${colorwayId}', 's-xl')"
                  title="Distribution for S, M, L, XL sizes">
            S-XL
          </button>
          <button type="button" class="v10-btn v10-btn--ghost" style="font-size: 12px; padding: 8px 12px; height: 36px; display: flex; align-items: center;"
                  onclick="window.v10QuantityStudio.applyPreset('${garmentId}', '${colorwayId}', 'xs-xxl')"
                  title="Distribution for XS through XXL">
            XS-XXL
          </button>
          <button type="button" class="v10-btn v10-btn--ghost" style="font-size: 12px; padding: 8px 12px; height: 36px; display: flex; align-items: center;"
                  onclick="window.v10QuantityStudio.applyPreset('${garmentId}', '${colorwayId}', 'balanced')"
                  title="Balanced distribution with M/L focus">
            Balanced
          </button>
          <button type="button" class="v10-btn v10-btn--ghost" style="font-size: 12px; padding: 8px 12px; height: 36px; background: rgba(16,185,129,0.1); border-color: #10b981; color: #10b981; display: flex; align-items: center;"
                  onclick="window.v10QuantityStudio.saveDistribution('${garmentId}', '${colorwayId}')"
                  title="Save current pattern">
            Save Pattern
          </button>
          <button type="button" class="v10-btn v10-btn--ghost" style="font-size: 12px; padding: 8px 12px; height: 36px; background: rgba(168,85,247,0.1); border-color: #a855f7; color: #a855f7; display: flex; align-items: center;"
                  onclick="window.v10QuantityStudio.loadDistribution('${garmentId}', '${colorwayId}')"
                  title="Load saved pattern">
            Load Pattern
          </button>
          <button type="button" class="v10-btn v10-btn--ghost" style="font-size: 12px; padding: 8px 12px; height: 36px; background: rgba(239,68,68,0.1); border-color: #ef4444; color: #ef4444; display: flex; align-items: center;"
                  onclick="window.v10QuantityStudio.clearColorwayQuantities('${garmentId}', '${colorwayId}')">
            Clear All
          </button>
          <div class="v10-colorway-subtotal" style="
            margin-left: auto;
            padding: 8px 16px;
            height: 36px;
            background: ${this.getSubtotalColor(colorway.subtotal, garment.type, garment.colorways.size).background};
            border: 1px solid ${this.getSubtotalColor(colorway.subtotal, garment.type, garment.colorways.size).border};
            border-radius: 0;
            color: ${this.getSubtotalColor(colorway.subtotal, garment.type, garment.colorways.size).text};
            font-weight: 600;
            display: flex;
            align-items: center;
            font-size: 12px;
          ">
            <span>Subtotal: <strong id="subtotal-${garmentId}-${colorwayId}" style="font-size: 14px;">${colorway.subtotal}</strong> units</span>
          </div>
        </div>
      </div>
    `;
  }
  
  getSubtotalColor(subtotal, garmentType, colorwayCount) {
    const perColorwayMin = this.getPerColorwayMinimum(garmentType, colorwayCount);
    const percentage = (subtotal / perColorwayMin) * 100;
    
    if (percentage < 50) {
      return {
        background: 'rgba(239, 68, 68, 0.1)',
        border: '#ef4444',
        text: '#ef4444'
      };
    } else if (percentage < 100) {
      return {
        background: 'rgba(245, 158, 11, 0.1)',
        border: '#f59e0b',
        text: '#f59e0b'
      };
    } else {
      return {
        background: 'rgba(16, 185, 129, 0.1)',
        border: '#10b981',
        text: '#10b981'
      };
    }
  }
  
  updateDesignReference(garmentId, colorwayId, value) {
    const garment = this.garments.get(garmentId);
    if (!garment) return;
    
    const colorway = garment.colorways.get(colorwayId);
    if (!colorway) return;
    
    colorway.designReference = value;
    this.saveState();
    console.log(`📝 Updated design reference for ${colorway.name}: "${value}"`);
  }
  
  updateQuantity(garmentId, colorwayId, size, quantity) {
    const garment = this.garments.get(garmentId);
    if (!garment) return;
    
    const colorway = garment.colorways.get(colorwayId);
    if (!colorway) return;
    
    colorway.quantities[size] = parseInt(quantity) || 0;
    
    // Calculate colorway subtotal
    colorway.subtotal = Object.values(colorway.quantities).reduce((sum, q) => sum + q, 0);
    
    // Calculate garment total
    garment.total = 0;
    garment.colorways.forEach(cw => {
      garment.total += cw.subtotal;
    });
    
    // Update tab count with minimum shown
    const perColorwayMin = this.getPerColorwayMinimum(garment.type, garment.colorways.size);
    const isSufficient = colorway.subtotal >= perColorwayMin;
    const tab = document.querySelector(`#tabs-${garmentId} .v10-colorway-tab[data-colorway-id="${colorwayId}"] .v10-colorway-tab-count`);
    if (tab) {
      tab.textContent = `${colorway.subtotal} / ${perColorwayMin} units`;
      tab.style.color = isSufficient ? '#00ff88' : '#ff6b6b';
    }
    
    // Update subtotal in content with dynamic color
    const subtotalDiv = document.querySelector(`#colorways-${garmentId} .v10-colorway-subtotal`);
    if (subtotalDiv) {
      const colors = this.getSubtotalColor(colorway.subtotal, garment.type, garment.colorways.size);
      subtotalDiv.style.background = colors.background;
      subtotalDiv.style.borderColor = colors.border;
      subtotalDiv.style.color = colors.text;
      
      const subtotalEl = subtotalDiv.querySelector('strong');
      if (subtotalEl) {
        subtotalEl.textContent = colorway.subtotal;
      }
    }
    
    this.updateStats();
    this.updateGarmentTotals(garmentId);
    this.updateQuantityStudioTabStatus();
    this.saveState();
  }
  
  applyPreset(garmentId, colorwayId, presetType) {
    const garment = this.garments.get(garmentId);
    if (!garment) return;
    
    const colorway = garment.colorways.get(colorwayId);
    if (!colorway) return;
    
    // Get the minimum required for this colorway
    const perColorwayMin = this.getPerColorwayMinimum(garment.type, garment.colorways.size);
    
    // Define mirrored preset distributions for perfect symmetry
    const presetDistributions = {
      's-xl': {
        sizes: ['S', 'M', 'L', 'XL'],
        percentages: [15, 35, 35, 15]  // Perfectly mirrored
      },
      'xs-xxl': {
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        percentages: [10, 20, 20, 20, 20, 10]  // Perfectly mirrored
      },
      'balanced': {
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        percentages: [8, 17, 25, 25, 17, 8]  // Mirrored with M/L focus
      }
    };
    
    // Get the preset configuration
    const preset = presetDistributions[presetType] || presetDistributions['s-xl'];
    const activeSizes = preset.sizes;
    const percentages = preset.percentages;
    
    // Clear all quantities first
    ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].forEach(size => {
      colorway.quantities[size] = 0;
    });
    
    // Calculate quantities with mirrored distribution
    let quantities = [];
    let total = 0;
    
    // First pass: calculate raw quantities
    activeSizes.forEach((size, index) => {
      const percentage = percentages[index] / 100;
      const quantity = Math.floor(perColorwayMin * percentage);
      quantities.push(quantity);
      total += quantity;
    });
    
    // Second pass: distribute remaining units to maintain symmetry
    let remaining = perColorwayMin - total;
    if (remaining > 0) {
      // For mirrored distribution, add to center sizes first
      const centerIndex = Math.floor(activeSizes.length / 2);
      const isEven = activeSizes.length % 2 === 0;
      
      if (isEven) {
        // For even number of sizes, distribute to two center sizes
        const leftCenter = centerIndex - 1;
        const rightCenter = centerIndex;
        const halfRemaining = Math.floor(remaining / 2);
        quantities[leftCenter] += halfRemaining;
        quantities[rightCenter] += halfRemaining;
        if (remaining % 2 === 1) {
          quantities[leftCenter] += 1; // Add odd unit to left center
        }
      } else {
        // For odd number of sizes, add all to center
        quantities[centerIndex] += remaining;
      }
    }
    
    // Apply the calculated quantities
    activeSizes.forEach((size, index) => {
      colorway.quantities[size] = quantities[index];
    });
    
    // Recalculate subtotal
    colorway.subtotal = Object.values(colorway.quantities).reduce((sum, q) => sum + q, 0);
    
    // Update garment total
    garment.total = 0;
    garment.colorways.forEach(cw => {
      garment.total += cw.subtotal;
    });
    
    // Update the colorway tab count without re-rendering all tabs
    const isSufficient = colorway.subtotal >= perColorwayMin;
    const tabCount = document.querySelector(`#tabs-${garmentId} .v10-colorway-tab[data-colorway-id="${colorwayId}"] .v10-colorway-tab-count`);
    if (tabCount) {
      tabCount.textContent = `${colorway.subtotal} / ${perColorwayMin} units`;
      tabCount.style.color = isSufficient ? '#00ff88' : '#ff6b6b';
    }
    
    // Re-render and update everything
    this.renderColorwayContent(garmentId, colorwayId);
    // Removed renderColorways call - not needed, tabs don't change when applying preset
    this.updateStats();
    this.updateGarmentTotals(garmentId);
    this.updateQuantityStudioTabStatus();
    this.saveState();
  }
  
  saveDistribution(garmentId, colorwayId) {
    const garment = this.garments.get(garmentId);
    if (!garment) return;
    
    const colorway = garment.colorways.get(colorwayId);
    if (!colorway) return;
    
    // Save the current distribution pattern
    const savedPattern = {
      quantities: { ...colorway.quantities },
      total: colorway.subtotal,
      timestamp: Date.now()
    };
    
    // Store in sessionStorage with global key so any garment can use it
    const key = `v10_saved_pattern_global`;
    sessionStorage.setItem(key, JSON.stringify(savedPattern));
    
    // Show success message
    console.log(`✅ Pattern saved for garment ${garmentId}`);
    
    // Visual feedback - temporarily change button color
    const saveBtn = document.querySelector(`[onclick*="saveDistribution('${garmentId}', '${colorwayId}')"]`);
    if (saveBtn) {
      const originalBg = saveBtn.style.background;
      const originalColor = saveBtn.style.color;
      saveBtn.style.background = 'rgba(16,185,129,0.3)';
      saveBtn.style.color = '#10b981';
      saveBtn.textContent = '✓ Saved';
      
      setTimeout(() => {
        saveBtn.style.background = originalBg;
        saveBtn.style.color = originalColor;
        saveBtn.textContent = 'Save Pattern';
      }, 2000);
    }
  }
  
  loadDistribution(garmentId, colorwayId) {
    const garment = this.garments.get(garmentId);
    if (!garment) return;
    
    const colorway = garment.colorways.get(colorwayId);
    if (!colorway) return;
    
    // Load saved pattern from sessionStorage (global pattern)
    const key = `v10_saved_pattern_global`;
    const savedData = sessionStorage.getItem(key);
    
    if (!savedData) {
      console.log(`⚠️ No saved pattern found for garment ${garmentId}`);
      
      // Visual feedback - show no pattern saved
      const loadBtn = document.querySelector(`[onclick*="loadDistribution('${garmentId}', '${colorwayId}')"]`);
      if (loadBtn) {
        const originalText = loadBtn.textContent;
        loadBtn.textContent = '⚠ No Pattern';
        setTimeout(() => {
          loadBtn.textContent = originalText;
        }, 2000);
      }
      return;
    }
    
    try {
      const savedPattern = JSON.parse(savedData);
      
      // Apply the saved quantities
      Object.keys(savedPattern.quantities).forEach(size => {
        colorway.quantities[size] = savedPattern.quantities[size];
      });
      
      // Recalculate subtotal
      colorway.subtotal = Object.values(colorway.quantities).reduce((sum, q) => sum + q, 0);
      
      // Update garment total
      garment.total = 0;
      garment.colorways.forEach(cw => {
        garment.total += cw.subtotal;
      });
      
      // Update quantities in DOM directly without re-rendering to avoid clearing inputs
      Object.keys(savedPattern.quantities).forEach(size => {
        const input = document.querySelector(`input[data-garment="${garmentId}"][data-colorway="${colorwayId}"][data-size="${size}"]`);
        if (input) {
          input.value = savedPattern.quantities[size];
        }
      });
      
      // Update the subtotal display and box styling
      const subtotalElement = document.getElementById(`subtotal-${garmentId}-${colorwayId}`);
      if (subtotalElement) {
        subtotalElement.textContent = colorway.subtotal;
        
        // Update the parent box styling
        const subtotalBox = subtotalElement.closest('.v10-colorway-subtotal');
        if (subtotalBox) {
          const colors = this.getSubtotalColor(colorway.subtotal, garment.type, garment.colorways.size);
          subtotalBox.style.background = colors.background;
          subtotalBox.style.borderColor = colors.border;
          subtotalBox.style.color = colors.text;
          subtotalElement.style.color = colors.text;
        }
      }
      
      // Update colorway tab count
      const tab = document.querySelector(`#tabs-${garmentId} .v10-colorway-tab[data-colorway-id="${colorwayId}"]`);
      if (tab) {
        const countElement = tab.querySelector('.v10-colorway-tab-count');
        if (countElement) {
          const perColorwayMin = this.getPerColorwayMinimum(garment.type, garment.colorways.size);
          const isSufficient = colorway.subtotal >= perColorwayMin;
          countElement.style.color = isSufficient ? '#00ff88' : '#ff6b6b';
          countElement.textContent = `${colorway.subtotal} / ${perColorwayMin} units`;
        }
      }
      
      this.updateStats();
      this.updateGarmentTotals(garmentId);
      this.updateQuantityStudioTabStatus();
      this.saveState();
      
      console.log(`✅ Pattern loaded for garment ${garmentId}`);
      
      // Visual feedback
      const loadBtn = document.querySelector(`[onclick*="loadDistribution('${garmentId}', '${colorwayId}')"]`);
      if (loadBtn) {
        const originalBg = loadBtn.style.background;
        const originalColor = loadBtn.style.color;
        loadBtn.style.background = 'rgba(168,85,247,0.3)';
        loadBtn.style.color = '#a855f7';
        loadBtn.textContent = '✓ Loaded';
        
        setTimeout(() => {
          loadBtn.style.background = originalBg;
          loadBtn.style.color = originalColor;
          loadBtn.textContent = 'Load Pattern';
        }, 2000);
      }
    } catch (error) {
      console.error('Error loading saved pattern:', error);
    }
  }
  
  clearColorwayQuantities(garmentId, colorwayId) {
    const garment = this.garments.get(garmentId);
    if (!garment) return;
    
    const colorway = garment.colorways.get(colorwayId);
    if (!colorway) return;
    
    const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
    sizes.forEach(size => {
      colorway.quantities[size] = 0;
    });
    
    colorway.subtotal = 0;
    garment.total = 0;
    garment.colorways.forEach(cw => {
      garment.total += cw.subtotal;
    });
    
    this.renderColorwayContent(garmentId, colorwayId);
    // Update only the specific colorway tab count without re-rendering all tabs
    const tab = document.querySelector(`#tabs-${garmentId} .v10-colorway-tab[data-colorway-id="${colorwayId}"]`);
    if (tab) {
      const countElement = tab.querySelector('.v10-colorway-tab-count');
      if (countElement) {
        const perColorwayMin = this.getPerColorwayMinimum(garment.type, garment.colorways.size);
        const isSufficient = colorway.subtotal >= perColorwayMin;
        countElement.style.color = isSufficient ? '#00ff88' : '#ff6b6b';
        countElement.textContent = `${colorway.subtotal} / ${perColorwayMin} units`;
      }
    }
    this.updateStats();
    this.updateGarmentTotals(garmentId);
    this.updateQuantityStudioTabStatus();
    this.saveState();
  }
  
  updateGarmentTotals(garmentId) {
    const garment = this.garments.get(garmentId);
    if (!garment) {
      console.log(`⚠️ updateGarmentTotals: Garment ${garmentId} not found`);
      return;
    }
    
    const colorwayCount = garment.colorways.size;
    const totalMinimum = this.calculateGarmentMinimum(garment.type, colorwayCount);
    const perColorwayMin = this.getPerColorwayMinimum(garment.type, colorwayCount);
    
    // NEW LOGIC: Check if ALL colorways meet their individual minimums
    const isSufficient = this.checkColorwaysSufficient(garmentId);
    
    // Log detailed info for debugging
    console.log(`📊 Updating totals for ${garmentId}:`);
    console.log(`   Total: ${garment.total}/${totalMinimum}`);
    console.log(`   Per colorway min: ${perColorwayMin}`);
    garment.colorways.forEach((cw, id) => {
      const meets = cw.subtotal >= perColorwayMin;
      console.log(`   Colorway ${cw.name}: ${cw.subtotal} units (${meets ? '✓' : '✗'})`);
    });
    console.log(`   Status: ${isSufficient ? 'SUFFICIENT' : 'INSUFFICIENT'}`);
    
    // Try multiple selectors to find the card
    const card = document.querySelector(`.v10-quantity-garment-full[data-garment-id="${garmentId}"]`) ||
                 document.querySelector(`[data-garment-id="${garmentId}"]`);
    
    if (card) {
      // Update card complete status
      if (isSufficient) {
        card.classList.add('garment-quantity-card--complete');
      } else {
        card.classList.remove('garment-quantity-card--complete');
      }
      
      // Update footer total
      const footerTotalEl = card.querySelector(`#footer-total-${garmentId}`);
      if (footerTotalEl) {
        footerTotalEl.style.color = isSufficient ? '#10b981' : '#ffffff';
        footerTotalEl.textContent = garment.total;
      }
      
      // Update footer minimum display
      const footerMinEl = card.querySelector(`#footer-min-${garmentId}`);
      if (footerMinEl) {
        footerMinEl.textContent = `${totalMinimum} MIN`;
      }
      
      // Update footer status badge
      const footerStatusEl = card.querySelector(`#footer-status-${garmentId}`);
      if (footerStatusEl) {
        if (isSufficient) {
          footerStatusEl.style.cssText = 'padding: 4px 12px; background: rgba(16,185,129,0.1); border: 1px solid #10b981; color: #10b981; font-size: 12px; font-weight: 600;';
          footerStatusEl.textContent = '✓ SUFFICIENT';
        } else {
          footerStatusEl.style.cssText = 'padding: 4px 12px; background: rgba(239,68,68,0.1); border: 1px solid #ef4444; color: #ef4444; font-size: 12px; font-weight: 600;';
          footerStatusEl.textContent = '✗ INSUFFICIENT';
        }
      }
      
      // Update header complete badge
      const headerBadge = card.querySelector('.header-complete-badge');
      const headerContainer = card.querySelector('div[style*="rgba(255,255,255,0.03)"] > div');
      
      if (isSufficient && !headerBadge && headerContainer) {
        // Add complete badge to header
        const badge = document.createElement('div');
        badge.className = 'header-complete-badge';
        badge.style.cssText = 'padding: 4px 12px; background: rgba(16,185,129,0.1); border: 1px solid #10b981; color: #10b981; font-size: 11px; font-weight: 600; text-transform: uppercase;';
        badge.textContent = '✓ Complete';
        headerContainer.appendChild(badge);
      } else if (!isSufficient && headerBadge) {
        // Remove complete badge from header
        headerBadge.remove();
      }
    } else {
      console.log(`⚠️ Card not found for garment ${garmentId}`);
    }
  }
  
  removeColorway(garmentId, colorwayId) {
    const garment = this.garments.get(garmentId);
    if (!garment) return;
    
    console.log(`🗑️ Removing colorway ${colorwayId} from garment ${garmentId}`);
    
    garment.colorways.delete(colorwayId);
    
    // Recalculate total
    garment.total = 0;
    garment.colorways.forEach(cw => {
      garment.total += cw.subtotal || 0;
    });
    
    // If no colorways left, show the full-width add button again
    if (garment.colorways.size === 0) {
      const card = document.querySelector(`.v10-quantity-garment-full[data-garment-id="${garmentId}"]`);
      if (card) {
        const section = card.querySelector('.v10-colorway-section');
        if (section) {
          section.innerHTML = `
            <button type="button" 
                    class="v10-add-colorway-btn-full" 
                    onclick="window.v10QuantityStudio.showColorPicker('${garmentId}')" 
                    style="
                      width: 100%;
                      padding: 16px;
                      background: transparent;
                      border: 2px dashed rgba(255,255,255,0.3);
                      color: rgba(255,255,255,0.9);
                      font-size: 14px;
                      font-weight: 600;
                      cursor: pointer;
                      transition: all 0.2s;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      gap: 12px;
                      margin-bottom: 20px;
                    "
                    onmouseover="this.style.borderColor='#10b981'; this.style.color='#10b981'; this.style.background='rgba(16,185,129,0.05)';"
                    onmouseout="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.color='rgba(255,255,255,0.9)'; this.style.background='transparent';">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Colorway to Set Quantities
            </button>
            <div class="v10-colorways-content" id="colorways-${garmentId}" style="display: none;">
            </div>
          `;
        }
      }
    } else {
      // Re-render remaining colorways
      this.renderColorways(garmentId);
    }
    
    this.updateStats();
    this.updateGarmentTotals(garmentId);
    this.updateQuantityStudioTabStatus();
    this.saveState();
  }
}

// ==============================================
// QUANTITY CALCULATION & VALIDATION ENGINE
// ==============================================

class V10_QuantityCalculator {
  constructor() {
    this.config = V10_QUANTITY_CONFIG;
    this.state = V10_State.quantities;
  }

  // ==============================================
  // CORE MINIMUM CALCULATION LOGIC
  // ==============================================

  /**
   * Get minimum quantity based on colorway count and garment type
   * ONLY Custom Production logic for bulk orders
   */
  getMinimumQuantity(colorwayCount, productionType, garmentType) {
    colorwayCount = colorwayCount || 1;
    
    console.log(`📊 Calculating minimum for ${garmentType} with ${colorwayCount} colorway(s)`);
    
    // Define specific minimums per garment type (matching your requirements)
    const garmentMinimums = {
      't-shirt': { single: 100, multiple: 75 },
      'hoodie': { single: 75, multiple: 50 },
      'sweatshirt': { single: 75, multiple: 50 },
      'polo': { single: 100, multiple: 75 },
      'tank-top': { single: 100, multiple: 75 },
      'joggers': { single: 75, multiple: 50 },
      'shorts': { single: 75, multiple: 50 },
      'pants': { single: 75, multiple: 50 },
      'jacket': { single: 50, multiple: 40 },
      'default': { single: 75, multiple: 50 }
    };
    
    // Get minimums for this garment type
    const minimums = garmentMinimums[garmentType?.toLowerCase()] || garmentMinimums.default;
    
    // Return based on colorway count
    const minimum = colorwayCount === 1 ? minimums.single : minimums.multiple;
    
    console.log(`✅ Minimum for ${garmentType}: ${minimum} units ${colorwayCount > 1 ? 'per colorway' : ''}`);
    
    return minimum;
  }

  /**
   * Determine if garment is classified as "light" (higher minimums)
   */
  isLightGarment(garmentType) {
    return this.config.lightGarments.includes(garmentType);
  }

  /**
   * Calculate total minimum required across all garments
   */
  calculateTotalMinimum(garments = null) {
    const garmentsToCheck = garments || Array.from(V10_State.garments.values());
    let totalMinimum = 0;
    let garmentDetails = [];
    
    console.log(`🔢 Calculating total minimum for ${garmentsToCheck.length} garment(s)`);
    
    garmentsToCheck.forEach(garment => {
      // Only calculate for complete garments
      if (!garment.type || (!garment.fabricType && !garment.sampleReference)) {
        console.log(`⏭️ Skipping incomplete garment ${garment.id}`);
        return;
      }
      
      const colorwayCount = this.getColorwayCount(garment.id);
      const productionType = this.determineProductionType(garment);
      const garmentMinimum = this.getMinimumQuantity(colorwayCount, productionType, garment.type);
      
      // For multiple colorways, multiply by colorway count
      const garmentTotal = colorwayCount > 1 ? garmentMinimum * colorwayCount : garmentMinimum;
      
      totalMinimum += garmentTotal;
      
      garmentDetails.push({
        type: garment.type,
        colorways: colorwayCount,
        minimum: garmentMinimum,
        total: garmentTotal
      });
      
      console.log(`📦 ${garment.type}: ${garmentTotal} units (${colorwayCount} colorway(s) × ${garmentMinimum} min)`);
    });
    
    console.log(`📊 TOTAL MINIMUM REQUIRED: ${totalMinimum} units`);
    
    // Update the display immediately
    this.updateMinimumDisplay(totalMinimum);
    
    return totalMinimum;
  }
  
  updateMinimumDisplay(totalMinimum) {
    // Update all minimum display elements
    const minElements = document.querySelectorAll('[data-minimum-display], #minimum-required-total, .minimum-required-value');
    minElements.forEach(el => {
      if (el) {
        el.textContent = totalMinimum;
      }
    });
    
    // Update progress status text
    const progressStatus = document.getElementById('quantity-progress-status');
    if (progressStatus) {
      const currentTotal = V10_State.quantities.globalTotal || 0;
      progressStatus.textContent = `${currentTotal} / ${totalMinimum} minimum units`;
    }
  }

  // ==============================================
  // SIZE DISTRIBUTION VALIDATION
  // ==============================================

  /**
   * Get maximum allowed sizes based on quantity
   */
  getMaxAllowedSizes(quantity) {
    for (const rule of this.config.sizeDistribution) {
      if (quantity >= rule.min) {
        return rule.maxSizes;
      }
    }
    return 0;
  }

  /**
   * Validate size distribution for a garment
   */
  validateSizeDistribution(garmentId) {
    const quantityData = this.state.garments.get(garmentId);
    if (!quantityData) return { valid: true, warnings: [] };
    
    const totalQuantity = quantityData.total;
    const activeSizes = Object.values(quantityData.sizes).filter(qty => qty > 0).length;
    const maxAllowedSizes = this.getMaxAllowedSizes(totalQuantity);
    
    const warnings = [];
    if (activeSizes > maxAllowedSizes) {
      warnings.push({
        type: 'size_distribution',
        message: `Too many sizes (${activeSizes}) for quantity ${totalQuantity}. Maximum: ${maxAllowedSizes} sizes.`,
        suggestion: `Increase quantity to ${this.getMinQuantityForSizes(activeSizes)} or reduce to ${maxAllowedSizes} sizes.`
      });
    }
    
    return {
      valid: activeSizes <= maxAllowedSizes,
      warnings: warnings,
      activeSizes: activeSizes,
      maxAllowedSizes: maxAllowedSizes
    };
  }

  /**
   * Get minimum quantity needed for a specific number of sizes
   */
  getMinQuantityForSizes(sizeCount) {
    for (const rule of this.config.sizeDistribution) {
      if (rule.maxSizes >= sizeCount) {
        return rule.min;
      }
    }
    return this.config.sizeDistribution[0].min; // Return highest threshold
  }

  // ==============================================
  // COLORWAY & PRODUCTION TYPE LOGIC
  // ==============================================

  /**
   * Get colorway count for a garment
   */
  getColorwayCount(garmentId) {
    // Check assigned lab dips from Color Studio
    const assignedLabDips = V10_State.assignments.labDips;
    let colorwayCount = 0;
    
    assignedLabDips.forEach((garmentSet, labDipId) => {
      if (garmentSet.has(garmentId)) {
        colorwayCount++;
      }
    });
    
    // Default to 1 if no colorways assigned
    return Math.max(colorwayCount, 1);
  }

  /**
   * Determine production type based on garment data
   */
  determineProductionType(garment) {
    // Check if garment has sample reference (indicates "Our Blanks")
    if (garment.sampleReference && garment.sampleReference !== 'custom') {
      return 'our-blanks';
    }
    
    // Check fabric type or other indicators for custom production
    // Default to custom production
    return 'custom';
  }

  // ==============================================
  // VALIDATION & PROGRESS TRACKING
  // ==============================================

  /**
   * Calculate and update overall progress
   */
  calculateAndUpdateProgress() {
    const garmentsArray = Array.from(V10_State.garments.values()).filter(garment => 
      garment.type && (garment.sampleReference || garment.fabricType)
    );
    
    if (garmentsArray.length === 0) {
      this.updateQuantityStats(0, 0, 0, 0);
      return 0;
    }
    
    // Calculate total minimum required
    const totalMinimumRequired = this.calculateTotalMinimum(garmentsArray);
    
    // Calculate current total quantity
    let currentTotal = 0;
    garmentsArray.forEach(garment => {
      const quantityData = this.state.garments.get(garment.id);
      if (quantityData) {
        currentTotal += quantityData.total;
      }
    });
    
    // Calculate progress percentage
    const progressPercentage = totalMinimumRequired > 0 ? 
      Math.min((currentTotal / totalMinimumRequired) * 100, 100) : 0;
    
    // Update state
    this.state.globalMinimum = totalMinimumRequired;
    this.state.globalTotal = currentTotal;
    this.state.progressPercentage = progressPercentage;
    
    // Update UI
    this.updateQuantityStats(currentTotal, garmentsArray.length, this.getTotalColorwayCount(), totalMinimumRequired);
    this.updateProgressBar(currentTotal, totalMinimumRequired);
    
    return progressPercentage;
  }

  /**
   * Get total colorway count across all garments
   */
  getTotalColorwayCount() {
    let totalColorways = 0;
    V10_State.garments.forEach((garment, garmentId) => {
      totalColorways += this.getColorwayCount(garmentId);
    });
    return totalColorways;
  }

  /**
   * Update quantity statistics display
   */
  updateQuantityStats(totalUnits, garmentCount, colorwayCount, minimumRequired) {
    const totalElement = document.getElementById('total-production-quantity');
    const garmentCountElement = document.getElementById('total-garments-count');
    const colorwayCountElement = document.getElementById('total-colorways-count');
    const progressStatusElement = document.getElementById('quantity-progress-status');
    const progressPercentageElement = document.getElementById('quantity-progress-percentage');

    if (totalElement) totalElement.textContent = totalUnits;
    if (garmentCountElement) garmentCountElement.textContent = garmentCount;
    if (colorwayCountElement) colorwayCountElement.textContent = colorwayCount;
    
    const percentage = minimumRequired > 0 ? Math.min((totalUnits / minimumRequired) * 100, 100) : 0;
    
    if (progressStatusElement) {
      progressStatusElement.textContent = `${totalUnits} / ${minimumRequired} minimum units`;
    }
    
    if (progressPercentageElement) {
      progressPercentageElement.textContent = `${Math.round(percentage)}%`;
    }
  }

  /**
   * Update progress bar visual state
   */
  updateProgressBar(totalUnits, minimumRequired) {
    const progressBar = document.getElementById('production-quantity-progress');
    if (!progressBar || minimumRequired === 0) return;

    const percentage = Math.min((totalUnits / minimumRequired) * 100, 100);
    progressBar.style.width = `${percentage}%`;
    
    // Update color based on progress
    if (totalUnits >= minimumRequired) {
      progressBar.style.background = 'linear-gradient(90deg, var(--v10-accent-success) 0%, var(--v10-accent-success) 100%)';
    } else if (totalUnits >= minimumRequired * 0.5) {
      progressBar.style.background = 'linear-gradient(90deg, var(--v10-border-warning) 0%, var(--v10-accent-primary) 100%)';
    } else {
      progressBar.style.background = 'linear-gradient(90deg, var(--v10-accent-primary) 0%, var(--v10-accent-primary) 100%)';
    }
  }

  // ==============================================
  // PRESET DISTRIBUTION SYSTEM
  // ==============================================

  /**
   * Apply intelligent preset distribution to garment
   */
  applyPresetToGarment(garmentId, presetName, targetQuantity = null) {
    const preset = this.config.presets[presetName];
    if (!preset) {
      console.error(`❌ Preset "${presetName}" not found`);
      return;
    }
    
    const garment = V10_State.garments.get(garmentId);
    if (!garment) {
      console.error(`❌ Garment ${garmentId} not found`);
      return;
    }
    
    // Calculate intelligent target quantity if not provided
    if (!targetQuantity) {
      targetQuantity = this.calculateIntelligentTargetQuantity(garmentId);
    }
    
    // Get smart distribution pattern
    const distributionData = this.getSmartDistribution(garmentId, presetName, targetQuantity);
    
    // Apply distribution to garment
    this.applyDistributionToGarment(garmentId, distributionData);
    
    console.log(`🎯 Applied intelligent ${presetName} preset to garment ${garmentId}: ${distributionData.total} units (target: ${targetQuantity})`);
  }

  /**
   * Calculate intelligent target quantity based on garment minimums and context
   */
  calculateIntelligentTargetQuantity(garmentId) {
    const garment = V10_State.garments.get(garmentId);
    const colorwayCount = this.getColorwayCount(garmentId);
    const productionType = this.determineProductionType(garment);
    
    // Get base minimum
    const minimumRequired = this.getMinimumQuantity(colorwayCount, productionType, garment.type);
    
    // Add intelligent buffer based on garment type and production context
    const intelligentBuffer = this.getIntelligentBuffer(garment.type, productionType, colorwayCount);
    
    // Target should be minimum + intelligent buffer, rounded to nice number
    const targetQuantity = minimumRequired + intelligentBuffer;
    
    // Round to nearest 5 or 10 for better UX
    return this.roundToNiceNumber(targetQuantity);
  }

  /**
   * Get intelligent buffer based on context
   */
  getIntelligentBuffer(garmentType, productionType, colorwayCount) {
    let buffer = 0;
    
    // Base buffer based on production type
    if (productionType === 'our-blanks') {
      buffer = 10; // Lower buffer for blank inventory
    } else {
      buffer = 25; // Higher buffer for custom production
    }
    
    // Adjust for garment type complexity
    if (this.isLightGarment(garmentType)) {
      buffer += 15; // Light garments need more units for economies of scale
    }
    
    // Adjust for colorway complexity
    if (colorwayCount > 1) {
      buffer += colorwayCount * 10; // More buffer for multiple colorways
    }
    
    return buffer;
  }

  /**
   * Round quantity to nice numbers for better UX
   */
  roundToNiceNumber(quantity) {
    if (quantity <= 50) {
      return Math.ceil(quantity / 5) * 5; // Round to nearest 5
    } else if (quantity <= 200) {
      return Math.ceil(quantity / 10) * 10; // Round to nearest 10
    } else {
      return Math.ceil(quantity / 25) * 25; // Round to nearest 25
    }
  }

  /**
   * Get smart distribution pattern based on context
   */
  getSmartDistribution(garmentId, presetName, targetQuantity) {
    const preset = this.config.presets[presetName];
    const basePattern = [...preset.pattern]; // Clone pattern
    const sizeKeys = this.config.sizeKeys;
    
    // Calculate total pattern units
    const patternTotal = basePattern.reduce((sum, qty) => sum + qty, 0);
    
    // Scale pattern to target quantity
    const scaleFactor = targetQuantity / patternTotal;
    const scaledPattern = basePattern.map(qty => Math.round(qty * scaleFactor));
    
    // Ensure we hit the exact target by adjusting the most common size
    const scaledTotal = scaledPattern.reduce((sum, qty) => sum + qty, 0);
    const difference = targetQuantity - scaledTotal;
    
    if (difference !== 0) {
      // Find the size with highest quantity (usually M or L) and adjust
      const maxIndex = scaledPattern.indexOf(Math.max(...scaledPattern));
      scaledPattern[maxIndex] = Math.max(0, scaledPattern[maxIndex] + difference);
    }
    
    // Convert to size object
    const sizes = {};
    sizeKeys.forEach((sizeKey, index) => {
      sizes[sizeKey] = scaledPattern[index] || 0;
    });
    
    return {
      sizes,
      total: Object.values(sizes).reduce((sum, qty) => sum + qty, 0),
      presetName,
      targetQuantity,
      distribution: preset.name
    };
  }

  /**
   * Apply distribution data to garment
   */
  applyDistributionToGarment(garmentId, distributionData) {
    // Initialize or get existing quantity data
    let quantityData = this.state.garments.get(garmentId) || {
      sizes: {},
      total: 0,
      validation: {},
      colorwayCount: this.getColorwayCount(garmentId)
    };
    
    // Update with new distribution
    quantityData.sizes = { ...distributionData.sizes };
    quantityData.total = distributionData.total;
    quantityData.lastPreset = distributionData.presetName;
    quantityData.appliedAt = Date.now();
    
    // Update state
    this.state.garments.set(garmentId, quantityData);
    
    // Update UI with smooth animation
    this.updateGarmentQuantityInputsWithAnimation(garmentId, quantityData.sizes);
    
    // Update validation and progress
    this.calculateAndUpdateProgress();
    
    // Show preset success feedback
    this.showPresetSuccessFeedback(garmentId, distributionData);
  }

  /**
   * Update garment quantity inputs with smooth animation
   */
  updateGarmentQuantityInputsWithAnimation(garmentId, sizes) {
    const card = document.querySelector(`[data-garment-id="${garmentId}"]`);
    if (!card) return;
    
    Object.entries(sizes).forEach(([sizeKey, quantity]) => {
      const input = card.querySelector(`[data-size="${sizeKey}"]`);
      if (input) {
        // Animate value change
        this.animateValueChange(input, parseInt(input.value) || 0, quantity);
      }
    });
    
    // Update garment total display with animation
    const totalElement = card.querySelector(`#garment-total-quantity-${garmentId}, [id*="garment-total"]`);
    if (totalElement) {
      const currentTotal = parseInt(totalElement.textContent) || 0;
      const newTotal = Object.values(sizes).reduce((sum, qty) => sum + (qty || 0), 0);
      this.animateValueChange(totalElement, currentTotal, newTotal, true);
    }
  }

  /**
   * Animate value changes for better UX
   */
  animateValueChange(element, fromValue, toValue, isDisplay = false) {
    const duration = 500;
    const steps = 20;
    const stepDuration = duration / steps;
    const stepValue = (toValue - fromValue) / steps;
    
    let currentStep = 0;
    
    const animate = () => {
      currentStep++;
      const currentValue = Math.round(fromValue + (stepValue * currentStep));
      
      if (isDisplay) {
        element.textContent = currentValue;
      } else {
        element.value = currentValue;
        // Trigger input event for validation updates
        element.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      if (currentStep < steps && currentValue !== toValue) {
        setTimeout(animate, stepDuration);
      } else {
        // Ensure final value is exact
        if (isDisplay) {
          element.textContent = toValue;
        } else {
          element.value = toValue;
          element.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    };
    
    animate();
  }

  /**
   * Show preset success feedback
   */
  showPresetSuccessFeedback(garmentId, distributionData) {
    const card = document.querySelector(`[data-garment-id="${garmentId}"]`);
    if (!card) return;
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'preset-success-message';
    successMessage.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20,6 9,17 4,12"/>
      </svg>
      <span>Applied ${distributionData.distribution} (${distributionData.total} units)</span>
    `;
    
    // Position and show message
    card.style.position = 'relative';
    successMessage.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: #10b981;
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: 0;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      z-index: 10;
      animation: slideInFade 0.3s ease-out;
    `;
    
    card.appendChild(successMessage);
    
    // Remove message after delay
    setTimeout(() => {
      successMessage.style.animation = 'slideOutFade 0.3s ease-out';
      setTimeout(() => {
        if (successMessage.parentNode) {
          successMessage.remove();
        }
      }, 300);
    }, 2000);
  }

  /**
   * Update garment quantity inputs in UI
   */
  updateGarmentQuantityInputs(garmentId, sizes) {
    const card = document.querySelector(`[data-garment-id="${garmentId}"]`);
    if (!card) return;
    
    Object.entries(sizes).forEach(([sizeKey, quantity]) => {
      const input = card.querySelector(`[data-size="${sizeKey}"]`);
      if (input) {
        input.value = quantity || 0;
      }
    });
    
    // Update garment total display
    const totalElement = card.querySelector(`#garment-total-quantity-${garmentId}, #garment-total-${garmentId}`);
    if (totalElement) {
      const total = Object.values(sizes).reduce((sum, qty) => sum + (qty || 0), 0);
      totalElement.textContent = total;
    }
  }

  // ==============================================
  // DISTRIBUTION ANALYTICS & VISUAL CHARTS
  // ==============================================

  /**
   * Generate comprehensive distribution analytics for a garment
   */
  generateDistributionAnalytics(garmentId) {
    const garment = V10_State.garments.get(garmentId);
    const quantityData = V10_State.quantities.garments.get(garmentId);
    if (!garment || !quantityData || !quantityData.sizes) {
      return null;
    }

    const quantities = quantityData.sizes;
    // Filter out 3XL size
    const validSizes = ['xs', 's', 'm', 'l', 'xl', 'xxl'];
    const filteredQuantities = {};
    validSizes.forEach(size => {
      if (quantities[size] !== undefined) {
        filteredQuantities[size] = quantities[size];
      }
    });
    
    const sizeKeys = Object.keys(filteredQuantities);
    const sizeValues = Object.values(filteredQuantities).map(q => parseInt(q) || 0);
    const totalQuantity = sizeValues.reduce((sum, qty) => sum + qty, 0);

    if (totalQuantity === 0) {
      return null;
    }

    // Calculate size distribution percentages
    const sizeDistribution = sizeKeys.map((size, index) => ({
      size: size.toUpperCase(),
      quantity: sizeValues[index],
      percentage: Math.round((sizeValues[index] / totalQuantity) * 100),
      label: `${size.toUpperCase()}: ${sizeValues[index]} (${Math.round((sizeValues[index] / totalQuantity) * 100)}%)`
    })).filter(item => item.quantity > 0);

    // Identify distribution pattern
    const pattern = this.identifyDistributionPattern(sizeValues, sizeKeys);
    
    // Calculate efficiency metrics
    const metrics = this.calculateDistributionMetrics(garment, totalQuantity);

    return {
      garmentId,
      totalQuantity,
      activeSizes: sizeDistribution.length,
      distribution: sizeDistribution,
      pattern: pattern,
      metrics: metrics,
      recommendations: this.generateDistributionRecommendations(garment, pattern, metrics)
    };
  }

  /**
   * Identify the distribution pattern (Bell curve, Uniform, Skewed, etc.)
   */
  identifyDistributionPattern(quantities, sizeKeys) {
    const activeQties = quantities.filter(q => q > 0);
    const max = Math.max(...activeQties);
    const min = Math.min(...activeQties);
    const avg = activeQties.reduce((sum, q) => sum + q, 0) / activeQties.length;

    // Find the index of the maximum quantity
    const maxIndex = quantities.indexOf(max);
    const middleIndex = Math.floor(quantities.length / 2);

    // Determine pattern type
    let patternType = 'uniform';
    let confidence = 0;

    // Bell curve detection (peak in middle sizes)
    if (maxIndex >= 2 && maxIndex <= 4) { // M, L, XL range
      const variation = Math.abs(max - min) / avg;
      if (variation > 0.3) {
        patternType = 'bell-curve';
        confidence = Math.min(0.9, variation);
      }
    }

    // Skewed distribution detection
    if (maxIndex <= 1) { // Peak in small sizes
      patternType = 'small-skewed';
      confidence = 0.8;
    } else if (maxIndex >= quantities.length - 2) { // Peak in large sizes
      patternType = 'large-skewed';
      confidence = 0.8;
    }

    // Uniform distribution (relatively even)
    const coefficientOfVariation = this.calculateCoefficientOfVariation(activeQties);
    if (coefficientOfVariation < 0.2) {
      patternType = 'uniform';
      confidence = 0.9;
    }

    return {
      type: patternType,
      confidence: Math.round(confidence * 100),
      description: this.getPatternDescription(patternType),
      peakSize: sizeKeys[maxIndex]?.toUpperCase() || 'Unknown'
    };
  }

  /**
   * Calculate coefficient of variation for distribution analysis
   */
  calculateCoefficientOfVariation(values) {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);
    
    return mean > 0 ? standardDeviation / mean : 0;
  }

  /**
   * Get human-readable description for distribution patterns
   */
  getPatternDescription(patternType) {
    const descriptions = {
      'bell-curve': 'Bell-shaped distribution focusing on core sizes (M, L)',
      'small-skewed': 'Skewed toward smaller sizes (XS, S, M)',
      'large-skewed': 'Skewed toward larger sizes (L, XL, XXL)',
      'uniform': 'Even distribution across selected sizes',
      'bimodal': 'Two peaks in distribution',
      'custom': 'Custom distribution pattern'
    };
    
    return descriptions[patternType] || 'Custom distribution pattern';
  }

  /**
   * Calculate distribution efficiency and production metrics
   */
  calculateDistributionMetrics(garment, totalQuantity) {
    const colorwayCount = this.getColorwayCount(garment.id);
    const productionType = this.determineProductionType(garment);
    const minimumRequired = this.getMinimumQuantity(colorwayCount, productionType, garment.type);
    
    // Production efficiency (how close to minimum requirements)
    const efficiency = totalQuantity >= minimumRequired ? 100 : Math.round((totalQuantity / minimumRequired) * 100);
    
    // Size utilization (how many sizes are being used effectively)
    const activeSizes = Object.values(garment.quantities || {}).filter(q => (parseInt(q) || 0) > 0).length;
    const maxAllowedSizes = this.getMaxAllowedSizes(totalQuantity);
    const sizeUtilization = Math.round((activeSizes / maxAllowedSizes) * 100);
    
    // Cost efficiency estimate (more sizes = higher setup costs)
    const setupCostRatio = activeSizes > 4 ? 'high' : activeSizes > 2 ? 'medium' : 'low';
    
    // Distribution balance (how evenly distributed the quantities are)
    const quantities = Object.values(garment.quantities || {}).map(q => parseInt(q) || 0).filter(q => q > 0);
    const balance = quantities.length > 0 ? Math.round((1 - this.calculateCoefficientOfVariation(quantities)) * 100) : 0;

    return {
      efficiency,
      sizeUtilization,
      setupCostRatio,
      balance,
      minimumRequired,
      surplusUnits: Math.max(0, totalQuantity - minimumRequired),
      deficitUnits: Math.max(0, minimumRequired - totalQuantity),
      activeSizeCount: activeSizes,
      maxAllowedSizes
    };
  }

  /**
   * Generate intelligent recommendations based on analytics
   */
  generateDistributionRecommendations(garment, pattern, metrics) {
    const recommendations = [];

    // Efficiency recommendations
    if (metrics.efficiency < 100) {
      recommendations.push({
        type: 'warning',
        priority: 'high',
        title: 'Below Minimum Requirement',
        message: `Add ${metrics.deficitUnits} more units to meet production minimum`,
        action: 'increase-quantity'
      });
    }

    // Size distribution recommendations
    if (metrics.sizeUtilization < 50 && metrics.activeSizeCount < 3) {
      recommendations.push({
        type: 'info',
        priority: 'medium',
        title: 'Consider More Sizes',
        message: `You can add up to ${metrics.maxAllowedSizes - metrics.activeSizeCount} more sizes with this quantity`,
        action: 'add-sizes'
      });
    }

    if (metrics.activeSizeCount > metrics.maxAllowedSizes) {
      recommendations.push({
        type: 'error',
        priority: 'high',
        title: 'Too Many Sizes',
        message: `Reduce to ${metrics.maxAllowedSizes} sizes or increase total quantity`,
        action: 'reduce-sizes'
      });
    }

    // Pattern-specific recommendations
    if (pattern.type === 'uniform' && metrics.balance > 90) {
      recommendations.push({
        type: 'success',
        priority: 'low',
        title: 'Well-Balanced Distribution',
        message: 'Your size distribution follows industry best practices',
        action: 'maintain'
      });
    }

    if (pattern.type === 'bell-curve' && pattern.confidence > 70) {
      recommendations.push({
        type: 'success',
        priority: 'low',
        title: 'Optimal Size Focus',
        message: 'Bell curve distribution maximizes inventory turnover',
        action: 'maintain'
      });
    }

    // Cost optimization recommendations  
    if (metrics.setupCostRatio === 'high' && metrics.efficiency < 120) {
      recommendations.push({
        type: 'warning',
        priority: 'medium',
        title: 'High Setup Costs',
        message: 'Consider reducing sizes or increasing quantities to optimize costs',
        action: 'optimize-costs'
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Render distribution analytics chart for a garment
   */
  renderDistributionChart(garmentId, containerId = null) {
    const analytics = this.generateDistributionAnalytics(garmentId);
    if (!analytics) {
      console.warn(`No analytics data available for garment ${garmentId}`);
      return;
    }

    const container = containerId ? document.getElementById(containerId) : 
      document.querySelector(`[data-garment-id="${garmentId}"] .distribution-chart-container`);
    
    if (!container) {
      console.warn(`Chart container not found for garment ${garmentId}`);
      return;
    }

    // Create chart HTML
    const chartHTML = `
      <div class="distribution-analytics-panel">
        <div class="analytics-header">
          <h4>Distribution Analytics</h4>
          <div class="analytics-summary">
            <span class="metric">
              <strong>${analytics.totalQuantity}</strong> Total Units
            </span>
            <span class="metric">
              <strong>${analytics.activeSizes}</strong> Active Sizes
            </span>
            <span class="metric efficiency-${analytics.metrics.efficiency >= 100 ? 'complete' : 'incomplete'}">
              <strong>${analytics.metrics.efficiency}%</strong> Efficiency
            </span>
          </div>
        </div>
        
        <div class="distribution-chart">
          <div class="chart-bars">
            ${analytics.distribution.map(item => `
              <div class="size-bar" data-size="${item.size}">
                <div class="size-bar__fill" style="height: ${item.percentage}%" title="${item.label}"></div>
                <div class="size-bar__label">${item.size}</div>
                <div class="size-bar__value">${item.quantity}</div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="pattern-analysis">
          <div class="pattern-info">
            <span class="pattern-type">${analytics.pattern.type.replace('-', ' ').toUpperCase()}</span>
            <span class="pattern-confidence">${analytics.pattern.confidence}% confidence</span>
          </div>
          <p class="pattern-description">${analytics.pattern.description}</p>
        </div>
        
        ${analytics.recommendations.length > 0 ? `
          <div class="analytics-recommendations">
            <h5>Recommendations</h5>
            ${analytics.recommendations.slice(0, 3).map(rec => `
              <div class="recommendation recommendation--${rec.type}">
                <div class="rec-header">
                  <span class="rec-title">${rec.title}</span>
                  <span class="rec-priority priority--${rec.priority}">${rec.priority}</span>
                </div>
                <p class="rec-message">${rec.message}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;

    container.innerHTML = chartHTML;
    
    // Add animation after render
    setTimeout(() => {
      const bars = container.querySelectorAll('.size-bar__fill');
      bars.forEach((bar, index) => {
        setTimeout(() => {
          bar.style.opacity = '1';
          bar.style.transform = 'scaleY(1)';
          // The height is already set in the HTML, just need to trigger the animation
        }, index * 100);
      });
    }, 100);

    console.log(`📊 Rendered distribution chart for garment ${garmentId}`);
    return analytics;
  }

  /**
   * Generate aggregate analytics across all garments
   */
  generateAggregateAnalytics() {
    const allGarments = Array.from(V10_State.garments.values());
    if (allGarments.length === 0) {
      return null;
    }

    const analytics = allGarments.map(garment => 
      this.generateDistributionAnalytics(garment.id)
    ).filter(a => a !== null);

    if (analytics.length === 0) {
      return null;
    }

    // Aggregate totals
    const totalUnits = analytics.reduce((sum, a) => sum + a.totalQuantity, 0);
    const totalGarments = analytics.length;
    const averageUnitsPerGarment = Math.round(totalUnits / totalGarments);
    
    // Most common patterns
    const patterns = analytics.map(a => a.pattern.type);
    const patternCounts = patterns.reduce((acc, pattern) => {
      acc[pattern] = (acc[pattern] || 0) + 1;
      return acc;
    }, {});
    
    const mostCommonPattern = Object.entries(patternCounts)
      .sort(([,a], [,b]) => b - a)[0];

    // Average efficiency
    const avgEfficiency = Math.round(
      analytics.reduce((sum, a) => sum + a.metrics.efficiency, 0) / analytics.length
    );

    // Size utilization summary
    const avgSizeCount = Math.round(
      analytics.reduce((sum, a) => sum + a.activeSizes, 0) / analytics.length
    );

    return {
      totalUnits,
      totalGarments,
      averageUnitsPerGarment,
      avgEfficiency,
      avgSizeCount,
      mostCommonPattern: {
        type: mostCommonPattern[0],
        count: mostCommonPattern[1],
        percentage: Math.round((mostCommonPattern[1] / analytics.length) * 100)
      },
      garmentAnalytics: analytics,
      overallHealth: this.calculateOverallHealth(analytics)
    };
  }

  /**
   * Calculate overall health score for the quantity distribution
   */
  calculateOverallHealth(analytics) {
    if (analytics.length === 0) return 0;

    // Weight different factors
    const avgEfficiency = analytics.reduce((sum, a) => sum + a.metrics.efficiency, 0) / analytics.length;
    const avgBalance = analytics.reduce((sum, a) => sum + a.metrics.balance, 0) / analytics.length;
    const avgSizeUtilization = analytics.reduce((sum, a) => sum + a.metrics.sizeUtilization, 0) / analytics.length;

    // Calculate weighted score
    const healthScore = (
      (avgEfficiency * 0.4) + // 40% weight on meeting minimums
      (avgBalance * 0.3) + // 30% weight on distribution balance
      (avgSizeUtilization * 0.3) // 30% weight on size optimization
    );

    return Math.min(100, Math.max(0, Math.round(healthScore)));
  }

  /**
   * Render aggregate analytics dashboard
   */
  renderAggregateAnalytics(containerId = 'aggregate-analytics-container') {
    const aggregate = this.generateAggregateAnalytics();
    if (!aggregate) {
      console.warn('No aggregate analytics data available');
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Aggregate analytics container '${containerId}' not found`);
      return;
    }

    const dashboardHTML = `
      <div class="aggregate-analytics-dashboard">
        <div class="dashboard-header">
          <h3>Quantity Distribution Summary</h3>
          <div class="overall-health">
            <div class="health-score health-score--${aggregate.overallHealth >= 80 ? 'excellent' : aggregate.overallHealth >= 60 ? 'good' : 'needs-improvement'}">
              ${aggregate.overallHealth}/100
            </div>
            <span class="health-label">Overall Health</span>
          </div>
        </div>
        
        <div class="dashboard-metrics">
          <div class="metric-card">
            <div class="metric-value">${aggregate.totalUnits.toLocaleString()}</div>
            <div class="metric-label">Total Units</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${aggregate.totalGarments}</div>
            <div class="metric-label">Garments</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${aggregate.averageUnitsPerGarment}</div>
            <div class="metric-label">Avg per Garment</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${aggregate.avgEfficiency}%</div>
            <div class="metric-label">Avg Efficiency</div>
          </div>
        </div>
        
        <div class="pattern-summary">
          <h4>Distribution Patterns</h4>
          <div class="pattern-breakdown">
            <div class="dominant-pattern">
              <span class="pattern-name">${aggregate.mostCommonPattern.type.replace('-', ' ').toUpperCase()}</span>
              <span class="pattern-percentage">${aggregate.mostCommonPattern.percentage}% of garments</span>
            </div>
          </div>
        </div>
        
        <div class="garment-analytics-grid">
          ${aggregate.garmentAnalytics.map(analytics => `
            <div class="garment-analytics-summary" data-garment-id="${analytics.garmentId}">
              <div class="summary-header">
                <span class="garment-name">Garment ${V10_State.garments.get(analytics.garmentId)?.number || '?'}</span>
                <span class="efficiency-badge efficiency--${analytics.metrics.efficiency >= 100 ? 'complete' : 'incomplete'}">
                  ${analytics.metrics.efficiency}%
                </span>
              </div>
              <div class="summary-stats">
                <span>${analytics.totalQuantity} units</span>
                <span>${analytics.activeSizes} sizes</span>
                <span>${analytics.pattern.type}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.innerHTML = dashboardHTML;
    console.log('📊 Rendered aggregate analytics dashboard');
    return aggregate;
  }

  // ==============================================
  // QUANTITY FORMS MANAGEMENT
  // ==============================================

  // Removed duplicate populateQuantityForms - using populateQuantityStudio instead

  // Removed duplicate createQuantityForm - using createProfessionalQuantityCard instead

  /**
   * Initialize event handlers for quantity inputs and preset buttons
   */
  initializeQuantityHandlers() {
    // Size quantity inputs
    document.querySelectorAll('.size-quantity-input').forEach(input => {
      input.addEventListener('input', (e) => {
        this.handleQuantityChange(e);
      });

      input.addEventListener('blur', (e) => {
        this.handleQuantityBlur(e);
      });
    });

    // Preset application buttons
    document.querySelectorAll('.preset-option').forEach(button => {
      button.addEventListener('click', (e) => {
        this.handlePresetApplication(e);
      });
    });

    // Clear garment quantities
    document.querySelectorAll('.clear-garment-quantities').forEach(button => {
      button.addEventListener('click', (e) => {
        this.handleClearGarment(e);
      });
    });
  }

  /**
   * Handle quantity input changes with real-time updates
   */
  handleQuantityChange(event) {
    const input = event.target;
    const garmentCard = input.closest('.garment-quantity-card');
    if (!garmentCard) return;

    const garmentId = garmentCard.getAttribute('data-garment-id');
    const size = input.getAttribute('data-size');
    const quantity = Math.max(0, parseInt(input.value) || 0);

    // Update state
    this.updateGarmentQuantity(garmentId, size, quantity);

    // Update totals and validation
    this.updateGarmentTotal(garmentId);
    this.updateAllQuantityStats();
    this.validateQuantityRequirements();
  }

  /**
   * Update garment quantity in state
   */
  updateGarmentQuantity(garmentId, size, quantity) {
    if (!V10_State.quantities.garments.has(garmentId)) {
      V10_State.quantities.garments.set(garmentId, {
        sizes: {},
        total: 0,
        validation: {},
        colorwayCount: this.getColorwayCount(garmentId)
      });
    }

    const garmentData = V10_State.quantities.garments.get(garmentId);
    garmentData.sizes[size] = quantity;

    // Calculate total for this garment
    garmentData.total = Object.values(garmentData.sizes).reduce((sum, qty) => sum + (qty || 0), 0);
  }

  /**
   * Update garment total display
   */
  updateGarmentTotal(garmentId) {
    const garmentCard = document.querySelector(`.garment-quantity-card[data-garment-id="${garmentId}"]`);
    if (!garmentCard) return;

    const garmentData = V10_State.quantities.garments.get(garmentId);
    if (!garmentData) return;

    // Find total display element (may vary by template version)
    const totalElements = garmentCard.querySelectorAll('[class*="total"], [id*="total"]');
    totalElements.forEach(element => {
      element.textContent = garmentData.total;
    });
  }

  /**
   * Update all quantity statistics
   */
  updateAllQuantityStats() {
    let totalUnits = 0;
    let garmentCount = 0;
    let totalColorways = 0;
    let totalMinimum = 0;

    // Calculate totals across all garments
    V10_State.quantities.garments.forEach((data, garmentId) => {
      if (data.total > 0) {
        totalUnits += data.total;
        garmentCount++;
      }
      totalColorways += data.colorwayCount || 1;

      // Calculate minimum for this garment
      const garment = V10_State.garments.get(garmentId);
      if (garment) {
        const productionType = this.determineProductionType(garment);
        const garmentMinimum = this.getMinimumQuantity(data.colorwayCount || 1, productionType, garment.type);
        totalMinimum += garmentMinimum;
      }
    });

    // Update global state
    V10_State.quantities.globalTotal = totalUnits;
    V10_State.quantities.globalMinimum = totalMinimum;
    V10_State.quantities.progressPercentage = totalMinimum > 0 ? Math.min((totalUnits / totalMinimum) * 100, 100) : 0;

    // Update UI displays
    this.updateQuantityStats(totalUnits, garmentCount, totalColorways, totalMinimum);
    this.updateProgressBar(totalUnits, totalMinimum);
  }

  /**
   * Validate quantity requirements and update UI
   */
  validateQuantityRequirements() {
    const isValid = V10_State.quantities.globalTotal >= V10_State.quantities.globalMinimum;
    const completionBadge = document.getElementById('quantities-completion-badge');
    
    if (completionBadge) {
      if (isValid) {
        completionBadge.textContent = 'COMPLETE';
        completionBadge.className = 'studio-header__badge studio-header__badge--complete';
      } else {
        completionBadge.textContent = 'INCOMPLETE';
        completionBadge.className = 'studio-header__badge studio-header__badge--incomplete';
      }
    }

    return isValid;
  }

  /**
   * Handle preset application to specific garment
   */
  handlePresetApplication(event) {
    const button = event.target.closest('.preset-option');
    const garmentCard = button.closest('.garment-quantity-card');
    
    if (!button || !garmentCard) return;

    const presetName = button.getAttribute('data-preset');
    const garmentId = garmentCard.getAttribute('data-garment-id');

    this.applyPresetToGarment(garmentId, presetName);
    this.refreshGarmentForm(garmentId);
  }

  /**
   * Refresh garment form display after changes
   */
  refreshGarmentForm(garmentId) {
    const garmentCard = document.querySelector(`.garment-quantity-card[data-garment-id="${garmentId}"]`);
    if (!garmentCard) return;

    const garmentData = V10_State.quantities.garments.get(garmentId);
    if (!garmentData) return;

    // Update all size inputs
    V10_QUANTITY_CONFIG.sizeKeys.forEach(sizeKey => {
      const input = garmentCard.querySelector(`[data-size="${sizeKey}"]`);
      if (input) {
        input.value = garmentData.sizes[sizeKey] || 0;
      }
    });

    // Update total and validation
    this.updateGarmentTotal(garmentId);
    this.updateAllQuantityStats();
    this.validateQuantityRequirements();
  }
}

// ==============================================
// V10 GARMENT UI MANAGER - DOM Rendering Layer
// ==============================================

/**
 * V10_GarmentUIManager - UI Rendering Layer  
 * Handles DOM rendering, template population, and visual updates
 * Uses template-driven approach to replace HTML string concatenation
 */
class V10_GarmentUIManager {
  constructor() {
    this.templates = {
      garmentCard: null,
      fabricGrid: null,
      sampleTypeOptions: null
    };
    
    this.initializeTemplates();
  }
  
  initializeTemplates() {
    // Cache template references for performance
    this.templates.garmentCard = document.getElementById('V10-garment-template');
    if (!this.templates.garmentCard) {
      console.error('❌ V10-garment-template not found');
    }
  }
  
  /**
   * Render garment using template-driven approach
   * Replaces the massive 556-line renderGarment method
   */
  renderGarment(garmentData) {
    try {
      console.log('🔄 [UI] Rendering garment:', garmentData);
      
      if (!this.templates.garmentCard) {
        console.error('❌ Garment template not available');
        return null;
      }

      if (!garmentData || !garmentData.id) {
        console.error('❌ Invalid garment data provided:', garmentData);
        return null;
      }

      const clone = this.templates.garmentCard.content.cloneNode(true);
      const garmentCard = clone.querySelector('.garment-card');
      
      if (!garmentCard) {
        console.error('❌ Garment card element not found in template');
        return null;
      }

      // Set garment ID and number
      garmentCard.dataset.garmentId = garmentData.id;
      this.setGarmentNumber(clone, garmentData);
      
      // Setup unique radio names
      this.setupRadioNames(clone, garmentData.id);
      
      // Populate fabric options if garment type exists
      if (garmentData.type) {
        this.populateFabricOptions(garmentCard, garmentData.type);
      }
      
      // Set current values
      this.setGarmentValues(clone, garmentData);
      
      // Update pricing and visibility
      this.updateSampleTypePrices(garmentCard);
      this.updateSectionVisibility(garmentCard);
      
      console.log('✅ [UI] Garment rendered successfully');
      return clone;
      
    } catch (error) {
      console.error('❌ [UI] Error rendering garment:', error);
      return null;
    }
  }
  
  /**
   * Set garment number in template
   */
  setGarmentNumber(clone, garmentData) {
    const numberSpan = clone.querySelector('.garment-card__number');
    if (numberSpan) {
      numberSpan.textContent = `Garment ${garmentData.number}`;
    }
  }
  
  /**
   * Setup unique radio button names per garment
   */
  setupRadioNames(clone, garmentId) {
    const radioGroups = [
      { selector: 'input[name="garmentType"]', name: `garmentType-${garmentId}` },
      { selector: 'input[name="sampleType"]', name: `sampleType-${garmentId}` },
      { selector: 'input[name="sampleReference"]', name: `sampleReference-${garmentId}` }
    ];
    
    radioGroups.forEach(({ selector, name }) => {
      clone.querySelectorAll(selector).forEach(input => {
        input.name = name;
      });
    });
  }
  
  /**
   * Populate fabric options using template-driven approach
   */
  populateFabricOptions(garmentCard, garmentType) {
    try {
      const fabricGrid = garmentCard.querySelector('#fabric-type-grid');
      if (!fabricGrid) {
        console.warn('❌ [UI] Fabric grid not found');
        return;
      }

      const garmentId = garmentCard.dataset.garmentId;
      const fabrics = V10_CONFIG.FABRIC_TYPE_MAPPING[garmentType] || [];
      
      if (fabrics.length === 0) {
        fabricGrid.innerHTML = '<p class="no-fabrics">No fabric options available for this garment type.</p>';
        return;
      }
      
      const isCompactInterface = fabricGrid.classList.contains('compact-radio-grid');
      const template = isCompactInterface ? 'compact-radio-card' : 'radio-card';
      
      fabricGrid.innerHTML = fabrics.map(fabric => 
        this.createFabricOptionHTML(fabric, garmentId, template)
      ).join('');
      
      // Add event listeners for restrictions
      this.addFabricChangeListeners(fabricGrid, garmentCard);
      
      console.log(`✅ [UI] Populated ${fabrics.length} fabric options`);
      
    } catch (error) {
      console.error('❌ [UI] Error populating fabric options:', error);
    }
  }

  /**
   * 🎯 Populate demo fabric options during tour mode
   * Provides sample fabric options for demonstration when no garment type is selected
   */
  populateDemoFabricOptions(garmentCard) {
    try {
      const fabricGrid = garmentCard.querySelector('#fabric-type-grid');
      if (!fabricGrid) {
        console.warn('❌ [UI] Fabric grid not found during tour');
        return;
      }

      const garmentId = garmentCard.dataset.garmentId;

      // Demo fabric options for tour demonstration
      const demoFabrics = [
        '100% Cotton',
        '100% Polyester',
        'Cotton/Polyester Blend',
        'Premium Cotton',
        'Organic Cotton'
      ];

      const isCompactInterface = fabricGrid.classList.contains('compact-radio-grid');
      const template = isCompactInterface ? 'compact-radio-card' : 'radio-card';

      fabricGrid.innerHTML = demoFabrics.map(fabric =>
        this.createFabricOptionHTML(fabric, garmentId, template)
      ).join('');

      // Add event listeners for restrictions
      this.addFabricChangeListeners(fabricGrid, garmentCard);

      console.log(`✅ [TOUR] Populated ${demoFabrics.length} demo fabric options for tour`);

    } catch (error) {
      console.error('❌ [TOUR] Error populating demo fabric options:', error);
    }
  }

  /**
   * Create fabric option HTML using template approach
   */
  createFabricOptionHTML(fabric, garmentId, template) {
    const icon = this.getFabricTypeIcon(fabric);
    
    if (template === 'compact-radio-card') {
      return `
        <label class="compact-radio-card">
          <input type="radio" name="fabricType-${garmentId}" value="${fabric}">
          <span class="compact-radio-card__content">
            <span class="compact-radio-card__icon">${icon}</span>
            <span class="compact-radio-card__name">${fabric}</span>
          </span>
        </label>`;
    } else {
      return `
        <label class="radio-card">
          <input type="radio" name="fabricType-${garmentId}" value="${fabric}">
          <span class="radio-card__content">
            <span class="radio-card__icon">${icon}</span>
            <span class="radio-card__name">${fabric}</span>
          </span>
        </label>`;
    }
  }
  
  /**
   * Add event listeners for fabric restrictions
   */
  addFabricChangeListeners(fabricGrid, garmentCard) {
    const fabricInputs = fabricGrid.querySelectorAll('input[type="radio"]');
    fabricInputs.forEach(input => {
      input.addEventListener('change', () => {
        setTimeout(() => {
          V10_Utils.updateGarmentFabricRestrictions(garmentCard);
        }, 50);
      });
    });
  }
  
  /**
   * Set garment values in template
   */
  setGarmentValues(clone, garmentData) {
    this.setGarmentType(clone, garmentData);
    this.setFabricType(clone, garmentData);
    this.setSampleType(clone, garmentData);
    this.setSampleReference(clone, garmentData);
    
    // Apply cotton validation after setting values
    if (garmentData.fabricType) {
      // Get the actual garment card element from the clone
      const garmentCard = clone.querySelector ? clone.querySelector('.garment-card') : clone;
      if (garmentCard) {
        V10_Utils.updateGarmentFabricRestrictions(garmentCard);
      }
    }
  }
  
  /**
   * Set garment type value
   */
  setGarmentType(clone, garmentData) {
    if (garmentData.type) {
      const input = clone.querySelector(`input[value="${garmentData.type}"]`);
      if (input) {
        input.checked = true;
        this.updateGarmentSelectionDisplay(clone, 'garment', garmentData.type);
      }
    }
  }
  
  /**
   * Set fabric type value
   */
  setFabricType(clone, garmentData) {
    // Only restore fabric type if garment type is set and fabric type is valid
    if (garmentData.fabricType && garmentData.type) {
      const input = clone.querySelector(`input[value="${garmentData.fabricType}"]`);
      if (input) {
        input.checked = true;
        this.updateGarmentSelectionDisplay(clone, 'fabric', garmentData.fabricType);
      }
    } else if (garmentData.fabricType && !garmentData.type) {
      // If fabric type is set but garment type is not, clear the fabric type from state
      garmentData.fabricType = null;
      console.log('🧹 Cleared invalid fabric type (no garment type dependency)');
    }
  }
  
  /**
   * Set sample type value with sub-value matching
   */
  setSampleType(clone, garmentData) {
    // Only restore sample type if both garment type and fabric type are set
    if (garmentData.sampleType && garmentData.type && garmentData.fabricType) {
      let input;
      
      if (garmentData.hasOwnProperty('sampleSubValue') && 
          garmentData.sampleSubValue !== null && 
          garmentData.sampleSubValue !== undefined) {
        input = clone.querySelector(`input[value="${garmentData.sampleType}"][data-sub-value="${garmentData.sampleSubValue}"]`);
      } else {
        input = clone.querySelector(`input[value="${garmentData.sampleType}"]`);
      }
      
      if (input) {
        input.checked = true;
        // Note: updateCompactSelection will be called after DOM insertion in main class
        // to avoid clone/garmentCard mismatch issues
      }
    } else if (garmentData.sampleType && (!garmentData.type || !garmentData.fabricType)) {
      // If sample type is set but dependencies are missing, clear the sample state
      garmentData.sampleType = null;
      garmentData.sampleSubValue = null;
      console.log('🧹 Cleared invalid sample type (missing garment/fabric type dependencies)');
    }
  }
  
  /**
   * Set sample reference value
   */
  setSampleReference(clone, garmentData) {
    if (garmentData.sampleReference) {
      const input = clone.querySelector(`input[value="${garmentData.sampleReference}"]`);
      if (input) {
        input.checked = true;
        this.updateGarmentSelectionDisplay(clone, 'sampleReference', garmentData.sampleReference);
      }
    }
  }
  
  /**
   * Update section visibility based on request type
   */
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
      
      section.style.display = shouldShow ? '' : 'none';
    });
  }
  
  /**
   * Update sample type prices
   */
  updateSampleTypePrices(clone) {
    V10_Utils.updateSampleTypePrices(clone);
  }
  
  /**
   * Update garment selection display for garment/fabric widgets
   */
  updateGarmentSelectionDisplay(clone, type, value) {
    if (type === 'garment') {
      this.updateSelectionWidget(clone, {
        iconSelector: '#garment-selected-icon',
        nameSelector: '#garment-selected-name', 
        placeholderSelector: '#garment-placeholder',
        displaySelector: '#garment-display'
      }, value, this.getGarmentIcon(value));
    } else if (type === 'fabric') {
      this.updateSelectionWidget(clone, {
        iconSelector: '#fabric-selected-icon',
        nameSelector: '#fabric-selected-name',
        placeholderSelector: '#fabric-placeholder', 
        displaySelector: '#fabric-display'
      }, value, this.getFabricTypeIcon(value));
    } else if (type === 'sampleReference') {
      this.updateSelectionWidget(clone, {
        iconSelector: '#sample-reference-selected-icon',
        nameSelector: '#sample-reference-selected-name',
        placeholderSelector: '#sample-reference-placeholder',
        displaySelector: '#sample-reference-display'
      }, window.v10GarmentStudio.getSampleReferenceDisplayName(value), window.v10GarmentStudio.getSampleReferenceIcon(value));
    }
  }
  
  /**
   * Update selection widget elements
   */
  updateSelectionWidget(clone, selectors, value, icon) {
    const elements = {};
    Object.keys(selectors).forEach(key => {
      elements[key] = clone.querySelector(selectors[key]);
    });
    
    if (elements.iconSelector) elements.iconSelector.innerHTML = icon;
    if (elements.nameSelector) elements.nameSelector.textContent = value;
    if (elements.placeholderSelector) elements.placeholderSelector.style.display = 'none';
    if (elements.displaySelector) elements.displaySelector.style.display = 'block';
  }
  
  // Icon getter methods (delegated from main class)
  getGarmentIcon(garmentType) {
    const studioInstance = V10_GarmentStudio.getInstance();
    return studioInstance?.getGarmentIcon?.(garmentType) || '👕';
  }
  
  getFabricTypeIcon(fabricType) {
    const studioInstance = V10_GarmentStudio.getInstance();
    return studioInstance?.getFabricTypeIcon?.(fabricType) || '🧵';
  }
  
  /**
   * Initialize garment selection workflow dependencies
   * Implements: Type → Fabric → Sample dependency chain
   */
  initializeSelectionWorkflow(garmentCard) {
    // Initially disable fabric and sample selections
    this.disableFabricSelection(garmentCard);
    this.disableSampleSelection(garmentCard);
    
    console.log('✅ [UI] Selection workflow initialized');
  }
  
  /**
   * Update selection dependencies based on current state
   */
  updateSelectionDependencies(garmentCard, garmentData) {
    const requestType = V10_State.requestType;

    // 🎯 TOUR EXEMPTION: During garment studio tour, bypass fabric type restriction
    const isTourActive = document.body.classList.contains('onboarding-active');
    const isDemoGarment = garmentData.isTourDemo;

    // Enable/disable fabric selection based on garment type OR if it's a tour demo garment
    if (garmentData.type || isTourActive || isDemoGarment) {
      this.enableFabricSelection(garmentCard);
      // Populate fabric options - use demo fabrics for tour demo garments
      if (garmentData.type && !isDemoGarment) {
        this.populateFabricOptions(garmentCard, garmentData.type);
      } else if (isTourActive || isDemoGarment) {
        // During tour or for demo garments, populate with demo fabric options for demonstration
        this.populateDemoFabricOptions(garmentCard);
      }
    } else {
      this.disableFabricSelection(garmentCard);
      this.disableSampleSelection(garmentCard);
      if (requestType === 'bulk-order-request') {
        this.disableSampleReferenceSelection(garmentCard);
        this.resetSampleReferenceSelection(garmentCard);
      }
      return;
    }
    
    // Enable/disable sample selection based on fabric type (for sample-request)
    if (requestType === 'sample-request') {
      if (garmentData.fabricType) {
        this.enableSampleSelection(garmentCard, garmentData.fabricType);
      } else {
        this.disableSampleSelection(garmentCard);
      }
    }
    
    // Enable/disable sample reference selection based on garment type (for bulk-order-request)
    if (requestType === 'bulk-order-request') {
      if (garmentData.type) {
        this.enableSampleReferenceSelection(garmentCard);
      } else {
        this.disableSampleReferenceSelection(garmentCard);
        this.resetSampleReferenceSelection(garmentCard);
      }
    }
    
    console.log('🔄 [UI] Selection dependencies updated');
  }
  
  /**
   * Enable fabric selection
   */
  enableFabricSelection(garmentCard) {
    const fabricCollapsed = garmentCard.querySelector('#fabric-collapsed');
    const fabricPlaceholder = garmentCard.querySelector('#fabric-placeholder');
    
    if (fabricCollapsed) {
      fabricCollapsed.style.opacity = '1';
      fabricCollapsed.style.pointerEvents = 'auto';
    }
    if (fabricPlaceholder) {
      fabricPlaceholder.style.cursor = 'pointer';
      const placeholderText = fabricPlaceholder.querySelector('.placeholder-text');
      const placeholderIcon = fabricPlaceholder.querySelector('.placeholder-icon');
      
      if (placeholderText) {
        placeholderText.textContent = 'Select fabric type';
      }
      if (placeholderIcon) {
        // Use SVG icon for fabric placeholder
        placeholderIcon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M12 14v8"/><path d="M8 14l-2 2-2-2"/><path d="M16 14l2 2 2-2"/></svg>';
      }
    }
  }
  
  /**
   * Disable fabric selection
   */
  disableFabricSelection(garmentCard) {
    const fabricCollapsed = garmentCard.querySelector('#fabric-collapsed');
    const fabricPlaceholder = garmentCard.querySelector('#fabric-placeholder');
    
    if (fabricCollapsed) {
      fabricCollapsed.style.opacity = '0.5';
      fabricCollapsed.style.pointerEvents = 'none';
    }
    if (fabricPlaceholder) {
      fabricPlaceholder.style.cursor = 'not-allowed';
      const placeholderText = fabricPlaceholder.querySelector('.placeholder-text');
      const placeholderIcon = fabricPlaceholder.querySelector('.placeholder-icon');
      
      if (placeholderText) {
        placeholderText.textContent = 'Select garment type first';
      }
      if (placeholderIcon) {
        // Use SVG icon for disabled state
        placeholderIcon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>';
      }
    }
  }
  
  /**
   * Enable sample selection based on fabric type
   */
  enableSampleSelection(garmentCard, fabricType) {
    // Cotton and 100% Polyester fabrics: enable both stock and custom
    // Other fabrics: only stock colors
    const isAllowedForCustom = fabricType && (
      fabricType.toLowerCase().includes('cotton') || 
      fabricType.toLowerCase().includes('100% polyester')
    );
    
    const stockSection = garmentCard.querySelector('#sample-stock-collapsed');
    const customSection = garmentCard.querySelector('#sample-custom-collapsed');
    
    // Always enable stock colors
    if (stockSection) {
      stockSection.style.opacity = '1';
      stockSection.style.pointerEvents = 'auto';
    }
    
    // Enable/disable custom based on allowed fabrics
    if (customSection) {
      if (isAllowedForCustom) {
        customSection.style.opacity = '1';
        customSection.style.pointerEvents = 'auto';
      } else {
        customSection.style.opacity = '0.5';
        customSection.style.pointerEvents = 'none';
      }
    }
  }
  
  /**
   * Disable sample selection
   */
  disableSampleSelection(garmentCard) {
    const stockSection = garmentCard.querySelector('#sample-stock-collapsed');
    const customSection = garmentCard.querySelector('#sample-custom-collapsed');
    
    if (stockSection) {
      stockSection.style.opacity = '0.5';
      stockSection.style.pointerEvents = 'none';
    }
    if (customSection) {
      customSection.style.opacity = '0.5';
      customSection.style.pointerEvents = 'none';
    }
  }
  
  /**
   * Reset fabric selection to placeholder
   */
  resetFabricSelection(garmentCard) {
    const fabricPlaceholder = garmentCard.querySelector('#fabric-placeholder');
    const fabricDisplay = garmentCard.querySelector('#fabric-display');
    const fabricSelectedName = garmentCard.querySelector('#fabric-selected-name');
    const fabricSelectedIcon = garmentCard.querySelector('#fabric-selected-icon');
    
    // Clear all fabric display content
    if (fabricSelectedName) fabricSelectedName.textContent = '';
    if (fabricSelectedIcon) fabricSelectedIcon.innerHTML = '';
    if (fabricPlaceholder) fabricPlaceholder.style.display = 'flex';
    if (fabricDisplay) fabricDisplay.style.display = 'none';
    
    // Uncheck any fabric type radio buttons
    const fabricInputs = garmentCard.querySelectorAll('input[name*=\"fabricType\"]');
    fabricInputs.forEach(input => {
      input.checked = false;
      // Remove visual selection classes
      const parentLabel = input.closest('label');
      if (parentLabel) {
        parentLabel.classList.remove('selected', 'active', 'compact-radio-card--selected');
      }
    });
    
    // Clear compact selection state
    const fabricSection = garmentCard.querySelector('#fabric-collapsed')?.closest('.compact-selection-section');
    if (fabricSection) {
      fabricSection.classList.remove('compact-selection-section--selected');
    }
    
    // Also reset to disabled state and ensure proper placeholder text
    this.disableFabricSelection(garmentCard);
    
    console.log('🧹 Complete fabric selection reset performed');
  }
  
  /**
   * Reset sample selection to placeholder
   */
  resetSampleSelection(garmentCard) {
    // Reset both stock and custom selections
    const stockPlaceholder = garmentCard.querySelector('#sample-stock-placeholder');
    const stockDisplay = garmentCard.querySelector('#sample-stock-display');
    const customPlaceholder = garmentCard.querySelector('#sample-custom-placeholder');
    const customDisplay = garmentCard.querySelector('#sample-custom-display');
    
    // Reset stock display and clear any selected values
    if (stockPlaceholder) stockPlaceholder.style.display = 'flex';
    if (stockDisplay) {
      stockDisplay.style.display = 'none';
      // Clear any displayed text
      const stockSelectedName = stockDisplay.querySelector('#sample-stock-selected-name');
      if (stockSelectedName) stockSelectedName.textContent = '';
    }
    
    // Reset custom display and clear any selected values
    if (customPlaceholder) customPlaceholder.style.display = 'flex';
    if (customDisplay) {
      customDisplay.style.display = 'none';
      // Clear any displayed text
      const customSelectedName = customDisplay.querySelector('#sample-custom-selected-name');
      if (customSelectedName) customSelectedName.textContent = '';
    }
    
    // Uncheck ALL sample type radio buttons thoroughly
    const sampleInputs = garmentCard.querySelectorAll('input[name*=\"sampleType\"], input[value*=\"stock\"], input[value*=\"custom\"]');
    sampleInputs.forEach(input => {
      input.checked = false;
      // Also remove any visual selection classes
      const parentLabel = input.closest('label');
      if (parentLabel) {
        parentLabel.classList.remove('selected', 'active', 'sample-option--selected');
      }
    });
    
    // Clear any compact selection state for sample types
    garmentCard.querySelectorAll('.compact-selection-section').forEach(section => {
      if (section.id && (section.id.includes('sample') || section.id.includes('stock') || section.id.includes('custom'))) {
        section.classList.remove('compact-selection-section--selected');
      }
    });
    
    // Also reset to disabled state
    this.disableSampleSelection(garmentCard);
    
    console.log('🧹 Complete sample selection reset performed');
  }
  
  /**
   * Reset sample reference selection to placeholder (bulk orders)
   */
  resetSampleReferenceSelection(garmentCard) {
    const placeholder = garmentCard.querySelector('#sample-reference-placeholder');
    const display = garmentCard.querySelector('#sample-reference-display');
    const selectedIcon = garmentCard.querySelector('#sample-reference-selected-icon');
    const selectedName = garmentCard.querySelector('#sample-reference-selected-name');
    
    // Show placeholder, hide display
    if (placeholder) placeholder.style.display = 'flex';
    if (display) display.style.display = 'none';
    
    // Reset display content to defaults
    if (selectedIcon) selectedIcon.innerHTML = '📋';
    if (selectedName) selectedName.textContent = 'Select sample reference';
    
    // Uncheck all sample reference radio buttons
    const sampleReferenceInputs = garmentCard.querySelectorAll('input[name*="sampleReference"]');
    sampleReferenceInputs.forEach(input => {
      input.checked = false;
      const parentLabel = input.closest('label');
      if (parentLabel) {
        parentLabel.classList.remove('selected', 'active');
      }
    });
    
    // Disable sample reference selection
    this.disableSampleReferenceSelection(garmentCard);
    
    console.log('🧹 Sample reference selection reset performed');
  }
  
  /**
   * Disable sample reference selection
   */
  disableSampleReferenceSelection(garmentCard) {
    const collapsed = garmentCard.querySelector('#sample-reference-collapsed');
    const inputs = garmentCard.querySelectorAll('input[name*="sampleReference"]');
    
    if (collapsed) {
      collapsed.classList.add('disabled');
      collapsed.style.pointerEvents = 'none';
      collapsed.style.opacity = '0.5';
    }
    
    inputs.forEach(input => {
      input.disabled = true;
    });
  }
  
  /**
   * Enable sample reference selection
   */
  enableSampleReferenceSelection(garmentCard) {
    const collapsed = garmentCard.querySelector('#sample-reference-collapsed');
    const inputs = garmentCard.querySelectorAll('input[name*="sampleReference"]');
    
    if (collapsed) {
      collapsed.classList.remove('disabled');
      collapsed.style.pointerEvents = '';
      collapsed.style.opacity = '';
    }
    
    inputs.forEach(input => {
      input.disabled = false;
    });
  }
  
  /**
   * Handle sample type cross-selection reset
   * When user selects one sample type, reset the other
   */
  handleSampleTypeCrossReset(garmentCard, selectedType) {
    const garmentId = garmentCard.dataset.garmentId;
    const garmentData = V10_State.garments.get(garmentId);
    
    if (selectedType === 'stock') {
      // User selected stock, reset custom
      const customPlaceholder = garmentCard.querySelector('#sample-custom-placeholder');
      const customDisplay = garmentCard.querySelector('#sample-custom-display');
      const customInputs = garmentCard.querySelectorAll('input[name*=\"sampleType\"][value=\"custom\"]');
      const customSelectedName = garmentCard.querySelector('#sample-custom-selected-name');
      const customSelectedIcon = garmentCard.querySelector('#sample-custom-selected-icon');

      // Clear display text and icon FIRST
      if (customSelectedName) customSelectedName.textContent = '';
      if (customSelectedIcon) customSelectedIcon.innerHTML = '';

      // Reset visual state
      if (customPlaceholder) customPlaceholder.style.display = 'flex';
      if (customDisplay) customDisplay.style.display = 'none';
      customInputs.forEach(input => input.checked = false);
      
      // Clear any previous custom selection from state if it existed
      if (garmentData && garmentData.sampleType === 'custom') {
        console.log(`🔄 Cross-reset: Clearing previous custom selection from garment ${garmentId}`);
        garmentData.sampleType = '';
        garmentData.sampleSubValue = undefined;
      }
      
    } else if (selectedType === 'custom') {
      // User selected custom, reset stock
      const stockPlaceholder = garmentCard.querySelector('#sample-stock-placeholder');
      const stockDisplay = garmentCard.querySelector('#sample-stock-display');
      const stockInputs = garmentCard.querySelectorAll('input[name*=\"sampleType\"][value=\"stock\"]');
      const stockSelectedName = garmentCard.querySelector('#sample-stock-selected-name');
      const stockSelectedIcon = garmentCard.querySelector('#sample-stock-selected-icon');

      // Clear display text and icon FIRST
      if (stockSelectedName) stockSelectedName.textContent = '';
      if (stockSelectedIcon) stockSelectedIcon.innerHTML = '';


      // Reset visual state     
      if (stockPlaceholder) stockPlaceholder.style.display = 'flex';
      if (stockDisplay) stockDisplay.style.display = 'none';
      stockInputs.forEach(input => input.checked = false);

      // Remove visual selection from stock radio cards
      const stockCards = garmentCard.querySelectorAll('#sample-stock-grid .compact-radio-card');
      stockCards.forEach(card => card.classList.remove('compact-radio-card--selected'));      

      // Clear any previous stock selection from state if it existed
      if (garmentData && garmentData.sampleType === 'stock') {
        console.log(`🔄 Cross-reset: Clearing previous stock selection from garment ${garmentId}`);
        garmentData.sampleType = '';
        garmentData.sampleSubValue = undefined;
      }
    }
  }
  
  // Compact selection methods (simplified versions)
  updateCompactSelection(type, value, container, subValue = null, isInitialSet = false) {
    // Delegate to main class for now - will be extracted in next phase
    const studioInstance = V10_GarmentStudio.getInstance();
    if (studioInstance?.updateCompactSelection) {
      return studioInstance.updateCompactSelection(type, value, container, subValue, isInitialSet);
    }
  }
}

// ==============================================
// V10 GARMENT MANAGER - Core Business Logic
// ==============================================

class V10_GarmentManager {
  constructor() {
    this.eventEmitter = new EventTarget();
    this.removing = false; // Prevent concurrent removals
  }

  // Core CRUD Operations
  addGarment(data = null) {
    try {
      
      const garmentId = data?.id || V10_Utils.generateId('garment');
      const garmentNumber = this.getNextGarmentNumber();

      const garmentData = {
        id: garmentId,
        number: garmentNumber,
        type: data?.type || '',
        fabricType: data?.fabricType || '',
        sampleType: data?.sampleType || '',
        sampleSubValue: data?.sampleSubValue || '',
        sampleReference: data?.sampleReference || '',
        assignedLabDips: new Set(data?.assignedLabDips || []),
        assignedDesigns: new Set(data?.assignedDesigns || []),
        isComplete: data?.isComplete || false,
        isInEditMode: data?.isInEditMode || false,
        isDuplicated: data?.isDuplicated || false,
      };

      // Store in global state
      V10_State.garments.set(garmentId, garmentData);

      // Emit event for UI updates
      this.eventEmitter.dispatchEvent(new CustomEvent('garmentAdded', {
        detail: { garmentId, garmentData }
      }));

      return garmentId;
    } catch (error) {
      console.error('Error adding garment:', error);
      return null;
    }
  }

  removeGarment(garmentId) {
    try {
      if (this.removing) return false;
      this.removing = true;

      const garmentData = V10_State.garments.get(garmentId);
      if (!garmentData) {
        this.removing = false;
        return false;
      }

      // EDIT MODE LOCK CLEANUP: Check if this garment is currently being edited
      if (V10_State.editMode.isLocked && V10_State.editMode.currentGarmentId === garmentId) {
        // Clear edit mode lock before removing garment to prevent navigation bugs
        V10_State.editMode.isLocked = false;
        V10_State.editMode.currentGarmentId = null;
        V10_State.editMode.blockedAttempts = 0;
        console.log(`🔓 Edit mode lock cleared before removing garment ${garmentId}`);
      }

      // Check assignments and confirm if needed
      const hasAssignments = garmentData.assignedLabDips.size > 0 || garmentData.assignedDesigns.size > 0;
      
      if (hasAssignments && !this.confirmRemoval(garmentData)) {
        this.removing = false;
        return false;
      }

      // Remove from state
      V10_State.garments.delete(garmentId);

      // Clean up assignments
      this.cleanupGarmentAssignments(garmentId);

      // Emit event for UI updates
      this.eventEmitter.dispatchEvent(new CustomEvent('garmentRemoved', {
        detail: { garmentId }
      }));

      this.removing = false;
      return true;
    } catch (error) {
      console.error('Error removing garment:', error);
      this.removing = false;
      return false;
    }
  }

  duplicateGarment(sourceId) {
    try {
      const sourceGarment = V10_State.garments.get(sourceId);
      if (!sourceGarment) {
        console.error('Source garment not found for ID:', sourceId);
        return null;
      }

      // Create duplicate data (new ID, preserve all specifications and assignments)
      const duplicateData = {
        type: sourceGarment.type,
        fabricType: sourceGarment.fabricType,
        sampleType: sourceGarment.sampleType,
        sampleSubValue: sourceGarment.sampleSubValue,
        sampleReference: sourceGarment.sampleReference,
        // Preserve assignments to maintain completion status
        assignedLabDips: new Set(sourceGarment.assignedLabDips || []),
        assignedDesigns: new Set(sourceGarment.assignedDesigns || []),
        isInEditMode: false,
        // Flag to indicate this garment was duplicated (force summary card display)
        isDuplicated: true
      };

      // Calculate completion based on duplicated garment specifications
      duplicateData.isComplete = this.calculateGarmentCompletion(duplicateData);
      

      console.log('🔄 Duplicating garment with data:', duplicateData);
      const result = this.addGarment(duplicateData);
      
      // Check if completion status was maintained after addGarment
      if (result) {
        const addedGarment = V10_State.garments.get(result);
        
        // Update global assignment tracking and Color Studio if the duplicated garment has lab dip assignments
        if (addedGarment && addedGarment.assignedLabDips && addedGarment.assignedLabDips.size > 0) {
          // Update global assignment tracking for each assigned lab dip
          addedGarment.assignedLabDips.forEach(labDipId => {
            if (!V10_State.assignments.labDips.has(labDipId)) {
              V10_State.assignments.labDips.set(labDipId, new Set());
            }
            V10_State.assignments.labDips.get(labDipId).add(result);
          });
          
          // Update Color Studio display
          if (window.v10ColorStudio?.updateLabDipCollectionAssignments) {
            setTimeout(() => {
              window.v10ColorStudio.updateLabDipCollectionAssignments();
            }, 100);
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error duplicating garment:', error);
      return null;
    }
  }

  // Business Logic Helpers
  getNextGarmentNumber() {
    const existingNumbers = Array.from(V10_State.garments.values())
      .map(g => g.number)
      .sort((a, b) => a - b);
    
    // Find first gap in sequence
    for (let i = 1; i <= existingNumbers.length + 1; i++) {
      if (!existingNumbers.includes(i)) {
        return i;
      }
    }
    return 1;
  }

  renumberGarments() {
    const garments = Array.from(V10_State.garments.values())
      .sort((a, b) => a.number - b.number);

    garments.forEach((garment, index) => {
      const newNumber = index + 1;
      if (garment.number !== newNumber) {
        garment.number = newNumber;
        // Emit update event
        this.eventEmitter.dispatchEvent(new CustomEvent('garmentRenumbered', {
          detail: { garmentId: garment.id, newNumber }
        }));
      }
    });
  }

  validateGarments() {
    const requestType = V10_State.requestType;
    const garments = Array.from(V10_State.garments.values());
    
    if (garments.length === 0) return false;

    return garments.every(garment => this.isGarmentComplete(garment, requestType));
  }

  isGarmentComplete(garment, requestType) {
    if (!garment.type) return false;

    switch (requestType) {
      case 'quotation':
        return garment.type && garment.fabricType;
      case 'sample-request': {
        const basicComplete = garment.type && garment.fabricType && garment.sampleType;
        // For custom samples, check sub-value to determine completion requirements
        if (basicComplete && garment.sampleType === 'custom') {
          // Only 'design-studio' requires lab dip assignment
          // 'exact-pantone' (I have TCX/TPX pantone) is complete immediately
          if (garment.sampleSubValue === 'design-studio') {
            return garment.assignedLabDips && garment.assignedLabDips.size > 0;
          } else {
            // For 'exact-pantone' or other custom sub-values, basic completion is enough
            return basicComplete;
          }
        } else {
          return basicComplete;
        }
      }
      case 'bulk-order-request':
        return garment.type && garment.sampleReference;
      default:
        return garment.type;
    }
  }

  // Assignment Management
  assignLabDip(garmentId, labDipId) {
    const garment = V10_State.garments.get(garmentId);
    if (garment) {
      garment.assignedLabDips.add(labDipId);
      this.eventEmitter.dispatchEvent(new CustomEvent('labDipAssigned', {
        detail: { garmentId, labDipId }
      }));
      return true;
    }
    return false;
  }

  unassignLabDip(garmentId, labDipId) {
    const garment = V10_State.garments.get(garmentId);
    if (garment) {
      garment.assignedLabDips.delete(labDipId);
      this.eventEmitter.dispatchEvent(new CustomEvent('labDipUnassigned', {
        detail: { garmentId, labDipId }
      }));
      return true;
    }
    return false;
  }

  assignDesign(garmentId, designId) {
    const garment = V10_State.garments.get(garmentId);
    if (garment) {
      garment.assignedDesigns.add(designId);
      this.eventEmitter.dispatchEvent(new CustomEvent('designAssigned', {
        detail: { garmentId, designId }
      }));
      return true;
    }
    return false;
  }

  unassignDesign(garmentId, designId) {
    const garment = V10_State.garments.get(garmentId);
    if (garment) {
      garment.assignedDesigns.delete(designId);
      this.eventEmitter.dispatchEvent(new CustomEvent('designUnassigned', {
        detail: { garmentId, designId }
      }));
      return true;
    }
    return false;
  }

  // Private Helpers
  confirmRemoval(garmentData) {
    let message = 'This garment has assignments that will be lost:\n\n';
    
    if (garmentData.assignedLabDips.size > 0) {
      message += `• ${garmentData.assignedLabDips.size} assigned color(s)\n`;
    }
    
    if (garmentData.assignedDesigns.size > 0) {
      message += `• ${garmentData.assignedDesigns.size} assigned design(s)\n`;
    }
    
    message += '\nRemove this garment? This action cannot be undone.';
    return confirm(message);
  }

  cleanupGarmentAssignments(garmentId) {
    // Clean up lab dip assignments
    if (V10_State.labDips) {
      V10_State.labDips.forEach(labDip => {
        if (labDip.assignedGarments) {
          labDip.assignedGarments.delete(garmentId);
        }
      });
    }

    // Clean up assignment maps
    if (V10_State.assignments) {
      // Remove from lab dip assignments
      if (V10_State.assignments.labDips) {
        V10_State.assignments.labDips.forEach((garmentIds, labDipId) => {
          garmentIds.delete(garmentId);
        });
        
        // Update lab dip collection text after assignment cleanup
        if (window.v10ColorStudio?.updateLabDipCollectionAssignments) {
          setTimeout(() => {
            window.v10ColorStudio.updateLabDipCollectionAssignments();
          }, 50);
        }
      }
      
      // Remove from design assignments
      if (V10_State.assignments.designs) {
        V10_State.assignments.designs.forEach((garmentIds, designId) => {
          garmentIds.delete(garmentId);
        });
      }
    }
  }

  // Data Access
  getGarment(garmentId) {
    return V10_State.garments.get(garmentId);
  }

  getAllGarments() {
    return Array.from(V10_State.garments.values());
  }

  getGarmentCount() {
    return V10_State.garments.size;
  }

  // Event System
  on(eventType, callback) {
    this.eventEmitter.addEventListener(eventType, callback);
  }

  off(eventType, callback) {
    this.eventEmitter.removeEventListener(eventType, callback);
  }

  /**
   * Calculate if garment is complete based on request type and garment data
   */
  calculateGarmentCompletion(garmentData) {
    const requestType = V10_State.requestType;
    let isComplete = false;

    if (requestType === 'quotation') {
      isComplete = garmentData.type && garmentData.fabricType;
    } else if (requestType === 'sample-request') {
      // Basic completion: type, fabric, and sample type selected
      const basicComplete = garmentData.type && garmentData.fabricType && garmentData.sampleType;
      
      // For custom samples, check the sub-value to determine completion requirements
      if (basicComplete && garmentData.sampleType === 'custom') {
        // Only 'design-studio' requires lab dip assignment
        // 'exact-pantone' (I have TCX/TPX pantone) is complete immediately
        if (garmentData.sampleSubValue === 'design-studio') {
          isComplete = garmentData.assignedLabDips && garmentData.assignedLabDips.size > 0;
        } else {
          // For 'exact-pantone' or other custom sub-values, basic completion is enough
          isComplete = basicComplete;
        }
      } else {
        isComplete = basicComplete;
      }
    } else if (requestType === 'bulk-order-request') {
      isComplete = !!(garmentData.type && garmentData.sampleReference);
    }

    return isComplete;
  }

  destroy() {
    this.removing = false;
    // Clean up would go here if needed
  }
}

// ==============================================

class V10_GarmentStudio {
  constructor() {
    // Singleton pattern - prevent multiple instances
    if (V10_GarmentStudio.instance) {
      console.log('🔄 V10_GarmentStudio instance already exists, returning existing instance');
      return V10_GarmentStudio.instance;
    }
    
    console.log('🆕 Creating new V10_GarmentStudio instance');
    
    this.garmentsContainer = document.getElementById('garments-container');
    this.addGarmentBtn = document.getElementById('add-garment');
    this.garmentCounter = 0;
    this.eventListenersAttached = false;
    
    // Initialize core managers
    this.garmentManager = new V10_GarmentManager();
    this.uiManager = new V10_GarmentUIManager();
    this.quantityCalculator = new V10_QuantityCalculator();
    
    // Set up garment manager event listeners
    this.setupGarmentManagerEvents();
    
    V10_GarmentStudio.instance = this;
    this.init();
  }

  init() {
    // Prevent multiple initialization
    if (this.initialized) {
      return;
    }
    
    this.bindEvents();
    
    // Initial studio completion check
    setTimeout(() => {
      this.updateStudioCompletion();
      this.updateDesignStudioTabStatus();
      this.updateQuantitiesStudioTabStatus();
    }, 100);
    
    this.initialized = true;
    console.log('✅ V10_GarmentStudio initialized');
  }

  setupGarmentManagerEvents() {
    // Listen to garment manager events for UI updates
    this.garmentManager.eventEmitter.addEventListener('garmentAdded', (event) => {
      const { garmentId, garmentData } = event.detail;
      this.renderGarment(garmentData);
      this.garmentManager.renumberGarments();
      this.updateStudioCompletion();
      this.updateDesignStudioTabStatus();
      this.updateQuantitiesStudioTabStatus();
      console.log(`➕ Added garment ${garmentData.number}: ${garmentId}`);
    });

    this.garmentManager.eventEmitter.addEventListener('garmentRemoved', (event) => {
      const { garmentId } = event.detail;
      const garmentCard = document.querySelector(`[data-garment-id="${garmentId}"]`);
      if (garmentCard) {
        garmentCard.remove();
      }
      this.updateStudioCompletion();
      this.updateDesignStudioTabStatus();
      
      // Update lab dip collection assignments after garment removal
      if (window.v10ColorStudio?.updateLabDipCollectionAssignments) {
        setTimeout(() => {
          window.v10ColorStudio.updateLabDipCollectionAssignments();
        }, 100);
      }
      
      console.log(`🗑️ Removed garment: ${garmentId}`);
    });

    this.garmentManager.eventEmitter.addEventListener('garmentRenumbered', (event) => {
      const { garmentId, newNumber } = event.detail;
      const garmentCard = document.querySelector(`[data-garment-id="${garmentId}"]`);
      if (garmentCard) {
        const numberElement = garmentCard.querySelector('.garment-card__number');
        if (numberElement) {
          numberElement.textContent = `Garment ${newNumber}`;
        }
      }
    });
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
      this.garmentsContainer.addEventListener('keydown', (e) => this.handleGarmentKeyDown(e));
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
    // Delegate to garment manager - UI updates handled by event listeners
    return this.garmentManager.addGarment(data);
  }

  // Delegate to garment manager
  getNextGarmentNumber() {
    return this.garmentManager.getNextGarmentNumber();
  }

  renderGarment(garmentData) {
    try {
      // Use UI manager to render garment template
      const clone = this.uiManager.renderGarment(garmentData);
      if (!clone) {
        console.error('❌ Failed to render garment template');
        return;
      }

      // Add to container
      if (this.garmentsContainer) {
        this.garmentsContainer.appendChild(clone);
        console.log('✅ Garment added to container');
        

        // Initialize edit interface only for incomplete manually created garments
        // Skip edit mode for variants, complete garments, and duplicated garments
        if (!garmentData.isVariant && !garmentData.isComplete && !garmentData.isDuplicated) {
          try {
            console.log('🔧 Expanding garment for edit mode');
            this.expandGarmentForEdit(garmentData.id);
          } catch (editError) {
            console.error('❌ Error initializing edit interface:', editError);
          }
        } else {
          if (garmentData.isVariant) {
            console.log('🎨 Variant garment created - skipping edit mode initialization');
          } else if (garmentData.isComplete) {
            console.log('✅ Complete garment created - skipping edit mode initialization');
          }
        }
      } else {
        console.error('❌ Garments container not found');
        return;
      }

      // Update status and dependencies
      try {
        // Always update garment status to ensure proper UI state (collapse, summary, etc.)
        this.updateGarmentStatus(garmentData.id);
        
        const addedGarmentCard = document.querySelector(`[data-garment-id="${garmentData.id}"]`);
        if (addedGarmentCard) {
          // Initialize UI workflow
          this.uiManager.initializeSelectionWorkflow(addedGarmentCard);
          this.uiManager.updateSelectionDependencies(addedGarmentCard, garmentData);
          
          // Update compact selections after DOM insertion for existing garment data
          if (garmentData.sampleType) {
            this.updateCompactSelection('sampleType', garmentData.sampleType, addedGarmentCard, garmentData.sampleSubValue, true);
          }
          
          // Update sample reference for bulk orders
          const requestType = V10_State.requestType;
          if (requestType === 'bulk-order-request' && garmentData.sampleReference) {
            this.updateCompactSelection('sampleReference', garmentData.sampleReference, addedGarmentCard, null, true);
          }
        }
      } catch (error) {
        console.error('❌ Error updating garment post-render:', error);
      }
    } catch (error) {
      console.error('❌ Error rendering garment:', error);
    }
  }


  handleGarmentActions(e) {
    const garmentCard = e.target.closest('.garment-card, .garment-quantity-card');
    if (!garmentCard) return;

    const garmentId = garmentCard.dataset.garmentId;

    if (e.target.closest('.garment-card__remove') || e.target.closest('.garment-card__remove-summary')) {
      e.preventDefault();
      e.stopPropagation();
      this.removeGarment(garmentId);
    } else if (e.target.closest('.garment-card__duplicate') || e.target.closest('.garment-card__duplicate-summary')) {
      e.preventDefault();
      e.stopPropagation();
      this.duplicateGarment(garmentId);
    } else if (e.target.closest('.garment-summary__edit-btn')) {
      e.preventDefault();
      e.stopPropagation();
      this.expandGarmentForEdit(garmentId);
    } else if (e.target.closest('.add-colorway')) {
      // Add colorway is handled by initializeProfessionalColorways() direct event listener
      // No additional handling needed here - prevents duplicate execution
      console.log('🎨 Add Colorway handled by direct event listener for garment:', garmentId);
    } else if (e.target.closest('.apply-preset-btn')) {
      // Handle apply preset button from professional cards
      e.preventDefault();
      e.stopPropagation();
      this.showPresetMenuForGarment(garmentId);
      console.log('📋 Apply Preset clicked for garment:', garmentId);
    } else if (e.target.closest('.clear-all-btn')) {
      // Handle clear all button from professional cards
      e.preventDefault();
      e.stopPropagation();
      this.clearGarmentQuantities(garmentId);
      console.log('🧹 Clear All clicked for garment:', garmentId);
    } else if (e.target.closest('.apply-preset-to-garment')) {
      // Handle apply preset button from integrated actions
      e.preventDefault();
      e.stopPropagation();
      const presetMenu = garmentCard.querySelector('.garment-preset-menu');
      if (presetMenu) {
        presetMenu.classList.toggle('active');
        console.log('📋 Apply Preset dropdown toggled');
      }
    } else if (e.target.closest('.clear-garment-quantities')) {
      // Handle clear quantities button from integrated actions
      e.preventDefault();
      e.stopPropagation();
      this.clearGarmentQuantities(garmentId);
      console.log('🗑️ Clear Quantities clicked for garment:', garmentId);
    } else if (e.target.closest('.preset-option')) {
      // Handle preset option selection
      e.preventDefault();
      e.stopPropagation();
      const presetOption = e.target.closest('.preset-option');
      const presetName = presetOption.dataset.preset;
      if (presetName) {
        this.quantityCalculator.applyPresetToGarment(garmentId, presetName);
        console.log('✨ Applied preset:', presetName, 'to garment:', garmentId);
        
        // Hide dropdown after selection
        const presetMenu = garmentCard.querySelector('.garment-preset-menu');
        if (presetMenu) {
          presetMenu.classList.remove('active');
        }
      }
    }
  }

  handleCompactClicks(e) {
    // Handle compact interface clicks - original working pattern
    if (e.target.closest('.selection-placeholder')) {
      e.preventDefault();
      e.stopPropagation();
      const widget = e.target.closest('.compact-selection-widget');
      const section = e.target.closest('.compact-selection-section');
      
      // Don't toggle if the section or widget is disabled
      if ((widget && widget.style.pointerEvents === 'none') || 
          (section && section.classList.contains('compact-selection-section--disabled'))) {
        console.log('🚫 Selection widget is disabled, not toggling');
        return;
      }
      
      this.toggleSelection(widget);
    } else if (e.target.closest('.change-selection-btn')) {
      e.preventDefault();
      e.stopPropagation();
      const section = e.target.closest('.compact-selection-section');
      const widget = section.querySelector('.compact-selection-widget');
      
      // Don't toggle if the section or widget is disabled
      if ((widget && widget.style.pointerEvents === 'none') || 
          (section && section.classList.contains('compact-selection-section--disabled'))) {
        console.log('🚫 Selection widget is disabled, not toggling');
        return;
      }
      
      this.toggleSelection(widget);
    } else if (e.target.closest('.selection-display')) {
      e.preventDefault();
      e.stopPropagation();
      const section = e.target.closest('.compact-selection-section');
      const widget = section.querySelector('.compact-selection-widget');
      
      // Don't toggle if the section or widget is disabled
      if ((widget && widget.style.pointerEvents === 'none') || 
          (section && section.classList.contains('compact-selection-section--disabled'))) {
        console.log('🚫 Selection widget is disabled, not toggling');
        return;
      }
      
      this.toggleSelection(widget);
    }
    // Removed complex radio button re-selection logic to fix selection issues
    // Re-selection is now only available via the "Change" buttons and selection display clicks
  }

  handleGarmentChanges(e) {
    const garmentCard = e.target.closest('.garment-card');
    if (!garmentCard) return;

    const garmentId = garmentCard.dataset.garmentId;
    const garmentData = V10_State.garments.get(garmentId);
    if (!garmentData) return;

    // Handle garment type change (compact and regular)
    if (e.target.name.includes('garmentType')) {
      // Only proceed if the radio button is actually checked and has a valid value
      if (!e.target.checked || !e.target.value || e.target.value === '') {
        return;
      }
      
      const previousValue = garmentData.type;
      const newValue = e.target.value;
      
      garmentData.type = newValue;
      this.uiManager.populateFabricOptions(garmentCard, newValue);
      
      // COMPLETE STATE CLEARING - Clear all dependent selections when garment type changes
      garmentData.fabricType = null; // Use null to completely clear
      garmentData.sampleType = null; // Use null to completely clear
      garmentData.sampleSubValue = null; // Use null to completely clear
      
      // Reset sample reference for bulk orders
      const requestType = V10_State.requestType;
      if (requestType === 'bulk-order-request') {
        garmentData.sampleReference = null; // Use null to completely clear
        this.uiManager.resetSampleReferenceSelection(garmentCard);
      }
      
      // Clear any Lab Dip assignments since fabric/sample are changing
      if (garmentData.assignedLabDipIds && garmentData.assignedLabDipIds.length > 0) {
        garmentData.assignedLabDipIds = [];
        console.log(`🎨 Cleared lab dip assignments from garment ${garmentId} due to garment type change`);
      }
      
      // Handle compact interface selection update
      if (e.target.closest('.compact-radio-card')) {
        this.updateCompactSelection('garment', newValue, garmentCard);
        this.uiManager.resetFabricSelection(garmentCard);
        this.uiManager.resetSampleSelection(garmentCard);
      }
      
      // Update selection dependencies through UI Manager
      this.uiManager.updateSelectionDependencies(garmentCard, garmentData);
      
      // Update sample type prices based on new garment selection
      V10_Utils.updateSampleTypePrices(garmentCard);
      
      // Mark finalize button as changed (even if same value, user made an edit action)
      this.markEditButtonAsChanged(garmentCard);
      
      console.log(`🔄 Garment type ${previousValue === newValue ? 're-selected' : 'changed'}: ${newValue}`);
      
      // Update garment status and summary display
      this.updateGarmentStatus(garmentId);
    }

    // Handle fabric type change (compact and regular)
    if (e.target.name.includes('fabricType')) {
      const previousValue = garmentData.fabricType;
      const newValue = e.target.value;
      
      garmentData.fabricType = newValue;
      // COMPLETE SAMPLE STATE CLEARING - Clear all sample-related state when fabric changes
      garmentData.sampleType = null; // Use null to completely clear
      garmentData.sampleSubValue = null; // Use null to completely clear
      
      // Clear any assigned lab dips when fabric changes (similar to sample type change logic)
      if (garmentData.assignedLabDips && garmentData.assignedLabDips.size > 0) {
        console.log(`🎨 Removing assigned lab dips from garment ${garmentId} due to fabric type change to ${newValue}`);
        // Remove all assigned lab dips
        const labDipIds = Array.from(garmentData.assignedLabDips);
        labDipIds.forEach(labDipId => {
          this.unassignLabDip(garmentId, labDipId);
        });
      }
      
      // Update fabric restrictions when fabric type changes
      setTimeout(() => {
        V10_Utils.updateGarmentFabricRestrictions(garmentCard);
        // Update sample type prices based on new fabric selection
        V10_Utils.updateSampleTypePrices(garmentCard);
      }, 50);
      
      // Handle compact interface selection update
      if (e.target.closest('.compact-radio-card')) {
        this.updateCompactSelection('fabric', newValue, garmentCard);
      }
      
      // Reset sample selection and update dependencies
      this.uiManager.resetSampleSelection(garmentCard);
      this.uiManager.updateSelectionDependencies(garmentCard, garmentData);
      
      // Mark finalize button as changed (even if same value, user made an edit action)
      this.markEditButtonAsChanged(garmentCard);
      
      console.log(`🔄 Fabric type ${previousValue === newValue ? 're-selected' : 'changed'}: ${newValue}`);
      
      // Update garment status and summary display
      this.updateGarmentStatus(garmentId);
    }

    // Handle sample type change
    if (e.target.name.includes('sampleType')) {
      const previousSampleType = garmentData.sampleType;
      const newSampleType = e.target.value;
      const newSampleSubValue = e.target.dataset.subValue;
      
      
      // If changing from custom to another type, remove assigned lab dips
      if (previousSampleType === 'custom' && newSampleType !== 'custom') {
        if (garmentData.assignedLabDips && garmentData.assignedLabDips.size > 0) {
          console.log(`🎨 Removing assigned lab dips from garment ${garmentId} due to sample type change from custom to ${newSampleType}`);
          // Remove all assigned lab dips
          const labDipIds = Array.from(garmentData.assignedLabDips);
          labDipIds.forEach(labDipId => {
            this.unassignLabDip(garmentId, labDipId);
          });
        }
      }
      
      // Handle cross-selection reset (stock vs custom) FIRST
      this.uiManager.handleSampleTypeCrossReset(garmentCard, newSampleType);
      
      // Use unified update function (handles state, visual, pricing, marking changed, status)
      this.updateSampleType(garmentId, newSampleType, newSampleSubValue, garmentCard);
      
      // Clear any existing red borders since user made a selection
      const sampleTypeCards = garmentCard.querySelectorAll('.sample-type-card');
      sampleTypeCards.forEach(card => {
        card.classList.remove('sample-type-card--required');
      });
      
      // Trigger immediate revalidation to ensure current selection is recognized
      console.log(`🔄 Triggering immediate validation for garment changes`);
      // Small delay to ensure DOM updates are complete
      setTimeout(() => {
        const currentlyValid = this.validateGarmentRequirements(garmentId);
        console.log(`✅ Immediate validation result: ${currentlyValid ? 'VALID' : 'INVALID'}`);
      }, 50);
    }

    // Handle sample reference change (bulk orders)
    if (e.target.name.includes('sampleReference')) {
      const previousValue = garmentData.sampleReference;
      const newValue = e.target.value;
      
      garmentData.sampleReference = newValue;
      
      // Handle compact interface selection update
      if (e.target.closest('.compact-radio-card')) {
        this.updateCompactSelection('sampleReference', newValue, garmentCard);
      }
      
      // Mark finalize button as changed (even if same value, user made an edit action)
      this.markEditButtonAsChanged(garmentCard);
      
      console.log(`🔄 Sample reference ${previousValue === newValue ? 're-selected' : 'changed'}: ${newValue}`);
      
      // Update garment status and summary display
      this.updateGarmentStatus(garmentId);
    }


    // Update garment status for all relevant changes
    this.updateGarmentStatus(garmentId);

    // Auto-save
  }

  handleGarmentKeyDown(e) {
    // No specific key handling needed for garment cards currently
  }

  // Check if garment basic configuration is complete
  isGarmentConfigured(garmentData) {
    const requestType = V10_State.requestType;
    
    // Design toggle should only show for sample and bulk requests, never quotations
    if (requestType === 'quotation') {
      return false; // Never show design toggle for quotations
    } else if (requestType === 'bulk-order-request') {
      // For bulk orders: type and sample reference required for configuration
      return garmentData.type && garmentData.sampleReference;
    } else if (requestType === 'sample-request') {
      // For sample requests: type, fabric, and sample type required
      return garmentData.type && garmentData.fabricType && garmentData.sampleType;
    }
    
    return false; // Default: don't show design toggle
  }

  // Update garment card configuration state
  updateGarmentConfigurationState(garmentCard, garmentData) {
    const isConfigured = this.isGarmentConfigured(garmentData);
    
    if (isConfigured) {
      garmentCard.classList.add('garment-card--configured');
      console.log(`✅ Garment configured - Design toggle now available`);
    } else {
      garmentCard.classList.remove('garment-card--configured');
      console.log(`⏳ Garment not configured - Design toggle hidden`);
    }
    
    return isConfigured;
  }

  updateGarmentStatus(garmentId) {
    console.log('🔄 [SUMMARY_FIX] updateGarmentStatus called for garment:', garmentId);
    const garmentData = V10_State.garments.get(garmentId);
    const garmentCard = document.querySelector(`[data-garment-id="${garmentId}"]`);
    if (!garmentData || !garmentCard) {
      console.log('❌ [SUMMARY_FIX] Missing garmentData or garmentCard');
      return;
    }
    
    // Update configuration state (show/hide design toggle)
    const isConfigured = this.updateGarmentConfigurationState(garmentCard, garmentData);

    const statusIndicator = garmentCard.querySelector('.status-indicator');
    const requestType = V10_State.requestType;
    
    // Use helper method to calculate completion
    const isComplete = this.garmentManager.calculateGarmentCompletion(garmentData);

    garmentData.isComplete = isComplete;

    if (statusIndicator) {
      let statusText = isComplete ? 'Complete' : 'Incomplete';
      
      // Add specific message for design-studio samples needing color assignment
      if (!isComplete && garmentData.sampleType === 'custom' && garmentData.sampleSubValue === 'design-studio') {
        const hasLabDips = garmentData.assignedLabDips && garmentData.assignedLabDips.size > 0;
        if (!hasLabDips) {
          statusText = 'Incomplete - Color assignment required in Color Studio';
        }
      }
      
      statusIndicator.textContent = statusText;
      statusIndicator.className = `status-indicator ${isComplete ? 'status-indicator--complete' : 'status-indicator--incomplete'}`;
    }

    // Apply visual enhancement classes to the entire garment card
    if (garmentCard) {
      if (isComplete) {
        garmentCard.classList.add('garment-card--complete');
        garmentCard.classList.remove('garment-card--incomplete');
      } else {
        garmentCard.classList.add('garment-card--incomplete');
        garmentCard.classList.remove('garment-card--complete');
      }
    }

    // Handle garment collapse/expand based on completion status
    this.updateGarmentCollapsedState(garmentCard, garmentData, isComplete);

    
    // Check and update overall studio completion status
    this.updateStudioCompletion();
    
    // Update design studio tab and badge
    this.updateDesignStudioTabStatus();
    V10_BadgeManager.updateDesignCompletionBadge();
    
    // Trigger validation update for Step 3 next button
    if (window.v10TechPackSystem?.validationManager) {
      try {
        console.log(`🔄 Triggering validation after garment ${garmentId} status update (isComplete: ${isComplete})`);
        const validation = window.v10TechPackSystem.validationManager.validateStep();
        console.log(`📋 Validation result:`, validation);
      } catch (validationError) {
        console.warn('Error triggering validation update:', validationError);
      }
    }
    
    // For bulk orders, trigger quantity studio population when garment status changes
    if (requestType === 'bulk-order-request') {
      // Debounce to prevent excessive updates during rapid changes
      if (this._quantityStudioUpdateTimeout) {
        clearTimeout(this._quantityStudioUpdateTimeout);
      }
      this._quantityStudioUpdateTimeout = setTimeout(() => {
        if (window.v10GarmentStudio && typeof window.v10GarmentStudio.populateQuantityStudio === 'function') {
          window.v10GarmentStudio.populateQuantityStudio();
          console.log('🔄 Triggered quantity studio population after garment status change');
        }
      }, 150); // 150ms debounce
    }
  }

  // Check if all garments are complete and update studio status
  updateStudioCompletion() {
    const allGarments = Array.from(V10_State.garments.values());
    
    if (allGarments.length === 0) {
      this.updateStudioTabStatus(false, 0, 0);
      return;
    }
    
    const completeGarments = allGarments.filter(garment => garment.isComplete);
    const isStudioComplete = completeGarments.length === allGarments.length;
    
    this.updateStudioTabStatus(isStudioComplete, completeGarments.length, allGarments.length);
    
    // Also update quantity studio tab
    if (window.v10QuantityStudio) {
      window.v10QuantityStudio.updateQuantityStudioTabStatus();
    }
    
    console.log(`🎯 Studio Completion: ${completeGarments.length}/${allGarments.length} garments complete`);
    
    // Trigger validation update when studio completion changes
    if (window.v10TechPackSystem?.validationManager) {
      try {
        console.log(`🔄 Triggering validation after studio completion update (${isStudioComplete ? 'ALL COMPLETE' : 'INCOMPLETE'})`);
        const validation = window.v10TechPackSystem.validationManager.validateStep();
        console.log(`📋 Studio validation result:`, validation);
      } catch (validationError) {
        console.warn('Error triggering validation from studio completion:', validationError);
      }
    }
  }

  // Update the Garment Studio tab status indicator
  updateStudioTabStatus(isComplete, completeCount, totalCount) {
    const garmentStudioTab = document.getElementById('garment-studio-tab');
    if (!garmentStudioTab) return;

    const subtitleElement = garmentStudioTab.querySelector('.studio-tab__subtitle');
    if (!subtitleElement) return;

    if (totalCount === 0) {
      subtitleElement.textContent = 'Configure specifications';
      garmentStudioTab.classList.remove('studio-tab--complete', 'studio-tab--incomplete');
    } else if (isComplete) {
      subtitleElement.textContent = `Complete (${totalCount} garments)`;
      garmentStudioTab.classList.add('studio-tab--complete');
      garmentStudioTab.classList.remove('studio-tab--incomplete');
    } else {
      subtitleElement.textContent = `Incomplete (${completeCount}/${totalCount})`;
      garmentStudioTab.classList.add('studio-tab--incomplete');
      garmentStudioTab.classList.remove('studio-tab--complete');
    }
    
    // Check if both studios are complete and enable Step 4 button
    if (window.v10QuantityStudio && typeof window.v10QuantityStudio.checkAllStudiosComplete === 'function') {
      window.v10QuantityStudio.checkAllStudiosComplete();
    }
  }

  // Update the Color Studio tab status indicator
  updateDesignStudioTabStatus() {
    const designStudioTab = document.getElementById('design-studio-tab');
    if (!designStudioTab) return;

    const subtitleElement = designStudioTab.querySelector('.studio-tab__subtitle');
    if (!subtitleElement) return;

    // Get all garments from state
    const allGarments = Array.from(V10_State.garments.values());
    
    if (allGarments.length === 0) {
      subtitleElement.textContent = 'Colors & Labdips';
      designStudioTab.classList.remove('studio-tab--complete', 'studio-tab--incomplete');
      return;
    }
    
    // Count design requirements and fulfillments
    let totalRequirements = 0;
    let fulfilledRequirements = 0;
    
    allGarments.forEach(garment => {
      // Check if garment has custom color requirement (needs lab dip)
      // Only 'design-studio' custom samples require lab dip assignments
      if (garment.sampleType === 'custom' && garment.sampleSubValue === 'design-studio') {
        totalRequirements++;
        if (garment.assignedLabDips && garment.assignedLabDips.size > 0) {
          fulfilledRequirements++;
        }
      }
    });
    
    // Update tab based on completion status
    if (totalRequirements === 0) {
      // No design requirements = show default
      subtitleElement.textContent = 'Colors & Labdips';
      designStudioTab.classList.remove('studio-tab--complete', 'studio-tab--incomplete');
    } else if (fulfilledRequirements === totalRequirements) {
      // All requirements fulfilled = complete
      subtitleElement.textContent = `Complete (${totalRequirements} assignments)`;
      designStudioTab.classList.add('studio-tab--complete');
      designStudioTab.classList.remove('studio-tab--incomplete');
    } else {
      // Some requirements unfulfilled = show user-friendly color requirement message
      const colorsNeeded = totalRequirements - fulfilledRequirements;
      if (colorsNeeded === totalRequirements) {
        // No colors assigned yet - more urgent message
        subtitleElement.textContent = `Colors Required (${colorsNeeded} garment${colorsNeeded !== 1 ? 's' : ''})`;
      } else {
        // Some colors assigned - show progress
        subtitleElement.textContent = `${colorsNeeded} more color${colorsNeeded !== 1 ? 's' : ''} needed`;
      }
      designStudioTab.classList.add('studio-tab--incomplete');
      designStudioTab.classList.remove('studio-tab--complete');
    }
  }

  // Update the Quantities Studio tab status indicator
  updateQuantitiesStudioTabStatus() {
    const quantitiesStudioTab = document.getElementById('quantities-studio-tab');
    if (!quantitiesStudioTab) return;
    
    const subtitleElement = quantitiesStudioTab.querySelector('.studio-tab__subtitle');
    if (!subtitleElement) return;
    
    // Get all garments from state
    const allGarments = Array.from(V10_State.garments.values());
    
    if (allGarments.length === 0) {
      subtitleElement.textContent = 'Sizes & quantities';
      quantitiesStudioTab.classList.remove('studio-tab--complete', 'studio-tab--incomplete');
      return;
    }
    
    // Check if quantities are configured for all garments
    let quantitiesConfigured = 0;
    
    allGarments.forEach(garment => {
      // Check if garment has quantity configuration
      const garmentQuantities = V10_State.quantities.garments.get(garment.id);
      if (garmentQuantities && garmentQuantities.total > 0) {
        quantitiesConfigured++;
      }
    });
    
    // Update tab based on completion status
    if (quantitiesConfigured === allGarments.length) {
      // All quantities configured = complete
      subtitleElement.textContent = `Complete (${allGarments.length} garments)`;
      quantitiesStudioTab.classList.add('studio-tab--complete');
      quantitiesStudioTab.classList.remove('studio-tab--incomplete');
    } else {
      // Some quantities missing = incomplete with fraction
      subtitleElement.textContent = `Incomplete (${quantitiesConfigured}/${allGarments.length})`;
      quantitiesStudioTab.classList.add('studio-tab--incomplete');
      quantitiesStudioTab.classList.remove('studio-tab--complete');
    }
  }

  updateGarmentCollapsedState(garmentCard, garmentData, isComplete) {
    console.log('📱 [SUMMARY_FIX] updateGarmentCollapsedState called');
    console.log('🔍 DEBUG: Collapsed state check:', {
      garmentId: garmentData.id,
      isComplete: isComplete,
      isInEditMode: garmentData.isInEditMode
    });
    
    const summaryContainer = garmentCard.querySelector('.garment-card__summary');
    const contentContainer = garmentCard.querySelector('.garment-card__content');
    
    if (!summaryContainer || !contentContainer) {
      console.log('❌ [SUMMARY_FIX] Missing summary or content container');
      return;
    }

    // Always use edit mode behavior - garments are always editable
    if (garmentData.isInEditMode) {
      summaryContainer.style.display = 'none';
      contentContainer.style.display = 'block';
      return;
    }

    // Normal auto-collapse behavior - collapse if complete OR if incomplete but basic info is filled
    // This ensures custom samples without lab dips still collapse to show the warning message
    const requestType = V10_State.requestType;
    const shouldCollapse = isComplete || 
      (garmentData.type && garmentData.fabricType && 
       (requestType === 'quotation' || garmentData.sampleType)) ||
      // Force collapse for duplicated garments regardless of completion status
      garmentData.isDuplicated;
    
    if (shouldCollapse) {
      // Show summary, hide content
      summaryContainer.style.display = 'block';
      contentContainer.style.display = 'none';
      
      // Show edit button when summary is visible
      const editBtn = garmentCard.querySelector('.garment-summary__edit-btn');
      if (editBtn) {
        editBtn.style.display = 'flex';
      }
      
      // Update summary content ONLY when collapsing
      console.log('✅ [SUMMARY_FIX] About to call updateGarmentSummary (collapsing)');
      this.updateGarmentSummary(garmentCard, garmentData);
    } else {
      // Show content, hide summary
      summaryContainer.style.display = 'none';
      contentContainer.style.display = 'block';
      
      // Hide edit button when content is visible
      const editBtn = garmentCard.querySelector('.garment-summary__edit-btn');
      if (editBtn) {
        editBtn.style.display = 'none';
      }
    }
  }

  updateGarmentSummary(garmentCard, garmentData) {
    console.log('🔍 [GARMENT_DEBUG] updateGarmentSummary called');
    console.log('📥 [GARMENT_DEBUG] Input garment data:', {
      id: garmentData.id,
      type: garmentData.type,
      fabricType: garmentData.fabricType,
      sampleReference: garmentData.sampleReference,
    });
    console.log('📋 [GARMENT_DEBUG] Garment card element:', garmentCard);
    
    const typeSpan = garmentCard.querySelector('.garment-summary__type');
    const fabricSpan = garmentCard.querySelector('.garment-summary__fabric');
    const statusSpan = garmentCard.querySelector('.garment-summary__status');
    const colorCircle = garmentCard.querySelector('.garment-summary__color-circle');
    const colorName = garmentCard.querySelector('.garment-summary__color-name');
    const separator = garmentCard.querySelector('.garment-summary__separator');
    
    console.log('🎯 [GARMENT_DEBUG] Rich summary elements found:', {
      typeSpan: !!typeSpan,
      fabricSpan: !!fabricSpan,
      statusSpan: !!statusSpan,
      colorCircle: !!colorCircle,
      colorName: !!colorName,
      separator: !!separator
    });
    
    // Update configuration state
    const isConfigured = this.updateGarmentConfigurationState(garmentCard, garmentData);
    
    // Update garment type display
    if (typeSpan) {
      if (garmentData.type) {
        typeSpan.textContent = garmentData.type;
        console.log('[GARMENT_DEBUG] Type span text updated to:', typeSpan.textContent);
      } else {
        console.log('[GARMENT_DEBUG] No garment type set yet, keeping placeholder');
      }
    } else {
      console.log('[GARMENT_DEBUG] Type span element not found!');
    }
    
    // Handle color display for garments with assigned lab dips
    if (garmentData.assignedLabDips && garmentData.assignedLabDips.size > 0) {
      // Get the first assigned lab dip for color display
      const firstLabDipId = Array.from(garmentData.assignedLabDips)[0];
      const labDip = V10_State.labDips.get(firstLabDipId);
      
      if (labDip && colorCircle && colorName) {
        // Check if this is a custom text-only code (purple hex with custom flag)
        const isCustomTextCode = labDip.isCustomCode && labDip.hex === '#8B5CF6';
        
        if (isCustomTextCode) {
          // Use multi-colored gradient for text-only custom codes
          colorCircle.style.background = 'conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #ff6b6b)';
        } else {
          // Normal color display
          colorCircle.style.backgroundColor = labDip.hex;
        }
        
        colorCircle.style.display = 'inline-block';
        
        // Show color name from pantone (async lookup)
        colorName.textContent = labDip.pantone; // Show code initially
        colorName.style.display = 'inline';
        
        // Async lookup for proper color name
        V10_Utils.getPantoneColorName(labDip.pantone).then(colorDisplayName => {
          if (colorDisplayName !== labDip.pantone) {
            colorName.textContent = colorDisplayName;
          }
        }).catch(error => {
          console.warn('Failed to lookup Pantone name:', error);
        });
        
        // Ensure separator is visible
        if (separator) separator.style.display = 'inline';
      }
    } else {
      // Show appropriate color indicators for different sample types
      if (garmentData.sampleType && colorCircle && colorName) {
        // Special case: Color Studio should wait for lab dip assignment
        if (garmentData.sampleType === 'custom' && garmentData.sampleSubValue === 'design-studio') {
          // Show empty circle waiting for lab dip color
          colorCircle.style.display = 'inline-block';
          colorCircle.style.backgroundColor = 'transparent';
          colorCircle.style.background = '';
          colorCircle.style.border = '2px solid #9ca3af';
          colorName.textContent = 'Awaiting Color Assignment';
          colorName.style.display = 'inline';
          if (separator) separator.style.display = 'inline';
        } else {
          // All other sample types get their indicator
          this.showSampleTypeColorIndicator(garmentData, colorCircle, colorName, separator);
        }
      } else {
        // Hide color elements when no sample type selected
        if (colorCircle) colorCircle.style.display = 'none';
        if (colorName) colorName.style.display = 'none';
        if (separator) separator.style.display = 'none';
      }
    }
    
    if (fabricSpan) {
      const requestType = V10_State.requestType;
      
      if (requestType === 'bulk-order-request') {
        // For bulk orders: show sample reference
        if (garmentData.sampleReference) {
          const displayName = this.getSampleReferenceDisplayName(garmentData.sampleReference);
          console.log('📤 [GARMENT_DEBUG] Setting fabric span text to sample reference:', displayName);
          fabricSpan.textContent = displayName;
          console.log('[GARMENT_DEBUG] Fabric span text after update:', fabricSpan.textContent);
        } else {
          console.log('[GARMENT_DEBUG] No sample reference set yet for bulk order, keeping placeholder');
        }
      } else {
        // For sample-request and quotation: show fabric type (existing behavior)
        if (garmentData.fabricType) {
          console.log('📤 [GARMENT_DEBUG] Setting fabric span text to fabric type:', garmentData.fabricType);
          fabricSpan.textContent = garmentData.fabricType;
          console.log('[GARMENT_DEBUG] Fabric span text after update:', fabricSpan.textContent);
        } else {
          console.log('[GARMENT_DEBUG] No fabric type set yet, keeping placeholder');
        }
      }
    } else {
      console.log('[GARMENT_DEBUG] Fabric span element not found!');
    }
    
    // Status span removed - redundant with badge indicator
  }

  // Show appropriate color indicators for different sample types
  showSampleTypeColorIndicator(garmentData, colorCircle, colorName, separator) {
    const sampleType = garmentData.sampleType;
    const sampleSubValue = garmentData.sampleSubValue;
    
    // Show the color elements using same pattern as lab dips
    colorCircle.style.display = 'inline-block';
    colorName.style.display = 'inline';
    if (separator) separator.style.display = 'inline';
    
    // Clear any existing background styles first
    colorCircle.style.backgroundColor = '';
    colorCircle.style.background = '';
    colorCircle.style.border = '';
    
    if (sampleType === 'stock') {
      // Stock color samples
      switch (sampleSubValue) {
        case 'black':
          colorCircle.style.backgroundColor = '#000000';
          colorName.textContent = 'Black';
          break;
        case 'white':
          colorCircle.style.backgroundColor = '#ffffff';
          colorCircle.style.border = '2px solid #d1d5db';
          colorName.textContent = 'White';
          break;
        case 'proximate':
          // Multi-color gradient for "most proximate color"
          colorCircle.style.background = 'conic-gradient(#ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #ff6b6b)';
          colorCircle.style.border = '1px solid #9ca3af';
          colorName.textContent = 'Proximate Color';
          break;
        default:
          colorCircle.style.backgroundColor = '#6b7280';
          colorName.textContent = 'Stock Color';
          break;
      }
    } else if (sampleType === 'custom') {
      // Custom color samples
      if (sampleSubValue === 'exact-pantone') {
        // I have TCX/TPX pantone in my techpack - Show the gradient icon
        colorCircle.style.background = 'linear-gradient(45deg, #ec4899, #8b5cf6)';
        colorCircle.style.border = '1px solid #9ca3af';
        colorName.textContent = 'TCX/TPX Pantone';
      } else {
        // Generic custom (shouldn't reach here for design-studio due to special handling above)
        colorCircle.style.backgroundColor = '#8b5cf6';
        colorName.textContent = 'Custom Color';
      }
    } else {
      // Fallback
      colorCircle.style.backgroundColor = '#9ca3af';
      colorName.textContent = 'Sample Color';
    }
  }

  // Helper function to check if garment has existing selections to populate
  hasExistingSelections(garmentData) {
    return garmentData.type || 
           garmentData.fabricType || 
           garmentData.sampleType || 
           garmentData.sampleReference;
  }

  expandGarmentForEdit(garmentId) {
    const garmentCard = document.querySelector(`[data-garment-id="${garmentId}"]`);
    const garmentData = V10_State.garments.get(garmentId);
    if (!garmentCard || !garmentData) return;

    const summaryContainer = garmentCard.querySelector('.garment-card__summary');
    const contentContainer = garmentCard.querySelector('.garment-card__content');
    
    if (summaryContainer && contentContainer) {
      // Set edit mode flag - unified for both new and existing garments
      garmentData.isInEditMode = true;
      
      // ACTIVATE EDIT MODE LOCK SYSTEM
      V10_State.editMode.isLocked = true;
      V10_State.editMode.currentGarmentId = garmentId;
      V10_State.editMode.blockedAttempts = 0;
      console.log(`🔒 Edit mode LOCKED for garment ${garmentId}`);
      
      // Remove configured class - design toggle should hide during editing
      garmentCard.classList.remove('garment-card--configured');
      
      // Hide summary, show content for editing
      summaryContainer.style.display = 'none';
      contentContainer.style.display = 'block';  // Force block for edit mode
      
      // Don't pre-populate values - let user make fresh selections for all options
      
      // Clean edit mode - let user control interface manually
      
      // CRITICAL: Ensure proper UI state after edit mode starts
      // This needs to run after the UI is rendered to reset any invalid displays
      setTimeout(() => {
        this.uiManager.updateSelectionDependencies(garmentCard, garmentData);
        
        // Force complete reset of any invalid displayed selections
        if (!garmentData.fabricType) {
          this.uiManager.resetFabricSelection(garmentCard);
        }
        if (!garmentData.sampleType || !garmentData.fabricType) {
          this.uiManager.resetSampleSelection(garmentCard);
        }
        
        console.log('🔄 Edit mode UI state properly reset after expansion');
      }, 50);
      
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
      finalizeBtn.classList.add('garment-card__finalize--active');  // Always green in edit mode
      
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

  markEditButtonAsChanged(garmentCard) {
    const finalizeBtn = garmentCard.querySelector('.garment-card__finalize');
    
    if (finalizeBtn) {
      finalizeBtn.classList.add('garment-card__finalize--changed');
      console.log('🟠 Finalize button marked as changed');
    }
  }

  validateGarmentRequirements(garmentId) {
    const garmentData = V10_State.garments.get(garmentId);
    if (!garmentData) return false;

    const requestType = V10_State.requestType;
    
    if (requestType === 'quotation') {
      // For quotations: only garment type and fabric type required
      return garmentData.type && garmentData.fabricType;
    } else if (requestType === 'sample-request') {
      // Get current DOM state as fallback for edit mode validation
      const currentDOMState = this.getCurrentGarmentDOMState(garmentId);
      
      // Use DOM state if available and different from stored state (edit mode scenario)
      const currentSampleType = currentDOMState.sampleType || garmentData.sampleType;
      
      // For sample requests: garment type, fabric type, and sample type required
      const hasBasicRequirements = garmentData.type && garmentData.fabricType && currentSampleType;
      
      // If custom sample type, lab dips are NOT required for edit finalization
      // They can be assigned later in the lab dip studio
      // The garment will still show as incomplete until lab dips are assigned
      if (currentSampleType === 'custom') {
        return hasBasicRequirements;
      }
      
      return hasBasicRequirements;
    } else if (requestType === 'bulk-order-request') {
      // For bulk orders: garment type and sample reference required
      return garmentData.type && garmentData.sampleReference;
    }
    
    return false;
  }

  // Helper method to get current DOM state for real-time validation during edit mode
  getCurrentGarmentDOMState(garmentId) {
    const garmentCard = document.querySelector(`[data-garment-id="${garmentId}"]`);
    if (!garmentCard) return {};

    const state = {};
    
    // Get currently selected sample type from DOM
    const selectedSampleTypeRadio = garmentCard.querySelector('input[name*="sampleType"]:checked');
    if (selectedSampleTypeRadio) {
      state.sampleType = selectedSampleTypeRadio.value;
      state.sampleSubValue = selectedSampleTypeRadio.dataset.subValue;
    }

    // Get currently selected fabric type from DOM
    const selectedFabricTypeRadio = garmentCard.querySelector('input[name*="fabricType"]:checked');
    if (selectedFabricTypeRadio) {
      state.fabricType = selectedFabricTypeRadio.value;
    }

    // Get currently selected garment type from DOM
    const selectedGarmentTypeRadio = garmentCard.querySelector('input[name*="garmentType"]:checked');
    if (selectedGarmentTypeRadio) {
      state.garmentType = selectedGarmentTypeRadio.value;
    }

    return state;
  }

  // Synchronize garment state with current DOM selections
  syncGarmentStateWithDOM(garmentId) {
    const garmentData = V10_State.garments.get(garmentId);
    const currentDOMState = this.getCurrentGarmentDOMState(garmentId);
    
    if (!garmentData) return;
    
    let stateChanged = false;
    
    // Sync sample type
    if (currentDOMState.sampleType && currentDOMState.sampleType !== garmentData.sampleType) {
      console.log(`🔄 Syncing sample type: ${garmentData.sampleType} → ${currentDOMState.sampleType}`);
      garmentData.sampleType = currentDOMState.sampleType;
      stateChanged = true;
    }
    
    // Sync sample sub-value
    if (currentDOMState.sampleSubValue !== garmentData.sampleSubValue) {
      console.log(`🔄 Syncing sample sub-value: ${garmentData.sampleSubValue} → ${currentDOMState.sampleSubValue}`);
      garmentData.sampleSubValue = currentDOMState.sampleSubValue;
      stateChanged = true;
    }
    
    // Sync fabric type
    if (currentDOMState.fabricType && currentDOMState.fabricType !== garmentData.fabricType) {
      console.log(`🔄 Syncing fabric type: ${garmentData.fabricType} → ${currentDOMState.fabricType}`);
      garmentData.fabricType = currentDOMState.fabricType;
      stateChanged = true;
    }
    
    // Sync garment type
    if (currentDOMState.garmentType && currentDOMState.garmentType !== garmentData.type) {
      console.log(`🔄 Syncing garment type: ${garmentData.type} → ${currentDOMState.garmentType}`);
      garmentData.type = currentDOMState.garmentType;
      stateChanged = true;
    }
    
    if (stateChanged) {
      console.log(`✅ State synchronized for garment ${garmentId}`);
    }
    
    return stateChanged;
  }

  highlightRequiredSampleTypes(garmentCard) {
    const sampleTypeCards = garmentCard.querySelectorAll('.sample-type-card');
    const garmentId = garmentCard.dataset.garmentId;
    const garmentData = V10_State.garments.get(garmentId);
    
    if (!garmentData || garmentData.sampleType) {
      // Remove highlights if sample type is already selected
      sampleTypeCards.forEach(card => {
        card.classList.remove('sample-type-card--required');
      });
      return;
    }
    
    // Add red border to available sample type options
    sampleTypeCards.forEach(card => {
      if (!card.classList.contains('sample-type-card--restricted')) {
        card.classList.add('sample-type-card--required');
      }
    });
    
    console.log('🔴 Highlighted required sample type selection');
  }

  finalizeGarmentEdit(garmentId) {
    const garmentCard = document.querySelector(`[data-garment-id="${garmentId}"]`);
    const garmentData = V10_State.garments.get(garmentId);
    if (!garmentCard || !garmentData) return;

    console.log(`🔄 Finalizing edit for garment ${garmentId}...`);
    
    // Ensure state is synchronized with current DOM selections before validation
    this.syncGarmentStateWithDOM(garmentId);
    
    // Get current DOM state for validation logging
    const currentDOMState = this.getCurrentGarmentDOMState(garmentId);
    console.log(`🔍 Current DOM state:`, currentDOMState);
    console.log(`🔍 Current garment data:`, {
      type: garmentData.type,
      fabricType: garmentData.fabricType,
      sampleType: garmentData.sampleType,
      hasLabDips: garmentData.assignedLabDips?.size > 0
    });

    // Validate requirements before allowing finalize
    if (!this.validateGarmentRequirements(garmentId)) {
      console.log('❌ Cannot finalize: Missing required fields');
      
      // Only show red borders for sample types if that's what's missing and fabric doesn't support custom colors
      const garmentData = V10_State.garments.get(garmentId);
      const requestType = V10_State.requestType;
      
      if (requestType === 'sample-request' && garmentData.type && garmentData.fabricType && !garmentData.sampleType) {
        // Check if the current fabric doesn't support custom colors (which would require sample type selection)
        const isNonCotton = garmentData.fabricType && !V10_Utils.isCottonFabric(garmentData.fabricType);
        if (isNonCotton) {
          this.highlightRequiredSampleTypes(garmentCard);
        }
      }
      
      return;
    }

    console.log(`✅ Validation passed, finalizing garment ${garmentId}`);

    // Clear edit mode flag
    garmentData.isInEditMode = false;
    
    // RELEASE EDIT MODE LOCK SYSTEM
    V10_State.editMode.isLocked = false;
    V10_State.editMode.currentGarmentId = null;
    V10_State.editMode.blockedAttempts = 0;
    console.log(`🔓 Edit mode UNLOCKED for garment ${garmentId}`);
    
    // Hide finalize edit button and reset its state
    const finalizeBtn = garmentCard.querySelector('.garment-card__finalize');
    if (finalizeBtn) {
      finalizeBtn.style.display = 'none';
      finalizeBtn.classList.remove('garment-card__finalize--changed');
      finalizeBtn.classList.remove('garment-card__finalize--active');  // Remove active green state
    }
    
    // Update the garment's completion status and UI
    this.updateGarmentStatus(garmentId);
    
    // Force collapse state update after finalizing edit
    // This ensures garments collapse properly regardless of completion status
    setTimeout(() => {
      const updatedGarmentData = V10_State.garments.get(garmentId);
      const updatedGarmentCard = document.querySelector(`[data-garment-id="${garmentId}"]`);
      
      if (updatedGarmentCard && updatedGarmentData) {
        // Determine completion status for final collapse check
        const requestType = V10_State.requestType || 'sample-request';
        let isComplete = false;
        
        if (requestType === 'sample-request') {
          const basicComplete = updatedGarmentData.type && updatedGarmentData.fabricType && updatedGarmentData.sampleType;
          if (basicComplete && updatedGarmentData.sampleType === 'custom') {
            // Only 'design-studio' requires lab dip assignment
            // 'exact-pantone' (I have TCX/TPX pantone) is complete immediately
            if (updatedGarmentData.sampleSubValue === 'design-studio') {
              isComplete = updatedGarmentData.assignedLabDips && updatedGarmentData.assignedLabDips.size > 0;
            } else {
              // For 'exact-pantone' or other custom sub-values, basic completion is enough
              isComplete = basicComplete;
            }
          } else {
            isComplete = basicComplete;
          }
        } else if (requestType === 'bulk-order-request') {
          // For bulk orders, need garment type and sample reference
          isComplete = updatedGarmentData.type && updatedGarmentData.sampleReference;
        } else if (requestType === 'quotation') {
          // For quotations, only need garment type and fabric type
          isComplete = updatedGarmentData.type && updatedGarmentData.fabricType;
        }
        
        // Force collapse regardless of completion status when finalizing edit
        this.updateGarmentCollapsedState(updatedGarmentCard, updatedGarmentData, isComplete);
        
        // For bulk orders, trigger quantity studio population when garment is completed
        if (requestType === 'bulk-order-request' && isComplete) {
          if (this.populateQuantityStudio) {
            setTimeout(() => {
              this.populateQuantityStudio();
              console.log('🔄 Triggered quantity studio population after garment finalization');
            }, 200);
          }
        }
      }
    }, 150);
    
    // COLOR STUDIO ATTENTION: Check if this garment needs color assignment
    this.checkColorRequirement(garmentId);
  }
  
  // Check if garment needs color assignment and trigger Color Studio attention
  checkColorRequirement(garmentId) {
    const garmentData = V10_State.garments.get(garmentId);
    if (!garmentData) return;
    
    // Only trigger for sample requests with custom colorways requiring design studio
    const needsColorAssignment = 
      V10_State.requestType === 'sample-request' &&
      garmentData.sampleType === 'custom' &&
      garmentData.sampleSubValue === 'design-studio' &&
      (!garmentData.assignedLabDips || garmentData.assignedLabDips.size === 0);
    
    if (needsColorAssignment) {
      console.log(`🎨 Garment ${garmentId} needs color assignment - triggering Color Studio attention`);
      this.triggerColorStudioAttention();
    }
  }
  
  // Trigger premium attention animation for Color Studio tab
  triggerColorStudioAttention() {
    console.log('🎨 Triggering Color Studio attention animation...');
    
    const designTab = document.getElementById('design-studio-tab');
    if (!designTab) {
      console.warn('❌ Design Studio tab not found - cannot trigger animation');
      return;
    }
    
    // Check if tab is visible
    const isVisible = designTab.style.display !== 'none' && 
                     designTab.offsetParent !== null;
    console.log(`👁️ Tab visibility: ${isVisible ? 'VISIBLE' : 'HIDDEN'}`);
    
    // Make tab visible if it's hidden
    if (!isVisible) {
      console.log('🔄 Making tab visible for animation...');
      designTab.style.display = 'block';
    }
    
    // Add attention class for 8-second animation
    designTab.classList.add('studio-tab--needs-attention');
    console.log('✨ Animation class added to tab');
    
    // Update tab text to show urgency
    const subtitleElement = designTab.querySelector('.studio-tab__subtitle');
    if (subtitleElement) {
      const currentText = subtitleElement.textContent;
      if (!currentText.includes('Colors Required')) {
        // Count garments that need colors
        const garmentsNeedingColors = this.countGarmentsNeedingColors();
        if (garmentsNeedingColors > 0) {
          subtitleElement.textContent = `Colors Required (${garmentsNeedingColors})`;
        }
      }
    }
    
    // Remove attention class after animation completes
    setTimeout(() => {
      designTab.classList.remove('studio-tab--needs-attention');
      
      // Revert tab text if colors still needed (will be handled by updateDesignStudioTabStatus)
      setTimeout(() => {
        if (window.v10GarmentStudio) {
          window.v10GarmentStudio.updateDesignStudioTabStatus();
        }
      }, 100);
    }, 8000);
    
    console.log('✨ Triggered Color Studio attention animation');
  }
  
  // Count how many garments need color assignment
  countGarmentsNeedingColors() {
    let count = 0;
    V10_State.garments.forEach(garment => {
      const needsColors = 
        V10_State.requestType === 'sample-request' &&
        garment.sampleType === 'custom' &&
        garment.sampleSubValue === 'design-studio' &&
        (!garment.assignedLabDips || garment.assignedLabDips.size === 0);
      
      if (needsColors) count++;
    });
    return count;
  }
  
  // COLOR STUDIO ONBOARDING SYSTEM
  // Initialize comprehensive onboarding for first-time Color Studio entry
  // NOTE: This function is now primarily called manually via TOUR button
  initializeColorStudioOnboarding() {
    console.log('🎯 Manual onboarding initialization');
    
    // Simple delay to ensure Color Studio is loaded, then show onboarding
    setTimeout(() => {
      this.showColorStudioOnboarding();
    }, 100);
  }
  
  // Show the guided onboarding tour
  showColorStudioOnboarding() {
    console.log('🚀 Starting onboarding tour...');
    
    // 🔝 MOBILE FIX: Immediately scroll to top for consistent positioning
    console.log('📱 Scrolling to top for consistent mobile positioning...');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // 🚫 PREVENT SCROLLING: Disable page scrolling when visual guide is open
    document.body.classList.add('onboarding-active');
    document.documentElement.classList.add('onboarding-active');
    console.log('🔒 Page scrolling disabled during visual guide');
    
    // Check if required elements exist
    const requiredElements = [
      { selector: '#lab-dip-color-picker', name: 'Color Picker' },
      { selector: '#manual-pantone-code', name: 'Pantone Input' },
      { selector: '.popular-colors-grid', name: 'Popular Colors Grid' }
    ];
    
    const missingElements = requiredElements.filter(el => !document.querySelector(el.selector));
    
    if (missingElements.length > 0) {
      console.log('⏳ Some elements not ready yet:', missingElements.map(el => el.name).join(', '));
      // Retry after a longer delay
      setTimeout(() => this.showColorStudioOnboarding(), 1000);
      return;
    }
    
    console.log('✅ All onboarding target elements found!');
    
    // Create onboarding overlay
    let overlay = document.getElementById('color-studio-onboarding-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'color-studio-onboarding-overlay';
      overlay.className = 'color-studio-onboarding';
      document.body.appendChild(overlay);
    }
    
    overlay.innerHTML = `
      <div class="onboarding-highlight" id="onboarding-highlight"></div>
      <div class="onboarding-tooltip" id="onboarding-tooltip"></div>
      <div class="onboarding-controls">
        <button class="onboarding-btn onboarding-btn--secondary" id="onboarding-skip">Skip Tour</button>
        <button class="onboarding-btn onboarding-btn--secondary" id="onboarding-previous">Previous</button>
        <button class="onboarding-btn onboarding-btn--primary" id="onboarding-next">Next</button>
      </div>
    `;
    
    // Bind controls
    document.getElementById('onboarding-previous').addEventListener('click', () => this.previousOnboardingStep());
    document.getElementById('onboarding-skip').addEventListener('click', () => this.skipOnboarding());
    document.getElementById('onboarding-next').addEventListener('click', () => this.nextOnboardingStep());
    
    // Start the tour
    this.currentOnboardingStep = 0;
    this.onboardingSteps = [
      {
        target: 'input#lab-dip-color-picker',
        title: 'Method 1: Visual Color Picker',
        description: 'Use our color picker to select your desired color visually. Perfect for quick color selection and visual matching.',
        position: 'left'
      },
      {
        target: '#manual-pantone-code',
        title: 'Method 2: Enter Pantone Code',
        description: 'Type your exact Pantone code (like "19-4005 TPX" or "19-4005 TCX") for precise color matching. This is the most accurate method for professional production.',
        position: 'bottom'
      },
      {
        target: '.popular-colors-grid',
        title: 'Method 3: Popular Colors',
        description: 'Choose from our curated selection of trending colors. These are popular choices that work well with most garment types.',
        position: 'bottom'
      },
      {
        target: '.add-labdip-actions',
        title: 'Add Your Color',
        description: 'Now add your selected color to the garment directly, or save it as a fabric swatch in your Lab Dip Collection for later use.',
        position: 'left'
      },
      {
        target: '.labdips-collection',
        title: 'Lab Dip Collection',
        description: 'All your colors appear here - items marked "Lab Dip" are fabric swatches, while others are already assigned to garments. You can assign swatches to garments, remove colors, or keep them organized for your project.',
        position: 'bottom'
      }
    ];
    
    overlay.classList.add('show');
    
    // 🔝 MOBILE FIX: Wait for scroll completion before positioning elements
    // Use robust scroll completion detection
    let scrollCheckInterval;
    let lastScrollPosition = window.scrollY;
    let scrollStabilityCount = 0;
    const maxWaitTime = 1000; // Maximum wait time
    let waitTime = 0;
    
    const checkScrollComplete = () => {
      const currentScrollPosition = window.scrollY;
      
      // Check if we've reached the top and scroll has stabilized
      if (currentScrollPosition <= 5 && currentScrollPosition === lastScrollPosition) {
        scrollStabilityCount++;
        
        // Require 3 consecutive checks with stable position (150ms total)
        if (scrollStabilityCount >= 3 || waitTime >= maxWaitTime) {
          clearInterval(scrollCheckInterval);
          console.log('✅ Scroll completed and stabilized - starting element positioning...');
          this.showOnboardingStep();
          return;
        }
      } else {
        scrollStabilityCount = 0;
      }
      
      lastScrollPosition = currentScrollPosition;
      waitTime += 50;
      
      // Fallback: start positioning after max wait time
      if (waitTime >= maxWaitTime) {
        clearInterval(scrollCheckInterval);
        console.log('⏰ Max wait time reached - starting element positioning...');
        this.showOnboardingStep();
      }
    };
    
    // Start checking scroll completion every 50ms
    scrollCheckInterval = setInterval(checkScrollComplete, 50);
  }
  
  // Show current onboarding step
  showOnboardingStep() {
    if (this.currentOnboardingStep >= this.onboardingSteps.length) {
      this.completeOnboarding();
      return;
    }
    
    const step = this.onboardingSteps[this.currentOnboardingStep];
    const highlight = document.getElementById('onboarding-highlight');
    const tooltip = document.getElementById('onboarding-tooltip');
    const nextBtn = document.getElementById('onboarding-next');
    
    // 🛡️ NULL CHECKS: Ensure all onboarding elements exist
    if (!highlight || !tooltip || !nextBtn) {
      console.error('❌ Critical onboarding elements missing:', {
        highlight: !!highlight,
        tooltip: !!tooltip,
        nextBtn: !!nextBtn
      });
      return;
    }
    
    // Find target element
    const targetElement = document.querySelector(step.target);
    if (!targetElement) {
      console.warn(`Onboarding target not found: ${step.target}`);
      this.nextOnboardingStep();
      return;
    }
    
    // 🎯 COMPREHENSIVE DEBUG LOGGING
    console.log('🔍 ONBOARDING DEBUG - ELEMENT TARGETING:');
    console.log('Step target selector:', step.target);
    console.log('Found target element:', targetElement);
    console.log('Element tagName:', targetElement.tagName);
    console.log('Element ID:', targetElement.id);
    console.log('Element classes:', targetElement.className);
    
    // Check for multiple elements with same selector
    const allMatches = document.querySelectorAll(step.target);
    console.log('Total elements matching selector:', allMatches.length);
    if (allMatches.length > 1) {
      console.warn('⚠️ MULTIPLE ELEMENTS FOUND:', allMatches);
      allMatches.forEach((el, index) => {
        console.log(`Element ${index}:`, el, el.getBoundingClientRect());
      });
    }
    
    // Check element visibility and display
    const computedStyles = window.getComputedStyle(targetElement);
    console.log('Element visibility:', computedStyles.visibility);
    console.log('Element display:', computedStyles.display);
    console.log('Element z-index:', computedStyles.zIndex);
    
    // Position highlight around target
    const rect = targetElement.getBoundingClientRect();
    console.log('🎯 ELEMENT POSITIONING:');
    console.log('Target getBoundingClientRect():', rect);
    let highlightLeft = rect.left - 8;
    let highlightTop = rect.top - 8;
    let highlightWidth = rect.width + 16;
    let highlightHeight = rect.height + 16;
    
    // Special positioning adjustment for Lab Dip Collection
    if (step.target === '.labdips-collection') {
      highlightTop = rect.top + 10; // Move highlight down into the content area
      highlightHeight = rect.height - 20; // Reduce height to stay within content
    }

    
    // 🔒 VIEWPORT BOUNDARY SAFETY CHECKS - Ensure highlight stays within screen bounds
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const boundaryMargin = 8; // Minimum margin from viewport edge
    
    // Horizontal boundary checks
    if (highlightLeft < boundaryMargin) {
      const adjustment = boundaryMargin - highlightLeft;
      highlightLeft = boundaryMargin;
      highlightWidth = Math.max(highlightWidth - adjustment, 16); // Minimum width
    }
    if (highlightLeft + highlightWidth > viewportWidth - boundaryMargin) {
      highlightWidth = Math.max(viewportWidth - boundaryMargin - highlightLeft, 16);
    }
    
    // Vertical boundary checks  
    if (highlightTop < boundaryMargin) {
      const adjustment = boundaryMargin - highlightTop;
      highlightTop = boundaryMargin;
      highlightHeight = Math.max(highlightHeight - adjustment, 16); // Minimum height
    }
    if (highlightTop + highlightHeight > viewportHeight - boundaryMargin) {
      highlightHeight = Math.max(viewportHeight - boundaryMargin - highlightTop, 16);
    }
    
    console.log('🔒 Viewport boundary check completed:', {
      finalLeft: highlightLeft,
      finalTop: highlightTop, 
      finalWidth: highlightWidth,
      finalHeight: highlightHeight
    });
    
    // Apply styles with !important flags to prevent CSS conflicts
    highlight.style.setProperty('left', highlightLeft + 'px', 'important');
    highlight.style.setProperty('top', highlightTop + 'px', 'important');
    highlight.style.setProperty('width', highlightWidth + 'px', 'important');
    highlight.style.setProperty('height', highlightHeight + 'px', 'important');
    highlight.style.setProperty('position', 'fixed', 'important');
    highlight.style.setProperty('z-index', '9999', 'important');
    highlight.style.setProperty('display', 'block', 'important');
    highlight.style.setProperty('visibility', 'visible', 'important');
    
    // Force a reflow to ensure styles are applied
    highlight.offsetHeight;
    
    // Check element size after style application with slight delay
    setTimeout(() => {
      const finalRect = highlight.getBoundingClientRect();
      console.log('🔧 POST-FIX VERIFICATION:');
      console.log('Final highlight element dimensions:', finalRect);
      console.log('Expected vs Actual:', {
        expectedWidth: highlightWidth,
        actualWidth: finalRect.width,
        expectedHeight: highlightHeight,
        actualHeight: finalRect.height,
        expectedX: highlightLeft,
        actualX: finalRect.left,
        expectedY: highlightTop,
        actualY: finalRect.top
      });
      
      if (finalRect.width === 0 || finalRect.height === 0) {
        console.error('⚠️ HIGHLIGHT ELEMENT STILL COLLAPSED AFTER FIX!');
        console.error('Applied styles:', {
          left: highlight.style.left,
          top: highlight.style.top,
          width: highlight.style.width,
          height: highlight.style.height,
          position: highlight.style.position,
          display: highlight.style.display,
          visibility: highlight.style.visibility
        });
      } else {
        console.log('✅ HIGHLIGHT ELEMENT SUCCESSFULLY POSITIONED!');
      }
    }, 50);
    
    // 🎯 HIGHLIGHT POSITIONING DEBUG
    console.log('📍 HIGHLIGHT CALCULATED POSITION:');
    console.log('highlightLeft:', highlightLeft);
    console.log('highlightTop:', highlightTop);
    console.log('highlightWidth:', highlightWidth);
    console.log('highlightHeight:', highlightHeight);
    console.log('Final highlight element position:', highlight.getBoundingClientRect());
    
    // 🔍 COMPARE WITH POPULAR COLORS (WHERE SPOTLIGHT APPEARS WRONGLY)
    const firstPopularColor = document.querySelector('.popular-color-circle');
    if (firstPopularColor) {
      const popularRect = firstPopularColor.getBoundingClientRect();
      console.log('🔴 POPULAR COLORS COMPARISON:');
      console.log('First popular color element:', firstPopularColor);
      console.log('First popular color position:', popularRect);
      console.log('Distance from target to popular color:', {
        deltaX: Math.abs(rect.left - popularRect.left),
        deltaY: Math.abs(rect.top - popularRect.top)
      });
    }
    
    // 🔍 CHECK ALL COLOR INPUT ELEMENTS
    const allColorInputs = document.querySelectorAll('input[type="color"]');
    console.log('🎨 ALL COLOR INPUTS ON PAGE:', allColorInputs.length);
    allColorInputs.forEach((input, index) => {
      const inputRect = input.getBoundingClientRect();
      console.log(`Color input ${index}:`, {
        element: input,
        id: input.id || 'no-id',
        position: inputRect,
        isTarget: input === targetElement
      });
    });
    
    // Position tooltip with boundary detection
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    };
    
    // Mobile detection and responsive dimensions
    const isMobile = window.innerWidth <= 768;
    const tooltipWidth = isMobile ? Math.min(window.innerWidth * 0.9, 300) : 320;
    const tooltipHeight = isMobile ? 140 : 120; // Slightly taller on mobile for better readability
    const margin = isMobile ? 12 : 20; // Smaller margins on mobile
    
    let tooltipX, tooltipY, transform, finalPosition = step.position;
    
    // Mobile-first positioning logic
    if (isMobile) {
      // On mobile, prefer bottom positioning to avoid keyboard overlap
      // and ensure tooltip doesn't go off screen edges
      tooltipX = Math.max(margin, Math.min(
        viewport.width - tooltipWidth - margin,
        rect.left + (rect.width / 2) - (tooltipWidth / 2)
      ));
      
      // Check if element is in top half of screen
      const elementMiddle = rect.top + (rect.height / 2);
      const screenMiddle = viewport.height / 2;

      if (elementMiddle < screenMiddle) {
        // Element in top half - place tooltip below
        finalPosition = 'bottom';
        tooltipY = rect.bottom + margin;
        transform = 'translateX(0)';
      } else {
        // Element in bottom half - place tooltip above
        finalPosition = 'top';
        tooltipY = rect.top - margin - tooltipHeight;
        transform = 'translateX(0)';
      }
      
      // Final boundary check for mobile
      if (tooltipY < viewport.scrollY + margin) {
        finalPosition = 'bottom';
        tooltipY = rect.bottom + margin;
      } else if (tooltipY + tooltipHeight > viewport.scrollY + viewport.height - margin) {
        finalPosition = 'top';
        tooltipY = rect.top - margin - tooltipHeight;
      }
      
    } else {
      // Desktop positioning logic (original)
      if (step.position === 'left') {
        tooltipX = rect.left - margin;
        tooltipY = rect.top + (rect.height / 2);
        transform = 'translate(-100%, -50%)';

        // Check if tooltip would go off left edge
        if (tooltipX - tooltipWidth < viewport.scrollX) {
          finalPosition = 'right';
          tooltipX = rect.right + margin;
          transform = 'translate(0, -50%)';
        }
      } else if (step.position === 'right') {
        tooltipX = rect.right + margin;
        tooltipY = rect.top + (rect.height / 2);
        transform = 'translate(0, -50%)';

        // Check if tooltip would go off right edge
        if (tooltipX + tooltipWidth > viewport.scrollX + viewport.width) {
          finalPosition = 'left';
          tooltipX = rect.left - margin;
          transform = 'translate(-100%, -50%)';
        }
      } else {
        tooltipX = rect.left + (rect.width / 2);
        transform = 'translateX(-50%)';

        if (step.position === 'top') {
          tooltipY = rect.top - margin;
          // Check if tooltip would go off top edge
          if (tooltipY - tooltipHeight < viewport.scrollY) {
            finalPosition = 'bottom';
            tooltipY = rect.bottom + margin;
          }
        } else { // bottom
          tooltipY = rect.bottom + margin;
          // Check if tooltip would go off bottom edge
          if (tooltipY + tooltipHeight > viewport.scrollY + viewport.height) {
            finalPosition = 'top';
            tooltipY = rect.top - margin;
          }
        }
      }
      
      // Check horizontal centering doesn't go off edges for top/bottom positions
      if (step.position === 'top' || step.position === 'bottom') {
        const halfTooltipWidth = tooltipWidth / 2;
        if (tooltipX - halfTooltipWidth < viewport.scrollX + 10) {
          tooltipX = viewport.scrollX + halfTooltipWidth + 10;
        } else if (tooltipX + halfTooltipWidth > viewport.scrollX + viewport.width - 10) {
          tooltipX = viewport.scrollX + viewport.width - halfTooltipWidth - 10;
        }
      }
      
      // Ensure vertical positioning stays within viewport for left/right positions
      if ((finalPosition === 'left' || finalPosition === 'right') && tooltipY) {
        const halfTooltipHeight = tooltipHeight / 2;
        if (tooltipY - halfTooltipHeight < viewport.scrollY + 10) {
          tooltipY = viewport.scrollY + halfTooltipHeight + 10;
        } else if (tooltipY + halfTooltipHeight > viewport.scrollY + viewport.height - 10) {
          tooltipY = viewport.scrollY + viewport.height - halfTooltipHeight - 10;
        }
      }
    }
    
    tooltip.className = `onboarding-tooltip onboarding-tooltip--${finalPosition}`;
    tooltip.style.left = tooltipX + 'px';
    tooltip.style.top = tooltipY + 'px';
    tooltip.style.transform = transform;
    
    tooltip.innerHTML = `
      <div>
        <span class="onboarding-step-counter">${this.currentOnboardingStep + 1}</span>
        <strong>${step.title}</strong>
      </div>
      <p style="margin: 8px 0 0 0; color: #e5e7eb; opacity: 0.9;">${step.description}</p>
    `;
    
    // Update navigation buttons
    const previousBtn = document.getElementById('onboarding-previous');
    nextBtn.textContent = this.currentOnboardingStep === this.onboardingSteps.length - 1 ? 'Got It!' : 'Next';
    
    // Enable/disable Previous button based on current step
    if (previousBtn) {
      previousBtn.style.display = 'block'; // Always visible
      previousBtn.disabled = this.currentOnboardingStep === 0;
      previousBtn.classList.toggle('disabled', this.currentOnboardingStep === 0);
    }
    
    // Mobile-specific adjustments - simplified since we start from top
    if (isMobile) {
      // Add mobile touch feedback (keeping this simple enhancement)
      if (nextBtn) {
        nextBtn.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
      }
      if (previousBtn) {
        previousBtn.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
      }
      
      // 📱 MOBILE FIX: Simple mobile optimizations now that we start from top
      console.log('📱 Applied mobile-specific touch optimizations');
    }
  }
  
  // Move to next onboarding step
  nextOnboardingStep() {
    this.currentOnboardingStep++;
    this.showOnboardingStep();
  }
  
  // Move to previous onboarding step
  previousOnboardingStep() {
    if (this.currentOnboardingStep > 0) {
      this.currentOnboardingStep--;
      this.showOnboardingStep();
    }
  }
  
  // Skip onboarding tour
  skipOnboarding() {
    this.hideOnboarding();
  }
  
  // Complete onboarding tour
  completeOnboarding() {
    this.hideOnboarding();
    
    // Show completion message
    setTimeout(() => {
      this.showOnboardingCompletionMessage();
    }, 300);
  }
  
  // Hide onboarding overlay
  hideOnboarding() {
    const overlay = document.getElementById('color-studio-onboarding-overlay');
    if (overlay) {
      overlay.classList.remove('show');
      setTimeout(() => {
        overlay.remove();
      }, 300);
    }
    
    // 🚫 RE-ENABLE SCROLLING: Restore page scrolling when visual guide is closed
    document.body.classList.remove('onboarding-active');
    document.documentElement.classList.remove('onboarding-active');
    console.log('🔓 Page scrolling re-enabled after visual guide');
  }
  
  // Show brief completion message
  showOnboardingCompletionMessage() {
    const message = document.createElement('div');
    message.className = 'edit-mode-notification show';
    message.innerHTML = `
      <div class="notification-content">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        <span>Great! Now you know how to add colors. Choose your preferred method above.</span>
      </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.classList.remove('show');
      setTimeout(() => message.remove(), 300);
    }, 4000);
  }
  
  // MANUAL TOUR FUNCTIONS
  // Simple functions for manual tour triggering
  
  // Manual tour trigger (same as TOUR button)
  manualTourTrigger() {
    console.log('🎯 Manual tour triggered');
    this.showColorStudioOnboarding();
  }
  
  // Test red pulse animation (keep for testing color tab attention)
  debugTriggerRedPulse() {
    console.log('🔧 DEBUG: Manually triggering red pulse animation...');
    this.triggerColorStudioAttention();
  }

  // ========================================
  // GARMENT STUDIO ONBOARDING SYSTEM
  // ========================================

  // Initialize comprehensive onboarding for Garment Studio
  initializeGarmentStudioOnboarding() {
    console.log('🎯 Garment Studio manual onboarding initialization');

    // Simple delay to ensure Garment Studio is loaded, then show onboarding
    setTimeout(() => {
      this.showGarmentStudioOnboarding();
    }, 100);
  }

  // Show the guided onboarding tour for Garment Studio
  showGarmentStudioOnboarding() {
    console.log('🚀 Starting Garment Studio onboarding tour...');

    // 🔝 MOBILE FIX: Immediately scroll to top for consistent positioning
    console.log('📱 Scrolling to top for consistent mobile positioning...');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // 🚫 PREVENT SCROLLING: Disable page scrolling when visual guide is open
    document.body.classList.add('onboarding-active');
    document.documentElement.classList.add('onboarding-active');
    console.log('🔒 Page scrolling disabled during visual guide');

    // STEP 1: Auto-create demo garment for tour
    console.log('👕 Creating demo garment for tour...');
    const demoGarmentData = {
      name: 'Tour Demo Garment',
      isTourDemo: true,
      isInEditMode: false,
      isComplete: false
    };

    const demoGarmentId = this.addGarment(demoGarmentData);
    console.log(`✅ Demo garment created with ID: ${demoGarmentId}`);

    // STEP 2: Force the demo garment into edit mode
    setTimeout(() => {
      console.log('✏️ Putting demo garment into edit mode...');
      this.expandGarmentForEdit(demoGarmentId);

      // STEP 3: Start the tour after garment is in edit mode with better timing
      setTimeout(() => {
        this.verifyEditModeAndStartTour(demoGarmentId);
      }, 800); // Increased timeout for edit mode to fully initialize
    }, 200);
  }

  // Verify edit mode is active and start tour with proper checks
  verifyEditModeAndStartTour(demoGarmentId) {
    console.log('🔍 Verifying garment edit mode before starting tour...');

    // Check if garment is actually in edit mode
    const garmentCard = document.querySelector(`[data-garment-id="${demoGarmentId}"]`);
    if (!garmentCard) {
      console.error('❌ Demo garment card not found!');
      this.hideGarmentOnboarding();
      return;
    }

    const contentContainer = garmentCard.querySelector('.garment-card__content');
    const isInEditMode = contentContainer && contentContainer.style.display === 'block';

    if (!isInEditMode) {
      console.warn('⚠️ Garment not in edit mode yet, retrying...');
      setTimeout(() => {
        this.verifyEditModeAndStartTour(demoGarmentId);
      }, 500);
      return;
    }

    console.log('✅ Garment confirmed in edit mode, forcing form expansion...');

    // Force expand all sections for the demo garment
    this.expandAllGarmentSections(demoGarmentId);

    // Wait for form expansion and verify before starting tour
    setTimeout(() => {
      this.verifyFormExpansionAndStartTour(demoGarmentId);
    }, 400);
  }

  // Verify form sections are expanded and start the actual tour
  verifyFormExpansionAndStartTour(demoGarmentId) {
    console.log('🔍 Verifying form sections are expanded for demo garment...');

    const demoGarmentCard = document.querySelector(`[data-garment-id="${demoGarmentId}"]`);
    if (!demoGarmentCard) {
      console.error('❌ Demo garment card not found!');
      this.hideGarmentOnboarding();
      return;
    }

    const garmentGrid = demoGarmentCard.querySelector('#garment-type-grid');
    const fabricGrid = demoGarmentCard.querySelector('#fabric-type-grid');
    const sampleStockGrid = demoGarmentCard.querySelector('#sample-stock-grid');
    const sampleCustomGrid = demoGarmentCard.querySelector('#sample-custom-grid');

    const sectionsVisible = [
      { grid: garmentGrid, name: 'Garment Type' },
      { grid: fabricGrid, name: 'Fabric Type' },
      { grid: sampleStockGrid, name: 'Sample Stock' },
      { grid: sampleCustomGrid, name: 'Sample Custom' }
    ];

    const visibleSections = sectionsVisible.filter(section =>
      section.grid && section.grid.offsetParent !== null
    );

    console.log(`📊 Form visibility status: ${visibleSections.length}/${sectionsVisible.length} sections visible`);
    visibleSections.forEach(section => console.log(`✅ ${section.name} grid is visible`));

    const hiddenSections = sectionsVisible.filter(section =>
      !section.grid || section.grid.offsetParent === null
    );

    if (hiddenSections.length > 0) {
      console.warn('⚠️ Some sections still hidden:', hiddenSections.map(s => s.name).join(', '));

      // Retry expansion once more for the demo garment
      this.expandAllGarmentSections(demoGarmentId);

      setTimeout(() => {
        this.startGarmentOnboardingTour(demoGarmentId);
      }, 300);
    } else {
      console.log('🎯 All form sections ready, starting tour!');
      this.startGarmentOnboardingTour(demoGarmentId);
    }
  }

  // Start the actual garment onboarding tour
  startGarmentOnboardingTour(demoGarmentId) {
    console.log('🎯 Starting garment onboarding tour steps...');

    // Store demo garment ID for cleanup
    this.currentDemoGarmentId = demoGarmentId;

    // Hide finalize button during tour since it's a demo garment
    const demoGarmentCard = document.querySelector(`[data-garment-id="${demoGarmentId}"]`);
    if (demoGarmentCard) {
      const finalizeBtn = demoGarmentCard.querySelector('.garment-card__finalize');
      if (finalizeBtn) {
        finalizeBtn.style.display = 'none';
        console.log('🚫 Hidden finalize button during tour');
      }
    }

    // Check if required elements exist AND are visible (garment form should be expanded now)
    const requiredElements = [
      { selector: `[data-garment-id="${demoGarmentId}"] #garment-type-grid`, name: 'Garment Type Grid' },
      { selector: `[data-garment-id="${demoGarmentId}"] #fabric-type-grid`, name: 'Fabric Type Grid' },
      { selector: `[data-garment-id="${demoGarmentId}"] #sample-stock-grid`, name: 'Sample Stock Grid' },
      { selector: `[data-garment-id="${demoGarmentId}"] #sample-custom-grid`, name: 'Sample Custom Grid' }
    ];

    // Check both existence AND visibility
    const missingElements = requiredElements.filter(el => {
      const element = document.querySelector(el.selector);
      return !element || element.offsetParent === null;
    });

    if (missingElements.length > 0) {
      console.warn('⚠️ Some garment form elements not ready yet:', missingElements.map(el => el.name).join(', '));

      // Check if this is a retry attempt
      if (!this.tourRetryCount) this.tourRetryCount = 0;
      this.tourRetryCount++;

      if (this.tourRetryCount >= 3) {
        console.error('❌ Tour failed after 3 attempts - form sections not available');
        this.showTourErrorMessage();
        this.hideGarmentOnboarding();
        return;
      }

      console.log(`🔄 Retry attempt ${this.tourRetryCount}/3 - forcing demo garment form expansion...`);
      this.expandAllGarmentSections(demoGarmentId);

      // Retry after expansion with backoff
      setTimeout(() => this.startGarmentOnboardingTour(demoGarmentId), 1000 * this.tourRetryCount);
      return;
    }

    console.log('✅ All garment onboarding target elements found!');

    // Reset retry count on success
    this.tourRetryCount = 0;

    // Create garment onboarding overlay
    let overlay = document.getElementById('garment-studio-onboarding-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'garment-studio-onboarding-overlay';
      overlay.className = 'color-studio-onboarding'; // Reuse same CSS classes
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="onboarding-highlight" id="garment-onboarding-highlight"></div>
      <div class="onboarding-tooltip" id="garment-onboarding-tooltip"></div>
      <div class="onboarding-controls">
        <button class="onboarding-btn onboarding-btn--secondary" id="garment-onboarding-skip">Skip Tour</button>
        <button class="onboarding-btn onboarding-btn--secondary" id="garment-onboarding-previous">Previous</button>
        <button class="onboarding-btn onboarding-btn--primary" id="garment-onboarding-next">Next</button>
      </div>
    `;

    // Bind garment tour controls
    document.getElementById('garment-onboarding-previous').addEventListener('click', () => this.previousGarmentOnboardingStep());
    document.getElementById('garment-onboarding-skip').addEventListener('click', () => this.skipGarmentOnboarding());
    document.getElementById('garment-onboarding-next').addEventListener('click', () => this.nextGarmentOnboardingStep());

    // Define garment tour steps with GARMENT-SPECIFIC selectors
    this.currentGarmentOnboardingStep = 0;
    this.garmentOnboardingSteps = [
      {
        target: `[data-garment-id="${demoGarmentId}"] #garment-type-grid`,
        title: 'Step 1: Choose Your Garment Type',
        description: 'Select the type of garment you want to produce. Each type has different specifications and requirements. Choose from t-shirts, hoodies, sweatshirts, and more.',
        position: 'bottom'
      },
      {
        target: `[data-garment-id="${demoGarmentId}"] #fabric-type-grid`,
        title: 'Step 2: Select Fabric Type',
        description: 'Choose the fabric material for your garment. This affects texture, durability, and production cost. Common options include cotton, polyester, and blends.',
        position: 'bottom'
      },
      {
        target: `[data-garment-id="${demoGarmentId}"] #sample-stock-grid`,
        title: 'Step 3: Stock Fabric Colors',
        description: 'Choose this option to use our standard fabric colors. This is quick and cost-effective for basic color needs without custom requirements.',
        position: 'bottom'
      },
      {
        target: `[data-garment-id="${demoGarmentId}"] #sample-custom-grid`,
        title: 'Step 4: Custom Colors & Patterns',
        description: 'PANTONE Library: Develop your colorway in Color Studio. Custom Pattern: Use when you have TCX/TPX codes or unique patterns.',
        position: 'bottom'
      }
    ];

    overlay.classList.add('show');

    // Start first step after scroll completes
    setTimeout(() => {
      this.showGarmentOnboardingStep();
    }, 500);
  }

  // Force expand all garment form sections for the tour - DEMO GARMENT SPECIFIC
  expandAllGarmentSections(demoGarmentId) {
    console.log('📂 Expanding all garment form sections for demo garment:', demoGarmentId);

    // Find the demo garment card first
    const demoGarmentCard = document.querySelector(`[data-garment-id="${demoGarmentId}"]`);
    if (!demoGarmentCard) {
      console.error('❌ Demo garment card not found for expansion!');
      return;
    }

    // FORCE EXPAND: Show all expanded sections WITHIN THE DEMO GARMENT
    const garmentExpanded = demoGarmentCard.querySelector('#garment-expanded');
    const fabricExpanded = demoGarmentCard.querySelector('#fabric-expanded');
    const sampleStockExpanded = demoGarmentCard.querySelector('#sample-stock-expanded');
    const sampleCustomExpanded = demoGarmentCard.querySelector('#sample-custom-expanded');

    if (garmentExpanded) {
      garmentExpanded.style.display = 'block';
      garmentExpanded.style.visibility = 'visible';
      console.log('✅ Garment expanded section forced visible');
    }

    if (fabricExpanded) {
      fabricExpanded.style.display = 'block';
      fabricExpanded.style.visibility = 'visible';
      console.log('✅ Fabric expanded section forced visible');
    }

    if (sampleStockExpanded) {
      sampleStockExpanded.style.display = 'block';
      sampleStockExpanded.style.visibility = 'visible';
      console.log('✅ Sample stock section forced visible');
    }

    if (sampleCustomExpanded) {
      sampleCustomExpanded.style.display = 'block';
      sampleCustomExpanded.style.visibility = 'visible';
      console.log('✅ Sample custom section forced visible');
    }

    // FORCE HIDE: Hide all collapsed/summary sections WITHIN THE DEMO GARMENT
    const garmentDisplay = demoGarmentCard.querySelector('#garment-display');
    const fabricDisplay = demoGarmentCard.querySelector('#fabric-display');
    const sampleStockDisplay = demoGarmentCard.querySelector('#sample-stock-display');
    const sampleCustomDisplay = demoGarmentCard.querySelector('#sample-custom-display');

    if (garmentDisplay) {
      garmentDisplay.style.display = 'none';
      console.log('🚫 Garment summary hidden');
    }

    if (fabricDisplay) {
      fabricDisplay.style.display = 'none';
      console.log('🚫 Fabric summary hidden');
    }

    if (sampleStockDisplay) {
      sampleStockDisplay.style.display = 'none';
      console.log('🚫 Sample stock summary hidden');
    }

    if (sampleCustomDisplay) {
      sampleCustomDisplay.style.display = 'none';
      console.log('🚫 Sample custom summary hidden');
    }

    // VERIFICATION: Check if demo garment grids are now visible
    setTimeout(() => {
      // Find the most recently added garment (should be our demo garment)
      const demoGarmentCards = document.querySelectorAll('.garment-card');
      const lastGarmentCard = demoGarmentCards[demoGarmentCards.length - 1];

      if (lastGarmentCard) {
        const garmentGrid = lastGarmentCard.querySelector('#garment-type-grid');
        const fabricGrid = lastGarmentCard.querySelector('#fabric-type-grid');
        const sampleStockGrid = lastGarmentCard.querySelector('#sample-stock-grid');
        const sampleCustomGrid = lastGarmentCard.querySelector('#sample-custom-grid');

        console.log('🔍 Demo garment form section visibility check:');
        console.log('- Garment grid visible:', garmentGrid && garmentGrid.offsetParent !== null);
        console.log('- Fabric grid visible:', fabricGrid && fabricGrid.offsetParent !== null);
        console.log('- Sample stock grid visible:', sampleStockGrid && sampleStockGrid.offsetParent !== null);
        console.log('- Sample custom grid visible:', sampleCustomGrid && sampleCustomGrid.offsetParent !== null);
      } else {
        console.warn('⚠️ Demo garment card not found for verification');
      }
    }, 100);

    console.log('✅ All garment form sections expansion completed');
  }

  // Show current garment onboarding step
  showGarmentOnboardingStep() {
    if (this.currentGarmentOnboardingStep >= this.garmentOnboardingSteps.length) {
      this.completeGarmentOnboarding();
      return;
    }

    const step = this.garmentOnboardingSteps[this.currentGarmentOnboardingStep];
    const highlight = document.getElementById('garment-onboarding-highlight');
    const tooltip = document.getElementById('garment-onboarding-tooltip');
    const nextBtn = document.getElementById('garment-onboarding-next');

    // 🛡️ NULL CHECKS: Ensure all onboarding elements exist
    if (!highlight || !tooltip || !nextBtn) {
      console.error('❌ Critical garment onboarding elements missing:', {
        highlight: !!highlight,
        tooltip: !!tooltip,
        nextBtn: !!nextBtn
      });
      return;
    }

    // Find target element
    const targetElement = document.querySelector(step.target);
    if (!targetElement) {
      console.warn(`Garment onboarding target not found: ${step.target}`);
      this.nextGarmentOnboardingStep();
      return;
    }

    console.log('🎯 Garment onboarding highlighting:', step.target);

    // Position highlight around target
    const rect = targetElement.getBoundingClientRect();
    const highlightLeft = rect.left - 8;
    const highlightTop = rect.top - 8;
    const highlightWidth = rect.width + 16;
    const highlightHeight = rect.height + 16;

    // Apply highlight positioning
    highlight.style.left = `${highlightLeft}px`;
    highlight.style.top = `${highlightTop}px`;
    highlight.style.width = `${highlightWidth}px`;
    highlight.style.height = `${highlightHeight}px`;

    // Position tooltip
    let tooltipTop = rect.bottom + 20;
    let tooltipLeft = rect.left;

    // Adjust tooltip position if it goes off screen
    if (tooltipTop + 200 > window.innerHeight) {
      tooltipTop = rect.top - 220;
    }
    if (tooltipLeft + 400 > window.innerWidth) {
      tooltipLeft = window.innerWidth - 420;
    }

    tooltip.style.left = `${Math.max(20, tooltipLeft)}px`;
    tooltip.style.top = `${Math.max(20, tooltipTop)}px`;

    // Set tooltip content
    tooltip.innerHTML = `
      <h3>${step.title}</h3>
      <p>${step.description}</p>
    `;

    // Update button text
    nextBtn.textContent = this.currentGarmentOnboardingStep === this.garmentOnboardingSteps.length - 1 ? 'Finish' : 'Next';

    console.log(`📍 Showing garment step ${this.currentGarmentOnboardingStep + 1}/${this.garmentOnboardingSteps.length}: ${step.title}`);
  }

  // Navigate to next garment onboarding step
  nextGarmentOnboardingStep() {
    this.currentGarmentOnboardingStep++;
    this.showGarmentOnboardingStep();
  }

  // Navigate to previous garment onboarding step
  previousGarmentOnboardingStep() {
    if (this.currentGarmentOnboardingStep > 0) {
      this.currentGarmentOnboardingStep--;
      this.showGarmentOnboardingStep();
    }
  }

  // Skip garment onboarding tour
  skipGarmentOnboarding() {
    this.hideGarmentOnboarding();
  }

  // Complete garment onboarding tour
  completeGarmentOnboarding() {
    this.hideGarmentOnboarding();

    // Show completion message
    setTimeout(() => {
      this.showGarmentOnboardingCompletionMessage();
    }, 100);
  }

  // Hide garment onboarding overlay
  hideGarmentOnboarding() {
    const overlay = document.getElementById('garment-studio-onboarding-overlay');
    if (overlay) {
      overlay.classList.remove('show');
      setTimeout(() => {
        overlay.remove();
      }, 300);
    }

    // Clean up demo garment
    if (this.currentDemoGarmentId) {
      console.log(`🗑️ Cleaning up demo garment: ${this.currentDemoGarmentId}`);
      this.removeGarment(this.currentDemoGarmentId);
      this.currentDemoGarmentId = null;
    }

    // 🚫 RE-ENABLE SCROLLING: Restore page scrolling when visual guide is closed
    document.body.classList.remove('onboarding-active');
    document.documentElement.classList.remove('onboarding-active');
    console.log('🔓 Page scrolling re-enabled after garment visual guide');
  }

  // Show brief completion message
  showGarmentOnboardingCompletionMessage() {
    const message = document.createElement('div');
    message.className = 'edit-mode-notification show';
    message.innerHTML = `
      <div class="notification-content">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        <span>Great! Now you know how to create garments. Click "Add Garment" to start building your specification.</span>
      </div>
    `;

    document.body.appendChild(message);

    setTimeout(() => {
      message.classList.remove('show');
      setTimeout(() => message.remove(), 300);
    }, 5000);
  }

  // Show error message when tour fails
  showTourErrorMessage() {
    const message = document.createElement('div');
    message.className = 'edit-mode-notification show';
    message.innerHTML = `
      <div class="notification-content">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <span>Tour could not start - the garment form sections are not available. Try creating a garment manually.</span>
      </div>
    `;

    document.body.appendChild(message);

    setTimeout(() => {
      message.classList.remove('show');
      setTimeout(() => message.remove(), 300);
    }, 6000);
  }

  finalizeGarmentAppearance(garmentCard, garmentData) {
    // Force garment to display in finalized collapsed state for variants
    // This skips the normal edit workflow and shows the garment as complete
    
    if (!garmentCard || !garmentData) return;
    
    console.log(`🎨 Finalizing appearance for variant ${garmentData.id}...`);
    console.log(`🔍 Current state - isInEditMode: ${garmentData.isInEditMode}, isComplete: ${garmentData.isComplete}`);
    
    // CRITICAL: Clear edit mode flag FIRST before any DOM manipulation
    garmentData.isInEditMode = false;
    
    // GLOBAL EDIT MODE LOCK CLEANUP: Clear global edit mode lock if this garment was being edited
    if (V10_State.editMode.isLocked && V10_State.editMode.currentGarmentId === garmentData.id) {
      V10_State.editMode.isLocked = false;
      V10_State.editMode.currentGarmentId = null;
      V10_State.editMode.blockedAttempts = 0;
      console.log(`🔓 Global edit mode lock cleared in finalizeGarmentAppearance for ${garmentData.id}`);
    }
    
    const summaryContainer = garmentCard.querySelector('.garment-card__summary');
    const contentContainer = garmentCard.querySelector('.garment-card__content');
    
    if (summaryContainer && contentContainer) {
      console.log(`🔧 Manually forcing summary display for variant ${garmentData.id}`);
      
      // Directly force the display states (bypassing the normal logic)
      summaryContainer.style.display = 'block';
      contentContainer.style.display = 'none';
      
      // Add configured class to show garment as finalized
      garmentCard.classList.add('garment-card--configured');
      
      // Hide any finalize button that might be present
      const finalizeBtn = garmentCard.querySelector('.garment-card__finalize');
      if (finalizeBtn) {
        finalizeBtn.style.display = 'none';
      }
      
      // Show edit button in summary view
      const editBtn = garmentCard.querySelector('.garment-summary__edit-btn');
      if (editBtn) {
        editBtn.style.display = 'flex';
      }
      
      // Update garment summary with current data (including lab dip colors)
      this.updateGarmentSummary(garmentCard, garmentData);
      
      console.log(`✅ Variant ${garmentData.id} appearance finalized - summary visible, content hidden`);
    } else {
      console.error(`❌ Could not find summary/content containers for variant ${garmentData.id}`);
    }
  }

  removeGarment(garmentId) {
    // Delegate to garment manager
    const success = this.garmentManager.removeGarment(garmentId);
    
    if (success) {
      // Handle UI-specific logic after successful removal
      this.garmentManager.renumberGarments();
      
      // If no garments left, add a new one
      if (V10_State.garments.size === 0) {
        console.log('No garments left, adding fresh garment');
        this.addGarment();
      }
      
      // For bulk orders, trigger quantity studio population after garment removal
      const requestType = V10_State.requestType;
      if (requestType === 'bulk-order-request') {
        if (this._quantityStudioRemovalTimeout) {
          clearTimeout(this._quantityStudioRemovalTimeout);
        }
        this._quantityStudioRemovalTimeout = setTimeout(() => {
          if (window.v10GarmentStudio?.populateQuantityStudio) {
            window.v10GarmentStudio.populateQuantityStudio();
            console.log('🔄 Triggered quantity studio population after garment removal');
          }
        }, 200);
      }
    }
    
    return success;
  }

  duplicateGarment(garmentId) {
    // Delegate to garment manager
    const newId = this.garmentManager.duplicateGarment(garmentId);
    if (newId) {
      console.log(`📋 Duplicated garment: ${garmentId}`);
      
      // Update Color Studio assignments if duplicated garment has lab dips
      const duplicatedGarment = V10_State.garments.get(newId);
      if (duplicatedGarment && duplicatedGarment.assignedLabDips && duplicatedGarment.assignedLabDips.size > 0) {
        // Update lab dip collection assignments after garment duplication
        if (window.v10ColorStudio?.updateLabDipCollectionAssignments) {
          setTimeout(() => {
            window.v10ColorStudio.updateLabDipCollectionAssignments();
          }, 100);
        }
      }
    }
    return newId;
  }

  createColorVariant(originalGarmentId, newLabDipId) {
    const originalData = V10_State.garments.get(originalGarmentId);
    if (!originalData) return null;

    // Create variant with same specifications but fresh assignments
    // Mark as a pre-finalized variant to skip edit mode during creation
    const variantData = {
      ...originalData,
      id: undefined, // Will be generated
      assignedLabDips: new Set(), // Start fresh for new color variant
      assignedDesigns: new Set(),
      isComplete: false, // Will be recalculated after lab dip assignment
      isInEditMode: false, // Ensure not in edit mode
      isVariant: true // Flag to indicate this is a color variant
    };

    // Add the new garment variant
    this.addGarment(variantData);
    
    // Get the newly created garment ID (it will be the most recently added)
    const allGarments = Array.from(V10_State.garments.values());
    const newVariant = allGarments[allGarments.length - 1];
    
    if (newVariant) {
      // Assign the new lab dip to the variant
      newVariant.assignedLabDips.add(newLabDipId);
      
      // Update lab dip assignments state
      if (!V10_State.assignments.labDips.has(newLabDipId)) {
        V10_State.assignments.labDips.set(newLabDipId, new Set());
      }
      V10_State.assignments.labDips.get(newLabDipId).add(newVariant.id);
      
      console.log(`🎯 COLOR VARIANT DEBUG: Lab dip ${newLabDipId} assigned to variant ${newVariant.id}`);
      console.log(`🎯 VARIANT ASSIGNMENT STATE:`, V10_State.assignments.labDips.get(newLabDipId));
      
      // Renumber all garments to maintain sequential order
      this.garmentManager.renumberGarments();
      
      // Immediately validate and finalize the variant since it has all required data
      this.updateGarmentStatus(newVariant.id);
      
      // SAFETY CHECK: Ensure global edit mode is not accidentally locked to this variant
      if (V10_State.editMode.isLocked && V10_State.editMode.currentGarmentId === newVariant.id) {
        V10_State.editMode.isLocked = false;
        V10_State.editMode.currentGarmentId = null;
        V10_State.editMode.blockedAttempts = 0;
        console.log(`🔓 Cleared accidental edit lock for variant ${newVariant.id} in createColorVariant`);
      }
      
      // Ensure the variant displays in collapsed state immediately
      setTimeout(() => {
        const variantCard = document.querySelector(`[data-garment-id="${newVariant.id}"]`);
        if (variantCard) {
          // Force the garment to finalized collapsed state (variants should always be collapsed)
          this.finalizeGarmentAppearance(variantCard, newVariant);
          console.log(`🎨 Auto-finalized variant ${newVariant.id} with lab dip assignment`);
        } else {
          console.error(`❌ Could not find variant card for ${newVariant.id}`);
        }
      }, 150);
      
      // Update studio completion status after variant creation
      this.updateStudioCompletion();
      this.updateDesignStudioTabStatus();
      V10_BadgeManager.updateGarmentCompletionBadge();
      V10_BadgeManager.updateDesignCompletionBadge();
      
      // Update assignment overview when variant is created
      if (window.v10ReviewManager) {
        window.v10ReviewManager.populateGarmentAssignments();
      }
      
      // Update lab dip collection assignment text
      if (window.v10ColorStudio) {
        window.v10ColorStudio.updateLabDipCollectionAssignments();
      }

      // If we're currently in Color Studio, immediately refresh the assignment section
      if (V10_State.currentStudio === 'design' && window.v10ReviewManager) {
        setTimeout(() => {
          window.v10ReviewManager.populateGarmentAssignments();
        }, 50);
      }
      
      console.log(`🎨 Created color variant: ${newVariant.id} from ${originalGarmentId} with lab dip ${newLabDipId}`);
      return newVariant.id;
    }
    
    return null;
  }

  positionVariantAfterOriginal(originalGarmentId, variantGarmentId) {
    const originalCard = document.querySelector(`[data-garment-id="${originalGarmentId}"]`);
    const variantCard = document.querySelector(`[data-garment-id="${variantGarmentId}"]`);
    
    if (originalCard && variantCard && originalCard.parentNode) {
      // Move variant card to be directly after original
      originalCard.parentNode.insertBefore(variantCard, originalCard.nextSibling);
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

    // Check if garment already has lab dips assigned
    const hasExistingLabDips = garmentData.assignedLabDips && garmentData.assignedLabDips.size > 0;
    
    if (hasExistingLabDips) {
      // Create a color variant instead of adding to the same garment
      console.log(`🎨 Garment ${garmentId} already has lab dips, creating color variant`);
      const variantId = this.createColorVariant(garmentId, labDipId);
      
      if (variantId) {
        // Force comprehensive status update for all components
        setTimeout(() => {
          this.updateStudioCompletion();
          this.updateDesignStudioTabStatus();
          V10_BadgeManager.updateGarmentCompletionBadge();
          V10_BadgeManager.updateDesignCompletionBadge();
          console.log(`🔄 Forced comprehensive status update after color variant creation`);
        }, 100);
        
        console.log(`✅ Created color variant ${variantId} with lab dip ${labDipId}`);
      }
      return;
    }

    // Original logic for first lab dip assignment
    garmentData.assignedLabDips.add(labDipId);

    if (!V10_State.assignments.labDips.has(labDipId)) {
      V10_State.assignments.labDips.set(labDipId, new Set());
    }
    V10_State.assignments.labDips.get(labDipId).add(garmentId);
    
    console.log(`🎯 ASSIGNMENT DEBUG: Lab dip ${labDipId} assigned to garment ${garmentId}`);
    console.log(`🎯 ASSIGNMENT STATE:`, V10_State.assignments.labDips.get(labDipId));

    this.updateGarmentStatus(garmentId);
    
    // Update garment summary instantly
    const garmentCard = document.querySelector(`[data-garment-id="${garmentId}"]`);
    if (garmentCard) {
      this.updateGarmentSummary(garmentCard, garmentData);
    }
    
    // Force comprehensive status update for all components
    setTimeout(() => {
      this.updateStudioCompletion();
      this.updateDesignStudioTabStatus();
      V10_BadgeManager.updateGarmentCompletionBadge();
      V10_BadgeManager.updateDesignCompletionBadge();
      
      // Update assignment overview and lab dip collection
      if (window.v10ReviewManager) {
        window.v10ReviewManager.populateGarmentAssignments();
      }
      if (window.v10ColorStudio) {
        window.v10ColorStudio.updateLabDipCollectionAssignments();
      }
      
      // If we're currently in Color Studio, immediately refresh the assignment section
      if (V10_State.currentStudio === 'design' && window.v10ReviewManager) {
        setTimeout(() => {
          window.v10ReviewManager.populateGarmentAssignments();
        }, 100);
      }
    }, 50);
  }

  unassignLabDip(garmentId, labDipId) {
    const garmentData = V10_State.garments.get(garmentId);
    if (!garmentData) return;

    garmentData.assignedLabDips.delete(labDipId);
    
    if (V10_State.assignments.labDips.has(labDipId)) {
      V10_State.assignments.labDips.get(labDipId).delete(garmentId);
    }

    this.updateGarmentStatus(garmentId);
    
    // Update garment summary instantly
    const garmentCard = document.querySelector(`[data-garment-id="${garmentId}"]`);
    if (garmentCard) {
      this.updateGarmentSummary(garmentCard, garmentData);
    }
    
    // Update design studio tab and badge
    window.v10GarmentStudio.updateDesignStudioTabStatus();
    V10_BadgeManager.updateGarmentCompletionBadge();
    V10_BadgeManager.updateDesignCompletionBadge();
    
    // Update assignment overview and lab dip collection
    if (window.v10ReviewManager) {
      window.v10ReviewManager.populateGarmentAssignments();
    }
    if (window.v10ColorStudio) {
      window.v10ColorStudio.updateLabDipCollectionAssignments();
    }
    
    // If we're currently in Color Studio, immediately refresh the assignment section
    if (V10_State.currentStudio === 'design' && window.v10ReviewManager) {
      setTimeout(() => {
        window.v10ReviewManager.populateGarmentAssignments();
      }, 100);
    }
  }

  assignDesign(garmentId, designId) {
    const garmentData = V10_State.garments.get(garmentId);
    if (!garmentData) return;

    garmentData.assignedDesigns.add(designId);

    if (!V10_State.assignments.designs.has(designId)) {
      V10_State.assignments.designs.set(designId, new Set());
    }
    V10_State.assignments.designs.get(designId).add(garmentId);

    this.updateGarmentStatus(garmentId);
    
    // Update design studio tab and badge
    window.v10GarmentStudio.updateDesignStudioTabStatus();
    V10_BadgeManager.updateGarmentCompletionBadge();
    V10_BadgeManager.updateDesignCompletionBadge();
    
    // Update assignment overview and lab dip collection
    if (window.v10ReviewManager) {
      window.v10ReviewManager.populateGarmentAssignments();
    }
    if (window.v10ColorStudio) {
      window.v10ColorStudio.updateLabDipCollectionAssignments();
    }
    
    // If we're currently in Color Studio, immediately refresh the assignment section
    if (V10_State.currentStudio === 'design' && window.v10ReviewManager) {
      setTimeout(() => {
        window.v10ReviewManager.populateGarmentAssignments();
      }, 100);
    }
  }

  unassignDesign(garmentId, designId) {
    const garmentData = V10_State.garments.get(garmentId);
    if (!garmentData) return;

    garmentData.assignedDesigns.delete(designId);
    
    if (V10_State.assignments.designs.has(designId)) {
      V10_State.assignments.designs.get(designId).delete(garmentId);
    }

    this.updateGarmentStatus(garmentId);
    
    // Update design studio tab and badge
    window.v10GarmentStudio.updateDesignStudioTabStatus();
    V10_BadgeManager.updateGarmentCompletionBadge();
    V10_BadgeManager.updateDesignCompletionBadge();
    
    // Update assignment overview and lab dip collection
    if (window.v10ReviewManager) {
      window.v10ReviewManager.populateGarmentAssignments();
    }
    if (window.v10ColorStudio) {
      window.v10ColorStudio.updateLabDipCollectionAssignments();
    }
    
    // If we're currently in Color Studio, immediately refresh the assignment section
    if (V10_State.currentStudio === 'design' && window.v10ReviewManager) {
      setTimeout(() => {
        window.v10ReviewManager.populateGarmentAssignments();
      }, 100);
    }
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

    const incompleteGarments = [];
    garments.forEach((garment, index) => {
      if (!garment.isComplete) {
        incompleteGarments.push(garment.number || (index + 1));
      }
    });

    if (incompleteGarments.length > 0) {
      const garmentList = incompleteGarments.join(', ');
      if (incompleteGarments.length === 1) {
        errors.push(`Garment ${garmentList} is incomplete - complete all garments to proceed to review`);
      } else {
        errors.push(`Garments ${garmentList} are incomplete - complete all garments to proceed to review`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      stats: {
        total: garments.length,
        complete: garments.length - incompleteGarments.length,
        incomplete: incompleteGarments.length
      }
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

  getSampleTypeIcon(sampleType, subValue) {
    // Main sample type icons
    if (sampleType === 'stock') {
      // Stock Fabric Color main icon
      return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>';
    } else if (sampleType === 'custom') {
      // Custom Color (Pantone) main icon
      return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/><path d="M12 2a5 5 0 0 1 5 5c0 2-1 4-3 5h-4c-2-1-3-3-3-5a5 5 0 0 1 5-5z"/></svg>';
    }
    
    // Sub-option specific icons
    if (subValue) {
      switch(subValue) {
        case 'black':
          return '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8"/></svg>';
        case 'white':
          return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8"/></svg>';
        case 'proximate':
          return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>';
        case 'design-studio':
          return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8"/><path d="M8 11h6"/></svg>';
        case 'exact-pantone':
          return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><line x1="22" y1="2" x2="12" y2="12"/><path d="m6 6 10 10"/><path d="m8 12 4 4"/></svg>';
        default:
          return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/></svg>';
      }
    }
    
    // Default icon
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="3"/></svg>';
  }

  updateCompactSelection(type, value, garmentCard, subValue = null, isInitialSet = false) {
    // Safety check: ensure garmentCard is a valid DOM element
    if (!garmentCard || !garmentCard.querySelector || !garmentCard.dataset) {
      console.error('❌ updateCompactSelection: Invalid garmentCard provided:', garmentCard);
      return;
    }
    
    if (type === 'garment') {
      const garmentIcon = this.getGarmentIcon(value);
      const selectedIcon = garmentCard.querySelector('#garment-selected-icon');
      const selectedName = garmentCard.querySelector('#garment-selected-name');
      const placeholder = garmentCard.querySelector('#garment-placeholder');
      const display = garmentCard.querySelector('#garment-display');
      const collapsed = garmentCard.querySelector('#garment-collapsed');
      
      if (selectedIcon) selectedIcon.innerHTML = garmentIcon;
      if (selectedName) selectedName.textContent = value;
      if (placeholder) placeholder.style.display = 'none';
      if (display) display.style.display = 'block';
      
      
      // Auto-collapse after selection
      setTimeout(() => {
        this.toggleSelection(garmentCard.querySelector('#garment-collapsed'));
        // Update dependencies after garment selection to enable fabric type
        const garmentId = garmentCard.dataset.garmentId;
        if (garmentId) {
          const garmentData = V10_State.garments.get(garmentId);
          this.uiManager.updateSelectionDependencies(garmentCard, garmentData);
        }
      }, 300);
      
    } else if (type === 'fabric') {
      const fabricIcon = this.getFabricTypeIcon(value);
      const selectedIcon = garmentCard.querySelector('#fabric-selected-icon');
      const selectedName = garmentCard.querySelector('#fabric-selected-name');
      const placeholder = garmentCard.querySelector('#fabric-placeholder');
      const display = garmentCard.querySelector('#fabric-display');
      const collapsed = garmentCard.querySelector('#fabric-collapsed');
      
      if (selectedIcon) selectedIcon.innerHTML = fabricIcon;
      if (selectedName) selectedName.textContent = value;
      if (placeholder) placeholder.style.display = 'none';
      if (display) display.style.display = 'block';
      
      // Auto-collapse after selection
      setTimeout(() => {
        this.toggleSelection(garmentCard.querySelector('#fabric-collapsed'));
        // Update dependencies after fabric type selection
        const garmentId = garmentCard.dataset?.garmentId;
        if (garmentId) {
          const garmentData = V10_State.garments.get(garmentId);
          this.uiManager.updateSelectionDependencies(garmentCard, garmentData);
        }
      }, 300);
      
    } else if (type === 'sampleReference') {
      const sampleReferenceIcon = this.getSampleReferenceIcon(value);
      const selectedIcon = garmentCard.querySelector('#sample-reference-selected-icon');
      const selectedName = garmentCard.querySelector('#sample-reference-selected-name');
      const placeholder = garmentCard.querySelector('#sample-reference-placeholder');
      const display = garmentCard.querySelector('#sample-reference-display');
      const collapsed = garmentCard.querySelector('#sample-reference-collapsed');
      
      if (selectedIcon) selectedIcon.innerHTML = sampleReferenceIcon;
      if (selectedName) selectedName.textContent = this.getSampleReferenceDisplayName(value);
      if (placeholder) placeholder.style.display = 'none';
      if (display) display.style.display = 'block';
      
      // Auto-collapse after selection
      setTimeout(() => {
        this.toggleSelection(garmentCard.querySelector('#sample-reference-collapsed'));
      }, 300);
    
    } else if (type === 'sampleType') {
      // Handle sample type selections with sub-values
      const input = garmentCard.querySelector(`input[name*="sampleType"]:checked`);
      const sampleType = input?.value;
      // Use passed subValue parameter, fallback to DOM if not provided
      const actualSubValue = subValue || input?.dataset.subValue;
      
      console.log(`🔍 DEBUG updateCompactSelection sampleType: ${value}, actualSubValue: ${actualSubValue}, isInitialSet: ${isInitialSet}`);
      
      // Remove selected class from both sections first
      const stockSection = garmentCard.querySelector('#sample-stock-collapsed')?.closest('.compact-selection-section');
      const customSection = garmentCard.querySelector('#sample-custom-collapsed')?.closest('.compact-selection-section');
      
      // Get garment data once for the entire function
      const garmentId = garmentCard.dataset?.garmentId;
      const garmentData = garmentId ? V10_State.garments.get(garmentId) : null;
      
      stockSection?.classList.remove('selected');
      customSection?.classList.remove('selected');
      
      if (sampleType === 'stock') {
        const selectedIcon = garmentCard.querySelector('#sample-stock-selected-icon');
        const selectedName = garmentCard.querySelector('#sample-stock-selected-name');
        const placeholder = garmentCard.querySelector('#sample-stock-placeholder');
        const display = garmentCard.querySelector('#sample-stock-display');
        const priceElement = garmentCard.querySelector('#sample-stock-price');
        
        // Get display name for sub-option
        const displayName = this.getSampleStockDisplayName(actualSubValue);
        const icon = this.getSampleStockIcon(actualSubValue);
        
        if (selectedIcon) selectedIcon.innerHTML = icon;
        if (selectedName) selectedName.textContent = displayName;
        if (placeholder) placeholder.style.display = 'none';
        if (display) display.style.display = 'block';
        
        // Price display removed - keeping selection functionality  
        if (priceElement && garmentData) {
          priceElement.textContent = '';
        }
        
        // FIXED: Apply selection styling to individual radio card instead of entire section
        // First, remove selected class from all stock radio cards
        const stockCards = garmentCard.querySelectorAll('#sample-stock-grid .compact-radio-card');
        stockCards.forEach(card => card.classList.remove('compact-radio-card--selected'));
        
        // Then, add selection class to the specific selected radio card
        const selectedRadio = garmentCard.querySelector(`input[name*="sampleType"][value="stock"][data-sub-value="${actualSubValue}"]:checked`);
        const selectedCard = selectedRadio?.closest('.compact-radio-card');
        if (selectedCard) {
          selectedCard.classList.add('compact-radio-card--selected');
        }
        
        // ALWAYS update garment state with current selection (regardless of previous state)
        garmentData.sampleType = sampleType;
        garmentData.sampleSubValue = actualSubValue;
        
        // Only do cross-option reset and auto-collapse for live user selections, not initial value setting
        if (!isInitialSet) {
          // COMPLETE CROSS-OPTION RESET: Fully reset custom when stock is selected
          const customPlaceholder = garmentCard.querySelector('#sample-custom-placeholder');
          const customDisplay = garmentCard.querySelector('#sample-custom-display');
          const customRadios = garmentCard.querySelectorAll('input[name*="sampleType"][value="custom"]');
          const customCards = garmentCard.querySelectorAll('#sample-custom-grid .compact-radio-card');
          
          // Reset visual state
          if (customPlaceholder) customPlaceholder.style.display = 'flex';
          if (customDisplay) customDisplay.style.display = 'none';
          
          // Reset radio inputs
          customRadios.forEach(radio => radio.checked = false);
          
          // Reset visual selection cards
          customCards.forEach(card => card.classList.remove('compact-radio-card--selected'));
          
          // Auto-collapse ONLY the selected stock section (don't collapse the reset custom section)
          setTimeout(() => {
            this.toggleSelection(garmentCard.querySelector('#sample-stock-collapsed'));
          }, 300);
        }
        
      } else if (sampleType === 'custom') {
        const selectedIcon = garmentCard.querySelector('#sample-custom-selected-icon');
        const selectedName = garmentCard.querySelector('#sample-custom-selected-name');
        const placeholder = garmentCard.querySelector('#sample-custom-placeholder');
        const display = garmentCard.querySelector('#sample-custom-display');
        const priceElement = garmentCard.querySelector('#sample-custom-price');
        
        console.log(`🔍 DEBUG custom sample type DOM elements:`, {
          selectedIcon: !!selectedIcon,
          selectedName: !!selectedName,
          placeholder: !!placeholder,
          display: !!display,
          actualSubValue
        });
        
        // Get display name for sub-option
        const displayName = this.getSampleCustomDisplayName(actualSubValue);
        const icon = this.getSampleCustomIcon(actualSubValue);
        
        console.log(`🔍 DEBUG custom display values:`, { displayName, icon });
        
        if (selectedIcon) selectedIcon.innerHTML = icon;
        if (selectedName) selectedName.textContent = displayName;
        if (placeholder) {
          placeholder.style.display = 'none';
          console.log(`🔍 DEBUG: Set placeholder display to none`);
        }
        if (display) {
          display.style.display = 'block';
          console.log(`🔍 DEBUG: Set display to block`);
        }
        
        // Update pricing
        const garmentId = garmentCard.dataset?.garmentId;
        const garmentData = garmentId ? V10_State.garments.get(garmentId) : null;
        // Price display removed - keeping selection functionality
        if (priceElement && garmentData) {
          priceElement.textContent = '';
        }
        
        // FIXED: Apply selection styling to individual radio card instead of entire section
        // First, remove selected class from all custom radio cards
        const customCards = garmentCard.querySelectorAll('#sample-custom-grid .compact-radio-card');
        customCards.forEach(card => card.classList.remove('compact-radio-card--selected'));
        
        // Then, add selection class to the specific selected radio card
        const selectedRadio = garmentCard.querySelector(`input[name*="sampleType"][value="custom"][data-sub-value="${actualSubValue}"]:checked`);
        const selectedCard = selectedRadio?.closest('.compact-radio-card');
        if (selectedCard) {
          selectedCard.classList.add('compact-radio-card--selected');
        }
        
        // ALWAYS update garment state with current selection (regardless of previous state)
        garmentData.sampleType = sampleType;
        garmentData.sampleSubValue = actualSubValue;
        
        // Only do cross-option reset and auto-collapse for live user selections, not initial value setting
        if (!isInitialSet) {
          // COMPLETE CROSS-OPTION RESET: Fully reset stock when custom is selected
          const stockPlaceholder = garmentCard.querySelector('#sample-stock-placeholder');
          const stockDisplay = garmentCard.querySelector('#sample-stock-display');
          const stockRadios = garmentCard.querySelectorAll('input[name*="sampleType"][value="stock"]');
          const stockCards = garmentCard.querySelectorAll('#sample-stock-grid .compact-radio-card');
          
          // Reset visual state
          if (stockPlaceholder) stockPlaceholder.style.display = 'flex';
          if (stockDisplay) stockDisplay.style.display = 'none';
          
          // Reset radio inputs
          stockRadios.forEach(radio => radio.checked = false);
          
          // Reset visual selection cards
          stockCards.forEach(card => card.classList.remove('compact-radio-card--selected'));
          
          // Auto-collapse ONLY the selected custom section (don't collapse the reset stock section)
          setTimeout(() => {
            this.toggleSelection(garmentCard.querySelector('#sample-custom-collapsed'));
          }, 300);
        }
      }
    }
  }











  enableSelectionSection(section) {
    const widget = section.querySelector('.compact-selection-widget');
    const placeholder = section.querySelector('.placeholder-text');
    const warningBox = section.querySelector('#custom-color-warning');
    
    // FIXED: Also look for the v10 custom color restriction warning in the garment card
    const garmentCard = section.closest('.v10-garment-card');
    const v10WarningBox = garmentCard?.querySelector('.v10-custom-color-restriction-warning');
    
    if (widget) {
      widget.style.opacity = '1';
      widget.style.pointerEvents = 'auto';
      widget.style.cursor = 'pointer';
      
      // Re-enable all child interactive elements
      const interactiveElements = widget.querySelectorAll('input, button, label, .compact-radio-card');
      interactiveElements.forEach(el => {
        el.style.pointerEvents = '';
        el.style.cursor = '';
        if (el.tagName === 'INPUT') {
          el.disabled = false;
        }
      });
    }
    
    // Hide warning box when enabling
    if (warningBox) {
      warningBox.style.display = 'none';
    }
    
    // FIXED: Hide the v10 custom color restriction warning as well
    if (v10WarningBox) {
      v10WarningBox.style.display = 'none';
    }
    
    if (placeholder) {
      if (placeholder.dataset.originalText) {
        placeholder.textContent = placeholder.dataset.originalText;
      }
      
      // Special handling for sample type widgets - ensure proper display states
      const isStockSample = widget && widget.id === 'sample-stock-collapsed';
      const isCustomSample = widget && widget.id === 'sample-custom-collapsed';
      
      if (isStockSample || isCustomSample) {
        const placeholderDiv = widget.querySelector('.selection-placeholder');
        const displayDiv = widget.querySelector('.selection-display');
        
        // Ensure placeholder is visible and display is hidden (until actual selection)
        if (placeholderDiv) placeholderDiv.style.display = 'flex';
        if (displayDiv) displayDiv.style.display = 'none';
      }
    }
  }

  disableSelectionSection(section, disabledText) {
    const widget = section.querySelector('.compact-selection-widget');
    const placeholder = section.querySelector('.placeholder-text');
    const warningBox = section.querySelector('#custom-color-warning');
    
    // FIXED: Also look for the v10 custom color restriction warning in the garment card
    const garmentCard = section.closest('.v10-garment-card');
    const v10WarningBox = garmentCard?.querySelector('.v10-custom-color-restriction-warning');
    
    if (widget) {
      widget.style.opacity = '0.5';
      widget.style.pointerEvents = 'none';
      widget.style.cursor = 'not-allowed';
      
      // Also disable all child interactive elements to prevent clicks
      const interactiveElements = widget.querySelectorAll('input, button, label, .compact-radio-card');
      interactiveElements.forEach(el => {
        el.style.pointerEvents = 'none';
        el.style.cursor = 'not-allowed';
        if (el.tagName === 'INPUT') {
          el.disabled = true;
        }
      });
    }
    
    // For cotton validation, show warning box instead of changing placeholder
    if (warningBox && disabledText.includes('Not available for this fabric')) {
      warningBox.style.display = 'block';
    } else if (v10WarningBox && disabledText.includes('Not available for this fabric')) {
      // FIXED: Show the v10 custom color restriction warning for fabric restrictions
      v10WarningBox.style.display = 'block';
    } else if (placeholder) {
      // For other validations, update placeholder text
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
    console.log(`🔍 Getting garment icon for: "${garmentType}"`);
    
    // Map garment types to their sprite icon names
    const iconNameMap = {
      'Zip-Up Hoodie': 'zip-up-hoodie',
      'Hoodie': 'hoodie',
      'T-Shirt': 't-shirt',
      'Sweatshirt': 'sweatshirt',
      'Sweatpants': 'sweatpants',
      'Shorts': 'shorts',
      'Long Sleeve T-Shirt': 'long-sleeve',
      'Shirt': 'shirt',
      'Polo Shirt': 'polo-shirt',
      'Tank Top': 'tank-top',
      'Hat/Cap': 'hat-cap',
      'Beanie': 'beanie'
    };
    
    const iconName = iconNameMap[garmentType];
    
    if (iconName) {
      // Use the sprite icon with the same structure as the Liquid template
      const result = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><use href="/assets/icons.svg#icon-${iconName}"></use></svg>`;
      console.log(`🎯 Returning sprite icon for "${garmentType}": icon-${iconName}`);
      return result;
    }
    
    // Fallback for unknown garment types
    const fallback = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0l-4.38 1.46a2 2 0 0 0-1.49 2.28l.5 3C2.78 9.66 3 10.26 3 11v9a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-9c0-.74.22-1.34.37-2.26l.5-3a2 2 0 0 0-1.49-2.28z"/></svg>';
    console.log(`🎯 Returning fallback icon for "${garmentType}"`);
    return fallback;
  }

  getFabricTypeIcon(fabricType) {
    // Cotton-based fabrics
    if (fabricType.includes('Cotton')) {
      return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 2L8 6v4l4 4 4-4V6z"/><circle cx="12" cy="8" r="2"/><path d="M8 14v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4"/></svg>';
    }
    // Polyester fabrics
    else if (fabricType.includes('Polyester')) {
      return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 2l3.5 3.5L12 9 8.5 5.5z"/><path d="M12 9l3.5 3.5L12 16l-3.5-3.5z"/><path d="M12 16l3.5 3.5L12 23l-3.5-3.5z"/></svg>';
    }
    // Hemp fabrics
    else if (fabricType.includes('Hemp')) {
      return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3v18"/><path d="M8 7l8 0"/><path d="M6 11l12 0"/><path d="M8 15l8 0"/><circle cx="12" cy="5" r="2"/></svg>';
    }
    // Linen fabrics
    else if (fabricType.includes('Linen')) {
      return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 12h18m-9-9v18"/><path d="M8 8l8 8m0-8l-8 8"/></svg>';
    }
    // Blend fabrics (Cotton-Poly combinations)
    else if (fabricType.includes('/') || fabricType.includes('-')) {
      return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="9" cy="9" r="2"/><path d="M13 5v6l3 3"/><path d="M5 13h6l3-3"/><circle cx="15" cy="15" r="2"/></svg>';
    }
    // Elastane/Spandex blends
    else if (fabricType.includes('Elastane') || fabricType.includes('Spandex')) {
      return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 12c0-4.5 2-8 5-8s5 3.5 5 8-2 8-5 8-5-3.5-5-8z"/><path d="M16 12c0-4.5 2-8 5-8v16c-3 0-5-3.5-5-8z"/></svg>';
    }
    // Default fabric icon
    else {
      return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"/><path d="M21 7L12 2 3 7"/><path d="M12 2v5"/><path d="M8 7v10"/><path d="M16 7v10"/></svg>';
    }
  }

  getSampleReferenceIcon(referenceType) {
    const iconMap = {
      'blank': '⚪',
      'with-design-applied': '🎨'
    };
    return iconMap[referenceType] || '📋';
  }

  getSampleReferenceDisplayName(referenceType) {
    if (!referenceType || referenceType === '') {
      return 'Select sample reference';
    }
    const nameMap = {
      'blank': 'BLANK',
      'with-design-applied': 'WITH DESIGN APPLIED'
    };
    return nameMap[referenceType] || referenceType;
  }

  getSampleStockDisplayName(subValue) {
    switch(subValue) {
      case 'black':
        return 'Black';
      case 'white':
        return 'White';
      case 'proximate':
        return 'Most proximate color';
      default:
        return 'Stock Color';
    }
  }

  getSampleStockIcon(subValue) {
    const iconMap = {
      'black': '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10" fill="#000000"/></svg>',
      'white': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10" fill="#ffffff" stroke="#000000"/></svg>',
      'proximate': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
      'default': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>'
    };
    return iconMap[subValue] || iconMap['default'];
  }

  getSampleCustomDisplayName(subValue) {
    switch(subValue) {
      case 'design-studio':
        return 'COLOR STUDIO';
      case 'exact-pantone':
        return 'Tech Pack (Pantone/Patterns)';
      default:
        return 'Custom Color';
    }
  }

  getSampleCustomIcon(subValue) {
    const iconMap = {
      'design-studio': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
      'exact-pantone': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
      'default': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 2a10 10 0 1 0 10 10c0-5.523-4.477-10-10-10z"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>'
    };
    return iconMap[subValue] || iconMap['default'];
  }



  // Unified sample type update function - handles all sample type operations consistently
  updateSampleType(garmentId, sampleType, sampleSubValue, garmentCard) {
    const garmentData = V10_State.garments.get(garmentId);
    if (!garmentData) return;

    console.log(`🔄 Unified sample type update: ${garmentId} → ${sampleType} (${sampleSubValue || 'no subvalue'})`);

    // Update state - preserve undefined vs empty string distinction
    garmentData.sampleType = sampleType;
    garmentData.sampleSubValue = sampleSubValue; // Don't convert undefined to empty string

    // Update visual display
    this.updateCompactSelection('sampleType', sampleType, garmentCard, sampleSubValue);

    // Update pricing
    V10_Utils.updateSampleTypePrices(garmentCard);

    // Mark finalize button as changed
    this.markEditButtonAsChanged(garmentCard);

    // Update garment status
    this.updateGarmentStatus(garmentId);

    console.log(`✅ Sample type unified update complete: ${sampleType}${sampleSubValue ? ` (${sampleSubValue})` : ''}`);
  }

  saveCurrentQuantitiesToState() {
    // Find all quantity input fields and save their values to V10_State
    const quantityInputs = document.querySelectorAll('.size-input');
    
    quantityInputs.forEach(input => {
      const garmentCard = input.closest('.garment-quantity-card');
      if (!garmentCard) return;
      
      const garmentId = garmentCard.dataset.garmentId;
      const colorwayId = input.dataset.colorwayId;
      const size = input.dataset.size;
      const value = parseInt(input.value) || 0;
      
      if (!garmentId || !colorwayId || !size) return;
      
      // Ensure garment data exists in garments state
      if (!V10_State.garments.has(garmentId)) {
        V10_State.garments.set(garmentId, {
          colorways: new Map()
        });
      }
      
      const garmentData = V10_State.garments.get(garmentId);
      
      // Ensure colorway exists
      if (!garmentData.colorways.has(colorwayId)) {
        garmentData.colorways.set(colorwayId, {
          id: colorwayId,
          quantities: {}
        });
      }
      
      const colorwayData = garmentData.colorways.get(colorwayId);
      colorwayData.quantities[size] = value;
    });
    
    console.log('💾 Saved current quantities to state');
  }

  restoreQuantitiesFromState() {
    // Restore saved quantities to the DOM inputs from garment state
    V10_State.garments.forEach((garmentData, garmentId) => {
      if (!garmentData.colorways || garmentData.colorways.size === 0) return;
      
      // Find the quantity card for this ID
      const garmentCard = document.querySelector(`.garment-quantity-card[data-garment-id="${garmentId}"]`);
      if (!garmentCard) return;
      
      // Ensure colorways are rendered first - if missing, force re-render
      const hasColorwayRows = garmentCard.querySelectorAll('[data-colorway-id]').length > 0;
      if (!hasColorwayRows) {
        console.log(`🔄 Re-rendering colorways for garment ${garmentId} during restoration`);
        this.renderExistingColorways(garmentId);
      }
      
      // Restore each colorway's quantities
      garmentData.colorways.forEach((colorwayData, colorwayId) => {
        if (!colorwayData.quantities) return;
        
        Object.entries(colorwayData.quantities).forEach(([size, quantity]) => {
          const input = garmentCard.querySelector(`[data-colorway-id="${colorwayId}"][data-size="${size}"]`);
          if (input && quantity > 0) {
            input.value = quantity;
            
            // Trigger input event to update calculations
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
      });
      
      // Update stats after restoration
      this.updateGarmentStats(garmentId);
    });
    
    console.log('🔄 Restored quantities from state');
  }

  cleanupQuantityStudioEventListeners() {
    // Store references to event listeners that need cleanup
    if (this._quantityEventListeners) {
      this._quantityEventListeners.forEach(({element, event, handler}) => {
        if (element && typeof element.removeEventListener === 'function') {
          element.removeEventListener(event, handler);
        }
      });
      this._quantityEventListeners = [];
    }
    
    // Clone and replace elements with listeners to ensure cleanup
    const elementsToCleanup = [
      'sizes-mode',
      'distribution-mode', 
      'clear-all-quantities',
      'apply-preset-btn'
    ];
    
    elementsToCleanup.forEach(id => {
      const element = document.getElementById(id);
      if (element && element.parentNode) {
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
      }
    });
    
    console.log('🧹 Cleaned up quantity studio event listeners');
  }

  populateQuantityStudio() {
    console.log('🔄 populateQuantityStudio() called - Using V10_QuantityStudioManager');
    
    // Initialize the new quantity studio manager if not already created
    if (!window.v10QuantityStudio) {
      window.v10QuantityStudio = new V10_QuantityStudioManager();
    }
    
    // Initialize the quantity studio (idempotent - safe to call multiple times)
    window.v10QuantityStudio.initialize();
  }

  // Removed duplicate createProfessionalQuantityCard and initializeProfessionalColorways functions
  // These are handled by V10_QuantityStudioManager

  // Removed duplicate colorway functions - all handled by V10_QuantityStudioManager
  // Deleted entire duplicate code block (750+ lines removed)

  setupGarmentInfo(card, garment) {
    console.log('🔍 [GARMENT_DEBUG] setupGarmentInfo called');
    console.log('📥 [GARMENT_DEBUG] Input garment data:', {
      id: garment.id,
      type: garment.type,
      fabricType: garment.fabricType,
      sampleReference: garment.sampleReference
    });
    console.log('📋 [GARMENT_DEBUG] Card element:', card);
    
    // Get request type to determine which elements to show
    const requestType = V10_State.requestType || 'sample-request';
    
    // Update garment type
    const garmentType = card.querySelector('#garment-type-display, .garment-name');
    if (garmentType) {
      const typeToSet = garment.type || 'Select garment type';
      console.log('📤 [GARMENT_DEBUG] Setting garment type display to:', typeToSet);
      garmentType.textContent = typeToSet;
      console.log('✅ [GARMENT_DEBUG] Garment type element text after update:', garmentType.textContent);
    } else {
      console.log('❌ [GARMENT_DEBUG] Garment type element not found!');
    }
    
    // Handle fabric/sample reference based on request type
    if (requestType === 'bulk-order-request') {
      // For bulk orders: show sample reference, hide fabric
      const fabricElement = card.querySelector('#garment-fabric-display');
      const sampleRefElement = card.querySelector('#garment-sample-reference-display');
      
      if (fabricElement) {
        fabricElement.style.display = 'none';
      }
      
      if (sampleRefElement) {
        sampleRefElement.style.display = 'inline';
        const sampleRefInfo = garment.sampleReference || 'Select sample reference';
        sampleRefElement.textContent = sampleRefInfo;
        console.log('📤 [GARMENT_DEBUG] Setting sample reference display to:', sampleRefInfo);
      }
    } else {
      // For sample requests: show fabric, hide sample reference
      const fabricElement = card.querySelector('#garment-fabric-display');
      const sampleRefElement = card.querySelector('#garment-sample-reference-display');
      
      if (sampleRefElement) {
        sampleRefElement.style.display = 'none';
      }
      
      if (fabricElement) {
        fabricElement.style.display = 'inline';
        const fabricInfo = garment.fabricType || 'Select fabric';
        fabricElement.textContent = fabricInfo;
        console.log('📤 [GARMENT_DEBUG] Setting fabric display to:', fabricInfo);
      }
    }
    
    // Get elements for total and status updates (now in the action bar)
    const garmentTotalQuantity = card.querySelector('#garment-action-total');
    const quantityStatus = card.querySelector('#garment-action-status');
    const minimumRequired = card.querySelector('#minimum-required');
    
    // Initialize total and status
    if (garmentTotalQuantity) {
      garmentTotalQuantity.textContent = '0';
    }
    
    if (quantityStatus) {
      quantityStatus.textContent = 'Insufficient';
      quantityStatus.className = 'quantity-status insufficient';
    }
    
    // Calculate and display minimum required
    const colorwayCountValue = this.quantityCalculator.getColorwayCount(garment.id);
    const productionType = this.quantityCalculator.determineProductionType(garment);
    const minimum = this.quantityCalculator.getMinimumQuantity(colorwayCountValue, productionType, garment.type);
    
    if (minimumRequired) {
      minimumRequired.textContent = `Min: ${minimum}`;
    }
  }

  setupColorwaySystem(card, garment) {
    // Get assigned lab dips for colorway indicators
    const assignedLabDips = this.getAssignedLabDips(garment.id);
    const colorwayIndicators = card.querySelector('#colorway-indicators');
    const colorwaySelector = card.querySelector('#colorway-selector');
    
    if (colorwayIndicators && assignedLabDips.length > 0) {
      colorwayIndicators.innerHTML = '';
      assignedLabDips.forEach(labDip => {
        const indicator = document.createElement('div');
        indicator.className = 'colorway-indicator';
        indicator.style.backgroundColor = labDip.color || '#000000';
        indicator.title = labDip.pantoneCode || 'Unknown Color';
        colorwayIndicators.appendChild(indicator);
      });
    }
    
    // Show colorway selector if multiple colorways
    if (colorwaySelector && assignedLabDips.length > 1) {
      colorwaySelector.style.display = 'block';
      this.setupColorwayTabs(colorwaySelector, assignedLabDips, garment.id);
    }
  }

  setupResponsiveSizeInputs(card, garment) {
    const sizeInputCards = card.querySelectorAll('.size-input-card');
    const sizeInputs = card.querySelectorAll('.size-quantity-input');
    
    sizeInputs.forEach((input, index) => {
      const size = input.dataset.size;
      input.name = `qty-${size}-${garment.id}`;
      input.id = `qty-${size}-${garment.id}`;
      
      const sizeCard = sizeInputCards[index];
      // Fix for 3xl IDs that start with numbers
      const sizeIdPrefix = size === '3xl' ? 'threexl' : size;
      const percentageElement = sizeCard?.querySelector(`#${sizeIdPrefix}-percentage`);
      const barElement = sizeCard?.querySelector(`#${sizeIdPrefix}-bar`);
      
      // Enhanced event listeners with real-time feedback
      input.addEventListener('input', (e) => {
        const value = parseInt(e.target.value) || 0;
        
        // Update garment quantity data
        this.updateGarmentQuantityFromInput(garment.id, size, value);
        
        // Update percentage and bar for this size
        this.updateSizeCard(sizeCard, size, value, garment.id);
        
        // Update overall validation
        this.updateGarmentValidation(garment.id);
        
        // Update colorway validation if multiple colorways
        this.updateAllColorwayValidations();
        
        // Update global progress
        this.quantityCalculator.calculateAndUpdateProgress();
        
        // Update size distribution validation
        this.validateSizeDistribution(garment.id);
        
        // Save data
        this.saveQuantityData(garment.id);
      });
      
      input.addEventListener('focus', (e) => {
        e.target.select();
        // Highlight the size card
        sizeCard?.classList.add('size-input-card--focused');
      });
      
      input.addEventListener('blur', (e) => {
        sizeCard?.classList.remove('size-input-card--focused');
      });
    });
  }

  setupPresetSystem(card, garment) {
    const applyPresetBtn = card.querySelector('#apply-preset-to-garment');
    const presetMenu = card.querySelector('#garment-preset-menu');
    const clearBtn = card.querySelector('#clear-garment-quantities');
    
    if (applyPresetBtn) {
      applyPresetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (presetMenu) {
          presetMenu.classList.toggle('show');
        }
      });
    }
    
    if (presetMenu) {
      const presetOptions = presetMenu.querySelectorAll('.preset-option');
      presetOptions.forEach(option => {
        option.addEventListener('click', () => {
          const presetName = option.dataset.preset;
          this.quantityCalculator.applyPresetToGarment(garment.id, presetName);
          this.updateGarmentValidation(garment.id);
          presetMenu.classList.remove('show');
        });
      });
    }
    
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clearGarmentQuantities(garment.id);
      });
    }
    
    // Close preset menu when clicking outside
    document.addEventListener('click', () => {
      presetMenu?.classList.remove('show');
    });
  }

  setupRealTimeValidation(card, garment) {
    const validationMessages = card.querySelector('#validation-messages');
    if (validationMessages) {
      validationMessages.id = `validation-messages-${garment.id}`;
    }
    
    const summaryElements = {
      total: card.querySelector('#garment-summary-total'),
      required: card.querySelector('#garment-summary-required'),
      progress: card.querySelector('#garment-summary-progress')
    };
    
    // Set IDs for summary elements
    if (summaryElements.total) summaryElements.total.id = `summary-total-${garment.id}`;
    if (summaryElements.required) summaryElements.required.id = `summary-required-${garment.id}`;
    if (summaryElements.progress) summaryElements.progress.id = `summary-progress-${garment.id}`;
  }

  setupSizeDistributionLimits(card, garment) {
    const limitsElement = card.querySelector('#size-distribution-limits');
    const limitHelpBtn = card.querySelector('.limit-help-btn');
    
    if (limitsElement) {
      limitsElement.id = `size-limits-${garment.id}`;
    }
    
    if (limitHelpBtn) {
      limitHelpBtn.addEventListener('click', () => {
        this.showSizeDistributionHelp(garment.id);
      });
    }
  }

  // ==============================================
  // SOPHISTICATED VALIDATION SYSTEM
  // ==============================================

  initializeValidationSystem() {
    console.log('🔍 Initializing sophisticated validation system...');
    
    // Clear existing validation state
    V10_State.quantities.validationCards.clear();
    
    // Set up global validation event handlers
    this.setupGlobalValidationHandlers();
    
    console.log('✅ Validation system initialized');
  }

  setupGlobalValidationHandlers() {
    // Real-time validation on any quantity input change
    document.addEventListener('input', (e) => {
      if (e.target.classList.contains('size-quantity-input')) {
        const card = e.target.closest('.garment-quantity-card, .garment-quantity-row');
        if (card) {
          const garmentId = card.dataset.garmentId;
          this.debouncedValidationUpdate(garmentId);
        }
      }
    });
  }

  debouncedValidationUpdate(garmentId) {
    // Debounce validation updates to avoid excessive calculations
    clearTimeout(this.validationTimeouts?.[garmentId]);
    this.validationTimeouts = this.validationTimeouts || {};
    
    this.validationTimeouts[garmentId] = setTimeout(() => {
      this.updateGarmentValidation(garmentId);
      this.updateAllValidationCards();
    }, 150);
  }

  updateGarmentValidation(garmentId) {
    const garment = V10_State.garments.get(garmentId);
    if (!garment) return;

    // Get current quantity data
    const quantityData = V10_State.quantities.garments.get(garmentId) || { sizes: {}, total: 0 };
    
    // Calculate minimum required for this garment
    const colorwayCount = this.quantityCalculator.getColorwayCount(garmentId);
    const productionType = this.quantityCalculator.determineProductionType(garment);
    const minimumRequired = this.quantityCalculator.getMinimumQuantity(colorwayCount, productionType, garment.type);
    
    // Calculate progress
    const currentTotal = quantityData.total || 0;
    const progress = minimumRequired > 0 ? Math.min((currentTotal / minimumRequired) * 100, 100) : 0;
    
    // Update garment card visual state
    const garmentCard = document.querySelector(`[data-garment-id="${garmentId}"]`);
    if (garmentCard) {
      if (currentTotal >= minimumRequired) {
        garmentCard.classList.add('garment-quantity-card--complete');
      } else {
        garmentCard.classList.remove('garment-quantity-card--complete');
      }
    }
    
    // Update quantity status visual
    const quantityStatus = garmentCard?.querySelector('.quantity-status, .garment-total-units');
    if (quantityStatus) {
      quantityStatus.textContent = currentTotal;
      if (currentTotal >= minimumRequired) {
        quantityStatus.classList.add('sufficient');
        quantityStatus.classList.remove('insufficient');
      } else {
        quantityStatus.classList.add('insufficient');
        quantityStatus.classList.remove('sufficient');
      }
    }
    
    // Update status badge
    const statusBadge = garmentCard?.querySelector('.status-badge, [data-status-badge]');
    if (statusBadge) {
      if (currentTotal >= minimumRequired) {
        statusBadge.textContent = 'SUFFICIENT';
        statusBadge.className = 'status-badge status-badge--sufficient';
      } else {
        statusBadge.textContent = 'INSUFFICIENT';
        statusBadge.className = 'status-badge status-badge--insufficient';
      }
    }
    
    // Update validation card
    this.updateValidationCard(garmentId, {
      progress,
      currentTotal,
      minimumRequired,
      status: this.getValidationStatus(progress, currentTotal, minimumRequired),
      colorwayCount,
      garmentType: garment.type
    });
    
    // Update garment summary
    this.updateQuantitySummary(garmentId, currentTotal, minimumRequired, progress);
    
    // Validate size distribution
    this.validateSizeDistribution(garmentId);
  }

  updateValidationCard(garmentId, validationData) {
    const { progress, currentTotal, minimumRequired, status } = validationData;
    
    // Update validation progress bar
    const progressElement = document.getElementById(`validation-progress-${garmentId}`);
    if (progressElement) {
      progressElement.style.width = `${progress}%`;
    }
    
    // Update validation status text
    const statusElement = document.getElementById(`validation-status-${garmentId}`);
    if (statusElement) {
      const validationText = statusElement.querySelector('.validation-text');
      const validationPercentage = statusElement.querySelector('.validation-percentage');
      
      if (validationText) {
        validationText.textContent = this.getValidationMessage(status, currentTotal, minimumRequired);
      }
      if (validationPercentage) {
        validationPercentage.textContent = `${Math.round(progress)}%`;
      }
    }
  }

  updateQuantitySummary(garmentId, currentTotal, minimumRequired, progress) {
    // Find garment row and update elements within it
    const garmentRow = document.querySelector(`[data-garment-id="${garmentId}"]`);
    if (!garmentRow) return;
    
    // Update total quantity display
    const totalElement = garmentRow.querySelector('#garment-total-quantity');
    if (totalElement) {
      totalElement.textContent = currentTotal;
    }
    
    // Update quantity status
    const statusElement = garmentRow.querySelector('#quantity-status');
    if (statusElement) {
      const status = this.getValidationStatus(progress, currentTotal, minimumRequired);
      statusElement.textContent = this.getStatusText(status);
      // Remove old classes and add new ones
      statusElement.className = `quantity-status ${status}`;
    }
    
    // Update minimum display
    const minimumElement = garmentRow.querySelector('#minimum-required');
    if (minimumElement) {
      minimumElement.textContent = `Min: ${minimumRequired}`;
    }
    
    // Update compact summary
    const summaryTotal = document.getElementById(`summary-total-${garmentId}`);
    const summaryRequired = document.getElementById(`summary-required-${garmentId}`);
    const summaryProgress = document.getElementById(`summary-progress-${garmentId}`);
    
    if (summaryTotal) summaryTotal.textContent = currentTotal;
    if (summaryRequired) summaryRequired.textContent = minimumRequired;
    if (summaryProgress) summaryProgress.style.width = `${progress}%`;
  }

  validateSizeDistribution(garmentId) {
    const validation = this.quantityCalculator.validateSizeDistribution(garmentId);
    const limitsElement = document.getElementById(`size-limits-${garmentId}`);
    
    if (limitsElement) {
      const limitText = limitsElement.querySelector('.limit-text');
      if (limitText) {
        if (validation.valid) {
          limitText.textContent = `Max ${validation.maxAllowedSizes} sizes for this quantity`;
          limitText.style.color = 'var(--color-foreground-subtle)';
        } else {
          limitText.textContent = `⚠️ Too many sizes! Max ${validation.maxAllowedSizes} for ${validation.totalQuantity || 0} units`;
          limitText.style.color = '#d97706';
        }
      }
    }
    
    // Show/hide size input cards based on limits
    this.updateSizeCardAvailability(garmentId, validation);
  }

  updateSizeCardAvailability(garmentId, validation) {
    const card = document.querySelector(`[data-garment-id="${garmentId}"]`);
    if (!card) return;
    
    const sizeInputCards = card.querySelectorAll('.size-input-card');
    const quantityData = V10_State.quantities.garments.get(garmentId);
    const activeSizes = quantityData ? Object.values(quantityData.sizes).filter(qty => qty > 0).length : 0;
    
    sizeInputCards.forEach((sizeCard, index) => {
      const input = sizeCard.querySelector('.size-quantity-input');
      const currentValue = parseInt(input?.value) || 0;
      
      // If this size has quantity or we're under the limit, keep it enabled
      if (currentValue > 0 || activeSizes < validation.maxAllowedSizes) {
        sizeCard.classList.remove('size-input-card--disabled');
        if (input) input.disabled = false;
      } else {
        sizeCard.classList.add('size-input-card--disabled');
        if (input) input.disabled = true;
      }
    });
  }

  updateSizeCard(sizeCard, size, value, garmentId) {
    if (!sizeCard) return;
    
    const quantityData = V10_State.quantities.garments.get(garmentId);
    const total = quantityData ? quantityData.total : 0;
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
    
    // Update percentage display
    const percentageElement = sizeCard.querySelector(`#${size}-percentage`);
    if (percentageElement) {
      percentageElement.textContent = `${percentage}%`;
    }
    
    // Update visual bar
    const barElement = sizeCard.querySelector(`#${size}-bar`);
    if (barElement) {
      barElement.style.width = `${percentage}%`;
    }
    
    // Update visual state
    if (value > 0) {
      sizeCard.classList.add('size-input-card--active');
    } else {
      sizeCard.classList.remove('size-input-card--active');
    }
  }

  updateAllValidationCards() {
    // Update global validation summary
    this.updateGlobalValidationSummary();
    
    // Update per-garment validation messages
    V10_State.garments.forEach((garment, garmentId) => {
      this.updateValidationMessages(garmentId);
    });
  }

  updateGlobalValidationSummary() {
    const summaryContainer = document.getElementById('quantity-validation-summary');
    if (!summaryContainer) return;
    
    const completedGarments = Array.from(V10_State.garments.values()).filter(garment => 
      garment.type && (garment.sampleReference || garment.fabricType)
    );
    
    if (completedGarments.length === 0) return;
    
    const globalValidation = this.calculateGlobalValidation(completedGarments);
    // Validation system removed - no longer showing validation messages
  }

  calculateGlobalValidation(garments) {
    const totalMinimum = this.quantityCalculator.calculateTotalMinimum(garments);
    const totalCurrent = V10_State.quantities.globalTotal;
    const progress = totalMinimum > 0 ? (totalCurrent / totalMinimum) * 100 : 0;
    
    const validation = {
      totalMinimum,
      totalCurrent,
      progress: Math.min(progress, 100),
      garmentCount: garments.length,
      status: this.getValidationStatus(progress, totalCurrent, totalMinimum),
      warnings: [],
      colorwayCount: this.quantityCalculator.getTotalColorwayCount()
    };
    
    // Add global warnings
    if (totalCurrent < totalMinimum) {
      validation.warnings.push({
        type: 'insufficient_quantity',
        message: `${totalMinimum - totalCurrent} more units needed to meet production minimums`,
        level: 'error'
      });
    }
    
    return validation;
  }

  renderGlobalValidationCards(container, validation) {
    container.innerHTML = '';
    
    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warning => {
        const card = this.createValidationMessageCard(warning);
        container.appendChild(card);
      });
    } else if (validation.progress >= 100) {
      const successCard = this.createValidationMessageCard({
        type: 'success',
        message: `All minimums met! Ready for production with ${validation.totalCurrent} units`,
        level: 'success'
      });
      container.appendChild(successCard);
    }
  }

  createValidationMessageCard(message) {
    const template = document.getElementById('V10-validation-card-template');
    if (!template) {
      // Fallback creation
      const card = document.createElement('div');
      card.className = `validation-message validation-message--${message.level}`;
      card.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${this.getValidationIcon(message.level)}
        </svg>
        <span class="validation-message__text">${message.message}</span>
      `;
      return card;
    }
    
    const cardElement = template.content.cloneNode(true);
    const card = cardElement.querySelector('.validation-message');
    
    card.dataset.type = message.type;
    card.className = `validation-message validation-message--${message.level}`;
    
    const textElement = card.querySelector('.validation-message__text');
    if (textElement) {
      textElement.textContent = message.message;
    }
    
    const iconElement = card.querySelector('svg');
    if (iconElement) {
      iconElement.innerHTML = this.getValidationIcon(message.level);
    }
    
    return card;
  }

  getValidationIcon(level) {
    switch (level) {
      case 'error':
        return '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>';
      case 'warning':
        return '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>';
      case 'success':
        return '<polyline points="20,6 9,17 4,12"/>';
      default:
        return '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>';
    }
  }

  getValidationStatus(progress, current, required) {
    if (current >= required) return 'complete';
    if (progress >= 50) return 'progress';
    return 'insufficient';
  }

  getValidationMessage(status, current, required) {
    switch (status) {
      case 'complete':
        return 'Minimum requirements met!';
      case 'progress':
        return `${required - current} more units needed`;
      case 'insufficient':
        return `${required - current} units required for production`;
      default:
        return 'Select garment types to calculate minimums';
    }
  }

  getStatusText(status) {
    switch (status) {
      case 'complete':
        return 'Complete';
      case 'progress':
        return 'In Progress';
      case 'insufficient':
        return 'Insufficient';
      default:
        return 'Pending';
    }
  }

  // ==============================================
  // COLORWAY-BASED VALIDATION SYSTEM
  // ==============================================

  setupColorwayTabs(colorwaySelector, assignedLabDips, garmentId) {
    const tabsContainer = colorwaySelector.querySelector('#colorway-selector-tabs');
    const countElement = colorwaySelector.querySelector('#active-colorway-count');
    
    if (!tabsContainer) return;
    
    tabsContainer.innerHTML = '';
    
    // Update count display
    if (countElement) {
      countElement.textContent = `1 of ${assignedLabDips.length}`;
    }
    
    // Create tabs for each colorway
    assignedLabDips.forEach((labDip, index) => {
      const tab = this.createColorwayTab(labDip, garmentId, index === 0);
      tabsContainer.appendChild(tab);
      
      // Add click handler
      tab.addEventListener('click', () => {
        this.switchColorwayTab(garmentId, labDip.id, index);
        if (countElement) {
          countElement.textContent = `${index + 1} of ${assignedLabDips.length}`;
        }
      });
    });
    
    // Initialize colorway-specific validation
    this.initializeColorwayValidation(garmentId, assignedLabDips);
  }

  createColorwayTab(labDip, garmentId, isActive = false) {
    const tab = document.createElement('button');
    tab.className = `colorway-tab ${isActive ? 'colorway-tab--active' : ''}`;
    tab.type = 'button';
    tab.dataset.colorwayId = labDip.id;
    tab.dataset.garmentId = garmentId;
    
    tab.innerHTML = `
      <div class="colorway-tab__color" style="background-color: ${labDip.color || '#000000'};"></div>
      <div class="colorway-tab__content">
        <span class="colorway-tab__name">${labDip.pantoneCode || 'Unknown Color'}</span>
        <span class="colorway-tab__quantity" id="colorway-quantity-${garmentId}-${labDip.id}">0 units</span>
      </div>
    `;
    
    return tab;
  }

  switchColorwayTab(garmentId, colorwayId, index) {
    const selector = document.querySelector(`[data-garment-id="${garmentId}"] #colorway-selector`);
    if (!selector) return;
    
    // Update active tab
    const tabs = selector.querySelectorAll('.colorway-tab');
    tabs.forEach(tab => {
      tab.classList.toggle('colorway-tab--active', tab.dataset.colorwayId === colorwayId);
    });
    
    // Switch to colorway-specific size inputs (if implemented)
    this.updateSizeInputsForColorway(garmentId, colorwayId);
    
    // Update validation for active colorway
    this.updateColorwayValidation(garmentId, colorwayId);
  }

  initializeColorwayValidation(garmentId, assignedLabDips) {
    const garment = V10_State.garments.get(garmentId);
    if (!garment) return;
    
    // Initialize validation state for each colorway
    assignedLabDips.forEach(labDip => {
      const colorwayData = this.getColorwayQuantityData(garmentId, labDip.id);
      this.updateColorwayTabQuantity(garmentId, labDip.id, colorwayData.total);
    });
    
    // Create colorway validation cards
    this.createColorwayValidationCards(garmentId, assignedLabDips);
    
    // Update per-colorway minimums
    this.updateColorwayMinimums(garmentId, assignedLabDips);
  }

  getColorwayQuantityData(garmentId, colorwayId) {
    // For now, we'll distribute total quantities evenly across colorways
    // In a full implementation, this would track quantities per colorway
    const quantityData = V10_State.quantities.garments.get(garmentId) || { sizes: {}, total: 0 };
    const assignedLabDips = this.getAssignedLabDips(garmentId);
    const colorwayCount = assignedLabDips.length;
    
    if (colorwayCount <= 1) {
      return quantityData;
    }
    
    // Distribute quantities evenly across colorways
    const perColorwayTotal = Math.floor(quantityData.total / colorwayCount);
    const perColorwaySizes = {};
    
    Object.entries(quantityData.sizes).forEach(([size, qty]) => {
      perColorwaySizes[size] = Math.floor(qty / colorwayCount);
    });
    
    return {
      sizes: perColorwaySizes,
      total: perColorwayTotal,
      colorwayId: colorwayId
    };
  }

  updateColorwayTabQuantity(garmentId, colorwayId, quantity) {
    const quantityElement = document.getElementById(`colorway-quantity-${garmentId}-${colorwayId}`);
    if (quantityElement) {
      quantityElement.textContent = `${quantity} units`;
    }
  }

  createColorwayValidationCards(garmentId, assignedLabDips) {
    if (assignedLabDips.length <= 1) return; // Skip for single colorway
    
    const validationContainer = document.getElementById('quantity-validation-summary');
    if (!validationContainer) return;
    
    // Create validation cards for each colorway
    assignedLabDips.forEach(labDip => {
      const validationCard = this.createColorwayValidationCard(garmentId, labDip);
      validationContainer.appendChild(validationCard);
    });
  }

  createColorwayValidationCard(garmentId, labDip) {
    const template = document.getElementById('V10-colorway-validation-template');
    if (!template) {
      return this.createFallbackColorwayValidationCard(garmentId, labDip);
    }
    
    const cardElement = template.content.cloneNode(true);
    const card = cardElement.querySelector('.colorway-validation-card');
    
    // Set identifiers
    card.dataset.colorwayId = labDip.id;
    card.dataset.garmentId = garmentId;
    card.id = `colorway-validation-${garmentId}-${labDip.id}`;
    
    // Update colorway visual information
    const colorElement = card.querySelector('.colorway-validation-color');
    const nameElement = card.querySelector('.colorway-validation-name');
    const progressElement = card.querySelector('.colorway-validation-progress');
    const textElement = card.querySelector('.colorway-validation-text');
    const fillElement = card.querySelector('.colorway-validation-fill');
    
    if (colorElement) {
      colorElement.style.backgroundColor = labDip.color || '#000000';
    }
    if (nameElement) {
      nameElement.textContent = labDip.pantoneCode || 'Unknown Color';
    }
    
    // Set IDs for dynamic updates
    if (progressElement) {
      progressElement.id = `colorway-progress-${garmentId}-${labDip.id}`;
    }
    if (textElement) {
      textElement.id = `colorway-text-${garmentId}-${labDip.id}`;
    }
    if (fillElement) {
      fillElement.id = `colorway-fill-${garmentId}-${labDip.id}`;
    }
    
    // Initialize validation state
    this.updateColorwayValidationCard(garmentId, labDip.id);
    
    return card;
  }

  createFallbackColorwayValidationCard(garmentId, labDip) {
    const card = document.createElement('div');
    card.className = 'colorway-validation-card colorway-validation-card--error';
    card.dataset.colorwayId = labDip.id;
    card.dataset.garmentId = garmentId;
    card.id = `colorway-validation-${garmentId}-${labDip.id}`;
    
    card.innerHTML = `
      <div class="colorway-validation-header">
        <div class="colorway-validation-visual">
          <div class="colorway-validation-color" style="background-color: ${labDip.color || '#000000'};"></div>
          <span class="colorway-validation-name">${labDip.pantoneCode || 'Unknown Color'}</span>
        </div>
        <div class="colorway-validation-status">
          <span class="colorway-validation-progress" id="colorway-progress-${garmentId}-${labDip.id}">0%</span>
          <div class="colorway-validation-indicator"></div>
        </div>
      </div>
      <div class="colorway-validation-details">
        <span class="colorway-validation-text" id="colorway-text-${garmentId}-${labDip.id}">Calculating...</span>
        <div class="colorway-validation-bar">
          <div class="colorway-validation-fill" id="colorway-fill-${garmentId}-${labDip.id}" style="width: 0%"></div>
        </div>
      </div>
    `;
    
    return card;
  }

  updateColorwayMinimums(garmentId, assignedLabDips) {
    const garment = V10_State.garments.get(garmentId);
    if (!garment) return;
    
    const colorwayCount = assignedLabDips.length;
    const productionType = this.quantityCalculator.determineProductionType(garment);
    
    // Calculate per-colorway minimum
    const minimumPerColorway = this.quantityCalculator.getMinimumQuantity(
      colorwayCount, 
      productionType, 
      garment.type
    );
    
    // Update minimum display in garment header
    const minimumElement = document.querySelector(`[data-garment-id="${garmentId}"] #minimum-required`);
    if (minimumElement && colorwayCount > 1) {
      minimumElement.textContent = `Min: ${minimumPerColorway} per colorway (${minimumPerColorway * colorwayCount} total)`;
    }
    
    // Store colorway minimums for validation
    assignedLabDips.forEach(labDip => {
      this.storeColorwayMinimum(garmentId, labDip.id, minimumPerColorway);
    });
  }

  storeColorwayMinimum(garmentId, colorwayId, minimum) {
    // Store in validation state for reference
    const key = `${garmentId}-${colorwayId}`;
    V10_State.quantities.colorwayMinimums.set(key, minimum);
  }

  getColorwayMinimum(garmentId, colorwayId) {
    const key = `${garmentId}-${colorwayId}`;
    return V10_State.quantities.colorwayMinimums?.get(key) || 0;
  }

  updateColorwayValidation(garmentId, colorwayId) {
    const colorwayData = this.getColorwayQuantityData(garmentId, colorwayId);
    const minimumRequired = this.getColorwayMinimum(garmentId, colorwayId);
    const currentTotal = colorwayData.total;
    const progress = minimumRequired > 0 ? Math.min((currentTotal / minimumRequired) * 100, 100) : 0;
    
    this.updateColorwayValidationCard(garmentId, colorwayId, {
      currentTotal,
      minimumRequired,
      progress,
      status: this.getValidationStatus(progress, currentTotal, minimumRequired)
    });
    
    // Update tab quantity
    this.updateColorwayTabQuantity(garmentId, colorwayId, currentTotal);
  }

  updateColorwayValidationCard(garmentId, colorwayId, validationData = null) {
    if (!validationData) {
      // Calculate validation data
      const colorwayData = this.getColorwayQuantityData(garmentId, colorwayId);
      const minimumRequired = this.getColorwayMinimum(garmentId, colorwayId);
      const currentTotal = colorwayData.total;
      const progress = minimumRequired > 0 ? Math.min((currentTotal / minimumRequired) * 100, 100) : 0;
      
      validationData = {
        currentTotal,
        minimumRequired,
        progress,
        status: this.getValidationStatus(progress, currentTotal, minimumRequired)
      };
    }
    
    const { currentTotal, minimumRequired, progress, status } = validationData;
    
    // Update progress percentage
    const progressElement = document.getElementById(`colorway-progress-${garmentId}-${colorwayId}`);
    if (progressElement) {
      progressElement.textContent = `${Math.round(progress)}%`;
    }
    
    // Update validation text
    const textElement = document.getElementById(`colorway-text-${garmentId}-${colorwayId}`);
    if (textElement) {
      if (currentTotal >= minimumRequired) {
        textElement.textContent = `${currentTotal}/${minimumRequired} units (Complete)`;
      } else {
        textElement.textContent = `${currentTotal}/${minimumRequired} units (${minimumRequired - currentTotal} more needed)`;
      }
    }
    
    // Update progress bar
    const fillElement = document.getElementById(`colorway-fill-${garmentId}-${colorwayId}`);
    if (fillElement) {
      fillElement.style.width = `${progress}%`;
    }
    
    // Update card status class
    const card = document.getElementById(`colorway-validation-${garmentId}-${colorwayId}`);
    if (card) {
      card.className = `colorway-validation-card colorway-validation-card--${status}`;
    }
  }

  updateSizeInputsForColorway(garmentId, colorwayId) {
    // This would be used in advanced implementations where each colorway
    // has separate size distributions. For now, we use shared size inputs
    // but could be extended to show colorway-specific inputs
    
    console.log(`🎨 Switched to colorway ${colorwayId} for garment ${garmentId}`);
    
    // Future enhancement: Show different size grids per colorway
    // For now, we update the visual feedback to reflect the active colorway
    this.updateColorwayValidation(garmentId, colorwayId);
  }

  updateAllColorwayValidations() {
    // Update validation for all colorways across all garments
    V10_State.garments.forEach((garment, garmentId) => {
      const assignedLabDips = this.getAssignedLabDips(garmentId);
      if (assignedLabDips.length > 1) {
        assignedLabDips.forEach(labDip => {
          this.updateColorwayValidation(garmentId, labDip.id);
        });
      }
    });
  }

  // Enhanced validation update to include colorway validation
  updateValidationMessages(garmentId) {
    const messagesContainer = document.getElementById(`validation-messages-${garmentId}`);
    if (!messagesContainer) return;
    
    const assignedLabDips = this.getAssignedLabDips(garmentId);
    const messages = [];
    
    // Check colorway-specific validation if multiple colorways
    if (assignedLabDips.length > 1) {
      assignedLabDips.forEach(labDip => {
        const colorwayData = this.getColorwayQuantityData(garmentId, labDip.id);
        const minimumRequired = this.getColorwayMinimum(garmentId, labDip.id);
        
        if (colorwayData.total < minimumRequired) {
          messages.push({
            type: 'colorway_insufficient',
            level: 'warning',
            message: `${labDip.pantoneCode}: ${minimumRequired - colorwayData.total} more units needed`
          });
        }
      });
    }
    
    // Clear and update messages
    messagesContainer.innerHTML = '';
    messages.forEach(message => {
      const messageCard = this.createValidationMessageCard(message);
      messagesContainer.appendChild(messageCard);
    });
  }


  updateGarmentQuantityTotals(garmentId) {
    const card = document.querySelector(`[data-garment-id="${garmentId}"]`);
    if (!card) return 0;

    // Calculate total for this garment (support both old and new selectors)
    const inputs = card.querySelectorAll('.size-quantity-input, .quantity-input');
    let total = 0;
    inputs.forEach(input => {
      total += parseInt(input.value) || 0;
    });

    // Update garment total display (support both old and new IDs)
    const totalElement = card.querySelector(`#garment-total-quantity-${garmentId}, #garment-total-${garmentId}`);
    if (totalElement) {
      totalElement.textContent = total;
    }

    // Update distribution preview for this garment
    this.updateDistributionPreview(card, garmentId);

    return total;
  }

  updateAllQuantityStats() {
    // Calculate totals
    const allCards = document.querySelectorAll('.garment-quantity-card, .garment-quantity-form');
    let grandTotal = 0;
    let garmentCount = 0;
    let colorwayCount = 0;

    allCards.forEach(card => {
      const garmentId = card.dataset.garmentId;
      const garmentTotal = this.updateGarmentQuantityTotals(garmentId);
      grandTotal += garmentTotal;
      garmentCount++;
      
      // Count colorways (for now assume 1 per garment, enhance later)
      colorwayCount++;
    });

    // Update enhanced stats
    this.updateQuantityStats(grandTotal, garmentCount, colorwayCount);
    
    // Update progress bar
    this.updateProgressBar(grandTotal);
    
    // Update size distribution chart if in distribution mode
    this.updateSizeDistributionChart();

    // Store in state
    V10_State.totalQuantity = grandTotal;

    console.log(`📊 Updated all quantity stats: ${grandTotal} total units, ${garmentCount} garments`);
    return grandTotal;
  }

  updateQuantityStats(totalUnits, garmentCount, colorwayCount) {
    // Update individual stat displays
    const totalElement = document.getElementById('total-production-quantity');
    const garmentCountElement = document.getElementById('total-garments-count');
    const colorwayCountElement = document.getElementById('total-colorways-count');
    const progressStatusElement = document.getElementById('quantity-progress-status');
    const progressPercentageElement = document.getElementById('quantity-progress-percentage');

    if (totalElement) totalElement.textContent = totalUnits;
    if (garmentCountElement) garmentCountElement.textContent = garmentCount;
    if (colorwayCountElement) colorwayCountElement.textContent = colorwayCount;
    
    // Update progress status text
    const minRequired = 75;
    const percentage = Math.min((totalUnits / minRequired) * 100, 100);
    
    if (progressStatusElement) {
      progressStatusElement.textContent = `${totalUnits} / ${minRequired} minimum units`;
    }
    
    if (progressPercentageElement) {
      progressPercentageElement.textContent = `${Math.round(percentage)}%`;
    }
  }

  updateProgressBar(totalUnits) {
    const progressBar = document.getElementById('production-quantity-progress');
    if (!progressBar) return;

    const minRequired = 75;
    const percentage = Math.min((totalUnits / minRequired) * 100, 100);
    progressBar.style.width = `${percentage}%`;
    
    // Update color based on progress
    if (totalUnits >= minRequired) {
      progressBar.style.background = 'linear-gradient(90deg, var(--v10-accent-success) 0%, var(--v10-accent-success) 100%)';
    } else if (totalUnits >= minRequired * 0.5) {
      progressBar.style.background = 'linear-gradient(90deg, var(--v10-border-warning) 0%, var(--v10-accent-primary) 100%)';
    } else {
      progressBar.style.background = 'linear-gradient(90deg, var(--v10-accent-primary) 0%, var(--v10-accent-primary) 100%)';
    }
  }

  // Legacy function for backward compatibility
  updateGarmentTotal(garmentId) {
    return this.updateGarmentQuantityTotals(garmentId);
  }

  // Legacy function for backward compatibility  
  updateTotalQuantity() {
    return this.updateAllQuantityStats();
  }

  saveQuantityData(garmentId) {
    const card = document.querySelector(`.garment-quantity-card[data-garment-id="${garmentId}"]`);
    if (!card) {
      console.warn(`⚠️ [SAVE_DEBUG] No quantity card found for garment ${garmentId}`);
      return;
    }

    const garment = V10_State.garments.get(garmentId);
    if (!garment) return;

    const quantities = {};
    const inputs = card.querySelectorAll('.size-quantity-input');
    console.log(`🔍 [SAVE_DEBUG] Card found:`, card);
    console.log(`🔍 [SAVE_DEBUG] Found ${inputs.length} inputs for garment ${garmentId}`);
    
    inputs.forEach(input => {
      const size = input.dataset.size;
      console.log(`🔍 [SAVE_DEBUG] Input element:`, input, `data-size:`, size, `value:`, input.value);
      
      if (!size) {
        console.warn(`⚠️ [SAVE_DEBUG] Input missing data-size attribute:`, input);
        return; // Skip inputs without data-size
      }
      
      const qty = parseInt(input.value) || 0;
      quantities[size] = qty;
    });

    // Save to both locations for compatibility
    garment.quantities = quantities;
    
    // Also save to the new quantity state structure
    const quantityData = {
      sizes: quantities,
      total: Object.values(quantities).reduce((sum, qty) => sum + qty, 0),
      validation: {},
      colorwayCount: 1
    };
    V10_State.quantities.garments.set(garmentId, quantityData);
    
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

  // ==============================================
  // ENHANCED QUANTITY STUDIO FUNCTIONALITY
  // ==============================================

  initializeQuantityStudioFeatures() {
    // Initialize bulk tools
    this.initializeBulkTools();
    
    // Initialize preset system - commented out as function doesn't exist
    // this.initializePresetSystem();
    // Initialize mode toggle functionality
    this.initializeModeToggle();
    
    // Initialize bulk input tools
    this.initializeBulkInputTools();
    
    // Initialize preset dropdown
    this.initializePresetDropdown();
    
    // Quantity forms are populated by populateQuantityStudio() - removed duplicate call
    
    console.log('✅ Initialized all quantity studio features');
  }





  initializeModeToggle() {
    const sizesToggle = document.getElementById('sizes-mode');
    const distributionToggle = document.getElementById('distribution-mode');
    
    console.log('🔧 Initializing mode toggle - Sizes button:', sizesToggle, 'Distribution button:', distributionToggle);
    
    if (sizesToggle) {
      sizesToggle.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('📊 Sizes mode clicked');
        this.switchQuantityMode('sizes');
      });
    }
    
    if (distributionToggle) {
      distributionToggle.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('📈 Distribution mode clicked');
        this.switchQuantityMode('distribution');
      });
    }
  }

  switchQuantityMode(mode) {
    console.log(`🔄 Attempting to switch to ${mode} mode`);
    
    // Update toggle buttons
    document.querySelectorAll('.studio-toggle__btn').forEach(btn => {
      const isActive = btn.dataset.mode === mode;
      btn.classList.toggle('studio-toggle__btn--active', isActive);
      console.log(`Button ${btn.dataset.mode}: ${isActive ? 'active' : 'inactive'}`);
    });
    
    // Get mode containers
    const sizesContent = document.getElementById('sizes-mode-content');
    const distributionContent = document.getElementById('distribution-mode-content');
    
    // Update visibility based on mode
    if (mode === 'sizes') {
      if (sizesContent) {
        sizesContent.style.display = 'block';
        sizesContent.classList.add('quantities-mode--active');
      }
      if (distributionContent) {
        distributionContent.style.display = 'none';
        distributionContent.classList.remove('quantities-mode--active');
      }
      this.hideLegacyCharts();
    } else if (mode === 'distribution') {
      if (sizesContent) {
        sizesContent.style.display = 'none';
        sizesContent.classList.remove('quantities-mode--active');
      }
      if (distributionContent) {
        distributionContent.style.display = 'block';
        distributionContent.classList.add('quantities-mode--active');
      }
      this.initializeDistributionAnalytics();
    }
    
    // Validation summary bar removed - no longer handling validation display
    
    console.log(`✅ Successfully switched to ${mode} mode`);
  }

  /**
   * Initialize sophisticated distribution analytics system
   */
  initializeDistributionAnalytics() {
    // Render aggregate analytics dashboard
    this.quantityCalculator.renderAggregateAnalytics('aggregate-analytics-container');
    
    // Render individual garment analytics
    const garmentAnalyticsContainer = document.getElementById('garment-analytics-container');
    if (garmentAnalyticsContainer) {
      garmentAnalyticsContainer.innerHTML = '';
      
      // Add analytics for each garment with quantities
      V10_State.garments.forEach((garment, garmentId) => {
        const quantityData = V10_State.quantities.garments.get(garmentId);
        if (quantityData && quantityData.sizes && Object.values(quantityData.sizes).some(q => (parseInt(q) || 0) > 0)) {
          // Create container for this garment's analytics
          const analyticsDiv = document.createElement('div');
          analyticsDiv.className = 'garment-analytics-wrapper';
          analyticsDiv.innerHTML = `
            <h4>Garment ${garment.number || '?'} - ${garment.type || 'Unknown'}</h4>
            <div class="distribution-chart-container" id="chart-${garmentId}"></div>
          `;
          garmentAnalyticsContainer.appendChild(analyticsDiv);
          
          // Render the distribution chart for this garment
          this.quantityCalculator.renderDistributionChart(garmentId, `chart-${garmentId}`);
        }
      });
      
      // If no garments have quantities, show empty state
      if (garmentAnalyticsContainer.children.length === 0) {
        garmentAnalyticsContainer.innerHTML = `
          <div class="analytics-empty-state">
            <div class="empty-state-icon">📊</div>
            <h4>No Distribution Data Available</h4>
            <p>Add quantities to your garments in "Sizes & Quantities" mode to see distribution analytics here.</p>
          </div>
        `;
      }
    }
    
    // Show distribution charts on individual garment cards
    this.toggleGarmentAnalyticsVisibility(true);
    
    console.log('📊 Distribution analytics initialized');
  }

  /**
   * Hide legacy distribution charts and show new analytics
   */
  hideLegacyCharts() {
    // Hide individual garment analytics
    this.toggleGarmentAnalyticsVisibility(false);
    
    // Hide legacy analysis section
    const legacyAnalysis = document.querySelector('.legacy-analysis');
    if (legacyAnalysis) {
      legacyAnalysis.style.display = 'none';
    }
    
    console.log('📈 Switched to sizes mode - analytics hidden');
  }

  /**
   * Toggle visibility of analytics charts on individual garment cards
   */
  toggleGarmentAnalyticsVisibility(show) {
    const chartContainers = document.querySelectorAll('.distribution-chart-container');
    chartContainers.forEach(container => {
      if (show) {
        container.style.display = 'block';
        // Re-render chart if garment has data
        const garmentCard = container.closest('[data-garment-id]');
        if (garmentCard) {
          const garmentId = garmentCard.dataset.garmentId;
          this.quantityCalculator.renderDistributionChart(garmentId);
        }
      } else {
        container.style.display = 'none';
      }
    });
  }

  /**
   * Legacy method - kept for backward compatibility
   */
  updateSizeDistributionChart() {
    // This method is kept for backward compatibility
    // The new analytics system handles distribution visualization
    console.log('📊 Legacy chart update requested - using new analytics system');
    this.initializeDistributionAnalytics();
  }

  initializeBulkInputTools() {
    const clearAllBtn = document.getElementById('clear-all-quantities');
    
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => {
        this.clearAllQuantities();
      });
    }
  }

  initializePresetDropdown() {
    const presetBtn = document.getElementById('apply-preset-btn');
    const dropdownMenu = document.getElementById('preset-dropdown-menu');
    
    if (presetBtn && dropdownMenu) {
      presetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        dropdownMenu.classList.remove('active');
      });
      
      // Handle preset selection
      dropdownMenu.querySelectorAll('.preset-option').forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const preset = e.currentTarget.dataset.preset;
          this.applyPresetToAllGarments(preset);
          dropdownMenu.classList.remove('active');
        });
      });
    }
  }

  clearAllQuantities() {
    const allInputs = document.querySelectorAll('.size-quantity-input, .quantity-input');
    allInputs.forEach(input => {
      input.value = '0';
    });
    
    this.updateAllQuantityStats();
    
    console.log('🧹 Cleared all quantities');
  }

  applyPresetToAllGarments(preset) {
    const allCards = document.querySelectorAll('.garment-quantity-card, .garment-quantity-form');
    
    allCards.forEach(card => {
      const garmentId = card.dataset.garmentId;
      this.applyPresetToGarment(garmentId, preset);
    });
    
    this.updateAllQuantityStats();
    
    console.log(`📊 Applied ${preset} preset to all garments`);
  }

  applyPresetToGarment(garmentId, preset) {
    // Use the new quantity calculator for preset application
    this.quantityCalculator.applyPresetToGarment(garmentId, preset);
  }

  getPresetDistributions() {
    return {
      'bell-curve': [2, 6, 8, 10, 8, 6, 2, 1], // XXS, XS, S, M, L, XL, XXL, 3XL
      'medium-heavy': [3, 5, 8, 12, 8, 5, 3, 1],
      'large-heavy': [2, 4, 6, 8, 12, 10, 8, 5],
      'equal-split': [7, 7, 7, 7, 7, 7, 7, 7]
    };
  }

  showPresetMenuForGarment(garmentId) {
    // Create contextual preset menu for individual garment
    const card = document.querySelector(`[data-garment-id="${garmentId}"]`);
    if (!card) return;
    
    // For now, use the same preset as global
    this.applyPresetToGarment(garmentId, 'bell-curve');
    this.updateAllQuantityStats();
  }

  clearGarmentQuantities(garmentId) {
    const card = document.querySelector(`[data-garment-id="${garmentId}"]`);
    if (!card) return;
    
    const inputs = card.querySelectorAll('.size-quantity-input, .quantity-input');
    inputs.forEach(input => {
      input.value = '0';
    });
    
    this.updateAllQuantityStats();
  }

  updateDistributionPreview(card, garmentId) {
    const preview = card.querySelector('.size-distribution-preview');
    if (!preview) return;
    
    const inputs = card.querySelectorAll('.size-quantity-input, .quantity-input');
    const bars = preview.querySelectorAll('.dist-bar');
    
    // Calculate max value for scaling
    let maxValue = 0;
    inputs.forEach(input => {
      maxValue = Math.max(maxValue, parseInt(input.value) || 0);
    });
    
    // Update bars
    inputs.forEach((input, index) => {
      if (bars[index]) {
        const value = parseInt(input.value) || 0;
        const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
        bars[index].style.height = `${percentage}%`;
      }
    });
  }

  updateSizeDistributionChart() {
    const chart = document.getElementById('size-distribution-chart');
    if (!chart) return;
    
    const sizeBars = chart.querySelectorAll('.size-bar');
    const sizes = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', '3xl'];
    
    // Calculate totals per size across all garments
    const sizeTotals = {};
    sizes.forEach(size => sizeTotals[size] = 0);
    
    const allCards = document.querySelectorAll('.garment-quantity-card, .garment-quantity-form');
    allCards.forEach(card => {
      sizes.forEach(size => {
        const input = card.querySelector(`[data-size="${size}"]`);
        if (input) {
          sizeTotals[size] += parseInt(input.value) || 0;
        }
      });
    });
    
    // Find max value for scaling
    const maxValue = Math.max(...Object.values(sizeTotals));
    
    // Update chart bars
    sizeBars.forEach((bar, index) => {
      const size = sizes[index];
      const value = sizeTotals[size] || 0;
      const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
      
      const fill = bar.querySelector('.size-bar__fill');
      const valueDisplay = bar.querySelector('.size-bar__value');
      
      if (fill) fill.style.height = `${percentage}%`;
      if (valueDisplay) valueDisplay.textContent = value;
    });
    
    // Update analysis summary
    const mostPopularSize = this.getMostPopularSize(sizeTotals);
    const sizeSpread = Object.values(sizeTotals).filter(val => val > 0).length;
    
    const mostPopularElement = document.getElementById('most-popular-size');
    const sizeSpreadElement = document.getElementById('size-spread');
    
    if (mostPopularElement) mostPopularElement.textContent = mostPopularSize.toUpperCase();
    if (sizeSpreadElement) sizeSpreadElement.textContent = `${sizeSpread} sizes`;
  }

  getMostPopularSize(sizeTotals) {
    let maxSize = 'M';
    let maxValue = 0;
    
    for (const [size, value] of Object.entries(sizeTotals)) {
      if (value > maxValue) {
        maxValue = value;
        maxSize = size;
      }
    }
    
    return maxSize;
  }

  getAssignedLabDips(garmentId) {
    // Get lab dips assigned to this garment from design studio
    if (window.v10DesignStudio && typeof window.v10DesignStudio.getLabDipsForGarment === 'function') {
      return window.v10DesignStudio.getLabDipsForGarment(garmentId);
    }
    
    // Fallback - return empty array
    return [];
  }

  /**
   * Update quantity data when user inputs values
   */
  updateGarmentQuantityFromInput(garmentId, sizeKey, quantity) {
    // Get or create quantity data
    let quantityData = V10_State.quantities.garments.get(garmentId) || {
      sizes: {},
      total: 0,
      validation: {},
      colorwayCount: this.quantityCalculator.getColorwayCount(garmentId)
    };
    
    // Update the specific size
    quantityData.sizes[sizeKey] = quantity;
    
    // Recalculate total
    quantityData.total = Object.values(quantityData.sizes).reduce((sum, qty) => sum + (qty || 0), 0);
    
    // Update state
    V10_State.quantities.garments.set(garmentId, quantityData);
    
    // Update garment total display - find the quantity card
    const garmentRow = document.querySelector(`.garment-quantity-card[data-garment-id="${garmentId}"]`);
    const totalElement = garmentRow ? 
      garmentRow.querySelector('#garment-total-quantity') : 
      document.querySelector(`#garment-total-quantity-${garmentId}, #garment-total-${garmentId}`);
    if (totalElement) {
      totalElement.textContent = quantityData.total;
    }

    // Update integrated action bar total and status
    if (garmentRow) {
      const actionTotalElement = garmentRow.querySelector('#garment-action-total');
      const actionStatusElement = garmentRow.querySelector('#garment-action-status');
      
      if (actionTotalElement) {
        actionTotalElement.textContent = quantityData.total;
      }
      
      if (actionStatusElement) {
        // Get minimum required for this garment
        const garmentData = V10_State.garments.get(garmentId);
        if (garmentData) {
          const colorwayCount = this.getColorwayCount(garmentId);
          const productionType = this.quantityCalculator.determineProductionType(garmentData);
          const minimum = this.quantityCalculator.getMinimumQuantity(colorwayCount, productionType, garmentData.type);
          
          if (quantityData.total >= minimum) {
            actionStatusElement.textContent = 'SUFFICIENT';
            actionStatusElement.className = 'status-badge status-badge--sufficient';
          } else {
            actionStatusElement.textContent = 'INSUFFICIENT';
            actionStatusElement.className = 'status-badge status-badge--insufficient';
          }
        }
      }
    }
    
    // Update distribution preview
    this.updateDistributionPreview(document.querySelector(`[data-garment-id="${garmentId}"]`), garmentId);
  }

  // ==============================================
  // COLORWAY MANAGEMENT SYSTEM
  // ==============================================


  clearGarmentQuantities(garmentId) {
    try {
      console.log('🗑️ Clearing quantities for garment:', garmentId);
      
      // Find all quantity inputs for this garment
      const garmentCard = document.querySelector(`.garment-quantity-card[data-garment-id="${garmentId}"]`);
      if (!garmentCard) {
        console.error('❌ Quantity card not found:', garmentId);
        return;
      }
      
      const quantityInputs = garmentCard.querySelectorAll('.size-quantity-input');
      quantityInputs.forEach(input => {
        input.value = '0';
        // Trigger input event to update calculations
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
      
      console.log('✅ Cleared quantities for', quantityInputs.length, 'size inputs');
      
    } catch (error) {
      console.error('❌ Error clearing garment quantities:', error);
    }
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
    
    // Update global state for mode tracking
    V10_State.currentMode = mode;

    // Update toggle buttons
    document.querySelectorAll('.studio-toggle__btn').forEach(btn => {
      btn.classList.toggle('studio-toggle__btn--active', btn.dataset.mode === mode);
    });

    // Update mode containers
    document.querySelectorAll('.design-mode').forEach(container => {
      container.classList.toggle('design-mode--active', container.id === `${mode}-mode-content`);
    });

    // Update assignment section visibility based on mode
    if (window.v10ReviewManager) {
      window.v10ReviewManager.populateGarmentAssignments();
    }

    console.log(`🎨 Switched to ${mode} mode - assignments section updated`);
  }

  bindLabDipEvents() {
    // Color picker
    const colorPicker = document.getElementById('lab-dip-color-picker');
    const pantoneInput = document.getElementById('manual-pantone-code');
    const pantoneDisplay = document.getElementById('auto-pantone-display');
    const pantoneCircle = document.getElementById('auto-pantone-circle');
    const pantoneCode = document.getElementById('auto-pantone-code');

    if (colorPicker && pantoneCircle) {
      // Initialize circle and pantone display with current color picker value
      const initialHex = colorPicker.value;
      pantoneCircle.style.backgroundColor = initialHex;
      
      // Initialize pantone display with closest color match
      if (pantoneDisplay && pantoneCode) {
        const closestColors = V10_Utils.findClosestPantoneColors(initialHex, 1);
        if (closestColors.length > 0) {
          const bestMatch = closestColors[0];
          pantoneCode.textContent = bestMatch.code;
          const pantoneNote = document.querySelector('.pantone-note');
          if (pantoneNote) {
            pantoneNote.textContent = `Auto-matched from 2,319+ TCX colors (${bestMatch.confidence}% match)`;
          }
        }
      }
      
      colorPicker.addEventListener('input', (e) => {
        const hex = e.target.value;
        
        // Check if we should preserve TPX data (set by popular color click)
        if (pantoneDisplay && pantoneDisplay.dataset.preserveTpx === 'true') {
          // Clear the flag and skip TCX lookup to preserve TPX
          delete pantoneDisplay.dataset.preserveTpx;
          this.updateLabDipButtons();
          return;
        }
        
        // Update auto-pantone display with enhanced color matching
        if (pantoneDisplay && pantoneCircle && pantoneCode) {
          const closestColors = V10_Utils.findClosestPantoneColors(hex, 1);
          if (closestColors.length > 0) {
            const bestMatch = closestColors[0];
            pantoneDisplay.style.display = 'block';
            pantoneCircle.style.backgroundColor = hex;
            pantoneCode.textContent = bestMatch.code;
            
            // Clear TPX preservation data since this is a new TCX lookup
            delete pantoneDisplay.dataset.originalTpx;
            delete pantoneDisplay.dataset.originalHex;
            
            // Parse matched code for mobile display (e.g., "Golden glow - 13-0859 TCX")
            const dashIndex = bestMatch.code.lastIndexOf(' - ');
            if (dashIndex > 0) {
              const colorName = bestMatch.code.substring(0, dashIndex);
              const pantoneCodePart = bestMatch.code.substring(dashIndex + 3);
              
              pantoneCode.setAttribute('data-color-name', colorName);
              pantoneCode.setAttribute('data-pantone-code', pantoneCodePart);
            } else {
              // Fallback if format doesn't match expected pattern
              pantoneCode.setAttribute('data-color-name', '');
              pantoneCode.setAttribute('data-pantone-code', bestMatch.code);
            }
            
            // Update the note to show confidence
            const pantoneNote = document.querySelector('.pantone-note');
            if (pantoneNote) {
              pantoneNote.textContent = `Auto-matched from 2,319+ TCX colors (${bestMatch.confidence}% match)`;
            }
          } else {
            // Fallback to original method
            pantoneDisplay.style.display = 'block';
            pantoneCircle.style.backgroundColor = hex;
            const fallbackPantone = `PANTONE ${V10_Utils.hexToPantone(hex)}`;
            pantoneCode.textContent = fallbackPantone;
            
            // Clear TPX preservation data
            delete pantoneDisplay.dataset.originalTpx;
            delete pantoneDisplay.dataset.originalHex;
            
            // Set mobile attributes for fallback
            pantoneCode.setAttribute('data-color-name', '');
            pantoneCode.setAttribute('data-pantone-code', fallbackPantone);
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
      
      // Add Enter key listener for fabric swatch
      pantoneInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent form submission
          if (pantoneInput.value && pantoneInput.value.trim()) {
            this.addLabDip(true); // Add as fabric swatch
          }
        }
      });
    }

    // Popular colors
    const popularColorCircles = document.querySelectorAll('.popular-color-circle');
    
    popularColorCircles.forEach((colorBtn, index) => {
      colorBtn.addEventListener('click', (e) => {
        const hex = colorBtn.dataset.color;
        const pantone = colorBtn.dataset.pantone;
        
        // Set flag to preserve TPX data and prevent color picker input override
        const isTPX = pantone && pantone.includes('TPX');
        if (isTPX && pantoneDisplay) {
          pantoneDisplay.dataset.preserveTpx = 'true';
        }
        
        if (colorPicker) colorPicker.value = hex;
        // Don't auto-fill text box - keep it only for manual user input
        
        if (pantoneDisplay && pantoneCircle && pantoneCode) {
          pantoneDisplay.style.display = 'block';
          pantoneCircle.style.backgroundColor = hex;
          pantoneCode.textContent = pantone;
          
          // Store original TPX data for preservation
          pantoneDisplay.dataset.originalTpx = pantone;
          pantoneDisplay.dataset.originalHex = hex;
          
          // Parse pantone for mobile display (e.g., "Golden glow - 13-0859 TPX")
          const dashIndex = pantone.lastIndexOf(' - ');
          if (dashIndex > 0) {
            const colorName = pantone.substring(0, dashIndex);
            const pantoneCodePart = pantone.substring(dashIndex + 3);
            
            pantoneCode.setAttribute('data-color-name', colorName);
            pantoneCode.setAttribute('data-pantone-code', pantoneCodePart);
          } else {
            // Fallback if format doesn't match expected pattern
            pantoneCode.setAttribute('data-color-name', '');
            pantoneCode.setAttribute('data-pantone-code', pantone);
          }
          
          // Update the note to show this is a pre-selected color with correct type
          const pantoneNote = document.querySelector('.pantone-note');
          if (pantoneNote) {
            const colorType = pantone.includes('TPX') ? 'TPX' : 'TCX';
            pantoneNote.textContent = `Pre-selected ${colorType} color (100% match)`;
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
    const addFabricDesignBtn = document.getElementById('add-fabric-design');

    // Update buttons when form changes
    const updateDesignButtons = () => {
      const name = designNameInput?.value.trim();
      const typeSelected = Array.from(designTypeInputs).some(input => input.checked);
      const height = document.getElementById('design-height')?.value;
      const width = document.getElementById('design-width')?.value;
      const hasDimensions = height && width && parseFloat(height) > 0 && parseFloat(width) > 0;
      const isValid = name && typeSelected && hasDimensions;

      if (addFabricDesignBtn) addFabricDesignBtn.disabled = !isValid;
    };

    if (designNameInput) {
      designNameInput.addEventListener('input', updateDesignButtons);
    }

    designTypeInputs.forEach(input => {
      input.addEventListener('change', updateDesignButtons);
    });

    // Add listeners for dimension inputs
    const heightInput = document.getElementById('design-height');
    const widthInput = document.getElementById('design-width');
    
    if (heightInput) {
      heightInput.addEventListener('input', updateDesignButtons);
    }
    
    if (widthInput) {
      widthInput.addEventListener('input', updateDesignButtons);
    }

    // Initial validation check
    updateDesignButtons();

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
    if (addFabricDesignBtn) {
      addFabricDesignBtn.addEventListener('click', () => this.addDesignSample(true));
    }
  }

  updateLabDipButtons() {
    const colorPicker = document.getElementById('lab-dip-color-picker');
    const pantoneInput = document.getElementById('manual-pantone-code');
    const addToGarmentBtn = document.getElementById('add-labdip-to-garment');

    const hasColor = colorPicker?.value;
    const hasValidPantone = pantoneInput?.value && pantoneInput.value.trim();
    
    const isValid = hasColor || hasValidPantone;

    if (addToGarmentBtn) {
      addToGarmentBtn.disabled = !isValid;
    }
  }

  findExistingLabDip() {
    // Determine pantone code using same logic as addLabDip()
    const colorPicker = document.getElementById('lab-dip-color-picker');
    const pantoneInput = document.getElementById('manual-pantone-code');
    const pantoneDisplay = document.querySelector('.auto-pantone-display');

    let pantone;

    if (pantoneInput.value && pantoneInput.value.trim()) {
      // User typed something - use their exact text
      pantone = pantoneInput.value.trim();
    } else if (colorPicker.value) {
      const hex = colorPicker.value;
      
      // Check if we have original TPX data from popular colors
      if (pantoneDisplay && pantoneDisplay.dataset.originalTpx && pantoneDisplay.dataset.originalHex === hex) {
        // Use the original TPX code
        pantone = pantoneDisplay.dataset.originalTpx;
      } else {
        // Fall back to TCX lookup for color picker selections
        pantone = V10_Utils.hexToPantone(hex);
      }
    } else {
      return null; // No valid pantone code
    }

    // Search for existing lab dip with matching pantone code
    const normalizedPantone = pantone.toLowerCase().trim();
    for (const [labDipId, existingLabDip] of V10_State.labDips.entries()) {
      if (existingLabDip.pantone.toLowerCase().trim() === normalizedPantone) {
        return labDipId; // Found existing lab dip
      }
    }

    return null; // No existing lab dip found
  }

  showGarmentSelector(type, itemId = null) {
    console.log(`🔄 showGarmentSelector called with type: ${type}, itemId: ${itemId}`);
    
    // Check if modal manager exists
    if (!window.v10ModalManager) {
      console.error('❌ V10 Modal Manager not found');
      alert('Modal system not available. Please refresh the page.');
      return;
    }

    // For lab dips, show garments with custom sample type (regardless of completion status)
    // This allows incomplete custom samples to receive lab dip assignments
    let garments;
    if (type === 'labdip') {
      // Show all garments with basic info (type & fabric), let modal handle eligibility
      garments = Array.from(V10_State.garments.values())
        .filter(g => g.type && g.fabricType)
        .sort((a, b) => a.number - b.number);
      console.log(`🎨 Found ${garments.length} garments for lab dip assignment (eligibility handled in modal):`, garments);
    } else {
      // For design assignments, use completed garments
      garments = Array.from(V10_State.garments.values())
        .filter(g => g.isComplete)
        .sort((a, b) => a.number - b.number);
      console.log(`📊 Found ${garments.length} complete garments for design assignment:`, garments);
    }
    
    // Debug: Check garment sample types for lab dip assignment
    console.log('🔍 DEBUG: Garments for lab dip assignment:', garments.map(g => ({
      id: g.id,
      number: g.number,
      type: g.type,
      fabricType: g.fabricType,
      sampleType: g.sampleType, // This is likely undefined/empty
      isComplete: g.isComplete
    })));
    
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

  // Helper function to get badge text for sample types
  getSampleTypeBadgeText(sampleType) {
    switch(sampleType) {
      case 'stock': return 'Stock Color';
      case 'techpack': return 'As Per TechPack';
      default: return '';
    }
  }

  createGarmentSelectorModal(garments, type, itemId = null) {
    console.log(`🔄 createGarmentSelectorModal: ${type}, ${garments.length} garments, itemId: ${itemId}`);
    
    try {
      // For lab dips, filter and count available garments
      let availableCount = garments.length;
      if (type === 'labdip') {
        availableCount = garments.filter(g => g.sampleType === 'custom').length;
        
        // Debug: Lab dip filtering logic
        console.log('🔍 DEBUG: Lab dip filtering logic:', {
          type: type,
          totalGarments: garments.length,
          garmentsWithSampleType: garments.filter(g => g.sampleType).length,
          garmentsWithCustom: garments.filter(g => g.sampleType === 'custom').length,
          availableCount: availableCount,
          garmentSampleTypes: garments.map(g => ({ 
            id: g.id, 
            number: g.number,
            sampleType: g.sampleType,
            sampleTypeType: typeof g.sampleType
          }))
        });
      }
      
      const modal = document.createElement('div');
      modal.className = 'v10-modal-overlay';
    modal.innerHTML = `
      <div class="v10-modal">
        <div class="v10-modal-header">
          <h3 class="v10-modal-title">Assign ${type === 'labdip' ? 'Lab Dip' : 'Design Sample'} to Garment${type === 'labdip' && availableCount !== garments.length ? ` (${availableCount} of ${garments.length} available)` : ''}</h3>
          <button type="button" class="v10-modal-close">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M15 5L5 15m0-10l10 10" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
        <div class="v10-modal-body">
          ${type === 'labdip' && availableCount === 0 ? `
            <div class="garment-selector-empty">
              <div class="empty-icon">⚠️</div>
              <h4>No Garments Available</h4>
              <p>No garments are available for lab dip assignment. Please select <strong>'Custom Color (Pantone)'</strong> for at least one garment.</p>
            </div>
          ` : `
            <div class="garment-selector">
              ${garments.map(garment => {
                const isLabDip = type === 'labdip';
                const isEligible = !isLabDip || (garment.sampleType === 'custom' && garment.sampleSubValue === 'design-studio');
                
                // Handle badges for both lab dips and designs
                let badgeText = '';
                let badgeClass = '';
                if (isLabDip && !isEligible) {
                  if (!garment.sampleType || garment.sampleType === '') {
                    badgeText = 'No Sample Type';
                    badgeClass = 'missing';
                  } else if (garment.sampleType === 'custom' && garment.sampleSubValue !== 'design-studio') {
                    // Custom color selected but not available for lab dips
                    badgeText = 'FOLLOW TECHPACK EXACTLY';
                    badgeClass = 'custom';
                  } else {
                    badgeText = this.getSampleTypeBadgeText(garment.sampleType);
                    badgeClass = garment.sampleType;
                  }
                } else if (!isLabDip) {
                  // For design assignments, show sample type badges for all garments
                  if (!garment.sampleType || garment.sampleType === '') {
                    badgeText = 'Complete';
                    badgeClass = 'complete';
                  } else {
                    badgeText = this.getSampleTypeBadgeText(garment.sampleType);
                    badgeClass = garment.sampleType;
                  }
                }
                
                // Get assigned lab dips for this garment
                let labDipIndicators = '';
                if (garment.assignedLabDips && garment.assignedLabDips.size > 0) {
                  const labDipColors = [];
                  garment.assignedLabDips.forEach(labDipId => {
                    const labDip = V10_State.labDips.get(labDipId);
                    if (labDip) {
                      labDipColors.push({
                        id: labDipId,
                        pantone: labDip.pantone,
                        hex: labDip.hex || '#cccccc',
                        isCustomCode: labDip.isCustomCode
                      });
                    }
                  });
                  
                  if (labDipColors.length > 0) {
                    labDipIndicators = `
                      <div class="garment-labdip-indicators">
                        ${labDipColors.slice(0, 4).map(color => {
                          // Check if this is a custom text-only code (purple hex with custom flag)
                          const isCustomTextCode = color.isCustomCode && color.hex === '#8B5CF6';
                          const backgroundStyle = isCustomTextCode 
                            ? 'background: conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #ff6b6b);'
                            : `background-color: ${color.hex};`;
                          
                          return `
                            <span class="labdip-color-circle" 
                                  style="${backgroundStyle}" 
                                  title="${color.pantone}">
                            </span>
                          `;
                        }).join('')}
                        ${labDipColors.length > 4 ? `<span class="labdip-more-indicator">+${labDipColors.length - 4}</span>` : ''}
                      </div>
                    `;
                  }
                }
                
                return `
                  <label class="garment-selector__option${!isEligible ? ' garment-selector__option--disabled' : ''}">
                    <input type="radio" name="target-garment" value="${garment.id}"${!isEligible ? ' disabled' : ''}>
                    <span class="garment-selector__card">
                      <span class="garment-selector__title">Garment ${garment.number}</span>
                      <span class="garment-selector__details">${garment.type} - ${garment.fabricType}</span>
                      ${labDipIndicators}
                      ${badgeText ? `<span class="sample-type-badge sample-type-badge--${badgeClass}">${badgeText}</span>` : ''}
                    </span>
                  </label>
                `;
              }).join('')}
            </div>
          `}
          <div class="v10-modal-actions">
            <button type="button" class="v10-btn v10-btn--secondary modal-cancel">Cancel</button>
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
              console.log(`🎯 MODAL ASSIGNMENT: Assigning existing lab dip ${itemId} to garment ${selectedGarment}`);
              console.log(`🎯 MODAL DEBUG: v10GarmentStudio available:`, !!window.v10GarmentStudio);
              window.v10GarmentStudio.assignLabDip(selectedGarment, itemId);
              
              // Add delayed badge update to ensure assignment is fully processed
              setTimeout(() => {
                window.v10GarmentStudio.updateStudioCompletion();
                window.v10GarmentStudio.updateDesignStudioTabStatus();
                V10_BadgeManager.updateGarmentCompletionBadge();
                V10_BadgeManager.updateDesignCompletionBadge();
                
                // Update lab dip collection assignment text after modal assignment
                let updateSuccessful = false;
                
                // Primary method: Use designStudio through TechPack system
                if (window.v10TechPackSystem?.designStudio?.updateLabDipCollectionAssignments) {
                  try {
                    window.v10TechPackSystem.designStudio.updateLabDipCollectionAssignments();
                    updateSuccessful = true;
                  } catch (error) {
                    console.error('Error calling designStudio method:', error);
                  }
                }
                
                // Secondary method: Check if global alias exists
                if (!updateSuccessful && window.v10ColorStudio?.updateLabDipCollectionAssignments) {
                  try {
                    window.v10ColorStudio.updateLabDipCollectionAssignments();
                    updateSuccessful = true;
                  } catch (error) {
                    console.error('Error calling v10ColorStudio method:', error);
                  }
                }
                
                // Tertiary method: Direct function call fallback
                if (!updateSuccessful && window.v10DesignStudio?.updateLabDipCollectionAssignments) {
                  try {
                    window.v10DesignStudio.updateLabDipCollectionAssignments();
                    updateSuccessful = true;
                  } catch (error) {
                    console.error('Error calling v10DesignStudio method:', error);
                  }
                }
                
                // Final fallback: Direct DOM manipulation
                if (!updateSuccessful) {
                  try {
                    const container = document.getElementById('labdips-grid');
                    const labDipItem = container?.querySelector(`[data-labdip-id="${itemId}"]`);
                    const typeElement = labDipItem?.querySelector('.collection-item__type');
                    
                    if (typeElement && window.v10ReviewManager?.getLabDipAssignmentText) {
                      const assignmentText = window.v10ReviewManager.getLabDipAssignmentText(itemId);
                      typeElement.textContent = assignmentText;
                      updateSuccessful = true;
                    } else if (typeElement) {
                      // Ultra fallback: Manual assignment text generation
                      const assignments = V10_State.assignments.labDips.get(itemId);
                      if (assignments && assignments.size > 0) {
                        const garmentNames = Array.from(assignments).map(garmentId => {
                          const garment = V10_State.garments.get(garmentId);
                          return garment ? `Garment ${garment.number} ${garment.type || 'Unknown'}` : null;
                        }).filter(Boolean);
                        const assignmentText = garmentNames.length > 0 ? garmentNames.join(', ') : 'LAB DIP';
                        typeElement.textContent = assignmentText;
                        updateSuccessful = true;
                      }
                    }
                  } catch (fallbackError) {
                    console.error('Modal fallback update failed:', fallbackError);
                  }
                }
                
                console.log(`🔄 Modal assignment badge update completed for lab dip ${itemId}`);
              }, 150);
            } else {
              console.log(`✅ Assigning existing design ${itemId} to garment ${selectedGarment}`);
              window.v10GarmentStudio.assignDesign(selectedGarment, itemId);
              
              // Add delayed badge update to ensure assignment is fully processed
              setTimeout(() => {
                window.v10GarmentStudio.updateStudioCompletion();
                window.v10GarmentStudio.updateDesignStudioTabStatus();
                V10_BadgeManager.updateGarmentCompletionBadge();
                V10_BadgeManager.updateDesignCompletionBadge();
                console.log(`🔄 Modal assignment badge update completed for design ${itemId}`);
              }, 150);
            }
          } else {
            // Create new item and assign to garment (current behavior for "Add to Garment" from forms)
            if (type === 'labdip') {
              // Check if there's already an existing lab dip with the same pantone code
              const existingLabDipId = this.findExistingLabDip();
              if (existingLabDipId) {
                // Use existing lab dip for assignment
                console.log(`🔄 Found existing lab dip ${existingLabDipId}, assigning to garment ${selectedGarment}`);
                window.v10GarmentStudio.assignLabDip(selectedGarment, existingLabDipId);
              } else {
                // No existing lab dip found, create new one
                this.addLabDip(false, selectedGarment);
              }
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
    const pantoneDisplay = document.querySelector('.auto-pantone-display');

    let hex, pantone;

    if (pantoneInput.value && pantoneInput.value.trim()) {
      // User typed something - use their exact text regardless of validity
      pantone = pantoneInput.value.trim();
      // For manual text input, ALWAYS use the special rainbow gradient identifier
      hex = '#8B5CF6'; // This will trigger rainbow gradient in rendering
    } else if (colorPicker.value) {
      hex = colorPicker.value;
      
      // Check if we have original TPX data from popular colors
      if (pantoneDisplay && pantoneDisplay.dataset.originalTpx && pantoneDisplay.dataset.originalHex === hex) {
        // Preserve the original TPX code
        pantone = pantoneDisplay.dataset.originalTpx;
      } else {
        // Fall back to TCX lookup for color picker selections
        pantone = V10_Utils.hexToPantone(hex);
      }
    } else {
      alert('Please select a color or enter a Pantone code.');
      return;
    }

    // Check for duplicate lab dips - prevent same pantone code from being added twice
    const normalizedPantone = pantone.toLowerCase().trim();
    for (const existingLabDip of V10_State.labDips.values()) {
      if (existingLabDip.pantone.toLowerCase().trim() === normalizedPantone) {
        // Silently prevent duplicate - just return without adding
        return;
      }
    }

    const labDipId = V10_Utils.generateId('labdip');
    const labDipData = {
      id: labDipId,
      hex,
      pantone,
      isFabricSwatch,
      isCustomCode: pantoneInput.value && pantoneInput.value.trim() ? true : false, // Always true for any manual textbox input
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

    // Clear custom pantone text input after successful addition
    if (pantoneInput.value && pantoneInput.value.trim()) {
      pantoneInput.value = '';
      console.log('🧹 Cleared pantone text input after adding custom code');
    }
    
    // Keep color picker selection for repeated use - don't clear color picker
    // Users can keep adding the same color multiple times without having to reselect it

    // Auto-save

    console.log(`🎨 Added lab dip: ${labDipId}`);
  }

  addDesignSample(isFabricSample = false, targetGarmentId = null) {
    const nameInput = document.getElementById('design-sample-name');
    const typeInputs = document.querySelectorAll('input[name="design-type"]');
    const fileInput = document.getElementById('design-file-input');
    const heightInput = document.getElementById('design-height');
    const widthInput = document.getElementById('design-width');

    const name = nameInput?.value.trim();
    const selectedType = Array.from(typeInputs).find(input => input.checked);
    const height = heightInput?.value ? parseFloat(heightInput.value) : null;
    const width = widthInput?.value ? parseFloat(widthInput.value) : null;
    
    if (!name || !selectedType) {
      alert('Please enter a design name and select a type.');
      return;
    }

    const designId = V10_Utils.generateId('design');
    const designData = {
      id: designId,
      name,
      type: selectedType.value,
      height,
      width,
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
    if (heightInput) heightInput.value = '';
    if (widthInput) widthInput.value = '';
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
    const typeElement = clone.querySelector('.collection-item__type');
    
    if (colorElement) {
      // Check if this is a pure text-only custom code (purple background)
      if (labDipData.isCustomCode && labDipData.hex === '#8B5CF6') {
        // Use multi-colored gradient for text-only custom codes
        colorElement.style.background = 'conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #ff6b6b)';
        colorElement.style.border = '2px solid #8B5CF6';
        colorElement.style.boxShadow = '0 0 8px rgba(139, 92, 246, 0.3)';
        colorElement.classList.add('custom-pantone-color');
      } else {
        // Normal color display
        colorElement.style.backgroundColor = labDipData.hex;
        
        // Add border for custom codes that have specific colors
        if (labDipData.isCustomCode) {
          colorElement.style.border = '2px solid #8B5CF6';
          colorElement.style.boxShadow = '0 0 8px rgba(139, 92, 246, 0.3)';
          colorElement.classList.add('custom-pantone-color');
        }
      }
    }
    
    if (nameElement) {
      nameElement.textContent = labDipData.pantone;
      
      // Add custom indicator for user-typed codes
      if (labDipData.isCustomCode) {
        nameElement.innerHTML = `${labDipData.pantone} <span class="custom-code-indicator">CUSTOM</span>`;
      }
    }
    
    // Update type element with assignment information
    if (typeElement) {
      console.log(`🔍 RENDER DEBUG: Updating type element for lab dip ${labDipData.id}`);
      console.log(`🔍 Type element found:`, typeElement);
      console.log(`🔍 Current text:`, typeElement.textContent);
      console.log(`🔍 v10ReviewManager available:`, !!window.v10ReviewManager);
      
      if (window.v10ReviewManager && window.v10ReviewManager.getLabDipAssignmentText) {
        const assignmentText = window.v10ReviewManager.getLabDipAssignmentText(labDipData.id);
        console.log(`🔍 Assignment text from ReviewManager:`, assignmentText);
        typeElement.textContent = assignmentText;
        console.log(`🔍 Text after update:`, typeElement.textContent);
      } else {
        // Fallback if v10ReviewManager not available
        console.log(`🔍 Using fallback assignment logic`);
        const assignments = V10_State.assignments.labDips.get(labDipData.id);
        console.log(`🔍 Assignments found:`, assignments);
        if (assignments && assignments.size > 0) {
          const garmentNames = Array.from(assignments).map(garmentId => {
            const garment = V10_State.garments.get(garmentId);
            console.log(`🔍 Garment ${garmentId}:`, garment);
            return garment ? `Garment ${garment.number} ${garment.type || 'Unknown'}` : null;
          }).filter(Boolean);
          console.log(`🔍 Garment names:`, garmentNames);
          typeElement.textContent = garmentNames.length > 0 ? garmentNames.join(', ') : 'LAB DIP';
        } else {
          typeElement.textContent = 'LAB DIP';
        }
        console.log(`🔍 Final text after fallback:`, typeElement.textContent);
      }
    } else {
      console.log(`❌ No type element found for lab dip ${labDipData.id}`);
    }

    // Bind events
    const assignBtn = clone.querySelector('.collection-item__assign');
    const removeBtn = clone.querySelector('.collection-item__remove');

    if (assignBtn) {
      console.log(`🔗 Binding assignment button for lab dip ${labDipData.id}`, assignBtn);
      assignBtn.addEventListener('click', () => {
        console.log(`🎯 LAB DIP COLLECTION BUTTON CLICKED for ${labDipData.id}`);
        this.showGarmentSelector('labdip', labDipData.id);
      });
    } else {
      console.log(`❌ No assign button found for lab dip ${labDipData.id}`);
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', () => this.removeLabDip(labDipData.id));
    }

    container.appendChild(clone);
    
    if (emptyState) emptyState.style.display = 'none';
  }
  
  updateLabDipCollectionAssignments() {
    const container = document.getElementById('labdips-grid');
    if (!container) {
      return;
    }
    
    // Update all existing lab dip items
    const labDipItems = container.querySelectorAll('.collection-item[data-labdip-id]');
    
    labDipItems.forEach((item, index) => {
      const labDipId = item.dataset.labdipId;
      const typeElement = item.querySelector('.collection-item__type');
      
      if (typeElement && labDipId) {
        let assignmentText;
        if (window.v10ReviewManager && window.v10ReviewManager.getLabDipAssignmentText) {
          assignmentText = window.v10ReviewManager.getLabDipAssignmentText(labDipId);
        } else {
          // Fallback assignment logic
          const assignments = V10_State.assignments.labDips.get(labDipId);
          if (assignments && assignments.size > 0) {
            const garmentNames = Array.from(assignments).map(garmentId => {
              const garment = V10_State.garments.get(garmentId);
              return garment ? `Garment ${garment.number} ${garment.type || 'Unknown'}` : null;
            }).filter(Boolean);
            assignmentText = garmentNames.length > 0 ? garmentNames.join(', ') : 'LAB DIP';
          } else {
            assignmentText = 'LAB DIP';
          }
        }
        typeElement.textContent = assignmentText;
        
        // Re-bind event listeners after text update
        const assignBtn = item.querySelector('.collection-item__assign');
        if (assignBtn) {
          // Remove existing event listeners to avoid duplicates
          assignBtn.replaceWith(assignBtn.cloneNode(true));
          const newAssignBtn = item.querySelector('.collection-item__assign');
          newAssignBtn.addEventListener('click', () => {
            this.showGarmentSelector('labdip', labDipId);
          });
        }
      }
    });
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
    const measurementsElement = clone.querySelector('.collection-item__measurements');
    
    if (nameElement) nameElement.textContent = designData.name;
    if (typeElement) typeElement.textContent = designData.type;
    
    // Add measurements if available
    if (measurementsElement) {
      const measurements = [];
      if (designData.height) measurements.push(`H: ${designData.height}cm`);
      if (designData.width) measurements.push(`W: ${designData.width}cm`);
      measurementsElement.textContent = measurements.length > 0 ? measurements.join(' × ') : '';
    }

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
    // Check if lab dip has assigned garments first
    const assignedGarments = V10_State.assignments.labDips.get(labDipId);
    const hasAssignments = assignedGarments && assignedGarments.size > 0;
    
    // Only show confirmation if lab dip has assigned garments
    const shouldProceed = hasAssignments 
      ? confirm('Remove this lab dip? This will also remove it from all garments.')
      : true; // No confirmation needed for unassigned lab dips
    
    if (shouldProceed) {
      // Remove from state
      V10_State.labDips.delete(labDipId);
      
      // Clean up assignments (if any exist)
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
      
      // Update studio completion status after lab dip removal
      window.v10GarmentStudio.updateStudioCompletion();
      window.v10GarmentStudio.updateDesignStudioTabStatus();
      V10_BadgeManager.updateGarmentCompletionBadge();
      V10_BadgeManager.updateDesignCompletionBadge();
  
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
    const labDipsEmpty = document.getElementById('labdips-empty');
    const designsEmpty = document.getElementById('designs-empty');
    const labDipsTip = document.getElementById('labdips-tip');

    const labDipCount = V10_State.labDips.size;
    const designCount = V10_State.designSamples.size;

    if (labDipsEmpty) {
      labDipsEmpty.style.display = labDipCount === 0 ? 'block' : 'none';
    }

    if (designsEmpty) {
      designsEmpty.style.display = designCount === 0 ? 'block' : 'none';
    }

    // Show tip message always (removed lab dip count condition)
    if (labDipsTip) {
      labDipsTip.style.display = 'block'; // Always show
      console.log(`💡 Tip message: SHOWN (lab dip count: ${labDipCount})`);
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
  
  // Assignment text function moved to V10_ReviewManager to avoid duplication
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
    console.log('🚀 V10_ValidationManager initialized - running initial validation');
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
      
      // Button state management removed - buttons are always enabled
      // Navigation is handled by V10_TechPackSystem.bindGlobalEvents()
      try {
        const nextBtn = this.nextBtn;
        if (nextBtn) {
          // Buttons remain always enabled - validation feedback shown on click instead
          
          // PRIORITY: Check if both studios are complete for bulk orders
          // This overrides individual garment validation
          if (requestType === 'bulk-order-request') {
            const garmentStudioTab = document.getElementById('garment-studio-tab');
            const quantityStudioTab = document.getElementById('quantities-studio-tab');
            
            const garmentStudioComplete = garmentStudioTab?.classList.contains('studio-tab--complete') || false;
            const quantityStudioComplete = quantityStudioTab?.classList.contains('studio-tab--complete') || false;
            
            if (garmentStudioComplete && quantityStudioComplete) {
              // Both studios complete - OVERRIDE validation and enable "Proceed to Review"
              console.log('🎯 STUDIO PRIORITY: Both studios complete - enabling Proceed to Review (overriding garment validation)');
              nextBtn.innerHTML = `
                <svg class="v10-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                Proceed to Review
              `;
              nextBtn.title = 'Both studios complete - proceed to review and submit';
              nextBtn.classList.remove('v10-btn--disabled');
              nextBtn.removeAttribute('disabled');
              return validation; // Return early, skip individual garment validation UI
            }
          }
          
          // Enhanced button text and styling based on validation
          if (validation.isValid) {
            console.log('✅ All garments complete - enabling Proceed to Review button');
            nextBtn.innerHTML = `
              <svg class="v10-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3l8-8"/>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
              </svg>
              Proceed to Review
            `;
            nextBtn.title = 'All garments complete - proceed to review and submit';
            nextBtn.classList.remove('v10-btn--disabled');
            nextBtn.removeAttribute('disabled'); // Ensure HTML disabled attribute is removed
          } else {
            // Show progress in button when incomplete
            const stats = validation.stats;
            if (stats) {
              console.log(`⏳ Garments incomplete - showing progress (${stats.complete}/${stats.total})`);
              nextBtn.innerHTML = `
                Complete All Garments (${stats.complete}/${stats.total})
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              `;
              nextBtn.title = `${stats.incomplete} garment(s) incomplete - complete all garments to proceed`;
            } else if (Array.isArray(validation.errors) && validation.errors.length > 0) {
              console.log(`❌ Validation errors:`, validation.errors);
              nextBtn.innerHTML = `
                Complete All Garments
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              `;
              nextBtn.title = validation.errors.join(', ');
            }
            nextBtn.classList.add('v10-btn--disabled');
            // Note: Don't add disabled attribute back - let CSS handle visual state
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

      // For bulk orders, we just need to check if both studios are complete
      // The studios themselves already check their completion status
      const garmentStudioTab = document.getElementById('garment-studio-tab');
      const quantityStudioTab = document.getElementById('quantities-studio-tab');
      
      const garmentStudioComplete = garmentStudioTab?.classList.contains('studio-tab--complete') || false;
      const quantityStudioComplete = quantityStudioTab?.classList.contains('studio-tab--complete') || false;
      
      if (!garmentStudioComplete) {
        errors.push('Complete all garments in Garment Studio');
      }
      
      if (!quantityStudioComplete) {
        errors.push('Complete all quantity requirements in Quantity Studio');
      }
      
      // Update total quantity if available
      if (window.v10QuantityStudio) {
        let totalUnits = 0;
        window.v10QuantityStudio.garments.forEach((garment) => {
          totalUnits += garment.total || 0;
        });
        V10_State.totalQuantity = totalUnits;
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
              errors.push(`Garment ${index + 1}: Custom samples require cotton or 100% polyester fabrics. Selected: ${garment.fabricType}`);
              isValid = false;
            }
          }
          
          // Check for lab dip assignments with non-cotton fabrics
          if (garment.assignedLabDips && garment.assignedLabDips.size > 0 && !V10_Utils.isCottonFabric(garment.fabricType)) {
            errors.push(`Garment ${index + 1}: Lab dip assignments require cotton or 100% polyester fabrics for custom colors`);
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
        // Only 'design-studio' custom samples require lab dip assignments
        if (garment.sampleType === 'custom' && garment.sampleSubValue === 'design-studio' && (!garment.assignedLabDips || garment.assignedLabDips.size === 0)) {
          errors.push(`Garment ${index + 1}: Color Studio sample requires Lab Dip assignment`);
          isValid = false;
        }
        
        // Enhanced fabric-sample compatibility checks
        if (garment.fabricType && garment.sampleType) {
          const isCottonFabric = V10_Utils.isCottonFabric(garment.fabricType);
          
          if (garment.sampleType.includes('custom') && !isCottonFabric) {
            errors.push(`Garment ${index + 1}: Custom color samples not available for ${garment.fabricType}. Please select a cotton or 100% polyester fabric or choose stock color sample.`);
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
            <span class="collection-item__type">${V10_Utils.formatCurrency(V10_CONFIG.PRICING.LAB_DIP)}</span>
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
    if (document.getElementById('techpack-v10-step-4')) {
      this.bindEvents();
      // populateReview() will be called when step 4 becomes visible
    }
  }

  bindEvents() {
    // Navigation buttons
    const prevBtn = document.getElementById('step-4-prev');
    const submitBtn = document.getElementById('submit-request-btn');
    const saveDraftBtn = document.getElementById('save-draft-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.goBackToStep(3);
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.submitRequest());
    }

    if (saveDraftBtn) {
      saveDraftBtn.addEventListener('click', () => this.saveDraft());
    }

    // Edit buttons will be bound after content is populated
    // See bindEditButtons() method

    // Terms checkbox
    const termsCheckbox = document.getElementById('terms-agreement');
    if (termsCheckbox) {
      termsCheckbox.addEventListener('change', () => this.updateSubmitButton());
    }
    
    // Bind new terms modal
    this.bindNewTermsModal();
  }

  bindEditButtons() {
    // Bind edit buttons after content is populated
    console.log('🎯 Step 4: Binding enhanced edit buttons...');
    
    // Bind section edit buttons (new v10-section-edit-btn)
    document.querySelectorAll('.v10-section-edit-btn[data-edit-step]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const step = parseInt(btn.dataset.editStep);
        const studio = btn.dataset.studio;
        console.log('🎯 Step 4: Section edit button clicked, going to step:', step, studio ? `with studio: ${studio}` : '');
        this.goBackToStep(step, studio);
      });
    });
    
    // Bind edit buttons with studio support
    document.querySelectorAll('.v10-edit-btn[data-edit-step]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const step = parseInt(btn.dataset.editStep);
        const studio = btn.dataset.studio;
        console.log('🎯 Step 4: Edit button clicked, going to step:', step, studio ? `with studio: ${studio}` : '');
        this.goBackToStep(step, studio);
      });
    });
    
    // Bind legacy edit buttons for compatibility
    document.querySelectorAll('[data-edit-step]').forEach(btn => {
      if (!btn.classList.contains('v10-section-edit-btn') && !btn.classList.contains('v10-edit-btn')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const step = parseInt(e.target.closest('[data-edit-step]').dataset.editStep);
          console.log('🎯 Step 4: Legacy edit button clicked, going to step:', step);
          this.goBackToStep(step);
        });
      }
    });
    
    console.log('🎯 Step 4: Edit buttons bound:', document.querySelectorAll('[data-edit-step]').length);
    
    // Bind Terms & Conditions modal
    this.bindTermsModal();
    
    // Bind terms checkbox to update submit button
    const termsCheckbox = document.getElementById('terms-agreement');
    if (termsCheckbox) {
      termsCheckbox.addEventListener('change', () => {
        this.updateSubmitButton();
      });
      
      // Initial button state
      this.updateSubmitButton();
    }
  }


  // New Terms Modal Methods
  bindNewTermsModal() {
    const termsLink = document.getElementById('terms-link');
    const newTermsModal = document.getElementById('new-terms-modal');
    
    if (termsLink && newTermsModal) {
      termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openNewTermsModal();
      });
      
      // Bind close buttons
      const closeButtons = newTermsModal.querySelectorAll('.v10-modal-close, .v10-new-terms-understand');
      closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.closeNewTermsModal();
        });
      });
      
      // Close on overlay click
      newTermsModal.addEventListener('click', (e) => {
        if (e.target === newTermsModal) {
          this.closeNewTermsModal();
        }
      });
    }
  }

  openNewTermsModal() {
    const modal = document.getElementById('new-terms-modal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  closeNewTermsModal() {
    const modal = document.getElementById('new-terms-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  goBackToStep(stepNumber, targetStudio = null) {
    const step4 = document.getElementById('techpack-v10-step-4');
    const targetStep = document.getElementById(`techpack-v10-step-${stepNumber}`);
    
    if (!step4 || !targetStep) {
      console.error('Step elements not found for navigation');
      return;
    }
    
    console.log(`🎯 Step 4: Navigating back to step ${stepNumber}${targetStudio ? ` -> ${targetStudio} studio` : ''}`);
    
    // Hide step 4
    step4.style.display = 'none';
    
    // Show target step
    targetStep.style.display = 'block';
    
    // Switch to specific studio if requested
    if (targetStudio && stepNumber === 3 && window.v10TechPackSystem && window.v10TechPackSystem.navigator) {
      console.log(`🎛️ Switching to ${targetStudio} studio`);
      window.v10TechPackSystem.navigator.switchStudio(targetStudio);
    }
    
    // Scroll to top for mobile navigation
    window.scrollTo(0, 0);
    
    // Update session storage if available
    try {
      sessionStorage.setItem('v10_current_step', stepNumber.toString());
    } catch (error) {
      console.warn('Could not update session storage:', error);
    }
  }

  populateReview() {
    console.log('🎯 Step 4: Starting enhanced review population...');
    console.log('🎯 V10_State garments:', V10_State.garments.size);
    console.log('🎯 V10_State requestType:', V10_State.requestType);
    
    // Ensure assignments structure exists (safety check)
    if (!V10_State.assignments) {
      V10_State.assignments = {
        labDips: new Map(),
        designs: new Map()
      };
    }
    
    // Populate all sections with enhanced design
    this.populateClientInfo();
    this.populateUploadedFiles();
    this.populateExecutiveSummary();
    this.populateRequestOverview();
    this.populateStatistics();
    this.populateGarments();
    this.populateLabDips();
    this.populateDesigns();
    this.populateCostSummary();
    this.updateSectionVisibility();
    this.updateSubmitMessage();
    
    console.log('🎯 Step 4: Enhanced review population completed');
    
    // Bind edit button events after content is populated
    this.bindEditButtons();
    
    // Update submit button state
    this.updateSubmitButton();
  }

  populateExecutiveSummary() {
    // This method will be called to populate the new executive summary section
    console.log('🎯 Step 4: Populating executive summary...');
  }

  populateRequestOverview() {
    const titleEl = document.getElementById('request-overview-title');
    const subtitleEl = document.getElementById('request-overview-subtitle');
    const badgeEl = document.getElementById('request-type-badge');
    
    if (!titleEl || !subtitleEl || !badgeEl) return;
    
    const requestType = V10_State.requestType;
    const overviewData = {
      'quotation': {
        title: 'Quotation Request',
        subtitle: 'Professional pricing estimate for your specifications',
        badge: 'QUOTE'
      },
      'sample-request': {
        title: 'Sample Request',
        subtitle: 'Physical samples for approval and testing',
        badge: 'SAMPLES'
      },
      'bulk-order-request': {
        title: 'Bulk Order Request', 
        subtitle: 'Production order for specified quantities',
        badge: 'PRODUCTION'
      }
    };
    
    const data = overviewData[requestType] || overviewData['quotation'];
    titleEl.textContent = data.title;
    subtitleEl.textContent = data.subtitle;
    badgeEl.textContent = data.badge;
  }

  populateStatistics() {
    const totalGarmentsEl = document.getElementById('total-garments');
    const totalColorsEl = document.getElementById('total-colors');
    const totalFilesEl = document.getElementById('total-files');
    const totalCostEl = document.getElementById('total-cost');
    
    if (!totalGarmentsEl || !totalColorsEl || !totalFilesEl || !totalCostEl) return;
    
    // Calculate statistics
    const garmentCount = V10_State.garments.size;
    const colorCount = V10_State.labDips.size;
    const fileCount = this.getUploadedFiles().length;
    const costs = this.calculateCosts();
    const currentCurrency = this.getCurrentCurrency();
    
    totalGarmentsEl.textContent = garmentCount;
    totalColorsEl.textContent = colorCount;
    totalFilesEl.textContent = fileCount;
    totalCostEl.textContent = this.formatCurrencyWithToggle(costs.total, currentCurrency);
  }

  updateStatusBadge() {
    // Status badge functionality removed
  }

  validateAllSections() {
    // Simple validation - check if we have garments and they're complete
    if (V10_State.garments.size === 0) return false;
    
    const garments = Array.from(V10_State.garments.values());
    return garments.every(garment => this.isGarmentComplete(garment, V10_State.requestType));
  }

  isGarmentComplete(garment, requestType) {
    // Basic validation logic (simplified from existing)
    const hasBasicSpecs = garment.type && garment.fabricType;
    
    switch (requestType) {
      case 'quotation':
        return hasBasicSpecs;
      case 'sample-request':
        const hasSampleType = garment.sampleType;
        if (garment.sampleType === 'stock') {
          return hasBasicSpecs && hasSampleType && garment.sampleSubValue;
        } else if (garment.sampleType === 'custom') {
          return hasBasicSpecs && hasSampleType && garment.assignedLabDips?.size > 0;
        }
        return false;
      case 'bulk-order-request':
        const hasQuantities = garment.quantities && Object.values(garment.quantities).some(qty => qty > 0);
        return hasBasicSpecs && hasQuantities;
      default:
        return hasBasicSpecs;
    }
  }

  populateClientInfo() {
    const container = document.getElementById('review-client-info');
    if (!container) return;

    // Get client info from global state or form
    const clientData = this.getClientData();
    const requestType = V10_State.requestType || 'sample-request';
    
    let clientFields = '';
    
    // Show name/contact first if available AND different from company name
    if (clientData.name && clientData.name !== 'Not provided' && clientData.name !== clientData.company) {
      clientFields += `
        <div class="review-detail">
          <span class="detail-label">Name:</span>
          <span class="detail-value">${clientData.name}</span>
        </div>
      `;
    }
    
    // Show company for business requests
    if (clientData.company && clientData.company !== 'Not provided') {
      clientFields += `
        <div class="review-detail">
          <span class="detail-label">Company:</span>
          <span class="detail-value">${clientData.company}</span>
        </div>
      `;
    }
    
    // Always show email if available
    if (clientData.email && clientData.email !== 'Not provided' && clientData.email !== 'office@genuineblanks.com') {
      clientFields += `
        <div class="review-detail">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${clientData.email}</span>
        </div>
      `;
    }
    
    // Add request type specific information
    clientFields += `
      <div class="review-detail">
        <span class="detail-label">Request Type:</span>
        <span class="detail-value">${this.getRequestTypeLabel(requestType)}</span>
      </div>
    `;
    
    // Add phone if available (for sample requests and bulk orders)
    if ((requestType === 'sample-request' || requestType === 'bulk-order-request') && clientData.phone && clientData.phone !== 'Not provided') {
      clientFields += `
        <div class="review-detail">
          <span class="detail-label">Phone:</span>
          <span class="detail-value">${clientData.phone}</span>
        </div>
      `;
    }
    
    // Add delivery type for sample requests and bulk orders
    if (requestType === 'sample-request' || requestType === 'bulk-order-request') {
      const deliveryType = clientData.deliveryType && clientData.deliveryType !== 'Not provided' 
        ? clientData.deliveryType 
        : 'Company Address'; // Default to Company Address
      
      clientFields += `
        <div class="review-detail">
          <span class="detail-label">Delivery Address:</span>
          <span class="detail-value">${deliveryType}</span>
        </div>
      `;
    }
    
    // Add address if different address was selected
    if (clientData.address && clientData.address !== 'Not provided') {
      clientFields += `
        <div class="review-detail">
          <span class="detail-label">Address:</span>
          <span class="detail-value">${clientData.address}</span>
        </div>
      `;
    }
    
    // Add shipping and insurance info for bulk orders
    if (requestType === 'bulk-order-request') {
      // Always show shipping method for bulk orders
      const shippingMethod = clientData.shippingMethod && clientData.shippingMethod !== 'Not provided'
        ? clientData.shippingMethod
        : 'Not selected';
      
      clientFields += `
        <div class="review-detail">
          <span class="detail-label">Shipping Method:</span>
          <span class="detail-value">${shippingMethod}</span>
        </div>
      `;
      
      // Always show insurance for bulk orders
      const insurance = clientData.insurance && clientData.insurance !== 'Not provided'
        ? clientData.insurance
        : 'Not selected';
        
      clientFields += `
        <div class="review-detail">
          <span class="detail-label">Insurance:</span>
          <span class="detail-value">${insurance}</span>
        </div>
      `;
      
      // Legacy business info if available from client manager
      if (clientData.businessType && clientData.businessType !== 'Not provided') {
        clientFields += `
          <div class="review-detail">
            <span class="detail-label">Business Type:</span>
            <span class="detail-value">${clientData.businessType}</span>
          </div>
        `;
      }
      
      if (clientData.expectedVolume && clientData.expectedVolume !== 'Not provided') {
        clientFields += `
          <div class="review-detail">
            <span class="detail-label">Expected Volume:</span>
            <span class="detail-value">${clientData.expectedVolume}</span>
          </div>
        `;
      }
    }
    
    // If no real data found, show minimal info
    if (!clientFields) {
      clientFields = `
        <div class="review-detail">
          <span class="detail-label">Request Type:</span>
          <span class="detail-value">${this.getRequestTypeLabel(requestType)}</span>
        </div>
        <div class="review-detail">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${clientData.email || 'Not provided'}</span>
        </div>
      `;
    }
    
    container.innerHTML = clientFields;
  }
  
  getRequestTypeLabel(requestType) {
    const labels = {
      'quotation': 'Quotation Request',
      'sample-request': 'Sample Request', 
      'bulk-order-request': 'Bulk Order Request'
    };
    return labels[requestType] || 'Unknown Request';
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

    container.innerHTML = files.map(file => {
      // Handle different file object structures
      const fileName = file.name || file.fileName || 'Unknown file';
      const fileSize = file.size || file.fileSize || 0;
      
      return `
        <div class="file-item">
          <div class="file-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>
          </div>
          <div class="file-details">
            <span class="file-name">${fileName}</span>
            ${fileSize > 0 ? `<span class="file-size">(${this.formatFileSize(fileSize)})</span>` : ''}
          </div>
        </div>
      `;
    }).join('');
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

    const requestType = V10_State.requestType;
    const garments = Array.from(V10_State.garments.values());
    
    if (garments.length === 0) {
      container.innerHTML = `
        <div class="v10-empty-state">
          <p>No garments configured</p>
        </div>
      `;
      return;
    }
    
    // Handle bulk order request differently - show each colorway as separate item
    if (requestType === 'bulk-order-request') {
      // Get quantity data from V10_QuantityStudioManager
      const quantityData = window.v10QuantityStudio?.garments || new Map();
      
      // Create array of garment-colorway combinations
      const garmentColorways = [];
      let itemNumber = 1;
      
      // Sort garments by their number property first
      garments.sort((a, b) => a.number - b.number);
      
      garments.forEach(garment => {
        const qData = quantityData.get(garment.id);
        if (qData && qData.colorways && qData.colorways.size > 0) {
          // Add each colorway as a separate item
          qData.colorways.forEach((colorway, colorwayId) => {
            garmentColorways.push({
              number: itemNumber++,
              garment: garment,
              colorway: colorway,
              colorwayId: colorwayId
            });
          });
        } else {
          // If no colorways, show garment without quantities
          garmentColorways.push({
            number: itemNumber++,
            garment: garment,
            colorway: null,
            colorwayId: null
          });
        }
      });
      
      // Render each garment-colorway as separate item
      container.innerHTML = garmentColorways.map(item => this.renderBulkOrderGarment(item)).join('');
      return;
    }
    
    // Sort garments by their number property to ensure proper order
    garments.sort((a, b) => a.number - b.number);

    container.innerHTML = garments.map(garment => {
      // Get color display
      const colorDisplay = this.getGarmentColorDisplay(garment);
      
      // Create simple garment display: Color Circle + "Name - Fabric - Color/Pantone"
      return `
        <div class="v10-garment-item">
          <div class="v10-garment-color" style="background-color: ${colorDisplay.color}; ${colorDisplay.overlay || ''}">
            <!-- Color pattern overlay -->
          </div>
          <div class="v10-garment-text">
            ${garment.number}. ${garment.type} - ${garment.fabricType}${colorDisplay.name ? ' - ' + colorDisplay.name : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  getGarmentColorInfo(garment) {
    // Get color information for cost summary format
    let colorInfo = '';
    
    if (garment.sampleType === 'stock' && garment.sampleSubValue) {
      // Stock sample with specific color - use the selected color name directly
      colorInfo = ` - ${garment.sampleSubValue}`;
    } else if (garment.sampleType === 'custom' && garment.assignedLabDips && garment.assignedLabDips.size > 0) {
      // Custom sample with lab dips
      const firstLabDipId = Array.from(garment.assignedLabDips)[0];
      const labDip = V10_State.labDips.get(firstLabDipId);
      if (labDip) {
        const colorName = labDip.pantone || labDip.name || 'Custom Color';
        const tcxCode = labDip.tcx || '';
        colorInfo = ` - ${colorName}${tcxCode ? ' - ' + tcxCode : ''}`;
      }
    }
    
    return colorInfo;
  }

  getGarmentColorDisplay(garment) {
    const requestType = V10_State.requestType;
    
    // Default display
    let colorDisplay = {
      color: '#e5e5e5',
      name: '',
      overlay: ''
    };
    
    if (requestType === 'quotation') {
      // Use multi-colored gradient for quotations instead of default gray
      colorDisplay.color = 'transparent';
      colorDisplay.overlay = 'background: conic-gradient(#ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #ff6b6b); border: 1px solid #9ca3af;';
      colorDisplay.name = 'Standard Configuration';
    } else if (requestType === 'sample-request' && garment.sampleType) {
      if (garment.sampleType === 'stock' && garment.sampleSubValue) {
        // Stock color samples with proper patterns matching Step 3
        if (garment.sampleSubValue === 'proximate') {
          // Multi-color gradient for "most proximate color" 
          colorDisplay.color = 'transparent'; // Base will be overridden by background
          colorDisplay.overlay = 'background: conic-gradient(#ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #ff6b6b); border: 1px solid #9ca3af;';
          colorDisplay.name = 'Proximate Color';
        } else {
          const stockColors = {
            'black': { color: '#000000', name: 'Black' },
            'white': { color: '#ffffff', name: 'White', border: '2px solid #d1d5db' },
            'gray': { color: '#6b7280', name: 'Gray' },
            'navy': { color: '#1e3a8a', name: 'Navy' },
            'red': { color: '#dc2626', name: 'Red' },
            'green': { color: '#16a34a', name: 'Green' }
          };
          
          const stockColor = stockColors[garment.sampleSubValue] || { color: '#e5e5e5', name: garment.sampleSubValue };
          colorDisplay.color = stockColor.color;
          colorDisplay.name = stockColor.name;
          
          if (stockColor.border) {
            colorDisplay.overlay = `border: ${stockColor.border};`;
          }
        }
        
      } else if (garment.sampleType === 'custom') {
        // Custom color samples
        if (garment.sampleSubValue === 'exact-pantone') {
          // TCX/TPX Pantone - diagonal gradient pattern matching Step 3
          colorDisplay.color = 'transparent';
          colorDisplay.overlay = 'background: linear-gradient(45deg, #ec4899, #8b5cf6); border: 1px solid #9ca3af;';
          colorDisplay.name = 'TCX/TPX Pantone';
        } else if (garment.assignedLabDips?.size > 0) {
          // Lab dip assigned colors
          const labDipIds = Array.from(garment.assignedLabDips);
          
          if (labDipIds.length === 1) {
            // Single color
            const labDip = V10_State.labDips.get(labDipIds[0]);
            if (labDip) {
              colorDisplay.color = labDip.hex || '#e5e5e5';
              colorDisplay.name = labDip.pantone || 'Custom Color';
            }
          } else if (labDipIds.length > 1) {
            // Multiple colors - create gradient using CSS background
            const colors = labDipIds.map(id => {
              const labDip = V10_State.labDips.get(id);
              return labDip?.hex || '#e5e5e5';
            });
            
            // Create gradient overlay
            const gradientStops = colors.map((color, index) => {
              const percent = (index / (colors.length - 1)) * 100;
              return `${color} ${percent}%`;
            }).join(', ');
            
            colorDisplay.color = 'transparent';
            colorDisplay.overlay = `background: linear-gradient(45deg, ${gradientStops});`;
            colorDisplay.name = `${colors.length} Colors`;
          }
        } else {
          // Generic custom color
          colorDisplay.color = '#8b5cf6';
          colorDisplay.name = 'Custom Color';
        }
      }
    }
    
    return colorDisplay;
  }

  getSampleTypeDisplayText(garment) {
    const requestType = V10_State.requestType;
    
    if (requestType === 'sample-request' && garment.sampleType) {
      if (garment.sampleType === 'stock') {
        return `Stock Color (${garment.sampleSubValue || 'Not selected'})`;
      } else if (garment.sampleType === 'custom') {
        const labDipCount = garment.assignedLabDips?.size || 0;
        return `Custom Color (${labDipCount} lab dip${labDipCount !== 1 ? 's' : ''})`;
      }
    }
    
    return requestType === 'bulk-order-request' ? 'Production ready' : 'Standard';
  }

  updateEnhancedColorDisplay(garment, colorCircle, colorOverlay, colorNameText) {
    if (!colorCircle || !colorNameText) return;
    
    const requestType = V10_State.requestType;
    
    // Reset styles
    colorCircle.style.background = '';
    colorCircle.style.backgroundColor = '#e5e5e5';
    colorOverlay.style.display = 'none';
    
    if (requestType === 'sample-request' && garment.sampleType) {
      if (garment.sampleType === 'stock' && garment.sampleSubValue) {
        // Stock color samples
        const stockColors = {
          'black': { color: '#000000', name: 'Black' },
          'white': { color: '#ffffff', name: 'White' },
          'gray': { color: '#6b7280', name: 'Gray' },
          'navy': { color: '#1e3a8a', name: 'Navy' },
          'red': { color: '#dc2626', name: 'Red' },
          'green': { color: '#16a34a', name: 'Green' }
        };
        
        const colorData = stockColors[garment.sampleSubValue] || { color: '#e5e5e5', name: garment.sampleSubValue };
        colorCircle.style.backgroundColor = colorData.color;
        colorNameText.textContent = colorData.name;
        
      } else if (garment.sampleType === 'custom' && garment.assignedLabDips?.size > 0) {
        // Custom color samples from lab dips
        const labDipIds = Array.from(garment.assignedLabDips);
        
        if (labDipIds.length === 1) {
          // Single color
          const labDip = V10_State.labDips.get(labDipIds[0]);
          if (labDip) {
            colorCircle.style.backgroundColor = labDip.hex || '#e5e5e5';
            colorNameText.textContent = labDip.pantone || 'Custom Color';
          }
        } else if (labDipIds.length > 1) {
          // Multiple colors - create gradient
          const colors = labDipIds.map(id => {
            const labDip = V10_State.labDips.get(id);
            return labDip?.hex || '#e5e5e5';
          });
          
          const gradientStops = colors.map((color, index) => {
            const percent = (index / (colors.length - 1)) * 100;
            return `${color} ${percent}%`;
          }).join(', ');
          
          colorCircle.style.background = `linear-gradient(45deg, ${gradientStops})`;
          colorNameText.textContent = `${colors.length} Colors`;
        }
      }
    } else {
      // Default for quotations and bulk orders
      colorNameText.textContent = 'Standard';
    }
  }

  updateGarmentStatus(garment, statusIndicator) {
    if (!statusIndicator) return;
    
    const isComplete = this.isGarmentComplete(garment, V10_State.requestType);
    
    if (isComplete) {
      statusIndicator.className = 'v10-status-indicator v10-status--complete';
      statusIndicator.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20,6 9,17 4,12"/>
        </svg>
        Complete
      `;
    } else {
      statusIndicator.className = 'v10-status-indicator v10-status--incomplete';
      statusIndicator.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        Incomplete
      `;
    }
  }

  populateGarmentSpecificContent(clone, garment, requestType) {
    const assignmentsSection = clone.querySelector('.v10-garment-assignments');
    const assignmentsList = clone.querySelector('.v10-assignments-list');
    const sizesSection = clone.querySelector('.v10-spec-item--full');
    const sizeChips = clone.querySelector('.v10-size-chips');
    
    if (requestType === 'sample-request') {
      // Show assignments for sample requests
      const assignments = this.getGarmentAssignments(garment);
      
      if (assignments.length > 0 && assignmentsSection && assignmentsList) {
        assignmentsSection.style.display = 'block';
        assignmentsList.innerHTML = assignments.map(assignment => `
          <div class="v10-assignment-chip">
            <span class="v10-assignment-icon">${assignment.icon}</span>
            <span class="v10-assignment-text">${assignment.text}</span>
          </div>
        `).join('');
      }
      
    } else if (requestType === 'bulk-order-request') {
      // Show size distribution for bulk orders
      if (garment.quantities && sizesSection && sizeChips) {
        const sizes = Object.entries(garment.quantities).filter(([size, qty]) => qty > 0);
        
        if (sizes.length > 0) {
          sizesSection.style.display = 'block';
          sizeChips.innerHTML = sizes.map(([size, qty]) => `
            <div class="v10-size-chip">
              <span class="v10-size-label">${size}</span>
              <span class="v10-size-qty">${qty}</span>
            </div>
          `).join('');
        }
      }
    }
  }

  getGarmentAssignments(garment) {
    const assignments = [];
    
    // Lab dip assignments
    if (garment.assignedLabDips?.size > 0) {
      const labDipCount = garment.assignedLabDips.size;
      assignments.push({
        icon: '🎨',
        text: `${labDipCount} Lab Dip${labDipCount > 1 ? 's' : ''}`
      });
    }
    
    // Design assignments  
    if (garment.assignedDesigns?.size > 0) {
      const designCount = garment.assignedDesigns.size;
      assignments.push({
        icon: '⭐',
        text: `${designCount} Design${designCount > 1 ? 's' : ''}`
      });
    }
    
    return assignments;
  }

  // Enhanced garment population completed above

  buildFullGarmentName(garment) {
    // Build full garment name like: "Hoodie with Design (pedro) - 18-1664 TPX 100% Organic Cotton Brushed Fleece"
    const clientData = this.getClientData();
    const clientName = clientData.name || clientData.firstName || 'Client';
    
    let name = garment.type || 'Unknown Garment';
    
    // Add assigned items info
    const hasLabDips = garment.assignedLabDips && garment.assignedLabDips.size > 0;
    const hasDesigns = garment.assignedDesigns && garment.assignedDesigns.size > 0;
    
    if (hasDesigns) {
      name += ' with Design';
    }
    
    // Add client name
    name += ` (${clientName})`;
    
    // Add lab dip info and fabric type
    if (hasLabDips) {
      const firstLabDipId = Array.from(garment.assignedLabDips)[0];
      const labDip = V10_State.labDips.get(firstLabDipId);
      if (labDip && labDip.pantone) {
        name += ` - ${labDip.pantone}`;
      }
    }
    
    if (garment.fabricType) {
      name += ` ${garment.fabricType}`;
    }
    
    return name;
  }

  buildGarmentDetails(garment) {
    const requestType = V10_State.requestType;
    let details = '';

    // Sample type (for sample requests) - this is the main detail to show
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
      if (garment.assignedLabDips && garment.assignedLabDips.size > 0) {
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
      if (garment.assignedDesigns && garment.assignedDesigns.size > 0) {
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

  renderBulkOrderGarment(item) {
    const { number, garment, colorway } = item;
    const hasQuantities = colorway && colorway.quantities;
    
    // Build size display HTML with responsive layout
    let quantityHTML = '';
    if (hasQuantities) {
      const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
      const sizeItems = sizes.map(size => {
        const qty = colorway.quantities[size] || 0;
        if (qty > 0) {
          return `<div class="v10-size-chip">${size}: ${qty}</div>`;
        }
        return '';
      }).filter(item => item);
      
      // Count active sizes for responsive layout
      const activeSizeCount = sizeItems.length;
      
      quantityHTML = `
        <div class="v10-quantity-display">
          <div class="v10-size-chips" data-size-count="${activeSizeCount}">
            ${sizeItems.join('')}
          </div>
        </div>
      `;
    }
    
    // Determine production type and design info
    const isDesignApplied = colorway?.designReference || garment.designReference;
    const productionType = isDesignApplied ? "Design Applied" : "Blank";
    const designName = colorway?.designReference || garment.designReference || '';
    
    // Format garment display text
    const garmentType = garment.type || 'Garment';
    const colorName = colorway ? colorway.name : '';
    
    // FIXED: Single color source - use colorway name OR code, not both
    const colorDisplay = colorway ? (colorName || colorway.code || colorway.pantone || '') : '';
    
    // Calculate total units for header display
    const totalUnits = hasQuantities ? (colorway.subtotal || 0) : 0;
    
    return `
      <div class="v10-review-garment-item">
        <div class="v10-garment-header">
          ${colorway ? `
            <div class="v10-garment-color-swatch" style="background-color: ${colorway.color || colorway.hex || '#666666'}; border: 2px solid rgba(255,255,255,0.3); display: block;"></div>
          ` : ''}
          <div class="v10-garment-info">
            <div class="v10-garment-header-row">
              <div class="v10-garment-title-section">
                <span class="v10-garment-number">${number}.</span>
                <span class="v10-garment-type">${garmentType}</span>
                <span class="v10-garment-separator">-</span>
                <span class="v10-garment-production">${productionType}</span>
                ${designName ? `
                  <span class="v10-garment-separator">-</span>
                  <span class="v10-design-name">${designName}</span>
                ` : ''}
                ${colorDisplay ? `
                  <span class="v10-garment-separator">-</span>
                  <span class="v10-color-name">${colorDisplay}</span>
                ` : ''}
              </div>
              ${totalUnits > 0 ? `
                <div class="v10-garment-total-section">
                  <span class="v10-garment-total">${totalUnits}</span>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
        ${quantityHTML}
      </div>
    `;
  }

  populateLabDips() {
    const standaloneContainer = document.getElementById('review-labdips-standalone');
    const labDipsSection = document.querySelector('#review-labdips-section, .v10-studio-card:has(#review-labdips-standalone)');
    
    // Hide entire section for quotations
    if (V10_State.requestType === 'quotation') {
      if (labDipsSection) {
        labDipsSection.style.display = 'none';
      }
      return;
    }
    
    // Show section for non-quotation requests
    if (labDipsSection) {
      labDipsSection.style.display = 'block';
    }
    
    if (!standaloneContainer) return;

    const labDips = Array.from(V10_State.labDips.values());
    const standaloneLabDips = [];

    labDips.forEach(labDip => {
      const assignments = V10_State.assignments.labDips.get(labDip.id);
      if (!assignments || assignments.size === 0) {
        standaloneLabDips.push(labDip);
      }
    });

    // Render fabric swatches using simple inline HTML (matching garment specs format)
    if (standaloneLabDips.length === 0) {
      standaloneContainer.innerHTML = `
        <div class="v10-empty-state v10-empty-state--small">
          <div class="v10-empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6"/>
            </svg>
          </div>
          <p class="v10-empty-message">No fabric swatches available</p>
        </div>
      `;
    } else {
      // Use garment display format with proper color circles
      standaloneContainer.innerHTML = standaloneLabDips.map(labDip => {
        const colorHex = labDip.hex || '#ccc';
        const colorName = labDip.pantone || labDip.name || 'Custom Color';
        const tcxCode = labDip.tcx ? ` - ${labDip.tcx}` : '';
        
        return `
          <div class="v10-garment-item">
            <div class="v10-garment-color" style="background-color: ${colorHex}">
              <!-- Color circle for fabric swatch -->
            </div>
            <div class="v10-garment-text">
              ${colorName}${tcxCode}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  getLabDipAssignmentText(labDipId) {
    console.log(`🎯 getLabDipAssignmentText called for lab dip: ${labDipId}`);
    console.log(`🎯 All assignments state:`, V10_State.assignments.labDips);
    const assignments = V10_State.assignments.labDips.get(labDipId);
    console.log(`🔍 getLabDipAssignmentText for ${labDipId}:`, assignments);
    
    if (!assignments || assignments.size === 0) {
      console.log(`❌ No assignments for lab dip ${labDipId} - returning LAB DIP`);
      return 'LAB DIP';
    }
    
    const assignedGarmentNames = [];
    assignments.forEach(garmentId => {
      const garment = V10_State.garments.get(garmentId);
      console.log(`🔍 Checking garment ${garmentId}:`, garment);
      if (garment) {
        const garmentType = garment.type || 'Unknown';
        const garmentName = `Garment ${garment.number} ${garmentType}`;
        console.log(`🔍 Adding garment name: ${garmentName}`);
        assignedGarmentNames.push(garmentName);
      } else {
        console.log(`❌ Garment ${garmentId} not found in V10_State.garments`);
      }
    });
    
    const result = assignedGarmentNames.length > 0 ? assignedGarmentNames.join(', ') : 'LAB DIP';
    console.log(`✅ Final assignment text for ${labDipId}: "${result}"`);
    console.log(`✅ Assigned garment names array:`, assignedGarmentNames);
    return result;
  }

  populateGarmentAssignments() {
    const overview = document.getElementById('garment-assignments-overview');
    const grid = document.getElementById('assignments-grid');
    const emptyState = document.getElementById('assignments-empty');
    const count = document.getElementById('assignments-count');
    
    if (!overview || !grid || !emptyState || !count) return;
    
    // Only show the section in Color Studio (design studio) AND in Lab Dips mode
    if (V10_State.currentStudio !== 'design' || V10_State.currentMode !== 'labdips') {
      overview.style.display = 'none';
      return;
    }
    
    const assignments = this.getGarmentAssignments();
    
    // Show the section when in Color Studio Lab Dips mode
    overview.style.display = 'block';
    count.textContent = `${assignments.length} assignment${assignments.length !== 1 ? 's' : ''}`;
    
    if (assignments.length === 0) {
      grid.style.display = 'none';
      emptyState.style.display = 'block';
    } else {
      grid.style.display = 'grid';
      emptyState.style.display = 'none';
      
      grid.innerHTML = assignments.map(assignment => `
        <div class="assignment-item">
          <div class="assignment-item__garment">
            <span class="assignment-item__garment-name">${assignment.garmentName}</span>
            <span class="assignment-item__garment-type">${assignment.garmentType}</span>
          </div>
          <div class="assignment-item__colors">
            ${assignment.colors.map(color => {
              let backgroundStyle;
              if (color.isCustomTextCode) {
                // Use gradient for custom text codes
                backgroundStyle = 'background: conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #ff6b6b); border: 2px solid #8B5CF6;';
              } else {
                backgroundStyle = `background-color: ${color.hex || '#ccc'};`;
              }
              
              return `
                <div class="assignment-item__color-chip" 
                     style="${backgroundStyle}" 
                     data-color-name="${color.name}"
                     title="${color.name}">
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `).join('');
    }
  }
  
  getGarmentAssignments() {
    const assignments = [];
    
    // Check all garments for assigned colors
    V10_State.garments.forEach((garment, garmentId) => {
      const assignedColors = [];
      
      // Check lab dip assignments
      V10_State.assignments.labDips.forEach((garmentIds, labDipId) => {
        if (garmentIds.has(garmentId)) {
          const labDip = V10_State.labDips.get(labDipId);
          if (labDip) {
            // Check if this is a custom text-only code that should show gradient
            const isCustomTextCode = labDip.isCustomCode && labDip.hex === '#8B5CF6';
            
            assignedColors.push({
              name: labDip.pantone,
              hex: labDip.hex,
              type: 'lab-dip',
              isCustomTextCode: isCustomTextCode
            });
          }
        }
      });
      
      // Design assignments are hidden from colorway section
      // Only lab dips are shown in "Garments with colorways assigned"
      
      if (assignedColors.length > 0) {
        assignments.push({
          garmentId: garmentId,
          garmentName: `Garment ${garment.number}`,
          garmentType: garment.type || 'Unknown',
          colors: assignedColors
        });
      }
    });
    
    return assignments;
  }

  populateDesigns() {
    const standaloneContainer = document.getElementById('review-designs-standalone');
    const designsSection = document.querySelector('#review-designs-section, .v10-studio-card:has(#review-designs-standalone)');
    
    // Hide entire section for quotations
    if (V10_State.requestType === 'quotation') {
      if (designsSection) {
        designsSection.style.display = 'none';
      }
      return;
    }
    
    // Show section for non-quotation requests
    if (designsSection) {
      designsSection.style.display = 'block';
    }
    
    if (!standaloneContainer) return;

    const designs = Array.from(V10_State.designSamples.values());
    const standaloneDesigns = [];

    designs.forEach(design => {
      const assignments = V10_State.assignments.designs.get(design.id);
      if (!assignments || assignments.size === 0) {
        standaloneDesigns.push(design);
      }
    });

    // Render enhanced designs using new template
    if (standaloneDesigns.length === 0) {
      standaloneContainer.innerHTML = `
        <div class="v10-empty-state v10-empty-state--small">
          <div class="v10-empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <p class="v10-empty-message">No design samples available</p>
        </div>
      `;
    } else {
      const template = document.getElementById('review-design-template');
      if (template) {
        standaloneContainer.innerHTML = '';
        
        standaloneDesigns.forEach(design => {
          const clone = template.content.cloneNode(true);
          
          const nameElement = clone.querySelector('.v10-design-name');
          const typeElement = clone.querySelector('.v10-design-type');
          const assignmentElement = clone.querySelector('.v10-design-assignment');
          const costElement = clone.querySelector('.v10-design-cost');
          
          if (nameElement) nameElement.textContent = design.name || 'Design Sample';
          if (typeElement) typeElement.textContent = design.type || 'Print';
          if (assignmentElement) assignmentElement.textContent = this.getDesignAssignmentText(design.id);
          if (costElement) costElement.textContent = '€15';
          
          standaloneContainer.appendChild(clone);
        });
      }
    }
  }

  getDesignAssignmentText(designId) {
    const assignments = V10_State.assignments.designs.get(designId);
    
    if (!assignments || assignments.size === 0) {
      return 'Standalone design';
    }
    
    const assignedGarmentNames = [];
    assignments.forEach(garmentId => {
      const garment = V10_State.garments.get(garmentId);
      if (garment) {
        assignedGarmentNames.push(`Garment ${garment.number}`);
      }
    });
    
    return `Assigned to ${assignedGarmentNames.join(', ')}`;
  }

  populateCostSummary() {
    const breakdownContainer = document.getElementById('cost-breakdown');
    const totalCostElement = document.getElementById('total-cost');
    const disclaimerElement = document.getElementById('pricing-disclaimer');
    
    if (!breakdownContainer || !totalCostElement) return;

    const costs = this.calculateCosts();
    const currentCurrency = this.getCurrentCurrency();
    const requestType = V10_State.requestType;
    let html = '';

    // Regular cost breakdown for samples, quotations, and bulk orders
      costs.items.forEach(item => {
        const amount = typeof item.amount === 'string' ? item.amount : this.formatCurrencyWithToggle(item.amount, currentCurrency);
        const description = item.description;
        
        // Generate color circle for garment items
        let colorCircleHtml = '';
        if (item.garment) {
          const colorDisplay = this.getGarmentColorDisplay(item.garment);
          colorCircleHtml = `
            <div class="v10-garment-color" style="background-color: ${colorDisplay.color}; ${colorDisplay.overlay || ''}">
              <!-- Color pattern overlay -->
            </div>
          `;
        }
        
        html += `
          <div class="v10-cost-item">
            <div class="v10-cost-info">
              ${colorCircleHtml}
              <div class="v10-cost-details">
                <div class="v10-cost-label">${item.label}</div>
                <div class="v10-cost-description">${description}</div>
              </div>
            </div>
            <div class="v10-cost-amount">${amount}</div>
          </div>
        `;
      });

      totalCostElement.textContent = this.formatCurrencyWithToggle(costs.total, currentCurrency);
      
      if (disclaimerElement) {
        const disclaimers = {
          'sample-request': 'Final pricing may vary based on final specifications',
          'quotation': 'Pricing estimates based on standard configurations',
          'bulk-order-request': 'Volume discounts may apply for larger orders'
        };
        disclaimerElement.textContent = disclaimers[requestType] || 'Pricing subject to final specifications';
      }

    breakdownContainer.innerHTML = html;
    
    // Initialize enhanced currency toggle
    this.initializeEnhancedCurrencyToggle();
  }

  initializeEnhancedCurrencyToggle() {
    const currencyBtns = document.querySelectorAll('.v10-currency-btn');
    const currentCurrency = this.getCurrentCurrency();
    
    // Set initial state
    this.updateEnhancedCurrencyToggle(currentCurrency);
    
    // Bind click events
    currencyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const newCurrency = btn.dataset.currency;
        this.setCurrency(newCurrency);
      });
    });
  }

  updateEnhancedCurrencyToggle(activeCurrency) {
    const currencyBtns = document.querySelectorAll('.v10-currency-btn');
    
    currencyBtns.forEach(btn => {
      const isActive = btn.dataset.currency === activeCurrency;
      
      if (isActive) {
        btn.classList.add('v10-currency-btn--active');
        btn.classList.remove('v10-currency-btn--inactive');
      } else {
        btn.classList.remove('v10-currency-btn--active');
        btn.classList.add('v10-currency-btn--inactive');
      }
    });
  }

  setCurrency(currency) {
    try {
      sessionStorage.setItem('v10_currency', currency);
    } catch (error) {
      console.warn('Could not save currency preference:', error);
    }
    
    this.updateEnhancedCurrencyToggle(currency);
    this.populateCostSummary();
    this.populateStatistics(); // Update the summary statistics as well
  }

  calculateCosts() {
    const requestType = V10_State.requestType;
    const items = [];
    let total = 0;

    if (requestType === 'sample-request' || requestType === 'quotation') {
      const garments = Array.from(V10_State.garments.values());
      
      // Sample costs
      garments.forEach(garment => {
        if (requestType === 'quotation') {
          // For quotations: show estimated pricing based on standard stock sample
          const dynamicPrice = V10_Utils.calculateDynamicPrice(
            garment.type, 
            garment.fabricType, 
            'stock'
          ) || V10_CONFIG.PRICING.STOCK_SAMPLE;
          
          items.push({
            label: `Garment ${garment.number} - Pricing Estimate`,
            description: `${garment.type} ${garment.fabricType}`,
            fullDescription: `Garment ${garment.number} - ${garment.type} ${garment.fabricType}`,
            amount: dynamicPrice,
            garment: garment // Add garment data for color circles
          });
          total += dynamicPrice;
        } else if (garment.sampleType === 'stock') {
          // Calculate dynamic price based on garment and fabric type
          const dynamicPrice = V10_Utils.calculateDynamicPrice(
            garment.type, 
            garment.fabricType, 
            'stock'
          ) || V10_CONFIG.PRICING.STOCK_SAMPLE;
          
          // Get color information for proper description
          const colorInfo = this.getGarmentColorInfo(garment);
          
          items.push({
            label: `Garment ${garment.number} - Stock Sample`,
            description: `${garment.type} ${garment.fabricType || 'Standard'}${colorInfo}`,
            fullDescription: `Garment ${garment.number} - ${garment.type} ${garment.fabricType}${colorInfo}`,
            amount: dynamicPrice,
            garment: garment // Add garment data for color circles
          });
          total += dynamicPrice;
        } else if (garment.sampleType === 'custom') {
          // Calculate dynamic price based on garment and fabric type
          const dynamicPrice = V10_Utils.calculateDynamicPrice(
            garment.type, 
            garment.fabricType, 
            'custom'
          ) || V10_CONFIG.PRICING.CUSTOM_SAMPLE;
          
          // Get color information for proper description
          const colorInfo = this.getGarmentColorInfo(garment);
          
          items.push({
            label: `Garment ${garment.number} - Custom Sample`,
            description: `${garment.type} ${garment.fabricType || 'Standard'}${colorInfo}`,
            fullDescription: `Garment ${garment.number} - ${garment.type} ${garment.fabricType}${colorInfo}`,
            amount: dynamicPrice,
            garment: garment // Add garment data for color circles
          });
          total += dynamicPrice;
        }
      });

      // Lab dip costs - only count standalone lab dips (not assigned to garments)
      const labDips = Array.from(V10_State.labDips.values());
      const standaloneLabDips = [];
      
      labDips.forEach(labDip => {
        const assignments = V10_State.assignments.labDips.get(labDip.id);
        if (!assignments || assignments.size === 0) {
          standaloneLabDips.push(labDip);
        }
      });
      
      const standaloneLabDipCount = standaloneLabDips.length;
      if (standaloneLabDipCount > 0) {
        items.push({
          label: 'Lab Dip Swatches',
          description: `${standaloneLabDipCount} color${standaloneLabDipCount > 1 ? 's' : ''}`,
          amount: standaloneLabDipCount * V10_CONFIG.PRICING.LAB_DIP
        });
        total += standaloneLabDipCount * V10_CONFIG.PRICING.LAB_DIP;
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
    
    // Update new enhanced sections
    const samplesSection = document.getElementById('review-samples-section');
    const quantitiesSection = document.getElementById('review-quantities-section');

    // Show samples section (contains both fabric swatches and design applications) for sample requests
    if (samplesSection) {
      samplesSection.style.display = requestType === 'sample-request' ? 'block' : 'none';
    }

    if (quantitiesSection) {
      quantitiesSection.style.display = requestType === 'bulk-order-request' ? 'block' : 'none';
    }
    
    // Hide unnecessary sections for bulk orders
    if (requestType === 'bulk-order-request') {
      // Hide Fabric Swatches section
      const fabricSwatchesSection = document.querySelector('.v10-studio-card:has(#review-labdips-standalone), #review-labdips-section');
      if (fabricSwatchesSection) fabricSwatchesSection.style.display = 'none';
      
      // Hide Design Applications section
      const designSection = document.querySelector('.v10-studio-card:has(#review-designs), #review-designs-section');
      if (designSection) designSection.style.display = 'none';
      
      // Hide Cost Summary section completely for bulk orders
      const costSection = document.querySelector('.v10-studio-card:has(#cost-breakdown), #review-cost-section');
      if (costSection) costSection.style.display = 'none';
      
      // Hide empty Production Quantities section
      const productionSection = document.querySelector('.v10-studio-card:has(#review-quantities-section), #review-quantities-section');
      if (productionSection) productionSection.style.display = 'none';
    }
  }

  updateSubmitMessage() {
    const messageContainer = document.getElementById('submit-message');
    if (!messageContainer) return;

    const requestType = V10_State.requestType;
    const messages = {
      'quotation': `
        <h4 class="v10-submit-message-title">Ready to Request Quotation</h4>
        <p class="v10-submit-message-text">Your specifications will be reviewed and you'll receive a detailed price quote within 24-48 hours. No payment is required at this stage.</p>
        <div class="v10-submit-timeline">
          <span class="v10-timeline-item">📋 Review: 2-4 hours</span>
          <span class="v10-timeline-item">📧 Quote: 24-48 hours</span>
        </div>
      `,
      'sample-request': `
        <h4 class="v10-submit-message-title">Ready to Order Samples</h4>
        <p class="v10-submit-message-text">Your samples will be produced and shipped within the specified timeframes. Payment will be processed after submission.</p>
        <div class="v10-submit-timeline">
          <span class="v10-timeline-item">⚡ Processing: 1-2 hours</span>
          <span class="v10-timeline-item">🏭 Production: 7-14 days</span>
          <span class="v10-timeline-item">📦 Shipping: 3-5 days</span>
        </div>
      `,
      'bulk-order-request': `
        <h4 class="v10-submit-message-title">Ready to Place Bulk Order</h4>
        <p class="v10-submit-message-text">Your production order will be reviewed and confirmed. A 50% deposit will be required to begin production.</p>
        <div class="v10-submit-timeline">
          <span class="v10-timeline-item">📋 Review: 24-48 hours</span>
          <span class="v10-timeline-item">💰 Deposit: Upon approval</span>
          <span class="v10-timeline-item">🏭 Production: 15-30 days</span>
        </div>
      `
    };

    messageContainer.innerHTML = messages[requestType] || messages['quotation'];
  }

  updateSubmitButton() {
    const submitBtn = document.getElementById('submit-request-btn');
    const termsCheckbox = document.getElementById('terms-agreement');
    
    if (!submitBtn || !termsCheckbox) return;
    
    // Enable/disable based on terms agreement only (validation should be done in previous steps)
    const termsAgreed = termsCheckbox.checked;
    const isEnabled = termsAgreed;
    
    submitBtn.disabled = !isEnabled;
    
    if (isEnabled) {
      submitBtn.classList.remove('v10-btn--disabled');
      submitBtn.classList.add('v10-btn--ready');
    } else {
      submitBtn.classList.add('v10-btn--disabled');
      submitBtn.classList.remove('v10-btn--ready');
    }
    
    // Update button text based on terms agreement
    const buttonText = submitBtn.querySelector('span');
    if (buttonText) {
      if (!termsAgreed) {
        buttonText.textContent = 'Accept Terms to Continue';
      } else {
        const requestType = V10_State.requestType;
        const buttonTexts = {
          'quotation': 'Request Quote',
          'sample-request': 'Order Samples',
          'bulk-order-request': 'Place Order'
        };
        buttonText.textContent = buttonTexts[requestType] || 'Submit Request';
      }
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
    // Try to get from Step 1 client manager first
    if (window.v10ClientManager) {
      const realClientData = window.v10ClientManager.getClientData();
      if (realClientData && Object.keys(realClientData).length > 0) {
        // For quotations and bulk orders, use company name as the display name if no personal name
        const personalName = realClientData.firstName || realClientData.name || realClientData.Name;
        const companyName = realClientData.company || realClientData.Company || realClientData.company_name;
        const displayName = personalName || companyName || 'Not provided';
        
        return {
          company: companyName || 'Not provided',
          name: displayName,
          email: realClientData.email || realClientData.Email || 'Not provided',
          phone: realClientData.phone || realClientData.Phone || 'Not provided',
          businessType: realClientData.businessType || realClientData.BusinessType || 'Not provided',
          expectedVolume: realClientData.expectedVolume || realClientData.ExpectedVolume || 'Not provided',
          deliveryType: realClientData.deliveryType || realClientData.DeliveryType || 'Not provided',
          address: realClientData.address || realClientData.Address || 'Not provided',
          shippingMethod: realClientData.shippingMethod || realClientData.ShippingMethod || 'Not provided',
          insurance: realClientData.insurance || realClientData.Insurance || 'Not provided'
        };
      }
    }
    
    // Try to get from Step 1 form inputs as fallback
    const clientData = {};
    
    // Basic fields
    const companyInput = document.querySelector('input[name="company_name"], input[name="company"], #company');
    const nameInput = document.querySelector('input[name="deliveryContactName"], input[name="firstName"], input[name="name"], #firstName');
    const emailInput = document.querySelector('input[name="email"], #email');
    const phoneInput = document.querySelector('input[name="deliveryPhone"], input[name="phone"], #phone');
    
    // Address fields
    const deliveryAddressRadio = document.querySelector('input[name="deliveryAddress"]:checked');
    const address1Input = document.querySelector('input[name="deliveryAddress1"]');
    const address2Input = document.querySelector('input[name="deliveryAddress2"]');
    const cityInput = document.querySelector('input[name="deliveryCity"]');
    const stateInput = document.querySelector('input[name="deliveryState"]');
    const postalInput = document.querySelector('input[name="deliveryPostal"]');
    
    // Shipping fields (for bulk orders)
    const shippingMethodRadio = document.querySelector('input[name="shippingMethod"]:checked');
    const insuranceRadio = document.querySelector('input[name="insurance"]:checked');
    
    // Collect basic data
    if (companyInput) clientData.company = companyInput.value;
    if (nameInput) clientData.name = nameInput.value;
    if (emailInput) clientData.email = emailInput.value;
    if (phoneInput) clientData.phone = phoneInput.value;
    
    // Collect address data
    if (deliveryAddressRadio) {
      clientData.deliveryType = deliveryAddressRadio.value === 'company' ? 'Company Address' : 'Different Address';
      
      if (deliveryAddressRadio.value === 'different') {
        // Collect full address details for different address
        const addressParts = [];
        if (address1Input?.value) addressParts.push(address1Input.value);
        if (address2Input?.value) addressParts.push(address2Input.value);
        if (cityInput?.value) addressParts.push(cityInput.value);
        if (stateInput?.value) addressParts.push(stateInput.value);
        if (postalInput?.value) addressParts.push(postalInput.value);
        
        if (addressParts.length > 0) {
          clientData.address = addressParts.join(', ');
        }
      }
    }
    
    // Collect shipping info (for bulk orders)
    if (shippingMethodRadio) {
      clientData.shippingMethod = shippingMethodRadio.value === 'air' ? 'Air Freight' : 'Sea Freight';
    }
    if (insuranceRadio) {
      clientData.insurance = insuranceRadio.value === 'yes' ? 'Yes' : 'No';
    }
    
    // Return collected data or defaults
    // Use company name as display name if no personal name (for quotations/bulk orders)
    const displayName = clientData.name || clientData.company || 'Not provided';
    
    return {
      company: clientData.company || 'Not provided',
      name: displayName,
      email: clientData.email || 'office@genuineblanks.com',
      phone: clientData.phone || 'Not provided',
      deliveryType: clientData.deliveryType || 'Not provided',
      address: clientData.address || 'Not provided',
      shippingMethod: clientData.shippingMethod || 'Not provided',
      insurance: clientData.insurance || 'Not provided'
    };
  }

  getUploadedFiles() {
    console.log('🔍 Getting uploaded files for review...');
    
    // Try to get from Step 2 file manager first
    if (window.v10FileManager) {
      console.log('✅ v10FileManager found');
      
      // Try multiple methods to get files from file manager
      let realFiles = [];
      
      if (window.v10FileManager.getUploadedFiles) {
        realFiles = window.v10FileManager.getUploadedFiles();
      } else if (window.v10FileManager.uploadedFiles) {
        realFiles = Array.from(window.v10FileManager.uploadedFiles.values());
      }
      
      if (realFiles && realFiles.length > 0) {
        console.log(`📁 Found ${realFiles.length} files from file manager`);
        return realFiles;
      }
    }
    
    // Try to get from V10_State
    if (V10_State.uploadedFiles && V10_State.uploadedFiles.length > 0) {
      console.log(`📁 Found ${V10_State.uploadedFiles.length} files from V10_State`);
      return V10_State.uploadedFiles;
    }
    
    // Try to get from localStorage/sessionStorage as fallback
    try {
      const storedFiles = localStorage.getItem('v10_uploaded_files') || 
                         sessionStorage.getItem('v10_uploaded_files') ||
                         localStorage.getItem('v10_step2_files');
      if (storedFiles) {
        const parsedFiles = JSON.parse(storedFiles);
        if (parsedFiles && parsedFiles.length > 0) {
          console.log(`📁 Found ${parsedFiles.length} files from storage`);
          return parsedFiles;
        }
      }
    } catch (error) {
      console.warn('Could not parse stored files:', error);
    }
    
    // Try to find files in DOM (from upload zone)
    const uploadedFilesList = document.querySelector('#techpack-v10-uploaded-files .uploaded-files-list');
    if (uploadedFilesList) {
      const fileElements = uploadedFilesList.querySelectorAll('.uploaded-file');
      if (fileElements.length > 0) {
        const domFiles = Array.from(fileElements).map(el => {
          const fileName = el.querySelector('.file-name')?.textContent || 'Unknown file';
          const fileSize = el.querySelector('.file-size')?.textContent || '0 KB';
          return {
            name: fileName,
            size: fileSize.includes('MB') ? parseFloat(fileSize) * 1024 * 1024 : 
                  fileSize.includes('KB') ? parseFloat(fileSize) * 1024 : 0,
            type: fileName.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 
                  fileName.toLowerCase().match(/\.(jpg|jpeg)$/) ? 'image/jpeg' :
                  fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'unknown'
          };
        });
        console.log(`📁 Found ${domFiles.length} files from DOM`);
        return domFiles;
      }
    }
    
    console.log('❌ No uploaded files found');
    return [];
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Currency Toggle Methods
  getCurrentCurrency() {
    return localStorage.getItem('v10-currency') || 'EUR';
  }

  setCurrency(currency) {
    localStorage.setItem('v10-currency', currency);
    this.updateCurrencyToggle(currency);
    this.refreshCostDisplay();
  }

  updateCurrencyToggle(currency) {
    const currencyBtns = document.querySelectorAll('.currency-btn');
    currencyBtns.forEach(btn => {
      if (btn.dataset.currency === currency) {
        btn.classList.add('currency-btn--active');
      } else {
        btn.classList.remove('currency-btn--active');
      }
    });
  }

  refreshCostDisplay() {
    this.populateCostSummary();
  }

  formatCurrencyWithToggle(amount, currency) {
    if (typeof amount === 'string') return amount; // Handle non-numeric amounts like "Contact for pricing"
    
    const exchangeRate = 1.1; // EUR to USD rough conversion (you can make this dynamic)
    
    if (currency === 'USD') {
      const convertedAmount = amount * exchangeRate;
      return `$${convertedAmount.toFixed(2)}`;
    } else {
      return `€${amount.toFixed(2)}`;
    }
  }

  initializeCurrencyToggle() {
    const currencyBtns = document.querySelectorAll('.currency-btn');
    const currentCurrency = this.getCurrentCurrency();
    
    // Set initial state
    this.updateCurrencyToggle(currentCurrency);
    
    // Bind click events
    currencyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const newCurrency = btn.dataset.currency;
        this.setCurrency(newCurrency);
      });
    });
  }

  // Show appropriate color indicators for different sample types in review cards
  showSampleTypeColorForReview(garment, colorCircle, colorNameText) {
    const sampleType = garment.sampleType;
    const sampleSubValue = garment.sampleSubValue;
    
    // Clear any existing background styles first
    colorCircle.style.backgroundColor = '';
    colorCircle.style.background = '';
    colorCircle.style.border = '';
    
    if (sampleType === 'stock') {
      // Stock color samples
      switch (sampleSubValue) {
        case 'black':
          colorCircle.style.backgroundColor = '#000000';
          colorNameText.textContent = 'Black';
          break;
        case 'white':
          colorCircle.style.backgroundColor = '#ffffff';
          colorCircle.style.border = '2px solid #d1d5db';
          colorNameText.textContent = 'White';
          break;
        case 'proximate':
          // For review cards, use a representative multi-color
          colorCircle.style.background = 'conic-gradient(#ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #ff6b6b)';
          colorCircle.style.border = '1px solid #9ca3af';
          colorNameText.textContent = 'Proximate Color';
          break;
        default:
          colorCircle.style.backgroundColor = '#6b7280';
          colorNameText.textContent = 'Stock Color';
          break;
      }
    } else if (sampleType === 'custom') {
      // Custom color samples
      if (sampleSubValue === 'exact-pantone') {
        // I have TCX/TPX pantone in my techpack - Show the SVG icon
        colorCircle.style.backgroundColor = '#f3f4f6';
        colorCircle.style.border = '1px solid #9ca3af';
        colorCircle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" style="color: #6b7280;"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>';
        colorNameText.textContent = 'TCX/TPX Pantone';
      } else {
        // Generic custom (shouldn't reach here for design-studio due to special handling above)
        colorCircle.style.backgroundColor = '#8b5cf6';
        colorNameText.textContent = 'Custom Color';
      }
    } else {
      // Fallback
      colorCircle.style.backgroundColor = '#9ca3af';
      colorNameText.textContent = 'Sample Color';
    }
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
    
    // Make design studio globally accessible for lab dip assignments
    window.v10ColorStudio = this.designStudio;
    
    // Make tour functions globally accessible for testing
    window.tourManualTrigger = () => this.garmentStudio.manualTourTrigger();
    window.debugRedPulse = () => this.garmentStudio.debugTriggerRedPulse();
    window.v10DesignStudio = this.designStudio;
    
    // Make review manager globally accessible for assignments text
    window.v10ReviewManager = this.reviewManager;
    
    // Make quantity functionality accessible via quantityStudio (same as garmentStudio)
    this.quantityStudio = this.garmentStudio;
    
    // Make TechPack system globally accessible for validation
    window.v10TechPackSystem = this;

    // Bind global events
    this.bindGlobalEvents();

    // Set up auto-validation
    this.setupAutoValidation();

    // Check for pending request type reset from modal manager
    if (window.v10PendingRequestTypeReset) {
      const pendingType = window.v10PendingRequestTypeReset;
      console.log(`🔄 Executing pending request type reset for: ${pendingType}`);
      this.setRequestType(pendingType);
      delete window.v10PendingRequestTypeReset;
      console.log(`✅ Pending reset completed for: ${pendingType}`);
    }

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
    // Step 3 Navigation buttons (using actual HTML IDs from section)
    const backBtn = document.getElementById('step-3-prev');
    const nextBtn = document.getElementById('step-3-next');

    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        // CHECK EDIT MODE LOCK - BLOCK NAVIGATION IF LOCKED
        if (V10_State.editMode.isLocked) {
          console.log(`🚫 Previous step blocked: Edit mode is locked for garment ${V10_State.editMode.currentGarmentId}`);
          e.preventDefault();
          e.stopPropagation();
          if (this.navigator) {
            this.navigator.handleBlockedNavigation('step-button', 'previous');
          }
          return false;
        }
        this.goBackToStep2();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        // CHECK EDIT MODE LOCK - BLOCK NAVIGATION IF LOCKED
        if (V10_State.editMode.isLocked) {
          console.log(`🚫 Next step blocked: Edit mode is locked for garment ${V10_State.editMode.currentGarmentId}`);
          e.preventDefault();
          e.stopPropagation();
          if (this.navigator) {
            this.navigator.handleBlockedNavigation('step-button', 'next');
          }
          return false;
        }
        if (this.validateStep().isValid) {
          this.proceedToStep4();
        }
      });
    }
    
    // COLOR STUDIO TOUR button (only visible in Color Studio)
    const tourBtn = document.getElementById('color-studio-tour');
    if (tourBtn) {
      tourBtn.addEventListener('click', () => {
        console.log('🎯 COLOR TOUR button clicked - starting onboarding tour');

        // Mark as seen and return to black normal state permanently
        localStorage.setItem('color-studio-tour-seen', 'true');
        tourBtn.classList.remove('first-time-pulse');
        console.log('✅ Tour button returned to normal black state');

        if (window.v10GarmentStudio && window.v10GarmentStudio.showColorStudioOnboarding) {
          window.v10GarmentStudio.showColorStudioOnboarding();
        } else {
          console.warn('⚠️ Onboarding system not available');
        }
      });
    }

    // GARMENT STUDIO TOUR button (only visible in Garment Studio)
    const garmentTourBtn = document.getElementById('garment-studio-tour');
    if (garmentTourBtn) {
      garmentTourBtn.addEventListener('click', () => {
        console.log('🎯 GARMENT TOUR button clicked - starting garment onboarding tour');

        // Mark as seen and return to black normal state permanently
        localStorage.setItem('garment-studio-tour-seen', 'true');
        garmentTourBtn.classList.remove('first-time-pulse');
        console.log('✅ Garment tour button returned to normal black state');

        if (window.v10GarmentStudio && window.v10GarmentStudio.showGarmentStudioOnboarding) {
          window.v10GarmentStudio.showGarmentStudioOnboarding();
        } else {
          console.warn('⚠️ Garment onboarding system not available');
        }
      });
    }

    // Setup help system for all help buttons
    this.setupHelpSystem();
    
    // Setup global click interceptor for edit mode
    this.setupEditModeClickInterceptor();

    // Auto-save on window unload
    window.addEventListener('beforeunload', () => {
      });
  }

  // Setup global click interceptor for edit mode
  setupEditModeClickInterceptor() {
    document.addEventListener('click', (e) => {
      // Only intercept clicks when edit mode is locked
      if (!V10_State.editMode.isLocked) {
        return;
      }

      // TOUR EXEMPTION: Don't block clicks during onboarding tours
      const isOnboardingActive = document.body.classList.contains('onboarding-active');
      if (isOnboardingActive) {
        console.log('🎯 Click allowed: Onboarding tour is active');
        return;
      }

      // Get the garment box that's currently being edited
      const currentGarmentCard = document.querySelector(`[data-garment-id="${V10_State.editMode.currentGarmentId}"]`);
      if (!currentGarmentCard) {
        return;
      }

      // Check if the click is inside the garment box
      const clickedInsideGarmentBox = currentGarmentCard.contains(e.target);

      // Check if the click is on the finalize button (should not be blocked)
      const clickedFinalizeButton = e.target.closest('.garment-card__finalize');

      // Check if click is on a help button or modal (should not be blocked)
      const clickedHelpElement = e.target.closest('[data-help], .v10-modal, .v10-modal-overlay');

      // Check if click is on tour elements (should not be blocked)
      const clickedTourElement = e.target.closest('.onboarding-highlight, .onboarding-tooltip, .onboarding-controls, .onboarding-btn');

      // If clicked outside the garment box and not on finalize button or help/tour elements
      if (!clickedInsideGarmentBox && !clickedFinalizeButton && !clickedHelpElement && !clickedTourElement) {
        // Block the click
        e.preventDefault();
        e.stopPropagation();
        
        console.log(`🚫 Click blocked: Outside garment box while edit mode locked for garment ${V10_State.editMode.currentGarmentId}`);
        
        // Trigger finalize button attention if navigator is available
        if (this.navigator) {
          this.navigator.handleBlockedNavigation('outside-click', 'general');
        }
        
        return false;
      }
    }, true); // Use capture phase to intercept before other handlers
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
    console.log('🔧 Setting up help system...');
    
    // Use event delegation to prevent duplicate listeners
    // Remove any existing help listeners first
    if (this.helpDelegateHandler) {
      document.removeEventListener('click', this.helpDelegateHandler);
    }
    
    // Create a single delegated event handler for all help buttons
    this.helpDelegateHandler = (e) => {
      const helpButton = e.target.closest('[data-help], .limit-help-btn, .studio-help-btn');
      
      if (helpButton) {
        e.preventDefault();
        e.stopPropagation();
        
        let helpTopic;
        
        // Determine help topic based on button type
        if (helpButton.classList.contains('limit-help-btn')) {
          helpTopic = 'size-distribution';
        } else if (helpButton.dataset.help) {
          helpTopic = helpButton.dataset.help;
        } else {
          console.warn('⚠️ Help button found but no topic specified:', helpButton);
          return;
        }
        
        console.log(`🎯 Help button clicked for topic: ${helpTopic}`);
        this.showTopicHelp(helpTopic);
      }
    };
    
    // Add single delegated event listener to document
    document.addEventListener('click', this.helpDelegateHandler);
    
    // Count help buttons for debugging
    const helpButtons = document.querySelectorAll('[data-help], .limit-help-btn, .studio-help-btn');
    console.log(`✅ Help system initialized with ${helpButtons.length} help buttons using event delegation`);


    console.log('🔧 Help system initialized for all help buttons');
    
    // Debug: Test help system (can be removed in production)
    window.testHelpSystem = () => {
      console.log('🧪 Testing help system...');
      const helpTopics = ['garment-studio', 'quantities-studio', 'garment-types', 'fabric-types', 'sample-reference', 'sample-types', 'size-distribution'];
      helpTopics.forEach((topic, index) => {
        setTimeout(() => {
          console.log(`🔍 Testing topic: ${topic}`);
          this.showTopicHelp(topic);
        }, index * 1000);
      });
    };
  }

  showTopicHelp(topic) {
    console.log(`🔍 Opening help modal for topic: ${topic}`);
    
    // Create or get help modal using V10 modal system
    let modal = document.getElementById('topic-help-modal');
    if (!modal) {
      console.log('📝 Creating new help modal');
      modal = this.createTopicHelpModal();
      document.body.appendChild(modal);
    } else {
      console.log('♻️ Reusing existing help modal');
    }

    // Load content for the specific topic
    this.loadTopicHelpContent(modal, topic);

    // Show modal using V10 modal manager with improved fallback
    if (window.v10ModalManager && typeof window.v10ModalManager.openModal === 'function') {
      console.log('✅ Using V10 Modal Manager');
      window.v10ModalManager.openModal(modal);
    } else {
      console.log('⚠️ V10 Modal Manager not available, using fallback');
      // Enhanced fallback with better modal behavior
      modal.style.display = 'flex';
      modal.classList.add('active');
      modal.style.opacity = '0';
      modal.style.visibility = 'visible';
      
      // Force reflow and animate in
      requestAnimationFrame(() => {
        modal.style.transition = 'opacity 0.3s ease-out';
        modal.style.opacity = '1';
      });
      
      document.body.style.overflow = 'hidden';
      
      // Focus management for accessibility
      const firstFocusable = modal.querySelector('.v10-modal-close');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }

  createTopicHelpModal() {
    const modal = document.createElement('div');
    modal.id = 'topic-help-modal';
    modal.className = 'v10-modal-overlay';
    modal.style.display = 'none';
    modal.innerHTML = `
      <div class="v10-modal v10-modal--help">
        <div class="v10-modal-header">
          <div class="v10-modal-icon v10-modal-icon--help">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <path d="M12 17h.01"/>
            </svg>
          </div>
          <h3 class="v10-modal-title" id="topic-help-title">Help Guide</h3>
          <button type="button" class="v10-modal-close" id="close-topic-help-modal">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
        <div class="v10-modal-body">
          <div class="help-content" id="topic-help-content">
            <!-- Topic-specific content will be loaded here -->
          </div>
        </div>
      </div>
    `;
    
    // Enhanced close functionality
    const closeModal = () => {
      console.log('🔄 Closing help modal');
      if (window.v10ModalManager && typeof window.v10ModalManager.closeModal === 'function') {
        window.v10ModalManager.closeModal(modal);
      } else {
        // Enhanced fallback close with animation
        modal.style.transition = 'opacity 0.3s ease-out';
        modal.style.opacity = '0';
        
        setTimeout(() => {
          modal.style.display = 'none';
          modal.style.visibility = 'hidden';
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }, 300);
      }
    };

    // Add click event to close button with event delegation
    const closeBtn = modal.querySelector('.v10-modal-close');
    if (closeBtn) {
      // Remove any existing listeners to prevent duplicates
      closeBtn.replaceWith(closeBtn.cloneNode(true));
      const newCloseBtn = modal.querySelector('.v10-modal-close');
      newCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      });
    }

    // Backdrop clicks DISABLED - users must use close/cancel buttons
    // Overlay click prevention is now handled by universal function

    // Add ESC key support
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        e.preventDefault();
        closeModal();
      }
    };

    // Remove existing keydown listener if it exists
    document.removeEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleKeyDown);

    return modal;
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
        title: 'Color Studio Guide',
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
            <h5><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline; margin-right: 6px;" aria-hidden="true" focusable="false"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>Approved Sample – As Is</h5>
            <p>Use this when you want to produce exactly the same as a previously approved sample with no changes whatsoever.</p>
            <strong>Best for:</strong> Repeat orders, proven designs, consistent production
          </div>
          
          <div style="margin-bottom: 1.5rem;">
            <h5><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline; margin-right: 6px;" aria-hidden="true" focusable="false"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>Approved Sample – With Changes</h5>
            <p>Use this when you have an approved sample but want to make modifications like different colors, sizing adjustments, or minor design changes.</p>
            <strong>Best for:</strong> Seasonal updates, color variations, minor improvements
          </div>
          
          <div style="margin-bottom: 1.5rem;">
            <h5><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline; margin-right: 6px;" aria-hidden="true" focusable="false"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>New Sample Version</h5>
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
            <h5><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline; margin-right: 6px;" aria-hidden="true" focusable="false"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>Custom Design Sample</h5>
            <p>Fully customized sample with your designs, colors, and specifications applied.</p>
            <strong>Timeline:</strong> 7-10 business days
          </div>
          
          <div style="margin-bottom: 1.5rem;">
            <h5><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline; margin-right: 6px;" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>Color Matching Sample</h5>
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
      },
      'size-distribution': {
        title: 'Size Distribution Guidelines',
        content: `
          <h4>Size Distribution Limits</h4>
          <p>Our production system has smart limits to ensure efficient and cost-effective manufacturing:</p>
          
          <h4>Why Size Limits Exist</h4>
          <ul>
            <li><strong>Efficiency:</strong> Too many size variations slow production and increase costs</li>
            <li><strong>Quality:</strong> Focused size ranges allow better fit validation</li>
            <li><strong>Inventory:</strong> Prevents over-complexity in size management</li>
          </ul>
          
          <h4>Size Limit Rules</h4>
          <div style="margin-bottom: 1rem;">
            <strong>Low Quantities (25-74 units):</strong> Maximum 5 sizes<br>
            <span style="color: var(--v10-text-secondary); font-size: 0.9em;">Focus on your core sizes to optimize costs</span>
          </div>
          
          <div style="margin-bottom: 1rem;">
            <strong>Medium Quantities (75-149 units):</strong> Maximum 6 sizes<br>
            <span style="color: var(--v10-text-secondary); font-size: 0.9em;">Balanced approach allowing some variety</span>
          </div>
          
          <div style="margin-bottom: 1rem;">
            <strong>High Quantities (150+ units):</strong> Maximum 7 sizes<br>
            <span style="color: var(--v10-text-secondary); font-size: 0.9em;">Full size range available for larger orders</span>
          </div>
          
          <h4>Recommended Size Distributions</h4>
          <ul>
            <li><strong>Core 4 sizes:</strong> S, M, L, XL (covers ~80% of market)</li>
            <li><strong>Extended 5 sizes:</strong> Add XS or XXL based on target audience</li>
            <li><strong>Full 6-7 sizes:</strong> XS, S, M, L, XL, XXL, XXXL (comprehensive range)</li>
          </ul>
          
          <h4>Pro Tips</h4>
          <ul>
            <li>Medium (M) and Large (L) typically represent 50-60% of most orders</li>
            <li>Consider your target demographic when selecting size ranges</li>
            <li>You can always order additional sizes in future orders</li>
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
  resetStepsData() {
    // Clear V10_State data for Steps 2, 3, 4 (preserve client info from Step 1)
    V10_State.garments.clear();
    V10_State.labDips.clear();
    V10_State.designSamples.clear();
    V10_State.assignments.labDips.clear();
    V10_State.assignments.designs.clear();
    V10_State.totalQuantity = 0;
    
    // Reset quantity management
    V10_State.quantities.garments.clear();
    V10_State.quantities.validation.clear();
    V10_State.quantities.globalMinimum = 0;
    V10_State.quantities.globalTotal = 0;
    V10_State.quantities.progressPercentage = 0;
    V10_State.quantities.validationCards.clear();
    
    // Reset studio state
    V10_State.currentStudio = 'garment';
    V10_State.currentMode = 'labdips';
    
    // Clear uploaded files - SIMPLE FIX
    if (window.v10FileManager && window.v10FileManager.uploadedFiles) {
      window.v10FileManager.uploadedFiles.clear();
    }
    V10_State.fileData = null;
    
    // Clear UI elements for Steps 2, 3, 4
    this.clearStepsUI();
    
    console.log('🔄 Steps 2, 3, 4 data reset for new request type');
  }

  clearStepsUI() {
    // Clear garment cards - BOTH IDs (there's garments-container and garment-container)
    const garmentContainer = document.getElementById('garment-container');
    if (garmentContainer) {
      garmentContainer.innerHTML = '';
    }
    
    const garmentsContainer = document.getElementById('garments-container');
    if (garmentsContainer) {
      garmentsContainer.innerHTML = '';
    }
    
    // Clear lab dip collection
    const labdipsGrid = document.getElementById('labdips-grid');
    if (labdipsGrid) {
      labdipsGrid.innerHTML = '';
    }
    
    // Clear design sample collection
    const designsGrid = document.getElementById('designs-grid');
    if (designsGrid) {
      designsGrid.innerHTML = '';
    }
    
    // Clear uploaded files display
    const uploadedFilesContainer = document.getElementById('techpack-v10-uploaded-files');
    if (uploadedFilesContainer) {
      uploadedFilesContainer.innerHTML = '';
    }
    
    // Reset measurement checkboxes
    const measurementCheckboxes = document.querySelectorAll('#techpack-v10-measurement-studio input[type="checkbox"]');
    measurementCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    // Hide measurement studio
    const measurementStudio = document.getElementById('techpack-v10-measurement-studio');
    if (measurementStudio) {
      measurementStudio.style.display = 'none';
    }
    
    // Clear file upload areas - reset to initial state
    const fileUploadAreas = document.querySelectorAll('.file-upload-area');
    fileUploadAreas.forEach(area => {
      const fileDisplay = area.querySelector('.file-display');
      const dropZone = area.querySelector('.file-drop-zone');
      if (fileDisplay) fileDisplay.style.display = 'none';
      if (dropZone) dropZone.style.display = 'flex';
    });
    
    // Reset any form inputs for Steps 2, 3 (preserve Step 1 client info)
    const step2Forms = document.querySelectorAll('#v10-step-2 input, #v10-step-2 textarea, #v10-step-2 select');
    step2Forms.forEach(input => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = false;
      } else {
        input.value = '';
      }
    });
    
    const step3Forms = document.querySelectorAll('#v10-step-3 input:not([name="design-type"]), #v10-step-3 textarea, #v10-step-3 select');
    step3Forms.forEach(input => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = false;
      } else {
        input.value = '';
      }
    });
  }

  setRequestType(type) {
    this.resetStepsData();
    this.navigator.setRequestType(type);
    this.updateGlobalSectionVisibility(type);
    
    // Update studio tabs to reflect cleared state after data reset
    if (this.garmentStudio) {
      this.garmentStudio.updateStudioCompletion();
      this.garmentStudio.updateQuantitiesStudioTabStatus(); 
      this.garmentStudio.updateDesignStudioTabStatus();
    }
    
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
      
      section.style.display = shouldShow ? '' : 'none';  // Use default CSS display when showing
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
      
      // Scroll to top for mobile navigation
      window.scrollTo(0, 0);
      
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
      console.log('🎯 STEP 4: proceedToStep4() called');
      const step3 = document.getElementById('techpack-v10-step-3');
      const step4 = document.getElementById('techpack-v10-step-4');
      
      console.log('🎯 STEP 4: Elements found:', { step3: !!step3, step4: !!step4 });
      
      if (!step3 || !step4) {
        console.error('Cannot find step 3 or step 4 elements');
        return false;
      }

      console.log('🎯 STEP 4: Before - step3.style.display:', step3.style.display);
      console.log('🎯 STEP 4: Before - step4.style.display:', step4.style.display);
      
      step3.style.display = 'none';
      step4.style.display = 'block';
      
      // Scroll to top for mobile navigation
      window.scrollTo(0, 0);
      
      console.log('🎯 STEP 4: After - step3.style.display:', step3.style.display);
      console.log('🎯 STEP 4: After - step4.style.display:', step4.style.display);
      
      // Check if step4 is actually visible
      const computedStyle = window.getComputedStyle(step4);
      console.log('🎯 STEP 4: Computed display:', computedStyle.display);
      console.log('🎯 STEP 4: Computed visibility:', computedStyle.visibility);
      console.log('🎯 STEP 4: Computed opacity:', computedStyle.opacity);
      
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
          
          // Initialize assignment overview
          setTimeout(() => {
            window.v10ReviewManager.populateGarmentAssignments();
            
            // Also update lab dip collection assignments
            if (window.v10ColorStudio) {
              window.v10ColorStudio.updateLabDipCollectionAssignments();
            }
          }, 100);
        } catch (managerError) {
          console.error('Error initializing review manager:', managerError);
        }
      }
      
      // Now that Step 4 is visible, populate the review content
      try {
        if (window.v10ReviewManager) {
          console.log('🎯 STEP 4: Calling populateReview() after step is visible');
          window.v10ReviewManager.populateReview();
        }
      } catch (populateError) {
        console.error('Error populating review:', populateError);
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
    this.interactedFields = new Set(); // Track fields user has interacted with
    
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
    inputs.forEach((input, index) => {
      // Generate consistent field key (same as in validateForm)
      const fieldKey = input.name || input.id || `field-${index}`;
      
      // Track field interaction on focus
      input.addEventListener('focus', () => {
        this.interactedFields.add(fieldKey);
        console.log('👆 Field focused:', fieldKey);
      });
      
      // Add input event for text fields, textareas, selects
      input.addEventListener('input', () => {
        this.interactedFields.add(fieldKey);
        this.saveData();
        // Clear validation state on input for better UX
        const fieldContainer = input.closest('.v10-form-field');
        if (fieldContainer) {
          fieldContainer.classList.remove('v10-form-field--invalid');
        }
        // Only validate interacted fields, not the entire form immediately
        console.log('✏️ Field input:', fieldKey);
      });
      
      // Add blur event for interacted fields
      input.addEventListener('blur', () => {
        if (this.interactedFields.has(fieldKey)) {
          this.validateSingleField(input);
          console.log('👋 Field blurred (validated):', fieldKey);
        }
      });
      
      // Add change event for radio buttons and checkboxes
      if (input.type === 'radio' || input.type === 'checkbox') {
        input.addEventListener('change', () => {
          this.interactedFields.add(fieldKey);
          this.saveData();
          // Only validate conditional sections after radio/checkbox changes
          this.validateConditionalSections();
          console.log('🔘 Radio/checkbox changed:', fieldKey, 'checked:', input.checked);
        });
      }
    });
  }

  setupNavigation() {
    const nextBtn = document.getElementById('techpack-v10-step-1-next');
    const backBtn = document.getElementById('techpack-v10-step-1-back');
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        // Find the form that contains required fields
        const form = nextBtn.closest('form') || document.querySelector('form');
        
        // Use universal validation system
        if (window.FormValidator && form) {
          const isValid = window.FormValidator.validateAndProceed(form);
          if (!isValid) {
            console.log('❌ Form validation failed, cannot proceed');
            return;
          }
        }
        
        // Proceed to step 2 (old validation method removed)
        this.proceedToStep2();
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
    const deliveryAddressField = document.getElementById('v10-delivery-address-field');
    const differentAddressForm = document.getElementById('v10-different-address-form');
    
    if (!this.currentRequestType) return;
    
    // Show delivery address for sample and bulk requests (NOT quotation)
    if (deliveryAddressField) {
      if (this.currentRequestType === 'sample-request' || 
          this.currentRequestType === 'bulk-order-request') {
        deliveryAddressField.style.display = 'block';
        
        // Fix: Force CSS :checked state to re-apply when field becomes visible
        setTimeout(() => {
          const checkedRadio = deliveryAddressField.querySelector('input[name="deliveryAddress"]:checked');
          if (checkedRadio) {
            // Force browser to re-evaluate :checked CSS styling
            checkedRadio.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }, 50);
      } else {
        // Hide for quotation
        deliveryAddressField.style.display = 'none';
        
        // Also hide different address form if it was showing
        if (differentAddressForm) {
          differentAddressForm.style.display = 'none';
        }
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

  /* ALL VALIDATION FUNCTIONS REMOVED - WILL BE REPLACED WITH UNIFIED SYSTEM */

  // Simple email validation - major providers + any reasonable business domain
  validateEmail(email) {
    if (!email || typeof email !== 'string') {
      return { isValid: false, reason: 'Email is required' };
    }
    
    email = email.trim().toLowerCase();
    
    // Basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, reason: 'Invalid email format' };
    }
    
    const [localPart, domain] = email.split('@');
    
    // Common typo detection and correction
    const commonTypos = {
      'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmil.com': 'gmail.com',
      'yahooo.com': 'yahoo.com', 'yaho.com': 'yahoo.com',
      'hotmial.com': 'hotmail.com', 'hotmai.com': 'hotmail.com',
      'outlok.com': 'outlook.com', 'outloo.com': 'outlook.com'
    };
    
    if (commonTypos[domain]) {
      return {
        isValid: false,
        reason: `Did you mean ${localPart}@${commonTypos[domain]}?`,
        suggestion: `${localPart}@${commonTypos[domain]}`,
        isTypo: true
      };
    }
    
    // Basic domain validation - allow business emails and all reasonable domains
    const tldParts = domain.split('.');
    const tld = tldParts[tldParts.length - 1];
    if (tld.length < 2 || tld.length > 6) {
      return { isValid: false, reason: 'Please check your email domain' };
    }
    
    return { isValid: true, reason: 'Valid email address' };
  }


  validateForm(forceValidateAll = false) {
    const form = document.getElementById('techpack-v10-client-form');
    if (!form) return false;
    
    let isValid = true;
    
    // Clear all previous validation states only for interacted fields (unless forcing all)
    if (forceValidateAll) {
      const allFields = form.querySelectorAll('.v10-form-field');
      allFields.forEach(field => field.classList.remove('v10-form-field--invalid'));
    }
    
    // Check request type selected (always required)
    if (!this.currentRequestType) {
      isValid = false;
    }
    
    // Check basic required fields (only validate if interacted with or forcing all)
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    
    requiredFields.forEach((field, index) => {
      // Generate consistent field key using name, id, or index
      const fieldKey = field.name || field.id || `field-${index}`;
      
      const shouldValidate = forceValidateAll || this.interactedFields.has(fieldKey);
      
      if (shouldValidate && !field.value.trim()) {
        isValid = false;
        const fieldContainer = field.closest('.v10-form-field');
        if (fieldContainer) {
          fieldContainer.classList.add('v10-form-field--invalid');
        }
      }
    });
    
    // Special email validation (more strict than just required check)
    const emailField = form.querySelector('input[name="email"], input[type="email"]');
    if (emailField) {
      const fieldKey = emailField.name || emailField.id || 'email-field';
      
      const shouldValidateEmail = forceValidateAll || this.interactedFields.has(fieldKey);
      
      if (shouldValidateEmail) {
        const emailValidation = this.validateEmail(emailField.value);
        
        if (!emailValidation.isValid) {
          isValid = false;
          const fieldContainer = emailField.closest('.v10-form-field');
          if (fieldContainer) {
            fieldContainer.classList.add('v10-form-field--invalid');
          }
        }
      }
    }
    
    // 🗑️ REMOVED: Duplicate different address validation - now handled by Universal Form Validator
    // The Universal Form Validator system now handles all conditional address field validation
    
    // Check shipping method and insurance (for bulk requests)
    if (this.currentRequestType === 'bulk-order-request') {
      console.log('🔍 Checking bulk request requirements (shipping & insurance)');
      
      const shippingSelected = document.querySelector('input[name="shippingMethod"]:checked');
      const insuranceSelected = document.querySelector('input[name="insurance"]:checked');
      
      console.log('🚛 Shipping method:', { selected: !!shippingSelected, value: shippingSelected?.value });
      console.log('🛡️ Insurance:', { selected: !!insuranceSelected, value: insuranceSelected?.value });
      
      if (!shippingSelected) {
        console.log('❌ No shipping method selected');
        isValid = false;
        const shippingField = document.querySelector('input[name="shippingMethod"]')?.closest('.v10-form-field');
        if (shippingField) {
          shippingField.classList.add('v10-form-field--invalid');
        }
      } else {
        console.log('✅ Shipping method selected:', shippingSelected.value);
      }
      
      if (!insuranceSelected) {
        console.log('❌ No insurance selected');
        isValid = false;
        const insuranceField = document.querySelector('input[name="insurance"]')?.closest('.v10-form-field');
        if (insuranceField) {
          insuranceField.classList.add('v10-form-field--invalid');
        }
      } else {
        console.log('✅ Insurance selected:', insuranceSelected.value);
      }
    } else {
      console.log('ℹ️ Skipping bulk request validation (not bulk request type)');
    }
    
    // Final validation result
    console.log('🎯 Final validation result:', { isValid, formValid: isValid ? 'PASS' : 'FAIL' });
    
    // Button is always enabled - validation feedback shown on click instead
    console.log('🔘 Validation result:', { isValid, formValid: isValid ? 'PASS' : 'FAIL' });
    
    return isValid;
  }

  validateSingleField(field) {
    const fieldContainer = field.closest('.v10-form-field');
    if (!fieldContainer) return;

    // Clear previous validation state
    fieldContainer.classList.remove('v10-form-field--invalid');

    // Check if required and empty
    if (field.hasAttribute('required') && !field.value.trim()) {
      fieldContainer.classList.add('v10-form-field--invalid');
      return false;
    }

    // 🗑️ REMOVED: Duplicate conditional field validation - now handled by Universal Form Validator
    // The Universal Form Validator system now handles all data-validate attributes

    return true;
  }

  validateConditionalSections() {
    // Only validate delivery address radio if not quotation type
    if (this.currentRequestType !== 'quotation') {
      const deliveryField = document.getElementById('v10-delivery-address-field');
      if (deliveryField && deliveryField.style.display !== 'none') {
        const selectedDelivery = document.querySelector('input[name="deliveryAddress"]:checked');
        if (!selectedDelivery) {
          deliveryField.classList.add('v10-form-field--invalid');
        } else {
          deliveryField.classList.remove('v10-form-field--invalid');
          
          // 🗑️ REMOVED: Duplicate field-level validation - now handled by Universal Form Validator
          // Only keeping radio selection validation here, field validation handled comprehensively by Universal Form Validator
        }
      }
    }
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
      
      // Scroll to top for mobile navigation
      window.scrollTo(0, 0);
      
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

  /**
   * Cleanup method to remove event listeners and clear data
   * Call this when navigating away or destroying the form
   */
  destroy() {
    // Clear form data from memory (not storage)
    this.formData.clear();
    this.interactedFields.clear();
    
    // Reset properties
    this.currentRequestType = null;
    
    console.log('🧹 V10_ClientManager cleaned up');
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
    // Step 2 files no longer loaded from localStorage
    // this.loadSavedFiles();
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
        // Note: validateMeasurements() intentionally removed from checkbox change
        // It should only run when clicking "Next Step" to prevent modal spam
        // Note: saveData() intentionally removed - measurement checkboxes should not be saved
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
        console.log('🖱️ V10 Step 2 Next button clicked');
        e.preventDefault();
        
        // Find the form that contains required fields
        const form = nextBtn.closest('form') || document.querySelector('form');
        
        // Use universal validation system first
        if (window.FormValidator && form) {
          const isValid = window.FormValidator.validateAndProceed(form);
          if (!isValid) {
            console.log('❌ Form validation failed, cannot proceed');
            return;
          }
        }
        
        console.log('📋 Calling validateStep() for files...');
        if (!this.validateStep()) {
          console.log('❌ File validation failed, cannot proceed');
          return;
        }
        
        console.log('📋 Files valid, now calling validateMeasurements()...');
        if (!this.validateMeasurements()) {
          console.log('❌ Measurement validation failed, modal should be shown');
          return;
        }
        
        console.log('✅ All validation passed, proceeding to step 3');
        const result = this.proceedToStep3();
        // Handle both synchronous and asynchronous returns
        if (result && typeof result.then === 'function') {
          result.then(success => {
            if (!success) {
              console.error('Failed to proceed to step 3');
            }
          });
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
    
    // Show measurement requirements for sample requests AND quotations
    if (measurementStudio) {
      if (requestType === 'sample-request' || requestType === 'quotation') {
        measurementStudio.style.display = 'block';
        console.log('✅ Showing measurement studio for:', requestType);
      } else {
        measurementStudio.style.display = 'none';
        console.log('🔒 Hiding measurement studio for request type:', requestType);
      }
    }
    
    // Show design placement for sample requests and quotations
    if (designPlacementItem) {
      if (requestType === 'sample-request' || requestType === 'quotation') {
        designPlacementItem.style.display = 'flex';
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
    
    // File type selection removed - no longer required
    
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
    if (!measurementStudio || measurementStudio.style.display === 'none') {
      return true; // Skip validation if measurement studio is hidden
    }
    
    // Get request type for validation
    const clientData = window.v10ClientManager?.getClientData() || {};
    const requestType = clientData.submission_type;
    
    // Check measurement checkboxes
    const fitCheckbox = document.getElementById('techpack-v10-fit-measurements');
    const designCheckbox = document.getElementById('techpack-v10-design-measurements');
    const placementCheckbox = document.getElementById('techpack-v10-placement-measurements');
    
    const fitChecked = fitCheckbox?.checked;
    const designChecked = designCheckbox?.checked;
    const placementChecked = placementCheckbox?.checked;
    
    // For sample requests AND quotations, fit measurements are required
    if ((requestType === 'sample-request' || requestType === 'quotation') && !fitChecked) {
      this.showMeasurementRequirementModal();
      return false;
    }
    
    // If some measurements are checked but others are missing, show incomplete modal
    const checkedCount = [fitChecked, designChecked, placementChecked].filter(Boolean).length;
    const totalCount = [fitCheckbox, designCheckbox, placementCheckbox].filter(el => el?.offsetParent).length;
    
    if (checkedCount > 0 && checkedCount < totalCount) {
      this.showIncompleteMeasurementsModal(fitChecked, designChecked, placementChecked);
      return false;
    }
    
    return true;
  }

  showMeasurementRequirementModal() {
    const modal = document.getElementById('techpack-v10-measurement-warning-modal');
    if (!modal) return;
    
    // Configure modal content
    const title = document.getElementById('techpack-v10-warning-title');
    const message = document.getElementById('techpack-v10-warning-message');
    const details = document.getElementById('techpack-v10-warning-details');
    const backBtn = document.getElementById('techpack-v10-warning-back');
    const proceedBtn = document.getElementById('techpack-v10-warning-proceed');
    
    if (title) title.textContent = 'Fit Measurements Required';
    if (message) message.textContent = 'This request type requires fit measurements to proceed. Please select "Fit Measurements" to continue.';
    if (details) details.innerHTML = '<p><strong>Required:</strong> Body measurements or size charts are mandatory for accurate quotations and proper garment fitting.</p>';
    
    // Configure buttons
    if (proceedBtn) proceedBtn.style.display = 'none';
    if (backBtn) {
      backBtn.style.display = 'inline-flex';
      backBtn.textContent = 'I Understand';
      backBtn.onclick = () => window.v10ModalManager.closeModal(modal);
    }
    
    const closeBtn = document.getElementById('v10-close-warning-modal');
    if (closeBtn) {
      closeBtn.onclick = () => window.v10ModalManager.closeModal(modal);
    }
    
    // Show modal using V10_ModalManager
    window.v10ModalManager.openModal(modal);
  }

  showIncompleteMeasurementsModal(fitChecked, designChecked, placementChecked) {
    const modal = document.getElementById('techpack-v10-measurement-modal');
    if (!modal) return;
    
    // Configure modal content
    const title = document.getElementById('v10-measurement-modal-title');
    const message = document.getElementById('v10-measurement-modal-message');
    const details = document.getElementById('v10-measurement-modal-details');
    const backBtn = document.getElementById('v10-measurement-modal-back');
    const proceedBtn = document.getElementById('v10-measurement-modal-proceed');
    
    if (title) title.textContent = 'Incomplete Measurements';
    if (message) {
      message.textContent = "Some measurements are missing from your submission. Please review the requirements below and add the missing measurements for more accurate results.";
    }
    
    // Generate measurements status
    if (details) {
      const included = [];
      const missing = [];
      
      if (fitChecked) included.push('Fit Measurements'); else missing.push('Fit Measurements');
      if (designChecked) included.push('Design Measurements'); else missing.push('Design Measurements');
      if (placementChecked) included.push('Design Placement'); 
      else if (document.getElementById('techpack-v10-placement-measurements')?.offsetParent) {
        missing.push('Design Placement');
      }
      
      let content = '';
      if (included.length > 0) {
        content += '<p><strong style="color: #10b981;">✓ Included:</strong> ' + included.join(', ') + '</p>';
      }
      if (missing.length > 0) {
        content += '<p><strong style="color: #f59e0b;">⚠ Missing:</strong> ' + missing.join(', ') + '</p>';
      }
      details.innerHTML = content;
    }
    
    // Configure buttons
    if (backBtn) {
      backBtn.style.display = 'inline-flex';
      backBtn.textContent = 'Go Back & Add Measurements';
      backBtn.onclick = () => window.v10ModalManager.closeModal(modal);
    }
    if (proceedBtn) {
      proceedBtn.style.display = 'inline-flex';
      proceedBtn.textContent = 'Continue Anyway';
      proceedBtn.onclick = () => {
        window.v10ModalManager.closeModal(modal);
        this.proceedToStep3();
      };
    }
    
    const closeBtn = document.getElementById('v10-close-measurement-modal');
    if (closeBtn) {
      closeBtn.onclick = () => window.v10ModalManager.closeModal(modal);
    }
    
    // Show modal using V10_ModalManager
    window.v10ModalManager.openModal(modal);
  }



  validateStep() {
    console.log('🔍 V10 validateStep() called');
    let isValid = true;
    
    // Get file upload warning element
    const fileUploadWarning = document.getElementById('v10-file-upload-warning');
    
    // Check if files are uploaded
    console.log(`📁 Files uploaded: ${this.uploadedFiles.size}`);
    if (this.uploadedFiles.size === 0) {
      console.log('❌ No files uploaded');
      isValid = false;
      // Show file upload warning
      if (fileUploadWarning) {
        fileUploadWarning.style.display = 'flex';
      }
    } else {
      // Hide file upload warning when files are present
      if (fileUploadWarning) {
        fileUploadWarning.style.display = 'none';
      }
    }
    
    // Note: File type validation removed - files no longer require classification
    // Note: Measurement validation intentionally removed from validateStep()
    // Measurements should only be validated when clicking "Next Step" button
    
    // Button is always enabled - validation feedback shown on click instead
    console.log('🔘 Step 2 validation result:', { isValid, formValid: isValid ? 'PASS' : 'FAIL' });
    
    console.log(`✅ validateStep final result: ${isValid}`);
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
        size: fileData.size
      }))
      // Note: measurements intentionally excluded from persistence
      // User should start fresh with checkboxes on each app entry
    };
    
    // Step 2 data no longer saved to localStorage - only kept in memory
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
    // Step 2 files no longer loaded from localStorage
    return;
  }

  goBackToStep1() {
    const step1 = document.getElementById('techpack-v10-step-1');
    const step2 = document.getElementById('techpack-v10-step-2');
    
    if (step1 && step2) {
      step1.style.display = 'block';
      step2.style.display = 'none';
      
      // Scroll to top for mobile navigation
      window.scrollTo(0, 0);
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
      const step3Section = document.querySelector('section[data-step="3"]') || 
                          document.querySelector('.v10-techpack-step[data-step="3"]') ||
                          document.querySelector('#techpack-v10-step-3');
      
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
    
    // Scroll to top for mobile navigation
    window.scrollTo(0, 0);
    
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
    // Return from global state instead of localStorage
    return window.V10_State?.fileData || {};
  }

  destroy() {
    // Clear uploaded files and data
    this.uploadedFiles.clear();
    
    // Remove event listeners
    const uploadZone = document.getElementById('techpack-v10-upload-zone');
    const fileInput = document.getElementById('techpack-v10-file-input');
    
    if (uploadZone) {
      const newUploadZone = uploadZone.cloneNode(true);
      uploadZone.parentNode.replaceChild(newUploadZone, uploadZone);
    }
    
    if (fileInput) {
      const newFileInput = fileInput.cloneNode(true);
      fileInput.parentNode.replaceChild(newFileInput, fileInput);
    }
    
    // Clear global references
    if (window.v10FileManager === this) {
      window.v10FileManager = null;
    }
  }
}

// ==============================================
// V10 MODAL SYSTEM
// ==============================================

class V10_ModalManager {
  constructor() {
    this.initialized = false;
    this.currentClientType = null;
    this.currentSubmissionType = null;
    this.modals = new Map();
    
    this.init();
  }

  init() {
    // Prevent multiple initialization
    if (this.initialized) {
      console.log('⚠️ V10_ModalManager already initialized, skipping...');
      return;
    }
    
    this.initializeModals();
    this.setupEventListeners();
    this.setupModalInteractions();
    
    this.initialized = true;
    console.log('✅ V10_ModalManager initialized successfully');
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

    // Modal overlay clicks DISABLED - users must use close/cancel buttons
    // Overlay click prevention is now handled by universal function

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
      if (quotationBtn) {
        quotationBtn.disabled = false;
        quotationBtn.classList.remove('v10-submission-option--disabled');
      }
      if (sampleBtn) {
        sampleBtn.disabled = true;
        sampleBtn.classList.add('v10-submission-option--disabled');
      }
      if (bulkBtn) {
        bulkBtn.disabled = true;
        bulkBtn.classList.add('v10-submission-option--disabled');
      }
      if (labDipsBtn) {
        labDipsBtn.disabled = true;
        labDipsBtn.classList.add('v10-submission-option--disabled');
      }
      
    } else if (clientType === 'registered') {
      // Show warning for registered clients
      if (registrationNotice) registrationNotice.style.display = 'none';
      if (registrationWarning) registrationWarning.style.display = 'flex';
      
      // Update description
      if (submissionDescription) {
        submissionDescription.innerHTML = 'Select the type of submission that best matches your current needs. Each option is tailored to different stages of your garment development process.';
      }
      
      // Enable all options for registered clients
      if (quotationBtn) {
        quotationBtn.disabled = false;
        quotationBtn.classList.remove('v10-submission-option--disabled');
      }
      if (sampleBtn) {
        sampleBtn.disabled = false;
        sampleBtn.classList.remove('v10-submission-option--disabled');
      }
      if (bulkBtn) {
        bulkBtn.disabled = false;
        bulkBtn.classList.remove('v10-submission-option--disabled');
      }
      if (labDipsBtn) {
        labDipsBtn.disabled = false;
        labDipsBtn.classList.remove('v10-submission-option--disabled');
      }
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
      console.log(`🔄 Calling setRequestType with reset for: ${submissionType}`);
      window.v10TechPackSystem.setRequestType(submissionType);
      console.log(`✅ TechPack System updated with request type: ${submissionType}`);
    } else {
      console.warn('❌ TechPack System not available yet, storing pending reset for:', submissionType);
      // Store pending reset to execute when TechPack System initializes
      window.v10PendingRequestTypeReset = submissionType;
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
      // Must use inline style to override the inline display:none from the HTML
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
      }
    }
  }

  updateFormForSubmissionType(submissionType) {
    console.log(`🔄 Updating form for submission type: ${submissionType}`);
    
    // Update client status badge
    const statusBadge = document.getElementById('v10-client-status-badge');
    if (statusBadge) {
      statusBadge.textContent = this.currentClientType === 'new' ? 'New Client' : 'Registered Client';
      // Use CSS classes for badge styling
      statusBadge.classList.remove('v10-badge--new-client', 'v10-badge--registered');
      statusBadge.classList.add(this.currentClientType === 'new' ? 'v10-badge--new-client' : 'v10-badge--registered');
    }
    
    // Update subtitle based on submission type
    const subtitle = document.getElementById('v10-client-info-subtitle');
    if (subtitle) {
      const subtitles = {
        'quotation': 'Enter your information to begin pricing development',
        'sample-request': 'Enter your information to begin sample development',
        'bulk-order-request': 'Enter your information to begin bulk order processing'
      };
      subtitle.textContent = subtitles[submissionType] || subtitles['quotation'];
    }
    
    // Show/hide conditional sections
    const deliveryAddressField = document.getElementById('v10-delivery-address-field');
    const deliverySection = document.getElementById('v10-delivery-section');
    const shippingSection = document.getElementById('v10-shipping-section');
    
    // Hide all conditional sections first (using inline styles to ensure they override any defaults)
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
    }
    
    // Setup delivery address toggle functionality
    this.setupDeliveryAddressToggle();
    
    // Setup character counter for delivery notes
    this.setupCharacterCounter();
    
    // Setup project details toggle
    this.setupProjectDetailsToggle();
    
    // Setup enhanced country dropdowns
    this.setupEnhancedCountryDropdowns();

    // Update conditional sections if client manager exists
    if (window.v10ClientManager) {
      window.v10ClientManager.currentRequestType = submissionType;
      window.v10ClientManager.updateConditionalSections();
    }

    // Update change submission button text
    const changeBtn = document.getElementById('techpack-v10-change-submission');
    if (changeBtn) {
      const submissionNames = {
        'quotation': 'Garment Quotation',
        'sample-request': 'Sample Request',
        'bulk-order-request': 'Bulk Order Request'
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
      radio.addEventListener('change', () => {
        this.handleDeliveryAddressChange();
        // Don't immediately validate on radio change to prevent instant red fields
        // Validation will happen on form submission or field blur events
      });
    });
    
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
        
        // 🔧 ENHANCED ERROR CLEARING: Clear all validation states when showing different address form
        const fields = differentAddressForm.querySelectorAll('.v10-form-field');
        fields.forEach(field => {
          // Clear old validation classes
          field.classList.remove('v10-form-field--invalid', 'error');
          
          // Clear Universal Form Validator error messages
          const errorMessage = field.querySelector('.field-error-message');
          if (errorMessage) {
            errorMessage.remove();
          }
        });
      } else {
        differentAddressForm.classList.remove('v10-form-animate-in');
        setTimeout(() => {
          differentAddressForm.style.display = 'none';
        }, 300);
        
        // 🔧 COMPREHENSIVE FIELD CLEARING: Clear different address fields and all validation states when hidden
        const inputs = differentAddressForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
          input.value = '';
          this.clearFieldValidation(input);
          
          // Also clear Universal Form Validator errors
          const fieldContainer = input.closest('.v10-form-field');
          if (fieldContainer) {
            fieldContainer.classList.remove('error', 'v10-form-field--invalid');
            const errorMessage = fieldContainer.querySelector('.field-error-message');
            if (errorMessage) {
              errorMessage.remove();
            }
          }
        });
      }
    }
  }
  
  
  /* ADVANCED VALIDATION FUNCTION REMOVED - WILL BE REPLACED WITH UNIFIED SYSTEM */
  
  
  
  clearFieldValidation(field) {
    const fieldContainer = field.closest('.v10-form-field');
    
    if (fieldContainer) {
      fieldContainer.classList.remove('v10-form-field--error', 'v10-form-field--warning');
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

  setupProjectDetailsToggle() {
    const toggle = document.getElementById('v10-project-details-toggle');
    const section = document.getElementById('v10-project-details-section');
    const textarea = section?.querySelector('textarea[name="project_details"]');
    const counterElement = document.getElementById('v10-project-details-count');

    if (!toggle || !section) {
      console.warn('Project Details toggle setup failed:', { toggle: !!toggle, section: !!section });
      return;
    }

    // Remove any existing listeners to prevent duplicates
    toggle.removeEventListener('click', this.projectDetailsClickHandler);
    
    // Store the handler so we can remove it later if needed
    this.projectDetailsClickHandler = () => {
      const isExpanded = section.style.display !== 'none';
      
      if (isExpanded) {
        // Collapse
        section.style.display = 'none';
        toggle.classList.remove('active');
      } else {
        // Expand
        section.style.display = 'block';
        toggle.classList.add('active');
        // Focus on textarea when expanded
        if (textarea) {
          setTimeout(() => textarea.focus(), 300);
        }
      }
    };

    toggle.addEventListener('click', this.projectDetailsClickHandler);

    // Setup character counter for project details
    if (textarea && counterElement) {
      textarea.addEventListener('input', () => {
        const currentLength = textarea.value.length;
        counterElement.textContent = currentLength;
      });
    }
  }
  
  setupEnhancedCountryDropdowns() {
    // Country dropdowns now use native select elements - no setup needed
    console.log('✅ Country dropdowns using native select elements');
  }
  
  // Country dropdown functions removed - using native select elements

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
// GARMENT COMPLETION BADGE SYSTEM
// ==============================================

const V10_BadgeManager = {
  // Update garment completion badge
  updateGarmentCompletionBadge() {
    const badge = document.getElementById('garment-completion-badge');
    if (!badge) return;
    
    // Use the same logic as the working tab completion system
    const allGarments = Array.from(V10_State.garments.values());
    
    if (allGarments.length === 0) {
      // No garments = incomplete
      this.setBadgeIncomplete(badge, 0, 0);
      return;
    }
    
    // Count completed garments using the same logic as tab system
    const completeGarments = allGarments.filter(garment => garment.isComplete);
    const completeCount = completeGarments.length;
    const totalCount = allGarments.length;
    const isComplete = completeCount === totalCount;
    
    // Update badge based on completion status
    if (isComplete) {
      this.setBadgeComplete(badge);
    } else {
      this.setBadgeIncomplete(badge, completeCount, totalCount);
    }
  },
  
  // Set badge to complete state
  setBadgeComplete(badge) {
    badge.textContent = 'COMPLETE';
    badge.className = 'studio-header__badge studio-header__badge--complete';
  },
  
  // Set badge to incomplete state
  setBadgeIncomplete(badge, completeCount = 0, totalCount = 0) {
    if (totalCount === 0) {
      badge.textContent = 'INCOMPLETE';
    } else {
      badge.textContent = `INCOMPLETE (${completeCount}/${totalCount})`;
    }
    badge.className = 'studio-header__badge studio-header__badge--incomplete';
  },
  
  // Initialize badge checking
  init() {
    // Initial check for both badges
    this.updateGarmentCompletionBadge();
    this.updateDesignCompletionBadge();
    
    // Set up observers for dynamic updates
    this.observeGarmentChanges();
  },
  
  // Observe changes to garment container
  observeGarmentChanges() {
    const garmentContainer = document.getElementById('garment-studio');
    if (!garmentContainer) return;
    
    // Create observer to watch for changes
    const observer = new MutationObserver(() => {
      // Debounce the update to avoid excessive calls
      clearTimeout(this.updateTimeout);
      this.updateTimeout = setTimeout(() => {
        this.updateGarmentCompletionBadge();
      }, 100);
    });
    
    // Observe changes to the garment container
    observer.observe(garmentContainer, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
  },

  // Update design studio completion badge
  updateDesignCompletionBadge() {
    const badge = document.getElementById('design-completion-badge');
    if (!badge) return;
    
    // Get all garments from state
    const allGarments = Array.from(V10_State.garments.values());
    
    if (allGarments.length === 0) {
      // No garments = show creative (default state)
      this.setDesignBadgeCreative(badge);
      return;
    }
    
    // Count design requirements and fulfillments
    let totalRequirements = 0;
    let fulfilledRequirements = 0;
    
    allGarments.forEach(garment => {
      // Check if garment has custom color requirement (needs lab dip)
      // Only 'design-studio' custom samples require lab dip assignments
      if (garment.sampleType === 'custom' && garment.sampleSubValue === 'design-studio') {
        totalRequirements++;
        if (garment.assignedLabDips && garment.assignedLabDips.size > 0) {
          fulfilledRequirements++;
        }
      }
      
      // Check if garment has design requirements (for future extension)
      // This can be expanded to check for specific design requirements
      if (garment.assignedDesigns && garment.assignedDesigns.size > 0) {
        // If they have designs assigned, they had a requirement that's now fulfilled
        // This logic can be refined based on your specific requirements
      }
    });
    
    // Update badge based on completion status
    if (totalRequirements === 0) {
      // No design requirements = show creative
      this.setDesignBadgeCreative(badge);
    } else if (fulfilledRequirements === totalRequirements) {
      // All requirements fulfilled = complete
      this.setDesignBadgeComplete(badge);
    } else {
      // Some requirements unfulfilled = incomplete with fraction
      this.setDesignBadgeIncomplete(badge, fulfilledRequirements, totalRequirements);
    }
  },
  
  // Set design badge to creative state (default)
  setDesignBadgeCreative(badge) {
    badge.textContent = 'CREATIVE';
    badge.className = 'studio-header__badge studio-header__badge--creative';
  },
  
  // Set design badge to complete state
  setDesignBadgeComplete(badge) {
    badge.textContent = 'COMPLETE';
    badge.className = 'studio-header__badge studio-header__badge--complete';
  },
  
  // Set design badge to incomplete state
  setDesignBadgeIncomplete(badge, fulfilledCount = 0, totalCount = 0) {
    if (totalCount === 0) {
      badge.textContent = 'INCOMPLETE';
    } else {
      badge.textContent = `INCOMPLETE (${fulfilledCount}/${totalCount})`;
    }
    badge.className = 'studio-header__badge studio-header__badge--incomplete';
  }
};

// ==============================================
// UNIVERSAL MODAL OVERLAY CLICK PREVENTION
// ==============================================
// Prevents ALL modals from closing when clicking outside/overlay
// Simple function that works with any existing modal system
function initializeModalOverlayPrevention() {
  // Add global click listener with highest priority (capture phase)
  document.addEventListener('click', function(e) {
    // Check if click is on any modal overlay/backdrop
    const isModalOverlay = e.target.classList.contains('v10-modal-overlay') ||
                          e.target.classList.contains('wholesale-modal-overlay') ||
                          e.target.classList.contains('modal-overlay') ||
                          e.target.classList.contains('techpack-modal__backdrop') ||
                          (e.target.tagName === 'DIV' && 
                           e.target.style.position === 'fixed' && 
                           e.target.style.background && 
                           e.target.style.background.includes('rgba'));

    // If clicking on modal overlay, prevent the click from closing the modal
    if (isModalOverlay) {
      console.log('🚫 Modal overlay click prevented - user must use close/cancel buttons');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }

    // Also check if clicking on modal containers themselves (some systems check for this)
    const modalContainer = e.target.closest('[class*="modal"]');
    if (modalContainer && e.target === modalContainer) {
      // Only prevent if this is the modal background, not modal content
      const hasModalContent = modalContainer.querySelector('.v10-modal, .wholesale-modal-content, .modal__content, .techpack-modal__content');
      if (hasModalContent) {
        console.log('🚫 Modal container background click prevented');
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    }
  }, true); // Use capture phase to intercept before other handlers

  console.log('✅ Universal modal overlay click prevention initialized');
}

// ==============================================
// INITIALIZATION
// ==============================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('🚀 V10 TechPack Studios - Initializing System...');
    
    // Initialize modal overlay click prevention FIRST
    // This must run before any modal systems are initialized
    initializeModalOverlayPrevention();
    
    
    // Initialize badge manager
    V10_BadgeManager.init();

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
          
          // Initialize review manager for assignment tracking on Step 3
          if (!window.v10ReviewManager) {
            try {
              window.v10ReviewManager = new V10_ReviewManager();
              console.log('✅ Review Manager initialized for Step 3');
              
              // Initialize assignment overview
              setTimeout(() => {
                window.v10ReviewManager.populateGarmentAssignments();
                
                // Also update lab dip collection assignments
                if (window.v10ColorStudio) {
                  window.v10ColorStudio.updateLabDipCollectionAssignments();
                }
              }, 200);
            } catch (reviewError) {
              console.error('❌ Error initializing Review Manager:', reviewError);
            }
          }
          
          // Auto-initialize Quantity Studio for bulk orders
          if (requestType === 'bulk-order-request') {
            console.log('🎯 Bulk order detected - Auto-initializing Quantity Studio');
            setTimeout(() => {
              if (!window.v10QuantityStudio) {
                window.v10QuantityStudio = new V10_QuantityStudioManager();
                console.log('✅ Created V10_QuantityStudioManager instance');
              }
              window.v10QuantityStudio.initialize();
              console.log('✅ Quantity Studio auto-initialized for bulk order');
            }, 500);
          }
          
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

// V10 Guidance Modal System
window.V10_GuidanceModal = {
  show(title, content) {
    // Remove existing modal if any
    const existingModal = document.getElementById('v10-guidance-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'v10-guidance-modal';
    modal.className = 'v10-guidance-modal';
    modal.innerHTML = `
      <div class="v10-guidance-modal-content">
        <div class="v10-guidance-modal-header">
          <h3 class="v10-guidance-modal-title">${title}</h3>
          <button type="button" class="v10-guidance-modal-close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="15" y1="5" x2="5" y2="15"></line>
              <line x1="5" y1="5" x2="15" y2="15"></line>
            </svg>
          </button>
        </div>
        <div class="v10-guidance-modal-body">
          ${content}
        </div>
      </div>
    `;
    
    // Add to page
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Close handlers
    const closeBtn = modal.querySelector('.v10-guidance-modal-close');
    const closeModal = () => this.hide();
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    // ESC key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  },
  
  hide() {
    const modal = document.getElementById('v10-guidance-modal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    }
    document.body.style.overflow = '';
  }
};

// Shipping Options Guidance
function showShippingGuidance() {
  const content = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;" class="guidance-cards-grid">
      <!-- Air Freight Card -->
      <div style="background: var(--v10-bg-secondary); border: 1px solid var(--v10-border-primary); border-radius: var(--v10-radius-lg); padding: 1.5rem; position: relative;">
        <div style="background: #3b82f6; color: white; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 0; position: absolute; top: 1rem; right: 1rem; white-space: nowrap;">
          Ideal for samples & urgent deliveries
        </div>
        <h3 style="color: var(--v10-text-primary); font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; margin-top: 0.5rem;">Air Freight</h3>
        <div style="color: var(--v10-text-secondary); line-height: 1.6; space-y: 0.5rem;">
          <p style="margin-bottom: 0.5rem;"><strong>Delivery:</strong> 2–8 days worldwide (1–3 days in Europe)</p>
          <p style="margin-bottom: 0.5rem;"><strong>Cost:</strong> Higher than sea (fast but expensive)</p>
          <p style="margin-bottom: 0.5rem;"><strong>Best For:</strong> Samples, small runs, urgent launches</p>
          <p style="margin-bottom: 0;"><strong>Why Brands Choose It:</strong> Guaranteed speed and reliability</p>
        </div>
      </div>
      
      <!-- Sea Freight Card -->
      <div style="background: var(--v10-bg-secondary); border: 1px solid var(--v10-border-primary); border-radius: var(--v10-radius-lg); padding: 1.5rem; position: relative;">
        <div style="background: #059669; color: white; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 0; position: absolute; top: 1rem; right: 1rem; white-space: nowrap;">
          Best for bulk orders (500+ units) & global shipments
        </div>
        <h3 style="color: var(--v10-text-primary); font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; margin-top: 0.5rem;">Sea Freight</h3>
        <div style="color: var(--v10-text-secondary); line-height: 1.6;">
          <p style="margin-bottom: 0.5rem;"><strong>Delivery:</strong> 5–10 days in Europe, 20–45 days worldwide</p>
          <p style="margin-bottom: 0.5rem;"><strong>Cost:</strong> Lowest price per unit, especially 500+ pcs</p>
          <p style="margin-bottom: 0.5rem;"><strong>Best For:</strong> Bulk orders, large productions, outside Europe</p>
          <p style="margin-bottom: 0;"><strong>Why Brands Choose It:</strong> Cuts cost massively when scale matters</p>
        </div>
      </div>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;" class="guidance-cards-grid">
      <!-- With Insurance Card -->
      <div style="background: var(--v10-bg-secondary); border: 1px solid var(--v10-border-primary); border-radius: var(--v10-radius-lg); padding: 1.5rem; position: relative;">
        <div style="background: #f59e0b; color: white; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 0; position: absolute; top: 1rem; right: 1rem; white-space: nowrap;">
          Recommended for valuable or high-volume orders
        </div>
        <h3 style="color: var(--v10-text-primary); font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; margin-top: 0.5rem;">With Insurance</h3>
        <div style="color: var(--v10-text-secondary); line-height: 1.6;">
          <p style="margin-bottom: 0.5rem;"><strong>Coverage:</strong> Full protection if goods are lost or damaged</p>
          <p style="margin-bottom: 0.5rem;"><strong>Extra Cost:</strong> 2–6% of invoice value</p>
          <p style="margin-bottom: 0.5rem;"><strong>Best For:</strong> Large or valuable shipments</p>
          <p style="margin-bottom: 0;"><strong>Why Brands Choose It:</strong> Peace of mind—safe even if issues occur</p>
        </div>
      </div>
      
      <!-- No Insurance Card -->
      <div style="background: var(--v10-bg-secondary); border: 1px solid var(--v10-border-primary); border-radius: var(--v10-radius-lg); padding: 1.5rem; position: relative;">
        <div style="background: #6b7280; color: white; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 0; position: absolute; top: 1rem; right: 1rem; white-space: nowrap;">
          Suitable only for low-value or test runs
        </div>
        <h3 style="color: var(--v10-text-primary); font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; margin-top: 0.5rem;">No Insurance</h3>
        <div style="color: var(--v10-text-secondary); line-height: 1.6;">
          <p style="margin-bottom: 0.5rem;"><strong>Coverage:</strong> Basic carrier liability only</p>
          <p style="margin-bottom: 0.5rem;"><strong>Extra Cost:</strong> None</p>
          <p style="margin-bottom: 0.5rem;"><strong>Best For:</strong> Low-value or test shipments</p>
          <p style="margin-bottom: 0;"><strong>Why Brands Choose It:</strong> Cheapest option when risk is low</p>
        </div>
      </div>
    </div>
  `;
  
  window.V10_GuidanceModal.show('Shipping & Insurance Options', content);
}

// ====================================================
// UNIVERSAL FORM VALIDATION ENGINE
// ====================================================

class UniversalFormValidator {
  constructor() {
    this.errorMessages = {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      minLength: 'This field is too short',
      maxLength: 'This field is too long',
      pattern: 'Please enter a valid format',
      radio: 'Please select an option',
      checkbox: 'This field must be checked',
      file: 'Please select a file'
    };
  }

  // Validate a single field
  validateField(field) {
    const value = field.value?.trim() || '';
    const type = field.type;
    const required = field.hasAttribute('required');
    const errors = [];

    // Check if required field is empty
    if (required && (!value || (type === 'radio' && !this.isRadioGroupSelected(field)))) {
      if (type === 'radio') {
        errors.push(this.errorMessages.radio);
      } else if (type === 'checkbox') {
        errors.push(this.errorMessages.checkbox);
      } else if (type === 'file') {
        errors.push(this.errorMessages.file);
      } else {
        errors.push(this.errorMessages.required);
      }
    }

    // Email validation
    if (value && type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors.push(this.errorMessages.email);
      }
    }

    // Pattern validation
    if (value && field.hasAttribute('pattern')) {
      const pattern = new RegExp(field.getAttribute('pattern'));
      if (!pattern.test(value)) {
        errors.push(this.errorMessages.pattern);
      }
    }

    // Length validation
    const minLength = field.getAttribute('minlength');
    const maxLength = field.getAttribute('maxlength');
    
    if (value && minLength && value.length < parseInt(minLength)) {
      errors.push(`${this.errorMessages.minLength} (minimum ${minLength} characters)`);
    }
    
    if (value && maxLength && value.length > parseInt(maxLength)) {
      errors.push(`${this.errorMessages.maxLength} (maximum ${maxLength} characters)`);
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Check if any radio button in a group is selected
  isRadioGroupSelected(radioField) {
    const name = radioField.name;
    if (!name) return false;
    
    const radioButtons = document.querySelectorAll(`input[type="radio"][name="${name}"]`);
    return Array.from(radioButtons).some(radio => radio.checked);
  }

  // Show error for a field
  showFieldError(field, message) {
    this.clearFieldError(field);
    
    // Add error class to field container
    const fieldContainer = this.getFieldContainer(field);
    if (fieldContainer) {
      fieldContainer.classList.add('error');
    }
    
    // Add error class directly to field
    field.classList.add('error');
    
    // Create and show error message
    if (message) {
      const errorElement = document.createElement('div');
      errorElement.className = 'field-error-message';
      errorElement.textContent = message;
      errorElement.setAttribute('data-field-error', field.name || field.id || 'unknown');
      
      // Insert error message after the field
      field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
  }

  // Clear error for a field
  clearFieldError(field) {
    // Remove error class from field container
    const fieldContainer = this.getFieldContainer(field);
    if (fieldContainer) {
      fieldContainer.classList.remove('error');
    }
    
    // Remove error class from field
    field.classList.remove('error');
    
    // Remove error message
    const errorMessage = field.parentNode.querySelector('.field-error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  // Find the field container (parent with form-field or v10-form-field class)
  getFieldContainer(field) {
    let container = field.parentNode;
    while (container && container !== document.body) {
      if (container.classList.contains('form-field') || 
          container.classList.contains('v10-form-field') ||
          container.classList.contains('form-group') ||
          container.classList.contains('form-section')) {
        return container;
      }
      container = container.parentNode;
    }
    return null;
  }

  // Validate entire form
  validateForm(formElement) {
    const fields = formElement.querySelectorAll('input, textarea, select');
    let isFormValid = true;
    const fieldErrors = [];

    fields.forEach(field => {
      const validation = this.validateField(field);
      
      if (!validation.isValid) {
        isFormValid = false;
        fieldErrors.push({
          field: field,
          errors: validation.errors
        });
        
        // Show error for first error message
        this.showFieldError(field, validation.errors[0]);
      } else {
        // Clear any existing errors for valid fields
        this.clearFieldError(field);
      }
    });

    // Handle radio button group validation
    const radioGroups = this.getRadioGroups(formElement);
    radioGroups.forEach(group => {
      const requiredRadio = group.find(radio => radio.hasAttribute('required'));
      if (requiredRadio && !this.isRadioGroupSelected(requiredRadio)) {
        isFormValid = false;
        
        // Add error styling to radio group container
        const groupContainer = this.getRadioGroupContainer(group[0]);
        if (groupContainer) {
          groupContainer.classList.add('error');
          
          // Add error message if not already present
          if (!groupContainer.querySelector('.field-error-message')) {
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error-message';
            errorElement.textContent = this.errorMessages.radio;
            groupContainer.appendChild(errorElement);
          }
        }
      }
    });

    // 🔧 CONDITIONAL SECTION VALIDATION: Check "Different Address" fields for sample-request and bulk-order-request
    const requestType = window.V10_State?.requestType;
    if (requestType === 'sample-request' || requestType === 'bulk-order-request') {
      const selectedDelivery = document.querySelector('input[name="deliveryAddress"]:checked');
      if (selectedDelivery?.value === 'different') {
        const differentAddressForm = document.getElementById('v10-different-address-form');
        if (differentAddressForm && differentAddressForm.style.display !== 'none') {
          // Validate all fields with data-validate="required-if-different" in the different address form
          const conditionalFields = differentAddressForm.querySelectorAll('[data-validate="required-if-different"]');
          
          conditionalFields.forEach(field => {
            if (!field.value?.trim()) {
              isFormValid = false;
              
              // Add visual error state
              const fieldContainer = field.closest('.v10-form-field');
              if (fieldContainer) {
                fieldContainer.classList.add('error');
                
                // Add error message if not already present
                if (!fieldContainer.querySelector('.field-error-message')) {
                  const errorElement = document.createElement('div');
                  errorElement.className = 'field-error-message';
                  errorElement.textContent = 'This field is required for different address';
                  fieldContainer.appendChild(errorElement);
                }
              }
              
              // Add to field errors array for comprehensive tracking
              fieldErrors.push({
                field: field,
                errors: ['This field is required for different address']
              });
            } else {
              // Clear errors for valid conditional fields
              const fieldContainer = field.closest('.v10-form-field');
              if (fieldContainer) {
                fieldContainer.classList.remove('error');
                const errorMessage = fieldContainer.querySelector('.field-error-message');
                if (errorMessage) {
                  errorMessage.remove();
                }
              }
            }
          });
        }
      }
    }

    return {
      isValid: isFormValid,
      errors: fieldErrors
    };
  }

  // Get radio button groups
  getRadioGroups(formElement) {
    const radioButtons = formElement.querySelectorAll('input[type="radio"]');
    const groups = {};
    
    radioButtons.forEach(radio => {
      const name = radio.name;
      if (name) {
        if (!groups[name]) {
          groups[name] = [];
        }
        groups[name].push(radio);
      }
    });
    
    return Object.values(groups);
  }

  // Find radio group container
  getRadioGroupContainer(radioField) {
    let container = radioField.parentNode;
    while (container && container !== document.body) {
      if (container.classList.contains('radio-group') || 
          container.classList.contains('form-group') ||
          container.classList.contains('form-section')) {
        return container;
      }
      container = container.parentNode;
    }
    return null;
  }

  // Set up error clearing when user fixes fields
  setupErrorClearing(formElement) {
    const fields = formElement.querySelectorAll('input, textarea, select');
    
    fields.forEach(field => {
      // Only clear errors when user types/changes, don't show new errors
      const clearError = () => {
        if (field.classList.contains('error')) {
          const validation = this.validateField(field);
          if (validation.isValid) {
            this.clearFieldError(field);
          }
        }
      };
      
      // Add event listeners to clear errors only
      if (field.type === 'radio' || field.type === 'checkbox') {
        field.addEventListener('change', clearError);
      } else {
        field.addEventListener('input', clearError);
      }
    });
  }

  // Initialize validation for all forms on page (error clearing only)
  initializeAll() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      this.setupErrorClearing(form);
    });
  }

  // Manual validation trigger for button clicks
  validateAndProceed(formElement) {
    const validation = this.validateForm(formElement);
    if (!validation.isValid) {
      // Scroll to first error - check main form first
      let firstError = formElement.querySelector('.error');
      
      // 🔧 CONDITIONAL SECTION ERROR SCROLLING: If no error in main form, check conditional sections
      if (!firstError) {
        const requestType = window.V10_State?.requestType;
        if (requestType === 'sample-request' || requestType === 'bulk-order-request') {
          const differentAddressForm = document.getElementById('v10-different-address-form');
          if (differentAddressForm && differentAddressForm.style.display !== 'none') {
            firstError = differentAddressForm.querySelector('.error');
          }
        }
      }
      
      // Scroll to first error found (main form or conditional section)
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    return true;
  }
}

// Create global instance
window.FormValidator = new UniversalFormValidator();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.FormValidator.initializeAll();
  });
} else {
  window.FormValidator.initializeAll();
}

// Export for global access
window.V10_TechPackSystem = V10_TechPackSystem;
window.V10_ClientManager = V10_ClientManager;
window.V10_FileManager = V10_FileManager;
window.V10_ModalManager = V10_ModalManager;
window.V10_State = V10_State;
window.V10_CONFIG = V10_CONFIG;
window.V10_BadgeManager = V10_BadgeManager;

} // End of guard clause