"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { deleteProduct, getProducts } from '@/lib/api';

export default function ProductsPage() {
  const { token, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [deletingId, setDeletingId] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    getProducts(token).then(setProducts);
  }, [isAuthenticated, token]);

  async function handleDelete(productId) {
    const confirmed = window.confirm('Delete this product? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    setDeletingId(productId);

    try {
      await deleteProduct(token, productId);
      setProducts((currentProducts) => currentProducts.filter((product) => product._id !== productId));
    } catch (error) {
      window.alert('Unable to delete this product. Please try again.');
    } finally {
      setDeletingId('');
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-ink">Login to manage products</h1>
        <Link href="/login" className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Products</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">Catalog management</h1>
        </div>
        <Link href="/products/new" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent">
          Add product
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article key={product._id} className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(17,24,39,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{product.category}</p>
            <h2 className="mt-3 text-2xl font-semibold text-ink">{product.name}</h2>
            <p className="mt-3 text-sm leading-6 text-ink/65">{product.description}</p>
            <div className="mt-5 flex items-center justify-between text-sm text-ink/70">
              <span>${product.price}</span>
              <span>Stock: {product.stock}</span>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(product._id)}
              disabled={deletingId === product._id}
              className="mt-5 w-full rounded-full border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {deletingId === product._id ? 'Deleting...' : 'Delete product'}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
