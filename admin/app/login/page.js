"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/auth-context';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = mode === 'login'
        ? await login({ email: form.email, password: form.password })
        : await register({ ...form, role: 'admin' });

      if (result.user.role !== 'admin') {
        setError('Invalid admin credentials.');
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      setError(mode === 'login'
        ? 'Admin login failed. Please check your credentials.'
        : 'Admin registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-88px)] max-w-3xl items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-[36px] border border-black/5 bg-white/90 p-8 shadow-[0_30px_90px_rgba(17,24,39,0.08)]">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-ink">Admin Login</h1>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-full bg-black/5 p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${mode === 'login' ? 'bg-white text-ink shadow-sm' : 'text-ink/60'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${mode === 'register' ? 'bg-white text-ink shadow-sm' : 'text-ink/60'}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-black/10 bg-white px-4 py-2 text-ink placeholder-ink/40 focus:border-accent focus:outline-none"
                placeholder="Your name"
              />
            </div>
          )}

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
            {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Register')}
          </button>
        </form>
      </div>
    </div>
  );
}
