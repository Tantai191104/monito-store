import { hashPassword } from '../utils/bcryptjs';
/**
 * Models
 */
import UserModel from '../models/userModel';

export const seedCustomers = async () => {
  try {
    console.log('🌱 Starting to seed customer users...');

    // ✅ Clear existing customer users
    await UserModel.deleteMany({ role: 'customer' });
    console.log('🗑️  Cleared existing customer users');

    const hashedPassword = await hashPassword('customer123');

    // ✅ Create multiple customers with different profiles
    const customersData = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        phone: '+1-555-1001',
        role: 'customer',
        avatarUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        isActive: true,
        joinDate: new Date('2024-03-15'),
        lastLogin: new Date('2024-12-20T18:30:00Z'),
        orders: 5,
        totalSpent: 2850000,
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        phone: '+1-555-1002',
        role: 'customer',
        avatarUrl:
          'https://images.unsplash.com/photo-1494790108755-2616b66e7cd0?w=150&h=150&fit=crop&crop=face',
        isActive: true,
        joinDate: new Date('2024-04-20'),
        lastLogin: new Date('2024-12-19T14:20:00Z'),
        orders: 12,
        totalSpent: 7200000,
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: hashedPassword,
        phone: '+1-555-1003',
        role: 'customer',
        isActive: true,
        joinDate: new Date('2024-05-10'),
        lastLogin: new Date('2024-12-18T10:45:00Z'),
        orders: 3,
        totalSpent: 1450000,
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        password: hashedPassword,
        phone: '+1-555-1004',
        role: 'customer',
        isActive: true,
        joinDate: new Date('2024-06-05'),
        lastLogin: new Date('2024-12-20T12:15:00Z'),
        orders: 8,
        totalSpent: 4320000,
      },
      {
        name: 'Alex Wilson',
        email: 'alex@example.com',
        password: hashedPassword,
        phone: '+1-555-1005',
        role: 'customer',
        isActive: true,
        joinDate: new Date('2024-07-12'),
        lastLogin: new Date('2024-12-17T16:30:00Z'),
        orders: 15,
        totalSpent: 9800000,
      },
      {
        name: 'Sarah Brown',
        email: 'sarah.brown@example.com',
        password: hashedPassword,
        phone: '+1-555-1006',
        role: 'customer',
        isActive: true,
        joinDate: new Date('2024-08-01'),
        lastLogin: new Date('2024-12-20T09:00:00Z'),
        orders: 6,
        totalSpent: 3200000,
      },
      {
        name: 'David Lee',
        email: 'david@example.com',
        password: hashedPassword,
        phone: '+1-555-1007',
        role: 'customer',
        isActive: true,
        joinDate: new Date('2024-09-15'),
        lastLogin: new Date('2024-12-19T20:45:00Z'),
        orders: 4,
        totalSpent: 2100000,
      },
      {
        name: 'Lisa Garcia',
        email: 'lisa@example.com',
        password: hashedPassword,
        phone: '+1-555-1008',
        role: 'customer',
        isActive: true,
        joinDate: new Date('2024-10-20'),
        lastLogin: new Date('2024-12-18T15:20:00Z'),
        orders: 9,
        totalSpent: 5600000,
      },
      {
        name: 'Robert Taylor',
        email: 'robert@example.com',
        password: hashedPassword,
        phone: '+1-555-1009',
        role: 'customer',
        isActive: true,
        joinDate: new Date('2024-11-01'),
        lastLogin: new Date('2024-12-20T11:30:00Z'),
        orders: 2,
        totalSpent: 980000,
      },
      {
        name: 'Jennifer Martinez',
        email: 'jennifer@example.com',
        password: hashedPassword,
        phone: '+1-555-1010',
        role: 'customer',
        isActive: true,
        joinDate: new Date('2024-11-15'),
        lastLogin: new Date('2024-12-19T17:10:00Z'),
        orders: 7,
        totalSpent: 4800000,
      },
      {
        name: 'Chris Anderson',
        email: 'chris@example.com',
        password: hashedPassword,
        phone: '+1-555-1011',
        role: 'customer',
        isActive: true,
        joinDate: new Date('2024-12-01'),
        lastLogin: new Date('2024-12-20T13:45:00Z'),
        orders: 1,
        totalSpent: 650000,
      },
      {
        name: 'Michelle White',
        email: 'michelle@example.com',
        password: hashedPassword,
        phone: '+1-555-1012',
        role: 'customer',
        isActive: true,
        joinDate: new Date('2024-12-05'),
        lastLogin: new Date('2024-12-18T19:20:00Z'),
        orders: 3,
        totalSpent: 1750000,
      },
      {
        name: 'Kevin Brown',
        email: 'kevin@example.com',
        password: hashedPassword,
        role: 'customer',
        isActive: false, // ✅ Inactive customer
        joinDate: new Date('2024-08-20'),
        lastLogin: new Date('2024-10-15T10:30:00Z'),
        orders: 2,
        totalSpent: 890000,
      },
      {
        name: 'Amanda Jones',
        email: 'amanda@example.com',
        password: hashedPassword,
        phone: '+1-555-1014',
        role: 'customer',
        isActive: true,
        joinDate: new Date('2024-12-10'),
        lastLogin: null, // ✅ Never logged in
        orders: 0,
        totalSpent: 0,
      },
      {
        name: 'Daniel Miller',
        email: 'daniel@example.com',
        password: hashedPassword,
        phone: '+1-555-1015',
        role: 'customer',
        isActive: true,
        joinDate: new Date('2024-12-15'),
        lastLogin: new Date('2024-12-20T08:15:00Z'),
        orders: 1,
        totalSpent: 1200000,
      },
    ];

    // Insert all customers
    const createdCustomers = await UserModel.insertMany(customersData);
    console.log(`✅ Successfully created ${createdCustomers.length} customers`);

    // Calculate statistics
    const activeCount = customersData.filter((c) => c.isActive).length;
    const inactiveCount = customersData.filter((c) => !c.isActive).length;
    const totalOrders = customersData.reduce((sum, c) => sum + c.orders, 0);
    const totalSpent = customersData.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    console.log('\n📊 Customer Statistics:');
    console.log(`   • Total Customers: ${createdCustomers.length}`);
    console.log(`   • Active: ${activeCount} | Inactive: ${inactiveCount}`);
    console.log(`   • Total Orders: ${totalOrders}`);
    console.log(`   • Total Spent: ${totalSpent.toLocaleString()} VND`);
    console.log(
      `   • Average Order Value: ${avgOrderValue.toLocaleString()} VND`,
    );

    console.log('\n👥 Sample customer accounts:');
    console.log('📧 Email: john@example.com | 🔑 Password: customer123');
    console.log('📧 Email: jane@example.com | 🔑 Password: customer123');
    console.log('📧 Email: mike@example.com | 🔑 Password: customer123');
    console.log('📧 Email: emily.davis@example.com | 🔑 Password: customer123');

    // Log top customers by spending
    const topCustomers = customersData
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    console.log('\n💰 Top 5 Customers by Spending:');
    topCustomers.forEach((customer, index) => {
      console.log(
        `   ${index + 1}. ${
          customer.name
        } - ${customer.totalSpent.toLocaleString()} VND (${
          customer.orders
        } orders)`,
      );
    });

    return createdCustomers;
  } catch (error) {
    console.error('❌ Error seeding customer users:', error);
    throw error;
  }
};
