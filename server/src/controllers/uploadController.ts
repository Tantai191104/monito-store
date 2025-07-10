// server/src/controllers/uploadController.ts
import { Request, Response, NextFunction } from 'express';
import { uploadService } from '../services/uploadService';
import { STATUS_CODE } from '../constants';

export const uploadController = {
  async uploadImage(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.file) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          success: false,
          message: 'No image file provided',
        });
        return;
      }

      // Get folder from request body (default to 'products')
      const folder = req.body.folder || 'products';

      console.log(`📤 Uploading to folder: ${folder}`);
      console.log(
        `📄 File: ${req.file.originalname}, Size: ${req.file.size} bytes`,
      );

      const result = await uploadService.uploadToCloudinary(req.file, folder);

      console.log('✅ Cloudinary upload successful:', {
        url: result.secure_url,
        public_id: result.public_id,
        folder: result.folder,
      });

      res.status(STATUS_CODE.OK).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: result.secure_url,
          public_id: result.public_id,
          secure_url: result.secure_url,
          folder: result.folder,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
        },
      });
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      next(error);
    }
  },

  async deleteImage(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { publicId } = req.params;

      console.log(`🗑️ Deleting image: ${publicId}`);

      const result = await uploadService.deleteFromCloudinary(publicId);

      console.log('✅ Image deleted:', result);

      res.status(STATUS_CODE.OK).json({
        success: true,
        message: 'Image deleted successfully',
        data: result,
      });
    } catch (error) {
      console.error('❌ Delete error:', error);
      next(error);
    }
  },

  async getImagesByFolder(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { folder } = req.params;

      const result = await uploadService.getImagesByFolder(folder);

      res.status(STATUS_CODE.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
