interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  itemCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoryStatsProps {
  categories: Category[];
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  subtitle?: string;
}

const StatCard = ({ title, value, icon, bgColor, iconColor, subtitle }: StatCardProps) => (
  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
    <div className="flex items-center space-x-3">
      <div className={`rounded-lg ${bgColor} p-2 flex items-center justify-center`}>
        <div className={`h-6 w-6 ${iconColor} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

export const CategoryStats = ({ categories }: CategoryStatsProps) => {
  const totalCategories = categories.length;
  const activeCategories = categories.filter(cat => cat.isActive).length;
  const totalItems = categories.reduce((sum, cat) => sum + cat.itemCount, 0);
  const emptyCategories = categories.filter(cat => cat.itemCount === 0).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Categories"
        value={totalCategories}
        subtitle={`${activeCategories} active`}
        bgColor="bg-blue-100 dark:bg-blue-500/20"
        iconColor="text-blue-600 dark:text-blue-400"
        icon={
          <svg className="icon-1.5em" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
          </svg>
        }
      />

      <StatCard
        title="Active Categories"
        value={activeCategories}
        subtitle="Currently in use"
        bgColor="bg-green-100 dark:bg-green-500/20"
        iconColor="text-green-600 dark:text-green-400"
        icon={
          <svg className="icon-1.5em" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      <StatCard
        title="Total Items"
        value={totalItems}
        subtitle="Across all categories"
        bgColor="bg-purple-100 dark:bg-purple-500/20"
        iconColor="text-purple-600 dark:text-purple-400"
        icon={
          <svg className="icon-1.5em" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        }
      />

      <StatCard
        title="Empty Categories"
        value={emptyCategories}
        subtitle="Need items assigned"
        bgColor="bg-orange-100 dark:bg-orange-500/20"
        iconColor="text-orange-600 dark:text-orange-400"
        icon={
          <svg className="icon-1.5em" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        }
      />
    </div>
  );
};