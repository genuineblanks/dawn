// ===============================================
// TECH PACK STATE MANAGEMENT MODULE
// ===============================================

// Enhanced Application State
class TechPackState {
  constructor() {
    this.currentStep = 1;
    this.isInitialized = false;
    this.formData = {
      clientInfo: {},
      files: [],
      garments: [],
      requiredGarmentCount: 1
    };
    this.counters = {
      file: 0,
      garment: 0,
      colorway: 0
    };
    this.ui = {
      animations: new Map(),
      validators: new Map(),
      observers: new Set()
    };
  }

  reset() {
    this.currentStep = 1;
    this.formData = { clientInfo: {}, files: [], garments: [] };
    this.counters = { file: 0, garment: 0, colorway: 0 };
    this.ui.animations.clear();
    this.ui.validators.clear();
  }

  // Deep clone for immutability
  getState() {
    return JSON.parse(JSON.stringify({
      currentStep: this.currentStep,
      formData: this.formData,
      counters: this.counters
    }));
  }

  setState(newState) {
    Object.assign(this, newState);
    this.notifyObservers();
  }

  subscribe(callback) {
    this.ui.observers.add(callback);
    return () => this.ui.observers.delete(callback);
  }

  notifyObservers() {
    this.ui.observers.forEach(callback => callback(this.getState()));
  }
}

// Enhanced Debug System
class DebugSystem {
  constructor() {
    this.enabled = false;
    this.panel = null;
    this.content = null;
    this.logs = [];
    this.maxLogs = 100;
  }

  init() {
    this.createPanel();
    this.setupKeyboardShortcuts();
  }

  createPanel() {
    this.panel = document.createElement('div');
    this.panel.id = 'debug-panel';
    this.panel.className = 'debug-panel';
    this.panel.style.cssText = `
      position: fixed; top: 20px; right: 20px; width: 350px; max-height: 400px;
      background: rgba(0,0,0,0.9); color: #fff; border-radius: 8px; padding: 15px;
      font-family: 'Courier New', monospace; font-size: 11px; z-index: 10000;
      display: none; overflow-y: auto; backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
    `;

    this.content = document.createElement('div');
    this.content.id = 'debug-content';
    this.panel.appendChild(this.content);

    const controls = document.createElement('div');
    controls.innerHTML = `
      <button onclick="window.techPackDebug.clear()" style="margin-right: 10px; padding: 5px 10px; background: #333; color: #fff; border: none; border-radius: 3px; cursor: pointer;">Clear</button>
      <button onclick="window.techPackDebug.exportLogs()" style="padding: 5px 10px; background: #333; color: #fff; border: none; border-radius: 3px; cursor: pointer;">Export</button>
    `;
    this.panel.insertBefore(controls, this.content);

    document.body.appendChild(this.panel);
    window.techPackDebug = this;
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    this.panel.style.display = this.enabled ? 'block' : 'none';
    this.log(`Debug panel ${this.enabled ? 'enabled' : 'disabled'}`, null, 'info');
  }

  log(message, data = null, type = 'log') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      timestamp,
      message,
      data,
      type,
      stack: type === 'error' ? new Error().stack : null
    };

    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    console[type](message, data);
    
    if (this.enabled && this.content) {
      this.renderLog(logEntry);
    }
  }

  renderLog(logEntry) {
    const style = {
      padding: '8px 12px',
      margin: '2px 0',
      borderRadius: '4px',
      fontSize: '10px',
      fontFamily: 'Courier New, monospace',
      borderLeft: '3px solid'
    };

    const logElement = document.createElement('div');
    Object.assign(logElement.style, style);

    const typeColors = {
      log: { bg: 'rgba(70, 130, 180, 0.2)', border: '#4682b4' },
      info: { bg: 'rgba(60, 179, 113, 0.2)', border: '#3cb371' },
      warn: { bg: 'rgba(255, 165, 0, 0.2)', border: '#ffa500' },
      error: { bg: 'rgba(220, 20, 60, 0.2)', border: '#dc143c' }
    };

    const colors = typeColors[logEntry.type] || typeColors.log;
    logElement.style.backgroundColor = colors.bg;
    logElement.style.borderLeftColor = colors.border;

    logElement.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <span style="font-weight: bold; color: ${colors.border};">[${logEntry.type.toUpperCase()}]</span>
        <span style="color: #ccc; font-size: 9px;">${logEntry.timestamp}</span>
      </div>
      <div style="color: #fff; margin-bottom: 4px;">${logEntry.message}</div>
      ${logEntry.data ? `<pre style="color: #ddd; font-size: 9px; margin: 4px 0; white-space: pre-wrap;">${JSON.stringify(logEntry.data, null, 2)}</pre>` : ''}
    `;

    this.content.appendChild(logElement);
    this.content.scrollTop = this.content.scrollHeight;
  }

  refreshPanel() {
    if (!this.content) return;
    this.content.innerHTML = '';
    this.logs.forEach(log => this.renderLog(log));
  }

  clear() {
    this.logs = [];
    if (this.content) {
      this.content.innerHTML = '';
    }
    this.log('Debug logs cleared', null, 'info');
  }

  exportLogs() {
    const data = JSON.stringify(this.logs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `techpack-debug-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Export classes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TechPackState, DebugSystem };
} else {
  window.TechPackState = { TechPackState, DebugSystem };
}