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

/**
 * Components
 */
import { Toaster } from '@/components/ui/sonner';

const App = () => {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster richColors />
      </BrowserRouter>
    </QueryProvider>
  );
};

export default App;
