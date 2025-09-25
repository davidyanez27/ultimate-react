import { useState, useEffect } from "react";

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
  isActive: boolean;
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
  createdAt: string;
  updatedAt: string;
}

interface OrderFormProps {
  order?: PurchaseOrder | null;
  items: Item[];
  suppliers: Supplier[];
  onSave: (orderData: Partial<PurchaseOrder>) => void;
  onCancel: () => void;
}

export const OrderForm = ({ order, items, suppliers, onSave, onCancel }: OrderFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    supplierId: "",
    status: "Draft" as const,
    priority: "Normal" as const,
    orderDate: new Date().toISOString().split('T')[0],
    requestedDeliveryDate: "",
    expectedDeliveryDate: "",
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
    notes: "",
    internalNotes: "",
    createdBy: "Current User"
  });

  const [orderItems, setOrderItems] = useState<Partial<PurchaseOrderItem>[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [taxRate, setTaxRate] = useState(8); // 8% tax rate
  const [shippingCost, setShippingCost] = useState(0);

  useEffect(() => {
    if (order) {
      setFormData({
        supplierId: order.supplierId,
        status: order.status,
        priority: order.priority,
        orderDate: order.orderDate,
        requestedDeliveryDate: order.requestedDeliveryDate,
        expectedDeliveryDate: order.expectedDeliveryDate,
        currency: order.currency,
        paymentTerms: order.paymentTerms,
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        notes: order.notes,
        internalNotes: order.internalNotes,
        createdBy: order.createdBy
      });
      setOrderItems(order.items);
      setSelectedSupplier(order.supplier);
      setShippingCost(order.shippingCost);
      setTaxRate((order.taxAmount / order.subtotal) * 100);
    }
  }, [order]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof typeof prev],
            [child]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSupplierSelect = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    setSelectedSupplier(supplier || null);
    updateFormData('supplierId', supplierId);
    
    // Clear items when supplier changes
    if (supplierId !== formData.supplierId) {
      setOrderItems([]);
    }
  };

  const addItem = () => {
    if (!selectedSupplier) return;
    
    const newItem: Partial<PurchaseOrderItem> = {
      id: Date.now().toString(),
      itemId: "",
      supplierId: selectedSupplier.id,
      supplier: selectedSupplier,
      supplierSku: "",
      supplierProductName: "",
      unitCost: 0,
      currency: formData.currency,
      quantityOrdered: 1,
      quantityReceived: 0,
      quantityPending: 1,
      lineTotal: 0,
      notes: ""
    };
    
    setOrderItems(prev => [...prev, newItem]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    setOrderItems(prev => prev.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        
        // Auto-populate item details when item is selected
        if (field === 'itemId') {
          const selectedItem = items.find(item => item.id === value);
          if (selectedItem) {
            updatedItem.item = selectedItem;
            if (!updatedItem.supplierProductName) {
              updatedItem.supplierProductName = selectedItem.name;
            }
            if (!updatedItem.supplierSku) {
              updatedItem.supplierSku = `SUP-${selectedItem.sku}`;
            }
          }
        }
        
        // Recalculate line total
        if (field === 'quantityOrdered' || field === 'unitCost') {
          const quantity = field === 'quantityOrdered' ? value : (updatedItem.quantityOrdered || 0);
          const cost = field === 'unitCost' ? value : (updatedItem.unitCost || 0);
          updatedItem.lineTotal = quantity * cost;
          updatedItem.quantityPending = quantity - (updatedItem.quantityReceived || 0);
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const removeItem = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const totalAmount = subtotal + taxAmount + shippingCost;
    
    return { subtotal, taxAmount, totalAmount };
  };

  const { subtotal, taxAmount, totalAmount } = calculateTotals();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderData = {
      ...formData,
      items: orderItems.filter(item => item.itemId) as PurchaseOrderItem[],
      subtotal,
      taxAmount,
      shippingCost,
      totalAmount
    };
    
    onSave(orderData);
  };

  const steps = [
    { id: 1, title: "Basic Info", description: "Supplier and order details" },
    { id: 2, title: "Items", description: "Add products to order" },
    { id: 3, title: "Addresses", description: "Shipping and billing" },
    { id: 4, title: "Review", description: "Confirm and submit" }
  ];

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.supplierId && formData.requestedDeliveryDate;
      case 2:
        return orderItems.length > 0 && orderItems.every(item => item.itemId && item.quantityOrdered && item.unitCost);
      case 3:
        return formData.shippingAddress.street && formData.billingAddress.street;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {order ? "Edit Purchase Order" : "New Purchase Order"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {steps.find(s => s.id === currentStep)?.description}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mt-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                }`}>
                  {step.id}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`ml-4 w-8 h-0.5 ${
                    currentStep > step.id
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Supplier Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Supplier *
                    </label>
                    <select
                      required
                      value={formData.supplierId}
                      onChange={(e) => handleSupplierSelect(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Choose a supplier...</option>
                      {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name} - {supplier.businessType}
                        </option>
                      ))}
                    </select>
                    {selectedSupplier && (
                      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedSupplier.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Type: {selectedSupplier.businessType}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Priority
                        </label>
                        <select
                          value={formData.priority}
                          onChange={(e) => updateFormData('priority', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Low">Low</option>
                          <option value="Normal">Normal</option>
                          <option value="High">High</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Currency
                        </label>
                        <select
                          value={formData.currency}
                          onChange={(e) => updateFormData('currency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="CAD">CAD</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Order Date
                        </label>
                        <input
                          type="date"
                          value={formData.orderDate}
                          onChange={(e) => updateFormData('orderDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Requested Delivery *
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.requestedDeliveryDate}
                          onChange={(e) => {
                            updateFormData('requestedDeliveryDate', e.target.value);
                            if (!formData.expectedDeliveryDate) {
                              updateFormData('expectedDeliveryDate', e.target.value);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Payment Terms
                      </label>
                      <select
                        value={formData.paymentTerms}
                        onChange={(e) => updateFormData('paymentTerms', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Net 15">Net 15</option>
                        <option value="Net 30">Net 30</option>
                        <option value="Net 45">Net 45</option>
                        <option value="Net 60">Net 60</option>
                        <option value="Cash on Delivery">Cash on Delivery</option>
                        <option value="Prepayment">Prepayment</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Order Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => updateFormData('notes', e.target.value)}
                    placeholder="Add any special instructions or notes for the supplier..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Items */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Order Items
                  </h3>
                  <button
                    type="button"
                    onClick={addItem}
                    disabled={!selectedSupplier}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + Add Item
                  </button>
                </div>

                {orderItems.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No items added yet. Click "Add Item" to start building your order.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {orderItems.map((item, index) => (
                    <div key={item.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Item *
                          </label>
                          <select
                            required
                            value={item.itemId || ""}
                            onChange={(e) => updateItem(index, 'itemId', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select item...</option>
                            {items.filter(item => item.isActive).map(item => (
                              <option key={item.id} value={item.id}>
                                {item.name} ({item.sku})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Quantity *
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={item.quantityOrdered || ""}
                            onChange={(e) => updateItem(index, 'quantityOrdered', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Unit Cost *
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={item.unitCost || ""}
                            onChange={(e) => updateItem(index, 'unitCost', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Line Total
                          </label>
                          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-900 dark:text-white">
                            ${(item.lineTotal || 0).toFixed(2)}
                          </div>
                        </div>

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="w-full px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Supplier SKU
                          </label>
                          <input
                            type="text"
                            value={item.supplierSku || ""}
                            onChange={(e) => updateItem(index, 'supplierSku', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Supplier Product Name
                          </label>
                          <input
                            type="text"
                            value={item.supplierProductName || ""}
                            onChange={(e) => updateItem(index, 'supplierProductName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                {orderItems.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Order Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                          <span className="font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Items:</span>
                          <span className="text-gray-900 dark:text-white">{orderItems.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Addresses */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Shipping Address
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Street *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.shippingAddress.street}
                          onChange={(e) => updateFormData('shippingAddress.street', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.shippingAddress.city}
                            onChange={(e) => updateFormData('shippingAddress.city', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.shippingAddress.state}
                            onChange={(e) => updateFormData('shippingAddress.state', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.shippingAddress.zipCode}
                            onChange={(e) => updateFormData('shippingAddress.zipCode', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Country *
                          </label>
                          <select
                            required
                            value={formData.shippingAddress.country}
                            onChange={(e) => updateFormData('shippingAddress.country', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="USA">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Billing Address
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          updateFormData('billingAddress', formData.shippingAddress);
                        }}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        Copy from shipping
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Street *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.billingAddress.street}
                          onChange={(e) => updateFormData('billingAddress.street', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.billingAddress.city}
                            onChange={(e) => updateFormData('billingAddress.city', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.billingAddress.state}
                            onChange={(e) => updateFormData('billingAddress.state', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.billingAddress.zipCode}
                            onChange={(e) => updateFormData('billingAddress.zipCode', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Country *
                          </label>
                          <select
                            required
                            value={formData.billingAddress.country}
                            onChange={(e) => updateFormData('billingAddress.country', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="USA">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Costs */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Additional Costs
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={taxRate}
                        onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Shipping Cost
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={shippingCost}
                        onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Internal Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.internalNotes}
                    onChange={(e) => updateFormData('internalNotes', e.target.value)}
                    placeholder="Add internal notes (not visible to supplier)..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Order Review
                </h3>

                {/* Order Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Order Details</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Supplier:</strong> {selectedSupplier?.name}</div>
                        <div><strong>Priority:</strong> {formData.priority}</div>
                        <div><strong>Order Date:</strong> {formData.orderDate}</div>
                        <div><strong>Requested Delivery:</strong> {formData.requestedDeliveryDate}</div>
                        <div><strong>Payment Terms:</strong> {formData.paymentTerms}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Financial Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax ({taxRate}%):</span>
                          <span>${taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>${shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold pt-2 border-t border-gray-300 dark:border-gray-600">
                          <span>Total:</span>
                          <span>${totalAmount.toFixed(2)} {formData.currency}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Items ({orderItems.length})</h4>
                  <div className="space-y-2">
                    {orderItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.item?.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Quantity: {item.quantityOrdered} × ${item.unitCost?.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          ${item.lineTotal?.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              
              {currentStep < steps.length ? (
                <button
                  type="button"
                  disabled={!isStepValid(currentStep)}
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                >
                  {order ? "Update Order" : "Create Order"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};