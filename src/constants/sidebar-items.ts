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
      // @ts-expect-error
      icon: MentoringIcon,
    },
    {
      title: "Compliance",
      url: "/compliance",
      // @ts-expect-error
      icon: CheckmarkCircle03Icon,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      // @ts-expect-error
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
          // @ts-expect-error
          icon: CalculateIcon,
        },
        {
          title: "Project Profile",
          url: "/project-profile",
          // @ts-expect-error
          icon: DiscoverCircleIcon,
        },
        {
          title: "Carbon Credits",
          url: "/carbon-credits",
          // @ts-expect-error
          icon: OrganicFoodIcon,
        },
        {
          title: "Track Verification",
          url: "/track-verification",
          // @ts-expect-error
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
          // @ts-expect-error
          icon: User02Icon,
        },
        {
          title: "Notifications",
          url: "/notifications",
          // @ts-expect-error
          icon: Notification01Icon,
          badge: 3, // Example badge
        },
        {
          title: "Support",
          url: "/support",
          // @ts-expect-error
          icon: CustomerService01Icon,
        },
      ],
    },
  ],
};
