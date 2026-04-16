"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CustomDatePicker from "@/components/CustomDatePicker";
import CustomInput from "@/components/CustomInput";
import CustomSelect from "@/components/CustomSelect";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { USERTYPE_OPTIONS } from "@/constants/user";
import { useRegisterUser } from "@/hooks/use-user";

import { cn } from "@/lib/utils";
import {
  type TUserRegistrationInput,
  userRegistrationSchema,
} from "@/types/user.types";

const RegisterForm = ({
  isInvited = false,
  inviteData,
  className,
  ...props
}: React.ComponentProps<"form"> & {
  isInvited?: boolean;
  inviteData?: { email: string; role: string };
}) => {
  const form = useForm<TUserRegistrationInput>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      userType: "ProjectOwner",
      image: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      projectOwner: {
        projectCategory: "",
        projectStartDate: "",
      },
      company: {
        legalBusinessName: "",
        businessAddress: "",
      },
    } as any,
  });
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedUserType = form.watch("userType");

  const { mutateAsync, isPending } = useRegisterUser();
  const isSubmittingForm = isSubmitting || isPending;

  const handleSubmit = async (data: TUserRegistrationInput) => {
    console.log("handle submit click ", data);
    setIsSubmitting(true);
    try {
      // const completeData = {
      //   ...data,
      //   name:
      // }
      // Step 1: Call our backend /auth/register
      const result = await mutateAsync(data);

      if (result.success) {
        // Step 2: Redirect to login or auto-login
        // For now, let's redirect to login since we don't have auto-login implemented yet on the custom endpoint return
        toast.success("Account created successfully! Please log in.");
        router.push("/login");
      }
    } catch (error: unknown) {
      console.error("Error registering user: ", error);
      // Error toast already handled by useRegisterUser hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            {/* Title */}
            <h1 className="text-2xl font-bold">
              {isInvited
                ? "Administrative Account Setup"
                : "Create your account"}
            </h1>

            <p className="text-muted-foreground text-sm text-balance">
              Fill in the form below to create an account
            </p>
          </div>

          {/* First name and last name */}
          <div className="grid grid-cols-2 gap-5">
            <CustomInput
              type="text"
              name="firstName"
              label="First Name"
              placeholder="Rebecca"
              control={form.control}
              disabled={false}
              readOnly={false}
            />

            <CustomInput
              type="text"
              name="lastName"
              label="Last Name"
              placeholder="Yekple"
              control={form.control}
              disabled={false}
              readOnly={false}
            />
          </div>

          {/* Sex and DOB */}
          {/* <div className="grid grid-cols-2 gap-5">
            <CustomSelect
              name="sex"
              label="Sex"
              placeholder="Select sex"
              options={SEX_OPTIONS}
              control={form.control}
              description="Your biological sex"
            />
          </div> */}

          {/* Email */}
          <CustomInput
            type="email"
            name="email"
            label="Email Address"
            placeholder="rebecca@gmail.com"
            control={form.control}
            description="This email address will be your primary form of contact.
              Periodically check your inbox."
            disabled={isInvited} //disable if invited
            readOnly={isInvited}
          />

          {/* Phone Number */}
          <CustomInput
            type="text"
            name="phoneNumber"
            label="Phone Number"
            placeholder="+233 55 555 5555"
            control={form.control}
            description="We will use this to contact you if need be. Make sure it is accessible."
            disabled={false}
            readOnly={false}
          />

          {/* Role */}
          <CustomSelect
            name="userType"
            label="User Type"
            options={USERTYPE_OPTIONS}
            control={form.control}
            description="Select your user type"
            disabled={isInvited}
          />

          {/* Conditional Fields based on User Type */}
          {selectedUserType === "Company" && (
            <div className="flex flex-col gap-5 border-l-4 border-emerald-500 pl-4 py-2 bg-slate-50 rounded-r-lg">
              <h3 className="text-sm font-semibold text-emerald-700">
                Company Information
              </h3>
              <CustomInput
                type="text"
                name="company.legalBusinessName"
                label="Legal Business Name"
                placeholder="Crevy Solutions Ltd"
                control={form.control}
              />
              <CustomInput
                type="text"
                name="company.businessAddress"
                label="Business Address"
                placeholder="123 Business Way, Accra"
                control={form.control}
              />
            </div>
          )}

          {selectedUserType === "ProjectOwner" && (
            <div className="flex flex-col gap-5 border-l-4 border-emerald-500 pl-4 py-2 bg-slate-50 rounded-r-lg">
              <h3 className="text-sm font-semibold text-emerald-700">
                Project Owner Information
              </h3>
              <CustomInput
                type="text"
                name="projectOwner.projectCategory"
                label="Project Category"
                placeholder="Reforestation, Renewable Energy, etc."
                control={form.control}
                readOnly={false}
              />
              <CustomDatePicker
                control={form.control}
                name="projectOwner.projectStartDate"
                label="Preferred Project Start Date"
                placeholder="2026/10/20"
                enableFutureDates={true}
              />
            </div>
          )}

          {selectedUserType === "Admin" && (
            <div className="flex flex-col gap-5 border-l-4 border-emerald-500 pl-4 py-2 bg-slate-50 rounded-r-lg">
              <h3 className="text-sm font-semibold text-emerald-700">
                Administrative Information
              </h3>
              <CustomInput
                type="text"
                name="admin.assignedBusinessId"
                label="Assigned Business ID (Optional)"
                placeholder="BUS-12345"
                control={form.control}
              />
            </div>
          )}

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-2 gap-5">
            <CustomInput
              type="password"
              name="password"
              label="Password"
              placeholder="***********"
              control={form.control}
              disabled={false}
              readOnly={false}
            />
            <CustomInput
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="***********"
              control={form.control}
              disabled={false}
              readOnly={false}
            />
          </div>

          <Field>
            <Button
              type="submit"
              className="py-5 bg-[#2CC295]"
              disabled={isSubmittingForm}
              onClick={() => {
                console.log("I am clicked but: ", form.formState.errors);
              }}
            >
              {isPending ? "Creating..." : "Register an Account"}
            </Button>
          </Field>

          <FieldSeparator>Or continue with</FieldSeparator>

          <Field>
            <FieldDescription className="px-6 text-center">
              Already have an account?{" "}
              <a href="/login" className="text-emerald-600">
                Sign in
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
};

export default RegisterForm;
