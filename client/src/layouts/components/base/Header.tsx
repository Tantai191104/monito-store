import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  LogOut,
  Settings,
  Package,
  Search as SearchIcon,
  Menu,
} from 'lucide-react';

/**
 * Components
 */
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#FCEED5] to-[#FFE7BA] shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden items-center space-x-6 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'font-semibold text-[#003459] transition-colors hover:text-[#003459]/80',
                location.pathname === link.href ? 'underline underline-offset-4' : ''
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden items-center space-x-4 sm:flex">
          <div className="flex items-center rounded-md bg-white px-3">
            <SearchIcon className="text-muted-foreground size-5" />
            <Input
              className="placeholder:text-muted-foreground/50 border-none bg-transparent shadow-none ring-0 focus-visible:border-0 focus-visible:ring-0"
              placeholder="Search something here!"
            />
          </div>

          {isAuthenticated && user?.role === 'customer' ? (
            <>
              {/* Cart */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:!bg-primary/5"
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

              {/* Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
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
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
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
                  <DropdownMenuItem asChild>
                    <Link to="/customer/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
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
            <Button className="bg-[#003459] text-white hover:bg-[#003459]/90" asChild>
              <Link to="/login">Join the community</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="text-[#003459]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] max-w-sm bg-[#FCEED5]">
              <div className="mb-6 mt-4">
                <Logo />
              </div>
              <nav className="flex flex-col space-y-4 mb-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'text-lg font-semibold text-[#003459]',
                      location.pathname === link.href ? 'underline underline-offset-4' : ''
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center rounded-md bg-white px-3 mb-4">
                <SearchIcon className="text-muted-foreground size-5" />
                <Input
                  className="w-full placeholder:text-muted-foreground/50 border-none bg-transparent shadow-none ring-0 focus-visible:border-0 focus-visible:ring-0"
                  placeholder="Search something here!"
                />
              </div>

              {isAuthenticated && user?.role === 'customer' ? (
                <>
                  <Button variant="outline" className="mb-2 w-full" asChild>
                    <Link to="/customer/profile">Profile</Link>
                  </Button>
                  <Button variant="outline" className="mb-2 w-full" asChild>
                    <Link to="/customer/cart">My Cart ({cartState.totalItems})</Link>
                  </Button>
                  <Button variant="outline" className="mb-2 w-full" asChild>
                    <Link to="/customer/orders">My Orders</Link>
                  </Button>
                  <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    Log out
                  </Button>
                </>
              ) : (
                <Button className="w-full bg-[#003459] hover:bg-[#003459]/90" asChild>
                  <Link to="/login">Join the community</Link>
                </Button>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
