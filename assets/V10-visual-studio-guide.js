/* ===============================================
   V10 Visual Studio Guide - Dark Financial Dashboard Theme
   Perfectly Aligned with V10 TechPack Design System
   =============================================== */

/* ==============================================
   SCOPED STYLES - V10 VISUAL GUIDE ONLY
   ============================================== */

/* Ensure V10 Visual Guide uses the V10 design system */
.visual-guide-overlay,
.visual-guide-overlay *,
.visual-guide-modal,
.visual-guide-modal *,
[class*="visual-guide"] *,
[class*="guide-"] * {
  /* Use V10 color system */
  --color-scheme-5-background: transparent !important;
  --color-scheme-5-button-label: inherit !important;
  --color-foreground: var(--color-base-text, 18, 18, 18) !important;
  
  /* Ensure proper V10 styling */
  background-color: transparent;
  color: inherit;
  box-sizing: border-box;
}

/* ==============================================
   BASE MODAL & OVERLAY - V10 SYSTEM
   ============================================== */

.visual-guide-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: var(--v10-backdrop-blur, blur(12px));
  z-index: var(--v10-z-modal-backdrop, 1040);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--v10-space-4, 1rem);
  opacity: 0;
  visibility: hidden;
  transition: var(--v10-transition, all 0.2s cubic-bezier(0.4, 0, 0.2, 1));
}

.visual-guide-overlay.active {
  opacity: 1;
  visibility: visible;
}

.visual-guide-modal {
  background: var(--v10-glass-bg, rgba(42, 42, 42, 0.8));
  backdrop-filter: var(--v10-backdrop-blur, blur(12px));
  border: 1px solid var(--v10-glass-border, rgba(255, 255, 255, 0.1));
  border-radius: var(--v10-radius-lg, 2px);
  box-shadow: var(--v10-glass-shadow, 0 8px 32px rgba(0, 0, 0, 0.3));
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  transform: scale(0.95) translateY(var(--v10-space-4, 1rem));
  transition: transform var(--v10-transition, 0.2s cubic-bezier(0.4, 0, 0.2, 1));
  position: relative;
}

.visual-guide-overlay.active .visual-guide-modal {
  transform: scale(1) translateY(0);
}

/* ==============================================
   MODAL HEADER - V10 STYLE
   ============================================== */

.visual-guide-header {
  background: var(--v10-bg-secondary, #2a2a2a);
  color: var(--v10-text-primary, #ffffff);
  padding: var(--v10-space-6, 1.5rem);
  border-bottom: 1px solid var(--v10-border-primary, #404040);
  position: relative;
}

.visual-guide-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.visual-guide-header-text h2 {
  font-size: var(--v10-text-2xl, 1.5rem);
  font-weight: 600;
  margin: 0 0 var(--v10-space-2, 0.5rem) 0;
  color: var(--v10-text-primary, #ffffff);
  line-height: 1.2;
}

.visual-guide-header-text p {
  font-size: var(--v10-text-base, 1rem);
  color: var(--v10-text-secondary, #e5e5e5);
  margin: 0;
  font-weight: 400;
}

.visual-guide-close {
  background: transparent;
  border: 1px solid var(--v10-border-primary, #404040);
  border-radius: var(--v10-radius-md, 2px);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--v10-transition, all 0.2s cubic-bezier(0.4, 0, 0.2, 1));
  color: var(--v10-text-secondary, #e5e5e5);
}

.visual-guide-close:hover {
  background: var(--v10-bg-hover, #404040);
  color: var(--v10-text-primary, #ffffff);
  border-color: var(--v10-border-focus, #a3a3a3);
}

/* ==============================================
   MODAL BODY - V10 STYLE
   ============================================== */

.visual-guide-body {
  padding: var(--v10-space-6, 1.5rem);
  overflow-y: auto;
  max-height: calc(90vh - 140px);
  background: var(--v10-bg-primary, #1a1a1a);
  color: var(--v10-text-primary, #ffffff);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: var(--v10-text-base, 1rem);
  line-height: 1.6;
}

/* ==============================================
   NAVIGATION TABS - V10 STYLE
   ============================================== */

.guide-navigation {
  display: flex;
  background: var(--v10-bg-secondary, #2a2a2a);
  border: 1px solid var(--v10-border-primary, #404040);
  border-radius: var(--v10-radius-md, 2px);
  padding: var(--v10-space-1, 0.25rem);
  margin-bottom: var(--v10-space-6, 1.5rem);
  gap: var(--v10-space-1, 0.25rem);
}

.guide-nav-tab {
  flex: 1;
  background: transparent;
  border: none;
  padding: var(--v10-space-3, 0.75rem) var(--v10-space-4, 1rem);
  border-radius: var(--v10-radius-sm, 2px);
  font-size: var(--v10-text-sm, 0.875rem);
  font-weight: 500;
  color: var(--v10-text-muted, #b3b3b3);
  cursor: pointer;
  transition: var(--v10-transition, all 0.2s cubic-bezier(0.4, 0, 0.2, 1));
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--v10-space-2, 0.5rem);
}

.guide-nav-tab.active {
  background: var(--v10-bg-tertiary, #333333);
  color: var(--v10-text-primary, #ffffff);
  box-shadow: var(--v10-shadow-sm, 0 1px 3px 0 rgba(0, 0, 0, 0.4));
}

.guide-nav-tab:hover:not(.active) {
  color: var(--v10-text-secondary, #e5e5e5);
  background: var(--v10-bg-hover, #404040);
}

/* ==============================================
   PHASE CONTENT - V10 STYLE
   ============================================== */

.guide-phase {
  display: none;
}

.guide-phase.active {
  display: block;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(var(--v10-space-2, 0.5rem)); }
  to { opacity: 1; transform: translateY(0); }
}

/* ==============================================
   PROCESS FLOW DIAGRAM - V10 STYLE
   ============================================== */

.process-flow-container {
  background: var(--v10-bg-secondary, #2a2a2a);
  border: 1px solid var(--v10-border-primary, #404040);
  border-radius: var(--v10-radius-lg, 2px);
  padding: var(--v10-space-6, 1.5rem);
  margin-bottom: var(--v10-space-6, 1.5rem);
  position: relative;
}

.process-flow-title {
  text-align: center;
  margin-bottom: var(--v10-space-6, 1.5rem);
}

.process-flow-title h3 {
  font-size: var(--v10-text-xl, 1.25rem);
  font-weight: 600;
  color: var(--v10-text-primary, #ffffff);
  margin: 0 0 var(--v10-space-2, 0.5rem) 0;
}

.process-flow-title p {
  color: var(--v10-text-secondary, #e5e5e5);
  margin: 0;
  font-size: var(--v10-text-base, 1rem);
}

.process-flow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--v10-space-4, 1rem);
}

.process-step {
  flex: 1;
  min-width: 200px;
  text-align: center;
  position: relative;
}

.process-step-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--v10-radius-md, 2px);
  background: var(--v10-bg-tertiary, #333333);
  border: 1px solid var(--v10-border-primary, #404040);
  box-shadow: var(--v10-shadow-sm, 0 1px 3px 0 rgba(0, 0, 0, 0.4));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--v10-space-4, 1rem);
  font-size: 28px;
  transition: var(--v10-transition, all 0.2s cubic-bezier(0.4, 0, 0.2, 1));
  cursor: pointer;
}

.process-step-icon:hover {
  background: var(--v10-bg-hover, #404040);
  border-color: var(--v10-border-focus, #a3a3a3);
  transform: translateY(-2px);
  box-shadow: var(--v10-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.4));
}

.process-step.active .process-step-icon {
  background: var(--v10-accent-primary, #a3a3a3);
  color: var(--v10-bg-primary, #1a1a1a);
  border-color: var(--v10-accent-primary, #a3a3a3);
  transform: scale(1.05);
}

.process-step-title {
  font-size: var(--v10-text-base, 1rem);
  font-weight: 600;
  color: var(--v10-text-primary, #ffffff);
  margin: 0 0 var(--v10-space-2, 0.5rem) 0;
}

.process-step-description {
  font-size: var(--v10-text-sm, 0.875rem);
  color: var(--v10-text-muted, #b3b3b3);
  margin: 0;
  line-height: 1.4;
}

/* Process Arrows */
.process-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 32px;
  right: -16px;
  width: 32px;
  height: 2px;
  background: var(--v10-border-secondary, #333333);
  z-index: 1;
}

/* ==============================================
   DECISION TREE - V10 STYLE
   ============================================== */

.decision-tree {
  background: var(--v10-bg-card, #2a2a2a);
  border: 1px solid var(--v10-border-primary, #404040);
  border-radius: var(--v10-radius-lg, 2px);
  overflow: hidden;
  margin-bottom: var(--v10-space-6, 1.5rem);
}

.decision-tree-header {
  background: var(--v10-bg-tertiary, #333333);
  padding: var(--v10-space-4, 1rem) var(--v10-space-6, 1.5rem);
  border-bottom: 1px solid var(--v10-border-primary, #404040);
}

.decision-tree-header h4 {
  font-size: var(--v10-text-lg, 1.125rem);
  font-weight: 600;
  color: var(--v10-text-primary, #ffffff);
  margin: 0 0 var(--v10-space-2, 0.5rem) 0;
}

.decision-tree-header p {
  color: var(--v10-text-secondary, #e5e5e5);
  margin: 0;
  font-size: var(--v10-text-sm, 0.875rem);
}

.decision-tree-content {
  padding: var(--v10-space-6, 1.5rem);
}

.decision-branch {
  margin-bottom: var(--v10-space-4, 1rem);
  padding: var(--v10-space-4, 1rem);
  border: 1px solid var(--v10-border-secondary, #333333);
  border-radius: var(--v10-radius-md, 2px);
  transition: var(--v10-transition, all 0.2s cubic-bezier(0.4, 0, 0.2, 1));
  cursor: pointer;
  position: relative;
  background: var(--v10-bg-secondary, #2a2a2a);
}

.decision-branch:hover {
  border-color: var(--v10-border-focus, #a3a3a3);
  background: var(--v10-bg-hover, #404040);
  box-shadow: var(--v10-shadow-sm, 0 1px 3px 0 rgba(0, 0, 0, 0.4));
}

.decision-branch.selected {
  border-color: var(--v10-accent-primary, #a3a3a3);
  background: var(--v10-bg-active, #4a4a4a);
}

.branch-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--v10-space-3, 0.75rem);
}

.branch-title {
  font-size: var(--v10-text-base, 1rem);
  font-weight: 600;
  color: var(--v10-text-primary, #ffffff);
  margin: 0;
}

.branch-price {
  background: var(--v10-accent-primary, #a3a3a3);
  color: var(--v10-bg-primary, #1a1a1a);
  padding: var(--v10-space-1, 0.25rem) var(--v10-space-3, 0.75rem);
  border-radius: var(--v10-radius-sm, 2px);
  font-size: var(--v10-text-sm, 0.875rem);
  font-weight: 600;
}

.branch-description {
  color: var(--v10-text-secondary, #e5e5e5);
  font-size: var(--v10-text-sm, 0.875rem);
  margin: 0 0 var(--v10-space-2, 0.5rem) 0;
}

.branch-timeline {
  color: var(--v10-accent-success, #22c55e);
  font-size: var(--v10-text-xs, 0.75rem);
  font-weight: 500;
  margin: 0;
}

.branch-requirements {
  margin-top: var(--v10-space-3, 0.75rem);
  padding-top: var(--v10-space-3, 0.75rem);
  border-top: 1px solid var(--v10-border-secondary, #333333);
}

.requirement-tag {
  display: inline-block;
  background: var(--v10-bg-tertiary, #333333);
  color: var(--v10-text-secondary, #e5e5e5);
  padding: var(--v10-space-1, 0.25rem) var(--v10-space-2, 0.5rem);
  border-radius: var(--v10-radius-sm, 2px);
  font-size: var(--v10-text-xs, 0.75rem);
  font-weight: 500;
  margin-right: var(--v10-space-2, 0.5rem);
  margin-bottom: var(--v10-space-1, 0.25rem);
  border: 1px solid var(--v10-border-secondary, #333333);
}

.requirement-tag.optional {
  background: rgba(34, 197, 94, 0.1);
  color: var(--v10-accent-success, #22c55e);
  border-color: rgba(34, 197, 94, 0.2);
}

.requirement-tag.mandatory {
  background: rgba(239, 68, 68, 0.1);
  color: var(--v10-accent-error, #ef4444);
  border-color: rgba(239, 68, 68, 0.2);
}

/* ==============================================
   VISUAL EXAMPLES GRID - V10 STYLE
   ============================================== */

.visual-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--v10-space-6, 1.5rem);
  margin-bottom: var(--v10-space-6, 1.5rem);
}

.example-card {
  background: var(--v10-bg-card, #2a2a2a);
  border: 1px solid var(--v10-border-primary, #404040);
  border-radius: var(--v10-radius-lg, 2px);
  overflow: hidden;
  transition: var(--v10-transition, all 0.2s cubic-bezier(0.4, 0, 0.2, 1));
}

.example-card:hover {
  border-color: var(--v10-border-focus, #a3a3a3);
  box-shadow: var(--v10-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.4));
}

.example-image {
  width: 100%;
  height: 160px;
  background: var(--v10-bg-tertiary, #333333);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  position: relative;
  border-bottom: 1px solid var(--v10-border-primary, #404040);
}

.example-content {
  padding: var(--v10-space-4, 1rem);
}

.example-title {
  font-size: var(--v10-text-base, 1rem);
  font-weight: 600;
  color: var(--v10-text-primary, #ffffff);
  margin: 0 0 var(--v10-space-2, 0.5rem) 0;
}

.example-description {
  color: var(--v10-text-secondary, #e5e5e5);
  font-size: var(--v10-text-sm, 0.875rem);
  margin: 0 0 var(--v10-space-3, 0.75rem) 0;
  line-height: 1.4;
}

.example-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.example-features li {
  color: var(--v10-accent-success, #22c55e);
  font-size: var(--v10-text-xs, 0.75rem);
  margin-bottom: var(--v10-space-1, 0.25rem);
  display: flex;
  align-items: center;
  gap: var(--v10-space-2, 0.5rem);
}

.example-features li::before {
  content: '✓';
  color: var(--v10-accent-success, #22c55e);
  font-weight: bold;
  width: 12px;
  flex-shrink: 0;
}

/* ==============================================
   COST CALCULATOR - V10 STYLE
   ============================================== */

.cost-calculator {
  background: var(--v10-bg-secondary, #2a2a2a);
  border: 1px solid var(--v10-border-primary, #404040);
  border-radius: var(--v10-radius-lg, 2px);
  padding: var(--v10-space-6, 1.5rem);
  margin-bottom: var(--v10-space-6, 1.5rem);
}

.calculator-header {
  text-align: center;
  margin-bottom: var(--v10-space-5, 1.25rem);
}

.calculator-header h4 {
  font-size: var(--v10-text-xl, 1.25rem);
  font-weight: 600;
  color: var(--v10-text-primary, #ffffff);
  margin: 0 0 var(--v10-space-2, 0.5rem) 0;
}

.calculator-header p {
  color: var(--v10-text-secondary, #e5e5e5);
  margin: 0;
  font-size: var(--v10-text-sm, 0.875rem);
}

.cost-breakdown {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--v10-space-4, 1rem);
  margin-bottom: var(--v10-space-5, 1.25rem);
}

.cost-item {
  background: var(--v10-bg-tertiary, #333333);
  padding: var(--v10-space-4, 1rem);
  border-radius: var(--v10-radius-md, 2px);
  text-align: center;
  border: 1px solid var(--v10-border-secondary, #333333);
}

.cost-item-label {
  font-size: var(--v10-text-xs, 0.75rem);
  color: var(--v10-text-muted, #b3b3b3);
  margin: 0 0 var(--v10-space-1, 0.25rem) 0;
  font-weight: 500;
}

.cost-item-value {
  font-size: var(--v10-text-lg, 1.125rem);
  font-weight: 600;
  color: var(--v10-text-primary, #ffffff);
  margin: 0;
}

.total-cost {
  background: var(--v10-accent-primary, #a3a3a3);
  color: var(--v10-bg-primary, #1a1a1a);
  padding: var(--v10-space-5, 1.25rem);
  border-radius: var(--v10-radius-md, 2px);
  text-align: center;
  margin-top: var(--v10-space-4, 1rem);
}

.total-cost-label {
  font-size: var(--v10-text-sm, 0.875rem);
  margin: 0 0 var(--v10-space-1, 0.25rem) 0;
  font-weight: 500;
}

.total-cost-value {
  font-size: var(--v10-text-2xl, 1.5rem);
  font-weight: 700;
  margin: 0;
}

/* ==============================================
   ACTION BUTTONS - V10 SYSTEM
   ============================================== */

.guide-actions {
  display: flex;
  gap: var(--v10-space-3, 0.75rem);
  justify-content: center;
  margin-top: var(--v10-space-6, 1.5rem);
  padding-top: var(--v10-space-6, 1.5rem);
  border-top: 1px solid var(--v10-border-primary, #404040);
}

/* Use V10 Button System */
.guide-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--v10-space-2, 0.5rem);
  padding: var(--v10-space-3, 0.75rem) var(--v10-space-6, 1.5rem);
  border-radius: var(--v10-radius-md, 2px);
  font-size: var(--v10-text-base, 1rem);
  font-weight: 500;
  text-decoration: none;
  transition: var(--v10-transition, all 0.2s cubic-bezier(0.4, 0, 0.2, 1));
  cursor: pointer;
  border: 1px solid;
}

.guide-btn-primary {
  background: var(--v10-accent-primary, #a3a3a3);
  color: var(--v10-bg-primary, #1a1a1a);
  border-color: var(--v10-accent-primary, #a3a3a3);
}

.guide-btn-primary:hover:not(:disabled) {
  background: var(--v10-accent-secondary, #d4d4d4);
  border-color: var(--v10-accent-secondary, #d4d4d4);
  transform: translateY(-1px);
  box-shadow: var(--v10-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.4));
}

.guide-btn-secondary {
  background: var(--v10-bg-tertiary, #333333);
  color: var(--v10-text-primary, #ffffff);
  border-color: var(--v10-border-primary, #404040);
}

.guide-btn-secondary:hover:not(:disabled) {
  background: var(--v10-bg-hover, #404040);
  border-color: var(--v10-border-focus, #a3a3a3);
  transform: translateY(-1px);
}

/* ==============================================
   WORKFLOW INTERACTIVE ELEMENTS - V10 STYLE
   ============================================== */

.workflow-option {
  padding: var(--v10-space-4, 1rem);
  border: 1px solid var(--v10-border-secondary, #333333);
  border-radius: var(--v10-radius-md, 2px);
  background: var(--v10-bg-secondary, #2a2a2a);
  cursor: pointer;
  transition: var(--v10-transition, all 0.2s cubic-bezier(0.4, 0, 0.2, 1));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--v10-space-2, 0.5rem);
  text-align: center;
  font-weight: 500;
  color: var(--v10-text-primary, #ffffff);
}

.workflow-option:hover {
  border-color: var(--v10-border-focus, #a3a3a3);
  background: var(--v10-bg-hover, #404040);
  box-shadow: var(--v10-shadow-sm, 0 1px 3px 0 rgba(0, 0, 0, 0.4));
}

.workflow-option.selected {
  border-color: var(--v10-accent-primary, #a3a3a3);
  background: var(--v10-bg-active, #4a4a4a);
}

.workflow-sample-option {
  padding: var(--v10-space-4, 1rem);
  border: 1px solid var(--v10-border-secondary, #333333);
  border-radius: var(--v10-radius-md, 2px);
  background: var(--v10-bg-secondary, #2a2a2a);
  cursor: pointer;
  transition: var(--v10-transition, all 0.2s cubic-bezier(0.4, 0, 0.2, 1));
  text-align: center;
  color: var(--v10-text-primary, #ffffff);
}

.workflow-sample-option:hover {
  border-color: var(--v10-border-focus, #a3a3a3);
  background: var(--v10-bg-hover, #404040);
  box-shadow: var(--v10-shadow-sm, 0 1px 3px 0 rgba(0, 0, 0, 0.4));
}

/* ==============================================
   FORM ELEMENTS - V10 STYLE
   ============================================== */

input[type="number"],
input[type="text"],
select {
  width: 100%;
  padding: var(--v10-space-3, 0.75rem);
  border: 1px solid var(--v10-border-secondary, #333333);
  border-radius: var(--v10-radius-md, 2px);
  background: var(--v10-bg-input, #333333);
  color: var(--v10-text-primary, #ffffff);
  font-size: var(--v10-text-base, 1rem);
  font-family: inherit;
  transition: var(--v10-transition-fast, all 0.15s cubic-bezier(0.4, 0, 0.2, 1));
}

input[type="number"]:focus,
input[type="text"]:focus,
select:focus {
  outline: none;
  border-color: var(--v10-border-focus, #a3a3a3);
  box-shadow: var(--v10-shadow-focus, 0 0 0 3px rgba(163, 163, 163, 0.3));
}

/* ==============================================
   MOBILE RESPONSIVE - V10 SYSTEM
   ============================================== */

@media (max-width: 768px) {
  .visual-guide-modal {
    margin: var(--v10-space-3, 0.75rem);
    max-height: 95vh;
    border-radius: var(--v10-radius-md, 2px);
  }

  .visual-guide-header {
    padding: var(--v10-space-4, 1rem);
  }

  .visual-guide-header-text h2 {
    font-size: var(--v10-text-xl, 1.25rem);
  }

  .visual-guide-body {
    padding: var(--v10-space-4, 1rem);
  }

  .process-flow {
    flex-direction: column;
    align-items: center;
  }

  .process-step:not(:last-child)::after {
    display: none;
  }

  .process-step {
    min-width: auto;
    width: 100%;
    margin-bottom: var(--v10-space-4, 1rem);
  }

  .guide-navigation {
    flex-direction: column;
    gap: var(--v10-space-2, 0.5rem);
  }

  .guide-nav-tab {
    padding: var(--v10-space-3, 0.75rem) var(--v10-space-4, 1rem);
  }

  .visual-examples {
    grid-template-columns: 1fr;
  }

  .cost-breakdown {
    grid-template-columns: 1fr;
  }

  .guide-actions {
    flex-direction: column;
  }
}

/* ==============================================
   ACCESSIBILITY - V10 SYSTEM
   ============================================== */

@media (prefers-reduced-motion: reduce) {
  .visual-guide-overlay,
  .visual-guide-modal,
  .process-step-icon,
  .decision-branch,
  .example-card,
  .guide-btn,
  .workflow-option {
    transition: none;
  }

  .guide-phase {
    animation: none;
  }
}

/* Focus States - V10 System */
.guide-nav-tab:focus,
.decision-branch:focus,
.guide-btn:focus,
.visual-guide-close:focus,
.workflow-option:focus {
  outline: none;
  box-shadow: var(--v10-shadow-focus, 0 0 0 3px rgba(163, 163, 163, 0.3));
}

/* High Contrast Mode Support - V10 System */
@media (prefers-contrast: high) {
  .visual-guide-modal {
    border-color: var(--v10-text-primary, #ffffff);
  }
  
  .requirement-tag {
    border-color: currentColor;
  }
}

/* ==============================================
   PRINT STYLES - V10 SYSTEM
   ============================================== */

@media print {
  .visual-guide-overlay {
    display: none !important;
  }
}