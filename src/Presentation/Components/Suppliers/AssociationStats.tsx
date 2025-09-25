import { useState } from "react";

interface Item {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  isActive: boolean;
}

interface Supplier {
  id: string;
  name: string;
  isActive: boolean;
  isPrimary: boolean;
}

interface ItemSupplierAssociation {
  id: string;
  itemId: string;
  item: Item;
  supplierId: string;
  supplier: Supplier;
  unitCost: number;
  currency: string;
  availability: 'In Stock' | 'Out of Stock' | 'Limited' | 'Pre-Order';
  lastSupplyDate: string;
  lastOrderCost: number;
  isPrimary: boolean;
  isActive: boolean;
  qualityRating: number;
  priceHistory: {
    date: string;
    unitCost: number;
    quantity: number;
  }[];
}

interface AssociationStatsProps {
  associations: ItemSupplierAssociation[];
  items: Item[];
  suppliers: Supplier[];
}

export const AssociationStats = ({ associations, items, suppliers }: AssociationStatsProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const totalAssociations = associations.length;
  const activeAssociations = associations.filter(a => a.isActive).length;
  const inactiveAssociations = associations.filter(a => !a.isActive).length;
  
  // Items coverage
  const itemsWithSuppliers = new Set(associations.filter(a => a.isActive).map(a => a.itemId)).size;
  const itemsCoverage = items.length > 0 ? (itemsWithSuppliers / items.length) * 100 : 0;
  
  // Supplier utilization
  const suppliersUsed = new Set(associations.filter(a => a.isActive).map(a => a.supplierId)).size;
  const activeSuppliers = suppliers.filter(s => s.isActive).length;
  const supplierUtilization = activeSuppliers > 0 ? (suppliersUsed / activeSuppliers) * 100 : 0;

  // Average cost and quality
  const activeAssocs = associations.filter(a => a.isActive);
  const averageCost = activeAssocs.length > 0 
    ? activeAssocs.reduce((sum, a) => sum + a.unitCost, 0) / activeAssocs.length
    : 0;
  
  const averageQuality = activeAssocs.length > 0
    ? activeAssocs.reduce((sum, a) => sum + a.qualityRating, 0) / activeAssocs.length
    : 0;

  // Availability breakdown
  const availabilityStats = {
    inStock: associations.filter(a => a.availability === 'In Stock' && a.isActive).length,
    outOfStock: associations.filter(a => a.availability === 'Out of Stock' && a.isActive).length,
    limited: associations.filter(a => a.availability === 'Limited' && a.isActive).length,
    preOrder: associations.filter(a => a.availability === 'Pre-Order' && a.isActive).length
  };

  const totalCost = associations
    .filter(a => a.isActive && a.lastOrderCost)
    .reduce((sum, a) => sum + a.lastOrderCost, 0);

  const primaryAssociations = associations.filter(a => a.isPrimary && a.isActive).length;

  const stats = [
    {
      title: "Total Associations",
      value: totalAssociations.toString(),
      change: "+8%",
      trend: "up",
      description: `${activeAssociations} active, ${inactiveAssociations} inactive`,
      icon: "🔗"
    },
    {
      title: "Items Coverage",
      value: `${itemsCoverage.toFixed(1)}%`,
      change: "+5.2%",
      trend: "up",
      description: `${itemsWithSuppliers} of ${items.length} items covered`,
      icon: "📦"
    },
    {
      title: "Supplier Utilization",
      value: `${supplierUtilization.toFixed(1)}%`,
      change: "+3.1%",
      trend: "up",
      description: `${suppliersUsed} of ${activeSuppliers} suppliers used`,
      icon: "🏢"
    },
    {
      title: "Average Quality",
      value: averageQuality.toFixed(1),
      change: "+0.2",
      trend: "up",
      description: "Based on supplier ratings",
      icon: "⭐"
    }
  ];

  const detailStats = [
    {
      title: "In Stock",
      value: availabilityStats.inStock.toString(),
      percentage: activeAssociations > 0 ? ((availabilityStats.inStock / activeAssociations) * 100).toFixed(1) : "0",
      color: "green",
      icon: "✅"
    },
    {
      title: "Limited Stock",
      value: availabilityStats.limited.toString(),
      percentage: activeAssociations > 0 ? ((availabilityStats.limited / activeAssociations) * 100).toFixed(1) : "0",
      color: "yellow",
      icon: "⚠️"
    },
    {
      title: "Out of Stock",
      value: availabilityStats.outOfStock.toString(),
      percentage: activeAssociations > 0 ? ((availabilityStats.outOfStock / activeAssociations) * 100).toFixed(1) : "0",
      color: "red",
      icon: "❌"
    },
    {
      title: "Pre-Order",
      value: availabilityStats.preOrder.toString(),
      percentage: activeAssociations > 0 ? ((availabilityStats.preOrder / activeAssociations) * 100).toFixed(1) : "0",
      color: "blue",
      icon: "🔄"
    }
  ];

  const financialStats = [
    {
      title: "Average Unit Cost",
      value: `$${averageCost.toFixed(2)}`,
      description: "Across all active associations"
    },
    {
      title: "Total Order Value",
      value: `$${(totalCost / 1000).toFixed(1)}K`,
      description: "Last orders combined"
    },
    {
      title: "Primary Suppliers",
      value: primaryAssociations.toString(),
      description: "Items with primary supplier set"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400';
      case 'yellow':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400';
      case 'red':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
      case 'blue':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
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

      {/* Availability Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Availability Status
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
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {detailStats.map((stat, index) => (
            <div key={index} className={`p-4 rounded-lg ${getColorClasses(stat.color)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-lg font-bold">{stat.value}</span>
              </div>
              <div className="text-sm font-medium mb-1">{stat.title}</div>
              <div className="text-xs opacity-75">{stat.percentage}% of active</div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Overview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Financial Overview
          </h3>
          <div className="space-y-4">
            {financialStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {stat.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
              </div>
            ))}
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
              Cost Analysis Report
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
              <span className="mr-2">💰</span>
              Bulk Price Update
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
              <span className="mr-2">📈</span>
              Supplier Performance
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors">
              <span className="mr-2">🔄</span>
              Sync Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};