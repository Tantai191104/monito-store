import { ProductDataTable } from './components/ProductDataTable';
import { productColumns } from './components/ProductColumns';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

const ProductsManagement = () => {
  const { data, isLoading, error, refetch } = useProducts();
  const products = data?.products || [];

  if (error) {
    return (
      <div className="container mx-auto py-0">
        <div className="py-12 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            Failed to load products
          </h3>
          <p className="mb-4 text-gray-600">
            There was an error loading the pets. Please try again.
          </p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-0">
      <div className="mb-3 border-b p-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Products Management
        </h1>
        <p className="text-muted-foreground">
          Manage your store products, inventory, and pricing.
        </p>
      </div>

      <ProductDataTable columns={productColumns} data={products} className="p-6" />
    </div>
  );
};

export default ProductsManagement;
