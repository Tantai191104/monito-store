import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Users,
  UserPlus,
  Settings,
  Shield,
  LogOut,
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Staff Management', href: '/admin/staff', icon: UserPlus },
    { name: 'System Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="w-64 border-r border-red-200 bg-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-red-600" />
          <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group mb-1 flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="absolute bottom-0 w-64 p-4">
        <Link
          to="/staff"
          className="mb-2 flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <Users className="mr-3 h-5 w-5" />
          Switch to Staff
        </Link>
        <button className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
