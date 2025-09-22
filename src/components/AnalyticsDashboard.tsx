import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Shield, Clock, AlertCircle } from 'lucide-react';
import { AnalyticsData } from '../types';

interface AnalyticsDashboardProps {
  analytics: AnalyticsData;
  totalProducts: number;
  tamperedProducts: number;
}

export function AnalyticsDashboard({ analytics, totalProducts, tamperedProducts }: AnalyticsDashboardProps) {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const metrics = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Integrity Score',
      value: `${Math.round(((totalProducts - tamperedProducts) / totalProducts) * 100)}%`,
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Avg Delivery Time',
      value: `${Math.round(analytics.deliveryTimes.reduce((sum, item) => sum + item.days, 0) / analytics.deliveryTimes.length)} days`,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Tampered Products',
      value: tamperedProducts,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4">Stage Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.stageDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ stage, count }: { stage: string; count: number }) => (count > 0 ? `${stage}: ${count}` : null)}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {analytics.stageDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4">Supplier Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.supplierPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="supplier" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="onTime" stackId="a" fill="#10B981" />
              <Bar dataKey="delayed" stackId="a" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4">Integrity Trends (7 days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[...analytics.integrityTrends].reverse()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="normal" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="tampered" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4">Delivery Times</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.deliveryTimes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="batch" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="days" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}