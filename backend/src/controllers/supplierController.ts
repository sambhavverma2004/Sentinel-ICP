import { Request, Response } from 'express';
import Supplier from '../models/Supplier';

export const getAllSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suppliers' });
  }
};