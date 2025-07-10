import { Palette } from 'lucide-react';

import { useColors } from '@/hooks/useColors';
import { Button } from '@/components/ui/button';
import { ColorDataTable } from './components/ColorDataTable';
import { colorColumns } from './components/ColorColumns';

const ColorsManagement = () => {
  const { data: colors = [], isLoading, error, refetch } = useColors();

  // Error state only
  if (error) {
    return (
      <div className="container mx-auto py-0">
        <div className="py-12 text-center">
          <Palette className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            Failed to load colors
          </h3>
          <p className="mb-4 text-gray-600">
            There was an error loading the colors. Please try again.
          </p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-0">
      <div className="mb-3 border-b p-6">
        <h1 className="text-3xl font-bold text-gray-900">Colors Management</h1>
        <p className="text-muted-foreground">
          Manage pet colors for classification and identification.
        </p>
      </div>

      <ColorDataTable
        columns={colorColumns}
        data={colors}
        isLoading={isLoading}
        className="p-6"
      />
    </div>
  );
};

export default ColorsManagement;
