import { Card, Text } from '@mantine/core';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ChartDatum {
  name: string;
  value: number;
}

interface BarChartCardProps {
  title: string;
  data: ChartDatum[];
  color?: string;
}

const BarChartCard = ({ title, data, color = '#5c7cfa' }: BarChartCardProps) => (
  <Card withBorder shadow="sm" radius="md" p="sm">
    <Text fw={600} size="sm" mb="xs">
      {title}
    </Text>
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" hide />
          <YAxis domain={[0, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
          <Tooltip formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
          <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

export default BarChartCard;
