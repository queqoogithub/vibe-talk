"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import type { UserVocabWord, VocabCategory } from "@/lib/types";
import { VOCAB_CATEGORY_LABELS } from "@/lib/types";
import {
  getAllUserWords,
  addUserWord,
  updateUserWord,
  deleteUserWord,
  markWordMastered,
  markWordUnmastered,
  getAllVocabProgress,
  type VocabProgress,
} from "@/lib/db";

export function useVocabulary() {
  const [selectedCategory, setSelectedCategory] = useState<
    VocabCategory | "all"
  >("all");
  const [masteryFilter, setMasteryFilter] = useState<
    "all" | "unmastered" | "mastered"
  >("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [progress, setProgress] = useState<VocabProgress[]>([]);
  const [allWords, setAllWords] = useState<UserVocabWord[]>([]);

  const refreshWords = useCallback(async () => {
    const words = await getAllUserWords();
    setAllWords(words);
  }, []);

  const refreshProgress = useCallback(async () => {
    const p = await getAllVocabProgress();
    setProgress(p);
  }, []);

  useEffect(() => {
    refreshWords();
    refreshProgress();
  }, [refreshWords, refreshProgress]);

  const baseWords =
    selectedCategory === "all"
      ? allWords
      : allWords.filter((w) => w.category === selectedCategory);

  const words = useMemo(() => {
    if (masteryFilter === "all") return baseWords;
    if (masteryFilter === "unmastered")
      return baseWords.filter(
        (w) => !progress.some((p) => p.word === w.word && p.mastered),
      );
    return baseWords.filter((w) =>
      progress.some((p) => p.word === w.word && p.mastered),
    );
  }, [baseWords, masteryFilter, progress]);

  const currentWord = words[currentIndex] || null;

  const categories = [
    { key: "all" as const, label: "ทั้งหมด" },
    ...(Object.entries(VOCAB_CATEGORY_LABELS) as [VocabCategory, string][]).map(
      ([key, label]) => ({ key, label }),
    ),
  ];

  const isMastered = (word: string) =>
    progress.some((p) => p.word === word && p.mastered);

  const masteredCount = words.filter((w) => isMastered(w.word)).length;

  const selectCategory = useCallback((cat: VocabCategory | "all") => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setShowMeaning(false);
  }, []);

  const selectMasteryFilter = useCallback(
    (f: "all" | "unmastered" | "mastered") => {
      setMasteryFilter(f);
      setCurrentIndex(0);
      setShowMeaning(false);
    },
    [],
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
    [refreshProgress],
  );

  const unmarkMastered = useCallback(
    async (word: string) => {
      await markWordUnmastered(word);
      await refreshProgress();
    },
    [refreshProgress],
  );

  const addWord = useCallback(
    async (word: Omit<UserVocabWord, "id" | "createdAt">) => {
      await addUserWord(word);
      await refreshWords();
    },
    [refreshWords],
  );

  const editWord = useCallback(
    async (word: UserVocabWord) => {
      await updateUserWord(word);
      await refreshWords();
    },
    [refreshWords],
  );

  const removeWord = useCallback(
    async (id: string) => {
      await deleteUserWord(id);
      setCurrentIndex(0);
      setShowMeaning(false);
      await refreshWords();
    },
    [refreshWords],
  );

  return {
    selectedCategory,
    masteryFilter,
    currentIndex,
    currentWord,
    words,
    categories,
    showMeaning,
    masteredCount,
    totalCount: words.length,
    selectCategory,
    selectMasteryFilter,
    nextWord,
    prevWord,
    toggleMeaning,
    markMastered,
    unmarkMastered,
    isMastered,
    progress,
    addWord,
    editWord,
    removeWord,
  };
}
