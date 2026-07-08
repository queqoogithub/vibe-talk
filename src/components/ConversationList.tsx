"use client";

import type { ConversationSession } from "@/lib/types";
import { SCENARIO_LABELS } from "@/lib/types";
import { MessageSquare, Trash2, ArrowRightCircle } from "lucide-react";

interface Props {
  sessions: ConversationSession[];
  currentSessionId: string | null;
  onSelect: (session: ConversationSession) => void;
  onDelete: (id: string) => void;
  onNewChat: () => void;
}

export default function ConversationList({
  sessions,
  currentSessionId,
  onSelect,
  onDelete,
  onNewChat,
}: Props) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare
          size={40}
          className="mx-auto text-pastel-text-light/30 mb-3"
        />
        <p className="text-sm text-pastel-text-light">ยังไม่มีบทสนทนา</p>
        <p className="text-xs text-pastel-text-light/60 mt-1">
          เริ่มแชทใหม่เพื่อฝึกภาษา!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sessions.map((session) => {
        const isActive = session.id === currentSessionId;
        const msgCount = session.messages.length;
        const lastMsg =
          session.messages.length > 0
            ? session.messages[session.messages.length - 1].content.slice(0, 40)
            : "";

        return (
          <div
            key={session.id}
            className={`group relative flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-pastel-blue-light/60 border border-pastel-blue/30"
                : "bg-white border border-pastel-border hover:bg-pastel-cream/50"
            }`}
            onClick={() => onSelect(session)}
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-pastel-pink-light flex items-center justify-center">
              <MessageSquare size={18} className="text-pastel-pink-dark" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-pastel-pink-dark bg-pastel-pink-light px-2 py-0.5 rounded-full">
                  {SCENARIO_LABELS[session.scenario]?.split(" ")[0]}
                </span>
                <span className="text-xs text-pastel-text-light">
                  {msgCount} msgs
                </span>
              </div>
              <p className="text-sm text-pastel-text truncate mt-1">
                {session.title || lastMsg || "New conversation"}
              </p>
              <p
                className="text-[10px] text-pastel-text-light mt-0.5"
                suppressHydrationWarning
              >
                {new Date(session.updatedAt).toLocaleDateString("th-TH", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Resume indicator */}
            {isActive && (
              <ArrowRightCircle
                size={18}
                className="text-pastel-blue-dark flex-shrink-0"
              />
            )}

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(session.id);
              }}
              className="p-1.5 rounded-lg hover:bg-red-50 text-pastel-text-light hover:text-red-400 transition-colors sm:opacity-0 sm:group-hover:opacity-100 flex-shrink-0"
              title="ลบบทสนทนา"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
