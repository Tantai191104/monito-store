import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, QrCode, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { paymentService } from '@/services/paymentService';
import { orderService } from '@/services/orderService';
import { handleApiError } from '@/utils/globalErrorHandler';

interface PaymentQRCodeProps {
  orderId: string;
  amount: number;
  description: string;
  onPaymentSuccess?: () => void;
  onPaymentFailed?: () => void;
  orderUrl?: string;
  onOrderCancelled?: () => void;
  remainingSeconds?: number;
  onRequestClose?: () => void;
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
  onRequestClose,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [transactionId, setTransactionId] = useState<string>('');
  const [manualCheckError, setManualCheckError] = useState<string | null>(null);
  const toastShownRef = useRef(false);
  const prevOrderIdRef = useRef<string | null>(null);
  const [countdown, setCountdown] = useState(remainingSeconds ?? 300);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const cancelledRef = useRef(false);
  const qrEverShownRef = useRef(false);
  const navigate = useNavigate();

  // React Query mutations
  const createPaymentOrderMutation = useMutation({
    mutationFn: (data: { orderId: string; amount: number; description: string }) =>
      paymentService.createZaloPayOrder(data),
    onSuccess: (response) => {
      const data = response.data;
      if (data) {
        setQrCodeUrl(data.order_url);
        qrEverShownRef.current = true;
        setTransactionId(data.app_trans_id);
        if (!toastShownRef.current) {
          toast.success('QR code generated successfully');
          toastShownRef.current = true;
        }
      }
    },
    onError: (error: any) => {
      setPaymentStatus('failed');
      if (!toastShownRef.current) {
        handleApiError(error);
        toastShownRef.current = true;
      }
      onPaymentFailed?.();
    },
  });

  const checkPaymentStatusMutation = useMutation({
    mutationFn: (id: string) => paymentService.checkPaymentStatus(id),
    onSuccess: (response) => {
      if (response.data?.order?.paymentStatus === 'paid') {
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
        setManualCheckError('Payment not received yet. Please try again later!');
      }
    },
    onError: (error: any) => {
      setManualCheckError('Error checking payment status. Please try again!');
      handleApiError(error);
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: (id: string) => orderService.cancelOrder(id),
    onSuccess: () => {
      toast.error('Order was cancelled due to payment timeout');
      if (onPaymentFailed) onPaymentFailed();
      if (typeof onOrderCancelled === 'function') onOrderCancelled();
    },
    onError: (error: any) => {
      handleApiError(error);
      if (onPaymentFailed) onPaymentFailed();
      if (typeof onOrderCancelled === 'function') onOrderCancelled();
    },
  });

  const createPaymentOrder = async () => {
    if (createPaymentOrderMutation.isPending || (prevOrderIdRef.current === orderId && qrCodeUrl)) return;
    
    setQrCodeUrl('');
    setPaymentStatus('pending');
    setTransactionId('');
    toastShownRef.current = false;
    prevOrderIdRef.current = orderId;
    
    createPaymentOrderMutation.mutate({ orderId, amount, description });
  };

  const handleManualCheck = async () => {
    setManualCheckError(null);
    checkPaymentStatusMutation.mutate(orderId);
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
        return 'Payment Successful';
      case 'failed':
        return 'Payment Failed';
      default:
        return 'Pending Payment';
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
            cancelOrderMutation.mutate(orderId);
          }
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [orderUrl, paymentStatus, remainingSeconds, orderId, cancelOrderMutation]);

  useEffect(() => {
    return () => {
      if (qrEverShownRef.current && (paymentStatus as string) !== 'success' && !cancelledRef.current) {
        cancelledRef.current = true;
        cancelOrderMutation.mutate(orderId);
      }
    };
  }, [orderId, paymentStatus, cancelOrderMutation]);

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
              Scan QR Code to Pay with ZaloPay
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="bg-white rounded-xl shadow-md p-3">
              <QRCode value={orderUrl} size={192} />
            </div>
            <div className="text-center text-sm text-gray-600">
              <span className="font-semibold">Time remaining: </span>
              <span className="font-mono text-base text-red-600">{formatCountdown(countdown)}</span>
            </div>
            {paymentStatus === 'pending' && (
              <>
                <Button
                  onClick={handleManualCheck}
                  disabled={checkPaymentStatusMutation.isPending}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 mt-2"
                >
                  {checkPaymentStatusMutation.isPending ? 'Checking...' : 'Check Payment Status'}
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
              Order will be cancelled after {formatCountdown(countdown)} if payment is not completed
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
            Pay with ZaloPay
          </CardTitle>
          <CardDescription>Scan QR code to complete your payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Order ID:</span>
              <span className="text-sm font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Amount:</span>
              <span className="text-sm font-bold text-green-600">
                {formatCurrency(amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Description:</span>
              <span className="text-sm">{description}</span>
            </div>
          </div>

          <div className="flex justify-center">
            <Badge className={getStatusColor()}>{getStatusText()}</Badge>
          </div>

          {createPaymentOrderMutation.isPending ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
              <p className="text-sm text-gray-600">Generating QR code...</p>
            </div>
          ) : qrCodeUrl ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                <QRCode value={qrCodeUrl} size={192} />
              </div>
              <p className="text-xs text-gray-500 text-center">
                Scan QR code with ZaloPay app to complete payment
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-sm text-gray-600">Failed to generate QR code</p>
            </div>
          )}

          {transactionId && (
            <div className="text-center">
              <p className="text-xs text-gray-500">Transaction ID: {transactionId}</p>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="flex justify-center">
              <Button onClick={createPaymentOrder} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          )}

          {paymentStatus === 'pending' && qrCodeUrl && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-gray-500">Automatically checking payment status...</p>
              <Button
                onClick={handleManualCheck}
                disabled={checkPaymentStatusMutation.isPending}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2"
              >
                {checkPaymentStatusMutation.isPending ? 'Checking...' : 'Check Payment Status'}
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
