"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SectionCard } from "@/components/shared/SectionCard";

type VisitRecord = {
  id: string;
  enterpriseName: string;
  date: string;
  notes: string;
  synced: boolean;
};

export default function VisitsPage() {
  const [visits, setVisits] = useState<VisitRecord[]>([
    {
      id: "v-1",
      enterpriseName: "Kamdhenu Dairy Farm",
      date: "2026-07-18",
      notes: "Discussed feed subsidy application. Enterprise owner self-reported shop credit of ₹25,000.",
      synced: true,
    },
    {
      id: "v-2",
      enterpriseName: "Godavari Agro Processing",
      date: "2026-07-10",
      notes: "Reviewed crop arrival schedule. Cash reserve buffer thin but manageable.",
      synced: true,
    },
  ]);

  const [selectedEnterprise, setSelectedEnterprise] = useState("Kamdhenu Dairy Farm");
  const [notes, setNotes] = useState("");

  const handleLogVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    const newVisit: VisitRecord = {
      id: `v-${Date.now()}`,
      enterpriseName: selectedEnterprise,
      date: new Date().toISOString().split("T")[0],
      notes,
      synced: true,
    };

    setVisits([newVisit, ...visits]);
    setNotes("");
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Field Visit Logger</h1>
          <p className="text-sm text-text-secondary mt-1">
            Record enterprise visit outcomes, observations, and debt disclosures. Works offline via PWA Service Worker.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Log Form */}
          <div className="lg:col-span-1">
            <SectionCard title="Log New Visit" description="Record check-in details">
              <form onSubmit={handleLogVisit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-text-primary block mb-1">Target Enterprise</label>
                  <select
                    value={selectedEnterprise}
                    onChange={(e) => setSelectedEnterprise(e.target.value)}
                    className="w-full bg-surface-secondary border border-border rounded-lg p-2.5 text-text-primary font-medium"
                  >
                    <option value="Kamdhenu Dairy Farm">Kamdhenu Dairy Farm</option>
                    <option value="Godavari Agro Processing">Godavari Agro Processing</option>
                    <option value="Sahyadri Poultry Feeds">Sahyadri Poultry Feeds</option>
                    <option value="Trimurti Rural Handicrafts">Trimurti Rural Handicrafts</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-text-primary block mb-1">Visit Outcome Notes</label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter observation notes, verified yield numbers, or informal debt declarations..."
                    className="w-full bg-surface-secondary border border-border rounded-lg p-2.5 text-text-primary font-medium focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!notes.trim()}
                  className="w-full py-3 rounded-lg bg-brand-forest text-text-inverse font-semibold text-xs shadow-card hover:bg-brand-forest-dark transition-colors disabled:opacity-50"
                >
                  Save Visit Entry
                </button>
              </form>
            </SectionCard>
          </div>

          {/* Visits Table */}
          <div className="lg:col-span-2">
            <SectionCard title="Logged Visit History" description="Recent field officer check-ins">
              <div className="space-y-3 text-xs">
                {visits.map((v) => (
                  <div key={v.id} className="p-4 rounded-lg bg-surface-secondary border border-border-muted">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-bold text-text-primary">{v.enterpriseName}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-text-muted">{v.date}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-risk-safe-light text-risk-safe border border-risk-safe/30">
                          Synced
                        </span>
                      </div>
                    </div>
                    <p className="text-text-secondary leading-relaxed">{v.notes}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
