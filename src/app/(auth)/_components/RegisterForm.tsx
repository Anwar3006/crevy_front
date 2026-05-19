"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRegisterUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import {
  type TUserRegistrationInput,
  userRegistrationSchema,
} from "@/types/user.types";

const RegisterForm = ({
  className,
  ...props
}: React.ComponentProps<"form">) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync, isPending } = useRegisterUser();
  const isLoading = isSubmitting || isPending;

  const form = useForm<TUserRegistrationInput>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      contactNumber: "",
      countryOfOperation: "",
    },
  });

  const handleSubmit = async (data: TUserRegistrationInput) => {
    setIsSubmitting(true);
    try {
      const result = await mutateAsync(data);
      if (result?.success) {
        toast.success("Account created! Please log in.");
        router.push("/login");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("flex flex-col gap-4", className)}
        noValidate
        {...props}
      >
        {/* Name row */}
        <div className="grid grid-cols-2 gap-4">
          <CustomInput
            control={form.control}
            name="firstName"
            type="text"
            label="First Name"
            placeholder="Rebecca"
          />
          <CustomInput
            control={form.control}
            name="lastName"
            type="text"
            label="Last Name"
            placeholder="Yekple"
          />
        </div>

        {/* Email */}
        <CustomInput
          control={form.control}
          name="email"
          type="email"
          label="Email Address"
          placeholder="rebecca@example.com"
          description="Optional. You can also log in with your phone number."
        />

        {/* Phone */}
        <CustomInput
          control={form.control}
          name="contactNumber"
          type="text"
          label="Phone Number"
          placeholder="+233 55 555 5555"
        />

        {/* Password row */}
        <div className="grid grid-cols-2 gap-4">
          <CustomInput
            control={form.control}
            name="password"
            type="password"
            label="Password"
            placeholder="Min. 6 characters"
          />
          <CustomInput
            control={form.control}
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Repeat password"
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-5 bg-[#2CC295] hover:bg-[#27a37b] text-white font-bold rounded-xl mt-2 transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account…
            </span>
          ) : (
            "Create Account"
          )}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-[#2CC295] font-semibold hover:underline"
          >
            Log in
          </a>
        </p>
      </form>
    </Form>
  );
};

export default RegisterForm;
