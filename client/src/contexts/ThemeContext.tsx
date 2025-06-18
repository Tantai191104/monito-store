import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

type Theme = 'customer' | 'staff' | 'admin';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [theme, setTheme] = React.useState<Theme>('customer');

  useEffect(() => {
    if (user?.role) {
      setTheme(user.role as Theme);
    }
  }, [user?.role]);

  useEffect(() => {
    // Remove existing theme classes
    document.documentElement.classList.remove(
      'theme-customer',
      'theme-staff',
      'theme-admin',
    );

    // Add current theme class
    if (theme !== 'customer') {
      document.documentElement.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
