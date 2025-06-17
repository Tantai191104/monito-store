/**
 * Node modules
 */
import { useEffect, useState } from 'react';

/**
 * Libs
 */
import { cn } from '@/lib/utils';

const LoadingScreen = ({ className }: { className?: string }) => {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div
      className={cn(
        'relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 to-blue-150',
        className,
      )}
    >
      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute h-1 w-1 animate-ping rounded-full bg-blue-400 opacity-60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: '3s',
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center">
        <div className="relative mb-8">
          {/* Central Orb */}
          <div className="mx-auto h-20 w-20 animate-pulse rounded-full bg-gradient-to-br from-blue-400 to-blue-500" />

          {/* Orbiting Elements */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute h-3 w-3 animate-spin rounded-full bg-blue-300"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '0 0',
                transform: `rotate(${i * 120}deg) translateX(40px) translateY(-6px)`,
                animationDuration: '2s',
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        <h2 className="mb-2 text-xl font-semibold text-gray-700">
          Connecting...
        </h2>
        <p className="text-gray-500">Establishing secure connection</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
