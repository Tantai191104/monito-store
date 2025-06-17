import { useState } from 'react';
import { PetDataTable } from './components/PetDataTable';
import { petColumns } from './components/PetColumns';
import { mockPets } from '@/data/mockPets';

const PetsManagement = () => {
  const [data] = useState(mockPets);

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
        data={data}
        className="rounded-lg bg-white p-6 shadow"
      />
    </div>
  );
};

export default PetsManagement;
