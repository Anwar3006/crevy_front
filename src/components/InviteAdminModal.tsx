"use client";

import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InviteAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteAdminModal({ isOpen, onClose }: InviteAdminModalProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      email: "",
      roleName: "admin",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/v2/auth/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          roleName: data.roleName,
          // organizationId is intentionally omitted for admins
        }),
      });

      if (!response.ok) throw new Error("Failed to send invitation");

      toast.success("Admin invitation sent successfully");
      reset();
      onClose();
    } catch (error) {
      toast.error("Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite New Administrator</DialogTitle>
          <DialogDescription>
            Send an invitation to a new system administrator.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@crevy.com"
              {...register("email", { required: true })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roleName">Role</Label>
            <Select
              onValueChange={(val) => setValue("roleName", val)}
              defaultValue="admin"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">System Administrator</SelectItem>
                <SelectItem value="super_admin">Super Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              ) : (
                "Send Invitation"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
