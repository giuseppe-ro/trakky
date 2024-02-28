'use client';

import {
  Bar,
  CartesianGrid,
  PieChart,
  Sector,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import React, { useCallback, useState } from 'react';
import { formatCurrency } from '@/lib/formatter';
import Checkbox from '@/components/ui/checkbox';
import { StorageKey } from '@/constants';
import { OwnerOverview } from '@/models/owner-overview';
import { PaymentOverview } from '@/models/payment-overview';
import AmountSummary from './amount-summary';

const colors = [
  '#0bb4ff',
  '#50e991',
  '#e6d800',
  '#9b19f5',
  '#ffa300',
  '#dc0ab4',
  '#b3d4ff',
  '#00bfa0',
];

const getRandomColor = (index: number) => {
  if (index < colors.length) {
    return colors[index];
  }
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors.splice(randomIndex, 1)[0];
};

function OverviewTooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="bg-slate-950 border border-slate-400 rounded-t-md">
        <p className="text-slate-300 rounded-t-md font-bold pb-2 bg-slate-800">
          {label}
        </p>
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
}

function PaymentsOverviewTooltip({
  active,
  payload,
  label,
}: {
  active: boolean;
  payload: { name: string; value: number; stroke: string }[];
  label: string;
}) {
  if (active && payload && payload.length) {
    return (
      <OverviewTooltip label={label}>
        <AmountSummary label="Total" amount={payload[0].value} />
        {payload[2]?.value && (
          <AmountSummary
            label={payload[2].name}
            amount={payload[2].value}
            difference={payload[2].value - payload[0].value}
            color={payload[2]?.stroke}
          />
        )}
        {payload[1]?.value && (
          <AmountSummary
            label={payload[1].name}
            amount={payload[1].value}
            difference={payload[1].value - payload[0].value}
            color={payload[1]?.stroke}
          />
        )}
      </OverviewTooltip>
    );
  }

  return null;
}

function OwnersOverviewTooltip({
  active,
  payload,
  label,
}: {
  active: boolean;
  payload: { name: string; value: number | null; stroke: string }[];
  label: string;
}) {
  if (active && payload && payload.length) {
    return (
      <OverviewTooltip label={label}>
        {payload.map(
          (entry: { name: string; value: number | null; stroke: string }) => (
            <AmountSummary
              key={entry.name}
              label={entry.name}
              amount={entry.value ?? 0}
              color={entry.stroke}
            />
          )
        )}
      </OverviewTooltip>
    );
  }

  return null;
}

export function ExpensesDashboard({ data }: { data: PaymentOverview[] }) {
  const isMaxBudgetLineSet = JSON.parse(
    localStorage.getItem(StorageKey.ShowMaxBudget) || 'true'
  );
  const [maxBudgetsLine, setMaxBudgetsLine] =
    useState<boolean>(isMaxBudgetLineSet);

  const isBudgetLineSet = JSON.parse(
    localStorage.getItem(StorageKey.ShowBudget) || 'true'
  );
  const [budgetsLine, setBudgetsLine] = useState<boolean>(isBudgetLineSet);

  data.sort((a, b) => a.index - b.index);

  const onBudgetsCheckBoxClick = () => {
    localStorage.setItem(StorageKey.ShowBudget, String(!budgetsLine));
    setBudgetsLine(!budgetsLine);
  };

  const onMaxBudgetsCheckBoxClick = () => {
    localStorage.setItem(StorageKey.ShowMaxBudget, String(!maxBudgetsLine));
    setMaxBudgetsLine(!maxBudgetsLine);
  };

  const getColor = (totalAmount: number, budget: number, maxBudget: number) => {
    let color;
    if (totalAmount < budget) {
      color = '#54ff5a';
    } else if (totalAmount < maxBudget) {
      color = '#e6d800';
    } else {
      color = '#ff5454';
    }

    return color;
  };

  return (
    <>
      <div className="flex items-center justify-center space-x-2">
        <Checkbox
          disabled={data.length === 0}
          id="budgets"
          checked={budgetsLine}
          onClick={onBudgetsCheckBoxClick}
        />
        <p
          className="text-sm text-muted-foreground leading-none peer-disabled:opacity-70"
          aria-label="budgetd"
        >
          Budgets
        </p>
        <Checkbox
          disabled={data.length === 0}
          id="maxBudgets"
          checked={maxBudgetsLine}
          onClick={onMaxBudgetsCheckBoxClick}
        />
        <p className="text-sm text-muted-foreground leading-none peer-disabled:opacity-70">
          Max Budgets
        </p>
      </div>
      <ResponsiveContainer maxHeight={280} aspect={1.5}>
        <ComposedChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine
            axisLine
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine
            axisLine
            tickFormatter={(value) => `£${value}`}
          />
          <CartesianGrid
            strokeDasharray="4 4 4"
            stroke="white"
            opacity={0.15}
          />
          {data && data.length > 0 && <Legend />}
          <Tooltip
            content={
              <PaymentsOverviewTooltip active={false} payload={[]} label="" />
            }
          />
          <Bar name="Total" dataKey="total" fill="white">
            {data.map((entry) => (
              <Cell
                className="backdrop-blur-lg"
                cursor="pointer"
                fill={getColor(entry.total, entry.budget, entry.maxBudget)}
                key={`cell-${entry.total}`}
              />
            ))}
          </Bar>
          {maxBudgetsLine && (
            <Line
              name="Max Budget"
              type="monotone"
              dataKey="maxBudget"
              stroke="#ff5454"
            />
          )}
          {budgetsLine && (
            <Line
              name="Budget"
              type="monotone"
              dataKey="budget"
              stroke="#50e991"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
}

export function UsersDashboard({ data }: { data: OwnerOverview[] }) {
  data.sort((a, b) => a.index - b.index);

  const owners =
    data && data[0]
      ? Array.from(
          new Set(
            data.map((items) => items.owners).flatMap((obj) => Object.keys(obj))
          )
        )
      : [];

  return (
    <ResponsiveContainer maxHeight={280} aspect={1.5}>
      <LineChart
        data={data}
        title="Text"
        data-testid="linechart"
        height={100}
        width={100}
      >
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine
          axisLine
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine
          axisLine
          tickFormatter={(value) => `£${value}`}
        />
        <CartesianGrid strokeDasharray="4 4 4" stroke="white" opacity={0.15} />
        {owners && owners.length > 0 && <Legend />}
        <Tooltip
          content={
            <OwnersOverviewTooltip active={false} payload={[]} label="" />
          }
        />
        {owners &&
          owners.length > 0 &&
          owners.map((user: string, index: number) => (
            <Line
              key={user}
              name={user}
              type="monotone"
              dataKey={(entry) => entry.owners[user]}
              stroke={getRandomColor(index)}
            />
          ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 0.5 : -0.5) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

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
        fill="#999"
        className="text-sm md:text-base"
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#333"
        className="text-xs md:text-base"
      >{`(${formatCurrency(value)})`}</text>
    </g>
  );
};

export function ExpensesPieChart({
  data,
}: {
  data: { name: string; value: number }[] | undefined;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_: any, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  return (
    data && (
      <ResponsiveContainer maxHeight={290} aspect={1}>
        <PieChart title="Pie Chart" width={100} height={100}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            innerRadius="40%"
            outerRadius="50%"
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {data.map((entry, index) => (
              <Cell key={`${entry}-pie-cell`} fill={getRandomColor(index)} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    )
  );
}
