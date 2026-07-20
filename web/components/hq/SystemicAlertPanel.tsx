"use client";

import React from "react";

type SystemicAlert = {
  id: string;
  district: string;
  sector: string;
  shockType: string;
  affectedCount: number;
  description: string;
  severity: "high" | "watch";
};

const SYSTEMIC_ALERTS: SystemicAlert[] = [
  {
    id: "sys-1",
    district: "Nashik East",
    sector: "Dairy",
    shockType: "Market Shock (Fodder Inflation)",
    affectedCount: 14,
    description: "District-wide fodder price surge (+35%) affecting 14 dairy enterprises in Nashik East. Cluster risk flag triggered.",
    severity: "high",
  },
  {
    id: "sys-2",
    district: "Nashik West",
    sector: "Poultry",
    shockType: "Climate Shock (Unseasonal Rain)",
    affectedCount: 9,
    description: "Heatwave and unseasonal humidity spiking poultry mortality risks across 9 farms.",
    severity: "watch",
  },
];

export function SystemicAlertPanel() {
  return (
    <div className="space-y-3">
      {SYSTEMIC_ALERTS.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-xl border-l-4 border border-border ${
            alert.severity === "high"
              ? "border-l-risk-stress bg-risk-stress-light/40"
              : "border-l-risk-watch bg-risk-watch-light/40"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
              {alert.shockType}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-risk-stress text-text-inverse">
              SYSTEMIC CLUSTER ({alert.affectedCount} Enterprises)
            </span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed mb-2">{alert.description}</p>
          <div className="flex items-center justify-between text-[11px] text-text-muted border-t border-border-muted pt-2">
            <span>District: {alert.district} • Sector: {alert.sector}</span>
            <button className="font-semibold text-brand-forest hover:underline">
              View All {alert.affectedCount} Accounts →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
