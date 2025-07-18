/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Middlewares
 */
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

/**
 * Controllers
 */
import { orderController } from '../controllers/orderController';

const orderRoute = Router();

// Customer routes
orderRoute.post('/', authenticate, authorize('customer'), orderController.createOrder);
orderRoute.get('/', authenticate, orderController.getOrders);
orderRoute.get('/:id', authenticate, orderController.getOrderById);
orderRoute.patch('/:id/cancel', authenticate, authorize('customer'), orderController.cancelOrder);
orderRoute.post('/:id/review', authenticate, authorize('customer'), orderController.addOrderReview);
orderRoute.delete('/:id/review', authenticate, authorize('customer'), orderController.deleteOrderReview);
orderRoute.patch('/:id/refund', authenticate, authorize('customer'), orderController.requestRefund);

// Staff/Admin routes
orderRoute.patch('/:id/status', authenticate, authorize('staff', 'admin'), orderController.updateOrderStatus);

export default orderRoute; 