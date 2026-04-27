import {
    collection,
    doc,
    getDocs,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export type SetComputedStats = {
  totalCards: number;
  dueCount: number;
  masteredCount: number;
  learningCount: number;
  newCount: number;
  reviewedCount: number;
  progress: number;
  reviewProgress: number;
};
export async function recomputeSetStats(
  setId: string,
): Promise<SetComputedStats> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Kullanıcı bulunamadı");
  }

  const cardsRef = collection(db, "users", user.uid, "sets", setId, "cards");
  const snapshot = await getDocs(cardsRef);

  const now = new Date();

  let dueCount = 0;
  let masteredCount = 0;
  let learningCount = 0;
  let newCount = 0;

  snapshot.docs.forEach((docSnap) => {
    const data = docSnap.data();

    const status = data.status ?? "new";
    const nextReviewAt = data.nextReviewAt as Timestamp | null;

    if (nextReviewAt && nextReviewAt.toDate() <= now) {
      dueCount += 1;
    }

    if (status === "mastered") {
      masteredCount += 1;
    } else if (status === "new") {
      newCount += 1;
    } else {
      learningCount += 1;
    }
  });

  const totalCards = snapshot.docs.length;
  const reviewedCount = Math.max(totalCards - dueCount, 0);

  const progress =
    totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;

  const reviewProgress =
    totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

  const setRef = doc(db, "users", user.uid, "sets", setId);

  await updateDoc(setRef, {
    totalCards,
    cardCount: totalCards,
    dueCount,
    masteredCount,
    reviewedCount,
    reviewProgress,
    learningCount,
    newCount,
    progress,
    updatedAt: Timestamp.now(),
  });

  return {
    totalCards,
    dueCount,
    masteredCount,
    reviewedCount,
    reviewProgress,
    learningCount,
    newCount,
    progress,
  };
}
