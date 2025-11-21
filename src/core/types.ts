export type Unit = 'kg' | 'g' | 'mg' | 't' | 'lb' | 'pcs';

export interface ProductParameters {
  productionWasteFraction?: number; // TODO: replace with validated parameter set from Bracquene et al.
  takeBackRate?: number;
}

export interface ComponentParameters {
  wasteFraction?: number;
}

export interface MaterialParameters {
  recycledContentFraction?: number;
  recyclability?: number;
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
}

export interface CalculationResult {
  pciOverall: number;
  pciByComponent: Array<{ componentId: string; componentName: string; pci: number; massKg: number }>;
  pciByMaterial: Array<{ materialId: string; materialName: string; pci: number; massKg: number }>;
  totalProductMassKg: number;
  totalWasteMassKg: number;
  totalVirginMaterialFlowKg: number;
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
  componentName: string;
  componentQuantity?: string;
  componentMass?: string;
  materialName: string;
  materialQuantity?: string;
  materialUnit?: string;
  materialMass?: string;
  recycledContent?: string;
  recyclability?: string;
  density?: string;
}
