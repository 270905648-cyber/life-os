import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "个人中枢 - 人生操作系统",
    template: "%s | 个人中枢",
  },
  description: "专属个人人生操作系统，集全周期目标管理、八大生活维度服务、AI智能陪伴于一体。从根源解决内耗与焦虑，实现个人成长全维度闭环。",
  keywords: [
    "个人中枢",
    "人生操作系统",
    "目标管理",
    "习惯打卡",
    "AI助手",
    "自我成长",
    "时间管理",
    "生活管理",
  ],
  authors: [{ name: "Life OS Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "个人中枢",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "个人中枢",
    title: "个人中枢 - 人生操作系统",
    description: "专属个人人生操作系统，AI智能陪伴你的成长之路",
  },
  twitter: {
    card: "summary_large_image",
    title: "个人中枢 - 人生操作系统",
    description: "专属个人人生操作系统，AI智能陪伴你的成长之路",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
