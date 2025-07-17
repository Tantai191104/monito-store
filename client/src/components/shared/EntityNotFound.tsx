import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

interface EntityNotFoundProps {
  entityName: string;
  backToUrl: string;
  backToUrlText: string;
}

export const EntityNotFound = ({
  entityName,
  backToUrl,
  backToUrlText,
}: EntityNotFoundProps) => {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center text-center">
      <SearchX className="h-24 w-24 text-gray-300" />
      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        {entityName} Not Found
      </h1>
      <p className="mt-2 text-gray-700">
        We couldn't find the {entityName} you were looking for.
      </p>
      <Link to={backToUrl}>
        <Button className="mt-4">
          {backToUrlText}
        </Button>
      </Link>
    </div>
  );
};
