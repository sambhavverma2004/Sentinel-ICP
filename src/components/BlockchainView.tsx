import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, Link as LinkIcon } from 'lucide-react';
import { ProductEvent, Product } from '../types';
import { verifyChainIntegrity } from '../utils/hash';

interface BlockchainViewProps {
  products: Product[];
  selectedProductId: string;
  onSelectProduct: (productId: string) => void;
}

export function BlockchainView({ products, selectedProductId, onSelectProduct }: BlockchainViewProps) {
  const selectedProduct = products.find(p => p.id === selectedProductId);
  
  if (!selectedProduct) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Blockchain View</h2>
        <div className="space-y-3">
          {products.map(product => (
            <motion.button
              key={product.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectProduct(product.id)}
              className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors border"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.batchId}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {verifyChainIntegrity(product.events) ? (
                    <Shield className="w-5 h-5 text-green-600" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm text-gray-500">{product.events.length} blocks</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  const isIntegrityValid = verifyChainIntegrity(selectedProduct.events);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Blockchain: {selectedProduct.name}</h2>
        <div className="flex items-center space-x-2">
          {isIntegrityValid ? (
            <>
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-600">Chain Verified</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-600">Integrity Compromised</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {selectedProduct.events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-4 rounded-lg border-2 ${
              event.isTampered 
                ? 'border-red-300 bg-red-50' 
                : 'border-blue-300 bg-blue-50'
            }`}
          >
            {index > 0 && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <LinkIcon className="w-4 h-4 text-gray-400" />
              </div>
            )}
            
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-800">{event.stage}</h3>
                <p className="text-sm text-gray-600">{event.location}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {event.timestamp.toLocaleDateString()} {event.timestamp.toLocaleTimeString()}
                </p>
                {event.isTampered && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    TAMPERED
                  </span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-2">
              <div>
                <span className="font-medium">Hash:</span>
                <p className="font-mono break-all">{event.hash.substring(0, 16)}...</p>
              </div>
              <div>
                <span className="font-medium">Previous:</span>
                <p className="font-mono break-all">
                  {event.previousHash === '0' ? 'Genesis' : `${event.previousHash.substring(0, 16)}...`}
                </p>
              </div>
            </div>
            
            <div className="text-xs text-gray-600">
              <span className="font-medium">Data:</span>
              <div className="mt-1 space-y-1">
                {Object.entries(event.data).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span>{key}:</span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectProduct('')}
        className="mt-6 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Back to Products
      </motion.button>
    </div>
  );
}