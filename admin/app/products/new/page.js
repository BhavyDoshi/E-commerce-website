"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { createProduct } from '@/lib/api';

const initialForm = {
  name: '',
  slug: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  imageUrl: '',
  sizes: 'One Size',
  colors: 'Default',
  rating: '5',
  featured: true,
};

export default function NewProductPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await createProduct(token, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        rating: Number(form.rating),
        images: form.imageUrl ? [form.imageUrl] : [],
        sizes: form.sizes.split(',').map((value) => value.trim()).filter(Boolean),
        colors: form.colors.split(',').map((value) => value.trim()).filter(Boolean),
      });

      setMessage('Product created successfully.');
      router.push('/products');
    } catch (error) {
      setMessage('Unable to create the product.');
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-ink">Login to add products</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[32px] bg-white p-8 shadow-[0_20px_60px_rgba(17,24,39,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Add product</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">Create a catalog item</h1>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
          {[
            ['name', 'Product name'],
            ['slug', 'Slug'],
            ['category', 'Category'],
            ['price', 'Price'],
            ['stock', 'Stock'],
            ['rating', 'Rating'],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="text-sm font-medium text-ink">{label}</label>
              <input
                type="text"
                value={form[key]}
                onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-accent"
                required
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-ink">Description</label>
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="mt-2 min-h-28 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-accent"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-ink">Image URL</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(event) => setForm({ ...form, imageUrl: event.target.value })}
              className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-accent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-ink">Sizes</label>
            <input
              type="text"
              value={form.sizes}
              onChange={(event) => setForm({ ...form, sizes: event.target.value })}
              className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-accent"
              placeholder="S, M, L"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-ink">Colors</label>
            <input
              type="text"
              value={form.colors}
              onChange={(event) => setForm({ ...form, colors: event.target.value })}
              className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-accent"
              placeholder="Black, Olive"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => setForm({ ...form, featured: event.target.checked })}
              className="h-4 w-4"
            />
            <span className="text-sm text-ink/70">Featured product</span>
          </div>

          {message ? <p className="md:col-span-2 rounded-2xl bg-sand px-4 py-3 text-sm text-ink">{message}</p> : null}

          <div className="md:col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/products')}
              className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Create product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
