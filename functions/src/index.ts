import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import { setGlobalOptions } from "firebase-functions/v2";
import { HttpsError, onCall } from "firebase-functions/v2/https";
dotenv.config();

setGlobalOptions({
  region: "us-central1",
  timeoutSeconds: 300,
  memory: "1GiB",
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

  if (!youtubeUrl || typeof youtubeUrl !== "string") {
    throw new HttpsError("invalid-argument", "youtubeUrl alanı gerekli");
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const prompt = `
You are an expert learning designer.

Analyze the YouTube video provided as video input.

Your goal:
Create a learning experience where the user first reads a clear summary, then can answer quiz questions from that summary.

IMPORTANT RULES:
- The summary must teach enough information to answer the quiz cards.
- Do not create questions that are not covered in the summary.
- Create exactly 6 multiple-choice cards.
- Each card must have exactly 4 options.
- correctIndex must be a number: 0, 1, 2, or 3.
- answer must be exactly the same text as options[correctIndex].
- wrongExplanations must have exactly 4 strings.
- For the correct option, wrongExplanations[correctIndex] can be an empty string.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not wrap the response in code fences.

If you cannot access or understand the actual video content, return ONLY this JSON:
{
  "ok": false,
  "error": "VIDEO_NOT_ACCESSIBLE",
  "title": "Video could not be analyzed",
  "summary": {
    "overview": "",
    "sections": [],
    "keyTakeaways": []
  },
  "keyConcepts": [],
  "cards": []
}

Return this exact JSON structure:

{
  "ok": true,
  "title": "Short useful title",
  "summary": {
    "overview": "A short 3-5 sentence overview of the video.",
    "sections": [
      {
        "title": "Section title",
        "description": "Short explanation of this section.",
        "bullets": [
          "Important point 1",
          "Important point 2",
          "Important point 3"
        ]
      }
    ],
    "keyTakeaways": [
      "Main takeaway 1",
      "Main takeaway 2",
      "Main takeaway 3"
    ]
  },
  "keyConcepts": [
    "Concept 1",
    "Concept 2",
    "Concept 3"
  ],
  "cards": [
    {
      "question": "Question text?",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctIndex": 0,
      "answer": "Option A",
      "explanation": "Why the correct answer is correct.",
      "wrongExplanations": [
        "",
        "Why option B is wrong.",
        "Why option C is wrong.",
        "Why option D is wrong."
      ]
    }
  ]
}
`;

    const result = await model.generateContent([
      {
        fileData: {
          fileUri: youtubeUrl,
          mimeType: "video/*",
        },
      },
      {
        text: prompt,
      },
    ]);

    const responseText = result.response.text();

    console.log("RAW YOUTUBE GEMINI RESPONSE:", responseText);

    const cleanText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleanText);

    console.log("PARSED YOUTUBE GEMINI RESPONSE:", parsed);

    if (parsed.ok === false) {
      return {
        ok: false,
        error: parsed.error || "VIDEO_NOT_ACCESSIBLE",
        title: parsed.title || "Video could not be analyzed",
        summary: parsed.summary || {
          overview: "",
          sections: [],
          keyTakeaways: [],
        },
        keyConcepts: parsed.keyConcepts || [],
        cards: [],
      };
    }

    const cards = Array.isArray(parsed.cards) ? parsed.cards : [];

    const normalizedCards = cards.slice(0, 6).map((card: any) => {
      const options = Array.isArray(card.options)
        ? card.options.slice(0, 4)
        : [];

      const correctIndex =
        typeof card.correctIndex === "number" &&
        card.correctIndex >= 0 &&
        card.correctIndex <= 3
          ? card.correctIndex
          : 0;

      const answer = options[correctIndex] || card.answer || "";

      const wrongExplanations = Array.isArray(card.wrongExplanations)
        ? card.wrongExplanations.slice(0, 4)
        : ["", "", "", ""];

      while (wrongExplanations.length < 4) {
        wrongExplanations.push("");
      }

      return {
        question: card.question || "",
        options,
        correctIndex,
        answer,
        explanation: card.explanation || "",
        wrongExplanations,
      };
    });

    return {
      ok: true,
      title: parsed.title || "YouTube Study Set",
      summary: parsed.summary || {
        overview: "",
        sections: [],
        keyTakeaways: [],
      },
      keyConcepts: Array.isArray(parsed.keyConcepts) ? parsed.keyConcepts : [],
      cards: normalizedCards,
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
