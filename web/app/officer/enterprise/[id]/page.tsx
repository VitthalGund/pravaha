"use client";

import React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SectionCard } from "@/components/shared/SectionCard";
import { CreditReadinessBadge } from "@/components/shared/CreditReadinessBadge";
import { ForecastChart, ForecastPoint } from "@/components/officer/ForecastChart";
import { ObligationExposure, ObligationItem } from "@/components/officer/ObligationExposure";
import { RiskBadge } from "@/components/officer/RiskBadge";

const MOCK_FORECAST_DATA: ForecastPoint[] = [
  { month: "May 2026", predictedAmount: 14000, lowerBound: 11000, upperBound: 17000 },
  { month: "Jun 2026", predictedAmount: 15500, lowerBound: 12500, upperBound: 18500 },
  { month: "Jul 2026", predictedAmount: 7000, lowerBound: 4000, upperBound: 10000 },
  { month: "Aug 2026", predictedAmount: 9500, lowerBound: 6000, upperBound: 13000 },
  { month: "Sep 2026", predictedAmount: 16000, lowerBound: 13000, upperBound: 19000 },
  { month: "Oct 2026", predictedAmount: 18000, lowerBound: 15000, upperBound: 21000 },
];

const MOCK_OBLIGATIONS: ObligationItem[] = [
  {
    id: "obl-1",
    sourceType: "bank_loan",
    lenderName: "State Bank of India (KCC Loan)",
    amountOutstanding: 50000,
    monthlyInstallment: 5000,
    interestRateAnnual: 8.5,
    selfReported: false,
  },
  {
    id: "obl-2",
    sourceType: "informal_moneylender",
    lenderName: "Local Feed Supplier (Shop Credit)",
    amountOutstanding: 25000,
    monthlyInstallment: 4000,
    interestRateAnnual: null,
    selfReported: true,
  },
];

export default function EnterpriseProfilePage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Back Button & Header */}
        <div>
          <Link
            href="/officer/dashboard"
            className="text-xs font-semibold text-brand-teal hover:underline inline-flex items-center gap-1 mb-2"
          >
            ← Back to Portfolio Radar
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-text-primary">Kamdhenu Dairy Farm</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-forest/10 text-brand-forest border border-brand-forest/20 capitalize">
                  Dairy Sector
                </span>
                <RiskBadge severity="high" />
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Owner: Sunita Patil • Location: Nashik District, Maharashtra • NABARD Ref: ESHAKTI-9F2A1B
              </p>
            </div>

            {/* Credit Readiness Bar */}
            <div>
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                Credit-Readiness Trajectory
              </p>
              <CreditReadinessBadge stage="grant_dependent" />
            </div>
          </div>
        </div>

        {/* Top Grid: Forecast Chart & Active Risk Flags */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart takes 2 cols */}
          <div className="lg:col-span-2">
            <ForecastChart data={MOCK_FORECAST_DATA} cohortUsed={true} />
          </div>

          {/* Active Risk Panel takes 1 col */}
          <SectionCard title="Active Risk Flags" description="Plain-language AI shock classification">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border-l-4 border-l-risk-stress bg-risk-stress-light border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-risk-stress uppercase tracking-wider">
                    MARKET SHOCK
                  </span>
                  <RiskBadge severity="high" />
                </div>
                <p className="text-xs font-medium text-text-primary leading-relaxed">
                  Fodder prices in Nashik district rose 35% over past 3 weeks while milk yields remained flat.
                </p>
                <div className="mt-3 pt-2 border-t border-border-muted">
                  <p className="text-[11px] font-semibold text-text-secondary">Suggested Action:</p>
                  <p className="text-xs text-brand-forest font-medium mt-0.5">
                    Apply for NABARD Priority Sector Feed Subsidy before next repayment cycle.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg border-l-4 border-l-risk-watch bg-risk-watch-light border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-risk-watch uppercase tracking-wider">
                    OVER-LEVERAGE RISK
                  </span>
                  <RiskBadge severity="watch" />
                </div>
                <p className="text-xs font-medium text-text-primary leading-relaxed">
                  Total monthly obligations (₹9,000) cross 55% of forecasted July cash flow (₹7,000).
                </p>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Bottom Grid: Total Obligation Exposure & Visit History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Obligations take 2 cols */}
          <div className="lg:col-span-2">
            <ObligationExposure
              items={MOCK_OBLIGATIONS}
              totalExposure={75000}
              monthlyLoad={9000}
              informalCount={1}
            />
          </div>

          {/* Visit History takes 1 col */}
          <SectionCard title="Officer Visit History" description="Field officer check-ins & logs">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-surface-secondary border border-border-muted">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-text-primary">18 Days Ago</span>
                  <span className="text-text-muted">Rajesh Patil</span>
                </div>
                <p className="text-xs text-text-secondary">
                  Discussed feed subsidy application. Enterprise owner self-reported shop credit of ₹25,000.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface-secondary border border-border-muted">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-text-primary">45 Days Ago</span>
                  <span className="text-text-muted">Rajesh Patil</span>
                </div>
                <p className="text-xs text-text-secondary">
                  Initial onboard visit. Verified SHG membership with Kamdhenu Mahila Bachat Gat.
                </p>
              </div>

              <button className="w-full py-2 text-xs font-semibold text-brand-forest bg-surface border border-border rounded-lg hover:bg-surface-secondary transition-colors">
                + Log New Field Visit
              </button>
            </div>
          </SectionCard>
        </div>
      </div>
    </DashboardShell>
  );
}
