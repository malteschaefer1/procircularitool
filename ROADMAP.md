# ProCirculariTool Roadmap

## Delivered in this MVP
- React + TypeScript + Vite SPA scaffold with Mantine theming (light/dark/high-contrast)
- EN/DE translations via react-i18next
- CSV/XLSX ingestion, column mapping UI, manual BoM entry, sample case studies
- Canonical data model + placeholder PCI engine and sensitivity analysis
- Charts (gauges, bars), what-if sliders, CSV/PNG/PDF export
- Testing scaffolding (Vitest/RTL, Playwright) and GitHub Actions CI
- MkDocs + Material documentation skeleton

## Next up
- Replace placeholder PCI with Bracquene et al. (2020) equations and validate units/parameters
- Enrich default material datasets with sourced values and provenance fields
- Harden column mapping and validation (units, missing data, duplicate IDs)
- Expand visualizations (flow diagrams, Sankey), add chart downloads per chart
- Increase E2E coverage (manual entry, error states, export flows)
- Accessibility audit, keyboard navigation polish, high-contrast refinements

## Future directions
- Optional backend for persistence, scenario storage, and user accounts
- GDPR-compliant, opt-in analytics (page/feature usage) without transmitting BoM data
- API endpoints for batch PCI computation and integration with PLM/ERP tools
- Collaboration features (shareable links, commenting) and scenario versioning
