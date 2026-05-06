"use client";

import { useCart } from '@/context/cart-context';

export default function AddToCartButton({ product, className = '' }) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className={`rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent ${className}`}
    >
      Add to cart
    </button>
  );
}
