import { RefObject, useMemo, useState } from 'react';
import {
  Alert,
  Card,
  Group,
  NumberInput,
  Progress,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { calculatePci } from '../../core/calculationEngine';
import { runSensitivityAnalysis } from '../../core/sensitivity';
import { CalculationResult } from '../../core/types';
import { useAppStore } from '../../store/useAppStore';
import GaugeChart from '../results/GaugeChart';

interface WhatIfPanelProps {
  baselineResult: CalculationResult | null;
  leverTableRef?: RefObject<HTMLDivElement | null>;
}

const WhatIfPanel = ({ baselineResult, leverTableRef }: WhatIfPanelProps) => {
  const { t } = useTranslation();
  const product = useAppStore((state) => state.product);
  const parameterLevels = useAppStore((state) => state.parameterLevels);
  const [wasteFraction, setWasteFraction] = useState(
    product?.productParameters?.productionWasteFraction ?? 0.05,
  );

  const scenarioResult = useMemo(() => {
    if (!product) return null;
    return calculatePci({
      product: {
        ...product,
        productParameters: {
          ...product.productParameters,
          productionWasteFraction: wasteFraction,
        },
      },
      parameterLevels,
    });
  }, [product, wasteFraction, parameterLevels]);

  const sensitivity = useMemo(() => {
    if (!product) return null;
    return runSensitivityAnalysis({ product, parameterLevels });
  }, [product, parameterLevels]);

  if (!product || !baselineResult) {
    return (
      <Alert icon={<IconInfoCircle size={16} />}>
        {t('whatIf.noData')}
      </Alert>
    );
  }

  const topLevers = sensitivity?.levers.slice(0, 5) ?? [];

  return (
    <Stack gap="md">
      <Card withBorder shadow="sm">
        <Group justify="space-between" align="flex-end">
          <div>
            <Title order={4}>{t('whatIf.title')}</Title>
            <Text size="sm" c="dimmed">
              {t('whatIf.subtitle')}
            </Text>
          </div>
          <NumberInput
            label={t('parameters.productionWaste')}
            value={wasteFraction}
            step={0.01}
            min={0}
            max={0.5}
            onChange={(value) => setWasteFraction(Number(value ?? 0))}
          />
        </Group>
        <Text size="sm" c="dimmed" mt="sm">
          {t('whatIf.helper')}
        </Text>
      </Card>

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <GaugeChart value={baselineResult.pciOverall} label={t('whatIf.baselineGauge')} />
        <GaugeChart value={scenarioResult?.pciOverall ?? 0} label={t('whatIf.adjustedGauge')} />
      </SimpleGrid>

      <Card withBorder shadow="sm">
        <Title order={5}>{t('whatIf.deltaTitle')}</Title>
        <Text size="sm" c="dimmed" mb="xs">
          {t('whatIf.deltaHint')}
        </Text>
        <Progress
          value={(scenarioResult?.pciOverall ?? 0) * 100}
          color={(scenarioResult?.pciOverall ?? 0) >= baselineResult.pciOverall ? 'teal' : 'orange'}
        />
        <Text mt="xs" fw={600}>
          {t('whatIf.deltaCopy', {
            baseline: (baselineResult.pciOverall * 100).toFixed(1),
            scenario: ((scenarioResult?.pciOverall ?? 0) * 100).toFixed(1),
          })}
        </Text>
      </Card>

      <Card withBorder shadow="sm" ref={leverTableRef}>
        <Group justify="space-between" align="center" mb="sm">
          <Title order={5}>{t('sensitivity.title')}</Title>
          <Text size="sm" c="dimmed">
            {t('sensitivity.subtitle')}
          </Text>
        </Group>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm" mb="md">
          {topLevers.map((lever) => (
            <Card key={lever.id} withBorder padding="sm">
              <Text fw={600} size="sm">
                {lever.label}
              </Text>
              <Text size="xs" c="dimmed">
                {t('sensitivity.leverDelta', {
                  from: (lever.baselinePci * 100).toFixed(1),
                  to: (lever.newPci * 100).toFixed(1),
                })}
              </Text>
              <Progress
                value={Math.min(100, (lever.newPci || 0) * 100)}
                color={lever.delta >= 0 ? 'teal' : 'orange'}
                mt="xs"
              />
            </Card>
          ))}
        </SimpleGrid>

        <Table striped highlightOnHover withRowBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('sensitivity.lever')}</Table.Th>
              <Table.Th>{t('sensitivity.baseline')}</Table.Th>
              <Table.Th>{t('sensitivity.changed')}</Table.Th>
              <Table.Th>{t('sensitivity.delta')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {(sensitivity?.levers ?? []).map((lever) => (
              <Table.Tr key={lever.id}>
                <Table.Td>{lever.label}</Table.Td>
                <Table.Td>{lever.baselineValue.toFixed(2)}</Table.Td>
                <Table.Td>{lever.changedValue.toFixed(2)}</Table.Td>
                <Table.Td>{(lever.delta * 100).toFixed(1)}%</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </Stack>
  );
};

export default WhatIfPanel;
