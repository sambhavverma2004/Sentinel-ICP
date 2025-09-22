import CryptoJS from 'crypto-js';

export function generateHash(data: string): string {
  return CryptoJS.SHA256(data).toString();
}

export function generateBlockHash(
  previousHash: string,
  timestamp: string,
  data: Record<string, any>
): string {
  const blockData = JSON.stringify({ previousHash, timestamp, data });
  return generateHash(blockData);
}

export function verifyChainIntegrity(events: any[]): boolean {
  for (let i = 1; i < events.length; i++) {
    const currentEvent = events[i];
    const previousEvent = events[i - 1];
    
    if (currentEvent.previousHash !== previousEvent.hash) {
      return false;
    }
    
    // Recalculate hash to verify integrity
    const expectedHash = generateBlockHash(
      currentEvent.previousHash,
      currentEvent.timestamp.toISOString(),
      currentEvent.data
    );
    
    if (currentEvent.hash !== expectedHash && !currentEvent.isTampered) {
      return false;
    }
  }
  
  return true;
}