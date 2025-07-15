import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateBreed, useBreeds } from '@/hooks/useBreeds';

// ✅ Schema validation for breed
const breedSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Breed name is required')
    .max(50, 'Breed name must be less than 50 characters'),
  description: z
    .string()
    .trim()
    .max(200, 'Description must be less than 200 characters')
    .optional()
    .or(z.literal('')),
});

type BreedFormValues = z.infer<typeof breedSchema>;

interface AddBreedDialogProps {
  trigger?: React.ReactNode;
}

export function AddBreedDialog({ trigger }: AddBreedDialogProps) {
  const [open, setOpen] = useState(false);
  const createBreed = useCreateBreed();
  const { data: breeds = [] } = useBreeds();
  const [nameError, setNameError] = useState<string | null>(null);

  const form = useForm<BreedFormValues>({
    resolver: zodResolver(breedSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: BreedFormValues) => {
    // Kiểm tra trùng lặp tên breed (không phân biệt hoa/thường, loại bỏ khoảng trắng)
    const isNameDuplicate = breeds.some(
      (breed) => breed.name.trim().toLowerCase() === data.name.trim().toLowerCase()
    );
    if (isNameDuplicate) {
      setNameError('This breed name already exists.');
      return;
    } else {
      setNameError(null);
    }
    try {
      await createBreed.mutateAsync({
        name: data.name,
        description: data.description || undefined,
      });
      form.reset();
      setOpen(false);
    } catch {
      // Error is handled in the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Breed
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Breed</DialogTitle>
          <DialogDescription>
            Create a new pet breed. Breeds help categorize pets by their
            specific type.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breed Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Golden Retriever, Persian Cat"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a descriptive name for your breed
                  </FormDescription>
                  <FormMessage />
                  {nameError && (
                    <div className="text-sm text-red-600 mt-1">{nameError}</div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of this breed characteristics..."
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description to help staff understand this breed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createBreed.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createBreed.isPending}>
                {createBreed.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Breed'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
