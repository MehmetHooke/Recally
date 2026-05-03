import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import * as admin from "firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { setGlobalOptions } from "firebase-functions/v2";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
dotenv.config();

admin.initializeApp();

setGlobalOptions({
  region: "us-central1",
  timeoutSeconds: 300,
  memory: "1GiB",
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const firestore = admin.firestore();

type AppLanguage = "tr" | "en";

function normalizeLanguage(language: unknown): AppLanguage {
  return language === "tr" ? "tr" : "en";
}

function getLanguageInstruction(language: AppLanguage) {
  return language === "tr"
    ? "Return ONLY entirely in Turkish. All user-facing fields must be Turkish."
    : "Return ONLY entirely in English. All user-facing fields must be English.";
}

type GeneratedSummary = {
  overview: string;
  sections: {
    title: string;
    description: string;
    bullets: string[];
  }[];
  keyTakeaways: string[];
};

type GeneratedMcqCard = {
  question: string;
  options: string[];
  correctIndex: number;
  answer: string;
  explanation: string;
  wrongExplanations: string[];
};

function getDefaultYoutubeSetTitle(language: AppLanguage) {
  return language === "tr" ? "YouTube Çalışma Seti" : "YouTube Study Set";
}

function cleanTitleText(value: string) {
  return value
    .replace(/^["'`]+|["'`]+$/g, "")
    .replace(/^(title|baslik)\s*[:\-]\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function countTitleWords(value: string) {
  return (value.match(/[^\s]+/g) || []).length;
}

function isPlaceholderYoutubeTitle(value: string) {
  const normalized = value
    .toLocaleLowerCase("en-US")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const blockedExactTitles = new Set([
    "youtube study set",
    "youtube calisma seti",
    "study set",
    "calisma seti",
    "video study set",
    "video calisma seti",
    "youtube video",
    "video",
    "title",
    "short useful title",
    "placeholder",
    "untitled",
    "video could not be analyzed",
  ]);

  if (!normalized || blockedExactTitles.has(normalized)) {
    return true;
  }

  const blockedFragments = [
    "placeholder",
    "generic title",
    "insert title",
    "write title",
    "study set",
    "calisma seti",
    "could not be analyzed",
  ];

  return blockedFragments.some((fragment) => normalized.includes(fragment));
}

function normalizeGeneratedTitle(title: unknown) {
  if (typeof title !== "string") {
    return null;
  }

  const cleaned = cleanTitleText(title);
  const wordCount = countTitleWords(cleaned);

  if (!cleaned || wordCount < 3 || wordCount > 8) {
    return null;
  }

  if (isPlaceholderYoutubeTitle(cleaned)) {
    return null;
  }

  return cleaned;
}

function buildYoutubeTitleFromContent(parsed: any, language: AppLanguage) {
  const directTitle = normalizeGeneratedTitle(parsed?.title);
  if (directTitle) {
    return directTitle;
  }

  const sectionTitles = Array.isArray(parsed?.summary?.sections)
    ? parsed.summary.sections.map((section: any) => section?.title)
    : [];

  for (const sectionTitle of sectionTitles) {
    const normalizedSectionTitle = normalizeGeneratedTitle(sectionTitle);
    if (normalizedSectionTitle) {
      return normalizedSectionTitle;
    }
  }

  const keyConcepts = Array.isArray(parsed?.keyConcepts)
    ? parsed.keyConcepts
        .filter((concept: unknown) => typeof concept === "string")
        .map((concept: string) => cleanTitleText(concept))
        .filter(Boolean)
    : [];

  if (keyConcepts.length >= 2) {
    const combinedTitle = normalizeGeneratedTitle(
      `${keyConcepts[0]} ${language === "tr" ? "ve" : "and"} ${keyConcepts[1]}`,
    );

    if (combinedTitle) {
      return combinedTitle;
    }
  }

  return getDefaultYoutubeSetTitle(language);
}

function getYoutubePrompt(language: AppLanguage) {
  return `
You are an expert learning designer.


Analyze the YouTube video provided as video input.

Your goal:
Create a learning experience where the user first reads a clear summary, then can answer quiz questions from that summary.

IMPORTANT RULES:
- The summary must teach enough information to answer the quiz cards.
- Do not create questions that are not covered in the summary.
- Create exactly 6 multiple-choice cards.
- Each card must have exactly 4 options.
- The "title" field is required and must describe the video's actual study topic.
- The title must be specific, meaningful, and useful as a saved learning-library title.
- The title must be 3-8 words long.
- The title must NOT be generic, vague, or placeholder text.
- The title must NOT be any variation of: "YouTube Study Set", "YouTube Çalışma Seti", "Study Set", "Video Title", "Untitled", or "Short useful title".
- The title must NOT mention YouTube unless the video itself is about YouTube.
- correctIndex must be a number: 0, 1, 2, or 3.
- answer must be exactly the same text as options[correctIndex].
- wrongExplanations must have exactly 4 strings.
- For the correct option, wrongExplanations[correctIndex] can be an empty string.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not wrap the response in code fences.
-${getLanguageInstruction(language)}

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
${getLanguageInstruction(language)}

{
  "ok": true,
  "title": "Specific topic-based title",
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

Before returning the JSON, verify that title is content-specific, non-generic, and 3-8 words long. If it is vague or placeholder-like, rewrite it so it names the real subject of the video.
`;
}

function normalizeYoutubeUrl(youtubeUrl: unknown) {
  if (typeof youtubeUrl !== "string" || !youtubeUrl.trim()) {
    throw new HttpsError("invalid-argument", "youtubeUrl alanı gerekli");
  }

  return youtubeUrl.trim();
}

function getSetRef(uid: string, setId: string) {
  return firestore.collection("users").doc(uid).collection("sets").doc(setId);
}

function getReadableErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    if (error.message === "VIDEO_NOT_ACCESSIBLE") {
      return "Video işlenemedi. Video erişimi doğrulanamadı.";
    }

    return error.message;
  }

  return "Video işlenirken hata oluştu.";
}

async function generateYoutubeContent(
  youtubeUrl: string,
  language: AppLanguage,
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
  });

  const result = await model.generateContent([
    {
      fileData: {
        fileUri: youtubeUrl,
        mimeType: "video/*",
      },
    },
    {
      text: getYoutubePrompt(language),
    },
  ]);

  const responseText = result.response.text();
  const cleanText = responseText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleanText);

  if (parsed.ok === false) {
    throw new Error(parsed.error || "VIDEO_NOT_ACCESSIBLE");
  }

  const cards = Array.isArray(parsed.cards) ? parsed.cards : [];

  const normalizedCards: GeneratedMcqCard[] = cards
    .slice(0, 6)
    .map((card: any) => {
      const options = Array.isArray(card.options)
        ? card.options.slice(0, 4)
        : [];

      while (options.length < 4) {
        options.push("");
      }

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

  const normalizedTitle = buildYoutubeTitleFromContent(parsed, language);

  return {
    title: normalizedTitle,
    summary: (parsed.summary || {
      overview: "",
      sections: [],
      keyTakeaways: [],
    }) as GeneratedSummary,
    keyConcepts: Array.isArray(parsed.keyConcepts) ? parsed.keyConcepts : [],
    cards: normalizedCards,
  };
}

async function writeSetCards(
  uid: string,
  setId: string,
  cards: GeneratedMcqCard[],
) {
  const batch = firestore.batch();
  const cardsCollection = getSetRef(uid, setId).collection("cards");
  const now = Timestamp.now();

  cards.forEach((card, index) => {
    const cardRef = cardsCollection.doc(`card_${index + 1}`);

    batch.set(cardRef, {
      question: card.question,
      answer: card.answer,
      explanation: card.explanation,
      options: card.options,
      correctIndex: card.correctIndex,
      wrongExplanations: card.wrongExplanations,
      cardType: "mcq",
      status: "new",
      intervalDays: 0,
      reviewCount: 0,
      knewCount: 0,
      forgotCount: 0,
      lastReviewedAt: null,
      nextReviewAt: now,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
}

export const generateCards = onCall(async (request) => {
  const text = request.data?.text;
  const title = request.data?.title;
  const language = normalizeLanguage(request.data?.language);

  console.log("[generateCards] request received", {
    hasText: typeof text === "string" && text.length > 0,
    title,
  });

  console.log("[generateCards] language", {
    raw: request.data?.language,
    normalized: language,
  });

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
${getLanguageInstruction(language)}
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
    const cleanText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleanText);

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
  const youtubeUrl = normalizeYoutubeUrl(request.data?.youtubeUrl);
  const language = normalizeLanguage(request.data?.language);
  console.log("[generateCardsYoutube] request received", {
    youtubeUrl,
  });

  console.log("[generateCardsYoutube] language", {
    raw: request.data?.language,
    normalized: language,
  });

  try {
    const parsed = await generateYoutubeContent(youtubeUrl, language);

    return {
      ok: true,
      title: parsed.title,
      summary: parsed.summary,
      keyConcepts: parsed.keyConcepts,
      cards: parsed.cards,
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

export const createYoutubeSetJob = onCall(
  {
    region: "us-central1",
    timeoutSeconds: 300,
    memory: "1GiB",
  },
  async (request) => {
    const uid = request.auth?.uid;

    console.log("[createYoutubeSetJob] request received", {
      uid,
      youtubeUrl: request.data?.youtubeUrl,
    });

    if (!uid) {
      throw new HttpsError("unauthenticated", "Kullanıcı bulunamadı");
    }
    const language = normalizeLanguage(request.data?.language);
    const youtubeUrl = normalizeYoutubeUrl(request.data?.youtubeUrl);
    const setRef = firestore
      .collection("users")
      .doc(uid)
      .collection("sets")
      .doc();

    console.log("[createYoutubeSetJob] language", {
      raw: request.data?.language,
      normalized: language,
    });
    await setRef.set({
      title: language === "tr" ? "Video hazırlanıyor..." : "Preparing video...",
      sourceType: "youtube",
      sourceText: youtubeUrl,
      language,
      status: "processing",
      summary: null,
      keyConcepts: [],
      cards: [],
      cardCount: 0,
      totalCards: 0,
      masteredCount: 0,
      dueCount: 0,
      errorMessage: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      ok: true,
      setId: setRef.id,
    };
  },
);

export const processYoutubeSetJob = onDocumentCreated(
  {
    document: "users/{uid}/sets/{setId}",
    region: "us-central1",
    timeoutSeconds: 300,
    memory: "1GiB",
  },
  async (event) => {
    const snapshot = event.data;

    if (!snapshot) {
      console.warn("[processYoutubeSetJob] no snapshot in event");
      return;
    }

    const uid = event.params.uid;
    const setId = event.params.setId;
    const data = snapshot.data();

    const language = normalizeLanguage(data.language);

    console.log("[processYoutubeSetJob] language", {
      raw: data.language,
      normalized: language,
    });
    console.log("[processYoutubeSetJob] triggered", {
      uid,
      setId,
      sourceType: data?.sourceType,
      status: data?.status,
    });

    if (data?.sourceType !== "youtube" || data?.status !== "processing") {
      return;
    }

    const setRef = getSetRef(uid, setId);

    try {
      const language = normalizeLanguage(data.language);
      const parsed = await generateYoutubeContent(data.sourceText, language);
      await writeSetCards(uid, setId, parsed.cards);

      await setRef.update({
        status: "completed",
        title: parsed.title || getDefaultYoutubeSetTitle(language),
        summary: parsed.summary,
        keyConcepts: parsed.keyConcepts,
        cards: parsed.cards,
        cardCount: parsed.cards.length,
        totalCards: parsed.cards.length,
        dueCount: parsed.cards.length,
        masteredCount: 0,
        errorMessage: null,
        updatedAt: FieldValue.serverTimestamp(),
        completedAt: FieldValue.serverTimestamp(),
      });

      console.log("[processYoutubeSetJob] completed", {
        uid,
        setId,
        cardCount: parsed.cards.length,
      });
    } catch (error) {
      console.error("PROCESS YOUTUBE SET JOB ERROR:", error);

      await setRef.update({
        status: "failed",
        errorMessage: getReadableErrorMessage(error),
        updatedAt: FieldValue.serverTimestamp(),
        failedAt: FieldValue.serverTimestamp(),
      });
    }
  },
);

//--------------------TEXT INPUT-------------------------------

type GeneratedTextCard = {
  question: string;
  answer: string;
  explanation: string;
};

function getDefaultTextSetTitle(language: AppLanguage) {
  return language === "tr" ? "Metin Çalışma Seti" : "Text Study Set";
}

function normalizeTextInput(text: unknown) {
  if (typeof text !== "string" || !text.trim()) {
    throw new HttpsError("invalid-argument", "text alanı gerekli");
  }

  return text.trim();
}

async function generateTextContent(text: string, language: AppLanguage) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
  });

  const prompt = `
You are an expert learning designer.

Given the following study content:
"""
${text}
"""

Create a learning set from this content.

Rules:
- Return ONLY valid JSON.
- Do not use markdown.
- Do not wrap response in code fences.
- Create exactly 6 flashcards.
- The title must be specific, meaningful, and 3-8 words long.
- ${getLanguageInstruction(language)}

Return this JSON structure:
{
  "ok": true,
  "title": "Specific study topic title",
  "summary": {
    "overview": "A short 3-5 sentence overview.",
    "sections": [
      {
        "title": "Section title",
        "description": "Short explanation.",
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
      "answer": "Answer text.",
      "explanation": "Short explanation."
    }
  ]
}
`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const cleanText = responseText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleanText);

  const cards: GeneratedTextCard[] = Array.isArray(parsed.cards)
    ? parsed.cards.slice(0, 6).map((card: any) => ({
        question: card.question || "",
        answer: card.answer || "",
        explanation: card.explanation || "",
      }))
    : [];

  return {
    title:
      normalizeGeneratedTitle(parsed.title) || getDefaultTextSetTitle(language),
    summary: parsed.summary || {
      overview: "",
      sections: [],
      keyTakeaways: [],
    },
    keyConcepts: Array.isArray(parsed.keyConcepts) ? parsed.keyConcepts : [],
    cards,
  };
}

async function writeTextSetCards(
  uid: string,
  setId: string,
  cards: GeneratedTextCard[],
) {
  const batch = firestore.batch();
  const cardsCollection = getSetRef(uid, setId).collection("cards");
  const now = Timestamp.now();

  cards.forEach((card, index) => {
    const cardRef = cardsCollection.doc(`card_${index + 1}`);

    batch.set(cardRef, {
      question: card.question,
      answer: card.answer,
      explanation: card.explanation,
      cardType: "basic",
      status: "new",
      intervalDays: 0,
      reviewCount: 0,
      knewCount: 0,
      forgotCount: 0,
      lastReviewedAt: null,
      nextReviewAt: now,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
}

export const createTextSetJob = onCall(
  {
    region: "us-central1",
    timeoutSeconds: 300,
    memory: "1GiB",
  },
  async (request) => {
    const uid = request.auth?.uid;

    if (!uid) {
      throw new HttpsError("unauthenticated", "Kullanıcı bulunamadı");
    }

    const language = normalizeLanguage(request.data?.language);
    const text = normalizeTextInput(request.data?.text);

    const setRef = firestore
      .collection("users")
      .doc(uid)
      .collection("sets")
      .doc();

    await setRef.set({
      title: language === "tr" ? "Metin hazırlanıyor..." : "Preparing text...",
      sourceType: "text",
      sourceText: text,
      language,
      status: "processing",
      summary: null,
      keyConcepts: [],
      cards: [],
      cardCount: 0,
      totalCards: 0,
      masteredCount: 0,
      dueCount: 0,
      errorMessage: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      ok: true,
      setId: setRef.id,
    };
  },
);

export const processTextSetJob = onDocumentCreated(
  {
    document: "users/{uid}/sets/{setId}",
    region: "us-central1",
    timeoutSeconds: 300,
    memory: "1GiB",
  },
  async (event) => {
    const snapshot = event.data;

    if (!snapshot) return;

    const uid = event.params.uid;
    const setId = event.params.setId;
    const data = snapshot.data();

    if (data?.sourceType !== "text" || data?.status !== "processing") {
      return;
    }

    const setRef = getSetRef(uid, setId);

    try {
      const language = normalizeLanguage(data.language);
      const parsed = await generateTextContent(data.sourceText, language);

      await writeTextSetCards(uid, setId, parsed.cards);

      await setRef.update({
        status: "completed",
        title: parsed.title,
        summary: parsed.summary,
        keyConcepts: parsed.keyConcepts,
        cards: parsed.cards,
        cardCount: parsed.cards.length,
        totalCards: parsed.cards.length,
        dueCount: parsed.cards.length,
        masteredCount: 0,
        errorMessage: null,
        updatedAt: FieldValue.serverTimestamp(),
        completedAt: FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error("PROCESS TEXT SET JOB ERROR:", error);

      await setRef.update({
        status: "failed",
        errorMessage:
          error instanceof Error
            ? error.message
            : "Metin işlenirken hata oluştu.",
        updatedAt: FieldValue.serverTimestamp(),
        failedAt: FieldValue.serverTimestamp(),
      });
    }
  },
);
