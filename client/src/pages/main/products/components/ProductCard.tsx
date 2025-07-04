import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Gift } from 'lucide-react';
import type { Product } from '@/types/product';
import { formatPrice } from '@/utils/formatter';

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link to={`/products/${product._id}`} className="block h-full">
      <Card className="flex h-full flex-col overflow-hidden rounded-lg p-2 shadow-sm transition-shadow hover:shadow-lg">
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
        <CardContent className="flex flex-1 flex-col px-2 pt-4 pb-2">
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
                    Size: <strong>{product.specifications.size}</strong>
                  </span>
                </>
              )}
            </div>
            <div className="text-sm font-bold text-black">
              {formatPrice(product.price)} ₫
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
    </Link>
  );
};

ProductCard.Skeleton = function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-lg p-2 shadow-sm">
      <Skeleton className="aspect-square w-full rounded-md" />
      <CardContent className="px-2 pt-4 pb-2">
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="mt-3 h-8 w-full" />
      </CardContent>
    </Card>
  );
};

export default ProductCard;
