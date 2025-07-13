import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  CheckCircle,
  Ban,
  Download,
  Plus,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { fetchSummary, fetchUsers, updateUserStatus, type SummaryResponse, type UserResponse } from '@/services/userService';
import UserDetailModal from './components/UserDetailModal';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useDebounce } from '@/hooks/useDebounce';
import { exportToExcel } from '@/utils/exportToExcel';
import { UserDataTable } from './components/UserDataTable';
const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [confirmDialogUser, setConfirmDialogUser] = useState<{
    user: UserResponse;
    action: 'suspend' | 'activate';
  } | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [summaryRes, usersRes] = await Promise.all([
          fetchSummary(),
          fetchUsers(),
        ]);

        if (summaryRes.data) setSummary(summaryRes.data); // ✅ check trước
        if (usersRes.data) setUsers(usersRes.data);       // ✅ check trước
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    loadData();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        user.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        user.phone?.includes(debouncedSearch);

      const matchesStatus =
        statusFilter === 'all' || user.isActive === (statusFilter === 'true');

      const matchesRole =
        roleFilter === 'all' || user.role?.toLowerCase() === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, debouncedSearch, statusFilter, roleFilter]);

  const openUserDetail = (user: UserResponse) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const closeUserDetail = () => {
    setSelectedUser(null);
    setShowDetailModal(false);
  };

  const handleToggleUserStatus = async (user: UserResponse) => {
    try {
      const res = await updateUserStatus(user._id, !user.isActive);

      if (res?.data) {
        toast.success(res.message);

        const updatedUser = res.data;

        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id ? { ...u, isActive: updatedUser.isActive } : u
          )
        );
      } else {
        toast.error("Update failed: No user data returned");
      }
    } catch (err) {
      console.error("Failed to update user status", err);
      toast.error("An error occurred while updating user status.");
    }
  };

  const handleExportUsers = () => {
    const exportData = users.map((user) => ({
      Name: user.name,
      Email: user.email,
      Phone: user.phone,
      Role: user.role,
      Status: user.isActive ? 'Active' : 'Suspended',
      Orders: user.orders,
      TotalSpent: user.totalSpent,
      JoinDate: user.joinDate
        ? new Date(user.joinDate).toLocaleDateString('vi-VN')
        : '',
      LastLogin: user.lastLogin
        ? new Date(user.lastLogin).toLocaleDateString('vi-VN')
        : '',
    }));

    exportToExcel(exportData, 'Users', `user-list-${new Date().toISOString().split('T')[0]}`);
  };
  return (
    <div className="container mx-auto py-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-muted-foreground">
            Manage all user accounts in the system
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className='cursor-pointer' onClick={handleExportUsers}>
            <Download className="mr-2 h-4 w-4" />
            Export Users
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {!summary ||
        !summary.totalUsers ||
        !summary.activeUsers ||
        !summary.suspendedUsers ||
        !summary.newUsersThisMonth ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    Loading...
                  </CardTitle>
                  <div className="h-4 w-4 animate-pulse rounded-full bg-gray-300" />
                </CardHeader>
                <CardContent>
                  <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200 text-2xl font-bold" />
                  <p className="mt-2 text-xs text-gray-400">Fetching data...</p>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Total Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Users
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.totalUsers.count.toLocaleString()}
              </div>
              <p className="text-xs text-green-600">
                {`${summary.totalUsers.percentChange >= 0 ? '+' : ''}${summary.totalUsers.percentChange}% from last month`}
              </p>
            </CardContent>
          </Card>

          {/* Active Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Users
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.activeUsers.count.toLocaleString()}
              </div>
              <p className="text-xs text-green-600">
                {`${summary.activeUsers.percentChange >= 0 ? '+' : ''}${summary.activeUsers.percentChange}% from last month`}
              </p>
            </CardContent>
          </Card>

          {/* Suspended */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Suspended
              </CardTitle>
              <Ban className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.suspendedUsers.count.toLocaleString()}
              </div>
              <p className="text-xs text-red-600">
                +{summary.suspendedUsers.weeklyChange} this week
              </p>
            </CardContent>
          </Card>

          {/* New This Month */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                New This Month
              </CardTitle>
              <Plus className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.newUsersThisMonth.count.toLocaleString()}
              </div>
              <p className="text-xs text-green-600">
                {`${summary.newUsersThisMonth.percentChange >= 0 ? '+' : ''}${summary.newUsersThisMonth.percentChange}% from last month`}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Users</CardTitle>
          <CardDescription>
            Find and filter users by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Suspended</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <UserDataTable
        data={filteredUsers}
        onViewDetail={openUserDetail}
        onToggleActive={(user, action) => setConfirmDialogUser({ user, action })}
      />

      <UserDetailModal
        open={showDetailModal}
        onClose={closeUserDetail}
        user={selectedUser}
      />
      {confirmDialogUser && (
        <AlertDialog open={!!confirmDialogUser} onOpenChange={(open) => !open && setConfirmDialogUser(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmDialogUser.action === 'suspend'
                  ? 'Confirm user suspension?'
                  : 'Confirm user activation?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirmDialogUser.action === 'suspend'
                  ? 'This action will change the user’s status to Suspended. Are you sure you want to proceed?'
                  : 'This will reactivate the user and restore their access. Proceed?'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setConfirmDialogUser(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  await handleToggleUserStatus(confirmDialogUser.user);
                  setConfirmDialogUser(null);
                }}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>

  );
};

export default UserManagement;