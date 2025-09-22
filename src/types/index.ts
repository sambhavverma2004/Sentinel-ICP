export interface Product {
  id: string;
  batchId: string;
  name: string;
  manufacturer: string;
  createdAt: Date;
  currentStage: ProductStage;
  events: ProductEvent[];
}

export interface ProductEvent {
  id: string;
  productId: string;
  stage: ProductStage;
  timestamp: Date;
  location: string;
  actor: string;
  hash: string;
  previousHash: string;
  data: Record<string, any>;
  isTampered?: boolean;
}

export enum ProductStage {
  MANUFACTURING = 'Manufacturing',
  QUALITY_CHECK = 'Quality Check',
  SHIPMENT = 'Shipment',
  WAREHOUSE = 'Warehouse',
  DELIVERY = 'Delivery'
}

export enum UserRole {
  MANUFACTURER = 'Manufacturer',
  TRANSPORTER = 'Transporter',
  RETAILER = 'Retailer',
  ADMIN = 'Admin'
}

export interface AnalyticsData {
  stageDistribution: { stage: string; count: number; }[];
  supplierPerformance: { supplier: string; onTime: number; delayed: number; }[];
  integrityTrends: { date: string; normal: number; tampered: number; }[];
  deliveryTimes: { batch: string; days: number; }[];
}