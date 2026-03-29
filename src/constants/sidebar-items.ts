import {
  CalculateIcon,
  Calendar03Icon,
  CheckListIcon,
  CheckmarkCircle03Icon,
  CustomerService01Icon,
  DashboardSquareAddIcon,
  DiscoverCircleIcon,
  Notification01Icon,
  OrganicFoodIcon,
  PropertyAddIcon,
  User02Icon,
  UserGroupIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import type { SidebarConfig, SidebarItem } from "@/types/sidebar.types";

export type UserType = "Company" | "ProjectOwner" | "Admin";

export const getSidebarConfig = (userType: UserType): SidebarConfig => {
  const commonAccountItems: SidebarItem[] = [
    {
      title: "User Profile",
      url: "/profile",
      // @ts-expect-error
      icon: User02Icon,
    },
    {
      title: "Notifications",
      url: "/notifications",
      // @ts-expect-error
      icon: Notification01Icon,
      badge: 3,
    },
    {
      title: "Support",
      url: "/support",
      // @ts-expect-error
      icon: CustomerService01Icon,
    },
  ];

  const configs: Record<UserType, SidebarConfig> = {
    Company: {
      topItems: [
        {
          title: "Dashboard",
          url: "/dashboard",
          // @ts-expect-error
          icon: DashboardSquareAddIcon,
        },
        {
          title: "Marketplace",
          url: "/marketplace",
          // @ts-expect-error
          icon: DiscoverCircleIcon,
        },
        {
          title: "Compliance",
          url: "/compliance",
          // @ts-expect-error
          icon: CheckmarkCircle03Icon,
        },
      ],
      sections: [
        {
          title: "INVESTMENTS",
          items: [
            {
              title: "My Carbon Credits",
              url: "/carbon-credits",
              // @ts-expect-error
              icon: OrganicFoodIcon,
            },
            {
              title: "Impact Analytics",
              url: "/analytics",
              // @ts-expect-error
              icon: CalculateIcon,
            },
          ],
        },
        {
          title: "ACCOUNT PAGES",
          items: commonAccountItems,
        },
      ],
    },
    ProjectOwner: {
      topItems: [
        {
          title: "Dashboard",
          url: "/dashboard",
          // @ts-expect-error
          icon: DashboardSquareAddIcon,
        },
        {
          title: "Register Project",
          url: "/new-project",
          // @ts-expect-error
          icon: PropertyAddIcon,
        },
        {
          title: "Compliance",
          url: "/compliance",
          // @ts-expect-error
          icon: CheckmarkCircle03Icon,
        },
      ],
      sections: [
        {
          title: "MY PROJECTS",
          items: [
            {
              title: "Project Profiles",
              url: "/project-profile",
              // @ts-expect-error
              icon: ViewIcon,
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
          items: commonAccountItems,
        },
      ],
    },
    Admin: {
      topItems: [
        {
          title: "Dashboard",
          url: "/dashboard",
          // @ts-expect-error
          icon: DashboardSquareAddIcon,
        },
        {
          title: "Compliance",
          url: "/compliance",
          // @ts-expect-error
          icon: CheckmarkCircle03Icon,
        },
      ],
      sections: [
        {
          title: "MANAGEMENT",
          items: [
            {
              title: "Assigned Businesses",
              url: "/assigned-businesses",
              // @ts-expect-error
              icon: UserGroupIcon,
            },
            {
              title: "Site Visits",
              url: "/site-visits",
              // @ts-expect-error
              icon: Calendar03Icon,
            },
            {
              title: "Data Collection",
              url: "/data-collection",
              // @ts-expect-error
              icon: CalculateIcon,
            },
          ],
        },
        {
          title: "ACCOUNT PAGES",
          items: commonAccountItems,
        },
      ],
    },
  };

  return configs[userType] || configs.ProjectOwner;
};
