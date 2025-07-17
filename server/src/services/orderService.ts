/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Types
 */
import { CreateOrderPayload, OrderFilters } from '../types/order';

/**
 * Models
 */
import OrderModel, { OrderDocument } from '../models/orderModel';
import ProductModel from '../models/productModel';
import PetModel from '../models/petModel';
import UserModel from '../models/userModel';
import ReviewModel from '../models/reviewModel';
import { paymentService } from './paymentService';

/**
 * Utils
 */
import { NotFoundException, BadRequestException } from '../utils/errors';
import { ERROR_CODE_ENUM } from '../constants';

export const orderService = {
  /**
   * Create new order
   */
  async createOrder(customerId: string, data: CreateOrderPayload) {
    const session = await mongoose.startSession();
    let order: any = null;
    try {
      await session.withTransaction(async () => {
        // Validate customer exists
        const customer = await UserModel.findById(customerId).session(session);
        if (!customer) {
          throw new NotFoundException('Customer not found');
        }

        // Process order items and validate stock
        const orderItems = [];
        let subtotal = 0;

        for (const itemData of data.items) {
          let item;
          let price = 0;
          let image = '';

          if (itemData.type === 'product') {
            item = await ProductModel.findById(itemData.itemId).session(session);
            if (!item) {
              throw new NotFoundException(`Product with ID ${itemData.itemId} not found`);
            }
            if (!item.isActive) {
              throw new BadRequestException(`Product ${item.name} is not available`);
            }
            if (item.stock < itemData.quantity) {
              throw new BadRequestException(`Insufficient stock for product ${item.name}`);
            }
            price = item.price;
            image = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : '';
          } else if (itemData.type === 'pet') {
            item = await PetModel.findById(itemData.itemId).session(session);
            if (!item) {
              throw new NotFoundException(`Pet with ID ${itemData.itemId} not found`);
            }
            if (!item.isAvailable) {
              throw new BadRequestException(`Pet ${item.name} is not available`);
            }
            if (itemData.quantity > 1) {
              throw new BadRequestException('Only 1 pet can be ordered at a time');
            }
            price = item.price;
            image = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : '';
          }

          const itemSubtotal = price * itemData.quantity;
          subtotal += itemSubtotal;

          orderItems.push({
            type: itemData.type,
            item: itemData.itemId,
            quantity: itemData.quantity,
            subtotal: itemSubtotal,
            image,
          });

          // Update stock for products
          if (itemData.type === 'product') {
            await ProductModel.findByIdAndUpdate(
              itemData.itemId,
              { $inc: { stock: -itemData.quantity } },
              { session }
            );
          }
        }

        // Calculate totals
        const tax = Math.round(subtotal * 0.1); // 10% tax
        const shipping = subtotal > 5000000 ? 0 : 30000; // Free shipping over 5M VND, else 30k
        const total = subtotal + tax + shipping;

        // Create order
        order = new OrderModel({
          customer: customerId,
          items: orderItems,
          totalItems: orderItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal,
          tax,
          shipping,
          total,
          shippingAddress: {
            street: data.shippingAddress.street,
            province: (data.shippingAddress as any).province || data.shippingAddress.city || '',
            district: (data.shippingAddress as any).district || data.shippingAddress.state || '',
          },
          notes: data.notes,
        });

        await order.save({ session });

        // Update customer stats
        await UserModel.findByIdAndUpdate(
          customerId,
          { 
            $inc: { 
              orders: 1,
              totalSpent: total 
            } 
          },
          { session }
        );

        // Populate references
        await order.populate([
          { path: 'customer', select: 'name email phone' },
        ]);
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }

    // Sau khi transaction đã xong, gọi ZaloPay nếu cần
    let order_url = null;
    if (data.paymentMethod === 'zalopay') {
      if (!order) {
        throw new Error('Order was not created');
      }
      const zaloPayRes = await paymentService.createZaloPayOrder({
        orderId: (order as OrderDocument)._id.toString(),
        amount: (order as OrderDocument).total,
        description: `Thanh toán đơn hàng #${(order as OrderDocument).orderNumber}`,
      });
      (order as OrderDocument).order_url = zaloPayRes.order_url;
      await (order as OrderDocument).save();
      order_url = zaloPayRes.order_url;
    }

    if (!order) {
      throw new Error('Order was not created');
    }
    return { ...((order as unknown as OrderDocument).toObject()), order_url };
  },

  /**
   * Get orders with filters and pagination
   */
  async getOrders(filters: OrderFilters, customerId?: string) {
    const {
      status,
      paymentStatus,
      page = 1,
      limit = 15,
      sortBy = 'orderDate',
      sortOrder = 'desc',
      search,
    } = filters;

    // Build query
    const query: any = {};

    // Filter by customer if provided
    if (customerId) {
      query.customer = customerId;
    }

    // Apply filters
    if (status) {
      query.status = status;
    }
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [orders, total] = await Promise.all([
      OrderModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate([
          { path: 'customer', select: 'name email phone' },
          { path: 'items.item', select: 'name price images' },
        ])
        .lean(),
      OrderModel.countDocuments(query),
    ]);

    // Populate reviews cho từng order
    for (const order of orders) {
      (order as any).reviews = await ReviewModel.find({ orderId: (order as any)._id }).lean();
    }

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string, customerId?: string) {
    const query: any = { _id: orderId };
    
    // If customerId provided, ensure order belongs to customer
    if (customerId) {
      query.customer = customerId;
    }

    const order = await OrderModel.findOne(query).populate([
      { path: 'customer', select: 'name email phone' },
      { path: 'items.item', select: 'name price images description' },
    ]).lean();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Populate reviews cho order
    (order as any).reviews = await ReviewModel.find({ orderId: (order as any)._id }).lean();

    return order;
  },

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, customerId: string) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const order = await OrderModel.findOne({
          _id: orderId,
          customer: customerId,
        }).session(session);

        if (!order) {
          throw new NotFoundException('Order not found');
        }

        if (order.status !== 'pending') {
          throw new BadRequestException('Only pending orders can be cancelled');
        }

        // Update order status
        order.status = 'cancelled';
        await order.save({ session });

        // Restore stock for products
        for (const item of order.items) {
          if (item.type === 'product') {
            await ProductModel.findByIdAndUpdate(
              item.item,
              { $inc: { stock: item.quantity } },
              { session }
            );
          }
        }

        // Update customer stats
        await UserModel.findByIdAndUpdate(
          customerId,
          { 
            $inc: { 
              orders: -1,
              totalSpent: -order.total 
            } 
          },
          { session }
        );

        await order.populate([
          { path: 'customer', select: 'name email phone' },
          { path: 'items.item', select: 'name price images' },
        ]);

        return order;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Update order status (for staff/admin)
   */
  async updateOrderStatus(orderId: string, status: 'pending' | 'processing' | 'delivered' | 'cancelled' | 'refunded') {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Chỉ cho phép chuyển trạng thái hợp lệ theo business logic
    const validTransitions: Record<string, string[]> = {
      pending: ['processing', 'cancelled'],
      processing: ['delivered'], // Chỉ cho phép delivered từ processing
      delivered: [], // Không cho phép thay đổi từ delivered
      pending_refund: ['refunded'], // Chỉ cho phép refunded từ pending_refund
      cancelled: [], // Không cho phép thay đổi từ cancelled
      refunded: [], // Không cho phép thay đổi từ refunded
    };
    if (!validTransitions[order.status].includes(status)) {
      throw new BadRequestException(`Cannot change status from ${order.status} to ${status}`);
    }

    // Xử lý cập nhật stock khi chuyển trạng thái
    if (order.status === 'pending' && status === 'processing') {
      // Stock đã được giảm khi tạo order, không cần giảm thêm
      // Chỉ cần đánh dấu pet là không có sẵn
      for (const item of order.items) {
        if (item.type === 'pet') {
          await PetModel.findByIdAndUpdate(
            item.item,
            { isAvailable: false }
          );
        }
      }
    }
    
    if (order.status === 'pending' && status === 'cancelled') {
      // Hoàn trả stock khi hủy đơn từ pending
      for (const item of order.items) {
        if (item.type === 'product') {
          await ProductModel.findByIdAndUpdate(
            item.item,
            { $inc: { stock: item.quantity } }
          );
        }
        // Pet vẫn available vì chưa được reserve
      }
    }
    
    if (status === 'refunded') {
      // Cộng lại stock khi hoàn tiền
      for (const item of order.items) {
        if (item.type === 'product') {
          await ProductModel.findByIdAndUpdate(
            item.item,
            { $inc: { stock: item.quantity } }
          );
        } else if (item.type === 'pet') {
          await PetModel.findByIdAndUpdate(
            item.item,
            { isAvailable: true }
          );
        }
      }
    }

    order.status = status;
    await order.save();

    await order.populate([
      { path: 'customer', select: 'name email phone' },
      { path: 'items.item', select: 'name price images' },
    ]);

    return order;
  },

  /**
   * Add review to order
   */
  async addOrderReview(orderId: string, userId: string, rating: number, content: string) {
    const order = await OrderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'delivered') throw new BadRequestException('Order must be delivered to review');
    order.reviews = order.reviews || [];
    const existing = order.reviews.find(r => r.user.toString() === userId);
    if (existing) {
      (existing as any).rating = rating;
      (existing as any).content = content;
      (existing as any).createdAt = new Date();
    } else {
      order.reviews.push({ user: new mongoose.Types.ObjectId(userId), rating, content, createdAt: new Date() });
    }
    await order.save();
    return order;
  },

  /**
   * Remove review from order
   */
  async removeOrderReview(orderId: string, userId: string) {
    const order = await OrderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    order.reviews = (order.reviews || []).filter(r => r.user.toString() !== userId);
    await order.save();
    return order;
  },

  /**
   * Request refund (customer)
   */
  async requestRefund(orderId: string, customerId: string, refundData: { reason: string, bankName: string, accountNumber: string, description?: string, images?: string[] }) {
    const order = await OrderModel.findOne({ _id: orderId, customer: customerId });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'delivered' && order.status !== 'pending_refund') throw new BadRequestException('Only delivered or pending refund orders can be refunded/edited');
    order.status = 'pending_refund';
    order.refundInfo = {
      reason: refundData.reason,
      bankName: refundData.bankName,
      accountNumber: refundData.accountNumber,
      description: refundData.description || '',
      images: refundData.images || [],
      amount: order.total,
      requestedAt: new Date(),
    };
    await order.save();
    return order;
  },
}; 