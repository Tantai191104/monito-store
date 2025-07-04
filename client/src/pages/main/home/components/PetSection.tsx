/**
 * Node modules
 */
import { useMemo } from 'react';
import { ArrowRightIcon, Package } from 'lucide-react';

/**
 * Components
 */
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Hooks
 */
import { usePets } from '@/hooks/usePets';

const PetSection = () => {
  const params = useMemo(() => {
    const p = new URLSearchParams();
    p.append('limit', '8');
    p.append('sortBy', 'createdAt');
    p.append('sortOrder', 'desc');
    return p;
  }, []);

  const { data: pets = [], isLoading, error } = usePets(params);

  return (
    <section className="bg-white px-8 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm text-gray-600">What's new?</p>
            <h2 className="text-2xl font-bold text-[#003459]">
              Take A Look At Some Of Our Pets
            </h2>
          </div>
          <Button
            variant="outline"
            className="border-[#003459] bg-transparent text-[#003459] hover:bg-[#003459] hover:text-white"
          >
            View more
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>

        {error && (
          <div className="text-center text-red-500">
            Failed to load pets. Please try again later.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <Card
                  key={index}
                  className="gap-3 overflow-hidden rounded-md p-2"
                >
                  <Skeleton className="aspect-square w-full rounded-md" />
                  <CardContent className="px-2 pt-4 pb-2">
                    <Skeleton className="mb-2 h-6 w-3/4" />
                    <Skeleton className="mb-1 h-4 w-1/2" />
                    <Skeleton className="h-5 w-1/3" />
                  </CardContent>
                </Card>
              ))
            : pets.map((pet) => (
                <Card
                  key={pet._id}
                  className="gap-3 overflow-hidden rounded-md p-2 transition-shadow hover:shadow-lg"
                >
                  <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-gray-200">
                    <img
                      src={pet.images[0]}
                      alt={pet.name}
                      className="aspect-square w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/300x300?text=No+Image';
                      }}
                    />
                  </div>
                  <CardContent className="px-2 pt-4 pb-2">
                    <CardTitle className="mb-2 truncate font-bold">
                      {pet.name}
                    </CardTitle>
                    <CardDescription className="space-y-1">
                      <div className="flex justify-start gap-2 text-sm text-gray-600">
                        <span>
                          Gender: <strong>{pet.gender}</strong>
                        </span>
                        <span>&#8226;</span>
                        <span>
                          Age: <strong>{pet.age}</strong>
                        </span>
                      </div>
                      <div className="text-sm font-bold text-black">
                        {pet.price.toLocaleString('vi-VN')} ₫
                      </div>
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
        </div>

        {!isLoading && pets.length === 0 && !error && (
          <div className="col-span-full py-12 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No Pets Available
            </h3>
            <p className="text-gray-600">
              There are currently no pets to display. Please check back later!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PetSection;
