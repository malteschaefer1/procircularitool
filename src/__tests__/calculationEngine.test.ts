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
        materials: [
          {
            materialId: 'm1',
            materialName: 'Aluminum',
            quantity: 2,
            unit: 'kg',
            massKg: 2,
            materialParameters: { recycledContentFraction: 0.3, recyclability: 0.9 },
          },
        ],
      },
      {
        componentId: 'c2',
        componentName: 'Electronics',
        quantity: 1,
        materials: [
          {
            materialId: 'm2',
            materialName: 'Copper',
            quantity: 0.5,
            unit: 'kg',
            massKg: 0.5,
            materialParameters: { recycledContentFraction: 0.4, recyclability: 0.9 },
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
  });

  it('aggregates component PCI correctly', () => {
    const result = calculatePci(sampleInput);
    expect(result.pciByComponent).toHaveLength(2);
    const housing = result.pciByComponent.find((c) => c.componentId === 'c1');
    expect(housing?.pci).toBeGreaterThan(0.5);
  });
});
