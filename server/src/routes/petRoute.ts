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
import { petController } from '../controllers/petController';

const petRoute = Router();

// Public routes
petRoute.get('/', petController.getPets);
petRoute.get('/:id', petController.getPetById);

// Protected routes - Only admin and staff can manage pets
petRoute.post('/', authenticate, requireAdminOrStaff, petController.createPet);
petRoute.put(
  '/:id',
  authenticate,
  requireAdminOrStaff,
  petController.updatePet,
);
petRoute.delete(
  '/:id',
  authenticate,
  requireAdminOrStaff,
  petController.deletePet,
);
petRoute.patch(
  '/:id/availability',
  authenticate,
  requireAdminOrStaff,
  petController.updateAvailability,
);

export default petRoute;
