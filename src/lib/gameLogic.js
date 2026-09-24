export function calculateSwapDelta(currentPrice, boughtPrice) {
  if (currentPrice < boughtPrice) {
    return { difference: boughtPrice - currentPrice, label: `+₹${boughtPrice - currentPrice}`, color: 'green' };
  } else if (currentPrice > boughtPrice) {
    return { difference: boughtPrice - currentPrice, label: `-₹${currentPrice - boughtPrice}`, color: 'red' };
  }
  return { difference: 0, label: '₹0', color: 'grey' };
}

export function checkCircuitCompletion(circuitRequired, inventory) {
  if (!circuitRequired || !Array.isArray(circuitRequired)) return false;
  if (!inventory) return false;
  
  return circuitRequired.every(id => inventory[id]?.owned === true);
}
