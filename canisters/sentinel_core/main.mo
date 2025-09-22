import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Array "mo:base/Array";

/**
 * Project Sentinel Core Canister
 * * This actor is the "Trust Layer" for our application. It is the decentralized,
 * on-chain source of truth for critical supply chain events.
 * * The Node.js backend will call the functions in this canister to create immutable
 * records.
 */
actor SentinelCore {

  // --- Data Structures ---

  // Defines a single, verifiable event in the supply chain.
  public type SupplyChainEvent = {
    shipmentId: Text;
    eventType: Text; // e.g., "CERTIFICATION_UPLOADED", "DELIVERY_CONFIRMED"
    eventDataHash: Text; // A hash of the associated data (like a PDF certificate)
    timestamp: Time.Time;
    recordedBy: Principal; // The identity of the caller that recorded this event
  };

  // --- State ---

  // We use a stable variable to store our events. "stable" means the data
  // will persist across canister upgrades. This is our on-chain ledger.
  stable var eventLog : [SupplyChainEvent] = [];

  // --- Public Functions (Our Canister's API) ---

  /**
   * Records a new supply chain event to the immutable log.
   * This is the primary "write" function for our trust layer.
   * @param shipmentId - The unique ID of the shipment.
   * @param eventType - A string describing the event type.
   * @param eventDataHash - A SHA-256 hash of the data associated with the event.
   * @returns - A confirmation text.
   */
  public shared(msg) func recordEvent(shipmentId: Text, eventType: Text, eventDataHash: Text) : async Text {
    let newEvent : SupplyChainEvent = {
      shipmentId = shipmentId;
      eventType = eventType;
      eventDataHash = eventDataHash;
      timestamp = Time.now();
      recordedBy = msg.caller; // `msg.caller` is the authenticated user/canister who called this function
    };

    // FIX: Using the explicit Array.append function to resolve the type error.
    eventLog := Array.append(eventLog, [newEvent]);

    return "Event recorded successfully.";
  };

  /**
   * Retrieves all events for a specific shipment ID.
   * This is a "read" function to verify a shipment's history.
   * @param shipmentId - The unique ID of the shipment to query.
   * @returns - An array of all events matching the shipment ID.
   */
  public query func getEventsForShipment(shipmentId: Text) : async [SupplyChainEvent] {
    // FIX: Use the Array.filter function for a cleaner and more correct implementation.
    return Array.filter<SupplyChainEvent>(eventLog, func (event) {
      return event.shipmentId == shipmentId;
    });
  };

  /**
   * Returns the total number of events recorded. A simple health check.
   * @returns - The count of all events in the log.
   */
  public query func getEventCount() : async Nat {
    return eventLog.size();
  };
}