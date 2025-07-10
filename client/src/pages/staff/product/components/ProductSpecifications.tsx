// client/src/pages/staff/product/components/ProductSpecifications.tsx
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, X } from 'lucide-react';
import type { Control } from 'react-hook-form';
import type { AddProductFormValues } from '../AddProduct';

interface ProductSpecificationsProps {
  control: Control<AddProductFormValues>;
  ingredients: string[];
  currentIngredient: string;
  onIngredientsChange: (ingredients: string[]) => void;
  onCurrentIngredientChange: (value: string) => void;
}

const ProductSpecifications = ({
  control,
  ingredients,
  currentIngredient,
  onIngredientsChange,
  onCurrentIngredientChange,
}: ProductSpecificationsProps) => {
  const addIngredient = () => {
    if (
      currentIngredient.trim() &&
      !ingredients.includes(currentIngredient.trim()) &&
      ingredients.length < 20
    ) {
      onIngredientsChange([...ingredients, currentIngredient.trim()]);
      onCurrentIngredientChange('');
    }
  };

  const removeIngredient = (ingredientToRemove: string) => {
    onIngredientsChange(
      ingredients.filter((ingredient) => ingredient !== ingredientToRemove),
    );
  };

  return (
    <Card className="!rounded-sm shadow-none">
      <CardHeader>
        <CardTitle>Specifications</CardTitle>
        <CardDescription>
          Additional product details and specifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="specifications.weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 500g" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="specifications.size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Large" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="specifications.material"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Cotton" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="specifications.color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Blue" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Ingredients */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FormLabel>Ingredients</FormLabel>
            <Badge variant="secondary" className="text-xs">
              {ingredients.length}/20
            </Badge>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add ingredient"
              value={currentIngredient}
              onChange={(e) => onCurrentIngredientChange(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' && (e.preventDefault(), addIngredient())
              }
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addIngredient}
              disabled={ingredients.length >= 20}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeIngredient(ingredient)}
                >
                  {ingredient}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSpecifications;
