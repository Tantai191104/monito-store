import StaffSidebar from './components/StaffSidebar';
import { Outlet } from 'react-router-dom';

const StaffLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <StaffSidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;
