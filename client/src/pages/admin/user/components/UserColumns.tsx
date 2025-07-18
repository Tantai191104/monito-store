// userColumns.ts
import type { ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Eye, CheckCircle, Ban, MoreHorizontal, Mail, Phone, Calendar } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import type { UserResponse } from '@/services/userService'

export const getUserColumns = ({
    onViewDetail,
    onToggleActive,
}: {
    onViewDetail: (user: UserResponse) => void
    onToggleActive: (user: UserResponse, action: 'inactive' | 'activate') => void
}): ColumnDef<UserResponse>[] => [
        {
            accessorKey: 'name',
            header: 'User',
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: 'phone',
            header: 'Contact',
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="space-y-1 text-sm">
                        <div className="flex items-center">
                            <Mail className="mr-1 h-3 w-3 text-gray-400" />
                            {user.email}
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Phone className="mr-1 h-3 w-3 text-gray-400" />
                            {user.phone}
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }) => {
                const role: string = row.original.role;

                const getRoleColor = (role: string) => {
                    switch (role) {
                        case 'staff':
                            return 'bg-blue-100 text-blue-800';
                        case 'admin':
                            return 'bg-purple-100 text-purple-800';
                        default:
                            return 'bg-gray-100 text-gray-800';
                    }
                };

                const capitalizeFirstLetter = (str: string) =>
                    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

                return (
                    <Badge variant="outline" className={`${getRoleColor(role)} border-0`}>
                        {capitalizeFirstLetter(role)}
                    </Badge>
                );
            },
        }
        ,
        {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => {
                const active = row.original.isActive;
                return (
                    <Badge variant={active ? 'default' : 'destructive'}>
                        {active ? 'Active' : 'Inactive'}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'joinDate',
            header: 'Activity',
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="space-y-1 text-sm">
                        <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3 text-gray-400" />
                            Joined {user.joinDate ? new Date(user.joinDate).toLocaleDateString('vi-VN') : 'N/A'}
                        </div>
                        <div className="text-muted-foreground">
                            Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('vi-VN') : 'N/A'}
                        </div>
                    </div>
                )
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => onViewDetail(user)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </DropdownMenuItem>
                                {user.isActive ? (
                                    <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() => onToggleActive(user, 'inactive')}
                                    >
                                        <Ban className="mr-2 h-4 w-4" />
                                        Inactive
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem
                                        className="text-green-600"
                                        onClick={() => onToggleActive(user, 'activate')}
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Activate
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        },
    ]
