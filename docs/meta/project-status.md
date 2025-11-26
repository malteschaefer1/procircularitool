# Project Status

## Implemented
- React + TypeScript + Vite SPA scaffold
- Mantine UI with light/dark/high-contrast themes
- EN/DE i18n via react-i18next
- CSV/XLSX parsing, manual entry, sample BoMs
- Column mapping to canonical schema
- Parameter-level selection (product/component/material) with inheritance to reduce duplicate entry
- Placeholder calculation engine + sensitivity (TODO: replace with Bracquene et al.)
- Results dashboard with charts, what-if slider, exports (CSV/PNG/PDF)
- Docs (MkDocs skeleton) and repo meta files
- Tests: Vitest unit tests; Playwright E2E skeleton; GitHub Actions CI workflow

## Partially implemented
- Parameter defaults: placeholder values only; sources pending
- PDF report: captures current UI; dedicated template and styling TBD
- Sensitivity: heuristic ±10% approach; needs domain-specific levers

## Not started
- Real PCI equations from Bracquene et al. (2020)
- Backend/APIs, persistence, authentication
- Analytics/telemetry (intentionally omitted for privacy in MVP)
- Comprehensive accessibility audit and full WCAG contrast validation
