"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SectionCard } from "@/components/shared/SectionCard";

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);
  const [generatedReportUrl, setGeneratedReportUrl] = useState<string | null>(null);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGeneratedReportUrl("https://pravaha-reports.s3.amazonaws.com/pravaha-bank-summary-kamdhenu-2026.pdf");
    }, 1200);
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Bank-Ready PDF Report Generator</h1>
          <p className="text-sm text-text-secondary mt-1">
            Generate standardized financial risk & cash flow assessment dossiers for priority sector lending.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Generator Form */}
          <div className="lg:col-span-2">
            <SectionCard title="Generate New Dossier Report" description="Configure scope and report type">
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-text-primary block mb-1">Select Enterprise Target</label>
                  <select className="w-full bg-surface-secondary border border-border rounded-lg p-2.5 text-text-primary font-medium">
                    <option value="demo-enterprise-id">Kamdhenu Dairy Farm (Sunita Patil - Nashik)</option>
                    <option value="ent-2">Godavari Agro Processing (Ramesh Shinde)</option>
                    <option value="all">All High-Stress Accounts (District Aggregate)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-text-primary block mb-1">Report Dossier Format</label>
                  <select className="w-full bg-surface-secondary border border-border rounded-lg p-2.5 text-text-primary font-medium">
                    <option value="full">Full Priority Sector Credit Assessment (Forecast + Obligations + Risk)</option>
                    <option value="risk_only">Risk Radar & Shock Classification Summary</option>
                    <option value="obligation">Total Obligation & Informal Credit Exposure Audit</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="px-5 py-3 rounded-lg bg-brand-forest text-text-inverse font-semibold text-xs shadow-card hover:bg-brand-forest-dark transition-colors disabled:opacity-50"
                  >
                    {generating ? "Generating PDF Report..." : "📄 Generate Presigned PDF Report"}
                  </button>
                </div>

                {generatedReportUrl && (
                  <div className="mt-4 p-4 rounded-lg bg-risk-safe-light border border-risk-safe/30 text-risk-safe flex items-center justify-between">
                    <div>
                      <p className="font-bold">Report Generated Successfully!</p>
                      <p className="text-[11px] opacity-90">Presigned MinIO URL active for 60 minutes.</p>
                    </div>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Simulated PDF Download: Pravaha-Credit-Assessment.pdf");
                      }}
                      className="px-3 py-1.5 rounded bg-risk-safe text-text-inverse font-bold text-xs"
                    >
                      Download PDF
                    </a>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          {/* Past Generated Reports List */}
          <SectionCard title="Recent Report Archive" description="Past generated PDF dossiers">
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-secondary border border-border-muted flex items-center justify-between">
                <div>
                  <p className="font-semibold text-text-primary">Kamdhenu Dairy Farm</p>
                  <p className="text-[11px] text-text-muted">Generated 2 hours ago</p>
                </div>
                <span className="text-brand-forest font-semibold cursor-pointer">PDF</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-secondary border border-border-muted flex items-center justify-between">
                <div>
                  <p className="font-semibold text-text-primary">Nashik East District Summary</p>
                  <p className="text-[11px] text-text-muted">Generated Yesterday</p>
                </div>
                <span className="text-brand-forest font-semibold cursor-pointer">PDF</span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </DashboardShell>
  );
}
