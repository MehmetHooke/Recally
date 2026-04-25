import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export type GeneratedSummary = {
  overview: string;
  sections: {
    title: string;
    description: string;
    bullets: string[];
  }[];
  keyTakeaways: string[];
};

export type GeneratedTextCard = {
  question: string;
  answer: string;
  explanation: string;
};

export type GeneratedMcqCard = {
  question: string;
  options: string[];
  correctIndex: number;
  answer: string;
  explanation: string;
  wrongExplanations: string[];
};

export type GenerateCardsResponse = {
  ok: boolean;
  title: string;
  summary: string;
  keyConcepts: string[];
  cards: GeneratedTextCard[];
};

export type GenerateCardsYoutubeResponse = {
  ok: boolean;
  error?: string;
  title: string;
  summary: GeneratedSummary;
  keyConcepts: string[];
  cards: GeneratedMcqCard[];
};

export type CreateYoutubeSetJobResponse = {
  ok: boolean;
  setId: string;
};

function logCallableError(functionName: string, error: unknown, payload?: unknown) {
  console.error(`[functions] ${functionName} failed`, {
    payload,
    error,
    message: error instanceof Error ? error.message : String(error),
    code:
      typeof error === "object" && error !== null && "code" in error
        ? (error as { code?: unknown }).code
        : undefined,
    details:
      typeof error === "object" && error !== null && "details" in error
        ? (error as { details?: unknown }).details
        : undefined,
  });
}

export async function generateCards(text: string, title: string) {
  const fn = httpsCallable<
    { text: string; title: string },
    GenerateCardsResponse
  >(functions, "generateCards");

  try {
    const result = await fn({ text, title });
    return result.data;
  } catch (error) {
    logCallableError("generateCards", error, { title });
    throw error;
  }
}

export async function generateCardsYoutube(youtubeUrl: string) {
  const fn = httpsCallable<
    { youtubeUrl: string },
    GenerateCardsYoutubeResponse
  >(functions, "generateCardsYoutube", {
    timeout: 300000,
  });

  try {
    const result = await fn({ youtubeUrl });
    return result.data;
  } catch (error) {
    logCallableError("generateCardsYoutube", error, { youtubeUrl });
    throw error;
  }
}

export async function createYoutubeSetJob(youtubeUrl: string) {
  const fn = httpsCallable<
    { youtubeUrl: string },
    CreateYoutubeSetJobResponse
  >(functions, "createYoutubeSetJob", {
    timeout: 300000,
  });

  try {
    console.log("[functions] createYoutubeSetJob start", { youtubeUrl });
    const result = await fn({ youtubeUrl });
    console.log("[functions] createYoutubeSetJob success", result.data);
    return result.data;
  } catch (error) {
    logCallableError("createYoutubeSetJob", error, { youtubeUrl });
    throw error;
  }
}
