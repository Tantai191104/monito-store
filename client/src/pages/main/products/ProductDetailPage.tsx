import { useParams } from 'react-router-dom';
import { useProduct } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ChevronRight, ShoppingCart, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/formatter';
import { Link } from 'react-router-dom';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(id!);

  if (isLoading) return <ProductDetailSkeleton />;

  if (error || !product) {
    return (
      <div className="container mx-auto py-12">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Could not find the product. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto">
        <nav className="mb-6 flex items-center space-x-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/products" className="hover:text-blue-600">
            Products
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-700">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#003459]">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-4">
              <p className="text-2xl font-bold text-gray-800">
                {formatPrice(product.price)} ₫
              </p>
              {product.originalPrice && (
                <p className="text-lg text-gray-400 line-through">
                  {formatPrice(product.originalPrice)} ₫
                </p>
              )}
            </div>
            <p className="text-gray-600">{product.description}</p>
            {product.gifts && product.gifts.length > 0 && (
              <div className="flex items-center gap-2 rounded-md bg-[#FFF1E4] p-3 text-sm font-bold text-[#003459]">
                <Gift className="size-5 text-red-500" />
                <span>Bonus: {product.gifts.join(' & ')}</span>
              </div>
            )}
            <Button
              size="lg"
              className="w-full bg-[#003459] hover:bg-[#003459]/90"
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">Specifications</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>
                  <strong>Category:</strong> {product.category.name}
                </li>
                <li>
                  <strong>Brand:</strong> {product.brand}
                </li>
                {product.specifications.weight && (
                  <li>
                    <strong>Weight:</strong> {product.specifications.weight}
                  </li>
                )}
                {product.specifications.size && (
                  <li>
                    <strong>Size:</strong> {product.specifications.size}
                  </li>
                )}
                {product.specifications.material && (
                  <li>
                    <strong>Material:</strong> {product.specifications.material}
                  </li>
                )}
                {product.specifications.color && (
                  <li>
                    <strong>Color:</strong> {product.specifications.color}
                  </li>
                )}
                {product.specifications.ingredients && (
                  <li>
                    <strong>Ingredients:</strong>{' '}
                    {product.specifications.ingredients.join(', ')}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetailSkeleton = () => (
  <div className="container mx-auto py-8">
    <Skeleton className="mb-6 h-5 w-1/3" />
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-12 w-full" />
        <div className="space-y-3 border-t pt-6">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetailPage;
