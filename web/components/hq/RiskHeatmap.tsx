"use client";

import React from "react";

type MatrixCell = {
  district: string;
  sector: string;
  count: number;
  status: "safe" | "watch" | "stress";
};

const MATRIX_DATA: MatrixCell[] = [
  { district: "Nashik East", sector: "Dairy", count: 12, status: "stress" },
  { district: "Nashik East", sector: "Poultry", count: 4, status: "watch" },
  { district: "Nashik East", sector: "Food Proc.", count: 2, status: "safe" },
  { district: "Nashik West", sector: "Dairy", count: 8, status: "watch" },
  { district: "Nashik West", sector: "Poultry", count: 15, status: "stress" },
  { district: "Nashik West", sector: "Food Proc.", count: 1, status: "safe" },
  { district: "Malegaon Sub", sector: "Dairy", count: 3, status: "safe" },
  { district: "Malegaon Sub", sector: "Poultry", count: 6, status: "watch" },
  { district: "Malegaon Sub", sector: "Food Proc.", count: 9, status: "stress" },
];

export function RiskHeatmap() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-left">
        <thead className="bg-surface-secondary text-text-muted uppercase tracking-wider font-semibold border-b border-border">
          <tr>
            <th className="py-3 px-4">District Sub-Region</th>
            <th className="py-3 px-4 text-center">Dairy</th>
            <th className="py-3 px-4 text-center">Poultry</th>
            <th className="py-3 px-4 text-center">Food Processing</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-muted">
          {["Nashik East", "Nashik West", "Malegaon Sub"].map((dist) => (
            <tr key={dist} className="hover:bg-surface-secondary/50">
              <td className="py-3 px-4 font-semibold text-text-primary">{dist}</td>
              {["Dairy", "Poultry", "Food Proc."].map((sec) => {
                const cell = MATRIX_DATA.find((c) => c.district === dist && c.sector === sec);
                if (!cell) return <td key={sec} className="py-3 px-4 text-center text-text-muted">-</td>;

                let colorClass = "bg-risk-safe-light text-risk-safe border-risk-safe/30";
                if (cell.status === "watch") colorClass = "bg-risk-watch-light text-risk-watch border-risk-watch/30";
                if (cell.status === "stress") colorClass = "bg-risk-stress-light text-risk-stress border-risk-stress/30";

                return (
                  <td key={sec} className="py-3 px-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-md border font-semibold ${colorClass}`}>
                      {cell.count} Active ({cell.status.toUpperCase()})
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
