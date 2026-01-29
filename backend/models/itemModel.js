import fs from "fs";
import path from "path";

// Absolute path to JSON data
const filePath = path.resolve("data/items.json");

// In-memory mutex lock per item
const locks = {};

// Read all items (sync = atomic for single-thread Node)
export function getAllItems() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// Save items back to file
function saveItems(items) {
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
}

/**
 * Atomic bid placement
 * @param {string|number} itemId
 * @param {number} bidAmount
 * @param {string} bidderId (socket.id)
 */
export function placeBid(itemId, bidAmount, bidderId) {

  // 🔒 Prevent concurrent writes on same item
  if (locks[itemId]) {
    return { success: false, message: "Another bid in progress" };
  }

  locks[itemId] = true;

  try {
    const items = getAllItems();

    // ✅ ID type safety (string vs number)
    const item = items.find(i => String(i.id) === String(itemId));

    if (!item) {
      return { success: false, message: "Item not found" };
    }

    // ❌ auction ended
    if (Date.now() > item.auctionEndTime) {
      return { success: false, message: "Auction ended" };
    }

    // ❌ same bidder cannot bid again
    if (item.lastBidder === bidderId) {
      return {
        success: false,
        message: "You are already the highest bidder"
      };
    }

    // ❌ bid must be higher
    if (bidAmount <= item.currentBid) {
      return {
        success: false,
        message: "Bid must be higher than current bid"
      };
    }

    // ✅ atomic update
    item.currentBid = bidAmount;
    item.lastBidder = bidderId;

    saveItems(items);

    return {
      success: true,
      item
    };

  } finally {
    // 🔓 Always unlock (even if error occurs)
    locks[itemId] = false;
  }
}
