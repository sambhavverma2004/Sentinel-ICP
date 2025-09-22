import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Supplier from './models/Supplier';
import Shipment from './models/Shipment';

dotenv.config();

const suppliersData = [
  { name: 'Green Leaf Organics', location: 'Colombia', tier: 1 },
  { name: 'Kaffee Veredelung', location: 'Hamburg, Germany', tier: 2 },
  { name: 'Atlantic Ship Co.', location: 'Global', tier: 2 },
  { name: 'Miami Port Logistics', location: 'Miami, USA', tier: 3 },
  { name: 'Last Mile Trucking', location: 'Florida, USA', tier: 3 },
];

const shipmentsData = [
    { shipmentId: 'SH-4560', product: 'Organic Coffee Beans', currentStatus: 'Delivered', timeline: [
        { title: 'Farm Harvested', location: 'Finca La Esmeralda, Colombia', timestamp: new Date('2025-08-01T08:00:00Z') },
        { title: 'Processing & Certification', location: 'Green Leaf Organics', timestamp: new Date('2025-08-02T14:00:00Z') },
        { title: 'Departed Port', location: 'Cartagena, Colombia', timestamp: new Date('2025-08-05T11:00:00Z') },
        { title: 'Cleared Customs', location: 'Port of Miami, USA', timestamp: new Date('2025-08-15T18:00:00Z') },
        { title: 'Delivered to Warehouse', location: 'Miami, FL', timestamp: new Date('2025-08-16T10:00:00Z') },
    ]},
    { shipmentId: 'SH-7891', product: 'Cobalt Batch C-113', currentStatus: 'Delayed', timeline: [
        { title: 'Mine Extraction', location: 'DRC Mining Site 4', timestamp: new Date('2025-09-10T09:00:00Z') },
        { title: 'Conflict-Free Audit', location: 'Auditor Firm XYZ', timestamp: new Date('2025-09-11T16:00:00Z') },
        { title: 'Port Arrival', location: 'Port of Dar es Salaam', timestamp: new Date('2025-09-15T12:00:00Z') },
    ]},
    { shipmentId: 'SH-3321', product: 'Microprocessors', currentStatus: 'In Transit', timeline: [
        { title: 'Fabrication Complete', location: 'Taiwan Fab 9', timestamp: new Date('2025-09-18T22:00:00Z') },
        { title: 'Packaged for Shipment', location: 'Taipei Logistics Hub', timestamp: new Date('2025-09-19T04:00:00Z') },
    ]},
    { shipmentId: 'SH-8802', product: 'Organic Cotton Bales', currentStatus: 'At Customs', timeline: [
        { title: 'Harvest & Ginning', location: 'Gujarat, India', timestamp: new Date('2025-08-20T13:00:00Z') },
        { title: 'Fair Trade Certified', location: 'WFTO Auditors', timestamp: new Date('2025-08-22T10:00:00Z') },
        { title: 'Shipped from Mundra Port', location: 'Mundra, India', timestamp: new Date('2025-08-25T19:00:00Z') },
        { title: 'Arrived at Port of LA', location: 'Los Angeles, USA', timestamp: new Date('2025-09-18T08:00:00Z') },
    ]},
];

const seedDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined.");
  }
  await mongoose.connect(mongoUri);

  console.log('Clearing existing data...');
  await Supplier.deleteMany({});
  await Shipment.deleteMany({});
  
  console.log('Inserting new data...');
  await Supplier.insertMany(suppliersData);
  await Shipment.insertMany(shipmentsData);
  console.log('Database has been seeded!');
};

seedDB().then(() => {
  mongoose.connection.close();
});
