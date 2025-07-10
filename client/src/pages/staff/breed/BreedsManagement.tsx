import { BreedDataTable } from './components/BreedDataTable';
import { breedColumns } from './components/BreedColumns';
import { useBreeds } from '@/hooks/useBreeds'; // ✅ Use real hook instead of mock data

const BreedsManagement = () => {
  const { data: breeds = [], isLoading } = useBreeds(); // ✅ Fetch real data

  return (
    <div className="container mx-auto py-0">
      <div className="mb-3 border-b p-6">
        <h1 className="text-3xl font-bold text-gray-900">Breeds Management</h1>
        <p className="text-muted-foreground">
          Manage pet breeds and classifications for your store.
        </p>
      </div>

      <BreedDataTable
        columns={breedColumns}
        data={breeds}
        isLoading={isLoading} // ✅ Pass loading state
        className="p-6"
      />
    </div>
  );
};

export default BreedsManagement;
