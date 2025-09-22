import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, BarChart3, Baseline as Timeline, Shield, QrCode, AlertTriangle, RefreshCw } from 'lucide-react';

import { Product, ProductEvent, ProductStage, UserRole, AnalyticsData } from './types';
import { generateMockProducts, generateMockAnalytics } from './utils/mockData';
import { generateBlockHash } from './utils/hash';

import { RoleSwitcher } from './components/RoleSwitcher';
import { ProductForm } from './components/ProductForm';
import { BlockchainView } from './components/BlockchainView';
import { TimelineView } from './components/TimelineView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { QRCodeGenerator } from './components/QRCodeGenerator';
import { QRCodeScanner } from './components/QRCodeScanner';

type TabType = 'products' | 'blockchain' | 'timeline' | 'analytics' | 'qr' | 'verify';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.MANUFACTURER);
  const [selectedProductId, setSelectedProductId] = useState('');

  // Initialize with mock data
  useEffect(() => {
    const mockProducts = generateMockProducts();
    setProducts(mockProducts);
    setAnalytics(generateMockAnalytics(mockProducts));
  }, []);

  const createProduct = (productData: Omit<Product, 'id' | 'events' | 'createdAt'>) => {
    const newProductId = `PROD-${String(products.length + 1).padStart(4, '0')}`;
    const now = new Date();
    
    // Create genesis event
    const genesisEvent: ProductEvent = {
      id: `${newProductId}-1`,
      productId: newProductId,
      stage: ProductStage.MANUFACTURING,
      timestamp: now,
      location: 'Manufacturing Plant',
      actor: productData.manufacturer,
      hash: generateBlockHash('0', now.toISOString(), {
        stage: ProductStage.MANUFACTURING,
        productId: newProductId,
        batchId: productData.batchId
      }),
      previousHash: '0',
      data: {
        stage: ProductStage.MANUFACTURING,
        productId: newProductId,
        batchId: productData.batchId,
        temperature: 20,
        quality: 95
      }
    };

    const newProduct: Product = {
      id: newProductId,
      ...productData,
      createdAt: now,
      events: [genesisEvent]
    };

    setProducts(prev => [...prev, newProduct]);
    
    // Update analytics
    if (analytics) {
      setAnalytics(generateMockAnalytics([...products, newProduct]));
    }
  };

  const updateProductStage = (productId: string, newStage: ProductStage, location: string) => {
    setProducts(prev => prev.map(product => {
      if (product.id !== productId) return product;

      const now = new Date();
      const lastEvent = product.events[product.events.length - 1];
      
      const newEvent: ProductEvent = {
        id: `${productId}-${product.events.length + 1}`,
        productId,
        stage: newStage,
        timestamp: now,
        location,
        actor: 'System',
        hash: generateBlockHash(lastEvent.hash, now.toISOString(), {
          stage: newStage,
          location,
          actor: 'System'
        }),
        previousHash: lastEvent.hash,
        data: {
          stage: newStage,
          location,
          actor: 'System',
          temperature: Math.round(Math.random() * 30 + 10),
          quality: Math.round(Math.random() * 100)
        }
      };

      return {
        ...product,
        currentStage: newStage,
        events: [...product.events, newEvent]
      };
    }));

    // Update analytics
    setTimeout(() => {
      const updatedProducts = products.map(p => p.id === productId ? { ...p, currentStage: newStage } : p);
      setAnalytics(generateMockAnalytics(updatedProducts));
    }, 100);
  };

  const simulateTampering = () => {
    if (products.length === 0) return;

    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomEventIndex = Math.floor(Math.random() * randomProduct.events.length);

    setProducts(prev => prev.map(product => {
      if (product.id !== randomProduct.id) return product;

      return {
        ...product,
        events: product.events.map((event, index) => {
          if (index === randomEventIndex) {
            return {
              ...event,
              isTampered: true,
              hash: 'TAMPERED_HASH_' + Math.random().toString(36).substring(7)
            };
          }
          return event;
        })
      };
    }));
  };

  const refreshData = () => {
    const newProducts = generateMockProducts();
    setProducts(newProducts);
    setAnalytics(generateMockAnalytics(newProducts));
  };

  const tabs = [
    { id: 'products' as TabType, label: 'Products', icon: Package },
    { id: 'blockchain' as TabType, label: 'Blockchain', icon: Shield },
    { id: 'timeline' as TabType, label: 'Timeline', icon: Timeline },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
    { id: 'qr' as TabType, label: 'QR Generator', icon: QrCode },
    { id: 'verify' as TabType, label: 'Verify Product', icon: QrCode }
  ];

  const tamperedCount = products.reduce((count, product) => 
    count + product.events.filter(event => event.isTampered).length, 0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                Supply Chain Blockchain
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={simulateTampering}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center space-x-2 text-sm transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Simulate Tampering</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={refreshData}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg flex items-center space-x-2 text-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Data</span>
              </motion.button>
              
              <RoleSwitcher currentRole={userRole} onRoleChange={setUserRole} />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ProductForm
                userRole={userRole}
                onCreateProduct={createProduct}
                onUpdateStage={updateProductStage}
                products={products}
              />
            </motion.div>
          )}

          {activeTab === 'blockchain' && (
            <motion.div
              key="blockchain"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <BlockchainView
                products={products}
                selectedProductId={selectedProductId}
                onSelectProduct={setSelectedProductId}
              />
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TimelineView products={products} />
            </motion.div>
          )}

          {activeTab === 'analytics' && analytics && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <AnalyticsDashboard
                analytics={analytics}
                totalProducts={products.length}
                tamperedProducts={tamperedCount}
              />
            </motion.div>
          )}

          {activeTab === 'qr' && (
            <motion.div
              key="qr"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <QRCodeGenerator products={products} userRole={userRole} />
            </motion.div>
          )}

          {activeTab === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <QRCodeScanner products={products} userRole={userRole} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Status Bar */}
      <div className="fixed bottom-4 right-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-lg p-4 border"
        >
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>System Online</span>
            </div>
            <div className="text-gray-500">|</div>
            <div>Products: {products.length}</div>
            <div className="text-gray-500">|</div>
            <div className={tamperedCount > 0 ? 'text-red-600' : 'text-green-600'}>
              Tampered: {tamperedCount}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;