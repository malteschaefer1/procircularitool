import { describe, expect, it } from 'vitest';
import { calculatePci } from '../core/calculationEngine';
import { CalculationInput } from '../core/types';

const sampleInput: CalculationInput = {
  product: {
    productId: 'demo',
    productName: 'Demo',
    productParameters: { productionWasteFraction: 0.05 },
    components: [
      {
        componentId: 'c1',
        componentName: 'Housing',
        quantity: 1,
        componentParameters: { intensity: 1, lifetime: 1, intensityReference: 1, lifetimeReference: 1 },
        materials: [
          {
            materialId: 'm1',
            materialName: 'Aluminum',
            quantity: 2,
            unit: 'kg',
            massKg: 2,
            materialParameters: {
              fu: 0.9,
              fr: 0.3,
              cu: 0.05,
              cr: 0.9,
              ccp: 0.05,
              cfp: 0.05,
              e_fp: 0.9,
              e_cp: 0.9,
              e_ms: 0.9,
              e_rfp: 0.9,
            },
          },
        ],
      },
      {
        componentId: 'c2',
        componentName: 'Electronics',
        quantity: 1,
        componentParameters: { intensity: 1, lifetime: 1, intensityReference: 1, lifetimeReference: 1 },
        materials: [
          {
            materialId: 'm2',
            materialName: 'Copper',
            quantity: 0.5,
            unit: 'kg',
            massKg: 0.5,
            materialParameters: {
              fu: 0.9,
              fr: 0.4,
              cu: 0.05,
              cr: 0.9,
              ccp: 0.05,
              cfp: 0.05,
              e_fp: 0.9,
              e_cp: 0.9,
              e_ms: 0.9,
              e_rfp: 0.9,
            },
          },
        ],
      },
    ],
  },
};

describe('calculatePci placeholder', () => {
  it('returns a bounded PCI score', () => {
    const result = calculatePci(sampleInput);
    expect(result.pciOverall).toBeGreaterThan(0);
    expect(result.pciOverall).toBeLessThanOrEqual(1);
    expect(result.totalProductMassKg).toBeCloseTo(2.5, 2);
    expect(result.totalVirginMassKg).toBeGreaterThan(0);
    expect(result.lfiOverall).toBeGreaterThanOrEqual(0);
  });

  it('aggregates component PCI correctly', () => {
    const result = calculatePci(sampleInput);
    expect(result.pciByComponent).toHaveLength(2);
    const housing = result.pciByComponent.find((c) => c.componentId === 'c1');
    expect(housing?.pci).toBeGreaterThan(0.5);
  });
});
