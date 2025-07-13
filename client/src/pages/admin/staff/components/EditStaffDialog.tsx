import { useState, useEffect } from 'react';
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
import { DEPARTMENTS, PERMISSIONS } from '@/types/staff';
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
  phone: z.string().trim().optional().or(z.literal('')),
  department: z.string().min(1, 'Department is required'),
  position: z
    .string()
    .trim()
    .min(1, 'Position is required')
    .max(50, 'Position must be less than 50 characters'),
  permissions: z.array(z.string()).default([]),
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

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
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
                    <FormLabel>Phone Number</FormLabel>
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
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
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
                      <FormControl>
                        <Input
                          placeholder="e.g., Senior Staff, Manager"
                          {...field}
                        />
                      </FormControl>
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
                      Select the areas this staff member can access
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {PERMISSIONS.map((permission) => (
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
                    ))}
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
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
