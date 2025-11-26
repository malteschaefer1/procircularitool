import { create } from 'zustand';
import { CalculationResult, ColumnMapping, MassBalanceIssue, ParameterLevelMap, Product, RawBomRow } from '../core/types';
import { defaultParameterLevels } from '../data/defaultParameters';

interface AppState {
  rawRows: RawBomRow[];
  mapping: ColumnMapping | null;
  productName: string;
  product: Product | null;
  calculationResult: CalculationResult | null;
  massBalanceWarnings: MassBalanceIssue[];
   parameterLevels: ParameterLevelMap;
  setRawRows: (rows: RawBomRow[]) => void;
  setMapping: (mapping: ColumnMapping | null) => void;
  setProductName: (name: string) => void;
  setProduct: (product: Product | null) => void;
  setCalculationResult: (result: CalculationResult | null) => void;
  setMassBalanceWarnings: (warnings: MassBalanceIssue[]) => void;
  setParameterLevels: (levels: ParameterLevelMap) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  rawRows: [],
  mapping: null,
  productName: 'Custom product',
  product: null,
  calculationResult: null,
  massBalanceWarnings: [],
  parameterLevels: { ...defaultParameterLevels },
  setRawRows: (rows) => set({ rawRows: rows }),
  setMapping: (mapping) => set({ mapping }),
  setProductName: (name) => set({ productName: name }),
  setProduct: (product) => set({ product }),
  setCalculationResult: (result) => set({ calculationResult: result }),
  setMassBalanceWarnings: (warnings) => set({ massBalanceWarnings: warnings }),
  setParameterLevels: (levels) => set({ parameterLevels: levels }),
  reset: () =>
    set({
      rawRows: [],
      mapping: null,
      productName: 'Custom product',
      product: null,
      calculationResult: null,
      massBalanceWarnings: [],
      parameterLevels: { ...defaultParameterLevels },
    }),
}));
