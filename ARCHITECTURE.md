# Architecture

## Overview
- **TypeScript + React (Vite)** single-page application running fully in the browser
- **Mantine** UI with light/dark/high-contrast theme options
- **Zustand** handles lightweight global state (BoM rows, mapping, product, calculation results)
- **react-i18next** provides a bilingual EN/DE UI
- **Recharts** draws gauges and bars; **jsPDF + html2canvas** build PDFs client-side

## Data flow
1. **BoM ingestion** via CSV/XLSX (PapaParse/SheetJS) or manual entry → stored as `RawBomRow[]`.
2. **Column mapping** (`src/core/bomMapping.ts`) maps arbitrary headers to the canonical schema → `Product` with components/materials.
3. **Parameters** applied (placeholder defaults in `src/data/defaultParameters.ts`; editable in UI) → enriches `CalculationInput`.
4. **Calculation engine** (`src/core/calculationEngine.ts`) runs placeholder PCI logic → `CalculationResult`.
5. **What-if / sensitivity** (`src/core/sensitivity.ts`) perturbs inputs by ±10% → ranked levers.
6. **Presentation & export** renders cards/charts/tables → CSV/PNG/PDF downloads.

## Folder structure
```
src/
  core/          // types, units, parser & mapping helpers, placeholder calculations, sensitivity
  components/    // UI sections: upload, mapping, parameters, results, what-if, export, layout
  data/          // sample BoMs and placeholder parameter defaults
  i18n/          // translations (en/de)
  theme/         // Mantine theme definitions + provider
  store/         // Zustand store for shared state
public/data/     // downloadable sample CSVs
```

## State management
- `useAppStore` tracks raw rows, mapping, product name, product, and calculation result.
- What-if scenarios are computed locally within the `WhatIfPanel` to stay pure.
- All computation is deterministic and side-effect free; replacing logic is safe.

## Extensibility
- Swap placeholder PCI logic with Bracquene et al. equations while keeping the `CalculationInput`/`CalculationResult` interfaces stable.
- Add new parameters by extending typed models in `src/core/types.ts` and propagating through store + UI.
- Future backend can wrap calculation input/output with API calls; current engine is pure and could move server-side unchanged.
- Analytics, auth, or persistence can be added later; current client avoids all network calls beyond asset loading.
