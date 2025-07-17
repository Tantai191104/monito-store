/**
 * Node modules
 */
import mongoose, { Document, Schema } from 'mongoose';

export interface OrderItem {
  type: 'pet' | 'product';
  item: mongoose.Types.ObjectId;
  quantity: number;
  subtotal: number;
}

export interface ShippingAddress {
  street: string;
  province: string;
  district: string;
}

export interface OrderReview {
  user: mongoose.Types.ObjectId;
  rating: number;
  content: string;
  createdAt: Date;
}

export interface OrderDocument extends Document {
  orderNumber: string;
  customer: mongoose.Types.ObjectId;
  items: OrderItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled' | 'refunded' | 'pending_refund';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: ShippingAddress;
  orderDate: Date;
  estimatedDelivery?: Date;
  notes?: string;
  order_url?: string;
  reviews?: OrderReview[];
  refundInfo?: RefundInfo;
}

export interface RefundInfo {
  reason: string;
  bankName: string;
  accountNumber: string;
  description?: string;
  images?: string[];
  amount: number;
  requestedAt: Date;
}

const orderItemSchema = new Schema<OrderItem>({
  type: {
    type: String,
    required: [true, 'Item type is required'],
    enum: {
      values: ['pet', 'product'],
      message: '{VALUE} is not a valid item type',
    },
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Item reference is required'],
    ref: 'Product', // Default to Product, we'll handle Pet separately
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
  },
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal cannot be negative'],
  },
});

const shippingAddressSchema = new Schema<ShippingAddress>({
  street: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true,
  },
  province: {
    type: String,
    required: [true, 'Province is required'],
    trim: true,
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true,
  },
});

const orderReviewSchema = new Schema<OrderReview>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  content: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const refundInfoSchema = new Schema<RefundInfo>({
  reason: { type: String, required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }],
  amount: { type: Number, required: true },
  requestedAt: { type: Date, required: true },
});

const orderSchema = new Schema<OrderDocument>(
  {
    orderNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
    },
    items: {
      type: [orderItemSchema],
      required: [true, 'Order items are required'],
      validate: {
        validator: function (v: OrderItem[]) {
          return v && v.length > 0;
        },
        message: 'Order must have at least one item',
      },
    },
    totalItems: {
      type: Number,
      required: [true, 'Total items count is required'],
      min: [1, 'Total items must be at least 1'],
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative'],
    },
    tax: {
      type: Number,
      required: [true, 'Tax amount is required'],
      min: [0, 'Tax cannot be negative'],
    },
    shipping: {
      type: Number,
      required: [true, 'Shipping cost is required'],
      min: [0, 'Shipping cost cannot be negative'],
    },
    total: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total cannot be negative'],
    },
    status: {
      type: String,
      required: [true, 'Order status is required'],
      enum: {
        values: ['pending', 'processing', 'delivered', 'cancelled', 'refunded', 'pending_refund'],
        message: '{VALUE} is not a valid order status',
      },
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      required: [true, 'Payment status is required'],
      enum: {
        values: ['pending', 'paid', 'failed', 'refunded'],
        message: '{VALUE} is not a valid payment status',
      },
      default: 'pending',
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: [true, 'Shipping address is required'],
    },
    orderDate: {
      type: Date,
      required: [true, 'Order date is required'],
      default: Date.now,
    },
    estimatedDelivery: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
      maxLength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    order_url: {
      type: String,
      default: null,
    },
    reviews: {
      type: [orderReviewSchema],
      default: [],
    },
    refundInfo: {
      type: refundInfoSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save middleware to generate order number
orderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    try {
      const count = await (this.constructor as any).countDocuments();
      this.orderNumber = `ORD-${String(1000 + count + 1).padStart(4, '0')}`;
    } catch (error) {
      // Fallback to timestamp-based order number if count fails
      this.orderNumber = `ORD-${Date.now()}`;
    }
  }
  next();
});

// Pre-save middleware to calculate totals
orderSchema.pre('save', function (next) {
  if (this.isModified('items')) {
    this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
    this.tax = Math.round(this.subtotal * 0.1); // 10% tax
    this.shipping = this.subtotal > 5000000 ? 0 : 30000; // Free shipping over 5M VND, else 30k
    this.total = this.subtotal + this.tax + this.shipping;
  }
  next();
});

// Pre-save middleware to set estimated delivery
orderSchema.pre('save', function (next) {
  if (this.isNew && !this.estimatedDelivery) {
    const deliveryDate = new Date(this.orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 7); // 7 days from order date
    this.estimatedDelivery = deliveryDate;
  }
  next();
});

const OrderModel = mongoose.model<OrderDocument>('Order', orderSchema);

export default OrderModel; 