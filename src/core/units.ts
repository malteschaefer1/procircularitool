import { Unit } from './types';

const unitToKg: Record<Unit, number | null> = {
  kg: 1,
  g: 0.001,
  mg: 0.000001,
  t: 1000,
  lb: 0.453592,
  pcs: null,
};

export const normalizeUnit = (unitInput?: string): Unit | undefined => {
  if (!unitInput) return undefined;
  const normalized = unitInput.trim().toLowerCase();
  if (normalized === 'piece' || normalized === 'pc' || normalized === 'pcs') return 'pcs';
  if (normalized === 'kilogram' || normalized === 'kilograms') return 'kg';
  if (normalized === 'gram' || normalized === 'grams') return 'g';
  if (normalized === 'ton' || normalized === 'tons' || normalized === ' tonne' || normalized === 'tonne') return 't';
  if (['lb', 'lbs', 'pound', 'pounds'].includes(normalized)) return 'lb';
  if ((['kg', 'g', 'mg', 't', 'lb'] as string[]).includes(normalized)) return normalized as Unit;
  return undefined;
};

export const convertToKg = (value: number | undefined, unit?: Unit): number | undefined => {
  if (value === undefined || Number.isNaN(value) || unit === undefined) return undefined;
  const factor = unitToKg[unit];
  if (factor === null) return undefined; // pieces cannot be converted without density/mass per piece
  return value * factor;
};

export const formatMass = (massKg?: number): string => {
  if (massKg === undefined) return '–';
  if (massKg >= 1) return `${massKg.toFixed(2)} kg`;
  return `${(massKg * 1000).toFixed(1)} g`;
};
