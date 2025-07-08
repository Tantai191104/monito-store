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
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

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
  const { data: pet, isLoading: petLoading } = usePet(id!);
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
      toast.success('Pet updated successfully!');
      navigate(`/staff/pets/${id}`);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update pet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/staff/pets/${id}`);
  };

  if (petLoading) {
    return <EditPetSkeleton />;
  }

  if (!pet) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-xl font-semibold">Pet Not Found</h2>
        <p className="text-muted-foreground">
          The pet you're looking for doesn't exist.
        </p>
        <Button onClick={() => navigate('/staff/pets')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Pets
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-0">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between border-b p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Pet</h1>
          <p className="text-muted-foreground">
            Update information for "{pet.name}"
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting || !form.formState.isDirty}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Pet
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="space-y-6 lg:col-span-2">
                {/* Basic Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Update the basic details about your pet.
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
                                        style={{
                                          backgroundColor: color.hexCode,
                                        }}
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

                {/* Images Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pet Images</CardTitle>
                    <CardDescription>
                      Update image URLs. The first image will be the main one.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                              className="min-h-[120px] resize-none font-mono"
                            />
                          </FormControl>
                          <FormDescription>
                            Enter each image URL on a new line.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form.watch('images').length > 0 && (
                      <div className="mt-4">
                        <h4 className="mb-3 text-sm font-medium">
                          Image Previews
                        </h4>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                          {form.watch('images').map((url, index) => (
                            <div
                              key={index}
                              className="group relative aspect-square"
                            >
                              <img
                                src={url}
                                alt={`Pet ${index + 1}`}
                                className="h-full w-full rounded-md border object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://via.placeholder.com/300x300?text=Invalid+URL';
                                }}
                              />
                              {index === 0 && (
                                <Badge className="absolute top-1 left-1">
                                  Main
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Pricing & Details Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Details & Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
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
                              <Input placeholder="e.g., 2 months" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
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
                  </CardContent>
                </Card>

                {/* Health & Status Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Health & Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="isVaccinated"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-y-0 space-x-3 rounded-md border p-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Vaccinated</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isDewormed"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-y-0 space-x-3 rounded-md border p-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Dewormed</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hasCert"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-y-0 space-x-3 rounded-md border p-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Certificate</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hasMicrochip"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-y-0 space-x-3 rounded-md border p-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Microchip</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="isAvailable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Available for Sale</FormLabel>
                            <FormDescription>
                              Uncheck this to mark the pet as sold.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

// Loading skeleton component
const EditPetSkeleton = () => (
  <div className="container mx-auto py-0">
    <div className="mb-3 flex items-start justify-between border-b p-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
    <div className="p-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  </div>
);

export default EditPet;
