import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, CreditCard, Truck, CheckCircle, ShoppingBag, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCart } from '@/contexts/CartContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/utils/formatter';
import { toast } from 'sonner';
import donViHanhChinh from '@/constants/donViHanhChinh34TinhThanh.json';
import Select from 'react-select';
import type { SingleValue, StylesConfig, ActionMeta } from 'react-select';
import React from 'react';
import { Combobox } from '@headlessui/react';
import PaymentQRCode from '@/components/PaymentQRCode';

const checkoutSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  province: z.string().min(1, 'Province is required'),
  district: z.string().min(1, 'District is required'),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const { state, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const createOrder = useCreateOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [provinceQuery, setProvinceQuery] = useState('');
  const [districtQuery, setDistrictQuery] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>('');
  const [orderUrl, setOrderUrl] = useState<string>('');

  const provinces = donViHanhChinh.map((p: any) => ({
    code: p.province_code,
    name: p.name,
    districts: p.wards.reduce((acc: any, w: any) => {
      const districtName = w.name.split(',')[0].trim();
      if (!acc.find((d: any) => d.name === districtName)) {
        acc.push({ name: districtName });
      }
      return acc;
    }, []),
  }));

  const filteredProvinces = provinceQuery === ''
    ? provinces
    : provinces.filter((p: any) => p.name.toLowerCase().includes(provinceQuery.toLowerCase()));

  const selectedProvince = provinces.find((p: any) => p.code === province);
  const districts = selectedProvince ? selectedProvince.districts : [];
  const filteredDistricts = districtQuery === ''
    ? districts
    : districts.filter((d: any) => d.name.toLowerCase().includes(districtQuery.toLowerCase()));

  const provinceOptions = provinces.map((p: any) => ({ value: p.code, label: p.name, districts: p.districts }));
  const selectedProvinceObj = provinceOptions.find((p: any) => p.value === province);
  const districtOptions = selectedProvinceObj ? selectedProvinceObj.districts.map((d: any) => ({ value: d.name, label: d.name })) : [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {},
  });

  // Đồng bộ state dropdown vào react-hook-form
  React.useEffect(() => {
    setValue('province', province);
  }, [province, setValue]);
  React.useEffect(() => {
    setValue('district', district);
  }, [district, setValue]);

  const onSubmit = async (data: CheckoutFormData) => {
    if (state.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    try {
      // Lấy tên province/district từ JSON
      const provinceObj = provinces.find((p: any) => p.code === data.province);
      const provinceName = provinceObj ? provinceObj.name : data.province;
      const districtName = provinceObj && provinceObj.districts.find((d: any) => d.name === data.district)?.name || data.district;
      const orderData = {
        items: state.items.map((item) => ({
          type: item.type,
          itemId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          street: data.street,
          province: provinceName,
          district: districtName,
        },
        notes: data.notes,
        paymentMethod: 'zalopay',
      };

      const result = await createOrder.mutateAsync(orderData);
      
      // Lưu order ID và order_url để sử dụng cho thanh toán
      if (result?.data?.order?._id) {
        setCreatedOrderId(result.data.order._id);
        setOrderUrl(result.data.order.order_url || '');
        setShowPaymentModal(true);
      } else {
        toast.error('Failed to create order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    setShowPaymentModal(false);
    toast.success('Payment successful! Your order has been confirmed.');
    navigate('/customer/orders');
  };

  const handlePaymentFailed = () => {
    toast.error('Payment failed. Please try again.');
    setShowPaymentModal(false);
    setCreatedOrderId(''); // Reset orderId để lần sau tạo lại đơn mới
    setOrderUrl('');
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    // Nếu user đóng modal mà chưa thanh toán, có thể redirect về orders
    navigate('/customer/orders');
  };

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Please add some items to your cart before checkout.</p>
          <Button onClick={() => navigate('/customer/cart')} className="bg-[#003459] hover:bg-[#003459]/90">
            Go to Cart
          </Button>
        </div>
      </div>
    );
  }

  // Tính lại total ở UI
  const total = state.subtotal + state.tax + state.shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="ghost" size="sm" onClick={() => navigate('/customer/cart')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Customer Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={user?.name || ''}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span>Shipping Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="street" className="mb-2">Street Address</Label>
                  <Input
                    id="street"
                    {...register('street')}
                    placeholder="Enter house number, street name..."
                    className={errors.street ? 'border-red-500' : ''}
                  />
                  {errors.street && (
                    <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select Tỉnh/Thành phố */}
                  <div>
                    <Label className="mb-2">Province/City</Label>
                    <Select
                      options={provinceOptions}
                      value={provinceOptions.find(opt => opt.value === province) || null}
                      onChange={(newValue, _action) => {
                        const opt: { value: string; label: string; districts: any[] } | null = newValue as any;
                        setProvince(opt ? opt.value : '');
                        setDistrict('');
                      }}
                      placeholder="Find province/city..."
                      isSearchable
                      classNamePrefix="react-select"
                      styles={{ menu: (base: any) => ({ ...base, zIndex: 100 }) } as StylesConfig}
                    />
                    {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province.message}</p>}
                  </div>
                  {/* Select Quận/Huyện */}
                  <div>
                    <Label className="mb-2">District</Label>
                    <Select
                      options={districtOptions}
                      value={districtOptions.find((opt: any) => opt.value === district) || null}
                      onChange={(newValue, _action) => {
                        const opt: { value: string; label: string } | null = newValue as any;
                        setDistrict(opt ? opt.value : '');
                      }}
                      placeholder="Find district..."
                      isSearchable
                      isDisabled={!province}
                      classNamePrefix="react-select"
                      styles={{ menu: (base: any) => ({ ...base, zIndex: 100 }) } as StylesConfig}
                    />
                    {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes" className="mb-2">Order Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    {...register('notes')}
                    placeholder="Any special instructions or notes for your order"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <QrCode className="h-5 w-5 text-purple-600" />
                  <span>Payment Method</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <QrCode className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">ZaloPay QR Code Payment</p>
                      <p className="text-sm text-blue-700">
                        After placing your order, you'll be able to pay instantly using ZaloPay QR code.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={
                          item.type === 'product'
                            ? (item.item as any).images?.[0] || '/placeholder-product.jpg'
                            : (item.item as any).images?.[0] || '/placeholder-pet.jpg'
                        }
                        alt={(item.item as any).name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {(item.item as any).name}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant={item.type === 'pet' ? 'destructive' : 'default'} className="text-xs">
                            {item.type === 'pet' ? 'Pet' : 'Product'}
                          </Badge>
                          <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-[#003459]">
                        {formatPrice(item.price * item.quantity)} VND
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({state.totalItems} items)</span>
                    <span className="font-medium">{formatPrice(state.subtotal)} VND</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium">{formatPrice(state.tax)} VND</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {state.shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        <>{formatPrice(30000)} VND</>
                      )}
                    </span>
                  </div>

                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#003459]">{formatPrice(total)} VND</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  className="w-full bg-[#003459] hover:bg-[#003459]/90 text-white"
                  size="lg"
                  disabled={isSubmitting || createOrder.isPending}
                >
                  {isSubmitting || createOrder.isPending ? 'Processing...' : 'Place Order & Pay'}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By placing your order, you agree to our terms and conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={handleClosePaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Scan the QR code with ZaloPay to complete your payment
            </DialogDescription>
          </DialogHeader>
          {createdOrderId && (
            <PaymentQRCode
              orderId={createdOrderId}
              orderUrl={orderUrl}
              amount={total}
              description={`Pay for order #${createdOrderId}`}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentFailed={handlePaymentFailed}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutPage; 