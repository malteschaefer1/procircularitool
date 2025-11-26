# Developer Guide

## Stack
- React + TypeScript (Vite)
- Mantine UI
- Zustand for lightweight state sharing
- React-i18next for English/German translations
- Recharts for charts, jsPDF + html2canvas for client-side PDF export
- ExcelJS for XLSX parsing; PapaParse for CSV parsing
- PCI logic implements Bracquene et al. (2020) (DOI:10.1016/j.resconrec.2020.104886) with component/material decomposition
- Vitest + Testing Library for unit tests; Playwright for E2E
- MkDocs Material for docs

## Project layout
```
config/        # Vite/Vitest, Playwright, TS, lint/format, MkDocs configs
src/
  core/         // canonical types, parsers, placeholder calc engine, sensitivity
  components/   // UI building blocks (upload, mapping, parameters, results, what-if, export)
  data/         // sample BoMs and placeholder defaults
  i18n/         // translation resources
  theme/        // Mantine theme modes (light/dark/high-contrast)
  store/        // Zustand store
public/data/    // sample CSVs
docs/meta/      // repo/process docs (architecture, project status, contributing, GPT usage)
```

## Scripts
- `npm run dev` – start Vite dev server
- `npm run build` – type-check + production build
- `npm run lint` / `npm run format`
- `npm run test` / `npm run test:coverage` – Vitest (config at `config/vite.config.ts`)
- `npm run e2e` – Playwright (config at `config/playwright.config.ts`, starts dev server automatically)
- `npm run docs:serve` / `npm run docs:build` – MkDocs (root `mkdocs.yml` inherits `config/mkdocs.yml`)
- `.readthedocs.yaml` + `docs/requirements.txt` enable hosting on Read the Docs with MkDocs.

## Extending the calculation engine
`src/core/calculationEngine.ts` contains deterministic placeholder logic. Replace the marked blocks with the Bracquene et al. equations and keep the interfaces stable. Add new parameters to the typed `CalculationInput`/`CalculationResult` and surface them through the UI and docs.
