"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/products', label: 'Products' },
  { href: '/products/new', label: 'Add product' },
  { href: '/orders', label: 'Orders' },
  { href: '/customers', label: 'Customers' },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();

  if (pathname === '/login') {
    return null;
  }

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[rgba(247,243,234,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="text-lg font-semibold tracking-[0.18em] text-ink uppercase">
          Admin Panel
        </Link>

        <nav className="hidden gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition ${pathname === link.href ? 'text-accent' : 'text-ink/70 hover:text-ink'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-ink/65 sm:inline">{user?.name}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-accent"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
