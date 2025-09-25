import { useState, useEffect } from "react";
import { PageBreadcrumb } from "../../Components";
import { OrderStats, OrderFilters, OrderList, OrderForm } from "../../Components/Orders";

interface Item {
  id: string;
  name: string;
  category: string;
  sku: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  isActive: boolean;
}

interface Supplier {
  id: string;
  name: string;
  businessType: string;
  email: string;
  phone: string;
  isActive: boolean;
  isPrimary: boolean;
}

interface PurchaseOrderItem {
  id: string;
  itemId: string;
  item: Item;
  supplierId: string;
  supplier: Supplier;
  supplierSku: string;
  supplierProductName: string;
  unitCost: number;
  currency: string;
  quantityOrdered: number;
  quantityReceived: number;
  quantityPending: number;
  lineTotal: number;
  notes: string;
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
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes: string;
  internalNotes: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  sentAt?: string;
  receivedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export const PurchaseOrdersPage = () => {
  // Mock data for items
  const [items] = useState<Item[]>([
    {
      id: "1",
      name: "The Cheerful Chomper",
      category: "Mood Burgers",
      sku: "MB-001",
      currentStock: 45,
      minimumStock: 20,
      unit: "piece",
      isActive: true
    },
    {
      id: "2", 
      name: "Fiery Buffalo Fries",
      category: "House Fries",
      sku: "HF-001",
      currentStock: 15,
      minimumStock: 15,
      unit: "portion",
      isActive: true
    },
    {
      id: "3",
      name: "Classic Wings",
      category: "Fried Chicken and Wings", 
      sku: "FC-001",
      currentStock: 8,
      minimumStock: 10,
      unit: "piece",
      isActive: true
    },
    {
      id: "4",
      name: "Coca Cola",
      category: "Beverages",
      sku: "BV-001", 
      currentStock: 30,
      minimumStock: 50,
      unit: "bottle",
      isActive: true
    }
  ]);

  // Mock data for suppliers
  const [suppliers] = useState<Supplier[]>([
    {
      id: "1",
      name: "Fresh Foods Distribution Co.",
      businessType: "Distributor",
      email: "orders@freshfoodsco.com",
      phone: "+1-555-0123",
      isActive: true,
      isPrimary: true
    },
    {
      id: "2", 
      name: "Premium Poultry Solutions",
      businessType: "Manufacturer",
      email: "sales@premiumpoultry.com",
      phone: "+1-555-0456",
      isActive: true,
      isPrimary: false
    },
    {
      id: "3",
      name: "Local Beverage Supply",
      businessType: "Wholesaler", 
      email: "info@localbeverage.net",
      phone: "+1-555-0789",
      isActive: true,
      isPrimary: false
    }
  ]);

  // Mock purchase orders data
  const [orders, setOrders] = useState<PurchaseOrder[]>([
    {
      id: "1",
      orderNumber: "PO-2024-001",
      supplierId: "1",
      supplier: suppliers[0],
      status: "Pending Approval",
      priority: "High",
      orderDate: "2024-01-20",
      requestedDeliveryDate: "2024-01-25",
      expectedDeliveryDate: "2024-01-25",
      items: [
        {
          id: "1",
          itemId: "1",
          item: items[0],
          supplierId: "1",
          supplier: suppliers[0],
          supplierSku: "FFC-BURGER-001",
          supplierProductName: "Premium Beef Patty - 4oz",
          unitCost: 2.50,
          currency: "USD",
          quantityOrdered: 100,
          quantityReceived: 0,
          quantityPending: 100,
          lineTotal: 250.00,
          notes: ""
        },
        {
          id: "2",
          itemId: "2",
          item: items[1],
          supplierId: "1",
          supplier: suppliers[0],
          supplierSku: "FFC-FRIES-001",
          supplierProductName: "Buffalo Seasoned Fries",
          unitCost: 1.75,
          currency: "USD",
          quantityOrdered: 50,
          quantityReceived: 0,
          quantityPending: 50,
          lineTotal: 87.50,
          notes: ""
        }
      ],
      subtotal: 337.50,
      taxAmount: 27.00,
      shippingCost: 15.00,
      totalAmount: 379.50,
      currency: "USD",
      paymentTerms: "Net 30",
      shippingAddress: {
        street: "123 Restaurant Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      billingAddress: {
        street: "123 Restaurant Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      notes: "Rush order for weekend promotion",
      internalNotes: "Priority order - check quality upon delivery",
      createdBy: "John Doe",
      createdAt: "2024-01-20T09:00:00Z",
      updatedAt: "2024-01-20T09:00:00Z"
    },
    {
      id: "2",
      orderNumber: "PO-2024-002",
      supplierId: "2",
      supplier: suppliers[1],
      status: "Sent to Supplier",
      priority: "Normal",
      orderDate: "2024-01-19",
      requestedDeliveryDate: "2024-01-24",
      expectedDeliveryDate: "2024-01-24",
      items: [
        {
          id: "3",
          itemId: "3",
          item: items[2],
          supplierId: "2",
          supplier: suppliers[1],
          supplierSku: "PPS-WING-CLASSIC",
          supplierProductName: "Free Range Chicken Wings - Large",
          unitCost: 0.85,
          currency: "USD",
          quantityOrdered: 200,
          quantityReceived: 0,
          quantityPending: 200,
          lineTotal: 170.00,
          notes: ""
        }
      ],
      subtotal: 170.00,
      taxAmount: 13.60,
      shippingCost: 12.00,
      totalAmount: 195.60,
      currency: "USD",
      paymentTerms: "Net 15",
      shippingAddress: {
        street: "123 Restaurant Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      billingAddress: {
        street: "123 Restaurant Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      notes: "Standard weekly order",
      internalNotes: "Regular supplier - reliable delivery",
      createdBy: "Jane Smith",
      approvedBy: "John Doe",
      approvedAt: "2024-01-19T14:30:00Z",
      sentAt: "2024-01-19T15:00:00Z",
      createdAt: "2024-01-19T10:00:00Z",
      updatedAt: "2024-01-19T15:00:00Z"
    },
    {
      id: "3",
      orderNumber: "PO-2024-003",
      supplierId: "3",
      supplier: suppliers[2],
      status: "Partially Received",
      priority: "Normal",
      orderDate: "2024-01-18",
      requestedDeliveryDate: "2024-01-22",
      expectedDeliveryDate: "2024-01-22",
      actualDeliveryDate: "2024-01-21",
      items: [
        {
          id: "4",
          itemId: "4",
          item: items[3],
          supplierId: "3",
          supplier: suppliers[2],
          supplierSku: "LBS-COKE-330ML",
          supplierProductName: "Coca Cola Classic - 330ml Bottles",
          unitCost: 0.65,
          currency: "USD",
          quantityOrdered: 240,
          quantityReceived: 200,
          quantityPending: 40,
          lineTotal: 156.00,
          notes: "Partial delivery - remaining 40 bottles to arrive tomorrow"
        }
      ],
      subtotal: 156.00,
      taxAmount: 12.48,
      shippingCost: 8.00,
      totalAmount: 176.48,
      currency: "USD",
      paymentTerms: "Net 45",
      shippingAddress: {
        street: "123 Restaurant Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      billingAddress: {
        street: "123 Restaurant Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      notes: "Bulk beverage order for month",
      internalNotes: "Partial delivery due to supplier inventory shortage",
      createdBy: "Mike Johnson",
      approvedBy: "John Doe",
      approvedAt: "2024-01-18T11:00:00Z",
      sentAt: "2024-01-18T11:30:00Z",
      createdAt: "2024-01-18T09:00:00Z",
      updatedAt: "2024-01-21T16:00:00Z"
    },
    {
      id: "4",
      orderNumber: "PO-2024-004",
      supplierId: "1",
      supplier: suppliers[0],
      status: "Draft",
      priority: "Low",
      orderDate: "2024-01-21",
      requestedDeliveryDate: "2024-01-28",
      expectedDeliveryDate: "2024-01-28",
      items: [
        {
          id: "5",
          itemId: "1",
          item: items[0],
          supplierId: "1",
          supplier: suppliers[0],
          supplierSku: "FFC-BURGER-001",
          supplierProductName: "Premium Beef Patty - 4oz",
          unitCost: 2.50,
          currency: "USD",
          quantityOrdered: 75,
          quantityReceived: 0,
          quantityPending: 75,
          lineTotal: 187.50,
          notes: ""
        }
      ],
      subtotal: 187.50,
      taxAmount: 15.00,
      shippingCost: 10.00,
      totalAmount: 212.50,
      currency: "USD",
      paymentTerms: "Net 30",
      shippingAddress: {
        street: "123 Restaurant Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      billingAddress: {
        street: "123 Restaurant Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      notes: "Regular restock order",
      internalNotes: "Draft order - needs review before submission",
      createdBy: "Sarah Wilson",
      createdAt: "2024-01-21T08:00:00Z",
      updatedAt: "2024-01-21T08:00:00Z"
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [filters, setFilters] = useState({
    searchTerm: "",
    supplierId: "All",
    status: "All",
    priority: "All",
    dateRange: "All",
    sortBy: "orderDate"
  });

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = `${order.orderNumber} ${order.supplier.name} ${order.createdBy}`
      .toLowerCase()
      .includes(filters.searchTerm.toLowerCase());
    
    const matchesSupplier = filters.supplierId === "All" || order.supplierId === filters.supplierId;
    const matchesStatus = filters.status === "All" || order.status === filters.status;
    const matchesPriority = filters.priority === "All" || order.priority === filters.priority;
    
    let matchesDateRange = true;
    if (filters.dateRange !== "All") {
      const orderDate = new Date(order.orderDate);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (filters.dateRange) {
        case "today":
          matchesDateRange = daysDiff === 0;
          break;
        case "week":
          matchesDateRange = daysDiff <= 7;
          break;
        case "month":
          matchesDateRange = daysDiff <= 30;
          break;
        case "quarter":
          matchesDateRange = daysDiff <= 90;
          break;
      }
    }

    return matchesSearch && matchesSupplier && matchesStatus && matchesPriority && matchesDateRange;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case "orderNumber":
        return a.orderNumber.localeCompare(b.orderNumber);
      case "supplier":
        return a.supplier.name.localeCompare(b.supplier.name);
      case "status":
        return a.status.localeCompare(b.status);
      case "totalAmount":
        return b.totalAmount - a.totalAmount;
      case "orderDate":
      default:
        return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
    }
  });

  // Get unique suppliers for filters
  const activeSuppliers = suppliers.filter(s => s.isActive);

  const handleCreateOrder = () => {
    setEditingOrder(null);
    setIsFormOpen(true);
  };

  const handleEditOrder = (order: PurchaseOrder) => {
    setEditingOrder(order);
    setIsFormOpen(true);
  };

  const handleDeleteOrder = (order: PurchaseOrder) => {
    if (confirm(`Are you sure you want to delete order ${order.orderNumber}?`)) {
      setOrders(prev => prev.filter(o => o.id !== order.id));
      console.log('Deleting order:', order.id);
    }
  };

  const handleChangeStatus = (order: PurchaseOrder, newStatus: PurchaseOrder['status']) => {
    setOrders(prev => prev.map(o => 
      o.id === order.id 
        ? { 
            ...o, 
            status: newStatus, 
            updatedAt: new Date().toISOString(),
            ...(newStatus === 'Approved' && { approvedBy: 'Current User', approvedAt: new Date().toISOString() }),
            ...(newStatus === 'Sent to Supplier' && { sentAt: new Date().toISOString() }),
            ...(newStatus === 'Received' && { receivedAt: new Date().toISOString(), actualDeliveryDate: new Date().toISOString().split('T')[0] }),
            ...(newStatus === 'Cancelled' && { cancelledAt: new Date().toISOString() })
          }
        : o
    ));
  };

  const handleDuplicateOrder = (order: PurchaseOrder) => {
    const newOrder: PurchaseOrder = {
      ...order,
      id: Date.now().toString(),
      orderNumber: `PO-2024-${String(orders.length + 1).padStart(3, '0')}`,
      status: 'Draft',
      orderDate: new Date().toISOString().split('T')[0],
      approvedBy: undefined,
      approvedAt: undefined,
      sentAt: undefined,
      receivedAt: undefined,
      actualDeliveryDate: undefined,
      items: order.items.map(item => ({
        ...item,
        id: `${Date.now()}-${item.id}`,
        quantityReceived: 0,
        quantityPending: item.quantityOrdered
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setOrders(prev => [...prev, newOrder]);
  };

  const handleSaveOrder = (orderData: Partial<PurchaseOrder>) => {
    if (editingOrder) {
      // Update existing order
      setOrders(prev => prev.map(o => 
        o.id === editingOrder.id 
          ? { ...o, ...orderData, updatedAt: new Date().toISOString() }
          : o
      ));
    } else {
      // Create new order
      const newOrder: PurchaseOrder = {
        id: Date.now().toString(),
        orderNumber: `PO-2024-${String(orders.length + 1).padStart(3, '0')}`,
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as PurchaseOrder;
      
      setOrders(prev => [...prev, newOrder]);
    }
    setIsFormOpen(false);
    setEditingOrder(null);
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const handleBulkAction = (action: 'approve' | 'send' | 'cancel' | 'delete') => {
    if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${selectedOrders.length} orders?`)) {
        setOrders(prev => prev.filter(o => !selectedOrders.includes(o.id)));
        setSelectedOrders([]);
      }
    } else {
      const statusMap = {
        approve: 'Approved' as const,
        send: 'Sent to Supplier' as const,
        cancel: 'Cancelled' as const
      };
      
      const newStatus = statusMap[action];
      setOrders(prev => prev.map(o => 
        selectedOrders.includes(o.id) 
          ? { 
              ...o, 
              status: newStatus, 
              updatedAt: new Date().toISOString(),
              ...(action === 'approve' && { approvedBy: 'Current User', approvedAt: new Date().toISOString() }),
              ...(action === 'send' && { sentAt: new Date().toISOString() }),
              ...(action === 'cancel' && { cancelledAt: new Date().toISOString() })
            }
          : o
      ));
      setSelectedOrders([]);
    }
  };

  if (loading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Purchase Orders" />
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle="Purchase Orders" />
      
      <div className="space-y-6">
        <OrderStats orders={orders} />

        <OrderFilters
          searchTerm={filters.searchTerm}
          setSearchTerm={(value) => setFilters(prev => ({ ...prev, searchTerm: value }))}
          supplierId={filters.supplierId}
          setSupplierId={(value) => setFilters(prev => ({ ...prev, supplierId: value }))}
          status={filters.status}
          setStatus={(value) => setFilters(prev => ({ ...prev, status: value }))}
          priority={filters.priority}
          setPriority={(value) => setFilters(prev => ({ ...prev, priority: value }))}
          dateRange={filters.dateRange}
          setDateRange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
          sortBy={filters.sortBy}
          setSortBy={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
          suppliers={activeSuppliers}
          selectedCount={selectedOrders.length}
          onBulkAction={handleBulkAction}
          onCreateOrder={handleCreateOrder}
        />

        <OrderList 
          orders={filteredOrders}
          selectedOrders={selectedOrders}
          onSelectOrder={handleSelectOrder}
          onSelectAll={handleSelectAll}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
          onChangeStatus={handleChangeStatus}
          onDuplicateOrder={handleDuplicateOrder}
        />
      </div>

      {/* Order Form Modal */}
      {isFormOpen && (
        <OrderForm
          order={editingOrder}
          items={items}
          suppliers={activeSuppliers}
          onSave={handleSaveOrder}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingOrder(null);
          }}
        />
      )}
      
      {error && 
        <div className="bg-red-100 border border-red-400 text-red-500 px-4 py-3 rounded relative mt-5 text-center" role="alert">
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      }
    </>
  );
};