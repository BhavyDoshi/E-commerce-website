"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { getAdminStats } from '@/lib/api';
import StatCard from '@/components/StatCard';

export default function DashboardPage() {
	const router = useRouter();
	const { ready, token, isAuthenticated, isAdmin } = useAuth();
	const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });

	useEffect(() => {
		if (!ready) {
			return;
		}

		if (!isAuthenticated || !isAdmin) {
			router.replace('/login');
			return;
		}

		getAdminStats(token).then(setStats);
	}, [isAdmin, isAuthenticated, ready, router, token]);

	if (!ready || !isAuthenticated || !isAdmin) {
		return (
			<div className="mx-auto max-w-3xl px-4 py-16 text-center">
				<h1 className="text-3xl font-semibold text-ink">Loading admin dashboard...</h1>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
			<section className="grid gap-10 rounded-[36px] border border-black/5 bg-white/80 p-8 shadow-[0_30px_90px_rgba(17,24,39,0.08)] lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
				<div className="space-y-6">
					<p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Admin Dashboard</p>
					<h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
						Manage products, customers, and COD orders from one control panel.
					</h1>
					<p className="max-w-xl text-base leading-8 text-ink/70 sm:text-lg">
						Monitor inventory, track orders, and manage your customer base efficiently. Control every aspect of your business from one central hub.
					</p>
					<div className="flex flex-wrap gap-3">
						<Link href="/products/new" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent">
							Add product
						</Link>
						<Link href="/orders" className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent">
							View orders
						</Link>
					</div>
				</div>

				<div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
							<StatCard label="Customers" value={stats.users} detail="Registered customer accounts" />
					<StatCard label="Products" value={stats.products} detail="Catalog items" />
					<StatCard label="Orders" value={stats.orders} detail="Placed COD orders" />
				</div>
			</section>
		</div>
	);
}
