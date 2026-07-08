"use client";

import { useEffect, useState } from "react";
import BottomNav from "./BottomNav";

export default function PhoneFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isStandalone, setIsStandalone] = useState(false);

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
    <>
      {/* ── Desktop: centered with gradient border ── */}
      <div className="hidden md:flex min-h-screen items-center justify-center bg-pastel-cream p-4">
        <div
          className="
          relative w-full max-w-[430px] h-[92dvh]
          flex flex-col bg-pastel-surface
          rounded-3xl overflow-hidden
          shadow-xl shadow-pastel-purple/10
          before:absolute before:inset-0 before:rounded-3xl before:p-[2px]
          before:bg-white
          before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
          before:[-webkit-mask-composite:xor]
          before:[mask-composite:exclude]
          before:pointer-events-none
        "
        >
          {inner}
        </div>
      </div>

      {/* ── Mobile / PWA standalone ── */}
      <div
        className={`md:hidden flex flex-col min-h-screen ${isStandalone ? "bg-black" : "bg-pastel-cream"}`}
      >
        {isStandalone ? (
          <div className="flex-1 flex flex-col mx-auto w-full max-w-[430px] bg-pastel-cream overflow-hidden relative">
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
    </>
  );
}
