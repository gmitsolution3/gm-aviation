// app/unauthorized/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Home, Shield, ShieldAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 relative overflow-hidden">
      {/* Watermark Logo - Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <div className="relative w-[600px] h-[600px] opacity-[0.03] dark:opacity-[0.05]">
          <Image
            src="/images/logo.png"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-800/20 pointer-events-none" />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">

        {/* Icon with Animation */}
        {/* <div className="flex justify-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-destructive/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <ShieldAlert className="h-12 w-12 text-destructive" />
            </div>
          </div>
        </div> */}

        {/* Error Code */}
        <div className="space-y-2">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-destructive to-destructive/60 bg-clip-text text-transparent">
            401
          </h1>
          <h2 className="text-2xl font-bold text-foreground">
            Unauthorized Access
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            You don't have permission to access this page
          </p>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="bg-muted/50 rounded-lg p-4 border border-border/50 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground text-sm">Access Restricted</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This area requires specific permissions to view.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-destructive/5 rounded-lg p-4 border border-destructive/20 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-destructive text-sm">Need Assistance?</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Contact support or try logging in with a different account.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="gap-2 min-w-[140px] backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          <Link href="/">
            <Button className="gap-2 min-w-[140px]">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>

          <Link href="/login">
            <Button variant="secondary" className="gap-2 min-w-[140px]">
              <Shield className="h-4 w-4" />
              Sign In
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please contact your system administrator
          </p>
        </div>
      </div>
    </div>
  );
}