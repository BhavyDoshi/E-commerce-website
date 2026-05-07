import { demoAdmin, demoUser, mockOrders, mockProducts } from './mock-data.js';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const OFFLINE_USERS_KEY = 'ecommerce-offline-users';

function readOfflineUsers() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(OFFLINE_USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function writeOfflineUsers(users) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(OFFLINE_USERS_KEY, JSON.stringify(users));
}

function getOfflineUser(email) {
  return readOfflineUsers().find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}

function normalizeUser(user) {
  return {
    _id: user._id || `user-${Date.now()}`,
    name: user.name,
    email: user.email,
    role: user.role || 'user',
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

export function getProducts() {
  return safeFetch('/products', {}, mockProducts);
}

export function getProductById(id) {
  return safeFetch(`/products/${id}`, {}, () => mockProducts.find((product) => product._id === id || product.slug === id) || null);
}

export function registerUser(payload) {
  return safeFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, {
    user: normalizeUser({ ...payload, role: payload.role || 'user' }),
    token: `offline-token-${Date.now()}`,
  }).then((result) => {
    if (typeof window !== 'undefined' && result?.token?.startsWith('offline-token-')) {
      const users = readOfflineUsers();
      const nextUsers = users.filter((user) => user.email.toLowerCase() !== payload.email.toLowerCase());
      nextUsers.push({
        _id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        password: payload.password,
        role: result.user.role,
      });
      writeOfflineUsers(nextUsers);
    }

    return result;
  });
}

export function loginUser(payload) {
  return safeFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, () => {
    const offlineUser = getOfflineUser(payload.email);

    if (offlineUser && offlineUser.password === payload.password) {
      return {
        user: normalizeUser(offlineUser),
        token: `offline-token-${offlineUser._id}`,
      };
    }

    if (payload.email === demoUser.email && payload.password === 'password123') {
      return {
        user: demoUser,
        token: 'demo-token-user',
      };
    }

    if (payload.email === demoAdmin.email && payload.password === 'password123') {
      return {
        user: demoAdmin,
        token: 'demo-token-admin',
      };
    }

    throw new Error('Invalid email or password');
  });
}

export function getMyOrders(token) {
  return safeFetch('/orders/my', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }, mockOrders);
}

export function createOrder(token, payload) {
  return safeFetch('/orders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  }, {
    _id: `order-${Date.now()}`,
    orderNumber: `ORD-${Date.now()}`,
    orderStatus: 'Placed',
    paymentStatus: 'Pending',
    totalPrice: payload.totalPrice,
  });
}

export function getAdminStats(token) {
  return safeFetch('/admin/stats', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }, {
    users: 12,
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
  }, [demoUser, demoAdmin]);
}
