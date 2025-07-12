/**
 * Node modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Services
 */
import { paymentService } from '../services/paymentService';

/**
 * Constants
 */
import { STATUS_CODE } from '../constants';

export const paymentController = {
  /**
   * Create ZaloPay order and generate QR code
   */
  async createZaloPayOrder(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { orderId, amount, description } = req.body;

      if (!orderId || !amount || !description) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          message: 'Missing required fields: orderId, amount, description',
        });
        return;
      }

      const result = await paymentService.createZaloPayOrder({
        orderId,
        amount,
        description,
      });

      res.status(STATUS_CODE.CREATED).json({
        message: 'Payment order created successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Handle ZaloPay callback
   */
  async handleZaloPayCallback(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { data, mac } = req.body;

      if (!data || !mac) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          return_code: -1,
          return_message: 'Missing data or mac',
        });
        return;
      }

      const success = await paymentService.handleZaloPayCallback(data, mac);

      if (success) {
        res.json({ return_code: 1, return_message: 'OK' });
      } else {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          return_code: -1,
          return_message: 'Invalid callback',
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get payment transaction by order ID
   */
  async getTransactionByOrderId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { orderId } = req.params;

      const transaction = await paymentService.getTransactionByOrderId(orderId);

      if (!transaction) {
        res.status(STATUS_CODE.NOT_FOUND).json({
          message: 'Transaction not found',
        });
        return;
      }

      res.status(STATUS_CODE.OK).json({
        message: 'Transaction retrieved successfully',
        data: { transaction },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Generate text-to-speech for payment success
   */
  async generatePaymentSuccessTTS(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { amount } = req.body;

      if (!amount) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          message: 'Amount is required',
        });
        return;
      }

      const result = await paymentService.generatePaymentSuccessTTS({ amount });

      res.status(STATUS_CODE.OK).json({
        message: 'TTS generated successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
}; 