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

interface CategoryListProps {
  categories: Category[];
  onEditCategory?: (category: Category) => void;
  onDeleteCategory?: (category: Category) => void;
  onToggleStatus?: (category: Category) => void;
  onCreateCategory?: () => void;
}

const CategoryCard = ({ 
  category, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: { 
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onToggleStatus?: (category: Category) => void;
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          {/* Category Icon */}
          <div 
            className="flex h-12 w-12 items-center justify-center rounded-lg text-white text-xl"
            style={{ backgroundColor: category.color }}
          >
            {category.icon}
          </div>
          
          {/* Category Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {category.name}
              </h3>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                category.isActive 
                  ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400'
              }`}>
                {category.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {category.description}
            </p>
            
            <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <span>{category.itemCount} items</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Created {new Date(category.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Toggle Status */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={category.isActive}
              onChange={() => onToggleStatus?.(category)}
            />
            <div className={`relative w-11 h-6 rounded-full peer transition-colors duration-200 ease-in-out ${
              category.isActive 
                ? 'bg-blue-600 dark:bg-blue-500' 
                : 'bg-gray-200 dark:bg-gray-600'
            }`}>
              <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
                category.isActive ? 'transform translate-x-5' : ''
              }`}></div>
            </div>
          </label>

          {/* Edit Button */}
          <button
            onClick={() => onEdit?.(category)}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete?.(category)}
            className="rounded-lg p-2 text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export const CategoryList = ({ 
  categories, 
  onEditCategory, 
  onDeleteCategory, 
  onToggleStatus,
  onCreateCategory 
}: CategoryListProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Categories ({categories.length})
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Organize your items into categories for better management
            </p>
          </div>
          
          <button 
            onClick={onCreateCategory}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Category
          </button>
        </div>
      </div>

      <div className="p-6">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">No categories found</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria, or create a new category.
            </p>
            <div className="mt-6">
              <button 
                onClick={onCreateCategory}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create First Category
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={onEditCategory}
                onDelete={onDeleteCategory}
                onToggleStatus={onToggleStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};