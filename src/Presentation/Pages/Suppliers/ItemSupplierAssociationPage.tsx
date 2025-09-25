import { useState, useEffect } from "react";
import { PageBreadcrumb } from "../../Components";
import { AssociationStats, AssociationFilters, AssociationList, AssociationForm } from "../../Components/Suppliers";

interface Item {
  id: string;
  name: string;
  category: string;
  sku: string;
  barcode?: string;
  description: string;
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
  createdAt: string;
  updatedAt: string;
}

export const ItemSupplierAssociationPage = () => {
  // Mock data for items
  const [items] = useState<Item[]>([
    {
      id: "1",
      name: "The Cheerful Chomper",
      category: "Mood Burgers",
      sku: "MB-001",
      barcode: "1234567890123",
      description: "Our signature happy burger with special sauce",
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
      barcode: "1234567890124",
      description: "Crispy fries with buffalo seasoning",
      currentStock: 30,
      minimumStock: 15,
      unit: "portion",
      isActive: true
    },
    {
      id: "3",
      name: "Classic Wings",
      category: "Fried Chicken and Wings", 
      sku: "FC-001",
      barcode: "1234567890125",
      description: "Traditional buffalo wings",
      currentStock: 25,
      minimumStock: 10,
      unit: "piece",
      isActive: true
    },
    {
      id: "4",
      name: "Coca Cola",
      category: "Beverages",
      sku: "BV-001", 
      barcode: "1234567890126",
      description: "Classic Coca Cola",
      currentStock: 100,
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
    },
    {
      id: "4",
      name: "Gourmet Ingredients Ltd",
      businessType: "Distributor",
      email: "orders@gourmetingredients.co.uk",
      phone: "+44-20-1234-5678",
      isActive: false,
      isPrimary: false
    }
  ]);

  // Mock association data
  const [associations, setAssociations] = useState<ItemSupplierAssociation[]>([
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
      minimumOrderQuantity: 50,
      leadTimedays: 3,
      packSize: 10,
      packUnit: "pieces",
      availability: "In Stock",
      lastSupplyDate: "2024-01-18",
      lastOrderQuantity: 200,
      lastOrderCost: 500.00,
      isPrimary: true,
      isActive: true,
      qualityRating: 4.8,
      priceHistory: [
        { date: "2024-01-18", unitCost: 2.50, quantity: 200 },
        { date: "2024-01-10", unitCost: 2.45, quantity: 150 },
        { date: "2024-01-03", unitCost: 2.40, quantity: 100 }
      ],
      notes: "Primary supplier for burger patties. Excellent quality and consistency.",
      createdAt: "2023-06-15",
      updatedAt: "2024-01-18"
    },
    {
      id: "2",
      itemId: "1",
      item: items[0],
      supplierId: "4",
      supplier: suppliers[3], 
      supplierSku: "GI-BURGER-PREMIUM",
      supplierProductName: "Gourmet Beef Patty - Wagyu",
      unitCost: 4.20,
      currency: "GBP",
      minimumOrderQuantity: 25,
      leadTimedays: 7,
      packSize: 5,
      packUnit: "pieces",
      availability: "Limited",
      lastSupplyDate: "2024-01-10",
      lastOrderQuantity: 50,
      lastOrderCost: 210.00,
      isPrimary: false,
      isActive: false,
      qualityRating: 4.9,
      priceHistory: [
        { date: "2024-01-10", unitCost: 4.20, quantity: 50 },
        { date: "2023-12-20", unitCost: 4.15, quantity: 25 }
      ],
      notes: "Premium supplier for special events. Currently inactive due to high shipping costs.",
      createdAt: "2023-09-30", 
      updatedAt: "2024-01-10"
    },
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
      minimumOrderQuantity: 100,
      leadTimedays: 2,
      packSize: 20,
      packUnit: "pieces",
      availability: "In Stock",
      lastSupplyDate: "2024-01-19",
      lastOrderQuantity: 300,
      lastOrderCost: 255.00,
      isPrimary: true,
      isActive: true,
      qualityRating: 4.6,
      priceHistory: [
        { date: "2024-01-19", unitCost: 0.85, quantity: 300 },
        { date: "2024-01-12", unitCost: 0.82, quantity: 200 },
        { date: "2024-01-05", unitCost: 0.80, quantity: 150 }
      ],
      notes: "Reliable supplier for chicken wings. Good pricing and quality.",
      createdAt: "2023-08-22",
      updatedAt: "2024-01-19"
    },
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
      minimumOrderQuantity: 200,
      leadTimedays: 5,
      packSize: 24,
      packUnit: "bottles",
      availability: "In Stock",
      lastSupplyDate: "2024-01-17",
      lastOrderQuantity: 480,
      lastOrderCost: 312.00,
      isPrimary: true,
      isActive: true,
      qualityRating: 4.2,
      priceHistory: [
        { date: "2024-01-17", unitCost: 0.65, quantity: 480 },
        { date: "2024-01-08", unitCost: 0.62, quantity: 240 },
        { date: "2023-12-28", unitCost: 0.60, quantity: 360 }
      ],
      notes: "Bulk beverage supplier. Competitive pricing for large orders.",
      createdAt: "2023-05-10",
      updatedAt: "2024-01-17"
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssociations, setSelectedAssociations] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssociation, setEditingAssociation] = useState<ItemSupplierAssociation | null>(null);
  const [filters, setFilters] = useState({
    searchTerm: "",
    itemCategory: "All",
    supplierId: "All",
    availability: "All",
    status: "All",
    sortBy: "itemName"
  });

  // Filter associations based on search and filters
  const filteredAssociations = associations.filter(association => {
    const matchesSearch = `${association.item.name} ${association.supplier.name} ${association.supplierSku} ${association.supplierProductName}`
      .toLowerCase()
      .includes(filters.searchTerm.toLowerCase());
    
    const matchesCategory = filters.itemCategory === "All" || association.item.category === filters.itemCategory;
    const matchesSupplier = filters.supplierId === "All" || association.supplierId === filters.supplierId;
    const matchesAvailability = filters.availability === "All" || association.availability === filters.availability;
    const matchesStatus = filters.status === "All" || 
      (filters.status === "Active" && association.isActive) || 
      (filters.status === "Inactive" && !association.isActive) ||
      (filters.status === "Primary" && association.isPrimary);

    return matchesSearch && matchesCategory && matchesSupplier && matchesAvailability && matchesStatus;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case "itemName":
        return a.item.name.localeCompare(b.item.name);
      case "supplierName":
        return a.supplier.name.localeCompare(b.supplier.name);
      case "unitCost":
        return a.unitCost - b.unitCost;
      case "lastSupply":
        return new Date(b.lastSupplyDate).getTime() - new Date(a.lastSupplyDate).getTime();
      case "qualityRating":
        return b.qualityRating - a.qualityRating;
      default:
        return 0;
    }
  });

  // Get unique categories and suppliers for filters
  const categories = Array.from(new Set(items.map(item => item.category)));
  const activeSuppliers = suppliers.filter(s => s.isActive);

  const handleCreateAssociation = () => {
    setEditingAssociation(null);
    setIsFormOpen(true);
  };

  const handleEditAssociation = (association: ItemSupplierAssociation) => {
    setEditingAssociation(association);
    setIsFormOpen(true);
  };

  const handleDeleteAssociation = (association: ItemSupplierAssociation) => {
    if (confirm(`Are you sure you want to remove the association between ${association.item.name} and ${association.supplier.name}?`)) {
      setAssociations(prev => prev.filter(a => a.id !== association.id));
      console.log('Deleting association:', association.id);
    }
  };

  const handleToggleStatus = (association: ItemSupplierAssociation) => {
    setAssociations(prev => prev.map(a => 
      a.id === association.id 
        ? { ...a, isActive: !a.isActive, updatedAt: new Date().toISOString() }
        : a
    ));
  };

  const handleSetPrimary = (association: ItemSupplierAssociation) => {
    setAssociations(prev => prev.map(a => 
      a.itemId === association.itemId
        ? a.id === association.id 
          ? { ...a, isPrimary: true, updatedAt: new Date().toISOString() }
          : { ...a, isPrimary: false }
        : a
    ));
  };

  const handleSaveAssociation = (associationData: Partial<ItemSupplierAssociation>) => {
    if (editingAssociation) {
      // Update existing association
      setAssociations(prev => prev.map(a => 
        a.id === editingAssociation.id 
          ? { ...a, ...associationData, updatedAt: new Date().toISOString() }
          : a
      ));
    } else {
      // Create new association
      const selectedItem = items.find(item => item.id === associationData.itemId);
      const selectedSupplier = suppliers.find(supplier => supplier.id === associationData.supplierId);
      
      if (selectedItem && selectedSupplier) {
        const newAssociation: ItemSupplierAssociation = {
          id: Date.now().toString(),
          ...associationData,
          item: selectedItem,
          supplier: selectedSupplier,
          priceHistory: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as ItemSupplierAssociation;
        
        setAssociations(prev => [...prev, newAssociation]);
      }
    }
    setIsFormOpen(false);
    setEditingAssociation(null);
  };

  const handleSelectAssociation = (associationId: string) => {
    setSelectedAssociations(prev => 
      prev.includes(associationId) 
        ? prev.filter(id => id !== associationId)
        : [...prev, associationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAssociations.length === filteredAssociations.length) {
      setSelectedAssociations([]);
    } else {
      setSelectedAssociations(filteredAssociations.map(association => association.id));
    }
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete' | 'updatePricing') => {
    if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${selectedAssociations.length} associations?`)) {
        setAssociations(prev => prev.filter(a => !selectedAssociations.includes(a.id)));
        setSelectedAssociations([]);
      }
    } else if (action === 'updatePricing') {
      // Would open a bulk pricing update modal
      console.log('Bulk pricing update for:', selectedAssociations);
    } else {
      const isActive = action === 'activate';
      setAssociations(prev => prev.map(a => 
        selectedAssociations.includes(a.id) 
          ? { ...a, isActive, updatedAt: new Date().toISOString() }
          : a
      ));
      setSelectedAssociations([]);
    }
  };

  if (loading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Item-Supplier Associations" />
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
      <PageBreadcrumb pageTitle="Item-Supplier Associations" />
      
      <div className="space-y-6">
        <AssociationStats 
          associations={associations}
          items={items}
          suppliers={suppliers}
        />

        <AssociationFilters
          searchTerm={filters.searchTerm}
          setSearchTerm={(value) => setFilters(prev => ({ ...prev, searchTerm: value }))}
          itemCategory={filters.itemCategory}
          setItemCategory={(value) => setFilters(prev => ({ ...prev, itemCategory: value }))}
          supplierId={filters.supplierId}
          setSupplierId={(value) => setFilters(prev => ({ ...prev, supplierId: value }))}
          availability={filters.availability}
          setAvailability={(value) => setFilters(prev => ({ ...prev, availability: value }))}
          status={filters.status}
          setStatus={(value) => setFilters(prev => ({ ...prev, status: value }))}
          sortBy={filters.sortBy}
          setSortBy={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
          categories={categories}
          suppliers={activeSuppliers}
          selectedCount={selectedAssociations.length}
          onBulkAction={handleBulkAction}
          onCreateAssociation={handleCreateAssociation}
        />

        <AssociationList 
          associations={filteredAssociations}
          selectedAssociations={selectedAssociations}
          onSelectAssociation={handleSelectAssociation}
          onSelectAll={handleSelectAll}
          onEditAssociation={handleEditAssociation}
          onDeleteAssociation={handleDeleteAssociation}
          onToggleStatus={handleToggleStatus}
          onSetPrimary={handleSetPrimary}
        />
      </div>

      {/* Association Form Modal */}
      {isFormOpen && (
        <AssociationForm
          association={editingAssociation}
          items={items}
          suppliers={activeSuppliers}
          onSave={handleSaveAssociation}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingAssociation(null);
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