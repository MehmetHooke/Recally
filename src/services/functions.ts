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

export async function generateCards(text: string, title: string) {
  const fn = httpsCallable<
    { text: string; title: string },
    GenerateCardsResponse
  >(functions, "generateCards");

  const result = await fn({ text, title });
  return result.data;
}

// Every create method has a different function for clarity.
export async function generateCardsYoutube(youtubeUrl: string) {
  const fn = httpsCallable<
    { youtubeUrl: string },
    GenerateCardsYoutubeResponse
  >(functions, "generateCardsYoutube", {
    timeout: 300000, // 300 saniye = 5 dakika
  });

  const result = await fn({ youtubeUrl });
  return result.data;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Request timeout"));
    }, ms);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}
