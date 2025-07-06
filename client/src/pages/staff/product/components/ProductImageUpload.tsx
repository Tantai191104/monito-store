// client/src/pages/staff/product/components/ProductImageUpload.tsx
import { useState, useCallback } from 'react';
import { Upload, Package, X, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProductImageUploadProps {
  images: File[];
  imagePreviews: string[];
  onImagesChange: (images: File[], previews: string[]) => void;
}

const ProductImageUpload = ({
  images,
  imagePreviews,
  onImagesChange,
}: ProductImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const imageFiles = fileArray.filter((file) =>
        file.type.startsWith('image/'),
      );

      if (imageFiles.length === 0) {
        alert('Please select valid image files');
        return;
      }

      const newImages = [...images, ...imageFiles].slice(0, 5);
      const newPreviews: string[] = [];

      newImages.forEach((file, index) => {
        if (index < imagePreviews.length) {
          newPreviews.push(imagePreviews[index]);
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            const updatedPreviews = [...newPreviews];
            updatedPreviews[index] = e.target?.result as string;
            onImagesChange(newImages, updatedPreviews);
          };
          reader.readAsDataURL(file);
          newPreviews.push('');
        }
      });
    },
    [images, imagePreviews, onImagesChange],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    onImagesChange(newImages, newPreviews);
  };

  return (
    <Card className="!rounded-sm shadow-none">
      <CardHeader>
        <CardTitle>Images</CardTitle>
        <CardDescription>
          Add up to 5 images. First image will be the main image.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <Upload className="text-muted-foreground mx-auto h-12 w-12" />
          <div className="mt-4">
            <p className="text-sm font-medium">
              Drag images here or click to browse
            </p>
            <p className="text-muted-foreground text-xs">
              PNG, JPG up to 10MB each
            </p>
          </div>
        </div>

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="group relative">
                <div className="bg-muted aspect-square overflow-hidden rounded-lg border">
                  {preview ? (
                    <img
                      src={preview}
                      alt={`Product ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="text-muted-foreground h-8 w-8" />
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                {index === 0 && (
                  <Badge className="absolute bottom-2 left-2 text-xs">
                    Main
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>At least one image is required</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductImageUpload;
