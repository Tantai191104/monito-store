/**
 * Node modules
 */
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShoppingBag, Edit, Save, X, Loader2 } from 'lucide-react';

/**
 * Components
 */
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth, useUpdateProfile, useChangePassword } from '@/hooks/useAuth';
import { formatDate } from '@/utils/formatter';

/**
 * Schemas
 */
const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ['confirmPassword'],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const [profileError, setProfileError] = useState<string | null>(null);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
      });
    }
  }, [user, profileForm]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setProfileError(null);
    if (user && user.name === data.name) {
      setProfileError('Name is the same as your current profile.');
      return;
    }
    await updateProfile.mutateAsync(data, {
      onSuccess: () => setIsEditing(false),
    });
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    await changePassword.mutateAsync(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => passwordForm.reset(),
      },
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'staff':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'customer':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'staff':
        return 'Staff Member';
      case 'customer':
        return 'Customer';
      default:
        return role;
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Customer Service':
        return 'bg-purple-100 text-purple-800';
      case 'Product Management':
        return 'bg-orange-100 text-orange-800';
      case 'Operations':
        return 'bg-indigo-100 text-indigo-800';
      case 'Marketing':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-[#003459]">Profile</h1>
        <p className="text-[#003459]/70">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Profile Overview */}
        <div className="lg:col-span-1">
          <Card className="border-2 border-[#F7DBA7]">
            <CardContent className="p-6">
              {/* Avatar Section */}
              <div className="mb-6 text-center">
                <div className="relative inline-block">
                  <Avatar className="mx-auto mb-4 h-24 w-24">
                    <AvatarImage src={user?.avatarUrl || ''} alt={user?.name} />
                    <AvatarFallback className="bg-[#F7DBA7] text-xl text-[#003459]">
                      {getInitials(user?.name || '')}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <h2 className="mb-2 text-xl font-semibold text-[#003459]">
                  {user?.name}
                </h2>

                <Badge
                  className={`${getRoleBadgeColor(user?.role || '')} border`}
                >
                  {getRoleDisplayName(user?.role || '')}
                </Badge>
              </div>

              <Separator className="my-6" />

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#003459]/70">
                    Member since
                  </span>
                  <span className="text-sm font-medium text-[#003459]">
                    {user?.joinDate
                      ? formatDate(new Date(user.joinDate))
                      : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#003459]/70">Last login</span>
                  <span className="text-sm font-medium text-[#003459]">
                    {user?.lastLogin
                      ? formatDate(new Date(user.lastLogin))
                      : 'N/A'}
                  </span>
                </div>

                {user?.role === 'customer' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#003459]/70">
                        Total orders
                      </span>
                      <span className="text-sm font-medium text-[#003459]">
                        {user?.orders || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#003459]/70">
                        Total spent
                      </span>
                      <span className="text-sm font-medium text-[#003459]">
                        ${user?.totalSpent?.toLocaleString() || '0'}
                      </span>
                    </div>
                  </>
                )}

                {user?.role === 'staff' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#003459]/70">
                        Department
                      </span>
                      <Badge
                        className={getDepartmentColor(user?.department || '')}
                      >
                        {user?.department || 'N/A'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#003459]/70">
                        Position
                      </span>
                      <span className="text-sm font-medium text-[#003459]">
                        {user?.position || 'N/A'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Profile Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-[#F7DBA7]">
              <TabsTrigger
                value="personal"
                className="data-[state=active]:bg-[#003459] data-[state=active]:text-white"
              >
                Personal Info
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-[#003459] data-[state=active]:text-white"
              >
                Security
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card className="border-2 border-[#F7DBA7]">
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                    <CardHeader className="mb-5 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-[#003459]">
                          Personal Information
                        </CardTitle>
                        <CardDescription>
                          Update your personal details and contact information
                        </CardDescription>
                      </div>
                      {!isEditing ? (
                        <Button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          className="border-[#003459] text-[#003459] hover:bg-[#003459] hover:text-white"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={() => {
                              setIsEditing(false);
                              profileForm.reset();
                            }}
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={updateProfile.isPending}
                            className="bg-[#003459] hover:bg-[#003459]/90"
                          >
                            {updateProfile.isPending ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="mr-2 h-4 w-4" />
                            )}
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {profileError && (
                        <div className="text-red-500 text-sm">
                          {profileError}
                        </div>
                      )}
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} disabled />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  {...field}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {user?.role === 'staff' && (
                          <>
                            <FormItem>
                              <FormLabel>Department</FormLabel>
                              <Input value={user.department} disabled />
                            </FormItem>
                            <FormItem>
                              <FormLabel>Position</FormLabel>
                              <Input value={user.position} disabled />
                            </FormItem>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </form>
                </Form>
              </Card>

              {/* Role-specific Information */}
              {user?.role === 'customer' && (
                <Card className="border-2 border-[#F7DBA7]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#003459]">
                      <ShoppingBag className="h-5 w-5" />
                      Shopping Statistics
                    </CardTitle>
                    <CardDescription>
                      Your shopping activity and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="rounded-lg bg-[#F7DBA7] p-4 text-center">
                        <div className="mb-1 text-2xl font-bold text-[#003459]">
                          {user?.orders || 0}
                        </div>
                        <div className="text-sm text-[#003459]/70">
                          Total Orders
                        </div>
                      </div>
                      <div className="rounded-lg bg-[#F7DBA7] p-4 text-center">
                        <div className="mb-1 text-2xl font-bold text-[#003459]">
                          ${user?.totalSpent?.toLocaleString() || '0'}
                        </div>
                        <div className="text-sm text-[#003459]/70">
                          Total Spent
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="border-2 border-[#F7DBA7]">
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                    <CardHeader className="mb-5">
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>
                        Manage your password and account security
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                {...field}
                                placeholder="••••••••••••"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                {...field}
                                placeholder="••••••••••••"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                {...field}
                                placeholder="••••••••••••"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className="mt-5">
                      <Button
                        type="submit"
                        disabled={changePassword.isPending}
                        className="bg-[#003459] hover:bg-[#003459]/90"
                      >
                        {changePassword.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Update Password
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
