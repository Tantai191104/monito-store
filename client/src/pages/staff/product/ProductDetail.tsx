import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
  Star,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

import { useProduct } from '@/hooks/useProducts';
import ImageGallery from '@/components/ImageGallery';
import { DeactivateProductDialog } from './components/DeactivateProductDialog'; // ✅ Import
import { DeleteProductDialog } from './components/DeleteProductDialog'; // ✅ Import

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false); // ✅ Add state

  const { data: product, isLoading, error } = useProduct(id!);

  const handleBack = () => {
    navigate('/staff/products');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-32" />
                <div>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="mt-1 h-4 w-64" />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl p-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            Product Not Found
          </h3>
          <p className="mb-4 text-gray-600">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const specifications = [
    { label: 'Weight', value: product.specifications.weight },
    { label: 'Size', value: product.specifications.size },
    { label: 'Material', value: product.specifications.material },
    { label: 'Color', value: product.specifications.color },
  ];

  const productInfo = [
    { label: 'SKU', value: `#${product._id.slice(-8).toUpperCase()}` },
    { label: 'Brand', value: product.brand },
    { label: 'Category', value: product.category?.name || 'N/A' },
    { label: 'Stock', value: `${product.stock} units` },
    {
      label: 'Created Date',
      value: new Date(product.createdAt).toLocaleDateString('vi-VN'),
    },
    {
      label: 'Last Updated',
      value: new Date(product.updatedAt).toLocaleDateString('vi-VN'),
    },
  ];

  return (
    <div className="container mx-auto py-0">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-muted-foreground">
            Product Details • SKU: #{product._id.slice(-8).toUpperCase()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowDeactivateDialog(true)} // ✅ Mở dialog
          >
            {product.isActive ? (
              <EyeOff className="mr-2 h-4 w-4" />
            ) : (
              <Eye className="mr-2 h-4 w-4" />
            )}
            {product.isActive ? 'Deactivate' : 'Activate'}
          </Button>

          <Button variant="outline" asChild>
            <Link to={`/staff/products/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>

          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)} // ✅ Mở dialog
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Product Images */}
            <Card className="!rounded-sm shadow-none">
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>
                  {product.images.length} image(s) uploaded
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageGallery images={product.images} name={product.name} />
              </CardContent>
            </Card>

            {/* Product Description */}
            <Card className="!gap-2 !rounded-sm shadow-none">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {product.description || 'No description provided.'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Status & Price */}
            <Card className="!rounded-sm shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Product Status
                  <Badge variant={product.isActive ? 'default' : 'secondary'}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {product.price.toLocaleString('vi-VN')} ₫
                  </div>
                  {product.originalPrice && (
                    <div className="text-sm text-gray-500">
                      <span className="line-through">
                        {product.originalPrice.toLocaleString('vi-VN')} ₫
                      </span>
                      {product.discount && (
                        <Badge variant="destructive" className="ml-2">
                          -{product.discount}%
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <Separator className="!h-[1px]" />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Stock Status
                    </span>
                    <Badge
                      variant={product.isInStock ? 'default' : 'destructive'}
                    >
                      {product.isInStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Available Units
                    </span>
                    <span className="font-medium">{product.stock}</span>
                  </div>

                  {product.rating && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{product.rating}</span>
                        <span className="text-sm text-gray-500">
                          ({product.reviewCount || 0})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card className="!gap-2 !rounded-sm shadow-none">
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Basic details and metadata</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="">
                  {productInfo.map((info) => (
                    <div
                      key={info.label}
                      className="flex justify-between border-b py-3 text-sm"
                    >
                      <span className="text-gray-600">{info.label}</span>
                      <span className="font-medium text-gray-900">
                        {info.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card className="!gap-2 !rounded-sm shadow-none">
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
                <CardDescription>
                  Technical details and features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="gap-4">
                  {specifications.map(
                    (spec) =>
                      spec.value && (
                        <div
                          key={spec.label}
                          className="flex justify-between border-b py-3 text-sm"
                        >
                          <span className="text-gray-600">{spec.label}</span>
                          <span className="font-medium text-gray-900">
                            {spec.value}
                          </span>
                        </div>
                      ),
                  )}
                </div>

                {product.specifications.ingredients &&
                  product.specifications.ingredients.length > 0 && (
                    <div className="mt-6">
                      <h4 className="mb-3 font-medium text-gray-900">
                        Ingredients
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {product.specifications.ingredients.map(
                          (ingredient, index) => (
                            <Badge key={index} variant="secondary">
                              {ingredient}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Tags and Gifts */}
            {(product.tags?.length > 0 || product.gifts?.length > 0) && (
              <Card className="!gap-2 !rounded-sm shadow-none">
                <CardHeader>
                  <CardTitle>Tags & Gifts</CardTitle>
                  <CardDescription>
                    Product tags and included gifts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {product.tags && product.tags.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          Tags
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.gifts && product.gifts.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          Free Gifts
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.gifts.map((gift, index) => (
                          <Badge key={index} variant="default">
                            {gift}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <DeactivateProductDialog
        product={product}
        open={showDeactivateDialog}
        onOpenChange={setShowDeactivateDialog}
      />
      <DeleteProductDialog
        product={product}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </div>
  );
};

export default ProductDetail;
