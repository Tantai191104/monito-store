import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Package, XCircle, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
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
import {
  useOrderById,
  useCancelOrder,
  useUpdateOrderStatus,
} from '@/hooks/useOrders';

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

  // ✅ Helper to format address
  const formatAddress = (address: any) => {
    return [address.street, address.district, address.province]
      .filter(Boolean)
      .join(', ');
  };

  // ✅ Prepare data for info lists
  const customerInfo = [
    { label: 'Customer Name', value: order.customer.name },
    { label: 'Email', value: order.customer.email },
    { label: 'Phone', value: order.customer.phone || 'N/A' },
    { label: 'Shipping Address', value: formatAddress(order.shippingAddress) },
  ];

  const orderMetadata = [
    { label: 'Order Number', value: `#${order.orderNumber}` },
    {
      label: 'Order Date',
      value: new Date(order.orderDate).toLocaleDateString('vi-VN'),
    },
    {
      label: 'Estimated Delivery',
      value: order.estimatedDelivery
        ? new Date(order.estimatedDelivery).toLocaleDateString('vi-VN')
        : 'N/A',
    },
    { label: 'Total Items', value: order.totalItems },
    {
      label: 'Last Updated',
      value: new Date(order.updatedAt).toLocaleDateString('vi-VN'),
    },
  ];

  return (
    <div className="container mx-auto py-0">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Order #{order.orderNumber}
          </h1>
          <p className="text-muted-foreground">
            Order Details • ID: #{order._id.slice(-8).toUpperCase()}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {order.status !== 'cancelled' && (
            <AlertDialog
              open={showCancelDialog}
              onOpenChange={setShowCancelDialog}
            >
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
                    Are you sure you want to cancel this order? This action
                    cannot be undone.
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
                      <img
                        src={
                          item.item?.images?.[0] || '/placeholder-product.jpg'
                        }
                        alt={item.item?.name || 'Item image'}
                        className="h-16 w-16 rounded border object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-product.jpg';
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {item.item?.name || (
                            <span className="text-gray-500 italic">
                              [Product/Pet not available]
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Type: {item.type}
                        </div>
                        <div className="text-xs text-gray-500">
                          Quantity: {item.quantity}
                        </div>
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
                  <span
                    className={`ml-2 rounded px-2 py-1 text-xs font-semibold ${statusMap[order.status].color}`}
                  >
                    {statusMap[order.status].label}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl text-center font-bold text-blue-600">
                  {order.total.toLocaleString('vi-VN')} ₫
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
                <div className="space-y-3">
                  {customerInfo.map((info) => (
                    <div
                      key={info.label}
                      className="flex justify-between border-b pb-3 text-sm last:border-b-0"
                    >
                      <span className="text-gray-600">{info.label}</span>
                      <span className="text-right font-medium text-gray-900">
                        {info.value}
                      </span>
                    </div>
                  ))}
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
                <div className="space-y-3">
                  {orderMetadata.map((meta) => (
                    <div
                      key={meta.label}
                      className="flex justify-between border-b pb-3 text-sm last:border-b-0"
                    >
                      <span className="text-gray-600">{meta.label}</span>
                      <span className="font-medium text-gray-900">
                        {meta.value}
                      </span>
                    </div>
                  ))}
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
