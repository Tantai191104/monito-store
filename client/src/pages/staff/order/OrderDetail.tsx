import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Loader2,
  Package,
  CheckCircle2,
  XCircle,
  Truck,
  CreditCard,
  Calendar,
  User,
  ShoppingCart,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useOrderById, useCancelOrder, useUpdateOrderStatus } from '@/hooks/useOrders';

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  processing: { label: 'Processing', color: 'bg-purple-100 text-purple-800' },
  shipped: { label: 'Shipped', color: 'bg-orange-100 text-orange-800' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

const paymentStatusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Refunded', color: 'bg-blue-100 text-blue-800' },
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { data: order, isLoading, error } = useOrderById(id!);
  const cancelOrder = useCancelOrder();
  const updateOrderStatus = useUpdateOrderStatus();

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      await cancelOrder.mutateAsync(order._id);
      toast.success('Order cancelled successfully!');
      navigate('/staff/orders');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to cancel order');
    }
  };

  const handleBack = () => {
    navigate('/staff/orders');
  };

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-80px)] flex-col items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            Order Not Found
          </h3>
          <p className="mb-4 text-gray-600">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-0">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="text-muted-foreground">
            Order Details • ID: #{order._id.slice(-8).toUpperCase()}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {order.status !== 'cancelled' && (
            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Order
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this order? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Back</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancelOrder}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={cancelOrder.isPending}
                  >
                    {cancelOrder.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      'Cancel Order'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Order Items */}
            <Card className="!rounded-sm shadow-none">
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  {order.items.length} item(s) in this order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-4">
                      {item.item.image && (
                        <img
                          src={item.item.image}
                          alt={item.item.name}
                          className="h-16 w-16 rounded object-cover border"
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.item.name}</div>
                        <div className="text-xs text-gray-500">Type: {item.type}</div>
                        <div className="text-xs text-gray-500">Quantity: {item.quantity}</div>
                      </div>
                      <div className="text-right font-semibold text-blue-600">
                        {item.subtotal.toLocaleString('vi-VN')} ₫
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            {order.notes && (
              <Card className="!gap-2 !rounded-sm shadow-none">
                <CardHeader>
                  <CardTitle>Order Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Status & Total */}
            <Card className="!rounded-sm shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Order Status
                  <span className={`ml-2 rounded px-2 py-1 text-xs font-semibold ${statusMap[order.status].color}`}>
                    {statusMap[order.status].label}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-3xl font-bold text-blue-600">
                    {order.total.toLocaleString('vi-VN')} ₫
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className={`rounded px-2 py-1 text-xs font-semibold ${paymentStatusMap[order.paymentStatus].color}`}>
                      {paymentStatusMap[order.paymentStatus].label}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="!gap-2 !rounded-sm shadow-none">
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>Contact and address details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{order.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{order.customer.email}</span>
                    {order.customer.phone && <span>• {order.customer.phone}</span>}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.zipCode}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Metadata */}
            <Card className="!gap-2 !rounded-sm shadow-none">
              <CardHeader>
                <CardTitle>Order Metadata</CardTitle>
                <CardDescription>Dates and identifiers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>Order Number: <span className="font-medium">{order.orderNumber}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Order Date: {new Date(order.orderDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  {order.estimatedDelivery && (
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-gray-500" />
                      <span>Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString('vi-VN')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-gray-500" />
                    <span>Total Items: {order.totalItems}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-gray-500" />
                    <span>Created: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-gray-500" />
                    <span>Last Updated: {new Date(order.updatedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderDetailSkeleton = () => (
  <div className="container mx-auto py-0">
    {/* Header Skeleton */}
    <div className="mb-3 flex items-center justify-between border-b p-6">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-48" />
      </div>
      <div className="flex items-center space-x-3">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
    {/* Content Skeleton */}
    <div className="mx-auto max-w-7xl p-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  </div>
);

export default OrderDetail; 