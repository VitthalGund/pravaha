"use client";

import React from "react";
import Link from "next/link";
import { RiskBadge } from "./RiskBadge";

type EnterpriseRow = {
  id: string;
  name: string;
  sector: string;
  severity: "high" | "watch" | "low";
  reason: string;
  days_since_visit: number;
  visit_priority_score: number;
};

type Props = {
  data: EnterpriseRow[];
};

export function PortfolioTable({ data }: Props) {
  return (
    <div className="rounded-xl border border-border bg-surface shadow-card overflow-hidden">
      <div className="p-4 border-b border-border bg-surface-secondary flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-text-primary">Visit-Ranked Enterprise Portfolio</h3>
          <p className="text-xs text-text-secondary">Ranked by calculated visit impact score (severity × recency × trend)</p>
        </div>
        <span className="text-xs font-medium text-brand-forest">Showing {data.length} enterprises</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-muted text-text-secondary uppercase font-semibold border-b border-border">
            <tr>
              <th className="p-3">Rank / Score</th>
              <th className="p-3">Enterprise</th>
              <th className="p-3">Sector</th>
              <th className="p-3">Risk State & Reason</th>
              <th className="p-3">Last Visit</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-muted">
            {data.map((row, idx) => (
              <tr key={row.id} className="hover:bg-surface-secondary transition-colors">
                <td className="p-3 font-bold text-brand-forest">#{idx + 1} ({row.visit_priority_score})</td>
                <td className="p-3 font-semibold text-text-primary">
                  <Link href={`/officer/enterprise/${row.id}`} className="hover:underline text-accent">
                    {row.name}
                  </Link>
                </td>
                <td className="p-3 text-text-secondary capitalize">{row.sector.replace("_", " ")}</td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <RiskBadge severity={row.severity} />
                    <span className="text-text-primary font-medium">{row.reason}</span>
                  </div>
                </td>
                <td className="p-3 text-text-muted">{row.days_since_visit} days ago</td>
                <td className="p-3 text-right">
                  <Link
                    href={`/officer/enterprise/${row.id}`}
                    className="inline-block rounded-lg bg-brand-forest px-3 py-1.5 text-xs font-semibold text-text-inverse hover:bg-brand-forest-dark"
                  >
                    View Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
