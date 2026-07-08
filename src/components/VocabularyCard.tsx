"use client";

import type { VocabWord } from "@/lib/types";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Eye,
  EyeOff,
  BookOpen,
} from "lucide-react";

interface Props {
  word: VocabWord;
  currentIndex: number;
  totalCount: number;
  showMeaning: boolean;
  isMastered: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleMeaning: () => void;
  onMarkMastered: (word: string) => void;
}

export default function VocabularyCard({
  word,
  currentIndex,
  totalCount,
  showMeaning,
  isMastered,
  onPrev,
  onNext,
  onToggleMeaning,
  onMarkMastered,
}: Props) {
  return (
    <div className="bg-white rounded-3xl border border-pastel-border shadow-sm overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 bg-pastel-cream">
        <div
          className="h-full bg-pastel-pink transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / totalCount) * 100}%`,
          }}
        />
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs text-pastel-text-light font-mono">
            {currentIndex + 1} / {totalCount}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMeaning}
              className="p-2 rounded-xl hover:bg-pastel-cream transition-colors text-pastel-text-light"
              title={showMeaning ? "Hide meaning" : "Show meaning"}
            >
              {showMeaning ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {!isMastered && (
              <button
                onClick={() => onMarkMastered(word.word)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pastel-green-light text-green-700 text-xs font-medium hover:bg-pastel-green transition-colors"
              >
                <CheckCircle2 size={14} />
                Mastered
              </button>
            )}
            {isMastered && (
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pastel-green/20 text-green-600 text-xs font-medium">
                <CheckCircle2 size={14} />
                Mastered ✓
              </span>
            )}
          </div>
        </div>

        {/* Word */}
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-pastel-text mb-1 tracking-tight">
            {word.word}
          </h2>
          <p className="text-sm text-pastel-text-light">{word.phonetic}</p>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs bg-pastel-purple-light text-pastel-purple-dark font-medium">
            {word.partOfSpeech}
          </span>
        </div>

        {/* Meaning (toggle) */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            showMeaning ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-pastel-cream/60 rounded-2xl p-4 mb-4">
            <p className="text-sm text-pastel-text-light mb-1">ความหมาย:</p>
            <p className="text-lg font-medium text-pastel-text">
              {word.thaiMeaning}
            </p>
          </div>

          {/* Examples */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-pastel-text-light flex items-center gap-1">
              <BookOpen size={13} />
              Example Sentences
            </p>
            {word.examples.map((ex, idx) => (
              <div
                key={idx}
                className="bg-pastel-blue-light/30 rounded-xl p-3 text-sm text-pastel-text leading-relaxed"
              >
                {ex}
              </div>
            ))}
          </div>
        </div>

        {/* Tap hint */}
        {!showMeaning && (
          <p className="text-center text-xs text-pastel-text-light/50 mt-3 flex items-center justify-center gap-1">
            แตะ <Eye size={14} className="text-pastel-text-light/40" />{" "}
            เพื่อดูความหมาย
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex border-t border-pastel-border">
        <button
          onClick={onPrev}
          className="flex-1 flex items-center justify-center gap-1 py-3 text-sm text-pastel-text-light hover:bg-pastel-cream/50 transition-colors border-r border-pastel-border"
        >
          <ChevronLeft size={16} />
          ก่อนหน้า
        </button>
        <button
          onClick={onNext}
          className="flex-1 flex items-center justify-center gap-1 py-3 text-sm text-pastel-text-light hover:bg-pastel-cream/50 transition-colors"
        >
          ถัดไป
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
