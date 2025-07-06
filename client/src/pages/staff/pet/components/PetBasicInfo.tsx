// client/src/pages/staff/pet/components/PetBasicInfo.tsx
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Package } from 'lucide-react';
import { useActiveBreeds } from '@/hooks/useBreeds';
import { useActiveColors } from '@/hooks/useColors';
import type { Control } from 'react-hook-form';
import type { AddPetFormValues } from '../AddPet';

interface PetBasicInfoProps {
  control: Control<AddPetFormValues>;
}

const PetBasicInfo = ({ control }: PetBasicInfoProps) => {
  const { data: breeds = [] } = useActiveBreeds();
  const { data: colors = [] } = useActiveColors();

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="h-5 w-5 text-blue-600" />
          Pet Information
        </CardTitle>
        <CardDescription>
          Enter the basic details about your pet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pet Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Max, Bella" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breed *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select breed" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {breeds.map((breed) => (
                      <SelectItem key={breed._id} value={breed._id}>
                        {breed.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color._id} value={color._id}>
                        <div className="flex items-center space-x-2">
                          <div
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: color.hexCode }}
                          />
                          <span>{color.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormField
            control={control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 2 months, 1 year" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Small">Small</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Large">Large</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (VND) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Ho Chi Minh City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the pet's personality, special features..."
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default PetBasicInfo;
