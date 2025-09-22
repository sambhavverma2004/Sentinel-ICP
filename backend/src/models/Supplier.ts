import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  location: string;
  tier: 1 | 2 | 3;
}

const SupplierSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  tier: { type: Number, required: true, enum: [1, 2, 3] },
});

export default mongoose.model<ISupplier>('Supplier', SupplierSchema);