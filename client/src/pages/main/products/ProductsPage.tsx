import { useSearchParams } from 'react-router-dom';
import ProductFilters from './components/ProductFilters';
import ProductGrid from './components/ProductGrid';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="bg-[#FDFDFD]">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <ProductFilters
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </aside>
          <main className="lg:col-span-3">
            <ProductGrid
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
