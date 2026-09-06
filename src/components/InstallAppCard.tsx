"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, Smartphone } from "lucide-react";
import { usePwaInstallContext } from "@/hooks/usePwaInstall";
import { detectInAppBrowser } from "@/lib/browserDetect";

export default function InstallAppCard() {
  const { canInstall, isStandalone, install } = usePwaInstallContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Platform detection must run client-side (navigator is not available on SSR)
  const info = mounted ? detectInAppBrowser() : null;
  const isIOS = !!info?.isIOS;
  const isInApp = !!info?.isInApp;

  return (
    <div className="bg-gradient-card rounded-2xl border border-pastel-border p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-pastel-purple-light/50 flex items-center justify-center">
          <Smartphone size={18} className="text-pastel-pink-dark" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-pastel-text">
            ติดตั้งแอป Vibe Talk
          </h3>
          <p className="text-xs text-pastel-text-light">
            เพิ่มลงหน้าจอหลัก เปิดใช้ได้เร็วขึ้นเหมือนแอปจริง
          </p>
        </div>
      </div>

      {!mounted ? null : isStandalone ? (
        /* ── Already installed ── */
        <div className="flex items-center gap-2 rounded-xl bg-pastel-green-light/60 border border-pastel-green/30 px-4 py-3 text-sm font-medium text-pastel-green">
          <CheckCircle2 size={17} className="flex-shrink-0" />
          Vibe Talk ถูกติดตั้งบนเครื่องนี้แล้ว
        </div>
      ) : canInstall ? (
        /* ── Install button (logo + text) ── */
        <button
          onClick={() => install()}
          className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-lg shadow-pastel-pink/30 hover:bg-gradient-primary-dark hover:scale-[1.02] active:scale-95 transition-all duration-200"
        >
          {/* Logo ใช้แบบเดียวกับหน้าแรก */}
          <div className="w-6 h-6 rounded-xl overflow-hidden animate-logo-blink flex items-center justify-center">
            <img
              src="/icons/vb-logo-192.png"
              alt="Vibe Talk logo"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          ติดตั้งเลย
          <Download size={16} />
        </button>
      ) : isIOS ? (
        /* ── iOS Safari: no beforeinstallprompt, guide to Add to Home Screen ── */
        <div className="space-y-2 rounded-xl border border-pastel-border bg-pastel-cream/60 px-4 py-3">
          <p className="text-xs font-medium text-pastel-text">
            {isInApp
              ? "เปิดใน Safari ก่อน แล้วเพิ่มลงหน้าจอหลัก:"
              : "เพิ่ม Vibe Talk ลงหน้าจอหลัก:"}
          </p>
          <ol className="space-y-2 text-xs text-pastel-text-light leading-relaxed">
            <li className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-pastel-purple-light/60 text-pastel-purple-dark flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              แตะปุ่ม Share (สี่เหลี่ยมมีลูกศรขึ้น) ที่แถบด้านล่างของ Safari
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-pastel-pink-light/60 text-pastel-pink-dark flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              เลือก “Add to Home Screen” หรือ “เพิ่มที่หน้าจอโฮม”
            </li>
          </ol>
        </div>
      ) : (
        /* ── Browser without an install prompt yet ── */
        <p className="text-xs text-pastel-text-light leading-relaxed">
          เปิดเว็บนี้ผ่าน Chrome หรือ Edge บนคอมพิวเตอร์ / Android แล้วเลือก
          “ติดตั้งแอป” จากเมนู ⋮ ของเบราว์เซอร์ หรือกดไอคอนติดตั้งที่แถบที่อยู่
        </p>
      )}
    </div>
  );
}
