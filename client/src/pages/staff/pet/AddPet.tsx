import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useCreatePet } from '@/hooks/usePets';

// Import components
import PetBasicInfo from './components/PetBasicInfo';
import PetImageUpload from './components/PetImageUpload';
import PetHealthInfo from './components/PetHealthInfo';

const addPetSchema = z.object({
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

export type AddPetFormValues = z.infer<typeof addPetSchema>;

const AddPet = () => {
  const navigate = useNavigate();
  const createPet = useCreatePet();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddPetFormValues>({
    resolver: zodResolver(addPetSchema),
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

  const onSubmit = async (data: AddPetFormValues) => {
    setIsSubmitting(true);
    try {
      await createPet.mutateAsync(data);
      navigate('/staff/pets');
    } catch (error: any) {
      console.error('Failed to add pet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/staff/pets');
  };

  return (
    <div className="container mx-auto py-0">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between border-b p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Pet</h1>
          <p className="text-muted-foreground">
            Create a new pet listing for your store
          </p>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Adding Pet...' : 'Add Pet'}
        </Button>
      </div>

      {/* Content */}
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Pet Basic Information */}
            <PetBasicInfo control={form.control} />

            {/* Pet Images */}
            <PetImageUpload control={form.control} watch={form.watch} />

            {/* Pet Health & Specifications */}
            <PetHealthInfo control={form.control} />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddPet;
