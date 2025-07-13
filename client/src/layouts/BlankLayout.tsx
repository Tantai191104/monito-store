/**
 * Node modules
 */
import { Outlet } from 'react-router-dom';

/**
 * Components
 */
import { Logo } from '@/components/Logo';

const BlankLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Optional Logo/Brand */}
      <div className="absolute top-12 left-18">
        <Logo className="h-8" />
      </div>
      
      {/* Main Content Area - Centered */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BlankLayout;
