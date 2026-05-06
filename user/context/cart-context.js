"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'ecommerce-cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setItems(JSON.parse(stored));
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, ready]);

  function addItem(product, quantity = 1) {
    setItems((currentItems) => {
      const existing = currentItems.find((item) => item._id === product._id);
      if (existing) {
        return currentItems.map((item) => item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item);
      }

      return [...currentItems, { ...product, quantity }];
    });
  }

  function removeItem(productId) {
    setItems((currentItems) => currentItems.filter((item) => item._id !== productId));
  }

  function updateQuantity(productId, quantity) {
    setItems((currentItems) => currentItems.map((item) => item._id === productId ? { ...item, quantity: Math.max(1, quantity) } : item));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(() => ({
    items,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  }), [items, subtotal]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
