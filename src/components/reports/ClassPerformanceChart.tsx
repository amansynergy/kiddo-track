import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { Student } from "@/types/reporting";

interface ClassPerformanceChartProps {
  students: Student[];
}

export function ClassPerformanceChart({ students }: ClassPerformanceChartProps) {
  const chartData = students.map((student) => ({
    name: student.name.split(" ")[0],
    performance: student.overallPerformance,
  }));

  const getBarColor = (value: number) => {
    if (value >= 85) return "hsl(var(--success))";
    if (value >= 70) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Performance Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Legend />
            <Bar 
              dataKey="performance" 
              radius={[8, 8, 0, 0]}
              name="Performance (%)"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.performance)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
