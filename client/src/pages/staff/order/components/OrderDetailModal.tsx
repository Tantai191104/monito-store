import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/formatter';
import type { Order } from '@/types/order';
import { MapPin, CreditCard, Calendar, Truck, Package, AlertTriangle } from 'lucide-react';

interface OrderDetailModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderDetailModal = ({ order, open, onOpenChange }: OrderDetailModalProps) => {
  if (!order) return null;

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
      case 'pending_refund':
        return 'outline';
      case 'refunded':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order #{order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status & Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge variant={getStatusVariant(order.status)} className="mt-1">
                {order.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Payment Status</p>
              <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'} className="mt-1">
                {order.paymentStatus}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Order Date</p>
              <p className="text-sm">{new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
          </div>

          <Separator />

          {/* Customer Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-sm">{order.customer?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm">{order.customer?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <img
                    src={item.image || '/placeholder-product.jpg'}
                    alt={item.item?.name || 'Product'}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant={item.type === 'pet' ? 'destructive' : 'default'} className="text-xs">
                        {item.type === 'pet' ? 'Pet' : 'Product'}
                      </Badge>
                      <h4 className="font-medium">{item.item?.name || 'N/A'}</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × {formatPrice(item.item?.price || 0)} VND
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.subtotal)} VND</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Shipping Address
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{order.shippingAddress.street}</p>
              <p>{(order.shippingAddress as any).district || order.shippingAddress.state}, {(order.shippingAddress as any).province || order.shippingAddress.city}</p>
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Order Summary
            </h3>
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
              <div className="flex justify-between font-medium text-lg">
                <span>Total:</span>
                <span className="text-blue-600">{formatPrice(order.total)} VND</span>
              </div>
            </div>
          </div>

          {/* Refund Information */}
          {order.status === 'pending_refund' && order.refundInfo && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                  Refund Request
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Reason</p>
                      <p className="text-sm">{order.refundInfo.reason}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Refund Amount</p>
                      <p className="text-sm font-semibold text-red-600">{formatPrice(order.refundInfo.amount)} VND</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Bank Name</p>
                      <p className="text-sm">{order.refundInfo.bankName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Account Number</p>
                      <p className="text-sm">{order.refundInfo.accountNumber}</p>
                    </div>
                  </div>
                  
                  {order.refundInfo.description && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Description</p>
                      <p className="text-sm">{order.refundInfo.description}</p>
                    </div>
                  )}

                  {/* Refund Images */}
                  {order.refundInfo.images && order.refundInfo.images.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Attached Images</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {order.refundInfo.images.map((image: string, index: number) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Refund evidence ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => window.open(image, '_blank')}
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Click on images to view in full size</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-gray-700">Requested At</p>
                    <p className="text-sm">{new Date(order.refundInfo.requestedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Order Notes */}
          {order.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Order Notes</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal; 