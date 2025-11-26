import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  FileInput,
  Group,
  NumberInput,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { washingMachineSample, guardLockSwitchSample } from '../../data/sampleBoms';
import { parseBomFile } from '../../core/parsers';
import { RawBomRow } from '../../core/types';
import { useAppStore } from '../../store/useAppStore';
import { defaultParameterLevels } from '../../data/defaultParameters';

interface UploadSectionProps {
  onProceed: () => void;
}

const deriveProductName = (file: File | null) => {
  if (!file?.name) return 'Custom product';
  const withoutExt = file.name.replace(/\.[^.]+$/, '');
  return withoutExt || 'Custom product';
};

const columnsForPreview = [
  'component_id',
  'component_name',
  'component_mass_kg',
  'component_quantity',
  'material_type',
  'material_mass_per_component_kg',
];

const ManualEntryTable = ({ onSave }: { onSave: (rows: RawBomRow[]) => void }) => {
  const { t } = useTranslation();
  const [manualRows, setManualRows] = useState<RawBomRow[]>([
    {
      component_id: 'component-1',
      component_name: 'Custom component',
      component_quantity: 1,
      component_mass_kg: 1,
      material_type: 'Custom material',
      material_mass_per_component_kg: 1,
    },
  ]);

  const updateRow = (index: number, key: string, value: string | number) => {
    setManualRows((rows) => rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  };

  const addRow = () => {
    setManualRows((rows) => [
      ...rows,
      {
        component_id: `component-${rows.length + 1}`,
        component_name: `Component ${rows.length + 1}`,
        component_quantity: 1,
        component_mass_kg: 1,
        material_type: `Material ${rows.length + 1}`,
        material_mass_per_component_kg: 1,
      },
    ]);
  };

  return (
    <Card withBorder shadow="sm">
      <Group justify="space-between" align="center" mb="sm">
        <div>
          <Title order={5}>{t('upload.manualEntry')}</Title>
          <Text size="sm" c="dimmed">
            {t('upload.manualEntryHint')}
          </Text>
        </div>
        <Button variant="light" onClick={addRow} size="xs">
          {t('upload.addRow')}
        </Button>
      </Group>
      <Stack gap="xs">
        {manualRows.map((row, index) => (
          <Group key={`manual-row-${index}`} align="flex-end" wrap="wrap" gap="xs">
            <TextInput
              label={t('fields.componentId')}
              value={(row.component_id as string) || ''}
              onChange={(event) => updateRow(index, 'component_id', event.currentTarget.value)}
            />
            <NumberInput
              label={t('fields.componentQuantity')}
              value={Number(row.component_quantity) || 1}
              min={0}
              step={1}
              onChange={(value) => updateRow(index, 'component_quantity', Number(value ?? 1))}
            />
            <TextInput
              label={t('fields.componentName')}
              value={(row.component_name as string) || ''}
              onChange={(event) => updateRow(index, 'component_name', event.currentTarget.value)}
            />
            <NumberInput
              label={t('fields.componentMass')}
              value={Number(row.component_mass_kg) || undefined}
              min={0}
              step={0.1}
              onChange={(value) => updateRow(index, 'component_mass_kg', Number(value ?? 0))}
            />
            <TextInput
              label={t('fields.materialType')}
              value={(row.material_type as string) || ''}
              onChange={(event) => updateRow(index, 'material_type', event.currentTarget.value)}
            />
            <NumberInput
              label={t('fields.materialMassPerComponent')}
              value={Number(row.material_mass_per_component_kg) || 0}
              min={0}
              step={0.1}
              onChange={(value) => updateRow(index, 'material_mass_per_component_kg', Number(value ?? 0))}
            />
          </Group>
        ))}
        <Group justify="flex-end">
          <Button size="sm" onClick={() => onSave(manualRows)}>
            {t('actions.useManualData')}
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

const UploadSection = ({ onProceed }: UploadSectionProps) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    setRawRows,
    setMapping,
    setProduct,
    setCalculationResult,
    setProductName,
    setMassBalanceWarnings,
    setParameterLevels,
  } = useAppStore();

  const previewRows = (rows: RawBomRow[]) => rows.slice(0, 5);

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    try {
      const parsed = await parseBomFile(selectedFile);
      setRawRows(parsed);
      setMapping(null);
      setProduct(null);
      setCalculationResult(null);
      setMassBalanceWarnings([]);
      setParameterLevels({ ...defaultParameterLevels });
      setProductName(deriveProductName(selectedFile));
      setError(null);
      onProceed();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const loadSample = (rows: RawBomRow[], name: string) => {
    setRawRows(rows);
    setMapping(null);
    setProduct(null);
    setCalculationResult(null);
    setMassBalanceWarnings([]);
    setParameterLevels({ ...defaultParameterLevels });
    setProductName(name);
    onProceed();
  };

  const hasRows = useAppStore((state) => state.rawRows.length > 0);
  const rawRows = useAppStore((state) => state.rawRows);

  return (
    <Stack gap="md">
      <Card withBorder shadow="sm">
        <Group justify="space-between" align="center" mb="sm">
          <div>
            <Title order={4}>{t('upload.title')}</Title>
            <Text size="sm" c="dimmed">
              {t('upload.subtitle')}
            </Text>
          </div>
          <Group gap="xs">
            <Button
              variant="light"
              data-testid="load-sample-wash"
              onClick={() => loadSample(washingMachineSample, 'Washing machine')}
            >
              {t('upload.washingMachine')}
            </Button>
            <Button
              variant="light"
              data-testid="load-sample-guard"
              onClick={() => loadSample(guardLockSwitchSample, 'Guard lock switch')}
            >
              {t('upload.guardLock')}
            </Button>
          </Group>
        </Group>
        <Group align="flex-end" gap="md" wrap="wrap">
          <FileInput
            label={t('upload.chooseFile')}
            placeholder={t('upload.placeholder')}
            accept=".csv,.xlsx"
            value={selectedFile}
            onChange={(file) => setSelectedFile(file)}
            maw={400}
          />
          <Button onClick={handleFileUpload} disabled={!selectedFile}>
            {t('upload.uploadCta')}
          </Button>
          <Text c="dimmed" size="sm">
            {t('upload.privacyNotice')}
          </Text>
        </Group>
        {error && (
          <Alert icon={<IconInfoCircle size={16} />} color="red" mt="sm">
            {error}
          </Alert>
        )}
      </Card>

      <ManualEntryTable onSave={(rows) => loadSample(rows, 'Custom product')} />

      {hasRows && (
        <Card withBorder shadow="xs">
          <Title order={5}>{t('upload.preview')}</Title>
          <Text size="sm" c="dimmed" mb="xs">
            {t('upload.previewHint')}
          </Text>
          <Table striped highlightOnHover withRowBorders>
            <Table.Thead>
              <Table.Tr>
                {columnsForPreview.map((col) => (
                  <Table.Th key={col}>{col}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {previewRows(rawRows).map((row, rowIndex) => (
                <Table.Tr key={`preview-${rowIndex}`}>
                  {columnsForPreview.map((col) => {
                    const value = (row as Record<string, unknown>)[col];
                    return <Table.Td key={`${rowIndex}-${col}`}>{value ?? '–'}</Table.Td>;
                  })}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      )}

      <Group justify="flex-end">
        <Button onClick={onProceed} disabled={!hasRows} data-testid="upload-next">
          {t('actions.next')}
        </Button>
      </Group>
    </Stack>
  );
};

export default UploadSection;
