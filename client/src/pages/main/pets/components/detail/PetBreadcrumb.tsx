import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Pet } from '@/types/pet';

interface PetBreadcrumbProps {
  pet: Pet;
}

const PetBreadcrumb = ({ pet }: PetBreadcrumbProps) => {
  return (
    <nav className="mb-6 flex items-center space-x-2 text-sm text-gray-500">
      <Link to="/" className="hover:text-blue-600">
        Home
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link to="/pets" className="hover:text-blue-600">
        Pets
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="font-medium text-gray-700">{pet.name}</span>
    </nav>
  );
};

export default PetBreadcrumb;
