"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard } from "@/components/shared/StatCard";
import { SectionCard } from "@/components/shared/SectionCard";
import { RiskHeatmap } from "@/components/hq/RiskHeatmap";
import { SystemicAlertPanel } from "@/components/hq/SystemicAlertPanel";

export default function HQDashboard() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">HQ Portfolio Risk Radar</h1>
          <p className="text-sm text-text-secondary mt-1">
            Macro-level risk surveillance, systemic shock clustering, and portfolio health across districts.
          </p>
        </div>

        {/* Macro Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Monitored"
            value="142"
            subtitle="Micro-enterprises"
            icon="🏢"
            trend="3 Districts"
          />
          <StatCard
            title="Active Risk Flags"
            value="28"
            subtitle="14 High Severity"
            icon="🚨"
            trend="+12% this month"
            trendType="negative"
          />
          <StatCard
            title="Systemic Clusters"
            value="2"
            subtitle="Multi-enterprise Shocks"
            icon="⚡"
            trend="Action Required"
            trendType="negative"
          />
          <StatCard
            title="Portfolio PAR (30d)"
            value="4.2%"
            subtitle="Portfolio at Risk"
            icon="📈"
            trend="-0.5% vs Q1"
            trendType="positive"
          />
        </div>

        {/* Middle Section: Systemic Alerts */}
        <SectionCard title="Systemic Shock Alerts" description="Cluster detection when 3+ enterprises share identical shock drivers">
          <SystemicAlertPanel />
        </SectionCard>

        {/* Bottom Section: Sector-District Risk Matrix */}
        <SectionCard title="Sector × Sub-District Risk Heatmap" description="Concentration of active risk flags by geographic sub-region">
          <RiskHeatmap />
        </SectionCard>
      </div>
    </DashboardShell>
  );
}
