"use client";

import type { ErrorDashboard as ErrorDashboardType, ErrorType } from "@/lib/types";
import { ERROR_TYPE_LABELS } from "@/lib/types";
import { BarChart3, MessageSquare, AlertTriangle, TrendingUp, RefreshCw } from "lucide-react";

const BAR_COLORS: Record<ErrorType, string> = {
  tense: "bg-pastel-pink",
  preposition: "bg-pastel-purple",
  article: "bg-pastel-blue",
  "word-order": "bg-pastel-green",
  "word-choice": "bg-pastel-yellow",
  "subject-verb-agreement": "bg-pastel-pink-dark",
  plural: "bg-pastel-purple-dark",
  spelling: "bg-pastel-blue-dark",
  other: "bg-pastel-text-light",
};

interface Props {
  dashboard: ErrorDashboardType;
  onReset: () => void;
}

export default function ErrorDashboard({ dashboard, onReset }: Props) {
  const { totalErrors, totalConversations, errorBreakdown } = dashboard;
  const maxCount = Math.max(...errorBreakdown.map((e) => e.count), 1);

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-pastel-border p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-pastel-pink-light flex items-center justify-center">
              <AlertTriangle size={16} className="text-pastel-pink-dark" />
            </div>
            <span className="text-xs text-pastel-text-light">Total Errors</span>
          </div>
          <p className="text-2xl font-bold text-pastel-text">{totalErrors}</p>
        </div>

        <div className="bg-white rounded-2xl border border-pastel-border p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-pastel-blue-light flex items-center justify-center">
              <MessageSquare size={16} className="text-pastel-blue-dark" />
            </div>
            <span className="text-xs text-pastel-text-light">
              Conversations
            </span>
          </div>
          <p className="text-2xl font-bold text-pastel-text">
            {totalConversations}
          </p>
        </div>
      </div>

      {/* Error Breakdown */}
      <div className="bg-white rounded-2xl border border-pastel-border p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-pastel-purple" />
            <h3 className="text-sm font-semibold text-pastel-text">
              Error Breakdown
            </h3>
          </div>
          {totalErrors > 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs text-pastel-text-light hover:text-pastel-pink-dark transition-colors"
            >
              <RefreshCw size={12} />
              Reset
            </button>
          )}
        </div>

        {errorBreakdown.length === 0 ? (
          <div className="text-center py-6">
            <TrendingUp size={32} className="mx-auto text-pastel-text-light/20 mb-2" />
            <p className="text-sm text-pastel-text-light">
              No errors recorded yet. Start chatting!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {errorBreakdown.map((stat) => {
              const pct = Math.round((stat.count / maxCount) * 100);
              const colorClass =
                BAR_COLORS[stat.errorType] || "bg-pastel-text-light";

              return (
                <div key={stat.errorType}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-pastel-text">
                      {ERROR_TYPE_LABELS[stat.errorType]}
                    </span>
                    <span className="text-xs text-pastel-text-light font-mono">
                      {stat.count}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-pastel-cream rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colorClass} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {stat.examples.length > 0 && (
                    <p className="text-[10px] text-pastel-text-light mt-1 truncate">
                      e.g. {stat.examples.slice(0, 2).join(", ")}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Insight */}
      {errorBreakdown.length > 0 && (
        <div className="bg-pastel-yellow-light/50 border border-pastel-yellow/30 rounded-2xl p-4">
          <p className="text-xs text-pastel-text-light leading-relaxed">
            💡 <span className="font-medium">จุดที่ควรฝึกเพิ่ม:</span>{" "}
            {errorBreakdown[0] &&
              `${ERROR_TYPE_LABELS[errorBreakdown[0].errorType]} — พบบ่อยที่สุด (${errorBreakdown[0].count} ครั้ง)`}
            {errorBreakdown[1] &&
              ` รองลงมาคือ ${ERROR_TYPE_LABELS[errorBreakdown[1].errorType]} (${errorBreakdown[1].count} ครั้ง)`}
          </p>
        </div>
      )}
    </div>
  );
}
