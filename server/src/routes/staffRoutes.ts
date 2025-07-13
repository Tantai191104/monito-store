import { Router } from 'express';
import { staffController } from '../controllers/staffController';

/**
 * Middlewares
 */
import { authenticate } from '../middlewares/authenticate';
import { requireAdmin } from '../middlewares/authorize';

const staffRoute = Router();

// ✅ All routes require admin access
staffRoute.use(authenticate);
staffRoute.use(requireAdmin);

// Staff CRUD operations
staffRoute.get('/stats', staffController.getStaffStats);
staffRoute.get('/', staffController.getStaff);
staffRoute.get('/:id', staffController.getStaffById);
staffRoute.post('/', staffController.createStaff);
staffRoute.patch('/:id', staffController.updateStaff);
staffRoute.delete('/:id', staffController.deleteStaff);

// Permission management
staffRoute.patch('/:id/permissions', staffController.updatePermissions);

export default staffRoute;
