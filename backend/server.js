import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { connectDB } from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import { protect } from './middleware/auth.js';
import { adminOnly } from './middleware/admin.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

// Allow both user (3000) and admin (3001) frontends
app.use(cors({ 
  origin: [clientUrl, 'http://localhost:3000', 'http://localhost:3001'], 
  credentials: true 
}));
app.use(express.json());

const fallbackProducts = [
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

const fallbackUsers = [
  {
    _id: 'user-1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
  },
  {
    _id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
  },
];

function createToken(user) {
  return jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '7d',
  });
}

function toPublicUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}

async function seedDefaultUsers() {
  if (!isDatabaseReady()) {
    return;
  }

  const defaults = [
    {
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123',
      role: 'user',
    },
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    },
  ];

  for (const defaultUser of defaults) {
    const existing = await User.findOne({ email: defaultUser.email });

    if (!existing) {
      const hashedPassword = await bcrypt.hash(defaultUser.password, 10);
      await User.create({
        name: defaultUser.name,
        email: defaultUser.email,
        password: hashedPassword,
        role: defaultUser.role,
      });
    }
  }

  console.log('Default login accounts are ready');
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  if (!isDatabaseReady()) {
    const existing = fallbackUsers.find((item) => item.email === email);

    if (existing) {
      if (role === 'admin') {
        existing.name = name;
        existing.password = bcrypt.hashSync(password, 10);
        existing.role = 'admin';

        return res.status(200).json({
          user: toPublicUser(existing),
          token: createToken(existing),
        });
      }

      return res.status(400).json({ message: 'User already exists' });
    }

    const userRole = role === 'admin' ? 'admin' : 'user';
    const user = {
      _id: `offline-${Date.now()}`,
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      role: userRole,
    };

    fallbackUsers.push(user);

    return res.status(201).json({
      user: toPublicUser(user),
      token: createToken(user),
    });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    if (role === 'admin') {
      existing.name = name;
      existing.password = await bcrypt.hash(password, 10);
      existing.role = 'admin';
      await existing.save();

      return res.status(200).json({
        user: toPublicUser(existing),
        token: createToken(existing),
      });
    }

    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userRole = role === 'admin' ? 'admin' : 'user';
  const user = await User.create({ name, email, password: hashedPassword, role: userRole });

  return res.status(201).json({
    user: toPublicUser(user),
    token: createToken(user),
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!isDatabaseReady()) {
    const user = fallbackUsers.find((item) => item.email === email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      user: toPublicUser(user),
      token: createToken(user),
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  return res.json({
    user: toPublicUser(user),
    token: createToken(user),
  });
});

app.get('/api/products', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products.length ? products : fallbackProducts);
});

app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    return res.json(product);
  }

  const fallbackProduct = fallbackProducts.find((item) => item._id === req.params.id || item.slug === req.params.id);
  if (!fallbackProduct) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(fallbackProduct);
});

app.post('/api/products', protect, adminOnly, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

app.delete('/api/products/:id', protect, adminOnly, async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

  if (deletedProduct) {
    return res.json({ message: 'Product deleted successfully' });
  }

  const fallbackIndex = fallbackProducts.findIndex((item) => item._id === req.params.id || item.slug === req.params.id);
  if (fallbackIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  fallbackProducts.splice(fallbackIndex, 1);
  return res.json({ message: 'Product deleted successfully' });
});

app.get('/api/orders/my', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

app.post('/api/orders', protect, async (req, res) => {
  const { items, shippingAddress, totalPrice } = req.body;

  if (!items?.length || !shippingAddress || !totalPrice) {
    return res.status(400).json({ message: 'Order items, shipping address, and total price are required' });
  }

  const orderNumber = `ORD-${Date.now()}`;
  const order = await Order.create({
    orderNumber,
    user: req.user.id,
    items,
    shippingAddress,
    totalPrice,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    orderStatus: 'Placed',
  });

  res.status(201).json(order);
});

app.get('/api/admin/stats', protect, adminOnly, async (req, res) => {
  const [users, products, orders] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
  ]);

  res.json({ users, products, orders });
});

app.get('/api/admin/orders', protect, adminOnly, async (req, res) => {
  const orders = await Order.find().populate('user', 'name email role').sort({ createdAt: -1 });
  res.json(orders);
});

app.get('/api/admin/customers', protect, adminOnly, async (req, res) => {
  const customers = await User.find({ role: 'user' }).select('name email role createdAt').sort({ createdAt: -1 });
  res.json(customers);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Server error' });
});

async function start() {
  try {
    await connectDB();
  } catch (error) {
    console.warn('Database connection failed. Starting in API-only demo mode.');
  }

  // Seed users - but don't let it crash the server if it times out
  try {
    await seedDefaultUsers();
  } catch (error) {
    console.warn('Failed to seed default users:', error.message);
  }

  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
}

start();
