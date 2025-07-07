// client/src/pages/staff/product/components/ProductImageUpload.tsx
import { useState, useCallback } from 'react';
import { Upload, Package, X, AlertCircle, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { uploadService } from '@/services/uploadService'; // Real upload service

interface ProductImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const ProductImageUpload = ({
  images,
  onImagesChange,
}: ProductImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 🔧 Real upload function using uploadService
  const uploadImage = async (file: File): Promise<string> => {
    try {
      // 📁 Upload to 'products' folder specifically
      const response = await uploadService.uploadImage(file, 'products');

      if (response.success && response.data?.url) {
        return response.data.secure_url; // Use secure_url
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const imageFiles = fileArray.filter((file) =>
        file.type.startsWith('image/'),
      );

      if (imageFiles.length === 0) {
        alert('Please select valid image files');
        return;
      }

      // Check file sizes (max 10MB each)
      const oversizedFiles = imageFiles.filter(
        (file) => file.size > 10 * 1024 * 1024,
      );
      if (oversizedFiles.length > 0) {
        alert('Some files are too large. Maximum size is 10MB.');
        return;
      }

      // Check total images limit
      if (images.length + imageFiles.length > 5) {
        alert('Maximum 5 images allowed');
        return;
      }

      setUploading(true);
      setUploadProgress(0);

      try {
        const uploadedUrls: string[] = [];
        const totalFiles = imageFiles.length;

        // Upload files one by one với progress tracking
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          console.log(`🔄 Uploading ${file.name}...`);

          const url = await uploadImage(file);
          uploadedUrls.push(url);

          // Update progress
          const progress = Math.round(((i + 1) / totalFiles) * 100);
          setUploadProgress(progress);

          console.log(`✅ Uploaded: ${url}`);
        }

        const newImages = [...images, ...uploadedUrls];
        onImagesChange(newImages);

        console.log('🎉 All images uploaded successfully!');
      } catch (error: any) {
        console.error('❌ Upload failed:', error);
        alert(`Upload failed: ${error.message}`);
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [images, onImagesChange],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <Card className="!rounded-sm shadow-none">
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <CardDescription>
          Add up to 5 high-quality images. Images will be uploaded to
          Cloudinary.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : uploading
                ? 'border-gray-300 bg-gray-50'
                : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            disabled={uploading || images.length >= 5}
          />

          {uploading ? (
            <div className="space-y-4">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
              <div>
                <p className="text-lg font-medium text-blue-600">
                  Uploading to Cloudinary...
                </p>
                <Progress
                  value={uploadProgress}
                  className="mx-auto mt-2 w-full max-w-xs"
                />
                <p className="mt-1 text-sm text-gray-500">{uploadProgress}%</p>
              </div>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-lg font-medium text-gray-700">
                  {images.length >= 5
                    ? 'Maximum images reached'
                    : 'Drag & drop product images here'}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  or click to browse files
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  PNG, JPG up to 10MB each ({images.length}/5 images)
                </p>
              </div>
            </>
          )}
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
              <Package className="h-4 w-4" />
              Uploaded Images ({images.length}/5)
            </h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {images.map((url, index) => (
                <div key={index} className="group relative">
                  <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/300x300?text=Error+Loading';
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => removeImage(index)}
                    disabled={uploading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {index === 0 && (
                    <Badge className="absolute bottom-2 left-2 bg-blue-600 text-xs">
                      Main
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length === 0 && !uploading && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              At least one image is required for the product listing
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductImageUpload;
