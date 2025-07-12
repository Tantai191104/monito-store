/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Middlewares
 */
import { authenticate } from '../middlewares/authenticate';

/**
 * Controllers
 */
import { authController } from '../controllers/authController';

const authRoute = Router();

authRoute.post('/register', authController.register);
authRoute.post('/login', authController.login);
authRoute.post('/logout', authenticate, authController.logout);

authRoute.get('/refresh-token', authController.refreshToken);

// Password reset routes
authRoute.post('/forgot-password', authController.forgotPassword);
authRoute.post('/reset-password', authController.resetPassword);

export default authRoute;
