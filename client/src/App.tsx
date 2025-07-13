/**
 * Node modules
 */
import { BrowserRouter } from 'react-router-dom';

/**
 * Routes
 */
import AppRoutes from '@/routers/AppRoutes';

/**
 * Providers
 */
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CartProvider } from '@/contexts/CartContext';

/**
 * Components
 */
import { Toaster } from '@/components/ui/sonner';
import ErrorBoundary from '@/components/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <BrowserRouter>
          <ThemeProvider>
            <CartProvider>
              <AppRoutes />
              <Toaster richColors />
            </CartProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryProvider>
    </ErrorBoundary>
  );
};

export default App;
