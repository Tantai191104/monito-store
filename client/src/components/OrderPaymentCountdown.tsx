import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface OrderPaymentCountdownProps {
  orderId: string;
  createdAt: string; // ISO string
  duration?: number; // seconds, default 300 (5 phút)
  onCancelled?: () => void;
}

const API_BASE = import.meta.env.VITE_API_URL;

const OrderPaymentCountdown: React.FC<OrderPaymentCountdownProps> = ({ orderId, createdAt, duration = 300, onCancelled }) => {
  const [remaining, setRemaining] = useState<number>(() => {
    const created = new Date(createdAt).getTime();
    const now = Date.now();
    const diff = Math.floor((created + duration * 1000 - now) / 1000);
    return diff > 0 ? diff : 0;
  });
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (remaining <= 0 && !cancelledRef.current) {
      cancelledRef.current = true;
      fetch(`${API_BASE}/orders/${orderId}/cancel`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(() => {
          toast.error('Order was cancelled due to payment timeout');
          if (typeof onCancelled === 'function') onCancelled();
        });
      return;
    }
    if (remaining > 0) {
      const timer = setInterval(() => {
        setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [remaining, orderId, onCancelled]);

  const formatCountdown = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (remaining <= 0) return null;

  return (
    <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold ml-2">
      Payment expires in {formatCountdown(remaining)}
    </span>
  );
};

export default OrderPaymentCountdown; 