"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("field.officer@pravaha.org");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/officer/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      {/* Container */}
      <div className="w-full max-w-md bg-surface rounded-2xl border border-border p-8 shadow-card">
        {/* Brand */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-brand-forest text-text-inverse font-bold text-xl flex items-center justify-center mb-3 shadow-card">
            प्र
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Pravaha Staff Console</h1>
          <p className="text-xs text-text-secondary mt-1">
            Field Officer, HQ Risk Officer & FPO Access Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-text-primary block mb-1">Staff Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-secondary border border-border rounded-lg p-3 text-text-primary font-medium focus:outline-none focus:border-brand-teal"
              placeholder="officer@pravaha.org"
            />
          </div>

          <div>
            <label className="font-semibold text-text-primary block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-secondary border border-border rounded-lg p-3 text-text-primary font-medium focus:outline-none focus:border-brand-teal"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-brand-forest text-text-inverse font-semibold text-sm shadow-card hover:bg-brand-forest-dark transition-colors disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In to Staff Console"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-border-muted text-center text-[11px] text-text-muted">
          Supported by NABARD • Financial Sector Hackathon 2026
        </div>
      </div>
    </div>
  );
}
