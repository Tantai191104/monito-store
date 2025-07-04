import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/formatter';
import type { Pet } from '@/types/pet';
import { MessageCircle } from 'lucide-react';

const PetInfo = ({ pet }: { pet: Pet }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        SKU #{pet._id.slice(-8).toUpperCase()}
      </p>
      <h1 className="text-3xl font-bold text-[#003459]">{pet.name}</h1>
      <p className="text-2xl font-bold text-gray-800">
        {formatPrice(pet.price)} VND
      </p>
      <div className="flex space-x-4 pt-4">
        <Button size="lg" className="flex-1 bg-[#003459] hover:bg-[#003459]/90">
          Contact us
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1 border-[#003459] text-[#003459] hover:bg-[#003459] hover:text-white"
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Chat with Monito
        </Button>
      </div>
    </div>
  );
};

export default PetInfo;
