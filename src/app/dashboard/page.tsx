"use client";

import { useErrorTracking } from "@/hooks/useErrorTracking";
import ErrorDashboardComponent from "@/components/ErrorDashboard";
import { BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const { dashboard, reset } = useErrorTracking();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-mauve flex items-center justify-center shadow-md">
          <BarChart3 size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold italic text-gradient">Error Dashboard</h1>
          <p className="text-[10px] text-pastel-text-light">
            ติดตามจุดที่ควรพัฒนา
          </p>
        </div>
      </div>

      <ErrorDashboardComponent dashboard={dashboard} onReset={reset} />
    </div>
  );
}
