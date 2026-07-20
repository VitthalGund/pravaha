"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

type ForecastPoint = {
  month: string;
  predicted_amount: number;
  lower_bound: number;
  upper_bound: number;
};

type Props = {
  data: ForecastPoint[];
  cohortUsed?: boolean;
};

export function ForecastChart({ data, cohortUsed = false }: Props) {
  // Format data for stacked area chart rendering confidence band
  const formattedData = data.map((pt) => ({
    month: pt.month,
    predicted: pt.predicted_amount,
    base: pt.lower_bound,
    band: pt.upper_bound - pt.lower_bound,
  }));

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-text-primary">
            3-Month Cash Flow Forecast
          </h3>
          <p className="text-xs text-text-secondary">
            {cohortUsed
              ? "Bootstrapped via peer cohort priors (thin data mode — wider confidence band)"
              : "Enterprise historical model prediction"}
          </p>
        </div>
        {cohortUsed && (
          <span className="rounded-full bg-brand-gold-light px-3 py-1 text-xs font-medium text-brand-gold">
            Cohort Bootstrapped
          </span>
        )}
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E3DFD3" />
            <XAxis dataKey="month" stroke="#8A8A7E" fontSize={12} />
            <YAxis stroke="#8A8A7E" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
            <Tooltip
              formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, ""]}
              contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E3DFD3", borderRadius: "12px" }}
            />
            {/* Confidence Band Area */}
            <Area
              type="monotone"
              dataKey="base"
              stackId="1"
              stroke="none"
              fill="transparent"
            />
            <Area
              type="monotone"
              dataKey="band"
              stackId="1"
              stroke="none"
              fill="#E4F3F1"
              fillOpacity={0.7}
              name="Confidence Range"
            />
            {/* Main Predicted Line */}
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#2A9D8F"
              strokeWidth={3}
              fill="none"
              name="Forecast Trend"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
