import {
  AnalyticsUpIcon,
  CalculateIcon,
  CheckListIcon,
  CheckmarkCircle03Icon,
  CustomerService01Icon,
  DashboardSquareAddIcon,
  DiscoverCircleIcon,
  LicenseIcon,
  MoneyReceiveIcon,
  Notification01Icon,
  OrganicFoodIcon,
  PropertyAddIcon,
  User02Icon,
  UserGroupIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import type { SidebarConfig, SidebarItem } from "@/types/sidebar.types";
import type { TRole } from "@/types/user.types";

export const getSidebarConfig = (role: TRole): SidebarConfig => {
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

  const configs: Record<TRole, SidebarConfig> = {
    super_admin: {
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
          title: "OVERSIGHT",
          items: [
            {
              title: "User Management",
              url: "/user-management",
              // @ts-expect-error
              icon: UserGroupIcon,
            },
            {
              title: "Projects",
              url: "/projects",
              // @ts-expect-error
              icon: ViewIcon,
            },
            {
              title: "Financial Control",
              url: "/financials",
              // @ts-expect-error
              icon: MoneyReceiveIcon,
            },
          ],
        },
        {
          title: "ACCOUNT PAGES",
          items: commonAccountItems,
        },
      ],
    },
    org_admin: {
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
          title: "Institutional Impact",
          url: "/compliance",
          // @ts-expect-error
          icon: AnalyticsUpIcon,
        },
      ],
      sections: [
        {
          title: "PORTFOLIO",
          items: [
            {
              title: "Asset Registry",
              url: "/portfolio",
              // @ts-expect-error
              icon: OrganicFoodIcon,
            },
            {
              title: "Acquisitions",
              url: "/marketplace",
              // @ts-expect-error
              icon: MoneyReceiveIcon,
            },
          ],
        },
        {
          title: "ORGANIZATION",
          items: [
            {
              title: "Team Members",
              url: "/user-management",
              // @ts-expect-error
              icon: UserGroupIcon,
            },
            {
              title: "Contracts & Payouts",
              url: "/financials",
              // @ts-expect-error
              icon: LicenseIcon,
            },
          ],
        },
        {
          title: "ACCOUNT PAGES",
          items: commonAccountItems,
        },
      ],
    },
    sustainability_manager: {
      topItems: [
        {
          title: "Dashboard",
          url: "/dashboard",
          // @ts-expect-error
          icon: DashboardSquareAddIcon,
        },
        {
          title: "Institutional Impact",
          url: "/compliance",
          // @ts-expect-error
          icon: AnalyticsUpIcon,
        },
      ],
      sections: [
        {
          title: "PORTFOLIO",
          items: [
            {
              title: "Asset Registry",
              url: "/portfolio",
              // @ts-expect-error
              icon: OrganicFoodIcon,
            },
          ],
        },
        {
          title: "COMPLIANCE",
          items: [
            {
              title: "ESG Reports",
              url: "/compliance",
              // @ts-expect-error
              icon: CheckmarkCircle03Icon,
            },
          ],
        },
        {
          title: "ACCOUNT PAGES",
          items: commonAccountItems,
        },
      ],
    },
    org_auditor: {
      topItems: [
        {
          title: "Dashboard",
          url: "/dashboard",
          // @ts-expect-error
          icon: DashboardSquareAddIcon,
        },
      ],
      sections: [
        {
          title: "AUDIT LEDGER",
          items: [
            {
              title: "Asset Verification",
              url: "/portfolio",
              // @ts-expect-error
              icon: CheckmarkCircle03Icon,
            },
            {
              title: "Institutional Reports",
              url: "/compliance",
              // @ts-expect-error
              icon: CheckmarkCircle03Icon,
            },
            {
              title: "Financial Audit",
              url: "/financials",
              // @ts-expect-error
              icon: MoneyReceiveIcon,
            },
          ],
        },
        {
          title: "ACCOUNT PAGES",
          items: commonAccountItems,
        },
      ],
    },
    financial_admin: {
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
    mrv_admin: {
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
          title: "OVERSIGHT",
          items: [
            {
              title: "Projects",
              url: "/projects",
              // @ts-expect-error
              icon: ViewIcon,
            },
            {
              title: "Project Vetting",
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
    project_manager: {
      topItems: [
        {
          title: "Dashboard",
          url: "/dashboard",
          // @ts-expect-error
          icon: DashboardSquareAddIcon,
        },
        {
          title: "User Management",
          url: "/user-management",
          // @ts-expect-error
          icon: UserGroupIcon,
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
          title: "PROJECT OWNERS",
          items: [
            {
              title: "My Project Owners",
              url: "/project-owners",
              // @ts-expect-error
              icon: UserGroupIcon,
            },
            {
              title: "Onboard Owner",
              url: "/project-owners/register",
              // @ts-expect-error
              icon: PropertyAddIcon,
            },
          ],
        },
        {
          title: "OVERSIGHT",
          items: [
            {
              title: "Projects",
              url: "/projects",
              // @ts-expect-error
              icon: ViewIcon,
            },
            {
              title: "Project Vetting",
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
    project_owner: {
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
              title: "Projects",
              url: "/projects",
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
  };

  return configs[role] || configs.project_owner;
};
