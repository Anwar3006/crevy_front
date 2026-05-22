"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserService } from "@/lib/services/user-service";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z.string().optional(),
  sex: z.string().optional(),
  contactNumber: z.string().optional(),
  countryOfOperation: z.string().optional(),
  // Company fields
  legalBusinessName: z.string().optional(),
  businessAddress: z.string().optional(),
  // Project Owner fields
  projectCategory: z.string().optional(),
  projectStartDate: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileFormProps {
  user: any;
  readOnly?: boolean;
}

export function EditProfileForm({
  user,
  readOnly = false,
}: EditProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phoneNumber: user.phoneNumber || "",
      sex: user.sex || "",
      contactNumber: user.contactNumber || "",
      countryOfOperation: user.countryOfOperation || "",
      legalBusinessName: user.company?.legalBusinessName || "",
      businessAddress: user.company?.businessAddress || "",
      projectCategory: user.projectOwner?.projectCategory || "",
      projectStartDate: user.projectOwner?.projectStartDate || "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    if (readOnly) return;
    setIsSubmitting(true);
    try {
      // Structure the data according to userType
      const updateData: any = {
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        sex: values.sex,
        contactNumber: values.contactNumber,
        countryOfOperation: values.countryOfOperation,
      };

      if (user.role === "financial_admin") {
        updateData.company = {
          legalBusinessName: values.legalBusinessName,
          businessAddress: values.businessAddress,
        };
      } else if (user.role === "project_owner") {
        updateData.projectOwner = {
          projectCategory: values.projectCategory,
          projectStartDate: values.projectStartDate,
        };
      }

      await UserService.updateUserProfile(updateData);
      await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <UserIcon className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Personal Information</CardTitle>
            <CardDescription>
              {readOnly
                ? "Viewing user profile data"
                : "Update your personal and business details"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...form.register("firstName")}
                disabled={readOnly}
              />
              {form.formState.errors.firstName && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...form.register("lastName")}
                disabled={readOnly}
              />
              {form.formState.errors.lastName && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                {...form.register("phoneNumber")}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sex">Sex</Label>
              <Select
                defaultValue={user.sex}
                onValueChange={(val) => form.setValue("sex", val)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                {...form.register("contactNumber")}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="countryOfOperation">Country of Operation</Label>
              <Input
                id="countryOfOperation"
                {...form.register("countryOfOperation")}
                disabled={readOnly}
              />
            </div>
          </div>

          {user.role === "financial_admin" && (
            <div className="space-y-6 pt-6 border-t">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Company Data
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="legalBusinessName">Legal Business Name</Label>
                  <Input
                    id="legalBusinessName"
                    {...form.register("legalBusinessName")}
                    disabled={readOnly}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Input
                    id="businessAddress"
                    {...form.register("businessAddress")}
                    disabled={readOnly}
                  />
                </div>
              </div>
            </div>
          )}

          {user.role === "project_owner" && (
            <div className="space-y-6 pt-6 border-t">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Project Owner Data
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectCategory">Project Category</Label>
                  <Input
                    id="projectCategory"
                    {...form.register("projectCategory")}
                    disabled={readOnly}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectStartDate">Project Start Date</Label>
                  <Input
                    id="projectStartDate"
                    {...form.register("projectStartDate")}
                    disabled={readOnly}
                  />
                </div>
              </div>
            </div>
          )}

          {!readOnly && (
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
