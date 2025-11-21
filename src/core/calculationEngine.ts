import { CalculationInput, CalculationResult } from './types';
import { convertToKg } from './units';

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

export const calculatePci = (input: CalculationInput): CalculationResult => {
  // TODO: Replace placeholder logic with Bracquene et al. (2020) PCI methodology.
  let totalProductMassKg = 0;
  let totalWasteMassKg = 0;
  let totalVirginMaterialFlowKg = 0;

  const pciByComponent = input.product.components.map((component) => {
    const componentMassKg =
      component.totalMassKg ||
      component.materials.reduce((sum, material) => {
        const mass = material.massKg ?? convertToKg(material.quantity, material.unit) ?? 0;
        return sum + mass;
      }, 0);

    const componentWasteFraction =
      component.componentParameters?.wasteFraction ??
      input.product.productParameters?.productionWasteFraction ??
      0.05;

    totalProductMassKg += componentMassKg;
    totalWasteMassKg += componentMassKg * componentWasteFraction;

    let weightedScore = 0;
    let massSum = 0;

    component.materials.forEach((material) => {
      const mass = material.massKg ?? convertToKg(material.quantity, material.unit) ?? 0;
      const recycledFraction = material.materialParameters?.recycledContentFraction ?? 0;
      const recyclability = material.materialParameters?.recyclability ?? 0.5;
      const virginShare = mass * (1 - recycledFraction);
      totalVirginMaterialFlowKg += virginShare;

      // Heuristic placeholder score
      const materialScore = clamp(recycledFraction * 0.6 + recyclability * 0.4);
      weightedScore += materialScore * mass;
      massSum += mass;
    });

    const componentScore = massSum > 0 ? weightedScore / massSum : 0;

    return {
      componentId: component.componentId,
      componentName: component.componentName,
      pci: clamp(componentScore),
      massKg: componentMassKg,
    };
  });

  const componentMassTotal = pciByComponent.reduce((sum, c) => sum + c.massKg, 0);
  const pciOverall =
    componentMassTotal > 0
      ? pciByComponent.reduce((sum, c) => sum + c.pci * c.massKg, 0) / componentMassTotal
      : 0;

  const materialTotals: Record<string, { mass: number; pci: number; name: string }> = {};
  input.product.components.forEach((component) => {
    component.materials.forEach((material) => {
      const mass = material.massKg ?? convertToKg(material.quantity, material.unit) ?? 0;
      const recycledFraction = material.materialParameters?.recycledContentFraction ?? 0;
      const recyclability = material.materialParameters?.recyclability ?? 0.5;
      const score = clamp(recycledFraction * 0.6 + recyclability * 0.4);
      const key = material.materialName.toLowerCase();
      if (!materialTotals[key]) {
        materialTotals[key] = { mass: 0, pci: 0, name: material.materialName };
      }
      materialTotals[key].mass += mass;
      materialTotals[key].pci += score * mass;
    });
  });

  const pciByMaterial = Object.values(materialTotals).map((entry) => ({
    materialId: entry.name,
    materialName: entry.name,
    pci: entry.mass > 0 ? clamp(entry.pci / entry.mass) : 0,
    massKg: entry.mass,
  }));

  return {
    pciOverall: clamp(pciOverall),
    pciByComponent,
    pciByMaterial,
    totalProductMassKg,
    totalWasteMassKg,
    totalVirginMaterialFlowKg,
    notes: [
      'Placeholder PCI computation: weighted mix of recycled content and recyclability.',
      'Replace with Bracquene et al. (2020) equations for production, use, and end-of-life phases.',
    ],
  };
};
