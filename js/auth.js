/* ============================================================
   auth.js — Authentication & Session Management
   Handles login, registration, logout, and session checks.
   ============================================================ */

const SESSION_KEY = 'paanilink_user';

/* ============================================================
   SESSION HELPERS
   ============================================================ */

/** Save logged-in user to localStorage */
function saveSession(user) {
  // Never store password in session
  const sessionUser = { ...user };
  delete sessionUser.password;
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
}

/** Get current logged-in user from localStorage */
function getSession() {
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/** Remove session (logout) */
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/** Check if a user is logged in */
function isLoggedIn() {
  return getSession() !== null;
}

/** Get current user's role */
function getCurrentRole() {
  const user = getSession();
  return user ? user.role : null;
}

/* ============================================================
   ROUTE GUARD
   Call this at the top of every protected page.
   Pass the required role(s) as an array or a single string.
   ============================================================ */
function requireAuth(allowedRoles) {
  const user = getSession();

  if (!user) {
    // Not logged in — redirect to login
    redirectToLogin();
    return null;
  }

  if (allowedRoles) {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(user.role)) {
      // Wrong role — redirect to their own dashboard
      redirectToDashboard(user.role);
      return null;
    }
  }

  return user;
}

/* ============================================================
   REDIRECTS
   ============================================================ */

/** Redirect to login page */
function redirectToLogin() {
  const depth = getPathDepth();
  const prefix = '../'.repeat(depth);
  window.location.href = `${prefix}index.html`;
}

/** Redirect to the correct dashboard based on role */
function redirectToDashboard(role) {
  const depth = getPathDepth();
  const prefix = '../'.repeat(depth);

  const roleRoutes = {
    customer: `${prefix}pages/customer/dashboard.html`,
    officer:  `${prefix}pages/officer/dashboard.html`,
    operator: `${prefix}pages/operator/dashboard.html`,
    driver:   `${prefix}pages/driver/dashboard.html`,
    admin:    `${prefix}pages/admin/dashboard.html`,
  };

  const route = roleRoutes[role];
  if (route) {
    window.location.href = route;
  } else {
    redirectToLogin();
  }
}

/** Figure out how many directories deep the current page is */
function getPathDepth() {
  const path = window.location.pathname;
  // Count how many 'pages/' segments are in the path
  const parts = path.split('/').filter(Boolean);
  // pages/ and role/ subdirectory = depth 2 from root
  if (parts.includes('pages')) {
    return parts.indexOf('pages') >= 0 ? 2 : 0;
  }
  return 0;
}

/* ============================================================
   LOGIN
   ============================================================ */
async function loginUser(email, password) {
  if (!email || !password) {
    throw new Error('Please enter your email and password.');
  }

  let users;
  try {
    users = await UsersAPI.getByEmail(email.trim().toLowerCase());
  } catch (err) {
    throw new Error('Cannot connect to the server. Make sure JSON Server is running (npm start).');
  }

  if (!users || users.length === 0) {
    throw new Error('No account found with this email address.');
  }

  const user = users[0];

  if (user.password !== password) {
    throw new Error('Incorrect password. Please try again.');
  }

  if (user.accountStatus !== 'active') {
    throw new Error('Your account is inactive. Please contact the administrator.');
  }

  saveSession(user);
  return user;
}

/* ============================================================
   REGISTRATION
   ============================================================ */
async function registerCustomer(formData) {
  const { name, cnic, phone, email, password, confirmPassword, address, zoneId } = formData;

  // Validation
  const errors = {};

  if (!name || name.trim().length < 3) errors.name = 'Full name must be at least 3 characters.';

  if (!cnic || !/^\d{5}-\d{7}-\d$/.test(cnic.trim())) errors.cnic = 'CNIC format: 35202-1234567-1';

  if (!phone || !/^03\d{9}$/.test(phone.trim())) errors.phone = 'Phone must start with 03 and be 11 digits.';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Please enter a valid email address.';

  if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters.';

  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';

  if (!address || address.trim().length < 10) errors.address = 'Please enter your complete address.';

  if (!zoneId) errors.zoneId = 'Please select your zone.';

  if (Object.keys(errors).length > 0) {
    const error = new Error('Validation failed');
    error.fieldErrors = errors;
    throw error;
  }

  // Check if email already exists
  let existing;
  try {
    existing = await UsersAPI.getByEmail(email.trim().toLowerCase());
  } catch (err) {
    throw new Error('Cannot connect to the server. Make sure JSON Server is running (npm start).');
  }

  if (existing && existing.length > 0) {
    throw new Error('An account with this email already exists.');
  }

  // Create new customer record
  const newUser = {
    id: generateId('u'),
    name: name.trim(),
    cnic: cnic.trim(),
    phone: phone.trim(),
    email: email.trim().toLowerCase(),
    password: password,
    role: 'customer',
    zoneId: zoneId,
    hydrantId: null,
    address: address.trim(),
    accountStatus: 'active',
    subsidyEligible: false,
    subsidyCategory: null,
    monthlyBookingLimit: null,
    createdAt: new Date().toISOString(),
  };

  const created = await UsersAPI.create(newUser);
  return created;
}

/* ============================================================
   LOGOUT
   ============================================================ */
function logout() {
  clearSession();
  window.location.href = getPathPrefix() + 'index.html';
}

function getPathPrefix() {
  const depth = getPathDepth();
  return '../'.repeat(depth);
}

/* ============================================================
   DISPLAY HELPERS
   ============================================================ */

/** Format a role string to a readable label */
function formatRole(role) {
  const labels = {
    customer: 'Customer',
    officer:  'Zone Officer',
    operator: 'Hydrant Operator',
    driver:   'Driver',
    admin:    'Administrator',
  };
  return labels[role] || role;
}
