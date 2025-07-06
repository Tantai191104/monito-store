import { Link } from 'react-router-dom';
import EntityCard from '@/components/shared/EntityCard';
import type { Pet } from '@/types/pet';

const PetCard = ({ pet }: { pet: Pet }) => {
  const subtitle = (
    <div className="flex items-center gap-2 text-gray-600">
      <span>
        Gene: <strong>{pet.gender}</strong>
      </span>
      <span>•</span>
      <span>
        Age: <strong>{pet.age}</strong>
      </span>
    </div>
  );

  const price = `${pet.price.toLocaleString('vi-VN')} VND`;

  return (
    <EntityCard
      href={`/pets/${pet._id}`}
      image={pet.images[0] || ''}
      imageAlt={pet.name}
      title={pet.name}
      subtitle={subtitle}
      price={price}
    />
  );
};

PetCard.Skeleton = EntityCard.Skeleton;

export default PetCard;
