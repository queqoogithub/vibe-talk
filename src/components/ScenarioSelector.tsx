"use client";

import type { Scenario } from "@/lib/types";
import { SCENARIO_LABELS } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const SCENARIOS: Scenario[] = [
  "free-talk",
  "ordering-food",
  "job-interview",
  "hotel-checkin",
  "small-talk",
  "shopping",
  "travel-directions",
  "doctor-visit",
];

interface Props {
  current: Scenario;
  onSelect: (scenario: Scenario) => void;
}

export default function ScenarioSelector({ current, onSelect }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
    setTimeout(checkScroll, 300);
  };

  return (
    <div className="relative flex items-center gap-1">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="flex-shrink-0 p-1 rounded-full bg-white/80 shadow-sm text-pastel-text-light hover:text-pastel-text"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1 flex-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {SCENARIOS.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className={`flex-shrink-0 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              current === s
                ? "bg-pastel-pink text-white shadow-md shadow-pastel-pink/30"
                : "bg-white text-pastel-text-light hover:bg-pastel-pink-light/30 border border-pastel-border"
            }`}
          >
            {SCENARIO_LABELS[s]}
          </button>
        ))}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="flex-shrink-0 p-1 rounded-full bg-white/80 shadow-sm text-pastel-text-light hover:text-pastel-text"
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
