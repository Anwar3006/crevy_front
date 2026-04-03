# Crevy Landing Page — Generation Prompt

---

## 🎯 Context & Goal

You are building a **production-grade, visually stunning, mobile-first landing page** for **Crevy** — a platform that connects green project owners (farmers, reforesters, clean-energy operators) with companies looking to offset their carbon emissions by investing in verified carbon-credit projects.

The landing page will be inserted into an **existing Next.js 16 / React 19 app** that uses:

- **Tailwind CSS v4** (`@import "tailwindcss"`)
- **`framer-motion`** for animations and scroll effects (install it: `pnpm add framer-motion`)
- **`lucide-react`** for icons
- **`@hugeicons/react`** and **`@hugeicons/core-free-icons`** for additional icons
- **shadcn/ui** component library (Button, etc. already installed)
- **`next/image`** and **`next/link`** for optimised images and routing
- **`next/font/google`** for fonts — already loaded: `Geist` (sans) and `Geist_Mono`

The file you create will **replace** `src/app/page.tsx` in the project root.

---

## 🎨 Brand Identity

| Token              | Value                                   |
| ------------------ | --------------------------------------- |
| **Primary Green**  | `#2cc295` (`myGreen` in Tailwind theme) |
| **Dark Green**     | `#178a74` (`myDarkGreen`)               |
| **Dark Navy/Blue** | `#131927` (`myBlue`)                    |
| **White**          | `#FFFFFF`                               |
| **Off-white**      | `#F7FAF9`                               |

**Typography:**

- Display / hero headlines: `"Syne"` (Google Font — bold, geometric, modern — pair with Geist)
- Body / UI text: `Geist` (already loaded via `--font-geist-sans`)
- Import Syne at the top of the file: `import { Syne } from "next/font/google"`

**Tone:** Clean, nature-forward, authoritative, hopeful. Think editorial sustainability magazine meets fintech marketplace.

**Do NOT** use generic gradients like purple-on-white. Instead use the deep navy `#131927` as a dark background, fresh `#2cc295` as accent, and rich photography/video for visual depth.

---

## 📐 Page Architecture — Sections in Order

### 0. File Structure

Create the page as a **single `"use client"` file** at `src/app/page.tsx`. Import and compose all section components inline (no separate files needed). Each section should be a clearly named local React component (e.g. `function HeroSection()`, `function HowItWorksSection()`, etc.) composed inside the default export `function LandingPage()`.

---

### 1. 🔝 Navbar

**Behaviour:** Transparent on top of hero → transitions to a solid `#131927` background with a subtle `backdrop-blur` and a thin `1px` bottom border in `#2cc295/20` when user scrolls past 80px. Use `useScrollPosition` or a `useEffect` with `window.scrollY` listener to toggle the `scrolled` state.

**Layout:**

```
[ Logo "Crevy" ]  ←— left              [ Nav links — center ]              [ Login | Get Started ] ←— right
```

- **Logo:** Text-based. `"Crevy"` in `font-syne font-bold text-2xl`. When navbar is transparent: `text-white`. When scrolled: `text-[#2cc295]`.
- **Nav Links (desktop):** `Home`, `Marketplace`, `How It Works`, `About`, `Support`
  - Links map to: `/` , `/marketplace`, `/#how-it-works`, `/#about`, `/support`
  - Style: `text-sm font-medium text-white/80 hover:text-[#2cc295] transition-colors`
- **CTA Buttons:**
  - `Login` → `/login` — ghost style: `border border-white/30 text-white hover:bg-white/10`
  - `Get Started` → `/register` — filled: `bg-[#2cc295] text-white hover:bg-[#178a74]`
- **Mobile:** Hamburger icon (lucide `Menu` / `X`). Clicking opens a full-height slide-in drawer from the right. Drawer background: `#131927`. All nav links stacked vertically, large and touchable (`py-4`). CTA buttons stacked full-width at bottom of drawer.
- **Animation:** Use `framer-motion`'s `motion.nav` with `initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}` on mount.

---

### 2. 🎬 Hero Section

**Goal:** Instantly communicate the platform's purpose with stunning visuals and a powerful headline. Full-viewport, immersive.

**Layout:** Full-screen (`min-h-screen`). Background is a **looping `<video>` element** (autoPlay muted loop playsInline). Use a free stock video URL for placeholder — use this Pexels embed URL for a lush farm/green-field video:

```
https://videos.pexels.com/video-files/4629597/4629597-uhd_2560_1440_25fps.mp4
```

Alternatively fall back to a high-res background image from `/img/img/background.jpg` (already in the public folder) using `next/image` with `fill` and `objectFit="cover"`.

**Dark overlay:** A `div` with `absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#131927]/90` layered on top of the video.

**Content (centered, `z-10` above overlay):**

```
[ Animated pill badge: "🌿 Verified Carbon Credits · Africa's Green Marketplace" ]

[ H1 — Large display headline (Syne font) ]
  "Turn Green Projects
   Into Real Climate Impact"

[ Sub-heading (Geist, medium weight) ]
  "Crevy connects sustainable farmers, reforesters and clean-energy operators
   with forward-thinking companies ready to offset their carbon footprint —
   transparently, verifiably, and profitably."

[ CTA buttons row ]
  [ "Get Started — It's Free" (solid #2cc295) ]    [ "Explore Marketplace →" (outlined white) ]

[ Scroll-down animated indicator (bouncing chevron) ]
```

**Headline Animation:** Use Framer Motion. Each line of the H1 animates in with `y: 40 → y: 0, opacity: 0 → 1` with a staggered delay (0.1s between each word group). The badge, sub-heading, and buttons also stagger in after the headline.

**Stats Strip:** Pinned to the very bottom of the hero section, sitting just above the fold. A `flex` row of 3–4 stats inside a `backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl` card:

```
| 200+           | 50,000+ tCO₂e    | 80+                | 6                    |
| Active Projects| Carbon Offset     | Company Partners   | Project Categories   |
```

Each stat: label in small caps, value in Syne bold. Animate them counting up from 0 using a `useEffect` + `requestAnimationFrame` counter when they scroll into view (`useInView` from Framer Motion).

---

### 3. 🔄 How It Works Section

**id:** `how-it-works`

**Section headline:** `"How Crevy Works"` (centred, Syne)
**Sub-headline:** `"Whether you're a project owner or a corporate buyer, Crevy gives you a clear path to climate impact."`

**Layout:** Two tabs — **"I'm a Project Owner"** and **"I'm a Company"**. A pill-style `<TabSwitcher>` toggles between the two views. The active tab glows with `#2cc295`.

**Project Owner Tab — 4 Steps (horizontal timeline on desktop, vertical on mobile):**

1. 🧮 **Calculate Your Potential** — "Use our carbon calculator to estimate your project's sequestration capacity in tCO₂e."
2. 📋 **Register Your Project** — "Submit your project details — location, land type, practices, and supporting documents."
3. ✅ **Get Verified** — "Our auditors visit your site, confirm your data, and issue a verified carbon credit certificate."
4. 💰 **Earn Revenue** — "List your credits on the Crevy Marketplace and get paid when companies purchase them."

**Company Tab — 4 Steps:**

1. 🔍 **Explore the Marketplace** — "Browse verified green projects across Africa filtered by type, region, and impact."
2. 📊 **Assess Your Footprint** — "Use our carbon calculator to understand your company's emission baseline."
3. 🤝 **Invest in Projects** — "Purchase carbon credits directly from verified project owners."
4. 📈 **Track & Report Compliance** — "Get real-time analytics and compliance-ready reports for ESG goals."

**Card style per step:**

- Large step number in Syne (`text-6xl font-bold text-[#2cc295]/20`)
- Icon (`lucide-react`) above title
- Title in Syne medium weight
- Description in Geist small text, muted colour
- Card background: `bg-white` with `shadow-sm border border-gray-100 rounded-2xl p-6`
- Hover: slight `translateY(-4px)` lift with shadow deepening

**Animation:** Cards animate in from the bottom (`y: 60 → 0, opacity: 0 → 1`) as they enter the viewport using `motion.div` with `whileInView` and `viewport={{ once: true }}`. Stagger each card by `0.1s`.

---

### 4. 🌍 Project Types Section

**Headline:** `"Green Projects We Support"` (Syne, centred)
**Sub:** `"From regenerative farms to blue-carbon coastlines — every project type you can register on Crevy."`

**Layout:** A horizontally scrollable card carousel on mobile; a 3-column grid on desktop (`md:grid-cols-3`).

**6 Cards** (one per `projectTypeEnum` value from the backend schema):

| Project Type             | Icon (lucide) | Short Description                                                         | Background tint |
| ------------------------ | ------------- | ------------------------------------------------------------------------- | --------------- |
| Regenerative Agriculture | `Sprout`      | Soil-building farming practices that pull CO₂ into the earth.             | green           |
| Reforestation            | `Trees`       | Planting native forests to restore ecosystems and sequester carbon.       | emerald         |
| Renewable Energy         | `Sun`         | Solar, wind, and hydro installations replacing fossil fuels.              | yellow          |
| Biochar                  | `Flame`       | Converting organic waste into stable carbon-rich soil amendments.         | orange          |
| Blue Carbon              | `Waves`       | Mangrove and wetland restoration that locks carbon in coastal ecosystems. | blue            |
| Waste Management         | `Recycle`     | Methane capture and waste diversion from landfills.                       | teal            |

**Card design:**

- Aspect ratio ~4:3. Full-card background colour (soft tint, e.g. `bg-emerald-50`).
- Top half: large icon centred in a circle with the tint's full-saturation accent.
- Bottom half: project type name in Syne bold, short description in Geist.
- Bottom tag pill: `"Register This Type →"` linking to `/register`.
- Hover: background upgrades to full-saturation tint, icon circle scales up, text transitions to white.
- Use `motion.div whileHover={{ scale: 1.03 }}` for smooth hover.

---

### 5. 💡 Why Crevy Banner

**Background:** Full-width section with `bg-[#131927]` dark navy. Add a subtle green radial gradient glow at the top-left: `background: radial-gradient(ellipse at 0% 0%, rgba(44,194,149,0.15) 0%, transparent 60%), #131927`.

**Layout:** Two columns on desktop — left: large headline; right: 3 value-prop cards stacked vertically.

**Left column — headline:**

```
Why leading African companies
choose Crevy to reach
their net-zero goals.
```

(Syne, `text-4xl md:text-5xl font-bold text-white`)

Below the headline, a `text-white/60 text-lg` paragraph:

> "We've built the infrastructure that makes voluntary carbon markets accessible, transparent, and rewarding — for both project owners and corporate buyers."

A `"Learn More →"` link in `#2cc295` underline-on-hover.

**Right column — 3 value-prop cards** (dark glass cards: `bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm`):

1. **🔬 Science-Backed Verification** — "Every credit is verified by certified auditors using internationally recognised standards (VCS, Gold Standard)."
2. **⚡ Real-Time Impact Tracking** — "Dashboard analytics let companies monitor their offset portfolio and generate compliance-ready ESG reports instantly."
3. **🤝 Direct Project Investment** — "No brokers, no opaque fees. Your investment reaches project owners directly, ensuring maximum climate and community impact."

Each card: a left-border accent in `#2cc295` (`border-l-4 border-[#2cc295]`), icon in green, title in Syne white, description in `text-white/70`.

**Animation:** Left column slides in from the left, right column from the right, using `motion.div initial={{ x: ±60, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }}`.

---

### 6. 🔤 Scrolling Marquee

A horizontally looping text marquee strip. Background: `bg-[#2cc295]`. Text: `text-[#131927] font-syne font-bold text-xl uppercase`.

Content repeating indefinitely:

```
Carbon Credits  ✦  Verified Projects  ✦  Green Africa  ✦  Climate Impact  ✦  Net Zero  ✦  Regenerative Agriculture  ✦  Blue Carbon  ✦  Reforestation  ✦
```

Implement with a pure CSS `@keyframes marquee` scroll animation (no JS needed). Duplicate the text string twice side-by-side and animate with `translateX(0) → translateX(-50%)` over 30s linear infinite. This creates the seamless loop illusion.

---

### 7. 🌱 Featured Projects Section

**id:** `projects`

**Section headline:** `"Live Projects on the Marketplace"` (Syne, centred)
**Sub:** `"Real African green projects open for investment right now. Every project is verified before it goes live."`

**Layout:** 3-column grid on desktop (`md:grid-cols-3`), 1 column on mobile.

**3 Sample Project Cards** (hard-coded realistic data — these are placeholders until the API is wired up):

**Card 1:**

- Type: Regenerative Agriculture
- Name: "Kumasi Regenerative Farm"
- Location: Ashanti Region, Ghana 🇬🇭
- Area: 240 ha
- Estimated tCO₂e: 1,200 tCO₂e / yr
- Status badge: `Active` (green)

**Card 2:**

- Type: Reforestation
- Name: "Volta Basin Reforestation"
- Location: Volta Region, Ghana 🇬🇭
- Area: 500 ha
- Estimated tCO₂e: 3,500 tCO₂e / yr
- Status badge: `Under Review` (amber)

**Card 3:**

- Type: Renewable Energy
- Name: "Tema Solar Initiative"
- Location: Greater Accra, Ghana 🇬🇭
- Area: 15 ha (solar farm)
- Estimated tCO₂e: 800 tCO₂e / yr
- Status badge: `Active` (green)

**Card design:**

- Top: a `rounded-t-2xl` coloured gradient header band matching the project type colour (green for regen-ag, emerald for reforestation, amber for solar).
- Body: white `bg-white` card with `shadow-md rounded-b-2xl`.
- Project name in Syne semibold.
- Metadata rows: icon + label + value (e.g. `<MapPin size={14} /> Ashanti Region, Ghana`).
- Bottom: a thin `border-t` divider, then `tCO₂e / yr` in large bold green text + `"View Project →"` link.
- Hover: full card lifts with `boxShadow` increase and a thin `#2cc295` border.

**"View All Projects →"** CTA button centred below the grid, linking to `/marketplace`.

**Animation:** Cards fade+slide in from bottom with `whileInView` stagger.

---

### 8. 💬 Testimonials Section

**Headline:** `"Real Impact, Real People"` (Syne, centred)
**Sub:** `"Hear from project owners and companies already using Crevy."`

**Layout:** A 3-card carousel (scroll-snap on mobile; 3-up grid on desktop `md:grid-cols-3`).

**3 Testimonial Cards:**

1. **Daniel Asante** — Project Owner, Regenerative Farmer, Brong-Ahafo, Ghana

   > _"Crevy made it possible for me to turn 15 years of sustainable farming into a verified income stream. The verification process was thorough but fair — and I got paid within 30 days of my first credit sale."_

2. **Abena Mensah-Quartey** — Sustainability Director, Accra-based FMCG company

   > _"We needed a credible way to offset our Scope 3 emissions. Crevy gave us direct access to local African projects with full audit trails. Our ESG report practically writes itself now."_

3. **Kofi Amponsah** — Project Owner, Reforestation Lead, Volta Region
   > _"Before Crevy, I had no idea my tree-planting work could generate revenue. Now I have 3 verified projects on the marketplace and a growing portfolio of corporate buyers."_

**Card design:**

- `bg-white border border-gray-100 rounded-2xl p-8 shadow-sm`
- Large open-quote icon in `#2cc295` at the top
- Quote text in italic Geist
- Avatar circle + name + role at bottom (initials avatar with `bg-[#2cc295]/20 text-[#2cc295]` if no photo)
- Star rating: 5 filled stars in amber

---

### 9. 📣 Final CTA Banner

**Layout:** Full-width section, `min-h-[60vh]`. Background: a background image (use `/img/img/background.jpg` or a Pexels URL: `https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg`) with `object-fit: cover` and a dark overlay `bg-gradient-to-r from-[#131927]/95 via-[#131927]/80 to-transparent`.

**Content (left-aligned, white text):**

```
[ Label pill: "Join the Movement" in #2cc295 ]

[ H2 in Syne: ]
"Start Your Carbon Journey
 Today"

[ Body text: ]
"Whether you own a green project or run a company with a climate commitment,
 Crevy gives you the tools, the market, and the verification to make it real."

[ Two CTA buttons: ]
  [ "Register a Project" → /register ]   [ "Offset My Emissions" → /register ]
```

**Animation:** Left-to-right reveal using `motion.div` with `x: -60 → 0, opacity: 0 → 1` on `whileInView`.

---

### 10. 🦶 Footer

**Background:** `bg-[#131927]`

**Top strip:** A full-width `border-b border-white/10` row with the headline:

```
"Let's Build a Greener Africa Together."
```

(Syne `text-3xl md:text-4xl font-bold text-white` — left aligned; a `"Get in Touch →"` link in `#2cc295` on the right)

**Footer body — 4 columns on desktop, 2×2 on tablet, 1 column on mobile:**

**Column 1 — Brand:**

- `"Crevy"` in Syne bold white large
- `"by Foovante Global"` in muted small text
- Tagline: `"Connecting African green projects with global climate capital."` in `text-white/60 text-sm`
- Social icons (lucide `Twitter`, `Linkedin`, `Facebook` or use HugeIcons equivalents) — white, hover `#2cc295`

**Column 2 — Platform:**

- Heading: `"Platform"` in small-caps white
- Links: Marketplace, Carbon Calculator, How It Works, Register a Project, Login

**Column 3 — Company:**

- Heading: `"Company"`
- Links: About Us, Support, Terms & Conditions, Privacy Policy

**Column 4 — Contact:**

- Heading: `"Contact"`
- `📍 Accra, Greater Accra, Ghana`
- `📞 +(233) 504-609989`
- `📧 info@foovante-global.com`
- A small embedded Google Maps static image OR just the text is fine

**Bottom bar:** Full-width `border-t border-white/10` — `"Copyright © Foovante Global 2025. All rights reserved."` on the left. `"Terms | Privacy"` on the right. Both in `text-white/40 text-xs`.

---

## 🎞️ Global Animation Guidelines

Use `framer-motion` throughout. Key patterns to apply:

```tsx
// Standard reveal — use for most content blocks
const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  })
}

// Usage:
<motion.div
  variants={fadeUpVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-80px" }}
  custom={index}
>

// Smooth scroll — add to <html> or <body> via globals.css:
// html { scroll-behavior: smooth; }

// Page enter animation — wrap sections in:
<motion.section
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true }}
>
```

---

## 📱 Mobile-First Responsive Requirements

Every section MUST be designed mobile-first. Key breakpoints:

- **Base (mobile < 768px):** single column, generous padding `px-4 py-16`, touch targets ≥ 44px, no horizontal overflow
- **`md` (≥ 768px):** 2 columns where appropriate
- **`lg` (≥ 1024px):** full multi-column layouts, larger headlines

Specific mobile requirements:

- Navbar: hamburger → full-height slide-in drawer (Framer Motion `AnimatePresence` + `motion.div` with `x: "100%" → 0`)
- Hero headline: `text-3xl` on mobile → `text-6xl` on desktop
- Stats strip: 2×2 grid on mobile → single row on desktop
- How It Works steps: vertical timeline on mobile → horizontal on desktop
- Project cards: 1 column → 3 columns
- Footer: stacked single column → 4 columns

---

## ♿ Accessibility Requirements

- All images: meaningful `alt` text
- All interactive elements: keyboard-focusable with visible `focus-visible:ring-2 ring-[#2cc295]`
- Navbar: `role="navigation"` and `aria-label="Main navigation"`
- Mobile menu: `aria-expanded` toggle on hamburger button
- Sections: use semantic `<section>`, `<nav>`, `<header>`, `<footer>`, `<main>` HTML
- Heading hierarchy: H1 only in hero, H2 for section titles, H3 for card titles
- Colour contrast: all text meets WCAG AA minimum (4.5:1 for normal text)
- Motion: wrap all animations in `useReducedMotion()` check from Framer Motion — if user prefers reduced motion, skip animations

```tsx
import { useReducedMotion } from "framer-motion";
const shouldReduceMotion = useReducedMotion();
// Use shouldReduceMotion to conditionally disable/simplify animations
```

---

## ⚙️ Technical Notes

1. **File header:**

```tsx
"use client";

import { Syne } from "next/font/google";
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
```

Apply `syne.variable` to the root wrapper div's className.

2. **Tailwind custom colours** are already defined in `globals.css`:

```css
--color-myGreen: #2cc295;
--color-myDarkGreen: #178a74;
--color-myBlue: #131927;
```

Use `text-myGreen`, `bg-myGreen`, `bg-myBlue`, etc.

3. **No external UI library needed** beyond what's installed. Use plain Tailwind + Framer Motion.

4. **Video fallback:** If the video URL doesn't load, fall back to the background image `/img/img/background.jpg` using a `<div>` with Tailwind's `[url(/path-to-default.png)]` or a Next.js `<Image fill>`.

5. **Smooth scrolling** for nav anchor links (`/#how-it-works`, `/#about`): add `html { scroll-behavior: smooth; }` to `globals.css` and use Next.js `<Link href="/#how-it-works">`.

6. **`"use client"` is required** because this page uses `useState`, `useEffect`, `useRef`, and Framer Motion hooks.

7. **No `<form>` tags** — use `onClick` handlers on buttons for navigation.

8. **Import paths:** Use `@/` alias (already configured in `tsconfig.json`) e.g. `import { Button } from "@/components/ui/button"`.

---

## ✅ Final Checklist Before Outputting

Before finalising the code, ensure:

- [ ] `"use client"` at top
- [ ] `Syne` font imported and applied
- [ ] Navbar is transparent on mount → solid on scroll (useState + useEffect scroll listener)
- [ ] Mobile hamburger menu with AnimatePresence drawer
- [ ] Hero video with dark gradient overlay
- [ ] Stats counter animation on scroll-into-view
- [ ] How It Works section has two-tab switcher (Project Owner / Company)
- [ ] Scrolling marquee uses CSS keyframes (no JS)
- [ ] All 6 project type cards present
- [ ] All 3 testimonial cards present
- [ ] All section IDs present for anchor nav: `#how-it-works`, `#about`, `#projects`
- [ ] `whileInView` animations on all major sections with `viewport={{ once: true }}`
- [ ] `useReducedMotion()` guard applied
- [ ] Footer has all 4 columns: Brand, Platform, Company, Contact
- [ ] Copyright year: 2025, brand: Foovante Global
- [ ] No TypeScript errors (use proper types for all props and state)
- [ ] Fully responsive: tested mental model for mobile (<768px), tablet (768–1024px), desktop (>1024px)
- [ ] `aria-label`, `role`, `alt` tags on all interactive/media elements

---

_Prompt crafted for Crevy by Foovante Global · April 2026_
