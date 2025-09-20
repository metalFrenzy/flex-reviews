export const propertyMap: Record<string, string> = {
  "shoreditch-heights": "2B N1 A - 29 Shoreditch Heights",
  "bayside-loft": "Bayside Loft - Apartment 5", 
  "seaside-studio": "Seaside Studio",
  "canary-wharf": "1B Canary Wharf - 22 Marsh Wall",
  "kings-cross": "Studio Kings Cross - 15 Caledonian Road"
};

export const propertyIdMap: Record<string, string> = Object.fromEntries(
  Object.entries(propertyMap).map(([key, value]) => [value, key])
);