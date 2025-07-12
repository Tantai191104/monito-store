import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/formatter';
import type { Product } from '@/types/product';
import { ShoppingCart, Gift, MessageCircle, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const ProductInfo = ({ product }: { product: Product }) => {
  const { addItem, isInCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      addItem(product, 'product');
      toast.success('Product added to cart!');
    } catch (error) {
      toast.error('Failed to add product to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const isProductInCart = isInCart(product._id);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#003459]">{product.name}</h1>
        <p className="text-2xl font-bold text-gray-800">
          {formatPrice(product.price)} VND
        </p>
      </div>
      <p className="text-gray-600">{product.description}</p>

      <div className="flex space-x-4">
        <Button 
          size="lg" 
          className={`flex-1 ${
            isProductInCart 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-[#003459] hover:bg-[#003459]/90'
          }`}
          onClick={handleAddToCart}
          disabled={isAddingToCart || !product.isInStock}
        >
          {isProductInCart ? (
            <>
              <Check className="mr-2 h-5 w-5" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isAddingToCart ? 'Adding...' : 'Add to cart'}
            </>
          )}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1 border-[#003459] text-[#003459] hover:bg-[#003459] hover:text-white"
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Chat with Monito
        </Button>
      </div>

      {product.gifts && product.gifts.length > 0 && (
        <div className="flex items-center gap-2 rounded-md bg-[#FFF1E4] p-3 text-sm font-bold text-[#003459]">
          <Gift className="size-5 text-red-500" />
          <span>Free Gift: {product.gifts.join(' & ')}</span>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
