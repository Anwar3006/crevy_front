import z from "zod";

export const projectOwnerOnboardingSchema = z.object({
  // Step 1: User Info
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  contactNumber: z.string().min(1, "Contact number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  countryOfOperation: z.string().min(1, "Country is required"),

  // Step 2: Payment Details
  paymentMethod: z.enum(["bank", "momo"]),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  momoNetwork: z.string().optional(),
  momoNumber: z.string().optional(),

  // Step 3: Farm Plot
  region: z.string().min(1, "Region is required"),
  village: z.string().optional(),
  latitude: z.string().min(1, "Latitude is required"),
  longitude: z.string().min(1, "Longitude is required"),
  areaHectares: z.string().min(1, "Area is required"),

  // Step 4: Assignment
  partnerId: z.string().optional(),
  assignmentType: z.enum(["primary", "secondary"]).default("primary"),
  isB2cAssignment: z.boolean().default(true),
});

export type TProjectOwnerOnboardingInput = z.infer<
  typeof projectOwnerOnboardingSchema
>;
