// client/src/pages/staff/product/components/ProductTagsAndGifts.tsx
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface TagsSectionProps {
  title: string;
  items: string[];
  currentItem: string;
  placeholder: string;
  maxItems: number;
  onItemsChange: (items: string[]) => void;
  onCurrentItemChange: (value: string) => void;
  variant?: 'outline' | 'default' | 'secondary';
}

const TagsSection = ({
  title,
  items,
  currentItem,
  placeholder,
  maxItems,
  onItemsChange,
  onCurrentItemChange,
  variant = 'outline',
}: TagsSectionProps) => {
  const addItem = () => {
    if (
      currentItem.trim() &&
      !items.includes(currentItem.trim()) &&
      items.length < maxItems
    ) {
      onItemsChange([...items, currentItem.trim()]);
      onCurrentItemChange('');
    }
  };

  const removeItem = (itemToRemove: string) => {
    onItemsChange(items.filter((item) => item !== itemToRemove));
  };

  return (
    <Card className="!rounded-sm shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge variant="secondary" className="text-xs">
            {items.length}/{maxItems}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={currentItem}
            onChange={(e) => onCurrentItemChange(e.target.value)}
            onKeyPress={(e) =>
              e.key === 'Enter' && (e.preventDefault(), addItem())
            }
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            disabled={items.length >= maxItems}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {items.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <Badge
                key={index}
                variant={variant}
                className="cursor-pointer"
                onClick={() => removeItem(item)}
              >
                {item}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface ProductTagsAndGiftsProps {
  tags: string[];
  gifts: string[];
  currentTag: string;
  currentGift: string;
  onTagsChange: (tags: string[]) => void;
  onGiftsChange: (gifts: string[]) => void;
  onCurrentTagChange: (value: string) => void;
  onCurrentGiftChange: (value: string) => void;
}

const ProductTagsAndGifts = ({
  tags,
  gifts,
  currentTag,
  currentGift,
  onTagsChange,
  onGiftsChange,
  onCurrentTagChange,
  onCurrentGiftChange,
}: ProductTagsAndGiftsProps) => {
  return (
    <div className="space-y-6">
      <TagsSection
        title="Tags"
        items={tags}
        currentItem={currentTag}
        placeholder="Add tag"
        maxItems={10}
        onItemsChange={onTagsChange}
        onCurrentItemChange={onCurrentTagChange}
        variant="outline"
      />

      <TagsSection
        title="Free Gifts"
        items={gifts}
        currentItem={currentGift}
        placeholder="Add gift"
        maxItems={5}
        onItemsChange={onGiftsChange}
        onCurrentItemChange={onCurrentGiftChange}
        variant="default"
      />
    </div>
  );
};

export default ProductTagsAndGifts;
