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
import { userController } from '../controllers/userController';

const userRoute = Router();

userRoute.get('/current-user', authenticate, userController.getCurrentUser);
userRoute.put('/profile', authenticate, userController.updateProfile);
userRoute.put('/change-password', authenticate, userController.changePassword);

export default userRoute;
