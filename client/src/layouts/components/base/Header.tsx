/**
 * Node modules
 */
import { Link, useLocation } from 'react-router-dom';
import { SearchIcon } from 'lucide-react';

/**
 * Components
 */
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/pets', label: 'Pets' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const Header = () => {
  const location = useLocation();

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
          <div className="flex items-center rounded-md bg-white px-3">
            <SearchIcon className="text-muted-foreground size-5" />
            <Input
              className="placeholder:text-muted-foreground/50 border-none bg-transparent shadow-none ring-0 focus-visible:border-0 focus-visible:ring-0"
              placeholder="Search something here!"
            />
          </div>
          <Button className="bg-[#003459] hover:bg-[#003459]/90">
            Join the community
          </Button>
        </div>
      </div>
    </header>
  );
};
