import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isYesterday(lastDate: Date, today: Date) {
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return isSameDay(lastDate, yesterday);
}

export async function getUserStreakCount() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Kullanıcı bulunamadı");
  }

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) return 0;

  const data = snap.data();
  return typeof data.streakCount === "number" ? data.streakCount : 0;
}

export async function updateReviewStreak() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Kullanıcı bulunamadı");
  }

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  const today = new Date();

  if (!snap.exists()) {
    await setDoc(
      userRef,
      {
        streakCount: 1,
        lastReviewDate: Timestamp.fromDate(today),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    return 1;
  }

  const data = snap.data();

  const currentStreak =
    typeof data.streakCount === "number" ? data.streakCount : 0;

  const lastReviewDate =
    data.lastReviewDate instanceof Timestamp
      ? data.lastReviewDate.toDate()
      : null;

  let nextStreak = 1;

  if (lastReviewDate) {
    if (isSameDay(lastReviewDate, today)) {
      nextStreak = currentStreak;
    } else if (isYesterday(lastReviewDate, today)) {
      nextStreak = currentStreak + 1;
    } else {
      nextStreak = 1;
    }
  }

  await updateDoc(userRef, {
    streakCount: nextStreak,
    lastReviewDate: Timestamp.fromDate(today),
    updatedAt: serverTimestamp(),
  });

  return nextStreak;
}
