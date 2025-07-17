import { Router } from 'express';
import { reviewController } from '../controllers/reviewController';

const router = Router();

// Tạo review cho sản phẩm trong đơn hàng
router.post('/orders/:orderId/products/:productId/reviews', reviewController.createReview);

// Cập nhật review
router.put('/reviews/:reviewId', reviewController.updateReview);

// Xóa review
router.delete('/reviews/:reviewId', reviewController.deleteReview);

// Lấy review theo productId
router.get('/products/:productId/reviews', reviewController.getReviewsByProduct);

export default router; 