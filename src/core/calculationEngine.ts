import { CalculationInput, CalculationResult } from './types';
import { convertToKg } from './units';

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const safeDivide = (num: number, den: number) => (den === 0 ? 0 : num / den);

export const calculatePci = (input: CalculationInput): CalculationResult => {
  // Implements Bracquene et al. (2020) PCI logic decomposed to component/material level.
  let totalProductMassKg = 0;
  let totalVirginMassKg = 0;
  let totalWasteMassKg = 0;
  let totalRecycledMassKg = 0;
  let totalReusedMassKg = 0;
  let totalLfiWeighted = 0;
  let totalLfiMass = 0;
  const componentLfi: Array<{ componentId: string; componentName: string; lfi: number }> = [];

  const pciByComponent = input.product.components.map((component) => {
    const componentMassKg =
      component.totalMassKg ||
      component.materials.reduce((sum, material) => {
        const mass = material.massKg ?? convertToKg(material.quantity, material.unit) ?? 0;
        return sum + mass;
      }, 0);

    totalProductMassKg += componentMassKg;

    const {
      intensity = 1,
      lifetime = 1,
      intensityReference = 1,
      lifetimeReference = 1,
    } = component.componentParameters || {};
    const X_c = safeDivide(intensity * lifetime, intensityReference * lifetimeReference) || 1;

    let compPciNumerator = 0;
    let compMassSum = 0;
    let compLfiNumerator = 0;
    let compLfiMass = 0;

    component.materials.forEach((material) => {
      const mass = material.massKg ?? convertToKg(material.quantity, material.unit) ?? 0;
      const params = material.materialParameters || {};
      const fu = params.fu ?? 1;
      const fr = params.fr ?? 0;
      const cu = params.cu ?? 0;
      const cr = params.cr ?? 0;
      const ccp = params.ccp ?? 0;
      const cfp = params.cfp ?? 0;
      const e_fp = params.e_fp ?? 1;
      const e_cp = params.e_cp ?? 1;
      const e_ms = params.e_ms ?? 1;
      const e_rfp = params.e_rfp ?? 1;

      // Linear reference masses
      const vLinear = safeDivide(mass, e_cp * e_fp);

      const V_cm = safeDivide((1 - fu) * (1 - fr) * mass, e_cp * e_fp);
      const W_fp_cm = safeDivide((1 - fu) * (1 - e_fp) * (1 - cfp) * mass, e_fp * e_cp);
      const W_cp_cm = safeDivide((1 - fu) * (1 - e_cp) * (1 - ccp) * mass, e_cp);
      const W_u_cm = mass * (1 - cu - cr);
      const W_ms_cm = mass * cr * (1 - e_ms);
      const W_rfp_cm = mass * e_ms * (1 - e_rfp);
      const W_cm = W_fp_cm + W_cp_cm + W_u_cm + W_ms_cm + W_rfp_cm;

      const R_in_cm = safeDivide((1 - fu) * mass, e_fp * e_cp);
      const R_fp_cm = safeDivide(mass * (1 - e_fp) * (1 - fu), e_fp);
      const R_cp_cm = safeDivide(mass * ccp * (1 - e_cp) * (1 - fu), e_cp);
      const R_EoL_cm = e_rfp * e_ms * cr * mass;
      const R_out_cm = R_fp_cm + R_cp_cm + R_EoL_cm;
      const R_cm = Math.abs(R_in_cm - R_out_cm);

      const C_cm = mass * (fu - cu);

      const lfiDen = 2 * vLinear || 1;
      const LFI_cm = (V_cm + W_cm + 0.5 * (Math.abs(R_cm) + Math.abs(C_cm))) / lfiDen;
      const PCI_cm = clamp(1 - safeDivide(LFI_cm, X_c));

      compPciNumerator += PCI_cm * mass;
      compMassSum += mass;
      compLfiNumerator += LFI_cm * mass;
      compLfiMass += mass;

      totalVirginMassKg += V_cm;
      totalWasteMassKg += W_cm;
      totalRecycledMassKg += R_cm;
      totalReusedMassKg += C_cm;
      totalLfiWeighted += LFI_cm * mass;
      totalLfiMass += mass;
    });

    const pci = compMassSum > 0 ? compPciNumerator / compMassSum : 0;
    const lfi = compLfiMass > 0 ? compLfiNumerator / compLfiMass : 0;
    componentLfi.push({ componentId: component.componentId, componentName: component.componentName, lfi });

    return {
      componentId: component.componentId,
      componentName: component.componentName,
      pci,
      massKg: componentMassKg,
    };
  });

  const componentMassTotal = pciByComponent.reduce((sum, c) => sum + c.massKg, 0);
  const pciOverall =
    componentMassTotal > 0
      ? pciByComponent.reduce((sum, c) => sum + c.pci * c.massKg, 0) / componentMassTotal
      : 0;
  const lfiOverall = totalLfiMass > 0 ? totalLfiWeighted / totalLfiMass : 0;

  const materialTotals: Record<
    string,
    {
      mass: number;
      pciWeighted: number;
      lfiWeighted: number;
      name: string;
    }
  > = {};

  input.product.components.forEach((component) => {
    const {
      intensity = 1,
      lifetime = 1,
      intensityReference = 1,
      lifetimeReference = 1,
    } = component.componentParameters || {};
    const X_c = safeDivide(intensity * lifetime, intensityReference * lifetimeReference) || 1;

    component.materials.forEach((material) => {
      const mass = material.massKg ?? convertToKg(material.quantity, material.unit) ?? 0;
      const params = material.materialParameters || {};
      const fu = params.fu ?? 1;
      const fr = params.fr ?? 0;
      const cu = params.cu ?? 0;
      const cr = params.cr ?? 0;
      const ccp = params.ccp ?? 0;
      const cfp = params.cfp ?? 0;
      const e_fp = params.e_fp ?? 1;
      const e_cp = params.e_cp ?? 1;
      const e_ms = params.e_ms ?? 1;
      const e_rfp = params.e_rfp ?? 1;

      const vLinear = safeDivide(mass, e_cp * e_fp);
      const W_fp_cm = safeDivide((1 - fu) * (1 - e_fp) * (1 - cfp) * mass, e_fp * e_cp);
      const W_cp_cm = safeDivide((1 - fu) * (1 - e_cp) * (1 - ccp) * mass, e_cp);
      const W_u_cm = mass * (1 - cu - cr);
      const W_ms_cm = mass * cr * (1 - e_ms);
      const W_rfp_cm = mass * e_ms * (1 - e_rfp);
      const W_cm = W_fp_cm + W_cp_cm + W_u_cm + W_ms_cm + W_rfp_cm;

      const V_cm = safeDivide((1 - fu) * (1 - fr) * mass, e_cp * e_fp);
      const R_in_cm = safeDivide((1 - fu) * mass, e_fp * e_cp);
      const R_fp_cm = safeDivide(mass * (1 - e_fp) * (1 - fu), e_fp);
      const R_cp_cm = safeDivide(mass * ccp * (1 - e_cp) * (1 - fu), e_cp);
      const R_EoL_cm = e_rfp * e_ms * cr * mass;
      const R_out_cm = R_fp_cm + R_cp_cm + R_EoL_cm;
      const R_cm = Math.abs(R_in_cm - R_out_cm);
      const C_cm = mass * (fu - cu);
      const lfiDen = 2 * vLinear || 1;
      const LFI_cm = (V_cm + W_cm + 0.5 * (Math.abs(R_cm) + Math.abs(C_cm))) / lfiDen;
      const PCI_cm = clamp(1 - safeDivide(LFI_cm, X_c));

      const key = material.materialName.toLowerCase();
      if (!materialTotals[key]) {
        materialTotals[key] = { mass: 0, pciWeighted: 0, lfiWeighted: 0, name: material.materialName };
      }
      materialTotals[key].mass += mass;
      materialTotals[key].pciWeighted += PCI_cm * mass;
      materialTotals[key].lfiWeighted += LFI_cm * mass;
    });
  });

  const pciByMaterial = Object.values(materialTotals).map((entry) => ({
    materialId: entry.name,
    materialName: entry.name,
    pci: entry.mass > 0 ? entry.pciWeighted / entry.mass : 0,
    massKg: entry.mass,
  }));

  const lfiByComponent = componentLfi;

  const lfiByMaterial = Object.values(materialTotals).map((entry) => ({
    materialId: entry.name,
    materialName: entry.name,
    lfi: entry.mass > 0 ? entry.lfiWeighted / entry.mass : 0,
  }));

  const pciByComponentResult = pciByComponent.map(({ componentId, componentName, pci, massKg }) => ({
    componentId,
    componentName,
    pci,
    massKg,
  }));

  return {
    pciOverall,
    pciByComponent: pciByComponentResult,
    pciByMaterial,
    lfiOverall,
    lfiByComponent,
    lfiByMaterial,
    totalProductMassKg,
    totalVirginMassKg,
    totalWasteMassKg,
    totalRecycledMassKg,
    totalReusedMassKg,
    notes: [
      'Implements Bracquene et al. (2020) PCI decomposition at component/material level (DOI:10.1016/j.resconrec.2020.104886).',
      'Formulas rely on user/default parameters; if parameters are missing, defaults are used. Validate with domain experts.',
    ],
  };
};
