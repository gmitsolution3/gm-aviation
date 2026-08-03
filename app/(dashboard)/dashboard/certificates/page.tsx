"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/swr/useFetch";
import { useSession } from "@/lib/auth-context";
import { ICertificate } from "@/types";
import { formatDate } from "@/utils";
import {
  Loader2,
  AlertCircle,
  XCircle,
  Download,
  Award,
  Calendar,
  FileText,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { motion } from 'motion/react';

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ICertificate[];
}

export default function CertificatesPage() {
  const { session } = useSession();
  const userId = session?.user?.id;
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useFetch<ApiResponse>("/certificates");

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">Please log in</h3>
        <p className="text-muted-foreground text-sm">
          You need to be logged in to view your certificates.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Failed to load certificates</h3>
            <p className="text-muted-foreground text-sm mt-2">
              Please try refreshing the page.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const certificates = data?.data || [];

  if (certificates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Award className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No certificates yet</h3>
        <p className="text-muted-foreground text-sm">
          You haven't been issued any certificates. Complete a course to earn one!
        </p>
        <Button asChild className="mt-4">
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    );
  }

  // Function to generate and download certificate PDF
  const generateCertificate = async (certificate: ICertificate) => {
    setGeneratingId(certificate._id);
    try {
      const userName = certificate?.user?.name || "Student";
      const courseTitle = certificate?.course?.title || "Course";
      const issueDate = formatDate(certificate.issuedAt || certificate.createdAt);
      const certId = certificate.certificateNumber || certificate._id.slice(-10).toUpperCase();
      // Optional course length, falls back gracefully if not present on the model
      const courseHours = (certificate as any)?.course?.durationHours;
      const instructorName = (certificate as any)?.course?.instructor?.name || "Course Director";

      // Create a hidden container sized like a widescreen certificate (Udemy-style ratio)
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "1122px";
      container.style.height = "793px";
      container.style.background = "#FAF7F0";
      container.style.fontFamily = "'Helvetica Neue', Arial, sans-serif";

      // Certificate inner content — navy / gold aviation theme, landscape layout
      container.innerHTML = `
        <div style="
          position: relative;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          background: #FAF7F0;
          padding: 28px;
          overflow: hidden;
        ">
          <!-- Outer border frame -->
          <div style="
            position: absolute;
            inset: 28px;
            border: 2px solid #C9A227;
            border-radius: 2px;
          "></div>
          <div style="
            position: absolute;
            inset: 36px;
            border: 1px solid #0B2545;
            opacity: 0.25;
          "></div>

          <!-- Faint compass-rose watermark, right side -->
          <svg width="420" height="420" viewBox="0 0 420 420" style="position: absolute; right: -60px; bottom: -60px; opacity: 0.05;">
            <circle cx="210" cy="210" r="190" fill="none" stroke="#0B2545" stroke-width="2"/>
            <circle cx="210" cy="210" r="140" fill="none" stroke="#0B2545" stroke-width="1"/>
            <path d="M210 20 L226 200 L210 210 L194 200 Z" fill="#0B2545"/>
            <path d="M210 400 L226 220 L210 210 L194 220 Z" fill="#0B2545"/>
            <path d="M20 210 L200 194 L210 210 L200 226 Z" fill="#0B2545"/>
            <path d="M400 210 L220 194 L210 210 L220 226 Z" fill="#0B2545"/>
          </svg>

          <!-- Header row: emblem + academy name (left), eyebrow (right) -->
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 46px 0;
          ">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="
                width: 46px; height: 46px; border-radius: 50%;
                background: #0B2545; display: flex; align-items: center;
                justify-content: center; flex-shrink: 0;
              ">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M2 16l8.5-2.5L12 2l1.5 11.5L22 16l-8.5 1-1.5 5-1.5-5L2 16z" fill="#C9A227"/>
                </svg>
              </div>
              <div>
                <div style="font-size: 15px; font-weight: 700; color: #0B2545; letter-spacing: 1px;">GM AVIATION ACADEMY</div>
                <div style="font-size: 10px; color: #5B6B79; letter-spacing: 2px; text-transform: uppercase;">Flight Training &amp; Ground School</div>
              </div>
            </div>
            <div style="font-size: 11px; color: #5B6B79; letter-spacing: 3px; text-transform: uppercase;">
              Est. Excellence in Aviation
            </div>
          </div>

          <!-- Main content -->
          <div style="position: relative; text-align: center; padding: 34px 90px 0;">
            <div style="font-size: 13px; letter-spacing: 6px; color: #C9A227; font-weight: 700; text-transform: uppercase;">
              Certificate of Completion
            </div>

            <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin: 18px 0 26px;">
              <div style="width: 70px; height: 1px; background: #C9A227;"></div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#C9A227"><path d="M12 2l2.5 7.5H22l-6 4.5 2.3 7.5-6.3-4.6-6.3 4.6L7.5 14 1.5 9.5H9z"/></svg>
              <div style="width: 70px; height: 1px; background: #C9A227;"></div>
            </div>

            <div style="font-size: 15px; color: #5B6B79; letter-spacing: 1px;">This is to certify that</div>

            <div style="
              font-family: Georgia, 'Times New Roman', serif;
              font-size: 46px;
              color: #0B2545;
              margin: 14px 0 6px;
              font-weight: 700;
            ">${userName}</div>

            <div style="width: 260px; height: 1px; background: #0B2545; opacity: 0.25; margin: 0 auto 22px;"></div>

            <div style="font-size: 15px; color: #5B6B79; letter-spacing: 1px; line-height: 1.6;">
              has successfully completed the course
            </div>
            <div style="
              font-family: Georgia, 'Times New Roman', serif;
              font-size: 26px;
              color: #1E5F8C;
              font-weight: 700;
              margin: 8px 0 4px;
            ">${courseTitle}</div>
            ${courseHours ? `<div style="font-size: 13px; color: #5B6B79; letter-spacing: 0.5px;">${courseHours} hours of instruction</div>` : ""}
          </div>

          <!-- Footer row: date + signature (left), seal (center), cert id + issuer (right) -->
          <div style="
            position: absolute;
            left: 70px;
            right: 70px;
            bottom: 66px;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
          ">
            <div style="text-align: center; width: 200px;">
              <div style="font-family: Georgia, serif; font-size: 16px; color: #0B2545; border-bottom: 1px solid #0B2545; padding-bottom: 6px;">${issueDate}</div>
              <div style="font-size: 10px; letter-spacing: 2px; color: #5B6B79; text-transform: uppercase; margin-top: 6px;">Date Issued</div>
            </div>

            <div style="text-align: center;">
              <div style="
                width: 84px; height: 84px; border-radius: 50%;
                background: radial-gradient(circle at 35% 30%, #d9b84a, #C9A227 55%, #a5821b 100%);
                display: flex; align-items: center; justify-content: center;
                box-shadow: 0 3px 10px rgba(0,0,0,0.18);
                border: 3px solid #0B2545;
              ">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M2 16l8.5-2.5L12 2l1.5 11.5L22 16l-8.5 1-1.5 5-1.5-5L2 16z" fill="#0B2545"/>
                </svg>
              </div>
              <div style="font-size: 9px; letter-spacing: 1.5px; color: #5B6B79; text-transform: uppercase; margin-top: 6px;">Official Seal</div>
            </div>

            <div style="text-align: center; width: 200px;">
              <div style="font-family: Georgia, serif; font-size: 16px; color: #0B2545; border-bottom: 1px solid #0B2545; padding-bottom: 6px;">${instructorName}</div>
              <div style="font-size: 10px; letter-spacing: 2px; color: #5B6B79; text-transform: uppercase; margin-top: 6px;">Course Director</div>
            </div>
          </div>

          <!-- Bottom strip: certificate id -->
          <div style="
            position: absolute;
            left: 70px; right: 70px; bottom: 40px;
            display: flex; justify-content: space-between;
            font-size: 10px; color: #5B6B79; letter-spacing: 1px;
          ">
            <span>Certificate ID: <strong style="color:#0B2545;">${certId}</strong></span>
            <span>Verify at gmaviationacademy.com/verify</span>
          </div>
        </div>
      `;
      document.body.appendChild(container);

      // Use html2canvas to capture the element
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#FAF7F0",
      });
      document.body.removeChild(container);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`certificate-${certificate._id}.pdf`);
    } catch (error) {
      console.error("Certificate generation failed:", error);
      alert("Failed to generate certificate. Please try again.");
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="container mx-auto px-5 lg:px-0 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Certificates</h1>
        <p className="text-muted-foreground mt-1">
          You have {certificates.length} certificate{certificates.length > 1 ? "s" : ""}.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((certificate) => (
          <CertificateCard
            key={certificate._id}
            certificate={certificate}
            onGenerate={generateCertificate}
            isGenerating={generatingId === certificate._id}
          />
        ))}
      </div>
    </div>
  );
}

// Certificate Card Component
function CertificateCard({
  certificate,
  onGenerate,
  isGenerating,
}: {
  certificate: ICertificate;
  onGenerate: (cert: ICertificate) => void;
  isGenerating: boolean;
}) {
  const courseTitle = certificate.course?.title || "Course";
  const userName = certificate.user?.name || "Student";
  const issuedAt = certificate.issuedAt || certificate.createdAt;
  const certNumber = certificate.certificateNumber || certificate._id.slice(-8);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-xl border border-primary/10 bg-white shadow-lg hover:shadow-xl transition-shadow"
    >
      {/* Decorative gradient top bar */}
      <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400" />

      {/* Header with icon and badge */}
      <div className="relative px-5 pt-5 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-400/20">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Certificate
              </p>
              <p className="text-sm font-medium text-amber-600">{certNumber}</p>
            </div>
          </div>
          <Badge className="border-0 bg-amber-50 text-amber-700 shadow-sm">
            <CheckCircle className="mr-1 h-3 w-3" /> Verified
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="space-y-3 px-5 pb-2 pt-0">
        <div>
          <h3 className="text-lg font-bold leading-tight text-brand-ink line-clamp-2">
            {courseTitle}
          </h3>
          <p className="text-sm text-muted-foreground">
            Awarded to <span className="font-medium text-brand-ink">{userName}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Issued: {formatDate(issuedAt)}</span>
        </div>

        {/* Optional: show a small seal/emblem */}
        <div className="flex items-center gap-1 text-xs text-amber-600/80">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span>Official document</span>
        </div>
      </CardContent>

      {/* Footer with download button */}
      <CardFooter className="flex items-center justify-between gap-2 border-t border-muted/30 bg-muted/5 px-5 py-3">
        <div className="text-xs text-muted-foreground">
          <FileText className="mr-1 inline h-3 w-3" />
          PDF
        </div>
        <Button
          size="sm"
          className="gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md hover:shadow-lg hover:from-amber-600 hover:to-yellow-600 transition-all"
          onClick={() => onGenerate(certificate)}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download
            </>
          )}
        </Button>
      </CardFooter>
    </motion.div>
  );
}