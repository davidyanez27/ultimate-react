interface Item {
  id: string;
  name: string;
  category: string;
  sku: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
}

interface Supplier {
  id: string;
  name: string;
  businessType: string;
  isActive: boolean;
  isPrimary: boolean;
}

interface ItemSupplierAssociation {
  id: string;
  itemId: string;
  item: Item;
  supplierId: string;
  supplier: Supplier;
  supplierSku: string;
  supplierProductName: string;
  unitCost: number;
  currency: string;
  minimumOrderQuantity: number;
  leadTimedays: number;
  packSize: number;
  packUnit: string;
  availability: 'In Stock' | 'Out of Stock' | 'Limited' | 'Pre-Order';
  lastSupplyDate: string;
  lastOrderQuantity: number;
  lastOrderCost: number;
  isPrimary: boolean;
  isActive: boolean;
  qualityRating: number;
  priceHistory: {
    date: string;
    unitCost: number;
    quantity: number;
  }[];
  notes: string;
}

interface AssociationListProps {
  associations: ItemSupplierAssociation[];
  selectedAssociations: string[];
  onSelectAssociation: (associationId: string) => void;
  onSelectAll: () => void;
  onEditAssociation: (association: ItemSupplierAssociation) => void;
  onDeleteAssociation: (association: ItemSupplierAssociation) => void;
  onToggleStatus: (association: ItemSupplierAssociation) => void;
  onSetPrimary: (association: ItemSupplierAssociation) => void;
}

export const AssociationList = ({
  associations,
  selectedAssociations,
  onSelectAssociation,
  onSelectAll,
  onEditAssociation,
  onDeleteAssociation,
  onToggleStatus,
  onSetPrimary
}: AssociationListProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
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

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'In Stock':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400';
      case 'Out of Stock':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
      case 'Limited':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400';
      case 'Pre-Order':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400';
    }
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'In Stock': return '✅';
      case 'Out of Stock': return '❌';
      case 'Limited': return '⚠️';
      case 'Pre-Order': return '🔄';
      default: return '❓';
    }
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

  const getStockStatusColor = (current: number, minimum: number) => {
    if (current <= 0) return 'text-red-600 dark:text-red-400';
    if (current <= minimum) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Associations ({associations.length})
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
                  checked={associations.length > 0 && selectedAssociations.length === associations.length}
                  onChange={onSelectAll}
                  className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Item Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Supplier Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Product & Pricing
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Supply Details
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
            {associations.map((association) => (
              <tr key={association.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedAssociations.includes(association.id)}
                    onChange={() => onSelectAssociation(association.id)}
                    className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </td>
                
                {/* Item Details */}
                <td className="px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {association.item.name}
                      </p>
                      {association.isPrimary && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      SKU: {association.item.sku}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Category: {association.item.category}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${getStockStatusColor(association.item.currentStock, association.item.minimumStock)}`}>
                        Stock: {association.item.currentStock} {association.item.unit}
                      </span>
                      <span className="text-xs text-gray-400">
                        (Min: {association.item.minimumStock})
                      </span>
                    </div>
                  </div>
                </td>

                {/* Supplier Info */}
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-xl">
                      {getBusinessTypeIcon(association.supplier.businessType)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {association.supplier.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {association.supplier.businessType}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {association.qualityRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-yellow-500">
                          {getRatingStars(association.qualityRating).substring(0, 3)}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Product & Pricing */}
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {association.supplierProductName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Supplier SKU: {association.supplierSku}
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(association.unitCost, association.currency)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Pack: {association.packSize} {association.packUnit}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      MOQ: {association.minimumOrderQuantity}
                    </p>
                  </div>
                </td>

                {/* Supply Details */}
                <td className="px-6 py-4">
                  <div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2 ${getAvailabilityColor(association.availability)}`}>
                      <span className="mr-1">{getAvailabilityIcon(association.availability)}</span>
                      {association.availability}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Lead time: {association.leadTimedays} days
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Last supply: {formatDate(association.lastSupplyDate)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Last order: {association.lastOrderQuantity} units
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total: {formatCurrency(association.lastOrderCost, association.currency)}
                    </p>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={association.isActive}
                        onChange={() => onToggleStatus(association)}
                        className="h-4 w-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                      />
                      <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">
                        Active
                      </span>
                    </label>
                    
                    {association.isActive && !association.isPrimary && (
                      <button
                        onClick={() => onSetPrimary(association)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-left"
                      >
                        Set Primary
                      </button>
                    )}

                    {association.priceHistory.length > 1 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Price trend: 
                        {association.priceHistory[0].unitCost > association.priceHistory[1].unitCost ? (
                          <span className="text-red-500 ml-1">↗ +{((association.priceHistory[0].unitCost - association.priceHistory[1].unitCost) / association.priceHistory[1].unitCost * 100).toFixed(1)}%</span>
                        ) : (
                          <span className="text-green-500 ml-1">↘ -{((association.priceHistory[1].unitCost - association.priceHistory[0].unitCost) / association.priceHistory[1].unitCost * 100).toFixed(1)}%</span>
                        )}
                      </div>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEditAssociation(association)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm"
                      title="Edit association"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDeleteAssociation(association)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm"
                      title="Delete association"
                    >
                      🗑️
                    </button>
                    <button
                      className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 text-sm"
                      title="Price history"
                    >
                      📈
                    </button>
                    <button
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                      title="Create order"
                    >
                      🛒
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {associations.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="text-6xl mb-4">🔗</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No associations found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Start by linking items with suppliers to track pricing and availability.
          </p>
          <button className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
            Link Item & Supplier
          </button>
        </div>
      )}
    </div>
  );
};