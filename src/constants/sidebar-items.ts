import {
  CalculateIcon,
  CheckListIcon,
  CheckmarkCircle03Icon,
  CustomerService01Icon,
  DashboardSquareAddIcon,
  DiscoverCircleIcon,
  MentoringIcon,
  Notification01Icon,
  OrganicFoodIcon,
  User02Icon,
} from "@hugeicons/core-free-icons";
import type { SidebarConfig } from "@/types/sidebar.types";

export const SIDEBAR_CONFIG: SidebarConfig = {
  // Top-level items (Get Started, Compliance, Dashboard)
  topItems: [
    {
      title: "Get Started",
      url: "/get-started",
      icon: MentoringIcon,
    },
    {
      title: "Compliance",
      url: "/compliance",
      icon: CheckmarkCircle03Icon,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: DashboardSquareAddIcon,
    },
  ],
  // Grouped sections
  sections: [
    {
      title: "CARBON CENTER",
      items: [
        {
          title: "Carbon Credit Calculator",
          url: "/carbon-calculator",
          icon: CalculateIcon,
        },
        {
          title: "Project Profile",
          url: "/project-profile",
          icon: DiscoverCircleIcon,
        },
        {
          title: "Carbon Credits",
          url: "/carbon-credits",
          icon: OrganicFoodIcon,
        },
        {
          title: "Track Verification",
          url: "/track-verification",
          icon: CheckListIcon,
        },
      ],
    },
    {
      title: "ACCOUNT PAGES",
      items: [
        {
          title: "User Profile",
          url: "/user-profile",
          icon: User02Icon,
        },
        {
          title: "Notifications",
          url: "/notifications",
          icon: Notification01Icon,
          badge: 3, // Example badge
        },
        {
          title: "Support",
          url: "/support",
          icon: CustomerService01Icon,
        },
      ],
    },
  ],
};
