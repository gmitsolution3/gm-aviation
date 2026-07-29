import { DashboardMenu } from "@/utils";
import {
  CircleUser,
  LayoutDashboard,
  List,
  Settings,
  UserRoundSearch,
  BookCheck,
  BookA
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
  {
    title: "Course",
    url: dashboardMenu.defineUrl("/courses"),
    icon: BookCheck,
  },
  {
    title: "Admission",
    url: dashboardMenu.defineUrl("/admissions"),
    icon: BookA,
  },
  {
    title: "Enrollments",
    url: dashboardMenu.defineUrl("/enrollments"),
    icon: BookA,
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
