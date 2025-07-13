import { useState } from 'react';
import { OrderDataTable } from './components/OrderDataTable';
import { orderColumns } from './components/OrderColumns';
import { mockOrders } from '@/data/mockOrders';
import { useOrders } from '@/hooks/useOrders';

const OrdersManagement = () => {
  // const [data] = useState(mockOrders);
  const { data, isLoading, error } = useOrders();
  const orders = data?.orders || [];

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading orders</div>;

  return (
    <div className="container mx-auto p-8 py-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-muted-foreground">
          Manage customer orders, track shipments, and process payments.
        </p>
      </div>

      <OrderDataTable
        columns={orderColumns}
        data={orders}
        className="rounded-lg bg-white p-6 shadow"
      />
    </div>
  );
};

export default OrdersManagement;
