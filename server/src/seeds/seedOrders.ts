import mongoose from 'mongoose';
import OrderModel from '../models/orderModel';
import UserModel from '../models/userModel';
import ProductModel from '../models/productModel';

export const seedOrders = async () => {
  try {
    console.log('🌱 Starting to seed orders...');

    // Xóa các đơn hàng cũ
    await OrderModel.deleteMany({});
    console.log('🗑️  Cleared existing orders');

    // Lấy customer, product mẫu
    const customers = await UserModel.find({ role: 'customer' }).limit(2);
    const products = await ProductModel.find({}).limit(2);
    if (customers.length < 1 || products.length < 2) {
      throw new Error('Not enough customers/products to seed orders');
    }

    const shippingAddress = {
      street: '123 ABC',
      province: 'Thành phố Hà Nội',
      district: 'Quận Hoàn Kiếm',
    };

    const now = new Date();
    const ordersData = [
      // 1. Pending (product)
      {
        customer: customers[0]._id,
        items: [
          {
            type: 'product',
            item: products[0]._id,
            quantity: 2,
            subtotal: products[0].price * 2,
          },
        ],
        totalItems: 2,
        subtotal: products[0].price * 2,
        tax: Math.round(products[0].price * 2 * 0.1),
        shipping: 30000,
        total:
          products[0].price * 2 +
          Math.round(products[0].price * 2 * 0.1) +
          30000,
        status: 'pending',
        paymentStatus: 'pending',
        shippingAddress,
        orderDate: now,
        notes: 'Seed order pending',
      },
      // 2. Processing (product)
      {
        customer: customers[0]._id,
        items: [
          {
            type: 'product',
            item: products[1]._id,
            quantity: 1,
            subtotal: products[1].price,
          },
        ],
        totalItems: 1,
        subtotal: products[1].price,
        tax: Math.round(products[1].price * 0.1),
        shipping: 30000,
        total: products[1].price + Math.round(products[1].price * 0.1) + 30000,
        status: 'processing',
        paymentStatus: 'paid',
        shippingAddress,
        orderDate: now,
        notes: 'Seed order processing',
      },
      // 3. Delivered (product)
      {
        customer: customers[1]._id,
        items: [
          {
            type: 'product',
            item: products[0]._id,
            quantity: 1,
            subtotal: products[0].price,
          },
        ],
        totalItems: 1,
        subtotal: products[0].price,
        tax: Math.round(products[0].price * 0.1),
        shipping: 30000,
        total: products[0].price + Math.round(products[0].price * 0.1) + 30000,
        status: 'delivered',
        paymentStatus: 'paid',
        shippingAddress,
        orderDate: now,
        notes: 'Seed order delivered',
      },
      // 4. Cancelled (product)
      {
        customer: customers[1]._id,
        items: [
          {
            type: 'product',
            item: products[1]._id,
            quantity: 1,
            subtotal: products[1].price,
          },
        ],
        totalItems: 1,
        subtotal: products[1].price,
        tax: Math.round(products[1].price * 0.1),
        shipping: 30000,
        total: products[1].price + Math.round(products[1].price * 0.1) + 30000,
        status: 'cancelled',
        paymentStatus: 'failed',
        shippingAddress,
        orderDate: now,
        notes: 'Seed order cancelled',
      },
      // 5. Refunded (product)
      {
        customer: customers[0]._id,
        items: [
          {
            type: 'product',
            item: products[0]._id,
            quantity: 1,
            subtotal: products[0].price,
          },
        ],
        totalItems: 1,
        subtotal: products[0].price,
        tax: Math.round(products[0].price * 0.1),
        shipping: 30000,
        total: products[0].price + Math.round(products[0].price * 0.1) + 30000,
        status: 'refunded',
        paymentStatus: 'refunded',
        shippingAddress,
        orderDate: now,
        notes: 'Seed order refunded',
      },
    ];

    // ❌ Don't use insertMany as it bypasses 'save' middleware
    // const createdOrders = await OrderModel.insertMany(ordersData);

    // ✅ Use a loop with .create() to trigger pre-save hooks for orderNumber
    const createdOrders = [];
    for (const orderData of ordersData) {
      const createdOrder = await OrderModel.create(orderData);
      createdOrders.push(createdOrder);
    }

    console.log(`✅ Successfully seeded ${createdOrders.length} orders`);
    return createdOrders;
  } catch (error) {
    console.error('❌ Error seeding orders:', error);
    throw error;
  }
};
