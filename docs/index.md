# ProCirculariTool

ProCirculariTool is a browser-based tool to explore and report the Product Circularity Index (PCI). It guides sustainability and product teams through uploading a Bill of Materials (BoM), mapping columns to a canonical schema, applying placeholder parameters, running a placeholder PCI calculation, and exporting results.

> **Note:** All PCI equations are placeholders. Replace them with the Bracquene et al. (2020) methodology when available.

## Highlights
- Frontend-only React + TypeScript SPA (Vite)
- Mantine UI with light, dark, and high-contrast themes
- Bilingual UI (English/German) via react-i18next
- Local parsing for CSV/XLSX BoMs; sample case studies included
- PCI logic based on Bracquene et al. (2020) (DOI:10.1016/j.resconrec.2020.104886) decomposed to component/material level
- Sensitivity analysis, charts, and PDF/CSV exports

## Quick start
```bash
npm install
npm run dev # open http://localhost:5173
```

## License
Free for non-commercial use. See [LICENSE](../LICENSE).
