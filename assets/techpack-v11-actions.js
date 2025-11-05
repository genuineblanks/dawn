/**
 * TechPack V11 - Actions & Navigation
 * Purpose: Handle button clicks, navigation, form submission
 * Dependencies: techpack-v11-core.js
 */

(function() {
  'use strict';

  /**
   * ==========================================================================
   * NAVIGATION
   * ==========================================================================
   */
  const Navigation = {
    /**
     * Initialize navigation handlers
     */
    init: function() {
      // Listen for all click events
      document.addEventListener('click', (e) => {
        const action = e.target.closest('[data-action]');
        if (!action) return;

        const actionType = action.getAttribute('data-action');
        this.handleAction(actionType, action, e);
      });

      // Listen for form submissions
      document.addEventListener('submit', (e) => {
        const form = e.target.closest('.step-form');
        if (form) {
          e.preventDefault();
          this.handleFormSubmit(form);
        }
      });
    },

    /**
     * Handle action buttons
     */
    handleAction: function(actionType, element, event) {
      console.log('[Navigation] Action:', actionType);

      switch (actionType) {
        case 'next-step':
          this.goToNextStep();
          break;

        case 'previous-step':
          this.goToPreviousStep();
          break;

        case 'save-draft':
          this.saveDraft();
          break;

        case 'edit-step':
          const step = element.getAttribute('data-step');
          this.goToStep(parseInt(step));
          break;

        case 'submit-quotation':
          this.submitQuotation();
          break;

        case 'toggle-test-mode':
          this.toggleTestMode();
          break;

        case 'trigger-file-input':
          const target = element.getAttribute('data-target');
          this.triggerFileInput(target);
          break;

        case 'clear-all':
          this.clearAllSelections();
          break;

        case 'start-quotation':
        case 'start-sample':
        case 'start-bulk':
          this.startFlow(actionType.replace('start-', ''));
          break;

        case 'start-adding-garment':
          if (window.TechPackV11.Garments) {
            window.TechPackV11.Garments.startAddingGarment();
          }
          break;

        case 'select-garment-type':
          if (window.TechPackV11.Garments) {
            const garmentType = element.getAttribute('data-garment-type');
            window.TechPackV11.Garments.showFabricTypeStep(garmentType);
          }
          break;

        case 'select-fabric-type':
          if (window.TechPackV11.Garments) {
            const fabricType = element.getAttribute('data-fabric-type');
            const garmentType = window.TechPackV11.Garments.selectedGarmentType;
            if (garmentType) {
              window.TechPackV11.Garments.addGarment(garmentType, fabricType);
            }
          }
          break;

        case 'back-to-garment-types':
          if (window.TechPackV11.Garments) {
            window.TechPackV11.Garments.showGarmentTypeStep();
          }
          break;

        case 'edit-garment':
          // Check which flow: Sample (Step3B) or Quotation (Garments)
          if (element.getAttribute('data-garment-id')) {
            // Sample Flow - navigate back to previous step (Step 3A)
            const garmentId = element.getAttribute('data-garment-id');
            console.log('[Actions] Sample: Navigating back to previous step to edit garment:', garmentId);

            // Store garment ID for visual highlighting in Step 3A
            localStorage.setItem('v11_editing_garment_id', garmentId);

            this.goToPreviousStep();
          } else if (window.TechPackV11.Garments) {
            // Quotation Flow
            const garmentId = element.getAttribute('data-id');
            window.TechPackV11.Garments.editGarment(garmentId);
          }
          break;

        case 'duplicate-garment':
          if (window.TechPackV11.Garments) {
            const garmentId = element.getAttribute('data-id');
            window.TechPackV11.Garments.duplicateGarment(garmentId);
          }
          break;

        case 'delete-garment':
          // Check which flow: Sample (Step3B), Bulk (Step4), or Quotation (Garments)
          if (element.getAttribute('data-garment-id')) {
            // Sample Flow or Bulk Flow - delete from garments array
            if (window.TechPackV11.Step3B) {
              // Sample Step 3B
              const garmentId = element.getAttribute('data-garment-id');
              const garmentIndex = window.TechPackV11.Step3B.garments.findIndex(g => g.id === garmentId);

              if (garmentIndex !== -1) {
                const garment = window.TechPackV11.Step3B.garments[garmentIndex];

                if (confirm(`Delete ${garment.type}? This will remove it completely from your list.`)) {
                  // If it has a Pantone color assigned, return it to lab dip cart
                  if (garment.colorType === 'pantone' && garment.pantoneColor) {
                    const labDip = {
                      id: garment.pantoneColor.labDipId || ('labdip-' + Date.now()),
                      code: garment.pantoneColor.code,
                      name: garment.pantoneColor.name,
                      hex: garment.pantoneColor.hex,
                      price: garment.pantoneColor.price || 25.00
                    };
                    window.TechPackV11.Step3B.labDipCart.push(labDip);
                    console.log('[Actions] Sample: Returned Pantone to cart before deleting garment');
                  }

                  // Remove from garments array
                  window.TechPackV11.Step3B.garments.splice(garmentIndex, 1);

                  console.log('[Actions] Sample: Deleted garment:', garment.type);
                  window.TechPackV11.Step3B.saveToStorage();
                  window.TechPackV11.Step3B.renderGarmentList();
                  window.TechPackV11.Step3B.renderLabDipCart();
                  window.TechPackV11.Step3B.updateNavigationState();
                }
              }
            } else if (window.TechPackV11.BulkStep4) {
              // Bulk Step 4
              const garmentId = element.getAttribute('data-garment-id');
              const garmentIndex = window.TechPackV11.BulkStep4.garments.findIndex(g => g.id === garmentId);

              if (garmentIndex !== -1) {
                const garment = window.TechPackV11.BulkStep4.garments[garmentIndex];

                if (confirm(`Delete ${garment.type}? This will remove all colorways and data for this garment.`)) {
                  // Remove from garments array
                  window.TechPackV11.BulkStep4.garments.splice(garmentIndex, 1);

                  console.log('[Actions] Bulk: Deleted garment:', garment.type);
                  window.TechPackV11.BulkStep4.saveToStorage();
                  window.TechPackV11.BulkStep4.render();
                  window.TechPackV11.BulkStep4.updateMOQProgress();
                }
              }
            }
          } else if (window.TechPackV11.Garments) {
            // Quotation Flow
            const garmentId = element.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this garment?')) {
              window.TechPackV11.Garments.deleteGarment(garmentId);
            }
          }
          break;

        // ===================================================================
        // SAMPLE REQUEST ACTIONS
        // ===================================================================

        case 'sample-start-adding-garment':
          if (window.TechPackV11.SampleGarments) {
            window.TechPackV11.SampleGarments.startAddingGarment();
          }
          break;

        case 'sample-select-garment-type':
          if (window.TechPackV11.SampleGarments) {
            const garmentType = element.getAttribute('data-garment-type');
            window.TechPackV11.SampleGarments.showFabricTypeStep(garmentType);
          }
          break;

        case 'sample-select-fabric-type':
          if (window.TechPackV11.SampleGarments) {
            const fabricType = element.getAttribute('data-fabric-type');
            // NEW WORKFLOW: Add garment without color after fabric selection
            window.TechPackV11.SampleGarments.addGarmentAfterFabricSelection(fabricType);
          }
          break;

        // REMOVED: sample-select-sample-type - Now in Step 3B

        case 'sample-back-to-garment-types':
          if (window.TechPackV11.SampleGarments) {
            window.TechPackV11.SampleGarments.backToGarmentTypes();
          }
          break;

        // REMOVED: sample-back-to-fabric-types and sample-back-to-sample-types - Step 3 simplified

        case 'sample-cancel-selection':
          if (window.TechPackV11.SampleGarments) {
            window.TechPackV11.SampleGarments.cancelSelection();
          }
          break;

        case 'sample-edit-garment':
          if (window.TechPackV11.SampleGarments) {
            const garmentId = element.getAttribute('data-id');
            // Set editing highlight (show orange overlay)
            localStorage.setItem('v11_editing_garment_id', garmentId);
            window.TechPackV11.SampleGarments.editGarment(garmentId);
          }
          break;

        case 'sample-duplicate-garment':
          if (window.TechPackV11.SampleGarments) {
            const garmentId = element.getAttribute('data-id');
            localStorage.removeItem('v11_editing_garment_id'); // Clear editing highlight
            window.TechPackV11.SampleGarments.duplicateGarment(garmentId);
          }
          break;

        case 'sample-delete-garment':
          if (window.TechPackV11.SampleGarments) {
            const garmentId = element.getAttribute('data-id');
            localStorage.removeItem('v11_editing_garment_id'); // Clear editing highlight
            window.TechPackV11.SampleGarments.deleteGarment(garmentId);
          }
          break;

        // ===================================================================
        // BULK ORDER ACTIONS - Step 1 (Shipping Guidance)
        // ===================================================================

        case 'show-shipping-guidance':
          const shippingModal = document.getElementById('shippingGuidanceModal');
          if (shippingModal) {
            shippingModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
          }
          break;

        case 'close-shipping-guidance':
          const shippingModalClose = document.getElementById('shippingGuidanceModal');
          if (shippingModalClose) {
            shippingModalClose.style.display = 'none';
            document.body.style.overflow = '';
          }
          break;

        // ===================================================================
        // BULK ORDER ACTIONS - Step 3 (Garment Building)
        // ===================================================================

        case 'bulk-start-adding-garment':
          if (window.TechPackV11.BulkGarments) {
            window.TechPackV11.BulkGarments.startAddingGarment();
          }
          break;

        case 'bulk-select-garment-type':
          if (window.TechPackV11.BulkGarments) {
            const garmentType = element.getAttribute('data-garment-type');
            window.TechPackV11.BulkGarments.showFabricTypeStep(garmentType);
          }
          break;

        case 'bulk-select-fabric-type':
          if (window.TechPackV11.BulkGarments) {
            const fabricType = element.getAttribute('data-fabric-type');
            window.TechPackV11.BulkGarments.addGarmentAfterFabricSelection(fabricType);
          }
          break;

        case 'bulk-back-to-garment-types':
          if (window.TechPackV11.BulkGarments) {
            window.TechPackV11.BulkGarments.backToGarmentTypes();
          }
          break;

        case 'bulk-cancel-selection':
          if (window.TechPackV11.BulkGarments) {
            window.TechPackV11.BulkGarments.cancelSelection();
          }
          break;

        case 'bulk-edit-garment':
          if (window.TechPackV11.BulkGarments) {
            const garmentId = element.getAttribute('data-id');
            window.TechPackV11.BulkGarments.editGarment(garmentId);
          }
          break;

        case 'bulk-duplicate-garment':
          if (window.TechPackV11.BulkGarments) {
            const garmentId = element.getAttribute('data-id');
            window.TechPackV11.BulkGarments.duplicateGarment(garmentId);
          }
          break;

        case 'bulk-delete-garment':
          if (window.TechPackV11.BulkGarments) {
            const garmentId = element.getAttribute('data-id');
            window.TechPackV11.BulkGarments.deleteGarment(garmentId);
          }
          break;

        // ===================================================================
        // BULK ORDER ACTIONS - Step 4 (Colorway Management)
        // ===================================================================

        case 'add-stock-color':
          if (window.TechPackV11.BulkStep4) {
            const garmentId = element.getAttribute('data-garment-id');
            window.TechPackV11.BulkStep4.expandStockColors(garmentId);
          }
          break;

        case 'add-pantone-color':
          if (window.TechPackV11.BulkStep4) {
            const garmentId = element.getAttribute('data-garment-id');
            window.TechPackV11.BulkStep4.startAddingPantoneColor(garmentId);
          }
          break;

        case 'add-techpack-color':
          if (window.TechPackV11.BulkStep4) {
            const garmentId = element.getAttribute('data-garment-id');
            window.TechPackV11.BulkStep4.startAddingTechPackColor(garmentId);
          }
          break;

        // NEW INLINE SIZE INPUT HANDLERS
        case 'update-colorway-size':
          if (window.TechPackV11.BulkStep4) {
            const garmentId = element.getAttribute('data-garment-id');
            const size = element.getAttribute('data-size');
            const quantity = element.value;
            window.TechPackV11.BulkStep4.updateColorwaySize(garmentId, size, quantity);
          }
          break;

        case 'delete-colorway':
          if (window.TechPackV11.BulkStep4) {
            const garmentId = element.getAttribute('data-garment-id');
            window.TechPackV11.BulkStep4.deleteColorway(garmentId);
          }
          break;

        case 'quick-fill':
          if (window.TechPackV11.BulkStep4) {
            const garmentId = element.getAttribute('data-garment-id');
            const preset = element.getAttribute('data-preset');

            // Prompt for total quantity
            const currentTotal = element.getAttribute('data-total') || 0;
            const totalInput = prompt(`Enter total pieces to distribute (${preset})`, currentTotal || '75');

            if (totalInput && parseInt(totalInput) > 0) {
              window.TechPackV11.BulkStep4.applyQuickFill(garmentId, preset, parseInt(totalInput));
            }
          }
          break;

        case 'save-preset':
          if (window.TechPackV11.BulkStep4) {
            const garmentId = element.getAttribute('data-garment-id');
            window.TechPackV11.BulkStep4.savePreset(garmentId);
          }
          break;

        case 'load-preset':
          if (window.TechPackV11.BulkStep4) {
            const garmentId = element.getAttribute('data-garment-id');
            window.TechPackV11.BulkStep4.loadPreset(garmentId);
          }
          break;

        case 'select-stock-color':
          // Check which attributes exist to determine which handler to use
          if (element.getAttribute('data-garment-id')) {
            const garmentId = element.getAttribute('data-garment-id');
            const colorName = element.getAttribute('data-color-name');
            const colorHex = element.getAttribute('data-color-hex');

            // Sample Step 3B or Bulk Step 4 (both use garment-id attribute)
            if (window.TechPackV11.Step3B) {
              window.TechPackV11.Step3B.assignStockColor(garmentId, colorName, colorHex);
            } else if (window.TechPackV11.BulkStep4) {
              window.TechPackV11.BulkStep4.assignStockColor(garmentId, colorName, colorHex);
            }
          } else {
            // Legacy Bulk Step 4 modal (uses data-color and data-hex)
            if (window.TechPackV11.BulkStep4) {
              const colorName = element.getAttribute('data-color');
              const colorHex = element.getAttribute('data-hex');
              window.TechPackV11.BulkStep4.selectStockColor(colorName, colorHex);
            }
          }
          break;

        case 'close-stock-colors-modal':
          if (window.TechPackV11.BulkStep4) {
            window.TechPackV11.BulkStep4.closeStockColorsModal();
          }
          break;

        case 'continue-to-sizes':
          if (window.TechPackV11.BulkStep4) {
            window.TechPackV11.BulkStep4.continueToSizes();
          }
          break;

        case 'close-quantity-modal':
          if (window.TechPackV11.BulkStep4) {
            window.TechPackV11.BulkStep4.closeQuantityModal();
          }
          break;

        case 'quick-fill-even':
          if (window.TechPackV11.BulkStep4) {
            window.TechPackV11.BulkStep4.quickFillEven();
          }
          break;

        case 'quick-fill-typical':
          if (window.TechPackV11.BulkStep4) {
            window.TechPackV11.BulkStep4.quickFillTypical();
          }
          break;

        case 'skip-size-distribution':
          if (window.TechPackV11.BulkStep4) {
            window.TechPackV11.BulkStep4.skipSizeDistribution();
          }
          break;

        case 'confirm-size-distribution':
          if (window.TechPackV11.BulkStep4) {
            window.TechPackV11.BulkStep4.confirmSizeDistribution();
          }
          break;

        case 'close-size-modal':
          if (window.TechPackV11.BulkStep4) {
            window.TechPackV11.BulkStep4.closeSizeDistributionModal();
          }
          break;

        case 'skip-copy-colorway':
          if (window.TechPackV11.BulkStep4) {
            window.TechPackV11.BulkStep4.skipCopyColorway();
          }
          break;

        case 'confirm-copy-colorway':
          if (window.TechPackV11.BulkStep4) {
            window.TechPackV11.BulkStep4.confirmCopyColorway();
          }
          break;

        case 'close-copy-modal':
          if (window.TechPackV11.BulkStep4) {
            window.TechPackV11.BulkStep4.closeCopyColorwayModal();
          }
          break;

        case 'edit-colorway':
          if (window.TechPackV11.BulkStep4) {
            const garmentId = element.getAttribute('data-garment-id');
            const colorwayId = element.getAttribute('data-colorway-id');
            window.TechPackV11.BulkStep4.editColorway(garmentId, colorwayId);
          }
          break;

        case 'delete-colorway':
          if (window.TechPackV11.BulkStep4) {
            const garmentId = element.getAttribute('data-garment-id');
            window.TechPackV11.BulkStep4.deleteColorway(garmentId);
          }
          break;

        case 'close-techpack-color-modal':
          if (window.TechPackV11.BulkStep4) {
            window.TechPackV11.BulkStep4.closeTechPackColorModal();
          }
          break;

        case 'confirm-techpack-color':
          if (window.TechPackV11.BulkStep4) {
            window.TechPackV11.BulkStep4.confirmTechPackColor();
          }
          break;

        // ===================================================================
        // STEP 3B ACTIONS - Color Assignment
        // ===================================================================

        case 'toggle-speed-guide':
          const speedGuideContent = document.getElementById('speedGuideContent');
          const speedGuideIcon = document.querySelector('.speed-guide__icon');
          if (speedGuideContent && speedGuideIcon) {
            const isHidden = speedGuideContent.style.display === 'none';
            speedGuideContent.style.display = isHidden ? 'block' : 'none';
            speedGuideIcon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
          }
          break;

        case 'toggle-labdip-guide':
          const labDipGuideContent = document.getElementById('labDipGuideContent');
          const labDipGuideIcon = document.querySelector('#labDipGuide .speed-guide__icon');
          if (labDipGuideContent && labDipGuideIcon) {
            const isHidden = labDipGuideContent.style.display === 'none';
            labDipGuideContent.style.display = isHidden ? 'block' : 'none';
            labDipGuideIcon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
          }
          break;

        case 'expand-stock-colors':
          const garmentId1 = element.getAttribute('data-garment-id');
          if (window.TechPackV11.Step3B) {
            window.TechPackV11.Step3B.expandStockColors(garmentId1);
          } else if (window.TechPackV11.BulkStep4) {
            window.TechPackV11.BulkStep4.expandStockColors(garmentId1);
          }
          break;

        case 'expand-techpack-reference':
          const garmentId2 = element.getAttribute('data-garment-id');
          if (window.TechPackV11.Step3B) {
            const isCotton = element.getAttribute('data-is-cotton') === 'true';
            window.TechPackV11.Step3B.expandTechPackReference(garmentId2, isCotton);
          } else if (window.TechPackV11.BulkStep4) {
            window.TechPackV11.BulkStep4.expandTechPackReference(garmentId2);
          }
          break;

        case 'assign-techpack-reference':
          const garmentId3 = element.getAttribute('data-garment-id');
          if (window.TechPackV11.Step3B) {
            window.TechPackV11.Step3B.assignTechPackReference(garmentId3);
          } else if (window.TechPackV11.BulkStep4) {
            window.TechPackV11.BulkStep4.assignTechPackReference(garmentId3);
          }
          break;

        case 'cancel-expansion':
          if (window.TechPackV11.Step3B) {
            const garmentId = element.getAttribute('data-garment-id');
            window.TechPackV11.Step3B.cancelExpansion(garmentId);
          } else if (window.TechPackV11.BulkStep4) {
            window.TechPackV11.BulkStep4.cancelExpansion();
          }
          break;

        // Color Studio Modal - Simplified (no modes)
        case 'open-pantone-modal':
        case 'open-color-studio-standalone':
          if (window.TechPackV11.ColorStudio) {
            window.TechPackV11.ColorStudio.open('standalone');
          } else {
            console.error('[Actions] ColorStudio not found!');
          }
          break;

        case 'close-color-studio-modal':
          if (window.TechPackV11.ColorStudio) {
            window.TechPackV11.ColorStudio.close();
          }
          break;

        case 'done-color-studio-modal':
          if (window.TechPackV11.ColorStudio) {
            window.TechPackV11.ColorStudio.done();
          }
          break;

        // Cart Actions
        case 'modal-add-to-cart':
          if (window.TechPackV11.ColorStudio) {
            window.TechPackV11.ColorStudio.addToCart();
          }
          break;

        case 'modal-remove-from-cart':
          if (window.TechPackV11.ColorStudio) {
            const labDipId = element.getAttribute('data-lab-dip-id');
            if (labDipId) {
              window.TechPackV11.ColorStudio.removeFromCart(labDipId);
            }
          }
          break;

        case 'remove-cart-labdip':
          if (window.TechPackV11.Step3B) {
            const labDipId = element.getAttribute('data-id');
            if (labDipId) {
              window.TechPackV11.Step3B.removeFromCart(labDipId);
            }
          }
          break;

        case 'toggle-labdip-tooltip':
          const tooltip = document.getElementById('labDipTooltip');
          if (tooltip) {
            tooltip.style.display = tooltip.style.display === 'none' ? 'block' : 'none';
          }
          break;

        case 'return-to-labdip-cart':
          if (window.TechPackV11.Step3B) {
            const garmentId = element.getAttribute('data-garment-id');
            const garment = window.TechPackV11.Step3B.garments.find(g => g.id === garmentId);

            if (garment && garment.colorType === 'pantone' && garment.pantoneColor) {
              // Return Pantone to Lab Dip Cart
              const labDipItem = {
                id: garment.pantoneColor.labDipId || ('labdip-' + Date.now()),
                code: garment.pantoneColor.code,
                name: garment.pantoneColor.name,
                hex: garment.pantoneColor.hex,
                price: garment.pantoneColor.price || 25.00
              };

              console.log('[Actions] Returning Pantone to Lab Dip Cart:', labDipItem);
              window.TechPackV11.Step3B.labDipCart.push(labDipItem);

              // Clear color assignment
              garment.colorAssigned = false;
              garment.colorType = null;
              garment.color = null;
              garment.hex = null;
              garment.pantone = null;
              garment.pantoneColor = null;

              window.TechPackV11.Step3B.saveAndRender();
              window.TechPackV11.Step3B.renderLabDipCart();
            }
          }
          break;

        case 'edit-garment-color':
          if (window.TechPackV11.Step3B) {
            const garmentId = element.getAttribute('data-garment-id');
            const garment = window.TechPackV11.Step3B.garments.find(g => g.id === garmentId);

            if (garment) {
              // Clear color assignment (stock and techpack colors - no cart interaction)
              garment.colorAssigned = false;
              garment.colorType = null;
              garment.sampleType = null;
              garment.color = null;
              garment.hex = null;
              garment.pantone = null;
              garment.pantoneColor = null;

              console.log('[Actions] Cleared stock/techpack color from garment');
              window.TechPackV11.Step3B.saveAndRender();
            }
          }
          break;

        // Stock Color Selection
        case 'sample-select-stock-color':
          if (window.TechPackV11.SampleGarments) {
            const colorName = element.getAttribute('data-stock-color');
            const colorHex = element.getAttribute('data-color-hex');
            window.TechPackV11.SampleGarments.addGarmentWithStockColor(colorName, colorHex);
          }
          break;

        // TechPack Color Picker
        case 'techpack-select-color':
          const colorName = element.getAttribute('data-color-name');
          const colorHex = element.getAttribute('data-color-hex');
          const selectedColorEl = document.getElementById('techpackSelectedColor');
          const swatchEl = document.getElementById('techpackSelectedSwatch');
          const nameEl = document.getElementById('techpackSelectedName');

          if (selectedColorEl && swatchEl && nameEl) {
            selectedColorEl.style.display = 'block';
            swatchEl.style.backgroundColor = colorHex;
            nameEl.textContent = colorName;
            selectedColorEl.dataset.colorName = colorName;
            selectedColorEl.dataset.colorHex = colorHex;
          }
          break;

        case 'confirm-techpack-color':
          if (window.TechPackV11.SampleGarments) {
            const selectedColorEl = document.getElementById('techpackSelectedColor');
            if (selectedColorEl) {
              const colorName = selectedColorEl.dataset.colorName;
              const colorHex = selectedColorEl.dataset.colorHex;
              window.TechPackV11.SampleGarments.addGarmentWithTechPackColor(colorName, colorHex);
            }
          }
          break;

        // ===================================================================
        // COLOR STUDIO ACTIONS
        // ===================================================================

        case 'close-color-studio':
        case 'cancel-color-studio':
          if (window.TechPackV11.ColorStudio) {
            window.TechPackV11.ColorStudio.close();
          }
          break;

        case 'done-color-studio':
          if (window.TechPackV11.ColorStudio) {
            window.TechPackV11.ColorStudio.done();
          }
          break;

        case 'search-pantone':
          if (window.TechPackV11.ColorStudio) {
            const input = document.getElementById('pantoneCodeInput');
            if (input) {
              window.TechPackV11.ColorStudio.searchPantone(input.value);
            }
          }
          break;

        case 'search-pantone-button':
          if (window.TechPackV11.ColorStudio) {
            const input = document.getElementById('pantoneCodeInput');
            if (input) {
              window.TechPackV11.ColorStudio.searchPantone(input.value);
            }
          }
          break;

        case 'select-popular-color':
          if (window.TechPackV11.ColorStudio) {
            const colorData = {
              code: element.getAttribute('data-color-code'),
              name: element.getAttribute('data-color-name'),
              hex: element.getAttribute('data-color-hex')
            };
            window.TechPackV11.ColorStudio.setCurrentColor(colorData);
          }
          break;

        case 'modal-native-color-change':
          if (window.TechPackV11.ColorStudio) {
            const colorInput = document.getElementById('modalColorPickerInput');
            if (colorInput) {
              window.TechPackV11.ColorStudio.handleNativeColorChange(colorInput.value);
            }
          }
          break;

        case 'modal-update-color-picker':
          if (window.TechPackV11.ColorStudio) {
            window.TechPackV11.ColorStudio.handleHslChange();
          }
          break;

        // Washing Techniques
        case 'toggle-wash-techniques':
          if (window.TechPackV11.ColorStudio) {
            window.TechPackV11.ColorStudio.toggleWashTechniques();
          }
          break;

        case 'select-wash-technique':
          if (window.TechPackV11.ColorStudio) {
            const technique = element.getAttribute('data-technique');
            if (technique) {
              window.TechPackV11.ColorStudio.selectWashTechnique(technique);
            }
          }
          break;

        case 'select-wash-guide':
          if (window.TechPackV11.ColorStudio) {
            const guide = element.getAttribute('data-guide');
            if (guide) {
              window.TechPackV11.ColorStudio.selectWashGuide(guide);
            }
          }
          break;

        case 'show-garment-selector':
          if (window.TechPackV11.ColorStudio) {
            window.TechPackV11.ColorStudio.showGarmentSelector();
          }
          break;

        case 'hide-garment-selector':
          if (window.TechPackV11.ColorStudio) {
            window.TechPackV11.ColorStudio.hideGarmentSelector();
          }
          break;

        case 'select-garment-for-color':
          if (window.TechPackV11.ColorStudio) {
            const garmentId = element.getAttribute('data-garment-id');
            if (garmentId) {
              window.TechPackV11.ColorStudio.assignColorToGarment(garmentId);
            }
          }
          break;

        case 'modal-add-to-labdip-collection':
          if (window.TechPackV11.ColorStudio) {
            window.TechPackV11.ColorStudio.addToCart();
          }
          break;

        case 'update-color-picker':
          // HSL sliders are handled by event listeners in ColorStudio
          break;

        case 'add-to-lab-dip-collection':
          if (window.TechPackV11.ColorStudio) {
            window.TechPackV11.ColorStudio.addToCart();
          }
          break;

        case 'assign-lab-dip':
          // Legacy action - no longer used in cart-based workflow
          // Lab dips are now assigned via drag & drop in Step3B
          console.warn('[Actions] assign-lab-dip action is deprecated - use drag & drop instead');
          break;

        case 'remove-lab-dip':
          if (window.TechPackV11.ColorStudio) {
            const labDipId = element.getAttribute('data-lab-dip-id');
            window.TechPackV11.ColorStudio.removeFromCart(labDipId);
          }
          break;

        // Delivery Address Toggle
        case 'toggle-delivery-address':
          const differentAddressForm = document.getElementById('differentAddressForm');
          if (differentAddressForm) {
            const isDifferent = element.value === 'different';
            differentAddressForm.style.display = isDifferent ? 'block' : 'none';
          }
          break;

        default:
          console.log('[Navigation] Unknown action:', actionType);
      }
    },

    /**
     * Handle form submission
     */
    handleFormSubmit: function(form) {
      const step = parseInt(form.getAttribute('data-step'));
      const flow = form.getAttribute('data-flow');

      console.log('[Navigation] Form submit:', flow, 'step', step);

      // Validate form
      if (!this.validateForm(form)) {
        console.log('[Navigation] Validation failed');
        return;
      }

      // Save data
      window.TechPackV11.State.saveToStorage();

      // Go to next step
      this.goToNextStep();
    },

    /**
     * Validate form
     */
    validateForm: function(form) {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach(field => {
        if (!field.value && field.type !== 'checkbox') {
          isValid = false;
          field.classList.add('form-field--error');
        } else if (field.type === 'checkbox') {
          const name = field.name;
          const checked = form.querySelectorAll(`[name="${name}"]:checked`).length;
          if (checked === 0) {
            isValid = false;
          }
        } else {
          field.classList.remove('form-field--error');
        }
      });

      return isValid;
    },

    /**
     * Go to next step
     */
    goToNextStep: function() {
      const state = window.TechPackV11.State;
      const nextStep = state.currentStep + 1;

      if (nextStep <= window.TechPackV11.CONFIG.STEPS[state.currentFlow.toUpperCase()]) {
        this.goToStep(nextStep);
      }
    },

    /**
     * Go to previous step
     */
    goToPreviousStep: function() {
      const state = window.TechPackV11.State;
      const prevStep = state.currentStep - 1;

      if (prevStep >= 1) {
        this.goToStep(prevStep);
      }
    },

    /**
     * Go to specific step
     */
    goToStep: function(step) {
      const state = window.TechPackV11.State;

      // In a real implementation, this would navigate to the correct page
      // For now, just log
      console.log(`[Navigation] Would navigate to: /pages/techpack-${state.currentFlow}-step${step}`);

      // In TEST mode or development, we can simulate by showing/hiding sections
      if (state.testMode) {
        alert(`TEST MODE: Would go to Step ${step}\n\nIn production, this will navigate to the correct page.`);
      } else {
        // Navigate to the actual page
        window.location.href = `/pages/techpack-${state.currentFlow}-step${step}?test=${state.testMode}`;
      }
    },

    /**
     * Save draft (manual save only - no auto-save)
     */
    saveDraft: function() {
      // Save main state
      window.TechPackV11.State.saveToStorage();

      // Also save Step3B specific data if on Step 4
      if (window.TechPackV11.Step3B && typeof window.TechPackV11.Step3B.saveToStorage === 'function') {
        window.TechPackV11.Step3B.saveToStorage();
      }

      alert('✓ Draft saved successfully! You can continue later.');
    },

    /**
     * Submit quotation
     */
    submitQuotation: function() {
      // Check terms acceptance
      const termsCheckbox = document.getElementById('termsAcceptance');
      if (termsCheckbox && !termsCheckbox.checked) {
        alert('Please accept the Terms & Conditions to continue.');
        return;
      }

      console.log('[Navigation] Submitting quotation...');

      // In TEST mode, simulate submission
      if (window.TechPackV11.State.testMode) {
        console.log('[TEST MODE] Simulating submission');
        this.simulateSubmission();
        return;
      }

      // In production, send to API
      this.submitToAPI();
    },

    /**
     * Simulate submission (TEST mode)
     */
    simulateSubmission: function() {
      // Show loading state
      const submitBtn = document.getElementById('submitButton');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<svg class="loading-spinner" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="50" stroke-dashoffset="25"></circle></svg> Submitting...';
      }

      // Simulate network delay
      setTimeout(() => {
        console.log('[TEST MODE] Submission successful');

        // Populate success modal
        const confirmEmail = document.getElementById('confirmEmail');
        if (confirmEmail) {
          confirmEmail.textContent = window.TechPackV11.State.formData.email || 'your email';
        }

        // Show success modal
        window.TechPackV11.UI.showModal('successModal');

        // Clear form data
        window.TechPackV11.State.clearStorage();
      }, 2000);
    },

    /**
     * Submit to API (production)
     */
    submitToAPI: function() {
      // This will be implemented later with actual API endpoints
      console.log('[Navigation] Would submit to API:', window.TechPackV11.State.formData);

      // For now, use simulation
      this.simulateSubmission();
    },

    /**
     * Toggle TEST mode
     */
    toggleTestMode: function() {
      const newTestMode = !window.TechPackV11.State.testMode;
      const url = new URL(window.location.href);

      if (newTestMode) {
        url.searchParams.set('test', 'true');
      } else {
        url.searchParams.delete('test');
      }

      window.location.href = url.toString();
    },

    /**
     * Trigger file input click
     */
    triggerFileInput: function(inputId) {
      const input = document.getElementById(inputId);
      if (input) {
        input.click();
      }
    },

    /**
     * Clear all selections (Step 3)
     */
    clearAllSelections: function() {
      document.querySelectorAll('.selection-card input:checked').forEach(checkbox => {
        checkbox.checked = false;
        checkbox.closest('.selection-card').classList.remove('selection-card--selected');
      });

      // Update summary
      window.TechPackV11.Forms.updateSelectionSummary();

      // Clear from state
      delete window.TechPackV11.State.formData['garments[]'];
      delete window.TechPackV11.State.formData['fabrics[]'];
      window.TechPackV11.State.saveToStorage();
    },

    /**
     * Start a flow (from entrance page)
     */
    startFlow: function(flow) {
      console.log('[Navigation] Starting flow:', flow);

      // Check if login required
      const requiresLogin = ['sample', 'bulk'].includes(flow);

      if (requiresLogin && !window.TECHPACK_V11_CUSTOMER.isLoggedIn) {
        // Show access modal
        window.TechPackV11.UI.showModal('modalAccessCode');
        return;
      }

      // Build the URL
      const testMode = window.TechPackV11.State.testMode;
      const url = `/pages/techpack-${flow}-step1${testMode ? '?test=true' : ''}`;

      console.log('[Navigation] Navigating to:', url);

      // Navigate to step 1
      window.location.href = url;
    }
  };

  /**
   * ==========================================================================
   * REVIEW PAGE
   * ==========================================================================
   */
  const Review = {
    /**
     * Initialize review page
     */
    init: function() {
      const validSteps = [4, 5]; // Step 4 for Quotation/Bulk, Step 5 for Sample
      if (!validSteps.includes(window.TechPackV11.State.currentStep)) return;

      console.log('[Review] Initializing review page - Step', window.TechPackV11.State.currentStep);
      this.populateReview();
    },

    /**
     * Populate review page with saved data
     */
    populateReview: function() {
      const data = window.TechPackV11.State.formData;
      const flow = window.TechPackV11.State.currentFlow;

      console.log('[Review] Populating review for flow:', flow);

      // Client info (all flows)
      this.setReviewValue('reviewCompanyName', data.company_name);
      this.setReviewValue('reviewEmail', data.email || data.company_email);

      // Flow-specific fields
      if (flow === 'sample') {
        // Sample flow - Step 5
        this.populateSampleReview(data);
      } else {
        // Quotation/Bulk flow - Step 4
        this.setReviewValue('reviewQuantity', data.estimated_quantity ? `${parseInt(data.estimated_quantity).toLocaleString()} pieces` : '-');
      }

      // Files (all flows)
      const designFiles = window.TechPackV11.State.uploadedFiles.design || [];
      const measurementFiles = window.TechPackV11.State.uploadedFiles.measurement || [];
      this.setReviewValue('reviewDesignFiles', `${designFiles.length} file${designFiles.length !== 1 ? 's' : ''}`);
      this.setReviewValue('reviewMeasurementFiles', `${measurementFiles.length} file${measurementFiles.length !== 1 ? 's' : ''}`);

      // Populate files container
      this.populateFilesContainer('reviewFiles', designFiles, measurementFiles);

      // Garments (all flows)
      if (data.garments && Array.isArray(data.garments)) {
        if (flow === 'sample') {
          this.setReviewGarmentsWithColors('reviewGarments', data.garments);
        } else {
          this.setReviewGarments('reviewGarments', data.garments);
        }
      } else {
        // Fallback for old checkbox format
        this.setReviewList('reviewGarments', data['garments[]'] || []);
      }

      // Hide fabrics section (no longer used)
      const fabricsSection = document.getElementById('reviewFabrics');
      if (fabricsSection) {
        fabricsSection.closest('.review-item').style.display = 'none';
      }
    },

    /**
     * Populate Sample-specific review data
     */
    populateSampleReview: function(data) {
      console.log('[Review] Populating Sample-specific data');

      // Delivery Address
      this.populateDeliveryAddress(data.delivery_address);

      // Lab Dips
      this.populateLabDips();

      // Cost Summary
      this.calculateCosts(data.garments);
    },

    /**
     * Populate delivery address
     */
    populateDeliveryAddress: function(address) {
      const el = document.getElementById('reviewDeliveryAddress');
      if (!el || !address) return;

      const parts = [
        address.street,
        address.city,
        address.zip,
        address.country
      ].filter(Boolean);

      el.textContent = parts.join(', ') || '-';
    },

    /**
     * Populate files container with list
     */
    populateFilesContainer: function(id, designFiles, measurementFiles) {
      const el = document.getElementById(id);
      if (!el) return;

      const allFiles = [
        ...designFiles.map(f => ({...f, type: 'Design'})),
        ...measurementFiles.map(f => ({...f, type: 'Measurement'}))
      ];

      if (allFiles.length === 0) {
        el.innerHTML = '<p style="color: var(--color-text-secondary); font-size: 0.875rem;">No files uploaded</p>';
        return;
      }

      el.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: var(--space-2);">
          ${allFiles.map(file => `
            <div style="display: flex; align-items: center; gap: var(--space-2); padding: var(--space-2); background: var(--color-background); border: 1px solid var(--color-border); border-radius: var(--radius-sm);">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0; color: var(--color-text-secondary);">
                <path d="M9 2H4C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4V12C2 12.5304 2.21071 13.0391 2.58579 13.4142C2.96086 13.7893 3.46957 14 4 14H12C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12V7M13 2L8 7M13 2H10M13 2V5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span style="flex: 1; font-size: 0.875rem; color: var(--color-text-primary); font-weight: 500;">${file.name}</span>
              <span style="font-size: 0.75rem; color: var(--color-text-secondary); padding: 2px 8px; background: var(--color-surface); border-radius: var(--radius-sm);">${file.type}</span>
            </div>
          `).join('')}
        </div>
      `;
    },

    /**
     * Populate Lab Dips section
     */
    populateLabDips: function() {
      const labDipEl = document.getElementById('reviewLabDips');
      const sectionEl = document.getElementById('labDipsSection');

      if (!labDipEl) return;

      // Get Lab Dips from Step3B
      const labDips = window.TechPackV11.Step3B?.labDipCart || [];

      if (labDips.length === 0) {
        if (sectionEl) sectionEl.style.display = 'none';
        return;
      }

      if (sectionEl) sectionEl.style.display = 'block';

      labDipEl.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: var(--space-2);">
          ${labDips.map(dip => `
            <div style="display: flex; align-items: center; gap: var(--space-2); padding: var(--space-2) var(--space-3); background: var(--color-background); border: 1px solid var(--color-border); border-radius: var(--radius-md);">
              <div style="display: block; width: 32px; height: 32px; border-radius: var(--radius-sm); border: 1px solid rgba(0, 0, 0, 0.1); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); background-color: ${dip.hex};"></div>
              <div style="display: flex; flex-direction: column;">
                <span style="font-size: 0.813rem; font-weight: 600; color: var(--color-text-primary);">${dip.name}</span>
                <span style="font-size: 0.75rem; color: var(--color-text-secondary);">${dip.code}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    },

    /**
     * Calculate and display costs
     */
    calculateCosts: function(garments) {
      const garmentCount = garments?.length || 0;
      const labDips = window.TechPackV11.Step3B?.labDipCart || [];
      const labDipCount = labDips.length;

      // Pricing: Samples typically cost more - using $50 per sample + $25 per lab dip
      const samplePrice = 50; // USD per sample garment
      const labDipPrice = 25; // USD per lab dip

      const garmentTotal = garmentCount * samplePrice;
      const labDipTotal = labDipCount * labDipPrice;
      const total = garmentTotal + labDipTotal;

      // Update DOM elements
      this.setReviewValue('garmentSamplesCost', `$${garmentTotal.toFixed(2)} USD (${garmentCount} × $${samplePrice})`);
      this.setReviewValue('labDipsCost', `$${labDipTotal.toFixed(2)} USD (${labDipCount} × $${labDipPrice})`);
      this.setReviewValue('labDipCount', labDipCount.toString());
      this.setReviewValue('totalCost', `$${total.toFixed(2)} USD`);

      console.log('[Review] Costs calculated:', { garmentTotal, labDipTotal, total });
    },

    /**
     * Set review value
     */
    setReviewValue: function(id, value) {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = value || '-';
      }
    },

    /**
     * Set review list (tags)
     */
    setReviewList: function(id, values) {
      const el = document.getElementById(id);
      if (!el) return;

      if (values.length === 0) {
        el.innerHTML = '<span class="review-tag">None selected</span>';
        return;
      }

      el.innerHTML = values.map(value => {
        const label = this.getReadableLabel(value);
        return `<span class="review-tag">${label}</span>`;
      }).join('');
    },

    /**
     * Get SVG icon for garment type (same as core.js)
     */
    getGarmentIcon: function(type) {
      const icons = {
        'T-Shirt': '<path d="M20 26L26 20L60 26L94 20L100 26V100H20V26Z" stroke="currentColor" stroke-width="3" fill="none"/><path d="M26 20V26M94 20V26M20 40H100" stroke="currentColor" stroke-width="3"/>',
        'Hoodie': '<path d="M16 30L26 20L60 23L94 20L104 30V103H16V30Z" stroke="currentColor" stroke-width="3" fill="none"/><path d="M45 20Q60 10 75 20" stroke="currentColor" stroke-width="3"/>',
        'Sweatshirt': '<path d="M16 30L26 20L60 26L94 20L104 30V103H16V30Z" stroke="currentColor" stroke-width="3" fill="none"/><circle cx="60" cy="60" r="8" stroke="currentColor" stroke-width="3"/>',
        'Polo Shirt': '<path d="M20 26L26 20L60 26L94 20L100 26V100H20V26Z" stroke="currentColor" stroke-width="3" fill="none"/><rect x="50" y="23" width="20" height="10" stroke="currentColor" stroke-width="3"/>',
        'Tank Top': '<path d="M36 23L45 20H75L84 23V100H36V23Z" stroke="currentColor" stroke-width="3" fill="none"/>',
        'Long Sleeve': '<path d="M20 26L26 20L60 26L94 20L100 26V100H20V26Z" stroke="currentColor" stroke-width="3" fill="none"/><path d="M20 26L10 40V80L20 75M100 26L110 40V80L100 75" stroke="currentColor" stroke-width="3"/>',
        'Shorts': '<path d="M30 25H90V65L75 75H45L30 65V25Z" stroke="currentColor" stroke-width="3" fill="none"/><path d="M60 25V75" stroke="currentColor" stroke-width="3"/>',
        'Joggers': '<path d="M30 25H90V100L75 105H45L30 100V25Z" stroke="currentColor" stroke-width="3" fill="none"/><path d="M60 25V105" stroke="currentColor" stroke-width="3"/><circle cx="45" cy="105" r="5" stroke="currentColor" stroke-width="3"/><circle cx="75" cy="105" r="5" stroke="currentColor" stroke-width="3"/>',
        'Zip Hoodie': '<path d="M16 30L26 20L60 23L94 20L104 30V103H16V30Z" stroke="currentColor" stroke-width="3" fill="none"/><path d="M45 20Q60 10 75 20M60 23V103" stroke="currentColor" stroke-width="3"/>',
        'Jacket': '<path d="M16 30L26 20L60 23L94 20L104 30V90H16V30Z" stroke="currentColor" stroke-width="3" fill="none"/><path d="M60 23V90M40 35H80M40 50H80" stroke="currentColor" stroke-width="3"/>'
      };
      return icons[type] || icons['T-Shirt'];
    },

    /**
     * Set review garments (visual grid cards)
     */
    setReviewGarments: function(id, garments) {
      const el = document.getElementById(id);
      if (!el) return;

      if (garments.length === 0) {
        el.innerHTML = '<span class="review-tag">No garments added</span>';
        return;
      }

      // Change label
      const label = el.closest('.review-item')?.querySelector('.review-item__label');
      if (label) {
        label.textContent = `Garments (${garments.length} total)`;
      }

      // Render as visual grid (same as garment list)
      el.innerHTML = `
        <div class="garment-review-grid">
          ${garments.map((g, index) => `
            <div class="garment-review-card">
              <div class="garment-review-card__number">${index + 1}</div>
              <div class="garment-review-card__image">
                <svg class="garment-card__placeholder" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  ${this.getGarmentIcon(g.type)}
                </svg>
              </div>
              <div class="garment-review-card__content">
                <h5 class="garment-review-card__title">${g.type}</h5>
                <p class="garment-review-card__details">${g.fabricType}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    },

    /**
     * Set review garments WITH color information (Sample flow)
     */
    setReviewGarmentsWithColors: function(id, garments) {
      const el = document.getElementById(id);
      if (!el) return;

      if (garments.length === 0) {
        el.innerHTML = '<span class="review-tag">No garments added</span>';
        return;
      }

      // Change label
      const label = el.closest('.review-item')?.querySelector('.review-item__label');
      if (label) {
        label.textContent = `Garment Samples (${garments.length} total)`;
      }

      // Render as visual grid WITH color swatches
      el.innerHTML = `
        <div class="garment-review-grid">
          ${garments.map((g, index) => {
            // Build color display
            let colorHTML = '';
            if (g.colorAssigned && g.colorType) {
              if (g.colorType === 'pantone' && g.pantoneColor) {
                colorHTML = `
                  <div style="display: flex; align-items: center; gap: 4px; margin-top: 6px; padding: 4px; background: var(--color-surface); border-radius: var(--radius-sm);">
                    <div style="display: block; width: 20px; height: 20px; border-radius: 3px; border: 1px solid rgba(0, 0, 0, 0.1); background-color: ${g.pantoneColor.hex}; flex-shrink: 0;"></div>
                    <div style="display: flex; flex-direction: column; min-width: 0;">
                      <span style="font-size: 0.688rem; font-weight: 600; color: var(--color-text-primary); line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${g.pantoneColor.name}</span>
                      <span style="font-size: 0.625rem; color: var(--color-text-secondary); line-height: 1.2;">${g.pantoneColor.code}</span>
                    </div>
                  </div>
                `;
              } else if (g.colorType === 'stock' && g.hex) {
                colorHTML = `
                  <div style="display: flex; align-items: center; gap: 4px; margin-top: 6px; padding: 4px; background: var(--color-surface); border-radius: var(--radius-sm);">
                    <div style="display: block; width: 20px; height: 20px; border-radius: 3px; border: 1px solid rgba(0, 0, 0, 0.1); background-color: ${g.hex}; flex-shrink: 0;"></div>
                    <span style="font-size: 0.688rem; font-weight: 600; color: var(--color-text-primary);">${g.color}</span>
                  </div>
                `;
              } else if (g.colorType === 'techpack' && g.color) {
                colorHTML = `
                  <div style="margin-top: 6px; padding: 4px; background: var(--color-surface); border-radius: var(--radius-sm); font-size: 0.688rem; color: var(--color-text-secondary);">
                    Ref: ${g.color}
                  </div>
                `;
              }
            } else {
              colorHTML = `
                <div style="margin-top: 6px; padding: 4px; background: var(--color-surface); border-radius: var(--radius-sm); font-size: 0.688rem; color: var(--color-text-tertiary); font-style: italic;">
                  No color assigned
                </div>
              `;
            }

            return `
              <div class="garment-review-card">
                <div class="garment-review-card__number">${index + 1}</div>
                <div class="garment-review-card__image">
                  <svg class="garment-card__placeholder" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    ${this.getGarmentIcon(g.type)}
                  </svg>
                </div>
                <div class="garment-review-card__content">
                  <h5 class="garment-review-card__title">${g.type}</h5>
                  <p class="garment-review-card__details">${g.fabricType}</p>
                  ${colorHTML}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    },

    /**
     * Get readable label from value
     */
    getReadableLabel: function(value) {
      const labels = {
        'tshirt': 'T-Shirt',
        'sweatshirt': 'Sweatshirt',
        'hoodie': 'Hoodie',
        'polo': 'Polo Shirt',
        'tank': 'Tank Top',
        'longsleeve': 'Long Sleeve',
        'cotton100': '100% Cotton',
        'blend': 'Cotton/Poly Blend',
        'organic': 'Organic Cotton',
        'terry': 'French Terry'
      };

      return labels[value] || value;
    }
  };

  /**
   * ==========================================================================
   * MODAL HANDLING
   * ==========================================================================
   */
  const Modals = {
    /**
     * Initialize modal handlers
     */
    init: function() {
      // Close on backdrop click
      document.addEventListener('click', (e) => {
        if (e.target.matches('.techpack-modal__backdrop, [data-modal-close]')) {
          const modalId = e.target.getAttribute('data-modal-close') ||
                         e.target.closest('.techpack-modal')?.id;
          if (modalId) {
            window.TechPackV11.UI.hideModal(modalId);
          }
        }
      });

      // Close on ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          // Check for color studio modal first
          const colorStudioOverlay = document.querySelector('.color-studio-modal-overlay[style*="display: flex"]');
          if (colorStudioOverlay && window.TechPackV11.ColorStudio) {
            window.TechPackV11.ColorStudio.close();
            return;
          }

          // Then check for standard techpack modals
          const openModal = document.querySelector('.techpack-modal[style*="display: flex"]');
          if (openModal) {
            window.TechPackV11.UI.hideModal(openModal.id);
          }
        }
      });
    }
  };

  /**
   * ==========================================================================
   * INITIALIZATION
   * ==========================================================================
   */
  document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
    Review.init();
    Modals.init();

    console.log('[TechPack V11 Actions] Ready!');
  });

})();
