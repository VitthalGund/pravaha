/**
 * Shared constants for Pravaha frontends.
 * Mirrored from backend/app/core/constants.py — keep in sync manually
 * since web and mobile don't share a build step with the Python backend.
 */

export const RISK_SEVERITIES = ["low", "watch", "high"] as const;
export type RiskSeverity = (typeof RISK_SEVERITIES)[number];

export const FLAG_TYPES = [
  "seasonal_normal",
  "market_shock",
  "climate_shock",
  "personal_shock",
  "over_leverage",
] as const;
export type FlagType = (typeof FLAG_TYPES)[number];

export const NOTIFIABLE_FLAG_TYPES = [
  "market_shock",
  "climate_shock",
  "personal_shock",
  "over_leverage",
] as const;

export const SECTORS = [
  "dairy",
  "poultry",
  "food_processing",
  "handicrafts",
  "retail",
] as const;
export type Sector = (typeof SECTORS)[number];

export const ROLES = [
  "enterprise_owner",
  "field_officer",
  "hq_risk_officer",
  "fpo_officebearer",
  "admin",
] as const;
export type Role = (typeof ROLES)[number];

export const CREDIT_READINESS_STAGES = [
  "grant_dependent",
  "emerging",
  "loan_ready",
] as const;
export type CreditReadinessStage = (typeof CREDIT_READINESS_STAGES)[number];

export const OBLIGATION_SOURCE_TYPES = [
  "bank_loan",
  "mfi_loan",
  "shg_liability",
  "kcc",
  "informal_trade_credit",
  "informal_moneylender",
] as const;
export type ObligationSourceType = (typeof OBLIGATION_SOURCE_TYPES)[number];

/** PostHog event names — never invent a new one without adding it here first. */
export const POSTHOG_EVENTS = {
  ENTERPRISE_ONBOARDED: "enterprise_onboarded",
  CASH_FLOW_ENTRY_LOGGED: "cash_flow_entry_logged",
  FORECAST_GENERATED: "forecast_generated",
  RISK_FLAG_RAISED: "risk_flag_raised",
  RISK_FLAG_ACKNOWLEDGED: "risk_flag_acknowledged",
  VISIT_COMPLETED: "visit_completed",
  OBLIGATION_ADDED: "obligation_added",
  TRANSLATION_REQUESTED: "translation_requested",
  CREDIT_READINESS_ADVANCED: "credit_readiness_advanced",
} as const;
