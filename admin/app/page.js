"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

export default function AdminHomePage() {
  const router = useRouter();
  const { ready, isAuthenticated } = useAuth();
  const mainLoginUrl = process.env.NEXT_PUBLIC_MAIN_LOGIN_URL || 'http://localhost:3000/login';

  return (
    <div className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl gap-8 rounded-[36px] border border-black/5 bg-white/90 p-8 shadow-[0_30px_90px_rgba(17,24,39,0.08)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] bg-ink p-8 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Admin Portal</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Control panel access</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
            Manage products, review orders, and handle customer activity from one place.
          </p>
        </div>

        <div className="flex flex-col justify-center rounded-[28px] bg-white p-2">
          <p className="text-sm font-medium text-ink/70">
            {ready
              ? isAuthenticated
                ? 'You are signed in as an admin.'
                : 'Sign in to continue to the admin dashboard.'
              : 'Loading admin session...'}
          </p>

          <div className="mt-6">
            {ready && isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Open dashboard
              </Link>
            ) : (
              <a
                href={mainLoginUrl}
                className="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Open main login
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
