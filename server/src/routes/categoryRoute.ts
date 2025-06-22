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
import { categoryController } from '../controllers/categoryController';

const categoryRoute = Router();

// Public routes
categoryRoute.get('/', categoryController.getCategories);
categoryRoute.get('/:id', categoryController.getCategoryById);

// Protected routes - Only admin and staff can manage categories
categoryRoute.post(
  '/',
  authenticate,
  requireAdminOrStaff,
  categoryController.createCategory,
);
categoryRoute.patch(
  '/:id',
  authenticate,
  requireAdminOrStaff,
  categoryController.updateCategory,
);
categoryRoute.delete(
  '/:id',
  authenticate,
  requireAdminOrStaff,
  categoryController.deleteCategory,
);

export default categoryRoute;
