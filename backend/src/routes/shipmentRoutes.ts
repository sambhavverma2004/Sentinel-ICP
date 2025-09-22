import express from 'express';
import { getAllShipments, addTimelineEvent } from '../controllers/shipmentController';

const router = express.Router();

router.get('/', getAllShipments);
// NEW ROUTE for adding an event
router.post('/:shipmentId/timeline', addTimelineEvent);

export default router;

