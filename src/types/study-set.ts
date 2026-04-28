import type {
  GeneratedMcqCard,
  GeneratedSummary,
} from "@/src/services/functions";

export type SetStatus = "processing" | "completed" | "failed";

export type SourceType = "youtube" | "text";

export type StudySet = {
  id: string;
  title: string;
  sourceType: SourceType;
  sourceText: string;
  status: SetStatus;
  summary: string | GeneratedSummary | null;
  keyConcepts: string[];
  cards: GeneratedMcqCard[];
  cardCount: number;
  totalCards?: number;
  masteredCount?: number;
  dueCount?: number;

  learningCount?: number;
  newCount?: number;
  reviewedCount?: number;
  reviewProgress?: number;
  masteryProgress?: number;

  errorMessage?: string | null;
  createdAt?: any;
  updatedAt?: any;
  completedAt?: any;
  failedAt?: any;
};
