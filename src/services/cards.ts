import {
  Timestamp,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { addDays, getNextIntervalAfterKnew } from "../utils/review";
import { auth, db } from "./firebase";
import { recomputeSetStats } from "./statsService";

export type ReviewCard = {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  status?: string;
  intervalDays?: number;
  reviewCount?: number;
  knewCount?: number;
  forgotCount?: number;
  lastReviewedAt?: Timestamp | null;
  nextReviewAt?: Timestamp | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

function getCardsCollection(setId: string) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Kullanıcı bulunamadı");
  }

  return collection(db, "users", user.uid, "sets", setId, "cards");
}

function getCardDocRef(setId: string, cardId: string) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Kullanıcı bulunamadı");
  }

  return doc(db, "users", user.uid, "sets", setId, "cards", cardId);
}

export async function getDueCards(setId: string): Promise<ReviewCard[]> {
  const cardsRef = getCardsCollection(setId);

  const now = Timestamp.now();

  const q = query(
    cardsRef,
    where("nextReviewAt", "<=", now),
    orderBy("nextReviewAt", "asc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<ReviewCard, "id">),
  }));
}

export async function markCardKnew(setId: string, card: ReviewCard) {
  const cardRef = getCardDocRef(setId, card.id);

  const now = new Date();
  const newReviewCount = (card.reviewCount ?? 0) + 1;
  const newKnewCount = (card.knewCount ?? 0) + 1;
  const intervalDays = getNextIntervalAfterKnew(newReviewCount);
  const nextReviewDate = addDays(now, intervalDays);

  const nextStatus =
    intervalDays >= 7 && newKnewCount >= 3 ? "mastered" : "learning";

  await updateDoc(cardRef, {
    status: nextStatus,
    reviewCount: newReviewCount,
    knewCount: newKnewCount,
    intervalDays,
    lastReviewedAt: Timestamp.fromDate(now),
    nextReviewAt: Timestamp.fromDate(nextReviewDate),
    updatedAt: Timestamp.fromDate(now),
  });

  await recomputeSetStats(setId);
}

export async function markCardForgot(setId: string, card: ReviewCard) {
  const cardRef = getCardDocRef(setId, card.id);

  const now = new Date();
  const newReviewCount = (card.reviewCount ?? 0) + 1;
  const newForgotCount = (card.forgotCount ?? 0) + 1;
  const intervalDays = 1;
  const nextReviewDate = addDays(now, intervalDays);

  await updateDoc(cardRef, {
    status: "learning",
    reviewCount: newReviewCount,
    forgotCount: newForgotCount,
    intervalDays,
    lastReviewedAt: Timestamp.fromDate(now),
    nextReviewAt: Timestamp.fromDate(nextReviewDate),
    updatedAt: Timestamp.fromDate(now),
  });

  await recomputeSetStats(setId);
}
