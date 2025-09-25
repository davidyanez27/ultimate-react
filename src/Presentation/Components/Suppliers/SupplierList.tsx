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

interface SupplierListProps {
  suppliers: Supplier[];
  selectedSuppliers: string[];
  onSelectSupplier: (supplierId: string) => void;
  onSelectAll: () => void;
  onEditSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (supplier: Supplier) => void;
  onToggleStatus: (supplier: Supplier) => void;
  onSetPrimary: (supplier: Supplier) => void;
}

export const SupplierList = ({
  suppliers,
  selectedSuppliers,
  onSelectSupplier,
  onSelectAll,
  onEditSupplier,
  onDeleteSupplier,
  onToggleStatus,
  onSetPrimary
}: SupplierListProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getBusinessTypeIcon = (type: string) => {
    switch (type) {
      case 'Manufacturer': return '🏭';
      case 'Distributor': return '🚛';
      case 'Wholesaler': return '📦';
      case 'Retailer': return '🏪';
      case 'Service Provider': return '🔧';
      default: return '🏢';
    }
  };

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }
    
    return stars.join('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Suppliers ({suppliers.length})
          </h3>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Grid View
            </button>
            <button className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded">
              List View
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={suppliers.length > 0 && selectedSuppliers.length === suppliers.length}
                  onChange={onSelectAll}
                  className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Supplier Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Financial
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedSuppliers.includes(supplier.id)}
                    onChange={() => onSelectSupplier(supplier.id)}
                    className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </td>
                
                {/* Supplier Info */}
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">
                      {getBusinessTypeIcon(supplier.businessType)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {supplier.name}
                        </p>
                        {supplier.isPrimary && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {supplier.businessType}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {supplier.address.city}, {supplier.address.state}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {supplier.categories.slice(0, 2).map((category, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                            {category}
                          </span>
                        ))}
                        {supplier.categories.length > 2 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{supplier.categories.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {supplier.contactPerson}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {supplier.contactTitle}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {supplier.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {supplier.phone}
                    </p>
                  </div>
                </td>

                {/* Performance */}
                <td className="px-6 py-4">
                  <div>
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {supplier.performance.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-yellow-500">
                        {getRatingStars(supplier.performance.rating).substring(0, 3)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {supplier.performance.totalOrders} orders
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {supplier.performance.onTimeDelivery}% on-time
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Last: {formatDate(supplier.performance.lastOrderDate)}
                    </p>
                  </div>
                </td>

                {/* Financial */}
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(supplier.financials.creditLimit, supplier.financials.currency)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Credit Limit
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Balance: {formatCurrency(supplier.financials.currentBalance, supplier.financials.currency)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Terms: {supplier.financials.paymentTerms}
                    </p>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={supplier.isActive}
                        onChange={() => onToggleStatus(supplier)}
                        className="h-4 w-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                      />
                      <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">
                        Active
                      </span>
                    </label>
                    
                    {supplier.isActive && !supplier.isPrimary && (
                      <button
                        onClick={() => onSetPrimary(supplier)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-left"
                      >
                        Set Primary
                      </button>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEditSupplier(supplier)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm"
                      title="Edit supplier"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDeleteSupplier(supplier)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm"
                      title="Delete supplier"
                    >
                      🗑️
                    </button>
                    {supplier.website && (
                      <a
                        href={supplier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                        title="Visit website"
                      >
                        🌐
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {suppliers.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No suppliers found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Get started by adding your first supplier.
          </p>
          <button className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
            Add Supplier
          </button>
        </div>
      )}
    </div>
  );
};