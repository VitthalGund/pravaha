"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Portfolio Table", href: "/officer/dashboard", icon: "📊", roles: ["field_officer"] },
    { label: "Visits Log", href: "/officer/visits", icon: "🚗", roles: ["field_officer"] },
    { label: "HQ Risk Overview", href: "/hq/dashboard", icon: "🛡️", roles: ["hq_risk_officer"] },
    { label: "Export Reports", href: "/hq/reports", icon: "📄", roles: ["hq_risk_officer"] },
    { label: "FPO Dashboard", href: "/fpo/dashboard", icon: "🌾", roles: ["fpo_officebearer"] },
  ];

  return (
    <aside className="w-64 bg-brand-forest text-text-inverse flex flex-col min-h-screen border-r border-brand-forest-dark">
      {/* Brand Header */}
      <div className="p-6 border-b border-brand-forest-dark flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-brand-teal flex items-center justify-center font-bold text-lg">
          प्र
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight leading-none text-white">PRAVAHA</h1>
          <p className="text-xs text-brand-teal-light opacity-80 mt-0.5">NABARD Fintech Console</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-brand-teal-light uppercase tracking-wider opacity-60">
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-forest-dark text-brand-gold font-semibold"
                  : "text-text-inverse hover:bg-brand-forest-dark/50 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Status */}
      <div className="p-4 border-t border-brand-forest-dark text-xs text-brand-teal-light/70">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-risk-safe animate-pulse" />
          <span>System Online</span>
        </div>
        <p>Nashik District Operational Pilot</p>
      </div>
    </aside>
  );
}
