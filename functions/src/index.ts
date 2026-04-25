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

export const generateCardsYoutube = onCall(async (request) => {
  const youtubeUrl = request.data?.youtubeUrl;

  console.log("🔥 generateCardsYoutube CALLED");
  console.log("YOUTUBE URL:", youtubeUrl);
  console.log("VERSION:", "youtube-v1");

  if (!youtubeUrl || typeof youtubeUrl !== "string") {
    throw new HttpsError("invalid-argument", "youtubeUrl alanı gerekli");
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const prompt = `
You are an educational flashcard generator.

Your task:
Analyze ONLY the actual content of this YouTube video.

Very important rules:
- Do NOT guess the topic from the title, URL, thumbnail, or general knowledge.
- Do NOT create generic educational content.
- Do NOT invent facts if you cannot access or understand the video content.
- If you cannot access the video, transcript, audio, or meaningful content, return ok:false.
- If the video content is accessible, generate flashcards strictly based on what is explained in the video.

Return ONLY valid JSON. No markdown. No extra text.

JSON format:

If you can analyze the video:
{
  "ok": true,
  "title": "A short title based on the real video content",
  "summary": "A clear summary of the actual video content in 3-5 sentences.",
  "keyConcepts": [
    "concept 1",
    "concept 2",
    "concept 3"
  ],
  "cards": [
    {
      "question": "Question based only on the video",
      "answer": "Short answer based only on the video",
      "explanation": "Explanation based only on the video"
    }
  ]
}

If you cannot analyze the video:
{
  "ok": false,
  "error": {
    "code": "VIDEO_CONTENT_NOT_ACCESSIBLE",
    "message": "I could not access or understand the actual YouTube video content."
  }
}

Card rules:
- Generate 8 to 12 cards.
- Questions must test understanding, not random trivia.
- Each card must be directly supported by the video.
- Keep answers short but useful.
- Explanations should help the learner remember the concept.
`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: "video/*",
                fileUri: youtubeUrl,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
    });
    const responseText = result.response.text();
    console.log("Raw Gemini response:", responseText);

    const cleanText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleanText);
    console.log("Parsed Gemini response:", parsed);

    if (parsed.ok === false) {
      return parsed;
    }

    return {
      ok: true,
      title: parsed.title || "YouTube Study Set",
      summary: parsed.summary,
      keyConcepts: parsed.keyConcepts || [],
      cards: parsed.cards || [],
    };
  } catch (error: any) {
    console.error("YOUTUBE AI ERROR:", error);
    throw new HttpsError(
      "internal",
      "YouTube AI processing failed",
      error.message,
    );
  }
});
