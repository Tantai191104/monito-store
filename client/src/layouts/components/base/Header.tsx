/**
 * Node modules
*/
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  LogOut,
  Settings, Package
} from 'lucide-react';
/**
 * Components
 */
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/pets', label: 'Pets' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const Header = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { state: cartState } = useCart();

  const handleLogout = async () => {
    await logout.mutateAsync();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#FCEED5] to-[#FFE7BA]">
      <div className="container mx-auto flex items-center justify-between gap-12 py-4">
        <Logo />
        <nav className="flex flex-1 items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'font-semibold text-[#003459] transition-colors hover:text-[#003459]/80',
                location.pathname === link.href
                  ? 'underline underline-offset-4'
                  : '',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated && user?.role === 'customer' ? (
            <>
              {/* ✅ Shopping Cart - chỉ hiển thị cho customer */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:!bg-primary/5 relative"
                  asChild
                >
                  <Link to="/customer/cart">
                    <ShoppingCart className="!h-5.5 !w-5.5" />
                    {cartState.totalItems > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full p-0 text-xs"
                      >
                        {cartState.totalItems}
                      </Badge>
                    )}
                  </Link>
                </Button>
              </div>
              {/* ✅ Customer Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl || ''} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm leading-none font-medium">
                        {user.name}
                      </p>
                      <p className="text-muted-foreground text-xs leading-none">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* ✅ Profile & Account */}
                  <DropdownMenuItem asChild>
                    <Link to="/customer/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/customer/orders">
                      <Package className="mr-2 h-4 w-4" />
                      <span>My Orders</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            /* ✅ Guest User OR Staff/Admin - Join Community Button */
            <Link to="/login">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Join the community
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
