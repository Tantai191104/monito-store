/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Middlewares
 */
import { authenticate } from '../middlewares/authenticate';
import { requireAdminOrStaff } from '../middlewares/authorize';

/**
 * Controllers
 */
import { colorController } from '../controllers/colorController';

const colorRoute = Router();

// Public routes
colorRoute.get('/', colorController.getColors);
colorRoute.get('/:id', colorController.getColorById);

// Protected routes - Only admin and staff can manage colors
colorRoute.post(
  '/',
  authenticate,
  requireAdminOrStaff,
  colorController.createColor,
);
colorRoute.put(
  '/:id',
  authenticate,
  requireAdminOrStaff,
  colorController.updateColor,
);
colorRoute.delete(
  '/:id',
  authenticate,
  requireAdminOrStaff,
  colorController.deleteColor,
);

export default colorRoute;
