# Crevy Green Economy Pilot — Implementation Checklist
### Investor Demo Readiness · Mid-Q2 Target

> **Pilot scope:** Green Economy sector only — specifically **Regenerative Agriculture** and **Renewable Energy**.
> All other sectors (Brown Economy, Blue Economy) are scaffolded in the UI but non-functional for this milestone.
> Backend API is v2 (`/api/v2`). Frontend currently calls `/api/v1`. **Every new piece of work targets v2.**

---

## How to read this document

- **[BE]** — backend task (crevy-backend `src/v2/`)
- **[FE]** — frontend task (crevy-frontend `src/`)
- **[BOTH]** — requires coordinated change in both repos
- `✅ Exists` — already built, may need minor adjustment
- `🔧 Needs fix` — exists but has a known issue
- `🆕 New` — does not exist yet, must be built

---

## Part 1 — Backend: New Tables & Model Changes

### 1.1 Project type taxonomy rename `[BE]`

**Why:** New sector taxonomy replaces the old flat enum.

- `🆕 New` Add `sector_enum` to `project.model.ts`:
  ```typescript
  export const sectorEnum = pgEnum('sector_enum', [
    'green_economy',   // Regen Agri + Renewable Energy — PILOT
    'brown_economy',   // formerly waste_management — scaffolded
    'blue_economy',    // formerly blue_carbon / water projects — scaffolded
  ])
  ```
- `🔧 Needs fix` Update `projectTypeEnum` in `project.model.ts` to new values:
  ```typescript
  export const projectTypeEnum = pgEnum('project_type_enum', [
    // Green Economy — PILOT (fully functional)
    'regenerative_agriculture',
    'renewable_energy',
    // Brown Economy — scaffolded only
    'waste_management',           // renamed from waste_management
    // Blue Economy — scaffolded only
    'water_projects',             // new
    'blue_carbon',                // kept
  ])
  ```
  > Remove: `biochar`, `reforestation` — not in the new taxonomy
  > The DB migration must use `ALTER TYPE ... ADD VALUE` for new values and
  > handle the removal of old ones with a data migration script.

- `🆕 New` Add `sector` column to the `project` table:
  ```typescript
  sector: sectorEnum('sector').notNull().default('green_economy'),
  ```
- `🆕 New` Add `pilotEnabled` boolean column:
  ```typescript
  pilotEnabled: boolean('pilot_enabled').notNull().default(false),
  ```
  Seed: set `true` for `regenerative_agriculture` and `renewable_energy`.
- `🔧 Needs fix` Update `project.schema.ts` Zod enum to mirror the new `projectTypeEnum` values.
- `🆕 New` Write and run Drizzle migration: `pnpm db:generate && pnpm drizzle-kit migrate`

---

### 1.2 Sustainable Practices table (ported from v1) `[BE]`

**Why:** v1 had `regenerative_practices` and `project_practices` tables. v2 dropped them but the pilot's
"Sustainable Practices documentation form" requires them to exist in v2 and be served by the v2 API.

- `🆕 New` Create `src/v2/projects/models/practice.model.ts`:
  ```typescript
  // Master list of recognised practices with their carbon impact factors.
  // Seeded from regenerative_practices.json in the frontend public folder.
  export const practice = pgTable('practice', {
    id:                uuid('id').primaryKey().$defaultFn(uuidv7PK),
    name:              varchar('name', { length: 255 }).notNull().unique(),
    description:       text('description'),
    applicableSectors: text('applicable_sectors').array(), // ['green_economy']
    carbonImpactFactor: decimal('carbon_impact_factor', { precision: 10, scale: 6 }),
    unit:              varchar('unit', { length: 50 }).default('tCO2e/ha/year'),
    isActive:          boolean('is_active').notNull().default(true),
    createdAt:         timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  })
  ```

- `🆕 New` Create `src/v2/projects/models/project_practice.model.ts`:
  ```typescript
  // Join table: records which practices a project uses and at what intensity.
  export const projectPractice = pgTable('project_practice', {
    id:                    uuid('id').primaryKey().$defaultFn(uuidv7PK),
    projectId:             uuid('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
    practiceId:            uuid('practice_id').notNull().references(() => practice.id, { onDelete: 'restrict' }),
    areaHectares:          decimal('area_hectares', { precision: 12, scale: 4 }).notNull(),
    intensity:             varchar('intensity', { length: 100 }).notNull(),
    methodology:           text('methodology'),         // free-text methodology description
    baselineInputs:        jsonb('baseline_inputs'),    // { soilCarbon, biomass, emissions }
    impactFactorAtSigning: decimal('impact_factor_at_signing', { precision: 10, scale: 6 }),
    createdAt:             timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt:             timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  })
  ```

- `🆕 New` Export both from `parent-model.ts`
- `🆕 New` Create `src/v2/projects/schemas/practice.schema.ts` (Zod)
- `🆕 New` Create `src/v2/projects/services/practice.service.ts`
- `🆕 New` Create `src/v2/projects/controllers/practice.controller.ts`
- `🆕 New` Add practice routes to `src/v2/projects/routes/project.route.ts`:
  ```
  GET  /api/v2/projects/practices              → list all active practices
  GET  /api/v2/projects/practices/:sector      → list by sector
  POST /api/v2/projects/:id/practices          → add a practice to a project
  GET  /api/v2/projects/:id/practices          → list project's practices
  PUT  /api/v2/projects/:id/practices/:pid     → update practice details
  DELETE /api/v2/projects/:id/practices/:pid   → remove a practice
  ```
- `🆕 New` Seed script: import `regenerative_practices.json` (already in frontend's `public/`) into the `practice` table

---

### 1.3 Project Document table (ported from v1) `[BE]`

**Why:** v1 had `project_document`. v2 has NO document storage. The pilot requires document upload
and verification checklist management.

- `🆕 New` Create `src/v2/projects/models/project_document.model.ts`:
  ```typescript
  export const documentTypeEnum = pgEnum('document_type_enum', [
    'project_design',
    'environmental_assessment',
    'land_ownership',
    'methodology_report',
    'baseline_study',
    'community_consent',
    'other',
  ])

  export const projectDocument = pgTable('project_document', {
    id:           uuid('id').primaryKey().$defaultFn(uuidv7PK),
    projectId:    uuid('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
    documentType: documentTypeEnum('document_type').notNull(),
    fileName:     varchar('file_name', { length: 255 }).notNull(),
    filePath:     varchar('file_path', { length: 500 }).notNull(),   // S3/storage URL
    fileSize:     integer('file_size').notNull(),                    // bytes
    mimeType:     varchar('mime_type', { length: 100 }),
    uploadedBy:   text('uploaded_by').notNull(),                     // FK → user.id
    isVerified:   boolean('is_verified').notNull().default(false),
    verifiedBy:   text('verified_by'),                               // FK → user.id (admin)
    verifiedAt:   timestamp('verified_at', { withTimezone: true }),
    uploadedAt:   timestamp('uploaded_at', { withTimezone: true }).notNull().defaultNow(),
  })
  ```

- `🆕 New` Export from `parent-model.ts`
- `🆕 New` Create `src/v2/projects/schemas/document.schema.ts`
- `🆕 New` Create `src/v2/projects/services/document.service.ts`
- `🆕 New` Create `src/v2/projects/controllers/document.controller.ts`
- `🆕 New` Add document routes to `project.route.ts`:
  ```
  POST   /api/v2/projects/:id/documents        → upload document (multipart/form-data)
  GET    /api/v2/projects/:id/documents        → list documents for a project
  GET    /api/v2/projects/:id/documents/:docId → download/get document metadata
  PATCH  /api/v2/projects/:id/documents/:docId/verify → admin verifies a document
  DELETE /api/v2/projects/:id/documents/:docId → delete a document
  ```

---

### 1.4 Project Admin Assignment `[BE]`

**Why:** Pilot requirement: "Project admin assigned: name, admin ID, email, contact number."
There is no project-level admin assignment in v2.

- `🆕 New` Create `src/v2/projects/models/project_admin.model.ts`:
  ```typescript
  export const projectAdmin = pgTable('project_admin', {
    id:        uuid('id').primaryKey().$defaultFn(uuidv7PK),
    projectId: uuid('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
    userId:    text('user_id').notNull(),   // FK → user.id (the assigned admin)
    assignedBy: text('assigned_by').notNull(),
    isActive:  boolean('is_active').notNull().default(true),
    assignedAt: timestamp('assigned_at', { withTimezone: true }).notNull().defaultNow(),
  }, (t) => [
    uniqueIndex('idx_project_admin_unique').on(t.projectId, t.userId),
  ])
  ```
- `🆕 New` Export from `parent-model.ts`
- `🆕 New` Add routes:
  ```
  POST   /api/v2/projects/:id/admins      → assign an admin to a project
  GET    /api/v2/projects/:id/admins      → list admins for a project
  DELETE /api/v2/projects/:id/admins/:uid → unassign an admin
  ```

---

### 1.5 Carbon Estimation fields on Project `[BE]`

**Why:** Pilot requires "basic emissions estimation and credit projection display."
v2's `project` table lacks the estimation fields that v1 had.

- `🔧 Needs fix` Add these columns to `project.model.ts` (ported from v1):
  ```typescript
  totalAreaHectares:          decimal('total_area_hectares', { precision: 12, scale: 4 }),
  baselineLandUse:            text('baseline_land_use'),
  baselineEmissionsYearly:    decimal('baseline_emissions_yearly', { precision: 12, scale: 4 }),
  estimatedTotalTco2e:        decimal('estimated_total_tco2e', { precision: 15, scale: 4 }).default('0'),
  verifiedTotalTco2e:         decimal('verified_total_tco2e',  { precision: 15, scale: 4 }).default('0'),
  // Regen Agri specific
  soilType:                   varchar('soil_type', { length: 100 }),
  initialSoilCarbonContent:   decimal('initial_soil_carbon_content', { precision: 10, scale: 4 }),
  expectedBiomassIncrease:    text('expected_biomass_increase'),
  cropLivestockTypes:         text('crop_livestock_types'),
  usesSyntheticFertilizers:   boolean('uses_synthetic_fertilizers').default(false),
  usesSyntheticPesticides:    boolean('uses_synthetic_pesticides').default(false),
  organicAmendments:          text('organic_amendments'),
  // Co-benefits
  socialEconomicBenefits:     text('social_economic_benefits'),
  supportsBiodiversityConservation: boolean('supports_biodiversity_conservation').default(false),
  supportsWaterManagement:    boolean('supports_water_management').default(false),
  sdgs:                       text('sdgs').array(),
  description:                text('description'),
  implementationPlan:         text('implementation_plan'),
  expectedOutcomes:           text('expected_outcomes'),
  gpsCoordinates:             text('gps_coordinates'),
  ```
- `🔧 Needs fix` Update `CreateProjectSchema` and `UpdateProjectSchema` Zod schemas to include all new fields

---

### 1.6 Update `axiosClient` base URL `[FE]`

- `🔧 Needs fix` Change `baseURL` in `src/lib/axiosClient.tsx` from `/api/v1` to `/api/v2`
  > This is the single switch that moves all API calls to the new backend.
  > Do this AFTER all v2 endpoints for the pilot are confirmed working.
  > Consider an env variable: `process.env.NEXT_PUBLIC_API_VERSION`

---

## Part 2 — Frontend: New Routes & Pages

### 2.1 Project type taxonomy update `[FE]`

- `🔧 Needs fix` Update `PROJECT_TYPES` in `src/constants/new-project.ts`:
  ```typescript
  export const PROJECT_TYPES = [
    // ── Green Economy (PILOT — fully functional) ──
    {
      id: 'regenerative_agriculture',
      sector: 'green_economy',
      title: 'Regenerative Agriculture',
      pilotEnabled: true,
      description: 'Restore soil health and capture carbon through sustainable farming practices.',
    },
    {
      id: 'renewable_energy',
      sector: 'green_economy',
      title: 'Renewable Energy',
      pilotEnabled: true,
      description: 'Generate clean power using solar, wind, or hydro-electric infrastructure.',
    },
    // ── Brown Economy (scaffolded — not functional in pilot) ──
    {
      id: 'waste_management',
      sector: 'brown_economy',
      title: 'Brown Economy — Waste Management',
      pilotEnabled: false,
      description: 'Coming soon: Reduce landfill reliance and capture methane emissions.',
    },
    // ── Blue Economy (scaffolded — not functional in pilot) ──
    {
      id: 'water_projects',
      sector: 'blue_economy',
      title: 'Blue Economy — Water Projects',
      pilotEnabled: false,
      description: 'Coming soon: Wetland restoration and clean water infrastructure.',
    },
    {
      id: 'blue_carbon',
      sector: 'blue_economy',
      title: 'Blue Economy — Blue Carbon',
      pilotEnabled: false,
      description: 'Coming soon: Mangrove and coastal ecosystem protection.',
    },
  ]
  ```

- `🔧 Needs fix` In `ProjectTypeStep` component: render non-`pilotEnabled` types as visually
  disabled cards with a "Coming Soon" badge. They must still render (for demo impressiveness)
  but clicking them should show a toast: "This sector is launching in a future phase."

- `🔧 Needs fix` Remove `biochar` and `reforestation` from `PROJECT_TYPES` (they no longer exist in the taxonomy)

---

### 2.2 Project registration form — wire to v2 API `[BOTH]`

The existing multi-step form at `/new-project` is well-built but calls v1. The v2 API has
a different request shape.

- `🔧 Needs fix` Update `ProjectService.createProject()` in `src/lib/services/project-service.tsx`:
  - Change endpoint from `/projects` to `/projects` (same, but now hits v2 via updated baseURL)
  - Map form fields to v2 schema:
    - `location` → split into `region` + `country` (v2 requires ISO-2 `country` code and free-text `region`)
    - `durationMonths` → derive `endDate`: `startDate + durationMonths`
    - `currencyId` → add a currency selector to the form (currently hardcoded, must match a real currency.id from `/api/v2/auth/currencies`)
    - `regenerativePractices` (array of strings) → POST to `/projects/:id/practices` as a separate request after project creation

- `🔧 Needs fix` Add `currencyId` field to `ProjectOverviewStep` component:
  - Fetch currencies from `GET /api/v2/auth/currencies` on mount
  - Render as a `<Select>` dropdown defaulting to GHS

- `🆕 New` Add `projectAdminId` field to the form (or admin assignment step):
  - For the pilot, this can be a text input for the admin's user ID
  - On submit, POST to `/api/v2/projects/:id/admins`

- `🔧 Needs fix` `SupportingDocumentsStep`: currently sends documents as `z.array(z.any())`.
  Change to multipart upload using `FormData` hitting `POST /api/v2/projects/:id/documents`

---

### 2.3 Project Profile page `[FE]`

**Route:** `/project-profile` (sidebar link already exists, page does not)

- `🆕 New` Create `src/app/(dashboard)/project-profile/page.tsx`
  - Fetch project owner's projects: `GET /api/v2/projects?createdBy=<userId>`
  - Display as a list/grid of project cards
  - Each card links to `/project-profile/[id]`

- `🆕 New` Create `src/app/(dashboard)/project-profile/[id]/page.tsx` — full project detail view:
  - **Overview tab:** name, type, sector badge, status badge, region/country, start date, area hectares, GPS
  - **Practices tab:** list of sustainable practices with methodology and baseline inputs
    - Fetch: `GET /api/v2/projects/:id/practices`
  - **Documents tab:** verification checklist — list of uploaded documents with verified/pending status
    - Fetch: `GET /api/v2/projects/:id/documents`
    - Each row: file name, type, upload date, verified badge or "Pending" pill
    - Upload button → triggers `SupportingDocumentsStep` logic inline
  - **Estimations tab:** estimated tCO₂e, baseline emissions, credit projection
    - Display `estimatedTotalTco2e` and `verifiedTotalTco2e` from the project record
    - Show a simple projection chart (bar chart: estimated vs verified, by year)
  - **Admin tab:** assigned admin's name, ID, email, contact number
    - Fetch: `GET /api/v2/projects/:id/admins` → join with user data
  - **Activity Timeline tab:** verification pipeline steps
    - Fetch: `GET /api/v2/projects/:id/activities`

---

### 2.4 Track Verification page `[FE]`

**Route:** `/track-verification` (sidebar link exists, page does not)

- `🆕 New` Create `src/app/(dashboard)/track-verification/page.tsx`
  - Fetch project owner's projects with their `projectStage`
  - Render a Kanban-style or stepper view with stages:
    `registration → active → verification → completed`
  - Each project card shows: name, type, stage pill, last activity date
  - Click → navigates to `/project-profile/[id]?tab=activity`

---

### 2.5 MRV Data Dashboard `[FE]`

**Route:** `/project-profile/[id]?tab=mrv` OR `/mrv/[projectId]`

- `🆕 New` Create MRV tab inside `project-profile/[id]/page.tsx` OR a standalone page
  - Fetch: `GET /api/v2/mrv/verifications/project/:projectId`
  - Fetch: `GET /api/v2/mrv/anchors/project/:projectId`
  - Fetch: `GET /api/v2/mrv/ingestions/project/:projectId`
  - Display:
    - Sensor status table: device ID, last ping, `geo_fence_status`, `hardware_integrity`
    - Latest verification card: `verification_status` badge, `net_credits_issued`, `ai_confidence_score`, methodology
    - Blockchain anchor card: `transaction_hash` (truncated, with copy button), `audit_uri` link, `vintage`, `batch_id`
    - Historical chart: `net_credits_issued` over time (one bar per verification batch)
  - For pilot demo: if no live data yet, show a clearly labelled "Awaiting first sensor reading" empty state
    with the ingestion event status

---

### 2.6 Add "Register Project" entry point to Dashboard `[FE]`

- `🔧 Needs fix` `ProjectOwnerDashboard` component:
  - If user has zero projects: show a prominent "Register Your First Project" CTA card
  - If user has projects: show a mini project list with status pills + a "+ New Project" button
  - Fetch: `GET /api/v2/projects` (filtered to `createdBy=<userId>`)

---

### 2.7 Marketplace filter update `[FE]`

- `🔧 Needs fix` Update filter in `marketplace/page.tsx` — `PROJECT_TYPES` now uses new taxonomy.
  Non-`pilotEnabled` types should still appear in the filter dropdown but have a
  "No projects yet" response rather than breaking.
- `🔧 Needs fix` `ProjectService.getMarketplaceProjects()` → update endpoint to `/api/v2/projects/marketplace`
  (ensure the v2 route exists with `projectStatus: 'active'` as default filter)

---

### 2.8 `project-service.tsx` additions `[FE]`

Add the following methods to `src/lib/services/project-service.tsx`:

```typescript
// Practices
getPractices: async (sector?: string) → GET /api/v2/projects/practices?sector=...
addPracticeToProject: async (projectId, data) → POST /api/v2/projects/:id/practices
getProjectPractices: async (projectId) → GET /api/v2/projects/:id/practices

// Documents
uploadDocument: async (projectId, formData) → POST /api/v2/projects/:id/documents (multipart)
getProjectDocuments: async (projectId) → GET /api/v2/projects/:id/documents

// MRV
getProjectVerifications: async (projectId) → GET /api/v2/mrv/verifications/project/:projectId
getProjectAnchors: async (projectId) → GET /api/v2/mrv/anchors/project/:projectId
getProjectIngestions: async (projectId) → GET /api/v2/mrv/ingestions/project/:projectId

// Project admin
assignAdmin: async (projectId, userId) → POST /api/v2/projects/:id/admins
getProjectAdmins: async (projectId) → GET /api/v2/projects/:id/admins
```

---

## Part 3 — Ordered Build Sequence (what to do first)

Sequenced by dependency and investor demo impact:

```
WEEK 1 — Backend foundation
───────────────────────────
[ ] 1.1  Rename project type enum + add sector column + migration
[ ] 1.5  Add estimation fields to project table + migration
[ ] 1.2  Port practices tables (practice, project_practice) to v2 + routes
[ ] 1.3  Port document table to v2 + routes (without file upload — return URL only)
[ ] 1.4  Add project_admin table + routes

WEEK 1 — Frontend: unblock the form
────────────────────────────────────
[ ] 2.1  Update PROJECT_TYPES constant (rename + disable non-pilot)
[ ] 2.2a Map form fields to v2 schema (location → region+country, add currencyId)
[ ] 2.2b Add practices POST after project creation
[ ] 1.6  Switch axiosClient baseURL to /api/v2

WEEK 2 — Frontend: investor-visible screens
────────────────────────────────────────────
[ ] 2.3  Project Profile page + tabs (Overview, Practices, Documents, Estimations, Admin, Activity)
[ ] 2.4  Track Verification page (Kanban/stepper)
[ ] 2.6  Dashboard quick-start CTA + project list
[ ] 2.8  Add all new service methods to project-service.tsx

WEEK 2 — MRV data display (can use mock data for demo if sensors not deployed)
────────────────────────────────────────────────────────────────────────────────
[ ] 2.5  MRV tab on Project Profile (sensor status, verification results, blockchain proof)
[ ] 2.7  Marketplace filter update for new taxonomy
```

---

## Part 4 — Data Gaps (things to resolve before demo)

| Gap | Impact | Resolution |
|---|---|---|
| `practice` table is empty | Practices form dropdown has no data | Seed from `public/regenerative_practices.json` immediately after table is created |
| `currency` table is empty | Project creation fails (currencyId FK) | Seed `USD`, `GHS`, `EUR` on first migration |
| No v2 marketplace endpoint | Marketplace page 404s after baseURL switch | Add `GET /api/v2/projects/marketplace` route (filter: status=active) |
| File upload infrastructure | Document upload has nowhere to store files | For pilot: accept base64 or a stub URL — use Supabase Storage or S3 in production |
| Auth userType mismatch | Dashboard renders wrong role view | `session.user.userType` from v1 doesn't exist in v2. Map v2 `roleId` → `userType` string in `AppSidebar` and `Dashboard` |
| `axiosClient` baseURL still `/api/v1` | Every API call goes to the old backend | Switch to `/api/v2` only after all required v2 endpoints are confirmed working |

---

## Part 5 — Files Changed Summary

### Backend (`crevy-backend/src/v2/`)

| File | Status |
|---|---|
| `projects/models/project.model.ts` | 🔧 Update enum + add columns |
| `projects/models/practice.model.ts` | 🆕 Create |
| `projects/models/project_practice.model.ts` | 🆕 Create |
| `projects/models/project_document.model.ts` | 🆕 Create |
| `projects/models/project_admin.model.ts` | 🆕 Create |
| `projects/schemas/practice.schema.ts` | 🆕 Create |
| `projects/schemas/document.schema.ts` | 🆕 Create |
| `projects/services/practice.service.ts` | 🆕 Create |
| `projects/services/document.service.ts` | 🆕 Create |
| `projects/controllers/practice.controller.ts` | 🆕 Create |
| `projects/controllers/document.controller.ts` | 🆕 Create |
| `projects/routes/project.route.ts` | 🔧 Add new routes |
| `projects/schemas/project.schema.ts` | 🔧 Update Zod schema |
| `parent-model.ts` | 🔧 Add new model exports |

### Frontend (`crevy-frontend/src/`)

| File | Status |
|---|---|
| `constants/new-project.ts` | 🔧 Update PROJECT_TYPES taxonomy |
| `lib/axiosClient.tsx` | 🔧 Switch baseURL to /api/v2 |
| `lib/services/project-service.tsx` | 🔧 Add new methods, map to v2 endpoints |
| `app/(project)/new-project/_components/ProjectTypeStep` | 🔧 Disable non-pilot types |
| `app/(project)/new-project/_components/ProjectOverviewStep` | 🔧 Add currencyId selector |
| `app/(project)/new-project/_components/SupportingDocumentsStep` | 🔧 FormData upload |
| `app/(dashboard)/project-profile/page.tsx` | 🆕 Create |
| `app/(dashboard)/project-profile/[id]/page.tsx` | 🆕 Create |
| `app/(dashboard)/track-verification/page.tsx` | 🆕 Create |
| `app/(dashboard)/dashboard/_components/ProjectOwnerDashboard.tsx` | 🔧 Add project list + CTA |

---

*Checklist prepared: May 2026 · Crevy Platform · Foovante Global*
*Pilot milestone: Green Economy — Regenerative Agriculture + Renewable Energy*
