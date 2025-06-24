import { Package } from 'lucide-react';
import { PetDataTable } from './components/PetDataTable';
import { petColumns } from './components/PetColumns';
import { usePets } from '@/hooks/usePets';
import { Button } from '@/components/ui/button';

const PetsManagement = () => {
  const { data: pets = [], isLoading, error, refetch } = usePets();

  if (error) {
    return (
      <div className="container mx-auto py-0">
        <div className="py-12 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            Failed to load pets
          </h3>
          <p className="mb-4 text-gray-600">
            There was an error loading the pets. Please try again.
          </p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 py-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pets Management</h1>
        <p className="text-muted-foreground">
          Manage pet listings, health records, and availability.
        </p>
      </div>

      <PetDataTable
        columns={petColumns}
        data={pets}
        isLoading={isLoading}
        className="rounded-lg bg-white p-6 shadow"
      />
    </div>
  );
};

export default PetsManagement;
