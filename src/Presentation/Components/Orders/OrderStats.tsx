import { useState } from "react";

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Sent to Supplier' | 'Partially Received' | 'Received' | 'Cancelled';
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  totalAmount: number;
  currency: string;
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  items: {
    quantityOrdered: number;
    quantityReceived: number;
    lineTotal: number;
  }[];
}

interface OrderStatsProps {
  orders: PurchaseOrder[];
}

export const OrderStats = ({ orders }: OrderStatsProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const totalOrders = orders.length;
  const draftOrders = orders.filter(o => o.status === 'Draft').length;
  const pendingApproval = orders.filter(o => o.status === 'Pending Approval').length;
  const activeOrders = orders.filter(o => 
    ['Approved', 'Sent to Supplier', 'Partially Received'].includes(o.status)
  ).length;
  const completedOrders = orders.filter(o => o.status === 'Received').length;
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

  // Financial calculations
  const totalValue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  
  const pendingValue = orders
    .filter(o => ['Pending Approval', 'Approved', 'Sent to Supplier', 'Partially Received'].includes(o.status))
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const receivedValue = orders
    .filter(o => o.status === 'Received')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Priority breakdown
  const priorityStats = {
    urgent: orders.filter(o => o.priority === 'Urgent' && o.status !== 'Cancelled').length,
    high: orders.filter(o => o.priority === 'High' && o.status !== 'Cancelled').length,
    normal: orders.filter(o => o.priority === 'Normal' && o.status !== 'Cancelled').length,
    low: orders.filter(o => o.priority === 'Low' && o.status !== 'Cancelled').length
  };

  // Delivery performance
  const ordersWithActualDelivery = orders.filter(o => o.actualDeliveryDate);
  const onTimeDeliveries = ordersWithActualDelivery.filter(o => {
    const expected = new Date(o.expectedDeliveryDate);
    const actual = new Date(o.actualDeliveryDate!);
    return actual <= expected;
  }).length;
  
  const onTimeDeliveryRate = ordersWithActualDelivery.length > 0 
    ? (onTimeDeliveries / ordersWithActualDelivery.length) * 100 
    : 0;

  // Average order value
  const averageOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0;

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      change: "+12%",
      trend: "up",
      description: `${activeOrders} active, ${draftOrders} drafts`,
      icon: "📋"
    },
    {
      title: "Total Value",
      value: `$${(totalValue / 1000).toFixed(1)}K`,
      change: "+8.5%",
      trend: "up",
      description: "All active orders",
      icon: "💰"
    },
    {
      title: "Pending Value",
      value: `$${(pendingValue / 1000).toFixed(1)}K`,
      change: "+15%",
      trend: "up",
      description: "Awaiting fulfillment",
      icon: "⏳"
    },
    {
      title: "On-Time Delivery",
      value: `${onTimeDeliveryRate.toFixed(1)}%`,
      change: "+2.3%",
      trend: "up",
      description: "Supplier performance",
      icon: "🚚"
    }
  ];

  const statusStats = [
    {
      title: "Draft",
      value: draftOrders.toString(),
      percentage: totalOrders > 0 ? ((draftOrders / totalOrders) * 100).toFixed(1) : "0",
      color: "gray",
      icon: "📝"
    },
    {
      title: "Pending Approval",
      value: pendingApproval.toString(),
      percentage: totalOrders > 0 ? ((pendingApproval / totalOrders) * 100).toFixed(1) : "0",
      color: "yellow",
      icon: "⏰"
    },
    {
      title: "Active",
      value: activeOrders.toString(),
      percentage: totalOrders > 0 ? ((activeOrders / totalOrders) * 100).toFixed(1) : "0",
      color: "blue",
      icon: "🔄"
    },
    {
      title: "Completed",
      value: completedOrders.toString(),
      percentage: totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : "0",
      color: "green",
      icon: "✅"
    }
  ];

  const priorityData = [
    {
      title: "Urgent",
      value: priorityStats.urgent.toString(),
      color: "red",
      icon: "🚨"
    },
    {
      title: "High",
      value: priorityStats.high.toString(),
      color: "orange",
      icon: "⚡"
    },
    {
      title: "Normal",
      value: priorityStats.normal.toString(),
      color: "blue",
      icon: "📊"
    },
    {
      title: "Low",
      value: priorityStats.low.toString(),
      color: "gray",
      icon: "📋"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
      case 'orange':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400';
      case 'yellow':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400';
      case 'green':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400';
      case 'blue':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      case 'gray':
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {stat.title}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </span>
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.description}
                </p>
              </div>
              <div className="text-3xl ml-4">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Breakdown & Priority Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Order Status
            </h3>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {statusStats.map((stat, index) => (
              <div key={index} className={`p-4 rounded-lg ${getColorClasses(stat.color)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="text-lg font-bold">{stat.value}</span>
                </div>
                <div className="text-sm font-medium mb-1">{stat.title}</div>
                <div className="text-xs opacity-75">{stat.percentage}% of total</div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Order Priority
          </h3>
          <div className="space-y-3">
            {priorityData.map((priority, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{priority.icon}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {priority.title}
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getColorClasses(priority.color)}`}>
                  {priority.value} orders
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Overview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Financial Summary
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Average Order Value
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Per purchase order
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                ${averageOrderValue.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Pending Orders Value
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Awaiting fulfillment
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                ${(pendingValue / 1000).toFixed(1)}K
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Completed Value
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Successfully received
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                ${(receivedValue / 1000).toFixed(1)}K
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <button className="flex items-center justify-center px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
              <span className="mr-2">📊</span>
              Procurement Report
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
              <span className="mr-2">📋</span>
              Reorder Low Stock
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
              <span className="mr-2">📈</span>
              Supplier Performance
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors">
              <span className="mr-2">⚡</span>
              Urgent Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};