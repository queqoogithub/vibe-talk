import { openDB, IDBPDatabase } from "idb";
import type {
  ConversationSession,
  ErrorDashboard,
  ErrorStat,
  ErrorType,
  UserVocabWord,
} from "./types";

const DB_NAME = "vibe-talk-db";
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("conversations")) {
          const convStore = db.createObjectStore("conversations", {
            keyPath: "id",
          });
          convStore.createIndex("updatedAt", "updatedAt");
        }
        if (!db.objectStoreNames.contains("errorDashboard")) {
          db.createObjectStore("errorDashboard", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("vocabProgress")) {
          db.createObjectStore("vocabProgress", { keyPath: "word" });
        }
        if (!db.objectStoreNames.contains("userVocab")) {
          db.createObjectStore("userVocab", { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}

// ─── Conversations ─────────────────────────────────────────

export async function saveConversation(
  session: ConversationSession,
): Promise<void> {
  const db = await getDB();
  await db.put("conversations", { ...session, updatedAt: Date.now() });
}

export async function getConversation(
  id: string,
): Promise<ConversationSession | undefined> {
  const db = await getDB();
  return db.get("conversations", id);
}

export async function getAllConversations(): Promise<ConversationSession[]> {
  const db = await getDB();
  const all = await db.getAll("conversations");
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function deleteConversation(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("conversations", id);
}

// ─── Error Dashboard ───────────────────────────────────────

const DASHBOARD_KEY = "main";

export async function getErrorDashboard(): Promise<ErrorDashboard> {
  const db = await getDB();
  const existing = await db.get("errorDashboard", DASHBOARD_KEY);
  if (existing) return existing;
  const fresh: ErrorDashboard = {
    totalErrors: 0,
    totalConversations: 0,
    errorBreakdown: [],
    lastUpdated: Date.now(),
  };
  await db.put("errorDashboard", { ...fresh, id: DASHBOARD_KEY });
  return fresh;
}

export async function trackError(
  errorType: ErrorType,
  example: string,
): Promise<void> {
  const db = await getDB();
  const dashboard = await getErrorDashboard();

  dashboard.totalErrors++;
  dashboard.lastUpdated = Date.now();

  const existing = dashboard.errorBreakdown.find(
    (e) => e.errorType === errorType,
  );
  if (existing) {
    existing.count++;
    if (!existing.examples.includes(example) && existing.examples.length < 10) {
      existing.examples.push(example);
    }
  } else {
    dashboard.errorBreakdown.push({
      errorType,
      count: 1,
      examples: [example],
    });
  }

  dashboard.errorBreakdown.sort((a, b) => b.count - a.count);
  await db.put("errorDashboard", { ...dashboard, id: DASHBOARD_KEY });
}

export async function incrementConversationCount(): Promise<void> {
  const db = await getDB();
  const dashboard = await getErrorDashboard();
  dashboard.totalConversations++;
  dashboard.lastUpdated = Date.now();
  await db.put("errorDashboard", { ...dashboard, id: DASHBOARD_KEY });
}

export async function resetErrorDashboard(): Promise<void> {
  const db = await getDB();
  const fresh: ErrorDashboard = {
    totalErrors: 0,
    totalConversations: 0,
    errorBreakdown: [],
    lastUpdated: Date.now(),
  };
  await db.put("errorDashboard", { ...fresh, id: DASHBOARD_KEY });
}

// ─── Handoff Context ───────────────────────────────────────

/**
 * Generates a handoff summary from conversation messages.
 * This stores the last few messages + key context so the AI
 * can resume with full awareness of the conversation history.
 */
export function generateHandoffSummary(session: ConversationSession): string {
  const recentMessages = session.messages.slice(-6);
  const summary = recentMessages
    .map((m) => `[${m.role}]: ${m.content}`)
    .join("\n");
  return `Previous conversation (${session.scenario}):\n${summary}`;
}

// ─── Vocab Progress ────────────────────────────────────────

export interface VocabProgress {
  word: string;
  mastered: boolean;
  lastReviewed: number;
  reviewCount: number;
}

export async function getVocabProgress(
  word: string,
): Promise<VocabProgress | undefined> {
  const db = await getDB();
  return db.get("vocabProgress", word);
}

export async function markWordMastered(word: string): Promise<void> {
  const db = await getDB();
  const existing = await getVocabProgress(word);
  await db.put("vocabProgress", {
    word,
    mastered: true,
    lastReviewed: Date.now(),
    reviewCount: (existing?.reviewCount ?? 0) + 1,
  });
}

export async function markWordUnmastered(word: string): Promise<void> {
  const db = await getDB();
  await db.put("vocabProgress", {
    word,
    mastered: false,
    lastReviewed: Date.now(),
    reviewCount: 0,
  });
}

export async function getAllVocabProgress(): Promise<VocabProgress[]> {
  const db = await getDB();
  return db.getAll("vocabProgress");
}

// ─── User Vocab ─────────────────────────────────────────────

export async function addUserWord(
  word: Omit<UserVocabWord, "id" | "createdAt">,
): Promise<UserVocabWord> {
  const db = await getDB();
  const newWord: UserVocabWord = {
    ...word,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  await db.put("userVocab", newWord);
  return newWord;
}

export async function updateUserWord(word: UserVocabWord): Promise<void> {
  const db = await getDB();
  await db.put("userVocab", word);
}

export async function deleteUserWord(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("userVocab", id);
}

export async function getAllUserWords(): Promise<UserVocabWord[]> {
  const db = await getDB();
  const all = await db.getAll("userVocab");
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getUserWord(
  id: string,
): Promise<UserVocabWord | undefined> {
  const db = await getDB();
  return db.get("userVocab", id);
}
