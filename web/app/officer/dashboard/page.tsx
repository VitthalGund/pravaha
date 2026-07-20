"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard } from "@/components/shared/StatCard";
import { PortfolioTable, EnterprisePortfolioRow } from "@/components/officer/PortfolioTable";

const MOCK_PORTFOLIO_DATA: EnterprisePortfolioRow[] = [
  {
    id: "demo-enterprise-id",
    rank: 1,
    impactScore: 92,
    name: "Kamdhenu Dairy Farm",
    sector: "dairy",
    ownerName: "Sunita Patil",
    severity: "high",
    primaryReason: "Fodder prices in Nashik rose 35% over past 3 weeks while milk yields remained flat.",
    lastVisitedDaysAgo: 18,
  },
  {
    id: "ent-2",
    rank: 2,
    impactScore: 78,
    name: "Godavari Agro Processing",
    sector: "food_processing",
    ownerName: "Ramesh Shinde",
    severity: "watch",
    primaryReason: "Seasonal crop arrival delayed by 2 weeks; cash reserve buffer thin.",
    lastVisitedDaysAgo: 12,
  },
  {
    id: "ent-3",
    rank: 3,
    impactScore: 65,
    name: "Sahyadri Poultry Feeds",
    sector: "poultry",
    ownerName: "Anil Deshmukh",
    severity: "watch",
    primaryReason: "Upcoming quarterly MFI installment crosses 45% of net monthly income.",
    lastVisitedDaysAgo: 25,
  },
  {
    id: "ent-4",
    rank: 4,
    impactScore: 40,
    name: "Trimurti Rural Handicrafts",
    sector: "handicrafts",
    ownerName: "Meena Jadhav",
    severity: "low",
    primaryReason: "Seasonal festival order inflows expected in next cycle.",
    lastVisitedDaysAgo: 5,
  },
];

export default function OfficerDashboard() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page Title & Intro */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Field Officer Portfolio Radar</h1>
          <p className="text-sm text-text-secondary mt-1">
            Prioritized enterprise visits based on risk impact scores, forecast trends, and visit recency.
          </p>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Assigned"
            value="18"
            subtitle="Enterprises in Portfolio"
            icon="🏡"
            trend="Nashik East"
          />
          <StatCard
            title="High Stress Flags"
            value="3"
            subtitle="Requires Visit This Week"
            icon="🚨"
            trend="Action Required"
            trendType="negative"
          />
          <StatCard
            title="Visits Completed"
            value="7 / 12"
            subtitle="Target for July 2026"
            icon="🚗"
            trend="58% Progress"
            trendType="positive"
          />
          <StatCard
            title="Avg Portfolio Buffer"
            value="1.8 Mo"
            subtitle="Forecast Cash Reserve"
            icon="💰"
            trend="Stable"
            trendType="positive"
          />
        </div>

        {/* Main Ranked Table */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-card">
          <div className="flex items-center justify-between mb-4 border-b border-border-muted pb-3">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Visit-Ranked Enterprise Portfolio</h2>
              <p className="text-xs text-text-muted mt-0.5">
                Ranked dynamically by Pravaha Risk Impact Algorithm (Flag Severity × Days Unvisited × Trend Direction)
              </p>
            </div>
            <button className="px-3 py-1.5 text-xs font-semibold bg-surface-secondary border border-border rounded-lg text-text-primary hover:bg-border-muted">
              Filter by Sector
            </button>
          </div>

          <PortfolioTable rows={MOCK_PORTFOLIO_DATA} />
        </div>
      </div>
    </DashboardShell>
  );
}
