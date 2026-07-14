"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Send, Loader2 } from "lucide-react";

interface Props {
  onSend: (message: string) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
}

export default function ChatInput({ onSend, isLoading, disabled }: Props) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || disabled) return;
    setInput("");
    await onSend(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 bg-white/70 backdrop-blur-sm border border-pastel-border rounded-2xl p-2 shadow-sm">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="พิมพ์ข้อความภาษาอังกฤษที่นี่..."
        rows={1}
        disabled={isLoading || disabled}
        className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-pastel-text placeholder-pastel-text-light/50 outline-none disabled:opacity-50 max-h-[120px]"
      />
      <button
        onClick={handleSend}
        disabled={!input.trim() || isLoading || disabled}
        className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-primary text-white flex items-center justify-center transition-all duration-200 hover:bg-gradient-primary-dark hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Send size={18} />
        )}
      </button>
    </div>
  );
}
