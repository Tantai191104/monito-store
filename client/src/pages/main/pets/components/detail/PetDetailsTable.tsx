import type { Pet } from '@/types/pet';

const PetDetailsTable = ({ pet }: { pet: Pet }) => {
  const details = [
    { label: 'SKU', value: `#${pet._id.slice(-8).toUpperCase()}` },
    { label: 'Gender', value: pet.gender },
    { label: 'Age', value: pet.age },
    { label: 'Size', value: pet.size },
    { label: 'Color', value: pet.color.name },
    { label: 'Vaccinated', value: pet.isVaccinated ? 'Yes' : 'No' },
    { label: 'Dewormed', value: pet.isDewormed ? 'Yes' : 'No' },
    { label: 'Cert', value: pet.hasCert ? 'Yes' : 'No' },
    { label: 'Microchip', value: pet.hasMicrochip ? 'Yes' : 'No' },
    { label: 'Location', value: pet.location },
    {
      label: 'Published Date',
      value: new Date(pet.createdAt).toLocaleDateString('en-GB'),
    },
    { label: 'Additional Information', value: pet.additionalInfo },
  ];

  return (
    <div className="mt-8 border-t pt-6">
      <div className="space-y-3">
        {details.map(
          (detail) =>
            detail.value && (
              <div key={detail.label} className="flex justify-between text-sm">
                <span className="w-1/3 text-gray-500">{detail.label}</span>
                <span className="w-2/3 font-medium text-gray-800">
                  : {detail.value}
                </span>
              </div>
            ),
        )}
      </div>
    </div>
  );
};

export default PetDetailsTable;
