# Roadmap

## Delivered in this MVP
- React + TypeScript + Vite SPA with Mantine theming (light/dark/high-contrast)
- EN/DE translations via react-i18next
- CSV/XLSX ingestion, column mapping UI, manual BoM entry, sample case studies
- Canonical data model + placeholder PCI engine and sensitivity analysis
- Parameter-level selection with inheritance (product → component → material)
- Charts (gauges, bars), what-if sliders, CSV/PNG/PDF export
- Testing scaffolding (Vitest/RTL, Playwright) and GitHub Actions CI
- MkDocs + Material documentation skeleton + Read the Docs config

## Near term
- Replace placeholder PCI with Bracquene et al. (2020) equations and validate units/parameters
- Harden unit conversion/validation and enrich default parameter datasets with sourced values
- Add richer flow visualisations (e.g., Sankey) and chart downloads
- Strengthen E2E coverage (error cases, manual entry) and accessibility/contrast audit
- Expand docs: parameter reference with sources, troubleshooting (mapping/mass balance), and worked examples

## Future directions
- Optional backend for persistence/user projects and scenario versioning
- GDPR-compliant, opt-in analytics (page/feature usage) without transmitting BoM data
- Authentication and sharing links
- API endpoints for programmatic PCI runs and PLM/ERP integration
