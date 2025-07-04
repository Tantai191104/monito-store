import { useMemo } from 'react';
import { ArrowRightIcon, Gift, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/hooks/useProducts';

const ProductSection = () => {
  const params = useMemo(() => {
    const p = new URLSearchParams();
    p.append('limit', '8');
    p.append('sortBy', 'createdAt');
    p.append('sortOrder', 'desc');
    p.append('isActive', 'true');
    return p;
  }, []);

  const { data: products = [], isLoading, error } = useProducts(params);

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
                <Card
                  key={index}
                  className="overflow-hidden rounded-lg p-2 shadow-sm"
                >
                  <Skeleton className="aspect-square w-full rounded-md" />
                  <CardContent className="px-2 pt-4 pb-2">
                    <Skeleton className="mb-2 h-6 w-3/4" />
                    <Skeleton className="mb-2 h-4 w-full" />
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="mt-3 h-8 w-full" />
                  </CardContent>
                </Card>
              ))
            : products.map((product) => (
                <Card
                  key={product._id}
                  className="flex flex-col overflow-hidden rounded-lg p-2 shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="aspect-square w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/300x300?text=No+Image';
                      }}
                    />
                  </div>
                  <CardContent className="flex flex-1 flex-col px-2 pb-2">
                    <CardTitle className="mb-2 truncate text-base font-bold">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="mb-2 flex-grow space-y-1 text-xs">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>
                          Product: <strong>{product.category.name}</strong>
                        </span>
                        {product.specifications.size && (
                          <>
                            <span>&#8226;</span>
                            <span>
                              Size:{' '}
                              <strong>{product.specifications.size}</strong>
                            </span>
                          </>
                        )}
                      </div>
                      <div className="text-sm font-bold text-black">
                        {product.price.toLocaleString('vi-VN')} ₫
                      </div>
                    </CardDescription>
                    {product.gifts && product.gifts.length > 0 && (
                      <div className="mt-auto flex items-center gap-2 rounded-md bg-[#FFF1E4] p-2 text-xs font-bold text-[#003459]">
                        <Gift className="size-4 text-red-500" />
                        <span>{product.gifts.join(' & ')}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
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
