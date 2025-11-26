import { describe, expect, it } from 'vitest';
import { guessMappingFromColumns, mapRowsToProduct, validateComponentMassBalance } from '../core/bomMapping';
import { ColumnMapping, RawBomRow } from '../core/types';

const rows: RawBomRow[] = [
  {
    component_id: 'frame',
    component_name: 'Frame',
    component_quantity: 1,
    component_mass_kg: 2,
    material_type: 'Steel',
    material_mass_per_component_kg: 1.2,
  },
  {
    component_id: 'frame',
    component_name: 'Frame',
    component_quantity: 1,
    component_mass_kg: 2,
    material_type: 'PP polymer',
    material_mass_per_component_kg: 0.8,
  },
];

const mapping: ColumnMapping = {
  componentId: 'component_id',
  componentName: 'component_name',
  componentQuantity: 'component_quantity',
  componentMass: 'component_mass_kg',
  materialType: 'material_type',
  materialMassPerComponent: 'material_mass_per_component_kg',
};

describe('mapRowsToProduct', () => {
  it('groups materials under components', () => {
    const product = mapRowsToProduct(rows, mapping, 'Test product');
    expect(product.components).toHaveLength(1);
    expect(product.components[0].materials).toHaveLength(2);
    expect(product.components[0].totalMassKg).toBeCloseTo(2);
    expect(product.components[0].materialMassSumKg).toBeCloseTo(2);
    expect(product.components[0].materials[0].materialParameters?.fr).toBeDefined();
  });

  it('validates component mass balance with tolerance', () => {
    const offRows: RawBomRow[] = [
      {
        component_id: 'frame',
        component_name: 'Frame',
        component_quantity: 1,
        component_mass_kg: 2,
        material_type: 'Steel',
        material_mass_per_component_kg: 0.5,
      },
    ];
    const product = mapRowsToProduct(offRows, mapping, 'Test product');
    const { errors } = validateComponentMassBalance(product.components, 0.01);
    expect(errors).toHaveLength(1);
    expect(errors[0].componentName).toBe('Frame');
  });
});

describe('guessMappingFromColumns', () => {
  it('prefers component_name over component_id for the componentName field', () => {
    const columns = [
      'component_id',
      'component_name',
      'component_mass_kg',
      'component_quantity',
      'material_type',
      'material_mass_per_component_kg',
    ];
    const result = guessMappingFromColumns(columns);
    expect(result.componentId).toBe('component_id');
    expect(result.componentName).toBe('component_name');
    expect(result.materialType).toBe('material_type');
  });
});
