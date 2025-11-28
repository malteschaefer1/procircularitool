import { Card, Group, Progress, Text } from '@mantine/core';

const gradientColor = (value: number, reverse = false) => {
  const stops = [
    { pct: 0, color: '#e03131' },
    { pct: 25, color: '#f08c00' },
    { pct: 50, color: '#fcc419' },
    { pct: 75, color: '#94d82d' },
    { pct: 100, color: '#2b8a3e' },
  ];
  const pct = Math.min(Math.max(value, 0), 100);
  const adjusted = reverse ? 100 - pct : pct;
  let lower = stops[0];
  let upper = stops[stops.length - 1];
  for (let i = 0; i < stops.length; i += 1) {
    if (stops[i].pct <= adjusted) lower = stops[i];
    if (stops[i].pct >= adjusted) {
      upper = stops[i];
      break;
    }
  }
  if (lower.pct === upper.pct) return lower.color;
  const ratio = (adjusted - lower.pct) / (upper.pct - lower.pct);
  const lerp = (a: number, b: number) => Math.round(a + (b - a) * ratio);
  const lc = lower.color.match(/[0-9a-f]{2}/gi)?.map((c) => parseInt(c, 16)) ?? [0, 0, 0];
  const uc = upper.color.match(/[0-9a-f]{2}/gi)?.map((c) => parseInt(c, 16)) ?? [0, 0, 0];
  const [r, g, b] = [lerp(lc[0], uc[0]), lerp(lc[1], uc[1]) , lerp(lc[2], uc[2])];
  return `rgb(${r}, ${g}, ${b})`;
};

interface LinearIndicatorProps {
  value: number;
  label: string;
  description?: string;
  reverse?: boolean;
}

const LinearIndicator = ({ value, label, description, reverse = false }: LinearIndicatorProps) => {
  const pct = Math.min(Math.max(value * 100, 0), 100);
  const color = gradientColor(pct, reverse);

  return (
    <Card withBorder shadow="sm" radius="md" p="sm" style={{ height: '100%' }}>
      <Text size="sm" fw={600} mb="xs">
        {label}
      </Text>
      <Group align="center" mb="xs" gap="sm">
        <Progress
          value={pct}
          size="xl"
          radius="xl"
          w="100%"
          color={color}
        />
        <Text fw={700} size="md" miw={56} ta="right" style={{ color }}>
          {pct.toFixed(1)}%
        </Text>
      </Group>
      {description && (
        <Text size="xs" c="dimmed">
          {description}
        </Text>
      )}
    </Card>
  );
};

export default LinearIndicator;
