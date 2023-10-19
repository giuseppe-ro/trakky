"use client";

import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface Summary {
  index: number;
  name: string;
  total: number;
  budget: number;
  maxBudget: number;
}

export function Overview({ data, ...props }: { data: Summary[] }) {
  data.sort((a, b) => a.index - b.index);

  return (
    <ResponsiveContainer width="100%" height={343} {...props}>
      <ComposedChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={true}
          axisLine={true}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={true}
          axisLine={true}
          tickFormatter={(value) => `£${value}`}
        />
        <CartesianGrid strokeDasharray="4 4 4" stroke="white" opacity={0.15} />
        <Legend />
        <Tooltip
          labelStyle={{ color: "rgb(100 116 139)", fontWeight: "bolder" }}
          contentStyle={{ backgroundColor: "#0f172a" }}
        />
        <Bar name="Total" dataKey="total" fill="white">
          {data.map((entry, index) => (
            <Cell
              cursor="pointer"
              fill={
                entry.total < entry.budget
                  ? "#54ff5a"
                  : entry.total < entry.maxBudget
                  ? "#fffc54"
                  : "#ff5454"
              }
              key={`cell-${index}`}
            />
          ))}
        </Bar>
        <Line
          name="Budget"
          type={"monotone"}
          dataKey="budget"
          stroke="#54ff5a"
        />
        <Line
          name="Wages"
          type={"monotone"}
          dataKey="maxBudget"
          stroke="#ff5454"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
