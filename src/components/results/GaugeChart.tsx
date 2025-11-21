import { Card, Text } from '@mantine/core';
import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';

interface GaugeChartProps {
  value: number;
  label: string;
}

const GaugeChart = ({ value, label }: GaugeChartProps) => {
  const percent = Math.min(Math.max(value * 100, 0), 100);
  const data = [{ name: label, value: percent, fill: '#5c7cfa' }];

  return (
    <Card withBorder shadow="sm" radius="md" p="sm">
      <Text size="sm" fw={600} mb="xs">
        {label}
      </Text>
      <RadialBarChart
        width={260}
        height={160}
        cx={130}
        cy={140}
        innerRadius={70}
        outerRadius={120}
        barSize={14}
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar dataKey="value" cornerRadius={8} />
        <text x={130} y={140} textAnchor="middle" dominantBaseline="middle" fontSize={22} fontWeight={700}>
          {percent.toFixed(0)}%
        </text>
      </RadialBarChart>
    </Card>
  );
};

export default GaugeChart;
