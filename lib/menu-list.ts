import {
  Briefcase,
  BookOpen,
  User,
  UserPlus,
  PlusCircle,
  LayoutGrid,
  Bell,
  LucideIcon
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Navigation",
      menus: [
        {
          href: "/dashboard/jobs",
          label: "Remote Jobs",
          icon: Briefcase
        },
        {
          href: "/dashboard/blog",
          label: "Blog",
          icon: BookOpen
        },
        {
          href: "/dashboard/portfolio",
          label: "Portfolio",
          icon: User
        },
        {
          href: "/dashboard/alerts",
          label: "Job Alerts",
          icon: Bell
        },
        {
          href: "/dashboard/join",
          label: "Join",
          icon: UserPlus
        },
        {
          href: "/dashboard/hire",
          label: "Post a Job",
          icon: PlusCircle
        }
      ]
    }
  ];
}
