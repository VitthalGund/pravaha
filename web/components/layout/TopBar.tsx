"use client";

import React from "react";
import Link from "next/link";

export function TopBar() {
  return (
    <header className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between sticky top-0 z-10 shadow-card">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold text-text-primary">Nashik Rural District Portfolio</h2>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-teal-light text-brand-teal-dark border border-brand-teal/20">
          Field Officer View
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <select className="text-xs bg-surface-secondary border border-border rounded-md px-2 py-1.5 font-medium text-text-primary focus:outline-none">
          <option value="en">English (US)</option>
          <option value="hi">हिन्दी (Hindi)</option>
          <option value="mr">मराठी (Marathi)</option>
        </select>

        {/* User Info */}
        <div className="flex items-center gap-2 border-l border-border pl-4">
          <div className="w-8 h-8 rounded-full bg-brand-forest text-text-inverse font-bold text-xs flex items-center justify-center">
            RP
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-text-primary leading-tight">Rajesh Patil</p>
            <p className="text-[11px] text-text-muted leading-tight">Field Officer (Nashik)</p>
          </div>
        </div>
      </div>
    </header>
  );
}
