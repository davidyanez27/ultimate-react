import { useState, useEffect } from "react";
import { PageBreadcrumb } from "../../Components";
import { CategoryStats, CategoryFilters, CategoryList } from "../../Components/Categories";

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  itemCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const ItemCategorizationPage = () => {
  // Mock data - replace with actual data fetching
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Mood Burgers",
      description: "Specialty burgers that match your mood",
      color: "#FF6B6B",
      icon: "🍔",
      itemCount: 12,
      isActive: true,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20"
    },
    {
      id: "2",
      name: "Fried Chicken and Wings",
      description: "Crispy chicken items and wing varieties",
      color: "#4ECDC4",
      icon: "🍗",
      itemCount: 8,
      isActive: true,
      createdAt: "2024-01-10",
      updatedAt: "2024-01-18"
    },
    {
      id: "3",
      name: "House Fries",
      description: "Signature fries with various flavors",
      color: "#45B7D1",
      icon: "🍟",
      itemCount: 6,
      isActive: true,
      createdAt: "2024-01-12",
      updatedAt: "2024-01-19"
    },
    {
      id: "4",
      name: "Beverages",
      description: "Drinks and refreshments",
      color: "#96CEB4",
      icon: "🥤",
      itemCount: 15,
      isActive: true,
      createdAt: "2024-01-08",
      updatedAt: "2024-01-17"
    },
    {
      id: "5",
      name: "Desserts",
      description: "Sweet treats and desserts",
      color: "#FECA57",
      icon: "🍰",
      itemCount: 0,
      isActive: false,
      createdAt: "2024-01-05",
      updatedAt: "2024-01-16"
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    searchTerm: "",
    status: "All",
    sortBy: "name"
  });

  // Filter categories based on search and filters
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(filters.searchTerm.toLowerCase()) ||
      category.description
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === "All" || 
      (filters.status === "Active" && category.isActive) || 
      (filters.status === "Inactive" && !category.isActive);

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "items":
        return b.itemCount - a.itemCount;
      case "created":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const handleEditCategory = (category: Category) => {
    console.log('Editing category:', category.id);
    // TODO: Open edit modal or navigate to edit page
  };

  const handleDeleteCategory = (category: Category) => {
    console.log('Deleting category:', category.id);
    // TODO: Show confirmation dialog and delete category
    setCategories(prev => prev.filter(c => c.id !== category.id));
  };

  const handleToggleStatus = (category: Category) => {
    setCategories(prev => prev.map(c => 
      c.id === category.id 
        ? { ...c, isActive: !c.isActive }
        : c
    ));
  };

  const handleCreateCategory = () => {
    console.log('Creating new category');
    // TODO: Open create modal or navigate to create page
  };

  if (loading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Item Categorization" />
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
      <PageBreadcrumb pageTitle="Item Categorization" />
      
      <div className="space-y-6">
        <CategoryStats categories={categories} />

        <CategoryFilters
          searchTerm={filters.searchTerm}
          setSearchTerm={(value) => setFilters(prev => ({ ...prev, searchTerm: value }))}
          filterStatus={filters.status}
          setFilterStatus={(value) => setFilters(prev => ({ ...prev, status: value }))}
          sortBy={filters.sortBy}
          setSortBy={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
        />

        <CategoryList 
          categories={filteredCategories}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onToggleStatus={handleToggleStatus}
          onCreateCategory={handleCreateCategory}
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