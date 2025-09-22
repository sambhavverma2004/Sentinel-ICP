import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Download } from 'lucide-react';
import { Product, UserRole } from '../types';

interface QRCodeGeneratorProps {
  products: Product[];
  userRole: UserRole;
}

export function QRCodeGenerator({ products, userRole }: QRCodeGeneratorProps) {
  const [selectedProduct, setSelectedProduct] = useState('');

  const selectedProductData = products.find(p => p.id === selectedProduct);

  const generateQRData = () => {
    if (!selectedProductData) return '';
    
    return JSON.stringify({
      productId: selectedProductData.id,
      batchId: selectedProductData.batchId,
      name: selectedProductData.name,
      manufacturer: selectedProductData.manufacturer,
      currentStage: selectedProductData.currentStage,
      verified: true
    });
  };

  const canGenerateQR = userRole === UserRole.MANUFACTURER || userRole === UserRole.ADMIN;

  if (!canGenerateQR) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">QR Code Generator</h2>
        <p className="text-gray-600">Access restricted to Manufacturers and Admins.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-4">
        <QrCode className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold">QR Code Generator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Product
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Choose a product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.batchId})
              </option>
            ))}
          </select>
        </div>

        {selectedProductData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center space-y-4 p-4 bg-gray-50 rounded-lg"
          >
            <QRCodeSVG
              value={generateQRData()}
              size={200}
              level="H"
              includeMargin={true}
            />
            
            <div className="text-center">
              <h3 className="font-medium text-gray-900">{selectedProductData.name}</h3>
              <p className="text-sm text-gray-600">Batch: {selectedProductData.batchId}</p>
              <p className="text-xs text-gray-500 mt-1">
                Current Stage: {selectedProductData.currentStage}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              onClick={() => {
                // In a real app, this would trigger a download
                alert('QR Code download functionality would be implemented here');
              }}
            >
              <Download className="w-4 h-4" />
              <span>Download QR Code</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
