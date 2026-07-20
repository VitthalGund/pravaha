#!/usr/bin/env node

/**
 * Design Token Generator for Pravaha
 *
 * Reads shared/design-tokens.json and generates:
 * 1. web/app/globals.css — Tailwind v4 @theme block
 * 2. mobile/tailwind.config.js — NativeWind color config
 *
 * Run from the repo root: node scripts/generate-tokens.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TOKENS_PATH = path.join(ROOT, "shared", "design-tokens.json");
const WEB_CSS_PATH = path.join(ROOT, "web", "app", "globals.css");
const MOBILE_CONFIG_PATH = path.join(ROOT, "mobile", "tailwind.config.js");

function loadTokens() {
  if (!fs.existsSync(TOKENS_PATH)) {
    console.error(`ERROR: Token file not found at ${TOKENS_PATH}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(TOKENS_PATH, "utf-8"));
}

function generateWebCSS(tokens) {
  const lines = [];
  lines.push('@import "tailwindcss";');
  lines.push("");
  lines.push("@theme {");
  lines.push(`  --font-sans: ${tokens.typography.fontFamily.sans};`);
  lines.push("");

  // Colors
  for (const [name, value] of Object.entries(tokens.color)) {
    lines.push(`  --color-${name}: ${value.toLowerCase()};`);
  }
  lines.push("");

  // Radius
  for (const [name, value] of Object.entries(tokens.radius)) {
    lines.push(`  --radius-${name}: ${value};`);
  }
  lines.push("");

  // Shadow
  for (const [name, value] of Object.entries(tokens.shadow)) {
    lines.push(`  --shadow-${name}: ${value};`);
  }

  lines.push("}");
  lines.push("");

  // Base styles
  lines.push("body {");
  lines.push("  background-color: var(--color-background);");
  lines.push("  color: var(--color-text-primary);");
  lines.push("  font-family: var(--font-sans);");
  lines.push("  font-size: 15px;");
  lines.push("  line-height: 22px;");
  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

function generateMobileConfig(tokens) {
  const colorEntries = Object.entries(tokens.color)
    .map(([name, value]) => `        "${name}": "${value}",`)
    .join("\n");

  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
${colorEntries}
      },
      fontFamily: {
        sans: ["NotoSans_400Regular"],
        "sans-medium": ["NotoSans_500Medium"],
        "sans-semibold": ["NotoSans_600SemiBold"],
      },
      borderRadius: {
        sm: "${tokens.radius.sm}",
        md: "${tokens.radius.md}",
        lg: "${tokens.radius.lg}",
        pill: "${tokens.radius.pill}",
      },
    },
  },
  plugins: [],
};
`;
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function main() {
  console.log("📦 Loading design tokens...");
  const tokens = loadTokens();

  // Validate required tokens
  const requiredColors = [
    "background", "surface", "text-primary", "brand-forest",
    "accent", "risk-safe", "risk-watch", "risk-stress",
  ];
  for (const name of requiredColors) {
    if (!tokens.color[name]) {
      console.error(`ERROR: Required color token "${name}" is missing from design-tokens.json`);
      process.exit(1);
    }
  }

  // Generate web CSS
  console.log("🌐 Generating web/app/globals.css...");
  const webCSS = generateWebCSS(tokens);
  ensureDir(WEB_CSS_PATH);
  fs.writeFileSync(WEB_CSS_PATH, webCSS, "utf-8");
  console.log(`   ✓ Written to ${WEB_CSS_PATH}`);

  // Generate mobile config
  console.log("📱 Generating mobile/tailwind.config.js...");
  const mobileConfig = generateMobileConfig(tokens);
  ensureDir(MOBILE_CONFIG_PATH);
  fs.writeFileSync(MOBILE_CONFIG_PATH, mobileConfig, "utf-8");
  console.log(`   ✓ Written to ${MOBILE_CONFIG_PATH}`);

  console.log("✅ Token generation complete!");
}

main();
