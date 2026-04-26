import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";

export async function sendResetPasswordEmail(email: string) {
  if (!email.trim()) {
    throw new Error("Email gerekli.");
  }

  await sendPasswordResetEmail(auth, email.trim());
}
