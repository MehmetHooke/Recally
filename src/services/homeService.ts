import {
    collection,
    getDocs,
    orderBy,
    query,
    Timestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export type HomeRecentSet = {
  id: string;
  title: string;
  sourceType: string;
  sourceText: string;
  totalCards?: number;
  dueCount?: number;
};

export type HomeDashboardData = {
  dueTodayCount: number;
  totalSets: number;
  totalCards: number;
  recentSets: HomeRecentSet[];
  streakCount: number;
};

export async function getHomeDashboardData(): Promise<HomeDashboardData> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Kullanıcı bulunamadı");
  }

  const setsRef = collection(db, "users", user.uid, "sets");
  const setsQuery = query(setsRef, orderBy("createdAt", "desc"));
  const setsSnapshot = await getDocs(setsQuery);

  const sets = setsSnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as HomeRecentSet[];

  let totalCards = 0;
  let dueTodayCount = 0;

  const now = new Date();

  for (const set of sets) {
    totalCards += set.totalCards ?? 0;

    const cardsRef = collection(db, "users", user.uid, "sets", set.id, "cards");
    const cardsSnapshot = await getDocs(cardsRef);

    cardsSnapshot.docs.forEach((cardDoc) => {
      const data = cardDoc.data();
      const nextReviewAt = data.nextReviewAt as Timestamp | null;

      if (nextReviewAt && nextReviewAt.toDate() <= now) {
        dueTodayCount += 1;
      }
    });
  }

  return {
    dueTodayCount,
    totalSets: sets.length,
    totalCards,
    recentSets: sets.slice(0, 5),
    streakCount: 0,
  };
}
