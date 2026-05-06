import { demoAdmin, demoUser, mockOrders, mockProducts } from './mock-data.js';

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
    user: demoUser,
    token: 'demo-token-user',
  });
}

export function loginUser(payload) {
  return safeFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, () => {
    // Demo mode: validate credentials against demo users
    const isDemo = payload.email === 'demo@example.com' && payload.password === 'password123';
    const isAdmin = payload.email === 'admin@example.com' && payload.password === 'password123';
    
    if (isAdmin) {
      return {
        user: demoAdmin,
        token: 'demo-token-admin',
      };
    }
    
    if (isDemo) {
      return {
        user: demoUser,
        token: 'demo-token-user',
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
