// client/src/pages/staff/pet/components/PetImageUpload.tsx
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ImageIcon } from 'lucide-react';
import type { Control, UseFormWatch } from 'react-hook-form';
import type { AddPetFormValues } from '../AddPet';

interface PetImageUploadProps {
  control: Control<AddPetFormValues>;
  watch: UseFormWatch<AddPetFormValues>;
}

const PetImageUpload = ({ control, watch }: PetImageUploadProps) => {
  const images = watch('images');

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ImageIcon className="h-5 w-5 text-green-600" />
          Pet Images
        </CardTitle>
        <CardDescription>
          Add high-quality images. The first image will be the main pet image.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URLs *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter image URLs, one per line"
                  value={field.value.join('\n')}
                  onChange={(e) =>
                    field.onChange(e.target.value.split('\n').filter(Boolean))
                  }
                  className="min-h-[120px] resize-none"
                />
              </FormControl>
              <FormDescription>
                Enter each image URL on a new line
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Previews */}
        {images.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-medium">Image Previews</h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {images.map((url, index) => (
                <div key={index} className="group relative">
                  <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100">
                    <img
                      src={url}
                      alt={`Pet ${index + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/300x300?text=Invalid+URL';
                      }}
                    />
                  </div>
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2 rounded-full bg-blue-600 px-2 py-1 text-xs text-white">
                      Main
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PetImageUpload;
