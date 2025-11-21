import { describe, expect, it } from 'vitest';
import { mapRowsToProduct } from '../core/bomMapping';
import { ColumnMapping, RawBomRow } from '../core/types';

const rows: RawBomRow[] = [
  {
    component: 'Frame',
    component_quantity: 1,
    component_mass_kg: 2,
    material: 'Steel',
    material_quantity: 1.5,
    material_unit: 'kg',
    recycled_content: 0.2,
    recyclability: 0.85,
  },
  {
    component: 'Frame',
    component_quantity: 1,
    component_mass_kg: 2,
    material: 'PP polymer',
    material_quantity: 0.5,
    material_unit: 'kg',
    recycled_content: 0.1,
    recyclability: 0.65,
  },
];

const mapping: ColumnMapping = {
  componentName: 'component',
  componentQuantity: 'component_quantity',
  componentMass: 'component_mass_kg',
  materialName: 'material',
  materialQuantity: 'material_quantity',
  materialUnit: 'material_unit',
  recycledContent: 'recycled_content',
  recyclability: 'recyclability',
};

describe('mapRowsToProduct', () => {
  it('groups materials under components', () => {
    const product = mapRowsToProduct(rows, mapping, 'Test product');
    expect(product.components).toHaveLength(1);
    expect(product.components[0].materials).toHaveLength(2);
    expect(product.components[0].totalMassKg).toBeGreaterThan(1.9);
  });
});
