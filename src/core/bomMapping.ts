import { nanoid } from 'nanoid';
import { ColumnMapping, Component, MassBalanceIssue, Material, Product, RawBomRow } from './types';
import { convertToKg, normalizeUnit } from './units';
import {
  defaultComponentParameters,
  defaultMaterialParameters,
  defaultProductParameters,
} from '../data/defaultParameters';

export const MASS_TOLERANCE = 0.01; // 1% tolerance for material mass vs component mass

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
  const normalize = (value: string) => value.toLowerCase().replace(/[\s_-]+/g, ' ').trim();
  const normalized = columns.map((col) => ({ original: col, normalized: normalize(col) }));
  const find = (predicate: (normalized: string) => boolean) =>
    normalized.find((entry) => predicate(entry.normalized))?.original;

  const componentId =
    find((n) => n === 'component id') ?? find((n) => n.startsWith('component id')) ?? find((n) => n.includes('comp id'));
  const componentName =
    find((n) => n === 'component name') ||
    find((n) => n === 'component') ||
    find((n) => n.includes('component name')) ||
    find((n) => n.includes('component') && !n.includes('id')) ||
    columns[1] ||
    columns[0];
  const componentQuantity =
    find((n) => n === 'component quantity') ??
    find((n) => n.startsWith('component qty')) ??
    find((n) => n.includes('quantity')) ??
    undefined;
  const componentMass =
    find((n) => n === 'component mass kg') ??
    find((n) => n.startsWith('component mass')) ??
    find((n) => n.includes('mass per component')) ??
    undefined;
  const materialType =
    find((n) => n === 'material type') ?? find((n) => n.includes('material')) ?? columns[0];
  const materialMassPerComponent =
    find((n) => n === 'material mass per component kg') ??
    find((n) => n.includes('material mass per component')) ??
    find((n) => n.startsWith('material mass')) ??
    find((n) => n.includes('mass per component')) ??
    undefined;
  const density = find((n) => n === 'density') ?? undefined;

  return {
    componentId,
    componentName,
    componentQuantity,
    componentMass,
    materialType,
    materialMassPerComponent,
    density,
  };
};

export const mapRowsToProduct = (
  rows: RawBomRow[],
  mapping: ColumnMapping,
  productName: string,
): Product => {
  const components = new Map<string, Component>();
  const materialTypeKey = mapping.materialType ?? (mapping as unknown as { materialName?: string }).materialName;

  rows.forEach((row, index) => {
    const rawComponentName = row[mapping.componentName] as string;
    const componentName = (rawComponentName ? rawComponentName.toString().trim() : '') || `Component ${index + 1}`;
    const fallbackId =
      componentName && componentName !== `Component ${index + 1}`
        ? componentName.toLowerCase().replace(/\s+/g, '-')
        : `component-${index + 1}`;
    const componentId =
      ((mapping.componentId ? (row[mapping.componentId] as string) : undefined) as string | undefined)?.trim() ||
      fallbackId;
    const componentQuantity = parseNumber(row[mapping.componentQuantity ?? '']) ?? 1;
    const componentMassValue = parseNumber(row[mapping.componentMass ?? '']);

    const rawMaterialName = materialTypeKey ? (row[materialTypeKey] as string) : undefined;
    const materialName = (rawMaterialName ? rawMaterialName.toString().trim() : '') || `Material ${index + 1}`;
    const materialMassValue = parseNumber(row[mapping.materialMassPerComponent ?? '']);
    const materialUnit = normalizeUnit((row[(mapping as { materialUnit?: string }).materialUnit ?? ''] as string)) ?? 'kg';
    const density = parseNumber(row[mapping.density ?? '']);
    const materialDefaults = pickMaterialParameters(materialName);

    const materialMassKg = convertToKg(materialMassValue, materialUnit) ?? materialMassValue;

    const material: Material = {
      materialId: nanoid(8),
      materialName,
      quantity: materialMassValue || 1,
      unit: materialUnit ?? 'kg',
      massKg: materialMassKg,
      density,
      materialParameters: {
        fr: materialDefaults?.fr,
        cr: materialDefaults?.cr,
        fu: materialDefaults?.fu,
        cu: materialDefaults?.cu,
        ccp: materialDefaults?.ccp,
        cfp: materialDefaults?.cfp,
        e_fp: materialDefaults?.e_fp,
        e_cp: materialDefaults?.e_cp,
        e_ms: materialDefaults?.e_ms,
        e_rfp: materialDefaults?.e_rfp,
      },
    };

    const componentKey = componentId || componentName;
    if (!components.has(componentKey)) {
      components.set(componentKey, {
        componentId,
        componentName,
        quantity: componentQuantity,
        massPerUnitKg: componentMassValue,
        totalMassKg: componentMassValue,
        declaredMassKg: componentMassValue,
        materialMassSumKg: 0,
        componentParameters: { ...defaultComponentParameters },
        materials: [],
      });
    }

    const component = components.get(componentKey);
    if (component) {
      component.materials.push(material);
      component.materialMassSumKg = (component.materialMassSumKg ?? 0) + (material.massKg ?? 0);
      component.declaredMassKg = component.declaredMassKg ?? componentMassValue;
      const massPerUnit = component.declaredMassKg ?? component.materialMassSumKg ?? component.massPerUnitKg;
      component.massPerUnitKg = massPerUnit;
      component.totalMassKg = massPerUnit;
    }
  });

  return {
    productId: nanoid(10),
    productName: productName || 'Custom product',
    components: [...components.values()],
    productParameters: { ...defaultProductParameters },
  };
};

export const validateComponentMassBalance = (
  components: Component[],
  toleranceFraction = MASS_TOLERANCE,
): { errors: MassBalanceIssue[]; warnings: MassBalanceIssue[] } => {
  const issues: { errors: MassBalanceIssue[]; warnings: MassBalanceIssue[] } = { errors: [], warnings: [] };

  components.forEach((component) => {
    const declared = component.declaredMassKg;
    if (declared === undefined) return;
    const materialSum =
      component.materialMassSumKg ??
      component.materials.reduce((sum, material) => sum + (material.massKg ?? 0), 0);
    const differenceKg = materialSum - declared;
    if (!Number.isFinite(differenceKg) || Math.abs(differenceKg) < 1e-6) return;

    const issue: MassBalanceIssue = {
      componentId: component.componentId,
      componentName: component.componentName,
      declaredMassKg: declared,
      materialMassKg: materialSum,
      differenceKg,
    };

    const tolerance = Math.abs(declared) * toleranceFraction;
    if (Math.abs(differenceKg) > tolerance) {
      issues.errors.push(issue);
    } else {
      issues.warnings.push(issue);
    }
  });

  return issues;
};
