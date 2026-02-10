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
    id: "blue-carbon",
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

  // Coordinates usually come as "lat, lng"
  gpsCoordinates: z
    .string()
    .regex(/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/, "Invalid GPS format (lat, lng)"),

  // Use coerce to handle both string inputs from forms and Date objects
  startDate: z.coerce.date({
    error: () => ({ message: "Please enter a valid start date" }),
  }),

  durationMonths: z.coerce.number().int().positive().min(1),
  totalAreaHectares: z.coerce.number().positive(),
  baselineLandUse: z.string().min(10).optional().or(z.literal("")),
  baselineEmissionsYearly: z.coerce.number().nonnegative().optional(),
  soilType: z.string().optional().or(z.literal("")),
  initialSoilCarbonContent: z.coerce.number().min(0).max(100).optional(),
  cropLivestockTypes: z.string().optional().or(z.literal("")),

  usesSyntheticFertilizers: z.boolean().default(false),
  usesSyntheticPesticides: z.boolean().default(false),
  organicAmendments: z.string().optional().or(z.literal("")),

  supportsBiodiversityConservation: z.boolean().default(false),
  supportsWaterManagement: z.boolean().default(false),

  description: z.string().min(20, "Please provide a detailed description"),
  implementationPlan: z.string().min(20).optional().or(z.literal("")),
  expectedOutcomes: z.string().min(20).optional().or(z.literal("")),
});

export const createProjectDefaultValues: Partial<TCreateProject> = {
  name: "",
  projectType: "" as (typeof projectTypeEnum)[0],
  location: "",
  gpsCoordinates: "",
  startDate: new Date(),
  durationMonths: 1,
  totalAreaHectares: 1,
  baselineLandUse: "",
  baselineEmissionsYearly: 0,
  soilType: "",
  initialSoilCarbonContent: 0,
  cropLivestockTypes: "",
  usesSyntheticFertilizers: false,
  usesSyntheticPesticides: false,
  organicAmendments: "",
  supportsBiodiversityConservation: false,
  supportsWaterManagement: false,
  description: "",
  implementationPlan: "",
  expectedOutcomes: "",
};

// Infer TypeScript type from create schema
export type TCreateProject = z.infer<typeof createProjectInputSchema>;
