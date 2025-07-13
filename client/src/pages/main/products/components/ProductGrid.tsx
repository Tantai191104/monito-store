import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Package } from 'lucide-react';

interface ProductGridProps {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
}

const ProductGrid = ({ searchParams, setSearchParams }: ProductGridProps) => {
  const { data, isLoading, error } = useProducts(searchParams);
  const products = data?.products || [];
  const pagination = data?.pagination;

  // Force re-render when search params change
  const searchParamsKey = searchParams.toString() || 'default';

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('_');
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortBy', sortBy);
    newParams.set('sortOrder', sortOrder);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    if (!pagination || page < 1 || page > pagination.pages) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(page));
    setSearchParams(newParams);
  };

  const currentSort = `${searchParams.get('sortBy') || 'createdAt'}_${
    searchParams.get('sortOrder') || 'desc'
  }`;

  return (
    <div key={searchParamsKey}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#003459]">
          All Products{' '}
          <span className="text-base font-normal text-gray-500">
            ({pagination?.total || 0} items)
          </span>
        </h2>
        <Select onValueChange={handleSortChange} value={currentSort}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt_desc">Sort by: Newest</SelectItem>
            <SelectItem value="price_asc">
              Sort by: Price Low to High
            </SelectItem>
            <SelectItem value="price_desc">
              Sort by: Price High to Low
            </SelectItem>
            <SelectItem value="name_asc">Sort by: Name A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="col-span-full text-center text-red-500">
          Failed to load products.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <ProductCard.Skeleton key={i} />
            ))
          : products.length > 0
            ? products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            : !isLoading && (
                <div className="col-span-full py-16 text-center">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">
                    No Products Found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your filters.
                  </p>
                </div>
              )}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className={
                    !pagination.hasPrevPage
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
              {[...Array(pagination.pages).keys()].map((i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => handlePageChange(i + 1)}
                    isActive={pagination.page === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className={
                    !pagination.hasNextPage
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
