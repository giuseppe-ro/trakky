"use client";

import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line, LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export interface PaymentOverview {
  index: number;
  name: string;
  total: number;
  budget: number;
  maxBudget: number;
}

export function PaymentsOverview({ data, ...props }: { data: PaymentOverview[] }) {
  data.sort((a, b) => a.index - b.index);

  return (
    <ResponsiveContainer aspect={1.5} {...props}>
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
          name="Max Budget"
          type={"monotone"}
          dataKey="maxBudget"
          stroke="#ff5454"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}


export interface OwnerOverview {
  index: number;
  name: string;
  owners: { [key: string]: number };
}
export function OwnersOverview({ data, ...props }: { data: OwnerOverview[] }) {
  data.sort((a, b) => a.index - b.index);

  const owners = data && data[0] ? Object.keys(data[0].owners) : [];

  const colors = [
    '#00C90F',
    '#0088FE',
    '#FF8042',
    '#FFBB28',
    '#8884d8',
    '#FF00FF',
    '#FF1042',
    '#00C49F'
  ];

  const getRandomColor = (index: number) => {
    if (index < colors.length) {
      return colors[index];
    }
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors.splice(randomIndex, 1)[0];
  };

  return (
    <>
      <ResponsiveContainer aspect={1.5} {...props}>
        <LineChart data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          title="Text">
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

          {owners && owners.length > 0 && owners.map((user: any, index: number) => (
            <Line
              key={index}
              name={user}
              type={"monotone"}
              dataKey={(entry) => entry.owners[user]}
              stroke={getRandomColor(index)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
