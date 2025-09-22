import { Product, ProductEvent, ProductStage, AnalyticsData } from '../types';
import { generateBlockHash } from './hash';

export function generateMockProducts(): Product[] {
  const products: Product[] = [];
  const manufacturers = ['TechCorp', 'GlobalMfg', 'InnovateLab'];
  const locations = ['New York', 'Los Angeles', 'Chicago', 'Miami'];
  
  for (let i = 1; i <= 5; i++) {
    const productId = `PROD-${String(i).padStart(4, '0')}`;
    const batchId = `BATCH-${String(i).padStart(3, '0')}`;
    const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
    
    const events: ProductEvent[] = [];
    const stages = Object.values(ProductStage);
    let previousHash = '0';
    
    stages.forEach((stage, index) => {
      const eventId = `${productId}-${index + 1}`;
      const timestamp = new Date(Date.now() - (5 - index) * 24 * 60 * 60 * 1000);
      const location = locations[Math.floor(Math.random() * locations.length)];
      
      const eventData = {
        stage,
        location,
        actor: manufacturer,
        temperature: Math.round(Math.random() * 30 + 10),
        quality: Math.round(Math.random() * 100)
      };
      
      const hash = generateBlockHash(previousHash, timestamp.toISOString(), eventData);
      
      const event: ProductEvent = {
        id: eventId,
        productId,
        stage,
        timestamp,
        location,
        actor: manufacturer,
        hash,
        previousHash,
        data: eventData
      };
      
      events.push(event);
      previousHash = hash;
    });
    
    products.push({
      id: productId,
      batchId,
      name: `Product ${i}`,
      manufacturer,
      createdAt: events[0].timestamp,
      currentStage: stages[Math.min(i + 1, stages.length - 1)],
      events
    });
  }
  
  return products;
}

export function generateMockAnalytics(products: Product[]): AnalyticsData {
  const stageDistribution = Object.values(ProductStage).map(stage => ({
    stage,
    count: products.filter(p => p.currentStage === stage).length
  }));
  
  const suppliers = ['TechCorp', 'GlobalMfg', 'InnovateLab'];
  const supplierPerformance = suppliers.map(supplier => ({
    supplier,
    onTime: Math.floor(Math.random() * 50) + 30,
    delayed: Math.floor(Math.random() * 20) + 5
  }));
  
  const integrityTrends = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
    normal: Math.floor(Math.random() * 50) + 80,
    tampered: Math.floor(Math.random() * 5) + 1
  }));
  
  const deliveryTimes = products.map(p => ({
    batch: p.batchId,
    days: Math.floor(Math.random() * 10) + 2
  }));
  
  return {
    stageDistribution,
    supplierPerformance,
    integrityTrends,
    deliveryTimes
  };
}