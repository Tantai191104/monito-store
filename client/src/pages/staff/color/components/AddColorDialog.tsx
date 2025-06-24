import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Loader2, Palette, Pipette } from 'lucide-react';
import { SketchPicker, ChromePicker, CompactPicker } from 'react-color';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import { useCreateColor } from '@/hooks/useColors';
import { ColorPicker } from '@/components/ColorPicker';

const colorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Color name is required')
    .max(50, 'Color name must be less than 50 characters'),
  hexCode: z
    .string()
    .trim()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color code')
    .min(1, 'Hex code is required'),
  description: z
    .string()
    .trim()
    .max(200, 'Description must be less than 200 characters')
    .optional()
    .or(z.literal('')),
});

type ColorFormValues = z.infer<typeof colorSchema>;

interface AddColorDialogProps {
  trigger?: React.ReactNode;
}

export function AddColorDialog({ trigger }: AddColorDialogProps) {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState('#6366f1');

  const createColor = useCreateColor();

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      name: '',
      hexCode: '#000000',
      description: '',
    },
  });

  const onSubmit = async (data: ColorFormValues) => {
    try {
      await createColor.mutateAsync({
        name: data.name,
        hexCode: data.hexCode,
        description: data.description || undefined,
      });
      form.reset({
        name: '',
        hexCode: '#000000',
        description: '',
      });
      setOpen(false);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const handleCancel = () => {
    form.reset({
      name: '',
      hexCode: '#000000',
      description: '',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Color
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Add New Color
          </DialogTitle>
          <DialogDescription>
            Create a new color for pet classification. Click on the color
            preview or "Pick" button to open the color picker.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Interactive Hex Input with Color Picker */}

            <ColorPicker color={color} onChange={setColor} />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Golden, Black, White"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a descriptive name for the color
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
                      placeholder="Brief description of this color..."
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description to help identify this color
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={createColor.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createColor.isPending}>
                {createColor.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Palette className="mr-2 h-4 w-4" />
                    Create Color
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
