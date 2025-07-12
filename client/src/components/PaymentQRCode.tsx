import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, QrCode, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';

interface PaymentQRCodeProps {
  orderId: string;
  amount: number;
  description: string;
  onPaymentSuccess?: () => void;
  onPaymentFailed?: () => void;
  orderUrl?: string;
  onOrderCancelled?: () => void;
  remainingSeconds?: number;
  onRequestClose?: () => void; // <--- thêm prop này
}

interface PaymentResponse {
  order_url: string;
  app_trans_id: string;
  zp_trans_token: string;
}

const PaymentQRCode: React.FC<PaymentQRCodeProps> = ({
  orderId,
  amount,
  description,
  onPaymentSuccess,
  onPaymentFailed,
  orderUrl,
  onOrderCancelled,
  remainingSeconds,
  onRequestClose, // <--- nhận prop này
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [manualCheckLoading, setManualCheckLoading] = useState(false);
  const [manualCheckError, setManualCheckError] = useState<string | null>(null);
  const toastShownRef = useRef(false);
  const prevOrderIdRef = useRef<string | null>(null);
  const [countdown, setCountdown] = useState(remainingSeconds ?? 300);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const cancelledRef = useRef(false);
  const qrEverShownRef = useRef(false);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL;

  const createPaymentOrder = async () => {
    if (isLoading || (prevOrderIdRef.current === orderId && qrCodeUrl)) return;
    setIsLoading(true);
    setQrCodeUrl('');
    setPaymentStatus('pending');
    setTransactionId('');
    toastShownRef.current = false;
    prevOrderIdRef.current = orderId;
    try {
      const response = await fetch(`${API_BASE}/payment/zalopay/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount, description }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }

      const data: PaymentResponse = await response.json();
      setQrCodeUrl(data.order_url);
      qrEverShownRef.current = true;
      setTransactionId(data.app_trans_id);
      if (!toastShownRef.current) {
        toast.success('QR code generated successfully');
        toastShownRef.current = true;
      }
    } catch (error) {
      setPaymentStatus('failed');
      if (!toastShownRef.current) {
        toast.error('Failed to generate QR code');
        toastShownRef.current = true;
      }
      onPaymentFailed?.();
    } finally {
      setIsLoading(false);
    }
  };


  const handleManualCheck = async () => {
    setManualCheckLoading(true);
    setManualCheckError(null);
    try {
      // Gọi API lấy trạng thái đơn hàng
      const orderRes = await fetch(`${API_BASE}/orders/${orderId}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const orderData = await orderRes.json();

      if (orderData.data?.order?.paymentStatus === 'paid') {
        setPaymentStatus('success');
        if (typeof onRequestClose === 'function') {
          onRequestClose();
        }
        if (typeof onPaymentSuccess === 'function') {
          setTimeout(() => {
            onPaymentSuccess();
          }, 1500);
        }
      } else {
        setManualCheckError('Chưa nhận được thanh toán. Vui lòng thử lại sau!');
      }
    } catch (err) {
      setManualCheckError('Có lỗi khi kiểm tra. Vui lòng thử lại!');
    } finally {
      setManualCheckLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'failed':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <QrCode className="h-6 w-6 text-blue-500" />;
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Đã thanh toán';
      case 'failed':
        return 'Thanh toán thất bại';
      default:
        return 'Chờ thanh toán';
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  useEffect(() => {
    toastShownRef.current = false;
    prevOrderIdRef.current = null;
    if (orderUrl) return;
    if (orderId) {
      createPaymentOrder();
    }
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [orderId, orderUrl]);

  useEffect(() => {
    if (!orderUrl || paymentStatus === 'success') {
      if (countdownRef.current) clearInterval(countdownRef.current);
      setCountdown(remainingSeconds ?? 300);
      return;
    }
    setCountdown(remainingSeconds ?? 300);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          if ((paymentStatus as string) !== 'success' && !cancelledRef.current) {
            cancelledRef.current = true;
            fetch(`${API_BASE}/orders/${orderId}/cancel`, {
              method: 'PUT',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
            })
              .then(() => {
                toast.error('Order was cancelled due to payment timeout');
                if (onPaymentFailed) onPaymentFailed();
                if (typeof onOrderCancelled === 'function') onOrderCancelled();
              });
          }
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [orderUrl, paymentStatus, remainingSeconds]);

  useEffect(() => {
    return () => {
      if (qrEverShownRef.current && (paymentStatus as string) !== 'success' && !cancelledRef.current) {
        cancelledRef.current = true;
        fetch(`${API_BASE}/orders/${orderId}/cancel`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        })
          .then(() => {
            toast.error('Order was cancelled because you closed the payment modal');
            if (onPaymentFailed) onPaymentFailed();
            if (typeof onOrderCancelled === 'function') onOrderCancelled();
          });
      }
    };
  }, []);

  useEffect(() => {
    if (paymentStatus === 'success' && typeof onRequestClose === 'function') {
      const timer = setTimeout(() => {
        onRequestClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, onRequestClose]);

  const formatCountdown = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // RENDER
  if (orderUrl) {
    return (
      <>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-6 w-6 text-blue-500" />
              Quét mã QR để thanh toán ZaloPay
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="bg-white rounded-xl shadow-md p-3">
              <QRCode value={orderUrl} size={192} />
            </div>
            <div className="text-center text-sm text-gray-600">
              <span className="font-semibold">Thời gian còn lại: </span>
              <span className="font-mono text-base text-red-600">{formatCountdown(countdown)}</span>
            </div>
            {paymentStatus === 'pending' && (
              <>
                <Button
                  onClick={handleManualCheck}
                  disabled={manualCheckLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 mt-2"
                >
                  {manualCheckLoading ? 'Đang kiểm tra...' : 'Kiểm tra thanh toán'}
                </Button>
                {manualCheckError && (
                  <p className="text-xs text-red-500 text-center mt-1">{manualCheckError}</p>
                )}
              </>
            )}
            <div className="text-center">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}>{getStatusText()}</span>
            </div>
            <div className="text-center text-sm text-gray-600">
              Đơn hàng sẽ bị hủy sau {formatCountdown(countdown)} nếu không thanh toán
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Thanh toán qua ZaloPay
          </CardTitle>
          <CardDescription>Quét mã QR để thanh toán đơn hàng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Mã đơn hàng:</span>
              <span className="text-sm font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Số tiền:</span>
              <span className="text-sm font-bold text-green-600">
                {formatCurrency(amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Mô tả:</span>
              <span className="text-sm">{description}</span>
            </div>
          </div>

          <div className="flex justify-center">
            <Badge className={getStatusColor()}>{getStatusText()}</Badge>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
              <p className="text-sm text-gray-600">Đang tạo mã QR...</p>
            </div>
          ) : qrCodeUrl ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                <QRCode value={qrCodeUrl} size={192} />
              </div>
              <p className="text-xs text-gray-500 text-center">
                Quét mã QR bằng ứng dụng ZaloPay để thanh toán
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-sm text-gray-600">Không thể tạo mã QR</p>
            </div>
          )}

          {transactionId && (
            <div className="text-center">
              <p className="text-xs text-gray-500">Mã giao dịch: {transactionId}</p>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="flex justify-center">
              <Button onClick={createPaymentOrder} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Thử lại
              </Button>
            </div>
          )}

          {paymentStatus === 'pending' && qrCodeUrl && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-gray-500">Tự động kiểm tra trạng thái thanh toán...</p>
              <Button
                onClick={handleManualCheck}
                disabled={manualCheckLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2"
              >
                {manualCheckLoading ? 'Đang kiểm tra...' : 'Kiểm tra thanh toán'}
              </Button>
              {manualCheckError && (
                <p className="text-xs text-red-500 text-center">{manualCheckError}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default PaymentQRCode;
