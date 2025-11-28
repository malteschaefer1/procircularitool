import { MaterialParameters, ParameterLevelMap, Product, ProductParameters } from '../core/types';
import { defaultParameterLevels } from './defaultParameters';

export const GUARD_LOCK_SWITCH_NAME = 'guard lock switch';

export const guardLockSwitchProductParameters: ProductParameters = {
  fu: 0,
  cu: 0.6,
  cr: 0.56,
  lifetimeReference: 1,
  lifetime: 1,
  intensityReference: 1,
  intensity: 1,
};

export const guardLockSwitchParameterLevels: ParameterLevelMap = {
  ...defaultParameterLevels,
  fu: 'product',
  cu: 'product',
  cr: 'product',
  fr: 'material',
  ccp: 'material',
  cfp: 'material',
  e_cp: 'material',
  e_fp: 'material',
  e_ms: 'material',
  e_rfp: 'material',
};

const guardLockSwitchMaterialParameters: Record<string, MaterialParameters> = {
  polyamide: { fr: 0, e_fp: 1, e_cp: 0.95, cfp: 0, ccp: 1, e_ms: 0.3, e_rfp: 0.3 },
  'stainless steel': {
    fr: 0.38,
    e_fp: 0.74,
    e_cp: 0.87,
    cfp: 0.434,
    ccp: 0.99,
    e_ms: 0.708,
    e_rfp: 0.708,
  },
  aluminum: { fr: 0.526, e_fp: 0.705, e_cp: 0.78, cfp: 0.95, ccp: 0.968, e_ms: 0.837, e_rfp: 0.837 },
  copper: { fr: 0.355, e_fp: 0.955, e_cp: 0.78, cfp: 0, ccp: 1, e_ms: 0.837, e_rfp: 0.837 },
  brass: { fr: 0.355, e_fp: 0.955, e_cp: 0.78, cfp: 0.44, ccp: 1, e_ms: 0.837, e_rfp: 0.837 },
  iron: { fr: 0.3, e_fp: 0.99, e_cp: 0.5, cfp: 0.55, ccp: 1, e_ms: 0.721, e_rfp: 0.721 },
  cardboard: { fr: 0.812, e_fp: 0.875, e_cp: 0.9, cfp: 0, ccp: 0.8, e_ms: 0.845, e_rfp: 0.845 },
  pcb: { fr: 0, e_fp: 1, e_cp: 0.667, cfp: 0, ccp: 0, e_ms: 0, e_rfp: 0 },
};

const normalizeName = (value: string) => value.toLowerCase().replace(/\s*\(.*?\)/g, '').trim();

const findMaterialOverride = (name: string): MaterialParameters | undefined => {
  const normalized = normalizeName(name);
  if (guardLockSwitchMaterialParameters[normalized]) return guardLockSwitchMaterialParameters[normalized];
  if (normalized.includes('stainless steel')) return guardLockSwitchMaterialParameters['stainless steel'];
  if (normalized.includes('printed circuit board') || normalized === 'pcb') return guardLockSwitchMaterialParameters.pcb;
  if (normalized.includes('polyamide')) return guardLockSwitchMaterialParameters.polyamide;
  if (normalized.includes('cardboard')) return guardLockSwitchMaterialParameters.cardboard;
  if (normalized.includes('brass')) return guardLockSwitchMaterialParameters.brass;
  if (normalized.includes('copper')) return guardLockSwitchMaterialParameters.copper;
  if (normalized.includes('iron')) return guardLockSwitchMaterialParameters.iron;
  if (normalized.includes('aluminum')) return guardLockSwitchMaterialParameters.aluminum;
  return undefined;
};

export const applyGuardLockSwitchPresets = (
  product: Product,
  productName: string,
): { product: Product; parameterLevels?: ParameterLevelMap } => {
  if (normalizeName(productName) !== GUARD_LOCK_SWITCH_NAME) {
    return { product, parameterLevels: undefined };
  }

  const updatedComponents = product.components.map((component) => ({
    ...component,
    materials: component.materials.map((material) => {
      const override = findMaterialOverride(material.materialName);
      if (!override) return material;
      return {
        ...material,
        materialParameters: {
          ...material.materialParameters,
          ...override,
        },
      };
    }),
  }));

  return {
    product: {
      ...product,
      productParameters: {
        ...product.productParameters,
        ...guardLockSwitchProductParameters,
      },
      components: updatedComponents,
    },
    parameterLevels: guardLockSwitchParameterLevels,
  };
};
