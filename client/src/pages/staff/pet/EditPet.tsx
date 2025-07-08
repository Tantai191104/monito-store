import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { usePet, useUpdatePet } from '@/hooks/usePets';

// ✅ FIX: Import các component để tái sử dụng
import PetBasicInfo from './components/PetBasicInfo';
import PetImageUpload from './components/PetImageUpload';
import PetHealthInfo from './components/PetHealthInfo';

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

export type EditPetFormValues = z.infer<typeof editPetSchema>;

const EditPet = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const updatePet = useUpdatePet();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: pet, isLoading: petLoading } = usePet(id!);

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content - 2 columns */}
              <div className="space-y-6 lg:col-span-2">
                <PetBasicInfo control={form.control} />
                <PetImageUpload
                  control={form.control}
                  watch={form.watch}
                  setValue={form.setValue}
                />
              </div>

              {/* Sidebar - 1 column */}
              <div className="space-y-6">
                <PetHealthInfo control={form.control} />
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
        </div>
      </div>
    </div>
  </div>
);

export default EditPet;
