import type { Metadata, Viewport } from "next";
import "./globals.css";
import PhoneFrame from "@/components/PhoneFrame";

export const metadata: Metadata = {
  title: "Vibe Talk - English Practice",
  description:
    "ฝึกสนทนาภาษาอังกฤษกับ AI Agent ในสถานการณ์จำลอง พร้อมตรวจแกรมม่า และติดตามพัฒนาการ",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/vb-logo-192.png",
    apple: "/icons/vb-logo-192.png",
  },
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
  themeColor: "#B388FF",
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
        <link rel="apple-touch-icon" href="/icons/vb-logo-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className="min-h-screen safe-area-bottom safe-area-top"
        style={{
          background:
            "linear-gradient(170deg, #F5F0FF 0%, #EDE4FF 40%, #F0EAFA 100%)",
        }}
      >
        <PhoneFrame>{children}</PhoneFrame>
      </body>
    </html>
  );
}
