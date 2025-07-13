import { useState } from 'react';
import { OrderDataTable } from './components/OrderDataTable';
import { orderColumns } from './components/OrderColumns';
import { mockOrders } from '@/data/mockOrders';

const OrdersManagement = () => {
  const [data] = useState(mockOrders);

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
        data={data}
        className="rounded-lg bg-white p-6 shadow"
      />
    </div>
  );
};

export default OrdersManagement;
