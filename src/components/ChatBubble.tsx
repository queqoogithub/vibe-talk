"use client";

import type { ChatMessage } from "@/lib/types";
import CorrectionCard from "./CorrectionCard";
import { User, Bot } from "lucide-react";

interface Props {
  message: ChatMessage;
}

export default function ChatBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
          isUser ? "bg-pastel-purple text-white" : "bg-pastel-blue text-white"
        }`}
      >
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>

      {/* Content */}
      <div
        className={`flex flex-col gap-2 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-pastel-purple text-white rounded-br-md"
              : "bg-white border border-pastel-border text-pastel-text rounded-bl-md shadow-sm"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        {/* Grammar Corrections */}
        {!isUser && message.corrections && message.corrections.length > 0 && (
          <div className="w-full space-y-2">
            <p className="text-xs font-semibold text-pastel-pink-dark px-1">
              📝 Grammar Tips
            </p>
            {message.corrections.map((correction, idx) => (
              <CorrectionCard key={idx} correction={correction} />
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span
          className="text-[10px] text-pastel-text-light px-1"
          suppressHydrationWarning
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
