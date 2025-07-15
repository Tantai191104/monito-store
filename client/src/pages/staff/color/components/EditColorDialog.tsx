import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Edit, Loader2, Palette } from 'lucide-react';

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
import { Checkbox } from '@/components/ui/checkbox';
import { useUpdateColor, useColors } from '@/hooks/useColors';
import type { Color } from '@/types/color';
import {
  ColorPicker,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from '@/components/ColorPicker';

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
  isActive: z.boolean(),
});

type ColorFormValues = z.infer<typeof colorSchema>;

interface EditColorDialogProps {
  color: Color;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditColorDialog({
  color,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: EditColorDialogProps) {
  // Use internal state only if not controlled
  const [internalOpen, setInternalOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const updateColor = useUpdateColor();
  const { data: colors = [] } = useColors();
  const [hexCodeError, setHexCodeError] = useState<string | null>(null);

  // Determine if controlled or uncontrolled
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      name: color.name,
      hexCode: color.hexCode,
      description: color.description || '',
      isActive: color.isActive ?? true,
    },
  });

  const watchedHexCode = form.watch('hexCode');

  // Reset form when color changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: color.name,
        hexCode: color.hexCode,
        description: color.description || '',
        isActive: color.isActive ?? true,
      });
    }
  }, [color, form, open]);

  const onSubmit = async (data: ColorFormValues) => {
    const isDuplicate = colors.some(
      (c) => c._id !== color._id && c.hexCode.toLowerCase() === data.hexCode.trim().toLowerCase()
    );
    if (isDuplicate) {
      setHexCodeError('This hex code already exists.');
      return;
    } else {
      setHexCodeError(null);
    }
    try {
      await updateColor.mutateAsync({
        id: color._id,
        data: {
          name: data.name,
          hexCode: data.hexCode,
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
      {/* Only render trigger if provided */}
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Color
          </DialogTitle>
          <DialogDescription>
            Update color information and settings. Use the color picker for
            precise color selection.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* ✅ Color Picker with Popover - Same as AddColorDialog */}
            <FormField
              control={form.control}
              name="hexCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      {/* ✅ Color Preview Button with Popover */}
                      <Popover
                        open={colorPickerOpen}
                        onOpenChange={setColorPickerOpen}
                      >
                        <PopoverTrigger asChild>
                          <div
                            className="h-10 w-10 rounded-sm border-2 border-gray-200 shadow-sm"
                            style={{ backgroundColor: watchedHexCode }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4" align="start">
                          <ColorPicker
                            className="w-full max-w-[280px]"
                            value={field.value}
                            onChange={(color) => {
                              field.onChange(color);
                              // Optional: Auto close popover after selection
                              // setColorPickerOpen(false);
                            }}
                          >
                            <ColorPickerSelection />
                            <div className="mt-4 flex items-center gap-4">
                              <ColorPickerEyeDropper />
                              <div className="w-full">
                                <ColorPickerHue />
                              </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                              <ColorPickerOutput />
                              <ColorPickerFormat />
                            </div>
                          </ColorPicker>
                        </PopoverContent>
                      </Popover>

                      {/* ✅ Manual Hex Input */}
                      <div className="flex-1">
                        <Input
                          placeholder="#000000"
                          value={field.value}
                          onChange={field.onChange}
                          className="font-mono"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Click the color button to open picker, or enter hex code
                    manually
                  </FormDescription>
                  <FormMessage />
                  {hexCodeError && (
                    <div className="text-sm text-red-600 mt-1">{hexCodeError}</div>
                  )}
                </FormItem>
              )}
            />

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

            {/* ✅ Active Status Toggle */}
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
                    <FormLabel>Active Color</FormLabel>
                    <FormDescription>
                      Inactive colors won't appear in pet creation forms
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
                disabled={updateColor.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateColor.isPending}>
                {updateColor.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Palette className="mr-2 h-4 w-4" />
                    Update Color
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
