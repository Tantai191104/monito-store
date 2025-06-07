import { Outlet } from 'react-router-dom';

/**
 * Components
 */
import { Header } from './components/base/Header';
import { Footer } from './components/base/Footer';

const BaseLayout = () => {
  return (
    <div className="subpixel-antialiased">
      <Header />
      <main className="">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default BaseLayout;
