import React, { useState } from 'react';
import {
  Users,
  Activity,
  DollarSign,
  Server,
  TrendingUp,
  TrendingDown,
  Database,
  Package,
  Heart,
  ShoppingCart,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Ban,
  ArrowUpRight,
  BarChart3,
  PieChart,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const systemStats = [
    {
      name: 'Total Users',
      value: '2,847',
      icon: Users,
      change: '+12%',
      trend: 'up',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Active Staff',
      value: '23',
      icon: Activity,
      change: '+2',
      trend: 'up',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Total Revenue',
      value: '$45,231',
      icon: DollarSign,
      change: '+18%',
      trend: 'up',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      name: 'System Uptime',
      value: '99.9%',
      icon: Server,
      change: '-0.1%',
      trend: 'down',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  const businessMetrics = [
    { name: 'Products', value: '1,234', change: '+5.2%', trend: 'up' },
    { name: 'Pets Registered', value: '567', change: '+8.1%', trend: 'up' },
    { name: 'Orders Today', value: '89', change: '-2.3%', trend: 'down' },
    {
      name: 'Customer Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      trend: 'up',
    },
  ];

  const recentActivity = [
    {
      action: 'New staff member added',
      user: 'John Admin',
      time: '2 minutes ago',
      type: 'staff',
      icon: Users,
    },
    {
      action: 'User account suspended',
      user: 'Sarah Admin',
      time: '15 minutes ago',
      type: 'user',
      icon: Ban,
    },
    {
      action: 'System backup completed',
      user: 'System',
      time: '1 hour ago',
      type: 'system',
      icon: Database,
    },
    {
      action: 'Database optimization',
      user: 'System',
      time: '3 hours ago',
      type: 'system',
      icon: Server,
    },
    {
      action: 'Large order processed',
      user: 'System',
      time: '5 hours ago',
      type: 'order',
      icon: ShoppingCart,
    },
  ];

  const systemHealth = [
    {
      component: 'Database',
      status: 'Healthy',
      uptime: '99.9%',
      color: 'green',
      description: 'All queries performing normally',
    },
    {
      component: 'API Server',
      status: 'Healthy',
      uptime: '99.8%',
      color: 'green',
      description: 'Response times under 200ms',
    },
    {
      component: 'File Storage',
      status: 'Warning',
      uptime: '98.5%',
      color: 'yellow',
      description: 'Disk usage at 85%',
    },
    {
      component: 'Email Service',
      status: 'Healthy',
      uptime: '99.7%',
      color: 'green',
      description: 'All emails delivered successfully',
    },
  ];

  const userStats = [
    { label: 'Active Today', value: 1247, color: 'bg-green-500' },
    { label: 'New This Week', value: 89, color: 'bg-blue-500' },
    { label: 'Suspended', value: 23, color: 'bg-red-500' },
    { label: 'Pending Verification', value: 156, color: 'bg-yellow-500' },
  ];

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'System Settings',
      description: 'Configure system parameters',
      icon: Server,
      href: '/admin/settings',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'View Reports',
      description: 'Generate and view reports',
      icon: BarChart3,
      href: '/admin/reports',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Database Status',
      description: 'Monitor database health',
      icon: Database,
      href: '/admin/database',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            System overview and administrative controls
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="24h">24h</TabsTrigger>
              <TabsTrigger value="7d">7d</TabsTrigger>
              <TabsTrigger value="30d">30d</TabsTrigger>
              <TabsTrigger value="90d">90d</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button>
            <Eye className="mr-2 h-4 w-4" />
            View All Reports
          </Button>
        </div>
      </div>

      {/* Key System Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {systemStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.name}
                </CardTitle>
                <div className={`rounded-full p-2 ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="mt-1 flex items-center text-xs text-gray-600">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                  )}
                  <span
                    className={
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {stat.change}
                  </span>{' '}
                  from last period
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Business Metrics */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Business Metrics
              </CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                  >
                    <div>
                      <p className="font-medium">{metric.name}</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {metric.value}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`flex items-center text-sm font-medium ${
                          metric.trend === 'up'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {metric.trend === 'up' ? (
                          <TrendingUp className="mr-1 h-3 w-3" />
                        ) : (
                          <TrendingDown className="mr-1 h-3 w-3" />
                        )}
                        {metric.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Statistics
            </CardTitle>
            <CardDescription>Current user activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userStats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{stat.label}</span>
                    <span className="font-bold">
                      {stat.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${stat.color}`}
                      style={{ width: `${(stat.value / 1500) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Health
            </CardTitle>
            <CardDescription>Infrastructure status monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((system, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          system.color === 'green'
                            ? 'bg-green-500'
                            : system.color === 'yellow'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                      />
                      <Database className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">{system.component}</p>
                      <p className="text-sm text-gray-600">
                        {system.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        system.color === 'green' ? 'default' : 'secondary'
                      }
                      className={
                        system.color === 'green'
                          ? 'bg-green-100 text-green-800'
                          : system.color === 'yellow'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }
                    >
                      {system.status}
                    </Badge>
                    <p className="mt-1 text-xs text-gray-500">
                      {system.uptime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest administrative actions and system events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-4 rounded-lg p-3 transition-colors hover:bg-gray-50"
                  >
                    <div
                      className={`rounded-full p-2 ${
                        activity.type === 'staff'
                          ? 'bg-blue-100 text-blue-600'
                          : activity.type === 'user'
                            ? 'bg-green-100 text-green-600'
                            : activity.type === 'system'
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-purple-100 text-purple-600'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-600">
                        by {activity.user}
                      </p>
                    </div>
                    <div className="text-xs whitespace-nowrap text-gray-500">
                      {activity.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto justify-start p-4 hover:border-red-200 hover:bg-red-50"
                  asChild
                >
                  <a href={action.href}>
                    <div className={`rounded-lg p-2 ${action.bgColor} mr-3`}>
                      <Icon className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{action.title}</p>
                      <p className="text-sm text-gray-600">
                        {action.description}
                      </p>
                    </div>
                    <ArrowUpRight className="ml-auto h-4 w-4 text-gray-400" />
                  </a>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
