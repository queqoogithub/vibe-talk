"use client";

import { Download, X, Sparkles } from "lucide-react";

interface Props {
  onInstall: () => void;
  onDismiss: () => void;
}

export default function PwaInstallModal({ onInstall, onDismiss }: Props) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-slide-up"
        onClick={onDismiss}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-gradient-card rounded-3xl border border-pastel-border shadow-2xl overflow-hidden animate-slide-up">
        {/* Decorative top gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-pastel-purple via-pastel-pink to-pastel-blue" />

        <div className="p-6 text-center">
          {/* Logo with glow */}
          <div className="mx-auto w-16 h-16 rounded-2xl overflow-hidden animate-logo-blink mb-4">
            <img
              src="/icons/vb-logo-192.png"
              alt="Vibe Talk"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          <h2 className="text-lg font-bold text-pastel-text mb-1">
            ติดตั้ง Vibe Talk
          </h2>
          <p className="text-xs text-pastel-text-light leading-relaxed mb-5 max-w-[260px] mx-auto">
            เพิ่มลงหน้าจอหลักเพื่อใช้งานได้เร็วขึ้น
            ไม่ต้องเปิดเบราว์เซอร์ทุกครั้ง ✨
          </p>

          {/* Install button */}
          <button
            onClick={onInstall}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-lg shadow-pastel-pink/30 hover:bg-gradient-primary-dark hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            <Download size={18} />
            ติดตั้งเลย
          </button>

          {/* Dismiss */}
          <button
            onClick={onDismiss}
            className="w-full mt-2.5 py-2.5 rounded-xl text-sm text-pastel-text-light hover:text-pastel-text hover:bg-pastel-purple-light/20 transition-colors"
          >
            ไว้ทีหลัง
          </button>
        </div>
      </div>
    </div>
  );
}
