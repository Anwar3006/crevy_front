export type SidebarItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  badge?: string | number;
};

export type SidebarSection = {
  title?: string; // Optional for ungrouped items
  items: SidebarItem[];
};

export type SidebarConfig = {
  topItems: SidebarItem[];
  sections: SidebarSection[];
};
