"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useFetch } from "@/hooks/swr/useFetch";
import { useSession } from "@/lib/auth-context";
import { IAdminDashboard } from "@/types";
import {
  BookOpen,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  BookCheck,
  BookX,
  School,
  UserCheck,
  UserX,
  UserMinus,
  Loader2,
  ArrowRight,
  LayoutDashboard,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IAdminDashboard;
}

export default function AdminDashboardPage() {
  const { session } = useSession();
  const user = session?.user;

  const { data, isLoading, error } = useFetch<ApiResponse>(
    "/dashboard/admin/overview"
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Failed to load dashboard</h3>
            <p className="text-muted-foreground text-sm mt-2">
              Please try refreshing the page.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const dashboard = data?.data;
  if (!dashboard) return null;

  const { courses, admissions, enrollments } = dashboard;

  // Calculate progress percentages
  const admissionsApprovalRate = admissions.total > 0
    ? Math.round((admissions.approved / admissions.total) * 100)
    : 0;

  const enrollmentsCompletionRate = enrollments.total > 0
    ? Math.round((enrollments.completed / enrollments.total) * 100)
    : 0;

  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return "bg-red-500";
    if (percentage < 60) return "bg-yellow-500";
    if (percentage < 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStatusText = (percentage: number) => {
    if (percentage < 30) return "Low";
    if (percentage < 60) return "Moderate";
    if (percentage < 80) return "Good";
    return "Excellent";
  };

  // Quick links configuration
  const quickLinks = [
    {
      title: "Manage Courses",
      description: "Create and edit courses",
      icon: BookOpen,
      href: "/admin/courses",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Admissions",
      description: "Review applications",
      icon: FileText,
      href: "/admin/admissions",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Enrollments",
      description: "Track student enrollments",
      icon: Users,
      href: "/admin/enrollments",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Users",
      description: "Manage platform users",
      icon: UserCheck,
      href: "/admin/users",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Categories",
      description: "Organize course categories",
      icon: School,
      href: "/admin/categories",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="container mx-auto px-5 lg:px-0 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, <span className="font-medium text-foreground">{user?.name || "Admin"}</span>! Here's an overview of your platform.
        </p>
      </div>

      {/* Stats Cards - 3 cards in a row */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {/* Courses Card */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Courses
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{courses.total}</div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="flex flex-col items-center p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
                <BookCheck className="h-4 w-4 text-green-500" />
                <span className="text-xs text-muted-foreground mt-1">Published</span>
                <span className="font-semibold">{courses.published}</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-red-50 dark:bg-red-950/20">
                <BookX className="h-4 w-4 text-red-500" />
                <span className="text-xs text-muted-foreground mt-1">Unpublished</span>
                <span className="font-semibold">{courses.unpublished}</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <School className="h-4 w-4 text-purple-500" />
                <span className="text-xs text-muted-foreground mt-1">Open</span>
                <span className="font-semibold">{courses.admissionOpen}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admissions Card */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Admissions
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/10">
              <FileText className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{admissions.total}</div>
            <div className="grid grid-cols-4 gap-1 mt-4">
              <div className="flex flex-col items-center p-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                <Clock className="h-3.5 w-3.5 text-yellow-500" />
                <span className="text-[10px] text-muted-foreground mt-1">Submitted</span>
                <span className="font-semibold text-sm">{admissions.submitted}</span>
              </div>
              <div className="flex flex-col items-center p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <AlertCircle className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-[10px] text-muted-foreground mt-1">Review</span>
                <span className="font-semibold text-sm">{admissions.underReview}</span>
              </div>
              <div className="flex flex-col items-center p-1.5 rounded-lg bg-green-50 dark:bg-green-950/20">
                <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                <span className="text-[10px] text-muted-foreground mt-1">Approved</span>
                <span className="font-semibold text-sm">{admissions.approved}</span>
              </div>
              <div className="flex flex-col items-center p-1.5 rounded-lg bg-red-50 dark:bg-red-950/20">
                <XCircle className="h-3.5 w-3.5 text-red-500" />
                <span className="text-[10px] text-muted-foreground mt-1">Rejected</span>
                <span className="font-semibold text-sm">{admissions.rejected}</span>
              </div>
            </div>
            {admissions.total > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Approval Rate</span>
                  <span className="font-medium">{admissionsApprovalRate}%</span>
                </div>
                <Progress
                  value={admissionsApprovalRate}
                  className="h-2"
                  indicatorClassName={getProgressColor(admissionsApprovalRate)}
                />
                <div className="flex justify-end mt-1">
                  <Badge variant="outline" className="text-xs">
                    {getStatusText(admissionsApprovalRate)}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enrollments Card */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Enrollments
            </CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10">
              <Users className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{enrollments.total}</div>
            <div className="grid grid-cols-4 gap-1 mt-4">
              <div className="flex flex-col items-center p-1.5 rounded-lg bg-green-50 dark:bg-green-950/20">
                <UserCheck className="h-3.5 w-3.5 text-green-500" />
                <span className="text-[10px] text-muted-foreground mt-1">Active</span>
                <span className="font-semibold text-sm">{enrollments.active}</span>
              </div>
              <div className="flex flex-col items-center p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-[10px] text-muted-foreground mt-1">Completed</span>
                <span className="font-semibold text-sm">{enrollments.completed}</span>
              </div>
              <div className="flex flex-col items-center p-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                <UserMinus className="h-3.5 w-3.5 text-yellow-500" />
                <span className="text-[10px] text-muted-foreground mt-1">Dropped</span>
                <span className="font-semibold text-sm">{enrollments.dropped}</span>
              </div>
              <div className="flex flex-col items-center p-1.5 rounded-lg bg-red-50 dark:bg-red-950/20">
                <UserX className="h-3.5 w-3.5 text-red-500" />
                <span className="text-[10px] text-muted-foreground mt-1">Suspended</span>
                <span className="font-semibold text-sm">{enrollments.suspended}</span>
              </div>
            </div>
            {enrollments.total > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Completion Rate</span>
                  <span className="font-medium">{enrollmentsCompletionRate}%</span>
                </div>
                <Progress
                  value={enrollmentsCompletionRate}
                  className="h-2"
                  indicatorClassName={getProgressColor(enrollmentsCompletionRate)}
                />
                <div className="flex justify-end mt-1">
                  <Badge variant="outline" className="text-xs">
                    {getStatusText(enrollmentsCompletionRate)}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Stacked Vertically */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Quick Actions
        </h2>
        <div className="flex flex-col gap-3 max-w-2xl">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/30 transition-all group hover:shadow-md w-full"
            >
              <div className={`p-2 rounded-lg ${link.bgColor} flex-shrink-0`}>
                <link.icon className={`h-5 w-5 ${link.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium group-hover:text-primary transition-colors">
                  {link.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {link.description}
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}