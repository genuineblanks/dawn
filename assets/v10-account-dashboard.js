/**
 * V10 Wholesale Account Dashboard Controller
 * Fetches and displays submission history for wholesale customers
 */

const V10_AccountDashboard = {
  // State
  submissions: [],
  currentFilter: 'all',
  currentStatusFilter: 'pending', // Default to 'pending', options: 'pending', 'completed'
  customerEmail: null,
  customerName: null,
  currentView: 'dashboard', // NEW: Track current view

  // DOM Elements
  dashboard: null,
  loadingState: null,
  emptyState: null,
  submissionsGrid: null,
  modal: null,
  modalClose: null,

  /**
   * Initialize dashboard
   */
  init() {
    this.dashboard = document.getElementById('v10-wholesale-dashboard');

    if (!this.dashboard) {
      console.log('⏭️ Wholesale dashboard not found (customer is retail)');
      return;
    }

    console.log('✅ Initializing V10 Wholesale Account Dashboard');

    this.customerEmail = this.dashboard.dataset.customerEmail;
    this.customerName = this.dashboard.dataset.customerName;
    this.loadingState = document.getElementById('v10-loading-state');
    this.emptyState = document.getElementById('v10-empty-state');
    this.submissionsGrid = document.getElementById('v10-submissions-grid');
    this.modal = document.getElementById('v10-submission-modal');
    this.modalClose = document.getElementById('modal-close');

    this.setupEventListeners();
    this.setupViewSwitching(); // NEW
    this.setupFileUpload(); // NEW
    this.setupEmailModule(); // NEW

    // ✅ Fetch submissions directly (no authentication required)
    // Security: API validates email ownership server-side
    console.log('📊 Fetching submissions from API...');
    this.fetchSubmissions();
  },

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Type filter tabs
    const filterTabs = document.querySelectorAll('.v10-filter-tab');
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;
        this.setFilter(filter);
      });
    });

    // Status filter tabs
    const statusTabs = document.querySelectorAll('.v10-status-filter-tab');
    statusTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const statusFilter = tab.dataset.statusFilter;
        this.setStatusFilter(statusFilter);
      });
    });

    // Modal close
    if (this.modalClose) {
      this.modalClose.addEventListener('click', () => this.closeModal());
    }

    // Close modal on backdrop click
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.closeModal();
        }
      });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && this.modal.classList.contains('show')) {
        this.closeModal();
      }
    });
  },

  /**
   * Setup view switching between Dashboard/Orders/Files/Email
   */
  setupViewSwitching() {
    // View tab buttons
    const viewTabs = document.querySelectorAll('.v10-view-tab');
    viewTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const viewName = tab.dataset.view;
        this.switchView(viewName);
      });
    });

    // Module card navigation buttons
    const moduleCards = document.querySelectorAll('[data-navigate]');
    moduleCards.forEach(card => {
      card.addEventListener('click', () => {
        const viewName = card.dataset.navigate;
        this.switchView(viewName);
      });
    });

    // View all button
    const viewAllBtn = document.querySelector('.v10-view-all-btn');
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', () => {
        this.switchView('orders');
      });
    }
  },

  /**
   * Switch between views
   */
  switchView(viewName) {
    console.log('🔄 Switching to view:', viewName);

    // Update current view
    this.currentView = viewName;

    // Hide all views
    document.querySelectorAll('.v10-view-content').forEach(view => {
      view.style.display = 'none';
    });

    // Show selected view
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
      targetView.style.display = 'block';
    }

    // Update active tab
    document.querySelectorAll('.v10-view-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.view === viewName);
    });

    // Load data for specific views
    if (viewName === 'dashboard') {
      this.loadRecentOrders();
    } else if (viewName === 'orders') {
      this.renderSubmissions(); // Use existing method
    } else if (viewName === 'files') {
      this.loadFileOrdersDropdown();
    } else if (viewName === 'email') {
      this.loadEmailOrdersDropdown();
    }
  },

  /**
   * Load recent 4 orders for dashboard home view
   */
  loadRecentOrders() {
    const recentGrid = document.getElementById('recent-orders-grid');
    if (!recentGrid) return;

    // Get 4 most recent submissions
    const recent = [...this.submissions]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 4);

    if (recent.length === 0) {
      recentGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #999;">
          <p>No orders yet. Create your first submission to get started!</p>
        </div>
      `;
      return;
    }

    recentGrid.innerHTML = recent.map(submission => this.renderSubmissionCard(submission)).join('');

    // Add click handlers
    recentGrid.querySelectorAll('.v10-submission-card').forEach((card, index) => {
      card.addEventListener('click', () => {
        this.showSubmissionDetails(recent[index]);
      });
    });
  },

  /**
   * Setup file upload module
   */
  setupFileUpload() {
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-file-btn');
    const fileOrderSelect = document.getElementById('file-order-select');

    if (!uploadZone || !fileInput) return;

    // Drag and drop handlers
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');

      const files = Array.from(e.dataTransfer.files);
      this.handleFileSelection(files);
    });

    // Click to upload
    uploadZone.addEventListener('click', () => {
      fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      this.handleFileSelection(files);
    });

    // Upload button
    if (uploadBtn) {
      uploadBtn.addEventListener('click', () => {
        this.uploadFiles();
      });
    }

    // Order selection change - load current files
    if (fileOrderSelect) {
      fileOrderSelect.addEventListener('change', (e) => {
        const requestId = e.target.value;
        this.loadCurrentFiles(requestId);
      });
    }
  },

  /**
   * Handle file selection and preview
   */
  handleFileSelection(files) {
    if (files.length === 0) return;

    const previewSection = document.getElementById('file-preview-section');
    const filesList = document.getElementById('files-to-upload-list');

    if (!previewSection || !filesList) return;

    // Store files for upload
    this.filesToUpload = files;

    // Show preview
    previewSection.style.display = 'block';
    filesList.innerHTML = files.map((file, index) => `
      <div class="v10-file-preview-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
          <polyline points="13 2 13 9 20 9"/>
        </svg>
        <div>
          <div class="file-name">${file.name}</div>
          <div class="file-size">${(file.size / 1024).toFixed(1)} KB</div>
        </div>
      </div>
    `).join('');
  },

  /**
   * Load current files for selected order
   */
  loadCurrentFiles(requestId) {
    const submission = this.submissions.find(s => s.request_id === requestId);
    const currentFilesList = document.getElementById('current-files-list');

    if (!currentFilesList) return;

    if (!submission || !submission.data?.files || submission.data.files.length === 0) {
      currentFilesList.innerHTML = '<p style="color: #999; font-size: 0.875rem;">No files uploaded yet</p>';
      return;
    }

    currentFilesList.innerHTML = `
      <h4 style="font-size: 0.875rem; color: #999; margin-bottom: 0.75rem;">Current Files:</h4>
      ${submission.data.files.map(file => `
        <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: #2d2d2d; border-radius: 4px; margin-bottom: 0.5rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
            <polyline points="13 2 13 9 20 9"/>
          </svg>
          <span style="font-size: 0.875rem; color: #fff;">${file.name}</span>
        </div>
      `).join('')}
    `;
  },

  /**
   * Upload files to API
   */
  async uploadFiles() {
    if (!this.filesToUpload || this.filesToUpload.length === 0) {
      alert('Please select files to upload');
      return;
    }

    const requestId = document.getElementById('file-order-select')?.value;
    if (!requestId) {
      alert('Please select an order');
      return;
    }

    const uploadBtn = document.getElementById('upload-file-btn');
    if (uploadBtn) {
      uploadBtn.textContent = 'UPLOADING...';
      uploadBtn.disabled = true;
    }

    try {
      // Convert files to base64
      const filePromises = Array.from(this.filesToUpload).map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({
            name: file.name,
            type: file.type,
            data: reader.result
          });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const filesData = await Promise.all(filePromises);

      // Upload to API
      const response = await fetch('https://dawn-main-theme.vercel.app/api/upload-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          customerEmail: this.customerEmail,
          files: filesData
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('Files uploaded successfully!');
        this.filesToUpload = null;
        document.getElementById('file-preview-section').style.display = 'none';
        document.getElementById('file-input').value = '';

        // Refresh submissions to show new files
        await this.fetchSubmissions();
        this.loadCurrentFiles(requestId);
      } else {
        throw new Error(result.error || 'Upload failed');
      }

    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload files: ' + error.message);
    } finally {
      if (uploadBtn) {
        uploadBtn.textContent = 'UPLOAD FILES';
        uploadBtn.disabled = false;
      }
    }
  },

  /**
   * Load orders dropdown for files view
   */
  loadFileOrdersDropdown() {
    const select = document.getElementById('file-order-select');
    if (!select) return;

    select.innerHTML = '<option value="">Select an order...</option>' +
      this.submissions
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map(s => `<option value="${s.request_id}">${s.request_id} - ${this.getTypeLabel(s.submission_type)}</option>`)
        .join('');
  },

  /**
   * Setup email module
   */
  setupEmailModule() {
    const sendBtn = document.getElementById('send-email-btn');
    const emailOrderSelect = document.getElementById('email-order-select');
    const templateSelect = document.getElementById('email-template-select');
    const messageTextarea = document.getElementById('email-message');

    if (!sendBtn) return;

    // Load email templates
    if (templateSelect) {
      const templates = {
        'blank': '',
        'status': `Hi,\n\nI'd like to inquire about the status of my order [ORDER_ID].\n\nCould you please provide an update?\n\nThank you,\n${this.customerName || 'Customer'}`,
        'revision': `Hi,\n\nI need to request a revision for order [ORDER_ID].\n\nDetails:\n[Please describe the changes needed]\n\nThank you,\n${this.customerName || 'Customer'}`,
        'question': `Hi,\n\nI have a question about order [ORDER_ID].\n\n[Your question here]\n\nThank you,\n${this.customerName || 'Customer'}`
      };

      templateSelect.addEventListener('change', (e) => {
        const template = templates[e.target.value] || '';
        const orderId = emailOrderSelect?.value || '[ORDER_ID]';
        messageTextarea.value = template.replace('[ORDER_ID]', orderId);
      });
    }

    // Update template when order changes
    if (emailOrderSelect && templateSelect) {
      emailOrderSelect.addEventListener('change', () => {
        // Trigger template update with new order ID
        const event = new Event('change');
        templateSelect.dispatchEvent(event);
      });
    }

    // Send email
    sendBtn.addEventListener('click', () => {
      this.sendEmail();
    });
  },

  /**
   * Send email via API
   */
  async sendEmail() {
    const orderSelect = document.getElementById('email-order-select');
    const messageTextarea = document.getElementById('email-message');
    const sendBtn = document.getElementById('send-email-btn');

    const requestId = orderSelect?.value;
    const message = messageTextarea?.value?.trim();

    if (!requestId) {
      alert('Please select an order');
      return;
    }

    if (!message) {
      alert('Please enter a message');
      return;
    }

    if (sendBtn) {
      sendBtn.textContent = 'SENDING...';
      sendBtn.disabled = true;
    }

    try {
      const response = await fetch('https://dawn-main-theme.vercel.app/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          customerEmail: this.customerEmail,
          customerName: this.customerName,
          message
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('Message sent successfully!');
        messageTextarea.value = '';
        document.getElementById('email-template-select').value = 'blank';
      } else {
        throw new Error(result.error || 'Failed to send email');
      }

    } catch (error) {
      console.error('Send email error:', error);
      alert('Failed to send message: ' + error.message);
    } finally {
      if (sendBtn) {
        sendBtn.textContent = 'SEND MESSAGE';
        sendBtn.disabled = false;
      }
    }
  },

  /**
   * Load orders dropdown for email view
   */
  loadEmailOrdersDropdown() {
    const select = document.getElementById('email-order-select');
    if (!select) return;

    select.innerHTML = '<option value="">Select an order...</option>' +
      this.submissions
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map(s => `<option value="${s.request_id}">${s.request_id} - ${this.getTypeLabel(s.submission_type)}</option>`)
        .join('');
  },

  /**
   * Get type label for display
   */
  getTypeLabel(type) {
    const labels = {
      'quotation': 'Quotation',
      'sample-request': 'Sample Request',
      'bulk-order-request': 'Bulk Order'
    };
    return labels[type] || type;
  },

  /**
   * Fetch submissions from API
   */
  async fetchSubmissions() {
    try {
      console.log('📊 ============ DASHBOARD FETCH DEBUG ============');
      console.log('📧 Fetching submissions for customer email:', this.customerEmail);

      this.showLoading();

      const apiUrl = `https://dawn-main-theme.vercel.app/api/submissions?email=${encodeURIComponent(this.customerEmail)}`;
      console.log('🌐 API URL:', apiUrl);

      const response = await fetch(apiUrl);
      console.log('📡 Response Status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response Error Body:', errorText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📦 API Response:', result);

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch submissions');
      }

      this.submissions = result.data || [];
      console.log(`✅ Fetched ${this.submissions.length} submissions`);

      if (this.submissions.length > 0) {
        console.log('📋 First submission:', {
          id: this.submissions[0].id,
          email: this.submissions[0].customer_email,
          type: this.submissions[0].submission_type,
          request_id: this.submissions[0].request_id,
          created_at: this.submissions[0].created_at
        });
      }
      console.log('📊 ============================================');

      this.hideLoading();
      this.updateStatistics();
      this.renderSubmissions();

    } catch (error) {
      console.error('❌ Failed to fetch submissions:', error);
      this.hideLoading();
      this.showEmpty();
    }
  },

  /**
   * Update statistics in quick actions
   */
  updateStatistics() {
    const total = this.submissions.length;

    // Update filter tab counts
    const quotations = this.submissions.filter(s => s.submission_type === 'quotation').length;
    const samples = this.submissions.filter(s => s.submission_type === 'sample-request').length;
    const bulk = this.submissions.filter(s => s.submission_type === 'bulk-order-request').length;

    document.getElementById('count-all').textContent = total;
    document.getElementById('count-quotation').textContent = quotations;
    document.getElementById('count-sample').textContent = samples;
    document.getElementById('count-bulk').textContent = bulk;
  },

  /**
   * Render submissions grid
   */
  renderSubmissions() {
    if (!this.submissionsGrid) return;

    // Filter submissions by type
    let filtered = this.submissions;
    if (this.currentFilter !== 'all') {
      filtered = this.submissions.filter(s => s.submission_type === this.currentFilter);
    }

    // Filter submissions by status
    if (this.currentStatusFilter === 'pending') {
      filtered = filtered.filter(s => s.status === 'pending');
    } else if (this.currentStatusFilter === 'in_progress') {
      filtered = filtered.filter(s => s.status === 'in_progress');
    } else if (this.currentStatusFilter === 'completed') {
      filtered = filtered.filter(s => s.status === 'completed');
    }

    // Show empty state if no submissions
    if (filtered.length === 0) {
      this.showEmpty(this.currentFilter);
      this.submissionsGrid.innerHTML = '';
      this.submissionsGrid.style.display = 'none';
      return;
    }

    this.hideEmpty();
    this.submissionsGrid.style.display = 'grid';

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Render cards
    this.submissionsGrid.innerHTML = filtered.map(submission => this.renderSubmissionCard(submission)).join('');

    // Add click handlers
    this.submissionsGrid.querySelectorAll('.v10-submission-card').forEach((card, index) => {
      card.addEventListener('click', () => {
        this.showSubmissionDetails(filtered[index]);
      });
    });
  },

  /**
   * Render individual submission card
   */
  renderSubmissionCard(submission) {
    const date = new Date(submission.created_at);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Get type label
    const typeLabels = {
      'quotation': 'Quotation',
      'sample-request': 'Sample Request',
      'bulk-order-request': 'Bulk Order'
    };

    // Get status label and format
    const statusLabels = {
      'pending': 'Pending',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'rejected': 'Rejected'
    };

    // Count garments
    const garmentCount = submission.data?.records?.garments?.length || 0;

    return `
      <div class="v10-submission-card" data-id="${submission.id}">
        <div class="v10-submission-header">
          <span class="v10-submission-type-badge ${submission.submission_type}">
            ${typeLabels[submission.submission_type] || submission.submission_type}
          </span>
          <span class="v10-submission-status v10-status-${submission.status}">
            ${statusLabels[submission.status] || submission.status}
          </span>
        </div>

        <h3 class="v10-submission-id">${submission.request_id || 'ID-' + submission.id}</h3>
        <p class="v10-submission-date">Submitted ${formattedDate}</p>

        <div class="v10-submission-meta">
          <div class="v10-meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
            <span>${garmentCount} garment${garmentCount !== 1 ? 's' : ''}</span>
          </div>
          ${submission.data?.files && submission.data.files.length > 0 ? `
          <div class="v10-meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13 2 13 9 20 9"/>
            </svg>
            <span>${submission.data.files.length} file${submission.data.files.length !== 1 ? 's' : ''}</span>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Show submission details in modal
   */
  showSubmissionDetails(submission) {
    if (!this.modal) return;

    console.log('📋 Showing details for submission:', submission.request_id);

    // Set modal title
    const typeLabels = {
      'quotation': 'Quotation',
      'sample-request': 'Sample Request',
      'bulk-order-request': 'Bulk Order'
    };

    document.getElementById('modal-title').textContent = submission.request_id || `Submission #${submission.id}`;
    document.getElementById('modal-subtitle').textContent = typeLabels[submission.submission_type] || submission.submission_type;

    // Build modal body
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = this.buildSubmissionDetailsHTML(submission);

    // Show modal
    this.modal.style.display = 'flex';
    requestAnimationFrame(() => {
      this.modal.classList.add('show');
    });

    document.body.style.overflow = 'hidden';
  },

  /**
   * Build submission details HTML - V10 TechPack Studios Professional Style
   */
  buildSubmissionDetailsHTML(submission) {
    const data = submission.data;
    const client = data?.client_data || {};
    const garments = data?.records?.garments || [];
    const files = data?.files || []; // Files are stored in data.files, not submission.files

    // DEBUG: Log submission structure
    console.log('🔍 ============ MODAL DATA DEBUG ============');
    console.log('📦 Full submission data:', submission);
    console.log('👕 Garments array:', garments);
    if (garments.length > 0) {
      console.log('👕 First garment structure:', garments[0]);
      console.log('🎨 First garment keys:', Object.keys(garments[0]));
    }
    console.log('🎨 Unassigned swatches:', data?.records?.unassignedFabricSwatches || data?.unassignedFabricSwatches);
    console.log('🎨 Unassigned lab dips:', data?.records?.unassignedLabDips || data?.unassignedLabDips);
    console.log('🔍 =========================================');

    const date = new Date(submission.created_at);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Extract main color from garment - try multiple sources
    const getGarmentColor = (garment) => {
      console.log('🎨 Getting color for garment:', garment.type);

      // STOCK SAMPLES: Check sampleSubValue first (e.g., "white", "black")
      if (garment.sampleSubValue) {
        const colorName = garment.sampleSubValue.toLowerCase();
        console.log('✅ Found sampleSubValue:', colorName);

        // Convert common color names to hex
        const colorMap = {
          'white': '#FFFFFF',
          'black': '#000000',
          'gray': '#808080',
          'grey': '#808080',
          'red': '#FF0000',
          'blue': '#0000FF',
          'green': '#00FF00',
          'yellow': '#FFFF00',
          'navy': '#000080',
          'beige': '#F5F5DC'
        };

        if (colorMap[colorName]) {
          return colorMap[colorName];
        }
      }

      // CUSTOM SAMPLES: Get color from assigned lab dips
      if (garment.assignedLabDips && garment.assignedLabDips.length > 0 && data.records?.lab_dips) {
        const firstLabDipId = garment.assignedLabDips[0];
        const labDip = data.records.lab_dips.find(ld => ld.id === firstLabDipId);
        if (labDip && labDip.hex) {
          console.log('✅ Found color from assigned lab dip:', labDip.hex, labDip.pantone);
          return labDip.hex;
        }
      }

      // Fallback to multi-colored gradient (matches V10 TechPack App)
      console.log('⚠️ No color found, using multi-colored fallback');
      return 'MULTI_COLOR';
    };

    // Generate darker shade for beautiful gradient effect (matches V10 TechPack App)
    const getDarkerShade = (hex) => {
      // Remove # if present
      const cleanHex = hex.replace('#', '');

      // Parse RGB values
      const r = parseInt(cleanHex.slice(0, 2), 16);
      const g = parseInt(cleanHex.slice(2, 4), 16);
      const b = parseInt(cleanHex.slice(4, 6), 16);

      // Darken by 25% for gradient effect
      const darker = (val) => Math.max(0, Math.floor(val * 0.75));

      // Convert back to hex
      const toHex = (val) => val.toString(16).padStart(2, '0');

      return `#${toHex(darker(r))}${toHex(darker(g))}${toHex(darker(b))}`;
    };

    // Generate beautiful gradient background like V10 TechPack App
    const getGradientBackground = (color) => {
      // Multi-colored conic gradient for items without color data
      if (color === 'MULTI_COLOR') {
        return 'conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #ff6b6b)';
      }

      // Regular diagonal gradient for specific colors
      const darkerShade = getDarkerShade(color);
      return `linear-gradient(135deg, ${color}, ${darkerShade})`;
    };

    // Generate box shadow for depth (matches V10 TechPack App)
    const getColorShadow = (color) => {
      // Multi-colored items get neutral shadow
      if (color === 'MULTI_COLOR') {
        return '0 2px 8px rgba(150, 150, 150, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
      }

      // Remove # for rgba conversion
      const cleanHex = color.replace('#', '');
      const r = parseInt(cleanHex.slice(0, 2), 16);
      const g = parseInt(cleanHex.slice(2, 4), 16);
      const b = parseInt(cleanHex.slice(4, 6), 16);

      return `0 2px 8px rgba(${r}, ${g}, ${b}, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)`;
    };

    let html = `
      <!-- Status Row -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #3a3a3a;">
        <div>
          <div style="font-size: 0.75rem; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">Status</div>
          <span class="v10-submission-status ${submission.status}">${submission.status.toUpperCase()}</span>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.75rem; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">Submitted</div>
          <div style="font-size: 0.875rem; color: #ffffff; font-weight: 500;">${formattedDate}</div>
        </div>
      </div>

      ${client.company_name || client.company ? `
      <!-- Client Information -->
      <div style="margin-bottom: 2rem; padding: 1.25rem; background: linear-gradient(135deg, #2d2d2d 0%, #242424 100%); border: 1px solid #3a3a3a; border-radius: 8px;">
        <h4 style="font-size: 0.75rem; font-weight: 700; color: #999999; margin: 0 0 0.75rem 0; text-transform: uppercase; letter-spacing: 1px;">CLIENT INFORMATION</h4>
        <p style="margin: 0; color: #ffffff; font-size: 1rem; font-weight: 600;">${client.company_name || client.company}</p>
        ${client.email ? `<p style="margin: 0.5rem 0 0 0; color: #cccccc; font-size: 0.875rem;">${client.email}</p>` : ''}
      </div>
      ` : ''}

      ${garments.length > 0 ? `
      <!-- 2-Column Grid Layout -->
      <div style="display: grid; grid-template-columns: 1fr; gap: 2rem; margin-bottom: 2rem;">

        <!-- LEFT: Garment Specifications -->
        <div>
          <h4 style="font-size: 0.75rem; font-weight: 700; color: #999999; margin: 0 0 1rem 0; text-transform: uppercase; letter-spacing: 1px;">GARMENT SPECIFICATIONS</h4>
          <div style="display: grid; gap: 0.75rem;">
            ${data.costs?.items?.filter(item => item.garment).map((costItem, index) => {
              // Get the cost item garment
              const costGarment = costItem.garment;

              // Cross-reference with records.garments to get full garment object with sampleSubValue and assignedLabDips
              const fullGarment = data.records?.garments?.find(g => g.id === costGarment.id) || costGarment;

              // Split fullDescription at first " - " to separate title from description
              const fullDesc = costItem.fullDescription || '';
              const dashIndex = fullDesc.indexOf(' - ');
              const title = dashIndex > 0 ? fullDesc.substring(0, dashIndex) : fullDesc;
              const description = dashIndex > 0 ? fullDesc.substring(dashIndex + 3) : '';

              const garmentColor = getGarmentColor(fullGarment);

              return `
              <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: linear-gradient(135deg, #2d2d2d 0%, #242424 100%); border: 1px solid #3a3a3a; border-radius: 8px;">

                <!-- Colored Square (V10 Beautiful Style) -->
                <div style="width: 26px; height: 26px; min-width: 26px; min-height: 26px; background: ${getGradientBackground(garmentColor)}; border-radius: 0; flex-shrink: 0; border: 1px solid rgba(0, 0, 0, 0.2); box-shadow: ${getColorShadow(garmentColor)}; display: block;"></div>

                <!-- Full Description from Costs -->
                <div style="flex: 1; min-width: 0;">
                  <p style="margin: 0 0 0.25rem 0; font-size: 0.9375rem; font-weight: 700; color: #ffffff; line-height: 1.3;">${title}</p>
                  ${description ? `<p style="margin: 0; font-size: 0.875rem; font-weight: 400; color: #cccccc; line-height: 1.5;">${description}</p>` : ''}
                </div>
              </div>
              `;
            }).join('') || garments.map((garment, index) => {
              const garmentColor = getGarmentColor(garment);
              return `
              <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: linear-gradient(135deg, #2d2d2d 0%, #242424 100%); border: 1px solid #3a3a3a; border-radius: 8px;">
                <div style="width: 26px; height: 26px; min-width: 26px; min-height: 26px; background: ${getGradientBackground(garmentColor)}; border-radius: 0; flex-shrink: 0; border: 1px solid rgba(0, 0, 0, 0.2); box-shadow: ${getColorShadow(garmentColor)}; display: block;"></div>
                <div style="flex: 1;">
                  <p style="margin: 0; font-size: 0.9375rem; font-weight: 600; color: #ffffff;">${index + 1}. ${garment.type} - ${garment.fabricType}</p>
                </div>
              </div>
            `;
            }).join('')}
          </div>
        </div>

        <!-- RIGHT: Fabric Swatches & Lab Dips -->
        ${(() => {
          const allLabDips = data?.records?.lab_dips || [];
          const assignedLabDipIds = Object.keys(data?.records?.assignments?.lab_dips || {});
          const unassignedLabDips = allLabDips.filter(labDip => !assignedLabDipIds.includes(labDip.id));

          if (unassignedLabDips.length === 0) return '';

          return `
          <div>
            <h4 style="font-size: 0.75rem; font-weight: 700; color: #999999; margin: 0 0 1rem 0; text-transform: uppercase; letter-spacing: 1px;">FABRIC SWATCHES & LAB DIPS (${unassignedLabDips.length})</h4>
            <div style="display: grid; gap: 0.75rem;">
              ${unassignedLabDips.map(dip => {
                const dipColor = dip.hex || 'MULTI_COLOR';
                return `
                <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: linear-gradient(135deg, #2d2d2d 0%, #242424 100%); border: 1px solid #3a3a3a; border-radius: 8px;">
                  <div style="width: 26px; height: 26px; min-width: 26px; min-height: 26px; background: ${getGradientBackground(dipColor)}; border-radius: 0; flex-shrink: 0; border: 1px solid rgba(0, 0, 0, 0.2); box-shadow: ${getColorShadow(dipColor)}; display: block;"></div>
                  <div style="flex: 1; min-width: 0;">
                    <p style="margin: 0 0 0.25rem 0; font-size: 0.9375rem; font-weight: 700; color: #ffffff; line-height: 1.3;">${dip.pantone || dip.name || 'Unnamed'}</p>
                    ${dip.hex ? `<p style="margin: 0; font-size: 0.875rem; font-weight: 400; color: #cccccc; line-height: 1.5;">${dip.hex.toUpperCase()}</p>` : ''}
                  </div>
                </div>
                `;
              }).join('')}
            </div>
          </div>
          `;
        })()}

      </div>

      <style>
        @media (min-width: 768px) {
          .v10-modal-body > div:has(> div > h4:first-child) {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      </style>
      ` : ''}

      ${files.length > 0 ? `
      <!-- Files Section -->
      <div style="margin-bottom: 2rem;">
        <h4 style="font-size: 0.75rem; font-weight: 700; color: #999999; margin: 0 0 1rem 0; text-transform: uppercase; letter-spacing: 1px;">FILES (${files.length})</h4>
        <div style="display: grid; gap: 0.5rem;">
          ${files.map(file => `
            <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; background: linear-gradient(135deg, #2d2d2d 0%, #242424 100%); border: 1px solid #3a3a3a; border-radius: 6px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #10b981; flex-shrink: 0;">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                <polyline points="13 2 13 9 20 9"/>
              </svg>
              <div style="flex: 1; min-width: 0;">
                <p style="margin: 0; font-size: 0.875rem; font-weight: 600; color: #ffffff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${file.name}</p>
                <p style="margin: 0.125rem 0 0 0; font-size: 0.75rem; color: #999999;">${file.type || 'Unknown type'}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}


      <!-- Contact Section -->
      <div style="padding-top: 1.5rem; border-top: 1px solid #3a3a3a;">
        <p style="font-size: 0.875rem; color: #999999; margin: 0;">
          Need help with this submission? Contact us at <a href="mailto:office@genuineblanks.com" style="color: #10b981; text-decoration: none; font-weight: 600;">office@genuineblanks.com</a>
        </p>
      </div>
    `;

    return html;
  },

  /**
   * Close modal
   */
  closeModal() {
    if (!this.modal) return;

    this.modal.classList.remove('show');
    setTimeout(() => {
      this.modal.style.display = 'none';
    }, 300);

    document.body.style.overflow = '';
  },

  /**
   * Set active filter
   */
  setFilter(filter) {
    this.currentFilter = filter;

    // Update active tab
    document.querySelectorAll('.v10-filter-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.filter === filter);
    });

    // Re-render submissions
    this.renderSubmissions();
  },

  /**
   * Set status filter
   */
  setStatusFilter(statusFilter) {
    this.currentStatusFilter = statusFilter;

    // Update active tab
    document.querySelectorAll('.v10-status-filter-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.statusFilter === statusFilter);
    });

    // Re-render submissions
    this.renderSubmissions();
  },

  /**
   * Show loading state
   */
  showLoading() {
    if (this.loadingState) this.loadingState.style.display = 'block';
    if (this.emptyState) this.emptyState.style.display = 'none';
    if (this.submissionsGrid) this.submissionsGrid.style.display = 'none';
  },

  /**
   * Hide loading state
   */
  hideLoading() {
    if (this.loadingState) this.loadingState.style.display = 'none';
    if (this.submissionsGrid) this.submissionsGrid.style.display = 'grid';
  },

  /**
   * Show empty state with context-specific message
   */
  showEmpty(filter = 'all') {
    if (!this.emptyState) return;

    // Update empty state message based on filter
    const emptyMessages = {
      'all': {
        title: 'No submissions yet',
        message: 'Start your first garment development project by creating a new submission'
      },
      'quotation': {
        title: 'No quotations found',
        message: 'You haven\'t submitted any quotation requests yet'
      },
      'sample-request': {
        title: 'No sample requests found',
        message: 'You haven\'t submitted any sample requests yet'
      },
      'bulk-order-request': {
        title: 'No bulk orders found',
        message: 'You haven\'t submitted any bulk order requests yet'
      }
    };

    const msg = emptyMessages[filter] || emptyMessages['all'];

    // Update empty state content
    const titleEl = this.emptyState.querySelector('h3');
    const messageEl = this.emptyState.querySelector('p');

    if (titleEl) titleEl.textContent = msg.title;
    if (messageEl) messageEl.textContent = msg.message;

    // Show/hide "Create First Submission" button only for 'all' filter
    const buttonEl = this.emptyState.querySelector('a, .v10-btn-primary');
    if (buttonEl) {
      buttonEl.style.display = (filter === 'all' && this.submissions.length === 0) ? 'inline-block' : 'none';
    }

    this.emptyState.style.display = 'block';
    if (this.submissionsGrid) this.submissionsGrid.style.display = 'none';
  },

  /**
   * Hide empty state
   */
  hideEmpty() {
    if (this.emptyState) this.emptyState.style.display = 'none';
  },
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => V10_AccountDashboard.init());
} else {
  V10_AccountDashboard.init();
}

// Expose globally for debugging
window.V10_AccountDashboard = V10_AccountDashboard;
