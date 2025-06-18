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

/**
 * Components
 */
import { Toaster } from '@/components/ui/sonner';

const App = () => {
  return (
    <QueryProvider>
      <BrowserRouter>
        <ThemeProvider>
          <AppRoutes />
          <Toaster richColors />
        </ThemeProvider>
      </BrowserRouter>
    </QueryProvider>
  );
};

export default App;
