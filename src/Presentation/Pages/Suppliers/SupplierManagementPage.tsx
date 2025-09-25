import { useState, useEffect } from "react";
import { PageBreadcrumb } from "../../Components";
import { SupplierStats, SupplierFilters, SupplierList, SupplierForm } from "../../Components/Suppliers";

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
    averageResponseTime: number; // in hours
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

export const SupplierManagementPage = () => {
  // Mock supplier data
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "1",
      name: "Fresh Foods Distribution Co.",
      businessType: "Distributor",
      email: "orders@freshfoodsco.com",
      phone: "+1-555-0123",
      website: "https://freshfoodsco.com",
      contactPerson: "Sarah Johnson",
      contactTitle: "Sales Manager",
      contactEmail: "sarah.johnson@freshfoodsco.com",
      contactPhone: "+1-555-0124",
      address: {
        street: "1234 Distribution Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      businessInfo: {
        taxId: "12-3456789",
        registrationNumber: "CA-DIST-001",
        businessLicense: "BL-2024-001",
        certifications: ["HACCP", "ISO 9001", "FDA Approved"]
      },
      performance: {
        rating: 4.8,
        totalOrders: 156,
        onTimeDelivery: 94.5,
        averageResponseTime: 2.3,
        qualityScore: 4.7,
        lastOrderDate: "2024-01-20"
      },
      financials: {
        paymentTerms: "Net 30",
        creditLimit: 50000,
        currentBalance: 12500,
        currency: "USD"
      },
      categories: ["Mood Burgers", "House Fries"],
      isActive: true,
      isPrimary: true,
      notes: "Primary supplier for burger ingredients and frozen products. Excellent quality and reliability.",
      createdAt: "2023-06-15",
      updatedAt: "2024-01-20"
    },
    {
      id: "2",
      name: "Premium Poultry Solutions",
      businessType: "Manufacturer",
      email: "sales@premiumpoultry.com",
      phone: "+1-555-0456",
      website: "https://premiumpoultry.com",
      contactPerson: "Michael Chen",
      contactTitle: "Account Executive",
      contactEmail: "m.chen@premiumpoultry.com",
      contactPhone: "+1-555-0457",
      address: {
        street: "567 Farm Road",
        city: "Atlanta",
        state: "GA",
        zipCode: "30309",
        country: "USA"
      },
      businessInfo: {
        taxId: "98-7654321",
        registrationNumber: "GA-MFG-445",
        businessLicense: "BL-2023-892",
        certifications: ["USDA Organic", "Free Range Certified", "Animal Welfare Approved"]
      },
      performance: {
        rating: 4.6,
        totalOrders: 89,
        onTimeDelivery: 91.2,
        averageResponseTime: 4.1,
        qualityScore: 4.8,
        lastOrderDate: "2024-01-18"
      },
      financials: {
        paymentTerms: "Net 15",
        creditLimit: 75000,
        currentBalance: 8900,
        currency: "USD"
      },
      categories: ["Fried Chicken and Wings"],
      isActive: true,
      isPrimary: false,
      notes: "Specializes in premium chicken products. Higher pricing but exceptional quality.",
      createdAt: "2023-08-22",
      updatedAt: "2024-01-18"
    },
    {
      id: "3",
      name: "Local Beverage Supply",
      businessType: "Wholesaler",
      email: "info@localbeverage.net",
      phone: "+1-555-0789",
      contactPerson: "Emily Rodriguez",
      contactTitle: "Regional Manager",
      contactEmail: "emily.r@localbeverage.net",
      contactPhone: "+1-555-0790",
      address: {
        street: "890 Industrial Blvd",
        city: "Phoenix",
        state: "AZ",
        zipCode: "85001",
        country: "USA"
      },
      businessInfo: {
        taxId: "45-1234567",
        registrationNumber: "AZ-WHL-789",
        certifications: ["FDA Registered"]
      },
      performance: {
        rating: 4.2,
        totalOrders: 203,
        onTimeDelivery: 87.8,
        averageResponseTime: 6.2,
        qualityScore: 4.1,
        lastOrderDate: "2024-01-19"
      },
      financials: {
        paymentTerms: "Net 45",
        creditLimit: 25000,
        currentBalance: 3200,
        currency: "USD"
      },
      categories: ["Beverages"],
      isActive: true,
      isPrimary: false,
      notes: "Good for bulk beverage orders. Competitive pricing but occasional delivery delays.",
      createdAt: "2023-05-10",
      updatedAt: "2024-01-19"
    },
    {
      id: "4",
      name: "Gourmet Ingredients Ltd",
      businessType: "Distributor",
      email: "orders@gourmetingredients.co.uk",
      phone: "+44-20-1234-5678",
      website: "https://gourmetingredients.co.uk",
      contactPerson: "James Wilson",
      contactTitle: "Sales Director",
      contactEmail: "j.wilson@gourmetingredients.co.uk",
      contactPhone: "+44-20-1234-5679",
      address: {
        street: "123 Culinary Street",
        city: "London",
        state: "Greater London",
        zipCode: "SW1A 1AA",
        country: "UK"
      },
      businessInfo: {
        taxId: "GB123456789",
        registrationNumber: "UK-DIST-456",
        certifications: ["EU Organic", "BRC Global Standard"]
      },
      performance: {
        rating: 4.9,
        totalOrders: 67,
        onTimeDelivery: 96.2,
        averageResponseTime: 1.8,
        qualityScore: 4.9,
        lastOrderDate: "2024-01-15"
      },
      financials: {
        paymentTerms: "Net 30",
        creditLimit: 100000,
        currentBalance: 15600,
        currency: "GBP"
      },
      categories: ["Mood Burgers"],
      isActive: false,
      isPrimary: false,
      notes: "Premium supplier for specialty ingredients. Currently inactive due to shipping costs.",
      createdAt: "2023-09-30",
      updatedAt: "2024-01-10"
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [filters, setFilters] = useState({
    searchTerm: "",
    businessType: "All",
    category: "All",
    status: "All",
    rating: "All",
    sortBy: "name"
  });

  // Filter suppliers based on search and filters
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = `${supplier.name} ${supplier.email} ${supplier.contactPerson}`
      .toLowerCase()
      .includes(filters.searchTerm.toLowerCase());
    
    const matchesBusinessType = filters.businessType === "All" || supplier.businessType === filters.businessType;
    const matchesCategory = filters.category === "All" || supplier.categories.includes(filters.category);
    const matchesStatus = filters.status === "All" || 
      (filters.status === "Active" && supplier.isActive) || 
      (filters.status === "Inactive" && !supplier.isActive) ||
      (filters.status === "Primary" && supplier.isPrimary);

    const matchesRating = filters.rating === "All" ||
      (filters.rating === "5" && supplier.performance.rating >= 4.5) ||
      (filters.rating === "4" && supplier.performance.rating >= 4.0 && supplier.performance.rating < 4.5) ||
      (filters.rating === "3" && supplier.performance.rating >= 3.0 && supplier.performance.rating < 4.0);

    return matchesSearch && matchesBusinessType && matchesCategory && matchesStatus && matchesRating;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "rating":
        return b.performance.rating - a.performance.rating;
      case "orders":
        return b.performance.totalOrders - a.performance.totalOrders;
      case "performance":
        return b.performance.onTimeDelivery - a.performance.onTimeDelivery;
      default:
        return 0;
    }
  });

  // Get unique categories and business types for filters
  const categories = Array.from(new Set(suppliers.flatMap(supplier => supplier.categories)));
  const businessTypes = Array.from(new Set(suppliers.map(supplier => supplier.businessType)));

  const handleCreateSupplier = () => {
    setEditingSupplier(null);
    setIsFormOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleDeleteSupplier = (supplier: Supplier) => {
    if (confirm(`Are you sure you want to delete ${supplier.name}?`)) {
      setSuppliers(prev => prev.filter(s => s.id !== supplier.id));
      console.log('Deleting supplier:', supplier.id);
    }
  };

  const handleToggleStatus = (supplier: Supplier) => {
    setSuppliers(prev => prev.map(s => 
      s.id === supplier.id 
        ? { ...s, isActive: !s.isActive, updatedAt: new Date().toISOString() }
        : s
    ));
  };

  const handleSetPrimary = (supplier: Supplier) => {
    setSuppliers(prev => prev.map(s => 
      s.id === supplier.id 
        ? { ...s, isPrimary: true, updatedAt: new Date().toISOString() }
        : { ...s, isPrimary: false }
    ));
  };

  const handleSaveSupplier = (supplierData: Partial<Supplier>) => {
    if (editingSupplier) {
      // Update existing supplier
      setSuppliers(prev => prev.map(s => 
        s.id === editingSupplier.id 
          ? { ...s, ...supplierData, updatedAt: new Date().toISOString() }
          : s
      ));
    } else {
      // Create new supplier
      const newSupplier: Supplier = {
        id: Date.now().toString(),
        ...supplierData,
        performance: {
          rating: 0,
          totalOrders: 0,
          onTimeDelivery: 0,
          averageResponseTime: 0,
          qualityScore: 0,
          lastOrderDate: ""
        },
        financials: {
          paymentTerms: "Net 30",
          creditLimit: 0,
          currentBalance: 0,
          currency: "USD",
          ...supplierData.financials
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Supplier;
      
      setSuppliers(prev => [...prev, newSupplier]);
    }
    setIsFormOpen(false);
    setEditingSupplier(null);
  };

  const handleSelectSupplier = (supplierId: string) => {
    setSelectedSuppliers(prev => 
      prev.includes(supplierId) 
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSuppliers.length === filteredSuppliers.length) {
      setSelectedSuppliers([]);
    } else {
      setSelectedSuppliers(filteredSuppliers.map(supplier => supplier.id));
    }
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete') => {
    if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${selectedSuppliers.length} suppliers?`)) {
        setSuppliers(prev => prev.filter(s => !selectedSuppliers.includes(s.id)));
        setSelectedSuppliers([]);
      }
    } else {
      const isActive = action === 'activate';
      setSuppliers(prev => prev.map(s => 
        selectedSuppliers.includes(s.id) 
          ? { ...s, isActive, updatedAt: new Date().toISOString() }
          : s
      ));
      setSelectedSuppliers([]);
    }
  };

  if (loading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Supplier Management" />
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
      <PageBreadcrumb pageTitle="Supplier Management" />
      
      <div className="space-y-6">
        <SupplierStats suppliers={suppliers} />

        <SupplierFilters
          searchTerm={filters.searchTerm}
          setSearchTerm={(value) => setFilters(prev => ({ ...prev, searchTerm: value }))}
          businessType={filters.businessType}
          setBusinessType={(value) => setFilters(prev => ({ ...prev, businessType: value }))}
          category={filters.category}
          setCategory={(value) => setFilters(prev => ({ ...prev, category: value }))}
          status={filters.status}
          setStatus={(value) => setFilters(prev => ({ ...prev, status: value }))}
          rating={filters.rating}
          setRating={(value) => setFilters(prev => ({ ...prev, rating: value }))}
          sortBy={filters.sortBy}
          setSortBy={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
          businessTypes={businessTypes}
          categories={categories}
          selectedCount={selectedSuppliers.length}
          onBulkAction={handleBulkAction}
          onCreateSupplier={handleCreateSupplier}
        />

        <SupplierList 
          suppliers={filteredSuppliers}
          selectedSuppliers={selectedSuppliers}
          onSelectSupplier={handleSelectSupplier}
          onSelectAll={handleSelectAll}
          onEditSupplier={handleEditSupplier}
          onDeleteSupplier={handleDeleteSupplier}
          onToggleStatus={handleToggleStatus}
          onSetPrimary={handleSetPrimary}
        />
      </div>

      {/* Supplier Form Modal */}
      {isFormOpen && (
        <SupplierForm
          supplier={editingSupplier}
          onSave={handleSaveSupplier}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingSupplier(null);
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