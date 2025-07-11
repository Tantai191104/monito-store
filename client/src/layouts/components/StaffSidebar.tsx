import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; // ← import hook
import {
  Package,
  Heart,
  ShoppingCart,
  BarChart3,
  Palette,
  Dog,
  Users,
  ChevronUp,
  User2,
  LogOut,
  Grid3X3,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const StaffSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth(); // ← get user & logout

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  // 🔧 Helper function để check active state
  const isMenuActive = (basePath: string): boolean => {
    const currentPath = location.pathname;

    // Exact match cho dashboard
    if (basePath === '/staff' && currentPath === '/staff') {
      return true;
    }

    // Cho các menu khác, check nếu path bắt đầu với basePath
    if (basePath !== '/staff' && currentPath.startsWith(basePath)) {
      return true;
    }

    return false;
  };

  const navigationGroups = [
    {
      label: 'Dashboard',
      items: [
        {
          name: 'Overview',
          href: '/staff',
          icon: BarChart3,
        },
      ],
    },
    {
      label: 'Management',
      items: [
        {
          name: 'Products',
          href: '/staff/products',
          icon: Package,
        },
        {
          name: 'Pets',
          href: '/staff/pets',
          icon: Heart,
        },
        {
          name: 'Orders',
          href: '/staff/orders',
          icon: ShoppingCart,
        },
      ],
    },
    {
      label: 'Configuration',
      items: [
        {
          name: 'Categories',
          href: '/staff/categories',
          icon: Grid3X3,
        },
        {
          name: 'Colors',
          href: '/staff/colors',
          icon: Palette,
        },
        {
          name: 'Breeds',
          href: '/staff/breeds',
          icon: Dog,
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/staff">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Users className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Staff Portal</span>
                  <span className="text-muted-foreground truncate text-xs">
                    Monito Store
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navigationGroups.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  // 🔧 Sử dụng helper function thay vì exact match
                  const isActive = isMenuActive(item.href);

                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.name}
                      >
                        <Link to={item.href}>
                          <Icon className="size-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user?.avatarUrl || '/avatars/staff-avatar.png'}
                      alt={user?.name || 'Staff'}
                    />
                    <AvatarFallback>{initials || 'ST'}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.name || 'Staff Member'}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user?.email || '—'}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link to="/staff/profile">
                    <User2 className="mr-2 size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => logout.mutate()}
                >
                  <LogOut className="mr-2 size-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default StaffSidebar;
