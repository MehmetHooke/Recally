import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export type GeneratedCard = {
  question: string;
  answer: string;
  explanation: string;
};

export type GenerateCardsResponse = {
  ok: boolean;
  title: string;
  summary: string;
  keyConcepts: string[];
  cards: GeneratedCard[];
};

export async function generateCards(text: string, title: string) {
  const fn = httpsCallable<
    { text: string; title: string },
    GenerateCardsResponse
  >(functions, "generateCards");

  const result = await fn({ text, title });
  return result.data;
}
