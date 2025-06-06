import LogoPrimaryColor from '@/assets/monito-logo-primary-color.svg';
import { cn } from '@/lib/utils';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'flex w-fit flex-col items-center justify-center gap-1',
        className,
      )}
    >
      <img src={LogoPrimaryColor} alt="Logo" />
      <span className="text-primary text-xs font-semibold">Pets for Best</span>
    </div>
  );
};
