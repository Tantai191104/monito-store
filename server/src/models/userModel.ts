/**
 * Node modules
 */
import mongoose, { Document, Schema } from 'mongoose';

/**
 * Utils
 */
import { comparePassword, hashPassword } from '../utils/bcryptjs';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  avatarUrl: string | null;
  isActive: boolean;
  lastLogin: Date | null;
  comparePassword(value: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      },
    },
    methods: {
      comparePassword(value: string) {
        return comparePassword(value, this.password);
      },
    },
  },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    if (this.password) {
      this.password = await hashPassword(this.password);
    }
  }
  next();
});

const UserModel = mongoose.model<UserDocument>('User', userSchema);
export default UserModel;
