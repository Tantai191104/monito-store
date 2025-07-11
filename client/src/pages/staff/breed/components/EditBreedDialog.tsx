import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Edit, Loader2 } from 'lucide-react';

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
import { Checkbox } from '@/components/ui/checkbox';
import { useUpdateBreed } from '@/hooks/useBreeds';
import type { Breed } from '@/types/breed';

// ✅ Schema validation for breed editing
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
  isActive: z.boolean(),
});

type BreedFormValues = z.infer<typeof breedSchema>;

interface EditBreedDialogProps {
  breed: Breed;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditBreedDialog({
  breed,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: EditBreedDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const updateBreed = useUpdateBreed();

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const form = useForm<BreedFormValues>({
    resolver: zodResolver(breedSchema),
    defaultValues: {
      name: breed.name,
      description: breed.description || '',
      isActive: breed.isActive ?? true,
    },
  });

  // Reset form when dialog opens with new breed data
  useEffect(() => {
    if (open) {
      form.reset({
        name: breed.name,
        description: breed.description || '',
        isActive: breed.isActive ?? true,
      });
    }
  }, [breed, form, open]);

  const onSubmit = async (data: BreedFormValues) => {
    try {
      await updateBreed.mutateAsync({
        id: breed._id,
        data: {
          name: data.name,
          description: data.description || undefined,
          isActive: data.isActive,
        },
      });
      setOpen(false);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const handleCancel = () => {
    form.reset(); // Reset form on cancel
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Only render trigger if provided */}
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit Breed
          </DialogTitle>
          <DialogDescription>
            Update breed information and settings. Changes will apply to all
            pets using this breed.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Breed Information Section */}
            <div className="space-y-4">
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

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active Breed</FormLabel>
                      <FormDescription>
                        Inactive breeds won't appear in pet creation forms
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={updateBreed.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateBreed.isPending}>
                {updateBreed.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Update Breed
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
