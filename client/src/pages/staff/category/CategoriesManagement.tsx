import { Package } from 'lucide-react';

import { CategoryDataTable } from './components/CategoryDataTable';
import { categoryColumns } from './components/CategoryColumns';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';

const CategoriesManagement = () => {
  const { data: categories = [], isLoading, error, refetch } = useCategories();

  // Error state only
  if (error) {
    return (
      <div className="container mx-auto py-0">
        <div className="py-12 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            Failed to load categories
          </h3>
          <p className="mb-4 text-gray-600">
            There was an error loading the categories. Please try again.
          </p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-0">
      <div className="mb-3 border-b p-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Categories Management
        </h1>
        <p className="text-muted-foreground">
          Organize your products with categories and manage their availability.
        </p>
      </div>

      <CategoryDataTable
        columns={categoryColumns}
        data={categories}
        isLoading={isLoading}
        className="p-6"
      />
    </div>
  );
};

export default CategoriesManagement;
