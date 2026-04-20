import { setGlobalOptions } from "firebase-functions/v2";
import { HttpsError, onCall } from "firebase-functions/v2/https";

setGlobalOptions({ region: "us-central1" });

export const testFunction = onCall(async (request) => {
  const text = request.data?.text;

  if (!text || typeof text !== "string") {
    throw new HttpsError("invalid-argument", "text alanı gerekli");
  }

  return {
    ok: true,
    receivedText: text,
    message: `Function çalıştı: ${text}`,
  };
});
