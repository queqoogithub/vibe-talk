"use client";

import { useState, useEffect } from "react";
import { detectInAppBrowser, openInExternalBrowser } from "@/lib/browserDetect";
import { ExternalLink, X, CheckCircle2, Copy } from "lucide-react";

export default function OpenInBrowserBanner() {
  const [show, setShow] = useState(false);
  const [browserName, setBrowserName] = useState<string | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const info = detectInAppBrowser();
    if (info.isInApp) {
      setBrowserName(info.name);
      setIsIOS(info.isIOS);
      setTimeout(() => setShow(true), 800);
    }
  }, []);

  const targetBrowser = isIOS ? "Safari" : "Chrome";

  const handleOpenBrowser = () => {
    const result = openInExternalBrowser();

    if (result.launched && result.method === "intent") {
      // Android: intent opened successfully
      return;
    }

    // iOS / fallback: URL copied to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[65] animate-slide-up safe-area-top">
      <div className="mx-auto max-w-[430px] px-4 pt-3">
        <div className="bg-gradient-to-r from-pastel-yellow-light/95 to-pastel-purple-light/90 backdrop-blur-md border border-pastel-yellow/40 rounded-2xl p-3.5 shadow-lg">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-primary/20 flex items-center justify-center mt-0.5">
              <ExternalLink size={16} className="text-pastel-pink-dark" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-pastel-text mb-0.5">
                เปิดใน {targetBrowser} เพื่อประสบการณ์ที่ดีกว่า
              </p>
              <p className="text-[11px] text-pastel-text-light leading-relaxed">
                {browserName
                  ? `คุณกำลังใช้เบราว์เซอร์ใน ${browserName} ซึ่งไม่รองรับการติดตั้งแอป`
                  : "เบราว์เซอร์นี้ไม่รองรับการติดตั้ง PWA"}
              </p>

              {/* Action buttons */}
              <div className="flex items-center gap-2 mt-2.5">
                <button
                  onClick={handleOpenBrowser}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-primary text-white text-xs font-medium shadow-sm hover:bg-gradient-primary-dark active:scale-95 transition-all"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 size={13} />
                      คัดลอกลิงก์แล้ว! วางใน {targetBrowser}
                    </>
                  ) : isIOS ? (
                    <>
                      <Copy size={13} />
                      คัดลอกลิงก์ ไปวางใน {targetBrowser}
                    </>
                  ) : (
                    <>
                      <ExternalLink size={13} />
                      เปิดใน {targetBrowser}
                    </>
                  )}
                </button>

                <button
                  onClick={handleDismiss}
                  className="p-1.5 rounded-lg text-pastel-text-light/50 hover:text-pastel-text hover:bg-white/50 transition-colors"
                  title="ปิด"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
