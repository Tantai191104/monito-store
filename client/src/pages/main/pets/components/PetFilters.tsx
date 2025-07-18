import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useActiveColors } from '@/hooks/useColors';
import { useActiveBreeds } from '@/hooks/useBreeds'; // ✅ Import hook để lấy breed
import { useInvalidatePetQueries } from '@/hooks/usePets';
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
  const { data: breeds = [], isLoading: breedsLoading } = useActiveBreeds(); // ✅ Lấy danh sách breed
  const invalidatePetQueries = useInvalidatePetQueries();

  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('minPrice') || MIN_PRICE),
    Number(searchParams.get('maxPrice') || MAX_PRICE),
  ]);

  const [debouncedPriceRange] = useDebounce(priceRange, 100);
  const [isResetting, setIsResetting] = useState(false);
  const [lastResetTime, setLastResetTime] = useState(0);

  useEffect(() => {
    if (isResetting) {
      setIsResetting(false);
      return;
    }

    // Don't run if we just reset (within 200ms)
    if (Date.now() - lastResetTime < 200) {
      return;
    }

    // Use non-debounced value if we're at default values to avoid debounce delay
    const currentPriceRange =
      priceRange[0] === MIN_PRICE && priceRange[1] === MAX_PRICE
        ? priceRange
        : debouncedPriceRange;

    // If we're at default values, don't update URL
    if (
      currentPriceRange[0] === MIN_PRICE &&
      currentPriceRange[1] === MAX_PRICE
    ) {
      return;
    }

    const newParams = new URLSearchParams(searchParams);
    const [min, max] = currentPriceRange;

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
  }, [
    debouncedPriceRange,
    priceRange,
    searchParams,
    setSearchParams,
    isResetting,
    lastResetTime,
  ]);

  // Sync state with URL on back/forward navigation
  useEffect(() => {
    if (isResetting) {
      return;
    }

    // Don't run if we just reset (within 200ms)
    if (Date.now() - lastResetTime < 200) {
      return;
    }

    const min = Number(searchParams.get('minPrice') || MIN_PRICE);
    const max = Number(searchParams.get('maxPrice') || MAX_PRICE);
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
    setIsResetting(true);
    setLastResetTime(Date.now());

    // Clear URL params including price params
    const newParams = new URLSearchParams();
    setSearchParams(newParams);

    setPriceRange([MIN_PRICE, MAX_PRICE]);

    invalidatePetQueries();
    // Force a refetch after a longer delay to ensure the debounced value has updated
    setTimeout(() => {
      invalidatePetQueries();
    }, 200); // Increased from 100ms to 200ms
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

      {/* Breed Filter */}
      <div>
        <h4 className="mb-2 font-semibold">Breed</h4>
        <div className="space-y-2">
          {breedsLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))
            : breeds.map((breed) => (
                <div key={breed._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`breed-${breed._id}`}
                    checked={searchParams.getAll('breed').includes(breed.name)}
                    onCheckedChange={(checked) =>
                      handleMultiSelectChange('breed', breed.name, !!checked)
                    }
                  />
                  <label htmlFor={`breed-${breed._id}`} className="text-sm">
                    {breed.name}
                  </label>
                </div>
              ))}
        </div>
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
          onValueChange={(value) => setPriceRange(value as [number, number])}
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
