import { OrderDataTable } from './components/OrderDataTable';
import { orderColumns } from './components/OrderColumns';
import { useOrders } from '@/hooks/useOrders';

const OrdersManagement = () => {
  const { data, isLoading, error } = useOrders();
  const orders = data?.orders || [];

  if (error)
    return <div className="p-8 text-red-500">Error loading orders</div>;

  return (
    <div className="container mx-auto py-0">
      {/* ✅ Refactored Header for consistency */}
      <div className="mb-3 border-b p-6">
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-muted-foreground">
          Manage customer orders, track shipments, and process payments.
        </p>
      </div>

      <OrderDataTable
        columns={orderColumns}
        data={orders}
        isLoading={isLoading}
        className="p-6"
      />
    </div>
  );
};

export default OrdersManagement;
