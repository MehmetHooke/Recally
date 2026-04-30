import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db } from "./firebase";

export const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const user = userCredential.user;

  const displayName = firstName.trim();

  await updateProfile(user, {
    displayName,
  });

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    displayName,
    email: user.email,
    plan: "free",
    streakCount: 0,
    language: "tr",
    reminderTime: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return userCredential;
};

export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};
