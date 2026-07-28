import type { LucideIcon } from "lucide-react"
import { Users, FileText, GraduationCap, Wallet } from "lucide-react"

export type Kpi = {
  label: string
  value: number
  prefix?: string
  suffix?: string
  delta: number
  trend: "up" | "down"
  icon: LucideIcon
  caption: string
}

export const KPIS: Kpi[] = [
  {
    label: "Total Students",
    value: 1284,
    delta: 12.4,
    trend: "up",
    icon: Users,
    caption: "vs last term",
  },
  {
    label: "Open Applications",
    value: 342,
    delta: 8.1,
    trend: "up",
    icon: FileText,
    caption: "vs last term",
  },
  {
    label: "Active Courses",
    value: 6,
    delta: 0,
    trend: "up",
    icon: GraduationCap,
    caption: "across 4 categories",
  },
  {
    label: "Revenue (YTD)",
    value: 4.82,
    prefix: "$",
    suffix: "M",
    delta: 5.3,
    trend: "down",
    icon: Wallet,
    caption: "vs last year",
  },
]

// Enrollment vs applications over the year
export type EnrollmentPoint = {
  month: string
  enrolled: number
  applications: number
}

export const ENROLLMENT_TREND: EnrollmentPoint[] = [
  { month: "Jan", enrolled: 62, applications: 140 },
  { month: "Feb", enrolled: 71, applications: 152 },
  { month: "Mar", enrolled: 98, applications: 205 },
  { month: "Apr", enrolled: 110, applications: 231 },
  { month: "May", enrolled: 96, applications: 210 },
  { month: "Jun", enrolled: 124, applications: 268 },
  { month: "Jul", enrolled: 138, applications: 290 },
  { month: "Aug", enrolled: 129, applications: 275 },
  { month: "Sep", enrolled: 156, applications: 322 },
  { month: "Oct", enrolled: 142, applications: 301 },
  { month: "Nov", enrolled: 118, applications: 256 },
  { month: "Dec", enrolled: 104, applications: 228 },
]

// Applications per course
export type CourseApplications = {
  course: string
  applications: number
}

export const APPLICATIONS_BY_COURSE: CourseApplications[] = [
  { course: "Commercial Pilot", applications: 96 },
  { course: "Cabin Crew", applications: 78 },
  { course: "Maintenance Eng.", applications: 54 },
  { course: "Air Traffic Ctrl", applications: 41 },
  { course: "Aviation Mgmt", applications: 47 },
  { course: "Private Pilot", applications: 26 },
]

// Revenue share by category (for donut)
export type CategoryShare = {
  name: string
  value: number
  color: string
}

export const REVENUE_BY_CATEGORY: CategoryShare[] = [
  { name: "Flight Training", value: 52, color: "#17213a" },
  { name: "Engineering", value: 21, color: "#f59e0b" },
  { name: "Operations", value: 15, color: "#3b82f6" },
  { name: "Business", value: 12, color: "#94a3b8" },
]

// Recent applications table
export type ApplicationStatus = "Approved" | "Pending" | "Interview" | "Rejected"

export type Application = {
  id: string
  name: string
  initials: string
  course: string
  date: string
  status: ApplicationStatus
}

export const RECENT_APPLICATIONS: Application[] = [
  { id: "AP-2043", name: "Daniel Okafor", initials: "DO", course: "Commercial Pilot License", date: "Jul 18, 2026", status: "Approved" },
  { id: "AP-2042", name: "Priya Nair", initials: "PN", course: "Cabin Crew & Hospitality", date: "Jul 18, 2026", status: "Interview" },
  { id: "AP-2041", name: "Lucas Meyer", initials: "LM", course: "Aircraft Maintenance Eng.", date: "Jul 17, 2026", status: "Pending" },
  { id: "AP-2040", name: "Sofia Álvarez", initials: "SA", course: "Air Traffic Control", date: "Jul 17, 2026", status: "Approved" },
  { id: "AP-2039", name: "James Whitfield", initials: "JW", course: "Aviation Management", date: "Jul 16, 2026", status: "Rejected" },
  { id: "AP-2038", name: "Aisha Rahman", initials: "AR", course: "Private Pilot License", date: "Jul 16, 2026", status: "Pending" },
  { id: "AP-2037", name: "Kenji Tanaka", initials: "KT", course: "Commercial Pilot License", date: "Jul 15, 2026", status: "Interview" },
]

// Upcoming intakes
export type Intake = {
  course: string
  date: string
  seatsFilled: number
  seatsTotal: number
}

export const UPCOMING_INTAKES: Intake[] = [
  { course: "Commercial Pilot License", date: "Sep 2, 2026", seatsFilled: 21, seatsTotal: 24 },
  { course: "Cabin Crew & Hospitality", date: "Aug 12, 2026", seatsFilled: 24, seatsTotal: 30 },
  { course: "Air Traffic Control", date: "Oct 6, 2026", seatsFilled: 9, seatsTotal: 16 },
  { course: "Aviation Management", date: "Sep 9, 2026", seatsFilled: 28, seatsTotal: 35 },
]
