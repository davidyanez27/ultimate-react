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

interface Category {
  id: string;
  name: string;
  isActive?: boolean;
}

interface ItemsListProps {
  items: Item[];
  categories: Category[];
  activeCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
  onEditItem?: (item: Item) => void;
  onViewItem?: (item: Item) => void;
  onDeleteItem?: (item: Item) => void;
  onToggleStatus?: (item: Item) => void;
}

export const ItemsList = ({ items, categories, activeCategory, onCategoryChange, onEditItem, onViewItem, onDeleteItem, onToggleStatus }: ItemsListProps) => {
  const getAvailabilityStatus = (item: Item) => {
    if (item.status === 'out-of-stock' || item.stock === 0) {
      return { text: 'Stock Out', color: 'text-red-600 dark:text-red-400', dot: 'bg-red-600 dark:bg-red-400' };
    }
    if (item.status === 'low-stock' || item.stock <= item.minStock) {
      return { text: 'Available', color: 'text-orange-600 dark:text-orange-400', dot: 'bg-orange-600 dark:bg-orange-400' };
    }
    return { text: 'Available', color: 'text-green-600 dark:text-green-400', dot: 'bg-green-600 dark:bg-green-400' };
  };

  const isItemActive = (item: Item) => {
    return item.status === 'active' && item.stock > 0;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Stocks
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your stock
            </p>
          </div>
          
          <div className="flex items-center">
            <button className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
              Filters
            </button>
          </div>
        </div>

        {/* Category Buttons Row */}
        <div className="flex items-center space-x-3 mb-6">
          <button className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            Items
          </button>
          
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Modifiers
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">No items found</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria, or add a new item.
          </p>
        </div>
      ) : (
        <div className="px-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Section
                </th>
                <th className="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Availability
                </th>
                <th className="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((item) => {
                const availability = getAvailabilityStatus(item);
                const isActive = isItemActive(item);
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </div>
                    </td>
                    <td className="py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {item.category}
                      </div>
                    </td>
                    <td className="py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className={`h-2 w-2 rounded-full ${availability.dot}`}></div>
                        <span className={`text-sm font-medium ${availability.color}`}>
                          {availability.text}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 whitespace-nowrap">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {item.status === 'out-of-stock' || item.stock === 0 ? 'Stock Out' : 'Available'}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isActive}
                            onChange={() => onToggleStatus?.(item)}
                          />
                          <div className={`relative w-11 h-6 rounded-full peer transition-colors duration-200 ease-in-out ${
                            isActive 
                              ? 'bg-blue-600 dark:bg-blue-500' 
                              : 'bg-gray-200 dark:bg-gray-600'
                          }`}>
                            <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
                              isActive ? 'transform translate-x-5' : ''
                            }`}></div>
                          </div>
                        </label>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {items.length > 0 && (
        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div></div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Prev
              </button>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">1</button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                2
              </button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                3
              </button>
              <span className="px-2 text-sm text-gray-500">...</span>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                10
              </button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};