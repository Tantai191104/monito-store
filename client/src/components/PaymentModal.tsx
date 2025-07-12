import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import PaymentQRCode from './PaymentQRCode';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: number;
  description: string;
  onPaymentSuccess?: () => void;
  onPaymentFailed?: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  orderId,
  amount,
  description,
  onPaymentSuccess,
  onPaymentFailed,
}) => {
  const handlePaymentSuccess = () => {
    onPaymentSuccess?.();
    // Close modal after a short delay to show success state
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handlePaymentFailed = () => {
    onPaymentFailed?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thanh toán đơn hàng</DialogTitle>
          <DialogDescription>
            Vui lòng quét mã QR để hoàn tất thanh toán
          </DialogDescription>
        </DialogHeader>
        <PaymentQRCode
          orderId={orderId}
          amount={amount}
          description={description}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailed={handlePaymentFailed}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal; 