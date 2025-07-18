import { Request, Response, NextFunction } from 'express';
import { reviewService } from '../services/reviewService';
import { STATUS_CODE } from '../constants';
import mongoose from 'mongoose';

export const reviewController = {
  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId, productId } = req.params;
      const userId = req.body.userId; // Lấy userId từ body
      const { rating, comment, images } = req.body;
      const review = await reviewService.createReview({
        orderId: new mongoose.Types.ObjectId(orderId),
        productId: new mongoose.Types.ObjectId(productId),
        userId: new mongoose.Types.ObjectId(userId),
        rating,
        comment,
        images,
      });
      res.status(STATUS_CODE.CREATED).json({
        success: true,
        message: 'Review created successfully',
        data: review,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { reviewId } = req.params;
      const { rating, comment, images } = req.body;
      const review = await reviewService.updateReview(reviewId, { rating, comment, images });
      res.status(STATUS_CODE.OK).json({
        success: true,
        message: 'Review updated successfully',
        data: review,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { reviewId } = req.params;
      await reviewService.deleteReview(reviewId);
      res.status(STATUS_CODE.OK).json({
        success: true,
        message: 'Review deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async getReviewsByProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const reviews = await reviewService.getReviewsByProduct(productId);
      res.status(STATUS_CODE.OK).json({
        success: true,
        data: reviews,
      });
    } catch (error) {
      next(error);
    }
  },
}; 