"use client";

import React from "react";

type Stage = "grant_dependent" | "emerging" | "loan_ready";

type Props = {
  stage: Stage;
};

export function CreditReadinessBadge({ stage }: Props) {
  const stages: { key: Stage; label: string }[] = [
    { key: "grant_dependent", label: "Grant Dependent" },
    { key: "emerging", label: "Emerging" },
    { key: "loan_ready", label: "Loan Ready" },
  ];

  const currentIndex = stages.findIndex((s) => s.key === stage);

  return (
    <div className="flex items-center gap-2">
      {stages.map((s, idx) => {
        const isCurrent = idx === currentIndex;
        const isPassed = idx < currentIndex;

        let bgClass = "bg-surface-secondary text-text-muted border-border";
        if (isCurrent) {
          bgClass = "bg-brand-gold-light text-brand-gold font-bold border-brand-gold/30";
        } else if (isPassed) {
          bgClass = "bg-risk-safe-light text-risk-safe border-risk-safe/30";
        }

        return (
          <div
            key={s.key}
            className={`px-3 py-1 rounded-full text-xs border flex items-center gap-1.5 transition-all ${bgClass}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}
