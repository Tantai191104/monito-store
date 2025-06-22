import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  MoreHorizontal,
  Download,
  Filter,
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
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const StaffManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const staffMembers = [
    {
      id: 1,
      name: 'Mike Davis',
      email: 'mike.davis@monito.com',
      phone: '+1 (555) 345-6789',
      department: 'Customer Service',
      position: 'Senior Staff',
      status: 'Active',
      joinDate: '2023-12-01',
      lastLogin: '2024-01-20 11:45',
      permissions: ['products', 'orders', 'customers'],
      avatar: '/api/placeholder/40/40',
    },
    {
      id: 2,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@monito.com',
      phone: '+1 (555) 456-7890',
      department: 'Product Management',
      position: 'Product Manager',
      status: 'Active',
      joinDate: '2023-10-15',
      lastLogin: '2024-01-20 09:30',
      permissions: ['products', 'categories', 'inventory'],
      avatar: '/api/placeholder/40/40',
    },
    {
      id: 3,
      name: 'Tom Wilson',
      email: 'tom.wilson@monito.com',
      phone: '+1 (555) 567-8901',
      department: 'Operations',
      position: 'Operations Manager',
      status: 'Active',
      joinDate: '2023-08-20',
      lastLogin: '2024-01-19 16:20',
      permissions: ['orders', 'shipping', 'inventory'],
      avatar: '/api/placeholder/40/40',
    },
    {
      id: 4,
      name: 'Sarah Chen',
      email: 'sarah.chen@monito.com',
      phone: '+1 (555) 678-9012',
      department: 'Customer Service',
      position: 'Staff',
      status: 'On Leave',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-15 14:45',
      permissions: ['customers', 'orders'],
      avatar: '/api/placeholder/40/40',
    },
  ];

  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      staff.status.toLowerCase().replace(' ', '') === statusFilter;

    const matchesDepartment =
      departmentFilter === 'all' ||
      staff.department.toLowerCase().replace(' ', '') === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Customer Service':
        return 'bg-blue-100 text-blue-800';
      case 'Product Management':
        return 'bg-purple-100 text-purple-800';
      case 'Operations':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Manage staff accounts and permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Staff
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Staff Member
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Staff
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-green-600">+2 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Staff
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21</div>
            <p className="text-xs text-green-600">91% active rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              On Leave
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-yellow-600">Temporary leave</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Departments
            </CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-600">Active departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Staff</CardTitle>
          <CardDescription>
            Find and filter staff members by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, email, or department..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="onleave">On Leave</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="customerservice">
                  Customer Service
                </SelectItem>
                <SelectItem value="productmanagement">
                  Product Management
                </SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Staff Members</CardTitle>
              <CardDescription>
                {filteredStaff.length} staff members found
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={staff.avatar} alt={staff.name} />
                          <AvatarFallback>
                            {staff.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{staff.name}</p>
                          <p className="text-sm text-gray-600">{staff.email}</p>
                          <p className="text-sm text-gray-500">{staff.phone}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge className={getDepartmentColor(staff.department)}>
                        {staff.department}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">{staff.position}</div>
                    </TableCell>

                    <TableCell>
                      <Badge className={getStatusColor(staff.status)}>
                        {staff.status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {staff.permissions.slice(0, 2).map((permission) => (
                          <Badge
                            key={permission}
                            variant="outline"
                            className="text-xs"
                          >
                            {permission}
                          </Badge>
                        ))}
                        {staff.permissions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{staff.permissions.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm">{staff.joinDate}</div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm">{staff.lastLogin}</div>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Staff
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Staff
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffManagement;
