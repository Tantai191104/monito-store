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

export default userRoute;
