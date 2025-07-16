import type { Department, Permission, Position } from '@/types/staff';

export interface RoleConfigPosition {
  name: Position;
  permissions: Permission[];
}

export interface RoleConfigDepartment {
  name: Department;
  positions: RoleConfigPosition[];
}

export const ROLE_CONFIG: RoleConfigDepartment[] = [
  {
    name: 'Product Management',
    positions: [
      {
        name: 'Store Manager',
        permissions: [
          'products',
          'pets',
          'orders',
          'customers',
          'categories',
          'breeds',
          'colors',
          'inventory',
          'shipping',
          'reports',
        ],
      },
      {
        name: 'Assistant Manager',
        permissions: [
          'products',
          'pets',
          'orders',
          'customers',
          'inventory',
          'reports',
        ],
      },
      { name: 'Sales Associate', permissions: ['products', 'pets', 'orders'] },
    ],
  },
  {
    name: 'Operations',
    positions: [
      {
        name: 'Inventory Coordinator',
        permissions: ['products', 'inventory', 'shipping'],
      },
      { name: 'Pet Care Specialist', permissions: ['pets', 'breeds', 'colors'] },
      { name: 'Professional Groomer', permissions: ['pets'] },
    ],
  },
  {
    name: 'Marketing',
    positions: [
      { name: 'Marketing Specialist', permissions: ['products', 'customers'] },
      { name: 'Content Creator', permissions: ['products', 'pets'] },
    ],
  },
  {
    name: 'Customer Service',
    positions: [
      {
        name: 'Customer Support Agent',
        permissions: ['orders', 'customers'],
      },
    ],
  },
];

// Helper to get all unique departments and positions
export const DEPARTMENTS = ROLE_CONFIG.map((dept) => dept.name);
export const POSITIONS = [
  ...new Set(
    ROLE_CONFIG.flatMap((dept) => dept.positions.map((pos) => pos.name)),
  ),
];