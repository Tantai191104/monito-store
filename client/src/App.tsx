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

const App = () => {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryProvider>
  );
};

export default App;
