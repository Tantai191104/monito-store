/**
 * Node modules
 */
import { useState } from 'react';
import { 
  ShoppingBag, 
  Edit,
  Camera,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

/**
 * Components
 */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Hooks
 */
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Utils
 */
import { formatDate } from '@/utils/formatter';

const ProfilePage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    position: user?.position || '',
  });

  // Remove useEffect that fetches user directly

  const handleEdit = () => {
    setIsEditing(true);
    setShowSuccess(false);
    setShowError(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      department: user?.department || '',
      position: user?.position || '',
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedUser = await authService.updateProfile(formData);
      // Update the React Query cache for ['auth-user']
      queryClient.setQueryData(['auth-user'], updatedUser);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  // Change password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Password visibility state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = async () => {
    setIsChangingPassword(true);
    setPasswordSuccess(false);
    setPasswordError('');
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      setIsChangingPassword(false);
      return;
    }
    if (passwordForm.newPassword === passwordForm.currentPassword) {
      setPasswordError('New password must be different from the current password.');
      setIsChangingPassword(false);
      return;
    }
    try {
      await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
    } catch (err: any) {
      setPasswordError(err?.response?.data?.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCEED5] to-[#FFE7BA] p-8">
      <div className="mx-auto max-w-6xl">
        {/* Success/Error Alerts */}
        {showSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Profile updated successfully!
            </AlertDescription>
          </Alert>
        )}

        {showError && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Failed to update profile. Please try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#003459] mb-2">Profile</h1>
          <p className="text-[#003459]/70">Manage your account information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-[#F7DBA7]">
              <CardContent className="p-6">
                {/* Avatar Section */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarImage src={user?.avatarUrl || ''} alt={user?.name} />
                      <AvatarFallback className="bg-[#F7DBA7] text-[#003459] text-xl">
                        {getInitials(user?.name || '')}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white border-[#F7DBA7] hover:border-[#003459]"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-[#003459] mb-2">
                    {user?.name}
                  </h2>
                  
                  <Badge className={`${getRoleBadgeColor(user?.role || '')} border`}>
                    {getRoleDisplayName(user?.role || '')}
                  </Badge>
                </div>

                <Separator className="my-6" />

                {/* Quick Stats */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#003459]/70">Member since</span>
                    <span className="text-sm font-medium text-[#003459]">
                      {user?.joinDate ? formatDate(new Date(user.joinDate)) : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#003459]/70">Last login</span>
                    <span className="text-sm font-medium text-[#003459]">
                      {user?.lastLogin ? formatDate(new Date(user.lastLogin)) : 'N/A'}
                    </span>
                  </div>

                  {user?.role === 'customer' && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#003459]/70">Total orders</span>
                        <span className="text-sm font-medium text-[#003459]">
                          {user?.orders || 0}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#003459]/70">Total spent</span>
                        <span className="text-sm font-medium text-[#003459]">
                          ${user?.totalSpent?.toLocaleString() || '0'}
                        </span>
                      </div>
                    </>
                  )}

                  {user?.role === 'staff' && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#003459]/70">Department</span>
                        <Badge className={getDepartmentColor(user?.department || '')}>
                          {user?.department || 'N/A'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#003459]/70">Position</span>
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
              <TabsList className="grid w-full grid-cols-3 bg-[#F7DBA7]">
                <TabsTrigger value="personal" className="data-[state=active]:bg-[#003459] data-[state=active]:text-white">
                  Personal Info
                </TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-[#003459] data-[state=active]:text-white">
                  Security
                </TabsTrigger>
                <TabsTrigger value="preferences" className="data-[state=active]:bg-[#003459] data-[state=active]:text-white">
                  Preferences
                </TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal" className="space-y-6">
                <Card className="border-2 border-[#F7DBA7]">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-[#003459]">Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal details and contact information
                      </CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button
                        onClick={handleEdit}
                        variant="outline"
                        className="border-[#003459] text-[#003459] hover:bg-[#003459] hover:text-white"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          disabled={isLoading}
                          className="bg-[#003459] hover:bg-[#003459]/90"
                        >
                          {isLoading ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-[#003459]">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          disabled={!isEditing}
                          className="border-[#F7DBA7] focus:border-[#003459]"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="text-[#003459]">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                          className="border-[#F7DBA7] focus:border-[#003459]"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone" className="text-[#003459]">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                          className="border-[#F7DBA7] focus:border-[#003459]"
                        />
                      </div>

                      {user?.role === 'staff' && (
                        <>
                          <div>
                            <Label htmlFor="department" className="text-[#003459]">Department</Label>
                            <Input
                              id="department"
                              value={formData.department}
                              onChange={(e) => handleInputChange('department', e.target.value)}
                              disabled={!isEditing}
                              className="border-[#F7DBA7] focus:border-[#003459]"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="position" className="text-[#003459]">Position</Label>
                            <Input
                              id="position"
                              value={formData.position}
                              onChange={(e) => handleInputChange('position', e.target.value)}
                              disabled={!isEditing}
                              className="border-[#F7DBA7] focus:border-[#003459]"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Role-specific Information */}
                {user?.role === 'customer' && (
                  <Card className="border-2 border-[#F7DBA7]">
                    <CardHeader>
                      <CardTitle className="text-[#003459] flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Shopping Statistics
                      </CardTitle>
                      <CardDescription>
                        Your shopping activity and preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="text-center p-4 bg-[#F7DBA7] rounded-lg">
                          <div className="text-2xl font-bold text-[#003459] mb-1">
                            {user?.orders || 0}
                          </div>
                          <div className="text-sm text-[#003459]/70">Total Orders</div>
                        </div>
                        <div className="text-center p-4 bg-[#F7DBA7] rounded-lg">
                          <div className="text-2xl font-bold text-[#003459] mb-1">
                            ${user?.totalSpent?.toLocaleString() || '0'}
                          </div>
                          <div className="text-sm text-[#003459]/70">Total Spent</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card className="border-2 border-[#F7DBA7]">
                  <CardHeader>
                    <CardTitle className="text-[#003459]">Security Settings</CardTitle>
                    <CardDescription>
                      Manage your password and account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {passwordSuccess && (
                      <Alert className="mb-4 border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          Password changed successfully!
                        </AlertDescription>
                      </Alert>
                    )}
                    {passwordError && (
                      <Alert className="mb-4 border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          {passwordError}
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="relative">
                      <Label htmlFor="current-password" className="text-[#003459]">Current Password</Label>
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder="Enter your current password"
                        className="border-[#F7DBA7] focus:border-[#003459] pr-10"
                        value={passwordForm.currentPassword}
                        onChange={e => handlePasswordInputChange('currentPassword', e.target.value)}
                        disabled={isChangingPassword}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-2 flex items-center text-[#003459] h-full"
                        style={{ marginTop: '7px' }}
                        tabIndex={-1}
                        onClick={() => setShowCurrentPassword(v => !v)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <div className="relative">
                      <Label htmlFor="new-password" className="text-[#003459]">New Password</Label>
                      <Input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Enter your new password"
                        className="border-[#F7DBA7] focus:border-[#003459] pr-10"
                        value={passwordForm.newPassword}
                        onChange={e => handlePasswordInputChange('newPassword', e.target.value)}
                        disabled={isChangingPassword}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-2 flex items-center text-[#003459] h-full"
                        style={{ marginTop: '7px' }}
                        tabIndex={-1}
                        onClick={() => setShowNewPassword(v => !v)}
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <div className="relative">
                      <Label htmlFor="confirm-password" className="text-[#003459]">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your new password"
                        className="border-[#F7DBA7] focus:border-[#003459] pr-10"
                        value={passwordForm.confirmPassword}
                        onChange={e => handlePasswordInputChange('confirmPassword', e.target.value)}
                        disabled={isChangingPassword}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-2 flex items-center text-[#003459] h-full"
                        style={{ marginTop: '7px' }}
                        tabIndex={-1}
                        onClick={() => setShowConfirmPassword(v => !v)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <Button
                      onClick={handleChangePassword}
                      disabled={isChangingPassword}
                      className="bg-[#003459] hover:bg-[#003459]/90"
                    >
                      {isChangingPassword ? 'Updating...' : 'Update Password'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <Card className="border-2 border-[#F7DBA7]">
                  <CardHeader>
                    <CardTitle className="text-[#003459]">Account Preferences</CardTitle>
                    <CardDescription>
                      Customize your account settings and notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="language" className="text-[#003459]">Language</Label>
                      <select
                        id="language"
                        className="w-full p-2 border border-[#F7DBA7] rounded-md focus:border-[#003459] focus:outline-none"
                      >
                        <option value="en">English</option>
                        <option value="vi">Tiếng Việt</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="timezone" className="text-[#003459]">Timezone</Label>
                      <select
                        id="timezone"
                        className="w-full p-2 border border-[#F7DBA7] rounded-md focus:border-[#003459] focus:outline-none"
                      >
                        <option value="Asia/Ho_Chi_Minh">Asia/Ho Chi Minh (GMT+7)</option>
                        <option value="UTC">UTC (GMT+0)</option>
                      </select>
                    </div>
                    
                    <Button className="bg-[#003459] hover:bg-[#003459]/90">
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 