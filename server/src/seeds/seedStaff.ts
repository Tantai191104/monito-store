import { hashPassword } from '../utils/bcryptjs';
/**
 * Models
 */
import UserModel from '../models/userModel';

export const seedStaff = async () => {
  try {
    console.log('🌱 Starting to seed staff users...');

    // ✅ Clear existing staff users
    await UserModel.deleteMany({ role: 'staff' });
    console.log('🗑️  Cleared existing staff users');

    const hashedPassword = await hashPassword('staff123');

    // ✅ Create multiple staff members with different departments and permissions
    const staffData = [
      {
        name: 'Sarah Johnson',
        email: 'staff@monito.com',
        password: hashedPassword,
        phone: '(555) 010-1001',
        role: 'staff',
        department: 'Customer Service',
        position: 'Customer Support Agent',
        permissions: ['orders', 'customers'],
        isActive: true,
        joinDate: new Date('2024-01-15'),
        lastLogin: new Date('2024-12-20T10:30:00Z'),
      },
      {
        name: 'Michael Chen',
        email: 'michael@monito.com',
        password: hashedPassword,
        phone: '(555) 010-1002',
        role: 'staff',
        department: 'Product Management',
        position: 'Store Manager',
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
        isActive: true,
        joinDate: new Date('2024-02-01'),
        lastLogin: new Date('2024-12-20T14:45:00Z'),
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily@monito.com',
        password: hashedPassword,
        phone: '(555) 010-1003',
        role: 'staff',
        department: 'Operations',
        position: 'Inventory Coordinator',
        permissions: ['products', 'inventory', 'shipping'],
        isActive: true,
        joinDate: new Date('2024-03-10'),
        lastLogin: new Date('2024-12-19T16:20:00Z'),
      },
      {
        name: 'David Kim',
        email: 'david@monito.com',
        password: hashedPassword,
        phone: '(555) 010-1004',
        role: 'staff',
        department: 'Marketing',
        position: 'Marketing Specialist',
        permissions: ['products', 'customers'],
        isActive: true,
        joinDate: new Date('2024-04-20'),
        lastLogin: new Date('2024-12-20T09:15:00Z'),
      },
      {
        name: 'Lisa Thompson',
        email: 'lisa@monito.com',
        password: hashedPassword,
        phone: '(555) 010-1005',
        role: 'staff',
        department: 'Product Management',
        position: 'Sales Associate',
        permissions: ['products', 'pets', 'orders'],
        isActive: true,
        joinDate: new Date('2024-05-05'),
        lastLogin: new Date('2024-12-20T11:00:00Z'),
      },
      {
        name: 'James Wilson',
        email: 'james@monito.com',
        password: hashedPassword,
        phone: '(555) 010-1006',
        role: 'staff',
        department: 'Operations',
        position: 'Professional Groomer',
        permissions: ['pets'],
        isActive: true,
        joinDate: new Date('2024-06-15'),
        lastLogin: new Date('2024-12-18T13:30:00Z'),
      },
      {
        name: 'Anna Martinez',
        email: 'anna@monito.com',
        password: hashedPassword,
        phone: '(555) 010-1007',
        role: 'staff',
        department: 'Operations',
        position: 'Pet Care Specialist',
        permissions: ['pets', 'breeds', 'colors'],
        isActive: true,
        joinDate: new Date('2024-07-01'),
        lastLogin: new Date('2024-12-20T08:45:00Z'),
      },
      {
        name: 'Robert Davis',
        email: 'robert@monito.com',
        password: hashedPassword,
        phone: '(555) 010-1008',
        role: 'staff',
        department: 'Marketing',
        position: 'Content Creator',
        permissions: ['products', 'pets'],
        isActive: false, // ✅ Inactive staff member
        joinDate: new Date('2024-08-10'),
        lastLogin: new Date('2024-11-15T15:20:00Z'),
      },
      {
        name: 'Jessica Brown',
        email: 'jessica@monito.com',
        password: hashedPassword,
        phone: '(555) 010-1009',
        role: 'staff',
        department: 'Product Management',
        position: 'Assistant Manager',
        permissions: [
          'products',
          'pets',
          'orders',
          'customers',
          'inventory',
          'reports',
        ],
        isActive: true,
        joinDate: new Date('2024-09-01'),
        lastLogin: new Date('2024-12-20T12:10:00Z'),
      },
      {
        name: 'Mark Anderson',
        email: 'mark@monito.com',
        password: hashedPassword,
        phone: '(555) 010-1010',
        role: 'staff',
        department: 'Operations',
        position: 'Inventory Coordinator',
        permissions: ['products', 'shipping'],
        isActive: true,
        joinDate: new Date('2024-10-15'),
        lastLogin: new Date('2024-12-19T17:00:00Z'),
      },
      {
        name: 'Rachel Green',
        email: 'rachel@monito.com',
        password: hashedPassword,
        phone: '(555) 010-1011',
        role: 'staff',
        department: 'Marketing',
        position: 'Marketing Specialist',
        permissions: ['products', 'customers'],
        isActive: false, // ✅ Another inactive staff member
        joinDate: new Date('2024-11-01'),
        lastLogin: null, // ✅ Never logged in
      },
      {
        name: 'Tom Miller',
        email: 'tom@monito.com',
        password: hashedPassword,
        phone: '(555) 010-1012',
        role: 'staff',
        department: 'Product Management',
        position: 'Store Manager',
        permissions: [
          'products',
          'categories',
          'inventory',
          'pets',
          'breeds',
          'colors',
          'reports',
        ],
        isActive: true,
        joinDate: new Date('2024-12-01'),
        lastLogin: new Date('2024-12-20T16:30:00Z'),
      },
    ];

    // Insert all staff members
    const createdStaff = await UserModel.insertMany(staffData);
    console.log(`✅ Successfully created ${createdStaff.length} staff members`);

    // Log department statistics
    const departmentStats = staffData.reduce((acc, staff) => {
      acc[staff.department] = (acc[staff.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n📊 Staff by Department:');
    Object.entries(departmentStats).forEach(([dept, count]) => {
      console.log(`   • ${dept}: ${count} staff members`);
    });

    console.log('\n👥 Sample staff accounts:');
    console.log('📧 Email: sarah@monito.com | 🔑 Password: staff123');
    console.log('📧 Email: michael@monito.com | 🔑 Password: staff123');
    console.log('📧 Email: emily@monito.com | 🔑 Password: staff123');
    console.log('📧 Email: david@monito.com | 🔑 Password: staff123');

    const activeCount = staffData.filter((s) => s.isActive).length;
    const inactiveCount = staffData.filter((s) => !s.isActive).length;
    console.log(`\n✅ Active: ${activeCount} | ❌ Inactive: ${inactiveCount}`);

    return createdStaff;
  } catch (error) {
    console.error('❌ Error seeding staff users:', error);
    throw error;
  }
};
