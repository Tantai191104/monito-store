import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Package, Calendar, MapPin, CreditCard, Truck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useOrders } from '@/hooks/useOrders';
import { useCancelOrder } from '@/hooks/useOrders';
import { useQueryClient } from '@tanstack/react-query';
import { formatPrice } from '@/utils/formatter';
import { toast } from 'sonner';
import OrderPaymentCountdown from '@/components/OrderPaymentCountdown';
import PaymentQRCode from '@/components/PaymentQRCode';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProducts } from '@/hooks/useProducts';
import React from 'react';
import API from '@/lib/axios';
import { useAuth } from '@/hooks/useAuth';

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'confirmed':
      return 'default';
    case 'processing':
      return 'default';
    case 'shipped':
      return 'default';
    case 'delivered':
      return 'default';
    case 'cancelled':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getPaymentStatusVariant = (status: string) => {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'paid':
      return 'default';
    case 'failed':
      return 'destructive';
    case 'refunded':
      return 'outline';
    default:
      return 'secondary';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Package className="h-4 w-4" />;
    case 'confirmed':
      return <Package className="h-4 w-4" />;
    case 'processing':
      return <Package className="h-4 w-4" />;
    case 'shipped':
      return <Truck className="h-4 w-4" />;
    case 'delivered':
      return <Package className="h-4 w-4" />;
    case 'cancelled':
      return <Package className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const ORDER_STATUS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending Confirmation' },
  { value: 'processing', label: 'Processing/Shipping' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

const OrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const cancelOrder = useCancelOrder();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // State cho đánh giá
  const [reviewStates, setReviewStates] = useState<Record<string, { rating: number; content: string }>>({});
  // State: lưu orderId đang edit lại review
  const [editingReview, setEditingReview] = useState<string | null>(null);

  // Get filter values from URL params
  const statusFilter = searchParams.get('status') || '';
  const paymentStatusFilter = searchParams.get('paymentStatus') || '';

  // Create params for API call
  const params = new URLSearchParams();
  if (statusFilter) params.set('status', statusFilter);
  if (paymentStatusFilter) params.set('paymentStatus', paymentStatusFilter);
  if (searchTerm) params.set('search', searchTerm);

  const { data, isLoading, error } = useOrders(params);
  const orders = data?.orders || [];

  // Lấy tất cả sản phẩm để map ảnh
  const { data: productsData } = useProducts(new URLSearchParams());
  const products = productsData?.products || [];
  const productMap = React.useMemo(() => {
    const map: Record<string, any> = {};
    products.forEach((p: any) => {
      map[p._id] = p;
    });
    return map;
  }, [products]);

  const { user } = useAuth();

  // Helper: lấy review của user hiện tại cho order
  const getMyReview = (order: any) => {
    if (!user) return null;
    return order.reviews?.find((r: any) => r.user === user._id || r.user?._id === user._id);
  };

  let filteredOrders: typeof orders = [];
  if (activeTab === 'cancelled') {
    filteredOrders = orders.filter(order => order.status === 'cancelled');
  } else if (activeTab === 'all') {
    filteredOrders = orders;
  } else {
    filteredOrders = orders.filter(order => order.status === activeTab && order.status !== 'cancelled');
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleStatusFilter = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('status', value);
    } else {
      newParams.delete('status');
    }
    setSearchParams(newParams);
  };

  const handlePaymentStatusFilter = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('paymentStatus', value);
    } else {
      newParams.delete('paymentStatus');
    }
    setSearchParams(newParams);
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder.mutateAsync(orderId);
      toast.success('Order cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  const handleOrderCancelled = () => {
    // Refetch orders list immediately
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  };

  const openPaymentModal = (order: any) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedOrder(null);
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  };
  const handlePaymentFailed = () => {
    setShowPaymentModal(false);
    setSelectedOrder(null);
  };

  const handleRatingChange = (orderId: string, rating: number) => {
    setReviewStates(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        rating,
      },
    }));
  };
  const handleContentChange = (orderId: string, content: string) => {
    setReviewStates(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        content,
      },
    }));
  };
  const handleSubmitReview = async (orderId: string) => {
    const review = reviewStates[orderId];
    if (!review?.rating || !review?.content) return;
    try {
      await API.post(`/orders/${orderId}/review`, {
        rating: review.rating,
        content: review.content,
      });
      toast.success('Review submitted!');
      setEditingReview(null);
      // Cập nhật lại reviewStates để ẩn form
      setReviewStates(prev => {
        const newState = { ...prev };
        delete newState[orderId];
        return newState;
      });
      // Refetch đơn hàng (nếu muốn realtime)
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleDeleteReview = async (orderId: string) => {
    try {
      await API.delete(`/orders/${orderId}/review`);
      toast.success('Review deleted!');
      setEditingReview(null);
      setReviewStates(prev => {
        const newState = { ...prev };
        delete newState[orderId];
        return newState;
      });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete review');
    }
  };

  // Helper: tính thời gian còn lại (giây) cho đơn hàng pending payment
  const getRemainingSeconds = (createdAt: string, duration = 300) => {
    const created = new Date(createdAt).getTime();
    const now = Date.now();
    const diff = Math.floor((created + duration * 1000 - now) / 1000);
    return diff > 0 ? diff : 0;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003459] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Package className="mx-auto h-24 w-24 text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error loading orders</h2>
          <p className="text-gray-600 mb-8">Something went wrong while loading your orders.</p>
          <Button onClick={() => window.location.reload()} className="bg-[#003459] hover:bg-[#003459]/90">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  console.log('ActiveTab:', activeTab);
  orders.forEach(o => console.log('Order', o._id, 'status:', o.status));
  const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>
      {/* Tabs status */}
      <div className="flex gap-2 mb-6 border-b">
        {ORDER_STATUS.map(tab => (
          <button
            key={tab.value}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === tab.value ? 'border-[#003459] text-[#003459] bg-[#FCEED5]' : 'border-transparent text-gray-600 hover:text-[#003459]'}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Orders List */}
      {sortedOrders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="mx-auto h-24 w-24 text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders found</h2>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
            <Link to="/products">
              <Button className="bg-[#003459] hover:bg-[#003459]/90">
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedOrders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Only one badge per order, logic priority */}
                    {order.status === 'cancelled' && (
                      <Badge variant="destructive" className="capitalize">Cancelled</Badge>
                    )}
                    {order.paymentStatus === 'refunded' && (
                      <Badge variant="outline" className="capitalize">Refunded</Badge>
                    )}
                    {order.status === 'delivered' && (
                      <Badge variant="default" className="capitalize">Delivered</Badge>
                    )}
                    {(order.status === 'processing' || order.status === 'shipped') && (
                      <Badge variant="default" className="capitalize">Processing</Badge>
                    )}
                    {order.status === 'pending' && order.paymentStatus === 'pending' && (
                      (() => {
                        const remaining = getRemainingSeconds(order.createdAt || order.orderDate, 300);
                        if (remaining <= 0) {
                          return <Badge variant="destructive" className="capitalize">Cancelled</Badge>;
                        }
                        return <>
                          <Badge variant="outline" className="capitalize">Pending Payment</Badge>
                          <OrderPaymentCountdown
                            orderId={order._id}
                            createdAt={order.createdAt || order.orderDate}
                            duration={300}
                            onCancelled={handleOrderCancelled}
                          />
                          <Button
                            variant="default"
                            size="sm"
                            className="ml-2 bg-blue-600 hover:bg-blue-700"
                            onClick={() => openPaymentModal(order)}
                          >
                            Show QR
                          </Button>
                        </>;
                      })()
                    )}
                    {order.status === 'pending' && order.paymentStatus === 'paid' && (
                      <Badge variant="secondary" className="capitalize">Paid, Pending Confirmation</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {order.items.map((item: any, index: number) => {
                    // Defensive: handle missing item.item (e.g. product/pet deleted)
                    const itemObj = item.item;
                    const product = itemObj && (productMap[itemObj._id || itemObj.id || item.product_id]);
                    const imageUrl = item.image || product?.images?.[0] || '/placeholder-product.jpg';
                    return (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={imageUrl}
                          alt={itemObj?.name || 'Unavailable'}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={e => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.endsWith('/placeholder-product.jpg')) {
                              target.src = '/placeholder-product.jpg';
                            }
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant={item.type === 'pet' ? 'destructive' : 'default'} className="text-xs">
                              {item.type === 'pet' ? 'Pet' : 'Product'}
                            </Badge>
                            <h4 className="font-medium text-gray-900">
                              {itemObj?.name || <span className="text-gray-400 italic">[No longer available]</span>}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × {itemObj?.price ? formatPrice(itemObj.price) : 'N/A'} VND
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-[#003459]">
                            {formatPrice(item.subtotal)} VND
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Shipping Address */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Shipping Address
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{order.shippingAddress.street}</p>
                      <p>{(order.shippingAddress as any).district || order.shippingAddress.state}, {(order.shippingAddress as any).province || order.shippingAddress.city}</p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Order Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>{formatPrice(order.subtotal)} VND</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax:</span>
                        <span>{formatPrice(order.tax)} VND</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span>{order.shipping === 0 ? 'Free' : `${formatPrice(order.shipping)} VND`}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span className="text-[#003459]">{formatPrice(order.total)} VND</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Notes */}
                {order.notes && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Order Notes</h4>
                    <p className="text-sm text-gray-600">{order.notes}</p>
                  </div>
                )}

                {/* Đánh giá cho đơn đã giao */}
                {order.status === 'delivered' && (
                  (() => {
                    const myReview = getMyReview(order);
                    if (myReview && editingReview !== order._id) {
                      // Đã đánh giá, hiển thị review và nút sửa
                      return (
                        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Your Review</h4>
                          <div className="flex items-center mb-2">
                            {[1,2,3,4,5].map(star => (
                              <Star key={star} className={star <= myReview.rating ? 'text-yellow-400' : 'text-gray-300'} fill="currentColor" />
                            ))}
                            <span className="ml-2 text-sm text-gray-600">{myReview.rating} stars</span>
                          </div>
                          <div className="text-sm text-gray-800 mb-2">{myReview.content}</div>
                          <Button size="sm" variant="outline" onClick={() => {
                            setEditingReview(order._id);
                            setReviewStates(prev => ({ ...prev, [order._id]: { rating: myReview.rating, content: myReview.content } }));
                          }}>Edit Review</Button>
                          <Button size="sm" variant="destructive" className="ml-2" onClick={() => handleDeleteReview(order._id)}>Delete Review</Button>
                        </div>
                      );
                    }
                    // Chưa đánh giá hoặc đang sửa
                    return (
                      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Order Review</h4>
                        <div className="flex items-center mb-2">
                          {[1,2,3,4,5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRatingChange(order._id, star)}
                              className={
                                (reviewStates[order._id]?.rating || 0) >= star
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }
                            >
                              <Star className="w-6 h-6" fill="currentColor" />
                            </button>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {reviewStates[order._id]?.rating ? `${reviewStates[order._id].rating} stars` : 'Select stars'}
                          </span>
                        </div>
                        <textarea
                          className="w-full border rounded p-2 text-sm mb-2"
                          rows={3}
                          placeholder="Review content..."
                          value={reviewStates[order._id]?.content || ''}
                          onChange={e => handleContentChange(order._id, e.target.value)}
                        />
                        <Button
                          size="sm"
                          className="bg-[#003459] text-white"
                          onClick={() => handleSubmitReview(order._id)}
                          disabled={!(reviewStates[order._id]?.rating && reviewStates[order._id]?.content)}
                        >
                          Submit Review
                        </Button>
                        {myReview && (
                          <Button size="sm" variant="ghost" className="ml-2" onClick={() => setEditingReview(null)}>Cancel Edit</Button>
                        )}
                      </div>
                    );
                  })()
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Ordered: {new Date(order.orderDate).toLocaleDateString()}</span>
                    </div>
                    {order.estimatedDelivery && (
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-1" />
                        <span>Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {order.status === 'pending' && order.paymentStatus === 'pending' && getRemainingSeconds(order.createdAt || order.orderDate, 300) > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancelOrder.isPending}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pay with ZaloPay QR</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <PaymentQRCode
              orderId={selectedOrder._id}
              amount={selectedOrder.total}
              description={`Pay for order #${selectedOrder.orderNumber}`}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentFailed={handlePaymentFailed}
              orderUrl={selectedOrder.order_url}
              onOrderCancelled={handleOrderCancelled}
              remainingSeconds={getRemainingSeconds(selectedOrder.createdAt || selectedOrder.orderDate, 300)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage; 