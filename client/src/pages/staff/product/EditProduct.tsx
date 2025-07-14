import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

import { useProduct, useUpdateProduct } from '@/hooks/useProducts';

// Import components (reuse từ AddProduct)
import ProductBasicInfo from './components/ProductBasicInfo';
import ProductImageUpload from './components/ProductImageUpload';
import ProductSpecifications from './components/ProductSpecifications';
import ProductPricing from './components/ProductPricing';
import ProductTagsAndGifts from './components/ProductTagsAndGifts';

// Validation schema (same as AddProduct)
const editProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Product name is required')
    .max(200, 'Name too long'),
  category: z.string().min(1, 'Category is required'),
  brand: z
    .string()
    .trim()
    .min(1, 'Brand is required')
    .max(100, 'Brand name too long'),
  price: z.number().min(1, 'Price must be greater than 0'),
  originalPrice: z
    .number()
    .min(0, 'Original price cannot be negative')
    .optional(),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description too long'),
  specifications: z.object({
    weight: z.string().optional(),
    size: z.string().optional(),
    material: z.string().optional(),
    color: z.string().optional(),
  }),
  stock: z.number().min(0, 'Stock cannot be negative'),
  isActive: z.boolean(),
});

export type EditProductFormValues = z.infer<typeof editProductSchema>;

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Get product data
  const { data: product, isLoading, error } = useProduct(id!);
  const updateProduct = useUpdateProduct();

  // Form state
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [gifts, setGifts] = useState<string[]>([]);
  const [currentGift, setCurrentGift] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditProductFormValues>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: '',
      category: '',
      brand: '',
      price: 0,
      originalPrice: undefined,
      description: '',
      specifications: {
        weight: '',
        size: '',
        material: '',
        color: '',
      },
      stock: 0,
      isActive: true,
    },
  });

  // Populate form when product data is loaded
  useEffect(() => {
    if (product) {
      console.log('🔄 Populating form with product data:', product);

      // Reset form with product data
      form.reset({
        name: product.name || '',
        category: product.category._id || product.category || '',
        brand: product.brand || '',
        price: product.price || 0,
        originalPrice: product.originalPrice || undefined,
        description: product.description || '',
        specifications: {
          weight: product.specifications?.weight || '',
          size: product.specifications?.size || '',
          material: product.specifications?.material || '',
          color: product.specifications?.color || '',
        },
        stock: product.stock || 0,
        isActive: product.isActive ?? true,
      });

      // Set additional state
      setImages(product.images || []);
      setTags(product.tags || []);
      setGifts(product.gifts || []);
      setIngredients(product.specifications?.ingredients || []);
    }
  }, [product, form]);

  const onSubmit = async (data: EditProductFormValues) => {
    if (images.length === 0) {
      toast.error('Please add at least one product image.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...data,
        images,
        tags,
        gifts,
        specifications: {
          ...data.specifications,
          ingredients: ingredients.length > 0 ? ingredients : undefined,
        },
      };

      console.log('📝 Updating product with payload:', payload);

      await updateProduct.mutateAsync({
        id: id!,
        data: payload,
      });

      toast.success('Product has been updated successfully!');
      navigate(`/staff/products/${id}`); // Navigate to detail page
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(
        error?.message || 'Failed to update product. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/staff/products/${id}`);
  };

  // Loading state
  if (isLoading) {
    return <EditProductSkeleton />;
  }

  // Error state
  if (error || !product) {
    return (
      <div className="container mx-auto py-12">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load product data. Please try again later.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate('/staff/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-0">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between border-b p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground">
            Update product information and settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting || images.length === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Product
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="space-y-6 lg:col-span-2">
                <ProductBasicInfo control={form.control} />

                <ProductImageUpload
                  images={images}
                  onImagesChange={setImages}
                />

                <ProductSpecifications
                  control={form.control}
                  ingredients={ingredients}
                  currentIngredient={currentIngredient}
                  onIngredientsChange={setIngredients}
                  onCurrentIngredientChange={setCurrentIngredient}
                />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <ProductPricing control={form.control} watch={form.watch} />

                <ProductTagsAndGifts
                  tags={tags}
                  gifts={gifts}
                  currentTag={currentTag}
                  currentGift={currentGift}
                  onTagsChange={setTags}
                  onGiftsChange={setGifts}
                  onCurrentTagChange={setCurrentTag}
                  onCurrentGiftChange={setCurrentGift}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

// Loading skeleton component
const EditProductSkeleton = () => (
  <div className="container mx-auto py-0">
    <div className="mb-3 flex items-start justify-between border-b p-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>

    <div className="p-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  </div>
);

export default EditProduct;
