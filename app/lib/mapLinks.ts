export function googleMapsLink(lat: number, lon: number, label: string) {
  const q = encodeURIComponent(`${label} @ ${lat},${lon}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}
export function appleMapsLink(lat: number, lon: number, label: string) {
  const q = encodeURIComponent(label);
  return `http://maps.apple.com/?ll=${lat},${lon}&q=${q}`;
}
