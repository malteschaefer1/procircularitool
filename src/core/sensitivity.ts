import { CalculationInput, SensitivityLever, SensitivityResult } from './types';
import { calculatePci } from './calculationEngine';

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const cloneInput = (input: CalculationInput): CalculationInput =>
  JSON.parse(JSON.stringify(input)) as CalculationInput;

export const runSensitivityAnalysis = (input: CalculationInput): SensitivityResult => {
  const baseline = calculatePci(input);
  const levers: SensitivityLever[] = [];

  input.product.components.forEach((component) => {
    const baseWaste = component.componentParameters?.wasteFraction ??
      input.product.productParameters?.productionWasteFraction ??
      0.05;

    const decreasedWaste = clamp(baseWaste * 0.9);
    const decreasedInput = cloneInput(input);
    const targetComponent = decreasedInput.product.components.find(
      (c) => c.componentId === component.componentId,
    );
    if (targetComponent) {
      targetComponent.componentParameters = {
        ...targetComponent.componentParameters,
        wasteFraction: decreasedWaste,
      };
      const result = calculatePci(decreasedInput);
      levers.push({
        id: `${component.componentId}-waste`,
        label: `${component.componentName}: waste fraction`,
        baselineValue: baseWaste,
        changedValue: decreasedWaste,
        baselinePci: baseline.pciOverall,
        newPci: result.pciOverall,
        delta: result.pciOverall - baseline.pciOverall,
        direction: 'decrease',
      });
    }
  });

  input.product.components.forEach((component) => {
    component.materials.forEach((material) => {
      const baseRecycled = material.materialParameters?.recycledContentFraction ?? 0;
      const increased = clamp(baseRecycled * 1.1 + 0.05);
      const modifiedInput = cloneInput(input);
      const targetComponent = modifiedInput.product.components.find(
        (c) => c.componentId === component.componentId,
      );
      const targetMaterial = targetComponent?.materials.find(
        (m) => m.materialId === material.materialId,
      );
      if (targetMaterial) {
        targetMaterial.materialParameters = {
          ...targetMaterial.materialParameters,
          recycledContentFraction: increased,
        };
        const result = calculatePci(modifiedInput);
        levers.push({
          id: `${material.materialId}-rc`,
          label: `${component.componentName}: ${material.materialName} recycled content`,
          baselineValue: baseRecycled,
          changedValue: increased,
          baselinePci: baseline.pciOverall,
          newPci: result.pciOverall,
          delta: result.pciOverall - baseline.pciOverall,
          direction: 'increase',
        });
      }

      const baseRecyclability = material.materialParameters?.recyclability ?? 0.5;
      const increasedRecyclability = clamp(baseRecyclability * 1.1 + 0.05);
      const modifiedRecyclabilityInput = cloneInput(input);
      const targetComp = modifiedRecyclabilityInput.product.components.find(
        (c) => c.componentId === component.componentId,
      );
      const targetMat = targetComp?.materials.find((m) => m.materialId === material.materialId);
      if (targetMat) {
        targetMat.materialParameters = {
          ...targetMat.materialParameters,
          recyclability: increasedRecyclability,
        };
        const result = calculatePci(modifiedRecyclabilityInput);
        levers.push({
          id: `${material.materialId}-recyclability`,
          label: `${component.componentName}: ${material.materialName} recyclability`,
          baselineValue: baseRecyclability,
          changedValue: increasedRecyclability,
          baselinePci: baseline.pciOverall,
          newPci: result.pciOverall,
          delta: result.pciOverall - baseline.pciOverall,
          direction: 'increase',
        });
      }
    });
  });

  const sorted = levers.sort((a, b) => b.delta - a.delta);
  return { levers: sorted };
};
