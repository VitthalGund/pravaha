"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard } from "@/components/shared/StatCard";
import { SectionCard } from "@/components/shared/SectionCard";
import { RiskBadge } from "@/components/officer/RiskBadge";

const MOCK_FPO_MEMBERS = [
  { id: "demo-enterprise-id", name: "Kamdhenu Dairy Farm", owner: "Sunita Patil", income: 15000, expense: 8000, status: "high" },
  { id: "ent-m2", name: "Mahesh Milk Processing", owner: "Mahesh Gawli", income: 28000, expense: 19000, status: "low" },
  { id: "ent-m3", name: "Godavari Cattle Feeds", owner: "Sanjay Thorat", income: 42000, expense: 31000, status: "watch" },
  { id: "ent-m4", name: "Anand Cooperative Dairy", owner: "Anand Shelke", income: 35000, expense: 22000, status: "low" },
];

export default function FPODashboard() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">FPO Aggregate Console</h1>
          <p className="text-sm text-text-secondary mt-1">
            Kamdhenu Farmers Producer Organization • Nashik District (24 Active Member Enterprises)
          </p>
        </div>

        {/* FPO Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total FPO Members"
            value="24"
            subtitle="Registered Enterprises"
            icon="🌾"
            trend="Nashik Cluster"
          />
          <StatCard
            title="Aggregate Monthly Income"
            value="₹1,20,000"
            subtitle="Sum Across Members"
            icon="💵"
            trend="+8% vs Last Month"
            trendType="positive"
          />
          <StatCard
            title="Net Cash Buffer"
            value="₹40,000"
            subtitle="FPO Liquidity Index"
            icon="🏦"
            trend="Healthy"
            trendType="positive"
          />
          <StatCard
            title="Members Under Stress"
            value="2"
            subtitle="Requires FPO Support"
            icon="⚠️"
            trend="Action Required"
            trendType="negative"
          />
        </div>

        {/* Member Cluster Table */}
        <SectionCard title="FPO Member Performance Cluster" description="Individual enterprise cash flow contributions & risk flags">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-secondary text-text-muted uppercase tracking-wider font-semibold border-b border-border">
                <tr>
                  <th className="py-3 px-4">Member Enterprise</th>
                  <th className="py-3 px-4">Owner Name</th>
                  <th className="py-3 px-4 text-right">Income (Monthly)</th>
                  <th className="py-3 px-4 text-right">Expense (Monthly)</th>
                  <th className="py-3 px-4 text-right">Net Flow</th>
                  <th className="py-3 px-4 text-center">Risk Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-muted">
                {MOCK_FPO_MEMBERS.map((member) => {
                  const net = member.income - member.expense;
                  return (
                    <tr key={member.id} className="hover:bg-surface-secondary/50">
                      <td className="py-3 px-4 font-semibold text-text-primary">{member.name}</td>
                      <td className="py-3 px-4 text-text-secondary">{member.owner}</td>
                      <td className="py-3 px-4 text-right text-risk-safe font-semibold">
                        +₹{member.income.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4 text-right text-risk-stress font-semibold">
                        -₹{member.expense.toLocaleString("en-IN")}
                      </td>
                      <td className={`py-3 px-4 text-right font-bold ${net >= 0 ? "text-risk-safe" : "text-risk-stress"}`}>
                        ₹{net.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <RiskBadge severity={member.status as any} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </DashboardShell>
  );
}
