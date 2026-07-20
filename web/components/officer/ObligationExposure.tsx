"use client";

import React from "react";

type Obligation = {
  id: string;
  source_type: string;
  lender_name: string;
  amount_outstanding: number;
  monthly_installment: number;
  interest_rate_annual?: number | null;
  self_reported: boolean;
};

type Props = {
  obligations: Obligation[];
};

export function ObligationExposure({ obligations }: Props) {
  const totalOutstanding = obligations.reduce((acc, o) => acc + o.amount_outstanding, 0);
  const totalMonthly = obligations.reduce((acc, o) => acc + o.monthly_installment, 0);
  const informalCount = obligations.filter((o) => o.self_reported || o.source_type.includes("informal")).length;

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-text-primary">
            Total Obligation Exposure
          </h3>
          <p className="text-xs text-text-secondary">
            Cross-source debt visibility (formal bank + informal trade/moneylender)
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-text-muted">Total Exposure</span>
          <p className="text-lg font-bold text-text-primary">
            ₹{totalOutstanding.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg bg-surface-secondary p-3">
        <div>
          <span className="text-xs text-text-muted">Monthly Repayment Load</span>
          <p className="text-sm font-semibold text-risk-stress">
            ₹{totalMonthly.toLocaleString("en-IN")}/mo
          </p>
        </div>
        <div>
          <span className="text-xs text-text-muted">Informal / Shop Credit Sources</span>
          <p className="text-sm font-semibold text-brand-gold">
            {informalCount} {informalCount === 1 ? "source" : "sources"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {obligations.map((o) => (
          <div
            key={o.id}
            className="flex items-center justify-between rounded-lg border border-border-muted p-3 text-xs"
          >
            <div>
              <p className="font-semibold text-text-primary">{o.lender_name}</p>
              <p className="text-text-muted capitalize">
                {o.source_type.replace("_", " ")} • {o.self_reported ? "Self-Reported" : "Verified Record"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-text-primary">₹{o.amount_outstanding.toLocaleString("en-IN")}</p>
              <p className="text-text-secondary">₹{o.monthly_installment.toLocaleString("en-IN")}/mo</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
