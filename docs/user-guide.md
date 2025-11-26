# User Guide

1. **Upload or sample**: Upload your BoM as CSV/XLSX (parsed locally with PapaParse/ExcelJS) or pick one of the provided samples (washing machine, guard lock switch). Manual table entry is also available.
2. **Column mapping**: Map source headers (component, material, quantities) to the canonical schema using the mapping UI. Recycled content/recyclability columns are no longer needed; unmapped columns are ignored. Mass-balance errors/warnings surface here.
3. **Set parameters**: Choose at which level (product, component, material) each input is defined, then review or override only where needed; values cascade downward to reduce duplicate entry. Defaults are placeholders until sourced values are provided.
4. **Run calculation**: Trigger the placeholder PCI calculation to see overall, component, and material-level PCI plus mass and flow summaries. Current equations follow the Bracquene et al. 2020 structure but still use placeholder parameter values.
5. **What-if & sensitivity**: Adjust key parameters (e.g., waste fraction or F_r, E_ms levers) and inspect the top ±10% levers from the sensitivity screen.
6. **Exports**: Download CSV tables, chart PNGs, and a PDF report. All computation and rendering happen locally in the browser.

> Privacy: BoM and parameter data never leave the browser. No analytics are collected in the MVP.
