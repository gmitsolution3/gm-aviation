import { DashboardMenu } from "@/utils";
import {
  CircleUser,
  LayoutDashboard,
  Plane,
  Settings,
} from "lucide-react";

const baseDashboardUrl = "/dashboard";
const dashboardMenu = new DashboardMenu(baseDashboardUrl);

export const mainMenuItems = [
  {
    title: "Dashboard",
    url: dashboardMenu.defineUrl("/"),
    icon: LayoutDashboard,
  },
  {
    title: "Enrollments",
    url: dashboardMenu.defineUrl("/enrollments"),
    icon: Plane,
  },
  {
    title: "Certificates",
    url: dashboardMenu.defineUrl("/bookings"),
    icon: Plane,
  },
];

export const settingsItems = [
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
