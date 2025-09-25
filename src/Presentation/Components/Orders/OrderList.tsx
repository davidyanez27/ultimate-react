interface Item {
  id: string;
  name: string;
  category: string;
  sku: string;
  unit: string;
}

interface Supplier {
  id: string;
  name: string;
  businessType: string;
}

interface PurchaseOrderItem {
  id: string;
  itemId: string;
  item: Item;
  supplierSku: string;
  supplierProductName: string;
  unitCost: number;
  currency: string;
  quantityOrdered: number;
  quantityReceived: number;
  quantityPending: number;
  lineTotal: number;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplier: Supplier;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Sent to Supplier' | 'Partially Received' | 'Received' | 'Cancelled';
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  orderDate: string;
  requestedDeliveryDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
  currency: string;
  paymentTerms: string;
  notes: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  sentAt?: string;
  receivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderListProps {
  orders: PurchaseOrder[];
  selectedOrders: string[];
  onSelectOrder: (orderId: string) => void;
  onSelectAll: () => void;
  onEditOrder: (order: PurchaseOrder) => void;
  onDeleteOrder: (order: PurchaseOrder) => void;
  onChangeStatus: (order: PurchaseOrder, newStatus: PurchaseOrder['status']) => void;
  onDuplicateOrder: (order: PurchaseOrder) => void;
}

export const OrderList = ({
  orders,
  selectedOrders,
  onSelectOrder,
  onSelectAll,
  onEditOrder,
  onDeleteOrder,
  onChangeStatus,
  onDuplicateOrder
}: OrderListProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400';
      case 'Pending Approval':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400';
      case 'Approved':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400';
      case 'Sent to Supplier':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      case 'Partially Received':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400';
      case 'Received':
        return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400';
      case 'Cancelled':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
      case 'High':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400';
      case 'Normal':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      case 'Low':
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Urgent': return '🚨';
      case 'High': return '⚡';
      case 'Normal': return '📊';
      case 'Low': return '📋';
      default: return '📋';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Draft': return '📝';
      case 'Pending Approval': return '⏰';
      case 'Approved': return '✅';
      case 'Sent to Supplier': return '📤';
      case 'Partially Received': return '📦';
      case 'Received': return '✅';
      case 'Cancelled': return '❌';
      default: return '📋';
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

  const getAvailableStatusChanges = (currentStatus: string): PurchaseOrder['status'][] => {
    switch (currentStatus) {
      case 'Draft':
        return ['Pending Approval', 'Cancelled'];
      case 'Pending Approval':
        return ['Approved', 'Draft', 'Cancelled'];
      case 'Approved':
        return ['Sent to Supplier', 'Cancelled'];
      case 'Sent to Supplier':
        return ['Partially Received', 'Received', 'Cancelled'];
      case 'Partially Received':
        return ['Received', 'Cancelled'];
      case 'Received':
        return [];
      case 'Cancelled':
        return ['Draft'];
      default:
        return [];
    }
  };

  const calculateProgress = (order: PurchaseOrder) => {
    const totalOrdered = order.items.reduce((sum, item) => sum + item.quantityOrdered, 0);
    const totalReceived = order.items.reduce((sum, item) => sum + item.quantityReceived, 0);
    return totalOrdered > 0 ? (totalReceived / totalOrdered) * 100 : 0;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Purchase Orders ({orders.length})
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
                  checked={orders.length > 0 && selectedOrders.length === orders.length}
                  onChange={onSelectAll}
                  className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Order Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Items & Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Dates & Delivery
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
            {orders.map((order) => {
              const progress = calculateProgress(order);
              const availableStatusChanges = getAvailableStatusChanges(order.status);
              
              return (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => onSelectOrder(order.id)}
                      className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </td>
                  
                  {/* Order Details */}
                  <td className="px-6 py-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {order.orderNumber}
                        </p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(order.priority)}`}>
                          <span className="mr-1">{getPriorityIcon(order.priority)}</span>
                          {order.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Created by: {order.createdBy}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Order Date: {formatDate(order.orderDate)}
                      </p>
                      {order.approvedBy && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Approved by: {order.approvedBy}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Supplier */}
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-xl">
                        {getBusinessTypeIcon(order.supplier.businessType)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.supplier.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {order.supplier.businessType}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Terms: {order.paymentTerms}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Items & Progress */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="text-xs text-gray-500 dark:text-gray-400">
                            {item.item.name} - {item.quantityOrdered} {item.item.unit}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            +{order.items.length - 2} more items
                          </div>
                        )}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Dates & Delivery */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Requested: {formatDate(order.requestedDeliveryDate)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Expected: {formatDate(order.expectedDeliveryDate)}
                      </p>
                      {order.actualDeliveryDate && (
                        <p className="text-xs text-green-600 dark:text-green-400">
                          Actual: {formatDate(order.actualDeliveryDate)}
                        </p>
                      )}
                      {order.sentAt && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Sent: {formatDate(order.sentAt)}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Financial */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatCurrency(order.totalAmount, order.currency)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Subtotal: {formatCurrency(order.subtotal, order.currency)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Tax: {formatCurrency(order.taxAmount, order.currency)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Shipping: {formatCurrency(order.shippingCost, order.currency)}
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        <span className="mr-1">{getStatusIcon(order.status)}</span>
                        {order.status}
                      </span>
                      
                      {availableStatusChanges.length > 0 && (
                        <div className="relative">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                onChangeStatus(order, e.target.value as PurchaseOrder['status']);
                                e.target.value = '';
                              }
                            }}
                            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            defaultValue=""
                          >
                            <option value="" disabled>Change Status</option>
                            {availableStatusChanges.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEditOrder(order)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm"
                        title="Edit order"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDuplicateOrder(order)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                        title="Duplicate order"
                      >
                        📋
                      </button>
                      <button
                        className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 text-sm"
                        title="Print/Export"
                      >
                        🖨️
                      </button>
                      <button
                        onClick={() => onDeleteOrder(order)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm"
                        title="Delete order"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No purchase orders found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Create your first purchase order to start managing inventory procurement.
          </p>
          <button className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
            New Purchase Order
          </button>
        </div>
      )}
    </div>
  );
};