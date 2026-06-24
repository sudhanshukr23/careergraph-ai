import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerGraph AI — Stop Guessing. Start Optimizing Your Career.",
  description: "AI-powered Career Intelligence Platform. Get your Interview Probability Score (IPS) and optimize your career using real hiring outcomes. Built for STEM students and junior software engineers.",
  keywords: ["CareerGraph", "resume analysis", "interview probability", "job search", "AI career", "IPS score", "career intelligence"],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "CareerGraph AI — Career Intelligence Platform",
    description: "Get your Interview Probability Score and optimize your career using real hiring outcomes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}