import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus } from 'lucide-react';
import { Product, ProductStage, UserRole } from '../types';

interface ProductFormProps {
  userRole: UserRole;
  onCreateProduct: (product: Omit<Product, 'id' | 'events' | 'createdAt'>) => void;
  onUpdateStage: (productId: string, newStage: ProductStage, location: string) => void;
  products: Product[];
}

export function ProductForm({ userRole, onCreateProduct, onUpdateStage, products }: ProductFormProps) {
  const [productName, setProductName] = useState('');
  const [batchId, setBatchId] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [location, setLocation] = useState('');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (productName && batchId && manufacturer) {
      onCreateProduct({
        batchId,
        name: productName,
        manufacturer,
        currentStage: ProductStage.MANUFACTURING
      });
      setProductName('');
      setBatchId('');
      setManufacturer('');
    }
  };

  const handleUpdateStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct && location) {
      const product = products.find(p => p.id === selectedProduct);
      if (product) {
        const stages = Object.values(ProductStage);
        const currentIndex = stages.indexOf(product.currentStage);
        if (currentIndex < stages.length - 1) {
          onUpdateStage(selectedProduct, stages[currentIndex + 1], location);
          setSelectedProduct('');
          setLocation('');
        }
      }
    }
  };

  const canCreateProducts = userRole === UserRole.MANUFACTURER;
  const canUpdateStage = userRole === UserRole.MANUFACTURER || userRole === UserRole.TRANSPORTER;

  return (
    <div className="space-y-6">
      {canCreateProducts && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Create New Product</h2>
          </div>
          
          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch ID
                </label>
                <input
                  type="text"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter batch ID"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manufacturer
                </label>
                <input
                  type="text"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter manufacturer"
                  required
                />
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Product</span>
            </motion.button>
          </form>
        </motion.div>
      )}

      {canUpdateStage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-lg font-semibold mb-4">Update Product Stage</h2>
          
          <form onSubmit={handleUpdateStage} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Product
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose a product</option>
                  {products.filter(p => p.currentStage !== ProductStage.DELIVERY).map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.batchId}) - {product.currentStage}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter location"
                  required
                />
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              disabled={!selectedProduct || !location}
            >
              Update Stage
            </motion.button>
          </form>
        </motion.div>
      )}
    </div>
  );
}