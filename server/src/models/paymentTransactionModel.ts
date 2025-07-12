/**
 * Node modules
 */
import mongoose, { Document, Schema } from 'mongoose';

/**
 * Types
 */
import { PaymentTransaction } from '../types/payment';

export interface IPaymentTransaction extends PaymentTransaction, Document {
  createdAt: Date;
  updatedAt: Date;
}

const paymentTransactionSchema = new Schema<IPaymentTransaction>(
  {
    orderId: {
      type: String,
      required: true,
      ref: 'Order',
    },
    app_trans_id: {
      type: String,
      required: true,
      unique: true,
    },
    zp_trans_token: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    zp_transaction_id: {
      type: String,
    },
    payment_time: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries (remove duplicate for app_trans_id since unique: true already creates index)
paymentTransactionSchema.index({ orderId: 1 });
paymentTransactionSchema.index({ status: 1 });

const PaymentTransactionModel = mongoose.model<IPaymentTransaction>(
  'PaymentTransaction',
  paymentTransactionSchema
);

export default PaymentTransactionModel; 