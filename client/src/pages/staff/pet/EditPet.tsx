import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Save,
  ArrowLeft,
  Package,
  ImageIcon,
  Info,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Skeleton } from '@/components/ui/skeleton';
import { usePet, useUpdatePet } from '@/hooks/usePets';
import { useActiveBreeds } from '@/hooks/useBreeds';
import { useActiveColors } from '@/hooks/useColors';

const editPetSchema = z.object({
  name: z.string().min(1, 'Pet name is required').max(100),
  breed: z.string().min(1, 'Breed is required'),
  gender: z.enum(['Male', 'Female']),
  age: z.string().min(1, 'Age is required'),
  size: z.enum(['Small', 'Medium', 'Large']),
  color: z.string().min(1, 'Color is required'),
  price: z.number().min(0, 'Price must be positive'),
  images: z
    .array(z.string().url('Must be a valid URL'))
    .min(1, 'At least one image is required'),
  description: z.string().optional(),
  isVaccinated: z.boolean(),
  isDewormed: z.boolean(),
  hasCert: z.boolean(),
  hasMicrochip: z.boolean(),
  location: z.string().min(1, 'Location is required'),
  additionalInfo: z.string().optional(),
  isAvailable: z.boolean(),
});

type EditPetFormValues = z.infer<typeof editPetSchema>;

const EditPet = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const updatePet = useUpdatePet();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get pet data and form options
  const { data: pet, isLoading: petLoading, error: petError } = usePet(id!);
  const { data: breeds = [] } = useActiveBreeds();
  const { data: colors = [] } = useActiveColors();

  const form = useForm<EditPetFormValues>({
    resolver: zodResolver(editPetSchema),
    defaultValues: {
      name: '',
      breed: '',
      gender: 'Male',
      age: '',
      size: 'Small',
      color: '',
      price: 0,
      images: [],
      description: '',
      isVaccinated: false,
      isDewormed: false,
      hasCert: false,
      hasMicrochip: false,
      location: '',
      additionalInfo: '',
      isAvailable: true,
    },
  });

  // Reset form when pet data loads
  useEffect(() => {
    if (pet) {
      form.reset({
        name: pet.name,
        breed: typeof pet.breed === 'object' ? pet.breed._id : pet.breed,
        gender: pet.gender,
        age: pet.age,
        size: pet.size,
        color: typeof pet.color === 'object' ? pet.color._id : pet.color,
        price: pet.price,
        images: pet.images,
        description: pet.description || '',
        isVaccinated: pet.isVaccinated,
        isDewormed: pet.isDewormed,
        hasCert: pet.hasCert,
        hasMicrochip: pet.hasMicrochip,
        location: pet.location,
        additionalInfo: pet.additionalInfo || '',
        isAvailable: pet.isAvailable,
      });
    }
  }, [pet, form]);

  const onSubmit = async (data: EditPetFormValues) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await updatePet.mutateAsync({ id, data });
      navigate('/staff/pets');
    } catch (error: unknown) {
      console.error('Failed to update pet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/staff/pets');
  };

  // Loading state
  if (petLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="mx-auto max-w-7xl p-6">
          <div className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (petError || !pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="mx-auto max-w-7xl p-6">
          <div className="py-12 text-center">
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Pet Not Found
            </h2>
            <p className="mb-4 text-gray-600">
              The pet you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate('/staff/pets')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Pets
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Pets
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Pet</h1>
                <p className="text-sm text-gray-500">
                  Update {pet.name}'s information
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-blue-600 shadow-md hover:bg-blue-700"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Pet...
                  </>
                ) : (
                  'Update Pet'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Pet Information */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                  Pet Information
                </CardTitle>
                <CardDescription>
                  Update the basic details about your pet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
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
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Breed *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
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
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
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
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
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
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 2 months, 1 year"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
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
                    control={form.control}
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
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Ho Chi Minh City"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
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

            {/* Pet Images */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ImageIcon className="h-5 w-5 text-green-600" />
                  Pet Images
                </CardTitle>
                <CardDescription>
                  Update high-quality images. The first image will be the main
                  pet image.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URLs *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter image URLs, one per line"
                          value={field.value.join('\n')}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value.split('\n').filter(Boolean),
                            )
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
                {form.watch('images').length > 0 && (
                  <div>
                    <h4 className="mb-3 text-sm font-medium">Image Previews</h4>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                      {form.watch('images').map((url, index) => (
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

            {/* Pet Health & Specifications */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="h-5 w-5 text-purple-600" />
                  Health & Specifications
                </CardTitle>
                <CardDescription>
                  Update health records and availability status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <FormField
                    control={form.control}
                    name="isVaccinated"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Vaccinated</FormLabel>
                          <FormDescription className="text-xs">
                            Has received vaccinations
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isDewormed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Dewormed</FormLabel>
                          <FormDescription className="text-xs">
                            Has been dewormed
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasCert"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Certificate</FormLabel>
                          <FormDescription className="text-xs">
                            Has health certificate
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasMicrochip"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Microchip</FormLabel>
                          <FormDescription className="text-xs">
                            Has microchip implanted
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isAvailable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Available for Sale</FormLabel>
                        <FormDescription>
                          Check if this pet is currently available for purchase
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any additional notes about the pet..."
                          className="min-h-[80px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditPet;
