import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useCategories } from '@/hooks/useCategories';
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

  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('minPrice') || MIN_PRICE),
    Number(searchParams.get('maxPrice') || MAX_PRICE),
  ]);

  console.log(categories);

  const [debouncedPriceRange] = useDebounce(priceRange, 500);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    const [min, max] = debouncedPriceRange;

    if (min > MIN_PRICE) newParams.set('minPrice', String(min));
    else newParams.delete('minPrice');

    if (max < MAX_PRICE) newParams.set('maxPrice', String(max));
    else newParams.delete('maxPrice');

    if (newParams.toString() !== searchParams.toString()) {
      newParams.set('page', '1');
      setSearchParams(newParams);
    }
  }, [debouncedPriceRange, searchParams, setSearchParams]);

  useEffect(() => {
    const min = Number(searchParams.get('minPrice') || MIN_PRICE);
    const max = Number(searchParams.get('maxPrice') || MAX_PRICE);
    setPriceRange([min, max]);
  }, [searchParams]);

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
    setSearchParams(new URLSearchParams());
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
                  <Checkbox
                    id={`category-${category._id}`}
                    checked={searchParams
                      .getAll('category')
                      .includes(category.name)}
                    onCheckedChange={(checked) =>
                      handleMultiSelectChange(
                        'category',
                        category.name,
                        !!checked,
                      )
                    }
                  />
                  <label
                    htmlFor={`category-${category._id}`}
                    className="text-sm"
                  >
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
          onValueChange={setPriceRange}
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
