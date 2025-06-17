import { useState } from 'react';
import { BreedDataTable } from './components/BreedDataTable';
import { breedColumns } from './components/BreedColumns';
import { mockBreeds } from '@/data/mockBreeds';

const BreedsManagement = () => {
  const [data] = useState(mockBreeds);

  return (
    <div className="container mx-auto p-8 py-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Breeds Management</h1>
        <p className="text-muted-foreground">
          Manage pet breeds and classifications for your store.
        </p>
      </div>

      <BreedDataTable
        columns={breedColumns}
        data={data}
        className="rounded-lg bg-white p-6 shadow"
      />
    </div>
  );
};

export default BreedsManagement;
