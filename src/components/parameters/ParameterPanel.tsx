import { Alert, Button, Card, Group, NumberInput, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { calculatePci } from '../../core/calculationEngine';
import { useAppStore } from '../../store/useAppStore';

interface ParameterPanelProps {
  onCalculated: () => void;
}

const ParameterPanel = ({ onCalculated }: ParameterPanelProps) => {
  const { t } = useTranslation();
  const { product, setProduct, setCalculationResult } = useAppStore();

  if (!product) {
    return (
      <Alert icon={<IconInfoCircle size={16} />}>
        {t('parameters.noProduct')}
      </Alert>
    );
  }

  const updateProductParam = (value: number) => {
    setProduct({
      ...product,
      productParameters: {
        ...product.productParameters,
        productionWasteFraction: value,
      },
    });
  };

  const updateComponentUseFactor = (
    componentId: string,
    key: 'intensity' | 'lifetime' | 'intensityReference' | 'lifetimeReference',
    value: number,
  ) => {
    setProduct({
      ...product,
      components: product.components.map((component) =>
        component.componentId === componentId
          ? {
              ...component,
              componentParameters: {
                ...component.componentParameters,
                [key]: value,
              },
            }
          : component,
      ),
    });
  };

  const updateMaterialParam = (
    componentId: string,
    materialId: string,
    field: keyof NonNullable<typeof product.components[number]['materials'][number]['materialParameters']>,
    value: number,
  ) => {
    setProduct({
      ...product,
      components: product.components.map((component) => {
        if (component.componentId !== componentId) return component;
        return {
          ...component,
          materials: component.materials.map((material) => {
            if (material.materialId !== materialId) return material;
            return {
              ...material,
              materialParameters: {
                ...material.materialParameters,
                [field]: value,
              },
            };
          }),
        };
      }),
    });
  };

  const calculate = () => {
    if (!product) return;
    setCalculationResult(calculatePci({ product }));
    onCalculated();
  };

  return (
    <Stack gap="md">
      <Card withBorder shadow="sm">
        <Group justify="space-between" align="center" mb="sm">
          <div>
            <Title order={4}>{t('parameters.title')}</Title>
            <Text size="sm" c="dimmed">
              {t('parameters.subtitle')}
            </Text>
          </div>
          <NumberInput
            label={t('parameters.productionWaste')}
            value={product.productParameters?.productionWasteFraction ?? 0.05}
            min={0}
            max={0.8}
            step={0.01}
            maw={220}
            onChange={(value) => updateProductParam(Number(value ?? 0))}
          />
        </Group>
        <Text size="sm" c="dimmed">
          {t('parameters.placeholderNote')}
        </Text>
      </Card>

      {product.components.map((component) => (
        <Card key={component.componentId} withBorder shadow="sm">
          <Group justify="space-between" mb="xs">
            <div>
              <Title order={5}>{component.componentName}</Title>
              <Text size="xs" c="dimmed">
                {t('parameters.componentUseFactors')}
              </Text>
            </div>
            <Group gap="xs">
              <NumberInput
                label="I_c"
                min={0}
                value={component.componentParameters?.intensity ?? 1}
                onChange={(value) => updateComponentUseFactor(component.componentId, 'intensity', Number(value ?? 1))}
              />
              <NumberInput
                label="L_c"
                min={0}
                value={component.componentParameters?.lifetime ?? 1}
                onChange={(value) => updateComponentUseFactor(component.componentId, 'lifetime', Number(value ?? 1))}
              />
              <NumberInput
                label="I_d,c"
                min={0}
                value={component.componentParameters?.intensityReference ?? 1}
                onChange={(value) =>
                  updateComponentUseFactor(component.componentId, 'intensityReference', Number(value ?? 1))
                }
              />
              <NumberInput
                label="L_d,c"
                min={0}
                value={component.componentParameters?.lifetimeReference ?? 1}
                onChange={(value) =>
                  updateComponentUseFactor(component.componentId, 'lifetimeReference', Number(value ?? 1))
                }
              />
            </Group>
          </Group>
          <Stack gap="sm">
            {component.materials.map((material) => (
              <Card key={material.materialId} withBorder shadow="xs" radius="md">
                <Title order={6}>{material.materialName}</Title>
                <Text size="xs" c="dimmed" mb="xs">
                  {t('parameters.materialRowHelper')}
                </Text>
                <SimpleGrid cols={{ base: 2, md: 4 }} spacing="xs">
                  <NumberInput
                    label="F_u"
                    min={0}
                    max={1}
                    step={0.05}
                    value={material.materialParameters?.fu ?? 1}
                    onChange={(value) =>
                      updateMaterialParam(component.componentId, material.materialId, 'fu', Number(value ?? 0))
                    }
                  />
                  <NumberInput
                    label="F_r"
                    min={0}
                    max={1}
                    step={0.05}
                    value={material.materialParameters?.fr ?? 0}
                    onChange={(value) =>
                      updateMaterialParam(component.componentId, material.materialId, 'fr', Number(value ?? 0))
                    }
                  />
                  <NumberInput
                    label="C_u"
                    min={0}
                    max={1}
                    step={0.05}
                    value={material.materialParameters?.cu ?? 0}
                    onChange={(value) =>
                      updateMaterialParam(component.componentId, material.materialId, 'cu', Number(value ?? 0))
                    }
                  />
                  <NumberInput
                    label="C_r"
                    min={0}
                    max={1}
                    step={0.05}
                    value={material.materialParameters?.cr ?? 0}
                    onChange={(value) =>
                      updateMaterialParam(component.componentId, material.materialId, 'cr', Number(value ?? 0))
                    }
                  />
                  <NumberInput
                    label="C_cp"
                    min={0}
                    max={1}
                    step={0.05}
                    value={material.materialParameters?.ccp ?? 0}
                    onChange={(value) =>
                      updateMaterialParam(component.componentId, material.materialId, 'ccp', Number(value ?? 0))
                    }
                  />
                  <NumberInput
                    label="C_fp"
                    min={0}
                    max={1}
                    step={0.05}
                    value={material.materialParameters?.cfp ?? 0}
                    onChange={(value) =>
                      updateMaterialParam(component.componentId, material.materialId, 'cfp', Number(value ?? 0))
                    }
                  />
                  <NumberInput
                    label="E_fp"
                    min={0}
                    max={1}
                    step={0.05}
                    value={material.materialParameters?.e_fp ?? 1}
                    onChange={(value) =>
                      updateMaterialParam(component.componentId, material.materialId, 'e_fp', Number(value ?? 0))
                    }
                  />
                  <NumberInput
                    label="E_cp"
                    min={0}
                    max={1}
                    step={0.05}
                    value={material.materialParameters?.e_cp ?? 1}
                    onChange={(value) =>
                      updateMaterialParam(component.componentId, material.materialId, 'e_cp', Number(value ?? 0))
                    }
                  />
                  <NumberInput
                    label="E_ms"
                    min={0}
                    max={1}
                    step={0.05}
                    value={material.materialParameters?.e_ms ?? 1}
                    onChange={(value) =>
                      updateMaterialParam(component.componentId, material.materialId, 'e_ms', Number(value ?? 0))
                    }
                  />
                  <NumberInput
                    label="E_rfp"
                    min={0}
                    max={1}
                    step={0.05}
                    value={material.materialParameters?.e_rfp ?? 1}
                    onChange={(value) =>
                      updateMaterialParam(component.componentId, material.materialId, 'e_rfp', Number(value ?? 0))
                    }
                  />
                </SimpleGrid>
              </Card>
            ))}
          </Stack>
        </Card>
      ))}

      <Group justify="flex-end">
        <Button onClick={calculate} data-testid="calculate-pci">
          {t('actions.calculate')}
        </Button>
      </Group>
    </Stack>
  );
};

export default ParameterPanel;
