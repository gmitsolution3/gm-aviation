import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

import { auth } from "@/lib/auth";
import AuthProvider from "@/lib/auth-provider";
import { headers } from "next/headers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "GM Aviation Academy | International Flight & Aviation Training",
  description:
    "GM Aviation Academy delivers world-class pilot training, cabin crew programs, and aviation engineering with international curriculum, modern simulators, and career support.",
  generator: "GM IT Solution",
  keywords: [
    "aviation academy",
    "pilot training",
    "flight school",
    "cabin crew training",
    "aviation engineering",
    "commercial pilot license",
  ],
  openGraph: {
    title: "GM Aviation Academy",
    description:
      "World-class pilot training and aviation programs with an international curriculum.",
    type: "website",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#17213a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="bg-background font-body antialiased">
        <TooltipProvider>
          <AuthProvider session={session}>
            {children}
            <Toaster />
          </AuthProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
