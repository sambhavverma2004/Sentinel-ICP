import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scan, CheckCircle, XCircle, Info } from 'lucide-react';
import { Product, UserRole } from '../types';

interface QRCodeScannerProps {
  products: Product[];
  userRole: UserRole;
}

export function QRCodeScanner({ products, userRole }: QRCodeScannerProps) {
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  const simulateScan = () => {
    setIsScanning(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      try {
        const scannedData = JSON.parse(scanInput);
        const product = products.find(p => p.id === scannedData.productId);
        
        if (product) {
          setScanResult({
            success: true,
            product,
            scannedData,
            verified: scannedData.verified && product.batchId === scannedData.batchId
          });
        } else {
          setScanResult({
            success: false,
            error: 'Product not found in system'
          });
        }
      } catch (error) {
        // Try to scan as plain product ID
        const product = products.find(p => p.id === scanInput.trim());
        if (product) {
          setScanResult({
            success: true,
            product,
            scannedData: { productId: scanInput.trim() },
            verified: true
          });
        } else {
          setScanResult({
            success: false,
            error: 'Invalid QR code or product ID'
          });
        }
      }
      
      setIsScanning(false);
    }, 1500);
  };

  const canScan = userRole === UserRole.RETAILER || userRole === UserRole.ADMIN;

  if (!canScan) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Product Verification</h2>
        <p className="text-gray-600">Access restricted to Retailers and Admins.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-4">
        <Scan className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Product Verification</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scan QR Code or Enter Product ID
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              placeholder="Enter QR data or Product ID (e.g., PROD-0001)"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={simulateScan}
              disabled={!scanInput.trim() || isScanning}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isScanning ? 'Scanning...' : 'Verify'}
            </motion.button>
          </div>
        </div>

        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center p-8 bg-blue-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-blue-600">Scanning and verifying...</span>
            </div>
          </motion.div>
        )}

        {scanResult && !isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border-2 ${
              scanResult.success 
                ? scanResult.verified 
                  ? 'border-green-300 bg-green-50'
                  : 'border-yellow-300 bg-yellow-50'
                : 'border-red-300 bg-red-50'
            }`}
          >
            <div className="flex items-start space-x-3">
              {scanResult.success ? (
                scanResult.verified ? (
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                ) : (
                  <Info className="w-6 h-6 text-yellow-600 mt-1" />
                )
              ) : (
                <XCircle className="w-6 h-6 text-red-600 mt-1" />
              )}
              
              <div className="flex-1">
                {scanResult.success ? (
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {scanResult.verified ? 'Product Verified' : 'Product Found (Partial Verification)'}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Product:</span>
                          <p>{scanResult.product.name}</p>
                        </div>
                        <div>
                          <span className="font-medium">Batch ID:</span>
                          <p>{scanResult.product.batchId}</p>
                        </div>
                        <div>
                          <span className="font-medium">Manufacturer:</span>
                          <p>{scanResult.product.manufacturer}</p>
                        </div>
                        <div>
                          <span className="font-medium">Current Stage:</span>
                          <p>{scanResult.product.currentStage}</p>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <span className="font-medium text-sm">Product Journey:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {scanResult.product.events.map((event: any, index: number) => (
                            <span
                              key={event.id}
                              className={`text-xs px-2 py-1 rounded-full ${
                                event.isTampered 
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {index + 1}. {event.stage}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-medium text-red-900">Verification Failed</h3>
                    <p className="text-sm text-red-700 mt-1">{scanResult.error}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Available Products for Testing:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          {products.slice(0, 4).map(product => (
            <div key={product.id} className="flex justify-between">
              <span>{product.name}:</span>
              <span className="font-mono">{product.id}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}