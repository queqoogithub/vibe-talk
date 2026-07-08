"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { Scenario, ChatMessage, ConversationSession, GrammarCorrection } from "@/lib/types";
import { sendMessage, hasApiKey, generateAIHandoffSummary } from "@/lib/deepseek";
import {
  saveConversation,
  getConversation,
  getAllConversations,
  deleteConversation,
  incrementConversationCount,
  trackError,
  generateHandoffSummary,
} from "@/lib/db";

export function useConversation(sessionId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [scenario, setScenario] = useState<Scenario>("free-talk");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    sessionId || null
  );
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [handoffContext, setHandoffContext] = useState<string | undefined>();
  const loadedRef = useRef(false);

  // Load all sessions list
  const refreshSessions = useCallback(async () => {
    const all = await getAllConversations();
    setSessions(all);
  }, []);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  // Load a specific session
  const loadSession = useCallback(async (id: string) => {
    const session = await getConversation(id);
    if (session) {
      setMessages(session.messages);
      setScenario(session.scenario);
      setCurrentSessionId(session.id);
      setHandoffContext(session.handoffContext);
    }
  }, []);

  // Auto-load session on mount
  useEffect(() => {
    if (sessionId && !loadedRef.current) {
      loadedRef.current = true;
      loadSession(sessionId);
    }
  }, [sessionId, loadSession]);

  const createNewSession = useCallback(
    async (scenarioType: Scenario) => {
      // Auto-save current session before creating new one
      if (currentSessionId && messages.length > 0) {
        await saveCurrentSession();
      }
      setMessages([]);
      setScenario(scenarioType);
      setHandoffContext(undefined);
      const newId = `session_${Date.now()}`;
      setCurrentSessionId(newId);
      await incrementConversationCount();
      await refreshSessions();
    },
    [currentSessionId, messages, refreshSessions]
  );

  const saveCurrentSession = useCallback(async () => {
    if (!currentSessionId || messages.length === 0) return;
    const existing = await getConversation(currentSessionId);
    const title =
      existing?.title ||
      messages.find((m) => m.role === "user")?.content.slice(0, 50) ||
      "Untitled";
    const session: ConversationSession = {
      id: currentSessionId,
      scenario,
      title,
      messages,
      createdAt: existing?.createdAt || Date.now(),
      updatedAt: Date.now(),
      handoffContext,
    };
    await saveConversation(session);
  }, [currentSessionId, scenario, messages, handoffContext]);

  const sendUserMessage = useCallback(
    async (content: string) => {
      if (!hasApiKey()) {
        throw new Error("Please set your DeepSeek API key in Settings first.");
      }

      const userMsg: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        role: "user",
        content,
        timestamp: Date.now(),
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setIsLoading(true);

      try {
        const response = await sendMessage(scenario, updatedMessages, handoffContext);
        const newMessages = [...updatedMessages, response.message];
        setMessages(newMessages);

        // Track errors
        if (response.message.corrections) {
          for (const correction of response.message.corrections) {
            await trackError(correction.errorType, correction.original);
          }
        }

        // Auto-save to DB
        if (currentSessionId) {
          const existing = await getConversation(currentSessionId);
          const title =
            existing?.title || content.slice(0, 50);
          const session: ConversationSession = {
            id: currentSessionId,
            scenario,
            title,
            messages: newMessages,
            createdAt: existing?.createdAt || Date.now(),
            updatedAt: Date.now(),
            handoffContext,
          };
          await saveConversation(session);
          await refreshSessions();
        }
      } catch (err) {
        console.error("Failed to send message:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [messages, scenario, handoffContext, currentSessionId, refreshSessions]
  );

  const generateHandoff = useCallback(async () => {
    if (messages.length === 0) return;
    setIsLoading(true);
    try {
      const summary = await generateAIHandoffSummary(scenario, messages);
      setHandoffContext(summary);
      // Update session with handoff
      if (currentSessionId) {
        const session = await getConversation(currentSessionId);
        if (session) {
          session.handoffContext = summary;
          await saveConversation(session);
          await refreshSessions();
        }
      }
      return summary;
    } finally {
      setIsLoading(false);
    }
  }, [messages, scenario, currentSessionId, refreshSessions]);

  const resumeSession = useCallback(
    (session: ConversationSession) => {
      loadSession(session.id);
    },
    [loadSession]
  );

  const deleteSession = useCallback(
    async (id: string) => {
      await deleteConversation(id);
      if (currentSessionId === id) {
        setMessages([]);
        setCurrentSessionId(null);
        setHandoffContext(undefined);
      }
      await refreshSessions();
    },
    [currentSessionId, refreshSessions]
  );

  return {
    messages,
    scenario,
    setScenario,
    isLoading,
    currentSessionId,
    sessions,
    handoffContext,
    sendUserMessage,
    createNewSession,
    saveCurrentSession,
    generateHandoff,
    resumeSession,
    deleteSession,
    loadSession,
    refreshSessions,
  };
}
