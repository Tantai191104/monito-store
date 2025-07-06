import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Product } from '@/types/product';

interface ProductBreadcrumbProps {
  product: Product;
}

const ProductBreadcrumb = ({ product }: ProductBreadcrumbProps) => {
  return (
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
  );
};

export default ProductBreadcrumb;
