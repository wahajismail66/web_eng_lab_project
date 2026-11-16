/* ============================================================
   api.js — Centralized API Helper
   All Fetch requests go through these functions.
   To switch from JSON Server to a real backend later,
   change API_BASE_URL and update the functions below.
   ============================================================ */

const API_BASE_URL = 'http://127.0.0.1:3000';

/* ---- Generic Fetch Wrapper ---- */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: { 'Content-Type': 'application/json' },
  };
  const mergedOptions = { ...defaultOptions, ...options };

  const response = await fetch(url, mergedOptions);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  // 204 No Content (DELETE responses) return null
  if (response.status === 204) return null;

  return response.json();
}

/* ============================================================
   USERS
   ============================================================ */
const UsersAPI = {
  getAll: () => apiFetch('/users'),

  getById: (id) => apiFetch(`/users/${id}`),

  getByEmail: (email) => apiFetch(`/users?email=${encodeURIComponent(email)}`),

  getByRole: (role) => apiFetch(`/users?role=${role}`),

  getByZone: (zoneId) => apiFetch(`/users?zoneId=${zoneId}`),

  create: (userData) => apiFetch('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  update: (id, updatedData) => apiFetch(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updatedData),
  }),

  delete: (id) => apiFetch(`/users/${id}`, { method: 'DELETE' }),
};

/* ============================================================
   ZONES
   ============================================================ */
const ZonesAPI = {
  getAll: () => apiFetch('/zones'),

  getById: (id) => apiFetch(`/zones/${id}`),

  create: (data) => apiFetch('/zones', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) => apiFetch(`/zones/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

/* ============================================================
   HYDRANTS
   ============================================================ */
const HydrantsAPI = {
  getAll: () => apiFetch('/hydrants'),

  getById: (id) => apiFetch(`/hydrants/${id}`),

  getByZone: (zoneId) => apiFetch(`/hydrants?zoneId=${zoneId}`),

  create: (data) => apiFetch('/hydrants', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) => apiFetch(`/hydrants/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

/* ============================================================
   TANKERS
   ============================================================ */
const TankersAPI = {
  getAll: () => apiFetch('/tankers'),

  getById: (id) => apiFetch(`/tankers/${id}`),

  getByHydrant: (hydrantId) => apiFetch(`/tankers?hydrantId=${hydrantId}`),

  getAvailable: () => apiFetch('/tankers?availabilityStatus=available'),

  create: (data) => apiFetch('/tankers', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) => apiFetch(`/tankers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

/* ============================================================
   BOOKINGS
   ============================================================ */
const BookingsAPI = {
  getAll: () => apiFetch('/bookings'),

  getById: (id) => apiFetch(`/bookings/${id}`),

  getByCustomer: (customerId) => apiFetch(`/bookings?customerId=${customerId}`),

  getByZone: (zoneId) => apiFetch(`/bookings?zoneId=${zoneId}`),

  getByHydrant: (hydrantId) => apiFetch(`/bookings?hydrantId=${hydrantId}`),

  getByStatus: (status) => apiFetch(`/bookings?status=${status}`),

  getPendingApproval: () => apiFetch('/bookings?status=pending_approval'),

  create: (data) => apiFetch('/bookings', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) => apiFetch(`/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

/* ============================================================
   SUBSIDY APPLICATIONS
   ============================================================ */
const SubsidyAPI = {
  getAll: () => apiFetch('/subsidyApplications'),

  getById: (id) => apiFetch(`/subsidyApplications/${id}`),

  getByCustomer: (customerId) => apiFetch(`/subsidyApplications?customerId=${customerId}`),

  getByZone: (zoneId) => apiFetch(`/subsidyApplications?zoneId=${zoneId}`),

  getPending: () => apiFetch('/subsidyApplications?status=pending'),

  create: (data) => apiFetch('/subsidyApplications', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) => apiFetch(`/subsidyApplications/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

/* ============================================================
   TRIPS
   ============================================================ */
const TripsAPI = {
  getAll: () => apiFetch('/trips'),

  getById: (id) => apiFetch(`/trips/${id}`),

  getByDriver: (driverId) => apiFetch(`/trips?driverId=${driverId}`),

  getByBooking: (bookingId) => apiFetch(`/trips?bookingId=${bookingId}`),

  getByHydrant: (hydrantId) => apiFetch(`/trips?hydrantId=${hydrantId}`),

  create: (data) => apiFetch('/trips', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) => apiFetch(`/trips/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

/* ============================================================
   BILLS
   ============================================================ */
const BillsAPI = {
  getAll: () => apiFetch('/bills'),

  getById: (id) => apiFetch(`/bills/${id}`),

  getByCustomer: (customerId) => apiFetch(`/bills?customerId=${customerId}`),

  getByBooking: (bookingId) => apiFetch(`/bills?bookingId=${bookingId}`),

  create: (data) => apiFetch('/bills', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) => apiFetch(`/bills/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

/* ============================================================
   DISPUTES
   ============================================================ */
const DisputesAPI = {
  getAll: () => apiFetch('/disputes'),

  getById: (id) => apiFetch(`/disputes/${id}`),

  getByCustomer: (customerId) => apiFetch(`/disputes?customerId=${customerId}`),

  getByBooking: (bookingId) => apiFetch(`/disputes?bookingId=${bookingId}`),

  create: (data) => apiFetch('/disputes', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) => apiFetch(`/disputes/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

/* ============================================================
   RATES
   ============================================================ */
const RatesAPI = {
  getAll: () => apiFetch('/rates'),

  getByCapacity: (capacity) => apiFetch(`/rates?capacity=${capacity}`),

  update: (id, data) => apiFetch(`/rates/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

/* ============================================================
   QUOTAS
   ============================================================ */
const QuotasAPI = {
  getAll: () => apiFetch('/quotas'),

  getByHydrant: (hydrantId) => apiFetch(`/quotas?hydrantId=${hydrantId}`),

  getByDate: (date) => apiFetch(`/quotas?date=${date}`),

  create: (data) => apiFetch('/quotas', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) => apiFetch(`/quotas/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

/* ============================================================
   UTILITY: Generate Booking ID
   ============================================================ */
function generateBookingId() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 90000) + 10000;
  return `BK-${year}-${random}`;
}

/* ============================================================
   UTILITY: Generate Generic ID
   ============================================================ */
function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
}
