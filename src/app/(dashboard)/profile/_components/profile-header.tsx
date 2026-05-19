"use client";

import { Building2, Mail, MapPin, Phone, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileHeaderProps {
  user: any;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  if (!user) return null;

  const initials =
    `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() ||
    "U";

  return (
    <Card className="overflow-hidden border-none bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white/20 shadow-xl">
            <AvatarImage
              src={user.image}
              alt={`${user.firstName} ${user.lastName}`}
            />
            <AvatarFallback className="bg-emerald-700 text-white text-2xl md:text-3xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <Badge
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-none"
                >
                  {user.role === "financial_admin" ? (
                    <Building2 className="w-3 h-3 mr-1" />
                  ) : (
                    <UserIcon className="w-3 h-3 mr-1" />
                  )}
                  {user.role
                    ?.replace(/_/g, " ")
                    .replace(/\b\w/g, (l: any) => l.toUpperCase()) || "User"}
                </Badge>
              </div>
              <p className="text-emerald-50 font-medium flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-emerald-50/80">
              {user.phoneNumber && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  {user.phoneNumber}
                </span>
              )}
              {user.countryOfOperation && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {user.countryOfOperation}
                </span>
              )}
            </div>

            {user.role === "financial_admin" &&
              user.company?.legalBusinessName && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm font-semibold text-emerald-50 uppercase tracking-wider">
                    Legal Entity
                  </p>
                  <p className="text-white font-medium">
                    {user.company.legalBusinessName}
                  </p>
                </div>
              )}

            {user.role === "project_owner" &&
              user.projectOwner?.projectCategory && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm font-semibold text-emerald-50 uppercase tracking-wider">
                    Project Category
                  </p>
                  <p className="text-white font-medium">
                    {user.projectOwner.projectCategory}
                  </p>
                </div>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
