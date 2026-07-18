"use client";

import type { UserVocabWord } from "@/lib/types";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Eye,
  EyeOff,
  BookOpen,
  Volume2,
  Circle,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState, useCallback } from "react";

interface Props {
  word: UserVocabWord;
  currentIndex: number;
  totalCount: number;
  showMeaning: boolean;
  isMastered: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleMeaning: () => void;
  onMarkMastered: (word: string) => void;
  onUnmarkMastered: (word: string) => void;
  onEdit: (word: UserVocabWord) => void;
  onDelete: (id: string) => void;
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
  onUnmarkMastered,
  onEdit,
  onDelete,
}: Props) {
  const [speaking, setSpeaking] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSpeak = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [word.word]);

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(word.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <div className="bg-gradient-card rounded-3xl border border-pastel-border shadow-sm overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 bg-pastel-cream">
        <div
          className="h-full bg-gradient-to-r from-pastel-purple to-pastel-pink transition-all duration-300"
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
          <div className="flex items-center gap-1">
            {/* Edit */}
            <button
              onClick={() => onEdit(word)}
              className="p-2 rounded-xl hover:bg-pastel-cream transition-colors text-pastel-text-light/50 hover:text-pastel-blue-dark"
              title="แก้ไข"
            >
              <Pencil size={16} />
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              className={`p-2 rounded-xl transition-colors ${
                showDeleteConfirm
                  ? "bg-red-50 text-red-500"
                  : "text-pastel-text-light/50 hover:bg-red-50 hover:text-red-400"
              }`}
              title={showDeleteConfirm ? "กดอีกครั้งเพื่อลบ" : "ลบ"}
            >
              <Trash2 size={16} />
            </button>

            {/* Meaning toggle */}
            <button
              onClick={onToggleMeaning}
              className="p-2 rounded-xl hover:bg-pastel-cream transition-colors text-pastel-text-light"
              title={showMeaning ? "Hide meaning" : "Show meaning"}
            >
              {showMeaning ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {/* Mastered toggle */}
            {isMastered ? (
              <button
                onClick={() => onUnmarkMastered(word.word)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-success text-white text-xs font-medium hover:opacity-80 transition-opacity"
              >
                <CheckCircle2 size={14} />
                รู้แล้ว
              </button>
            ) : (
              <button
                onClick={() => onMarkMastered(word.word)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pastel-purple-light/40 text-pastel-pink-dark text-xs font-medium hover:bg-gradient-primary hover:text-white transition-all"
              >
                <Circle size={14} />
                ยังไม่รู้
              </button>
            )}
          </div>
        </div>

        {/* Word */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-3xl font-bold text-pastel-text tracking-tight">
              {word.word}
            </h2>
            <button
              onClick={handleSpeak}
              disabled={speaking}
              className={`p-2 rounded-xl transition-all ${
                speaking
                  ? "bg-pastel-pink-light/50 text-pastel-pink-dark animate-pulse"
                  : "bg-pastel-blue-light/50 text-pastel-blue-dark hover:bg-pastel-blue-light hover:scale-110"
              }`}
              title="ฟังเสียงคำศัพท์"
            >
              <Volume2 size={20} />
            </button>
          </div>
          <p className="text-sm text-pastel-text-light mt-1">{word.phonetic}</p>
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
          <div className="bg-pastel-purple-light/50 rounded-2xl p-4 mb-4">
            <p className="text-sm text-pastel-text-light mb-1">ความหมาย:</p>
            <p className="text-lg font-medium text-pastel-text">
              {word.thaiMeaning}
            </p>
          </div>

          {/* Examples */}
          {word.examples.length > 0 && (
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
          )}
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
