import { Link, useLocation } from 'react-router-dom';
import {
  Package,
  Heart,
  ShoppingCart,
  Grid3X3,
  Palette,
  Dog,
  Users,
  BarChart3,
  ChevronUp,
  User2,
  LogOut,
} from 'lucide-react';

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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const StaffSidebar = () => {
  const location = useLocation();

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
    <Sidebar collapsible="icon" className="border-r">
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
                    <AvatarImage src="/avatars/staff-avatar.png" alt="Staff" />
                    <AvatarFallback className="rounded-lg bg-blue-100 text-blue-600">
                      ST
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Staff Member</span>
                    <span className="text-muted-foreground truncate text-xs">
                      staff@monito.com
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
                <DropdownMenuItem>
                  <User2 className="mr-2 size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
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
