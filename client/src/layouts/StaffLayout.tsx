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

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

const StaffLayout = () => {
  const location = useLocation();

  // Base breadcrumb configurations
  const baseBreadcrumbs: Record<string, BreadcrumbItem[]> = {
    '/staff': [{ label: 'Dashboard', isCurrentPage: true }],
    '/staff/products': [
      { label: 'Dashboard', href: '/staff' },
      { label: 'Products Management', isCurrentPage: true },
    ],
    '/staff/pets': [
      { label: 'Dashboard', href: '/staff' },
      { label: 'Pets Management', isCurrentPage: true },
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

  const getBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {

    // Handle exact matches first
    if (baseBreadcrumbs[pathname]) {
      return baseBreadcrumbs[pathname];
    }

    // Handle /staff/products/add
    if (pathname === '/staff/products/add') {
      return [
        { label: 'Dashboard', href: '/staff' },
        { label: 'Products Management', href: '/staff/products' },
        { label: 'Add Product', isCurrentPage: true },
      ];
    }

    // Handle /staff/pets/add
    if (pathname === '/staff/pets/add') {
      return [
        { label: 'Dashboard', href: '/staff' },
        { label: 'Pets Management', href: '/staff/pets' },
        { label: 'Add Pet', isCurrentPage: true },
      ];
    }

    // Handle dynamic detail routes: /staff/products/[id]
    const productDetailMatch = pathname.match(/^\/staff\/products\/([^/]+)$/);
    if (productDetailMatch && !pathname.includes('/edit')) {
      return [
        { label: 'Dashboard', href: '/staff' },
        { label: 'Products Management', href: '/staff/products' },
        { label: 'Product Details', isCurrentPage: true },
      ];
    }

    // Handle dynamic detail routes: /staff/pets/[id]
    const petDetailMatch = pathname.match(/^\/staff\/pets\/([^/]+)$/);
    if (petDetailMatch && !pathname.includes('/edit')) {
      return [
        { label: 'Dashboard', href: '/staff' },
        { label: 'Pets Management', href: '/staff/pets' },
        { label: 'Pet Details', isCurrentPage: true },
      ];
    }

    // Handle edit routes: /staff/products/[id]/edit
    const editMatch = pathname.match(
      /^\/staff\/(products|pets|colors|breeds)\/([^/]+)\/edit$/,
    );
    if (editMatch) {
      const resource = editMatch[1];
      const resourceMap = {
        products: { label: 'Products Management', href: '/staff/products' },
        pets: { label: 'Pets Management', href: '/staff/pets' },
        colors: { label: 'Colors Management', href: '/staff/colors' },
        breeds: { label: 'Breeds Management', href: '/staff/breeds' },
      };

      const resourceInfo = resourceMap[resource as keyof typeof resourceMap];
      if (resourceInfo) {
        return [
          { label: 'Dashboard', href: '/staff' },
          resourceInfo,
          { label: 'Edit', isCurrentPage: true },
        ];
      }
    }

    return [{ label: 'Dashboard', href: '/staff' }];
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
