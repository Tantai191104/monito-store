import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, Package, BadgeCheck, XCircle, Truck, CheckCircle, RefreshCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/formatter';
import { toast } from 'sonner';
import { useOrders, useCancelOrder } from '@/hooks/useOrders';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ORDER_STATUS = [
  { value: 'all', label: 'Tất cả', icon: Clock },
  { value: 'pending', label: 'Chờ xác nhận', icon: Clock },
  { value: 'processing', label: 'Đang xử lý/giao', icon: RefreshCcw },
  { value: 'delivered', label: 'Đã giao', icon: CheckCircle },
  { value: 'cancelled', label: 'Đã hủy', icon: XCircle },
  { value: 'refunded', label: 'Hoàn tiền', icon: Package },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary">Chờ xác nhận</Badge>;
    case 'processing':
      return <Badge variant="default">Đang xử lý/giao</Badge>;
    case 'delivered':
      return <Badge variant="default">Đã giao</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">Đã hủy</Badge>;
    case 'refunded':
      return <Badge variant="outline">Hoàn tiền</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const CartPage = () => {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  // State lưu các id sản phẩm được chọn (luôn khai báo ở đầu component)
  const [selectedIds, setSelectedIds] = useState<string[]>(state.items.map(item => item.id));
  // Mặc định sort theo 'pending' nếu có
  const statusFilter = searchParams.get('status') || 'pending';
  const cancelOrder = useCancelOrder();

  // Lấy orders của user
  const { data, isLoading } = useOrders();
  const orders = data?.orders || [];

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(id);
    try {
      updateQuantity(id, newQuantity);
      toast.success('Cart updated successfully!');
    } catch (error) {
      toast.error('Failed to update cart');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  const handleCheckout = () => {
    if (state.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/customer/checkout');
  };

  const handleStatusFilter = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set('status', value);
    } else {
      newParams.delete('status');
    }
    setSearchParams(newParams);
  };

  const filteredOrders = statusFilter && statusFilter !== 'all'
    ? orders.filter((order) => order.status === statusFilter)
    : orders;

  // Chọn/bỏ chọn 1 sản phẩm
  const handleSelectItem = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Chọn/bỏ chọn tất cả
  const handleSelectAll = () => {
    if (selectedIds.length === state.items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(state.items.map(item => item.id));
    }
  };

  // Tổng tiền các sản phẩm đã chọn
  const selectedTotal = state.items
    .filter(item => selectedIds.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Hiển thị cart items nếu còn sản phẩm trong giỏ hàng
  if (state.items.length > 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng của bạn</h1>
        <div className="mb-4 border rounded-lg overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 bg-gray-100 py-3 px-4 font-semibold text-gray-700 text-sm">
            <div className="col-span-1 flex items-center">
              <input type="checkbox" checked={selectedIds.length === state.items.length} onChange={handleSelectAll} />
            </div>
            <div className="col-span-4">Sản phẩm</div>
            <div className="col-span-2 text-center">Đơn giá</div>
            <div className="col-span-2 text-center">Số lượng</div>
            <div className="col-span-2 text-center">Thành tiền</div>
            <div className="col-span-1 text-center">Thao tác</div>
          </div>
          {/* Danh sách sản phẩm */}
          {state.items.map(item => (
            <div key={item.id} className="grid grid-cols-12 items-center border-t py-4 px-4 text-sm">
              <div className="col-span-1 flex items-center">
                <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => handleSelectItem(item.id)} />
              </div>
              <div className="col-span-4 flex items-center gap-3">
                <img
                  src={item.item.images?.[0] || (item.type === 'product' ? '/placeholder-product.jpg' : '/placeholder-pet.jpg')}
                  alt={item.item.name}
                  className="w-14 h-14 object-cover rounded border"
                />
                <div>
                  <div className="font-medium text-gray-900">{item.item.name}</div>
                  <div className="text-xs text-gray-500">Loại: {item.type === 'product' ? 'Sản phẩm' : 'Thú cưng'}</div>
                </div>
              </div>
              <div className="col-span-2 text-center font-semibold text-[#003459]">{formatPrice(item.price)} VND</div>
              <div className="col-span-2 flex justify-center items-center gap-2">
                <Button size="icon" variant="outline" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1 || isUpdating === item.id}>-</Button>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => handleQuantityChange(item.id, Number(e.target.value))}
                  className="w-14 text-center"
                  disabled={isUpdating === item.id}
                />
                <Button size="icon" variant="outline" onClick={() => handleQuantityChange(item.id, item.quantity + 1)} disabled={isUpdating === item.id}>+</Button>
              </div>
              <div className="col-span-2 text-center font-semibold text-[#003459]">{formatPrice(item.price * item.quantity)} VND</div>
              <div className="col-span-1 flex justify-center">
                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
        {/* Thanh tổng kết */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border mt-4">
          <div className="flex items-center gap-4">
            <input type="checkbox" checked={selectedIds.length === state.items.length} onChange={handleSelectAll} />
            <span>Chọn tất cả ({state.items.length})</span>
            <Button variant="outline" size="sm" onClick={() => selectedIds.forEach(id => handleRemoveItem(id))} disabled={selectedIds.length === 0} className="ml-2">Xóa đã chọn</Button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg">Tổng tiền: <span className="text-2xl font-bold text-[#003459]">{formatPrice(selectedTotal)} VND</span></span>
            <Button size="lg" className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white" onClick={() => handleCheckout()} disabled={selectedIds.length === 0}>Mua hàng</Button>
          </div>
        </div>
      </div>
    );
  }

  // Nếu cart rỗng, luôn trả về empty cart UI
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
        <div className="space-x-4">
          <Link to="/products">
            <Button className="bg-[#003459] hover:bg-[#003459]/90">
              Browse Products
            </Button>
          </Link>
          <Link to="/pets">
            <Button variant="outline" className="border-[#003459] text-[#003459] hover:bg-[#003459] hover:text-white">
              Browse Pets
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 