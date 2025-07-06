/**
 * Node modules
 */
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
import AdminSidebar from './components/AdminSidebar';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

const AdminLayout = () => {
  const location = useLocation();

  const getBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
    const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
      '/admin': [{ label: 'Admin Dashboard', isCurrentPage: true }],
      '/admin/users': [
        { label: 'Admin Dashboard', href: '/admin' },
        { label: 'User Management', isCurrentPage: true },
      ],
      '/admin/staff': [
        { label: 'Admin Dashboard', href: '/admin' },
        { label: 'Staff Management', isCurrentPage: true },
      ],
      '/admin/settings': [
        { label: 'Admin Dashboard', href: '/admin' },
        { label: 'Settings', isCurrentPage: true },
      ],
      '/admin/analytics': [
        { label: 'Admin Dashboard', href: '/admin' },
        { label: 'Analytics', isCurrentPage: true },
      ],
    };

    return (
      breadcrumbMap[pathname] || [{ label: 'Admin Dashboard', href: '/admin' }]
    );
  };

  const breadcrumbItems = getBreadcrumbItems(location.pathname);

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white shadow-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger />
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
        <main className="flex-1 overflow-y-auto bg-white p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
