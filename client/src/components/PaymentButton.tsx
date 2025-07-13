import React, { useState } from 'react';
import { Button } from './ui/button';
import { CreditCard } from 'lucide-react';
import PaymentModal from './PaymentModal';

interface PaymentButtonProps {
  orderId: string;
  amount: number;
  description: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onPaymentSuccess?: () => void;
  onPaymentFailed?: () => void;
  children?: React.ReactNode;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  orderId,
  amount,
  description,
  variant = 'default',
  size = 'default',
  className = '',
  onPaymentSuccess,
  onPaymentFailed,
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePaymentSuccess = () => {
    onPaymentSuccess?.();
  };

  const handlePaymentFailed = () => {
    onPaymentFailed?.();
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsModalOpen(true)}
      >
        <CreditCard className="h-4 w-4 mr-2" />
        {children || 'Thanh toán'}
      </Button>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderId={orderId}
        amount={amount}
        description={description}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailed={handlePaymentFailed}
      />
    </>
  );
};

export default PaymentButton; 