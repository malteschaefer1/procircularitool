# Calculation Logic (Bracquene et al. 2020 inspired)

This project implements a **placeholder** PCI logic aligned with the structure of Bracquene et al. (2020), decomposed to component/material level. Reference: DOI:10.1016/j.resconrec.2020.104886 (see `literature/`). Parameter values are placeholders and must be replaced with vetted sources.

## Inputs
- Canonical BoM (product → components → materials) with masses `M_c,m`
- Parameter inheritance: each parameter is assigned to a level (product, component, material). Values cascade downward (product → component → material) unless overridden.
- Component-level use factors: `I_c`, `L_c`, reference `I_d,c`, `L_d,c`
- Material parameters (fractions 0–1 unless stated): `F_u`, `F_r`, `C_u`, `C_r`, `C_cp`, `C_fp`, `E_fp`, `E_cp`, `E_ms`, `E_rfp`

## Core equations
- Masses:
  - `M_c = sum_m(M_c,m)`; `M = sum_c(M_c)`
  - `M_m = sum_c(M_c,m)`
- Use factor per component: `X_c = I_c * L_c / (I_d,c * L_d,c)` (defaults to 1 if missing)
- Virgin material (per material): `V_c,m = (1-F_u,c,m)*(1-F_r,c,m)*M_c,m/(E_cp,c,m*E_fp,c,m)`; `V_c = sum_m(V_c,m)`; `V = sum_c(V_c)`
- Linear reference flow: `V_linear,c,m = W_linear,c,m = M_c,m/(E_cp,c,m*E_fp,c,m)`
- Waste components:
  - `W_fp,c,m = (1-F_u,c,m)(1-E_fp,c,m)(1-C_fp,c,m)*M_c,m/(E_fp,c,m*E_cp,c,m)`
  - `W_cp,c,m = (1-F_u,c,m)(1-E_cp,c,m)(1-C_cp,c,m)*M_c,m/E_cp,c,m`
  - `W_u,c,m = M_c,m*(1-C_u,c,m-C_r,c,m)`
  - `W_ms,c,m = M_c,m*C_r,c,m*(1-E_ms,c,m)`
  - `W_rfp,c,m = M_c,m*E_ms,c,m*(1-E_rfp,c,m)`
  - `W_c,m = sum of above`; `W_c = sum_m(W_c,m)`; `W = sum_c(W_c)`
- Recycled/reused:
  - `R_in,c,m = (1-F_u,c,m)*M_c,m/(E_fp,c,m*E_cp,c,m)`
  - `R_fp,c,m = M_c,m*(1-E_fp,c,m)(1-F_u,c,m)/E_fp,c,m`
  - `R_cp,c,m = M_c,m*C_cp,c,m*(1-E_cp,c,m)(1-F_u,c,m)/E_cp,c,m`
  - `R_EoL,c,m = E_rfp,c,m*E_ms,c,m*C_r,c,m*M_c,m`
  - `R_out,c,m = R_fp,c,m + R_cp,c,m + R_EoL,c,m`
  - `R_c,m = |R_in,c,m - R_out,c,m|`; `R_c = sum_m(R_c,m)`; `R = sum_c(R_c)`
  - `C_c,m = M_c,m*(F_u,c,m - C_u,c,m)`; `C_c = sum_m(C_c,m)`; `C = sum_c(C_c)`
- Linear Flow Index per material: `LFI_c,m = (V_c,m + W_c,m + 0.5*(|R_c,m|+|C_c,m|)) / (V_linear,c,m + W_linear,c,m)` (denominator collapses to `2*V_linear,c,m`; guarded against zero)
- Aggregated LFI:
  - `LFI_c = sum_m(M_c,m * LFI_c,m)/sum_m(M_c,m)`
  - `LFI = sum_c(M_c * LFI_c)/sum_c(M_c)` (mass-weighted; differs from the original text that suggests sum of LFI terms—assumed typo)
  - `LFI_m = sum_c(M_c,m * LFI_c,m)/sum_c(M_c,m)`
- PCI:
  - `PCI_c,m = 1 - LFI_c,m / X_c`
  - `PCI_c = sum_m(M_c,m * PCI_c,m)/sum_m(M_c,m)`
  - `PCI = sum_c(M_c * PCI_c)/sum_c(M_c)`
  - `PCI_m = sum_c(M_c,m * PCI_c,m)/sum_c(M_c,m)`

## Assumptions / notes
- Mass-weighting is used when aggregating LFI/PCI, in line with PCI mass weighting (the paper suggests summing LFI terms; please validate against the publication).
- Parameter `C_fp` is required in `W_fp` but not listed in the paper; we include it with a placeholder default (0.05).
- Default parameter values and material presets are placeholders (see `src/data/defaultParameters.ts`); replace with sourced values and add citations.
- Parameter inheritance is enforced in code: product-level values apply everywhere unless a component overrides; component values cascade to materials unless a material overrides.
- If any efficiency denominator is zero, the calculation falls back to 0 for that term to avoid division by zero.

## Sensitivity
- Currently perturbs component intensity `I_c`, material `F_r`, and `E_ms` by ±10%/+5% to show PCI deltas. Extend with more levers as data matures.

## Defaults (placeholders)
- Product/component-level placeholders: `I=1`, `L=1`, `I_d=1`, `L_d=1`, `C_u=0.05`, `C_r=0.6`, `F_u=0.9`, `F_r=0.2`, `C_cp=0.05`, `E_cp=0.9`, `E_fp=0.9`, `E_ms=0.9`, `E_rfp=0.9`.
- Material presets: see `defaultMaterialParameters` for examples (steel/aluminum/copper/etc.); these should be replaced with sourced values per material family.
- Production waste fraction is configurable elsewhere; it is not part of the PCI equations yet and is treated separately in the UI.
