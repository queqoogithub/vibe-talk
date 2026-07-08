"use client";

import { useVocabulary } from "@/hooks/useVocabulary";
import { VOCAB_CATEGORY_LABELS } from "@/lib/types";
import type { VocabCategory } from "@/lib/types";
import VocabularyCardComponent from "@/components/VocabularyCard";
import { BookOpen, Layers } from "lucide-react";

export default function VocabularyPage() {
  const {
    selectedCategory,
    currentWord,
    words,
    categories,
    showMeaning,
    masteredCount,
    totalCount,
    selectCategory,
    nextWord,
    prevWord,
    toggleMeaning,
    markMastered,
    isMastered,
  } = useVocabulary();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-9 h-9 rounded-xl bg-pastel-green flex items-center justify-center">
          <BookOpen size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gradient">Vocabulary</h1>
          <p className="text-[10px] text-pastel-text-light">
            Oxford 3000 — คำศัพท์ที่ใช้บ่อย
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-pastel-border p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-pastel-text-light">ความคืบหน้า</span>
          <span className="text-xs font-mono font-semibold text-pastel-text">
            {masteredCount}/{totalCount}
          </span>
        </div>
        <div className="h-2 bg-pastel-cream rounded-full overflow-hidden">
          <div
            className="h-full bg-pastel-green rounded-full transition-all duration-500"
            style={{
              width: `${totalCount > 0 ? (masteredCount / totalCount) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Category Selector */}
      <div
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() =>
              selectCategory(
                cat.key === "all" ? "all" : (cat.key as VocabCategory),
              )
            }
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat.key
                ? "bg-pastel-green text-white shadow-sm"
                : "bg-white border border-pastel-border text-pastel-text-light hover:bg-pastel-green-light/30"
            }`}
          >
            {cat.key === "all" ? (
              <span className="flex items-center gap-1">
                <Layers size={12} />
                {cat.label}
              </span>
            ) : (
              cat.label
            )}
          </button>
        ))}
      </div>

      {/* Word Card */}
      {currentWord ? (
        <VocabularyCardComponent
          word={currentWord}
          currentIndex={words.indexOf(currentWord)}
          totalCount={totalCount}
          showMeaning={showMeaning}
          isMastered={isMastered(currentWord.word)}
          onPrev={prevWord}
          onNext={nextWord}
          onToggleMeaning={toggleMeaning}
          onMarkMastered={markMastered}
        />
      ) : (
        <div className="text-center py-12">
          <BookOpen
            size={40}
            className="mx-auto text-pastel-text-light/20 mb-3"
          />
          <p className="text-sm text-pastel-text-light">
            No words in this category
          </p>
        </div>
      )}
    </div>
  );
}
