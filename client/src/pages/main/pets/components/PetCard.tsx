import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Pet } from '@/types/pet';

const PetCard = ({ pet }: { pet: Pet }) => {
  return (
    <Card className="overflow-hidden rounded-lg p-2 shadow-sm transition-shadow hover:shadow-lg">
      <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-100">
        <img
          src={pet.images[0]}
          alt={pet.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
      </div>
      <CardContent className="p-2">
        <CardTitle className="truncate text-base font-bold text-[#003459]">
          {pet.name}
        </CardTitle>
        <CardDescription className="mt-1 space-y-1 text-xs">
          <div className="flex items-center gap-2 text-gray-600">
            <span>
              Gene: <strong>{pet.gender}</strong>
            </span>
            <span>•</span>
            <span>
              Age: <strong>{pet.age}</strong>
            </span>
          </div>
          <div className="text-sm font-bold text-black">
            {pet.price.toLocaleString('vi-VN')} VND
          </div>
        </CardDescription>
      </CardContent>
    </Card>
  );
};

PetCard.Skeleton = function PetCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-lg p-2 shadow-sm">
      <Skeleton className="aspect-square w-full rounded-md" />
      <CardContent className="p-2 pt-3">
        <Skeleton className="mb-2 h-5 w-3/4" />
        <Skeleton className="mb-1 h-4 w-full" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  );
};

export default PetCard;
