import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Vibe Talk - English Practice",
  description:
    "ฝึกสนทนาภาษาอังกฤษกับ AI Agent ในสถานการณ์จำลอง พร้อมตรวจแกรมม่า และติดตามพัฒนาการ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vibe Talk",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFB5C2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen pb-20 safe-area-bottom safe-area-top">
        <main className="max-w-lg mx-auto px-4 pt-4 pb-6">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
