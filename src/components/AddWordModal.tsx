"use client";

import { useState, useEffect } from "react";
import type { UserVocabWord, VocabCategory } from "@/lib/types";
import { VOCAB_CATEGORY_LABELS } from "@/lib/types";
import { inferWordInfo } from "@/lib/deepseek";
import { X, Plus, Trash2, Sparkles, Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    word: Omit<UserVocabWord, "id" | "createdAt"> | UserVocabWord,
  ) => void;
  editWord?: UserVocabWord | null;
}

const CATEGORY_OPTIONS = Object.entries(VOCAB_CATEGORY_LABELS) as [
  VocabCategory,
  string,
][];

export default function AddWordModal({
  isOpen,
  onClose,
  onSave,
  editWord,
}: Props) {
  const [word, setWord] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [thaiMeaning, setThaiMeaning] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("");
  const [examples, setExamples] = useState<string[]>([""]);
  const [category, setCategory] = useState<VocabCategory>("general");

  const [inferring, setInferring] = useState(false);
  const [inferError, setInferError] = useState("");

  const isEditing = !!editWord;

  useEffect(() => {
    if (editWord) {
      setWord(editWord.word);
      setPhonetic(editWord.phonetic);
      setThaiMeaning(editWord.thaiMeaning);
      setPartOfSpeech(editWord.partOfSpeech);
      setExamples(editWord.examples.length > 0 ? editWord.examples : [""]);
      setCategory(editWord.category);
    } else {
      setWord("");
      setPhonetic("");
      setThaiMeaning("");
      setPartOfSpeech("");
      setExamples([""]);
      setCategory("general");
    }
    setInferError("");
  }, [editWord, isOpen]);

  if (!isOpen) return null;

  const handleAutoFill = async () => {
    if (!word.trim()) return;
    setInferring(true);
    setInferError("");
    try {
      const info = await inferWordInfo(word.trim());
      setPhonetic(info.phonetic);
      setThaiMeaning(info.thaiMeaning);
      setPartOfSpeech(info.partOfSpeech);
      if (
        info.category &&
        CATEGORY_OPTIONS.some(([k]) => k === info.category)
      ) {
        setCategory(info.category as VocabCategory);
      }
      setExamples(info.examples.length > 0 ? info.examples : [""]);
    } catch (err: any) {
      setInferError(err?.message || "ไม่สามารถเติมข้อมูลอัตโนมัติได้");
    } finally {
      setInferring(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !thaiMeaning.trim()) return;

    const filteredExamples = examples.filter((ex) => ex.trim() !== "");
    const wordData = {
      word: word.trim(),
      phonetic: phonetic.trim() || "/—/",
      thaiMeaning: thaiMeaning.trim(),
      partOfSpeech: partOfSpeech.trim() || "—",
      examples: filteredExamples,
      category,
    };

    if (isEditing && editWord) {
      onSave({ ...wordData, id: editWord.id, createdAt: editWord.createdAt });
    } else {
      onSave(wordData);
    }

    onClose();
  };

  const addExample = () => setExamples([...examples, ""]);
  const removeExample = (idx: number) => {
    setExamples(examples.filter((_, i) => i !== idx));
  };
  const updateExample = (idx: number, value: string) => {
    setExamples(examples.map((ex, i) => (i === idx ? value : ex)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-xl overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b border-pastel-border">
          <h2 className="text-lg font-bold text-pastel-text">
            {isEditing ? "แก้ไขคำศัพท์" : "เพิ่มคำศัพท์ใหม่"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-pastel-cream transition-colors text-pastel-text-light"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Word */}
          <div>
            <label className="block text-xs font-semibold text-pastel-text-light mb-1">
              คำศัพท์ *
            </label>
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="เช่น: serendipity"
              className="w-full px-3 py-2.5 rounded-xl border border-pastel-border bg-pastel-cream/30 text-sm text-pastel-text placeholder-pastel-text-light/40 focus:outline-none focus:ring-2 focus:ring-pastel-pink-light focus:border-transparent"
              required
            />
          </div>

          {/* Auto-fill button */}
          <button
            type="button"
            onClick={handleAutoFill}
            disabled={inferring || !word.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-pastel-purple-light text-pastel-purple-dark text-sm font-medium hover:bg-pastel-purple-light/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {inferring ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                กำลังค้นหาข้อมูล...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                เติมข้อมูลอัตโนมัติ (AI)
              </>
            )}
          </button>

          {inferError && (
            <p className="text-xs text-red-400 text-center -mt-2">
              {inferError}
            </p>
          )}

          {/* Phonetic */}
          <div>
            <label className="block text-xs font-semibold text-pastel-text-light mb-1">
              คำอ่าน (Phonetic)
            </label>
            <input
              type="text"
              value={phonetic}
              onChange={(e) => setPhonetic(e.target.value)}
              placeholder="เช่น: /ˌserənˈdɪpəti/"
              className="w-full px-3 py-2.5 rounded-xl border border-pastel-border bg-pastel-cream/30 text-sm text-pastel-text placeholder-pastel-text-light/40 focus:outline-none focus:ring-2 focus:ring-pastel-pink-light focus:border-transparent"
            />
          </div>

          {/* Thai Meaning */}
          <div>
            <label className="block text-xs font-semibold text-pastel-text-light mb-1">
              ความหมายภาษาไทย *
            </label>
            <input
              type="text"
              value={thaiMeaning}
              onChange={(e) => setThaiMeaning(e.target.value)}
              placeholder="เช่น: การค้นพบสิ่งดีๆ โดยบังเอิญ"
              className="w-full px-3 py-2.5 rounded-xl border border-pastel-border bg-pastel-cream/30 text-sm text-pastel-text placeholder-pastel-text-light/40 focus:outline-none focus:ring-2 focus:ring-pastel-pink-light focus:border-transparent"
              required
            />
          </div>

          {/* Part of Speech */}
          <div>
            <label className="block text-xs font-semibold text-pastel-text-light mb-1">
              Part of Speech
            </label>
            <input
              type="text"
              value={partOfSpeech}
              onChange={(e) => setPartOfSpeech(e.target.value)}
              placeholder="เช่น: n., v., adj., adv."
              className="w-full px-3 py-2.5 rounded-xl border border-pastel-border bg-pastel-cream/30 text-sm text-pastel-text placeholder-pastel-text-light/40 focus:outline-none focus:ring-2 focus:ring-pastel-pink-light focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-pastel-text-light mb-1">
              หมวดหมู่
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as VocabCategory)}
              className="w-full px-3 py-2.5 rounded-xl border border-pastel-border bg-pastel-cream/30 text-sm text-pastel-text focus:outline-none focus:ring-2 focus:ring-pastel-pink-light focus:border-transparent"
            >
              {CATEGORY_OPTIONS.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Examples */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-pastel-text-light">
                ตัวอย่างประโยค
              </label>
              <button
                type="button"
                onClick={addExample}
                className="flex items-center gap-1 text-xs text-pastel-pink-dark hover:text-pastel-pink font-medium"
              >
                <Plus size={14} />
                เพิ่ม
              </button>
            </div>
            <div className="space-y-2">
              {examples.map((ex, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={ex}
                    onChange={(e) => updateExample(idx, e.target.value)}
                    placeholder={`ตัวอย่างประโยค ${idx + 1}`}
                    className="flex-1 px-3 py-2 rounded-xl border border-pastel-border bg-pastel-cream/30 text-sm text-pastel-text placeholder-pastel-text-light/40 focus:outline-none focus:ring-2 focus:ring-pastel-pink-light focus:border-transparent"
                  />
                  {examples.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExample(idx)}
                      className="p-2 rounded-xl text-pastel-text-light/40 hover:text-red-400 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-pastel-green text-white font-semibold text-sm hover:bg-pastel-green/90 transition-colors"
          >
            {isEditing ? "บันทึกการแก้ไข" : "บันทึกคำศัพท์"}
          </button>
        </form>
      </div>
    </div>
  );
}
