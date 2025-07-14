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
import { paymentController } from '../controllers/paymentController';

const paymentRoute = Router();

// Create ZaloPay order and generate QR code
paymentRoute.post('/zalopay/create-order', authenticate, paymentController.createZaloPayOrder);

// Handle ZaloPay callback (no auth required - called by ZaloPay)
paymentRoute.post('/zalopay/callback', paymentController.handleZaloPayCallback);

// Get payment transaction by order ID
paymentRoute.get('/transaction/:orderId', authenticate, paymentController.getTransactionByOrderId);

// Generate text-to-speech for payment success
paymentRoute.post('/tts/payment-success', authenticate, paymentController.generatePaymentSuccessTTS);

export default paymentRoute; 