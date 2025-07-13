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
import { breedController } from '../controllers/breedController';

const breedRoute = Router();

// Public routes
breedRoute.get('/', breedController.getBreeds);
breedRoute.get('/:id', breedController.getBreedById);

// Protected routes - Only admin and staff can manage breeds
breedRoute.post(
  '/',
  authenticate,
  requireAdminOrStaff,
  breedController.createBreed,
);
breedRoute.patch(
  '/:id',
  authenticate,
  requireAdminOrStaff,
  breedController.updateBreed,
);
breedRoute.delete(
  '/:id',
  authenticate,
  requireAdminOrStaff,
  breedController.deleteBreed,
);
breedRoute.post(
  '/bulk-delete',
  authenticate,
  requireAdminOrStaff,
  breedController.bulkDeleteBreeds,
);
breedRoute.get(
  '/:id/usage-stats',
  authenticate,
  requireAdminOrStaff,
  breedController.getBreedUsageStats,
);

export default breedRoute;
