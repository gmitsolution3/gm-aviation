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
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
      const userName = certificate.enrollment?.user?.name || "Student";
      const courseTitle = certificate.enrollment?.course?.title || "Course";
      const issueDate = formatDate(certificate.issuedAt || certificate.createdAt);

      // Create a hidden container for the certificate
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "900px";
      container.style.padding = "50px";
      container.style.background = "#f8f9fa";
      container.style.fontFamily = "'Georgia', 'Times New Roman', serif";
      container.style.borderRadius = "24px";
      container.style.boxShadow = "0 20px 60px rgba(0,0,0,0.15)";

      // Certificate inner content
      container.innerHTML = `
        <div style="
          background: white;
          border: 6px solid #d4af37;
          border-radius: 20px;
          padding: 50px 40px;
          box-shadow: inset 0 0 0 2px #f5e6c6;
          position: relative;
          overflow: hidden;
        ">
          <!-- Decorative corner elements -->
          <div style="position: absolute; top: 20px; left: 20px; width: 60px; height: 60px; border-top: 4px solid #d4af37; border-left: 4px solid #d4af37; border-radius: 8px 0 0 0;"></div>
          <div style="position: absolute; top: 20px; right: 20px; width: 60px; height: 60px; border-top: 4px solid #d4af37; border-right: 4px solid #d4af37; border-radius: 0 8px 0 0;"></div>
          <div style="position: absolute; bottom: 20px; left: 20px; width: 60px; height: 60px; border-bottom: 4px solid #d4af37; border-left: 4px solid #d4af37; border-radius: 0 0 0 8px;"></div>
          <div style="position: absolute; bottom: 20px; right: 20px; width: 60px; height: 60px; border-bottom: 4px solid #d4af37; border-right: 4px solid #d4af37; border-radius: 0 0 8px 0;"></div>

          <!-- Background watermark -->
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 200px; opacity: 0.04; color: #d4af37; font-weight: bold; letter-spacing: 20px; user-select: none;">GM</div>

          <!-- Logo / Emblem -->
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; background: #d4af37; border-radius: 50%; width: 70px; height: 70px; line-height: 70px; font-size: 36px; color: white; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);">🎓</div>
          </div>

          <h1 style="
            font-size: 42px;
            color: #1a2a3a;
            text-align: center;
            margin: 10px 0 5px;
            letter-spacing: 4px;
            font-weight: 700;
            text-transform: uppercase;
            font-family: 'Georgia', serif;
          ">Certificate of Completion</h1>

          <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin: 15px 0 10px;">
            <div style="flex: 1; height: 2px; background: linear-gradient(to right, transparent, #d4af37, transparent);"></div>
            <div style="color: #d4af37; font-size: 24px;">✦</div>
            <div style="flex: 1; height: 2px; background: linear-gradient(to right, transparent, #d4af37, transparent);"></div>
          </div>

          <p style="
            font-size: 20px;
            color: #5a6a7a;
            text-align: center;
            margin: 10px 0 5px;
            letter-spacing: 2px;
          ">This certifies that</p>

          <h2 style="
            font-size: 40px;
            color: #1a2a3a;
            text-align: center;
            margin: 10px 0;
            font-weight: 600;
            font-family: 'Georgia', serif;
            border-bottom: 2px dashed #d4af37;
            display: inline-block;
            padding: 0 30px 8px;
          ">${userName}</h2>

          <p style="
            font-size: 20px;
            color: #5a6a7a;
            text-align: center;
            margin: 15px 0 5px;
            letter-spacing: 1px;
          ">has successfully completed the course</p>

          <h3 style="
            font-size: 32px;
            color: #2c3e6b;
            text-align: center;
            margin: 8px 0 15px;
            font-weight: 600;
            font-family: 'Georgia', serif;
          ">${courseTitle}</h3>

          <div style="display: flex; justify-content: center; gap: 30px; margin: 20px 0; font-size: 16px; color: #7a8a9a;">
            <span>📅 Issued on <strong>${issueDate}</strong></span>
            <span>🔖 Certificate ID: <strong>${certificate._id.slice(-8)}</strong></span>
          </div>

          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eaeef2;
          ">
            <div style="text-align: left;">
              <p style="font-size: 14px; color: #9a9a9a; margin: 0;">Issued by</p>
              <p style="font-size: 18px; font-weight: 600; color: #1a2a3a; margin: 2px 0;">GM Aviation Academy</p>
            </div>
            <div style="text-align: right;">
              <p style="font-size: 14px; color: #9a9a9a; margin: 0;">Verified</p>
              <div style="display: flex; align-items: center; gap: 8px; justify-content: flex-end;">
                <span style="font-size: 24px;">✅</span>
                <span style="font-size: 14px; font-weight: 500; color: #2c3e6b;">Official Seal</span>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(container);

      // Use html2canvas to capture the element
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#f8f9fa",
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
  const courseTitle = certificate.enrollment?.course?.title || "Course";
  const issuedAt = certificate.issuedAt || certificate.createdAt;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow flex flex-col border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{courseTitle}</CardTitle>
          <Badge variant="default" className="shrink-0 bg-primary/10 text-primary">
            <Award className="h-3 w-3 mr-1" />
            Certificate
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Issued: {formatDate(issuedAt)}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Click "Generate & Download" to get your certificate.
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="text-xs text-muted-foreground">
          ID: {certificate._id.slice(-6)}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="text-primary border-primary/30 hover:bg-primary/10"
          onClick={() => onGenerate(certificate)}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-1" />
              Generate & Download
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}