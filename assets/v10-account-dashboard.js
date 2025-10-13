/**
 * V10 Wholesale Account Dashboard Controller
 * Fetches and displays submission history for wholesale customers
 */

const V10_AccountDashboard = {
  // State
  submissions: [],
  currentFilter: 'all',
  currentStatusFilter: 'pending', // Default to 'pending', options: 'pending', 'completed'
  currentView: 'dashboard', // Current active view: dashboard, orders, files, account
  customerEmail: null,
  garmentImages: {}, // Stores garment type to image URL mappings

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
    this.submissionsList = document.getElementById('v10-submissions-list');
    this.modal = document.getElementById('v10-submission-modal');
    this.modalClose = document.getElementById('modal-close');

    this.loadGarmentImages();
    this.setupEventListeners();
    this.setupViewSwitching();
    this.setupFileUpload();
    this.setupChangeRequest();

    // ✅ Fetch submissions directly (no authentication required)
    // Security: API validates email ownership server-side
    console.log('📊 Fetching submissions from API...');
    this.fetchSubmissions();
  },

  /**
   * Format order ID from request_id
   * Example: "GNNA-88-017" -> "Order #17"
   */
  formatOrderId(requestId, submissionId) {
    if (!requestId) {
      return `Order #${submissionId}`;
    }

    // Extract number after last dash
    const parts = requestId.split('-');
    const orderNumber = parts[parts.length - 1];

    return `Order #${orderNumber}`;
  },

  /**
   * Load garment images from data attributes
   */
  loadGarmentImages() {
    if (!this.dashboard) return;

    // Load all garment image URLs from data attributes
    this.garmentImages = {
      'tshirt': this.dashboard.dataset.garmentImageTshirt || '',
      't-shirt': this.dashboard.dataset.garmentImageTshirt || '',
      'hoodie': this.dashboard.dataset.garmentImageHoodie || '',
      'polo': this.dashboard.dataset.garmentImagePolo || '',
      'polo shirt': this.dashboard.dataset.garmentImagePolo || '',
      'sweatshirt': this.dashboard.dataset.garmentImageSweatshirt || '',
      'jacket': this.dashboard.dataset.garmentImageJacket || '',
      'pants': this.dashboard.dataset.garmentImagePants || '',
      'shorts': this.dashboard.dataset.garmentImageShorts || '',
      'tanktop': this.dashboard.dataset.garmentImageTanktop || '',
      'tank top': this.dashboard.dataset.garmentImageTanktop || '',
      'longsleeve': this.dashboard.dataset.garmentImageLongsleeve || '',
      'long sleeve': this.dashboard.dataset.garmentImageLongsleeve || '',
      'dress': this.dashboard.dataset.garmentImageDress || '',
      'default': this.dashboard.dataset.garmentImageDefault || ''
    };

    console.log('✅ Garment images loaded:', Object.keys(this.garmentImages).filter(k => this.garmentImages[k]).length, 'types');
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
      this.loadRecentOrders(); // ✅ Load recent orders for dashboard home view

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
   * Render submissions list (row layout)
   */
  renderSubmissions() {
    if (!this.submissionsList) return;

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
      this.submissionsList.innerHTML = '';
      this.submissionsList.style.display = 'none';
      return;
    }

    this.hideEmpty();
    this.submissionsList.style.display = 'flex';

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Render rows
    this.submissionsList.innerHTML = filtered.map(submission => this.renderSubmissionRow(submission)).join('');

    // Add click handlers
    this.submissionsList.querySelectorAll('.v10-submission-row').forEach((row, index) => {
      row.addEventListener('click', () => {
        this.showSubmissionDetails(filtered[index]);
      });
    });
  },

  /**
   * Render individual submission row - Option 3: Information Hierarchy
   * Clean, professional Notion-style layout with single-line header
   */
  renderSubmissionRow(submission) {
    const date = new Date(submission.created_at);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    // Get type label
    const typeLabels = {
      'quotation': 'Quotation Request',
      'sample-request': 'Sample Request',
      'bulk-order-request': 'Bulk Order Request'
    };

    // Get status label (color-coded text, no background)
    const statusLabels = {
      'pending': 'Pending',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'rejected': 'Rejected'
    };

    const garments = submission.data?.records?.garments || [];
    const garmentCount = garments.length;
    const fileCount = submission.data?.files?.length || 0;

    // Extract just the number for Order #
    const orderNumber = submission.request_id
      ? submission.request_id.split('-').pop()
      : submission.id;

    // Delivery timeline (with professional fallback)
    const timeline = submission.delivery_timeline || null;
    const timelineHTML = timeline
      ? `Delivery Timeline - ${timeline}`
      : 'Timeline to be confirmed';

    // Generate smart thumbnails (100px for Option 3)
    const thumbnailsHTML = this.generateSmartThumbnails(garments);

    return `
      <div class="v10-submission-row" data-id="${submission.id}">
        <!-- Single-line header with bullets -->
        <div class="v10-row-header">
          <div class="v10-row-header-left">
            <span class="v10-row-order-number">#${orderNumber}</span>
            <span class="v10-row-separator">•</span>
            <span class="v10-row-type">${typeLabels[submission.submission_type] || submission.submission_type}</span>
            <span class="v10-row-separator">•</span>
            <span class="v10-row-status v10-status-${submission.status}">${statusLabels[submission.status]}</span>
          </div>
          <div class="v10-row-header-right">
            <span class="v10-row-date">${formattedDate}</span>
          </div>
        </div>

        <!-- Horizontal divider -->
        <div class="v10-row-divider"></div>

        <!-- Thumbnails (hero section) -->
        ${thumbnailsHTML}

        <!-- Footer metadata -->
        <div class="v10-row-footer">
          <span>${garmentCount} garment${garmentCount !== 1 ? 's' : ''}</span>
          <span class="v10-row-separator">•</span>
          <span>${fileCount} file${fileCount !== 1 ? 's' : ''}</span>
          <span class="v10-row-separator">•</span>
          <span class="v10-row-timeline">${timelineHTML}</span>
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

    const orderIdDisplay = this.formatOrderId(submission.request_id, submission.id);
    document.getElementById('modal-title').textContent = orderIdDisplay;
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
    if (this.submissionsList) this.submissionsList.style.display = 'none';
  },

  /**
   * Hide loading state
   */
  hideLoading() {
    if (this.loadingState) this.loadingState.style.display = 'none';
    if (this.submissionsList) this.submissionsList.style.display = 'flex';
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
    if (this.submissionsList) this.submissionsList.style.display = 'none';
  },

  /**
   * Hide empty state
   */
  hideEmpty() {
    if (this.emptyState) this.emptyState.style.display = 'none';
  },

  /**
   * Setup view switching between Dashboard, Orders, Files, Account
   */
  setupViewSwitching() {
    // View tabs navigation
    const viewTabs = document.querySelectorAll('.v10-view-tab');
    viewTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const viewName = tab.dataset.view;
        this.switchView(viewName);
      });
    });

    // View All Orders button
    const viewAllBtn = document.querySelector('.v10-view-all-btn[data-navigate="orders"]');
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', () => {
        this.switchView('orders');
      });
    }

    console.log('✅ View switching setup complete');
  },

  /**
   * Switch between views
   */
  switchView(viewName) {
    console.log(`🔄 Switching to view: ${viewName}`);

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

    // Load view-specific content
    if (viewName === 'dashboard') {
      this.loadRecentOrders();
    } else if (viewName === 'orders') {
      // Orders view reuses existing renderSubmissions() which is already called
      this.renderSubmissions();
    } else if (viewName === 'files') {
      this.loadFileOrdersDropdown();
    } else if (viewName === 'account') {
      this.loadChangeOrdersDropdown();
    }
  },

  /**
   * Load recent orders for dashboard home (row layout)
   */
  loadRecentOrders() {
    const recentOrdersGrid = document.getElementById('recent-orders-grid');
    if (!recentOrdersGrid) return;

    // Get 4 most recent submissions
    const recentSubmissions = [...this.submissions]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 4);

    if (recentSubmissions.length === 0) {
      recentOrdersGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: #999999;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 48px; height: 48px; margin: 0 auto 1rem; opacity: 0.5;">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/>
          </svg>
          <p style="margin: 0; font-size: 0.875rem;">No submissions yet</p>
        </div>
      `;
      return;
    }

    // Render recent submissions using row layout
    recentOrdersGrid.innerHTML = recentSubmissions.map(submission =>
      this.renderSubmissionRow(submission)
    ).join('');

    // Add click handlers
    recentOrdersGrid.querySelectorAll('.v10-submission-row').forEach((row, index) => {
      row.addEventListener('click', () => {
        this.showSubmissionDetails(recentSubmissions[index]);
      });
    });

    console.log(`✅ Loaded ${recentSubmissions.length} recent orders`);
  },

  /**
   * Setup file upload functionality
   */
  setupFileUpload() {
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-trigger');

    if (!uploadZone || !fileInput) return;

    // Trigger file input when clicking upload zone or button
    const triggerFileInput = () => fileInput.click();

    if (uploadZone) {
      uploadZone.addEventListener('click', triggerFileInput);
    }

    if (uploadBtn) {
      uploadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerFileInput();
      });
    }

    // Handle drag and drop
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
      this.handleFileUpload(files);
    });

    // Handle file input change
    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      this.handleFileUpload(files);
    });

    console.log('✅ File upload setup complete (AppScript integration pending)');
  },

  /**
   * Handle file upload (placeholder for AppScript integration)
   */
  handleFileUpload(files) {
    const orderSelect = document.getElementById('file-order-select');
    const selectedOrder = orderSelect?.value;

    if (!selectedOrder) {
      alert('Please select an order first');
      return;
    }

    console.log('📎 Files to upload:', files.map(f => f.name));
    console.log('📦 Target order:', selectedOrder);

    // TODO: Phase 4 - Integrate with AppScript API
    // This will upload files to Google Drive like the TechPack app does
    alert(`⚠️ File upload integration pending\n\nFiles ready to upload:\n${files.map(f => f.name).join('\n')}\n\nTo: ${selectedOrder}\n\n(AppScript API integration in Phase 4)`);
  },

  /**
   * Setup change request form
   */
  setupChangeRequest() {
    const form = document.getElementById('change-request-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleChangeRequest();
    });

    console.log('✅ Change request form setup complete');
  },

  /**
   * Handle change request submission
   */
  handleChangeRequest() {
    const orderSelect = document.getElementById('change-order-select');
    const typeSelect = document.getElementById('change-type-select');
    const descriptionTextarea = document.getElementById('change-description');

    const formData = {
      orderId: orderSelect?.value,
      changeType: typeSelect?.value,
      description: descriptionTextarea?.value,
      customerEmail: this.customerEmail,
      timestamp: new Date().toISOString()
    };

    console.log('📝 Change request data:', formData);

    // TODO: Phase 4 - Send to Google Sheets "Client Change Request" page
    alert(`⚠️ Change request integration pending\n\nRequest details:\nOrder: ${formData.orderId}\nType: ${formData.changeType}\nDescription: ${formData.description}\n\n(Google Sheets integration in Phase 4)`);

    // Reset form
    if (descriptionTextarea) descriptionTextarea.value = '';
  },

  /**
   * Load orders dropdown for file upload (pending orders only)
   */
  loadFileOrdersDropdown() {
    const select = document.getElementById('file-order-select');
    if (!select) return;

    // Clear existing options except the first one
    select.innerHTML = '<option value="">Select an order...</option>';

    // Filter to pending orders only (in-progress/completed don't need file swaps)
    const pendingOrders = this.submissions.filter(s => s.status === 'pending');

    // Add options for each pending submission
    pendingOrders
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .forEach(submission => {
        const option = document.createElement('option');
        option.value = submission.id;
        const orderIdDisplay = this.formatOrderId(submission.request_id, submission.id);
        option.textContent = orderIdDisplay;
        select.appendChild(option);
      });

    console.log(`✅ Loaded ${pendingOrders.length} pending orders into file upload dropdown`);
  },

  /**
   * Load orders dropdown for change requests
   */
  loadChangeOrdersDropdown() {
    const select = document.getElementById('change-order-select');
    if (!select) return;

    // Clear existing options except the first one
    select.innerHTML = '<option value="">Select an order...</option>';

    // Add options for each submission
    this.submissions
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .forEach(submission => {
        const option = document.createElement('option');
        option.value = submission.id;
        const orderIdDisplay = this.formatOrderId(submission.request_id, submission.id);
        option.textContent = orderIdDisplay;
        select.appendChild(option);
      });

    console.log(`✅ Loaded ${this.submissions.length} orders into change request dropdown`);
  },

  /**
   * Get image URL for a garment type
   */
  getGarmentImageUrl(garmentType) {
    if (!garmentType) return this.garmentImages['default'] || '';

    // Normalize garment type (lowercase, trim)
    const normalized = garmentType.toLowerCase().trim();

    // Try exact match first
    if (this.garmentImages[normalized]) {
      return this.garmentImages[normalized];
    }

    // Try partial matches
    for (const key in this.garmentImages) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return this.garmentImages[key];
      }
    }

    // Fallback to default
    return this.garmentImages['default'] || '';
  },

  /**
   * Generate smart thumbnail grid for row layout - Option 3
   * 1-5 garments: Single row (100px tall) - Hero showcase
   * 6-10 garments: Double row (50px tall each = 100px total) - Compact grid
   * 10+ garments: Show first 10 + "+N more" indicator
   */
  generateSmartThumbnails(garments) {
    if (!garments || garments.length === 0) {
      return '<div class="v10-row-thumbnails v10-thumbnails-empty"><span>No images</span></div>';
    }

    const totalGarments = garments.length;
    const maxShow = 10; // Maximum garments to display

    let layoutClass = '';
    let toShow = [];
    let remaining = 0;

    if (totalGarments <= 5) {
      // Single row layout - larger 100px thumbnails (hero showcase)
      layoutClass = 'v10-thumbnails-single-row';
      toShow = garments.slice(0, 5);
    } else if (totalGarments <= 10) {
      // Double row layout - 2 rows of 50px thumbnails (compact grid)
      layoutClass = 'v10-thumbnails-double-row';
      toShow = garments.slice(0, 10);
    } else {
      // More than 10 - show first 10 in double row + "+N more"
      layoutClass = 'v10-thumbnails-double-row';
      toShow = garments.slice(0, 10); // Show 10 garments
      remaining = totalGarments - 10;
    }

    let html = `<div class="v10-row-thumbnails ${layoutClass}">`;

    toShow.forEach(garment => {
      const imageUrl = this.getGarmentImageUrl(garment.type);
      if (imageUrl) {
        html += `
          <div class="v10-thumbnail" title="${garment.type}">
            <img src="${imageUrl}" alt="${garment.type}" loading="lazy">
          </div>
        `;
      } else {
        // Placeholder if no image - show first letter
        html += `
          <div class="v10-thumbnail v10-thumbnail-placeholder" title="${garment.type}">
            <span>${garment.type.substring(0, 1).toUpperCase()}</span>
          </div>
        `;
      }
    });

    // Add "+N more" indicator if needed
    if (remaining > 0) {
      html += `<div class="v10-thumbnail v10-thumbnail-more">+${remaining}</div>`;
    }

    html += '</div>';
    return html;
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
