import { BoxCubeIcon, CheckCircleIcon, Building } from "../../Assets/icons";

interface Item {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  minStock: number;
  status: string;
  location: string;
  supplier: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface ItemStatsProps {
  items: Item[];
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
      </div>
    </div>
  </div>
);

export const ItemStats = ({ items }: ItemStatsProps) => {
  const totalItems = items.length;
  const activeItems = items.filter(item => item.status === 'active').length;
  const lowStockItems = items.filter(item => item.status === 'low-stock' || item.stock <= item.minStock).length;
  const outOfStockItems = items.filter(item => item.status === 'out-of-stock' || item.stock === 0).length;
  
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.stock), 0);
  const categories = Array.from(new Set(items.map(item => item.category))).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <StatCard
        title="Total Available Items"
        value={totalItems}
        bgColor="bg-blue-100 dark:bg-blue-500/20"
        iconColor="text-blue-600 dark:text-blue-400"
        icon={<BoxCubeIcon className="icon-1.5em" />}
      />

      <StatCard
        title="Total Stock Out Items"
        value={outOfStockItems}
        bgColor="bg-orange-100 dark:bg-orange-500/20"
        iconColor="text-orange-600 dark:text-orange-400"
        icon={
          <svg className="icon-1.5em" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM13 17h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        }
      />
    </div>
  );
};