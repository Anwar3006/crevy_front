# Comprehensive Prompt: Dynamic Role-Based Dashboard Transformation

You are a senior full-stack developer tasked with transforming the existing static dashboard of **Crevy** into a highly professional, dynamic, and role-based analytical platform.

## 🎯 Objective
Create a dashboard that serves three distinct user roles: **Carbon Project Owners**, **Companies (Offset Investors)**, and **Admins**. Each role must have a tailored interface, navigation, and set of analytical tools.

---

## 🛠 Technical Context
- **Framework:** Next.js 16 (App Router) / React 19.
- **Styling:** Tailwind CSS v4 (using custom tokens: `myGreen`, `myBlue`, `myDarkGreen`).
- **Icons:** Lucide React and HugeIcons.
- **Charts:** Use a high-quality library compatible with React 19 (e.g., Recharts or shadcn/ui charts).
- **Typography:** `Syne` for headings, `Geist` for body.
- **Auth:** Existing `authClient.useSession()` logic provides the `userType`.

---

## 📂 Role-Based Requirements

### 1. Carbon Project Owners (Farmers/Reforesters)
**Focus:** Project performance, revenue, and verification status.
- **Nav Items:** 
  - `Overview`: Key performance metrics.
  - `My Projects`: Management list of registered projects.
  - `Verification Center`: Track site visits and audit progress.
  - `Financials`: Credits sold vs. pending, revenue charts.
- **Analytics & Charts:**
  - **KPIs:** Total Credits Issued, Total Revenue, Active Land Area (ha), Pending Verifications.
  - **Charts:** 
    - *Revenue Growth*: Monthly income from credit sales (Area Chart).
    - *Sequestration Efficiency*: Actual vs. Estimated tCO2e removed (Bar Chart).
- **Actionable UI:** "Register New Project" floating action button.

### 2. Companies (Corporate Investors)
**Focus:** Offset portfolio management and ESG reporting.
- **Nav Items:**
  - `Overview`: Aggregate impact metrics.
  - `Offset Portfolio`: List of projects invested in with individual impact stats.
  - `Impact Reports`: Auto-generated, compliance-ready PDF/Web reports.
  - `Carbon Calculator`: Baseline emission tracking.
- **Analytics & Charts:**
  - **KPIs:** Total CO2e Offset (tons), Investment Value, ESG Score Contribution, Number of Supported Projects.
  - **Charts:**
    - *Portfolio Diversity*: Break down by project type (Regen-Ag, Blue Carbon, etc.) (Pie Chart).
    - *Monthly Offset Progress*: Progress toward net-zero goals (Linear Gauge or Bar Chart).
- **Actionable UI:** "Explore Marketplace" and "Generate ESG Report" buttons.

### 3. Admins (Portal Managers)
**Focus:** Platform health, user vetting, and system oversight.
- **Nav Items:**
  - `Overview`: Platform-wide aggregate data.
  - `User Management`: Vetting farmers and businesses.
  - `Project Vetting`: Approval workflow for new project submissions.
  - `Transaction Log`: Oversight of all marketplace activity.
- **Analytics & Charts:**
  - **KPIs:** Total Platform Volume (Credits/USD), New Users (Weekly), Pending Approvals, System Alerts.
  - **Charts:**
    - *User Growth*: Onboarding trends for Owners vs. Companies (Multi-line Chart).
    - *Platform Liquidity*: Credits listed vs. Credits purchased over time.
- **Actionable UI:** "Verify Project" and "Approve User" modals.

---

## 🎨 Design & Layout Requirements
1. **Dynamic Sidebar:** Use the existing `getSidebarConfig` in `src/constants/sidebar-items.ts`. Ensure it handles the new Admin items.
2. **Dashboard Shell:** Maintain the existing layout in `src/app/(dashboard)/layout.tsx`.
3. **Hero Section:** Update `HeroSection.tsx` to display role-specific welcoming messages and immediate "Next Steps" (e.g., Admin sees "You have 5 pending approvals").
4. **Data Visualization:** Cards should be "Glassmorphic" (bg-white/5, backdrop-blur) where appropriate, especially for stats. Charts should use the `myGreen` and `myBlue` palette.
5. **Responsiveness:** All charts and grids must be mobile-first.

---

## 📝 Implementation Tasks
1.  **Refactor Dashboard Page:** Update `src/app/(dashboard)/dashboard/page.tsx` to conditionally render the correct "Dashboard Strategy" based on `userType`.
2.  **Create Analytics Components:** Build reusable chart wrappers and stat card components.
3.  **Implement Admin Registration Flow:** Add "Admin" as an option in the registration process (`src/types/user.types.ts` already has the schema).
4.  **Mock Data Injection:** Use realistic mock data for the charts until the backend endpoints in `/Users/anwarsadat/Desktop/WORK/crevy-backend` are fully integrated.
5.  **Framer Motion:** Add entrance animations for all analytical cards (`y: 20 -> 0`, `opacity: 0 -> 1`).

---

## 🚀 Execution Goal
Deliver a fully functional, highly interactive dashboard where a user can log in and immediately understand their climate impact or operational responsibilities through beautiful data visualization.
