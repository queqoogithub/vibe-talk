"use client";

import { useEffect, useMemo, useState } from "react";
import BottomNav from "./BottomNav";
import PwaInstallModal from "./PwaInstallModal";
import OpenInBrowserBanner from "./OpenInBrowserBanner";
import {
  usePwaInstall,
  PwaInstallContext,
  type PwaInstallContextValue,
} from "@/hooks/usePwaInstall";

export default function PhoneFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isStandalone, setIsStandalone] = useState(false);
  const pwa = usePwaInstall();
  const { showModal, install, dismiss } = pwa;

  const installCtx = useMemo<PwaInstallContextValue>(
    () => ({
      canInstall: pwa.canInstall,
      isStandalone: pwa.isStandalone,
      install: pwa.install,
    }),
    [pwa.canInstall, pwa.isStandalone, pwa.install]
  );

  useEffect(() => {
    const mq = window.matchMedia("(display-mode: standalone)");
    setIsStandalone(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsStandalone(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const inner = (
    <>
      <main
        className="flex-1 overflow-y-auto px-4 pt-3 min-h-0 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </main>
      <BottomNav />
    </>
  );

  return (
    <PwaInstallContext.Provider value={installCtx}>
      {/* PWA Install Modal */}
      {showModal && <PwaInstallModal onInstall={install} onDismiss={dismiss} />}

      {/* In-App Browser Banner */}
      <OpenInBrowserBanner />

      {/* ── Desktop: centered with gradient border ── */}
      <div
        className="hidden md:flex min-h-screen items-center justify-center p-4"
        style={{
          background:
            "linear-gradient(170deg, #F5F0FF 0%, #EDE4FF 40%, #F0EAFA 100%)",
        }}
      >
        <div
          className="
          relative w-full max-w-[430px] h-[92dvh]
          flex flex-col
          rounded-3xl overflow-hidden
          shadow-xl shadow-pastel-purple/20
          before:absolute before:inset-0 before:rounded-3xl before:p-[2px]
          before:bg-gradient-to-br before:from-pastel-purple before:via-pastel-pink before:to-pastel-blue
          before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
          before:[-webkit-mask-composite:xor]
          before:[mask-composite:exclude]
          before:pointer-events-none
        "
          style={{
            background: "linear-gradient(180deg, #FDFAFF 0%, #F8F4FF 100%)",
          }}
        >
          {inner}
        </div>
      </div>

      {/* ── Mobile / PWA standalone ── */}
      <div
        className={`md:hidden flex flex-col min-h-screen ${isStandalone ? "bg-black" : ""}`}
        style={
          isStandalone
            ? {}
            : {
                background:
                  "linear-gradient(170deg, #F5F0FF 0%, #EDE4FF 40%, #F0EAFA 100%)",
              }
        }
      >
        {isStandalone ? (
          <div
            className="flex-1 flex flex-col mx-auto w-full max-w-[430px] overflow-hidden relative"
            style={{
              background: "linear-gradient(180deg, #F5F0FF 0%, #EDE4FF 100%)",
            }}
          >
            <div className="h-[env(safe-area-inset-top,0px)] flex-shrink-0" />
            {inner}
          </div>
        ) : (
          <div className="flex flex-col min-h-screen">
            <main className="flex-1 px-4 pt-4 pb-20 min-h-0">{children}</main>
            <BottomNav />
          </div>
        )}
      </div>
    </PwaInstallContext.Provider>
  );
}
