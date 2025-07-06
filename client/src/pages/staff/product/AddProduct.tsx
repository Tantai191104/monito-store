import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { mockCategories } from '@/data/mockProducts';
import { productService } from '@/services/productService';

// Import components
import ProductBasicInfo from './components/ProductBasicInfo';
import ProductImageUpload from './components/ProductImageUpload';
import ProductSpecifications from './components/ProductSpecifications';
import ProductPricing from './components/ProductPricing';
import ProductTagsAndGifts from './components/ProductTagsAndGifts';

// Validation schema
const addProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Name too long'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required').max(100, 'Brand name too long'),
  price: z.number().min(1, 'Price must be greater than 0'),
  originalPrice: z.number().optional(),
  description: z
    .string()
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

export type AddProductFormValues = z.infer<typeof addProductSchema>;

const AddProduct = () => {
  const navigate = useNavigate();

  // Form state
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [gifts, setGifts] = useState<string[]>([]);
  const [currentGift, setCurrentGift] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductSchema),
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

  const handleImagesChange = (newImages: File[], newPreviews: string[]) => {
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const onSubmit = async (data: AddProductFormValues) => {
    if (images.length === 0) {
      alert('Please add at least one product image.');
      return;
    }

    setIsSubmitting(true);

    try {
      const imageUrls = imagePreviews.filter((preview) => preview !== '');
      const selectedCategory = mockCategories.find(
        (cat) => cat._id === data.category,
      );

      const payload = {
        ...data,
        category: selectedCategory ? selectedCategory.name : data.category,
        images: imageUrls,
        tags,
        gifts,
        specifications: {
          ...data.specifications,
          ingredients: ingredients.length > 0 ? ingredients : undefined,
        },
      };

      const res = await productService.createProduct(payload);
      if (res.success) {
        alert('Product has been added successfully!');
        navigate('/staff/products');
      } else {
        alert(res.message || 'Failed to add product.');
      }
    } catch (error: any) {
      console.error('Error adding product:', error);
      alert(error?.message || 'Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-0">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between border-b p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>
          <p className="text-muted-foreground">
            Create a new product for your store
          </p>
        </div>

        <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </Button>
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
                  imagePreviews={imagePreviews}
                  onImagesChange={handleImagesChange}
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

export default AddProduct;
