import { ComponentParameters, MaterialParameters, ParameterLevelMap, ProductParameters } from '../core/types';

export const defaultProductParameters: ProductParameters = {
  productionWasteFraction: 0.05,
  takeBackRate: 0.2,
  intensity: 1,
  lifetime: 1,
  intensityReference: 1,
  lifetimeReference: 1,
  cu: 0.05,
  cr: 0.6,
  fu: 0.9,
  fr: 0.2,
  ccp: 0.05,
  e_cp: 0.9,
  e_fp: 0.9,
  e_ms: 0.9,
  e_rfp: 0.9,
  // TODO: Replace placeholder defaults with values grounded in Bracquene et al. (2020) once available.
};

export const defaultComponentParameters: ComponentParameters = {
  wasteFraction: 0.03,
  intensity: 1,
  lifetime: 1,
  intensityReference: 1,
  lifetimeReference: 1,
  cu: 0.05,
  cr: 0.6,
  fu: 0.9,
  fr: 0.2,
  ccp: 0.05,
  e_cp: 0.9,
  e_fp: 0.9,
  e_ms: 0.9,
  e_rfp: 0.9,
};

const materialDefaults = (overrides: Partial<MaterialParameters> = {}): MaterialParameters => ({
  fu: 0.9,
  fr: 0.2,
  cu: 0.05,
  cr: 0.6,
  ccp: 0.05,
  cfp: 0.05,
  e_fp: 0.9,
  e_cp: 0.9,
  e_ms: 0.9,
  e_rfp: 0.9,
  ...overrides,
});

export const defaultMaterialParameters: Record<string, MaterialParameters> = {
  'stainless steel': materialDefaults({ fr: 0.35, cr: 0.9, e_ms: 0.9 }),
  steel: materialDefaults({ fr: 0.25, cr: 0.85 }),
  aluminum: materialDefaults({ fr: 0.3, cr: 0.92 }),
  copper: materialDefaults({ fr: 0.4, cr: 0.95 }),
  brass: materialDefaults({ fr: 0.2, cr: 0.88 }),
  zinc: materialDefaults({ fr: 0.15, cr: 0.8 }),
  glass: materialDefaults({ fr: 0.25, cr: 0.9 }),
  polypropylene: materialDefaults({ fr: 0.1, cr: 0.65 }),
  'abs plastic': materialDefaults({ fr: 0.08, cr: 0.5, e_ms: 0.8 }),
  'carbon steel': materialDefaults({ fr: 0.2, cr: 0.85 }),
  electronics: materialDefaults({ fr: 0.05, cr: 0.4, e_ms: 0.5 }),
  rubber: materialDefaults({ fr: 0.05, cr: 0.3, e_ms: 0.6 }),
  default: materialDefaults(),
  // TODO: Expand this catalog with vetted values and references once domain data is available (Bracquene et al. 2020 DOI:10.1016/j.resconrec.2020.104886).
};

export const defaultParameterLevels: ParameterLevelMap = {
  intensity: 'product',
  intensityReference: 'product',
  lifetime: 'product',
  lifetimeReference: 'product',
  cu: 'product',
  cr: 'product',
  ccp: 'component',
  e_cp: 'component',
  fu: 'component',
  fr: 'component',
  e_fp: 'material',
  e_ms: 'material',
  e_rfp: 'material',
} as const;
