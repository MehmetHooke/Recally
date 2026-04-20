import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

type TestFunctionResponse = {
  ok: boolean;
  receivedText: string;
  message: string;
};

export async function callTestFunction(text: string) {
  const fn = httpsCallable<{ text: string }, TestFunctionResponse>(
    functions,
    "testFunction",
  );

  const result = await fn({ text });
  return result.data;
}
