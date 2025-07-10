import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Edit, Loader2, Palette, Pipette } from 'lucide-react';

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
import { useUpdateColor } from '@/hooks/useColors';
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

// Predefined popular colors for quick selection
const PRESET_COLORS = [
  '#000000',
  '#FFFFFF',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#FF00FF',
  '#00FFFF',
  '#FFA500',
  '#800080',
  '#FFC0CB',
  '#A52A2A',
  '#808080',
  '#FFD700',
  '#C0C0C0',
  '#8B4513',
  '#F5F5DC',
  '#DC143C',
  '#FBCEB1',
  '#704214',
  '#8B4516',
  '#D2B48C',
  '#DDA0DD',
  '#98FB98',
];

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
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const handleCancel = () => {
    form.reset(); // Reset form on cancel
    setOpen(false);
  };

  // Convert hex to name suggestion
  const suggestColorName = (hex: string) => {
    const colorMap: { [key: string]: string } = {
      '#000000': 'Black',
      '#FFFFFF': 'White',
      '#FF0000': 'Red',
      '#00FF00': 'Green',
      '#0000FF': 'Blue',
      '#FFFF00': 'Yellow',
      '#FF00FF': 'Magenta',
      '#00FFFF': 'Cyan',
      '#FFA500': 'Orange',
      '#800080': 'Purple',
      '#FFC0CB': 'Pink',
      '#A52A2A': 'Brown',
      '#808080': 'Gray',
      '#FFD700': 'Gold',
      '#C0C0C0': 'Silver',
      '#8B4513': 'Saddle Brown',
      '#F5F5DC': 'Beige',
      '#DC143C': 'Crimson',
      '#FBCEB1': 'Peach',
      '#704214': 'Sepia',
    };
    return colorMap[hex.toUpperCase()] || '';
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
            {/* Color Picker Section */}
            <div className="space-y-4">
              <FormLabel>Color Selection</FormLabel>

              {/* Before and After Color Comparison */}
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <p className="mb-2 text-sm text-gray-600">Original</p>
                  <div
                    className="h-16 w-16 rounded-full border-4 border-gray-300 shadow-lg"
                    style={{ backgroundColor: color.hexCode }}
                  />
                  <p className="mt-1 text-xs text-gray-500">{color.hexCode}</p>
                </div>

                <div className="text-center">
                  <p className="mb-2 text-sm text-gray-600">New</p>
                  <div
                    className="h-16 w-16 rounded-full border-4 border-blue-300 shadow-lg"
                    style={{ backgroundColor: watchedHexCode }}
                  />
                  <p className="mt-1 text-xs text-gray-500">{watchedHexCode}</p>
                </div>
              </div>

              {/* Color Picker and Hex Input */}
              <div className="flex items-center gap-4">
                <Popover
                  open={colorPickerOpen}
                  onOpenChange={setColorPickerOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Pipette className="h-4 w-4" />
                      Color Picker
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4" align="start">
                    <div className="space-y-4">
                      {/* <Controller
                        name="hexCode"
                        control={form.control}
                        render={({ field }) => (
                          // <HexColorPicker
                          //   color={field.value}
                          //   onChange={field.onChange}
                          // />
                        )}
                      /> */}

                      {/* Preset Colors */}
                      <div>
                        <p className="mb-2 text-sm font-medium">Quick Colors</p>
                        <div className="grid grid-cols-6 gap-2">
                          {PRESET_COLORS.map((presetColor) => (
                            <button
                              key={presetColor}
                              type="button"
                              className={`h-8 w-8 rounded border-2 transition-colors ${
                                watchedHexCode === presetColor
                                  ? 'scale-110 border-blue-500'
                                  : 'border-gray-200 hover:border-gray-400'
                              }`}
                              style={{ backgroundColor: presetColor }}
                              onClick={() => {
                                form.setValue('hexCode', presetColor);
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Reset to original */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => form.setValue('hexCode', color.hexCode)}
                        className="w-full"
                      >
                        Reset to Original
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <FormField
                  control={form.control}
                  name="hexCode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="#000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Auto-suggestion button */}
              {suggestColorName(watchedHexCode) &&
                suggestColorName(watchedHexCode) !== form.getValues('name') && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      form.setValue('name', suggestColorName(watchedHexCode));
                    }}
                    className="text-xs"
                  >
                    Suggest: "{suggestColorName(watchedHexCode)}"
                  </Button>
                )}
            </div>

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
