"use client";

import { useState } from "react";
import { useVocabulary } from "@/hooks/useVocabulary";
import { VOCAB_CATEGORY_LABELS } from "@/lib/types";
import type { UserVocabWord, VocabCategory } from "@/lib/types";
import VocabularyCardComponent from "@/components/VocabularyCard";
import AddWordModal from "@/components/AddWordModal";
import {
  BookOpen,
  Layers,
  ListFilter,
  CheckCircle2,
  Circle,
  Plus,
} from "lucide-react";

export default function VocabularyPage() {
  const {
    selectedCategory,
    masteryFilter,
    currentWord,
    words,
    categories,
    showMeaning,
    masteredCount,
    totalCount,
    selectCategory,
    selectMasteryFilter,
    nextWord,
    prevWord,
    toggleMeaning,
    markMastered,
    unmarkMastered,
    isMastered,
    addWord,
    editWord,
    removeWord,
  } = useVocabulary();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<UserVocabWord | null>(null);

  const handleOpenAdd = () => {
    setEditingWord(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (word: UserVocabWord) => {
    setEditingWord(word);
    setModalOpen(true);
  };

  const handleSave = (
    word: Omit<UserVocabWord, "id" | "createdAt"> | UserVocabWord,
  ) => {
    if ("id" in word) {
      editWord(word);
    } else {
      addWord(word);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-9 h-9 rounded-xl bg-pastel-green flex items-center justify-center">
          <BookOpen size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gradient">Vocabulary</h1>
          <p className="text-[10px] text-pastel-text-light">
            บันทึกคำศัพท์และตัวอย่างประโยคของคุณเอง
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="w-9 h-9 rounded-xl bg-pastel-pink flex items-center justify-center text-white shadow-sm hover:bg-pastel-pink-dark transition-colors"
          title="เพิ่มคำศัพท์ใหม่"
        >
          <Plus size={20} />
        </button>
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

      {/* Mastery Filter */}
      <div className="flex gap-2">
        {(
          [
            { key: "all" as const, label: "ทั้งหมด", icon: ListFilter },
            { key: "unmastered" as const, label: "ยังไม่รู้", icon: Circle },
            { key: "mastered" as const, label: "รู้แล้ว", icon: CheckCircle2 },
          ] as const
        ).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => selectMasteryFilter(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              masteryFilter === key
                ? "bg-pastel-pink text-white shadow-sm"
                : "bg-white border border-pastel-border text-pastel-text-light hover:bg-pastel-pink-light/20"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
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

      {/* Word Card or Empty State */}
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
          onUnmarkMastered={unmarkMastered}
          onEdit={handleOpenEdit}
          onDelete={removeWord}
        />
      ) : (
        <div className="text-center py-12">
          <BookOpen
            size={40}
            className="mx-auto text-pastel-text-light/20 mb-3"
          />
          <p className="text-sm text-pastel-text-light mb-1">
            ยังไม่มีคำศัพท์ในหมวดนี้
          </p>
          <p className="text-xs text-pastel-text-light/50 mb-4">
            เพิ่มคำศัพท์แรกของคุณเพื่อเริ่มต้น
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pastel-pink text-white text-sm font-medium shadow-sm hover:bg-pastel-pink-dark transition-colors"
          >
            <Plus size={16} />
            เพิ่มคำศัพท์
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AddWordModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editWord={editingWord}
      />
    </div>
  );
}
