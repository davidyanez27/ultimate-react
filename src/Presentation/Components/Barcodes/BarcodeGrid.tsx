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

interface BarcodeGridProps {
  items: ItemBarcode[];
  selectedItems: string[];
  onSelectItem: (itemId: string) => void;
  onSelectAll: () => void;
  onGenerateBarcode: (item: ItemBarcode) => void;
  onGenerateQRCode: (item: ItemBarcode) => void;
  onPrintCodes: (item: ItemBarcode) => void;
}

const BarcodeDisplay = ({ code, type }: { code: string; type: 'barcode' | 'qr' }) => {
  if (type === 'barcode') {
    return (
      <div className="bg-white p-3 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="text-center">
          <div className="h-12 bg-gradient-to-r from-black to-black bg-repeat-x" 
               style={{
                 backgroundImage: `repeating-linear-gradient(90deg, black 0px, black 2px, white 2px, white 4px)`,
                 backgroundSize: '4px 100%'
               }}>
          </div>
          <p className="text-xs font-mono mt-1 text-gray-600">{code}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-white p-3 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="text-center">
          <div className="h-12 w-12 mx-auto bg-black grid grid-cols-6 gap-px">
            {Array.from({ length: 36 }, (_, i) => (
              <div key={i} className={`${Math.random() > 0.5 ? 'bg-white' : 'bg-black'}`}></div>
            ))}
          </div>
          <p className="text-xs font-mono mt-1 text-gray-600 break-all">{code.length > 15 ? `${code.substring(0, 15)}...` : code}</p>
        </div>
      </div>
    );
  }
};

const ItemCard = ({ 
  item, 
  isSelected,
  onSelect,
  onGenerateBarcode,
  onGenerateQRCode,
  onPrint
}: { 
  item: ItemBarcode;
  isSelected: boolean;
  onSelect: () => void;
  onGenerateBarcode: () => void;
  onGenerateQRCode: () => void;
  onPrint: () => void;
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {item.itemName}
            </h3>
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span>{item.sku}</span>
              <span>•</span>
              <span>{item.category}</span>
              <span>•</span>
              <span>${item.price}</span>
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center space-x-2">
          {item.hasBarcode && (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400">
              📊 Barcode
            </span>
          )}
          {item.hasQRCode && (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400">
              📱 QR Code
            </span>
          )}
          {!item.hasBarcode && !item.hasQRCode && (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400">
              ❌ No Codes
            </span>
          )}
        </div>
      </div>

      {/* Code Display Section */}
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Barcode Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Barcode</h4>
              {!item.hasBarcode && (
                <button
                  onClick={onGenerateBarcode}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Generate
                </button>
              )}
            </div>
            {item.hasBarcode ? (
              <BarcodeDisplay code={item.barcode} type="barcode" />
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">No barcode generated</p>
              </div>
            )}
          </div>

          {/* QR Code Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">QR Code</h4>
              {!item.hasQRCode && (
                <button
                  onClick={onGenerateQRCode}
                  className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400"
                >
                  Generate
                </button>
              )}
            </div>
            {item.hasQRCode ? (
              <BarcodeDisplay code={item.qrCode} type="qr" />
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">No QR code generated</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats and Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            <span>{item.scanCount} scans</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>{item.printCount} prints</span>
          </div>
          
          {item.lastScanned && (
            <div className="flex items-center space-x-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Last: {new Date(item.lastScanned).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {(item.hasBarcode || item.hasQRCode) && (
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          )}
          
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
            Options
          </button>
        </div>
      </div>
    </div>
  );
};

export const BarcodeGrid = ({ 
  items, 
  selectedItems,
  onSelectItem,
  onSelectAll,
  onGenerateBarcode,
  onGenerateQRCode,
  onPrintCodes
}: BarcodeGridProps) => {
  const allSelected = items.length > 0 && items.every(item => selectedItems.includes(item.id));

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {items.length > 0 && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Select all items
                </label>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Item Codes ({items.length})
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage barcodes and QR codes for your inventory items
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">No items found</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                isSelected={selectedItems.includes(item.id)}
                onSelect={() => onSelectItem(item.id)}
                onGenerateBarcode={() => onGenerateBarcode(item)}
                onGenerateQRCode={() => onGenerateQRCode(item)}
                onPrint={() => onPrintCodes(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};