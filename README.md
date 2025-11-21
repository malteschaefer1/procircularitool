# ProCirculariTool

A browser-based Product Circularity Index (PCI) explorer for sustainability and product teams. Upload or create a Bill of Materials (BoM), map columns to a canonical schema, run placeholder PCI logic, explore what-if scenarios, and export dashboards—all without sending data off the device.

> **Important:** PCI equations are placeholders. Replace them with the Bracquene et al. (2020) formulations when available.

## Features
- CSV/XLSX upload (parsed locally with PapaParse + ExcelJS), manual entry, and two sample BoMs (washing machine, guard lock switch)
- Column mapping UI to align arbitrary headers with the canonical schema
- Placeholder calculation engine with component/material breakdowns, totals, and notes
- What-if sliders and sensitivity analysis (±10% levers) with gauges and bar charts
- Light, dark, and high-contrast themes; bilingual UI (English/German)
- Exports: CSV tables, chart PNG snapshot, PDF report (client-side jsPDF + html2canvas)
- Privacy-first: BoM and parameter data stay in the browser; no analytics in the MVP

## Quick start (local)
Prerequisites: Node.js 18+ and npm.

```bash
npm install
npm run dev
```
Open the printed local URL (usually http://localhost:5173).

## Scripts
- `npm run dev` – Vite dev server
- `npm run build` – type-check + production build
- `npm run preview` – preview the production build
- `npm run lint` – ESLint
- `npm run format` – Prettier write
- `npm run test` – Vitest unit tests
- `npm run test:coverage` – Vitest coverage
- `npm run e2e` – Playwright E2E (starts dev server)
- `npm run docs:serve` / `npm run docs:build` – MkDocs site

## Documentation
MkDocs with the Material theme lives in `docs/`.

```bash
# install python tooling
pip install mkdocs-material

# live reload docs
mkdocs serve

# static site
mkdocs build
```

## Project layout
```
src/
  core/          # types, units, parsers, mapping helpers, placeholder calc + sensitivity
  components/    # upload, mapping, parameters, results, what-if, export, layout
  data/          # sample BoMs and placeholder default parameters
  i18n/          # translations (en/de)
  theme/         # Mantine themes and provider
  store/         # Zustand state
public/data/     # sample BoM CSVs
literature/      # reference papers (kept intact)
```

## License
Free for **non-commercial** use (research, education, internal evaluation). Commercial use requires explicit permission. See [LICENSE](LICENSE).
