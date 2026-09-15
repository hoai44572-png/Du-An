/**
 * API Service layer cho Frontend - giao tiep voi Backend Express
 * Su dung JWT token tu authStorage de xac thuc cac request
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper: Lay JWT token tu storage
const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('swift_coffee_auth_token') || sessionStorage.getItem('swift_coffee_auth_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// Helper: fetch wrapper voi error handling
const apiFetch = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: { ...getAuthHeaders(), ...(options.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP error ${res.status}`);
  return data;
};

// ===== AUTH API =====
export const authApi = {
  register: (body: { name: string; email: string; password: string; phone?: string }) =>
    apiFetch(`${API_BASE}/auth/register`, { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    apiFetch(`${API_BASE}/auth/login`, { method: 'POST', body: JSON.stringify(body) }),

  forgotPassword: (email: string) =>
    apiFetch(`${API_BASE}/auth/forgot-password`, { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (body: { email: string; otpCode: string; newPassword: string }) =>
    apiFetch(`${API_BASE}/auth/reset-password`, { method: 'POST', body: JSON.stringify(body) }),

  getProfile: () =>
    apiFetch(`${API_BASE}/auth/profile`),

  updateProfile: (body: { name?: string; phone?: string; avatar?: string }) =>
    apiFetch(`${API_BASE}/auth/profile`, { method: 'PUT', body: JSON.stringify(body) }),

  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    apiFetch(`${API_BASE}/auth/change-password`, { method: 'PUT', body: JSON.stringify(body) }),

  getAddresses: () =>
    apiFetch(`${API_BASE}/auth/addresses`),

  addAddress: (body: object) =>
    apiFetch(`${API_BASE}/auth/addresses`, { method: 'POST', body: JSON.stringify(body) }),

  updateAddress: (id: number, body: object) =>
    apiFetch(`${API_BASE}/auth/addresses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  deleteAddress: (id: number) =>
    apiFetch(`${API_BASE}/auth/addresses/${id}`, { method: 'DELETE' }),

  setDefaultAddress: (id: number) =>
    apiFetch(`${API_BASE}/auth/addresses/${id}/default`, { method: 'PUT' }),
};

// ===== ORDERS API =====
export const ordersApi = {
  getMyOrders: () =>
    apiFetch(`${API_BASE}/orders/my-orders`),

  getOrderDetail: (orderCode: string) =>
    apiFetch(`${API_BASE}/orders/${orderCode}`),

  cancelOrder: (orderCode: string) =>
    apiFetch(`${API_BASE}/orders/cancel/${orderCode}`, { method: 'PUT' }),

  markReceived: (orderCode: string) =>
    apiFetch(`${API_BASE}/orders/received/${orderCode}`, { method: 'PUT' }),

  reorder: (orderCode: string) =>
    apiFetch(`${API_BASE}/orders/reorder/${orderCode}`, { method: 'POST' }),
};

// ===== REVIEWS API =====
export const reviewsApi = {
  getProductReviews: (productId: string) =>
    apiFetch(`${API_BASE}/reviews/product/${productId}`),

  addReview: (body: { productId: string; rating: number; comment: string; images?: string[]; orderId?: string }) =>
    apiFetch(`${API_BASE}/reviews`, { method: 'POST', body: JSON.stringify(body) }),

  updateReview: (id: number, body: { rating?: number; comment?: string; images?: string[] }) =>
    apiFetch(`${API_BASE}/reviews/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  deleteReview: (id: number) =>
    apiFetch(`${API_BASE}/reviews/${id}`, { method: 'DELETE' }),

  adminGetAll: () =>
    apiFetch(`${API_BASE}/reviews/admin/all`),

  adminReply: (id: number, body: { adminReply?: string; status?: string }) =>
    apiFetch(`${API_BASE}/reviews/admin/reply/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
};

// ===== WISHLIST API =====
export const wishlistApi = {
  getWishlist: () =>
    apiFetch(`${API_BASE}/wishlist`),

  addToWishlist: (productId: string) =>
    apiFetch(`${API_BASE}/wishlist`, { method: 'POST', body: JSON.stringify({ productId }) }),

  removeFromWishlist: (productId: string) =>
    apiFetch(`${API_BASE}/wishlist/${productId}`, { method: 'DELETE' }),

  clearWishlist: () =>
    apiFetch(`${API_BASE}/wishlist`, { method: 'DELETE' }),
};

// ===== COUPONS API =====
export const couponsApi = {
  validate: (code: string, orderSubtotal: number) =>
    apiFetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      body: JSON.stringify({ code, orderSubtotal }),
    }),
};

// ===== PRODUCTS API =====
export const productsApi = {
  getProducts: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(`${API_BASE}/products${query}`);
  },
  getProductById: (id: number | string) =>
    apiFetch(`${API_BASE}/products/${id}`),
};

// ===== CATEGORIES API =====
export const categoriesApi = {
  getCategories: () =>
    apiFetch(`${API_BASE}/categories`),
};

// ===== ADMIN API =====
const ADMIN_TOKEN_KEY = 'swift_admin_token';

const getAdminAuthHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const adminFetch = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: { ...getAdminAuthHeaders(), ...(options.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP error ${res.status}`);
  return data;
};

export const adminApi = {
  // ---- Auth ----
  register: (body: { fullName: string; email: string; password: string; phone?: string; role?: string }) =>
    apiFetch(`${API_BASE}/admin/register`, { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    apiFetch(`${API_BASE}/admin/login`, { method: 'POST', body: JSON.stringify(body) }),

  logout: () => adminFetch(`${API_BASE}/admin/logout`, { method: 'POST' }),

  getMe: () => adminFetch(`${API_BASE}/admin/me`),

  getList: () => adminFetch(`${API_BASE}/admin/list`),

  updateProfile: (body: { fullName?: string; phone?: string; avatar?: string }) =>
    adminFetch(`${API_BASE}/admin/profile`, { method: 'PUT', body: JSON.stringify(body) }),

  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    adminFetch(`${API_BASE}/admin/change-password`, { method: 'PUT', body: JSON.stringify(body) }),

  updateStatus: (id: number, status: string) =>
    adminFetch(`${API_BASE}/admin/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // ---- Products ----
  getProducts: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return adminFetch(`${API_BASE}/admin/products${query}`);
  },

  getPublicProducts: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(`${API_BASE}/admin/products/public${query}`);
  },

  getProductById: (id: number | string) => adminFetch(`${API_BASE}/admin/products/${id}`),

  createProduct: (body: object) =>
    adminFetch(`${API_BASE}/admin/products`, { method: 'POST', body: JSON.stringify(body) }),

  updateProduct: (id: number | string, body: object) =>
    adminFetch(`${API_BASE}/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  deleteProduct: (id: number | string) =>
    adminFetch(`${API_BASE}/admin/products/${id}`, { method: 'DELETE' }),

  // ---- Categories ----
  getCategories: () => apiFetch(`${API_BASE}/admin/categories`),

  createCategory: (body: object) =>
    adminFetch(`${API_BASE}/admin/categories`, { method: 'POST', body: JSON.stringify(body) }),

  updateCategory: (id: number | string, body: object) =>
    adminFetch(`${API_BASE}/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  deleteCategory: (id: number | string) =>
    adminFetch(`${API_BASE}/admin/categories/${id}`, { method: 'DELETE' }),

  // ---- Dashboard ----
  getDashboard: () => adminFetch(`${API_BASE}/admin/dashboard`),
  getRevenueData: (days?: number) =>
    adminFetch(`${API_BASE}/admin/dashboard/revenue${days ? `?days=${days}` : ''}`),
  getOrdersData: () => adminFetch(`${API_BASE}/admin/dashboard/orders`),
  getTopProducts: () => adminFetch(`${API_BASE}/admin/dashboard/top-products`),
  getRecentOrders: () => adminFetch(`${API_BASE}/admin/dashboard/recent-orders`),
  getTopCustomers: () => adminFetch(`${API_BASE}/admin/dashboard/top-customers`),

  // ---- Orders ----
  getOrders: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return adminFetch(`${API_BASE}/admin/orders${query}`);
  },

  getOrderDetail: (id: number | string) => adminFetch(`${API_BASE}/admin/orders/${id}`),

  updateOrderStatus: (id: number | string, body: { status?: string; paymentStatus?: string }) =>
    adminFetch(`${API_BASE}/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(body) }),

  // ---- Customers ----
  getCustomers: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return adminFetch(`${API_BASE}/admin/customers${query}`);
  },

  getCustomerDetail: (id: number | string) => adminFetch(`${API_BASE}/admin/customers/${id}`),

  updateCustomerStatus: (id: number | string, status: string) =>
    adminFetch(`${API_BASE}/admin/customers/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // ---- Logs ----
  getLogs: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return adminFetch(`${API_BASE}/admin/logs${query}`);
  },
};

// Helper lưu/lấy Admin token
export const adminTokenStorage = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') localStorage.setItem(ADMIN_TOKEN_KEY, token);
  },
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem('swift_admin_user');
    }
  },
  setUser: (user: object) => {
    if (typeof window !== 'undefined') localStorage.setItem('swift_admin_user', JSON.stringify(user));
  },
  getUser: () => {
    if (typeof window === 'undefined') return null;
    const s = localStorage.getItem('swift_admin_user');
    try { return s ? JSON.parse(s) : null; } catch { return null; }
  },
};

