import { useState } from 'react';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  name: string;
}

const ImageGallery = ({ images, name }: ImageGalleryProps) => {
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
          alt={`${name} - Image ${selectedIndex + 1}`}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://via.placeholder.com/600x600?text=No+Image';
          }}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/80 p-2 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/80 p-2 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute right-3 bottom-3 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>
      {/* Thumbnail navigation - only show if more than 1 image */}
      {images.length > 1 && (
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
                alt={`${name} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/100x100?text=Error';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
