import z from "zod";

const baseUserRegistrationSchema = z.object({
  // Required fields
  email: z.string().email("Invalid email format").toLowerCase().trim(),

  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must not exceed 50 characters")
    .trim(),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must not exceed 50 characters")
    .trim(),

  //   userName: z
  //     .string()
  //     .min(3, "Username must be at least 3 characters")
  //     .max(20, "Username must not exceed 20 characters")
  //     .regex(
  //       /^[a-zA-Z0-9_]+$/,
  //       "Username can only contain letters, numbers, and underscores",
  //     )
  //     .trim(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must not exceed 100 characters"),

  confirmPassword: z.string().min(1, "Confirm password is required"),

  // Optional fields
  //   image: z.url("Invalid image URL").optional().nullable(),

  phoneNumber: z.string().max(20, "Phone number must not exceed 20 characters"),
  sex: z.enum(["Male", "Female", "Other"]).optional(),

  contactNumber: z
    .string()
    .max(20, "Contact number must not exceed 20 characters")
    .optional(),

  countryOfOperation: z
    .string()
    .max(100, "Country must not exceed 100 characters")
    .optional(),
});

export const userRegistrationSchema = z
  .discriminatedUnion("userType", [
    baseUserRegistrationSchema.extend({
      userType: z.literal("Company"),
      company: z.object({
        legalBusinessName: z
          .string()
          .min(1, "Legal business name is required")
          .max(100, "Legal business name must not exceed 100 characters")
          .trim(),
        businessAddress: z
          .string()
          .max(255, "Business address must not exceed 255 characters")
          .trim()
          .optional(),
      }),
    }),
    baseUserRegistrationSchema.extend({
      userType: z.literal("ProjectOwner"),
      projectOwner: z
        .object({
          projectCategory: z
            .string()
            .max(255, "Project category must not exceed 255 characters")
            .trim()
            .optional(),
          projectStartDate: z
            .string()
            .max(255, "Project start date must not exceed 255 characters")
            .trim()
            .optional(),
        })
        .optional(),
    }),
  ])
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type TUserRegistrationInput = z.infer<typeof userRegistrationSchema>;

export const signInSchema = z.object({
  email: z.email("Invalid email format").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});
export type TSignInInput = z.infer<typeof signInSchema>;
