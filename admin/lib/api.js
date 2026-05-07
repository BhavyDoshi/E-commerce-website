import { demoAdmin, demoUser, mockCustomers, mockOrders, mockProducts } from './mock-data.js';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const OFFLINE_ADMINS_KEY = 'ecommerce-offline-admins';

function readOfflineAdmins() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(OFFLINE_ADMINS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function writeOfflineAdmins(admins) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(OFFLINE_ADMINS_KEY, JSON.stringify(admins));
}

function getOfflineAdmin(email) {
  return readOfflineAdmins().find((admin) => admin.email.toLowerCase() === email.toLowerCase()) || null;
}

function normalizeAdmin(admin) {
  return {
    _id: admin._id || `admin-${Date.now()}`,
    name: admin.name,
    email: admin.email,
    role: 'admin',
  };
}

async function safeFetch(path, options = {}, fallbackValue) {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return typeof fallbackValue === 'function' ? fallbackValue() : fallbackValue;
  }
}

export function registerUser(payload) {
  return safeFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, {
    user: normalizeAdmin(payload),
    token: `offline-token-${Date.now()}`,
  }).then((result) => {
    if (typeof window !== 'undefined' && result?.user?.email) {
      const admins = readOfflineAdmins();
      const nextAdmins = admins.filter((admin) => admin.email.toLowerCase() !== result.user.email.toLowerCase());
      nextAdmins.push({
        _id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        password: payload.password,
        role: 'admin',
      });
      writeOfflineAdmins(nextAdmins);
    }

    return result;
  });
}

export function loginUser(payload) {
  return safeFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, () => {
    const offlineAdmin = getOfflineAdmin(payload.email);

    if (offlineAdmin && offlineAdmin.password === payload.password) {
      return {
        user: normalizeAdmin(offlineAdmin),
        token: `offline-token-${offlineAdmin._id}`,
      };
    }

    if (payload.email === 'admin@example.com' && payload.password === 'password123') {
      return {
        user: demoAdmin,
        token: 'demo-token-admin',
      };
    }

    throw new Error('Invalid email or password');
  });
}

export function getProducts() {
  return safeFetch('/products', {}, mockProducts);
}

export function createProduct(token, payload) {
  return safeFetch('/products', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  }, {
    _id: `product-${Date.now()}`,
    ...payload,
  });
}

export function deleteProduct(token, id) {
  return safeFetch(`/products/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }, {
    message: 'Product deleted successfully',
  });
}

export function getAdminStats(token) {
  return safeFetch('/admin/stats', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }, {
    users: mockCustomers.length,
    products: mockProducts.length,
    orders: mockOrders.length,
  });
}

export function getAdminOrders(token) {
  return safeFetch('/admin/orders', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }, mockOrders);
}

export function getAdminCustomers(token) {
  return safeFetch('/admin/customers', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }, mockCustomers);
}
