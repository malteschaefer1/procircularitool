import { ComponentParameters, MaterialParameters, ProductParameters } from '../core/types';

export const defaultProductParameters: ProductParameters = {
  productionWasteFraction: 0.05,
  takeBackRate: 0.2,
  // TODO: Replace placeholder defaults with values grounded in Bracquene et al. (2020) once available.
};

export const defaultComponentParameters: ComponentParameters = {
  wasteFraction: 0.03,
};

export const defaultMaterialParameters: Record<string, MaterialParameters> = {
  'stainless steel': {
    recycledContentFraction: 0.35,
    recyclability: 0.9,
  },
  steel: {
    recycledContentFraction: 0.25,
    recyclability: 0.85,
  },
  aluminum: {
    recycledContentFraction: 0.3,
    recyclability: 0.92,
  },
  copper: {
    recycledContentFraction: 0.4,
    recyclability: 0.95,
  },
  brass: {
    recycledContentFraction: 0.2,
    recyclability: 0.88,
  },
  zinc: {
    recycledContentFraction: 0.15,
    recyclability: 0.8,
  },
  glass: {
    recycledContentFraction: 0.25,
    recyclability: 0.9,
  },
  polypropylene: {
    recycledContentFraction: 0.1,
    recyclability: 0.65,
  },
  'abs plastic': {
    recycledContentFraction: 0.08,
    recyclability: 0.5,
  },
  'carbon steel': {
    recycledContentFraction: 0.2,
    recyclability: 0.85,
  },
  electronics: {
    recycledContentFraction: 0.05,
    recyclability: 0.4,
  },
  rubber: {
    recycledContentFraction: 0.05,
    recyclability: 0.3,
  },
  // TODO: Expand this catalog with vetted values and references once domain data is available.
};
