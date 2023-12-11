"use client";

import {
  Bar,
  CartesianGrid,
  PieChart,
  Sector,
  Cell,
  ComposedChart,
  Legend,
  Line, LineChart, Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import React, { useCallback, useState } from "react";
import { formatCurrency } from "@/lib/formatter.ts";
import { AmountSummary } from "@/components/ui/amount-summary.tsx";

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

export interface PaymentOverview {
  index: number;
  name: string;
  total: number;
  budget: number;
  maxBudget: number;
}


const OverviewTooltip = ({ label, children }: { label: string, children: React.ReactNode }) => {
    return (
      <div>
        <div className="bg-slate-950 border border-slate-400 rounded-t-md">
          <p className="text-slate-300 rounded-t-md font-bold pb-2 bg-slate-800">
            {(label)}
          </p>
          <div className="p-2">
            {children}
          </div>
        </div>
      </div>
    );
};

const PaymentsOverviewTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
        <OverviewTooltip label={label} >
            <AmountSummary label="Total" amount={payload[0].value}></AmountSummary>
            <AmountSummary label="Budget" amount={payload[1].value} difference={payload[1].value - payload[0].value} color={payload[1].stroke} />
            <AmountSummary label="Max Budget" amount={payload[2].value} difference={payload[2].value - payload[0].value} color={payload[2].stroke}  />
        </OverviewTooltip>
    );
  }

  return null;
};

const OwnersOverviewTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
        <OverviewTooltip label={label} >
          {
            payload.map((entry: any, index: number) => (
              <AmountSummary key={index} label={entry.name} amount={entry.value ?? 0} color={entry.stroke} />
            ))
          }
        </OverviewTooltip>
    );
  }

  return null;
};

export function PaymentsOverview({ data, ...props }: { data: PaymentOverview[] }) {
  data.sort((a, b) => a.index - b.index);

  return (
    <ResponsiveContainer aspect={1.5} {...props}>
      <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
        {data && data.length > 0 && (<Legend />)}
        <Tooltip content={<PaymentsOverviewTooltip />} />
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

  const owners = data && data[0]
    ? Array.from(new Set(data.map((items) => items.owners).flatMap(obj => Object.keys(obj))))
    : [];

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
          {owners && owners.length > 0 &&(<Legend />)}
          <Tooltip content={<OwnersOverviewTooltip />} />
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

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${formatCurrency(value)}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export function ExpensesPieChart({ data }: { data: any[] | undefined }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_: any, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  return (
    <>
      {data &&
        <ResponsiveContainer maxHeight={270} aspect={1}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              // cy={150}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
            >
              {
                data.map((_: any, index) => <Cell key={`${index}-pie-cell`} fill={getRandomColor(index)} />)
              }
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      }
    </>
  );
}

