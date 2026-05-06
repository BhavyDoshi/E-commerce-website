"use client";

import { AuthProvider } from '@/context/auth-context';
import { CartProvider } from '@/context/cart-context';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
