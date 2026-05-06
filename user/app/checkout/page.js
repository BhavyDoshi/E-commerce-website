"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createOrder } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';

const initialShipping = {
  fullName: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  phone: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const [shipping, setShipping] = useState(initialShipping);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const order = await createOrder(token, {
        items,
        shippingAddress: shipping,
        totalPrice: subtotal,
      });

      window.localStorage.setItem('ecommerce-last-order', JSON.stringify(order));
      clearCart();
      setMessage(`Order ${order.orderNumber} has been placed.`);
      router.push('/orders');
    } catch (error) {
      setMessage('Unable to place the order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-ink">Sign in to checkout</h1>
        <p className="mt-4 text-ink/70">You need an account before placing a cash-on-delivery order.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="space-y-5 rounded-[32px] bg-white p-8 shadow-[0_20px_60px_rgba(17,24,39,0.08)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Checkout</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">Cash on delivery</h1>
          </div>
          {Object.entries(shipping).map(([key, value]) => (
            <div key={key}>
              <label className="text-sm font-medium text-ink">{key.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="text"
                value={value}
                onChange={(event) => setShipping({ ...shipping, [key]: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-accent"
                required
              />
            </div>
          ))}
          {message ? <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p> : null}
          <button
            type="submit"
            disabled={loading || !items.length}
            className="w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Placing order...' : 'Place order'}
          </button>
        </form>

        <aside className="rounded-[32px] bg-sand p-8 shadow-[0_20px_60px_rgba(17,24,39,0.08)]">
          <h2 className="text-2xl font-semibold text-ink">Order summary</h2>
          <div className="mt-6 space-y-3">
            {items.map((item) => (
              <div key={item._id} className="flex items-center justify-between text-sm text-ink/70">
                <span>{item.name} x {item.quantity}</span>
                <span>${item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-black/10 pt-4">
            <div className="flex items-center justify-between text-base font-semibold text-ink">
              <span>Total</span>
              <span>${subtotal}</span>
            </div>
            <p className="mt-2 text-sm text-ink/65">Payment status stays pending until the order is delivered.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
