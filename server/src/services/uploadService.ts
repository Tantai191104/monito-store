// server/src/services/uploadService.ts
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadService = {
  async uploadToCloudinary(
    file: Express.Multer.File,
    folder: string = 'products',
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          // 📁 Folder organization
          folder: `monito-store/${folder}`, // e.g., monito-store/products, monito-store/pets
          resource_type: 'image',

          // 🎨 Image transformations
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto:good' },
            { format: 'webp' }, // Convert to WebP for better performance
          ],

          // 🏷️ Tags for easier management
          tags: [folder, 'monito-store'],

          // 📝 Context metadata
          context: {
            source: 'staff-upload',
            folder: folder,
            uploaded_at: new Date().toISOString(),
          },
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('✅ Cloudinary upload success:', {
              public_id: result?.public_id,
              secure_url: result?.secure_url,
              folder: result?.folder,
            });
            resolve(result);
          }
        },
      );

      // Convert buffer to stream
      const stream = Readable.from(file.buffer);
      stream.pipe(uploadStream);
    });
  },

  async deleteFromCloudinary(publicId: string): Promise<any> {
    try {
      console.log(`🗑️ Deleting from Cloudinary: ${publicId}`);
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('✅ Cloudinary delete result:', result);
      return result;
    } catch (error) {
      console.error('❌ Cloudinary delete error:', error);
      throw error;
    }
  },

  // Get images by folder
  async getImagesByFolder(folder: string): Promise<any> {
    try {
      const result = await cloudinary.search
        .expression(`folder:monito-store/${folder}`)
        .sort_by('created_at', 'desc')
        .max_results(100)
        .execute();

      return result;
    } catch (error) {
      console.error('❌ Failed to get images by folder:', error);
      throw error;
    }
  },

  // Get folder stats
  async getFolderStats() {
    try {
      const folders = ['products', 'pets', 'categories'];
      const stats: { [key: string]: number } = {};

      for (const folder of folders) {
        const result = await cloudinary.search
          .expression(`folder:monito-store/${folder}`)
          .aggregate('resource_count')
          .execute();

        stats[folder] = result.total_count || 0;
      }

      return stats;
    } catch (error) {
      console.error('❌ Failed to get folder stats:', error);
      throw error;
    }
  },
};
