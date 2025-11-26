# ProCirculariTool

A browser-based Product Circularity Index (PCI) explorer for sustainability and product teams. Upload or create a Bill of Materials (BoM), map columns to a canonical schema, run the Bracquene et al. (2020) PCI logic (DOI:10.1016/j.resconrec.2020.104886) decomposed to component/material level, explore what-if scenarios, and export dashboards—all without sending data off the device.

## Features
- CSV/XLSX upload (parsed locally with PapaParse + ExcelJS), manual entry, and two sample BoMs (washing machine, guard lock switch)
- Column mapping UI to align arbitrary headers with the canonical schema
- Parameter inheritance: pick the level (product/component/material) for each input once; values cascade to avoid duplicate entry
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
- `npm run test` – Vitest unit tests (uses `config/vite.config.ts`)
- `npm run test:coverage` – Vitest coverage
- `npm run e2e` – Playwright E2E (uses `config/playwright.config.ts`)
- `npm run docs:serve` / `npm run docs:build` – MkDocs site (config in `config/mkdocs.yml`)

## Documentation
MkDocs with the Material theme lives in `docs/`. Repo/process docs sit under `docs/meta/` (architecture, status, contributing, GPT usage). A Read the Docs config is included (`.readthedocs.yaml`).

```bash
# install python tooling
pip install -r docs/requirements.txt

# live reload docs
mkdocs serve -f config/mkdocs.yml

# static site
mkdocs build -f config/mkdocs.yml
```

## Project layout
```
config/
  eslint.config.js        # lint config
  prettier.config.cjs     # formatter config
  vite.config.ts          # Vite/Vitest config + aliases
  vitest.setup.ts         # Vitest setup
  playwright.config.ts    # E2E config
  tsconfig.base.json      # base TS settings (root tsconfig extends this)
  tsconfig.node.json      # TS settings for configs
  mkdocs.yml              # docs site config
src/
  core/          # types, units, parsers, mapping helpers, placeholder calc + sensitivity
  components/    # upload, mapping, parameters, results, what-if, export, layout
  data/          # sample BoMs and placeholder default parameters
  i18n/          # translations (en/de)
  theme/         # Mantine themes and provider
  store/         # Zustand state
public/data/     # sample BoM CSVs
literature/      # reference papers (kept intact)
docs/
  *.md           # user/developer docs
  meta/          # repo/process docs (architecture, status, contributing, GPT usage)
```

## License
Free for **non-commercial** use (research, education, internal evaluation). Commercial use requires explicit permission. See [LICENSE](LICENSE).
