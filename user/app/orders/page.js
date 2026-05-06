"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { getMyOrders } from '@/lib/api';

export default function OrdersPage() {
  const { token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    getMyOrders(token).then((fetchedOrders) => {
      setOrders(fetchedOrders);
      const stored = window.localStorage.getItem('ecommerce-last-order');
      if (stored) {
        setLatestOrder(JSON.parse(stored));
      }
    });
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-ink">Login to view your orders</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Orders</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">My orders</h1>
      {latestOrder && (
        <div className="mt-10 rounded-[28px] bg-accentSoft p-6 shadow-[0_20px_60px_rgba(17,24,39,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Latest order</p>
          <h2 className="mt-3 text-2xl font-semibold text-ink">{latestOrder.orderNumber}</h2>
          <p className="mt-2 text-sm text-ink/65">Status: {latestOrder.orderStatus} | Payment: {latestOrder.paymentStatus}</p>
        </div>
      )}
      <div className="mt-10 space-y-4">
        {orders.map((order) => (
          <article key={order._id} className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(17,24,39,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-ink">{order.orderNumber}</h2>
                <p className="mt-1 text-sm text-ink/65">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 text-xs font-semibold uppercase tracking-[0.2em]">
                <span className="rounded-full bg-accentSoft px-3 py-1 text-accent">{order.orderStatus}</span>
                <span className="rounded-full bg-sand px-3 py-1 text-ink">{order.paymentStatus}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-ink/70">
              <span>Items: {order.items?.length || 0}</span>
              <span>Total: ${order.totalPrice}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
