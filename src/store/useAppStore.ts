import { create } from 'zustand';
import { CalculationResult, ColumnMapping, Product, RawBomRow } from '../core/types';

interface AppState {
  rawRows: RawBomRow[];
  mapping: ColumnMapping | null;
  productName: string;
  product: Product | null;
  calculationResult: CalculationResult | null;
  setRawRows: (rows: RawBomRow[]) => void;
  setMapping: (mapping: ColumnMapping | null) => void;
  setProductName: (name: string) => void;
  setProduct: (product: Product | null) => void;
  setCalculationResult: (result: CalculationResult | null) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  rawRows: [],
  mapping: null,
  productName: 'Custom product',
  product: null,
  calculationResult: null,
  setRawRows: (rows) => set({ rawRows: rows }),
  setMapping: (mapping) => set({ mapping }),
  setProductName: (name) => set({ productName: name }),
  setProduct: (product) => set({ product }),
  setCalculationResult: (result) => set({ calculationResult: result }),
  reset: () =>
    set({ rawRows: [], mapping: null, productName: 'Custom product', product: null, calculationResult: null }),
}));
