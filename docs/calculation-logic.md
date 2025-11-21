# Calculation Logic (placeholder)

This MVP ships with placeholder mathematics so the UI and data flow can be exercised end-to-end. Swap the marked sections with the Bracquene et al. (2020) PCI equations once verified.

## Inputs
- Canonical BoM (product → components → materials)
- Parameters
  - Product: `productionWasteFraction`, `takeBackRate` (placeholder)
  - Component: `wasteFraction` (placeholder)
  - Material: `recycledContentFraction`, `recyclability`

## Placeholder formulae
- Material score = `0.6 * recycledContentFraction + 0.4 * recyclability` (clamped 0–1)
- Component PCI = mass-weighted average of material scores
- Overall PCI = mass-weighted average of component PCIs
- Waste mass = component mass × waste fraction (placeholder)
- Virgin flow = mass × (1 – recycled content)

## Sensitivity (placeholder)
- Generate levers for each component waste fraction and material recycled content / recyclability
- Apply ±10% relative change (bounded to 0–1)
- Recompute PCI and rank levers by improvement

## TODOs
- Replace formulas with Bracquene et al. equations (production, use, end-of-life)
- Expand parameter sets and default datasets with sourced values
- Add uncertainty handling and explicit unit validation
