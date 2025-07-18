import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useActiveCategories } from '@/hooks/useCategories';
import type { Control } from 'react-hook-form';
import type { AddProductFormValues } from '../AddProduct';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductBasicInfoProps {
  control: Control<AddProductFormValues>;
}

const ProductBasicInfo = ({ control }: ProductBasicInfoProps) => {
  const { data: apiCategories = [], isLoading: categoriesLoading } =
    useActiveCategories();

  if (categoriesLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Card className="!rounded-sm shadow-none">
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
        <CardDescription>Basic details about your product</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Product Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Category <span className="text-red-500">*</span>
                </FormLabel>
                {categoriesLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="!w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {apiCategories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Changed brand from Select to Input */}
          <FormField
            control={control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Brand <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter brand name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your product..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {field.value?.length || 0}/2000 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ProductBasicInfo;
