"use client";

import type { Scenario } from "@/lib/types";
import { SCENARIO_LABELS } from "@/lib/types";
import {
  ChevronLeft,
  ChevronRight,
  Utensils,
  Briefcase,
  Hotel,
  MessageCircle,
  ShoppingBag,
  MapPin,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";

import type { LucideIcon } from "lucide-react";

const SCENARIOS: {
  key: Scenario;
  icon: LucideIcon;
}[] = [
  { key: "free-talk", icon: Sparkles },
  { key: "ordering-food", icon: Utensils },
  { key: "job-interview", icon: Briefcase },
  { key: "hotel-checkin", icon: Hotel },
  { key: "small-talk", icon: MessageCircle },
  { key: "shopping", icon: ShoppingBag },
  { key: "travel-directions", icon: MapPin },
  { key: "doctor-visit", icon: Stethoscope },
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
        {SCENARIOS.map(({ key, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              current === key
                ? "bg-gradient-primary text-white shadow-md shadow-pastel-pink/30 scale-105"
                : "bg-white/80 backdrop-blur-sm text-pastel-text-light hover:bg-pastel-pink-light/30 border border-pastel-border"
            }`}
          >
            <Icon size={16} />
            {SCENARIO_LABELS[key]}
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
