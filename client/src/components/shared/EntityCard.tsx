// client/src/components/shared/EntityCard.tsx
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ReactNode } from 'react';

interface EntityCardProps {
  href: string;
  image: string;
  imageAlt: string;
  title: string;
  subtitle?: ReactNode;
  price?: string;
  extraContent?: ReactNode;
  className?: string;
  onImageError?: () => void;
}

const EntityCard = ({
  href,
  image,
  imageAlt,
  title,
  subtitle,
  price,
  extraContent,
  className = '',
  onImageError,
}: EntityCardProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src =
      'https://via.placeholder.com/300x300?text=No+Image';
    onImageError?.();
  };

  return (
    <Link to={href} className={`block h-full ${className}`}>
      <Card className="flex h-full flex-col overflow-hidden rounded-lg p-2 shadow-sm transition-shadow hover:shadow-lg">
        <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-100">
          <img
            src={image}
            alt={imageAlt}
            className="h-full w-full object-cover"
            onError={handleImageError}
          />
        </div>
        <CardContent className="flex flex-1 flex-col px-2 pb-2">
          <CardTitle className="mb-2 truncate text-base font-bold text-[#003459]">
            {title}
          </CardTitle>
          {subtitle && (
            <CardDescription className="mb-2 space-y-1 text-xs">
              {subtitle}
            </CardDescription>
          )}
          {price && (
            <div className="mb-2 text-sm font-bold text-black">{price}</div>
          )}
          {extraContent}
        </CardContent>
      </Card>
    </Link>
  );
};

EntityCard.Skeleton = function EntityCardSkeleton({
  className = '',
}: {
  className?: string;
}) {
  return (
    <Card className={`overflow-hidden rounded-lg p-2 shadow-sm ${className}`}>
      <Skeleton className="aspect-square w-full rounded-md" />
      <CardContent className="px-2 pt-4 pb-2">
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="h-5 w-1/3" />
      </CardContent>
    </Card>
  );
};

export default EntityCard;
