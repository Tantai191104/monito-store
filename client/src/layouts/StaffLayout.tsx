/**
 * Node modules
 */
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

/**
 * Components
 */
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import StaffSidebar from './components/StaffSidebar';

/**
 * Hooks
 */

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

const StaffLayout = () => {
  const location = useLocation();

  // Define breadcrumb mapping - simple and clear
  const getBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
    const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
      '/staff': [{ label: 'Dashboard', isCurrentPage: true }],
      '/staff/products': [
        { label: 'Dashboard', href: '/staff' },
        { label: 'Products Management', isCurrentPage: true },
      ],
      '/staff/products/add': [
        { label: 'Dashboard', href: '/staff' },
        { label: 'Products Management', href: '/staff/products' },
        { label: 'Add Product', isCurrentPage: true },
      ],
      '/staff/pets': [
        { label: 'Dashboard', href: '/staff' },
        { label: 'Pets Management', isCurrentPage: true },
      ],
      '/staff/pets/add': [
        { label: 'Dashboard', href: '/staff' },
        { label: 'Pets Management', href: '/staff/pets' },
        { label: 'Add Pet', isCurrentPage: true },
      ],
      '/staff/colors': [
        { label: 'Dashboard', href: '/staff' },
        { label: 'Colors Management', isCurrentPage: true },
      ],
      '/staff/breeds': [
        { label: 'Dashboard', href: '/staff' },
        { label: 'Breeds Management', isCurrentPage: true },
      ],
      '/staff/categories': [
        { label: 'Dashboard', href: '/staff' },
        { label: 'Categories Management', isCurrentPage: true },
      ],
    };

    // Handle dynamic routes (edit pages)
    if (pathname.includes('/edit')) {
      const basePath = pathname.replace(/\/[^/]+\/edit$/, '');
      const baseItems = breadcrumbMap[basePath] || [];
      return [
        ...baseItems.map((item) => ({ ...item, isCurrentPage: false })),
        { label: 'Edit', isCurrentPage: true },
      ];
    }

    // Handle dynamic routes (view details)
    if (
      pathname.match(/\/staff\/(products|pets|colors|breeds)\/[^/]+$/) &&
      !pathname.includes('/add')
    ) {
      const basePath = pathname.replace(/\/[^/]+$/, '');
      const baseItems = breadcrumbMap[basePath] || [];
      return [
        ...baseItems.map((item) => ({ ...item, isCurrentPage: false })),
        { label: 'Details', isCurrentPage: true },
      ];
    }

    return breadcrumbMap[pathname] || [{ label: 'Dashboard', href: '/staff' }];
  };

  const breadcrumbItems = getBreadcrumbItems(location.pathname);

  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white shadow-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="" />
            <Separator orientation="vertical" className="mr-2 !h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                  <React.Fragment key={item.href || item.label}>
                    {index > 0 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                    <BreadcrumbItem className="hidden md:block">
                      {item.isCurrentPage ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={item.href!}>{item.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-white">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default StaffLayout;
