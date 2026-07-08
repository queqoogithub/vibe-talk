import OpenAI from "openai";
import type {
  Scenario,
  ChatMessage,
  GrammarCorrection,
  ErrorType,
} from "./types";
import { SCENARIO_SYSTEM_PROMPTS } from "./types";

function getClient(): OpenAI {
  const apiKey =
    typeof window !== "undefined"
      ? localStorage.getItem("deepseek-api-key") || ""
      : "";

  return new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey,
    dangerouslyAllowBrowser: true,
  });
}

export function hasApiKey(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("deepseek-api-key");
}

export function setApiKey(key: string): void {
  localStorage.setItem("deepseek-api-key", key);
}

export function getApiKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("deepseek-api-key") || "";
}

// ─── Vocab Inference ───────────────────────────────────────

export interface InferredWord {
  phonetic: string;
  thaiMeaning: string;
  partOfSpeech: string;
  category: string;
  examples: string[];
}

export async function inferWordInfo(word: string): Promise<InferredWord> {
  const client = getClient();

  const completion = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an English vocabulary assistant. Given an English word, return structured information in JSON format.

Return ONLY a valid JSON object (no markdown, no extra text) with these fields:
- phonetic: IPA pronunciation (e.g. "/ˈhæpi/")
- thaiMeaning: meaning in Thai language
- partOfSpeech: part of speech abbreviation (e.g. "n.", "v.", "adj.", "adv.", "prep.", "conj.")
- category: one of ["daily-life", "food-drink", "travel", "work-business", "health", "education", "technology", "emotions", "nature", "shopping", "people", "time", "general"]
- examples: array of 2-3 example sentences using the word

Example output:
{"phonetic":"/ˈhæpi/","thaiMeaning":"มีความสุข","partOfSpeech":"adj.","category":"emotions","examples":["She looks very happy today.","I'm happy to help you."]}`,
      },
      {
        role: "user",
        content: `Word: ${word}`,
      },
    ],
    model: "deepseek-chat",
    stream: false,
    temperature: 0.3,
  });

  const raw = completion.choices[0]?.message?.content || "";

  // Try to extract JSON from response (handle markdown code blocks)
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Could not parse AI response");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    phonetic: parsed.phonetic || "/—/",
    thaiMeaning: parsed.thaiMeaning || "",
    partOfSpeech: parsed.partOfSpeech || "—",
    category: parsed.category || "general",
    examples: Array.isArray(parsed.examples) ? parsed.examples : [],
  };
}

// ─── System Prompt Builder ─────────────────────────────────

function buildSystemPrompt(
  scenario: Scenario,
  handoffContext?: string,
): string {
  const baseGrammarInstructions = `
IMPORTANT GRAMMAR CORRECTION RULES:
After EVERY user message, you MUST analyze their grammar. If there are any mistakes (tense, preposition, article, word order, word choice, S-V agreement, plural, spelling), you must:
1. First, give your normal conversational response.
2. Then, at the END of your response, add a section wrapped in <correction> tags:

<correction>
[{"original": "what they wrote wrong", "corrected": "the correct version", "explanation": "brief explanation in Thai", "errorType": "tense|preposition|article|word-order|word-choice|subject-verb-agreement|plural|spelling|other"}]
</correction>

If there are NO mistakes, include: <correction>[]</correction>

Always wrap the correction in valid JSON array format. The errorType must be one of: tense, preposition, article, word-order, word-choice, subject-verb-agreement, plural, spelling, other.
`;

  const scenarioPrompt = SCENARIO_SYSTEM_PROMPTS[scenario];

  const handoffSection = handoffContext
    ? `\n\nCONVERSATION CONTEXT (previous session):\n${handoffContext}\nPlease continue the conversation naturally from where it left off.`
    : "";

  return `${scenarioPrompt}\n\n${baseGrammarInstructions}${handoffSection}`;
}

// ─── Parse Corrections from AI Response ────────────────────

function parseCorrections(content: string): {
  cleanContent: string;
  corrections: GrammarCorrection[];
} {
  const correctionRegex = /<correction>([\s\S]*?)<\/correction>/;
  const match = content.match(correctionRegex);

  if (!match) {
    return { cleanContent: content, corrections: [] };
  }

  const cleanContent = content.replace(correctionRegex, "").trim();

  try {
    const parsed = JSON.parse(match[1].trim());
    if (Array.isArray(parsed)) {
      return {
        cleanContent,
        corrections: parsed.map((c: any) => ({
          original: c.original || "",
          corrected: c.corrected || "",
          explanation: c.explanation || "",
          errorType: (c.errorType || "other") as ErrorType,
        })),
      };
    }
  } catch {
    // fallback: try to extract corrections manually
  }

  return { cleanContent, corrections: [] };
}

// ─── Chat Completion ───────────────────────────────────────

export interface ChatResponse {
  message: ChatMessage;
}

export async function sendMessage(
  scenario: Scenario,
  messages: ChatMessage[],
  handoffContext?: string,
): Promise<ChatResponse> {
  const client = getClient();

  const systemPrompt = buildSystemPrompt(scenario, handoffContext);

  const apiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  const completion = await client.chat.completions.create({
    messages: apiMessages,
    model: "deepseek-chat",
    stream: false,
  });

  const rawContent = completion.choices[0]?.message?.content || "";
  const { cleanContent, corrections } = parseCorrections(rawContent);

  const assistantMessage: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    role: "assistant",
    content: cleanContent,
    timestamp: Date.now(),
    corrections: corrections.length > 0 ? corrections : undefined,
  };

  return { message: assistantMessage };
}

// ─── Generate Handoff Summary via AI ───────────────────────

export async function generateAIHandoffSummary(
  scenario: Scenario,
  messages: ChatMessage[],
): Promise<string> {
  const client = getClient();

  const conversationText = messages
    .map((m) => `[${m.role}]: ${m.content}`)
    .join("\n");

  const completion = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Summarize this English conversation practice session in 2-3 sentences. Include: what topics were discussed, the user's level, and any notable grammar patterns. Write in English.",
      },
      {
        role: "user",
        content: `Scenario: ${scenario}\n\nConversation:\n${conversationText}`,
      },
    ],
    model: "deepseek-chat",
    stream: false,
  });

  return completion.choices[0]?.message?.content || "";
}
