import ProductCard from '@/components/ProductCard';
import SectionHeading from '@/components/SectionHeading';
import { mockProducts } from '@/lib/mock-data';

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Dashboard"
        title="Discover Our Collections"
        description="Explore our curated selection of premium clothing and accessories. Find your perfect style and shop with confidence."
      />
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {mockProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
