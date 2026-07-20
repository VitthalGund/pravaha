"use client";

import React from "react";

type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({ title, description, action, children, className = "" }: Props) {
  return (
    <section className={`bg-surface rounded-xl border border-border p-6 shadow-card ${className}`}>
      <div className="flex items-center justify-between mb-4 border-b border-border-muted pb-3">
        <div>
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          {description ? <p className="text-xs text-text-muted mt-0.5">{description}</p> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      <div>{children}</div>
    </section>
  );
}
