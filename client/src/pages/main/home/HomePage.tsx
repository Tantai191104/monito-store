/**
 * Components
 */
import HeroSection from './components/HeroSection';
import PetBanner from './components/PetBanner';
import PetSection from './components/PetSection';
import ProductSection from './components/ProductSection';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Pet section */}
      <PetSection />

      {/* Pet Banner */}
      <PetBanner />

      {/* Product section */}
      <ProductSection />
    </div>
  );
};

export default HomePage;
