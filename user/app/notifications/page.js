"use client";

import { useEffect, useState } from 'react';

export default function NotificationsPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const stored = window.localStorage.getItem('ecommerce-last-order');
    if (stored) {
      setOrder(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Notification</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">Order has been placed</h1>
      <p className="mt-4 text-lg text-ink/70">Your cash-on-delivery order is now pending delivery confirmation.</p>
      {order ? (
        <div className="mt-10 rounded-[28px] bg-white p-8 text-left shadow-[0_20px_60px_rgba(17,24,39,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Latest order</p>
          <h2 className="mt-3 text-2xl font-semibold text-ink">{order.orderNumber}</h2>
          <p className="mt-2 text-sm text-ink/65">Status: {order.orderStatus} | Payment: {order.paymentStatus}</p>
        </div>
      ) : null}
    </div>
  );
}
