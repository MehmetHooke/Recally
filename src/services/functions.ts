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
//every create method have different func to provide clearity
export async function generateCardsYoutube(youtubeUrl: string) {
  const fn = httpsCallable<{ youtubeUrl: string }, GenerateCardsResponse>(
    functions,
    "generateCardsYoutube",
  );

  const result = await fn({ youtubeUrl });
  return result.data;
}
