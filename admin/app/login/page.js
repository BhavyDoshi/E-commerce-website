"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/auth-context';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, logout } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login({ email: form.email, password: form.password });

      if (result.user.role !== 'admin') {
        logout();
        setError('Invalid admin credentials.');
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      setError('Admin login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-88px)] max-w-3xl items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-[36px] border border-black/5 bg-white/90 p-8 shadow-[0_30px_90px_rgba(17,24,39,0.08)]">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-ink">Admin Login</h1>
          <p className="mt-2 text-sm text-ink/60">Sign in with your admin account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-black/10 bg-white px-4 py-2 text-ink placeholder-ink/40 focus:border-accent focus:outline-none"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-black/10 bg-white px-4 py-2 text-ink placeholder-ink/40 focus:border-accent focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent px-4 py-2 font-semibold text-white transition hover:bg-accent/90 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          Need an admin account?{' '}
          <Link href="/register" className="font-semibold text-accent hover:opacity-90">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
