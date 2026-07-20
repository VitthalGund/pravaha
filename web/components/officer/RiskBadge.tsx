import React from "react";

type Props = {
  severity: "safe" | "watch" | "stress" | "high" | "low";
};

export function RiskBadge({ severity }: Props) {
  const styles = {
    safe: "bg-risk-safe-light text-risk-safe",
    low: "bg-risk-safe-light text-risk-safe",
    watch: "bg-risk-watch-light text-risk-watch",
    stress: "bg-risk-stress-light text-risk-stress",
    high: "bg-risk-stress-light text-risk-stress",
  };

  const currentStyle = styles[severity] || styles.watch;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${currentStyle}`}>
      {severity}
    </span>
  );
}
