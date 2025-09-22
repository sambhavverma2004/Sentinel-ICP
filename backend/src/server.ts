import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import shipmentRoutes from './routes/shipmentRoutes';
import supplierRoutes from './routes/supplierRoutes';

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error("MONGODB_URI is not defined.");
}
mongoose.connect(mongoUri).then(() => console.log("MongoDB connected."));

app.use('/api/shipments', shipmentRoutes);
app.use('/api/suppliers', supplierRoutes);

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
