import { useState, useEffect } from "react";

interface Item {
  id: string;
  name: string;
  category: string;
  sku: string;
  unit: string;
  isActive: boolean;
}

interface Supplier {
  id: string;
  name: string;
  businessType: string;
  isActive: boolean;
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

interface AssociationFormProps {
  association?: ItemSupplierAssociation | null;
  items: Item[];
  suppliers: Supplier[];
  onSave: (associationData: Partial<ItemSupplierAssociation>) => void;
  onCancel: () => void;
}

export const AssociationForm = ({ association, items, suppliers, onSave, onCancel }: AssociationFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    itemId: "",
    supplierId: "",
    supplierSku: "",
    supplierProductName: "",
    unitCost: 0,
    currency: "USD",
    minimumOrderQuantity: 1,
    leadTimedays: 1,
    packSize: 1,
    packUnit: "pieces",
    availability: "In Stock" as const,
    lastSupplyDate: "",
    lastOrderQuantity: 0,
    lastOrderCost: 0,
    isPrimary: false,
    isActive: true,
    qualityRating: 5,
    notes: ""
  });

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    if (association) {
      setFormData({
        itemId: association.itemId,
        supplierId: association.supplierId,
        supplierSku: association.supplierSku,
        supplierProductName: association.supplierProductName,
        unitCost: association.unitCost,
        currency: association.currency,
        minimumOrderQuantity: association.minimumOrderQuantity,
        leadTimedays: association.leadTimedays,
        packSize: association.packSize,
        packUnit: association.packUnit,
        availability: association.availability,
        lastSupplyDate: association.lastSupplyDate,
        lastOrderQuantity: association.lastOrderQuantity,
        lastOrderCost: association.lastOrderCost,
        isPrimary: association.isPrimary,
        isActive: association.isActive,
        qualityRating: association.qualityRating,
        notes: association.notes
      });
      setSelectedItem(association.item);
      setSelectedSupplier(association.supplier);
    }
  }, [association]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemSelect = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    setSelectedItem(item || null);
    updateFormData('itemId', itemId);
    
    // Auto-generate supplier product name if supplier is already selected
    if (item && selectedSupplier) {
      updateFormData('supplierProductName', `${item.name} - ${selectedSupplier.name} Supply`);
    }
  };

  const handleSupplierSelect = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    setSelectedSupplier(supplier || null);
    updateFormData('supplierId', supplierId);
    
    // Auto-generate supplier product name if item is already selected
    if (selectedItem && supplier) {
      updateFormData('supplierProductName', `${selectedItem.name} - ${supplier.name} Supply`);
    }
    
    // Auto-generate supplier SKU
    if (selectedItem && supplier) {
      const supplierCode = supplier.name.substring(0, 3).toUpperCase();
      const itemCode = selectedItem.sku.replace('-', '');
      updateFormData('supplierSku', `${supplierCode}-${itemCode}`);
    }
  };

  const calculateLastOrderCost = () => {
    const cost = formData.unitCost * formData.lastOrderQuantity;
    updateFormData('lastOrderCost', cost);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const steps = [
    { id: 1, title: "Selection", description: "Choose item and supplier" },
    { id: 2, title: "Product Info", description: "Supplier product details" },
    { id: 3, title: "Pricing", description: "Cost and order information" },
    { id: 4, title: "Supply Details", description: "Availability and logistics" },
    { id: 5, title: "Settings", description: "Status and notes" }
  ];

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.itemId && formData.supplierId;
      case 2:
        return formData.supplierSku && formData.supplierProductName;
      case 3:
        return formData.unitCost > 0 && formData.minimumOrderQuantity > 0;
      case 4:
        return formData.leadTimedays > 0 && formData.packSize > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {association ? "Edit Association" : "Link Item & Supplier"}
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
            {/* Step 1: Item & Supplier Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Item Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Item *
                    </label>
                    <select
                      required
                      value={formData.itemId}
                      onChange={(e) => handleItemSelect(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Choose an item...</option>
                      {items.filter(item => item.isActive).map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.sku}) - {item.category}
                        </option>
                      ))}
                    </select>
                    {selectedItem && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedItem.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SKU: {selectedItem.sku} | Category: {selectedItem.category} | Unit: {selectedItem.unit}
                        </p>
                      </div>
                    )}
                  </div>

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
                      {suppliers.filter(supplier => supplier.isActive).map(supplier => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name} - {supplier.businessType}
                        </option>
                      ))}
                    </select>
                    {selectedSupplier && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedSupplier.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Type: {selectedSupplier.businessType}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedItem && selectedSupplier && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-400 mb-2">
                      Association Preview
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Linking "{selectedItem.name}" with supplier "{selectedSupplier.name}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Product Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Supplier SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.supplierSku}
                    onChange={(e) => updateFormData('supplierSku', e.target.value)}
                    placeholder="Enter supplier's SKU for this product"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Supplier Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.supplierProductName}
                    onChange={(e) => updateFormData('supplierProductName', e.target.value)}
                    placeholder="Enter the product name as listed by supplier"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Pack Size *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.packSize}
                      onChange={(e) => updateFormData('packSize', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Pack Unit *
                    </label>
                    <select
                      required
                      value={formData.packUnit}
                      onChange={(e) => updateFormData('packUnit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pieces">Pieces</option>
                      <option value="kg">Kilograms</option>
                      <option value="lbs">Pounds</option>
                      <option value="liters">Liters</option>
                      <option value="gallons">Gallons</option>
                      <option value="boxes">Boxes</option>
                      <option value="cases">Cases</option>
                      <option value="pallets">Pallets</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Pricing Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Unit Cost *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.unitCost}
                      onChange={(e) => {
                        updateFormData('unitCost', parseFloat(e.target.value) || 0);
                        calculateLastOrderCost();
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Minimum Order Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.minimumOrderQuantity}
                    onChange={(e) => updateFormData('minimumOrderQuantity', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Last Order Information (Optional)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Order Quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.lastOrderQuantity}
                        onChange={(e) => {
                          updateFormData('lastOrderQuantity', parseInt(e.target.value) || 0);
                          calculateLastOrderCost();
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Order Total Cost
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.lastOrderCost}
                        onChange={(e) => updateFormData('lastOrderCost', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Supply Details */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Lead Time (Days) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.leadTimedays}
                      onChange={(e) => updateFormData('leadTimedays', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Availability Status
                    </label>
                    <select
                      value={formData.availability}
                      onChange={(e) => updateFormData('availability', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                      <option value="Limited">Limited Stock</option>
                      <option value="Pre-Order">Pre-Order</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Supply Date
                    </label>
                    <input
                      type="date"
                      value={formData.lastSupplyDate}
                      onChange={(e) => updateFormData('lastSupplyDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quality Rating
                    </label>
                    <select
                      value={formData.qualityRating}
                      onChange={(e) => updateFormData('qualityRating', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4.5}>4.5 - Very Good</option>
                      <option value={4}>4 - Good</option>
                      <option value={3.5}>3.5 - Fair</option>
                      <option value={3}>3 - Average</option>
                      <option value={2.5}>2.5 - Below Average</option>
                      <option value={2}>2 - Poor</option>
                      <option value={1.5}>1.5 - Very Poor</option>
                      <option value={1}>1 - Terrible</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Settings & Notes */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => updateFormData('notes', e.target.value)}
                    placeholder="Add any additional notes about this supplier relationship..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => updateFormData('isActive', e.target.checked)}
                      className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Active association
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPrimary"
                      checked={formData.isPrimary}
                      onChange={(e) => updateFormData('isPrimary', e.target.checked)}
                      className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="isPrimary" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Primary supplier for this item
                    </label>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Association Summary
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Item: {selectedItem?.name}</p>
                      <p className="text-gray-600 dark:text-gray-400">Supplier: {selectedSupplier?.name}</p>
                      <p className="text-gray-600 dark:text-gray-400">Product: {formData.supplierProductName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Unit Cost: {formData.currency} {formData.unitCost}</p>
                      <p className="text-gray-600 dark:text-gray-400">MOQ: {formData.minimumOrderQuantity}</p>
                      <p className="text-gray-600 dark:text-gray-400">Lead Time: {formData.leadTimedays} days</p>
                    </div>
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
                  {association ? "Update Association" : "Create Association"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};