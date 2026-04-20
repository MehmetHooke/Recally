import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function testFirestoreConnection() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Kullanıcı giriş yapmamış.");
  }

  const uid = user.uid;
  console.log("TEST UID:", uid);

  const userRef = doc(db, "users", uid);

  await setDoc(
    userRef,
    {
      email: user.email ?? null,
      testMessage: "Firestore bağlantısı başarılı",
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    throw new Error("Veri yazıldı ama okunamadı.");
  }

  console.log("FIRESTORE DATA:", snapshot.data());

  return {
    uid,
    data: snapshot.data(),
  };
}
