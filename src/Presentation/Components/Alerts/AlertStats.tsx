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

interface AlertStatsProps {
  alerts: LowStockAlert[];
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  textColor: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, icon, bgColor, iconColor, textColor, subtitle, trend }: StatCardProps) => (
  <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`rounded-xl ${bgColor} p-3 flex items-center justify-center`}>
          <div className={`h-6 w-6 ${iconColor} flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
      
      {trend && (
        <div className={`flex items-center space-x-1 text-sm ${
          trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={trend.isPositive ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"}
            />
          </svg>
          <span className="font-medium">{trend.value}%</span>
        </div>
      )}
    </div>
  </div>
);

export const AlertStats = ({ alerts }: AlertStatsProps) => {
  const unresolvedAlerts = alerts.filter(alert => !alert.isResolved);
  const criticalAlerts = unresolvedAlerts.filter(alert => alert.urgencyLevel === 'critical').length;
  const highAlerts = unresolvedAlerts.filter(alert => alert.urgencyLevel === 'high').length;
  const totalUnresolved = unresolvedAlerts.length;
  const averageDaysUntilEmpty = unresolvedAlerts.length > 0 
    ? Math.round(unresolvedAlerts.reduce((sum, alert) => sum + alert.daysUntilEmpty, 0) / unresolvedAlerts.length)
    : 0;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Critical Alerts"
        value={criticalAlerts}
        subtitle="Immediate attention needed"
        bgColor="bg-red-100 dark:bg-red-500/20"
        iconColor="text-red-600 dark:text-red-400"
        textColor="text-red-600 dark:text-red-400"
        trend={{ value: 12, isPositive: false }}
        icon={
          <svg className="icon-1.5em" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        }
      />

      <StatCard
        title="High Priority"
        value={highAlerts}
        subtitle="Needs restocking soon"
        bgColor="bg-orange-100 dark:bg-orange-500/20"
        iconColor="text-orange-600 dark:text-orange-400"
        textColor="text-orange-600 dark:text-orange-400"
        trend={{ value: 8, isPositive: false }}
        icon={
          <svg className="icon-1.5em" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7H4l5-5v5z" />
          </svg>
        }
      />

      <StatCard
        title="Total Active Alerts"
        value={totalUnresolved}
        subtitle="Unresolved alerts"
        bgColor="bg-blue-100 dark:bg-blue-500/20"
        iconColor="text-blue-600 dark:text-blue-400"
        textColor="text-blue-600 dark:text-blue-400"
        trend={{ value: 5, isPositive: false }}
        icon={
          <svg className="icon-1.5em" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7H4l5-5v5z" />
          </svg>
        }
      />

      <StatCard
        title="Avg. Days Until Empty"
        value={averageDaysUntilEmpty}
        subtitle="Based on current usage"
        bgColor="bg-purple-100 dark:bg-purple-500/20"
        iconColor="text-purple-600 dark:text-purple-400"
        textColor="text-purple-600 dark:text-purple-400"
        trend={{ value: 15, isPositive: true }}
        icon={
          <svg className="icon-1.5em" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    </div>
  );
};