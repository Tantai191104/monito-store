import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useCategories } from '@/hooks/useCategories';
import { useInvalidateProductQueries } from '@/hooks/useProducts';
import { formatPrice } from '@/utils/formatter';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';

interface ProductFiltersProps {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
}

const MIN_PRICE = 0;
const MAX_PRICE = 5000000; // 5 million

const ProductFilters = ({
  searchParams,
  setSearchParams,
}: ProductFiltersProps) => {
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const invalidateProductQueries = useInvalidateProductQueries();

  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('minPrice') || MIN_PRICE),
    Number(searchParams.get('maxPrice') || MAX_PRICE),
  ]);

  const [debouncedPriceRange] = useDebounce(priceRange, 100);
  const [isResetting, setIsResetting] = useState(false);
  const [lastResetTime, setLastResetTime] = useState(0);

  useEffect(() => {
    if (isResetting) {
      console.log('Skipping price range effect due to reset');
      setIsResetting(false);
      return;
    }
    // Don't run if we just reset (within 200ms)
    if (Date.now() - lastResetTime < 200) {
      console.log('Skipping price range effect due to recent reset');
      return;
    }
    // Use non-debounced value if we're at default values to avoid debounce delay
    const currentPriceRange = (priceRange[0] === MIN_PRICE && priceRange[1] === MAX_PRICE)
      ? priceRange
      : debouncedPriceRange;
    console.log('Product price range effect running - min:', currentPriceRange[0], 'max:', currentPriceRange[1], 'using debounced:', currentPriceRange === debouncedPriceRange);
    // If we're at default values, don't update URL
    if (currentPriceRange[0] === MIN_PRICE && currentPriceRange[1] === MAX_PRICE) {
      console.log('At default values, skipping URL update');
      return;
    }
    const newParams = new URLSearchParams(searchParams);
    const [min, max] = currentPriceRange;
    if (min > MIN_PRICE) newParams.set('minPrice', String(min));
    else newParams.delete('minPrice');
    if (max < MAX_PRICE) newParams.set('maxPrice', String(max));
    else newParams.delete('maxPrice');
    if (newParams.toString() !== searchParams.toString()) {
      newParams.set('page', '1');
      console.log('Updating product URL params:', newParams.toString());
      setSearchParams(newParams);
    }
  }, [debouncedPriceRange, priceRange, searchParams, setSearchParams, isResetting, lastResetTime]);

  useEffect(() => {
    if (isResetting) {
      console.log('Skipping product URL sync effect due to reset');
      return;
    }
    // Don't run if we just reset (within 200ms)
    if (Date.now() - lastResetTime < 200) {
      console.log('Skipping product URL sync effect due to recent reset');
      return;
    }
    const min = Number(searchParams.get('minPrice') || MIN_PRICE);
    const max = Number(searchParams.get('maxPrice') || MAX_PRICE);
    console.log('Product URL sync effect - min:', min, 'max:', max, 'searchParams:', searchParams.toString());
    setPriceRange([min, max]);
  }, [searchParams, isResetting, lastResetTime]);

  const handleMultiSelectChange = (
    key: string,
    value: string,
    isChecked: boolean,
  ) => {
    const newParams = new URLSearchParams(searchParams);
    const existingValues = newParams.getAll(key);
    const updatedValues = isChecked
      ? [...existingValues, value]
      : existingValues.filter((v) => v !== value);
    newParams.delete(key);
    if (updatedValues.length > 0) {
      updatedValues.forEach((v) => newParams.append(key, v));
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    console.log('=== PRODUCT RESET START ===');
    setIsResetting(true);
    setLastResetTime(Date.now());
    setSearchParams(new URLSearchParams());
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    invalidateProductQueries();
    setTimeout(() => {
      console.log('=== PRODUCT RESET COMPLETE ===');
      invalidateProductQueries();
    }, 200);
  };

  const filterParamKeys = new Set(Array.from(searchParams.keys()));
  ['page', 'limit', 'sortBy', 'sortOrder'].forEach((key) =>
    filterParamKeys.delete(key),
  );
  const hasFilters = filterParamKeys.size > 0;

  return (
    <div className="space-y-6 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-[#003459]">Filter</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-xs text-blue-600 hover:bg-blue-50"
          >
            <X className="mr-1 h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="mb-2 font-semibold">Category</h4>
        <div className="space-y-2">
          {categoriesLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))
            : categories.map((category) => (
                <div key={category._id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`category-${category._id}`}
                    name="category"
                    value={category._id}
                    checked={searchParams.get('category') === category._id}
                    onChange={(e) => {
                      const newParams = new URLSearchParams(searchParams);
                      if (e.target.checked) {
                        newParams.set('category', category._id);
                      } else {
                        newParams.delete('category');
                      }
                      newParams.set('page', '1');
                      setSearchParams(newParams);
                    }}
                  />
                  <label htmlFor={`category-${category._id}`} className="text-sm">
                    {category.name}
                  </label>
                </div>
              ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h4 className="mb-2 font-semibold">Price</h4>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={50000}
          className="my-4"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>{formatPrice(priceRange[0])} ₫</span>
          <span>{formatPrice(priceRange[1])} ₫</span>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
