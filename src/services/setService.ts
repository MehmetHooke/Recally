import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export async function createSet(title: string, sourceText: string) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Kullanıcı giriş yapmamış.");
  }

  if (!title.trim()) {
    throw new Error("Başlık boş olamaz.");
  }

  if (!sourceText.trim()) {
    throw new Error("İçerik boş olamaz.");
  }

  const uid = user.uid;
  const setsRef = collection(db, "users", uid, "sets");

  const docRef = await addDoc(setsRef, {
    title: title.trim(),
    sourceType: "text",
    sourceText: sourceText.trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getSets() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Kullanıcı giriş yapmamış.");
  }

  const uid = user.uid;

  const setsRef = collection(db, "users", uid, "sets");
  const q = query(setsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
