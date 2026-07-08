import type { Metadata, Viewport } from "next";
import "./globals.css";
import PhoneFrame from "@/components/PhoneFrame";

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
  themeColor: "#D4A574",
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
        <link rel="apple-touch-icon" href="/icons/vt-icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen safe-area-bottom safe-area-top bg-pastel-cream">
        <PhoneFrame>{children}</PhoneFrame>
      </body>
    </html>
  );
}
