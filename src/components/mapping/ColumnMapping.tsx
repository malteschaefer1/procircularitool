import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Grid,
  Group,
  List,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { guessMappingFromColumns, mapRowsToProduct, MASS_TOLERANCE, validateComponentMassBalance } from '../../core/bomMapping';
import { ColumnMapping, MassBalanceIssue } from '../../core/types';
import { applyGuardLockSwitchPresets } from '../../data/guardLockSwitchPresets';
import { useAppStore } from '../../store/useAppStore';

interface ColumnMappingProps {
  onProceed: () => void;
}

const ColumnMappingStep = ({ onProceed }: ColumnMappingProps) => {
  const { t } = useTranslation();
  const {
    rawRows,
    mapping,
    setMapping,
    setProduct,
    setCalculationResult,
    productName,
    setProductName,
    setMassBalanceWarnings,
    setParameterLevels,
  } = useAppStore();
  const columns = useMemo(() => (rawRows.length > 0 ? Object.keys(rawRows[0]) : []), [rawRows]);
  const guessedMapping = useMemo(
    () => (columns.length > 0 ? guessMappingFromColumns(columns) : null),
    [columns],
  );
  const [localMapping, setLocalMapping] = useState<ColumnMapping | null>(mapping ?? guessedMapping);
  const [validationErrors, setValidationErrors] = useState<MassBalanceIssue[]>([]);
  const tolerancePercent = MASS_TOLERANCE * 100;

  useEffect(() => {
    if (mapping) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalMapping(mapping);
      return;
    }
    if (guessedMapping) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalMapping(guessedMapping);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalMapping(null);
    }
  }, [mapping, guessedMapping, rawRows]);

  useEffect(() => {
    setValidationErrors([]);
  }, [rawRows]);

  const activeMapping = localMapping ?? guessedMapping;

  const updateMappingField = (field: keyof ColumnMapping, value: string | null) => {
    setLocalMapping((prev) => ({
      ...(prev ?? activeMapping ?? ({} as ColumnMapping)),
      [field]: value ?? undefined,
    }));
  };

  const applyMapping = () => {
    if (!activeMapping) return;
    const effectiveName = productName.trim() || 'Custom product';
    let product = mapRowsToProduct(rawRows, activeMapping, effectiveName);
    const { product: presetProduct, parameterLevels } = applyGuardLockSwitchPresets(product, effectiveName);
    product = presetProduct;
    if (parameterLevels) setParameterLevels(parameterLevels);
    setCalculationResult(null);
    const { errors, warnings } = validateComponentMassBalance(product.components);

    if (errors.length > 0) {
      setValidationErrors(errors);
      setMassBalanceWarnings(warnings);
      return;
    }

    setValidationErrors([]);
    setMassBalanceWarnings(warnings);
    setMapping(activeMapping);
    setProduct(product);
    onProceed();
  };

  if (rawRows.length === 0) {
    return (
      <Alert icon={<IconInfoCircle size={16} />}>
        {t('mapping.noRows')}
      </Alert>
    );
  }

  const options = columns.map((c) => ({ value: c, label: c }));
  const formatKg = (value?: number) => (value === undefined ? '–' : `${value.toFixed(2)} kg`);
  const formatDiff = (value?: number) =>
    value === undefined ? '–' : `${value > 0 ? '+' : ''}${value.toFixed(2)} kg`;

  return (
    <Stack gap="md">
      <Card withBorder shadow="sm">
        <Group justify="space-between" align="center" mb="sm">
          <div>
            <Title order={4}>{t('mapping.title')}</Title>
            <Text size="sm" c="dimmed">
              {t('mapping.subtitle')}
            </Text>
            <Text size="xs" c="dimmed">
              {t('mapping.recommendedHeaders')}
            </Text>
          </div>
          <TextInput
            label={t('fields.productName')}
            value={productName}
            onChange={(event) => setProductName(event.currentTarget.value)}
            maw={280}
          />
        </Group>
        {validationErrors.length > 0 && (
          <Alert color="red" icon={<IconAlertTriangle size={16} />} mb="sm">
            <Text fw={600} mb={4}>
              {t('mapping.massBalanceErrorTitle')}
            </Text>
            <List size="sm" spacing={4}>
              {validationErrors.map((issue) => (
                <List.Item key={issue.componentId}>
                  {t('mapping.massBalanceErrorItem', {
                    component: issue.componentName,
                    declared: formatKg(issue.declaredMassKg),
                    materials: formatKg(issue.materialMassKg),
                    diff: formatDiff(issue.differenceKg),
                  })}
                </List.Item>
              ))}
            </List>
            <Text size="xs" mt={6}>
              {t('mapping.massBalanceErrorHint', { tolerance: tolerancePercent.toFixed(0) })}
            </Text>
          </Alert>
        )}
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label={t('fields.componentId')}
              data={options}
              value={activeMapping?.componentId ?? null}
              onChange={(value) => updateMappingField('componentId', value)}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label={t('fields.componentName')}
              data={options}
              value={activeMapping?.componentName ?? null}
              onChange={(value) => updateMappingField('componentName', value)}
              required
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label={t('fields.componentQuantity')}
              data={options}
              value={activeMapping?.componentQuantity ?? null}
              onChange={(value) => updateMappingField('componentQuantity', value)}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label={t('fields.componentMass')}
              data={options}
              value={activeMapping?.componentMass ?? null}
              onChange={(value) => updateMappingField('componentMass', value)}
              required
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label={t('fields.materialType')}
              data={options}
              value={activeMapping?.materialType ?? null}
              onChange={(value) => updateMappingField('materialType', value)}
              required
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label={t('fields.materialMassPerComponent')}
              data={options}
              value={activeMapping?.materialMassPerComponent ?? null}
              onChange={(value) => updateMappingField('materialMassPerComponent', value)}
              required
            />
          </Grid.Col>
        </Grid>
        <Group justify="flex-end" mt="md">
          <Button onClick={applyMapping} data-testid="mapping-apply">
            {t('mapping.apply')}
          </Button>
        </Group>
      </Card>
    </Stack>
  );
};

export default ColumnMappingStep;
