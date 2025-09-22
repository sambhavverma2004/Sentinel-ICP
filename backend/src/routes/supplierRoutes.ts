import express from 'express';
import { getAllSuppliers } from '../controllers/supplierController';

const router = express.Router();
router.get('/', getAllSuppliers);

export default router;