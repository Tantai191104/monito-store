import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/formatter';
import type { Product } from '@/types/product';
import { ShoppingCart, Gift, MessageCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ProductInfo = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
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
  const handleZaloContact = () => {
    window.open('https://zalo.me/0352195876', '_blank');
  };

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
          className="flex-1 bg-[#003459] hover:bg-[#003459]/90"
          onClick={handleAddToCart}
          disabled={isAddingToCart || !product.isInStock}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {isAddingToCart ? 'Adding...' : 'Add to cart'}
        </Button>
        <Button
          onClick={handleZaloContact}
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
