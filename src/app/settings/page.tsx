"use client";

import SettingsPanel from "@/components/SettingsPanel";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-9 h-9 rounded-xl bg-pastel-blue flex items-center justify-center">
          <Settings size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-pastel-text">Settings</h1>
          <p className="text-[10px] text-pastel-text-light">
            ตั้งค่า API และเกี่ยวกับแอป
          </p>
        </div>
      </div>

      <SettingsPanel />
    </div>
  );
}
