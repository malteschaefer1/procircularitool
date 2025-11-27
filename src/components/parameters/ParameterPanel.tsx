import {
  ActionIcon,
  Alert,
  Button,
  Card,
  Group,
  List,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconAlertTriangle, IconInfoCircle, IconLink } from '@tabler/icons-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MASS_TOLERANCE } from '../../core/bomMapping';
import { calculatePci } from '../../core/calculationEngine';
import { ParameterKey, ParameterLevel } from '../../core/types';
import { defaultParameterLevels, defaultProductParameters } from '../../data/defaultParameters';
import { useAppStore } from '../../store/useAppStore';

interface ParameterPanelProps {
  onCalculated: () => void;
}

const ParameterPanel = ({ onCalculated }: ParameterPanelProps) => {
  const { t } = useTranslation();
  const { product, setProduct, setCalculationResult, massBalanceWarnings, parameterLevels, setParameterLevels } =
    useAppStore();
  const tolerancePercent = MASS_TOLERANCE * 100;

  const formatKg = (value?: number) => (value === undefined ? '–' : `${value.toFixed(2)} kg`);
  const formatDiff = (value?: number) =>
    value === undefined ? '–' : `${value > 0 ? '+' : ''}${value.toFixed(2)} kg`;

  const parameterDefs: Array<{ key: ParameterKey; label: string; levels: ParameterLevel[] }> = useMemo(
    () => [
      { key: 'intensity', label: t('parameters.labels.intensity'), levels: ['product', 'component'] },
      { key: 'intensityReference', label: t('parameters.labels.intensityDesign'), levels: ['product', 'component'] },
      { key: 'lifetime', label: t('parameters.labels.lifetime'), levels: ['product', 'component'] },
      { key: 'lifetimeReference', label: t('parameters.labels.lifetimeDesign'), levels: ['product', 'component'] },
      { key: 'cu', label: t('parameters.labels.cu'), levels: ['product', 'component', 'material'] },
      { key: 'cr', label: t('parameters.labels.cr'), levels: ['product', 'component', 'material'] },
      { key: 'ccp', label: t('parameters.labels.ccp'), levels: ['product', 'component', 'material'] },
      { key: 'cfp', label: t('parameters.labels.cfp'), levels: ['product', 'component', 'material'] },
      { key: 'e_cp', label: t('parameters.labels.ecp'), levels: ['product', 'component', 'material'] },
      { key: 'fu', label: t('parameters.labels.fu'), levels: ['product', 'component', 'material'] },
      { key: 'fr', label: t('parameters.labels.fr'), levels: ['product', 'component', 'material'] },
      { key: 'e_fp', label: t('parameters.labels.efp'), levels: ['product', 'component', 'material'] },
      { key: 'e_ms', label: t('parameters.labels.ems'), levels: ['product', 'component', 'material'] },
      { key: 'e_rfp', label: t('parameters.labels.erfp'), levels: ['product', 'component', 'material'] },
    ],
    [t],
  );

  if (!product) {
    return (
      <Alert icon={<IconInfoCircle size={16} />}>
        {t('parameters.noProduct')}
      </Alert>
    );
  }

  const updateProductParam = (key: ParameterKey, value: number) => {
    setProduct({
      ...product,
      productParameters: {
        ...product.productParameters,
        [key]: value,
      },
    });
  };

  const updateComponentParam = (
    componentId: string,
    key: ParameterKey,
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
    setCalculationResult(calculatePci({ product, parameterLevels }));
    onCalculated();
  };

  const levelOptions = [
    { value: 'product', label: t('parameters.levels.product') },
    { value: 'component', label: t('parameters.levels.component') },
    { value: 'material', label: t('parameters.levels.material') },
  ];

  const getLevelForParam = (key: ParameterKey) => {
    const def = parameterDefs.find((p) => p.key === key);
    const desired = parameterLevels[key] ?? defaultParameterLevels[key];
    if (!def) return desired;
    return def.levels.includes(desired) ? desired : def.levels[0];
  };

  const paramsByLevel = (level: ParameterLevel) =>
    parameterDefs.filter((param) => getLevelForParam(param.key) === level);

  const renderLabel = (label: string) => (
    <Group gap={4} wrap="nowrap" align="center">
      <Text size="xs">{label}</Text>
      <Tooltip label={t('parameters.sourceTooltip')} withArrow>
        <ActionIcon variant="subtle" size="sm">
          <IconLink size={14} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );

  const getProductValue = (key: ParameterKey) =>
    (product.productParameters as Record<string, number | undefined>)?.[key] ??
    (defaultProductParameters as Record<string, number | undefined>)[key] ??
    0;

  type MaterialParamKey = keyof NonNullable<typeof product.components[number]['materials'][number]['materialParameters']>;
  const materialParamKeys: MaterialParamKey[] = ['fu', 'fr', 'cu', 'cr', 'ccp', 'cfp', 'e_fp', 'e_cp', 'e_ms', 'e_rfp'];

  const fractionKeys: ParameterKey[] = ['cu', 'cr', 'fu', 'fr', 'ccp', 'cfp', 'e_cp', 'e_fp', 'e_ms', 'e_rfp'];
  const maxFor = (key: ParameterKey) => (fractionKeys.includes(key) ? 1 : undefined);

  return (
    <Stack gap="md">
      {massBalanceWarnings.length > 0 && (
        <Alert color="yellow" icon={<IconAlertTriangle size={16} />}>
          <Text fw={600} mb={4}>
            {t('mapping.massBalanceWarningTitle')}
          </Text>
          <List size="sm" spacing={4}>
            {massBalanceWarnings.map((issue) => (
              <List.Item key={`${issue.componentId}-warning`}>
                {t('mapping.massBalanceWarningItem', {
                  component: issue.componentName,
                  declared: formatKg(issue.declaredMassKg),
                  materials: formatKg(issue.materialMassKg),
                  diff: formatDiff(issue.differenceKg),
                  tolerance: tolerancePercent.toFixed(0),
                })}
              </List.Item>
            ))}
          </List>
        </Alert>
      )}
      <Card withBorder shadow="sm">
        <Title order={4}>{t('parameters.title')}</Title>
        <Text size="sm" c="dimmed" mb="sm">
          {t('parameters.subtitle')}
        </Text>
        <Text size="sm" fw={600} mb="xs">
          {t('parameters.levelSelectionTitle')}
        </Text>
        <Text size="xs" c="dimmed" mb="sm">
          {t('parameters.levelSelectionHint')}
        </Text>
        <Stack gap="xs">
          {parameterDefs.map((param) => (
            <Group key={param.key} justify="space-between" align="center">
              <Text size="sm" fw={600}>
                {param.label}
              </Text>
              <Select
                data={levelOptions.filter((option) => param.levels.includes(option.value as ParameterLevel))}
                value={getLevelForParam(param.key)}
                onChange={(value) =>
                  value &&
                  setParameterLevels({
                    ...parameterLevels,
                    [param.key]: value as ParameterLevel,
                  })
                }
                maw={200}
              />
            </Group>
          ))}
        </Stack>
      </Card>

      {paramsByLevel('product').length > 0 && (
        <Card withBorder shadow="sm">
          <Group justify="space-between" align="center" mb="xs">
            <Title order={5}>{t('parameters.levels.product')}</Title>
            <Text size="xs" c="dimmed">
              {t('parameters.inheritanceHint')}
            </Text>
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xs">
            {paramsByLevel('product').map((param) => (
              <NumberInput
                key={`product-${param.key}`}
                label={renderLabel(param.label)}
                min={0}
                max={maxFor(param.key)}
                step={0.05}
                value={getProductValue(param.key)}
                onChange={(value) => updateProductParam(param.key, Number(value ?? 0))}
              />
            ))}
          </SimpleGrid>
        </Card>
      )}

      {product.components.map((component) => (
        <Card key={component.componentId} withBorder shadow="sm">
          <Group justify="space-between" mb="xs">
            <div>
              <Title order={5}>{component.componentName}</Title>
              <Text size="xs" c="dimmed">
                {t('parameters.componentUseFactors')}
              </Text>
            </div>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xs">
              {paramsByLevel('component').map((param) => (
                <NumberInput
                  key={`component-${component.componentId}-${param.key}`}
                  label={renderLabel(param.label)}
                  min={0}
                  max={maxFor(param.key)}
                  step={0.05}
                  value={(component.componentParameters as Record<string, number | undefined>)?.[param.key] ?? getProductValue(param.key)}
                  onChange={(value) => updateComponentParam(component.componentId, param.key, Number(value ?? 0))}
                />
              ))}
            </SimpleGrid>
          </Group>
          <Stack gap="sm" mt="sm">
            {component.materials.map((material) => (
              <Card key={material.materialId} withBorder shadow="xs" radius="md">
                <Title order={6}>{material.materialName}</Title>
                <Text size="xs" c="dimmed" mb="xs">
                  {t('parameters.materialRowHelper')}
                </Text>
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xs">
                  {paramsByLevel('material')
                    .filter((param) => materialParamKeys.includes(param.key as MaterialParamKey))
                    .map((param) => (
                    <NumberInput
                      key={`material-${material.materialId}-${param.key}`}
                      label={renderLabel(param.label)}
                      min={0}
                      max={maxFor(param.key)}
                      step={0.05}
                      value={(material.materialParameters as Record<string, number | undefined>)?.[param.key] ?? (component.componentParameters as Record<string, number | undefined>)?.[param.key] ?? getProductValue(param.key)}
                      onChange={(value) =>
                        updateMaterialParam(
                          component.componentId,
                          material.materialId,
                          param.key as MaterialParamKey,
                          Number(value ?? 0),
                        )
                      }
                    />
                  ))}
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
