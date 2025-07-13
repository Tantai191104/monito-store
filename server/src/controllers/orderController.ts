/**
 * Node modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Services
 */
import { orderService } from '../services/orderService';

/**
 * Constants
 */
import { STATUS_CODE } from '../constants';

export const orderController = {
  /**
   * Create new order
   */
  async createOrder(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const customerId = req.userId!;
      const order = await orderService.createOrder(customerId, req.body);

      res.status(STATUS_CODE.CREATED).json({
        message: 'Order created successfully',
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get orders (with customer filter if customer role)
   */
  async getOrders(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const filters = req.query;
      const customerId = req.userRole === 'customer' ? req.userId : undefined;
      
      const result = await orderService.getOrders(filters, customerId);

      res.status(STATUS_CODE.OK).json({
        message: 'Orders retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get order by ID
   */
  async getOrderById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const customerId = req.userRole === 'customer' ? req.userId : undefined;
      
      const order = await orderService.getOrderById(id, customerId);

      res.status(STATUS_CODE.OK).json({
        message: 'Order retrieved successfully',
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Cancel order (customer only)
   */
  async cancelOrder(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const customerId = req.userId!;
      
      const order = await orderService.cancelOrder(id, customerId);

      res.status(STATUS_CODE.OK).json({
        message: 'Order cancelled successfully',
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update order status (staff/admin only)
   */
  async updateOrderStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const order = await orderService.updateOrderStatus(id, status);

      res.status(STATUS_CODE.OK).json({
        message: 'Order status updated successfully',
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add review to order
   */
  async addOrderReview(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId!;
      const { rating, content } = req.body;
      const order = await orderService.addOrderReview(id, userId, rating, content);
      res.status(STATUS_CODE.OK).json({
        message: 'Review added successfully',
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete review from order
   */
  async deleteOrderReview(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId!;
      const order = await orderService.removeOrderReview(id, userId);
      res.status(200).json({ message: 'Review deleted', data: { order } });
    } catch (error) {
      next(error);
    }
  },
}; 