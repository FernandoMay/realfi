import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";
import { NotificationProvider } from "@/components/NotificationSystem";
import { PWAInstaller } from "@/components/PWAInstaller";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RealFi Community Trust Hub - Privacy-Preserving Finance",
  description: "Building the future of community finance with privacy-preserving identity, secure onboarding, and AI-powered coordination tools. Powered by Human Passport, Nillion, and GoodDollar.",
  keywords: ["RealFi", "DeFi", "Human Passport", "Nillion", "GoodDollar", "Privacy", "Community Finance", "UBI", "AI", "Governance"],
  authors: [{ name: "RealFi Hack Team" }],
  openGraph: {
    title: "RealFi Community Trust Hub",
    description: "Privacy-preserving financial ecosystem for communities worldwide",
    url: "https://realfi-hack.vercel.app",
    siteName: "RealFi Hub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RealFi Community Trust Hub",
    description: "Privacy-preserving financial ecosystem for communities",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RealFi Hub",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ErrorBoundary>
          <NotificationProvider />
          {children}
          <Toaster />
          <PWAInstaller />
        </ErrorBoundary>
      </body>
    </html>
  );
}
