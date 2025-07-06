import { useEffect, useState } from 'react';
import { ProductDataTable } from './components/ProductDataTable';
import { productColumns } from './components/ProductColumns';
import { mockProducts } from '@/data/mockProducts';

const ProductsManagement = () => {
  const [data, setData] = useState(mockProducts);

  useEffect(() => {
    const newProducts = JSON.parse(localStorage.getItem('newProducts') || '[]');
    if (newProducts.length > 0) {
      setData([...newProducts, ...mockProducts]);
    }
  }, []);

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

      <ProductDataTable
        columns={productColumns}
        data={data}
        className="p-6"
      />
    </div>
  );
};

export default ProductsManagement;
