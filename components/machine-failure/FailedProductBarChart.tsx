"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ChartDataPoint } from "@/lib/types";

const BAR_COLOR = "#5AA454";
const CHART_HEIGHT = 400;

interface FailedProductBarChartProps {
  data: ChartDataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export default function FailedProductBarChart({
  data,
  xAxisLabel = "Batch Index",
  yAxisLabel = "Failed Product Count",
}: FailedProductBarChartProps) {
  return (
    <div className="h-[400px] w-full min-h-[300px]">
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "currentColor" }}
            label={{
              value: xAxisLabel,
              position: "insideBottom",
              offset: -10,
              fontSize: 12,
            }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "currentColor" }}
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fontSize: 12 },
            }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid var(--border)",
            }}
            formatter={(value: number) => [value, "Failed count"]}
            labelFormatter={(label) => String(label)}
          />
          <Bar dataKey="value" fill={BAR_COLOR} name="Failed count" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
