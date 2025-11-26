import { CalculationInput, SensitivityLever, SensitivityResult } from './types';
import { calculatePci } from './calculationEngine';

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const cloneInput = (input: CalculationInput): CalculationInput =>
  JSON.parse(JSON.stringify(input)) as CalculationInput;

export const runSensitivityAnalysis = (input: CalculationInput): SensitivityResult => {
  const baseline = calculatePci(input);
  const levers: SensitivityLever[] = [];

  input.product.components.forEach((component) => {
    const baseIntensity = component.componentParameters?.intensity ?? 1;
    const decreasedIntensity = clamp(baseIntensity * 0.9, 0, 10);
    const decreasedInput = cloneInput(input);
    const targetComponent = decreasedInput.product.components.find(
      (c) => c.componentId === component.componentId,
    );
    if (targetComponent) {
        targetComponent.componentParameters = {
          ...targetComponent.componentParameters,
          intensity: decreasedIntensity,
        };
        const result = calculatePci(decreasedInput);
        levers.push({
          id: `${component.componentId}-intensity`,
          label: `${component.componentName}: I – Use intensity during use phase`,
          baselineValue: baseIntensity,
          changedValue: decreasedIntensity,
          baselinePci: baseline.pciOverall,
          newPci: result.pciOverall,
          delta: result.pciOverall - baseline.pciOverall,
        direction: 'decrease',
      });
    }
  });

  input.product.components.forEach((component) => {
    component.materials.forEach((material) => {
      const baseFr = material.materialParameters?.fr ?? 0;
      const increasedFr = clamp(baseFr * 1.1 + 0.05);
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
          fr: increasedFr,
        };
        const result = calculatePci(modifiedInput);
        levers.push({
          id: `${material.materialId}-fr`,
          label: `${component.componentName}: ${material.materialName} F_r – Fraction of recycled content of the produced feedstock`,
          baselineValue: baseFr,
          changedValue: increasedFr,
          baselinePci: baseline.pciOverall,
          newPci: result.pciOverall,
          delta: result.pciOverall - baseline.pciOverall,
          direction: 'increase',
        });
      }

      const baseEms = material.materialParameters?.e_ms ?? 1;
      const increasedEms = clamp(baseEms * 1.05 + 0.02);
      const modifiedEmsInput = cloneInput(input);
      const targetComp = modifiedEmsInput.product.components.find(
        (c) => c.componentId === component.componentId,
      );
      const targetMat = targetComp?.materials.find((m) => m.materialId === material.materialId);
      if (targetMat) {
        targetMat.materialParameters = {
          ...targetMat.materialParameters,
          e_ms: increasedEms,
        };
        const result = calculatePci(modifiedEmsInput);
        levers.push({
          id: `${material.materialId}-ems`,
          label: `${component.componentName}: ${material.materialName} E_ms – Efficiency of material separation process`,
          baselineValue: baseEms,
          changedValue: increasedEms,
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
