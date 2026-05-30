import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary — professional blue
        primary: {
          50:  "#EEF4FF",
          100: "#D9E8FF",
          200: "#B3CFFE",
          300: "#85ADFD",
          400: "#5585FA",
          500: "#2D64F6",
          600: "#1A5FCC",
          700: "#1548A8",
          800: "#163885",
          900: "#163069",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Steel teal
        ocean: {
          50:  "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
          800: "#0D7BA3",
          900: "#0C4A6E",
        },
        // Slate accents
        slate: {
          50:  "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
        // Backward compat: coral maps to primary
        coral: {
          50:  "#EEF4FF",
          100: "#D9E8FF",
          200: "#B3CFFE",
          300: "#85ADFD",
          400: "#5585FA",
          500: "#1A5FCC",
          600: "#1548A8",
          700: "#163885",
          800: "#163069",
          900: "#0F2356",
        },
        // System tokens (shadcn-compatible)
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        "4xl": "2rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        "primary-sm": "0 2px 6px rgba(26, 95, 204, 0.20)",
        "primary-md": "0 4px 14px rgba(26, 95, 204, 0.28)",
        "primary-lg": "0 8px 28px rgba(26, 95, 204, 0.32)",
        "ocean-sm":   "0 2px 6px rgba(13, 123, 163, 0.18)",
        "ocean-md":   "0 4px 14px rgba(13, 123, 163, 0.22)",
        "card":       "0 1px 2px rgba(14,21,32,0.04), 0 4px 12px rgba(14,21,32,0.05)",
        "card-hover": "0 4px 8px rgba(14,21,32,0.06), 0 12px 32px rgba(14,21,32,0.08)",
        "glass":      "0 8px 32px rgba(14,21,32,0.12), inset 0 1px 0 rgba(255,255,255,0.10)",
        "inner-sm":   "inset 0 1px 3px rgba(14,21,32,0.08)",
        // Backward compat
        "coral-sm":   "0 2px 6px rgba(26, 95, 204, 0.20)",
        "coral-md":   "0 4px 14px rgba(26, 95, 204, 0.28)",
        "coral-lg":   "0 8px 28px rgba(26, 95, 204, 0.32)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up":   { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.5" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(26,95,204,0)" },
          "50%":      { boxShadow: "0 0 20px 3px rgba(26,95,204,0.20)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        float:       "float 5s ease-in-out infinite",
        shimmer:     "shimmer 2.5s linear infinite",
        "fade-up":   "fade-up 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "fade-in":   "fade-in 0.25s ease-out",
        "scale-in":  "scale-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "glow-pulse":"glow-pulse 2.5s ease-in-out infinite",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      backgroundImage: {
        "gradient-radial":  "radial-gradient(var(--tw-gradient-stops))",
        "mesh-blue": "radial-gradient(at 20% 20%, hsla(220,80%,70%,0.25) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(199,80%,60%,0.18) 0px, transparent 50%), radial-gradient(at 0% 70%, hsla(220,60%,50%,0.15) 0px, transparent 50%)",
        "mesh-dark": "radial-gradient(at 10% 10%, hsla(220,80%,50%,0.18) 0px, transparent 50%), radial-gradient(at 90% 90%, hsla(199,80%,40%,0.15) 0px, transparent 50%)",
        // Backward compat
        "mesh-coral": "radial-gradient(at 20% 20%, hsla(220,80%,70%,0.25) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(199,80%,60%,0.18) 0px, transparent 50%)",
        // ── Landing page semantic utilities ──────────────────────────
        "vibe-dark":       "linear-gradient(160deg, #070D14 0%, #0A1520 50%, #070E1A 100%)",
        "grid-subtle":     "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        "glow-blue":       "radial-gradient(circle, rgba(26,95,204,0.12) 0%, transparent 65%)",
        "glow-teal":       "radial-gradient(circle, rgba(13,123,163,0.09) 0%, transparent 65%)",
        "cta-blue":        "linear-gradient(135deg, #1A5FCC 0%, #2570E8 100%)",
        "cta-violet":      "linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)",
        "hero-text":       "linear-gradient(90deg, #5585FA, #2570E8, #38BDF8)",
        "stats-text":      "linear-gradient(90deg, #5585FA, #38BDF8)",
        "logo-text":       "linear-gradient(90deg, #ffffff, #85ADFD)",
        "step-card":       "linear-gradient(135deg, rgba(26,95,204,0.20), rgba(37,112,232,0.10))",
        "cta-section":     "linear-gradient(135deg, rgba(26,95,204,0.15), rgba(13,123,163,0.08))",
      },
      backgroundSize: {
        "grid-48": "48px 48px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
