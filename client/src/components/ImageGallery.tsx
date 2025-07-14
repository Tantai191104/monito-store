import { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  name: string;
}

const ImageGallery = ({ images, name }: ImageGalleryProps) => {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gray-100">
        <p className="text-gray-500">No Image</p>
      </div>
    );
  }

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const nextModalImage = () => {
    setModalImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevModalImage = () => {
    setModalImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  };

  return (
    <div>
      {/* Main Image */}
      <div className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg">
        <img
          src={images[mainImageIndex]}
          alt={`${name} - image ${mainImageIndex + 1}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onClick={() => openModal(mainImageIndex)}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/30 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/50"
          onClick={() => openModal(mainImageIndex)}
          title="View full screen"
        >
          <Expand className="h-4 w-4" />
        </Button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={cn(
                'aspect-square cursor-pointer overflow-hidden rounded-md border-2 transition-all',
                mainImageIndex === index
                  ? 'border-blue-500'
                  : 'border-transparent hover:border-blue-300',
              )}
              onClick={() => setMainImageIndex(index)}
            >
              <img
                src={image}
                alt={`${name} - thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Full Screen Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0">
          <DialogHeader className="absolute top-2 right-2 z-10">
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="relative flex h-[80vh] items-center justify-center bg-black">
            <img
              src={images[modalImageIndex]}
              alt={`${name} - full view ${modalImageIndex + 1}`}
              className="h-full w-full object-contain"
            />
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50"
                  onClick={prevModalImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50"
                  onClick={nextModalImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageGallery;
