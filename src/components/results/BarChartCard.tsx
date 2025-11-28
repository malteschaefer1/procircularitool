import { Button, Card, Group, Text } from '@mantine/core';
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useMemo, useState } from 'react';
import { IconArrowsSort } from '@tabler/icons-react';

interface ChartDatum {
  name: string;
  value: number;
}

interface BarChartCardProps {
  title: string;
  data: ChartDatum[];
  color?: string;
  referenceValue?: number; // fraction 0–1
}

const ReferenceBadge = ({
  color,
  value,
  viewBox,
}: {
  color: string;
  value: string;
  viewBox?: { x?: number; y?: number; width?: number };
}) => {
  const width = 100;
  const height = 22;
  const x = (viewBox?.x ?? 0) + (viewBox?.width ?? 0) - width - 8;
  const y = (viewBox?.y ?? 0) - height - 4;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={width}
        height={height}
        rx={6}
        ry={6}
        fill="#fff"
        stroke={color}
        strokeWidth={1}
      />
      <text
        x={width / 2}
        y={height / 2 + 4}
        textAnchor="middle"
        fill={color}
        fontSize={12}
        fontWeight={700}
      >
        {value}
      </text>
    </g>
  );
};

const BarChartCard = ({ title, data, color = '#5c7cfa', referenceValue }: BarChartCardProps) => {
  const [sorted, setSorted] = useState(false);

  const displayData = useMemo(() => {
    if (!sorted) return data;
    return [...data].sort((a, b) => b.value - a.value);
  }, [data, sorted]);

  return (
    <Card withBorder shadow="sm" radius="md" p="sm">
      <Group justify="space-between" align="center" mb="xs">
        <Text fw={600} size="sm">
          {title}
        </Text>
        <Button
          variant="light"
          size="xs"
          leftSection={<IconArrowsSort size={14} />}
          onClick={() => setSorted((prev) => !prev)}
        >
          {sorted ? 'Reset order' : 'Sort high→low'}
        </Button>
      </Group>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={displayData} margin={{ top: 12, right: 16, left: 0, bottom: 12 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" hide />
            <YAxis domain={[0, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
            <Tooltip formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
            {typeof referenceValue === 'number' && (
              <ReferenceLine
                y={referenceValue}
                stroke={color}
                strokeDasharray="4 4"
                strokeWidth={3}
                label={<ReferenceBadge color={color} value="PCI overall" />}
                style={{
                  filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.9))',
                  strokeLinejoin: 'round',
                }}
                ifOverflow="extendDomain"
              />
            )}
            <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default BarChartCard;
