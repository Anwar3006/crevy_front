# Crevy Platform — ERD Analysis, Schema Review & Refactor Recommendation

> **Reference:** `foovante_cdms_ERD.png` · `CraftedClimate_dMRV_Docs.pdf` · Existing backend: `crevy-backend` · Existing frontend: `crevy-frontend`

---

## Part 1 — ERD Breakdown by Category

---

### 🏗️ Category 1: Core Infrastructure

These tables form the foundational layer that every other domain depends on. Nothing works without them.

---

#### `users`
**Purpose:** The master identity record for every human actor on the platform — project owners (farmers/project leads), company buyers, admin staff, and partner agents. Stores credentials, contact info, role assignment, and financial defaults (default currency).

**Why we need it:** Every action on the platform is traceable to a user. It is the single source of truth for identity and is referenced by nearly every other table. The `role` field combined with the `roles` table governs what each user can see and do.

---

#### `roles`
**Purpose:** Defines the named roles on the platform (e.g. `farmer`, `company_buyer`, `admin`, `verifier`, `partner_agent`). A simple lookup table with `role_id` and `role_name`.

**Why we need it:** Decouples role definitions from the `users` table. Makes it easy to add new roles without schema changes to `users`. Drives the RBAC (Role-Based Access Control) system together with `role_permissions`.

---

#### `role_permissions`
**Purpose:** A permission matrix that maps each role to specific resource-action pairs. Columns: `role_id`, `resource` (e.g. `projects`, `carbon_credits`), `can_read`, `can_write`, `can_delete`.

**Why we need it:** Fine-grained access control. Instead of hard-coding "admins can do X" in application code, the database stores the truth. This means changing what a `verifier` can access is a data change, not a deployment.

---

#### `currencies`
**Purpose:** A reference table of supported currencies (`currency_code` like `USD`, `GHS`, `EUR`, `KES`), their names, and an `is_active` flag.

**Why we need it:** The platform operates across African countries with different local currencies and allows credit pricing in multiple currencies. Every financial table (`carbon_credits`, `contracts`, `farmer_payouts`, `financial_records`) references `currency_id` from here to avoid magic strings.

---

#### `partners`
**Purpose:** Represents external partner organisations — the dMRV provider (CraftedClimate), auditing bodies, certification registries, or B2B channel partners who onboard farmers on behalf of Crevy. Key fields: `partner_type`, `country`, `status`, `default_currency_id`, `data_sharing_agreement`.

**Why we need it:** Crevy is not the only actor in the system. CraftedClimate is a registered partner that owns the sensor network, runs the AI verification engine, and anchors credits to the blockchain. Every API credential, webhook endpoint, and integration contract with them is tracked here. Other partners who bring farmers onto the platform are also registered here, enabling commission tracking and accountability.

---

#### `audit_logs`
**Purpose:** An immutable application-level change-log that records every create/update/delete action performed by Crevy users and services. Fields: `user_id`, `action`, `table_name`, `record_id`, `old_value`, `new_value`, `ip_address`, `created_at`.

**Why we need it:** This is Crevy's own platform audit trail — distinct from the dMRV chain-of-custody that CraftedClimate manages. It covers business actions: who changed a project's status, who issued a credit, who approved a payout. Carbon market regulators and corporate ESG auditors need to trace every business decision, not just sensor readings.

---

#### `notifications`
**Purpose:** Stores in-app and push notifications for users. Fields: `user_id`, `message`, `status` (unread/read), `created_at`.

**Why we need it:** Users need real-time feedback on project status changes (e.g. "your project has been approved"), payout events, new contract offers, and critically — dMRV webhook events (e.g. "verification completed for Plot X: 0.00013 tCO₂e issued"). This table backs the notification bell in the dashboard UI.

---

### 👨‍🌾 Category 2: Farmer Management

This domain manages the farmers (project owners / green project leads) and the physical land they operate on.

---

#### `farmers`
**Purpose:** An extended profile for users whose `role` is farmer/project owner. Stores operational details that don't belong in `users`: `farmer_code`, GPS coordinates of the farmer's primary location, `village`, `region`, bank and mobile money details for payouts, `verification_status` (KYC), and `onboarded_by_partner_id`.

**Why we need it:** Not every user is a farmer. Separating farmer-specific fields into their own table keeps `users` lean and makes farmer-specific queries clean. The `onboarded_by` field tracks whether a partner brought them in (important for commission calculations).

---

#### `farm_plots`
**Purpose:** Represents individual, physically distinct parcels of land owned or managed by a farmer. Each plot has its own GPS coordinates (`latitude`, `longitude`), `area_hectares`, and belongs to a `farmer_id`.

**Why we need it:** One farmer can have multiple non-contiguous plots. A project can span multiple plots. This is especially important for the dMRV integration: CraftedClimate's sensors are deployed at GPS coordinates, and the `geo_fence_status: "VALID"` check in their verification payload validates that sensor readings are coming from within the boundaries of a registered plot. Without `farm_plots` you cannot perform that mapping.

---

#### `farmer_assignments`
**Purpose:** Links a farmer to a partner organisation or agent. Fields: `farmer_id`, `agent_id` (a user acting as agent), `partner_id`, `assignment_type`, `assigned_date`, `is_b2c_assignment`.

**Why we need it:** Farmers are often onboarded and managed by field agents working for partner organisations. This table records who is responsible for a farmer, enabling commission tracking, agent performance reports, and accountability in case of disputes.

---

### 📁 Category 3: Project Management

The core operational domain. A project is the unit of carbon credit generation.

---

#### `projects`
**Purpose:** The central record for a carbon sequestration or emissions-reduction project. Stores `project_code`, `project_name`, `project_type` (agriculture, reforestation, solar, etc.), `project_stage`, `region`, timeline (`start_date`, `end_date`), estimated and actual credit quantities, `currency_id` for pricing, and audit metadata.

**Why we need it:** This is the core entity buyers browse in the marketplace and farmers register. Everything else — activities, credits, dMRV results, financials — hangs off a project. The `project_code` on Crevy maps to CraftedClimate's `CC-PROJECT-ID-001` reference in their payloads, making this the critical join key between the two systems.

---

#### `project_farmers`
**Purpose:** A many-to-many join table between `projects` and `farmers`. Fields: `project_id`, `farmer_id`, `joined_date`, `participation_status`, `project_land_size_hectares`.

**Why we need it:** A single carbon project can involve dozens of smallholder farmers, each contributing their plot. This table tracks participation, individual land contributions, and allows payout calculations to be split correctly between farmers in the same project when CraftedClimate issues credits at the project batch level.

---

#### `project_activities`
**Purpose:** A time-stamped log of discrete activities carried out within a project. Fields: `project_id`, `activity_name`, `activity_date`, `status`.

**Why we need it:** Projects have operational milestones — sensor installation, soil sampling, tree planting, auditor site visit, etc. This table tracks progress and gives buyers and admins visibility into what is happening on the ground. It feeds the "Track Verification" feature on the dashboard.

---

### 💚 Category 4: Carbon Credits

The financial heart of the platform. Credits are the product being created, verified, and traded.

> ⚠️ **Important update:** With the CraftedClimate dMRV integration, the authoritative source for credit quantities is **no longer Crevy's internal carbon calculator**. CraftedClimate's Worker 2 performs the scientific calculation and outputs `net_credits_issued` (already accounting for leakage deduction and buffer contribution). Crevy's role in credit issuance is to receive that number via webhook, write it into the tables below, and manage the marketplace and ownership lifecycle from that point forward.

---

#### `carbon_credits`
**Purpose:** Represents an individual, uniquely serialised carbon credit (1 credit = 1 tCO₂e). Fields: `project_id`, `credit_serial_number`, `credit_amount`, `credit_vintage` (year the carbon was sequestered), `credit_status` (available / reserved / sold / retired), `verification_date`, `issuance_date`, `current_owner_id`, `registry` (Verra, Gold Standard), and critically — `mrv_batch_id` and `blockchain_tx_hash` (from the CraftedClimate blockchain payload).

**Why we need it:** Credits must be individually traceable from issuance to retirement. The `credit_serial_number` is Crevy's internal ID, but `blockchain_tx_hash` and `mrv_batch_id` provide the immutable external proof from CraftedClimate's Polygon anchor. When a corporate auditor asks "prove this credit is real", you show them the blockchain transaction hash.

**How it gets populated:** When Crevy receives a CraftedClimate `blockchain` webhook with `verification_status: SUCCESS`, the backend reads `net_credits_issued`, creates that many `carbon_credits` rows, and writes the `transaction_hash`, `batch_id`, `merkle_root`, and `audit_uri` onto each row.

---

#### `credit_transactions`
**Purpose:** Records every purchase, transfer, or retirement event for carbon credits. Fields: `transaction_ref`, `credit_id`, `buyer_id`, `seller_id`, `quantity`, `price_per_credit`, `total_amount`, `currency_id`, `transaction_date`, `status`, `is_internal_sale`.

**Why we need it:** The marketplace operates on credits changing hands. This table is Crevy's sales ledger — every sale, price, buyer, seller, and timestamp is immutable once written. Double-counting prevention at the blockchain level (CraftedClimate's Polygon anchor) is complemented by Crevy's own ledger preventing the same `carbon_credits` row from being sold twice.

---

#### `verifications`
**Purpose:** Stores the formal verification outcome for each project, backed by CraftedClimate's dMRV result. Fields: `project_id`, `verifier_partner_id` (CraftedClimate's `partner_id`), `verification_event_id` (CraftedClimate's `v-verify-uuid-XXXXX`), `methodology_applied` (e.g. "Verra VM0042 v2.2"), `verification_date`, `verification_status` (SUCCESS / FLAGGED / FAILED), `notes`.

**Why we need it:** This is Crevy's business-layer record of verification outcomes. It references CraftedClimate as the verifying partner and stores their `verification_event_id` so you can always correlate back to their records. A project can have many verifications over its lifetime (one per dMRV batch cycle). No verification with `status: SUCCESS` = no credit issuance.

---

### 💰 Category 5: Financials

Handles all money movement on the platform — both what farmers earn and what the platform records.

---

#### `farmer_payouts`
**Purpose:** Records individual payment disbursements to farmers. Fields: `farmer_id`, `project_id`, `transaction_id` (links back to a `credit_transaction`), `payout_amount`, `currency_id`, `payout_date`, `payout_method` (bank transfer, mobile money), `status` (pending / paid / failed), `notes`.

**Why we need it:** When a company buys credits from a project, the proceeds need to be distributed to the farmers who generated them (after platform fees). This table tracks what each farmer was paid, when, and through which channel. It is the source of truth for farmer income reporting.

---

#### `financial_records`
**Purpose:** A general-purpose ledger for all financial events on the platform beyond direct payouts. Fields: `project_id`, `record_type` (platform_fee, refund, contract_payment, etc.), `amount`, `currency_id`, `transaction_date`, `description`, `related_payout_id`.

**Why we need it:** The platform charges fees, processes refunds, and manages contract escrow. `farmer_payouts` only captures farmer-facing payments. `financial_records` captures the full picture — platform revenue, fees deducted, partner commissions, and any corrective entries needed for accounting.

---

#### `contracts`
**Purpose:** Formalises a committed purchase agreement between a partner/company and a project over a period of time. Fields: `partner_id`, `project_id`, `farmer_id`, `plot_id`, `contract_ref`, `contract_type`, `start_date`, `end_date`, `committed_credits`, `payment_terms`, `carbon_estimated`, `status`, `data_sharing_agreement`.

**Why we need it:** Corporate buyers often commit to purchasing credits from a project over 3–5 years (offtake agreements). Contracts lock in terms, quantities, and prices ahead of verification, giving project owners revenue predictability and companies forward-carbon commitments.

---

---

## Part 2 — MRV Category: Revised with CraftedClimate dMRV Integration

### How the CraftedClimate dMRV Pipeline Works

CraftedClimate operates a complete, autonomous dMRV engine. Understanding its architecture is essential before designing Crevy's MRV tables. The data flows through three sequential workers:

```
[CrowdSense Sensor on Farm Plot]
         │  NB-IoT / LTE-M
         ▼
[Ingress: Field-to-Cloud Payload]
   device_metadata (device_id, GPS, firmware)
   telemetry (co2_ppm, temperature, humidity, battery)
   security (nonce, hardware_signature)
         │
         ├──► Worker 1: Audit Trail
         │      Saves raw JSON to Azure Blob Storage
         │      Returns: audit_id, ingestion_id, archive_metadata,
         │               content_sha256, raw_source_packet_b64
         │      → Chain of custody for VVB auditors
         │
         ├──► Worker 2: Verification (Methodology & AI)
         │      Applies Verra VM0042 / Gold Standard GS4GG rules
         │      Runs ML model (CC_ML_VERIFIER_V4_CORE)
         │      Checks geo_fence_status and hardware_integrity
         │      Calculates carbon accounting:
         │        gross_removals_tCO2e
         │        leakage_deduction
         │        buffer_contribution
         │        net_credits_issued  ◄── THIS is the number Crevy uses
         │      Returns: verification_event_id, verification_status,
         │               ai_inference_results, carbon_accounting,
         │               validation_checks
         │
         └──► Worker 3: Blockchain Anchor
                Computes Merkle Root across verified readings
                Anchors to Polygon PoS Mainnet
                Creates permanent on-chain receipt
                Returns: blockchain_anchor (network, contract_address,
                         transaction_hash, block_height),
                         on_chain_metadata (project_id, vintage,
                         batch_id, merkle_root, audit_uri)
```

**Processing is asynchronous** — 30 to 120 seconds from ingress to finalization. Results are delivered to Crevy via **webhook** (recommended) or polled via `GET /v1/mrv/status/{ingestion_id}`.

---

### What This Means for Crevy's Responsibilities

| Concern | Who Handles It | Implication for Crevy |
|---|---|---|
| Raw sensor data collection | CraftedClimate (sensors + ingress) | Crevy does NOT collect raw readings |
| Chain-of-custody audit trail | CraftedClimate (Worker 1, Azure Blob) | Crevy does NOT need to store raw sensor JSON |
| Scientific verification (VM0042) | CraftedClimate (Worker 2, ML model) | Crevy does NOT run the carbon methodology |
| Carbon accounting (leakage, buffer) | CraftedClimate (Worker 2) | Crevy uses `net_credits_issued` as the authoritative figure |
| Double-counting prevention | CraftedClimate (Worker 3, Polygon) | Crevy stores the proof but does NOT re-implement it |
| Credit issuance & ownership | **Crevy** | Crevy converts `net_credits_issued` → `carbon_credits` rows |
| Marketplace & trading | **Crevy** | Entirely Crevy's domain |
| Farmer payouts | **Crevy** | Entirely Crevy's domain |
| Business audit trail | **Crevy** | Platform-level `audit_logs` table |

---

### What Crevy Must Store: The Three dMRV Tables

Crevy does not replicate CraftedClimate's internal pipeline. Instead, Crevy stores **the results it receives from CraftedClimate's webhooks** — the minimum data required to operate the marketplace, issue credits, answer audits, and display dashboards. Three focused tables replace the previously proposed `field_measurements` and `resource_allocations`.

---

#### ✅ `mrv_ingestion_events` — *NEW, replaces `field_measurements`*
**Purpose:** Tracks each measurement batch that Crevy sends to or registers with CraftedClimate's dMRV system. This is Crevy's record of "we submitted data for this plot on this date."

**Fields:**
```
ingestion_id         VARCHAR   PK — CraftedClimate's ingestion_id (msg-ingest-uuid-XXXXX)
project_id           UUID      FK → projects
plot_id              UUID      FK → farm_plots
farmer_id            UUID      FK → farmers
partner_id           UUID      FK → partners (CraftedClimate)
device_id            VARCHAR   The sensor node ID (e.g. cs-node-gh-region-001)
submission_timestamp TIMESTAMP When the ingestion was sent
status               ENUM      pending | processing | verified | flagged | failed
created_at           TIMESTAMP
```

**Why we need it:** This is the tracking record for every dMRV submission. It lets Crevy answer "what is the verification status of Plot X?" without querying CraftedClimate's API. It also maps CraftedClimate's `project_id` namespace back to Crevy's own `project_id` and `plot_id` — a critical translation layer since the sensor knows its coordinates but not Crevy's internal IDs.

---

#### ✅ `mrv_verification_results` — *NEW, replaces need for internal carbon calculator*
**Purpose:** Stores the webhook payload from CraftedClimate's Worker 2. This is the definitive scientific verdict on a batch of readings — the record that authorises credit issuance.

**Fields:**
```
result_id               UUID      PK
ingestion_id            VARCHAR   FK → mrv_ingestion_events
project_id              UUID      FK → projects
verification_event_id   VARCHAR   CraftedClimate's v-verify-uuid-XXXXX
methodology_applied     VARCHAR   e.g. "Verra VM0042 v2.2 - Sectoral Scope 14"
verification_status     ENUM      SUCCESS | FLAGGED | FAILED
ai_model_id             VARCHAR   e.g. CC_ML_VERIFIER_V4_CORE
ai_confidence_score     DECIMAL   0.0–1.0 (e.g. 0.9982)
is_anomalous            BOOLEAN   AI anomaly flag
prediction_class        VARCHAR   e.g. "baseline_consistent"
geo_fence_status        VARCHAR   VALID | INVALID
hardware_integrity      VARCHAR   SECURE | COMPROMISED
gross_removals_tco2e    DECIMAL   Raw sequestration figure
leakage_deduction       DECIMAL   Leakage subtracted
buffer_contribution     DECIMAL   Buffer pool contribution subtracted
net_credits_issued      DECIMAL   ◄── The number Crevy uses to issue credits
received_at             TIMESTAMP When Crevy received the webhook
```

**Why we need it:** `net_credits_issued` is the single most important number on the platform — it is the quantity of carbon credits that can be issued and sold. Storing the full verification context (AI confidence, anomaly flag, geo-fence status) means Crevy can show project owners and corporate buyers exactly why a reading passed or failed, and gives Crevy's admin team the data to investigate flagged readings.

> **Conservatism Principle (from CraftedClimate docs):** Crevy must always display `net_credits_issued` in dashboards, never `gross_removals_tco2e`. The net figure already accounts for leakage and the buffer pool — using the gross figure would overstate credits and violate methodology rules.

---

#### ✅ `mrv_blockchain_anchors` — *NEW, replaces need for internal blockchain integration*
**Purpose:** Stores the webhook payload from CraftedClimate's Worker 3. This is the on-chain proof of credit authenticity and the definitive guard against double-counting.

**Fields:**
```
anchor_id               UUID      PK
result_id               UUID      FK → mrv_verification_results
project_id              UUID      FK → projects
network                 VARCHAR   e.g. "Polygon_PoS_Mainnet"
contract_address        VARCHAR   Smart contract address
transaction_hash        VARCHAR   Polygon tx hash (immutable proof)
block_height            BIGINT    Block number at time of anchoring
batch_id                VARCHAR   CraftedClimate's BATCH-ID-XX-YYYY-MM-DD
vintage                 VARCHAR   Credit vintage year (e.g. "2026")
merkle_root             VARCHAR   Merkle root of all readings in the batch
audit_uri               VARCHAR   IPFS CID — permanent public audit record
anchored_at             TIMESTAMP
```

**Why we need it:** The `transaction_hash` and `audit_uri` are the public proof that these credits exist and have not been double-counted. When a corporate buyer's auditor demands verification, Crevy sends them the Polygon transaction hash and the IPFS audit URI — both independently verifiable without trusting Crevy at all. Storing this in Crevy's DB means it is always instantly accessible from the dashboard without making a blockchain RPC call.

---

### What Crevy Does NOT Need (Revised)

| Previously Proposed | Verdict | Reason |
|---|---|---|
| `field_measurements` (raw sensor readings) | ❌ Drop | CraftedClimate stores the raw audit trail on Azure. Crevy receives processed results only. |
| `resource_allocations` (fertiliser, water inputs) | ❌ Drop (for now) | CraftedClimate's sensor-based methodology does not require manual input logging. Revisit if a different methodology is added later. |
| Internal carbon calculator (`CarbonCalculator` service as the authority) | ⚠️ Demote to estimation only | CraftedClimate's Worker 2 is the authoritative source. Keep the calculator for project registration estimates and dashboard previews, but it must never drive credit issuance. |
| Internal blockchain integration | ❌ Not needed | CraftedClimate handles the Polygon anchor. Crevy stores the proof, not the logic. |

---

### Updated dMRV Webhook Integration Flow

```
CraftedClimate Webhook  →  POST /api/v1/mrv/webhook  (Crevy backend)
                                     │
                    ┌────────────────┼──────────────────┐
                    ▼                ▼                   ▼
            Worker 1 payload  Worker 2 payload   Worker 3 payload
            (audit archive)   (verification)     (blockchain)
                    │                │                   │
                    │         Write row to:        Write row to:
                    │    mrv_verification_results  mrv_blockchain_anchors
                    │                │                   │
                    │    If status=SUCCESS:               │
                    │    ┌───────────▼───────────┐        │
                    │    │ Issue carbon_credits  │        │
                    │    │ rows (net_credits_    │        │
                    │    │ issued × 1 row each)  │        │
                    │    │ Write tx_hash +       ◄────────┘
                    │    │ batch_id + audit_uri  │
                    │    └───────────┬───────────┘
                    │                │
                    │    Update mrv_ingestion_events.status
                    │    Fire notification to project owner
                    │
               Log to audit_logs
               (Crevy business audit trail)
```

---

## Part 3 — Carbon Credit Management: Revised Gap Analysis

### What the current Crevy backend has:

| Existing Table / Service | Purpose | Revised Status |
|---|---|---|
| `project` | Core project record | ✅ Keep, extend |
| `regenerativePractices` | Master list of practices with impact factors | ✅ Keep for project registration |
| `projectPractices` | Links practices to projects | ✅ Keep for project registration |
| `projectDocument` | Stores uploaded supporting docs | ✅ Keep |
| `carbonSequestrationLog` | Annual records of calculated tCO₂e | ⚠️ Superseded by `mrv_verification_results` for verified figures. Keep for estimates only, or retire. |
| `CarbonCalculator` service | Estimates tCO₂e from practices | ⚠️ Demote to estimation — not authoritative for issuance |

### What is still missing after the dMRV revision:

---

#### ❌ No `carbon_credits` table — **Critical, still missing**
Credits are now issued from `mrv_verification_results.net_credits_issued` via webhook trigger, not from an internal calculator. The table structure is the same as before but gains two new required fields: `mrv_batch_id` and `blockchain_tx_hash` from the CraftedClimate anchor payload, providing the immutable proof of authenticity.

---

#### ❌ No `credit_transactions` table — **Critical, still missing**
Unchanged from previous analysis. The marketplace still needs a sales ledger.

---

#### ❌ No `verifications` table — **Critical, still missing, but redesigned**
This table now stores CraftedClimate's `verification_event_id` and `methodology_applied` as primary fields. The old model (internal admin approves) is replaced by "CraftedClimate's Worker 2 returns SUCCESS." The `verifier_partner_id` points to CraftedClimate's record in the `partners` table.

---

#### ❌ No `mrv_ingestion_events` table — **New critical gap**
Without this, Crevy has no way to track which farm plots have been submitted for dMRV processing, correlate CraftedClimate's project IDs back to Crevy's IDs, or display verification status to farmers on the dashboard.

---

#### ❌ No `mrv_verification_results` table — **New critical gap**
Without this, there is no persistent record of what CraftedClimate returned. If their webhook fires once and Crevy's handler crashes, the credit issuance event is lost forever. This table is the durable store for the verification outcome.

---

#### ❌ No `mrv_blockchain_anchors` table — **New critical gap**
Without this, Crevy cannot show the blockchain proof-of-credit to buyers or auditors without making a live Polygon RPC call — which is fragile and slow.

---

#### ❌ No `contracts` table — **Still missing**
Unchanged from previous analysis.

---

#### ❌ No `farmer_payouts` table — **Still missing**
Unchanged from previous analysis.

---

#### ❌ No `currencies` reference table — **Still missing**
Unchanged from previous analysis.

---

### Revised Verdict on Tables

| Table | Include in Crevy? | Priority | Changed by dMRV? |
|---|---|---|---|
| `users` | ✅ Yes (refactor of current `user`) | P0 | No |
| `roles` / `role_permissions` | ✅ Yes | P1 | No |
| `currencies` | ✅ Yes | P1 | No |
| `partners` | ✅ Yes (CraftedClimate registered here) | P1 | No |
| `audit_logs` | ✅ Yes | P1 | No |
| `notifications` | ✅ Yes | P2 | No |
| `farmers` | ✅ Yes | P0 | No |
| `farm_plots` | ✅ Yes (required for geo-fence mapping) | P0 | **Yes** — now feeds dMRV sensor location validation |
| `farmer_assignments` | ✅ Yes | P1 | No |
| `projects` | ✅ Yes | P0 | No |
| `project_farmers` | ✅ Yes | P0 | No |
| `project_activities` | ✅ Yes | P1 | No |
| `carbon_credits` | ✅ Yes — **critical, missing** | P0 | **Yes** — now populated from dMRV webhook, not internal calculator |
| `credit_transactions` | ✅ Yes — **critical, missing** | P0 | No |
| `verifications` | ✅ Yes — **critical, missing** | P0 | **Yes** — now stores CraftedClimate's `verification_event_id` |
| `mrv_ingestion_events` | ✅ Yes — **new, critical** | P0 | **New** |
| `mrv_verification_results` | ✅ Yes — **new, critical** | P0 | **New** |
| `mrv_blockchain_anchors` | ✅ Yes — **new, critical** | P0 | **New** |
| `contracts` | ✅ Yes | P1 | No |
| `farmer_payouts` | ✅ Yes — **missing** | P1 | No |
| `financial_records` | ✅ Yes | P1 | No |
| `field_measurements` (ERD) | ❌ Drop | — | **Dropped** — replaced by `mrv_verification_results` |
| `resource_allocations` (ERD) | ❌ Drop for now | — | **Dropped** — not required by CraftedClimate methodology |

---

## Part 4 — Should You Do a Complete Refactor?

### Current state assessment

| Layer | Current State | Assessment |
|---|---|---|
| **Auth models** | `user`, `session`, `account`, `verification`, `company`, `projectOwner`, `admin` — powered by `better-auth` | ✅ Solid foundation. Keep it. |
| **Project model** | Single `project` table with all fields inline + `projectPractices`, `projectDocument`, `carbonSequestrationLog`, `regenerativePractices` | ⚠️ Functional but incomplete. `carbonSequestrationLog` is now estimation-only. The dMRV tables are completely absent. |
| **Services** | `ProjectServices`, `CarbonCalculator` exist with working CRUD | ✅ Keep the architecture. `CarbonCalculator` is demoted to estimation. A new `MrvWebhookService` is needed. |
| **Routes** | RESTful routes for projects exist, working auth middleware | ✅ Keep. Add `/api/v1/mrv/webhook` endpoint. |
| **Frontend** | Next.js 16, Tailwind v4, React 19, React Query, shadcn/ui — all connected and working | ✅ Strong. Do not throw this away. |

### Recommendation: **Additive Refactor, Not a Full Rewrite**

The architecture is sound. The additions are significant in scope but additive in nature — they do not require removing or re-architecting what exists. The biggest change is the introduction of the `MrvWebhookService` as a new core service.

---

### Revised Refactor Plan (phased)

#### Phase 1 — Core Infrastructure (Week 1)
- Add `currencies` table and seed default currencies (USD, GHS, EUR, KES)
- Add `roles` and `role_permissions` tables
- Extend `user` with `default_currency_id`, `is_active`
- Add `partners` table — seed CraftedClimate as the first partner record
- Add `audit_logs` table (Express middleware to auto-log mutations)

#### Phase 2 — Farmer & Plot Domain (Week 1–2)
- Rename/extend `project_owner` → `farmers` table with GPS, bank details, MoMo, `verification_status`, `onboarded_by_partner_id`
- Add `farm_plots` table with GPS coordinates (required for CraftedClimate geo-fence validation)
- Add `farmer_assignments` table
- Extend `company` profile with `industry`, `country`, `annual_emissions_tco2e`

#### Phase 3 — dMRV Integration (Week 2–3) — **Highest priority**
- Add `mrv_ingestion_events` table
- Add `mrv_verification_results` table
- Add `mrv_blockchain_anchors` table
- Build `POST /api/v1/mrv/webhook` endpoint with signature verification (Bearer Token, content_sha256 check)
- Build `MrvWebhookService`:
  - Parse Worker 2 payload → write `mrv_verification_results`
  - Parse Worker 3 payload → write `mrv_blockchain_anchors`
  - On `verification_status: SUCCESS` → trigger credit issuance
- Demote `CarbonCalculator` to estimation mode (remove it from issuance path)

#### Phase 4 — Carbon Credit Engine (Week 3–4)
- Add `carbon_credits` table — fields include `mrv_batch_id` and `blockchain_tx_hash`
- Add `credit_transactions` table (marketplace ledger)
- Add `verifications` table — linked to CraftedClimate's `verification_event_id`
- Wire: `mrv_verification_results` (SUCCESS) → issue `carbon_credits` rows → update `projects.verified_total_tco2e`

#### Phase 5 — Financials & Contracts (Week 4–5)
- Add `farmer_payouts` table
- Add `financial_records` table
- Add `contracts` table
- Wire payout trigger: when `credit_transactions.status` → `completed`, create `farmer_payout` record

---

## Part 5 — Relationship Map

### Core Infrastructure

| Relationship | Type | Description |
|---|---|---|
| `users` → `roles` | M-to-1 | Each user has one role; many users can share a role |
| `roles` → `role_permissions` | 1-to-M | One role defines many resource-permission pairs |
| `users` → `currencies` | M-to-1 | Each user has a preferred/default currency |
| `partners` → `currencies` | M-to-1 | Each partner organisation operates in a default currency |
| `audit_logs` → `users` | M-to-1 | Many log entries are created by one user |

### Farmer Management

| Relationship | Type | Description |
|---|---|---|
| `farmers` → `users` | 1-to-1 | Each farmer record extends exactly one user account |
| `farmers` → `farm_plots` | 1-to-M | One farmer can own or manage multiple land plots |
| `farmers` → `partners` | M-to-M via `farmer_assignments` | A farmer can be managed by one or more partner agents over time |
| `farmer_assignments` → `users` (agent) | M-to-1 | Many farmers can be assigned to one agent |

### Project Management

| Relationship | Type | Description |
|---|---|---|
| `projects` → `farmers` | M-to-M via `project_farmers` | Many farmers participate in one project |
| `projects` → `farm_plots` | M-to-1 | A project is anchored to a primary plot |
| `projects` → `currencies` | M-to-1 | Each project's credit pricing is in one currency |
| `project_activities` → `projects` | M-to-1 | Many activities belong to one project |

### dMRV Pipeline

| Relationship | Type | Description |
|---|---|---|
| `mrv_ingestion_events` → `projects` | M-to-1 | Many dMRV batches are submitted for one project over its lifetime |
| `mrv_ingestion_events` → `farm_plots` | M-to-1 | Each ingestion batch is tied to a specific sensor-equipped plot |
| `mrv_ingestion_events` → `farmers` | M-to-1 | Each batch is attributable to a farmer |
| `mrv_ingestion_events` → `partners` | M-to-1 | Each submission goes to one dMRV partner (CraftedClimate) |
| `mrv_verification_results` → `mrv_ingestion_events` | 1-to-1 | One ingestion produces one verification result |
| `mrv_verification_results` → `projects` | M-to-1 | Many verifications accumulate on one project over time |
| `mrv_blockchain_anchors` → `mrv_verification_results` | 1-to-1 | One verified batch gets one blockchain anchor |
| `mrv_blockchain_anchors` → `projects` | M-to-1 | Many on-chain anchors accumulate on one project |

### Carbon Credits

| Relationship | Type | Description |
|---|---|---|
| `carbon_credits` → `projects` | M-to-1 | Many credits are generated from one project |
| `carbon_credits` → `mrv_verification_results` | M-to-1 | Each credit is backed by a specific verification result |
| `carbon_credits` → `mrv_blockchain_anchors` | M-to-1 | Each credit references its blockchain proof |
| `carbon_credits` → `users` (current_owner) | M-to-1 | A credit is owned by one user at any point in time |
| `credit_transactions` → `carbon_credits` | M-to-1 | One credit can be involved in multiple transfer events |
| `credit_transactions` → `users` (buyer / seller) | M-to-1 | Transactions reference both parties |
| `credit_transactions` → `currencies` | M-to-1 | Each transaction is settled in one currency |
| `verifications` → `projects` | M-to-1 | A project can have many formal verification records |
| `verifications` → `partners` | M-to-1 | Each verification is attributed to CraftedClimate as the verifying partner |
| `verifications` → `mrv_verification_results` | 1-to-1 | Crevy's business verification record maps to CraftedClimate's event |

### Financials

| Relationship | Type | Description |
|---|---|---|
| `farmer_payouts` → `farmers` | M-to-1 | One farmer receives many payouts over time |
| `farmer_payouts` → `projects` | M-to-1 | Each payout is tied to a specific project's credit sale |
| `farmer_payouts` → `credit_transactions` | M-to-1 | A payout is triggered by a specific credit transaction |
| `farmer_payouts` → `currencies` | M-to-1 | Each payout is made in one currency |
| `financial_records` → `projects` | M-to-1 | Platform fee and contract records link back to a project |
| `financial_records` → `farmer_payouts` | M-to-1 | A financial record can reference a related payout |
| `contracts` → `partners` | M-to-1 | A contract is with one partner/buyer organisation |
| `contracts` → `projects` | M-to-1 | A contract is for one project's credits |
| `contracts` → `farmers` | M-to-1 | The contract references the primary farmer for the project |

---

*Analysis updated: April 2026 · Crevy Platform · Foovante Global*
*Revised to incorporate CraftedClimate dMRV Technical Specification v1.0*
