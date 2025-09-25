import { PencilIcon, UserIcon } from "../../Assets/icons";

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

interface ItemCardProps {
  item: Item;
  onEdit?: (item: Item) => void;
  onView?: (item: Item) => void;
  onDelete?: (item: Item) => void;
}

export const ItemCard = ({ item, onEdit, onView, onDelete }: ItemCardProps) => {
  const getStatusColor = (status: string, stock: number, minStock: number) => {
    if (status === 'out-of-stock' || stock === 0) {
      return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400';
    }
    if (status === 'low-stock' || stock <= minStock) {
      return 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400';
    }
    if (status === 'active') {
      return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400';
  };

  const getStatusText = (status: string, stock: number, minStock: number) => {
    if (status === 'out-of-stock' || stock === 0) return 'Out of Stock';
    if (status === 'low-stock' || stock <= minStock) return 'Low Stock';
    if (status === 'active') return 'Active';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 hover:bg-gray-50 dark:hover:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {item.image ? (
              <img
                className="h-16 w-16 rounded-lg object-cover"
                src={item.image}
                alt={item.name}
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-3">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {item.name}
              </h4>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(item.status, item.stock, item.minStock)}`}>
                {getStatusText(item.status, item.stock, item.minStock)}
              </span>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              SKU: {item.sku} • {item.brand}
            </p>
            
            <div className="mt-1 flex items-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center">
                <svg className="mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {item.location}
              </span>
              
              <span className="inline-flex items-center">
                <svg className="mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                {item.category}
              </span>
              
              <span className="inline-flex items-center">
                <svg className="mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Updated {formatDate(item.updatedAt)}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-1">
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatPrice(item.price)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Stock: {item.stock} / Min: {item.minStock}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onView?.(item)}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <UserIcon className="mr-2 fill-current icon-1.5em"/>
            View
          </button>
          
          <button 
            onClick={() => onEdit?.(item)}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <PencilIcon className="mr-2 fill-current icon-1.5em"/>
            Edit
          </button>

          <button 
            onClick={() => onDelete?.(item)}
            className="inline-flex items-center rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-600 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};