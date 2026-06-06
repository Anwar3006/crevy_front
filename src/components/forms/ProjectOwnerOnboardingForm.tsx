"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Smartphone,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import {
  projectOwnerOnboardingSchema,
  type TProjectOwnerOnboardingInput,
} from "@/types/onboarding.types";

const STEPS = [
  { id: 1, title: "Account", icon: User },
  { id: 2, title: "Payout", icon: Wallet },
  { id: 3, title: "Plot", icon: MapPin },
  { id: 4, title: "Assign", icon: Users },
];

export default function ProjectOwnerOnboardingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // State configurations for conditional checking UI
  const [isMomoSameAsContact, setIsMomoSameAsContact] = useState(false);
  const [isAccountNameSameAsUser, setIsAccountNameSameAsUser] = useState(false);

  const form = useForm<TProjectOwnerOnboardingInput>({
    resolver: zodResolver(projectOwnerOnboardingSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      password: "",
      countryOfOperation: "Ghana",
      paymentMethod: "momo",
      assignmentType: "primary",
      isB2cAssignment: true,
      momoNumber: "",
      momoNetwork: "",
      bankName: "",
      accountNumber: "",
      accountName: "",
    },
  });

  // Watch identity fields to keep computed values synced if checkboxes are active
  const watchedContactNumber = form.watch("contactNumber");
  const watchedFirstName = form.watch("firstName");
  const watchedLastName = form.watch("lastName");
  const watchedPaymentMethod = form.watch("paymentMethod");

  // Keep MoMo number synced with contact number if checkbox is checked
  useEffect(() => {
    if (isMomoSameAsContact && watchedContactNumber) {
      form.setValue("momoNumber", watchedContactNumber);
    }
  }, [isMomoSameAsContact, watchedContactNumber, form]);

  // Keep Account Name synced with Full Name if checkbox is checked
  useEffect(() => {
    if (isAccountNameSameAsUser) {
      const fullName = `${watchedFirstName} ${watchedLastName}`.trim();
      form.setValue("accountName", fullName);
    }
  }, [isAccountNameSameAsUser, watchedFirstName, watchedLastName, form]);

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) {
      fieldsToValidate = [
        "firstName",
        "lastName",
        "contactNumber",
        "password",
        "countryOfOperation",
      ];
    } else if (currentStep === 2) {
      fieldsToValidate = ["paymentMethod", "accountName"];
      if (watchedPaymentMethod === "bank") {
        fieldsToValidate.push("bankName", "accountNumber");
      }
      if (watchedPaymentMethod === "momo") {
        fieldsToValidate.push("momoNetwork", "momoNumber");
      }
    } else if (currentStep === 3) {
      fieldsToValidate = ["region", "latitude", "longitude", "areaHectares"];
    }

    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = async (data: TProjectOwnerOnboardingInput) => {
    setLoading(true);
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        contactNumber: data.contactNumber,
        password: data.password,
        countryOfOperation: data.countryOfOperation,
        partnerId: data.partnerId,
        assignmentType: data.assignmentType,
        isB2cAssignment: data.isB2cAssignment,

        bankDetails:
          data.paymentMethod === "bank"
            ? {
                bankName: data.bankName || "",
                accountNumber: data.accountNumber || "",
                accountName: data.accountName || null,
              }
            : null,

        momoDetails:
          data.paymentMethod === "momo"
            ? {
                network: data.momoNetwork || "",
                number: data.momoNumber || "",
                accountName: data.accountName || null,
              }
            : null,

        farmPlot: data.region
          ? {
              region: data.region,
              village: data.village || null,
              centroid: {
                lat: Number(data.latitude),
                lng: Number(data.longitude),
              },
              areaHectares: Number(data.areaHectares),
            }
          : null,
      };

      const _response = await axios.post(
        "/api/v2/project-owners/onboard",
        payload,
      );

      toast.success("Project Owner registered successfully!");
      router.push("/dashboard/new-project");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please check the details.",
      );
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stepper Header */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6 px-2">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <div
                key={step.id}
                className="flex flex-col items-center gap-3 group"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm",
                    isActive
                      ? "bg-[#2CC295] text-white ring-4 ring-[#2CC295]/15 scale-110"
                      : isCompleted
                        ? "bg-[#2CC295]/10 text-[#2CC295]"
                        : "bg-white text-gray-300 border border-gray-100",
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.15em] transition-colors duration-300",
                    isActive
                      ? "text-[#2CC295]"
                      : "text-gray-400 group-hover:text-gray-500",
                  )}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="relative h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-[#2CC295]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "circOut" }}
          />
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit as any)}
          className="space-y-8"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  {/* Step 1: Account Info */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2CC295]/10 text-[#2CC295] text-[10px] font-bold uppercase tracking-wider mb-3">
                          <span className="w-1 h-1 rounded-full bg-[#2CC295]" />
                          Step 01
                        </div>
                        <h2 className="text-3xl font-extrabold text-[#131927] tracking-tight">
                          Identity Profile
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                          Register the primary credentials for the project
                          owner.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <CustomInput
                          name="firstName"
                          label="First Name"
                          placeholder="e.g. Daniel"
                          control={form.control}
                          type="text"
                          disabled={loading}
                        />
                        <CustomInput
                          name="lastName"
                          label="Last Name"
                          placeholder="e.g. Asante"
                          control={form.control}
                          type="text"
                          disabled={loading}
                        />
                      </div>
                      <CustomInput
                        name="contactNumber"
                        label="Phone Number"
                        placeholder="+233..."
                        control={form.control}
                        type="text"
                        description="Required for system access (login identifier)."
                        disabled={loading}
                      />
                      <CustomInput
                        name="email"
                        label="Email Address (Optional)"
                        placeholder="daniel@example.com"
                        control={form.control}
                        type="email"
                        disabled={loading}
                      />
                      <CustomInput
                        name="password"
                        label="Access Password"
                        placeholder="Min 8 characters"
                        control={form.control}
                        type="password"
                        disabled={loading}
                      />
                      <CustomInput
                        name="countryOfOperation"
                        label="Country of Operation"
                        placeholder="Ghana"
                        control={form.control}
                        type="text"
                        disabled={loading}
                      />
                    </div>
                  )}

                  {/* Step 2: Payment Details */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2CC295]/10 text-[#2CC295] text-[10px] font-bold uppercase tracking-wider mb-3">
                          <span className="w-1 h-1 rounded-full bg-[#2CC295]" />
                          Step 02
                        </div>
                        <h2 className="text-3xl font-extrabold text-[#131927] tracking-tight">
                          Payout Configuration
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                          Set up secure channels for climate revenue
                          disbursement.
                        </p>
                      </div>

                      <div className="space-y-5">
                        <Label className="text-sm font-bold text-gray-700">
                          Preferred Payout Method
                        </Label>
                        <RadioGroup
                          defaultValue={watchedPaymentMethod}
                          onValueChange={(v) =>
                            form.setValue("paymentMethod", v as "bank" | "momo")
                          }
                          className="grid grid-cols-2 gap-5"
                        >
                          <div>
                            <RadioGroupItem
                              value="momo"
                              id="momo"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="momo"
                              className="flex flex-col items-center justify-center h-40 gap-4 rounded-3xl border-2 border-gray-100 bg-white p-6 hover:bg-gray-50 peer-data-[state=checked]:border-[#2CC295] peer-data-[state=checked]:bg-[#2CC295]/5 [&:has([data-state=checked])]:border-[#2CC295] cursor-pointer transition-all duration-300"
                            >
                              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-peer-data-[state=checked]:bg-[#2CC295]/20 group-peer-data-[state=checked]:text-[#2CC295]">
                                <Smartphone className="h-6 w-6" />
                              </div>
                              <span className="font-bold text-sm tracking-tight">
                                Mobile Money
                              </span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="bank"
                              id="bank"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="bank"
                              className="flex flex-col items-center justify-center h-40 gap-4 rounded-3xl border-2 border-gray-100 bg-white p-6 hover:bg-gray-50 peer-data-[state=checked]:border-[#2CC295] peer-data-[state=checked]:bg-[#2CC295]/5 [&:has([data-state=checked])]:border-[#2CC295] cursor-pointer transition-all duration-300"
                            >
                              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                                <Building2 className="h-6 w-6" />
                              </div>
                              <span className="font-bold text-sm tracking-tight">
                                Bank Transfer
                              </span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Unified Account Name Strategy with Identity Verification */}
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="sameAsUser"
                            checked={isAccountNameSameAsUser}
                            onCheckedChange={(checked) => {
                              setIsAccountNameSameAsUser(!!checked);
                              if (!checked) form.setValue("accountName", "");
                            }}
                          />
                          <label
                            htmlFor="sameAsUser"
                            className="text-xs font-bold text-gray-700 cursor-pointer select-none"
                          >
                            Account name is the same as Identity Profile Name
                          </label>
                        </div>

                        {isAccountNameSameAsUser && (
                          <div className="text-xs text-gray-400 pl-7 font-medium">
                            Reference Display:{" "}
                            <span className="text-emerald-600 font-bold">
                              {`${watchedFirstName} ${watchedLastName}`.trim() ||
                                "(No name entered yet)"}
                            </span>
                          </div>
                        )}
                      </div>

                      {!isAccountNameSameAsUser && (
                        <CustomInput
                          name="accountName"
                          label="Registered Account Name"
                          placeholder="e.g. Daniel Asante"
                          control={form.control}
                          type="text"
                          disabled={loading}
                        />
                      )}

                      {/* Bank Fields */}
                      {watchedPaymentMethod === "bank" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-5 pt-2"
                        >
                          <CustomInput
                            name="bankName"
                            label="Bank Name"
                            placeholder="e.g. Ecobank"
                            control={form.control}
                            type="text"
                            disabled={loading}
                          />
                          <CustomInput
                            name="accountNumber"
                            label="Account Number"
                            placeholder="0000 0000 0000"
                            control={form.control}
                            type="text"
                            disabled={loading}
                          />
                        </motion.div>
                      )}

                      {/* MoMo Fields */}
                      {watchedPaymentMethod === "momo" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-5 pt-2"
                        >
                          <CustomInput
                            name="momoNetwork"
                            label="Network Provider"
                            placeholder="e.g. MTN, Telecel"
                            control={form.control}
                            type="text"
                            disabled={loading}
                          />

                          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <Checkbox
                              id="sameAsContact"
                              checked={isMomoSameAsContact}
                              onCheckedChange={(checked) => {
                                setIsMomoSameAsContact(!!checked);
                                if (!checked) form.setValue("momoNumber", "");
                              }}
                            />
                            <label
                              htmlFor="sameAsContact"
                              className="text-xs font-bold text-gray-700 cursor-pointer select-none"
                            >
                              MoMo number is the same as Identity Contact Number
                            </label>
                          </div>

                          {isMomoSameAsContact && (
                            <div className="text-xs text-gray-400 px-4 font-medium">
                              Reference Display:{" "}
                              <span className="text-emerald-600 font-bold">
                                {watchedContactNumber ||
                                  "(No contact number entered yet)"}
                              </span>
                            </div>
                          )}

                          {!isMomoSameAsContact && (
                            <CustomInput
                              name="momoNumber"
                              label="Registered MoMo Number"
                              placeholder="054..."
                              control={form.control}
                              type="text"
                              disabled={loading}
                            />
                          )}
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Step 3: Land Plot */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2CC295]/10 text-[#2CC295] text-[10px] font-bold uppercase tracking-wider mb-3">
                          <span className="w-1 h-1 rounded-full bg-[#2CC295]" />
                          Step 03
                        </div>
                        <h2 className="text-3xl font-extrabold text-[#131927] tracking-tight">
                          Spatial Registration
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                          Locate the primary farm plot for initial mapping.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <CustomInput
                          name="region"
                          label="Region"
                          placeholder="e.g. Ashanti"
                          control={form.control}
                          type="text"
                          disabled={loading}
                        />
                        <CustomInput
                          name="village"
                          label="Village / Settlement"
                          placeholder="e.g. Ejura"
                          control={form.control}
                          type="text"
                          disabled={loading}
                        />
                      </div>

                      <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#2CC295] shrink-0">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-emerald-900 tracking-tight mb-1">
                            Coordinate Capture
                          </p>
                          <p className="text-xs text-emerald-700/80 leading-relaxed">
                            Captured coordinates from GPS or manual entry. Used
                            for satellite dMRV verification.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <CustomInput
                          name="latitude"
                          label="Latitude"
                          placeholder="6.1234"
                          control={form.control}
                          type="text"
                          disabled={loading}
                        />
                        <CustomInput
                          name="longitude"
                          label="Longitude"
                          placeholder="-0.6543"
                          control={form.control}
                          type="text"
                          disabled={loading}
                        />
                      </div>
                      <CustomInput
                        name="areaHectares"
                        label="Estimated Area (Hectares)"
                        placeholder="e.g. 2.5"
                        control={form.control}
                        type="text"
                        disabled={loading}
                      />
                    </div>
                  )}

                  {/* Step 4: Assignment */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2CC295]/10 text-[#2CC295] text-[10px] font-bold uppercase tracking-wider mb-3">
                          <span className="w-1 h-1 rounded-full bg-[#2CC295]" />
                          Step 04
                        </div>
                        <h2 className="text-3xl font-extrabold text-[#131927] tracking-tight">
                          Final Review
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                          Establish agent connectivity and confirm registration.
                        </p>
                      </div>

                      <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 space-y-6">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-[#2CC295]/10 flex items-center justify-center text-[#2CC295]">
                            <Users className="w-7 h-7" />
                          </div>
                          <div>
                            <p className="text-lg font-bold text-[#131927] tracking-tight">
                              Agent Connectivity
                            </p>
                            <p className="text-xs text-gray-500">
                              You will be linked as the primary field agent.
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <CustomInput
                            name="partnerId"
                            label="Partner Organization (Optional)"
                            placeholder="Search organization..."
                            control={form.control}
                            type="text"
                            disabled={loading}
                          />
                          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100">
                            <span className="text-sm font-bold text-gray-700">
                              Assignment Type
                            </span>
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2CC295] bg-[#2CC295]/10 px-3 py-1.5 rounded-full">
                              Primary
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <div className="p-6 bg-amber-50/50 rounded-3xl border border-amber-100 flex items-start gap-4">
                          <CheckCircle2 className="w-6 h-6 text-amber-500 shrink-0" />
                          <div>
                            <p className="text-sm font-extrabold text-amber-900 tracking-tight mb-1">
                              Pre-submission Confirmation
                            </p>
                            <p className="text-xs text-amber-700/80 leading-relaxed">
                              The project owner profile will remain 'PENDING'
                              until KYC documents are uploaded and verified by
                              the admin team.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center px-4">
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1 || loading}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </Button>

            {currentStep < STEPS.length ? (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-[#2CC295] hover:bg-[#25a37d] text-white px-10 py-7 rounded-2xl flex items-center gap-3 font-extrabold transition-all shadow-xl shadow-[#2CC295]/25"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#131927] hover:bg-black text-white px-12 py-7 rounded-2xl flex items-center gap-3 font-extrabold transition-all shadow-xl shadow-[#131927]/25"
              >
                {loading ? "Synchronizing..." : "Finalize Registration"}
                <CheckCircle2 className="w-5 h-5" />
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
