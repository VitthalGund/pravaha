"use client";

import React from "react";

type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
};

export function StatCard({ title, value, subtitle, icon, trend, trendType = "neutral" }: Props) {
  const trendColor =
    trendType === "positive"
      ? "text-risk-safe bg-risk-safe-light"
      : trendType === "negative"
      ? "text-risk-stress bg-risk-stress-light"
      : "text-text-muted bg-surface-secondary";

  return (
    <div className="bg-surface rounded-xl border border-border p-5 shadow-card flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-text-primary mt-1">{value}</h3>
        </div>
        {icon ? <span className="text-2xl p-2 rounded-lg bg-surface-secondary">{icon}</span> : null}
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-border-muted flex items-center justify-between text-xs">
          {subtitle ? <span className="text-text-secondary">{subtitle}</span> : <div />}
          {trend ? (
            <span className={`px-2 py-0.5 rounded-full font-semibold ${trendColor}`}>
              {trend}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
