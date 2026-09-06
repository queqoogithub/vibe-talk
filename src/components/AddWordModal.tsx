"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { UserVocabWord, VocabCategory } from "@/lib/types";
import { VOCAB_CATEGORY_LABELS } from "@/lib/types";
import { inferWordInfo, checkSpelling } from "@/lib/deepseek";
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    word: Omit<UserVocabWord, "id" | "createdAt"> | UserVocabWord,
  ) => void;
  editWord?: UserVocabWord | null;
  /** Find an existing word entry (case-insensitive), used for duplicate detection. */
  findExisting: (
    word: string,
    excludeId?: string,
  ) => UserVocabWord | undefined;
  /** Whether a stored word is currently in the "รู้แล้ว" (mastered) list. */
  isWordMastered: (word: string) => boolean;
  /** Move an existing mastered word back to "ยังไม่รู้" (relearn). */
  onRelearn: (word: string) => void;
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
  findExisting,
  isWordMastered,
  onRelearn,
}: Props) {
  const [word, setWord] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [thaiMeaning, setThaiMeaning] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("");
  const [examples, setExamples] = useState<string[]>([""]);
  const [category, setCategory] = useState<VocabCategory>("general");

  const [inferring, setInferring] = useState(false);
  const [inferError, setInferError] = useState("");

  // Spell check state
  const [spellChecking, setSpellChecking] = useState(false);
  const [spellSuggestions, setSpellSuggestions] = useState<string[]>([]);
  const [spellCorrect, setSpellCorrect] = useState<boolean | null>(null);
  const lastCheckedWord = useRef("");

  // Duplicate warning
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const dismissedDuplicate = useRef(false);
  // Existing word that was already marked as "รู้แล้ว" (mastered)
  const [masteredDuplicate, setMasteredDuplicate] =
    useState<UserVocabWord | null>(null);

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
    setSpellSuggestions([]);
    setSpellCorrect(null);
    lastCheckedWord.current = "";
    setDuplicateWarning(null);
    dismissedDuplicate.current = false;
    setMasteredDuplicate(null);
  }, [editWord, isOpen]);

  const checkDuplicate = (w: string): boolean => {
    const excludeId = editWord?.id;
    const existing = findExisting(w, excludeId);
    if (existing) {
      // ถ้าคำนั้นอยู่ในลิสต์ "รู้แล้ว" → เสนอให้ย้ายกลับไป "ยังไม่รู้" แทนการเพิ่มคำซ้ำ
      if (!isEditing && isWordMastered(existing.word)) {
        setDuplicateWarning(null);
        setMasteredDuplicate(existing);
        return true;
      }
      setMasteredDuplicate(null);
      setDuplicateWarning(`คำว่า "${w.trim()}" มีอยู่ในคลังคำศัพท์แล้ว`);
      return true;
    }
    setDuplicateWarning(null);
    setMasteredDuplicate(null);
    return false;
  };

  const runSpellCheck = useCallback(async (w: string) => {
    const trimmed = w.trim();
    if (!trimmed || trimmed.length < 2) {
      setSpellSuggestions([]);
      setSpellCorrect(null);
      return;
    }

    setSpellChecking(true);
    setSpellSuggestions([]);
    setSpellCorrect(null);
    lastCheckedWord.current = trimmed;

    try {
      const result = await checkSpelling(trimmed);
      if (lastCheckedWord.current === trimmed) {
        setSpellCorrect(result.isCorrect);
        setSpellSuggestions(result.isCorrect ? [] : result.suggestions);
      }
    } catch {
      // silently ignore
    } finally {
      setSpellChecking(false);
    }
  }, []);

  const handleWordChange = (value: string) => {
    setWord(value);
    if (lastCheckedWord.current !== value.trim()) {
      setSpellSuggestions([]);
      setSpellCorrect(null);
    }
    // ตรวจคำซ้ำแบบ real-time ขณะพิมพ์
    // เพื่อให้เห็นป้าย "รู้แล้ว → ย้ายกลับไปยังไม่รู้" ได้ทันที
    // โดยไม่ต้องรอ submit (ไม่งั้น native validation จะบล็อกก่อน)
    dismissedDuplicate.current = false;
    checkDuplicate(value);
  };

  const handleWordBlur = () => {
    if (word.trim() && word.trim() !== lastCheckedWord.current) {
      runSpellCheck(word);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setWord(suggestion);
    setSpellSuggestions([]);
    setSpellCorrect(true);
    lastCheckedWord.current = suggestion;

    // Check duplicate for the suggested word
    if (checkDuplicate(suggestion)) return;

    // Auto-fill after accepting suggestion
    setInferring(true);
    setInferError("");
    try {
      const info = await inferWordInfo(suggestion);
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
    } catch {
      // ok
    } finally {
      setInferring(false);
    }
  };

  const handleAutoFill = async () => {
    if (!word.trim()) return;

    // Check duplicate
    if (checkDuplicate(word)) return;

    // Run spell check first if not checked yet
    if (spellCorrect === null && word.trim() !== lastCheckedWord.current) {
      await runSpellCheck(word);
      if (
        lastCheckedWord.current === word.trim() &&
        spellSuggestions.length > 0
      ) {
        return;
      }
    }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) return;

    // คำอยู่ในลิสต์ "รู้แล้ว" แล้ว → ย้ายกลับไป "ยังไม่รู้"
    // (ยืนยันผ่านปุ่ม submit ที่เปลี่ยนชื่อแล้ว จะไม่สร้างรายการซ้ำ)
    if (masteredDuplicate) {
      onRelearn(masteredDuplicate.word);
      onClose();
      return;
    }

    // ตรวจคำซ้ำก่อนบังคับกรอกความหมาย
    // เพื่อให้เจอคำที่อยู่ใน "รู้แล้ว" ได้แม้ยังกรอกไม่ครบ
    if (!dismissedDuplicate.current && checkDuplicate(word)) return;

    if (!thaiMeaning.trim()) return;

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

  const dismissDuplicate = () => {
    dismissedDuplicate.current = true;
    setDuplicateWarning(null);
  };

  const addExample = () => setExamples([...examples, ""]);
  const removeExample = (idx: number) => {
    setExamples(examples.filter((_, i) => i !== idx));
  };
  const updateExample = (idx: number, value: string) => {
    setExamples(examples.map((ex, i) => (i === idx ? value : ex)));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md max-h-[90vh] bg-gradient-card rounded-t-3xl sm:rounded-3xl shadow-xl overflow-y-auto animate-slide-up pb-20 safe-area-bottom">
        <div className="sticky top-0 bg-gradient-card z-10 flex items-center justify-between p-4 border-b border-pastel-border">
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
            <div className="relative">
              <input
                type="text"
                value={word}
                onChange={(e) => handleWordChange(e.target.value)}
                onBlur={handleWordBlur}
                placeholder="เช่น: serendipity"
                className={`w-full px-3 py-2.5 rounded-xl border bg-pastel-cream/30 text-sm text-pastel-text placeholder-pastel-text-light/40 focus:outline-none focus:ring-2 focus:ring-pastel-pink-light focus:border-transparent ${
                  duplicateWarning
                    ? "border-red-300 ring-2 ring-red-200"
                    : "border-pastel-border"
                }`}
                required
              />
              {/* Spell check inline indicator */}
              {spellChecking && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2
                    size={16}
                    className="animate-spin text-pastel-text-light/40"
                  />
                </div>
              )}
              {!spellChecking &&
                spellCorrect === true &&
                word.trim() === lastCheckedWord.current && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CheckCircle2 size={16} className="text-pastel-green" />
                  </div>
                )}
              {!spellChecking &&
                spellCorrect === false &&
                word.trim() === lastCheckedWord.current && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <AlertTriangle size={16} className="text-amber-400" />
                  </div>
                )}
            </div>

            {/* Duplicate warning */}
            {duplicateWarning && (
              <div className="mt-2 p-3 rounded-xl bg-red-50 border border-red-200">
                <p className="text-xs text-red-500 mb-2 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {duplicateWarning}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={dismissDuplicate}
                    className="px-3 py-1.5 rounded-lg bg-white border border-red-300 text-xs font-medium text-pastel-text hover:bg-red-50 transition-colors"
                  >
                    เพิ่มต่อไป (ไม่สนใจ)
                  </button>
                </div>
              </div>
            )}

            {/* Mastered duplicate → relearn instead of duplicate add */}
            {masteredDuplicate && !isEditing && (
              <div className="mt-2 p-3 rounded-xl bg-pastel-purple-light/50 border border-pastel-purple-light">
                <p className="text-xs font-semibold text-pastel-purple-dark flex items-start gap-1.5">
                  <RotateCcw size={13} className="flex-shrink-0 mt-0.5" />
                  <span>
                    “{masteredDuplicate.word}” มีอยู่ในคลังแล้ว
                    และอยู่ในสถานะ “รู้แล้ว”
                  </span>
                </p>
                <p className="text-[11px] text-pastel-text-light mt-1 ml-[22px]">
                  กดปุ่ม “ย้ายกลับไปยังไม่รู้” ด้านล่างเพื่อนำกลับมาฝึกใหม่
                  (จะไม่เพิ่มคำซ้ำ)
                </p>
              </div>
            )}

            {/* Spell suggestions */}
            {!spellChecking &&
              spellCorrect === false &&
              spellSuggestions.length > 0 && (
                <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-xs text-amber-600 mb-2 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    คำนี้ดูเหมือนจะสะกดผิด — ลองเลือกคำที่ถูกต้อง:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {spellSuggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleSuggestionClick(s)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-sm font-medium text-pastel-text hover:bg-pastel-green-light/30 hover:border-pastel-green transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Auto-fill button */}
          <button
            type="button"
            onClick={handleAutoFill}
            disabled={inferring || !word.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-pastel-purple-light text-pastel-purple-dark text-sm font-medium hover:bg-pastel-purple-light/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
            // กรณีคำซ้ำใน "รู้แล้ว" → ย้ายกลับไปยังไม่รู้ ไม่ต้องกรอกความหมาย
            // จึงข้าม native validation ของช่อง required
            formNoValidate={!isEditing && !!masteredDuplicate}
            className={`w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity mb-4 ${
              masteredDuplicate && !isEditing
                ? "bg-gradient-primary shadow-lg shadow-pastel-pink/30"
                : "bg-gradient-success"
            }`}
          >
            {isEditing
              ? "บันทึกการแก้ไข"
              : masteredDuplicate
                ? "ย้ายกลับไปยังไม่รู้"
                : "บันทึกคำศัพท์"}
          </button>
        </form>
      </div>
    </div>
  );
}
