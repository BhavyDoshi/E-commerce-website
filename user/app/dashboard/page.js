"use client";

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import SectionHeading from '@/components/SectionHeading';
import { getProducts } from '@/lib/api';

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getProducts()
      .then((data) => {
        if (isMounted) {
          setProducts(Array.isArray(data) ? data : []);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Dashboard"
        title="Discover Our Collections"
        description="Explore our curated selection of premium clothing and accessories. Find your perfect style and shop with confidence."
      />
      {loading ? (
        <div className="mt-10 rounded-[28px] bg-white p-10 text-center text-ink/70 shadow-[0_20px_60px_rgba(17,24,39,0.08)]">
          Loading products...
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
