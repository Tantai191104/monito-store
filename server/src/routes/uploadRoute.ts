// server/src/routes/uploadRoute.ts
import { Router } from 'express';
import multer from 'multer';
import { uploadController } from '../controllers/uploadController';
import { authenticate } from '../middlewares/authenticate';
import { requireAdminOrStaff } from '../middlewares/authorize';

const uploadRoute = Router();

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Routes
uploadRoute.post(
  '/image',
  authenticate,
  upload.single('image'),
  uploadController.uploadImage,
);

uploadRoute.delete(
  '/image/:publicId',
  authenticate,
  requireAdminOrStaff,
  uploadController.deleteImage,
);

uploadRoute.get(
  '/images/:folder',
  authenticate,
  requireAdminOrStaff,
  uploadController.getImagesByFolder,
);

export default uploadRoute;
