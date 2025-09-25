import { useState, useEffect } from "react";
import { PageBreadcrumb } from "../../Components";
import { BarcodeStats, BarcodeFilters, BarcodeGrid } from "../../Components/Barcodes";

interface ItemBarcode {
  id: string;
  itemName: string;
  sku: string;
  category: string;
  barcode: string;
  qrCode: string;
  barcodeType: 'UPC' | 'EAN' | 'CODE128' | 'CODE39';
  qrCodeData: string;
  hasBarcode: boolean;
  hasQRCode: boolean;
  lastScanned: string | null;
  scanCount: number;
  createdAt: string;
  updatedAt: string;
  price: number;
  stock: number;
  image?: string;
  printCount: number;
}

export const BarcodeManagementPage = () => {
  // Mock barcode data
  const [items, setItems] = useState<ItemBarcode[]>([
    {
      id: "1",
      itemName: "The Cheerful Chomper",
      sku: "TCC-001",
      category: "Mood Burgers",
      barcode: "123456789012",
      qrCode: "QR_TCC_001_CHEERFUL_CHOMPER",
      barcodeType: 'UPC',
      qrCodeData: JSON.stringify({
        sku: "TCC-001",
        name: "The Cheerful Chomper",
        price: 12.99,
        category: "Mood Burgers"
      }),
      hasBarcode: true,
      hasQRCode: true,
      lastScanned: "2024-01-20",
      scanCount: 45,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
      price: 12.99,
      stock: 25,
      printCount: 3
    },
    {
      id: "2",
      itemName: "Fiery Buffalo Fries",
      sku: "FBF-001",
      category: "House Fries",
      barcode: "234567890123",
      qrCode: "QR_FBF_001_FIERY_BUFFALO",
      barcodeType: 'EAN',
      qrCodeData: JSON.stringify({
        sku: "FBF-001",
        name: "Fiery Buffalo Fries",
        price: 6.99,
        category: "House Fries"
      }),
      hasBarcode: true,
      hasQRCode: true,
      lastScanned: "2024-01-19",
      scanCount: 32,
      createdAt: "2024-01-12",
      updatedAt: "2024-01-19",
      price: 6.99,
      stock: 18,
      printCount: 5
    },
    {
      id: "3",
      itemName: "Classic Comfort Burger",
      sku: "CCB-002",
      category: "Mood Burgers",
      barcode: "345678901234",
      qrCode: "",
      barcodeType: 'CODE128',
      qrCodeData: "",
      hasBarcode: true,
      hasQRCode: false,
      lastScanned: null,
      scanCount: 0,
      createdAt: "2024-01-10",
      updatedAt: "2024-01-18",
      price: 11.99,
      stock: 15,
      printCount: 1
    },
    {
      id: "4",
      itemName: "Honey Harmony Fries",
      sku: "HHF-001",
      category: "House Fries",
      barcode: "",
      qrCode: "QR_HHF_001_HONEY_HARMONY",
      barcodeType: 'UPC',
      qrCodeData: JSON.stringify({
        sku: "HHF-001",
        name: "Honey Harmony Fries",
        price: 6.99,
        category: "House Fries"
      }),
      hasBarcode: false,
      hasQRCode: true,
      lastScanned: "2024-01-21",
      scanCount: 12,
      createdAt: "2024-01-14",
      updatedAt: "2024-01-21",
      price: 6.99,
      stock: 30,
      printCount: 2
    },
    {
      id: "5",
      itemName: "Joyful Jive Chicken",
      sku: "JJC-003",
      category: "Fried Chicken and Wings",
      barcode: "",
      qrCode: "",
      barcodeType: 'CODE39',
      qrCodeData: "",
      hasBarcode: false,
      hasQRCode: false,
      lastScanned: null,
      scanCount: 0,
      createdAt: "2024-01-08",
      updatedAt: "2024-01-16",
      price: 8.99,
      stock: 22,
      printCount: 0
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    searchTerm: "",
    codeType: "All",
    category: "All",
    status: "All",
    sortBy: "name"
  });

  // Filter items based on search and filters
  const filteredItems = items.filter(item => {
    const matchesSearch = `${item.itemName} ${item.sku} ${item.barcode} ${item.qrCode}`
      .toLowerCase()
      .includes(filters.searchTerm.toLowerCase());
    
    const matchesCodeType = filters.codeType === "All" || 
      (filters.codeType === "Barcode" && item.hasBarcode) ||
      (filters.codeType === "QR Code" && item.hasQRCode) ||
      (filters.codeType === "Both" && item.hasBarcode && item.hasQRCode) ||
      (filters.codeType === "None" && !item.hasBarcode && !item.hasQRCode);

    const matchesCategory = filters.category === "All" || item.category === filters.category;
    
    const matchesStatus = filters.status === "All" ||
      (filters.status === "Active" && (item.hasBarcode || item.hasQRCode)) ||
      (filters.status === "Missing" && !item.hasBarcode && !item.hasQRCode);

    return matchesSearch && matchesCodeType && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case "name":
        return a.itemName.localeCompare(b.itemName);
      case "scans":
        return b.scanCount - a.scanCount;
      case "created":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "prints":
        return b.printCount - a.printCount;
      default:
        return 0;
    }
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(items.map(item => item.category)));

  const handleGenerateBarcode = (item: ItemBarcode) => {
    const newBarcode = Math.random().toString().substr(2, 12);
    setItems(prev => prev.map(i => 
      i.id === item.id 
        ? { ...i, barcode: newBarcode, hasBarcode: true, updatedAt: new Date().toISOString() }
        : i
    ));
    console.log('Generating barcode for:', item.id);
  };

  const handleGenerateQRCode = (item: ItemBarcode) => {
    const qrCodeData = JSON.stringify({
      sku: item.sku,
      name: item.itemName,
      price: item.price,
      category: item.category
    });
    const newQRCode = `QR_${item.sku}_${item.itemName.replace(/\s+/g, '_').toUpperCase()}`;
    
    setItems(prev => prev.map(i => 
      i.id === item.id 
        ? { 
            ...i, 
            qrCode: newQRCode, 
            qrCodeData,
            hasQRCode: true, 
            updatedAt: new Date().toISOString() 
          }
        : i
    ));
    console.log('Generating QR code for:', item.id);
  };

  const handlePrintCodes = (item: ItemBarcode) => {
    setItems(prev => prev.map(i => 
      i.id === item.id 
        ? { ...i, printCount: i.printCount + 1 }
        : i
    ));
    console.log('Printing codes for:', item.id);
  };

  const handleBulkGenerate = (type: 'barcode' | 'qr') => {
    console.log(`Bulk generating ${type} for:`, selectedItems);
    if (type === 'barcode') {
      setItems(prev => prev.map(i => 
        selectedItems.includes(i.id) && !i.hasBarcode
          ? { 
              ...i, 
              barcode: Math.random().toString().substr(2, 12), 
              hasBarcode: true,
              updatedAt: new Date().toISOString()
            }
          : i
      ));
    } else {
      setItems(prev => prev.map(i => 
        selectedItems.includes(i.id) && !i.hasQRCode
          ? { 
              ...i, 
              qrCode: `QR_${i.sku}_${i.itemName.replace(/\s+/g, '_').toUpperCase()}`,
              qrCodeData: JSON.stringify({
                sku: i.sku,
                name: i.itemName,
                price: i.price,
                category: i.category
              }),
              hasQRCode: true,
              updatedAt: new Date().toISOString()
            }
          : i
      ));
    }
    setSelectedItems([]);
  };

  const handleBulkPrint = () => {
    setItems(prev => prev.map(i => 
      selectedItems.includes(i.id)
        ? { ...i, printCount: i.printCount + 1 }
        : i
    ));
    setSelectedItems([]);
    console.log('Bulk printing codes for:', selectedItems);
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  if (loading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Barcode Management" />
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
      <PageBreadcrumb pageTitle="Barcode Management" />
      
      <div className="space-y-6">
        <BarcodeStats items={items} />

        <BarcodeFilters
          searchTerm={filters.searchTerm}
          setSearchTerm={(value) => setFilters(prev => ({ ...prev, searchTerm: value }))}
          codeType={filters.codeType}
          setCodeType={(value) => setFilters(prev => ({ ...prev, codeType: value }))}
          category={filters.category}
          setCategory={(value) => setFilters(prev => ({ ...prev, category: value }))}
          status={filters.status}
          setStatus={(value) => setFilters(prev => ({ ...prev, status: value }))}
          sortBy={filters.sortBy}
          setSortBy={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
          categories={categories}
          selectedCount={selectedItems.length}
          onBulkGenerateBarcode={() => handleBulkGenerate('barcode')}
          onBulkGenerateQR={() => handleBulkGenerate('qr')}
          onBulkPrint={handleBulkPrint}
        />

        <BarcodeGrid 
          items={filteredItems}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
          onSelectAll={handleSelectAll}
          onGenerateBarcode={handleGenerateBarcode}
          onGenerateQRCode={handleGenerateQRCode}
          onPrintCodes={handlePrintCodes}
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