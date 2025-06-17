import { Package, Heart, ShoppingCart, Users } from 'lucide-react';

const StaffDashboard = () => {
  const stats = [
    { name: 'Total Products', value: '1,234', icon: Package, change: '+12%' },
    { name: 'Active Pets', value: '567', icon: Heart, change: '+8%' },
    { name: 'Pending Orders', value: '89', icon: ShoppingCart, change: '-3%' },
    { name: 'Customers', value: '2,345', icon: Users, change: '+15%' },
  ];

  const recentOrders = [
    { id: 1001, customer: 'John Smith', total: 89.97, status: 'Pending' },
    { id: 1002, customer: 'Sarah Johnson', total: 29.99, status: 'Processing' },
    { id: 1003, customer: 'Mike Davis', total: 58.98, status: 'Shipped' },
    { id: 1004, customer: 'Emily Brown', total: 125.96, status: 'Delivered' },
  ];

  const quickActions = [
    {
      title: 'Add Product',
      description: 'Create new product',
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: 'Add Pet',
      description: 'Register new pet',
      icon: Heart,
      color: 'text-red-600',
    },
    {
      title: 'View Orders',
      description: 'Manage orders',
      icon: ShoppingCart,
      color: 'text-green-600',
    },
    {
      title: 'Customers',
      description: 'View customer list',
      icon: Users,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="container mx-auto p-8 py-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-600">
                  {stat.name}
                </h3>
                <Icon className="h-4 w-4 text-gray-400" />
              </div>
              <div className="mb-2 text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-600">
                <span
                  className={
                    stat.change.startsWith('+')
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {stat.change}
                </span>{' '}
                from last month
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b p-6">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <p className="text-gray-600">
              Latest customer orders requiring attention
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b p-6">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <p className="text-gray-600">Common tasks and shortcuts</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.title}
                    className="rounded-lg border p-4 text-left transition-colors hover:bg-gray-50"
                  >
                    <Icon className={`mb-2 h-6 w-6 ${action.color}`} />
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
