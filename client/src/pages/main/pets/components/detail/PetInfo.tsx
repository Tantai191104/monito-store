import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/formatter';
import type { Pet } from '@/types/pet';
import { MessageCircle } from 'lucide-react';

const PetInfo = ({ pet }: { pet: Pet }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#003459]">{pet.name}</h1>
        <p className="text-2xl font-bold text-gray-800">
          {formatPrice(pet.price)} VND
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Breed:</span>
            <p className="text-gray-900">{pet.breed.name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Color:</span>
            <p className="text-gray-900">{pet.color.name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Age:</span>
            <p className="text-gray-900">{pet.age} months</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Gender:</span>
            <p className="text-gray-900 capitalize">{pet.gender}</p>
          </div>
        </div>
        
        <div>
          <span className="font-medium text-gray-600">Description:</span>
          <p className="text-gray-900 mt-1">{pet.description}</p>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button
          size="lg"
          variant="outline"
          className="flex-1 border-[#003459] text-[#003459] hover:bg-[#003459] hover:text-white"
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Chat with Monito
        </Button>
      </div>

      {!pet.isAvailable && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800 text-sm font-medium">
            This pet is currently not available for adoption.
          </p>
        </div>
      )}
    </div>
  );
};

export default PetInfo;
