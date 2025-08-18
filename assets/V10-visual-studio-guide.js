/* ================================================
   V10 Visual Studio Guide - Interactive JavaScript
   ================================================ */

// Prevent multiple initialization
if (typeof window.V10VisualGuide !== 'undefined') {
  console.log('V10 Visual Studio Guide already loaded');
} else {

window.V10VisualGuide = class {
  constructor() {
    this.isOpen = false;
    this.currentPhase = 'overview';
    this.selectedSampleType = null;
    this.calculatedCost = 0;
    this.timeline = '';
    this.userSelections = {
      garmentType: null,
      fabricType: null,
      sampleType: null,
      hasLabDip: false,
      hasDesign: false
    };
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupModalHTML();
    console.log('V10 Visual Studio Guide initialized');
  }

  bindEvents() {
    // Listen for guide trigger buttons
    document.addEventListener('click', (e) => {
      if (e.target.matches('#step-3-help-btn, .visual-guide-trigger')) {
        e.preventDefault();
        this.open();
      }
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  setupModalHTML() {
    // Create modal element if it doesn't exist
    if (!document.getElementById('visual-guide-modal')) {
      const modalHTML = this.generateModalHTML();
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      this.bindModalEvents();
    }
  }

  generateModalHTML() {
    return `
      <div class="visual-guide-overlay" id="visual-guide-modal">
        <div class="visual-guide-modal">
          <div class="visual-guide-header">
            <div class="visual-guide-header-content">
              <div class="visual-guide-header-text">
                <h2>Visual Studio Guide</h2>
                <p>Master the techpack workflow with interactive guidance</p>
              </div>
              <button type="button" class="visual-guide-close" id="close-visual-guide">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 5L5 15M5 5l10 10"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="visual-guide-body">
            <!-- Navigation Tabs -->
            <div class="guide-navigation">
              <button type="button" class="guide-nav-tab active" data-phase="overview">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
                Overview
              </button>
              <button type="button" class="guide-nav-tab" data-phase="workflow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Workflow
              </button>
              <button type="button" class="guide-nav-tab" data-phase="examples">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
                Examples
              </button>
              <button type="button" class="guide-nav-tab" data-phase="calculator">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="4" y="4" width="16" height="16" rx="2"/>
                  <rect x="9" y="9" width="6" height="6"/>
                  <line x1="9" y1="1" x2="9" y2="4"/>
                  <line x1="15" y1="1" x2="15" y2="4"/>
                  <line x1="9" y1="20" x2="9" y2="23"/>
                  <line x1="15" y1="20" x2="15" y2="23"/>
                  <line x1="20" y1="9" x2="23" y2="9"/>
                  <line x1="20" y1="14" x2="23" y2="14"/>
                  <line x1="1" y1="9" x2="4" y2="9"/>
                  <line x1="1" y1="14" x2="4" y2="14"/>
                </svg>
                Calculator
              </button>
            </div>

            <!-- Phase Content -->
            <div id="guide-content">
              <!-- Content will be populated by JavaScript -->
            </div>

            <!-- Action Buttons -->
            <div class="guide-actions">
              <button type="button" class="guide-btn guide-btn-secondary" id="guide-try-mode">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                Try It Mode
              </button>
              <button type="button" class="guide-btn guide-btn-primary" id="guide-start-workflow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
                Start Workflow
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindModalEvents() {
    const modal = document.getElementById('visual-guide-modal');
    
    // Close events
    modal.querySelector('#close-visual-guide').addEventListener('click', () => this.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });

    // Tab navigation
    modal.querySelectorAll('.guide-nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const phase = tab.dataset.phase;
        this.showPhase(phase);
      });
    });

    // Action buttons
    modal.querySelector('#guide-try-mode').addEventListener('click', () => this.startTryMode());
    modal.querySelector('#guide-start-workflow').addEventListener('click', () => this.startWorkflow());
  }

  open() {
    this.isOpen = true;
    const modal = document.getElementById('visual-guide-modal');
    modal.classList.add('active');
    this.showPhase('overview');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus management
    modal.querySelector('.visual-guide-close').focus();
  }

  close() {
    this.isOpen = false;
    const modal = document.getElementById('visual-guide-modal');
    modal.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to trigger button
    const triggerBtn = document.getElementById('step-3-help-btn');
    if (triggerBtn) triggerBtn.focus();
  }

  showPhase(phase) {
    this.currentPhase = phase;
    
    // Update tab states
    document.querySelectorAll('.guide-nav-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.phase === phase);
    });

    // Generate and show content
    const content = this.generatePhaseContent(phase);
    document.getElementById('guide-content').innerHTML = content;
    
    // Bind phase-specific events
    this.bindPhaseEvents(phase);
  }

  generatePhaseContent(phase) {
    switch (phase) {
      case 'overview':
        return this.generateOverviewContent();
      case 'workflow':
        return this.generateWorkflowContent();
      case 'examples':
        return this.generateExamplesContent();
      case 'calculator':
        return this.generateCalculatorContent();
      default:
        return '<p>Content not found</p>';
    }
  }

  generateOverviewContent() {
    return `
      <div class="guide-phase active">
        <div class="process-flow-container">
          <div class="process-flow-title">
            <h3>Complete Techpack Process</h3>
            <p>From concept to production - understand every step</p>
          </div>
          
          <div class="process-flow">
            <div class="process-step active" data-step="1">
              <div class="process-step-icon">👕</div>
              <h4 class="process-step-title">Add Garment</h4>
              <p class="process-step-description">Select the type of garment you want to create</p>
            </div>
            
            <div class="process-step" data-step="2">
              <div class="process-step-icon">🧵</div>
              <h4 class="process-step-title">Choose Fabric</h4>
              <p class="process-step-description">Pick the perfect fabric for your garment type</p>
            </div>
            
            <div class="process-step" data-step="3">
              <div class="process-step-icon">🎯</div>
              <h4 class="process-step-title">Sample Method</h4>
              <p class="process-step-description">Decide how you want your sample created</p>
            </div>
            
            <div class="process-step" data-step="4">
              <div class="process-step-icon">🎨</div>
              <h4 class="process-step-title">Customize</h4>
              <p class="process-step-description">Add colors, designs, and finishing touches</p>
            </div>
          </div>
        </div>

        <div class="decision-tree">
          <div class="decision-tree-header">
            <h4>Three Sample Paths</h4>
            <p>Each path offers different benefits, timelines, and requirements</p>
          </div>
          
          <div class="decision-tree-content">
            <div class="decision-branch" data-sample-type="stock">
              <div class="branch-header">
                <h5 class="branch-title">Stock Fabric Color</h5>
                <span class="branch-price">€35</span>
              </div>
              <p class="branch-description">Quick validation with available fabric colors</p>
              <p class="branch-timeline">⏱️ 1-2 weeks delivery</p>
              <div class="branch-requirements">
                <span class="requirement-tag optional">Design Optional</span>
                <span class="requirement-tag">Black/White/Random</span>
              </div>
            </div>

            <div class="decision-branch" data-sample-type="custom">
              <div class="branch-header">
                <h5 class="branch-title">Custom Color (Pantone)</h5>
                <span class="branch-price">€65</span>
              </div>
              <p class="branch-description">Exact color match using Pantone system</p>
              <p class="branch-timeline">⏱️ 3 weeks delivery</p>
              <div class="branch-requirements">
                <span class="requirement-tag mandatory">Lab Dip Required</span>
                <span class="requirement-tag optional">Design Optional</span>
              </div>
            </div>

            <div class="decision-branch" data-sample-type="techpack">
              <div class="branch-header">
                <h5 class="branch-title">As Per TechPack</h5>
                <span class="branch-price">Premium</span>
              </div>
              <p class="branch-description">Complete sample following exact TechPack specifications</p>
              <p class="branch-timeline">⏱️ 4-5 weeks delivery</p>
              <div class="branch-requirements">
                <span class="requirement-tag">Full Specifications</span>
                <span class="requirement-tag">Comprehensive Sample</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  generateWorkflowContent() {
    return `
      <div class="guide-phase active">
        <div class="process-flow-container">
          <div class="process-flow-title">
            <h3>Interactive Decision Flow</h3>
            <p>Click through the workflow to see how your choices affect the process</p>
          </div>
          
          <div style="margin-bottom: 24px;">
            <h4 style="color: #1e293b; margin-bottom: 16px;">Step 1: Select Garment Type</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; margin-bottom: 24px;">
              <button class="workflow-option" data-choice="garment" data-value="T-Shirt">
                <span style="font-size: 24px;">👕</span>
                <span>T-Shirt</span>
              </button>
              <button class="workflow-option" data-choice="garment" data-value="Hoodie">
                <span style="font-size: 24px;">🧥</span>
                <span>Hoodie</span>
              </button>
              <button class="workflow-option" data-choice="garment" data-value="Sweatshirt">
                <span style="font-size: 24px;">👔</span>
                <span>Sweatshirt</span>
              </button>
            </div>
          </div>

          <div id="fabric-selection" style="display: none; margin-bottom: 24px;">
            <h4 style="color: #1e293b; margin-bottom: 16px;">Step 2: Choose Fabric</h4>
            <div id="fabric-options" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 24px;">
              <!-- Fabric options populated by JavaScript -->
            </div>
          </div>

          <div id="sample-selection" style="display: none; margin-bottom: 24px;">
            <h4 style="color: #1e293b; margin-bottom: 16px;">Step 3: Sample Method</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 24px;">
              <button class="workflow-sample-option" data-choice="sample" data-value="stock">
                <div><strong>Stock Fabric Color</strong></div>
                <div style="font-size: 12px; color: #64748b;">€35 • 1-2 weeks</div>
              </button>
              <button class="workflow-sample-option" data-choice="sample" data-value="custom">
                <div><strong>Custom Color</strong></div>
                <div style="font-size: 12px; color: #64748b;">€65 • 3 weeks</div>
              </button>
              <button class="workflow-sample-option" data-choice="sample" data-value="techpack">
                <div><strong>As Per TechPack</strong></div>
                <div style="font-size: 12px; color: #64748b;">Premium • 4-5 weeks</div>
              </button>
            </div>
          </div>

          <div id="customization-options" style="display: none;">
            <h4 style="color: #1e293b; margin-bottom: 16px;">Step 4: Customization</h4>
            <div id="customization-content">
              <!-- Customization options populated by JavaScript based on sample type -->
            </div>
          </div>

          <div id="workflow-summary" style="display: none; background: #f0f9ff; padding: 20px; border-radius: 12px; margin-top: 24px;">
            <h4 style="color: #0c4a6e; margin-top: 0;">Your Configuration</h4>
            <div id="summary-content"></div>
          </div>
        </div>
      </div>
    `;
  }

  generateExamplesContent() {
    return `
      <div class="guide-phase active">
        <div class="visual-examples">
          <div class="example-card">
            <div class="example-image">👕</div>
            <div class="example-content">
              <h4 class="example-title">Stock Fabric Color Example</h4>
              <p class="example-description">Perfect for quick prototyping and design validation</p>
              <ul class="example-features">
                <li>Fast turnaround time</li>
                <li>Cost-effective option</li>
                <li>Available in black, white, or random stock colors</li>
                <li>Ideal for testing fit and basic design</li>
              </ul>
            </div>
          </div>

          <div class="example-card">
            <div class="example-image">🎨</div>
            <div class="example-content">
              <h4 class="example-title">Custom Color Example</h4>
              <p class="example-description">Exact Pantone color matching for brand consistency</p>
              <ul class="example-features">
                <li>Precise color matching</li>
                <li>Professional lab dip included</li>
                <li>Brand color consistency</li>
                <li>Perfect for marketing samples</li>
              </ul>
            </div>
          </div>

          <div class="example-card">
            <div class="example-image">📋</div>
            <div class="example-content">
              <h4 class="example-title">TechPack Specification</h4>
              <p class="example-description">Complete sample following every detail</p>
              <ul class="example-features">
                <li>Full specification compliance</li>
                <li>Production-ready sample</li>
                <li>All details included</li>
                <li>Quality assurance testing</li>
              </ul>
            </div>
          </div>

          <div class="example-card">
            <div class="example-image">🧵</div>
            <div class="example-content">
              <h4 class="example-title">Lab Dip Process</h4>
              <p class="example-description">Color matching and fabric preparation</p>
              <ul class="example-features">
                <li>Pantone color analysis</li>
                <li>Fabric dye testing</li>
                <li>Color approval process</li>
                <li>Fabric swatch delivery</li>
              </ul>
            </div>
          </div>

          <div class="example-card">
            <div class="example-image">✨</div>
            <div class="example-content">
              <h4 class="example-title">Design Application</h4>
              <p class="example-description">Adding logos, prints, and embroidery</p>
              <ul class="example-features">
                <li>Logo placement testing</li>
                <li>Print quality validation</li>
                <li>Embroidery sampling</li>
                <li>Design integration review</li>
              </ul>
            </div>
          </div>

          <div class="example-card">
            <div class="example-image">⚡</div>
            <div class="example-content">
              <h4 class="example-title">Workflow Combinations</h4>
              <p class="example-description">Mix and match options for perfect results</p>
              <ul class="example-features">
                <li>Multiple garments per order</li>
                <li>Different sample types</li>
                <li>Standalone lab dips</li>
                <li>Design-only samples</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  generateCalculatorContent() {
    return `
      <div class="guide-phase active">
        <div class="cost-calculator">
          <div class="calculator-header">
            <h4>Interactive Cost Calculator</h4>
            <p>See pricing update in real-time as you make selections</p>
          </div>
          
          <div class="cost-breakdown">
            <div class="cost-item">
              <p class="cost-item-label">Base Sample</p>
              <p class="cost-item-value" id="base-cost">€0</p>
            </div>
            <div class="cost-item">
              <p class="cost-item-label">Lab Dips</p>
              <p class="cost-item-value" id="labdip-cost">€0</p>
            </div>
            <div class="cost-item">
              <p class="cost-item-label">Designs</p>
              <p class="cost-item-value" id="design-cost">€0</p>
            </div>
            <div class="cost-item">
              <p class="cost-item-label">Extras</p>
              <p class="cost-item-value" id="extra-cost">€0</p>
            </div>
          </div>
          
          <div class="total-cost">
            <p class="total-cost-label">Total Estimated Cost</p>
            <p class="total-cost-value" id="total-cost">€0</p>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #075985;">
              <strong>Timeline:</strong> <span id="estimated-timeline">Select options to see timeline</span>
            </p>
          </div>
        </div>

        <div style="margin-top: 32px;">
          <h4 style="color: #1e293b; margin-bottom: 16px;">Quick Calculator</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Number of Garments</label>
              <input type="number" id="calc-garments" min="1" max="10" value="1" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Sample Type</label>
              <select id="calc-sample-type" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                <option value="">Select type</option>
                <option value="stock">Stock Fabric (€35)</option>
                <option value="custom">Custom Color (€65)</option>
                <option value="techpack">As Per TechPack (Premium)</option>
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Lab Dips</label>
              <input type="number" id="calc-labdips" min="0" max="20" value="0" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Designs</label>
              <input type="number" id="calc-designs" min="0" max="10" value="0" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindPhaseEvents(phase) {
    switch (phase) {
      case 'workflow':
        this.bindWorkflowEvents();
        break;
      case 'calculator':
        this.bindCalculatorEvents();
        break;
    }
  }

  bindWorkflowEvents() {
    // Garment selection
    document.querySelectorAll('.workflow-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleWorkflowChoice(btn.dataset.choice, btn.dataset.value);
      });
    });

    // Sample type selection
    document.querySelectorAll('.workflow-sample-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleWorkflowChoice(btn.dataset.choice, btn.dataset.value);
      });
    });
  }

  bindCalculatorEvents() {
    const inputs = ['calc-garments', 'calc-sample-type', 'calc-labdips', 'calc-designs'];
    inputs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('input', () => this.updateCalculator());
        element.addEventListener('change', () => this.updateCalculator());
      }
    });
  }

  handleWorkflowChoice(choice, value) {
    this.userSelections[choice + 'Type'] = value;

    if (choice === 'garment') {
      this.showFabricOptions(value);
    } else if (choice === 'fabric') {
      this.showSampleOptions();
    } else if (choice === 'sample') {
      this.showCustomizationOptions(value);
      this.selectedSampleType = value;
    }

    this.updateWorkflowSummary();
  }

  showFabricOptions(garmentType) {
    const fabricSelection = document.getElementById('fabric-selection');
    const fabricOptions = document.getElementById('fabric-options');
    
    if (!fabricSelection || !fabricOptions) return;

    // Simplified fabric options for demo
    const fabrics = {
      'T-Shirt': ['100% Organic Cotton', '80% Cotton 20% Polyester', '100% Polyester'],
      'Hoodie': ['Brushed Fleece Cotton', 'French Terry Cotton', '80% Cotton 20% Polyester'],
      'Sweatshirt': ['Brushed Fleece Cotton', 'French Terry Cotton', '70% Cotton 30% Polyester']
    };

    const availableFabrics = fabrics[garmentType] || [];
    
    fabricOptions.innerHTML = availableFabrics.map(fabric => `
      <button class="workflow-option" data-choice="fabric" data-value="${fabric}" style="padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; background: white; cursor: pointer; text-align: left;">
        <div style="font-weight: 600; color: #1e293b;">${fabric}</div>
      </button>
    `).join('');

    // Bind new events
    fabricOptions.querySelectorAll('.workflow-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleWorkflowChoice(btn.dataset.choice, btn.dataset.value);
      });
    });

    fabricSelection.style.display = 'block';
  }

  showSampleOptions() {
    const sampleSelection = document.getElementById('sample-selection');
    if (sampleSelection) {
      sampleSelection.style.display = 'block';
    }
  }

  showCustomizationOptions(sampleType) {
    const customizationOptions = document.getElementById('customization-options');
    const customizationContent = document.getElementById('customization-content');
    
    if (!customizationOptions || !customizationContent) return;

    let content = '';
    
    if (sampleType === 'stock') {
      content = `
        <div style="background: white; padding: 16px; border-radius: 8px; border: 2px solid #e2e8f0;">
          <h5 style="margin: 0 0 12px 0; color: #1e293b;">Optional Design Addition</h5>
          <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px;">Add a design to your stock fabric sample (+€15)</p>
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="add-design-stock"> Add design to sample
          </label>
        </div>
      `;
    } else if (sampleType === 'custom') {
      content = `
        <div style="background: white; padding: 16px; border-radius: 8px; border: 2px solid #e2e8f0; margin-bottom: 16px;">
          <h5 style="margin: 0 0 12px 0; color: #1e293b;">Required: Lab Dip</h5>
          <p style="margin: 0; color: #dc2626; font-size: 14px;">⚠️ Lab Dip is mandatory for custom color samples (+€25)</p>
        </div>
        <div style="background: white; padding: 16px; border-radius: 8px; border: 2px solid #e2e8f0;">
          <h5 style="margin: 0 0 12px 0; color: #1e293b;">Optional Design Addition</h5>
          <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px;">Add a design to your custom color sample (+€15)</p>
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="add-design-custom"> Add design to sample
          </label>
        </div>
      `;
    } else if (sampleType === 'techpack') {
      content = `
        <div style="background: white; padding: 16px; border-radius: 8px; border: 2px solid #e2e8f0;">
          <h5 style="margin: 0 0 12px 0; color: #1e293b;">Complete TechPack Implementation</h5>
          <p style="margin: 0; color: #059669; font-size: 14px;">✅ All specifications from your TechPack will be followed exactly</p>
        </div>
      `;
    }

    customizationContent.innerHTML = content;
    customizationOptions.style.display = 'block';
  }

  updateWorkflowSummary() {
    const summary = document.getElementById('workflow-summary');
    const summaryContent = document.getElementById('summary-content');
    
    if (!summary || !summaryContent) return;

    const { garmentType, fabricType, sampleType } = this.userSelections;
    
    if (garmentType && fabricType && sampleType) {
      let cost = 0;
      let timeline = '';
      
      if (sampleType === 'stock') {
        cost = 35;
        timeline = '1-2 weeks';
      } else if (sampleType === 'custom') {
        cost = 65 + 25; // Sample + mandatory lab dip
        timeline = '3 weeks';
      } else if (sampleType === 'techpack') {
        cost = 'Premium pricing';
        timeline = '4-5 weeks';
      }

      summaryContent.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
          <div>
            <strong>Garment:</strong><br>${garmentType}
          </div>
          <div>
            <strong>Fabric:</strong><br>${fabricType}
          </div>
          <div>
            <strong>Sample Type:</strong><br>${sampleType.charAt(0).toUpperCase() + sampleType.slice(1)}
          </div>
          <div>
            <strong>Cost:</strong><br>€${cost}
          </div>
          <div>
            <strong>Timeline:</strong><br>${timeline}
          </div>
        </div>
      `;
      
      summary.style.display = 'block';
    }
  }

  updateCalculator() {
    const garments = parseInt(document.getElementById('calc-garments')?.value || 0);
    const sampleType = document.getElementById('calc-sample-type')?.value;
    const labdips = parseInt(document.getElementById('calc-labdips')?.value || 0);
    const designs = parseInt(document.getElementById('calc-designs')?.value || 0);

    let baseCost = 0;
    let timeline = 'Select options to see timeline';

    if (sampleType) {
      if (sampleType === 'stock') {
        baseCost = 35 * garments;
        timeline = '1-2 weeks';
      } else if (sampleType === 'custom') {
        baseCost = 65 * garments;
        timeline = '3 weeks';
      } else if (sampleType === 'techpack') {
        baseCost = 150 * garments; // Estimated premium pricing
        timeline = '4-5 weeks';
      }
    }

    const labdipCost = labdips * 25;
    const designCost = designs * 15;
    const totalCost = baseCost + labdipCost + designCost;

    // Update display
    document.getElementById('base-cost').textContent = '€' + baseCost;
    document.getElementById('labdip-cost').textContent = '€' + labdipCost;
    document.getElementById('design-cost').textContent = '€' + designCost;
    document.getElementById('extra-cost').textContent = '€0';
    document.getElementById('total-cost').textContent = '€' + totalCost;
    document.getElementById('estimated-timeline').textContent = timeline;
  }

  startTryMode() {
    alert('Try Mode would open a simplified version of the interface for practice!');
    // Future: Open a demo version of the interface
  }

  startWorkflow() {
    this.close();
    // Focus on the actual workflow
    const addGarmentBtn = document.getElementById('add-garment');
    if (addGarmentBtn) {
      addGarmentBtn.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => addGarmentBtn.click(), 500);
    }
  }
};

// Add styles for workflow options
const workflowStyles = `
  .workflow-option {
    padding: 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
    font-weight: 600;
    color: #1e293b;
  }
  
  .workflow-option:hover {
    border-color: #667eea;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
  }
  
  .workflow-option.selected {
    border-color: #667eea;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  }
  
  .workflow-sample-option {
    padding: 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
  }
  
  .workflow-sample-option:hover {
    border-color: #667eea;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
  }
`;

// Inject workflow styles
const styleSheet = document.createElement('style');
styleSheet.textContent = workflowStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.V10VisualGuideInstance = new window.V10VisualGuide();
  });
} else {
  window.V10VisualGuideInstance = new window.V10VisualGuide();
}

} // End of prevent multiple loading check