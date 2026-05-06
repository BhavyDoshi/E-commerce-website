"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/auth-context';

function MainAuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [panel, setPanel] = useState('customer');
  const [mode, setMode] = useState('login');
  const [adminMode, setAdminMode] = useState('login');
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', password: '' });
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const adminBaseUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001';

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (panel === 'admin') {
        const result = adminMode === 'login'
          ? await login({ email: adminForm.email, password: adminForm.password })
          : await register({ ...adminForm, role: 'admin' });

        const sessionPayload = encodeURIComponent(JSON.stringify({ user: result.user, token: result.token }));
        window.location.href = `${adminBaseUrl}/dashboard#session=${sessionPayload}`;
      } else {
        const result = mode === 'login'
          ? await login({ email: customerForm.email, password: customerForm.password })
          : await register(customerForm);

        if (result.user.role === 'admin') {
          setError('Use the admin tab for admin access.');
          return;
        }

        router.push('/dashboard');
      }
    } catch (error) {
      setError(panel === 'admin'
        ? (adminMode === 'login'
          ? 'Admin login failed. Please check your credentials.'
          : 'Admin registration failed. Please check your details.')
        : mode === 'login'
          ? 'Unable to log in. Please try again.'
          : 'Unable to create the account. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-[36px] border border-black/5 bg-white/90 p-8 shadow-[0_30px_90px_rgba(17,24,39,0.08)]">
        <div className="mb-6 text-center">
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">Login</h1>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-full bg-black/5 p-1">
          <button
            type="button"
            onClick={() => setPanel('customer')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${panel === 'customer' ? 'bg-white text-ink shadow-sm' : 'text-ink/60'}`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setPanel('admin')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${panel === 'admin' ? 'bg-white text-ink shadow-sm' : 'text-ink/60'}`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {panel === 'customer' ? (
            <>
              <div className="grid grid-cols-2 gap-2 rounded-full bg-black/5 p-1">
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

              {mode === 'register' && (
                <div>
                  <label className="text-sm font-medium text-ink">Full Name</label>
                  <input
                    type="text"
                    value={customerForm.name}
                    onChange={(event) => setCustomerForm({ ...customerForm, name: event.target.value })}
                    className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-accent"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-ink">Email</label>
                <input
                  type="email"
                  value={customerForm.email}
                  onChange={(event) => setCustomerForm({ ...customerForm, email: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-ink">Password</label>
                <input
                  type="password"
                  value={customerForm.password}
                  onChange={(event) => setCustomerForm({ ...customerForm, password: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-accent"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 rounded-full bg-black/5 p-1">
                <button
                  type="button"
                  onClick={() => setAdminMode('login')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${adminMode === 'login' ? 'bg-white text-ink shadow-sm' : 'text-ink/60'}`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setAdminMode('register')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${adminMode === 'register' ? 'bg-white text-ink shadow-sm' : 'text-ink/60'}`}
                >
                  Register
                </button>
              </div>

              {adminMode === 'register' && (
                <div>
                  <label className="text-sm font-medium text-ink">Admin Name</label>
                  <input
                    type="text"
                    value={adminForm.name}
                    onChange={(event) => setAdminForm({ ...adminForm, name: event.target.value })}
                    className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-accent"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-ink">Admin Email</label>
                <input
                  type="email"
                  value={adminForm.email}
                  onChange={(event) => setAdminForm({ ...adminForm, email: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-ink">Password</label>
                <input
                  type="password"
                  value={adminForm.password}
                  onChange={(event) => setAdminForm({ ...adminForm, password: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-accent"
                  required
                />
              </div>
            </>
          )}

          {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading
              ? panel === 'admin'
                ? adminMode === 'login'
                  ? 'Signing in...'
                  : 'Creating admin account...'
                : mode === 'login'
                  ? 'Signing in...'
                  : 'Creating account...'
              : panel === 'admin'
                ? adminMode === 'login'
                  ? 'Open admin dashboard'
                  : 'Create admin account'
                : mode === 'login'
                  ? 'Login'
                  : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return <MainAuthPage />;
}
