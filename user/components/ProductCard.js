"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=900&q=80';

  return (
    <article className="group overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_20px_60px_rgba(17,24,39,0.08)] transition hover:-translate-y-1 hover:shadow-glow">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <Image src={image} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
      </div>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{product.category}</p>
          <h3 className="mt-2 text-xl font-semibold text-ink">{product.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/65">{product.description}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-lg font-semibold text-ink">${product.price}</span>
          <span className="rounded-full bg-accentSoft px-3 py-1 text-xs font-semibold text-accent">{product.rating} rating</span>
        </div>

        <div className="flex gap-3">
          <Link href={`/products/${product._id}`} className="flex-1 rounded-full border border-black/10 px-4 py-3 text-center text-sm font-medium text-ink transition hover:border-accent hover:text-accent">
            View details
          </Link>
          <button
            type="button"
            onClick={() => addItem(product)}
            className="flex-1 rounded-full bg-ink px-4 py-3 text-sm font-medium text-white transition hover:bg-accent"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
