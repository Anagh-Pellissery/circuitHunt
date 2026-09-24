export function getActiveWindowIndex(gameStartTimestamp, now) {
  if (gameStartTimestamp === null || now < gameStartTimestamp) {
    return null;
  }
  return Math.floor((now - gameStartTimestamp) / (10 * 60 * 1000)) % 4;
}

export function getPrice(outpost, componentId, windowIndex) {
  if (!outpost.prices || !outpost.prices[componentId]) {
    return undefined;
  }
  return outpost.prices[componentId][windowIndex];
}
