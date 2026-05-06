"use client";

import Link from 'next/link';
import { useCart } from '@/context/cart-context';

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Cart</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">Your selected items</h1>
        </div>
        <Link href="/checkout" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent">
          Checkout
        </Link>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-4">
          {items.length ? items.map((item) => (
            <div key={item._id} className="flex flex-col gap-4 rounded-[28px] bg-white p-5 shadow-[0_20px_60px_rgba(17,24,39,0.08)] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">{item.name}</h2>
                <p className="mt-1 text-sm text-ink/65">${item.price} each</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(event) => updateQuantity(item._id, Number(event.target.value))}
                  className="w-20 rounded-xl border border-black/10 px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => removeItem(item._id)}
                  className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-ink hover:border-accent hover:text-accent"
                >
                  Remove
                </button>
              </div>
            </div>
          )) : (
            <div className="rounded-[28px] bg-white p-10 text-center shadow-[0_20px_60px_rgba(17,24,39,0.08)]">
              <p className="text-lg font-medium text-ink">Your cart is empty.</p>
              <Link href="/dashboard" className="mt-4 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white">
                Browse products
              </Link>
            </div>
          )}
        </div>

        <aside className="rounded-[28px] bg-ink p-6 text-white shadow-[0_20px_60px_rgba(17,24,39,0.12)]">
          <p className="text-sm uppercase tracking-[0.24em] text-white/65">Summary</p>
          <div className="mt-4 space-y-3 text-sm text-white/80">
            <div className="flex items-center justify-between"><span>Items</span><span>{items.length}</span></div>
            <div className="flex items-center justify-between"><span>Subtotal</span><span>${subtotal}</span></div>
            <div className="flex items-center justify-between"><span>Payment</span><span>Cash on Delivery</span></div>
          </div>
          <Link href="/checkout" className="mt-6 inline-flex w-full justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-accent hover:text-white">
            Continue to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
