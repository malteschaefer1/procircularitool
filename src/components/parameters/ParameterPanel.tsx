import { Alert, Button, Card, Group, NumberInput, Stack, Table, Text, Title } from '@mantine/core';
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

  const updateMaterialParam = (
    componentId: string,
    materialId: string,
    field: 'recycledContentFraction' | 'recyclability',
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

  const materialRows = product.components.flatMap((component) =>
    component.materials.map((material) => ({ component, material })),
  );

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

      <Card withBorder shadow="sm">
        <Title order={5}>{t('parameters.materialTableTitle')}</Title>
        <Text size="sm" c="dimmed" mb="xs">
          {t('parameters.materialTableHint')}
        </Text>
        <Table striped highlightOnHover withRowBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('fields.component')}</Table.Th>
              <Table.Th>{t('fields.material')}</Table.Th>
              <Table.Th>{t('fields.recycledContent')}</Table.Th>
              <Table.Th>{t('fields.recyclability')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {materialRows.map((row) => (
              <Table.Tr key={`${row.component.componentId}-${row.material.materialId}`}>
                <Table.Td>{row.component.componentName}</Table.Td>
                <Table.Td>{row.material.materialName}</Table.Td>
                <Table.Td>
                  <NumberInput
                    value={row.material.materialParameters?.recycledContentFraction ?? 0}
                    min={0}
                    max={1}
                    step={0.05}
                    onChange={(value) =>
                      updateMaterialParam(
                        row.component.componentId,
                        row.material.materialId,
                        'recycledContentFraction',
                        Number(value ?? 0),
                      )
                    }
                  />
                </Table.Td>
                <Table.Td>
                  <NumberInput
                    value={row.material.materialParameters?.recyclability ?? 0.5}
                    min={0}
                    max={1}
                    step={0.05}
                    onChange={(value) =>
                      updateMaterialParam(
                        row.component.componentId,
                        row.material.materialId,
                        'recyclability',
                        Number(value ?? 0),
                      )
                    }
                  />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <Group justify="flex-end">
        <Button onClick={calculate} data-testid="calculate-pci">
          {t('actions.calculate')}
        </Button>
      </Group>
    </Stack>
  );
};

export default ParameterPanel;
