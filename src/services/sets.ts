import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    writeBatch,
} from "firebase/firestore";
import { auth, db } from "./firebase";

type GeneratedCard = {
  question: string;
  answer: string;
  explanation: string;
};

type SaveGeneratedSetInput = {
  title: string;
  sourceText: string;
  summary: string;
  keyConcepts: string[];
  cards: GeneratedCard[];
};

export async function saveGeneratedSet({
  title,
  sourceText,
  summary,
  keyConcepts,
  cards,
}: SaveGeneratedSetInput) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Kullanıcı bulunamadı");
  }

  const setsRef = collection(db, "users", user.uid, "sets");

  const setDocRef = await addDoc(setsRef, {
    title,
    sourceType: "text",
    sourceText,
    summary,
    keyConcepts,
    totalCards: cards.length,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const batch = writeBatch(db);

  cards.forEach((card) => {
    const cardRef = doc(
      collection(db, "users", user.uid, "sets", setDocRef.id, "cards"),
    );

    batch.set(cardRef, {
      question: card.question,
      answer: card.answer,
      explanation: card.explanation,
      status: "new",
      intervalDays: 0,
      reviewCount: 0,
      knewCount: 0,
      forgotCount: 0,
      lastReviewedAt: null,
      nextReviewAt: null,
      createdAt: serverTimestamp(),
    });
  });

  await batch.commit();

  return setDocRef.id;
}
