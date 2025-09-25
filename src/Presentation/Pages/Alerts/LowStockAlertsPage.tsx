import { useState, useEffect } from "react";
import { PageBreadcrumb } from "../../Components";
import { AlertStats, AlertFilters, AlertsList } from "../../Components/Alerts";

interface LowStockAlert {
  id: string;
  itemName: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low';
  daysUntilEmpty: number;
  supplier: string;
  location: string;
  price: number;
  lastRestocked: string;
  alertCreated: string;
  image?: string;
  isResolved: boolean;
}

export const LowStockAlertsPage = () => {
  // Mock low stock alerts data
  const [alerts, setAlerts] = useState<LowStockAlert[]>([
    {
      id: "1",
      itemName: "The Cheerful Chomper",
      sku: "TCC-001",
      category: "Mood Burgers",
      currentStock: 2,
      minStock: 10,
      maxStock: 50,
      urgencyLevel: 'critical',
      daysUntilEmpty: 1,
      supplier: "Local Supplier",
      location: "Kitchen A",
      price: 12.99,
      lastRestocked: "2024-01-15",
      alertCreated: "2024-01-20",
      isResolved: false
    },
    {
      id: "2",
      itemName: "Fiery Buffalo Fries",
      sku: "FBF-001",
      category: "House Fries",
      currentStock: 8,
      minStock: 20,
      maxStock: 100,
      urgencyLevel: 'high',
      daysUntilEmpty: 3,
      supplier: "Local Supplier",
      location: "Kitchen A",
      price: 6.99,
      lastRestocked: "2024-01-18",
      alertCreated: "2024-01-21",
      isResolved: false
    },
    {
      id: "3",
      itemName: "Classic Comfort Burger",
      sku: "CCB-002",
      category: "Mood Burgers",
      currentStock: 15,
      minStock: 25,
      maxStock: 75,
      urgencyLevel: 'medium',
      daysUntilEmpty: 5,
      supplier: "Local Supplier",
      location: "Kitchen A",
      price: 11.99,
      lastRestocked: "2024-01-19",
      alertCreated: "2024-01-22",
      isResolved: false
    },
    {
      id: "4",
      itemName: "Honey Harmony Fries",
      sku: "HHF-001",
      category: "House Fries",
      currentStock: 18,
      minStock: 20,
      maxStock: 80,
      urgencyLevel: 'low',
      daysUntilEmpty: 7,
      supplier: "Local Supplier",
      location: "Kitchen A",
      price: 6.99,
      lastRestocked: "2024-01-17",
      alertCreated: "2024-01-23",
      isResolved: false
    },
    {
      id: "5",
      itemName: "Joyful Jive Chicken",
      sku: "JJC-003",
      category: "Fried Chicken and Wings",
      currentStock: 12,
      minStock: 15,
      maxStock: 60,
      urgencyLevel: 'medium',
      daysUntilEmpty: 4,
      supplier: "Local Supplier",
      location: "Kitchen B",
      price: 8.99,
      lastRestocked: "2024-01-16",
      alertCreated: "2024-01-21",
      isResolved: true
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    searchTerm: "",
    urgencyLevel: "All",
    category: "All",
    status: "Unresolved",
    sortBy: "urgency"
  });

  // Filter alerts based on search and filters
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = `${alert.itemName} ${alert.sku} ${alert.category}`
      .toLowerCase()
      .includes(filters.searchTerm.toLowerCase());
    
    const matchesUrgency = filters.urgencyLevel === "All" || alert.urgencyLevel === filters.urgencyLevel;
    const matchesCategory = filters.category === "All" || alert.category === filters.category;
    const matchesStatus = filters.status === "All" || 
      (filters.status === "Resolved" && alert.isResolved) || 
      (filters.status === "Unresolved" && !alert.isResolved);

    return matchesSearch && matchesUrgency && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case "urgency":
        const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return urgencyOrder[b.urgencyLevel] - urgencyOrder[a.urgencyLevel];
      case "stock":
        return a.currentStock - b.currentStock;
      case "days":
        return a.daysUntilEmpty - b.daysUntilEmpty;
      case "name":
        return a.itemName.localeCompare(b.itemName);
      default:
        return 0;
    }
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(alerts.map(alert => alert.category)));

  const handleResolveAlert = (alert: LowStockAlert) => {
    setAlerts(prev => prev.map(a => 
      a.id === alert.id 
        ? { ...a, isResolved: true }
        : a
    ));
    console.log('Resolving alert:', alert.id);
  };

  const handleRestockItem = (alert: LowStockAlert) => {
    console.log('Restocking item:', alert.id);
    // TODO: Navigate to restock form or open restock modal
  };

  const handleBulkResolve = () => {
    setAlerts(prev => prev.map(a => 
      selectedAlerts.includes(a.id) 
        ? { ...a, isResolved: true }
        : a
    ));
    setSelectedAlerts([]);
    console.log('Bulk resolving alerts:', selectedAlerts);
  };

  const handleSelectAlert = (alertId: string) => {
    setSelectedAlerts(prev => 
      prev.includes(alertId) 
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const handleSelectAll = () => {
    const unresolvedAlerts = filteredAlerts.filter(alert => !alert.isResolved);
    if (selectedAlerts.length === unresolvedAlerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(unresolvedAlerts.map(alert => alert.id));
    }
  };

  if (loading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Low Stock Alerts" />
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
      <PageBreadcrumb pageTitle="Low Stock Alerts" />
      
      <div className="space-y-6">
        <AlertStats alerts={alerts} />

        <AlertFilters
          searchTerm={filters.searchTerm}
          setSearchTerm={(value) => setFilters(prev => ({ ...prev, searchTerm: value }))}
          urgencyLevel={filters.urgencyLevel}
          setUrgencyLevel={(value) => setFilters(prev => ({ ...prev, urgencyLevel: value }))}
          category={filters.category}
          setCategory={(value) => setFilters(prev => ({ ...prev, category: value }))}
          status={filters.status}
          setStatus={(value) => setFilters(prev => ({ ...prev, status: value }))}
          sortBy={filters.sortBy}
          setSortBy={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
          categories={categories}
          selectedCount={selectedAlerts.length}
          onBulkResolve={handleBulkResolve}
        />

        <AlertsList 
          alerts={filteredAlerts}
          selectedAlerts={selectedAlerts}
          onSelectAlert={handleSelectAlert}
          onSelectAll={handleSelectAll}
          onResolveAlert={handleResolveAlert}
          onRestockItem={handleRestockItem}
        />
      </div>
      
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