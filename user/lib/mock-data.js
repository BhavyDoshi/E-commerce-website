export const mockProducts = [
  {
    _id: 'demo-1',
    name: 'Aero Knit Jacket',
    slug: 'aero-knit-jacket',
    description: 'Lightweight premium jacket for everyday wear.',
    price: 79,
    category: 'Outerwear',
    stock: 18,
    images: ['https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Olive'],
    featured: true,
    rating: 4.8,
  },
  {
    _id: 'demo-2',
    name: 'Metro Runner Sneakers',
    slug: 'metro-runner-sneakers',
    description: 'Minimal sneakers built for comfort and style.',
    price: 99,
    category: 'Footwear',
    stock: 24,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80'],
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['White', 'Gray'],
    featured: true,
    rating: 4.7,
  },
  {
    _id: 'demo-3',
    name: 'Studio Cotton Tee',
    slug: 'studio-cotton-tee',
    description: 'Soft cotton tee designed for daily essentials.',
    price: 29,
    category: 'Tops',
    stock: 40,
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Navy', 'Sand'],
    featured: false,
    rating: 4.6,
  },
];

export const mockOrders = [
  {
    _id: 'order-1',
    orderNumber: 'ORD-10001',
    orderStatus: 'Placed',
    paymentStatus: 'Pending',
    totalPrice: 128,
    createdAt: '2026-05-01T10:00:00.000Z',
    items: [
      { name: 'Aero Knit Jacket', quantity: 1, price: 79 },
      { name: 'Studio Cotton Tee', quantity: 1, price: 29 },
    ],
    shippingAddress: {
      fullName: 'Demo User',
      street: '12 Market Street',
      city: 'Lahore',
      state: 'Punjab',
      postalCode: '54000',
    },
  },
  {
    _id: 'order-2',
    orderNumber: 'ORD-10002',
    orderStatus: 'Placed',
    paymentStatus: 'Pending',
    totalPrice: 99,
    createdAt: '2026-05-03T15:20:00.000Z',
    items: [
      { name: 'Metro Runner Sneakers', quantity: 1, price: 99 },
    ],
    shippingAddress: {
      fullName: 'Demo User',
      street: '12 Market Street',
      city: 'Lahore',
      state: 'Punjab',
      postalCode: '54000',
    },
  },
];

export const demoUser = {
  _id: 'user-1',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'user',
};

export const demoAdmin = {
  _id: 'admin-1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
};
