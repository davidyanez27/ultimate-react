import { useState, useEffect } from "react";
import { PageBreadcrumb } from "../../Components";
import { ItemStats, ItemsList } from "../../Components/Items";

export const ItemsPage = () => {
  // Mock data - replace with actual data fetching
  const [items, setItems] = useState([
    {
      id: "1",
      name: "The Cheerful Chomper",
      sku: "TCC-001",
      category: "Mood Burgers",
      brand: "PlateLink",
      price: 12.99,
      stock: 45,
      minStock: 10,
      status: "active",
      location: "Kitchen A",
      supplier: "Local Supplier",
      description: "Delicious mood burger",
      image: "/images/products/burger.jpg",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20"
    },
    {
      id: "2", 
      name: "The Classic Comfort",
      sku: "TCC-002",
      category: "Mood Burgers",
      brand: "PlateLink",
      price: 11.99,
      stock: 0,
      minStock: 5,
      status: "out-of-stock",
      location: "Kitchen A",
      supplier: "Local Supplier",
      description: "Classic comfort burger",
      image: "/images/products/burger2.jpg",
      createdAt: "2024-01-10",
      updatedAt: "2024-01-18"
    },
    {
      id: "3",
      name: "The Fiery Fix",
      sku: "TFF-001",
      category: "Mood Burgers",
      brand: "PlateLink",
      price: 13.99,
      stock: 25,
      minStock: 15,
      status: "active",
      location: "Kitchen A",
      supplier: "Local Supplier",
      description: "Spicy mood burger",
      image: "/images/products/burger3.jpg",
      createdAt: "2024-01-05",
      updatedAt: "2024-01-19"
    },
    {
      id: "4",
      name: "Joyful Jive Chicken (3 Chicken Pieces)",
      sku: "JJC-003",
      category: "Fried Chicken and Wings",
      brand: "PlateLink",
      price: 8.99,
      stock: 0,
      minStock: 10,
      status: "out-of-stock",
      location: "Kitchen B",
      supplier: "Local Supplier",
      description: "3 pieces of fried chicken",
      image: "/images/products/chicken.jpg",
      createdAt: "2024-01-08",
      updatedAt: "2024-01-22"
    },
    {
      id: "5",
      name: "Fiery Buffalo Fries",
      sku: "FBF-001",
      category: "House Fries",
      brand: "PlateLink",
      price: 6.99,
      stock: 35,
      minStock: 20,
      status: "active",
      location: "Kitchen A",
      supplier: "Local Supplier",
      description: "Spicy buffalo fries",
      image: "/images/products/fries.jpg",
      createdAt: "2024-01-12",
      updatedAt: "2024-01-21"
    },
    {
      id: "6",
      name: "Honey Harmony Fries",
      sku: "HHF-001",
      category: "House Fries",
      brand: "PlateLink",
      price: 6.99,
      stock: 40,
      minStock: 20,
      status: "active",
      location: "Kitchen A",
      supplier: "Local Supplier",
      description: "Sweet honey fries",
      image: "/images/products/fries2.jpg",
      createdAt: "2024-01-14",
      updatedAt: "2024-01-23"
    },
    {
      id: "7",
      name: "Honey Harmony Fries",
      sku: "HHF-002",
      category: "House Fries",
      brand: "PlateLink",
      price: 6.99,
      stock: 30,
      minStock: 20,
      status: "active",
      location: "Kitchen A",
      supplier: "Local Supplier",
      description: "Sweet honey fries",
      image: "/images/products/fries3.jpg",
      createdAt: "2024-01-16",
      updatedAt: "2024-01-24"
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Mock categories - these would be managed in a separate page
  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'products', name: 'Products' },
    { id: 'items', name: 'Items' },
    { id: 'machines', name: 'Machines' },
    { id: 'tools', name: 'Tools' },
    { id: 'equipment', name: 'Equipment' }
  ];

  // Filter items based on active category
  const filteredItems = items.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category.toLowerCase() === activeCategory.toLowerCase() || 
           item.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  const handleToggleStatus = (item: any) => {
    setItems(prev => prev.map(i => 
      i.id === item.id 
        ? { 
            ...i, 
            status: i.status === 'active' && i.stock > 0 ? 'out-of-stock' : 'active' 
          }
        : i
    ));
  };

  const handleEditItem = (item: any) => {
    console.log('Editing item:', item.id);
    // TODO: Open edit modal or navigate to edit page
  };

  const handleViewItem = (item: any) => {
    console.log('Viewing item:', item.id);
    // TODO: Open view modal or navigate to item details
  };

  const handleDeleteItem = (item: any) => {
    console.log('Deleting item:', item.id);
    // TODO: Show confirmation dialog and delete item
    setItems(prev => prev.filter(i => i.id !== item.id));
  };

  if (loading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Items Management" />
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle="Stock Control" />
      
      <div className="space-y-6">
        <ItemStats items={items} />

        <ItemsList 
          items={filteredItems}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onEditItem={handleEditItem}
          onViewItem={handleViewItem}
          onDeleteItem={handleDeleteItem}
          onToggleStatus={handleToggleStatus}
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