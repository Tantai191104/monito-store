// client/src/services/uploadService.ts
import API from '@/lib/axios';

export interface UploadResponse {
  success: boolean;
  data?: {
    url: string;
    public_id: string;
    secure_url: string;
    folder: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
  };
  message?: string;
}

export const uploadService = {
  // Upload image to specific folder
  async uploadImage(
    file: File,
    folder: 'products' | 'pets' | 'categories' = 'products',
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder); // Specify folder

    try {
      console.log(`📤 Uploading ${file.name} to folder: ${folder}`);

      const response = await API.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          console.log(`📊 Upload progress: ${progress}%`);
        },
      });

      console.log('✅ Upload successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Upload failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Upload failed',
      };
    }
  },

  // Upload multiple images
  async uploadImages(
    files: File[],
    folder: 'products' | 'pets' | 'categories' = 'products',
  ): Promise<UploadResponse[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  },

  // Delete image from Cloudinary
  async deleteImage(publicId: string): Promise<boolean> {
    try {
      console.log(`🗑️ Deleting image: ${publicId}`);
      await API.delete(`/upload/image/${encodeURIComponent(publicId)}`);
      console.log('✅ Image deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Delete failed:', error);
      return false;
    }
  },

  // Get all images from a folder
  async getImagesByFolder(folder: string) {
    try {
      const response = await API.get(`/upload/images/${folder}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get images:', error);
      return { success: false, data: [] };
    }
  },
};
