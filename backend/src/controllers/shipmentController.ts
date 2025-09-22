import { Request, Response } from 'express';
import Shipment from '../models/Shipment';
import { createSentinelCoreActor } from '../ic-agent';
import crypto from 'crypto';

const sentinelActor = createSentinelCoreActor();

export const getAllShipments = async (req: Request, res: Response) => {
  try {
    const shipments = await Shipment.find();
    res.status(200).json(shipments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shipments' });
  }
};

// NEW FUNCTION to add a timeline event
export const addTimelineEvent = async (req: Request, res: Response) => {
    const { shipmentId } = req.params;
    const { title, location, documentType } = req.body;

    try {
        const shipment = await Shipment.findOne({ shipmentId });
        if (!shipment) {
            return res.status(404).json({ message: "Shipment not found" });
        }

        // 1. Create a hash of the event data (simulating a document hash)
        const eventData = JSON.stringify({ title, location, documentType, timestamp: new Date() });
        const eventDataHash = crypto.createHash('sha256').update(eventData).digest('hex');

        // 2. Call the canister to record the event on-chain
        console.log(`Calling 'recordEvent' on canister for shipment: ${shipmentId}`);
        const canisterResponse = await sentinelActor.recordEvent(shipmentId, title, eventDataHash);
        console.log(`Canister response: ${canisterResponse}`);

        // 3. If successful, add the event to the MongoDB timeline
        const newEvent = {
            title,
            location,
            timestamp: new Date(),
            verified: true // Mark as verified on-chain
        };
        shipment.timeline.push(newEvent as any);
        await shipment.save();

        res.status(200).json(shipment);
    } catch (error) {
        console.error("Error adding timeline event:", error);
        res.status(500).json({ message: 'Error adding timeline event' });
    }
};

