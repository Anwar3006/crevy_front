// src/constants/waitlist.ts
import { z } from "zod";

// ─── Option Lists ────────────────────────────────────────────────────────────

export const ROLE_DESCRIPTION_OPTIONS = [
  "Farmer Cooperative",
  "Project Developer",
  "Carbon Credit Buyer",
  "Investor",
  "Climate Startup",
  "NGO / Development Organization",
  "Government Agency",
  "Carbon Verifier / Auditor",
  "Sustainability Professional",
  "Consultant",
  "Research Institution",
  "Other",
] as const;

export const CLIMATE_SECTOR_OPTIONS = [
  "Regenerative Agriculture",
  "Forestry / Afforestation",
  "Agroforestry",
  "Biochar",
  "Renewable Energy",
  "Waste Management",
  "Biodiversity",
  "Blue Carbon",
  "Climate Finance",
  "Carbon Markets",
  "MRV Technology",
  "Other",
] as const;

export const USE_CASE_OPTIONS = [
  "Access Carbon Financing",
  "Register Climate Projects",
  "Monitor Project Impact",
  "Purchase Carbon Credits",
  "Invest in Climate Projects",
  "Verify Climate Projects",
  "Explore Partnerships",
  "Learn About Carbon Markets",
  "Other",
] as const;

export const MANAGES_PROJECTS_OPTIONS = [
  "I manage climate projects",
  "I invest in climate projects",
] as const;

export const PROJECT_COUNT_OPTIONS = ["1–5", "6–20", "21–100", "100+"] as const;

export const PRIMARY_INTEREST_OPTIONS = [
  "Investing in Climate Projects",
  "Purchasing Carbon Credits",
  "Project Pipeline Access",
  "Co-investment Opportunities",
  "Climate Market Intelligence",
  "Strategic Partnerships",
] as const;

export const INVESTMENT_BUDGET_OPTIONS = [
  "Under $10,000",
  "$10,000–$50,000",
  "$50,000–$250,000",
  "$250,000+",
  "Prefer not to say",
] as const;

// ─── Validation Schema ───────────────────────────────────────────────────────
//
// Mirrors the backend's createWaitlistRegistrationSchema body shape exactly
// (src/v2/auth/schemas/waitlist_registration.schema.ts on crevy-backend).
// Conditional investor/buyer fields (primaryInterest, investmentBudget) are
// enforced here via superRefine since "I invest in climate projects" should
// require them, even though the backend keeps them optional.

export const waitlistRegistrationSchema = z
  .object({
    firstName: z.string().min(1, "First name is required").max(100),
    middleName: z.string().max(100).optional().or(z.literal("")),
    lastName: z.string().min(1, "Last name is required").max(100),
    email: z.string().email("Enter a valid email address").max(255),
    phoneNumber: z.string().max(50).optional().or(z.literal("")),

    organizationName: z
      .string()
      .min(1, "Organization name is required")
      .max(255),
    jobTitle: z.string().min(1, "Job title is required").max(150),
    country: z.string().min(1, "Select your country"),

    roleDescription: z.string().min(1, "Select your role"),
    climateSectors: z
      .array(z.string())
      .min(1, "Select at least one climate sector"),
    useCases: z.array(z.string()).min(1, "Select at least one use case"),

    managesProjects: z.string().min(1, "This field is required"),
    projectCount: z.string().optional().or(z.literal("")),
    hectaresManaged: z.string().max(100).optional().or(z.literal("")),

    primaryInterest: z.string().optional().or(z.literal("")),
    investmentBudget: z.string().optional().or(z.literal("")),

    biggestChallenge: z.string().min(1, "Please share your biggest challenge"),
    platformValueExpectation: z
      .string()
      .min(1, "Please share what you expect from the platform"),
  })
  .superRefine((data, ctx) => {
    const isInvestor = data.managesProjects === "I invest in climate projects";

    if (isInvestor && !data.primaryInterest) {
      ctx.addIssue({
        code: "custom",
        path: ["primaryInterest"],
        message: "Select your primary interest",
      });
    }
    if (isInvestor && !data.investmentBudget) {
      ctx.addIssue({
        code: "custom",
        path: ["investmentBudget"],
        message: "Select an investment budget range",
      });
    }

    const isManager = data.managesProjects === "I manage climate projects";
    if (isManager && !data.projectCount) {
      ctx.addIssue({
        code: "custom",
        path: ["projectCount"],
        message: "Select the number of projects you manage",
      });
    }
  });

export type TWaitlistRegistration = z.infer<typeof waitlistRegistrationSchema>;

export const waitlistRegistrationDefaultValues: TWaitlistRegistration = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  organizationName: "",
  jobTitle: "",
  country: "",
  roleDescription: "",
  climateSectors: [],
  useCases: [],
  managesProjects: "",
  projectCount: "",
  hectaresManaged: "",
  primaryInterest: "",
  investmentBudget: "",
  biggestChallenge: "",
  platformValueExpectation: "",
};
