import mongoose, { Schema, Document } from 'mongoose';

interface IShipmentEvent {
  title: string;
  location: string;
  timestamp: Date;
}

export interface IShipment extends Document {
  shipmentId: string;
  product: string;
  currentStatus: string;
  timeline: IShipmentEvent[];
}

const ShipmentEventSchema: Schema = new Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

const ShipmentSchema: Schema = new Schema({
  shipmentId: { type: String, required: true, unique: true },
  product: { type: String, required: true },
  currentStatus: { type: String, required: true },
  timeline: [ShipmentEventSchema],
});

export default mongoose.model<IShipment>('Shipment', ShipmentSchema);