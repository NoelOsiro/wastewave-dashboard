"use client"
import React from "react";
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { DashboardCard } from "./DashboardCard";
import { cn } from "@/lib/utils";

type ChartType = "area" | "bar" | "pie" | "line";

interface ChartData {
  [key: string]: string | number;
}

interface DashboardChartProps {
  title: string;
  data: ChartData[];
  type?: ChartType;
  dataKeys: string[];
  colors?: string[];
  height?: number;
  className?: string;
  showLegend?: boolean;
  gridColor?: string;
  strokeWidth?: number;
}

export const DashboardChart: React.FC<DashboardChartProps> = ({
  title,
  data,
  type = "area",
  dataKeys,
  colors = ["#3aa945", "#60c56b", "#95dd9e", "#c2eec8"],
  height = 300,
  className,
  showLegend = false,
  gridColor = "var(--border)",
  strokeWidth = 2,
}) => {
  const renderChart = () => {
    switch (type) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                {dataKeys.map((key, index) => (
                  <linearGradient key={key} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" stroke={gridColor} vertical={false} />
              <XAxis 
                dataKey="name" 
                className="text-xs text-muted-foreground"
                tick={{ fill: 'currentColor' }}
                axisLine={{ stroke: gridColor }}
                tickLine={{ stroke: gridColor }}
              />
              <YAxis 
                className="text-xs text-muted-foreground"
                tick={{ fill: 'currentColor' }}
                axisLine={{ stroke: gridColor }}
                tickLine={{ stroke: gridColor }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--foreground)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              {showLegend && <Legend 
                wrapperStyle={{ paddingTop: 10 }}
                iconType="circle"
                fontSize={12}
              />}
              {dataKeys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  fill={`url(#color-${key})`}
                  stroke={colors[index % colors.length]}
                  fillOpacity={1}
                  strokeWidth={strokeWidth}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" stroke={gridColor} vertical={false} />
              <XAxis 
                dataKey="name" 
                className="text-xs text-muted-foreground"
                tick={{ fill: 'currentColor' }}
                axisLine={{ stroke: gridColor }}
                tickLine={{ stroke: gridColor }}
              />
              <YAxis 
                className="text-xs text-muted-foreground"
                tick={{ fill: 'currentColor' }}
                axisLine={{ stroke: gridColor }}
                tickLine={{ stroke: gridColor }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--foreground)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              {showLegend && <Legend 
                wrapperStyle={{ paddingTop: 10 }}
                iconType="circle"
                fontSize={12}
              />}
              {dataKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey={dataKeys[0]}
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--foreground)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              {showLegend && <Legend 
                wrapperStyle={{ paddingTop: 20 }}
                iconType="circle"
                fontSize={12}
              />}
            </PieChart>
          </ResponsiveContainer>
        );
        
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" stroke={gridColor} vertical={false} />
              <XAxis 
                dataKey="name" 
                className="text-xs text-muted-foreground"
                tick={{ fill: 'currentColor' }}
                axisLine={{ stroke: gridColor }}
                tickLine={{ stroke: gridColor }}
              />
              <YAxis 
                className="text-xs text-muted-foreground"
                tick={{ fill: 'currentColor' }}
                axisLine={{ stroke: gridColor }}
                tickLine={{ stroke: gridColor }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--foreground)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              {showLegend && <Legend 
                wrapperStyle={{ paddingTop: 10 }}
                iconType="circle"
                fontSize={12}
              />}
              {dataKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={strokeWidth}
                  dot={{ r: 4, fill: colors[index % colors.length] }}
                  activeDot={{ r: 6, fill: colors[index % colors.length] }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <DashboardCard title={title} className={className}>
      {renderChart()}
    </DashboardCard>
  );
};
