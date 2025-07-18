import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Package, Calendar, MapPin, CreditCard, Truck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import Select from 'react-select';
import { useEffect } from 'react';
import { useRef } from 'react';


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
  { value: 'pending_refund', label: 'Pending Refund Approval' },
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

  // Add state to track editing refund
  const [editingRefund, setEditingRefund] = useState(false);

  // State cho modal đánh giá từng sản phẩm
  const [reviewModal, setReviewModal] = useState<{orderId: string, productId: string, open: boolean} | null>(null);
  const [reviewForm, setReviewForm] = useState<{rating: number, comment: string, images: string[]}>({rating: 0, comment: '', images: []});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Thêm state lưu review sản phẩm đang sửa
  const [editingProductReview, setEditingProductReview] = useState<{orderId: string, productId: string, review: any} | null>(null);

  // Thêm state để phân biệt modal đang ở chế độ xem hay sửa
  const [reviewModalMode, setReviewModalMode] = useState<'create' | 'view' | 'edit'>('create');

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
  } else if (activeTab === 'pending_refund') {
    filteredOrders = orders.filter(order => order.status === 'pending_refund');
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

  const handleDeleteOrderReview = async (orderId: string) => {
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

  // State for refund dialog
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [refundOrder, setRefundOrder] = useState<any>(null);
  const [refundReason, setRefundReason] = useState('');
  const [refundBankName, setRefundBankName] = useState('');
  const [refundAccountNumber, setRefundAccountNumber] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundDescription, setRefundDescription] = useState('');

  const refundReasons = [
    'Missing item',
    'Wrong item sent',
    'Damaged item',
    'Defective item',
    'Expired item',
    'Not as described',
    'Used item',
    'Counterfeit item',
  ];

  const openRefundDialog = (order: any) => {
    setRefundOrder(order);
    setRefundReason('');
    setRefundBankName('');
    setRefundAccountNumber('');
    setRefundAmount(order.total);
    setRefundDescription('');
    setRefundImages(order.refundInfo?.images || []);
    setRefundDialogOpen(true);
  };

  const handleRefundSubmit = async () => {
    if (!refundOrder) return;
    try {
      await API.patch(`/orders/${refundOrder._id}/refund`, {
        reason: refundReason,
        bankName: refundBankName,
        accountNumber: refundAccountNumber,
        refundAmount: refundAmount,
        description: refundDescription,
        images: refundImages,
      });
      toast.success('Refund request submitted!');
      setRefundDialogOpen(false);
      setEditingRefund(false);
      setRefundImages([]);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit refund request');
    }
  };

  // Type for bank options
  const [bankOptions, setBankOptions] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);

  // State cho upload ảnh refund
  const [refundImages, setRefundImages] = useState<string[]>([]);
  const [uploadingRefund, setUploadingRefund] = useState(false);
  const refundFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoadingBanks(true);
    fetch('https://gist.githubusercontent.com/trihtm/c5299c3c999d76db10398ef43efdb1eb/raw/8979b47cb24bb3524cd4009f269cf9e3ab2ee5b8/vietnam-banks')
      .then(res => res.json())
      .then(data => {
        const options = data.banksnapas.map((b: any) => ({
          value: b.shortName,
          label: `${b.shortName} - ${b.vn_name}`,
        }));
        setBankOptions(options);
      })
      .finally(() => setIsLoadingBanks(false));
  }, []);

  // Hàm mở modal đánh giá
  const openReviewModal = (orderId: string, productId: string) => {
    setReviewModal({ orderId, productId, open: true });
    setReviewForm({ rating: 0, comment: '', images: [] });
    setReviewModalMode('create');
  };
  // Thêm hàm mở modal sửa review
  const openEditProductReview = () => {
    setReviewModalMode('edit');
  };
  // Sửa lại hàm mở modal xem review
  const openViewProductReview = (orderId: string, productId: string, review: any) => {
    setReviewModal({ orderId, productId, open: true });
    setReviewForm({
      rating: review.rating,
      comment: review.comment,
      images: review.images || [],
    });
    setEditingProductReview({ orderId, productId, review });
    setReviewModalMode('view');
  };

  // Khi đóng modal, reset editingProductReview
  const closeReviewModal = () => {
    setReviewModal(null);
    setEditingProductReview(null);
  };

  // Hàm upload ảnh
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', files[0]);
    formData.append('folder', 'reviews');
    try {
      const res = await API.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setReviewForm(prev => ({ ...prev, images: [...prev.images, res.data.data.url] }));
    } catch (err) {
      toast.error('Upload image failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Hàm mở file picker
  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Hàm xóa ảnh
  const removeImage = (indexToRemove: number) => {
    setReviewForm(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Khi submit review, nếu editingProductReview có giá trị thì gọi API update (PUT), ngược lại là tạo mới (POST)
  const handleSubmitProductReview = async () => {
    if (!reviewModal || !user) return;
    try {
      if (editingProductReview) {
        await API.put(`reviews/reviews/${editingProductReview.review._id}`, {
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          images: reviewForm.images,
        });
      } else {
        await API.post(`reviews/orders/${reviewModal.orderId}/products/${reviewModal.productId}/reviews`, {
          userId: user._id,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          images: reviewForm.images,
        });
      }
      toast.success('Đánh giá thành công!');
      closeReviewModal();
      setEditingProductReview(null);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gửi đánh giá thất bại');
    }
  };

  // Hàm xóa review
  const handleDeleteReview = async () => {
    if (!editingProductReview) return;
    try {
      await API.delete(`reviews/reviews/${editingProductReview.review._id}`);
      toast.success('Xóa đánh giá thành công!');
      closeReviewModal();
      setEditingProductReview(null);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Xóa đánh giá thất bại');
    }
  };

  // Hàm upload ảnh refund
  const handleUploadRefundImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingRefund(true);
    const formData = new FormData();
    formData.append('image', files[0]);
    formData.append('folder', 'refunds');
    try {
      const res = await API.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setRefundImages(prev => [...prev, res.data.data.url]);
    } catch (err) {
      toast.error('Upload image failed');
    } finally {
      setUploadingRefund(false);
      if (refundFileInputRef.current) refundFileInputRef.current.value = '';
    }
  };

  // Hàm mở file picker cho refund
  const openRefundFilePicker = () => {
    if (refundFileInputRef.current) {
      refundFileInputRef.current.click();
    }
  };

  // Hàm xóa ảnh refund
  const removeRefundImage = (indexToRemove: number) => {
    setRefundImages(prev => prev.filter((_, index) => index !== indexToRemove));
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
                    {order.status === 'pending_refund' && (
                      <Badge className="capitalize bg-yellow-400 text-yellow-900">Pending Refund Approval</Badge>
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
                    // Tìm review của user cho sản phẩm này
                    const productReview = order.reviews?.find((r: any) => r.productId === itemObj._id && r.userId === user?._id);
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
                        {order.status === 'delivered' && item.type === 'product' && (
                          productReview ? (
                            <Button size="sm" variant="outline" onClick={() => openViewProductReview(order._id, itemObj._id, productReview)}>
                              Xem đánh giá
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => openReviewModal(order._id, itemObj._id)}>
                              Đánh giá
                            </Button>
                          )
                        )}
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
                    {order.status === 'pending_refund' && order.refundInfo && !editingRefund && (
                      <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                        <h4 className="font-semibold text-yellow-800 mb-2">Refund Request Details</h4>
                        <div className="text-sm text-gray-800 mb-1"><strong>Reason:</strong> {order.refundInfo?.reason}</div>
                        {order.refundInfo?.description && (
                          <div className="text-sm text-gray-800 mb-1"><strong>Description:</strong> {order.refundInfo?.description}</div>
                        )}
                        <div className="text-sm text-gray-800 mb-1"><strong>Bank Name:</strong> {order.refundInfo?.bankName}</div>
                        <div className="text-sm text-gray-800 mb-1"><strong>Account Number:</strong> {order.refundInfo?.accountNumber}</div>
                        <div className="text-sm text-gray-800 mb-1"><strong>Refund Amount:</strong> {order.refundInfo?.amount?.toLocaleString('vi-VN')} VND</div>
                        <div className="text-xs text-gray-500 mt-2">Requested at: {order.refundInfo?.requestedAt ? new Date(order.refundInfo?.requestedAt).toLocaleString() : ''}</div>
                        <Button className="mt-2" variant="outline" onClick={() => {
                          setEditingRefund(true);
                          setRefundOrder(order);
                          setRefundReason(order.refundInfo?.reason || '');
                          setRefundBankName(order.refundInfo?.bankName || '');
                          setRefundAccountNumber(order.refundInfo?.accountNumber || '');
                          setRefundAmount(order.refundInfo?.amount || 0);
                          setRefundDescription(order.refundInfo?.description || '');
                          setRefundImages(order.refundInfo?.images || []);
                          setRefundDialogOpen(true);
                        }}>Edit Refund Request</Button>
                        {order.refundInfo?.images && order.refundInfo.images.length > 0 && (
                          <div className="text-sm text-gray-800 mb-1">
                            <strong>Images:</strong>
                            <div className="flex gap-2 mt-2">
                              {order.refundInfo.images.map((img: string, idx: number) => (
                                <img key={idx} src={img} alt="refund" className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80" 
                                     onClick={() => window.open(img, '_blank')} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {order.status === 'delivered' && (
                      <Button onClick={() => openRefundDialog(order)} className="mt-2" variant="outline">Refund</Button>
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

      {/* Refund Dialog */}
      <Dialog open={refundDialogOpen} onOpenChange={(open) => {
        setRefundDialogOpen(open);
        if (!open) setEditingRefund(false);
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Refund Request for Order #{refundOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          {/* Hidden file input cho refund */}
          <input
            type="file"
            accept="image/*"
            ref={refundFileInputRef}
            onChange={handleUploadRefundImage}
            disabled={uploadingRefund}
            style={{ display: 'none' }}
          />
          <div className="space-y-4">
            <div>
              <label htmlFor="refundReason" className="block text-sm font-medium text-gray-700">
                Refund Reason
              </label>
              <select
                id="refundReason"
                value={refundReason}
                onChange={e => setRefundReason(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select a reason</option>
                {refundReasons.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="refundBankName" className="block text-sm font-medium text-gray-700">
                Bank Name
              </label>
              <Select
                id="refundBankName"
                options={bankOptions}
                isLoading={isLoadingBanks}
                value={bankOptions.find(opt => opt.value === refundBankName) || undefined}
                onChange={(opt: { value: string; label: string } | null) => setRefundBankName(opt ? opt.value : '')}
                placeholder="Select a bank..."
                isClearable
                isSearchable
                className="mt-1"
                styles={{ menu: (base: any) => ({ ...base, zIndex: 9999 }) }}
              />
            </div>
            <div>
              <label htmlFor="refundAccountNumber" className="block text-sm font-medium text-gray-700">
                Account Number
              </label>
              <input
                type="text"
                id="refundAccountNumber"
                value={refundAccountNumber}
                onChange={e => setRefundAccountNumber(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="refundAmount" className="block text-sm font-medium text-gray-700">
                Refund Amount
              </label>
              <input
                type="number"
                id="refundAmount"
                value={refundAmount}
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="refundDescription" className="block text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <textarea
                id="refundDescription"
                value={refundDescription}
                onChange={e => setRefundDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                rows={3}
              />
            </div>
            <div>
              <label htmlFor="refundImages" className="block text-sm font-medium text-gray-700">
                Refund Images (Optional)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {refundImages.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 border-2 border-gray-200 rounded-lg overflow-hidden">
                    <img src={img} alt="refund" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeRefundImage(idx)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {refundImages.length < 5 && (
                  <button
                    type="button"
                    onClick={openRefundFilePicker}
                    disabled={uploadingRefund}
                    className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    {uploadingRefund ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                    ) : (
                      <>
                        <span className="text-2xl text-gray-400">+</span>
                        <span className="text-xs text-gray-500 mt-1">Thêm ảnh</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              {refundImages.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">Tối đa 5 ảnh</p>
              )}
            </div>
            <Button
              className="bg-[#003459] text-white"
              onClick={handleRefundSubmit}
              disabled={!refundReason || !refundBankName || !refundAccountNumber || refundAmount <= 0}
            >
              Submit Refund Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Đánh giá sản phẩm Modal */}
      <Dialog open={!!reviewModal} onOpenChange={closeReviewModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {reviewModalMode === 'view' ? 'Xem đánh giá sản phẩm' :
               reviewModalMode === 'edit' ? 'Sửa đánh giá sản phẩm' :
               'Đánh giá sản phẩm'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center mb-2">
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => reviewModalMode !== 'view' && setReviewForm(prev => ({ ...prev, rating: star }))}
                  className={reviewForm.rating >= star ? 'text-yellow-400' : 'text-gray-300'}
                  disabled={reviewModalMode === 'view'}
                >
                  <Star className="w-6 h-6" fill="currentColor" />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {reviewForm.rating ? `${reviewForm.rating} sao` : 'Chọn số sao'}
              </span>
            </div>
            <textarea
              className="w-full border rounded p-2 text-sm mb-2"
              rows={3}
              placeholder="Nội dung đánh giá..."
              value={reviewForm.comment}
              onChange={e => reviewModalMode !== 'view' && setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
              readOnly={reviewModalMode === 'view'}
            />
            <div>
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleUploadImage}
                disabled={uploading}
                style={{ display: 'none' }}
              />
              
              <div className="grid grid-cols-4 gap-2">
                {/* Hiển thị ảnh đã upload */}
                {reviewForm.images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 border-2 border-gray-200 rounded-lg overflow-hidden">
                    <img src={img} alt="review" className="w-full h-full object-cover" />
                    {reviewModalMode !== 'view' && (
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                
                {/* Nút thêm ảnh (chỉ hiển thị khi không ở chế độ view và chưa đạt giới hạn) */}
                {reviewModalMode !== 'view' && reviewForm.images.length < 5 && (
                  <button
                    type="button"
                    onClick={openFilePicker}
                    disabled={uploading}
                    className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    {uploading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                    ) : (
                      <>
                        <span className="text-2xl text-gray-400">+</span>
                        <span className="text-xs text-gray-500 mt-1">Thêm ảnh</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              
              {reviewForm.images.length >= 5 && reviewModalMode !== 'view' && (
                <p className="text-xs text-gray-500 mt-2">Tối đa 5 ảnh</p>
              )}
            </div>
            <div className="flex gap-2">
              {reviewModalMode === 'view' ? (
                <>
                  <Button
                    className="bg-[#003459] text-white"
                    onClick={openEditProductReview}
                  >
                    Sửa đánh giá
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteReview}
                  >
                    Xóa đánh giá
                  </Button>
                </>
              ) : (
                <Button
                  className="bg-[#003459] text-white"
                  onClick={handleSubmitProductReview}
                  disabled={!(reviewForm.rating && reviewForm.comment) || uploading}
                >
                  {reviewModalMode === 'edit' ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
                </Button>
              )}
              {reviewModalMode === 'view' && (
                <Button variant="outline" onClick={closeReviewModal}>
                  Đóng
                </Button>
              )}
              {reviewModalMode === 'edit' && (
                <Button variant="outline" onClick={() => setReviewModalMode('view')}>
                  Hủy
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage; 