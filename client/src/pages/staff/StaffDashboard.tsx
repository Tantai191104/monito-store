import { useEffect, useState } from 'react';
import { Package, Heart, ShoppingCart, Users } from 'lucide-react';
import { getAllSummary, getBussinessMetric, getDailyRevenue } from '@/services/adminService';
import type { LucideIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

const iconMap: Record<string, LucideIcon> = {
  'Total Products': Package,
  'Active Pets': Heart,
  'Pending Orders': ShoppingCart,
  'Customers': Users,
  'Total Users': Users,
  'Active Staff': Users,
  'Total Revenue': Package,
  'System Uptime': Package,
  'Products': Package,
  'Pets Registered': Heart,
  'Orders Today': ShoppingCart,
};

interface Stat {
  name: string;
  value: string;
  change?: string;
  trend?: string;
  color?: string;
  bgColor?: string;
}

interface ChartData {
  date: string;
  count: number;
  revenue: number;
  profit: number;
}

const StaffDashboard = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const summary = await getAllSummary(30);
        const metrics = await getBussinessMetric(30);
        setStats([...(summary as Stat[]), ...(metrics as Stat[])]);
      } catch {
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();

    // Fetch daily chart data
    const fetchChart = async () => {
      setChartLoading(true);
      setChartError(null);
      try {
        const data = await getDailyRevenue(30);
        setChartData(data);
      } catch {
        setChartError('Failed to load chart data');
      } finally {
        setChartLoading(false);
      }
    };
    fetchChart();
  }, []);

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
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="rounded-lg bg-white p-6 shadow animate-pulse h-32" />
          ))
        ) : error ? (
          <div className="col-span-4 text-red-500">{error}</div>
        ) : (
          stats.map((stat) => {
            const Icon = iconMap[stat.name] || Package;
            return (
              <div key={stat.name} className={`rounded-lg bg-white p-6 shadow ${stat.bgColor || ''}`}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </h3>
                  <Icon className="h-4 w-4 text-gray-400" />
                </div>
                <div className="mb-2 text-2xl font-bold">{stat.value}</div>
                {stat.change && (
                  <p className="text-xs text-gray-600">
                    <span className={stat.color || ''}>{stat.change}</span>{' '}
                    from last month
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h3 className="text-lg font-semibold mb-4">Daily Revenue & Profit</h3>
        {chartLoading ? (
          <div className="h-64 flex items-center justify-center">Loading chart...</div>
        ) : chartError ? (
          <div className="text-red-500">{chartError}</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={v => v.toLocaleString('en-US')} />
              <Tooltip formatter={v => v.toLocaleString('en-US')} />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
              <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        )}
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
