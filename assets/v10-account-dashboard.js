/**
 * V10 Wholesale Account Dashboard Controller
 * Fetches and displays submission history for wholesale customers
 */

const V10_AccountDashboard = {
  // State
  submissions: [],
  currentFilter: 'all',
  customerEmail: null,

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
    this.loadingState = document.getElementById('v10-loading-state');
    this.emptyState = document.getElementById('v10-empty-state');
    this.submissionsGrid = document.getElementById('v10-submissions-grid');
    this.modal = document.getElementById('v10-submission-modal');
    this.modalClose = document.getElementById('modal-close');

    this.setupEventListeners();
    this.fetchSubmissions();
  },

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Filter tabs
    const filterTabs = document.querySelectorAll('.v10-filter-tab');
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;
        this.setFilter(filter);
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
    const inProgress = this.submissions.filter(s =>
      s.status === 'pending' || s.status === 'in-review' || s.status === 'approved' || s.status === 'in-production'
    ).length;

    // Update counts
    document.getElementById('v10-total-submissions').textContent = total;
    document.getElementById('v10-in-progress').textContent = inProgress;

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

    // Filter submissions
    let filtered = this.submissions;
    if (this.currentFilter !== 'all') {
      filtered = this.submissions.filter(s => s.submission_type === this.currentFilter);
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

    // Count garments
    const garmentCount = submission.data?.records?.garments?.length || 0;

    return `
      <div class="v10-submission-card" data-id="${submission.id}">
        <div class="v10-submission-header">
          <span class="v10-submission-type-badge ${submission.submission_type}">
            ${typeLabels[submission.submission_type] || submission.submission_type}
          </span>
          <span class="v10-submission-status ${submission.status}">
            ${submission.status}
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
          ${submission.files && submission.files.length > 0 ? `
          <div class="v10-meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13 2 13 9 20 9"/>
            </svg>
            <span>${submission.files.length} file${submission.files.length !== 1 ? 's' : ''}</span>
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
    const files = submission.files || [];

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

      // Fallback to neutral gray
      console.log('⚠️ No color found, using fallback gray');
      return '#555555';
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

              return `
              <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: linear-gradient(135deg, #2d2d2d 0%, #242424 100%); border: 1px solid #3a3a3a; border-radius: 8px;">

                <!-- Colored Square -->
                <div style="width: 40px; height: 40px; min-width: 40px; min-height: 40px; background-color: ${getGarmentColor(fullGarment)}; border-radius: 6px; flex-shrink: 0; border: 1px solid rgba(255, 255, 255, 0.1); display: block;"></div>

                <!-- Full Description from Costs -->
                <div style="flex: 1; min-width: 0;">
                  <p style="margin: 0 0 0.25rem 0; font-size: 0.9375rem; font-weight: 700; color: #ffffff; line-height: 1.3;">${title}</p>
                  ${description ? `<p style="margin: 0; font-size: 0.875rem; font-weight: 400; color: #cccccc; line-height: 1.5;">${description}</p>` : ''}
                </div>
              </div>
              `;
            }).join('') || garments.map((garment, index) => `
              <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: linear-gradient(135deg, #2d2d2d 0%, #242424 100%); border: 1px solid #3a3a3a; border-radius: 8px;">
                <div style="width: 40px; height: 40px; min-width: 40px; min-height: 40px; background-color: ${getGarmentColor(garment)}; border-radius: 6px; flex-shrink: 0; border: 1px solid rgba(255, 255, 255, 0.1); display: block;"></div>
                <div style="flex: 1;">
                  <p style="margin: 0; font-size: 0.9375rem; font-weight: 600; color: #ffffff;">${index + 1}. ${garment.type} - ${garment.fabricType}</p>
                </div>
              </div>
            `).join('')}
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
            <div>
              <div style="display: grid; gap: 0.5rem;">
                ${unassignedLabDips.map(dip => `
                  <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; background: linear-gradient(135deg, #2d2d2d 0%, #242424 100%); border: 1px solid #3a3a3a; border-radius: 6px;">
                    <div style="width: 32px; height: 32px; min-width: 32px; min-height: 32px; background-color: ${dip.hex || '#555555'}; border-radius: 4px; flex-shrink: 0; border: 1px solid rgba(255, 255, 255, 0.1); display: block;"></div>
                    <div style="flex: 1; min-width: 0;">
                      <p style="margin: 0; font-size: 0.875rem; font-weight: 600; color: #ffffff;">${dip.pantone || dip.name || 'Unnamed'}</p>
                      ${dip.hex ? `<p style="margin: 0.125rem 0 0 0; font-size: 0.75rem; color: #999999;">${dip.hex.toUpperCase()}</p>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
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
                <p style="margin: 0; font-size: 0.875rem; font-weight: 600; color: #ffffff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${file.file_name}</p>
                <p style="margin: 0.125rem 0 0 0; font-size: 0.75rem; color: #999999;">${file.file_type}</p>
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
