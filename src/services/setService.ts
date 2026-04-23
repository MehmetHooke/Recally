import { collection, getDocs, orderBy, query } from "firebase/firestore";
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
