import { useMemo, useState } from 'react';
import { Alert, Button, Card, Grid, Group, Select, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { guessMappingFromColumns, mapRowsToProduct } from '../../core/bomMapping';
import { ColumnMapping } from '../../core/types';
import { useAppStore } from '../../store/useAppStore';

interface ColumnMappingProps {
  onProceed: () => void;
}

const ColumnMappingStep = ({ onProceed }: ColumnMappingProps) => {
  const { t } = useTranslation();
  const { rawRows, mapping, setMapping, setProduct, setCalculationResult, productName, setProductName } =
    useAppStore();
  const [localMapping, setLocalMapping] = useState<ColumnMapping | null>(mapping);

  const columns = useMemo(() => (rawRows.length > 0 ? Object.keys(rawRows[0]) : []), [rawRows]);
  const activeMapping = localMapping ?? (columns.length > 0 ? guessMappingFromColumns(columns) : null);

  const updateMappingField = (field: keyof ColumnMapping, value: string | null) => {
    setLocalMapping((prev) => ({ ...(prev ?? ({} as ColumnMapping)), [field]: value ?? undefined }));
  };

  const applyMapping = () => {
    if (!activeMapping) return;
    const product = mapRowsToProduct(rawRows, activeMapping, productName || 'Custom product');
    setMapping(activeMapping);
    setProduct(product);
    setCalculationResult(null);
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

  return (
    <Stack gap="md">
      <Card withBorder shadow="sm">
        <Group justify="space-between" align="center" mb="sm">
          <div>
            <Title order={4}>{t('mapping.title')}</Title>
            <Text size="sm" c="dimmed">
              {t('mapping.subtitle')}
            </Text>
          </div>
          <TextInput
            label={t('fields.productName')}
            value={productName}
            onChange={(event) => setProductName(event.currentTarget.value)}
            maw={280}
          />
        </Group>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label={t('fields.componentName')}
              data={options}
              value={activeMapping?.componentName ?? null}
              onChange={(value) => updateMappingField('componentName', value)}
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
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label={t('fields.materialName')}
              data={options}
              value={activeMapping?.materialName ?? null}
              onChange={(value) => updateMappingField('materialName', value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label={t('fields.materialQuantity')}
              data={options}
              value={activeMapping?.materialQuantity ?? null}
              onChange={(value) => updateMappingField('materialQuantity', value)}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label={t('fields.materialUnit')}
              data={options}
              value={activeMapping?.materialUnit ?? null}
              onChange={(value) => updateMappingField('materialUnit', value)}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label={t('fields.materialMass')}
              data={options}
              value={activeMapping?.materialMass ?? null}
              onChange={(value) => updateMappingField('materialMass', value)}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label={t('fields.recycledContent')}
              data={options}
              value={activeMapping?.recycledContent ?? null}
              onChange={(value) => updateMappingField('recycledContent', value)}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label={t('fields.recyclability')}
              data={options}
              value={activeMapping?.recyclability ?? null}
              onChange={(value) => updateMappingField('recyclability', value)}
              clearable
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
