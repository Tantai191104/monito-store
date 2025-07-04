import { useState } from 'react';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';

interface PetImageGalleryProps {
  images: string[];
  petName: string;
}

const PetImageGallery = ({ images, petName }: PetImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gray-100">
        <div className="text-center text-gray-500">
          <Package className="mx-auto h-12 w-12" />
          <p>No images available</p>
        </div>
      </div>
    );
  }

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      <div className="group relative aspect-square w-full overflow-hidden rounded-lg">
        <img
          src={images[selectedIndex]}
          alt={`${petName} - Image ${selectedIndex + 1}`}
          className="h-full w-full object-cover"
        />
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/50 p-2 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/50 p-2 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`aspect-square overflow-hidden rounded-md border-2 transition-colors ${
              index === selectedIndex
                ? 'border-blue-500'
                : 'border-transparent hover:border-gray-300'
            }`}
          >
            <img
              src={image}
              alt={`${petName} thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PetImageGallery;
