/**
 * Node modules
 */
import mongoose, { Document, Schema } from 'mongoose';

export interface PetDocument extends Document {
  name: string;
  breed: mongoose.Types.ObjectId;
  gender: 'Male' | 'Female';
  age: string;
  size: 'Small' | 'Medium' | 'Large';
  color: mongoose.Types.ObjectId;
  price: number;
  images: string[];
  description?: string;
  isVaccinated: boolean;
  isDewormed: boolean;
  hasCert: boolean;
  hasMicrochip: boolean;
  location: string;
  publishedDate: Date;
  additionalInfo?: string;
  isAvailable: boolean;
}

const petSchema = new Schema<PetDocument>(
  {
    name: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
      maxLength: [100, 'Pet name must be less than 100 characters'],
    },
    breed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Breed',
      required: [true, 'Breed is required'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
        values: ['Male', 'Female'],
        message: '{VALUE} is not a valid gender',
      },
    },
    age: {
      type: String,
      required: [true, 'Age is required'],
      trim: true,
    },
    size: {
      type: String,
      required: [true, 'Size is required'],
      enum: {
        values: ['Small', 'Medium', 'Large'],
        message: '{VALUE} is not a valid size',
      },
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Color',
      required: [true, 'Color is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be greater than 0'],
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
    description: {
      type: String,
      trim: true,
      maxLength: [1000, 'Description must be less than 1000 characters'],
    },
    isVaccinated: {
      type: Boolean,
      default: false,
    },
    isDewormed: {
      type: Boolean,
      default: false,
    },
    hasCert: {
      type: Boolean,
      default: false,
    },
    hasMicrochip: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    additionalInfo: {
      type: String,
      trim: true,
      maxLength: [500, 'Additional info must be less than 500 characters'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better performance
petSchema.index({ breed: 1 });
petSchema.index({ color: 1 });
petSchema.index({ price: 1 });
petSchema.index({ publishedDate: -1 });
petSchema.index({ isAvailable: 1 });

const PetModel = mongoose.model<PetDocument>('Pet', petSchema);
export default PetModel;
