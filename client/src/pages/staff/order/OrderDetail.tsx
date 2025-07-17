
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, AlertTriangle } from 'lucide-react';

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
  useOrderById,
  useUpdateOrderStatus,
} from '@/hooks/useOrders';

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  processing: { label: 'Processing', color: 'bg-purple-100 text-purple-800' },
  shipped: { label: 'Shipped', color: 'bg-orange-100 text-orange-800' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  pending_refund: { label: 'Pending Refund', color: 'bg-orange-100 text-orange-800' },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
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

  // Early return if no id
  if (!id) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-80px)] flex-col items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            Invalid Order
          </h3>
          <p className="mb-4 text-gray-600">
            No order ID provided.
          </p>
          <Button onClick={() => navigate('/staff/orders')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const { data: order, isLoading, error } = useOrderById(id);
  const updateOrderStatus = useUpdateOrderStatus();

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

            {/* Refund Request Details */}
            {order.status === 'pending_refund' && order.refundInfo && (
              <Card className="!rounded-sm shadow-none border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-800">
                    <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                    Refund Request Details
                  </CardTitle>
                  <CardDescription>Customer has requested a refund for this order</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Basic Refund Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Reason</h4>
                        <p className="text-sm bg-orange-50 p-2 rounded border">{order.refundInfo.reason}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Refund Amount</h4>
                        <p className="text-sm font-semibold text-red-600 bg-red-50 p-2 rounded border">
                          {order.refundInfo.amount?.toLocaleString('vi-VN')} ₫
                        </p>
                      </div>
                    </div>

                    {/* Bank Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Bank Name</h4>
                        <p className="text-sm bg-gray-50 p-2 rounded border">{order.refundInfo.bankName}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Account Number</h4>
                        <p className="text-sm bg-gray-50 p-2 rounded border font-mono">{order.refundInfo.accountNumber}</p>
                      </div>
                    </div>

                    {/* Description */}
                    {order.refundInfo.description && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Additional Description</h4>
                        <p className="text-sm bg-blue-50 p-3 rounded border">{order.refundInfo.description}</p>
                      </div>
                    )}

                    {/* Attached Images */}
                    {order.refundInfo.images && order.refundInfo.images.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Attached Evidence</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {order.refundInfo.images.map((image: string, index: number) => (
                            <div key={index} className="relative">
                              <img
                                src={image}
                                alt={`Refund evidence ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => window.open(image, '_blank')}
                              />
                              <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                                {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Click on images to view in full size</p>
                      </div>
                    )}

                    {/* Request Date */}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Requested At:</span>
                        <span className="font-medium">
                          {new Date(order.refundInfo.requestedAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
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
                    className={`ml-2 rounded px-2 py-1 text-xs font-semibold ${statusMap[order.status]?.color || 'bg-gray-100 text-gray-800'}`}
                  >
                    {statusMap[order.status]?.label || order.status}
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
