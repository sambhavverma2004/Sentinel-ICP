import { Actor, HttpAgent, ActorSubclass } from "@dfinity/agent";
import { IDL } from '@dfinity/candid';
import { Principal } from "@dfinity/principal";
import path from 'path'; // Import the path module

// --- Type Definitions for our Canister's Interface ---
export interface SupplyChainEvent {
  shipmentId: string;
  eventType: string;
  eventDataHash: string;
  timestamp: bigint;
  recordedBy: Principal;
}

export interface _SERVICE {
  recordEvent: (
    shipmentId: string,
    eventType: string,
    eventDataHash: string
  ) => Promise<string>;
  getEventsForShipment: (
    shipmentId: string
  ) => Promise<Array<SupplyChainEvent>>;
  getEventCount: () => Promise<bigint>;
}

// --- Candid IDL Factory ---
const idlFactory: IDL.InterfaceFactory = ({ IDL }) => {
  const SupplyChainEvent = IDL.Record({
      'shipmentId' : IDL.Text,
      'eventType' : IDL.Text,
      'eventDataHash' : IDL.Text,
      'timestamp' : IDL.Int,
      'recordedBy' : IDL.Principal,
  });
  return IDL.Service({
    'recordEvent' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Text], []),
    'getEventsForShipment': IDL.Func([IDL.Text], [IDL.Vec(SupplyChainEvent)], ['query']),
    'getEventCount': IDL.Func([], [IDL.Nat], ['query']),
  });
};


// --- Actor Creation ---
export const createSentinelCoreActor = (): ActorSubclass<_SERVICE> => {
  let canisterId: string;
  try {
     // FIX: Construct a robust, absolute path to the canister_ids.json file.
     // This is more reliable than a relative path and works correctly with ts-node.
     const canisterIdsPath = path.resolve(__dirname, '..', '..', '.dfx', 'local', 'canister_ids.json');
     canisterId = require(canisterIdsPath).sentinel_core.local;
  } catch (e) {
      console.error("Could not find canister_ids.json. Make sure you have deployed your canisters by running 'dfx deploy' from the project root.");
      throw e;
  }
  
  const agent = new HttpAgent({ host: "http://127.0.0.1:4943" });
  
  // For local development, we need to fetch the root key.
  if (process.env.NODE_ENV !== "production") {
    agent.fetchRootKey().catch(err => {
        console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
        console.error(err);
    });
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
};

