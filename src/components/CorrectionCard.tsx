"use client";

import type { GrammarCorrection } from "@/lib/types";
import { ERROR_TYPE_LABELS } from "@/lib/types";
import { AlertCircle, ArrowRight, Lightbulb } from "lucide-react";

interface Props {
  correction: GrammarCorrection;
}

export default function CorrectionCard({ correction }: Props) {
  return (
    <div className="bg-pastel-yellow-light/60 border border-pastel-yellow/30 rounded-xl p-3 text-xs">
      <div className="flex items-center gap-1.5 mb-2">
        <AlertCircle size={13} className="text-pastel-pink-dark" />
        <span className="font-semibold text-pastel-pink-dark">
          {ERROR_TYPE_LABELS[correction.errorType] || correction.errorType}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-1.5">
        <span className="line-through text-red-400 bg-red-50 px-1.5 py-0.5 rounded">
          {correction.original}
        </span>
        <ArrowRight
          size={12}
          className="text-pastel-text-light flex-shrink-0"
        />
        <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-medium">
          {correction.corrected}
        </span>
      </div>

      <p className="text-pastel-text-light leading-relaxed mt-1 flex items-start gap-1">
        <Lightbulb
          size={12}
          className="mt-0.5 flex-shrink-0 text-pastel-yellow"
        />
        {correction.explanation}
      </p>
    </div>
  );
}
