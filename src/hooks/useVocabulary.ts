"use client";

import { useState, useCallback, useEffect } from "react";
import type { VocabWord, VocabCategory } from "@/lib/types";
import { VOCAB_CATEGORY_LABELS } from "@/lib/types";
import { OXFORD_WORDS, getWordsByCategory } from "@/lib/oxford3000";
import { markWordMastered, getAllVocabProgress, type VocabProgress } from "@/lib/db";

export function useVocabulary() {
  const [selectedCategory, setSelectedCategory] = useState<VocabCategory | "all">("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [progress, setProgress] = useState<VocabProgress[]>([]);

  const words =
    selectedCategory === "all"
      ? OXFORD_WORDS
      : getWordsByCategory(selectedCategory);

  const currentWord = words[currentIndex] || null;

  const categories = [
    { key: "all" as const, label: "ทั้งหมด" },
    ...(Object.entries(VOCAB_CATEGORY_LABELS) as [VocabCategory, string][]).map(
      ([key, label]) => ({ key, label })
    ),
  ];

  const refreshProgress = useCallback(async () => {
    const p = await getAllVocabProgress();
    setProgress(p);
  }, []);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  const isMastered = (word: string) =>
    progress.some((p) => p.word === word && p.mastered);

  const masteredCount = words.filter((w) => isMastered(w.word)).length;

  const selectCategory = useCallback(
    (cat: VocabCategory | "all") => {
      setSelectedCategory(cat);
      setCurrentIndex(0);
      setShowMeaning(false);
    },
    []
  );

  const nextWord = useCallback(() => {
    setShowMeaning(false);
    setCurrentIndex((prev) => (prev + 1) % words.length);
  }, [words.length]);

  const prevWord = useCallback(() => {
    setShowMeaning(false);
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
  }, [words.length]);

  const toggleMeaning = useCallback(() => {
    setShowMeaning((prev) => !prev);
  }, []);

  const markMastered = useCallback(
    async (word: string) => {
      await markWordMastered(word);
      await refreshProgress();
    },
    [refreshProgress]
  );

  return {
    selectedCategory,
    currentIndex,
    currentWord,
    words,
    categories,
    showMeaning,
    masteredCount,
    totalCount: words.length,
    selectCategory,
    nextWord,
    prevWord,
    toggleMeaning,
    markMastered,
    isMastered,
    progress,
  };
}
