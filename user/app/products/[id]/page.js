import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';
import { getProductById } from '@/lib/api';

export default async function ProductDetailsPage({ params }) {
  const product = await getProductById(params.id);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-ink">Product not found</h1>
        <Link href="/dashboard" className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">
          Back to shop
        </Link>
      </div>
    );
  }

  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=900&q=80';

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="relative min-h-[420px] overflow-hidden rounded-[32px] bg-white shadow-[0_24px_70px_rgba(17,24,39,0.08)]">
          <Image src={image} alt={product.name} fill className="object-cover" />
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">{product.category}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">{product.name}</h1>
            <p className="mt-4 text-base leading-8 text-ink/70">{product.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">Stock: {product.stock}</span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">Rating: {product.rating}</span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">Price: ${product.price}</span>
          </div>

          <div className="space-y-3 rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(17,24,39,0.08)]">
            <div>
              <p className="text-sm font-semibold text-ink">Sizes</p>
              <p className="mt-2 text-sm text-ink/65">{product.sizes?.join(', ') || 'One size'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Colors</p>
              <p className="mt-2 text-sm text-ink/65">{product.colors?.join(', ') || 'Standard'}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <AddToCartButton product={product} />
            <Link href="/checkout" className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent">
              Go to checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
