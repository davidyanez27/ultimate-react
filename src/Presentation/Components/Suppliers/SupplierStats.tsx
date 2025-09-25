import { useState } from "react";

interface Supplier {
  id: string;
  name: string;
  businessType: 'Manufacturer' | 'Distributor' | 'Wholesaler' | 'Retailer' | 'Service Provider';
  email: string;
  phone: string;
  website?: string;
  contactPerson: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  businessInfo: {
    taxId: string;
    registrationNumber: string;
    businessLicense?: string;
    certifications: string[];
  };
  performance: {
    rating: number;
    totalOrders: number;
    onTimeDelivery: number;
    averageResponseTime: number;
    qualityScore: number;
    lastOrderDate: string;
  };
  financials: {
    paymentTerms: string;
    creditLimit: number;
    currentBalance: number;
    currency: string;
  };
  categories: string[];
  isActive: boolean;
  isPrimary: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface SupplierStatsProps {
  suppliers: Supplier[];
}

export const SupplierStats = ({ suppliers }: SupplierStatsProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.isActive).length;
  const primarySuppliers = suppliers.filter(s => s.isPrimary).length;
  const inactiveSuppliers = suppliers.filter(s => !s.isActive).length;

  const averageRating = suppliers.length > 0 
    ? suppliers.reduce((sum, s) => sum + s.performance.rating, 0) / suppliers.length
    : 0;

  const totalOrders = suppliers.reduce((sum, s) => sum + s.performance.totalOrders, 0);
  
  const averageOnTimeDelivery = suppliers.length > 0
    ? suppliers.reduce((sum, s) => sum + s.performance.onTimeDelivery, 0) / suppliers.length
    : 0;

  const totalCreditLimit = suppliers.reduce((sum, s) => sum + s.financials.creditLimit, 0);
  const totalCurrentBalance = suppliers.reduce((sum, s) => sum + s.financials.currentBalance, 0);

  const stats = [
    {
      title: "Total Suppliers",
      value: totalSuppliers.toString(),
      change: "+12%",
      trend: "up",
      description: `${activeSuppliers} active, ${inactiveSuppliers} inactive`,
      icon: "👥"
    },
    {
      title: "Average Rating",
      value: averageRating.toFixed(1),
      change: "+0.3",
      trend: "up",
      description: "Based on performance metrics",
      icon: "⭐"
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      change: "+8%",
      trend: "up",
      description: "Across all suppliers",
      icon: "📦"
    },
    {
      title: "On-Time Delivery",
      value: `${averageOnTimeDelivery.toFixed(1)}%`,
      change: "+2.1%",
      trend: "up",
      description: "Average delivery performance",
      icon: "🚚"
    }
  ];

  const financialStats = [
    {
      title: "Total Credit Limit",
      value: `$${(totalCreditLimit / 1000).toFixed(0)}K`,
      description: "Combined credit limits"
    },
    {
      title: "Outstanding Balance",
      value: `$${(totalCurrentBalance / 1000).toFixed(0)}K`,
      description: "Current outstanding amounts"
    },
    {
      title: "Primary Suppliers",
      value: primarySuppliers.toString(),
      description: "Key supplier relationships"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Performance Stats */}
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

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {financialStats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.title}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {stat.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Actions
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
            <span className="mr-2">📊</span>
            Performance Report
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
            <span className="mr-2">💰</span>
            Financial Summary
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
            <span className="mr-2">📈</span>
            Supplier Analytics
          </button>
        </div>
      </div>
    </div>
  );
};