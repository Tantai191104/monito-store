import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useActiveColors } from '@/hooks/useColors';
import { formatPrice } from '@/utils/formatter';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';

interface PetFiltersProps {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
}

const MIN_PRICE = 0;
const MAX_PRICE = 20000000; // 20 million

const PetFilters = ({ searchParams, setSearchParams }: PetFiltersProps) => {
  const { data: colors = [], isLoading: colorsLoading } = useActiveColors();

  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('minPrice') || MIN_PRICE),
    Number(searchParams.get('maxPrice') || MAX_PRICE),
  ]);

  const [debouncedPriceRange] = useDebounce(priceRange, 500);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    const [min, max] = debouncedPriceRange;

    // Only set params if they are not the default values
    if (min > MIN_PRICE) {
      newParams.set('minPrice', String(min));
    } else {
      newParams.delete('minPrice');
    }

    if (max < MAX_PRICE) {
      newParams.set('maxPrice', String(max));
    } else {
      newParams.delete('maxPrice');
    }

    if (newParams.toString() !== searchParams.toString()) {
      newParams.set('page', '1');
      setSearchParams(newParams);
    }
  }, [debouncedPriceRange, searchParams, setSearchParams]);

  // Sync state with URL on back/forward navigation
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

  // Check if any actual filters are applied, ignoring pagination/sorting params
  const filterParamKeys = new Set(Array.from(searchParams.keys()));
  ['page', 'limit', 'sortBy', 'sortOrder'].forEach((key) =>
    filterParamKeys.delete(key),
  );
  const hasFilters = filterParamKeys.size > 0;

  const genders = ['Male', 'Female'];
  const sizes = ['Small', 'Medium', 'Large'];

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

      {/* Gender Filter */}
      <div>
        <h4 className="mb-2 font-semibold">Gender</h4>
        <div className="space-y-2">
          {genders.map((gender) => (
            <div key={gender} className="flex items-center space-x-2">
              <Checkbox
                id={`gender-${gender}`}
                checked={searchParams.getAll('gender').includes(gender)}
                onCheckedChange={(checked) =>
                  handleMultiSelectChange('gender', gender, !!checked)
                }
              />
              <label htmlFor={`gender-${gender}`} className="text-sm">
                {gender}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h4 className="mb-2 font-semibold">Color</h4>
        <div className="space-y-2">
          {colorsLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))
            : colors.map((color) => (
                <div key={color._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color._id}`}
                    checked={searchParams.getAll('color').includes(color.name)}
                    onCheckedChange={(checked) =>
                      handleMultiSelectChange('color', color.name, !!checked)
                    }
                  />
                  <div
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: color.hexCode }}
                  />
                  <label htmlFor={`color-${color._id}`} className="text-sm">
                    {color.name}
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
          step={100000}
          className="my-4"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>{formatPrice(priceRange[0])} ₫</span>
          <span>{formatPrice(priceRange[1])} ₫</span>
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h4 className="mb-2 font-semibold">Size</h4>
        <div className="space-y-2">
          {sizes.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size}`}
                checked={searchParams.getAll('size').includes(size)}
                onCheckedChange={(checked) =>
                  handleMultiSelectChange('size', size, !!checked)
                }
              />
              <label htmlFor={`size-${size}`} className="text-sm">
                {size}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PetFilters;
