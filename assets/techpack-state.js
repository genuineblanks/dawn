/**
 * TechPack State Management System
 * Clean, focused state management with persistence and validation
 * Single source of truth for all application data
 */

(function() {
  'use strict';

  /**
   * TechPack Application State Manager
   * Handles all form data, step management, and persistence
   */
  class TechPackState {
    constructor() {
      // Core state properties
      this.currentStep = 0; // Start at step 0 (verification)
      this.isInitialized = false;
      
      // Form data structure
      this.formData = {
        clientInfo: {
          isReturning: null,
          clientName: '',
          companyName: '',
          email: '',
          vatEin: '',
          phone: '',
          country: '',
          productionType: '',
          deadline: '',
          notes: ''
        },
        files: [],
        garments: [],
        requiredGarmentCount: 1
      };

      // UI state
      this.ui = {
        currentErrors: new Map(),
        loadingStates: new Set(),
        animations: new Map()
      };

      // Observers for state changes
      this.observers = new Set();
      
      // Auto-save configuration
      this.autoSave = {
        enabled: true,
        interval: 30000, // 30 seconds
        lastSave: null,
        timer: null
      };

      // Initialize persistence
      this.initializePersistence();
    }

    /**
     * Initialize local storage persistence
     */
    initializePersistence() {
      try {
        // Load saved state if available
        const savedState = localStorage.getItem('techpack-form-state');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          this.restoreState(parsedState);
        }

        // Setup auto-save
        if (this.autoSave.enabled) {
          this.startAutoSave();
        }

        console.log('✅ State persistence initialized');
      } catch (error) {
        console.warn('⚠️ Failed to initialize persistence:', error);
      }
    }

    /**
     * Restore state from saved data
     */
    restoreState(savedState) {
      try {
        // Merge saved data with current state
        if (savedState.formData) {
          this.formData = {
            ...this.formData,
            ...savedState.formData,
            clientInfo: {
              ...this.formData.clientInfo,
              ...savedState.formData.clientInfo
            }
          };
        }

        if (savedState.currentStep !== undefined) {
          this.currentStep = savedState.currentStep;
        }

        console.log('✅ State restored from persistence');
      } catch (error) {
        console.warn('⚠️ Failed to restore state:', error);
      }
    }

    /**
     * Start auto-save timer
     */
    startAutoSave() {
      if (this.autoSave.timer) {
        clearInterval(this.autoSave.timer);
      }

      this.autoSave.timer = setInterval(() => {
        this.saveState();
      }, this.autoSave.interval);
    }

    /**
     * Stop auto-save timer
     */
    stopAutoSave() {
      if (this.autoSave.timer) {
        clearInterval(this.autoSave.timer);
        this.autoSave.timer = null;
      }
    }

    /**
     * Save current state to localStorage
     */
    saveState() {
      try {
        const stateToSave = {
          currentStep: this.currentStep,
          formData: this.formData,
          timestamp: new Date().toISOString()
        };

        localStorage.setItem('techpack-form-state', JSON.stringify(stateToSave));
        this.autoSave.lastSave = new Date();
        
        console.log('💾 State saved to localStorage');
      } catch (error) {
        console.warn('⚠️ Failed to save state:', error);
      }
    }

    /**
     * Clear saved state
     */
    clearSavedState() {
      try {
        localStorage.removeItem('techpack-form-state');
        console.log('🗑️ Saved state cleared');
      } catch (error) {
        console.warn('⚠️ Failed to clear saved state:', error);
      }
    }

    /**
     * Subscribe to state changes
     */
    subscribe(callback) {
      if (typeof callback === 'function') {
        this.observers.add(callback);
        return () => this.observers.delete(callback);
      }
    }

    /**
     * Notify all observers of state changes
     */
    notifyObservers(changes = {}) {
      this.observers.forEach(callback => {
        try {
          callback(this.getState(), changes);
        } catch (error) {
          console.error('Observer callback error:', error);
        }
      });
    }

    /**
     * Get current state (immutable copy)
     */
    getState() {
      return JSON.parse(JSON.stringify({
        currentStep: this.currentStep,
        formData: this.formData,
        ui: {
          currentErrors: Object.fromEntries(this.ui.currentErrors),
          loadingStates: Array.from(this.ui.loadingStates)
        },
        isInitialized: this.isInitialized
      }));
    }

    // === STEP MANAGEMENT ===

    /**
     * Get current step number
     */
    getCurrentStep() {
      return this.currentStep;
    }

    /**
     * Set current step
     */
    setCurrentStep(stepNumber) {
      const oldStep = this.currentStep;
      this.currentStep = stepNumber;
      
      this.notifyObservers({ stepChanged: { from: oldStep, to: stepNumber } });
      this.saveState();
    }

    /**
     * Check if can navigate to next step
     */
    canNavigateNext() {
      return this.currentStep < 4;
    }

    /**
     * Check if can navigate to previous step
     */
    canNavigatePrevious() {
      return this.currentStep > 1;
    }

    // === CLIENT INFO MANAGEMENT ===

    /**
     * Get client information
     */
    getClientInfo() {
      return { ...this.formData.clientInfo };
    }

    /**
     * Set client information
     */
    setClientInfo(clientInfo) {
      this.formData.clientInfo = {
        ...this.formData.clientInfo,
        ...clientInfo
      };
      
      this.notifyObservers({ clientInfoChanged: clientInfo });
      this.saveState();
    }

    /**
     * Update single client info field
     */
    updateClientField(field, value) {
      this.formData.clientInfo[field] = value;
      
      this.notifyObservers({ clientFieldChanged: { field, value } });
      this.saveState();
    }

    /**
     * Validate client information
     */
    validateClientInfo() {
      const errors = {};
      const info = this.formData.clientInfo;

      // Required fields
      if (!info.clientName?.trim()) {
        errors.clientName = 'Contact name is required';
      }

      if (!info.companyName?.trim()) {
        errors.companyName = 'Business/Brand name is required';
      }

      if (!info.email?.trim()) {
        errors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
        errors.email = 'Please enter a valid email address';
      }

      if (!info.country?.trim()) {
        errors.country = 'Business location is required';
      }

      if (!info.productionType?.trim()) {
        errors.productionType = 'Production type is required';
      }

      // VAT/EIN validation for new clients
      if (info.isReturning === false && !info.vatEin?.trim()) {
        errors.vatEin = 'VAT/EIN number is required for new businesses';
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    }

    // === FILE MANAGEMENT ===

    /**
     * Get all files
     */
    getFiles() {
      return [...this.formData.files];
    }

    /**
     * Add files
     */
    addFiles(files) {
      const newFiles = files.map(file => ({
        id: this.generateId('file'),
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        category: '',
        uploadedAt: new Date().toISOString()
      }));

      this.formData.files.push(...newFiles);
      
      this.notifyObservers({ filesAdded: newFiles });
      this.saveState();
      
      return newFiles;
    }

    /**
     * Remove file by ID
     */
    removeFile(fileId) {
      const index = this.formData.files.findIndex(f => f.id === fileId);
      if (index !== -1) {
        const removedFile = this.formData.files.splice(index, 1)[0];
        
        this.notifyObservers({ fileRemoved: removedFile });
        this.saveState();
        
        return removedFile;
      }
      return null;
    }

    /**
     * Update file category
     */
    updateFileCategory(fileId, category) {
      const file = this.formData.files.find(f => f.id === fileId);
      if (file) {
        file.category = category;
        
        this.notifyObservers({ fileCategoryChanged: { fileId, category } });
        this.saveState();
      }
    }

    /**
     * Validate files
     */
    validateFiles() {
      const files = this.formData.files;
      const errors = {};

      if (files.length === 0) {
        errors.general = 'At least one file is required';
      }

      // Check for files without categories
      const uncategorizedFiles = files.filter(f => !f.category);
      if (uncategorizedFiles.length > 0) {
        errors.categories = `${uncategorizedFiles.length} file(s) need category selection`;
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    }

    // === GARMENT MANAGEMENT ===

    /**
     * Get all garments
     */
    getGarments() {
      return [...this.formData.garments];
    }

    /**
     * Add new garment
     */
    addGarment(garmentData = {}) {
      const newGarment = {
        id: this.generateId('garment'),
        garmentType: '',
        description: '',
        colorways: [
          {
            id: this.generateId('colorway'),
            name: '',
            quantity: 0,
            pantoneColor: '',
            fabricType: '',
            sizes: []
          }
        ],
        totalQuantity: 0,
        createdAt: new Date().toISOString(),
        ...garmentData
      };

      this.formData.garments.push(newGarment);
      
      this.notifyObservers({ garmentAdded: newGarment });
      this.saveState();
      
      return newGarment;
    }

    /**
     * Remove garment by ID
     */
    removeGarment(garmentId) {
      const index = this.formData.garments.findIndex(g => g.id === garmentId);
      if (index !== -1) {
        const removedGarment = this.formData.garments.splice(index, 1)[0];
        
        this.notifyObservers({ garmentRemoved: removedGarment });
        this.saveState();
        
        return removedGarment;
      }
      return null;
    }

    /**
     * Update garment data
     */
    updateGarment(garmentId, updates) {
      const garment = this.formData.garments.find(g => g.id === garmentId);
      if (garment) {
        Object.assign(garment, updates);
        
        // Recalculate total quantity
        garment.totalQuantity = garment.colorways.reduce((sum, colorway) => sum + (colorway.quantity || 0), 0);
        
        this.notifyObservers({ garmentUpdated: { garmentId, updates } });
        this.saveState();
      }
    }

    /**
     * Add colorway to garment
     */
    addColorway(garmentId, colorwayData = {}) {
      const garment = this.formData.garments.find(g => g.id === garmentId);
      if (garment) {
        const newColorway = {
          id: this.generateId('colorway'),
          name: '',
          quantity: 0,
          pantoneColor: '',
          fabricType: '',
          sizes: [],
          ...colorwayData
        };

        garment.colorways.push(newColorway);
        this.updateGarment(garmentId, {}); // Trigger recalculation
        
        return newColorway;
      }
      return null;
    }

    /**
     * Remove colorway from garment
     */
    removeColorway(garmentId, colorwayId) {
      const garment = this.formData.garments.find(g => g.id === garmentId);
      if (garment) {
        const index = garment.colorways.findIndex(c => c.id === colorwayId);
        if (index !== -1) {
          const removedColorway = garment.colorways.splice(index, 1)[0];
          this.updateGarment(garmentId, {}); // Trigger recalculation
          return removedColorway;
        }
      }
      return null;
    }

    /**
     * Get total quantity across all garments
     */
    getTotalQuantity() {
      return this.formData.garments.reduce((sum, garment) => sum + garment.totalQuantity, 0);
    }

    /**
     * Validate garments
     */
    validateGarments() {
      const garments = this.formData.garments;
      const errors = {};

      if (garments.length === 0) {
        errors.general = 'At least one garment is required';
        return { isValid: false, errors };
      }

      // Validate each garment
      garments.forEach((garment, index) => {
        const garmentErrors = {};

        if (!garment.garmentType?.trim()) {
          garmentErrors.garmentType = 'Garment type is required';
        }

        if (!garment.description?.trim()) {
          garmentErrors.description = 'Garment description is required';
        }

        if (garment.colorways.length === 0) {
          garmentErrors.colorways = 'At least one colorway is required';
        } else {
          // Validate colorways
          garment.colorways.forEach((colorway, colorwayIndex) => {
            if (!colorway.name?.trim()) {
              garmentErrors[`colorway_${colorwayIndex}_name`] = 'Colorway name is required';
            }
            if (!colorway.quantity || colorway.quantity <= 0) {
              garmentErrors[`colorway_${colorwayIndex}_quantity`] = 'Quantity must be greater than 0';
            }
          });
        }

        if (Object.keys(garmentErrors).length > 0) {
          errors[`garment_${index}`] = garmentErrors;
        }
      });

      // Check minimum quantity requirements
      const totalQuantity = this.getTotalQuantity();
      const minQuantity = this.getMinimumQuantity();
      
      if (totalQuantity < minQuantity) {
        errors.totalQuantity = `Total quantity (${totalQuantity}) must be at least ${minQuantity}`;
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    }

    /**
     * Get minimum quantity based on production type and colorway count
     */
    getMinimumQuantity() {
      const productionType = this.formData.clientInfo.productionType;
      const totalColorways = this.formData.garments.reduce((sum, garment) => sum + garment.colorways.length, 0);
      
      if (productionType === 'our-blanks') {
        return totalColorways === 1 ? 30 : 20;
      }
      
      return totalColorways === 1 ? 75 : 50;
    }

    // === ERROR MANAGEMENT ===

    /**
     * Set field error
     */
    setError(field, message) {
      this.ui.currentErrors.set(field, message);
      this.notifyObservers({ errorSet: { field, message } });
    }

    /**
     * Clear field error
     */
    clearError(field) {
      this.ui.currentErrors.delete(field);
      this.notifyObservers({ errorCleared: { field } });
    }

    /**
     * Clear all errors
     */
    clearAllErrors() {
      this.ui.currentErrors.clear();
      this.notifyObservers({ allErrorsCleared: true });
    }

    /**
     * Get field error
     */
    getError(field) {
      return this.ui.currentErrors.get(field);
    }

    /**
     * Check if field has error
     */
    hasError(field) {
      return this.ui.currentErrors.has(field);
    }

    // === LOADING STATE MANAGEMENT ===

    /**
     * Set loading state
     */
    setLoading(key, isLoading = true) {
      if (isLoading) {
        this.ui.loadingStates.add(key);
      } else {
        this.ui.loadingStates.delete(key);
      }
      
      this.notifyObservers({ loadingChanged: { key, isLoading } });
    }

    /**
     * Check if currently loading
     */
    isLoading(key) {
      return this.ui.loadingStates.has(key);
    }

    // === UTILITY METHODS ===

    /**
     * Generate unique ID
     */
    generateId(prefix = 'item') {
      return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Check if form has unsaved data
     */
    hasUnsavedData() {
      // Check if any form fields have data
      const { clientInfo, files, garments } = this.formData;
      
      return (
        Object.values(clientInfo).some(value => value && value.toString().trim() !== '') ||
        files.length > 0 ||
        garments.length > 0
      );
    }

    /**
     * Reset form data
     */
    reset() {
      this.currentStep = 0;
      this.formData = {
        clientInfo: {
          isReturning: null,
          clientName: '',
          companyName: '',
          email: '',
          vatEin: '',
          phone: '',
          country: '',
          productionType: '',
          deadline: '',
          notes: ''
        },
        files: [],
        garments: [],
        requiredGarmentCount: 1
      };
      this.ui.currentErrors.clear();
      this.ui.loadingStates.clear();
      
      this.clearSavedState();
      this.notifyObservers({ formReset: true });
    }

    /**
     * Get form completion percentage
     */
    getCompletionPercentage() {
      let completed = 0;
      let total = 0;

      // Client info (40% of total)
      const clientValidation = this.validateClientInfo();
      if (clientValidation.isValid) completed += 40;
      total += 40;

      // Files (30% of total)
      const fileValidation = this.validateFiles();
      if (fileValidation.isValid) completed += 30;
      total += 30;

      // Garments (30% of total)
      const garmentValidation = this.validateGarments();
      if (garmentValidation.isValid) completed += 30;
      total += 30;

      return total > 0 ? Math.round((completed / total) * 100) : 0;
    }

    /**
     * Destroy state manager
     */
    destroy() {
      this.stopAutoSave();
      this.observers.clear();
      this.ui.currentErrors.clear();
      this.ui.loadingStates.clear();
    }
  }

  // Export for use in other modules
  window.TechPackState = TechPackState;

})();