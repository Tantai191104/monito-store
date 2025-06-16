import { Link, useLocation } from 'react-router-dom';
import {
  Package,
  Heart,
  Palette,
  Grid3X3,
  Dog,
  ShoppingCart,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';

const StaffSidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/staff', icon: LayoutDashboard },
    { name: 'Products', href: '/staff/products', icon: Package },
    { name: 'Pets', href: '/staff/pets', icon: Heart },
    { name: 'Orders', href: '/staff/orders', icon: ShoppingCart },
    { name: 'Categories', href: '/staff/categories', icon: Grid3X3 },
    { name: 'Colors', href: '/staff/colors', icon: Palette },
    { name: 'Breeds', href: '/staff/breeds', icon: Dog },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">Staff Portal</h1>
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
                    ? 'bg-blue-100 text-blue-700'
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
        <button className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default StaffSidebar;
