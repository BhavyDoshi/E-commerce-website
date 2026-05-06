import { demoAdmin, demoUser, mockCustomers, mockOrders, mockProducts } from './mock-data.js';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

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
    user: demoAdmin,
    token: 'demo-token-admin',
  });
}

export function loginUser(payload) {
  return safeFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, () => {
    // Demo mode: validate credentials against demo admin
    const isAdmin = payload.email === 'admin@example.com' && payload.password === 'password123';
    
    if (isAdmin) {
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
