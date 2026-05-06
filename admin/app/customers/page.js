"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { getAdminCustomers } from '@/lib/api';

export default function CustomersPage() {
  const { token, isAuthenticated } = useAuth();
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    getAdminCustomers(token).then(setCustomers);
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-ink">Login to view customers</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Customers</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">Registered users</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {customers.map((customer) => (
          <article key={customer._id} className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(17,24,39,0.08)]">
            <h2 className="text-xl font-semibold text-ink">{customer.name}</h2>
            <p className="mt-2 text-sm text-ink/65">{customer.email}</p>
            <span className="mt-4 inline-flex rounded-full bg-sand px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-ink">{customer.role}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
