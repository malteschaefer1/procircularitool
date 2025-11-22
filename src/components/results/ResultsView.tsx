import {
  Alert,
  Card,
  Grid,
  Group,
  List,
  Progress,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculationResult } from '../../core/types';
import { formatMass } from '../../core/units';
import BarChartCard from './BarChartCard';
import GaugeChart from './GaugeChart';

interface ResultsViewProps {
  result: CalculationResult | null;
  containerRef?: RefObject<HTMLDivElement | null>;
}

const ResultsView = ({ result, containerRef }: ResultsViewProps) => {
  const { t } = useTranslation();

  if (!result) {
    return (
      <Alert icon={<IconInfoCircle size={16} />}>
        {t('results.noResult')}
      </Alert>
    );
  }

  const componentChartData = result.pciByComponent.map((item) => ({
    name: item.componentName,
    value: item.pci,
  }));

  const materialChartData = result.pciByMaterial.map((item) => ({
    name: item.materialName,
    value: item.pci,
  }));

  const totalMass = result.totalProductMassKg || 1;
  const virginShare = Math.max(0, Math.min(100, (result.totalVirginMassKg / totalMass) * 100));
  const wasteShare = Math.max(0, Math.min(100, (result.totalWasteMassKg / totalMass) * 100));
  const recycledShare = Math.max(0, Math.min(100, 100 - virginShare - wasteShare));
  const virginMass = result.totalVirginMassKg || 0;
  const wasteMass = result.totalWasteMassKg || 0;

  return (
    <Stack gap="md" ref={containerRef}>
      <Title order={4}>{t('results.title')}</Title>
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <GaugeChart value={result.pciOverall} label={t('results.overallPci')} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
            <Card withBorder>
              <Text size="sm" c="dimmed">
                {t('results.totalMass')}
              </Text>
              <Text fw={700}>{formatMass(result.totalProductMassKg)}</Text>
            </Card>
            <Card withBorder>
              <Text size="sm" c="dimmed">
                {t('results.totalWaste')}
              </Text>
              <Text fw={700}>{formatMass(wasteMass)}</Text>
            </Card>
            <Card withBorder>
              <Text size="sm" c="dimmed">
                {t('results.totalVirgin')}
              </Text>
              <Text fw={700}>{formatMass(virginMass)}</Text>
            </Card>
          </SimpleGrid>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <BarChartCard title={t('results.componentPci')} data={componentChartData} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <BarChartCard title={t('results.materialPci')} data={materialChartData} color="#12b886" />
        </Grid.Col>
      </Grid>

      <Card withBorder shadow="sm">
        <Title order={5}>{t('results.flowPlaceholder')}</Title>
        <Text size="sm" c="dimmed" mb="xs">
          {t('results.flowHint')}
        </Text>
        <Progress.Root size="lg">
          <Progress.Section value={recycledShare} color="teal" />
          <Progress.Section value={virginShare} color="blue" />
          <Progress.Section value={wasteShare} color="orange" />
        </Progress.Root>
        <Group gap="sm" mt="xs">
          <Text size="xs">{t('results.recycledLabel')}: {recycledShare.toFixed(1)}%</Text>
          <Text size="xs">{t('results.virginLabel')}: {virginShare.toFixed(1)}%</Text>
          <Text size="xs">{t('results.wasteLabel')}: {wasteShare.toFixed(1)}%</Text>
        </Group>
        <Text size="xs" c="dimmed" mt="xs">
          {t('results.flowTodo')}
        </Text>
      </Card>

      <Card withBorder shadow="sm">
        <Title order={5}>{t('results.lfi')}</Title>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="sm">
          <Card withBorder>
            <Text size="sm" c="dimmed">
              {t('results.lfiOverall')}
            </Text>
            <Text fw={700}>{(result.lfiOverall * 100).toFixed(1)}%</Text>
          </Card>
          <Card withBorder>
            <Text size="sm" c="dimmed">
              {t('results.lfiComponent')}
            </Text>
            {result.lfiByComponent.map((c) => (
              <Text key={c.componentId} size="sm">
                {c.componentName}: {(c.lfi * 100).toFixed(1)}%
              </Text>
            ))}
          </Card>
          <Card withBorder>
            <Text size="sm" c="dimmed">
              {t('results.lfiMaterial')}
            </Text>
            {result.lfiByMaterial.map((m) => (
              <Text key={m.materialId} size="sm">
                {m.materialName}: {(m.lfi * 100).toFixed(1)}%
              </Text>
            ))}
          </Card>
        </SimpleGrid>
      </Card>

      <Card withBorder shadow="sm">
        <Title order={5}>{t('results.componentTable')}</Title>
        <Table striped withRowBorders highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('fields.component')}</Table.Th>
              <Table.Th>{t('results.mass')}</Table.Th>
              <Table.Th>{t('results.pci')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {result.pciByComponent.map((component) => (
              <Table.Tr key={component.componentId}>
                <Table.Td>{component.componentName}</Table.Td>
                <Table.Td>{formatMass(component.massKg)}</Table.Td>
                <Table.Td>{(component.pci * 100).toFixed(1)}%</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <Card withBorder shadow="sm">
        <Title order={5}>{t('results.materialTable')}</Title>
        <Table striped withRowBorders highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('fields.material')}</Table.Th>
              <Table.Th>{t('results.mass')}</Table.Th>
              <Table.Th>{t('results.pci')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {result.pciByMaterial.map((material) => (
              <Table.Tr key={material.materialId}>
                <Table.Td>{material.materialName}</Table.Td>
                <Table.Td>{formatMass(material.massKg)}</Table.Td>
                <Table.Td>{(material.pci * 100).toFixed(1)}%</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      {result.notes && (
        <Card withBorder>
          <Title order={5}>{t('results.notes')}</Title>
          <List size="sm" spacing="xs" mt="xs">
            {result.notes.map((note) => (
              <List.Item key={note}>{note}</List.Item>
            ))}
          </List>
        </Card>
      )}
    </Stack>
  );
};

export default ResultsView;
