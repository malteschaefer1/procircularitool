export type Unit = 'kg' | 'g' | 'mg' | 't' | 'lb' | 'pcs';

export interface ProductParameters {
  productionWasteFraction?: number;
  takeBackRate?: number;
  // Use factors for the whole product (optional, component values preferred)
  intensity?: number;
  lifetime?: number;
  intensityReference?: number;
  lifetimeReference?: number;
  cu?: number;
  cr?: number;
  fu?: number;
  fr?: number;
  ccp?: number;
  e_cp?: number;
  e_fp?: number;
  e_ms?: number;
  e_rfp?: number;
}

export interface ComponentParameters {
  wasteFraction?: number;
  // Use factor inputs (defaults to 1 if omitted)
  intensity?: number;
  lifetime?: number;
  intensityReference?: number;
  lifetimeReference?: number;
  cu?: number;
  cr?: number;
  fu?: number;
  fr?: number;
  ccp?: number;
  e_cp?: number;
  e_fp?: number;
  e_ms?: number;
  e_rfp?: number;
}

export interface MaterialParameters {
  // Fractions 0–1
  fu?: number; // functional utilization factor (fraction of mass actually used)
  fr?: number; // recycled content fraction
  cu?: number; // fraction of collected for reuse
  cr?: number; // fraction collected for recycling
  ccp?: number; // component production scrap fraction
  cfp?: number; // feedstock production scrap fraction (not in list, required by formulas)
  e_fp?: number; // feedstock production efficiency
  e_cp?: number; // component production efficiency
  e_ms?: number; // material separation efficiency
  e_rfp?: number; // recycled feedstock production efficiency
}

export interface Material {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: Unit;
  massKg?: number;
  density?: number;
  materialParameters?: MaterialParameters;
}

export interface Component {
  componentId: string;
  componentName: string;
  quantity: number;
  massPerUnitKg?: number;
  totalMassKg?: number;
  declaredMassKg?: number;
  materialMassSumKg?: number;
  materials: Material[];
  componentParameters?: ComponentParameters;
}

export interface Product {
  productId: string;
  productName: string;
  components: Component[];
  productParameters?: ProductParameters;
}

export interface CalculationInput {
  product: Product;
  parameterLevels?: ParameterLevelMap;
}

export interface CalculationResult {
  pciOverall: number;
  pciByComponent: Array<{ componentId: string; componentName: string; pci: number; massKg: number }>;
  pciByMaterial: Array<{ materialId: string; materialName: string; pci: number; massKg: number }>;
   lfiOverall: number;
   lfiByComponent: Array<{ componentId: string; componentName: string; lfi: number }>;
   lfiByMaterial: Array<{ materialId: string; materialName: string; lfi: number }>;
  totalProductMassKg: number;
  totalVirginMassKg: number; // V
  totalWasteMassKg: number; // W
  totalRecycledMassKg: number; // R
  totalReusedMassKg: number; // C
  notes?: string[];
}

export interface SensitivityLever {
  id: string;
  label: string;
  baselineValue: number;
  changedValue: number;
  baselinePci: number;
  newPci: number;
  delta: number;
  direction: 'increase' | 'decrease';
}

export interface SensitivityResult {
  levers: SensitivityLever[];
}

export type RawBomRow = Record<string, string | number | undefined>;

export interface ColumnMapping {
  componentId?: string;
  componentName: string;
  componentQuantity?: string;
  componentMass?: string;
  materialType: string;
  materialMassPerComponent?: string;
  density?: string;
}

export interface MassBalanceIssue {
  componentId: string;
  componentName: string;
  declaredMassKg?: number;
  materialMassKg: number;
  differenceKg: number;
}

export type ParameterLevel = 'product' | 'component' | 'material';

export type ParameterKey =
  | 'intensity'
  | 'intensityReference'
  | 'lifetime'
  | 'lifetimeReference'
  | 'cu'
  | 'cr'
  | 'fu'
  | 'fr'
  | 'ccp'
  | 'e_cp'
  | 'e_fp'
  | 'e_ms'
  | 'e_rfp';

export type ParameterLevelMap = Record<ParameterKey, ParameterLevel>;
