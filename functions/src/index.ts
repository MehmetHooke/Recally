import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import { setGlobalOptions } from "firebase-functions/v2";
import { HttpsError, onCall } from "firebase-functions/v2/https";
dotenv.config();

setGlobalOptions({
  region: "us-central1",
  timeoutSeconds: 120,
  memory: "512MiB",
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateCards = onCall(async (request) => {
  const text = request.data?.text;
  const title = request.data?.title;

  if (!text || typeof text !== "string") {
    throw new HttpsError("invalid-argument", "text alanı gerekli");
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const prompt = `
You are an educational content processor.

Given the following content:

"${text}"

1. Write a short summary
2. Extract key concepts
3. Create 6 flashcards

Each flashcard must include:
- question
- answer
- explanation

Return ONLY valid JSON in this format:

{
  "summary": "...",
  "keyConcepts": ["...", "..."],
  "cards": [
    {
      "question": "...",
      "answer": "...",
      "explanation": "..."
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let cleanText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleanText);
    // JSON parse etmeye çalış
    //const parsed = JSON.parse(responseText);

    return {
      ok: true,
      title: title || "Untitled",
      ...parsed,
    };
  } catch (error: any) {
    console.error("AI ERROR:", error);

    throw new HttpsError("internal", "AI processing failed", error.message);
  }
});
