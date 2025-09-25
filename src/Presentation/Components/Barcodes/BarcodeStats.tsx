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

interface BarcodeStatsProps {
  items: ItemBarcode[];
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  subtitle?: string;
  percentage?: number;
}

const StatCard = ({ title, value, icon, bgColor, iconColor, subtitle, percentage }: StatCardProps) => (
  <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <div className={`rounded-xl ${bgColor} p-3 flex items-center justify-center`}>
          <div className={`h-7 w-7 ${iconColor} flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
      
      {percentage !== undefined && (
        <div className="text-right">
          <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            percentage >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' :
            percentage >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400' :
            'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
          }`}>
            {percentage}%
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Coverage</p>
        </div>
      )}
    </div>
  </div>
);

export const BarcodeStats = ({ items }: BarcodeStatsProps) => {
  const totalItems = items.length;
  const itemsWithBarcode = items.filter(item => item.hasBarcode).length;
  const itemsWithQRCode = items.filter(item => item.hasQRCode).length;
  const itemsWithBoth = items.filter(item => item.hasBarcode && item.hasQRCode).length;
  const totalScans = items.reduce((sum, item) => sum + item.scanCount, 0);
  const totalPrints = items.reduce((sum, item) => sum + item.printCount, 0);

  const barcodePercentage = totalItems > 0 ? Math.round((itemsWithBarcode / totalItems) * 100) : 0;
  const qrCodePercentage = totalItems > 0 ? Math.round((itemsWithQRCode / totalItems) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Items with Barcodes"
        value={itemsWithBarcode}
        subtitle={`${barcodePercentage}% of total items`}
        percentage={barcodePercentage}
        bgColor="bg-blue-100 dark:bg-blue-500/20"
        iconColor="text-blue-600 dark:text-blue-400"
        icon={
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      />

      <StatCard
        title="Items with QR Codes"
        value={itemsWithQRCode}
        subtitle={`${qrCodePercentage}% of total items`}
        percentage={qrCodePercentage}
        bgColor="bg-purple-100 dark:bg-purple-500/20"
        iconColor="text-purple-600 dark:text-purple-400"
        icon={
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-6l3-3h9l3 3v6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
          </svg>
        }
      />

      <StatCard
        title="Total Scans"
        value={totalScans}
        subtitle="All-time scan count"
        bgColor="bg-green-100 dark:bg-green-500/20"
        iconColor="text-green-600 dark:text-green-400"
        icon={
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
      />

      <StatCard
        title="Labels Printed"
        value={totalPrints}
        subtitle="Total print jobs"
        bgColor="bg-orange-100 dark:bg-orange-500/20"
        iconColor="text-orange-600 dark:text-orange-400"
        icon={
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
        }
      />
    </div>
  );
};