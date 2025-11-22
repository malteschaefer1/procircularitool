# User Guide

1. **Upload or sample**: Upload your BoM as CSV/XLSX (parsed locally with PapaParse/ExcelJS) or pick one of the provided samples (washing machine, guard lock switch). Manual table entry is also available.
2. **Column mapping**: Map source headers (component, material, quantities, units, recycled content, recyclability) to the canonical schema using the mapping UI.
3. **Set parameters**: Review placeholder defaults for production waste and material parameters; override as needed.
4. **Run calculation**: Trigger the placeholder PCI calculation to see overall, component, and material-level PCI plus mass and flow summaries.
5. **What-if & sensitivity**: Adjust key parameters (e.g., waste fraction or F_r, E_ms levers) and inspect the top ±10% levers from the sensitivity screen.
6. **Exports**: Download CSV tables, chart PNGs, and a PDF report. All computation and rendering happen locally in the browser.

> Privacy: BoM and parameter data never leave the browser. No analytics are collected in the MVP.
