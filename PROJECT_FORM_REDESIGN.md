# Crevy v2 — Project Registration Redesign
### Aligned to CraftedClimate dMRV Architecture

> This document supersedes the practices/documents sections of `PILOT_CHECKLIST.md`.
> It is the definitive spec for the new project creation form and the backend changes needed to support it.

---

## Part 1 — What Changes and Why

### The fundamental shift

In v1, Crevy collected soil data, practice intensity, fertiliser usage, and biomass estimates because
**Crevy was computing carbon credits itself** using an internal calculator.

In v2, **CraftedClimate's sensors compute everything**. Worker 2 applies Verra VM0042 through their ML
model and returns `net_credits_issued`. Crevy's job at project registration is now:

1. Create a project identity record that maps to CraftedClimate's `CC-PROJECT-ID` namespace
2. Register the farm plot with verified GPS coordinates so CraftedClimate can pass their `geo_fence_status` check
3. Collect compliance documents (land rights, consent, site access) that carbon market registration requires
4. Capture enough context for the marketplace listing (what type of project, what practices, what impact)

That's it. No carbon math. No soil science forms. No methodology inputs.

---

## Part 2 — Backend Changes

### 2.1 Drop `practices` and `project_practices` tables

**Decision: Do NOT build these tables.**

The v1 `regenerativePractices` and `projectPractices` tables were carbon calculation inputs.
In v2, that calculation is fully owned by CraftedClimate. These tables have no role.

What you need instead is a **`practice_tags` JSONB array on the `project` table** — a simple list
of string tags like `['agroforestry', 'cover_cropping', 'rotational_grazing']` for marketplace display
and context for CraftedClimate's deployment team.

**Changes to `project.model.ts`:**

```typescript
// ADD these fields — they replace the old v1 complex carbon calculation columns
practiceTags:      jsonb('practice_tags').$type<string[]>().default([]),
description:       text('description'),           // project narrative for marketplace
sdgs:              text('sdgs').array(),           // co-benefits tagging
totalAreaHectares: decimal('total_area_hectares', { precision: 12, scale: 4 }),
gpsCoordinates:    text('gps_coordinates'),        // project centroid (separate from plot GPS)

// DO NOT ADD from v1:
// baselineEmissionsYearly  — CraftedClimate measures this
// estimatedTotalTco2e      — CraftedClimate calculates this
// soilType                 — sensor measures this
// initialSoilCarbonContent — sensor measures this
// expectedBiomassIncrease  — sensor measures this
// cropLivestockTypes       — absorbed into practiceTags
// usesSyntheticFertilizers — absorbed into practiceTags
// baselineLandUse          — absorbed into description
// implementationPlan       — not needed in v2
// expectedOutcomes         — not needed in v2
// durationMonths           — replaced by endDate
```

**The `verifiedTotalTco2e` concept:**
This is now derived, not stored. When displaying total verified credits for a project,
query `SUM(mrv_verification_result.net_credits_issued) WHERE project_id = ? AND verification_status = 'success'`.
No separate column needed.

---

### 2.2 Project document table — YES, build this

**Decision: Build `project_document` with exactly five document types.**

```typescript
// src/v2/projects/models/project_document.model.ts

export const documentTypeEnum = pgEnum('document_type_enum', [
  'land_ownership',           // proof of land rights — REQUIRED
  'community_consent',        // signed dMRV participation consent — REQUIRED
  'site_access_authorization',// permission for sensor deployment team — REQUIRED
  'national_id',              // KYC identity document — REQUIRED for farmer verification
  'site_photos',              // recent photographs of the land — OPTIONAL
])

export const projectDocument = pgTable('project_document', {
  id:           uuid('id').primaryKey().$defaultFn(uuidv7PK),
  projectId:    uuid('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  documentType: documentTypeEnum('document_type').notNull(),
  fileName:     varchar('file_name', { length: 255 }).notNull(),
  fileUrl:      varchar('file_url', { length: 500 }).notNull(),   // storage URL (S3/Supabase)
  fileSize:     integer('file_size').notNull(),                   // bytes
  mimeType:     varchar('mime_type', { length: 100 }),
  uploadedBy:   text('uploaded_by').notNull(),                    // FK → user.id
  isVerified:   boolean('is_verified').notNull().default(false),
  verifiedBy:   text('verified_by'),                             // FK → user.id (admin)
  verifiedAt:   timestamp('verified_at', { withTimezone: true }),
  uploadedAt:   timestamp('uploaded_at', { withTimezone: true }).notNull().defaultNow(),
})
```

**Why these five and no others:**

| Document | Why Required |
|---|---|
| `land_ownership` | Verra VM0042 and Gold Standard GS4GG both require proof of secure land rights as a baseline condition. CraftedClimate cannot register the project without it. |
| `community_consent` | Carbon market standards require informed consent from the community/landowner to the monitoring programme. Also a legal protection for Crevy. |
| `site_access_authorization` | CraftedClimate's field team needs written permission to enter the land and install sensors. An operational necessity. |
| `national_id` | Feeds directly into the `project_owner.verification_status` KYC workflow. Required to move status from `pending` → `verified`. |
| `site_photos` | Optional but powerful for marketplace trust. Buyers want to see what the land looks like before purchasing credits. |

**Document routes to add:**
```
POST   /api/v2/projects/:id/documents         → upload (multipart/form-data)
GET    /api/v2/projects/:id/documents         → list all documents for a project
PATCH  /api/v2/projects/:id/documents/:docId/verify → admin marks document as verified
DELETE /api/v2/projects/:id/documents/:docId  → delete
```

---

### 2.3 Updated `CreateProjectSchema` (Zod)

```typescript
export const CreateProjectSchema = z.object({
  body: z.object({
    // Core identity
    name:              z.string().min(1, 'Project name is required').max(255),
    projectType:       ProjectTypeSchema,
    sector:            SectorSchema,

    // Location — v2 uses separate fields, not a single string
    country:           z.string().length(2, 'Use ISO-2 country code e.g. GH'),
    region:            z.string().min(1, 'Region is required'),
    gpsCoordinates:    z.string().regex(/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/).optional(),

    // Timeline
    startDate:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate:           z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),

    // Scale
    totalAreaHectares: z.coerce.number().positive(),

    // Marketplace context
    practiceTags:      z.array(z.string()).default([]),
    description:       z.string().min(20, 'Please describe your project').max(1000),
    sdgs:              z.array(z.string()).default([]),

    // Financial
    currencyId:        z.number().int().positive(),
  }),
});
```

---

## Part 3 — New Project Creation Form (3 Steps)

The current form has 6 steps with 8 sub-steps. The new form has **3 steps**.
The form is simpler because CraftedClimate handles the science.

```
Step 1: Project Profile     → who you are, what you're doing, where
Step 2: Practices & Context → what practices, project description, SDGs
Step 3: Documents           → 4–5 specific document slots
         └── Review & Submit (inline at bottom of step 3)
```

---

### Step 1 — Project Profile

**Replaces:** `ProjectTypeStep` + `ProjectOverviewStep`

**Fields:**

```
[ Project Sector selector ]
  ○ Green Economy — Regenerative Agriculture  ← PILOT: enabled
  ○ Green Economy — Renewable Energy          ← PILOT: enabled
  ○ Brown Economy — Waste Management          ← Coming Soon: visually disabled
  ○ Blue Economy — Water Projects             ← Coming Soon: visually disabled
  ○ Blue Economy — Blue Carbon                ← Coming Soon: visually disabled

[ Project Name* ]
  text input — "Give your project a name"

[ Country* ]
  CountryDropdown — ISO-2 code, defaults to GH

[ Region / Area* ]
  text input — "e.g. Ashanti Region, Volta Basin"

[ Project Start Date* ]
  date picker

[ Project End Date ]
  date picker — optional

[ Total Land Area (hectares)* ]
  number input

[ GPS Coordinates ]
  text input — "lat, lng — e.g. 6.5244, -1.3792"
  info tooltip: "Your precise coordinates help our sensor team deploy accurately.
                 You can use Google Maps to find these."

[ Project Currency* ]
  dropdown — fetched from GET /api/v2/auth/currencies
  defaults to GHS
```

**What was removed from v1 and why:**
- `durationMonths` → replaced by explicit `endDate` (cleaner, v2 schema uses dates not months)
- `currentStatus` → meaningless at creation; all projects start as `draft`
- `gpsCoordinates` moved here from being buried in overview → it directly feeds `farm_plot` creation
- The form no longer asks the farmer to "select their project type" in a separate dedicated screen —
  it's the first field in the profile form, keeping the flow shorter

---

### Step 2 — Practices & Context

**Replaces:** `LandUseStep` + `SoilBiomassStep` + `CommunityStep` (all three collapse into one)

**What was deleted and why:**
- `SoilBiomassStep` — entirely eliminated. `soilType`, `initialSoilCarbonContent`, `expectedBiomassIncrease`, `cropLivestockTypes`, `usesSyntheticFertilizers`, `organicAmendments` are all measured by CraftedClimate's sensors. Asking a farmer for their soil carbon percentage is now meaningless overhead.
- `baselineLandUse` as a formal field — absorbed into the description
- `supportsBiodiversityConservation` / `supportsWaterManagement` boolean toggles — absorbed into SDG selection (if they pick SDG 6 Clean Water, that implies water management support)

**Fields:**

```
[ What practices are you applying? ]
  Hardcoded checkbox grid — NO API fetch needed, just constants by project type

  For Regenerative Agriculture:
    □ Agroforestry               □ Cover Cropping
    □ Rotational Grazing         □ Composting / Organic Amendments
    □ No-Till / Minimum Tillage  □ Intercropping
    □ Silvopasture               □ Riparian Buffers
    □ Other (text input)

  For Renewable Energy:
    □ Solar PV                   □ Wind Energy
    □ Small-Scale Hydro          □ Biogas / Biomass
    □ Off-Grid Electrification   □ Clean Cooking Fuel

[ Which UN Sustainable Development Goals does your project support? ]
  SDG multi-select (existing SDGSelection component — keep as-is)

[ Project Description* ]
  textarea — min 20 chars
  placeholder: "Describe what you're doing on this land, why it matters,
                and what you hope to achieve for your community."
  This replaces description + implementationPlan + expectedOutcomes from v1 (all three
  collapsed into one human narrative — much better for a marketplace listing anyway)
```

---

### Step 3 — Documents

**Replaces:** `SupportingDocumentsStep`

The current step is a generic bulk uploader with no type awareness. The new step
has **dedicated upload slots per document type** so farmers know exactly what is needed
and admins can verify each type individually.

```
┌─────────────────────────────────────────────────────────────────┐
│  Documents Checklist                                            │
│  Upload the documents below to complete your registration.      │
│  Required documents are marked with *.                          │
└─────────────────────────────────────────────────────────────────┘

┌─── REQUIRED ──────────────────────────────────────────────────┐
│                                                               │
│  📄 Land Ownership Proof *                                    │
│  ─────────────────────────────────────────────────────────    │
│  Accepted: title deed, land certificate, lease agreement,     │
│  or a signed letter from the chief/community confirming       │
│  your rights to use the land.                                 │
│  [ Upload File ↑ ]    [ ✓ land-title.pdf  2.3MB  × ]         │
│                                                               │
│  📋 Community / Landowner Consent Form *                      │
│  ─────────────────────────────────────────────────────────    │
│  Signed consent to participate in the Crevy dMRV programme    │
│  and allow sensor deployment on your land.                    │
│  [ Download Template ] [ Upload Signed Copy ↑ ]              │
│                                                               │
│  🔑 Site Access Authorization *                               │
│  ─────────────────────────────────────────────────────────    │
│  Written permission for our technical team to access your     │
│  land to install monitoring sensors.                          │
│  [ Download Template ] [ Upload Signed Copy ↑ ]              │
│                                                               │
│  🪪 National ID / Business Registration *                     │
│  ─────────────────────────────────────────────────────────    │
│  Your national ID card, passport, or business registration    │
│  certificate. Required to verify your identity.              │
│  [ Upload File ↑ ]                                            │
│                                                               │
└───────────────────────────────────────────────────────────────┘

┌─── OPTIONAL ──────────────────────────────────────────────────┐
│                                                               │
│  📷 Site Photographs                                          │
│  ─────────────────────────────────────────────────────────    │
│  Recent photos of your land. Helps buyers understand your     │
│  project and increases trust on the marketplace.             │
│  Accepted: JPG, PNG — up to 5 images, max 10MB each.         │
│  [ Upload Photos ↑ ]                                          │
│                                                               │
└───────────────────────────────────────────────────────────────┘

[ ← Back ]                              [ Submit Project → ]
```

**UX notes:**
- "Download Template" links for consent form and site access authorization — provide pre-filled PDF templates from Crevy
- Each slot shows ✓ green when uploaded, ○ grey when empty, required slots block submission if empty
- The submit button is disabled until all four required slots have an uploaded file
- After successful form submission, trigger a second API call to upload each file via `POST /api/v2/projects/:id/documents` (multipart) — do NOT try to send files in the same request as project creation

---

## Part 4 — Updated `new-project.ts` Constants

```typescript
// src/constants/new-project.ts — REPLACE the current file

export const SECTORS = [
  { id: 'green_economy', label: 'Green Economy', pilotEnabled: true },
  { id: 'brown_economy', label: 'Brown Economy', pilotEnabled: false },
  { id: 'blue_economy',  label: 'Blue Economy',  pilotEnabled: false },
]

export const PROJECT_TYPES = [
  {
    id:           'regenerative_agriculture',
    sector:       'green_economy',
    title:        'Regenerative Agriculture',
    pilotEnabled: true,
    icon:         '/icons/3d-leaf.png',
    description:  'Restore soil health and sequester carbon through sustainable farming.',
  },
  {
    id:           'renewable_energy',
    sector:       'green_economy',
    title:        'Renewable Energy',
    pilotEnabled: true,
    icon:         '/icons/3d-renewable.png',
    description:  'Generate clean power using solar, wind, or hydro infrastructure.',
  },
  {
    id:           'waste_management',
    sector:       'brown_economy',
    title:        'Waste Management',
    pilotEnabled: false,
    icon:         '/icons/3d-waste.png',
    description:  'Coming soon — methane capture and waste diversion.',
  },
  {
    id:           'water_projects',
    sector:       'blue_economy',
    title:        'Water Projects',
    pilotEnabled: false,
    icon:         '/icons/blue-carbon.png',
    description:  'Coming soon — clean water infrastructure and wetland restoration.',
  },
  {
    id:           'blue_carbon',
    sector:       'blue_economy',
    title:        'Blue Carbon',
    pilotEnabled: false,
    icon:         '/icons/blue-carbon.png',
    description:  'Coming soon — mangrove and coastal ecosystem protection.',
  },
]

// Practices by project type — hardcoded, no API needed
export const PRACTICES_BY_TYPE: Record<string, string[]> = {
  regenerative_agriculture: [
    'Agroforestry',
    'Cover Cropping',
    'Rotational Grazing',
    'Composting / Organic Amendments',
    'No-Till / Minimum Tillage',
    'Intercropping',
    'Silvopasture',
    'Riparian Buffers',
  ],
  renewable_energy: [
    'Solar PV',
    'Wind Energy',
    'Small-Scale Hydro',
    'Biogas / Biomass',
    'Off-Grid Electrification',
    'Clean Cooking Fuel',
  ],
}

export const DOCUMENT_TYPES = [
  {
    id:          'land_ownership',
    label:       'Land Ownership Proof',
    description: 'Title deed, land certificate, lease agreement, or signed community letter.',
    required:    true,
    hasTemplate: false,
    accept:      '.pdf,.jpg,.jpeg,.png',
  },
  {
    id:          'community_consent',
    label:       'Community / Landowner Consent Form',
    description: 'Signed consent to participate in the dMRV programme.',
    required:    true,
    hasTemplate: true,
    templateUrl: '/templates/consent-form.pdf',
    accept:      '.pdf',
  },
  {
    id:          'site_access_authorization',
    label:       'Site Access Authorization',
    description: 'Written permission for sensor deployment team.',
    required:    true,
    hasTemplate: true,
    templateUrl: '/templates/site-access-form.pdf',
    accept:      '.pdf',
  },
  {
    id:          'national_id',
    label:       'National ID / Business Registration',
    description: 'National ID card, passport, or business certificate.',
    required:    true,
    hasTemplate: false,
    accept:      '.pdf,.jpg,.jpeg,.png',
  },
  {
    id:          'site_photos',
    label:       'Site Photographs',
    description: 'Recent photos of your land. Up to 5 images.',
    required:    false,
    hasTemplate: false,
    accept:      '.jpg,.jpeg,.png',
    multiple:    true,
    maxFiles:    5,
  },
]

// Zod schema — clean v2 version
export const createProjectSchema = z.object({
  // Step 1 — Project Profile
  projectType:       z.string().min(1, 'Select a project type'),
  sector:            z.string().min(1, 'Sector is required'),
  name:              z.string().min(1, 'Project name is required').max(255),
  country:           z.string().length(2, 'Select a country'),
  region:            z.string().min(1, 'Region is required'),
  gpsCoordinates:    z.string().regex(/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/).optional().or(z.literal('')),
  startDate:         z.coerce.date(),
  endDate:           z.coerce.date().optional(),
  totalAreaHectares: z.coerce.number().positive('Area must be greater than 0'),
  currencyId:        z.coerce.number().int().positive('Select a currency'),

  // Step 2 — Practices & Context
  practiceTags:  z.array(z.string()).default([]),
  description:   z.string().min(20, 'Please describe your project').max(1000),
  sdgs:          z.array(z.string()).default([]),

  // Step 3 — Documents (tracked client-side as File objects, uploaded separately after project creation)
  documents: z.record(z.string(), z.instanceof(File).nullable()).default({}),
  // key = document_type id (e.g. 'land_ownership'), value = File or null
})

export type TCreateProject = z.infer<typeof createProjectSchema>
```

---

## Part 5 — Frontend Files to Delete

These files are no longer needed in v2. **Delete them:**

| File | Reason |
|---|---|
| `_components/LandUseStep.tsx` | Replaced by simplified practices section in Step 2 |
| `_components/SoilBiomassStep.tsx` | Entirely redundant — CraftedClimate measures everything this collected |
| `_components/CommunityStep.tsx` | Replaced by combined Step 2 |
| `_components/SupportingDocumentsStep.tsx` | Replaced by new typed document slots in Step 3 |
| `_components/ProjectTypeStep.tsx` | Merged into Step 1 |
| `_components/ProjectOverviewStep.tsx` | Replaced by Step 1 |

**Files to keep:**
- `_components/ReviewStep.tsx` — update to show new fields only
- `_components/SidebarProgress.tsx` — update step count from 4 to 3
- `_components/ProcessingStep.tsx` — keep as-is
- `_components/SDGSelection.tsx` — keep as-is, used in Step 2

---

## Part 6 — Files to Create

```
src/app/(project)/new-project/_components/
  ├── Step1_ProjectProfile.tsx     ← replaces ProjectTypeStep + ProjectOverviewStep
  ├── Step2_PracticesContext.tsx   ← replaces LandUseStep + SoilBiomassStep + CommunityStep
  └── Step3_Documents.tsx          ← replaces SupportingDocumentsStep
```

### `new-project/page.tsx` — updated step orchestration

```typescript
const STEPS = ['Project Profile', 'Practices & Context', 'Documents']

// Step 0: Step1_ProjectProfile
// Step 1: Step2_PracticesContext
// Step 2: Step3_Documents (includes inline review + submit)

const onSubmit = async (data: TCreateProject) => {
  // 1. POST /api/v2/projects — create the project record
  const project = await ProjectService.createProject({
    projectType:       data.projectType,
    sector:            data.sector,
    name:              data.name,
    country:           data.country,
    region:            data.region,
    gpsCoordinates:    data.gpsCoordinates,
    startDate:         format(data.startDate, 'yyyy-MM-dd'),
    endDate:           data.endDate ? format(data.endDate, 'yyyy-MM-dd') : undefined,
    totalAreaHectares: data.totalAreaHectares,
    practiceTags:      data.practiceTags,
    description:       data.description,
    sdgs:              data.sdgs,
    currencyId:        data.currencyId,
  })

  // 2. Upload documents one by one — each is a separate multipart POST
  const uploadPromises = Object.entries(data.documents)
    .filter(([_, file]) => file !== null)
    .map(([documentType, file]) => {
      const formData = new FormData()
      formData.append('file', file!)
      formData.append('documentType', documentType)
      return ProjectService.uploadDocument(project.data.id, formData)
    })
  await Promise.all(uploadPromises)

  // 3. Redirect to the new project profile page
  router.push(`/project-profile/${project.data.id}`)
}
```

---

## Part 7 — API Calls Made by the Form

| Step | Trigger | Endpoint | Purpose |
|---|---|---|---|
| Step 1 mount | once | `GET /api/v2/auth/currencies` | Populate currency dropdown |
| Submit | on form submit | `POST /api/v2/projects` | Create project record |
| Submit | after project created | `POST /api/v2/projects/:id/documents` × N | Upload each document file |
| After all uploads | redirect | — | Navigate to `/project-profile/:id` |

No API calls during form navigation. No prefetching practices from the backend.

---

*Document updated: May 2026 · Crevy Platform · Foovante Global*
*Reflects CraftedClimate dMRV architecture — Verra VM0042 / Gold Standard GS4GG*
