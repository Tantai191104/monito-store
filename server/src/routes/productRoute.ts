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
import { productController } from '../controllers/productController';

const productRoute = Router();

// Public routes
productRoute.get('/', productController.getProducts);
productRoute.get('/:id', productController.getProductById);

// Protected routes - Only admin and staff can manage products
productRoute.post(
  '/',
  authenticate,
  requireAdminOrStaff,
  productController.createProduct,
);
productRoute.patch(
  '/:id',
  authenticate,
  requireAdminOrStaff,
  productController.updateProduct,
);
productRoute.delete(
  '/:id',
  authenticate,
  requireAdminOrStaff,
  productController.deleteProduct,
);
productRoute.patch(
  '/:id/stock',
  authenticate,
  requireAdminOrStaff,
  productController.updateStock,
);

export default productRoute;
