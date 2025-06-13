/**
 * Node modules
 */
import mongoose, { Document, Schema } from 'mongoose';

export interface CategoryDocument extends Document {
  name: string;
  description?: string;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: [true, 'Category name must be unique'],
      trim: true,
      maxLength: [50, 'Category name must be less than 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [200, 'Description must be less than 200 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.index({ name: 1 });
categorySchema.index({ isActive: 1 });

const CategoryModel = mongoose.model<CategoryDocument>(
  'Category',
  categorySchema,
);
export default CategoryModel;
