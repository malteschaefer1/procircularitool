import { nanoid } from 'nanoid';
import { ColumnMapping, Component, Material, Product, RawBomRow } from './types';
import { convertToKg, normalizeUnit } from './units';
import {
  defaultComponentParameters,
  defaultMaterialParameters,
  defaultProductParameters,
} from '../data/defaultParameters';

const parseNumber = (value: string | number | undefined): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  const normalized = value.toString().replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const pickMaterialParameters = (materialName?: string) => {
  if (!materialName) return undefined;
  const key = materialName.toLowerCase();
  return defaultMaterialParameters[key] ?? defaultMaterialParameters.default;
};

export const guessMappingFromColumns = (columns: string[]): ColumnMapping => {
  const find = (...keywords: string[]) =>
    columns.find((col) => keywords.some((kw) => col.toLowerCase().includes(kw)));

  return {
    componentName: find('component', 'subassembly') ?? columns[0],
    componentQuantity: find('component_qty', 'component quantity', 'component_qty', 'comp_qty') ?? undefined,
    componentMass: find('component_mass', 'component mass') ?? undefined,
    materialName: find('material') ?? columns[0],
    materialQuantity: find('material_qty', 'qty', 'quantity', 'mass') ?? undefined,
    materialUnit: find('unit') ?? undefined,
    materialMass: find('material_mass', 'mass_kg') ?? undefined,
    recycledContent: find('recycled', 'rc') ?? undefined,
    recyclability: find('recyclability', 'recovery') ?? undefined,
    density: find('density') ?? undefined,
  };
};

export const mapRowsToProduct = (
  rows: RawBomRow[],
  mapping: ColumnMapping,
  productName: string,
): Product => {
  const components = new Map<string, Component>();

  rows.forEach((row, index) => {
    const componentName = (row[mapping.componentName] as string) || `Component ${index + 1}`;
    const componentQuantity = parseNumber(row[mapping.componentQuantity ?? '']) ?? 1;
    const componentMassValue = parseNumber(row[mapping.componentMass ?? '']);
    const componentId = `${componentName}-${index}`;

    const materialName = (row[mapping.materialName] as string) || `Material ${index + 1}`;
    const materialQuantity = parseNumber(row[mapping.materialQuantity ?? '']) ?? 0;
    const materialUnit = normalizeUnit((row[mapping.materialUnit ?? ''] as string) || 'kg');
    const materialMassValue = parseNumber(row[mapping.materialMass ?? '']);
    const recycledContent = parseNumber(row[mapping.recycledContent ?? '']);
    const recyclability = parseNumber(row[mapping.recyclability ?? '']);
    const density = parseNumber(row[mapping.density ?? '']);

    const materialMassKg =
      convertToKg(materialMassValue, materialUnit) ?? convertToKg(materialQuantity, materialUnit);

    const material: Material = {
      materialId: nanoid(8),
      materialName,
      quantity: materialQuantity || materialMassValue || 1,
      unit: materialUnit ?? 'kg',
      massKg: materialMassKg,
      density,
      materialParameters: {
        // Map earlier recycled content field to Fr if present
        fr: recycledContent ?? pickMaterialParameters(materialName)?.fr,
        // Recyclability field loosely mapped to Cr (collection for recycling) if provided
        cr: recyclability ?? pickMaterialParameters(materialName)?.cr,
        fu: pickMaterialParameters(materialName)?.fu,
        cu: pickMaterialParameters(materialName)?.cu,
        ccp: pickMaterialParameters(materialName)?.ccp,
        cfp: pickMaterialParameters(materialName)?.cfp,
        e_fp: pickMaterialParameters(materialName)?.e_fp,
        e_cp: pickMaterialParameters(materialName)?.e_cp,
        e_ms: pickMaterialParameters(materialName)?.e_ms,
        e_rfp: pickMaterialParameters(materialName)?.e_rfp,
      },
    };

    if (!components.has(componentName)) {
      components.set(componentName, {
        componentId,
        componentName,
        quantity: componentQuantity,
        massPerUnitKg: undefined,
        totalMassKg: undefined,
        componentParameters: { ...defaultComponentParameters },
        materials: [],
      });
    }

    const component = components.get(componentName);
    if (component) {
      component.materials.push(material);
      const estimatedMass = component.totalMassKg ?? 0;
      const newMass = material.massKg ? estimatedMass + material.massKg : estimatedMass;
      component.totalMassKg = newMass || convertToKg(componentMassValue, materialUnit) || undefined;
      component.massPerUnitKg = component.totalMassKg
        ? component.totalMassKg / component.quantity
        : component.massPerUnitKg;
    }
  });

  return {
    productId: nanoid(10),
    productName: productName || 'Custom product',
    components: [...components.values()],
    productParameters: { ...defaultProductParameters },
  };
};
