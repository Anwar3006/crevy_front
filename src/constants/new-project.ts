// src/constants/new-project.ts
import { z } from "zod";

// ─── Taxonomy ──────────────────────────────────────────────────────────────────

export const PROJECT_TYPES = [
  {
    id: "regenerative_agriculture",
    sector: "green_economy",
    title: "Regenerative Agriculture",
    pilotEnabled: true,
    icon: "/icons/3d-leaf.png",
    description:
      "Restore soil health and sequester carbon through sustainable farming.",
  },
  {
    id: "renewable_energy",
    sector: "green_economy",
    title: "Renewable Energy",
    pilotEnabled: true,
    icon: "/icons/3d-renewable.png",
    description:
      "Generate clean power using solar, wind, or hydro infrastructure.",
  },
  {
    id: "waste_management",
    sector: "brown_economy",
    title: "Waste Management",
    pilotEnabled: false,
    icon: "/icons/3d-waste.png",
    description: "Reduce landfill reliance and capture methane emissions.",
  },
  {
    id: "water_projects",
    sector: "blue_economy",
    title: "Water Projects",
    pilotEnabled: false,
    icon: "/icons/blue-carbon.png",
    description: "Clean water infrastructure and wetland restoration.",
  },
  {
    id: "blue_carbon",
    sector: "blue_economy",
    title: "Blue Carbon",
    pilotEnabled: false,
    icon: "/icons/blue-carbon.png",
    description: "Mangrove and coastal ecosystem protection.",
  },
] as const;

// ─── Practice tags by project type ────────────────────────────────────────────

export const PRACTICES_BY_TYPE: Record<string, string[]> = {
  regenerative_agriculture: [
    "Agroforestry",
    "Cover Cropping",
    "Rotational Grazing",
    "Composting / Organic Amendments",
    "No-Till / Minimum Tillage",
    "Intercropping",
    "Silvopasture",
    "Riparian Buffers",
  ],
  renewable_energy: [
    "Solar PV",
    "Wind Energy",
    "Small-Scale Hydro",
    "Biogas / Biomass",
    "Off-Grid Electrification",
    "Clean Cooking Fuel",
  ],
};

// ─── Document slots ────────────────────────────────────────────────────────────

export const DOCUMENT_TYPES = [
  {
    id: "land_ownership",
    label: "Land Ownership Proof",
    description:
      "Title deed, land certificate, lease agreement, or a signed letter from the chief confirming your land rights.",
    required: true,
    hasTemplate: false,
    accept: ".pdf,.jpg,.jpeg,.png",
    multiple: false,
  },
  {
    id: "community_consent",
    label: "Community / Landowner Consent Form",
    description:
      "Signed consent to participate in the Crevy dMRV monitoring programme and allow sensor deployment on your land.",
    required: true,
    hasTemplate: true,
    templateUrl: "/templates/consent-form.pdf",
    accept: ".pdf",
    multiple: false,
  },
  {
    id: "site_access_authorization",
    label: "Site Access Authorization",
    description:
      "Written permission for our technical team to access your land to install monitoring sensors.",
    required: true,
    hasTemplate: true,
    templateUrl: "/templates/site-access-form.pdf",
    accept: ".pdf",
    multiple: false,
  },
  {
    id: "national_id",
    label: "National ID / Business Registration",
    description:
      "Your national ID card, passport, or business registration certificate.",
    required: true,
    hasTemplate: false,
    accept: ".pdf,.jpg,.jpeg,.png",
    multiple: false,
  },
  {
    id: "site_photos",
    label: "Site Photographs",
    description:
      "Recent photos of your land (up to 5 images). Helps buyers understand your project.",
    required: false,
    hasTemplate: false,
    accept: ".jpg,.jpeg,.png",
    multiple: true,
    maxFiles: 5,
  },
] as const;

export type DocumentTypeId = (typeof DOCUMENT_TYPES)[number]["id"];

// ─── SDGs ──────────────────────────────────────────────────────────────────────

export const SDGS = [
  { id: "1", title: "No Poverty", color: "bg-[#E5243B]" },
  { id: "2", title: "Zero Hunger", color: "bg-[#DDA63A]" },
  { id: "3", title: "Good Health and Well-being", color: "bg-[#4C9F38]" },
  { id: "4", title: "Quality Education", color: "bg-[#C5192D]" },
  { id: "5", title: "Gender Equality", color: "bg-[#FF3A21]" },
  { id: "6", title: "Clean Water and Sanitation", color: "bg-[#26BDE2]" },
  { id: "7", title: "Affordable and Clean Energy", color: "bg-[#FCC30B]" },
  { id: "8", title: "Decent Work and Economic Growth", color: "bg-[#A21942]" },
  {
    id: "9",
    title: "Industry, Innovation and Infrastructure",
    color: "bg-[#FD6925]",
  },
  { id: "10", title: "Reduced Inequality", color: "bg-[#DD1367]" },
  {
    id: "11",
    title: "Sustainable Cities and Communities",
    color: "bg-[#FD9D24]",
  },
  {
    id: "12",
    title: "Responsible Consumption and Production",
    color: "bg-[#BF8B2E]",
  },
  { id: "13", title: "Climate Action", color: "bg-[#3F7E44]" },
  { id: "14", title: "Life Below Water", color: "bg-[#0A97D9]" },
  { id: "15", title: "Life on Land", color: "bg-[#56C02B]" },
  {
    id: "16",
    title: "Peace, Justice and Strong Institutions",
    color: "bg-[#00689D]",
  },
  { id: "17", title: "Partnerships for the Goals", color: "bg-[#19486A]" },
];

// ─── Zod schema ───────────────────────────────────────────────────────────────
// NOTE: country uses ISO alpha-3 (3-char) codes because that is what the
// CountryDropdown component stores (e.g. "GHA" for Ghana).
// The project service maps this value straight to the backend which now
// accepts min(2).max(3).

export const createProjectInputSchema = z.object({
  // Step 1 — Project Profile
  projectType: z.string().min(1, "Select a project type"),
  sector: z.string().min(1, "Sector is required"),
  name: z.string().min(1, "Project name is required").max(255),
  country: z.string().min(2, "Select a country").max(3),
  region: z.string().min(1, "Region / area is required"),
  gpsCoordinates: z
    .string()
    .regex(
      /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/,
      "Format: lat, lng — e.g. 6.5244, -1.3792",
    )
    .optional()
    .or(z.literal("")),
  startDate: z.coerce.date({
    error: () => ({ message: "Enter a valid start date" }),
  }),
  endDate: z.coerce.date().optional(),
  totalAreaHectares: z.coerce
    .number()
    .positive("Land area must be greater than 0"),
  currency: z.object({
    code: z.string().min(3, "Select a currency").max(3),
    name: z.string().min(1, "Select a currency"),
  }),

  // Step 2 — Practices & Context
  projectTags: z.array(z.string()).default([]),
  description: z
    .string()
    .min(20, "Please describe your project (at least 20 characters)")
    .max(1000),
  sdgs: z.array(z.string()).default([]),

  // Step 3 — Documents (tracked client-side, uploaded separately)
  documents: z.record(z.string(), z.any().nullable()).default({}),
});

export type TCreateProject = z.infer<typeof createProjectInputSchema>;

export const createProjectDefaultValues: TCreateProject = {
  projectType: "",
  sector: "green_economy",
  name: "",
  country: "GHA", // alpha3 for Ghana — matches CountryDropdown default
  region: "",
  gpsCoordinates: "",
  startDate: new Date(),
  endDate: undefined,
  totalAreaHectares: 0,
  currency: { code: "", name: "" },
  projectTags: [],
  description: "",
  sdgs: [],
  documents: {},
};
