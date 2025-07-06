// client/src/pages/staff/pet/components/PetImageUpload.tsx
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
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { Control, UseFormWatch } from 'react-hook-form';
import type { AddPetFormValues } from '../AddPet';

interface PetImageUploadProps {
  control: Control<AddPetFormValues>;
  watch: UseFormWatch<AddPetFormValues>;
}

const PetImageUpload = ({ control, watch }: PetImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const images = watch('images');

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

      // Convert files to URLs for preview
      const newImageUrls: string[] = [];
      imageFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImageUrls.push(e.target.result as string);
            if (newImageUrls.length === imageFiles.length) {
              const allImages = [...images, ...newImageUrls].slice(0, 5);
              control._formValues.images = allImages;
              setImagePreviews(allImages);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [images, control],
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
    control._formValues.images = newImages;
    setImagePreviews(newPreviews);
  };

  return (
    <Card className="!rounded-sm shadow-none">
      <CardHeader>
        <CardTitle>Pet Images</CardTitle>
        <CardDescription>
          Add up to 5 high-quality images. The first image will be the main pet
          image.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drag & Drop Area */}
        <div
          className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
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
            <p className="text-lg font-medium">Drag & drop pet images here</p>
            <p className="text-muted-foreground text-xs">
              PNG, JPG up to 10MB each (max 5 images)
            </p>
          </div>
        </div>

        {/* Image Previews */}
        {(imagePreviews.length > 0 || images.length > 0) && (
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
              <Package className="h-4 w-4" />
              Image Previews ({Math.max(imagePreviews.length, images.length)}/5)
            </h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {(imagePreviews.length > 0 ? imagePreviews : images).map(
                (url, index) => (
                  <div key={index} className="group relative">
                    <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
                      <img
                        src={url}
                        alt={`Pet ${index + 1}`}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/300x300?text=Invalid+URL';
                        }}
                      />
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
                      <Badge className="absolute bottom-2 left-2 bg-blue-600 text-xs">
                        Main
                      </Badge>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {images.length === 0 && imagePreviews.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              At least one image is required for the pet listing
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PetImageUpload;
