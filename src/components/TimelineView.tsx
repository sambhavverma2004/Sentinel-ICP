import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { Product, ProductStage } from '../types';
import { format, differenceInDays } from 'date-fns';

interface TimelineViewProps {
  products: Product[];
}

export function TimelineView({ products }: TimelineViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<ProductStage | 'ALL'>('ALL');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = stageFilter === 'ALL' || product.currentStage === stageFilter;
    
    return matchesSearch && matchesStage;
  });

  const getStageColor = (stage: ProductStage) => {
    const colors = {
      [ProductStage.MANUFACTURING]: 'bg-blue-100 text-blue-800',
      [ProductStage.QUALITY_CHECK]: 'bg-yellow-100 text-yellow-800',
      [ProductStage.SHIPMENT]: 'bg-purple-100 text-purple-800',
      [ProductStage.WAREHOUSE]: 'bg-orange-100 text-orange-800',
      [ProductStage.DELIVERY]: 'bg-green-100 text-green-800'
    };
    return colors[stage];
  };

  const getDelayWarning = (product: Product) => {
    const daysSinceCreation = differenceInDays(new Date(), product.createdAt);
    return daysSinceCreation > 5;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name, batch ID, or product ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value as ProductStage | 'ALL')}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="ALL">All Stages</option>
              {Object.values(ProductStage).map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Batch ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Current Stage</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Created</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Last Update</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.id}</div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm">{product.batchId}</span>
                  </td>
                  
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(product.currentStage)}`}>
                      {product.currentStage}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {format(product.createdAt, 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {format(product.events[product.events.length - 1].timestamp, 'MMM dd, HH:mm')}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      {getDelayWarning(product) && (
                        <div className="flex items-center space-x-1 text-orange-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-xs">Delay Risk</span>
                        </div>
                      )}
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products found matching your criteria.
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Product Journey Timeline</h3>
        <div className="space-y-6">
          {filteredProducts.slice(0, 3).map(product => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">{product.name} ({product.batchId})</h4>
                <span className="text-sm text-gray-500">{product.events.length} events</span>
              </div>
              
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                {product.events.map((event, eventIndex) => (
                  <div key={event.id} className="flex items-center space-x-2 flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${
                      event.isTampered ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <div className="text-xs text-center min-w-max">
                      <div className="font-medium">{event.stage}</div>
                      <div className="text-gray-500">{format(event.timestamp, 'MMM dd')}</div>
                    </div>
                    {eventIndex < product.events.length - 1 && (
                      <div className="w-8 h-px bg-gray-300" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}