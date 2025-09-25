interface LowStockAlert {
  id: string;
  itemName: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low';
  daysUntilEmpty: number;
  supplier: string;
  location: string;
  price: number;
  lastRestocked: string;
  alertCreated: string;
  image?: string;
  isResolved: boolean;
}

interface AlertsListProps {
  alerts: LowStockAlert[];
  selectedAlerts: string[];
  onSelectAlert: (alertId: string) => void;
  onSelectAll: () => void;
  onResolveAlert: (alert: LowStockAlert) => void;
  onRestockItem: (alert: LowStockAlert) => void;
}

const getUrgencyConfig = (level: string) => {
  switch (level) {
    case 'critical':
      return {
        badge: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400',
        border: 'border-l-red-500',
        icon: '🔴',
        label: 'Critical'
      };
    case 'high':
      return {
        badge: 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400',
        border: 'border-l-orange-500',
        icon: '🟠',
        label: 'High'
      };
    case 'medium':
      return {
        badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400',
        border: 'border-l-yellow-500',
        icon: '🟡',
        label: 'Medium'
      };
    case 'low':
      return {
        badge: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400',
        border: 'border-l-green-500',
        icon: '🟢',
        label: 'Low'
      };
    default:
      return {
        badge: 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400',
        border: 'border-l-gray-500',
        icon: '⚪',
        label: 'Unknown'
      };
  }
};

const AlertCard = ({ 
  alert, 
  isSelected,
  onSelect,
  onResolve, 
  onRestock 
}: { 
  alert: LowStockAlert;
  isSelected: boolean;
  onSelect: () => void;
  onResolve: () => void;
  onRestock: () => void;
}) => {
  const urgencyConfig = getUrgencyConfig(alert.urgencyLevel);
  const stockPercentage = Math.round((alert.currentStock / alert.maxStock) * 100);

  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${
      alert.isResolved ? 'opacity-60' : ''
    } ${urgencyConfig.border} border-l-4`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          {/* Checkbox and Item Info */}
          <div className="flex items-start space-x-4">
            {!alert.isResolved && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={onSelect}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {alert.itemName}
                </h3>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${urgencyConfig.badge}`}>
                  {urgencyConfig.icon} {urgencyConfig.label}
                </span>
                {alert.isResolved && (
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400">
                    ✅ Resolved
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">SKU & Category</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.sku}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{alert.category}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Current Stock</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {alert.currentStock} / {alert.maxStock}
                    </p>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className={`h-2 rounded-full ${
                          stockPercentage <= 20 ? 'bg-red-600' : 
                          stockPercentage <= 40 ? 'bg-orange-500' : 
                          'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{stockPercentage}%</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Min: {alert.minStock}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Days Until Empty</p>
                  <p className={`text-lg font-bold ${
                    alert.daysUntilEmpty <= 2 ? 'text-red-600 dark:text-red-400' :
                    alert.daysUntilEmpty <= 5 ? 'text-orange-600 dark:text-orange-400' :
                    'text-green-600 dark:text-green-400'
                  }`}>
                    {alert.daysUntilEmpty} days
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{alert.location}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>{alert.supplier}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span>${alert.price}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Last restocked: {new Date(alert.lastRestocked).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {!alert.isResolved ? (
              <>
                <button
                  onClick={onRestock}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Restock
                </button>
                
                <button
                  onClick={onResolve}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mark Resolved
                </button>
              </>
            ) : (
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                Alert resolved
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AlertsList = ({ 
  alerts, 
  selectedAlerts,
  onSelectAlert,
  onSelectAll,
  onResolveAlert, 
  onRestockItem 
}: AlertsListProps) => {
  const unresolvedAlerts = alerts.filter(alert => !alert.isResolved);
  const allUnresolvedSelected = unresolvedAlerts.length > 0 && 
    unresolvedAlerts.every(alert => selectedAlerts.includes(alert.id));

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {unresolvedAlerts.length > 0 && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={allUnresolvedSelected}
                  onChange={onSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Select all unresolved alerts
                </label>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Stock Alerts ({alerts.length})
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {unresolvedAlerts.length} unresolved alerts requiring attention
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">No stock alerts</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              All items are well-stocked! Try adjusting your filters if you're looking for specific alerts.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                isSelected={selectedAlerts.includes(alert.id)}
                onSelect={() => onSelectAlert(alert.id)}
                onResolve={() => onResolveAlert(alert)}
                onRestock={() => onRestockItem(alert)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};