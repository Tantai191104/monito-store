import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface Breadcrumb {
  label: string;
  href: string;
  isCurrentPage: boolean;
}

export const useBreadcrumbs = (type: 'staff' | 'admin' = 'staff') => {
  const location = useLocation();

  const breadcrumbs = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const result: Breadcrumb[] = [];

    // Base breadcrumb
    const baseLabel = type === 'staff' ? 'Staff Portal' : 'Admin Portal';
    const basePath = `/${type}`;

    result.push({
      label: baseLabel,
      href: basePath,
      isCurrentPage: location.pathname === basePath,
    });

    // Page mapping
    const staffPages: Record<string, string> = {
      products: 'Products Management',
      pets: 'Pets Management',
      orders: 'Orders Management',
      categories: 'Categories Management',
      colors: 'Colors Management',
      breeds: 'Breeds Management',
    };

    const adminPages: Record<string, string> = {
      users: 'User Management',
      staff: 'Staff Management',
      settings: 'Settings',
      database: 'Database',
      analytics: 'Analytics',
    };

    const pageMap = type === 'staff' ? staffPages : adminPages;

    // Add current page if not dashboard
    if (pathSegments.length > 1) {
      const currentPage = pathSegments[1];
      const pageName = pageMap[currentPage] || currentPage;

      result.push({
        label: pageName,
        href: location.pathname,
        isCurrentPage: true,
      });
    }

    return result;
  }, [location.pathname, type]);

  return breadcrumbs;
};
