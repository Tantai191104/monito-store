import ReviewModel, { IReview } from '../models/reviewModel';

export const reviewService = {
  async createReview(data: Partial<IReview>) {
    const review = new ReviewModel(data);
    return await review.save();
  },

  async updateReview(reviewId: string, data: { rating: number, comment: string, images: string[] }) {
    const review = await ReviewModel.findByIdAndUpdate(reviewId, data, { new: true });
    if (!review) {
      throw new Error('Review not found');
    }
    return review;
  },

  async deleteReview(reviewId: string) {
    const review = await ReviewModel.findByIdAndDelete(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }
    return review;
  },

  async getReviewsByProduct(productId: string) {
    return await ReviewModel.find({ productId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
  },

  async getReviewsByOrder(orderId: string) {
    return await ReviewModel.find({ orderId }).sort({ createdAt: -1 });
  },
}; 