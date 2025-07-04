import { useParams } from 'react-router-dom';
import { usePet } from '@/hooks/usePets';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import PetBreadcrumb from './components/detail/PetBreadcrumb';
import PetImageGallery from './components/detail/PetImageGallery';
import PetInfo from './components/detail/PetInfo';
import PetDetailsTable from './components/detail/PetDetailsTable';
import { DogHeartIcon } from '@/components/icons/DogHeartIcon';
import { DogAndCatIcon } from '@/components/icons/DogAndCatIcon';

const PetDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: pet, isLoading, error } = usePet(id!);

  if (isLoading) {
    return <PetDetailSkeleton />;
  }

  if (error || !pet) {
    return (
      <div className="container mx-auto py-12">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Could not find the pet you were looking for. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto">
        <PetBreadcrumb pet={pet} />
        <div className="grid grid-cols-1 gap-12 rounded-xl border p-5 lg:grid-cols-2">
          {/* Left Column */}
          <div>
            <PetImageGallery images={pet.images} petName={pet.name} />
            <div className="mt-5 flex items-center justify-between rounded-lg bg-[#FFE7BA] p-2 px-4">
              <div className="flex items-center gap-2">
                <DogHeartIcon />
                <span className="text-sm font-semibold text-[#003459]">
                  100% health guarantee for pets
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DogAndCatIcon />
                <span className="text-sm font-semibold text-[#003459]">
                  100% guarantee of pet identification
                </span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <PetInfo pet={pet} />
            <PetDetailsTable pet={pet} />
          </div>
        </div>
      </div>
    </div>
  );
};

const PetDetailSkeleton = () => (
  <div className="container mx-auto py-8">
    <Skeleton className="mb-6 h-5 w-1/3" />
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <div>
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="mt-4 grid grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-md" />
          ))}
        </div>
      </div>
      <div>
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="mt-2 h-10 w-3/4" />
        <Skeleton className="mt-4 h-8 w-1/2" />
        <div className="mt-8 flex space-x-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
        </div>
        <div className="mt-8 space-y-4 border-t pt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default PetDetailPage;
