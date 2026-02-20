import { z } from "zod";

export const PROJECT_TYPES = [
  {
    id: "regenerative_agriculture",
    title: "Regenerative Agriculture",
    icon: "/icons/3d-leaf.png",
    description:
      "Restore soil health and capture carbon through sustainable farming practices.",
  },
  {
    id: "waste_management",
    title: "Waste Management",
    icon: "/icons/3d-waste.png",
    description:
      "Reduce landfill reliance by converting organic or plastic waste into resources.",
  },
  {
    id: "renewable_energy",
    title: "Renewable Energy",
    icon: "/icons/3d-renewable.png",
    description:
      "Generate clean power using solar, wind, or hydro-electric infrastructure.",
  },
  {
    id: "biochar",
    title: "Biochar",
    icon: "/icons/biochar.png",
    description:
      "Create stable carbon sinks by converting biomass into charcoal-like soil enhancers.",
  },
  {
    id: "reforestation",
    title: "Reforestation",
    icon: "/icons/reforestation.png",
    description:
      "Rebuild ecosystems and sequester carbon by planting native forest species.",
  },
  {
    id: "blue_carbon",
    title: "Blue Carbon",
    icon: "/icons/blue-carbon.png",
    description:
      "Protect coastal ecosystems like mangroves and seagrasses to store carbon.",
  },
];

// export const projectTypeEnum = [
//   "reforestation",
//   "agroforestry",
//   "soil_carbon",
//   "wetland_restoration",
//   "mangrove_restoration",
//   "grassland_management",
//   "biochar",
//   "other"
// ] as const;

export const projectTypeEnum = PROJECT_TYPES.map((type) => type.id) as [
  string,
  ...string[],
];

export const createProjectInputSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(100),

  projectType: z.enum(projectTypeEnum, {
    error: () => ({ message: "Please select a valid project category" }),
  }),

  location: z.string().min(2, "Location is required"),

  // Coordinates usually come as "lat, lng" - NOW OPTIONAL
  gpsCoordinates: z
    .string()
    .regex(/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/, "Invalid GPS format (lat, lng)")
    .optional()
    .or(z.literal("")),

  // Use coerce to handle both string inputs from forms and Date objects
  startDate: z.coerce.date({
    error: () => ({ message: "Please enter a valid start date" }),
  }),

  durationMonths: z.coerce.number().int().positive().min(1),
  totalAreaHectares: z.coerce.number().positive("Total area is required"),

  // Land Use & Practices
  baselineLandUse: z
    .string()
    .min(5, "Baseline land use description is required"),
  regenerativePractices: z
    .array(z.string())
    .min(1, "Select at least one practice"),
  otherPractice: z.string().optional().or(z.literal("")),

  // Soil & Biomass
  soilType: z.string().optional().or(z.literal("")),
  initialSoilCarbonContent: z.coerce
    .number()
    .min(0)
    .max(100)
    .optional()
    .or(z.literal(0)),
  expectedBiomassIncrease: z.string().optional().or(z.literal("")),

  // Productivity & Inputs
  cropLivestockTypes: z.string().optional().or(z.literal("")),
  usesSyntheticFertilizers: z.string().default("no"), // Using string for radio/select
  usesSyntheticPesticides: z.string().default("no"),
  organicAmendments: z.string().optional().or(z.literal("")),

  // Community & Co-benefits
  socialEconomicBenefits: z.string().optional().or(z.literal("")),
  supportsBiodiversity: z.string().default("no"),
  supportsWaterManagement: z.string().default("no"),
  planToExpandPractices: z.string().default("no"),

  description: z.string().min(20, "Please provide a detailed description"),
  implementationPlan: z.string().optional().or(z.literal("")),
  expectedOutcomes: z.string().optional().or(z.literal("")),

  currentStatus: z.string().optional().or(z.literal("")),
  region: z.string().default("Africa"),
  sdgs: z.array(z.string()).optional().default([]),
  documents: z.array(z.any()).optional().default([]),
});

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

export const createProjectDefaultValues: Partial<TCreateProject> = {
  name: "",
  projectType: "" as (typeof projectTypeEnum)[0],
  location: "GHA",
  gpsCoordinates: "",
  startDate: new Date(),
  durationMonths: 1,
  totalAreaHectares: 0,
  baselineLandUse: "",
  regenerativePractices: [],
  otherPractice: "",
  soilType: "",
  initialSoilCarbonContent: 0,
  expectedBiomassIncrease: "",
  cropLivestockTypes: "",
  usesSyntheticFertilizers: "no",
  usesSyntheticPesticides: "no",
  organicAmendments: "",
  socialEconomicBenefits: "",
  supportsBiodiversity: "no",
  supportsWaterManagement: "no",
  planToExpandPractices: "no",
  description: "",
  implementationPlan: "",
  expectedOutcomes: "",
  currentStatus: "",
  region: "Africa",
  sdgs: [],
  documents: [],
};

// Infer TypeScript type from create schema
export type TCreateProject = z.infer<typeof createProjectInputSchema>;
