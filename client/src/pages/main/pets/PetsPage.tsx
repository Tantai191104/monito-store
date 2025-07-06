import { useSearchParams } from 'react-router-dom';
import PetFilters from './components/PetFilters';
import PetGrid from './components/PetGrid';
import PetBanner from './components/PetBanner';

const PetsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="bg-[#FDFDFD]">
      <div className="container mx-auto py-8">
        {/* Pet Banner */}
        <PetBanner />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <PetFilters
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </aside>
          <main className="lg:col-span-3">
            <PetGrid
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default PetsPage;
