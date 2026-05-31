# Foovante CDMS — Database Schema Reference

## About This Document

This document captures the full database schema for the **Foovante Carbon Data Management System (CDMS)** — the backend data layer powering the Crevy platform.

The tables below were derived through a multi-stage design process:

1. **Existing backend audit** — The current `crevy-backend` was reviewed for existing tables (`user`, `project`, `projectPractices`, `carbonSequestrationLog`, etc.) and assessed for gaps.
2. **ERD diagram review** — The `foovante_cdms_ERD.png` ERD was analysed table by table, capturing field names, types, and relationships.
3. **CraftedClimate dMRV integration** — The CraftedClimate Technical Specification (v1.0) was incorporated. Three new tables (`mrv_ingestion_events`, `mrv_verification_results`, `mrv_blockchain_anchors`) replace the original `field_measurements` and `resource_allocations` tables. The authoritative source for carbon credit quantities is now CraftedClimate's Worker 2 webhook (`net_credits_issued`), not Crevy's internal calculator.
4. **Gap analysis** — Missing tables critical for marketplace operations (`carbon_credits`, `credit_transactions`, `contracts`, `farmer_payouts`, `currencies`, `verifications`) were identified and formally added to the schema.

The schema is organised into six domains: **Core Infrastructure**, **Farmer Management**, **Project Management**, **Carbon Credits**, **dMRV Pipeline**, and **Financials**.

---

## Domain 1 — Core Infrastructure

> Foundational tables that every other domain depends on. Nothing works without these.

---

### `users`

The master identity record for every human actor on the platform — farmers/project owners, company buyers, admin staff, and partner agents. Stores credentials, contact info, role assignment, and financial defaults.

```
user_id              INT              PK, auto-increment
email                VARCHAR(255)     Unique login identifier
password_hash        VARCHAR(255)     Hashed credential (never plain text)
role                 ENUM(...)        Role slug: farmer | company_buyer | admin | verifier | partner_agent
first_name           VARCHAR(100)
last_name            VARCHAR(100)
phone                VARCHAR(50)
is_active            TINYINT(1)       Soft-delete / account suspension flag
default_currency_id  INT              FK → currencies.currency_id
created_at           TIMESTAMP
```

---

### `roles`

Defines the named roles on the platform. A simple lookup table that drives the RBAC system together with `role_permissions`.

```
role_id    INT             PK, auto-increment
role_name  VARCHAR(50)     e.g. farmer | company_buyer | admin | verifier | partner_agent
```

---

### `role_permissions`

A permission matrix that maps each role to specific resource–action pairs. Changing what a role can access is a data change, not a deployment.

```
permission_id  INT           PK, auto-increment
role_id        INT           FK → roles.role_id
resource       VARCHAR(100)  e.g. projects | carbon_credits | farmer_payouts
can_read       TINYINT(1)
can_write      TINYINT(1)
can_delete     TINYINT(1)
```

---

### `currencies`

A reference table of supported currencies. Every financial table references `currency_id` from here to avoid magic strings.

```
currency_id    INT           PK, auto-increment
currency_code  VARCHAR(3)    ISO 4217 code: USD | GHS | EUR | KES
currency_name  VARCHAR(50)   e.g. US Dollar | Ghanaian Cedi
is_active      TINYINT(1)
created_at     TIMESTAMP
```

---

### `partners`

Represents external partner organisations — the dMRV provider (CraftedClimate), auditing bodies, certification registries, and B2B channel partners who onboard farmers on behalf of Crevy.

```
partner_id            INT           PK, auto-increment
partner_code          VARCHAR(50)   Unique short code e.g. CC-001
partner_name          VARCHAR(255)
partner_type          ENUM(...)     dMRV_provider | registry | auditor | channel_partner
contact_person        VARCHAR(255)
contact_email         VARCHAR(255)
contact_phone         VARCHAR(50)
country               VARCHAR(100)
status                ENUM(...)     active | suspended | inactive
default_currency_id   INT           FK → currencies.currency_id
data_sharing_agreement TINYINT(1)   Whether a DSA is in place
created_at            TIMESTAMP
```

---

### `audit_logs`

An immutable application-level change-log recording every create/update/delete action performed by Crevy users and services. This is Crevy's own business audit trail — distinct from the dMRV chain-of-custody managed by CraftedClimate.

```
log_id      INT           PK, auto-increment
user_id     INT           FK → users.user_id
action      VARCHAR(255)  e.g. CREATE | UPDATE | DELETE
table_name  VARCHAR(100)  The affected table
record_id   INT           PK of the affected row
old_value   TEXT          JSON snapshot of previous state
new_value   TEXT          JSON snapshot of new state
ip_address  VARCHAR(45)   IPv4 or IPv6 address
created_at  TIMESTAMP
```

---

### `notifications`

Stores in-app and push notifications for users. Backs the notification bell in the dashboard UI — including dMRV webhook events such as "verification completed for Plot X."

```
notification_id  INT        PK, auto-increment
user_id          INT        FK → users.user_id
message          TEXT
status           ENUM(...)  unread | read
created_at       TIMESTAMP
```

---

## Domain 2 — Farmer Management

> Manages the farmers (project owners / green project leads) and the physical land they operate on.

---

### `farmers`

Extended profile for users whose role is farmer/project owner. Stores operational details that do not belong in `users`: GPS coordinates, village, region, bank and mobile money details for payouts, KYC verification status, and the partner who onboarded them.

```
farmer_id              INT            PK, auto-increment
farmer_code            VARCHAR(50)    Unique short code e.g. FMR-0001
first_name             VARCHAR(100)
last_name              VARCHAR(100)
phone                  VARCHAR(50)
email                  VARCHAR(255)
region                 VARCHAR(100)
village                VARCHAR(100)
latitude               DECIMAL(10,8)  Primary GPS location
longitude              DECIMAL(11,8)
verification_status    ENUM(...)      pending | verified | rejected (KYC status)
onboarded_by           ENUM(...)      self | partner
onboarded_by_partner_id INT           FK → partners.partner_id (nullable)
bank_name              VARCHAR(100)
account_number         VARCHAR(50)
mobile_money_number    VARCHAR(50)
created_at             TIMESTAMP
```

---

### `farm_plots`

Represents individual, physically distinct parcels of land owned or managed by a farmer. One farmer can have multiple non-contiguous plots. CraftedClimate's sensors are deployed at GPS coordinates, and the `geo_fence_status: VALID` check in their verification payload validates that readings come from within a registered plot boundary.

```
plot_id         INT            PK, auto-increment
farmer_id       INT            FK → farmers.farmer_id
area_hectares   DECIMAL(10,2)
latitude        DECIMAL(10,8)  Plot centroid or reference point
longitude       DECIMAL(11,8)
```

---

### `farmer_assignments`

Links a farmer to a partner organisation or field agent. Tracks who is responsible for a farmer, enabling commission tracking, agent performance reports, and accountability in disputes.

```
assignment_id      INT           PK, auto-increment
farmer_id          INT           FK → farmers.farmer_id
agent_id           INT           FK → users.user_id (field agent)
partner_id         INT           FK → partners.partner_id (nullable)
assigned_date      DATE
assignment_type    ENUM(...)     e.g. primary | secondary
assignment_status  ENUM(...)     active | inactive | transferred
is_b2c_assignment  TINYINT(1)   Direct farmer onboarding vs partner-mediated
created_at         TIMESTAMP
```

---

## Domain 3 — Project Management

> The core operational domain. A project is the unit of carbon credit generation.

---

### `projects`

The central record for a carbon sequestration or emissions-reduction project. Everything else — activities, credits, dMRV results, financials — hangs off a project. The `project_code` on Crevy maps to CraftedClimate's `CC-PROJECT-ID-001` reference in their payloads, making this the critical join key between the two systems.

```
project_id                INT            PK, auto-increment
project_code              VARCHAR(50)    Unique e.g. PRJ-GH-2026-001
project_name              VARCHAR(255)
project_type              ENUM(...)      agriculture | reforestation | solar | biochar
project_stage             ENUM(...)      registration | active | verification | completed
status                    ENUM(...)      draft | active | suspended | closed
region                    VARCHAR(100)
start_date                DATE
end_date                  DATE
estimated_total_credits   DECIMAL(12,2)  Estimation from CarbonCalculator (not authoritative for issuance)
estimated_credit_price    DECIMAL(10,2)
currency_id               INT            FK → currencies.currency_id
created_by                INT            FK → users.user_id
created_at                TIMESTAMP
```

---

### `project_farmers`

Many-to-many join table between `projects` and `farmers`. Tracks participation, individual land contributions, and allows payout calculations to be split correctly between farmers when CraftedClimate issues credits at the project batch level.

```
project_id               INT            FK → projects.project_id (composite PK)
farmer_id                INT            FK → farmers.farmer_id (composite PK)
joined_date              DATE
participation_status     ENUM(...)      active | withdrawn | suspended
project_land_size_hectares DECIMAL(10,2)
```

---

### `project_activities`

A time-stamped log of discrete activities carried out within a project — sensor installation, soil sampling, tree planting, auditor site visits. Feeds the "Track Verification" dashboard feature.

```
activity_id    INT            PK, auto-increment
project_id     INT            FK → projects.project_id
activity_name  VARCHAR(255)
activity_date  DATE
status         VARCHAR(50)    e.g. planned | in_progress | completed
```

---

## Domain 4 — Carbon Credits

> The financial heart of the platform. Credits are the product being created, verified, and traded.

> ⚠️ **Important:** With the CraftedClimate dMRV integration, the authoritative source for credit quantities is CraftedClimate's Worker 2 (`net_credits_issued`), not Crevy's internal calculator. The calculator is demoted to estimation only and must never drive credit issuance.

---

### `carbon_credits`

Represents an individually serialised carbon credit (1 credit = 1 tCO₂e). Each row is populated from a CraftedClimate `blockchain` webhook with `verification_status: SUCCESS`. The `blockchain_tx_hash` and `mrv_batch_id` fields carry the immutable external proof.

```
credit_id             INT            PK, auto-increment
project_id            INT            FK → projects.project_id
credit_serial_number  VARCHAR(100)   Crevy's internal serial ID
credit_amount         DECIMAL(12,2)  Typically 1.0 per row
credit_vintage        YEAR           Year the carbon was sequestered
credit_status         ENUM(...)      available | reserved | sold | retired
mrv_batch_id          VARCHAR(100)   FK ref → mrv_blockchain_anchors.batch_id
blockchain_tx_hash    VARCHAR(255)   Polygon transaction hash (immutable proof)
generation_date       DATE
verification_date     DATE
issuance_date         DATE
current_owner_id      INT            FK → users.user_id
registry              VARCHAR(50)    e.g. Verra | Gold Standard
created_at            TIMESTAMP
```

---

### `credit_transactions`

Records every purchase, transfer, or retirement event for carbon credits. This is Crevy's sales ledger — every sale, price, buyer, seller, and timestamp is immutable once written.

```
transaction_id       INT            PK, auto-increment
transaction_ref      VARCHAR(100)   Unique reference e.g. TXN-2026-000001
credit_id            INT            FK → carbon_credits.credit_id
buyer_id             INT            FK → users.user_id
seller_id            INT            FK → users.user_id
is_internal_sale     TINYINT(1)
quantity             DECIMAL(12,2)
price_per_credit     DECIMAL(10,2)
total_amount         DECIMAL(15,2)
currency_id          INT            FK → currencies.currency_id
transaction_date     DATE
status               ENUM(...)      pending | completed | cancelled | refunded
notes                TEXT
created_at           TIMESTAMP
```

---

### `verifications`

Crevy's business-layer record of verification outcomes. References CraftedClimate as the verifying partner and stores their `verification_event_id` for correlation back to their records. A project can have many verifications over its lifetime. No `status: SUCCESS` = no credit issuance.

```
verification_id       INT            PK, auto-increment
project_id            INT            FK → projects.project_id
verifier_partner_id   INT            FK → partners.partner_id (CraftedClimate)
verification_event_id VARCHAR(100)   CraftedClimate's v-verify-uuid-XXXXX
methodology_applied   VARCHAR(100)   e.g. Verra VM0042 v2.2
verification_date     DATE
verification_status   ENUM(...)      SUCCESS | FLAGGED | FAILED
notes                 TEXT
```

---

## Domain 5 — dMRV Pipeline

> Tables that receive and store results from CraftedClimate's autonomous dMRV engine. Crevy does not replicate CraftedClimate's internal pipeline — it stores only the results delivered via webhook.

> **Pipeline summary:** Sensor → Worker 1 (audit trail, Azure Blob) → Worker 2 (scientific verification, VM0042) → Worker 3 (Polygon blockchain anchor) → Crevy webhook handler.

---

### `mrv_ingestion_events`

Tracks each measurement batch submitted to CraftedClimate's dMRV system. Crevy's record of "we registered this plot for dMRV on this date." Maps CraftedClimate's `project_id` namespace back to Crevy's internal IDs — a critical translation layer since the sensor knows its coordinates but not Crevy's IDs.

```
ingestion_id          VARCHAR(100)   PK — CraftedClimate's ingestion_id (msg-ingest-uuid-XXXXX)
project_id            INT            FK → projects.project_id
plot_id               INT            FK → farm_plots.plot_id
farmer_id             INT            FK → farmers.farmer_id
partner_id            INT            FK → partners.partner_id (CraftedClimate)
device_id             VARCHAR(100)   Sensor node ID e.g. cs-node-gh-region-001
submission_timestamp  TIMESTAMP      When the ingestion was submitted
status                ENUM(...)      pending | processing | verified | flagged | failed
created_at            TIMESTAMP
```

---

### `mrv_verification_results`

Stores the webhook payload from CraftedClimate's Worker 2. The definitive scientific verdict on a batch of readings — the record that authorises credit issuance. `net_credits_issued` is the single most important number on the platform.

> **Conservatism Principle:** Always display `net_credits_issued` in dashboards, never `gross_removals_tco2e`. The net figure already accounts for leakage and the buffer pool.

```
result_id              UUID / INT     PK
ingestion_id           VARCHAR(100)   FK → mrv_ingestion_events.ingestion_id
project_id             INT            FK → projects.project_id
verification_event_id  VARCHAR(100)   CraftedClimate's v-verify-uuid-XXXXX
methodology_applied    VARCHAR(100)   e.g. Verra VM0042 v2.2 - Sectoral Scope 14
verification_status    ENUM(...)      SUCCESS | FLAGGED | FAILED
ai_model_id            VARCHAR(100)   e.g. CC_ML_VERIFIER_V4_CORE
ai_confidence_score    DECIMAL(5,4)   0.0–1.0 e.g. 0.9982
is_anomalous           BOOLEAN
prediction_class       VARCHAR(100)   e.g. baseline_consistent
geo_fence_status       VARCHAR(20)    VALID | INVALID
hardware_integrity     VARCHAR(20)    SECURE | COMPROMISED
gross_removals_tco2e   DECIMAL(12,4)  Raw sequestration figure (display only)
leakage_deduction      DECIMAL(12,4)  Leakage subtracted
buffer_contribution    DECIMAL(12,4)  Buffer pool contribution subtracted
net_credits_issued     DECIMAL(12,4)  ◄── Authoritative figure used to issue credits
received_at            TIMESTAMP      When Crevy received the webhook
```

---

### `mrv_blockchain_anchors`

Stores the webhook payload from CraftedClimate's Worker 3. The on-chain proof of credit authenticity and the definitive guard against double-counting. When a corporate buyer's auditor demands verification, Crevy sends them the `transaction_hash` and `audit_uri` — both independently verifiable on Polygon without trusting Crevy.

```
anchor_id          UUID / INT    PK
result_id          UUID / INT    FK → mrv_verification_results.result_id
project_id         INT           FK → projects.project_id
network            VARCHAR(50)   e.g. Polygon_PoS_Mainnet
contract_address   VARCHAR(100)  Smart contract address
transaction_hash   VARCHAR(255)  Polygon tx hash (immutable proof)
block_height       BIGINT        Block number at anchoring time
batch_id           VARCHAR(100)  CraftedClimate's BATCH-ID-XX-YYYY-MM-DD
vintage            VARCHAR(10)   Credit vintage year e.g. 2026
merkle_root        VARCHAR(255)  Merkle root of all readings in the batch
audit_uri          VARCHAR(500)  IPFS CID — permanent public audit record
anchored_at        TIMESTAMP
```

---

## Domain 6 — Financials

> Handles all money movement on the platform — farmer earnings, platform fees, and committed purchase contracts.

---

### `farmer_payouts`

Records individual payment disbursements to farmers. The source of truth for farmer income reporting. Triggered when a `credit_transaction.status` transitions to `completed`.

```
payout_id       INT            PK, auto-increment
payout_ref      VARCHAR(100)   Unique reference e.g. PAY-2026-000001
farmer_id       INT            FK → farmers.farmer_id
project_id      INT            FK → projects.project_id
transaction_id  INT            FK → credit_transactions.transaction_id
payout_amount   DECIMAL(12,2)
currency_id     INT            FK → currencies.currency_id
payout_date     DATE
payout_method   ENUM(...)      bank_transfer | mobile_money | cash
status          ENUM(...)      pending | paid | failed
notes           TEXT
created_at      TIMESTAMP
```

---

### `financial_records`

A general-purpose ledger for all financial events beyond direct farmer payouts — platform fees, refunds, contract escrow, partner commissions, and corrective accounting entries.

```
record_id          INT            PK, auto-increment
project_id         INT            FK → projects.project_id
record_type        ENUM(...)      platform_fee | refund | contract_payment | commission | correction
amount             DECIMAL(15,2)
currency_id        INT            FK → currencies.currency_id
transaction_date   DATE
description        TEXT
related_payout_id  INT            FK → farmer_payouts.payout_id (nullable)
created_at         TIMESTAMP
```

---

### `contracts`

Formalises a committed purchase agreement (offtake agreement) between a partner/company and a project over a period of time. Corporate buyers often commit to purchasing credits over 3–5 years, locking in quantities and prices ahead of verification.

```
contract_id              INT            PK, auto-increment
partner_id               INT            FK → partners.partner_id
project_id               INT            FK → projects.project_id
farmer_id                INT            FK → farmers.farmer_id
plot_id                  INT            FK → farm_plots.plot_id (nullable)
contract_ref             VARCHAR(255)   Unique reference e.g. CTR-2026-001
contract_type            ENUM(...)      offtake | spot | framework
contract_terms           TEXT           Full terms as free text or JSON
start_date               DATE
end_date                 DATE
status                   ENUM(...)      draft | active | expired | terminated
committed_credits        DECIMAL(12,2)  Total tCO₂e committed
carbon_estimated         DECIMAL(12,2)  Estimated carbon at contract time
methodology              VARCHAR(100)
payment_terms            JSON           Structured payment schedule
data_sharing_agreement   TINYINT(1)
calculation_date         DATE
created_at               TIMESTAMP
```

---

## Relationship Summary

| Relationship | Type | Description |
|---|---|---|
| `users` → `roles` | M-to-1 | Each user has one role |
| `roles` → `role_permissions` | 1-to-M | One role defines many permission pairs |
| `users` → `currencies` | M-to-1 | Each user has a preferred currency |
| `farmers` → `users` | 1-to-1 | Each farmer record extends one user account |
| `farmers` → `farm_plots` | 1-to-M | One farmer can own multiple plots |
| `farmers` → `partners` | M-to-M via `farmer_assignments` | Farmers managed by partner agents |
| `projects` → `farmers` | M-to-M via `project_farmers` | Many farmers in one project |
| `projects` → `farm_plots` | M-to-1 | Project anchored to a primary plot |
| `mrv_ingestion_events` → `projects` | M-to-1 | Many dMRV batches per project lifetime |
| `mrv_verification_results` → `mrv_ingestion_events` | 1-to-1 | One ingestion = one verification result |
| `mrv_blockchain_anchors` → `mrv_verification_results` | 1-to-1 | One verified batch = one blockchain anchor |
| `carbon_credits` → `mrv_verification_results` | M-to-1 | Credits backed by a specific verification |
| `carbon_credits` → `mrv_blockchain_anchors` | M-to-1 | Credits reference their blockchain proof |
| `credit_transactions` → `carbon_credits` | M-to-1 | One credit can have multiple transfer events |
| `farmer_payouts` → `credit_transactions` | M-to-1 | Payout triggered by a credit transaction |
| `contracts` → `partners` | M-to-1 | Contract with one partner/buyer |
| `contracts` → `projects` | M-to-1 | Contract for one project's credits |

---

*Schema reference compiled: April 2026 · Foovante CDMS · Crevy Platform*
*Incorporates CraftedClimate dMRV Technical Specification v1.0*
