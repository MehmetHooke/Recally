import type { GeneratedSummary } from "@/src/services/functions";
import type { StudySet } from "@/src/types/study-set";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export type SetItem = StudySet;

export type SetCardsStats = {
  totalCards: number;
  dueCards: number;
};

export function normalizeSetItem(
  id: string,
  data: Partial<Omit<SetItem, "id">>,
): SetItem {
  const cards = Array.isArray(data.cards) ? data.cards : [];
  const keyConcepts = Array.isArray(data.keyConcepts) ? data.keyConcepts : [];
  const cardCount =
    typeof data.cardCount === "number"
      ? data.cardCount
      : typeof data.totalCards === "number"
        ? data.totalCards
        : cards.length;

  return {
    id,
    title: data.title || "Untitled",
    sourceType: data.sourceType || "text",
    sourceText: data.sourceText || "",
    status: data.status || "completed",
    summary: data.summary ?? null,
    keyConcepts,
    cards,
    cardCount,
    totalCards:
      typeof data.totalCards === "number" ? data.totalCards : cardCount,
    masteredCount: data.masteredCount ?? 0,
    dueCount: data.dueCount ?? 0,
    learningCount: data.learningCount ?? 0,
    newCount: data.newCount ?? 0,
    progress: data.progress ?? 0,
    reviewedCount: data.reviewedCount ?? 0,
    reviewProgress: data.reviewProgress ?? 0,
    errorMessage: data.errorMessage ?? null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    completedAt: data.completedAt,
    failedAt: data.failedAt,
  };
}

export function getSummaryPreview(summary?: string | GeneratedSummary | null) {
  if (!summary) return "";

  if (typeof summary === "string") {
    return summary;
  }

  return summary.overview || "";
}

export async function getSets(): Promise<SetItem[]> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Kullanıcı giriş yapmamış.");
  }

  const setsRef = collection(db, "users", user.uid, "sets");
  const q = query(setsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) =>
    normalizeSetItem(docSnap.id, docSnap.data() as Omit<SetItem, "id">),
  );
}

export async function getSetById(setId: string): Promise<SetItem | null> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Kullanıcı giriş yapmamış.");
  }

  const setRef = doc(db, "users", user.uid, "sets", setId);
  const snapshot = await getDoc(setRef);

  if (!snapshot.exists()) {
    return null;
  }

  return normalizeSetItem(snapshot.id, snapshot.data() as Omit<SetItem, "id">);
}

export async function getSetCardsStats(setId: string): Promise<SetCardsStats> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Kullanıcı giriş yapmamış.");
  }

  const cardsRef = collection(db, "users", user.uid, "sets", setId, "cards");
  const snapshot = await getDocs(cardsRef);

  const now = new Date();
  let dueCards = 0;

  snapshot.docs.forEach((docSnap) => {
    const data = docSnap.data();
    const nextReviewAt = data.nextReviewAt as Timestamp | null;

    if (nextReviewAt && nextReviewAt.toDate() <= now) {
      dueCards += 1;
    }
  });

  return {
    totalCards: snapshot.docs.length,
    dueCards,
  };
}
