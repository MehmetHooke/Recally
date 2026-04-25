import type { GeneratedSummary } from "@/src/services/functions";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "./firebase";

type SourceType = "text" | "youtube";

type GeneratedCard = {
  question: string;
  answer: string;
  explanation: string;

  // MCQ alanları — text kartlarda opsiyonel
  options?: string[];
  correctIndex?: number;
  wrongExplanations?: string[];
};

type SaveGeneratedSetInput = {
  title: string;
  sourceType?: SourceType;
  sourceText: string;
  summary: string | GeneratedSummary;
  keyConcepts: string[];
  cards: GeneratedCard[];
};

export async function saveGeneratedSet({
  title,
  sourceType = "text",
  sourceText,
  summary,
  keyConcepts,
  cards,
}: SaveGeneratedSetInput) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Kullanıcı bulunamadı");
  }

  const now = Timestamp.now();

  const setsRef = collection(db, "users", user.uid, "sets");

  const setDocRef = await addDoc(setsRef, {
    title,
    sourceType,
    sourceText,
    summary,
    keyConcepts,
    totalCards: cards.length,
    masteredCount: 0,
    dueCount: cards.length,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const batch = writeBatch(db);

  cards.forEach((card) => {
    const cardRef = doc(
      collection(db, "users", user.uid, "sets", setDocRef.id, "cards"),
    );

    const isMcq =
      Array.isArray(card.options) &&
      card.options.length === 4 &&
      typeof card.correctIndex === "number";

    const answer =
      isMcq && card.options && typeof card.correctIndex === "number"
        ? card.options[card.correctIndex]
        : card.answer;

    batch.set(cardRef, {
      question: card.question,
      answer,
      explanation: card.explanation,

      // MCQ için gerekli alanlar
      options: isMcq ? card.options : [],
      correctIndex: isMcq ? card.correctIndex : null,
      wrongExplanations: Array.isArray(card.wrongExplanations)
        ? card.wrongExplanations
        : [],

      cardType: isMcq ? "mcq" : "basic",
      status: "new",

      intervalDays: 0,
      reviewCount: 0,
      knewCount: 0,
      forgotCount: 0,

      lastReviewedAt: null,
      nextReviewAt: now,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();

  return setDocRef.id;
}
