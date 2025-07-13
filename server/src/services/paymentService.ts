/**
 * Node modules
 */
import axios from 'axios';
import crypto from 'crypto';
import moment from 'moment';

/**
 * Types
 */
import {
  ZaloPayConfig,
  CreateZaloPayOrderPayload,
  ZaloPayOrderResponse,
  ZaloPayCallbackData,
  PaymentTransaction,
  TTSPayload,
  TTSResponse,
} from '../types/payment';

/**
 * Models
 */
import PaymentTransactionModel from '../models/paymentTransactionModel';
import OrderModel from '../models/orderModel';

/**
 * Utils
 */
import { NotFoundException, BadRequestException } from '../utils/errors';

// ZaloPay Configuration
const zaloPayConfig: ZaloPayConfig = {
  app_id: process.env.ZALOPAY_APP_ID || "",
  key1: process.env.ZALOPAY_KEY1 || "",
  key2: process.env.ZALOPAY_KEY2 || "",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

export const paymentService = {
  /**
   * Create ZaloPay order and generate QR code
   */
  async createZaloPayOrder(data: CreateZaloPayOrderPayload): Promise<ZaloPayOrderResponse> {
    try {
      // Validate order exists
      const order = await OrderModel.findById(data.orderId);
      if (!order) {
        throw new NotFoundException('Order not found');
      }

      const app_trans_id = `${moment().format("YYMMDD")}_${data.orderId}`;
      const embed_data = {};
      const item: any[] = [];

      const requestData: any = {
        app_id: zaloPayConfig.app_id,
        app_trans_id,
        app_user: "monito_user",
        app_time: Date.now(),
        item: JSON.stringify(item),
        embed_data: JSON.stringify(embed_data),
        amount: data.amount,
        description: data.description,
        bank_code: "",
        callback_url: `${process.env.NGROK_URL}/api/v1/payment/zalopay/callback`,
      };

      // Create MAC signature
      const dataStr =
        zaloPayConfig.app_id +
        "|" +
        requestData.app_trans_id +
        "|" +
        requestData.app_user +
        "|" +
        requestData.amount +
        "|" +
        requestData.app_time +
        "|" +
        requestData.embed_data +
        "|" +
        requestData.item;

      requestData.mac = crypto
        .createHmac("sha256", zaloPayConfig.key1)
        .update(dataStr)
        .digest("hex");

      // Call ZaloPay API
      const response = await axios.post(zaloPayConfig.endpoint, null, {
        params: requestData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 10000,
      });

      // Log response for debugging
      console.log('ZaloPay response:', response.data);
      const zpTransToken = response.data.zp_trans_token;
      if (!zpTransToken) {
        throw new BadRequestException(response.data.return_message || 'ZaloPay trả về lỗi, không có mã giao dịch');
      }

      // Save transaction to database
      await PaymentTransactionModel.create({
        orderId: data.orderId,
        app_trans_id,
        zp_trans_token: zpTransToken,
        amount: data.amount,
        description: data.description,
        status: 'pending',
      });

      return {
        order_url: response.data.order_url,
        app_trans_id,
        zp_trans_token: zpTransToken,
      };
    } catch (error: any) {
      console.error("Error creating ZaloPay order:", error);
      throw new BadRequestException(
        error.response?.data?.message || "Failed to create payment order"
      );
    }
  },

  /**
   * Handle ZaloPay callback
   */
  async handleZaloPayCallback(callbackData: string, mac: string): Promise<boolean> {
    try {
      console.log('==> ZaloPay CALLBACK received:', callbackData); 
      // Validate MAC signature
      const macCheck = crypto
        .createHmac("sha256", zaloPayConfig.key2)
        .update(callbackData)
        .digest("hex");

      if (mac !== macCheck) {
        console.warn("Invalid MAC signature from ZaloPay");
        return false;
      }

      // Parse callback data
      const data: ZaloPayCallbackData = JSON.parse(callbackData);
      const { app_trans_id, zp_trans_id, server_time, amount } = data;

      // Update transaction status
      await PaymentTransactionModel.findOneAndUpdate(
        { app_trans_id },
        {
          status: 'success',
          zp_transaction_id: zp_trans_id,
          payment_time: new Date(server_time),
        }
      );

      // Update order payment status
      const transaction = await PaymentTransactionModel.findOne({ app_trans_id });
      if (transaction) {
        await OrderModel.findByIdAndUpdate(transaction.orderId, {
          paymentStatus: 'paid',
          paidAt: new Date(server_time),
        });
      }

      return true;
    } catch (error: any) {
      console.error("Error handling ZaloPay callback:", error);
      return false;
    }
  },

  /**
   * Get payment transaction by order ID
   */
  async getTransactionByOrderId(orderId: string) {
    return await PaymentTransactionModel.findOne({ orderId }).sort({ createdAt: -1 });
  },

  /**
   * Convert number to Vietnamese words for TTS
   */
  numberToVietnameseWords(num: number): string {
    const ones = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
    const tens = ["", "mười", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];

    if (num === 0) return "không";

    const toWordsBelowThousand = (n: number): string => {
      let result = "";

      const hundred = Math.floor(n / 100);
      const remainder = n % 100;
      const ten = Math.floor(remainder / 10);
      const unit = remainder % 10;

      if (hundred > 0) {
        result += ones[hundred] + " trăm ";
        if (remainder > 0 && ten === 0) result += "lẻ ";
      }

      if (ten > 1) {
        result += tens[ten] + (unit ? " " + ones[unit] : "");
      } else if (ten === 1) {
        result += "mười" + (unit ? " " + ones[unit] : "");
      } else if (ten === 0 && unit > 0) {
        result += ones[unit];
      }

      return result.trim();
    };

    let result = "";
    const million = Math.floor(num / 1_000_000);
    const thousand = Math.floor((num % 1_000_000) / 1_000);
    const belowThousand = num % 1_000;

    if (million > 0) {
      result += toWordsBelowThousand(million) + " triệu ";
    }

    if (thousand > 0) {
      result += toWordsBelowThousand(thousand) + " nghìn ";
    } else if (million > 0 && (belowThousand > 0 || thousand === 0)) {
      result += "không nghìn ";
    }

    if (belowThousand > 0) {
      result += toWordsBelowThousand(belowThousand);
    }

    return result.trim();
  },

  /**
   * Generate text-to-speech for payment success
   */
  async generatePaymentSuccessTTS(data: TTSPayload): Promise<TTSResponse> {
    try {
      if (!process.env.GOOGLE_API_KEY) {
        throw new BadRequestException("Google API key not configured");
      }

      // Clean amount
      const cleanAmount = parseInt(Number(data.amount).toString());
      
      // Convert to Vietnamese words
      const amountInWords = this.numberToVietnameseWords(cleanAmount);
      
      // Create complete message
      const message = `Thanh toán thành công ${amountInWords} đồng`;

      // Call Google TTS API
      const response = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_API_KEY}`,
        {
          input: { text: message },
          voice: { languageCode: "vi-VN", ssmlGender: "FEMALE" },
          audioConfig: { audioEncoding: "MP3" },
        },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.GOOGLE_API_KEY
          }
        }
      );

      return {
        audioContent: response.data.audioContent,
        message: message
      };
    } catch (error: any) {
      console.error("TTS Error:", error);
      throw new BadRequestException(
        error.response?.data?.error?.message || "Failed to generate TTS"
      );
    }
  },
}; 