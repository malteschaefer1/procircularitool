import { describe, expect, it } from 'vitest';
import { applyGuardLockSwitchPresets, guardLockSwitchParameterLevels } from '../data/guardLockSwitchPresets';
import { Product } from '../core/types';

const baseProduct: Product = {
  productId: 'p1',
  productName: 'Guard lock switch',
  components: [
    {
      componentId: 'c1',
      componentName: 'Case',
      quantity: 1,
      materials: [
        {
          materialId: 'm1',
          materialName: 'Stainless steel',
          quantity: 1,
          unit: 'kg',
          massKg: 1,
          materialParameters: {},
        },
        {
          materialId: 'm2',
          materialName: 'Polyamide (inj. molding)',
          quantity: 1,
          unit: 'kg',
          massKg: 1,
          materialParameters: {},
        },
      ],
    },
  ],
  productParameters: {},
};

describe('applyGuardLockSwitchPresets', () => {
  it('applies product- and material-level overrides for Guard lock switch', () => {
    const { product, parameterLevels } = applyGuardLockSwitchPresets(baseProduct, baseProduct.productName);

    expect(parameterLevels).toEqual(guardLockSwitchParameterLevels);
    expect(product.productParameters?.fu).toBe(0);
    expect(product.productParameters?.cu).toBe(0.6);
    expect(product.productParameters?.cr).toBe(0.56);
    expect(parameterLevels?.fr).toBe('material');
    expect(parameterLevels?.ccp).toBe('material');
    expect(parameterLevels?.e_cp).toBe('material');
    expect(parameterLevels?.cfp).toBe('material');

    const steel = product.components[0].materials.find((m) => m.materialName === 'Stainless steel');
    expect(steel?.materialParameters?.e_fp).toBeCloseTo(0.74, 6);
    expect(steel?.materialParameters?.cfp).toBeCloseTo(0.434, 6);

    const polyamide = product.components[0].materials.find((m) => m.materialName.startsWith('Polyamide'));
    expect(polyamide?.materialParameters?.e_ms).toBeCloseTo(0.3, 6);
  });

  it('leaves other products unchanged', () => {
    const otherProduct: Product = { ...baseProduct, productName: 'Other', productParameters: {} };
    const { product, parameterLevels } = applyGuardLockSwitchPresets(otherProduct, otherProduct.productName);
    expect(parameterLevels).toBeUndefined();
    expect(product.productParameters?.fu).toBeUndefined();
    const steel = product.components[0].materials[0];
    expect(steel.materialParameters?.cfp).toBeUndefined();
  });
});
