# Crevy Brand Style Guide & Design System

> **Purpose for AI Agents & Developers:**  
> This style guide codifies the institutional, high-integrity climate finance design system established in `src/app/(public)/page.tsx`. All AI agents and developers building interfaces for Crevy must adhere to these guidelines to ensure strict design consistency across public landing pages, dashboards, marketplaces, and user workflows.

---

## 1. Core Aesthetic & Brand Philosophy

- **Vibe:** Institutional-Grade, Industrial-Cinematic, Radically Transparent.
- **Visual Tone:** Technical precision meets editorial elegance. High contrast, sharp geometric layouts, monospaced telemetry, bold typography, and cinematic video backdrops.
- **Key Principles:**
  - **Zero Junk / Sharp Edge Precision:** Use sharp rectangular geometric shapes (`rounded-none` or subtle `rounded-sm`), sharp borders (`border-slate-800`, `border-brand`), and clean grid lines. Avoid overly rounded "soft SaaS" bubbles.
  - **Monospaced Telemetry:** All metrics, IDs, live states, and systemic data points must use `font-mono`, tabular figures (`tabular-nums`), and uppercase tracking.
  - **Editorial Contrast:** Combine `font-extrabold` headlines with high-chroma brand highlights (`text-brand`) or contrasting `italic font-light` phrases for editorial sophistication.

---

## 2. Color Palette & Tokens

| Token / Class | Color Code / Variable | Usage Guidance |
| :--- | :--- | :--- |
| `bg-brand` / `text-brand` / `border-brand` | `oklch(71.953% 0.1692 54.279)` | Primary vivid accent color for CTAs, live pulses, hero highlights, active state indicators. |
| `--color-myGreen` | `#2cc295` | Secondary eco/verification green token. |
| `--color-myDarkGreen` | `#178a74` | Dark green accent for environmental indicators. |
| `bg-slate-950` | `#020617` | Deep dark foundation for Hero, Cinematic sections, dark mode canvas. |
| `bg-slate-900` | `#0f172a` | Secondary dark container background, cards, header footers. |
| `bg-slate-50` | `#f8fafc` | Primary light section canvas for pitch decks, light mode lists. |
| `border-slate-800` / `border-slate-900` | — | Subtle, high-precision dark grid dividers and container borders. |

---

## 3. Typography Hierarchy

| UI Role | Tailwind Classes | Example Usage |
| :--- | :--- | :--- |
| **Hero Title (`h1`)** | `font-extrabold text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] tracking-tight` | Landing page main hero heading. Accentuate phrases with `<span className="text-brand">`. |
| **Section Title (`h2`)** | `font-bold text-3xl md:text-5xl text-slate-900 (or text-white on dark) tracking-tight` | Primary section headings. Pair with `<span className="italic font-light">` or `<span className="text-brand">`. |
| **Telemetry / Metadata** | `font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500` | Class IDs, Registry telemetry tags, status chips. |
| **Section Tag Badge** | `inline-flex items-center gap-3 px-4 py-2 border border-slate-700 bg-slate-900/50 backdrop-blur-md` | Micro-badges placed directly above primary headlines. |
| **Body Paragraph** | `text-base md:text-xl text-slate-300 font-light leading-relaxed` | Description text in hero blocks and feature sections. |

---

## 4. Component Patterns & UI Tokens

### Primary & Secondary Action Buttons
Buttons should feature sharp corners (`rounded-none`), bold uppercase lettering, and high tracking (`tracking-[0.2em]` or `tracking-widest`).

```tsx
/* Primary Brand CTA */
<Link
  href="/register"
  className="bg-brand text-slate-900 px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-colors text-center"
>
  Enter the Marketplace
</Link>

/* Secondary / Outline CTA */
<Link
  href="/register"
  className="border-white border text-white px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand hover:border-brand transition-colors text-center"
>
  Join Us
</Link>
```

### Telemetry Counter & Ledger Blocks
Live numbers should always be styled using monospaced font with tabular numbers to prevent jitter during updates.

```tsx
<div className="bg-brand p-8 flex flex-col justify-center">
  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 mb-4">
    Live Ledger Telemetry
  </p>
  <div className="font-mono text-4xl md:text-6xl text-white font-bold tracking-tight mb-2 tabular-nums">
    1,204,500
  </div>
  <p className="text-slate-900 text-xs font-mono uppercase tracking-widest">
    Tonnes of CO₂e Projected to be Retired
  </p>
</div>
```

### Marquee Tickers & Status Bands
System updates and registry tickers use horizontal streaming typography separated by four-pointed star glyphs (`✦`).

```tsx
<span className="text-slate-500 font-mono font-bold text-[10px] uppercase tracking-[0.2em] whitespace-nowrap">
  LIVE REGISTRY ✦ VERIFIED ASSETS ✦ NO DOUBLE COUNTING ✦ IMMUTABLE LEDGER ✦
</span>
```

---

## 5. Motion & Accessibility Guidelines

- **Framing & Video Overlays:** Video backdrops must use `mix-blend-luminosity opacity-40` (or `opacity-60`) within a `bg-slate-950` parent container to maintain high text contrast.
- **Reduced Motion Support:** Always respect user accessibility settings by checking Framer Motion's `useReducedMotion()`. Provide clean static fallbacks without continuous scroll transformations or complex physics loops.
- **Interactions:** Use clean, predictable transitions (`transition-colors duration-300` or smooth transform drifts `group-hover:translate-x-1`).

---

## 6. Rules for AI Agents

1. **Do NOT introduce generic rounded soft UI components** (e.g., `rounded-2xl` or `rounded-3xl` with soft drop shadows) when building Crevy feature components unless explicitly specified.
2. **Do NOT use standard blue/red colors for indicators**; rely on `slate-950`, `slate-900`, `slate-800`, `bg-brand`, and clean monochromatic slate scales.
3. **Always pair metrics and data fields with monospaced labels (`font-mono`)** and high letter-spacing (`tracking-widest`).
