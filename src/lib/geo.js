/* Geometry helpers for field boundaries.
   Coordinates are arrays of [lat, lng] pairs in draw order. */

/* Spherical polygon area (square meters). Good enough for field-scale
   acreage, but it is an ESTIMATE of a hand-drawn outline — the UI must
   always present it as such. */
export function ringAreaSqMeters(coords) {
  if (!coords || coords.length < 3) return 0;
  const R = 6378137;
  const rad = (d) => (d * Math.PI) / 180;
  let total = 0;
  for (let i = 0; i < coords.length; i++) {
    const [lat1, lng1] = coords[i];
    const [lat2, lng2] = coords[(i + 1) % coords.length];
    total += (rad(lng2) - rad(lng1)) * (2 + Math.sin(rad(lat1)) + Math.sin(rad(lat2)));
  }
  return Math.abs((total * R * R) / 2);
}

export const toAcres = (sqMeters) => sqMeters / 4046.8564224;

/* Average point of a boundary — used to pick a weather location. */
export function centroid(coords) {
  if (!coords || coords.length === 0) return null;
  let lat = 0, lng = 0;
  for (const [a, n] of coords) { lat += a; lng += n; }
  return [lat / coords.length, lng / coords.length];
}
