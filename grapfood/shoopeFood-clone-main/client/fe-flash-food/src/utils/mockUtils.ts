/**
 * Generates a pseudo-random, but deterministic distance (km) based on an ID.
 * The same ID will always return the same distance.
 */
export const getDeterministicDistance = (id: string | number): number => {
  const strId = String(id);
  let hash = 0;
  for (let i = 0; i < strId.length; i++) {
    hash = (hash << 5) - hash + strId.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  // Use the absolute value of hash to generate a distance between 0.5 and 5.5
  return (Math.abs(hash) % 50) / 10 + 0.5;
};

/**
 * Generates a deterministic delivery time (mins) based on distance.
 * Roughly 5 mins per km + 10 mins base preparation time.
 */
export const getDeterministicTime = (distanceKm: number): number => {
  return Math.round(distanceKm * 5 + 10);
};
