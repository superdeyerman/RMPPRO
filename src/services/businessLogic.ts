export interface ServicePricing {
  basePrice: number;
  hairLengthMultiplier: number;
  hairVolumeMultiplier: number;
  distanceSurcharge: number;
  multiServiceDiscount: number;
  total: number;
}

export const calculateServicePrice = (
  items: any[],
  length: string,
  volume: string,
  modality: 'Studio' | 'Home' | 'Hotel',
  distanceKm: number = 0
): ServicePricing => {
  const basePrice = items.reduce((sum, i) => sum + i.price, 0);

  let lengthMult = 1;
  switch (length) {
    case 'Corto': lengthMult = 1; break;
    case 'Medio': lengthMult = 1.2; break;
    case 'Largo': lengthMult = 1.4; break;
    case 'Extra Largo': lengthMult = 1.6; break;
  }

  let volumeMult = 1;
  switch (volume) {
    case 'Normal': volumeMult = 1; break;
    case 'Abundante': volumeMult = 1.3; break;
  }

  // Recargo por distancia (Simulación tipo Uber)
  let distanceSurcharge = 0;
  if (modality === 'Home') {
    distanceSurcharge = 15000 + (distanceKm * 2000);
  } else if (modality === 'Hotel') {
    distanceSurcharge = 25000; // Flat fee for premium logistics
  }

  // Descuento por múltiples servicios (Escalera de descuentos)
  let discountPct = 0;
  if (items.length === 2) discountPct = 0.10;
  if (items.length >= 3) discountPct = 0.20;

  const subtotal = (basePrice * lengthMult * volumeMult);
  const multiServiceDiscount = subtotal * discountPct;
  const total = (subtotal - multiServiceDiscount) + distanceSurcharge;

  return {
    basePrice,
    hairLengthMultiplier: lengthMult,
    hairVolumeMultiplier: volumeMult,
    distanceSurcharge,
    multiServiceDiscount,
    total: Math.round(total)
  };
};

export const findAvailableStylist = async (serviceIds: string[], date: string, time: string) => {
  try {
    const response = await fetch(`/api/stylists/available?services=${serviceIds.join(',')}&date=${date}&time=${time}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error finding stylist:', error);
    return null;
  }
};
