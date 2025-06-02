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

export default authRoute;
