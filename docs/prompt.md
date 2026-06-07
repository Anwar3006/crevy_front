# Project Detail System: Development Specification & Prompt

## 1. The Problem Statement
Crevy is a high-integrity carbon credit registry. We face a unique challenge: **Disintermediation Risk**.
If a corporate buyer (Organization) sees the exact GPS coordinates or the personal contact information of a smallholder project owner, they may attempt to bypass the platform to negotiate lower prices directly. 

To solve this, we require **two distinct versions** of the Project Detail page:
1.  **Marketplace View (Sales/Discovery)**: A public-facing, persuasive "Sales Deck" that uses regionalized data and scientific summaries to drive credit acquisitions without leaking proprietary owner info.
2.  **Administrative View (Oversight/Governance)**: A full-transparency, internal dossier used by Admins to manage the project owner, verify precise GPS boundaries, and review raw IoT/Satellite telemetry.

---

## 2. Technical Context & Data Models
The following fields are available in our PostgreSQL (Drizzle) backend. Use this as your context for data fetching and prop passing.

### A. The Project (`project` table)
- `id`, `code` (e.g., PRJ-GH-2026-001)
- `slug`: SEO-friendly name.
- `registryStatus`: `dmrv_verified` (IoT-proven), `registry_pending`, `registry_certified` (Verra/GS).
- `projectType`: `regenerative_agriculture`, `reforestation`, etc.
- `region`, `country`: Geographic metadata.
- `description`, `sdgs`: Narrative and impact tags.
- `totalAreaHectares`: Scale of the project.

### B. The Owner (`project_owner` table)
- `userId`: Link to the system user.
- `kycStatus`: `unverified`, `pending`, `verified`.
- `identityProof`: Cryptographic hash of the ID.

### C. The Science (`mrv_verification_result` table)
- `aiConfidenceScore`: The AI's certainty of the carbon sequestration.
- `hardwareIntegrity`: `SECURE`, `TAMPERED`.
- `netCreditsIssued`: The actual amount of carbon removed (AFTER buffer/leakage deductions).
- `predictionClass`: `baseline_consistent`, `anomaly_detected`.

### D. The Integrity (`mrv_blockchain` table)
- `merkleRoot`: The cryptographic root of the project data.
- `blockchainTxHash`: Proof of anchorage on Polygon.

---

## 3. UI/UX Requirements

### Visual Language: "Institutional Integrity"
- **Typography**: Serifs for headers (e.g., `font-serif`), sharp monospaced figures for metrics (`font-mono`).
- **Palette**: Abyssal Slate (`#020617`), Corporate Emerald (`#064e3b`), and clinical Slate Grays.
- **Atmosphere**: "The Economist meets a high-end Trading Desk." High contrast, extreme whitespace, and cryptographic badges.

### Page 1: Marketplace Sales View (`/marketplace/project/[slug]`)
*Goal: Persuade organizations to buy.*
- **Regionalized Map**: Show a blurred or large-circle region map instead of precise plot boundaries.
- **Impact Summary**: Prominent "Net Credits Available" and "SDG Alignment" badges.
- **Scientific Trust Section**: Display the "CraftedClimate AI Confidence Score" and "Hardware Security Status."
- **Anonymized Owner**: Refer to the owner by their ID/Code (e.g., "Originator GH-82") instead of name.
- **CTA**: High-visibility "Initiate Acquisition" button leading to checkout.

### Page 2: Admin Oversight View (`/projects/[id]`)
*Goal: Governance and management.*
- **Precise GIS**: Render exact polygon boundaries and GPS trails from the `farm_plot` table.
- **Identity Dossier**: Show the Project Owner's full name, contact info, and KYC status.
- **Raw Telemetry**: Display time-series charts of actual $CO_2$ and biomass readings.
- **Immutable History**: A vertical timeline of the `audit_log` for this project (who edited what and when).
- **CRUD Operations**: Admins must be able to edit `projectStatus`, `registryStatus`, and metadata.

---

## 4. Design Guidelines for the Agent
- Use **Tailwind CSS v4** (CSS variable-based).
- Components should be **React 19** compatible.
- Implement **Framer Motion** for institutional entrance animations (fade-in, slide-up).
- Ensure **Responsive Container** stability for all Recharts (use `isMounted` checks to prevent zero-dimension errors).
- All images must include the `sizes` prop if using `fill`.
- Handle **Unauthorized Roles**: If an non-admin tries to access the Admin View, redirect to `/404` or show a "Restricted Access" toast.

---

## 5. Development Prompt
> "Build the two project detail pages described above. 
> 1. Use the Marketplace Sales View for discovery, ensuring sensitive owner data is hidden and geographic data is regionalized. 
> 2. Use the Admin Oversight View for internal management, displaying full telemetry, exact GIS polygons, and the complete project audit log.
> 3. Enforce the 'Institutional Integrity' visual style. 
> 4. Ensure all chart components are wrapped in mounting guards.
> 5. Connect the Marketplace CTA to `/marketplace/checkout?projectId=[id]`."
