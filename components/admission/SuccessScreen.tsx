"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function SuccessScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="flex flex-col items-center pt-8 px-8 pb-0">
          <div className="inline-block mb-4">
            <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Application Submitted!
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground text-center">
            Thank you for submitting your application. We'll review it and get back to you soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-6">
          <Button
            size="lg"
            className="w-full font-medium"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}