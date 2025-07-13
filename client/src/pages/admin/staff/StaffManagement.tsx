import { useStaff } from '@/hooks/useStaff';
import { StaffDataTable } from './components/StaffDataTable';
import { staffColumns } from './components/StaffColumns';

const StaffManagement = () => {
  // ✅ Use real data from API
  const { data: staffMembers = [], isLoading } = useStaff();

  return (
    <div className="container mx-auto py-0">
      {/* Header */}
      <div className="mb-3 border-b p-6">
        <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
        <p className="text-muted-foreground">
          Manage staff members, their permissions, and access levels.
        </p>
      </div>

      <StaffDataTable
        columns={staffColumns}
        data={staffMembers}
        isLoading={isLoading}
        className="p-6"
      />
    </div>
  );
};

export default StaffManagement;
