import { DashboardMenu } from "@/utils";
import {
  CircleUser,
  LayoutDashboard,
  List,
  Settings,
  UserRoundSearch,
} from "lucide-react";

const baseDashboardUrl = "/admin-dashboard";
const dashboardMenu = new DashboardMenu(baseDashboardUrl);

export const mainMenuItems = [
  {
    title: "Dashboard",
    url: dashboardMenu.defineUrl("/"),
    icon: LayoutDashboard,
  },
  {
    title: "Category",
    url: dashboardMenu.defineUrl("/categories"),
    icon: List,
  },
];

export const settingsItems = [
  {
    title: "Users",
    url: dashboardMenu.defineUrl("/users"),
    icon: UserRoundSearch,
  },
  {
    title: "Profile",
    url: dashboardMenu.defineUrl("/profile"),
    icon: CircleUser,
  },
  {
    title: "Settings",
    url: dashboardMenu.defineUrl("/settings"),
    icon: Settings,
  },
];
