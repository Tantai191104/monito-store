import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { useUpdateCategory, useCategories } from '@/hooks/useCategories';
import type { Category } from '@/types/category';

const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Category name is required')
    .max(50, 'Category name must be less than 50 characters'),
  description: z
    .string()
    .trim()
    .max(200, 'Description must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  isActive: z.boolean(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface EditCategoryDialogProps {
  category: Category;
  trigger?: React.ReactNode;
  open?: boolean; // ✅ Add controlled open prop
  onOpenChange?: (open: boolean) => void; // ✅ Add controlled onOpenChange prop
}

export function EditCategoryDialog({
  category,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: EditCategoryDialogProps) {
  // ✅ Use internal state only if not controlled
  const [internalOpen, setInternalOpen] = useState(false);
  const updateCategory = useUpdateCategory();
  const { data: categories = [] } = useCategories();
  const [nameError, setNameError] = useState<string | null>(null);

  // ✅ Determine if controlled or uncontrolled
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
      description: category.description || '',
      isActive: category.isActive ?? true,
    },
  });

  // Reset form when category changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: category.name,
        description: category.description || '',
        isActive: category.isActive ?? true,
      });
    }
  }, [category, form, open]);

  const onSubmit = async (data: CategoryFormValues) => {
    // Kiểm tra trùng lặp tên category (không phân biệt hoa/thường, loại bỏ khoảng trắng), loại trừ chính category đang sửa
    const isDuplicate = categories.some(
      (cat) => cat._id !== category._id && cat.name.trim().toLowerCase() === data.name.trim().toLowerCase()
    );
    if (isDuplicate) {
      setNameError('This category name already exists.');
      return;
    } else {
      setNameError(null);
    }
    try {
      await updateCategory.mutateAsync({
        id: category._id,
        data: {
          name: data.name,
          description: data.description || undefined,
          isActive: data.isActive,
        },
      });
      setOpen(false);
    } catch {
      // Error is handled in the mutation
    }
  };

  const handleCancel = () => {
    form.reset(); // Reset form on cancel
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* ✅ Only render trigger if provided */}
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update category information and settings.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dog Food, Cat Toys" {...field} />
                  </FormControl>
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
                      placeholder="Brief description of this category..."
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
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
                    <FormLabel>Active Category</FormLabel>
                    <FormDescription>
                      Inactive categories won't appear in product listings
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={updateCategory.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateCategory.isPending}>
                {updateCategory.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Category'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
