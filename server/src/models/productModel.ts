/**
 * Node modules
 */
import mongoose, { Document, Schema } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  category: mongoose.Types.ObjectId;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  images: string[];
  specifications: {
    weight?: string;
    size?: string;
    material?: string;
    color?: string;
    ingredients?: string[];
  };
  stock: number;
  isInStock: boolean;
  tags: string[];
  gifts?: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
}

const productSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxLength: [200, 'Product name must be less than 200 characters'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      maxLength: [100, 'Brand name must be less than 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be greater than 0'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price must be greater than 0'],
    },
    discount: {
      type: Number,
      min: [0, 'Discount must be greater than or equal to 0'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxLength: [2000, 'Description must be less than 2000 characters'],
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    specifications: {
      weight: {
        type: String,
        trim: true,
      },
      size: {
        type: String,
        trim: true,
      },
      material: {
        type: String,
        trim: true,
      },
      color: {
        type: String,
        trim: true,
      },
      ingredients: {
        type: [String],
        default: [],
      },
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    isInStock: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    gifts: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      min: [0, 'Rating must be between 0 and 5'],
      max: [5, 'Rating must be between 0 and 5'],
      default: 0,
    },
    reviewCount: {
      type: Number,
      min: [0, 'Review count cannot be negative'],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save middleware to update isInStock based on stock
productSchema.pre('save', function (next) {
  this.isInStock = this.stock > 0;
  next();
});

// Pre-save middleware to calculate discount if originalPrice is provided
productSchema.pre('save', function (next) {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discount = Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100,
    );
  }
  next();
});

// Indexes for better performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

const ProductModel = mongoose.model<ProductDocument>('Product', productSchema);
export default ProductModel;
