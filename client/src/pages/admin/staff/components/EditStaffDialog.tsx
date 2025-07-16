import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Edit, Loader2, Users } from 'lucide-react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useUpdateStaff } from '@/hooks/useStaff';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
// ✅ Sửa lại import để lấy đúng hằng số từ config
import { ROLE_CONFIG } from '@/config/roles';
import type { Staff } from '@/types/staff';

const editStaffSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .trim()
    .email('Invalid email format')
    .min(1, 'Email is required'),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(
      /^\+?(\d{1,3})?[-. (]*\d{3}[-. )]*\d{3}[-. ]*\d{4}$/,
      'Invalid phone number format',
    ),
  department: z.string().min(1, 'Department is required'),
  position: z
    .string()
    .trim()
    .min(1, 'Position is required')
    .max(50, 'Position must be less than 50 characters'),
  permissions: z.array(z.string()),
  isActive: z.boolean(),
});

type EditStaffFormValues = z.infer<typeof editStaffSchema>;

interface EditStaffDialogProps {
  staff: Staff | null;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditStaffDialog({
  staff,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: EditStaffDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const updateStaff = useUpdateStaff();

  // Determine if controlled or uncontrolled
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const form = useForm<EditStaffFormValues>({
    resolver: zodResolver(editStaffSchema),
    defaultValues: {
      name: staff?.name || '',
      email: staff?.email || '',
      phone: staff?.phone || '',
      department: staff?.department || '',
      position: staff?.position || '',
      permissions: staff?.permissions || [],
      isActive: staff?.isActive ?? true,
    },
  });

  // ✅ Watch for changes in department and position
  const watchedDepartment = form.watch('department');
  const watchedPosition = form.watch('position');

  // ✅ Memoize available positions based on selected department
  const availablePositions = useMemo(() => {
    if (!watchedDepartment) return [];
    return (
      ROLE_CONFIG.find((dept) => dept.name === watchedDepartment)?.positions ||
      []
    );
  }, [watchedDepartment]);

  // ✅ Memoize available permissions based on selected position
  const availablePermissions = useMemo(() => {
    if (!watchedPosition) return [];
    return (
      availablePositions.find((pos) => pos.name === watchedPosition)
        ?.permissions || []
    );
  }, [watchedPosition, availablePositions]);

  // ✅ Effect to reset position and permissions when department changes
  useEffect(() => {
    // Chỉ chạy khi người dùng đã tương tác với form
    if (form.formState.isDirty) {
      form.setValue('position', '');
      form.setValue('permissions', []);
    }
  }, [watchedDepartment, form]);

  // ✅ Effect to set default permissions when position changes
  useEffect(() => {
    // Chỉ chạy khi người dùng đã tương tác với form
    if (form.formState.isDirty) {
      form.setValue('permissions', availablePermissions);
    }
  }, [watchedPosition, availablePermissions, form]);

  // Reset form when staff changes or dialog opens
  useEffect(() => {
    if (open && staff) {
      form.reset({
        name: staff.name,
        email: staff.email,
        phone: staff.phone || '',
        department: staff.department,
        position: staff.position,
        permissions: staff.permissions,
        isActive: staff.isActive,
      });
    }
  }, [staff, form, open]);

  const onSubmit = async (data: EditStaffFormValues) => {
    if (!staff) return;

    try {
      await updateStaff.mutateAsync({
        id: staff._id,
        data: {
          ...data,
          phone: data.phone || undefined,
        },
      });
      setOpen(false);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
  };

  if (!staff) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Staff Member
          </DialogTitle>
          <DialogDescription>
            Update staff information and permissions.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="e.g., john.smith@monito.com"
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., +1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Work Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Work Information</h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value} // ✅ Sử dụng value thay cho defaultValue
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* ✅ Lấy department từ ROLE_CONFIG */}
                          {ROLE_CONFIG.map((dept) => (
                            <SelectItem key={dept.name} value={dept.name}>
                              {dept.name}
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
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value} // ✅ Sử dụng value thay cho defaultValue
                        disabled={!watchedDepartment}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* ✅ Lấy position từ availablePositions */}
                          {availablePositions.map((pos) => (
                            <SelectItem key={pos.name} value={pos.name}>
                              {pos.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Status */}
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
                    <FormLabel>Active Staff Member</FormLabel>
                    <FormDescription>
                      Inactive staff cannot access the system
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Permissions */}
            <FormField
              control={form.control}
              name="permissions"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-lg font-medium">
                      Permissions
                    </FormLabel>
                    <FormDescription>
                      Select the permissions for this position. Defaults are
                      pre-selected.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {availablePermissions.length > 0 ? (
                      availablePermissions.map((permission) => (
                        <FormField
                          key={permission}
                          control={form.control}
                          name="permissions"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={permission}
                                className="flex flex-row items-start space-y-0 space-x-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(permission)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            permission,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== permission,
                                            ),
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal capitalize">
                                  {permission}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))
                    ) : (
                      <p className="text-muted-foreground col-span-full text-sm italic">
                        Select a position to see available permissions.
                      </p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={updateStaff.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateStaff.isPending}>
                {updateStaff.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4" />
                    Update Staff Member
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
