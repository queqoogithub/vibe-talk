// ─── Core Types ────────────────────────────────────────────

export type Scenario =
  | "ordering-food"
  | "job-interview"
  | "hotel-checkin"
  | "small-talk"
  | "shopping"
  | "travel-directions"
  | "doctor-visit"
  | "free-talk";

export const SCENARIO_LABELS: Record<Scenario, string> = {
  "ordering-food": "สั่งอาหาร",
  "job-interview": "สัมภาษณ์งาน",
  "hotel-checkin": "เช็คอินโรงแรม",
  "small-talk": "Small Talk",
  shopping: "ช้อปปิ้ง",
  "travel-directions": "ถามทาง",
  "doctor-visit": "ไปหาหมอ",
  "free-talk": "คุยอิสระ",
};

export const SCENARIO_SYSTEM_PROMPTS: Record<Scenario, string> = {
  "ordering-food": `You are a friendly waiter/waitress at a restaurant.
- Greet the user and ask for their order naturally.
- Ask follow-up questions (drinks, sides, dessert, how they'd like their food cooked).
- If the user makes a grammar mistake, correct it gently in your response by showing the corrected version in parentheses.
- Keep the conversation flowing naturally.`,

  "job-interview": `You are a hiring manager conducting a job interview.
- Ask common interview questions one at a time.
- Give the user time to respond, then ask a follow-up or the next question.
- If the user makes a grammar mistake, provide gentle correction in your response.
- Keep a professional but friendly tone.`,

  "hotel-checkin": `You are a front desk receptionist at a hotel.
- Welcome the guest and go through the check-in process.
- Ask about reservation details, ID, payment method naturally.
- If the user makes a grammar mistake, correct it gently.
- Be polite and helpful.`,

  "small-talk": `You are a friendly person making small talk.
- Start with casual topics (weather, hobbies, weekend plans, movies, music).
- Keep the conversation light and fun.
- If the user makes a grammar mistake, casually show the correct version.
- Be warm and encouraging.`,

  shopping: `You are a helpful shop assistant in a clothing/accessories store.
- Help the user find what they're looking for.
- Ask about size, color, style preferences.
- If the user makes a grammar mistake, correct it gently.
- Be friendly and patient.`,

  "travel-directions": `You are a helpful local giving directions to a tourist.
- The user asks how to get somewhere.
- Give clear directions, suggest public transport or walking routes.
- If the user makes a grammar mistake, correct it gently.
- Be friendly and informative.`,

  "doctor-visit": `You are a doctor at a clinic.
- Ask the patient about their symptoms naturally.
- Ask follow-up medical questions.
- Give advice or a simple diagnosis.
- If the user makes a grammar mistake, correct it gently.
- Keep a caring, professional tone.`,

  "free-talk": `You are a friendly conversation partner helping the user practice English.
- Chat about any topic the user brings up.
- If the user makes a grammar mistake, gently show the corrected version in your response.
- Be encouraging, supportive, and fun to talk with.
- Occasionally suggest new conversation topics to keep things interesting.`,
};

// ─── Message Types ─────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  corrections?: GrammarCorrection[];
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
  errorType: ErrorType;
}

export type ErrorType =
  | "tense"
  | "preposition"
  | "article"
  | "word-order"
  | "word-choice"
  | "subject-verb-agreement"
  | "plural"
  | "spelling"
  | "other";

export const ERROR_TYPE_LABELS: Record<ErrorType, string> = {
  tense: "Tense (กาล)",
  preposition: "Preposition (คำบุพบท)",
  article: "Article (a/an/the)",
  "word-order": "Word Order (ลำดับคำ)",
  "word-choice": "Word Choice (การเลือกคำ)",
  "subject-verb-agreement": "S-V Agreement",
  plural: "Plural (พหูพจน์)",
  spelling: "Spelling (การสะกด)",
  other: "Other (อื่นๆ)",
};

// ─── Conversation Session ──────────────────────────────────

export interface ConversationSession {
  id: string;
  scenario: Scenario;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  handoffContext?: string; // engineering handoff summary
}

// ─── Error Stats ───────────────────────────────────────────

export interface ErrorStat {
  errorType: ErrorType;
  count: number;
  examples: string[];
}

export interface ErrorDashboard {
  totalErrors: number;
  totalConversations: number;
  errorBreakdown: ErrorStat[];
  lastUpdated: number;
}

// ─── Vocabulary ────────────────────────────────────────────

export interface VocabWord {
  word: string;
  phonetic: string;
  thaiMeaning: string;
  partOfSpeech: string;
  examples: string[];
  category: VocabCategory;
}

export type VocabCategory =
  | "daily-life"
  | "food-drink"
  | "travel"
  | "work-business"
  | "health"
  | "education"
  | "technology"
  | "emotions"
  | "nature"
  | "shopping"
  | "people"
  | "time";

export const VOCAB_CATEGORY_LABELS: Record<VocabCategory, string> = {
  "daily-life": "ชีวิตประจำวัน",
  "food-drink": "อาหาร & เครื่องดื่ม",
  travel: "ท่องเที่ยว",
  "work-business": "งาน & ธุรกิจ",
  health: "สุขภาพ",
  education: "การศึกษา",
  technology: "เทคโนโลยี",
  emotions: "อารมณ์ & ความรู้สึก",
  nature: "ธรรมชาติ",
  shopping: "ช้อปปิ้ง",
  people: "ผู้คน & ความสัมพันธ์",
  time: "เวลา",
};
