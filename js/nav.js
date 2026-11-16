/* ============================================================
   nav.js — Navigation, Sidebar, Toast, and Shared UI Helpers
   ============================================================ */

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */

function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ============================================================
   ALERT HELPER (inline in page)
   ============================================================ */

function showAlert(containerId, message, type = 'error') {
  const container = document.getElementById(containerId);
  if (!container) return;
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  container.innerHTML = `
    <div class="alert alert-${type}">
      <span>${icons[type] || ''}</span>
      <span>${message}</span>
    </div>`;
  container.style.display = 'block';
}

function clearAlert(containerId) {
  const container = document.getElementById(containerId);
  if (container) { container.innerHTML = ''; container.style.display = 'none'; }
}

/* ============================================================
   LOADING SPINNER
   ============================================================ */

function showSpinner(containerId) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<div class="spinner-wrapper"><div class="spinner"></div> Loading...</div>`;
}

function showEmptyState(containerId, message = 'No records found.', icon = '📋') {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">${icon}</div>
      <h4>${message}</h4>
      <p>Nothing to display here yet.</p>
    </div>`;
}

/* ============================================================
   SIDEBAR BUILDER
   Build the sidebar navigation based on role.
   ============================================================ */

const NAV_ITEMS = {
  customer: [
    { icon: '🏠', label: 'Dashboard',         href: 'dashboard.html' },
    { icon: '💧', label: 'Book a Tanker',      href: 'booking.html' },
    { icon: '📋', label: 'My Bookings',        href: 'my-bookings.html' },
    { icon: '📍', label: 'Track Delivery',     href: 'tracking.html' },
    { icon: '📄', label: 'Subsidy Application',href: 'subsidy.html' },
    { icon: '🧾', label: 'Bills & Payments',   href: 'bills.html' },
    { icon: '⚠️', label: 'Delivery Disputes',  href: 'disputes.html' },
    { icon: '👤', label: 'My Profile',         href: 'profile.html' },
  ],
  officer: [
    { icon: '🏠', label: 'Dashboard',           href: 'dashboard.html' },
    { icon: '✅', label: 'Booking Approvals',   href: 'approvals.html' },
    { icon: '📄', label: 'Subsidy Applications',href: 'subsidy-review.html' },
    { icon: '⚠️', label: 'Disputes',            href: 'disputes.html' },
    { icon: '📋', label: 'Zone Bookings',       href: 'zone-bookings.html' },
  ],
  operator: [
    { icon: '🏠', label: 'Dashboard',         href: 'dashboard.html' },
    { icon: '📋', label: 'Approved Bookings', href: 'bookings.html' },
    { icon: '🚛', label: 'Tanker Assignment', href: 'assignment.html' },
    { icon: '💧', label: 'Water Filling',     href: 'filling.html' },
    { icon: '🚀', label: 'Dispatch',          href: 'dispatch.html' },
    { icon: '⚙️', label: 'Availability',      href: 'availability.html' },
  ],
  driver: [
    { icon: '🏠', label: 'Dashboard',   href: 'dashboard.html' },
    { icon: '🚛', label: 'My Trips',    href: 'trips.html' },
    { icon: '📜', label: 'Trip History',href: 'history.html' },
  ],
  admin: [
    { icon: '🏠', label: 'Dashboard',      href: 'dashboard.html' },
    { icon: '👥', label: 'User Management',href: 'users.html' },
    { icon: '🗺️', label: 'Zone Management',href: 'zones.html' },
    { icon: '💧', label: 'Hydrant Mgmt',   href: 'hydrants.html' },
    { icon: '🚛', label: 'Tanker Mgmt',    href: 'tankers.html' },
    { icon: '💰', label: 'Rate Management',href: 'rates.html' },
    { icon: '📊', label: 'Quota Management',href: 'quotas.html' },
    { icon: '📈', label: 'Reports',        href: 'reports.html' },
  ],
};

/**
 * Build and inject the sidebar into an element with id="sidebar".
 * Also sets the active link based on the current page filename.
 */
function buildSidebar(user) {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const items = NAV_ITEMS[user.role] || [];
  const currentPage = window.location.pathname.split('/').pop();

  const navLinks = items.map(item => {
    const isActive = currentPage === item.href ? 'active' : '';
    return `
      <a href="${item.href}" class="${isActive}">
        <span class="nav-icon">${item.icon}</span>
        <span>${item.label}</span>
      </a>`;
  }).join('');

  sidebar.innerHTML = `
    <div class="sidebar-brand">
      <span class="brand-icon">💧</span>
      <div>
        <h2>PaaniLink</h2>
        <small>Water Board System</small>
      </div>
    </div>

    <div class="sidebar-user">
      <div class="user-name">👤 ${escapeHtml(user.name)}</div>
      <div class="user-role">${formatRole(user.role)}</div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section-label">Navigation</div>
      ${navLinks}
    </nav>

    <div class="sidebar-footer">
      <button class="btn-logout" onclick="logout()">
        🚪 Logout
      </button>
    </div>
  `;
}

/* ============================================================
   HAMBURGER / MOBILE SIDEBAR TOGGLE
   ============================================================ */

function initHamburger() {
  const btn = document.getElementById('hamburger-btn');
  const sidebar = document.getElementById('sidebar');
  if (!btn || !sidebar) return;

  let backdrop = document.querySelector('.sidebar-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);
  }

  function toggleSidebar(open) {
    if (open === undefined) open = !sidebar.classList.contains('open');
    sidebar.classList.toggle('open', open);
    backdrop.classList.toggle('visible', open);
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSidebar();
  });

  backdrop.addEventListener('click', () => toggleSidebar(false));

  // Close when clicking nav link on mobile
  sidebar.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 860) toggleSidebar(false);
    });
  });
}

/* ============================================================
   PAGE HEADER TITLE
   ============================================================ */
function setPageTitle(title) {
  const el = document.getElementById('page-title');
  if (el) el.textContent = title;
  document.title = `${title} — PaaniLink`;
}

/* ============================================================
   BADGE HELPER
   ============================================================ */
function makeBadge(status) {
  const clean = (status || 'unknown').toString().toLowerCase().replace(/\s+/g, '_');
  const labels = {
    pending:          'Pending',
    pending_approval: 'Awaiting Approval',
    approved:         'Approved',
    rejected:         'Rejected',
    completed:        'Completed',
    dispatched:       'Dispatched',
    assigned:         'Assigned',
    filling:          'Filling',
    delivered:        'Delivered',
    failed:           'Failed',
    active:           'Active',
    inactive:         'Inactive',
    available:        'Available',
    unavailable:      'Unavailable',
    'on-trip':        'On Trip',
    paid:             'Paid',
    unpaid:           'Unpaid',
    resolved:         'Resolved',
    open:             'Open',
    under_review:     'Under Review',
    subsidised:       'Subsidised',
    commercial:       'Commercial',
  };
  const label = labels[clean] || status;
  return `<span class="badge badge-${clean}">${label}</span>`;
}

/* ============================================================
   DATE / TIME FORMATTERS
   ============================================================ */
function formatDate(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleString('en-PK', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatTime(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
}

/* ============================================================
   CURRENCY FORMATTER
   ============================================================ */
function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '—';
  return `Rs. ${Number(amount).toLocaleString('en-PK')}`;
}

/* ============================================================
   SECURITY: Escape HTML to prevent XSS
   ============================================================ */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ============================================================
   CONFIRMATION DIALOG
   ============================================================ */
function confirmAction(message) {
  return window.confirm(message);
}

/* ============================================================
   FIELD ERROR HELPERS (for forms)
   ============================================================ */
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (field) field.classList.add('error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

function clearFieldErrors(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.field-error').forEach(el => {
    el.textContent = '';
    el.classList.remove('visible');
  });
}

/* ============================================================
   POPULATE SELECT FROM ARRAY
   ============================================================ */
function populateSelect(selectId, items, valueKey, labelKey, placeholder = 'Select...') {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = `<option value="">${placeholder}</option>`;
  items.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item[valueKey];
    opt.textContent = item[labelKey];
    select.appendChild(opt);
  });
}

/* ============================================================
   INIT DASHBOARD PAGE
   Call this at the top of every dashboard page.
   It checks auth, builds the sidebar, sets up hamburger menu.
   ============================================================ */
function initDashboardPage(allowedRole, pageTitle) {
  const user = requireAuth(allowedRole);
  if (!user) return null; // redirected

  buildSidebar(user);
  setPageTitle(pageTitle);
  initHamburger();

  // Show logged-in user info in header if element exists
  const headerUser = document.getElementById('header-user');
  if (headerUser) headerUser.textContent = user.name;

  return user;
}

/* ============================================================
   GLOBAL INTERACTIVE WATER RIPPLE & MOUSE SPOTLIGHT
   ============================================================ */
(function initGlobalInteractions() {
  // Dynamic spotlight coordinates
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', `${x.toFixed(1)}%`);
    document.documentElement.style.setProperty('--mouse-y', `${y.toFixed(1)}%`);
  });

  // Global tactile water ripple on click
  window.addEventListener('click', (e) => {
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
    const ripple = document.createElement('div');
    ripple.className = 'water-ripple';
    const size = Math.max(120, Math.min(220, window.innerWidth * 0.15));
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 750);
  });
})();
