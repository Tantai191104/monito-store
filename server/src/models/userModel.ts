/**
 * Node modules
 */
import mongoose, { Document, Schema } from 'mongoose';

/**
 * Utils
 */
import { comparePassword, hashPassword } from '../utils/bcryptjs';

// ✅ Extended interface với staff-specific fields
export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  avatarUrl: string | null;
  role: 'admin' | 'staff' | 'customer';
  isActive: boolean;
  lastLogin: Date | null;

  // ✅ Staff-specific fields
  department?: string;
  position?: string;
  permissions: string[];
  joinDate: Date;
  phone?: string;

  // ✅ Customer-specific fields
  orders?: number;
  totalSpent?: number;

  // ✅ Password reset fields
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  deletedAt?: Date | null;

  comparePassword(value: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Username is required'],
      maxLength: [50, 'Username must be less than 50 characters'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      maxLength: [50, 'Email must be less than 50 characters'],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      maxLength: [20, 'Phone number must be less than 20 characters'],
      unique: true,
      sparse: true, // ✅ Allow multiple nulls, but enforce uniqueness on provided values
      required: function (this: UserDocument) {
        return this.role === 'staff';
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['admin', 'staff', 'customer'],
        message: '{VALUE} is not supported',
      },
      default: 'customer',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },

    // ✅ Staff-specific fields
    department: {
      type: String,
      trim: true,
      enum: {
        values: [
          'Customer Service',
          'Product Management',
          'Operations',
          'Marketing',
        ],
        message: '{VALUE} is not a valid department',
      },
      required: function (this: UserDocument) {
        return this.role === 'staff';
      },
    },
    position: {
      type: String,
      trim: true,
      maxLength: [50, 'Position must be less than 50 characters'],
      required: function (this: UserDocument) {
        return this.role === 'staff';
      },
    },
    permissions: {
      type: [String],
      default: [],
      enum: {
        values: [
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
        message: '{VALUE} is not a valid permission',
      },
    },

    // ✅ Customer-specific fields (virtual hoặc computed)
    orders: {
      type: Number,
      default: 0,
      min: [0, 'Orders count cannot be negative'],
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: [0, 'Total spent cannot be negative'],
    },

    // ✅ Password reset fields
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
    methods: {
      comparePassword(value: string) {
        return comparePassword(value, this.password);
      },
    },
  },
);

// ✅ Pre-save middleware
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    if (this.password) {
      this.password = await hashPassword(this.password);
    }
  }

  // ✅ Set default permissions based on role
  if (this.isModified('role') && this.permissions.length === 0) {
    switch (this.role) {
      case 'admin':
        this.permissions = [
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
        ];
        break;
      case 'staff':
        this.permissions = ['products', 'pets', 'orders', 'customers'];
        break;
      case 'customer':
        this.permissions = [];
        break;
    }
  }

  next();
});

// ✅ Indexes for performance
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ department: 1 });
userSchema.index({ joinDate: -1 });

const UserModel = mongoose.model<UserDocument>('User', userSchema);
export default UserModel;
