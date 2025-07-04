import { useMemo } from 'react';
import { ArrowRightIcon, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '../../products/components/ProductCard';

const ProductSection = () => {
  const params = useMemo(() => {
    const p = new URLSearchParams();
    p.append('limit', '8');
    p.append('sortBy', 'createdAt');
    p.append('sortOrder', 'desc');
    p.append('isActive', 'true');
    return p;
  }, []);

  const { data, isLoading, error } = useProducts(params);
  const products = data?.products || [];

  return (
    <section className="bg-[#FDFDFD] px-8 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm text-gray-600">
              Hard to choose right products for your pets?
            </p>
            <h2 className="text-2xl font-bold text-[#003459]">Our Products</h2>
          </div>
          <Button
            variant="outline"
            className="border-[#003459] bg-transparent text-[#003459] hover:bg-[#003459] hover:text-white"
          >
            View more
            <ArrowRightIcon className="ml-2 size-4" />
          </Button>
        </div>

        {error && (
          <div className="text-center text-red-500">
            Failed to load products. Please try again later.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <ProductCard.Skeleton key={index} />
              ))
            : products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </div>

        {!isLoading && products.length === 0 && !error && (
          <div className="col-span-full py-12 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No Products Available
            </h3>
            <p className="text-gray-600">Please check back later!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
