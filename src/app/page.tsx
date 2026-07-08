"use client";

import { useState, useEffect, useRef } from "react";
import { useConversation } from "@/hooks/useConversation";
import { hasApiKey } from "@/lib/deepseek";
import type { Scenario } from "@/lib/types";

function useHasApiKey() {
  const [has, setHas] = useState(false);
  useEffect(() => {
    setHas(hasApiKey());
  }, []);
  return has;
}
import ScenarioSelector from "@/components/ScenarioSelector";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import ConversationList from "@/components/ConversationList";
import {
  Sparkles,
  MessageCircle,
  History,
  X,
  ArrowDown,
  AlertTriangle,
  XCircle,
} from "lucide-react";

export default function ChatPage() {
  const {
    messages,
    scenario,
    setScenario,
    isLoading,
    currentSessionId,
    sessions,
    handoffContext,
    sendUserMessage,
    createNewSession,
    generateHandoff,
    resumeSession,
    deleteSession,
  } = useConversation();

  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const hasKey = useHasApiKey();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show scroll-down button when scrolled up
  const handleScroll = () => {
    const el = chatContainerRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setShowScrollButton(!isAtBottom);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (content: string) => {
    setError(null);
    try {
      await sendUserMessage(content);
    } catch (err: any) {
      setError(err.message || "Failed to send message");
    }
  };

  const handleScenarioChange = async (newScenario: Scenario) => {
    // Generate handoff before switching
    if (messages.length > 2) {
      await generateHandoff();
    }
    await createNewSession(newScenario);
  };

  const handleNewSession = async (scenarioType: Scenario) => {
    if (messages.length > 2) {
      await generateHandoff();
    }
    await createNewSession(scenarioType);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-pastel-pink flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gradient">Vibe Talk</h1>
            <p className="text-[10px] text-pastel-text-light">
              AI English Practice
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {handoffContext && (
            <span className="text-[10px] bg-pastel-green-light text-green-700 px-2 py-0.5 rounded-full">
              Session saved
            </span>
          )}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2.5 rounded-xl transition-all ${
              showHistory
                ? "bg-pastel-blue text-white"
                : "bg-white border border-pastel-border text-pastel-text-light hover:bg-pastel-cream"
            }`}
          >
            {showHistory ? <X size={18} /> : <History size={18} />}
          </button>
        </div>
      </div>

      {mounted && !hasKey && (
        <div className="mb-3 p-3 rounded-2xl bg-pastel-yellow-light border border-pastel-yellow/40 text-xs text-pastel-text-light text-center flex items-center justify-center gap-1.5">
          <AlertTriangle size={14} className="text-pastel-yellow" />
          Please set your DeepSeek API key in{" "}
          <a
            href="/settings"
            className="underline font-medium text-pastel-pink-dark"
          >
            Settings
          </a>{" "}
          first.
        </div>
      )}

      {error && (
        <div className="mb-3 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-1.5">
          <XCircle size={14} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Scenario Selector */}
      <ScenarioSelector current={scenario} onSelect={handleScenarioChange} />

      {/* Chat Area or History */}
      {showHistory ? (
        <div className="flex-1 overflow-y-auto mt-3">
          <ConversationList
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSelect={(session) => {
              resumeSession(session);
              setShowHistory(false);
            }}
            onDelete={deleteSession}
            onNewChat={() => handleNewSession("free-talk")}
          />
        </div>
      ) : (
        <>
          {/* Messages */}
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto py-4 space-y-4 relative"
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-16 h-16 rounded-2xl bg-pastel-pink-light flex items-center justify-center mb-4">
                  <MessageCircle size={32} className="text-pastel-pink-dark" />
                </div>
                <h2 className="text-base font-semibold text-pastel-text mb-1">
                  เริ่มฝึกสนทนากันเลย!
                </h2>
                <p className="text-xs text-pastel-text-light max-w-xs">
                  พิมพ์ข้อความภาษาอังกฤษลงไป AI จะตอบกลับ
                  พร้อมตรวจแกรมม่าให้ด้วย
                </p>
              </div>
            )}

            {messages
              .filter((m) => m.role !== "system")
              .map((msg) => (
                <div key={msg.id} className="animate-slide-up">
                  <ChatBubble message={msg} />
                </div>
              ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 px-3">
                <div className="flex gap-1">
                  <span className="typing-dot w-2 h-2 rounded-full bg-pastel-blue-dark"></span>
                  <span className="typing-dot w-2 h-2 rounded-full bg-pastel-blue-dark"></span>
                  <span className="typing-dot w-2 h-2 rounded-full bg-pastel-blue-dark"></span>
                </div>
                <span className="text-xs text-pastel-text-light">
                  AI is typing...
                </span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Scroll to bottom button */}
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-4 right-4 p-2 rounded-full bg-white shadow-lg border border-pastel-border text-pastel-text-light hover:text-pastel-text transition-all z-10"
            >
              <ArrowDown size={18} />
            </button>
          )}

          {/* Input */}
          <div className="pt-2 border-t border-pastel-border/50">
            <ChatInput
              onSend={handleSend}
              isLoading={isLoading}
              disabled={!mounted || !hasKey}
            />
          </div>
        </>
      )}
    </div>
  );
}
