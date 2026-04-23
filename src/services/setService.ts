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

export type SetItem = {
  id: string;
  title: string;
  sourceType: "text";
  sourceText: string;
  summary?: string;
  keyConcepts?: string[];
  totalCards?: number;
  masteredCount?: number;
  dueCount?: number;
  createdAt?: any;
  updatedAt?: any;
};

export type SetCardsStats = {
  totalCards: number;
  dueCards: number;
};

export async function getSets(): Promise<SetItem[]> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Kullanıcı giriş yapmamış.");
  }

  const setsRef = collection(db, "users", user.uid, "sets");
  const q = query(setsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<SetItem, "id">),
  }));
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

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<SetItem, "id">),
  };
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
