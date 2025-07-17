import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  orderId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  images: string[];
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema<IReview>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IReview>('Review', ReviewSchema); 